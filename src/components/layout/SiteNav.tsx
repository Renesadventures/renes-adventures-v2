'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = useMemo(() => {
    if (pathname === '/')
      return [
        { label: 'Experiences', href: '#adventure-grid', scroll: true },
        { label: 'Conditions', href: '#weather-intelligence', scroll: true },
        { label: 'Stories', href: '#story-wall', scroll: true },
        { label: 'Vessel', href: '#vessel-showcase', scroll: true },
        { label: 'Belize Guide', href: '#belize-lifestyle', scroll: true },
      ];

    if (pathname === '/tours/custom-charter')
      return [
        { label: 'Overview', href: '#hero', scroll: true },
        { label: 'Build Your Day', href: '#build-your-day', scroll: true },
        { label: 'Add-Ons', href: '#addons', scroll: true },
        { label: 'Guarantee', href: '#guarantee', scroll: true },
        { label: 'All Tours', href: '/#adventure-grid', scroll: false },
      ];

    if (pathname.startsWith('/tours/'))
      return [
        { label: 'Overview', href: '#hero', scroll: true },
        { label: 'Highlights', href: '#highlights', scroll: true },
        { label: 'Pricing', href: '#pricing', scroll: true },
        { label: 'Reviews', href: '#reviews', scroll: true },
        { label: 'All Tours', href: '/#adventure-grid', scroll: false },
      ];

    return [
      { label: 'Home', href: '/', scroll: false },
      { label: 'Tours', href: '/#adventure-grid', scroll: false },
      { label: 'Book', href: '/tours/custom-charter', scroll: false },
    ];
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white font-semibold tracking-tight">
            Rene&apos;s Adventures
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) =>
              link.scroll ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    const id = link.href.replace('#', '');
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ),
            )}
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
              {navLinks.map((link) =>
                link.scroll ? (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => {
                      const id = link.href.replace('#', '');
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                      setMobileOpen(false);
                    }}
                    className="text-left text-sm font-medium text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-left text-sm font-medium text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
