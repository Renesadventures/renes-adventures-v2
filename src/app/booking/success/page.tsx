import Link from 'next/link';

export default function BookingSuccess() {
  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center text-center px-6">
      <div className="max-w-lg">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          You&apos;re Going to Belize!
        </h1>
        <p className="text-white/60 text-lg mb-6">
          Your booking is confirmed. René&apos;s team will reach out within 24 hours to confirm your charter details.
        </p>
        <p className="text-white/40 text-sm mb-8">
          Questions? WhatsApp us at{' '}
          <a href="https://wa.me/5016273556" className="text-emerald-400 hover:underline">
            +501 627 3556
          </a>
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
