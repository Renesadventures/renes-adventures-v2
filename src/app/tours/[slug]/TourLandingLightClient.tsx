'use client';

import Image from 'next/image';
import Link from 'next/link';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Anchor,
  Calendar,
  ChevronDown,
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

export function SafeImage({ src, alt, className, sizes, height, overlay }: { src: string; alt: string; className?: string; sizes?: string; height?: string; overlay?: boolean }) {
  const [hidden, setHidden] = useState(false);
  if (hidden || !src) return null;
  return (
    <div className={`relative ${height || 'h-44'} w-full`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={className || 'object-cover'}
        sizes={sizes || '(min-width: 768px) 33vw, 100vw'}
        onError={() => setHidden(true)}
      />
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />}
    </div>
  );
}

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
  tour,
  lowestPrice,
  fallbackImages,
  heroMedia,
}: {
  tour: Tour;
  lowestPrice: number;
  fallbackImages: string[];
  heroMedia?: { video: string; images: string[] } | null;
}) {
  const heroImage = fallbackImages?.[0] || tour.imageUrl;
  const hasVideo = heroMedia && heroMedia.video;
  const heroImages = heroMedia?.images || [];

  // State: 'video' means playing the video, number means showing that image index
  const [activeMedia, setActiveMedia] = useState<'video' | number>('video');
  const videoRef = useRef<HTMLVideoElement>(null);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      document.getElementById('tour-pricing-slot')?.scrollIntoView({ behavior: 'smooth' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const showImage = (index: number) => {
    setActiveMedia(index);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const showVideo = () => {
    setActiveMedia('video');
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section id="hero" className="relative w-full h-screen min-h-[700px] flex items-end">
      {/* VIDEO BACKGROUND */}
      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            src={heroMedia.video}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
              activeMedia === 'video' ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroImage}
          />
          {/* STATIC IMAGE WHEN THUMBNAIL SELECTED */}
          {typeof activeMedia === 'number' && heroImages[activeMedia] && (
            <img
              src={heroImages[activeMedia]}
              alt={tour.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
        </>
      ) : (
        <img
          src={heroImage}
          alt={tour.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            if (!t.dataset.fallback) {
              t.dataset.fallback = '1';
              t.src = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-o5hV6mh8JgSKnVgyD8PdcxgUYxUOd8.jpg';
            }
          }}
        />
      )}

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* PRICE BADGE (top-right) */}
      <div className="absolute top-24 right-6 z-10 bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 text-right">
        {tour.slug === 'blue-hole' ? (
          <>
            <p className="text-amber-300 text-2xl font-extrabold">Contact for Pricing</p>
            <p className="text-white/40 text-xs mt-0.5">WhatsApp or Email</p>
          </>
        ) : (
          <>
            <p className="text-white/50 text-xs uppercase tracking-widest">Starting at</p>
            <p className="text-amber-300 text-3xl font-extrabold">{formatMoney(lowestPrice)}</p>
            <p className="text-white/40 text-xs mt-0.5">Up to 4 guests</p>
          </>
        )}
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20">
        <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase
                     text-emerald-300 bg-black/50 border border-emerald-400/40
                     px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
          Adventure
        </span>

        <h1
          className="text-6xl md:text-8xl font-extrabold text-white mb-4 leading-none"
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            textShadow: '0 4px 40px rgba(0,0,0,0.9)',
          }}
        >
          {tour.title}
        </h1>

        <p
          className="text-xl md:text-2xl text-white font-medium max-w-2xl mb-8 leading-relaxed"
          style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8)' }}
        >
          {tour.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tour.features.slice(0, 4).map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-sm text-white
                                  bg-black/50 backdrop-blur-sm border border-white/20
                                  px-3 py-1.5 rounded-full font-medium"
            >
              <span className="text-emerald-400">✓</span> {item}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {['Book 1–8 guests instantly', 'Private charter', 'Native local crew'].map((b) => (
            <span
              key={b}
              className="text-xs text-white/90 bg-black/50 backdrop-blur-sm
                                  border border-white/20 px-3 py-1.5 rounded-full font-semibold"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {tour.slug === 'blue-hole' ? (
            <a
              href="https://wa.me/5016273556?text=Hi%20Ren%C3%A9%2C%20I%27m%20interested%20in%20the%20Blue%20Hole%20Adventure.%20Can%20you%20share%20pricing%20details%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full
                     bg-emerald-500 hover:bg-emerald-400 text-white
                     font-bold text-base tracking-wide transition-all duration-300
                     hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:-translate-y-0.5"
            >
              💬 Inquire on WhatsApp
            </a>
          ) : (
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full
                     bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-black
                     font-bold text-base tracking-wide transition-all duration-300
                     hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:-translate-y-0.5"
            >
              {checkoutLoading ? (
                <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
              ) : (
                '🔒 Book This Charter'
              )}
            </button>
          )}
          <Link
            href="/#adventure-grid"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full
                   bg-white/10 hover:bg-white/20 text-white font-semibold text-base
                   border border-white/30 hover:border-white/60 backdrop-blur-sm
                   transition-all duration-300"
          >
            View All Tours
          </Link>
        </div>

        {/* ━━━ THUMBNAIL STRIP: VIDEO + 4 IMAGES ━━━ */}
        {hasVideo && heroImages.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* Video thumbnail */}
            <button
              type="button"
              onClick={showVideo}
              className={`relative shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                activeMedia === 'video'
                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                  : 'border-white/30 hover:border-white/60'
              }`}
            >
              <img
                src={heroImage}
                alt="Play video"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="drop-shadow">
                  <polygon points="8,5 19,12 8,19" />
                </svg>
              </div>
              {activeMedia === 'video' && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-amber-400 font-bold bg-black/60 px-2 py-0.5 rounded-full">
                  Playing
                </div>
              )}
            </button>

            {/* 4 image thumbnails */}
            {heroImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => showImage(idx)}
                className={`relative shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  activeMedia === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/30'
                    : 'border-white/30 hover:border-white/60'
                }`}
              >
                <img
                  src={img}
                  alt={`${tour.title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
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
  bbqOn: boolean;
  bbqOverage: number;
  bbqCost: number;
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
        return copy;
      }

      if (item.id === 'beach-bbq') {
        copy[item.id] = 1;
        return copy;
      }

      // all add-ons start at guest count
      copy[item.id] = defaultQtyForSelection(item, guests);

      return copy;
    });
  };

  const bbqOn = (qtyById['beach-bbq'] || 0) > 0;
  const bbqAllowedByTour = tour.slug === 'secret-beach' || tour.slug === 'deep-sea-fishing';
  const bbqAvailable = bbqAllowedByTour;
  const bbqEnabled = bbqAvailable && bbqOn;
  const bbqBase = bbqEnabled ? 75 : 0;
  const bbqOverage = bbqEnabled ? Math.max(0, guests - includedGuests) * 25 : 0;
  const bbqCost = bbqBase + bbqOverage;

  const selectedAddOns = useMemo(() => {
    return uiAddOns
      .filter((item) => item.id !== 'beach-bbq')
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
        addOns: [
          ...selectedAddOns.map((x) => ({ title: x.item.title, qty: x.qty })),
          ...(bbqEnabled ? [{ title: 'Beach BBQ', qty: 1 }] : []),
        ],
      }),
    [bbqEnabled, day, guests, selectedAddOns, tour.title],
  );

  const basePrice = day === 'full' && tour.hasFullDay ? (tour.fullDayPrice ?? tour.price) : tour.price;
  const extraPassengerPrice =
    guests > includedGuests ? (guests - includedGuests) * additionalGuestPrice : 0;
  const standardAddOnsTotal = selectedAddOns.reduce((sum, x) => sum + x.lineTotal, 0);
  const addOnsTotal = standardAddOnsTotal + bbqCost;
  const subtotal = basePrice + extraPassengerPrice + standardAddOnsTotal + bbqCost;

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
    bbqOn: bbqEnabled,
    bbqOverage,
    bbqCost,
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
  const {
    tour,
    whatsappUrl,
    guests,
    setGuestsAndSyncAddOns,
    day,
    setDay,
    qtyById,
    setQtyFor,
    uiAddOns,
    bbqOn,
    subtotal,
    tax,
    serviceFee,
  } = useTourLanding();

  const hasBothDurations = tour.hasHalfDay && tour.hasFullDay;
  const isFullDay = day === 'full';
  const basePrice = isFullDay && tour.hasFullDay ? (tour.fullDayPrice ?? tour.price) : tour.price;
  const checkoutLabel = `${tour.title}${hasBothDurations ? ` – ${isFullDay ? 'Full Day' : 'Half Day'}` : ''}`;

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const incrementAddon = (item: AddOnUiItem) => {
    const current = qtyById[item.id] ?? 0;
    const next = current > 0 ? current + 1 : defaultQtyForSelection(item, guests);
    setQtyFor(item.id, next);
  };

  const decrementAddon = (id: string) => {
    const current = qtyById[id] ?? 0;
    setQtyFor(id, Math.max(0, current - 1));
  };

  const bbqActive = bbqOn;

  // Blue Hole special case - inquiry only, no pricing calculator
  if (tour.slug === 'blue-hole') {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#060608] p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-400 mb-2">Pricing</div>
          <div className="text-2xl font-extrabold text-white">Contact for Pricing</div>
          <p className="text-white/60 text-sm mt-2">Designed for up to 8 guests</p>
        </div>

        <a
          href="https://wa.me/5016273556?text=Hi%20Ren%C3%A9%2C%20I%27m%20interested%20in%20the%20Blue%20Hole%20Adventure.%20Can%20you%20share%20pricing%20details%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 flex items-center justify-center gap-2 transition-all mb-3"
        >
          💬 WhatsApp Us
        </a>

        <a
          href="mailto:info@renesadventures.tours?subject=Blue%20Hole%20Inquiry"
          className="w-full rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold py-3 flex items-center justify-center gap-2 transition-all"
        >
          ✉️ Email Us
        </a>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-white/40 text-xs text-center">
            Full-day adventure to one of the world&apos;s most iconic dive sites
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#060608] p-6 shadow-2xl">
      {hasBothDurations && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setDay('half')}
            className={`py-2 rounded-xl text-sm font-semibold transition-all ${
              !isFullDay ? 'bg-amber-400 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Half Day
          </button>
          <button
            type="button"
            onClick={() => setDay('full')}
            className={`py-2 rounded-xl text-sm font-semibold transition-all ${
              isFullDay ? 'bg-amber-400 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Full Day
          </button>
        </div>
      )}

      <div className="flex items-center justify-between py-3 border-b border-white/10 mb-3">
        <span className="text-white/70 text-sm">Guests</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGuestsAndSyncAddOns(Math.max(1, guests - 1))}
            className="w-6 h-6 rounded-full border border-white/20 text-white hover:border-white/40 flex items-center justify-center text-sm"
          >
            −
          </button>
          <span className="text-white font-bold w-4 text-center">{guests}</span>
          <button
            type="button"
            onClick={() => setGuestsAndSyncAddOns(Math.min(8, guests + 1))}
            className="w-6 h-6 rounded-full border border-white/20 text-white hover:border-white/40 flex items-center justify-center text-sm"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between text-sm font-bold text-white mb-1">
        <span className="min-w-0 truncate">{checkoutLabel}</span>
        <span>{formatMoney(basePrice)}</span>
      </div>

      {guests > 4 && (
        <div className="flex justify-between text-sm text-white/70 mt-1">
          <span>Additional Guests ({guests - 4} @ $75.00)</span>
          <span>{formatMoney(Math.max(0, guests - 4) * 75)}</span>
        </div>
      )}

      {uiAddOns
        .filter((a) => a.id !== 'beach-bbq')
        .map((a) => {
          const qty = qtyById[a.id] ?? 0;
          return (
            <div
              key={a.id}
              className={`flex items-center justify-between gap-2 py-1.5 transition-opacity ${
                qty > 0 ? 'opacity-100' : 'opacity-30 hover:opacity-60'
              }`}
            >
              <span className="text-xs text-white/70 flex-1 min-w-0 truncate">
                {qty > 0 && <span className="text-emerald-400 mr-1">✓</span>}
                {a.title}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => decrementAddon(a.id)}
                  className="w-5 h-5 rounded-full border border-white/20 text-white/60 hover:text-white flex items-center justify-center text-xs"
                >
                  −
                </button>
                <span className="text-white text-xs w-4 text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => incrementAddon(a)}
                  className="w-5 h-5 rounded-full border border-white/20 text-white/60 hover:text-white flex items-center justify-center text-xs"
                >
                  +
                </button>
                <span className="text-white/60 text-xs w-14 text-right">
                  {qty > 0 ? formatMoney(a.price * qty) : `$${a.price}`}
                </span>
              </div>
            </div>
          );
        })}

      {bbqActive && (
        <>
          <div className="flex justify-between text-sm text-white/70 mt-1">
            <span>
              <span className="text-emerald-400">✓</span> Beach BBQ (up to 4 guests)
            </span>
            <span>$75.00</span>
          </div>
          {guests > 4 && (
            <div className="flex justify-between text-sm text-white/50 mt-1">
              <span className="pl-3">Extra guests ({guests - 4} @ $25.00)</span>
              <span>{formatMoney((guests - 4) * 25)}</span>
            </div>
          )}
        </>
      )}

      <div className="border-t border-white/10 mt-3 pt-3 space-y-1">
        <div className="flex justify-between text-sm text-white/60">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-white/60">
          <span>Tax (12.5%)</span>
          <span>{formatMoney(tax)}</span>
        </div>
        <div className="flex justify-between text-sm text-white/60">
          <span>Service Fee (6%)</span>
          <span>{formatMoney(serviceFee)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={checkoutLoading}
        className="mt-4 w-full rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-black font-bold py-3 flex items-center justify-center gap-2 transition-all"
      >
        {checkoutLoading ? (
          <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
        ) : (
          <>🔒 Book This Charter</>
        )}
      </button>

      <div className="mt-3 space-y-1.5">
        {['Bank-level encryption', 'All major cards accepted', 'Instant confirmation'].map((t) => (
          <div key={t} className="flex items-center gap-2 text-xs text-white/40">
            <span className="text-emerald-400">✓</span>
            {t}
          </div>
        ))}
      </div>

      {guests >= 8 && (
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-2">
          <p className="text-white/40 text-xs">Travelling with 9 or more?</p>
          <a
            href="https://wa.me/5016273556"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center px-4 py-2.5 rounded-xl border border-white/20
                   text-white/70 hover:text-white hover:border-white/40 text-sm
                   font-semibold transition-all bg-white/5 hover:bg-white/10"
          >
            Get Custom Quote →
          </a>
        </div>
      )}
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
  const { tour, day, uiAddOns, qtyById, setQtyFor, guests, bbqOn, bbqCost, basePrice, extraPassengerPrice, addOnsTotal, subtotal, tax, serviceFee, estimatedTotal } = useTourLanding();

  const bbqAddon = uiAddOns.find((a) => a.id === 'beach-bbq');
  const bbqAllowedByTour = tour.slug === 'secret-beach' || tour.slug === 'deep-sea-fishing';
  const isFullDay = day === 'full';
  const bbqAvailable = bbqAllowedByTour;
  const bbqHidden = !bbqAvailable || tour.slug === 'sunset-cruise' || tour.slug === 'blue-hole' || tour.slug === 'blue-hole-adventure';

  const toggleBBQ = () => {
    const next = (qtyById['beach-bbq'] || 0) > 0 ? 0 : 1;
    setQtyFor('beach-bbq', next);
  };

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
          {tour.slug === 'custom-charter' ? (
            isFullDay ? (
              <div className="min-w-[290px] shrink-0 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-2 text-sm text-emerald-800">
                  <span>✓</span>
                  <span>
                    <strong>Beach BBQ included</strong> with your Full Day charter — fresh catch, lobster &amp; conch when in season, ceviche, and local sides.
                  </span>
                </div>
              </div>
            ) : (
              <div className="min-w-[290px] shrink-0 rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-slate-500 text-sm italic">
                  Beach BBQ is not available on Half Day charters due to time constraints.
                </p>
              </div>
            )
          ) : null}

          {!bbqHidden && bbqAddon ? (
            <div className="w-[290px] shrink-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
                      <AddOnIcon name={bbqAddon.icon} className="h-5 w-5 text-white" />
                    </span>
                    <div className="font-extrabold text-slate-900 text-sm leading-tight">{bbqAddon.title}</div>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">$75 base + $25 / guest over 4</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Total</div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">{bbqOn ? formatMoney(bbqCost) : formatMoney(75)}</div>
                </div>
              </div>

              {bbqOn && tour.slug === 'deep-sea-fishing' ? (
                <div className="mt-3 flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <span>ℹ️</span>
                  <span>Beach BBQ available as add-on. Your captain will confirm details.</span>
                </div>
              ) : null}

              <button
                type="button"
                onClick={toggleBBQ}
                className={[
                  'mt-4 w-full py-2 rounded-xl text-sm font-bold transition-all',
                  bbqOn
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                    : 'bg-white/5 border border-slate-200 text-slate-700 hover:bg-slate-50',
                ].join(' ')}
              >
                {bbqOn ? '✓ BBQ Added' : 'Add Beach BBQ'}
              </button>

              {bbqOn && guests > 4 ? (
                <p className="text-xs text-emerald-700 text-center mt-2">
                  $75 base + {guests - 4} guests × $25 = {formatMoney(bbqCost)}
                </p>
              ) : null}
            </div>
          ) : null}

          {uiAddOns
            .filter((item) => item.id !== 'beach-bbq')
            .map((item) => (
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
    bbqOn,
    bbqOverage,
    bbqCost,
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
  const moneyWithCents = (amount: number) =>
    `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
            {bbqOn ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-extrabold text-emerald-900 text-sm">
                      <span className="text-emerald-600">✓</span> Beach BBQ (up to 4 guests)
                    </div>
                  </div>
                  <div className="font-extrabold text-emerald-900 text-sm">{moneyWithCents(75)}</div>
                </div>
                {bbqOverage > 0 ? (
                  <div className="mt-1 flex items-start justify-between gap-3 text-sm">
                    <div className="text-emerald-900/70 pl-3">
                      Extra guests ({guests - 4} @ {moneyWithCents(25)})
                    </div>
                    <div className="font-extrabold text-emerald-900/80">{moneyWithCents(bbqOverage)}</div>
                  </div>
                ) : null}

                {tour.slug === 'deep-sea-fishing' ? (
                  <div className="mt-2 flex items-start gap-2 text-xs text-amber-700">
                    <span>⚠️</span>
                    <span>Adding BBQ will reduce fishing time. Your captain will confirm details.</span>
                  </div>
                ) : null}

                <div className="mt-2 text-xs text-emerald-800">BBQ Total: {moneyWithCents(bbqCost)}</div>
              </div>
            ) : null}

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
            ) : !bbqOn ? (
              <div className="text-sm text-slate-600">No add-ons selected yet.</div>
            ) : null}
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
