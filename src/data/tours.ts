export type TourAddOn = {
  name: string;
  price: number;
  perPerson: boolean;
};

export type TourActivity = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  videoUrl: string;
};

export type TourExtrasMeta = {
  prices: {
    halfDay?: number;
    fullDay?: number;
    withBbq?: number;
    withoutBbq?: number;
  };
  pax: {
    included: number;
    max: number;
    extraGuestFee: number;
  };
  durations: {
    halfDay?: string;
    fullDay?: string;
    notes?: string;
  };
};

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  startTime: string;
  baseGuests: number;
  maxGuests: number;
  extraGuestFee: number;
  includedGuests?: number;
  additionalGuestPrice?: number;
  addOns: TourAddOn[];
  imageUrl: string;
  features: string[];
  priceWithout?: number;
  priceFullDay?: number;
  activities?: TourActivity[];
  extrasMeta?: TourExtrasMeta;
}

const DEFAULT_ADDONS: TourAddOn[] = [
  { name: 'Beach BBQ', price: 25, perPerson: true },
  { name: 'Marine Reserve Fee', price: 15, perPerson: true },
];

export const tours: Tour[] = [
  {
    id: "custom-adventure-bbq",
    title: "Rene's Custom Adventure with Beach BBQ",
    slug: "custom-adventure-bbq",
    description: "The ultimate Belize experience: Speargun or rod fishing, snorkel the Belize Barrier Reef, Hol Chan Marine Reserve with sharks & rays, Caye Caulker with famous high dive, feed tarpon, spot seahorses, and enjoy authentic Mayan-style Beach BBQ with lobster or conch ceviche (seasonal).",
    price: 675,
    priceWithout: 600,
    duration: "Varies by Season",
    startTime: "Approximate Start",
    baseGuests: 4,
    maxGuests: 8,
    extraGuestFee: 75,
    includedGuests: 4,
    additionalGuestPrice: 75,
    addOns: DEFAULT_ADDONS,
    imageUrl: "/images/tours/full-day-ultimate.jpg",
    features: [
      "Speargun or rod and reel fishing",
      "Snorkel the Belize Barrier Reef",
      "Hol Chan Marine Reserve (sharks & rays)",
      "Caye Caulker & famous high dive",
      "Feed tarpon & spot seahorses",
      "Authentic Mayan-style Beach BBQ",
      "Lobster or conch ceviche (seasonal)"
    ],
    extrasMeta: {
      prices: {
        withBbq: 675,
        withoutBbq: 600,
      },
      pax: {
        included: 4,
        max: 8,
        extraGuestFee: 75,
      },
      durations: {
        fullDay: 'Full day (custom route)',
        notes: 'Timing finalized by captain 24h prior.',
      },
    },
    activities: [
      {
        id: 'morning-fishing',
        title: 'Morning Fishing Session',
        description: 'Start the day with rods or speargun—target fresh catch for the beach BBQ.',
        keywords: ['fishing', 'rod', 'reel', 'catch', 'fish'],
        videoUrl: '/videos/luxury/deep-sea-fishing.mp4',
      },
      {
        id: 'conch-hunt',
        title: 'Conch Hunt',
        description: 'If conditions allow, we hunt conch and prep it island-style for ceviche.',
        keywords: ['conch', 'ceviche', 'shell', 'snorkel', 'reef'],
        videoUrl: '/videos/luxury/Conch Fishing 1.mp4',
      },
      {
        id: 'lobster-mission',
        title: 'Lobster Mission (Seasonal)',
        description: 'Seasonal lobster mission—quick, clean, and unforgettable.',
        keywords: ['lobster', 'reef', 'snorkel', 'dive', 'catch'],
        videoUrl: '/videos/luxury/Lobster Fishing 1.mp4',
      },
      {
        id: 'hol-chan-snorkel',
        title: 'Hol Chan Marine Reserve',
        description: 'Snorkel Hol Chan—one of Belize’s most iconic reef zones.',
        keywords: ['hol', 'chan', 'snorkel', 'reef', 'coral', 'underwater'],
        videoUrl: '/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.49 PM.mp4',
      },
      {
        id: 'shark-ray-alley',
        title: 'Shark Ray Alley',
        description: 'Up-close encounters with rays and sharks in crystal water.',
        keywords: ['shark', 'ray', 'snorkel', 'underwater', 'reef'],
        videoUrl: '/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.42 PM.mp4',
      },
      {
        id: 'caye-caulker-stop',
        title: 'Caye Caulker Stop',
        description: 'Dock in, explore, and catch the island pulse—easy and fun.',
        keywords: ['island', 'dock', 'caye', 'caulker', 'tropical', 'boat'],
        videoUrl: '/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.41 PM.mp4',
      },
      {
        id: 'high-dive',
        title: 'The High Dive (Optional)',
        description: 'The famous high dive—if you want the adrenaline moment.',
        keywords: ['jump', 'dive', 'adrenaline', 'island', 'ocean'],
        videoUrl: '/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.44 PM.mp4',
      },
      {
        id: 'tarpon-feeding',
        title: 'Tarpon Feeding',
        description: 'Hand-feed tarpon and watch the water explode.',
        keywords: ['tarpon', 'feeding', 'fish', 'action', 'jump'],
        videoUrl: '/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.45 PM.mp4',
      },
      {
        id: 'seahorse-spotting',
        title: 'Seahorse Spotting',
        description: 'A quiet, magical stop—spot seahorses in the grass beds.',
        keywords: ['seahorse', 'snorkel', 'underwater', 'grass', 'mangrove'],
        videoUrl: '/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.36 PM.mp4',
      },
      {
        id: 'beach-bbq-feast',
        title: 'Private Beach BBQ Feast',
        description: 'Mayan-style BBQ on the sand—fresh catch, ceviche, and island time.',
        keywords: ['bbq', 'beach', 'grill', 'ceviche', 'lobster', 'food'],
        videoUrl: '/videos/luxury/WhatsApp Video 2025-09-26 at 20.28.36_7a150342.mp4',
      },
    ],
  },
  {
    id: "deep-sea-fishing",
    title: "Deep Sea Fishing",
    slug: "deep-sea-fishing",
    description: "Target big game fish species with experienced crew and all equipment. Bait and licenses included, fresh catch cleaned and filleted. Available as half-day or full-day charter.",
    price: 600,
    priceFullDay: 900,
    duration: "Varies by Season",
    startTime: "Approximate Start",
    baseGuests: 4,
    maxGuests: 8,
    extraGuestFee: 75,
    includedGuests: 4,
    additionalGuestPrice: 75,
    addOns: DEFAULT_ADDONS,
    imageUrl: "/images/tours/deep-sea-fishing.jpg",
    features: [
      "Experienced crew with all equipment",
      "Target big game fish species",
      "Bait and licenses included",
      "Fresh catch cleaned and filleted"
    ],
    extrasMeta: {
      prices: {
        halfDay: 600,
        fullDay: 900,
      },
      pax: {
        included: 4,
        max: 8,
        extraGuestFee: 75,
      },
      durations: {
        halfDay: 'Half day',
        fullDay: 'Full day',
        notes: 'Timing finalized by captain 24h prior.',
      },
    },
  },
  {
    id: "reef-fishing",
    title: "Reef Fishing",
    slug: "reef-fishing",
    description: "Target snapper, grouper, and barracuda near Belize's stunning coral reefs. Perfect for families and first-timers with experienced local guides.",
    price: 550,
    duration: "Varies by Season",
    startTime: "Approximate Start",
    baseGuests: 4,
    maxGuests: 8,
    extraGuestFee: 75,
    includedGuests: 4,
    additionalGuestPrice: 75,
    addOns: DEFAULT_ADDONS,
    imageUrl: "/images/tours/reef-fishing.jpg",
    features: [
      "Target reef fish species",
      "Snapper, grouper, barracuda",
      "Near stunning coral reefs",
      "Perfect for families"
    ],
    extrasMeta: {
      prices: {
        halfDay: 550,
      },
      pax: {
        included: 4,
        max: 8,
        extraGuestFee: 75,
      },
      durations: {
        halfDay: 'Half day (reef zones)',
        notes: 'Route adapts to wind and reef visibility.',
      },
    },
  },
  {
    id: "sunset-cruise",
    title: "Sunset Cruise",
    slug: "sunset-cruise",
    description: "Perfect for couples and friends. Departure between 6-7 PM with champagne, wine, or beverages available. Optional waterfront stop to watch the Caribbean sunset.",
    price: 350,
    duration: "Varies by Season",
    startTime: "Approximate Start",
    baseGuests: 4,
    maxGuests: 8,
    extraGuestFee: 75,
    includedGuests: 4,
    additionalGuestPrice: 75,
    addOns: DEFAULT_ADDONS,
    imageUrl: "/images/tours/sunset-cruise.jpg",
    features: [
      "Departure between 6-7 PM",
      "Perfect for couples and friends",
      "Champagne, wine, or beverages available",
      "Optional waterfront stop"
    ],
    extrasMeta: {
      prices: {
        halfDay: 350,
      },
      pax: {
        included: 4,
        max: 8,
        extraGuestFee: 75,
      },
      durations: {
        halfDay: '2–3 hours (golden hour)',
        notes: 'Departure time adjusts with sunset.',
      },
    },
  },
  {
    id: "blue-hole-adventure",
    title: "Blue Hole Adventure",
    slug: "blue-hole-adventure",
    description: "Visit the iconic Blue Hole, snorkel this world-class site, and explore surrounding reefs. Full-day adventure to one of Belize's most famous landmarks.",
    price: 900,
    duration: "Varies by Season",
    startTime: "Approximate Start",
    baseGuests: 4,
    maxGuests: 8,
    extraGuestFee: 75,
    includedGuests: 4,
    additionalGuestPrice: 75,
    addOns: DEFAULT_ADDONS,
    imageUrl: "/images/tours/hol-chan-snorkel.jpg",
    features: [
      "Visit the iconic Blue Hole",
      "Snorkel world-class site",
      "Explore surrounding reefs",
      "Full-day adventure"
    ],
    extrasMeta: {
      prices: {
        fullDay: 900,
      },
      pax: {
        included: 4,
        max: 8,
        extraGuestFee: 75,
      },
      durations: {
        fullDay: 'Full day (offshore run)',
        notes: 'Weather dependent—best in calmer seas.',
      },
    },
  },
  {
    id: "secret-beach",
    title: "Secret Beach",
    slug: "secret-beach",
    description: "Visit the famous Secret Beach with crystal-clear turquoise waters. Beach bars and restaurants nearby, perfect for relaxation. Available as half-day or full-day trip.",
    price: 400,
    priceFullDay: 600,
    duration: "Varies by Season",
    startTime: "Approximate Start",
    baseGuests: 4,
    maxGuests: 8,
    extraGuestFee: 75,
    includedGuests: 4,
    additionalGuestPrice: 75,
    addOns: DEFAULT_ADDONS,
    imageUrl: "/images/tours/beach-bbq.jpg",
    features: [
      "Visit the famous Secret Beach",
      "Crystal-clear turquoise waters",
      "Beach bars and restaurants nearby",
      "Perfect for relaxation"
    ],
    extrasMeta: {
      prices: {
        halfDay: 400,
        fullDay: 600,
      },
      pax: {
        included: 4,
        max: 8,
        extraGuestFee: 75,
      },
      durations: {
        halfDay: 'Half day',
        fullDay: 'Full day',
        notes: 'Best for groups who want a relaxed, beach-forward day.',
      },
    },
  },
];

export const getFeaturedTours = () => tours.slice(0, 3);
export const getTourBySlug = (slug: string) => tours.find((tour) => tour.slug === slug);
