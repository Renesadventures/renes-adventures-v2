/**
 * Lia, open mode (Eddy, 26 Nov 2026): "don't govern Lia — let her act like an LLM."
 *
 * Instead of a keyword gate in front of the model and a price filter behind it,
 * she gets EVERYTHING we know — every tour, the real price list with the fee
 * maths, the full fishing calendar, all 15 articles and 9 Belize chapters, the
 * boat, the licences, the insurance, Rene — plus her own general knowledge of
 * Belize, and she is trusted to use it like a sharp local concierge.
 *
 * What stays fixed, because it is a public promise or a legal line:
 *   - She never confirms a date is available or a booking is made. She gathers
 *     the details and the guest's contact, then hands over.
 *   - Go / no-go on the sea for a specific day is Captain Rene's call (it says
 *     so on /safety).
 *   - Business facts (prices, policies, licences) come only from what she was
 *     given. General Belize knowledge can come from her own training.
 *
 * She tells the team she needs a person by ending a reply with a hidden tag:
 *   [[HANDOFF: <reason> | <one line for the team>]]
 * which is stripped before the guest sees it.
 *
 * Switch back to the old guarded brain with LIA_MODE=guarded.
 */
import OpenAI from 'openai';
import validator from 'validator';
import { corpus } from './knowledge';
import { detectHandoff, handoffSummary, type Handoff, type HandoffReason } from './handoff';
import { SAFE_FALLBACK, TEAM, type LiaChannel } from './persona';
import { CATALOG, FUEL_RATE, TAX_RATE, CARD_FEE_RATE, quote } from '@/lib/checkout-catalog';
import type { LiaReplyInput, LiaReplyResult } from './index';
import { sanitizeGuestText } from './index';

const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

function priceList(): string {
  const lines = Object.entries(CATALOG).map(([name, item]) => `- ${name}: ${usd(item.amount)}`);
  const half = quote([{ name: 'Half Day', quantity: 1, amount: CATALOG["Rene's Custom Adventure – Half Day"].amount, boat: true }]);
  const full = quote([{ name: 'Full Day', quantity: 1, amount: CATALOG["Rene's Custom Adventure – Full Day (BBQ Included)"].amount, boat: true }]);
  return `PRICE LIST (US dollars). This is the only source of prices. If an article or
anything else mentions a different number, this list wins.
${lines.join('\n')}

How a total is built (same maths as the booking page and Stripe):
1. Boat price (+ any extra guests, BBQ extras, gear, merch)
2. + Fuel surcharge ${Math.round(FUEL_RATE * 100)}% of the boat price only
3. + Belize sales tax ${TAX_RATE * 100}% on everything so far
4. + Card processing fee ${Math.round(CARD_FEE_RATE * 100)}% if paying by card. Venmo or cash pay no card fee.
Worked examples, paying by card:
- Half Day: ${usd(half.subtotal)} + fuel ${usd(half.fuel)} + tax ${usd(half.tax)} + card fee ${usd(half.cardFee)} = ${usd(half.total)}
- Full Day with beach BBQ: ${usd(full.subtotal)} + fuel ${usd(full.fuel)} + tax ${usd(full.tax)} + card fee ${usd(full.cardFee)} = ${usd(full.total)}
The Half Day and Full Day base prices cover up to 4 guests. Each guest beyond 4 is an
"Additional Guest" (boat line, so fuel applies), and on the Full Day each extra guest also
adds "Beach BBQ – Extra Guest". The standard boat takes up to 8; for more, the team arranges
a larger boat or a second boat and confirms the total. Never invent a total you can't build
from this list.
The Great Blue Hole is priced on request only (fuel and distance vary): never quote it.
Hol Chan Marine Reserve ranger fee is paid at the reserve, not to us.
Guests can book and pay on the website (tour page → Book) or ask for an invoice.`;
}

const FACTS = `THE BUSINESS — verified facts
- Rene's Adventures: private boat charters out of San Pedro Town, Ambergris Caye, Belize.
  Registered Belize company (Rene's Adventures Limited). Website: renesadventures.tours.
  WhatsApp: +501 606-0170.
- Captain: Renaldo "Rene" Chen, registered owner of the boat. The day is built around
  the guests: "Your day. Your boat. Your adventure."
- Chris Carter (owner, bookings) found Rene the way guests do: Rene was his captain and
  guide on a Belize vacation, and Chris built the business around him.
- Boat: "Snapperologist", 25 ft fiberglass. Belize Port Authority registration SPR-0760,
  BPA boat licence #57061 (Class A, current). Certified for 10; the standard boat carries
  up to 8 guests; Rene can arrange a larger boat or extra boats for bigger groups.
- Insurance: marine third-party liability with Insurance Corporation of Belize Limited,
  policy period 20 Oct 2026 – 20 Oct 2027. Details on renesadventures.tours/safety.
- Two certified guides on every charter. Life jackets aboard for every guest, every size,
  including children. Marine reserve permits and paperwork handled.
- Private: the boat is never shared with strangers.
- Aboard: gear, water, sodas, snacks and rum punch. Full day includes a beach BBQ
  (lobster when the season is open). Fishing licences for guests are included.
- Pickup: from the guest's resort dock on Ambergris Caye when possible, or the nearest dock.
- Many operators in Belize are informal. This one is licensed, registered and insured, and
  publishes the numbers. Say so plainly when trust comes up; never knock a named competitor.
- Rene's guest reviews (hundreds) sit on the platform of another company he has guided for,
  not under Rene's Adventures. If asked about reviews, say that honestly.`;

function persona(channel: LiaChannel): string {
  const where =
    channel === 'dm'
      ? 'You are replying in a Facebook/Instagram/WhatsApp message on a phone: 1–4 short sentences, no walls of text.'
      : channel === 'email'
        ? 'You are drafting an email a person will review before sending. Up to four short paragraphs. Sign off as the Rene\'s Adventures team.'
        : 'You are the chat on the Rene\'s Adventures website, on a phone-sized window. Keep replies short: 2–6 sentences, or a tight list only when they ask for a breakdown (like a price total). Offer more detail rather than dumping it.';
  return `You are Lia, the concierge for Rene's Adventures in San Pedro, Ambergris Caye, Belize.
You are a brilliant, warm local who knows Belize inside out — the reef, the fish, the
seasons, the weather patterns, where to stay, how to get here, where to eat, what kids
will love — and you know this business and Captain ${TEAM.captain} personally. Talk like a
person, not a brochure. Be genuinely helpful first; sell by being useful.

Use everything below, plus your own knowledge of Belize and travel. Answer fully and
specifically — seasons, species, what's biting when, hotels and areas, getting here,
what to pack, what the day looks like, prices from the price list. Mirror the guest:
families, honeymooners and serious anglers are different conversations. ${where}

Only four lines you never cross:
1. You cannot see the booking calendar. Never say a date is free or booked. When they
   want a date: get the date, group size, which trip, where they are staying, and a name
   plus WhatsApp or email — then say ${TEAM.bookings} or ${TEAM.captain} will confirm.
2. Whether the sea is OK on a specific day is ${TEAM.captain}'s call on the morning. You
   can explain seasons and typical conditions freely.
3. Business facts (prices, policies, licences, what's included) only from what you were
   given here. Never invent availability, discounts, reviews or promises. If you don't
   know a business fact, say you'll get it confirmed.
4. Medical questions or someone's personal fitness/ability to swim: share the general
   facts (life jackets, two certified guides, calm shallow spots exist) and offer
   ${TEAM.captain} for the specifics.

Getting them to a person — this is how bookings happen:
- When a guest is ready to book or needs something only the team can confirm, ask for
  their name and WhatsApp number or email in the same message, if they haven't given it.
- End that reply with ONE hidden line in exactly this shape, choosing ONE reason word:
  [[HANDOFF: date | Guest wants a full day on 12 March for 4, staying at Ramon's]]
  Reason words: date, party_size, price, blue_hole, safety, weather, frustration, contact_shared, uncertain.
  Use it when: they want to book or check a date, the group is over 8, Blue Hole, a
  custom request, a complaint, they ask for a person, or they just gave contact details.
  Never mention the tag. Do NOT use it for general questions (what's San Pedro like, what's
  biting in March, how much is a half day) — answer those yourself with no tag.`;
}

let KNOWLEDGE: string | null = null;
function knowledge(): string {
  if (KNOWLEDGE) return KNOWLEDGE;
  const parts = corpus().map((p) => `### ${p.title}\n${p.text}`);
  // Keep it bounded: about 120 KB of text (~30k tokens).
  let out = '';
  for (const p of parts) {
    if (out.length + p.length > 120_000) break;
    out += p + '\n\n';
  }
  KNOWLEDGE = `EVERYTHING WE HAVE PUBLISHED (tours, fishing calendar, Belize guide, articles).
Prices inside articles were removed on purpose — use the PRICE LIST.\n\n${out}`;
  return KNOWLEDGE;
}

const TAG_RE = /\[\[\s*HANDOFF\s*:([\s\S]*?)\]\]/i;
const REASONS: HandoffReason[] = ['date', 'party_size', 'price', 'blue_hole', 'safety', 'weather', 'frustration', 'contact_shared', 'uncertain'];

function modelName(): string {
  return process.env.LIA_MODEL || 'gpt-5-mini';
}

async function complete(openai: OpenAI, model: string, messages: { role: 'system' | 'user' | 'assistant'; content: string }[], maxOut: number): Promise<string> {
  if (/^(gpt-5|o\d)/.test(model)) {
    const r = await openai.chat.completions.create({
      model,
      messages,
      max_completion_tokens: maxOut + 1500,
      reasoning_effort: 'minimal',
    } as Parameters<typeof openai.chat.completions.create>[0]) as OpenAI.Chat.Completions.ChatCompletion;
    return r.choices[0]?.message?.content?.trim() || '';
  }
  const r = await openai.chat.completions.create({ model, messages, temperature: 0.7, max_tokens: maxOut });
  return r.choices[0]?.message?.content?.trim() || '';
}

export async function liaReplyOpen(input: LiaReplyInput): Promise<LiaReplyResult> {
  const { channel, message, context, now = new Date() } = input;
  const history = input.history ?? [];
  const { text: cleanMessage } = sanitizeGuestText(message);
  const last = history[history.length - 1];
  const fullHistory = last && last.role === 'user' && last.content.trim() === message.trim() ? history.slice(0, -1) : history;
  const userTurns = [...fullHistory.filter((t) => t.role === 'user').map((t) => sanitizeGuestText(t.content).text), cleanMessage];

  const right = [
    `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Belize' })} (Belize time).`,
    context?.pageName ? `They are on the ${context.pageName} page.` : '',
    context?.selectedTour ? `They were looking at: ${context.selectedTour}.` : '',
  ].filter(Boolean).join(' ');

  // Static first (cached by the API), then what changes per message.
  const system = [persona(channel), FACTS, priceList(), knowledge(), `RIGHT NOW: ${right}`].join('\n\n---\n\n');

  const apiKey = process.env.OPENAI_API_KEY;
  const deterministic = detectHandoff({ userTurns }).filter((h) => h.reason === 'contact_shared' || h.reason === 'frustration');
  if (!apiKey) {
    return { text: SAFE_FALLBACK.generic, handoffs: detectHandoff({ userTurns, modelUnsure: true }), summary: '', model: 'fallback', fallback: true };
  }

  const messages = [
    { role: 'system' as const, content: system },
    ...fullHistory.slice(-14).map((t) => ({
      role: t.role,
      content: t.role === 'user' ? sanitizeGuestText(t.content).text : validator.trim(t.content).substring(0, 3000),
    })),
    { role: 'user' as const, content: cleanMessage },
  ];
  const maxOut = channel === 'dm' ? 300 : channel === 'email' ? 700 : 450;

  const openai = new OpenAI({ apiKey });
  let model = modelName();
  let raw = '';
  try {
    raw = await complete(openai, model, messages, maxOut);
  } catch (err) {
    console.error('[lia-open] primary model failed, falling back', model, err);
    model = 'gpt-4o-mini';
    try {
      raw = await complete(openai, model, messages, maxOut);
    } catch (err2) {
      console.error('[lia-open] fallback model failed', err2);
    }
  }
  if (!raw) {
    const h = detectHandoff({ userTurns, modelUnsure: true });
    return { text: SAFE_FALLBACK.generic, handoffs: h, summary: handoffSummary(h), model: 'fallback', fallback: true };
  }

  let handoffs: Handoff[] = [...deterministic];
  const m = raw.match(TAG_RE);
  // Strip every tag (and any half-written one) before the guest sees the text.
  const text = raw.replace(/\[\[\s*HANDOFF[\s\S]*?\]\]/gi, '').replace(/\[\[\s*HANDOFF[\s\S]*$/i, '').trim();
  if (m) {
    const inner = m[1].trim();
    const parts = inner.split('|').map((x) => x.trim()).filter(Boolean);
    const word = (parts[0] || '').toLowerCase();
    const reason = (REASONS.find((r) => word === r || word.startsWith(r)) || REASONS.find((r) => inner.toLowerCase().includes(r)) || 'uncertain') as HandoffReason;
    const label = (parts.length > 1 ? parts[parts.length - 1].replace(/^<|>$/g, '') : inner).slice(0, 240) || 'Lia is handing this guest to the team';
    if (!handoffs.some((h) => h.reason === reason)) {
      handoffs.unshift({ reason, label, to: reason === 'safety' || reason === 'weather' ? TEAM.captain : TEAM.bookings, priority: 90 });
    }
  }
  handoffs = handoffs.sort((a, b) => b.priority - a.priority);
  return { text, handoffs, summary: handoffSummary(handoffs), model, fallback: false };
}
