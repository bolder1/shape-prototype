'use client';
// Scene for ld.3-3: the design team's week fills up with rituals, 8 h 30 min for each designer. The CEO picks winners
// on Friday, so nobody brings rough work. Shalini asks three questions of each block (a reason? safe? an output?),
// cuts the stand-ups, the status sync and the Figma hour, makes the CEO walk-through, the bug channel and the scores
// safe, gives the PM review and the inspiration hour an output, and the week ends at 4 h 45 min with sketches back in
// critique. Pure function of t (0–36). Also exports `RITUAL_FILL` and `RITUAL_LABEL`, which `ritual-crit` uses.
import { hoursLabel, type RitualCall } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per call; white text on each passes 4.5:1. */
export const RITUAL_FILL: Record<RitualCall, string> = { keep: '#067647', reshape: '#175CD3', 'make-safe': '#B54708', cut: '#475467' };
export const RITUAL_LABEL: Record<RitualCall, string> = { keep: 'Keep', reshape: 'Reshape', 'make-safe': 'Make it safe', cut: 'Cut' };
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
type Block = { label: string; call: RitualCall };
const WEEK: Block[][] = [
  [{ label: 'Stand-up', call: 'cut' }, { label: 'Critique', call: 'keep' }, { label: '1:1', call: 'keep' }],
  [{ label: 'Stand-up', call: 'cut' }, { label: 'Review', call: 'reshape' }],
  [{ label: 'Stand-up', call: 'cut' }, { label: 'Sync', call: 'cut' }, { label: 'Figma', call: 'cut' }],
  [{ label: 'Stand-up', call: 'cut' }, { label: 'Kaarigar', call: 'keep' }],
  [{ label: 'Stand-up', call: 'cut' }, { label: 'Inspo', call: 'reshape' }, { label: 'CEO', call: 'make-safe' }],
];
/** How many blocks come before each day, for the order they pop in. */
const START = WEEK.map((_, d) => WEEK.slice(0, d).reduce((s, day) => s + day.length, 0));
const colX = (d: number) => 32 + d * 116;
const rowY = (r: number) => 100 + r * 50;

/** Minutes a week the counter shows at time t. */
const minutesAt = (t: number) =>
  t < 6 ? Math.round((510 * p(t, 0.4, 5)) / 15) * 15
    : t < 16 ? 510
      : t < 21 ? Math.round(lerp(510, 360, p(t, 16.6, 19))) : t < 26 ? Math.round(lerp(360, 315, p(t, 21.6, 23)))
        : t < 31 ? Math.round(lerp(315, 285, p(t, 26.6, 28))) : 285;

export function RitualWeekScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A full calendar' : t < 11 ? 'Only finished work' : t < 16 ? 'Three questions' : t < 21 ? 'Cut' : t < 26 ? 'Make it safe' : t < 31 ? 'Give it an output' : '4 h 45 min';
  const mins = minutesAt(t);
  const shown = (b: Block) => (b.call === 'cut' ? 1 - p(t, 16.4, 18) : 1);
  const tagged = (b: Block) => (b.call === 'cut' ? t >= 16 : b.call === 'make-safe' ? t >= 21 : b.call === 'reshape' ? t >= 26 : t >= 31);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the Kaarigar design team’s week fills with twelve rituals, 8 hours 30 minutes for each designer. Every Friday the CEO picks the version he likes, so designers bring only finished work to critique. Shalini asks three questions of each ritual: is there still a reason for it, is it safe to bring rough work, and does anything come out of it? She cuts the daily design stand-up that repeats the squad stand-ups, the status sync that repeats the Linear board and an old Figma hour. The CEO walk-through becomes a monthly showcase of shipped work, the bug channel stops naming designers, and critique scores go. The PM review gets a decisions log and the inspiration hour a patterns board. The week drops to 4 hours 45 minutes, and sketches come back to Monday critique.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>
        <text x={608} y={44} fontSize={24} fontWeight={900} fill={t >= 31 ? RITUAL_FILL.keep : SC.text} textAnchor="end">{hoursLabel(mins)}</text>

        {DAYS.map((d, i) => <text key={d} x={colX(i) + 8} y={86} fontSize={21} fontWeight={800} fill={SC.muted}>{d}</text>)}
        {WEEK.map((day, d) => day.map((b, r) => {
          const n = START[d] + r, k = p(t, 0.3 + n * 0.3, 0.7 + n * 0.3);
          const isCeo = b.call === 'make-safe';
          const alarm = isCeo && t >= 6 && t < 21;
          const lit = b.label === 'Critique' && t >= 31;
          const label = t >= 21 && isCeo ? 'Showcase' : b.label;
          return (
            <g key={`${d}-${r}`} opacity={k * shown(b)}>
              <rect x={colX(d)} y={rowY(r)} width={110} height={42} rx={8} fill={SC.surface}
                stroke={alarm ? SC.error : lit ? RITUAL_FILL.keep : SC.line} strokeWidth={alarm || lit ? 3 : 2} />
              <rect x={colX(d)} y={rowY(r)} width={7} height={42} rx={3} fill={RITUAL_FILL[b.call]} opacity={tagged(b) ? 1 : 0} />
              <text x={colX(d) + 14} y={rowY(r) + 29} fontSize={21} fontWeight={800} fill={SC.text}>{label}</text>
            </g>
          );
        }))}

        {t >= 6 && t < 11 && (
          <g opacity={p(t, 6.6, 7.2)}>
            <text x={32} y={300} fontSize={21} fontWeight={900} fill={SC.error}>Friday: the CEO picks a winner.</text>
            <text x={32} y={330} fontSize={21} fontWeight={800} fill={SC.text}>So Monday critique gets only finished work.</text>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            {(['A reason?', 'Safe?', 'An output?'] as const).map((q, i) => (
              <g key={q} opacity={p(t, 11.3 + i * 0.7, 11.8 + i * 0.7)}>
                <rect x={32 + i * 196} y={282} width={184} height={46} rx={12} fill={[RITUAL_FILL.cut, RITUAL_FILL['make-safe'], RITUAL_FILL.reshape][i]} />
                <text x={124 + i * 196} y={313} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{q}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <text x={32} y={318} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 18.4, 19)}>Squads have stand-ups. The board has status.</text>
        )}

        {t >= 21 && t < 26 && (
          <g opacity={p(t, 21.4, 22)}>
            <text x={32} y={290} fontSize={21} fontWeight={800} fill={SC.text}>#design-oops → #design-fixes, no names</text>
            <text x={32} y={322} fontSize={21} fontWeight={800} fill={SC.text}>Critique scores: gone</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {(['PM review: + a decisions log', 'Inspiration: + a patterns board', 'Offsite: + three owned bets'] as const).map((l, i) => (
              <text key={l} x={32} y={276 + i * 30} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 26.4 + i * 0.6, 27 + i * 0.6)}>{l}</text>
            ))}
          </g>
        )}

        {t >= 31 && (
          <g opacity={p(t, 31.4, 32)}>
            <text x={32} y={290} fontSize={21} fontWeight={900} fill={SC.text}>Half the time, and safer.</text>
            <text x={32} y={322} fontSize={21} fontWeight={800} fill={SC.muted}>Sketches are back in Monday critique.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
