'use client';

import { useMemo, useState } from 'react';

export default function FishStoryCreator() {
  const prompts = useMemo(
    () => [
      'Write me a short Belize fishing story about landing a monster mahi.',
      'Tell a funny story about tarpon feeding at Caye Caulker.',
      'Create a cinematic story about a sunset cruise in Belize.',
    ],
    []
  );

  const [value, setValue] = useState('');

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-slate-950 px-6 py-12 sm:px-10 sm:py-14 ring-1 ring-slate-200 shadow-[0_22px_80px_rgba(15,23,42,0.14)]">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/65">Fish Story Creator</div>
          <h2 className="mt-4 text-3xl sm:text-5xl font-serif tracking-tight text-white">
            Turn your day into a legend
          </h2>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-white/80">
            Pick a prompt or write your own. Then send it to Lia.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Describe your perfect Belize moment…"
              className="h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={() => {
                const message = value.trim();
                if (!message) return;
                window.dispatchEvent(new CustomEvent('lia:open', { detail: { message } }));
              }}
              className="h-12 rounded-2xl bg-amber-500 px-6 text-sm font-semibold text-black transition-colors duration-300 hover:bg-amber-400"
            >
              Ask Lia
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {prompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setValue(p);
                  window.dispatchEvent(new CustomEvent('lia:open', { detail: { message: p } }));
                }}
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition-all duration-300 hover:bg-white/10 hover:border-white/25"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
