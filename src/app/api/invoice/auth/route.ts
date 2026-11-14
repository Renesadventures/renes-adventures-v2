import { requireAdmin } from '@/lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';

/**
 * Unlocks the staff pages. The comparison was a plain `!==`, which leaks the
 * password a character at a time to anyone timing the replies; it now goes
 * through the same timing-safe requireAdmin every money route uses. Same
 * header, same password, same responses.
 */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json({ ok: true });
}
