/**
 * Lia — one brain, every channel.
 *
 * The website chat, Facebook Messenger, Instagram DMs and public comment
 * replies all call liaReply(). That is the point of this file. Before it, the
 * website had a 360-line prompt living inside an API route and the social
 * channels had no brain at all; the guest would have met two different
 * companies depending on where they typed. Now there is one Lia, one set of
 * rules, and one place to change her.
 *
 * Layers, in order, every turn:
 *   1. Sanitise the guest's text (injection attempts, HTML, length).
 *   2. Detect handoff triggers from the whole conversation — no model call, so
 *      it cannot be argued out of firing.
 *   3. Retrieve knowledge from the 15 articles, 9 chapters, tour data and the
 *      twelve-month calendar — with every price stripped out.
 *   4. Ask the model, with the channel's rules and the handoff instruction.
 *   5. Strip currency from the answer as well, in case the model produced a
 *      figure from its own training rather than from us.
 *
 * Step 5 is not paranoia about the model. It is that a wrong price on a
 * four-figure charter is the one mistake that costs real money and real trust,
 * and the fix costs a regex.
 */

import OpenAI from 'openai';
import validator from 'validator';
import xss from 'xss';
import { systemPrompt, SAFE_FALLBACK, type LiaChannel } from './persona';
import { knowledgeBlock, stripMoney } from './knowledge';
import { detectHandoff, handoffDirective, handoffSummary, type Handoff } from './handoff';

export type { LiaChannel } from './persona';
export type { Handoff, HandoffReason } from './handoff';
export { TEAM } from './persona';
export { detectHandoff, handoffSummary } from './handoff';
export { stripMoney } from './knowledge';

export interface LiaTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface LiaReplyInput {
  channel: LiaChannel;
  /** Oldest first. The latest guest message may be included here or passed as `message`. */
  history?: LiaTurn[];
  message: string;
  context?: { pageName?: string; selectedTour?: string };
  now?: Date;
}

export interface LiaReplyResult {
  text: string;
  handoffs: Handoff[];
  /** Team-facing lines for the CRM note and the notification email. */
  summary: string;
  model: string;
  /** True when the model could not be reached and a safe canned reply was used. */
  fallback: boolean;
}

/* ----------------------------------------------------------- sanitisation --- */

const INJECTION_PATTERNS = [
  /ignore\s+(?:previous|above|all|prior)\s+instructions?/gi,
  /disregard\s+(?:previous|above|all|prior|your)/gi,
  /\bsystem\s*:/gi,
  /you\s+are\s+now\b/gi,
  /new\s+instructions?\b/gi,
  /\boverride\b/gi,
  /\bdeveloper\s+mode\b/gi,
  /reveal\s+(?:your|the)\s+(?:prompt|instructions?|system)/gi,
];

/**
 * Exported because the Meta webhook needs it too — a Facebook DM is no more
 * trustworthy than a web form, and before this the webhook did not sanitise
 * anything it passed on.
 */
export function sanitizeGuestText(input: string, max = 2000): { text: string; suspicious: boolean } {
  let out = input;
  let suspicious = false;
  for (const re of INJECTION_PATTERNS) {
    if (re.test(out)) {
      suspicious = true;
      out = out.replace(re, '[removed]');
    }
  }
  out = xss(out);
  out = validator.trim(out).substring(0, max);
  return { text: out, suspicious };
}

/* ------------------------------------------------------------------ model --- */

/** gpt-4o-mini by default. Set LIA_MODEL=gpt-4o to upgrade her judgement. */
function modelName(): string {
  return process.env.LIA_MODEL || 'gpt-4o-mini';
}

const MAX_TOKENS: Record<LiaChannel, number> = {
  web: 320,
  dm: 220,
  email: 500,
};

/** Signs the model hedged. Used to notify the team even when no rule fired. */
function soundsUnsure(text: string): boolean {
  return /\b(i'?m not sure|i am not sure|not certain|i don'?t know|i do not know|let me check|i'?ll (?:find out|check)|i'?ll have to check|can'?t confirm|cannot confirm)\b/i.test(
    text,
  );
}

/* ------------------------------------------------------------------ reply --- */

export async function liaReply(input: LiaReplyInput): Promise<LiaReplyResult> {
  const { channel, message, context, now = new Date() } = input;
  const history = input.history ?? [];

  const { text: cleanMessage, suspicious } = sanitizeGuestText(message);
  if (suspicious) {
    console.warn('[lia] injection attempt stripped', { channel, sample: message.slice(0, 120) });
  }

  // The browser usually replays the latest message inside history; do not
  // count it twice or "repeating themselves" fires on the first message.
  const last = history[history.length - 1];
  const fullHistory: LiaTurn[] =
    last && last.role === 'user' && last.content.trim() === message.trim()
      ? history.slice(0, -1)
      : history;

  const userTurns = [
    ...fullHistory.filter((t) => t.role === 'user').map((t) => sanitizeGuestText(t.content).text),
    cleanMessage,
  ];

  // --- 2. Handoffs, before the model, so the instruction is in the prompt.
  let handoffs = detectHandoff({ userTurns });

  // --- 3. Knowledge, from the conversation not just the last line.
  const knowledge = knowledgeBlock(cleanMessage, userTurns.slice(0, -1), { now });

  const contextLines: string[] = [];
  if (context?.pageName) contextLines.push(`- They are on the ${context.pageName} page of the website.`);
  if (context?.selectedTour) contextLines.push(`- They were looking at: ${context.selectedTour}`);
  contextLines.push(
    `- Today is ${now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.`,
  );

  const system = [
    systemPrompt(channel),
    knowledge,
    contextLines.length ? `RIGHT NOW\n${contextLines.join('\n')}` : '',
    handoffDirective(handoffs),
  ]
    .filter(Boolean)
    .join('\n\n---\n\n');

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('[lia] OPENAI_API_KEY is not set — falling back to a safe canned reply');
    return fallbackResult(handoffs, channel);
  }

  const messages = [
    { role: 'system' as const, content: system },
    ...fullHistory.slice(-10).map((t) => ({
      role: t.role,
      content:
        t.role === 'user'
          ? sanitizeGuestText(t.content).text
          : validator.trim(t.content).substring(0, 2000),
    })),
    { role: 'user' as const, content: cleanMessage },
  ];

  let text: string;
  const model = modelName();
  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model,
      messages: messages as any,
      // Lower than a typical chat assistant: the rules about prices, safety
      // and inventing matter more here than surprise does.
      temperature: 0.6,
      max_tokens: MAX_TOKENS[channel],
    });
    text = completion.choices[0]?.message?.content?.trim() || '';
  } catch (err) {
    console.error('[lia] model call failed', err);
    return fallbackResult(handoffs, channel);
  }

  if (!text) return fallbackResult(handoffs, channel);

  // --- 5. Last line of defence on prices. Also catches a figure the model
  //        invented from its own training rather than from our content.
  const guarded = stripMoney(text);
  if (guarded !== text) {
    console.warn('[lia] a price was stripped from a generated reply', { channel, model });
    if (!handoffs.some((h) => h.reason === 'price')) {
      handoffs = detectHandoff({ userTurns: [...userTurns, 'how much'] });
    }
  }

  // Hedged without a rule firing — still worth a human.
  if (soundsUnsure(guarded) && !handoffs.length) {
    handoffs = detectHandoff({ userTurns, modelUnsure: true });
  }

  return {
    text: guarded,
    handoffs,
    summary: handoffSummary(handoffs),
    model,
    fallback: false,
  };
}

function fallbackResult(handoffs: Handoff[], _channel: LiaChannel): LiaReplyResult {
  const top = handoffs[0]?.reason;
  const text =
    top === 'safety'
      ? SAFE_FALLBACK.safety
      : top === 'price'
        ? SAFE_FALLBACK.price
        : SAFE_FALLBACK.generic;

  // Even with the model unreachable, the enquiry must still reach a person.
  const withHandoff = handoffs.length
    ? handoffs
    : detectHandoff({ userTurns: ['(no reply generated)'], modelUnsure: true });

  return {
    text,
    handoffs: withHandoff,
    summary: handoffSummary(withHandoff),
    model: 'fallback',
    fallback: true,
  };
}
