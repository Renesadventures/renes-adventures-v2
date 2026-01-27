'use client';

import React, { createContext, useContext, useMemo } from 'react';

type SoundId = 'reel_click' | 'champagne_pop' | 'wind';

type SoundContextValue = {
  playSfx: (id: SoundId) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<SoundContextValue>(() => {
    return {
      playSfx: () => {
        // no-op fallback (keeps UI working even if audio assets aren't wired yet)
      },
    };
  }, []);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    return {
      playSfx: () => {
        // no-op when provider isn't mounted
      },
    } satisfies SoundContextValue;
  }
  return ctx;
}
