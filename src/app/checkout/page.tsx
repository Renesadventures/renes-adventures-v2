'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Mail, Phone, ShieldCheck, CreditCard, ShoppingCart } from 'lucide-react';

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    guests: 4,
    specialRequests: '',
    waiverAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0F172A] py-24">
        <div className="mx-auto w-full max-w-screen-md px-4 text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-6">
            <ShoppingCart className="h-10 w-10 text-white/40" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Your cart is empty</h1>
          <p className="mt-4 text-white/70">Add some tours to get started.</p>
          <Link
            href="/tours/custom-charter"
            className="mt-8 inline-flex h-14 px-8 items-center justify-center rounded-2xl bg-[#d4af37] text-slate-950 font-black text-lg hover:brightness-110 transition"
          >
            Browse Tours
          </Link>
        </div>
      </main>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone required';
    if (!formData.date) newErrors.date = 'Tour date required';
    if (formData.guests < 1) newErrors.guests = 'At least 1 guest required';
    if (!formData.waiverAccepted) newErrors.waiver = 'You must accept the waiver';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const bookingData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        booking: {
          date: formData.date,
          guests: formData.guests,
          specialRequests: formData.specialRequests,
        },
        items,
        total,
      };

      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const data = (await response.json()) as { checkoutUrl?: string; success?: boolean; bookingId?: string; error?: string };

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      if (data.success && data.bookingId) {
        clearCart();
        router.push(`/confirmation?booking=${data.bookingId}`);
        return;
      }

      throw new Error(data.error || 'Booking failed');
    } catch {
      alert('Booking failed. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] py-24">
      <div className="mx-auto w-full max-w-screen-2xl px-4">
        <h1 className="text-4xl font-extrabold text-white">Checkout</h1>
        <p className="mt-2 text-white/70">Complete your Belize adventure booking</p>

        <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="flex items-center gap-3 text-xl font-extrabold text-white">
                <Mail className="h-6 w-6 text-[#d4af37]" />
                Contact Information
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full h-12 px-4 rounded-2xl border ${
                      errors.firstName ? 'border-red-500' : 'border-white/15'
                    } bg-white/5 text-white focus:border-[#d4af37] outline-none transition`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-300">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full h-12 px-4 rounded-2xl border ${
                      errors.lastName ? 'border-red-500' : 'border-white/15'
                    } bg-white/5 text-white focus:border-[#d4af37] outline-none transition`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-300">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full h-12 px-4 rounded-2xl border ${
                      errors.email ? 'border-red-500' : 'border-white/15'
                    } bg-white/5 text-white focus:border-[#d4af37] outline-none transition`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full h-12 px-4 rounded-2xl border ${
                      errors.phone ? 'border-red-500' : 'border-white/15'
                    } bg-white/5 text-white focus:border-[#d4af37] outline-none transition`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-300">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="flex items-center gap-3 text-xl font-extrabold text-white">
                <Calendar className="h-6 w-6 text-[#d4af37]" />
                Tour Details
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Preferred Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full h-12 px-4 rounded-2xl border ${
                      errors.date ? 'border-red-500' : 'border-white/15'
                    } bg-white/5 text-white focus:border-[#d4af37] outline-none transition`}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-300">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Number of Guests *</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, guests: Math.max(1, formData.guests - 1) })}
                      className="h-12 w-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 font-black text-white transition"
                    >
                      −
                    </button>
                    <span className="text-2xl font-extrabold text-white min-w-[60px] text-center">{formData.guests}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, guests: Math.min(8, formData.guests + 1) })}
                      className="h-12 w-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 font-black text-white transition"
                    >
                      +
                    </button>
                  </div>
                  {errors.guests && <p className="mt-1 text-sm text-red-300">{errors.guests}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-white mb-2">Special Requests (Optional)</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-white/15 bg-white/5 text-white focus:border-[#d4af37] outline-none transition resize-none"
                  placeholder="Dietary restrictions, celebration details, accessibility needs, etc."
                />
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="flex items-center gap-3 text-xl font-extrabold text-slate-900">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
                Liability Waiver
              </h2>

              <div className="mt-4 max-h-48 overflow-y-auto rounded-2xl border border-amber-200 bg-white p-4 text-sm text-slate-700 [scrollbar-width:thin] [scrollbar-color:rgba(245,158,11,0.5)_rgba(0,0,0,0.1)]">
                <p className="font-semibold">Terms & Conditions:</p>
                <p className="mt-2">
                  I acknowledge that participating in water sports, fishing, and marine activities involves inherent risks. I voluntarily assume all risks associated
                  with this tour and release René&apos;s Adventures, its owners, operators, and crew from any liability for injury, loss, or damage.
                </p>
                <p className="mt-2">
                  I confirm that all participants are physically capable of the selected activities and have disclosed any medical conditions that may affect
                  participation.
                </p>
                <p className="mt-2">
                  <strong>Cancellation Policy:</strong> 48+ hours notice for full refund or free rescheduling. Weather cancellations by captain result in full refund or
                  reschedule.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-200">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.waiverAccepted}
                    onChange={(e) => setFormData({ ...formData, waiverAccepted: e.target.checked })}
                    className="mt-1 h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-900 leading-relaxed group-hover:text-amber-700 transition">
                    I have read and agree to the terms and conditions above *
                  </span>
                </label>
                {errors.waiver && <p className="mt-2 ml-8 text-sm text-red-600 font-semibold">{errors.waiver}</p>}
              </div>

              {formData.waiverAccepted && (
                <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">Waiver accepted</p>
                      <p className="mt-1 text-xs text-emerald-700">You&apos;re all set! Complete your booking details to proceed.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sticky top-24">
              <h2 className="text-xl font-extrabold text-white">Order Summary</h2>

              <div className="mt-6 space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-white/60">Qty: {item.quantity}</p>
                      {item.metadata?.size && <p className="text-white/60">Size: {String(item.metadata.size)}</p>}
                    </div>
                    <p className="font-bold text-white">{formatMoney(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-bold text-white">{formatMoney(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Deposit (50%)</span>
                  <span className="font-bold text-white">{formatMoney(total * 0.5)}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-white">Due Now</span>
                  <span className="text-2xl font-extrabold text-[#d4af37]">{formatMoney(total * 0.5)}</span>
                </div>
                <p className="text-xs text-white/60">Balance of {formatMoney(total * 0.5)} due 24 hours before departure</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full h-14 rounded-2xl bg-[#d4af37] text-slate-950 font-black text-lg hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Proceed to Payment
                  </>
                )}
              </button>

              <p className="mt-4 text-xs text-center text-white/60">Secure payment powered by WHOP</p>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/50">
                <Phone className="h-4 w-4" />
                Need help? Message us and we&apos;ll take care of you.
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
