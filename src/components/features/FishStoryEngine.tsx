'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Dancing_Script } from 'next/font/google';
import assetManifest from '@/data/asset-manifest.json';
import { buildLiasTaleForAsset } from '@/lib/utils/lia-tales';
import { useSound } from '@/components/audio/SoundProvider';

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '600'] });

type StoryWallItem = {
  src: string;
  alt: string;
  caption: string;
  tale: string;
};

function makeCaption(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const openers = [
    'Salt in the air.',
    'Golden hour on the water.',
    'A clean line. A calm mind.',
    'Reef glow, ocean pull.',
    'Belize hits different.',
    'One cast away from a legend.',
  ];

  const closers = [
    'This is the moment you came for.',
    'File this under: unforgettable.',
    'Tell Lia the date—we’ll chase it again.',
    'Proof the Caribbean can feel cinematic.',
    'The kind of day that becomes a story.',
    'Next stop: the dock, then dinner.',
  ];

  const a = openers[hash % openers.length] || openers[0];
  const b = closers[(hash >>> 8) % closers.length] || closers[0];
  return `${a} ${b}`;
}

export default function FishStoryEngine() {
  const { setStoryMode } = useSound();
  const sectionRef = useRef<HTMLElement>(null);
  const [dailySeed] = useState<string>(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const on = Boolean(entry?.isIntersecting);
        setStoryMode(on);
      },
      { threshold: 0.2 }
    );

    obs.observe(node);
    return () => {
      obs.disconnect();
    };
  }, [setStoryMode]);

  const items = useMemo<StoryWallItem[]>(() => {
    const fallback = [
      `${base}/images/tours/deep-sea-fishing.jpg`,
      `${base}/images/tours/reef-fishing.jpg`,
      `${base}/images/tours/full-day-ultimate.jpg`,
      `${base}/images/tours/hol-chan-snorkel.jpg`,
      `${base}/images/tours/beach-bbq.jpg`,
      `${base}/images/tours/sunset-cruise.jpg`,
    ];

    const fromManifest = Array.isArray(assetManifest.images)
      ? (assetManifest.images.filter((s) => typeof s === 'string') as string[])
      : [];

    const renesActivitiesOnly = fromManifest.filter((src) => src.includes(`${base}/images/renes-activities/`));
    const isCatchShot = (src: string) => {
      const s = src.toLowerCase();
      return (
        s.includes('action') ||
        s.includes('caught') ||
        s.includes('catch') ||
        s.includes('fishing') ||
        s.includes('fish') ||
        s.includes('reel') ||
        s.includes('rod') ||
        s.includes('wahoo') ||
        s.includes('snapper')
      );
    };

    const catchPool = renesActivitiesOnly.filter(isCatchShot);
    const pool = catchPool.length ? catchPool : renesActivitiesOnly.length ? renesActivitiesOnly : fallback;

    const pick = (count: number, seed: string) => {
      const scored = pool.map((src) => {
        let h = 0;
        const s = `${seed}|${src}`;
        for (let i = 0; i < s.length; i += 1) {
          h = (h * 31 + s.charCodeAt(i)) >>> 0;
        }
        return { src, score: h };
      });
      scored.sort((a, b) => a.score - b.score);
      const selected = scored.slice(0, Math.min(count, scored.length)).map((x) => x.src);
      return selected;
    };

    if (!dailySeed) return [];
    const selected = pick(24, `fish-story-wall|${dailySeed}`);
    return selected.map((src, idx) => {
      const caption = makeCaption(`${src}|${idx}`);
      const tale = buildLiasTaleForAsset(src).legend;
      return { src, alt: `Fish story moment ${idx + 1}`, caption, tale };
    });
  }, [dailySeed]);

  return (
    <section id="fish-story" ref={sectionRef} className="py-24 bg-[#0F172A]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">The Story Wall</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-light text-white tracking-tight">
            Real moments.
            <span className="block font-serif italic text-[#D4AF37]">Vertical. Fast. Alive.</span>
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl font-light">
            A TikTok-style masonry of high-action frames—each one stamped with Lia’s Tale.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-gap:1.5rem]">
          {items.map((item, idx) => (
            <div
              key={`${item.src}-${idx}`}
              className="group mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl cursor-pointer"
            >
              <div className="relative w-full aspect-[9/16]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  quality={100}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />

                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/35 to-transparent transition-all duration-300 group-hover:from-black/70 group-hover:via-black/30">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37]/90">Lia’s Tale</div>
                  <div className={`${dancingScript.className} mt-1 text-white/90 text-[19px] leading-snug drop-shadow-sm transition-colors duration-300 group-hover:text-white`}>
                    {item.tale}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-white/80 leading-relaxed">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
