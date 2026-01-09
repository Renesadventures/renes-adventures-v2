'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { TourActivity } from '@/data/tours';
import assetManifest from '@/data/asset-manifest.json';

type MediaSet = {
  images: string[];
  videoUrl: string;
};

function score(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function pickMediaForActivity(activity: TourActivity): MediaSet {
  const allImages = Array.isArray(assetManifest.images)
    ? (assetManifest.images.filter((s) => typeof s === 'string') as string[])
    : [];

  const keywords = (activity.keywords || []).map((k) => k.toLowerCase());

  const renesOnly = allImages.filter((src) => src.includes('/images/renes-activities/'));

  const matches = (src: string) => {
    const s = src.toLowerCase();
    return keywords.some((k) => s.includes(k));
  };

  const pool = renesOnly.filter(matches);
  const finalPool = pool.length ? pool : renesOnly.length ? renesOnly : allImages;

  const sorted = finalPool
    .map((src) => ({ src, score: score(`${activity.id}|${src}`) }))
    .sort((a, b) => a.score - b.score)
    .map((x) => x.src);

  const selected = sorted.slice(0, 5);

  return {
    images: selected.length ? selected : ['/images/tours/full-day-ultimate.jpg'],
    videoUrl: activity.videoUrl,
  };
}

export default function CustomAdventureActivities({ activities }: { activities: TourActivity[] }) {
  const [selectedId, setSelectedId] = useState<string>(activities[0]?.id || '');

  const mediaById = useMemo(() => {
    const map = new Map<string, MediaSet>();
    activities.forEach((a) => map.set(a.id, pickMediaForActivity(a)));
    return map;
  }, [activities]);

  const selectedActivity = useMemo(() => activities.find((a) => a.id === selectedId) || activities[0], [activities, selectedId]);
  const selectedMedia = selectedActivity ? mediaById.get(selectedActivity.id) : undefined;

  if (!activities.length) return null;

  return (
    <div className="mt-12 rounded-3xl border border-[#D4AF37]/20 bg-[#1E293B] p-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Build Your Day</div>
          <h3 className="mt-3 text-3xl font-bold text-[#D4AF37]">Choose 10 signature activities</h3>
          <p className="mt-3 text-[#F8FAFC]/80 max-w-2xl">Tap an activity to preview the moments you’ll actually live.</p>
        </div>

        {selectedActivity && (
          <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3">
            <div className="text-xs uppercase tracking-[0.25em] text-[#F8FAFC]/60">Selected</div>
            <div className="mt-1 text-[#F8FAFC] font-semibold">{selectedActivity.title}</div>
          </div>
        )}
      </div>

      <div className="mt-8 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="grid grid-cols-2 gap-3">
            {activities.map((activity) => {
              const active = activity.id === selectedId;
              const media = mediaById.get(activity.id);
              const thumb = media?.images?.[0] || '/images/tours/full-day-ultimate.jpg';

              return (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => setSelectedId(activity.id)}
                  className={`group text-left rounded-2xl border overflow-hidden transition-all ${
                    active
                      ? 'border-[#D4AF37]/70 ring-2 ring-[#D4AF37]/30'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="relative w-full aspect-video bg-black">
                    <Image
                      src={thumb}
                      alt={activity.title}
                      fill
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 20vw, 45vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-white/70">Activity</div>
                      <div className="mt-1 text-sm font-semibold text-white leading-snug line-clamp-2">{activity.title}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7">
          {selectedActivity && (
            <div>
              <div className="rounded-3xl border border-white/10 bg-black/10 overflow-hidden">
                <div className="relative w-full aspect-video bg-black">
                  {selectedMedia?.videoUrl ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      poster={selectedMedia.images[0]}
                    >
                      <source src={selectedMedia.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <Image src={selectedMedia?.images[0] || '/images/tours/full-day-ultimate.jpg'} alt={selectedActivity.title} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
                  )}
                </div>

                <div className="p-6">
                  <div className="text-[#F8FAFC]/80">{selectedActivity.description}</div>

                  <div className="mt-5 grid grid-cols-5 gap-2">
                    {(selectedMedia?.images || []).slice(0, 5).map((src) => (
                      <div key={src} className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/20">
                        <Image src={src} alt={selectedActivity.title} fill className="object-cover" sizes="100px" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
