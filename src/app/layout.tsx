import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import AppSoundShell from "@/components/audio/AppSoundShell";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import LiaChatWidget from "@/components/ai/LiaChatWidget";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://renesadventures.tours'),
  title: "Rene's Adventures | Luxury Charters in Belize",
  description:
    "Your day. Your boat. Your legend. Premium charters in Belize with conditions-based intelligence, concierge booking, and story-grade memories.",
  openGraph: {
    title: "Rene's Adventures | Luxury Charters in Belize",
    description:
      'Premium charter experiences on Ambergris Caye—deep sea, reef, sunset rituals, and custom adventures.',
    type: 'website',
    url: '/',
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
      'Luxury Belize charters—book directly with René and plan with conditions-based intelligence.',
    images: ['/images/tours/deep-sea-fishing.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${geistMono.variable} antialiased`}
      >
        <AppSoundShell>
          <SiteNav />
          <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
          <SiteFooter />
          <LiaChatWidget />
        </AppSoundShell>
      </body>
    </html>
  );
}
