'use client';
// A running clock in seconds for games that reuse a scene's animated drawing (e.g. coins travelling along a money flow).
import { useEffect, useState } from 'react';

export function useSceneClock(running: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => { setT((now - start) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return t;
}
