import { NextRequest, NextResponse } from 'next/server';
import { sendCapiEvent, metaCookies, capiConfigured } from '@/lib/analytics/meta-capi';
import { sendTikTokEvent, tiktokCookies, tiktokConfigured } from '@/lib/analytics/tiktok-events';

/**
 * The browser's events, forwarded to Meta and TikTok from our own server.
 *
 * The pixels in the browser already fired this event. This is the second,
 * server-sent copy that survives ad blockers and Safari. Both copies share an
 * eventId, so each platform keeps exactly one.
 *
 * Either destination can be unconfigured and the other still works; with
 * neither configured this is a no-op that answers 200.
 *
 * Deliberately open (no auth): it is the website's own pages calling it, and
 * the only thing a stranger could do is add noise to an ad account. Nothing
 * here writes to the CRM, reads a record, or costs money. The event name is
 * checked against a fixed list so it cannot be used to post arbitrary data.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Our event names mapped to each platform's. Anything not on this list is
 * dropped. The two columns differ on purpose: TikTok has no 'Lead', it has
 * 'SubmitForm', and a name a platform does not recognise is a far weaker
 * optimisation target than one it does.
 */
const ALLOWED: Record<string, { meta: string; tiktok: string }> = {
  lead: { meta: 'Lead', tiktok: 'SubmitForm' },
  chat_message: { meta: 'Contact', tiktok: 'Contact' },
  chat_handoff: { meta: 'Contact', tiktok: 'Contact' },
  whatsapp_click: { meta: 'Contact', tiktok: 'Contact' },
  phone_click: { meta: 'Contact', tiktok: 'Contact' },
  booking_started: { meta: 'InitiateCheckout', tiktok: 'InitiateCheckout' },
  checkout_started: { meta: 'InitiateCheckout', tiktok: 'InitiateCheckout' },
  purchase: { meta: 'Purchase', tiktok: 'CompletePayment' },
  brochure_download: { meta: 'Lead', tiktok: 'Download' },
};

export async function POST(req: NextRequest) {
  const meta = capiConfigured();
  const tiktok = tiktokConfigured();
  if (!meta && !tiktok) {
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

  const names = body.event ? ALLOWED[body.event] : undefined;
  if (!names || !body.eventId) {
    return NextResponse.json({ ok: false, error: 'unknown event' }, { status: 400 });
  }

  const cookie = req.headers.get('cookie');
  const shared = {
    eventId: String(body.eventId).slice(0, 100),
    sourceUrl: typeof body.url === 'string' ? body.url.slice(0, 500) : undefined,
    clientIp: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
    userAgent: req.headers.get('user-agent') ?? undefined,
    value: typeof body.value === 'number' ? body.value : undefined,
    currency: typeof body.currency === 'string' ? body.currency : undefined,
    contentName: typeof body.item === 'string' ? body.item.slice(0, 120) : undefined,
  };

  // Both legs at once: one slow platform must not hold up the other, and the
  // browser is waiting on this response.
  const [metaResult, tiktokResult] = await Promise.all([
    meta
      ? sendCapiEvent({ name: names.meta, ...shared, ...metaCookies(cookie) })
      : Promise.resolve({ ok: false, error: 'not configured' }),
    tiktok
      ? sendTikTokEvent({ name: names.tiktok, ...shared, ...tiktokCookies(cookie) })
      : Promise.resolve({ ok: false, error: 'not configured' }),
  ]);

  // 'no user data to match on' is expected from a guest with cookies blocked,
  // and 'not configured' is a choice, not a fault. Neither is worth a log line.
  const quiet = (e?: string) => e === 'no user data to match on' || e === 'not configured';
  if (!metaResult.ok && !quiet(metaResult.error)) {
    console.error('[track] Meta Conversions API rejected an event', body.event, metaResult.error);
  }
  if (!tiktokResult.ok && !quiet(tiktokResult.error)) {
    console.error('[track] TikTok Events API rejected an event', body.event, tiktokResult.error);
  }

  return NextResponse.json({
    ok: true,
    sent: metaResult.ok || tiktokResult.ok,
    meta: metaResult.ok,
    tiktok: tiktokResult.ok,
  });
}
