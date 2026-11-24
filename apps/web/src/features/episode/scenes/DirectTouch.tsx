'use client';
// Scene for ia.4-4: Meenal's Mandi basket. She drags the mangoes into next week (the row follows her finger and a gap
// opens where it will land), swipes the okra away, and pinches the spinach photo to check it's fresh. Then her mother,
// Asha aunty, opens the same screen and finds none of it, so every gesture gets a visible twin (a ⋯ menu, + and −, tap
// the photo) and swipes get an Undo. `GestureStage`, which plays one gesture on a basket row, is shared with the Map the
// gestures game. Pure function of t (0–34).
import type { Gesture } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

export const Finger = ({ x, y, o = 1 }: { x: number; y: number; o?: number }) => (
  <g opacity={o}><ellipse cx={x} cy={y + 14} rx={17} ry={21} fill="#f5c9a8" stroke="#c2410c" strokeOpacity={0.4} strokeWidth={2} opacity={0.9} /><ellipse cx={x} cy={y + 7} rx={9} ry={8} fill="#fde2cf" opacity={0.85} /></g>
);

function Produce({ x, y, s = 1, tone }: { x: number; y: number; s?: number; tone: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width={36} height={36} rx={8} fill={SC.soft} stroke={SC.line} />
      <circle cx={18} cy={20} r={10} fill={tone} />
      <path d="M18 10 q 4 -6 9 -5" fill="none" stroke="#2D6A4F" strokeWidth={2} />
    </g>
  );
}

function Row({ x, y, name, qty, tone, lift = 0, twin }: { x: number; y: number; name: string; qty: string; tone: string; lift?: number; twin?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {lift > 0 && <rect x={4} y={6} width={220} height={52} rx={12} fill={SC.text} opacity={0.12 * lift} />}
      <rect width={220} height={52} rx={12} fill={SC.surface} stroke={lift > 0 ? SC.brand : SC.line} strokeWidth={lift > 0 ? 2 : 1.5} />
      <Produce x={8} y={8} tone={tone} />
      <text x={54} y={23} fontSize={13} fontWeight={800} fill={SC.text}>{name}</text>
      <text x={54} y={40} fontSize={11.5} fontWeight={600} fill={SC.muted}>{qty}</text>
      {twin !== undefined && twin > 0 && (
        <g opacity={twin}>
          <g transform="translate(130 16)"><rect width={20} height={20} rx={6} fill={SC.surface} stroke={SC.line} /><text x={10} y={15} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>−</text><rect x={26} width={20} height={20} rx={6} fill={SC.surface} stroke={SC.line} /><text x={36} y={15} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>+</text></g>
          <text x={204} y={31} textAnchor="middle" fontSize={16} fontWeight={900} fill={SC.text}>⋯</text>
        </g>
      )}
    </g>
  );
}

/** One gesture played on a basket row, `k` of the way through (0 → 1). At the end, the visible `twin` appears. */
export function GestureStage({ gesture, k, label, twin }: { gesture: Gesture; k: number; label: string; twin?: string }) {
  const short = label.length > 24 ? `${label.slice(0, 23)}…` : label;
  const RX = 20, RY = 60;
  const move = p(k, 0.2, 0.8);
  let row: React.ReactNode, finger: React.ReactNode, extra: React.ReactNode = null;
  if (gesture === 'tap') {
    const down = clamp(1 - Math.abs(k - 0.45) / 0.15);
    row = <g><Row x={RX} y={RY} name={short} qty="Tap" tone="#E76F51" />{k > 0.45 && <rect x={RX} y={RY} width={220} height={52} rx={12} fill="none" stroke={SC.brand} strokeWidth={2.5} />}</g>;
    extra = k > 0.45 && <circle cx={RX + 150} cy={RY + 26} r={lerp(4, 30, p(k, 0.45, 0.8))} fill={SC.brand} opacity={0.25 * (1 - p(k, 0.6, 0.9))} />;
    finger = <Finger x={RX + 150} y={lerp(RY + 120, RY + 20, p(k, 0, 0.4))} o={down > 0 || k < 0.45 ? 1 : 1 - p(k, 0.6, 0.8)} />;
  } else if (gesture === 'swipe') {
    const dx = -130 * move;
    extra = <g><rect x={RX} y={RY} width={220} height={52} rx={12} fill={SC.error} /><text x={RX + 200} y={RY + 31} textAnchor="end" fontSize={13} fontWeight={800} fill="#fff">Remove</text></g>;
    row = <Row x={RX + dx} y={RY} name={short} qty="Swipe" tone="#52B788" />;
    finger = <Finger x={RX + 190 + dx} y={RY + 12} o={1 - p(k, 0.85, 1)} />;
  } else if (gesture === 'drag') {
    const dy = 120 * move;
    extra = <g><text x={RX} y={RY + 128} fontSize={11} fontWeight={800} fill={SC.muted}>NEXT SATURDAY</text><rect x={RX} y={RY + 120 + 16} width={220} height={52} rx={12} fill="none" stroke={SC.brand} strokeDasharray="5 4" opacity={move} /></g>;
    row = <Row x={RX} y={RY + dy + (move > 0 ? 16 * move : 0)} name={short} qty="Drag" tone="#F4A259" lift={clamp(k * 5) * (1 - p(k, 0.85, 1))} />;
    finger = <Finger x={RX + 120} y={RY + 12 + dy + 16 * move} o={1 - p(k, 0.85, 1)} />;
  } else {
    const s = lerp(1, 3, move);
    row = <Row x={RX} y={RY} name={short} qty="Pinch" tone="#2D6A4F" />;
    extra = move > 0 && <g><rect x={0} y={0} width={260} height={260} fill={SC.surface} opacity={0.85 * move} /><Produce x={130 - 18 * s} y={130 - 18 * s} s={s} tone="#2D6A4F" /></g>;
    finger = <g opacity={1 - p(k, 0.85, 1)}><Finger x={130 - 18 - 50 * move} y={110 - 40 * move} /><Finger x={130 + 18 + 50 * move} y={110 + 40 * move} /></g>;
  }
  return (
    <g>
      <rect width={260} height={260} rx={24} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <text x={20} y={36} fontSize={14} fontWeight={900} fill={SC.text}>Saturday’s box</text>
      {gesture !== 'pinch' && extra}
      {row}
      {gesture === 'pinch' && extra}
      {finger}
      {twin && k >= 1 && (
        <g>
          <rect x={20} y={206} width={220} height={36} rx={10} fill={SC.surface} stroke={SC.mint} strokeWidth={2.5} />
          <text x={130} y={229} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>Also visible: {twin}</text>
        </g>
      )}
    </g>
  );
}

const PX = 120, PY = 40;
const ITEMS = [{ n: 'Tomatoes', q: '1 kg', c: '#E76F51' }, { n: 'Okra', q: '500 g', c: '#52B788' }, { n: 'Spinach', q: '2 bunches', c: '#2D6A4F' }, { n: 'Alphonso mangoes', q: '6', c: '#F4A259' }];

export function DirectTouchScene({ t }: { t: number }) {
  const reset = t >= 19;   // Asha opens the same, untouched screen
  const drag = reset ? 0 : p(t, 5, 8.4), lift = reset ? 0 : clamp((t - 4.6) * 3) * (1 - p(t, 8.6, 9.2));
  const swipe = reset ? 0 : p(t, 10.6, 12.4), gone = reset ? 0 : p(t, 13, 13.8);
  const zoom = reset ? 0 : p(t, 15.4, 17.2) * (1 - p(t, 18.2, 19));
  const twin = p(t, 24, 25), menu = p(t, 26, 26.6) * (1 - p(t, 28.6, 29));
  const okraGone = t >= 29 ? p(t, 29, 29.6) : 0;
  const removed = Math.max(gone, okraGone);
  const rowY = (k: number) => PY + 70 + k * 62 - (k > 1 ? removed * 62 : 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: dragging, swiping and pinching items in a basket, then a user who can’t find the gestures, and visible buttons added for each">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={clamp(back(t / 0.6))}>
        <rect x={PX} y={PY} width={260} height={460} rx={30} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
        <text x={PX + 20} y={PY + 40} fontSize={17} fontWeight={900} fill={SC.text}>Saturday’s box</text>
        <text x={PX + 20} y={PY + 330} fontSize={11} fontWeight={800} fill={SC.muted}>NEXT SATURDAY</text>
        {drag > 0 && drag < 1 && <rect x={PX + 20} y={PY + 346} width={220} height={52} rx={12} fill="none" stroke={SC.brand} strokeDasharray="5 4" opacity={drag} />}
        {/* okra's swipe reveals Remove */}
        {swipe > 0 && gone < 1 && <g opacity={1 - gone}><rect x={PX + 20} y={rowY(1)} width={220} height={52} rx={12} fill={SC.error} /><text x={PX + 222} y={rowY(1) + 31} textAnchor="end" fontSize={13} fontWeight={800} fill="#fff">Remove</text></g>}
        {ITEMS.map((it, k) => {
          if (k === 1 && removed >= 1) return null;
          const x = PX + 20 + (k === 1 ? -140 * swipe : 0);
          const y = k === 3 && drag > 0 ? lerp(PY + 70 + 3 * 62, PY + 346, drag) : rowY(k);
          return <g key={it.n} opacity={k === 1 ? 1 - removed : 1}><Row x={x} y={y} name={it.n} qty={it.q} tone={it.c} lift={k === 3 ? lift : 0} twin={twin} /></g>;
        })}
        {drag > 0 && drag < 1 && <Finger x={PX + 140} y={lerp(PY + 70 + 3 * 62, PY + 346, drag) + 10} />}
        {t >= 10.4 && t < 13 && !reset && <Finger x={PX + 200 - 140 * swipe} y={rowY(1) + 10} o={1 - p(t, 12.4, 12.9)} />}
        {/* pinch the spinach */}
        {zoom > 0 && (
          <g>
            <rect x={PX} y={PY} width={260} height={460} rx={30} fill={SC.surface} opacity={0.9 * zoom} />
            <Produce x={PX + 130 - 18 * lerp(1, 5, zoom)} y={PY + 220 - 18 * lerp(1, 5, zoom)} s={lerp(1, 5, zoom)} tone="#2D6A4F" />
            <Finger x={PX + 100 - 50 * zoom} y={PY + 200 - 60 * zoom} o={zoom} /><Finger x={PX + 160 + 50 * zoom} y={PY + 240 + 60 * zoom} o={zoom} />
          </g>
        )}
        {/* the ⋯ menu on okra */}
        {menu > 0 && (
          <g opacity={menu} transform={`translate(${PX + 96} ${rowY(1) + 44})`}>
            <rect width={150} height={74} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
            <text x={14} y={28} fontSize={13} fontWeight={800} fill={SC.error}>Remove</text>
            <text x={14} y={56} fontSize={13} fontWeight={800} fill={SC.text}>Move to next week</text>
          </g>
        )}
        {t >= 29 && (
          <g opacity={p(t, 29.4, 29.9)} transform={`translate(${PX + 16} ${lerp(PY + 470, PY + 404, back(p(t, 29.4, 30)))})`}>
            <rect width={228} height={44} rx={12} fill={SC.text} />
            <text x={16} y={27} fontSize={13} fontWeight={800} fill={SC.surface}>Okra removed</text>
            <text x={186} y={27} fontSize={13} fontWeight={900} fill={SC.mint}>Undo</text>
          </g>
        )}
      </g>

      {/* captions */}
      {[{ a: 4, b: 10, h: 'Drag the thing itself', s: 'The row follows her finger. A gap shows where it lands.' }, { a: 10, b: 15, h: 'Swipe to remove', s: 'The row slides under her thumb, Remove behind it.' }, { a: 15, b: 19, h: 'Pinch to look closer', s: 'Fresh spinach, or not? Two fingers, and it fills the screen.' }].map(c => t >= c.a && t < c.b && (
        <g key={c.a} transform="translate(470 140)" opacity={p(t, c.a, c.a + 0.5) * (1 - p(t, c.b - 0.4, c.b))}>
          <rect width={400} height={96} rx={16} fill={SC.surface} stroke={SC.mint} strokeWidth={2} />
          <text x={22} y={40} fontSize={20} fontWeight={900} fill={SC.text}>{c.h}</text>
          <text x={22} y={70} fontSize={14} fontWeight={700} fill={SC.muted}>{c.s}</text>
        </g>
      ))}
      {t >= 19 && t < 24 && (
        <g transform="translate(470 120)" opacity={p(t, 19.4, 20) * (1 - p(t, 23.4, 24))}>
          <rect width={400} height={150} rx={18} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
          <text x={22} y={38} fontSize={13} fontWeight={800} fill={SC.muted}>Asha aunty, 62, same screen</text>
          <text x={22} y={70} fontSize={17} fontWeight={800} fill={SC.text}>“How do I take the okra off?”</text>
          <text x={22} y={100} fontSize={14} fontWeight={700} fill={SC.muted}>Nothing on the row says “swipe me”.</text>
          <text x={22} y={130} fontSize={15} fontWeight={800} fill={SC.error} opacity={p(t, 21.4, 22)}>Calling Mandi support…</text>
        </g>
      )}
      {t >= 24 && (
        <g transform="translate(470 110)" opacity={p(t, 24.2, 24.8)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Every gesture gets a visible twin</text>
          {['Swipe to remove → ⋯ Remove', 'Drag to next week → ⋯ Move to next week', 'Kilos → − and + buttons', 'Pinch the photo → tap it to see it big', ...(t >= 29 ? ['Accidents → Undo'] : [])].map((s, k) => (
            <text key={s} y={40 + k * 32} fontSize={15} fontWeight={700} fill={SC.text} opacity={k === 4 ? p(t, 29.6, 30.2) : p(t, 24.6 + k * 0.6, 25.1 + k * 0.6)}><tspan fill={SC.mint}>✓ </tspan>{s}</text>
          ))}
          {t >= 31 && <text y={230} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 31, 31.6)}>Gestures are shortcuts, never the only way.</text>}
        </g>
      )}
    </svg>
  );
}
