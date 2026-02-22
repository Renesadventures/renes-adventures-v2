'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Anchor,
  Banknote,
  Camera,
  Droplets,
  Fish,
  Flame,
  Footprints,
  Glasses,
  LifeBuoy,
  Map,
  PartyPopper,
  Shell,
  ShieldCheck,
  Sun,
  Wind,
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
  | 'conch-hunt'
  | 'lobster-mission'
  | 'caye-caulker'
  | 'beach-bbq'
  | 'snorkeling'
  ;

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

type AddOnId =
  | 'beach-bbq'
  | 'bbq-extra-guest'
  | 'snorkel-gear'
  | 'holchan-fee'
  | 'tshirt-adult'
  | 'tshirt-xxl'
  | 'tshirt-youth'
  | 'hat-standard'
  | 'hat-leather';

interface AddOn {
  id: AddOnId;
  label: string;
  note: string;
  price: number;
  perGuest: boolean;
}

type RelatedCard = {
  slug: string;
  title: string;
  price: number;
  imageSrc: string;
};

const ADDONS: AddOn[] = [
  {
    id: 'beach-bbq',
    label: 'Beach BBQ',
    note: 'Up to 4 guests — fresh catch, lobster & conch when in season, ceviche, potatoes, vegetables, rice',
    price: 75,
    perGuest: true,
  },
  {
    id: 'bbq-extra-guest',
    label: 'Beach BBQ – Extra Guest',
    note: 'Per guest beyond 4',
    price: 25,
    perGuest: true,
  },
  {
    id: 'snorkel-gear',
    label: 'Snorkel Gear Rental',
    note: 'Per person — or bring your own',
    price: 15,
    perGuest: true,
  },
  {
    id: 'holchan-fee',
    label: 'Hol Chan Marine Reserve Fee',
    note: 'Per person — paid directly to ranger at time of boat entry',
    price: 15,
    perGuest: true,
  },
  {
    id: 'tshirt-adult',
    label: 'T-Shirt – Adult (S/M/L/XL)',
    note: 'Standard sizes',
    price: 25,
    perGuest: false,
  },
  {
    id: 'tshirt-xxl',
    label: 'T-Shirt – XXL / XXXL',
    note: 'Extended sizes',
    price: 30,
    perGuest: false,
  },
  {
    id: 'tshirt-youth',
    label: 'T-Shirt – Youth (S/M/L)',
    note: 'Kids sizes',
    price: 20,
    perGuest: false,
  },
  {
    id: 'hat-standard',
    label: 'Snapback Hat – Standard',
    note: 'Classic snapback',
    price: 30,
    perGuest: false,
  },
  {
    id: 'hat-leather',
    label: 'Snapback Hat – Leather Patch',
    note: 'Premium leather patch design',
    price: 35,
    perGuest: false,
  },
];

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
        title: 'Deep Sea Fishing',
        shortLabel: 'Deep Sea',
        icon: <Fish className="h-5 w-5 text-sky-600" />,
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
        icon: <Waves className="h-5 w-5 text-emerald-600" />,
        image: `${base}/images/renes-activities/offshore-fishing-2024-10-15-06-43-13-utc.jpg`,
        video: `${base}/hero/Reef Fishing.mp4`,
        minutes: 75,
        description:
          "Snappers. Groupers. Jacks. The reef is alive. Light tackle. Fast action. Dinner's in the cooler before lunch.",
      },
      {
        id: 'spearfishing',
        title: 'Speargun Fishing',
        shortLabel: 'Speargun',
        icon: <LifeBuoy className="h-5 w-5 text-indigo-600" />,
        image: `${base}/images/renes-activities/man-holding-fresh-caught-mahi-mahi-on-ocean-boat-2025-01-07-04-47-33-utc.jpg`,
        video: `${base}/luxury/deep-sea-fishing.mp4`,
        minutes: 75,
        description: 'Dive. Hunt. Surface. Repeat. This is primal. You vs. fish. No rods. No rules. Just skill.',
      },
      {
        id: 'hol-chan',
        title: 'Hol Chan Marine Reserve',
        shortLabel: 'Hol Chan',
        icon: <Anchor className="h-5 w-5 text-cyan-600" />,
        image: `${base}/images/renes-activities/colorful-sea-life-underwater-shallow-underwater-s-2025-02-18-05-18-34-utc.jpg`,
        video: `${base}/luxury/Secrete Beach 5.mp4`,
        minutes: 90,
        description:
          "Swim with nurse sharks. Stingrays glide under your fins. Sea turtles surface for air. This is the Caribbean's underwater cathedral.",
      },
      {
        id: 'conch-hunt',
        title: 'Conch Hunt (Seasonal)',
        shortLabel: 'Conch',
        icon: <Shell className="h-5 w-5 text-amber-600" />,
        image: 'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?w=1200&q=80',
        video: `${base}/luxury/Conch Fishing 1.mp4`,
        minutes: 75,
        description: 'If conditions allow, we hunt conch and prep it island-style for ceviche. Fresh, clean, unreal.',
      },
      {
        id: 'lobster-mission',
        title: 'Lobster Mission (Seasonal)',
        shortLabel: 'Lobster',
        icon: <Shell className="h-5 w-5 text-red-600" />,
        image: `${base}/images/renes-activities/live-big-lobster-in-the-hands-of-people-selective-2024-12-19-13-46-57-utc.JPG`,
        video: `${base}/luxury/Lobster Fishing 1.mp4`,
        minutes: 75,
        description: 'Seasonal lobster mission—quick, clean, and unforgettable. Catch it. Cook it. Eat it on the sand.',
      },
      {
        id: 'caye-caulker',
        title: 'Caye Caulker',
        shortLabel: 'Caye Caulker',
        icon: <Map className="h-5 w-5 text-purple-600" />,
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
        icon: <Flame className="h-5 w-5 text-orange-600" />,
        image: `${base}/images/renes-activities/barbecue-chicken-meat-on-grill-2025-03-08-13-06-23-utc.jpg`,
        video: `${base}/hero/beach-bbq.mp4`,
        minutes: 90,
        description: 'White sand. Grilled lobster. Rum punch. Hammock time. This is the pause that makes the action sweeter.',
      },
      {
        id: 'snorkeling',
        title: 'Snorkeling',
        shortLabel: 'Snorkel',
        icon: <Waves className="h-5 w-5 text-teal-600" />,
        image: `${base}/images/renes-activities/aerial-view-of-barrier-reef-caribbean-sea-2025-04-03-09-24-41-utc.jpg`,
        video: `${base}/luxury/Reef Fishing 6.mp4`,
        minutes: 60,
        description: 'Coral gardens. Tropical fish in every color. Underwater caves. The barrier reef is your aquarium.',
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
    'conch-hunt': false,
    'lobster-mission': false,
    'caye-caulker': false,
    'beach-bbq': false,
    snorkeling: false,
  }));

  const includedGuests = tour?.includedGuests ?? 4;
  const baseHalfDay = tour?.price ?? 400;
  const baseFullDay = tour?.priceFullDay ?? 675;

  const [duration, setDuration] = useState<'half' | 'full'>('half');
  const [guestCount, setGuestCount] = useState(4);

  const [addOnQty, setAddOnQty] = useState<Record<AddOnId, number>>({
    'beach-bbq': 0,
    'bbq-extra-guest': 0,
    'snorkel-gear': 0,
    'holchan-fee': 0,
    'tshirt-adult': 0,
    'tshirt-xxl': 0,
    'tshirt-youth': 0,
    'hat-standard': 0,
    'hat-leather': 0,
  });

  function incrementAddon(addon: AddOn) {
    setAddOnQty((prev) => {
      const current = prev[addon.id];
      const next = current === 0 && addon.perGuest ? guestCount : current + 1;
      return { ...prev, [addon.id]: next };
    });
  }

  function decrementAddon(id: AddOnId) {
    setAddOnQty((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  }

  const activityCount = useMemo(() => {
    return (Object.keys(selectedActivities) as ActivityKey[]).reduce((sum, k) => sum + (selectedActivities[k] ? 1 : 0), 0);
  }, [selectedActivities]);

  const totalActivityMinutes = useMemo(() => {
    return activities.reduce((sum, a) => sum + (selectedActivities[a.id] ? a.minutes : 0), 0);
  }, [activities, selectedActivities]);

  const paceLabel = useMemo(() => estimatePace(totalActivityMinutes, activityCount), [activityCount, totalActivityMinutes]);

  const isFullDay = duration === 'full';
  const basePrice = useMemo(() => (isFullDay ? 600 : 400), [isFullDay]);
  const extraGuests = useMemo(() => Math.max(0, guestCount - 4) * 75, [guestCount]);
  const addOnsTotal = useMemo(() => ADDONS.reduce((sum, a) => sum + a.price * addOnQty[a.id], 0), [addOnQty]);
  const subtotal = useMemo(() => basePrice + extraGuests + addOnsTotal, [addOnsTotal, basePrice, extraGuests]);
  const tax = useMemo(() => subtotal * 0.125, [subtotal]);
  const serviceFee = useMemo(() => subtotal * 0.06, [subtotal]);
  const liveTotal = useMemo(() => subtotal + tax + serviceFee, [serviceFee, subtotal, tax]);

  const selectedActivityList = useMemo(() => {
    return activities
      .filter((a) => selectedActivities[a.id])
      .map((a) => ({ id: a.id, label: a.title, price: 0 }));
  }, [activities, selectedActivities]);

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
    const related: RelatedCard[] = [
      {
        slug: 'deep-sea-fishing',
        title: 'Deep Sea Fishing',
        price: tours.find((t) => t.slug === 'deep-sea-fishing')?.price ?? 500,
        imageSrc: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-o5hV6mh8JgSKnVgyD8PdcxgUYxUOd8.jpg',
      },
      {
        slug: 'blue-hole-adventure',
        title: 'Blue Hole Adventure',
        price: tours.find((t) => t.slug === 'blue-hole-adventure')?.price ?? 600,
        imageSrc: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
      },
      {
        slug: 'custom-charter',
        title: "Rene's Custom Adventure",
        price: tours.find((t) => t.slug === 'custom-charter')?.price ?? 400,
        imageSrc: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-80sj5WrGZF6Lfws1XtSJTW7tipz3D8.jpg',
      },
    ];

    return related;
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

  function buildLineItems() {
    const items: {
      price_data: { currency: string; product_data: { name: string }; unit_amount: number };
      quantity: number;
    }[] = [];

    items.push({
      price_data: {
        currency: 'usd',
        product_data: { name: `Rene's Custom Adventure – ${isFullDay ? 'Full Day' : 'Half Day'}` },
        unit_amount: (isFullDay ? 600 : 400) * 100,
      },
      quantity: 1,
    });

    const extra = Math.max(0, guestCount - 4);
    if (extra > 0) {
      items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Additional Guest' },
          unit_amount: 75 * 100,
        },
        quantity: extra,
      });
    }

    ADDONS.forEach((addon) => {
      const qty = addOnQty[addon.id];
      if (qty > 0) {
        items.push({
          price_data: {
            currency: 'usd',
            product_data: { name: addon.label },
            unit_amount: addon.price * 100,
          },
          quantity: qty,
        });
      }
    });

    return items;
  }

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineItems: buildLineItems(),
          guestCount,
          duration: isFullDay ? 'Full Day' : 'Half Day',
          tourName: "Rene's Custom Adventure",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout failed: ' + (data.error ?? 'Unknown error'));
      }
    } catch {
      alert('Network error — please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0FDFF] via-white to-[#FFF7ED] text-slate-900 pb-24">
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
                Your Day. Your Boat. Your Adventure.
              </h1>
              <p className="mt-4 text-lg md:text-2xl text-white/90 max-w-2xl">
                One boat. Ten adventures. Pure Belize magic.
              </p>

              <div className="mt-6 rounded-2xl border border-white/20 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
                <div className="p-4 md:p-5">
                  <div className="text-[11px] uppercase tracking-[0.35em] text-white/80">Now Playing</div>
                  <div className="mt-2 text-2xl md:text-3xl font-extrabold text-white leading-tight">{selectedVideoLabel}</div>
                  {selectedVideoLabel.toLowerCase().includes('hol chan') && (
                    <p className="text-xs text-amber-400/80 mt-0.5">$15.00 fee paid directly to ranger at time of boat entry</p>
                  )}
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
              <div className="rounded-2xl border border-white/20 bg-white/[0.04] backdrop-blur-sm p-5 md:p-6">
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
                        onClick={() => setGuestCount((g) => clamp(g - 1, 1, 8))}
                        className="h-10 w-10 rounded-full border border-white/25 bg-white/10 text-white font-black hover:bg-white/15 transition"
                      >
                        −
                      </button>
                      <div className="min-w-[54px] text-center">
                        <div className="text-2xl font-extrabold text-white">{guestCount}</div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-white/70">Base</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGuestCount((g) => clamp(g + 1, 1, 8))}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-16">
        <div className="lg:col-span-2">
          <section className="mx-auto w-full">
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

          <section className="mx-auto w-full pb-16 pt-16">
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
                          <div>
                            <div className="font-extrabold leading-tight">{a.title}</div>
                            {a.id === 'hol-chan' ? (
                              <p className="text-xs text-amber-400/80 mt-0.5">$15.00 fee paid directly to ranger at time of boat entry</p>
                            ) : null}
                          </div>
                        </div>
                        <div className="text-[11px] uppercase tracking-[0.25em] text-white/90">{Math.round(a.minutes / 30) * 0.5}h+</div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="text-slate-700 leading-relaxed">{a.description}</div>

                      {a.id === 'hol-chan' ? (
                        <p className="text-xs text-amber-400/80 mt-2">$15.00 fee paid directly to ranger at time of boat entry</p>
                      ) : null}

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

          <section className="mx-auto w-full pb-16">
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
                          onClick={() => setGuestCount((g) => clamp(g - 1, 1, 8))}
                          className="h-10 w-10 rounded-full border border-slate-200 bg-white font-black hover:bg-slate-50 transition"
                        >
                          −
                        </button>
                        <div className="min-w-[64px] text-center">
                          <div className="text-2xl font-extrabold text-slate-900">{guestCount}</div>
                          <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Total</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => clamp(g + 1, 1, 8))}
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
                          className={`relative flex flex-col rounded-2xl border border-slate-200 bg-white p-4 overflow-hidden min-h-[220px] cursor-pointer select-none transition ${
                            checked ? 'ring-2 ring-emerald-400/30' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => setSelectedActivities((prev) => ({ ...prev, [a.id]: !prev[a.id] }))}
                              className="mt-1.5 h-5 w-5"
                            />
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="h-9 w-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                                  {a.icon}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-bold text-slate-900 line-clamp-2">{a.title}</div>
                                  {a.id === 'hol-chan' ? (
                                    <p className="text-xs text-amber-400/80 mt-0.5">$15.00 fee paid directly to ranger at time of boat entry</p>
                                  ) : null}
                                </div>
                              </div>
                              <div className="text-xs text-slate-600 line-clamp-3 mt-1">{a.description}</div>
                              {a.id === 'hol-chan' ? (
                                <p className="text-xs text-amber-400/80 mt-0.5">$15.00 fee paid directly to ranger at time of boat entry</p>
                              ) : null}
                              <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-slate-500">~{a.minutes} minutes</div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-3xl border border-white/15 bg-gray-950/90 backdrop-blur-md p-6">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-3">Your Day at a Glance</p>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.35em] text-white/50">Visual Timeline</div>
                        <div className="mt-2 text-lg font-extrabold text-white">Your day, in motion.</div>
                      </div>
                      <div className="text-sm text-white/70">Total: {Math.round(totalActivityMinutes / 15) * 15} min</div>
                    </div>

                    <div className="mt-5 flex h-12 w-full overflow-hidden rounded-2xl border border-white/15 bg-white/5">
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

                    {activityCount === 0 && <div className="mt-3 text-sm text-white/60">Select activities to see your timeline build.</div>}

                    <div className="flex flex-wrap gap-4 mt-3">
                      {[
                        { color: 'bg-amber-400', label: 'On the water' },
                        { color: 'bg-emerald-400', label: 'In the water' },
                        { color: 'bg-sky-400', label: 'On the beach' },
                        { color: 'bg-purple-400', label: 'Cultural stop' },
                      ].map(({ color, label }) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                          <span className="text-xs text-white/50">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full pb-16">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Add-Ons Supermarket</div>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">You&apos;re already out here. Go bigger.</h2>
              <p className="mt-4 text-lg text-slate-700">Impulse-buy energy. Zero regrets.</p>
            </div>

            <div className="mt-8 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin]">
              <div className="flex gap-4 min-w-max">
                {ADDONS.map((a) => {
                  const q = addOnQty[a.id] || 0;
                  return (
                    <div key={a.id} className="w-[320px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-extrabold text-slate-900">{a.label}</div>
                          <div className="mt-1 text-sm text-slate-600">{formatMoney(a.price)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => decrementAddon(a.id)}
                            disabled={q <= 0}
                            className="h-9 w-9 rounded-full border border-slate-200 bg-white font-black hover:bg-slate-50 transition disabled:opacity-40"
                          >
                            −
                          </button>
                          <div className="min-w-[28px] text-center font-extrabold text-slate-900">{q}</div>
                          <button
                            type="button"
                            onClick={() => incrementAddon(a)}
                            className="h-9 w-9 rounded-full border border-slate-200 bg-white font-black hover:bg-slate-50 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 text-slate-700 leading-relaxed">{a.note}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl space-y-4">
            <div className="rounded-2xl border border-white/20 bg-gray-950/95 backdrop-blur-md p-5">
              <div className="flex justify-between text-sm font-bold text-white">
                <span>
                  {tour?.title || 'Custom Charter'} – {isFullDay ? 'Full Day' : 'Half Day'} (1)
                </span>
                <span>{formatMoney(basePrice)}</span>
              </div>

              {guestCount > 4 && (
                <div className="flex justify-between text-sm text-white/90 mt-1">
                  <span>Additional Passengers ({guestCount - 4} @ $75.00)</span>
                  <span>{formatMoney(extraGuests)}</span>
                </div>
              )}

              <hr className="border-white/10 my-3" />

              {ADDONS.filter((a) => addOnQty[a.id] > 0).map((a) => (
                <div key={a.id} className="flex justify-between text-sm text-white/90 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-400">✓</span>
                    {a.label} {a.perGuest ? `(${addOnQty[a.id]} @ ${formatMoney(a.price)})` : ''}
                  </span>
                  <span>{formatMoney(a.price * addOnQty[a.id])}</span>
                </div>
              ))}

              {selectedActivityList.filter((a) => a.price === 0).map((a) => (
                <div key={a.id} className="flex justify-between text-sm text-white/80 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-400">✓</span> {a.label}
                  </span>
                  <span>$0.00</span>
                </div>
              ))}

              <hr className="border-white/10 my-3" />

              <div className="flex justify-between text-sm text-white/90 mt-1">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/90 mt-1">
                <span>Tax (12.5%)</span>
                <span>{formatMoney(tax)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/90 mt-1">
                <span>Service Fee (6%)</span>
                <span>{formatMoney(serviceFee)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="mt-4 w-full rounded-xl bg-amber-400 hover:bg-amber-300 \
               disabled:opacity-60 text-black font-bold py-3 flex \
               items-center justify-center gap-2 transition-all"
              >
                {checkoutLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                ) : (
                  <>🔒 Secure Checkout</>
                )}
              </button>

              <div className="mt-3 space-y-1">
                {['Bank-level encryption', 'All major cards accepted', 'Instant confirmation'].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-xs text-white/80">
                    <span className="text-emerald-400">✓</span> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">What to Bring</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Show up ready. Leave with stories.</h2>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: 'Sunscreen', icon: <Sun className="w-5 h-5 text-yellow-400" /> },
            { label: 'Towel', icon: <Waves className="w-5 h-5 text-sky-400" /> },
            { label: 'Camera', icon: <Camera className="w-5 h-5 text-purple-400" /> },
            { label: 'Comfortable shoes', icon: <Footprints className="w-5 h-5 text-emerald-400" /> },
            { label: 'Sunglasses', icon: <Glasses className="w-5 h-5 text-amber-400" /> },
            { label: 'Water / Hydration', icon: <Droplets className="w-5 h-5 text-cyan-400" /> },
            { label: 'Light jacket', icon: <Wind className="w-5 h-5 text-blue-400" /> },
            { label: 'Cash (for fees)', icon: <Banknote className="w-5 h-5 text-green-400" /> },
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
                This is a lifetime born on these waters.
              </p>
              <p className="mt-4 text-lg text-slate-800 leading-relaxed">
                Rene grew up navigating every reef, current, and hidden cay in Belize. This isn&apos;t a job — it&apos;s his home, and he&apos;s inviting you into it.
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
              WhatsApp +501 627 3556
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
                {r.quote.toLowerCase().includes('hol chan') ? (
                  <p className="text-xs text-amber-400/80 mt-0.5">$15.00 fee paid directly to ranger at time of boat entry</p>
                ) : null}
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

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {youMightAlsoLike.map((t) => (
            <Link
              key={t.slug}
              href={`/tours/${t.slug}`}
              className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative">
                <img
                  src={t.imageSrc}
                  alt=""
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const tt = e.target as HTMLImageElement;
                    if (!tt.dataset.fallback) {
                      tt.dataset.fallback = '1';
                      tt.src = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-o5hV6mh8JgSKnVgyD8PdcxgUYxUOd8.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute left-5 right-5 bottom-4">
                  <div className="text-white font-extrabold leading-tight">{t.title}</div>
                  <div className="mt-1 text-sm text-white/85">From {formatMoney(t.price)}</div>
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
        className={`fixed bottom-0 left-0 right-0 z-[60] bg-gray-950/95 backdrop-blur-md border-t border-white/20 px-6 py-4 flex items-center justify-between transition-transform duration-300 ${
          stickyVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div>
          <div className="text-white font-bold text-sm">Custom Charter · {guestCount} Guests · {isFullDay ? 'Full Day' : 'Half Day'}</div>
          <div className="text-white/60 text-xs">{activityCount} activities selected</div>
        </div>

        {(() => {
          const activitySummary = selectedActivityList.map((a) => a.label).join(', ');
          const truncated = activitySummary.length > 45 ? activitySummary.slice(0, 45) + '…' : activitySummary;
          return <div className="hidden md:block text-white/60 text-xs text-center max-w-sm">{truncated || 'No activities selected yet'}</div>;
        })()}

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-white/60 text-[10px] uppercase tracking-widest">Live Total</div>
            <div className="text-amber-300 font-extrabold text-lg">{formatMoney(liveTotal)}</div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-5 py-2.5 rounded-full text-sm transition-all"
          >
            Book Your Perfect Day
          </button>
        </div>
      </div>
    </main>
  );
}
