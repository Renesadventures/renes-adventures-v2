'use client';

import Link from 'next/link';
import { useMemo } from 'react';
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
  const quickPicks = useMemo<QuickPick[]>(
    () => [
      {
        id: 'deep-sea',
        title: 'Deep Sea Fishing',
        price: 900,
        tagline: 'Big game beyond the reef',
        videoSrc: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/deep-sea-fishing.mp4',
        imageSrc: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-o5hV6mh8JgSKnVgyD8PdcxgUYxUOd8.jpg',
        href: '/tours/deep-sea-fishing',
      },
      {
        id: 'sunset-cruise',
        title: 'Sunset Cruise',
        tagline: 'Golden hour with champagne',
        price: 350,
        videoSrc: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/sunset-cruise.mp4',
        imageSrc: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/sunset-your-perfect-belize-day.jpg',
        href: '/tours/sunset-cruise',
      },
      {
        id: 'blue-hole',
        title: 'Blue Hole',
        price: 900,
        tagline: 'UNESCO diving legend',
        videoSrc: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/blue-hole-two.mp4',
        imageSrc: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
        href: '/tours/blue-hole',
      },
      {
        id: 'secret-beach',
        title: 'Secret Beach',
        price: 600,
        tagline: 'Hidden paradise',
        videoSrc: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/secrete-beach.mp4',
        imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        href: '/tours/secret-beach',
      },
    ],
    []
  );

  return (
    <section id="adventure-grid" className="w-full bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50">
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
                  <div className="relative w-full aspect-video min-h-[400px] md:min-h-[500px] overflow-hidden rounded-2xl shadow-2xl">
                    <video
                      suppressHydrationWarning
                      src="https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/custom-adventure.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none'; }}
                    />
                  </div>
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
              >
                <div className="relative aspect-[4/5]">
                  {/* Static thumbnail — fades out on hover */}
                  <img
                    src={t.imageSrc}
                    alt={t.title}
                    className="absolute inset-0 w-full h-full object-cover 
                               transition-opacity duration-500 group-hover:opacity-0"
                  />

                  {/* Video — fades in on hover */}
                  <video
                    suppressHydrationWarning
                    src={t.videoSrc}
                    autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none'; }}
                  />

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
