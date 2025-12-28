export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  duration: string;
  price: number;
  maxGuests: number;
  includes: string[];
  category: 'fishing' | 'snorkeling' | 'cruise' | 'adventure';
  imageUrl: string;
  featured: boolean;
}

export const tours: Tour[] = [
  {
    id: '1',
    title: 'Deep Sea Fishing - Half Day',
    slug: 'deep-sea-fishing-half-day',
    description:
      'Target mahi-mahi, wahoo, and tuna 12+ miles offshore. Includes all tackle, bait, and fishing licenses.',
    shortDescription: 'Half-day deep sea fishing adventure',
    duration: '5 hours',
    price: 600,
    maxGuests: 4,
    includes: ['All fishing gear', 'Bait & tackle', 'Fishing licenses', 'Water & sodas', 'Snacks'],
    category: 'fishing',
    imageUrl: '/images/tours/deep-sea-fishing.jpg',
    featured: true,
  },
  {
    id: '2',
    title: 'Reef Fishing + Snorkeling',
    slug: 'reef-fishing-snorkeling',
    description: 'Catch snapper and grouper, then snorkel Hol Chan Marine Reserve. Perfect for families.',
    shortDescription: 'Fish the reef and snorkel crystal waters',
    duration: '4 hours',
    price: 450,
    maxGuests: 6,
    includes: ['Fishing gear', 'Snorkel equipment', 'Marine park fees', 'Water & sodas', 'Snacks'],
    category: 'fishing',
    imageUrl: '/images/tours/reef-fishing.jpg',
    featured: true,
  },
  {
    id: '3',
    title: 'Hol Chan Snorkel + Beach BBQ',
    slug: 'hol-chan-snorkel-beach-bbq',
    description: 'Swim with sea turtles and rays, then enjoy fresh-caught BBQ on a private beach.',
    shortDescription: 'Snorkel paradise + beach feast',
    duration: '6 hours',
    price: 675,
    maxGuests: 6,
    includes: ['Snorkel gear', 'Marine park fees', 'Beach BBQ lunch', 'Rum punch', 'Water & sodas'],
    category: 'snorkeling',
    imageUrl: '/images/tours/beach-bbq.jpg',
    featured: true,
  },
  {
    id: '4',
    title: 'Sunset Cruise',
    slug: 'sunset-cruise',
    description: 'Romantic sunset cruise with champagne and appetizers. Perfect for couples and proposals.',
    shortDescription: 'Golden hour magic on the water',
    duration: '2.5 hours',
    price: 350,
    maxGuests: 4,
    includes: ['Champagne or wine', 'Appetizers', 'Soft drinks', 'Romantic ambiance'],
    category: 'cruise',
    imageUrl: '/images/tours/sunset-cruise.jpg',
    featured: false,
  },
  {
    id: '5',
    title: 'Full Day Ultimate Adventure',
    slug: 'full-day-adventure',
    description: 'Fish, snorkel, beach BBQ, and Secret Beach visit. Our most popular tour!',
    shortDescription: 'Everything in one epic day',
    duration: '8 hours',
    price: 950,
    maxGuests: 6,
    includes: ['All fishing & snorkel gear', 'Beach BBQ', 'Rum punch', 'Marine park fees', 'GoPro rental'],
    category: 'adventure',
    imageUrl: '/images/tours/full-day-adventure.jpg',
    featured: true,
  },
  {
    id: '6',
    title: 'Secret Beach Half Day',
    slug: 'secret-beach-half-day',
    description:
      'Visit the famous Secret Beach on the north side of Ambergris Caye. Swim, relax, and explore.',
    shortDescription: 'Pristine beach paradise',
    duration: '4 hours',
    price: 400,
    maxGuests: 6,
    includes: ['Beach chairs', 'Cooler with drinks', 'Snacks', 'Beach games'],
    category: 'adventure',
    imageUrl: '/images/tours/secret-beach.jpg',
    featured: false,
  },
  {
    id: '7',
    title: 'Tarpon Feeding + Snorkel',
    slug: 'tarpon-feeding-snorkel',
    description: 'Hand-feed massive tarpon and snorkel with stingrays. Unforgettable wildlife encounter!',
    shortDescription: 'Feed giant tarpon up close',
    duration: '3 hours',
    price: 375,
    maxGuests: 6,
    includes: ['Snorkel gear', 'Tarpon feeding', 'Marine park fees', 'Water & sodas'],
    category: 'snorkeling',
    imageUrl: '/images/tours/tarpon-feeding.jpg',
    featured: false,
  },
  {
    id: '8',
    title: 'Private Charter - Custom',
    slug: 'private-charter-custom',
    description:
      'Create your own adventure! Mix fishing, snorkeling, beach time, and anything else you want.',
    shortDescription: 'Your tour, your way',
    duration: 'Flexible',
    price: 600,
    maxGuests: 6,
    includes: ['Fully customizable', 'All gear provided', 'Captain & crew', 'Water & sodas'],
    category: 'adventure',
    imageUrl: '/images/tours/private-charter.jpg',
    featured: true,
  },
];

// Helper functions
export const getFeaturedTours = () => tours.filter((tour) => tour.featured);
export const getTourBySlug = (slug: string) => tours.find((tour) => tour.slug === slug);
export const getToursByCategory = (category: Tour['category']) =>
  tours.filter((tour) => tour.category === category);
