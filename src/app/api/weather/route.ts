import { NextResponse } from 'next/server';
import { get5DayForecast } from '@/lib/weather/openweather';

export const revalidate = 3600;

export async function GET() {
  try {
    const weatherData = await get5DayForecast();
    return NextResponse.json(weatherData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

