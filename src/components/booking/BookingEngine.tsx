'use client';

import { useCallback, useMemo } from 'react';

import { financialAddOnsBySlug } from '@/data/tours';

type BookingEngineProps = {
  tourName: string;
  tourSlug?: string;
  basePrice: number;
  fullDayPrice?: number;
  includedGuests: number;
  duration: 'half' | 'full' | null;
  onDurationChange: (next: 'half' | 'full') => void;
  guests: number;
  onGuestsChange: (next: number) => void;
  largeGroup: boolean;
  onLargeGroupChange: (next: boolean) => void;
  qty: Record<string, number>;
};

const WHOP_CHECKOUT_URL = 'https://whop.com/renes-adventures';
const EXTRA_PASSENGER_PRICE = 75;

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BookingEngine({
  tourName,
  tourSlug,
  basePrice,
  fullDayPrice,
  includedGuests,
  duration,
  onDurationChange,
  guests,
  onGuestsChange,
  largeGroup,
  onLargeGroupChange,
  qty,
}: BookingEngineProps) {
  const hasFullDay = typeof fullDayPrice === 'number' && Number.isFinite(fullDayPrice) && fullDayPrice > 0;
  const isDurationSelected = !hasFullDay || duration !== null;
  const isVip = largeGroup;

  const getQty = useCallback((id: string) => Math.max(0, qty[id] || 0), [qty]);

  const baseSelected = useMemo(() => {
    if (!isDurationSelected) return 0;
    if (isVip) return 0;
    if (hasFullDay && duration === 'full') return fullDayPrice as number;
    return basePrice;
  }, [basePrice, duration, fullDayPrice, hasFullDay, isDurationSelected, isVip]);

  const effectiveGuests = isVip ? 9 : guests;
  const overageGuests = Math.max(0, effectiveGuests - Math.max(0, includedGuests));
  const overageCost = isVip ? 0 : overageGuests * EXTRA_PASSENGER_PRICE;

  const addOns = useMemo(() => {
    const master = (tourSlug && financialAddOnsBySlug[tourSlug]) || financialAddOnsBySlug['custom-charter'] || [];

    return master.map((a) => {
      const pricing = a.pricing;

      if (pricing.type === 'per_guest') {
        return { id: a.id, label: a.name, unit: pricing.amountPerGuest, type: 'per_guest_toggle' as const };
      }

      if (pricing.type === 'flat') {
        return { id: a.id, label: a.name, unit: pricing.amount, type: 'flat' as const };
      }

      if (pricing.type === 'merch_unit') {
        return { id: a.id, label: a.name, unit: pricing.unitAmount, type: 'flat' as const };
      }

      return { id: a.id, label: a.name, unit: pricing.baseAmount, type: 'tiered_per_guest_toggle' as const, tiered: pricing };
    });
  }, [tourSlug]);

  const selectedAddOnLines = useMemo(() => {
    if (!isDurationSelected) return [] as { id: string; label: string; qty: number; total: number }[];
    if (isVip) return [] as { id: string; label: string; qty: number; total: number }[];

    return addOns
      .map((a) => {
        const q = getQty(a.id);
        if (q <= 0) return null;

        const lineTotal =
          a.type === 'per_guest_toggle'
            ? q * a.unit
            : a.type === 'tiered_per_guest_toggle'
              ? a.tiered.baseAmount + Math.max(0, q - a.tiered.includedGuests) * a.tiered.extraAmountPerGuest
              : q * a.unit;

        return { id: a.id, label: a.label, qty: q, total: lineTotal };
      })
      .filter((x): x is { id: string; label: string; qty: number; total: number } => Boolean(x));
  }, [addOns, getQty, isDurationSelected, isVip]);

  const addOnTotal = useMemo(() => selectedAddOnLines.reduce((sum, l) => sum + l.total, 0), [selectedAddOnLines]);

  const subtotal = useMemo(() => {
    if (!isDurationSelected) return 0;
    if (isVip) return 0;
    return baseSelected + overageCost + addOnTotal;
  }, [addOnTotal, baseSelected, isDurationSelected, isVip, overageCost]);

  const tax = useMemo(() => (isDurationSelected ? subtotal * 0.125 : 0), [isDurationSelected, subtotal]);
  const serviceFee = useMemo(() => (isDurationSelected ? subtotal * 0.06 : 0), [isDurationSelected, subtotal]);
  const grandTotal = useMemo(() => (isDurationSelected ? subtotal + tax + serviceFee : 0), [isDurationSelected, serviceFee, subtotal, tax]);

  const title = useMemo(() => (tourName ? `Build Your ${tourName}` : 'Build Your Charter'), [tourName]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white">
      <div className="text-[11px] text-white/70 leading-relaxed">
        Online booking for 1–8 guests. Groups of 9+ call René for Private Fleet coordination.
      </div>

      <div className="mt-2 text-base font-semibold">{title}</div>

      {hasFullDay && (
        <div className="mt-3">
          <div className="text-[11px] uppercase tracking-[0.25em] text-white/60">Duration</div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDurationChange('half')}
              className={`h-9 px-4 rounded-full border text-[11px] uppercase tracking-[0.25em] transition ${
                duration === 'half'
                  ? 'border-[#FFD400] bg-[#FFD400] text-black'
                  : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              Half Day
            </button>
            <button
              type="button"
              onClick={() => onDurationChange('full')}
              className={`h-9 px-4 rounded-full border text-[11px] uppercase tracking-[0.25em] transition ${
                duration === 'full'
                  ? 'border-[#FFD400] bg-[#FFD400] text-black'
                  : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              Full Day
            </button>
          </div>
          {!isDurationSelected && <div className="mt-2 text-[11px] text-white/60">Select HALF DAY or FULL DAY to calculate total.</div>}
        </div>
      )}

      <div className="mt-4">
        <div className="text-[11px] uppercase tracking-[0.25em] text-white/60">Guests</div>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onGuestsChange(Math.max(1, guests - 1))}
            disabled={largeGroup}
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition disabled:opacity-40"
          >
            −
          </button>
          <div className="min-w-[64px] text-center">
            <div className="text-2xl font-extrabold text-[#FFD400]">{largeGroup ? '9+' : guests}</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">Guests</div>
          </div>
          <button
            type="button"
            onClick={() => onGuestsChange(Math.min(8, guests + 1))}
            disabled={largeGroup || guests >= 8}
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => onLargeGroupChange(true)}
          className={`mt-3 w-full min-h-[60px] rounded-2xl px-8 py-4 border transition text-xs uppercase tracking-[0.25em] whitespace-normal text-center leading-tight shadow-[0_18px_38px_rgba(0,0,0,0.55)] ${
            largeGroup
              ? 'border-[#FFD400] bg-[#FFD400] text-black'
              : 'border-[#FFD400]/55 bg-gradient-to-r from-[#D4AF37] via-[#FFD400] to-[#D4AF37] text-slate-950 hover:brightness-105'
          }`}
        >
          9+ GUESTS? REQUEST PRIVATE FLEET
        </button>

        {largeGroup && (
          <button
            type="button"
            onClick={() => onLargeGroupChange(false)}
            className="mt-2 w-full rounded-xl bg-white/10 text-white font-semibold px-5 py-3 border border-white/20 hover:bg-white/15 transition"
          >
            Back to 1–8 Guests
          </button>
        )}

        <div className="mt-2 text-[11px] text-white/60">Base covers up to {includedGuests}. Extra passengers: {formatMoney(EXTRA_PASSENGER_PRICE)} each.</div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-3 py-3">
        <div className="text-[11px] uppercase tracking-[0.25em] text-white/60">Order Summary</div>

        <div className="mt-3 space-y-2 text-[13px] leading-tight">
          <div className="flex items-center justify-between gap-3">
            <span className="text-white/70">Base Price</span>
            <span className="text-white">{isDurationSelected ? formatMoney(baseSelected) : '—'}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-white/70">Extra Passengers ({overageGuests} @ {formatMoney(EXTRA_PASSENGER_PRICE)})</span>
            <span className="text-white">{isDurationSelected ? formatMoney(overageCost) : '—'}</span>
          </div>

          {isDurationSelected && selectedAddOnLines.length > 0 && (
            <div className="pt-2 mt-2 border-t border-white/10 space-y-2">
              {selectedAddOnLines.map((line) => {
                const addOn = addOns.find((a) => a.id === line.id);
                const unitLabel =
                  addOn?.type === 'tiered_per_guest_toggle'
                    ? formatMoney(addOn.tiered.extraAmountPerGuest)
                    : addOn
                      ? formatMoney(addOn.unit)
                      : '';

                return (
                  <div key={line.id} className="flex items-center justify-between gap-3 leading-snug">
                    <span className="text-white/70 min-w-0 truncate">
                      {line.label} ({line.qty} @ {unitLabel})
                    </span>
                    <span className="text-white">{formatMoney(line.total)}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between gap-3">
            <span className="text-white/70">Subtotal</span>
            <span className="text-white">{isDurationSelected ? formatMoney(subtotal) : '—'}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-white/70">Tax (12.5%)</span>
            <span className="text-white">{isDurationSelected ? formatMoney(tax) : '—'}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-white/70">Service Fee (6%)</span>
            <span className="text-white">{isDurationSelected ? formatMoney(serviceFee) : '—'}</span>
          </div>

          <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-3 leading-snug">
            <span className="text-white/90 font-semibold">Grand Total</span>
            <span className="text-[#FFD400] font-extrabold text-xl shrink-0">{isDurationSelected ? formatMoney(grandTotal) : '—'}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!isDurationSelected || isVip}
        onClick={() => window.open(WHOP_CHECKOUT_URL, '_blank', 'noopener,noreferrer')}
        className="mt-4 w-full h-16 rounded-2xl bg-[#FFD400] text-black font-black text-xl border border-black/60 shadow-[0_18px_38px_rgba(0,0,0,0.55)] hover:brightness-105 transition disabled:opacity-40 disabled:hover:brightness-100 text-center flex items-center justify-center"
      >
        PROCEED TO CHECKOUT
      </button>

      <div className="mt-3 text-[11px] text-white/60 text-center leading-relaxed">Secure Checkout | Bank-level encryption | Instant confirmation</div>
    </div>
  );
}
