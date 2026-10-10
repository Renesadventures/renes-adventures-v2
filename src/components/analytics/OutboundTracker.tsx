'use client';

import { useEffect } from 'react';
import { EVENTS, trackWithServer } from '@/lib/analytics/events';

/**
 * Catches the enquiries that leave the website.
 *
 * On this site a very large share of real intent never touches a form — the
 * guest taps a WhatsApp link or the phone number and the conversation moves
 * to a phone nobody is measuring. Those clicks were completely invisible, so
 * the most common way a booking starts here produced no signal at all, to
 * Google or to Meta.
 *
 * Done with one listener on the document rather than by editing the twelve
 * components that hold these links: fewer places to forget, and a link added
 * next month is caught without anyone remembering to wire it up.
 */
export default function OutboundTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest?.('a');
      if (!el) return;
      const href = el.getAttribute('href') || '';
      if (!href) return;

      try {
        if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)/i.test(href)) {
          trackWithServer(EVENTS.WHATSAPP_CLICK, {
            item: el.textContent?.trim().slice(0, 80) || 'whatsapp',
            page: window.location.pathname,
          });
        } else if (href.startsWith('tel:')) {
          trackWithServer(EVENTS.PHONE_CLICK, { item: href, page: window.location.pathname });
        }
      } catch {
        /* a measurement failure must never block the click */
      }
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
