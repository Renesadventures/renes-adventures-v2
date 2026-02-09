import { Users, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { itineraryActivitiesBySlug, financialAddOnsBySlug } from '@/data/tours';

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

export default function CustomCharterPage() {
  const activities = itineraryActivitiesBySlug['custom-charter'] || [];
  const addOns = financialAddOnsBySlug['custom-charter'] || [];

  void base;
  void addOns;

  return (
    <main className="bg-white min-h-screen">
      <section className="relative min-h-[80vh] bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-500 text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-6xl lg:text-7xl font-black mb-6 leading-tight">
                Your Boat. Your Day.<br />Your Adventure.
              </h1>
              <p className="text-xl mb-8 text-white/90 leading-relaxed">
                Design the perfect Belize experience. Pick activities, set your pace, and let our crew handle everything else.
              </p>

              <div className="flex gap-4 flex-wrap mb-8">
                <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2">
                  <Users size={20} />
                  <span>Up to 8 guests</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2">
                  <Clock size={20} />
                  <span>Half & Full Day</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2">
                  <MapPin size={20} />
                  <span>Private Charter</span>
                </div>
              </div>

              <a
                href="#booking-engine"
                className="inline-block px-12 py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-lg rounded-full shadow-2xl hover:scale-105 transition-all"
              >
                Book This Adventure
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
              <div className="text-5xl font-black mb-4">$400</div>
              <div className="text-lg mb-6">Half Day (4 hours)</div>
              <div className="text-5xl font-black mb-4">$600</div>
              <div className="text-lg mb-8">Full Day (8 hours)</div>
              <div className="text-sm text-white/80">
                Base rate includes 4 guests<br />
                Extra guests: $75/person
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-center">Drop Zone Teaser</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activities.slice(0, 10).map((activity, i) => (
              <div key={i} className="relative aspect-video rounded-2xl overflow-hidden shadow-lg group">
                <video
                  src={activity.videoUrl}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">{activity.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-4 text-center">Pick the moments you&apos;ll talk about forever.</h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-lg">
            Every adventure is custom. Choose activities that match your crew&apos;s energy—or let our captain read the day and take you to his favorite spots.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.slice(0, 9).map((activity, i) => (
              <div key={i} className="group relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <video
                  src={activity.videoUrl}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-white text-3xl font-black mb-3">{activity.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black mb-4 text-center">
            Pick 1. Pick all 10.<br />It&apos;s your call.
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
            Some clients want one iconic moment. Others want a sampler platter. The boat is yours for the day—we adapt to your vibe.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-white rounded-3xl shadow-lg">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl font-black mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-black mb-4">Start Talking</h3>
              <p className="text-gray-600 leading-relaxed">
                Meet the crew & set priorities. Reef? Fishing? Food? Beach? We align the day to your vibe. No rigid schedule—just possibilities.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl shadow-lg">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center text-3xl font-black mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-black mb-4">Go Epic</h3>
              <p className="text-gray-600 leading-relaxed">
                Hit your bucket-list moments. Snorkel Hol Chan, spearfish for dinner, chase tarpon, dive the Blue Hole. Action blocks + scenic Belize moments.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl shadow-lg">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white flex items-center justify-center text-3xl font-black mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-black mb-4">Wind Down</h3>
              <p className="text-gray-600 leading-relaxed">
                Sunset swims, secret beaches, or just float. The last hour is always unscripted—that&apos;s when the magic happens. No fixed checklist.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black mb-16 text-center">Show up ready. Leave with stories.</h2>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-black mb-8 text-orange-600">What&apos;s Included</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">Gold standard crew (Captain + First Mate)</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">Ice, water & sodas</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">Core snorkel & fishing gear</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">Marine park fees (Hol Chan, Shark Ray Alley)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-3xl font-black mb-8 text-blue-600">What to Bring</h3>
              <ul className="space-y-4 text-gray-700 text-lg">
                <li className="flex items-start gap-4">
                  <span className="text-3xl">🧴</span>
                  <span>Reef-safe sunscreen (required by law)</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-3xl">🩱</span>
                  <span>Swimwear & towel</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-3xl">🕶️</span>
                  <span>Polarized sunglasses</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-3xl">📸</span>
                  <span>Waterproof camera or GoPro</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="booking-engine" className="py-20 px-6 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-black mb-8">Book fast. Or go massive.</h2>
          <p className="text-2xl text-gray-700 mb-12">
            Half-day <span className="text-5xl font-black text-orange-600">$400</span> • Full-day{' '}
            <span className="text-5xl font-black text-orange-600">$600</span>
          </p>

          <a
            href="/checkout"
            className="inline-block px-16 py-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xl rounded-full shadow-2xl hover:scale-105 transition-all mb-8"
          >
            Book This Adventure
          </a>

          <p className="text-gray-600">Base rate includes 4 guests • Extra guests $75/person • All core gear included</p>
        </div>
      </section>
    </main>
  );
}
