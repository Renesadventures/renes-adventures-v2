'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Compass } from 'lucide-react';

type LifestyleCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  videoSrc: string;
  sourceName: string;
  sourceHref: string;
};

export default function BelizeLifestyle() {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

  const cards = useMemo<LifestyleCard[]>(
    () => [
      {
        id: 'maya',
        title: 'Ancient Maya Civilization',
        description: 'Stone cities, ritual temples, and stories written in the jungle canopy.',
        href: '/blog?category=maya',
        imageSrc: `${base}/images/renes-activities/exotic-beach-landscape-2024-10-12-01-05-44-utc.jpg`,
        videoSrc: `${base}/hero/renes-custom-adventures.mp4`,
        sourceName: 'BBC Earth',
        sourceHref: 'https://www.bbcearth.com/',
      },
      {
        id: 'reef',
        title: 'Barrier Reef Ecosystem',
        description: 'UNESCO-scale color: coral gardens, rays, sharks, and reef life in 4K.',
        href: '/blog?category=reef',
        imageSrc: `${base}/images/renes-activities/Blue-Hole-Iconic.jpeg`,
        videoSrc: `${base}/hero/blue-hole.mp4`,
        sourceName: 'UNESCO',
        sourceHref: 'https://whc.unesco.org/',
      },
      {
        id: 'garifuna',
        title: 'Garifuna Culture',
        description: 'Drum, dance, and living heritage—Belize’s soul in rhythm.',
        href: '/blog?category=garifuna',
        imageSrc:
          'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/images/renes-activities/boat-silhouetted-against-a-beautiful-sunset-in-the-2025-02-11-23-57-55-utc.jpg',
        videoSrc: `${base}/hero/sunset-ritual.mp4`,
        sourceName: 'National Geographic',
        sourceHref: 'https://www.nationalgeographic.com/',
      },
      {
        id: 'wildlife',
        title: 'Jungle Wildlife',
        description: 'Jaguars, toucans, howler monkeys—raw jungle energy just inland.',
        href: '/blog?category=wildlife',
        imageSrc: `${base}/images/renes-activities/Deep-sea-fishing.jpeg`,
        videoSrc: `${base}/hero/secret-beach.mp4`,
        sourceName: 'Nat Geo Wild',
        sourceHref: 'https://www.nationalgeographic.com/tv/',
      },
      {
        id: 'caves',
        title: 'Cave Tubing Adventure',
        description: 'Action footage through limestone caverns—an only-in-Belize classic.',
        href: '/blog?category=cave-tubing',
        imageSrc: `${base}/images/renes-activities/exotic-beach-landscape-2024-10-12-01-05-44-utc.jpg`,
        videoSrc: `${base}/hero/renes-custom-adventures.mp4`,
        sourceName: 'Discovery',
        sourceHref: 'https://www.discovery.com/',
      },
      {
        id: 'festivals',
        title: 'Local Festivals',
        description: 'September celebrations, Lobster Fest, and community nights that feel like family.',
        href: '/blog?category=festivals',
        imageSrc:
          'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/images/renes-activities/boat-silhouetted-against-a-beautiful-sunset-in-the-2025-02-11-23-57-55-utc.jpg',
        videoSrc: `${base}/hero/sunset-ritual.mp4`,
        sourceName: 'Belize Tourism',
        sourceHref: 'https://www.travelbelize.org/',
      },
    ],
    [base]
  );

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const stopTimeouts = useRef<Record<string, number | null>>({});
  const [failedPreviewIds, setFailedPreviewIds] = useState<Record<string, true>>({});
  const [readyPreviewIds, setReadyPreviewIds] = useState<Record<string, true>>({});

  useEffect(() => {
    const timeouts = stopTimeouts.current;
    return () => {
      Object.values(timeouts).forEach((t) => {
        if (t) window.clearTimeout(t);
      });
    };
  }, []);

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
    }, 3500);
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
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">
              <Compass className="h-4 w-4 text-amber-300" />
              Belize Lifestyle
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-serif tracking-tight text-slate-950">
              Beyond the Boat
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-700">
              Discovery-channel vibes: what to do, see, and feel once you step off the dock.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.id}
              className="group overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.10)] transition-all duration-300 hover:shadow-[0_22px_70px_rgba(245,158,11,0.18)]"
              onMouseEnter={() => playPreview(c.id)}
              onMouseLeave={() => stopPreview(c.id)}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={c.imageSrc}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />

                <video
                  ref={(el) => {
                    videoRefs.current[c.id] = el;
                  }}
                  muted
                  playsInline
                  preload="metadata"
                  poster={c.imageSrc}
                  onCanPlay={() => markPreviewReady(c.id)}
                  onError={() => markPreviewFailed(c.id)}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    failedPreviewIds[c.id] || !readyPreviewIds[c.id]
                      ? 'opacity-0'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <source src={c.videoSrc} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                <div className="absolute left-6 right-6 bottom-6">
                  <div className="text-white">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/90">
                      Documentary Cut
                    </div>
                    <div className="mt-2 text-xl font-extrabold tracking-tight">{c.title}</div>
                    <div className="mt-2 text-sm text-white/85">{c.description}</div>
                  </div>

                  <div className="mt-5">
                    <Link
                      href={c.href}
                      className="inline-flex w-full items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur transition-all duration-300 hover:bg-amber-500 hover:text-black hover:ring-amber-500"
                    >
                      Learn More
                    </Link>
                  </div>

                  <div className="mt-3 text-[11px] font-semibold text-white/70">
                    Source:{' '}
                    <a
                      href={c.sourceHref}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-white/40 underline-offset-4 hover:decoration-white/80"
                    >
                      {c.sourceName}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
