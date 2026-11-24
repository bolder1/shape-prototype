'use client';
// Scene for rs.3-4: Arjun's roadmap note says "Q3: redesign checkout". Nisha lays out the four stages of a remote
// refill, drops the interview evidence under each, and plots the feeling line from it: ordering and paying is the high
// point, noticing stock is low the bottom. The low point gets "Fix here first", an owner and an opportunity, and the
// roadmap note is rewritten. Pure function of t (0–34). `FeelingLine` is shared with the Map the refill game.
import { FAMILY_SOLID } from '../kit';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

/** A feeling line over journey stages: values −2…2 (null = no evidence yet) at `xs`, drawn in the band
 *  [top, top + height]. `draw` (0–1) reveals the line left to right; `low` rings the lowest stage. */
export function FeelingLine({ values, xs, top, height, draw = 1, low = null, labels = true }: {
  values: readonly (number | null)[]; xs: readonly number[]; top: number; height: number; draw?: number; low?: number | null; labels?: boolean;
}) {
  const y = (v: number) => top + height / 2 - (v / 2) * (height / 2);
  const pts = values.map((v, i) => (v === null ? null : [xs[i], y(v)] as const)).filter((q): q is readonly [number, number] => q !== null);
  const d = pts.map(([x, yy], i) => {
    if (i === 0) return `M${x} ${yy}`;
    const [px, py] = pts[i - 1], mx = (px + x) / 2;
    return `C${mx} ${py} ${mx} ${yy} ${x} ${yy}`;
  }).join(' ');
  return (
    <g>
      <line x1={xs[0] - 60} x2={xs[xs.length - 1] + 60} y1={y(0)} y2={y(0)} stroke={SC.line} strokeWidth={1.5} strokeDasharray="4 5" />
      {labels && (
        <g fontSize={11} fontWeight={700} fill={SC.muted}>
          <text x={xs[0] - 62} y={y(2) + 4}>fine</text>
          <text x={xs[0] - 62} y={y(-2) + 4}>worst</text>
        </g>
      )}
      {pts.length > 1 && <path d={d} pathLength={1} fill="none" stroke={FAMILY_SOLID[0]} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${draw} 1`} />}
      {values.map((v, i) => v !== null && (
        <g key={i} opacity={clamp(draw * values.length - i)}>
          {low === i && <circle cx={xs[i]} cy={y(v)} r={17} fill="none" stroke={SC.error} strokeWidth={3} />}
          <circle cx={xs[i]} cy={y(v)} r={8} fill={SC.surface} stroke={FAMILY_SOLID[0]} strokeWidth={4} />
        </g>
      ))}
    </g>
  );
}

const STAGES = ['Notice it’s low', 'Find the prescription', 'Order and pay', 'Receive and check'];
const XS = [150, 375, 600, 825];
/** Evidence under each stage: who and how they felt (the same as the game's cards). */
const EVIDENCE: { s: number; who: string; f: number }[] = [
  { s: 0, who: 'P3', f: -2 }, { s: 0, who: 'P5', f: -2 }, { s: 0, who: 'P11', f: -1 },
  { s: 1, who: 'P8', f: -2 }, { s: 1, who: 'P1', f: -1 }, { s: 1, who: 'P12', f: 0 },
  { s: 2, who: 'P4', f: 2 }, { s: 2, who: 'P9', f: 1 },
  { s: 3, who: 'P7', f: -2 }, { s: 3, who: 'P10', f: 1 },
];
const AVG = STAGES.map((_, s) => { const f = EVIDENCE.filter(e => e.s === s).map(e => e.f); return f.reduce((a, b) => a + b, 0) / f.length; });
const LOW = AVG.indexOf(Math.min(...AVG));

export function JourneyMapScene({ t }: { t: number }) {
  const road = clamp(back((t - 0.5) / 0.5));
  const line = p(t, 15.6, 18.6);
  const fix = clamp(back((t - 21.4) / 0.5));
  const rewrite = p(t, 27.4, 28), strike = p(t, 27.8, 28.4), newPlan = p(t, 28.6, 29.2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a journey map built from interview evidence shows the low point is noticing stock is low, not checkout">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <text x={40} y={52} fontSize={22} fontWeight={800} fill={SC.text}>A refill, from another city</text>
      <text x={40} y={76} fontSize={14} fontWeight={600} fill={SC.muted}>12 Dawaa interviews · one kind of person · one job</text>

      {/* the roadmap note */}
      <g transform={`translate(800 52) rotate(3) scale(${road})`}>
        <rect x={-110} y={-34} width={220} height={68} rx={4} fill="#FDE68A" />
        <text x={-96} y={-12} fontSize={11} fontWeight={800} fill="#3B2F0B">Q3 ROADMAP · ARJUN</text>
        <text x={-96} y={12} fontSize={16} fontWeight={800} fill="#3B2F0B" opacity={1 - rewrite * 0.5}>Redesign checkout</text>
        {strike > 0 && <line x1={-98} x2={lerp(-98, 54, strike)} y1={7} y2={7} stroke="#B42318" strokeWidth={2.5} />}
        {newPlan > 0 && <text x={-96} y={28} fontSize={12} fontWeight={800} fill="#3B2F0B" opacity={newPlan}>→ Let families see refills coming</text>}
      </g>

      {/* stages */}
      {STAGES.map((s, i) => {
        const k = clamp(back((t - 5.2 - i * 0.4) / 0.45));
        return (
          <g key={s} transform={`translate(${XS[i]} 118) scale(${k})`}>
            <rect x={-104} y={-20} width={208} height={40} rx={12} fill={SC.surface} stroke={SC.text} strokeOpacity={0.35} strokeWidth={2} />
            <text y={5} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.text}>{i + 1}. {s}</text>
          </g>
        );
      })}

      {/* evidence under each stage */}
      {EVIDENCE.map((e, i) => {
        const k = clamp(back((t - 10.2 - i * 0.35) / 0.4)), row = EVIDENCE.slice(0, i).filter(o => o.s === e.s).length;
        return (
          <g key={e.who + e.s} transform={`translate(${XS[e.s] - 92} ${156 + row * 42}) scale(${k})`}>
            <rect width={184} height={34} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
            <text x={10} y={22} fontSize={12} fontWeight={800} fill={SC.text}>{e.who}</text>
            <rect x={42} y={12} width={90} height={4} rx={2} fill={SC.line} />
            <rect x={42} y={20} width={60} height={4} rx={2} fill={SC.line} />
            <text x={174} y={22} textAnchor="end" fontSize={12} fontWeight={800} fill={e.f < 0 ? SC.error : SC.text}>{e.f > 0 ? `+${e.f}` : e.f}</text>
          </g>
        );
      })}

      {/* the feeling line */}
      {line > 0 && <FeelingLine values={AVG} xs={XS} top={300} height={150} draw={line} low={fix > 0 ? LOW : null} />}

      {/* fix here first */}
      {fix > 0 && (
        <g transform={`translate(${XS[LOW]} 488) scale(${fix})`}>
          <rect x={-104} y={-22} width={208} height={44} rx={22} fill={SC.error} />
          <text y={6} textAnchor="middle" fontSize={16} fontWeight={800} fill="#fff">Fix here first</text>
        </g>
      )}
      {t >= 23 && (
        <g opacity={p(t, 23, 23.6)}>
          <text x={XS[LOW] + 130} y={482} fontSize={14} fontWeight={700} fill={SC.text}>Owner: Nisha + the refills squad</text>
          <text x={XS[LOW] + 130} y={504} fontSize={14} fontWeight={700} fill={SC.text}>Opportunity: show the family how many days are left</text>
        </g>
      )}
      {t >= 25 && (
        <g transform={`translate(${XS[2]} 282)`} opacity={p(t, 25, 25.6)}>
          <text textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>Works already: leave it</text>
        </g>
      )}
    </svg>
  );
}
