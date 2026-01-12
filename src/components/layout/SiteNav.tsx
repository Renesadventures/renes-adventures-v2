'use client';

import Link from 'next/link';

export default function SiteNav() {
  const armAudio = () => {
    try {
      window.dispatchEvent(new Event('audio:nav-gate'));
    } catch {
      // no-op
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[70]">
      <div className="bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white font-semibold tracking-tight">
            Rene&apos;s Adventures
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#experiences" onClick={armAudio} className="text-white/80 hover:text-[#d4af37] transition">
              Experiences
            </a>
            <a href="#weather-intelligence" onClick={armAudio} className="text-white/80 hover:text-[#d4af37] transition">
              Conditions
            </a>
            <a href="#vessel" className="text-white/80 hover:text-[#d4af37] transition">
              Vessel
            </a>
            <a href="#lead-magnet" className="text-white/80 hover:text-[#d4af37] transition">
              Guide
            </a>
          </nav>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('booking-engine');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
              }
              window.location.href = '/tours/custom-charter#booking-engine';
            }}
            className="inline-flex items-center justify-center rounded-full bg-[#d4af37] text-slate-950 font-extrabold px-5 py-2 border border-white/10 hover:brightness-110 transition"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
