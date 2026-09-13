/**
 * Route-level layout for tour pages.
 * Injects per-tour Product/Service structured data WITHOUT touching the
 * structurally-locked page.tsx template. Renders children unchanged.
 */
import type { Metadata } from 'next';
import { getTourBySlug } from '@/data/tours';
import type { Tour } from '@/data/tours';
import JsonLd from '@/components/seo/JsonLd';
import TourFAQ from '@/components/tours/TourFAQ';

const BASE_URL = 'https://renesadventures.tours';

// Same policy text already shown site-wide in the footer — reused verbatim
// so the FAQ answer never drifts from the real cancellation policy.
const CANCELLATION_POLICY =
  'Free rescheduling with 48+ hours notice. Full credit transfer with 48+ hours notice. ' +
  'Weather cancellations are transferable — never lost. No refunds within 48 hours of charter.';

function buildTourFaqs(tour: Tour, isInquiryOnly: boolean, price: number) {
  const faqs: { q: string; a: string }[] = [];

  faqs.push({
    q: `How much does the ${tour.title} tour cost?`,
    a: isInquiryOnly
      ? `Pricing for the ${tour.title} tour is by inquiry — message us on WhatsApp or email and we'll get back to you with a quote.`
      : `The ${tour.title} tour starts at $${price} for up to ${tour.includedGuests} guests. Additional guests are $${tour.additionalGuestPrice} per person, up to ${tour.maxGuests} total. This doesn't include 12.5% tax, 6% service fee, or gratuity.`,
  });

  faqs.push({
    q: 'How many guests can join?',
    a: `Up to ${tour.maxGuests} guests per charter. The base price covers ${tour.includedGuests}; additional guests are $${tour.additionalGuestPrice} each.`,
  });

  faqs.push({
    q: 'How long is the tour?',
    a:
      tour.hasHalfDay && tour.hasFullDay
        ? `You can book the ${tour.title} as a ${tour.duration} or upgrade to a ${tour.fullDayDuration}.`
        : `The ${tour.title} runs ${tour.duration}.`,
  });

  if (tour.features?.length) {
    faqs.push({
      q: `What's included on the ${tour.title} tour?`,
      a: `${tour.features.slice(0, 4).join(', ')}, and more — Captain René and crew included throughout.`,
    });
  }

  faqs.push({
    q: 'What happens if the weather is bad?',
    a: CANCELLATION_POLICY,
  });

  return faqs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) return {};

  const title = `${tour.title} | Rene's Adventures`;
  const description = tour.description;
  const image = tour.imageUrl?.startsWith('http')
    ? tour.imageUrl
    : `${BASE_URL}${tour.imageUrl ?? '/images/tours/deep-sea-fishing.jpg'}`;
  const url = `${BASE_URL}/tours/${tour.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images: [{ url: image, width: 1200, height: 630, alt: tour.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

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

  const touristTripLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    image: tour.imageUrl?.startsWith('http')
      ? tour.imageUrl
      : `${BASE_URL}${tour.imageUrl ?? '/images/tours/deep-sea-fishing.jpg'}`,
    touristType: 'Leisure',
    provider: {
      '@type': 'TravelAgency',
      name: "Rene's Adventures",
      url: BASE_URL,
    },
    itinerary: {
      '@type': 'Place',
      name: 'Ambergris Caye, Belize',
    },
    ...(isInquiryOnly
      ? {}
      : {
          offers: {
            '@type': 'Offer',
            price: String(price),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/tours/${tour.slug}`,
          },
        }),
  };

  const faqs = buildTourFaqs(tour, isInquiryOnly, price);

  const faqLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <JsonLd data={[productLd, touristTripLd, faqLd]} />
      {children}
      <TourFAQ items={faqs} />
    </>
  );
}
