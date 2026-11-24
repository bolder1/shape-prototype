'use client';
// Scene for ia.3-2: the desktop page for one Khelo turf, boxes placed by eye, every left edge a few pixels off (ticked in
// red). A 12-column grid with gutters and margins fades in and every block snaps to its columns: the slot picker to
// 1–8, the price summary beside it on 9–12. The turf photo then breaks out edge to edge on purpose. The page folds onto
// a 4-column phone, stacking in `phoneStack` order, and four more screens of the flow appear on the same grid.
// Pure function of t (0–34).
import { phoneStack } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
type Lane = 'bleed' | 'full' | 'main' | 'side';
const BLOCKS: { id: string; lane: Lane; visual: string; h: number; n: string }[] = [
  { id: 'top', lane: 'full', visual: '1', h: 28, n: 'Top bar' },
  { id: 'hero', lane: 'bleed', visual: '2', h: 70, n: 'Turf photo' },
  { id: 'title', lane: 'full', visual: '3', h: 34, n: 'Smash Arena · 4.6 · HSR Layout' },
  { id: 'slots', lane: 'main', visual: '4', h: 92, n: 'Saturday’s slots' },
  { id: 'sum', lane: 'side', visual: '4', h: 92, n: '₹1,200 · Book' },
  { id: 'amen', lane: 'main', visual: '5', h: 46, n: 'Floodlights · changing rooms' },
  { id: 'map', lane: 'side', visual: '5', h: 46, n: 'Map' },
  { id: 'rev', lane: 'main', visual: '6', h: 46, n: 'Players’ reviews' },
  { id: 'foot', lane: 'full', visual: '7', h: 24, n: 'Help · Terms' },
];
const JIT = [[7, -10], [-4, -40], [3, -14], [-6, 12], [9, -9], [5, -20], [-3, 8], [-8, 15], [2, -6]];

// the desktop page and its grid
const DX = 60, DY = 70, DW = 840, DM = 48, DG = 16, DCOL = (DW - 2 * DM - 11 * DG) / 12;
const dColX = (c: number) => DX + DM + (c - 1) * (DCOL + DG);
const dSpan = (a: number, b: number) => (b - a + 1) * DCOL + (b - a) * DG;
const ROW_Y = (() => {
  const ys: Record<string, number> = {}; let y = DY + 18;
  for (const r of ['1', '2', '3', '4', '5', '6', '7']) { ys[r] = y; y += Math.max(...BLOCKS.filter(b => b.visual === r).map(b => b.h)) + 12; }
  return { ys, end: y + 6 };
})();
const DESK = BLOCKS.map(b => {
  const y = ROW_Y.ys[b.visual];
  if (b.lane === 'bleed') return { x: DX, y, w: DW, h: b.h };
  if (b.lane === 'side') return { x: dColX(9), y, w: dSpan(9, 12), h: b.h };
  return { x: dColX(1), y, w: b.lane === 'main' ? dSpan(1, 8) : dSpan(1, 12), h: b.h };
});
const BY_EYE = DESK.map((r, i) => (BLOCKS[i].lane === 'bleed' ? { ...r, x: dColX(1) + JIT[i][0], w: dSpan(1, 12) + JIT[i][1] } : { ...r, x: r.x + JIT[i][0], w: r.w + JIT[i][1] }));

// the phone it folds onto
const PX = 120, PY = 50, PW = 300, PM = 16, PG = 12, PCOL = (PW - 2 * PM - 3 * PG) / 4, SQ = 0.72;
const PHONE = (() => {
  const out: Record<string, { x: number; y: number; w: number; h: number }> = {}; let y = PY + 16;
  for (const b of phoneStack(BLOCKS)) { const h = b.h * SQ; out[b.id] = b.lane === 'bleed' ? { x: PX, y, w: PW, h } : { x: PX + PM, y, w: PW - 2 * PM, h }; y += h + 8; }
  return { rects: out, end: y + 8 };
})();

function Block({ b, r, o }: { b: (typeof BLOCKS)[number]; r: { x: number; y: number; w: number; h: number }; o: number }) {
  const hero = b.id === 'hero';
  return (
    <g opacity={o}>
      <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={hero ? 0 : 6} fill={hero ? SC.soft : SC.surface} stroke={SC.text} strokeOpacity={0.55} strokeWidth={1.5} />
      {hero && <g stroke={SC.line} strokeWidth={1.5}><line x1={r.x} y1={r.y} x2={r.x + r.w} y2={r.y + r.h} /><line x1={r.x + r.w} y1={r.y} x2={r.x} y2={r.y + r.h} /></g>}
      {b.id === 'slots' && r.w > 200 && Array.from({ length: 14 }, (_, k) => (
        <rect key={k} x={r.x + 12 + (k % 7) * ((r.w - 24) / 7)} y={r.y + 30 + Math.floor(k / 7) * 28} width={(r.w - 24) / 7 - 8} height={20} rx={10} fill={[2, 5, 9].includes(k) ? SC.line : SC.surface} stroke={SC.text} strokeOpacity={0.4} />
      ))}
      {b.id === 'sum' && r.w > 100 && <rect x={r.x + 12} y={r.y + r.h - 34} width={r.w - 24} height={24} rx={6} fill="none" stroke={SC.text} strokeWidth={1.5} />}
      <text x={r.x + 12} y={r.y + Math.min(20, r.h / 2 + 5)} fontSize={hero ? 14 : 12.5} fontWeight={800} fill={SC.muted}>{b.n}</text>
    </g>
  );
}

function Columns({ x, y, n, col, gut, m, h, o }: { x: number; y: number; n: number; col: number; gut: number; m: number; h: number; o: number }) {
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, k) => <rect key={k} x={x + m + k * (col + gut)} y={y} width={col} height={h} fill={SC.discover} fillOpacity={0.16} />)}
    </g>
  );
}

const CAPTIONS = [
  { at: 0, s: 'Placed by eye: no two left edges agree' },
  { at: 6, s: '12 columns · 16 px gutters · 48 px margins' },
  { at: 11, s: 'Every block starts and ends on a column edge' },
  { at: 17, s: 'Main, columns 1–8: the task · Side, 9–12: stays in view' },
  { at: 22, s: 'The photo breaks the margins, on purpose' },
  { at: 26, s: 'Phone · 4 columns · 16 px margins' },
  { at: 31, s: 'The same grid on every screen of the flow' },
];

export function WireGridScene({ t }: { t: number }) {
  const ticks = p(t, 2.6, 3.4) * (1 - p(t, 11, 11.6));
  const grid = p(t, 6, 7.2), snap = (i: number) => p(t, 11 + i * 0.35, 12.2 + i * 0.35);
  const weight = p(t, 17, 17.6) * (1 - p(t, 26, 26.4)), bleed = p(t, 22, 23.4);
  const fold = (i: number) => p(t, 26 + i * 0.1, 28 + i * 0.1), frame = p(t, 26, 28), more = p(t, 31, 31.8);
  const cap = [...CAPTIONS].reverse().find(c => t >= c.at)!;
  const fw = lerp(DW, PW, frame), fx = lerp(DX, PX, frame), fy = lerp(DY, PY, frame), fh = lerp(ROW_Y.end - DY, PHONE.end - PY, frame);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a page's boxes snap to a 12-column grid, the main column holds the task and the side column the summary, then the page folds onto a 4-column phone">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <text key={cap.s} x={W / 2} y={40} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.text} opacity={clamp((t - cap.at) / 0.4)}>{cap.s}</text>

      {/* the page, then the phone */}
      <rect x={fx} y={fy} width={fw} height={fh} rx={lerp(10, 26, frame)} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <Columns x={DX} y={DY} n={12} col={DCOL} gut={DG} m={DM} h={ROW_Y.end - DY} o={grid * (1 - frame)} />
      <Columns x={PX} y={PY} n={4} col={PCOL} gut={PG} m={PM} h={PHONE.end - PY} o={grid * p(t, 27.4, 28.4)} />
      {grid > 0 && frame < 1 && (
        <g opacity={grid * (1 - frame)}>
          {[1, 9].map(c => <text key={c} x={dColX(c) + DCOL / 2} y={DY - 6} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted}>{c}</text>)}
          <text x={dColX(8) + DCOL / 2} y={DY - 6} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted}>8</text>
          <text x={dColX(12) + DCOL / 2} y={DY - 6} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted}>12</text>
        </g>
      )}

      {BLOCKS.map((b, i) => {
        const eye = BY_EYE[i], desk = DESK[i], s = snap(i);
        let r = { x: lerp(eye.x, desk.x, s), y: desk.y, w: lerp(eye.w, desk.w, s), h: desk.h };
        if (b.lane === 'bleed') { const full = { x: lerp(eye.x, dColX(1), s), w: lerp(eye.w, dSpan(1, 12), s) }; r = { ...r, x: lerp(full.x, DX, bleed), w: lerp(full.w, DW, bleed) }; }
        const ph = PHONE.rects[b.id], k = fold(i);
        r = { x: lerp(r.x, ph.x, k), y: lerp(r.y, ph.y, k), w: lerp(r.w, ph.w, k), h: lerp(r.h, ph.h, k) };
        return <Block key={b.id} b={b} r={r} o={clamp(back((t - 0.2 - i * 0.12) / 0.4))} />;
      })}

      {/* edges by eye */}
      {ticks > 0 && BY_EYE.map((r, i) => <line key={i} x1={r.x} x2={r.x} y1={r.y - 5} y2={r.y + r.h + 5} stroke={SC.error} strokeWidth={3} opacity={ticks} />)}

      {/* width shows weight */}
      {weight > 0 && (
        <g opacity={weight}>
          {[{ x: dColX(1), w: dSpan(1, 8), s: 'Main · 1–8' }, { x: dColX(9), w: dSpan(9, 12), s: 'Side · 9–12' }].map(z => (
            <g key={z.s}>
              <rect x={z.x - 4} y={ROW_Y.ys['4'] - 4} width={z.w + 8} height={92 + 8} rx={8} fill="none" stroke={SC.brand} strokeWidth={2.5} strokeDasharray="6 4" />
              <rect x={z.x + z.w - 96} y={ROW_Y.ys['4'] + 6} width={88} height={22} rx={11} fill={SC.brand} />
              <text x={z.x + z.w - 52} y={ROW_Y.ys['4'] + 21} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff">{z.s}</text>
            </g>
          ))}
        </g>
      )}

      {/* the rest of the flow on the same grid */}
      {more > 0 && ['Find', 'Slot', 'Players', 'Pay'].map((n, k) => {
        const x = 500 + k * 110, y = 100, w = 96, h = 300, col = (w - 10 - 3 * 4) / 4;
        return (
          <g key={n} opacity={p(t, 31 + k * 0.3, 31.6 + k * 0.3)}>
            <rect x={x} y={y} width={w} height={h} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            {Array.from({ length: 4 }, (_, c) => <rect key={c} x={x + 5 + c * (col + 4)} y={y + 8} width={col} height={h - 16} fill={SC.discover} fillOpacity={0.16} />)}
            {[[14, 10], [30, k === 1 ? 20 : 48], [84, k === 2 ? 60 : 30], [120, 30], [h - 36, 20]].map(([dy, bh], j) => (
              <rect key={j} x={x + 5} y={y + dy} width={w - 10} height={bh} rx={3} fill={SC.surface} stroke={SC.text} strokeOpacity={0.45} />
            ))}
            <text x={x + w / 2} y={y + h + 22} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>{n}</text>
          </g>
        );
      })}
      {more > 0 && <text x={PX + PW / 2} y={Math.min(PHONE.end, 500) + 22} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted} opacity={more}>Turf</text>}
    </svg>
  );
}
