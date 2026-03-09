'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function AlertBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const onOpenWhatsApp = () => {
    window.open(
      'https://wa.me/5016707760?text=Hi+René\'s+Adventures+team!+I+saw+your+website+is+being+upgraded.+I+have+a+question+—+can+you+help%3F',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const onOpenLia = () => {
    window.dispatchEvent(
      new CustomEvent('lia:open', {
        detail: { message: "Hi Lia — I have a question while the website is being upgraded. Can you help?" },
      })
    );
  };

  return (
    <div className="relative z-[90] bg-amber-400 border-b border-amber-500">
      <div className="mx-auto max-w-screen-xl px-4 py-3 flex items-center gap-3">
        <span className="animate-pulse text-lg shrink-0" aria-hidden>🔧</span>
        <p className="text-slate-950 text-sm font-semibold flex-1 min-w-0">
          We&apos;re upgrading our website to bring you better service and up-to-date Belize
          information. We appreciate your patience.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenWhatsApp}
            className="hidden sm:flex items-center gap-1.5 bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-slate-800 transition"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={onOpenLia}
            className="hidden sm:flex items-center gap-1.5 border border-slate-950/30 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-amber-500 transition"
          >
            Talk to Lia
          </button>
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss"
            className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-amber-500 transition text-slate-950"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
