'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface WeatherDay {
  date: string;
  dayLabel: string;
  temp: number;
  high: number;
  low: number;
  condition: string;
  wind: string;
  waveHeight: string;
  rainChance: string;
}

interface Recommendation {
  title: string;
  subtitle: string;
  description: string;
  exclusiveNote: string;
  cta: string;
  ctaLink: string;
  urgency: 'high' | 'medium' | 'low';
}

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
  const [selectedDay, setSelectedDay] = useState(0);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/weather')
      .then((res) => res.json())
      .then((data: ApiWeatherData) => {
        if (cancelled) return;
        const all = [data.current, ...(data.forecast || [])].filter(Boolean) as ApiWeatherForecast[];
        const mapped = all.slice(0, 5).map((d, idx) => mapApiDayToWeatherDay(d, idx));
        setForecast(mapped);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setForecast([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedDay > 0 && selectedDay >= forecast.length) {
      setSelectedDay(0);
    }
  }, [forecast.length, selectedDay]);

  const currentDay = forecast[selectedDay];

  const recommendation = useMemo(() => {
    if (!currentDay) return null;
    return getRecommendation(currentDay);
  }, [currentDay]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center text-white/60">Loading conditions...</div>
        </div>
      </section>
    );
  }

  if (forecast.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center text-white/60">Conditions unavailable right now.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-tropical-aurora opacity-100" />
      <div className="absolute inset-0 opacity-[0.10]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.10) 35px, rgba(255,255,255,0.10) 70px), repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,0.08) 35px, rgba(255,255,255,0.08) 70px)',
          }}
        />
      </div>

      <div className="absolute inset-0 opacity-[0.35]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 25%, rgba(79, 70, 229, 0.35) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(255, 107, 53, 0.30) 0%, transparent 42%), radial-gradient(circle at 70% 80%, rgba(46, 204, 113, 0.26) 0%, transparent 50%), radial-gradient(circle at 25% 85%, rgba(139, 92, 246, 0.25) 0%, transparent 55%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-tropical-coral text-sm uppercase tracking-[0.3em] font-light">
              The Rene&apos;s Advantage
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">
            Conditions-Based
            <span className="block font-serif italic text-tropical-coral">Intelligence</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-light">
            We don&apos;t just check the weather—we decode it. Each day reveals unique opportunities that only local
            expertise can unlock.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-16 flex-wrap"
        >
          {forecast.slice(0, 5).map((day, i) => (
            <button
              key={day.date}
              onClick={() => setSelectedDay(i)}
              className={`
                group relative px-8 py-6 rounded-2xl border transition-all duration-300 backdrop-blur-sm
                ${
                  selectedDay === i
                    ? 'bg-gradient-to-br from-tropical-coral via-tropical-orange to-tropical-pink text-white border-white/40 shadow-xl shadow-orange-500/30'
                    : i === 0
                      ? 'bg-white/10 text-white border-belize-400/40 hover:border-belize-300 shadow-lg shadow-belize-500/15'
                      : 'bg-white/10 text-white border-white/15 hover:border-tropical-turquoise/50 shadow-lg shadow-tropical-turquoise/10'
                }
              `}
            >
              <div
                className={`
                text-sm uppercase tracking-wider mb-2 font-medium transition-colors
                ${
                  selectedDay === i
                    ? 'text-white'
                    : i === 0
                      ? 'text-white/85 group-hover:text-white'
                      : 'text-white/75 group-hover:text-white'
                }
              `}
              >
                {day.dayLabel}
              </div>

              <div
                className={`
                text-3xl font-light transition-colors
                ${selectedDay === i ? 'text-white' : 'text-white'}
              `}
              >
                {day.temp}°
              </div>

              <div
                className={`
                text-xs mt-2 transition-colors
                ${selectedDay === i ? 'text-white/85' : i === 0 ? 'text-white/75' : 'text-white/70'}
              `}
              >
                {day.wind} • {day.waveHeight}
              </div>

              {selectedDay === i && (
                <motion.div
                  layoutId="activeDay"
                  className="absolute inset-0 border-2 border-white/60 rounded-2xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {recommendation && (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-10 md:p-12 shadow-2xl overflow-hidden">
              <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-tropical-pink/25 rounded-full blur-3xl" />
              <div className="absolute -bottom-28 -left-28 w-[560px] h-[560px] bg-tropical-turquoise/25 rounded-full blur-3xl" />
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-tropical-green/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                {recommendation.urgency === 'high' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-tropical-coral/10 border border-tropical-coral/30 rounded-full"
                  >
                    <span className="w-2 h-2 bg-tropical-coral rounded-full animate-pulse" />
                    <span className="text-tropical-coral text-sm font-medium tracking-wide">HIGH OPPORTUNITY</span>
                  </motion.div>
                )}

                <h3 className="text-4xl md:text-5xl font-light text-white mb-3 tracking-tight">
                  {recommendation.title}
                </h3>

                <p className="text-tropical-coral text-xl font-light mb-8 italic">{recommendation.subtitle}</p>

                <p className="text-white/80 text-lg leading-relaxed mb-8 font-light max-w-3xl">
                  {recommendation.description}
                </p>

                <div className="flex items-center gap-3 mb-10 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-white/70 text-sm font-medium">{recommendation.exclusiveNote}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={recommendation.ctaLink}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-10 py-5 bg-gradient-to-r from-tropical-coral to-tropical-pink text-white font-bold rounded-xl border border-white/25 shadow-xl shadow-orange-500/25 hover:shadow-pink-500/25 transition-all duration-300 text-lg tracking-wide"
                    >
                      {recommendation.cta}
                    </motion.button>
                  </Link>

                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('lia:open'));
                    }}
                    className="px-10 py-5 bg-white/10 text-white font-semibold rounded-xl border border-tropical-turquoise/40 hover:border-tropical-turquoise/70 hover:bg-white/15 transition-all duration-300 text-lg"
                  >
                    Ask Lia for Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-white/50 text-sm uppercase tracking-[0.3em] font-light">
            Exclusive • Intelligent • Uncompromising
          </p>
        </motion.div>
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
    waveHeight,
    rainChance,
  };
}

function getRecommendation(day: WeatherDay): Recommendation {
  const windSpeed = parseInt(day.wind);
  const waveHeight = (() => {
    const n = parseFloat(day.waveHeight);
    return Number.isFinite(n) ? n : 0;
  })();
  const isClear = day.condition.includes('clear');
  const isCloudy = day.condition.includes('cloud');
  const rainChance = parseInt(day.rainChance);

  if (windSpeed < 8 && waveHeight < 2 && isClear) {
    return {
      title: 'Premium Deep Sea Perfection',
      subtitle: 'Glassy seas, unlimited visibility—rare window',
      description:
        'Calm seas plus clear skies create peak offshore conditions for trophy pelagics. If you want the “wow” day, this is the window to lock in.',
      exclusiveNote: 'Weather windows move fast—want me to help you pick the best time?',
      cta: 'Lock In Deep Sea Charter',
      ctaLink: '/tours/deep-sea-fishing',
      urgency: 'high',
    };
  }

  if (windSpeed >= 8 && windSpeed <= 12 && waveHeight >= 2 && waveHeight <= 4 && isClear) {
    return {
      title: 'Ideal Snorkeling Conditions',
      subtitle: 'Comfortable breeze, strong visibility—Hol Chan day',
      description:
        'Light winds keep things comfortable while preserving clarity. Best day for underwater photos and seeing rays, turtles, and sharks in clean water.',
      exclusiveNote: 'These days tend to fill—want the morning or afternoon slot?',
      cta: 'Reserve Hol Chan + Beach BBQ',
      ctaLink: '/tours/hol-chan-snorkel',
      urgency: 'medium',
    };
  }

  if (windSpeed >= 13 && windSpeed <= 18) {
    return {
      title: 'Protected Reef Fishing',
      subtitle: 'Breezy conditions = leeward advantage',
      description:
        'When it breezes up, bait stacks in protected reef zones. We work the calmer pockets for snapper, grouper, and barracuda—high action without the rough ride.',
      exclusiveNote: 'Local-style day—smart route selection makes the difference',
      cta: 'Book Reef Fishing + Snorkel',
      ctaLink: '/tours/reef-fishing-snorkeling',
      urgency: 'medium',
    };
  }

  if (isCloudy || rainChance > 20) {
    return {
      title: 'Tarpon Feeding Frenzy Alert',
      subtitle: 'Overcast skies = aggressive bites',
      description:
        'Cloud cover and passing showers flip the switch—tarpon feed hard and close to the boat. If you want a high-adrenaline story, this is your day.',
      exclusiveNote: 'Timing matters—want me to suggest the best window?',
      cta: 'Get Up Close with Giants',
      ctaLink: '/tours/tarpon-feeding',
      urgency: 'high',
    };
  }

  if (windSpeed >= 19 && windSpeed <= 25) {
    return {
      title: 'Secret Beach Sanctuary',
      subtitle: 'Windward chaos = leeward calm',
      description:
        'When open water gets choppy, we pivot to the most protected, shallow-blue stretches. Relaxed beach day energy with the right route and the right timing.',
      exclusiveNote: 'A calm option when the breeze is up',
      cta: 'Escape to Secret Beach',
      ctaLink: '/tours/secret-beach',
      urgency: 'low',
    };
  }

  if (windSpeed >= 26 || waveHeight >= 6) {
    return {
      title: 'Tarpon Specialists Only',
      subtitle: 'Rough water = extreme action',
      description:
        'Too rough for most experiences, but tarpon still fire. If you want a serious fishing mission, this is the move—otherwise we’ll recommend a calmer plan.',
      exclusiveNote: 'Best for confident anglers—ask Lia for the safest plan',
      cta: 'Challenge the Rough Seas',
      ctaLink: '/tours/tarpon-feeding',
      urgency: 'low',
    };
  }

  return {
    title: 'The Ultimate Belize Experience',
    subtitle: 'Flexible adventure adapting to conditions',
    description:
      'When conditions are mixed, we adjust in real time—find the calmest reefs, the clearest pockets, and the most protected beach stop. Maximum flexibility, maximum value.',
    exclusiveNote: 'Most versatile option—always delivers',
    cta: 'Book Full Day Ultimate',
    ctaLink: '/tours/ultimate-adventure',
    urgency: 'medium',
  };
}
