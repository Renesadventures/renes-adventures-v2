import { NextRequest, NextResponse } from 'next/server';
import { generateImage, replicateConfigured } from '@/lib/replicate';
import { imagePromptFor } from '@/lib/content/social';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  if (!replicateConfigured()) {
    return NextResponse.json(
      { error: 'Replicate not configured. Add REPLICATE_API_TOKEN to enable image generation.' },
      { status: 503 },
    );
  }
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const tourSlug = typeof body.tourSlug === 'string' ? body.tourSlug : 'custom-charter';
  const angle = typeof body.angle === 'string' ? body.angle : 'The private-boat difference';
  const prompt = typeof body.prompt === 'string' && body.prompt.trim()
    ? body.prompt
    : imagePromptFor(tourSlug, angle);

  try {
    const url = await generateImage(prompt);
    return NextResponse.json({ url, prompt });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('image error:', message);
    return NextResponse.json({ error: `Image generation failed: ${message}` }, { status: 500 });
  }
}
