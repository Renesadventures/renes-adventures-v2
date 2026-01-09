'use client';

import Image from 'next/image';
import { tours } from '@/data/tours';
import { useSound } from '@/components/audio/SoundProvider';
import { buildWhatsAppTourLink } from '@/lib/utils/whatsapp-link';

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US')}`;
}

function getAltText(title: string) {
  return `${title} tour in Belize - Rene's Adventures`;
}

export default function TourCards() {
  const { playSfx } = useSound();

  return (
    <section id="tours" className="py-24 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Experiences</div>
          <h2 className="mt-4 text-4xl md:text-6xl font-light text-white tracking-tight">
            Choose Your
            <span className="block font-serif italic text-[#D4AF37]">Belize Adventure</span>
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-3xl mx-auto font-light">
            Offshore to reef to sunset—premium days on the water with Captain René.
          </p>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tours.map((tour) => (
            <article
              key={tour.id}
              onMouseEnter={() => {
                if (tour.slug === 'deep-sea-fishing' || tour.slug === 'reef-fishing') playSfx('reel_click');
                else if (tour.slug === 'sunset-cruise') playSfx('champagne_pop');
                else playSfx('wind');
              }}
              className="group rounded-3xl overflow-hidden border border-white/15 bg-white/5 shadow-2xl hover:border-[#D4AF37]/35 transition-all"
            >
              <div className="relative overflow-hidden aspect-[16/9]">
                <Image
                  src={tour.imageUrl}
                  alt={getAltText(tour.title)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority={false}
                />

                <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/45 border border-white/15 text-white/85 text-xs uppercase tracking-[0.25em]">
                  {tour.duration}
                </div>
              </div>

              <div className="p-7">
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">{tour.title}</h3>

                <p className="text-base text-white/70 leading-relaxed mb-5">{tour.description}</p>

                {/* Pricing Section */}
                <div className="flex justify-between items-start mb-5 pb-5 border-b border-white/10">
                  <div>
                    <div className="text-3xl font-extrabold text-[#D4AF37]">{formatMoney(tour.price)}</div>
                    {tour.priceFullDay && (
                      <div className="text-sm text-white/70 mt-1">
                        Full Day: {formatMoney(tour.priceFullDay)}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm text-white/70">
                    <div className="font-medium text-white/80">Up to {tour.includedGuests ?? tour.baseGuests} guests</div>
                    <div className="text-white/60">+ {formatMoney(tour.additionalGuestPrice ?? tour.extraGuestFee)} / guest (5–8)</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const url = buildWhatsAppTourLink({ tourName: tour.title });
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="flex-1 text-center bg-[#D4AF37] text-slate-950 font-extrabold px-6 py-3 rounded-xl border border-white/10 hover:brightness-110 transition"
                  >
                    Book This Adventure
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent('lia:open', {
                          detail: { message: `Tell me about ${tour.title}` }
                        })
                      );
                    }}
                    className="flex-1 border border-white/20 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/15 transition"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
