'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Share2, X, Volume2, VolumeX } from 'lucide-react';

type StoryItem = {
  id: number;
  caption: string;
  avatar: string;
  videoSrc: string;
};

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

function isElementVisibleEnough(entry: IntersectionObserverEntry) {
  return entry.isIntersecting && entry.intersectionRatio >= 0.5;
}

export default function StoryWall() {
  const stories = useMemo<StoryItem[]>(
    () => [
      {
        id: 1,
        videoSrc: `${base}/luxury/Deep Sea Fishing 5.mp4`,
        caption: 'The moment it hit',
        avatar: '🎣',
      },
      {
        id: 2,
        videoSrc: `${base}/luxury/Secrete Beach 5.mp4`,
        caption: 'Golden hour magic',
        avatar: '🌅',
      },
      {
        id: 3,
        videoSrc: `${base}/luxury/Lobster Fishing 1.mp4`,
        caption: 'Feast mode activated',
        avatar: '🦞',
      },
      {
        id: 4,
        videoSrc: `${base}/luxury/Reef Fishing 6.mp4`,
        caption: 'Into the blue',
        avatar: '🐠',
      },
      {
        id: 5,
        videoSrc: `${base}/hero/beach-bbq.mp4`,
        caption: 'Beach vibes only',
        avatar: '🏖️',
      },
      {
        id: 6,
        videoSrc: `${base}/hero/sunset-ritual.mp4`,
        caption: "Captain's call",
        avatar: '⚓',
      },
      {
        id: 7,
        videoSrc: `${base}/hero/blue-hole.mp4`,
        caption: 'Pure Belize',
        avatar: '💎',
      },
      {
        id: 8,
        videoSrc: `${base}/luxury/deep-sea-fishing.mp4`,
        caption: 'Trophy time',
        avatar: '🏆',
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState<number | null>(null);
  const [modalMuted, setModalMuted] = useState(true);

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const observersRef = useRef<IntersectionObserver | null>(null);

  const activeStory = useMemo(() => stories.find((s) => s.id === activeId) || null, [activeId, stories]);

  const openModal = useCallback((story: StoryItem) => {
    setActiveId(story.id);
    setModalMuted(true);
  }, []);

  const closeModal = useCallback(() => {
    setActiveId(null);
    setModalMuted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const node = entry.target as HTMLElement;
          const storyId = node.getAttribute('data-story-id');
          if (!storyId) continue;

          const video = videoRefs.current[storyId];
          if (!video) continue;

          if (isElementVisibleEnough(entry)) {
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
            } catch {
              // no-op
            }
          } else {
            try {
              video.pause();
            } catch {
              // no-op
            }
          }
        }
      },
      { threshold: [0, 0.5, 1] }
    );

    observersRef.current = observer;

    for (const el of cardRefs.current) {
      if (!el) continue;
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      observersRef.current = null;
    };
  }, [stories.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (activeId === null) return;
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeId, closeModal]);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 via-[#0B1020] to-black">
      <div className="mx-auto w-full max-w-screen-2xl px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">The Story Wall - Real Moments</div>
          <h2 className="mt-4 text-4xl md:text-6xl font-light text-white tracking-tight">
            The Story Wall
            <span className="block font-serif italic text-[#D4AF37]">Real Moments</span>
          </h2>
          <p className="mt-4 text-white/80 text-lg font-light">Vertical. Fast. Alive.</p>
          <p className="mt-5 text-white/60 text-sm md:text-base font-light">
            A TikTok-style masonry of high-action frames—each one stamped with Lia&apos;s Tale
          </p>
        </div>

        <div className="[column-gap:1.5rem] columns-1 md:columns-2 lg:columns-3">
          {stories.map((story, idx) => {
            const storyKey = String(story.id);

            return (
              <div
                key={story.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                data-story-id={storyKey}
                className="mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl cursor-pointer group"
                onClick={() => openModal(story)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') openModal(story);
                }}
              >
                <div className="relative w-full aspect-[9/16] bg-black">
                  <video
                    ref={(el) => {
                      videoRefs.current[storyKey] = el;
                    }}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="absolute inset-0 w-full h-full object-cover"
                    data-src={story.videoSrc}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute right-3 top-3">
                    <div className="px-3 py-1.5 rounded-full border border-[#D4AF37]/45 bg-black/35 backdrop-blur-md text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                      Lia&apos;s Tale
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 bottom-0 p-4">
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/15 flex items-center justify-center text-base">
                          {story.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white/90 text-sm font-semibold leading-tight line-clamp-2">{story.caption}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-white/65">
                        <button
                          type="button"
                          className="h-9 w-9 rounded-full bg-black/35 border border-white/10 hover:border-white/25 transition flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          aria-label="Like"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="h-9 w-9 rounded-full bg-black/35 border border-white/10 hover:border-white/25 transition flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          aria-label="Share"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
                autoPlay
                loop
                playsInline
                muted={modalMuted}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="px-3 py-1.5 rounded-full border border-[#D4AF37]/45 bg-black/35 backdrop-blur-md text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                  Lia&apos;s Tale
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
                <div className="flex items-end justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/15 flex items-center justify-center text-lg">
                      {activeStory.avatar}
                    </div>
                    <div>
                      <div className="text-white text-base font-semibold">{activeStory.caption}</div>
                      <div className="mt-1 text-white/70 text-sm">{activeStory.caption}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/75">
                    <button
                      type="button"
                      className="h-10 w-10 rounded-full bg-black/45 border border-white/15 hover:border-white/30 transition flex items-center justify-center"
                      aria-label="Like"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="h-10 w-10 rounded-full bg-black/45 border border-white/15 hover:border-white/30 transition flex items-center justify-center"
                      aria-label="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
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
