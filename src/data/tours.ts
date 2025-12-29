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
}

export const tours: Tour[] = [
  {
    id: "custom-adventure-bbq",
    title: "Rene's Custom Adventure with Beach BBQ",
    slug: "custom-adventure-bbq",
    description: "The ultimate Belize experience: Speargun or rod fishing, snorkel the Belize Barrier Reef, Hol Chan Marine Reserve with sharks & rays, Caye Caulker with famous high dive, feed tarpon, spot seahorses, and enjoy authentic Mayan-style Beach BBQ with lobster or conch ceviche (seasonal).",
    price: 675,
    priceWithout: 600,
    duration: "Full Day",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: "https://www.genspark.ai/api/files/s/3A6pymWQ",
    features: [
      "Speargun or rod and reel fishing",
      "Snorkel the Belize Barrier Reef",
      "Hol Chan Marine Reserve (sharks & rays)",
      "Caye Caulker & famous high dive",
      "Feed tarpon & spot seahorses",
      "Authentic Mayan-style Beach BBQ",
      "Lobster or conch ceviche (seasonal)"
    ]
  },
  {
    id: "deep-sea-fishing",
    title: "Deep Sea Fishing",
    slug: "deep-sea-fishing",
    description: "Target big game fish species with experienced crew and all equipment. Bait and licenses included, fresh catch cleaned and filleted. Available as half-day or full-day charter.",
    price: 600,
    priceFullDay: 900,
    duration: "Half Day (4 hours) or Full Day (8 hours)",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: "https://www.genspark.ai/api/files/s/TEy7Rea5",
    features: [
      "Experienced crew with all equipment",
      "Target big game fish species",
      "Bait and licenses included",
      "Fresh catch cleaned and filleted"
    ]
  },
  {
    id: "sunset-cruise",
    title: "Sunset Cruise",
    slug: "sunset-cruise",
    description: "Perfect for couples and friends. Departure between 6-7 PM with champagne, wine, or beverages available. Optional waterfront stop to watch the Caribbean sunset.",
    price: 350,
    duration: "2.5 Hours",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: "https://www.genspark.ai/api/files/s/vmG7KFcd",
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
    description: "Visit the iconic Blue Hole, snorkel this world-class dive site, and explore surrounding reefs. Full-day adventure to one of Belize's most famous landmarks.",
    price: 900,
    duration: "Full Day",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: "https://www.genspark.ai/api/files/s/Evtwel7K",
    features: [
      "Visit the iconic Blue Hole",
      "Snorkel world-class dive site",
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
    duration: "Half Day or Full Day",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: "https://www.genspark.ai/api/files/s/Gx3f4FmG",
    features: [
      "Visit the famous Secret Beach",
      "Crystal-clear turquoise waters",
      "Beach bars and restaurants nearby",
      "Perfect for relaxation"
    ]
  },
  {
    id: "reef-fishing",
    title: "Reef Fishing",
    slug: "reef-fishing",
    description: "Target snapper, grouper, and barracuda near Belize's stunning coral reefs. Perfect for families and first-timers with experienced local guides.",
    price: 550,
    duration: "6 Hours",
    maxGuests: 8,
    includedGuests: 4,
    additionalGuestPrice: 75,
    imageUrl: "https://www.genspark.ai/api/files/s/NErvl51H",
    features: [
      "Target reef fish species",
      "Snapper, grouper, barracuda",
      "Near stunning coral reefs",
      "Perfect for families"
    ]
  }
];

export const getFeaturedTours = () => tours.slice(0, 3);
export const getTourBySlug = (slug: string) => tours.find((tour) => tour.slug === slug);
