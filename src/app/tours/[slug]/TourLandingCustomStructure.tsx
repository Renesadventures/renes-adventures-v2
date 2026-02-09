 'use client';
 
 import UniversalTourPage from './UniversalTourPage';
 import type { Tour } from '@/data/tours';
 
 type VideoItem = {
   id: string;
   label: string;
   src: string;
 };
 
 export default function TourLandingCustomStructure({
   tour,
   heroVideos,
 }: {
   tour: Tour;
   heroVideos: VideoItem[];
 }) {
   if (process.env.NODE_ENV !== 'production') {
     throw new Error('TourLandingCustomStructure is deprecated. Use UniversalTourPage via tours/[slug]/page.tsx.');
   }
 
   return <UniversalTourPage tour={tour} heroVideos={heroVideos} />;
 }
