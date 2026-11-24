'use client';
// Scene for st.2-3: Rohan's competitive analysis is a tick table of Galla against two ledger apps, and Galla wins on
// ticks. Then Ishita's visits to 30 shops in Aminabad show 4 using any app and 26 using a paper khata. She puts
// Shabnam's job in the middle and every rival on a ring around it, by `ringFor`: direct apps, indirect products,
// substitutes (the biggest ring by far) and, outside, things that aren't rivals for this job at all. It ends on what the
// notebook does better and the position that leaves Galla. `RivalRings`, `RING_FILL` and the short names are shared
// with the Map the rivals game. Pure function of t (0–36).
import { GALLA_RIVALS, RIVAL_RINGS, ringFor, type GallaRival, type RivalRing } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';
import { GALLA, GALLA_SOFT } from './VisionNarrative';

const W = 960, H = 540;
/** Ring colours; white on each passes 4.5:1. */
export const RING_FILL: Record<RivalRing, string> = { direct: '#C11574', indirect: '#B54708', substitute: '#067647', not: '#475467' };
export const RING_NAME: Record<RivalRing, string> = { direct: 'Direct', indirect: 'Indirect', substitute: 'Substitute', not: 'Not a rival' };
/** Radius of each ring (`not` is the zone outside the dashed line). */
export const RING_R: Record<RivalRing, number> = { direct: 70, indirect: 126, substitute: 182, not: 232 };
export const RIVAL_SHORT: Record<GallaRival, string> = {
  bahi: 'Bahi', udhaarpe: 'UdhaarPe', notebook: 'Paper khata', whatsapp: 'WhatsApp notes', memory: 'Faiz’s memory',
  upi: 'UPI request', billing: 'Billing app', quick: 'Blinkit', distributor: 'Distributor app', pos: 'Chain billing',
};
/** Where on its ring each rival sits, in degrees (0 = right, counter-clockwise). */
const ANGLE: Record<GallaRival, number> = { bahi: 150, udhaarpe: 30, notebook: 270, whatsapp: 205, memory: 335, upi: 110, billing: 250, quick: 60, distributor: 160, pos: 300 };
/** A rival's dot position relative to the rings' centre. */
export const rivalAt = (r: GallaRival, ring: RivalRing = ringFor(GALLA_RIVALS[r])) => {
  const a = (ANGLE[r] * Math.PI) / 180, rad = ring === 'not' ? RING_R.not + 14 : RING_R[ring] - (ring === 'direct' ? 16 : 28);
  return { x: Math.cos(a) * rad, y: -Math.sin(a) * rad };
};

/** The rings around Shabnam's job, centred on (x, y), with the rivals in `shown` (0–1 each) placed on them. */
export function RivalRings({ x, y, shown, rings = 1, lit, scale = 1 }: { x: number; y: number; shown: Partial<Record<GallaRival, number>>; rings?: number; lit?: GallaRival; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle r={RING_R.not - 18} fill="none" stroke={SC.line} strokeWidth={2} strokeDasharray="6 6" opacity={rings} />
      {(['substitute', 'indirect', 'direct'] as const).map((ring, i) => (
        <circle key={ring} r={RING_R[ring] * lerp(0.7, 1, clamp(rings * 3 - i))} fill={RING_FILL[ring]} fillOpacity={0.1 + i * 0.04} stroke={RING_FILL[ring]} strokeWidth={2} opacity={clamp(rings * 3 - i)} />
      ))}
      <circle r={34} fill={GALLA} opacity={rings} />
      <text y={-4} textAnchor="middle" fontSize={11} fontWeight={900} fill="#FFFFFF" opacity={rings}>Shabnam’s</text>
      <text y={11} textAnchor="middle" fontSize={11} fontWeight={900} fill="#FFFFFF" opacity={rings}>job</text>
      {(Object.entries(shown) as [GallaRival, number][]).map(([r, k]) => {
        const ring = ringFor(GALLA_RIVALS[r]), at = rivalAt(r, ring);
        const left = at.x < -10, label = RIVAL_SHORT[r];
        return (
          <g key={r} transform={`translate(${at.x} ${lerp(at.y - 20, at.y, k)})`} opacity={k}>
            <circle r={lit === r ? 11 : 8} fill={RING_FILL[ring]} stroke="#FFFFFF" strokeWidth={2} />
            <rect x={left ? -label.length * 6.6 - 20 : 12} y={-10} width={label.length * 6.6 + 10} height={20} rx={10} fill={SC.surface} stroke={RING_FILL[ring]} strokeWidth={1.5} />
            <text x={left ? -15 : 17} y={4} textAnchor={left ? 'end' : 'start'} fontSize={11} fontWeight={900} fill={SC.text}>{label}</text>
          </g>
        );
      })}
    </g>
  );
}

const ORDER: { r: GallaRival; at: number }[] = [
  { r: 'bahi', at: 17.4 }, { r: 'udhaarpe', at: 17.9 }, { r: 'upi', at: 19.4 }, { r: 'billing', at: 19.9 },
  { r: 'notebook', at: 22.4 }, { r: 'whatsapp', at: 23.2 }, { r: 'memory', at: 24 },
  { r: 'quick', at: 27.4 }, { r: 'distributor', at: 28.2 }, { r: 'pos', at: 29 },
];
const TABLE = ['Udhaar ledger', 'WhatsApp reminders', 'Bill printing', 'Hindi', 'Backup', 'Reports'];
const TICKS = [[1, 1, 1], [1, 0, 0], [0, 1, 0], [1, 1, 1], [1, 1, 0], [1, 0, 1]];

export function RivalRingsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const table = t < 6.6 ? 1 - p(t, 6, 6.6) : 0;
  const shops = t >= 6 && t < 12.6 ? p(t, 6.2, 6.8) * (1 - p(t, 12, 12.6)) : 0;
  const rings = t >= 12 ? p(t, 12.4, 13.6) : 0;
  const fin = t >= 31 ? p(t, 31, 31.6) : 0;
  const shown: Partial<Record<GallaRival, number>> = {};
  for (const o of ORDER) if (t >= o.at) shown[o.r] = p(t, o.at, o.at + 0.5);
  const caption = t < 17 ? 'Know who owes what, and get it back without losing the customer'
    : t < 22 ? 'Direct: apps like Galla. Indirect: other products, same job.'
    : t < 27 ? 'Substitutes: habits and workarounds. 26 of 30 shops.'
    : 'Outside: a threat to her shop, or a different job, isn’t a rival here';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a feature table says Galla beats two rival apps, but visits to 30 shops show 26 use a paper notebook; Shabnam's job goes in the middle and every rival lands on a ring around it: direct apps, indirect products, substitutes like the notebook, and things outside that aren't rivals for the job; it ends on what the notebook does better and Galla's position">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        {table > 0 && (
          <g opacity={table} transform="translate(160 70)">
            <text x={0} y={0} fontSize={24} fontWeight={900} fill={SC.text}>Competitive analysis</text>
            <text x={0} y={26} fontSize={14} fontWeight={800} fill={SC.muted}>Rohan · Galla wins on ticks</text>
            {['Galla', 'Bahi', 'UdhaarPe'].map((n, j) => <text key={n} x={330 + j * 130} y={70} textAnchor="middle" fontSize={15} fontWeight={900} fill={j ? SC.text : GALLA}>{n}</text>)}
            {TABLE.map((row, i) => (
              <g key={row} transform={`translate(0 ${100 + i * 44})`} opacity={p(t, 0.6 + i * 0.3, 1 + i * 0.3)}>
                <rect x={-12} y={-26} width={664} height={40} rx={8} fill={SC.surface} />
                <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.text}>{row}</text>
                {TICKS[i].map((v, j) => <text key={j} x={330 + j * 130} y={0} textAnchor="middle" fontSize={18} fontWeight={900} fill={v ? '#067647' : SC.error}>{v ? '✓' : '✕'}</text>)}
              </g>
            ))}
            <text x={0} y={384} fontSize={15} fontWeight={900} fill={SC.text} opacity={p(t, 3.4, 4)}>The plan: copy Bahi’s bill printing.</text>
          </g>
        )}

        {shops > 0 && (
          <g opacity={shops}>
            <text x={480} y={70} textAnchor="middle" fontSize={24} fontWeight={900} fill={SC.text}>30 shops in Aminabad</text>
            {Array.from({ length: 30 }, (_, i) => {
              const app = [3, 11, 17, 26].includes(i), k = p(t, 6.6 + i * 0.07, 7 + i * 0.07), flip = p(t, 8.6, 9.4);
              return (
                <g key={i} transform={`translate(${210 + (i % 10) * 56} ${120 + Math.floor(i / 10) * 92})`} opacity={k}>
                  <rect width={44} height={64} rx={6} fill={app ? '#C11574' : GALLA_SOFT} stroke={app ? 'none' : GALLA} strokeWidth={2} opacity={app ? flip : 1} />
                  {app
                    ? <rect x={12} y={10} width={20} height={36} rx={4} fill="#FFFFFF" opacity={flip} />
                    : Array.from({ length: 4 }, (_, j) => <line key={j} x1={8} x2={36} y1={16 + j * 11} y2={16 + j * 11} stroke={GALLA} strokeOpacity={0.6 * flip} strokeWidth={2} />)}
                </g>
              );
            })}
            <g opacity={p(t, 9.6, 10.2)}>
              <rect x={240} y={430} width={14} height={14} rx={3} fill="#C11574" /><text x={262} y={442} fontSize={15} fontWeight={900} fill={SC.text}>4 use a ledger app</text>
              <rect x={500} y={430} width={14} height={14} rx={3} fill={GALLA_SOFT} stroke={GALLA} strokeWidth={2} /><text x={522} y={442} fontSize={15} fontWeight={900} fill={SC.text}>26 use a paper khata</text>
            </g>
          </g>
        )}

        {rings > 0 && (
          <g opacity={rings * (1 - fin * 0.15)}>
            <RivalRings x={fin ? lerp(480, 330, fin) : 480} y={290} shown={shown} rings={rings} lit={t >= 31 ? 'notebook' : undefined} scale={lerp(1, 0.86, fin)} />
            {t < 31 && (
              <g opacity={p(t, 13.4, 14)}>
                <text x={480} y={42} textAnchor="middle" fontSize={17} fontWeight={900} fill={SC.text}>{caption}</text>
                {RIVAL_RINGS.map((r, i) => (
                  <g key={r} transform={`translate(${790} ${120 + i * 34})`} opacity={p(t, 14 + i * 0.3, 14.4 + i * 0.3)}>
                    <circle cx={8} cy={-5} r={7} fill={RING_FILL[r]} />
                    <text x={22} y={0} fontSize={13} fontWeight={900} fill={SC.text}>{RING_NAME[r]}</text>
                  </g>
                ))}
              </g>
            )}
          </g>
        )}

        {fin > 0 && (
          <g transform={`translate(${lerp(640, 580, fin)} 90)`} opacity={fin}>
            <rect width={340} height={340} rx={18} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
            <text x={20} y={36} fontSize={13} fontWeight={900} fill={INK_MUTED} letterSpacing={1.2}>WHAT THE KHATA DOES BETTER</text>
            {['Free', 'Never needs charging', 'Customers trust ink'].map((e, i) => (
              <g key={e} transform={`translate(20 ${62 + i * 36})`} opacity={p(t, 31.6 + i * 0.4, 32 + i * 0.4)}>
                <circle cx={8} cy={-5} r={7} fill={RING_FILL.substitute} />
                <text x={24} y={0} fontSize={15} fontWeight={800} fill={INK}>{e}</text>
              </g>
            ))}
            <line x1={20} x2={320} y1={184} y2={184} stroke={INK} strokeOpacity={0.12} strokeWidth={2} />
            <text x={20} y={214} fontSize={13} fontWeight={900} fill={GALLA} letterSpacing={1.2} opacity={p(t, 33, 33.5)}>GALLA’S POSITION</text>
            <text x={20} y={244} fontSize={16} fontWeight={800} fill={INK} opacity={p(t, 33.4, 34)}>
              <tspan x={20} dy={0}>As quick as writing in the khata,</tspan>
              <tspan x={20} dy={24}>and it chases payments for you,</tspan>
              <tspan x={20} dy={24}>politely, in her name.</tspan>
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
