'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AMBERGRIS_CAYE_FISHING_CALENDAR } from '@/lib/lia-knowledge/fishing-calendar';

export default function LiaSuggestion({ primarySpecies }: { primarySpecies: string }) {
  const renesQuote = useMemo(() => {
    const jan = AMBERGRIS_CAYE_FISHING_CALENDAR.months.find((m) => m.month === 'January');
    void jan;
    void primarySpecies;
    return '“The Northers are moving in... the West-side is glass.” — Captain René';
  }, [primarySpecies]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-6 right-6 z-20 w-[min(520px,calc(100%-2rem))]"
    >
      <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl px-6 py-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="text-white/90">
            <div className="text-xs uppercase tracking-[0.25em] text-white/60">René’s Advice</div>
            <div className="mt-2 text-base leading-relaxed font-light">
              <span className="font-['cursive'] text-white/95">{renesQuote}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('lia:open'))}
            className="shrink-0 rounded-2xl bg-gradient-to-r from-tropical-coral to-tropical-pink px-5 py-3 text-white font-extrabold border border-white/20 hover:shadow-lg transition"
          >
            Ask Lia
          </button>
        </div>
      </div>
    </motion.div>
  );
}
