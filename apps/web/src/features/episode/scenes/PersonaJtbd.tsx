'use client';
// Scene for rs.3-3: "Ravi, 34, loves cricket" arrives with no source; each detail that changes no decision is struck
// and he fades. Then three tools from the same 12 Dawaa interviews: Sunita's research persona, a job story in three
// coloured parts, and an archetype map grouping people by behaviour (a 72- and a 30-year-old share a group). Each tool
// gets the question it answers. Pure function of t (0–34).
import { FAMILY_SOLID } from '../kit';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const CW = 284;   // each tool card's width

const RAVI = ['Loves cricket and travel', 'iPhone user', 'Wants a seamless experience'];

/** People on the archetype map: x = orders for self (0) → someone else (1), y = lives near (0) → far (1), group, age. */
const DOTS: { x: number; y: number; g: 0 | 1 | 2; age?: number }[] = [
  { x: 0.78, y: 0.84, g: 0 }, { x: 0.86, y: 0.74, g: 0 }, { x: 0.7, y: 0.9, g: 0 }, { x: 0.92, y: 0.88, g: 0 },
  { x: 0.74, y: 0.7, g: 0 }, { x: 0.84, y: 0.94, g: 0 }, { x: 0.94, y: 0.78, g: 0 },
  { x: 0.14, y: 0.3, g: 1, age: 72 }, { x: 0.22, y: 0.2, g: 1, age: 30 }, { x: 0.1, y: 0.14, g: 1 },
  { x: 0.8, y: 0.16, g: 2 }, { x: 0.9, y: 0.24, g: 2 },
];
const GROUPS = [{ n: 'Remote organiser', x: 0.82, y: 0.6 }, { n: 'Self-manager', x: 0.17, y: 0.48 }, { n: 'Local helper', x: 0.85, y: 0.38 }];

export function PersonaJtbdScene({ t }: { t: number }) {
  const ravi = clamp(back((t - 0.4) / 0.5)) * (1 - p(t, 9, 9.8));
  const persona = clamp(back((t - 10.2) / 0.5)), job = clamp(back((t - 16.2) / 0.5)), arch = clamp(back((t - 22.2) / 0.5));
  const ask = (k: number) => clamp(back((t - 28.2 - k * 0.5) / 0.45));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: an invented persona is struck out and replaced by a research persona, a job story and an archetype map">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* Ravi, from nowhere */}
      {ravi > 0 && (
        <g transform={`translate(480 260) scale(${ravi})`}>
          <rect x={-200} y={-150} width={400} height={300} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <circle cx={-140} cy={-88} r={36} fill={SC.line} />
          <text x={-88} y={-96} fontSize={22} fontWeight={800} fill={SC.text}>Ravi, 34</text>
          <text x={-88} y={-70} fontSize={15} fill={SC.muted}>Bengaluru</text>
          {RAVI.map((l, k) => {
            const s = p(t, 5.4 + k * 0.9, 6 + k * 0.9);
            return (
              <g key={l}>
                <text x={-170} y={-4 + k * 36} fontSize={17} fontWeight={600} fill={SC.text} opacity={1 - s * 0.55}>{l}</text>
                {s > 0 && <line x1={-172} x2={lerp(-172, -172 + l.length * 8.6, s)} y1={-10 + k * 36} y2={-10 + k * 36} stroke={SC.error} strokeWidth={2.5} />}
              </g>
            );
          })}
          <text x={-170} y={126} fontSize={14} fontWeight={800} fill={SC.error} opacity={p(t, 2.4, 3)}>Source: nobody knows</text>
          <text x={170} y={126} textAnchor="end" fontSize={14} fontWeight={700} fill={SC.muted} opacity={p(t, 8, 8.5)}>Changes no decision</text>
        </g>
      )}

      {/* the research persona */}
      {persona > 0 && (
        <g transform={`translate(${30 + CW / 2} 220) scale(${persona}) translate(${-CW / 2} -150)`}>
          <rect width={CW} height={300} rx={18} fill={SC.surface} stroke={FAMILY_SOLID[0]} strokeWidth={2.5} />
          <text x={18} y={30} fontSize={12} fontWeight={800} fill={SC.muted}>PERSONA</text>
          <circle cx={42} cy={70} r={22} fill={SC.line} />
          <text x={76} y={66} fontSize={18} fontWeight={800} fill={SC.text}>Sunita, 41</text>
          <text x={76} y={86} fontSize={13} fill={SC.muted}>Pune</text>
          {[['Context', 'Ma, 68, lives alone in Nashik'], ['Goal', 'Ma’s 4 daily medicines never run out'], ['Frustration', 'Finds out from a worried call']].map(([k, v], j) => (
            <g key={k} opacity={p(t, 11 + j * 0.8, 11.6 + j * 0.8)}>
              <text x={18} y={128 + j * 48} fontSize={11} fontWeight={800} fill={SC.muted}>{k.toUpperCase()}</text>
              <text x={18} y={146 + j * 48} fontSize={13.5} fontWeight={700} fill={SC.text}>{v}</text>
            </g>
          ))}
          <text x={18} y={282} fontSize={12} fontWeight={700} fill={SC.muted} opacity={p(t, 13.6, 14.2)}>Built from 7 of 12 interviews</text>
        </g>
      )}

      {/* the job story */}
      {job > 0 && (
        <g transform={`translate(${338 + CW / 2} 220) scale(${job}) translate(${-CW / 2} -150)`}>
          <rect width={CW} height={300} rx={18} fill={SC.surface} stroke={FAMILY_SOLID[1]} strokeWidth={2.5} />
          <text x={18} y={30} fontSize={12} fontWeight={800} fill={SC.muted}>JOB STORY</text>
          {[['When…', 'Ma’s tablets are nearly out', 'and I’m 200 km away,'], ['I want to…', 'know before she does,', ''], ['So I…', 'am not ordering in a panic.', '']].map(([k, a, b], j) => (
            <g key={k} transform={`translate(14 ${48 + j * 80})`} opacity={p(t, 16.8 + j * 0.9, 17.4 + j * 0.9)}>
              <rect width={CW - 28} height={70} rx={12} fill={FAMILY_SOLID[[0, 1, 2][j]]} />
              <text x={14} y={22} fontSize={12} fontWeight={800} fill="#fff">{k}</text>
              <text x={14} y={44} fontSize={14} fontWeight={700} fill="#fff">{a}</text>
              {b && <text x={14} y={62} fontSize={14} fontWeight={700} fill="#fff">{b}</text>}
            </g>
          ))}
        </g>
      )}

      {/* the archetype map */}
      {arch > 0 && (
        <g transform={`translate(${646 + CW / 2} 220) scale(${arch}) translate(${-CW / 2} -150)`}>
          <rect width={CW} height={300} rx={18} fill={SC.surface} stroke={FAMILY_SOLID[2]} strokeWidth={2.5} />
          <text x={18} y={30} fontSize={12} fontWeight={800} fill={SC.muted}>ARCHETYPES</text>
          <g transform="translate(30 50)">
            <rect width={234} height={196} rx={8} fill={SC.soft} />
            <line x1={117} x2={117} y1={0} y2={196} stroke={SC.line} strokeWidth={1.5} />
            <line x1={0} x2={234} y1={98} y2={98} stroke={SC.line} strokeWidth={1.5} />
            {DOTS.map((d, i) => (
              <g key={i} opacity={p(t, 23 + i * 0.08, 23.4 + i * 0.08)}>
                <circle cx={d.x * 234} cy={196 - d.y * 196} r={6} fill={FAMILY_SOLID[[3, 0, 2][d.g]]} />
                {d.age && <text x={d.x * 234 + 10} y={196 - d.y * 196 + 4} fontSize={11} fontWeight={800} fill={SC.text} opacity={p(t, 25, 25.5)}>{d.age}</text>}
              </g>
            ))}
            {GROUPS.map((g, k) => (
              <text key={g.n} x={g.x * 234} y={196 - g.y * 196} textAnchor="middle" fontSize={11.5} fontWeight={800} fill={SC.text} opacity={p(t, 24 + k * 0.4, 24.5 + k * 0.4)}>{g.n}</text>
            ))}
          </g>
          <text x={147} y={266} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.muted}>orders for self  →  for someone else</text>
          <text x={18} y={286} fontSize={11} fontWeight={700} fill={SC.muted}>up: far from whoever takes them</text>
        </g>
      )}

      {/* the question each tool answers */}
      {['Who are we designing for?', 'What progress, against which rivals?', 'How does behaviour differ?'].map((q, k) => ask(k) > 0 && (
        <g key={q} transform={`translate(${30 + k * 308 + CW / 2} 418) scale(${ask(k)})`}>
          <path d={`M0 -36 L-8 -24 L8 -24 Z`} fill={FAMILY_SOLID[k]} />
          <rect x={-CW / 2} y={-24} width={CW} height={48} rx={24} fill={FAMILY_SOLID[k]} />
          <text y={6} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">{q}</text>
        </g>
      ))}
      {t >= 30 && <text x={480} y={500} textAnchor="middle" fontSize={16} fontWeight={700} fill={SC.muted} opacity={p(t, 30, 30.6)}>Same 12 interviews. Pick the tool by the question.</text>}
    </svg>
  );
}
