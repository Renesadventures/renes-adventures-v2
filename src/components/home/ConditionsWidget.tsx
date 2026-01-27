'use client';

import Link from 'next/link';

export default function ConditionsWidget() {
  return (
    <section className="w-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Captain&apos;s Choice</div>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif tracking-tight text-white">What&apos;s best today?</h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/75">
            We&apos;ll match the day&apos;s conditions to the perfect adventure.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tours/custom-charter"
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm sm:text-base font-semibold text-black shadow-lg shadow-amber-500/20 transition-colors duration-300 hover:bg-amber-400"
            >
              Build a Custom Charter
            </Link>
            <Link
              href="/tours"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/10 hover:border-white/35"
            >
              Browse all tours
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
