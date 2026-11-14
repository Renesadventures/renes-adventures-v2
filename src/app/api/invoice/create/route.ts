import { requireAdmin } from '@/lib/admin-auth';
import { FUEL_RATE } from '@/lib/checkout-catalog';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
export const runtime = 'nodejs';

const TAX_RATES = [
  'txr_1T9BaWF2SeVntE6bt6TCL56G', // Belize Sales Tax 12.5%
  'txr_1T9BayF2SeVntE6b1i1GCC5C', // Card Processing Fee 6%
];

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

    // Add invoice items
    let subtotal = 0; // cents, the charter lines only
    for (const item of items) {
      const amount = Math.round(parseFloat(item.amount) * 100);
      subtotal += amount;
      await stripe.invoiceItems.create({
        customer: customer.id,
        amount,
        currency: 'usd',
        description: item.description,
      });
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
      if (fuel > 0) {
        await stripe.invoiceItems.create({
          customer: customer.id,
          amount: fuel,
          currency: 'usd',
          description: FUEL_DESCRIPTION,
        });
      }
    }

    // Create invoice with auto tax rates
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      default_tax_rates: TAX_RATES,
      description: memo || undefined,
      collection_method: 'send_invoice',
      days_until_due: 1,
      metadata: { source: 'renes-adventures-staff-invoice' },
    });

    // Finalize and send
    const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
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
