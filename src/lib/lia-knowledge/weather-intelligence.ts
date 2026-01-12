import type { WeatherForecast } from '@/lib/weather/openweather';

export type WindGuidance = {
  directionDegrees: number;
  directionCardinal: string;
  guidance: string[];
};

function toCardinal(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(((degrees % 360) / 45)) % 8;
  return dirs[idx] || 'N';
}

export function getWindGuidance(weather?: Pick<WeatherForecast, 'windDirection' | 'windSpeed'> | null): WindGuidance | null {
  if (!weather || typeof weather.windDirection !== 'number') return null;

  const dir = ((weather.windDirection % 360) + 360) % 360;
  const cardinal = toCardinal(dir);
  const speed = typeof weather.windSpeed === 'number' ? weather.windSpeed : null;

  const guidance: string[] = [];

  guidance.push(`Wind direction: ${cardinal} (${Math.round(dir)}°)`);

  if (speed !== null) {
    guidance.push(`Wind speed: ${Math.round(speed)} mph`);
  }

  // Ambergris Caye simplified local heuristic:
  // - E/NE trade winds can make open water crossings choppy.
  // - Leeward (west) side tends to be calmer; protected reef/lagoon options perform better.
  if (dir >= 30 && dir <= 120) {
    guidance.push('Typical trade-wind direction. Crossings can feel choppy; consider leeward-side routes and earlier departure windows.');
    guidance.push('Good plan-Bs: protected reef fishing, leeward snorkeling, lagoon tarpon.');
  } else if (dir >= 210 && dir <= 300) {
    guidance.push('Westerly winds can flatten the leeward side but may affect specific reef lines; confirm best route with the captain.');
  } else {
    guidance.push('Mixed wind direction. Use wave height + speed to decide between offshore vs sheltered options.');
  }

  return {
    directionDegrees: dir,
    directionCardinal: cardinal,
    guidance,
  };
}

export function summarizeWeatherForLia(weather?: Partial<WeatherForecast> | null): string {
  if (!weather) return 'No weather data provided.';

  const parts: string[] = [];

  if (typeof weather.high === 'number' && typeof weather.low === 'number') {
    parts.push(`Temp: ${Math.round(weather.low)}–${Math.round(weather.high)}°F`);
  }
  if (typeof weather.windSpeed === 'number') {
    parts.push(`Wind: ${Math.round(weather.windSpeed)} mph`);
  }
  if (typeof weather.waveHeight === 'number') {
    parts.push(`Waves: ${weather.waveHeight.toFixed(1)} ft`);
  }
  if (typeof weather.precipitation === 'number') {
    parts.push(`Rain chance: ${Math.round(weather.precipitation)}%`);
  }
  if (typeof weather.weatherDescription === 'string' && weather.weatherDescription.trim()) {
    parts.push(`Sky: ${weather.weatherDescription}`);
  }

  return parts.length ? parts.join(' • ') : 'Weather data provided but incomplete.';
}
