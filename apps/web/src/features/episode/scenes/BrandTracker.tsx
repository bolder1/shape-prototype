'use client';
// Scene for br.4-3: "Switch off" spikes installs and fades, so Ishita measures the brand instead: the monthly tracker
// against the held-out cities (`SUKOON_TRACKER`, `geoLift`), share of search against share of market
// (`SUKOON_READINGS`, `shareOfSearch`), cleaned of the word, the news spike and bought searches, and the long clock of
// brand against the short one of activation (`BRAND_SPLIT`). Pure function of t (0–36). Also exports `SOS_FILL` and
// `SOS_LABEL`, which `search-share` uses.
import { BRAND_SPLIT, SUKOON_READINGS, SUKOON_TRACKER, geoLift, shareOfSearch, type SosCall } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per reading; white text on each passes 4.5:1. */
export const SOS_FILL: Record<SosCall, string> = { gain: '#067647', hold: '#175CD3', lose: '#B42318', distorted: '#475467' };
export const SOS_LABEL: Record<SosCall, string> = { gain: 'Gaining', hold: 'Holding', lose: 'Losing', distorted: 'Distorted' };

/** Weekly installs, in thousands, from two weeks before the campaign to six weeks after it started. */
const INSTALLS = [10, 10, 17, 14, 12, 10, 10, 10, 10];
const NATIONAL = (['sukoonIndia', 'shaantIndia', 'dhyanaIndia', 'calmlyIndia'] as const).map(k => SUKOON_READINGS[k]);
const lifts = SUKOON_TRACKER.map(geoLift);

export function BrandTrackerScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Up, then down' : t < 11 ? 'Not those numbers' : t < 16 ? 'The tracker' : t < 21 ? 'Against the holdout' : t < 26 ? 'Share of search' : t < 31 ? 'Clean the count' : 'The long clock';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Sukoon’s “Switch off” campaign lifts weekly installs from 10,000 to 17,000 in its first week, and they are back to 10,000 by the fourth. The agency reports 1.2 crore impressions and ad recall up 40%, but impressions count what was bought and recall has no comparison group. Ishita’s monthly tracker asks 1,000 professionals whether they have heard of Sukoon, would consider it and prefer it. Against the cities where the campaign didn’t run, it lifted awareness by ${lifts[0]} points, consideration by ${lifts[1]} and preference by ${lifts[2]}. In October Sukoon had ${shareOfSearch(SUKOON_READINGS.sukoonIndia)}% of the category’s brand searches and ${SUKOON_READINGS.sukoonIndia.share}% of the market, a sign its share will grow, while Shaant, the leader, had ${shareOfSearch(SUKOON_READINGS.shaantIndia)}% of searches and ${SUKOON_READINGS.shaantIndia.share}% of the market. Counting every search for “sukoon” would give ${shareOfSearch(SUKOON_READINGS.sukoonRaw)}%, because it is an everyday word and a song, so she counts “sukoon app”, and sets aside a rival’s news spike and searches bought with cashback. Activation fades in weeks; brand builds over months, so about ${BRAND_SPLIT.brand * 100}% of the budget goes on building the brand.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (() => {
          const x = (i: number) => 60 + i * 66, y = (v: number) => 290 - (v / 20) * 200;
          const n = lerp(1, INSTALLS.length, p(t, 0.4, 4));
          const pts = INSTALLS.slice(0, Math.ceil(n)).map((v, i) => `${x(i)},${y(v)}`).join(' ');
          return (
            <g>
              <rect x={x(2) - 14} y={70} width={x(7) - x(2) + 28} height={224} fill={SC.brand} opacity={0.08} />
              <text x={x(4)} y={98} fontSize={21} fontWeight={800} fill={SC.muted}>Campaign: six weeks</text>
              <line x1={48} y1={290} x2={600} y2={290} stroke={SC.line} strokeWidth={2} />
              <polyline points={pts} fill="none" stroke={SC.text} strokeWidth={4} strokeLinejoin="round" />
              <text x={x(2)} y={y(17) - 14} fontSize={21} fontWeight={900} fill={SC.text} opacity={p(t, 1.6, 2.2)} textAnchor="middle">+70%</text>
              <text x={32} y={334} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 4, 4.6)}>Weekly installs. Kabir: “Did it fail?”</text>
            </g>
          );
        })()}

        {t >= 6 && t < 11 && (
          <g>
            {([['1.2 crore impressions', 'Counts what was bought'], ['“Ad recall up 40%”', 'Compared with nobody'], ['+70% installs in week 1', 'Activation, not brand']] as const).map(([claim, why], i) => {
              const strike = p(t, 7 + i * 1.1, 7.6 + i * 1.1);
              return (
                <g key={claim} opacity={p(t, 6.2 + i * 0.5, 6.7 + i * 0.5)}>
                  <rect x={32} y={70 + i * 88} width={576} height={74} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={52} y={102 + i * 88} fontSize={22} fontWeight={900} fill={SC.text}>{claim}</text>
                  <line x1={48} y1={95 + i * 88} x2={lerp(48, 330, strike)} y2={95 + i * 88} stroke={SC.error} strokeWidth={3} />
                  <text x={52} y={130 + i * 88} fontSize={21} fontWeight={700} fill={SC.error} opacity={strike}>{why}</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 11 && t < 21 && (() => {
          const hold = p(t, 16.2, 17.2);
          return (
            <g>
              <text x={32} y={84} fontSize={21} fontWeight={800} fill={SC.muted}>{t < 16 ? '1,000 professionals a month, Pune and Bengaluru' : 'Campaign cities against Hyderabad and Chennai'}</text>
              {SUKOON_TRACKER.map((m, i) => {
                const y0 = 100 + i * 72, k = p(t, 11.6 + i * 0.7, 12.8 + i * 0.7);
                const bx = (v: number) => (v / 50) * 330;
                const after = lerp(m.test[0], m.test[1], k);
                return (
                  <g key={m.measure} opacity={clamp(k * 3)}>
                    <text x={32} y={y0 + 20} fontSize={21} fontWeight={800} fill={SC.text}>{m.measure}</text>
                    <rect x={32} y={y0 + 30} width={bx(after)} height={18} rx={4} fill="#175CD3" />
                    <text x={40 + bx(after)} y={y0 + 46} fontSize={21} fontWeight={900} fill={SC.text}>{m.test[0]}→{Math.round(after)}%</text>
                    <g opacity={hold}>
                      <rect x={32} y={y0 + 52} width={bx(lerp(m.holdout[0], m.holdout[1], hold))} height={14} rx={4} fill={SC.muted} />
                      <text x={608} y={y0 + 46} fontSize={22} fontWeight={900} fill="#067647" textAnchor="end">+{lifts[i]} pts</text>
                    </g>
                  </g>
                );
              })}
              <text x={32} y={340} fontSize={21} fontWeight={800} fill={SC.text} opacity={hold}>Lift = change where it ran − change where it didn’t</text>
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (
          <g>
            <text x={32} y={84} fontSize={21} fontWeight={800} fill={SC.muted}>October, all India: search share vs market share</text>
            {NATIONAL.map((r, i) => {
              const k = p(t, 21.4 + i * 0.6, 22.4 + i * 0.6), sos = shareOfSearch(r), gap = sos - r.share;
              const y0 = 104 + i * 58;
              return (
                <g key={r.brand} opacity={clamp(k * 3)}>
                  <text x={32} y={y0 + 30} fontSize={21} fontWeight={800} fill={SC.text}>{r.brand}</text>
                  <rect x={140} y={y0 + 8} width={sos * 9 * k} height={18} rx={4} fill={gap >= 3 ? '#067647' : gap <= -3 ? '#B42318' : '#175CD3'} />
                  <rect x={140} y={y0 + 30} width={r.share * 9 * k} height={14} rx={4} fill="none" stroke={SC.text} strokeWidth={2} />
                  <text x={608} y={y0 + 30} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="end">{sos}% vs {r.share}%</text>
                </g>
              );
            })}
            <text x={32} y={340} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 24, 24.6)}>Searched more than its share: expect it to grow.</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {([['Every “sukoon”', `${shareOfSearch(SUKOON_READINGS.sukoonRaw)}%`, 'A word and a song'], ['“sukoon app”', `${shareOfSearch(SUKOON_READINGS.sukoonIndia)}%`, 'People looking for us'], ['Shaant’s leak month', 'Set aside', 'Reading news'], ['Calmly’s cashback', 'Set aside', 'Bought searches']] as const).map(([q, v, why], i) => (
              <g key={q} opacity={p(t, 26.2 + i * 0.9, 26.8 + i * 0.9)}>
                <rect x={32} y={64 + i * 68} width={576} height={58} rx={12} fill={SC.surface} stroke={i === 1 ? '#067647' : SC.line} strokeWidth={2} />
                <text x={52} y={100 + i * 68} fontSize={21} fontWeight={900} fill={SC.text}>{q}</text>
                <text x={300} y={100 + i * 68} fontSize={21} fontWeight={900} fill={i === 1 ? '#067647' : SC.muted}>{v}</text>
                <text x={590} y={100 + i * 68} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="end">{why}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 31 && (() => {
          const x = (m: number) => 60 + m * 45, y = (v: number) => 270 - v * 1.8;
          const k = p(t, 31.2, 33.6);
          const act = Array.from({ length: 13 }, (_, m) => [x(m), y(100 * Math.exp(-m * 1.1))] as const);
          const brand = Array.from({ length: 13 }, (_, m) => [x(m), y(70 * (1 - Math.exp(-m / 4)))] as const);
          const show = (pts: readonly (readonly [number, number])[]) => pts.slice(0, Math.max(2, Math.ceil(k * pts.length))).map(q => q.join(',')).join(' ');
          return (
            <g>
              <line x1={60} y1={270} x2={600} y2={270} stroke={SC.line} strokeWidth={2} />
              <polyline points={show(act)} fill="none" stroke="#B42318" strokeWidth={4} strokeLinejoin="round" />
              <polyline points={show(brand)} fill="none" stroke="#067647" strokeWidth={4} strokeLinejoin="round" />
              <text x={110} y={96} fontSize={21} fontWeight={900} fill="#B42318">Activation: weeks</text>
              <text x={600} y={124} fontSize={21} fontWeight={900} fill="#067647" textAnchor="end" opacity={k}>Brand: months</text>
              <text x={60} y={300} fontSize={21} fontWeight={800} fill={SC.muted}>Month 0</text>
              <text x={600} y={300} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">12</text>
              <text x={32} y={340} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 34, 34.6)}>About {BRAND_SPLIT.brand * 100}% building the brand, {BRAND_SPLIT.activation * 100}% selling now.</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
