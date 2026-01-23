'use client';

import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';

import { useCartStore } from '@/lib/store/cart-store';

function formatMoney(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const total = useCartStore((state) => state.total());

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0F172A] py-24">
        <div className="mx-auto w-full max-w-screen-md px-4 text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-6">
            <ShoppingCart className="h-10 w-10 text-white/40" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Your Cart is Empty</h1>
          <p className="mt-4 text-white/70">Add some adventures and start planning your perfect Belize experience.</p>
          <div className="mt-8">
            <Link
              href="/tours/custom-charter"
              className="inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-[#d4af37] text-slate-950 font-black text-lg hover:brightness-110 transition"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F172A] py-24">
      <div className="mx-auto w-full max-w-screen-2xl px-4">
        <h1 className="text-4xl font-extrabold text-white">Your Cart</h1>
        <p className="mt-2 text-white/70">
          {items.length} item{items.length !== 1 ? 's' : ''} in your cart
        </p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-white truncate">{item.name}</h3>
                    <p className="mt-1 text-sm text-white/60">
                      {item.type === 'activity' ? 'Activity' : item.type === 'addon' ? 'Add-On' : 'Tour'}
                    </p>

                    {item.metadata?.size && <p className="mt-1 text-sm text-white/60">Size: {String(item.metadata.size)}</p>}
                    {item.metadata?.shoeSize && (
                      <p className="mt-1 text-sm text-white/60">Shoe Size: {String(item.metadata.shoeSize)}</p>
                    )}

                    <p className="mt-2 text-lg font-black text-white">{formatMoney(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 font-black text-white"
                    >
                      −
                    </button>
                    <span className="text-lg font-black text-white">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 font-black text-white"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-2 h-8 w-8 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-200 flex items-center justify-center"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-[#d4af37]/25 bg-[#d4af37]/10 p-6 sticky top-24">
              <h2 className="text-xl font-extrabold text-white">Order Summary</h2>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-black text-white">{formatMoney(total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Tax</span>
                  <span className="font-black text-white">{formatMoney(0)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-white">Total</span>
                  <span className="text-2xl font-extrabold text-[#d4af37]">{formatMoney(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full h-14 rounded-2xl bg-[#d4af37] text-slate-950 font-black text-lg flex items-center justify-center hover:brightness-110 transition"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/tours/custom-charter"
                className="mt-3 block text-center text-sm font-semibold text-white/70 hover:text-[#d4af37]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
