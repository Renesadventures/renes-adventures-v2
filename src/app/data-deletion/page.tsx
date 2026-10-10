import type { Metadata } from 'next';

/**
 * Meta requires every app to publish either a data-deletion callback or a
 * data-deletion instructions URL before App Review will pass. This is the
 * instructions route — the simpler of the two and accepted by Meta — and
 * without it the Facebook, Instagram and WhatsApp permissions cannot be
 * submitted at all.
 *
 * Paste this page's URL into the Meta app dashboard under
 * Settings > Basic > User data deletion:  https://renesadventures.tours/data-deletion
 */

export const metadata: Metadata = {
  title: "Deleting Your Data | Rene's Adventures",
  description:
    'How to ask us to delete the messages and contact details we hold about you.',
  alternates: { canonical: '/data-deletion' },
};

export default function DataDeletionPage() {
  return (
    <main className="bg-[#060608] text-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Deleting your data</h1>

        <p className="mt-5 max-w-3xl leading-relaxed text-white/70">
          If you have messaged Rene&apos;s Adventures on Facebook, Instagram or
          WhatsApp, or filled in a form on this website, we hold what you sent us and
          the contact details you gave, so that a real person can answer you.
        </p>

        <h2 className="mt-10 text-xl font-semibold tracking-tight">What we keep</h2>
        <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-white/70">
          <li>Your name, and the email address or phone number you contacted us with</li>
          <li>The messages between you and us, so we do not ask you the same thing twice</li>
          <li>Trip details you told us — dates, how many guests, what you wanted to do</li>
        </ul>
        <p className="mt-4 max-w-3xl text-white/70">
          We do not sell any of it, and we do not share it with anyone outside the
          people who run the charters.
        </p>

        <h2 className="mt-10 text-xl font-semibold tracking-tight">How to have it deleted</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
          Email{' '}
          <span className="font-semibold text-white/90">info@renesadventures.tours</span>{' '}
          with the subject <span className="font-semibold text-white/90">Delete my data</span>,
          from the address you contacted us with, or tell us the phone number or
          social account you used. You do not have to give a reason.
        </p>
        <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
          We delete everything we hold about you within 30 days and confirm when it is
          done. If a booking is still coming up, we will say so and ask whether you
          want us to wait until after the trip.
        </p>

        <p className="mt-10 max-w-3xl text-sm text-white/45">
          Rene&apos;s Adventures · San Pedro, Ambergris Caye, Belize
        </p>
      </div>
    </main>
  );
}
