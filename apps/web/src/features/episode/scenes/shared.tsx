// Shared helpers for episode scenes. Every scene is a pure function of t (seconds), so these are pure too.

export const clamp = (x: number) => Math.min(1, Math.max(0, x));
/** Ease in-out (cubic). */
export const ease = (x: number) => { const c = clamp(x); return c < 0.5 ? 4 * c * c * c : 1 - (-2 * c + 2) ** 3 / 2; };
/** Overshoot then settle: things popping in. */
export const back = (x: number) => { const c = clamp(x), k = 1.7; return 1 + (k + 1) * (c - 1) ** 3 + k * (c - 1) ** 2; };
/** Eased 0 → 1 between seconds a and b. */
export const p = (t: number, a: number, b: number) => ease((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const at = (A: readonly number[], B: readonly number[], k: number) => [lerp(A[0], B[0], k), lerp(A[1], B[1], k)] as const;

/** Theme-aware colours for scenes (CSS variables flip with dark mode). */
export const SC = {
  surface: 'var(--color-bg-primary)', soft: 'var(--color-bg-secondary)', line: 'var(--color-border-secondary)',
  text: 'var(--color-text-primary)', muted: 'var(--color-text-tertiary)', brand: 'var(--color-bg-brand-solid)',
  mint: '#2BC08A', error: 'var(--color-fg-error-primary)',
  discover: 'var(--color-family-discover)', design: 'var(--color-family-design)', grow: 'var(--color-family-grow)', build: 'var(--color-family-build)',
};

/** Nib, small, with its tip at (x, y). `mood` changes the eyes. */
export function Pen({ x, y, tilt = 0, scale = 0.42, mood = 'idle' }: { x: number; y: number; tilt?: number; scale?: number; mood?: 'idle' | 'think' | 'cheer' }) {
  const ry = mood === 'cheer' ? 2.2 : mood === 'think' ? 3.4 : 4.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale}) translate(-40 -84)`}>
      <circle cx={40} cy={84} r={26} fill={SC.mint} opacity={0.25} />
      <path d="M40 4 C60 4 70 18 70 34 C70 52 52 70 40 84 C28 70 10 52 10 34 C10 18 20 4 40 4 Z" fill="#1E2A4A" stroke="#fff" strokeOpacity={0.2} strokeWidth={2} />
      <circle cx={40} cy={84} r={5} fill={SC.mint} />
      <ellipse cx={29} cy={30} rx={4.2} ry={ry} fill="#fff" /><ellipse cx={51} cy={30} rx={4.2} ry={ry} fill="#fff" />
    </g>
  );
}

/** A faint designer's grid behind the scene. */
export function Grid({ w = 960, h = 540 }: { w?: number; h?: number }) {
  return (
    <g aria-hidden>
      {Array.from({ length: Math.ceil(w / 40) }, (_, i) => <line key={`v${i}`} x1={i * 40} x2={i * 40} y1={0} y2={h} stroke={SC.line} strokeOpacity={0.35} />)}
      {Array.from({ length: Math.ceil(h / 40) }, (_, i) => <line key={`h${i}`} y1={i * 40} y2={i * 40} x1={0} x2={w} stroke={SC.line} strokeOpacity={0.35} />)}
    </g>
  );
}
