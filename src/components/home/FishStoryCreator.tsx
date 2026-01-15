'use client';

import Image from 'next/image';
import type { DragEvent, ChangeEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import { Camera } from 'lucide-react';

type GeneratedStory = {
  title: string;
  body: string;
  tagline: string;
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const words = text.split(/\s+/).filter(Boolean);
  let line = '';
  const lines: string[] = [];

  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
      continue;
    }

    if (line) lines.push(line);
    line = w;

    if (lines.length >= maxLines) break;
  }

  if (lines.length < maxLines && line) lines.push(line);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i]!, x, y + i * lineHeight);
  }

  return lines.length;
}

function makeStory(seed: { month: string; interests: string[] }) {
  const adjectives = ['obsidian', 'golden', 'salt-kissed', 'mythic', 'storm-tested', 'tide-born', 'sunlit', 'legendary'] as const;
  const verbs = ['charged', 'glided', 'hunted', 'surged', 'danced', 'tracked', 'hooked', 'landed'] as const;
  const places = ['the reef edge', 'the deep blue', 'the mangrove line', 'the channel', 'the open sea', 'the drop-off'] as const;

  const a = adjectives[Math.floor(Math.random() * adjectives.length)]!;
  const v = verbs[Math.floor(Math.random() * verbs.length)]!;
  const p = places[Math.floor(Math.random() * places.length)]!;

  const focus = seed.interests.slice(0, 3).join(', ') || 'Fishing';

  const title = 'Your Fish Story, Immortalized';
  const tagline = `Belize • ${seed.month} • ${focus}`;
  const body = `On a ${a} morning in Belize, we ${v} toward ${p}. The water was glass until it wasn’t—then the strike hit like thunder. A single pull became a battle, and a battle became a memory you’ll tell forever. This isn’t just a catch. It’s proof you showed up for the ocean and the ocean answered.`;

  return { title, tagline, body } satisfies GeneratedStory;
}

export default function FishStoryCreator() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [interests] = useState<string[]>(['Fishing', 'Reef', 'Adventure']);
  const [visitMonth] = useState<string>(() => {
    const m = new Date().toLocaleString(undefined, { month: 'short' });
    return m || 'Belize';
  });

  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const poster = useMemo(() => {
    if (!story) return null;
    return story;
  }, [story]);

  const handleFile = (f: File | null) => {
    if (!f) return;

    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    setError(null);
    setFile(f);

    const url = URL.createObjectURL(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    setStory(null);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    handleFile(f);
  };

  const onBrowse = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    handleFile(f);
  };

  const generate = async () => {
    if (!file || !previewUrl) {
      setError('Upload a photo first.');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      await new Promise((r) => setTimeout(r, 700));
      const s = makeStory({ month: visitMonth, interests });
      setStory(s);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPoster = async () => {
    if (!previewUrl || !poster) {
      setError('Generate your story first.');
      return;
    }

    setError(null);

    const W = 1080;
    const H = 1350;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#082f49');
    bg.addColorStop(0.55, '#0f766e');
    bg.addColorStop(1, '#d1fae5');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const imgEl = new window.Image();
    imgEl.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      imgEl.onload = () => resolve();
      imgEl.onerror = () => reject(new Error('Image failed to load for download'));
      imgEl.src = previewUrl;
    });

    const pad = 64;
    const imgTop = 88;
    const imgH = 720;
    const imgW = W - pad * 2;

    const srcAR = imgEl.width / imgEl.height;
    const dstAR = imgW / imgH;

    let sx = 0;
    let sy = 0;
    let sW = imgEl.width;
    let sH = imgEl.height;

    if (srcAR > dstAR) {
      sW = Math.floor(imgEl.height * dstAR);
      sx = Math.floor((imgEl.width - sW) / 2);
    } else {
      sH = Math.floor(imgEl.width / dstAR);
      sy = Math.floor((imgEl.height - sH) / 2);
    }

    ctx.save();
    ctx.beginPath();
    const r = 28;
    const x = pad;
    const y = imgTop;
    const w = imgW;
    const h = imgH;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(imgEl, sx, sy, sW, sH, pad, imgTop, imgW, imgH);

    const vignette = ctx.createLinearGradient(0, imgTop, 0, imgTop + imgH);
    vignette.addColorStop(0, 'rgba(0,0,0,0.0)');
    vignette.addColorStop(0.7, 'rgba(0,0,0,0.30)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = vignette;
    ctx.fillRect(pad, imgTop, imgW, imgH);

    ctx.restore();

    const frameGrad = ctx.createLinearGradient(pad, imgTop, pad + imgW, imgTop + imgH);
    frameGrad.addColorStop(0, '#fde68a');
    frameGrad.addColorStop(0.45, '#f59e0b');
    frameGrad.addColorStop(1, '#fef3c7');

    ctx.lineWidth = 18;
    ctx.strokeStyle = frameGrad;
    ctx.strokeRect(pad - 10, imgTop - 10, imgW + 20, imgH + 20);

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.strokeRect(pad - 22, imgTop - 22, imgW + 44, imgH + 44);

    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(pad, imgTop + imgH + 36, imgW, H - (imgTop + imgH + 36) - pad);

    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '700 52px ui-serif, Georgia, serif';
    ctx.fillText("RENE'S ADVENTURES", pad + 22, 66);

    ctx.save();
    ctx.translate(W - pad - 150, 92);
    ctx.rotate(-0.12);
    ctx.fillStyle = 'rgba(245,158,11,0.18)';
    ctx.fillRect(0, 0, 150, 56);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(245,158,11,0.75)';
    ctx.strokeRect(0, 0, 150, 56);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '800 28px ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif';
    ctx.fillText('BELIZE 2026', 14, 38);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 46px ui-serif, Georgia, serif';
    const titleY = imgTop + imgH + 110;
    wrapText(ctx, poster.tagline.toUpperCase(), pad + 24, titleY - 24, imgW - 48, 44, 2);

    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '500 34px ui-serif, Georgia, serif';
    const bodyY = titleY + 76;
    wrapText(ctx, poster.body, pad + 24, bodyY, imgW - 48, 44, 6);

    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.font = '800 90px ui-serif, Georgia, serif';
    ctx.fillText("RENE'S", pad + 18, imgTop + imgH - 70);

    ctx.fillStyle = 'rgba(245,158,11,0.95)';
    ctx.font = '700 30px ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif';
    ctx.fillText('Caribbean Gold Edition', pad + 24, H - 90);

    ctx.fillStyle = 'rgba(255,255,255,0.70)';
    ctx.font = '500 26px ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif';
    ctx.fillText('Instant Legend Poster', pad + 24, H - 54);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `fish-story-${Date.now()}.png`;
    a.click();
  };

  return (
    <section className="w-full bg-gradient-to-b from-sky-950 via-teal-800 to-emerald-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-white/75 ring-1 ring-black/5 shadow-[0_22px_70px_rgba(15,23,42,0.18)] overflow-hidden">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[55%_45%]">
            <div className="p-6 sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 ring-1 ring-black/10">
                <Camera className="h-4 w-4 text-amber-600" />
                Fish Story Lab
              </div>

              <h2 className="mt-5 text-3xl sm:text-4xl font-serif tracking-tight text-slate-950">
                Your Fish Story, Immortalized
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-700">
                Upload a photo. Get an epic AI story. Download an Instagram-ready poster in Caribbean Gold.
              </p>

              <div
                className={`mt-8 rounded-3xl border border-dashed p-6 transition-all duration-300 ${
                  isDragging
                    ? 'border-amber-500 bg-amber-500/10 shadow-[0_18px_60px_rgba(245,158,11,0.18)]'
                    : 'border-black/10 bg-white/60 hover:border-black/20'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
              >
                <input ref={inputRef} type="file" accept="image/*" onChange={onBrowse} className="hidden" />

                <div className="flex flex-col items-center justify-center text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white ring-1 ring-black/10">
                    <Camera className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-slate-950">Drag & drop a photo</div>
                  <div className="mt-1 text-xs text-slate-600">or click to browse</div>

                  {file ? (
                    <div className="mt-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-black/10">
                      {file.name}
                    </div>
                  ) : null}
                </div>
              </div>

              {error ? (
                <div className="mt-5 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-500/20">
                  {error}
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={generate}
                  disabled={!file || isGenerating}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-black shadow-lg shadow-amber-500/20 transition-colors duration-300 hover:bg-amber-400 disabled:opacity-60"
                >
                  {isGenerating ? 'Generating…' : 'Generate My Epic Story'}
                </button>
                <button
                  type="button"
                  onClick={downloadPoster}
                  disabled={!story || !previewUrl}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-50 hover:border-black/20 disabled:opacity-60"
                >
                  Download Poster
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4">
                <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-amber-500/25">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                    Story Preview
                  </div>
                  <div className="mt-3 text-base font-serif leading-relaxed text-slate-900">
                    {poster
                      ? poster.body
                      : 'The morning sun painted the Caribbean in shades of amber as Captain René pointed starboard...'}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-black/10">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                    Narration (Coming Soon)
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    ElevenLabs narration placeholder — soon you’ll be able to generate an audio version of your story.
                  </div>
                  <div className="mt-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-black/10">
                    Voice: Captain René
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-black/5 lg:border-t-0 lg:border-l border-black/5 bg-white/60 p-6 sm:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                Preview
              </div>

              <div className="mt-5">
                <div className="rounded-3xl bg-white ring-1 ring-amber-500/25 shadow-[0_18px_60px_rgba(245,158,11,0.16)] overflow-hidden">
                  <div className="relative aspect-[4/5]">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt=""
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-slate-100 via-white to-amber-50">
                        <div className="text-center">
                          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white ring-1 ring-black/10">
                            <Camera className="h-6 w-6 text-amber-600" />
                          </div>
                          <div className="mt-3 text-sm font-semibold text-slate-900">Upload a photo to begin</div>
                          <div className="mt-1 text-xs text-slate-600">Poster preview will appear here</div>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    <div className="absolute inset-0 p-4">
                      <div className="h-full w-full rounded-2xl bg-gradient-to-br from-amber-200 via-amber-500 to-yellow-200 p-[3px]">
                        <div className="h-full w-full rounded-2xl ring-1 ring-white/40" />
                      </div>
                    </div>

                    <div className="absolute left-5 top-5 rounded-full bg-black/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white ring-1 ring-white/20 backdrop-blur">
                      Rene&apos;s Adventures
                    </div>

                    <div className="absolute right-5 top-5 -rotate-6 rounded-xl bg-amber-500/20 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white ring-1 ring-amber-400/40 backdrop-blur">
                      Belize 2026
                    </div>

                    <div className="absolute inset-x-5 bottom-5">
                      <div className="rounded-2xl bg-black/55 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                        <div className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-200">
                          {poster ? poster.tagline : 'Belize • Your Date • Your Style'}
                        </div>
                        <div className="mt-3 text-sm leading-relaxed text-white/90">
                          {poster
                            ? poster.body
                            : 'Generate your story to see the epic caption styled for Instagram-ready storytelling.'}
                        </div>
                        <div className="mt-4 text-xs font-semibold text-white/70">Format: 1080×1350</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white/70 p-4 ring-1 ring-black/10">
                  <div className="text-sm font-semibold text-slate-950">Caribbean Gold Frame</div>
                  <div className="mt-1 text-xs text-slate-600">
                    Ornate border, watermark, and stamp—styled for a clean IG post.
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white/70 p-4 ring-1 ring-black/10">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                  How it works
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  Upload a photo, generate your story, then download a ready-to-post poster.
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-500/20">
                <div className="text-sm font-semibold text-slate-900">AI Story Engine</div>
                <div className="mt-1 text-sm text-slate-700">
                  This is a placeholder generator for now. When you&apos;re ready, we can connect it to your real AI pipeline.
                </div>
              </div>

              <div className="mt-6 text-xs text-slate-600">
                Tip: For best results, use a photo with the fish + angler visible and a clear horizon.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
