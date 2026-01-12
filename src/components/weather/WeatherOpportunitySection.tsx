'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import assetManifest from '@/data/asset-manifest.json';
import { AMBERGRIS_CAYE_FISHING_CALENDAR } from '@/lib/lia-knowledge/fishing-calendar';
import { useSound } from '@/components/audio/SoundProvider';
import Image from 'next/image';
import Link from 'next/link';

interface WeatherDay {
  date: string;
  dayLabel: string;
  temp: number;
  high: number;
  low: number;
  condition: string;
  wind: string;
  wind_speed?: number;
  waveHeight: string;
  rainChance: string;
}

type SpeciesOfDay = {
  name: string;
  calendarLine?: string;
  why?: string;
  detail?: string;
};

type ApiWeatherForecast = {
  date: string;
  high: number;
  low: number;
  windSpeed: number;
  waveHeight?: number;
  weatherDescription: string;
  precipitation: number;
};

type ApiWeatherData = {
  current?: ApiWeatherForecast;
  forecast?: ApiWeatherForecast[];
};

export function WeatherOpportunitySection() {
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baseDate, setBaseDate] = useState<Date | null>(null);
  const [scaleClass, setScaleClass] = useState<string>('');
  const [forceFallbackVideo, setForceFallbackVideo] = useState(false);
  const [activeMedia, setActiveMedia] = useState<{ type: 'video' | 'image'; src: string; poster?: string }>({
    type: 'video',
    src: '/videos/hero/renes-custom-adventures.mp4',
  });

  const stageVideoRef = useRef<HTMLVideoElement | null>(null);

  const { playSfx, ensureUnlocked } = useSound();

  const FALLBACK_VIDEO_SRC = '/videos/hero/renes-custom-adventures.mp4';

  useEffect(() => {
    setBaseDate(new Date());
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const compute = () => {
      const h = window.innerHeight;
      if (h < 850) return 'scale-[0.85]';
      return '';
    };

    const apply = () => setScaleClass(compute());
    apply();

    window.addEventListener('resize', apply, { passive: true });
    return () => window.removeEventListener('resize', apply);
  }, [hasMounted]);

  useEffect(() => {
    setForceFallbackVideo(false);
    setActiveMedia({ type: 'video', src: FALLBACK_VIDEO_SRC });
  }, [selectedDay]);

  const intelligence = useMemo(() => {
    const day = forecast[selectedDay];
    const wind = Math.round(parseFloat(String(day?.wind_speed || 0)));

    if (!day || wind <= 0) {
      return {
        speciesOfDay: null as SpeciesOfDay | null,
        speciesKey: 'tarpon' as 'snook' | 'wahoo' | 'tarpon',
        captainAdvice: 'Select a day to unlock Captain’s Intelligence.',
      };
    }

    const monthName = day.date
      ? (() => {
          const d = new Date(`${day.date}T12:00:00`);
          return Number.isNaN(d.getTime())
            ? null
            : d.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
        })()
      : baseDate
        ? baseDate.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })
        : null;

    const monthData = AMBERGRIS_CAYE_FISHING_CALENDAR.months.find((m) => m.month === monthName) || null;

    const findCalendarLine = (needle: string) => {
      if (!monthData) return undefined;
      const all = [
        ...(monthData.primary_species?.offshore_pelagic || []),
        ...(monthData.primary_species?.reef || []),
        ...(monthData.primary_species?.flats_inshore || []),
      ];
      return all.find((l) => l.toLowerCase().includes(needle.toLowerCase()));
    };

    const speciesKey: 'snook' | 'wahoo' | 'tarpon' = wind > 15 ? 'snook' : wind < 10 ? 'wahoo' : 'tarpon';

    const speciesMeta: Record<typeof speciesKey, { name: string; why: string; calendarNeedle: string }> = {
      snook: {
        name: 'Mangrove Snook',
        why: 'Leeward protection: when the wind is up, we shift to mangroves/creeks and hunt snook in calm water.',
        calendarNeedle: 'snook',
      },
      wahoo: {
        name: 'Deep Sea Wahoo',
        why: 'Offshore ritual: when the wind drops, we run blue-water lanes and hunt wahoo.',
        calendarNeedle: 'wahoo',
      },
      tarpon: {
        name: 'Resident Tarpon',
        why: 'Resident tarpon are present and highly weather-dependent—best when the wind stabilizes.',
        calendarNeedle: 'tarpon',
      },
    };

    const calendarLine = findCalendarLine(speciesMeta[speciesKey].calendarNeedle);

    console.log('[UI-SYNC] Day Index:', selectedDay, 'Species:', speciesMeta[speciesKey].name);

    console.log(`[Captain's Log] Wind Speed: ${wind}, Species: ${speciesMeta[speciesKey].name}`);
    console.log(`[FINAL_VERIFICATION] Wind: ${wind}`);

    return {
      speciesOfDay: {
        name: speciesMeta[speciesKey].name,
        why: speciesMeta[speciesKey].why,
        calendarLine,
      },
      speciesKey,
      captainAdvice:
        speciesKey === 'snook'
          ? 'Wind is up—go leeward. We’ll hunt protected mangroves and channels for snook in calm water.'
          : speciesKey === 'wahoo'
            ? 'Calm window—run offshore lanes. This is when we hunt wahoo with maximum efficiency.'
            : 'Mixed conditions—stay flexible. We’ll time the tides and target tarpon where they’re feeding.' ,
    };
  }, [baseDate, forecast, selectedDay]);

  const speciesOfDay = intelligence.speciesOfDay;
  const captainAdvice = intelligence.captainAdvice;

  const captainsChoiceVideoUrl = useMemo(() => {
    if (intelligence.speciesKey === 'snook') return '/videos/luxury/deep-sea-fishing.mp4';
    if (intelligence.speciesKey === 'wahoo') return '/videos/luxury/deep-sea-fishing.mp4';
    if (intelligence.speciesKey === 'tarpon') return '/videos/luxury/deep-sea-fishing.mp4';
    return FALLBACK_VIDEO_SRC;
  }, [FALLBACK_VIDEO_SRC, intelligence.speciesKey]);

  const manifestThumbnails = useMemo(() => {
    const list = Array.isArray(assetManifest.images)
      ? (assetManifest.images.filter((s) => typeof s === 'string') as string[])
      : [];

    const pool = list.filter((src) => src.includes('/images/renes-activities/'));
    const seen = new Set<string>();
    const out: string[] = [];
    for (const src of pool) {
      if (seen.has(src)) continue;
      seen.add(src);
      out.push(src);
      if (out.length >= 12) break;
    }
    return out;
  }, []);

  const stageVideoSrc = forceFallbackVideo ? FALLBACK_VIDEO_SRC : activeMedia.src;

  const curatedThumbnails = useMemo(() => {
    const images = manifestThumbnails.filter(Boolean);
    const poster = images[0] || '/images/tours/deep-sea-fishing.jpg';
    const uniqueImages: string[] = [];
    const seen = new Set<string>();
    for (const src of images) {
      if (seen.has(src)) continue;
      seen.add(src);
      uniqueImages.push(src);
      if (uniqueImages.length >= 5) break;
    }

    return [
      {
        type: 'video' as const,
        src: captainsChoiceVideoUrl || FALLBACK_VIDEO_SRC,
        poster,
        key: `video:${captainsChoiceVideoUrl || FALLBACK_VIDEO_SRC}`,
      },
      ...uniqueImages.map((src) => ({ type: 'image' as const, src, key: `image:${src}` })),
    ].slice(0, 6);
  }, [FALLBACK_VIDEO_SRC, captainsChoiceVideoUrl, manifestThumbnails]);

  useEffect(() => {
    if (activeMedia.type !== 'video') return;
    const el = stageVideoRef.current;
    if (!el) return;
    try {
      const p = el.play();
      if (p && typeof (p as Promise<void>).catch === 'function') {
        (p as Promise<void>).catch(() => {
          // suppress autoplay/interrupt errors
        });
      }
    } catch {
      // suppress
    }
  }, [activeMedia.type, activeMedia.src]);

  useEffect(() => {
    const node = document.getElementById('weather-intelligence');
    if (!node) return;

    let fired = false;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (fired) return;
        fired = true;

        void (async () => {
          try {
            await ensureUnlocked();
          } catch {
            // no-op
          }
          playSfx('wind', 0.05);
        })();
      },
      { threshold: 0.25 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [ensureUnlocked, playSfx]);

  useEffect(() => {
    if (!hasMounted) return;
    console.log('Weather component mounted');
    const controller = new AbortController();
    let cancelled = false;
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    const fetchWeather = async () => {
      try {
        console.log('Fetching weather data...');
        setLoading(true);
        setError(null);

        const res = await fetch('/api/weather', {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: ApiWeatherData = await res.json();
        console.log('Weather data received:', data);

        if (!data || !data.current || !Array.isArray(data.forecast)) {
          throw new Error('Unexpected weather response shape');
        }

        const all = [data.current, ...data.forecast].filter(Boolean) as ApiWeatherForecast[];
        const mapped = all.slice(0, 5).map((d, idx) => mapApiDayToWeatherDay(d, idx));

        if (cancelled) return;
        setForecast(mapped);
      } catch (err) {
        if (cancelled) return;
        console.error('Weather fetch error:', err);

        const message =
          err instanceof Error
            ? err.name === 'AbortError'
              ? 'Weather request timed out'
              : err.message
            : 'Unknown error';

        setForecast([]);
        setError(message);
      } finally {
        window.clearTimeout(timeoutId);
        if (cancelled) return;
        setLoading(false);
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [hasMounted]);

  useEffect(() => {
    if (selectedDay > 0 && selectedDay >= forecast.length) {
      setSelectedDay(0);
    }
  }, [forecast.length, selectedDay]);

  const selectedWind = Math.round(parseFloat(String(forecast[selectedDay]?.wind_speed || 0)));

  if (!hasMounted || loading || forecast.length === 0 || selectedWind <= 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950">
        <div className="mx-auto w-full max-w-screen-2xl px-4">
          <div className="max-w-5xl mx-auto">
            <div className="h-10 w-64 bg-white/10 rounded-xl" />
            <div className="mt-6 h-72 w-full bg-white/10 rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950">
        <div className="mx-auto w-full max-w-screen-2xl px-4">
          <div className="text-center text-white/60">Weather temporarily unavailable</div>
        </div>
      </section>
    );
  }

  if (forecast.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950">
        <div className="mx-auto w-full max-w-screen-2xl px-4">
          <div className="text-center text-white/60">Conditions unavailable right now.</div>
        </div>
      </section>
    );
  }

  return (
    <section id="weather-intelligence" className="relative w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-14">
        <div className={`relative w-full h-[90vh] max-h-[900px] overflow-hidden ${scaleClass ? `origin-top ${scaleClass}` : ''}`}>
          <div className="absolute inset-0 bg-tropical-aurora opacity-100 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.10] pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.10) 35px, rgba(255,255,255,0.10) 70px), repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,0.08) 35px, rgba(255,255,255,0.08) 70px)',
              }}
            />
          </div>

          <div className="absolute inset-0 opacity-[0.35] pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 15% 25%, rgba(79, 70, 229, 0.35) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(255, 107, 53, 0.30) 0%, transparent 42%), radial-gradient(circle at 70% 80%, rgba(46, 204, 113, 0.26) 0%, transparent 50%), radial-gradient(circle at 25% 85%, rgba(139, 92, 246, 0.25) 0%, transparent 55%)',
              }}
            />
          </div>

          <div className="relative z-10 h-full p-4 md:p-6">
            <div className="h-full flex flex-col lg:flex-row gap-6">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-48 shrink-0"
              >
                <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-5">
                  <div className="text-xs uppercase tracking-[0.35em] text-tropical-coral/90">Conditions</div>
                  <div className="mt-3 text-xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">{speciesOfDay?.name || '—'}</div>
                </div>

                <div className="mt-4 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 h-[400px] overflow-y-auto">
                  <div className="grid gap-3">
                    {forecast.slice(0, 5).map((day, i) => {
                      const isActive = selectedDay === i;
                      const windShort = day.wind.replace(' mph', 'mph');
                      return (
                        <button
                          key={day.date}
                          type="button"
                          onClick={() => setSelectedDay(i)}
                          className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                            isActive
                              ? 'border-[#D4AF37]/60 bg-white/15 shadow-xl shadow-black/20'
                              : 'border-white/10 bg-white/10 hover:bg-white/12'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="text-xs uppercase tracking-[0.35em] text-white/60">{day.dayLabel}</div>
                            <div className="text-xs text-white/55">{day.rainChance}</div>
                          </div>
                          <div className="mt-2 flex items-end justify-between gap-4">
                            <div className="text-3xl font-light text-white">{day.temp}°</div>
                            <div className="text-sm font-semibold text-white/85">{windShort}</div>
                          </div>
                          <div className="mt-2 text-[11px] text-white/60 line-clamp-2">{day.condition}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="flex-1 min-w-0"
              >
                <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-4 md:p-5 shadow-2xl">
                  <div className="relative h-[450px] w-full overflow-hidden rounded-2xl">
                    {activeMedia.type === 'image' ? (
                      <>
                        <Image
                          src={activeMedia.src}
                          alt=""
                          fill
                          className="object-cover object-top blur-2xl scale-110"
                          sizes="(min-width: 1024px) 66vw, 100vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-black/25" />
                        <Image
                          src={activeMedia.src}
                          alt=""
                          fill
                          priority
                          className="object-contain object-top"
                          sizes="(min-width: 1024px) 66vw, 100vw"
                        />
                      </>
                    ) : (
                      <video
                        ref={stageVideoRef}
                        key={`${selectedDay}-${stageVideoSrc}`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        poster={activeMedia.poster || undefined}
                        onError={() => {
                          setForceFallbackVideo(true);
                          setActiveMedia({ type: 'video', src: FALLBACK_VIDEO_SRC, poster: activeMedia.poster });
                        }}
                      >
                        <source src={stageVideoSrc} type="video/mp4" />
                      </video>
                    )}

                    <div className="absolute left-4 top-4 max-w-[360px] rounded-2xl border border-[#D4AF37]/45 bg-white/10 backdrop-blur-xl p-4">
                      <div className="text-[11px] uppercase tracking-[0.35em] text-white/80">Species of the Day</div>
                      <div className="mt-2 text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
                        {speciesOfDay?.name || '—'}
                      </div>
                      <div className="mt-4 text-[11px] uppercase tracking-[0.35em] text-white/80">Captain&apos;s Advice</div>
                      <div className="mt-2 text-sm text-white/85 leading-relaxed">{captainAdvice}</div>

                      <Link
                        href="/checkout"
                        className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-black hover:bg-[#e3c65d] transition"
                      >
                        SECURE THIS WINDOW
                      </Link>
                    </div>
                  </div>

                  <div className="flex overflow-x-auto h-32 gap-4 mt-4">
                    {curatedThumbnails.map((t) => {
                      const isSelected = t.type === activeMedia.type && t.src === activeMedia.src;
                      const thumbSrc = t.type === 'video' ? t.poster : t.src;
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => {
                            if (t.type === 'video') {
                              setForceFallbackVideo(false);
                              setActiveMedia({ type: 'video', src: t.src, poster: t.poster });
                              return;
                            }
                            setActiveMedia({ type: 'image', src: t.src });
                          }}
                          className={`relative h-32 w-48 shrink-0 overflow-hidden rounded-2xl border transition ${
                            isSelected
                              ? 'border-[#D4AF37]/70 ring-2 ring-[#D4AF37]/40'
                              : 'border-white/15 hover:border-white/30'
                          }`}
                          aria-label="Select media"
                        >
                          {thumbSrc ? (
                            <Image src={thumbSrc} alt="" fill className="object-cover object-top" sizes="200px" />
                          ) : (
                            <div className="absolute inset-0 bg-white/10" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function mapApiDayToWeatherDay(day: ApiWeatherForecast, index: number): WeatherDay {
  const dateObj = new Date(`${day.date}T12:00:00`);
  const dayLabel =
    index === 0
      ? 'TODAY'
      : dateObj
          .toLocaleDateString('en-US', { weekday: 'short' })
          .toUpperCase();

  const high = Math.round(day.high);
  const low = Math.round(day.low);

  const wind = `${Math.round(day.windSpeed)} mph`;

  const wave = typeof day.waveHeight === 'number' ? day.waveHeight : undefined;
  const waveHeight = wave !== undefined ? `${wave.toFixed(1)} ft` : '—';

  const condition = (day.weatherDescription || '').toLowerCase();
  const rainChance = `${Math.round(day.precipitation || 0)}%`;

  const temp = Math.round((high + low) / 2);

  return {
    date: day.date,
    dayLabel,
    temp,
    high,
    low,
    condition,
    wind,
    wind_speed: day.windSpeed,
    waveHeight,
    rainChance,
  };
}
