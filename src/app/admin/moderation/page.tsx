'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

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
  rejectionReason?: string | null;
};

export default function ModerationAdminPage() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');
  const [posts, setPosts] = useState<ModerationPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canQuery = token.trim().length > 0;

  const fetchPosts = async () => {
    if (!canQuery) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/moderation?status=${encodeURIComponent(status)}&token=${encodeURIComponent(token)}`);
      const data = (await res.json()) as unknown;
      const list =
        data && typeof data === 'object' && Array.isArray((data as { posts?: unknown }).posts)
          ? ((data as { posts: ModerationPost[] }).posts as ModerationPost[])
          : [];
      setPosts(list);
    } catch (e) {
      setPosts([]);
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // no auto fetch without token
  }, []);

  const pendingCount = useMemo(() => posts.filter((p) => p.status === 'Pending').length, [posts]);

  const moderate = async (id: string, action: 'approve' | 'reject') => {
    if (!canQuery) return;
    try {
      setLoading(true);
      setError(null);
      const rejectionReason = action === 'reject' ? 'Rejected by admin' : null;
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify({ action, id, rejectionReason }),
      });

      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as unknown;
        const msg = j && typeof j === 'object' && typeof (j as { error?: unknown }).error === 'string' ? (j as { error: string }).error : 'Request failed';
        throw new Error(msg);
      }

      await fetchPosts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Moderation failed');
    } finally {
      setLoading(false);
    }
  };

  const createManual = async () => {
    if (!canQuery) return;
    const mediaUrl = window.prompt('Media URL (public image/video URL):');
    if (!mediaUrl) return;
    const caption = window.prompt('Caption (optional):') || '';

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify({
          action: 'create',
          post: {
            source: 'manual',
            mediaUrl,
            caption: caption || null,
          },
        }),
      });

      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as unknown;
        const msg = j && typeof j === 'object' && typeof (j as { error?: unknown }).error === 'string' ? (j as { error: string }).error : 'Request failed';
        throw new Error(msg);
      }

      await fetchPosts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <section className="py-16">
        <div className="mx-auto w-full max-w-screen-2xl px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Admin</div>
            <h1 className="mt-4 text-4xl md:text-5xl font-light tracking-tight">Moderation Dashboard</h1>
            <p className="mt-4 text-white/70 max-w-2xl">
              Private approval console for René. Enter the admin token to view and moderate pending posts.
            </p>

            <div className="mt-10 grid gap-6 rounded-3xl border border-[#D4AF37]/20 bg-black/25 p-6">
              <div className="grid md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <label className="block text-sm font-semibold">Admin Token</label>
                  <input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Set ADMIN_TOKEN in Vercel and paste it here"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-sm font-semibold">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as typeof status)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0B1220] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="All">All</option>
                  </select>
                </div>

                <div className="md:col-span-3 flex gap-3">
                  <button
                    type="button"
                    onClick={fetchPosts}
                    disabled={!canQuery || loading}
                    className="w-full rounded-xl bg-[#D4AF37] text-slate-950 font-extrabold px-5 py-3 border border-white/10 hover:brightness-110 transition disabled:opacity-60"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="text-sm text-white/70">
                  Loaded: <span className="text-white font-semibold">{posts.length}</span>
                  {status === 'Pending' ? (
                    <span className="ml-2 text-[#D4AF37]/80">({pendingCount} pending)</span>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={createManual}
                  disabled={!canQuery || loading}
                  className="rounded-xl bg-white/10 text-white font-semibold px-5 py-3 border border-white/20 hover:bg-white/15 transition disabled:opacity-60"
                >
                  Create Manual Post
                </button>
              </div>

              {error ? <div className="text-sm text-red-200">{error}</div> : null}
            </div>

            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p) => {
                const isVideo = p.mediaUrl.toLowerCase().endsWith('.mp4');
                return (
                  <div key={p.id} className="rounded-3xl border border-[#D4AF37]/20 bg-black/25 overflow-hidden">
                    <div className="relative w-full aspect-[9/16]">
                      {isVideo ? (
                        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                          <source src={p.mediaUrl} type="video/mp4" />
                        </video>
                      ) : (
                        <Image
                          src={p.mediaUrl}
                          alt={p.caption || 'Post'}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/10 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">{p.source}</div>
                        <div className="mt-2 text-sm text-white/90 leading-relaxed line-clamp-4">{p.caption || '—'}</div>
                        <div className="mt-3 text-[11px] text-white/50">{p.createdAt}</div>
                        <div className="mt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() => moderate(p.id, 'approve')}
                            disabled={!canQuery || loading}
                            className="flex-1 rounded-xl bg-[#D4AF37] text-slate-950 font-extrabold px-4 py-3 border border-white/10 hover:brightness-110 transition disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => moderate(p.id, 'reject')}
                            disabled={!canQuery || loading}
                            className="flex-1 rounded-xl bg-white/10 text-white font-semibold px-4 py-3 border border-white/20 hover:bg-white/15 transition disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-white/10 flex items-center justify-between">
                      <div className="text-xs text-white/60">Status: {p.status}</div>
                      {p.metadataUrl ? (
                        <a
                          href={p.metadataUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#D4AF37] hover:underline"
                        >
                          Metadata
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
