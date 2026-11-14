/**
 * TikTok Events API — the server's copy of the important events.
 *
 * Same argument as the Meta Conversions API next door: the pixel is a script
 * in someone else's browser, and ad blockers, Safari and iOS remove or cripple
 * a large share of it. A server-sent event has none of those problems, so
 * TikTok sees conversions it would otherwise never hear about and can actually
 * optimise the ads against them.
 *
 * The business is already posting on TikTok, so this is the half of the loop
 * that was missing: TikTok could send traffic but was never told what happened
 * to it.
 *
 * Every event sent from here carries the same event_id as its browser twin so
 * TikTok keeps one and discards the duplicate. Get that wrong and you quietly
 * double-count every conversion, which is worse than not sending at all.
 *
 * Personal data is hashed before it leaves this server — SHA-256, lowercased
 * and trimmed. The raw email or phone never goes over the wire. Hashed contact
 * details are what let TikTok match a buyer to a person who saw the ad, and
 * they are the single biggest driver of whether this is worth having at all.
 *
 * Silent when unconfigured: no token, no send, no error.
 */

import crypto from 'crypto';

const EVENTS_API = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

/** TikTok's normalisation: trim, lowercase, then SHA-256 hex. */
function hash(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalised = value.trim().toLowerCase();
  if (!normalised) return undefined;
  return crypto.createHash('sha256').update(normalised).digest('hex');
}

/**
 * Phones normalise to digits only before hashing — but TikTok wants E.164,
 * leading plus included, where Meta wants it stripped. Same hash, one
 * character of difference, and getting it wrong means a match rate of zero
 * with no error to tell you so. Hence the separate function rather than
 * sharing Meta's.
 */
function hashPhone(value?: string | null): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, '');
  if (digits.length < 7) return undefined;
  return crypto.createHash('sha256').update(`+${digits}`).digest('hex');
}

export interface TikTokEvent {
  /** TikTok standard event name: SubmitForm, CompletePayment, Contact… */
  name: string;
  /** Must match the browser event exactly, or TikTok counts it twice. */
  eventId: string;
  /** The page it happened on. TikTok asks for an absolute URL. */
  sourceUrl?: string;
  email?: string;
  phone?: string;
  /** TikTok's browser cookie and click id, when the caller can read them. */
  ttp?: string;
  ttclid?: string;
  clientIp?: string;
  userAgent?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  /** Seconds since epoch. Defaults to now. */
  eventTime?: number;
}

export function tiktokConfigured(): boolean {
  return Boolean(process.env.TIKTOK_PIXEL_ID && process.env.TIKTOK_EVENTS_ACCESS_TOKEN);
}

/**
 * Send one event. Never throws — a measurement failure must not be able to
 * fail a booking or a lead.
 */
export async function sendTikTokEvent(e: TikTokEvent): Promise<{ ok: boolean; error?: string }> {
  const pixelId = process.env.TIKTOK_PIXEL_ID;
  const token = process.env.TIKTOK_EVENTS_ACCESS_TOKEN;
  if (!pixelId || !token) return { ok: false, error: 'not configured' };

  const user: Record<string, unknown> = {};
  const em = hash(e.email);
  const ph = hashPhone(e.phone);
  if (em) user.email = em;
  if (ph) user.phone = ph;
  if (e.ttp) user.ttp = e.ttp;
  if (e.ttclid) user.ttclid = e.ttclid;
  if (e.clientIp) user.ip = e.clientIp;
  if (e.userAgent) user.user_agent = e.userAgent;

  // With nothing to match a person on, the event is noise in the ad account.
  if (!Object.keys(user).length) return { ok: false, error: 'no user data to match on' };

  const properties: Record<string, unknown> = {};
  if (typeof e.value === 'number') {
    properties.value = e.value;
    properties.currency = e.currency || 'USD';
  }
  if (e.contentName) {
    properties.content_name = e.contentName;
    properties.content_type = 'product';
  }

  const payload: Record<string, unknown> = {
    event_source: 'web',
    event_source_id: pixelId,
    data: [
      {
        event: e.name,
        event_time: e.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: e.eventId,
        user,
        ...(e.sourceUrl ? { page: { url: e.sourceUrl } } : {}),
        ...(Object.keys(properties).length ? { properties } : {}),
      },
    ],
  };

  // A test code routes events to Events Manager's test tab instead of
  // production, so the setup can be proven without polluting the real numbers.
  if (process.env.TIKTOK_EVENTS_TEST_CODE) {
    payload.test_event_code = process.env.TIKTOK_EVENTS_TEST_CODE;
  }

  try {
    const res = await fetch(EVENTS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': token,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { ok: false, error: `Events API HTTP ${res.status} ${detail.slice(0, 250)}` };
    }
    // TikTok answers 200 even when it rejected the event; the real verdict is
    // the code in the body. Trusting the HTTP status here is the classic way
    // to believe a broken setup is working.
    const body = (await res.json().catch(() => null)) as { code?: number; message?: string } | null;
    if (body && typeof body.code === 'number' && body.code !== 0) {
      return { ok: false, error: `Events API code ${body.code} ${(body.message || '').slice(0, 250)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'TikTok send failed' };
  }
}

/** Pull TikTok's cookies out of a request, for match quality. */
export function tiktokCookies(cookieHeader: string | null): { ttp?: string; ttclid?: string } {
  if (!cookieHeader) return {};
  const get = (name: string) =>
    cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];
  return { ttp: get('_ttp'), ttclid: get('ttclid') };
}
