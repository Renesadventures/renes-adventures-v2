import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { belizeChapters, getBelizeChapterBySlug } from '@/data/belize-chapters';
import { getTourBySlug } from '@/data/tours';
import JsonLd from '@/components/seo/JsonLd';

const BASE_URL = 'https://renesadventures.tours';

export function generateStaticParams() {
  return belizeChapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getBelizeChapterBySlug(slug);
  if (!chapter) return {};

  const title = `${chapter.title} | Belize · Untold | Rene's Adventures`;
  const description = `${chapter.tagline} ${chapter.body[0]}`.slice(0, 155).trim();
  const url = `${BASE_URL}/belize-guide/${chapter.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/belize-guide/${chapter.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BelizeChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getBelizeChapterBySlug(slug);

  if (!chapter) notFound();

  const relatedTour = getTourBySlug(chapter.relatedTourSlug);

  const articleLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: chapter.title,
    description: chapter.tagline,
    articleSection: chapter.category,
    author: { '@type': 'Organization', name: "Rene's Adventures" },
    publisher: {
      '@type': 'Organization',
      name: "Rene's Adventures",
      url: BASE_URL,
    },
    about: {
      '@type': 'TouristAttraction',
      name: chapter.title,
      description: chapter.tagline,
      touristType: 'Leisure',
    },
    mainEntityOfPage: `${BASE_URL}/belize-guide/${chapter.slug}`,
  };

  const breadcrumbLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Belize · Untold', item: `${BASE_URL}/belize-guide` },
      { '@type': 'ListItem', position: 3, name: chapter.title, item: `${BASE_URL}/belize-guide/${chapter.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbLd]} />

      <article className="mx-auto w-full max-w-screen-2xl px-6 py-10">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/belize-guide" className="hover:text-sky-700">
            Belize · Untold
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{chapter.title}</span>
        </nav>

        <div className="mx-auto max-w-3xl">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-700">
            {chapter.episode} · {chapter.category}
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            {chapter.title}
          </h1>
          <p className="mt-4 text-xl text-slate-600 leading-relaxed">{chapter.tagline}</p>

          <div className="mt-8 overflow-hidden rounded-3xl bg-black">
            <video
              src={chapter.video}
              autoPlay
              loop
              muted
              playsInline
              className="h-[320px] w-full object-cover md:h-[440px]"
            />
          </div>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">{chapter.headline}</h2>

          <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-700">
            {chapter.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs uppercase tracking-[0.35em] text-sky-700">René's Take</div>
            <p className="mt-3 text-lg italic leading-relaxed text-slate-800">
              &ldquo;{chapter.rene}&rdquo;
            </p>
          </div>

          {relatedTour && (
            <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-slate-900 p-8 text-white md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/60">See it for yourself</div>
                <div className="mt-1 text-xl font-bold">{relatedTour.title}</div>
              </div>
              <Link
                href={`/tours/${relatedTour.slug}`}
                className="shrink-0 rounded-full bg-tropical-coral px-8 py-3 font-bold text-white transition hover:scale-105 hover:bg-tropical-orange"
              >
                Book This Adventure
              </Link>
            </div>
          )}

          <div className="mt-10">
            <Link href="/belize-guide" className="text-sm font-semibold text-sky-700 hover:underline">
              ← Back to Belize · Untold
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
