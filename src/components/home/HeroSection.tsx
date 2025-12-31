'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const CHANNELS = [
  {
    id: 'deep-sea-fishing',
    title: 'Deep Sea Fishing',
    tagline: 'Big game fishing beyond the reef—where the ocean turns electric.',
    videoUrl: '/Videos/hero/deep-sea-fishing.mp4',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/deep-sea-fishing'
  },
  {
    id: 'reef-fishing',
    title: 'Reef Fishing',
    tagline: 'Cast your line in paradise—snappers, groupers, and pure Caribbean bliss.',
    videoUrl: '/Videos/hero/reef-fishing.mp4',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/reef-fishing'
  },
  {
    id: 'sunset-cruise',
    title: 'Sunset Cruise',
    tagline: 'Watch the sky ignite as the Caribbean melts into gold.',
    videoUrl: '/Videos/hero/sunset-cruise.mp4',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/sunset-cruise'
  },
  {
    id: 'blue-hole',
    title: 'Blue Hole Adventure',
    tagline: 'Dive into the icon—snorkel the Great Blue Hole and surrounding reefs.',
    videoUrl: '/Videos/hero/blue-hole.mp4',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/blue-hole-adventure'
  },
  {
    id: 'beach-bbq',
    title: 'Secret Beach',
    tagline: "The island's most vibrant beach party destination.",
    videoUrl: '/Videos/hero/beach-bbq.mp4',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/secret-beach'
  },
  {
    id: 'full-day',
    title: "Rene's Custom Adventure",
    tagline: 'The ultimate Belize experience—fish, snorkel, explore, and feast.',
    videoUrl: '/Videos/hero/full-day-ultimate.mp4',
    ctaText: 'Book This Adventure',
    ctaLink: '/tours/custom-adventure-bbq'
  }
];

export default function HeroSection() {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(5); // Start with Full Day
  const [isChangingChannel, setIsChangingChannel] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentChannel = CHANNELS[currentChannelIndex];

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    try {
      el.load();
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // ignore autoplay blocking
        });
      }
    } catch {
      // ignore
    }
  }, [currentChannel.videoUrl]);

  const switchChannel = (index: number) => {
    if (index === currentChannelIndex) return;

    setIsChangingChannel(true);

    setTimeout(() => {
      setCurrentChannelIndex(index);
      setIsChangingChannel(false);
    }, 300);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 transition-opacity duration-300 ${isChangingChannel ? 'opacity-0' : 'opacity-100'}`}>
          <video
            key={currentChannel.id}
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              transform: 'scale(1.08)',
              filter: 'brightness(0.85) contrast(1.1)'
            }}
            onLoadedMetadata={(e) => {
              const video = e.currentTarget;
              video.playbackRate = 0.5; // Slow-motion playback
            }}
          >
            <source src={currentChannel.videoUrl} type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-0 bg-black/50 z-[1]" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="mb-8">
            <div className="px-6 py-2 rounded-full border border-white/30 text-white/80 text-sm uppercase tracking-widest backdrop-blur-sm">
              Ambergris Caye, Belize
            </div>
          </div>

          <div className="text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">{currentChannel.title}</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">{currentChannel.tagline}</p>

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
    </section>
  );
}
