'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Mail, Calendar, Users } from 'lucide-react';

import { useCartStore } from '@/lib/store/cart-store';

type BookingDetails = {
  id?: string;
  metadata?: Record<string, unknown>;
};

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const clearCart = useCartStore((state) => state.clearCart);

  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    if (sessionId) {
      void fetchBookingDetails(sessionId);
      clearCart();
      return;
    }

    setLoading(false);
  }, [clearCart, sessionId]);

  const fetchBookingDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/booking-confirmation?session_id=${encodeURIComponent(id)}`);
      const data = (await response.json()) as BookingDetails;
      setBookingDetails(data);
    } catch {
      setBookingDetails(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F172A] py-24">
        <div className="mx-auto w-full max-w-screen-md px-4 text-center">
          <p className="text-white/70">Loading your booking confirmation...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F172A] py-24">
      <div className="mx-auto w-full max-w-screen-md px-4">
        <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-8 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white mb-6">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <h1 className="text-4xl font-extrabold text-white">Booking Confirmed!</h1>
          <p className="mt-4 text-lg text-white/70">Your Belize adventure is reserved. Check your email for confirmation details.</p>
          {bookingDetails?.id && (
            <p className="mt-3 text-sm text-white/60">Confirmation session: {bookingDetails.id}</p>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-extrabold text-white">What&apos;s Next?</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-[#d4af37]" />
              </div>
              <div>
                <h3 className="font-bold text-white">Check Your Email</h3>
                <p className="mt-1 text-white/70">We&apos;ll send a confirmation with your booking details and what to bring.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5 text-[#d4af37]" />
              </div>
              <div>
                <h3 className="font-bold text-white">Add to Your Calendar</h3>
                <p className="mt-1 text-white/70">Mark your tour date and we&apos;ll confirm pickup details closer to departure.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-[#d4af37]" />
              </div>
              <div>
                <h3 className="font-bold text-white">Meet Captain René</h3>
                <p className="mt-1 text-white/70">We&apos;ll contact you before your tour to confirm timing and answer questions.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-bold text-white">Important Reminders</h3>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <div>✓ Balance of 50% due 24 hours before departure</div>
              <div>✓ Free cancellation/rescheduling with 48+ hours notice</div>
              <div>✓ Bring reef-safe sunscreen, towels, and camera</div>
              <div>✓ Captain may adjust itinerary based on weather conditions</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex h-14 px-8 items-center justify-center rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 font-bold text-white transition"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
