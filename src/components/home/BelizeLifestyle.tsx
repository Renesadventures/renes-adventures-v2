'use client';

import { useRef } from 'react';

interface VideoCard {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  tagline: string;
  videoSrc: string;
}

const CARDS: VideoCard[] = [
  {
    id: 'blue-hole',
    category: 'NATURAL WONDER',
    categoryColor: 'bg-blue-500',
    title: 'The Great Blue Hole',
    tagline: 'A 300-metre ocean wonder beneath the surface',
    videoSrc: '/videos/luxury/blue-hole-two.mp4',
  },
  {
    id: 'scuba',
    category: 'UNDERWATER WORLD',
    categoryColor: 'bg-cyan-500',
    title: 'Scuba Diving Belize',
    tagline: 'Caribbean waters await below',
    videoSrc: '/videos/luxury/speargun-one.mp4',
  },
  {
    id: 'must-dos',
    category: 'BUCKET LIST',
    categoryColor: 'bg-amber-500',
    title: 'Belize Must-Dos',
    tagline: 'The experiences you cannot leave without',
    videoSrc: '/videos/luxury/custom-adventure.mp4',
  },
  {
    id: 'xibalba',
    category: 'ANCIENT MYSTERY',
    categoryColor: 'bg-purple-500',
    title: 'Portals to Xibalba',
    tagline: 'Walk through 1,000-year-old Maya ceremonies',
    videoSrc: '/videos/luxury/sunset.mov',
  },
  {
    id: 'go-slow',
    category: 'ISLAND LIFE',
    categoryColor: 'bg-emerald-500',
    title: 'Go Slow',
    tagline: 'No cars. No clocks. Just Caribbean.',
    videoSrc: '/videos/luxury/secrete-beach.mp4',
  },
  {
    id: 'reef',
    category: 'MARINE WORLD',
    categoryColor: 'bg-teal-500',
    title: 'The Living Reef',
    tagline: "World's 2nd largest barrier reef system",
    videoSrc: '/videos/luxury/girl-snorkeling.mov',
  },
];

function VideoCard({ card }: { card: VideoCard }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleMouseEnter() {
    if (videoRef.current) videoRef.current.muted = false;
  }
  function handleMouseLeave() {
    if (videoRef.current) videoRef.current.muted = true;
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio: '9/14' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={card.videoSrc}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div>
          <span className={`inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-white px-2 py-1 rounded-full ${card.categoryColor}`}>
            {card.category}
          </span>
        </div>
        <div>
          <h3 className="text-white font-bold text-base leading-tight mb-1">{card.title}</h3>
          <p className="text-white/60 text-xs leading-snug">{card.tagline}</p>
        </div>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-white text-[10px]">🔊</span>
        </div>
      </div>
    </div>
  );
}

export default function BelizeLifestyle() {
  return (
    <section id="belize-lifestyle" className="bg-[#060608] py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-emerald-400 mb-3">
            DISCOVER · BELIZE
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            The World&apos;s Last<br />
            <span className="text-emerald-400 italic">Wild Paradise</span>
          </h2>
          <p className="text-white/60 text-base max-w-2xl mx-auto leading-relaxed">
            Hawaii sells aloha. The Maldives sells blue. Belize sells something rarer —
            ancient ruins rising from living jungle, Garifuna drums echoing over the Caribbean,
            and a 300-metre ocean wonder beneath the surface.{' '}
            <span className="text-white/80 italic">Hover to experience it.</span>
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {CARDS.map(card => (
            <VideoCard key={card.id} card={card} />
          ))}
        </div>
        <div className="text-center mt-14">
          <h3 className="text-white text-2xl font-bold mb-2">Questions About Belize?</h3>
          <p className="text-white/50 text-sm mb-2">
            Want to know the best time to visit? What to pack? Where to dive?{' '}
            <span className="text-white/70">Ask Lia</span> — our AI Belize expert is available 24/7.
          </p>
          <p className="text-white/30 text-xs mb-6">
            She knows every reef, ruin, and hidden gem on the island.
          </p>
          <button
            onClick={() => {
              const btn = document.querySelector('[data-lia-trigger]') as HTMLElement;
              btn?.click();
            }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full
                       bg-emerald-500 hover:bg-emerald-400 text-white font-bold
                       text-sm transition-all hover:-translate-y-0.5
                       hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            <span>💬</span> Ask Lia — Your Belize Expert
          </button>
        </div>
      </div>
    </section>
  );
}
