'use client';
// Scene for dc.4-2: Chakki's cart sheet animates top and stutters on a ₹9,000 phone. A frame has 16.7 ms
// (`FRAME_MS`) for script, style, layout, paint and composite; animating geometry redoes layout and paint every frame
// and runs over; transform leaves only compositing. Then the two bugs only code has: an exit that never plays because
// React unmounts at once, and a keyframe animation that jumps back to its start when tapped again, beside a
// transition that reverses from where it is. Last, reduced motion swaps the slide for a fade. Pure function of t
// (0–36). Also exports `FIX_FILL`, which `anim-fix` uses.
import { FRAME_MS, type AnimFix } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per fix; white text on each passes 4.5:1. */
export const FIX_FILL: Record<AnimFix, string> = { ship: '#067647', transform: '#B42318', exit: '#6941C6', interrupt: '#175CD3' };
const MS = FRAME_MS.toFixed(1);

/** The browser's work in one frame, as stacked blocks; ms widths are illustrative, the budget line is real. */
const STAGES = [['Script', 3, '#175CD3'], ['Style', 2, '#6941C6'], ['Layout', 9, '#B42318'], ['Paint', 7, '#B54708'], ['Composite', 2, '#067647']] as const;
const X0 = 32, PX = 22;   // px per ms

function Strip({ y, bad, k }: { y: number; bad: (i: number) => boolean; k: number }) {
  return (
    <g>
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={32 + i * 36} y={y} width={30} height={30} rx={6} fill={bad(i) ? SC.error : FIX_FILL.ship} opacity={k > i / 16 ? 1 : 0.15} />
      ))}
    </g>
  );
}

export function FrameBudgetScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'It stutters' : t < 11 ? `${MS} ms a frame` : t < 16 ? 'Layout every frame' : t < 21 ? 'Move the layer' : t < 26 ? 'Let it leave' : t < 31 ? 'Start from here' : 'Ask the person';

  const frame = (stages: readonly (readonly [string, number, string])[], k: number, y: number) => {
    let x = X0;
    return stages.map(([name, ms, fill], i) => {
      const w = ms * PX * clamp(k * stages.length - i);
      const el = (
        <g key={name}>
          <rect x={x} y={y} width={Math.max(0, w - 2)} height={44} rx={6} fill={fill} />
          {w > 60 && <text x={x + 8} y={y + 29} fontSize={21} fontWeight={900} fill="#fff">{name}</text>}
        </g>
      );
      x += ms * PX * clamp(k * stages.length - i);
      return el;
    });
  };
  const budgetX = X0 + FRAME_MS * PX;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Chakki’s cart sheet animates top from 100% to 40% and stutters on a ₹9,000 Redmi phone, dropping frames. At 60 frames a second the browser has ${MS} milliseconds a frame for script, style, layout, paint and composite. Animating top changes geometry, so layout and paint run every frame and the work goes over the budget. Switching to transform: translateY leaves only compositing, and every frame fits. Then two bugs only code has: React removes a toast in the same render that hides it, so its exit never plays, until AnimatePresence keeps it mounted; and a keyframe animation tapped again jumps back to its start, while a transition reverses from where it is. Last, with prefers-reduced-motion the sheet fades in place instead of sliding.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <text x={32} y={92} fontSize={21} fontWeight={800} fill={SC.text} fontFamily="ui-monospace, monospace">transition: top 300ms</text>
            <text x={32} y={128} fontSize={21} fontWeight={800} fill={SC.muted}>Frames on a Redmi 12, one per box</text>
            <Strip y={148} bad={i => i % 3 !== 0} k={p(t, 0.8, 3.4)} />
            <text x={32} y={240} fontSize={22} fontWeight={900} fill={SC.error} opacity={p(t, 3.6, 4.2)}>Most frames miss: the sheet stutters.</text>
            <text x={32} y={280} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 4.4, 5)}>Smooth in Figma, and on a MacBook.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <text x={32} y={92} fontSize={21} fontWeight={800} fill={SC.muted}>1000 ms ÷ 60 frames</text>
            <line x1={budgetX} y1={110} x2={budgetX} y2={200} stroke={SC.text} strokeWidth={3} strokeDasharray="6 5" opacity={p(t, 6.3, 6.9)} />
            <text x={budgetX} y={226} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle" opacity={p(t, 6.3, 6.9)}>{MS} ms</text>
            {frame([['Script', 3, '#175CD3'], ['Style', 2, '#6941C6'], ['Layout', 3, '#B42318'], ['Paint', 3, '#B54708'], ['Composite', 2, '#067647']], p(t, 7, 9), 136)}
            <text x={32} y={290} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 9.2, 9.8)}>Everything for one frame has to fit before the line.</text>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <text x={32} y={92} fontSize={21} fontWeight={800} fill={SC.muted}>Animating top: geometry changes each frame</text>
            {frame(STAGES, p(t, 11.3, 13.4), 136)}
            <line x1={budgetX} y1={110} x2={budgetX} y2={200} stroke={SC.text} strokeWidth={3} strokeDasharray="6 5" />
            <text x={budgetX} y={226} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">{MS} ms</text>
            <text x={32} y={290} fontSize={22} fontWeight={900} fill={SC.error} opacity={p(t, 13.8, 14.4)}>Layout and paint, every frame: over budget.</text>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            <text x={32} y={92} fontSize={21} fontWeight={800} fill={SC.text} fontFamily="ui-monospace, monospace">transform: translateY(0)</text>
            {frame([['Script', 3, '#175CD3'], ['Style', 2, '#6941C6'], ['Composite', 2, '#067647']], p(t, 16.3, 17.6), 120)}
            <line x1={budgetX} y1={104} x2={budgetX} y2={176} stroke={SC.text} strokeWidth={3} strokeDasharray="6 5" />
            <text x={32} y={204} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 17.6, 18.2)}>The compositor moves a layer already painted.</text>
            <Strip y={226} bad={() => false} k={p(t, 18.2, 20)} />
            <text x={32} y={300} fontSize={22} fontWeight={900} fill={FIX_FILL.ship} opacity={p(t, 19.6, 20.2)}>Every frame fits.</text>
          </g>
        )}

        {t >= 21 && t < 26 && (() => {
          const hide = p(t, 22, 22.2), slide = p(t, 23.2, 24.6);
          return (
            <g>
              <text x={32} y={92} fontSize={21} fontWeight={800} fill={SC.text} fontFamily="ui-monospace, monospace">{'{show && <Toast />}'}</text>
              <rect x={32} y={108} width={276} height={52} rx={12} fill={FIX_FILL.exit} opacity={1 - hide} />
              <text x={52} y={142} fontSize={21} fontWeight={900} fill="#fff" opacity={1 - hide}>Added to cart</text>
              <text x={32} y={190} fontSize={21} fontWeight={800} fill={SC.error} opacity={hide}>Gone in one render. No exit.</text>
              <text x={332} y={92} fontSize={21} fontWeight={800} fill={SC.text} fontFamily="ui-monospace, monospace" opacity={p(t, 22.6, 23)}>AnimatePresence</text>
              <g opacity={p(t, 22.6, 23) * (1 - slide)} transform={`translate(0 ${lerp(0, 40, slide)})`}>
                <rect x={332} y={108} width={276} height={52} rx={12} fill={FIX_FILL.exit} />
                <text x={352} y={142} fontSize={21} fontWeight={900} fill="#fff">Added to cart</text>
              </g>
              <text x={332} y={230} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 24.6, 25.2)}>Kept mounted until</text>
              <text x={332} y={258} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 24.6, 25.2)}>its exit finishes.</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (() => {
          const go = p(t, 26.4, 27.6), tap = 27.6;
          // Keyframes: on the second tap, jumps to the open end, then plays closing. Transition: turns round where it is.
          const kf = t < tap ? go * 0.6 : t < tap + 0.05 ? 1 : 1 - p(t, tap + 0.05, tap + 1.4);
          const tr = t < tap ? go * 0.6 : 0.6 * (1 - p(t, tap, tap + 1));
          const track = (y: number, v: number, label: string, fill: string) => (
            <g>
              <text x={32} y={y - 18} fontSize={21} fontWeight={800} fill={SC.text}>{label}</text>
              <line x1={52} y1={y + 14} x2={588} y2={y + 14} stroke={SC.line} strokeWidth={4} strokeLinecap="round" />
              <circle cx={lerp(52, 588, v)} cy={y + 14} r={16} fill={fill} />
            </g>
          );
          return (
            <g>
              {track(110, kf, '@keyframes panel-in / panel-out', SC.error)}
              {track(210, tr, 'transition: transform 250ms', FIX_FILL.interrupt)}
              <text x={32} y={300} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, tap - 0.2, tap)}>Tapped again half-way.</text>
              <text x={32} y={330} fontSize={21} fontWeight={900} fill={SC.text} opacity={p(t, 29, 29.6)}>Keyframes jump. A transition turns round.</text>
            </g>
          );
        })()}

        {t >= 31 && (() => {
          const k = p(t, 31.8, 33);
          return (
            <g>
              <text x={32} y={92} fontSize={21} fontWeight={800} fill={SC.text} fontFamily="ui-monospace, monospace">prefers-reduced-motion</text>
              <text x={32} y={130} fontSize={21} fontWeight={800} fill={SC.muted}>Default</text>
              <rect x={32} y={lerp(300, 148, k)} width={276} height={300 - lerp(300, 148, k)} rx={12} fill={FIX_FILL.interrupt} />
              <text x={332} y={130} fontSize={21} fontWeight={800} fill={SC.muted}>Reduce</text>
              <rect x={332} y={148} width={276} height={152} rx={12} fill={FIX_FILL.interrupt} opacity={k} />
              <text x={32} y={334} fontSize={21} fontWeight={900} fill={SC.text} opacity={p(t, 33.4, 34)}>Same sheet. A fade instead of a slide.</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
