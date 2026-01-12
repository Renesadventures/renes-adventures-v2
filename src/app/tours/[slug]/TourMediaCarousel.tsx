'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

export default function TourMediaCarousel({
  images,
  alt,
  posterUrl
}: {
  images: string[];
  alt: string;
  posterUrl: string;
}) {
  const slides = useMemo(() => {
    const cleaned = images.filter(Boolean);
    return cleaned.length ? cleaned : [''];
  }, [images]);

  const [index, setIndex] = useState(0);
  const [mediaHidden, setMediaHidden] = useState(false);
  const [transitionActive, setTransitionActive] = useState(false);
  const [transitionPoster, setTransitionPoster] = useState<string | null>(null);
  const canPlayGateRef = useRef(false);
  const minDelayGateRef = useRef(false);
  const finishTransition = useRef<(() => void) | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    finishTransition.current = () => {
      if (!transitionActive) return;
      if (!canPlayGateRef.current) return;
      if (!minDelayGateRef.current) return;

      setMediaHidden(false);
      setTransitionActive(false);
    };
  }, [transitionActive]);

  const switchTo = (next: number) => {
    if (slides.length <= 1) return;
    const nextIndex = (next + slides.length) % slides.length;
    if (nextIndex === index) return;

    const nextSrc = slides[nextIndex];
    const nextIsVideo = typeof nextSrc === 'string' && nextSrc.toLowerCase().endsWith('.mp4');
    setTransitionPoster(nextIsVideo ? posterUrl : nextSrc || posterUrl);
    setTransitionActive(true);
    setMediaHidden(true);

    canPlayGateRef.current = false;
    minDelayGateRef.current = false;

    setIndex(nextIndex);

    window.setTimeout(() => {
      minDelayGateRef.current = true;
      finishTransition.current?.();
    }, 200);

    window.setTimeout(() => {
      try {
        const v = videoRef.current;
        v?.pause();
        v?.removeAttribute('src');
        v?.load();
      } catch {
        // no-op
      }
    }, 250);
  };
  const current = slides[index] || slides[0];
  const isVideo = typeof current === 'string' && current.toLowerCase().endsWith('.mp4');

  return (
    <div className="relative w-full h-full">
      <div className={`absolute inset-0 transition-opacity duration-200 ${mediaHidden ? 'opacity-0' : 'opacity-100'}`}>
        {current ? (
          isVideo ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              poster={posterUrl}
              className="w-full h-full object-cover"
              src={current}
              onCanPlay={() => {
                canPlayGateRef.current = true;
                finishTransition.current?.();
              }}
              onLoadedMetadata={(e) => {
                e.currentTarget.playbackRate = 0.5;
              }}
              onError={() => {
                canPlayGateRef.current = true;
                finishTransition.current?.();
              }}
            >
              <source src={current} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={current}
              alt={alt}
              fill
              className="object-cover"
              sizes="100vw"
              onLoadingComplete={() => {
                canPlayGateRef.current = true;
                finishTransition.current?.();
              }}
            />
          )
        ) : (
          <div className="w-full h-full bg-slate-950" />
        )}
      </div>

      {transitionPoster && (
        <div className={`absolute inset-0 z-[2] ${transitionActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
          <div className="absolute inset-0 bg-black" />
          <Image
            src={transitionPoster}
            alt="Tour media transition"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
        </div>
      )}

      {slides.length > 1 && (
        <div className="absolute left-0 right-0 bottom-0 z-[3] bg-black/30 backdrop-blur-md border-t border-white/10">
          <div className="mx-auto w-full px-4 py-3">
            <div className="flex gap-3 overflow-x-auto pb-2 overscroll-x-contain [scrollbar-width:thin] [scrollbar-color:rgba(212,175,55,0.7)_rgba(255,255,255,0.08)]">
              {slides.slice(0, 12).map((src, i) => {
                const active = i === index;
                const isThumbVideo = typeof src === 'string' && src.toLowerCase().endsWith('.mp4');
                const thumb = isThumbVideo ? posterUrl : src;

                return (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    aria-label={`Select media ${i + 1}`}
                    onClick={() => switchTo(i)}
                    className={`relative h-20 w-36 shrink-0 overflow-hidden rounded-xl border transition ${
                      active
                        ? 'border-[#D4AF37]/70 ring-2 ring-[#D4AF37]/30'
                        : 'border-white/15 hover:border-white/30'
                    }`}
                  >
                    {thumb ? (
                      <Image src={thumb} alt="" fill className="object-cover object-top" sizes="200px" />
                    ) : (
                      <div className="absolute inset-0 bg-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
