import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

/**
 * Server-side admin check for routes that spend money or act as the business
 * (AI generation, Stripe invoices, social publishing). The admin pages send the
 * password they were unlocked with in the x-admin-password header.
 * Returns a response to send back when the caller is NOT allowed, else null.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  const got = Buffer.from(req.headers.get('x-admin-password') || '');
  const want = Buffer.from(expected);
  if (got.length !== want.length || !timingSafeEqual(got, want)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
