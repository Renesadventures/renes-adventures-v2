'use client';

import Image from 'next/image';
import Link from 'next/link';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Anchor,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Crown,
  Flame,
  Info,
  MessageCircle,
  ShoppingBag,
  Sun,
  UserPlus,
  Waves,
} from 'lucide-react';
import type { Tour } from '@/data/tours';
import type { TourAddOn } from '@/data/tour-addons';

type AddOnPricingTypeUi = 'flat' | 'per-guest' | 'tiered-per-guest';

type AddOnUiItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: TourAddOn['category'];
  pricingType: AddOnPricingTypeUi;
  specialInstructions?: string;
  icon: TourAddOn['icon'];
};

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function getWhatsAppNumberClient(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const cleaned = typeof raw === 'string' ? raw.replace(/\D/g, '') : '';
  return cleaned.length >= 8 ? cleaned : '5016273556';
}

function buildWhatsAppBookingLink(opts: {
  tourTitle: string;
  guests: number;
  day: 'half' | 'full';
  addOns: { title: string; qty: number }[];
}) {
  const durationLabel = opts.day === 'full' ? 'Full-day' : 'Half-day';
  const addonsLine = opts.addOns.length
    ? `\n\nAdd-ons:\n${opts.addOns.map((a) => `- ${a.title} × ${a.qty}`).join('\n')}`
    : '';

  const message = `Hi René,\n\nCan we book the ${opts.tourTitle}?\n\nGuests: ${opts.guests}\nDuration: ${durationLabel}${addonsLine}\n\nThank you!`;
  const number = getWhatsAppNumberClient();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function buildAddOnUi(addOns: TourAddOn[]): AddOnUiItem[] {
  return addOns.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    price: a.price,
    category: a.category,
    pricingType: a.pricingType,
    specialInstructions: a.specialInstructions,
    icon: a.icon,
  }));
}

function defaultQtyForSelection(item: AddOnUiItem, guests: number): number {
  return Math.max(1, guests);
}

function addOnLineTotal(item: AddOnUiItem, qty: number): number {
  if (qty <= 0) return 0;
  return item.price * qty;
}

function AddOnIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'Flame':
      return <Flame className={className || "h-4 w-4 text-slate-700"} />;
    case 'UserPlus':
      return <UserPlus className={className || "h-4 w-4 text-slate-700"} />;
    case 'Waves':
      return <Waves className={className || "h-4 w-4 text-slate-700"} />;
    case 'Anchor':
      return <Anchor className={className || "h-4 w-4 text-slate-700"} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className || "h-4 w-4 text-slate-700"} />;
    case 'Sun':
      return <Sun className={className || "h-4 w-4 text-slate-700"} />;
    case 'Crown':
      return <Crown className={className || "h-4 w-4 text-slate-700"} />;
    default:
      return <ShoppingBag className={className || "h-4 w-4 text-slate-700"} />;
  }
}

type AssetListResponse = {
  images: string[];
};

function useAssetImages({
  keywords,
  fallbackImages,
  limit,
}: {
  keywords: string[];
  fallbackImages: string[];
  limit: number;
}) {
  const keywordsRef = useRef(keywords);
  const fallbackRef = useRef(fallbackImages);
  const limitRef = useRef(limit);

  const [images, setImages] = useState<string[]>(() => fallbackImages.slice(0, limit));

  useEffect(() => {
    let cancelled = false;

    const loadImages = async () => {
      try {
        const res = await fetch('/api/assets/renes-activities', { method: 'GET' });

        if (!res.ok || cancelled) {
          return;
        }

        const data = (await res.json()) as AssetListResponse;
        const pool = Array.isArray(data?.images) ? data.images : [];

        if (pool.length === 0 || cancelled) {
          return;
        }

        const loweredKeywords = (keywordsRef.current || []).map((k) => k.toLowerCase()).filter(Boolean);
        const filtered = pool.filter((src) => {
          const s = src.toLowerCase();
          return loweredKeywords.some((k) => s.includes(k));
        });

        const combined = [...filtered, ...(fallbackRef.current || [])];
        const unique = Array.from(new Set(combined));
        const final = unique.slice(0, limitRef.current);

        if (!cancelled && final.length > 0) {
          setImages(final);
        }
      } catch (err) {
        console.error('Gallery fetch error:', err);
      }
    };

    void loadImages();

    return () => {
      cancelled = true;
    };
  }, []);

  return images;
}

function useHeroImages({ keywords, fallbackImages }: { keywords: string[]; fallbackImages: string[] }) {
  return useAssetImages({ keywords, fallbackImages, limit: 5 });
}

export function TourGuestGallery({
  keywords,
  fallbackImages,
}: {
  keywords: string[];
  fallbackImages?: string[];
}) {
  const images = useAssetImages({
    keywords,
    fallbackImages:
      fallbackImages && fallbackImages.length
        ? fallbackImages
        : [
            '/images/tours/hol-chan-snorkel.jpg',
            '/images/tours/beach-bbq.jpg',
            '/images/tours/sunset-cruise.jpg',
            '/images/tours/full-day-ultimate.jpg',
            '/images/tours/deep-sea-fishing.jpg',
          ],
    limit: 30,
  });

  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [failed, setFailed] = useState<Record<string, true>>({});

  const usable = images.filter((src) => !failed[src]);
  const shown = expanded ? usable : usable.slice(0, 12);

  return (
    <section className="py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Guest Photo Gallery</h2>
          <p className="mt-4 text-slate-600">Real moments from real adventures</p>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shown.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setLightbox(src)}
              className="relative block w-full aspect-square min-h-[140px] rounded-2xl overflow-hidden group"
              aria-label="Open photo"
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                onError={() => {
                  console.error('Image failed to load:', src);
                  setFailed((p) => ({ ...p, [src]: true }));
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Tap to view
              </div>
            </button>
          ))}
        </div>

        {!expanded && usable.length > 12 ? (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => {
                setExpanded(true);
              }}
              className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-extrabold hover:bg-slate-800 transition"
            >
              View All {usable.length} Photos
            </button>
          </div>
        ) : null}
      </div>

      {lightbox ? (
        <div className="fixed inset-0 z-[95] bg-black/70 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative w-full max-w-5xl aspect-[16/10] rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
            <Image src={lightbox} alt="" fill className="object-contain bg-black" sizes="100vw" />
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md font-black"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function TourHeroMedia({
  videoUrl,
  videoUrls,
  keywords,
  fallbackImages,
}: {
  videoUrl: string;
  videoUrls?: string[];
  keywords: string[];
  fallbackImages: string[];
}) {
  const images = useHeroImages({ keywords, fallbackImages });
  const [active, setActive] = useState<{ type: 'video' } | { type: 'image'; src: string }>({ type: 'video' });
  const candidates = useMemo(() => {
    const base = (videoUrls && videoUrls.length ? videoUrls : [videoUrl]).filter(Boolean);
    const augmented: string[] = [...base];

    const hasDeepSea = base.some((u) => u.toLowerCase().includes('deep-sea-fishing') || u.toLowerCase().includes('deep%20sea%20fishing'));
    if (hasDeepSea) {
      for (const u of base) {
        if (!u) continue;
        if (!u.toLowerCase().includes('/hero/')) continue;
        const prefix = u.slice(0, u.toLowerCase().indexOf('/hero/') + '/hero/'.length);
        augmented.push(`${prefix}Deep Sea Fishing.mp4`);
        augmented.push(`${prefix}Deep%20Sea%20Fishing.mp4`);
      }
    }

    return uniq(augmented);
  }, [videoUrl, videoUrls]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const safeCandidateIndex = candidates.length ? Math.min(candidateIndex, candidates.length - 1) : 0;

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5;
  }, [candidateIndex]);

  const scrollBy = (dir: -1 | 1) => {
    const el = document.getElementById('tour-hero-thumbs');
    if (!el) return;
    el.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/25 bg-black/10 shadow-2xl">
        <div className="relative aspect-[16/9] w-full">
          {active.type === 'video' ? (
            <video
              ref={videoRef}
              key={candidates[safeCandidateIndex] || videoUrl}
              src={candidates[safeCandidateIndex] || videoUrl}
              className="h-full w-full object-cover"
              playsInline
              autoPlay
              muted
              loop
              onLoadedMetadata={(e) => {
                e.currentTarget.playbackRate = 0.5;
                console.log('Video loaded, playback set to 0.5x');
              }}
              onError={() => {
                // Silently try next video candidate
                if (safeCandidateIndex < candidates.length - 1) {
                  setCandidateIndex((i) => i + 1);
                }
              }}
            />
          ) : (
            <Image src={active.src} alt="" fill className="object-cover" sizes="100vw" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        </div>
      </div>

      <div className="mt-4 relative">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md hover:bg-black/45 transition"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md hover:bg-black/45 transition"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div id="tour-hero-thumbs" className="flex gap-3 overflow-x-auto pb-2 pr-2">
          <button
            type="button"
            onClick={() => setActive({ type: 'video' })}
            className={`relative h-[120px] w-[200px] shrink-0 overflow-hidden rounded-2xl border bg-white/10 backdrop-blur-md transition ${
              active.type === 'video' ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-white/20 hover:border-white/40'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-white/25 bg-black/35 px-4 py-2 text-white font-extrabold text-sm">
                Video
              </div>
            </div>
          </button>

          {images.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActive({ type: 'image', src })}
              className={`relative h-[120px] w-[200px] shrink-0 overflow-hidden rounded-2xl border transition ${
                active.type === 'image' && active.src === src
                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover hover:scale-[1.05] transition-transform duration-500"
                sizes="200px"
                onError={() => {
                  console.error('Hero image failed to load:', src);
                }}
              />
              <div className="absolute inset-0 bg-black/10" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type DayOption = 'half' | 'full';

type QuoteFormState = {
  open: boolean;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: string;
  message: string;
  submitting: boolean;
  success: boolean;
  error: string | null;
};

type TourLandingContextValue = {
  tour: Tour;
  addOns: TourAddOn[];
  uiAddOns: AddOnUiItem[];
  whatsappUrl: string;
  guests: number;
  setGuestsAndSyncAddOns: (nextGuests: number) => void;
  day: DayOption;
  setDay: (next: DayOption) => void;
  qtyById: Record<string, number>;
  setQtyFor: (id: string, nextQty: number) => void;
  onSelectAddOn: (item: AddOnUiItem) => void;
  selectedAddOns: { item: AddOnUiItem; qty: number; lineTotal: number }[];
  basePrice: number;
  extraPassengerPrice: number;
  addOnsTotal: number;
  subtotal: number;
  tax: number;
  serviceFee: number;
  estimatedTotal: number;
  stickyVisible: boolean;
  quote: QuoteFormState;
  setQuote: (next: QuoteFormState | ((prev: QuoteFormState) => QuoteFormState)) => void;
};

const TourLandingContext = createContext<TourLandingContextValue | null>(null);

function useTourLanding() {
  const ctx = useContext(TourLandingContext);
  if (!ctx) throw new Error('Tour landing context missing');
  return ctx;
}

export function TourLandingLightProvider({
  tour,
  addOns,
  children,
}: {
  tour: Tour;
  addOns: TourAddOn[];
  children: React.ReactNode;
}) {
  const uiAddOns = useMemo(() => buildAddOnUi(addOns), [addOns]);

  const [day, setDay] = useState<DayOption>(() => {
    if (tour.hasHalfDay) return 'half';
    if (tour.hasFullDay) return 'full';
    return 'half';
  });
  const [guests, setGuests] = useState(() => clamp(tour.includedGuests || 1, 1, tour.maxGuests || 8));
  const [qtyById, setQtyById] = useState<Record<string, number>>({});
  const [stickyVisible, setStickyVisible] = useState(false);
  const [quote, setQuote] = useState<QuoteFormState>({
    open: false,
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    message: '',
    submitting: false,
    success: false,
    error: null,
  });

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const includedGuests = tour.includedGuests || 4;
  const additionalGuestPrice = tour.additionalGuestPrice || 75;

  const setGuestsAndSyncAddOns = (nextGuests: number) => {
    const clamped = clamp(nextGuests, 1, tour.maxGuests || 8);
    setGuests(clamped);
    setQtyById((prev) => {
      const next: Record<string, number> = { ...prev };
      let changed = false;
      for (const item of uiAddOns) {
        const q = next[item.id] || 0;
        if (q > 0 && (item.pricingType === 'per-guest' || item.pricingType === 'tiered-per-guest') && q !== clamped) {
          next[item.id] = clamped;
          changed = true;
        }
      }

      // Beach BBQ extra guest is derived: only when BBQ base is selected
      if ((next['beach-bbq-base'] || 0) > 0) {
        const desired = Math.max(0, clamped - includedGuests);
        if (desired === 0) {
          if (next['beach-bbq-extra-guest']) {
            delete next['beach-bbq-extra-guest'];
            changed = true;
          }
        } else if (next['beach-bbq-extra-guest'] !== desired) {
          next['beach-bbq-extra-guest'] = desired;
          changed = true;
        }
      } else if (next['beach-bbq-extra-guest']) {
        delete next['beach-bbq-extra-guest'];
        changed = true;
      }

      return changed ? next : prev;
    });
  };

  const setQtyFor = (id: string, nextQty: number) => {
    const clamped = Math.max(0, nextQty);
    setQtyById((prev) => {
      const copy = { ...prev };
      if (clamped === 0) delete copy[id];
      else copy[id] = clamped;
      return copy;
    });
  };

  const onSelectAddOn = (item: AddOnUiItem) => {
    setQtyById((prev) => {
      const copy: Record<string, number> = { ...prev };
      const current = copy[item.id] || 0;

      if (current > 0) {
        delete copy[item.id];
        if (item.id === 'beach-bbq-base') delete copy['beach-bbq-extra-guest'];
        return copy;
      }

      // all add-ons start at guest count
      copy[item.id] = defaultQtyForSelection(item, guests);

      // selecting BBQ base should auto-derive the extra guest line
      if (item.id === 'beach-bbq-base') {
        const desired = Math.max(0, guests - includedGuests);
        if (desired > 0) copy['beach-bbq-extra-guest'] = desired;
        else delete copy['beach-bbq-extra-guest'];
      }

      return copy;
    });
  };

  const selectedAddOns = useMemo(() => {
    return uiAddOns
      .map((item) => {
        const qty = qtyById[item.id] || 0;
        const lineTotal = addOnLineTotal(item, qty);
        return { item, qty, lineTotal };
      })
      .filter((x) => x.qty > 0);
  }, [qtyById, uiAddOns]);

  const whatsappUrl = useMemo(
    () =>
      buildWhatsAppBookingLink({
        tourTitle: tour.title,
        guests,
        day,
        addOns: selectedAddOns.map((x) => ({ title: x.item.title, qty: x.qty })),
      }),
    [day, guests, selectedAddOns, tour.title],
  );

  const basePrice = day === 'full' && tour.hasFullDay ? (tour.fullDayPrice ?? tour.price) : tour.price;
  const extraPassengerPrice =
    guests > includedGuests ? (guests - includedGuests) * additionalGuestPrice : 0;
  const addOnsTotal = selectedAddOns.reduce((sum, x) => sum + x.lineTotal, 0);
  const subtotal = basePrice + extraPassengerPrice + addOnsTotal;

  const tax = Math.round(subtotal * 0.125);
  const serviceFee = Math.round(subtotal * 0.06);
  const estimatedTotal = subtotal + tax + serviceFee;

  const value: TourLandingContextValue = {
    tour,
    addOns,
    uiAddOns,
    whatsappUrl,
    guests,
    setGuestsAndSyncAddOns,
    day,
    setDay,
    qtyById,
    setQtyFor,
    onSelectAddOn,
    selectedAddOns,
    basePrice,
    extraPassengerPrice,
    addOnsTotal,
    subtotal,
    tax,
    serviceFee,
    estimatedTotal,
    stickyVisible,
    quote,
    setQuote,
  };

  return <TourLandingContext.Provider value={value}>{children}</TourLandingContext.Provider>;
}

export function TourPricingPanel() {
  const { tour, whatsappUrl, guests, setGuestsAndSyncAddOns, day, setDay, estimatedTotal, setQuote } = useTourLanding();
  const hasToggle = tour.hasHalfDay && tour.hasFullDay;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Pricing</div>
          <div className="mt-2 flex items-end gap-3">
            <div className="text-4xl font-extrabold text-slate-900">{formatMoney(day === 'full' && tour.hasFullDay ? (tour.fullDayPrice ?? tour.price) : tour.price)}</div>
            {hasToggle ? (
              <div className="pb-1 text-sm font-semibold text-slate-600">{day === 'full' ? 'Full-day' : 'Half-day'}</div>
            ) : null}
          </div>
          {hasToggle ? (
            <div className="mt-2 text-sm text-slate-700">
              Half-day: <span className="font-extrabold text-slate-900">{formatMoney(tour.price)}</span>
              <span className="mx-2 text-slate-300">|</span>
              Full-day:{' '}
              <span className="font-extrabold text-slate-900">{formatMoney(tour.fullDayPrice ?? tour.price)}</span>
            </div>
          ) : null}
        </div>

        {hasToggle ? (
          <div className="shrink-0">
            <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setDay('half')}
                className={`h-10 px-4 rounded-xl text-sm font-extrabold transition ${
                  day === 'half' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Half-day
              </button>
              <button
                type="button"
                onClick={() => setDay('full')}
                className={`h-10 px-4 rounded-xl text-sm font-extrabold transition ${
                  day === 'full' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Full-day
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-14 rounded-2xl bg-amber-400 text-slate-950 font-black border border-black/10 hover:brightness-105 transition flex items-center justify-center"
        >
          Book This Adventure
        </a>

        <Link
          href="/checkout"
          className="h-14 rounded-2xl border border-slate-200 bg-white text-slate-900 font-extrabold hover:bg-slate-50 transition flex items-center justify-center"
        >
          Checkout
        </Link>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-slate-600">Book 1-{tour.maxGuests} guests instantly</div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {guests} guest{guests === 1 ? '' : 's'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGuestsAndSyncAddOns(guests - 1)}
              className="h-10 w-10 rounded-xl bg-white text-slate-900 font-black border border-slate-200 hover:bg-slate-50 transition"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setGuestsAndSyncAddOns(guests + 1)}
              className="h-10 w-10 rounded-xl bg-white text-slate-900 font-black border border-slate-200 hover:bg-slate-50 transition"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Base includes {tour.includedGuests}. Extra guest: {formatMoney(tour.additionalGuestPrice)} each.
          </div>
          <button
            type="button"
            onClick={() => setQuote((p) => ({ ...p, open: true, success: false, error: null }))}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 font-extrabold hover:bg-slate-50 transition"
          >
            9+ Guests? Get Custom Quote
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-4">
        <div className="text-xs uppercase tracking-[0.35em] text-slate-600">Estimated total</div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900">{formatMoney(estimatedTotal)}</div>
        <div className="mt-2 text-xs text-slate-600">Includes estimated tax + service fee.</div>
      </div>
    </div>
  );
}

function AddOnCard({ item }: { item: AddOnUiItem }) {
  const { qtyById, guests, onSelectAddOn, setQtyFor } = useTourLanding();
  const qty = qtyById[item.id] || 0;
  const subtitle =
    item.pricingType === 'per-guest'
      ? `${formatMoney(item.price)} / guest`
      : `${formatMoney(item.price)}${item.category === 'merchandise' ? ' each' : ''}`;
  const lineTotal = addOnLineTotal(item, qty);

  return (
    <div className="w-[290px] shrink-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-sky-500 to-indigo-500 shadow-sm">
              <AddOnIcon name={item.icon} className="h-5 w-5 text-white" />
            </span>
            <div className="font-extrabold text-slate-900 text-sm leading-tight">{item.title}</div>
          </div>
          <div className="mt-1 text-xs text-slate-600">{subtitle}</div>
          {qty > 0 ? (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-extrabold text-amber-800">
              <CheckCircle2 className="h-4 w-4" /> Selected
            </div>
          ) : null}
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Total</div>
          <div className="mt-1 text-sm font-extrabold text-slate-900">{formatMoney(lineTotal)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {qty <= 0 ? (
          <button
            type="button"
            onClick={() => onSelectAddOn(item)}
            className="h-11 px-4 rounded-2xl bg-amber-400 text-slate-950 font-black border border-black/10 hover:brightness-105 transition"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQtyFor(item.id, qty - 1)}
              className="h-11 w-11 rounded-2xl border border-slate-200 bg-white text-slate-900 font-black hover:bg-slate-50 transition"
            >
              −
            </button>
            <div className="min-w-[40px] text-center font-extrabold text-slate-900">{qty}</div>
            <button
              type="button"
              onClick={() => setQtyFor(item.id, qty + 1)}
              className="h-11 w-11 rounded-2xl border border-slate-200 bg-white text-slate-900 font-black hover:bg-slate-50 transition"
            >
              +
            </button>
          </div>
        )}
        <div className="text-[11px] text-slate-600 text-right">
          {item.pricingType === 'per-guest' || item.pricingType === 'tiered-per-guest' ? `Tracks guests (${guests})` : 'Adjustable'}
        </div>
      </div>
    </div>
  );
}

export function TourAddOnsPanel() {
  const { uiAddOns, basePrice, extraPassengerPrice, addOnsTotal, subtotal, tax, serviceFee, estimatedTotal } = useTourLanding();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Add-Ons</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">Make it legendary</div>
          <div className="mt-2 text-slate-700">
            Tap <span className="font-extrabold">Add</span> to include an upgrade. Per-guest upgrades start at your current guest count.
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-[0.35em] text-slate-600">Estimated</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{formatMoney(subtotal)}</div>
        </div>
      </div>

      <div className="mt-6 -mx-6 px-6">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {uiAddOns.map((item) => (
            <AddOnCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-[#F8FAFC] p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Base</span>
            <span className="font-extrabold text-slate-900">{formatMoney(basePrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Extra guests</span>
            <span className="font-extrabold text-slate-900">{formatMoney(extraPassengerPrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Add-ons</span>
            <span className="font-extrabold text-slate-900">{formatMoney(addOnsTotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Estimated total</span>
            <span className="font-extrabold text-slate-900">{formatMoney(estimatedTotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Tax (12.5%)</span>
            <span className="font-extrabold text-slate-900">{formatMoney(tax)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Service fee (6%)</span>
            <span className="font-extrabold text-slate-900">{formatMoney(serviceFee)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TourOrderSummaryPanel() {
  const {
    tour,
    day,
    setDay,
    guests,
    setGuestsAndSyncAddOns,
    selectedAddOns,
    basePrice,
    extraPassengerPrice,
    subtotal,
    tax,
    serviceFee,
    estimatedTotal,
    setQuote,
  } = useTourLanding();

  const hasToggle = tour.hasHalfDay && tour.hasFullDay;
  const isFullDay = day === 'full';
  const toggleFullDay = () => {
    setDay(isFullDay ? 'half' : 'full');
  };

  const whatsappUrl = useMemo(
    () =>
      buildWhatsAppBookingLink({
        tourTitle: tour.title,
        guests,
        day,
        addOns: selectedAddOns.map((x) => ({ title: x.item.title, qty: x.qty })),
      }),
    [day, guests, selectedAddOns, tour.title],
  );

  const openLia = () => {
    window.dispatchEvent(
      new CustomEvent('lia:open', {
        detail: {
          message: `Tell me more about ${tour.title}. We're looking at ${guests} guests for a ${day === 'full' ? 'full-day' : 'half-day'} tour.`,
        },
      }),
    );
  };

  return (
    <div className="w-full">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs uppercase tracking-[0.35em] text-slate-600">Order summary</div>
        <h3 className="mt-2 text-2xl font-extrabold text-slate-900">{tour.title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{tour.description}</p>

        {hasToggle ? (
          <div className="mt-5">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-200">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-sky-600" />
                <span className="font-semibold text-slate-700">Full-day adventure</span>
              </div>
              <button
                type="button"
                onClick={toggleFullDay}
                className={`relative w-14 h-7 rounded-full transition-all ${
                  isFullDay ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-slate-300'
                }`}
                aria-label="Toggle full-day option"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    isFullDay ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-5">
          <div className="text-xs uppercase tracking-[0.35em] text-slate-600">Guests</div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="text-sm font-extrabold text-slate-900">{guests}</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuestsAndSyncAddOns(guests - 1)}
                className="h-10 w-10 rounded-xl bg-white text-slate-900 font-black border border-slate-200 hover:bg-slate-50 transition"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setGuestsAndSyncAddOns(guests + 1)}
                className="h-10 w-10 rounded-xl bg-white text-slate-900 font-black border border-slate-200 hover:bg-slate-50 transition"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            Book 1-8 guests online instantly.
            <br />
            9+ guests? We&apos;ll coordinate a custom fleet.
          </div>
          <button
            type="button"
            onClick={() => setQuote((p) => ({ ...p, open: true, success: false, error: null }))}
            className="mt-3 w-full h-11 rounded-2xl border border-slate-300 bg-white text-slate-900 font-extrabold hover:bg-slate-50 transition"
          >
            Get Quote for 9+ Guests
          </button>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Base (up to 4)</span>
            <span className="font-extrabold text-slate-900">{formatMoney(basePrice)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-slate-700">Extra guests</span>
            <span className="font-extrabold text-slate-900">{formatMoney(extraPassengerPrice)}</span>
          </div>

          <div className="mt-5 text-xs uppercase tracking-[0.35em] text-slate-600">Add-ons</div>
          <div className="mt-3 grid gap-3">
            {selectedAddOns.length ? (
              selectedAddOns.map(({ item, qty, lineTotal }) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900 text-sm">{item.title}</div>
                      <div className="mt-1 text-xs text-slate-600">
                        {qty} × {formatMoney(item.price)}
                      </div>
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm">{formatMoney(lineTotal)}</div>
                  </div>
                  {item.specialInstructions ? (
                    <div className="mt-2 flex items-start gap-2 text-xs text-slate-500">
                      <Info className="h-4 w-4 shrink-0" />
                      <div className="italic">{item.specialInstructions}</div>
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-600">No add-ons selected yet.</div>
            )}
          </div>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Subtotal</span>
              <span className="font-extrabold text-slate-900">{formatMoney(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-slate-700">Tax (12.5%)</span>
              <span className="font-extrabold text-slate-900">{formatMoney(tax)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-slate-700">Service Fee (6%)</span>
              <span className="font-extrabold text-slate-900">{formatMoney(serviceFee)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-slate-700">Estimated Total</span>
              <span className="font-black text-slate-900">{formatMoney(estimatedTotal)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 rounded-2xl bg-amber-400 text-slate-950 font-black border border-black/10 hover:brightness-105 transition flex items-center justify-center"
          >
            Book This Adventure
          </a>
          <button
            type="button"
            onClick={openLia}
            className="h-12 rounded-2xl border-2 border-slate-300 text-slate-700 font-extrabold hover:bg-slate-50 transition flex items-center justify-center"
          >
            Ask Lia About This Tour
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 rounded-2xl bg-emerald-500 text-white font-extrabold hover:brightness-105 transition flex items-center justify-center"
          >
            WhatsApp Direct
          </a>
        </div>
      </div>
    </div>
  );
}

export function TourMobileSummaryBar() {
  const { estimatedTotal, tour, whatsappUrl } = useTourLanding();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden">
      <div className="mx-auto max-w-screen-2xl px-4 pb-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full px-5 py-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0 text-left">
              <div className="text-xs uppercase tracking-[0.35em] text-slate-600">Estimated total</div>
              <div className="mt-1 text-lg font-black text-slate-900">{formatMoney(estimatedTotal)}</div>
              <div className="text-xs text-slate-500 truncate">{tour.title}</div>
            </div>
            <ChevronDown className={`h-5 w-5 text-slate-700 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open ? (
            <div className="px-5 pb-5">
              <TourOrderSummaryPanel />
            </div>
          ) : (
            <div className="px-5 pb-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 rounded-2xl bg-amber-400 text-slate-950 font-black border border-black/10 hover:brightness-105 transition flex items-center justify-center"
              >
                Book This Adventure
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TourStickyBookingBar() {
  const { tour, whatsappUrl, stickyVisible, day } = useTourLanding();
  const price = day === 'full' && tour.hasFullDay ? (tour.fullDayPrice ?? tour.price) : tour.price;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[80] border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-lg transition-transform duration-300 ${
        stickyVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 pb-4">
        <div className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-lg px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-extrabold text-slate-900 truncate">{tour.title}</div>
              <div className="text-xl font-extrabold text-slate-900">{formatMoney(price)}</div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/checkout"
                className="h-12 px-5 rounded-2xl border border-slate-200 bg-white text-slate-900 font-extrabold hover:bg-slate-50 transition flex items-center justify-center"
              >
                Checkout
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-6 rounded-2xl bg-amber-500 text-slate-950 font-black hover:brightness-105 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Book Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NinePlusGuestsModal() {
  const { tour, quote, setQuote, whatsappUrl } = useTourLanding();

  const canSubmit =
    quote.name.trim() &&
    quote.email.trim() &&
    quote.phone.trim() &&
    quote.date.trim() &&
    quote.guests.trim();

  const submit = async () => {
    setQuote((p) => ({ ...p, submitting: true, error: null, success: false }));

    try {
      const guestsNumber = Number(quote.guests);
      if (!Number.isFinite(guestsNumber) || guestsNumber < 9) {
        throw new Error('Guests must be 9 or more.');
      }

      const res = await fetch('/api/large-group-quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fullName: quote.name.trim(),
          email: quote.email.trim(),
          phone: quote.phone.trim(),
          tourSlug: tour.slug,
          tourTitle: tour.title,
          tourDate: quote.date.trim(),
          guests: guestsNumber,
          specialRequests: quote.message.trim(),
        }),
      });

      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const maybeObj = typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : null;
        const maybeError = maybeObj && typeof maybeObj.error === 'string' ? maybeObj.error : null;
        throw new Error(maybeError || `HTTP ${res.status}`);
      }

      setQuote((p) => ({ ...p, submitting: false, success: true }));
    } catch (e) {
      setQuote((p) => ({
        ...p,
        submitting: false,
        error: e instanceof Error ? e.message : 'Failed to submit request',
      }));
    }
  };

  if (!quote.open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={() => setQuote((p) => ({ ...p, open: false }))}
      />
      <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-white/95 backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-sky-700">9+ Guests</div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">Get a custom quote</div>
            <div className="mt-2 text-sm text-slate-700">
              Tell us the basics and we&apos;ll price it fast.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setQuote((p) => ({ ...p, open: false }))}
            className="shrink-0 w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-900 font-black hover:bg-slate-50 transition"
          >
            ×
          </button>
        </div>

        {quote.success ? (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="font-extrabold text-green-900">Request sent.</div>
            <div className="mt-1 text-sm text-green-800">We&apos;ll reach out ASAP with your custom pricing.</div>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-2">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-600">Name</div>
              <input
                value={quote.name}
                onChange={(e) => setQuote((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-300"
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-2">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-600">Email</div>
              <input
                value={quote.email}
                onChange={(e) => setQuote((p) => ({ ...p, email: e.target.value }))}
                type="email"
                className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-300"
                placeholder="you@email.com"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-600">Phone / WhatsApp</div>
            <input
              value={quote.phone}
              onChange={(e) => setQuote((p) => ({ ...p, phone: e.target.value }))}
              className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-300"
              placeholder="+1 555 123 4567"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-2">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-600">Tour date</div>
              <input
                value={quote.date}
                onChange={(e) => setQuote((p) => ({ ...p, date: e.target.value }))}
                type="date"
                className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-300"
              />
            </label>
            <label className="grid gap-2">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-600">Number of guests</div>
              <input
                value={quote.guests}
                onChange={(e) => setQuote((p) => ({ ...p, guests: e.target.value }))}
                inputMode="numeric"
                className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-300"
                placeholder="9"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-600">Message (optional)</div>
            <textarea
              value={quote.message}
              onChange={(e) => setQuote((p) => ({ ...p, message: e.target.value }))}
              className="w-full min-h-[96px] rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-300"
              placeholder="Pickup location, special occasion, what you want to do…"
            />
          </label>

          {quote.error ? <div className="text-sm text-red-700">{quote.error}</div> : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              disabled={quote.submitting || !canSubmit}
              onClick={() => void submit()}
              className="h-12 rounded-2xl bg-amber-400 text-slate-950 font-black border border-black/10 hover:brightness-105 transition disabled:opacity-50"
            >
              {quote.submitting ? 'Submitting…' : 'Submit Quote Request'}
            </button>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('lia:open'));
              }}
              className="h-12 rounded-2xl border border-slate-200 bg-white text-slate-900 font-extrabold hover:bg-slate-50 transition"
            >
              Chat with Lia
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 rounded-2xl bg-emerald-500 text-white font-extrabold hover:brightness-105 transition flex items-center justify-center"
            >
              WhatsApp Direct
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TourInteractivePortals({
  tour,
  addOns,
  pricingSlotId = 'tour-pricing-slot',
  addOnsSlotId = 'tour-addons-slot',
}: {
  tour: Tour;
  addOns: TourAddOn[];
  pricingSlotId?: string;
  addOnsSlotId?: string;
}) {
  const [pricingSlot, setPricingSlot] = useState<HTMLElement | null>(null);
  const [addOnsSlot, setAddOnsSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const checkElements = () => {
      const pricing = document.getElementById(pricingSlotId);
      const addons = document.getElementById(addOnsSlotId);

      if (pricing) setPricingSlot(pricing);
      if (addons) setAddOnsSlot(addons);
    };

    checkElements();
    const timer = setTimeout(checkElements, 100);
    return () => clearTimeout(timer);
  }, [pricingSlotId, addOnsSlotId]);

  return (
    <TourLandingLightProvider tour={tour} addOns={addOns}>
      {pricingSlot ? createPortal(<TourPricingPanel />, pricingSlot) : null}
      {addOnsSlot ? createPortal(<TourAddOnsPanel />, addOnsSlot) : null}
      <NinePlusGuestsModal />
      <TourMobileSummaryBar />
    </TourLandingLightProvider>
  );
}

export default function TourLandingLightClient(props: {
  tour: Tour;
  addOns: TourAddOn[];
  children: React.ReactNode;
}) {
  return (
    <TourLandingLightProvider tour={props.tour} addOns={props.addOns}>
      {props.children}
    </TourLandingLightProvider>
  );
}
