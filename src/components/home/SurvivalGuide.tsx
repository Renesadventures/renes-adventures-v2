'use client';

import { useMemo, useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';

type FaqItem = {
  id: string;
  title: string;
  body: string;
};

export default function SurvivalGuide() {
  const items = useMemo<FaqItem[]>(
    () => [
      {
        id: 'pack',
        title: 'What to pack',
        body: 'Reef-safe sunscreen, polarized shades, light long-sleeve, water shoes, a dry bag, and a light rain layer. Bring a copy of your ID and a little cash for tips or beach stops.',
      },
      {
        id: 'money',
        title: 'Money & tipping',
        body: 'USD is commonly accepted, but expect BZD change. For charters, tip what feels right—most guests tip based on service, effort, and the day’s vibe.',
      },
      {
        id: 'etiquette',
        title: 'Cultural etiquette',
        body: 'Belize is friendly and relaxed. A simple greeting goes far. Dress casual, be respectful in villages, and always ask before photographing people.',
      },
      {
        id: 'language',
        title: 'Language basics',
        body: 'English is the official language. You’ll also hear Kriol and Spanish. A smile and “Good morning” works everywhere.',
      },
      {
        id: 'emergency',
        title: 'Emergency contacts',
        body: 'Save your lodging contact, local clinic number, and your captain’s phone. On the water: follow captain instructions—radio coverage is standard on professional charters.',
      },
      {
        id: 'weather',
        title: 'Weather patterns',
        body: 'Morning is often calmest. Trade winds can build in the afternoon. We’ll adjust the route and timing for the smoothest water and best visibility.',
      },
    ],
    []
  );

  const [openId, setOpenId] = useState<string>(items[0]?.id || '');

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">
            <BookOpen className="h-4 w-4 text-amber-300" />
            Survival Guide
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl font-serif tracking-tight text-slate-950">
            Know Before You Go
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-700">
            Quick answers that save your trip. Tap a card to expand.
          </p>

          <div className="mt-10 space-y-4">
            {items.map((item) => {
              const isOpen = item.id === openId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOpenId((prev) => (prev === item.id ? '' : item.id))}
                  className="w-full text-left rounded-3xl bg-white ring-1 ring-slate-200 shadow-[0_14px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_18px_60px_rgba(245,158,11,0.14)]"
                >
                  <div className="flex items-start justify-between gap-4 p-6">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                      <div
                        className={`mt-3 text-sm text-slate-700 leading-relaxed transition-all duration-300 ${
                          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                        }`}
                      >
                        {item.body}
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
