'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type LeadMagnetStatus = 'idle' | 'submitting' | 'success' | 'error';

function normalizePhone(input: string) {
  const cleaned = input.replace(/[^0-9+]/g, '').trim();
  if (!cleaned) return '';
  if (cleaned.startsWith('+')) return cleaned;
  return `+${cleaned}`;
}

export default function LeadMagnet() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<LeadMagnetStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const normalized = useMemo(() => normalizePhone(phone), [phone]);

  const canSubmit = useMemo(() => {
    if (status === 'submitting') return false;
    return normalized.length >= 8;
  }, [normalized.length, status]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    setStatus('submitting');
    setError(null);

    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalized,
          source: 'homepage_lead_magnet',
          offer: 'Belize Survival Guide',
        }),
      });

      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg =
          typeof data === 'object' && data !== null && 'error' in data && typeof (data as { error?: unknown }).error === 'string'
            ? (data as { error: string }).error
            : 'Could not submit.';
        setError(errMsg);
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit.');
      setStatus('error');
    }
  };

  return (
    <section id="lead-magnet" className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.35]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.14) 0%, transparent 55%), radial-gradient(circle at 80% 30%, rgba(0, 206, 209, 0.12) 0%, transparent 60%), radial-gradient(circle at 50% 85%, rgba(255, 107, 53, 0.10) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-screen-2xl px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-10 md:p-12 shadow-2xl"
          >
            <div className="grid md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-7">
                <div className="text-xs uppercase tracking-[0.35em] text-[#d4af37]/80">Belize Survival Guide</div>
                <h2 className="mt-4 text-4xl md:text-5xl font-light text-white tracking-tight">
                  The Belize Survival Guide
                  <span className="block font-serif italic text-[#d4af37]">by Lia</span>
                </h2>
                <p className="mt-4 text-white/70 font-light leading-relaxed">
                  A short, high-signal PDF: what to pack, how to read the wind, what to book on a breezy day, and the
                  local tips that make your trip feel effortless.
                </p>

                <div className="mt-7 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/35 border border-white/10 text-white/80 text-[11px] uppercase tracking-[0.25em]">
                  Delivered via WhatsApp
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="rounded-2xl border border-white/15 bg-black/35 backdrop-blur-xl p-6">
                  <label className="block text-xs uppercase tracking-[0.25em] text-white/60 mb-3">WhatsApp Number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+501 6XX XXXX"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
                    inputMode="tel"
                    autoComplete="tel"
                  />

                  {error && <div className="mt-3 text-sm text-red-300">{error}</div>}

                  {status === 'success' ? (
                    <div className="mt-5 rounded-xl border border-[#d4af37]/25 bg-[#d4af37]/10 p-4">
                      <div className="text-white font-semibold">Perfect.</div>
                      <div className="mt-1 text-white/75 text-sm">
                        Lia will send the guide via WhatsApp. If you don’t see it, double-check your country code.
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={onSubmit}
                      disabled={!canSubmit}
                      className="mt-5 w-full rounded-xl bg-[#d4af37] text-slate-950 font-extrabold px-5 py-3 border border-white/10 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'submitting' ? 'Sending…' : 'Send Me the Guide'}
                    </button>
                  )}

                  <div className="mt-3 text-xs text-white/50 leading-relaxed">
                    By submitting, you agree to receive a WhatsApp message from René’s Adventures.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
