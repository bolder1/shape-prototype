'use client';
// Scene for ld.1-3: Rasoi's five-day design sprint on selling lunch plans to offices. A week strip (`SPRINT_WEEK`)
// lights day by day: Monday's goal, questions and map with one target; Tuesday's solo sketches; Wednesday's dot heat
// map and Vikram's supervote; Thursday's facade prototype; Friday's five interviews, scored question by question
// (`FRIDAY`, `fridayVerdict`: three of five makes a pattern). Pure function of t (0–36).
// Also exports `CALL_TONE` for `sprint-fit`.
import { FRIDAY, SPRINT_WEEK, fridayVerdict, type SprintCall } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const CALL_TONE: Record<SprintCall, string> = { sprint: SC.design, test: SC.discover, research: SC.grow, build: SC.build };
const MAP = ['Hears about Rasoi', 'Visits the site', 'Picks a plan', 'Staff choose meals', 'Monthly invoice'];
const VERDICT_TONE = { yes: SC.mint, no: SC.error, unclear: SC.muted } as const;

function Sketch({ x, y, i, dots, picked }: { x: number; y: number; i: number; dots: number; picked: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={120} height={150} rx={8} fill={SC.surface} stroke={picked ? SC.design : SC.line} strokeWidth={picked ? 3 : 1} />
      {[0, 1, 2].map(r => <rect key={r} x={10} y={12 + r * 44} width={100} height={36} rx={4} fill={SC.soft} />)}
      {[0, 1, 2].map(r => <rect key={r} x={16} y={20 + r * 44} width={60 - ((i + r) % 3) * 14} height={5} rx={2} fill={SC.line} />)}
      {Array.from({ length: dots }, (_, d) => <circle key={d} cx={22 + (d % 5) * 18} cy={30 + Math.floor(d / 5) * 44 + (i % 2) * 20} r={6} fill={SC.brand} opacity={0.85} />)}
      {picked && <circle cx={104} cy={16} r={11} fill={SC.design} stroke={SC.surface} strokeWidth={2} />}
    </g>
  );
}

export function SprintWeekScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A big question' : t < 11 ? 'Monday: map' : t < 16 ? 'Tuesday: sketch' : t < 21 ? 'Wednesday: decide' : t < 26 ? 'Thursday: prototype' : t < 31 ? 'Friday: test' : 'Patterns';
  const day = t < 6 ? -1 : Math.min(4, Math.floor((t - 6) / 5));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Rasoi runs a five-day design sprint on whether to sell lunch plans to offices. ${SPRINT_WEEK.map(d => `${d.day}, ${d.name}: ${d.makes}`).join('. ')}. On Friday, five office admins try the prototype. ${FRIDAY.map(f => `${f.question} ${fridayVerdict(f.results)}`).join('. ')}.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>
        <g transform="translate(60 84)">
          {SPRINT_WEEK.map((d, i) => (
            <g key={d.day} transform={`translate(${i * 170} 0)`} opacity={t < 6 ? p(t, 3 + i * 0.3, 3.4 + i * 0.3) : 1}>
              <rect width={160} height={36} rx={10} fill={SC.surface} stroke={i === day ? SC.brand : SC.line} strokeWidth={i === day ? 3 : 1} />
              <text x={14} y={23} fontSize={14} fontWeight={900} fill={i <= day ? SC.text : SC.muted}>{d.day} · {d.name}</text>
            </g>
          ))}
        </g>

        {t < 6 && (
          <g transform="translate(80 160)">
            <rect width={800} height={70} rx={16} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} opacity={p(t, 0.3, 0.9)} />
            <text x={24} y={44} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 0.3, 0.9)}>Should Rasoi sell lunch plans to offices?</text>
            {['Sales: “Twelve offices have asked.”', 'Kitchens: “Can we cook 600 more lunches by 12:30?”', 'Three pricing ideas: per meal, per seat, per month'].map((s, i) => (
              <g key={s} transform={`translate(${i * 30} ${100 + i * 56})`} opacity={p(t, 1.2 + i * 0.6, 1.7 + i * 0.6)}>
                <rect width={560} height={42} rx={12} fill={SC.surface} stroke={SC.line} />
                <text x={16} y={27} fontSize={15} fontWeight={800} fill={SC.text}>{s}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(80 160)">
            <g opacity={p(t, 6.2, 6.7)}>
              <rect width={800} height={46} rx={12} fill={SC.surface} stroke={SC.line} />
              <text x={18} y={29} fontSize={15} fontWeight={900} fill={SC.text}>Long-term goal: 50 offices eating Rasoi lunches in a year</text>
            </g>
            {FRIDAY.map((f, i) => (
              <text key={f.question} x={0} y={84 + i * 24} fontSize={13.5} fontWeight={800} fill={SC.muted} opacity={p(t, 6.8 + i * 0.4, 7.2 + i * 0.4)}>Sprint question {i + 1}: {f.question}</text>
            ))}
            {MAP.map((m, i) => {
              const target = i === 2;
              return (
                <g key={m} transform={`translate(${i * 165} 190)`} opacity={p(t, 8 + i * 0.3, 8.4 + i * 0.3)}>
                  <rect width={140} height={56} rx={12} fill={SC.surface} stroke={target && t > 9.6 ? SC.brand : SC.line} strokeWidth={target && t > 9.6 ? 3 : 1} />
                  <text x={12} y={33} fontSize={13} fontWeight={800} fill={SC.text}>{m}</text>
                  {i < MAP.length - 1 && <path d="M142 28 H162" stroke={SC.muted} strokeWidth={2} />}
                  {target && <text x={0} y={84} fontSize={13} fontWeight={900} fill={SC.text} opacity={p(t, 9.6, 10)}>Target: the admin picks a plan</text>}
                </g>
              );
            })}
          </g>
        )}

        {t >= 11 && t < 21 && (
          <g transform="translate(80 160)">
            {Array.from({ length: 6 }, (_, i) => {
              const dots = t < 16 ? 0 : Math.round(lerp(0, [2, 7, 1, 9, 3, 2][i], p(t, 16.4, 17.6)));
              return (
                <g key={i} opacity={p(t, 11.3 + i * 0.4, 11.8 + i * 0.4)}>
                  <Sketch x={i * 135} y={0} i={i} dots={dots} picked={t > 18.4 && i === 3} />
                  <text x={i * 135} y={172} fontSize={12} fontWeight={800} fill={SC.muted}>{['Arjun', 'Meghna', 'Rohan', 'Ashok', 'Sunita', 'Nisha'][i]}</text>
                </g>
              );
            })}
            {t < 16 && <text y={220} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 13.5, 14)}>Alone, in silence. Ashok: staff pick from a weekly menu, the admin just pays.</text>}
            {t >= 16 && <text y={220} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 18.4, 18.9)}>Silent critique, a heat map of dots, then Vikram’s supervote.</text>}
            {t >= 19 && (
              <g transform="translate(0 250)">
                {Array.from({ length: 12 }, (_, i) => (
                  <rect key={i} x={i * 67} width={60} height={40} rx={6} fill={SC.surface} stroke={SC.line} opacity={p(t, 19.2 + i * 0.1, 19.4 + i * 0.1)} />
                ))}
              </g>
            )}
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g transform="translate(80 160)">
            {['Landing page', 'Plan picker', 'Staff menu', 'GST invoice'].map((s, i) => (
              <g key={s} transform={`translate(${i * 205} 0)`} opacity={p(t, 21.3 + i * 0.6, 21.8 + i * 0.6)}>
                <rect width={180} height={250} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <rect x={14} y={16} width={152} height={70} rx={8} fill={SC.soft} />
                {[0, 1, 2, 3].map(r => <rect key={r} x={14} y={102 + r * 22} width={152 - (r % 2) * 50} height={10} rx={4} fill={SC.line} />)}
                <rect x={14} y={206} width={152} height={28} rx={8} fill={SC.brand} opacity={0.85} />
                <text x={0} y={276} fontSize={14} fontWeight={800} fill={SC.text}>{s}</text>
              </g>
            ))}
            <text y={320} fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 24, 24.5)}>A facade: nothing behind it, but real enough to react to.</text>
          </g>
        )}

        {t >= 26 && (
          <g transform="translate(80 160)">
            <g>
              {[0, 1, 2, 3, 4].map(u => (
                <text key={u} x={420 + u * 70} y={0} fontSize={13} fontWeight={800} fill={SC.muted} textAnchor="middle" opacity={p(t, 26.2 + u * 0.3, 26.5 + u * 0.3)}>Admin {u + 1}</text>
              ))}
              {FRIDAY.map((f, qi) => {
                const v = fridayVerdict(f.results);
                return (
                  <g key={f.question} transform={`translate(0 ${30 + qi * 80})`}>
                    <foreignObject width={380} height={60}>
                      <p style={{ margin: 0, font: '800 14px/1.3 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)' }}>{f.question}</p>
                    </foreignObject>
                    {f.results.map((r, u) => {
                      const k = p(t, 26.6 + u * 0.8 + qi * 0.15, 27 + u * 0.8 + qi * 0.15);
                      const tone = r === true ? SC.mint : r === false ? SC.error : SC.muted;
                      return (
                        <g key={u} transform={`translate(${420 + u * 70} 18)`} opacity={k}>
                          <circle r={18} fill={tone} opacity={0.18} />
                          <circle r={18} fill="none" stroke={tone} strokeWidth={2.5} />
                          {r === true && <path d="M-7 0 L-2 6 L8 -6" fill="none" stroke={tone} strokeWidth={3} strokeLinecap="round" />}
                          {r === false && <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke={tone} strokeWidth={3} strokeLinecap="round" />}
                          {r === null && <path d="M-6 0 H6" stroke={tone} strokeWidth={3} strokeLinecap="round" />}
                        </g>
                      );
                    })}
                    {t >= 31 && (
                      <g transform="translate(780 4)" opacity={p(t, 31.2 + qi * 0.5, 31.6 + qi * 0.5)}>
                        <rect width={74} height={28} rx={8} fill={SC.surface} stroke={VERDICT_TONE[v]} strokeWidth={2.5} />
                        <text x={37} y={19} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>{v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Unclear'}</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
            {t >= 31 && (
              <text y={300} fontSize={16} fontWeight={900} fill={SC.text} opacity={p(t, 33, 33.5)}>Three of five makes a pattern. Pricing gets rethought before a line of it is built.</text>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
