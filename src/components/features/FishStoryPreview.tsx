'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';

export function FishStoryPreview() {
  const [email, setEmail] = useState('');
  const [tourType, setTourType] = useState('');
  const [storyText, setStoryText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    id: string;
    photoUrl: string;
    metadataUrl: string;
    uploadTimestamp: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setImageWidth(null);
      setImageHeight(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadResult(null);
    setError(null);

    const img = new window.Image();
    img.onload = () => {
      setImageWidth(img.width || null);
      setImageHeight(img.height || null);
    };
    img.onerror = () => {
      setImageWidth(null);
      setImageHeight(null);
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, previewUrl]);

  const canSubmit = useMemo(() => {
    return !!file && !isUploading;
  }, [file, isUploading]);

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (next: File | null) => {
    setFile(next);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0] || null;
    if (dropped) handleFileSelected(dropped);
  };

  const handleSubmit = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const form = new FormData();
      form.append('photo', file);
      if (email.trim()) form.append('email', email.trim());
      if (tourType.trim()) form.append('tourType', tourType.trim());
      if (storyText.trim()) form.append('storyText', storyText.trim());
      if (imageWidth) form.append('width', String(imageWidth));
      if (imageHeight) form.append('height', String(imageHeight));

      const res = await fetch('/api/upload-story-photo', {
        method: 'POST',
        body: form,
      });

      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg =
          typeof data === 'object' && data !== null && 'error' in data && typeof (data as { error?: unknown }).error === 'string'
            ? (data as { error: string }).error
            : 'Upload failed.';
        setError(errMsg);
        return;
      }

      setUploadResult({
        id: typeof data === 'object' && data !== null && 'id' in data ? String((data as { id: unknown }).id) : '',
        photoUrl:
          typeof data === 'object' && data !== null && 'photoUrl' in data
            ? String((data as { photoUrl: unknown }).photoUrl)
            : '',
        metadataUrl:
          typeof data === 'object' && data !== null && 'metadataUrl' in data
            ? String((data as { metadataUrl: unknown }).metadataUrl)
            : '',
        uploadTimestamp:
          typeof data === 'object' && data !== null && 'uploadTimestamp' in data
            ? String((data as { uploadTimestamp: unknown }).uploadTimestamp)
            : '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-tropical-party opacity-100" />
      <div className="absolute inset-0 opacity-[0.10]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.10) 35px, rgba(255,255,255,0.10) 70px), repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,0.08) 35px, rgba(255,255,255,0.08) 70px)',
          }}
        />
      </div>

      <div className="absolute inset-0 opacity-[0.35]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 28%, rgba(0, 206, 209, 0.28) 0%, transparent 45%), radial-gradient(circle at 82% 22%, rgba(255, 107, 53, 0.24) 0%, transparent 45%), radial-gradient(circle at 70% 82%, rgba(46, 204, 113, 0.22) 0%, transparent 52%), radial-gradient(circle at 25% 80%, rgba(139, 92, 246, 0.22) 0%, transparent 55%)',
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-screen-2xl px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-tropical-coral text-sm uppercase tracking-[0.3em] font-light">
              Coming Soon
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">
            Your Story,
            <span className="block font-serif italic text-tropical-coral">AI-Crafted</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-light">
            Turn your adventure into a cinematic story. Upload your photos and videos—our AI creates a personalized
            fish tale you&apos;ll share for years.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/15 hover:border-tropical-coral/60 transition-all group"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl">
              <Image
                src={`${base}/images/tours/deep-sea-fishing.jpg`}
                alt="The One That Got Away"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>

            <div className="p-8">
              <div className="mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-tropical-coral to-transparent mb-4" />
                <h3 className="text-2xl font-light text-white mb-3">The One That Got Away</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Dramatize your near-catches. AI analyzes your footage and creates a thrilling narrative of that epic
                battle with the trophy fish that escaped.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/15 hover:border-tropical-coral/60 transition-all group"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl">
              <Image
                src={`${base}/images/tours/hol-chan-snorkel.jpg`}
                alt="Swimming with Giants"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>

            <div className="p-8">
              <div className="mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-tropical-coral to-transparent mb-4" />
                <h3 className="text-2xl font-light text-white mb-3">Swimming with Giants</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Capture the awe of being inches from nurse sharks, manta rays, and sea turtles. AI identifies species and
                adds educational context to your underwater moments.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/15 hover:border-tropical-coral/60 transition-all group"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl">
              <Image
                src={`${base}/images/tours/sunset-cruise.jpg`}
                alt="Your Perfect Moment"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>

            <div className="p-8">
              <div className="mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-tropical-coral to-transparent mb-4" />
                <h3 className="text-2xl font-light text-white mb-3">Your Perfect Moment</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Every adventure has that moment. AI pinpoints your best shots—the perfect sunset, the catch photo, the
                celebration—and weaves them into a shareable reel.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-12 shadow-2xl overflow-hidden">
            <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-tropical-pink/25 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-28 w-[560px] h-[560px] bg-tropical-turquoise/22 rounded-full blur-3xl" />
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-tropical-purple/18 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-tropical-coral/10 border border-tropical-coral/30 rounded-full">
                <span className="w-2 h-2 bg-tropical-coral rounded-full animate-pulse" />
                <span className="text-tropical-coral text-sm font-medium tracking-wide">LAUNCHING SOON</span>
              </div>

              <h3 className="text-4xl font-light text-white mb-4">Fish Story Creator</h3>

              <p className="text-white/80 text-lg leading-relaxed mb-8 font-light">
                Upload your photos and videos from today&apos;s adventure. Our AI will:
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-tropical-coral" />
                  <span className="text-white/80">Identify fish species, marine life, and locations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-tropical-coral" />
                  <span className="text-white/80">Generate a personalized narrative with your voice</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-tropical-coral" />
                  <span className="text-white/80">Add cinematic effects, music, and captions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-tropical-coral" />
                  <span className="text-white/80">Export as a shareable 30-60 second reel for Instagram/TikTok</span>
                </li>
              </ul>

              <div className="bg-white/10 rounded-xl border border-white/15 p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleFileSelected(e.target.files?.[0] || null)}
                    />

                    <div
                      onClick={handlePickFile}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="cursor-pointer bg-white/10 rounded-xl border border-white/15 hover:border-tropical-turquoise/60 transition-colors p-6"
                    >
                      {!previewUrl ? (
                        <div className="text-center">
                          <p className="text-white font-semibold">Drop a photo here</p>
                          <p className="text-white/60 text-sm mt-1">or click to choose (JPG, PNG, WebP • max 10MB)</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black/40">
                            {previewUrl && (
                              <Image
                                src={previewUrl}
                                alt="Selected upload"
                                width={1280}
                                height={720}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-white text-sm font-semibold truncate">{file?.name}</p>
                              <p className="text-white/60 text-xs">
                                {Math.round((file?.size || 0) / 1024)} KB
                                {imageWidth && imageHeight ? ` • ${imageWidth}×${imageHeight}` : ''}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="px-4 py-2 rounded-lg border border-tropical-turquoise text-white hover:bg-tropical-turquoise/15 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {error && <p className="text-sm text-red-300 mt-3">{error}</p>}
                    {uploadResult && (
                      <div className="mt-3 rounded-xl bg-white/5 border border-tropical-green/30 p-4">
                        <p className="text-white font-semibold">Upload received!</p>
                        <p className="text-white/70 text-sm mt-1">We captured your photo on the backend.</p>
                        <div className="mt-3 flex flex-col gap-2">
                          <a href={uploadResult.photoUrl} target="_blank" rel="noreferrer" className="text-sm text-tropical-teal underline">
                            View uploaded photo
                          </a>
                          <a href={uploadResult.metadataUrl} target="_blank" rel="noreferrer" className="text-sm text-tropical-teal underline">
                            View metadata record
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-1">Email (optional)</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="you@email.com"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-tropical-turquoise placeholder:text-white/40"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-1">Tour type (optional)</label>
                      <select
                        value={tourType}
                        onChange={(e) => setTourType(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-tropical-turquoise"
                      >
                        <option value="">Select a tour</option>
                        <option value="Deep Sea Fishing">Deep Sea Fishing</option>
                        <option value="Reef Fishing">Reef Fishing</option>
                        <option value="Snorkeling">Snorkeling</option>
                        <option value="Sunset Cruise">Sunset Cruise</option>
                        <option value="Beach BBQ">Beach BBQ</option>
                        <option value="Full Day Adventure">Full Day Adventure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-1">Your fish story (optional)</label>
                      <textarea
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        placeholder="A quick note about this moment..."
                        rows={4}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-tropical-turquoise placeholder:text-white/40"
                      />
                    </div>

                    <div>
                      <button
                        type="button"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                        className="w-full px-5 py-3 bg-tropical-coral hover:bg-tropical-orange text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? 'Uploading…' : 'Upload Photo'}
                      </button>
                      <p className="text-xs text-white/50 mt-2">
                        By uploading, you allow Rene&apos;s Adventures to review your photo for a future Fish Story.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button
                  disabled
                  className="px-10 py-5 bg-slate-800 text-slate-600 font-semibold rounded-xl cursor-not-allowed text-lg"
                >
                  Coming January 2025
                </button>

                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('lia:open'));
                  }}
                  className="px-10 py-5 bg-tropical-coral hover:bg-tropical-orange text-white font-medium rounded-xl transition-all duration-300 text-lg"
                >
                  Ask Lia About This Feature
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-white/50 text-sm uppercase tracking-[0.3em] font-light">Every Adventure Deserves a Story</p>
        </motion.div>
      </div>
    </section>
  );
}
