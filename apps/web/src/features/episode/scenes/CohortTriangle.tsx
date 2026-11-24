'use client';
// Scene for st.3-3: Kunal's line says week-1 retention fell from 41% in October to 35% in November, the month Kahaani
// changed its first night, and he wants it rolled back. Tara follows the same families through `KAHAANI_FUNNEL` (the
// biggest drop is finishing the first story), then lays them out by join week as a cohort triangle from
// `KAHAANI_COHORTS`: the Diwali-ads row is three times bigger and keeps 22%, the rows after the change keep 52–54%,
// and `cohortShare` shows how blending November hid both. Last, `KAHAANI_SEGMENTS` splits finishing by language.
// `cohortTint` is shared with the Read the data game. Pure function of t (0–38).
import { KAHAANI_COHORTS, KAHAANI_FUNNEL, KAHAANI_SEGMENTS, cohortShare } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK } from './EaseCurves';
import { KAHAANI } from './MetricTree';

const W = 960, H = 540;
const pct = (x: number) => `${Math.round(x * 100)}%`;
/** A cell's fill by the share kept, in steps from pale lilac to Kahaani indigo; every step's text passes 4.5:1. */
export const cohortTint = (share: number) =>
  share < 0.2 ? { fill: '#F4EBFF', text: INK } : share < 0.3 ? { fill: '#E9D7FE', text: INK } : share < 0.45 ? { fill: '#D6BBFB', text: INK }
    : share < 0.6 ? { fill: '#6941C6', text: '#FFFFFF' } : { fill: KAHAANI, text: '#FFFFFF' };

const OCT = ['12oct', '19oct', '26oct'] as const, NOV = ['2nov', '9nov', '16nov'] as const;

export function CohortTriangleScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const line = t < 6.6 ? 1 - p(t, 6, 6.6) : 0;
  const funnel = t >= 6 && t < 12.6 ? p(t, 6.2, 6.8) * (1 - p(t, 12, 12.6)) : 0;
  const table = t >= 12 && t < 32.6 ? p(t, 12.2, 12.8) * (1 - p(t, 32, 32.6)) : 0;
  const langs = t >= 32 ? p(t, 32.3, 33) : 0;
  const octBlend = cohortShare(OCT, 1)!, novBlend = cohortShare(NOV, 1)!;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a dashboard line shows week-1 retention falling from 41% to 35%; a funnel shows the biggest drop is finishing the first story; a cohort table by join week shows the large Diwali-ads cohort keeping 22% while the cohorts after the change keep 52 to 54%, so the blended November number hid the improvement; finally, finishing is split by language, with Telugu families finishing 40% against 60% for Hindi">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        {line > 0 && (
          <g opacity={line}>
            <text x={40} y={56} fontSize={24} fontWeight={900} fill={SC.text}>New families back in week 1</text>
            <text x={40} y={82} fontSize={14} fontWeight={800} fill={SC.muted}>Kunal’s dashboard · all new families, by month</text>
            <rect x={60} y={110} width={840} height={360} rx={16} fill={SC.surface} stroke={SC.line} />
            {(() => {
              const k = p(t, 0.6, 2.4), y = (v: number) => 440 - v * 600;
              return (
                <g>
                  <path d={`M180 ${y(octBlend)} L${lerp(180, 760, k)} ${lerp(y(octBlend), y(novBlend), k)}`} stroke={KAHAANI} strokeWidth={5} fill="none" strokeLinecap="round" />
                  <circle cx={180} cy={y(octBlend)} r={8} fill={KAHAANI} />
                  <text x={180} y={y(octBlend) - 18} textAnchor="middle" fontSize={20} fontWeight={900} fill={SC.text}>October {pct(octBlend)}</text>
                  <g opacity={p(t, 2.2, 2.8)}>
                    <circle cx={760} cy={y(novBlend)} r={8} fill="#B42318" />
                    <text x={760} y={y(novBlend) + 36} textAnchor="middle" fontSize={20} fontWeight={900} fill="#B42318">November {pct(novBlend)}</text>
                  </g>
                  <g opacity={p(t, 3, 3.6)}>
                    <line x1={470} x2={470} y1={130} y2={450} stroke={SC.muted} strokeDasharray="5 5" />
                    <text x={480} y={150} fontSize={13} fontWeight={800} fill={SC.muted}>9 Nov: new first night</text>
                  </g>
                  <g transform="translate(640 130)" opacity={p(t, 4, 4.6)}>
                    <rect width={220} height={52} rx={6} fill="#FDE272" transform="rotate(-3)" />
                    <text x={14} y={32} fontSize={15} fontWeight={900} fill={INK} transform="rotate(-3)">“Roll it back by Friday.”</text>
                  </g>
                </g>
              );
            })()}
          </g>
        )}

        {funnel > 0 && (
          <g opacity={funnel}>
            <text x={40} y={56} fontSize={22} fontWeight={900} fill={SC.text}>The funnel: the same families, step by step</text>
            {KAHAANI_FUNNEL.map((s, i) => {
              const w = 620 * s.n / KAHAANI_FUNNEL[0].n * p(t, 6.6 + i * 0.5, 7.2 + i * 0.5);
              const rate = i ? s.n / KAHAANI_FUNNEL[i - 1].n : 1, worst = s.id === 'finished';
              return (
                <g key={s.id} transform={`translate(40 ${96 + i * 82})`}>
                  <text x={0} y={-8} fontSize={13} fontWeight={800} fill={SC.muted}>{s.label}</text>
                  <rect width={w} height={44} rx={10} fill={worst && t > 9.6 ? '#B42318' : KAHAANI} />
                  <text x={14} y={28} fontSize={15} fontWeight={900} fill="#FFFFFF" opacity={w > 80 ? 1 : 0}>{s.n.toLocaleString('en-IN')}</text>
                  {i > 0 && <text x={680} y={28} fontSize={18} fontWeight={900} fill={worst && t > 9.6 ? '#B42318' : SC.text} opacity={p(t, 8.6 + i * 0.3, 9 + i * 0.3)}>{pct(rate)} of the step before</text>}
                </g>
              );
            })}
          </g>
        )}

        {table > 0 && (
          <g opacity={table}>
            <text x={40} y={50} fontSize={22} fontWeight={900} fill={SC.text}>
              {t < 18 ? 'Cohorts: grouped by the week they joined' : t < 23 ? 'The Diwali-ads week' : t < 28 ? 'After the change' : 'Why the average fell'}
            </text>
            <text x={40} y={92} fontSize={12} fontWeight={900} fill={SC.muted}>Joined</text>
            <text x={130} y={92} fontSize={12} fontWeight={900} fill={SC.muted}>Families</text>
            {[0, 1, 2, 3, 4].map(w => <text key={w} x={262 + w * 104} y={92} textAnchor="middle" fontSize={12} fontWeight={900} fill={SC.muted}>Week {w}</text>)}
            {KAHAANI_COHORTS.map((c, r) => {
              const y = 104 + r * 50;
              const ring = (t >= 18 && t < 23 && c.id === '2nov') || (t >= 23 && t < 28 && (c.id === '9nov' || c.id === '16nov'));
              const dim = t >= 18 && t < 28 && !ring && !(t >= 23 && OCT.includes(c.id as (typeof OCT)[number]));
              return (
                <g key={c.id} opacity={p(t, 12.6 + r * 0.6, 13.2 + r * 0.6) * (dim ? 0.35 : 1)}>
                  <text x={40} y={y + 28} fontSize={14} fontWeight={900} fill={SC.text}>{c.label}</text>
                  <text x={130} y={y + 28} fontSize={14} fontWeight={800} fill={SC.text}>{c.kept[0].toLocaleString('en-IN')}</text>
                  {'note' in c && <text x={130} y={y + 44} fontSize={10.5} fontWeight={800} fill={SC.muted}>{c.note}</text>}
                  {c.kept.map((n, w) => {
                    const share = n / c.kept[0], tint = cohortTint(share);
                    return (
                      <g key={w} opacity={p(t, 13 + r * 0.6 + w * 0.15, 13.4 + r * 0.6 + w * 0.15)}>
                        <rect x={212 + w * 104} y={y + 4} width={98} height={40} rx={8} fill={tint.fill} stroke={ring && w === 1 ? '#B54708' : 'none'} strokeWidth={3} />
                        <text x={261 + w * 104} y={y + 30} textAnchor="middle" fontSize={15} fontWeight={900} fill={tint.text}>{pct(share)}</text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
            {t >= 28 && (
              <g transform="translate(40 418)" opacity={p(t, 28.2, 28.8)}>
                {[{ label: 'October blended', v: octBlend }, { label: 'November blended', v: novBlend }].map((b, i) => (
                  <g key={b.label} transform={`translate(${i * 440} 0)`}>
                    <text x={0} y={16} fontSize={13} fontWeight={900} fill={SC.text}>{b.label}, week 1: {pct(b.v)}</text>
                    <rect y={28} width={400} height={16} rx={8} fill={SC.surface} stroke={SC.line} />
                    <rect y={28} width={400 * b.v} height={16} rx={8} fill={i ? '#B42318' : KAHAANI} />
                    <text x={0} y={70} fontSize={11.5} fontWeight={800} fill={SC.muted}>{i ? '6,000 Diwali-ads families outweigh 4,500 better ones' : 'Three similar weeks of about 2,000'}</text>
                  </g>
                ))}
              </g>
            )}
          </g>
        )}

        {langs > 0 && (
          <g opacity={langs}>
            <text x={40} y={56} fontSize={22} fontWeight={900} fill={SC.text}>Split by language: first stories finished</text>
            {Object.entries(KAHAANI_SEGMENTS).map(([id, s], i) => {
              const share = s.finished / s.started, k = p(t, 33 + i * 0.5, 34 + i * 0.5), low = id === 'telugu';
              return (
                <g key={id} transform={`translate(60 ${120 + i * 110})`}>
                  <text x={0} y={-10} fontSize={15} fontWeight={900} fill={SC.text}>{s.label} · {s.started.toLocaleString('en-IN')} started</text>
                  <rect width={640} height={48} rx={12} fill={SC.surface} stroke={SC.line} />
                  <rect width={640 * share * k} height={48} rx={12} fill={low ? '#B42318' : KAHAANI} />
                  <text x={660} y={32} fontSize={22} fontWeight={900} fill={low ? '#B42318' : SC.text}>{pct(share)}</text>
                </g>
              );
            })}
            <text x={60} y={470} fontSize={15} fontWeight={900} fill={SC.text} opacity={p(t, 35.6, 36.2)}>Only a handful of short Telugu stories. The fix is on the shelf, not in the player.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
