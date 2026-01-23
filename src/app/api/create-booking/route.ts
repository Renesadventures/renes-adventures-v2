import { NextRequest, NextResponse } from 'next/server';

type BookingPayload = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  booking: {
    date: string;
    guests: number;
    specialRequests?: string;
  };
  items: unknown;
  total: number;
};

export async function POST(request: NextRequest) {
  try {
    const bookingData = (await request.json()) as BookingPayload;

    const WHOP_API_KEY = process.env.WHOP_API_KEY;
    const WHOP_PLAN_ID = process.env.WHOP_PLAN_ID || process.env.WHOP_PRODUCT_ID;
    const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!WHOP_API_KEY || !WHOP_PLAN_ID) {
      return NextResponse.json({ error: 'WHOP credentials not configured (WHOP_API_KEY, WHOP_PLAN_ID/WHOP_PRODUCT_ID)' }, { status: 500 });
    }

    if (!NEXT_PUBLIC_BASE_URL) {
      return NextResponse.json({ error: 'NEXT_PUBLIC_BASE_URL not configured' }, { status: 500 });
    }

    const depositUsd = bookingData.total * 0.5;
    const depositCents = Math.max(0, Math.round(depositUsd * 100));

    const whopResponse = await fetch('https://api.whop.com/api/v2/checkout_sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHOP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: WHOP_PLAN_ID,
        price: {
          plan_type: 'one_time',
          currency: 'usd',
          initial_price: depositCents,
          renewal_price: depositCents,
          billing_period: 0,
        },
        redirect_url: `${NEXT_PUBLIC_BASE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          customer_name: `${bookingData.customer.firstName} ${bookingData.customer.lastName}`,
          customer_email: bookingData.customer.email,
          customer_phone: bookingData.customer.phone,
          tour_date: bookingData.booking.date,
          guests: bookingData.booking.guests,
          special_requests: bookingData.booking.specialRequests || '',
          items: JSON.stringify(bookingData.items),
          total: bookingData.total,
          deposit_cents: depositCents,
        },
      }),
    });

    if (!whopResponse.ok) {
      const text = await whopResponse.text();
      return NextResponse.json({ error: `WHOP checkout creation failed: ${text}` }, { status: 500 });
    }

    const whopData = (await whopResponse.json()) as { id: string; purchase_url: string };

    return NextResponse.json({
      checkoutUrl: whopData.purchase_url,
      sessionId: whopData.id,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
