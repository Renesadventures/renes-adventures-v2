'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ShieldCheck, Star } from 'lucide-react';

type QuickPick = {
  id: string;
  title: string;
  tagline: string;
  price: number;
  videoSrc: string;
  imageSrc: string;
  href: string;
};

export default function AdventureGrid() {
  const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

  const quickPicks = useMemo<QuickPick[]>(
    () => [
      {
        id: 'deep-sea',
        title: 'Deep Sea Fishing',
        price: 900,
        tagline: 'Big game beyond the reef',
        videoSrc: `${base}/hero/deep-sea-fIshing.mp4`,
        imageSrc: `${base}/images/renes-activities/Deep-sea-fishing.jpeg`,
        href: '/tours/deep-sea-fishing',
      },
      {
        id: 'sunset-ritual',
        title: 'Sunset Ritual',
        tagline: 'Golden hour with champagne',
        price: 350,
        videoSrc: `${base}/hero/sunset-ritual.mp4`,
        imageSrc:
          'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/images/renes-activities/boat-silhouetted-against-a-beautiful-sunset-in-the-2025-02-11-23-57-55-utc.jpg',
        href: '/tours/sunset-cruise',
      },
      {
        id: 'blue-hole',
        title: 'Blue Hole Adventure',
        price: 900,
        tagline: 'UNESCO diving legend',
        videoSrc: `${base}/hero/blue-hole.mp4`,
        imageSrc: `${base}/images/renes-activities/Blue-Hole-Iconic.jpeg`,
        href: '/tours/blue-hole',
      },
      {
        id: 'secret-beach',
        title: 'Secret Beach Escape',
        price: 600,
        tagline: 'Hidden paradise',
        videoSrc: `${base}/hero/secret-beach.mp4`,
        imageSrc: `${base}/images/renes-activities/exotic-beach-landscape-2024-10-12-01-05-44-utc.jpg`,
        href: '/tours/secret-beach',
      },
    ],
    [base]
  );

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const stopTimeouts = useRef<Record<string, number | null>>({});
  const [failedPreviewIds, setFailedPreviewIds] = useState<Record<string, true>>({});
  const [readyPreviewIds, setReadyPreviewIds] = useState<Record<string, true>>({});

  const markPreviewFailed = (id: string) => {
    setFailedPreviewIds((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: true };
    });
  };

  const markPreviewReady = (id: string) => {
    setReadyPreviewIds((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: true };
    });
  };

  useEffect(() => {
    const timeouts = stopTimeouts.current;
    return () => {
      Object.values(timeouts).forEach((t) => {
        if (t) window.clearTimeout(t);
      });
    };
  }, []);

  const playPreview = (id: string) => {
    const el = videoRefs.current[id];
    if (!el) return;

    try {
      el.currentTime = 0;
      el.muted = true;
      const p = el.play();
      if (p && typeof (p as Promise<void>).catch === 'function') {
        (p as Promise<void>).catch(() => {
          // suppress autoplay errors
        });
      }
    } catch {
      // suppress
    }

    if (stopTimeouts.current[id]) window.clearTimeout(stopTimeouts.current[id] as number);
    stopTimeouts.current[id] = window.setTimeout(() => {
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        // suppress
      }
    }, 3000);
  };

  const stopPreview = (id: string) => {
    const el = videoRefs.current[id];
    if (!el) return;

    if (stopTimeouts.current[id]) window.clearTimeout(stopTimeouts.current[id] as number);
    stopTimeouts.current[id] = null;

    try {
      el.pause();
      el.currentTime = 0;
    } catch {
      // suppress
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-slate-950">
            Your Perfect Belize Day
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-700">
            One boat. Eight hours. Endless possibilities.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl">
          <div className="rounded-3xl bg-white/70 ring-1 ring-black/5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-stretch lg:min-h-[500px]">
              <div className="relative w-full lg:w-[60%] flex-shrink-0">
                <div className="relative aspect-video min-h-[400px] md:min-h-[500px] overflow-hidden rounded-2xl shadow-2xl">
                  {/* Background image (always visible) */}
                  <Image
                    src={`${base}/images/renes-activities/luxury-vacation-cook-islands-south-pacific-oce-2025-03-18-14-51-35-utc.jpg`}
                    alt="Full Day Custom Adventure"
                    fill
                    priority
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />

                  {/* Video overlay (plays on load) */}
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 z-10 h-full w-full object-cover"
                  >
                    <source src={`${base}/hero/renes-custom-adventures.mp4`} type="video/mp4" />
                  </video>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                </div>
              </div>

              <div className="w-full lg:w-[40%] p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div>
                  <div className="inline-flex items-center rounded-full bg-amber-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black">
                    Most Popular
                  </div>

                  <div className="mt-4">
                    <div className="text-2xl sm:text-3xl font-serif tracking-tight text-slate-950">
                      Full Day Custom Adventure
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-700">
                      with Beach BBQ
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                    Reef fishing. Spearfishing. Hol Chan sharks. Caye Caulker tarpon. Lobster diving.
                    Beach BBQ. Your call, your pace.
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-4xl font-extrabold tracking-tight text-slate-950">$675</div>
                      <div className="mt-1 text-sm text-slate-700">
                        Up to 8 guests | 8 hours | Fully customizable
                      </div>
                    </div>

                    <div className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-sm font-semibold text-slate-800 ring-1 ring-black/5">
                      <Star className="h-4 w-4 text-amber-500" />
                      4.9 (127)
                    </div>
                  </div>
                </div>

                <div>
                  <Link
                    href="/tours/custom-charter"
                    className="inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-lg font-semibold text-black shadow-lg shadow-amber-500/20 transition-colors duration-300 hover:bg-amber-400"
                  >
                    Discover Your Perfect Day
                  </Link>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-800 ring-1 ring-black/5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    100% Flexible - Plan on the Water
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif tracking-tight text-slate-950">
                Quick Picks
              </h3>
              <p className="mt-1 text-sm text-slate-700">
                Specialty tours for specific experiences.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickPicks.map((t) => (
              <div
                key={t.id}
                className="group rounded-3xl overflow-hidden border border-black/5 bg-white/70 ring-1 ring-black/5 shadow-[0_18px_60px_rgba(15,23,42,0.10)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_22px_70px_rgba(245,158,11,0.18)]"
                onMouseEnter={() => playPreview(t.id)}
                onMouseLeave={() => stopPreview(t.id)}
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={t.imageSrc}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />

                  <video
                    ref={(el) => {
                      videoRefs.current[t.id] = el;
                    }}
                    muted
                    playsInline
                    preload="metadata"
                    poster={t.imageSrc}
                    onCanPlay={() => markPreviewReady(t.id)}
                    onError={() => markPreviewFailed(t.id)}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                      failedPreviewIds[t.id] || !readyPreviewIds[t.id]
                        ? 'opacity-0'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <source src={t.videoSrc} type="video/mp4" />
                  </video>

                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  <div className="absolute left-4 right-4 bottom-4">
                    <div className="text-white">
                      <div className="text-lg font-semibold leading-tight truncate">
                        {t.title}
                      </div>
                      <div className="mt-1 text-xs text-white/80">{t.tagline}</div>
                      <div className="mt-3 text-2xl font-extrabold tracking-tight">${t.price}</div>
                    </div>

                    <div className="mt-4">
                      <Link
                        href={t.href}
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/35 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-black"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
