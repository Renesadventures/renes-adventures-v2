'use client';

import { useMemo, useState } from 'react';

export default function TourMediaCarousel({
  images,
  alt
}: {
  images: string[];
  alt: string;
}) {
  const slides = useMemo(() => {
    const cleaned = images.filter(Boolean);
    return cleaned.length ? cleaned : [''];
  }, [images]);

  const [index, setIndex] = useState(0);
  const current = slides[index] || slides[0];

  return (
    <div className="relative w-full h-full">
      {current ? (
        <img src={current} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-900" />
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => setIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center"
          >
            ›
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full border border-white/50 transition ${
                  i === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
