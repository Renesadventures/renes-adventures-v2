'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Anchor,
  Camera,
  CheckCircle2,
  Fish,
  Flame,
  LifeBuoy,
  Map,
  PartyPopper,
  Shell,
  ShieldCheck,
  Snail,
  Sun,
  Sunset,
  UserPlus,
  Waves,
} from 'lucide-react';

import { buildWhatsAppTourLink, getWhatsAppLink } from '@/lib/utils/whatsapp-link';
import { getTourBySlug, tours } from '@/data/tours';

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

type ActivityKey =
  | 'deep-sea-trolling'
  | 'reef-fishing'
  | 'spearfishing'
  | 'hol-chan'
  | 'conch-lobster'
  | 'caye-caulker'
  | 'beach-bbq'
  | 'secret-beach'
  | 'snorkeling'
  | 'sunset-ritual';

type Activity = {
  id: ActivityKey;
  title: string;
  shortLabel: string;
  icon: ReactNode;
  image: string;
  video: string;
  minutes: number;
  description: string;
};

type AddOnKey = 'bbq-upgrade' | 'extra-guest' | 'snorkel-premium' | 'underwater-camera';

type AddOn = {
  id: AddOnKey;
  title: string;
  price: number;
  icon: ReactNode;
  blurb: string;
};

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function estimatePace(totalMinutes: number, count: number) {
  if (count === 0) return 'Select something. Then select something else.';
  if (totalMinutes <= 240) return `${count} activities selected = Perfect half-day pace`;
  if (totalMinutes <= 420) return `${count} activities selected = Full-day momentum`;
  return `${count} activities selected = Legendary day. Non-stop.`;
}

function getTimelineColor(idx: number) {
  const colors = ['bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500', 'bg-teal-500'];
  return colors[idx % colors.length];
}

export default function CustomCharterPage() {
  const tour = getTourBySlug('custom-charter');

  const activities = useMemo<Activity[]>(
    () => [
      {
        id: 'deep-sea-trolling',
        title: 'Deep Sea Trolling',
        shortLabel: 'Trolling',
        icon: <Fish className="h-5 w-5" />,
        image: `${base}/images/renes-activities/Deep-sea-fishing.jpeg`,
        video: `${base}/hero/deep-sea-fIshing.mp4`,
        minutes: 90,
        description:
          'The reel screams. Your arms burn. The water explodes 50 yards out. Mahi-mahi. Wahoo. Barracuda. This is big game fishing—Belize style.',
      },
      {
        id: 'reef-fishing',
        title: 'Reef Fishing',
        shortLabel: 'Reef',
        icon: <Waves className="h-5 w-5" />,
        image: `${base}/images/renes-activities/offshore-fishing-2024-10-15-06-43-13-utc.jpg`,
        video: `${base}/hero/Reef Fishing.mp4`,
        minutes: 75,
        description:
          "Snappers. Groupers. Jacks. The reef is alive. Light tackle. Fast action. Dinner's in the cooler before lunch.",
      },
      {
        id: 'spearfishing',
        title: 'Spearfishing',
        shortLabel: 'Spear',
        icon: <LifeBuoy className="h-5 w-5" />,
        image: `${base}/images/renes-activities/man-holding-fresh-caught-mahi-mahi-on-ocean-boat-2025-01-07-04-47-33-utc.jpg`,
        video: `${base}/luxury/deep-sea-fishing.mp4`,
        minutes: 75,
        description: 'Dive. Hunt. Surface. Repeat. This is primal. You vs. fish. No rods. No rules. Just skill.',
      },
      {
        id: 'hol-chan',
        title: 'Hol Chan Marine Reserve',
        shortLabel: 'Hol Chan',
        icon: <Anchor className="h-5 w-5" />,
        image: `${base}/images/renes-activities/colorful-sea-life-underwater-shallow-underwater-s-2025-02-18-05-18-34-utc.jpg`,
        video: `${base}/luxury/Secrete Beach 5.mp4`,
        minutes: 90,
        description:
          "Swim with nurse sharks. Stingrays glide under your fins. Sea turtles surface for air. This is the Caribbean's underwater cathedral.",
      },
      {
        id: 'conch-lobster',
        title: 'Conch & Lobster Diving',
        shortLabel: 'Conch/Lobster',
        icon: <Shell className="h-5 w-5" />,
        image: `${base}/images/renes-activities/live-big-lobster-in-the-hands-of-people-selective-2024-12-19-13-46-57-utc.JPG`,
        video: `${base}/luxury/Lobster Fishing 1.mp4`,
        minutes: 90,
        description: 'Hunt your feast. Fresh conch ceviche. Grilled lobster tails. Caught by YOU. Cooked on the beach.',
      },
      {
        id: 'caye-caulker',
        title: 'Caye Caulker',
        shortLabel: 'Caye Caulker',
        icon: <Map className="h-5 w-5" />,
        image: `${base}/images/renes-activities/caye-caulker-belize-2025-03-27-00-09-41-utc.jpg`,
        video: `${base}/luxury/Secrete Island 2.mp4`,
        minutes: 75,
        description:
          "Feed tarpon. Spot seahorses. Walk the famous 'Split.' This is where locals go to escape.",
      },
      {
        id: 'beach-bbq',
        title: 'Beach BBQ',
        shortLabel: 'BBQ',
        icon: <Flame className="h-5 w-5" />,
        image: `${base}/images/renes-activities/barbecue-chicken-meat-on-grill-2025-03-08-13-06-23-utc.jpg`,
        video: `${base}/hero/beach-bbq.mp4`,
        minutes: 90,
        description: 'White sand. Grilled lobster. Rum punch. Hammock time. This is the pause that makes the action sweeter.',
      },
      {
        id: 'secret-beach',
        title: 'Secret Beach',
        shortLabel: 'Secret Beach',
        icon: <Snail className="h-5 w-5" />,
        image: `${base}/images/renes-activities/exotic-beach-landscape-2024-10-12-01-05-44-utc.jpg`,
        video: `${base}/hero/secret-beach.mp4`,
        minutes: 60,
        description: 'Hidden. Pristine. Yours. Swim in glass-clear water. This beach has no crowds—just you and paradise.',
      },
      {
        id: 'snorkeling',
        title: 'Snorkeling',
        shortLabel: 'Snorkel',
        icon: <Waves className="h-5 w-5" />,
        image: `${base}/images/renes-activities/aerial-view-of-barrier-reef-caribbean-sea-2025-04-03-09-24-41-utc.jpg`,
        video: `${base}/luxury/Reef Fishing 6.mp4`,
        minutes: 60,
        description: 'Coral gardens. Tropical fish in every color. Underwater caves. The barrier reef is your aquarium.',
      },
      {
        id: 'sunset-ritual',
        title: 'Sunset Ritual',
        shortLabel: 'Sunset',
        icon: <Sunset className="h-5 w-5" />,
        image: `${base}/images/renes-activities/boat-silhouetted-against-a-beautiful-sunset-in-the-2025-02-11-23-57-55-utc.jpg`,
        video: `${base}/hero/sunset-ritual.mp4`,
        minutes: 60,
        description:
          'Golden hour. Cold drinks. No agenda. Watch the sun melt into the Caribbean. This is how every adventure should end.',
      },
    ],
    []
  );

  const addOns = useMemo<AddOn[]>(
    () => [
      {
        id: 'bbq-upgrade',
        title: 'Beach BBQ Upgrade',
        price: 75,
        icon: <Flame className="h-5 w-5" />,
        blurb: 'Lobster. Grilled fish. Beach vibes.',
      },
      {
        id: 'extra-guest',
        title: 'Extra Guest',
        price: 75,
        icon: <UserPlus className="h-5 w-5" />,
        blurb: 'Bring the crew. Up to 8 total.',
      },
      {
        id: 'snorkel-premium',
        title: 'Snorkel Gear Premium',
        price: 25,
        icon: <Waves className="h-5 w-5" />,
        blurb: 'GoPro-ready mask. Prescription available.',
      },
      {
        id: 'underwater-camera',
        title: 'Underwater Camera',
        price: 50,
        icon: <Camera className="h-5 w-5" />,
        blurb: 'Capture it all. 4K waterproof.',
      },
    ],
    []
  );

  const heroClips = useMemo(() => {
    return activities.map((a) => ({ id: a.id, label: a.title, thumb: a.image, src: a.video }));
  }, [activities]);

  const [selectedVideo, setSelectedVideo] = useState(() => `${base}/hero/renes-custom-adventures.mp4`);
  const [selectedVideoLabel, setSelectedVideoLabel] = useState(() => heroClips[0]?.label || 'Custom Charter');

  const [selectedActivities, setSelectedActivities] = useState<Record<ActivityKey, boolean>>(() => ({
    'deep-sea-trolling': false,
    'reef-fishing': false,
    spearfishing: false,
    'hol-chan': false,
    'conch-lobster': false,
    'caye-caulker': false,
    'beach-bbq': false,
    'secret-beach': false,
    snorkeling: false,
    'sunset-ritual': false,
  }));

  const includedGuests = tour?.includedGuests ?? 4;
  const baseHalfDay = tour?.price ?? 400;
  const baseFullDay = tour?.priceFullDay ?? 600;

  const [duration, setDuration] = useState<'half' | 'full'>('half');
  const [guests, setGuests] = useState(4);

  const [addOnQty, setAddOnQty] = useState<Record<AddOnKey, number>>({
    'bbq-upgrade': 0,
    'extra-guest': 0,
    'snorkel-premium': 0,
    'underwater-camera': 0,
  });

  const activityCount = useMemo(() => {
    return (Object.keys(selectedActivities) as ActivityKey[]).reduce((sum, k) => sum + (selectedActivities[k] ? 1 : 0), 0);
  }, [selectedActivities]);

  const totalActivityMinutes = useMemo(() => {
    return activities.reduce((sum, a) => sum + (selectedActivities[a.id] ? a.minutes : 0), 0);
  }, [activities, selectedActivities]);

  const paceLabel = useMemo(() => estimatePace(totalActivityMinutes, activityCount), [activityCount, totalActivityMinutes]);

  const basePrice = useMemo(() => (duration === 'full' ? baseFullDay : baseHalfDay), [baseFullDay, baseHalfDay, duration]);

  const effectiveGuests = useMemo(() => clamp(guests + (addOnQty['extra-guest'] || 0), 1, 8), [addOnQty, guests]);
  const overageGuests = useMemo(() => Math.max(0, effectiveGuests - includedGuests), [effectiveGuests, includedGuests]);
  const overageCost = useMemo(() => overageGuests * 75, [overageGuests]);

  const addOnsTotal = useMemo(() => {
    return addOns.reduce((sum, a) => sum + (addOnQty[a.id] || 0) * a.price, 0);
  }, [addOnQty, addOns]);

  const liveTotal = useMemo(() => {
    const subtotal = basePrice + overageCost + addOnsTotal;
    return subtotal;
  }, [addOnsTotal, basePrice, overageCost]);

  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setStickyVisible(window.scrollY > 520);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const youMightAlsoLike = useMemo(() => {
    const picks = ['deep-sea-fishing', 'sunset-cruise', 'blue-hole-adventure', 'secret-beach'];
    const mapped = picks.map((slug) => tours.find((t) => t.slug === slug)).filter(Boolean);
    if (mapped.length >= 4) return mapped.slice(0, 4);
    const fallback = tours.filter((t) => t.slug !== 'custom-charter').slice(0, 4);
    return fallback;
  }, []);

  const onOpenLia = (message: string) => {
    window.dispatchEvent(new CustomEvent('lia:open', { detail: { message } }));
  };

  const onOpenWhatsApp = () => {
    const url = buildWhatsAppTourLink({ tourName: 'Custom Charter' });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const onOpenWhatsAppLargeGroup = () => {
    const url = getWhatsAppLink('Hi René,\n\nWe are 9+ guests. Can you help us book a private fleet for a Custom Charter?\n\nThank you!');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0FDFF] via-white to-[#FFF7ED] text-slate-900">
      <section className="relative">
        <div className="absolute inset-0">
          <video
            key={selectedVideo}
            src={selectedVideo}
            className="h-full w-full object-cover"
            playsInline
            autoPlay
            muted
            loop
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-white" />
        </div>

        <div className="relative mx-auto w-full max-w-screen-2xl px-4 pt-24 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-white backdrop-blur-md">
                <PartyPopper className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.3em]">Custom Charter</span>
              </div>

              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                Your Boat. Your Day. Your Adventure.
              </h1>
              <p className="mt-4 text-lg md:text-2xl text-white/90 max-w-2xl">
                One boat. Ten adventures. Pure Belize magic.
              </p>

              <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden">
                <div className="p-4 md:p-5">
                  <div className="text-[11px] uppercase tracking-[0.35em] text-white/80">Now Playing</div>
                  <div className="mt-2 text-2xl md:text-3xl font-extrabold text-white leading-tight">{selectedVideoLabel}</div>
                  <div className="mt-2 text-sm text-white/80">
                    You tap. The story changes. The day gets better.
                  </div>
                </div>
                <div className="px-4 pb-4 md:px-5 md:pb-5">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {heroClips.slice(0, 10).map((clip) => {
                      const active = clip.src === selectedVideo;
                      return (
                        <button
                          key={clip.id}
                          type="button"
                          onClick={() => {
                            setSelectedVideo(clip.src);
                            setSelectedVideoLabel(clip.label);
                          }}
                          className={`group relative overflow-hidden rounded-2xl border transition text-left h-20 sm:h-24 ${
                            active ? 'border-amber-300/80 ring-2 ring-amber-300/40' : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          <Image src={clip.thumb} alt="" fill className="object-cover" sizes="(min-width: 640px) 20vw, 50vw" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                          <div className="absolute left-3 right-3 bottom-2">
                            <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white line-clamp-2">
                              {clip.label}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-5 md:p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.35em] text-white/80">Starting at</div>
                    <div className="mt-2 text-4xl font-extrabold text-amber-300">{formatMoney(baseHalfDay)}</div>
                    <div className="mt-1 text-sm text-white/85">Full day: {formatMoney(baseFullDay)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.35em] text-white/80">Capacity</div>
                    <div className="mt-2 text-sm font-semibold text-white">Up to 8 guests</div>
                    <div className="mt-1 text-sm text-white/85">9+? Private fleet.</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDuration('half')}
                    className={`h-12 rounded-2xl border text-xs font-extrabold uppercase tracking-[0.25em] transition ${
                      duration === 'half' ? 'border-white/30 bg-white text-slate-950' : 'border-white/30 bg-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    Half Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuration('full')}
                    className={`h-12 rounded-2xl border text-xs font-extrabold uppercase tracking-[0.25em] transition ${
                      duration === 'full' ? 'border-white/30 bg-white text-slate-950' : 'border-white/30 bg-white/10 text-white hover:bg-white/15'
                    }`}
                  >
                    Full Day
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.35em] text-white/80">Guests</div>
                      <div className="mt-1 text-sm text-white/85">Includes {includedGuests}. Extra guests: $75.</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => clamp(g - 1, 1, 8))}
                        className="h-10 w-10 rounded-full border border-white/25 bg-white/10 text-white font-black hover:bg-white/15 transition"
                      >
                        −
                      </button>
                      <div className="min-w-[54px] text-center">
                        <div className="text-2xl font-extrabold text-white">{guests}</div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-white/70">Base</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => clamp(g + 1, 1, 8))}
                        className="h-10 w-10 rounded-full border border-white/25 bg-white/10 text-white font-black hover:bg-white/15 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-white/10 px-4 py-3">
                    <div className="text-sm font-semibold text-white">Live total</div>
                    <div className="text-lg font-extrabold text-amber-300">{formatMoney(liveTotal)}</div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <button
                    type="button"
                    onClick={onOpenWhatsApp}
                    className="h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg border border-black/15 hover:brightness-105 transition"
                  >
                    Book Your Perfect Day
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenLia('Build me a perfect Custom Charter day in Belize.')} 
                    className="h-14 rounded-2xl border border-white/30 bg-white/10 text-white font-extrabold text-sm uppercase tracking-[0.25em] hover:bg-white/15 transition"
                  >
                    Talk to Lia
                  </button>
                  <button
                    type="button"
                    onClick={onOpenWhatsAppLargeGroup}
                    className="h-14 rounded-2xl border border-white/30 bg-white/5 text-white font-extrabold text-sm uppercase tracking-[0.25em] hover:bg-white/10 transition"
                  >
                    9+ Guests? Private Fleet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 py-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">The Promise</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">This Isn&apos;t a Tour. It&apos;s Your Perfect Day.</h2>
          <p className="mt-4 text-lg text-slate-700">
            You decide on the boat. Captain René adapts. This is YOUR day.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Maximum Overdrive',
              icon: <Flame className="h-5 w-5" />,
              body: 'Non-stop action. 5+ activities. Adrenaline on demand.',
            },
            {
              title: 'The Explorer',
              icon: <Map className="h-5 w-5" />,
              body: 'Balanced pace. See everything. Savor the moments that matter.',
            },
            {
              title: 'Island Time',
              icon: <Sun className="h-5 w-5" />,
              body: 'Slow down. Dive deep. One or two experiences done right.',
            },
          ].map((c) => (
            <div key={c.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">{c.icon}</div>
                <div className="text-lg font-extrabold">{c.title}</div>
              </div>
              <div className="mt-4 text-slate-700 leading-relaxed">{c.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">The 10 Adventures</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Pick the moments you&apos;ll talk about forever.</h2>
          <p className="mt-4 text-lg text-slate-700">Each one hits different. Stack them. Mix them. Make it yours.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a) => {
            const checked = selectedActivities[a.id];
            return (
              <article key={a.id} className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="relative h-48">
                  <Image src={a.image} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 33vw, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute left-5 right-5 bottom-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-white">
                      <div className="h-9 w-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">{a.icon}</div>
                      <div className="font-extrabold leading-tight">{a.title}</div>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-white/90">{Math.round(a.minutes / 30) * 0.5}h+</div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-slate-700 leading-relaxed">{a.description}</div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedActivities((prev) => ({ ...prev, [a.id]: !prev[a.id] }));
                      }}
                      className={`h-12 rounded-2xl px-5 font-extrabold uppercase tracking-[0.18em] text-xs transition border ${
                        checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {checked ? 'Added' : 'Add This'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVideo(a.video);
                        setSelectedVideoLabel(a.title);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="h-12 rounded-2xl px-5 font-extrabold uppercase tracking-[0.18em] text-xs border border-slate-200 bg-white hover:bg-slate-50 transition"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-7 md:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Build Your Day</div>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Pick 1. Pick all 10. It&apos;s your call.</h2>
              <p className="mt-4 text-lg text-slate-700">You choose the direction. We handle the magic.</p>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-[11px] uppercase tracking-[0.35em] text-slate-600">Live Pace</div>
                <div className="mt-2 text-lg font-extrabold text-slate-900">{paceLabel}</div>
                <div className="mt-2 text-sm text-slate-700">Timeline adjusts as you stack adventures.</div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDuration('half')}
                  className={`h-12 rounded-2xl border text-xs font-extrabold uppercase tracking-[0.25em] transition ${
                    duration === 'half' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  Half Day
                </button>
                <button
                  type="button"
                  onClick={() => setDuration('full')}
                  className={`h-12 rounded-2xl border text-xs font-extrabold uppercase tracking-[0.25em] transition ${
                    duration === 'full' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  Full Day
                </button>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.35em] text-slate-600">Guests</div>
                    <div className="mt-1 text-sm text-slate-700">Includes {includedGuests}. Extra guests are $75.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => clamp(g - 1, 1, 8))}
                      className="h-10 w-10 rounded-full border border-slate-200 bg-white font-black hover:bg-slate-50 transition"
                    >
                      −
                    </button>
                    <div className="min-w-[64px] text-center">
                      <div className="text-2xl font-extrabold text-slate-900">{effectiveGuests}</div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Total</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => clamp(g + 1, 1, 8))}
                      className="h-10 w-10 rounded-full border border-slate-200 bg-white font-black hover:bg-slate-50 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activities.map((a) => {
                  const checked = selectedActivities[a.id];
                  return (
                    <label
                      key={a.id}
                      className={`flex items-start gap-4 rounded-3xl border p-5 transition cursor-pointer ${
                        checked ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setSelectedActivities((prev) => ({ ...prev, [a.id]: !prev[a.id] }))}
                        className="mt-1.5 h-5 w-5"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                            {a.icon}
                          </div>
                          <div className="font-extrabold text-slate-900 truncate">{a.title}</div>
                        </div>
                        <div className="mt-2 text-sm text-slate-700 line-clamp-2">{a.description}</div>
                        <div className="mt-3 text-[11px] uppercase tracking-[0.25em] text-slate-500">~{a.minutes} minutes</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.35em] text-slate-600">Visual Timeline</div>
                    <div className="mt-2 text-lg font-extrabold text-slate-900">Your day, in motion.</div>
                  </div>
                  <div className="text-sm text-slate-700">Total: {Math.round(totalActivityMinutes / 15) * 15} min</div>
                </div>

                <div className="mt-5 flex h-12 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {activities
                    .filter((a) => selectedActivities[a.id])
                    .map((a, idx) => {
                      const widthPct = totalActivityMinutes > 0 ? (a.minutes / totalActivityMinutes) * 100 : 0;
                      return (
                        <div
                          key={a.id}
                          className={`${getTimelineColor(idx)} h-full`}
                          style={{ width: `${widthPct}%` }}
                          title={a.title}
                        />
                      );
                    })}
                </div>

                {activityCount === 0 && <div className="mt-3 text-sm text-slate-600">Select activities to see your timeline build.</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Add-Ons Supermarket</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">You&apos;re already out here. Go bigger.</h2>
          <p className="mt-4 text-lg text-slate-700">Impulse-buy energy. Zero regrets.</p>
        </div>

        <div className="mt-8 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin]">
          <div className="flex gap-4 min-w-max">
            {addOns.map((a) => {
              const q = addOnQty[a.id] || 0;
              return (
                <div key={a.id} className="w-[320px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">{a.icon}</div>
                      <div>
                        <div className="font-extrabold text-slate-900">{a.title}</div>
                        <div className="mt-1 text-sm text-slate-600">{formatMoney(a.price)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAddOnQty((prev) => ({ ...prev, [a.id]: Math.max(0, (prev[a.id] || 0) - 1) }))}
                        disabled={q <= 0}
                        className="h-9 w-9 rounded-full border border-slate-200 bg-white font-black hover:bg-slate-50 transition disabled:opacity-40"
                      >
                        −
                      </button>
                      <div className="min-w-[28px] text-center font-extrabold text-slate-900">{q}</div>
                      <button
                        type="button"
                        onClick={() => setAddOnQty((prev) => ({ ...prev, [a.id]: (prev[a.id] || 0) + 1 }))}
                        className="h-9 w-9 rounded-full border border-slate-200 bg-white font-black hover:bg-slate-50 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-slate-700 leading-relaxed">{a.blurb}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">What to Bring</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Show up ready. Leave with stories.</h2>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Reef-Safe Sunscreen', icon: <Sun className="h-5 w-5" /> },
            { label: 'Swimwear', icon: <Waves className="h-5 w-5" /> },
            { label: 'Polarized Sunglasses', icon: <ShieldCheck className="h-5 w-5" /> },
            { label: 'Towel', icon: <CheckCircle2 className="h-5 w-5" /> },
            { label: 'Camera', icon: <Camera className="h-5 w-5" /> },
            { label: 'Sense of Adventure', icon: <PartyPopper className="h-5 w-5" /> },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="h-10 w-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">{item.icon}</div>
              <div className="mt-4 font-extrabold text-slate-900">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
        <div className="rounded-[2.5rem] border border-amber-200 bg-amber-50 p-8 md:p-10">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-3xl bg-white border border-amber-200 flex items-center justify-center text-amber-800">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-amber-800">The Guarantee</div>
              <h2 className="mt-3 text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">Local knowledge. On your side.</h2>
              <p className="mt-4 text-lg text-slate-800 leading-relaxed">
                If conditions aren&apos;t perfect, we adjust. If the fish aren&apos;t biting deep, we hit the reef. If the wind picks up, we find the lee side.
                This is 25 years of local knowledge—working for YOU.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Guest Info</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Book fast. Or go massive.</h2>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-extrabold text-slate-900">Up to 8 guests</div>
            <div className="mt-3 text-slate-700 leading-relaxed">Book online instantly. Lock your date. Build your day.</div>
            <button
              type="button"
              onClick={onOpenWhatsApp}
              className="mt-5 h-12 w-full rounded-2xl bg-amber-400 text-slate-950 font-black hover:brightness-105 transition"
            >
              Book on WhatsApp
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-extrabold text-slate-900">9+ guests?</div>
            <div className="mt-3 text-slate-700 leading-relaxed">Private fleet available. We coordinate. You just show up.</div>
            <button
              type="button"
              onClick={onOpenWhatsAppLargeGroup}
              className="mt-5 h-12 w-full rounded-2xl border border-slate-200 bg-white font-extrabold hover:bg-slate-50 transition"
            >
              WhatsApp +501 670 7760
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-extrabold text-slate-900">Talk to Lia</div>
            <div className="mt-3 text-slate-700 leading-relaxed">She&apos;ll build your perfect day. Fast. Personal. Zero stress.</div>
            <button
              type="button"
              onClick={() => onOpenLia('Hi Lia — help me build the perfect Custom Charter day.')} 
              className="mt-5 h-12 w-full rounded-2xl border border-slate-200 bg-white font-extrabold hover:bg-slate-50 transition"
            >
              Open Lia Chat
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Real Moments</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">The kind of day that rewires your brain.</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Alyssa M.',
              stars: '★★★★★',
              quote: 'The tarpon exploded on the surface. We screamed. We laughed. It felt unreal.',
              photo: `${base}/images/renes-activities/happy-female-with-a-caught-fish-in-one-hand-and-ho-2025-02-02-21-04-23-utc.jpg`,
            },
            {
              name: 'Jordan K.',
              stars: '★★★★★',
              quote: 'Hol Chan was pure magic. Rays under our fins. Turtles surfacing for air. We will never forget it.',
              photo: `${base}/images/renes-activities/happy-young-woman-showcasing-her-catch-on-a-sunny-2025-04-05-03-50-43-utc.jpg`,
            },
            {
              name: 'Mia & Theo',
              stars: '★★★★★',
              quote: 'Beach BBQ with fresh catch. Rum punch. Sunset on the ride back. Best day of our lives.',
              photo: `${base}/images/renes-activities/millennial-women-reeling-in-the-fish-2024-11-30-20-54-55-utc.jpg`,
            },
          ].map((r) => (
            <article key={r.name} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="relative h-40">
                <Image src={r.photo} alt="" fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute left-5 bottom-4">
                  <div className="text-white font-extrabold">{r.name}</div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-amber-300">{r.stars}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-slate-800 font-extrabold">“{r.quote}”</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 pb-28">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">You Might Also Like</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Keep the adrenaline going.</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {youMightAlsoLike.map((t) => (
            <Link
              key={t!.slug}
              href={`/tours/${t!.slug}`}
              className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-44">
                <Image
                  src={`${base}${t!.imageUrl}`}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute left-5 right-5 bottom-4">
                  <div className="text-white font-extrabold leading-tight">{t!.title}</div>
                  <div className="mt-1 text-sm text-white/85">From {formatMoney(t!.price)}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-400 text-slate-950 font-extrabold px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  View Tour
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div
        className={`fixed left-0 right-0 bottom-0 z-50 transition-transform duration-300 ${
          stickyVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 pb-4">
          <div className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-lg px-5 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Sunset className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Custom Charter</div>
                  <div className="text-sm text-slate-600">{activityCount} activities selected</div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Live total</div>
                  <div className="text-xl font-extrabold text-slate-900">{formatMoney(liveTotal)}</div>
                </div>

                <button
                  type="button"
                  onClick={onOpenWhatsApp}
                  className="h-12 px-6 rounded-2xl bg-amber-500 text-slate-950 font-black border border-black/10 hover:brightness-105 transition"
                >
                  Book Your Perfect Day
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
