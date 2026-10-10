'use client';

import { activeSocialLinks, type SocialPlatform } from '@/data/social';

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true,
  } as const;
  switch (platform) {
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...common}>
          <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.77.12v-3.2a5.77 5.77 0 0 0-.77-.05 5.78 5.78 0 1 0 5.78 5.78V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.34-1.48Z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...common}>
          <path d="M23 12s0-3.2-.41-4.73a2.5 2.5 0 0 0-1.76-1.77C19.3 5.09 12 5.09 12 5.09s-7.3 0-8.83.41a2.5 2.5 0 0 0-1.76 1.77C1 8.8 1 12 1 12s0 3.2.41 4.73a2.5 2.5 0 0 0 1.76 1.77c1.53.41 8.83.41 8.83.41s7.3 0 8.83-.41a2.5 2.5 0 0 0 1.76-1.77C23 15.2 23 12 23 12Zm-13 3.02V8.98L15.5 12 10 15.02Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function SiteFooter() {
  const socials = activeSocialLinks();

  return (
    <footer className="bg-[#060608] border-t border-white/10">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 items-start">
          <div>
            <div className="text-white text-xl font-semibold tracking-tight">Rene&apos;s Adventures</div>
            <div className="mt-2 text-white/70 text-sm font-semibold">Belize Custom Charter Co.</div>
            <div className="mt-3 text-white/60 text-sm leading-relaxed max-w-md">
              Your premier destination for custom charters and unforgettable Caribbean adventures in Belize.
            </div>
            <div className="mt-5 text-white/60 text-sm font-semibold">#RenesAdventures</div>

            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Rene's Adventures on ${s.label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-400">Our Charters</div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-baseline justify-between gap-4">
                <span className="text-white/80">Rene&apos;s Custom Adventure</span>
                <span className="text-white/60 whitespace-nowrap">$400&ndash;$675</span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span className="text-white/80">Deep Sea Fishing</span>
                <span className="text-white/60 whitespace-nowrap">$600&ndash;$900</span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span className="text-white/80">Sunset Cruise</span>
                <span className="text-white/60 whitespace-nowrap">$350</span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span className="text-white/80">Blue Hole Adventure</span>
                <span className="text-white/60 whitespace-nowrap">Contact Us</span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span className="text-white/80">Secret Beach</span>
                <span className="text-white/60 whitespace-nowrap">$400&ndash;$600</span>
              </li>
            </ul>
            <div className="mt-5 text-white/50 text-xs leading-relaxed">
              All prices for up to 4 guests &middot; Additional guests $75/person (max 8)
              <br />
              Includes: water, sodas, snacks, rum punch, rods, tackle &amp; fishing licenses
              <br />
              Prices do not include 12.5% tax, 6% service fee, or gratuity
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-400">Contact Us</div>
            <div className="mt-4 space-y-3 text-sm text-white/60">
              <div>
                <a href="tel:+5016273556" className="text-white/60 hover:text-white transition">
                  +501 627 3556
                </a>
              </div>
              <div>
                <a
                  href="https://wa.me/5016273556"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition"
                >
                  WhatsApp Us
                </a>
              </div>
              <div>
                <a
                  href="mailto:renesadventuresbz@gmail.com"
                  className="text-white/60 hover:text-white transition"
                >
                  renesadventuresbz@gmail.com
                </a>
              </div>
              <div className="pt-1">
                <div>San Pedro, Ambergris Caye</div>
                <div>Belize, Central America</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-400">Business Hours</div>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              <div className="flex justify-between gap-4">
                <span>Monday &ndash; Saturday:</span>
                <span className="text-white/80 whitespace-nowrap">7:00 AM &ndash; 7:00 PM</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Sunday:</span>
                <span className="text-white/80 whitespace-nowrap">8:00 AM &ndash; 6:00 PM</span>
              </div>
            </div>

            <div className="mt-8 text-xs uppercase tracking-[0.25em] text-emerald-400">Cancellation Policy</div>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>Free rescheduling with 48+ hours notice</li>
              <li>Full credit transfer with 48+ hours notice</li>
              <li>Weather cancellations are transferable &mdash; never lost</li>
              <li>No refunds within 48 hours of charter</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/50 text-xs">&copy; 2026 Rene&apos;s Adventures. All rights reserved.</div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <a href="/blog" className="text-white/60 hover:text-white transition">Belize Guide</a>
            {/* Safety first in the list on purpose: no competitor on this
                island publishes a licence number or an insurer, so it is the
                one link here that is a selling point rather than a legal
                obligation. */}
            <a href="/safety" className="text-white/60 hover:text-white transition">Safety, Licence &amp; Insurance</a>
            <a href="/privacy-policy" className="text-white/60 hover:text-white transition">Privacy Policy</a>
            <a href="/terms-of-service" className="text-white/60 hover:text-white transition">Terms of Service</a>
            <a href="/cancellation-policy" className="text-white/60 hover:text-white transition">Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
