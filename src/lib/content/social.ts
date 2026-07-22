/**
 * Social content library — platforms, brand voice, R2 footage map, and
 * prompt builders. Single source of truth for the Content Studio.
 */
import { getTourBySlug } from '@/data/tours';

export type Platform = 'instagram' | 'facebook' | 'tiktok' | 'youtube';

export const PLATFORMS: { id: Platform; label: string; kind: 'post' | 'reel' | 'both' }[] = [
  { id: 'instagram', label: 'Instagram', kind: 'both' },
  { id: 'facebook', label: 'Facebook', kind: 'both' },
  { id: 'tiktok', label: 'TikTok', kind: 'reel' },
  { id: 'youtube', label: 'YouTube', kind: 'reel' },
];

export const CONTENT_ANGLES = [
  'The private-boat difference (no crowds, your schedule)',
  'Catch of the day / fishing win',
  'Secret Beach calm water',
  'Sunset cruise romance',
  'Blue Hole bucket-list',
  'Family memory / kids on the boat',
  'All-inclusive, licensed & insured trust',
  'Behind the scenes with Captain Rene',
];

const R2 = 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev';

/** Real footage from the R2 library, mapped to tours — used for authentic reels. */
export const FOOTAGE: Record<string, string[]> = {
  'deep-sea-fishing': [`${R2}/deep-sea-fishing.mp4`, `${R2}/deep-sea-fishing-two.mp4`, `${R2}/speargun-one.mp4`],
  'reef-fishing': [`${R2}/coral-reef.mp4`, `${R2}/lobster.mp4`],
  'secret-beach': [`${R2}/secrete-beach-three.mp4`, `${R2}/star-fish.mp4`],
  'sunset-cruise': [`${R2}/sunset-proposal.mp4`, `${R2}/san-pedro-at-dawn.mp4`],
  'blue-hole': [`${R2}/great-blue-hole.mp4`, `${R2}/blue-hole-two.mp4`, `${R2}/nurse-sharks-and-stingrays.mp4`],
  'custom-charter': [`${R2}/vessel-section-video.mp4`, `${R2}/beach-bbq.mp4`, `${R2}/caye-caulker.mp4`],
};

export function footageForTour(slug: string): string[] {
  return FOOTAGE[slug] ?? FOOTAGE['custom-charter'];
}

export const BRAND_VOICE = `Brand: Rene's Adventures — luxury PRIVATE boat charters on Ambergris Caye, Belize.
Captain Rene, 25 years local, fully licensed and insured. All-inclusive pricing.
Positioning: "Your day, your boat, your legend." No fixed itinerary, no strangers on the boat.
Ideal guest: a traveler who does NOT want a generic cattle-boat tour wasting their one week in Belize.
NEVER use the words "eco-tourism" or "sustainable". Never say "8 person max" — say "designed for up to 8 guests".
Family-friendly. Confident, warm, a little swagger. Never corporate or generic.`;

export function platformGuidance(platform: Platform): string {
  switch (platform) {
    case 'instagram':
      return 'Instagram: a strong 1-line hook, 2-3 short lines, 1-2 tasteful emojis max, end with a soft booking nudge. Then 8-12 relevant hashtags.';
    case 'facebook':
      return 'Facebook: warmer and slightly longer (2-4 sentences), community tone, clear CTA to WhatsApp or the site. 3-5 hashtags.';
    case 'tiktok':
      return 'TikTok: a punchy scroll-stopping hook first, casual and fun, trend-aware, 4-6 hashtags including broad discovery tags.';
    case 'youtube':
      return 'YouTube Shorts: a searchable title-style first line, 1-2 lines of description, 4-6 hashtags.';
  }
}

export function tourContext(slug: string): string {
  const t = getTourBySlug(slug);
  if (!t) return 'A private custom charter in Belize.';
  return `Tour: ${t.title}. ${t.description ?? ''} Price from $${t.fullDayPrice ?? t.price}. Slug: ${t.slug}.`;
}

export function imagePromptFor(slug: string, angle: string): string {
  const t = getTourBySlug(slug);
  const subject = t?.title ?? 'private Belize boat charter';
  return `Cinematic, editorial travel photograph. ${subject} on Ambergris Caye, Belize. ${angle}. Turquoise Caribbean water, golden natural light, luxury private boat, authentic, high-end travel magazine quality, no text, no watermark, photorealistic.`;
}
