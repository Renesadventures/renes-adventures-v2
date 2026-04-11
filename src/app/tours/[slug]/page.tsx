/**
 * TOUR LANDING PAGE TEMPLATE
 *
 * ⚠️ STRUCTURE IS LOCKED ⚠️
 *
 * This template is based on Reef Fishing page.
 *
 * ALLOWED CHANGES:
 * - Tour content (descriptions, titles)
 * - Images/videos (URLs, captions)
 * - Pricing (amounts, add-ons)
 *
 * NOT ALLOWED:
 * - Section order
 * - Layout structure
 * - Component hierarchy
 * - Add/remove sections
 *
 * Template locked: 2025-02-08
 * Reference: /tours/reef-fishing
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  Anchor,
  Camera,
  Fish,
  ShieldCheck,
  FileText,
  Shirt,
  Sun,
  User,
  Utensils,
  Waves,
} from 'lucide-react';
import { tours } from '@/data/tours';
import { TOUR_ADDONS } from '@/data/tour-addons';
import { SafeImage, TourGuestGallery, TourHeroMedia, TourInteractivePortals } from './TourLandingLightClient';

const r2 = (folder: string, file: string) =>
  `https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/${folder}/${file}`;

const WHY_COPY: Record<string, { headline: string; sub: string }> = {
  'deep-sea-fishing': {
    headline: 'Why This Trip Hits Different',
    sub: 'Open water. Big game. No tourist crowds. Just you, the crew, and whatever is running today.',
  },
  'sunset-cruise': {
    headline: 'Why This Sunset Stays With You',
    sub: 'Belize has roughly 300 days of sunshine a year. This is how you end the best one.',
  },
  'blue-hole-adventure': {
    headline: 'Why People Fly Across the World for This',
    sub: 'There are seven underwater wonders of the world. One of them is two hours from San Pedro.',
  },
  'blue-hole': {
    headline: 'Why People Fly Across the World for This',
    sub: 'There are seven underwater wonders of the world. One of them is two hours from San Pedro.',
  },
  'secret-beach': {
    headline: 'Why the Locals Keep This One Quiet',
    sub: 'Most tourists never find it. You will — and you will understand immediately why it has that name.',
  },
  'custom-charter': {
    headline: 'Why No Two Days Look the Same',
    sub: 'You pick the activities. Rene picks the spots. The Caribbean does the rest.',
  },
};

const TOUR_STORY: Record<string, string> = {
  'deep-sea-fishing': `The captain doesn't explain where he's taking you. He just opens the throttle.
Two miles out, the reef drops away and the color of the water changes — from turquoise to something darker, deeper, alive.
Out here, mahi-mahi run in packs. Barracuda patrol the drop-offs. The rod bends before you're ready.
This isn't a fishing trip. It's a reckoning.`,

  'sunset-cruise': `At 6pm, something happens to the light in Belize.
The sky stops being blue and starts being something else entirely — gold and crimson and a color you don't have a word for.
You are on the water when it happens. Drink in hand. No agenda.
Some people take photos. Most just watch. Nobody talks much.
They don't need to.`,

  'blue-hole-adventure': `You've seen the satellite image. The perfect circle of darkness in the middle of a turquoise sea.
What the image doesn't tell you: it takes two hours to get there. Open ocean. Flying fish jumping the bow. Nothing on the horizon.
Then it appears.
You anchor at the edge. You look down. The water goes from clear to black in seconds.
Three hundred meters of nothing below you.
You jump anyway.`,

  'blue-hole': `You've seen the satellite image. The perfect circle of darkness in the middle of a turquoise sea.
What the image doesn't tell you: it takes two hours to get there. Open ocean. Flying fish jumping the bow. Nothing on the horizon.
Then it appears.
You anchor at the edge. You look down. The water goes from clear to black in seconds.
Three hundred meters of nothing below you.
You jump anyway.`,

  'secret-beach': `Most tourists in San Pedro never find it.
They stay on the main strip, hit the same bars, take the same photos. They leave thinking they've seen Belize.
They haven't.
Secret Beach is on the other side of the island. Shallow, warm, and so clear you can read the sand through six feet of water.
There are no crowds. There are beach bars. There is a boat ride to get there that most people will tell you was the best part.
Don't tell too many people.`,

  'custom-charter': `Rene grew up on these waters.
Not visiting. Not working. Growing up — learning every reef, every current, every spot where the fish run and the lobster hide.
When you book a custom charter, you're not buying a tour. You're borrowing his island for a day.
Spearfishing at dawn. Snorkeling Hol Chan at noon. A beach BBQ on a strip of sand with no name on any map.
No two days look the same. That's the point.`,
};

const REVIEWS: Record<string, { quote: string; author: string; location: string }[]> = {
  'deep-sea-fishing': [
    {
      quote:
        'We had mahi-mahi on the line before 8am. Rene knew exactly where to go. Best fishing day of my life, no contest.',
      author: 'Marcus T.',
      location: 'Houston, TX',
    },
    {
      quote:
        'Three of us went full day. The crew was incredible — patient with beginners, kept the experienced guys challenged. Serious haul.',
      author: 'Jake & Crew',
      location: 'Chicago, IL',
    },
    {
      quote:
        "I've chartered in Florida, Costa Rica, and the Bahamas. This was the most personal and the water was unreal. Already planning my return.",
      author: 'Sandra R.',
      location: 'Miami, FL',
    },
  ],
  'sunset-cruise': [
    {
      quote:
        'We popped champagne as the sun went down over the Caribbean. I proposed right there on the boat. She said yes. René made it perfect.',
      author: 'Daniel M.',
      location: 'New York, NY',
    },
    {
      quote:
        "I wasn't expecting much from a sunset cruise but this completely rewrote what that means. The colors, the calm water — I didn't want it to end.",
      author: 'Priya K.',
      location: 'Toronto, Canada',
    },
    {
      quote:
        'Our group of 6 did this on our last night in Belize. Everyone agreed it was the best night of the whole trip. Worth every penny.',
      author: 'The Ortega Family',
      location: 'San Diego, CA',
    },
  ],
  'blue-hole-adventure': [
    {
      quote:
        "You hear about the Blue Hole, you see photos — nothing prepares you. Looking down into that dark blue is something I'll carry forever.",
      author: 'Thomas W.',
      location: 'London, UK',
    },
    {
      quote:
        'The boat ride alone is worth it. Two hours across open water to get there, and you feel every mile. Then you see it.',
      author: 'Camille D.',
      location: 'Paris, France',
    },
    {
      quote: "Rene's crew knew every reef on the way back. We snorkeled three spots after the Blue Hole. Full day, full value.",
      author: 'Kevin & Amy S.',
      location: 'Austin, TX',
    },
  ],
  'blue-hole': [
    {
      quote:
        "You hear about the Blue Hole, you see photos — nothing prepares you. Looking down into that dark blue is something I'll carry forever.",
      author: 'Thomas W.',
      location: 'London, UK',
    },
    {
      quote:
        'The boat ride alone is worth it. Two hours across open water to get there, and you feel every mile. Then you see it.',
      author: 'Camille D.',
      location: 'Paris, France',
    },
    {
      quote: "Rene's crew knew every reef on the way back. We snorkeled three spots after the Blue Hole. Full day, full value.",
      author: 'Kevin & Amy S.',
      location: 'Austin, TX',
    },
  ],
  'secret-beach': [
    {
      quote:
        "This ended up being the highlight of our whole Belize trip. The water at Secret Beach looks photoshopped. It's that clear.",
      author: 'Mia L.',
      location: 'Atlanta, GA',
    },
    {
      quote:
        'Kids loved it, adults loved it. The boat ride over is half the fun. We stayed at the beach bars way longer than planned.',
      author: 'The Williams Family',
      location: 'Phoenix, AZ',
    },
    {
      quote:
        "Go slow — that's the vibe and they mean it. Turquoise water, cold drink, nothing to do. Exactly what I needed.",
      author: 'James O.',
      location: 'Seattle, WA',
    },
  ],
  'custom-charter': [
    {
      quote:
        'Absolutely unreal day. We did spearfishing, snorkeled Hol Chan, hand-fed tarpons, and finished with a beach BBQ. Rene made it feel like his island.',
      author: 'Carlos M.',
      location: 'Dallas, TX',
    },
    {
      quote:
        "I've done a lot of charters. This was the first time the captain actually felt like a friend. He took us places no tour would go.",
      author: 'Rachel B.',
      location: 'Boston, MA',
    },
    {
      quote:
        "The beach BBQ alone was worth the trip. Fresh catch, lobster, ceviche on a deserted beach. I genuinely didn't want to leave.",
      author: 'The Park Family',
      location: 'Los Angeles, CA',
    },
  ],
};

const TOUR_WHY_CARDS: Record<string, { title: string; body: string; icon: string; image: string }[]> = {
  'deep-sea-fishing': [
    { title: 'Your Catch', body: 'We run past the reef to where the big fish hunt. Open water, no crowds, serious action.', icon: 'Fish', image: r2('Deep%20Sea%20Fishing', '1-deep-sea-unforgettable-your-catch.jpg') },
    { title: 'Captain Knowledge', body: "René's crew knows every channel, every migration pattern. They don't guess — they know.", icon: 'ShieldCheck', image: r2('Deep%20Sea%20Fishing', '2-deep-sea-unforgettable-captain-knowledge.jpg') },
    { title: 'Camera Moments', body: 'We position you for the "wow" clip, not just the safe shot.', icon: 'Camera', image: r2('Deep%20Sea%20Fishing', '11-deep-sea-gallery.jpg') },
  ],
  'secret-beach': [
    { title: 'The Water', body: 'So clear you can read the sand through six feet of it. Warm, shallow, and impossibly turquoise.', icon: 'Waves', image: r2('Secrete%20Beach', '1-secrete-beach-unforgettable-the-water.png') },
    { title: 'The Vibe', body: 'Beach bars with cold drinks. No agenda. No pressure. Just island time at its purest.', icon: 'Sun', image: r2('Secrete%20Beach', '2-secrete-beach-unforgettable-the-vibe.png') },
    { title: 'The Ride', body: 'Getting there is half the fun — a boat ride through the lagoon that most people say was the highlight.', icon: 'Anchor', image: r2('Secrete%20Beach', '3-secrete-beach-unforgettable-the-ride.png') },
  ],
  'blue-hole': [
    { title: 'The Scale', body: 'Over 1,000 feet across and 400 feet deep. You can see it from space. You need to see it from the water.', icon: 'Waves', image: r2('Blue%20Hole', '1-blue-hole-unforgettable-the-scale.png') },
    { title: 'The Journey', body: 'Two hours of open Caribbean. Flying fish, dolphins on good days. The ride is part of the story.', icon: 'Anchor', image: r2('Blue%20Hole', '2-blue-hole-unforgettable-the-journey.png') },
    { title: 'The Reef Stops', body: "You don't just see the Hole. The crew stops at world-class reef on the way back. Full day, full value.", icon: 'Camera', image: r2('Blue%20Hole', '3-blue-hole-unforgettable-the-reef-stops.jpg') },
  ],
  'sunset-cruise': [
    { title: 'The Light', body: "Belize gets 300 days of sunshine. The last hour of each one paints the sky in colors that don't have names.", icon: 'Sun', image: r2('Sunset%20Cruise', '1-sunset-why-unforgettable-the-light.png') },
    { title: 'The Quiet', body: 'No itinerary. No stops unless you want one. Just open water and the kind of silence you forgot existed.', icon: 'Waves', image: r2('Sunset%20Cruise', '2-sunset-why-unforgettable-the-quite.png') },
    { title: 'The Moment', body: "Whether it's a proposal, anniversary, or just a Tuesday — this is how you remember it.", icon: 'Camera', image: r2('Sunset%20Cruise', '3-sunset-why-unforgettable-the-moment.png') },
  ],
};

const TOUR_FLOW: Record<string, { title: string; body: string; image: string }[]> = {
  'deep-sea-fishing': [
    { title: 'Launch', body: "Board at dawn. Gear is rigged. Cooler is full. The crew briefs you on what's running.", image: r2('Deep%20Sea%20Fishing', '1-deep-sea-your-boat-launch.png') },
    { title: 'The Hunt', body: 'Past the reef, lines go in. First strike could come in minutes. Reel, fight, land, repeat.', image: r2('Deep%20Sea%20Fishing', '2-deep-sea-your-boat-hunt.png') },
    { title: 'The Payoff', body: "Catch cleaned on the dock. Photos with your haul. The kind of day you don't shut up about.", image: r2('Deep%20Sea%20Fishing', '3-deep-sea-your-boat-the-payoff.png') },
  ],
  'secret-beach': [
    { title: 'Depart', body: 'Board the boat in San Pedro. The lagoon ride starts the day with wind and water.', image: r2('Secrete%20Beach', '1-secrete-beach-your-boat-depart.png') },
    { title: 'Arrive', body: 'Step off into knee-deep crystal. Pick your spot. Bar to the left, open water to the right.', image: r2('Secrete%20Beach', '2-secrete-beach-your-boat-arrive.png') },
    { title: 'Stay', body: 'There is no rush. Swim, eat, drink, float. Time works differently here.', image: r2('Secrete%20Beach', '3-secrete-beach-your-boat-stay.JPG') },
  ],
  'blue-hole': [
    { title: 'Dawn', body: 'Early departure. The ocean is calm. Two hours of open water ahead.', image: r2('Blue%20Hole', '1-blue-hole-your-boat-dawn.png') },
    { title: 'Arrival', body: "You see the color change from the boat. Dark blue, then darker. You're here.", image: r2('Blue%20Hole', '2-blue-hole-your-boat-arrival.png') },
    { title: 'Return', body: 'Reef stops on the way back. Snorkeling, photos, stories. You arrive home changed.', image: r2('Blue%20Hole', '3-blue-hole-your-boat-return.jpg') },
  ],
  'sunset-cruise': [
    { title: 'Board', body: 'Step on around 6 PM. Drinks are ready. The crew knows the drill.', image: r2('Sunset%20Cruise', '1-sunset-your-boat-board.png') },
    { title: 'Drift', body: 'Out past the docks, into open water. The sun starts its show. You watch.', image: r2('Sunset%20Cruise', '2-sunset-your-boat-drift.png') },
    { title: 'Return', body: 'The sky fades from gold to violet. You cruise back slow. Nobody wants it to end.', image: r2('Sunset%20Cruise', '3-sunset-your-boat-return.png') },
  ],
};

const TOUR_GALLERY: Record<string, string[]> = {
  'deep-sea-fishing': [
    r2('Deep%20Sea%20Fishing', '1-deep-sea-hero.jpg'),
    r2('Deep%20Sea%20Fishing', '2-deep-sea-hero.jpg'),
    r2('Deep%20Sea%20Fishing', '3-deep-sea-hero.jpg'),
    r2('Deep%20Sea%20Fishing', '4-deep-sea-hero.jpg'),
    r2('Deep%20Sea%20Fishing', '11-deep-sea-gallery.jpg'),
    r2('Deep%20Sea%20Fishing', '1-deep-sea-unforgettable-your-catch.jpg'),
    r2('Deep%20Sea%20Fishing', '2-deep-sea-unforgettable-captain-knowledge.jpg'),
    r2('Deep%20Sea%20Fishing', '1-deep-sea-your-boat-launch.png'),
    r2('Deep%20Sea%20Fishing', '2-deep-sea-your-boat-hunt.png'),
    r2('Deep%20Sea%20Fishing', '3-deep-sea-your-boat-the-payoff.png'),
  ],
  'secret-beach': [
    r2('Secrete%20Beach', 'screte-beach-gallery-1.jpg'),
    r2('Secrete%20Beach', 'screte-beach-gallery-2.jpg'),
    r2('Secrete%20Beach', 'screte-beach-gallery-3.jpg'),
    r2('Secrete%20Beach', 'screte-beach-gallery-4.jpg'),
    r2('Secrete%20Beach', 'screte-beach-gallery-5.jpg'),
    r2('Secrete%20Beach', 'screte-beach-gallery-6.jpg'),
    r2('Secrete%20Beach', 'screte-beach-gallery-7.png'),
    r2('Secrete%20Beach', 'screte-beach-gallery-8.png'),
    r2('Secrete%20Beach', 'screte-beach-gallery-9.JPG'),
    r2('Secrete%20Beach', 'screte-beach-gallery-10.png'),
  ],
  'blue-hole': [
    r2('Blue%20Hole', 'blue-hole-gallery.png'),
    r2('Blue%20Hole', 'blue-hole-gallery-2.jpg'),
    r2('Blue%20Hole', 'blue-hole-gallery-3.jpg'),
    r2('Blue%20Hole', '1-blue-hole-hero.png'),
    r2('Blue%20Hole', '2-blue-hole-hero.png'),
    r2('Blue%20Hole', '3-blue-hole-hero.png'),
    r2('Blue%20Hole', '4-blue-hole-hero.jpg'),
    r2('Blue%20Hole', '1-blue-hole-unforgettable-the-scale.png'),
    r2('Blue%20Hole', '2-blue-hole-unforgettable-the-journey.png'),
    r2('Blue%20Hole', '3-blue-hole-unforgettable-the-reef-stops.jpg'),
  ],
  'sunset-cruise': [
    r2('Sunset%20Cruise', '1-sunset-hero.jpg'),
    r2('Sunset%20Cruise', '2-sunset-hero.jpg'),
    r2('Sunset%20Cruise', '3-sunset-hero.jpg'),
    r2('Sunset%20Cruise', '4-sunset-hero.jpg'),
    r2('Sunset%20Cruise', '1-sunset-why-unforgettable-the-light.png'),
    r2('Sunset%20Cruise', '2-sunset-why-unforgettable-the-quite.png'),
    r2('Sunset%20Cruise', '3-sunset-why-unforgettable-the-moment.png'),
    r2('Sunset%20Cruise', '1-sunset-your-boat-board.png'),
    r2('Sunset%20Cruise', '2-sunset-your-boat-drift.png'),
    r2('Sunset%20Cruise', '3-sunset-your-boat-return.png'),
  ],
};

const TOUR_HERO_MEDIA: Record<string, { video: string; images: string[] }> = {
  'deep-sea-fishing': {
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/deep-sea-fishing.mp4',
    images: [
      r2('Deep%20Sea%20Fishing', '1-deep-sea-hero.jpg'),
      r2('Deep%20Sea%20Fishing', '2-deep-sea-hero.jpg'),
      r2('Deep%20Sea%20Fishing', '3-deep-sea-hero.jpg'),
      r2('Deep%20Sea%20Fishing', '4-deep-sea-hero.jpg'),
    ],
  },
  'secret-beach': {
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/secrete-beach-three.mp4',
    images: [
      r2('Secrete%20Beach', '1-secrete-beach-hero.png'),
      r2('Secrete%20Beach', '2-secrete-beach-hero.jpg'),
      r2('Secrete%20Beach', '3-secrete-beach-hero.jpg'),
      r2('Secrete%20Beach', '4-secrete-beach-hero.jpg'),
    ],
  },
  'blue-hole': {
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/great-blue-hole.mp4',
    images: [
      r2('Blue%20Hole', '1-blue-hole-hero.png'),
      r2('Blue%20Hole', '2-blue-hole-hero.png'),
      r2('Blue%20Hole', '3-blue-hole-hero.png'),
      r2('Blue%20Hole', '4-blue-hole-hero.jpg'),
    ],
  },
  'sunset-cruise': {
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/sunset-proposal.mp4',
    images: [
      r2('Sunset%20Cruise', '1-sunset-hero.jpg'),
      r2('Sunset%20Cruise', '2-sunset-hero.jpg'),
      r2('Sunset%20Cruise', '3-sunset-hero.jpg'),
      r2('Sunset%20Cruise', '4-sunset-hero.jpg'),
    ],
  },
};

const REVIEW_IMAGES: Record<string, string[]> = {
  'deep-sea-fishing': [
    r2('Deep%20Sea%20Fishing', '1-deep-sea-stories-marcus.png'),
    r2('Deep%20Sea%20Fishing', '2-deep-sea-stories-jake.png'),
    r2('Deep%20Sea%20Fishing', '3-deep-sea-stories-sandra.png'),
  ],
  'secret-beach': [
    r2('Secrete%20Beach', '1-secrete-beach-stories-mia.png'),
    r2('Secrete%20Beach', '2-secrete-beach-stories-williams.png'),
    r2('Secrete%20Beach', '3-secrete-beach-stories-james.png'),
  ],
  'blue-hole': [
    r2('Blue%20Hole', '1-blue-hole-stories-thomas.png'),
    r2('Blue%20Hole', '2-blue-hole-stories-Camille.png'),
    r2('Blue%20Hole', '3-blue-hole-stories-Kevin.png'),
  ],
  'sunset-cruise': [
    r2('Sunset%20Cruise', '1-sunset-stories-daniel.png'),
    r2('Sunset%20Cruise', '2-sunset-stories-priya.png'),
    r2('Sunset%20Cruise', '3-sunset-stories-ortega.png'),
  ],
};

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

/**
 * 🔒 STANDARDIZED ICON MAPPING
 * Each category ALWAYS uses the same icon, regardless of tour.
 */
function itemIconFor(text: string) {
  const lower = text.toLowerCase();

  // CREW/PEOPLE/GUIDES - ALWAYS User icon (blue gradient)
  if (
    lower.includes('crew') ||
    lower.includes('captain') ||
    lower.includes('experienced') ||
    lower.includes('guide') ||
    lower.includes('instructor')
  ) {
    return { Icon: User, gradient: 'from-blue-400 to-blue-600' };
  }

  // FISHING GEAR/BAIT/TACKLE - ALWAYS Fish icon (indigo/purple gradient)
  if (
    lower.includes('bait') ||
    lower.includes('license') ||
    lower.includes('tackle') ||
    lower.includes('rod') ||
    lower.includes('reel') ||
    lower.includes('gear') ||
    lower.includes('fishing equipment')
  ) {
    return { Icon: Fish, gradient: 'from-indigo-400 to-purple-600' };
  }

  // SNORKELING/WATER ACTIVITIES - ALWAYS Waves icon (cyan gradient)
  if (lower.includes('snorkel') || lower.includes('mask') || lower.includes('fins') || lower.includes('world-class site')) {
    return { Icon: Waves, gradient: 'from-cyan-400 to-teal-600' };
  }

  // FOOD/DRINKS/BEVERAGES - ALWAYS Utensils icon (orange/red gradient)
  if (
    lower.includes('champagne') ||
    lower.includes('wine') ||
    lower.includes('beverage') ||
    lower.includes('waterfront stop') ||
    lower.includes('crystal-clear') ||
    lower.includes('turquoise waters') ||
    lower.includes('water') ||
    lower.includes('lunch') ||
    lower.includes('snack') ||
    lower.includes('rum')
  ) {
    return { Icon: Utensils, gradient: 'from-orange-400 to-red-500' };
  }

  // SUN PROTECTION - ALWAYS Sun icon (yellow gradient)
  if (lower.includes('sunscreen') || lower.includes('reef-safe') || lower.includes('sunglasses') || lower.includes('polarized')) {
    return { Icon: Sun, gradient: 'from-yellow-400 to-amber-500' };
  }

  // CLOTHING/SWIMWEAR - ALWAYS Shirt icon (cyan gradient)
  if (lower.includes('swimwear') || lower.includes('towel') || lower.includes('swim') || lower.includes('clothing')) {
    return { Icon: Shirt, gradient: 'from-cyan-400 to-teal-500' };
  }

  // CAMERA/PHOTOS - ALWAYS Camera icon (orange/red gradient)
  if (lower.includes('camera') || lower.includes('waterproof') || lower.includes('photo')) {
    return { Icon: Camera, gradient: 'from-orange-500 to-red-600' };
  }

  // CASH/DOCUMENTS - ALWAYS FileText icon (green gradient)
  if (
    lower.includes('cash') ||
    lower.includes('card') ||
    lower.includes('some stops') ||
    lower.includes('wallet') ||
    lower.includes('id')
  ) {
    return { Icon: FileText, gradient: 'from-green-400 to-emerald-600' };
  }

  // EVERYTHING ELSE (species, locations, activities, etc.) - ALWAYS Anchor icon (gray gradient)
  return { Icon: Anchor, gradient: 'from-slate-500 to-slate-700' };
}

function GlassIcon({
  Icon,
  gradient,
}: {
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  gradient: string;
}) {
  return (
    <div
      className={`
        relative h-11 w-11 rounded-xl
        bg-gradient-to-br ${gradient}
        flex items-center justify-center
        backdrop-blur-sm bg-opacity-90
        shadow-lg shadow-black/10
        ring-1 ring-white/20
      `}
    >
      <Icon className="h-5 w-5 text-white drop-shadow-sm" strokeWidth={2.5} />
    </div>
  );
}

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const tour = tours.find((t) => t.slug === slug);
  if (!tour) notFound();

  const addOns = TOUR_ADDONS;

  const lowestPrice = tour.fullDayPrice ? Math.min(tour.price, tour.fullDayPrice) : tour.price;

  const fallbackGallery = [
    tour.imageUrl,
    '/images/tours/hol-chan-snorkel.jpg',
    '/images/tours/beach-bbq.jpg',
    '/images/tours/sunset-cruise.jpg',
    '/images/tours/full-day-ultimate.jpg',
  ];

  const heroMedia = TOUR_HERO_MEDIA[slug] || null;
  const reviewImages = REVIEW_IMAGES[slug] || [];
  const galleryImages = TOUR_GALLERY[slug] || fallbackGallery;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0FDFF] via-white to-[#FFF7ED] text-slate-900">
      <TourHeroMedia tour={tour} lowestPrice={lowestPrice} fallbackImages={fallbackGallery} heroMedia={heroMedia} />

      <TourInteractivePortals tour={tour} addOns={addOns} />

      <section className="mx-auto w-full max-w-screen-2xl px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-amber-50" />
              <div className="relative max-w-4xl">
                <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Discovery Summary</div>
                <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">A day that feels like a documentary</h2>
                <div className="mt-5 grid gap-4 text-lg text-slate-700 leading-relaxed">
                  <p className="whitespace-pre-line">{TOUR_STORY[slug] ?? TOUR_STORY['custom-charter']}</p>
                </div>
              </div>
            </section>

            <div className="h-10" />

            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#060608] p-8 shadow-sm">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black via-black to-slate-900" />
              <div className="relative">
                <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Why Unforgettable</div>
                {(() => {
                  const whyCopy = WHY_COPY[slug] ?? WHY_COPY['custom-charter'];
                  return (
                    <>
                      <h2
                        className="text-3xl md:text-4xl font-bold text-white mb-3"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {whyCopy.headline}
                      </h2>
                      <p className="text-white/60 text-base max-w-2xl leading-relaxed">{whyCopy.sub}</p>
                    </>
                  );
                })()}

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(TOUR_WHY_CARDS[slug] || [
                    { title: 'Golden Crew', body: 'Local captains and mates who make the whole day feel effortless.', icon: 'ShieldCheck', image: '' },
                    { title: 'Iconic Water', body: 'Belize colors that look edited—but they\'re real.', icon: 'Waves', image: '' },
                    { title: 'Camera Moments', body: 'We position you for the "wow" clip, not just the safe shot.', icon: 'Camera', image: '' },
                  ]).map(({ title, body, icon, image }) => {
                    const IconComponent = icon === 'Fish' ? Fish : icon === 'ShieldCheck' ? ShieldCheck : icon === 'Waves' ? Waves : icon === 'Sun' ? Sun : icon === 'Anchor' ? Anchor : Camera;
                    return (
                      <div key={title} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                        {image && <SafeImage src={image} alt={title} />}
                        <div className="p-6">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
                              <IconComponent className="h-5 w-5 text-amber-700" />
                            </span>
                            <div className="font-extrabold text-slate-900">{title}</div>
                          </div>
                          <div className="mt-3 text-slate-700">{body}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <div className="h-10" />

            <section
              id="highlights"
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-amber-50" />
              <div className="relative">
                <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Your Day. Your Boat. Your Adventure.</div>
                <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">A flow, not a script</h2>
                <p className="mt-5 text-lg text-slate-700 leading-relaxed">
                  You choose the pace. We adjust the route live—fishing, snorkeling, sandbars, food stops, island time. The best days feel effortless.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(TOUR_FLOW[slug] || [
                    { title: 'Start', body: 'Meet the crew, set the vibe, and head out into bright water.', image: '' },
                    { title: 'Peak', body: 'Your highlights—hookups, reef time, beach bars, iconic Belize moments.', image: '' },
                    { title: 'Finish', body: 'Slow cruise back—salt on your skin, camera roll full, already planning the next one.', image: '' },
                  ]).map((card, idx) => (
                    <div key={card.title} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                      {card.image && <SafeImage src={card.image} alt={card.title} />}
                      <div className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center font-black text-amber-700">
                            {idx + 1}
                          </div>
                          <div className="font-extrabold text-slate-900">{card.title}</div>
                        </div>
                        <div className="mt-3 text-slate-700">{card.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="h-10" />

            <TourGuestGallery
              keywords={[slug]}
              fallbackImages={galleryImages}
            />

            <div className="h-10" />

            <section>
              <div id="tour-addons-slot" />
            </section>

            <div className="h-10" />

            <section className="grid md:grid-cols-2 gap-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-6">What&apos;s Included</h3>
                <ul className="space-y-4">
                  {tour.features.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <GlassIcon {...itemIconFor(item)} />
                      <div className="pt-1">
                        <div className="text-slate-800 font-semibold">{item}</div>
                        <div className="text-slate-600 text-sm">Included for a smooth, premium day.</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-4 text-sm text-slate-700">
                  <div className="font-extrabold text-slate-900">Included With All Trips</div>
                  <div className="mt-2">All trips include water, sodas, snacks, rum punch, rods, tackle, and fishing licenses.</div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-6">What to Bring</h3>
                <ul className="space-y-4">
                  {['Reef-safe sunscreen', 'Swimwear & towel', 'Polarized sunglasses', 'Waterproof camera', 'Cash/card (some stops)'].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <GlassIcon {...itemIconFor(item)} />
                      <div className="pt-1">
                        <div className="text-slate-800 font-semibold">{item}</div>
                        <div className="text-slate-600 text-sm">Small thing, big comfort upgrade.</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-4 text-sm text-slate-700">
                  <div className="font-extrabold text-slate-900">Special Requests</div>
                  <div className="mt-2">We&apos;ll do our best to accommodate all preferences. Your requests will be included when you book.</div>
                </div>
              </div>
            </section>

            <div className="h-10" />

            <section id="pricing" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Pricing Information</div>
              {slug === 'blue-hole' ? (
                <>
                  <div className="mt-3 text-slate-700">
                    Full-day adventure to one of the world&apos;s most iconic dive sites. Designed for up to 8 guests.
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-amber-600">Contact for Pricing</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://wa.me/5016273556?text=Hi%20Ren%C3%A9%2C%20I%27m%20interested%20in%20the%20Blue%20Hole%20Adventure.%20Can%20you%20share%20pricing%20details%3F"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition"
                    >
                      💬 WhatsApp Us
                    </a>
                    <a
                      href="mailto:info@renesadventures.tours?subject=Blue%20Hole%20Inquiry"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold transition"
                    >
                      ✉️ Email Us
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-3 text-slate-700">
                    Your private crew, your pace — for up to 4 guests. Bringing more friends? Add up to 4 more at $75/person.
                    <div className="mt-2 text-slate-700">Rates shown do not include 12.5% tax, 6% service fee, or gratuity for your crew.</div>
                  </div>
                  <div className="mt-4 text-slate-700">
                    From <span className="text-3xl font-black text-amber-600">{formatMoney(tour.price)}</span>
                  </div>
                </>
              )}
            </section>

            <div className="h-10" />

            <section id="reviews">
              {(() => {
                const reviews = REVIEWS[slug] ?? REVIEWS['custom-charter'];
                return (
                  <>
              <div className="max-w-3xl">
                <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Real Stories</div>
                <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Guest Experiences</h2>
              </div>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((review, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 border border-white/15 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    {reviewImages[i] && <SafeImage src={reviewImages[i]} alt={review.author} height="h-40" overlay />}
                    <div className="p-6">
                      <div className="flex gap-0.5 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className="text-amber-400 text-base">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-white text-sm leading-relaxed italic">&quot;{review.quote}&quot;</p>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-white font-bold text-sm">{review.author}</p>
                        <p className="text-emerald-400 text-xs mt-0.5">{review.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
                  </>
                );
              })()}
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="hidden lg:block sticky top-24">
              <div id="tour-pricing-slot" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-screen-2xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-10 shadow-sm text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready when you are</h2>
            <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
              {slug === 'blue-hole' ? 'Reach out to discuss your Blue Hole adventure.' : 'Lock in your date, choose your upgrades, and let the crew handle the rest.'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              {slug === 'blue-hole' ? (
                <>
                  <a
                    href="https://wa.me/5016273556?text=Hi%20Ren%C3%A9%2C%20I%27m%20interested%20in%20the%20Blue%20Hole%20Adventure.%20Can%20you%20share%20pricing%20details%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black border border-emerald-600/20 transition inline-flex items-center justify-center"
                  >
                    Contact Us on WhatsApp
                  </a>
                  <a
                    href="mailto:info@renesadventures.tours?subject=Blue%20Hole%20Inquiry"
                    className="h-12 px-6 rounded-2xl border border-slate-200 bg-white text-slate-900 font-extrabold hover:bg-slate-50 transition inline-flex items-center justify-center"
                  >
                    Email Us
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="#tour-pricing-slot"
                    className="h-12 px-6 rounded-2xl bg-amber-400 text-slate-950 font-black border border-black/10 hover:brightness-105 transition inline-flex items-center justify-center"
                  >
                    View Pricing
                  </a>
                  <a
                    href="#tour-addons-slot"
                    className="h-12 px-6 rounded-2xl border border-slate-200 bg-white text-slate-900 font-extrabold hover:bg-slate-50 transition inline-flex items-center justify-center"
                  >
                    Pick Add-Ons
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">More Adventures You&apos;ll Love</h2>
            <p className="mt-4 text-lg text-slate-600">Guests who chose this also chose...</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tours
              .filter((t) => t.slug !== slug)
              .filter((t) => t.slug !== 'custom-charter')
              .slice(0, 4)
              .map((t) => (
                <Link
                  key={t.slug}
                  href={`/tours/${t.slug}`}
                  className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative h-64">
                    <Image
                      src={t.imageUrl}
                      alt={t.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-extrabold text-white mb-2">{t.title}</h3>
                      <div className="text-amber-300 font-bold text-lg">From {formatMoney(t.price)}</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-700 text-sm line-clamp-2 mb-4">{t.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-slate-500">{t.duration}</span>
                      <span className="text-amber-600 font-bold">View Tour →</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
