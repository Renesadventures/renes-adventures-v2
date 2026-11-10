'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  COOKIE_FIRST,
  COOKIE_LAST,
  COOKIE_SESSION,
  COOKIE_VISITOR,
  touchFromLocation,
} from '@/lib/attribution';
import { sendOpsEvent } from '@/lib/analytics/ops-client';

/**
 * Stamps every visit with where it came from, and tells Lia Desk once per
 * visit (session). Stores no personal data: an anonymous browser id, a
 * session id and the source of the visit.
 */

const SESSION_MINUTES = 30;

function readCookie(name: string): string | undefined {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? m[1] : undefined;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${value}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax; Secure`;
}

function randomId(): string {
  try {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 20);
  } catch {
    return Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
  }
}

export default function OpsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      // Never track the private ops pages or the CMS.
      if (/^\/(ops|studio|admin)/.test(window.location.pathname)) return;
      if (/bot|crawl|spider|preview|lighthouse|headless/i.test(navigator.userAgent)) return;

      let vid = readCookie(COOKIE_VISITOR);
      if (!vid) {
        vid = randomId();
        writeCookie(COOKIE_VISITOR, vid, 60 * 60 * 24 * 365);
      }

      const touch = touchFromLocation(window.location.href, document.referrer);
      const encoded = touch ? encodeURIComponent(JSON.stringify(touch)) : undefined;
      if (encoded && !readCookie(COOKIE_FIRST)) {
        writeCookie(COOKIE_FIRST, encoded, 60 * 60 * 24 * 180);
      }
      // An outside source (not Direct) refreshes the last touch.
      if (encoded && touch && (touch.source !== 'Direct' || !readCookie(COOKIE_LAST))) {
        writeCookie(COOKIE_LAST, encoded, 60 * 60 * 24 * 30);
      }

      // Session: sliding 30 minutes. A new session = one "visit" in Lia Desk.
      const raw = readCookie(COOKIE_SESSION);
      const isNew = !raw;
      const sid = raw ? raw.split('.')[0] : randomId();
      writeCookie(COOKIE_SESSION, `${sid}.${Date.now()}`, SESSION_MINUTES * 60);
      if (isNew) {
        sendOpsEvent('visit', { page: window.location.pathname });
      }
    } catch {
      /* measurement must never break the page */
    }
  }, [pathname]);

  return null;
}
