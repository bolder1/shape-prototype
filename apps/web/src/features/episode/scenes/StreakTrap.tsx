'use client';
// Scene for gr.4-3: Riyaaz's streak lifts opens while singing falls (`STREAK_LAUNCH`). Meera names Goodhart's law,
// points the game at the skill, makes it informational (`SDT_NEEDS`), cuts what sells loss or chance, and rebuilds
// the mechanics (`RIYAAZ_MECHANICS`, `rewardCall`). Pure function of t (0–36). Also exports `REWARD_FILL`, which
// `reward-pick` uses.
import { RIYAAZ_MECHANICS, SDT_NEEDS, STREAK_LAUNCH, rewardCall, type RewardCall, type RiyaazMechanic } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per call; white text on each passes 4.5:1. */
export const REWARD_FILL: Record<RewardCall, string> = { keep: '#067647', retarget: '#175CD3', soften: '#6941C6', cut: '#B42318' };

const KEYS = Object.keys(RIYAAZ_MECHANICS) as RiyaazMechanic[];
const of = (c: RewardCall) => KEYS.filter(k => rewardCall(RIYAAZ_MECHANICS[k]) === c);
const NEED_LABEL: Record<(typeof SDT_NEEDS)[number], string> = { competence: 'Competence', autonomy: 'Autonomy', relatedness: 'Relatedness' };

/** A flame, base at (x, y). `broken` greys it out. */
function Flame({ x, y, s = 1, broken = false }: { x: number; y: number; s?: number; broken?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C-26 0 -30 -26 -16 -44 C-14 -30 -6 -28 -4 -34 C-6 -50 4 -64 14 -70 C10 -52 30 -42 28 -20 C28 -8 16 0 0 0 Z" fill={broken ? SC.muted : '#E04F16'} />
    </g>
  );
}

export function StreakTrapScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The streak ships' : t < 11 ? 'One minute of drone' : t < 16 ? 'Goodhart’s law' : t < 21 ? 'Inform, don’t control' : t < 26 ? 'Never sell the loss' : t < 31 ? 'The new game' : 'A month later';
  const [opens, minutes, tune] = STREAK_LAUNCH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Riyaaz launches a practice streak, and against a holdout daily opens rise from ${opens.holdout} to ${opens.streak}. But minutes sung per open fall from ${minutes.holdout} to ${minutes.streak}, and notes in tune stay at ${tune.streak}%: people let the tanpura play for a minute to save the streak, then leave. Goodhart’s law: when a measure becomes a target, it stops being a good measure. Meera makes the game support competence, autonomy and relatedness, with a goal the student sets, rest days and a freeze. She cuts ${of('cut').map(k => RIYAAZ_MECHANICS[k].short.toLowerCase()).join(', ')}. The new game counts a practice day after ten minutes the tracker can hear, shows a shruti map and the teacher’s mark. A month later minutes per open are back to 15 and notes in tune rise from 71% to 76%.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <g opacity={p(t, 0.3, 1)}>
              <Flame x={150} y={230} s={1.8} />
              <text x={150} y={290} fontSize={36} fontWeight={900} fill={SC.text} textAnchor="middle">{Math.round(lerp(1, 41, p(t, 0.8, 3.4)))} days</text>
            </g>
            <g opacity={p(t, 3, 3.8)}>
              <text x={330} y={120} fontSize={21} fontWeight={800} fill={SC.muted}>Daily opens vs holdout</text>
              <rect x={330} y={140} width={opens.holdout * 2.2} height={40} rx={6} fill={SC.muted} />
              <rect x={330} y={196} width={opens.streak * 2.2 * p(t, 3.4, 4.6)} height={40} rx={6} fill={REWARD_FILL.keep} />
              <text x={330} y={268} fontSize={24} fontWeight={900} fill={REWARD_FILL.keep}>+{opens.streak - opens.holdout}%</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {[minutes, tune].map((m, i) => {
              const max = i === 0 ? 16 : 100;
              const k = p(t, 6.4 + i * 1.2, 7.4 + i * 1.2);
              return (
                <g key={m.metric} opacity={clamp(k * 2)}>
                  <text x={32} y={96 + i * 118} fontSize={21} fontWeight={800} fill={SC.text}>{m.metric}</text>
                  {(['holdout', 'streak'] as const).map((arm, j) => (
                    <g key={arm}>
                      <rect x={200} y={110 + i * 118 + j * 38} width={(m[arm] / max) * 300 * k} height={30} rx={6} fill={j ? SC.error : SC.muted} />
                      <text x={212 + (m[arm] / max) * 300 * k} y={133 + i * 118 + j * 38} fontSize={21} fontWeight={900} fill={SC.text}>{m[arm]}{m.unit === '%' ? '%' : ''}</text>
                      <text x={32} y={133 + i * 118 + j * 38} fontSize={21} fontWeight={700} fill={SC.muted}>{j ? 'Streak' : 'Holdout'}</text>
                    </g>
                  ))}
                </g>
              );
            })}
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <rect x={32} y={74} width={576} height={110} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={56} y={118} fontSize={21} fontWeight={800} fill={SC.text}>When a measure becomes a target,</text>
            <text x={56} y={152} fontSize={21} fontWeight={800} fill={SC.text}>it stops being a good measure.</text>
            {([['Counted', 'Opening the app', SC.error], ['Should count', 'Singing the tracker hears', REWARD_FILL.keep]] as const).map(([head, what, fill], i) => (
              <g key={head} opacity={p(t, 12.6 + i * 1.2, 13.2 + i * 1.2)}>
                <text x={32 + i * 296} y={228} fontSize={21} fontWeight={800} fill={SC.muted}>{head}</text>
                <rect x={32 + i * 296} y={242} width={280} height={56} rx={28} fill={fill} />
                <text x={172 + i * 296} y={278} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{what}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            {SDT_NEEDS.map((n, i) => {
              const m = of('keep').find(k => RIYAAZ_MECHANICS[k].need === n);
              return (
                <g key={n} opacity={p(t, 16.3 + i * 1, 16.9 + i * 1)}>
                  <circle cx={120 + i * 200} cy={150} r={72} fill={REWARD_FILL.keep} opacity={0.14} stroke={REWARD_FILL.keep} strokeWidth={2} />
                  <text x={120 + i * 200} y={157} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">{NEED_LABEL[n]}</text>
                  {m && <text x={120 + i * 200} y={262} fontSize={21} fontWeight={800} fill={REWARD_FILL.keep} textAnchor="middle">{RIYAAZ_MECHANICS[m].short}</text>}
                </g>
              );
            })}
            <text x={320} y={316} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle" opacity={p(t, 19.2, 19.8)}>Rest days and a freeze keep the streak alive</text>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {of('cut').map((k, i) => {
              const strike = p(t, 22 + i * 1, 22.6 + i * 1);
              return (
                <g key={k} opacity={p(t, 21.2 + i * 0.3, 21.7 + i * 0.3)}>
                  <rect x={32} y={70 + i * 88} width={576} height={74} rx={12} fill={SC.surface} stroke={REWARD_FILL.cut} strokeWidth={2} />
                  <text x={52} y={115 + i * 88} fontSize={21} fontWeight={800} fill={SC.text}>{RIYAAZ_MECHANICS[k].short}</text>
                  <line x1={48} y1={108 + i * 88} x2={lerp(48, 300, strike)} y2={108 + i * 88} stroke={REWARD_FILL.cut} strokeWidth={3} />
                  <rect x={480} y={90 + i * 88} width={110} height={34} rx={17} fill={REWARD_FILL.cut} opacity={strike} />
                  <text x={535} y={114 + i * 88} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle" opacity={strike}>Cut</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            <rect x={32} y={66} width={576} height={270} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={56} y={104} fontSize={21} fontWeight={800} fill={SC.muted}>Today · Yaman alankar</text>
            {Array.from({ length: 12 }, (_, i) => {
              const off = [0, 2, -1, 0, 6, 0, -2, 1, 0, -7, 0, 1][i];
              const k = p(t, 26.4 + i * 0.12, 26.8 + i * 0.12);
              const bad = Math.abs(off) > 4;
              return <rect key={i} x={60 + i * 44} y={170 - off * 5} width={34} height={14} rx={7} fill={bad ? SC.error : REWARD_FILL.keep} opacity={k} />;
            })}
            <line x1={56} y1={177} x2={584} y2={177} stroke={SC.line} strokeWidth={2} strokeDasharray="4 6" />
            {([['Practice day counted', '10 min sung'], ['Teacher’s mark', 'Learnt: 2 of 3 takes']] as const).map(([a, b], i) => (
              <g key={a} opacity={p(t, 28 + i * 0.9, 28.6 + i * 0.9)}>
                <text x={56} y={250 + i * 40} fontSize={21} fontWeight={800} fill={SC.text}>{a}</text>
                <text x={584} y={250 + i * 40} fontSize={21} fontWeight={900} fill={REWARD_FILL.keep} textAnchor="end">{b}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 31 && (
          <g>
            {([['Minutes sung per open', `${minutes.streak}`, '15'], ['Notes in tune', `${tune.streak}%`, '76%'], ['Paid streak repairs', '—', 'None']] as const).map(([label, a, b], i) => (
              <g key={label} opacity={p(t, 31.2 + i * 0.8, 31.8 + i * 0.8)}>
                <rect x={32} y={66 + i * 88} width={576} height={74} rx={12} fill={SC.surface} stroke={REWARD_FILL.keep} strokeWidth={2} />
                <text x={52} y={111 + i * 88} fontSize={21} fontWeight={800} fill={SC.text}>{label}</text>
                <text x={588} y={111 + i * 88} fontSize={24} fontWeight={900} fill={REWARD_FILL.keep} textAnchor="end">{a === '—' ? b : `${a} → ${b}`}</text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
