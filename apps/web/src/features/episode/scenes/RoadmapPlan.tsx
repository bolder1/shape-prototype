'use client';
// Scene for rs.6-1: Lavanya plans Musafir's research for January–June 2027. Twenty-three requests arrive; she lays the
// half's decisions on a timeline (`MUSAFIR_REQUESTS`, `weekDate`), drops the requests that feed no decision or are
// already answered (`roadmapSlot`), counts the depot study back from its May decision into Q1 (`studyWeeks`), checks
// the load against three researchers (`weekLoad`, `RESEARCHERS`), parks rail for the Q3 plan, and publishes questions
// and dates. Pure function of t (0–36). Also exports `SLOT_TONE` and the timeline maths for `roadmap-slot`.
import { HALF_WEEKS, MUSAFIR_REQUESTS, Q1_END, RESEARCHERS, roadmapSlot, studyWeeks, weekDate, weekLoad, type MusafirRequest, type Slot } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const SLOT_TONE: Record<Slot, string> = { q1: SC.discover, q2: SC.design, backlog: SC.grow, none: SC.error };
const X0 = 100, WEEK = 30;
/** Left edge of week `w` on the scene's timeline. */
const wx = (w: number) => X0 + (w - 1) * WEEK;
const INBOX: MusafirRequest[] = ['pass', 'darkmode', 'operator', 'refunds', 'women', 'seatmap', 'rail', 'boarding'];
const DECIDED: MusafirRequest[] = ['boarding', 'pass', 'operator', 'ratings', 'women', 'autopay'];
const SHORT: Record<MusafirRequest, string> = {
  pass: 'Musafir Pass price', boarding: 'Boarding details', operator: 'Operator app v2', women: 'Safety features', ratings: 'Ratings in search',
  autopay: 'Pass renewal', seatmap: 'Seat map', rail: 'Rail tickets', refunds: 'Refunds', darkmode: 'Dark mode',
};
const SCHEDULED = (Object.keys(MUSAFIR_REQUESTS) as MusafirRequest[]).filter(k => ['q1', 'q2'].includes(roadmapSlot(MUSAFIR_REQUESTS[k])));

function Para({ x, y, w, h, size = 15, weight = 800, children, muted }: { x: number; y: number; w: number; h: number; size?: number; weight?: number; children: React.ReactNode; muted?: boolean }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <p style={{ margin: 0, font: `${weight} ${size}px/1.35 Inter, system-ui, sans-serif`, color: muted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}>{children}</p>
    </foreignObject>
  );
}

/** The January–June axis with the Q1 | Q2 split, at y. */
function Axis({ y, k = 1 }: { y: number; k?: number }) {
  return (
    <g opacity={k}>
      <rect x={X0} y={y - 26} width={Q1_END * WEEK} height={26} rx={6} fill={SC.discover} opacity={0.14} />
      <rect x={wx(Q1_END + 1)} y={y - 26} width={(HALF_WEEKS - Q1_END) * WEEK} height={26} rx={6} fill={SC.design} opacity={0.14} />
      <text x={X0 + 10} y={y - 8} fontSize={13} fontWeight={900} fill={SC.text}>Q1 · Jan–Mar</text>
      <text x={wx(Q1_END + 1) + 10} y={y - 8} fontSize={13} fontWeight={900} fill={SC.text}>Q2 · Apr–Jun</text>
      <line x1={X0} x2={wx(HALF_WEEKS + 1)} y1={y} y2={y} stroke={SC.line} strokeWidth={2} />
      {[1, 5, 9, 14, 18, 22].map((w, i) => (
        <g key={w}>
          <line x1={wx(w)} x2={wx(w)} y1={y} y2={y + 6} stroke={SC.muted} />
          <text x={wx(w) + 3} y={y + 20} fontSize={11} fontWeight={800} fill={SC.muted}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</text>
        </g>
      ))}
    </g>
  );
}

function Flag({ w, y, label, k, dy = 0 }: { w: number; y: number; label: string; k: number; dy?: number }) {
  return (
    <g transform={`translate(${wx(w) + WEEK / 2} ${y})`} opacity={k}>
      <line y1={0} y2={-lerp(0, 34, k)} stroke={SC.text} strokeWidth={2} />
      <path d={`M0 ${-34} l14 5 l-14 5 z`} fill={SC.brand} />
      <text x={4} y={34 + dy} fontSize={11.5} fontWeight={800} fill={SC.text} textAnchor="middle">{label}</text>
    </g>
  );
}

export function RoadmapPlanScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The inbox' : t < 11 ? 'Decisions first' : t < 16 ? 'No decision, no study' : t < 21 ? 'Count backwards' : t < 26 ? 'Three researchers' : t < 31 ? 'Later, not never' : 'Questions and dates';
  const op = MUSAFIR_REQUESTS.operator;
  const [opA, opB] = studyWeeks(op)!;
  const grow = p(t, 17.4, 19.4);
  const load = weekLoad(SCHEDULED.map(k => MUSAFIR_REQUESTS[k]));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Musafir's head of research plans January to June. Twenty-three requests arrive. She lays the half's decisions on a timeline, drops dark mode because no decision waits on it and links refunds to last year's study. The operator app is scoped on 17 May, so its eight-week depot study is counted back to start by 22 March, in Q1. With three researchers, no more than three studies run at once, and the seat-map question goes to the squad. Rail tickets, decided in October, wait for the Q3 plan. The roadmap is published as questions, decisions and dates.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g transform="translate(60 92)">
            {INBOX.map((k, i) => (
              <g key={k} transform={`translate(${(i % 2) * 300 + (i % 3) * 6} ${Math.floor(i / 2) * 92 + (i % 2) * 14})`} opacity={p(t, 0.3 + i * 0.4, 0.7 + i * 0.4)}>
                <rect width={280} height={78} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <Para x={14} y={10} w={252} h={44} size={12.5}>{MUSAFIR_REQUESTS[k].text}</Para>
                <text x={14} y={68} fontSize={11} fontWeight={800} fill={SC.muted}>{MUSAFIR_REQUESTS[k].from}</text>
              </g>
            ))}
            <g transform="translate(640 30)" opacity={p(t, 3.6, 4.2)}>
              <text fontSize={56} fontWeight={900} fill={SC.text}>23</text>
              <text y={28} fontSize={15} fontWeight={800} fill={SC.muted}>requests, January–June</text>
              <text y={112} fontSize={56} fontWeight={900} fill={SC.text}>{RESEARCHERS}</text>
              <text y={140} fontSize={15} fontWeight={800} fill={SC.muted}>researchers who can lead</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 16 && (
          <g>
            <Axis y={250} k={p(t, 6.2, 6.8)} />
            {DECIDED.map((k, i) => (
              <Flag key={k} w={MUSAFIR_REQUESTS[k].due!} y={250} label={SHORT[k]} dy={(i % 3) * 15} k={p(t, 7 + i * 0.45, 7.5 + i * 0.45)} />
            ))}
            <text x={X0} y={150} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 9.6, 10.2)}>Each decision has an owner and a date. Every study has to land before one of them.</text>
            {t >= 11 && (['darkmode', 'refunds'] as const).map((k, i) => (
              <g key={k} transform={`translate(${100 + i * 400} 340)`} opacity={p(t, 11.2 + i * 1.6, 11.7 + i * 1.6)}>
                <rect width={370} height={130} rx={14} fill={SC.surface} stroke={SLOT_TONE.none} strokeWidth={2.5} />
                <Para x={18} y={14} w={334} h={52} size={14}>{MUSAFIR_REQUESTS[k].text}</Para>
                <text x={18} y={96} fontSize={13} fontWeight={900} fill={SC.text}>{k === 'darkmode' ? 'Feeds no decision: not a study' : 'Answered in Aug 2026: here’s the link'}</text>
                <path d={`M18 80 H${lerp(18, 352, p(t, 12 + i * 1.6, 12.6 + i * 1.6))}`} stroke={SLOT_TONE.none} strokeWidth={2} opacity={0.5} />
              </g>
            ))}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            <Axis y={300} />
            <Flag w={op.due!} y={300} label={`Decided ${weekDate(op.due!)}`} dy={-74} k={p(t, 16.2, 16.7)} />
            <rect x={wx(lerp(opB + 1, opA, grow))} y={316} width={lerp(0, op.weeks * WEEK, grow)} height={34} rx={8} fill={SC.surface} stroke={SLOT_TONE.q1} strokeWidth={3} />
            <text x={wx(opA) + 12} y={338} fontSize={13} fontWeight={900} fill={SC.text} opacity={p(t, 19, 19.4)}>Depot study · {op.weeks} weeks</text>
            <g opacity={p(t, 19.4, 20)}>
              <line x1={wx(opA)} x2={wx(opA)} y1={360} y2={400} stroke={SLOT_TONE.q1} strokeWidth={2} strokeDasharray="4 4" />
              <text x={wx(opA) - 8} y={420} fontSize={15} fontWeight={900} fill={SC.text} textAnchor="end">Starts by {weekDate(opA)}: Q1</text>
            </g>
            <Para x={X0} y={130} w={760} h={60} muted>Operator app v2 is scoped in May. Eight weeks of depot visits, counted back from that date, start in March.</Para>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            <Axis y={130} />
            {SCHEDULED.map((k, i) => {
              const [a, b] = studyWeeks(MUSAFIR_REQUESTS[k])!;
              return (
                <g key={k} opacity={p(t, 21.2 + i * 0.3, 21.6 + i * 0.3)}>
                  <rect x={wx(a)} y={150 + i * 34} width={(b - a + 1) * WEEK} height={26} rx={7} fill={SC.surface} stroke={SLOT_TONE[roadmapSlot(MUSAFIR_REQUESTS[k])]} strokeWidth={2.5} />
                  <text x={wx(a) + 8} y={168 + i * 34} fontSize={12} fontWeight={900} fill={SC.text}>{SHORT[k]}</text>
                </g>
              );
            })}
            {load.map((n, i) => (
              <g key={i} opacity={p(t, 23, 23.6)}>
                <rect x={wx(i + 1) + 3} y={410 - n * 18} width={WEEK - 6} height={n * 18} rx={3} fill={n >= RESEARCHERS ? SC.design : SC.discover} opacity={n >= RESEARCHERS ? 0.9 : 0.5} />
              </g>
            ))}
            <line x1={X0} x2={wx(HALF_WEEKS + 1)} y1={410 - RESEARCHERS * 18} y2={410 - RESEARCHERS * 18} stroke={SC.error} strokeDasharray="5 5" opacity={p(t, 23.4, 24)} />
            <text x={wx(HALF_WEEKS + 1)} y={402 - RESEARCHERS * 18} fontSize={12} fontWeight={900} fill={SC.text} textAnchor="end" opacity={p(t, 23.4, 24)}>{RESEARCHERS} researchers</text>
            <Para x={X0} y={430} w={760} h={60} muted>Weeks 17 to 19 use the whole team. The seat map is cheap to reverse, so Rohan’s squad tests it live instead.</Para>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            <Axis y={250} />
            <g opacity={p(t, 26.3, 26.9)}>
              <path d={`M${wx(HALF_WEEKS) + 10} 200 h70`} stroke={SC.text} strokeWidth={2.5} markerEnd="" />
              <path d={`M${wx(HALF_WEEKS) + 80} 193 l10 7 l-10 7 z`} fill={SC.text} />
              <text x={wx(HALF_WEEKS) + 92} y={190} fontSize={13} fontWeight={900} fill={SC.text} textAnchor="end">October</text>
            </g>
            <g transform="translate(100 300)" opacity={p(t, 27, 27.6)}>
              <rect width={760} height={130} rx={16} fill={SC.surface} stroke={SLOT_TONE.backlog} strokeWidth={2.5} />
              <Para x={22} y={18} w={716} h={30} size={17}>{MUSAFIR_REQUESTS.rail.text}</Para>
              <Para x={22} y={54} w={716} h={70} size={14} muted>The biggest question in the pile, decided by the board in October. It goes into the Q3 plan, and every study before then tags anything about trips that mix bus and train.</Para>
            </g>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(60 92)">
            <rect width={840} height={400} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={p(t, 31.1, 31.5)} />
            <text x={28} y={40} fontSize={13} fontWeight={900} fill={SC.muted} opacity={p(t, 31.2, 31.6)}>MUSAFIR RESEARCH · JANUARY–JUNE 2027</text>
            {(['boarding', 'pass', 'operator', 'ratings', 'women', 'autopay'] as const).map((k, i) => (
              <g key={k} transform={`translate(28 ${64 + i * 52})`} opacity={p(t, 31.6 + i * 0.35, 32 + i * 0.35)}>
                <rect width={784} height={44} rx={10} fill={SC.soft} />
                <circle cx={18} cy={22} r={6} fill={SLOT_TONE[roadmapSlot(MUSAFIR_REQUESTS[k])]} />
                <Para x={34} y={6} w={520} h={36} size={13}>{MUSAFIR_REQUESTS[k].text}</Para>
                <text x={770} y={27} fontSize={13} fontWeight={900} fill={SC.text} textAnchor="end">Lands before {weekDate(MUSAFIR_REQUESTS[k].due!)}</text>
              </g>
            ))}
            <text x={28} y={386} fontSize={14} fontWeight={900} fill={SC.text} opacity={p(t, 34, 34.5)}>Reviewed every six weeks, because decisions move.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
