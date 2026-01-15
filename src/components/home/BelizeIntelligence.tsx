'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { AlertTriangle, Calendar, Compass, Heart, Shield } from 'lucide-react';

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

type PreviewCard = {
  id: string;
  title: string;
  topicsLabel: string;
  icon: 'calendar' | 'shield' | 'heart' | 'alert' | 'compass';
  imageSrc: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BelizeIntelligence() {
  const base = 'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev';
  const router = useRouter();

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

  const previewCards = useMemo<PreviewCard[]>(
    () => [
      {
        id: 'prep',
        title: 'Pre-Trip Preparation',
        topicsLabel: '3 topics',
        icon: 'calendar',
        imageSrc: `${base}/images/renes-activities/exotic-beach-landscape-2024-10-12-01-05-44-utc.jpg`,
      },
      {
        id: 'legal',
        title: 'Legal & Immigration',
        topicsLabel: '3 topics',
        icon: 'shield',
        imageSrc: `${base}/images/renes-activities/Blue-Hole-Iconic.jpeg`,
      },
      {
        id: 'safety',
        title: 'Health & Safety',
        topicsLabel: '3 topics',
        icon: 'heart',
        imageSrc: `${base}/images/renes-activities/Deep-sea-fishing.jpeg`,
      },
      {
        id: 'dont',
        title: 'What NOT To Do',
        topicsLabel: '3 topics',
        icon: 'alert',
        imageSrc:
          'https://pub-39d09253e0da4d8692ce0c9eca5f1367.r2.dev/images/renes-activities/boat-silhouetted-against-a-beautiful-sunset-in-the-2025-02-11-23-57-55-utc.jpg',
      },
      {
        id: 'survival',
        title: 'Survival Tips',
        topicsLabel: '5 topics',
        icon: 'compass',
        imageSrc: `${base}/images/renes-activities/exotic-beach-landscape-2024-10-12-01-05-44-utc.jpg`,
      },
    ],
    [base]
  );

  const [visitDate, setVisitDate] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<Record<InterestId, boolean>>({
    fishing: false,
    diving: false,
    beach: false,
    culture: false,
    food: false,
    wildlife: false,
    adventure: false,
    family: false,
    romance: false,
  });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCount = useMemo(() => {
    return Object.values(selectedInterests).filter(Boolean).length;
  }, [selectedInterests]);

  const toggleInterest = (id: InterestId) => {
    setSelectedInterests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const cleanedEmail = email.trim();

    if (!visitDate) {
      setError('Please select your visit date.');
      return;
    }

    if (selectedCount < 1) {
      setError('Please select at least one interest.');
      return;
    }

    if (!cleanedEmail || !EMAIL_RE.test(cleanedEmail)) {
      setError('Please enter a valid email.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      router.push('/belize-guide');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Icon = ({ kind }: { kind: PreviewCard['icon'] }) => {
    if (kind === 'calendar') return <Calendar className="h-5 w-5 text-amber-500" />;
    if (kind === 'shield') return <Shield className="h-5 w-5 text-sky-600" />;
    if (kind === 'heart') return <Heart className="h-5 w-5 text-emerald-600" />;
    if (kind === 'compass') return <Compass className="h-5 w-5 text-slate-800" />;
    return <AlertTriangle className="h-5 w-5 text-rose-500" />;
  };

  return (
    <section className="w-full bg-gradient-to-b from-slate-950 via-sky-950 to-emerald-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-white/70 ring-1 ring-black/5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%]">
            <div className="p-6 sm:p-8">
              <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-slate-950">
                Your Complete Belize Intelligence
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-700">Smart planning starts here</p>

              <form onSubmit={onSubmit} className="mt-8">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                      When are you visiting?
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-colors duration-300 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                      What are you into?
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {interests.map((item) => {
                        const checked = !!selectedInterests[item.id];
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleInterest(item.id)}
                            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                              checked
                                ? 'border-amber-500 bg-amber-500/15 text-slate-950 shadow-[0_10px_35px_rgba(245,158,11,0.18)]'
                                : 'border-black/10 bg-white text-slate-800 hover:border-black/20 hover:bg-white/90'
                            }`}
                            aria-pressed={checked}
                          >
                            <span>{item.label}</span>
                            <span
                              className={`h-2.5 w-2.5 rounded-full ring-1 transition-colors duration-300 ${
                                checked
                                  ? 'bg-amber-500 ring-amber-500/50'
                                  : 'bg-slate-200 ring-black/10'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-slate-600">Selected: {selectedCount}/9</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                      Get your personalized guide
                    </label>
                    <input
                      type="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-colors duration-300 focus:border-amber-500"
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-500/15">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-black shadow-lg shadow-amber-500/20 transition-colors duration-300 hover:bg-amber-400 disabled:opacity-60"
                  >
                    {isSubmitting ? 'Sending…' : 'Send My Belize Guide'}
                  </button>
                </div>
              </form>
            </div>

            <div className="border-t border-black/5 lg:border-t-0 lg:border-l border-black/5 p-6 sm:p-8 bg-white/50">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                Guide Preview
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4">
                {previewCards.map((c) => (
                  <div
                    key={c.id}
                    className="group rounded-2xl border border-black/10 bg-white/70 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.10)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_60px_rgba(245,158,11,0.18)]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-2xl ring-1 ring-black/5">
                        <Image src={c.imageSrc} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Icon kind={c.icon} />
                          <div className="text-sm font-semibold text-slate-950 truncate">{c.title}</div>
                        </div>
                        <div className="mt-1 text-xs text-slate-600">{c.topicsLabel}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
