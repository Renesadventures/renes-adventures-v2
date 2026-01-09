import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { tours, getTourBySlug } from '@/data/tours';
import assetManifest from '@/data/asset-manifest.json';
import TourMediaCarousel from './TourMediaCarousel';
import AskLiaLink from './AskLiaLink';
import CustomAdventureActivities from './CustomAdventureActivities';
import BrochureCta from './BrochureCta';
import BookingEngine from '@/components/booking/BookingEngine';

type Difficulty = 'Easy' | 'Moderate' | 'Advanced';

type ItineraryItem = {
  time: string;
  title: string;
  description: string;
};

type Review = {
  rating: number;
  text: string;
  name?: string;
  author?: string;
  location?: string;
  date?: string;
};

type TourExtras = {
  tagline: string;
  rating: number;
  reviewCount: number;
  difficulty: Difficulty;
  includedHighlights: string[];
  pickup: string;
  languages: string[];
  whyUnforgettable: string;
  itinerary: ItineraryItem[];
  included: string[];
  notIncluded: string[];
  whatToBring: string[];
  reviews: Review[];
  galleryImages: string[];
};

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US')}`;
}

function clampRating(rating: number) {
  return Math.max(0, Math.min(5, rating));
}

function renderStars(rating: number) {
  const full = Math.round(clampRating(rating));
  return Array.from({ length: 5 }, (_, i) => (i < full ? '★' : '☆')).join('');
}

const FLEXIBLE_START_COPY = 'Flexible Start (Morning or Afternoon Ritual - Finalized by Captain 24h prior)';

function getGalleryFromManifest(slug: string, fallbackImageUrl: string) {
  const images = Array.isArray(assetManifest.images)
    ? (assetManifest.images.filter((s) => typeof s === 'string') as string[])
    : [];
  const videos = Array.isArray(assetManifest.videos)
    ? (assetManifest.videos.filter((s) => typeof s === 'string') as string[])
    : [];

  const pool = [...videos, ...images].filter((src) => typeof src === 'string');
  const renes = pool.filter((src) => src.includes('/images/renes-activities/') || src.includes('/videos/'));

  const s = slug.toLowerCase();
  const matchAny = (src: string, keywords: string[]) => {
    const t = src.toLowerCase();
    return keywords.some((k) => t.includes(k));
  };

  let filtered = renes;
  if (s === 'deep-sea-fishing') {
    filtered = renes.filter((src) =>
      matchAny(src, ['deep', 'offshore', 'bluewater', 'wahoo', 'marlin', 'sailfish', 'tuna', 'mahi', 'dorado'])
    );
  } else if (s === 'reef-fishing') {
    filtered = renes.filter((src) => matchAny(src, ['reef', 'snapper', 'grouper', 'barracuda', 'shallow']));
  } else if (s === 'sunset-cruise') {
    filtered = renes.filter((src) => matchAny(src, ['sunset', 'golden', 'champagne', 'cruise']));
  } else if (s === 'secret-beach') {
    filtered = renes.filter((src) => matchAny(src, ['beach', 'secret', 'turquoise', 'island']));
  } else if (s === 'blue-hole-adventure') {
    filtered = renes.filter((src) => matchAny(src, ['blue-hole', 'bluehole', 'snorkel', 'dive', 'reef']));
  } else if (s === 'custom-adventure-bbq') {
    filtered = renes.filter((src) => matchAny(src, ['bbq', 'lobster', 'conch', 'ceviche', 'adventure', 'hol-chan']));
  }

  const finalPool = filtered.length ? filtered : renes.length ? renes : [fallbackImageUrl];
  const isAction = (src: string) => {
    const t = src.toLowerCase();
    return (
      t.includes('action') ||
      t.includes('caught') ||
      t.includes('catch') ||
      t.includes('fight') ||
      t.includes('reel') ||
      t.includes('rod') ||
      t.includes('wahoo') ||
      t.includes('marlin') ||
      t.includes('sailfish') ||
      t.includes('tuna') ||
      t.includes('mahi') ||
      t.includes('dorado') ||
      t.includes('snapper') ||
      t.includes('grouper') ||
      t.includes('barracuda')
    );
  };

  const actionPool = finalPool.filter(isAction);
  const selectionPool = actionPool.length ? actionPool : finalPool;
  const scored = finalPool.map((src) => {
    const seed = `${slug}|${src}`;
    let h = 0;
    for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return { src, score: h };
  });
  scored.sort((a, b) => a.score - b.score);
  const scoredAction = selectionPool.map((src) => {
    const seed = `action|${slug}|${src}`;
    let h = 0;
    for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return { src, score: h };
  });
  scoredAction.sort((a, b) => a.score - b.score);
  const selected = scoredAction.slice(0, 12).map((x) => x.src);
  return selected.length ? selected : [fallbackImageUrl];
}

const DEFAULT_WHAT_TO_BRING = [
  'Sunscreen (reef-safe required)',
  'Sunglasses and hat',
  'Camera/phone in waterproof case',
  'Light jacket for morning',
  'Motion sickness medication (if needed)',
  'Cash for gratuity'
];

const DEFAULT_NOT_INCLUDED = [
  'Gratuity (15-20% recommended)',
  'Alcoholic beverages',
  'Personal items',
  'Travel insurance'
];

const TOUR_EXTRAS_BY_SLUG: Record<string, TourExtras> = {
  'deep-sea-fishing': {
    tagline: 'Big game fishing beyond the reef—where the ocean turns electric.',
    rating: 5.0,
    reviewCount: 127,
    difficulty: 'Moderate',
    includedHighlights: ['Equipment', 'Bait', 'Licenses', 'Guide'],
    pickup: 'San Pedro Hotels',
    languages: ['English', 'Spanish'],
    whyUnforgettable:
      "Imagine leaving the calm turquoise shallows behind and watching the water shift to deep, inky blue as the boat cuts across the Caribbean. The horizon feels endless out here—just you, the captain, the hum of the engine, and the possibility of a screaming reel at any moment. This isn’t a ‘cast-and-wait’ kind of day. It’s a full sensory adventure: salt on your skin, the sun rising higher, and the steady anticipation that the next strike could be the one you’ll talk about for years.\n\nYour crew sets the spread, explains the technique, and keeps everything moving—so first-timers feel confident and seasoned anglers feel right at home. When the bite turns on, it’s pure adrenaline: rods bent, lines tight, and everyone on deck locked into the moment. Between action, you’ll have cold drinks, shade breaks, and plenty of chances for photos with the sea as your backdrop.\n\nWhat makes this tour different is the balance—serious fishing with a relaxed, friendly vibe. Whether you land a trophy fish or not, you’ll come back with stories, laughter, and that rare feeling of having done something truly wild and real.",
    itinerary: [
      {
        time: '7:00 AM',
        title: 'Hotel Pickup',
        description: 'Your captain meets you at your San Pedro hotel.'
      },
      {
        time: '7:30 AM',
        title: 'Departure',
        description: 'Board our 25-foot center-console fishing boat for a quick safety briefing.'
      },
      {
        time: '8:00 AM',
        title: 'Arrive at Fishing Grounds',
        description: 'Head 12 miles offshore and start targeting marlin and sailfish.'
      },
      {
        time: '8:00 AM - 3:00 PM',
        title: 'Fishing Action',
        description: 'Troll for big game fish, light tackle fishing, refreshments on board.'
      },
      {
        time: '3:30 PM',
        title: 'Return to Shore',
        description: 'Catch cleaned and filleted, photo opportunities.'
      },
      {
        time: '4:00 PM',
        title: 'Hotel Drop-off',
        description: 'We take you back to your hotel in San Pedro.'
      }
    ],
    included: [
      'Professional captain and crew',
      'All fishing equipment and bait',
      'Fishing licenses',
      'Refreshments and snacks',
      'Fish cleaning and filleting',
      'Hotel pickup/drop-off',
      'Safety equipment'
    ],
    notIncluded: DEFAULT_NOT_INCLUDED,
    whatToBring: DEFAULT_WHAT_TO_BRING,
    reviews: [
      {
        name: 'Samantha R.',
        rating: 5,
        text: "We booked deep sea and it exceeded expectations. Crew was professional, fun, and we were hooked up all day. Absolute must-do in San Pedro."
      },
      {
        name: 'Mike T.',
        rating: 5,
        text: 'Felt like a private charter experience—great boat, great gear, and constant action. They took care of everything.'
      },
      {
        name: 'Carlos V.',
        rating: 5,
        text: 'Easy pickup, smooth ride out, and we landed fish we never thought we’d see in real life. 10/10.'
      }
    ],
    galleryImages: ['/images/tours/deep-sea-fishing.jpg', '/videos/hero/deep-sea-fishing.mp4']
  },
  'reef-fishing': {
    tagline: 'Discover the vibrant world beneath the Caribbean waves',
    rating: 5.0,
    reviewCount: 127,
    difficulty: 'Easy',
    includedHighlights: ['Equipment', 'Food', 'Guide'],
    pickup: 'All San Pedro hotels',
    languages: ['English', 'Spanish'],
    whyUnforgettable:
      "Cast your line into crystal-clear turquoise waters where the Caribbean Sea meets the second-largest barrier reef in the world. Reef fishing with Rene's Adventures isn't just about catching fish—it's about experiencing Belize's underwater paradise while targeting snapper, grouper, and barracuda in their natural habitat.\n\nOur expert captains know every secret spot along the reef, where the fish are most active and the scenery is breathtaking. Watch schools of tropical fish dart between coral formations as you wait for that telltale tug on your line. Perfect for families and first-timers, reef fishing offers non-stop action in calm, protected waters with the stunning Belizean coast as your backdrop.\n\nWhether you're teaching your kids to fish or looking for a more relaxed alternative to deep-sea fishing, this 6-hour adventure delivers authentic Caribbean fishing with guaranteed catches and unforgettable memories.",
    itinerary: [
      {
        time: '8:00 AM',
        title: 'Hotel Pickup',
        description: 'Meet your captain at your San Pedro accommodation'
      },
      {
        time: '8:30 AM',
        title: 'Safety Briefing',
        description: 'Board the boat, equipment overview, and safety procedures'
      },
      {
        time: '9:00 AM',
        title: 'First Reef Spot',
        description: 'Start fishing near vibrant coral formations'
      },
      {
        time: '9:00 AM - 1:30 PM',
        title: 'Reef Fishing',
        description: 'Target snapper, grouper, and barracuda with multiple reef stops'
      },
      {
        time: '12:00 PM',
        title: 'Lunch Break',
        description: 'Fresh ceviche and refreshments on board'
      },
      {
        time: '2:00 PM',
        title: 'Return to Shore',
        description: 'Catch cleaned and filleted, photos with your fish'
      },
      {
        time: '2:30 PM',
        title: 'Hotel Drop-off',
        description: 'Return to your accommodation with fresh catch'
      }
    ],
    included: [
      'Professional captain and first mate',
      'All fishing rods, reels, and tackle',
      'Fresh bait and lures',
      'Fishing licenses for all guests',
      'Cooler with ice, water, and soft drinks',
      'Fresh ceviche lunch',
      'Fish cleaning and filleting service',
      'Hotel pickup and drop-off in San Pedro',
      'Life jackets and safety equipment',
      'Shaded areas on boat'
    ],
    notIncluded: [
      'Gratuity for crew (15-20% recommended)',
      'Alcoholic beverages (available for purchase)',
      'Underwater camera rental',
      'Personal items and souvenirs',
      'Travel insurance'
    ],
    whatToBring: [
      'Reef-safe sunscreen (mandatory in Belize)',
      'Polarized sunglasses to see fish underwater',
      'Wide-brimmed hat and light long-sleeve shirt',
      'Waterproof phone case for photos',
      'Light jacket for morning breeze',
      'Cash for gratuity and optional purchases'
    ],
    reviews: [
      {
        rating: 5,
        author: 'Thompson Family',
        location: 'Ontario, Canada',
        date: 'November 2024',
        text: 'Perfect family adventure! Our kids (ages 8 and 11) caught their first fish ever. Captain Rene was incredibly patient and made sure everyone had a turn. The ceviche was amazing!'
      },
      {
        rating: 5,
        author: 'Michael R.',
        location: 'Florida, USA',
        date: 'October 2024',
        text: 'Caught a 15lb grouper and several snappers. Calm waters, beautiful reef views, and constant action. Way more fun than I expected!'
      },
      {
        rating: 5,
        author: 'Lisa & James',
        location: 'UK',
        date: 'September 2024',
        text: "We're not experienced fishers but the crew made it so easy. Watching the tropical fish around the boat was worth it alone. Highly recommend!"
      }
    ],
    galleryImages: ['/images/tours/reef-fishing.jpg']
  },
  'sunset-cruise': {
    tagline: 'Romance meets Caribbean paradise',
    rating: 5.0,
    reviewCount: 127,
    difficulty: 'Easy',
    includedHighlights: ['Drinks', 'Appetizers', 'Captain', 'Pickup'],
    pickup: 'All San Pedro hotels',
    languages: ['English', 'Spanish'],
    whyUnforgettable:
      "There's something magical about watching the sun melt into the Caribbean Sea, painting the sky in brilliant oranges, pinks, and purples. Our Sunset Cruise offers the perfect blend of romance, relaxation, and natural beauty—an experience that will become one of your most cherished Belize memories.\n\nGlide across calm turquoise waters as the golden hour transforms San Pedro's coastline into a photographer's dream. Sip champagne or your favorite beverage while gentle waves lap against the hull, and distant island music drifts across the water. Whether you're celebrating an anniversary, honeymoon, proposal, or simply want to unwind after a day of adventure, this 2.5-hour journey offers pure serenity.\n\nWe'll cruise past iconic landmarks, stop at scenic viewpoints for photos, and give you front-row seats to nature's greatest show. Couples love this intimate experience, but it's equally perfect for small groups of friends or family wanting to experience Belize's legendary sunsets from the best vantage point—the water.",
    itinerary: [
      {
        time: '5:30 PM',
        title: 'Hotel Pickup',
        description: 'Pickup from your San Pedro accommodation (flexible timing based on sunset)'
      },
      {
        time: '6:00 PM',
        title: 'Departure',
        description: 'Board the boat, welcome drinks, and safety briefing'
      },
      {
        time: '6:15 PM',
        title: 'Coastal Cruise',
        description: 'Gentle cruise along San Pedro coastline with photo opportunities'
      },
      {
        time: '6:45 PM',
        title: 'Sunset Viewing',
        description: 'Anchor at prime sunset location, enjoy drinks and appetizers'
      },
      {
        time: '7:30 PM',
        title: 'Evening Cruise',
        description: 'Leisurely return under early stars with ambient island music'
      },
      {
        time: '8:00 PM',
        title: 'Return to Shore',
        description: 'Dockside drop-off and hotel transfer'
      }
    ],
    included: [
      'Private boat charter',
      'Professional captain',
      'Welcome champagne or sparkling wine',
      'Selection of beverages (beer, wine, soft drinks)',
      'Light appetizers and fresh fruit',
      'Bluetooth speaker for your music',
      'Hotel pickup and drop-off',
      'Sunset photo assistance',
      'Cozy blankets for evening breeze'
    ],
    notIncluded: [
      'Gratuity for captain (15-20% recommended)',
      'Premium spirits (available upon request)',
      'Dinner (light appetizers provided)',
      'Professional photographer (can be arranged)'
    ],
    whatToBring: [
      'Camera or phone for sunset photos',
      'Light jacket or sweater for evening',
      'Sunglasses for golden hour',
      'Your favorite music playlist (Bluetooth ready)',
      'Cash for gratuity'
    ],
    reviews: [
      {
        rating: 5,
        author: 'David & Sarah',
        location: 'California, USA',
        date: 'December 2024',
        text: 'I proposed during the sunset and she said yes! Captain Rene had champagne ready and took amazing photos for us. Absolutely perfect evening.'
      },
      {
        rating: 5,
        author: 'Martinez Family',
        location: 'Texas, USA',
        date: 'November 2024',
        text: 'Celebrated our 25th anniversary with this cruise. Romantic, peaceful, and the sunset was breathtaking. Better than any restaurant!'
      },
      {
        rating: 5,
        author: 'Emma L.',
        location: 'Australia',
        date: 'October 2024',
        text: 'Solo traveler here—this was the highlight of my trip. Met lovely people, incredible views, and felt so relaxed. Worth every penny!'
      }
    ],
    galleryImages: ['/videos/hero/sunset-ritual.mp4', '/images/tours/sunset-cruise.jpg']
  },
  'blue-hole-adventure': {
    tagline: 'Dive into a world wonder—bucket list adventure awaits',
    rating: 5.0,
    reviewCount: 127,
    difficulty: 'Moderate',
    includedHighlights: ['Snorkel Gear', 'Breakfast', 'BBQ Lunch', 'Permits'],
    pickup: 'All San Pedro hotels (early morning)',
    languages: ['English', 'Spanish'],
    whyUnforgettable:
      "The Great Blue Hole isn't just a diving site—it's a UNESCO World Heritage Site and one of the most iconic natural wonders on Earth. This full-day adventure takes you 70 miles offshore to snorkel the legendary Blue Hole and surrounding coral atolls, where Jacques Cousteau once declared it one of the top dive sites in the world.\n\nFrom above, the Blue Hole appears as a perfect dark blue circle in the lighter turquoise sea—a 1,000-foot-wide sinkhole dropping 400 feet into an ancient underwater cave system. While scuba divers explore the depths, snorkelers glide across the surface, peering into the mysterious blue abyss while tropical fish, nurse sharks, and sometimes even dolphins circle below.\n\nBut the adventure doesn't stop there. We visit three stunning locations: the Blue Hole itself, Half Moon Caye (a protected bird sanctuary), and Long Caye for pristine snorkeling among sea turtles and vibrant coral gardens. This is the ultimate Belize bucket-list experience—adventure, natural beauty, and world-class snorkeling combined into one unforgettable day.",
    itinerary: [
      { time: '6:00 AM', title: 'Early Hotel Pickup', description: 'Meet at your San Pedro hotel for the journey' },
      { time: '6:30 AM', title: 'Departure', description: 'Board our fast boat, continental breakfast provided' },
      {
        time: '8:30 AM',
        title: 'Arrive at Blue Hole',
        description: 'First look at the iconic circular formation from surface'
      },
      {
        time: '8:45 AM - 10:00 AM',
        title: 'Blue Hole Snorkel',
        description: 'Snorkel the outer rim, observe the deep blue abyss'
      },
      {
        time: '10:30 AM',
        title: 'Half Moon Caye',
        description: 'Explore the island, see red-footed boobies and frigatebirds'
      },
      {
        time: '12:00 PM',
        title: 'Lunch on the Beach',
        description: 'Fresh Belizean BBQ lunch on a pristine caye'
      },
      {
        time: '1:00 PM - 2:30 PM',
        title: 'Long Caye Snorkel',
        description: 'World-class snorkeling with sea turtles and rays'
      },
      {
        time: '3:00 PM',
        title: 'Return Journey',
        description: 'Refreshments and sunset views on the way back'
      },
      { time: '5:00 PM', title: 'Arrival & Drop-off', description: 'Return to San Pedro hotels' }
    ],
    included: [
      'Round-trip boat transportation (2.5 hours each way)',
      'Experienced captain and dive master',
      'All snorkeling equipment (mask, fins, snorkel)',
      'Life jackets and safety gear',
      'Continental breakfast on departure',
      'Full Belizean BBQ lunch on the beach',
      'Refreshments throughout the day',
      'Blue Hole park fees and permits',
      'Waterproof action camera (GoPro) rental',
      'Hotel pickup and drop-off',
      'First aid and emergency equipment'
    ],
    notIncluded: [
      'Gratuity for crew (15-20% recommended)',
      'Alcoholic beverages',
      'Wetsuits (available for rent)',
      'Underwater photos (can be purchased)',
      'Travel insurance'
    ],
    whatToBring: [
      'Reef-safe sunscreen (strictly enforced)',
      'Swimsuit and rash guard or wetsuit',
      'Towel and dry change of clothes',
      'Underwater camera (or use our GoPro)',
      'Motion sickness medication (long boat ride)',
      'Hat, sunglasses, and flip-flops',
      'Cash for gratuity and optional purchases',
      'Sense of adventure!'
    ],
    reviews: [
      {
        rating: 5,
        author: 'Robert & Jennifer',
        location: 'New York, USA',
        date: 'November 2024',
        text: 'Absolutely incredible! The Blue Hole is even more impressive in person. We saw eagle rays, nurse sharks, and sea turtles. Long day but SO worth it!'
      },
      {
        rating: 5,
        author: 'Chen Family',
        location: 'Singapore',
        date: 'October 2024',
        text: "Bucket list checked! Our kids won't stop talking about the Blue Hole. The crew was professional, lunch was delicious, and Half Moon Caye was stunning."
      },
      {
        rating: 5,
        author: 'Marcus T.',
        location: 'UK',
        date: 'September 2024',
        text: 'Best snorkeling of my life. Crystal-clear water, incredible marine life, and the Blue Hole is surreal. The boat ride is long but the experience is unforgettable.'
      }
    ],
    galleryImages: ['/images/tours/hol-chan-snorkel.jpg']
  },
  'secret-beach': {
    tagline: "The island's most vibrant beach party destination",
    rating: 5.0,
    reviewCount: 127,
    difficulty: 'Easy',
    includedHighlights: ['Transport', 'Chairs', 'Snorkel Gear', 'Guide'],
    pickup: 'All San Pedro hotels',
    languages: ['English', 'Spanish'],
    whyUnforgettable:
      "Secret Beach has transformed from a hidden gem into San Pedro's premier beach party destination. This isn't your quiet, secluded escape—it's where the island comes alive. Picture colorful beach bars, floating water parks with massive inflatables, live music drifting across turquoise water, and that perfect blend of Caribbean energy and laid-back vibes. It's the spot locals and tourists alike flock to for sun, swimming, and socializing.\n\nWhat makes this tour special is the boat ride itself—cruising along Ambergris Caye's stunning western coastline, feeling the breeze, and arriving in style. You'll have time to explore the floating obstacles, grab drinks from beachfront bars, swim in crystal-clear shallow water, and soak up the party atmosphere. Whether you want to go wild on the inflatables or just lounge with a cold Belikin, Secret Beach delivers that quintessential Belize beach day everyone talks about.",
    itinerary: [
      { time: '10:00 AM', title: 'Hotel Pickup', description: 'Meet at your San Pedro accommodation' },
      { time: '10:30 AM', title: 'Boat Departure', description: 'Scenic 20-minute boat ride along the coast' },
      { time: '11:00 AM', title: 'Arrive at Secret Beach', description: 'Welcome to paradise! Choose your perfect spot' },
      {
        time: '11:00 AM - 3:00 PM',
        title: 'Beach Time',
        description: 'Swim, relax, explore beach bars, enjoy the atmosphere'
      },
      {
        time: '1:00 PM',
        title: 'Lunch (Full Day Option)',
        description: 'Fresh seafood at one of the beachfront restaurants'
      },
      { time: '3:30 PM', title: 'Return Boat', description: 'Reluctantly leave paradise behind' },
      { time: '4:00 PM', title: 'Hotel Drop-off', description: 'Return to San Pedro refreshed and relaxed' }
    ],
    included: [
      'Round-trip boat transportation',
      'Beach chairs and umbrellas',
      'Cooler with ice and soft drinks',
      'Snorkeling equipment',
      'Beach volleyball and games',
      'Hammock access',
      'Hotel pickup and drop-off',
      'Local guide recommendations'
    ],
    notIncluded: [
      'Lunch and drinks at beach bars (pay as you go)',
      'Alcoholic beverages',
      'Beach massages (available on-site)',
      'Souvenirs and crafts',
      'Gratuity for boat captain'
    ],
    whatToBring: [
      'Swimsuit and beach cover-up',
      'Reef-safe sunscreen',
      'Towel (or use ours)',
      'Sunglasses and hat',
      'Cash for food, drinks, and tips',
      'Waterproof phone case',
      'Good book or Kindle',
      'Relaxation mindset!'
    ],
    reviews: [
      {
        rating: 5,
        author: 'Anderson Family',
        location: 'Colorado, USA',
        date: 'December 2024',
        text: 'The perfect beach day! Our kids played in the shallow water for hours while we relaxed in hammocks. The conch fritters at the beach bar were incredible!'
      },
      {
        rating: 5,
        author: 'Nicole & Brad',
        location: 'Australia',
        date: 'November 2024',
        text: 'We did the full-day option and it was heaven. Crystal-clear water, friendly locals, and no crowds. Exactly what we needed after busy dive days.'
      },
      {
        rating: 5,
        author: 'Gary M.',
        location: 'Texas, USA',
        date: 'October 2024',
        text: 'Secret Beach lives up to the hype! Beautiful, peaceful, and authentic. Captain Rene dropped us off and picked us up right on time. Highly recommend!'
      }
    ],
    galleryImages: ['/images/tours/beach-bbq.jpg']
  },
  'custom-adventure-bbq': {
    tagline: 'The ultimate Belize experience—everything in one epic day',
    rating: 5.0,
    reviewCount: 127,
    difficulty: 'Moderate',
    includedHighlights: ['Fishing', 'Snorkeling', 'BBQ', 'Hol Chan Fees'],
    pickup: 'All San Pedro hotels',
    languages: ['English', 'Spanish', 'Mayan'],
    whyUnforgettable:
      "Why choose between fishing, snorkeling, and beach time when you can have it all? Rene's Custom Adventure with Beach BBQ is our signature full-day experience that combines the best of Belize into one unforgettable journey. This is the tour that gets rave reviews, repeat bookings, and generates the most fish stories—because it delivers everything you came to Belize to experience.\n\nStart your morning with speargun or rod fishing, targeting fresh catch for your beach BBQ. Then dive into the crystal-clear waters of Hol Chan Marine Reserve, where you'll swim alongside nurse sharks, southern stingrays, and sea turtles—an underwater encounter you'll never forget. Stop at Caye Caulker's famous high-dive platform (if you dare!), feed tarpon in the shallows, and spot tiny seahorses clinging to sea grass.\n\nThe grand finale? Your captain prepares an authentic Mayan-style beach BBQ featuring your fresh-caught fish, grilled lobster (seasonal), and homemade conch ceviche on a pristine private beach. This isn't just a tour—it's a full Belizean immersion that shows you why this tiny Caribbean nation consistently ranks among the world's top destinations.",
    itinerary: [
      { time: '7:30 AM', title: 'Hotel Pickup', description: 'Early start for a full day of adventure' },
      { time: '8:00 AM', title: 'Morning Fishing', description: 'Speargun or rod fishing for your BBQ catch' },
      {
        time: '9:30 AM',
        title: 'Hol Chan Marine Reserve',
        description: 'Snorkel with nurse sharks, rays, and sea turtles'
      },
      {
        time: '10:45 AM',
        title: 'Shark Ray Alley',
        description: 'Up-close encounters with friendly southern stingrays'
      },
      {
        time: '11:30 AM',
        title: 'Caye Caulker',
        description: 'Explore the island, try the famous high dive (optional)'
      },
      {
        time: '12:30 PM',
        title: 'Tarpon & Seahorse Feeding',
        description: 'Hand-feed massive tarpon and spot delicate seahorses'
      },
      {
        time: '1:30 PM',
        title: 'Private Beach BBQ',
        description: 'Authentic Mayan-style feast with your fresh catch'
      },
      {
        time: '3:00 PM',
        title: 'Beach Relaxation',
        description: 'Swim, nap in hammocks, or explore the beach'
      },
      {
        time: '4:00 PM',
        title: 'Return Journey',
        description: 'Cruise back with full bellies and unforgettable memories'
      },
      {
        time: '4:30 PM',
        title: 'Hotel Drop-off',
        description: 'Return tired, happy, and planning your next trip'
      }
    ],
    included: [
      'Professional captain and crew',
      'Fishing equipment (speargun or rods)',
      'All snorkeling gear',
      'Hol Chan Marine Reserve entry fees',
      'Fresh-caught fish BBQ',
      'Grilled lobster or conch (seasonal)',
      'Conch ceviche appetizer',
      'Rice, beans, and tropical sides',
      'Fresh fruit and dessert',
      'Unlimited drinks (water, soft drinks, rum punch)',
      'Beach access and hammocks',
      'Hotel pickup and drop-off',
      'Underwater photos (GoPro footage)',
      'Life jackets and safety equipment'
    ],
    notIncluded: [
      'Gratuity for crew (15-20% recommended)',
      'Alcoholic beverages beyond rum punch',
      'Personal underwater camera',
      'Wetsuits (available for rent)',
      'Travel insurance'
    ],
    whatToBring: [
      'Swimsuit (wear under clothes)',
      'Reef-safe sunscreen (mandatory)',
      'Towel and dry change of clothes',
      'Waterproof phone/camera case',
      'Hat, sunglasses, and flip-flops',
      'Light jacket for morning boat ride',
      'Cash for gratuity',
      'Appetite and adventurous spirit!'
    ],
    reviews: [
      {
        rating: 5,
        author: 'Johnson Family',
        location: 'Ohio, USA',
        date: 'December 2024',
        text: 'Best day of our entire vacation! Our 10-year-old still talks about swimming with sharks. The beach BBQ was incredible—freshly caught fish cooked right there. Worth every penny!'
      },
      {
        rating: 5,
        author: 'Rachel & Tom',
        location: 'UK',
        date: 'November 2024',
        text: "We've done tours all over the world and this is top 3 ever. Captain Rene made it personal, the snorkeling was world-class, and that BBQ! Already planning to come back."
      },
      {
        rating: 5,
        author: 'Miguel & Ana',
        location: 'Mexico City',
        date: 'October 2024',
        text: 'Perfecto! Every part of the day was amazing. My wife was nervous about the sharks but loved it. The tarpon feeding was crazy! Best tour in Belize hands down.'
      }
    ],
    galleryImages: ['/videos/hero/full-day-ultimate.mp4', '/images/tours/full-day-ultimate.jpg']
  }
};

function getTourExtras(slug: string, fallbackImageUrl: string): TourExtras {
  const base = TOUR_EXTRAS_BY_SLUG[slug];
  if (base) return base;

  return {
    tagline: 'A Belize adventure crafted for unforgettable moments on the water.',
    rating: 5.0,
    reviewCount: 127,
    difficulty: 'Easy',
    includedHighlights: ['Equipment', 'Guide'],
    pickup: 'San Pedro Hotels',
    languages: ['English', 'Spanish'],
    whyUnforgettable:
      "Imagine stepping onto the water as Belize opens up around you—warm breezes, crystal views, and the kind of calm excitement that makes time slow down. This experience is designed to feel effortless: your captain handles the details, the pace stays relaxed, and every stop is chosen for maximum beauty and fun.\n\nYou’ll explore the highlights that make this part of the Caribbean legendary—whether that means fishing, cruising, or snorkeling. Along the way you’ll have plenty of time for photos, small surprises, and those ‘this is exactly why we came’ moments.\n\nWhat makes this tour different is the personalization. The crew adapts to your group, your comfort level, and your goals—so it feels like a private adventure, not a checklist.",
    itinerary: [
      {
        time: 'Start',
        title: 'Meet & Depart',
        description: 'Meet your captain and depart from San Pedro.'
      },
      {
        time: 'Mid-Trip',
        title: 'Main Experience',
        description: 'Enjoy the core adventure with guidance, equipment, and support.'
      },
      {
        time: 'Finish',
        title: 'Return',
        description: 'Head back with photos, stories, and unforgettable memories.'
      }
    ],
    included: ['Professional captain and crew', 'Safety equipment', 'Guidance and local knowledge'],
    notIncluded: DEFAULT_NOT_INCLUDED,
    whatToBring: DEFAULT_WHAT_TO_BRING,
    reviews: [
      {
        name: 'Guest Review',
        rating: 5,
        text: 'Beautiful experience from start to finish. The crew was friendly and everything felt easy and well planned.'
      },
      {
        name: 'Happy Traveler',
        rating: 5,
        text: 'Perfect day on the water—highly recommend if you want a premium, local experience.'
      },
      {
        name: 'Belize Bound',
        rating: 5,
        text: 'We would book again in a heartbeat. Great communication and an unforgettable day.'
      }
    ],
    galleryImages: [fallbackImageUrl]
  };
}

export async function generateStaticParams() {
  return tours.map((tour) => ({
    slug: tour.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return { title: 'Tour Not Found' };

  return {
    title: `${tour.title} - Rene's Adventures`,
    description: tour.description
  };
}

export default async function TourDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const relatedTours = tours.filter((t) => t.id !== tour.id).slice(0, 3);
  const extras = getTourExtras(slug, tour.imageUrl);
  const gallery = getGalleryFromManifest(slug, tour.imageUrl);

  return (
    <main className="min-h-screen bg-[#0F172A]">
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <div className="w-full h-full max-h-[850px] overflow-hidden">
            <TourMediaCarousel images={gallery} alt={tour.title} posterUrl={tour.imageUrl} />
          </div>
        </div>

        <div className="relative z-10 h-full">
          <div className="mx-auto w-full max-w-screen-2xl px-4 pt-8">
            <nav className="text-white/80 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/#tours" className="hover:text-white">Tours</Link>
              <span className="mx-2">›</span>
              <span className="text-white">{tour.title}</span>
            </nav>
          </div>

          <div className="mx-auto w-full max-w-screen-2xl px-4 pt-16 pb-10 md:pb-16">
            <div className="grid lg:grid-cols-12 gap-10 items-end">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/25 backdrop-blur-md border border-[#D4AF37]/20 px-4 py-2 mb-6">
                  <span className="text-yellow-300">{renderStars(extras.rating)}</span>
                  <span className="text-white font-semibold">{extras.rating.toFixed(1)}</span>
                  <span className="text-white/70">({extras.reviewCount} reviews)</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-[#D4AF37] leading-tight">{tour.title}</h1>
                <p className="text-[#F8FAFC] text-xl md:text-2xl mt-5 max-w-2xl">{extras.tagline}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {extras.includedHighlights.map((item) => (
                    <span
                      key={item}
                      className="px-4 py-2 rounded-full bg-black/25 backdrop-blur-md border border-white/15 text-white/90 text-sm"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 hidden lg:block">
                <div className="rounded-3xl bg-[#1E293B] border border-[#D4AF37]/25 p-6 shadow-2xl">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-[#F8FAFC]/70 text-sm">From</div>
                      <div className="text-4xl font-extrabold text-[#D4AF37]">{formatMoney(tour.price)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#F8FAFC]/70 text-sm">Timing</div>
                      <div className="text-[#F8FAFC] font-semibold">{FLEXIBLE_START_COPY}</div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <BookingEngine
                      tourName={tour.title}
                      basePrice={tour.price}
                      baseGuests={tour.baseGuests}
                      maxGuests={tour.maxGuests}
                      extraGuestFee={tour.extraGuestFee}
                      addOns={tour.addOns}
                    />
                  </div>

                  <div className="mt-4">
                    <BrochureCta tourSlug={tour.slug} tourTitle={tour.title} />
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#D4AF37]/20 bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Captain&apos;s Log</div>
                    <div className="mt-2 text-sm text-[#F8FAFC]/80 leading-relaxed">
                      Local captain expertise + conditions-based decisions. Your final departure ritual is confirmed 24h prior.
                    </div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-white/15 text-white/80 text-sm">
                    <div className="flex justify-between">
                      <span>Max group size</span>
                      <span className="text-white">{tour.maxGuests} guests</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>Pickup</span>
                      <span className="text-white">{extras.pickup}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#D4AF37]/15 bg-[#0F172A] sticky top-0 z-20">
        <div className="mx-auto w-full max-w-screen-2xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🕐</span>
              <div>
                <div className="text-xs uppercase tracking-wide text-[#D4AF37]/80">Timing</div>
                <div className="font-semibold text-[#F8FAFC]">{FLEXIBLE_START_COPY}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">👥</span>
              <div>
                <div className="text-xs uppercase tracking-wide text-[#D4AF37]/80">Group Size</div>
                <div className="font-semibold text-[#F8FAFC]">Max {tour.maxGuests}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">⭐</span>
              <div>
                <div className="text-xs uppercase tracking-wide text-[#D4AF37]/80">Difficulty</div>
                <div className="font-semibold text-[#F8FAFC]">{extras.difficulty}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <div>
                <div className="text-xs uppercase tracking-wide text-[#D4AF37]/80">Included</div>
                <div className="font-semibold text-[#F8FAFC]">{extras.includedHighlights.slice(0, 2).join(', ')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <div>
                <div className="text-xs uppercase tracking-wide text-[#D4AF37]/80">Pickup</div>
                <div className="font-semibold text-[#F8FAFC]">{extras.pickup}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🗣️</span>
              <div>
                <div className="text-xs uppercase tracking-wide text-[#D4AF37]/80">Languages</div>
                <div className="font-semibold text-[#F8FAFC]">{extras.languages.join(', ')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0F172A]">
        <div className="mx-auto w-full max-w-screen-2xl px-4">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <h2 className="text-4xl font-bold text-[#D4AF37]">Why This Tour is Unforgettable</h2>
              <p className="mt-6 text-lg text-[#F8FAFC]/80 leading-relaxed whitespace-pre-line">{extras.whyUnforgettable}</p>

              {tour.activities && tour.activities.length > 0 && (
                <CustomAdventureActivities activities={tour.activities} />
              )}

              <div className="mt-12 rounded-3xl border border-[#D4AF37]/20 bg-[#1E293B] p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#D4AF37]">Featured Fish Story</h3>
                    <p className="mt-2 text-[#F8FAFC]/80">
                      See how a guest landed the catch of a lifetime on this exact tour.
                    </p>
                    <p className="mt-4 text-sm text-[#F8FAFC]/60">Coming soon</p>
                  </div>
                  <div className="hidden md:block w-40 h-24 rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-black/20 relative">
                    <Image src={tour.imageUrl} alt={tour.title} fill className="object-cover" sizes="160px" />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    disabled
                    className="px-6 py-3 rounded-xl bg-white/10 text-white/50 font-semibold cursor-not-allowed border border-white/10"
                  >
                    Read Full Story
                  </button>
                </div>
              </div>

              <div className="mt-16" id="itinerary">
                <h2 className="text-4xl font-bold text-[#D4AF37] mb-8">Hour-by-Hour Breakdown</h2>
                <div className="space-y-4">
                  {extras.itinerary.map((item) => (
                    <div key={`${item.time}-${item.title}`} className="rounded-2xl border border-[#D4AF37]/20 bg-[#1E293B] p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="text-[#D4AF37] font-bold text-sm uppercase tracking-[0.25em]">{FLEXIBLE_START_COPY}</div>
                        <div className="text-[#F8FAFC] font-semibold text-lg md:text-right">{item.title}</div>
                      </div>
                      <p className="mt-3 text-[#F8FAFC]/80">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-16" id="included">
                <h2 className="text-4xl font-bold text-[#D4AF37] mb-8">What&apos;s Included</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#1E293B] p-6">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Included</h3>
                    <ul className="space-y-3">
                      {extras.included.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[#F8FAFC]/80">
                          <span className="text-[#D4AF37] text-xl mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#1E293B] p-6">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Not Included</h3>
                    <ul className="space-y-3">
                      {extras.notIncluded.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[#F8FAFC]/80">
                          <span className="text-[#F8FAFC]/50 text-xl mt-0.5">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-16" id="bring">
                <h2 className="text-4xl font-bold text-[#D4AF37] mb-8">What to Bring</h2>
                <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#1E293B] p-6">
                  <ul className="grid md:grid-cols-2 gap-4">
                    {extras.whatToBring.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[#F8FAFC]/80">
                        <span className="text-lg">□</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-16" id="reviews">
                <div className="flex items-end justify-between gap-6 flex-wrap">
                  <div>
                    <h2 className="text-4xl font-bold text-[#D4AF37]">Reviews & Testimonials</h2>
                    <div className="mt-3 text-[#F8FAFC]/80">
                      <span className="text-yellow-500 font-bold">{renderStars(extras.rating)}</span>
                      <span className="ml-2 font-semibold">{extras.rating.toFixed(1)}</span>
                      <span className="text-[#F8FAFC]/60"> ({extras.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <AskLiaLink
                    message={`Share reviews for ${tour.title}`}
                    className="text-[#D4AF37] font-semibold hover:underline"
                  />
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  {extras.reviews.map((review) => (
                    <div
                      key={review.author || review.name || review.text}
                      className="rounded-2xl border border-[#D4AF37]/20 p-6 bg-[#1E293B]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#F8FAFC]">{review.author || review.name}</div>
                          {(review.location || review.date) && (
                            <div className="text-xs text-[#F8FAFC]/60">
                              {[review.location, review.date].filter(Boolean).join(' • ')}
                            </div>
                          )}
                        </div>
                        <div className="text-yellow-500">{renderStars(review.rating)}</div>
                      </div>
                      <p className="mt-4 text-[#F8FAFC]/80 leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-16">
                <h2 className="text-3xl font-bold text-[#D4AF37] mb-8">You Might Also Like</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedTours.map((relatedTour) => (
                    <Link
                      key={relatedTour.id}
                      href={`/tours/${relatedTour.slug}`}
                      className="bg-[#1E293B] rounded-2xl overflow-hidden shadow-2xl transition-all border border-[#D4AF37]/20 hover:border-[#D4AF37]/35"
                    >
                      <div className="relative w-full h-44">
                        <Image
                          src={relatedTour.imageUrl}
                          alt={relatedTour.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 33vw, 100vw"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-[#F8FAFC] mb-2">{relatedTour.title}</h3>
                        <p className="text-sm text-[#F8FAFC]/70 mb-3 line-clamp-2">{relatedTour.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[#D4AF37] font-extrabold">{formatMoney(relatedTour.price)}</span>
                          <span className="text-xs text-[#F8FAFC]/60">{FLEXIBLE_START_COPY}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="lg:hidden rounded-2xl border border-[#D4AF37]/20 bg-[#1E293B] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#F8FAFC]/70 text-sm">From</div>
                    <div className="text-3xl font-extrabold text-[#D4AF37]">{formatMoney(tour.price)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#F8FAFC]/70 text-sm">Timing</div>
                    <div className="font-semibold text-[#F8FAFC]">{FLEXIBLE_START_COPY}</div>
                  </div>
                </div>
                <div className="mt-5">
                  <BookingEngine
                    tourName={tour.title}
                    basePrice={tour.price}
                    baseGuests={tour.baseGuests}
                    maxGuests={tour.maxGuests}
                    extraGuestFee={tour.extraGuestFee}
                    addOns={tour.addOns}
                  />
                </div>

                <div className="mt-4">
                  <BrochureCta tourSlug={tour.slug} tourTitle={tour.title} />
                </div>
              </div>

              <div className="hidden lg:block sticky top-24">
                <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#1E293B] shadow-2xl p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="text-[#F8FAFC]/70 text-sm">From</div>
                      <div className="text-4xl font-extrabold text-[#D4AF37]">{formatMoney(tour.price)}</div>
                      <div className="mt-2 text-sm text-[#F8FAFC]/80">Up to {tour.baseGuests} guests included</div>
                      <div className="text-sm text-[#F8FAFC]/70">+{formatMoney(tour.extraGuestFee)} per guest (5–8)</div>
                      <div className="mt-2 text-sm text-[#F8FAFC]/60">Maximum {tour.maxGuests} guests</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#F8FAFC]/70 text-sm">Rating</div>
                      <div className="text-yellow-400 font-bold">{renderStars(extras.rating)}</div>
                      <div className="text-sm text-[#F8FAFC]/70">{extras.reviewCount} reviews</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <BookingEngine
                      tourName={tour.title}
                      basePrice={tour.price}
                      baseGuests={tour.baseGuests}
                      maxGuests={tour.maxGuests}
                      extraGuestFee={tour.extraGuestFee}
                      addOns={tour.addOns}
                    />
                  </div>

                  <div className="mt-4">
                    <BrochureCta tourSlug={tour.slug} tourTitle={tour.title} />
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="text-sm text-[#F8FAFC]/80 flex items-center justify-between">
                      <span className="font-semibold">Duration</span>
                      <span>{FLEXIBLE_START_COPY}</span>
                    </div>
                    <div className="mt-2 text-sm text-[#F8FAFC]/80 flex items-center justify-between">
                      <span className="font-semibold">Pickup</span>
                      <span>{extras.pickup}</span>
                    </div>
                    <div className="mt-2 text-sm text-[#F8FAFC]/80 flex items-center justify-between">
                      <span className="font-semibold">Languages</span>
                      <span>{extras.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#0F172A]">
        <div className="mx-auto w-full max-w-screen-2xl px-4 text-center">
          <Link
            href="/#tours"
            className="inline-block px-8 py-3 border border-[#D4AF37]/35 text-[#F8FAFC]/80 font-semibold rounded-xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
          >
            ← View All Tours
          </Link>
        </div>
      </section>
    </main>
  );
}
