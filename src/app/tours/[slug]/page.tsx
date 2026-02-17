/**
 * TOUR LANDING PAGE TEMPLATE
 *
 * ⚠️ STRUCTURE IS LOCKED ⚠️
 *
 * This template is based on Reef Fishing page.
 *
 * ALLOWED CHANGES:
 * - Tour content (descriptions, titles)
 * - Images/videos (URLs, captions)
 * - Pricing (amounts, add-ons)
 *
 * NOT ALLOWED:
 * - Section order
 * - Layout structure
 * - Component hierarchy
 * - Add/remove sections
 *
 * Template locked: 2025-02-08
 * Reference: /tours/reef-fishing
 */

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  Anchor,
  Camera,
  Fish,
  PartyPopper,
  ShieldCheck,
  FileText,
  Shirt,
  Sun,
  User,
  Utensils,
  Waves,
} from 'lucide-react';
import { tours, itineraryActivitiesBySlug } from '@/data/tours';
import { TOUR_ADDONS } from '@/data/tour-addons';
import { TourGuestGallery, TourHeroMedia, TourInteractivePortals } from './TourLandingLightClient';

const TOUR_VIDEOS: Record<string, string> = {
  'deep-sea-fishing': 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/hero/deep-sea-fishing.mp4',
  'sunset-cruise': 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/hero/sunset-ritual.mp4',
  'blue-hole': 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/luxury/Secrete Beach 5.mp4',
  'secret-beach': 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/hero/secret-beach.mp4',
  'custom-adventure-bbq': 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/hero/beach-bbq.mp4',
};

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

/**
 * 🔒 STANDARDIZED ICON MAPPING
 * Each category ALWAYS uses the same icon, regardless of tour.
 */
function itemIconFor(text: string) {
  const lower = text.toLowerCase();

  // CREW/PEOPLE/GUIDES - ALWAYS User icon (blue gradient)
  if (
    lower.includes('crew') ||
    lower.includes('captain') ||
    lower.includes('experienced') ||
    lower.includes('guide') ||
    lower.includes('instructor')
  ) {
    return { Icon: User, gradient: 'from-blue-400 to-blue-600' };
  }

  // FISHING GEAR/BAIT/TACKLE - ALWAYS Fish icon (indigo/purple gradient)
  if (
    lower.includes('bait') ||
    lower.includes('license') ||
    lower.includes('tackle') ||
    lower.includes('rod') ||
    lower.includes('reel') ||
    lower.includes('gear') ||
    lower.includes('fishing equipment')
  ) {
    return { Icon: Fish, gradient: 'from-indigo-400 to-purple-600' };
  }

  // SNORKELING/WATER ACTIVITIES - ALWAYS Waves icon (cyan gradient)
  if (lower.includes('snorkel') || lower.includes('mask') || lower.includes('fins') || lower.includes('world-class site')) {
    return { Icon: Waves, gradient: 'from-cyan-400 to-teal-600' };
  }

  // FOOD/DRINKS/BEVERAGES - ALWAYS Utensils icon (orange/red gradient)
  if (
    lower.includes('champagne') ||
    lower.includes('wine') ||
    lower.includes('beverage') ||
    lower.includes('waterfront stop') ||
    lower.includes('crystal-clear') ||
    lower.includes('turquoise waters') ||
    lower.includes('water') ||
    lower.includes('lunch') ||
    lower.includes('snack') ||
    lower.includes('rum')
  ) {
    return { Icon: Utensils, gradient: 'from-orange-400 to-red-500' };
  }

  // SUN PROTECTION - ALWAYS Sun icon (yellow gradient)
  if (lower.includes('sunscreen') || lower.includes('reef-safe') || lower.includes('sunglasses') || lower.includes('polarized')) {
    return { Icon: Sun, gradient: 'from-yellow-400 to-amber-500' };
  }

  // CLOTHING/SWIMWEAR - ALWAYS Shirt icon (cyan gradient)
  if (lower.includes('swimwear') || lower.includes('towel') || lower.includes('swim') || lower.includes('clothing')) {
    return { Icon: Shirt, gradient: 'from-cyan-400 to-teal-500' };
  }

  // CAMERA/PHOTOS - ALWAYS Camera icon (orange/red gradient)
  if (lower.includes('camera') || lower.includes('waterproof') || lower.includes('photo')) {
    return { Icon: Camera, gradient: 'from-orange-500 to-red-600' };
  }

  // CASH/DOCUMENTS - ALWAYS FileText icon (green gradient)
  if (
    lower.includes('cash') ||
    lower.includes('card') ||
    lower.includes('some stops') ||
    lower.includes('wallet') ||
    lower.includes('id')
  ) {
    return { Icon: FileText, gradient: 'from-green-400 to-emerald-600' };
  }

  // EVERYTHING ELSE (species, locations, activities, etc.) - ALWAYS Anchor icon (gray gradient)
  return { Icon: Anchor, gradient: 'from-slate-500 to-slate-700' };
}

function GlassIcon({
  Icon,
  gradient,
}: {
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  gradient: string;
}) {
  return (
    <div
      className={`
        relative h-11 w-11 rounded-xl
        bg-gradient-to-br ${gradient}
        flex items-center justify-center
        backdrop-blur-sm bg-opacity-90
        shadow-lg shadow-black/10
        ring-1 ring-white/20
      `}
    >
      <Icon className="h-5 w-5 text-white drop-shadow-sm" strokeWidth={2.5} />
    </div>
  );
}

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const tour = tours.find((t) => t.slug === slug);
  if (!tour) notFound();

  const activities = itineraryActivitiesBySlug[slug] || [];
  const videoUrl =
    TOUR_VIDEOS[slug] ||
    activities[0]?.videoUrl ||
    'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/hero/renes-custom-adventures.mp4';

  const videoUrls =
    slug === 'deep-sea-fishing'
      ? [
          'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/hero/deep-sea-fishing.mp4',
          'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/hero/deep%20sea%20fishing.mp4',
          'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/luxury/deep-sea-fishing.mp4',
          'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/hero/renes-custom-adventures.mp4',
        ]
      : undefined;

  const highlights = tour.features.slice(0, 4);
  const addOns = TOUR_ADDONS;

  const heroKeywordsBySlug: Partial<Record<string, string[]>> = {
    'deep-sea-fishing': ['deep', 'sea', 'offshore', 'fishing', 'tuna', 'wahoo', 'dorado', 'marlin'],
    'sunset-cruise': ['sunset', 'golden', 'cruise', 'romantic'],
    'blue-hole': ['blue', 'hole', 'reef', 'snorkel', 'full', 'day'],
    'secret-beach': ['secret', 'beach', 'shallow', 'turquoise', 'bar'],
  };

  const fallbackGallery = [
    tour.imageUrl,
    '/images/tours/hol-chan-snorkel.jpg',
    '/images/tours/beach-bbq.jpg',
    '/images/tours/sunset-cruise.jpg',
    '/images/tours/full-day-ultimate.jpg',
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0FDFF] via-white to-[#FFF7ED] text-slate-900">
      <section className="relative z-0">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-white" />
        </div>

        <div className="relative mx-auto w-full max-w-screen-2xl px-4 pt-24 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-white backdrop-blur-md">
                <PartyPopper className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.3em]">Adventure</span>
              </div>

              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white">{tour.title}</h1>
              <p className="mt-4 text-lg md:text-2xl text-white/90 max-w-2xl">{tour.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {highlights.map((h) => (
                  <span
                    key={h}
                    className="px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/90 text-sm"
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white/90 text-sm backdrop-blur-md">
                  <Anchor className="h-4 w-4" /> Book 1-{tour.maxGuests} guests instantly
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white/90 text-sm backdrop-blur-md">
                  <Waves className="h-4 w-4" /> Private charter
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white/90 text-sm backdrop-blur-md">
                  <ShieldCheck className="h-4 w-4" /> Local crew
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <TourHeroMedia
              videoUrl={videoUrl}
              videoUrls={videoUrls}
              keywords={heroKeywordsBySlug[slug] || [slug]}
              fallbackImages={fallbackGallery}
            />
          </div>
        </div>
      </section>

      <TourInteractivePortals tour={tour} addOns={addOns} />

      <section className="mx-auto w-full max-w-screen-2xl px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-amber-50" />
              <div className="relative max-w-4xl">
                <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Discovery Summary</div>
                <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">A day that feels like a documentary</h2>
                <div className="mt-5 grid gap-4 text-lg text-slate-700 leading-relaxed">
                  <p>{tour.description}</p>
                </div>
              </div>
            </section>

            <div className="h-10" />

            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-sky-50" />
              <div className="relative">
                <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Why Unforgettable</div>
                <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">You feel it in your chest</h2>
                <p className="mt-5 text-lg text-slate-700 leading-relaxed">Belize hits different: private water, fewer crowds, and the kind of day you can only get with a local captain who knows where the story is hiding.</p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Golden Crew',
                      icon: ShieldCheck,
                      body: 'Local captains and mates who make the whole day feel effortless.',
                    },
                    {
                      title: 'Iconic Water',
                      icon: Waves,
                      body: 'Belize colors that look edited—but they’re real.',
                    },
                    {
                      title: 'Camera Moments',
                      icon: Camera,
                      body: 'We position you for the “wow” clip, not just the safe shot.',
                    },
                  ].map(({ title, icon: Icon, body }) => (
                    <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
                          <Icon className="h-5 w-5 text-amber-700" />
                        </span>
                        <div className="font-extrabold text-slate-900">{title}</div>
                      </div>
                      <div className="mt-3 text-slate-700">{body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="h-10" />

            <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-amber-50" />
              <div className="relative">
                <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Your Day. Your Boat. Your Adventure.</div>
                <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">A flow, not a script</h2>
                <p className="mt-5 text-lg text-slate-700 leading-relaxed">
                  You choose the pace. We adjust the route live—fishing, snorkeling, sandbars, food stops, island time. The best days feel effortless.
                </p>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Start',
                      body: 'Meet the crew, set the vibe, and head out into bright water.',
                    },
                    {
                      title: 'Peak',
                      body: 'Your highlights—hookups, reef time, beach bars, iconic Belize moments.',
                    },
                    {
                      title: 'Finish',
                      body: 'Slow cruise back—salt on your skin, camera roll full, already planning the next one.',
                    },
                  ].map((card, idx) => (
                    <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center font-black text-amber-700">
                          {idx + 1}
                        </div>
                        <div className="font-extrabold text-slate-900">{card.title}</div>
                      </div>
                      <div className="mt-3 text-slate-700">{card.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="h-10" />

            <TourGuestGallery
              keywords={[slug, 'fishing', 'boat', 'belize']}
              fallbackImages={[
                'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-80sj5WrGZF6Lfws1XtSJTW7tipz3D8.jpg',
                'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-o5hV6mh8JgSKnVgyD8PdcxgUYxUOd8.jpg',
                'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-30%20at%2017.18.05_2488a0f4-UQRhRgJ4vZ98QqcZtviUNwPdPwY6KR.jpg',
                'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-30%20at%2017.18.05_57c6cffb-FEp5aoFPSnxOcqe33W0kxowKxlpttk.jpg',
                'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-30%20at%2017.18.04_f96e9e3d-DSYkKcCXqNYxjOZrwOxR4ZR3cYza1i.jpg',
                'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-30%20at%2017.18.05_5ea54345-zuE5Z4SdPu1o5vpmvVL5LIQzxJlmqQ.jpg',
                'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-30%20at%2017.18.05_376ce445-1k9GtEbrF6xHmOBXIRdCttAvk35ZrZ.jpg',
                'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-30%20at%2017.18.04_d74959cd-BISF1lsEf467bUwxqD8uL52qD8iweG.jpg',
              ]}
            />

            <div className="h-10" />

            <section>
              <div id="tour-addons-slot" />
            </section>

            <div className="h-10" />

            <section className="grid md:grid-cols-2 gap-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-6">What&apos;s Included</h3>
                <ul className="space-y-4">
                  {tour.features.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <GlassIcon {...itemIconFor(item)} />
                      <div className="pt-1">
                        <div className="text-slate-800 font-semibold">{item}</div>
                        <div className="text-slate-600 text-sm">Included for a smooth, premium day.</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-4 text-sm text-slate-700">
                  <div className="font-extrabold text-slate-900">Included With All Trips</div>
                  <div className="mt-2">All trips include water, sodas, snacks, rum punch, rods, tackle, and fishing licenses.</div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-6">What to Bring</h3>
                <ul className="space-y-4">
                  {['Reef-safe sunscreen', 'Swimwear & towel', 'Polarized sunglasses', 'Waterproof camera', 'Cash/card (some stops)'].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <GlassIcon {...itemIconFor(item)} />
                      <div className="pt-1">
                        <div className="text-slate-800 font-semibold">{item}</div>
                        <div className="text-slate-600 text-sm">Small thing, big comfort upgrade.</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-4 text-sm text-slate-700">
                  <div className="font-extrabold text-slate-900">Special Requests</div>
                  <div className="mt-2">We&apos;ll do our best to accommodate all preferences. Your requests will be included when you book.</div>
                </div>
              </div>
            </section>

            <div className="h-10" />

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Pricing Information</div>
              <div className="mt-3 text-slate-700">
                All prices are for up to 4 passengers. Additional passengers are $75 USD per person (maximum 8 passengers). For groups larger than 8, please contact us for custom pricing.
              </div>
              <div className="mt-4 text-slate-700">
                From <span className="text-3xl font-black text-amber-600">{formatMoney(tour.price)}</span>
              </div>
            </section>

            <div className="h-10" />

            <section>
              <div className="max-w-3xl">
                <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Real Stories</div>
                <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Guest Experiences</h2>
              </div>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-amber-400 font-bold mb-4">★★★★★</div>
                    <div className="text-slate-800 font-semibold mb-4">“Absolutely unreal day. Private, premium, and the water looked edited.”</div>
                    <div className="text-sm text-slate-600">
                      <div className="font-extrabold text-slate-900">Guest</div>
                      <div>San Pedro, Belize</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="hidden lg:block sticky top-24">
              <div id="tour-pricing-slot" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-screen-2xl px-4">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-10 shadow-sm text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready when you are</h2>
            <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">Lock in your date, choose your upgrades, and let the crew handle the rest.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#tour-pricing-slot"
                className="h-12 px-6 rounded-2xl bg-amber-400 text-slate-950 font-black border border-black/10 hover:brightness-105 transition inline-flex items-center justify-center"
              >
                View Pricing
              </a>
              <a
                href="#tour-addons-slot"
                className="h-12 px-6 rounded-2xl border border-slate-200 bg-white text-slate-900 font-extrabold hover:bg-slate-50 transition inline-flex items-center justify-center"
              >
                Pick Add-Ons
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">More Adventures You&apos;ll Love</h2>
            <p className="mt-4 text-lg text-slate-600">Guests who chose this also chose...</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tours
              .filter((t) => t.slug !== slug)
              .filter((t) => t.slug !== 'custom-charter')
              .slice(0, 4)
              .map((t) => (
                <Link
                  key={t.slug}
                  href={`/tours/${t.slug}`}
                  className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative h-64">
                    <Image
                      src={t.imageUrl}
                      alt={t.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-extrabold text-white mb-2">{t.title}</h3>
                      <div className="text-amber-300 font-bold text-lg">From {formatMoney(t.price)}</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-700 text-sm line-clamp-2 mb-4">{t.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-slate-500">{t.duration}</span>
                      <span className="text-amber-600 font-bold">View Tour →</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
