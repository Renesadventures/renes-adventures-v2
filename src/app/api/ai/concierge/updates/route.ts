import { NextRequest, NextResponse } from 'next/server';
import { liveUpdates, validChatId } from '@/lib/lia-live';

/** GET /api/ai/concierge/updates?chatId=...&since=... — replies a person typed on Rene's Desk. */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const key = validChatId(req.nextUrl.searchParams.get('chatId'));
  const since = (req.nextUrl.searchParams.get('since') || '').slice(0, 19);
  if (!key) return NextResponse.json({ human_active: false, messages: [] });
  const out = await liveUpdates(key, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(since) ? since : '');
  return NextResponse.json(out, { headers: { 'Cache-Control': 'no-store' } });
}
