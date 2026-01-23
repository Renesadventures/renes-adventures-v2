import { NextRequest, NextResponse } from 'next/server';

type WhopCheckoutSession = {
  id: string;
  redirect_url?: string;
  affiliate_code?: string;
  metadata?: Record<string, unknown>;
  plan_id?: string;
  purchase_url?: string;
  company_id?: string;
};

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const WHOP_API_KEY = process.env.WHOP_API_KEY;
    if (!WHOP_API_KEY) {
      return NextResponse.json({ error: 'WHOP credentials not configured' }, { status: 500 });
    }

    const whopResponse = await fetch(`https://api.whop.com/api/v2/checkout_sessions/${encodeURIComponent(sessionId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${WHOP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!whopResponse.ok) {
      const text = await whopResponse.text();
      return NextResponse.json({ error: `Failed to fetch session: ${text}` }, { status: 500 });
    }

    const data = (await whopResponse.json()) as WhopCheckoutSession;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch booking confirmation' }, { status: 500 });
  }
}
