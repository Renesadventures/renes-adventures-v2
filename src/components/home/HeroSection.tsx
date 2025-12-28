'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Channel {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  tourLink: string;
  filterStyle: string;
}

const CHANNELS: Channel[] = [
  {
    id: 'deep-sea',
    name: 'Deep Sea Fishing',
    title: 'Deep Sea Fishing',
    subtitle: 'Battle marlins and sailfish in deep Caribbean waters',
    tourLink: '/tours/deep-sea-fishing',
    filterStyle: 'bg-orange-500/10',
  },
  {
    id: 'reef',
    name: 'Reef Fishing',
    title: 'Reef Fishing',
    subtitle: 'Target snappers and groupers on pristine reefs',
    tourLink: '/tours/reef-fishing',
    filterStyle: 'bg-teal-500/10',
  },
  {
    id: 'snorkel',
    name: 'Snorkeling',
    title: 'Hol Chan Marine Reserve',
    subtitle: 'Swim with nurse sharks, rays, and tropical fish',
    tourLink: '/tours/hol-chan-snorkel',
    filterStyle: 'bg-blue-400/10',
  },
  {
    id: 'sunset',
    name: 'Sunset Cruise',
    title: 'Caribbean Sunset Cruise',
    subtitle: 'Luxury evening sail with drinks and island views',
    tourLink: '/tours/sunset-cruise',
    filterStyle: 'bg-amber-500/20',
  },
  {
    id: 'beach-bbq',
    name: 'Beach BBQ',
    title: 'Private Beach BBQ',
    subtitle: 'Exclusive island beach with fresh-grilled seafood',
    tourLink: '/tours/beach-bbq',
    filterStyle: 'bg-pink-500/10',
  },
  {
    id: 'full-day',
    name: 'Full Day Adventure',
    title: 'The Ultimate Experience',
    subtitle: 'Fish, snorkel, explore, and feast—all in one day',
    tourLink: '/tours/full-day',
    filterStyle: 'bg-purple-500/10',
  },
];

export default function HeroSection() {
  const [currentChannel, setCurrentChannel] = useState(CHANNELS[CHANNELS.length - 1]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    try {
      el.playbackRate = 0.5;
    } catch {
      // ignore
    }

    const playPromise = el.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setVideoError(true);
      });
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <motion.video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={() => setVideoError(true)}
            style={{ transform: 'scale(1.08)' }}
            animate={{ scale: [1.08, 1.12, 1.08] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            <source src="https://www.genspark.ai/api/files/s/gn3tbkqr" type="video/mp4" />
            <source src="/videos/hero.mp4" type="video/mp4" />
          </motion.video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: 'url(https://www.genspark.ai/api/files/s/6hnbZRPM)' }}
          />
        )}

        <div className="absolute inset-0 bg-black/50 z-[1]" />
        <div className={`absolute inset-0 z-[2] transition-all duration-700 ${currentChannel.filterStyle}`} />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="px-6 py-2 rounded-full border border-white/30 text-white/80 text-sm uppercase tracking-widest backdrop-blur-sm">
              Ambergris Caye, Belize
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentChannel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-4xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">{currentChannel.title}</h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">{currentChannel.subtitle}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={currentChannel.tourLink}
                  className="px-8 py-4 bg-amber-500 text-gray-900 rounded-full font-bold hover:bg-amber-400 transition shadow-xl hover:shadow-2xl hover:scale-105 transform"
                >
                  Book This Adventure
                </a>
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('lia:open'));
                  }}
                  className="px-8 py-4 bg-white/20 text-white rounded-full font-bold hover:bg-white/30 transition backdrop-blur-md border border-white/30"
                >
                  Ask Lia About This Tour
                </button>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap gap-3 justify-center bg-black/30 backdrop-blur-md rounded-full p-4">
                  {CHANNELS.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setCurrentChannel(channel)}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                        currentChannel.id === channel.id
                          ? 'bg-white text-gray-900 shadow-lg'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {channel.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-16">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Scroll to discover</p>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 mx-auto">
              <motion.div
                className="w-1 h-3 bg-white/60 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
