'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EVENTS, trackWithServer } from '@/lib/analytics/events';

/**
 * Reports the completed booking, once.
 *
 * This is the only event on the website that represents money, so it is also
 * the only one where double counting really hurts — a refreshed confirmation
 * page would otherwise report a second sale that never happened. The Stripe
 * session id is kept in sessionStorage and a repeat of the same id is
 * ignored.
 *
 * sessionStorage can be empty or throw (private windows, blocked storage), so
 * every touch is wrapped. Worst case the event fires twice for one guest,
 * which is better than never firing at all.
 */
export default function PurchaseTracker() {
  const params = useSearchParams();

  useEffect(() => {
    const sessionId = params.get('session_id');
    if (!sessionId) return;

    const key = `ra_purchase_${sessionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      /* storage unavailable — report anyway rather than lose the sale */
    }

    // No value is passed: the amount lives in Stripe, and a figure invented
    // here would be worse than none. Feed real revenue in later from the
    // Stripe webhook, which is the only place that knows what was actually
    // charged.
    trackWithServer(EVENTS.PURCHASE, { item: 'charter booking', page: '/booking/success' });
  }, [params]);

  return null;
}
