import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { blogPosts, getPostBySlug } from '@/data/blog-posts';
import { getTourBySlug } from '@/data/tours';
import JsonLd from '@/components/seo/JsonLd';

const BASE_URL = 'https://renesadventures.tours';

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Not found | Rene’s Adventures' };
  const url = `${BASE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} | Rene’s Adventures`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      images: [{ url: post.heroImage, width: 1200, height: 630, alt: post.heroAlt }],
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.heroImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const tour = getTourBySlug(post.relatedTourSlug);
  const url = `${BASE_URL}/blog/${post.slug}`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${BASE_URL}${post.heroImage}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: "Rene's Adventures",
      url: BASE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.keyword,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Belize Guide', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="bg-[#060608] min-h-screen text-white">
      <JsonLd data={[articleLd, breadcrumbLd]} />

      <article className="mx-auto max-w-3xl px-4 pt-28 pb-16">
        <nav className="text-xs text-white/50">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="px-2">/</span>
          <Link href="/blog" className="hover:text-white">Belize Guide</Link>
        </nav>

        <div className="mt-5 flex items-center gap-3 text-xs text-emerald-400 uppercase tracking-wider">
          <span>{post.category}</span>
          <span className="text-white/40">{post.readMins} min read</span>
          <span className="text-white/40">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="mt-3 font-semibold tracking-tight text-3xl md:text-4xl leading-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-white/70 leading-relaxed">{post.excerpt}</p>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={post.heroImage}
            alt={post.heroAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-10 space-y-8">
          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="mt-3 text-white/75 leading-relaxed">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((b, k) => (
                    <li key={k} className="flex gap-3 text-white/75 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {tour && (
          <div className="mt-12 rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37]">Ready when you are</p>
            <h3 className="mt-2 text-xl font-semibold">Book the {post.relatedTourLabel}</h3>
            <p className="mt-2 text-white/70 leading-relaxed">
              Your day, your boat, your legend. Licensed, insured, and all-inclusive with Captain
              Rene.
            </p>
            <Link
              href={`/tours/${tour.slug}`}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#d4af37] px-6 py-2.5 font-extrabold text-slate-950 border border-white/10 hover:brightness-110 transition"
            >
              View {post.relatedTourLabel}
            </Link>
          </div>
        )}
      </article>

      <section className="mx-auto max-w-3xl px-4 pb-24">
        <h3 className="text-sm uppercase tracking-[0.25em] text-emerald-400">More guides</h3>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
            >
              <div className="text-xs text-emerald-400 uppercase tracking-wider">{p.category}</div>
              <div className="mt-1 text-sm font-semibold leading-snug group-hover:text-white">
                {p.title}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
