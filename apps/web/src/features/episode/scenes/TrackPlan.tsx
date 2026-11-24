'use client';
// Scene for st.3-4: Kahaani's player gets a sleep timer, and two weeks later Kunal asks whether children finish more
// stories with it on. The only event is button_click with a screen name, scrolling past with nothing in it. Tara writes
// the questions first, marks where each event in `KAHAANI_EVENTS` fires on the shared `KahaaniPlayer`, fills a tracking
// plan with the properties each one carries, renames PlayBtnTap and strikes the developer's child_name for an anonymous
// family id, then ships the plan beside the design and ticks each event off in a debug view. `KahaaniPlayer`,
// `PLAYER_SPOTS` and `PLAYER_W`/`PLAYER_H` are shared with the Wire the tracking plan game. Pure function of t (0–36).
import { KAHAANI_EVENTS, type KahaaniEvent } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';
import { KAHAANI } from './MetricTree';

const W = 960, H = 540;
export const PLAYER_W = 300, PLAYER_H = 500;
/** Where each event's moment sits on the player, in its own coordinates. */
export const PLAYER_SPOTS: Record<(typeof KAHAANI_EVENTS)[KahaaniEvent]['where'], { x: number; y: number; label: string }> = {
  stop: { x: 40, y: 46, label: 'Close, or stop early' },
  end: { x: 258, y: 292, label: 'The story’s last second' },
  play: { x: 150, y: 362, label: 'Play' },
  timer: { x: 150, y: 448, label: 'Sleep timer' },
};
/** The event that fires at each spot. */
export const SPOT_EVENT = Object.fromEntries(Object.entries(KAHAANI_EVENTS).map(([e, v]) => [v.where, e])) as Record<keyof typeof PLAYER_SPOTS, KahaaniEvent>;

/** Kahaani's story player, 300 × 500. `lit` rings spots; `progress` (0–1) fills the bar; `timer` shows the timer's length. */
export function KahaaniPlayer({ lit = [], progress = 0.35, timer, tags = false }: { lit?: (keyof typeof PLAYER_SPOTS)[]; progress?: number; timer?: number; tags?: boolean }) {
  return (
    <g>
      <rect width={PLAYER_W} height={PLAYER_H} rx={34} fill="#101828" />
      <rect x={10} y={10} width={PLAYER_W - 20} height={PLAYER_H - 20} rx={26} fill="#1B0F45" />
      <path d="M32 38 L48 54 M48 38 L32 54" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
      <text x={150} y={52} textAnchor="middle" fontSize={14} fontWeight={900} fill="#FFFFFF">Kahaani</text>
      <rect x={40} y={78} width={220} height={170} rx={18} fill={KAHAANI} />
      <circle cx={190} cy={128} r={26} fill="#FDE272" /><circle cx={202} cy={118} r={24} fill={KAHAANI} />
      {[[70, 110], [96, 150], [140, 104], [230, 200], [84, 210]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5} fill="#FFFFFF" />)}
      <text x={150} y={232} textAnchor="middle" fontSize={11} fontWeight={800} fill="#E9D7FE">Telugu · 12 min</text>
      <text x={150} y={272} textAnchor="middle" fontSize={14} fontWeight={900} fill="#FFFFFF">Chinnu and the sleepy tiger</text>
      <rect x={40} y={288} width={220} height={8} rx={4} fill="#53389E" />
      <rect x={40} y={288} width={220 * progress} height={8} rx={4} fill="#FFFFFF" />
      <circle cx={40 + 220 * progress} cy={292} r={7} fill="#FFFFFF" />
      <path d="M90 350 L72 362 L90 374 Z M108 350 L90 362 L108 374 Z" fill="#E9D7FE" />
      <circle cx={150} cy={362} r={30} fill="#FFFFFF" />
      <path d="M141 348 L141 376 L165 362 Z" fill={KAHAANI} />
      <path d="M192 350 L210 362 L192 374 Z M210 350 L228 362 L210 374 Z" fill="#E9D7FE" />
      <rect x={96} y={426} width={108} height={44} rx={22} fill="#53389E" />
      <circle cx={124} cy={448} r={9} fill="#FDE272" /><circle cx={128} cy={444} r={8} fill="#53389E" />
      <text x={166} y={453} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF">{timer ? `${timer} min` : 'Timer'}</text>
      {(Object.keys(PLAYER_SPOTS) as (keyof typeof PLAYER_SPOTS)[]).map(s => lit.includes(s) && (
        <g key={s}>
          <circle cx={PLAYER_SPOTS[s].x} cy={PLAYER_SPOTS[s].y} r={s === 'timer' ? 40 : 26} fill="none" stroke="#FDE272" strokeWidth={3} strokeDasharray="6 4" />
          {tags && (
            <g transform={`translate(${Math.min(PLAYER_W - 130, Math.max(6, PLAYER_SPOTS[s].x - 62))} ${PLAYER_SPOTS[s].y + (s === 'timer' ? -70 : 30)})`}>
              <rect width={124} height={22} rx={11} fill="#FDE272" />
              <text x={62} y={15} textAnchor="middle" fontSize={11} fontWeight={900} fill={INK}>{SPOT_EVENT[s]}</text>
            </g>
          )}
        </g>
      ))}
    </g>
  );
}

const QUESTIONS = ['Do stories finish more often with the timer on?', 'Which timer length do parents pick?', 'Where do Telugu stories get stopped?'];
const PLAN_ORDER: KahaaniEvent[] = ['story_started', 'story_finished', 'story_stopped', 'timer_set'];

export function TrackPlanScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const lit = (['play', 'end', 'stop', 'timer'] as const).filter((_, i) => t >= 16.4 + i * 1.2);
  const logs = t < 11.4 ? 1 - p(t, 10.8, 11.4) : 0;
  const plan = t >= 22 ? p(t, 22.2, 22.8) : 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Kahaani's player gets a sleep timer, but the only event recorded is button_click, which can't answer whether stories finish more often with the timer on; the team writes questions first, marks where four events fire on the player, lists the properties each carries, renames a button-named event, removes a child's name, and checks every event in a debug view before release">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <g transform="translate(40 24)">
          <KahaaniPlayer lit={t >= 16 && t < 22 ? [...lit] : t < 6 ? ['timer'] : []} progress={t < 6 ? 0.35 : 0.8} timer={t >= 2 && t < 6 ? 20 : undefined} tags />
        </g>
        <text x={390} y={56} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'The sleep timer ships' : t < 11 ? 'What the data recorded' : t < 16 ? 'Questions first' : t < 22 ? 'Events at moments' : t < 27 ? 'Properties answer questions' : t < 31 ? 'Names, and no names' : 'It ships with the design'}
        </text>

        {t < 6 && (
          <g transform="translate(390 100)" opacity={p(t, 2.6, 3.2)}>
            <rect width={420} height={70} rx={16} fill={SC.surface} stroke={SC.line} />
            <text x={20} y={30} fontSize={13} fontWeight={800} fill={SC.muted}>Kunal, two weeks later</text>
            <text x={20} y={54} fontSize={16} fontWeight={900} fill={SC.text}>“Do kids finish more stories with it on?”</text>
          </g>
        )}

        {logs > 0 && t >= 6 && (
          <g transform="translate(390 90)" opacity={logs * p(t, 6, 6.5)}>
            <rect width={530} height={300} rx={16} fill="#101828" />
            {Array.from({ length: 9 }, (_, i) => {
              const y = 36 + ((i * 32 + (t - 6) * 40) % 288);
              return <text key={i} x={20} y={y} fontSize={13} fontWeight={700} fontFamily="ui-monospace, monospace" fill="#D0D5DD">button_click  {'{'} screen: &quot;player&quot; {'}'}</text>;
            })}
            <g opacity={p(t, 8, 8.6)}>
              <rect x={300} y={110} width={200} height={80} rx={14} fill="#B42318" />
              <text x={400} y={146} textAnchor="middle" fontSize={15} fontWeight={900} fill="#FFFFFF">Which story? Timer?</text>
              <text x={400} y={170} textAnchor="middle" fontSize={15} fontWeight={900} fill="#FFFFFF">How did it end?</text>
            </g>
          </g>
        )}

        {t >= 11 && t < 22 && (
          <g transform="translate(390 90)">
            {QUESTIONS.map((q, i) => (
              <g key={q} transform={`translate(0 ${i * 60})`} opacity={p(t, 11.4 + i * 1, 12 + i * 1)}>
                <rect width={520} height={48} rx={12} fill={SC.surface} stroke={SC.line} />
                <text x={18} y={30} fontSize={15} fontWeight={900} fill={SC.text}>{i + 1}. {q}</text>
              </g>
            ))}
            {PLAN_ORDER.map((e, i) => (
              <g key={e} transform={`translate(0 ${200 + i * 46})`} opacity={p(t, 16.4 + i * 1.2, 17 + i * 1.2)}>
                <text x={0} y={20} fontSize={15} fontWeight={900} fontFamily="ui-monospace, monospace" fill={SC.text}>{e}</text>
                <text x={190} y={20} fontSize={13} fontWeight={800} fill={SC.muted}>{KAHAANI_EVENTS[e].trigger}</text>
              </g>
            ))}
          </g>
        )}

        {plan > 0 && (
          <g transform="translate(390 86)" opacity={plan}>
            <rect width={540} height={250} rx={16} fill="#FFFFFF" stroke={SC.line} />
            <text x={20} y={32} fontSize={12} fontWeight={900} fill={INK_MUTED}>EVENT</text>
            <text x={210} y={32} fontSize={12} fontWeight={900} fill={INK_MUTED}>PROPERTIES</text>
            {PLAN_ORDER.map((e, i) => (
              <g key={e} transform={`translate(0 ${48 + i * 48})`} opacity={p(t, 22.6 + i * 0.6, 23.2 + i * 0.6)}>
                <line x1={16} x2={524} y1={0} y2={0} stroke="#EAECF0" />
                <text x={20} y={30} fontSize={14} fontWeight={900} fontFamily="ui-monospace, monospace" fill={INK}>{e}</text>
                <text x={210} y={30} fontSize={12.5} fontWeight={700} fontFamily="ui-monospace, monospace" fill={INK_MUTED}>{KAHAANI_EVENTS[e].props.join(', ')}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 27 && (
          <g transform="translate(390 356)" opacity={p(t, 27.2, 27.8)}>
            <text x={0} y={20} fontSize={15} fontWeight={900} fontFamily="ui-monospace, monospace" fill="#B42318" textDecoration="line-through">PlayBtnTap</text>
            <text x={150} y={20} fontSize={15} fontWeight={900} fill={SC.muted}>→</text>
            <text x={180} y={20} fontSize={15} fontWeight={900} fontFamily="ui-monospace, monospace" fill={SC.text} opacity={p(t, 27.8, 28.4)}>story_started</text>
            <g opacity={p(t, 28.8, 29.4)}>
              <text x={0} y={56} fontSize={15} fontWeight={900} fontFamily="ui-monospace, monospace" fill="#B42318" textDecoration="line-through">child_name: &quot;Advik&quot;</text>
              <text x={210} y={56} fontSize={15} fontWeight={900} fill={SC.muted}>→</text>
              <text x={240} y={56} fontSize={15} fontWeight={900} fontFamily="ui-monospace, monospace" fill={SC.text} opacity={p(t, 29.4, 30)}>family_id: &quot;f_83a1&quot;</text>
            </g>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(390 440)" opacity={p(t, 31.2, 31.8)}>
            <rect width={540} height={70} rx={14} fill={SC.surface} stroke={SC.line} />
            <text x={20} y={28} fontSize={13} fontWeight={900} fill={SC.text}>Debug view · test build</text>
            {PLAN_ORDER.map((e, i) => (
              <g key={e} transform={`translate(${20 + i * 130} 40)`} opacity={p(t, 32 + i * 0.7, 32.4 + i * 0.7)}>
                <circle cx={8} cy={8} r={8} fill="#067647" />
                <path d="M4 8 L7 11 L12 5" stroke="#FFFFFF" strokeWidth={2} fill="none" />
                <text x={22} y={13} fontSize={11} fontWeight={800} fontFamily="ui-monospace, monospace" fill={SC.text}>{e}</text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
