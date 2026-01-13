'use client';

import HeroSection from '@/components/home/HeroSection';
import LiaChatWidget from '@/components/ai/LiaChatWidget';
import { WeatherOpportunitySection } from '@/components/weather/WeatherOpportunitySection';
import { TravelIntelligenceHub } from '@/components/travel/TravelIntelligenceHub';
import FishStoryEngine from '@/components/features/FishStoryEngine';
import SocialWall from '@/components/features/SocialWall';
import VesselSpecs3D from '@/components/vessel/VesselSpecs3D';
import LeadMagnet from '@/components/features/LeadMagnet';
import SiteFooter from '@/components/layout/SiteFooter';
import TourCards from '@/components/tours/TourCards';
import { useWeather } from '@/hooks/useWeather';
import { buildWhatsAppTourLink } from '@/lib/utils/whatsapp-link';

export default function HomeClient() {
  const { weather } = useWeather();
  const eliteCtaLink = buildWhatsAppTourLink({ tourName: 'Sunset Cruise' });

  return (
    <main className="min-h-screen">
      <HeroSection />

      <div id="experiences">
        <TourCards />
      </div>

      <WeatherOpportunitySection />

      <TravelIntelligenceHub />

      <FishStoryEngine />

      <SocialWall />

      <VesselSpecs3D />

      <LeadMagnet />

      <section className="relative py-24 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 0.6;
            }}
          >
            <source src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/sunset-ritual.mp4`} type="video/mp4" />
          </video>
        </div>

        <div className="mx-auto w-full max-w-screen-2xl px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="text-xs uppercase tracking-[0.35em] text-[#d4af37]/80">The Elite Close</div>
            <h2 className="mt-4 text-4xl md:text-6xl font-light text-white tracking-tight">
              End the trip with a
              <span className="block font-serif italic text-[#d4af37]">Sunset Ritual</span>
            </h2>
            <p className="mt-5 text-white/70 text-lg font-light max-w-2xl mx-auto">
              A luxury finish: calm water, gold light, and the kind of photos you’ll keep forever.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={eliteCtaLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 rounded-xl bg-[#d4af37] text-slate-950 font-extrabold border border-white/10 hover:brightness-110 transition"
              >
                Message René to Book
              </a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('lia:open'))}
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/15 transition"
              >
                Ask Lia for the Perfect Day
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      <LiaChatWidget
        context={{
          pageName: 'Homepage',
          weather: weather?.current,
        }}
      />
    </main>
  );
}
