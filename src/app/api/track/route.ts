import { NextRequest, NextResponse } from 'next/server';
import { sendCapiEvent, metaCookies, capiConfigured } from '@/lib/analytics/meta-capi';

/**
 * The browser's events, forwarded to Meta from our own server.
 *
 * The pixel in the browser already fired this event. This is the second,
 * server-sent copy that survives ad blockers and Safari. They share an
 * eventId so Meta keeps exactly one.
 *
 * Deliberately open (no auth): it is the website's own pages calling it, and
 * the only thing a stranger could do is add noise to an ad account. Nothing
 * here writes to the CRM, reads a record, or costs money. The event name is
 * checked against a fixed list so it cannot be used to post arbitrary data.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Our event names mapped to Meta's. Anything not on this list is dropped. */
const ALLOWED: Record<string, string> = {
  lead: 'Lead',
  chat_message: 'Contact',
  chat_handoff: 'Contact',
  whatsapp_click: 'Contact',
  phone_click: 'Contact',
  booking_started: 'InitiateCheckout',
  checkout_started: 'InitiateCheckout',
  purchase: 'Purchase',
  brochure_download: 'Lead',
};

export async function POST(req: NextRequest) {
  if (!capiConfigured()) {
    // Not an error. The site runs perfectly well unmeasured; it just learns
    // nothing. Returning 200 keeps the browser quiet.
    return NextResponse.json({ ok: true, sent: false });
  }

  let body: {
    event?: string;
    eventId?: string;
    value?: number;
    currency?: string;
    item?: string;
    url?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const metaName = body.event ? ALLOWED[body.event] : undefined;
  if (!metaName || !body.eventId) {
    return NextResponse.json({ ok: false, error: 'unknown event' }, { status: 400 });
  }

  const { fbp, fbc } = metaCookies(req.headers.get('cookie'));

  const result = await sendCapiEvent({
    name: metaName,
    eventId: String(body.eventId).slice(0, 100),
    sourceUrl: typeof body.url === 'string' ? body.url.slice(0, 500) : undefined,
    fbp,
    fbc,
    clientIp: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
    userAgent: req.headers.get('user-agent') ?? undefined,
    value: typeof body.value === 'number' ? body.value : undefined,
    currency: typeof body.currency === 'string' ? body.currency : undefined,
    contentName: typeof body.item === 'string' ? body.item.slice(0, 120) : undefined,
  });

  if (!result.ok && result.error !== 'no user data to match on') {
    console.error('[track] Conversions API rejected an event', body.event, result.error);
  }

  return NextResponse.json({ ok: true, sent: result.ok });
}
