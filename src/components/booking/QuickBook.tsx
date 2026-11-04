'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Tour } from '@/types/tour';
import { getWhatsAppLink } from '@/lib/utils/whatsapp-link';
import { EVENTS, trackWithServer } from '@/lib/analytics/events';

/**
 * QuickBook - the one booking box on every tour page.
 * Pick the trip, pick a date and guests, see the total, send. Rene confirms.
 * Prices come straight from the tour data; nothing here changes a price.
 */

export const SLOGAN = 'Your day. Your boat. Your adventure.';

export type QuickBookOption = {
  id: 'half' | 'full' | 'trip';
  label: string;
  sub?: string | null;
  price: number | null;
  note?: string;
};

export type QuickBookProps = {
  tourSlug: string;
  tourTitle: string;
  options: QuickBookOption[];
  includedGuests: number;
  extraGuestPrice: number;
  maxGuests: number;
  /** Optional beach BBQ toggle (Secret Beach, Deep Sea): base + per guest over the included number. */
  bbqAddOn?: { base: number; perExtraGuest: number } | null;
  /** BBQ already in the Full Day price; extra guests beyond the included number pay this each. */
  fullDayBbqExtraGuest?: number | null;
  /** Card fee charged on (subtotal + tax) instead of on subtotal. Matches each page's existing math. */
  compoundFees?: boolean;
  priceOnRequest?: boolean;
};

export function quickBookFromTour(tour: Tour): QuickBookProps {
  const options: QuickBookOption[] = [];
  const priceOnRequest = tour.slug === 'blue-hole';
  if (priceOnRequest) {
    options.push({ id: 'trip', label: tour.title, sub: tour.duration, price: null });
  } else {
    if (tour.hasHalfDay) options.push({ id: 'half', label: 'Half Day', sub: tour.duration, price: tour.price });
    if (tour.hasFullDay && tour.fullDayPrice != null) {
      options.push({ id: 'full', label: 'Full Day', sub: tour.fullDayDuration, price: tour.fullDayPrice });
    }
    if (options.length === 0) options.push({ id: 'trip', label: tour.duration, price: tour.price });
  }
  const bbqTour = tour.slug === 'secret-beach' || tour.slug === 'deep-sea-fishing';
  return {
    tourSlug: tour.slug,
    tourTitle: tour.title,
    options,
    includedGuests: tour.includedGuests || 4,
    extraGuestPrice: tour.additionalGuestPrice || 75,
    maxGuests: tour.maxGuests || 8,
    bbqAddOn: bbqTour ? { base: 75, perExtraGuest: 25 } : null,
    compoundFees: false,
    priceOnRequest,
  };
}

function money(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}
export default function QuickBook(props: QuickBookProps) {
  const {
    tourTitle, options, includedGuests, extraGuestPrice, maxGuests,
    bbqAddOn, fullDayBbqExtraGuest, compoundFees, priceOnRequest,
  } = props;

  const [optionId, setOptionId] = useState(options[0]?.id ?? 'trip');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(Math.min(includedGuests, maxGuests));
  const [bbq, setBbq] = useState(false);
  const [step, setStep] = useState<'trip' | 'contact' | 'done'>('trip');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [honey, setHoney] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minDate, setMinDate] = useState('');

  useEffect(() => setMinDate(tomorrowIso()), []);

  const option = options.find((o) => o.id === optionId) ?? options[0];
  const isFull = option?.id === 'full';

  const lines = useMemo(() => {
    if (!option || option.price == null) return null;
    const out: { label: string; amount: number }[] = [{ label: `${option.label}`, amount: option.price }];
    const extra = Math.max(0, guests - includedGuests);
    if (extra > 0) out.push({ label: `${extra} extra guest${extra > 1 ? 's' : ''} x ${money(extraGuestPrice)}`, amount: extra * extraGuestPrice });
    if (isFull && fullDayBbqExtraGuest && extra > 0) {
      out.push({ label: `BBQ for ${extra} extra guest${extra > 1 ? 's' : ''}`, amount: extra * fullDayBbqExtraGuest });
    }
    if (bbqAddOn && bbq) out.push({ label: 'Beach BBQ', amount: bbqAddOn.base + extra * bbqAddOn.perExtraGuest });
    const subtotal = out.reduce((s, l) => s + l.amount, 0);
    const taxRaw = subtotal * 0.125;
    const feeRaw = compoundFees ? (subtotal + taxRaw) * 0.06 : subtotal * 0.06;
    const tax = compoundFees ? taxRaw : Math.round(taxRaw);
    const fee = compoundFees ? feeRaw : Math.round(feeRaw);
    return { out, subtotal, tax, fee, total: subtotal + tax + fee };
  }, [option, guests, includedGuests, extraGuestPrice, isFull, fullDayBbqExtraGuest, bbqAddOn, bbq, compoundFees]);

  const summary = [
    `${tourTitle}${option && option.id !== 'trip' ? ` - ${option.label}` : ''}`,
    `Date: ${date || 'flexible'}`,
    `Guests: ${guests}`,
    bbqAddOn && bbq ? 'Beach BBQ: yes' : null,
    lines ? `Quoted total: ${money(lines.total)} (incl. 12.5% tax + 6% card fee)` : 'Price on request',
  ].filter(Boolean).join('\n');

  const waLink = getWhatsAppLink(`Hi Rene,\n\nI'd like to book:\n${summary}\n\nThank you!`);

  async function send() {
    setError(null);
    if (!name.trim()) return setError('Please add your name.');
    if (!contact.trim()) return setError('Please add your WhatsApp number or email.');
    const isEmail = contact.includes('@');
    setSending(true);
    try {
      const res = await fetch('/api/crm/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          ...(isEmail ? { email: contact.trim() } : { phone: contact.trim() }),
          interest: summary.split('\n')[0],
          tripDate: date || undefined,
          guests,
          source: 'Website',
          message: `Booking request from the tour page.\n${summary}`,
          company_website: honey,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || data.ok === false) {
        setError(data.error || 'That did not go through. Tap WhatsApp below and we will book you there.');
        return;
      }
      trackWithServer(EVENTS.LEAD, { item: summary.split('\n')[0], value: lines?.total, currency: 'USD' });
      setStep('done');
    } catch {
      setError('No connection. Tap WhatsApp below and we will book you there.');
    } finally {
      setSending(false);
    }
  }

  const tooMany = guests >= maxGuests;
  return (
    <div id="quickbook" className="scroll-mt-24 rounded-3xl border border-white/10 bg-[#060608] p-6 text-white shadow-2xl">
      <div className="text-center">
        <div className="text-[13px] font-black uppercase tracking-[0.18em] text-amber-300 leading-snug">{SLOGAN}</div>
        <div className="mt-2 text-sm text-white/60">{tourTitle} · private boat · no strangers on board</div>
      </div>

      {step === 'done' ? (
        <div className="mt-6 text-center">
          <div className="text-2xl font-extrabold">Request sent.</div>
          <p className="mt-2 text-white/70 text-sm leading-relaxed">
            Rene confirms your date on WhatsApp or email, usually within a few hours. No payment until your date is confirmed.
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            onClick={() => trackWithServer(EVENTS.WHATSAPP_CLICK, { item: tourTitle })}
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:brightness-110">
            Message Rene on WhatsApp now
          </a>
        </div>
      ) : (
        <>
          {options.length > 1 && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {options.map((o) => (
                <button key={o.id} type="button" onClick={() => setOptionId(o.id)}
                  className={`rounded-2xl border px-3 py-3 text-left transition ${o.id === optionId ? 'border-amber-400 bg-amber-400/10' : 'border-white/15 hover:border-white/40'}`}>
                  <div className="font-bold">{o.label}</div>
                  <div className="text-xl font-extrabold text-amber-300">{o.price != null ? money(o.price) : 'Ask'}</div>
                  {o.sub ? <div className="text-[11px] text-white/50">{o.sub}</div> : null}
                  {o.note ? <div className="text-[11px] font-semibold text-emerald-300">{o.note}</div> : null}
                </button>
              ))}
            </div>
          )}
          {options.length === 1 && (
            <div className="mt-6 rounded-2xl border border-white/15 px-4 py-3 text-center">
              <div className="text-2xl font-extrabold text-amber-300">{priceOnRequest || option?.price == null ? 'Price on request' : money(option.price)}</div>
              {option?.sub ? <div className="text-xs text-white/50">{option.sub}</div> : null}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] uppercase tracking-widest text-white/50">Date</span>
              <input type="date" min={minDate || undefined} value={date} onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white [color-scheme:dark]" />
            </label>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-white/50">Guests</span>
              <div className="mt-1 flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-2 py-1.5">
                <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="h-8 w-8 rounded-full bg-white/10 font-bold">-</button>
                <span className="font-bold">{guests}</span>
                <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))} className="h-8 w-8 rounded-full bg-white/10 font-bold">+</button>
              </div>
            </div>
          </div>
          <div className="mt-1 text-[11px] text-white/45">
            {includedGuests} guests included{lines ? `, then ${money(extraGuestPrice)} each` : ''}.{' '}
            {tooMany ? <a href={getWhatsAppLink(`Hi Rene, we are ${maxGuests + 1}+ guests for ${tourTitle}. Can you help?`)} target="_blank" rel="noopener noreferrer" className="underline text-amber-300">More than {maxGuests}? Message Rene.</a> : null}
          </div>
          {bbqAddOn && (
            <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-white/15 px-3 py-2.5">
              <input type="checkbox" checked={bbq} onChange={(e) => setBbq(e.target.checked)} className="h-5 w-5 accent-amber-400" />
              <span className="text-sm">Add a beach BBQ <span className="text-white/50">({money(bbqAddOn.base)} + {money(bbqAddOn.perExtraGuest)} per guest over {includedGuests})</span></span>
            </label>
          )}

          {lines && (
            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm">
              {lines.out.map((l) => (
                <div key={l.label} className="flex justify-between text-white/70"><span>{l.label}</span><span>{money(l.amount)}</span></div>
              ))}
              <div className="flex justify-between text-white/50"><span>Belize tax 12.5% + card fee 6%</span><span>{money(lines.tax + lines.fee)}</span></div>
              <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-lg font-extrabold"><span>Total</span><span className="text-amber-300">{money(lines.total)}</span></div>
            </div>
          )}

          {step === 'contact' && (
            <div className="mt-4 space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/40" />
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="WhatsApp number or email" autoComplete="email"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/40" />
              <input value={honey} onChange={(e) => setHoney(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            </div>
          )}

          {error && <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}

          <button type="button" disabled={sending}
            onClick={() => (step === 'trip' ? setStep('contact') : send())}
            className="mt-5 w-full rounded-full bg-amber-400 px-5 py-3.5 text-base font-extrabold text-black hover:bg-amber-300 disabled:opacity-60">
            {sending ? 'Sending...' : step === 'trip' ? 'Request my date' : 'Send my request'}
          </button>
          <div className="mt-2 text-center text-[11px] text-white/50">No payment now. Rene confirms your date first.</div>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            onClick={() => trackWithServer(EVENTS.WHATSAPP_CLICK, { item: tourTitle })}
            className="mt-3 block text-center text-sm font-semibold text-emerald-300 hover:underline">
            Prefer WhatsApp? Book with Rene there
          </a>
        </>
      )}
    </div>
  );
}

/** Thin bar on phones so the booking box is always one tap away. */
export function QuickBookMobileBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-[60] flex items-center justify-between gap-3 border-t border-white/15 bg-gray-950/95 px-4 py-3 backdrop-blur transition-transform ${show ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="text-[11px] font-black uppercase tracking-wider text-amber-300 leading-tight">{SLOGAN}</div>
      <button type="button" onClick={() => document.getElementById('quickbook')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        className="shrink-0 rounded-full bg-amber-400 px-4 py-2 text-sm font-extrabold text-black">Request my date</button>
    </div>
  );
}