'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type SfxName = 'reel_click' | 'champagne_pop' | 'wind';

type SoundContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  toggle: () => void;
  ensureUnlocked: () => Promise<void>;
  playSfx: (name: SfxName, volume?: number) => void;
  setWindBoost: (boost: boolean) => void;
  windBoost: boolean;
  setStoryMode: (on: boolean) => void;
  storyMode: boolean;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const DEFAULT_SFX: Partial<Record<SfxName, string>> = {};

const STORAGE_KEY = 'renes:soundEnabled';

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return true;
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === '0') return false;
      if (stored === '1') return true;
      return true;
    } catch {
      return true;
    }
  });
  const [windBoost, setWindBoostState] = useState(false);
  const [storyMode, setStoryModeState] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);
  const unlockPromiseRef = useRef<Promise<void> | null>(null);
  const interactionSeenRef = useRef(false);
  const sfxRef = useRef<Partial<Record<SfxName, HTMLAudioElement>>>({});
  const sfxAvailabilityRef = useRef<Partial<Record<SfxName, boolean>>>({});

  useEffect(() => {
    const mark = () => {
      interactionSeenRef.current = true;
    };

    const capturePointerOpts: AddEventListenerOptions = { capture: true, passive: true };
    const captureKeyOpts: AddEventListenerOptions = { capture: true };

    window.addEventListener('pointerdown', mark, capturePointerOpts);
    window.addEventListener('touchstart', mark, capturePointerOpts);
    window.addEventListener('keydown', mark, captureKeyOpts);

    return () => {
      window.removeEventListener('pointerdown', mark, capturePointerOpts);
      window.removeEventListener('touchstart', mark, capturePointerOpts);
      window.removeEventListener('keydown', mark, captureKeyOpts);
    };
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    } catch {
      // no-op
    }

    if (!next) {
      Object.values(sfxRef.current).forEach((a) => {
        try {
          a?.pause();
          if (a) a.currentTime = 0;
        } catch {
          // no-op
        }
      });
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabled(!enabled);
  }, [enabled, setEnabled]);

  const ensureUnlocked = useCallback(async () => {
    if (unlockedRef.current) return;
    if (unlockPromiseRef.current) return unlockPromiseRef.current;

    const waitForGesture = () =>
      new Promise<void>((resolve) => {
        const handler = () => {
          window.removeEventListener('pointerdown', handler);
          window.removeEventListener('keydown', handler);
          window.removeEventListener('touchstart', handler);
          resolve();
        };

        window.addEventListener('pointerdown', handler, { once: true });
        window.addEventListener('keydown', handler, { once: true });
        window.addEventListener('touchstart', handler, { once: true });
      });

    const attemptUnlock = async () => {
      if (!interactionSeenRef.current) {
        await waitForGesture();
        interactionSeenRef.current = true;
      }

      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) {
        unlockedRef.current = true;
        return;
      }

      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new Ctx();
        } catch {
          await waitForGesture();
          audioContextRef.current = new Ctx();
        }
      }

      const ctx = audioContextRef.current;
      if (ctx?.state === 'suspended') {
        try {
          await ctx.resume();
        } catch {
          await waitForGesture();
          await ctx.resume();
        }
      }

      unlockedRef.current = true;
    };

    unlockPromiseRef.current = attemptUnlock().finally(() => {
      unlockPromiseRef.current = null;
    });

    return unlockPromiseRef.current;
  }, []);

  const playSfx = useCallback(
    (name: SfxName, volume: number = 0.9) => {
      if (!enabled) return;

      const url = DEFAULT_SFX[name];
      if (!url) return;

      const play = async () => {
        await ensureUnlocked();

        // Probe once per session so missing assets never spam console.
        const known = sfxAvailabilityRef.current[name];
        if (known === false) return;
        if (known === undefined) {
          try {
            const res = await fetch(url, { method: 'HEAD' });
            if (!res.ok) {
              sfxAvailabilityRef.current[name] = false;
              return;
            }
            sfxAvailabilityRef.current[name] = true;
          } catch {
            // If we can't verify, assume it's available and let audio.play decide.
          }
        }

        let audio = sfxRef.current[name];
        if (!audio) {
          audio = new Audio(url);
          audio.preload = 'auto';
          audio.volume = volume;
          sfxRef.current[name] = audio;
        }

        try {
          audio.volume = volume;
        } catch {
          // no-op
        }

        try {
          audio.currentTime = 0;
        } catch {
          // no-op
        }

        try {
          const p = audio.play();
          if (p && typeof (p as Promise<void>).then === 'function') {
            await p;
          }
        } catch (err) {
          // Guardrail: never throw, never spam console.
          // If this was a missing asset in practice, mark as unavailable.
          const msg = err instanceof Error ? err.message : '';
          if (msg && msg.toLowerCase().includes('failed')) {
            sfxAvailabilityRef.current[name] = false;
          }
        }
      };

      void play();
    },
    [enabled, ensureUnlocked]
  );

  const setWindBoost = useCallback((boost: boolean) => {
    setWindBoostState(boost);
  }, []);

  const setStoryMode = useCallback((on: boolean) => {
    setStoryModeState(on);
  }, []);

  const value = useMemo<SoundContextValue>(
    () => ({
      enabled,
      setEnabled,
      toggle,
      ensureUnlocked,
      playSfx,
      setWindBoost,
      windBoost,
      setStoryMode,
      storyMode,
    }),
    [enabled, playSfx, setEnabled, toggle, ensureUnlocked, setWindBoost, windBoost, setStoryMode, storyMode]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return ctx;
}
