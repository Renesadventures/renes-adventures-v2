'use client';

import { motion } from 'framer-motion';

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
  return (
    <section id="tours" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 text-sm uppercase tracking-widest font-semibold">In Development</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-4">Tour Landing Pages</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Each tour will have a dedicated page with POV videos, itinerary details, pricing, testimonials, and instant
            booking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { name: 'Deep Sea Fishing', icon: '🎣', price: '$600' },
            { name: 'Hol Chan Snorkel', icon: '🤿', price: '$675' },
            { name: 'Sunset Cruise', icon: '🌅', price: '$350' },
            { name: 'Full Day Ultimate', icon: '⚡', price: '$950' },
          ].map((tour, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all group"
            >
              <div className="mb-5">
                <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{tour.name}</h3>
              <p className="text-amber-600 font-semibold text-lg mb-4">From {tour.price}</p>
              <div className="w-full py-3 bg-slate-200 text-slate-500 rounded-lg text-center text-sm font-medium">
                Landing Page In Progress
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
