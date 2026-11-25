'use client';
// Scene for dc.4-1: Chakki's product card goes from Figma to React. Props come down from the page; the card and the
// cart bar each keep their own quantity and drift apart (2 against 1); the quantity is lifted to the page and comes
// down to both with onQuantityChange going up; the line total, sold out and discount are derived while rendering; the
// mill panel stays the card's own state; and one component draws every state. Pure function of t (0–36). Also
// exports `HOME_FILL`, which `data-home` uses.
import type { DataHome } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per home; white text on each passes 4.5:1. */
export const HOME_FILL: Record<DataHome, string> = { prop: '#175CD3', state: '#6941C6', lift: '#B54708', derive: '#067647' };
const PRICE = 285, MRP = 320;

/** The product card, at (x, y), 260 wide. */
function Card({ x, y, qty, tone, open = 0 }: { x: number; y: number; qty: number; tone?: string; open?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={260} height={128 + open * 46} rx={14} fill={SC.surface} stroke={tone ?? SC.line} strokeWidth={tone ? 3 : 2} />
      <rect x={12} y={12} width={72} height={72} rx={10} fill="#D9C7A3" />
      <text x={96} y={38} fontSize={21} fontWeight={900} fill={SC.text}>Sharbati atta</text>
      <text x={96} y={66} fontSize={21} fontWeight={800} fill={SC.muted}>5 kg · ₹{PRICE}</text>
      <rect x={96} y={88} width={150} height={30} rx={8} fill={SC.soft} stroke={SC.line} />
      <text x={112} y={110} fontSize={21} fontWeight={900} fill={SC.text}>−</text>
      <text x={171} y={110} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">{qty}</text>
      <text x={230} y={110} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="end">+</text>
      {open > 0 && <text x={12} y={158} fontSize={21} fontWeight={800} fill={SC.muted} opacity={open}>Ground 6:30 am today</text>}
    </g>
  );
}

export function StateLiftScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A card in Figma' : t < 11 ? 'Props in' : t < 16 ? 'Two counts' : t < 21 ? 'Lift it up' : t < 26 ? 'Derive, don’t store' : t < 31 ? 'Local stays local' : 'Every state, one component';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Chakki’s product card for Sharbati atta, 5 kg, ₹${PRICE}, goes from Figma to React. The category page passes the product, the delivery slot and the size down as props. The card and the cart bar each keep their own quantity in useState, and they drift: the card says 2, the cart bar says 1. The quantity is lifted into the page, which passes it down to both, and the card calls onQuantityChange when someone taps plus. The line total, ₹${PRICE} × 2 = ₹${PRICE * 2}, “sold out” and the 11% discount are worked out on every render instead of stored. Whether the mill panel is open is the card’s own state. One component then draws loading, sold out, compact and in-the-cart from what it is given.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <g opacity={p(t, 0.3, 1)}><Card x={32} y={80} qty={1} /></g>
            <g opacity={p(t, 1.6, 2.2)}>
              <rect x={316} y={80} width={96} height={34} rx={8} fill={HOME_FILL.derive} />
              <text x={364} y={104} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">11% off</text>
            </g>
            {(['Compact', 'Sold out', 'In the cart'] as const).map((v, i) => (
              <g key={v} opacity={p(t, 2.6 + i * 0.5, 3.1 + i * 0.5)}>
                <rect x={316} y={130 + i * 44} width={180} height={34} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={332} y={154 + i * 44} fontSize={21} fontWeight={800} fill={SC.text}>{v}</text>
              </g>
            ))}
            <text x={32} y={318} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 4.4, 5)}>Variants in Figma. Next: one React component.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <rect x={32} y={70} width={576} height={50} rx={12} fill={HOME_FILL.prop} />
            <text x={52} y={103} fontSize={21} fontWeight={900} fill="#fff">CategoryPage</text>
            {(['product', 'slotLabel', 'size'] as const).map((n, i) => {
              const k = p(t, 6.6 + i * 0.7, 7.4 + i * 0.7);
              return (
                <g key={n} opacity={k}>
                  <line x1={110 + i * 96} y1={120} x2={110 + i * 96} y2={lerp(120, 176, k)} stroke={HOME_FILL.prop} strokeWidth={3} />
                </g>
              );
            })}
            <g opacity={p(t, 6.2, 6.8)}><Card x={32} y={180} qty={1} /></g>
            <g opacity={p(t, 8.6, 9.2)}>
              <text x={320} y={210} fontSize={21} fontWeight={800} fill={SC.text}>Props: product,</text>
              <text x={320} y={240} fontSize={21} fontWeight={800} fill={SC.text}>slotLabel, size</text>
              <text x={320} y={282} fontSize={21} fontWeight={800} fill={SC.muted}>The card only reads them.</text>
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (() => {
          const drift = p(t, 12.4, 13);
          return (
            <g>
              <Card x={32} y={74} qty={drift > 0.5 ? 2 : 1} tone={drift > 0.5 ? SC.error : undefined} />
              <text x={310} y={110} fontSize={21} fontWeight={800} fill={SC.muted}>useState(1) in the card</text>
              <rect x={32} y={238} width={576} height={56} rx={12} fill={SC.surface} stroke={drift > 0.5 ? SC.error : SC.line} strokeWidth={drift > 0.5 ? 3 : 2} />
              <text x={52} y={274} fontSize={21} fontWeight={900} fill={SC.text}>Cart bar · 1 item · ₹{PRICE}</text>
              <text x={588} y={274} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">its own useState</text>
              <text x={310} y={170} fontSize={22} fontWeight={900} fill={SC.error} opacity={p(t, 13.4, 14)}>2 against 1</text>
              <text x={310} y={200} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 14, 14.6)}>One fact, stored twice.</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (() => {
          const up = p(t, 16.3, 17.4), down = p(t, 17.8, 18.8);
          return (
            <g>
              <rect x={32} y={64} width={576} height={50} rx={12} fill={HOME_FILL.lift} />
              <text x={52} y={97} fontSize={21} fontWeight={900} fill="#fff">CategoryPage · useState(cart)</text>
              <g opacity={1 - up}><text x={320} y={lerp(170, 100, up)} fontSize={21} fontWeight={900} fill={HOME_FILL.lift}>quantity</text></g>
              <Card x={32} y={130} qty={down > 0.5 ? 2 : 1} />
              <line x1={160} y1={114} x2={160} y2={lerp(114, 130, down)} stroke={HOME_FILL.lift} strokeWidth={4} />
              <text x={310} y={160} fontSize={21} fontWeight={800} fill={SC.text} opacity={down}>↓ quantity</text>
              <text x={310} y={192} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 19, 19.6)}>↑ onQuantityChange</text>
              <rect x={32} y={282} width={576} height={50} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={down} />
              <text x={52} y={315} fontSize={21} fontWeight={900} fill={SC.text} opacity={down}>Cart bar · {down > 0.5 ? 2 : 1} items · ₹{PRICE * (down > 0.5 ? 2 : 1)}</text>
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (
          <g>
            {([
              ['lineTotal = price × quantity', `₹${PRICE} × 2 = ₹${PRICE * 2}`],
              ['soldOut = stock === 0', 'stock 40 → false'],
              ['discount = 1 − price ÷ MRP', `1 − ${PRICE} ÷ ${MRP} → ${Math.round((1 - PRICE / MRP) * 100)}%`],
            ] as const).map(([code, v], i) => (
              <g key={code} opacity={p(t, 21.3 + i * 0.9, 21.9 + i * 0.9)}>
                <rect x={32} y={74 + i * 74} width={576} height={60} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <rect x={32} y={74 + i * 74} width={8} height={60} rx={3} fill={HOME_FILL.derive} />
                <text x={56} y={102 + i * 74} fontSize={21} fontWeight={900} fill={SC.text} fontFamily="ui-monospace, monospace">{code}</text>
                <text x={56} y={126 + i * 74} fontSize={21} fontWeight={800} fill={SC.muted}>{v}</text>
              </g>
            ))}
            <text x={32} y={322} fontSize={21} fontWeight={900} fill={HOME_FILL.derive} opacity={p(t, 24.4, 25)}>Computed every render. Never stored, never stale.</text>
          </g>
        )}

        {t >= 26 && t < 31 && (() => {
          const open = p(t, 26.8, 27.8);
          return (
            <g>
              <Card x={32} y={74} qty={2} open={open} />
              <rect x={310} y={74} width={298} height={40} rx={10} fill={HOME_FILL.state} opacity={p(t, 28, 28.6)} />
              <text x={326} y={101} fontSize={21} fontWeight={900} fill="#fff" opacity={p(t, 28, 28.6)}>useState(false)</text>
              <text x={310} y={150} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 28.6, 29.2)}>Only this card</text>
              <text x={310} y={178} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 28.6, 29.2)}>cares if it’s open.</text>
              <text x={32} y={300} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 29.4, 30)}>The photo loading and the “Added” tick too.</text>
            </g>
          );
        })()}

        {t >= 31 && (
          <g>
            {(['Loading', 'Sold out', 'Compact', 'In the cart'] as const).map((v, i) => {
              const x = 32 + (i % 2) * 292, y = 72 + Math.floor(i / 2) * 120;
              return (
                <g key={v} opacity={p(t, 31.2 + i * 0.5, 31.7 + i * 0.5)}>
                  <rect x={x} y={y} width={284} height={104} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <rect x={x + 12} y={y + 14} width={60} height={60} rx={10} fill={v === 'Loading' ? SC.line : '#D9C7A3'} opacity={v === 'Sold out' ? 0.4 : 1} />
                  <text x={x + 86} y={y + 42} fontSize={21} fontWeight={900} fill={SC.text}>{v}</text>
                  <text x={x + 86} y={y + 72} fontSize={21} fontWeight={800} fill={SC.muted}>{v === 'Loading' ? '…' : v === 'Sold out' ? 'stock 0' : v === 'Compact' ? 'size="compact"' : 'quantity 2'}</text>
                </g>
              );
            })}
            <text x={32} y={330} fontSize={21} fontWeight={900} fill={SC.text} opacity={p(t, 33.6, 34.2)}>Same component, from what it’s given.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
