'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Users, 
  Clock, 
  Star,
  Shield
} from 'lucide-react';
import { Tour } from '@/data/tours';
import { buildWhatsAppTourLink } from '@/lib/utils/whatsapp-link';

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

type TourLandingTemplateProps = {
  tour: Tour;
  relatedTours?: Tour[];
};

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TourLandingTemplate({ tour, relatedTours = [] }: TourLandingTemplateProps) {
  const [duration, setDuration] = useState<'half' | 'full'>('half');
  const [guests, setGuests] = useState(4);

  const basePrice = useMemo(() => {
    if (duration === 'full' && tour.priceFullDay) return tour.priceFullDay;
    return tour.price;
  }, [duration, tour]);

  const effectiveGuests = useMemo(() => Math.max(1, Math.min(guests, tour.maxGuests)), [guests, tour.maxGuests]);
  const overageGuests = useMemo(() => Math.max(0, effectiveGuests - tour.includedGuests), [effectiveGuests, tour.includedGuests]);
  const overageCost = useMemo(() => overageGuests * tour.additionalGuestPrice, [overageGuests, tour.additionalGuestPrice]);
  const liveTotal = useMemo(() => basePrice + overageCost, [basePrice, overageCost]);

  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onOpenLia = (message: string) => {
    window.dispatchEvent(new CustomEvent('lia:open', { detail: { message } }));
  };

  const onOpenWhatsApp = () => {
    const url = buildWhatsAppTourLink({ tourName: tour.title });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Media paths (placeholder structure - we'll upload real media later)
  const heroVideo = `${base}/hero/${tour.slug}.mp4`;
  const heroImage = `${base}${tour.imageUrl}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0FDFF] via-white to-[#FFF7ED] text-slate-900">
      {/* SECTION 1: HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={tour.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          
          <video
            src={heroVideo}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-white" />
        </div>

        <div className="relative mx-auto w-full max-w-screen-2xl px-4 pt-24 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Tour Info */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-2 text-white backdrop-blur-md">
                <Star className="h-4 w-4" />
                <span className="text-xs uppercase tracking-[0.3em]">{tour.slug}</span>
              </div>

              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                {tour.title}
              </h1>
              <p className="mt-4 text-lg md:text-2xl text-white/90 max-w-2xl">
                {tour.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{tour.duration}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Up to {tour.maxGuests} guests</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <Star className="h-4 w-4 text-amber-300" />
                    <span className="text-sm">4.9 Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-5 md:p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.35em] text-white/80">Starting at</div>
                    <div className="mt-2 text-4xl font-extrabold text-amber-300">{formatMoney(tour.price)}</div>
                    {tour.priceFullDay && (
                      <div className="mt-1 text-sm text-white/85">Full day: {formatMoney(tour.priceFullDay)}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.35em] text-white/80">Capacity</div>
                    <div className="mt-2 text-sm font-semibold text-white">Up to {tour.maxGuests} guests</div>
                    <div className="mt-1 text-sm text-white/85">{tour.includedGuests} included</div>
                  </div>
                </div>

                {tour.priceFullDay && (
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
                )}

                <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.35em] text-white/80">Guests</div>
                      <div className="mt-1 text-sm text-white/85">Includes {tour.includedGuests}. Extra: ${tour.additionalGuestPrice}.</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="h-10 w-10 rounded-full border border-white/25 bg-white/10 text-white font-black hover:bg-white/15 transition"
                      >
                        −
                      </button>
                      <div className="min-w-[54px] text-center">
                        <div className="text-2xl font-extrabold text-white">{effectiveGuests}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(tour.maxGuests, g + 1))}
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
                    Book on WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenLia(`I'm interested in booking ${tour.title}.`)}
                    className="h-14 rounded-2xl border border-white/30 bg-white/10 text-white font-extrabold text-sm uppercase tracking-[0.25em] hover:bg-white/15 transition"
                  >
                    Talk to Lia
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHAT'S INCLUDED */}
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">What&apos;s Included</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Everything You Need</h2>
          <p className="mt-4 text-lg text-slate-700">Show up. We handle the rest.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {tour.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900">{feature}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: EXPERIENCE GALLERY */}
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">The Experience</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">See It. Feel It. Book It.</h2>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="relative aspect-square rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <Image
                src={`${base}/images/tours/${tour.slug}-gallery-${num}.jpg`}
                alt={`${tour.title} experience ${num}`}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: WHY BOOK WITH RENE */}
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-16">
        <div className="rounded-[2.5rem] border border-amber-200 bg-amber-50 p-8 md:p-10">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-3xl bg-white border border-amber-200 flex items-center justify-center text-amber-800">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-amber-800">The Rene&apos;s Difference</div>
              <h2 className="mt-3 text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Weh Di Sea Call. We Ansah.
              </h2>
              <p className="mt-4 text-lg text-slate-800 leading-relaxed">
                25 years of local knowledge. Generational fishing wisdom. Pure Belizean hospitality.
                Captain Rene doesn&apos;t just take you fishing—he brings you into his waters, his stories, his home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS */}
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Guest Stories</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Days That Stick</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah L.', quote: 'Best day in Belize. Captain Rene made it unforgettable.' },
            { name: 'Mike & Emma', quote: 'The fish, the food, the vibes—all perfect.' },
            { name: 'Carlos R.', quote: 'Pure Belize. Pure magic. We\'ll be back.' },
          ].map((testimonial, idx) => (
            <article key={idx} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="relative h-40">
                <Image
                  src={`${base}/images/testimonials/${tour.slug}-${idx + 1}.jpg`}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute left-5 bottom-4">
                  <div className="text-white font-extrabold">{testimonial.name}</div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-amber-300">★★★★★</div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-slate-800 font-extrabold">&quot;{testimonial.quote}&quot;</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 6: BOOK NOW CTA */}
      <section className="mx-auto w-full max-w-screen-2xl px-4 pb-28">
        <div className="rounded-[2.5rem] border border-sky-200 bg-sky-50 p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Ready to Book Your Adventure?
          </h2>
          <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
            Tek Yuh Time. Live Yuh Day. Your perfect Belize experience starts here.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenWhatsApp}
              className="h-14 px-8 rounded-2xl bg-amber-500 text-slate-950 font-black text-lg border border-black/10 hover:brightness-105 transition"
            >
              Book on WhatsApp
            </button>
            <button
              type="button"
              onClick={() => onOpenLia(`I want to book ${tour.title}.`)}
              className="h-14 px-8 rounded-2xl border border-slate-200 bg-white font-extrabold text-sm uppercase tracking-[0.25em] hover:bg-slate-50 transition"
            >
              Talk to Lia
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7: RELATED TOURS */}
      {relatedTours.length > 0 && (
        <section className="mx-auto w-full max-w-screen-2xl px-4 pb-28">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.35em] text-sky-700">More Adventures</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Keep Exploring</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTours.map((t) => (
              <Link
                key={t.slug}
                href={`/tours/${t.slug}`}
                className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative h-44">
                  <Image
                    src={`${base}${t.imageUrl}`}
                    alt={t.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
                    sizes="(min-width: 1024px) 25vw, 100vw"
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
      )}

      {/* Sticky Booking Bar */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 transition-transform duration-300 ${
          stickyVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 pb-4">
          <div className="rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-lg px-6 py-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">{tour.title}</div>
                  <div className="text-xs text-slate-600">Live Total: {formatMoney(liveTotal)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenLia(`I'm interested in ${tour.title}`)}
                  className="h-12 px-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition font-extrabold text-sm uppercase tracking-[0.18em] text-slate-900"
                >
                  Talk to Lia
                </button>

                <button
                  type="button"
                  onClick={onOpenWhatsApp}
                  className="h-12 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 transition font-black text-slate-950 border border-black/10"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
