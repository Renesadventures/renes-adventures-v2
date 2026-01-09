'use client';

import { useMemo, useState } from 'react';
import { buildWhatsAppTourLink } from '@/lib/utils/whatsapp-link';
import type { TourAddOn } from '@/data/tours';

type BookingEngineProps = {
  tourName: string;
  basePrice: number;
  baseGuests: number;
  maxGuests: number;
  extraGuestFee: number;
  addOns: TourAddOn[];
};

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US')}`;
}

export default function BookingEngine({
  tourName,
  basePrice,
  baseGuests,
  maxGuests,
  extraGuestFee,
  addOns,
}: BookingEngineProps) {
  const [guests, setGuests] = useState(Math.min(baseGuests, 8));
  const [largeGroup, setLargeGroup] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});

  const effectiveGuests = largeGroup ? maxGuests + 1 : guests;
  const overageGuests = Math.max(0, effectiveGuests - baseGuests);

  const addOnsTotal = useMemo(() => {
    return addOns.reduce((sum, addOn) => {
      if (!addOn.perPerson) return sum;
      if (!selectedAddOns[addOn.name]) return sum;
      return sum + addOn.price * effectiveGuests;
    }, 0);
  }, [addOns, effectiveGuests, selectedAddOns]);

  const total = useMemo(() => {
    const overage = overageGuests * extraGuestFee;
    return basePrice + overage + addOnsTotal;
  }, [addOnsTotal, basePrice, extraGuestFee, overageGuests]);

  const conciergeLink = useMemo(() => buildWhatsAppTourLink({ tourName }), [tourName]);

  const canBookInline = !largeGroup;

  return (
    <div className="rounded-3xl border border-white/15 bg-[#0F172A] text-white shadow-2xl overflow-hidden">
      <div className="p-8 md:p-10">
        <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Checkout</div>
        <div className="mt-3 text-3xl md:text-4xl font-light tracking-tight">Build Your Charter</div>
        <div className="mt-2 text-white/70">Pricing updates instantly. Add-ons multiply by guest count.</div>

        <div className="mt-8 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white/90">Guests</div>
              <div className="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setLargeGroup(false);
                    setGuests((g) => Math.max(1, g - 1));
                  }}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
                >
                  −
                </button>
                <div className="min-w-[64px] text-center">
                  <div className="text-3xl font-semibold text-[#D4AF37]">{largeGroup ? '9+' : guests}</div>
                  <div className="text-xs uppercase tracking-[0.25em] text-white/50">Guests</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLargeGroup(false);
                    setGuests((g) => Math.min(8, g + 1));
                  }}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={() => setLargeGroup(true)}
                  className={`ml-auto rounded-full px-4 h-10 border transition text-xs uppercase tracking-[0.25em] ${
                    largeGroup
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-slate-950'
                      : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  9+
                </button>
              </div>

              <div className="mt-4 text-sm text-white/70">
                Base price covers up to {baseGuests} guests. Guests 5–8 add {formatMoney(extraGuestFee)} each.
                {largeGroup ? ' 9+ guests require Private Fleet Coordination.' : ''}
                <div className="mt-2 text-xs text-white/60 leading-relaxed">
                  Online booking up to 8 guests. For groups of 9+, René will arrange Private Fleet Coordination (multi-boat, private concierge setup).
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white/90">Add-ons (per person)</div>
              <div className="mt-4 space-y-3">
                {addOns
                  .filter((a) => a.perPerson)
                  .map((addOn) => (
                    <label
                      key={addOn.name}
                      className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <div>
                        <div className="font-semibold">{addOn.name}</div>
                        <div className="text-sm text-white/60">{formatMoney(addOn.price)} / guest</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(selectedAddOns[addOn.name])}
                        onChange={(e) =>
                          setSelectedAddOns((s) => ({
                            ...s,
                            [addOn.name]: e.target.checked,
                          }))
                        }
                        className="h-5 w-5 accent-[#D4AF37]"
                      />
                    </label>
                  ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white/90">Notes</div>
              <div className="mt-3 text-sm text-white/70 leading-relaxed">
                Approximate Start. Varies by season and conditions. Final timing confirmed within 24 hours.
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
              <div className="text-sm font-semibold text-white/90">Summary</div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Base (up to {baseGuests})</span>
                  <span className="text-white">{formatMoney(basePrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Extra guests</span>
                  <span className="text-white">{formatMoney(overageGuests * extraGuestFee)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Add-ons</span>
                  <span className="text-white">{formatMoney(addOnsTotal)}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-white/80 font-semibold">Total</span>
                  <span className="text-[#D4AF37] font-extrabold text-xl">{formatMoney(total)}</span>
                </div>
              </div>

              {canBookInline ? (
                <button
                  type="button"
                  onClick={() => {
                    const url = buildWhatsAppTourLink({ tourName });
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  className="mt-6 w-full rounded-xl bg-[#D4AF37] text-slate-950 font-extrabold px-6 py-4 border border-white/10 hover:brightness-110 transition"
                >
                  Book Now
                </button>
              ) : (
                <a
                  href={conciergeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-[#D4AF37] text-slate-950 font-extrabold px-6 py-4 border border-white/10 hover:brightness-110 transition"
                >
                  Request Private Fleet Coordination (9+)
                </a>
              )}

              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('lia:open', {
                      detail: {
                        message: `Pricing check for ${tourName}: ${largeGroup ? '9+' : guests} guests. What’s the best day this week?`,
                      },
                    })
                  )
                }
                className="mt-3 w-full rounded-xl bg-white/10 text-white font-semibold px-6 py-4 border border-white/20 hover:bg-white/15 transition"
              >
                Ask Lia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
