import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { draftReply, attachDraftToLead } from '@/lib/lia-brain/draft';

/**
 * POST /api/lia/draft-reply
 *
 * Hand it an email that needs answering; it hands back Lia's draft. It does
 * not send anything, and there is no code path here that could — see
 * lib/lia-brain/draft.ts for why that line does not move.
 *
 * This is the door for everything outside the website: the inbox watcher, the
 * desktop CoPilot, a person who pastes in an awkward email and wants a first
 * pass. One brain means the reply that comes back follows the same rules as
 * the chat widget — no prices, no safety answers, no weather calls, nothing
 * invented.
 *
 * Pass `leadId` and the draft is also parked on that lead in Lia Desk as an
 * internal note, which is where Chris and Rene already work.
 *
 * Auth is a shared key in `x-lia-key`. Without LIA_INTERNAL_KEY set the route
 * refuses every request rather than defaulting open — an endpoint that writes
 * notes into the CRM is not something to leave unlocked.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({
  kind: z.enum(['form', 'email']).optional().default('email'),
  name: z.string().max(160).optional(),
  email: z.string().max(200).optional(),
  subject: z.string().max(300).optional(),
  body: z.string().min(1).max(8000),
  facts: z.record(z.string(), z.unknown()).optional(),
  leadId: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest) {
  const key = process.env.LIA_INTERNAL_KEY;
  if (!key) {
    console.error('[lia/draft-reply] LIA_INTERNAL_KEY is not set — refusing');
    return NextResponse.json({ ok: false, error: 'Not configured' }, { status: 503 });
  }
  if (req.headers.get('x-lia-key') !== key) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid payload', details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { leadId, ...request } = parsed.data;

  try {
    const draft = await draftReply(request);

    let attached: boolean | undefined;
    if (leadId) {
      const r = await attachDraftToLead(leadId, draft);
      attached = r.ok;
      if (!r.ok) console.error('[lia/draft-reply] could not attach to lead', leadId, r.error);
    }

    return NextResponse.json({
      ok: true,
      sent: false,
      subject: draft.subject,
      body: draft.body,
      needsAPerson: draft.handoffs.map((h) => ({ reason: h.reason, why: h.label, to: h.to })),
      model: draft.model,
      attachedToLead: attached,
    });
  } catch (err) {
    console.error('[lia/draft-reply] failed', err);
    return NextResponse.json({ ok: false, error: 'Could not draft a reply' }, { status: 500 });
  }
}
