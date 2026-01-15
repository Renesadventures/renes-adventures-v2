'use client';

import { motion } from 'framer-motion';
import TourCards from '@/components/tours/TourCards';
import LuxuryGallery from '@/components/ui/luxury-gallery';

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

export function BoatGalleryPlaceholder() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto w-full max-w-screen-2xl px-4">
        <div className="text-center mb-12">
          <span className="text-teal-600 text-sm uppercase tracking-widest font-semibold">Coming Next</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-4">Meet Your Vessel</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Cinematic photos and videos of Rene&apos;s fleet will showcase the boats, captain, crew, and the premium
            experience awaiting you.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Vessel Specs</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">25ft Contender Bay | 2025 Refit | Garmin Suite</h3>
                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Length</span>
                      <span>25 ft</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Finish</span>
                      <span>White / Blue trim</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Refit</span>
                      <span>2025</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Electronics</span>
                      <span>Garmin</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Layout</span>
                      <span>Center-console</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <LuxuryGallery
                  columns={{ base: 1, md: 2, lg: 2 }}
                  items={[
                    {
                      type: 'video',
                      src: `${base}/videos/luxury/25-foot-center-console.mp4`,
                      fallbackSrc: `${base}/images/tours/full-day-ultimate.jpg`,
                      alt: 'Meet Your Vessel - B-roll',
                    },
                    { type: 'image', src: `${base}/images/tours/deep-sea-fishing.jpg`, alt: 'Center-console exterior - offshore ready' },
                    { type: 'image', src: `${base}/images/tours/reef-fishing.jpg`, alt: 'Center-console deck space - reef days' },
                    { type: 'image', src: `${base}/images/tours/sunset-cruise.jpg`, alt: 'Premium comfort on the water' },
                  ]}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-teal-50 border border-teal-200 rounded-full">
            <span className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-teal-700 text-sm font-medium">
              Real content from Google Drive being processed—deploying tonight
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TourShowcasePlaceholder() {
  return <TourCards />;
}
