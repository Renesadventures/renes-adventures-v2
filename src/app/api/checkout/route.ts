import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createLead } from '@/lib/liadesk';
import { CATALOG, quote, type PricedLine } from '@/lib/checkout-catalog';

/**
 * POST /api/checkout
 *
 * Three rules, each learned from real money lost:
 *  1. WHO before PAY. Nine guests started paying between March and November
 *     2026 and walked away, and not one left a name: the site sent them to
 *     Stripe before asking. Now a name plus an email or WhatsApp is required,
 *     and the lead lands in Lia Desk before the payment page opens.
 *  2. The SERVER sets the price (see checkout-catalog.ts). The browser only
 *     says what and how many.
 *  3. Fuel 10% on the boat, then 12.5% tax, then 6% card fee, exactly as the
 *     booking page shows it.
 */

export const runtime = 'nodejs';

/** Guests covered by the boat price; each one after that is an Additional Guest. */
const INCLUDED_GUESTS = 4;
const pick = (name: string) => ({ amount: CATALOG[name].amount, boat: CATALOG[name].boat });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v: unknown, max = 200): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim().slice(0, max);
  return s.length ? s : undefined;
}

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'Payments are not set up yet. Please message us on WhatsApp.' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // ---- 1. Who is booking ------------------------------------------------
  const contact = (body.contact || {}) as Record<string, unknown>;
  const name = clean(contact.name, 120);
  const email = clean(contact.email, 180);
  const phone = clean(contact.phone, 60);
  const tripDate = clean(contact.tripDate, 10);
  const marketingOk = contact.marketingOk === true;
  if (!name) {
    return NextResponse.json({ error: 'Please tell us your name.' }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json({ error: 'Please leave an email or a phone number so René can reach you.' }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'That email address looks incomplete.' }, { status: 400 });
  }

  // ---- 2. What, priced by the server ------------------------------------
  const rawItems = Array.isArray(body.lineItems) ? body.lineItems : [];
  const guestCount = Math.max(1, Math.min(60, Math.floor(Number(body.guestCount)) || 1));
  // Guest-based lines are worked out here from the guest count; whatever the
  // browser sent for them is ignored (otherwise a smaller number pays less).
  const GUEST_LINES = new Set(['Additional Guest', 'Beach BBQ – Extra Guest']);
  let bbqQty = 0;
  const lines: PricedLine[] = [];
  for (const raw of rawItems as Array<Record<string, unknown>>) {
    const pd = (raw?.price_data as Record<string, unknown>) || {};
    const prod = (pd.product_data as Record<string, unknown>) || {};
    const itemName = clean(prod.name ?? raw?.name, 120);
    const qty = Math.floor(Number(raw?.quantity));
    const item = itemName ? CATALOG[itemName] : undefined;
    if (!itemName || !item || !Number.isFinite(qty) || qty < 1 || qty > 50) {
      return NextResponse.json({ error: `We couldn't price "${itemName || 'an item'}". Please refresh the page and try again.` }, { status: 400 });
    }
    if (GUEST_LINES.has(itemName)) {
      if (itemName === 'Beach BBQ – Extra Guest') bbqQty = qty;
      continue;
    }
    lines.push({ name: itemName, quantity: qty, amount: item.amount, boat: item.boat });
  }
  const boatLines = lines.filter((l) => l.boat);
  if (boatLines.length > 1 || boatLines.some((l) => l.quantity !== 1)) {
    return NextResponse.json({ error: 'Please book one trip at a time.' }, { status: 400 });
  }
  const extraGuests = boatLines.length ? Math.max(0, guestCount - INCLUDED_GUESTS) : 0;
  if (extraGuests) {
    lines.push({ name: 'Additional Guest', quantity: extraGuests, ...pick('Additional Guest') });
  }
  // BBQ for extra guests: never fewer plates than extra guests once BBQ is chosen.
  if (bbqQty) {
    lines.push({ name: 'Beach BBQ – Extra Guest', quantity: Math.max(bbqQty, extraGuests), ...pick('Beach BBQ – Extra Guest') });
  }
  if (!lines.length) {
    return NextResponse.json({ error: 'Nothing to book yet.' }, { status: 400 });
  }
  const q = quote(lines);

  const duration = clean(body.duration, 40) || '';
  const tourName = clean(body.tourName, 120) || 'Booking';
  const isTrip = lines.some((l) => l.boat);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map((l) => ({
    price_data: { currency: 'usd', product_data: { name: l.name }, unit_amount: l.amount },
    quantity: l.quantity,
  }));
  if (q.fuel) lineItems.push({ price_data: { currency: 'usd', product_data: { name: 'Fuel Surcharge (10% of boat)' }, unit_amount: q.fuel }, quantity: 1 });
  lineItems.push({ price_data: { currency: 'usd', product_data: { name: 'Belize Sales Tax (12.5%)' }, unit_amount: q.tax }, quantity: 1 });
  lineItems.push({ price_data: { currency: 'usd', product_data: { name: 'Card Processing Fee (6%)' }, unit_amount: q.cardFee }, quantity: 1 });

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-01-28.clover' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.renesadventures.tours';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      ...(email ? { customer_email: email } : {}),
      metadata: {
        tourName,
        guestCount: String(guestCount),
        duration,
        tripDate: tripDate || '',
        source: 'renes-adventures-website',
      },
      // Abandoned payments expire after 2 hours so the follow-up is quick.
      expires_at: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/tours/custom-charter?canceled=true`,
      phone_number_collection: { enabled: true },
      custom_fields: isTrip
        ? [{ key: 'special_requests', label: { type: 'custom', custom: 'Special requests or notes for your captain' }, type: 'text', optional: true }]
        : [],
    });

    // Lead in Lia Desk BEFORE the guest sees the payment page, with who they
    // are, what they want, the quote, and where they came from.
    try {
      const lead = await createLead({
        name,
        email,
        phone,
        interest: tourName,
        message: `Sent to payment on the website: ${tourName}${duration && duration !== 'N/A' ? `, ${duration}` : ''}, ${guestCount} guest(s). Total quoted $${(q.total / 100).toFixed(2)}.`,
        source: 'Website',
        tripDate,
        guests: guestCount,
        funnelStage: 'checkout_started',
        quotedTotal: q.total / 100,
        stripeSession: session.id,
        marketingOk,
        eventKind: 'checkout_started',
        extra: {
          items: lines.map((l) => `${l.quantity} × ${l.name}`).join(', '),
          fuel: `$${(q.fuel / 100).toFixed(2)}`,
          tax: `$${(q.tax / 100).toFixed(2)}`,
          cardFee: `$${(q.cardFee / 100).toFixed(2)}`,
          'OK to send offers': marketingOk ? 'yes' : 'no',
          status: 'sent to payment - not yet paid',
        },
      });
      if (!lead.ok) console.error('[checkout] Lia Desk rejected a lead:', lead.error);
    } catch (err) {
      // Never block a paying customer because the CRM is having a bad day.
      console.error('[checkout] Lia Desk threw (non-fatal):', err);
    }

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('[checkout] Stripe error', err);
    return NextResponse.json({ error: 'The payment page could not open. Please try again or message us on WhatsApp.' }, { status: 500 });
  }
}
