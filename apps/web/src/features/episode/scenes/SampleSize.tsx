'use client';
// Scene for gr.3-2: Farhan wants to switch on the fee test and look on Thursday. Kavya plots the unchanged cart day by
// day: it wanders more than the lift they hope for. She sets the smallest lift worth finding (+10%, 8% to 8.8%), and the
// sample comes from `sampleSize` (18,872 a version; Lehr's rule on paper gives 18,400). A curve of people needed
// against lift, on a log scale, shows half the lift needing four times the people. 6,000 carts a day fill the sample in
// just over six days, rounded up to one full week, and the plan card closes it with the green button's 22 weeks struck
// off. Numbers come from `planTest`. Pure function of t (0–36).
import { TOKRI_PLANS, lehr, planTest, sampleSize } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { INK } from './EaseCurves';
import { TOKRI, TOKRI_SOFT } from './HypothesisShape';

const W = 960, H = 540;
const n = (x: number) => x.toLocaleString('en-IN');
const FEE = planTest(TOKRI_PLANS.feeEarly), HALF = planTest(TOKRI_PLANS.smallLift), GREEN = planTest(TOKRI_PLANS.greenPay);
const LEHR = lehr(TOKRI_PLANS.feeEarly.base, TOKRI_PLANS.feeEarly.base * TOKRI_PLANS.feeEarly.lift);
/** An unchanged cart, day by day: conversion on about 3,000 carts a version moves by half a point either way. */
const NOISE = [7.4, 8.6, 7.9, 8.3, 7.7, 8.4, 8.1, 7.6, 8.5, 8.0, 7.8, 8.2, 8.7, 7.9];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** People a version against relative lift, 2% to 20%, from an 8% baseline: log scale, 1,000 to 1,000,000. */
const LIFTS = Array.from({ length: 37 }, (_, i) => 0.02 + i * 0.005);
const CURVE = LIFTS.map(l => ({ l, n: sampleSize(0.08, 0.08 * (1 + l)) }));
/** Noise chart: 7% to 9%, top down. */
const ny = (v: number) => (9.3 - v) * 110;
const cx = (l: number) => ((l - 0.02) / 0.18) * 460;
const cy = (v: number) => 240 - ((Math.log10(v) - 3) / 3) * 240;

export function SampleSizeScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Tokri wants to look at its fee test after a few days; day-to-day noise on an unchanged cart moves between 7.4% and 8.7%, more than the lift they want; the smallest lift worth finding is +10%, 8% to 8.8%; at 5% significance and 80% power that needs ${n(FEE.n)} people a version (Lehr's rule gives ${n(LEHR)}); half the lift needs ${n(HALF.n)}, four times as many; 6,000 carts a day supply ${n(FEE.total)} people in just over six days, so the test runs one full week; a green button at +2% would need ${GREEN.weeks} weeks`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? '“A few days and see”' : t < 11 ? 'Noise first' : t < 16 ? 'The smallest lift worth finding' : t < 21 ? `${n(FEE.n)} a version` : t < 26 ? 'Half the lift, four times the people' : t < 31 ? 'Traffic sets the calendar' : 'Written down before it starts'}
        </text>

        {t < 6 && (
          <g transform="translate(60 110)">
            {DAYS.map((d, i) => (
              <g key={d} transform={`translate(${i * 118} 0)`} opacity={p(t, 0.3 + i * 0.15, 0.7 + i * 0.15)}>
                <rect width={104} height={120} rx={14} fill={SC.surface} stroke={d === 'Thu' ? '#B42318' : SC.line} strokeWidth={d === 'Thu' ? 3 : 1} />
                <text x={52} y={34} textAnchor="middle" fontSize={16} fontWeight={900} fill={SC.text}>{d}</text>
                {i < 4 && <rect x={22} y={60} width={60} height={12} rx={6} fill={TOKRI} opacity={p(t, 1.6 + i * 0.4, 2 + i * 0.4)} />}
              </g>
            ))}
            <g opacity={p(t, 3.4, 4)} transform="translate(300 170)">
              <rect width={300} height={64} rx={8} fill="#FEF0C7" transform="rotate(-1.5 150 32)" />
              <text x={20} y={30} fontSize={15} fontWeight={800} fill={INK}>Farhan: “Switch it on Monday,</text>
              <text x={20} y={52} fontSize={15} fontWeight={800} fill={INK}>and we’ll look on Thursday.”</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(110 110)">
            <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>The same cart, nothing changed: conversion each day</text>
            <g transform="translate(0 30)">
              {[7, 8, 9].map(v => (
                <g key={v}>
                  <line x1={0} x2={720} y1={ny(v)} y2={ny(v)} stroke={SC.line} />
                  <text x={-10} y={ny(v) + 5} textAnchor="end" fontSize={12} fontWeight={800} fill={SC.muted}>{v}%</text>
                </g>
              ))}
              <g opacity={p(t, 8.6, 9.2)}>
                <line x1={0} x2={720} y1={ny(8.8)} y2={ny(8.8)} stroke="#067647" strokeWidth={2} strokeDasharray="6 5" />
                <text x={720} y={ny(8.8) - 8} textAnchor="end" fontSize={12} fontWeight={900} fill="#067647">8.8%: the lift they hope for</text>
              </g>
              {NOISE.map((v, i) => {
                const k = p(t, 6.4 + i * 0.12, 6.7 + i * 0.12);
                return <circle key={i} cx={20 + i * 52} cy={ny(v)} r={8 * k} fill={TOKRI} />;
              })}
            </g>
            <text x={0} y={320} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 9.2, 9.8)}>It wanders by more than the lift they hope for. Four days can’t tell the two apart.</text>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(110 120)">
            {[{ l: 'Today', v: 8, fill: SC.muted }, { l: 'Worth building', v: 8.8, fill: '#067647' }].map((r, i) => (
              <g key={r.l} transform={`translate(0 ${i * 80})`} opacity={p(t, 11.2 + i * 0.6, 11.8 + i * 0.6)}>
                <text x={0} y={26} fontSize={16} fontWeight={800} fill={SC.text}>{r.l}</text>
                <rect x={180} y={6} width={54 * r.v * p(t, 11.4 + i * 0.6, 12.4 + i * 0.6)} height={30} rx={8} fill={r.fill} />
                <text x={190 + 54 * r.v} y={29} fontSize={18} fontWeight={900} fill={SC.text}>{r.v}%</text>
              </g>
            ))}
            <g opacity={p(t, 13, 13.6)} transform="translate(0 200)">
              <text x={0} y={0} fontSize={20} fontWeight={900} fill={SC.text}>Minimum detectable effect: +10%, or 0.8 points</text>
              <text x={0} y={32} fontSize={16} fontWeight={800} fill={SC.muted}>Anything smaller wouldn’t pay for the work, so the test doesn’t need to see it.</text>
            </g>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g transform="translate(110 110)">
            {[['Baseline', '8%'], ['Smallest lift', '+0.8 points'], ['Significance', '5%, two-sided'], ['Power', '80%']].map(([k, v], i) => (
              <g key={k} transform={`translate(0 ${i * 52})`} opacity={p(t, 16.2 + i * 0.4, 16.7 + i * 0.4)}>
                <rect width={300} height={42} rx={10} fill={SC.surface} stroke={SC.line} />
                <text x={16} y={27} fontSize={14} fontWeight={800} fill={SC.muted}>{k}</text>
                <text x={284} y={27} textAnchor="end" fontSize={15} fontWeight={900} fill={SC.text}>{v}</text>
              </g>
            ))}
            <g opacity={p(t, 18, 18.6)} transform="translate(360 0)">
              <text x={0} y={30} fontSize={15} fontWeight={800} fill={SC.muted}>People needed in each version</text>
              <text x={0} y={100} fontSize={64} fontWeight={900} fill={SC.text}>{n(FEE.n)}</text>
              <text x={0} y={136} fontSize={15} fontWeight={800} fill={SC.muted}>{n(FEE.total)} in all, across A and B</text>
            </g>
            <g opacity={p(t, 19.2, 19.8)} transform="translate(360 180)">
              <rect width={420} height={64} rx={12} fill={TOKRI_SOFT} />
              <text x={16} y={26} fontSize={13} fontWeight={900} fill={TOKRI}>Lehr’s rule, on paper</text>
              <text x={16} y={50} fontSize={15} fontWeight={900} fill={TOKRI}>16 × 0.08 × 0.92 ÷ 0.008² ≈ {n(LEHR)}</text>
            </g>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g transform="translate(140 110)">
            <text x={0} y={-6} fontSize={14} fontWeight={800} fill={SC.muted}>People a version, from an 8% baseline</text>
            <g transform="translate(0 16)">
              {[1e3, 1e4, 1e5, 1e6].map(v => (
                <g key={v}>
                  <line x1={0} x2={460} y1={cy(v)} y2={cy(v)} stroke={SC.line} />
                  <text x={-10} y={cy(v) + 4} textAnchor="end" fontSize={12} fontWeight={800} fill={SC.muted}>{n(v)}</text>
                </g>
              ))}
              {[0.02, 0.05, 0.1, 0.15, 0.2].map(l => <text key={l} x={cx(l)} y={266} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>+{Math.round(l * 100)}%</text>)}
              <text x={230} y={290} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>Smallest lift worth finding</text>
              <polyline points={CURVE.filter(c => c.l <= 0.02 + 0.18 * p(t, 21.2, 22.6)).map(c => `${cx(c.l)},${cy(c.n)}`).join(' ')} fill="none" stroke={TOKRI} strokeWidth={4} strokeLinejoin="round" />
              {[{ l: 0.1, v: FEE.n, at: 22.8 }, { l: 0.05, v: HALF.n, at: 23.6 }].map(m => (
                <g key={m.l} opacity={p(t, m.at, m.at + 0.5)}>
                  <circle cx={cx(m.l)} cy={cy(m.v)} r={8} fill="#B54708" />
                  <text x={cx(m.l) + 14} y={cy(m.v) - 10} fontSize={14} fontWeight={900} fill={SC.text}>+{Math.round(m.l * 100)}%: {n(m.v)}</text>
                </g>
              ))}
            </g>
            <g opacity={p(t, 24.2, 24.8)} transform="translate(500 60)">
              <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>Half the lift,</text>
              <text x={0} y={26} fontSize={18} fontWeight={900} fill={SC.text}>about four times</text>
              <text x={0} y={52} fontSize={18} fontWeight={900} fill={SC.text}>the people.</text>
              <text x={0} y={90} fontSize={14} fontWeight={800} fill={SC.muted}>The sample grows with</text>
              <text x={0} y={110} fontSize={14} fontWeight={800} fill={SC.muted}>one over the lift squared.</text>
            </g>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g transform="translate(60 110)">
            <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>6,000 carts a day, split between A and B. {n(FEE.total)} needed.</text>
            {DAYS.map((d, i) => {
              const filled = clamp(FEE.days - i), k = p(t, 26.3 + i * 0.4, 26.7 + i * 0.4), extra = i >= Math.floor(FEE.days);
              return (
                <g key={d} transform={`translate(${i * 118} 30)`}>
                  <rect width={104} height={160} rx={14} fill={SC.surface} stroke={SC.line} />
                  <text x={52} y={30} textAnchor="middle" fontSize={16} fontWeight={900} fill={SC.text}>{d}</text>
                  <rect x={16} y={146 - 96 * filled * k} width={72} height={96 * filled * k} rx={8} fill={TOKRI} />
                  {extra && <rect x={16} y={50} width={72} height={96} rx={8} fill="none" stroke={TOKRI} strokeWidth={2} strokeDasharray="5 4" opacity={p(t, 29, 29.5)} />}
                </g>
              );
            })}
            <g opacity={p(t, 29, 29.6)} transform="translate(0 240)">
              <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>{n(FEE.total)} ÷ 6,000 = {FEE.days.toFixed(1)} days, so one full week.</text>
              <text x={0} y={30} fontSize={15} fontWeight={800} fill={SC.muted}>Sunday shoppers behave differently. Whole weeks count every day the same.</text>
            </g>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(110 100)">
            <g opacity={p(t, 31.2, 31.8)}>
              <rect width={420} height={290} rx={16} fill={SC.surface} stroke={SC.line} />
              <rect width={420} height={52} rx={16} fill={TOKRI} />
              <rect y={36} width={420} height={16} fill={TOKRI} />
              <text x={20} y={33} fontSize={16} fontWeight={900} fill="#FFFFFF">Test plan · fee on the cart</text>
              {[['Metric', 'Checkout conversion'], ['Baseline', '8%'], ['MDE', '+10% (8.8%)'], ['Sample', `${n(FEE.n)} a version`], ['Runs', 'Monday to Sunday, 1 week'], ['Looks before then', 'None']].map(([k, v], i) => (
                <g key={k} transform={`translate(20 ${86 + i * 34})`} opacity={p(t, 31.6 + i * 0.25, 32 + i * 0.25)}>
                  <text x={0} y={0} fontSize={14} fontWeight={800} fill={SC.muted}>{k}</text>
                  <text x={380} y={0} textAnchor="end" fontSize={14} fontWeight={900} fill={SC.text}>{v}</text>
                </g>
              ))}
            </g>
            <g opacity={p(t, 33.4, 34)} transform="translate(470 30)">
              <rect width={300} height={120} rx={16} fill={SC.surface} stroke={SC.line} />
              <text x={20} y={36} fontSize={15} fontWeight={900} fill={SC.text}>Green Pay button, +2%</text>
              <text x={20} y={66} fontSize={14} fontWeight={800} fill={SC.muted}>{n(GREEN.n)} a version</text>
              <text x={20} y={92} fontSize={14} fontWeight={800} fill={SC.muted}>{GREEN.weeks} weeks</text>
              <path d="M14 60 L286 60" stroke="#B42318" strokeWidth={3} opacity={p(t, 34.2, 34.6)} />
              <text x={20} y={150} fontSize={14} fontWeight={900} fill="#B42318" opacity={p(t, 34.2, 34.6)}>Off the list: too small to see.</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
