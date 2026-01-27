'use client';

import Link from 'next/link';

export default function StoryWall() {
  const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

  const stories = [
    {
      id: 'deep-sea',
      title: 'Deep Sea Highlights',
      video: `${base}/hero/deep-sea-fIshing.mp4`,
      href: '/tours/deep-sea-fishing',
    },
    {
      id: 'sunset',
      title: 'Sunset Ritual',
      video: `${base}/hero/sunset-ritual.mp4`,
      href: '/tours/sunset-cruise',
    },
    {
      id: 'custom',
      title: 'Custom Adventure',
      video: `${base}/hero/renes-custom-adventures.mp4`,
      href: '/tours/custom-charter',
    },
  ];

  return (
    <section className="w-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Story Wall</div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-serif tracking-tight text-white">Belize in motion</h2>
            <p className="mt-2 text-sm sm:text-base text-white/75">Vertical-style reels. Tap to explore the full tour.</p>
          </div>
          <Link
            href="/tours"
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/35"
          >
            View all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="group overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-all duration-300 hover:shadow-[0_22px_70px_rgba(245,158,11,0.20)]"
            >
              <div className="relative aspect-[9/16]">
                <video
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <source src={s.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute left-5 right-5 bottom-5">
                  <div className="text-white">
                    <div className="text-xs font-semibold uppercase tracking-[0.35em] text-white/65">Now Playing</div>
                    <div className="mt-2 text-xl font-extrabold tracking-tight">{s.title}</div>
                  </div>
                  <div className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-black">
                    Watch Tour
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
