'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { tours } from '@/data/tours';

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US')}`;
}

function getAltText(title: string) {
  return `${title} tour in Belize - Rene's Adventures`;
}

export default function TourCards() {
  return (
    <section id="tours" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-orange-400 to-cyan-500 bg-clip-text text-transparent">
            Choose Your Belizean Adventure
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            Authentic fishing, snorkeling, and island experiences with Captain Rene
          </p>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tours.map((tour, i) => (
            <motion.article
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                border: '2px solid #f3f4f6',
                transition: 'all 0.3s'
              }}
              className="transform hover:scale-[1.02] hover:shadow-2xl hover:border-orange-500"
            >
              {/* Image Section */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: '100%',
                  height: '250px',
                  position: 'relative',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px'
                }}
              >
                <img
                  src={tour.imageUrl}
                  alt={getAltText(tour.title)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  loading="lazy"
                />

                {/* Duration Badge with inline styles */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: '#FF6B35',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  <span>🕐</span>
                  <span>{tour.duration}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {tour.title}
                </h3>

                {/* Description */}
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  {tour.description}
                </p>

                {/* Pricing Section */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="text-3xl font-bold text-orange-500">
                      {formatMoney(tour.price)}
                    </div>
                    {tour.priceFullDay && (
                      <div className="text-sm text-gray-700 mt-1">
                        Full Day: {formatMoney(tour.priceFullDay)}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-700">
                    <div className="font-medium">Up to {tour.includedGuests} guests</div>
                    <div className="text-gray-600">+ {formatMoney(tour.additionalGuestPrice)} per additional</div>
                  </div>
                </div>

                {/* Max Guests */}
                <p className="text-sm text-gray-700 mb-6 flex items-center gap-2">
                  <span className="text-lg">👥</span>
                  <span className="font-medium">Maximum {tour.maxGuests} guests</span>
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/tours/${tour.slug}`}
                    prefetch={false}
                    className="flex-1 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                  >
                    Book This Adventure
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent('lia:open', {
                          detail: { message: `Tell me about ${tour.title}` }
                        })
                      );
                    }}
                    className="flex-1 border-2 border-cyan-500 text-cyan-600 font-semibold px-6 py-3 rounded-xl hover:bg-cyan-500 hover:text-white transition-all duration-300"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
