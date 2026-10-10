import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * The licence-and-insurance page — the one piece of unclaimed ground in this
 * market.
 *
 * Research across every San Pedro operator found the same thing: three of
 * them assert that they are "licensed" or "certified", and NOT ONE publishes
 * a licence number, an insurer, a policy limit, or a certificate. The booking
 * marketplaces do not verify it either. So asserting it earns nothing — every
 * competitor already does — while actually proving it is territory nobody has
 * taken.
 *
 * The tone matters as much as the content. "LICENSED AND INSURED" as a banner
 * reads defensive, and faintly alarming to somebody booking a holiday. What
 * converts is quiet competence with the evidence attached: this is Rene's
 * boat, Rene is at the wheel, here is the licence, here is the insurer, here
 * is why eight is the maximum.
 *
 * ────────────────────────────────────────────────────────────────────────
 * BEFORE THIS GOES LIVE, fill in every value marked TO CONFIRM below.
 * A page that proves nothing is worse than no page, because it draws
 * attention to the claim and then fails to back it. If a number is not
 * available yet, delete that row rather than shipping a placeholder.
 * ────────────────────────────────────────────────────────────────────────
 */

export const metadata: Metadata = {
  title: "Safety, Licensing & Insurance | Rene's Adventures",
  description:
    'Our Belize Tourism Board licence, our insurance, our vessel, and the hard limits we run to. Published, not claimed.',
  alternates: { canonical: '/safety' },
};

/** Everything a visitor can check. Replace each TO CONFIRM with the real value. */
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
    value: '10 — and we carry a maximum of 8 guests',
    note: 'We run two crew. Eight guests is a choice, not a ceiling we are squeezing up against.',
  },
  {
    label: 'Vessel',
    value: '25 ft fiberglass, 7 ft beam, 1.5 tons',
  },
  {
    label: 'Belize Tourism Board Tour Operator Licence',
    value: 'TO CONFIRM — licence number',
    note: 'Renewed annually. Every BTB licence expires 31 December, so a current one is a current one.',
  },
  {
    label: 'Insurer',
    value: 'TO CONFIRM — insurer name',
  },
  {
    label: 'Passenger liability cover',
    value: 'TO CONFIRM — amount per passenger',
    note: 'Ask almost any operator on this island for this number. See what happens.',
  },
  {
    label: "Captain's licence",
    value: 'TO CONFIRM — held since 20XX',
  },
  {
    label: 'Last vessel inspection',
    value: 'TO CONFIRM — month and year',
  },
];

const PROMISES: Array<{ title: string; body: string }> = [
  {
    title: 'Never more than eight. Ever.',
    body:
      'Eight guests is the hard limit on every charter we run, and we do not combine groups to fill a boat. If you booked it, it is yours. A crowded boat is not a cheaper trip — it is a different trip.',
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
          Licensed, insured, and happy to prove it
        </h1>

        <p className="mt-5 max-w-3xl text-white/70 leading-relaxed">
          Belize has a lot of boats and not all of them are operating legally. Plenty of
          operators will tell you they are licensed. Very few will show you the licence.
          Everything below is checkable, and we would rather you checked.
        </p>

        {/* ---------------------------------------------------- credentials */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">The paperwork</h2>
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

          {/*
            Put the scans here once they exist. A redacted photograph of the
            licence and the insurance certificate does more than any sentence
            on this page — it is the difference between claiming and proving,
            and it is the whole point of the page.
          */}
          <p className="mt-6 max-w-3xl text-sm text-white/45">
            Want to see the documents? Ask us and we will send the licence and the
            certificate of insurance. No charter should be shy about that.
          </p>
        </section>

        {/* ------------------------------------------------------- promises */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">How we actually run</h2>
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
            Questions about safety go to Rene
          </h2>
          <p className="mt-4 leading-relaxed text-white/70">
            Not to our website chat, and not to an assistant. If you have a question about
            whether something is safe for your family, your swimming ability or your
            health, it goes to the captain — and he answers it himself, before you book.
            That is deliberate: a chatbot should never be the thing that tells a parent
            their child will be fine on the water.
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
