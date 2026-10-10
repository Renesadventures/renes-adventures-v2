/**
 * Meta Conversions API — the server's copy of the important events.
 *
 * Why bother when the pixel already fires: the pixel is a script in someone
 * else's browser. Ad blockers remove it, Safari and Firefox restrict it, and
 * iOS strips much of what survives. A server-sent event has none of those
 * problems, so Meta sees conversions it would otherwise never hear about and
 * can actually optimise the ads. Meta's own published figure is 17.8% lower
 * cost per result with it — their number, not independently verified, but the
 * direction is not controversial.
 *
 * Every event sent from here carries the same event_id as its browser twin so
 * Meta keeps one and discards the duplicate. Get that wrong and you quietly
 * double-count every conversion, which is worse than not sending at all.
 *
 * Personal data is hashed before it leaves this server — SHA-256, lowercased
 * and trimmed, exactly as Meta requires. The raw email or phone never goes
 * over the wire. Hashed contact details are what let Meta match a buyer to a
 * person who saw the ad, and they are the single biggest driver of whether
 * this is worth having at all.
 *
 * Silent when unconfigured: no token, no send, no error.
 */

import crypto from 'crypto';

const GRAPH = 'https://graph.facebook.com/v21.0';

/** Meta's normalisation: trim, lowercase, then SHA-256 hex. */
function hash(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalised = value.trim().toLowerCase();
  if (!normalised) return undefined;
  return crypto.createHash('sha256').update(normalised).digest('hex');
}

/** Phones normalise to digits only, with country code, before hashing. */
function hashPhone(value?: string | null): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, '');
  if (digits.length < 7) return undefined;
  return crypto.createHash('sha256').update(digits).digest('hex');
}

export interface CapiEvent {
  /** Meta standard event name: Lead, Purchase, Contact, InitiateCheckout… */
  name: string;
  /** Must match the browser event exactly, or Meta counts it twice. */
  eventId: string;
  /** The page it happened on. */
  sourceUrl?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  /** Meta's browser and click cookies, when the caller can read them. */
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  /** Seconds since epoch. Defaults to now. Meta rejects events over 7 days old. */
  eventTime?: number;
}

export function capiConfigured(): boolean {
  return Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN);
}

/**
 * Send one event. Never throws — a measurement failure must not be able to
 * fail a booking or a lead.
 */
export async function sendCapiEvent(e: CapiEvent): Promise<{ ok: boolean; error?: string }> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return { ok: false, error: 'not configured' };

  const userData: Record<string, unknown> = {};
  const em = hash(e.email);
  const ph = hashPhone(e.phone);
  const fn = hash(e.firstName);
  const ln = hash(e.lastName);
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (fn) userData.fn = [fn];
  if (ln) userData.ln = [ln];
  if (e.fbp) userData.fbp = e.fbp;
  if (e.fbc) userData.fbc = e.fbc;
  if (e.clientIp) userData.client_ip_address = e.clientIp;
  if (e.userAgent) userData.client_user_agent = e.userAgent;

  // Meta rejects an event with no way at all to match a person.
  if (!Object.keys(userData).length) return { ok: false, error: 'no user data to match on' };

  const customData: Record<string, unknown> = {};
  if (typeof e.value === 'number') {
    customData.value = e.value;
    customData.currency = e.currency || 'USD';
  }
  if (e.contentName) customData.content_name = e.contentName;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: e.name,
        event_time: e.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: e.eventId,
        event_source_url: e.sourceUrl,
        action_source: 'website',
        user_data: userData,
        ...(Object.keys(customData).length ? { custom_data: customData } : {}),
      },
    ],
  };

  // A test code routes events to Events Manager's Test Events tab instead of
  // production, so the setup can be proven without polluting the real numbers.
  if (process.env.META_CAPI_TEST_CODE) {
    payload.test_event_code = process.env.META_CAPI_TEST_CODE;
  }

  try {
    const res = await fetch(`${GRAPH}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { ok: false, error: `Graph HTTP ${res.status} ${detail.slice(0, 250)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'CAPI send failed' };
  }
}

/** Pull Meta's cookies out of a request, for match quality. */
export function metaCookies(cookieHeader: string | null): { fbp?: string; fbc?: string } {
  if (!cookieHeader) return {};
  const get = (name: string) =>
    cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];
  return { fbp: get('_fbp'), fbc: get('_fbc') };
}
