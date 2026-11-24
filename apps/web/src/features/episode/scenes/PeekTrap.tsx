'use client';
// Scene for gr.3-3: on day 4 the Hindi checkout is "up 17%, p = 0.03" and Farhan wants to ship. Kavya plays the A/A
// test from `TOKRI_AA` (the same cart twice): its daily p-value, from `aaPValues`, dips under 0.05 on day 4 and drifts
// back to 0.63. Bars from `peekingFalsePositive` show what each extra look costs. Then the lighter cart page's broken
// split (`srmP`), the fee test's twenty slices with one chance "winner" and its corrected threshold, and the fee test's
// real readout drawn as a confidence interval from `twoProp`. It ends on the two calls. Pure function of t (0–36).
import { TOKRI_PLANS, TOKRI_RESULTS, aaPValues, peekingFalsePositive, srmP, twoProp } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { INK } from './EaseCurves';
import { TOKRI } from './HypothesisShape';

const W = 960, H = 540;
const n = (x: number) => x.toLocaleString('en-IN');
const pts = (x: number) => `${x >= 0 ? '+' : '−'}${Math.abs(x * 100).toFixed(2)}`;
const AA = aaPValues();
const LOOKS = [1, 5, 21].map(l => ({ l, r: peekingFalsePositive(l) }));
const DAY4 = twoProp(TOKRI_RESULTS.hindiDay4.a, TOKRI_RESULTS.hindiDay4.b);
const LIGHT = TOKRI_RESULTS.lightCart, LIGHT_P = srmP(LIGHT.a.n, LIGHT.b.n);
const FEE = twoProp(TOKRI_RESULTS.feeEarly.a, TOKRI_RESULTS.feeEarly.b);
const HINDI = twoProp(TOKRI_RESULTS.hindiEnd.a, TOKRI_RESULTS.hindiEnd.b), HINDI_MDE = TOKRI_PLANS.hindi.base * TOKRI_PLANS.hindi.lift;
const SLICE = TOKRI_RESULTS.slice, SLICE_T = twoProp(SLICE.a, SLICE.b);
const RED = '#B42318', GREEN = '#067647';

/** p-value chart: day 1–14 across, p 0–1 up the side. */
const px = (d: number) => (d - 1) * 44;
const py = (v: number) => 240 - v * 240;

export function PeekTrapScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const shownDays = Math.floor(1 + 13 * p(t, 6.6, 10.4));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: on day 4 Tokri's Hindi checkout is up ${Math.round(DAY4.lift * 100)}% with p = ${DAY4.p.toFixed(2)}; an A/A test of the same cart twice, checked daily, dips under p = 0.05 on day 4 and ends at ${AA[13].toFixed(2)}; one look gives 5% false wins, five looks about ${Math.round(LOOKS[1].r * 100)}%, daily for three weeks about ${Math.round(LOOKS[2].r * 100)}%; a lighter cart page's 50/50 split came out ${n(LIGHT.a.n)} against ${n(LIGHT.b.n)}, a sample ratio mismatch; one of 20 slices of the fee test is up with p = 0.04, which is chance once corrected to 0.0025; the fee test's full readout is ${pts(FEE.diff)} points with a 95% range of ${pts(FEE.ci[0])} to ${pts(FEE.ci[1])}, so it ships, and the Hindi checkout at full length is flat`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'Day 4: a winner?' : t < 12 ? 'It was the same cart' : t < 17 ? 'Every look is another chance' : t < 22 ? 'Check the split first' : t < 27 ? 'Don’t go fishing' : t < 32 ? 'Read the range' : 'Ship, and say why'}
        </text>

        {t < 6 && (
          <g transform="translate(60 100)">
            <g opacity={p(t, 0.3, 0.9)}>
              <rect width={460} height={220} rx={16} fill={SC.surface} stroke={SC.line} />
              <text x={24} y={38} fontSize={15} fontWeight={900} fill={SC.text}>Hindi checkout · day 4 of 21</text>
              {[{ l: 'A, English', v: DAY4.pa }, { l: 'B, Hindi', v: DAY4.pb }].map((r, i) => (
                <g key={r.l} transform={`translate(24 ${66 + i * 46})`}>
                  <text x={0} y={20} fontSize={13} fontWeight={800} fill={SC.muted}>{r.l}</text>
                  <rect x={100} y={4} width={3400 * r.v * p(t, 0.8 + i * 0.3, 1.8 + i * 0.3)} height={24} rx={6} fill={i ? GREEN : SC.muted} />
                  <text x={110 + 3400 * r.v} y={22} fontSize={14} fontWeight={900} fill={SC.text}>{(r.v * 100).toFixed(1)}%</text>
                </g>
              ))}
              <text x={24} y={192} fontSize={22} fontWeight={900} fill={GREEN} opacity={p(t, 2, 2.4)}>+{Math.round(DAY4.lift * 100)}% · p = {DAY4.p.toFixed(2)}</text>
            </g>
            <g opacity={p(t, 2.8, 3.4)} transform="translate(500 10)">
              <rect width={320} height={64} rx={8} fill="#FEF0C7" transform="rotate(-1.5 160 32)" />
              <text x={20} y={30} fontSize={15} fontWeight={800} fill={INK}>Farhan: “Significant! Let’s ship</text>
              <text x={20} y={52} fontSize={15} fontWeight={800} fill={INK}>it today.”</text>
            </g>
            <g opacity={p(t, 4, 4.6)} transform="translate(520 110)">
              <rect width={320} height={64} rx={8} fill="#D1E9FF" transform="rotate(1.2 160 32)" />
              <text x={20} y={30} fontSize={15} fontWeight={800} fill={INK}>Kavya: “It was planned for 21</text>
              <text x={20} y={52} fontSize={15} fontWeight={800} fill={INK}>days. Let me show you something.”</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 12 && (
          <g transform="translate(110 110)">
            <text x={0} y={-6} fontSize={14} fontWeight={800} fill={SC.muted}>A/A test: both versions the same English cart. p-value at the end of each day.</text>
            <g transform="translate(0 20)">
              {[0, 0.25, 0.5, 0.75, 1].map(v => (
                <g key={v}>
                  <line x1={0} x2={580} y1={py(v)} y2={py(v)} stroke={SC.line} />
                  <text x={-10} y={py(v) + 4} textAnchor="end" fontSize={12} fontWeight={800} fill={SC.muted}>{v.toFixed(2)}</text>
                </g>
              ))}
              <rect x={0} y={py(0.05)} width={580} height={240 - py(0.05)} fill={RED} opacity={0.14} />
              <text x={584} y={py(0.05) + 4} fontSize={12} fontWeight={900} fill={RED}>p &lt; 0.05</text>
              {Array.from({ length: 14 }, (_, i) => <text key={i} x={px(i + 1)} y={262} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted}>{i + 1}</text>)}
              <text x={290} y={284} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>Day</text>
              <polyline points={AA.slice(0, shownDays).map((v, i) => `${px(i + 1)},${py(v)}`).join(' ')} fill="none" stroke={TOKRI} strokeWidth={3.5} strokeLinejoin="round" />
              {AA.slice(0, shownDays).map((v, i) => <circle key={i} cx={px(i + 1)} cy={py(v)} r={v < 0.05 ? 8 : 4.5} fill={v < 0.05 ? RED : TOKRI} />)}
              {shownDays >= 4 && <text x={px(4) + 14} y={py(AA[3]) - 4} fontSize={13} fontWeight={900} fill={RED}>Day 4: p = {AA[3].toFixed(3)}</text>}
            </g>
            <text x={0} y={340} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 10.4, 11)}>No real difference, and it still looked “significant” on day 4. It ends at p = {AA[13].toFixed(2)}.</text>
          </g>
        )}

        {t >= 12 && t < 17 && (
          <g transform="translate(110 110)">
            <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>Chance of a false win when nothing changed, stopping at the first p &lt; 0.05</text>
            {LOOKS.map((r, i) => (
              <g key={r.l} transform={`translate(0 ${40 + i * 80})`} opacity={p(t, 12.3 + i * 0.7, 12.8 + i * 0.7)}>
                <text x={0} y={30} fontSize={15} fontWeight={900} fill={SC.text}>{r.l === 1 ? 'Look once, at the end' : r.l === 21 ? 'Look every day for 3 weeks' : `Look ${r.l} times`}</text>
                <rect x={260} y={8} width={1600 * r.r * p(t, 12.5 + i * 0.7, 13.5 + i * 0.7)} height={32} rx={8} fill={i ? RED : GREEN} />
                <text x={272 + 1600 * r.r} y={32} fontSize={18} fontWeight={900} fill={SC.text}>{Math.round(r.r * 100)}%</text>
              </g>
            ))}
            <text x={0} y={300} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 15, 15.6)}>Each look is another chance to stop on noise. Decide the end before you start.</text>
          </g>
        )}

        {t >= 17 && t < 22 && (
          <g transform="translate(110 110)">
            <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>A lighter cart page, split 50/50. B looks 10% better. People in each version:</text>
            {[{ l: 'A', v: LIGHT.a.n }, { l: 'B', v: LIGHT.b.n }].map((r, i) => (
              <g key={r.l} transform={`translate(0 ${30 + i * 60})`} opacity={p(t, 17.2 + i * 0.3, 17.7 + i * 0.3)}>
                <text x={0} y={30} fontSize={18} fontWeight={900} fill={SC.text}>{r.l}</text>
                <rect x={40} y={8} width={0.03 * r.v * p(t, 17.4 + i * 0.3, 18.4 + i * 0.3)} height={34} rx={8} fill={i ? RED : SC.muted} />
                <text x={52 + 0.03 * r.v} y={32} fontSize={16} fontWeight={900} fill={SC.text}>{n(r.v)}</text>
              </g>
            ))}
            <line x1={40 + 0.03 * (LIGHT.a.n + LIGHT.b.n) / 2} x2={40 + 0.03 * (LIGHT.a.n + LIGHT.b.n) / 2} y1={30} y2={160} stroke={SC.text} strokeWidth={2} strokeDasharray="5 4" opacity={p(t, 18.6, 19)} />
            <text x={40 + 0.03 * (LIGHT.a.n + LIGHT.b.n) / 2} y={180} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted} opacity={p(t, 18.6, 19)}>Even split: {n((LIGHT.a.n + LIGHT.b.n) / 2)}</text>
            <g opacity={p(t, 19.4, 20)} transform="translate(0 220)">
              <text x={0} y={0} fontSize={18} fontWeight={900} fill={RED}>Split check: p = {LIGHT_P.toFixed(6)}, about 1 in {n(Math.round(1 / LIGHT_P / 10000) * 10000)} · broken</text>
              <text x={0} y={30} fontSize={15} fontWeight={800} fill={SC.muted}>The new page crashed on old phones before it counted anyone, so B lost the people</text>
              <text x={0} y={52} fontSize={15} fontWeight={800} fill={SC.muted}>least likely to buy. The result is void: fix the bug and rerun.</text>
            </g>
          </g>
        )}

        {t >= 22 && t < 27 && (
          <g transform="translate(110 104)">
            <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>The fee test, sliced 20 ways: phone, area, weekday or weekend…</text>
            {Array.from({ length: 20 }, (_, i) => {
              const hit = i === 13, k = p(t, 22.2 + i * 0.06, 22.5 + i * 0.06);
              return (
                <g key={i} transform={`translate(${(i % 5) * 116} ${24 + Math.floor(i / 5) * 54})`} opacity={k}>
                  <rect width={104} height={44} rx={10} fill={hit && t > 23.6 ? GREEN : SC.surface} stroke={SC.line} />
                  <text x={52} y={28} textAnchor="middle" fontSize={12} fontWeight={900} fill={hit && t > 23.6 ? '#FFFFFF' : SC.muted}>{hit ? `p = ${SLICE_T.p.toFixed(2)}` : 'flat'}</text>
                </g>
              );
            })}
            <g opacity={p(t, 23.8, 24.4)} transform="translate(600 120)">
              <text x={0} y={0} fontSize={14} fontWeight={900} fill={SC.text}>iPhone · Vijay Nagar</text>
              <text x={0} y={20} fontSize={14} fontWeight={900} fill={SC.text}>weekends: +{Math.round(SLICE_T.lift * 100)}%</text>
            </g>
            <g opacity={p(t, 24.8, 25.4)} transform="translate(0 270)">
              <text x={0} y={0} fontSize={18} fontWeight={900} fill={SC.text}>Look 20 times and one usually “wins” by chance.</text>
              <text x={0} y={30} fontSize={15} fontWeight={800} fill={SC.muted}>Corrected for 20 looks, the bar is 0.05 ÷ 20 = 0.0025. A slice is a new hypothesis, not a result.</text>
            </g>
          </g>
        )}

        {t >= 27 && t < 32 && (() => {
          const x = (v: number) => 300 + v * 22000, k = p(t, 27.8, 28.8);
          return (
            <g transform="translate(60 110)">
              <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>Fee on the cart, after its planned week: B − A in checkout conversion, points</text>
              <line x1={x(-0.01)} x2={x(0.02)} y1={90} y2={90} stroke={SC.line} strokeWidth={2} />
              {[-0.01, 0, 0.01, 0.02].map(v => <text key={v} x={x(v)} y={124} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>{v === 0 ? '0' : pts(v).replace('.00', '')}</text>)}
              <line x1={x(0)} x2={x(0)} y1={50} y2={110} stroke={SC.text} strokeWidth={2} />
              <rect x={x(FEE.diff) - (x(FEE.diff) - x(FEE.ci[0])) * k} y={78} width={(x(FEE.ci[1]) - x(FEE.ci[0])) * k} height={24} rx={12} fill={GREEN} opacity={0.35} />
              <circle cx={x(FEE.diff)} cy={90} r={10} fill={GREEN} />
              <text x={x(FEE.diff)} y={60} textAnchor="middle" fontSize={15} fontWeight={900} fill={SC.text}>{pts(FEE.diff)}</text>
              <text x={x(FEE.ci[0])} y={150} textAnchor="middle" fontSize={13} fontWeight={900} fill={GREEN} opacity={k}>{pts(FEE.ci[0])}</text>
              <text x={x(FEE.ci[1])} y={150} textAnchor="middle" fontSize={13} fontWeight={900} fill={GREEN} opacity={k}>{pts(FEE.ci[1])}</text>
              {['Split: 18,950 vs 18,910, fine', 'Ran its full planned week', `p = ${FEE.p.toFixed(3)}, and the whole range is above zero`, 'Cancellations: no change'].map((s, i) => (
                <g key={s} transform={`translate(0 ${196 + i * 36})`} opacity={p(t, 29 + i * 0.5, 29.5 + i * 0.5)}>
                  <circle cx={10} cy={-5} r={10} fill={GREEN} />
                  <path d="M5 -5 L9 -1 L15 -9" stroke="#FFFFFF" strokeWidth={2.5} fill="none" />
                  <text x={30} y={0} fontSize={15} fontWeight={800} fill={SC.text}>{s}</text>
                </g>
              ))}
            </g>
          );
        })()}

        {t >= 32 && (
          <g transform="translate(60 110)">
            {[{ head: 'Ship', title: 'Fee on the cart', lines: [`${pts(FEE.diff)} points, range ${pts(FEE.ci[0])} to ${pts(FEE.ci[1])}`, 'Even the low end is worth having.'], fill: GREEN },
              { head: 'No clear effect', title: 'Hindi checkout, 21 days', lines: [`Range ${pts(HINDI.ci[0])} to ${pts(HINDI.ci[1])} points`, `Below the ${(HINDI_MDE * 100).toFixed(2)} it was sized for.`, 'Not proof of zero. Not worth the bet.'], fill: '#475467' }].map((b, i) => (
              <g key={b.head} transform={`translate(${i * 420} 0)`} opacity={p(t, 32.2 + i * 0.8, 32.8 + i * 0.8)}>
                <rect width={400} height={220} rx={16} fill={SC.surface} stroke={SC.line} />
                <rect x={20} y={20} width={150} height={32} rx={16} fill={b.fill} />
                <text x={95} y={41} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF">{b.head}</text>
                <text x={20} y={90} fontSize={18} fontWeight={900} fill={SC.text}>{b.title}</text>
                {b.lines.map((l, k) => <text key={l} x={20} y={124 + k * 26} fontSize={15} fontWeight={800} fill={SC.muted}>{l}</text>)}
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
