'use client';
// Scene for bz.2-1: Neha's first Saman deck runs in the order the work happened (`NEHA_FIRST_DECK`): the playhead
// crawls through research, personas and wireframes, the COO reaches for his phone, and the problem lands at 5:30,
// past the five-minute line, with no ask (`pitchFlaws`). Then the rebuild: `SAMAN_BEATS` slot onto the story spine,
// situation, complication, resolution, ask, while a timeline (`pitchTimeline`) fills against `PITCH_SECONDS` with the
// first-minute mark (`PROBLEM_BY`). The process slides fly into the appendix. Pure function of t (0–36).
// Also exports the part colours, `PART_NAME` and `clock` for `story-strip`.
import { NEHA_FIRST_DECK, PITCH_PARTS, PITCH_SECONDS, PROBLEM_BY, SAMAN_BEATS, pitchFlaws, pitchLength, pitchOrder, pitchTimeline, type PitchPart, type SamanBeat } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { wrap } from './Measure';

const W = 960, H = 540;
export const PART_COLOR: Record<PitchPart | 'process', string> = {
  situation: SC.discover, complication: SC.error, resolution: SC.grow, ask: SC.build, process: SC.muted,
};
export const PART_NAME: Record<PitchPart, string> = { situation: 'Situation', complication: 'Complication', resolution: 'Resolution', ask: 'Ask' };
/** Seconds as m:ss. */
export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

const KEYS = pitchOrder(Object.keys(SAMAN_BEATS) as SamanBeat[], k => SAMAN_BEATS[k].part);
const NEW_LINE = pitchTimeline(KEYS.map(k => SAMAN_BEATS[k]));
const OLD_LINE = pitchTimeline(NEHA_FIRST_DECK);
const OLD_FLAWS = pitchFlaws(NEHA_FIRST_DECK);
const SCALE = 1.9;   // px per second on the timelines (400 s fits in 760 px)

function Timeline({ line, y, upto }: { line: ReturnType<typeof pitchTimeline>; y: number; upto: number }) {
  return (
    <g transform={`translate(100 ${y})`}>
      <rect width={400 * SCALE} height={26} rx={6} fill={SC.surface} stroke={SC.line} />
      {line.map((l, i) => {
        const w = Math.max(0, Math.min(l.end, upto) - l.start) * SCALE;
        return w > 0 ? <rect key={i} x={l.start * SCALE} y={2} width={Math.max(0, w - 2)} height={22} rx={4} fill={PART_COLOR[l.beat.part]} opacity={0.85} /> : null;
      })}
      {[{ s: PROBLEM_BY, n: '1:00 the problem by here' }, { s: PITCH_SECONDS, n: '5:00 time’s up' }].map(m => (
        <g key={m.s}>
          <line x1={m.s * SCALE} x2={m.s * SCALE} y1={-8} y2={34} stroke={SC.text} strokeWidth={2} strokeDasharray="4 3" />
          <text x={m.s * SCALE + 6} y={-10} fontSize={13} fontWeight={800} fill={SC.muted}>{m.n}</text>
        </g>
      ))}
    </g>
  );
}

export function StorySpineScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const head = t < 6 ? 'Five minutes on Monday' : t < 11 ? 'The room drifts' : t < 31 ? 'The story spine' : 'Process to the appendix';
  // Playhead through the old deck: 6 → 11 s of scene covers 0 → 380 s of pitch.
  const oldAt = p(t, 6, 10.6) * pitchLength(NEHA_FIRST_DECK);
  // New beats arrive one by one from 11 s, about 2.4 s apart.
  const shown = Math.floor(clamp((t - 11) / 19.5) * KEYS.length + (t >= 11 ? 1 : 0));
  const newAt = shown ? NEW_LINE[Math.min(shown, KEYS.length) - 1].end : 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Neha's first Saman deck runs in the order the work happened, research plan, interviews, personas and wireframes, so the problem arrives at ${clock(OLD_LINE.find(l => l.beat.part === 'complication')!.start)}, past the five-minute mark, and there is no ask. The rebuild follows a story spine: situation, Ramesh restocking his kirana on a Sunday night; complication, 19 minutes in the app and 38% of carts never sent; resolution, last week's order sent in three taps, tested at 4 minutes; and the ask, two engineers for six weeks. It runs ${clock(pitchLength(KEYS.map(k => SAMAN_BEATS[k])))}, and the process slides move to the appendix.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{head}</text>

        {t < 11 && (
          <g>
            <g transform="translate(100 110)">
              {NEHA_FIRST_DECK.map((b, i) => {
                const x = i * 112, on = oldAt >= OLD_LINE[i].start && oldAt < OLD_LINE[i].end;
                return (
                  <g key={i} transform={`translate(${x} 0)`} opacity={p(t, 0.3 + i * 0.4, 0.8 + i * 0.4)}>
                    <rect width={100} height={74} rx={6} fill={SC.surface} stroke={on ? SC.text : SC.line} strokeWidth={on ? 3 : 1} />
                    <rect x={0} y={0} width={6} height={74} rx={3} fill={PART_COLOR[b.part]} />
                    {wrap(b.text, 14).slice(0, 3).map((ln, j) => <text key={j} x={12} y={22 + j * 16} fontSize={12} fontWeight={800} fill={SC.text}>{ln}</text>)}
                  </g>
                );
              })}
              <text x={0} y={110} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 3.2, 3.8)}>Seven slides in the order the work happened. The problem is second from last.</text>
            </g>
            {t >= 6 && <Timeline line={OLD_LINE} y={300} upto={oldAt} />}
            {t >= 6 && (
              <g transform="translate(100 370)">
                <text x={0} y={0} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 7.6, 8.2)}>Minute three: Vikram is reading his phone.</text>
                <g transform="translate(0 26)" opacity={p(t, 9.4, 10)}>
                  {OLD_FLAWS.map((f, i) => (
                    <g key={f} transform={`translate(${i * 190} 0)`}>
                      <rect width={176} height={34} rx={17} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
                      <text x={88} y={22} textAnchor="middle" fontSize={14} fontWeight={900} fill={SC.text}>{{ long: '6:20, over time', late: 'Problem at 5:30', process: 'Mostly process', noask: 'No ask' }[f]}</text>
                    </g>
                  ))}
                </g>
              </g>
            )}
          </g>
        )}

        {t >= 11 && (
          <g>
            <g transform="translate(60 90)">
              {PITCH_PARTS.map((part, col) => (
                <g key={part} transform={`translate(${col * 214} 0)`}>
                  <rect width={200} height={30} rx={8} fill={SC.surface} stroke={PART_COLOR[part]} strokeWidth={2} />
                  <text x={100} y={20} textAnchor="middle" fontSize={14} fontWeight={900} fill={SC.text}>{PART_NAME[part]}</text>
                  {KEYS.filter(k => SAMAN_BEATS[k].part === part).map((k, row) => {
                    const idx = KEYS.indexOf(k);
                    if (idx >= shown) return null;
                    const a = clamp(back((t - 11 - idx * 2.44) / 0.6));
                    return (
                      <g key={k} transform={`translate(0 ${44 + row * 108 + (1 - a) * -24})`} opacity={a}>
                        <rect width={200} height={98} rx={10} fill={SC.surface} stroke={SC.line} />
                        <rect width={6} height={98} rx={3} fill={PART_COLOR[part]} />
                        {wrap(SAMAN_BEATS[k].text, 26).slice(0, 5).map((ln, j) => <text key={j} x={14} y={20 + j * 16} fontSize={12} fontWeight={700} fill={SC.text}>{ln}</text>)}
                      </g>
                    );
                  })}
                </g>
              ))}
            </g>
            <Timeline line={NEW_LINE} y={420} upto={newAt} />
            <text x={100} y={480} fontSize={16} fontWeight={800} fill={SC.text}>{clock(newAt)} of 5:00</text>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(560 458)" opacity={p(t, 31.4, 32)}>
            <rect width={300} height={70} rx={12} fill={SC.surface} stroke={SC.line} strokeDasharray="6 4" />
            <text x={16} y={28} fontSize={14} fontWeight={900} fill={SC.text}>Appendix, for questions</text>
            {NEHA_FIRST_DECK.filter(b => b.part === 'process').map((b, i) => (
              <g key={i} transform={`translate(${16 + i * 70} ${36 + (1 - p(t, 31.6 + i * 0.4, 32.4 + i * 0.4)) * -200})`}>
                <rect width={62} height={24} rx={4} fill={SC.soft} stroke={SC.line} />
                <rect width={4} height={24} rx={2} fill={SC.muted} />
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
