'use client';
// Scene for ld.2-3: a whiteboard challenge. A panicked candidate draws a login screen first; then the board fills column
// by column: clarifying questions, the user and goal, three quick ideas with one circled, and measures with a trade-off.
// Pure function of t (0–34).
import { XIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
/** Whiteboard columns, in order, in colours that pass 4.5:1 on the white board. Shared with the Run the whiteboard game. */
export const COLUMNS = [
  { id: 'clarify', n: 'Clarify', c: '#1d4ed8' },
  { id: 'users', n: 'User & goal', c: '#b45309' },
  { id: 'ideas', n: 'Ideas', c: '#047857' },
  { id: 'measure', n: 'Measure', c: '#7c3aed' },
] as const;

const Sticky = ({ x, y, text, c, k }: { x: number; y: number; text: string[]; c: string; k: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${(text[0].length % 5) - 2}) scale(${clamp(back(k))})`}>
    <rect width={170} height={18 + text.length * 18} rx={6} fill={c} opacity={0.22} />
    <rect width={170} height={18 + text.length * 18} rx={6} fill="none" stroke={c} strokeWidth={1.5} />
    {text.map((l, i) => <text key={i} x={10} y={22 + i * 18} fontSize={12} fontWeight={700} fill="#1f2937">{l}</text>)}
  </g>
);

export function WhiteboardScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const panic = t < 6.4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a structured approach to a design whiteboard challenge">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <rect x={60} y={50} width={840} height={430} rx={16} fill="#ffffff" stroke={SC.line} strokeWidth={3} />
        <text x={84} y={84} fontSize={15} fontWeight={800} fill="#374151">“Design an app for parking.” · 45 min</text>

        {/* the panic start */}
        {panic && (
          <g opacity={1 - p(t, 5.8, 6.4)}>
            <rect x={380} y={130} width={180} height={300} rx={18} fill="none" stroke="#374151" strokeWidth={3} strokeDasharray={`${p(t, 0.4, 2.4) * 960} 960`} />
            {t >= 1.6 && <><rect x={410} y={250} width={120} height={22} rx={4} fill="none" stroke="#374151" strokeWidth={2} /><rect x={410} y={290} width={120} height={22} rx={4} fill="none" stroke="#374151" strokeWidth={2} /><text x={470} y={220} textAnchor="middle" fontSize={16} fontWeight={800} fill="#374151">Log in</text></>}
            {t >= 3 && (
              <g transform="translate(620 230)" opacity={clamp((t - 3) / 0.4)}>
                <circle r={20} fill={SC.error} /><XIcon x={-12} y={-12} width={24} height={24} color="#fff" weight="bold" />
                <text x={32} y={6} fontSize={15} fontWeight={800} fill={SC.error}>Who is this for? Which problem?</text>
              </g>
            )}
          </g>
        )}

        {/* the structured board */}
        {t >= 6 && t < 29.4 && (
          <g opacity={clamp((t - 6) / 0.5)}>
            {COLUMNS.map((col, i) => {
              const x = 84 + i * 205, at = [6.2, 12, 18, 24][i];
              return (
                <g key={col.id} opacity={t >= at ? 1 : 0.25}>
                  <text x={x} y={124} fontSize={15} fontWeight={800} fill={col.c}>{i + 1}. {col.n}</text>
                  <line x1={x} y1={134} x2={x + 180} y2={134} stroke={col.c} strokeWidth={2} />
                </g>
              );
            })}
            <Sticky x={84} y={150} text={['Who parks? Commuters,', 'shoppers, residents?']} c={COLUMNS[0].c} k={(t - 6.6) / 0.4} />
            <Sticky x={84} y={220} text={['Where? A metro station', 'in a busy city']} c={COLUMNS[0].c} k={(t - 7.6) / 0.4} />
            <Sticky x={84} y={290} text={['Hardest part today?', 'Circling for a spot']} c={COLUMNS[0].c} k={(t - 8.6) / 0.4} />
            {t >= 12 && <Sticky x={289} y={150} text={['Commuter, 8:30 train', 'every weekday']} c={COLUMNS[1].c} k={(t - 12.4) / 0.4} />}
            {t >= 12 && <Sticky x={289} y={220} text={['Goal: park in under', '5 min, no circling']} c={COLUMNS[1].c} k={(t - 13.4) / 0.4} />}
            {t >= 18 && ['Reserve ahead', 'Live map', 'Monthly pass'].map((idea, j) => (
              <g key={idea} transform={`translate(${494} ${150 + j * 80}) scale(${clamp(back((t - 18.4 - j * 0.6) / 0.4))})`}>
                <rect width={170} height={60} rx={8} fill="none" stroke="#374151" strokeWidth={2} />
                <rect x={10} y={10} width={50} height={40} rx={4} fill="none" stroke="#9ca3af" strokeWidth={1.5} />
                <text x={70} y={36} fontSize={13} fontWeight={700} fill="#374151">{idea}</text>
                {j === 0 && t >= 20.6 && <ellipse cx={85} cy={30} rx={96} ry={42} fill="none" stroke={SC.mint} strokeWidth={3} strokeDasharray={`${p(t, 20.6, 21.4) * 460} 460`} />}
              </g>
            ))}
            {t >= 24 && <Sticky x={699} y={150} text={['Success: time to park', 'under 5 minutes']} c={COLUMNS[3].c} k={(t - 24.4) / 0.4} />}
            {t >= 24 && <Sticky x={699} y={220} text={['Trade-off: reserving', 'costs extra, so show', 'the price up front']} c={COLUMNS[3].c} k={(t - 25.4) / 0.4} />}
            <text x={480} y={460} textAnchor="middle" fontSize={15} fontWeight={800} fill="#047857" opacity={t >= 9.4 ? 1 : 0}>Thinking out loud at every step</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Clarify', l: 'Who · where · what’s hard', c: SC.discover }, { x: 480, n: 'Decide', l: 'Ideas, then a choice', c: SC.design }, { x: 760, n: 'Measure', l: 'Success and trade-offs', c: SC.mint }].map((f, i) => {
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
