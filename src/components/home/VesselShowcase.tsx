'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Anchor, LifeBuoy, Ruler, ShieldCheck, Users, Volume2 } from 'lucide-react';

export default function VesselShowcase() {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

  const vesselTourVideoSrc = `${base}/luxury/vessel-tour.mp4`;

  const gallery = useMemo(
    () => [
      {
        id: 'exterior',
        label: 'Exterior',
        src: `${base}/images/renes-activities/luxury-vacation-cook-islands-south-pacific-oce-2025-03-18-14-51-35-utc.jpg`,
      },
      {
        id: 'cabin',
        label: 'Cabin',
        src: `${base}/images/renes-activities/exotic-beach-landscape-2024-10-12-01-05-44-utc.jpg`,
      },
      {
        id: 'deck',
        label: 'Deck',
        src: `${base}/images/renes-activities/Deep-sea-fishing.jpeg`,
      },
      {
        id: 'captain',
        label: 'Captain',
        src: `${base}/images/renes-activities/amazing-sunset-on-the-sea-tropical-beach-2025-03-31-18-23-15-utc.jpg`,
      },
      {
        id: 'setup',
        label: 'Fishing Setup',
        src: `${base}/images/renes-activities/Deep-sea-fishing.jpeg`,
      },
      {
        id: 'sunset',
        label: 'Sunset View',
        src:
          'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/images/renes-activities/boat-silhouetted-against-a-beautiful-sunset-in-the-2025-02-11-23-57-55-utc.jpg',
      },
    ],
    [base]
  );

  const [selected, setSelected] = useState<{ type: 'video' | 'image'; src: string }>({
    type: 'video',
    src: vesselTourVideoSrc,
  });

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[60%_40%] lg:items-stretch">
          <div className="rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_20px_70px_rgba(15,23,42,0.10)] overflow-hidden">
            <div className="relative aspect-[16/10] min-h-[360px] bg-slate-100">
              {selected.type === 'video' ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={selected.src} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={selected.src}
                  alt="Rene's vessel"
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10" />

              <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white ring-1 ring-white/15 backdrop-blur">
                <Anchor className="h-4 w-4 text-amber-300" />
                The Vessel
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                  Gallery
                </div>
                <button
                  type="button"
                  onClick={() => setSelected({ type: 'video', src: vesselTourVideoSrc })}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-slate-900"
                >
                  Play Vessel Tour
                </button>
              </div>

              <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(15,23,42,0.35)_rgba(0,0,0,0.06)]">
                {gallery.map((g) => {
                  const active = selected.type === 'image' && selected.src === g.src;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelected({ type: 'image', src: g.src })}
                      className={`group shrink-0 rounded-2xl border bg-white transition-all duration-300 hover:scale-[1.02] ${
                        active ? 'border-amber-500' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      aria-label={`View ${g.label}`}
                    >
                      <div className="relative h-20 w-32 overflow-hidden rounded-2xl">
                        <Image src={g.src} alt="" fill sizes="128px" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute left-2 bottom-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90">
                          {g.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.08)] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-slate-950">
                Built for Belize
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-700">
                Clean comfort. Captain-grade capability. The right size for serious days on the water.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Ruler className="h-5 w-5 text-sky-800" />
                    <div className="text-sm font-semibold">Length</div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">35 ft</div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Users className="h-5 w-5 text-sky-800" />
                    <div className="text-sm font-semibold">Capacity</div>
                  </div>
                  <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">8 guests</div>
                </div>

                <div className="col-span-2 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Volume2 className="h-5 w-5 text-sky-800" />
                    <div className="text-sm font-semibold">Amenities</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    Ice cooler, sound system, shade cover
                  </div>
                </div>

                <div className="col-span-2 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="flex items-center gap-2 text-slate-900">
                    <ShieldCheck className="h-5 w-5 text-sky-800" />
                    <div className="text-sm font-semibold">Safety</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">Life jackets, first aid, radio</div>
                </div>

                <div className="col-span-2 rounded-2xl bg-slate-950 p-4 ring-1 ring-slate-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <LifeBuoy className="h-5 w-5 text-amber-300" />
                      <div className="text-sm font-semibold">Onboard Ready</div>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Included</div>
                  </div>
                  <div className="mt-2 text-sm text-white/75">
                    Comfort + safety are standard—so your day feels effortless.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-100">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-900/70">
                Captain Tip
              </div>
              <div className="mt-2 text-sm text-slate-700">
                The best days are planned around wind and tide. Pick your vibe—we&apos;ll pick the route.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
