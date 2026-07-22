/**
 * Route-level layout for tour pages.
 * Injects per-tour Product/Service structured data WITHOUT touching the
 * structurally-locked page.tsx template. Renders children unchanged.
 */
import { getTourBySlug } from '@/data/tours';
import JsonLd from '@/components/seo/JsonLd';

const BASE_URL = 'https://renesadventures.tours';

export default async function TourLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) return <>{children}</>;

  const price = tour.fullDayPrice ?? tour.price ?? 0;
  const isInquiryOnly = slug === 'blue-hole' || price <= 0;

  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tour.title,
    description: tour.description,
    image: tour.imageUrl?.startsWith('http')
      ? tour.imageUrl
      : `${BASE_URL}${tour.imageUrl ?? '/images/tours/deep-sea-fishing.jpg'}`,
    brand: { '@type': 'Brand', name: "Rene's Adventures" },
    category: 'Boat Charter',
    url: `${BASE_URL}/tours/${tour.slug}`,
  };

  if (!isInquiryOnly) {
    productLd.offers = {
      '@type': 'Offer',
      price: String(price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/tours/${tour.slug}`,
    };
  }

  return (
    <>
      <JsonLd data={productLd} />
      {children}
    </>
  );
}
