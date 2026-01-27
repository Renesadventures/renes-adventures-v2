'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function VesselShowcase() {
  const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 overflow-hidden ring-1 ring-slate-200 shadow-[0_22px_80px_rgba(15,23,42,0.14)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[380px]">
              <Image
                src={`${base}/images/renes-activities/luxury-vacation-cook-islands-south-pacific-oce-2025-03-18-14-51-35-utc.jpg`}
                alt="Rene's boat"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            </div>

            <div className="p-6 sm:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/65">Vessel Showcase</div>
              <h2 className="mt-4 text-3xl sm:text-5xl font-serif tracking-tight text-white">Your private ride</h2>
              <p className="mt-3 max-w-xl text-sm sm:text-base text-white/80">
                Comfortable seating, shade, and the gear you need to make the day effortless.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/85">
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Capacity</div>
                  <div className="mt-2 text-lg font-extrabold text-white">Up to 8 guests</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/85">
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Setup</div>
                  <div className="mt-2 text-lg font-extrabold text-white">Custom day routes</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/tours/custom-charter"
                  className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm sm:text-base font-semibold text-black shadow-lg shadow-amber-500/20 transition-colors duration-300 hover:bg-amber-400"
                >
                  Book the boat
                </Link>
                <Link
                  href="/tours"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/10 hover:border-white/35"
                >
                  See tours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
