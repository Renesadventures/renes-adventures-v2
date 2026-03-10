import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
export const runtime = 'nodejs';

const TAX_RATES = [
  'txr_1T9BaWF2SeVntE6bt6TCL56G', // Belize Sales Tax 12.5%
  'txr_1T9BayF2SeVntE6b1i1GCC5C', // Card Processing Fee 6%
];

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });

  const stripe = new Stripe(stripeKey, { apiVersion: '2026-01-28.clover' });

  try {
    const { name, email, memo, items } = await req.json();

    // Create or retrieve customer
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data.length > 0
      ? existing.data[0]
      : await stripe.customers.create({ name, email });

    // Add invoice items
    for (const item of items) {
      await stripe.invoiceItems.create({
        customer: customer.id,
        amount: Math.round(parseFloat(item.amount) * 100),
        currency: 'usd',
        description: item.description,
      });
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
