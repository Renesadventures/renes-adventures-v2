import type { Metadata } from 'next';
import HomeClient from './home-client';

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
  return <HomeClient />;
}
