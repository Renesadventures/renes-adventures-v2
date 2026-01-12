import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

type AssetListResponse = {
  images: string[];
  source: 'renes-activities' | 'fallback';
};

const FALLBACK_IMAGES = [
  '/images/tours/deep-sea-fishing.jpg',
  '/images/tours/reef-fishing.jpg',
  '/images/tours/full-day-ultimate.jpg',
  '/images/tours/hol-chan-snorkel.jpg',
  '/images/tours/beach-bbq.jpg',
  '/images/tours/sunset-cruise.jpg',
];

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'images', 'renes-activities');
    const entries = await fs.readdir(dir, { withFileTypes: true });

    const images = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((n) => /\.(jpe?g|png|webp)$/i.test(n))
      .map((n) => `/images/renes-activities/${n}`);

    if (images.length === 0) {
      const payload: AssetListResponse = { images: FALLBACK_IMAGES, source: 'fallback' };
      return NextResponse.json(payload, { status: 200 });
    }

    const payload: AssetListResponse = { images, source: 'renes-activities' };
    return NextResponse.json(payload, { status: 200 });
  } catch {
    const payload: AssetListResponse = { images: FALLBACK_IMAGES, source: 'fallback' };
    return NextResponse.json(payload, { status: 200 });
  }
}
