/**
 * The three outbound calls to Meta. Nothing else in the codebase talks to Graph.
 *
 * All three are no-ops unless LIA_SOCIAL_AUTOREPLY is set to "on". That switch
 * is off by default and must stay off until two things are true: App Review has
 * granted the permissions, and Chris has agreed to let Lia answer in his
 * inboxes. Until then the whole social engine runs in draft mode — it reads
 * everything, logs everything, writes the reply onto the lead, and sends
 * nothing. One environment variable turns it on, and the same one turns it off
 * in seconds if a reply ever reads wrong.
 *
 * What Meta permits, and why the code is shaped this way:
 *  - A Private Reply is ONE automated DM per comment. Use it on the comment,
 *    not on a schedule, and never twice.
 *  - There is a 24-hour window after the customer's last message in which a
 *    normal reply is allowed. Outside it, only an approved template, which we
 *    do not have — so an old thread gets a draft, not a send.
 *  - HUMAN_AGENT extends that to seven days but only for genuine human
 *    replies. Lia must never use it. There is no code here that can.
 *  - 750 private replies an hour is the ceiling. Nowhere near it, but the
 *    throttle below exists so a burst never looks like spam to Meta.
 */

const GRAPH = 'https://graph.facebook.com/v21.0';

export function autoreplyEnabled(): boolean {
  return (process.env.LIA_SOCIAL_AUTOREPLY || '').toLowerCase() === 'on';
}

function pageToken(): string {
  return process.env.META_PAGE_ACCESS_TOKEN || '';
}

/** A short random pause. A burst of instant identical sends is what spam detection looks for. */
export async function throttle(): Promise<void> {
  await new Promise((r) => setTimeout(r, 400 + Math.floor(Math.random() * 900)));
}

async function post(path: string, payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  const token = pageToken();
  if (!token) return { ok: false, error: 'META_PAGE_ACCESS_TOKEN is not set' };
  try {
    const res = await fetch(`${GRAPH}/${path}?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { ok: false, error: `Graph HTTP ${res.status} ${detail.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Graph call failed' };
  }
}

/** Reply to a direct message. Standard messaging tag — never HUMAN_AGENT. */
export async function sendDirectMessage(
  psid: string,
  text: string,
): Promise<{ ok: boolean; sent: boolean; error?: string }> {
  if (!autoreplyEnabled()) return { ok: true, sent: false };
  await throttle();
  const r = await post('me/messages', {
    recipient: { id: psid },
    messaging_type: 'RESPONSE',
    message: { text: text.slice(0, 1800) },
  });
  return { ...r, sent: r.ok };
}

/**
 * Private Reply — the DM you are allowed to send because somebody commented.
 * One per comment, ever. This is the highest-leverage thing Meta permits: a
 * public comment costs the customer nothing, a DM is a channel we own for the
 * next 24 hours, and this is the only bridge between the two.
 */
export async function sendPrivateReply(
  commentId: string,
  text: string,
): Promise<{ ok: boolean; sent: boolean; error?: string }> {
  if (!autoreplyEnabled()) return { ok: true, sent: false };
  await throttle();
  const r = await post('me/messages', {
    recipient: { comment_id: commentId },
    message: { text: text.slice(0, 1800) },
  });
  return { ...r, sent: r.ok };
}

/**
 * The public one-liner under their comment. Rotated, because the same sentence
 * under every comment is how a page announces it is a machine. No link and no
 * emoji — and it signposts message requests, since a non-follower's DM lands
 * in a folder they will never open unless told to look.
 */
const PUBLIC_REPLIES = [
  'Just sent you a DM — check your message requests.',
  'Messaged you the details — have a look in your message requests.',
  'Sent you a message. If you don\'t see it, check message requests.',
  'DM sent — it might be sitting in your message requests.',
  'Just replied in your DMs — check message requests if it\'s not showing.',
];

export function publicReplyText(seed: string): string {
  // Seeded on the comment id so a retry of the same webhook reuses the same
  // line instead of posting a second, different one.
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 100000;
  return PUBLIC_REPLIES[h % PUBLIC_REPLIES.length];
}

export async function replyToComment(
  commentId: string,
  text: string,
): Promise<{ ok: boolean; sent: boolean; error?: string }> {
  if (!autoreplyEnabled()) return { ok: true, sent: false };
  await throttle();
  const r = await post(`${encodeURIComponent(commentId)}/comments`, { message: text });
  return { ...r, sent: r.ok };
}
