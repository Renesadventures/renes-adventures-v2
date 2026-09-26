/**
 * Lia Desk bridge — pushes leads from renesadventures.tours into the CRM.
 *
 * Uses Odoo's JSON-RPC endpoint over plain fetch, so there is no xmlrpc
 * dependency to install and it runs unchanged on Vercel's Node runtime.
 *
 * Auth is an API key, not a password. The key belongs to a dedicated
 * integration user (site@renesadventures.tours), so if it ever leaks it is
 * revoked on its own without disturbing anyone's real login.
 *
 * Rules that matter:
 *  1. A lead must NEVER be lost or shown as an error to a visitor because the
 *     CRM is unreachable. Every function here fails soft and reports.
 *  2. ONE lead per guest. Lia Desk's Charter Pack fires a call task and a
 *     guest text the moment a lead is created, so a second lead for the same
 *     person means a second text. If an OPEN lead already exists for this
 *     email or phone, we add a note to it instead of creating another.
 *  3. The lead belongs to a human (Chris by default), never to the
 *     integration user — otherwise "call within 15 min" lands on a login
 *     nobody reads.
 */

const ODOO_URL =
  process.env.LIADESK_URL || 'https://reneadventures.desk.getliaison.com';
const ODOO_DB = process.env.LIADESK_DB || 'reneadventures';
const ODOO_USER = process.env.LIADESK_USER || 'site@renesadventures.tours';
const ODOO_KEY = process.env.LIADESK_API_KEY || '';
/** Salesperson who owns new leads. 6 = Chris Carter on the reneadventures tenant. */
const OWNER_ID = Number(process.env.LIADESK_OWNER_ID || 6);

/** How long we are willing to make a website visitor wait on the CRM. */
const TIMEOUT_MS = 8000;

/** Must match utm.source names in Lia Desk exactly. */
export type LeadSource =
  | 'Website'
  | 'WhatsApp'
  | 'Walk-up'
  | 'Referral'
  | 'Facebook'
  | 'Facebook Ad'
  | 'Instagram'
  | 'Reddit'
  | 'Email'
  | 'Lia Chat';

export const LEAD_SOURCES: LeadSource[] = [
  'Website',
  'WhatsApp',
  'Walk-up',
  'Referral',
  'Facebook',
  'Facebook Ad',
  'Instagram',
  'Reddit',
  'Email',
  'Lia Chat',
];

export interface LeadInput {
  name: string;
  email?: string;
  phone?: string;
  /** What they asked about — tour slug, "Blue Hole", "brochure", etc. */
  interest?: string;
  message?: string;
  source?: LeadSource;
  /** Trip date if they gave one. ISO yyyy-mm-dd. */
  tripDate?: string;
  guests?: number;
  /** Anything else worth keeping; rendered into the lead description. */
  extra?: Record<string, unknown>;
}

export interface LeadResult {
  ok: boolean;
  leadId?: number;
  /** true when the guest already had an open lead and we added a note to it. */
  existing?: boolean;
  error?: string;
}

async function rpc(
  service: string,
  method: string,
  args: unknown[],
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: { service, method, args },
        id: Date.now(),
      }),
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Lia Desk HTTP ${res.status}`);
    const json = (await res.json()) as {
      result?: unknown;
      error?: { data?: { message?: string }; message?: string };
    };
    if (json.error) {
      throw new Error(
        json.error.data?.message || json.error.message || 'Lia Desk RPC error',
      );
    }
    return json.result;
  } finally {
    clearTimeout(timer);
  }
}

let cachedUid: number | null = null;

async function uid(): Promise<number> {
  if (cachedUid) return cachedUid;
  const got = await rpc('common', 'login', [ODOO_DB, ODOO_USER, ODOO_KEY]);
  if (!got || typeof got !== 'number') {
    throw new Error('Lia Desk rejected the API key');
  }
  cachedUid = got;
  return got;
}

async function call(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {},
): Promise<unknown> {
  const id = await uid();
  return rpc('object', 'execute_kw', [
    ODOO_DB,
    id,
    ODOO_KEY,
    model,
    method,
    args,
    kwargs,
  ]);
}

/** Resolve a UTM source name to its id, so channel reporting actually works. */
async function sourceId(name: string): Promise<number | false> {
  try {
    const ids = (await call('utm.source', 'search', [[['name', '=', name]]], {
      limit: 1,
    })) as number[];
    return ids?.[0] ?? false;
  } catch {
    return false;
  }
}

/**
 * Find an OPEN lead for this guest (not won, not archived/lost).
 * A past customer who comes back gets a fresh lead — that is a new booking.
 */
async function findOpenLead(
  email?: string,
  phone?: string,
): Promise<number | null> {
  const ors: unknown[][] = [];
  if (email) ors.push(['email_normalized', '=', email.trim().toLowerCase()]);
  // phone_mobile_search matches phone OR mobile, ignoring spaces/dashes.
  if (phone && phone.replace(/\D/g, '').length >= 7) {
    ors.push(['phone_mobile_search', '=', phone.trim()]);
  }
  if (!ors.length) return null;
  const domain: unknown[] = [
    ['active', '=', true],
    ['probability', '<', 100],
    ...Array(ors.length - 1).fill('|'),
    ...ors,
  ];
  try {
    const ids = (await call('crm.lead', 'search', [domain], {
      limit: 1,
      order: 'id desc',
    })) as number[];
    return ids?.[0] ?? null;
  } catch {
    // If the lookup fails we would rather risk a duplicate than lose a lead.
    return null;
  }
}

function buildDescription(input: LeadInput): string {
  const rows: string[] = [];
  if (input.message) rows.push(input.message, '');
  if (input.tripDate) rows.push(`Requested date: ${input.tripDate}`);
  if (input.guests) rows.push(`Guests: ${input.guests}`);
  if (input.interest) rows.push(`Interested in: ${input.interest}`);
  if (input.extra) {
    for (const [k, v] of Object.entries(input.extra)) {
      if (v === undefined || v === null || v === '') continue;
      rows.push(`${k}: ${String(v)}`);
    }
  }
  rows.push('', `Captured automatically from renesadventures.tours (${input.source || 'Website'})`);
  return rows.join('\n');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isIsoDate(s?: string): s is string {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/**
 * Create a CRM lead — or, if this guest already has an open lead, add a note
 * to it. Never throws: the website must not 500 because the back office is
 * down.
 */
export async function createLead(input: LeadInput): Promise<LeadResult> {
  if (!ODOO_KEY) {
    return { ok: false, error: 'LIADESK_API_KEY is not set' };
  }
  try {
    const existing = await findOpenLead(input.email, input.phone);
    if (existing) {
      const body = escapeHtml(buildDescription(input)).replace(/\n/g, '<br/>');
      await call('crm.lead', 'message_post', [[existing]], {
        body: `<p><b>New contact from the same guest</b></p><p>${body}</p>`,
        message_type: 'comment',
        subtype_xmlid: 'mail.mt_note',
      });
      return { ok: true, leadId: existing, existing: true };
    }

    const src = await sourceId(input.source || 'Website');
    const title = input.interest
      ? `${input.interest} — ${input.name}`
      : `${input.source || 'Website'} enquiry — ${input.name}`;

    const vals: Record<string, unknown> = {
      name: title,
      contact_name: input.name,
      description: buildDescription(input),
      // 'lead' (not 'opportunity'): the Charter Pack's stale-inquiry revival
      // only watches leads, so an opportunity would never get chased.
      type: 'lead',
    };
    if (OWNER_ID) vals.user_id = OWNER_ID;
    if (input.email) vals.email_from = input.email;
    if (input.phone) vals.phone = input.phone;
    if (src) vals.source_id = src;
    // The trip date drives the Charter Pack's pre-trip reminder, captain prep,
    // review request and rebook offer — so only a real date goes in.
    if (isIsoDate(input.tripDate)) vals.date_deadline = input.tripDate;

    const leadId = (await call('crm.lead', 'create', [vals])) as number;
    return { ok: true, leadId };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Lia Desk error',
    };
  }
}

/** Health check — is the CRM actually reachable? */
export async function liadeskStatus(): Promise<{
  ok: boolean;
  detail: string;
}> {
  if (!ODOO_KEY) return { ok: false, detail: 'API key not configured' };
  try {
    const count = (await call('crm.lead', 'search_count', [[]])) as number;
    return { ok: true, detail: `connected — ${count} leads in CRM` };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : 'unreachable',
    };
  }
}
