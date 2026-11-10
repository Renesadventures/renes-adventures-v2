/**
 * Where did this person come from?
 *
 * Every lead in Lia Desk must answer that question, so this file is the one
 * place the answer is worked out. It runs in the browser (to stamp the visit)
 * and on the server (to read the stamp back when a lead is created).
 *
 * Two touches are kept, both in first-party cookies with no personal data:
 *  - FIRST touch (ra_ft, 180 days): how they found us the very first time.
 *    This becomes the lead's Source in Lia Desk.
 *  - LAST touch (ra_lt, 30 days): the visit that brought them back to act.
 *
 * A visit from our own pages, or a reload, never overwrites a touch. A new
 * campaign link or a new outside referrer does update the last touch.
 */

export interface Touch {
  /** Must match a utm.source name in Lia Desk. */
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  /** fbclid / gclid / ttclid / msclkid — proves an ad click. */
  clickId?: string;
  referrer?: string;
  landing?: string;
  /** ISO timestamp. */
  at: string;
}

export interface Attribution {
  first?: Touch;
  last?: Touch;
  visitorId?: string;
  sessionId?: string;
}

export const COOKIE_FIRST = 'ra_ft';
export const COOKIE_LAST = 'ra_lt';
export const COOKIE_VISITOR = 'ra_vid';
export const COOKIE_SESSION = 'ra_sid';

const OWN_HOSTS = /(^|\.)renesadventures\.tours$|(^|\.)vercel\.app$|^localhost$/i;

const AI_HOSTS =
  /(chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|you\.com|phind\.com)$/i;

function isPaid(medium?: string, clickId?: string): boolean {
  return !!clickId && !medium ? true : /cpc|ppc|paid|ads?$|display|sponsored/i.test(medium || '');
}

/** utm_source (or a referrer host) → the source name used in Lia Desk. */
export function sourceName(raw: string, medium?: string, clickId?: string): string {
  const s = raw.toLowerCase();
  const paid = isPaid(medium, clickId);
  if (/(^|\.)(facebook|fb)(\.|$)|^fb$|^facebook$|^meta$/.test(s) || s.includes('facebook')) return paid ? 'Facebook Ad' : 'Facebook';
  if (s.includes('instagram') || s === 'ig') return paid ? 'Instagram Ad' : 'Instagram';
  if (s.includes('tiktok')) return paid ? 'TikTok Ad' : 'TikTok';
  if (s.includes('youtube') || s === 'yt') return 'YouTube';
  if (s.includes('google')) return paid ? 'Google Ads' : 'Google';
  if (s.includes('bing')) return 'Bing';
  if (AI_HOSTS.test(s) || /chatgpt|openai|perplexity|claude|gemini|copilot/.test(s)) return 'ChatGPT / AI';
  if (s.includes('whatsapp') || s === 'wa.me' || s === 'wa') return 'WhatsApp';
  if (s.includes('tripadvisor')) return 'TripAdvisor';
  if (s.includes('reddit')) return 'Reddit';
  if (/email|newsletter|mail/.test(s)) return 'Email';
  if (/linkedin/.test(s)) return 'LinkedIn';
  if (/^(x|twitter)$|twitter\.com|^t\.co$/.test(s)) return 'X';
  return 'Referral';
}

/** Work out this page view's touch. Returns null for internal navigation. */
export function touchFromLocation(href: string, referrer: string): Touch | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const p = url.searchParams;
  const clickId =
    p.get('fbclid') ? `fbclid:${p.get('fbclid')!.slice(0, 60)}`
    : p.get('gclid') ? `gclid:${p.get('gclid')!.slice(0, 60)}`
    : p.get('ttclid') ? `ttclid:${p.get('ttclid')!.slice(0, 60)}`
    : p.get('msclkid') ? `msclkid:${p.get('msclkid')!.slice(0, 60)}`
    : undefined;
  const landing = url.pathname.slice(0, 200);
  const at = new Date().toISOString();
  const utmSource = p.get('utm_source');
  const medium = p.get('utm_medium') || undefined;

  let refHost = '';
  try {
    refHost = referrer ? new URL(referrer).hostname.replace(/^www\./, '') : '';
  } catch {
    refHost = '';
  }

  if (utmSource) {
    return {
      source: sourceName(utmSource, medium, clickId),
      medium,
      campaign: p.get('utm_campaign') || undefined,
      content: p.get('utm_content') || undefined,
      term: p.get('utm_term') || undefined,
      clickId,
      referrer: refHost || undefined,
      landing,
      at,
    };
  }
  if (clickId) {
    const src = clickId.startsWith('fbclid') ? 'Facebook'
      : clickId.startsWith('gclid') ? 'Google Ads'
      : clickId.startsWith('ttclid') ? 'TikTok Ad'
      : 'Bing';
    return { source: src, medium: clickId.startsWith('fbclid') ? 'social' : 'cpc', clickId, referrer: refHost || undefined, landing, at };
  }
  if (refHost && !OWN_HOSTS.test(refHost)) {
    const src = sourceName(refHost);
    return {
      source: src,
      medium: /Google|Bing/.test(src) ? 'organic' : src === 'ChatGPT / AI' ? 'ai' : src === 'Referral' ? 'referral' : 'social',
      referrer: refHost,
      landing,
      at,
    };
  }
  if (!refHost) return { source: 'Direct', medium: 'none', landing, at };
  return null; // came from one of our own pages
}

/** One line for a human: "Instagram · organic · /tours/blue-hole · Nov 9". */
export function describeTouch(t?: Touch): string {
  if (!t) return 'Unknown';
  const bits = [t.source];
  if (t.medium && t.medium !== 'none') bits.push(t.medium);
  if (t.campaign) bits.push(`campaign "${t.campaign}"`);
  if (t.content) bits.push(`post/ad "${t.content}"`);
  if (t.referrer && t.source === 'Referral') bits.push(t.referrer);
  if (t.landing) bits.push(`landed on ${t.landing}`);
  bits.push(t.at.slice(0, 10));
  return bits.join(' · ');
}

function safeParse(v?: string): Touch | undefined {
  if (!v) return undefined;
  try {
    const t = JSON.parse(decodeURIComponent(v)) as Touch;
    return t && typeof t.source === 'string' ? t : undefined;
  } catch {
    return undefined;
  }
}

/** Read the attribution cookies from a raw Cookie header (server side). */
export function attributionFromCookieHeader(header?: string | null): Attribution {
  const jar: Record<string, string> = {};
  for (const part of (header || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) jar[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return {
    first: safeParse(jar[COOKIE_FIRST]),
    last: safeParse(jar[COOKIE_LAST]),
    visitorId: jar[COOKIE_VISITOR]?.slice(0, 64),
    sessionId: jar[COOKIE_SESSION]?.split('.')[0]?.slice(0, 64),
  };
}
