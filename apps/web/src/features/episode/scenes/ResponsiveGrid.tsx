'use client';
// Scene for ui.1-2: four product cards on a 12-column desktop grid (span 3), gutters and margins called out, then the same
// cards on an 8-column tablet (span 4, two per row) and a 4-column phone (span 4, stacked). Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const STAGES = [
  { at: 0, w: 820, n: 12, span: 3, name: 'Desktop · 12 columns' },
  { at: 17, w: 520, n: 8, span: 4, name: 'Tablet · 8 columns' },
  { at: 23, w: 250, n: 4, span: 4, name: 'Phone · 4 columns' },
];
const M = 24, G = 14, CARD_H = 74, TOP = 96;

type Rect = { x: number; y: number; w: number };
function layout(s: (typeof STAGES)[number]) {
  const left = (W - s.w) / 2, colW = (s.w - 2 * M - (s.n - 1) * G) / s.n, perRow = s.n / s.span;
  const cards: Rect[] = [0, 1, 2, 3].map(i => ({
    x: left + M + (i % perRow) * s.span * (colW + G), y: TOP + M + Math.floor(i / perRow) * (CARD_H + G), w: s.span * colW + (s.span - 1) * G,
  }));
  const rows = Math.ceil(4 / perRow);
  return { left, colW, cards, h: 2 * M + rows * CARD_H + (rows - 1) * G };
}
const LAYOUTS = STAGES.map(layout);

export function ResponsiveGridScene({ t }: { t: number }) {
  const si = t >= 23 ? 2 : t >= 17 ? 1 : 0;
  const k = si ? p(t, STAGES[si].at, STAGES[si].at + 0.9) : 1;
  const from = LAYOUTS[Math.max(0, si - 1)], to = LAYOUTS[si], s = STAGES[si];
  const fw = lerp(si ? STAGES[si - 1].w : s.w, s.w, k), fh = lerp(from.h, to.h, k), fl = (W - fw) / 2;
  const fin = p(t, 29, 29.8);
  const labels = t >= 11 && t < 17;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: cards on a responsive column grid from desktop to phone">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <text x={W / 2} y={60} textAnchor="middle" fontSize={20} fontWeight={800} fill={SC.text}>{s.name}</text>
        {/* the frame */}
        <rect x={fl} y={TOP} width={fw} height={fh} rx={16} fill={SC.surface} stroke={SC.text} strokeOpacity={0.3} strokeWidth={3} />
        {/* columns (only once the frame has settled) */}
        <g opacity={k >= 1 ? clamp((t - 0.3) / 0.6) : 0}>
          {Array.from({ length: s.n }, (_, i) => (
            <rect key={i} x={to.left + M + i * (to.colW + G)} y={TOP + 8} width={to.colW} height={to.h - 16} fill={SC.discover} opacity={0.13} />
          ))}
        </g>
        {/* the cards */}
        {[0, 1, 2, 3].map(i => {
          const a = from.cards[i], b = to.cards[i];
          const x = lerp(a.x, b.x, k), y = lerp(a.y, b.y, k), w = lerp(a.w, b.w, k);
          const show = clamp(back((t - 5 - i * 0.3) / 0.4));
          return (
            <g key={i} transform={`translate(${x + w / 2} ${y + CARD_H / 2}) scale(${show}) translate(${-(x + w / 2)} ${-(y + CARD_H / 2)})`}>
              <rect x={x} y={y} width={w} height={CARD_H} rx={10} fill={SC.grow} opacity={0.25} stroke={SC.grow} strokeWidth={2} />
              <text x={x + w / 2} y={y + CARD_H / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>span {s.span}</text>
            </g>
          );
        })}

        {/* gutters and margins */}
        {labels && (
          <g opacity={clamp((t - 11) / 0.4) * (1 - p(t, 16.4, 17))}>
            <rect x={LAYOUTS[0].left} y={TOP} width={M} height={LAYOUTS[0].h} fill={SC.design} opacity={0.35} />
            <rect x={LAYOUTS[0].left + 820 - M} y={TOP} width={M} height={LAYOUTS[0].h} fill={SC.design} opacity={0.35} />
            <text x={LAYOUTS[0].left + M / 2} y={TOP + LAYOUTS[0].h + 34} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.design}>margin</text>
            {[1, 2, 3].map(i => {
              const gx = LAYOUTS[0].cards[i].x - G;
              return <rect key={i} x={gx} y={TOP} width={G} height={LAYOUTS[0].h} fill={SC.build} opacity={0.45} />;
            })}
            <text x={LAYOUTS[0].cards[2].x - G / 2} y={TOP + LAYOUTS[0].h + 34} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.build}>gutter</text>
          </g>
        )}
        {t >= 23.5 && t < 29 && <text x={W / 2} y={505} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 24) / 0.5)}>Same cards, same rules. They stack.</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'Columns', l: '12 · 8 · 4', c: SC.discover }, { x: 480, n: 'Span', l: 'Not fixed widths', c: SC.mint }, { x: 760, n: 'Gutters + margins', l: 'Gaps between, frames at edges', c: SC.design }].map((f, i) => {
        const kk = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(kk)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
