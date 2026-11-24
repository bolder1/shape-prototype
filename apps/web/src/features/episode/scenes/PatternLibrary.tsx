'use client';
// Scene for ia.3-3: Zoya draws a time picker from nothing (a wheel, a clock face, a slider), each struck out. A library
// of four known patterns opens (card list, chips, form, bottom sheet); one card shows its name, when to use it and when
// not to. Then the five screens of the Khelo booking flow are put together from those patterns, a dropdown for 14
// slots is swapped for chips, and notes say what the drawing can't. `PatternArt` and `KHELO_FLOW` are shared with the
// Build from the library game. Pure function of t (0–34).
import type { KheloScreen } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export type PatternId = 'cards' | 'chips' | 'form' | 'sheet';
/** How tall each pattern draws inside a screen (a sheet lies over the bottom of the screen instead). */
export const PATTERN_H: Record<PatternId, number> = { cards: 64, chips: 22, form: 52, sheet: 0 };
export const PATTERN_NAME: Record<PatternId, string> = { cards: 'Card list', chips: 'Chips', form: 'Form', sheet: 'Bottom sheet' };
/** The screens of the booking flow and the patterns each is built from, top to bottom. */
export const KHELO_FLOW: { id: KheloScreen; n: string; parts: PatternId[] }[] = [
  { id: 'find', n: 'Find', parts: ['chips', 'cards'] },
  { id: 'turf', n: 'Turf', parts: ['cards', 'sheet'] },
  { id: 'slot', n: 'Slot', parts: ['chips', 'chips'] },
  { id: 'players', n: 'Players', parts: ['form', 'form'] },
  { id: 'pay', n: 'Pay', parts: ['sheet'] },
];

/** One pattern as a wireframe, `w` wide, top-left at (x, y). A sheet is drawn over a screen `screenH` tall from its top `y`. */
export function PatternArt({ id, x, y, w, screenH = 120, tone = SC.text }: { id: PatternId; x: number; y: number; w: number; screenH?: number; tone?: string }) {
  const s = { stroke: tone, strokeOpacity: 0.6, strokeWidth: 1.5 };
  if (id === 'cards') return (
    <g>
      {[0, 1].map(k => (
        <g key={k} transform={`translate(${x} ${y + k * 33})`}>
          <rect width={w} height={29} rx={5} fill={SC.surface} {...s} />
          <rect x={4} y={4} width={21} height={21} rx={3} fill={SC.soft} {...s} />
          <rect x={30} y={7} width={w * 0.5} height={5} rx={2.5} fill={tone} opacity={0.55} />
          <rect x={30} y={17} width={w * 0.32} height={4} rx={2} fill={tone} opacity={0.3} />
        </g>
      ))}
    </g>
  );
  if (id === 'chips') {
    const n = 4, cw = (w - (n - 1) * 4) / n;
    return <g>{Array.from({ length: n }, (_, k) => <rect key={k} x={x + k * (cw + 4)} y={y + 3} width={cw} height={16} rx={8} fill={k === 1 ? tone : SC.surface} fillOpacity={k === 1 ? 0.75 : 1} {...s} />)}</g>;
  }
  if (id === 'form') return (
    <g>
      {[0, 1].map(k => (
        <g key={k} transform={`translate(${x} ${y + k * 26})`}>
          <rect width={w * 0.35} height={4} rx={2} fill={tone} opacity={0.5} />
          <rect y={7} width={w} height={15} rx={3} fill={SC.surface} {...s} />
        </g>
      ))}
    </g>
  );
  const sh = Math.min(64, screenH * 0.45), sy = y + screenH - sh;
  return (
    <g>
      <rect x={x} y={y} width={w} height={screenH - sh} fill={SC.text} opacity={0.18} />
      <rect x={x} y={sy} width={w} height={sh} rx={8} fill={SC.surface} {...s} />
      <rect x={x + w / 2 - 10} y={sy + 5} width={20} height={3} rx={1.5} fill={tone} opacity={0.4} />
      <rect x={x + 8} y={sy + 16} width={w * 0.55} height={5} rx={2.5} fill={tone} opacity={0.55} />
      <rect x={x + 8} y={sy + 27} width={w - 16} height={13} rx={3} fill={SC.surface} {...s} />
      <rect x={x + 8} y={sy + sh - 16} width={w - 16} height={11} rx={3} fill={tone} opacity={0.6} />
    </g>
  );
}

/** A phone with its patterns stacked top to bottom (and any sheet over the bottom). */
export function FlowPhone({ x, y, w, h, parts, upTo = parts.length, tone }: { x: number; y: number; w: number; h: number; parts: PatternId[]; upTo?: number; tone?: string }) {
  const pad = 8, shown = parts.slice(0, upTo), stack = shown.filter(id => id !== 'sheet');
  const tops = stack.map((_, k) => y + 24 + stack.slice(0, k).reduce((a, id) => a + PATTERN_H[id] + 8, 0));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <rect x={x + pad} y={y + 10} width={w * 0.4} height={6} rx={3} fill={SC.line} />
      {stack.map((id, k) => <PatternArt key={k} id={id} x={x + pad} y={tops[k]} w={w - 2 * pad} tone={tone} />)}
      <rect x={x + pad} y={y + h - 22} width={w - 2 * pad} height={14} rx={4} fill="none" stroke={SC.text} strokeOpacity={0.6} strokeWidth={1.5} />
      {shown.includes('sheet') && <PatternArt id="sheet" x={x} y={y + 18} w={w} screenH={h - 18} tone={tone} />}
    </g>
  );
}

const TRIES = [
  { n: 'A wheel', at: 0.8, d: (cx: number, cy: number) => <><circle cx={cx} cy={cy} r={34} fill="none" stroke={SC.text} strokeWidth={2} /><line x1={cx - 34} x2={cx + 34} y1={cy} y2={cy} stroke={SC.text} strokeWidth={2} /></> },
  { n: 'A clock face', at: 2.4, d: (cx: number, cy: number) => <><circle cx={cx} cy={cy} r={34} fill="none" stroke={SC.text} strokeWidth={2} /><line x1={cx} x2={cx} y1={cy} y2={cy - 24} stroke={SC.text} strokeWidth={3} /><line x1={cx} x2={cx + 16} y1={cy} y2={cy} stroke={SC.text} strokeWidth={3} /></> },
  { n: 'A slider', at: 4, d: (cx: number, cy: number) => <><line x1={cx - 40} x2={cx + 40} y1={cy} y2={cy} stroke={SC.text} strokeWidth={3} /><circle cx={cx + 10} cy={cy} r={9} fill={SC.surface} stroke={SC.text} strokeWidth={2} /></> },
];
const LIB: PatternId[] = ['cards', 'chips', 'form', 'sheet'];
const NOTES = [
  { s: 'Grey = booked, can’t be tapped', phone: 2, dy: 60, at: 29.2 },
  { s: 'Slot held for 10 minutes', phone: 2, dy: 110, at: 30.2 },
  { s: 'Opens over the page, closes back to it', phone: 1, dy: 190, at: 31.2 },
];

export function PatternLibraryScene({ t }: { t: number }) {
  const blank = 1 - p(t, 6, 6.6), lib = p(t, 6, 6.8) * (1 - p(t, 17.4, 18));
  const focus = p(t, 12, 12.8) * (1 - p(t, 17.4, 18)), flow = p(t, 18, 18.6);
  const swap = p(t, 24, 24.6), chipsIn = p(t, 25.6, 26.4);
  const PH = { y: 140, w: 150, h: 270 }, phX = (k: number) => 45 + k * 180;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a time picker drawn from scratch three ways is struck out, then a pattern library builds the five booking screens">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* from scratch */}
      {blank > 0 && (
        <g opacity={blank}>
          <text x={80} y={60} fontSize={14} fontWeight={800} fill={SC.muted}>ZOYA · 9:30 AM → 12:40 PM</text>
          {TRIES.map((tr, k) => {
            const cx = 180 + k * 280, cy = 260, o = p(t, tr.at, tr.at + 0.5), x = p(t, tr.at + 1, tr.at + 1.4);
            return (
              <g key={tr.n} opacity={o}>
                <rect x={cx - 110} y={120} width={220} height={280} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                {tr.d(cx, cy)}
                <text x={cx} y={360} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{tr.n}</text>
                <text x={cx} y={382} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.muted}>needs explaining</text>
                <g opacity={x} stroke={SC.error} strokeWidth={6} strokeLinecap="round"><line x1={cx - 60} y1={200} x2={cx + 60} y2={320} /><line x1={cx + 60} y1={200} x2={cx - 60} y2={320} /></g>
              </g>
            );
          })}
        </g>
      )}

      {/* the library */}
      {lib > 0 && (
        <g opacity={lib}>
          <text x={80} y={70} fontSize={14} fontWeight={800} fill={SC.muted}>KHELO WIREFRAME LIBRARY</text>
          {LIB.map((id, k) => {
            const big = id === 'chips' ? focus : 0;
            const x = lerp(80 + k * 205, 80, big), y = 96, w = lerp(185, 800, big), h = lerp(170, 380, big);
            const o = clamp(back((t - 6.4 - k * 0.3) / 0.4)) * (id === 'chips' ? 1 : 1 - focus);
            return (
              <g key={id} opacity={o}>
                <rect x={x} y={y} width={w} height={h} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
                <PatternArt id={id} x={x + 18} y={y + 24} w={big > 0.5 ? 300 : w - 36} screenH={90} />
                <text x={x + 18} y={y + h - 24} fontSize={16} fontWeight={900} fill={SC.text}>{PATTERN_NAME[id]}</text>
                {big > 0.5 && (
                  <g opacity={p(t, 13, 13.6)}>
                    {[{ k: 'USE WHEN', v: 'A few choices that fit on screen at once', at: 13.4 },
                      { k: 'EXAMPLES', v: 'Sports, team sizes, days, time slots', at: 14.4 },
                      { k: 'NOT FOR', v: 'Dozens of options, or anything typed', at: 15.4 }].map((r, j) => (
                      <g key={r.k} transform={`translate(${x + 370} ${y + 50 + j * 90})`} opacity={p(t, r.at, r.at + 0.5)}>
                        <text fontSize={12} fontWeight={800} fill={SC.muted}>{r.k}</text>
                        <text y={26} fontSize={16} fontWeight={700} fill={SC.text}>{r.v}</text>
                      </g>
                    ))}
                  </g>
                )}
              </g>
            );
          })}
        </g>
      )}

      {/* the flow, built from the library */}
      {flow > 0 && (
        <g opacity={flow}>
          <g transform="translate(45 40)">
            {LIB.map((id, k) => (
              <g key={id} transform={`translate(${k * 150} 0)`}>
                <rect width={138} height={60} rx={12} fill={SC.surface} stroke={SC.line} />
                <PatternArt id={id} x={10} y={id === 'chips' ? 8 : 4} w={50} screenH={52} />
                <text x={68} y={35} fontSize={12.5} fontWeight={800} fill={SC.text}>{PATTERN_NAME[id]}</text>
              </g>
            ))}
          </g>
          {KHELO_FLOW.map((s, k) => {
            const steps = s.parts.length, built = Math.floor(clamp((t - 18.6 - k * 0.9) / 0.5) * steps + 0.001);
            const slot = s.id === 'slot';
            return (
              <g key={s.id}>
                <FlowPhone x={phX(k)} y={PH.y} w={PH.w} h={PH.h} parts={slot && swap > 0 ? ['chips'] : s.parts} upTo={slot && swap > 0 ? 1 : built} />
                {slot && swap > 0 && (
                  <g>
                    <g opacity={1 - chipsIn}>
                      <rect x={phX(k) + 8} y={PH.y + 54} width={PH.w - 16} height={22} rx={4} fill={SC.surface} stroke={SC.text} strokeOpacity={0.6} strokeWidth={1.5} />
                      <text x={phX(k) + 14} y={PH.y + 69} fontSize={10.5} fontWeight={700} fill={SC.muted}>Select a time slot ▾</text>
                      <line x1={phX(k) + 4} y1={PH.y + 50} x2={phX(k) + PH.w - 4} y2={PH.y + 80} stroke={SC.error} strokeWidth={4} strokeLinecap="round" opacity={p(t, 24.8, 25.2)} />
                    </g>
                    <g opacity={chipsIn}>
                      {Array.from({ length: 14 }, (_, j) => {
                        const cw = (PH.w - 16 - 3 * 4) / 4;
                        return <rect key={j} x={phX(k) + 8 + (j % 4) * (cw + 4)} y={PH.y + 54 + Math.floor(j / 4) * 20} width={cw} height={15} rx={7.5} fill={[1, 4, 9].includes(j) ? SC.line : SC.surface} stroke={SC.text} strokeOpacity={0.55} strokeWidth={1.2} />;
                      })}
                    </g>
                  </g>
                )}
                <text x={phX(k) + PH.w / 2} y={PH.y + PH.h + 24} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{k + 1} · {s.n}</text>
              </g>
            );
          })}
          {swap > 0 && (
            <text x={phX(2) + PH.w / 2} y={PH.y + PH.h + 50} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.muted} opacity={chipsIn * (1 - p(t, 29, 29.4))}>14 slots: chips, not a dropdown</text>
          )}
          {NOTES.map(n => {
            const x = phX(n.phone) + PH.w - 6, y = PH.y + n.dy, o = p(t, n.at, n.at + 0.5);
            return (
              <g key={n.s} opacity={o}>
                <circle cx={x} cy={y} r={11} fill={SC.brand} />
                <text x={x} y={y + 4.5} textAnchor="middle" fontSize={12} fontWeight={900} fill="#fff">{NOTES.indexOf(n) + 1}</text>
              </g>
            );
          })}
          {t >= 29 && (
            <g transform={`translate(45 ${PH.y + PH.h + 40})`}>
              {NOTES.map((n, k) => (
                <text key={n.s} x={k * 300} fontSize={13.5} fontWeight={700} fill={SC.text} opacity={p(t, n.at, n.at + 0.5)}>{k + 1}. {n.s}</text>
              ))}
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
