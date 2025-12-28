'use client';

import { useWeather } from '@/hooks/useWeather';
import { getDynamicCTA } from '@/utils/weatherSuitability';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun } from 'lucide-react';
import LiaWeatherCommentary from './LiaWeatherCommentary';

interface WeatherForecastWidgetProps {
  expanded?: boolean;
  onToggle?: () => void;
}

export default function WeatherForecastWidget({
  expanded = false,
  onToggle,
}: WeatherForecastWidgetProps) {
  const { weather, loading, error } = useWeather();

  const getConditionIcon = (precipitation: number) => {
    if (precipitation < 20) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (precipitation < 50) return <Cloud className="w-6 h-6 text-gray-500" />;
    return <CloudRain className="w-6 h-6 text-blue-600" />;
  };

  if (loading) {
    return (
      <motion.div
        className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl p-4 shadow-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="animate-pulse text-sm text-white/90">Loading forecast…</div>
      </motion.div>
    );
  }

  if (error || !weather) {
    return null;
  }

  const { current, forecast } = weather;
  const cta = getDynamicCTA(current);

  if (!expanded) {
    return (
      <button
        onClick={onToggle}
        className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl px-4 py-3 shadow-2xl hover:brightness-110 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <div className="drop-shadow">{getConditionIcon(current.precipitation)}</div>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">🌴 Ambergris Caye Forecast</p>
            <p className="text-xs text-white/80">Tap for 5-day vibes</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-extrabold text-white drop-shadow">{Math.round(current.high)}°</p>
            <p className="text-xs text-white/80">{current.windSpeed} mph</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl p-6 shadow-2xl max-w-4xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="absolute inset-0 opacity-25"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05), rgba(255,255,255,0.35))',
          backgroundSize: '200% 200%',
        }}
      />

      <div className="relative">
      <div className="flex justify-between items-center gap-4 mb-6">
        <div>
          <h3 className="text-3xl font-extrabold text-white drop-shadow flex items-center gap-3">
            🌴 5-Day Forecast <span className="text-yellow-300">— Let’s Go!</span>
          </h3>
          <p className="text-sm text-white/85">San Pedro vibes — updated hourly</p>
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            className="text-white/90 hover:text-white hover:bg-white/15 rounded-full p-2 transition"
            aria-label="Close weather"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mb-4">
        <LiaWeatherCommentary />
      </div>

      <div className="mb-6 p-5 bg-white/15 rounded-2xl border border-white/20">
        <p className="text-base font-semibold text-white drop-shadow">{cta}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <motion.div
          className={`lg:col-span-2 rounded-2xl p-6 shadow-xl border transition-all backdrop-blur-sm ${
            current.isOptimal
              ? 'bg-white/25 border-yellow-300/60'
              : 'bg-white/15 border-white/25'
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(255,255,255,0.25)' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white/90 uppercase tracking-wide">Today 🌊</p>
            {current.isOptimal && (
              <span className="text-xs font-semibold text-yellow-900 bg-yellow-300 px-2 py-1 rounded-full">
                Perfect Day 🔥
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <div className="drop-shadow">{getConditionIcon(current.precipitation)}</div>
            </div>
            <div className="min-w-0">
              <p className="text-5xl font-extrabold text-white leading-none drop-shadow">{Math.round(current.high)}°</p>
              <p className="text-base text-white/90 mt-2">High {Math.round(current.high)}° / Low {Math.round(current.low)}°</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/15 p-3">
              <p className="text-sm text-white/80">Wind</p>
              <p className="text-base font-semibold text-white">{current.windSpeed} mph</p>
            </div>
            <div className="rounded-xl bg-white/15 p-3">
              <p className="text-sm text-white/80">Rain chance</p>
              <p className="text-base font-semibold text-white">{current.precipitation}%</p>
            </div>
            {typeof current.waveHeight === 'number' && (
              <div className="rounded-xl bg-white/15 p-4 col-span-2">
                <p className="text-sm text-white/80">Seas</p>
                <p className="text-base font-semibold text-cyan-100">{current.waveHeight} ft</p>
              </div>
            )}
          </div>
        </motion.div>

        {forecast.slice(0, 4).map((day) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <motion.div
              key={day.date}
              className={`rounded-2xl p-5 shadow-lg border backdrop-blur-sm bg-white/15 border-white/25 transition-all ${
                day.isOptimal ? 'ring-2 ring-yellow-300/70' : ''
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.3)' }}
            >
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-yellow-200 uppercase tracking-wide">{dayName}</p>
                {day.isOptimal && (
                  <span className="text-[10px] font-semibold text-yellow-900 bg-yellow-300 px-2 py-1 rounded-full">
                    Ideal
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <div className="drop-shadow">{getConditionIcon(day.precipitation)}</div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white drop-shadow">{Math.round(day.high)}°</p>
                  <p className="text-sm text-white/85">Wind {day.windSpeed} mph</p>
                </div>
              </div>

              <div className="mt-3 text-base text-white/90">
                <p>High {Math.round(day.high)}° / Low {Math.round(day.low)}°</p>
                <div className="text-sm text-white/85 mt-2 space-y-1">
                  <p>Rain {day.precipitation}%</p>
                  {typeof day.waveHeight === 'number' && <p className="text-cyan-100 font-semibold">Seas {day.waveHeight} ft</p>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      </div>
    </motion.div>
  );
}

