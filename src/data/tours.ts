export type TourAddOn = {
  name: string;
  price: number;
  perPerson: boolean;
};

export type FinancialAddOn = {
  id: string;
  name: string;
  kind: 'fee' | 'merch' | 'bundle';
  pricing:
    | {
        type: 'flat';
        amount: number;
      }
    | {
        type: 'per_guest';
        amountPerGuest: number;
      }
    | {
        type: 'tiered_per_guest';
        baseAmount: number;
        includedGuests: number;
        extraAmountPerGuest: number;
      }
    | {
        type: 'merch_unit';
        unitAmount: number;
      };
};

export type TourActivity = {
  id: string;
  title: string;
  description: string;
  note?: string;
  keywords: string[];
  videoUrl: string;
  season?: {
    startMonthDay: string;
    endMonthDay: string;
  };
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
  maxGuests: number;
  includedGuests: number;
  additionalGuestPrice: number;
  imageUrl: string;
  features: string[];
  priceWithout?: number;
  priceFullDay?: number;
  bbqPricing?: {
    priceUpToGuests: number;
    includedGuests: number;
    extraGuestPrice: number;
  };
}

export type TourGearItem = {
  name: string;
  priceRange: {
    min: number;
    max: number;
  };
};

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

export const tourGear: TourGearItem[] = [
  {
    name: 'T-Shirts',
    priceRange: {
      min: 20,
      max: 30,
    },
  },
  {
    name: 'Snapback',
    priceRange: {
      min: 30,
      max: 35,
    },
  },
];

export const tours: Tour[] = [
  {
    id: "custom-adventure-bbq",
    title: "Rene's Custom Adventure with Beach BBQ",
    slug: "custom-charter",
    description: "Design your perfect day on the water ΓÇö whether itΓÇÖs fishing, snorkeling...",
    price: 400,
    priceFullDay: 600,
    duration: "Varies by Season",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/full-day-ultimate.jpg',
    features: [
      "Speargun or rod and reel fishing",
      "Snorkel the Belize Barrier Reef",
      "Hol Chan Marine Reserve (sharks & rays)",
      "Caye Caulker & famous high dive",
      "Feed tarpon & spot seahorses",
      "Authentic Mayan-style Beach BBQ",
      "Lobster or conch ceviche (seasonal)"
    ],
    bbqPricing: {
      priceUpToGuests: 75,
      includedGuests: 4,
      extraGuestPrice: 25,
    },
  },
  {
    id: "deep-sea-fishing",
    title: "Deep Sea Fishing",
    slug: "deep-sea-fishing",
    description: "Set out into the open waters for a thrilling offshore adventure...",
    price: 650,
    priceFullDay: 900,
    duration: "Varies by Season",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/deep-sea-fishing.jpg',
    features: [
      "Experienced crew with all equipment",
      "Target big game fish species",
      "Bait and licenses included",
      "Fresh catch cleaned and filleted"
    ]
  },
  {
    id: "reef-fishing",
    title: "Reef Fishing",
    slug: "reef-fishing",
    description: "Target snapper, grouper, and barracuda near Belize's stunning coral reefs. Perfect for families and first-timers with experienced local guides.",
    price: 550,
    duration: "Varies by Season",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/reef-fishing.jpg',
    features: [
      "Target reef fish species",
      "Snapper, grouper, barracuda",
      "Near stunning coral reefs",
      "Perfect for families"
    ]
  },
  {
    id: "sunset-cruise",
    title: "Sunset Cruise",
    slug: "sunset-cruise",
    description: "Experience BelizeΓÇÖs famous sunsets from the best seat in the house ΓÇö the water.",
    price: 350,
    duration: "Varies by Season",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/sunset-cruise.jpg',
    features: [
      "Departure between 6-7 PM",
      "Perfect for couples and friends",
      "Champagne, wine, or beverages available",
      "Optional waterfront stop"
    ]
  },
  {
    id: "blue-hole-adventure",
    title: "Blue Hole Adventure",
    slug: "blue-hole-adventure",
    description: "Visit the iconic Blue Hole, snorkel this world-class site, and explore surrounding reefs. Full-day adventure to one of Belize's most famous landmarks.",
    price: 900,
    duration: "Varies by Season",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/hol-chan-snorkel.jpg',
    features: [
      "Visit the iconic Blue Hole",
      "Snorkel world-class site",
      "Explore surrounding reefs",
      "Full-day adventure"
    ]
  },
  {
    id: "secret-beach",
    title: "Secret Beach",
    slug: "secret-beach",
    description: "Visit the famous Secret Beach with crystal-clear turquoise waters. Beach bars and restaurants nearby, perfect for relaxation. Available as half-day or full-day trip.",
    price: 400,
    priceFullDay: 600,
    duration: "Varies by Season",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/beach-bbq.jpg',
    features: [
      "Visit the famous Secret Beach",
      "Crystal-clear turquoise waters",
      "Beach bars and restaurants nearby",
      "Perfect for relaxation"
    ]
  },
];

export const getFeaturedTours = () => tours.slice(0, 3);
export const getTourBySlug = (slug: string) => tours.find((tour) => tour.slug === slug);

export const tourActivitiesBySlug: Record<string, TourActivity[]> = {
  'custom-charter': [
    {
      id: 'morning-fishing',
      title: 'Spearfishing',
      description: 'Start with spearfishingΓÇötarget fresh catch for the beach BBQ.',
      keywords: ['spearfishing', 'spear', 'speargun', 'fish', 'catch', 'reef'],
      videoUrl: `${base}/videos/luxury/deep-sea-fishing.mp4`,
    },
    {
      id: 'conch-hunt',
      title: 'Conch Hunt',
      description: 'If conditions allow, we hunt conch and prep it island-style for ceviche.',
      keywords: ['conch', 'ceviche', 'shell', 'snorkel', 'reef'],
      videoUrl: `${base}/videos/luxury/Conch Fishing 1.mp4`,
      season: {
        startMonthDay: '10-01',
        endMonthDay: '06-30',
      },
    },
    {
      id: 'lobster-mission',
      title: 'Lobster Mission (Seasonal)',
      description: 'Seasonal lobster missionΓÇöquick, clean, and unforgettable.',
      keywords: ['lobster', 'reef', 'snorkel', 'dive', 'catch'],
      videoUrl: `${base}/videos/luxury/Lobster Fishing 1.mp4`,
      season: {
        startMonthDay: '06-15',
        endMonthDay: '02-14',
      },
    },
    {
      id: 'hol-chan-snorkel',
      title: 'Hol Chan Marine Reserve',
      description: 'Snorkel Hol ChanΓÇöone of BelizeΓÇÖs most iconic reef zones.',
      note: '($15 Ranger Fee paid directly to ranger)',
      keywords: ['hol', 'chan', 'snorkel', 'reef', 'coral', 'underwater'],
      videoUrl: `${base}/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.49 PM.mp4`,
    },
    {
      id: 'shark-ray-alley',
      title: 'Shark Ray Alley',
      description: 'Up-close encounters with rays and sharks in crystal water.',
      keywords: ['shark', 'ray', 'snorkel', 'underwater', 'reef'],
      videoUrl: `${base}/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.42 PM.mp4`,
    },
    {
      id: 'caye-caulker-stop',
      title: 'Caye Caulker Stop',
      description: 'Dock in, explore, and catch the island pulseΓÇöeasy and fun.',
      keywords: ['island', 'dock', 'caye', 'caulker', 'tropical', 'boat'],
      videoUrl: `${base}/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.41 PM.mp4`,
    },
    {
      id: 'high-dive',
      title: 'The High Dive (Optional)',
      description: 'The famous high diveΓÇöif you want the adrenaline moment.',
      keywords: ['jump', 'dive', 'adrenaline', 'island', 'ocean'],
      videoUrl: `${base}/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.44 PM.mp4`,
    },
    {
      id: 'tarpon-feeding',
      title: 'Tarpon Feeding',
      description: 'Hand-feed tarpon and watch the water explode.',
      keywords: ['tarpon', 'feeding', 'fish', 'action', 'jump'],
      videoUrl: `${base}/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.45 PM.mp4`,
    },
    {
      id: 'seahorse-spotting',
      title: 'Seahorse Spotting',
      description: 'A quiet, magical stopΓÇöspot seahorses in the grass beds.',
      keywords: ['seahorse', 'snorkel', 'underwater', 'grass', 'mangrove'],
      videoUrl: `${base}/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.36 PM.mp4`,
    },
    {
      id: 'beach-bbq-feast',
      title: 'Private Beach BBQ Feast',
      description: 'Mayan-style BBQ on the sandΓÇöfresh catch, ceviche, and island time.',
      keywords: ['bbq', 'beach', 'grill', 'ceviche', 'lobster', 'food'],
      videoUrl: `${base}/videos/luxury/WhatsApp Video 2025-09-26 at 20.28.36_7a150342.mp4`,
    },
  ],
};

export const itineraryActivitiesBySlug = tourActivitiesBySlug;

export const financialAddOnsBySlug: Record<string, FinancialAddOn[]> = {
  'custom-charter': [
    {
      id: 'beach-bbq',
      name: 'Beach BBQ',
      kind: 'bundle',
      pricing: {
        type: 'tiered_per_guest',
        baseAmount: 75,
        includedGuests: 4,
        extraAmountPerGuest: 25,
      },
    },
    {
      id: 'snorkel-gear',
      name: 'Snorkel Gear',
      kind: 'bundle',
      pricing: {
        type: 'flat',
        amount: 0,
      },
    },
    {
      id: 'hol-chan-fee',
      name: 'Hol Chan Fee',
      kind: 'fee',
      pricing: {
        type: 'per_guest',
        amountPerGuest: 15,
      },
    },
    {
      id: 'tshirt',
      name: 'T-Shirts',
      kind: 'merch',
      pricing: {
        type: 'merch_unit',
        unitAmount: 25,
      },
    },
    {
      id: 'snapback',
      name: 'Snapbacks',
      kind: 'merch',
      pricing: {
        type: 'merch_unit',
        unitAmount: 35,
      },
    },
    {
      id: 'cooler-ice',
      name: 'Cooler & Ice',
      kind: 'bundle',
      pricing: {
        type: 'flat',
        amount: 0,
      },
    },
    {
      id: 'underwater-photos',
      name: 'Underwater Photos',
      kind: 'bundle',
      pricing: {
        type: 'flat',
        amount: 0,
      },
    },
    {
      id: 'private-chef-prep',
      name: 'Chef Prep',
      kind: 'bundle',
      pricing: {
        type: 'flat',
        amount: 0,
      },
    },
    {
      id: 'premium-drinks',
      name: 'Premium Drinks',
      kind: 'bundle',
      pricing: {
        type: 'flat',
        amount: 0,
      },
    },
  ],
};
