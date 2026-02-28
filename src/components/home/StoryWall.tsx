'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Share2, X, Volume2, VolumeX, Camera, Sparkles } from 'lucide-react';

type StoryItem = {
  id: number;
  caption: string;
  guest: string;
  narrative: string;
  avatar: string;
  videoSrc: string;
  accent: string;
  accentBg: string;
};

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

export default function StoryWall() {
  const stories = useMemo<StoryItem[]>(
    () => [
      {
        id: 1,
        videoSrc: `${base}/luxury/Deep Sea Fishing 5.mp4`,
        caption: 'The Moment It Hit',
        guest: 'Jake & Maria',
        narrative:
          "The rod bent in half. Maria screamed. I grabbed the fighting belt and held on. Forty minutes later, a 45-lb mahi surfaced — neon green under the Caribbean sun. Captain René just nodded and said 'That's Belize.' We cried. Not kidding.",
        avatar: '🎣',
        accent: 'text-amber-300',
        accentBg: 'from-amber-600/90 via-orange-700/85 to-amber-900/90',
      },
      {
        id: 2,
        videoSrc: '/videos/luxury/star-fish.mp4',
        caption: 'Golden Hour',
        guest: 'Jake & Marina',
        narrative:
          "She stopped mid-stride. The water barely reached her knees.\nShe reached down and came up with a starfish — red as a flare, wide as her hand.\nThat's the thing about Belize. The magic finds you.",
        avatar: '🌅',
        accent: 'text-rose-300',
        accentBg: 'from-rose-600/90 via-pink-700/85 to-rose-900/90',
      },
      {
        id: 3,
        videoSrc: '/videos/luxury/beach-bbq.mov',
        caption: 'Feast Mode Activated',
        guest: 'Danny R.',
        narrative:
          "René dove under and came up with two lobsters the size of my forearm. We grilled them on a sandbar beach with lime and butter. I've eaten at Michelin restaurants in New York. This was better. Fight me.",
        avatar: '🦞',
        accent: 'text-red-300',
        accentBg: 'from-red-600/90 via-rose-800/85 to-red-950/90',
      },
      {
        id: 4,
        videoSrc: `${base}/luxury/Reef Fishing 6.mp4`,
        caption: 'Into the blue',
        guest: 'Aisha & Dev',
        narrative:
          "First cast on the reef — something grabbed it and RAN. Ten minutes of chaos. Pulled up a beautiful yellowtail snapper. Dev caught six more. We ate them all at the beach BBQ two hours later, still sunburned, completely alive.",
        avatar: '🐠',
        accent: 'text-cyan-300',
        accentBg: 'from-cyan-600/90 via-teal-700/85 to-cyan-900/90',
      },
      {
        id: 5,
        videoSrc: '/videos/luxury/grilling-hot-dogs-beach-bbq.mov',
        caption: 'Beach Vibes Only',
        guest: 'The Rivera Crew',
        narrative:
          "Hotdogs on the grill. Smoke rising over turquoise water.\nSomeone cracked a Belikin. Nobody had anywhere to be.\nThe best beach days are the ones nobody plans.",
        avatar: '🏖️',
        accent: 'text-orange-300',
        accentBg: 'from-orange-600/90 via-amber-700/85 to-orange-900/90',
      },
      {
        id: 6,
        videoSrc: '/videos/luxury/sunset-proposal.mov',
        caption: "Captain's Call",
        guest: 'Emmy & Daniel',
        narrative:
          "He didn't say a word. Just took her hand and turned her toward the sun.\nThe sky went amber, then crimson, then something without a name.\nShe knew before he asked. The answer was already yes.",
        avatar: '⚓',
        accent: 'text-violet-300',
        accentBg: 'from-violet-600/90 via-purple-800/85 to-violet-950/90',
      },
      {
        id: 7,
        videoSrc: `${base}/hero/blue-hole.mp4`,
        caption: 'Pure Belize',
        guest: 'The Patels',
        narrative:
          "When the water turned from turquoise to that deep, impossible blue — my daughter grabbed my hand and whispered 'Daddy, is this real?' The Great Blue Hole. You see it in photos. You feel it in your chest. Nothing prepares you.",
        avatar: '💎',
        accent: 'text-blue-300',
        accentBg: 'from-blue-600/90 via-indigo-700/85 to-blue-900/90',
      },
      {
        id: 8,
        videoSrc: '/videos/luxury/deep-sea-fishing-two.mp4',
        caption: 'Trophy Time',
        guest: 'Big Mike',
        narrative:
          "Three hours offshore. Rod doubles over. The reel is SCREAMING. I fought that wahoo for 25 minutes, arms shaking, legs braced. When it surfaced — 55 pounds of silver lightning. René hooked me up with a mount shop. That fish is on my wall now.",
        avatar: '🏆',
        accent: 'text-emerald-300',
        accentBg: 'from-emerald-600/90 via-green-800/85 to-emerald-950/90',
      },
      {
        id: 9,
        videoSrc: '/videos/luxury/speargun-one.mp4',
        caption: 'Once More With Feeling',
        guest: 'Sofia & Leo',
        narrative:
          "Our third trip with René. Every time we say it can't get better. Every time it does. This time Leo speargunned his own dinner. He's twelve. The look on his face when he surfaced holding that fish — that's the photo on our Christmas card.",
        avatar: '🌴',
        accent: 'text-lime-300',
        accentBg: 'from-lime-600/90 via-emerald-700/85 to-lime-900/90',
      },
    ],
    []
  );

  const [flippedId, setFlippedId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [modalMuted, setModalMuted] = useState(true);

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const activeStory = useMemo(() => stories.find((s) => s.id === activeId) || null, [activeId, stories]);

  const openModal = useCallback((story: StoryItem) => {
    setActiveId(story.id);
    setModalMuted(true);
  }, []);

  const closeModal = useCallback(() => {
    setActiveId(null);
    setModalMuted(true);
  }, []);

  /* --- Intersection observer for lazy loading + autoplay ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const node = entry.target as HTMLElement;
          const storyId = node.getAttribute('data-story-id');
          if (!storyId) continue;

          const video = videoRefs.current[storyId];
          if (!video) continue;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const dataSrc = video.getAttribute('data-src');
            if (dataSrc && !video.src) {
              video.src = dataSrc;
              video.load();
            }
            try {
              const p = video.play();
              if (p && typeof (p as Promise<void>).catch === 'function') {
                (p as Promise<void>).catch(() => undefined);
              }
            } catch { /* no-op */ }
          } else {
            try { video.pause(); } catch { /* no-op */ }
          }
        }
      },
      { threshold: [0, 0.3, 0.7] }
    );

    for (const el of cardRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [stories.length]);

  useEffect(() => {
    if (activeId === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeId, closeModal]);

  return (
    <section id="story-wall" className="py-20 bg-gradient-to-b from-slate-950 via-[#0B1120] to-slate-950 overflow-hidden">
      <div className="mx-auto w-full max-w-screen-2xl px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">
            <Camera className="h-3.5 w-3.5" />
            Real Stories — Real Guests
          </div>
          <h2 className="mt-5 text-4xl md:text-6xl font-light text-white tracking-tight">
            The Story Wall
            <span className="block font-serif italic text-[#D4AF37]">Real Moments</span>
          </h2>
          <p className="mt-5 text-white/70 text-base md:text-lg max-w-xl mx-auto">
            Every card is someone&apos;s best day. Hover to read their story. Tap to watch it unfold. <span className="text-[#D4AF37]">Yours could be next.</span>
          </p>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((story, idx) => {
            const storyKey = String(story.id);
            const isFlipped = flippedId === story.id;

            return (
              <div
                key={story.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                data-story-id={storyKey}
                className="group [perspective:1200px]"
                onMouseEnter={() => setFlippedId(story.id)}
                onMouseLeave={() => setFlippedId(null)}
                onTouchStart={() => setFlippedId(isFlipped ? null : story.id)}
              >
                <div
                  className={`relative w-full aspect-[9/14] transition-transform duration-700 [transform-style:preserve-3d] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* ===== FRONT: Video card ===== */}
                  <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                    <video
                      ref={(el) => { videoRefs.current[storyKey] = el; }}
                      muted
                      loop
                      playsInline
                      preload="none"
                      className="absolute inset-0 w-full h-full object-cover"
                      data-src={story.videoSrc}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                    {/* Bottom info */}
                    <div className="absolute left-0 right-0 bottom-0 p-4">
                      <div className="flex items-end justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-lg shadow-lg">
                            {story.avatar}
                          </div>
                          <div>
                            <div className="text-white text-sm font-bold leading-tight">{story.caption}</div>
                            <div className={`text-xs font-semibold mt-0.5 ${story.accent}`}>{story.guest}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="h-8 w-8 rounded-full bg-black/40 border border-white/10 hover:border-white/30 transition flex items-center justify-center text-white/70 hover:text-white"
                            onClick={(e) => { e.stopPropagation(); openModal(story); }}
                            aria-label="Watch"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            className="h-8 w-8 rounded-full bg-black/40 border border-white/10 hover:border-white/30 transition flex items-center justify-center text-white/70 hover:text-red-400"
                            onClick={(e) => { e.stopPropagation(); }}
                            aria-label="Like"
                          >
                            <Heart className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Flip hint */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-[9px] uppercase tracking-[0.2em] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      Hover for story
                    </div>
                  </div>

                  {/* ===== BACK: Narrative card ===== */}
                  <div
                    className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-gradient-to-br ${story.accentBg}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_60%)]" />
                    <div className="relative h-full flex flex-col justify-between p-5">
                      {/* Top */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <div className="h-10 w-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-xl">
                            {story.avatar}
                          </div>
                          <div>
                            <div className="text-white font-bold text-sm">{story.guest}</div>
                            <div className="text-white/60 text-[10px] uppercase tracking-[0.2em]">Guest Story</div>
                          </div>
                        </div>
                        <div className="mt-4 text-white/50 text-[10px] uppercase tracking-[0.3em] font-semibold">{story.caption}</div>
                        <div className="mt-3 text-white/95 text-sm md:text-[15px] leading-relaxed font-light">
                          &ldquo;{story.narrative}&rdquo;
                        </div>
                      </div>

                      {/* Bottom CTA */}
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => openModal(story)}
                          className="w-full rounded-xl bg-white/15 border border-white/20 px-4 py-2.5 text-xs font-bold text-white uppercase tracking-[0.2em] hover:bg-white/25 transition"
                        >
                          ▶ Watch Their Story
                        </button>
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-white/50 text-[10px]">
                          <Share2 className="h-3 w-3" />
                          <span>Share this moment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Share your story CTA */}
        <div className="mt-14 max-w-2xl mx-auto text-center">
          <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/5 backdrop-blur-sm p-8">
            <Sparkles className="h-8 w-8 text-[#D4AF37] mx-auto" />
            <h3 className="mt-4 text-2xl font-bold text-white">Your Story Belongs Here</h3>
            <p className="mt-2 text-white/60 text-sm">
              Tag your Belize adventure with <span className="text-[#D4AF37] font-semibold">#RenesAdventures</span> on Instagram or
              Facebook — your story could be featured right here. Or let us
              immortalize it through the Fish Story Lab below.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://www.instagram.com/explore/tags/RenesAdventures/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white/80 hover:text-white hover:border-white/60 font-semibold text-sm tracking-wide transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Share on Instagram
              </a>

              <button
                type="button"
                onClick={() => {
                  document.getElementById('fish-story-lab')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
              >
                ✨ Immortalize Your Adventure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Fullscreen Modal ========== */}
      {activeStory && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              className="relative w-full max-w-[420px] md:max-w-[520px] aspect-[9/16] rounded-3xl overflow-hidden border border-white/15 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                key={activeStory.id}
                src={activeStory.videoSrc}
                suppressHydrationWarning
                autoPlay
                loop
                playsInline
                muted={modalMuted}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className={`px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] uppercase tracking-[0.25em] font-bold ${activeStory.accent}`}>
                  {activeStory.guest}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-10 w-10 rounded-full bg-black/45 border border-white/15 hover:border-white/30 transition flex items-center justify-center text-white"
                    onClick={() => setModalMuted((m) => !m)}
                    aria-label={modalMuted ? 'Unmute' : 'Mute'}
                  >
                    {modalMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    className="h-10 w-10 rounded-full bg-black/45 border border-white/15 hover:border-white/30 transition flex items-center justify-center text-white"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="absolute left-0 right-0 bottom-0 p-5">
                <div className="rounded-2xl bg-black/60 backdrop-blur-sm p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-lg">
                      {activeStory.avatar}
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">{activeStory.caption}</div>
                      <div className={`text-xs font-semibold ${activeStory.accent}`}>{activeStory.guest}</div>
                    </div>
                  </div>
                  <div className="text-white/85 text-sm leading-relaxed line-clamp-4">
                    &ldquo;{activeStory.narrative}&rdquo;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
