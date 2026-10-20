/**
 * WhatsApp — the channel the business actually runs on.
 *
 * Everything else on this site is a way of getting someone to message this
 * number. The fishing enquiry Rene saw and nobody else could was a WhatsApp
 * message, and that is the whole reason this file exists: a message that lands
 * in one person's phone is a message only one person can answer, and Chris is
 * in Iowa, Rene is in Belize and Eddy is in Nicaragua.
 *
 * Once +501 606 0170 is live on the Cloud API, every message that arrives here
 * becomes a lead in Lia Desk, which all three of them can open from anywhere.
 * The phone keeps working exactly as it does today — that is what Coexistence
 * means — but the conversation stops living only on it.
 *
 * Two things arrive from Meta on a coexisting number:
 *   - `messages`       — the guest wrote to us.
 *   - `message_echoes` — Rene replied from the phone app. Not a new enquiry,
 *                        but the others need to see it, so it is logged onto
 *                        the lead rather than ignored.
 *
 * Sending is gated behind LIA_WHATSAPP_AUTOREPLY, off by default. Until it is
 * switched on, Lia reads everything, records everything, drafts a reply onto
 * every lead, and sends nothing.
 */

const GRAPH = 'https://graph.facebook.com/v21.0';

/** The WABA number that sends. Different from the Page token — a system user token. */
function waToken(): string {
  return process.env.WHATSAPP_ACCESS_TOKEN || '';
}

function phoneNumberId(): string {
  return process.env.WHATSAPP_PHONE_NUMBER_ID || '';
}

/**
 * Off by default, and deliberately a separate switch from the social one.
 * Replying to a stranger's Facebook comment and replying on WhatsApp to
 * someone who has the business's number are not the same risk.
 */
export function whatsappAutoreplyEnabled(): boolean {
  return (process.env.LIA_WHATSAPP_AUTOREPLY || '').toLowerCase() === 'on';
}

export function whatsappConfigured(): boolean {
  return Boolean(waToken() && phoneNumberId());
}

/**
 * Send a plain text reply.
 *
 * WhatsApp's 24-hour rule is simpler than Messenger's: an inbound message from
 * the customer opens the window, so a reply to a message we just received is
 * always allowed. Outside the window only an approved template may be sent, and
 * we have none yet — so nothing here ever tries.
 */
export async function sendWhatsApp(
  to: string,
  text: string,
): Promise<{ ok: boolean; sent: boolean; error?: string }> {
  if (!whatsappAutoreplyEnabled()) return { ok: true, sent: false };
  if (!whatsappConfigured()) {
    return { ok: false, sent: false, error: 'WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not set' };
  }
  if (!to || !text.trim()) return { ok: true, sent: false };

  try {
    const res = await fetch(`${GRAPH}/${phoneNumberId()}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${waToken()}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        // Previews turn a link into a card the guest may tap instead of reading.
        text: { preview_url: false, body: text.slice(0, 4096) },
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, sent: false, error: `${res.status} ${detail.slice(0, 300)}` };
    }
    return { ok: true, sent: true };
  } catch (err) {
    return { ok: false, sent: false, error: err instanceof Error ? err.message : 'send failed' };
  }
}

/**
 * Mark the guest's message as read.
 *
 * Two blue ticks within a second of writing tell a guest a human is there,
 * before Lia has written a word. It costs nothing and it buys the seconds the
 * reply needs. Never gated — reading a message is not answering it.
 */
export async function markRead(messageId: string): Promise<void> {
  if (!whatsappConfigured() || !messageId) return;
  try {
    await fetch(`${GRAPH}/${phoneNumberId()}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${waToken()}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    });
  } catch {
    // A missing read receipt is not worth failing a lead over.
  }
}

/** A WhatsApp id is the full international number, no plus. Make it dialable. */
export function waIdToPhone(waId: string): string {
  const digits = (waId || '').replace(/\D/g, '');
  return digits ? `+${digits}` : '';
}

/**
 * What the guest actually sent, as text.
 *
 * People send voice notes, photos of a boat they liked, and a dropped pin far
 * more often than they send tidy sentences. None of those have text, and all of
 * them are a raised hand — so each becomes a line a human can act on rather
 * than an empty message that gets skipped.
 */
export function describeMessage(m: WhatsAppMessage): string {
  switch (m.type) {
    case 'text':
      return (m.text?.body || '').trim();
    case 'button':
      return (m.button?.text || '').trim();
    case 'interactive':
      return (
        m.interactive?.button_reply?.title ||
        m.interactive?.list_reply?.title ||
        ''
      ).trim();
    case 'image':
      return m.image?.caption?.trim() || '(sent a photo)';
    case 'video':
      return m.video?.caption?.trim() || '(sent a video)';
    case 'document':
      return m.document?.caption?.trim() || '(sent a document)';
    case 'audio':
      return '(sent a voice note — listen in WhatsApp)';
    case 'location':
      return m.location?.name
        ? `(shared a location: ${m.location.name})`
        : '(shared their location)';
    case 'contacts':
      return '(shared a contact card)';
    case 'sticker':
      return '(sent a sticker)';
    default:
      return `(sent a ${m.type || 'message'})`;
  }
}

/* ------------------------------------------------------------------ types */

export interface WhatsAppMessage {
  id?: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
  button?: { text?: string; payload?: string };
  interactive?: {
    button_reply?: { id?: string; title?: string };
    list_reply?: { id?: string; title?: string };
  };
  image?: { id?: string; caption?: string };
  video?: { id?: string; caption?: string };
  document?: { id?: string; caption?: string; filename?: string };
  audio?: { id?: string };
  location?: { latitude?: number; longitude?: number; name?: string; address?: string };
  context?: { from?: string; id?: string };
}

export interface WhatsAppContact {
  wa_id?: string;
  profile?: { name?: string };
}

/** The echo of a message Rene sent from the phone app, under Coexistence. */
export interface WhatsAppEcho {
  id?: string;
  to?: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
}

export interface WhatsAppChangeValue {
  messaging_product?: string;
  metadata?: { display_phone_number?: string; phone_number_id?: string };
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
  message_echoes?: WhatsAppEcho[];
  statuses?: Array<{ id?: string; status?: string; recipient_id?: string }>;
  errors?: Array<{ code?: number; title?: string; message?: string }>;
}
