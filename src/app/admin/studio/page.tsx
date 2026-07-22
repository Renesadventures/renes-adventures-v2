'use client';

import { useState } from 'react';
import { tours } from '@/data/tours';
import { PLATFORMS, CONTENT_ANGLES, type Platform } from '@/lib/content/social';

type CaptionResult = { caption: string; hashtags: string[] };

export default function ContentStudioPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');

  const [tourSlug, setTourSlug] = useState(tours[0]?.slug ?? 'custom-charter');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [angle, setAngle] = useState(CONTENT_ANGLES[0]);

  const [caption, setCaption] = useState<CaptionResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [reel, setReel] = useState<{ source: string; url?: string; primary?: string; note?: string } | null>(null);

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    const res = await fetch('/api/invoice/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setAuthed(true);
    else setAuthError('Wrong password.');
  }

  async function call<T>(url: string): Promise<T | null> {
    setError('');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tourSlug, platform, angle }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
      return null;
    }
    return data as T;
  }

  async function genCaption() {
    setBusy('caption');
    const d = await call<CaptionResult>('/api/content/caption');
    if (d) setCaption(d);
    setBusy(null);
  }
  async function genImage() {
    setBusy('image');
    const d = await call<{ url: string }>('/api/content/image');
    if (d) setImageUrl(d.url);
    setBusy(null);
  }
  async function genReel() {
    setBusy('reel');
    const d = await call<{ source: string; url?: string; primary?: string; note?: string }>('/api/content/reel');
    if (d) setReel(d);
    setBusy(null);
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#060608] text-white flex items-center justify-center px-4">
        <form onSubmit={handleAuth} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-xl font-semibold">Content Studio</h1>
          <p className="mt-1 text-sm text-white/60">Rene&apos;s Adventures · social engine</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="mt-5 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm outline-none focus:border-[#d4af37]"
          />
          {authError && <p className="mt-2 text-sm text-red-400">{authError}</p>}
          <button className="mt-4 w-full rounded-full bg-[#d4af37] py-2.5 font-extrabold text-slate-950 hover:brightness-110">
            Enter
          </button>
        </form>
      </main>
    );
  }

  const reelVideo = reel?.url || reel?.primary;

  return (
    <main className="min-h-screen bg-[#060608] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Content Studio</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Social engine</h1>
          </div>
          <a href="/blog" className="text-sm text-white/50 hover:text-white">View site →</a>
        </div>

        {/* Controls */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/50">Tour</span>
            <select
              value={tourSlug}
              onChange={(e) => setTourSlug(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-sm"
            >
              {tours.map((t) => (
                <option key={t.slug} value={t.slug}>{t.title}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/50">Platform</span>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-sm"
            >
              {PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-white/50">Angle</span>
            <select
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-sm"
            >
              {CONTENT_ANGLES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={genCaption} disabled={busy !== null}
            className="rounded-full bg-[#d4af37] px-5 py-2.5 font-bold text-slate-950 hover:brightness-110 disabled:opacity-50">
            {busy === 'caption' ? 'Writing…' : 'Generate caption'}
          </button>
          <button onClick={genImage} disabled={busy !== null}
            className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-bold hover:bg-white/10 disabled:opacity-50">
            {busy === 'image' ? 'Rendering…' : 'Generate image'}
          </button>
          <button onClick={genReel} disabled={busy !== null}
            className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-bold hover:bg-white/10 disabled:opacity-50">
            {busy === 'reel' ? 'Building…' : 'Generate reel'}
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 min-h-[180px]">
            <h2 className="text-sm uppercase tracking-wider text-emerald-400">Caption</h2>
            {caption ? (
              <div className="mt-3">
                <p className="whitespace-pre-wrap text-white/90 leading-relaxed">{caption.caption}</p>
                {caption.hashtags.length > 0 && (
                  <p className="mt-3 text-sm text-sky-300/80">{caption.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => copy(caption.caption)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10">Copy caption</button>
                  <button onClick={() => copy(caption.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' '))} className="rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10">Copy hashtags</button>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/40">Generate a caption to preview it here.</p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 min-h-[180px]">
            <h2 className="text-sm uppercase tracking-wider text-emerald-400">Visual</h2>
            {imageUrl && (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Generated" className="w-full rounded-xl border border-white/10" />
                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10">Open / download</a>
              </div>
            )}
            {reelVideo && (
              <div className="mt-4">
                <video src={reelVideo} controls playsInline className="w-full rounded-xl border border-white/10 max-h-[420px]" />
                {reel?.note && <p className="mt-2 text-xs text-white/40">{reel.note}</p>}
              </div>
            )}
            {!imageUrl && !reelVideo && (
              <p className="mt-3 text-sm text-white/40">Generate an image or reel to preview it here.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
