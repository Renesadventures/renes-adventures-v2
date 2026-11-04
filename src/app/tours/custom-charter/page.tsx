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
import QuickBook, { QuickBookMobileBar } from '@/components/booking/QuickBook';

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
  // Sequential tax per Chris Carter 3/9/2026: 12.5% on base, then 6% on base+tax
  const tax = useMemo(() => subtotal * 0.125, [subtotal]);
  const subtotalAfterTax = useMemo(() => subtotal + tax, [subtotal, tax]);
  const serviceFee = useMemo(() => subtotalAfterTax * 0.06, [subtotalAfterTax]);
  const liveTotal = useMemo(() => subtotalAfterTax + serviceFee, [subtotalAfterTax, serviceFee]);

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
              {[{ label: 'Overview', href: 'overview' }, { label: 'Book', href: 'book' }, { label: 'Guarantee', href: 'guarantee' }, { label: 'All Tours', href: 'all-tours' }].map((link) => (
                <button key={link.label} type="button" onClick={() => scrollTo(link.href)} className="text-white/65 hover:text-amber-300 text-sm font-medium transition-colors">{link.label}</button>
              ))}
            </div>
            <button type="button" onClick={() => scrollTo('book')} disabled={checkoutLoading} className="bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs px-5 py-2 rounded-full transition shrink-0 disabled:opacity-60">Request my date</button>
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
                    <button type="button" onClick={() => scrollTo('book')} className="h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg border border-black/15 hover:brightness-105 transition">Book Your Perfect Day</button>
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

        {/* -- BOOK: what you can do + one simple booking box -- */}
        <section id="book" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-16">
          <div className="lg:col-span-2">
            <div className="text-xs font-black uppercase tracking-[0.35em] text-amber-600">Your Day. Your Boat. Your Adventure.</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">What you can do on your day</h2>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed">No need to choose now. Pick half or full day, send your date, and tell Rene your favorites when he confirms. He plans the day around the weather and the tides.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activities.map((a) => (
                <div key={a.id} className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                  <div className="relative h-40 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.image} alt={a.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-extrabold text-slate-900">{a.title}</h3>
                      <span className="shrink-0 text-xs text-slate-500">about {Math.round(a.minutes / 30) / 2}h</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.description}</p>
                    {a.id === 'beach-bbq' ? <p className="mt-2 text-xs font-bold text-emerald-600">Included with Full Day</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <QuickBook
                tourSlug="custom-charter"
                tourTitle="Custom Charter"
                options={[
                  { id: 'half', label: 'Half Day', sub: '4 hours', price: baseHalfDay },
                  { id: 'full', label: 'Full Day', sub: '8 hours', price: baseFullDay, note: 'Beach BBQ included' },
                ]}
                includedGuests={includedGuests}
                extraGuestPrice={75}
                maxGuests={8}
                fullDayBbqExtraGuest={25}
                compoundFees
              />
            </div>
          </div>
        </section>

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
              <div className="mt-3 text-slate-900 leading-relaxed">Pick half or full day, send your date, done. Rene confirms on WhatsApp. No payment until your date is confirmed.</div>
              <a href="#book" onClick={(e) => { e.preventDefault(); scrollTo('book'); }} className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-950 text-white px-6 py-3 text-sm font-bold hover:bg-slate-800 transition">Book Online</a>
            </div>
            <div className="rounded-3xl bg-teal-500 p-6 shadow-sm">
              <div className="text-lg font-extrabold text-white">Traveling with more than 8?</div>
              <div className="mt-3 text-teal-50 leading-relaxed">Contact us via WhatsApp or email and we&apos;ll help arrange your trip.</div>
              <button type="button" onClick={onOpenWhatsAppLargeGroup} className="mt-5 h-12 w-full rounded-2xl bg-white text-teal-800 font-extrabold hover:bg-teal-50 transition text-sm">WhatsApp +501 606 0170</button>
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

      {/* -- PHONE BOOKING BAR -- */}
      <QuickBookMobileBar />
    </>
  );
}
