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
  heroVideoUrl?: string;
  galleryImages?: string[];
  testimonialImages?: string[];
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
    description: "Design your perfect day on the water — whether it’s fishing, snorkeling...",
    price: 400,
    priceFullDay: 600,
    duration: "Varies by Season",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/custom-charter.jpg',
    heroVideoUrl: '/hero/custom-charter.mp4',
    galleryImages: [
      '/images/tours/custom-charter-gallery-1.jpg',
      '/images/tours/custom-charter-gallery-2.jpg',
      '/images/tours/custom-charter-gallery-3.jpg',
      '/images/tours/custom-charter-gallery-4.jpg',
      '/images/tours/custom-charter-gallery-5.jpg',
      '/images/tours/custom-charter-gallery-6.jpg',
    ],
    testimonialImages: [
      '/images/testimonials/custom-charter-1.jpg',
      '/images/testimonials/custom-charter-2.jpg',
      '/images/testimonials/custom-charter-3.jpg',
    ],
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
    description:
      "The reel screams. Your arms burn. The water explodes 50 yards out. Mahi-mahi, wahoo, barracuda—this is big game fishing, Belize style. Veteran Captain René knows where they bite.",
    price: 650,
    priceFullDay: 900,
    duration: "6-8 hours",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/deep-sea-fishing.jpg',
    heroVideoUrl: '/hero/deep-sea-fishing.mp4',
    galleryImages: [
      '/images/tours/deep-sea-fishing-gallery-1.jpg',
      '/images/tours/deep-sea-fishing-gallery-2.jpg',
      '/images/tours/deep-sea-fishing-gallery-3.jpg',
      '/images/tours/deep-sea-fishing-gallery-4.jpg',
      '/images/tours/deep-sea-fishing-gallery-5.jpg',
      '/images/tours/deep-sea-fishing-gallery-6.jpg',
    ],
    testimonialImages: [
      '/images/testimonials/deep-sea-fishing-1.jpg',
      '/images/testimonials/deep-sea-fishing-2.jpg',
      '/images/testimonials/deep-sea-fishing-3.jpg',
    ],
    features: [
      'Target mahi-mahi, wahoo, barracuda, tuna',
      'Professional-grade tackle and bait included',
      'Captain + crew with 25+ years on these waters',
      'Fish cleaned, filleted, and bagged for you',
      'Cooler with ice for your catch',
      'Comfortable ride to offshore drop-offs',
      'Great for anglers chasing a trophy moment',
      'Private charter pacing (no crowded boats)',
    ]
  },
  {
    id: "reef-fishing",
    title: "Reef Fishing",
    slug: "reef-fishing",
    description:
      "Crystal-clear shallows. Coral heads alive with snappers, groupers, and jacks. Light tackle, fast action, and dinner in the cooler before lunch. This is reef fishing the Belizean way—pure, simple, effective.",
    price: 550,
    duration: "4 hours",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/reef-fishing.jpg',
    heroVideoUrl: '/hero/reef-fishing.mp4',
    galleryImages: [
      '/images/tours/reef-fishing-gallery-1.jpg',
      '/images/tours/reef-fishing-gallery-2.jpg',
      '/images/tours/reef-fishing-gallery-3.jpg',
      '/images/tours/reef-fishing-gallery-4.jpg',
      '/images/tours/reef-fishing-gallery-5.jpg',
      '/images/tours/reef-fishing-gallery-6.jpg',
    ],
    testimonialImages: [
      '/images/testimonials/reef-fishing-1.jpg',
      '/images/testimonials/reef-fishing-2.jpg',
      '/images/testimonials/reef-fishing-3.jpg',
    ],
    features: [
      'Target snapper, grouper, barracuda, jacks',
      'Perfect for families and first-timers',
      'Light tackle for maximum fun',
      'Fish over stunning coral reefs',
      'Quick action—multiple bites all day',
      'All rods, reels, bait, and guidance included',
      'Great add-on to a snorkeling day',
      'Catch kept on ice and cleaned as needed',
    ]
  },
  {
    id: "sunset-cruise",
    title: "Sunset Cruise",
    slug: "sunset-cruise",
    description:
      "Golden hour on Caribbean water. No agenda. No rush. Just you, cold drinks, and the kind of sunset that resets everything. This is how every Belize day should end.",
    price: 350,
    duration: "2 hours",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/sunset-cruise.jpg',
    heroVideoUrl: '/hero/sunset-cruise.mp4',
    galleryImages: [
      '/images/tours/sunset-cruise-gallery-1.jpg',
      '/images/tours/sunset-cruise-gallery-2.jpg',
      '/images/tours/sunset-cruise-gallery-3.jpg',
      '/images/tours/sunset-cruise-gallery-4.jpg',
      '/images/tours/sunset-cruise-gallery-5.jpg',
      '/images/tours/sunset-cruise-gallery-6.jpg',
    ],
    testimonialImages: [
      '/images/testimonials/sunset-cruise-1.jpg',
      '/images/testimonials/sunset-cruise-2.jpg',
      '/images/testimonials/sunset-cruise-3.jpg',
    ],
    features: [
      'Depart between 6–7 PM for perfect timing',
      'Intimate setting—perfect for couples or small groups',
      'Bring your playlist (Bluetooth speaker)',
      'Optional stop at a waterfront beach bar',
      'Champagne, wine, or your preferred beverages',
      'Easy, relaxed pacing with premium comfort',
      'Complimentary sunset photo moments',
      'Best way to end a full adventure day',
    ]
  },
  {
    id: "blue-hole-adventure",
    title: "Blue Hole Adventure",
    slug: "blue-hole-adventure",
    description:
      "Jacques Cousteau called it one of the world's greatest natural wonders. Now it's your turn. Snorkel the iconic Blue Hole, explore surrounding reefs, and experience the Caribbean's most legendary dive site—no scuba required.",
    price: 900,
    duration: "8-10 hours",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/blue-hole-adventure.jpg',
    heroVideoUrl: '/hero/blue-hole-adventure.mp4',
    galleryImages: [
      '/images/tours/blue-hole-adventure-gallery-1.jpg',
      '/images/tours/blue-hole-adventure-gallery-2.jpg',
      '/images/tours/blue-hole-adventure-gallery-3.jpg',
      '/images/tours/blue-hole-adventure-gallery-4.jpg',
      '/images/tours/blue-hole-adventure-gallery-5.jpg',
      '/images/tours/blue-hole-adventure-gallery-6.jpg',
    ],
    testimonialImages: [
      '/images/testimonials/blue-hole-adventure-1.jpg',
      '/images/testimonials/blue-hole-adventure-2.jpg',
      '/images/testimonials/blue-hole-adventure-3.jpg',
    ],
    features: [
      'Visit the world-famous Great Blue Hole',
      'Snorkel crystal-clear turquoise waters',
      'Explore multiple reef sites in one day',
      'Witness the 400-foot underwater sinkhole',
      'Spot eagle rays, reef sharks, sea turtles',
      'Full-day adventure with lunch included',
      'Captain times the route for visibility + conditions',
      'A bucket-list Belize experience (no scuba required)',
    ]
  },
  {
    id: "secret-beach",
    title: "Secret Beach",
    slug: "secret-beach",
    description:
      "Turquoise water so clear it looks fake. White sand that squeaks. Zero crowds. Secret Beach isn't just a name—it's a promise. Swim, relax, explore beach bars, or just float. This is pure Caribbean escape.",
    price: 400,
    priceFullDay: 600,
    duration: "4 hours",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: '/images/tours/secret-beach.jpg',
    heroVideoUrl: '/hero/secret-beach.mp4',
    galleryImages: [
      '/images/tours/secret-beach-gallery-1.jpg',
      '/images/tours/secret-beach-gallery-2.jpg',
      '/images/tours/secret-beach-gallery-3.jpg',
      '/images/tours/secret-beach-gallery-4.jpg',
      '/images/tours/secret-beach-gallery-5.jpg',
      '/images/tours/secret-beach-gallery-6.jpg',
    ],
    testimonialImages: [
      '/images/testimonials/secret-beach-1.jpg',
      '/images/testimonials/secret-beach-2.jpg',
      '/images/testimonials/secret-beach-3.jpg',
    ],
    features: [
      'Visit the famous Secret Beach paradise',
      'Crystal-clear shallow water perfect for swimming',
      'Beach bars and restaurants within walking distance',
      'Hammocks, volleyball, and pure relaxation',
      'Optional water sports and add-ons available',
      'Half-day or full-day options available',
      'Great for groups who want a laid-back day',
      'Sunset return option when timing lines up',
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
      description: 'Start with spearfishing—target fresh catch for the beach BBQ.',
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
      description: 'Seasonal lobster mission—quick, clean, and unforgettable.',
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
      description: 'Snorkel Hol Chan—one of Belize’s most iconic reef zones.',
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
      description: 'Dock in, explore, and catch the island pulse—easy and fun.',
      keywords: ['island', 'dock', 'caye', 'caulker', 'tropical', 'boat'],
      videoUrl: `${base}/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.41 PM.mp4`,
    },
    {
      id: 'high-dive',
      title: 'The High Dive (Optional)',
      description: 'The famous high dive—if you want the adrenaline moment.',
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
      description: 'A quiet, magical stop—spot seahorses in the grass beds.',
      keywords: ['seahorse', 'snorkel', 'underwater', 'grass', 'mangrove'],
      videoUrl: `${base}/videos/luxury/WhatsApp Video 2025-12-17 at 12.22.36 PM.mp4`,
    },
    {
      id: 'beach-bbq-feast',
      title: 'Private Beach BBQ Feast',
      description: 'Mayan-style BBQ on the sand—fresh catch, ceviche, and island time.',
      keywords: ['bbq', 'beach', 'grill', 'ceviche', 'lobster', 'food'],
      videoUrl: `${base}/videos/luxury/WhatsApp Video 2025-09-26 at 20.28.36_7a150342.mp4`,
    },
  ],
};

export const itineraryActivitiesBySlug = tourActivitiesBySlug;

export const financialAddOnsBySlug: Record<string, FinancialAddOn[]> = {
  'custom-charter': [
    {
      id: 'beach-bbq-up-to-4',
      name: 'Beach BBQ (up to 4 guests)',
      kind: 'bundle',
      pricing: {
        type: 'flat',
        amount: 275,
      },
    },
    {
      id: 'beach-bbq-additional-guest',
      name: 'Beach BBQ - Additional Guest',
      kind: 'bundle',
      pricing: {
        type: 'flat',
        amount: 100,
      },
    },
    {
      id: 'snorkel-gear-rental',
      name: 'Snorkel Gear Rental',
      kind: 'bundle',
      pricing: {
        type: 'flat',
        amount: 65,
      },
    },
    {
      id: 'hol-chan-marine-reserve-fee',
      name: 'Hol Chan Marine Reserve Fee',
      kind: 'fee',
      pricing: {
        type: 'flat',
        amount: 50,
      },
    },
    {
      id: 'tshirt-adult-s-xl',
      name: 'T-Shirt - Adult (S-XL)',
      kind: 'merch',
      pricing: {
        type: 'flat',
        amount: 100,
      },
    },
    {
      id: 'tshirt-xxl-xxxl',
      name: 'T-Shirt - XXL/XXXL',
      kind: 'merch',
      pricing: {
        type: 'flat',
        amount: 120,
      },
    },
    {
      id: 'tshirt-youth-small',
      name: 'T-Shirt - Youth (SMALL)',
      kind: 'merch',
      pricing: {
        type: 'flat',
        amount: 80,
      },
    },
    {
      id: 'snapback-standard',
      name: 'Snapback Hat - Standard',
      kind: 'merch',
      pricing: {
        type: 'flat',
        amount: 180,
      },
    },
    {
      id: 'snapback-leather-patch',
      name: 'Snapback Hat - Leather Patch',
      kind: 'merch',
      pricing: {
        type: 'flat',
        amount: 140,
      },
    },
  ],
};
