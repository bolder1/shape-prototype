'use client';
// Scene for gr.4-2: Riyaaz sends each student 24 notifications a week and 11% switch them off. Meera critiques every
// draft in order (`RIYAAZ_NUDGES`, `nudgeCall`): pressure, whose need, the moment (quiet hours, `IGNORE_LIMIT`), then
// sets one budget (`NUDGE_WEEKLY_CAP`, `NUDGE_WEEK`). Pure function of t (0–36). Also exports `NUDGE_FILL` and
// `clock`, which `nudge-crit` uses.
import { IGNORE_LIMIT, NUDGE_WEEK, NUDGE_WEEKLY_CAP, QUIET_FROM, QUIET_TO, RIYAAZ_NUDGES, nudgeCall, type NudgeCall, type RiyaazNudge } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per call; white text on each passes 4.5:1. */
export const NUDGE_FILL: Record<NudgeCall, string> = { send: '#067647', pressure: '#B42318', noise: '#6941C6', hold: '#175CD3' };
/** 23.7 → "23:42". */
export const clock = (hour: number) => `${String(Math.floor(hour)).padStart(2, '0')}:${String(Math.round((hour % 1) * 60)).padStart(2, '0')}`;

const KEYS = Object.keys(RIYAAZ_NUDGES) as RiyaazNudge[];
const of = (c: NudgeCall) => KEYS.filter(k => nudgeCall(RIYAAZ_NUDGES[k]) === c);
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);
const STACK = ['Practice reminder', 'New lesson!', 'Pro at ₹99, 10 min left', 'We miss you!', 'Rate us 5 stars', 'Your streak is at risk'];

export function NudgeWeekScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? '24 a week' : t < 11 ? 'The off switch' : t < 16 ? 'Does it pressure?' : t < 21 ? 'Whose need?' : t < 26 ? 'Is it the moment?' : t < 31 ? 'One budget' : 'A quarter later';
  const before = sum(NUDGE_WEEK.before.perDay), after = sum(NUDGE_WEEK.after.perDay);
  const hx = (h: number) => 40 + (h / 24) * 560;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: an active Riyaaz student gets ${before} notifications a week, from every team. ${NUDGE_WEEK.before.optOut}% of students switch notifications off in a month, and their teacher’s notes go quiet too. Meera checks every draft in order. Pressure first: ${of('pressure').map(k => RIYAAZ_NUDGES[k].short).join(', ')} are dropped. Whose need: ${of('noise').map(k => RIYAAZ_NUDGES[k].short).join(', ')} serve Riyaaz and move into the app. The moment: nothing that can wait goes out between ${QUIET_FROM}:00 and ${QUIET_TO}:00, and after ${IGNORE_LIMIT} ignored reminders of one kind Riyaaz stops and asks. One budget: at most ${NUDGE_WEEKLY_CAP} a week that the student didn’t cause. A quarter later she gets ${after} a week, opt-outs are down to ${NUDGE_WEEK.after.optOut}%, and 90-day retention is up 4 points against the holdout.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <rect x={32} y={64} width={300} height={280} rx={24} fill="#101828" />
            {STACK.map((s, i) => {
              const k = p(t, 0.3 + i * 0.5, 0.8 + i * 0.5);
              return (
                <g key={s} opacity={k} transform={`translate(46 ${lerp(60, 80 + i * 42, k)})`}>
                  <rect width={272} height={36} rx={10} fill="#fff" opacity={0.94} />
                  <text x={12} y={25} fontSize={21} fontWeight={700} fill="#101828">{s.length > 22 ? s.slice(0, 21) + '…' : s}</text>
                </g>
              );
            })}
            <text x={360} y={110} fontSize={21} fontWeight={800} fill={SC.muted}>A week, by day</text>
            {NUDGE_WEEK.before.perDay.map((n, i) => {
              const h = n * 30 * p(t, 1 + i * 0.3, 1.6 + i * 0.3);
              return (
                <g key={i}>
                  <rect x={360 + i * 36} y={280 - h} width={26} height={h} rx={4} fill={SC.error} />
                  <text x={373 + i * 36} y={308} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">{DAYS[i]}</text>
                </g>
              );
            })}
            <text x={360} y={340} fontSize={24} fontWeight={900} fill={SC.text}>{Math.round(before * p(t, 1, 4.4))} this week</text>
          </g>
        )}

        {t >= 6 && t < 11 && (() => {
          const off = p(t, 7, 7.8);
          return (
            <g>
              <rect x={32} y={80} width={576} height={84} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={56} y={130} fontSize={24} fontWeight={900} fill={SC.text}>Allow notifications</text>
              <rect x={500} y={104} width={84} height={40} rx={20} fill={off > 0.5 ? SC.muted : NUDGE_FILL.send} />
              <circle cx={lerp(564, 520, off)} cy={124} r={16} fill="#fff" />
              <text x={32} y={220} fontSize={21} fontWeight={800} fill={SC.muted}>Students who switched off this month</text>
              <text x={32} y={270} fontSize={44} fontWeight={900} fill={SC.error}>{Math.round(NUDGE_WEEK.before.optOut * p(t, 7.4, 9))}%</text>
              <g opacity={p(t, 9, 9.6)}>
                <rect x={300} y={232} width={308} height={60} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={0.6} />
                <text x={320} y={270} fontSize={21} fontWeight={700} fill={SC.muted}>Asha-ji’s note: not seen</text>
              </g>
            </g>
          );
        })()}

        {t >= 11 && t < 16 && (
          <g>
            {of('pressure').map((k, i) => {
              const n = RIYAAZ_NUDGES[k];
              const strike = p(t, 12.4 + i * 0.9, 13 + i * 0.9);
              return (
                <g key={k} opacity={p(t, 11.2 + i * 0.4, 11.7 + i * 0.4)}>
                  <rect x={32} y={70 + i * 88} width={576} height={74} rx={12} fill={SC.surface} stroke={NUDGE_FILL.pressure} strokeWidth={2} />
                  <text x={52} y={115 + i * 88} fontSize={21} fontWeight={800} fill={SC.text}>{n.short}</text>
                  <rect x={420} y={90 + i * 88} width={170} height={34} rx={17} fill={NUDGE_FILL.pressure} opacity={strike} />
                  <text x={505} y={114 + i * 88} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle" opacity={strike}>{n.pressure}</text>
                  <line x1={48} y1={108 + i * 88} x2={lerp(48, 250, strike)} y2={108 + i * 88} stroke={NUDGE_FILL.pressure} strokeWidth={3} />
                </g>
              );
            })}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            {([['Sunita’s need', 'send', 32], ['Riyaaz’s need', 'noise', 336]] as const).map(([head, c, x], col) => (
              <g key={c}>
                <text x={x} y={90} fontSize={24} fontWeight={900} fill={NUDGE_FILL[c]}>{head}</text>
                {of(c).map((k, i) => (
                  <g key={k} opacity={p(t, 16.4 + col * 1.2 + i * 0.4, 16.9 + col * 1.2 + i * 0.4)}>
                    <rect x={x} y={108 + i * 64} width={272} height={50} rx={25} fill={NUDGE_FILL[c]} />
                    <text x={x + 136} y={140 + i * 64} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{RIYAAZ_NUDGES[k].short}</text>
                  </g>
                ))}
              </g>
            ))}
            <text x={336} y={326} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 19, 19.6)}>→ into the app</text>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            <rect x={40} y={110} width={560} height={40} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
            <rect x={hx(QUIET_FROM)} y={110} width={hx(24) - hx(QUIET_FROM)} height={40} fill={NUDGE_FILL.hold} opacity={0.25} />
            <rect x={hx(0)} y={110} width={hx(QUIET_TO) - hx(0)} height={40} fill={NUDGE_FILL.hold} opacity={0.25} />
            {[0, 6, 12, 18, 24].map(h => <text key={h} x={hx(h)} y={182} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">{h}</text>)}
            <text x={hx(QUIET_FROM)} y={96} fontSize={21} fontWeight={800} fill={NUDGE_FILL.hold}>Quiet</text>
            {(['lateNote', 'classMoved'] as const).map((k, i) => {
              const n = RIYAAZ_NUDGES[k];
              const m = p(t, 21.8 + i * 1, 22.8 + i * 1);
              return <circle key={k} cx={lerp(hx(n.hour), hx(QUIET_TO), m)} cy={130} r={11} fill={NUDGE_FILL.hold} />;
            })}
            <text x={32} y={236} fontSize={21} fontWeight={800} fill={SC.text}>Evening reminder, ignored:</text>
            {Array.from({ length: IGNORE_LIMIT }, (_, i) => (
              <g key={i} opacity={p(t, 23.4 + i * 0.4, 23.8 + i * 0.4)}>
                <rect x={330 + i * 50} y={212} width={40} height={36} rx={8} fill={SC.muted} />
                <text x={350 + i * 50} y={238} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{i + 1}</text>
              </g>
            ))}
            <g opacity={p(t, 24.8, 25.4)}>
              <rect x={32} y={270} width={576} height={56} rx={12} fill={NUDGE_FILL.hold} />
              <text x={320} y={306} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">Stop, and ask what would suit her</text>
            </g>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            <text x={32} y={88} fontSize={21} fontWeight={800} fill={SC.muted}>Before and after, by day</text>
            {NUDGE_WEEK.before.perDay.map((n, i) => {
              const v = lerp(n, NUDGE_WEEK.after.perDay[i], p(t, 26.6, 28.4));
              const h = v * 40;
              return (
                <g key={i}>
                  <rect x={48 + i * 60} y={290 - h} width={40} height={Math.max(h, 2)} rx={5} fill={v > 1.5 ? SC.error : NUDGE_FILL.send} />
                  <text x={68 + i * 60} y={320} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">{DAYS[i]}</text>
                </g>
              );
            })}
            <g opacity={p(t, 28.6, 29.2)}>
              <rect x={470} y={110} width={140} height={110} rx={14} fill={SC.surface} stroke={NUDGE_FILL.send} strokeWidth={2} />
              <text x={540} y={160} fontSize={36} fontWeight={900} fill={NUDGE_FILL.send} textAnchor="middle">{NUDGE_WEEKLY_CAP}</text>
              <text x={540} y={196} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">a week</text>
              <text x={540} y={250} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">+ replies</text>
            </g>
          </g>
        )}

        {t >= 31 && (
          <g>
            {([['Notifications a week', `${before}`, `${after}`], ['Switched off a month', `${NUDGE_WEEK.before.optOut}%`, `${NUDGE_WEEK.after.optOut}%`], ['90-day retention vs holdout', '', '+4 pts']] as const).map(([label, a, b], i) => (
              <g key={label} opacity={p(t, 31.2 + i * 0.8, 31.8 + i * 0.8)}>
                <rect x={32} y={66 + i * 88} width={576} height={74} rx={12} fill={SC.surface} stroke={NUDGE_FILL.send} strokeWidth={2} />
                <text x={52} y={111 + i * 88} fontSize={21} fontWeight={800} fill={SC.text}>{label}</text>
                <text x={588} y={111 + i * 88} fontSize={24} fontWeight={900} fill={NUDGE_FILL.send} textAnchor="end">{a ? `${a} → ${b}` : b}</text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
