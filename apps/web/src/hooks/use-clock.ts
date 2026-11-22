'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A playable clock for time-driven animation (the skill-map journey, episode scenes): t in seconds,
 * with play / pause / seek. It stops at `end`; raise `end` and play again to continue past it.
 */
export function useClock(end: number, { autoplay = true }: { autoplay?: boolean } = {}) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const tRef = useRef(0);
  useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      tRef.current = Math.min(end, tRef.current + (now - last) / 1000); last = now;
      setT(tRef.current);
      if (tRef.current >= end) { setPlaying(false); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, end]);
  const seek = useCallback((x: number) => { tRef.current = Math.min(end, Math.max(0, x)); setT(tRef.current); }, [end]);
  const toggle = useCallback(() => { if (tRef.current >= end) seek(0); setPlaying(p => !p); }, [end, seek]);
  const replay = useCallback(() => { seek(0); setPlaying(true); }, [seek]);
  return { t, playing, seek, toggle, replay, setPlaying };
}
