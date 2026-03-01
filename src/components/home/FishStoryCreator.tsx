'use client';

import Image from 'next/image';
import type { DragEvent, ChangeEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  Facebook,
  Hash,
  Instagram,
  MessageCircle,
  Mic,
  Pause,
  Play,
  PenLine,
  Sparkles,
  Volume2,
  Wand2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type GeneratedStory = {
  title: string;
  story: string;
  caption: string;
  hashtags: string;
  narration: string;
};

/* ------------------------------------------------------------------ */
/*  Canvas poster generation (1080×1350 IG format)                     */
/* ------------------------------------------------------------------ */

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
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

async function renderPoster(
  previewUrl: string,
  data: GeneratedStory
): Promise<string | null> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#082f49');
  bg.addColorStop(0.55, '#0f766e');
  bg.addColorStop(1, '#d1fae5');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Load user image
  const imgEl = new window.Image();
  // Only set crossOrigin for remote URLs — blob URLs don't support CORS
  // and setting this causes them to fail silently
  if (!previewUrl.startsWith('blob:')) {
    imgEl.crossOrigin = 'anonymous';
  }
  await new Promise<void>((resolve, reject) => {
    imgEl.onload = () => resolve();
    imgEl.onerror = () => reject(new Error('Image load failed'));
    imgEl.src = previewUrl;
  });

  const pad = 64;
  const imgTop = 88;
  const imgH = 720;
  const imgW = W - pad * 2;

  const srcAR = imgEl.width / imgEl.height;
  const dstAR = imgW / imgH;
  let sx = 0, sy = 0, sW = imgEl.width, sH = imgEl.height;
  if (srcAR > dstAR) { sW = Math.floor(imgEl.height * dstAR); sx = Math.floor((imgEl.width - sW) / 2); }
  else { sH = Math.floor(imgEl.width / dstAR); sy = Math.floor((imgEl.height - sH) / 2); }

  // Rounded clip
  ctx.save();
  ctx.beginPath();
  const r = 28;
  ctx.moveTo(pad + r, imgTop);
  ctx.lineTo(pad + imgW - r, imgTop);
  ctx.quadraticCurveTo(pad + imgW, imgTop, pad + imgW, imgTop + r);
  ctx.lineTo(pad + imgW, imgTop + imgH - r);
  ctx.quadraticCurveTo(pad + imgW, imgTop + imgH, pad + imgW - r, imgTop + imgH);
  ctx.lineTo(pad + r, imgTop + imgH);
  ctx.quadraticCurveTo(pad, imgTop + imgH, pad, imgTop + imgH - r);
  ctx.lineTo(pad, imgTop + r);
  ctx.quadraticCurveTo(pad, imgTop, pad + r, imgTop);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(imgEl, sx, sy, sW, sH, pad, imgTop, imgW, imgH);

  // Vignette
  const vig = ctx.createLinearGradient(0, imgTop, 0, imgTop + imgH);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(0.7, 'rgba(0,0,0,0.30)');
  vig.addColorStop(1, 'rgba(0,0,0,0.75)');
  ctx.fillStyle = vig;
  ctx.fillRect(pad, imgTop, imgW, imgH);
  ctx.restore();

  // Gold frame
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

  // Overlay tint
  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.fillRect(0, 0, W, H);

  // Dark text area
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(pad, imgTop + imgH + 36, imgW, H - (imgTop + imgH + 36) - pad);

  // Header
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = '700 52px ui-serif, Georgia, serif';
  ctx.fillText("RENE'S ADVENTURES", pad + 22, 66);

  // Stamp
  ctx.save();
  ctx.translate(W - pad - 220, imgTop + imgH - 64);
  ctx.rotate(-0.08);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 0, 210, 64);
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.strokeRect(0, 0, 210, 64);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255,255,255,0.85)';
  ctx.shadowBlur = 6;
  ctx.font = '900 30px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('BELIZE 2026', 18, 41);
  ctx.restore();

  // Story title + body
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 46px ui-serif, Georgia, serif';
  const titleY = imgTop + imgH + 110;
  wrapText(ctx, data.title.toUpperCase(), pad + 24, titleY - 24, imgW - 48, 44, 2);

  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = '500 34px ui-serif, Georgia, serif';
  wrapText(ctx, data.story, pad + 24, titleY + 76, imgW - 48, 44, 6);

  // Watermark
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.font = '800 90px ui-serif, Georgia, serif';
  ctx.fillText("RENE'S", pad + 18, imgTop + imgH - 70);

  // Footer badges
  ctx.fillStyle = 'rgba(245,158,11,0.95)';
  ctx.font = '700 30px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('Caribbean Gold Edition', pad + 24, H - 120);

  ctx.fillStyle = 'rgba(255,255,255,0.70)';
  ctx.font = '500 26px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('Instant Legend Poster', pad + 24, H - 84);

  return canvas.toDataURL('image/png');
}

/* ------------------------------------------------------------------ */
/*  Mock featured story (placeholder for the story wall)               */
/* ------------------------------------------------------------------ */

const MOCK_STORY: GeneratedStory = {
  title: 'The Sharks Came to Us',
  story:
    "She didn't move. None of us did. Captain René had cut \nthe engine at a spot he'd never marked on any map — \nhe just knew. Within minutes, nurse sharks appeared \nalongside the hull, slow and unbothered, circling as if \nthe boat had always belonged there. Every guest on board \nwent silent. No one reached for their phone. Some things \nyou just have to feel. Every single guest said the same \nthing on the way back: that was the moment.",
  caption:
    "When the ocean sends a message, you answer. 40lb mahi on the deep drop — Captain René called the spot. 🔥🎣",
  hashtags:
    '#RenesAdventures #BelizeFishing #AmbergrisCaye #MahiMahi #DeepSeaFishing #CaribbeanLife #SportFishing #BelizeTravel',
  narration:
    "I've anchored at that spot a hundred times. The sharks \ndon't come because we feed them. They come because the \nwater is right and they're curious. When you see a child \nlean over the rail and watch them without fear — that's \nBelize doing what Belize does.",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FishStoryCreator() {
  const base = 'https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev';
  const placeholderSrc = `${base}/images/man-holding-fresh-caught-mahi-mahi-on-ocean-boat-2025-01-07-04-47-33-utc.jpg`;

  /* --- File state ------------------------------------------------- */
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null); // data: URL for poster (no CORS)
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* --- AI state --------------------------------------------------- */
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* --- Narration state -------------------------------------------- */
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* --- Poster state ----------------------------------------------- */
  const [posterDataUrl, setPosterDataUrl] = useState<string | null>(null);

  /* --- Personal story state --------------------------------------- */
  const [personalStory, setPersonalStory] = useState('');
  const [userName, setUserName] = useState('');

  /* --- Display story (real or mock) ------------------------------- */
  const displayStory = story || MOCK_STORY;
  const isReal = !!story;

  /* --- Poster text (personal story overrides AI story) ------------ */
  const posterStory = useMemo(() => {
    const v = personalStory.trim();
    if (v.length >= 10) return v;
    return displayStory.story;
  }, [personalStory, displayStory.story]);

  /* --- Re-render poster when personal story changes --------------- */
  useEffect(() => {
    if (!story || !imageDataUrl) return;
    let cancelled = false;
    (async () => {
      try {
        const url = await renderPoster(imageDataUrl, {
          ...story,
          story: personalStory.trim().length >= 10 ? personalStory.trim() : story.story,
        });
        if (!cancelled && url) setPosterDataUrl(url);
      } catch (err) {
        console.error('Poster re-render failed:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [personalStory, imageDataUrl, story]);

  /* --- File handling ---------------------------------------------- */
  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) {
      setError('Please upload an image or video file.');
      return;
    }
    setError(null);
    setFile(f);
    // Blob URL for fast <Image> preview
    const url = URL.createObjectURL(f);
    setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
    // Data URL for canvas poster (zero CORS issues)
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') setImageDataUrl(reader.result); };
    reader.readAsDataURL(f);
    setStory(null);
    setAudioUrl(null);
    setPosterDataUrl(null);
    setPersonalStory('');
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onBrowse = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] || null);
  };

  /* --- AI story generation ---------------------------------------- */
  const generate = async () => {
    if (!file || !imageDataUrl) {
      setError('Upload a photo first.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setAudioUrl(null);

    try {
      // Extract raw base64 from the stored data URL
      const base64 = imageDataUrl.split(',')[1] || '';

      const res = await fetch('/api/ai/fish-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          userName: userName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Story generation failed.');
        return;
      }

      const generated: GeneratedStory = {
        title: data.title,
        story: data.story,
        caption: data.caption,
        hashtags: data.hashtags,
        narration: data.narration,
      };

      setStory(generated);

      // Auto-generate poster using data URL (no CORS)
      try {
        const posterUrl = await renderPoster(imageDataUrl, {
          ...generated,
          story: personalStory.trim().length >= 10 ? personalStory.trim() : generated.story,
        });
        if (posterUrl) setPosterDataUrl(posterUrl);
      } catch (err) {
        console.error('Poster generation failed:', err);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  /* --- ElevenLabs narration -------------------------------------- */
  const narrate = async () => {
    const text = story?.narration || story?.story;
    if (!text) return;

    setIsNarrating(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Narration failed.');
        return;
      }

      setAudioUrl(data.audioUrl);

      // Auto-play
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 100);
    } catch {
      setError('Narration unavailable. Please try again.');
    } finally {
      setIsNarrating(false);
    }
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) { el.play().catch(() => {}); setIsPlaying(true); }
    else { el.pause(); setIsPlaying(false); }
  };

  /* --- Download poster ------------------------------------------- */
  const downloadPoster = () => {
    if (!posterDataUrl) {
      setError('Generate your story first to create a poster.');
      return;
    }
    const a = document.createElement('a');
    a.href = posterDataUrl;
    a.download = `fish-story-${Date.now()}.png`;
    a.click();
  };

  /* --- Share helpers ---------------------------------------------- */
  const shareText = story
    ? `${story.caption}\n\n${story.hashtags}`
    : '';

  const shareToWhatsApp = () => {
    if (!shareText) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const copyCaption = async () => {
    if (!shareText) return;
    try {
      await navigator.clipboard.writeText(shareText);
      setError(null);
    } catch {
      // Fallback
    }
  };

  /* --- Render ---------------------------------------------------- */
  return (
    <section id="fish-story-lab" className="w-full bg-gradient-to-b from-sky-950 via-teal-800 to-emerald-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-white/75 ring-1 ring-black/5 shadow-[0_22px_70px_rgba(15,23,42,0.18)] overflow-hidden">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[55%_45%]">

            {/* ========== LEFT: Upload + Controls ========== */}
            <div className="p-6 sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 ring-1 ring-black/10">
                <Camera className="h-4 w-4 text-amber-600" />
                Fish Story Lab
              </div>

              <h2 className="mt-5 text-3xl sm:text-4xl font-serif tracking-tight text-slate-950">
                Your Adventure, Immortalized
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-700">
                Upload your photo. Get an epic story, cinematic narration, and an Instagram-ready poster — instantly.
              </p>

              {/* Name input */}
              <div className="mt-6">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Who&apos;s the legend in this story?
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name (e.g. Jake, The Rodriguez Family)"
                  maxLength={60}
                  className="mt-1.5 w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              {/* Drop zone */}
              <div
                className={`mt-8 rounded-3xl border border-dashed p-6 transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-amber-500 bg-amber-500/10 shadow-[0_18px_60px_rgba(245,158,11,0.18)]'
                    : 'border-black/10 bg-white/60 hover:border-black/20'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={onBrowse}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white ring-1 ring-black/10">
                    <Camera className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-slate-950">
                    Drag &amp; drop a photo or video
                  </div>
                  <div className="mt-1 text-xs text-slate-600">or click to browse</div>
                  {file && (
                    <div className="mt-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-black/10">
                      {file.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-500/20">
                  {error}
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={generate}
                  disabled={!file || isGenerating}
                  className="group relative inline-flex flex-1 items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-black shadow-lg shadow-amber-500/20 transition-colors duration-300 hover:bg-amber-400 disabled:opacity-60"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4 animate-spin" />
                      Creating Your Legend…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate My Epic Story
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={downloadPoster}
                  disabled={!posterDataUrl}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-50 hover:border-black/20 disabled:opacity-60"
                >
                  Download Poster
                </button>
              </div>

              {/* ---------- Story Preview ---------- */}
              <div className="mt-8 grid grid-cols-1 gap-4">
                <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-amber-500/25">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                      {isReal ? 'Your Story' : 'Story Preview'}
                    </div>
                  </div>
                  <div className="mt-2 text-lg font-serif font-bold text-slate-950">
                    {displayStory.title}
                  </div>
                  <div className="mt-2 text-base font-serif leading-relaxed text-slate-900">
                    {displayStory.story}
                  </div>
                </div>

                {/* ---------- Narration ---------- */}
                <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-black/10">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                      Captain&apos;s Narration
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-500/20">
                      <Volume2 className="h-3 w-3" /> Voice Experience
                    </div>
                  </div>
                  <div className="mt-2 text-sm italic text-slate-700">
                    &ldquo;{displayStory.narration}&rdquo;
                  </div>

                  {audioUrl && (
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  )}

                  <div className="mt-4 flex items-center gap-3">
                    {audioUrl ? (
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors duration-300 hover:bg-amber-400"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {isPlaying ? 'Pause' : 'Play Narration'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={narrate}
                        disabled={!story || isNarrating}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-black/10 transition-colors duration-300 hover:bg-slate-50 disabled:opacity-60"
                      >
                        <Mic className="h-4 w-4 text-amber-600" />
                        {isNarrating ? 'Generating Voice…' : 'Generate Narration'}
                      </button>
                    )}
                    <div className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-black/10">
                      Voice: Captain René
                    </div>
                  </div>
                </div>

                {/* ---------- Caption + Hashtags ---------- */}
                <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-amber-500/25">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                      Caption &amp; Hashtags
                    </div>
                    {isReal && (
                      <button
                        type="button"
                        onClick={copyCaption}
                        className="text-[10px] font-semibold text-amber-600 hover:text-amber-700"
                      >
                        Copy to clipboard
                      </button>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-slate-900">{displayStory.caption}</div>
                  <div className="mt-2 flex items-start gap-2">
                    <Hash className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600" />
                    <div className="text-xs text-sky-700 leading-relaxed">{displayStory.hashtags}</div>
                  </div>
                </div>

                {/* ---------- Share ---------- */}
                <div className="rounded-3xl bg-white/70 p-5 ring-1 ring-amber-500/25">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                    Share Your Story
                  </div>
                  <div className="mt-2 text-sm text-slate-700">Your adventure deserves an audience</div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={copyCaption}
                      disabled={!story}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/40 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:bg-amber-50 disabled:opacity-60"
                    >
                      <Instagram className="h-4 w-4 text-amber-600" />
                      Instagram
                    </button>
                    <button
                      type="button"
                      onClick={copyCaption}
                      disabled={!story}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/40 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:bg-amber-50 disabled:opacity-60"
                    >
                      <Facebook className="h-4 w-4 text-amber-600" />
                      Facebook
                    </button>
                    <button
                      type="button"
                      onClick={shareToWhatsApp}
                      disabled={!story}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/40 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors duration-300 hover:bg-amber-50 disabled:opacity-60"
                    >
                      <MessageCircle className="h-4 w-4 text-amber-600" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========== RIGHT: Preview + Info ========== */}
            <div className="border-t border-black/5 lg:border-t-0 lg:border-l border-black/5 bg-white/60 p-6 sm:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                Poster Preview
              </div>

              {/* Poster preview */}
              <div className="mt-5">
                <div className="rounded-3xl bg-white ring-1 ring-amber-500/25 shadow-[0_18px_60px_rgba(245,158,11,0.16)] overflow-hidden">
                  <div className="relative aspect-[4/5]">
                    {posterDataUrl ? (
                      /* Show the ACTUAL generated poster */
                      <Image
                        src={posterDataUrl}
                        alt="Your generated poster"
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-contain"
                      />
                    ) : (
                      /* Show photo with CSS poster mockup */
                      <>
                        <Image
                          src={previewUrl || placeholderSrc}
                          alt="Your adventure poster"
                          fill
                          unoptimized
                          sizes="(min-width: 1024px) 45vw, 100vw"
                          className="object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                          <img
                            src="https://pub-8e7f552f8b074b919187d54bd9b298bb.r2.dev/images/Poster_Gemini.png"
                            alt="Your adventure poster"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white text-xs font-bold tracking-widest uppercase mb-1">
                              Poster Preview
                            </p>
                            <p className="text-white/80 text-[10px]">
                              Your adventure. Your legend. Your poster.
                            </p>
                          </div>
                        </div>

                        <div className="absolute left-5 top-5 rounded-full bg-black/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white ring-1 ring-white/20 backdrop-blur">
                          Rene&apos;s Adventures
                        </div>

                        <div
                          className="absolute right-5 bottom-5 -rotate-6 rounded-xl bg-amber-500 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white ring-1 ring-white/50"
                          style={{ textShadow: '0 2px 0 rgba(255,255,255,0.65)' }}
                        >
                          Belize 2026
                        </div>

                        <div className="absolute inset-x-5 bottom-24">
                          <div className="rounded-2xl bg-black/55 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-200">
                              {displayStory.title}
                            </div>
                            <div className="mt-3 text-sm leading-relaxed text-white/90">
                              {posterStory.slice(0, 120)}…
                            </div>
                            <div className="mt-4 text-xs font-semibold text-white/70">
                              {previewUrl ? '1080×1350 • Your Poster' : 'Your adventure. Your legend. Your poster.'}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="mt-6 rounded-2xl bg-white/70 p-4 ring-1 ring-black/10">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                  How it works
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  Upload a photo, we create your epic story, poster, and narration in Captain René&apos;s voice. Download and share everywhere.
                </div>
              </div>

              {/* Your Side of the Story */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 p-5 ring-2 ring-amber-400/40 shadow-sm">
                <div className="flex items-center gap-2">
                  <PenLine className="h-5 w-5 text-amber-700" />
                  <span className="text-base font-bold text-slate-950">Your Side of the Story</span>
                </div>
                <div className="mt-2 text-sm font-medium text-slate-800">
                  Every photo has a real story behind it — write yours. Your words replace the generated text on the poster.
                </div>
                <textarea
                  value={personalStory}
                  onChange={(e) => setPersonalStory(e.target.value)}
                  placeholder="The sun was barely up when Captain René said 'hold on tight'…"
                  rows={4}
                  maxLength={500}
                  className="mt-3 w-full rounded-xl border-2 border-amber-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-200 resize-none"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-600">
                    {personalStory.length}/500
                  </div>
                  {personalStory.length > 10 ? (
                    <div className="text-xs font-bold text-emerald-700">
                      ✓ Your words are on the poster
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-amber-700">
                      Write 10+ characters to personalize your poster
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 text-xs text-slate-600">
                Tip: For best results, use a well-lit photo with the catch and angler visible. Portrait orientation works best for posters.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
