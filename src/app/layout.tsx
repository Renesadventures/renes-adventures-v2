import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Geist_Mono } from 'next/font/google';
import AppSoundShell from '@/components/audio/AppSoundShell';
import SiteNav from '@/components/layout/SiteNav';
import SiteFooter from '@/components/layout/SiteFooter';
import LiaChatWidget from '@/components/ai/LiaChatWidget';
import JsonLd from '@/components/seo/JsonLd';
import Analytics from '@/components/analytics/Analytics';
import OutboundTracker from '@/components/analytics/OutboundTracker';
import OpsTracker from '@/components/analytics/OpsTracker';
import MessageReneFallback from '@/components/contact/MessageReneFallback';
import { socialSameAs } from '@/data/social';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const playfair = Playfair_Display({ variable: '--font-playfair', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.renesadventures.tours'),
  title: "Rene's Adventures | Luxury Charters in Belize",
  description: "Your day. Your boat. Your adventure. Private boat charters on Ambergris Caye, Belize with Captain Rene. No strangers on board. Licensed and insured.",
  alternates: { canonical: '/' },
  openGraph: {
    title: "Rene's Adventures | Luxury Charters in Belize",
    description: 'Premium charter experiences on Ambergris Caye—deep sea, reef, sunset rituals, and custom adventures.',
    type: 'website',
    url: '/',
    images: [{ url: '/images/tours/deep-sea-fishing.jpg', width: 1200, height: 630, alt: "Rene's Adventures – Luxury Belize Charters" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Rene's Adventures | Luxury Charters in Belize",
    description: 'Luxury Belize charters—book directly with René and plan with conditions-based intelligence.',
    images: ['/images/tours/deep-sea-fishing.jpg'],
  },
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': ['TravelAgency', 'LocalBusiness'],
  '@id': 'https://www.renesadventures.tours/#organization',
  name: "Rene's Adventures",
  description:
    'Luxury private boat charters on Ambergris Caye, Belize — deep sea fishing, Blue Hole, Secret Beach, and sunset cruises with a licensed, insured local captain.',
  url: 'https://www.renesadventures.tours',
  telephone: '+501-606-0170',
  email: 'renesadventuresbz@gmail.com',
  image: 'https://www.renesadventures.tours/images/tours/deep-sea-fishing.jpg',
  priceRange: '$$$',
  areaServed: { '@type': 'Place', name: 'Ambergris Caye, Belize' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'San Pedro',
    addressRegion: 'Ambergris Caye',
    addressCountry: 'BZ',
  },
  sameAs: socialSameAs(),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <head>
        <link href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap' rel='stylesheet' />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${geistMono.variable} antialiased`}>
        <JsonLd data={organizationLd} />
        {/* Measurement. Renders nothing unless the IDs are set. */}
        <Analytics />
        <OutboundTracker />
        <OpsTracker />
        <MessageReneFallback />
        <AppSoundShell>
          <SiteNav />
          <div className='mx-auto w-full max-w-screen-2xl'>{children}</div>
          <SiteFooter />
          <LiaChatWidget />
        </AppSoundShell>
      </body>
    </html>
  );
}
