'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CloudSun,
  Image as ImageIcon,
  Mic,
  Play,
  Waves,
  Wind,
} from 'lucide-react';

type WindDir = 'N' | 'NE' | 'ENE' | 'E' | 'ESE' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

type ForecastDay = {
  id: string;
  day: string;
  icon: 'partly' | 'sun' | 'windy';
  highF: number;
  windMph: number;
  windDir: WindDir;
  wavesFt: string;
};

type CaptainsPick = {
  id: 'north-reef-snorkel' | 'blue-hole' | 'deep-sea' | 'south-reef-bbq';
  headline: string;
  recommendation: string;
  reasoning: string;
  bookingHref: string;
  defaultMediaId: string;
};

type GalleryItem = {
  id: string;
  type: 'video' | 'image';
  src: string;
  label: string;
};

function pickByConditions(args: {
  windMph: number;
  windDir: WindDir;
  waveMaxFt: number;
}): CaptainsPick {
  if (args.windDir === 'ENE' && args.windMph >= 10 && args.windMph <= 15 && args.waveMaxFt < 3) {
    return {
      id: 'north-reef-snorkel',
      headline: "CAPTAIN'S CHOICE TODAY",
      recommendation: 'North Reef is Glass - Perfect for Snorkeling',
      reasoning: `Winds from the ${args.windDir} at ${args.windMph} mph with ${args.waveMaxFt} ft seas keep the north side protected and clear.`,
      bookingHref: '/tours/custom-charter?activity=snorkeling',
      defaultMediaId: 'vid-reef-fishing-6',
    };
  }

  if (args.windMph < 5) {
    return {
      id: 'blue-hole',
      headline: "CAPTAIN'S CHOICE TODAY",
      recommendation: 'Blue Hole Visibility Pristine',
      reasoning: `Dead-calm winds (${args.windMph} mph) and gentle seas make the run comfortable and the water bright.`,
      bookingHref: '/tours/custom-charter?activity=blue-hole',
      defaultMediaId: 'img-blue-hole-iconic',
    };
  }

  if (args.windMph > 15 || args.waveMaxFt >= 3) {
    return {
      id: 'deep-sea',
      headline: "CAPTAIN'S CHOICE TODAY",
      recommendation: 'Deep Sea Fishing Thrives in Choppy Water',
      reasoning: `With winds over 15 mph and a little texture on the water, pelagics stay active and the bite can turn on fast.`,
      bookingHref: '/tours/custom-charter?activity=deep-sea',
      defaultMediaId: 'vid-deep-sea-5',
    };
  }

  return {
    id: 'south-reef-bbq',
    headline: "CAPTAIN'S CHOICE TODAY",
    recommendation: 'South Reef + Beach BBQ Protected Today',
    reasoning: `We tuck into the lee side where reef structure breaks the swell—easy snorkeling, relaxed cruising, and a perfect beach finish.`,
    bookingHref: '/tours/custom-charter?activity=beach-bbq',
    defaultMediaId: 'vid-secret-beach-5',
  };
}

function ForecastIcon({ kind }: { kind: ForecastDay['icon'] }) {
  if (kind === 'sun') return <CloudSun className="h-5 w-5 text-amber-500" />;
  if (kind === 'windy') return <Wind className="h-5 w-5 text-sky-600" />;
  return <CloudSun className="h-5 w-5 text-slate-700" />;
}

export default function ConditionsWidget() {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

  const forecast: ForecastDay[] = [
    { id: 'mon', day: 'Mon', icon: 'partly', highF: 82, windMph: 12, windDir: 'ENE', wavesFt: '2–3 ft' },
    { id: 'tue', day: 'Tue', icon: 'sun', highF: 83, windMph: 11, windDir: 'ENE', wavesFt: '2 ft' },
    { id: 'wed', day: 'Wed', icon: 'windy', highF: 81, windMph: 17, windDir: 'E', wavesFt: '3–4 ft' },
    { id: 'thu', day: 'Thu', icon: 'partly', highF: 82, windMph: 8, windDir: 'E', wavesFt: '2 ft' },
    { id: 'fri', day: 'Fri', icon: 'sun', highF: 84, windMph: 4, windDir: 'NE', wavesFt: '1–2 ft' },
  ];

  const todays = {
    windMph: 12,
    windDir: 'ENE' as const,
    waveMaxFt: 2.5,
  };

  const pick = pickByConditions(todays);

  const gallery = useMemo<GalleryItem[]>(
    () => [
      {
        id: 'vid-secret-beach-5',
        type: 'video',
        src: `${base}/luxury/Secrete%20Beach%205.mp4`,
        label: 'Secret Beach',
      },
      {
        id: 'vid-reef-fishing-xxx',
        type: 'video',
        src: `${base}/luxury/reef-fishing%20xxx.mp4`,
        label: 'Reef Fishing',
      },
      {
        id: 'vid-lobster-1',
        type: 'video',
        src: `${base}/luxury/Lobster%20FIshing%201.mp4`,
        label: 'Lobster',
      },
      {
        id: 'vid-deep-sea-5',
        type: 'video',
        src: `${base}/luxury/Deep%20Sea%20Fishing%205.mp4`,
        label: 'Deep Sea',
      },
      {
        id: 'img-nature',
        type: 'image',
        src: `${base}/images/renes-activities/exotic-beach-landscape-2024-10-12-01-05-44-utc.jpg`,
        label: 'Snorkel',
      },
      {
        id: 'img-colorful-sea-life',
        type: 'image',
        src: `${base}/images/renes-activities/Blue-Hole-Iconic.jpeg`,
        label: 'Sea Life',
      },
      {
        id: 'img-exotic-beach',
        type: 'image',
        src: `${base}/images/renes-activities/exotic-beach-landscape-2024-10-12-01-05-44-utc.jpg`,
        label: 'Beach',
      },
      {
        id: 'img-blue-hole-iconic',
        type: 'image',
        src: `${base}/images/renes-activities/Blue-Hole-Iconic.jpeg`,
        label: 'Blue Hole',
      },
    ],
    [base]
  );

  const initialSelectedId = useMemo(() => {
    const preferred = gallery.find((g) => g.id === pick.defaultMediaId);
    return preferred?.id || gallery[0]?.id || '';
  }, [gallery, pick.defaultMediaId]);

  const [selectedId, setSelectedId] = useState<string>(initialSelectedId);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isFaded, setIsFaded] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [liaMessage, setLiaMessage] = useState<string | null>(null);
  const [failedMediaIds, setFailedMediaIds] = useState<Record<string, true>>({});
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);

  const selected = useMemo(() => {
    return gallery.find((g) => g.id === selectedId) || gallery[0];
  }, [gallery, selectedId]);

  useEffect(() => {
    setSelectedId(initialSelectedId);
  }, [initialSelectedId]);

  useEffect(() => {
    if (pendingId === null) return;
    const t = window.setTimeout(() => {
      setSelectedId(pendingId);
      setPendingId(null);
      setIsFaded(false);
    }, 250);
    return () => window.clearTimeout(t);
  }, [pendingId]);

  useEffect(() => {
    setIsMediaLoaded(false);
  }, [selectedId]);

  useEffect(() => {
    const el = mainVideoRef.current;
    if (!el) return;

    try {
      const p = el.play();
      if (p && typeof (p as Promise<void>).catch === 'function') {
        (p as Promise<void>).catch(() => {
          // suppress autoplay errors
        });
      }
    } catch {
      // suppress
    }
  }, [selectedId, selected?.type]);

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setPendingId(id);
    setIsFaded(true);
  };

  const markFailed = (id: string) => {
    setFailedMediaIds((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: true };
    });
  };

  return (
    <section className="w-full bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          <aside className="lg:col-span-4">
            <div className="h-full min-h-[600px] rounded-3xl bg-gradient-to-br from-white/85 via-white/75 to-amber-50/70 shadow-[0_18px_50px_rgba(15,23,42,0.14)] ring-1 ring-black/5 flex flex-col">
              <div className="px-6 pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                    5-Day Forecast
                  </div>
                  <div className="text-xs text-slate-600">Ambergris Caye</div>
                </div>
              </div>

              <div className="mt-5 flex-1 pb-6">
                <div className="flex gap-3 overflow-x-auto px-6 pb-2 lg:block lg:h-full lg:max-h-[520px] lg:overflow-y-auto lg:overflow-x-hidden [scrollbar-width:thin] [scrollbar-color:rgba(245,158,11,0.65)_rgba(0,0,0,0.06)]">
                  {forecast.map((d) => (
                    <div
                      key={d.id}
                      className="shrink-0 w-56 lg:w-auto rounded-2xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 px-4 py-4 lg:mb-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                            {d.day}
                          </div>
                          <div className="mt-1 text-lg font-semibold text-slate-900">
                            {d.highF}°F
                          </div>
                        </div>

                        <div className="rounded-xl bg-gradient-to-br from-amber-500/15 via-sky-500/10 to-emerald-500/15 p-2 ring-1 ring-black/5">
                          <ForecastIcon kind={d.icon} />
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-700">
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-sky-700" />
                          <span className="font-semibold">{d.windMph} mph</span>
                          <span className="text-slate-500">{d.windDir}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <Waves className="h-4 w-4 text-emerald-700" />
                          <span className="font-semibold">{d.wavesFt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="h-full min-h-[600px] rounded-3xl bg-gradient-to-br from-slate-950 via-slate-950/95 to-slate-900 text-white shadow-[0_18px_60px_rgba(2,6,23,0.55)] ring-1 ring-white/10 overflow-hidden flex flex-col">
              <div className="px-6 pt-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.4em] text-white/60">
                      {pick.headline}
                    </div>
                    <div className="mt-2 text-2xl sm:text-3xl font-serif tracking-tight text-white">
                      {pick.recommendation}
                    </div>
                    <div className="mt-2 text-sm text-white/70">{pick.reasoning}</div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/10">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    Live
                  </div>
                </div>

                <div className="mt-5 h-1 w-28 rounded-full bg-amber-500" />
              </div>

              <div className="mt-6 px-6">
                <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                  <div className="relative aspect-video w-full max-h-[500px]">
                    <div
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        isFaded ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      {selected && failedMediaIds[selected.id] ? (
                        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-slate-900/80 via-slate-950/70 to-black/80">
                          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10">
                            <span className="h-2 w-2 rounded-full bg-red-400" />
                            Media failed to load
                          </div>
                        </div>
                      ) : selected?.type === 'video' ? (
                        <video
                          key={selected.src}
                          ref={mainVideoRef}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onCanPlay={() => setIsMediaLoaded(true)}
                          onError={() => {
                            if (selected) markFailed(selected.id);
                          }}
                          className="absolute inset-0 h-full w-full object-cover"
                        >
                          <source src={selected.src} type="video/mp4" />
                        </video>
                      ) : (
                        <Image
                          key={selected?.src}
                          src={selected?.src || ''}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 66vw, 100vw"
                          onLoadingComplete={() => setIsMediaLoaded(true)}
                          onError={() => {
                            if (selected) markFailed(selected.id);
                          }}
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                    </div>

                    <div
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        isMediaLoaded ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-950/70 to-black/80" />
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                          Loading media
                        </div>
                      </div>
                    </div>

                    <div className="absolute left-4 bottom-4 right-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                        {selected?.type === 'video' ? (
                          <Play className="h-4 w-4 text-amber-400" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-sky-300" />
                        )}
                        {selected?.label || 'Captain media'}
                      </div>

                      <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                        <Waves className="h-4 w-4 text-emerald-300" />
                        Calm-water picks
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-[0.35em] text-white/60">Gallery</div>
                    <div className="text-xs text-white/50">Tap to preview</div>
                  </div>

                  <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(245,158,11,0.7)_rgba(255,255,255,0.10)]">
                    {gallery.map((item) => {
                      const active = item.id === selectedId;
                      const failed = !!failedMediaIds[item.id];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item.id)}
                          className={`group shrink-0 rounded-xl border bg-white/5 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_14px_50px_rgba(245,158,11,0.18)] ${
                            active ? 'border-amber-500' : 'border-white/15 hover:border-white/30'
                          }`}
                          aria-label={`Preview ${item.label}`}
                        >
                          <div className="relative h-20 w-32 overflow-hidden rounded-xl">
                            {failed ? (
                              <div className="absolute inset-0 grid place-items-center bg-white/5">
                                <div className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white ring-1 ring-white/10">
                                  <span className="h-2 w-2 rounded-full bg-red-400" />
                                  Unavailable
                                </div>
                              </div>
                            ) : item.type === 'video' ? (
                              <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                onLoadedMetadata={(e) => {
                                  e.currentTarget.playbackRate = 0.5;
                                }}
                                onError={() => markFailed(item.id)}
                                className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:brightness-110 transition-all duration-300"
                              >
                                <source src={item.src} type="video/mp4" />
                              </video>
                            ) : (
                              <Image
                                src={item.src}
                                alt=""
                                fill
                                sizes="128px"
                                onError={() => markFailed(item.id)}
                                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.06] transition-all duration-300"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                            {item.type === 'video' ? (
                              <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white ring-1 ring-white/10">
                                <Play className="h-3.5 w-3.5 text-amber-400" />
                                Video
                              </div>
                            ) : (
                              <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white ring-1 ring-white/10">
                                <ImageIcon className="h-3.5 w-3.5 text-sky-300" />
                                Photo
                              </div>
                            )}
                          </div>

                          <div className="px-2 pb-2 pt-2 text-left">
                            <div
                              className={`text-[10px] uppercase tracking-[0.22em] font-semibold transition-colors duration-300 ${
                                active ? 'text-amber-400' : 'text-white/70'
                              }`}
                            >
                              {item.label}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 px-6 pb-6">
                <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <div className="text-sm leading-relaxed text-white/80">
                    With winds from the east at 12 mph and crystal visibility, the north side of our
                    barrier reef offers protection and pristine conditions. Only a Belizean captain
                    knows these patterns—we&apos;ve navigated these waters for generations.
                  </div>

                  <div className="mt-5 rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-amber-500/25 blur-md motion-safe:animate-pulse" />
                          <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                            <Mic className="h-5 w-5 text-amber-400" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Hi, I&apos;m Lia.</div>
                          <div className="text-xs text-white/70">
                            Want to hear why this is perfect for today?
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setLiaMessage('Voice interaction coming soon!')}
                        className="group relative inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:bg-amber-400"
                      >
                        <span className="absolute -inset-1 rounded-full bg-amber-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center gap-2">
                          Talk to Lia
                          <span className="flex items-end gap-0.5">
                            <span className="h-2 w-0.5 rounded-full bg-black/70 motion-safe:animate-pulse" />
                            <span className="h-3 w-0.5 rounded-full bg-black/70 motion-safe:animate-pulse [animation-delay:120ms]" />
                            <span className="h-2 w-0.5 rounded-full bg-black/70 motion-safe:animate-pulse [animation-delay:240ms]" />
                          </span>
                        </span>
                      </button>
                    </div>

                    {liaMessage ? (
                      <div className="mt-3 text-xs text-white/75">{liaMessage}</div>
                    ) : null}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={pick.bookingHref}
                      className="group relative inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_18px_60px_rgba(245,158,11,0.25)] transition-all duration-300 hover:bg-amber-400"
                    >
                      <span className="absolute -inset-1 rounded-full bg-amber-500/25 blur-lg motion-safe:animate-pulse" />
                      <span className="relative">Book Captain&apos;s Choice Today</span>
                    </Link>

                    <Link
                      href="/tours/custom-charter"
                      className="inline-flex items-center justify-center rounded-full border border-white/40 bg-transparent px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50"
                    >
                      Customize My Day
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
