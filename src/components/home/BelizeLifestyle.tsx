'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface BelizeCard {
  id: string;
  videoId: string;
  category: string;
  headline: string;
  tagline: string;
  accent: string;
  startAt?: number;
}

const CARDS: BelizeCard[] = [
  {
    id: 'blue-hole',
    videoId: '4ZcEtPFdRaQ',
    category: 'Natural Wonder',
    headline: 'The Great Blue Hole',
    tagline: 'A 300-metre sinkhole visible from space',
    accent: '#38BDF8',
    startAt: 5,
  },
  {
    id: 'scuba',
    videoId: 'RmHsznIrE1w',
    category: 'Underwater World',
    headline: 'Scuba Diving Belize',
    tagline: 'Crystal-clear Caribbean waters await below',
    accent: '#FBBF24',
    startAt: 0,
  },
  {
    id: 'mustdos',
    videoId: 'i8yygBHJ84c',
    category: 'Bucket List',
    headline: 'Belize Must-Dos',
    tagline: 'The experiences you cannot leave without',
    accent: '#4ADE80',
    startAt: 5,
  },
  {
    id: 'maya',
    videoId: 'E05UjI_e3Qw',
    category: 'Ancient Mystery',
    headline: 'Portals to Xibalba',
    tagline: 'Walk through 1,000-year-old Maya ceremonies',
    accent: '#A78BFA',
    startAt: 15,
  },
  {
    id: 'island',
    videoId: 'cvZctS8kG68',
    category: 'Island Life',
    headline: 'Go Slow',
    tagline: 'No cars. No clocks. Just Caribbean.',
    accent: '#22D3EE',
    startAt: 20,
  },
  {
    id: 'reef',
    videoId: 'WGsfXh0Wj_M',
    category: 'Marine World',
    headline: 'The Living Reef',
    tagline: "World's 2nd largest barrier reef system",
    accent: '#34D399',
    startAt: 5,
  },
];

// Always start with hqdefault (guaranteed to exist).
// Silently probe maxresdefault — YouTube's fake 404 returns a 120px image,
// so we check naturalWidth > 120 before upgrading. Zero console errors.
function useThumbnail(videoId: string): string {
  const hq = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const [src, setSrc] = useState<string>(hq);

  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled && img.naturalWidth > 120) {
        setSrc(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);
      }
    };
    img.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  return src;
}

function VideoCard({ card }: { card: BelizeCard }) {
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const thumb = useThumbnail(card.videoId);

  const buildSrc = useCallback(
    (m: boolean) =>
      `https://www.youtube-nocookie.com/embed/${card.videoId}` +
      `?autoplay=1&mute=${m ? 1 : 0}&controls=0&modestbranding=1` +
      `&rel=0&showinfo=0&loop=1&playlist=${card.videoId}` +
      `&start=${card.startAt ?? 0}&iv_load_policy=3&fs=0`,
    [card.videoId, card.startAt]
  );

  const play = useCallback(() => {
    setLoaded(true);
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  // Scroll-triggered autoplay
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
          play();
        } else if (!entry.isIntersecting) {
          pause();
        }
      },
      { threshold: 0.7 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [play, pause]);

  const toggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const next = !muted;
      setMuted(next);
      if (iframeRef.current) {
        iframeRef.current.src = buildSrc(next);
      }
    },
    [muted, buildSrc]
  );

  return (
    <article
      ref={containerRef}
      onMouseEnter={play}
      onMouseLeave={pause}
      className="group relative w-full overflow-hidden rounded-2xl cursor-pointer select-none"
      style={{ aspectRatio: '16 / 10' }}
    >
      {/* THUMBNAIL — hqdefault guaranteed, upgrades silently if maxres exists */}
      <img
        src={thumb}
        alt={card.headline}
        loading="lazy"
        draggable={false}
        className={[
          'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
          playing ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      />

      {/* IFRAME — only mounted on first hover/scroll, hidden until playing */}
      {loaded && (
        <iframe
          ref={iframeRef}
          src={buildSrc(muted)}
          title={card.headline}
          allow="autoplay; encrypted-media"
          className={[
            'absolute inset-0 w-full h-full border-0 transition-opacity duration-500',
            playing ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          style={{ pointerEvents: playing ? 'auto' : 'none' }}
        />
      )}

      {/* BOTTOM GRADIENT — always on, text sits over this */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

      {/* PLAY ICON — visible only on hover before playing */}
      <div
        className={[
          'absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-200',
          playing
            ? 'opacity-0 scale-110'
            : 'opacity-0 group-hover:opacity-100 scale-100',
        ].join(' ')}
      >
        <div
          className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-sm"
          style={{ background: `${card.accent}30` }}
        >
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* BOTTOM TEXT STRIP — slim, over gradient only */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pointer-events-none">
        <span
          className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-0.5 rounded-full mb-2"
          style={{
            background: `${card.accent}22`,
            color: card.accent,
            border: `1px solid ${card.accent}50`,
          }}
        >
          {card.category}
        </span>

        <h3
          className="text-white text-xl font-bold leading-tight drop-shadow-lg"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {card.headline}
        </h3>

        {/* Tagline fades out while video plays */}
        <p
          className={[
            'text-white/65 text-xs mt-0.5 leading-snug transition-all duration-300',
            playing ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0',
          ].join(' ')}
        >
          {card.tagline}
        </p>
      </div>

      {/* MUTE BUTTON — top-right, only while playing */}
      {playing && (
        <button
          onClick={toggleMute}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      )}

      {/* HOVER ACCENT BORDER */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px ${card.accent}55` }}
      />
    </article>
  );
}

export default function BelizeLifestyle() {
  return (
    <section
      id="belize-lifestyle"
      className="relative bg-[#060608] py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #10b981, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent 65%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 px-4">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-emerald-400 mb-4">
            Discover · Belize
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The World&apos;s Last
            <span className="block italic text-emerald-400"> Wild Paradise</span>
          </h2>
          <p className="text-white/55 text-base md:text-lg leading-relaxed">
            Hawaii sells aloha. The Maldives sells blue. Belize sells something rarer —
            ancient ruins rising from living jungle, Garifuna drums echoing over the Caribbean,
            and a 300-metre ocean wonder beneath the surface.{' '}
            <span className="text-white/80 font-medium">Hover to experience it.</span>
          </p>
        </div>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {CARDS.map((card) => (
            <VideoCard key={card.id} card={card} />
          ))}
        </div>

        {/* CTA — Lia AI */}
        <div className="text-center mt-14 px-4">
          <p
            className="text-2xl md:text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Questions About Belize?
          </p>
          <p className="text-white/55 text-base mb-2 max-w-lg mx-auto leading-relaxed">
            Want to know the best time to visit? What to pack? Where to dive?
            <span className="text-white/80 font-medium"> Ask Lia — our AI Belize expert is available 24/7.</span>
          </p>
          <p className="text-white/35 text-sm mb-8">
            She knows every reef, ruin, and hidden gem on the island.
          </p>
          <button
            onClick={() => {
              const lia = document.getElementById('lia-chat');
              if (lia) lia.scrollIntoView({ behavior: 'smooth' });
              // Also trigger Lia open if she has a toggle
              const liaToggle = document.getElementById('lia-toggle');
              if (liaToggle) liaToggle.click();
            }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ask Lia — Your Belize Expert
          </button>
        </div>

      </div>
    </section>
  );
}
