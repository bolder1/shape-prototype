'use client';
// Scene for rs.2-1: an interview that opens with "What do you think of our app?" fizzles in five minutes. Then the script
// is drawn as a funnel (intro, warm-up, broad, deep dive, wrap-up), each band lighting up with a real line. Pure function of t (0–34).
import { TimerIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const BANDS = [
  { n: 'Intro', line: '“About 45 minutes, no wrong answers. OK to record?”', at: 12, c: SC.discover },
  { n: 'Warm-up', line: '“Tell me about a normal weekday.”', at: 14.5, c: SC.discover },
  { n: 'Broad', line: '“How do you keep track of bills?”', at: 18, c: SC.design },
  { n: 'Deep dive', line: '“Walk me through the last time a payment went wrong.”', at: 21, c: SC.build },
  { n: 'Wrap-up', line: '“Anything I should have asked?”', at: 25, c: SC.mint },
];
const TOP = 80, BH = 70, CX = 300;

export function ScriptShapeScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const funnel = t >= 6;
  const active = [...BANDS].reverse().find(b => t >= b.at);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the shape of an interview script">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the bad interview */}
        {!funnel && (
          <g>
            <g transform={`translate(260 170) scale(${clamp(back((t - 0.3) / 0.5))})`}>
              <rect x={-190} y={-34} width={380} height={68} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text y={7} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.text}>“What do you think of our app?”</text>
            </g>
            {t >= 1.8 && (
              <g transform={`translate(680 280) scale(${clamp(back((t - 1.8) / 0.5))})`}>
                <rect x={-150} y={-34} width={300} height={68} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text y={7} textAnchor="middle" fontSize={18} fontWeight={700} fontStyle="italic" fill={SC.muted}>“It’s… nice, I guess.”</text>
              </g>
            )}
            {t >= 3.2 && (
              <g transform="translate(480 420)" opacity={clamp((t - 3.2) / 0.4)}>
                <TimerIcon x={-130} y={-26} width={36} height={36} color={SC.error} weight="duotone" />
                <text x={-84} y={0} fontSize={20} fontWeight={900} fill={SC.error}>Done in 5 minutes.</text>
              </g>
            )}
          </g>
        )}

        {/* the funnel */}
        {funnel && BANDS.map((b, i) => {
          const wTop = lerp(440, 160, i / BANDS.length), wBot = lerp(440, 160, (i + 1) / BANDS.length);
          const y = TOP + i * BH, show = clamp(back((t - 6.2 - i * 0.3) / 0.4));
          const on = active === b, done = t >= b.at;
          return (
            <g key={b.n} opacity={show}>
              <path d={`M${CX - wTop / 2} ${y} L${CX + wTop / 2} ${y} L${CX + wBot / 2} ${y + BH - 6} L${CX - wBot / 2} ${y + BH - 6} Z`}
                fill={done ? b.c : SC.surface} fillOpacity={on ? 0.9 : done ? 0.35 : 1} stroke={b.c} strokeWidth={2} />
              <text x={CX} y={y + BH / 2 + 3} textAnchor="middle" fontSize={16} fontWeight={800} fill={on ? '#fff' : SC.text}>{b.n}</text>
            </g>
          );
        })}
        {funnel && t < 12 && <text x={720} y={270} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.text} opacity={clamp((t - 7.5) / 0.5)}>Wide at the top, narrow where the stories are</text>}
        {active && (
          <g key={active.n} transform={`translate(560 ${TOP + BANDS.indexOf(active) * BH + 6}) scale(${clamp(back((t - active.at) / 0.4))})`}>
            <line x1={-40} x2={0} y1={26} y2={26} stroke={active.c} strokeWidth={2} />
            <rect width={370} height={54} rx={14} fill={SC.surface} stroke={active.c} strokeWidth={2.5} />
            <foreignObject x={12} y={6} width={350} height={44}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3, fontStyle: 'italic' }}>{active.line}</div>
            </foreignObject>
          </g>
        )}
        {t >= 26 && t < 29 && <text x={745} y={490} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint} opacity={clamp((t - 26) / 0.4)}>Often the best answer of the hour</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'Trust first', l: 'Intro and warm-up', c: SC.discover }, { x: 480, n: 'Broad → deep', l: 'Their world, then a story', c: SC.build }, { x: 760, n: 'Wrap-up', l: '“What did I miss?”', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
