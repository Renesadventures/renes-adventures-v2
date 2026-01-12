'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import assetManifest from '@/data/asset-manifest.json';

export type LuxuryGalleryItem = {
  src?: string;
  alt?: string;
  type?: 'image' | 'video';
  fallbackSrc?: string;
  className?: string;
};

export type LuxuryGalleryProps = {
  items?: LuxuryGalleryItem[];
  columns?: {
    base?: 1 | 2;
    md?: 2 | 3;
    lg?: 2 | 3 | 4;
  };
  selectedIndex?: number;
  onSelect?: (index: number) => void;
};

export default function LuxuryGallery({
  items,
  columns = { base: 1, md: 2, lg: 3 },
  selectedIndex,
  onSelect,
}: LuxuryGalleryProps) {
  const [failedVideoKeys, setFailedVideoKeys] = useState<Record<string, true>>({});

  const resolvedItems = useMemo<LuxuryGalleryItem[]>(() => {
    if (Array.isArray(items) && items.length) return items;

    const images = Array.isArray(assetManifest.images)
      ? (assetManifest.images.filter((s) => typeof s === 'string') as string[])
      : [];
    const videos = Array.isArray(assetManifest.videos)
      ? (assetManifest.videos.filter((s) => typeof s === 'string') as string[])
      : [];

    const pickedImages = images.slice(0, 12).map((src) => ({ type: 'image' as const, src }));
    const pickedVideos = videos.slice(0, 2).map((src) => ({ type: 'video' as const, src }));
    return [...pickedVideos, ...pickedImages];
  }, [items]);

  const columnClass = useMemo(() => {
    const base = columns.base === 2 ? 'columns-2' : 'columns-1';
    const md = columns.md === 3 ? 'md:columns-3' : 'md:columns-2';
    const lg = columns.lg === 4 ? 'lg:columns-4' : 'lg:columns-3';
    return `${base} ${md} ${lg}`;
  }, [columns.base, columns.md, columns.lg]);

  return (
    <div className={`${columnClass} gap-6 [column-gap:1.5rem]`}>
      {resolvedItems.map((item, idx) => {
        const key = `${item.type || 'image'}-${item.src || 'placeholder'}-${idx}`;
        const isSelected = typeof selectedIndex === 'number' ? idx === selectedIndex : false;
        const clickable = typeof onSelect === 'function';

        if (!item.src) {
          return (
            <div
              key={key}
              className={`mb-6 break-inside-avoid rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 aspect-video overflow-hidden ${
                item.className || ''
              }`}
            />
          );
        }

        if (item.type === 'video') {
          const failed = Boolean(failedVideoKeys[key]);

          if (failed) {
            if (item.fallbackSrc) {
              return (
                <div
                  key={key}
                  className={`mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 shadow-xl bg-white ${
                    item.className || ''
                  }`}
                >
                  <Image
                    src={item.fallbackSrc}
                    alt={item.alt || ''}
                    width={1600}
                    height={1000}
                    className="w-full h-auto object-cover object-top"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
              );
            }

            return (
              <div
                key={key}
                className={`mb-6 break-inside-avoid rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 aspect-video overflow-hidden ${
                  item.className || ''
                }`}
              />
            );
          }

          return (
            <div
              key={key}
              className={`mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 shadow-xl bg-black/5 ${
                item.className || ''
              }`}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover object-top"
                onLoadedMetadata={(e) => {
                  e.currentTarget.playbackRate = 0.5;
                }}
                onError={() => {
                  setFailedVideoKeys((prev) => ({ ...prev, [key]: true }));
                }}
              >
                <source src={item.src} type="video/mp4" />
              </video>
            </div>
          );
        }

        return (
          <div
            key={key}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={
              clickable
                ? () => {
                    onSelect(idx);
                  }
                : undefined
            }
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(idx);
                    }
                  }
                : undefined
            }
            className={`mb-6 break-inside-avoid overflow-hidden rounded-2xl border shadow-xl bg-white outline-none transition ${
              isSelected ? 'border-[#d4af37] ring-2 ring-[#d4af37]/50' : 'border-white/10'
            } ${clickable ? 'cursor-pointer hover:border-white/20' : ''} ${item.className || ''}`}
          >
            <Image
              src={item.src}
              alt={item.alt || ''}
              width={1600}
              height={1000}
              priority={idx === 0}
              className="w-full h-auto object-cover object-top"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        );
      })}
    </div>
  );
}
