'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { EVENTS, track } from '@/lib/analytics/events';

export interface CheckoutContact {
  name: string;
  email?: string;
  phone?: string;
  tripDate?: string;
  marketingOk: boolean;
}

interface Props {
  open: boolean;
  /** e.g. "Rene's Custom Adventure, Half Day, 4 guests" */
  summary: string;
  /** Pre-formatted total, e.g. "$524.70" */
  totalLabel: string;
  busy?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (c: CheckoutContact) => void;
}

/**
 * One short step before the payment page: who is coming, and how René can
 * reach them. Without it, a guest who closes the payment page is a stranger
 * we can never call back.
 */
export default function CheckoutContactModal({ open, summary, totalLabel, busy, error, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [marketingOk, setMarketingOk] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    track(EVENTS.BOOKING_STARTED, { item: summary, page: window.location.pathname });
    setTimeout(() => first.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, summary, onClose]);

  if (!open) return null;

  const today = new Date().toISOString().slice(0, 10);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setLocalError('Please tell us your name.');
    if (!email.trim() && !phone.trim()) return setLocalError('Please leave an email or a phone number so René can reach you.');
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setLocalError('That email address looks incomplete.');
    setLocalError(null);
    onSubmit({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      tripDate: tripDate || undefined,
      marketingOk,
    });
  }

  const shown = localError || error;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="ccm-title" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl text-slate-900 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="ccm-title" className="text-xl font-extrabold">Who&apos;s coming?</h2>
            <p className="mt-1 text-sm text-slate-600">{summary}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl leading-none" aria-label="Close">×</button>
        </div>

        <label className="mt-5 block text-sm font-semibold">Your name
          <input ref={first} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-amber-500 focus:outline-none" />
        </label>
        <label className="mt-3 block text-sm font-semibold">Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-amber-500 focus:outline-none" />
        </label>
        <label className="mt-3 block text-sm font-semibold">Phone number <span className="font-normal text-slate-500">(WhatsApp if you have it; email or phone, at least one)</span>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="+1 555 123 4567"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-amber-500 focus:outline-none" />
        </label>
        <label className="mt-3 block text-sm font-semibold">Trip date <span className="font-normal text-slate-500">(if you know it)</span>
          <input type="date" min={today} value={tripDate} onChange={(e) => setTripDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-amber-500 focus:outline-none" />
        </label>

        <label className="mt-4 flex items-start gap-3 text-sm text-slate-700">
          <input type="checkbox" checked={marketingOk} onChange={(e) => setMarketingOk(e.target.checked)} className="mt-1 h-4 w-4" />
          <span>Send me Belize tips and the occasional offer. (Optional. Unsubscribe any time.)</span>
        </label>

        <p className="mt-3 text-xs text-slate-500">
          We use your details only to confirm and plan your trip with Captain René. See our{' '}
          <a href="/privacy-policy" target="_blank" className="underline">privacy policy</a>.
        </p>

        {shown && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{shown}</p>}

        <button type="submit" disabled={busy}
          className="mt-5 w-full rounded-full bg-amber-400 px-6 py-4 text-base font-extrabold text-black hover:bg-amber-300 disabled:opacity-60">
          {busy ? 'Opening secure payment…' : `Continue to payment · ${totalLabel}`}
        </button>
        <p className="mt-2 text-center text-xs text-slate-500">Prefer Venmo or cash (no 6% card fee)? Message us on WhatsApp.</p>
      </form>
    </div>
  );
}
