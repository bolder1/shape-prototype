'use client';
// Scene for ld.1-2: Nisha's 90-minute workshop at Rasoi on why subscribers pause. She starts from the outputs
// (`WORKSHOP_OUTPUTS`) and plans the agenda back from them (`AGENDA`, adding up to `WORKSHOP_MINUTES`). Vikram anchors
// the room with "It's price"; silent notes put 23 reasons on the wall, three of them price. Going round the table
// lights up every seat (`ROOM`), the gateway debate goes to the parking lot, a two-minute timer ends the pause-or-skip
// loop, and the workshop ends on time with two ideas and two owners. Pure function of t (0–36).
// Also exports `MOVE_TONE` for `room-read`.
import { AGENDA, ROOM, agendaMinutes, ROLE_OF, WORKSHOP_GOAL, WORKSHOP_MINUTES, WORKSHOP_OUTPUTS, type Move, type RasoiPerson } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const MOVE_TONE: Record<Move, string> = { silent: SC.design, round: SC.discover, park: SC.grow, timebox: SC.build };
/** Seats round an oval table, centred at (cx, cy). */
const seat = (i: number, cx = 300, cy = 300) => {
  const a = -Math.PI / 2 + (i / ROOM.length) * Math.PI * 2;
  return [cx + Math.cos(a) * 190, cy + Math.sin(a) * 140] as const;
};
/** The wall of silent notes: 23 reasons, grouped. */
const NOTES = [
  ...Array.from({ length: 9 }, () => 'Travel'), ...Array.from({ length: 7 }, () => 'Same menu'),
  ...Array.from({ length: 4 }, () => 'Late delivery'), ...Array.from({ length: 3 }, () => 'Price'),
];
const GROUPS = ['Travel', 'Same menu', 'Late delivery', 'Price'];
const GROUP_TONE: Record<string, string> = { Travel: SC.discover, 'Same menu': SC.design, 'Late delivery': SC.grow, Price: SC.muted };
/** Agenda blocks with the minute each starts. */
const blocks = AGENDA.map((b, i) => ({ ...b, start: agendaMinutes(AGENDA.slice(0, i)) }));
const ROUND_ORDER: RasoiPerson[] = ['Devika', 'Karthik', 'Ashok', 'Sunita', 'Rohan', 'Meghna', 'Arjun', 'Vikram'];

function Room({ heard, speaker }: { heard: (p: RasoiPerson) => number; speaker?: RasoiPerson }) {
  return (
    <g>
      <ellipse cx={300} cy={300} rx={150} ry={95} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <text x={300} y={305} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>Rasoi · {ROOM.length} people</text>
      {ROOM.map((name, i) => {
        const [x, y] = seat(i);
        const on = heard(name);
        const remote = name === 'Devika' || name === 'Karthik';
        return (
          <g key={name} transform={`translate(${x} ${y})`}>
            {remote ? <rect x={-24} y={-24} width={48} height={48} rx={10} fill={SC.surface} stroke={on > 0.5 ? SC.discover : SC.line} strokeWidth={on > 0.5 ? 3 : 1.5} />
              : <circle r={24} fill={SC.surface} stroke={on > 0.5 ? SC.discover : SC.line} strokeWidth={on > 0.5 ? 3 : 1.5} />}
            <circle r={18} fill={SC.discover} opacity={0.12 + on * 0.5} />
            <text y={5} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>{name[0]}</text>
            <text y={42} textAnchor="middle" fontSize={11.5} fontWeight={800} fill={speaker === name ? SC.text : SC.muted}>{name}{remote ? ' · call' : ''}</text>
          </g>
        );
      })}
    </g>
  );
}

export function WorkshopRoomScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A meeting with a job' : t < 11 ? 'Plan back from the outputs' : t < 16 ? 'The founder goes first' : t < 21 ? 'Write alone' : t < 26 ? 'Every voice in' : t < 31 ? 'Timer, then decide' : 'Two ideas, two owners';
  const roundHeard = (name: RasoiPerson) => {
    if (name === 'Vikram' || name === 'Arjun') return 1;
    const i = ROUND_ORDER.indexOf(name);
    return p(t, 21.4 + i * 0.45, 21.8 + i * 0.45);
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Nisha plans a ${WORKSHOP_MINUTES}-minute workshop at Rasoi on the question “${WORKSHOP_GOAL}” She starts from the outputs: ${WORKSHOP_OUTPUTS.join('; ')}. The agenda is planned back from them: ${AGENDA.map(b => `${b.minutes} minutes, ${b.activity}`).join('; ')}. Fourteen minutes in, the founder says it's price; silent notes put 23 reasons on the wall and only three are price. Going round the table brings in ${ROOM.map(n => `${n} (${ROLE_OF[n]})`).join(', ')}. A tangent goes on the parking lot, a two-minute timer ends a loop, and the workshop ends on time with two ideas and two owners.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g transform="translate(80 110)">
            <g opacity={p(t, 0.3, 0.9)}>
              <rect width={520} height={50} rx={14} fill={SC.surface} stroke={SC.line} />
              <text x={20} y={32} fontSize={16} fontWeight={800} fill={SC.muted}>Vikram: “Can we do a brainstorm on pauses?”</text>
            </g>
            <g transform="translate(240 70)" opacity={p(t, 1.4, 2)}>
              <rect width={520} height={50} rx={14} fill={SC.surface} stroke={SC.brand} strokeWidth={2} />
              <text x={20} y={32} fontSize={16} fontWeight={900} fill={SC.text}>Nisha: “What should we leave the room with?”</text>
            </g>
            {WORKSHOP_OUTPUTS.map((o, i) => (
              <g key={o} transform={`translate(0 ${170 + i * 58})`} opacity={p(t, 2.6 + i * 0.7, 3.1 + i * 0.7)}>
                <rect width={600} height={44} rx={12} fill={SC.surface} stroke={SC.line} />
                <rect width={8} height={44} rx={4} fill={SC.design} />
                <text x={24} y={28} fontSize={15} fontWeight={800} fill={SC.text}>{o}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(60 130)">
            <text fontSize={14} fontWeight={800} fill={SC.muted}>0 min</text>
            <text x={840} fontSize={14} fontWeight={800} fill={SC.muted} textAnchor="end">{WORKSHOP_MINUTES} min</text>
            {blocks.map((b, i) => {
              const x = (b.start / WORKSHOP_MINUTES) * 840, w = (b.minutes / WORKSHOP_MINUTES) * 840;
              const k = p(t, 6.3 + (blocks.length - 1 - i) * 0.5, 6.8 + (blocks.length - 1 - i) * 0.5);   // laid in backwards, from the outputs
              return (
                <g key={b.activity} opacity={k}>
                  <rect x={x + 2} y={20} width={w - 4} height={44} rx={8} fill={SC.surface} stroke={i === blocks.length - 2 ? SC.design : SC.line} strokeWidth={i === blocks.length - 2 ? 3 : 1} />
                  <text x={x + 10} y={47} fontSize={13} fontWeight={900} fill={SC.text}>{b.minutes}′</text>
                  <g transform={`translate(${x + 6} ${90 + (i % 2) * 120})`}>
                    <line x1={4} y1={-26} x2={4} y2={-6} stroke={SC.line} />
                    <foreignObject width={Math.max(w + 50, 150)} height={110}>
                      <p style={{ margin: 0, font: '700 12px/1.3 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)' }}>{b.activity}</p>
                      <p style={{ margin: '4px 0 0', font: '700 11px/1.3 Inter, system-ui, sans-serif', color: 'var(--color-text-tertiary)' }}>→ {b.output}</p>
                    </foreignObject>
                  </g>
                </g>
              );
            })}
          </g>
        )}

        {t >= 11 && t < 31 && (
          <g>
            <Room heard={t < 21 ? n => (n === 'Vikram' || n === 'Arjun' ? 1 : 0) : roundHeard} speaker={t < 16 ? 'Vikram' : undefined} />
            {t < 16 && (
              <g transform={`translate(${seat(0)[0] + 40} ${seat(0)[1] - 30})`} opacity={p(t, 11.4, 11.9)}>
                <rect width={300} height={46} rx={14} fill={SC.surface} stroke={SC.text} strokeWidth={2} />
                <text x={16} y={29} fontSize={15} fontWeight={900} fill={SC.text}>“It’s price. We’re too expensive.”</text>
              </g>
            )}
            {t < 16 && <text x={560} y={300} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 13, 13.6)}>Minute 14. No notes written yet. Heads nod.</text>}
            {t >= 16 && t < 21 && (
              <g transform="translate(560 110)">
                <text fontSize={14} fontWeight={900} fill={SC.text} opacity={p(t, 16.1, 16.5)}>Three minutes, alone: 23 reasons</text>
                {GROUPS.map((g, gi) => {
                  const ns = NOTES.filter(n => n === g);
                  return (
                    <g key={g} transform={`translate(0 ${24 + gi * 82})`}>
                      <text y={14} fontSize={12} fontWeight={800} fill={SC.muted} opacity={p(t, 18.4, 18.9)}>{g} · {ns.length}</text>
                      {ns.map((_, i) => {
                        const k = p(t, 16.4 + (gi * 9 + i) * 0.08, 16.8 + (gi * 9 + i) * 0.08);
                        return <rect key={i} x={i * 38} y={22} width={32} height={32} rx={4} fill={GROUP_TONE[g]} opacity={0.2 + k * 0.6} transform={`rotate(${(i % 3) - 1} ${i * 38 + 16} 38)`} />;
                      })}
                    </g>
                  );
                })}
              </g>
            )}
            {t >= 21 && t < 26 && (
              <g transform="translate(560 120)">
                <text fontSize={14} fontWeight={900} fill={SC.text}>Round the table, the call first</text>
                <g transform="translate(0 30)" opacity={p(t, 23.5, 24)}>
                  <rect width={330} height={130} rx={12} fill={SC.surface} stroke={MOVE_TONE.park} strokeWidth={2} />
                  <text x={16} y={28} fontSize={14} fontWeight={900} fill={SC.text}>Parking lot</text>
                  <text x={16} y={58} fontSize={13} fontWeight={700} fill={SC.text}>Payment gateway · owner Karthik</text>
                  <text x={16} y={84} fontSize={13} fontWeight={700} fill={SC.text} opacity={p(t, 24.5, 25)}>Refund bug · owner Sunita, Friday</text>
                </g>
              </g>
            )}
            {t >= 26 && t < 31 && (
              <g transform="translate(600 120)">
                <text fontSize={14} fontWeight={900} fill={SC.text}>“Pause” or “skip”?</text>
                {(() => {
                  const left = 1 - p(t, 26.3, 28.3);
                  const r = 54, c = 2 * Math.PI * r;
                  return (
                    <g transform="translate(90 100)">
                      <circle r={r} fill={SC.surface} stroke={SC.line} strokeWidth={10} />
                      <circle r={r} fill="none" stroke={MOVE_TONE.timebox} strokeWidth={10} strokeDasharray={`${c * left} ${c}`} transform="rotate(-90)" strokeLinecap="round" />
                      <text y={8} textAnchor="middle" fontSize={22} fontWeight={900} fill={SC.text}>{`${Math.floor(left * 2)}:${String(Math.round((left * 120) % 60)).padStart(2, '0')}`}</text>
                    </g>
                  );
                })()}
                <text y={200} fontSize={14} fontWeight={800} fill={SC.text} opacity={p(t, 28.4, 28.9)}>Vikram: one feature, called “Pause”.</text>
                {Array.from({ length: 16 }, (_, i) => (
                  <circle key={i} cx={20 + (i % 8) * 30} cy={lerp(160, 250, p(t, 29.2, 29.8))} r={7} fill={SC.brand} opacity={p(t, 29.2, 29.4)} transform={`translate(0 ${Math.floor(i / 8) * 20})`} />
                ))}
              </g>
            )}
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(80 120)">
            {[
              { idea: 'Pause for a single day', owner: 'Nisha', tone: SC.design },
              { idea: 'A menu that changes every day', owner: 'Ashok', tone: SC.discover },
            ].map((r, i) => (
              <g key={r.idea} transform={`translate(${i * 400} 0)`} opacity={p(t, 31.2 + i * 0.6, 31.7 + i * 0.6)}>
                <rect width={370} height={120} rx={16} fill={SC.surface} stroke={r.tone} strokeWidth={2.5} />
                <text x={22} y={42} fontSize={13} fontWeight={800} fill={SC.muted}>Idea to test {i + 1}</text>
                <text x={22} y={72} fontSize={19} fontWeight={900} fill={SC.text}>{r.idea}</text>
                <text x={22} y={100} fontSize={14} fontWeight={800} fill={SC.muted}>Owner: {r.owner} · starts Monday</text>
              </g>
            ))}
            <g transform="translate(0 170)" opacity={p(t, 33, 33.5)}>
              <text fontSize={56} fontWeight={900} fill={SC.text}>{Math.round(lerp(75, WORKSHOP_MINUTES, p(t, 33, 34.5)))}:00</text>
              <text y={36} fontSize={16} fontWeight={800} fill={SC.muted}>Finished on time. Eight of eight heard. Notes out by 6 pm.</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
