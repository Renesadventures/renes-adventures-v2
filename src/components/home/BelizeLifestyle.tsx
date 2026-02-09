'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

function GlassIcon({ kind }: { kind: 'maya' | 'reef' | 'garifuna' | 'jungle' | 'caves' | 'islands' }) {
  const common = 'absolute inset-0 w-full h-full p-4';

  if (kind === 'maya') {
    return (
      <div className="relative h-20 w-20">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-25 blur-xl" />
        <div className="glass-icon relative h-20 w-20 rounded-2xl">
          <svg viewBox="0 0 100 100" className={common} aria-hidden="true">
            <defs>
              <linearGradient id="mayaGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA500" />
              </linearGradient>
            </defs>
            <path d="M50 10 L88 84 H12 Z" fill="url(#mayaGrad)" opacity="0.95" />
            <path d="M50 26 L72 70 H28 Z" fill="#0f172a" opacity="0.18" />
            <path d="M22 84 H78" stroke="#0f172a" strokeWidth="6" opacity="0.18" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  if (kind === 'reef') {
    return (
      <div className="relative h-20 w-20">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 opacity-25 blur-xl" />
        <div className="glass-icon relative h-20 w-20 rounded-2xl">
          <svg viewBox="0 0 100 100" className={common} aria-hidden="true">
            <defs>
              <linearGradient id="reefGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#40E0D0" />
                <stop offset="100%" stopColor="#4FC3F7" />
              </linearGradient>
            </defs>
            <path d="M18 58 C26 42, 42 38, 54 42 C66 46, 78 44, 86 32 C82 54, 70 70, 50 74 C30 78, 18 70, 18 58 Z" fill="url(#reefGrad)" opacity="0.95" />
            <circle cx="62" cy="54" r="3.5" fill="#0f172a" opacity="0.45" />
            <path d="M24 70 C26 62, 30 58, 36 56" stroke="#0f172a" strokeWidth="6" opacity="0.12" strokeLinecap="round" />
            <path d="M28 82 C34 72, 44 68, 52 68" stroke="#0f172a" strokeWidth="6" opacity="0.12" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  if (kind === 'garifuna') {
    return (
      <div className="relative h-20 w-20">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-500 opacity-25 blur-xl" />
        <div className="glass-icon relative h-20 w-20 rounded-2xl">
          <svg viewBox="0 0 100 100" className={common} aria-hidden="true">
            <defs>
              <linearGradient id="drumGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF6B6B" />
                <stop offset="100%" stopColor="#FF7F50" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="28" rx="22" ry="10" fill="#ffffff" opacity="0.28" />
            <path d="M28 28 L34 78 C34 84, 66 84, 66 78 L72 28" fill="url(#drumGrad)" opacity="0.95" />
            <ellipse cx="50" cy="28" rx="22" ry="10" fill="#0f172a" opacity="0.12" />
            <path d="M36 40 L64 40" stroke="#ffffff" strokeWidth="4" opacity="0.28" strokeLinecap="round" />
            <path d="M38 56 L62 56" stroke="#ffffff" strokeWidth="4" opacity="0.22" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  if (kind === 'jungle') {
    return (
      <div className="relative h-20 w-20">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-400 to-lime-500 opacity-25 blur-xl" />
        <div className="glass-icon relative h-20 w-20 rounded-2xl">
          <svg viewBox="0 0 100 100" className={common} aria-hidden="true">
            <defs>
              <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00FA9A" />
                <stop offset="100%" stopColor="#32CD32" />
              </linearGradient>
            </defs>
            <path d="M20 62 C20 34, 44 18, 68 20 C76 44, 66 74, 38 82 C28 78, 22 72, 20 62 Z" fill="url(#leafGrad)" opacity="0.95" />
            <path d="M30 76 C48 58, 58 46, 72 28" stroke="#0f172a" strokeWidth="5" opacity="0.16" strokeLinecap="round" />
            <path d="M40 66 C44 60, 50 56, 56 52" stroke="#0f172a" strokeWidth="5" opacity="0.12" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  if (kind === 'caves') {
    return (
      <div className="relative h-20 w-20">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-teal-400 to-slate-300 opacity-25 blur-xl" />
        <div className="glass-icon relative h-20 w-20 rounded-2xl">
          <svg viewBox="0 0 100 100" className={common} aria-hidden="true">
            <defs>
              <linearGradient id="crystalGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00CED1" />
                <stop offset="100%" stopColor="#C0C0C0" />
              </linearGradient>
            </defs>
            <path d="M50 12 L78 38 L66 86 H34 L22 38 Z" fill="url(#crystalGrad)" opacity="0.95" />
            <path d="M50 12 L50 86" stroke="#0f172a" strokeWidth="5" opacity="0.14" />
            <path d="M22 38 L78 38" stroke="#0f172a" strokeWidth="5" opacity="0.12" />
            <path d="M34 86 L50 52 L66 86" fill="#ffffff" opacity="0.14" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-20 w-20">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-amber-300 to-sky-400 opacity-25 blur-xl" />
      <div className="glass-icon relative h-20 w-20 rounded-2xl">
        <svg viewBox="0 0 100 100" className={common} aria-hidden="true">
          <defs>
            <linearGradient id="islandGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#87CEEB" />
            </linearGradient>
          </defs>
          <path d="M20 70 C28 58, 40 52, 50 52 C62 52, 74 58, 80 70 C68 82, 32 82, 20 70 Z" fill="url(#islandGrad)" opacity="0.95" />
          <path d="M52 20 C62 28, 66 40, 60 54" stroke="#32CD32" strokeWidth="6" opacity="0.6" strokeLinecap="round" />
          <path d="M44 22 C52 32, 56 44, 52 58" stroke="#32CD32" strokeWidth="6" opacity="0.35" strokeLinecap="round" />
          <path d="M36 58 L68 58" stroke="#0f172a" strokeWidth="6" opacity="0.12" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export default function BelizeLifestyle() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  const cards = useMemo(
    () => [
      {
        id: 'maya',
        iconKey: 'maya' as const,
        subtitle: 'Maya Mysteries',
        title: 'Walk Where Priests Spoke to Gods',
        thumbnailUrl: `${base}/images/renes-activities/adventure-in-the-yucatan-2024-09-13-23-43-09-utc.jpg`,
        description:
          "Stone pyramids rise through jungle mist—Xunantunich, Caracol, Lamanai. These aren't ruins. They're living testaments to humanity's greatest achievements. The Maya mastered astronomy before Europe knew Earth was round. They created a mathematical system so advanced we still study it today. Their calendar predicted solar eclipses with precision that rivals modern computers.\n\nEl Castillo stands 130 feet high—every limestone block hand-carved and hauled without wheels or metal tools. Climb it. Stand where Maya kings stood 1,200 years ago. Look out over the jungle canopy that swallowed cities whole. Feel the weight of a civilization that built monuments to celestial perfection.\n\nThe Maya didn't disappear. Their descendants live here—speaking ancient languages, keeping traditions alive that predate the Roman Empire. In Belize, you don't just read about history. You walk through it. You touch stones that witnessed the birth of human mathematics. You stand in temples where priests calculated Venus's orbit without telescopes.\n\nWhen will you hold a piece of obsidian traded from Guatemala 2,000 years ago? When will you see hieroglyphs carved by hands that understood time differently than we do? This isn't a museum. It's a portal.",
        href: '/blog?category=maya',
        youtubeId: 'PlDF94nxeU0',
        attribution: 'Video: Mickey Agyei (CC BY)',
        cta: 'Explore Maya Heritage',
        theme: {
          story: 'from-[#FFA500]/20 to-[#00FA9A]/20',
          button: 'from-[#FFA500] to-[#FFD700] text-slate-950',
        },
      },
      {
        id: 'reef',
        iconKey: 'reef' as const,
        subtitle: 'Barrier Reef',
        title: 'The Second-Largest Living Masterpiece on Earth',
        thumbnailUrl: `${base}/images/renes-activities/aerial-view-of-barrier-reef-caribbean-sea-2025-04-03-09-24-41-utc.jpg`,
        description:
          "Jacques Cousteau called it \"one of the world's greatest natural wonders.\" UNESCO designated it irreplaceable. The Belize Barrier Reef isn't coral—it's 180 miles of living architecture created over 500,000 years. Five hundred species of fish. Sixty-five types of coral. Nurse sharks, sea turtles, and rays gliding through water so clear you'll question if it's real.\n\nThe Great Blue Hole sits at the heart—a 1,000-foot circular portal to Earth's Ice Age past. Four hundred feet down, massive stalactites hang preserved from when this was a cave system on dry land. You'll dive where geological time stands still. You'll swim where evolution writes new chapters daily.\n\nHol Chan Marine Reserve: you're floating above coral gardens older than your great-grandparents. Below you, parrotfish crunch coral into sand. Tarpon as big as your leg glide past. A spotted eagle ray banks left, its five-foot wingspan cutting water like a jet.\n\nThis reef protects Belize's coast. It feeds communities. It breathes oxygen. And it's thriving—one of the healthiest reef systems left on Earth. Most reefs are dying. This one is fighting. You can witness that resilience. You can swim through humanity's underwater cathedral while we still have it.",
        href: '/blog?category=reef',
        youtubeId: 'adcED0DFpTc',
        attribution: 'UNESCO / TBS / NHK',
        cta: 'Swim the Reef',
        theme: {
          story: 'from-[#00CED1]/20 to-[#4FC3F7]/20',
          button: 'from-[#00CED1] to-[#4FC3F7] text-slate-950',
        },
      },
      {
        id: 'garifuna',
        iconKey: 'garifuna' as const,
        subtitle: 'Garifuna Soul',
        title: 'The Rhythm That Survived Exile',
        thumbnailUrl: `${base}/images/renes-activities/group-of-young-people-celebrating-with-music-at-th-2025-02-16-03-45-43-utc.jpg`,
        description:
          "November 19, 1802. Exiled Garifuna people landed on Belize's shores after the British forcibly removed them from St. Vincent. They brought nothing but drums, language, and unbreakable spirit. Two hundred twenty-four years later, their descendants keep African, Island Carib, and Arawak traditions alive through punta rhythms that sync your heartbeat with history.\n\nWatch primero and segunda drums thunder in coastal villages. The bass drum pounds—deep, chest-rattling, primal. The tenor drum answers—fast, complex, telling stories without words. Hips move faster than thought. Feet barely touch sand. This is punta—the dance of survival, resistance, and joy all at once.\n\nTaste cassava bread (ereba) prepared exactly as it was 200 years ago. The process takes two days—grating cassava by hand, pressing juice through woven baskets, baking on flat stones. Every grandmother in Hopkins and Dangriga knows the technique. They learned from their grandmothers, who learned from theirs, in an unbroken chain stretching back to Caribbean islands they'll never see.\n\nThis isn't a performance for tourists. It's living history you can touch, taste, hear, and feel. When drums thunder in Dangriga, you're witnessing culture that refused to die.",
        href: '/blog?category=garifuna',
        youtubeId: '-FVP2f-p7dc',
        attribution: 'Video: Belize Cultural Showcase',
        cta: 'Feel the Rhythm',
        theme: {
          story: 'from-[#FF6B6B]/20 to-[#FF7F50]/20',
          button: 'from-[#FF6B6B] to-[#FF7F50] text-slate-950',
        },
      },
      {
        id: 'jungle',
        iconKey: 'jungle' as const,
        subtitle: 'Jungle Cathedral',
        title: 'Where Nature Rules Without Compromise',
        thumbnailUrl: `${base}/images/renes-activities/nature-2024-12-19-14-44-54-utc.jpg`,
        description:
          "4:47 AM. Dawn hasn't broken yet but the jungle knows. Howler monkeys start—a roar so deep, so primal, it rattles your chest from a mile away. Biologists call it the loudest land animal on Earth. Ancient Maya called them \"baboon\" and believed their roars brought rain.\n\nWelcome to Cockscomb Basin Wildlife Sanctuary—the world's first jaguar preserve. One hundred sixty square miles of primary rainforest where humans are guests, not rulers. Jaguars prowl these trails. You won't see them—they see you. They're watching from branches sixty feet up, melting into shadows, reading your scent on wind you can't feel.\n\nToucans—those neon-beaked icons—aren't rare here. They're common. You'll see five before breakfast. Keel-billed, emerald-green bodies with beaks like candy-colored Swiss Army knives.\n\nBelize chose to protect this jungle on its own terms—no compromise. Thirty-eight percent of the country is protected parkland. You're not visiting a zoo. You're entering a kingdom where evolution happens live, where the apex predator isn't us, where 10,000 species watch your every move.\n\nCome witness what Earth looks like when nature wins.",
        href: '/blog?category=jungle',
        youtubeId: 'SietwfyfzjA',
        attribution: 'Video: Mickey Agyei (CC BY)',
        cta: 'Enter the Jungle',
        theme: {
          story: 'from-[#32CD32]/20 to-[#8B4513]/20',
          button: 'from-[#32CD32] to-[#8B4513] text-slate-950',
        },
      },
      {
        id: 'caves',
        iconKey: 'caves' as const,
        subtitle: 'Cave of Crystals',
        title: 'Float Through the Maya Underworld',
        thumbnailUrl: `${base}/images/renes-activities/silhouette-of-scuba-diver-diving-in-dark-cave-2025-03-09-09-29-23-utc.jpg`,
        description:
          "The Maya believed caves were portals to Xibalba—the underworld where gods ruled over death, disease, and darkness. They didn't enter caves lightly. Priests performed rituals at entrances, asking permission to descend. Once inside, they left offerings: pottery filled with corn, cacao, human blood. Sometimes they left humans.\n\nActun Tunichil Muknal (ATM Cave) holds the proof. Swim through an underground river. Wade waist-deep through passages where your headlamp is the only light. Climb into cathedral chambers sixty feet high, stalactites hanging like frozen waterfalls. Then you see her: the Crystal Maiden.\n\nShe's 18 years old. She died 1,200 years ago. Her bones have calcified—mineral deposits from dripping water transformed her skeleton into sparkling crystal. She lies exactly where priests placed her, head turned slightly left, as if sleeping. Around her: intact pottery, stone tools, ceremonial vessels. All calcified. All untouched for over a millennium.\n\nMost ruins are roped off. Most artifacts are behind glass. In ATM Cave, you're walking through an active archaeological site, breathing air that smells like time itself.",
        href: '/blog?category=caves',
        youtubeId: 'E05UjI_e3Qw',
        attribution: 'Video: Adventure Documentary',
        cta: 'Explore the Underworld',
        theme: {
          story: 'from-[#008080]/20 to-[#C0C0C0]/20',
          button: 'from-[#008080] to-[#C0C0C0] text-slate-950',
        },
      },
      {
        id: 'islands',
        iconKey: 'islands' as const,
        subtitle: 'Island Time',
        title: "'Go Slow' Isn't a Suggestion—It's Island Law",
        thumbnailUrl: `${base}/images/renes-activities/caye-caulker-belize-2025-03-27-00-09-41-utc.jpg`,
        description:
          "Caye Caulker has one rule painted on walls, carved into driftwood signs, tattooed on locals: GO SLOW. Not \"please slow down.\" Not \"relax.\" Just: Go Slow. Two words that define an entire philosophy.\n\nNo cars exist here. None. The island is three miles long, one mile wide, and utterly car-free. You walk. You bike. You golf cart if you're feeling fancy. The loudest sound is reggae drifting from beach bars and waves lapping the Split—the narrow channel Hurricane Hattie carved in 1961 when she split the island in two.\n\nThe Split is Caye Caulker's social heart. Jump off the dock. Swim in Caribbean water that's bathtub-warm and gin-clear. Order a rum punch from Lazy Lizard. Watch the sun melt into turquoise water while pelicans dive-bomb for dinner. Nobody checks their watch. Watches don't work here—they run on mainland time.\n\nBefore Instagram ruined travel, this is what every beach destination felt like—real, unfiltered, unhurried. You'll leave different. Slower. Calmer. Wondering why you spent your whole life rushing toward nothing. Island Time isn't slow—it's the correct speed.\n\nCome to Caye Caulker. Learn to Go Slow. It's not advice. It's an order. And you'll thank us for it.",
        href: '/blog?category=islands',
        youtubeId: 'cvZctS8kG68',
        attribution: 'Video: Gabriel Morris (CC BY 3.0)',
        cta: 'Go Slow',
        theme: {
          story: 'from-[#FFD700]/20 to-[#87CEEB]/20',
          button: 'from-[#FFD700] to-[#87CEEB] text-slate-950',
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observers: IntersectionObserver[] = [];

    for (const cardId of Object.keys(videoRefs.current)) {
      const element = videoRefs.current[cardId];
      if (!element) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveVideoId(cardId);
          }
        },
        { threshold: [0, 0.5], rootMargin: '-50px' }
      );

      observer.observe(element);
      observers.push(observer);
    }

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, [cards.length]);

  useEffect(() => {
    for (const cardId of Object.keys(videoRefs.current)) {
      const iframe = videoRefs.current[cardId];
      if (!iframe?.contentWindow) continue;

      try {
        if (cardId === activeVideoId) {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      } catch {
        // suppress
      }
    }
  }, [activeVideoId]);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-6 py-12 sm:px-10 sm:py-14 overflow-hidden ring-1 ring-white/10 shadow-[0_22px_80px_rgba(15,23,42,0.35)]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white ring-1 ring-white/15">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Belize Lifestyle
            </div>

            <h2 className="mt-5 text-3xl sm:text-5xl font-serif tracking-tight text-white">
              Belize: Where Legends Come Alive
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base text-white/80">
              Ancient civilizations. Living coral kingdoms. Jungle mysteries. This is more than a destination—it&apos;s a living story.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                <BookOpen className="h-4 w-4 text-amber-300" />
                Britannica Highlights
              </div>
              <div className="mt-3 text-sm leading-relaxed text-white/80">
                Belize is often thought of as a Caribbean country in Central America because it has a history similar to that of English-speaking Caribbean nations—its institutions and <span className="font-semibold text-amber-300">official language reflect its history as a British colony</span>.
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Natural Wonder</div>
              <div className="mt-3 text-sm leading-relaxed text-white/80">
                Along the coast is the <span className="font-semibold text-amber-300">Belize Barrier Reef</span>, the <span className="font-semibold text-amber-300">second largest barrier reef in the world</span>, fringed by dozens of small islands called cays.
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Coastline & Heritage</div>
              <div className="mt-3 text-sm leading-relaxed text-white/80">
                A <span className="font-semibold text-amber-300">174-mile (280-km) coastline</span> meets mangroves, reef cuts, and jungle—while Belize’s reef reserve system was designated a <span className="font-semibold text-amber-300">UNESCO World Heritage site (1996)</span>.
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8">
            {cards.map((c) => (
              <article
                key={c.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[0_18px_60px_rgba(0,0,0,0.40)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[60%_40%]">
                  <div className="relative aspect-video lg:aspect-[16/10] bg-black">
                    <div
                      className={`absolute inset-0 z-10 transition-opacity duration-500 ${
                        activeVideoId === c.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
                      }`}
                      onClick={() => setActiveVideoId(c.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setActiveVideoId(c.id);
                      }}
                    >
                      <Image
                        src={c.thumbnailUrl}
                        alt={c.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 60vw, 100vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-red-600/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-12 left-4 right-4 z-30 flex gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-black/80 rounded-full text-xs font-bold text-white">Wildlife</span>
                      <span className="px-3 py-1 bg-black/80 rounded-full text-xs font-bold text-white">Adventure</span>
                      <span className="px-3 py-1 bg-black/80 rounded-full text-xs font-bold text-white">4K</span>
                    </div>

                    <iframe
                      ref={(el) => {
                        videoRefs.current[c.id] = el;
                      }}
                      data-playing={activeVideoId === c.id}
                      className="absolute inset-0 w-full h-full z-20 opacity-0 pointer-events-none data-[playing=true]:opacity-100 data-[playing=true]:pointer-events-auto"
                      src={`https://www.youtube.com/embed/${c.youtubeId}?autoplay=0&mute=1&enablejsapi=1&loop=1&playlist=${c.youtubeId}&controls=1&modestbranding=1&rel=0&origin=https://renesadventures.tours`}
                      title={c.title}
                      allow="autoplay; fullscreen; encrypted-media"
                      sandbox="allow-same-origin allow-scripts allow-presentation"
                      allowFullScreen
                    />

                    <div className="absolute bottom-3 right-3 z-30 rounded-full bg-black/80 px-3 py-1.5 text-xs text-white ring-1 ring-white/10">
                      📹 {c.attribution}
                    </div>
                  </div>

                  <div
                    className={`bg-gradient-to-br ${c.theme.story} p-8 lg:p-10 lg:max-h-[600px] lg:overflow-y-auto scrollable-text`}
                  >
                    <GlassIcon kind={c.iconKey} />
                    <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-white">{c.title}</h3>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                      {c.subtitle}
                    </p>
                    <div className="mt-5 whitespace-pre-line text-sm leading-relaxed text-white/90">
                      {c.description}
                    </div>

                    <Link
                      href={c.href}
                      className={`mt-7 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-5 py-4 text-sm font-bold shadow-lg transition duration-300 hover:scale-[1.02] ${c.theme.button}`}
                    >
                      {c.cta} <ArrowRight className="h-4 w-4" />
                    </Link>

                    <div className="mt-5 text-[11px] font-semibold text-white/70">
                      Source:{' '}
                      <a
                        href="https://www.britannica.com/place/Belize"
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-white/40 underline-offset-4 hover:decoration-white/80"
                      >
                        Encyclopedia Britannica
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
