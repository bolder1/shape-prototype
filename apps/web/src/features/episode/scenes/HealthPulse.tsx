'use client';
// Scene for ld.4-2: Saathi's design dashboard counts tickets closed, screens per designer and Figma hours by name, and
// Megha strikes them out. In their place, a health check in three areas, each team measure drawn over three quarters
// against the line the team agreed (`SAATHI_READINGS`). Focus time crossed once, so it is watched; safety to show rough
// work has been under its line for three quarters, so she acts, by taking it to the team. Pure function of t (0–36).
// Also exports `HEALTH_FILL`, `HEALTH_LABEL` and `Spark`, which `health-read` uses.
import { HEALTH_CALLS, SAATHI_READINGS, healthCall, healthCheck, type HealthCall, type HealthReading, type SaathiReading } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per call; white text on each passes 4.5:1. */
export const HEALTH_FILL: Record<HealthCall, string> = { drop: '#475467', healthy: '#067647', watch: '#B54708', act: '#B42318' };
export const HEALTH_LABEL: Record<HealthCall, string> = { drop: 'Dropped', healthy: 'Healthy', watch: 'Watch', act: 'Act' };

/** Three quarters of a reading in a box, with its agreed line dashed; `line` (0–1) fades the line in. */
export function Spark({ r, x, y, w, h, line = 1, color }: { r: HealthReading; x: number; y: number; w: number; h: number; line?: number; color: string }) {
  const vals = [...r.history, ...(r.limit !== undefined ? [r.limit] : [])];
  const lo = Math.min(...vals), hi = Math.max(...vals), pad = (hi - lo || 1) * 0.2;
  const Y = (v: number) => y + h - ((v - lo + pad) / (hi - lo + 2 * pad)) * h;
  const X = (i: number) => x + 14 + (i * (w - 28)) / (r.history.length - 1);
  const pts = r.history.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
  return (
    <g>
      {r.limit !== undefined && (
        <line x1={x} x2={x + w} y1={Y(r.limit)} y2={Y(r.limit)} stroke={SC.muted} strokeWidth={2} strokeDasharray="6 5" opacity={line} />
      )}
      <polyline points={pts} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      {r.history.map((v, i) => <circle key={i} cx={X(i)} cy={Y(v)} r={6} fill={color} />)}
    </g>
  );
}

/** A reading's latest value with its unit: "48%", "6 days". */
export const readingValue = (r: HealthReading, v = r.history[r.history.length - 1]) => (r.unit.startsWith('%') ? `${v}%` : `${v} ${r.unit}`);

const TILES = [
  { big: '412', small: 'tickets closed' },
  { big: '24', small: 'screens / designer' },
  { big: 'By name', small: 'Figma hours' },
] as const;
const PANELS: readonly { area: string; k: SaathiReading }[] = [
  { area: 'Delivery', k: 'lead' }, { area: 'Quality', k: 'research' }, { area: 'People', k: 'safety' },
];
const ALL = Object.keys(SAATHI_READINGS) as SaathiReading[];
const CHECK = healthCheck(ALL);

function Big({ k, t0, t }: { k: SaathiReading; t0: number; t: number }) {
  const r = SAATHI_READINGS[k], c = healthCall(r);
  return (
    <g opacity={p(t, t0, t0 + 0.6)}>
      <rect x={32} y={80} width={576} height={196} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <text x={52} y={116} fontSize={21} fontWeight={900} fill={SC.text}>{r.short}</text>
      <rect x={456} y={94} width={132} height={34} rx={8} fill={HEALTH_FILL[c]} />
      <text x={522} y={118} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{HEALTH_LABEL[c]}</text>
      <Spark r={r} x={60} y={140} w={520} h={116} color={HEALTH_FILL[c]} />
    </g>
  );
}

export function HealthPulseScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A dashboard of activity' : t < 11 ? 'Counts aren’t health' : t < 16 ? 'Three areas' : t < 21 ? 'A line for each' : t < 26 ? 'One quarter is a blip' : t < 31 ? 'Three is a trend' : 'Then ask the team';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Saathi’s design dashboard shows 412 tickets closed, 24 screens per designer and Figma hours by name. Megha strikes them out: counts reward splitting work, and numbers by name make people look busy. Instead she sets a health check in three areas, delivery, quality and people, each with a line the team agreed: request to ready for dev, research behind features, and whether designers feel safe to show rough work. Focus time fell under its line for one quarter only, so she watches it. Safety to show rough work fell from 61% to 54% to 48%, under the line for three quarters, so she acts. Three readings to act on, three to watch, three healthy and three dropped, and she takes them to the team to ask why.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 11 && TILES.map((tile, i) => {
          const x = 32 + i * 196, dim = 1 - 0.6 * p(t, 7, 8);
          return (
            <g key={tile.small} opacity={p(t, 0.4 + i * 0.5, 1 + i * 0.5) * dim}>
              <rect x={x} y={86} width={184} height={120} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={x + 16} y={140} fontSize={32} fontWeight={900} fill={SC.text}>{tile.big}</text>
              <text x={x + 16} y={178} fontSize={21} fontWeight={800} fill={SC.muted}>{tile.small}</text>
              <line x1={x + 10} y1={196} x2={x + 174} y2={96} stroke={SC.error} strokeWidth={5} strokeLinecap="round"
                strokeDasharray={200} strokeDashoffset={200 * (1 - p(t, 6.4 + i * 0.4, 7 + i * 0.4))} />
            </g>
          );
        })}
        {t >= 6 && t < 11 && (
          <g opacity={p(t, 8, 8.6)}>
            <text x={32} y={262} fontSize={21} fontWeight={900} fill={SC.text}>Counts reward splitting work.</text>
            <text x={32} y={296} fontSize={21} fontWeight={800} fill={SC.muted}>Names on numbers teach people to look busy.</text>
          </g>
        )}

        {t >= 11 && t < 21 && PANELS.map((pn, i) => {
          const x = 32 + i * 196, r = SAATHI_READINGS[pn.k], c = t >= 16 ? healthCall(r) : 'drop';
          return (
            <g key={pn.k} opacity={p(t, 11.3 + i * 0.6, 11.9 + i * 0.6)}>
              <rect x={x} y={80} width={184} height={196} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={x + 14} y={112} fontSize={21} fontWeight={900} fill={SC.text}>{pn.area}</text>
              <Spark r={r} x={x + 10} y={130} w={164} h={100} line={p(t, 16.3, 17)} color={t >= 16 ? HEALTH_FILL[c] : SC.muted} />
              <text x={x + 14} y={262} fontSize={21} fontWeight={800} fill={SC.muted}>{readingValue(r)}</text>
            </g>
          );
        })}
        {t >= 16 && t < 21 && (
          <text x={32} y={320} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 17, 17.6)}>The team agrees where good ends.</text>
        )}

        {t >= 21 && t < 26 && (
          <g>
            <Big k="focus" t0={21.2} t={t} />
            <text x={32} y={320} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 22.4, 23)}>Under the line once: ask, and check next quarter.</text>
          </g>
        )}
        {t >= 26 && t < 31 && (
          <g>
            <Big k="safety" t0={26.2} t={t} />
            <text x={32} y={320} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 27.4, 28)}>Three quarters, 36 people: act on it.</text>
          </g>
        )}

        {t >= 31 && (
          <g>
            {HEALTH_CALLS.map((c, i) => (
              <g key={c} opacity={p(t, 31.3 + i * 0.4, 31.8 + i * 0.4)}>
                <rect x={32 + i * 147} y={96} width={135} height={88} rx={12} fill={HEALTH_FILL[c]} />
                <text x={99 + i * 147} y={138} fontSize={30} fontWeight={900} fill="#fff" textAnchor="middle">{CHECK[c].length}</text>
                <text x={99 + i * 147} y={170} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{HEALTH_LABEL[c]}</text>
              </g>
            ))}
            <g opacity={p(t, 33, 33.6)}>
              <text x={32} y={250} fontSize={21} fontWeight={900} fill={SC.text}>The number says where to look.</text>
              <text x={32} y={284} fontSize={21} fontWeight={800} fill={SC.muted}>The team says what’s wrong.</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
