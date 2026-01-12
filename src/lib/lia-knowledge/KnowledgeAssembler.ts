import type { Tour } from '@/data/tours';
import type { WeatherForecast } from '@/lib/weather/openweather';
import { getSeasonalFishingIntel } from '@/lib/lia-knowledge/fishing-calendar';
import { getWindGuidance, summarizeWeatherForLia } from '@/lib/lia-knowledge/weather-intelligence';

export type LiaRuntimeContext = {
  pageName?: string;
  selectedTour?: string;
  weather?: unknown;
};

function isWeatherForecastLike(value: unknown): value is Partial<WeatherForecast> {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.date === 'string' ||
    typeof v.windDirection === 'number' ||
    typeof v.windSpeed === 'number' ||
    typeof v.waveHeight === 'number' ||
    typeof v.weatherDescription === 'string' ||
    typeof v.precipitation === 'number' ||
    typeof v.high === 'number' ||
    typeof v.low === 'number'
  );
}

export type KnowledgeAssemblerInput = {
  baseSystemPrompt: string;
  tours: Tour[];
  featuredTours: Tour[];
  context?: LiaRuntimeContext;
};

export class KnowledgeAssembler {
  assemble(input: KnowledgeAssemblerInput): string {
    const { baseSystemPrompt, tours, featuredTours, context } = input;

    const tourContext = `Available Tours:\n${tours
      .map((t) => `- ${t.title} ($${t.price}, ${t.duration}) - ${t.description}`)
      .join('\n')}\n\nFeatured Tours: ${featuredTours.map((t) => t.title).join(', ')}`;

    const now = new Date();
    const seasonal = getSeasonalFishingIntel(now);
    const primarySpecies = seasonal.primary_species || 'Unknown';
    const seasonalBlock = `Seasonal Fishing Calendar (Ambergris Caye / Belize):\n- Current month: ${seasonal.monthName}\n- Notes: ${seasonal.notes.join(' ')}`;

    const seasonalPrimaryBlock = `Primary Species (this month): ${primarySpecies}`;

    const seasonalWindLocationsBlock = `Wind Conditions + Tour Locations (this month):\n- ${seasonal.wind_conditions_and_tour_locations}`;

    const seasonalEffectsBlock = seasonal.effects_on_fishing?.length
      ? `Effects on Fishing (this month):\n- ${seasonal.effects_on_fishing.join('\n- ')}`
      : '';

    const safeWeather = isWeatherForecastLike(context?.weather) ? context?.weather : null;
    const weatherSummary = summarizeWeatherForLia(safeWeather);

    const windInput =
      safeWeather &&
      typeof safeWeather.windDirection === 'number' &&
      typeof safeWeather.windSpeed === 'number'
        ? { windDirection: safeWeather.windDirection, windSpeed: safeWeather.windSpeed }
        : null;

    const wind = getWindGuidance(windInput);
    const windBlock = wind
      ? `Wind-Direction Guide:\n- ${wind.guidance.join('\n- ')}`
      : 'Wind-Direction Guide:\n- No wind direction data available.';

    let contextBlock = '';
    if (context) {
      const lines: string[] = [];
      if (context.pageName) lines.push(`- User is viewing: ${context.pageName}`);
      if (context.selectedTour) lines.push(`- User is interested in: ${context.selectedTour}`);
      if (safeWeather) lines.push(`- Weather (summary): ${weatherSummary}`);
      contextBlock = lines.length ? `Current Context:\n${lines.join('\n')}` : '';
    }

    return [
      baseSystemPrompt,
      tourContext,
      seasonalBlock,
      seasonalPrimaryBlock,
      seasonalWindLocationsBlock,
      seasonalEffectsBlock,
      windBlock,
      contextBlock,
    ]
      .filter(Boolean)
      .join('\n\n');
  }
}
