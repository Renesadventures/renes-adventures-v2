'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '600'] });

type ModerationPost = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  source: 'instant_legend' | 'story_photo' | 'manual';
  mediaUrl: string;
  caption?: string | null;
  authorName?: string | null;
  authorHandle?: string | null;
  metadataUrl?: string | null;
};

export default function SocialWall() {
  const [posts, setPosts] = useState<ModerationPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/moderation?status=Approved');
        const data = (await res.json()) as unknown;
        const list =
          data && typeof data === 'object' && Array.isArray((data as { posts?: unknown }).posts)
            ? ((data as { posts: ModerationPost[] }).posts as ModerationPost[])
            : [];
        if (cancelled) return;
        setPosts(list);
      } catch {
        if (cancelled) return;
        setPosts([]);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    return posts
      .filter((p) => p.status === 'Approved')
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [posts]);

  return (
    <section className="py-24 bg-[#0F172A]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Social Wall</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-light text-[#F8FAFC] tracking-tight">
            Approved legends.
            <span className="block font-serif italic text-[#D4AF37]">Vertical. Fast. Alive.</span>
          </h2>
          <p className="mt-4 text-[#F8FAFC]/70 max-w-2xl">
            Only content approved by René appears here—including Instant Legend posters.
          </p>
        </div>

        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-10 text-white/70">
            No approved posts yet.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-gap:1.5rem]">
            {visible.map((post, idx) => {
              const isVideo = post.mediaUrl.toLowerCase().endsWith('.mp4');
              return (
                <div
                  key={post.id}
                  className="mb-6 break-inside-avoid overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-black/30 shadow-2xl"
                >
                  <div className="relative w-full aspect-[9/16]">
                    {isVideo ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      >
                        <source src={post.mediaUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={post.mediaUrl}
                        alt={post.caption || 'Approved post'}
                        fill
                        priority={idx === 0}
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/10 to-transparent" />

                    {post.caption ? (
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className={`${dancingScript.className} text-white text-2xl leading-snug drop-shadow-sm`}>
                          {post.caption}
                        </div>
                        <div className="mt-3 text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">
                          {post.source === 'instant_legend' ? 'Instant Legend' : 'Approved Post'}
                        </div>
                      </div>
                    ) : (
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">
                          {post.source === 'instant_legend' ? 'Instant Legend' : 'Approved Post'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <span className={`${dancingScript.className} hidden`}>Lia</span>
    </section>
  );
}
