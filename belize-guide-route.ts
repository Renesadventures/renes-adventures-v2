import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const runtime = 'nodejs';

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function isEmail(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = body?.email;
  const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
  const visitDate = typeof body?.visitDate === 'string' ? body.visitDate : '';
  const interests = Array.isArray(body?.interests) ? body.interests : [];
  const tier = body?.tier === 'paid' ? 'paid' : 'free';

  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }

  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }

  const lead = {
    name,
    email: email.trim(),
    phone,
    visitDate,
    interests,
    tier,
    source: 'belize-intelligence',
    createdAt: new Date().toISOString(),
  };

  try {
    // Store in Redis if configured
    if (redis) {
      const key = `lead:belize-guide:${email.trim().toLowerCase()}`;
      await redis.set(key, JSON.stringify(lead), { ex: 60 * 60 * 24 * 90 }); // 90 day TTL
      await redis.lpush('leads:belize-guide', JSON.stringify(lead));
    } else {
      console.log('Belize guide lead (Redis not configured):', JSON.stringify(lead));
    }

    // Fire CRM webhook if configured
    const webhookUrl = process.env.CRM_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      }).catch(() => {
        // non-blocking
      });
    }

    return NextResponse.json({
      ok: true,
      tier,
      message:
        tier === 'paid'
          ? 'Your Complete Belize Survival Kit is being prepared!'
          : 'Free Belize tips are on the way!',
    });
  } catch (err) {
    console.error('Belize guide lead capture error:', err);
    return NextResponse.json(
      { error: 'Failed to save your information. Please try again.' },
      { status: 500 }
    );
  }
}
