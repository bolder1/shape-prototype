'use client';
// Scene for gr.4-1: Riyaaz's retention has stalled and the growth team wants a spin wheel. Meera plots every behaviour
// on the habit zone (`RIYAAZ_BEHAVIOURS`, `habitCall`), anchors the cue in Sunita's morning, builds the practice loop
// (`PRACTICE_LOOP`), waits out the weeks a habit takes (`habitFormed`) and measures it with the L28 curve
// (`RIYAAZ_L28`). Pure function of t (0–36). Also exports `HABIT_FILL` and `zoneX`, which `habit-zone` uses to draw the
// same plot.
import { HABIT_DAYS, HABIT_MIN_PER_WEEK, L28_BUCKETS, PRACTICE_LOOP, RIYAAZ_BEHAVIOURS, RIYAAZ_L28, habitCall, habitFormed, type HabitCall, type RiyaazBehaviour } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per call; white text on each passes 4.5:1. */
export const HABIT_FILL: Record<HabitCall, string> = { loop: '#067647', moment: '#175CD3', leave: '#B42318' };
/** Times a week on a log scale, as 0–1 across the plot: once a year at the left, 20 a week at the right. */
export const zoneX = (perWeek: number) => clamp((Math.log10(Math.max(perWeek, 0.02)) - Math.log10(0.02)) / (Math.log10(20) - Math.log10(0.02)));

const KEYS = Object.keys(RIYAAZ_BEHAVIOURS) as RiyaazBehaviour[];
const WEEKS = [2, 3, 4, 5, 4, 5];
/** Words to lines of at most `n` characters. */
const wrap = (s: string, n: number) => s.split(' ').reduce<string[]>((ls, w) => {
  const last = ls[ls.length - 1];
  if (last !== undefined && (last + ' ' + w).length <= n) ls[ls.length - 1] = last + ' ' + w; else ls.push(w);
  return ls;
}, []);

export function PracticeLoopScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Stuck at 31%' : t < 11 ? 'The habit zone' : t < 16 ? 'An anchor, not an alarm' : t < 22 ? 'The loop' : t < 27 ? 'Sixty-six days' : t < 32 ? 'Measure the habit' : 'And the outcome';
  const px = (perWeek: number) => 150 + zoneX(perWeek) * 450;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Riyaaz’s second-month retention is stuck at 31%, and the growth team proposes a daily spin wheel. Meera plots every behaviour by how often people do it and whether it helps them sing. Only useful behaviours done at least ${HABIT_MIN_PER_WEEK} time a week get a habit loop: ${KEYS.filter(k => habitCall(RIYAAZ_BEHAVIOURS[k]) === 'loop').map(k => RIYAAZ_BEHAVIOURS[k].short.toLowerCase()).join(', ')}. Sunita practises after her morning chai, so the tanpura opens tuned to her Sa at seven. The loop: ${PRACTICE_LOOP.map(s => `${s.part}: ${s.text}`).join('. ')}. Her practice days per week go ${WEEKS.join(', ')}, and after four weeks at ${HABIT_DAYS} or more the habit has formed. On the L28 curve, students practising 22 to 28 days of the last 28 rise from ${RIYAAZ_L28.before[3]}% to ${RIYAAZ_L28.after[3]}%. Habits formed rise from 14% to 22% of new students, and the spin wheel never ships.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <text x={32} y={84} fontSize={21} fontWeight={800} fill={SC.muted}>Students still practising, by month</text>
            {[100, 46, 31, 31, 31].map((v, i) => {
              const k = p(t, 0.4 + i * 0.4, 1.2 + i * 0.4);
              const h = (v / 100) * 170 * k;
              return (
                <g key={i}>
                  <rect x={40 + i * 64} y={290 - h} width={44} height={h} rx={6} fill={i >= 2 ? SC.error : SC.brand} opacity={0.85} />
                  <text x={62 + i * 64} y={284 - h} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle" opacity={k}>{v}</text>
                  <text x={62 + i * 64} y={320} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">M{i}</text>
                </g>
              );
            })}
            <g opacity={p(t, 3, 3.8)} transform="translate(388 110)">
              <rect width={220} height={170} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={110} y={36} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">Proposal</text>
              <g transform={`translate(110 98) rotate(${t * 90})`}>
                {[0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M0 0 L${38 * Math.cos((i * Math.PI) / 3)} ${38 * Math.sin((i * Math.PI) / 3)} A38 38 0 0 1 ${38 * Math.cos(((i + 1) * Math.PI) / 3)} ${38 * Math.sin(((i + 1) * Math.PI) / 3)} Z`} fill={i % 2 ? '#B42318' : '#175CD3'} opacity={0.85} />)}
              </g>
              <text x={110} y={160} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">Daily spin</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {(['Helps the singer', 'Only our numbers'] as const).map((r, i) => (
              <g key={r}>
                <rect x={150} y={70 + i * 120} width={450} height={104} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
                {wrap(r, 10).map((l, j) => <text key={j} x={32} y={116 + i * 120 + j * 24} fontSize={21} fontWeight={800} fill={SC.text}>{l}</text>)}
              </g>
            ))}
            <rect x={px(HABIT_MIN_PER_WEEK)} y={70} width={600 - px(HABIT_MIN_PER_WEEK)} height={104} rx={12} fill={HABIT_FILL.loop} opacity={0.18 * p(t, 9, 9.8)} />
            <line x1={px(HABIT_MIN_PER_WEEK)} y1={62} x2={px(HABIT_MIN_PER_WEEK)} y2={300} stroke={SC.text} strokeWidth={2} strokeDasharray="6 6" />
            <text x={150} y={330} fontSize={21} fontWeight={800} fill={SC.muted}>← yearly</text>
            <text x={px(HABIT_MIN_PER_WEEK) + 8} y={330} fontSize={21} fontWeight={800} fill={SC.muted}>weekly+</text>
            <text x={600} y={330} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">daily →</text>
            {KEYS.map((k, i) => {
              const b = RIYAAZ_BEHAVIOURS[k];
              const jitter = ((i * 37) % 5 - 2) * 12;
              return <circle key={k} cx={px(b.perWeek)} cy={(b.useful ? 122 : 242) + jitter} r={9} fill={HABIT_FILL[habitCall(b)]} opacity={p(t, 6.4 + i * 0.2, 6.9 + i * 0.2)} />;
            })}
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <line x1={60} y1={180} x2={580} y2={180} stroke={SC.line} strokeWidth={4} strokeLinecap="round" />
            {([['6:30', 'Wakes', 80], ['6:50', 'Chai', 260], ['7:00', 'Riyaz', 440]] as const).map(([time, what, x], i) => {
              const k = p(t, 11.3 + i * 1, 12 + i * 1);
              const main = i === 2;
              return (
                <g key={time} opacity={k}>
                  <circle cx={x} cy={180} r={main ? 16 : 11} fill={main ? HABIT_FILL.loop : SC.muted} />
                  <text x={x} y={146} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">{time}</text>
                  <text x={x} y={224} fontSize={21} fontWeight={800} fill={main ? HABIT_FILL.loop : SC.muted} textAnchor="middle">{what}</text>
                </g>
              );
            })}
            <g opacity={p(t, 13.6, 14.4)} transform="translate(300 250)">
              <rect width={300} height={74} rx={14} fill={SC.surface} stroke={HABIT_FILL.loop} strokeWidth={2} />
              <text x={20} y={32} fontSize={21} fontWeight={900} fill={SC.text}>Tanpura · Sa = C#</text>
              <text x={20} y={60} fontSize={21} fontWeight={700} fill={SC.muted}>The time she chose</text>
            </g>
            <text x={32} y={290} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 14, 14.6)}>After chai,</text>
            <text x={32} y={316} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 14, 14.6)}>I practise.</text>
          </g>
        )}

        {t >= 16 && t < 22 && (() => {
          const step = Math.min(3, Math.floor((t - 16) / 1.4));
          const spin = p(t, 16, 21.6) * 360;
          const cx = 150, cy = 200, r = 92;
          const lines = wrap(PRACTICE_LOOP[step].text, 26).slice(0, 4);
          return (
            <g>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={SC.line} strokeWidth={6} />
              <circle cx={cx + r * Math.cos(((spin - 90) * Math.PI) / 180)} cy={cy + r * Math.sin(((spin - 90) * Math.PI) / 180)} r={9} fill={HABIT_FILL.loop} />
              {PRACTICE_LOOP.map((s, i) => {
                const a = ((i * 90 - 90) * Math.PI) / 180;
                const on = i === step;
                return (
                  <g key={s.part}>
                    <rect x={cx + r * Math.cos(a) - 60} y={cy + r * Math.sin(a) - 17} width={120} height={34} rx={17} fill={on ? HABIT_FILL.loop : SC.surface} stroke={HABIT_FILL.loop} strokeWidth={2} />
                    <text x={cx + r * Math.cos(a)} y={cy + r * Math.sin(a) + 7} fontSize={21} fontWeight={800} fill={on ? '#fff' : SC.text} textAnchor="middle">{s.part}</text>
                  </g>
                );
              })}
              <g key={step} opacity={p(t, 16 + step * 1.4, 16.5 + step * 1.4)}>
                <text x={300} y={110} fontSize={24} fontWeight={900} fill={HABIT_FILL.loop}>{PRACTICE_LOOP[step].part}</text>
                {lines.map((l, j) => <text key={j} x={300} y={148 + j * 28} fontSize={21} fontWeight={700} fill={SC.text}>{l}</text>)}
              </g>
            </g>
          );
        })()}

        {t >= 22 && t < 27 && (
          <g>
            <text x={32} y={84} fontSize={21} fontWeight={800} fill={SC.muted}>Sunita’s practice days, week by week</text>
            <line x1={40} y1={290 - HABIT_DAYS * 28} x2={600} y2={290 - HABIT_DAYS * 28} stroke={SC.text} strokeWidth={2} strokeDasharray="6 6" />
            <text x={600} y={282 - HABIT_DAYS * 28} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">{HABIT_DAYS} days</text>
            {WEEKS.map((d, i) => {
              const k = p(t, 22.3 + i * 0.5, 22.9 + i * 0.5);
              const h = d * 28 * k;
              return (
                <g key={i}>
                  <rect x={56 + i * 88} y={290 - h} width={56} height={h} rx={6} fill={d >= HABIT_DAYS ? HABIT_FILL.loop : SC.muted} />
                  <text x={84 + i * 88} y={320} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">W{i + 1}</text>
                </g>
              );
            })}
            {habitFormed(WEEKS) && (
              <g opacity={p(t, 25.4, 26)}>
                <rect x={232} y={98} width={376} height={44} rx={22} fill={HABIT_FILL.loop} />
                <text x={420} y={128} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">Four weeks at {HABIT_DAYS}+: a habit</text>
              </g>
            )}
          </g>
        )}

        {t >= 27 && t < 32 && (
          <g>
            <text x={32} y={84} fontSize={21} fontWeight={800} fill={SC.muted}>Share of students by days practised in 28</text>
            {L28_BUCKETS.map((b, i) => {
              const k = p(t, 27.3, 28.6), k2 = p(t, 29, 30.2);
              const before = RIYAAZ_L28.before[i], after = RIYAAZ_L28.after[i];
              const v = lerp(before, after, k2);
              const h = v * 3 * k;
              return (
                <g key={b}>
                  <rect x={60 + i * 140} y={290 - h} width={90} height={h} rx={6} fill={i === 3 ? HABIT_FILL.loop : SC.brand} opacity={0.9} />
                  <text x={105 + i * 140} y={282 - h} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">{Math.round(v)}%</text>
                  <text x={105 + i * 140} y={320} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">{b.replace(' days', '')}</text>
                </g>
              );
            })}
            <text x={608} y={84} fontSize={21} fontWeight={900} fill={HABIT_FILL.loop} textAnchor="end" opacity={k2Label(t)}>after</text>
          </g>
        )}

        {t >= 32 && (
          <g>
            {([['Habit formed', '14%', '22%'], ['Teacher marks / month', '1.1', '1.6']] as const).map(([label, a, b], i) => (
              <g key={label} opacity={p(t, 32.2 + i * 0.8, 32.8 + i * 0.8)}>
                <rect x={32} y={70 + i * 84} width={576} height={70} rx={12} fill={SC.surface} stroke={HABIT_FILL.loop} strokeWidth={2} />
                <text x={52} y={113 + i * 84} fontSize={21} fontWeight={800} fill={SC.text}>{label}</text>
                <text x={588} y={113 + i * 84} fontSize={24} fontWeight={900} fill={HABIT_FILL.loop} textAnchor="end">{a} → {b}</text>
              </g>
            ))}
            <g opacity={p(t, 34, 34.6)}>
              <rect x={32} y={246} width={576} height={70} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={52} y={289} fontSize={21} fontWeight={800} fill={SC.muted}>Daily spin wheel</text>
              <text x={588} y={289} fontSize={24} fontWeight={900} fill={HABIT_FILL.leave} textAnchor="end">Not shipped</text>
              <line x1={48} y1={282} x2={lerp(48, 230, p(t, 34.6, 35.4))} y2={282} stroke={HABIT_FILL.leave} strokeWidth={3} />
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}

const k2Label = (t: number) => p(t, 29, 30.2);
