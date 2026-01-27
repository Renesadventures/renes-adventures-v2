
'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { Tour } from '@/data/tours';
import { financialAddOnsBySlug, tours } from '@/data/tours';

import BookingEngine from '@/components/booking/BookingEngine';
import BrochureCta from './BrochureCta';

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

type VideoItem = {
  id: string;
  label: string;
  src: string;
};

type AddOnUiItem =
  | {
      id: string;
      label: string;
      unit: number;
      type: 'flat' | 'per_guest_toggle';
    };

function pickInitialVideo(videos: VideoItem[]) {
  return videos[0]?.src || `${base}/videos/hero/renes-custom-adventures.mp4`;
}

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TourLandingClient({
  tour,
  heroVideos
}: {
  tour: Tour;
  heroVideos: VideoItem[];
}) {
  const isCustomCharter = tour.slug === 'custom-charter';
  const hasFullDay = typeof tour.priceFullDay === 'number' && Number.isFinite(tour.priceFullDay) && tour.priceFullDay > 0;

  const [duration, setDuration] = useState<'half' | 'full' | null>(hasFullDay ? null : 'half');
  const [guests, setGuests] = useState(() => Math.max(1, Math.min(8, tour.includedGuests || 1)));
  const [largeGroup, setLargeGroup] = useState(false);
  const [qty, setQty] = useState<Record<string, number>>({});

  const effectiveGuests = largeGroup ? 9 : guests;

  const customAdventureCards = useMemo<VideoItem[]>(
    () => [
      { id: 'reef-fishing', label: 'Reef Fishing', src: `${base}/videos/hero/reef-fishing.mp4` },
      { id: 'spearfishing', label: 'Spearfishing', src: `${base}/videos/hero/renes-custom-adventures.mp4` },
      { id: 'lobster', label: 'Lobster', src: `${base}/videos/luxury/Lobster Fishing 1.mp4` },
      { id: 'conch', label: 'Conch', src: `${base}/videos/luxury/Conch Fishing 1.mp4` },
      { id: 'snorkel', label: 'Snorkel', src: `${base}/videos/hero/renes-custom-adventures.mp4` },
      { id: 'hol-chan', label: 'Hol Chan', src: `${base}/videos/hero/renes-custom-adventures.mp4` },
      { id: 'shark-ray-alley', label: 'Shark Ray Alley', src: `${base}/videos/hero/renes-custom-adventures.mp4` },
      { id: 'coral-gardens', label: 'Coral Gardens', src: `${base}/videos/hero/renes-custom-adventures.mp4` },
      { id: 'caye-caulker', label: 'Caye Caulker', src: `${base}/videos/hero/renes-custom-adventures.mp4` },
      { id: 'beach-bbq', label: 'Beach BBQ', src: `${base}/videos/hero/beach-bbq.mp4` }
    ],
    []
  );

  const videos = useMemo(() => {
    if (isCustomCharter) return [...customAdventureCards, ...heroVideos];
    return heroVideos;
  }, [customAdventureCards, heroVideos, isCustomCharter]);

  const quickClips = useMemo(() => {
    const fallbackThumbs = [
      `${base}/images/tours/full-day-ultimate.jpg`,
      `${base}/images/tours/deep-sea-fishing.jpg`,
      `${base}/images/tours/reef-fishing.jpg`,
      `${base}/images/tours/beach-bbq.jpg`,
    ];
    const clips = videos.slice(0, 4);
    return clips.map((v, idx) => ({ ...v, thumb: fallbackThumbs[idx] || tour.imageUrl }));
  }, [tour.imageUrl, videos]);

  const themedQuickClips = useMemo(() => {
    const themes = [
      {
        id: 'theme-fishing',
        label: 'Fishing',
        keywords: ['fish', 'fishing', 'spearfish', 'spearfishing', 'deep', 'reef'],
        thumb: `${base}/images/tours/deep-sea-fishing.jpg`,
      },
      {
        id: 'theme-snorkeling',
        label: 'Snorkeling',
        keywords: ['snorkel', 'reef', 'hol', 'chan', 'shark', 'ray'],
        thumb: `${base}/images/tours/hol-chan-snorkel.jpg`,
      },
      {
        id: 'theme-beach',
        label: 'Beach',
        keywords: ['beach', 'bbq', 'island', 'caye'],
        thumb: `${base}/images/tours/beach-bbq.jpg`,
      },
      {
        id: 'theme-vessel',
        label: 'Vessel',
        keywords: ['boat', 'cruise', 'sunset', 'charter'],
        thumb: tour.imageUrl,
      },
    ] as const;

    const normalized = videos.map((v) => ({
      ...v,
      norm: `${v.label} ${v.id}`.toLowerCase(),
    }));

    const picks = themes
      .map((t) => {
        const match = normalized.find((v) => t.keywords.some((k) => v.norm.includes(k)));
        const fallback = normalized[0];
        const chosen = match || fallback;
        if (!chosen) return null;
        return {
          id: t.id,
          label: t.label,
          src: chosen.src,
          thumb: t.thumb || tour.imageUrl,
        };
      })
      .filter(Boolean) as Array<{ id: string; label: string; src: string; thumb: string }>;

    const unique = new Map<string, { id: string; label: string; src: string; thumb: string }>();
    for (const item of picks) {
      if (!unique.has(item.id)) unique.set(item.id, item);
    }

    const list = Array.from(unique.values());
    if (list.length >= 4) return list.slice(0, 4);

    for (const extra of quickClips) {
      if (list.length >= 4) break;
      if (list.some((x) => x.src === extra.src)) continue;
      list.push({ id: `theme-extra-${extra.id}`, label: extra.label, src: extra.src, thumb: extra.thumb });
    }

    return list.slice(0, 4);
  }, [quickClips, tour.imageUrl, videos]);

  const [selectedVideo, setSelectedVideo] = useState(() => pickInitialVideo(videos));

  const selectedLabel = useMemo(() => {
    const match = videos.find((v) => v.src === selectedVideo);
    return match?.label || tour.title;
  }, [selectedVideo, tour.title, videos]);

  const addOns = useMemo<AddOnUiItem[]>(() => {
    const master = financialAddOnsBySlug[tour.slug] || financialAddOnsBySlug['custom-charter'] || [];

    return master.map((a) => ({
      id: a.id,
      label: a.title,
      unit: a.price,
      type: a.isPerGuest ? 'per_guest_toggle' : 'flat',
    }));
  }, [tour.slug]);

  const getQty = useCallback((id: string) => Math.max(0, qty[id] || 0), [qty]);
  const setQtyFor = useCallback((id: string, next: number) => {
    const clamped = Math.max(0, next);
    setQty((prev) => {
      const copy = { ...prev };
      if (clamped === 0) delete copy[id];
      else copy[id] = clamped;
      return copy;
    });
  }, []);

  const relatedTours = useMemo(() => tours.filter((t) => t.slug !== tour.slug).slice(0, 3), [tour.slug]);

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-3xl border border-white/10 bg-black/30 overflow-hidden flex-1 min-h-0 relative">
              <video
                key={selectedVideo}
                src={selectedVideo}
                className="w-full h-full object-cover"
                controls
                playsInline
                autoPlay
                muted
                loop
                preload="metadata"
                poster={tour.imageUrl}
              />

              <div className="absolute left-0 right-0 bottom-0 p-5 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Now Playing</div>
                <div className="mt-2 text-2xl font-extrabold text-white leading-tight">{selectedLabel}</div>
                <div className="mt-2 text-sm text-white/70 line-clamp-2">{tour.description}</div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-white/60">Quick Clips</div>
                  <div className="mt-2 text-sm text-white/70">Tap a thumbnail to switch the main video instantly.</div>
                </div>
              </div>

              <div
                className={`mt-4 flex gap-3 ${
                  themedQuickClips.length >= 4
                    ? 'overflow-x-auto pb-2 overscroll-x-contain [scrollbar-width:thin] [scrollbar-color:rgba(212,175,55,0.7)_rgba(255,255,255,0.08)]'
                    : 'overflow-x-visible'
                }`}
              >
                {themedQuickClips.map((v) => {
                  const active = v.src === selectedVideo;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVideo(v.src)}
                      className={`group shrink-0 w-56 rounded-2xl border overflow-hidden text-left transition ${
                        active ? 'border-[#D4AF37]/80 bg-[#D4AF37]/10' : 'border-white/15 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="relative h-24">
                        <Image src={v.thumb} alt="" fill className="object-cover opacity-90 group-hover:opacity-100 transition" sizes="240px" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute left-4 bottom-3 right-4">
                          <div className="text-[10px] uppercase tracking-[0.35em] text-white/70">Quick Clip</div>
                          <div className="mt-1 font-semibold text-white leading-tight line-clamp-1">{v.label}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 text-[12px] leading-relaxed text-white/65">
                <span className="font-semibold text-white/80">Cancellation &amp; Refund:</span> Cancellations made within 24 hours of departure are
                non-refundable. Weather-related safety cancellations will be rescheduled when possible.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-white/60">Add-On Panel</div>
                  <div className="mt-2 text-sm text-white/70">Adjust add-on quantities. Totals update instantly.</div>
                </div>
              </div>

              <div className="mt-4 max-h-[300px] overflow-y-auto pr-4 space-y-3">
                {addOns.map((a) => {
                  const q = getQty(a.id);
                  const subtitle = a.type === 'per_guest_toggle' ? `${formatMoney(a.unit)} per guest` : `${formatMoney(a.unit)} each`;

                  return (
                    <div key={a.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white/90">{a.label}</div>
                          <div className="mt-1 text-xs text-white/60 leading-relaxed">{subtitle}</div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            disabled={q <= 0}
                            onClick={() => setQtyFor(a.id, q - 1)}
                            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition disabled:opacity-40 disabled:hover:bg-white/5"
                          >
                            −
                          </button>
                          <div className="min-w-[28px] text-center text-white font-semibold">{q}</div>
                          <button
                            type="button"
                            onClick={() => setQtyFor(a.id, q <= 0 ? effectiveGuests : q + 1)}
                            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {isCustomCharter && (
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Custom Adventure Menu</div>
                <div className="mt-2 text-sm text-white/70">
                  Choose a signature experience. Clicking a card updates the main frame instantly.
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {customAdventureCards.map((card) => {
                    const active = card.src === selectedVideo;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedVideo(card.src)}
                        className={`min-h-[64px] rounded-2xl border px-3 py-3 text-center text-sm font-semibold transition ${
                          active ? 'border-[#FFD400] bg-[#FFD400] text-black' : 'border-white/15 bg-white/5 text-white/90 hover:bg-white/10'
                        }`}
                      >
                        {card.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-[#D4AF37]/25 bg-[#1E293B] p-4 shadow-2xl">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-white/60">{tour.title}</div>
                  <div className="mt-2 text-3xl font-extrabold text-[#D4AF37]">${tour.price.toLocaleString('en-US')}</div>
                  {tour.priceFullDay && (
                    <div className="mt-1 text-sm text-white/60">Full Day: ${tour.priceFullDay.toLocaleString('en-US')}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-[0.35em] text-white/60">Capacity</div>
                  <div className="mt-2 text-sm font-semibold text-white">Online booking 1–8</div>
                </div>
              </div>

              <div className="mt-5">
                <BookingEngine
                  tourName={tour.title}
                  tourSlug={tour.slug}
                  basePrice={tour.price}
                  fullDayPrice={tour.priceFullDay}
                  includedGuests={tour.includedGuests}
                  duration={duration}
                  onDurationChange={setDuration}
                  guests={guests}
                  onGuestsChange={setGuests}
                  largeGroup={largeGroup}
                  onLargeGroupChange={setLargeGroup}
                  qty={qty}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.35em] text-white/60">Tour Summary</div>
                <div className="mt-3 grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/70">Duration</span>
                    <span className="text-white">{tour.duration}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/70">Included Guests</span>
                    <span className="text-white">{tour.includedGuests}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/70">Additional Passenger</span>
                    <span className="text-white">$75</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-3xl bg-[#D4AF37] p-5 shadow-gold">
                <BrochureCta tourSlug={tour.slug} tourTitle={tour.title} />
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 grid gap-8">
          <section className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Why This Tour is Unforgettable</div>
              <h2 className="mt-3 text-3xl md:text-4xl font-serif font-semibold text-white">Island Time, designed like a luxury day.</h2>
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 grid gap-4">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 min-h-[180px]">
                    <Image src={tour.imageUrl} alt="" fill className="object-cover" sizes="(min-width: 1024px) 66vw, 100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute left-6 right-6 bottom-6">
                      <div className="text-[11px] uppercase tracking-[0.35em] text-white/70">Private Charter</div>
                      <div className="mt-2 text-2xl font-semibold text-white">Your pace. Your plan. Your best Belize.</div>
                      <div className="mt-2 text-sm text-white/70">A premium experience that flexes with your energy and the conditions.</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 min-h-[160px]">
                      <Image src={`${base}/images/tours/reef-fishing.jpg`} alt="" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
                      <div className="absolute inset-0 bg-black/45" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]/90">Action</div>
                        <div className="mt-2 text-white font-semibold">Fishing that turns into stories.</div>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 min-h-[160px]">
                      <Image src={`${base}/images/tours/beach-bbq.jpg`} alt="" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
                      <div className="absolute inset-0 bg-black/45" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]/90">Reset</div>
                        <div className="mt-2 text-white font-semibold">Beach calm, done right.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                  <div className="text-[11px] uppercase tracking-[0.35em] text-white/60">What makes it different</div>
                  <div className="mt-4 grid gap-4 text-white/75 leading-relaxed">
                    <div>
                      <div className="font-semibold text-white">Personalized routing</div>
                      <div className="mt-1 text-sm text-white/70">Not a script. We shape the day around your priorities.</div>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Premium pacing</div>
                      <div className="mt-1 text-sm text-white/70">Fast when you want adrenaline, slow when you want to breathe.</div>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Crew-led ease</div>
                      <div className="mt-1 text-sm text-white/70">We keep everything seamless—gear ready, timing tight, no stress.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl overflow-hidden">
            <Image src={`${base}/images/tours/deep-sea-fishing.jpg`} alt="" fill className="object-cover opacity-35" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/70" />
            <div className="relative p-8">
            <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Featured Fish Story</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif font-semibold text-white">The moment the water explodes.</h2>
            <div className="mt-4 text-white/75 leading-relaxed space-y-4">
              <p>
                You feel the tap—then the line goes tight. The boat pivots. Someone shouts directions. Your heart spikes. The fish runs hard and the sea
                turns electric.
              </p>
              <p>
                That’s the Island Time effect: calm luxury with sudden, cinematic action. You don’t just catch fish—you collect stories you’ll repeat for
                years.
              </p>
            </div>
            </div>
          </section>

          <section className="relative rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl overflow-hidden">
            <Image src={`${base}/images/tours/reef-fishing.jpg`} alt="" fill className="object-cover opacity-30" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/80" />
            <div className="relative p-8">
            <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Islander Time</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif font-semibold text-white">We shape the day around your energy—not a fixed checklist.</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-white/60">Start</div>
                <div className="mt-2 text-white font-semibold">Pick your vibe</div>
                <div className="mt-2 text-sm text-white/70">Tell us what matters most—action, reef time, island stops, food, or all of it.</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-white/60">Peak</div>
                <div className="mt-2 text-white font-semibold">Adjust in real time</div>
                <div className="mt-2 text-sm text-white/70">Conditions change. Your mood changes. We pivot the route to keep it perfect.</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-white/60">Finish</div>
                <div className="mt-2 text-white font-semibold">Close it out in island calm</div>
                <div className="mt-2 text-sm text-white/70">The last swim, final photos, and a slow cruise back—no rushed endings.</div>
              </div>
            </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">What to Bring</div>
              <div className="mt-4 grid gap-3 text-white/75">
                {[
                  { label: 'Reef-safe sunscreen', icon: 'sun' },
                  { label: 'Swimsuit + towel', icon: 'swim' },
                  { label: 'Hat + polarized sunglasses', icon: 'glasses' },
                  { label: 'Light jacket (boat wind can surprise you)', icon: 'jacket' },
                  { label: 'Phone case or dry bag', icon: 'bag' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    {item.icon === 'sun' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-[#D4AF37]">
                        <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M12 1v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M12 20v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M4.22 4.22l2.12 2.12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M17.66 17.66l2.12 2.12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M1 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M20 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M4.22 19.78l2.12-2.12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    ) : item.icon === 'glasses' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-[#D4AF37]">
                        <path d="M7 14a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M17 14a3 3 0 0 0 3-3V9a2 2 0 0 0-2-2h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M4 9l-1 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M20 9l1 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-[#D4AF37]">
                        <path d="M6 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M7 8v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    )}
                    <div>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Included</div>
              <div className="mt-4 grid gap-3 text-white/75">
                {[
                  { label: 'Expert local captain + crew', icon: 'crew' },
                  { label: 'Ice & water', icon: 'water' },
                  { label: 'Core gear (as applicable to your plan)', icon: 'gear' },
                  { label: 'Help planning the perfect route', icon: 'route' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    {item.icon === 'water' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-[#D4AF37]">
                        <path d="M12 22a7 7 0 0 0 7-7c0-4-7-13-7-13S5 11 5 15a7 7 0 0 0 7 7Z" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    ) : item.icon === 'route' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-[#D4AF37]">
                        <path d="M6 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M18 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M6 9c0 5 8 1 8 6s4 2 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-[#D4AF37]">
                        <path d="M12 2l3 6 6 1-4.5 4.4 1.1 6.6L12 17.8 6.4 20l1.1-6.6L3 9l6-1 3-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      </svg>
                    )}
                    <div>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Pickup Information</div>
              <div className="mt-4 flex items-start gap-3 text-white/75 leading-relaxed">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-[#D4AF37]">
                  <path d="M12 22s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <div>
                  We’ll confirm pickup details after booking. If you’re staying on an island, we’ll coordinate the smoothest meeting point.
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Language</div>
              <div className="mt-4 grid gap-3 text-white/75">
                <div className="flex items-start gap-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-[#D4AF37]">
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3.6 9h16.8" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3.6 15h16.8" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 3c2.5 2.7 3.8 5.9 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.9-3.8-9S9.5 5.7 12 3Z" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">English</div>
                    <div className="text-sm text-white/70">Clear communication for planning, safety, and the perfect pace.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-[#D4AF37]">
                    <path d="M7 10h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M9 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <div>
                    <div className="font-semibold text-white">Spanish</div>
                    <div className="text-sm text-white/70">Available depending on crew rotation—ask and we’ll confirm.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8">
            <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Reviews & Testimonials</div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { quote: 'Best day of our trip.', body: 'Luxury service, nonstop fun, and the crew made everything effortless.', name: 'Verified Guest', initial: 'V' },
                { quote: 'We still talk about it.', body: 'The fishing action + island stops felt like a movie.', name: 'Verified Guest', initial: 'G' },
                { quote: 'Worth every dollar.', body: 'Private, premium, and perfectly paced. Would book again instantly.', name: 'Verified Guest', initial: 'R' },
              ].map((t) => (
                <div key={t.quote} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8b6b14] flex items-center justify-center text-slate-950 font-black">
                        {t.initial}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{t.name}</div>
                        <div className="text-[11px] uppercase tracking-[0.25em] text-white/55">Verified</div>
                      </div>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37]/90">★★★★★</div>
                  </div>
                  <div className="mt-4 text-white font-semibold">“{t.quote}”</div>
                  <div className="mt-2 text-sm text-white/70 leading-relaxed">{t.body}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8">
            <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">You Might Also Like</div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTours.map((t) => (
                <Link
                  key={t.id}
                  href={`/tours/${t.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/15 min-h-[220px] shadow-2xl hover:border-[#D4AF37]/40 transition"
                >
                  <Image src={t.imageUrl} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" sizes="(min-width: 768px) 33vw, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]/80">Luxury Tour</div>
                    <div className="mt-2 text-2xl font-serif font-semibold text-white leading-tight">{t.title}</div>
                    <div className="mt-2 text-sm text-white/70">From ${t.price.toLocaleString('en-US')}</div>
                    <div className="mt-4 inline-flex w-fit items-center rounded-full bg-[#D4AF37] text-slate-950 font-extrabold px-4 py-2 text-xs uppercase tracking-[0.25em]">
                      View Tour
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
