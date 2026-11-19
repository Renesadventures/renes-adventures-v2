import { requireAdmin } from '@/lib/admin-auth';
import { FUEL_RATE } from '@/lib/checkout-catalog';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
export const runtime = 'nodejs';

/**
 * Belize Sales Tax 12.5% and Card Processing Fee 6%, as Stripe tax rate ids.
 *
 * These ids belong to one Stripe account in one mode. A test-mode key cannot
 * see a live-mode rate, so hardcoding them meant the invoice tool broke the
 * moment anyone tried to test it — which is exactly when you least want a
 * surprise. STRIPE_TAX_RATE_IDS (comma separated) overrides them, so the
 * preview deployment can carry test-mode rates while production keeps these.
 */
const TAX_RATES = (process.env.STRIPE_TAX_RATE_IDS || '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

if (!TAX_RATES.length) {
  TAX_RATES.push(
    'txr_1T9BaWF2SeVntE6bt6TCL56G', // Belize Sales Tax 12.5%
    'txr_1T9BayF2SeVntE6b1i1GCC5C', // Card Processing Fee 6%
  );
}

/** The guest reads this on the invoice, so it says the rate out loud. */
const FUEL_DESCRIPTION = `Fuel surcharge (${Math.round(FUEL_RATE * 100)}%)`;

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });

  const stripe = new Stripe(stripeKey, { apiVersion: '2026-01-28.clover' });

  try {
    const { name, email, memo, items, fuelSurcharge } = await req.json();

    // Create or retrieve customer
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data.length > 0
      ? existing.data[0]
      : await stripe.customers.create({ name, email });

    // Build the lines first, in memory, and check them before Stripe sees
    // anything. The old order created Stripe objects as it went, so a single
    // bad number left half-made items behind on the customer.
    const lines: { description: string; amount: number }[] = [];
    let subtotal = 0; // cents, the charter lines only
    for (const item of items) {
      const amount = Math.round(parseFloat(item.amount) * 100);
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { error: `"${item.description || 'A line'}" has no usable amount.` },
          { status: 400 },
        );
      }
      subtotal += amount;
      lines.push({ description: String(item.description || 'Charter'), amount });
    }
    if (!lines.length) {
      return NextResponse.json({ error: 'Add at least one line before sending.' }, { status: 400 });
    }

    // Fuel surcharge: 10% of the lines above, worked out HERE from those lines.
    // The browser only says whether it applies (staff can drop it for a deposit
    // or a repeat guest); it never gets to say how much, same rule as
    // /api/checkout. It goes on as an ordinary line item rather than a third
    // Stripe tax rate, so the Belize sales tax and the card fee below charge on
    // it like any other part of the sale - which is correct, it IS part of the
    // sale - and the guest sees a named line instead of a mystery tax.
    if (fuelSurcharge !== false) {
      const fuel = Math.round(subtotal * FUEL_RATE);
      if (fuel > 0) lines.push({ description: FUEL_DESCRIPTION, amount: fuel });
    }

    // The invoice is created FIRST, empty, and every line is then attached to
    // it by id.
    //
    // This is what sent a customer a $0 invoice. The old code made the items
    // with only a customer id, which makes them *pending* items, and then
    // called invoices.create without saying what to do with pending items.
    // Since Stripe API 2022-11-15 the default for that is "exclude" - so the
    // invoice went out carrying nothing, and the lines stayed on the customer
    // waiting to ambush the next invoice.
    //
    // pending_invoice_items_behavior stays 'exclude' on purpose: it also stops
    // any item orphaned by the old bug from silently landing on a new invoice.
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      default_tax_rates: TAX_RATES,
      description: memo || undefined,
      collection_method: 'send_invoice',
      days_until_due: 1,
      pending_invoice_items_behavior: 'exclude',
      metadata: { source: 'renes-adventures-staff-invoice' },
    });
    if (!invoice.id) {
      return NextResponse.json({ error: 'Stripe did not return an invoice id.' }, { status: 500 });
    }

    for (const line of lines) {
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        amount: line.amount,
        currency: 'usd',
        description: line.description,
      });
    }

    // Finalize, then refuse to send a zero invoice. A guest receiving a bill
    // for $0.00 is worse than an error on our screen: it looks like a mistake
    // they might be entitled to, and it has to be explained to them.
    const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
    if (!finalized.total || finalized.total <= 0) {
      return NextResponse.json(
        { error: 'The invoice came to $0.00, so nothing was sent. Check the amounts and try again.' },
        { status: 500 },
      );
    }
    await stripe.invoices.sendInvoice(finalized.id);

    const total = finalized.total / 100;
    return NextResponse.json({
      ok: true,
      total: '$' + total.toFixed(2),
      invoiceUrl: finalized.hosted_invoice_url || `https://dashboard.stripe.com/invoices/${finalized.id}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invoice error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
