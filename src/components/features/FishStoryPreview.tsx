'use client';

import { motion } from 'framer-motion';

export function FishStoryPreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-black via-slate-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px), repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-amber-400 text-sm uppercase tracking-[0.3em] font-light">
              Coming Soon
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">
            Your Story,
            <span className="block font-serif italic text-amber-400">AI-Crafted</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
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
            className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-800 hover:border-amber-400/30 transition-all group"
          >
            <div className="mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
              <h3 className="text-2xl font-light text-white mb-3">The One That Got Away</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Dramatize your near-catches. AI analyzes your footage and creates a thrilling narrative of that epic
              battle with the trophy fish that escaped.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-800 hover:border-amber-400/30 transition-all group"
          >
            <div className="mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
              <h3 className="text-2xl font-light text-white mb-3">Swimming with Giants</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Capture the awe of being inches from nurse sharks, manta rays, and sea turtles. AI identifies species and
              adds educational context to your underwater moments.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-800 hover:border-amber-400/30 transition-all group"
          >
            <div className="mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-transparent mb-4" />
              <h3 className="text-2xl font-light text-white mb-3">Your Perfect Moment</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every adventure has that moment. AI pinpoints your best shots—the perfect sunset, the catch photo, the
              celebration—and weaves them into a shareable reel.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-12 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-amber-400/10 border border-amber-400/30 rounded-full">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-amber-400 text-sm font-medium tracking-wide">LAUNCHING SOON</span>
              </div>

              <h3 className="text-4xl font-light text-white mb-4">Fish Story Creator</h3>

              <p className="text-slate-300 text-lg leading-relaxed mb-8 font-light">
                Upload your photos and videos from today&apos;s adventure. Our AI will:
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-400">Identify fish species, marine life, and locations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-400">Generate a personalized narrative with your voice</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-400">Add cinematic effects, music, and captions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-slate-400">Export as a shareable 30-60 second reel for Instagram/TikTok</span>
                </li>
              </ul>

              <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-8 text-center">
                <p className="text-slate-500 text-sm">Interactive demo coming soon</p>
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
                  className="px-10 py-5 bg-white/5 border border-slate-700 text-white font-medium rounded-xl hover:bg-white/10 hover:border-slate-600 transition-all duration-300 text-lg"
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
          <p className="text-slate-600 text-sm uppercase tracking-[0.3em] font-light">Every Adventure Deserves a Story</p>
        </motion.div>
      </div>
    </section>
  );
}
