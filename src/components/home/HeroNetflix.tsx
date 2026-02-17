'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type Channel = {
  id: string;
  label: string;
  src: string;
  href: string;
  tagline: string;
  ctaLabel: string;
};

export default function HeroNetflix() {
  const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

  const channels = useMemo<Channel[]>(
    () => [
      {
        id: 'custom',
        label: 'Custom Charter',
        src: `${base}/hero/renes-custom-adventures.mp4`,
        href: '/tours/custom-charter',
        tagline: 'Your day. Your boat. Your adventure.',
        ctaLabel: 'Explore This Tour',
      },
      {
        id: 'deep-sea',
        label: 'Deep Sea',
        src: `${base}/hero/deep-sea-fIshing.mp4`,
        href: '/tours/deep-sea-fishing',
        tagline: 'Big game beyond the reef.',
        ctaLabel: 'Explore This Tour',
      },
      {
        id: 'beach-bbq',
        label: 'Beach BBQ',
        src: `${base}/hero/beach-bbq.mp4`,
        href: '/tours/custom-charter',
        tagline: 'Fresh catch. White sand. Rum punch.',
        ctaLabel: 'Part of Custom Adventure →',
      },
      {
        id: 'sunset',
        label: 'Sunset',
        src: `${base}/hero/sunset-ritual.mp4`,
        href: '/tours/sunset-cruise',
        tagline: 'Golden hour with champagne.',
        ctaLabel: 'Explore This Tour',
      },
      {
        id: 'blue-hole',
        label: 'Blue Hole',
        src: `${base}/hero/blue-hole.mp4`,
        href: '/tours/blue-hole',
        tagline: 'UNESCO diving legend.',
        ctaLabel: 'Explore This Tour',
      },
      {
        id: 'reef',
        label: 'Reef',
        src: `${base}/hero/Reef Fishing.mp4`,
        href: '/tours/custom-charter',
        tagline: 'Snappers. Groupers. Fast action.',
        ctaLabel: 'Part of Custom Adventure →',
      },
      {
        id: 'secret-beach',
        label: 'Secret Beach',
        src: `${base}/hero/secret-beach.mp4`,
        href: '/tours/secret-beach',
        tagline: 'Hidden. Pristine. Yours.',
        ctaLabel: 'Explore This Tour',
      },
    ],
    [base]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFaded, setIsFaded] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const active = channels[activeIndex];
  const activeSrc = active?.src;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    try {
      el.playbackRate = 0.5;
      const p = el.play();
      if (p && typeof (p as Promise<void>).catch === 'function') {
        (p as Promise<void>).catch(() => {
          // suppress autoplay errors
        });
      }
    } catch {
      // suppress
    }
  }, [activeSrc]);

  useEffect(() => {
    if (pendingIndex === null) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex(pendingIndex);
      setPendingIndex(null);
      setIsFaded(false);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [pendingIndex]);

  const handlePick = (idx: number) => {
    if (idx === activeIndex) return;
    setPendingIndex(idx);
    setIsFaded(true);
  };

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden">
      <div className="absolute inset-0">
        <video
          key={activeSrc}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{ filter: 'brightness(0.9)' }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            isFaded ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {activeSrc && <source src={activeSrc} type="video/mp4" />}
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 h-full w-full flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-3xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.65)]">
              Rene&apos;s Adventures
            </h1>
            <p className="mt-3 text-base sm:text-lg text-sky-200/90 tracking-wide">
              Belize Custom Charter Co.
            </p>

            {/* Dynamic tagline + CTA based on active channel */}
            <p className="mt-4 text-sm sm:text-base text-white/80 italic transition-opacity duration-300">
              {active?.tagline}
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <Link
                href={active?.href || '/tours/custom-charter'}
                className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm sm:text-base font-semibold text-black shadow-lg shadow-amber-500/20 transition-colors duration-300 hover:bg-amber-400"
              >
                {active?.ctaLabel || 'Explore This Tour'}
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full px-4 pb-6">
          <div className="mx-auto w-full max-w-6xl">
            <div className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.35em] text-white/65">Channels</div>
                <div className="text-xs text-white/60">Tap to switch</div>
              </div>

              <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(245,158,11,0.7)_rgba(255,255,255,0.10)]">
                {channels.map((c, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handlePick(idx)}
                      className="group shrink-0 flex flex-col items-center gap-2"
                      aria-label={`Switch to ${c.label}`}
                    >
                      <div
                        className={`relative w-36 sm:w-40 md:w-44 aspect-video rounded-lg overflow-hidden border transition-all duration-300 group-hover:scale-[1.03] ${
                          isActive ? 'border-amber-500' : 'border-white/30'
                        }`}
                      >
                        <video
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onLoadedMetadata={(e) => {
                            e.currentTarget.playbackRate = 0.5;
                          }}
                          className="absolute inset-0 h-full w-full object-cover opacity-85 group-hover:opacity-100 group-hover:brightness-110 transition-all duration-300"
                        >
                          <source src={c.src} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      </div>

                      <span
                        className={`text-xs uppercase tracking-wide transition-colors duration-300 ${
                          isActive ? 'text-amber-500' : 'text-white/70'
                        }`}
                      >
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
