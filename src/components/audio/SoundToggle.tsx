'use client';

import { useSound } from '@/components/audio/SoundProvider';

export default function SoundToggle() {
  const { enabled, toggle, ensureUnlocked } = useSound();

  return (
    <button
      type="button"
      onClick={async () => {
        await ensureUnlocked();
        toggle();
      }}
      className="rounded-full border px-4 py-2 text-xs font-semibold tracking-widest backdrop-blur-md transition"
      style={{
        borderColor: 'rgba(212, 175, 55, 0.55)',
        backgroundColor: enabled ? 'rgba(212, 175, 55, 0.12)' : 'rgba(0,0,0,0.35)',
        color: enabled ? '#D4AF37' : 'rgba(212, 175, 55, 0.75)',
      }}
      aria-pressed={enabled}
    >
      Sound: {enabled ? 'ON' : 'OFF'}
    </button>
  );
}
