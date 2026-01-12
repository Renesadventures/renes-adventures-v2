'use client';

import { useMemo } from 'react';
import { useWeather } from '@/hooks/useWeather';

type Recommendation = {
  headline: string;
  message: string;
  ctaLabel: string;
  ctaMessage: string;
};

export default function LiaWeatherCommentary() {
  const { weather, loading, error } = useWeather();

  const recommendation = useMemo<Recommendation | null>(() => {
    if (!weather) return null;

    const current = weather.current;
    const temp = Math.round(current.high);
    const wind = current.windSpeed;
    const precip = current.precipitation;

    const calm = wind <= 10;
    const breezy = wind > 10 && wind <= 18;
    const rainy = precip >= 50;

    if (rainy) {
      return {
        headline: "Lia's weather take",
        message: `Rain? No stress, man 🌧️🌴 We can keep it protected today — or tomorrow looks like it could pop off. Want me to hold you a morning slot?`,
        ctaLabel: 'Chat with Lia',
        ctaMessage: 'Weather looks rough today — what is the best protected option, and what does tomorrow look like?',
      };
    }

    if (calm && temp >= 78 && temp <= 86) {
      return {
        headline: "Lia's weather take",
        message: `Yo! 🌴 Perfect day to hit the water — light breeze and about ${temp}°F. Deep sea is calling 🎣⚡ Morning or afternoon for you?`,
        ctaLabel: 'Book Deep Sea Fishing',
        ctaMessage: 'I want to book Deep Sea Fishing - Half Day. What times are available?',
      };
    }

    if (breezy) {
      return {
        headline: "Lia's weather take",
        message: `Little wind today 🌊 That means leeward-side magic — tarpon get HUNGRY in this breeze 🎣⚡ How many in your crew?`,
        ctaLabel: 'Ask About Tarpon + Snorkel',
        ctaMessage: 'Tell me about Tarpon Feeding + Snorkel and what time we should go today.',
      };
    }

    return {
      headline: "Lia's weather take",
      message: `Nice vibes today 🌴 I can match the plan to your style. You want snorkeling + wildlife, or fishing + action?`,
      ctaLabel: 'Chat with Lia',
      ctaMessage: 'Based on today’s weather, what should we do today?',
    };
  }, [weather]);

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/30">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="mt-3 h-4 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !weather || !recommendation) {
    return null;
  }

  const openLia = () => {
    window.dispatchEvent(
      new CustomEvent('lia:open', {
        detail: {
          message: recommendation.ctaMessage,
        },
      })
    );
  };

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-belize-turquoise flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">👋</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{recommendation.headline}</p>
          <p className="text-sm text-gray-900 mt-1">{recommendation.message}</p>
          <div className="mt-3">
            <button
              onClick={openLia}
              className="bg-belize-turquoise hover:bg-belize-turquoise/90 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md transition-colors"
            >
              {recommendation.ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
