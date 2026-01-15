'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export default function BelizeLifestyle() {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

  const cards = useMemo(
    () => [
      {
        id: 'maya',
        title: 'Maya Mysteries Unveiled',
        description:
          "Step into temples where ancient priests once whispered to the gods. Stone pyramids rise from the jungle canopy—Xunantunich, Caracol, Lamanai. The Maya didn't disappear; their descendants still speak the old languages here.",
        href: '/blog?category=maya',
        imageSrc: `${base}/images/renes-activities/adventure-in-the-yucatan-2024-09-13-23-43-13-utc.jpg`,
        videoSrc: `${base}/hero/renes-custom-adventures.mp4`,
      },
      {
        id: 'reef',
        title: 'The Barrier Reef: A Living Masterpiece',
        description:
          "The second-largest barrier reef on Earth thrives just offshore. Swim with nurse sharks in crystal shallows. Dive the Great Blue Hole—a portal to the planet's past. This is Jacques Cousteau's ‘one of the world's greatest natural wonders.’",
        href: '/blog?category=reef',
        imageSrc: `${base}/images/renes-activities/aerial-view-of-barrier-reef-caribbean-sea-2025-04-03-09-24-41-utc.jpg`,
        videoSrc: `${base}/hero/blue-hole.mp4`,
      },
      {
        id: 'garifuna',
        title: 'Garifuna Soul: The Rhythm of Resilience',
        description:
          "Drums echo through coastal villages. The Garifuna people—descendants of African, Caribbean, and indigenous heritage—keep centuries-old traditions alive through dance, music, and cassava bread. Feel the punta rhythm in your bones.",
        href: '/blog?category=garifuna',
        imageSrc: `${base}/images/renes-activities/group-of-young-people-celebrating-with-music-at-th-2025-02-16-03-45-43-utc.jpg`,
        videoSrc: `${base}/hero/sunset-ritual.mp4`,
      },
      {
        id: 'jungle',
        title: 'Jungle Cathedral: Where Nature Rules',
        description:
          'Howler monkeys wake you at dawn. Jaguars prowl the night. Toucans flash neon beaks through emerald canopy. Belize protects more jungle per capita than almost any nation—this is wilderness on its own terms.',
        href: '/blog?category=jungle',
        imageSrc: `${base}/images/renes-activities/nature-2024-12-19-14-44-54-utc.jpg`,
        videoSrc: `${base}/hero/secret-beach.mp4`,
      },
      {
        id: 'caves',
        title: 'Cave of Crystals: The Underworld Awaits',
        description:
          'Float through underground rivers where Mayan priests performed sacred rituals. Stalactites glitter like diamonds. Ancient pottery still rests where it was placed 1,000 years ago. The Actun Tunichil Muknal cave is Indiana Jones made real.',
        href: '/blog?category=caves',
        imageSrc: `${base}/images/renes-activities/silhouette-of-scuba-diver-diving-in-dark-cave-2025-03-09-09-29-23-utc.jpg`,
        videoSrc: `${base}/hero/renes-custom-adventures.mp4`,
      },
      {
        id: 'islands',
        title: 'Island Time, Belizean Style',
        description:
          "No shoes, no shirt, no problem. Caye Caulker's mantra is 'Go Slow.' Hammocks sway over turquoise water. Lobster festivals. Full-moon parties. Rum punch at sunset. This is Caribbean culture—unpretentious, unhurried, unforgettable.",
        href: '/blog?category=islands',
        imageSrc: `${base}/images/renes-activities/caye-caulker-belize-2025-03-27-00-09-41-utc.jpg`,
        videoSrc: `${base}/hero/sunset-ritual.mp4`,
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
        <div className="rounded-3xl bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-6 py-12 sm:px-10 sm:py-14 overflow-hidden ring-1 ring-slate-200 shadow-[0_22px_80px_rgba(15,23,42,0.14)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white ring-1 ring-white/15">
            <Sparkles className="h-4 w-4 text-amber-300" />
            Belize Lifestyle
          </div>

          <h2 className="mt-5 text-3xl sm:text-5xl font-serif tracking-tight text-white">
            Belize: Where Legends Come Alive
          </h2>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-white/80">
            Ancient civilizations. Living coral kingdoms. Jungle mysteries. This is more than a destination—it&apos;s a living story.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                <BookOpen className="h-4 w-4 text-amber-300" />
                Britannica Highlights
              </div>
              <div className="mt-3 text-sm leading-relaxed text-white/80">
                Belize is often thought of as a Caribbean country in Central America because it has a history similar to that of English-speaking Caribbean nations—its institutions and <span className="font-semibold text-amber-300">official language reflect its history as a British colony</span>.
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Natural Wonder</div>
              <div className="mt-3 text-sm leading-relaxed text-white/80">
                Along the coast is the <span className="font-semibold text-amber-300">Belize Barrier Reef</span>, the <span className="font-semibold text-amber-300">second largest barrier reef in the world</span>, fringed by dozens of small islands called cays.
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Coastline & Heritage</div>
              <div className="mt-3 text-sm leading-relaxed text-white/80">
                A <span className="font-semibold text-amber-300">174-mile (280-km) coastline</span> meets mangroves, reef cuts, and jungle—while Belize’s reef reserve system was designated a <span className="font-semibold text-amber-300">UNESCO World Heritage site (1996)</span>.
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {cards.map((c) => (
              <article
                key={c.id}
                className="group overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/15 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:shadow-[0_22px_70px_rgba(245,158,11,0.20)]"
                onMouseEnter={() => playPreview(c.id)}
                onMouseLeave={() => stopPreview(c.id)}
              >
                <div className="relative min-h-[360px]">
                  <div className="absolute inset-0">
                    <Image
                      src={c.imageSrc}
                      alt=""
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  {c.videoSrc ? (
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
                  ) : null}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

                  <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                    <div className="text-white">
                      <div className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/90">
                        Documentary Feature
                      </div>
                      <div className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">{c.title}</div>
                      <div className="mt-3 text-sm sm:text-base leading-relaxed text-white/85">{c.description}</div>
                    </div>

                    <div className="mt-6">
                      <Link
                        href={c.href}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 transition-colors duration-300 hover:bg-amber-400"
                      >
                        Experience This
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <div className="mt-4 text-[11px] font-semibold text-white/70">
                      Source:{' '}
                      <a
                        href="https://www.britannica.com/place/Belize"
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-white/40 underline-offset-4 hover:decoration-white/80"
                      >
                        Encyclopedia Britannica
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
