import crypto from 'node:crypto';

/**
 * Private links for the Ops report, same idea as Faro's report links.
 *
 * A link carries a signed token: who it is for, which view (owner or full),
 * and when it stops working. Nothing is stored server-side, so a leaked link
 * is killed by moving OPS_LINKS_NOT_BEFORE forward (every older link dies) or
 * by adding the person's name to OPS_LINKS_REVOKED.
 *
 * The token is swapped for an httpOnly cookie on first open, so it does not
 * sit in the address bar, the browser history or a screenshot.
 */

export type OpsView = 'owner' | 'full';

export interface OpsLink {
  /** Person, e.g. "Chris". */
  n: string;
  v: OpsView;
  /** Issued at, unix seconds. */
  i: number;
  /** Expires, unix seconds. */
  e: number;
}

function secret(): string {
  const s = process.env.OPS_LINK_SECRET || '';
  if (s.length < 24) throw new Error('OPS_LINK_SECRET is missing or too short');
  return s;
}

const b64 = (b: Buffer) => b.toString('base64url');

export function signOpsLink(link: OpsLink): string {
  const body = b64(Buffer.from(JSON.stringify(link)));
  const mac = b64(crypto.createHmac('sha256', secret()).update(body).digest()).slice(0, 32);
  return `${body}.${mac}`;
}

export function verifyOpsLink(token?: string | null): OpsLink | null {
  if (!token || token.length > 600) return null;
  const [body, mac] = token.split('.');
  if (!body || !mac) return null;
  let expected: string;
  try {
    expected = b64(crypto.createHmac('sha256', secret()).update(body).digest()).slice(0, 32);
  } catch {
    return null;
  }
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let link: OpsLink;
  try {
    link = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as OpsLink;
  } catch {
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  if (!link || (link.v !== 'owner' && link.v !== 'full') || !link.n || link.e < now) return null;
  const notBefore = Number(process.env.OPS_LINKS_NOT_BEFORE || 0);
  if (notBefore && link.i < notBefore) return null;
  const revoked = (process.env.OPS_LINKS_REVOKED || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
  if (revoked.includes(link.n.toLowerCase())) return null;
  return link;
}
