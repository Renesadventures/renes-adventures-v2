'use client';

export default function SiteFooter() {
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
                <span className="text-white/60 whitespace-nowrap">$900</span>
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
          <div className="text-white/50 text-xs">&copy; 2025 Rene&apos;s Adventures. All rights reserved.</div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <a href="/privacy-policy" className="text-white/60 hover:text-white transition">Privacy Policy</a>
            <a href="/terms-of-service" className="text-white/60 hover:text-white transition">Terms of Service</a>
            <a href="/cancellation-policy" className="text-white/60 hover:text-white transition">Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
