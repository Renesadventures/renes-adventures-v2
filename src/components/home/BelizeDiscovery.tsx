'use client';

import { useState, useRef, useEffect } from 'react';

interface Chapter {
  id: string;
  episode: string;
  title: string;
  tagline: string;
  video: string;
  poster?: string;
  category: string;
  categoryColor: string;
  headline: string;
  body: string[];
  rene: string;
  available: boolean;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'great-blue-hole',
    episode: 'Chapter 01',
    title: 'The Great Blue Hole',
    tagline: 'One of seven underwater wonders of the world',
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/great-blue-hole.mp4',
    category: 'NATURAL WONDER',
    categoryColor: 'bg-blue-600',
    headline: 'A Perfect Circle. 300 Metres Deep.',
    body: [
      'It was formed 15,000 years ago when the sea level rose and flooded a limestone cave system. Jacques Cousteau called it one of the top ten dive sites on Earth in 1971. He was right.',
      'The Blue Hole sits at the center of Lighthouse Reef Atoll, 70 kilometres off the Belizean coast. From above, it looks like a dark eye in the middle of turquoise — a perfect circle 300 metres wide and 125 metres deep.',
      'Inside, stalactites hang from walls formed when this was dry land. Giant grouper patrol the depths. Reef sharks circle the rim. The water is so clear you can see 40 metres in every direction.',
      'Most visitors see it from a plane. A few hundred feet below the surface is another world entirely.',
    ],
    rene: 'We leave before sunrise. By the time the dive boats arrive from San Pedro, we\'ve already been there, seen it, and we\'re heading somewhere quieter. The Blue Hole rewards the early. It always has.',
    available: true,
  },
  {
    id: 'barrier-reef',
    episode: 'Chapter 02',
    title: 'The Barrier Reef',
    tagline: 'Second largest in the world. UNESCO protected since 1996.',
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/coral-reef.mp4',
    category: 'MARINE WORLD',
    categoryColor: 'bg-cyan-600',
    headline: '185 Miles of Living Architecture',
    body: [
      'The Belize Barrier Reef runs the entire length of the country — 185 miles of coral, sand channels, and blue water. It is the largest in the Northern Hemisphere and the second largest on Earth.',
      'Charles Darwin surveyed it in 1842 from the deck of the HMS Beagle and called it "the most remarkable reef in the West Indies." 180 years later, nothing has changed except our understanding of how rare it really is.',
      'Inside the reef system: 500 species of fish, 70 species of hard coral, nurse sharks, stingrays, manatees, hawksbill sea turtles, and whale sharks that pass through every spring. The water is warm, clear, and 15 minutes from shore.',
      'Belize has committed to protecting 30% of its ocean territory — over 10,000 square kilometres. In an era when most reefs are shrinking, Belize is one of the few places where the reef is actually recovering.',
    ],
    rene: 'I grew up on this reef. Not visiting — growing up. I know every channel, every current, every spot where the fish congregate. When you\'re on my boat, you\'re not getting the tourist reef. You\'re getting mine.',
    available: true,
  },
  {
    id: 'garifuna',
    episode: 'Chapter 03',
    title: 'Garifuna Culture',
    tagline: 'UNESCO-recognized. African, Caribbean, and Arawak roots.',
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/garifuna-drumming.mp4',
    category: 'LIVING CULTURE',
    categoryColor: 'bg-amber-600',
    headline: 'The Drums That Refused to Go Silent',
    body: [
      'In 1797, the British exiled the Garifuna people from the island of St. Vincent — descendants of shipwrecked West Africans who had married into the Arawak people of the Caribbean. They loaded them onto boats and sent them toward Honduras.',
      'They survived. They crossed to Belize. They brought their language, their music, their food, and their drums. On November 19th, 1802, they landed on the shores of what is now Dangriga. That date is still a national holiday.',
      'Today the Garifuna are one of Belize\'s most vital cultural forces. Their music — driven by the primero and segunda drums — was declared a UNESCO Masterpiece of the Oral and Intangible Heritage of Humanity. Their language is spoken by 20,000 people across four countries.',
      'Garifuna Settlement Day in November fills the streets of Dangriga, Hopkins, and Punta Gorda with drumming, dancing, and the smell of hudut — fish in coconut broth, the dish they carried with them across the Caribbean.',
    ],
    rene: 'You cannot understand Belize without understanding the Garifuna. The drums you hear at night in Hopkins — those rhythms are 300 years old. That\'s not a performance for tourists. That\'s just Tuesday in southern Belize.',
    available: true,
  },
  {
    id: 'lobster-season',
    episode: 'Chapter 04',
    title: 'Lobster Season',
    tagline: 'June 15 to February 14. Fresh from the reef to the grill.',
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/lobster.mp4',
    category: 'LOCAL TRADITION',
    categoryColor: 'bg-red-600',
    headline: 'The Season That Runs the Island',
    body: [
      'On June 15th every year, a buzzer sounds and the entire island of Ambergris Caye goes into the water. Lobster season has opened. Every captain, every diver, every fisherman knows the date the way other people know their birthday.',
      'The Caribbean spiny lobster — no claws, all tail — lives in the crevices of the reef system. Fishermen and divers work the reef by hand, using snares and tickle sticks. It is skilled, physical work. The good captains know exactly where to look.',
      'From June to February, fresh lobster is on every menu in San Pedro. Grilled with butter and lime. In a ceviche. Split and charred on a beach BBQ with conch and snapper. The lobster season is Belize\'s culinary calendar.',
      'The season closes February 14th — Valentine\'s Day — to protect the breeding stock. The reef stays healthy. The tradition continues. Next June, the buzzer sounds again.',
    ],
    rene: 'When lobster season opens, I\'m on the reef at dawn. Not for the tourists — because that\'s what you do when you grew up here. The freshest lobster you\'ll ever eat comes off a Belizean reef in the first weeks of June. I can make that happen.',
    available: true,
  },
  {
    id: 'secret-beach',
    episode: 'Chapter 05',
    title: 'Secret Beach',
    tagline: 'West side of the island. The one they don\'t put on the map.',
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/secrete-beach-three.mp4',
    category: 'HIDDEN GEM',
    categoryColor: 'bg-emerald-600',
    headline: 'The Beach San Pedranos Keep to Themselves',
    body: [
      'Most tourists in San Pedro never find it. They stay on the reef side, hit the beach bars in town, and leave thinking they\'ve seen the island. They\'ve seen half of it.',
      'Secret Beach is on the Caribbean side of Ambergris Caye — west-facing, calm, and so shallow you can walk a hundred metres into water that never rises past your chest. The bottom is pure white sand. The water is the colour of sea glass.',
      'Ten years ago it was deserted. Now there are beach bars, hammocks, and a small fleet of golf carts making the bumpy ride north to find it. But it still feels like something you discovered. That feeling is part of what makes it worth the trip.',
      'No reef on this side means no waves. No waves means flat water. Flat water means you can see straight to the bottom. On a clear day, the visibility is thirty feet in six inches of water.',
    ],
    rene: 'I take people to Secret Beach when they\'ve been out on the water all day and need something gentle. It\'s the exhale of the trip. Nobody rushes at Secret Beach. Even the name tells you to slow down.',
    available: true,
  },
  {
    id: 'maya-ruins',
    episode: 'Chapter 06',
    title: 'The Maya Ruins',
    tagline: 'More ancient sites than any country its size.',
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/maya-ruins.mp4',
    category: 'ANCIENT HISTORY',
    categoryColor: 'bg-orange-700',
    headline: 'A Civilization That Never Really Left',
    body: [
      'Belize has more Maya archaeological sites per square mile than any other country on Earth. Over 600 known sites — and researchers believe that number represents less than ten percent of what remains buried under the jungle.',
      'Caracol, the largest Maya city in Belize, once had a population larger than Belize City today. Xunantunich sits on a ridge overlooking the Mopan River, its carved friezes still intact after a thousand years. Lamanai — whose name means "submerged crocodile" — has been continuously occupied for 3,000 years.',
      'The Maya didn\'t disappear. Over 30,000 Maya people still live in Belize, speaking Yucatec, Mopan, and Q\'eqchi\'. Their descendants work as guides in the ruins their ancestors built, explaining cosmology, agriculture, and astronomy to visitors.',
      'And on Ambergris Caye itself — just north of San Pedro — there is a small Maya site at Marco Gonzalez, where traders once stopped between the mainland and the cayes. Belize\'s past is everywhere, just below the surface.',
    ],
    rene: 'People come for the water. They leave talking about the ruins. It always surprises them — how old, how sophisticated, how present it still feels. A day trip to the mainland changes the whole trip.',
    available: true,
  },
  {
    id: 'caye-caulker',
    episode: 'Chapter 07',
    title: 'Caye Caulker',
    tagline: '"Go Slow." The whole island runs on that one rule.',
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/caye-caulker.mp4',
    category: 'ISLAND LIFE',
    categoryColor: 'bg-lime-600',
    headline: 'The Island That Invented Its Own Philosophy',
    body: [
      'Caye Caulker has one speed. The sign at the dock says "Go Slow" and every person on the island — local and visitor alike — takes it literally. There are no cars. There are no traffic lights. There are no reasons to hurry.',
      'The island is a half-mile wide. You can walk from the Caribbean side to the lagoon side in four minutes. The main strip has barefoot bars, reggae playing from somewhere you can\'t locate, and street food that disappears by 11am if you sleep in.',
      'The Split — a narrow channel cut through the island by a hurricane in 1961 — is where everyone goes to swim, float, and do nothing with great dedication. The water is turquoise, the current is gentle, and the Belikins are cold.',
      'Caye Caulker was what Ambergris Caye was thirty years ago, before the resorts and the restaurants. Some people prefer this version. They come for a day and stay for a week.',
    ],
    rene: 'I bring people to Caulker when they want to feel what Belize used to be everywhere. Slower. Quieter. The kind of place where you miss your flight on purpose. That\'s not an accident — it\'s a feature.',
    available: true,
  },
  {
    id: 'shark-ray-alley',
    episode: 'Chapter 08',
    title: 'Shark Ray Alley',
    tagline: 'Nurse sharks and stingrays. In water four feet deep.',
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/nurse-sharks-and-stingrays.mp4',
    category: 'MARINE WORLD',
    categoryColor: 'bg-teal-600',
    headline: 'The Sharks That Don\'t Care You\'re There',
    body: [
      'Shark Ray Alley sits inside the Hol Chan Marine Reserve, ten minutes by boat from San Pedro. Fishermen used to clean their catch here and throw the scraps overboard. The nurse sharks and stingrays learned where the free meals were. They never left.',
      'Today, in four feet of crystal Caribbean water, dozens of nurse sharks and southern stingrays circle a patch of sandy bottom about the size of a basketball court. You put on a mask and drop in beside them.',
      'Nurse sharks are bottom feeders — docile, slow, and curious about swimmers in a mild, investigative way. They are not aggressive. They will brush against your legs. They will swim directly underneath you. First-timers grip the boat ladder and then slowly let go.',
      'The stingrays are different — active, graceful, pulling themselves through the water with their wings. They have been hand-fed here for so long that they approach immediately. It is one of the most surreal wildlife experiences in the Caribbean.',
    ],
    rene: 'I have taken hundreds of people into Shark Ray Alley. The reaction is always the same — terrified on the ladder, amazed in the water, and back at the boat thirty minutes later trying to figure out how to describe it to someone who wasn\'t there. You can\'t. You have to go.',
    available: true,
  },
  {
    id: 'san-pedro',
    episode: 'Chapter 09',
    title: 'San Pedro at Dawn',
    tagline: 'Before the island wakes up. This is what it really is.',
    video: 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/san-pedro-at-dawn.mp4',
    category: 'ISLAND LIFE',
    categoryColor: 'bg-rose-600',
    headline: 'The First Hour. Before Everything Starts.',
    body: [
      'At 5:30am, San Pedro is a fishing village. The tourist infrastructure — the bars, the dive shops, the golf cart rentals — all of it is shuttered and quiet. What\'s left is the real thing: fishermen heading out, the smell of fry jacks and coffee, pelicans on the dock posts.',
      'Madonna wrote "La Isla Bonita" about San Pedro. The song is accurate in ways that only become clear at dawn — the color of the sky, the sound of the water, the sense of a small town that exists for its own reasons and happens to welcome visitors.',
      'San Pedro was granted town status in 1984. Before that it was a fishing village of a few hundred people. The families that were here before the tourists — the Nunez family, the Guerrero family, the Alamilla family — many of them are still here. Their grandchildren run the restaurants and the charter boats.',
      'Tourism has changed San Pedro. The island has not changed San Pedro. There is a difference, and the first hour of morning is where you feel it.',
    ],
    rene: 'I leave before sunrise because that\'s when the fishing is best. But I also leave early because I love this island before the noise starts. If you want to see Belize — the real one — come with me at 5:30. I\'ll have coffee.',
    available: true,
  },
];

function ChapterCard({
  chapter,
  onClick,
  isActive,
}: {
  chapter: Chapter;
  onClick: () => void;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleMouseEnter() {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
  }
  function handleMouseLeave() {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300
        ${isActive ? 'ring-2 ring-amber-400 scale-[1.02]' : 'hover:scale-[1.01]'}`}
      style={{ aspectRatio: '9/14' }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={chapter.video}
        suppressHydrationWarning
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedMetadata={(e) => {
          (e.target as HTMLVideoElement).playbackRate = 0.5;
        }}
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-start justify-between">
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase text-white px-2 py-1 rounded-full ${chapter.categoryColor}`}>
            {chapter.category}
          </span>
          <span className="text-white/40 text-[10px] font-mono">{chapter.episode}</span>
        </div>
        <div>
          <h3 className="text-white font-bold text-sm leading-tight mb-1"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            {chapter.title}
          </h3>
          <p className="text-white/50 text-[11px] leading-snug mb-3">{chapter.tagline}</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-amber-400 text-[10px] font-semibold uppercase tracking-wide">
              {isActive ? 'Reading now' : 'Read the story'}
            </span>
          </div>
        </div>
      </div>

      {/* Sound indicator on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-white text-[10px]">≡ƒöè</span>
        </div>
      </div>
    </div>
  );
}

function SidePanel({
  chapter,
  onClose,
  side,
}: {
  chapter: Chapter | null;
  onClose: () => void;
  side: 'left' | 'right';
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (chapter) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [chapter, onClose]);

  if (!chapter) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />

      <div
        className={`fixed top-0 ${side === 'right' ? 'left-0' : 'right-0'} 
                    w-[50vw] h-[100vh] z-[45] pointer-events-none overflow-hidden`}
      >
        <video
          key={chapter.video}
          src={chapter.video}
          autoPlay
          muted
          loop
          playsInline
          suppressHydrationWarning
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-full w-full max-w-lg
                    bg-[#0a0a0f] border-${side === 'right' ? 'l' : 'r'} border-white/10
                    z-50 overflow-y-auto`}
        style={{ boxShadow: side === 'right' ? '-20px 0 60px rgba(0,0,0,0.5)' : '20px 0 60px rgba(0,0,0,0.5)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10
                     hover:bg-white/20 text-white flex items-center justify-center
                     transition-all z-10 text-sm"
        >
          ✕
        </button>

        {/* Panel content */}
        <div className="p-8 pt-16">
          {/* Episode + Category */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-white/30 text-xs font-mono">{chapter.episode}</span>
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase text-white px-2 py-1 rounded-full ${chapter.categoryColor}`}>
              {chapter.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2 leading-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            {chapter.title}
          </h2>
          <p className="text-white/40 text-sm mb-8 italic">{chapter.tagline}</p>

          {/* Headline */}
          <h3 className="text-amber-400 text-lg font-bold mb-6 leading-snug">
            {chapter.headline}
          </h3>

          {/* Body paragraphs */}
          <div className="space-y-5 mb-10">
            {chapter.body.map((para, i) => (
              <p key={i} className="text-white/70 text-sm leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* René's take */}
          <div className="border-t border-white/10 pt-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40
                              flex items-center justify-center text-amber-400 text-sm">
                R
              </div>
              <div>
                <p className="text-white text-xs font-bold">Captain René</p>
                <p className="text-white/40 text-[11px]">San Pedro, Belize · Local expert</p>
              </div>
            </div>
            <blockquote className="text-white/80 text-sm leading-relaxed italic border-l-2 border-amber-400/50 pl-4">
              &ldquo;{chapter.rene}&rdquo;
            </blockquote>
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/40 text-xs mb-4">
              Ready to experience this with a local who knows every corner of it?
            </p>
            <a
              href="/tours/custom-charter"
              className="block w-full text-center py-3.5 rounded-xl bg-amber-400
                         hover:bg-amber-300 text-black font-bold text-sm transition-all"
            >
              Plan Your Day With René →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BelizeDiscovery() {
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('right');

  function handleCardClick(chapter: Chapter, colIndex: number) {
    if (activeChapter?.id === chapter.id) {
      setActiveChapter(null);
      return;
    }
    // Left 2 columns open right panel, right column opens left panel
    setPanelSide(colIndex >= 2 ? 'left' : 'right');
    setActiveChapter(chapter);
  }

  return (
    <section id="belize-discovery" className="bg-[#060608] py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400 mb-3">
            BELIZE · UNTOLD
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Nine Chapters.<br />
            <span className="text-amber-400 italic">One Island.</span>
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto leading-relaxed">
            Most people get the surface. Click any chapter to go deeper —
            the history, the culture, and what the locals actually know.
          </p>
          <p className="text-white/30 text-xs mt-3 italic">
            Hover to hear it. Click to read the story.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {CHAPTERS.map((chapter, i) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              isActive={activeChapter?.id === chapter.id}
              onClick={() => handleCardClick(chapter, i % 3)}
            />
          ))}
        </div>

        {/* Lia CTA */}
        <div className="text-center mt-16">
          <p className="text-white/40 text-sm mb-4 max-w-md mx-auto">
            Questions about Belize? René knows every reef, ruin, and hidden beach.
            Ask Lia — available 24/7.
          </p>
          <button
            onClick={() => {
              const btn = document.querySelector('[data-lia-trigger]') as HTMLElement;
              window.dispatchEvent(new CustomEvent("lia:open",{detail:{message:"I just read about Belize and I am blown away. The Blue Hole, the ruins, lobster season. Where would you tell someone to start?"}}));
            }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full
                       bg-white/5 hover:bg-white/10 text-white font-semibold
                       text-sm border border-white/20 hover:border-white/40
                       transition-all backdrop-blur-sm"
          >
            🎙️ Ask Lia — Your Belize Expert
          </button>
        </div>
      </div>

      {/* Side Panel */}
      <SidePanel
        chapter={activeChapter}
        onClose={() => setActiveChapter(null)}
        side={panelSide}
      />
    </section>
  );
}
