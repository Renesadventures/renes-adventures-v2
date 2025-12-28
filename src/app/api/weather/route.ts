import { NextResponse } from 'next/server';
import { get5DayForecast } from '@/lib/weather/openweather';

export async function GET() {
  try {
    const weatherData = await get5DayForecast();
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

