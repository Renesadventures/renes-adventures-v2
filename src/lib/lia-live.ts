import { ldCall } from '@/lib/liadesk';

/**
 * Lia live: every turn of the website chat is written to Lia Desk (ops.chat),
 * so the team can watch it on Rene's Desk and take over. When a person takes
 * over, Lia stays quiet in that chat and the guest sees the person's replies.
 *
 * Never throws and never makes the guest wait more than ~2.5 s.
 */

const ID_RE = /^[A-Za-z0-9_-]{8,80}$/;

export function validChatId(id: unknown): string | null {
  return typeof id === 'string' && ID_RE.test(id) ? id : null;
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([p, new Promise<null>((r) => setTimeout(() => r(null), ms))]).catch(() => null);
}

export async function liveLog(vals: {
  key: string;
  guest?: string;
  lia?: string;
  page?: string;
  handoff_summary?: string;
}): Promise<{ human_active: boolean }> {
  const res = (await withTimeout(ldCall('ops.chat', 'log_turn', [vals]), 2500)) as
    | { human_active?: boolean }
    | number
    | null;
  return { human_active: !!(res && typeof res === 'object' && res.human_active) };
}

export async function liveUpdates(
  key: string,
  since: string,
): Promise<{ human_active: boolean; messages: { t: string; from: string; text: string }[] }> {
  const res = (await withTimeout(ldCall('ops.chat', 'updates', [key, since]), 4000)) as
    | { human_active?: boolean; messages?: { t: string; from: string; text: string }[] }
    | null;
  return { human_active: !!res?.human_active, messages: Array.isArray(res?.messages) ? res!.messages! : [] };
}
