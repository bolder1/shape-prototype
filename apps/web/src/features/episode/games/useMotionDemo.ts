'use client';
// A clock for the pr.2 games, which play real motion. It loops on its own, unless the person has asked their device to
// reduce motion: then nothing moves until they press Play, it plays once for `seconds`, and `still` says to draw the
// finished frame (with its frames drawn as a trail) instead.
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useSceneClock } from './useSceneClock';

export function useMotionDemo(seconds: number) {
  const reduce = useReducedMotion() ?? false;
  const [playing, setPlaying] = useState(false);
  const t = useSceneClock(!reduce || playing);
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setPlaying(false), seconds * 1000);
    return () => clearTimeout(id);
  }, [playing, seconds]);
  return { t, reduce, still: reduce && !playing, play: () => setPlaying(true) };
}
