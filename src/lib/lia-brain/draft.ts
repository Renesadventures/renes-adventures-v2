/**
 * Lia writes the reply. A human sends it.
 *
 * That sentence is the whole design and it is not negotiable. Inbound speed is
 * service: answering someone who messaged us in seconds is why they book.
 * Outbound is different — anything the business initiates in its own name goes
 * past a person first. So when a form comes in, or an email needs answering,
 * Lia drafts it and parks the draft where the team already works. Nothing is
 * sent from here. There is no send function in this file, on purpose.
 *
 * Where the draft lands: an internal note on the lead in Lia Desk. Internal
 * means Odoo will not mail it to the guest no matter what anyone clicks, and
 * the lead is where Chris and Rene are already looking. The note says plainly
 * that it is a draft, carries the subject line, and lists anything that needs
 * the captain before it can go.
 *
 * Why this is worth having at all: the measured difference between a reply in
 * minutes and a reply the next day is most of the booking. A written draft
 * waiting on the lead turns a twenty-minute job into a ten-second one, which
 * is how a two-person operation replies like a ten-person one — without ever
 * letting a machine speak for the business unsupervised.
 */

import { postLeadNote, noteHtml } from '@/lib/liadesk';
import { liaReply, type Handoff } from './index';

export interface DraftRequest {
  /** 'form' = they filled something in. 'email' = they wrote to us. */
  kind: 'form' | 'email';
  name?: string;
  email?: string;
  /** Subject of the email they sent, if any. */
  subject?: string;
  /** What they wrote, or a readable summary of what they submitted. */
  body: string;
  /** Anything else known: tour, date, group size, which form. */
  facts?: Record<string, unknown>;
}

export interface DraftResult {
  subject: string;
  body: string;
  handoffs: Handoff[];
  summary: string;
  model: string;
  fallback: boolean;
}

function factLines(facts?: Record<string, unknown>): string {
  if (!facts) return '';
  const rows = Object.entries(facts)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `- ${k}: ${String(v)}`);
  return rows.length ? `\nWhat we already know about them:\n${rows.join('\n')}` : '';
}

export async function draftReply(req: DraftRequest): Promise<DraftResult> {
  const who = req.name?.trim() || 'there';

  const brief =
    req.kind === 'email'
      ? [
          `An email arrived from ${who}${req.email ? ` <${req.email}>` : ''}.`,
          req.subject ? `Subject: ${req.subject}` : '',
          '',
          'What they wrote:',
          req.body,
          factLines(req.facts),
          '',
          'Write the reply. It will be read by a person before it is sent.',
          'Start your answer with a subject line on its own first line, in the form',
          'Subject: <subject>, then a blank line, then the email itself.',
        ]
          .filter(Boolean)
          .join('\n')
      : [
          `${who} just filled in a form on the website${req.email ? ` and left ${req.email}` : ''}.`,
          '',
          'What they submitted:',
          req.body,
          factLines(req.facts),
          '',
          'Write the reply that goes back to them. It will be read by a person',
          'before it is sent. Acknowledge what they asked for specifically — a',
          'generic "thanks for your enquiry" is worse than nothing.',
          'Start your answer with a subject line on its own first line, in the form',
          'Subject: <subject>, then a blank line, then the email itself.',
        ]
          .filter(Boolean)
          .join('\n');

  // Same brain, same rules, same handoff detection. The email channel only
  // changes the shape of what comes out, never what Lia is allowed to say.
  const result = await liaReply({
    channel: 'email',
    message: brief,
    history: [],
  });

  const m = result.text.match(/^\s*subject:\s*(.+?)\s*\n+([\s\S]*)$/i);
  const subject = m
    ? m[1].trim()
    : req.subject
      ? `Re: ${req.subject}`
      : 'Your enquiry — Rene\'s Adventures, Belize';
  const body = (m ? m[2] : result.text).trim();

  return {
    subject,
    body,
    handoffs: result.handoffs,
    summary: result.summary,
    model: result.model,
    fallback: result.fallback,
  };
}

/**
 * Park the draft on the lead. Never sends; postLeadNote posts an internal note,
 * which Odoo does not email.
 */
export async function attachDraftToLead(
  leadId: number,
  draft: DraftResult,
): Promise<{ ok: boolean; error?: string }> {
  const blockers = draft.handoffs.length
    ? `<p><b>Before you send, this needs a person:</b><br/>${noteHtml(draft.summary)}</p>`
    : '';

  const html = [
    '<p><b>✎ Draft reply from Lia — NOT SENT.</b><br/>',
    '<i>Read it, change what you like, then send it yourself. Lia never emails a guest.</i></p>',
    blockers,
    `<p><b>Subject:</b> ${noteHtml(draft.subject)}</p>`,
    `<p>${noteHtml(draft.body)}</p>`,
    `<p style="color:#888"><small>Written by Lia (${draft.model})${draft.fallback ? ' — model unavailable, this is the safe fallback wording' : ''}. No prices quoted, no safety or weather answered.</small></p>`,
  ].join('');

  return postLeadNote(leadId, html);
}

/**
 * The whole job for one lead: draft, then attach. Call it inside `after()` so
 * the visitor's form submission never waits on a model call.
 */
export async function draftAndAttach(leadId: number, req: DraftRequest): Promise<void> {
  try {
    const draft = await draftReply(req);
    const posted = await attachDraftToLead(leadId, draft);
    if (!posted.ok) {
      console.error('[lia-draft] could not attach the draft to the lead', {
        leadId,
        error: posted.error,
      });
    } else {
      console.log('[lia-draft] draft attached', {
        leadId,
        handoffs: draft.handoffs.map((h) => h.reason),
      });
    }
  } catch (err) {
    // A missing draft must never cost us the lead itself.
    console.error('[lia-draft] drafting failed (non-fatal)', err);
  }
}
