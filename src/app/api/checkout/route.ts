import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not set' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-01-28.clover',
  });

  try {
    const { lineItems, guestCount, duration, tourName } = await req.json();

    // Calculate sequential taxes matching the website display:
    // 1. Sum base line items
    // 2. Apply 12.5% Belize Sales Tax on subtotal
    // 3. Apply 6% Card Processing Fee on (subtotal + tax)
    const baseSubtotal: number = lineItems.reduce(
      (sum: number, item: { price_data: { unit_amount: number }; quantity: number }) =>
        sum + item.price_data.unit_amount * item.quantity,
      0
    );

    const taxAmount = Math.round(baseSubtotal * 0.125);
    const afterTax = baseSubtotal + taxAmount;
    const feeAmount = Math.round(afterTax * 0.06);

    const allLineItems = [
      ...lineItems,
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Belize Sales Tax (12.5%)' },
          unit_amount: taxAmount,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Card Processing Fee (6%)' },
          unit_amount: feeAmount,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: allLineItems,
      metadata: {
        tourName,
        guestCount: String(guestCount),
        duration,
        source: 'renes-adventures-website',
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tours/custom-charter?canceled=true`,
      phone_number_collection: { enabled: true },
      custom_fields: [
        {
          key: 'special_requests',
          label: { type: 'custom', custom: 'Special requests or notes for your captain' },
          type: 'text',
          optional: true,
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
