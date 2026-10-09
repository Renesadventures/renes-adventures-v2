import { NextRequest, NextResponse, after } from 'next/server';
import { createLead } from '@/lib/liadesk';
import { draftAndAttach } from '@/lib/lia-brain/draft';

const BROCHURE_PUBLIC_PATH = '/brochures/renes-luxury-brochure.pdf';

function isEmail(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  const s = v.trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * Brochure download.
 *
 * Somebody who hands over their email for a luxury charter brochure is one of
 * the warmest signals this site produces, and until now that name went nowhere
 * Rene could see. It now creates a CRM lead.
 *
 * Order matters: the download is never blocked. If Lia Desk is unreachable the
 * visitor still gets their brochure and the failure is logged for us.
 */
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

    // Lia Desk — the system of record.
    try {
      const lead = await createLead({
        name: name || email,
        email,
        interest: tourTitle || 'Luxury brochure',
        message: 'Downloaded the luxury brochure.',
        source: 'Website',
        extra: { tourSlug, tourTitle },
      });
      if (!lead.ok) {
        console.error('[brochure] Lia Desk rejected a lead:', lead.error, { email });
      } else if (lead.leadId) {
        // Somebody who hands over an email for a charter brochure is as warm
        // as this site gets. Lia drafts the follow-up; a person sends it.
        const leadId = lead.leadId;
        after(async () => {
          await draftAndAttach(leadId, {
            kind: 'form',
            name: name || undefined,
            email,
            body: `Downloaded the luxury brochure${tourTitle ? ` from the ${tourTitle} page` : ''}.`,
            facts: { 'Looking at': tourTitle, Tour: tourSlug },
          });
        });
      }
    } catch (err) {
      console.error('[brochure] Lia Desk threw (non-fatal):', err);
    }

    // Existing tracking. Must never block the download.
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

    // Verify the brochure exists, so a 404 is not reported as success.
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
