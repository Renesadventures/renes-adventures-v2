import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CATALOG, quote, type PricedLine } from '@/lib/checkout-catalog';
import { postLeadNote, noteHtml, updateLead } from '@/lib/liadesk';

/**
 * POST /api/desk/quote — the "Send quote" button on Rene's Desk.
 *
 * Rene's Desk (on the Lia Desk server) says WHAT (half or full day, guests,
 * snorkel sets); the price comes from the same catalog and the same maths as
 * the website booking page, so a quote can never disagree with the website.
 * Returns a Stripe payment page (valid 24 h, Stripe's maximum) plus the
 * breakdown, and writes the quote onto the guest's lead. When the guest pays,
 * the normal Stripe webhook finds the lead by its session and the Desk rings
 * "BOOKED".
 *
 * Auth: x-lia-key must equal LIA_INTERNAL_KEY.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const INCLUDED_GUESTS = 4;
const TOURS = {
  half: { item: "Rene's Custom Adventure – Half Day", label: 'Half Day private charter' },
  full: { item: "Rene's Custom Adventure – Full Day (BBQ Included)", label: 'Full Day private charter with beach BBQ' },
} as const;

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[<>]/g, '').trim().slice(0, max) : '');

export async function POST(req: NextRequest) {
  const key = process.env.LIA_INTERNAL_KEY || '';
  if (!key || !same(req.headers.get('x-lia-key') || '', key)) {
    return NextResponse.json({ error: 'not allowed' }, { status: 401 });
  }
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  const tour = body.tour === 'full' ? 'full' : 'half';
  const guests = Math.max(1, Math.min(40, Math.floor(Number(body.guests)) || 1));
  const snorkel = Math.max(0, Math.min(40, Math.floor(Number(body.snorkelSets)) || 0));
  const name = clean(body.name, 120);
  const email = clean(body.email, 180);
  const tripDate = /^\d{4}-\d{2}-\d{2}$/.test(String(body.tripDate || '')) ? String(body.tripDate) : '';
  const pickup = clean(body.pickup, 120);
  const leadId = Number(body.leadId) || 0;
  const by = clean(body.by, 40) || "Rene's team";

  const t = TOURS[tour];
  const lines: PricedLine[] = [{ name: t.item, quantity: 1, amount: CATALOG[t.item].amount, boat: true }];
  const extra = Math.max(0, guests - INCLUDED_GUESTS);
  if (extra) {
    lines.push({ name: 'Additional Guest', quantity: extra, amount: CATALOG['Additional Guest'].amount, boat: CATALOG['Additional Guest'].boat });
    if (tour === 'full') {
      lines.push({ name: 'Beach BBQ – Extra Guest', quantity: extra, amount: CATALOG['Beach BBQ – Extra Guest'].amount, boat: false });
    }
  }
  if (snorkel) lines.push({ name: 'Snorkel Gear Rental', quantity: snorkel, amount: CATALOG['Snorkel Gear Rental'].amount, boat: false });
  const q = quote(lines);
  const cashTotal = q.total - q.cardFee;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map((l) => ({
    price_data: { currency: 'usd', product_data: { name: l.name }, unit_amount: l.amount },
    quantity: l.quantity,
  }));
  if (q.fuel) lineItems.push({ price_data: { currency: 'usd', product_data: { name: 'Fuel Surcharge (10% of boat)' }, unit_amount: q.fuel }, quantity: 1 });
  lineItems.push({ price_data: { currency: 'usd', product_data: { name: 'Belize Sales Tax (12.5%)' }, unit_amount: q.tax }, quantity: 1 });
  lineItems.push({ price_data: { currency: 'usd', product_data: { name: 'Card Processing Fee (6%)' }, unit_amount: q.cardFee }, quantity: 1 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.renesadventures.tours';
  const stripe = new Stripe(stripeKey, { apiVersion: '2026-01-28.clover' });
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      ...(email ? { customer_email: email } : {}),
      metadata: {
        tourName: "Rene's Custom Adventure",
        guestCount: String(guests),
        duration: tour === 'full' ? 'Full Day' : 'Half Day',
        tripDate,
        pickup,
        source: 'renes-desk-quote',
        leadId: leadId ? String(leadId) : '',
      },
      expires_at: Math.floor(Date.now() / 1000) + 23 * 60 * 60,
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/tours/custom-charter`,
      phone_number_collection: { enabled: true },
      custom_fields: [{ key: 'special_requests', label: { type: 'custom', custom: 'Special requests or notes for your captain' }, type: 'text', optional: true }],
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Stripe error' }, { status: 500 });
  }

  const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
  const breakdown = [
    ...lines.map((l) => `${l.quantity > 1 ? `${l.quantity} × ` : ''}${l.name}: ${usd(l.amount * l.quantity)}`),
    ...(q.fuel ? [`Fuel surcharge (10% of boat): ${usd(q.fuel)}`] : []),
    `Belize sales tax (12.5%): ${usd(q.tax)}`,
    `Card processing (6%): ${usd(q.cardFee)}`,
  ];

  if (leadId) {
    // Link the lead to this payment page so the webhook can mark it paid.
    await updateLead(leadId, { x_stripe_session: session.id, x_quoted_total: q.total / 100, x_funnel_stage: 'checkout_started' });
    await postLeadNote(
      leadId,
      noteHtml(
        `💵 Quote sent by ${by}: ${t.label}, ${guests} guest(s)${snorkel ? `, ${snorkel} snorkel set(s)` : ''}${tripDate ? `, ${tripDate}` : ''}${pickup ? `, pickup ${pickup}` : ''}.\n` +
          `${breakdown.join('\n')}\nTotal by card ${usd(q.total)} · cash/Venmo ${usd(cashTotal)}.\nPayment link (24 h): ${session.url}`,
      ),
    );
  }

  return NextResponse.json({
    ok: true,
    url: session.url,
    expiresAt: session.expires_at,
    tourLabel: t.label,
    guests,
    snorkel,
    breakdown,
    total: q.total / 100,
    cashTotal: cashTotal / 100,
  });
}
