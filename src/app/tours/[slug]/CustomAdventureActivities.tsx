'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { TourActivity } from '@/data/tours';
import assetManifest from '@/data/asset-manifest.json';

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

type MediaSet = {
  images: string[];
  videoUrl: string;
};

function formatMonthDay(mmdd: string) {
  const [mm, dd] = mmdd.split('-').map((x) => Number(x));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[Math.max(1, Math.min(12, mm)) - 1] || mmdd;
  if (!Number.isFinite(dd) || dd <= 0) return monthName;
  return `${monthName} ${dd}`;
}

function formatSeasonRange(startMonthDay: string, endMonthDay: string) {
  return `${formatMonthDay(startMonthDay)} - ${formatMonthDay(endMonthDay)}`;
}

function getSeasonLabel(activityId: string, startMonthDay?: string, endMonthDay?: string) {
  if (activityId === 'lobster-mission') return 'June 15 - Feb 14';
  if (activityId === 'conch-hunt') return 'Oct 1 - June 30';
  if (!startMonthDay || !endMonthDay) return undefined;
  return formatSeasonRange(startMonthDay, endMonthDay);
}

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

  const renesOnly = allImages.filter((src) => src.includes(`${base}/images/renes-activities/`));

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
    images: selected.length ? selected : [`${base}/images/tours/full-day-ultimate.jpg`],
    videoUrl: activity.videoUrl,
  };
}

export default function CustomAdventureActivities({ activities }: { activities: TourActivity[] }) {
  const visibleActivities = useMemo(() => activities.slice(0, 10), [activities]);
  const [selectedId, setSelectedId] = useState<string>(visibleActivities[0]?.id || '');

  const mediaById = useMemo(() => {
    const map = new Map<string, MediaSet>();
    visibleActivities.forEach((a) => map.set(a.id, pickMediaForActivity(a)));
    return map;
  }, [visibleActivities]);

  const selectedActivity = useMemo(
    () => visibleActivities.find((a) => a.id === selectedId) || visibleActivities[0],
    [visibleActivities, selectedId]
  );
  const selectedMedia = selectedActivity ? mediaById.get(selectedActivity.id) : undefined;

  if (!visibleActivities.length) return null;

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
            {visibleActivities.map((activity) => {
              const active = activity.id === selectedId;
              const media = mediaById.get(activity.id);
              const thumb = media?.images?.[0] || `${base}/images/tours/full-day-ultimate.jpg`;
              const seasonLabel = activity.season
                ? getSeasonLabel(activity.id, activity.season.startMonthDay, activity.season.endMonthDay)
                : undefined;

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
                    {seasonLabel && (
                      <div className="absolute top-3 left-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-black/40 backdrop-blur px-3 py-1">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">Seasonal</span>
                          <span className="text-[10px] text-white/80">{seasonLabel}</span>
                        </div>
                      </div>
                    )}
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
                    <Image src={selectedMedia?.images[0] || `${base}/images/tours/full-day-ultimate.jpg`} alt={selectedActivity.title} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
                  )}
                </div>

                <div className="p-6">
                  <div className="text-[#F8FAFC]/80">{selectedActivity.description}</div>

                  {selectedActivity.note && (
                    <div className="mt-5 rounded-2xl border-2 border-[#D4AF37]/60 bg-black/30 p-4">
                      <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-bold">Note</div>
                      <div className="mt-2 text-sm text-white font-bold leading-relaxed">{selectedActivity.note}</div>
                    </div>
                  )}

                  {selectedActivity.season && (
                    <div className="mt-5 rounded-2xl border border-[#D4AF37]/25 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/90 font-bold">Seasonal</div>
                      <div className="mt-2 text-sm text-[#F8FAFC]/80">{getSeasonLabel(selectedActivity.id, selectedActivity.season.startMonthDay, selectedActivity.season.endMonthDay)}</div>
                    </div>
                  )}

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
