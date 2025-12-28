// OpenWeatherMap API client for Ambergris Caye, Belize
const AMBERGRIS_CAYE_COORDS = { lat: 17.9169, lon: -87.9659 };

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  windSpeed: number;
  windDirection: number;
  waveHeight?: number; // Estimated from wind speed
  weatherIcon: string;
  weatherDescription: string;
  precipitation: number;
  humidity: number;
  isOptimal: boolean; // Best day for tours
}

export interface WeatherData {
  current: WeatherForecast;
  forecast: WeatherForecast[];
}

export async function get5DayForecast(): Promise<WeatherData> {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  
  if (!API_KEY) {
    throw new Error('OPENWEATHER_API_KEY is not configured');
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${AMBERGRIS_CAYE_COORDS.lat}&lon=${AMBERGRIS_CAYE_COORDS.lon}&units=imperial&appid=${API_KEY}`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  // Group by day and create daily summaries
  const dailyData: { [key: string]: any[] } = {};
  
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  const forecast: WeatherForecast[] = Object.keys(dailyData)
    .slice(0, 5)
    .map((date) => {
      const dayData = dailyData[date];
      const temps = dayData.map((d: any) => d.main.temp);
      const winds = dayData.map((d: any) => d.wind.speed);
      const precip = dayData.map((d: any) => d.pop || 0);
      
      const avgWind = winds.reduce((a: number, b: number) => a + b, 0) / winds.length;
      const maxPrecip = Math.max(...precip);
      
      // Estimate wave height (rough calculation: wind speed * 0.5 feet)
      const waveHeight = avgWind * 0.5;
      
      // Optimal conditions: temp 75-85°F, wind < 10mph, no rain
      const isOptimal = 
        temps.some((t: number) => t >= 75 && t <= 85) &&
        avgWind < 10 &&
        maxPrecip < 0.2;

      return {
        date,
        high: Math.max(...temps),
        low: Math.min(...temps),
        windSpeed: Math.round(avgWind),
        windDirection: dayData[0].wind.deg,
        waveHeight: Math.round(waveHeight * 10) / 10,
        weatherIcon: dayData[Math.floor(dayData.length / 2)].weather[0].icon,
        weatherDescription: dayData[Math.floor(dayData.length / 2)].weather[0].description,
        precipitation: Math.round(maxPrecip * 100),
        humidity: dayData[Math.floor(dayData.length / 2)].main.humidity,
        isOptimal,
      };
    });

  return {
    current: forecast[0],
    forecast: forecast.slice(1),
  };
}

