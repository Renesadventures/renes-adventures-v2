import { NextRequest, NextResponse, after } from 'next/server';
import crypto from 'crypto';
import { createLead, findOpenLead, postLeadNote, noteHtml } from '@/lib/liadesk';
import { liaReply, sanitizeGuestText } from '@/lib/lia-brain';
import {
  autoreplyEnabled,
  publicReplyText,
  replyToComment,
  sendDirectMessage,
  sendPrivateReply,
} from '@/lib/lia-brain/meta-graph';
import {
  describeMessage,
  markRead,
  sendWhatsApp,
  waIdToPhone,
  whatsappAutoreplyEnabled,
  type WhatsAppChangeValue,
} from '@/lib/lia-brain/whatsapp';

/**
 * Facebook and Instagram — every raised hand, into one place.
 *
 * Why this exists: a customer asked about deep sea fishing, Rene saw it on his
 * phone, Chris could not, and nobody could follow it up. Five comments sat
 * unanswered in public where other prospects could watch them rot. A message
 * that lands in one person's app is a message only one person can answer.
 *
 * Two kinds of raised hand arrive here:
 *   - `messaging` — a direct message on Messenger or Instagram.
 *   - `changes` with field `comments` — a comment on a post, a Reel or an ad.
 *     This is the valuable one. A comment costs the customer nothing, and
 *     Meta's Private Reply lets us turn it into a DM once. Converting public
 *     interest into a private conversation is the entire engine; the reply
 *     itself is the easy part.
 *
 * Three things always happen, whatever the switches say:
 *   1. The signature is verified before the body is parsed.
 *   2. A lead is created in Lia Desk, so the team sees it.
 *   3. Lia's reply is written onto that lead as a draft.
 *
 * Sending is the only part that is gated. LIA_SOCIAL_AUTOREPLY=on is off by
 * default, so until App Review passes and Chris says go, this reads everything
 * and answers nobody — and the drafts are still waiting on each lead.
 *
 * A note on Development mode: while the Meta app is unreviewed, Meta only
 * delivers events from people who hold a role on the app. Real customers will
 * not arrive until `pages_messaging`, `instagram_manage_messages` and
 * `instagram_manage_comments` have Advanced Access. The code is correct before
 * that; the permission is the gate.
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
 * Without this the endpoint is a public door: anyone who found the URL could
 * inject fake enquiries into the CRM and make Lia answer them. Compared with
 * timingSafeEqual so the check cannot be probed byte by byte.
 */
function signatureValid(raw: string, header: string | null): boolean {
  if (!APP_SECRET) return false;
  if (!header || !header.startsWith('sha256=')) return false;
  const expected = crypto.createHmac('sha256', APP_SECRET).update(raw, 'utf8').digest('hex');
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
    const j = (await res.json()) as { name?: string; first_name?: string; last_name?: string };
    return j.name || [j.first_name, j.last_name].filter(Boolean).join(' ') || null;
  } catch {
    return null;
  }
}

/**
 * Meta retries a webhook it thinks failed, and a retried comment would mean a
 * second public reply. Serverless instances do not share memory, so this stops
 * the common case rather than every case — enough, because a Private Reply is
 * one-per-comment at Meta's end too and a duplicate send simply fails there.
 */
const SEEN = new Set<string>();
function firstTime(id: string): boolean {
  if (!id) return true;
  if (SEEN.has(id)) return false;
  SEEN.add(id);
  if (SEEN.size > 500) SEEN.delete(SEEN.values().next().value as string);
  return true;
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

interface MetaChangeValue {
  // Comment payloads differ slightly between Facebook and Instagram; both
  // shapes are read here rather than assuming one.
  id?: string;
  comment_id?: string;
  message?: string;
  text?: string;
  from?: { id?: string; name?: string; username?: string };
  post_id?: string;
  media?: { id?: string };
  item?: string;
  verb?: string;
  parent_id?: string;
}

interface MetaEntry {
  id?: string;
  time?: number;
  messaging?: MetaMessaging[];
  changes?: Array<{ field?: string; value?: MetaChangeValue & WhatsAppChangeValue }>;
}

type Channel = 'Facebook' | 'Instagram' | 'WhatsApp';

/** Lead + Lia's draft on it. The part that happens no matter what is switched off. */
async function recordAndDraft(opts: {
  channel: Channel;
  name: string;
  text: string;
  kind: 'DM' | 'comment' | 'message';
  /** WhatsApp gives us a real dialable number. Nothing else here does. */
  phone?: string;
  extra: Record<string, unknown>;
}): Promise<{ leadId?: number; reply: string; handoffs: string[] }> {
  const { channel, name, text, kind, phone, extra } = opts;

  // Both land as a DM: a comment is answered by Private Reply, which is a DM.
  const result = await liaReply({ channel: 'dm', message: text, history: [] });

  const lead = await createLead({
    name,
    phone,
    interest: `${channel} ${kind}`,
    message: [
      text,
      '',
      result.handoffs.length ? `Lia handed this over:\n${result.summary}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    // Matches the UTM sources already in Lia Desk so channel reporting splits.
    source:
      channel === 'Instagram'
        ? 'Instagram'
        : channel === 'WhatsApp'
          ? 'WhatsApp'
          : 'Facebook Ad',
    extra,
  });

  if (!lead.ok) {
    // Loud, because a lost enquiry is the whole problem this solves.
    console.error('[meta/webhook] LEAD NOT SAVED', {
      channel,
      kind,
      error: lead.error,
      text: text.slice(0, 120),
    });
    return { reply: result.text, handoffs: result.handoffs.map((h) => h.reason) };
  }

  // Two separate switches. Answering a stranger's public comment and answering
  // someone who already has the business's number are not the same risk.
  const sendingOn = channel === 'WhatsApp' ? whatsappAutoreplyEnabled() : autoreplyEnabled();
  const inbox = channel === 'WhatsApp' ? 'WhatsApp itself' : 'the Meta Business Suite inbox';
  await postLeadNote(
    lead.leadId!,
    [
      `<p><b>✎ Lia's reply to this ${channel} ${kind}${sendingOn ? ' — SENT' : ' — NOT SENT'}.</b><br/>`,
      sendingOn
        ? `<i>Auto-reply is on, so this went to them already. Follow up in ${inbox}.</i></p>`
        : `<i>Auto-reply is off. Read it, change what you like, then send it from ${inbox}.</i></p>`,
      result.handoffs.length
        ? `<p><b>Needs a person:</b><br/>${noteHtml(result.summary)}</p>`
        : '',
      `<p>${noteHtml(result.text)}</p>`,
      `<p style="color:#888"><small>Written by Lia (${result.model}). No prices quoted, no safety or weather answered.</small></p>`,
    ].join(''),
  );

  return {
    leadId: lead.leadId,
    reply: result.text,
    handoffs: result.handoffs.map((h) => h.reason),
  };
}

/**
 * WhatsApp — the one channel where the guest already trusts the number.
 *
 * Two different things arrive here on a coexisting number. A guest writing in
 * is a lead. Rene answering from his own phone is not a new lead, but it is the
 * thing Chris and Eddy have never been able to see, so it gets written onto the
 * conversation they are already reading.
 */
async function handleWhatsAppEntry(entry: MetaEntry): Promise<void> {
  for (const change of entry.changes ?? []) {
    if (change.field !== 'messages') continue;
    const v = change.value ?? {};

    // The contacts array is the only place the guest's display name appears.
    const names = new Map<string, string>();
    for (const c of v.contacts ?? []) {
      if (c.wa_id) names.set(c.wa_id, (c.profile?.name || '').trim());
    }

    /* ------------------------------------------- the guest wrote to us */
    for (const m of v.messages ?? []) {
      if (!firstTime(m.id ?? '')) continue;

      const waId = m.from ?? '';
      const phone = waIdToPhone(waId);
      const described = describeMessage(m);
      if (!described) continue;

      // A WhatsApp message is no more trustworthy than a web form.
      const { text: clean } = sanitizeGuestText(described);
      const text = clean || described;
      const name = names.get(waId) || `WhatsApp ${phone || 'guest'}`;
      // WhatsApp timestamps are seconds, not milliseconds.
      const when = m.timestamp
        ? new Date(Number(m.timestamp) * 1000).toISOString()
        : new Date().toISOString();

      // Two blue ticks within a second tell the guest somebody is there,
      // before Lia has written a word.
      await markRead(m.id ?? '');

      const { leadId, reply, handoffs } = await recordAndDraft({
        channel: 'WhatsApp',
        name,
        text,
        kind: 'message',
        phone,
        extra: {
          channel: 'WhatsApp',
          'WhatsApp number': phone,
          'Received at': when,
          'Reply in': 'WhatsApp — from the phone or from here',
        },
      });

      // An inbound message opens WhatsApp's 24-hour window, so replying to the
      // message we just received never needs an approved template.
      if (reply) {
        const sent = await sendWhatsApp(waId, reply);
        if (!sent.ok) console.error('[meta/webhook] WhatsApp send failed', sent.error);
        console.log('[meta/webhook] WhatsApp handled', { leadId, sent: sent.sent, handoffs });
      }
    }

    /* ------------------- Rene answered from the phone app (Coexistence) */
    for (const e of v.message_echoes ?? []) {
      if (!firstTime(e.id ?? '')) continue;
      const said = (e.text?.body || '').trim();
      if (!said) continue;

      const phone = waIdToPhone(e.to ?? '');
      const leadId = await findOpenLead(undefined, phone);
      // Rene starting a brand new chat with someone is not an enquiry.
      if (!leadId) continue;

      await postLeadNote(
        leadId,
        `<p><b>\u{1F4F1} Rene replied from his phone</b></p><p>${noteHtml(said)}</p>` +
          `<p style="color:#888"><small>Sent on WhatsApp to ${noteHtml(phone)}. ` +
          `Logged here so Chris and Eddy can see it without being on that phone.</small></p>`,
      );
    }
  }
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

  const channel: Channel | null =
    body.object === 'instagram'
      ? 'Instagram'
      : body.object === 'page'
        ? 'Facebook'
        : body.object === 'whatsapp_business_account'
          ? 'WhatsApp'
          : null;

  if (!channel) return NextResponse.json({ ok: true });

  // Meta disables a webhook that is slow or non-200, so the acknowledgement
  // goes back immediately and the work happens after it.
  const entries = body.entry ?? [];

  after(async () => {
    for (const entry of entries) {
      /* -------------------------------------------------------- WhatsApp */
      if (channel === 'WhatsApp') {
        await handleWhatsAppEntry(entry);
        continue;
      }

      /* ---------------------------------------------------- direct messages */
      for (const m of entry.messaging ?? []) {
        // is_echo means the business sent it, not the customer.
        if (!m.message || m.message.is_echo) continue;
        if (!firstTime(m.message.mid ?? '')) continue;

        const psid = m.sender?.id ?? '';
        const rawText = (m.message.text ?? '').trim();
        const hasAttachment = (m.message.attachments?.length ?? 0) > 0;
        if (!rawText && !hasAttachment) continue;

        // A Facebook DM is no more trustworthy than a web form.
        const { text: clean } = sanitizeGuestText(rawText);
        const text = clean || '(sent an image or attachment, no text)';
        const name = (await senderName(psid)) || `${channel} user`;
        const when = m.timestamp ? new Date(m.timestamp).toISOString() : new Date().toISOString();

        // Outside Meta's 24-hour window only an approved template may be sent,
        // and we have none — so an old thread gets a draft and nothing else.
        const ageHours = m.timestamp ? (Date.now() - m.timestamp) / 3_600_000 : 0;
        const withinWindow = ageHours < 24;

        const { leadId, reply, handoffs } = await recordAndDraft({
          channel,
          name,
          text,
          kind: 'DM',
          extra: {
            channel,
            'Sender ID': psid,
            'Received at': when,
            'Reply in': 'Meta Business Suite inbox',
          },
        });

        if (withinWindow && reply) {
          const sent = await sendDirectMessage(psid, reply);
          if (!sent.ok) console.error('[meta/webhook] DM send failed', sent.error);
          console.log('[meta/webhook] DM handled', {
            channel,
            leadId,
            sent: sent.sent,
            handoffs,
          });
        } else if (!withinWindow) {
          console.log('[meta/webhook] outside the 24h window — draft only', { channel, leadId });
        }
      }

      /* ------------------------------------------------------ comments, ads */
      for (const change of entry.changes ?? []) {
        if (change.field !== 'comments') continue;
        const v = change.value ?? {};
        if (v.verb && v.verb !== 'add') continue;

        const commentId = v.comment_id || v.id || '';
        if (!firstTime(commentId)) continue;

        const rawText = (v.message || v.text || '').trim();
        if (!rawText) continue;

        // Do not reply to the page's own comments.
        const fromName = v.from?.name || v.from?.username || `${channel} commenter`;
        const { text } = sanitizeGuestText(rawText);
        if (!text) continue;

        const { leadId, reply, handoffs } = await recordAndDraft({
          channel,
          name: fromName,
          text,
          kind: 'comment',
          extra: {
            channel,
            'Commented on': v.post_id || v.media?.id || 'a post or ad',
            'Comment ID': commentId,
            'Their comment': text.slice(0, 300),
            'Reply in': 'Meta Business Suite inbox',
          },
        });

        if (reply) {
          // The DM carries the real answer. Private Reply is one per comment.
          const dm = await sendPrivateReply(commentId, reply);
          if (!dm.ok) console.error('[meta/webhook] private reply failed', dm.error);

          // Then the public one-liner that tells them to look for it.
          const pub = await replyToComment(commentId, publicReplyText(commentId));
          if (!pub.ok) console.error('[meta/webhook] public reply failed', pub.error);

          console.log('[meta/webhook] comment handled', {
            channel,
            leadId,
            dmSent: dm.sent,
            publicSent: pub.sent,
            handoffs,
          });
        }
      }
    }
  });

  // Always 200. A non-200 makes Meta retry and eventually disable the webhook.
  return NextResponse.json({ ok: true });
}
