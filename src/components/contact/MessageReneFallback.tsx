'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

/**
 * Stand-in for every WhatsApp button on the site while the business number is
 * still being set up with Meta (guests were told "this number is not on
 * WhatsApp", and the enquiry was lost).
 *
 * One listener on the document catches any wa.me link, wherever it lives, and
 * opens a short message form instead. The message lands in Lia Desk as a lead,
 * with where the guest came from. Works for guests without WhatsApp too.
 *
 * To hand the buttons back to WhatsApp once the number is live, set
 * NEXT_PUBLIC_WHATSAPP_LIVE=on in Vercel and redeploy.
 */
const WHATSAPP_LIVE = (process.env.NEXT_PUBLIC_WHATSAPP_LIVE || '').toLowerCase() === 'on';

export default function MessageReneFallback() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (WHATSAPP_LIVE) return;
    // Only links to René's number; a plain "share on WhatsApp" link is left alone.
    const isRene = (href: string) => /^https?:\/\/(wa\.me\/\d|api\.whatsapp\.com\/send\?phone=\d)/i.test(href);
    function show(href: string) {
      let text = '';
      try {
        text = new URL(href).searchParams.get('text') || '';
      } catch {
        /* keep empty */
      }
      setMessage(text);
      setDone(false);
      setErr(null);
      setOpen(true);
      setTimeout(() => first.current?.focus(), 50);
    }
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      const href = a?.getAttribute('href') || '';
      if (!isRene(href)) return;
      e.preventDefault();
      show(href);
    }
    // Some buttons open WhatsApp with window.open instead of a link.
    const realOpen = window.open;
    window.open = function (url?: string | URL, ...rest: unknown[]) {
      const href = url ? String(url) : '';
      if (isRene(href)) {
        show(href);
        return null;
      }
      return (realOpen as (...a: unknown[]) => Window | null).call(window, url, ...rest);
    } as typeof window.open;
    // Bubble phase, so the click tracker (capture phase) still counts the tap.
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      window.open = realOpen;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (WHATSAPP_LIVE || !open) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setErr('Please tell us your name.');
    if (!email.trim() && !phone.trim()) return setErr('Please leave a phone number or an email so René can reach you.');
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setErr('That email address looks incomplete.');
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch('/api/crm/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          message: message.trim() || undefined,
          interest: 'Message from a WhatsApp button',
          source: 'Website',
          page: window.location.pathname,
          company_website: trap,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || data.ok === false) {
        setErr(data.error || 'That did not go through. Please try again, or email renesadventuresbz@gmail.com.');
      } else {
        setDone(true);
      }
    } catch {
      setErr('That did not go through. Please try again, or email renesadventuresbz@gmail.com.');
    } finally {
      setBusy(false);
    }
  }

  const input = 'mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-amber-500 focus:outline-none';

  return (
    <div className="fixed inset-0 z-[210] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="mr-title" onClick={() => setOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl text-slate-900 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="mr-title" className="text-xl font-extrabold">Message Captain René</h2>
            <p className="mt-1 text-sm text-slate-600">Leave your details and René will get back to you, by WhatsApp, phone or email.</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 text-2xl leading-none" aria-label="Close">×</button>
        </div>

        {done ? (
          <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-4 text-emerald-900">
            <b>Thanks, {name.trim().split(' ')[0]}!</b> Your message is with René. He&apos;ll reach you soon.
            <button type="button" onClick={() => setOpen(false)} className="mt-4 block w-full rounded-full bg-emerald-600 px-6 py-3 font-bold text-white">Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label className="mt-5 block text-sm font-semibold">Your name
              <input ref={first} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required className={input} />
            </label>
            <label className="mt-3 block text-sm font-semibold">Phone number <span className="font-normal text-slate-500">(WhatsApp if you have it)</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="+1 555 123 4567" className={input} />
            </label>
            <label className="mt-3 block text-sm font-semibold">Email <span className="font-normal text-slate-500">(phone or email, at least one)</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" className={input} />
            </label>
            <label className="mt-3 block text-sm font-semibold">Message <span className="font-normal text-slate-500">(dates and group size help)</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={input} />
            </label>
            <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} className="hidden" aria-hidden="true" name="company_website" />
            {err && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
            <button type="submit" disabled={busy} className="mt-5 w-full rounded-full bg-amber-400 px-6 py-4 text-base font-extrabold text-black hover:bg-amber-300 disabled:opacity-60">
              {busy ? 'Sending…' : 'Send to René'}
            </button>
            <p className="mt-3 text-xs text-slate-500">
              We use your details only to answer you and plan your trip. See our{' '}
              <a href="/privacy-policy" target="_blank" className="underline">privacy policy</a>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
