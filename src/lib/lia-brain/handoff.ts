/**
 * When Lia stops selling and gets a human.
 *
 * This is the discipline most chatbots lack, and it is the reason this one can
 * be trusted on a business that sells four-figure days on the water. Lia's job
 * is to hold attention and learn four things. It is not to close the sale, and
 * it is certainly not to answer for the captain.
 *
 * Detection is deliberately boring — regex over the conversation, no model call.
 * Three reasons for that: it runs in under a millisecond so the reply is not
 * slowed down, it cannot be talked out of firing by a clever guest, and when it
 * fires the team gets a reason in words rather than a confidence score. A
 * missed handoff is a lost booking or a safety answer from a robot, so this
 * errs towards firing.
 *
 * Firing a handoff does not end the conversation. Lia says it out loud, names
 * the person, and keeps being warm. Naming a real human raises the perceived
 * service rather than lowering it.
 */

import { TEAM } from './persona';

export type HandoffReason =
  | 'date'
  | 'party_size'
  | 'price'
  | 'blue_hole'
  | 'safety'
  | 'weather'
  | 'frustration'
  | 'contact_shared'
  | 'uncertain';

export interface Handoff {
  reason: HandoffReason;
  /** One line for the team's notification and the CRM note. */
  label: string;
  /** Who it should go to. */
  to: string;
  /** safety and weather are answered by nobody else; they outrank the rest. */
  priority: number;
}

const RULES: Array<{
  reason: HandoffReason;
  priority: number;
  to: string;
  label: string;
  test: (text: string, lastUser: string) => boolean;
}> = [
  {
    reason: 'safety',
    priority: 100,
    to: TEAM.captain,
    label: 'Asked a safety question — Lia declined and it needs the captain',
    test: (t) =>
      /\b(safe|safety|dangerous|danger|risk|risky|scared|afraid|worried|drown|drowning|life ?jacket|life ?vest|insur(ance|ed)|accident|emergency|first aid|medical|medication|pregnan|seasick|sea ?sickness|non.?swimmer|can'?t swim|cannot swim|shark attack|bitten|sting|jellyfish|injur)/i.test(
        t,
      ),
  },
  {
    reason: 'weather',
    priority: 95,
    to: TEAM.captain,
    label: 'Asked about conditions on a specific day — captain decides, Lia does not',
    test: (t) =>
      /\b(weather|forecast|rain|raining|storm|stormy|hurricane|wind(y)?|rough|choppy|calm|swell|wave|sea ?state|cancel(l)?ed|cancellation|too rough|will we still go|go out tomorrow)/i.test(
        t,
      ),
  },
  {
    reason: 'blue_hole',
    priority: 90,
    to: TEAM.bookings,
    label: 'Blue Hole enquiry — inquiry-only, highest value, never quoted in chat',
    test: (t) => /\bblue ?hole\b/i.test(t),
  },
  {
    reason: 'price',
    priority: 80,
    to: TEAM.bookings,
    label: 'Price is being discussed or negotiated — a human quotes, Lia never does',
    test: (t) =>
      /\b(discount|cheaper|cheapest|best price|deal|negotiat|haggle|too expensive|too much|lower (the )?price|match (that|the)|afford|budget|quote|quotation|how much|what'?s the (cost|price|rate)|price list|rates?\b|per person|total (cost|price)|pay(ment)? plan|deposit)/i.test(
        t,
      ),
  },
  {
    reason: 'party_size',
    priority: 70,
    to: TEAM.bookings,
    label: 'Party of more than six — needs a human to work out the boat and the day',
    test: (t) => {
      const m = t.match(
        /\b(\d{1,3})\s*(?:people|persons?|pax|guests?|adults?|of us|in (?:our|the) (?:group|party)|passengers?|personas)\b/i,
      );
      if (m && Number(m[1]) > 6) return true;
      const words: Record<string, number> = {
        seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20,
      };
      for (const [w, n] of Object.entries(words)) {
        if (n > 6 && new RegExp(`\\b${w}\\s*(?:people|persons?|pax|guests?|adults?|of us)\\b`, 'i').test(t)) {
          return true;
        }
      }
      return /\b(group of \d{2,}|large group|big group|wedding party|bachelor|bachelorette|corporate|charter two boats|second boat)\b/i.test(
        t,
      );
    },
  },
  {
    reason: 'date',
    priority: 60,
    to: TEAM.bookings,
    label: 'Named a date — availability is a human answer',
    test: (t) =>
      /\b(today|tomorrow|tonight|this (?:week|weekend|friday|saturday|sunday|monday|tuesday|wednesday|thursday)|next (?:week|weekend|month|friday|saturday|sunday|monday|tuesday|wednesday|thursday))\b/i.test(
        t,
      ) ||
      /\b\d{4}-\d{2}-\d{2}\b/.test(t) ||
      /\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/.test(t) ||
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*\d{1,2}(?:st|nd|rd|th)?\b/i.test(
        t,
      ) ||
      /\b\d{1,2}(?:st|nd|rd|th)\s+(?:of\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)/i.test(
        t,
      ) ||
      /\b(?:on|the)\s+\d{1,2}(?:st|nd|rd|th)\b/i.test(t),
  },
  {
    reason: 'contact_shared',
    priority: 50,
    to: TEAM.bookings,
    label: 'Shared contact details — a real enquiry, needs a human reply',
    test: (_t, lastUser) =>
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(lastUser) ||
      /(\+?\d[\d\s().-]{6,18}\d)/.test(lastUser.replace(/\b\d{4}-\d{2}-\d{2}\b/g, ' ')),
  },
];

function isFrustrated(userTurns: string[]): boolean {
  if (userTurns.length < 2) return false;
  const last = userTurns[userTurns.length - 1].trim();

  if (/\b(already (said|told|asked)|i said|as i said|you'?re not|not what i asked|just answer|answer (me|the question)|stop|forget it|useless|annoying|real person|a human|speak to someone)\b/i.test(last)) {
    return true;
  }
  if (/\?{2,}|!{2,}/.test(last)) return true;
  // Shouting, once it is more than a word or two.
  if (last.length > 8 && last === last.toUpperCase() && /[A-Z]{4,}/.test(last)) return true;

  // Asking the same thing again. Compared on content words so "how much is the
  // sunset cruise" and "so how much for sunset" count as a repeat.
  const norm = (s: string) =>
    new Set((s.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter((w) => w !== 'thanks'));
  const a = norm(last);
  if (a.size >= 2) {
    for (const prev of userTurns.slice(0, -1)) {
      const b = norm(prev);
      if (b.size < 2) continue;
      let shared = 0;
      for (const w of a) if (b.has(w)) shared += 1;
      if (shared / a.size >= 0.6) return true;
    }
  }
  return false;
}

export interface HandoffInput {
  /** User messages in order, oldest first, latest last. */
  userTurns: string[];
  /** Set when the model itself signalled it was unsure. */
  modelUnsure?: boolean;
}

/**
 * Every reason that applies, highest priority first. All of them are reported,
 * because "a date AND a party of nine AND a price question" is a different
 * message to the team than any one of those alone.
 */
export function detectHandoff(input: HandoffInput): Handoff[] {
  const { userTurns, modelUnsure } = input;
  const lastUser = userTurns[userTurns.length - 1] ?? '';
  // The whole conversation, because a date given three messages ago still counts.
  const all = userTurns.join('\n');

  const found: Handoff[] = [];
  for (const r of RULES) {
    if (r.test(all, lastUser)) {
      found.push({ reason: r.reason, label: r.label, to: r.to, priority: r.priority });
    }
  }
  if (isFrustrated(userTurns)) {
    found.push({
      reason: 'frustration',
      label: 'Repeating themselves or losing patience — get a person in now',
      to: TEAM.bookings,
      priority: 85,
    });
  }
  if (modelUnsure) {
    found.push({
      reason: 'uncertain',
      label: 'Lia was not sure of the answer and said so rather than guessing',
      to: TEAM.bookings,
      priority: 40,
    });
  }

  return found.sort((a, b) => b.priority - a.priority);
}

/**
 * The instruction added to Lia's prompt for this turn. She is told what to hand
 * over and to whom; the wording is left to her so it does not read as a script.
 */
export function handoffDirective(handoffs: Handoff[]): string {
  if (!handoffs.length) return '';

  const top = handoffs[0];
  const lines = [
    'HAND THIS OVER, IN THIS REPLY.',
    `Reason: ${top.label}`,
    `Hand to: ${top.to}`,
  ];

  if (handoffs.length > 1) {
    lines.push(`Also flagged: ${handoffs.slice(1).map((h) => h.reason.replace('_', ' ')).join(', ')}.`);
  }

  switch (top.reason) {
    case 'safety':
      lines.push(
        'Do not answer the safety question at all, not even partially, and do not reassure them.',
        `Say you are not comfortable answering safety questions and that ${TEAM.captain}, their captain, is the right person. Then make sure they know it is going to him now.`,
      );
      break;
    case 'weather':
      lines.push(
        'Do not predict conditions and do not say whether a trip will run. That is the captain\'s call on the day.',
        'You may talk about what that time of year is usually like, then hand the specific day over.',
      );
      break;
    case 'blue_hole':
      lines.push(
        'Be genuinely enthusiastic about the Blue Hole — it deserves it — but quote nothing and do not treat it as bookable here.',
        'Say the team builds that day around the group and will come back to them.',
      );
      break;
    case 'price':
      lines.push(
        'Quote nothing. Not a figure, not a range, not "around". Do not confirm a number the guest says.',
        'Point them to the website for prices and the full tour write-ups, ask if they have seen it, and offer to have the team confirm the exact number for their group.',
      );
      break;
    case 'party_size':
      lines.push('More than six changes the boat and the day. Say a person will sort it properly.');
      break;
    case 'date':
      lines.push('Never confirm availability yourself. Get the date and group size, then say who is confirming it.');
      break;
    case 'contact_shared':
      lines.push('Thank them, confirm what you are passing on, and say who will be in touch. Do not ask for the same details twice.');
      break;
    case 'frustration':
      lines.push('Stop selling immediately. No upsell, no extra questions. Apologise once, briefly, and get a person in.');
      break;
    case 'uncertain':
      lines.push('Say plainly that you want to check rather than guess, and who is checking.');
      break;
  }

  lines.push('Say the handoff out loud and use the person\'s name. Stay warm — the conversation continues.');
  return lines.join('\n');
}

/** The team-facing summary, used on the CRM note and the notification. */
export function handoffSummary(handoffs: Handoff[]): string {
  if (!handoffs.length) return '';
  return handoffs.map((h) => `• ${h.label} → ${h.to}`).join('\n');
}
