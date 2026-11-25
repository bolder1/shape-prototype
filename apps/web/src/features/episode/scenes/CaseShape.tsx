'use client';
// Scene for bz.4-2: Aparna's eleven-page case meets the CFO's three questions, and she rebuilds it as a decision
// document: the ask, the options including doing nothing (`TRIP_OPTIONS`), benefits by driver with ranges
// (`TRIP_DRIVERS`, `driverValue`), every cost (`TRIP_COST`), returns in three cases (`caseReturns`) and a stage gate.
// Pure function of t (0–36). Also exports `FIX_FILL`, which `case-edit` uses.
import { SCENARIOS, TRIP_COST, TRIP_DRIVERS, TRIP_OPTIONS, caseReturns, driverValue, inrScale, scenarioBenefit, type CaseFix, type Scenario } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per fix; white text on each passes 4.5:1. */
export const FIX_FILL: Record<CaseFix, string> = { keep: '#067647', money: '#6941C6', range: '#B54708', cost: '#B42318' };
export const SCENARIO_LABEL: Record<Scenario, string> = { low: 'Low', base: 'Base', high: 'High' };

const returns = Object.fromEntries(SCENARIOS.map(s => [s, caseReturns(scenarioBenefit(TRIP_DRIVERS, s), TRIP_COST)])) as Record<Scenario, ReturnType<typeof caseReturns>>;
const benefit = Object.fromEntries(SCENARIOS.map(s => [s, scenarioBenefit(TRIP_DRIVERS, s)])) as Record<Scenario, number>;

export function CaseShapeScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Eleven pages' : t < 11 ? 'Three questions' : t < 16 ? 'The ask, and the options' : t < 21 ? 'Benefits by driver' : t < 26 ? 'Every cost' : t < 31 ? 'Three cases' : 'How we’ll know';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Aparna’s first business case runs to eleven pages of research and screens and ends with “NPS should rise by 10 points”. The CFO asks three questions: what do we get, what does it really cost, how sure are you. She rewrites it to open with the ask, ${inrScale(TRIP_COST.build)} for six people for six months, and compares doing nothing, a patch and a rebuild. Benefits come from three drivers, each with a range: fewer calls, fewer missed-bus refunds and more repeat trips, ${inrScale(benefit.low)} to ${inrScale(benefit.high)} a year. Costs are ${inrScale(TRIP_COST.build)} to build and ${inrScale(TRIP_COST.runYear)} a year to run, plus seat-map work that waits. In the base case year one returns ${returns.base.roi}% and pays back in ${returns.base.payback} months; the low case loses ${Math.abs(returns.low.roi)}% in year one and pays back in ${returns.low.payback} months; the high case returns ${returns.high.roi}%. She asks to fund two cities first and release the rest only if calls fall below 4 per 100 within eight weeks.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {Array.from({ length: 5 }, (_, i) => (
              <rect key={i} x={60 + i * 10} y={74 + i * 8} width={260} height={230} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={p(t, 0.2 + i * 0.25, 0.6 + i * 0.25)} />
            ))}
            {(['Research method', '28 new screens', '“Delightful”', 'NPS +10'] as const).map((w, i) => (
              <text key={w} x={124} y={150 + i * 38} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 1.4 + i * 0.5, 1.9 + i * 0.5)}>{w}</text>
            ))}
            <g opacity={p(t, 3.6, 4.2)}>
              <text x={608} y={150} fontSize={44} fontWeight={900} fill={SC.text} textAnchor="end">2 min</text>
              <text x={608} y={186} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">what the CFO read</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {(['What do we get, in rupees?', 'What does it really cost?', 'How sure are you?'] as const).map((q, i) => (
              <g key={q} opacity={p(t, 6.3 + i * 0.9, 6.9 + i * 0.9)}>
                <rect x={32} y={74 + i * 86} width={576} height={70} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={60} y={118 + i * 86} fontSize={24} fontWeight={900} fill={SC.text}>{i + 1}. {q}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <g opacity={p(t, 11.2, 11.8)}>
              <rect x={32} y={64} width={576} height={64} rx={14} fill="#067647" />
              <text x={52} y={104} fontSize={22} fontWeight={900} fill="#fff">Ask: {inrScale(TRIP_COST.build)}, 6 people, 6 months</text>
            </g>
            {TRIP_OPTIONS.map((o, i) => (
              <g key={o.id} opacity={p(t, 12.4 + i * 0.8, 13 + i * 0.8)}>
                <rect x={32} y={146 + i * 64} width={576} height={54} rx={12} fill={SC.surface} stroke={o.id === 'redesign' ? '#067647' : SC.line} strokeWidth={2} />
                <text x={52} y={180 + i * 64} fontSize={21} fontWeight={900} fill={SC.text}>{o.label}</text>
                <text x={590} y={180 + i * 64} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">{o.cost ? inrScale(o.cost) : '₹0, calls +20%/yr'}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 16 && t < 21 && (() => {
          const max = Math.max(...TRIP_DRIVERS.map(d => driverValue(d, 'high')));
          const x = (v: number) => 32 + (v / max) * 400;
          return (
            <g>
              {TRIP_DRIVERS.map((d, i) => {
                const k = p(t, 16.3 + i * 0.8, 17.2 + i * 0.8), y0 = 76 + i * 86;
                const lo = driverValue(d, 'low'), base = driverValue(d, 'base'), hi = driverValue(d, 'high');
                return (
                  <g key={d.label} opacity={clamp(k * 3)}>
                    <text x={32} y={y0 + 20} fontSize={21} fontWeight={800} fill={SC.text}>{d.label}</text>
                    <rect x={x(lo)} y={y0 + 32} width={(x(hi) - x(lo)) * k} height={20} rx={10} fill="#175CD3" opacity={0.35} />
                    <rect x={x(base) - 3} y={y0 + 26} width={6} height={32} rx={3} fill="#175CD3" opacity={k} />
                    <text x={608} y={y0 + 20} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="end">{inrScale(lo)}–{inrScale(hi).replace('₹', '')}</text>
                  </g>
                );
              })}
              <text x={32} y={340} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 19, 19.6)}>Tick: the base case. Each one rests on the Pune pilot.</text>
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (() => {
          const k = p(t, 21.3, 22.6), run = p(t, 22.8, 23.6), wait = p(t, 24, 24.6);
          const s = 380 / (TRIP_COST.build + TRIP_COST.runYear);
          return (
            <g>
              <rect x={32} y={90} width={TRIP_COST.build * s * k} height={64} rx={10} fill="#B42318" />
              <text x={52} y={130} fontSize={22} fontWeight={900} fill="#fff" opacity={k}>Build {inrScale(TRIP_COST.build)}</text>
              <rect x={32 + TRIP_COST.build * s + 4} y={90} width={TRIP_COST.runYear * s * run} height={64} rx={8} fill="#B54708" />
              <text x={608} y={188} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="end" opacity={run}>+ {inrScale(TRIP_COST.runYear)} a year to run</text>
              <g opacity={wait}>
                <rect x={32} y={206} width={300} height={56} rx={10} fill="none" stroke={SC.muted} strokeWidth={2} strokeDasharray="6 6" />
                <text x={52} y={242} fontSize={21} fontWeight={800} fill={SC.muted}>Seat-map refresh waits</text>
              </g>
              <text x={32} y={316} fontSize={24} fontWeight={900} fill={SC.text} opacity={p(t, 24.8, 25.4)}>Year one: {inrScale(returns.base.cost)}, not {inrScale(TRIP_COST.build)}</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (
          <g>
            {SCENARIOS.map((s, i) => {
              const r = returns[s], k = p(t, 26.3 + i * 0.7, 27.2 + i * 0.7), y0 = 72 + i * 86;
              const fill = r.roi < 0 ? '#B42318' : '#067647';
              const w = Math.abs(r.roi) * 2.4 * k;
              return (
                <g key={s} opacity={clamp(k * 3)}>
                  <text x={32} y={y0 + 22} fontSize={21} fontWeight={900} fill={SC.text}>{SCENARIO_LABEL[s]} · {inrScale(benefit[s])} a year</text>
                  <line x1={236} y1={y0 + 34} x2={236} y2={y0 + 66} stroke={SC.line} strokeWidth={2} />
                  <rect x={r.roi < 0 ? 236 - w : 236} y={y0 + 38} width={w} height={24} rx={6} fill={fill} />
                  <text x={r.roi < 0 ? 228 - w : 244 + w} y={y0 + 57} fontSize={21} fontWeight={900} fill={fill} textAnchor={r.roi < 0 ? 'end' : 'start'}>{r.roi}%</text>
                  <text x={608} y={y0 + 57} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">{r.payback} months</text>
                </g>
              );
            })}
            <text x={32} y={340} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 29, 29.6)}>Year-one ROI and payback. The low case stays in.</text>
          </g>
        )}

        {t >= 31 && (() => {
          const k = p(t, 31.2, 33);
          return (
            <g>
              <line x1={60} y1={170} x2={lerp(60, 580, k)} y2={170} stroke={SC.line} strokeWidth={4} />
              <g opacity={p(t, 31.2, 31.8)}>
                <circle cx={60} cy={170} r={14} fill="#067647" />
                <text x={60} y={128} fontSize={21} fontWeight={900} fill={SC.text}>Fund 2 cities, ₹30 lakh</text>
              </g>
              <g opacity={p(t, 32.4, 33)}>
                <rect x={300} y={152} width={36} height={36} rx={4} fill="#B54708" transform="rotate(45 318 170)" />
                <text x={318} y={226} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">Week 8: calls under 4 per 100?</text>
              </g>
              <g opacity={p(t, 33.6, 34.2)}>
                <text x={580} y={128} fontSize={21} fontWeight={900} fill="#067647" textAnchor="end">Yes: release the rest</text>
                <text x={580} y={286} fontSize={21} fontWeight={900} fill="#B42318" textAnchor="end">No: fix and re-read, or stop</text>
              </g>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
