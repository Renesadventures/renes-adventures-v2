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
  Map,
  MessageCircle,
  PartyPopper,
  Shell,
  ShieldCheck,
  Sun,
  Wind,
  X,
  Zap,
  Waves,
} from 'lucide-react';

import { buildWhatsAppTourLink, getWhatsAppLink } from '@/lib/utils/whatsapp-link';
import { getTourBySlug, tours } from '@/data/tours';

const base = 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev';

type ActivityKey =
  | 'deep-sea-trolling'
  | 'reef-fishing'
  | 'spearfishing'
  | 'hol-chan'
  | 'conch-hunt'
  | 'lobster-mission'
  | 'caye-caulker'
  | 'beach-bbq'
  | 'snorkeling';

type Activity = {
  id: ActivityKey;
  title: string;
  shortLabel: string;
  icon: ReactNode;
  image: string;
  video: string;
  minutes: number;
  description: string;
  included: string[];
  bestConditions: string;
  renesTip: string;
  gallery: string[];
};

// Beach BBQ removed — included in Full Day $675
type AddOnId =
  | 'bbq-extra-guest'
  | 'snorkel-gear'
  | 'tshirt-adult'
  | 'tshirt-xxl'
  | 'tshirt-youth'
  | 'hat-standard'
  | 'hat-leather';

interface AddOn {
  id: AddOnId;
  label: string;
  note: string;
  noteHighlight?: string;
  price: number;
  image?: string;
}

type RelatedCard = { slug: string; title: string; price: number; imageSrc: string };

const ADDONS: AddOn[] = [
  {
    id: 'bbq-extra-guest',
    label: 'Beach BBQ – Extra Guest',
    note: 'Per guest beyond 4. The whole group gets fed — no splitting it.',
    price: 25,
    image: `${base}/images/beach-bbq-extra-guest.png`,
  },
  {
    id: 'snorkel-gear',
    label: 'Snorkel Gear Rental',
    note: 'Per person — or bring your own mask & fins.',
    price: 15,
    image: `${base}/images/snorkel-gear-rental.png`,
  },

  { id: 'tshirt-adult', label: 'T-Shirt – Adult (S/M/L/XL)', note: 'Standard sizes.', price: 25 },
  { id: 'tshirt-xxl', label: 'T-Shirt – XXL / XXXL', note: 'Extended sizes.', price: 30 },
  { id: 'tshirt-youth', label: 'T-Shirt – Youth (S/M/L)', note: 'Kids sizes.', price: 20 },
  { id: 'hat-standard', label: 'Snapback Hat – Standard', note: 'Classic snapback.', price: 30 },
  { id: 'hat-leather', label: 'Snapback Hat – Leather Patch', note: 'Premium leather patch design.', price: 35 },
];

function formatMoney(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function estimatePace(totalMinutes: number, count: number) {
  if (count === 0) return 'Select something. Then select something else.';
  if (totalMinutes <= 240) return `${count} activities selected — perfect half-day pace`;
  if (totalMinutes <= 420) return `${count} activities selected — full-day momentum`;
  return `${count} activities selected — legendary day. Non-stop.`;
}

function getTimelineColor(idx: number) {
  const colors = ['bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500', 'bg-teal-500'];
  return colors[idx % colors.length];
}

// Dynamic default qty when an add-on is first checked
function getAddonDefault(id: AddOnId, guestCount: number, includedGuests: number): number {
  if (id === 'bbq-extra-guest') return Math.max(1, guestCount - includedGuests);
  if (id === 'snorkel-gear') return guestCount;
  return 1; // t-shirts, hats
}

export default function CustomCharterPage() {
  const tour = getTourBySlug('custom-charter');

  const activities = useMemo<Activity[]>(() => [
    {
      id: 'deep-sea-trolling',
      title: 'Deep Sea Fishing',
      shortLabel: 'Deep Sea',
      icon: <Fish className="h-5 w-5 text-sky-600" />,
      image: `${base}/images/boat-deep-sea-fishing.jpg`,
      video: `${base}/deep-sea-fishing-two.mp4`,
      minutes: 90,
      description: 'The reel screams. Your arms burn. The water explodes 50 yards out. Mahi-mahi. Wahoo. Barracuda. Big game fishing — Belize style.',
      included: ['Heavy tackle rods & reels', 'Live bait', 'Ice cooler', 'Captain René expertise', 'Fish cleaning on board'],
      bestConditions: 'Calm to moderate seas. Best May–October for mahi-mahi. Wahoo peaks November–March.',
      renesTip: 'We head 12 miles offshore before sunrise. The fish are there before the tourists wake up. Bring dramamine if you feel the swell.',
      gallery: [`${base}/deep-sea-fishing.mp4`, `${base}/deep-sea-fishing-two.mp4`, `${base}/speargun-one.mp4`],
    },
    {
      id: 'reef-fishing',
      title: 'Reef Fishing',
      shortLabel: 'Reef Fishing',
      icon: <Waves className="h-5 w-5 text-emerald-600" />,
      image: `${base}/images/reef-fishing-custome-adventure.jpg`,
      video: `${base}/coral-reef.mp4`,
      minutes: 75,
      description: 'Snappers. Groupers. Jacks. The reef is alive. Light tackle. Fast action. Dinner is in the cooler before lunch.',
      included: ['Light tackle rods', 'Bait & lures', 'Ice cooler', 'Local reef knowledge', 'Fish cleaning'],
      bestConditions: 'Works in almost any weather. Best on incoming tide. Perfect for beginners and families.',
      renesTip: 'I know every reef structure from here to Mexico. We do not fish the tourist spots. We fish where the fish actually are.',
      gallery: [`${base}/coral-reef.mp4`, `${base}/nurse-sharks-and-stingrays.mp4`, `${base}/star-fish.mp4`],
    },
    {
      id: 'spearfishing',
      title: 'Speargun Fishing',
      shortLabel: 'Speargun',
      icon: <Zap className="h-5 w-5 text-orange-500" />,
      image: `${base}/images/speargun-fishing-custom-adventure.jpg`,
      video: `${base}/speargun-one.mp4`,
      minutes: 90,
      description: 'Freedive. Stalk. Strike. The oldest form of fishing in Belize. You hunt your dinner on the reef.',
      included: ['Spearguns & bands', 'Mask, fins & wetsuit', 'Safety buoy', 'Captain-guided dive spots', 'Fish cleaning'],
      bestConditions: 'Best visibility April–June. Calm seas required. 10+ ft visibility ideal.',
      renesTip: 'I grew up doing this. The secret is patience — you wait until the fish forgets you are there. Then you move.',
      gallery: [`${base}/speargun-one.mp4`, `${base}/deep-sea-fishing.mp4`, `${base}/boy-woman-snorkeling.mp4`],
    },
    {
      id: 'hol-chan',
      title: 'Hol Chan Marine Reserve',
      shortLabel: 'Hol Chan',
      icon: <Shell className="h-5 w-5 text-blue-500" />,
      image: `${base}/images/hol-chan-custom-adventure.jpg`,
      video: `${base}/hol-chan-marine.mp4`,
      minutes: 90,
      description: 'Nurse sharks. Sting rays. Sea turtles. 400 species of fish. Hol Chan is the most biodiverse marine reserve in the Caribbean.',
      included: ['Snorkel gear', 'Life vests', 'Marine guide', 'Hol Chan entry fee ($15 — paid on site)', 'Shark Ray Alley stop'],
      bestConditions: 'Year-round. Morning visits have best visibility and fewer crowds. Water temp 78–84°F.',
      renesTip: 'People are scared of the sharks until they are in the water. Then they never want to leave. The nurse sharks are as curious about you as you are about them.',
      gallery: [`${base}/hol-chan-marine.mp4`, `${base}/nurse-sharks-and-stingrays.mp4`, `${base}/boy-woman-snorkeling.mp4`],
    },
    {
      id: 'conch-hunt',
      title: 'Conch Hunt',
      shortLabel: 'Conch Hunt',
      icon: <Shell className="h-5 w-5 text-pink-500" />,
      image: `${base}/images/conch-hunt-custom-adventure.jpg`,
      video: `${base}/conch-custom-adventure-landing-page.mp4`,
      minutes: 60,
      description: 'Wade into knee-deep water. Find them by the dozens. Crack them open on the boat. Eat them with lime and hot sauce. This is Belize.',
      included: ['Wading gear', 'Conch cracking demo', 'Fresh ceviche prep on board', 'Cooler with ice', 'Lime and hot sauce'],
      bestConditions: 'Seasonal — mid-June to mid-February. Shallow flats on calm days. Best in the morning.',
      renesTip: 'You think you have seen conch in a restaurant. You have not had conch until you crack it yourself twenty minutes after it came off the sand.',
      gallery: [`${base}/conch-custom-adventure-landing-page.mp4`, `${base}/secrete-beach.mp4`, `${base}/star-fish.mp4`],
    },
    {
      id: 'lobster-mission',
      title: 'Lobster Mission',
      shortLabel: 'Lobster',
      icon: <Fish className="h-5 w-5 text-red-500" />,
      image: `${base}/images/lobster-mission-custom-adventure.JPG`,
      video: `${base}/lobster-mission.mp4`,
      minutes: 90,
      description: "Freedive the reef. Find the lobster in the crevices. Bring them up. Grill them on the beach with butter and lime. This is René's church.",
      included: ['Snorkel gear', 'Tickle sticks & nets', 'Beach BBQ setup', 'Butter, lime, seasoning', 'Chef René on the grill'],
      bestConditions: 'Seasonal — mid-June to mid-February. Best early season for size and abundance.',
      renesTip: 'Lobster season opening day is my favorite day of the year. The whole island goes in the water at dawn. It is like a holiday nobody outside Belize knows about.',
      gallery: [`${base}/lobster-mission.mp4`, `${base}/lobster.mp4`, `${base}/grilling-hot-dogs-beach-bbq.mp4`],
    },
    {
      id: 'caye-caulker',
      title: 'Caye Caulker Day',
      shortLabel: 'Caye Caulker',
      icon: <Anchor className="h-5 w-5 text-teal-500" />,
      image: `${base}/images/caye-caulker-custom-adventure.jpg`,
      video: `${base}/caye-caulker.mp4`,
      minutes: 120,
      description: 'Go Slow. The sign at the dock says it. The whole island lives it. No cars. No rush. Just turquoise water, cold Belikins, and the Split.',
      included: ['Round trip boat transport', 'Village walking tour', 'Time at The Split', 'Snorkel stop en route', 'Local lunch recommendation'],
      bestConditions: 'Year-round. Mornings for smooth water crossing. Weekdays for fewer crowds.',
      renesTip: 'Caye Caulker is what Ambergris Caye used to be. I take people there so they understand what the whole island was like before the tourists. Worth every minute of the ride.',
      gallery: [`${base}/caye-caulker.mp4`, `${base}/san-pedro-at-dawn.mp4`, `${base}/secrete-beach-two.mp4`],
    },
    {
      id: 'beach-bbq',
      title: 'Beach BBQ',
      shortLabel: 'Beach BBQ',
      icon: <Flame className="h-5 w-5 text-orange-400" />,
      image: `${base}/images/beach-bbq-custom-adventure.jpg`,
      video: `${base}/beach-bbq.mp4`,
      minutes: 90,
      description: 'Fresh catch. Open fire. White sand. The ocean at your feet. No restaurant in the world serves this view.',
      included: ['Fresh catch of the day', 'Lobster & conch when in season', 'Ceviche', 'Potatoes, vegetables, rice', 'Plates, cutlery, drinks cooler'],
      bestConditions: 'Full day charters only. Not available on half-day. Weather must permit beach landing.',
      renesTip: 'We cook what we catch that morning. If we do not catch enough, I bring backup. Nobody goes hungry on my boat.',
      gallery: [`${base}/beach-bbq.mp4`, `${base}/grilling-hot-dogs-beach-bbq.mp4`, `${base}/secrete-beach-three.mp4`],
    },
    {
      id: 'snorkeling',
      title: 'Snorkeling',
      shortLabel: 'Snorkeling',
      icon: <Waves className="h-5 w-5 text-cyan-500" />,
      image: `${base}/images/snorkeling-custom-adventure.jpg`,
      video: `${base}/boy-woman-snorkeling.mp4`,
      minutes: 75,
      description: 'No certification needed. No experience needed. Just a mask and fins and a reef that has been growing for 10,000 years.',
      included: ['Mask, fins & snorkel', 'Life vest option', 'Reef orientation briefing', 'Multiple reef stops', 'Marine life ID guide'],
      bestConditions: 'Year-round. April–June for peak visibility. Mornings always clearest.',
      renesTip: 'I have taken 70-year-olds who have never snorkeled before. Within ten minutes they are pointing at things like children. The reef does that to people.',
      gallery: [`${base}/boy-woman-snorkeling.mp4`, `${base}/nurse-sharks-and-stingrays.mp4`, `${base}/coral-reef.mp4`],
    },
  ], []);

  const heroClips = useMemo(() => activities.map((a) => ({ id: a.id, label: a.title, thumb: a.image, src: a.video })), [activities]);

  const [selectedVideo, setSelectedVideo] = useState(`${base}/custom-adventure.mp4`);
  const [selectedVideoLabel, setSelectedVideoLabel] = useState('Custom Charter');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const [selectedActivities, setSelectedActivities] = useState<Record<ActivityKey, boolean>>({
    'deep-sea-trolling': false, 'reef-fishing': false, spearfishing: false,
    'hol-chan': false, 'conch-hunt': false, 'lobster-mission': false,
    'caye-caulker': false, 'beach-bbq': false, snorkeling: false,
  });

  const includedGuests = tour?.includedGuests ?? 4;
  const baseHalfDay = tour?.price ?? 400;
  const baseFullDay = tour?.priceFullDay ?? 675;

  const [duration, setDuration] = useState<'half' | 'full'>('half');
  const [guestCount, setGuestCount] = useState(4);

  const [addOnQty, setAddOnQty] = useState<Record<AddOnId, number>>({
    'bbq-extra-guest': 0, 'snorkel-gear': 0,
    'tshirt-adult': 0, 'tshirt-xxl': 0, 'tshirt-youth': 0,
    'hat-standard': 0, 'hat-leather': 0,
  });

  function toggleAddon(id: AddOnId, checked: boolean) {
    setAddOnQty((prev) => ({ ...prev, [id]: checked ? getAddonDefault(id, guestCount, includedGuests) : 0 }));
    // Sync linked activity
    if (id === 'snorkel-gear') setSelectedActivities((prev) => ({ ...prev, snorkeling: checked }));
    if (id === 'bbq-extra-guest' && checked) setSelectedActivities((prev) => ({ ...prev, 'beach-bbq': true }));
  }

  function toggleActivity(id: ActivityKey, checked: boolean) {
    setSelectedActivities((prev) => ({ ...prev, [id]: checked }));
    if (id === 'snorkeling') {
      setAddOnQty((prev) => ({ ...prev, 'snorkel-gear': checked ? guestCount : 0 }));
    }
    if (id === 'beach-bbq') {
      if (checked && guestCount > includedGuests) {
        setAddOnQty((prev) => ({ ...prev, 'bbq-extra-guest': Math.max(1, guestCount - includedGuests) }));
      } else if (!checked) {
        setAddOnQty((prev) => ({ ...prev, 'bbq-extra-guest': 0 }));
      }
    }
  }
  function incrementAddon(id: AddOnId) { setAddOnQty((prev) => ({ ...prev, [id]: prev[id] + 1 })); }
  function decrementAddon(id: AddOnId) { setAddOnQty((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) })); }

  const activityCount = useMemo(() => (Object.keys(selectedActivities) as ActivityKey[]).reduce((s, k) => s + (selectedActivities[k] ? 1 : 0), 0), [selectedActivities]);
  const totalActivityMinutes = useMemo(() => activities.reduce((s, a) => s + (selectedActivities[a.id] ? a.minutes : 0), 0), [activities, selectedActivities]);
  const paceLabel = useMemo(() => estimatePace(totalActivityMinutes, activityCount), [activityCount, totalActivityMinutes]);

  const isFullDay = duration === 'full';
  const basePrice = useMemo(() => (isFullDay ? 675 : 400), [isFullDay]);
  const extraGuests = useMemo(() => Math.max(0, guestCount - includedGuests) * 75, [guestCount, includedGuests]);
  const addOnsTotal = useMemo(() => ADDONS.reduce((s, a) => s + a.price * addOnQty[a.id], 0), [addOnQty]);
  const subtotal = useMemo(() => basePrice + extraGuests + addOnsTotal, [addOnsTotal, basePrice, extraGuests]);
  const tax = useMemo(() => subtotal * 0.125, [subtotal]);
  const serviceFee = useMemo(() => subtotal * 0.06, [subtotal]);
  const liveTotal = useMemo(() => subtotal + tax + serviceFee, [serviceFee, subtotal, tax]);

  const selectedActivityList = useMemo(() => activities.filter((a) => selectedActivities[a.id]), [activities, selectedActivities]);

  const [stickyVisible, setStickyVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => { setStickyVisible(window.scrollY > 520); setNavVisible(window.scrollY > 80); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const youMightAlsoLike = useMemo<RelatedCard[]>(() => [
    { slug: 'deep-sea-fishing', title: 'Deep Sea Fishing', price: tours.find((t) => t.slug === 'deep-sea-fishing')?.price ?? 600, imageSrc: `${base}/images/boat-deep-sea-fishing.jpg` },
    { slug: 'blue-hole', title: 'Blue Hole Adventure', price: 0, imageSrc: `${base}/images/blue-hole-all-tours.jpg` },
    { slug: 'secret-beach', title: 'Secret Beach', price: tours.find((t) => t.slug === 'secret-beach')?.price ?? 400, imageSrc: `${base}/images/secrete-beach-all%20tours.png` },
  ], []);

  const onOpenLia = (message: string) => window.dispatchEvent(new CustomEvent('lia:open', { detail: { message } }));
  const onOpenWhatsApp = () => window.open(buildWhatsAppTourLink({ tourName: 'Custom Charter' }), '_blank', 'noopener,noreferrer');
  const onOpenWhatsAppLargeGroup = () => window.open(getWhatsAppLink('Hi René,\n\nWe are 9+ guests. Can you help us book a private fleet for a Custom Charter?\n\nThank you!'), '_blank', 'noopener,noreferrer');

  function buildLineItems() {
    const items: { price_data: { currency: string; product_data: { name: string }; unit_amount: number }; quantity: number }[] = [];
    items.push({ price_data: { currency: 'usd', product_data: { name: `Rene's Custom Adventure – ${isFullDay ? 'Full Day (BBQ Included)' : 'Half Day'}` }, unit_amount: (isFullDay ? 675 : 400) * 100 }, quantity: 1 });
    const extra = Math.max(0, guestCount - includedGuests);
    if (extra > 0) items.push({ price_data: { currency: 'usd', product_data: { name: 'Additional Guest' }, unit_amount: 75 * 100 }, quantity: extra });
    ADDONS.forEach((addon) => { const qty = addOnQty[addon.id]; if (qty > 0) items.push({ price_data: { currency: 'usd', product_data: { name: addon.label }, unit_amount: addon.price * 100 }, quantity: qty }); });
    return items;
  }

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lineItems: buildLineItems(), guestCount, duration: isFullDay ? 'Full Day' : 'Half Day', tourName: "Rene's Custom Adventure" }) });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; } else { alert('Checkout failed: ' + (data.error ?? 'Unknown error')); }
    } catch { alert('Network error — please try again.'); } finally { setCheckoutLoading(false); }
  }

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>

      {/* ── STICKY NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-[80] transition-transform duration-300 ${navVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-gray-950/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
          <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between gap-4">
            <div className="text-white font-extrabold text-sm tracking-wide shrink-0">René&apos;s Custom Adventure</div>
            <div className="hidden md:flex items-center gap-5">
              {[{ label: 'Overview', href: 'overview' }, { label: 'Build Your Day', href: 'build-your-day' }, { label: 'Add-Ons', href: 'add-ons' }, { label: 'Guarantee', href: 'guarantee' }, { label: 'All Tours', href: 'all-tours' }].map((link) => (
                <button key={link.label} type="button" onClick={() => scrollTo(link.href)} className="text-white/65 hover:text-amber-300 text-sm font-medium transition-colors">{link.label}</button>
              ))}
            </div>
            <button type="button" onClick={handleCheckout} disabled={checkoutLoading} className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-5 py-2 rounded-full transition shrink-0 disabled:opacity-60">Book Now</button>
          </div>
        </div>
      </nav>

      <main className="min-h-screen bg-gradient-to-b from-[#F0FDFF] via-white to-[#FFF7ED] text-slate-900 pb-24">

        {/* ── HERO ── */}
        <section id="overview" className="relative">
          <div className="absolute inset-0">
            <video key={selectedVideo} src={selectedVideo} className="h-full w-full object-cover" playsInline autoPlay muted loop preload="metadata" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-white" />
          </div>
          <div className="relative mx-auto w-full max-w-screen-2xl px-4 pt-20 sm:pt-28 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-white backdrop-blur-md">
                  <PartyPopper className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-[0.3em]">Custom Charter</span>
                </div>
                <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white">Your Day. Your Boat. Your Adventure.</h1>
                <p className="mt-4 text-lg md:text-2xl text-white/90 max-w-2xl">One boat. Ten adventures. Pure Belize.</p>

                <div className="mt-6 rounded-2xl border border-white/20 bg-white/[0.04] backdrop-blur-sm overflow-hidden">
                  <div className="p-4 md:p-5">
                    <div className="text-[11px] uppercase tracking-[0.35em] text-white/80">Now Playing</div>
                    <div className="mt-2 text-2xl md:text-3xl font-extrabold text-white leading-tight">{selectedVideoLabel}</div>
                    <div className="mt-2 text-sm text-white/80">Tap a channel. The story changes.</div>
                  </div>
                  <div className="px-4 pb-4 md:px-5 md:pb-5">
                    <div className="flex sm:grid sm:grid-cols-5 gap-3 overflow-x-auto pb-1 snap-x snap-mandatory sm:overflow-visible sm:pb-0">
                      {heroClips.map((clip) => {
                        const active = clip.src === selectedVideo;
                        return (
                          <button key={clip.id} type="button" onClick={() => { setSelectedVideo(clip.src); setSelectedVideoLabel(clip.label); setSelectedActivity(activities.find((a) => a.id === clip.id) ?? null); }}
                            className={`group relative overflow-hidden rounded-2xl border transition text-left h-20 sm:h-24 shrink-0 w-32 sm:w-auto snap-start ${active ? 'border-amber-300/80 ring-2 ring-amber-300/40' : 'border-white/20 hover:border-white/40'}`}>
                            <Image src={clip.thumb} alt="" fill className="object-cover" sizes="(min-width: 640px) 20vw, 50vw" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                            <div className="absolute left-2 right-2 bottom-2">
                              <div className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-white line-clamp-2">{clip.label}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/20 bg-white/[0.04] backdrop-blur-sm p-4 sm:p-5 md:p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="text-xs uppercase tracking-[0.35em] text-white/80">Starting at</div>
                      <div className="mt-2 text-4xl font-extrabold text-amber-300">{formatMoney(baseHalfDay)}</div>
                      <div className="mt-1 text-sm text-white/85">Full day: {formatMoney(baseFullDay)} <span className="text-amber-400/90 font-semibold">— BBQ included</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-[0.35em] text-white/80">Capacity</div>
                      <div className="mt-2 text-sm font-semibold text-white">Designed for up to 8 guests</div>
                      <div className="mt-1 text-sm text-white/85">Traveling with more? We&apos;ll arrange it.</div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {(['half', 'full'] as const).map((d) => (
                      <button key={d} type="button" onClick={() => setDuration(d)} className={`h-12 rounded-2xl border text-xs font-extrabold uppercase tracking-[0.25em] transition ${duration === d ? 'border-white/30 bg-white text-slate-950' : 'border-white/30 bg-white/10 text-white hover:bg-white/15'}`}>
                        {d === 'half' ? 'Half Day' : 'Full Day'}
                      </button>
                    ))}
                  </div>
                  {isFullDay && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-400/15 border border-amber-400/30 px-4 py-2.5">
                      <Flame className="h-4 w-4 text-amber-300 shrink-0" />
                      <p className="text-amber-300 text-xs font-semibold">Beach BBQ included — fresh catch, ceviche, the works.</p>
                    </div>
                  )}
                  <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.35em] text-white/80">Guests</div>
                        <div className="mt-1 text-sm text-white/85">Includes {includedGuests}. Extra: $75.</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setGuestCount((g) => clamp(g - 1, 1, 8))} className="h-10 w-10 rounded-full border border-white/25 bg-white/10 text-white font-black hover:bg-white/15 transition">−</button>
                        <div className="min-w-[54px] text-center">
                          <div className="text-2xl font-extrabold text-white">{guestCount}</div>
                          <div className="text-[10px] uppercase tracking-[0.25em] text-white/70">Base</div>
                        </div>
                        <button type="button" onClick={() => setGuestCount((g) => clamp(g + 1, 1, 8))} className="h-10 w-10 rounded-full border border-white/25 bg-white/10 text-white font-black hover:bg-white/15 transition">+</button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-white/10 px-4 py-3">
                      <div className="text-sm font-semibold text-white">Live total</div>
                      <div className="text-lg font-extrabold text-amber-300">{formatMoney(liveTotal)}</div>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3">
                    <button type="button" onClick={() => scrollTo('build-your-day')} className="h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg border border-black/15 hover:brightness-105 transition">Book Your Perfect Day</button>
                    <button type="button" onClick={() => onOpenLia('Build me a perfect Custom Charter day in Belize.')} className="h-14 rounded-2xl border border-white/30 bg-white/10 text-white font-extrabold text-sm uppercase tracking-[0.25em] hover:bg-white/15 transition">Talk to Lia</button>
                    <button type="button" onClick={onOpenWhatsAppLargeGroup} className="h-14 rounded-2xl border border-white/30 bg-white/5 text-white font-extrabold text-sm uppercase tracking-[0.25em] hover:bg-white/10 transition">9+ Guests? Private Fleet</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ACTIVITY DETAIL PANEL ── */}
        {selectedActivity && (
          <section className="w-full bg-gradient-to-b from-slate-950 to-slate-900 border-t border-white/5">
            <div className="mx-auto max-w-6xl px-6 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <div className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">NOW SELECTED</div>
                  <h2 className="text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>{selectedActivity.title}</h2>
                  <p className="text-white/70 text-lg leading-relaxed mb-8">{selectedActivity.description}</p>
                  <div className="mb-8">
                    <h3 className="text-white text-sm font-bold tracking-widest uppercase mb-4">What&apos;s Included</h3>
                    <ul className="space-y-2">
                      {selectedActivity.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/70 text-sm"><span className="text-amber-400 mt-0.5">✓</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-2">Best Conditions</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{selectedActivity.bestConditions}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-8 p-6 rounded-2xl bg-amber-400/10 border border-amber-400/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold">R</div>
                      <div>
                        <p className="text-white text-sm font-bold">Captain René</p>
                        <p className="text-white/40 text-xs">San Pedro, Belize · 25 years on these waters</p>
                      </div>
                    </div>
                    <blockquote className="text-white/80 text-sm leading-relaxed italic border-l-2 border-amber-400/50 pl-4">&quot;{selectedActivity.renesTip}&quot;</blockquote>
                  </div>
                  <div>
                    <h3 className="text-white text-xs font-bold tracking-widest uppercase mb-4">From This Charter</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedActivity.gallery.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                          <video src={src} autoPlay muted loop playsInline suppressHydrationWarning className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── MAIN CONTENT + SIDEBAR ── */}
        {/* ── MOBILE BOOKING SUMMARY BAR ── */}
        <div className="lg:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between gap-4 sticky top-14 z-50 shadow-sm">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Live Total</div>
            <div className="text-xl font-extrabold text-amber-500">{formatMoney(liveTotal)}</div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold">{guestCount} guest{guestCount !== 1 ? 's' : ''}</span>
            <span className="text-slate-300">·</span>
            <span>{isFullDay ? 'Full Day' : 'Half Day'}</span>
            {activityCount > 0 && <><span className="text-slate-300">·</span><span className="text-emerald-600 font-semibold">{activityCount} activities</span></>}
          </div>
          <button type="button" onClick={handleCheckout} disabled={checkoutLoading}
            className="bg-amber-400 text-black font-bold text-xs px-4 py-2 rounded-full hover:bg-amber-300 transition disabled:opacity-60 shrink-0">
            Book Now
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-16">
          <div className="lg:col-span-2">

            {/* ── BUILD YOUR DAY ── */}
            <section id="build-your-day" className="w-full pb-16">
              <div className="max-w-3xl">
                <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Build Your Day</div>
                <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Pick the moments you&apos;ll talk about forever.</h2>
                <p className="mt-4 text-lg text-slate-700">You call the shots. Captain René handles the rest.</p>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: 'Maximum Overdrive', icon: <Flame className="h-5 w-5" />, body: 'Non-stop action. 5+ activities. Adrenaline on demand.' },
                  { title: 'The Explorer', icon: <Map className="h-5 w-5" />, body: 'Balanced pace. See everything. Savor the moments that matter.' },
                  { title: 'Island Time', icon: <Sun className="h-5 w-5" />, body: 'Slow down. Dive deep. One or two experiences, done right.' },
                ].map((c) => (
                  <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">{c.icon}</div>
                      <div className="font-extrabold text-sm">{c.title}</div>
                    </div>
                    <div className="mt-3 text-slate-600 text-sm leading-relaxed">{c.body}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {activities.map((a) => {
                  const checked = selectedActivities[a.id];
                  return (
                    <article key={a.id} className={`group rounded-3xl border overflow-hidden shadow-sm transition ${a.id === 'beach-bbq' && !isFullDay ? 'border-slate-200 bg-white opacity-50 pointer-events-none' : checked ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-slate-200 bg-white'}`}>
                      <div className="relative h-44">
                        <Image src={a.image} alt={a.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 33vw, 50vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute left-4 right-4 bottom-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-white">
                            <div className="h-8 w-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">{a.icon}</div>
                            <div className="font-extrabold text-sm leading-tight">{a.title}</div>
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-white/80">~{Math.round(a.minutes / 30) * 0.5}h</div>
                        </div>
                        {checked && <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm shadow">✓</div>}
                      </div>
                      <div className="bg-white p-5">
                        {a.id === 'hol-chan' && (
                          <div className="mb-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                            <p className="text-xs font-bold text-amber-700">⚠️ $15/person park fee — not collected online</p>
                            <p className="text-[10px] text-amber-600 mt-0.5">Bring cash. The park ranger collects this fee at boat entry and provides wristbands.</p>
                          </div>
                        )}
                        {a.id === 'beach-bbq' && isFullDay && <p className="text-xs text-emerald-600 font-semibold mb-2">✓ Included in your Full Day — no extra charge</p>}
                        {a.id === 'beach-bbq' && !isFullDay && (
                          <div className="mb-2 rounded-lg bg-slate-100 border border-slate-200 px-3 py-2">
                            <p className="text-xs font-bold text-slate-500">⏱ Not available on Half Day</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">BBQ requires a full day charter. Upgrade to include it.</p>
                          </div>
                        )}
                        {a.id === 'beach-bbq' && !isFullDay && guestCount > includedGuests && selectedActivities['beach-bbq'] && addOnQty['bbq-extra-guest'] > 0 && (
                          <div className="mb-2 rounded-lg bg-orange-50 border border-orange-200 px-3 py-2">
                            <p className="text-xs font-bold text-orange-700">BBQ extra guests auto-added</p>
                            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ {addOnQty['bbq-extra-guest']} extra × $25 added to checkout</p>
                          </div>
                        )}
                        {a.id === 'snorkeling' && (
                          <div className="mb-2 rounded-lg bg-sky-50 border border-sky-200 px-3 py-2">
                            <p className="text-xs font-bold text-sky-700">Snorkel gear: $15/person</p>
                            {selectedActivities.snorkeling && addOnQty['snorkel-gear'] > 0 && (
                              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ {addOnQty['snorkel-gear']} × $15 added to checkout</p>
                            )}
                          </div>
                        )}
                        <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">{a.description}</p>
                        <div className="mt-4 flex gap-2">
                          <button type="button" onClick={() => toggleActivity(a.id, !selectedActivities[a.id])}
                            className={`h-11 flex-1 rounded-2xl px-4 font-extrabold uppercase tracking-[0.15em] text-xs transition border ${checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                            {checked ? '✓ Added' : '+ Add This'}
                          </button>
                          <button type="button" onClick={() => { setSelectedVideo(a.video); setSelectedVideoLabel(a.title); setSelectedActivity(a); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="h-11 rounded-2xl px-4 font-extrabold uppercase tracking-[0.15em] text-xs border border-slate-200 bg-white hover:bg-slate-50 transition">
                            Preview
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Timeline */}
              <div className="mt-10 rounded-3xl border border-white/15 bg-gray-950/90 backdrop-blur-md p-6">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40">Live Pace</p>
                    <p className="mt-1 text-lg font-extrabold text-white">{paceLabel}</p>
                  </div>
                  <div className="text-sm text-white/60">{Math.round(totalActivityMinutes / 15) * 15} min total</div>
                </div>
                <div className="mt-5 flex h-10 w-full overflow-hidden rounded-2xl border border-white/15 bg-white/5">
                  {activities.filter((a) => selectedActivities[a.id]).map((a, idx) => {
                    const w = totalActivityMinutes > 0 ? (a.minutes / totalActivityMinutes) * 100 : 0;
                    return <div key={a.id} className={`${getTimelineColor(idx)} h-full`} style={{ width: `${w}%` }} title={a.title} />;
                  })}
                </div>
                {activityCount === 0 && <div className="mt-3 text-sm text-white/50">Select activities above to watch your timeline build.</div>}
              </div>

              {/* Don't see your adventure — colored */}
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-700 p-6 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-white">Don&apos;t see your perfect adventure?</p>
                  <p className="text-sm text-white/80 mt-0.5">Full-day private charters from $600 — Mexico Rocks, Caye Caulker, Bliss Beach, and custom destinations. Reach out and we&apos;ll plan it together.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={onOpenWhatsApp} className="h-10 px-4 rounded-full bg-white text-teal-800 text-xs font-bold hover:bg-teal-50 transition">WhatsApp</button>
                  <button type="button" onClick={() => onOpenLia("Hi Lia — I'm looking for an adventure not listed on the Custom Charter page. Can you help?")} className="h-10 px-4 rounded-full border border-white/30 bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition">Ask Lia</button>
                </div>
              </div>
            </section>

            {/* ── ADD-ONS ── */}
            <section id="add-ons" className="w-full pb-16">
              <div className="max-w-3xl">
                <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Add-Ons</div>
                <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">You&apos;re already out here. Go bigger.</h2>
                <p className="mt-4 text-lg text-slate-700">Impulse-buy energy. Zero regrets.</p>
                {isFullDay && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2">
                    <span className="text-emerald-600 text-sm font-bold">✓ Beach BBQ is already included in your Full Day</span>
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ADDONS.map((a) => {
                  const q = addOnQty[a.id];
                  const isActive = q > 0;
                  return (
                    <div key={a.id} className={`rounded-3xl border overflow-hidden shadow-sm transition ${isActive ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
                      {a.image && (
                        <div className="relative h-32 w-full">
                          <Image src={a.image} alt={a.label} fill className="object-cover" sizes="50vw" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                          <div className="absolute bottom-3 left-4">
                            <span className="text-white font-extrabold text-sm drop-shadow">{a.label}</span>
                          </div>
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-start gap-3">
                          <input type="checkbox" id={`addon-${a.id}`} checked={isActive} onChange={(e) => toggleAddon(a.id, e.target.checked)} className="mt-1 h-5 w-5 rounded accent-amber-400 cursor-pointer shrink-0" />
                          <label htmlFor={`addon-${a.id}`} className="flex-1 cursor-pointer">
                            {!a.image && <div className="font-extrabold text-slate-900 mb-0.5">{a.label}</div>}
                            <div className="text-sm text-slate-500">{a.note}</div>
                            {a.noteHighlight && <div className="mt-1 text-xs font-semibold text-amber-600">{a.noteHighlight}</div>}
                          </label>
                          <div className="text-sm font-bold text-slate-700 shrink-0">{formatMoney(a.price)}</div>
                        </div>
                        {isActive && (
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Quantity</span>
                            <div className="flex items-center gap-3">
                              <button type="button" onClick={() => decrementAddon(a.id)} disabled={q <= 0} className="h-9 w-9 rounded-full border border-slate-200 bg-white font-black hover:bg-slate-50 transition disabled:opacity-40">−</button>
                              <span className="min-w-[28px] text-center font-extrabold text-slate-900">{q}</span>
                              <button type="button" onClick={() => incrementAddon(a.id)} className="h-9 w-9 rounded-full border border-slate-200 bg-white font-black hover:bg-slate-50 transition">+</button>
                            </div>
                            <span className="text-sm font-bold text-amber-600">{formatMoney(a.price * q)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ── STICKY SIDEBAR ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl">
              <div className="rounded-2xl border border-white/20 bg-gray-950/95 backdrop-blur-md p-5">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {(['half', 'full'] as const).map((d) => (
                    <button key={d} type="button" onClick={() => setDuration(d)} className={`h-9 rounded-xl text-xs font-bold uppercase tracking-widest transition border ${duration === d ? 'bg-white text-slate-950 border-white/30' : 'bg-white/10 text-white border-white/20 hover:bg-white/15'}`}>
                      {d === 'half' ? 'Half Day' : 'Full Day'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <span className="text-white/70 text-sm">Guests</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGuestCount((g) => Math.max(1, g - 1))} className="w-6 h-6 rounded-full border border-white/20 text-white hover:border-white/40 flex items-center justify-center text-sm transition">−</button>
                    <span className="text-white font-bold w-4 text-center">{guestCount}</span>
                    <button onClick={() => setGuestCount((g) => Math.min(8, g + 1))} className="w-6 h-6 rounded-full border border-white/20 text-white hover:border-white/40 flex items-center justify-center text-sm transition">+</button>
                  </div>
                </div>

                <div className="flex justify-between text-sm font-bold text-white">
                  <span>Custom Charter – {isFullDay ? 'Full Day' : 'Half Day'}{isFullDay && <span className="block text-[10px] font-normal text-emerald-400 mt-0.5">BBQ included</span>}</span>
                  <span>{formatMoney(basePrice)}</span>
                </div>

                {guestCount > includedGuests && (
                  <div className="flex justify-between text-sm text-white/80 mt-1">
                    <span>Additional Guests ({guestCount - includedGuests} @ $75.00)</span>
                    <span>{formatMoney(extraGuests)}</span>
                  </div>
                )}

                {/* ✅ Selected activities at $0.00 */}
                {selectedActivityList.length > 0 && (
                  <>
                    <hr className="border-white/10 my-3" />
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Selected Activities</div>
                    {selectedActivityList.map((a) => (
                      <div key={a.id} className="flex justify-between text-xs text-white/70 mt-1">
                        <span className="flex items-center gap-1 min-w-0 truncate"><span className="text-emerald-400 shrink-0">✓</span> {a.title}</span>
                        <span className="text-white/40 shrink-0 ml-2">$0.00</span>
                      </div>
                    ))}
                  </>
                )}

                <hr className="border-white/10 my-3" />

                {ADDONS.map((a) => {
                  const qty = addOnQty[a.id];
                  const active = qty > 0;
                  return (
                    <div key={a.id} className={`flex items-center justify-between gap-2 py-1.5 transition-opacity ${active ? 'opacity-100' : 'opacity-25 hover:opacity-50'}`}>
                      <span className="text-xs text-white/70 flex-1 min-w-0 truncate">{active && <span className="text-emerald-400 mr-1">✓</span>}{a.label}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => decrementAddon(a.id)} className="w-5 h-5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 flex items-center justify-center text-xs leading-none transition-colors">−</button>
                        <span className="text-white text-xs w-4 text-center">{qty}</span>
                        <button onClick={() => incrementAddon(a.id)} className="w-5 h-5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 flex items-center justify-center text-xs leading-none transition-colors">+</button>
                        <span className="text-white/60 text-xs w-14 text-right">{qty > 0 ? formatMoney(a.price * qty) : `$${a.price}`}</span>
                      </div>
                    </div>
                  );
                })}

                <hr className="border-white/10 my-3" />
                <div className="flex justify-between text-sm text-white/80 mt-1"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
                <div className="flex justify-between text-sm text-white/80 mt-1"><span>Tax (12.5%)</span><span>{formatMoney(tax)}</span></div>
                <div className="flex justify-between text-sm text-white/80 mt-1"><span>Service Fee (6%)</span><span>{formatMoney(serviceFee)}</span></div>

                <button onClick={handleCheckout} disabled={checkoutLoading} className="mt-4 w-full rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-black font-bold py-3 flex items-center justify-center gap-2 transition-all">
                  {checkoutLoading ? <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" /> : <>🔒 Secure Checkout</>}
                </button>
                <div className="mt-3 space-y-1">
                  {['Bank-level encryption', 'All major cards accepted', 'Instant confirmation'].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-white/70"><span className="text-emerald-400">✓</span> {t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── WHAT TO BRING ── */}
        <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.35em] text-sky-700">What to Bring</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Show up ready. Leave with stories.</h2>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Sunscreen', icon: <Sun className="w-5 h-5 text-yellow-300" />, image: `${base}/images/sunscreen-what-to-bring%20(1).jpg` },
              { label: 'Towel', icon: <Waves className="w-5 h-5 text-sky-300" />, image: `${base}/images/towel.jpg` },
              { label: 'Camera', icon: <Camera className="w-5 h-5 text-purple-300" />, image: `${base}/images/camera-what-to-bring.jpg` },
              { label: 'Comfortable Shoes', icon: <Footprints className="w-5 h-5 text-emerald-300" />, image: `${base}/images/comfortable-shoes-what-to-bring.jpg` },
              { label: 'Sunglasses', icon: <Glasses className="w-5 h-5 text-amber-300" />, image: `${base}/images/suglasses-what-to-bring.jpg` },
              { label: 'Water & Hydration', icon: <Droplets className="w-5 h-5 text-cyan-300" />, image: `${base}/images/water-hydration-what-to-bring.jpg` },
              { label: 'Light Jacket', icon: <Wind className="w-5 h-5 text-blue-300" />, image: `${base}/images/light-jacket-what-to-bring.jpg` },
              { label: 'Cash (for fees)', icon: <Banknote className="w-5 h-5 text-green-300" />, image: `${base}/images/cash-for-fees-what-to-bring.jpg` },
            ].map((item) => (
              <div key={item.label} className="relative rounded-3xl overflow-hidden shadow-sm h-36 sm:h-40 group">
                <Image src={item.image} alt={item.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-2">{item.icon}</div>
                  <div className="font-extrabold text-white text-sm leading-tight">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GUARANTEE ── */}
        <section id="guarantee" className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
          <div className="rounded-[2.5rem] border border-amber-200 bg-amber-50 p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-3xl bg-white border border-amber-200 flex items-center justify-center text-amber-800"><ShieldCheck className="h-6 w-6" /></div>
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-amber-800">The Guarantee</div>
                <h2 className="mt-3 text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">Local knowledge. On your side.</h2>
                <p className="mt-4 text-lg text-slate-800 leading-relaxed">If conditions aren&apos;t perfect, we adjust. If the fish aren&apos;t biting deep, we hit the reef. If the wind picks up, we find the lee side.</p>
                <p className="mt-4 text-lg text-slate-800 leading-relaxed">René grew up navigating every reef, current, and hidden cay in Belize. This isn&apos;t a job — it&apos;s his home, and he&apos;s inviting you into it.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── GUEST INFO ── */}
        <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Guest Info</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Book fast. Or go massive.</h2>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-amber-400 p-6 shadow-sm">
              <div className="text-lg font-extrabold text-slate-950">Designed for up to 8 guests</div>
              <div className="mt-3 text-slate-900 leading-relaxed">Book online instantly. Lock your date. Build your day exactly the way you want it.</div>
              <a href="#build-your-day" onClick={(e) => { e.preventDefault(); scrollTo('build-your-day'); }} className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 text-white px-6 py-3 text-sm font-bold hover:bg-slate-800 transition">Book Online</a>
            </div>
            <div className="rounded-3xl bg-teal-500 p-6 shadow-sm">
              <div className="text-lg font-extrabold text-white">Traveling with more than 8?</div>
              <div className="mt-3 text-teal-50 leading-relaxed">Contact us via WhatsApp or email and we&apos;ll help arrange your trip.</div>
              <button type="button" onClick={onOpenWhatsAppLargeGroup} className="mt-5 h-12 w-full rounded-2xl bg-white text-teal-800 font-extrabold hover:bg-teal-50 transition text-sm">WhatsApp +501 627 3556</button>
            </div>
            <div className="rounded-3xl bg-gray-950 p-6 shadow-sm border border-white/10">
              <div className="text-lg font-extrabold text-white">Talk to Lia</div>
              <div className="mt-3 text-white/70 leading-relaxed">She&apos;ll build your perfect day. Fast, personal, zero stress.</div>
              <button type="button" onClick={() => onOpenLia('Hi Lia — help me build the perfect Custom Charter day.')} className="mt-5 h-12 w-full rounded-2xl bg-amber-400 text-slate-950 font-extrabold hover:bg-amber-300 transition text-sm">Open Lia Chat</button>
            </div>
          </div>
        </section>

        {/* ── REAL MOMENTS ── */}
        <section className="mx-auto w-full max-w-screen-2xl px-4 pb-16">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Real Moments</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">The kind of day that rewires your brain.</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Alyssa M.', stars: '★★★★★', quote: 'The tarpon exploded on the surface. We screamed. We laughed. It felt unreal.', photo: `${base}/images/alyssa-the-tarpon-real-moments.jpg` },
              { name: 'Jordan K.', stars: '★★★★★', quote: 'Hol Chan was pure magic. Rays under our fins. Turtles surfacing for air. We will never forget it.', photo: `${base}/images/hol-chan-custom-adventure.jpg` },
              { name: 'Mia & Theo', stars: '★★★★★', quote: 'Beach BBQ with fresh catch. Rum punch. Sunset on the ride back. Best day of our lives.', photo: `${base}/images/beach-bbq-custom-adventure.jpg` },
            ].map((r) => (
              <article key={r.name} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="relative h-48">
                  <Image src={r.photo} alt={r.name} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute left-5 bottom-4">
                    <div className="text-white font-extrabold">{r.name}</div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-amber-300">{r.stars}</div>
                  </div>
                </div>
                <div className="p-6"><div className="text-slate-800 font-semibold leading-relaxed">&quot;{r.quote}&quot;</div></div>
              </article>
            ))}
          </div>
        </section>

        {/* ── ALL TOURS ── */}
        <section id="all-tours" className="mx-auto w-full max-w-screen-2xl px-4 pb-28">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.35em] text-sky-700">All Tours</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Keep the adrenaline going.</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {youMightAlsoLike.map((t) => (
              <Link key={t.slug} href={`/tours/${t.slug}`} className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="relative h-48">
                  <Image src={t.imageSrc} alt={t.title} fill className="object-cover" sizes="33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute left-5 right-5 bottom-4">
                    <div className="text-white font-extrabold leading-tight">{t.title}</div>
                    <div className="mt-1 text-sm text-white/85">{t.price === 0 ? 'Inquire for pricing' : `From ${formatMoney(t.price)}`}</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-400 text-slate-950 font-extrabold px-4 py-2 text-xs uppercase tracking-[0.2em]">View Tour</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ── STICKY BOTTOM BAR ── */}
      <div className={`fixed bottom-0 left-0 right-0 z-[60] bg-gray-950/95 backdrop-blur-md border-t border-white/20 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-transform duration-300 ${stickyVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div>
          <div className="text-white font-bold text-sm">Custom Charter · {guestCount} Guest{guestCount !== 1 ? 's' : ''} · {isFullDay ? 'Full Day' : 'Half Day'}</div>
          <div className="text-white/55 text-xs">{activityCount} activities selected</div>
        </div>
        <div className="hidden md:block text-white/55 text-xs text-center max-w-xs truncate">
          {selectedActivityList.map((a) => a.title).join(', ') || 'No activities selected yet'}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-white/55 text-[10px] uppercase tracking-widest">Live Total</div>
            <div className="text-amber-300 font-extrabold text-lg">{formatMoney(liveTotal)}</div>
          </div>
          <button type="button" onClick={handleCheckout} disabled={checkoutLoading} className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-5 py-2.5 rounded-full text-sm transition-all disabled:opacity-60">
            {checkoutLoading ? '...' : 'Book Your Perfect Day'}
          </button>
        </div>
      </div>
    </>
  );
}
