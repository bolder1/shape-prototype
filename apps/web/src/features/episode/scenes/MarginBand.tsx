'use client';
// Scene for rs.5-2: does Bolo's 8-point lead mean anything? The first survey's shares (`BOLO_GAPS.headline`) each get
// their ±4.4 band (`moe`), then the lead gets its own, roughly twice as wide (`gapInterval`), and it reaches zero.
// Against the 5-point line the team set beforehand, the call is unclear (`gapCall`). The bigger follow-up sample is
// clear of both; the new lesson screen is significant but too small. The four readings close it. Pure function of
// t (0–36).
import { BOLO_GAPS, gapCall, gapInterval, moe, type BoloGap, type GapCall } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
/** Label fills; white text on each passes 4.5:1. */
const TONE: Record<GapCall, string> = { real: '#067647', small: 'var(--color-family-design-solid)', none: 'var(--color-family-discover-solid)', unclear: '#B42318' };
const LABEL: Record<GapCall, string> = { real: 'Real, and it matters', small: 'Real, too small', none: 'No gap worth having', unclear: 'Unclear: ask more' };
const EXAMPLE: Record<GapCall, BoloGap> = { real: 'followup', small: 'lessonScreen', none: 'voice', unclear: 'headline' };

/** A number line in points, from −R to R, `w` wide. */
const scale = (R: number, w: number) => (v: number) => ((v + R) / (2 * R)) * w;

function Lead({ k, y, w = 840, R = 25, k1, label }: { k: BoloGap; y: number; w?: number; R?: number; k1: number; label?: string }) {
  const g = BOLO_GAPS[k], iv = gapInterval(g), x = scale(R, w), m = g.matters * 100;
  return (
    <g transform={`translate(60 ${y})`}>
      <rect x={x(-m)} y={-30} width={x(m) - x(-m)} height={60} rx={8} fill={SC.surface} opacity={0.9} />
      <line x1={0} x2={w} y1={30} y2={30} stroke={SC.line} strokeWidth={2} />
      {[-20, -10, 0, 10, 20].filter(v => Math.abs(v) <= R).map(v => <text key={v} x={x(v)} y={50} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.muted}>{v > 0 ? `+${v}` : v}</text>)}
      <line x1={x(0)} x2={x(0)} y1={-34} y2={30} stroke={SC.text} strokeWidth={2} strokeDasharray="5 4" />
      <line x1={x(iv.diff * 100)} x2={lerp(x(iv.diff * 100), x(iv.lo * 100), k1)} y1={0} y2={0} stroke={SC.brand} strokeWidth={9} strokeLinecap="round" />
      <line x1={x(iv.diff * 100)} x2={lerp(x(iv.diff * 100), x(iv.hi * 100), k1)} y1={0} y2={0} stroke={SC.brand} strokeWidth={9} strokeLinecap="round" />
      <circle cx={x(iv.diff * 100)} cy={0} r={10} fill={SC.surface} stroke={SC.brand} strokeWidth={4} />
      {label && <text x={0} y={-40} fontSize={14} fontWeight={900} fill={SC.muted}>{label}</text>}
    </g>
  );
}

export function MarginBandScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A win?' : t < 11 ? 'Every share wobbles' : t < 16 ? 'The lead wobbles more' : t < 21 ? 'The line that matters' : t < 26 ? 'More people' : t < 31 ? 'Significant isn’t big' : 'Four readings';
  const h = BOLO_GAPS.headline, hi = gapInterval(h), m1 = moe(h.a.n) * 100;
  const shares = [{ label: h.b.label, v: h.b.x / h.b.n }, { label: h.a.label, v: h.a.x / h.a.n }];
  const fu = gapInterval(BOLO_GAPS.followup), ls = gapInterval(BOLO_GAPS.lessonScreen);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: from ${h.a.n} people, ${Math.round(shares[0].v * 100)}% would use daily drills more and ${Math.round(shares[1].v * 100)}% live rooms. Each share is give or take ${m1.toFixed(1)} points, and the lead of ${Math.round(hi.diff * 100)} points is give or take ${(hi.half * 100).toFixed(1)}, so zero is inside its interval. A bigger sample of ${BOLO_GAPS.followup.a.n} gives a lead of ${Math.round(fu.diff * 100)} plus or minus ${(fu.half * 100).toFixed(1)}, clear of zero and of the 5-point line. The new lesson screen's lift of ${(ls.diff * 100).toFixed(1)} points is significant but smaller than the 5 points it needed.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 11 && (
          <g transform="translate(60 120)">
            {shares.map((s, i) => {
              const w = 760, x = (v: number) => v * w;
              return (
                <g key={s.label} transform={`translate(0 ${i * 120})`} opacity={p(t, 0.3 + i * 0.6, 0.8 + i * 0.6)}>
                  <text fontSize={16} fontWeight={900} fill={SC.text}>{s.label}</text>
                  <rect y={14} width={w} height={44} rx={10} fill={SC.surface} stroke={SC.line} />
                  <rect y={14} width={lerp(0, x(s.v), p(t, 0.6 + i * 0.6, 2 + i * 0.6))} height={44} rx={10} fill={i ? SC.design : SC.discover} />
                  <text x={x(s.v) + 12} y={44} fontSize={20} fontWeight={900} fill={SC.text} opacity={p(t, 2, 2.4)}>{Math.round(s.v * 100)}%</text>
                  {t >= 6 && <rect x={x(s.v - m1 / 100)} y={6} width={x((2 * m1) / 100)} height={60} rx={8} fill={SC.text} opacity={0.12 * p(t, 6.3 + i * 0.5, 7 + i * 0.5)} />}
                  {t >= 6 && <text x={x(s.v + m1 / 100) + 70} y={44} fontSize={14} fontWeight={900} fill={SC.muted} opacity={p(t, 7, 7.5)}>±{m1.toFixed(1)}</text>}
                </g>
              );
            })}
            <text y={270} fontSize={16} fontWeight={800} fill={SC.muted} opacity={t < 6 ? p(t, 3.2, 3.8) : p(t, 8.6, 9.2)}>{t < 6 ? `${h.a.n} random answers. Kunal: “Drills by 8 points. Done.”` : 'From 492 people, each share could easily be 4.4 points either way.'}</text>
          </g>
        )}

        {t >= 11 && t < 21 && (
          <g>
            <Lead k="headline" y={240} k1={p(t, 11.6, 13)} label={`THE LEAD: ${Math.round(hi.diff * 100)} ± ${(hi.half * 100).toFixed(1)} POINTS`} />
            <text x={60} y={350} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 13.2, 13.8)}>A vote for drills is a vote against live rooms, so the lead wobbles about twice as much.</text>
            {t >= 16 && (
              <g opacity={p(t, 16.2, 16.8)}>
                <text x={60} y={400} fontSize={16} fontWeight={800} fill={SC.text}>The shaded band: leads under 5 points wouldn’t change the decision.</text>
                <g transform="translate(60 430)" opacity={p(t, 17.6, 18.1)}>
                  <rect width={210} height={40} rx={12} fill={TONE.unclear} />
                  <text x={105} y={26} textAnchor="middle" fontSize={16} fontWeight={900} fill="#fff">{LABEL[gapCall(h)]}</text>
                </g>
              </g>
            )}
          </g>
        )}

        {t >= 21 && t < 31 && (
          <g>
            <Lead k={t < 26 ? 'followup' : 'lessonScreen'} y={240} R={t < 26 ? 25 : 10} k1={t < 26 ? p(t, 21.6, 23) : p(t, 26.6, 28)}
              label={t < 26 ? `${BOLO_GAPS.followup.a.n.toLocaleString('en-IN')} PEOPLE: ${Math.round(fu.diff * 100)} ± ${(fu.half * 100).toFixed(1)}` : `NEW LESSON SCREEN, 8,000 A VERSION: +${(ls.diff * 100).toFixed(1)} ± ${(ls.half * 100).toFixed(1)}`} />
            <text x={60} y={350} fontSize={16} fontWeight={800} fill={SC.muted} opacity={t < 26 ? p(t, 23.2, 23.8) : p(t, 28.2, 28.8)}>
              {t < 26 ? 'Even the bottom of the interval is past the 5-point line. Drills it is.' : 'p < 0.001, and the whole interval sits under the 5 points the rebuild needed.'}
            </text>
            {(() => { const c: GapCall = t < 26 ? 'real' : 'small'; return (
              <g transform="translate(60 390)" opacity={t < 26 ? p(t, 24, 24.5) : p(t, 29, 29.5)}>
                <rect width={230} height={40} rx={12} fill={TONE[c]} />
                <text x={115} y={26} textAnchor="middle" fontSize={16} fontWeight={900} fill="#fff">{LABEL[c]}</text>
              </g>
            ); })()}
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(60 100)">
            {(Object.keys(EXAMPLE) as GapCall[]).map((c, i) => {
              const g = BOLO_GAPS[EXAMPLE[c]], iv = gapInterval(g), R = 25, x = scale(R, 520), m = g.matters * 100;
              return (
                <g key={c} transform={`translate(0 ${i * 95})`} opacity={p(t, 31.2 + i * 0.5, 31.7 + i * 0.5)}>
                  <rect width={230} height={40} y={8} rx={12} fill={TONE[c]} />
                  <text x={115} y={34} textAnchor="middle" fontSize={15} fontWeight={900} fill="#fff">{LABEL[c]}</text>
                  <g transform="translate(280 28)">
                    <rect x={x(-m)} y={-18} width={x(m) - x(-m)} height={36} rx={6} fill={SC.surface} />
                    <line x1={x(0)} x2={x(0)} y1={-20} y2={20} stroke={SC.text} strokeWidth={2} strokeDasharray="4 3" />
                    <line x1={x(iv.lo * 100)} x2={x(iv.hi * 100)} y1={0} y2={0} stroke={SC.brand} strokeWidth={7} strokeLinecap="round" />
                    <circle cx={x(iv.diff * 100)} cy={0} r={7} fill={SC.surface} stroke={SC.brand} strokeWidth={3} />
                  </g>
                </g>
              );
            })}
          </g>
        )}
      </g>
    </svg>
  );
}
