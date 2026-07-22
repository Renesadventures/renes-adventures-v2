import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/data/blog-posts';
import JsonLd from '@/components/seo/JsonLd';

const BASE_URL = 'https://renesadventures.tours';

export const metadata: Metadata = {
  title: 'Belize Travel Guide & Charter Journal | Rene’s Adventures',
  description:
    'Insider guides to Ambergris Caye and Belize — deep sea fishing, the Blue Hole, Secret Beach, sunset cruises, and private charters from Captain Rene.',
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'Belize Travel Guide & Charter Journal | Rene’s Adventures',
    description:
      'Insider guides to Ambergris Caye and Belize from a local, licensed captain.',
    type: 'website',
    url: `${BASE_URL}/blog`,
  },
};

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Rene’s Adventures — Belize Travel Guide',
    url: `${BASE_URL}/blog`,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${BASE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      description: p.description,
    })),
  };

  return (
    <main className="bg-[#060608] min-h-screen text-white">
      <JsonLd data={itemListLd} />
      <section className="mx-auto max-w-screen-xl px-4 pt-28 pb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Belize Intelligence Hub</p>
        <h1 className="mt-3 font-semibold tracking-tight text-4xl md:text-5xl">
          Guides to the water off Ambergris Caye
        </h1>
        <p className="mt-4 max-w-2xl text-white/70 leading-relaxed">
          Straight, local knowledge on fishing, the Blue Hole, Secret Beach, sunsets, and private
          charters — written by the captain who runs the boat.
        </p>
      </section>

      <section className="mx-auto max-w-screen-xl px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.heroImage}
                  alt={post.heroAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-emerald-400 uppercase tracking-wider">
                  <span>{post.category}</span>
                  <span className="text-white/40">{post.readMins} min read</span>
                </div>
                <h2 className="mt-2 text-lg font-semibold leading-snug group-hover:text-white">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-[#d4af37]">
                  Read guide →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
