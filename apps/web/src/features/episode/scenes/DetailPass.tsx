'use client';
// Scene for ui.5-3: Bunkar's Diwali page passed review. At 400% Kavya runs the checklist (`CRAFT_CHECKS`): straight
// quotes and a hyphen in a price range, then a photo whose corners match its card's (`innerRadius`), then the states
// nobody drew. She leaves what's already right, and writes every fix as a line (`changeList`) before the before and
// after. Pure function of t (0–36).
import { BUNKAR_DETAILS, changeList, innerRadius } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
const FIXES = changeList(Object.values(BUNKAR_DETAILS));
/** Short forms of the change list, so a line fits the canvas at a readable size. */
const SHORT = ['Curly quotes in reviews', 'En dash in the price range', 'Tabular figures in prices', 'Rebalance the banner heading', 'Photo radius 16 → 8 px', 'One icon stroke: 1.5 px', 'Focus ring on buttons', 'Long co-op names wrap', 'Empty wishlist designed'];

/** A small phone with Bunkar's sari page; `fixed` from 0 (as reviewed) to 1 (after the pass). */
function Phone({ x, y, fixed, label }: { x: number; y: number; fixed: number; label: string }) {
  const ir = lerp(16, innerRadius(16, 8), fixed);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={200} height={244} rx={24} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <rect x={16} y={20} width={168} height={150} rx={16} fill={SC.soft} stroke={SC.line} />
      <rect x={24} y={28} width={152} height={98} rx={ir} fill={SC.design} opacity={0.45} />
      <rect x={24} y={136} width={lerp(120, 96, fixed)} height={12} rx={4} fill={SC.muted} opacity={0.6} />
      <rect x={24} y={154} width={70} height={10} rx={4} fill={SC.muted} opacity={0.35} />
      <rect x={16} y={184} width={168} height={42} rx={21} fill={SC.brand} />
      {fixed > 0.5 && <rect x={12} y={180} width={176} height={50} rx={25} fill="none" stroke={SC.mint} strokeWidth={3} />}
      <text x={100} y={274} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">{label}</text>
    </g>
  );
}

export function DetailPassScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'It looks done' : t < 11 ? 'Type first' : t < 16 ? 'Then shapes' : t < 21 ? 'Then states' : t < 26 ? 'Leave what’s right' : t < 31 ? 'Write it all down' : 'Before and after';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: a sari page that passed review is inspected at 400%. Straight quotes become curly, a hyphen in a price range becomes an en dash. A photo with the same corner radius as its card gets the inner radius, outer minus padding. A missing focus ring, a long co-op name and a blank wishlist get designed. An en dash already in place and a correctly nested radius are left alone. Every fix is written down: ${FIXES.length} changes. Then the before and after side by side.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <Phone x={60} y={66} fixed={0} label="" />
            <g transform="translate(320 120)" opacity={p(t, 1.5, 2.2)}>
              <text fontSize={22} fontWeight={800} fill={SC.muted}>Passed review on Monday.</text>
              <text y={34} fontSize={22} fontWeight={800} fill={SC.muted}>Launches next week.</text>
              <g transform="translate(60 120)" opacity={p(t, 3, 3.8)}>
                <circle r={50} fill={SC.surface} stroke={SC.text} strokeWidth={6} />
                <line x1={36} y1={36} x2={74} y2={74} stroke={SC.text} strokeWidth={10} strokeLinecap="round" />
                <text y={8} fontSize={24} fontWeight={900} fill={SC.text} textAnchor="middle">400%</text>
              </g>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (() => {
          const a = p(t, 7, 7.8), b = p(t, 8.6, 9.4);
          return (
            <g>
              <text x={60} y={140} fontSize={32} fontWeight={800} fill={SC.text}>{a < 0.5 ? '"Softest Chanderi I\'ve owned"' : '“Softest Chanderi I’ve owned”'}</text>
              <text x={60} y={230} fontSize={44} fontWeight={800} fill={SC.text}>{b < 0.5 ? '₹2,400-₹3,100' : '₹2,400–₹3,100'}</text>
              <text x={60} y={300} fontSize={22} fontWeight={800} fill={SC.muted} opacity={b}>Ranges take an en dash; hyphens join words.</text>
            </g>
          );
        })()}

        {t >= 11 && t < 16 && (() => {
          const k = p(t, 12.4, 13.6);
          const ir = lerp(32, innerRadius(32, 16), k);
          return (
            <g>
              <rect x={80} y={80} width={260} height={240} rx={32} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
              <rect x={96} y={96} width={228} height={150} rx={ir} fill={SC.design} opacity={0.5} />
              <g transform="translate(380 150)">
                <text fontSize={22} fontWeight={800} fill={SC.muted}>Outer 16, padding 8</text>
                <text y={50} fontSize={30} fontWeight={900} fill={SC.text}>Inner {k < 0.5 ? '16' : '8'} px</text>
                <text y={90} fontSize={22} fontWeight={800} fill={SC.muted} opacity={k}>The gap stays even</text>
              </g>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (
          <g>
            <g opacity={p(t, 16.2, 16.8)}>
              <rect x={60} y={90} width={240} height={56} rx={28} fill={SC.brand} />
              <text x={180} y={126} fontSize={22} fontWeight={800} fill="#fff" textAnchor="middle">Add to bag</text>
              <rect x={54} y={84} width={252} height={68} rx={34} fill="none" stroke={SC.mint} strokeWidth={4} opacity={p(t, 17, 17.6)} />
            </g>
            <g opacity={p(t, 17.8, 18.4)}>
              <rect x={60} y={180} width={240} height={120} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={78} y={220} fontSize={21} fontWeight={800} fill={SC.text}>Pochampally Handloom</text>
              <text x={78} y={250} fontSize={21} fontWeight={800} fill={SC.text}>Weavers’ Co-operat…</text>
            </g>
            <g opacity={p(t, 19, 19.6)}>
              <rect x={340} y={90} width={240} height={210} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={460} y={150} fontSize={36} fill={SC.build} textAnchor="middle">♡</text>
              <text x={460} y={196} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">Tap ♡ on a sari</text>
              <text x={460} y={224} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">to save it here</text>
              <rect x={390} y={244} width={140} height={36} rx={18} fill={SC.soft} stroke={SC.line} />
              <text x={460} y={269} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">Diwali edit</text>
            </g>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {['Arrives in 4–6 days', 'Sheet 20, padding 12, map 8'].map((s, i) => (
              <g key={s} transform={`translate(60 ${110 + i * 90})`} opacity={p(t, 21.3 + i * 0.8, 21.9 + i * 0.8)}>
                <rect width={520} height={66} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <circle cx={36} cy={33} r={15} fill="none" stroke={SC.mint} strokeWidth={3} />
                <path d="M29 33 l5 5 l9 -10" fill="none" stroke={SC.mint} strokeWidth={3} strokeLinecap="round" />
                <text x={66} y={41} fontSize={22} fontWeight={800} fill={SC.text}>{s}</text>
              </g>
            ))}
            <text x={60} y={320} fontSize={22} fontWeight={800} fill={SC.muted} opacity={p(t, 23.2, 23.8)}>Already right. Ship them as they are.</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {SHORT.slice(0, 5).map((s, i) => {
              const k = p(t, 26.2 + i * 0.45, 26.6 + i * 0.45);
              return (
                <g key={s} transform={`translate(60 ${80 + i * 46})`} opacity={k}>
                  <text fontSize={21} fontWeight={900} fill={SC.muted} y={24}>{i + 1}</text>
                  <text x={36} y={24} fontSize={22} fontWeight={800} fill={SC.text}>{s}</text>
                </g>
              );
            })}
            <text x={60} y={330} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 28.8, 29.4)}>…and {FIXES.length - 5} more: {FIXES.length} changes, each with why</text>
          </g>
        )}

        {t >= 31 && (
          <g>
            <Phone x={90} y={60} fixed={0} label="Before" />
            <Phone x={350} y={60} fixed={p(t, 31.6, 32.8)} label="After" />
          </g>
        )}
      </g>
    </svg>
  );
}
