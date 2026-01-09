'use client';

import { useState } from 'react';

export default function BrochureCta({ tourSlug, tourTitle }: { tourSlug: string; tourTitle: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brochureMissing, setBrochureMissing] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/brochure-download', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, tourSlug, tourTitle }),
      });

      if (!res.ok) {
        if (res.status === 404) {
          setBrochureMissing(true);
          setOpen(false);
          return;
        }

        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { downloadUrl?: string };
      if (!data?.downloadUrl) throw new Error('Missing download url');

      setOpen(false);

      // Trigger actual download
      window.location.href = data.downloadUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (brochureMissing) {
            window.dispatchEvent(new CustomEvent('lia:open'));
            return;
          }
          setOpen(true);
        }}
        className="w-full px-6 py-4 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/15 transition"
      >
        {brochureMissing ? 'Join Waiting List' : 'Download Luxury Brochure'}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0F172A]/95 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Luxury Brochure</div>
                <div className="mt-2 text-2xl font-bold text-white">Where should we send it?</div>
                <div className="mt-2 text-white/70 text-sm">Enter your details to unlock the PDF download.</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 w-10 h-10 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 transition"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <div className="text-xs uppercase tracking-[0.25em] text-white/60">Name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-white outline-none focus:border-[#D4AF37]/60"
                  placeholder="Your name"
                />
              </label>

              <label className="grid gap-2">
                <div className="text-xs uppercase tracking-[0.25em] text-white/60">Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-white outline-none focus:border-[#D4AF37]/60"
                  placeholder="you@email.com"
                />
              </label>

              {error && <div className="text-sm text-red-300">{error}</div>}

              <button
                type="button"
                disabled={submitting || !email}
                onClick={() => void submit()}
                className="mt-2 w-full px-6 py-4 rounded-xl bg-[#D4AF37] text-slate-950 font-extrabold border border-white/10 hover:brightness-110 transition disabled:opacity-50"
              >
                {submitting ? 'Preparing download…' : 'Download PDF'}
              </button>

              <div className="text-[11px] text-white/50 leading-relaxed">
                By downloading, you agree to receive trip planning info from René’s Adventures. Unsubscribe anytime.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
