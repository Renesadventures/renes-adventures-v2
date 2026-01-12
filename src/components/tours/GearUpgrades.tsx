'use client';

import { useMemo, useState } from 'react';

type GearUpgradesProps = {
  tshirtPriceLabel: string;
  snapbackPriceLabel: string;
};

const TSHIRT_SIZES = ['Youth', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;
const SNAPBACK_STYLES = ['Standard', 'Leather Patch'] as const;

export default function GearUpgrades({ tshirtPriceLabel, snapbackPriceLabel }: GearUpgradesProps) {
  const [tshirtSize, setTshirtSize] = useState<(typeof TSHIRT_SIZES)[number]>('M');
  const [snapbackStyle, setSnapbackStyle] = useState<(typeof SNAPBACK_STYLES)[number]>('Standard');

  const snapbackStyleLabel = useMemo(() => {
    if (snapbackStyle === 'Leather Patch') return 'Leather Patch';
    return 'Standard';
  }, [snapbackStyle]);

  return (
    <div className="mt-3 grid gap-3">
      <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[#F8FAFC] font-semibold">T-Shirts</div>
            <div className="text-sm text-[#F8FAFC]/70">{tshirtPriceLabel}</div>
          </div>
          <div className="text-sm text-[#F8FAFC]/70 shrink-0">Size</div>
        </div>
        <div className="mt-3">
          <select
            value={tshirtSize}
            onChange={(e) => setTshirtSize(e.target.value as (typeof TSHIRT_SIZES)[number])}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]/60"
          >
            {TSHIRT_SIZES.map((size) => (
              <option key={size} value={size} className="bg-slate-950">
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[#F8FAFC] font-semibold">Snapback</div>
            <div className="text-sm text-[#F8FAFC]/70">{snapbackPriceLabel}</div>
          </div>
          <div className="text-sm text-[#F8FAFC]/70 shrink-0">Style</div>
        </div>
        <div className="mt-3">
          <select
            value={snapbackStyle}
            onChange={(e) => setSnapbackStyle(e.target.value as (typeof SNAPBACK_STYLES)[number])}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]/60"
          >
            {SNAPBACK_STYLES.map((style) => (
              <option key={style} value={style} className="bg-slate-950">
                {style}
              </option>
            ))}
          </select>
          <div className="mt-2 text-xs text-white/50 break-words">Selected: {snapbackStyleLabel}</div>
        </div>
      </div>
    </div>
  );
}
