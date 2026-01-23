import { notFound } from 'next/navigation';
import { getTourBySlug, tours } from '@/data/tours';
import TourLandingTemplate from '@/components/tours/TourLandingTemplate';

export async function generateStaticParams() {
  return tours
    .filter((t) => t.slug !== 'custom-charter') // Custom charter has its own page
    .map((tour) => ({
      slug: tour.slug,
    }));
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  // Custom charter has its own dedicated page
  if (tour.slug === 'custom-charter') {
    notFound();
  }

  const heroVideos = tour.heroVideoUrl
    ? [{ id: `${tour.slug}-hero`, label: tour.title, src: tour.heroVideoUrl }]
    : [];

  return <TourLandingTemplate tour={tour} heroVideos={heroVideos} />;
}
