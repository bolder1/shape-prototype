'use client';
// Scene for ui.5-1: Bunkar's sari page is aligned to the pixel and still looks wrong. The play triangle, centred by its
// box, moves toward its centroid (`centroidShift`); capitals centre on their cap height, not the line box; an O
// overshoots the H's lines; a circle beside a square grows to equal area (`equalAreaDiameter`); a quote mark and
// bullets hang in the margin; and prices in a column stay exact. Pure function of t (0–36). Drawn on a small canvas so
// every label stays at least 11 px on a phone.
import { centroidShift, equalAreaDiameter } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
const TRI = 66; // the play triangle's width on this canvas

function Guide({ x1, y1, x2, y2, k = 1 }: { x1: number; y1: number; x2: number; y2: number; k?: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={SC.error} strokeWidth={2} strokeDasharray="6 5" opacity={k} />;
}

export function OpticalCentreScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Centred, and wrong' : t < 11 ? 'Mass, not box' : t < 16 ? 'Capitals sit high' : t < 21 ? 'Round shapes overshoot' : t < 26 ? 'Circle against square' : t < 31 ? 'Hang the edges' : 'Where maths wins';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a play triangle centred in its round button by its box looks shifted left, so it moves toward its centre of mass. Capitals centred by their line box sit high, so they centre on the cap height. An O drawn to the same lines as an H looks small, so it overshoots them. A circle as wide as a square looks smaller, so it grows to equal area. A quote mark and bullets hang outside the margin so the text lines up. Prices in a column stay mathematically exact.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 11 && (() => {
          const shift = centroidShift(TRI) * p(t, 6.6, 8.4);
          const cx = 220, cy = 200, h = TRI * 1.1;
          const x0 = cx - TRI / 2 + shift;
          return (
            <g>
              <circle cx={cx} cy={cy} r={110} fill={SC.design} opacity={0.22} />
              <circle cx={cx} cy={cy} r={110} fill="none" stroke={SC.design} strokeWidth={3} />
              <path d={`M${x0} ${cy - h / 2} L${x0 + TRI} ${cy} L${x0} ${cy + h / 2} Z`} fill={SC.text} />
              <g opacity={1 - p(t, 8.6, 9.4)}>
                <rect x={cx - TRI / 2} y={cy - h / 2} width={TRI} height={h} fill="none" stroke={SC.error} strokeWidth={2} strokeDasharray="6 5" />
                <Guide x1={cx} y1={cy - 130} x2={cx} y2={cy + 130} />
              </g>
              <g opacity={p(t, 6, 6.6)}>
                <circle cx={cx - TRI / 2 + TRI / 3 + shift} cy={cy} r={6} fill={SC.mint} />
              </g>
              <g transform="translate(380 150)">
                <text fontSize={22} fontWeight={800} fill={SC.muted}>{t < 6 ? 'Box centred.' : 'The mass sits a third'}</text>
                <text y={32} fontSize={22} fontWeight={800} fill={SC.muted}>{t < 6 ? 'It looks left.' : 'from the flat side.'}</text>
                <g opacity={p(t, 8.4, 9)}>
                  <text y={92} fontSize={30} fontWeight={900} fill={SC.text}>+3 px</text>
                  <text y={122} fontSize={21} fontWeight={800} fill={SC.muted}>on an 18 px triangle</text>
                </g>
              </g>
            </g>
          );
        })()}

        {t >= 11 && t < 16 && (() => {
          const k = p(t, 12.6, 13.8);
          const base = lerp(213, 220, k);
          return (
            <g>
              <rect x={90} y={150} width={460} height={100} rx={50} fill={SC.brand} />
              <g opacity={1 - k * 0.6}>
                <rect x={150} y={base - 36} width={340} height={46} fill={SC.error} opacity={0.18} />
                <text x={500} y={base - 40} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">line box</text>
              </g>
              <g opacity={k}>
                <Guide x1={110} y1={200} x2={530} y2={200} />
                <text x={320} y={290} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">cap height centred in the button</text>
              </g>
              <text x={320} y={base} fontSize={40} fontWeight={900} fill="#fff" textAnchor="middle" letterSpacing={2}>ADD TO BAG</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (() => {
          const k = p(t, 17.8, 19);
          const r = lerp(60, 64.5, k);
          return (
            <g>
              <Guide x1={60} y1={150} x2={580} y2={150} />
              <Guide x1={60} y1={270} x2={580} y2={270} />
              <rect x={150} y={150} width={24} height={120} fill={SC.text} />
              <rect x={226} y={150} width={24} height={120} fill={SC.text} />
              <rect x={150} y={198} width={100} height={22} fill={SC.text} />
              <ellipse cx={400} cy={210} rx={r * 0.9} ry={r} fill="none" stroke={SC.text} strokeWidth={24} />
              <text x={320} y={318} fontSize={22} fontWeight={800} fill={SC.muted} textAnchor="middle">{k < 0.5 ? 'Drawn to the lines, the O looks small' : 'It runs a little past both lines'}</text>
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (() => {
          const side = 140, d = lerp(side, equalAreaDiameter(side), p(t, 22.4, 23.6));
          return (
            <g>
              <Guide x1={60} y1={130} x2={580} y2={130} k={0.6} />
              <Guide x1={60} y1={270} x2={580} y2={270} k={0.6} />
              <rect x={110} y={130} width={side} height={side} rx={8} fill={SC.grow} opacity={0.35} />
              <rect x={110} y={130} width={side} height={side} rx={8} fill="none" stroke={SC.grow} strokeWidth={3} />
              <circle cx={420} cy={200} r={d / 2} fill={SC.discover} opacity={0.3} />
              <circle cx={420} cy={200} r={d / 2} fill="none" stroke={SC.discover} strokeWidth={3} />
              <text x={320} y={322} fontSize={22} fontWeight={800} fill={SC.muted} textAnchor="middle">{d < side + 6 ? 'Same width, a fifth less area' : 'Equal area: 48 px square, 54 px circle'}</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (() => {
          const k = p(t, 27.2, 28.6);
          const m = 150;
          return (
            <g>
              <line x1={m} y1={80} x2={m} y2={330} stroke={SC.mint} strokeWidth={3} />
              <g transform={`translate(${lerp(m, m - 32, k)} 0)`}>
                <text y={150} fontSize={64} fontWeight={900} fill={SC.design}>“</text>
              </g>
              <rect x={lerp(m + 32, m, k)} y={112} width={lerp(330, 362, k)} height={20} rx={6} fill={SC.text} opacity={0.8} />
              <rect x={m} y={146} width={380} height={20} rx={6} fill={SC.text} opacity={0.8} />
              {[0, 1, 2].map(i => (
                <g key={i}>
                  <circle cx={lerp(m + 8, m - 22, k)} cy={222 + i * 36} r={7} fill={SC.design} />
                  <rect x={lerp(m + 28, m, k)} y={212 + i * 36} width={260 - i * 40} height={20} rx={6} fill={SC.text} opacity={0.6} />
                </g>
              ))}
              <text x={m + 400} y={232} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end" opacity={p(t, 28.6, 29.2)}>Ink lines up</text>
            </g>
          );
        })()}

        {t >= 31 && (
          <g>
            <line x1={420} y1={80} x2={420} y2={300} stroke={SC.mint} strokeWidth={3} />
            {['₹2,400', '₹11,150', '₹640', '₹14,190'].map((v, i) => (
              <text key={v} x={410} y={124 + i * 48} fontSize={32} fontWeight={i === 3 ? 900 : 700} fill={SC.text} textAnchor="end" style={{ fontVariantNumeric: 'tabular-nums' }} opacity={p(t, 31.2 + i * 0.3, 31.6 + i * 0.3)}>{v}</text>
            ))}
            <text x={450} y={150} fontSize={22} fontWeight={800} fill={SC.muted} opacity={p(t, 32.6, 33.2)}>Data stays</text>
            <text x={450} y={180} fontSize={22} fontWeight={800} fill={SC.muted} opacity={p(t, 32.6, 33.2)}>exact</text>
          </g>
        )}
      </g>
    </svg>
  );
}
