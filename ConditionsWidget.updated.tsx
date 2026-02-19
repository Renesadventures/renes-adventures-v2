'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CloudRain,
  CloudSun,
  Image as ImageIcon,
  Mic,
  Play,
  Sun,
  Waves,
  Wind,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type WindDir = 'N' | 'NE' | 'ENE' | 'E' | 'ESE' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

type ForecastDay = {
  id: string;
  day: string;
  date: string;
  icon: 'sun' | 'partly' | 'windy' | 'rain';
  highF: number;
  lowF: number;
  windMph: number;
  windDir: WindDir;
  wavesFt: string;
  precipitation: number;
  description: string;
};

type CaptainsPick = {
  id: string;
  tourName: string;
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

/* ------------------------------------------------------------------ */
/*  Captain's intelligence — picks best tour for given conditions      */
/* ------------------------------------------------------------------ */

function degToCompass(deg: number): WindDir {
  const dirs: WindDir[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function pickByConditions(args: {
  windMph: number;
  windDir: WindDir;
  waveMaxFt: number;
  precipitation: number;
  dayIndex: number;
}): CaptainsPick {
  const { windMph, windDir, waveMaxFt, precipitation, dayIndex } = args;

  // Dead calm → Blue Hole (pristine visibility)
  if (windMph < 8 && precipitation < 20) {
    return {
      id: 'blue-hole',
      tourName: 'Blue Hole Adventure',
      headline: "CAPTAIN'S CHOICE",
      recommendation: 'Blue Hole — Pristine Visibility',
      reasoning: `Calm winds (${windMph} mph) and gentle seas make the run comfortable and the water crystal clear. This is a perfect day for the Blue Hole.`,
      bookingHref: '/tours/blue-hole',
      defaultMediaId: 'img-blue-hole-iconic',
    };
  }

  // Rainy but fishable → Deep Sea (fish bite in rain)
  if (precipitation >= 40) {
    return {
      id: 'deep-sea-rain',
      tourName: 'Deep Sea Fishing',
      headline: "CAPTAIN'S CHOICE",
      recommendation: 'Rain Means the Fish Are Biting',
      reasoning: `${precipitation}% chance of rain, but experienced captains know: overcast skies and choppy water drive pelagics to feed. Mahi-mahi and barracuda will be active.`,
      bookingHref: '/tours/deep-sea-fishing',
      defaultMediaId: 'vid-deep-sea-5',
    };
  }

  // Moderate trade winds (8-18 mph) — rotate through tours by day
  if (windMph >= 8 && windMph <= 18) {
    const rotation = dayIndex % 4;

    if (rotation === 0) {
      return {
        id: 'custom-snorkel',
        tourName: "Rene's Custom Adventure",
        headline: "CAPTAIN'S CHOICE",
        recommendation: 'Lee Side Reef — Crystal Clear Today',
        reasoning: `${windMph} mph ${windDir} winds push waves north, but the south reef stays protected and glass-clear. Hol Chan, sharks, rays, and seahorses await.`,
        bookingHref: '/tours/custom-charter',
        defaultMediaId: 'vid-reef-fishing-xxx',
      };
    }

    if (rotation === 1) {
      return {
        id: 'deep-sea',
        tourName: 'Deep Sea Fishing',
        headline: "CAPTAIN'S CHOICE",
        recommendation: 'Trade Winds Firing Up the Bite',
        reasoning: `${windMph} mph ${windDir} trades push bait into the channels. Pelagics are feeding — mahi-mahi, wahoo, and barracuda will be active. Captain Rene knows the spots.`,
        bookingHref: '/tours/deep-sea-fishing',
        defaultMediaId: 'vid-deep-sea-5',
      };
    }

    if (rotation === 2) {
      return {
        id: 'secret-beach',
        tourName: 'Secret Beach',
        headline: "CAPTAIN'S CHOICE",
        recommendation: 'Secret Beach — Lagoon Side Paradise',
        reasoning: `The lagoon side stays calm regardless of ${windMph} mph trades. Turquoise water, beach bars, and zero swell — the perfect escape from the windward side.`,
        bookingHref: '/tours/secret-beach',
        defaultMediaId: 'vid-secret-beach-5',
      };
    }

    return {
      id: 'sunset',
      tourName: 'Sunset Cruise',
      headline: "CAPTAIN'S CHOICE",
      recommendation: 'Sunset on the Lee Side',
      reasoning: `We run the protected western shore where ${windMph} mph trades can't reach. Calm water, golden light, champagne — the Belize sky does the rest.`,
      bookingHref: '/tours/sunset-cruise',
      defaultMediaId: 'vid-secret-beach-5',
    };
  }

  // Strong winds (>18 mph) — Deep Sea thrives, but alternate with Custom
  if (windMph > 18) {
    if (dayIndex % 2 === 0) {
      return {
        id: 'deep-sea-heavy',
        tourName: 'Deep Sea Fishing',
        headline: "CAPTAIN'S CHOICE",
        recommendation: 'Big Wind = Big Fish',
        reasoning: `${windMph} mph winds churn the deep water and scatter bait. Offshore pelagics go into a feeding frenzy. This is a serious fishing day.`,
        bookingHref: '/tours/deep-sea-fishing',
        defaultMediaId: 'vid-deep-sea-5',
      };
    }
    return {
      id: 'custom-protected',
      tourName: "Rene's Custom Adventure",
      headline: "CAPTAIN'S CHOICE",
      recommendation: 'South Reef + Beach BBQ — Protected Today',
      reasoning: `${windMph} mph winds keep the north rough, but Captain Rene tucks into the lee side. Reef structure breaks the swell — easy snorkeling, relaxed cruising, and a Mayan-style Beach BBQ finish.`,
      bookingHref: '/tours/custom-charter',
      defaultMediaId: 'vid-reef-fishing-xxx',
    };
  }

  // Calm evening fallback → Sunset Cruise
  if (windMph <= 10 && precipitation < 20) {
    return {
      id: 'sunset',
      tourName: 'Sunset Cruise',
      headline: "CAPTAIN'S CHOICE",
      recommendation: 'Golden Hour on Glass Water',
      reasoning: `Light winds at ${windMph} mph and clear skies. Tonight's sunset will be unforgettable — champagne, calm waters, and the Belize sky doing its thing.`,
      bookingHref: '/tours/sunset-cruise',
      defaultMediaId: 'vid-secret-beach-5',
    };
  }

  // Default → Custom Charter (always adaptable)
  return {
    id: 'custom-bbq',
    tourName: "Rene's Custom Adventure",
    headline: "CAPTAIN'S CHOICE",
    recommendation: 'Custom Adventure + Beach BBQ',
    reasoning: `We tuck into the lee side where reef structure breaks the swell — easy snorkeling, relaxed cruising, and a Mayan-style beach BBQ finish.`,
    bookingHref: '/tours/custom-charter',
    defaultMediaId: 'vid-secret-beach-5',
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function weatherIconFromDescription(desc: string, icon: string): ForecastDay['icon'] {
  const d = desc.toLowerCase();
  if (d.includes('rain') || d.includes('drizzle') || d.includes('thunderstorm')) return 'rain';
  if (d.includes('wind') || d.includes('gale')) return 'windy';
  if (icon.includes('01') || icon.includes('02')) return 'sun';
  return 'partly';
}

function ForecastIcon({ kind }: { kind: ForecastDay['icon'] }) {
  if (kind === 'sun') return <Sun className="h-5 w-5 text-amber-500" />;
  if (kind === 'rain') return <CloudRain className="h-5 w-5 text-blue-500" />;
  if (kind === 'windy') return <Wind className="h-5 w-5 text-sky-600" />;
  return <CloudSun className="h-5 w-5 text-slate-700" />;
}

/* ------------------------------------------------------------------ */
/*  Static fallback (used when weather API is unavailable)             */
/* ------------------------------------------------------------------ */

function getStaticForecast(): ForecastDay[] {
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dayName = dayNames[d.getDay()];
    const dateStr = `${monthNames[d.getMonth()]} ${d.getDate()}`;
    const winds = [12, 11, 17, 8, 4];
    const dirs: WindDir[] = ['ENE', 'ENE', 'E', 'E', 'NE'];
    const icons: ForecastDay['icon'][] = ['partly', 'sun', 'windy', 'partly', 'sun'];
    const highs = [82, 83, 81, 82, 84];
    const lows = [76, 77, 75, 76, 78];
    const waves = ['2–3 ft', '2 ft', '3–4 ft', '2 ft', '1–2 ft'];
    const precips = [15, 10, 25, 12, 5];
    const descs = ['Partly cloudy', 'Sunny', 'Breezy', 'Partly cloudy', 'Sunny'];

    return {
      id: `day-${i}`,
      day: i === 0 ? 'Today' : dayName,
      date: dateStr,
      icon: icons[i],
      highF: highs[i],
      lowF: lows[i],
      windMph: winds[i],
      windDir: dirs[i],
      wavesFt: waves[i],
      precipitation: precips[i],
      description: descs[i],
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ConditionsWidget() {
  const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

  /* --- Live weather fetch ----------------------------------------- */
  const [liveForecast, setLiveForecast] = useState<ForecastDay[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/weather');
        if (!res.ok) throw new Error('Weather API unavailable');
        const data = await res.json();

        if (cancelled) return;

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const allDays = [data.current, ...(data.forecast || [])].slice(0, 5);

        const parsed: ForecastDay[] = allDays.map((f: any, i: number) => {
          const dt = new Date(f.date);
          const waveEst = (f.waveHeight ?? f.windSpeed * 0.5);
          return {
            id: `live-${i}`,
            day: i === 0 ? 'Today' : dayNames[dt.getDay()],
            date: `${monthNames[dt.getMonth()]} ${dt.getDate()}`,
            icon: weatherIconFromDescription(f.weatherDescription || '', f.weatherIcon || ''),
            highF: Math.round(f.high),
            lowF: Math.round(f.low),
            windMph: Math.round(f.windSpeed),
            windDir: degToCompass(f.windDirection || 0),
            wavesFt: waveEst < 2 ? '1–2 ft' : waveEst < 3 ? '2–3 ft' : '3–4 ft',
            precipitation: f.precipitation ?? 0,
            description: f.weatherDescription || 'Partly cloudy',
          };
        });

        setLiveForecast(parsed);
      } catch {
        // Fall through to static
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const forecast = liveForecast ?? getStaticForecast();
  const isLive = !!liveForecast;

  /* --- Selected day state ----------------------------------------- */
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const selectedDay = forecast[selectedDayIdx] || forecast[0];

  const pick = useMemo(() => {
    if (!selectedDay) return pickByConditions({ windMph: 12, windDir: 'ENE', waveMaxFt: 2.5, precipitation: 15, dayIndex: 0 });
    const waveMax = parseFloat(selectedDay.wavesFt) || 2;
    return pickByConditions({
      windMph: selectedDay.windMph,
      windDir: selectedDay.windDir,
      waveMaxFt: waveMax,
      precipitation: selectedDay.precipitation,
      dayIndex: selectedDayIdx,
    });
  }, [selectedDay, selectedDayIdx]);

  /* --- Gallery state ---------------------------------------------- */
  const gallery = useMemo<GalleryItem[]>(
    () => [
      { id: 'vid-secret-beach-5', type: 'video', src: `${base}/luxury/Secrete%20Beach%205.mp4`, label: 'Secret Beach' },
      { id: 'vid-reef-fishing-xxx', type: 'video', src: `${base}/luxury/reef-fishing%20xxx.mp4`, label: 'Reef Fishing' },
      { id: 'vid-lobster-1', type: 'video', src: `${base}/luxury/Lobster%20FIshing%201.mp4`, label: 'Lobster' },
      { id: 'vid-deep-sea-5', type: 'video', src: `${base}/luxury/Deep%20Sea%20Fishing%205.mp4`, label: 'Deep Sea' },
      { id: 'img-nature', type: 'image', src: `${base}/images/renes-activities/exotic-beach-landscape-2024-10-12-01-05-44-utc.jpg`, label: 'Snorkel' },
      { id: 'img-blue-hole-iconic', type: 'image', src: `${base}/images/renes-activities/Blue-Hole-Iconic.jpeg`, label: 'Blue Hole' },
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

  const selected = useMemo(() => gallery.find((g) => g.id === selectedId) || gallery[0], [gallery, selectedId]);

  // Sync gallery selection when pick changes
  useEffect(() => {
    const preferred = gallery.find((g) => g.id === pick.defaultMediaId);
    if (preferred) setSelectedId(preferred.id);
  }, [pick.defaultMediaId, gallery]);

  useEffect(() => {
    if (pendingId === null) return;
    const t = window.setTimeout(() => {
      setSelectedId(pendingId);
      setPendingId(null);
      setIsFaded(false);
    }, 250);
    return () => window.clearTimeout(t);
  }, [pendingId]);

  useEffect(() => { setIsMediaLoaded(false); }, [selectedId]);

  useEffect(() => {
    const el = mainVideoRef.current;
    if (!el) return;
    try {
      el.playbackRate = 0.5;
      const p = el.play();
      if (p && typeof (p as Promise<void>).catch === 'function') {
        (p as Promise<void>).catch(() => {});
      }
    } catch { /* suppress */ }
  }, [selectedId, selected?.type]);

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setPendingId(id);
    setIsFaded(true);
  };

  const markFailed = (id: string) => {
    setFailedMediaIds((prev) => prev[id] ? prev : { ...prev, [id]: true });
  };

  /* --- Render ----------------------------------------------------- */
  return (
    <section id="weather-intelligence" className="w-full bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">

          {/* ========== LEFT: 5-Day Forecast ========== */}
          <aside className="lg:col-span-4">
            <div className="h-full min-h-[600px] rounded-3xl bg-gradient-to-br from-white/85 via-white/75 to-amber-50/70 shadow-[0_18px_50px_rgba(15,23,42,0.14)] ring-1 ring-black/5 flex flex-col">
              <div className="px-6 pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                    5-Day Forecast
                  </div>
                  <div className="flex items-center gap-2">
                    {isLive && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        Live
                      </span>
                    )}
                    <span className="text-xs text-slate-600">Ambergris Caye</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">Tap a day for Captain Rene&apos;s recommendation</p>
              </div>

              <div className="mt-4 flex-1 pb-6">
                <div className="flex gap-3 overflow-x-auto px-6 pb-2 lg:block lg:h-full lg:max-h-[520px] lg:overflow-y-auto lg:overflow-x-hidden [scrollbar-width:thin] [scrollbar-color:rgba(245,158,11,0.65)_rgba(0,0,0,0.06)]">
                  {forecast.map((d, idx) => {
                    const isSelected = idx === selectedDayIdx;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDayIdx(idx)}
                        className={`shrink-0 w-56 lg:w-full text-left rounded-2xl px-4 py-4 lg:mb-3 transition-all duration-300 ${
                          isSelected
                            ? 'bg-amber-500/10 shadow-[0_10px_30px_rgba(245,158,11,0.15)] ring-2 ring-amber-500'
                            : 'bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 hover:ring-amber-500/40 hover:shadow-[0_10px_30px_rgba(245,158,11,0.10)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold uppercase tracking-[0.25em] ${isSelected ? 'text-amber-700' : 'text-slate-500'}`}>
                                {d.day}
                              </span>
                              <span className="text-[10px] text-slate-400">{d.date}</span>
                            </div>
                            <div className="mt-1 flex items-baseline gap-1">
                              <span className="text-lg font-semibold text-slate-900">{d.highF}°</span>
                              <span className="text-sm text-slate-400">{d.lowF}°</span>
                            </div>
                          </div>

                          <div className={`rounded-xl p-2 ring-1 ring-black/5 ${
                            isSelected
                              ? 'bg-gradient-to-br from-amber-500/20 via-amber-400/15 to-amber-500/20'
                              : 'bg-gradient-to-br from-amber-500/15 via-sky-500/10 to-emerald-500/15'
                          }`}>
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

                        {d.precipitation > 20 && (
                          <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-600">
                            <CloudRain className="h-3 w-3" />
                            {d.precipitation}% rain
                          </div>
                        )}

                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-amber-500/20">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-amber-700 font-semibold">
                              Best for: {pick.tourName}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* ========== RIGHT: Captain's Pick + Gallery ========== */}
          <div className="lg:col-span-8">
            <div className="h-full min-h-[600px] rounded-3xl bg-gradient-to-br from-slate-950 via-slate-950/95 to-slate-900 text-white shadow-[0_18px_60px_rgba(2,6,23,0.55)] ring-1 ring-white/10 overflow-hidden flex flex-col">
              <div className="px-6 pt-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.4em] text-white/60">
                      {pick.headline} — {selectedDay.day} {selectedDay.date}
                    </div>
                    <div className="mt-2 text-2xl sm:text-3xl font-serif tracking-tight text-white">
                      {pick.recommendation}
                    </div>
                    <div className="mt-2 text-sm text-white/70">{pick.reasoning}</div>
                  </div>

                  {isLive && (
                    <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/10">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </span>
                      Live
                    </div>
                  )}
                </div>

                <div className="mt-5 h-1 w-28 rounded-full bg-amber-500" />
              </div>

              {/* --- Main media viewer --- */}
              <div className="mt-6 px-6">
                <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                  <div className="relative aspect-video w-full max-h-[500px]">
                    <div className={`absolute inset-0 transition-opacity duration-300 ${isFaded ? 'opacity-0' : 'opacity-100'}`}>
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
                          onError={() => { if (selected) markFailed(selected.id); }}
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
                          onLoad={() => setIsMediaLoaded(true)}
                          onError={() => { if (selected) markFailed(selected.id); }}
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                    </div>

                    <div className={`absolute inset-0 transition-opacity duration-300 ${isMediaLoaded ? 'opacity-0' : 'opacity-100'}`}>
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
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Gallery thumbnails --- */}
              <div className="mt-5 px-6">
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
                              autoPlay muted loop playsInline preload="metadata"
                              onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.5; }}
                              onError={() => markFailed(item.id)}
                              className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:brightness-110 transition-all duration-300"
                            >
                              <source src={item.src} type="video/mp4" />
                            </video>
                          ) : (
                            <Image
                              src={item.src} alt="" fill sizes="128px"
                              onError={() => markFailed(item.id)}
                              className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.06] transition-all duration-300"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                          {item.type === 'video' ? (
                            <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white ring-1 ring-white/10">
                              <Play className="h-3.5 w-3.5 text-amber-400" /> Video
                            </div>
                          ) : (
                            <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white ring-1 ring-white/10">
                              <ImageIcon className="h-3.5 w-3.5 text-sky-300" /> Photo
                            </div>
                          )}
                        </div>

                        <div className="px-2 pb-2 pt-2 text-left">
                          <div className={`text-[10px] uppercase tracking-[0.22em] font-semibold transition-colors duration-300 ${active ? 'text-amber-400' : 'text-white/70'}`}>
                            {item.label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* --- Captain's insight + Lia + CTAs --- */}
              <div className="mt-6 px-6 pb-6">
                <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <div className="text-sm leading-relaxed text-white/80">
                    {pick.reasoning} Only a Belizean captain born and raised on these waters knows these patterns — we&apos;ve navigated them for generations.
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
                            Want to know why {pick.tourName} is perfect for {selectedDay.day.toLowerCase()}?
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setLiaMessage(`Great choice! ${pick.recommendation}. ${pick.reasoning} Want me to help you book?`)}
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
                      <span className="relative">Book {pick.tourName} — {selectedDay.day}</span>
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
