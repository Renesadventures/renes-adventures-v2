import { NextRequest, NextResponse, after } from 'next/server';
import { attributionFromCookieHeader } from '@/lib/attribution';
import { logOpsEvent, type OpsKind } from '@/lib/liadesk';

/**
 * POST /api/ops/event
 *
 * The browser's half of the funnel, written into Lia Desk (Ops > Activity).
 * Attribution comes from the visitor's first-party cookies, not the body.
 * Those cookies can be faked by a determined person, so the endpoint is kept
 * harmless: a fixed list of kinds, one record per session (or per minute),
 * a per-IP rate limit, and beacons can never create new campaign names in
 * Lia Desk; they only match ones that already exist.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED: Record<string, { kind: OpsKind; oncePer: 'session' | 'minute' | 'none' }> = {
  visit: { kind: 'visit', oncePer: 'session' },
  chat_opened: { kind: 'chat_opened', oncePer: 'session' },
  chat_message: { kind: 'chat_message', oncePer: 'minute' },
  chat_handoff: { kind: 'chat_handoff', oncePer: 'session' },
  whatsapp_click: { kind: 'whatsapp_click', oncePer: 'minute' },
  phone_click: { kind: 'phone_click', oncePer: 'minute' },
  booking_started: { kind: 'booking_started', oncePer: 'session' },
};

/** Simple per-instance limit: 30 beacons per IP per minute. */
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > 30;
}

const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless|facebookexternalhit|bingpreview/i;

export async function POST(req: NextRequest) {
  const ua = req.headers.get('user-agent') || '';
  if (BOT.test(ua)) return NextResponse.json({ ok: true, skipped: 'bot' });
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return NextResponse.json({ ok: true, skipped: 'rate' });

  let body: { kind?: string; page?: string; item?: string; value?: number };
  try {
    body = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const rule = body.kind ? ALLOWED[body.kind] : undefined;
  if (!rule) return NextResponse.json({ ok: false, error: 'unknown kind' }, { status: 400 });

  const attribution = attributionFromCookieHeader(req.headers.get('cookie'));
  // No visitor cookie = cookies blocked or a script; nothing trustworthy to record.
  if (!attribution.visitorId) return NextResponse.json({ ok: true, skipped: 'no visitor' });

  const sid = attribution.sessionId || attribution.visitorId;
  const minute = new Date().toISOString().slice(0, 16);
  const externalRef =
    rule.oncePer === 'session' ? `${sid}`
    : rule.oncePer === 'minute' ? `${sid}:${minute}`
    : undefined;

  const page = typeof body.page === 'string' ? body.page.slice(0, 200) : undefined;
  const item = typeof body.item === 'string' ? body.item.slice(0, 120) : undefined;
  const t = attribution.last || attribution.first;

  // Answer the browser at once; write to Lia Desk after the response.
  after(async () => {
    const res = await logOpsEvent({
      kind: rule.kind,
      channel: 'website',
      summary: [item, t ? `from ${t.source}` : undefined].filter(Boolean).join(' · ') || undefined,
      page,
      value: typeof body.value === 'number' ? body.value : undefined,
      externalRef,
      attribution,
    });
    if (!res.ok && !/already recorded/i.test(res.error || '')) {
      console.error('[ops/event] Lia Desk rejected', rule.kind, res.error);
    }
  });

  return NextResponse.json({ ok: true });
}
