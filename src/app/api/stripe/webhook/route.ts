import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  createLead,
  leadForStripeSession,
  ldCall,
  logOpsEvent,
  noteHtml,
  opsEventExists,
  postLeadNote,
  updateLead,
} from '@/lib/liadesk';

/**
 * POST /api/stripe/webhook
 *
 * Stripe tells us what happened to each payment page; Lia Desk is updated so
 * it stays the one place that knows:
 *   checkout.session.completed (paid) -> lead PAID (won), amount recorded
 *   checkout.session.expired          -> lead ABANDONED + follow-up note
 *                                        (never downgrades a lead that paid,
 *                                        never invents a new lead)
 *   refund.created                    -> that refund's amount recorded
 *
 * Rules: signature-checked; each Stripe object is processed once (the
 * activity record is the receipt); any failed write to Lia Desk returns 500
 * so Stripe retries instead of the update being lost.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const usd = (cents?: number | null) => `$${((cents || 0) / 100).toFixed(2)}`;

class RetryLater extends Error {}
function must(ok: boolean | { ok: boolean; error?: string }, what: string) {
  const good = typeof ok === 'boolean' ? ok : ok.ok || /already recorded/i.test(ok.error || '');
  if (!good) throw new RetryLater(`${what} failed`);
}

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) {
    console.error('[stripe/webhook] STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET missing');
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }
  const stripe = new Stripe(key, { apiVersion: '2026-01-28.clover' });
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, req.headers.get('stripe-signature') || '', secret);
  } catch (err) {
    console.error('[stripe/webhook] bad signature', err);
    return NextResponse.json({ error: 'bad signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.expired') {
      const s = event.data.object as Stripe.Checkout.Session;
      const paid = event.type === 'checkout.session.completed' && s.payment_status === 'paid';
      if (event.type === 'checkout.session.completed' && !paid) {
        return NextResponse.json({ received: true, note: 'completed but not paid yet' });
      }
      const kind = paid ? 'payment_succeeded' : 'checkout_expired';
      if (await opsEventExists(kind, s.id)) return NextResponse.json({ received: true, duplicate: true });

      const cd = s.customer_details;
      const what = s.metadata?.tourName || 'Booking';
      const found = await leadForStripeSession(s.id);
      let leadId = found?.id;

      if (!leadId && paid && (cd?.email || cd?.phone)) {
        // A payment from before contact capture existed: it still becomes a lead.
        const made = await createLead({
          name: cd?.name || cd?.email || 'Website guest',
          email: cd?.email || undefined,
          phone: cd?.phone || undefined,
          interest: what,
          source: 'Website',
          stripeSession: s.id,
          quotedTotal: (s.amount_total || 0) / 100,
          funnelStage: 'paid',
          eventKind: 'checkout_started',
          attribution: {},
        });
        must(made.ok, 'create lead');
        leadId = made.leadId;
      }

      if (leadId) {
        const alreadyPaid = found?.stage === 'paid';
        if (paid || !alreadyPaid) {
          const vals: Record<string, unknown> = { x_funnel_stage: paid ? 'paid' : 'abandoned' };
          if (paid) vals.x_paid_total = (s.amount_total || 0) / 100;
          if (cd?.phone) vals.phone = cd.phone;
          if (cd?.email) vals.email_from = cd.email;
          must(await updateLead(leadId, vals), 'update lead');
          const special = s.custom_fields?.find((f) => f.key === 'special_requests')?.text?.value;
          must(
            await postLeadNote(
              leadId,
              noteHtml(
                paid
                  ? `PAID ${usd(s.amount_total)} for ${what} (${s.metadata?.duration || ''}, ${s.metadata?.guestCount || '?'} guests${s.metadata?.tripDate ? `, ${s.metadata.tripDate}` : ''}).` +
                      (special ? `\nNotes for the captain: ${special}` : '') +
                      '\nConfirm the date with René and send the welcome message.'
                  : `Did NOT finish paying for ${what} (${usd(s.amount_total)} quoted). The payment page expired.\nFollow up: a friendly WhatsApp or email to ask if they have questions or prefer Venmo/cash.`,
              ),
              { notify: true },
            ),
            'post note',
          );
          if (paid) {
            try {
              await ldCall('crm.lead', 'action_set_won', [[leadId]]);
            } catch {
              /* stage is a nice-to-have; fields and note are what matter */
            }
          }
        }
      }

      // Last: the receipt that this session was handled.
      must(
        await logOpsEvent({
          kind,
          channel: 'stripe',
          summary: `${what}: ${usd(s.amount_total)}${cd?.name ? ` · ${cd.name.split(' ')[0]}` : ''}`,
          value: paid ? (s.amount_total || 0) / 100 : 0,
          leadId: leadId || undefined,
          externalRef: s.id,
          payload: { duration: s.metadata?.duration, guests: s.metadata?.guestCount, tripDate: s.metadata?.tripDate },
        }),
        'log activity',
      );
    } else if (event.type === 'refund.created') {
      const r = event.data.object as Stripe.Refund;
      if (await opsEventExists('refund', r.id)) return NextResponse.json({ received: true, duplicate: true });
      must(
        await logOpsEvent({
          kind: 'refund',
          channel: 'stripe',
          summary: `Refund ${usd(r.amount)}${r.reason ? ` (${r.reason})` : ''}`,
          value: -((r.amount || 0) / 100),
          externalRef: r.id,
          payload: { charge: typeof r.charge === 'string' ? r.charge : r.charge?.id },
        }),
        'log refund',
      );
    }
  } catch (err) {
    // Tell Stripe to retry later rather than lose the update.
    console.error('[stripe/webhook] handler failed', event.type, err);
    return NextResponse.json({ error: 'retry' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
