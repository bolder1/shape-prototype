'use client';
// Scene for bz.4-1: the launch deck values the new checkout at the ₹900 ticket (“₹16 crore”) and the CFO stops
// reading. Aparna rebuilds it: what Raahi keeps (`RAAHI_CONTRIBUTION`), the A/B test in absolute points, the chain
// volume × change × value (`impactValue`), money out (self-serve cancellation), time that is only half money (the agent
// console) and the signals kept out of the total. Pure function of t (0–36). Also exports `BAND_FILL`, which
// `value-size` uses.
import { RAAHI_CONTRIBUTION, RAAHI_IMPACTS, RAAHI_TICKET, impactValue, inrScale, type ImpactBand } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per band; white text on each passes 4.5:1. */
export const BAND_FILL: Record<ImpactBand, string> = { small: '#175CD3', mid: '#6941C6', big: '#067647', unproven: '#475467' };

const checkout = RAAHI_IMPACTS.checkout, cancel = RAAHI_IMPACTS.cancel, console_ = RAAHI_IMPACTS.console;
const extra = Math.round(checkout.volume * checkout.change);
const wrong = inrScale(extra * RAAHI_TICKET), right = inrScale(impactValue(checkout));
const hours = Math.round(console_.volume * console_.change);
const fullTime = inrScale(hours * console_.unitValue), halfTime = inrScale(impactValue(console_));
const n = (v: number) => v.toLocaleString('en-IN');

export function ImpactChainScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The launch deck' : t < 11 ? 'What Raahi keeps' : t < 16 ? 'Against a control' : t < 21 ? 'The chain' : t < 26 ? 'Money out counts' : t < 31 ? 'Time is half-money' : 'The ledger';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Raahi’s launch deck says the new checkout is worth ${wrong}, ${n(extra)} extra bookings at the ${RAAHI_TICKET}-rupee ticket, and the CFO stops reading. Raahi keeps only ${RAAHI_CONTRIBUTION} rupees a booking: a 90-rupee commission less 30 rupees of payment fees and cashback. The A/B test moved conversion from 30% to 33%, three points rather than “10%”, and it ran outside the Diwali rush. 60 lakh seat selections × 3 points × ₹${RAAHI_CONTRIBUTION} is ${right} a year. Saving money counts too: self-serve cancellation cut calls from 8 to 2 per 100 bookings, worth ${inrScale(impactValue(cancel))}. The agent console frees ${n(hours)} hours, ${fullTime} of time, but only about half becomes fewer hires, so it counts as ${halfTime}. Ratings and survey scores are kept as signals, outside the rupee total.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <rect x={32} y={70} width={576} height={190} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={60} y={112} fontSize={21} fontWeight={800} fill={SC.muted}>New checkout · slide 4</text>
            <text x={60} y={170} fontSize={46} fontWeight={900} fill={SC.text} opacity={p(t, 0.5, 1.2)}>“Worth {wrong}”</text>
            <text x={60} y={220} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 1.6, 2.2)}>{n(extra)} bookings × ₹{RAAHI_TICKET} ticket</text>
            <line x1={56} y1={158} x2={lerp(56, 470, p(t, 3, 3.8))} y2={158} stroke={SC.error} strokeWidth={4} />
            <text x={32} y={310} fontSize={22} fontWeight={900} fill={SC.error} opacity={p(t, 3.8, 4.4)}>Sameer, the CFO, stops reading.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (() => {
          const k = p(t, 6.3, 7.6), x = (v: number) => 32 + (v / RAAHI_TICKET) * 576;
          return (
            <g>
              <text x={32} y={92} fontSize={21} fontWeight={800} fill={SC.muted}>One ₹{RAAHI_TICKET} ticket</text>
              <rect x={32} y={108} width={576 * k} height={56} rx={10} fill={SC.line} />
              <text x={52} y={144} fontSize={21} fontWeight={800} fill={SC.text} opacity={k}>Bus operator ₹810</text>
              <g opacity={p(t, 7.8, 8.4)}>
                <rect x={x(810)} y={108} width={x(900) - x(810)} height={56} rx={6} fill="#B54708" />
                <text x={608} y={196} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="end">Commission ₹90</text>
              </g>
              <g opacity={p(t, 8.8, 9.4)}>
                <rect x={x(810)} y={108} width={x(840) - x(810)} height={56} fill={SC.muted} />
                <text x={608} y={226} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">− fees and cashback ₹30</text>
                <text x={32} y={300} fontSize={30} fontWeight={900} fill="#067647">Raahi keeps ₹{RAAHI_CONTRIBUTION} a booking</text>
              </g>
            </g>
          );
        })()}

        {t >= 11 && t < 16 && (() => {
          const k = p(t, 11.3, 12.6);
          return (
            <g>
              {([['A · old checkout', 30, SC.muted], ['B · new checkout', 33, '#067647']] as const).map(([label, v, fill], i) => (
                <g key={label}>
                  <text x={32} y={98 + i * 70} fontSize={21} fontWeight={800} fill={SC.text}>{label}</text>
                  <rect x={32} y={108 + i * 70} width={(v / 40) * 460 * k} height={26} rx={6} fill={fill} />
                  <text x={44 + (v / 40) * 460 * k} y={129 + i * 70} fontSize={21} fontWeight={900} fill={SC.text}>{Math.round(v * k)}%</text>
                </g>
              ))}
              <text x={32} y={248} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 13, 13.6)}>+3 points, absolute. (“10%” is relative.)</text>
              <text x={32} y={296} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 14, 14.6)}>Same weeks, same riders: not the Diwali rush.</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (
          <g>
            {([['60 lakh', 'seat selections'], ['× 3 pts', 'against control'], [`× ₹${RAAHI_CONTRIBUTION}`, 'kept each']] as const).map(([v, sub], i) => (
              <g key={v} opacity={p(t, 16.3 + i * 0.8, 16.9 + i * 0.8)}>
                <rect x={32 + i * 196} y={78} width={180} height={104} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={122 + i * 196} y={128} fontSize={30} fontWeight={900} fill={SC.text} textAnchor="middle">{v}</text>
                <text x={122 + i * 196} y={160} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">{sub}</text>
              </g>
            ))}
            <g opacity={p(t, 18.8, 19.5)}>
              <rect x={32} y={206} width={576} height={84} rx={14} fill="#067647" />
              <text x={320} y={260} fontSize={34} fontWeight={900} fill="#fff" textAnchor="middle">= {right} a year</text>
            </g>
          </g>
        )}

        {t >= 21 && t < 26 && (() => {
          const k = p(t, 21.4, 23);
          return (
            <g>
              <text x={32} y={88} fontSize={21} fontWeight={800} fill={SC.muted}>Calls per 100 bookings, self-serve cancel</text>
              {Array.from({ length: 8 }, (_, i) => {
                const gone = i >= 2 && k > (i - 1) / 7;
                return <circle key={i} cx={60 + i * 62} cy={136} r={22} fill={gone ? 'none' : '#B42318'} stroke={gone ? SC.line : 'none'} strokeWidth={3} strokeDasharray={gone ? '5 5' : undefined} />;
              })}
              <text x={608} y={144} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="end">{Math.round(lerp(8, 2, k))}</text>
              <text x={32} y={222} fontSize={22} fontWeight={800} fill={SC.text} opacity={p(t, 23.2, 23.8)}>18 lakh bookings × 6 per 100 × ₹95 a call</text>
              <text x={32} y={280} fontSize={32} fontWeight={900} fill="#067647" opacity={p(t, 24, 24.6)}>= {inrScale(impactValue(cancel))} saved a year</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (() => {
          const k = p(t, 26.3, 27.6), half = p(t, 28, 29);
          return (
            <g>
              <text x={32} y={88} fontSize={21} fontWeight={800} fill={SC.muted}>{n(hours)} agent hours freed, at ₹{console_.unitValue}</text>
              <rect x={32} y={104} width={576 * k} height={58} rx={10} fill="#6941C6" opacity={lerp(1, 0.25, half)} />
              <rect x={32} y={104} width={288 * k} height={58} rx={10} fill="#6941C6" />
              <text x={52} y={142} fontSize={22} fontWeight={900} fill="#fff" opacity={k}>{half > 0.5 ? halfTime : fullTime}</text>
              <text x={608} y={196} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end" opacity={half}>The other half is capacity, not cash</text>
              <text x={32} y={270} fontSize={22} fontWeight={800} fill={SC.text} opacity={p(t, 29, 29.6)}>Time is money only when it changes hiring.</text>
            </g>
          );
        })()}

        {t >= 31 && (
          <g>
            <text x={32} y={84} fontSize={21} fontWeight={800} fill={SC.muted}>Counted, with a control</text>
            {([['Checkout', right], ['Self-serve cancel', inrScale(impactValue(cancel))], ['Agent console', halfTime]] as const).map(([label, v], i) => (
              <g key={label} opacity={p(t, 31.3 + i * 0.5, 31.8 + i * 0.5)}>
                <text x={32} y={118 + i * 34} fontSize={21} fontWeight={800} fill={SC.text}>{label}</text>
                <text x={608} y={118 + i * 34} fontSize={21} fontWeight={900} fill="#067647" textAnchor="end">{v}</text>
              </g>
            ))}
            <g opacity={p(t, 33.2, 33.8)}>
              <line x1={32} y1={232} x2={608} y2={232} stroke={SC.line} strokeWidth={2} />
              <text x={32} y={266} fontSize={21} fontWeight={800} fill={SC.muted}>Signals, not in the total</text>
              <text x={32} y={300} fontSize={21} fontWeight={800} fill={SC.text}>Rating 4.1 → 4.5</text>
              <text x={608} y={300} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="end">“73% say it’s easier”</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
