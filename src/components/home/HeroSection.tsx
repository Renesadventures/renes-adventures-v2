'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSound } from '@/components/audio/SoundProvider';

const CHANNELS = [
  {
    id: 'deep-sea-fishing',
    title: 'Deep Sea Fishing',
    tagline: 'Big game fishing beyond the reef—where the ocean turns electric.',
    videoUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/deep-sea-fIshing.mp4`,
    fallbackImageUrl: '/images/tours/deep-sea-fishing.jpg',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/deep-sea-fishing'
  },
  {
    id: 'reef-fishing',
    title: 'Reef Fishing',
    tagline: 'Cast your line in paradise—snappers, groupers, and pure Caribbean bliss.',
    videoUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/reef-fishing.mp4`,
    fallbackImageUrl: '/images/tours/reef-fishing.jpg',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/reef-fishing'
  },
  {
    id: 'sunset-cruise',
    title: 'Sunset Ritual',
    tagline: 'Watch the sky ignite as the Caribbean melts into gold.',
    videoUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/sunset-ritual.mp4`,
    fallbackImageUrl: '/images/tours/sunset-cruise.jpg',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/sunset-cruise'
  },
  {
    id: 'blue-hole',
    title: 'Blue Hole Adventure',
    tagline: 'Dive into the icon—snorkel the Great Blue Hole and surrounding reefs.',
    videoUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/blue-hole.mp4`,
    fallbackImageUrl: '/images/tours/hol-chan-snorkel.jpg',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/blue-hole-adventure'
  },
  {
    id: 'secret-beach',
    title: 'Secret Beach',
    tagline: "The island's most vibrant beach party destination.",
    videoUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/secret-beach.mp4`,
    fallbackImageUrl: '/images/tours/beach-bbq.jpg',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/secret-beach'
  },
  {
    id: 'renes-custom-adventures',
    title: "Rene's Custom Adventures",
    tagline: 'The ultimate Belize experience—fish, snorkel, explore, and feast.',
    videoUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/renes-custom-adventures.mp4`,
    fallbackImageUrl: '/images/tours/full-day-ultimate.jpg',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/custom-charter'
  }
];

export default function HeroSection() {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0); // Start with Deep Sea
  const [videoVisible, setVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const { playSfx, ensureUnlocked } = useSound();

  const currentChannel = CHANNELS[currentChannelIndex];

  useEffect(() => {
    const video = videoRef.current;
    const url = currentChannel.videoUrl;

    if (!video) return;

    try {
      video.pause();
      video.removeAttribute('src');
      video.load();

      video.src = url;
      video.load();
    } catch {
      // If swap fails, onError will handle fallback.
    }

    return () => {
      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } catch {
        // no-op
      }
    };
  }, [currentChannel.videoUrl]);

  const switchChannel = (index: number) => {
    if (index === currentChannelIndex) return;

    void ensureUnlocked();

    setVideoVisible(false);
    setVideoFailed(false);

    setCurrentChannelIndex(index);
  };

  return (
    <section className="relative w-full bg-black">
      <div className="relative w-full h-screen max-h-[900px] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className={`absolute inset-0 transition-opacity duration-200 ${videoVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            {videoFailed ? (
              <Image
                src={currentChannel.fallbackImageUrl}
                alt={currentChannel.title}
                fill
                className="object-cover"
                style={{
                  transform: 'scale(1.06)'
                }}
                sizes="100vw"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                poster={currentChannel.fallbackImageUrl}
                className="w-full h-full object-cover"
                style={{
                  transform: 'scale(1.06)'
                }}
                onCanPlay={() => {
                  setVideoVisible(true);

                  try {
                    const p = videoRef.current?.play();
                    if (p && typeof (p as Promise<void>).catch === 'function') {
                      void (p as Promise<void>).catch(() => undefined);
                    }
                  } catch {
                    // no-op
                  }
                }}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  video.playbackRate = 0.5;
                }}
                onError={() => {
                  setVideoFailed(true);
                }}
              />
            )}
          </div>
        </div>
        <div className="relative z-10 h-full flex flex-col">
          <div className="mx-auto w-full max-w-7xl flex-1 flex flex-col items-center justify-center px-4">
            <div className="mb-8">
              <div className="px-6 py-2 rounded-full border border-white/30 text-white/80 text-sm uppercase tracking-widest backdrop-blur-sm">
                Ambergris Caye, Belize
              </div>
            </div>

            <div className="text-center max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">{currentChannel.title}</h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">{currentChannel.tagline}</p>

              {currentChannel.id === 'renes-custom-adventures' && (
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-white/85 text-xs uppercase tracking-[0.25em] mb-6">
                  25ft Center Console | 2025 Refit | Deep Sea Optimized
                </div>
              )}

              <Link
                href={currentChannel.ctaLink}
                className="px-8 py-4 bg-tropical-coral text-white rounded-full font-bold hover:bg-tropical-orange transition shadow-xl hover:shadow-2xl hover:scale-105 transform inline-block"
              >
                {currentChannel.ctaText}
              </Link>

              <div className="mt-8">
                <div className="flex flex-wrap gap-3 justify-center bg-black/30 backdrop-blur-md rounded-full p-4">
                  {CHANNELS.map((channel, index) => (
                    <button
                      key={channel.id}
                      onClick={() => switchChannel(index)}
                      onMouseEnter={() => {
                        void ensureUnlocked();
                        if (channel.id === 'deep-sea-fishing') playSfx('reel_click');
                        else if (channel.id === 'full-day') playSfx('champagne_pop');
                        else playSfx('wind');
                      }}
                      className={`
                        px-6 py-2 rounded-full text-sm font-medium transition-all
                        ${index === currentChannelIndex
                          ? 'bg-tropical-coral text-white shadow-lg'
                          : 'bg-tropical-turquoise/30 text-white hover:bg-tropical-turquoise/45'
                        }
                      `}
                    >
                      {channel.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Scroll to discover</p>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 mx-auto">
                <div
                  className="w-1 h-3 bg-white/60 rounded-full"
                  style={{ animation: 'hero-scroll 1.5s ease-in-out infinite' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
