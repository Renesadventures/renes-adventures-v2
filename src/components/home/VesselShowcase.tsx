'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

type MediaItem =
  | { type: 'video'; src: string; label: string }
  | { type: 'image'; src: string; alt: string; label: string };

const MEDIA: MediaItem[] = [
  {
    type: 'video',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/vessel-section-video.mp4',
    label: 'The Vessel',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/captain-rene.jpeg',
    alt: 'Captain René',
    label: 'Captain René',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-one.jpeg',
    alt: 'The boat',
    label: 'The Boat',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-two.jpeg',
    alt: 'Boat on the water',
    label: 'On the Water',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-three.jpeg',
    alt: 'Boat at sea',
    label: 'Open Sea',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-deck.jpeg',
    alt: 'Boat deck',
    label: 'The Deck',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-deck-two.jpg',
    alt: 'Boat deck view',
    label: 'Deck View',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-cabin.jpg',
    alt: 'Boat cabin',
    label: 'The Cabin',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-deep-sea-fishing.jpg',
    alt: 'Deep sea fishing from the boat',
    label: 'Deep Sea',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-snorkeling.jpg',
    alt: 'Snorkeling from the boat',
    label: 'Snorkeling',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-family-sunset.png',
    alt: 'Family on the boat at sunset',
    label: 'Sunset Family',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-sunset.png',
    alt: 'Boat at sunset',
    label: 'Golden Hour',
  },
  {
    type: 'image',
    src: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/boat-no-background.png',
    alt: 'The vessel',
    label: 'Full View',
  }
];

const SPECS = [
  { label: 'Vessel', value: 'White 25 ft Center Console' },
  { label: 'Capacity', value: 'Up to 8 Guests' },
  { label: 'Amenities', value: 'Ice Cooler · Sound System · Shade' },
  { label: 'Safety', value: 'Life Jackets · First Aid · Marine Radio' },
];

export default function VesselShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const filmstripRef = useRef<HTMLDivElement>(null);

  const active = MEDIA[activeIndex];

  function scrollFilmstrip(dir: 'left' | 'right') {
    if (filmstripRef.current) {
      filmstripRef.current.scrollBy({
        left: dir === 'right' ? 300 : -300,
        behavior: 'smooth',
      });
    }
  }

  function goTo(index: number) {
    setActiveIndex(index);
    const thumb = filmstripRef.current?.children[index] as HTMLElement;
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  return (
    <section id="vessel" className="bg-[#060608] py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400 mb-3">
            BUILT FOR BELIZE
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            The Vessel &amp; Her Captain
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
            A 25-foot center console built for the Caribbean — fast enough to reach
            the Blue Hole, shallow enough to anchor at Secret Beach.
          </p>
        </div>

        {/* ── MAIN FRAME ── */}
        <div
          className="relative rounded-2xl overflow-hidden bg-black mb-4"
          style={{ aspectRatio: '16/9' }}
        >
          {active.type === 'video' ? (
            <video
              key="vessel-video"
              src={active.src}
              suppressHydrationWarning
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              key={active.src}
              src={(active as Extract<MediaItem, { type: 'image' }>).src}
              alt={(active as Extract<MediaItem, { type: 'image' }>).alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1152px"
            />
          )}

          {/* Label */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
            <span className="text-white font-semibold text-sm tracking-wide">
              {active.label}
            </span>
            <span className="text-white/40 text-xs ml-3">
              {activeIndex + 1} / {MEDIA.length}
            </span>
          </div>

          {/* Prev arrow on main frame */}
          <button
            onClick={() => goTo((activeIndex - 1 + MEDIA.length) % MEDIA.length)}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full
                       bg-black/60 hover:bg-black/90 text-white flex items-center
                       justify-center transition-all backdrop-blur-sm text-xl font-light"
          >
            ‹
          </button>

          {/* Next arrow on main frame */}
          <button
            onClick={() => goTo((activeIndex + 1) % MEDIA.length)}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full
                       bg-black/60 hover:bg-black/90 text-white flex items-center
                       justify-center transition-all backdrop-blur-sm text-xl font-light"
          >
            ›
          </button>
        </div>

        {/* ── FILMSTRIP ── */}
        <div className="relative flex items-center gap-2">

          {/* Left scroll arrow */}
          <button
            onClick={() => scrollFilmstrip('left')}
            aria-label="Scroll left"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-amber-400
                       text-white hover:text-black flex items-center justify-center
                       transition-all text-lg"
          >
            ‹
          </button>

          {/* Thumbnails */}
          <div
            ref={filmstripRef}
            className="flex gap-2 overflow-x-auto flex-1 py-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {MEDIA.map((item, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200
                            ${activeIndex === i
                              ? 'ring-2 ring-amber-400 scale-105 opacity-100'
                              : 'opacity-50 hover:opacity-80'
                            }`}
                style={{ width: 110, height: 70 }}
              >
                {item.type === 'video' ? (
                  <>
                    <video
                      src={item.src}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center">
                        <span className="text-black text-[10px] ml-0.5">▶</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <Image
                    src={(item as Extract<MediaItem, { type: 'image' }>).src}
                    alt={(item as Extract<MediaItem, { type: 'image' }>).alt}
                    fill
                    className="object-cover"
                    sizes="110px"
                  />
                )}
                {/* Active underline */}
                {activeIndex === i && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
                )}
              </button>
            ))}
          </div>

          {/* Right scroll arrow */}
          <button
            onClick={() => scrollFilmstrip('right')}
            aria-label="Scroll right"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-amber-400
                       text-white hover:text-black flex items-center justify-center
                       transition-all text-lg"
          >
            ›
          </button>
        </div>

        {/* ── SPECS BAR ── */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {SPECS.map((spec) => (
            <div
              key={spec.label}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
            >
              <p className="text-white/40 text-[11px] uppercase tracking-widest mb-1">
                {spec.label}
              </p>
              <p className="text-white text-sm font-semibold leading-snug">
                {spec.value}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
