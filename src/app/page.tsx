'use client';

import HeroSection from '@/components/home/HeroSection';
import LiaChatWidget from '@/components/ai/LiaChatWidget';
import { WeatherOpportunitySection } from '@/components/weather/WeatherOpportunitySection';
import { FishStoryPreview } from '@/components/features/FishStoryPreview';
import { TravelIntelligenceHub } from '@/components/travel/TravelIntelligenceHub';
import { BoatGalleryPlaceholder, TourShowcasePlaceholder } from '@/components/placeholders/ContentPlaceholders';
import { useWeather } from '@/hooks/useWeather';

export default function Home() {
  const { weather } = useWeather();

  return (
    <main className="min-h-screen">
      {/* Hero Section with Video Background and Channel Switcher */}
      <HeroSection />

      <WeatherOpportunitySection />

      <TourShowcasePlaceholder />

      {/* Experiences Section (Placeholder for now) */}
      <section id="experiences" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center mb-12 text-gray-900">
            // Windsurf test - setup successful
            Our Adventures
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Experience the best of Belize with our curated selection of luxury charter experiences.
            More content coming soon...
          </p>
        </div>
      </section>

      <BoatGalleryPlaceholder />

      <TravelIntelligenceHub />

      <FishStoryPreview />

      {/* Lia AI Chat Widget */}
      <LiaChatWidget
        context={{
          pageName: 'Homepage',
          weather: weather?.current,
        }}
      />
    </main>
  );
}
