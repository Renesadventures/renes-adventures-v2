'use client';

import Image from 'next/image';
import type { FormEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Check,
  Compass,
  Heart,
  Map,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type InterestId =
  | 'fishing'
  | 'diving'
  | 'beach'
  | 'culture'
  | 'food'
  | 'wildlife'
  | 'adventure'
  | 'family'
  | 'romance';

type GuideSection = {
  id: string;
  title: string;
  icon: 'calendar' | 'shield' | 'heart' | 'alert' | 'compass';
  imageSrc: string;
  freePreview: string;
  fullTopics: string[];
  insiderTip: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------------------------------------------ */
/*  Guide content — what each section covers                           */
/* ------------------------------------------------------------------ */

function useGuideContent(base: string) {
  return useMemo<GuideSection[]>(
    () => [
      {
        id: 'prep',
        title: 'Pre-Trip Preparation',
        icon: 'calendar',
        imageSrc: '/images/renes-activities/pre-trip-preparation.png',
        freePreview: 'Basic packing list and weather overview for your visit dates.',
        fullTopics: [
          'Month-by-month weather calendar with best activity windows',
          'Complete packing list by activity type (fishing, diving, jungle)',
          'Currency, tipping, and money exchange insider rates',
          'Phone & data: which carriers work, local SIM options',
          'What to book in advance vs. what to arrange on arrival',
          'Airport arrival walkthrough — immigration to taxi in 15 minutes',
        ],
        insiderTip:
          'Most tourists overpay for airport taxis by 3x. We include the exact rate and a direct contact for trusted drivers.',
      },
      {
        id: 'legal',
        title: 'Legal & Immigration',
        icon: 'shield',
        imageSrc: '/images/renes-activities/legal-and-immigration.png',
        freePreview: 'Visa requirements and basic entry info.',
        fullTopics: [
          'Visa-free countries list and stay duration limits',
          'Passport validity requirements (common rejection reason)',
          'Customs declarations — what you can and cannot bring in',
          'Drone laws: registration, no-fly zones, penalties',
          'Fishing license requirements for sport fishing',
          'Water taxi regulations and inter-island travel permits',
        ],
        insiderTip:
          'Bringing a drone? Belize requires pre-registration. We include the exact form link and fee — skip the airport confiscation.',
      },
      {
        id: 'safety',
        title: 'Health & Safety',
        icon: 'heart',
        imageSrc: '/images/renes-activities/health-and-safety.png',
        freePreview: 'General health advisory and sunscreen tips.',
        fullTopics: [
          'Required & recommended vaccinations with timing',
          'Mosquito protection: what actually works in Belize',
          'Sun exposure protocol — reef-safe sunscreen brands',
          'Medical facilities map: clinics, hospitals, pharmacies by island',
          'Travel insurance recommendations with Belize-specific coverage',
          'Water safety: tap water, ice, and street food guidance',
          'Marine hazards: jellyfish seasons, lionfish, fire coral ID',
        ],
        insiderTip:
          'The clinic on Ambergris Caye closes at 5pm. We include the after-hours emergency number that locals use.',
      },
      {
        id: 'dont',
        title: "Don't Do This in Belize",
        icon: 'alert',
        imageSrc: "/images/renes-activities/dont-do-this-in-belize.png",
        freePreview: 'Common tourist mistakes to avoid.',
        fullTopics: [
          'Tourist scams: taxi overcharges, fake tour operators, beach vendors',
          'Areas to avoid after dark (specific streets and zones)',
          'Cultural taboos: what offends locals without you knowing',
          'Reef etiquette: touching coral = $500 fine',
          'Photography restrictions at certain Mayan sites',
          'Negotiation mistakes that mark you as a tourist',
          'Food and drink traps: overpriced tourist restaurants vs. local gems',
        ],
        insiderTip:
          'Never accept a "free boat ride" from unlicensed operators at the water taxi terminal. We name the 3 licensed companies.',
      },
      {
        id: 'survival',
        title: 'Belize Survival Kit',
        icon: 'compass',
        imageSrc: '/images/renes-activities/belize-survival-kit.png',
        freePreview: 'Top 5 things every visitor should know.',
        fullTopics: [
          'Accommodations guide: best value by area and budget tier',
          'Transport decoded: water taxis, golf carts, domestic flights',
          'Restaurant guide: tourist-voted top 20 + local hidden gems',
          'Activity calendar: what to do each month of the year',
          'Emergency contacts: police, coast guard, embassy numbers',
          'Offline maps and GPS waypoints for popular destinations',
          'Captain Rene\'s personal recommendations — 25 years of local knowledge',
        ],
        insiderTip:
          'Golf cart rental prices vary 40% between vendors. We include the best-rated rental with the lowest rate, direct contact included.',
      },
    ],
    [base]
  );
}

/* ------------------------------------------------------------------ */
/*  Icon helper                                                        */
/* ------------------------------------------------------------------ */

function SectionIcon({ kind, className }: { kind: GuideSection['icon']; className?: string }) {
  const c = className || 'h-5 w-5';
  if (kind === 'calendar') return <Calendar className={`${c} text-amber-400`} />;
  if (kind === 'shield') return <Shield className={`${c} text-sky-400`} />;
  if (kind === 'heart') return <Heart className={`${c} text-emerald-400`} />;
  if (kind === 'compass') return <Compass className={`${c} text-amber-300`} />;
  return <AlertTriangle className={`${c} text-rose-400`} />;
}

/* ------------------------------------------------------------------ */
/*  Guide Preview Modal                                                */
/* ------------------------------------------------------------------ */

function GuideModal({
  section,
  onClose,
}: {
  section: GuideSection;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 ring-1 ring-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
        {/* Header image */}
        <div className="relative h-40 overflow-hidden rounded-t-3xl">
          <Image
            src={section.imageSrc}
            alt=""
            fill
            sizes="500px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/20 transition-colors hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <SectionIcon kind={section.icon} className="h-6 w-6" />
            <h3 className="text-xl font-serif tracking-tight text-white">{section.title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Free preview teaser */}
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">Free Preview</div>
            <div className="mt-2 text-sm text-white/70">{section.freePreview}</div>
          </div>

          {/* Full guide topics */}
          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-semibold">
              Complete Guide Includes
            </div>
            <div className="mt-3 space-y-2.5">
              {section.fullTopics.map((topic, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-sm text-white/80">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insider tip */}
          <div className="mt-5 rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-semibold">
                Insider Tip Preview
              </span>
            </div>
            <div className="mt-2 text-sm text-amber-200/80 italic">
              &ldquo;{section.insiderTip}&rdquo;
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col gap-3">
            <div className="text-center">
              <div className="text-xs text-white/50">
                This section + 4 more in the complete guide
              </div>
            </div>
            <a
              href="https://whop.com/renes-adventures"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-6 py-3.5 text-sm font-semibold text-black shadow-[0_18px_60px_rgba(245,158,11,0.25)] transition-all duration-300 hover:bg-amber-400"
            >
              <span className="absolute -inset-1 rounded-full bg-amber-500/25 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Get Complete Belize Survival Kit — $20</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function BelizeIntelligence() {
  const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';
  const guideSections = useGuideContent(base);

  /* --- Form state ------------------------------------------------- */
  const interests = useMemo<Array<{ id: InterestId; label: string }>>(
    () => [
      { id: 'fishing', label: 'Fishing' },
      { id: 'diving', label: 'Diving' },
      { id: 'beach', label: 'Beach' },
      { id: 'culture', label: 'Culture' },
      { id: 'food', label: 'Food' },
      { id: 'wildlife', label: 'Wildlife' },
      { id: 'adventure', label: 'Adventure' },
      { id: 'family', label: 'Family' },
      { id: 'romance', label: 'Romance' },
    ],
    []
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<Record<InterestId, boolean>>({
    fishing: false, diving: false, beach: false, culture: false, food: false,
    wildlife: false, adventure: false, family: false, romance: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<'free' | 'paid' | null>(null);

  /* --- Modal state ------------------------------------------------ */
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const activeSection = useMemo(
    () => guideSections.find((s) => s.id === activeModal) || null,
    [guideSections, activeModal]
  );

  const selectedCount = useMemo(
    () => Object.values(selectedInterests).filter(Boolean).length,
    [selectedInterests]
  );

  const toggleInterest = (id: InterestId) => {
    setSelectedInterests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const validate = useCallback(() => {
    if (!name.trim()) return 'Please enter your name.';
    if (!email.trim() || !EMAIL_RE.test(email.trim())) return 'Please enter a valid email.';
    if (!visitDate) return 'Please select your visit date.';
    if (selectedCount < 1) return 'Please select at least one interest.';
    return null;
  }, [name, email, visitDate, selectedCount]);

  const handleSubmit = async (tier: 'free' | 'paid', e?: FormEvent) => {
    if (e) e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setError(null);
    setIsSubmitting(true);

    try {
      const selectedList = Object.entries(selectedInterests)
        .filter(([, v]) => v)
        .map(([k]) => k);

      const res = await fetch('/api/belize-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          visitDate,
          interests: selectedList,
          tier,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(tier);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* --- Render ----------------------------------------------------- */
  return (
    <>
      <section id="belize-intelligence" className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden ring-1 ring-white/10 shadow-[0_22px_80px_rgba(15,23,42,0.18)]">

            {/* ---- Header ---- */}
            <div className="px-6 pt-8 sm:px-10 sm:pt-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white ring-1 ring-white/15">
                <Map className="h-4 w-4 text-amber-300" />
                Tourist Intelligence
              </div>

              <h2 className="mt-5 text-3xl sm:text-4xl font-serif tracking-tight text-white">
                Your Complete Belize Intelligence
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/70">
                Everything you need before you land. Smart planning from a local captain with 25 years on these waters.
              </p>
            </div>

            {/* ---- Two-column layout ---- */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-[55%_45%]">

              {/* ========== LEFT: Lead Capture Form ========== */}
              <div className="p-6 sm:p-10 border-b border-white/5 lg:border-b-0 lg:border-r lg:border-white/5">
                {submitted ? (
                  /* Success state */
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30">
                      <Check className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="mt-5 text-2xl font-serif text-white">
                      {submitted === 'paid' ? 'Your Survival Kit is on the way!' : 'Check your inbox!'}
                    </h3>
                    <p className="mt-2 text-sm text-white/70 max-w-sm">
                      {submitted === 'paid'
                        ? 'Your complete Belize Survival Kit with all 5 sections, insider tips, and local contacts is being prepared. Check your email within 10 minutes.'
                        : 'We\'ve sent free Belize tips to your email. Want the complete guide with insider secrets?'}
                    </p>
                    {submitted === 'free' && (
                      <button
                        type="button"
                        onClick={() => handleSubmit('paid')}
                        className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 transition-colors duration-300 hover:bg-amber-400"
                      >
                        Upgrade to Complete Kit — $20
                      </button>
                    )}
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={(e) => handleSubmit('free', e)}>
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                      Smart Planning
                    </div>
                    <div className="mt-1 text-sm text-white/60">
                      Tell us about your trip and we&apos;ll personalize your guide.
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                          Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500 focus:bg-white/8"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                          Email
                        </label>
                        <input
                          type="email"
                          inputMode="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500 focus:bg-white/8"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-amber-500 focus:bg-white/8"
                        />
                      </div>

                      {/* Visit date */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                          When are you visiting?
                        </label>
                        <input
                          type="date"
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-amber-500 focus:bg-white/8 [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Interests */}
                    <div className="mt-6">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                        What are you into? <span className="text-white/30">({selectedCount}/9)</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {interests.map((item) => {
                          const checked = !!selectedInterests[item.id];
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleInterest(item.id)}
                              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                                checked
                                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                  : 'bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10 hover:text-white'
                              }`}
                              aria-pressed={checked}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-400 ring-1 ring-rose-500/20">
                        {error}
                      </div>
                    )}

                    {/* Two-tier CTAs */}
                    <div className="mt-8 flex flex-col gap-3">
                      {/* Premium CTA */}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSubmit('paid')}
                        className="group relative inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-6 py-4 text-base font-semibold text-black shadow-[0_18px_60px_rgba(245,158,11,0.25)] transition-all duration-300 hover:bg-amber-400 disabled:opacity-60"
                      >
                        <span className="absolute -inset-1 rounded-full bg-amber-500/25 blur-lg motion-safe:animate-pulse" />
                        <span className="relative flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          {isSubmitting ? 'Processing…' : 'Get Complete Survival Kit — $20'}
                        </span>
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">or</span>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>

                      {/* Free CTA */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/5 hover:border-white/30 disabled:opacity-60"
                      >
                        {isSubmitting ? 'Sending…' : 'Send Free Basic Tips'}
                      </button>

                      <div className="text-center text-[10px] text-white/40">
                        Free tips include a brief packing list and weather overview. The $20 kit includes all 5 sections, insider contacts, and Captain Rene&apos;s personal recommendations.
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* ========== RIGHT: Guide Preview Cards ========== */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    Guide Preview
                  </div>
                  <div className="text-xs text-white/30">Tap to explore</div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  {guideSections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveModal(section.id)}
                      className="group w-full text-left rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/8 hover:ring-amber-500/30 hover:shadow-[0_14px_50px_rgba(245,158,11,0.12)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
                          <Image
                            src={section.imageSrc}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <SectionIcon kind={section.icon} />
                            <span className="text-sm font-semibold text-white truncate group-hover:text-amber-300 transition-colors duration-300">
                              {section.title}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-white/50">
                            {section.fullTopics.length} topics covered
                          </div>
                        </div>
                        <div className="shrink-0 text-white/30 group-hover:text-amber-400 transition-colors duration-300">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Value prop */}
                <div className="mt-6 rounded-2xl bg-amber-500/10 p-5 ring-1 ring-amber-500/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                    <div>
                      <div className="text-sm font-semibold text-amber-300">
                        The Complete Belize Survival Kit
                      </div>
                      <div className="mt-1 text-xs text-amber-200/70 leading-relaxed">
                        5 sections. 35+ insider tips. Local emergency contacts. Accommodation &amp; transport guide.
                        Restaurant recommendations voted by tourists. Captain Rene&apos;s 25 years of local knowledge — all for $20.
                      </div>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="text-2xl font-extrabold text-white">$20</div>
                        <div className="text-xs text-white/40 line-through">$45</div>
                        <div className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                          Save 55%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Modal overlay ---- */}
      {activeSection && (
        <GuideModal
          section={activeSection}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
