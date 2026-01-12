'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, useMotionValue } from 'framer-motion';
import { useSound } from '@/components/audio/SoundProvider';

type Layer = {
  el: HTMLAudioElement;
  gain: GainNode | null;
  source: MediaElementAudioSourceNode | null;
  url: string;
  ready: boolean;
};

function createLayer(ctx: AudioContext | null, url: string, loop: boolean): Layer {
  let el: HTMLAudioElement;
  try {
    el = new Audio();
    el.loop = loop;
    el.preload = 'auto';
    el.crossOrigin = 'anonymous';
  } catch {
    const silent = new Audio();
    silent.loop = loop;
    silent.preload = 'none';
    silent.volume = 0;
    return { el: silent, gain: null, source: null, url, ready: false };
  }

  if (!ctx) {
    el.volume = 0;
    return { el, gain: null, source: null, url, ready: false };
  }

  try {
    const source = ctx.createMediaElementSource(el);
    const gain = ctx.createGain();
    gain.gain.value = 0;

    source.connect(gain);
    gain.connect(ctx.destination);

    return { el, gain, source, url, ready: false };
  } catch {
    el.volume = 0;
    return { el, gain: null, source: null, url, ready: false };
  }
}

export default function AmbientEngine() {
  const { enabled, ensureUnlocked, windBoost, storyMode } = useSound();

  const [hasInteracted, setHasInteracted] = useState(false);

  const baseTarget = useMemo(() => {
    if (!enabled) return 0;
    return storyMode ? 0.05 : 0.22;
  }, [enabled, storyMode]);
  const windTarget = useMemo(() => {
    if (!enabled) return 0;
    if (storyMode) return 0;
    return windBoost ? 0.14 : 0.08;
  }, [enabled, windBoost, storyMode]);

  const docksideTarget = useMemo(() => {
    if (!enabled) return 0;
    return storyMode ? 0.12 : 0;
  }, [enabled, storyMode]);

  const baseVol = useMotionValue(0);
  const windVol = useMotionValue(0);
  const docksideVol = useMotionValue(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const baseRef = useRef<Layer | null>(null);
  const windRef = useRef<Layer | null>(null);
  const docksideRef = useRef<Layer | null>(null);
  const startedRef = useRef(false);
  const retryArmedRef = useRef(false);

  useEffect(() => {
    if (!hasInteracted) {
      const mark = () => setHasInteracted(true);
      window.addEventListener('audio:nav-gate', mark);
      return () => {
        window.removeEventListener('audio:nav-gate', mark);
      };
    }

    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx && !ctxRef.current) {
      try {
        ctxRef.current = new Ctx();
      } catch {
        ctxRef.current = null;
      }
    }

    const ctx = ctxRef.current;
    if (!baseRef.current) {
      baseRef.current = createLayer(ctx, '/audio/ambient/waves-base.mp3', true);
    }
    if (!windRef.current) {
      windRef.current = createLayer(ctx, '/audio/ambient/wind-layer.mp3', true);
    }
    if (!docksideRef.current) {
      docksideRef.current = createLayer(ctx, '/audio/ambient/acoustic-dockside.mp3', true);
    }

    const probeAndSet = async (layerRef: React.MutableRefObject<Layer | null>) => {
      const layer = layerRef.current;
      if (!layer) return;
      if (layer.ready) return;
      try {
        const res = await fetch(layer.url, { method: 'HEAD' });
        if (!res.ok) {
          layer.el.volume = 0;
          layer.ready = true;
          return;
        }
        layer.el.src = layer.url;
        layer.ready = true;
      } catch {
        // If we can't verify, avoid assigning src to prevent noisy 404s.
      }
    };

    void probeAndSet(baseRef);
    void probeAndSet(windRef);
    void probeAndSet(docksideRef);

    const unsubBase = baseVol.on('change', (v) => {
      const layer = baseRef.current;
      if (!layer) return;
      if (layer.gain) layer.gain.gain.value = v;
      else layer.el.volume = v;
    });

    const unsubWind = windVol.on('change', (v) => {
      const layer = windRef.current;
      if (!layer) return;
      if (layer.gain) layer.gain.gain.value = v;
      else layer.el.volume = v;
    });

    const unsubDockside = docksideVol.on('change', (v) => {
      const layer = docksideRef.current;
      if (!layer) return;
      if (layer.gain) layer.gain.gain.value = v;
      else layer.el.volume = v;
    });

    return () => {
      unsubBase();
      unsubWind();
      unsubDockside();

      [baseRef.current, windRef.current, docksideRef.current].forEach((layer) => {
        try {
          layer?.el.pause();
        } catch {
          // no-op
        }
      });
    };
  }, [baseVol, windVol, docksideVol, hasInteracted]);

  useEffect(() => {
    const go = async () => {
      if (!hasInteracted) return;

      if (!enabled) {
        animate(baseVol, 0, { duration: 0.8, ease: 'easeOut' });
        animate(windVol, 0, { duration: 0.8, ease: 'easeOut' });
        return;
      }

      await ensureUnlocked();

      const ctx = ctxRef.current;
      if (ctx?.state === 'suspended') {
        try {
          await ctx.resume();
        } catch {
          // no-op
        }
      }

      const startPlayback = async () => {
        let ok = false;
        try {
          await baseRef.current?.el.play();
          ok = true;
        } catch {
          // no-op
        }
        try {
          await windRef.current?.el.play();
          ok = true;
        } catch {
          // no-op
        }
        try {
          await docksideRef.current?.el.play();
          ok = true;
        } catch {
          // no-op
        }
        if (!ok) return false;

        startedRef.current = true;
        animate(baseVol, baseTarget, { duration: 1.2, ease: 'easeInOut' });
        animate(windVol, windTarget, { duration: 1.2, ease: 'easeInOut' });
        animate(docksideVol, docksideTarget, { duration: 1.2, ease: 'easeInOut' });
        return true;
      };

      if (!startedRef.current) {
        const ok = await startPlayback();

        if (!ok && !retryArmedRef.current) {
          retryArmedRef.current = true;

          const handler = () => {
            window.removeEventListener('pointerdown', handler);
            window.removeEventListener('keydown', handler);
            window.removeEventListener('touchstart', handler);
            retryArmedRef.current = false;
            void startPlayback();
          };

          window.addEventListener('pointerdown', handler, { once: true });
          window.addEventListener('keydown', handler, { once: true });
          window.addEventListener('touchstart', handler, { once: true });
        }

        return;
      }

      animate(baseVol, baseTarget, { duration: 1.2, ease: 'easeInOut' });
      animate(windVol, windTarget, { duration: 1.2, ease: 'easeInOut' });
      animate(docksideVol, docksideTarget, { duration: 1.2, ease: 'easeInOut' });
    };

    void go();
  }, [enabled, ensureUnlocked, baseTarget, windTarget, docksideTarget, baseVol, windVol, docksideVol, hasInteracted]);

  return null;
}
