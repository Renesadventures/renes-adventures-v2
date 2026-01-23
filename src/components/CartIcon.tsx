'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart-store';

export default function CartIcon() {
  const itemCount = useCartStore((state) => state.itemCount());

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-5 w-5 text-white" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#d4af37] text-slate-950 text-xs font-black flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
