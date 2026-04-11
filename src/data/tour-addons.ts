export type AddOnCategory = 'experience' | 'gear' | 'fees' | 'merchandise';
export type AddOnPricingType = 'flat' | 'per-guest' | 'tiered-per-guest';

export interface TourAddOn {
  id: string;
  title: string;
  description: string;
  price: number;
  category: AddOnCategory;
  pricingType: AddOnPricingType;
  specialInstructions?: string;
  icon: string;
  image?: string;
}

export const TOUR_ADDONS: TourAddOn[] = [
  {
    id: 'beach-bbq',
    title: 'Beach BBQ',
    description: 'Fresh catch, lobster and conch when in season, ceviche, potatoes, vegetables, rice',
    price: 75,
    category: 'experience',
    pricingType: 'flat',
    specialInstructions: 'Lobster and conch availability is seasonal',
    icon: 'Flame',
    image: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/beach-bbq-extra-guest.png',
  },
  {
    id: 'snorkel-gear',
    title: 'Snorkel Gear Rental',
    description: 'Per person (or bring your own)',
    price: 15,
    category: 'gear',
    pricingType: 'per-guest',
    icon: 'Waves',
    image: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/snorkel-gear-rental.png',
  },
  {
    id: 'hol-chan-fee',
    title: 'Hol Chan Marine Reserve Fee',
    description: '$15 fee paid directly to ranger at time of boat entry',
    price: 15,
    category: 'fees',
    pricingType: 'per-guest',
    specialInstructions: '$15 fee paid directly to ranger at time of boat entry',
    icon: 'Anchor',
  },
  {
    id: 'tshirt-adult',
    title: 'T-Shirt - Adult',
    description: 'Standard sizes',
    price: 25,
    category: 'merchandise',
    pricingType: 'flat',
    icon: 'ShoppingBag',
  },
  {
    id: 'tshirt-xxl',
    title: 'T-Shirt - XXL/XXXL',
    description: 'Extended sizes',
    price: 30,
    category: 'merchandise',
    pricingType: 'flat',
    icon: 'ShoppingBag',
  },
  {
    id: 'tshirt-youth',
    title: 'T-Shirt - Youth (S/M/L)',
    description: 'Kids sizes',
    price: 20,
    category: 'merchandise',
    pricingType: 'flat',
    icon: 'ShoppingBag',
  },
  {
    id: 'hat-standard',
    title: 'Snapback Hat - Standard',
    description: 'Classic snapback',
    price: 30,
    category: 'merchandise',
    pricingType: 'flat',
    icon: 'Sun',
  },
  {
    id: 'hat-leather',
    title: 'Snapback Hat - Leather Patch',
    description: 'Premium leather patch design',
    price: 35,
    category: 'merchandise',
    pricingType: 'flat',
    icon: 'Crown',
  },
];
