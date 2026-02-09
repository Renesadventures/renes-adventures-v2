'use client';

import React, { useMemo, useState } from 'react';
import { Anchor, CheckCircle2, Luggage } from 'lucide-react';

import type { Tour } from '@/data/tours';

type VideoItem = {
  id: string;
  label: string;
  src: string;
};

type AddOnItem = {
  name: string;
  price: number;
  note?: string;
};

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

const sharedAddOns: AddOnItem[] = [
  { name: 'Beach BBQ', price: 25 },
  { name: 'BBQ Additional Guest', price: 15 },
  { name: 'Snorkel Gear', price: 10 },
  { name: 'Hol Chan Fee', price: 15, note: '$15.00 fee paid directly to the ranger at the time of boat entry' },
  { name: 'Adult T-Shirt', price: 25 },
  { name: 'Youth T-Shirt', price: 20 },
  { name: 'XXL T-Shirt', price: 30 },
];

function pickInitialVideo(heroVideos: VideoItem[]) {
  return heroVideos[0]?.src || `${base}/videos/hero/renes-custom-adventures.mp4`;
}

function pickQuickClips(tour: Tour, heroVideos: VideoItem[]) {
  const fallbackThumbs = [
    `${base}/images/tours/full-day-ultimate.jpg`,
    `${base}/images/tours/deep-sea-fishing.jpg`,
    `${base}/images/tours/beach-bbq.jpg`,
  ];

  const clips = heroVideos.slice(0, 4);
  return clips.map((v, idx) => ({
    ...v,
    thumb: fallbackThumbs[idx] || tour.imageUrl,
  }));
}

function getTourStory(slug: string) {
  const stories: Record<string, string> = {
    'deep-sea-fishing':
      'You feel the tap at 200 feet down. The line screams. Your rod bends double. Then the ocean explodes — a flash of silver and neon as the fish breaks the surface. This is the kind of moment that makes you laugh out loud, because your body can’t believe it’s real.',
    'sunset-cruise':
      'The sky turns liquid gold. The water mirrors fire. Music drifts. Glasses clink. You look around and realize: this is the kind of memory people spend years chasing — and you’re living it right now, barefoot, salt-kissed, and unhurried.',
    'blue-hole':
      "Descending into Earth’s time capsule. The water deepens to cobalt. The world quiets. Then you’re above a place that feels impossible — the Blue Hole — where geology, ocean, and myth collide. This isn’t just a tour. It’s a story you get to keep forever.",
    'secret-beach':
      'Hidden paradise where mainland tourists don’t go. Turquoise so clear it feels like glass. Warm sand. Cold drinks. And the rare luxury of space — the kind that makes you breathe deeper and smile for no reason.',
    'custom-charter':
      'Your boat. Your day. Your pace. Pick the energy — fishing, snorkeling, islands, food, or all of it. This is Belize without a script: the kind of freedom that feels like luxury the second you push off the dock.',
  };

  return stories[slug] || stories['custom-charter'];
}

function getFlowContent(slug: string, stage: 'Start' | 'Peak' | 'Finish') {
  const bySlug: Record<string, Record<string, string>> = {
    'deep-sea-fishing': {
      Start: 'Meet the crew, set the target species, and head offshore. Lines in. Eyes on the horizon.',
      Peak: 'Hook-up chaos. Big runs. High-fives. Photos. The kind of adrenaline you feel in your teeth.',
      Finish: 'Slow cruise back with the salt on your skin and the story already getting better every time you tell it.',
    },
    'sunset-cruise': {
      Start: 'Golden hour begins. Drinks ready. You settle into a pace that feels like exhale.',
      Peak: 'The sky ignites. The water turns to molten copper. You realize why people fly here for this.',
      Finish: 'Twilight, calm, and a slow ride home — the kind of ending that makes you want to book tomorrow too.',
    },
    'blue-hole': {
      Start: 'Early start, big horizon. The trip out feels like a promise.',
      Peak: 'The Blue Hole moment — awe, silence, and water so deep it feels like space.',
      Finish: 'Reefs, lunch, and the slow satisfaction of doing something truly rare.',
    },
    'secret-beach': {
      Start: 'Easy cruise, warm air, and that first glimpse of shallow turquoise.',
      Peak: 'Beach bars, floating, laughing, and that “we should never leave” feeling.',
      Finish: 'Sun-kissed ride back — happy-tired, glowing, and already planning the next one.',
    },
    'custom-charter': {
      Start: 'Meet the crew & set priorities. Reef? Fishing? Food? We align the day to your vibe.',
      Peak: 'Action blocks + iconic Belize moments. High-adrenaline or island calm—you decide.',
      Finish: 'Slow down into sunset energy. Beach time, photos, and the last swim—no fixed checklist.',
    },
  };

  const fallback = bySlug['custom-charter'];
  const selected = bySlug[slug] || fallback;
  return selected[stage] || fallback[stage];
}

export default function UniversalTourPage({ tour, heroVideos }: { tour: Tour; heroVideos: VideoItem[] }) {
  const quickClips = useMemo(() => pickQuickClips(tour, heroVideos), [heroVideos, tour]);

  const [activeVideo, setActiveVideo] = useState(() => pickInitialVideo(heroVideos));

  const [guests, setGuests] = useState(() => Math.max(1, Math.min(8, tour.includedGuests || 1)));
  const [addonQtys, setAddonQtys] = useState<Record<string, number>>({});

  const setGuestsAndSyncAddOns = (nextGuests: number) => {
    setGuests(nextGuests);
    setAddonQtys((prev) => {
      const next: Record<string, number> = { ...prev };
      let changed = false;
      for (const [k, v] of Object.entries(next)) {
        if (v > 0 && v !== nextGuests) {
          next[k] = nextGuests;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  };

  const updateQty = (name: string, delta: number) => {
    setAddonQtys((prev) => {
      const current = prev[name] || 0;
      if (delta > 0) {
        if (current > 0) return prev;
        return { ...prev, [name]: guests };
      }

      if (delta < 0) {
        if (current <= 0) return prev;
        const next: Record<string, number> = { ...prev };
        delete next[name];
        return next;
      }

      return prev;
    });
  };

  const basePrice = tour.price;
  const extraPassengerPrice = guests > tour.includedGuests ? (guests - tour.includedGuests) * tour.additionalGuestPrice : 0;

  const selectedAddons = sharedAddOns.filter((item) => (addonQtys[item.name] || 0) > 0);
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + (addonQtys[item.name] * item.price), 0);

  const subtotal = basePrice + extraPassengerPrice + addonsTotal;
  const tax = subtotal * 0.125;
  const serviceFee = subtotal * 0.06;
  const grandTotal = subtotal + tax + serviceFee;

  return (
    <main className="bg-[#000814] min-h-screen p-10 flex flex-col items-center font-sans text-white pt-24">
      <div className="flex justify-center gap-10 w-full max-w-7xl relative">
        <div className="w-[700px] flex flex-col gap-16">
          <div className="w-full h-[450px] rounded-[2rem] overflow-hidden border border-[#c5a059] shadow-2xl bg-black">
            <video key={activeVideo} autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src={activeVideo} type="video/mp4" />
            </video>
          </div>

          <div className="flex gap-4">
            {quickClips.map((clip) => (
              <button
                key={clip.id}
                onClick={() => setActiveVideo(clip.src)}
                className="flex-1 h-24 rounded-2xl border-2 border-[#c5a059]/40 relative overflow-hidden transition-all hover:border-[#c5a059]"
              >
                <img src={clip.thumb} className="w-full h-full object-cover opacity-50" alt="" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-[10px] font-black tracking-widest uppercase">{clip.label}</span>
                </div>
              </button>
            ))}
          </div>

          <section className="bg-[#001d3d] rounded-[2.5rem] p-12 border border-[#c5a059]/20 relative">
            <div className="flex gap-10 items-center">
              <div className="flex-1 space-y-6">
                <h2 className="text-[#c5a059] text-4xl font-black uppercase tracking-tighter italic">{tour.title}</h2>
                <p className="text-gray-400 leading-relaxed text-base font-light">{tour.description}</p>
              </div>
              <div className="w-64 h-64 rounded-3xl overflow-hidden border border-[#c5a059] rotate-3 shadow-2xl">
                <img src={tour.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          </section>

          <section className="bg-black/40 rounded-[2.5rem] p-12 border border-white/5">
            <h3 className="text-[#c5a059] text-xs font-black uppercase mb-4 tracking-widest">
              {tour.slug === 'deep-sea-fishing'
                ? 'Deep Sea Story'
                : tour.slug === 'reef-fishing'
                  ? 'Reef Story'
                  : tour.slug === 'sunset-cruise'
                    ? 'Sunset Story'
                    : tour.slug === 'blue-hole'
                      ? 'Blue Hole Story'
                      : tour.slug === 'secret-beach'
                        ? 'Beach Story'
                        : 'Fish Story'}
            </h3>
            <h2 className="text-3xl font-black mb-6">The moment the water explodes.</h2>
            <p className="text-gray-400 leading-relaxed italic text-sm">{getTourStory(tour.slug)}</p>
          </section>

          <section className="bg-gradient-to-br from-[#001d3d] to-[#000814] rounded-[2.5rem] p-12 border border-[#c5a059]/20">
            <h3 className="text-[#c5a059] text-xs font-black uppercase mb-10 tracking-widest text-center">
              Personalized itinerary. No rush.
            </h3>
            <div className="grid grid-cols-3 gap-8">
              {(['Start', 'Peak', 'Finish'] as const).map((stage, i) => (
                <div key={stage} className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#c5a059] text-black flex items-center justify-center font-black mx-auto mb-6">
                    {i + 1}
                  </div>
                  <h4 className="font-black uppercase text-[#c5a059] text-xs mb-4">{stage}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{getFlowContent(tour.slug, stage)}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-12 px-6 pb-20">
            <div className="space-y-8">
              <h4 className="text-[#c5a059] font-black uppercase text-sm tracking-widest flex items-center gap-3">
                <Luggage size={18} /> Essentials
              </h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-center gap-4">
                  <CheckCircle2 size={16} className="text-[#c5a059]" /> Reef-safe sunscreen
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle2 size={16} className="text-[#c5a059]" /> Swimwear & towel
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle2 size={16} className="text-[#c5a059]" /> Polarized sunglasses
                </li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[#c5a059] font-black uppercase text-sm tracking-widest flex items-center gap-3">
                <Anchor size={18} /> Inclusions
              </h4>
              <ul className="space-y-4 text-sm text-gray-400">
                {tour.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4">
                    <CheckCircle2 size={16} className="text-[#c5a059]" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-[380px] flex-shrink-0">
          <div className="sticky top-28 flex flex-col gap-8">
            <div className="bg-[#001d3d] rounded-[2rem] border border-[#c5a059] p-8 pt-10 relative shadow-2xl">
              <h2 className="text-[#FFD700] text-[10px] font-black tracking-widest uppercase absolute -top-3 left-10 bg-[#001d3d] px-4 border border-[#c5a059] rounded-full">
                Adventure Add-Ons
              </h2>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {sharedAddOns.map((item) => (
                  <div key={item.name} className="flex flex-col border-b border-white/5 pb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold">
                        {item.name} <span className="text-[#c5a059] ml-1">${item.price}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQty(item.name, -1)} className="bg-[#c5a059] w-7 h-7 rounded text-black font-black">
                          -
                        </button>
                        <span className="min-w-[15px] text-center font-black text-xs">{addonQtys[item.name] || 0}</span>
                        <button onClick={() => updateQty(item.name, 1)} className="bg-[#c5a059] w-7 h-7 rounded text-black font-black">
                          +
                        </button>
                      </div>
                    </div>
                    {item.note && <p className="text-[9px] text-[#c5a059]/70 mt-2 italic">{item.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#001d3d] rounded-[2rem] border border-[#c5a059] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[#c5a059] text-[10px] font-black uppercase tracking-widest">Order Summary</h3>
                <div className="flex items-center gap-4 bg-black/40 px-4 py-1 rounded-full border border-[#c5a059]/30">
                  <button onClick={() => setGuestsAndSyncAddOns(Math.max(1, guests - 1))} className="text-[#c5a059] font-black">
                    -
                  </button>
                  <span className="font-black text-xs">{guests} GUESTS</span>
                  <button onClick={() => setGuestsAndSyncAddOns(Math.min(8, guests + 1))} className="text-[#c5a059] font-black">
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div className="flex justify-between text-gray-400">
                  <span>Base Charter</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>

                {guests > tour.includedGuests && (
                  <div className="flex justify-between text-gray-400">
                    <span>Extra Passengers</span>
                    <span>${extraPassengerPrice.toFixed(2)}</span>
                  </div>
                )}

                {selectedAddons.map((item) => (
                  <div key={item.name} className="flex justify-between text-[#c5a059] pl-4 border-l border-[#c5a059]/20 italic">
                    <span>
                      + {item.name} (x{addonQtys[item.name]})
                    </span>
                    <span>${(addonQtys[item.name] * item.price).toFixed(2)}</span>
                  </div>
                ))}

                <div className="h-[1px] bg-[#c5a059]/20 my-6" />

                <div className="flex justify-between text-gray-400">
                  <span>Tax (12.5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Service Fee (6%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>

                <div className="h-[1px] bg-[#c5a059]/20 my-6" />

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total</span>
                  <span className="text-[#fbbf24] text-3xl font-black">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full mt-8 py-5 bg-[#fbbf24] hover:bg-[#c5a059] text-black font-black text-xs uppercase rounded-2xl transition-all shadow-xl tracking-widest">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
