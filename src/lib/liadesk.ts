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

import { type Attribution, describeTouch } from '@/lib/attribution';
import { cookies } from 'next/headers';

const ODOO_URL =
  process.env.LIADESK_URL || 'https://reneadventures.desk.getliaison.com';
const ODOO_DB = process.env.LIADESK_DB || 'reneadventures';
const ODOO_USER = process.env.LIADESK_USER || 'site@renesadventures.tours';
const ODOO_KEY = process.env.LIADESK_API_KEY || '';
/** Salesperson who owns new leads. 6 = Chris Carter on the reneadventures tenant. */
const OWNER_ID = Number(process.env.LIADESK_OWNER_ID || 6);
/**
 * Who gets an inbox/phone ping when a note lands on an existing lead.
 * 7 = Chris Carter's partner id on the reneadventures tenant (verified 2026-11-02).
 * Without this, every message after a guest's first one was a silent note.
 */
const NOTIFY_PARTNER_IDS = (process.env.LIADESK_NOTIFY_PARTNER_IDS || '7')
  .split(',')
  .map((v) => Number(v.trim()))
  .filter((v) => Number.isInteger(v) && v > 0);

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
  /** Where they came from. Read from the visitor's cookies when omitted. */
  attribution?: Attribution;
  /** Funnel stage to stamp on the lead. */
  funnelStage?: 'enquiry' | 'checkout_started' | 'paid' | 'abandoned';
  /** Total they were quoted, USD. */
  quotedTotal?: number;
  stripeSession?: string;
  /** Ticked the "send me offers" box. */
  marketingOk?: boolean;
  /** What to call this activity in Lia Desk's Ops log. */
  /** Filled in by createLead: one line on where they came from. */
  foundUs?: string;
  eventKind?: 'form_lead' | 'guide_request' | 'contact_captured' | 'checkout_started' | 'chat_handoff' | 'dm_received';
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

export async function ldCall(
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
    const ids = (await ldCall('utm.source', 'search', [[['name', '=', name]]], {
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
/**
 * The open lead for this guest, if there is one.
 *
 * Exported because WhatsApp needs it: when Rene answers a guest from his own
 * phone, that reply has to land on the conversation Chris and Eddy are already
 * reading, not open a second one beside it.
 */
export async function findOpenLead(
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
    const ids = (await ldCall('crm.lead', 'search', [domain], {
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
  if (input.foundUs) rows.push('', input.foundUs);
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
    const attribution = await currentAttribution(input.attribution);
    const funnel: Record<string, unknown> = {};
    if (input.funnelStage) funnel.x_funnel_stage = input.funnelStage;
    if (typeof input.quotedTotal === 'number') funnel.x_quoted_total = input.quotedTotal;
    if (input.stripeSession) funnel.x_stripe_session = input.stripeSession;
    if (input.marketingOk !== undefined) funnel.x_marketing_ok = !!input.marketingOk;
    const foundUs = attribution?.first || attribution?.last
      ? `Found us: ${describeTouch(attribution.first || attribution.last)}` +
        (attribution.last && attribution.first && attribution.last.at !== attribution.first.at
          ? `\nCame back via: ${describeTouch(attribution.last)}`
          : '')
      : '';
    const withSource: LeadInput = foundUs
      ? { ...input, foundUs }
      : input;

    const existing = await findOpenLead(input.email, input.phone);
    if (existing) {
      const body = escapeHtml(buildDescription(withSource)).replace(/\n/g, '<br/>');
      await ldCall('crm.lead', 'message_post', [[existing]], {
        body: `<p><b>New contact from the same guest</b></p><p>${body}</p>`,
        message_type: 'comment',
        subtype_xmlid: 'mail.mt_note',
        partner_ids: NOTIFY_PARTNER_IDS,
        // Without this Odoo 18 escapes the body and the note shows raw tags.
        body_is_html: true,
      });
      if (Object.keys(funnel).length) {
        // Never move a lead that already paid back to "sent to payment".
        const cur = (await ldCall('crm.lead', 'read', [[existing], ['x_funnel_stage']])) as { x_funnel_stage?: string }[];
        if (cur?.[0]?.x_funnel_stage === 'paid') delete funnel.x_funnel_stage;
        if (Object.keys(funnel).length) await updateLead(existing, funnel);
      }
      await logOpsEvent({
        kind: input.eventKind || 'form_lead',
        summary: `${input.interest || input.source || 'Enquiry'} (returning guest)`,
        leadId: existing,
        value: input.quotedTotal,
        externalRef: input.stripeSession ? `lead:${input.stripeSession}` : undefined,
        attribution,
        createUtm: true,
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
      // description is an HTML field in Odoo 18 — keep the line breaks.
      description: escapeHtml(buildDescription(withSource)).replace(/\n/g, '<br/>'),
      // 'lead' (not 'opportunity'): the Charter Pack's stale-inquiry revival
      // only watches leads, so an opportunity would never get chased.
      type: 'lead',
      ...funnel,
    };
    if (OWNER_ID) vals.user_id = OWNER_ID;
    if (input.email) vals.email_from = input.email;
    if (input.phone) vals.phone = input.phone;
    if (src) vals.source_id = src;
    // Where they actually came from wins over the form they used.
    Object.assign(vals, await attributionVals(attribution));
    if (!vals.x_funnel_stage) vals.x_funnel_stage = 'enquiry';
    // The trip date drives the Charter Pack's pre-trip reminder, captain prep,
    // review request and rebook offer — so only a real date goes in.
    if (isIsoDate(input.tripDate)) vals.date_deadline = input.tripDate;

    const leadId = (await ldCall('crm.lead', 'create', [vals])) as number;
    await logOpsEvent({
      kind: input.eventKind || 'form_lead',
      summary: `${input.interest || input.source || 'Enquiry'}: ${input.name}`,
      leadId,
      value: input.quotedTotal,
      externalRef: input.stripeSession ? `lead:${input.stripeSession}` : `lead:${leadId}`,
      attribution,
      createUtm: true,
    });
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
    const count = (await ldCall('crm.lead', 'search_count', [[]])) as number;
    return { ok: true, detail: `connected — ${count} leads in CRM` };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : 'unreachable',
    };
  }
}

/**
 * Post an internal note onto an existing lead.
 *
 * Internal, not an email: it appears in the lead's chatter where Chris and
 * Rene already work, and Odoo will not send it to the guest. That distinction
 * is the whole reason Lia's drafted replies are safe — she writes them, a
 * human reads them, and nothing leaves the building without a person pressing
 * send.
 *
 * Fails soft like everything else here. A missing note is a nuisance; a thrown
 * error on a lead path is a lost enquiry.
 */
export async function postLeadNote(
  leadId: number,
  html: string,
  opts: { notify?: boolean } = {},
): Promise<{ ok: boolean; error?: string }> {
  if (!ODOO_KEY) return { ok: false, error: 'LIADESK_API_KEY is not set' };
  try {
    await ldCall('crm.lead', 'message_post', [[leadId]], {
      body: html,
      message_type: 'comment',
      // mt_note = internal log, never emailed to the customer.
      subtype_xmlid: 'mail.mt_note',
      ...(opts.notify ? { partner_ids: NOTIFY_PARTNER_IDS } : {}),
      body_is_html: true,
    });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Lia Desk error',
    };
  }
}

/** Plain text to safe HTML for a chatter note. */
export function noteHtml(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br/>');
}

/* ------------------------------------------------------------------ */
/* Attribution + the Ops activity log                                  */
/* ------------------------------------------------------------------ */

const utmCache = new Map<string, number | false>();

/** Find a utm.source / utm.medium / utm.campaign by name; create medium/campaign if missing. */
async function utmId(
  model: 'utm.source' | 'utm.medium' | 'utm.campaign',
  name?: string,
  allowCreate = false,
): Promise<number | false> {
  const n = (name || '').trim().slice(0, 80);
  if (!n) return false;
  const key = `${model}:${n.toLowerCase()}`;
  if (utmCache.has(key)) return utmCache.get(key)!;
  if (utmCache.size > 500) utmCache.clear();
  try {
    // Escape LIKE wildcards so "%" in a cookie can't match everything.
    const pattern = n.replace(/[\\%_]/g, (c) => `\\${c}`);
    const ids = (await ldCall(model, 'search', [[['name', '=ilike', pattern]]], { limit: 1 })) as number[];
    let id: number | false = ids?.[0] ?? false;
    // Only a real enquiry (a lead) may add a new medium/campaign name;
    // anonymous page beacons can only match names that already exist.
    if (!id && allowCreate && model !== 'utm.source') {
      id = (await ldCall(model, 'create', [{ name: n }])) as number;
    }
    utmCache.set(key, id);
    return id;
  } catch {
    return false;
  }
}

/** The visitor's attribution, from the input or from the request cookies. */
export async function currentAttribution(given?: Attribution): Promise<Attribution | undefined> {
  if (given) return given;
  try {
    const { attributionFromCookieHeader } = await import('@/lib/attribution');
    const jar = await cookies();
    const header = jar.getAll().map((c) => `${c.name}=${c.value}`).join('; ');
    const a = attributionFromCookieHeader(header);
    return a.first || a.last || a.visitorId ? a : undefined;
  } catch {
    return undefined; // not inside a request (or cookies unavailable)
  }
}

export type OpsKind =
  | 'visit' | 'guide_request' | 'form_lead' | 'chat_opened' | 'chat_message' | 'chat_handoff'
  | 'whatsapp_click' | 'phone_click' | 'booking_started' | 'contact_captured'
  | 'checkout_started' | 'payment_succeeded' | 'checkout_expired' | 'refund'
  | 'post_published' | 'dm_received' | 'trip_done' | 'task_done' | 'site_change' | 'checkin' | 'other';

export interface OpsEventInput {
  kind: OpsKind;
  channel?: 'website' | 'stripe' | 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'phone' | 'email' | 'manual' | 'system';
  summary?: string;
  page?: string;
  value?: number;
  leadId?: number;
  /** Makes the record idempotent (Stripe session id, post id, visitor+session...). */
  externalRef?: string;
  attribution?: Attribution;
  payload?: Record<string, unknown>;
  occurredAt?: Date;
  /** Allow new campaign/medium names (true only for real enquiries). */
  createUtm?: boolean;
}

/** Record one business activity in Lia Desk. Never throws. */
export async function logOpsEvent(ev: OpsEventInput): Promise<{ ok: boolean; id?: number; error?: string }> {
  if (!ODOO_KEY) return { ok: false, error: 'LIADESK_API_KEY is not set' };
  try {
    const a = ev.attribution;
    const t = a?.last || a?.first;
    const vals: Record<string, unknown> = {
      kind: ev.kind,
      channel: ev.channel || 'website',
      occurred_at: (ev.occurredAt || new Date()).toISOString().replace('T', ' ').slice(0, 19),
    };
    if (ev.summary) vals.summary = ev.summary.slice(0, 250);
    if (ev.page) vals.page = ev.page.slice(0, 250);
    if (typeof ev.value === 'number' && Number.isFinite(ev.value)) vals.value = ev.value;
    if (ev.leadId) vals.lead_id = ev.leadId;
    if (ev.externalRef) vals.external_ref = ev.externalRef.slice(0, 200);
    if (ev.payload) vals.payload = JSON.stringify(ev.payload).slice(0, 4000);
    if (a?.visitorId) vals.visitor_key = a.visitorId;
    if (a?.sessionId) vals.session_key = a.sessionId;
    if (t) {
      const [src, med, camp] = await Promise.all([
        utmId('utm.source', t.source),
        utmId('utm.medium', t.medium && t.medium !== 'none' ? t.medium : undefined, !!ev.createUtm),
        utmId('utm.campaign', t.campaign, !!ev.createUtm),
      ]);
      if (src) vals.source_id = src;
      if (med) vals.medium_id = med;
      if (camp) vals.campaign_id = camp;
      if (t.content) vals.utm_content = t.content.slice(0, 200);
      if (t.referrer) vals.referrer = t.referrer.slice(0, 200);
      if (t.landing) vals.landing_page = t.landing.slice(0, 200);
    }
    const id = (await ldCall('ops.event', 'record', [vals])) as number;
    return { ok: true, id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Lia Desk error' };
  }
}

/** Lead fields that say where the person came from. */
async function attributionVals(a?: Attribution): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  if (!a) return out;
  const origin = a.first || a.last;
  if (!origin) return out;
  const [src, med, camp] = await Promise.all([
    utmId('utm.source', origin.source),
    utmId('utm.medium', origin.medium && origin.medium !== 'none' ? origin.medium : undefined, true),
    utmId('utm.campaign', origin.campaign, true),
  ]);
  if (src) out.source_id = src;
  if (med) out.medium_id = med;
  if (camp) out.campaign_id = camp;
  out.x_first_touch = describeTouch(a.first || origin).slice(0, 250);
  if (origin.landing) out.x_landing_page = origin.landing.slice(0, 250);
  if (origin.referrer) out.x_referrer = origin.referrer.slice(0, 250);
  if (origin.content) out.x_utm_content = origin.content.slice(0, 250);
  const click = a.last?.clickId || a.first?.clickId;
  if (click) out.x_click_id = click.slice(0, 120);
  return out;
}

/** Update a lead's fields. Never throws. */
export async function updateLead(leadId: number, vals: Record<string, unknown>): Promise<boolean> {
  if (!ODOO_KEY) return false;
  try {
    await ldCall('crm.lead', 'write', [[leadId], vals]);
    return true;
  } catch (err) {
    console.error('[liadesk] lead update failed', err);
    return false;
  }
}

/** Find the lead that owns a Stripe checkout session. */
export async function findLeadByStripeSession(sessionId: string): Promise<number | null> {
  if (!ODOO_KEY || !sessionId) return null;
  try {
    const ids = (await ldCall('crm.lead', 'search', [[['x_stripe_session', '=', sessionId], ['active', 'in', [true, false]]]], { limit: 1 })) as number[];
    return ids?.[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * The lead that owns a Stripe session. Looks at the activity log first (every
 * session gets a "lead:<session>" record, even when the guest opened checkout
 * twice), then the lead's own field. THROWS if Lia Desk can't be asked, so
 * the webhook can tell Stripe to retry instead of losing the update.
 */
export async function leadForStripeSession(sessionId: string): Promise<{ id: number; stage?: string } | null> {
  if (!ODOO_KEY) throw new Error('LIADESK_API_KEY is not set');
  const ev = (await ldCall('ops.event', 'search_read', [[['external_ref', '=', `lead:${sessionId}`], ['lead_id', '!=', false]]], {
    fields: ['lead_id'], limit: 1,
  })) as { lead_id: [number, string] | false }[];
  let id: number | undefined = ev?.[0]?.lead_id ? ev[0].lead_id[0] : undefined;
  if (!id) {
    const ids = (await ldCall('crm.lead', 'search', [[['x_stripe_session', '=', sessionId], ['active', 'in', [true, false]]]], { limit: 1 })) as number[];
    id = ids?.[0];
  }
  if (!id) return null;
  const cur = (await ldCall('crm.lead', 'read', [[id], ['x_funnel_stage']])) as { x_funnel_stage?: string }[];
  return { id, stage: cur?.[0]?.x_funnel_stage || undefined };
}

/** Has this activity already been recorded? THROWS on error (webhook retries). */
export async function opsEventExists(kind: OpsKind, externalRef: string): Promise<boolean> {
  if (!ODOO_KEY) throw new Error('LIADESK_API_KEY is not set');
  const n = (await ldCall('ops.event', 'search_count', [[['kind', '=', kind], ['external_ref', '=', externalRef]]])) as number;
  return n > 0;
}
