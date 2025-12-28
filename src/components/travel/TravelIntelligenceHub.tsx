'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function TravelIntelligenceHub() {
  const [activeTab, setActiveTab] = useState<'prepare' | 'styles' | 'destinations' | 'insider'>('prepare');

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px), repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-amber-400 text-sm uppercase tracking-[0.3em] font-light">Beyond The Boat</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">
            Your Complete
            <span className="block font-serif italic text-amber-400">Belize Intelligence</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            We don&apos;t just book tours—we prepare you for Belize. From visa requirements to where locals party,
            we&apos;ve got insider intel you won&apos;t find anywhere else.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'prepare', label: 'Pre-Trip Prep' },
            { id: 'styles', label: 'Travel Styles' },
            { id: 'destinations', label: 'Must-Sees' },
            { id: 'insider', label: 'Local Secrets' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-8 py-4 rounded-xl border transition-all duration-300 flex items-center gap-3
                ${
                  activeTab === tab.id
                    ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                    : 'bg-white/5 border-slate-800 text-slate-400 hover:border-slate-700'
                }
              `}
            >
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-12 shadow-2xl">
            {activeTab === 'prepare' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div>
                    <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                    <h3 className="text-3xl font-light text-white mb-2">Pre-Trip Preparation Guide</h3>
                    <p className="text-amber-400 italic">Everything you need before wheels-up</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      Legal & Immigration
                    </h4>
                    <ul className="text-slate-400 space-y-2 text-sm">
                      <li>• Visa requirements by country</li>
                      <li>• Passport validity (6+ months)</li>
                      <li>• Customs declarations</li>
                      <li>• Exit fees & airport taxes</li>
                      <li>• Embassy contacts & legal support</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      Health & Safety
                    </h4>
                    <ul className="text-slate-400 space-y-2 text-sm">
                      <li>• Required vaccinations</li>
                      <li>• Malaria prophylaxis (optional)</li>
                      <li>• Travel insurance recommendations</li>
                      <li>• Medical facilities & hospitals</li>
                      <li>• Emergency evacuation contacts</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      Packing Essentials
                    </h4>
                    <ul className="text-slate-400 space-y-2 text-sm">
                      <li>• Reef-safe sunscreen (mandatory)</li>
                      <li>• Quick-dry clothing</li>
                      <li>• Waterproof phone case</li>
                      <li>• Motion sickness meds</li>
                      <li>• Cash (USD widely accepted)</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                      What NOT to Do
                    </h4>
                    <ul className="text-slate-400 space-y-2 text-sm">
                      <li>• Don&apos;t touch coral (illegal + harmful)</li>
                      <li>• Don&apos;t drink tap water</li>
                      <li>• Don&apos;t photograph locals without asking</li>
                      <li>• Don&apos;t swim alone at night</li>
                      <li>• Don&apos;t leave valuables on beach</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                      <h4 className="text-xl font-semibold text-white mb-2">Complete Pre-Trip Guide (Coming Soon)</h4>
                      <p className="text-slate-300 text-sm mb-4">
                        Our comprehensive 40-page pre-trip manual covers visa applications, travel insurance selection,
                        packing checklists, health protocols, legal requirements, and emergency procedures. Download
                        includes:
                      </p>
                      <ul className="text-slate-400 text-sm space-y-1 mb-4">
                        <li>✓ Country-specific visa application guides</li>
                        <li>✓ Printable packing checklist</li>
                        <li>✓ Emergency contact cards (Spanish/English)</li>
                        <li>✓ Legal resources & embassy info</li>
                        <li>✓ Health clinic directory with 24/7 options</li>
                      </ul>
                      <button
                        disabled
                        className="px-6 py-3 bg-slate-800 text-slate-600 rounded-lg text-sm font-semibold cursor-not-allowed"
                      >
                        Available January 2025
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'styles' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div>
                    <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                    <h3 className="text-3xl font-light text-white mb-2">Design Your Perfect Belize</h3>
                    <p className="text-amber-400 italic">Match your travel style to the right experiences</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400 transition-all group cursor-pointer">
                    <h4 className="text-2xl font-semibold text-white mb-3">The Relaxer</h4>
                    <p className="text-slate-300 text-sm mb-4">
                      You&apos;re here to unwind. Slow mornings, sunset cruises, beach hammocks, spa days, and zero
                      rushing.
                    </p>
                    <p className="text-blue-400 text-xs font-semibold">
                      RECOMMENDED: Sunset Cruise • Secret Beach • Spa Day • Private Island Picnic
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-500/10 to-orange-600/10 border border-red-500/30 rounded-xl p-6 hover:border-red-400 transition-all group cursor-pointer">
                    <h4 className="text-2xl font-semibold text-white mb-3">The Adventurist</h4>
                    <p className="text-slate-300 text-sm mb-4">
                      Adrenaline junkie. Deep sea fishing, cave tubing, zip-lining, shark dives, overnight jungle
                      treks.
                    </p>
                    <p className="text-red-400 text-xs font-semibold">
                      RECOMMENDED: Deep Sea Fishing • Cave Tubing • ATM Cave • Night Dive
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border border-green-500/30 rounded-xl p-6 hover:border-green-400 transition-all group cursor-pointer">
                    <h4 className="text-2xl font-semibold text-white mb-3">The Foodie</h4>
                    <p className="text-slate-300 text-sm mb-4">
                      You travel to eat. Street tacos, lobster beach BBQs, rum distillery tours, cooking classes with
                      locals.
                    </p>
                    <p className="text-green-400 text-xs font-semibold">
                      RECOMMENDED: Lobster Beach BBQ • Rum Tour • Garifuna Cooking Class • Market Tours
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400 transition-all group cursor-pointer">
                    <h4 className="text-2xl font-semibold text-white mb-3">The Party Animal</h4>
                    <p className="text-slate-300 text-sm mb-4">
                      Nightlife is life. Beach bars, full moon parties, rum punch buckets, reggae nights, sunrise
                      after-parties.
                    </p>
                    <p className="text-purple-400 text-xs font-semibold">
                      RECOMMENDED: Party Boat Tour • Full Moon Beach Party • Bar Crawl • Sunset Rum Tour
                    </p>
                  </div>
                </div>

                <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                      <h4 className="text-xl font-semibold text-white mb-2">Interactive Travel Style Quiz (Coming Soon)</h4>
                      <p className="text-slate-300 text-sm mb-4">
                        Answer 10 questions and we&apos;ll design a custom itinerary matching your travel personality.
                        Lia AI will curate daily recommendations based on your preferences, budget, and energy level.
                      </p>
                      <button
                        disabled
                        className="px-6 py-3 bg-slate-800 text-slate-600 rounded-lg text-sm font-semibold cursor-not-allowed"
                      >
                        Quiz Launching Soon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'destinations' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div>
                    <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                    <h3 className="text-3xl font-light text-white mb-2">Must-See Destinations</h3>
                    <p className="text-amber-400 italic">Beyond San Pedro—the Belize you didn&apos;t know existed</p>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                        <h4 className="text-xl font-semibold text-white mb-2">Mayan Ruins (Mainland)</h4>
                        <p className="text-slate-400 text-sm mb-3">
                          Explore ancient civilizations: Xunantunich, Caracol, Lamanai. Full-day tours from San Pedro
                          include domestic flight, jungle hike, and guided exploration.
                        </p>
                        <span className="text-amber-400 text-xs font-semibold">
                          INSIDER TIP: Book sunrise tours to beat crowds and heat
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                        <h4 className="text-xl font-semibold text-white mb-2">Caye Caulker</h4>
                        <p className="text-slate-400 text-sm mb-3">
                          The "go slow" island. No cars, sandy streets, colorful wooden houses. 15-minute water taxi
                          from San Pedro. Perfect day trip for a different vibe.
                        </p>
                        <span className="text-amber-400 text-xs font-semibold">
                          INSIDER TIP: Eat at Errolyn&apos;s House of Fry Jacks (locals-only spot)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                        <h4 className="text-xl font-semibold text-white mb-2">The Blue Hole</h4>
                        <p className="text-slate-400 text-sm mb-3">
                          UNESCO World Heritage site. 1,000ft diameter underwater sinkhole. Advanced diving only—but
                          helicopter tours available for everyone.
                        </p>
                        <span className="text-amber-400 text-xs font-semibold">
                          INSIDER TIP: Helicopter tour at sunrise = zero crowds, best photos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                        <h4 className="text-xl font-semibold text-white mb-2">ATM Cave (Actun Tunichil Muknal)</h4>
                        <p className="text-slate-400 text-sm mb-3">
                          Swim, wade, and climb through an underground Mayan ceremonial cave. See ancient pottery and
                          calcified human remains. National Geographic&apos;s #1 sacred cave.
                        </p>
                        <span className="text-amber-400 text-xs font-semibold">
                          INSIDER TIP: No cameras allowed—protect yourself with waterproof phone case
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                      <h4 className="text-xl font-semibold text-white mb-2">Complete Belize Travel Map (Coming Soon)</h4>
                      <p className="text-slate-300 text-sm mb-4">
                        Interactive map with 50+ destinations, local tips, drive times, tour operators, and hidden gems
                        only locals know about.
                      </p>
                      <button
                        disabled
                        className="px-6 py-3 bg-slate-800 text-slate-600 rounded-lg text-sm font-semibold cursor-not-allowed"
                      >
                        Map Coming January 2025
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insider' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div>
                    <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                    <h3 className="text-3xl font-light text-white mb-2">Local Secrets</h3>
                    <p className="text-amber-400 italic">Where we eat, drink, and party—not where tourists go</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-3">Where Locals Eat</h4>
                    <ul className="text-slate-400 text-sm space-y-2">
                      <li>
                        • <span className="text-white">Estel&apos;s Dine by the Sea</span> - Best ceviche, period
                      </li>
                      <li>
                        • <span className="text-white">Elvi&apos;s Kitchen</span> - Since 1974, family recipes
                      </li>
                      <li>
                        • <span className="text-white">Robin&apos;s Kitchen</span> - $5 Belikin + pupusas
                      </li>
                      <li>
                        • <span className="text-white">Neri&apos;s Tacos</span> - 3am taco cart (locals only)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-3">Where Locals Drink</h4>
                    <ul className="text-slate-400 text-sm space-y-2">
                      <li>
                        • <span className="text-white">Palapa Bar</span> - Sunset, sand floor, $2 Belikin
                      </li>
                      <li>
                        • <span className="text-white">Crazy Canucks</span> - Sports bar, expat crowd
                      </li>
                      <li>
                        • <span className="text-white">Wahoo&apos;s Lounge</span> - Live music Thursdays
                      </li>
                      <li>
                        • <span className="text-white">The Truck Stop</span> - Dive bar, real Belize
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-slate-800">
                    <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-3">Where Locals Party</h4>
                    <ul className="text-slate-400 text-sm space-y-2">
                      <li>
                        • <span className="text-white">Jaguar&apos;s Temple</span> - Reggae night (Wednesdays)
                      </li>
                      <li>
                        • <span className="text-white">Barefoot Iguana</span> - Beach bonfire parties
                      </li>
                      <li>
                        • <span className="text-white">Fido&apos;s Courtyard</span> - Live bands weekends
                      </li>
                      <li>
                        • <span className="text-white">Secret spot</span> - Ask Rene 😉
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                      <h4 className="text-lg font-semibold text-white mb-2">Tourist Traps to Avoid</h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Beach bars on Front Street (3x markup)</li>
                        <li>• Tours sold by hotel concierge (30% commission baked in)</li>
                        <li>• Airport taxi to San Pedro ($200 vs $50 water taxi)</li>
                        <li>• "Authentic" restaurants with English-only menus</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
                      <h4 className="text-xl font-semibold text-white mb-2">Exclusive Local Guide (Coming Soon)</h4>
                      <p className="text-slate-300 text-sm mb-4">
                        Captain Rene&apos;s personal directory: where he takes his family to eat, which beach bars have the
                        best vibes, secret fishing spots, and the one place you MUST have breakfast.
                      </p>
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('lia:open'));
                        }}
                        className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-lg text-sm font-semibold transition-all"
                      >
                        Ask Lia for Early Access
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
