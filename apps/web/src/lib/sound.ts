'use client';
// Sound: every effect is synthesised with the Web Audio API (no files, no licensing, nothing to download).
// Each sound is a few notes with soft attack/release envelopes, tuned to one key so they sit well together.
// On by default at a gentle volume; muted state is remembered per browser; respects reduced-motion as "off" by default.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SoundName =
  | 'tap' | 'correct' | 'wrong' | 'combo' | 'pop' | 'whoosh' | 'tick' | 'drumroll' | 'reveal' | 'fanfare' | 'flip';

interface SoundState { on: boolean; toggle: () => void }

const prefersQuiet = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useSound = create<SoundState>()(persist(set => ({
  on: !prefersQuiet(),
  toggle: () => set(s => ({ on: !s.on })),
}), { name: 'shape.sound.v1', version: 1 }));

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const VOLUME = 0.35;

function audio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = VOLUME;
    master.connect(ctx.destination);
  }
  // Browsers start audio suspended until a user gesture; every sound here follows one, so resuming is enough.
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** One note: frequency (Hz), start offset and length (s), waveform, peak gain, optional pitch glide. */
function note(freq: number, at: number, len: number, type: OscillatorType = 'sine', peak = 0.6, glideTo?: number) {
  const ac = audio(); if (!ac || !master) return;
  const t0 = ac.currentTime + at;
  const osc = ac.createOscillator(), env = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + len);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(peak, t0 + Math.min(0.015, len / 4));   // fast, click-free attack
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + len);                       // soft release
  osc.connect(env).connect(master);
  osc.start(t0);
  osc.stop(t0 + len + 0.02);
}

/** A short burst of filtered noise (whoosh, drum hits). */
function noise(at: number, len: number, from: number, to: number, peak = 0.4) {
  const ac = audio(); if (!ac || !master) return;
  const t0 = ac.currentTime + at;
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * len), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource(), filter = ac.createBiquadFilter(), env = ac.createGain();
  src.buffer = buf;
  filter.type = 'bandpass'; filter.Q.value = 0.8;
  filter.frequency.setValueAtTime(from, t0);
  filter.frequency.exponentialRampToValueAtTime(to, t0 + len);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(peak, t0 + len * 0.3);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
  src.connect(filter).connect(env).connect(master);
  src.start(t0);
  src.stop(t0 + len + 0.02);
}

// C major, so everything harmonises: C5 = 523.25 Hz.
const C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.5, A4 = 440;

const SOUNDS: Record<SoundName, (level?: number) => void> = {
  tap: () => note(880, 0, 0.05, 'triangle', 0.25),
  pop: () => note(600, 0, 0.09, 'sine', 0.45, 1100),
  flip: () => noise(0, 0.12, 2000, 6000, 0.18),
  correct: () => { note(C5, 0, 0.12, 'triangle', 0.5); note(G5, 0.08, 0.22, 'triangle', 0.5); },
  wrong: () => { note(311, 0, 0.14, 'sawtooth', 0.12); note(233, 0.1, 0.26, 'sawtooth', 0.12); },
  // Each step of a streak goes a little higher, capped so it never gets shrill.
  combo: (level = 1) => { const f = C5 * 2 ** (Math.min(level, 8) * 2 / 12); note(f, 0, 0.1, 'triangle', 0.45); note(f * 1.5, 0.07, 0.18, 'sine', 0.35); },
  whoosh: () => noise(0, 0.32, 400, 3000, 0.22),
  tick: () => note(1200, 0, 0.03, 'square', 0.08),
  drumroll: () => { for (let i = 0; i < 12; i++) noise(i * 0.11, 0.08, 180, 120, 0.12 + i * 0.015); },
  reveal: () => { note(C5, 0, 0.1, 'triangle', 0.45); note(E5, 0.07, 0.1, 'triangle', 0.45); note(G5, 0.14, 0.3, 'triangle', 0.5); },
  fanfare: () => {
    [C5, E5, G5].forEach((f, i) => note(f, i * 0.11, 0.18, 'triangle', 0.45));
    note(C6, 0.36, 0.6, 'triangle', 0.5); note(G5, 0.36, 0.6, 'sine', 0.3); note(E5, 0.36, 0.6, 'sine', 0.25);
    note(A4 / 2, 0.36, 0.6, 'sine', 0.3);
  },
};

/** Plays a sound if sound is on. Safe to call anywhere (no-op on the server or without Web Audio). */
export function play(name: SoundName, level?: number) {
  if (!useSound.getState().on) return;
  try { SOUNDS[name](level); } catch { /* audio is a nice-to-have; never break the lesson over it */ }
}
