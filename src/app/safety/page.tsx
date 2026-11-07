import type { Metadata } from 'next';
import Link from 'next/link';

/** Public safety and vessel insurance details for guests. */

export const metadata: Metadata = {
  title: "Safety, Licensing & Insurance | Rene's Adventures",
  description:
    'See Rene’s Adventures’ vessel registration, marine liability insurance and how we put safety first on private charters in Belize.',
  alternates: { canonical: '/safety' },
};

/** Public vessel and insurance details. */
const CREDENTIALS: Array<{ label: string; value: string; note?: string }> = [
  {
    label: 'Vessel registration',
    value: 'SPR-0760 — "Snapperologist", Port of Registry: San Pedro',
    note: 'Belize Port Authority Vessel Registration Certificate. The number is painted on the hull — check it against any photo on this site.',
  },
  {
    label: 'Belize Port Authority boat licence',
    value: 'BPA #57061 — Class A, current for 2026',
  },
  {
    label: 'Registered owner',
    value: 'Renaldo Chen (Captain Rene), San Pedro Town, Belize',
  },
  {
    label: 'Certified passenger capacity',
    value: '10 certified. The standard boat carries up to 8 guests.',
    note: 'We run two crew on the standard boat. René can arrange a larger boat or additional boats for larger groups.',
  },
  {
    label: 'Vessel',
    value: '25 ft fiberglass, 7 ft beam, 1.5 tons',
  },
  {
    label: 'Marine insurer',
    value: 'Insurance Corporation of Belize Limited',
    note: 'Marine third-party liability insurance for the Snapperologist’s commercial passenger service in Belize territorial waters.',
  },
  {
    label: 'Certificate policy period',
    value: 'October 20, 2026 to October 20, 2027',
    note: 'Coverage is subject to the policy’s terms, exclusions and conditions.',
  },
];

const PROMISES: Array<{ title: string; body: string }> = [
  {
    title: 'A private boat for your group.',
    body:
      'Our standard boat carries up to eight guests. For a larger group, René can arrange a larger boat or additional boats to fit your headcount. Your charter is private to your party.',
  },
  {
    title: 'Two certified guides on every charter.',
    body:
      'Not one guide and a helper. Two, both certified, on every trip regardless of group size.',
  },
  {
    title: 'The captain decides, and the captain is Rene.',
    body:
      'If the sea is wrong for the day you booked, we move you or we refund you. Nobody at a desk and no chatbot makes that call — Rene makes it, on the morning, looking at the water. It is the one decision we will never automate.',
  },
  {
    title: 'Life jackets aboard for every guest, every size.',
    body:
      'Including children. Tell us the ages when you book and the right sizes are on the boat before you arrive.',
  },
  {
    title: 'Permits and park fees handled.',
    body:
      'Marine reserve paperwork is ours to sort. The Hol Chan ranger fee is collected at the reserve itself — that one is not ours to take, and we would rather tell you that up front than surprise you.',
  },
];

export default function SafetyPage() {
  return (
    <main className="bg-[#060608] text-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Safety first, before we leave the dock
        </h1>

        <p className="mt-5 max-w-3xl text-white/70 leading-relaxed">
          We want you to know what’s in place before you step aboard. Here are the
          registration and insurance details for the Snapperologist, our standard
          charter boat, and how René prepares for your day on the water.
        </p>

        {/* ---------------------------------------------------- credentials */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">Vessel registration and insurance</h2>
          <dl className="mt-6 max-w-3xl divide-y divide-white/10 border-y border-white/10">
            {CREDENTIALS.map((c) => (
              <div key={c.label} className="py-4 md:flex md:items-baseline md:gap-6">
                <dt className="text-sm text-white/50 md:w-72 md:shrink-0">{c.label}</dt>
                <dd className="mt-1 md:mt-0">
                  <span className="text-white/90 font-medium">{c.value}</span>
                  {c.note ? (
                    <span className="mt-1 block text-sm text-white/45">{c.note}</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 max-w-3xl text-sm text-white/45">
            Ask René for a redacted copy of the vessel insurance certificate or to talk
            through the safety setup before you book.
          </p>
        </section>

        {/* ------------------------------------------------------- promises */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">How we prepare for your day</h2>
          <div className="mt-6 grid max-w-5xl gap-6 md:grid-cols-2">
            {PROMISES.map((p) => (
              <div key={p.title} className="border-l-2 border-white/15 pl-5">
                <h3 className="font-semibold text-white/90">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------- questions */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight">
            Talk to René before you book
          </h2>
          <p className="mt-4 leading-relaxed text-white/70">
            Bringing kids or anyone new to the water? Tell René a little about your
            group. He’ll talk you through the boat, the conditions and what to expect
            so you can feel comfortable before you book.
          </p>
          <p className="mt-5">
            <Link
              href="/cancellation-policy"
              className="text-sm text-white/60 underline underline-offset-4 hover:text-white"
            >
              Our cancellation policy
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
