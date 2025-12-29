'use client';

import { motion } from 'framer-motion';
import TourCards from '@/components/tours/TourCards';

export function BoatGalleryPlaceholder() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-teal-600 text-sm uppercase tracking-widest font-semibold">Coming Next</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-4">Meet Your Vessel</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Cinematic photos and videos of Rene&apos;s fleet will showcase the boats, captain, crew, and the premium
            experience awaiting you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 mx-auto mb-4">
                    <div className="w-12 h-1 bg-gradient-to-r from-slate-900 to-transparent mx-auto" />
                  </div>
                  <p className="text-slate-600 text-sm font-medium">{i <= 3 ? 'Hero Photo' : 'Video Clip'} #{i}</p>
                </div>
              </div>

              <div className="absolute inset-0 bg-teal-600/0 group-hover:bg-teal-600/10 transition-all" />
            </motion.div>
          ))}
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
