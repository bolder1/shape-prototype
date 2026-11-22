'use client';
// Scene for gr.1-1: an AARRR funnel of bars. Conversion between stages appears and the activation leak glows red;
// doubling the visitors doubles every bar (and the leak); raising activation from 10% to 30% triples everything below it.
// Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const STAGES = ['Acquisition', 'Activation', 'Retention', 'Referral', 'Revenue'];
const BASE = [400, 40, 30, 12, 8];        // of 1,000 visitors
const DOUBLED = BASE.map(n => n * 2);
const FIXED = [400, 120, 90, 36, 24];      // activation 10% → 30%

export function FunnelScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const dbl = t < 23 ? p(t, 17.4, 18.6) * (1 - p(t, 22.4, 23)) : 0;
  const fix = p(t, 23.4, 24.8);
  const counts = BASE.map((n, i) => lerp(lerp(n, DOUBLED[i], dbl), FIXED[i], fix));
  const showRates = t >= 11;
  const maxW = 560;   // px for 800 people, a fixed scale so doubling visibly widens the bars

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: an AARRR funnel where activation leaks the most">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <text x={480} y={66} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.muted}>{dbl > 0.5 ? '2,000 visitors' : '1,000 visitors'}</text>
        {STAGES.map((s, i) => {
          const y = 100 + i * 78, shown = clamp(back((t - (i === 0 ? 0.3 : 5 + i * 0.4)) / 0.5));
          const w = Math.max(6, (counts[i] / 800) * maxW) * shown;
          const leak = i === 1 && t >= 11.6 && fix < 0.5;
          return (
            <g key={s}>
              <text x={250} y={y + 31} textAnchor="end" fontSize={15} fontWeight={800} fill={leak ? SC.error : SC.text} opacity={shown}>{s}</text>
              <rect x={270} y={y} width={w} height={50} rx={12} fill={leak ? SC.error : [SC.discover, SC.design, SC.grow, SC.build, SC.mint][i]} opacity={0.9} />
              {shown > 0.5 && <text x={280 + w} y={y + 31} fontSize={15} fontWeight={800} fill={SC.text}>{Math.round(counts[i])}</text>}
              {showRates && i > 0 && (
                <g opacity={clamp((t - 11 - i * 0.3) / 0.4)}>
                  <text x={890} y={y + 31} textAnchor="middle" fontSize={15} fontWeight={800} fill={leak ? SC.error : SC.muted}>
                    ↓ {Math.round((counts[i] / counts[i - 1]) * 100)}%
                  </text>
                </g>
              )}
            </g>
          );
        })}
        {t >= 12 && t < 17 && <text x={480} y={510} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error}>90% of sign-ups leave before activating.</text>}
        {t >= 18.6 && t < 23 && <text x={480} y={510} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error}>Twice the spend. Still 90% lost at activation.</text>}
        {t >= 25 && t < 29 && <text x={480} y={510} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint}>Activation 10% → 30%: every stage below triples, at no extra ad spend.</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'AARRR', l: 'Five stages, in order', c: SC.discover }, { x: 480, n: 'Conversion', l: 'The % between stages', c: SC.design }, { x: 760, n: 'Fix the leak', l: 'Before pouring in more', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
