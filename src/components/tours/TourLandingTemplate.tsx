'use client';

import type { Tour } from '@/data/tours';
import TourLandingClient from '@/app/tours/[slug]/TourLandingClient';

type VideoItem = {
  id: string;
  label: string;
  src: string;
};

export default function TourLandingTemplate({
  tour,
  heroVideos,
}: {
  tour: Tour;
  heroVideos: VideoItem[];
}) {
  return <TourLandingClient tour={tour} heroVideos={heroVideos} />;
}
