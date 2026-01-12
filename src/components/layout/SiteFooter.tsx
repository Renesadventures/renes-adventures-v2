'use client';

import { useState } from 'react';
import { buildWhatsAppTourLink } from '@/lib/utils/whatsapp-link';

export default function SiteFooter() {
  const [year] = useState<number>(() => new Date().getUTCFullYear());
  const whatsapp = buildWhatsAppTourLink({ tourName: 'Custom Adventure' });
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/';

  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-14">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <div className="text-white text-xl font-semibold tracking-tight">Rene&apos;s Adventures</div>
            <div className="mt-3 text-white/70 text-sm leading-relaxed max-w-md">
              Luxury charter experiences in Ambergris Caye—built around conditions, comfort, and unforgettable stories.
            </div>
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-[0.25em] text-[#d4af37]/90">
              Caribbean Gold Standard
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.25em] text-white/60">Social</div>
            <div className="mt-4 space-y-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="block text-white/80 hover:text-[#d4af37] transition"
              >
                WhatsApp Concierge
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="block text-white/80 hover:text-[#d4af37] transition"
              >
                Instagram
              </a>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-[0.25em] text-white/60">Contact</div>
            <div className="mt-4 text-white/70 text-sm leading-relaxed">
              Book fast via WhatsApp. Lia can help you pick the perfect day based on wind and sea state.
            </div>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center w-full rounded-xl bg-[#d4af37] text-slate-950 font-extrabold px-5 py-3 border border-white/10 hover:brightness-110 transition"
            >
              Message René
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/50 text-xs">© {year} Rene&apos;s Adventures</div>
          <div className="text-white/50 text-xs">San Pedro, Ambergris Caye • Belize</div>
        </div>
      </div>
    </footer>
  );
}
