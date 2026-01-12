import { NextRequest, NextResponse } from 'next/server';

const BROCHURE_PUBLIC_PATH = '/brochures/renes-luxury-brochure.pdf';

function isEmail(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  const s = v.trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = body?.email;
    const tourSlug = typeof body?.tourSlug === 'string' ? body.tourSlug : '';
    const tourTitle = typeof body?.tourTitle === 'string' ? body.tourTitle : '';

    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Track download intent (reuse existing tracking endpoint)
    try {
      const baseUrl = new URL(request.url);
      await fetch(new URL('/api/track-brochure', baseUrl), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          tourSlug,
          tourTitle,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // no-op: tracking must never block download
    }

    // Verify brochure exists (avoid 404s being treated as success)
    try {
      const baseUrl = new URL(request.url);
      const res = await fetch(new URL(BROCHURE_PUBLIC_PATH, baseUrl), { method: 'HEAD' });
      if (!res.ok) {
        return NextResponse.json(
          {
            error: 'Brochure file not found',
            expectedPublicPath: BROCHURE_PUBLIC_PATH,
          },
          { status: 404 }
        );
      }
    } catch {
      // If HEAD can't be verified (edge cases), still return the URL.
    }

    return NextResponse.json({ downloadUrl: BROCHURE_PUBLIC_PATH });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
