'use client';

import React from 'react';
import { buildWhatsAppTourLink } from '@/lib/utils/whatsapp-link';

export default function TourActions({ title }: { title: string }) {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          const url = buildWhatsAppTourLink({ tourName: title });
          window.open(url, '_blank', 'noopener,noreferrer');
        }}
        className="w-full bg-gradient-to-r from-tropical-coral to-tropical-orange text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all mb-3"
      >
        Book This Adventure
      </button>

      <button
        type="button"
        onClick={() => {
          const event = new CustomEvent('lia:open', {
            detail: { message: `Tell me more about ${title}` }
          });
          window.dispatchEvent(event);
        }}
        className="w-full border-2 border-tropical-turquoise text-tropical-turquoise font-semibold py-4 rounded-xl hover:bg-tropical-turquoise hover:text-white transition-all"
      >
        Ask Lia About This Tour
      </button>
    </>
  );
}
