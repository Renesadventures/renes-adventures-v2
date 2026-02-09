import Link from 'next/link';
import { Facebook, Instagram, Music } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#000814] border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-[#FFD700] font-black text-sm uppercase tracking-widest mb-4">Rene&apos;s Adventures</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Luxury private charters exploring Belize&apos;s barrier reef, islands, and marine reserves.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/renesadventures"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFD700] flex items-center justify-center transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/renesadventures"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFD700] flex items-center justify-center transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://tiktok.com/@renesadventures"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FFD700] flex items-center justify-center transition-colors"
              >
                <Music size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[#FFD700] font-black text-sm uppercase tracking-widest mb-4">Experiences</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/tours/custom-charter" className="hover:text-[#FFD700]">
                  Custom Adventure
                </Link>
              </li>
              <li>
                <Link href="/tours/deep-sea-fishing" className="hover:text-[#FFD700]">
                  Deep Sea Fishing
                </Link>
              </li>
              <li>
                <Link href="/tours/sunset-cruise" className="hover:text-[#FFD700]">
                  Sunset Cruise
                </Link>
              </li>
              <li>
                <Link href="/tours/blue-hole" className="hover:text-[#FFD700]">
                  Blue Hole
                </Link>
              </li>
              <li>
                <Link href="/tours/secret-beach" className="hover:text-[#FFD700]">
                  Secret Beach
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#FFD700] font-black text-sm uppercase tracking-widest mb-4">Information</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/conditions" className="hover:text-[#FFD700]">
                  Weather & Conditions
                </Link>
              </li>
              <li>
                <Link href="/vessel" className="hover:text-[#FFD700]">
                  Our Vessel
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-[#FFD700]">
                  Belize Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#FFD700] font-black text-sm uppercase tracking-widest mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="mailto:info@renesadventures.tours" className="hover:text-[#FFD700]">
                  info@renesadventures.tours
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5016707760"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFD700]"
                >
                  WhatsApp: +501 670 7760
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-white/10 mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <div>© {new Date().getFullYear()} Rene&apos;s Adventures. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#FFD700]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#FFD700]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
