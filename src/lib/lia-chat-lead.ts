import { createLead } from '@/lib/liadesk';

/**
 * Lia chat -> Lia Desk.
 *
 * The concierge asks guests for a name and an email or WhatsApp number when
 * they want to book. Until now those details went nowhere a human could see.
 * This pulls them out of the conversation and hands them to Lia Desk as a
 * "Lia Chat" lead, with the conversation attached so Rene does not have to
 * ask the same questions again.
 *
 * It only fires on the turn where a NEW email or phone first appears, so a
 * long chat does not keep adding notes. Repeat guests are handled by the
 * one-lead-per-guest rule inside createLead.
 */

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
// + optional, then 7-15 digits allowing spaces, dashes, dots, brackets.
const PHONE_RE = /(\+?\d[\d\s().-]{6,18}\d)/;
const NAME_RE =
  /\b(?:my name is|me llamo|this is|i am|i'm|soy)\s+([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+)?)/i;
const DATE_RE = /\b(20\d{2}-\d{2}-\d{2})\b/;
const GUESTS_RE = /\b(\d{1,2})\s*(?:people|persons|guests|adults|of us|pax|personas)\b/i;

function findEmail(s: string): string | undefined {
  return s.match(EMAIL_RE)?.[0];
}

function findPhone(s: string): string | undefined {
  // Strip emails and dates first so their digits are not read as a phone.
  const cleaned = s.replace(EMAIL_RE, ' ').replace(/\b20\d{2}-\d{2}-\d{2}\b/g, ' ');
  const m = cleaned.match(PHONE_RE)?.[1];
  if (!m) return undefined;
  const digits = m.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 ? m.trim() : undefined;
}

function firstMatch(turns: ChatTurn[], re: RegExp): string | undefined {
  for (const t of turns) {
    const m = t.content.match(re)?.[1];
    if (m) return m;
  }
  return undefined;
}

export async function captureChatLead(
  history: ChatTurn[],
  latestUserMessage: string,
  aiReply: string,
  page?: string,
  /** Why Lia handed this one to a human — written onto the lead so whoever
   *  picks it up knows what the guest actually needs before they read back
   *  the whole transcript. */
  handoffSummary?: string,
): Promise<void> {
  const email = findEmail(latestUserMessage);
  const phone = findPhone(latestUserMessage);
  if (!email && !phone) return;

  // The browser usually sends the latest message inside the history too.
  const last = history[history.length - 1];
  const all: ChatTurn[] =
    last && last.role === 'user' && last.content.trim() === latestUserMessage.trim()
      ? history
      : [...history, { role: 'user', content: latestUserMessage }];

  const earlier = all
    .slice(0, -1)
    .filter((t) => t.role === 'user')
    .map((t) => t.content)
    .join('\n');
  // Already shared these details earlier in the chat -> already captured.
  if ((email && earlier.includes(email)) || (phone && earlier.includes(phone))) {
    return;
  }
  const name = firstMatch(all.filter((t) => t.role === 'user'), NAME_RE);
  const tripDate = firstMatch(all, DATE_RE);
  const guestsRaw = firstMatch(all.filter((t) => t.role === 'user'), GUESTS_RE);

  const transcript = [...all.slice(-12), { role: 'assistant' as const, content: aiReply }]
    .map((t) => `${t.role === 'user' ? 'Guest' : 'Lia'}: ${t.content}`)
    .join('\n');

  const result = await createLead({
    name: name || email || phone || 'Lia chat guest',
    email,
    phone,
    interest: 'Lia chat',
    message: [
      handoffSummary ? `Lia handed this over:\n${handoffSummary}\n` : '',
      `Conversation with Lia on the website:\n\n${transcript}`,
    ]
      .filter(Boolean)
      .join('\n')
      .slice(0, 3800),
    source: 'Lia Chat',
    tripDate,
    guests: guestsRaw ? Number(guestsRaw) : undefined,
    extra: { page },
  });
  if (!result.ok) {
    console.error('[lia-chat] Lia Desk rejected a lead:', result.error);
  }
}
