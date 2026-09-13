import type { Metadata } from 'next';
import Link from 'next/link';
import { belizeChapters } from '@/data/belize-chapters';
import JsonLd from '@/components/seo/JsonLd';

const BASE_URL = 'https://renesadventures.tours';

export const metadata: Metadata = {
  title: "Belize · Untold | A Guide to Ambergris Caye | Rene's Adventures",
  description:
    "The Great Blue Hole, the Barrier Reef, Garifuna culture, Secret Beach, Maya ruins, Caye Caulker, and more — real stories from a local captain, one chapter at a time.",
  alternates: { canonical: '/belize-guide' },
  openGraph: {
    title: "Belize · Untold | Rene's Adventures",
    description:
      'Real stories about the Great Blue Hole, the Barrier Reef, Garifuna culture, and the hidden corners of Ambergris Caye — told by a local captain.',
    type: 'website',
    url: `${BASE_URL}/belize-guide`,
  },
};

export default function BelizeGuideIndexPage() {
  const collectionLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Belize · Untold',
    description:
      "Real stories about the Great Blue Hole, the Barrier Reef, Garifuna culture, and the hidden corners of Ambergris Caye — told by a local captain.",
    url: `${BASE_URL}/belize-guide`,
    hasPart: belizeChapters.map((c) => ({
      '@type': 'Article',
      headline: c.title,
      url: `${BASE_URL}/belize-guide/${c.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={collectionLd} />

      <section className="mx-auto w-full max-w-screen-2xl px-6 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">Belize · Untold</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Stories from the water, told by a local captain
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Nine chapters on the reef, the ruins, the culture, and the hidden corners of Ambergris
            Caye — the same stories René tells guests on the boat.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {belizeChapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/belize-guide/${chapter.slug}`}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-xs uppercase tracking-[0.3em] text-sky-700">
                {chapter.episode} · {chapter.category}
              </div>
              <div className="mt-3 text-xl font-bold text-slate-900 group-hover:text-sky-700">
                {chapter.title}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{chapter.tagline}</p>
              <div className="mt-4 text-sm font-semibold text-sky-700">Read the story →</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
