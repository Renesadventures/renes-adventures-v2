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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
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
