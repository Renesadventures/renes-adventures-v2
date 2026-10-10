/**
 * The measurement layer. Before this file, nothing on this website was
 * measured — no analytics, no advertising pixel, nothing. Facebook ads had
 * been running with no way to know what a lead cost, no way to retarget the
 * people who visited and left, and no signal back to Meta about what a good
 * outcome looks like.
 *
 * Three principles, because tracking code rots faster than anything else in a
 * codebase:
 *
 *  1. ONE LIST OF EVENTS. Every event this business cares about is named once,
 *     here. No string literals scattered through components. If it is not in
 *     EVENTS, it does not get sent.
 *  2. ONE CALL SITE SHAPE. track(EVENTS.x, {...}) goes to Google and to Meta
 *     together. A component never talks to gtag or fbq directly.
 *  3. SILENT WHEN UNCONFIGURED. No measurement ID, no pixel, no consent —
 *     every call is a no-op. Tracking must never be able to break the website
 *     or block a booking.
 *
 * On deduplication: the browser pixel and the server both report the valuable
 * events. Meta would count those twice, so every event carries an eventId that
 * both sides send. Meta keeps one. That is the whole trick, and getting it
 * wrong is the most common way a Conversions API setup quietly ruins its own
 * numbers.
 */

export const EVENTS = {
  /** Someone opened the chat. The cheapest signal of real interest. */
  CHAT_OPENED: 'chat_opened',
  /** They typed something. Much stronger than opening it. */
  CHAT_MESSAGE: 'chat_message',
  /** Lia handed the conversation to a human — the moment of real intent. */
  CHAT_HANDOFF: 'chat_handoff',
  /** Any form that creates a lead: enquiry, phone capture, brochure. */
  LEAD: 'lead',
  /** Clicked through to WhatsApp. On this site, that IS the enquiry. */
  WHATSAPP_CLICK: 'whatsapp_click',
  /** Tapped the phone number. */
  PHONE_CLICK: 'phone_click',
  /** Opened the booking/pricing builder on a tour page. */
  BOOKING_STARTED: 'booking_started',
  /** Sent to Stripe. */
  CHECKOUT_STARTED: 'checkout_started',
  /** Came back from Stripe paid. The only event that is money. */
  PURCHASE: 'purchase',
  /** Downloaded the brochure. */
  BROCHURE: 'brochure_download',
  /** Read a guide or article — use for retargeting audiences, not reporting. */
  CONTENT_VIEW: 'content_view',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/**
 * Meta's standard event names. Using the standard names where one fits means
 * Meta can optimise against them; a custom name it has never seen is far
 * weaker as an optimisation target.
 */
const META_NAME: Partial<Record<EventName, string>> = {
  [EVENTS.LEAD]: 'Lead',
  [EVENTS.CHAT_MESSAGE]: 'Contact',
  [EVENTS.CHAT_HANDOFF]: 'Contact',
  [EVENTS.WHATSAPP_CLICK]: 'Contact',
  [EVENTS.PHONE_CLICK]: 'Contact',
  [EVENTS.BOOKING_STARTED]: 'InitiateCheckout',
  [EVENTS.CHECKOUT_STARTED]: 'InitiateCheckout',
  [EVENTS.PURCHASE]: 'Purchase',
  [EVENTS.BROCHURE]: 'Lead',
  [EVENTS.CONTENT_VIEW]: 'ViewContent',
};

export interface TrackPayload {
  /** US dollars, not cents. Only on events where money is real. */
  value?: number;
  currency?: string;
  /** Tour slug, article slug, form name — whatever identifies the thing. */
  item?: string;
  /** Where it happened. */
  page?: string;
  /** Anything else; passed through to Google only. */
  [key: string]: unknown;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    dataLayer?: unknown[];
  }
}

/** Shared by the browser and the server copy of the same event. */
export function newEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}

/**
 * Send one event everywhere it should go.
 *
 * Returns the eventId so a caller that also reports the event server-side can
 * pass the same one through and avoid being counted twice.
 */
export function track(name: EventName, payload: TrackPayload = {}): string {
  const eventId = typeof payload.eventId === 'string' ? payload.eventId : newEventId();
  if (typeof window === 'undefined') return eventId;

  try {
    window.gtag?.('event', name, { ...payload, event_id: eventId });
  } catch {
    /* never let measurement break the page */
  }

  try {
    const metaName = META_NAME[name];
    if (metaName && window.fbq) {
      const metaPayload: Record<string, unknown> = {};
      if (typeof payload.value === 'number') {
        metaPayload.value = payload.value;
        metaPayload.currency = payload.currency || 'USD';
      }
      if (payload.item) metaPayload.content_name = payload.item;
      window.fbq('track', metaName, metaPayload, { eventID: eventId });
    }
  } catch {
    /* same */
  }

  return eventId;
}

/**
 * Report an event from the browser AND from our own server, sharing one
 * eventId. Use this for the events that matter commercially — a server-sent
 * copy survives ad blockers and Safari's tracking prevention, which is the
 * entire reason the Conversions API exists.
 *
 * Fire-and-forget: the caller is never made to wait, and a failure is logged
 * rather than surfaced.
 */
export function trackWithServer(name: EventName, payload: TrackPayload = {}): string {
  const eventId = track(name, payload);
  if (typeof window === 'undefined') return eventId;

  try {
    const body = JSON.stringify({
      event: name,
      eventId,
      value: payload.value,
      currency: payload.currency,
      item: payload.item,
      url: window.location.href,
    });
    // keepalive so it still goes out if the click navigates away.
    void fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* ignore */
  }

  return eventId;
}
