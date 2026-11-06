import { NextResponse } from 'next/server';

type AssetListResponse = {
  images: string[];
  source: 'renes-activities' | 'fallback';
};

const R2_IMAGES_BASE = 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images';

const FALLBACK_IMAGES = [
  '/images/tours/deep-sea-fishing.jpg',
  '/images/tours/reef-fishing.jpg',
  '/images/tours/full-day-ultimate.jpg',
  '/images/tours/hol-chan-snorkel.jpg',
  '/images/tours/beach-bbq.jpg',
  '/images/tours/sunset-cruise.jpg',
];

/**
 * Gallery images live in the R2 bucket. This list used to be read from
 * public/images/renes-activities at runtime, which forced ~95 MB of images into
 * every Vercel deployment and listed 3 files that were never uploaded to R2
 * (broken images on the live site). Every name below was verified 200 on R2.
 */
const R2_ACTIVITY_IMAGES = [
  "beach-bon-fire-two.jpg",
  "beach-bon-fire.jpg",
  "belize-survival-kit.png",
  "boat-cabin.jpg",
  "boat-deck-two.jpg",
  "boat-deck.jpeg",
  "boat-deep-sea-fishing.jpg",
  "boat-family-sunset.png",
  "boat-no-background.png",
  "boat-one.jpeg",
  "boat-snorkeling.jpg",
  "boat-sunset.png",
  "boat-three.jpeg",
  "boat-two.jpeg",
  "captain-rene.jpeg",
  "dont-do-this-in-belize.png",
  "health-and-safety.png",
  "legal-and-immigration.png",
  "Poster_Gemini.png",
  "pre-trip-preparation.png",
  "sunset-your-perfect-belize-day.jpg"
];

export async function GET() {
  const images = R2_ACTIVITY_IMAGES.map((n) => `${R2_IMAGES_BASE}/${encodeURIComponent(n)}`);
  const payload: AssetListResponse = images.length
    ? { images, source: 'renes-activities' }
    : { images: FALLBACK_IMAGES, source: 'fallback' };
  return NextResponse.json(payload, { status: 200 });
}
