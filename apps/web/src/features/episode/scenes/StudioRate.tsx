'use client';
// Scene for bz.4-3: Kolam is busy and broke, so Nikhil works out what a day must cost: billable days
// (`billableDays`), the floor (`floorRate`) and the target for a 20% margin (`targetRate`). Then scope creep pulls
// a fixed fee under the floor, the contract is matched to the risk, and some work is turned down on purpose
// (`KOLAM_ENQUIRIES`, `effectiveRate`). Pure function of t (0–36). Also exports `ENGAGE_FILL`, which `engage-sort` uses.
import { KOLAM, KOLAM_ENQUIRIES, billableDays, effectiveRate, floorRate, inr, inrScale, targetRate, type EngageCall } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per contract; white text on each passes 4.5:1. */
export const ENGAGE_FILL: Record<EngageCall, string> = { fixed: '#175CD3', retainer: '#067647', time: '#6941C6', decline: '#B42318' };

const costs = KOLAM.salaries + KOLAM.overheads;
const days = billableDays(KOLAM), all = KOLAM.people * KOLAM.workingDays;
const floor = floorRate(KOLAM), target = targetRate(KOLAM);
const seats = KOLAM_ENQUIRIES.seats, crept = { ...seats, days: seats.days + 10 };

export function StudioRateScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Busy and broke' : t < 11 ? 'Billable days' : t < 16 ? 'The floor' : t < 21 ? 'The target' : t < 26 ? 'Scope creep' : t < 31 ? 'Match the contract' : 'Say no on purpose';
  // Day-rate axis, ₹0–25,000, for the floor, target and creep segments.
  const rx = (v: number) => 32 + (v / 25_000) * 576;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Kolam, a four-person studio in Kochi, costs ${inrScale(costs)} a year and is always busy but short of money. Four people have ${all} working days, but sales, admin, learning and gaps take about 40%, so ${days} can be billed. ${inrScale(costs)} ÷ ${days} is a floor of ${inr(floor)} a day; for a 20% margin on fees the target is ${inr(target)}. A fixed-fee seat flow at ${inr(effectiveRate(seats))} a day falls to ${inr(effectiveRate(crept))} after ten unwritten days of changes, below the floor. Clear one-off work gets a fixed fee, unclear work is billed by the day, and a steady stream becomes a retainer. Unpaid pitches, equity instead of fees and prices below the floor are turned down; an NGO at ₹14,000 a day is taken on purpose.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <text x={32} y={88} fontSize={21} fontWeight={800} fill={SC.muted}>This quarter’s calendar</text>
            {Array.from({ length: 30 }, (_, i) => (
              <rect key={i} x={32 + (i % 10) * 30} y={104 + Math.floor(i / 10) * 30} width={24} height={24} rx={4} fill="#175CD3" opacity={p(t, 0.2 + i * 0.05, 0.4 + i * 0.05)} />
            ))}
            <g opacity={p(t, 2.4, 3)}>
              <text x={608} y={120} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">Costs a year</text>
              <text x={608} y={160} fontSize={34} fontWeight={900} fill={SC.text} textAnchor="end">{inrScale(costs)}</text>
            </g>
            <g opacity={p(t, 3.6, 4.2)}>
              <rect x={32} y={232} width={576} height={64} rx={14} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
              <text x={52} y={272} fontSize={22} fontWeight={900} fill={SC.error}>Prices copied from a Bengaluru studio</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (() => {
          const k = p(t, 6.3, 7.6), cut = p(t, 8, 9);
          const bill = 576 * (days / all);
          return (
            <g>
              <text x={32} y={92} fontSize={21} fontWeight={800} fill={SC.muted}>{KOLAM.people} people × {KOLAM.workingDays} days = {all} days</text>
              <rect x={32} y={108} width={576 * k} height={60} rx={10} fill="#175CD3" />
              <rect x={32 + bill} y={108} width={(576 - bill) * cut} height={60} fill={SC.line} />
              <text x={52} y={146} fontSize={22} fontWeight={900} fill="#fff" opacity={k}>{cut > 0.5 ? `${days} billable` : `${all} days`}</text>
              <g opacity={cut}>
                {(['Sales and proposals', 'Admin', 'Learning', 'Gaps between projects'] as const).map((w, i) => (
                  <text key={w} x={608} y={202 + i * 30} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="end">{w}</text>
                ))}
              </g>
              <text x={32} y={330} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 9.4, 10)}>Price on the days you can bill.</text>
            </g>
          );
        })()}

        {t >= 11 && t < 21 && (() => {
          const showTarget = t >= 16;
          const kf = p(t, 11.3, 12.6), kt = p(t, 16.3, 17.6);
          return (
            <g>
              <text x={32} y={96} fontSize={24} fontWeight={900} fill={SC.text}>{showTarget ? `${inrScale(costs)} ÷ 0.8 ÷ ${days}` : `${inrScale(costs)} ÷ ${days} days`}</text>
              <line x1={32} y1={200} x2={608} y2={200} stroke={SC.line} strokeWidth={4} />
              <rect x={32} y={186} width={(rx(floor) - 32) * kf} height={28} rx={6} fill="#B42318" opacity={0.22} />
              <line x1={rx(floor)} y1={150} x2={rx(floor)} y2={244} stroke="#B42318" strokeWidth={4} opacity={kf} />
              <text x={rx(floor) - 8} y={142} fontSize={22} fontWeight={900} fill="#B42318" textAnchor="end" opacity={kf}>Floor {inr(floor)}</text>
              <text x={40} y={278} fontSize={21} fontWeight={800} fill={SC.muted} opacity={kf}>Below it, every day loses money</text>
              {showTarget && (
                <g opacity={kt}>
                  <line x1={rx(target)} y1={150} x2={rx(target)} y2={244} stroke="#067647" strokeWidth={4} />
                  <text x={rx(target) + 8} y={270} fontSize={22} fontWeight={900} fill="#067647">Target {inr(target)}</text>
                  <text x={608} y={318} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">Leaves 20% of fees as margin</text>
                </g>
              )}
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (() => {
          const k = p(t, 21.6, 23.4);
          const rate = lerp(effectiveRate(seats), effectiveRate(crept), k);
          return (
            <g>
              <text x={32} y={88} fontSize={21} fontWeight={800} fill={SC.muted}>Raahi seat flow, fixed {inrScale(seats.fee)}</text>
              {Array.from({ length: crept.days }, (_, i) => (
                <rect key={i} x={32 + i * 17} y={104} width={13} height={36} rx={3} fill={i < seats.days ? '#175CD3' : '#B42318'} opacity={i < seats.days ? 1 : clamp((k * 10) - (i - seats.days))} />
              ))}
              <text x={32} y={170} fontSize={21} fontWeight={800} fill={SC.text}>{Math.round(lerp(seats.days, crept.days, k))} days</text>
              <line x1={32} y1={250} x2={608} y2={250} stroke={SC.line} strokeWidth={4} />
              <line x1={rx(floor)} y1={222} x2={rx(floor)} y2={278} stroke="#B42318" strokeWidth={3} />
              <circle cx={rx(rate)} cy={250} r={14} fill={rate < floor ? '#B42318' : '#175CD3'} />
              <text x={rx(rate)} y={214} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle">{inr(rate)}</text>
              <text x={32} y={326} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 23.6, 24.2)}>Ten unwritten days of “small changes”.</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (
          <g>
            {([['fixed', 'Fixed fee', 'Clear scope, one-off'], ['time', 'Time & materials', 'Scope unknown'], ['retainer', 'Retainer', 'A steady stream'], ['decline', 'Decline', 'Unpaid, or under the floor']] as const).map(([id, label, sub], i) => (
              <g key={id} opacity={p(t, 26.3 + i * 0.6, 26.9 + i * 0.6)}>
                <rect x={32 + (i % 2) * 292} y={70 + Math.floor(i / 2) * 124} width={284} height={110} rx={14} fill={ENGAGE_FILL[id]} />
                <text x={52 + (i % 2) * 292} y={118 + Math.floor(i / 2) * 124} fontSize={24} fontWeight={900} fill="#fff">{label}</text>
                <text x={52 + (i % 2) * 292} y={152 + Math.floor(i / 2) * 124} fontSize={21} fontWeight={700} fill="#fff">{sub}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 31 && (
          <g>
            {([['Unpaid bank pitch', `${inrScale(5 * target)} of time`], ['Equity, no fee', 'Doesn’t pay salaries'], ['Café chain', `${inr(effectiveRate(KOLAM_ENQUIRIES.cafe))} a day`]] as const).map(([label, why], i) => {
              const k = p(t, 31.3 + i * 0.7, 31.9 + i * 0.7);
              return (
                <g key={label} opacity={clamp(k * 2)}>
                  <rect x={32} y={64 + i * 64} width={576} height={54} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={52} y={98 + i * 64} fontSize={21} fontWeight={900} fill={SC.text}>{label}</text>
                  <text x={590} y={98 + i * 64} fontSize={21} fontWeight={800} fill="#B42318" textAnchor="end">{why}</text>
                  <line x1={48} y1={91 + i * 64} x2={lerp(48, 260, k)} y2={91 + i * 64} stroke="#B42318" strokeWidth={3} />
                </g>
              );
            })}
            <g opacity={p(t, 33.6, 34.2)}>
              <rect x={32} y={262} width={576} height={58} rx={12} fill="#067647" />
              <text x={52} y={298} fontSize={21} fontWeight={900} fill="#fff">Education NGO at ₹14,000 a day: taken on purpose</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
