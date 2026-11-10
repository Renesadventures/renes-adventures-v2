import { NextRequest, NextResponse } from 'next/server';
import { verifyOpsLink, type OpsView } from '@/lib/ops-auth';
import { buildReport, kindLabel, rangeLabel, RANGES, type RangeKey, type Report } from '@/lib/ops-report';

/**
 * GET /ops — Rene's Adventures end-of-day report ("Faro for Rene's").
 *
 * A bare HTML page from a route handler on purpose: no site layout, so no
 * Google Analytics, no Meta Pixel, no chat widget, nothing that could carry
 * the private link or a guest's name to a third party. Refreshes from Lia
 * Desk on every load.
 *
 *   /ops?t=<link>  -> checks the link, stores it in an httpOnly cookie, and
 *                     redirects to /ops so the token leaves the address bar.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COOKIE = 'ops_t';

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store, private',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; script-src 'none'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
};

export async function GET(req: NextRequest) {
  const fromQuery = req.nextUrl.searchParams.get('t');
  if (fromQuery) {
    const link = verifyOpsLink(fromQuery);
    const res = NextResponse.redirect(new URL('/ops', req.url), 303);
    res.headers.set('Referrer-Policy', 'no-referrer');
    if (link) {
      res.cookies.set(COOKIE, fromQuery, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/ops',
        maxAge: Math.max(60, Math.min(link.e - Math.floor(Date.now() / 1000), 60 * 60 * 24 * 90)),
      });
    }
    return res;
  }

  const link = verifyOpsLink(req.cookies.get(COOKIE)?.value);
  if (!link) {
    return new NextResponse(page('Link needed', `<div class="card"><h2>This page needs your private link</h2><p>Open the link Eddy sent you. If it stopped working, ask him for a new one.</p></div>`), { status: 401, headers: SECURITY_HEADERS });
  }

  let report: Report;
  try {
    const rq = req.nextUrl.searchParams.get('r') as RangeKey | null;
    const range: RangeKey = rq && RANGES.some((x) => x.key === rq) ? rq : '30';
    report = await buildReport(link.v, range);
  } catch (e) {
    return new NextResponse(page('Report unavailable', `<div class="card"><h2>Lia Desk could not be reached</h2><p>${esc(e instanceof Error ? e.message : 'Unknown error')}</p><p>Try again in a minute.</p></div>`), { status: 503, headers: SECURITY_HEADERS });
  }
  return new NextResponse(page(`Rene's Adventures · ${report.day}`, render(report, link.v, link.n)), { headers: SECURITY_HEADERS });
}

/* ------------------------------------------------------------------ */

function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const n0 = (n?: number) => (n || 0).toLocaleString('en-US');
function ago(h: number): string {
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} min`;
  if (h < 48) return `${Math.round(h)} h`;
  return `${Math.round(h / 24)} days`;
}
function belizeTime(utc: string): string {
  const d = new Date(utc.replace(' ', 'T') + (utc.endsWith('Z') ? '' : 'Z'));
  return d.toLocaleString('en-US', { timeZone: 'America/Belize', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
function waLink(phone: string, first: string, what: string): string {
  const digits = phone.replace(/\D/g, '');
  const text = `Hi ${first}, it's René's Adventures. Thanks for your interest in ${what}! Do you have any questions, or would you like me to hold a date for you?`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function brief(r: Report): string[] {
  const c = r.counts;
  const lines: string[] = [];
  lines.push(`${n0(c.visit)} website visit${c.visit === 1 ? '' : 's'} today, ${n0((c.form_lead || 0) + (c.guide_request || 0) + (c.chat_handoff || 0))} enquiries with contact details, ${n0(c.whatsapp_click)} WhatsApp taps.`);
  if (c.checkout_started || c.payment_succeeded) {
    lines.push(`${n0(c.checkout_started)} sent to payment, ${n0(c.payment_succeeded)} paid${r.moneyToday ? ` (${money(r.moneyToday)})` : ''}.`);
  } else {
    lines.push('Nobody started a booking today.');
  }
  const late = r.todos.filter((t) => t.daysLate > 0 && t.callable).length;
  if (late) lines.push(`${late} follow-up${late === 1 ? ' is' : 's are'} overdue.`);
  const soon = r.licences.filter((l) => l.daysLeft <= 60);
  if (soon.length) lines.push(`${soon.length} licence${soon.length === 1 ? '' : 's'} expire in ${Math.min(...soon.map((l) => l.daysLeft))} days.`);
  return lines;
}

function assessment(r: Report): { text: string; moves: string[] } {
  const moves: string[] = [];
  const c30 = r.counts30;
  const visits = c30.visit || 0;
  const enquiries = (c30.form_lead || 0) + (c30.guide_request || 0) + (c30.chat_handoff || 0);
  const toPay = c30.checkout_started || 0;
  const paid = c30.payment_succeeded || 0;
  const overdue = r.todos.filter((t) => t.daysLate > 0 && t.callable);
  if (overdue.length) moves.push(`Clear the ${overdue.length} overdue follow-up${overdue.length === 1 ? '' : 's'}, oldest first.`);
  if (r.leads.some((l) => l.ageHours > 2 && /new/i.test(l.stage))) moves.push('Reply to every new enquiry within 2 hours: speed wins charter bookings.');
  if (toPay > paid && toPay > 0) moves.push(`${toPay - paid} people went to payment and did not finish: message them (WhatsApp button above) and offer Venmo/cash.`);
  const lic = r.licences.filter((l) => l.daysLeft <= 60);
  if (lic.length) moves.push(`Start the licence renewals (${lic.length} due in ${Math.min(...lic.map((l) => l.daysLeft))} days).`);
  if (!r.social.length) moves.push('Connect Facebook/Instagram numbers and enter TikTok numbers so we can see which posts bring visitors.');
  if (moves.length < 3) moves.push('Post today\'s planned content and answer every comment within the hour.');
  const top = r.bySource30.find((s) => s.enquiries || s.paid);
  const text =
    `${rangeLabel(r.range).replace(/^./, (c) => c.toUpperCase())}: ${n0(visits)} visits, ${n0(enquiries)} enquiries, ${n0(toPay)} sent to payment, ${n0(paid)} paid (${money(r.moneyRange)} in this period, ${money(r.moneyMonth)} this month in Lia Desk` +
    (r.stripeMonth !== null ? `; Stripe shows ${money(r.stripeMonth)}` : '') + '). ' +
    (top ? `Best source so far: ${top.source}. ` : 'Not enough tracked traffic yet to name a best source. ') +
    (paid === 0 ? 'The site is not converting yet; the booking fix (contact before payment) is the first lever.' : '');
  return { text, moves: moves.slice(0, 3) };
}

function tile(label: string, value: string, hint = '') {
  return `<div class="tile"><div class="tv">${value}</div><div class="tl">${esc(label)}</div>${hint ? `<div class="th">${esc(hint)}</div>` : ''}</div>`;
}

function render(r: Report, view: OpsView, who: string): string {
  const c = r.counts;
  const updated = belizeTime(r.generatedAt);
  const out: string[] = [];

  out.push(`<header><div class="brand">Rene's Adventures</div><h1>Today · ${esc(new Date(r.day + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</h1><div class="sub">Belize time · updated ${esc(updated)} · for ${esc(who)}${view === 'full' ? ' · full view' : ''}</div></header>`);

  out.push(`<nav class="ranges">${RANGES.map((x) => `<a href="/ops?r=${x.key}" class="${x.key === r.range ? 'on' : ''}">${esc(x.label)}</a>`).join('')}</nav>`);

  if (r.errors.length) {
    out.push(`<div class="warn">Some sources didn't answer: ${r.errors.map(esc).join(' · ')}. Everything else is current.</div>`);
  }

  out.push(`<section class="card"><h2>The day in brief</h2><ul class="brief">${brief(r).map((l) => `<li>${esc(l)}</li>`).join('')}</ul></section>`);

  // ---- Money ----
  const match = r.stripeMonth === null ? '' : Math.abs(r.stripeMonth - r.moneyMonth) < 1
    ? '<span class="ok">matches Stripe</span>'
    : `<span class="bad">Stripe shows ${money(r.stripeMonth)}: difference ${money(r.stripeMonth - r.moneyMonth)}</span>`;
  out.push(`<section class="card"><h2>Money</h2><div class="row2"><div><div class="big">${money(r.moneyToday)}</div><div class="tl">paid today</div></div><div><div class="big">${money(r.moneyMonth)}</div><div class="tl">this month</div></div></div><p class="small">Source: Lia Desk payment records (from Stripe), Belize days. ${match}</p></section>`);

  // ---- People to contact ----
  const ppl = r.leads.slice(0, view === 'full' ? 30 : 12);
  out.push(`<section class="card"><h2>People to contact <span class="pill">${r.leads.length}</span></h2>${
    ppl.length
      ? ppl.map((l) => `<div class="lead${l.overdue ? ' late' : ''}"><div><b>${esc(l.firstName)}</b> · ${esc(l.what)}${l.quoted ? ` · ${money(l.quoted)}` : ''}<div class="small">${esc(l.funnel ? l.funnel.replace('_', ' ') : l.stage)} · ${ago(l.ageHours)} ago · from ${esc(l.source)}${l.nextAction ? ` · next: ${esc(l.nextAction)}${l.nextDue ? ` (${esc(l.nextDue)})` : ''}` : ''}</div></div><div class="btns">${l.phone ? `<a class="btn wa" href="${esc(waLink(l.phone, l.firstName, l.what))}">WhatsApp</a><a class="btn" href="tel:${esc(l.phone.replace(/[^\d+]/g, ''))}">Call</a>` : ''}${l.email ? `<a class="btn" href="mailto:${esc(l.email)}">Email</a>` : ''}</div></div>`).join('')
      : '<p class="small">No open enquiries with contact details.</p>'
  }${r.noContactStarts.count ? `<p class="small muted">Plus ${r.noContactStarts.count} who started paying before the booking fix and left no contact (${money(r.noContactStarts.quoted)} quoted). Nothing to call; shown so the numbers add up.</p>` : ''}</section>`);

  // ---- To-dos by person ----
  const real = r.todos.filter((t) => t.callable);
  const byWho = new Map<string, typeof real>();
  for (const t of real) byWho.set(t.who, [...(byWho.get(t.who) || []), t]);
  out.push(`<section class="card"><h2>To-dos due by today</h2>${
    real.length
      ? [...byWho.entries()].map(([w, list]) => `<h3>${esc(w)} <span class="pill">${list.length}</span></h3><ul>${list.map((t) => `<li${t.daysLate ? ' class="late"' : ''}>${esc(t.summary)}${t.on ? ` · <span class="small">${esc(t.on)}</span>` : ''}${t.daysLate ? ` <span class="bad">${t.daysLate} day${t.daysLate === 1 ? '' : 's'} late</span>` : ''}</li>`).join('')}</ul>`).join('')
      : '<p class="small">Nothing due. 👍</p>'
  }${r.todos.length > real.length ? `<p class="small muted">${r.todos.length - real.length} call task${r.todos.length - real.length === 1 ? '' : 's'} hidden: on bookings with no phone or email.</p>` : ''}</section>`);

  // ---- Licences ----
  const licCls = (d: number) => (d <= 30 ? 'bad' : d <= 60 ? 'warnc' : '');
  const sameDay = r.licences.length > 1 && r.licences.every((l) => l.expiry === r.licences[0].expiry);
  const licList = `<ul>${r.licences.map((l) => `<li>${esc(l.name)} · <span class="${licCls(l.daysLeft)}">${l.daysLeft} days left</span> <span class="small">(${esc(l.expiry)})</span></li>`).join('')}</ul>`;
  out.push(`<section class="card"><h2>Licences & compliance</h2>${!r.licences.length ? '<p class="small">No licences on file.</p>' : sameDay
    ? `<p>All ${r.licences.length} licences expire on ${esc(r.licences[0].expiry)}: <span class="${licCls(r.licences[0].daysLeft)}">${r.licences[0].daysLeft} days left</span>.</p><details><summary class="small">Show the list</summary>${licList}</details>`
    : licList}${r.catchLogsMissing ? `<p class="bad">${r.catchLogsMissing} fisheries catch log${r.catchLogsMissing === 1 ? '' : 's'} not filed.</p>` : ''}</section>`);

  if (view === 'full') {
    // ---- Tiles ----
    out.push(`<section class="card"><h2>Today at a glance</h2><div class="tiles">${[
      tile('Website visits', n0(c.visit)),
      tile('Enquiries w/ contact', n0((c.form_lead || 0) + (c.guide_request || 0) + (c.chat_handoff || 0))),
      tile('WhatsApp taps', n0(c.whatsapp_click)),
      tile('Chats opened', n0(c.chat_opened)),
      tile('Booking started', n0(c.booking_started)),
      tile('Sent to payment', n0(c.checkout_started)),
      tile('Paid', n0(c.payment_succeeded), r.moneyToday ? money(r.moneyToday) : ''),
      tile('Posts published', n0(c.post_published)),
      tile('Overdue follow-ups', n0(r.todos.filter((t) => t.daysLate > 0 && t.callable).length)),
    ].join('')}</div></section>`);

    // ---- Funnel 30 days ----
    const steps: [string, number][] = [
      ['Website visits', r.counts30.visit || 0],
      ['Chats / WhatsApp taps', (r.counts30.chat_opened || 0) + (r.counts30.whatsapp_click || 0)],
      ['Enquiries with contact', (r.counts30.form_lead || 0) + (r.counts30.guide_request || 0) + (r.counts30.chat_handoff || 0)],
      ['Booking started', r.counts30.booking_started || 0],
      ['Sent to payment', r.counts30.checkout_started || 0],
      ['Paid', r.counts30.payment_succeeded || 0],
    ];
    const max = Math.max(1, ...steps.map((s) => s[1]));
    out.push(`<section class="card"><h2>Funnel · ${esc(rangeLabel(r.range))}</h2>${steps.map(([l, v], i) => {
      const prev = i ? steps[i - 1][1] : 0;
      const rate = i && prev ? ` <span class="small">${Math.round((v / prev) * 100)}% of previous</span>` : '';
      return `<div class="fn"><div class="fl">${esc(l)}</div><div class="fb"><span style="width:${Math.max(2, (v / max) * 100)}%"></span></div><div class="fv">${n0(v)}${rate}</div></div>`;
    }).join('')}<h3>Where people came from</h3><table><thead><tr><th>Source</th><th>Visits</th><th>Enquiries</th><th>To payment</th><th>Paid</th><th>$</th></tr></thead><tbody>${
      r.bySource30.length ? r.bySource30.map((s) => `<tr><td>${esc(s.source)}</td><td>${n0(s.visits)}</td><td>${n0(s.enquiries)}</td><td>${n0(s.toPayment)}</td><td>${n0(s.paid)}</td><td>${s.money ? money(s.money) : ''}</td></tr>`).join('') : '<tr><td colspan="6" class="small">No tracked activity yet.</td></tr>'
    }</tbody></table></section>`);

    // ---- Social ----
    out.push(`<section class="card"><h2>Social</h2>${r.social.length ? `<table><thead><tr><th>Platform</th><th>Day</th><th>Followers</th><th>Views</th><th>Likes</th><th>Comments</th><th>Waiting</th></tr></thead><tbody>${r.social.map((s) => `<tr><td>${esc(s.platform)}</td><td>${esc(s.day)}</td><td>${n0(s.followers)}</td><td>${n0(s.views)}</td><td>${n0(s.likes)}</td><td>${n0(s.comments)}</td><td>${n0(s.messagesWaiting)}</td></tr>`).join('')}</tbody></table><p class="small">Each platform counts "views" its own way; don't add them together.</p>` : '<p class="small">No social numbers in Lia Desk yet (see "What we can\'t see").</p>'}</section>`);

    // ---- Work log ----
    const done = r.tasks.filter((t) => t.doneToday);
    const blocked = r.tasks.filter((t) => t.blocked);
    const open = r.tasks.filter((t) => !t.blocked && !/done|complete|cancel/i.test(t.stage));
    out.push(`<section class="card"><h2>Work log</h2>${r.tasks.length ? `<p><b>Done today:</b> ${done.length ? done.map((t) => esc(t.name)).join(' · ') : 'nothing marked done'}</p><details${blocked.length ? ' open' : ''}><summary>Blocked / waiting (${blocked.length})</summary><ul>${blocked.map((t) => `<li>${esc(t.name)}${t.owner ? ` <span class="small">· ${esc(t.owner)}</span>` : ''}${t.deadline ? ` <span class="small">due ${esc(t.deadline)}</span>` : ''}</li>`).join('')}</ul></details><details><summary>Open (${open.length})</summary><ul>${open.map((t) => `<li>${esc(t.name)}${t.owner ? ` <span class="small">· ${esc(t.owner)}</span>` : ''}${t.deadline ? ` <span class="small">due ${esc(t.deadline)}</span>` : ''}</li>`).join('')}</ul></details>` : '<p class="small">The task list has not been moved into Lia Desk yet.</p>'}</section>`);

    // ---- Activity feed ----
    out.push(`<section class="card"><details><summary><b>Latest activity</b> (${r.feed.length})</summary><ul class="feed">${r.feed.map((f) => `<li><span class="small">${esc(belizeTime(f.at))}</span> ${esc(kindLabel(f.kind))}${f.summary ? ` · ${esc(f.summary)}` : ''}${f.source ? ` <span class="small">(${esc(f.source)})</span>` : ''}${f.value ? ` · ${money(f.value)}` : ''}</li>`).join('')}</ul></details></section>`);
  }

  // ---- History (everything Lia Desk knows, month by month) ----
  if (r.history.length) {
    const tot = r.history.reduce((a, h) => ({ visits: a.visits + h.visits, enquiries: a.enquiries + h.enquiries, toPayment: a.toPayment + h.toPayment, abandoned: a.abandoned + h.abandoned, paid: a.paid + h.paid, money: a.money + h.money, siteChanges: a.siteChanges + h.siteChanges, milestones: a.milestones + h.milestones, posts: a.posts + h.posts }), { visits: 0, enquiries: 0, toPayment: 0, abandoned: 0, paid: 0, money: 0, siteChanges: 0, milestones: 0, posts: 0 });
    out.push(`<section class="card"><h2>History · month by month</h2><p class="small">Back-filled from Stripe (every payment attempt since the start), the website's change history and the work log. Website visits and enquiry sources are only tracked from Nov 9, 2026.</p><div class="scroll"><table><thead><tr><th>Month</th><th>Sent to payment</th><th>Abandoned</th><th>Paid</th><th>$ in</th><th>Site changes</th><th>Work done</th><th>Posts</th><th>Visits</th><th>Enquiries</th></tr></thead><tbody>${r.history.map((h) => `<tr><td>${esc(h.month)}</td><td>${n0(h.toPayment)}</td><td>${n0(h.abandoned)}</td><td>${n0(h.paid)}</td><td>${h.money ? money(h.money) : ''}</td><td>${n0(h.siteChanges)}</td><td>${n0(h.milestones)}</td><td>${n0(h.posts)}</td><td>${n0(h.visits)}</td><td>${n0(h.enquiries)}</td></tr>`).join('')}<tr class="tot"><td>Total</td><td>${n0(tot.toPayment)}</td><td>${n0(tot.abandoned)}</td><td>${n0(tot.paid)}</td><td>${money(tot.money)}</td><td>${n0(tot.siteChanges)}</td><td>${n0(tot.milestones)}</td><td>${n0(tot.posts)}</td><td>${n0(tot.visits)}</td><td>${n0(tot.enquiries)}</td></tr></tbody></table></div></section>`);
  }

  // ---- Work delivered in the range ----
  if (r.work.length) {
    const label = (k: string) => (k === 'site_change' ? 'Website' : k === 'post_published' ? 'Post' : 'Work');
    out.push(`<section class="card"><details${view === 'full' ? ' open' : ''}><summary><b>Work delivered · ${esc(rangeLabel(r.range))}</b> (${r.work.length})</summary><ul class="feed">${r.work.map((w) => `<li><span class="small">${esc(w.at.slice(0, 10))}</span> <span class="tag">${label(w.kind)}</span> ${esc(w.summary)}</li>`).join('')}</ul></details></section>`);
  }

  // ---- Assessment ----
  const a = assessment(r);
  out.push(`<section class="card"><h2>Where we stand</h2><p>${esc(a.text)}</p><h3>Top moves for tomorrow</h3><ol>${a.moves.map((m) => `<li>${esc(m)}</li>`).join('')}</ol></section>`);

  // ---- Blind spots ----
  out.push(`<section class="card"><details${view === 'full' ? ' open' : ''}><summary><b>What we can't see yet</b> (${r.blindSpots.length})</summary>${r.blindSpots.map((b) => `<div class="blind"><b>${esc(b.what)}</b><div class="small">Why: ${esc(b.why)}</div><div class="small">Fix: ${esc(b.fix)}</div></div>`).join('')}</details></section>`);

  out.push(`<section class="card small"><details><summary><b>How this is measured</b></summary><ul><li>Everything is read live from Lia Desk when this page opens. Nothing is typed into this page by hand.</li><li>"Today" = the Belize calendar day (UTC−6).</li><li>Money = payments Stripe reported to Lia Desk, minus refunds. Cross-checked against Stripe directly.</li><li>Website activity is anonymous: one visit per browser per 30 minutes. Source = how the person first found us (ad, Google, Instagram…).</li><li>Enquiries count forms, guide requests and chats where the guest left contact details.</li></ul></details></section>`);

  return out.join('\n');
}

function page(title: string, body: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><title>${esc(title)}</title><style>
:root{--navy:#0b1f3a;--gold:#f5b301;--ink:#14213d;--muted:#5b6475;--bg:#f4f6fa;--card:#fff;--bad:#c0392b;--ok:#1e8449;--warn:#b9770e}
@media (prefers-color-scheme:dark){:root{--ink:#e8ecf3;--muted:#9aa4b5;--bg:#0a1424;--card:#11203a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
header{background:var(--navy);color:#fff;padding:20px 16px 18px}header .brand{color:var(--gold);font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:13px}
h1{margin:6px 0 2px;font-size:24px}.sub{opacity:.8;font-size:13px}main{max-width:860px;margin:0 auto;padding:12px}
.card{background:var(--card);border-radius:14px;padding:16px;margin:12px 0;box-shadow:0 1px 3px rgba(0,0,0,.08)}h2{margin:0 0 10px;font-size:19px}h3{margin:14px 0 6px;font-size:16px}
.pill{background:var(--gold);color:#000;border-radius:999px;padding:1px 9px;font-size:13px;vertical-align:middle}.small{font-size:13px;color:var(--muted)}.muted{color:var(--muted)}
.big{font-size:30px;font-weight:800}.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}.tl{font-size:13px;color:var(--muted)}
.tiles{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}@media(min-width:640px){.tiles{grid-template-columns:repeat(3,1fr)}}
.tile{border:1px solid rgba(127,127,127,.25);border-radius:12px;padding:12px}.tv{font-size:26px;font-weight:800}.th{font-size:12px;color:var(--ok)}
.lead{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-top:1px solid rgba(127,127,127,.2);flex-wrap:wrap}.lead.late b{color:var(--bad)}
.btns{display:flex;gap:6px;flex-wrap:wrap}.btn{display:inline-block;padding:8px 12px;border-radius:999px;background:var(--navy);color:#fff;text-decoration:none;font-weight:700;font-size:14px}.btn.wa{background:#1fa855}
.bad{color:var(--bad);font-weight:700}.ok{color:var(--ok);font-weight:700}.warnc{color:var(--warn);font-weight:700}li.late{color:var(--bad)}
.warn{background:#fff4d6;color:#7a5200;border-radius:10px;padding:10px 12px;margin:12px 0;font-size:14px}
ul{padding-left:20px;margin:6px 0}.brief li{margin:4px 0}table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;padding:6px 4px;border-bottom:1px solid rgba(127,127,127,.2)}
.fn{display:grid;grid-template-columns:150px 1fr auto;gap:8px;align-items:center;margin:6px 0;font-size:14px}.fb{background:rgba(127,127,127,.15);border-radius:6px;height:12px}.fb span{display:block;height:12px;border-radius:6px;background:var(--gold)}
summary{cursor:pointer;padding:4px 0}.blind{padding:8px 0;border-top:1px solid rgba(127,127,127,.2)}.feed li{margin:3px 0}.ranges{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0}.ranges a{padding:6px 12px;border-radius:999px;background:var(--card);color:var(--ink);text-decoration:none;font-size:14px;border:1px solid rgba(127,127,127,.3)}.ranges a.on{background:var(--gold);color:#000;font-weight:700}.scroll{overflow-x:auto}.tot td{font-weight:800}.tag{font-size:11px;font-weight:700;background:rgba(127,127,127,.15);border-radius:6px;padding:1px 6px}
</style></head><body><main>${body}</main></body></html>`;
}
