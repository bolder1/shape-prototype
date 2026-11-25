'use client';
// Scene for ui.6-2: Roshni's on-track dots are red and green, and look the same to Anil, who is colour-blind
// (`simulateCvd`). Farah gives colour one job per chart (`PALETTE_JOBS`): distinct hues in a fixed order for four
// cities (kept when a filter hides one), one blue from light to dark instead of a rainbow for an amount, two arms and a
// grey middle for output against expected, grey with one colour for the society that fell behind, icons and words with
// every status, and a simulator check on every pair (`cvdDistance`). Pure function of t (0–36). Also exports
// `PaletteChart`, which `palette-tune` uses to colour each chart.
import { CHART_GREY, CHART_SERIES, CVD_MIN, ROSHNI_CHARTS, cvdDistance, markColour, simulateCvd, type PaletteJob, type RoshniChart } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
export const JOB_LABEL: Record<PaletteJob, string> = { categorical: 'Categorical', sequential: 'Sequential', diverging: 'Diverging', highlight: 'Highlight' };
const RED = '#d63b3b', GREEN = '#2e9e44';

/** A deterministic 0–1 value for cell (i, j) of chart `seed`. */
const noise = (i: number, j: number, seed: number) => (((i + 3) * 73 + (j + 5) * 151 + seed * 37) % 97) / 97;

/** The data each chart draws, generated once from its key so the scene and the game agree. */
type Shape = { lines: number[][]; focus: number[] } | { stack: number[][] } | { grid: number[][] } | { diverge: number[] };
function shapeOf(k: RoshniChart): Shape {
  const c = ROSHNI_CHARTS[k];
  const seed = k.length * 7 + k.charCodeAt(0);
  if (c.form === 'lines') {
    const focus = k === 'society' ? [7] : k === 'pune' ? [1] : k === 'skus' ? [3, 8] : [];
    const lines = Array.from({ length: c.series }, (_, s) => Array.from({ length: 12 }, (_, i) => {
      const base = 0.35 + noise(s, 0, seed) * 0.4 + Math.sin(i / 2 + s) * 0.06;
      return clamp(focus.includes(s) ? (k === 'society' ? base - i * 0.025 : base + i * 0.02) : base);
    }));
    return { lines, focus };
  }
  if (c.form === 'stack') return { stack: k === 'survey' ? [[0.08, 0.14, 0.18, 0.38, 0.22]] : [[0.5, 0.34, 0.16], [0.46, 0.38, 0.16], [0.44, 0.4, 0.16], [0.42, 0.4, 0.18]] };
  if (c.form === 'grid') {
    const [rows, cols] = k === 'heat' ? [6, 12] : k === 'roof' ? [5, 10] : [5, 8];
    return { grid: Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, col) => k === 'heat'
      ? clamp(Math.sin(((col + 0.5) / cols) * Math.PI) * (0.55 + 0.45 * Math.sin(((r + 1) / (rows + 1)) * Math.PI)))
      : k === 'roof' ? clamp(0.25 + noise(r, col, seed) * 0.35 + (col > 6 && r < 2 ? 0.4 : 0)) : noise(r, col, seed))) };
  }
  return { diverge: k === 'target' ? [-0.9, -0.55, -0.3, -0.12, -0.04, 0.02, 0.08, 0.18, 0.3, 0.42, 0.55, 0.66] : [-0.7, -0.35, -0.05, 0.15, 0.3, 0.48, 0.72, 0.9] };
}

/** One chart from Roshni's console, coloured for `job` (grey while it's null), optionally as a deuteranope sees it. */
export function PaletteChart({ k, job, cvd = false, x = 0, y = 0, w = 320, h = 170 }: { k: RoshniChart; job: PaletteJob | null; cvd?: boolean; x?: number; y?: number; w?: number; h?: number }) {
  const s = shapeOf(k);
  const paint = (m: { i?: number; v?: number; focus?: boolean }) => { const c = job ? markColour(job, m) : CHART_GREY; return cvd ? simulateCvd(c, 'deutan') : c; };
  if ('lines' in s) {
    const n = s.lines.length;
    const order = [...s.lines.keys()].sort((a, b) => Number(s.focus.includes(a)) - Number(s.focus.includes(b)));
    return (
      <g>
        <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={SC.muted} strokeWidth={1.5} />
        {order.map(i => {
          const f = s.focus.includes(i);
          const pts = s.lines[i].map((v, j) => `${x + (j / 11) * w},${y + h - v * h}`).join(' ');
          const v = (i / Math.max(1, n - 1)) * (job === 'diverging' ? 2 : 1) - (job === 'diverging' ? 1 : 0);
          return <polyline key={i} points={pts} fill="none" stroke={paint({ i, v, focus: f })} strokeWidth={f && job === 'highlight' ? 3 : 2} strokeLinejoin="round" />;
        })}
      </g>
    );
  }
  if ('stack' in s) {
    const bw = h / s.stack.length;
    return (
      <g>
        {s.stack.map((row, r) => {
          return row.map((v, i) => {
            const sw = v * w, rx = x + row.slice(0, i).reduce((s, u) => s + u, 0) * w;
            const t = row.length > 1 ? i / (row.length - 1) : 0;
            return <rect key={`${r}-${i}`} x={rx + 1} y={y + r * bw + bw * 0.18} width={Math.max(0, sw - 2)} height={bw * 0.64} rx={3}
              fill={paint({ i, v: job === 'diverging' ? t * 2 - 1 : t, focus: i === 0 })} />;
          });
        })}
      </g>
    );
  }
  if ('grid' in s) {
    const rows = s.grid.length, cols = s.grid[0].length, cw = w / cols, ch = h / rows;
    return (
      <g>
        {s.grid.map((row, r) => row.map((v, c) => (
          <rect key={`${r}-${c}`} x={x + c * cw + 1} y={y + r * ch + 1} width={cw - 2} height={ch - 2} rx={2}
            fill={paint({ i: Math.floor(v * 6), v: job === 'diverging' ? v * 2 - 1 : v, focus: v > 0.85 })} />
        )))}
      </g>
    );
  }
  const bars = s.diverge, bw = w / bars.length, mid = y + h / 2;
  return (
    <g>
      {bars.map((v, i) => (
        <rect key={i} x={x + i * bw + bw * 0.15} y={v >= 0 ? mid - v * (h / 2 - 4) : mid} width={bw * 0.7} height={Math.max(2, Math.abs(v) * (h / 2 - 4))} rx={3}
          fill={paint({ i, v: job === 'sequential' ? (v + 1) / 2 : v, focus: v < -0.5 })} />
      ))}
      <line x1={x} y1={mid} x2={x + w} y2={mid} stroke={SC.text} strokeWidth={1.5} />
    </g>
  );
}

/** A status dot: colour only, or colour with an icon and a word. */
function Status({ x, y, ok, cvd, words }: { x: number; y: number; ok: boolean; cvd: number; words: number }) {
  const c = ok ? GREEN : RED;
  const fill = cvd > 0 ? simulateCvd(c, 'deutan') : c;
  return (
    <g>
      <circle cx={x} cy={y} r={14} fill={fill} />
      <text x={x} y={y + 7} fontSize={20} fontWeight={900} fill="#fff" textAnchor="middle" opacity={words}>{ok ? '✓' : '!'}</text>
      <text x={x + 24} y={y + 7} fontSize={21} fontWeight={800} fill={SC.text} opacity={words}>{ok ? 'On track' : 'Off track'}</text>
    </g>
  );
}

export function ColourJobsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Red, green, guess' : t < 11 ? 'Names: distinct hues' : t < 16 ? 'Amounts: one hue' : t < 21 ? 'A middle that means something' : t < 26 ? 'Grey is a colour' : t < 31 ? 'Never colour alone' : 'Check it, don’t eyeball it';
  const sites = ['Gulmohar School', 'Sunshine Heights', 'Ashok Vihar', 'Lakeview Towers', 'Green Park'];
  const okay = [true, false, true, true, false];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a site list marks on-track sites green and off-track red; seen as a deuteranope sees them, both look the same. Four cities get four distinct hues in a fixed order, and Pune stays orange when Jaipur is filtered out. A heat grid in rainbow colours shows false bands; one blue from light to dark reads as more and less. Output against expected uses red below, blue above, grey at zero. Twenty society lines go grey except the one that fell behind. Status gets an icon and a word. Every colour pair is checked in a simulator.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {(t < 6 || (t >= 26 && t < 31)) && (() => {
          const cvd = t < 6 ? p(t, 3, 3.6) : 1;
          const words = t >= 26 ? p(t, 26.8, 27.6) : 0;
          return (
            <g>
              {sites.map((s, i) => (
                <g key={s}>
                  <text x={60} y={104 + i * 48} fontSize={21} fontWeight={700} fill={SC.text}>{s}</text>
                  <Status x={380} y={97 + i * 48} ok={okay[i]} cvd={cvd} words={words} />
                </g>
              ))}
              {t < 6 && <text x={600} y={340} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end" opacity={cvd}>As Anil sees it</text>}
            </g>
          );
        })()}

        {t >= 6 && t < 11 && (() => {
          const hide = p(t, 8.6, 9.4);
          const names = ['Jaipur', 'Pune', 'Coimbatore', 'Indore'];
          const ys = [0.72, 0.58, 0.44, 0.3];
          return (
            <g>
              <line x1={50} y1={320} x2={460} y2={320} stroke={SC.muted} strokeWidth={1.5} />
              {names.map((n, i) => {
                const pts = Array.from({ length: 12 }, (_, j) => `${50 + (j / 11) * 410},${320 - (ys[i] + Math.sin(j / 2 + i) * 0.05) * 230}`).join(' ');
                const o = i === 0 ? 1 - hide : 1;
                return (
                  <g key={n} opacity={o * p(t, 6.3 + i * 0.4, 6.9 + i * 0.4)}>
                    <polyline points={pts} fill="none" stroke={CHART_SERIES[i]} strokeWidth={3} />
                    <circle cx={460} cy={320 - (ys[i] + Math.sin(11 / 2 + i) * 0.05) * 230} r={5} fill={CHART_SERIES[i]} />
                    <text x={474} y={327 - (ys[i] + Math.sin(11 / 2 + i) * 0.05) * 230} fontSize={21} fontWeight={800} fill={SC.text}>{n}</text>
                  </g>
                );
              })}
              <text x={600} y={84} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end" opacity={hide}>Jaipur filtered out: Pune stays orange</text>
            </g>
          );
        })()}

        {t >= 11 && t < 16 && (() => {
          const fix = p(t, 13.2, 14.2);
          const s = shapeOf('heat');
          if (!('grid' in s)) return null;
          return (
            <g>
              {s.grid.map((row, r) => row.map((v, c) => (
                <rect key={`${r}-${c}`} x={60 + c * 44} y={80 + r * 38} width={42} height={36} rx={3}
                  fill={fix < 0.5 ? `hsl(${lerp(260, 0, v)} 85% 55%)` : markColour('sequential', { v })} />
              )))}
              <text x={60} y={334} fontSize={21} fontWeight={800} fill={SC.muted}>{fix < 0.5 ? 'Rainbow: bands that aren’t in the data' : 'One blue: light is less, dark is more'}</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (
          <g>
            <PaletteChart k="target" job="diverging" x={50} y={80} w={540} h={220} />
            <text x={50} y={334} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 17, 17.6)}>Below expected</text>
            <text x={590} y={334} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end" opacity={p(t, 17, 17.6)}>Above expected</text>
          </g>
        )}

        {t >= 21 && t < 26 && (() => {
          const s = shapeOf('society');
          const end = 'lines' in s ? 80 + 230 - s.lines[7][11] * 230 : 210;
          return (
          <g>
            <PaletteChart k="society" job={t < 22.6 ? 'categorical' : 'highlight'} x={50} y={80} w={430} h={230} />
            <text x={492} y={end + 6} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 22.8, 23.4)}>Ashok Vihar</text>
            <text x={492} y={end + 32} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 23.2, 23.8)}>fell behind</text>
          </g>
          );
        })()}

        {t >= 31 && (
          <g>
            {[[CHART_SERIES[0], CHART_SERIES[1]], [CHART_SERIES[1], CHART_SERIES[2]], [RED, GREEN]].map(([a, b], i) => {
              const d = cvdDistance(a, b), ok = d >= CVD_MIN;
              const o = p(t, 31.3 + i * 0.7, 31.9 + i * 0.7);
              return (
                <g key={i} opacity={o}>
                  <circle cx={80} cy={110 + i * 76} r={20} fill={a} /><circle cx={124} cy={110 + i * 76} r={20} fill={b} />
                  <circle cx={210} cy={110 + i * 76} r={20} fill={simulateCvd(a, 'deutan')} /><circle cx={254} cy={110 + i * 76} r={20} fill={simulateCvd(b, 'deutan')} />
                  <text x={310} y={118 + i * 76} fontSize={22} fontWeight={900} fill={SC.text}>ΔE {d.toFixed(0)}</text>
                  <text x={420} y={118 + i * 76} fontSize={22} fontWeight={900} fill={ok ? SC.text : SC.error}>{ok ? '✓ Apart' : '✗ Same to Anil'}</text>
                </g>
              );
            })}
            <text x={232} y={334} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle" opacity={p(t, 33.4, 34)}>Simulated</text>
          </g>
        )}
      </g>
    </svg>
  );
}
