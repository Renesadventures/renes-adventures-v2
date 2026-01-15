'use client';

import Link from 'next/link';
import { Phone, MessageCircle } from 'lucide-react';

export default function SunsetRitualCTA() {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-[520px]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={`${base}/hero/sunset-ritual.mp4`} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              Sunset Ritual
            </div>
            <h2 className="mt-4 text-4xl sm:text-5xl font-serif tracking-tight text-white">
              End Every Day Like This
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/75">
              Minimal plans. Maximum feeling. Champagne, calm water, and the kind of light you remember.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tours/custom-charter"
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-black shadow-lg shadow-amber-500/20 transition-colors duration-300 hover:bg-amber-400"
              >
                Book Your Belize Adventure
              </Link>

              <a
                href="tel:+5016707760"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/10 hover:border-white/35"
              >
                <Phone className="h-5 w-5 text-amber-300" />
                +501 670 7760
              </a>

              <a
                href="https://wa.me/5016707760"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-emerald-500/15 px-6 py-3 text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-emerald-500/25 hover:border-emerald-200/40"
              >
                <MessageCircle className="h-5 w-5 text-emerald-300" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
