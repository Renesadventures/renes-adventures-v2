'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Dancing_Script } from 'next/font/google';
import { buildLiasTaleForAsset } from '@/lib/utils/lia-tales';

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '600'] });

type PosterPreset = {
  width: number;
  height: number;
  safeBottom: number;
};

const INSTAGRAM_PORTRAIT: PosterPreset = {
  width: 1080,
  height: 1350,
  safeBottom: 210,
};

function formatSealText(text: string) {
  return text.toUpperCase();
}

function drawHeritageSeal(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const gold = '#D4AF37';

  ctx.save();
  ctx.translate(x, y);

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.strokeStyle = gold;
  ctx.lineWidth = Math.max(3, r * 0.08);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(212,175,55,0.55)';
  ctx.lineWidth = Math.max(2, r * 0.05);
  ctx.stroke();

  // Simple monogram anchor
  ctx.fillStyle = 'rgba(212,175,55,0.95)';
  ctx.font = `600 ${Math.round(r * 0.9)}px ui-serif, Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('R', 0, 2);

  // Ring text (approx) - top + bottom
  ctx.fillStyle = 'rgba(248,250,252,0.85)';
  ctx.font = `600 ${Math.round(r * 0.22)}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(formatSealText("Rene's Adventures"), 0, -r * 0.55);
  ctx.fillText(formatSealText('Ambergris Caye • Belize'), 0, r * 0.72);

  ctx.restore();
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export default function InstantLegendPoster() {
  const [fileName, setFileName] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [legendVariant, setLegendVariant] = useState(0);
  const [renderNonce, setRenderNonce] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const preset = INSTAGRAM_PORTRAIT;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = preset.width;
    canvas.height = preset.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background base
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!imageUrl) {
      // Placeholder state
      ctx.fillStyle = 'rgba(248,250,252,0.06)';
      drawRoundedRect(ctx, 70, 70, canvas.width - 140, canvas.height - 140, 44);
      ctx.fill();

      ctx.fillStyle = 'rgba(212,175,55,0.9)';
      ctx.font = '700 42px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Upload a photo to mint your legend', canvas.width / 2, canvas.height / 2);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    const draw = () => {
      // Clear
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Frame
      const frameInset = 56;
      const frameX = frameInset;
      const frameY = frameInset;
      const frameW = canvas.width - frameInset * 2;
      const frameH = canvas.height - frameInset * 2;

      // Image crop (cover)
      const targetW = frameW;
      const targetH = frameH;

      const scale = Math.max(targetW / img.width, targetH / img.height);
      const sw = targetW / scale;
      const sh = targetH / scale;
      const sx = (img.width - sw) / 2;
      const sy = Math.max(0, (img.height - sh) * 0.2);

      // Rounded clip for image
      ctx.save();
      drawRoundedRect(ctx, frameX, frameY, frameW, frameH, 46);
      ctx.clip();
      ctx.drawImage(img, sx, sy, sw, sh, frameX, frameY, frameW, frameH);

      // Cinematic overlay
      const g = ctx.createLinearGradient(0, frameY, 0, frameY + frameH);
      g.addColorStop(0, 'rgba(15,23,42,0.00)');
      g.addColorStop(0.72, 'rgba(15,23,42,0.18)');
      g.addColorStop(1, 'rgba(15,23,42,0.72)');
      ctx.fillStyle = g;
      ctx.fillRect(frameX, frameY, frameW, frameH);
      ctx.restore();

      // Gold border
      ctx.save();
      drawRoundedRect(ctx, frameX, frameY, frameW, frameH, 46);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 10;
      ctx.shadowColor = 'rgba(212,175,55,0.25)';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      // Instant Legend title band
      ctx.save();
      ctx.fillStyle = 'rgba(15,23,42,0.55)';
      drawRoundedRect(ctx, frameX + 26, frameY + 26, frameW - 52, 86, 28);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212,175,55,0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = 'rgba(212,175,55,0.98)';
      ctx.font = '800 34px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('INSTANT LEGEND', frameX + frameW / 2, frameY + 26 + 43);
      ctx.restore();

      // Seal
      drawHeritageSeal(ctx, frameX + 120, frameY + 140, 72);

      // Caption block
      const captionH = preset.safeBottom;
      const capX = frameX;
      const capY = frameY + frameH - captionH;
      const capW = frameW;

      ctx.save();
      const capGrad = ctx.createLinearGradient(0, capY, 0, capY + captionH);
      capGrad.addColorStop(0, 'rgba(15,23,42,0.05)');
      capGrad.addColorStop(0.25, 'rgba(15,23,42,0.55)');
      capGrad.addColorStop(1, 'rgba(15,23,42,0.92)');
      ctx.fillStyle = capGrad;
      drawRoundedRect(ctx, capX, capY, capW, captionH, 46);
      ctx.fill();
      ctx.restore();

      // Caption text
      ctx.save();
      ctx.fillStyle = 'rgba(248,250,252,0.94)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Attempt to use Dancing Script if loaded
      ctx.font = `600 52px "Dancing Script", ${dancingScript.style.fontFamily}, ui-serif, Georgia, serif`;

      const padding = 44;
      const maxWidth = capW - padding * 2;
      const lines: string[] = [];
      const words = (caption || '').replace(/\s+/g, ' ').trim().split(' ');

      let line = '';
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (ctx.measureText(test).width > maxWidth) {
          if (line) lines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);

      const maxLines = 4;
      const clipped = lines.slice(0, maxLines);
      const lineHeight = 58;
      let ty = capY + 34;
      for (const l of clipped) {
        ctx.fillText(l, capX + padding, ty);
        ty += lineHeight;
      }
      ctx.restore();

      // Footer signature
      ctx.save();
      ctx.fillStyle = 'rgba(212,175,55,0.95)';
      ctx.font = '700 22px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Rene’s Adventures • #InstantLegend', frameX + frameW - 28, frameY + frameH - 22);
      ctx.restore();
    };

    img.onload = () => {
      draw();
    };

    img.onerror = () => {
      // Fallback draw
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(248,250,252,0.7)';
      ctx.font = '600 28px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Could not load that image. Try another file.', canvas.width / 2, canvas.height / 2);
    };
  }, [caption, imageUrl, preset.height, preset.safeBottom, preset.width, renderNonce]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const a = document.createElement('a');
    a.download = `renes-instant-legend-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  const whatsAppLink = useMemo(() => {
    const message = `Hi René! I just minted my Instant Legend poster.\n\nCaption:\n${caption || ''}\n\nI’m sending the image next.`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }, [caption]);

  const submitToWall = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!imageUrl) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmittedId(null);

    try {
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (!b) reject(new Error('Failed to export poster PNG.'));
            else resolve(b);
          },
          'image/png',
          0.92
        );
      });

      const file = new File([blob], `instant-legend-${Date.now()}.png`, { type: 'image/png' });
      const form = new FormData();
      form.append('photo', file);
      form.append('tourType', 'Instant Legend');
      form.append('storyText', caption || '');
      form.append('width', String(1080));
      form.append('height', String(1350));

      const uploadRes = await fetch('/api/upload-story-photo', {
        method: 'POST',
        body: form,
      });

      const uploadJson = (await uploadRes.json().catch(() => null)) as unknown;
      if (!uploadRes.ok || !uploadJson || typeof uploadJson !== 'object') {
        const msg =
          uploadJson && typeof (uploadJson as { error?: unknown }).error === 'string'
            ? (uploadJson as { error: string }).error
            : 'Upload failed.';
        throw new Error(msg);
      }

      const photoUrl = (uploadJson as { photoUrl?: unknown }).photoUrl;
      const metadataUrl = (uploadJson as { metadataUrl?: unknown }).metadataUrl;
      if (typeof photoUrl !== 'string' || !photoUrl) {
        throw new Error('Upload response missing photoUrl.');
      }

      const modRes = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          post: {
            source: 'instant_legend',
            mediaUrl: photoUrl,
            caption: caption || null,
            metadataUrl: typeof metadataUrl === 'string' ? metadataUrl : null,
          },
        }),
      });

      const modJson = (await modRes.json().catch(() => null)) as unknown;
      if (!modRes.ok || !modJson || typeof modJson !== 'object') {
        const msg =
          modJson && typeof (modJson as { error?: unknown }).error === 'string'
            ? (modJson as { error: string }).error
            : 'Submission failed.';
        throw new Error(msg);
      }

      const postId = (modJson as { post?: { id?: unknown } }).post?.id;
      setSubmittedId(typeof postId === 'string' ? postId : 'submitted');
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#1E293B] shadow-2xl overflow-hidden">
      <div className="p-8 md:p-10">
        <div className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/80">Instant Legend Poster</div>
        <h2 className="mt-4 text-3xl md:text-4xl font-light text-[#F8FAFC] tracking-tight">Turn your photo into a charter-grade legend</h2>
        <p className="mt-3 text-[#F8FAFC]/70 max-w-2xl">
          Upload a shot, let Lia stamp it with a story, then download a 4:5 Instagram-ready poster.
        </p>

        <div className="mt-8 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <label className="block text-sm font-semibold text-[#F8FAFC]">Upload your photo</label>
              <input
                type="file"
                accept="image/*"
                className="mt-3 block w-full text-sm text-[#F8FAFC]/70 file:mr-4 file:rounded-xl file:border file:border-[#D4AF37]/30 file:bg-[#0F172A] file:px-4 file:py-2 file:text-[#D4AF37] file:font-semibold hover:file:border-[#D4AF37]"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setFileName(f.name);
                  setLegendVariant(0);
                  const url = URL.createObjectURL(f);
                  setImageUrl((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return url;
                  });

                  setCaption(buildLiasTaleForAsset(f.name).legend);
                  setRenderNonce((n) => n + 1);
                }}
              />

              <div className="mt-6">
                <label className="block text-sm font-semibold text-[#F8FAFC]">Caption (Lia&apos;s Tale)</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={6}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-[#0F172A] text-[#F8FAFC] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                />
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl bg-[#D4AF37] text-slate-950 font-extrabold px-5 py-3 border border-white/10 hover:brightness-110 transition"
                    onClick={() => {
                      setLegendVariant((v) => v + 1);
                      setCaption(buildLiasTaleForAsset(`${fileName || 'my-story'}|v${legendVariant + 1}`).legend);
                      setRenderNonce((n) => n + 1);
                    }}
                    disabled={!imageUrl}
                  >
                    Generate a New Legend
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 text-white font-semibold px-5 py-3 border border-white/20 hover:bg-white/15 transition"
                    onClick={() => setRenderNonce((n) => n + 1)}
                    disabled={!imageUrl}
                  >
                    Re-render Poster
                  </button>
                </div>

                <div className="mt-4 text-xs text-[#F8FAFC]/60 leading-relaxed">
                  Tip: Download first, then tap “Send to René” and attach the image in WhatsApp.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-black/25 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#F8FAFC]">Preview</div>
                  <div className="text-xs text-[#F8FAFC]/60">1080×1350 • Instagram Portrait</div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl overflow-hidden border border-[#D4AF37]/20 bg-[#0F172A]">
                <div className="relative w-full aspect-[4/5]">
                  <canvas ref={canvasRef} className="w-full h-full" />
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={download}
                  className="w-full rounded-xl bg-[#D4AF37] text-slate-950 font-extrabold px-6 py-4 border border-white/10 hover:brightness-110 transition"
                  disabled={!imageUrl}
                >
                  Download for Instagram
                </button>
                <button
                  type="button"
                  onClick={submitToWall}
                  disabled={!imageUrl || submitting}
                  className="w-full rounded-xl bg-white/10 text-white font-semibold px-6 py-4 border border-white/20 hover:bg-white/15 transition disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit to Social Wall (Needs Approval)'}
                </button>
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-white/10 text-white font-semibold px-6 py-4 border border-white/20 hover:bg-white/15 transition"
                >
                  Send to René (WhatsApp)
                </a>

                {submitError ? <div className="text-sm text-red-200">{submitError}</div> : null}
                {submittedId ? (
                  <div className="text-sm text-[#D4AF37]/90">
                    Submitted. René will approve it before it appears on the Social Wall.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Font prewarm so canvas can use it */}
        <span className={`${dancingScript.className} hidden`}>Lia</span>
      </div>
    </div>
  );
}
