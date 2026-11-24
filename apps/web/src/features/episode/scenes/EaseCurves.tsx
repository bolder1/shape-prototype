'use client';
// Scene for pr.2-1: Kiran taps Tuesday's rajma chawal in Dabba and the meal sheet rises. Linear (one speed, a dead stop),
// then ease-in (dawdles, then slams), then ease-out (answers at once, lands softly), each with its frames drawn as a
// trail so you can see the spacing. Then the curve as a graph with its two handles, the sheet leaving on ease-in, a meal
// moving from Tuesday to Wednesday on ease in-out, and linear kept for the spinner and the dragging thumb. `CurvePlot`
// and `DabbaWeek` are shared with the Pick the curve game. Curves come from `EASE_CURVES` via `bezierAt`.
// Pure function of t (0–34).
import { bezierAt, bezierCss, EASE_CURVES, type Ease } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const MONO = 'ui-monospace, Consolas, monospace';
/** Dabba's brand orange. White on it is 5.7:1. */
export const DABBA = '#B4410F';
export const DABBA_SOFT = '#FDEBDD';
export const INK = '#1D2939';
export const INK_MUTED = '#475467';
export const EASE_NAME: Record<Ease, string> = { out: 'Ease out', in: 'Ease in', inout: 'Ease in-out', linear: 'Linear' };
export const EASE_TONE: Record<Ease, string> = { out: SC.discover, in: SC.build, inout: SC.grow, linear: SC.muted };

/** A loop of one motion: `move` seconds moving, then a hold, every `period` seconds from `start`. Returns time 0 → 1. */
export const loopX = (t: number, start: number, move = 1, period = 1.8) => clamp((((t - start) % period) + period) % period / move);

/** An easing curve as a graph: time along, progress up, with its bezier handles, a dot at time `k`, and optional frame ticks. */
export function CurvePlot({ ease, x, y, size, k, handles = true, ticks = false, color, label = true }: {
  ease: Ease; x: number; y: number; size: number; k?: number; handles?: boolean; ticks?: boolean; color?: string; label?: boolean;
}) {
  const c = EASE_CURVES[ease], col = color ?? EASE_TONE[ease];
  const px = (u: number) => u * size, py = (v: number) => size - v * size;
  const d = Array.from({ length: 41 }, (_, i) => { const u = i / 40; return `${i ? 'L' : 'M'}${px(u).toFixed(1)} ${py(bezierAt(c, u)).toFixed(1)}`; }).join(' ');
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={size} height={size} rx={6} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
      {[0.25, 0.5, 0.75].map(g => <g key={g}><line x1={px(g)} x2={px(g)} y1={0} y2={size} stroke={SC.line} strokeOpacity={0.6} /><line y1={py(g)} y2={py(g)} x1={0} x2={size} stroke={SC.line} strokeOpacity={0.6} /></g>)}
      {handles && ease !== 'linear' && (
        <g>
          <line x1={px(0)} y1={py(0)} x2={px(c[0])} y2={py(c[1])} stroke={col} strokeWidth={1.5} strokeDasharray="4 3" />
          <line x1={px(1)} y1={py(1)} x2={px(c[2])} y2={py(c[3])} stroke={col} strokeWidth={1.5} strokeDasharray="4 3" />
          <circle cx={px(c[0])} cy={py(c[1])} r={5} fill={SC.surface} stroke={col} strokeWidth={2} />
          <circle cx={px(c[2])} cy={py(c[3])} r={5} fill={SC.surface} stroke={col} strokeWidth={2} />
        </g>
      )}
      <path d={d} fill="none" stroke={col} strokeWidth={Math.max(2.5, size / 60)} strokeLinecap="round" />
      {ticks && Array.from({ length: 9 }, (_, i) => { const u = i / 8, v = bezierAt(c, u); return <circle key={i} cx={px(u)} cy={py(v)} r={3.2} fill={col} opacity={0.55} />; })}
      {k !== undefined && <circle cx={px(clamp(k))} cy={py(bezierAt(c, clamp(k)))} r={Math.max(5, size / 30)} fill={col} stroke={SC.surface} strokeWidth={2} />}
      {label && <>
        <text x={size / 2} y={size + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.muted}>time →</text>
        <text x={-10} y={size / 2} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.muted} transform={`rotate(-90 -10 ${size / 2})`}>progress →</text>
      </>}
    </g>
  );
}

const DAYS = [['Mon', 'Veg pulao'], ['Tue', 'Rajma chawal'], ['Wed', ''], ['Thu', 'Curd rice'], ['Fri', 'Pick a meal']] as const;

/** Dabba's week screen in a 240 × 440 phone. `move` (0 → 1) slides Tuesday's meal down into Wednesday. */
export function DabbaWeek({ x, y, move = 0, dim = 0 }: { x: number; y: number; move?: number; dim?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={240} height={440} rx={28} fill="#FFFFFF" stroke={SC.line} strokeWidth={2} />
      <text x={22} y={44} fontSize={11} fontWeight={800} fill={DABBA}>DABBA</text>
      <text x={22} y={70} fontSize={18} fontWeight={900} fill={INK}>This week</text>
      {DAYS.map(([d, m], i) => (
        <g key={d} transform={`translate(16 ${90 + i * 62})`}>
          <rect width={208} height={52} rx={12} fill={i === 2 ? '#F9FAFB' : '#FFFFFF'} stroke="#EAECF0" strokeWidth={1.5} strokeDasharray={i === 2 || i === 4 ? '4 3' : undefined} />
          <text x={14} y={31} fontSize={11} fontWeight={800} fill={INK_MUTED}>{d}</text>
          {i !== 1 && <text x={52} y={31} fontSize={12.5} fontWeight={700} fill={i === 4 ? INK_MUTED : INK}>{m}</text>}
        </g>
      ))}
      {/* Tuesday's meal chip, moving down a slot */}
      <g transform={`translate(64 ${90 + 62 + 10 + move * 62})`}>
        <rect width={148} height={32} rx={9} fill={DABBA_SOFT} stroke={DABBA} strokeWidth={1.5} />
        <circle cx={16} cy={16} r={8} fill={DABBA} opacity={0.75} />
        <text x={30} y={21} fontSize={12} fontWeight={800} fill={INK}>Rajma chawal</text>
      </g>
      <rect width={240} height={440} rx={28} fill="#101828" opacity={dim * 0.35} />
    </g>
  );
}

/** The meal sheet, its top edge `open` (0 → 1) of the way up a 240 × 440 phone. */
function MealSheet({ open }: { open: number }) {
  const top = lerp(440, 170, open);
  return (
    <g transform={`translate(0 ${top})`}>
      <rect width={240} height={300} rx={22} fill="#FFFFFF" stroke="#D0D5DD" strokeWidth={1.5} />
      <rect x={100} y={10} width={40} height={4} rx={2} fill="#D0D5DD" />
      <rect x={18} y={26} width={204} height={88} rx={14} fill={DABBA_SOFT} />
      <circle cx={120} cy={70} r={30} fill={DABBA} opacity={0.7} /><circle cx={120} cy={70} r={18} fill="#7A2E0E" opacity={0.6} />
      <text x={18} y={140} fontSize={16} fontWeight={900} fill={INK}>Rajma chawal</text>
      <text x={18} y={160} fontSize={11.5} fontWeight={700} fill={INK_MUTED}>₹99 · Tuesday · Veg</text>
      <rect x={18} y={176} width={204} height={40} rx={12} fill={DABBA} />
      <text x={120} y={201} textAnchor="middle" fontSize={13} fontWeight={800} fill="#FFFFFF">Add to Tuesday</text>
    </g>
  );
}

/** The phone with the sheet on `ease`, `x` (0 → 1) through its motion, and the frames of that motion as faint lines. */
function SheetPhone({ ease, x, leaving, trail }: { ease: Ease; x: number; leaving?: boolean; trail: boolean }) {
  const c = EASE_CURVES[ease];
  const open = leaving ? 1 - bezierAt(c, x) : bezierAt(c, x);
  return (
    <g>
      <DabbaWeek x={0} y={0} dim={open} />
      <clipPath id="ease-phone"><rect width={240} height={440} rx={28} /></clipPath>
      <g clipPath="url(#ease-phone)">
        {trail && Array.from({ length: 9 }, (_, i) => {
          const v = bezierAt(c, i / 8), top = lerp(440, 170, leaving ? 1 - v : v);
          return <line key={i} x1={20} x2={220} y1={top} y2={top} stroke={EASE_TONE[ease]} strokeWidth={2} opacity={0.6} />;
        })}
        <MealSheet open={open} />
      </g>
    </g>
  );
}

const SEGS: { at: number; ease: Ease; leaving?: boolean; verdict: string; good: boolean }[] = [
  { at: 0, ease: 'linear', verdict: 'Starts with a jolt, stops dead', good: false },
  { at: 5, ease: 'in', verdict: 'Dawdles, then slams into place', good: false },
  { at: 10, ease: 'out', verdict: 'Answers at once, lands softly', good: true },
  { at: 15, ease: 'out', verdict: 'Steep start, flat finish', good: true },
  { at: 20, ease: 'in', leaving: true, verdict: 'Leaving: gets out of the way', good: true },
  { at: 25, ease: 'inout', verdict: 'Speeds up, slows into Wednesday', good: true },
];

export function EaseCurvesScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const seg = [...SEGS].reverse().find(s => t >= s.at)!;
  const x = loopX(t, seg.at + 0.4, 1, 1.8);
  const fin = p(t, 29, 29.6);
  const moving = seg.at === 25;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Dabba's meal sheet rises on linear, ease-in and ease-out curves, then the curve is shown as a graph, the sheet leaves on ease-in, a meal moves on ease in-out, and linear is kept for loops">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g transform={`translate(80 ${lerp(60, 50, intro)})`} opacity={intro * (1 - fin)}>
        {moving ? <DabbaWeek x={0} y={0} move={bezierAt(EASE_CURVES.inout, x)} /> : <SheetPhone ease={seg.ease} x={x} leaving={seg.leaving} trail={t < 15 || t >= 20} />}
      </g>

      <g transform="translate(400 60)" opacity={intro * (1 - fin)}>
        <text x={0} y={0} fontSize={13} fontWeight={800} fill={SC.muted}>{seg.leaving ? 'Closing the sheet' : moving ? 'Swapping Tuesday to Wednesday' : 'Opening the sheet'}</text>
        <text x={0} y={34} fontSize={28} fontWeight={900} fill={SC.text}>{EASE_NAME[seg.ease]}</text>
        <text x={0} y={60} fontSize={15} fontWeight={700} fill={seg.good ? SC.text : SC.error}>{seg.good ? '✓ ' : '✗ '}{seg.verdict}</text>
        <CurvePlot ease={seg.ease} x={20} y={90} size={260} k={x} handles={t >= 15} ticks={t < 15 || t >= 20} />
        {t >= 15 && t < 20 && (
          <g transform="translate(310 100)" opacity={p(t, 15.2, 15.8)}>
            <rect width={210} height={150} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
            <text x={16} y={30} fontSize={12} fontWeight={900} fill={SC.text}>In CSS</text>
            <text x={16} y={54} fontSize={11} fontWeight={700} fill={EASE_TONE.out} fontFamily={MONO}>{bezierCss('out')}</text>
            <text x={16} y={84} fontSize={11.5} fontWeight={700} fill={SC.muted}>Two handles bend the line</text>
            <text x={16} y={102} fontSize={11.5} fontWeight={700} fill={SC.muted}>from (0, 0) to (1, 1).</text>
            <text x={16} y={128} fontSize={11.5} fontWeight={700} fill={SC.muted} opacity={p(t, 16.5, 17)}>Steep = fast. Flat = slow.</text>
          </g>
        )}
        {(t < 15 || t >= 20) && (
          <text x={310} y={130} fontSize={11.5} fontWeight={700} fill={SC.muted} opacity={0.9}>
            <tspan x={310} dy={0}>Each dot and line is one</tspan>
            <tspan x={310} dy={16}>slice of time. Far apart</tspan>
            <tspan x={310} dy={16}>means fast.</tspan>
          </text>
        )}
      </g>

      {t >= 29 && (
        <g opacity={fin}>
          <text x={W / 2} y={70} textAnchor="middle" fontSize={24} fontWeight={900} fill={SC.text}>Pick the curve from where it starts and ends</text>
          {([['out', 'Arriving', 'sheets, toasts, dialogs'], ['in', 'Leaving', 'closing, dismissing'], ['inout', 'Moving across', 'from one slot to another'], ['linear', 'Loops and fingers', 'spinners, dragging']] as const).map(([e, a, b], i) => (
            <g key={e} transform={`translate(${80 + i * 210} 110)`} opacity={p(t, 29.3 + i * 0.35, 29.8 + i * 0.35)}>
              <CurvePlot ease={e} x={20} y={0} size={150} k={loopX(t, 29.5, 1.2, 2)} handles={false} label={false} />
              <text x={95} y={186} textAnchor="middle" fontSize={16} fontWeight={900} fill={SC.text}>{EASE_NAME[e]}</text>
              <text x={95} y={208} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>{a}</text>
              <text x={95} y={226} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={SC.muted}>{b}</text>
            </g>
          ))}
          <g transform="translate(270 400)" opacity={p(t, 31, 31.6)}>
            <rect width={420} height={64} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
            <g transform={`translate(44 32) rotate(${((t - 29) * 360) % 360})`}>
              <circle r={14} fill="none" stroke={SC.line} strokeWidth={4} />
              <path d="M0 -14 A14 14 0 0 1 14 0" fill="none" stroke={DABBA} strokeWidth={4} strokeLinecap="round" />
            </g>
            <text x={76} y={28} fontSize={13} fontWeight={800} fill={SC.text}>The UPI spinner turns at one speed.</text>
            <text x={76} y={46} fontSize={12} fontWeight={700} fill={SC.muted}>A dragged sheet moves exactly with the thumb.</text>
          </g>
        </g>
      )}
    </svg>
  );
}
