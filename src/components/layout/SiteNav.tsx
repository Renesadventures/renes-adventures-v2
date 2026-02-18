'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Experiences', href: '#experiences' },
  { label: 'Conditions', href: '#conditions' },
  { label: 'Stories', href: '#story-wall' },
  { label: 'Vessel', href: '#vessel' },
  { label: 'Belize Guide', href: '#lead-magnet' },
];

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="text-white/80 hover:text-[#d4af37] transition"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
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

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/80 hover:text-white"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl">
            <div className="px-4 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-white/80 hover:text-[#d4af37] transition text-sm py-1"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
