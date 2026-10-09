import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createLead } from '@/lib/liadesk';

/**
 * Meta webhook — receives Facebook Page messages and Instagram DMs.
 *
 * Why this exists: a customer asked about deep sea fishing, Rene saw it on his
 * phone, and Chris could not. Every message that lands in a personal app is a
 * message only one person can answer and nobody can follow up on. This puts
 * them all in one place the whole team can see.
 *
 * Meta calls this URL. Two jobs:
 *   GET  — the one-time handshake when the webhook is first subscribed
 *   POST — every incoming message from then on
 *
 * IMPORTANT, and the reason this will look "broken" until App Review passes:
 * while the Meta app is in Development mode, Meta only delivers messages from
 * people who hold a role on the app. Real customers will NOT arrive until
 * `pages_messaging` and `instagram_manage_messages` have Advanced Access.
 * The code is correct before that; the permission is the gate.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || '';
const APP_SECRET = process.env.META_APP_SECRET || '';
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN || '';

/** The handshake. Meta calls this once when you subscribe the webhook. */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const mode = p.get('hub.mode');
  const token = p.get('hub.verify_token');
  const challenge = p.get('hub.challenge');

  if (mode === 'subscribe' && token && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    // Must be the bare challenge as plain text, or Meta rejects the webhook.
    return new NextResponse(challenge ?? '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  console.error('[meta/webhook] verification failed', {
    mode,
    tokenPresent: Boolean(token),
    secretConfigured: Boolean(VERIFY_TOKEN),
  });
  return new NextResponse('Forbidden', { status: 403 });
}

/**
 * Confirm the request really came from Meta.
 *
 * Without this the endpoint is a public door: anyone who finds the URL could
 * inject fake enquiries into the CRM. Compared with timingSafeEqual so the
 * check cannot be probed byte by byte.
 */
function signatureValid(raw: string, header: string | null): boolean {
  if (!APP_SECRET) return false;
  if (!header || !header.startsWith('sha256=')) return false;
  const expected = crypto
    .createHmac('sha256', APP_SECRET)
    .update(raw, 'utf8')
    .digest('hex');
  const got = header.slice('sha256='.length);
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(got, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Look up the sender's real name. Best effort — never blocks the lead. */
async function senderName(psid: string): Promise<string | null> {
  if (!PAGE_TOKEN || !psid) return null;
  try {
    const url =
      `https://graph.facebook.com/v21.0/${encodeURIComponent(psid)}` +
      `?fields=name,first_name,last_name&access_token=${encodeURIComponent(PAGE_TOKEN)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const j = (await res.json()) as {
      name?: string;
      first_name?: string;
      last_name?: string;
    };
    return (
      j.name ||
      [j.first_name, j.last_name].filter(Boolean).join(' ') ||
      null
    );
  } catch {
    return null;
  }
}

interface MetaMessaging {
  sender?: { id?: string };
  recipient?: { id?: string };
  timestamp?: number;
  message?: {
    mid?: string;
    text?: string;
    is_echo?: boolean;
    attachments?: Array<{ type?: string }>;
  };
}

interface MetaEntry {
  id?: string;
  time?: number;
  messaging?: MetaMessaging[];
}

export async function POST(req: NextRequest) {
  // Raw body first — the signature is computed over the exact bytes Meta sent,
  // so parsing before verifying would break the check.
  const raw = await req.text();

  if (!signatureValid(raw, req.headers.get('x-hub-signature-256'))) {
    console.error('[meta/webhook] rejected: bad or missing signature');
    return new NextResponse('Forbidden', { status: 403 });
  }

  let body: { object?: string; entry?: MetaEntry[] };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  // Facebook Page messages arrive as object "page"; Instagram DMs as
  // "instagram". Everything else (reactions, delivery receipts) is ignored.
  const channel =
    body.object === 'instagram'
      ? 'Instagram'
      : body.object === 'page'
        ? 'Facebook'
        : null;

  if (!channel) return NextResponse.json({ ok: true });

  for (const entry of body.entry ?? []) {
    for (const m of entry.messaging ?? []) {
      // is_echo means the business sent it, not the customer.
      if (!m.message || m.message.is_echo) continue;

      const psid = m.sender?.id ?? '';
      const text = (m.message.text ?? '').trim();
      const hasAttachment = (m.message.attachments?.length ?? 0) > 0;
      if (!text && !hasAttachment) continue;

      const name = (await senderName(psid)) || `${channel} user`;
      const when = m.timestamp
        ? new Date(m.timestamp).toISOString()
        : new Date().toISOString();

      const body_text = text || '(sent an image or attachment, no text)';

      const result = await createLead({
        name,
        interest: `${channel} message`,
        message: body_text,
        // Matches the UTM sources already created in Lia Desk, so the
        // channel report splits properly.
        source: channel === 'Instagram' ? 'Instagram' : 'Facebook Ad',
        extra: {
          channel,
          'Sender ID': psid,
          'Received at': when,
          'Reply in': 'Meta Business Suite inbox',
        },
      });

      if (!result.ok) {
        // Loud, because a lost enquiry is the whole problem this solves.
        console.error('[meta/webhook] LEAD NOT SAVED', {
          channel,
          psid,
          error: result.error,
          text: body_text.slice(0, 120),
        });
      } else {
        console.log('[meta/webhook] lead created', {
          channel,
          leadId: result.leadId,
        });
      }
    }
  }

  // Always 200. A non-200 makes Meta retry and eventually disable the webhook.
  return NextResponse.json({ ok: true });
}
