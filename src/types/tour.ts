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

  hasHalfDay: boolean;
  hasFullDay: boolean;
  fullDayPrice: number | null;
  fullDayDuration: string | null;

  priceWithout?: number;
  bbqPricing?: {
    priceUpToGuests: number;
    includedGuests: number;
    extraGuestPrice: number;
  };
}
