import type { Metadata } from 'next';
import HeroNetflix from '@/components/home/HeroNetflix';
import ConditionsWidget from '@/components/home/ConditionsWidget';
import AdventureGrid from '@/components/home/AdventureGrid';
import BelizeIntelligence from '@/components/home/BelizeIntelligence';
import FishStoryCreator from '@/components/home/FishStoryCreator';
import VesselShowcase from '@/components/home/VesselShowcase';
import BelizeLifestyle from '@/components/home/BelizeLifestyle';
import SunsetRitualCTA from '@/components/home/SunsetRitualCTA';

export const metadata: Metadata = {
  title: "Rene's Adventures | Luxury Charters in Belize",
  description:
    'Premium charter experiences on Ambergris Caye—deep sea, reef, sunsets, and custom adventures guided by local captain expertise.',
  openGraph: {
    title: "Rene's Adventures | Luxury Charters in Belize",
    description:
      'Deep Obsidian design. Caribbean Gold accents. Premium charters with conditions-based intelligence and unforgettable memories.',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/images/tours/deep-sea-fishing.jpg',
        width: 1200,
        height: 630,
        alt: "Rene's Adventures — Luxury Belize Charters",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Rene's Adventures | Luxury Charters in Belize",
    description:
      'Deep sea. Reef. Sunset. Custom adventures. Book directly with René and mint your Instant Legend poster.',
    images: ['/images/tours/deep-sea-fishing.jpg'],
  },
};

export default function Home() {
  return (
    <>
      <HeroNetflix />
      <ConditionsWidget />
      <AdventureGrid />
      <BelizeIntelligence />
      <FishStoryCreator />
      <VesselShowcase />
      <BelizeLifestyle />
      <SunsetRitualCTA />
    </>
  );
}
