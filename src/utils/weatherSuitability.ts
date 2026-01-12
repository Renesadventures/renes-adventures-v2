import type { WeatherForecast } from '@/lib/weather/openweather';

export type TourType = 'fishing' | 'snorkeling' | 'sunset' | 'blue-hole' | 'secret-beach' | 'all';

export interface TourRecommendation {
  tourType: TourType;
  suitability: 'excellent' | 'good' | 'fair' | 'poor';
  reason: string;
}

export function getWeatherSuitability(
  weather: WeatherForecast,
  tourType: TourType
): TourRecommendation {
  const { windSpeed, precipitation, waveHeight = 0 } = weather;

  // Calm seas (< 10mph wind)
  if (windSpeed < 10 && precipitation < 20) {
    if (tourType === 'snorkeling' || tourType === 'secret-beach' || tourType === 'all') {
      return {
        tourType,
        suitability: 'excellent',
        reason: 'Perfect conditions - calm seas and clear skies',
      };
    }
    return {
      tourType,
      suitability: 'good',
      reason: 'Great conditions for this activity',
    };
  }

  // Moderate seas (10-15mph wind)
  if (windSpeed >= 10 && windSpeed <= 15) {
    if (tourType === 'fishing' || tourType === 'blue-hole') {
      return {
        tourType,
        suitability: 'good',
        reason: 'Good conditions - fish are active',
      };
    }
    if (tourType === 'sunset' || tourType === 'secret-beach') {
      return {
        tourType,
        suitability: 'fair',
        reason: 'Moderate conditions - still enjoyable',
      };
    }
  }

  // Rough seas (> 15mph wind)
  if (windSpeed > 15) {
    if (tourType === 'sunset' || tourType === 'secret-beach') {
      return {
        tourType,
        suitability: 'fair',
        reason: 'Lagoon side recommended - calmer waters',
      };
    }
    return {
      tourType,
      suitability: 'poor',
      reason: 'Rough conditions - consider rescheduling',
    };
  }

  // Rainy conditions
  if (precipitation > 50) {
    if (tourType === 'fishing') {
      return {
        tourType,
        suitability: 'good',
        reason: 'Fish bite in light rain - great fishing!',
      };
    }
    return {
      tourType,
      suitability: 'fair',
      reason: 'Light rain expected - still enjoyable',
    };
  }

  return {
    tourType,
    suitability: 'good',
    reason: 'Good conditions for this activity',
  };
}

export function getDynamicCTA(weather: WeatherForecast): string {
  if (weather.isOptimal) {
    return 'Book Now - Ideal Weather!';
  }
  if (weather.windSpeed < 10 && weather.precipitation < 20) {
    return 'Perfect Conditions - Book Today!';
  }
  if (weather.windSpeed > 15) {
    return 'Blue Hole Recommended (Calmer Waters)';
  }
  if (weather.precipitation > 50) {
    return 'Fishing Still Great! (Fish Bite in Light Rain)';
  }
  return 'Book Your Adventure';
}

