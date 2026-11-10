/**
 * Everything the Ops report shows, read live from Lia Desk (the single source
 * of truth) plus Stripe as the money cross-check.
 *
 * Uses its own Lia Desk account (OPS_LIADESK_USER / OPS_LIADESK_API_KEY),
 * separate from the website's, and only ever reads.
 *
 * "Today" is a Belize day (UTC-6, no daylight saving): René's day on the water.
 */

import Stripe from 'stripe';

const URL_ = process.env.LIADESK_URL || 'https://reneadventures.desk.getliaison.com';
const DB = process.env.LIADESK_DB || 'reneadventures';
const USER = process.env.OPS_LIADESK_USER || 'ops-report@renesadventures.tours';
const KEY = process.env.OPS_LIADESK_API_KEY || '';
const BELIZE_OFFSET_H = -6;

async function rpc(service: string, method: string, args: unknown[]): Promise<unknown> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 12000);
  try {
    const res = await fetch(`${URL_}/jsonrpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: { service, method, args }, id: Date.now() }),
      signal: ctl.signal,
      cache: 'no-store',
    });
    const j = (await res.json()) as { result?: unknown; error?: { data?: { message?: string } } };
    if (j.error) throw new Error(j.error.data?.message || 'Lia Desk error');
    return j.result;
  } finally {
    clearTimeout(t);
  }
}

let uidCache: number | null = null;
async function q<T = Record<string, unknown>[]>(model: string, method: string, args: unknown[], kw: Record<string, unknown> = {}): Promise<T> {
  if (!KEY) throw new Error('OPS_LIADESK_API_KEY is not set');
  if (!uidCache) {
    const u = await rpc('common', 'login', [DB, USER, KEY]);
    if (typeof u !== 'number') throw new Error('Lia Desk refused the report key');
    uidCache = u;
  }
  return (await rpc('object', 'execute_kw', [DB, uidCache, KEY, model, method, args, kw])) as T;
}

/* ---------- time helpers (Belize) ---------- */
export function belizeNow(): Date {
  return new Date(Date.now() + BELIZE_OFFSET_H * 3600_000);
}
/** UTC 'YYYY-MM-DD HH:MM:SS' for the start of a Belize day `daysAgo` days back. */
function dayStartUtc(daysAgo = 0): string {
  const b = belizeNow();
  const d = new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate() - daysAgo, -BELIZE_OFFSET_H));
  return d.toISOString().replace('T', ' ').slice(0, 19);
}
function monthStartUtc(): string {
  const b = belizeNow();
  return new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 1, -BELIZE_OFFSET_H)).toISOString().replace('T', ' ').slice(0, 19);
}
export function belizeDateStr(): string {
  return belizeNow().toISOString().slice(0, 10);
}
function hoursSince(odooUtc: string): number {
  return (Date.now() - new Date(odooUtc.replace(' ', 'T') + 'Z').getTime()) / 3600_000;
}

/* ---------- shapes ---------- */
export interface LeadRow {
  id: number;
  firstName: string;
  what: string;
  stage: string;
  funnel: string;
  ageHours: number;
  quoted: number;
  phone?: string;
  email?: string;
  source: string;
  owner: string;
  nextAction?: string;
  nextDue?: string;
  overdue: boolean;
  hasContact: boolean;
}

export interface TodoRow {
  who: string;
  summary: string;
  due: string;
  daysLate: number;
  on: string;
  leadId?: number;
  callable: boolean;
}

export interface Report {
  generatedAt: string;
  day: string;
  errors: string[];
  counts: Record<string, number>;
  counts30: Record<string, number>;
  bySource30: { source: string; visits: number; enquiries: number; toPayment: number; paid: number; money: number }[];
  moneyToday: number;
  moneyMonth: number;
  stripeToday: number | null;
  stripeMonth: number | null;
  leads: LeadRow[];
  noContactStarts: { count: number; quoted: number };
  todos: TodoRow[];
  licences: { name: string; daysLeft: number; expiry: string }[];
  catchLogsMissing: number;
  social: { platform: string; day: string; followers: number; views: number; likes: number; comments: number; messagesWaiting: number; source: string }[];
  feed: { at: string; kind: string; summary: string; source: string; value: number }[];
  tasks: { name: string; stage: string; owner: string; deadline?: string; doneToday: boolean; blocked: boolean }[];
  blindSpots: { what: string; why: string; fix: string }[];
}

const KIND_LABEL: Record<string, string> = {
  visit: 'Website visits', guide_request: 'Guide requests', form_lead: 'Form enquiries',
  chat_opened: 'Chats opened', chat_message: 'Chat messages', chat_handoff: 'Chats with contact',
  whatsapp_click: 'WhatsApp taps', phone_click: 'Phone taps', booking_started: 'Booking started',
  contact_captured: 'Contact given', checkout_started: 'Sent to payment', payment_succeeded: 'Paid',
  checkout_expired: 'Payment abandoned', refund: 'Refunds', post_published: 'Posts published',
  dm_received: 'DMs / comments', trip_done: 'Trips done', task_done: 'Tasks done',
  site_change: 'Website changes', checkin: 'Check-ins', other: 'Other',
};
export const kindLabel = (k: string) => KIND_LABEL[k] || k;

function m2o(v: unknown): string {
  return Array.isArray(v) ? String(v[1]) : '';
}

async function safe<T>(label: string, errors: string[], fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    errors.push(`${label}: ${e instanceof Error ? e.message.slice(0, 120) : 'failed'}`);
    return fallback;
  }
}

async function stripeTotals(errors: string[]): Promise<{ today: number | null; month: number | null }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { today: null, month: null };
  return safe<{ today: number | null; month: number | null }>('Stripe', errors, async () => {
    const stripe = new Stripe(key, { apiVersion: '2026-01-28.clover' });
    const monthStart = Math.floor(new Date(monthStartUtc().replace(' ', 'T') + 'Z').getTime() / 1000);
    const todayStart = Math.floor(new Date(dayStartUtc(0).replace(' ', 'T') + 'Z').getTime() / 1000);
    let month = 0;
    let today = 0;
    for await (const c of stripe.charges.list({ created: { gte: monthStart }, limit: 100 })) {
      if (c.status !== 'succeeded') continue;
      const net = (c.amount - (c.amount_refunded || 0)) / 100;
      month += net;
      if (c.created >= todayStart) today += net;
    }
    return { today, month };
  }, { today: null, month: null });
}

export async function buildReport(view: 'owner' | 'full'): Promise<Report> {
  const errors: string[] = [];
  const today0 = dayStartUtc(0);
  const d30 = dayStartUtc(30);
  const month0 = monthStartUtc();
  const todayStr = belizeDateStr();

  const [eventsToday, events30, moneyEvents, leadsRaw, acts, licences, catchMissing, social, feed, tasks, stripe] = await Promise.all([
    safe('Activity today', errors, () => q<{ kind: string; __count: number; value: number }[]>('ops.event', 'read_group', [[['occurred_at', '>=', today0]], ['kind', 'value:sum'], ['kind']], { lazy: false }), []),
    safe('Activity 30 days', errors, () => q<{ kind: string; source_id: unknown; __count: number; value: number }[]>('ops.event', 'read_group', [[['occurred_at', '>=', d30]], ['kind', 'source_id', 'value:sum'], ['kind', 'source_id']], { lazy: false }), []),
    safe('Money', errors, () => q<{ value: number; occurred_at: string; kind: string }[]>('ops.event', 'search_read', [[['kind', 'in', ['payment_succeeded', 'refund']], ['occurred_at', '>=', month0]]], { fields: ['value', 'occurred_at', 'kind'] }), []),
    safe('Leads', errors, () => q('crm.lead', 'search_read', [[['active', '=', true], ['probability', '<', 100]]], {
      fields: ['contact_name', 'name', 'stage_id', 'x_funnel_stage', 'create_date', 'x_quoted_total', 'phone', 'email_from', 'source_id', 'user_id', 'activity_summary', 'activity_date_deadline', 'activity_state'],
      order: 'create_date desc', limit: 60,
    }), []),
    safe('To-dos', errors, () => q('mail.activity', 'search_read', [[['date_deadline', '<=', todayStr]]], {
      fields: ['summary', 'activity_type_id', 'date_deadline', 'user_id', 'res_model', 'res_id', 'res_name'], order: 'date_deadline asc', limit: 80,
    }), []),
    safe('Licences', errors, () => q('charter.licence', 'search_read', [[['active', '=', true]]], { fields: ['name', 'expiry_date'], order: 'expiry_date asc' }), []),
    safe('Catch logs', errors, () => q<number>('charter.catch.log', 'search_count', [[['submitted', '=', false]]]), 0),
    safe('Social', errors, () => q('ops.social.daily', 'search_read', [[['day', '>=', dayStartUtc(14).slice(0, 10)]]], { fields: ['day', 'platform', 'followers', 'views', 'likes', 'comments', 'messages_waiting', 'source'], order: 'day desc' }), []),
    safe('Feed', errors, () => q('ops.event', 'search_read', [[['kind', '!=', 'visit']]], { fields: ['occurred_at', 'kind', 'summary', 'source_id', 'value'], order: 'occurred_at desc', limit: view === 'full' ? 30 : 10 }), []),
    safe('Tasks', errors, async () => {
      const proj = await q<number[]>('project.project', 'search', [[['name', 'ilike', "Rene's Ops"]]], { limit: 1 });
      if (!proj.length) return [];
      const rows = await q('project.task', 'search_read', [[['project_id', '=', proj[0]]]], {
        fields: ['name', 'stage_id', 'user_ids', 'date_deadline', 'state', 'date_last_stage_update'], order: 'date_deadline asc', limit: 120,
      });
      const ids = [...new Set(rows.flatMap((r) => (Array.isArray(r.user_ids) ? (r.user_ids as number[]) : [])))];
      const users = ids.length ? await q<{ id: number; name: string }[]>('res.users', 'read', [ids, ['name']]) : [];
      const names = new Map(users.map((u) => [u.id, u.name.split(' ')[0]]));
      return rows.map((r) => ({ ...r, owner_names: (Array.isArray(r.user_ids) ? (r.user_ids as number[]) : []).map((i) => names.get(i) || '?').join(', ') }));
    }, []),
    stripeTotals(errors),
  ]);

  const counts: Record<string, number> = {};
  for (const g of eventsToday) counts[g.kind] = g.__count;
  const counts30: Record<string, number> = {};
  const srcMap = new Map<string, { visits: number; enquiries: number; toPayment: number; paid: number; money: number }>();
  for (const g of events30) {
    counts30[g.kind] = (counts30[g.kind] || 0) + g.__count;
    const s = m2o(g.source_id) || 'Unknown';
    const row = srcMap.get(s) || { visits: 0, enquiries: 0, toPayment: 0, paid: 0, money: 0 };
    if (g.kind === 'visit') row.visits += g.__count;
    if (['form_lead', 'guide_request', 'chat_handoff', 'contact_captured'].includes(g.kind)) row.enquiries += g.__count;
    if (g.kind === 'checkout_started') row.toPayment += g.__count;
    if (g.kind === 'payment_succeeded') {
      row.paid += g.__count;
      row.money += g.value || 0;
    }
    srcMap.set(s, row);
  }
  const bySource30 = [...srcMap.entries()]
    .map(([source, r]) => ({ source, ...r }))
    .sort((a, b) => b.money - a.money || b.enquiries - a.enquiries || b.visits - a.visits);

  let moneyMonth = 0;
  let moneyToday = 0;
  for (const e of moneyEvents) {
    moneyMonth += e.value || 0;
    if (e.occurred_at >= today0) moneyToday += e.value || 0;
  }

  const leads: LeadRow[] = (leadsRaw as Record<string, unknown>[]).map((l) => {
    const phone = (l.phone as string) || undefined;
    const email = (l.email_from as string) || undefined;
    const full = (l.contact_name as string) || '';
    const first = full.split(' ')[0] || 'Guest';
    return {
      id: Number(l.id),
      firstName: /booking$/i.test(full) ? 'Unknown guest' : first,
      what: String(l.name || '').split(' — ')[0],
      stage: m2o(l.stage_id),
      funnel: String(l.x_funnel_stage || ''),
      ageHours: hoursSince(String(l.create_date)),
      quoted: Number(l.x_quoted_total || 0),
      phone,
      email,
      source: m2o(l.source_id) || 'Unknown',
      owner: m2o(l.user_id),
      nextAction: (l.activity_summary as string) || undefined,
      nextDue: (l.activity_date_deadline as string) || undefined,
      overdue: l.activity_state === 'overdue',
      hasContact: !!(phone || email),
    };
  });
  const noContact = leads.filter((l) => !l.hasContact);
  const contactable = leads.filter((l) => l.hasContact);
  const noContactIds = new Set(noContact.map((l) => l.id));

  const todos: TodoRow[] = (acts as Record<string, unknown>[]).map((a) => {
    const due = String(a.date_deadline);
    const daysLate = Math.max(0, Math.round((new Date(todayStr).getTime() - new Date(due).getTime()) / 86400_000));
    const leadId = a.res_model === 'crm.lead' ? Number(a.res_id) : undefined;
    return {
      who: m2o(a.user_id) || 'Nobody',
      summary: String(a.summary || m2o(a.activity_type_id) || 'To-do'),
      due,
      daysLate,
      on: String(a.res_name || ''),
      leadId,
      callable: !(leadId && noContactIds.has(leadId)),
    };
  });

  const lic = (licences as Record<string, unknown>[]).map((l) => {
    const exp = String(l.expiry_date);
    return { name: String(l.name), expiry: exp, daysLeft: Math.round((new Date(exp).getTime() - new Date(todayStr).getTime()) / 86400_000) };
  });

  const latestSocial = new Map<string, Report['social'][number]>();
  for (const s of social as Record<string, unknown>[]) {
    const p = String(s.platform);
    if (!latestSocial.has(p)) {
      latestSocial.set(p, {
        platform: p, day: String(s.day), followers: Number(s.followers || 0), views: Number(s.views || 0),
        likes: Number(s.likes || 0), comments: Number(s.comments || 0), messagesWaiting: Number(s.messages_waiting || 0), source: String(s.source || ''),
      });
    }
  }

  const taskRows = (tasks as Record<string, unknown>[]).map((t) => {
    const stage = m2o(t.stage_id);
    const last = String(t.date_last_stage_update || '');
    const done = /done|complete/i.test(stage) || t.state === '1_done';
    return {
      name: String(t.name),
      stage,
      owner: String(t.owner_names || ''),
      deadline: t.date_deadline ? String(t.date_deadline).slice(0, 10) : undefined,
      doneToday: done && last >= today0,
      blocked: /block|wait/i.test(stage) || t.state === '04_waiting_normal',
    };
  });

  // Work tasks due by today also belong on each person's to-do list.
  for (const t of taskRows) {
    if (!t.deadline || t.deadline > todayStr || /done|complete|cancel/i.test(t.stage)) continue;
    for (const who of (t.owner || 'Nobody').split(', ')) {
      todos.push({
        who,
        summary: t.name,
        due: t.deadline,
        daysLate: Math.max(0, Math.round((new Date(todayStr).getTime() - new Date(t.deadline).getTime()) / 86400_000)),
        on: "Rene's Ops task",
        callable: true,
      });
    }
  }

  // What we can't see — computed, so it shrinks as things get connected.
  const blindSpots: Report['blindSpots'] = [];
  if (!latestSocial.has('facebook') && !latestSocial.has('instagram')) {
    blindSpots.push({ what: 'Facebook & Instagram numbers', why: 'No Meta access key is connected to Lia Desk yet.', fix: 'Create a read-only Meta "System User" key (5 minutes, Eddy or Chris) and Lia pulls the numbers every hour.' });
  }
  if (!latestSocial.has('tiktok')) {
    blindSpots.push({ what: 'TikTok numbers', why: 'TikTok has no data feed for small business accounts.', fix: 'Type 4 numbers into Lia Desk > Ops > Social numbers once a day (views, likes, followers, DMs).' });
  }
  blindSpots.push({ what: 'WhatsApp enquiries', why: "The business WhatsApp runs on René's phone app, which no system can read.", fix: 'Move the number to the WhatsApp Business API (checklist already written), then every chat lands in Lia Desk.' });
  if (!(counts30.visit > 0)) {
    blindSpots.push({ what: 'Website visits', why: 'Visit tracking started on the new release; nothing recorded yet.', fix: 'Nothing to do: numbers appear as people visit.' });
  }
  if (noContact.length) {
    blindSpots.push({ what: `${noContact.length} people who started paying`, why: 'Before the booking fix the site sent guests to payment without asking who they were.', fix: 'Fixed in the new booking step: name + WhatsApp/email are asked first. Old ones cannot be recovered.' });
  }
  if (!taskRows.length) {
    blindSpots.push({ what: 'Work log', why: `No "Rene's Ops" project in Lia Desk yet.`, fix: 'Open tasks get imported from the Control Room; new work is created there.' });
  }
  blindSpots.push({ what: 'Trips actually run, walk-ups and cash/Venmo payments', why: 'They never touch the website or Stripe.', fix: 'René logs each trip as a catch log (already required by Fisheries); cash/Venmo bookings get entered as a lead marked paid.' });

  return {
    generatedAt: new Date().toISOString(),
    day: todayStr,
    errors,
    counts,
    counts30,
    bySource30,
    moneyToday,
    moneyMonth,
    stripeToday: stripe.today,
    stripeMonth: stripe.month,
    leads: contactable,
    noContactStarts: { count: noContact.length, quoted: noContact.reduce((s, l) => s + l.quoted, 0) },
    todos,
    licences: lic,
    catchLogsMissing: Number(catchMissing) || 0,
    social: [...latestSocial.values()],
    feed: (feed as Record<string, unknown>[]).map((f) => ({ at: String(f.occurred_at), kind: String(f.kind), summary: String(f.summary || ''), source: m2o(f.source_id), value: Number(f.value || 0) })),
    tasks: taskRows,
    blindSpots,
  };
}
