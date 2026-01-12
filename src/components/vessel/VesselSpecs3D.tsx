'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import Image from 'next/image';

type HotspotId = 'garmin' | 'refit' | 'trim' | 'layout';

type Hotspot = {
  id: HotspotId;
  label: string;
  title: string;
  body: string;
  xPct: number;
  yPct: number;
};

export default function VesselSpecs3D() {
  const [active, setActive] = useState<HotspotId | null>(null);

  const hotspots = useMemo<Hotspot[]>(
    () => [
      {
        id: 'garmin',
        label: 'Garmin',
        title: 'Garmin Electronics',
        body: 'Fast route decisions, precise navigation, and cleaner offshore runs when conditions change.',
        xPct: 64,
        yPct: 40,
      },
      {
        id: 'refit',
        label: '2025',
        title: '2025 Refit',
        body: 'Dialed-in systems, crisp detailing, and the kind of finish that feels premium the moment you step aboard.',
        xPct: 36,
        yPct: 30,
      },
      {
        id: 'trim',
        label: 'Blue',
        title: 'White + Blue Trim',
        body: 'Signature look—clean, modern, and unmistakably René. Looks elite in photos and in person.',
        xPct: 78,
        yPct: 62,
      },
      {
        id: 'layout',
        label: '25ft',
        title: '25ft Center Console',
        body: 'Stable, versatile, and deep-sea optimized—perfect for fishing missions and luxury day pacing.',
        xPct: 22,
        yPct: 58,
      },
    ],
    []
  );

  const heroVideoSrc = '/videos/hero/renes-custom-adventures.mp4';
  const heroImageSrc = '/images/tours/full-day-ultimate.jpg';

  return (
    <section id="vessel" className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-100">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = 0.6;
          }}
        >
          <source src={heroVideoSrc} type="video/mp4" />
        </video>
      </div>

      <div className="mx-auto w-full max-w-screen-2xl px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">Vessel Deep-Dive</div>
            <h2 className="mt-4 text-4xl md:text-5xl font-light text-white tracking-tight">
              Meet Your Vessel,
              <span className="block font-serif italic text-[#D4AF37]">in 3D Detail</span>
            </h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto font-light">
              Tap a hotspot to explore the details that make a day on René&apos;s boat feel effortless.
            </p>
          </div>

          <div className="relative rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="relative aspect-[16/9]">
              <Image
                src={heroImageSrc}
                alt="25ft Center Console"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 900px, 100vw"
                priority
              />

              {hotspots.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActive((prev) => (prev === h.id ? null : h.id))}
                  className="absolute"
                  style={{ left: `${h.xPct}%`, top: `${h.yPct}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: active === h.id ? 1.08 : 1,
                      boxShadow:
                        active === h.id
                          ? '0 18px 50px rgba(212,175,55,0.35)'
                          : '0 10px 28px rgba(0,0,0,0.35)',
                    }}
                    className="relative"
                  >
                    <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
                    </div>
                    <div className="mt-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-[11px] tracking-[0.25em] uppercase">
                      {h.label}
                    </div>
                  </motion.div>
                </button>
              ))}

              <AnimatePresence>
                {active && (
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-6 bottom-6 right-6 md:left-10 md:bottom-10 md:right-auto md:w-[420px] rounded-2xl bg-white/12 backdrop-blur-xl border border-white/15 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.25em] text-[#d4af37]/90">Hotspot</div>
                        <div className="mt-2 text-xl text-white font-light">
                          {hotspots.find((h) => h.id === active)?.title}
                        </div>
                        <div className="mt-2 text-white/75 text-sm leading-relaxed">
                          {hotspots.find((h) => h.id === active)?.body}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActive(null)}
                        className="shrink-0 w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 transition"
                      >
                        ×
                      </button>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-[11px] uppercase tracking-[0.25em]">
                      25ft Center Console | 2025 Refit | Deep Sea Optimized
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
