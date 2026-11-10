/**
 * What the server is willing to charge for.
 *
 * The browser used to send its own prices to Stripe, which meant anyone could
 * edit a request and book a $675 day for $1. Now the browser only says WHAT
 * and HOW MANY; the price comes from this list.
 *
 * To change a price: change it here AND on the page that shows it
 * (src/app/tours/custom-charter/page.tsx). The checkout refuses anything not
 * on this list.
 */

export interface CatalogItem {
  /** US cents. */
  amount: number;
  /** The fuel surcharge applies to the boat itself, not to add-ons or merch. */
  boat: boolean;
}

export const CATALOG: Record<string, CatalogItem> = {
  "Rene's Custom Adventure – Half Day": { amount: 40000, boat: true },
  "Rene's Custom Adventure – Full Day (BBQ Included)": { amount: 67500, boat: true },
  'Additional Guest': { amount: 7500, boat: false },
  'Beach BBQ – Extra Guest': { amount: 2500, boat: false },
  'Snorkel Gear Rental': { amount: 1500, boat: false },
  'T-Shirt – Adult (S/M/L/XL)': { amount: 2500, boat: false },
  'T-Shirt – XXL / XXXL': { amount: 3000, boat: false },
  'T-Shirt – Youth (S/M/L)': { amount: 2000, boat: false },
  'Snapback Hat – Standard': { amount: 3000, boat: false },
  'Snapback Hat – Leather Patch': { amount: 3500, boat: false },
  'Belize Survival Kit': { amount: 2000, boat: false },
};

/** Chris: 10% fuel on the boat price, added BEFORE tax. */
export const FUEL_RATE = 0.1;
/** Belize sales tax (GST). */
export const TAX_RATE = 0.125;
/** Card processing; Venmo and cash pay no card fee. */
export const CARD_FEE_RATE = 0.06;

export interface PricedLine {
  name: string;
  quantity: number;
  amount: number;
  boat: boolean;
}

export interface Quote {
  lines: PricedLine[];
  subtotal: number;
  fuel: number;
  tax: number;
  cardFee: number;
  total: number;
}

/** All amounts in cents. Same maths as the booking page shows. */
export function quote(lines: PricedLine[]): Quote {
  const subtotal = lines.reduce((s, l) => s + l.amount * l.quantity, 0);
  const boat = lines.filter((l) => l.boat).reduce((s, l) => s + l.amount * l.quantity, 0);
  const fuel = Math.round(boat * FUEL_RATE);
  const tax = Math.round((subtotal + fuel) * TAX_RATE);
  const cardFee = Math.round((subtotal + fuel + tax) * CARD_FEE_RATE);
  return { lines, subtotal, fuel, tax, cardFee, total: subtotal + fuel + tax + cardFee };
}
