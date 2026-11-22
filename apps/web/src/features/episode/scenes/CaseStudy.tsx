'use client';
// Scene for ld.2-1: a portfolio that's just a gallery of screens gets 40 seconds and a close; then a case study builds up
// section by section: a one-line summary, context and role, three decisions, the solution and the outcome (38% → 21%).
// Pure function of t (0–34).
import { ClockIcon, XCircleIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
/** Case study sections and their colours. Shared with the Build the case study game. */
export const SECTIONS = [
  { id: 'context', n: 'Context', c: SC.discover },
  { id: 'process', n: 'Process', c: SC.design },
  { id: 'solution', n: 'Solution', c: SC.mint },
  { id: 'outcome', n: 'Outcome', c: SC.grow },
] as const;

export function CaseStudyScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const gallery = t < 6.4;
  const scroll = p(t, 0.6, 4.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a screen gallery versus a structured case study">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the gallery */}
        {gallery && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 5.8, 6.4))}>
            <clipPath id="cs-clip"><rect x={300} y={70} width={360} height={400} rx={18} /></clipPath>
            <rect x={300} y={70} width={360} height={400} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <g clipPath="url(#cs-clip)">
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x={320 + (i % 2) * 165} y={90 + Math.floor(i / 2) * 130 - scroll * 420} width={155} height={115} rx={10}
                  fill={['#93c5fd', '#fcd34d', '#a7f3d0', '#f9a8d4', '#c4b5fd', '#fdba74'][i % 6]} opacity={0.8} />
              ))}
            </g>
            <g transform="translate(700 120)"><ClockIcon x={0} y={0} width={30} height={30} color={SC.muted} weight="duotone" /><text x={40} y={22} fontSize={18} fontWeight={800} fill={SC.text}>{Math.max(0, 40 - Math.floor(t * 9))}s</text></g>
            {t >= 4.6 && <g transform="translate(700 200)" opacity={clamp((t - 4.6) / 0.4)}><XCircleIcon x={0} y={0} width={34} height={34} color={SC.error} weight="fill" /><text x={44} y={23} fontSize={15} fontWeight={800} fill={SC.error}>Closed. No story.</text></g>}
          </g>
        )}

        {/* the case study */}
        {t >= 6 && t < 29.4 && (
          <g opacity={clamp((t - 6) / 0.5)}>
            <rect x={200} y={50} width={560} height={450} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <g transform={`translate(230 92) scale(${clamp(back((t - 6.3) / 0.5))})`}>
              <text fontSize={19} fontWeight={800} fill={SC.text}>Cutting payment drop-off for a ride app</text>
              <text y={26} fontSize={13} fontWeight={600} fill={SC.muted}>Solo designer · 6 weeks · drop-off 38% → 21%</text>
            </g>
            {SECTIONS.map((s, i) => {
              const at = [11, 16, 22, 22.8][i], y = 150 + i * 84, on = t >= at;
              return (
                <g key={s.id} opacity={on ? clamp((t - at) / 0.5) : 0.25}>
                  <rect x={230} y={y} width={500} height={72} rx={12} fill={SC.soft} />
                  <rect x={230} y={y} width={8} height={72} rx={4} fill={s.c} />
                  <text x={252} y={y + 24} fontSize={14} fontWeight={800} fill={s.c}>{s.n}</text>
                  {i === 0 && on && <text x={252} y={y + 50} fontSize={13} fill={SC.text}>Riders abandoned 38% of bookings at payment. I owned the flow.</text>}
                  {i === 1 && on && ['Interviews', 'Journey map', '3 layouts tested'].map((d, j) => (
                    <g key={d} transform={`translate(${252 + j * 150} ${y + 36})`} opacity={clamp((t - 16.4 - j * 0.5) / 0.4)}>
                      <rect width={136} height={26} rx={13} fill={SC.surface} stroke={s.c} strokeWidth={1.5} />
                      <text x={68} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.text}>{d}</text>
                    </g>
                  ))}
                  {i === 2 && on && <text x={252} y={y + 50} fontSize={13} fill={SC.text}>One-tap UPI, with the fare locked before you pay.</text>}
                  {i === 3 && on && (
                    <g>
                      {[{ v: 38, x: 560 }, { v: 21, x: 640 }].map(b => <g key={b.v}><rect x={b.x} y={y + 64 - b.v} width={44} height={b.v} rx={4} fill={b.v === 21 ? SC.mint : SC.error} /><text x={b.x + 22} y={y + 60 - b.v} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.text}>{b.v}%</text></g>)}
                      <text x={252} y={y + 50} fontSize={13} fill={SC.text}>Payment drop-off, six weeks later</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Summary first', l: 'Problem · role · result', c: SC.discover }, { x: 480, n: 'A clear shape', l: 'Context → outcome', c: SC.design }, { x: 760, n: 'Decisions', l: 'Not every screen', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
