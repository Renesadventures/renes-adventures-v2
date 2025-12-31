import { notFound } from 'next/navigation';
import Link from 'next/link';
import { tours, getTourBySlug } from '@/data/tours';
import TourActions from './TourActions';

export async function generateStaticParams() {
  return tours.map((tour) => ({
    slug: tour.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return { title: 'Tour Not Found' };

  return {
    title: `${tour.title} - Rene's Adventures`,
    description: tour.description
  };
}

export default async function TourDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const relatedTours = tours.filter((t) => t.id !== tour.id).slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[60vh] min-h-[400px]">
        <img src={tour.imageUrl} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="text-5xl font-bold text-white mb-4">{tour.title}</h1>
            <div className="flex gap-6 text-white/90 text-lg">
              <span>🕐 {tour.duration}</span>
              <span>👥 Up to {tour.maxGuests} guests</span>
              <span className="text-tropical-coral font-bold">${tour.price}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Experience</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">{tour.description}</p>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-3">
                {tour.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-tropical-coral text-xl mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-4">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-tropical-coral mb-2">${tour.price}</div>
                  <p className="text-sm text-gray-600">Up to {tour.includedGuests} guests included</p>
                  <p className="text-sm text-gray-600">+${tour.additionalGuestPrice} per additional guest</p>
                  <p className="text-sm text-gray-500 mt-2">Maximum {tour.maxGuests} guests</p>
                </div>

                <TourActions title={tour.title} />

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-semibold">Duration:</span> {tour.duration}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">You Might Also Like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedTours.map((relatedTour) => (
              <Link
                key={relatedTour.id}
                href={`/tours/${relatedTour.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <img
                  src={relatedTour.imageUrl}
                  alt={relatedTour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{relatedTour.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relatedTour.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-tropical-coral font-bold">${relatedTour.price}</span>
                    <span className="text-sm text-gray-500">{relatedTour.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <Link
            href="/#tours"
            className="inline-block px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-tropical-coral hover:text-tropical-coral transition-all"
          >
            ← View All Tours
          </Link>
        </div>
      </section>
    </main>
  );
}
