import { NextRequest, NextResponse } from 'next/server';
import { generateReel, replicateConfigured } from '@/lib/replicate';
import { footageForTour, imagePromptFor } from '@/lib/content/social';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const tourSlug = typeof body.tourSlug === 'string' ? body.tourSlug : 'custom-charter';
  const angle = typeof body.angle === 'string' ? body.angle : 'cinematic Belize charter';
  const mode = body.mode === 'ai' ? 'ai' : 'footage';

  // Authentic path: real footage from the R2 library (works today, no token).
  if (mode === 'footage' || !replicateConfigured()) {
    const clips = footageForTour(tourSlug);
    return NextResponse.json({
      source: 'footage',
      clips,
      primary: clips[0],
      note: replicateConfigured()
        ? 'Using real R2 footage. Set mode:"ai" to generate with Replicate instead.'
        : 'Replicate not configured — served real R2 footage. Add REPLICATE_API_TOKEN for AI reels.',
    });
  }

  // AI path: generate a short vertical clip with Replicate.
  try {
    const prompt = typeof body.prompt === 'string' && body.prompt.trim()
      ? body.prompt
      : imagePromptFor(tourSlug, angle);
    const url = await generateReel(prompt);
    return NextResponse.json({ source: 'ai', url, prompt });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('reel error:', message);
    return NextResponse.json({ error: `Reel generation failed: ${message}` }, { status: 500 });
  }
}
