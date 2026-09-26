import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createLead } from '@/lib/liadesk';

export const runtime = 'nodejs';

/**
 * Phone-capture lead magnet.
 *
 * This route used to REQUIRE `CRM_WEBHOOK_URL` and return a 500 when it was
 * missing. That variable has never been set in this project, so every single
 * submission has been failing in front of the visitor and no lead was ever
 * stored. Lia Desk is now the primary destination; the webhook stays supported
 * as an optional extra for anyone who wires one up later.
 *
 * Rule for every lead path on this site: a visitor who filled the form in
 * correctly must never see an error. We would rather log the failure loudly
 * and keep their goodwill than show them a 500.
 */

const RequestSchema = z.object({
  phone: z.string().min(8).max(32),
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().max(180).optional(),
  source: z.string().min(1).max(80).optional(),
  offer: z.string().min(1).max(120).optional(),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  const { phone, name, email, source, offer } = parsed.data;

  // 1. Lia Desk — the system of record.
  const lead = await createLead({
    name: name || phone,
    phone,
    email,
    interest: offer || 'Lead magnet',
    message: offer ? `Requested: ${offer}` : 'Submitted the phone capture form.',
    source: 'Website',
    extra: { formSource: source, offer },
  });

  if (!lead.ok) {
    console.error('[lead-magnet] Lia Desk rejected a lead:', lead.error, {
      phone,
      offer,
    });
  }

  // 2. Optional legacy webhook. Best effort only — never blocks the visitor.
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          createdAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('[lead-magnet] webhook failed (non-fatal):', err);
    }
  }

  return NextResponse.json({ ok: true, leadId: lead.leadId ?? null });
}
