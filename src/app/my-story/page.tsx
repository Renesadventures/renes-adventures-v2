import type { Metadata } from 'next';
import InstantLegendPoster from '@/components/features/InstantLegendPoster';

export const metadata: Metadata = {
  title: "My Story • Instant Legend Poster | Rene's Adventures",
  description:
    "Upload your best Belize moment, let Lia stamp it with a legend, and download an Instagram-ready poster framed in Caribbean Gold.",
  openGraph: {
    title: "My Story • Instant Legend Poster | Rene's Adventures",
    description:
      "Mint a premium Instagram-ready legend poster: gold frame, heritage seal, and a Lia-generated caption.",
    url: '/my-story',
    images: [
      {
        url: '/images/tours/deep-sea-fishing.jpg',
        width: 1200,
        height: 630,
        alt: "Rene's Adventures — Instant Legend Poster",
      },
    ],
  },
};

export default function MyStoryPage() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <section className="py-20">
        <div className="mx-auto w-full max-w-screen-2xl px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">My Story</div>
              <h1 className="mt-4 text-4xl md:text-6xl font-light text-[#F8FAFC] tracking-tight">
                Mint your
                <span className="block font-serif italic text-[#D4AF37]">Instant Legend</span>
              </h1>
              <p className="mt-5 text-[#F8FAFC]/70 text-lg font-light max-w-2xl mx-auto">
                Upload a photo. Lia writes the caption. You post the proof.
              </p>
            </div>

            <div className="mt-12">
              <InstantLegendPoster />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
