'use client';
// Scene for ia.5-1: Mr Reddy has been fasting since 8 pm and Nabz's 7:00 phlebotomist is 40 minutes late. The app's
// screens test well, so Farah blueprints the whole home visit: four rows (`BLUEPRINT_ROWS`), three lines
// (`BLUEPRINT_LINES`), four phases (`BLUEPRINT_PHASES`), every step of `NABZ_STEPS` placed by `blueprintRow`. She
// follows the late visit down to the slot engine, finds the support agent blind to the route, marks the four fail
// points (`failPoints`), and fixes them below the line. Pure function of t (0–36). Also exports the board, its tones
// and short labels for `blueprint-build`.
import { BLUEPRINT_LINES, BLUEPRINT_PHASES, BLUEPRINT_ROWS, NABZ_STEPS, PHASE_LABEL, blueprintRow, failPoints, type BlueprintRow, type NabzStep } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const ROW_TONE: Record<BlueprintRow, string> = { customer: SC.discover, front: SC.design, back: SC.grow, support: SC.build };
export const ROW_LABEL: Record<BlueprintRow, string> = { customer: 'Customer', front: 'Frontstage', back: 'Backstage', support: 'Support' };
const LINE_LABEL: Record<(typeof BLUEPRINT_LINES)[number], string> = { interaction: 'Line of interaction', visibility: 'Line of visibility', internal: 'Line of internal interaction' };
export const STEP_SHORT: Record<NabzStep, string> = {
  book: 'Books a 7:00 test', slots: 'Slot engine sells 7:00', route: 'Gets route at 6:15', eta: '“12 minutes away”',
  fasting: 'Fasting, calls at 7:40', agent: 'Agent: “on her way”', draw: 'Labels tubes, draws', hub: 'Cool box to the hub',
  rider: 'Rider to central lab', signoff: 'Analyser, pathologist', whatsapp: 'Report on WhatsApp', read: 'Reads HbA1c 6.4%',
};
const STEPS = Object.keys(NABZ_STEPS) as NabzStep[];
const FAILS = failPoints() as NabzStep[];

/** Board geometry: a label column, then one column per phase, one band per row. */
export const BOARD = { w: 780, h: 372, label: 120, col: 165, head: 30, row: 84 };
/** Top-left of a step's card on the board (cards stack inside their cell). */
export const stepPos = (k: NabzStep) => {
  const s = NABZ_STEPS[k], r = blueprintRow(s);
  const inCell = STEPS.filter(o => blueprintRow(NABZ_STEPS[o]) === r && NABZ_STEPS[o].phase === s.phase);
  const n = inCell.length, i = inCell.indexOf(k), ch = n > 2 ? 24 : 32;
  const top = (BOARD.row - n * ch - (n - 1) * 3) / 2;
  return { x: BOARD.label + BLUEPRINT_PHASES.indexOf(s.phase) * BOARD.col + 6, y: BOARD.head + BLUEPRINT_ROWS.indexOf(r) * BOARD.row + top + i * (ch + 3), w: BOARD.col - 12, h: ch };
};

/** The blueprint board: rows, lines, phases, and the steps placed so far. `fails` marks placed fail points. */
export function BlueprintBoard({ placed, fails = false, hot, k = 1 }: { placed: readonly NabzStep[]; fails?: boolean; hot?: NabzStep; k?: number }) {
  return (
    <g opacity={k}>
      {BLUEPRINT_ROWS.map((r, i) => (
        <g key={r}>
          <rect x={0} y={BOARD.head + i * BOARD.row} width={BOARD.w} height={BOARD.row} fill={ROW_TONE[r]} opacity={0.08} />
          <rect x={0} y={BOARD.head + i * BOARD.row + 6} width={4} height={BOARD.row - 12} rx={2} fill={ROW_TONE[r]} />
          <text x={12} y={BOARD.head + i * BOARD.row + BOARD.row / 2 + 4} fontSize={13} fontWeight={900} fill={SC.text}>{ROW_LABEL[r]}</text>
        </g>
      ))}
      {BLUEPRINT_PHASES.map((ph, i) => (
        <g key={ph}>
          <text x={BOARD.label + i * BOARD.col + 6} y={18} fontSize={12} fontWeight={900} fill={SC.muted}>{PHASE_LABEL[ph].toUpperCase()}</text>
          {i > 0 && <line x1={BOARD.label + i * BOARD.col} x2={BOARD.label + i * BOARD.col} y1={BOARD.head} y2={BOARD.h} stroke={SC.line} strokeDasharray="3 5" />}
        </g>
      ))}
      {BLUEPRINT_LINES.map((l, i) => {
        const y = BOARD.head + (i + 1) * BOARD.row;
        return (
          <g key={l}>
            <line x1={0} x2={BOARD.w} y1={y} y2={y} stroke={l === 'visibility' ? SC.text : SC.muted} strokeWidth={l === 'visibility' ? 2 : 1.4} strokeDasharray={l === 'visibility' ? undefined : '7 5'} />
            <text x={BOARD.w - 4} y={y - 4} fontSize={10} fontWeight={800} fill={SC.muted} textAnchor="end">{LINE_LABEL[l]}</text>
          </g>
        );
      })}
      {placed.map(s => {
        const { x, y, w, h } = stepPos(s);
        const fail = fails && FAILS.includes(s);
        return (
          <g key={s}>
            <rect x={x} y={y} width={w} height={h} rx={7} fill={SC.surface} stroke={fail ? SC.error : ROW_TONE[blueprintRow(NABZ_STEPS[s])]} strokeWidth={hot === s || fail ? 3 : 2} />
            <text x={x + 8} y={y + h / 2 + 4} fontSize={h > 26 ? 12 : 11} fontWeight={800} fill={SC.text}>{STEP_SHORT[s]}</text>
            {fail && (
              <g transform={`translate(${x + w - 2} ${y + 2})`}>
                <circle r={9} fill={SC.surface} stroke={SC.error} strokeWidth={2.5} />
                <text y={4} fontSize={12} fontWeight={900} fill={SC.error} textAnchor="middle">!</text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}

function Phone({ x, y, title, children, k = 1, ok }: { x: number; y: number; title: string; children: React.ReactNode; k?: number; ok?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={k}>
      <rect width={200} height={300} rx={26} fill={SC.surface} stroke={SC.line} strokeWidth={3} />
      <rect x={76} y={10} width={48} height={6} rx={3} fill={SC.line} />
      <text x={20} y={48} fontSize={15} fontWeight={900} fill={SC.text}>{title}</text>
      {children}
      {ok !== undefined && (
        <g transform="translate(170 26)" opacity={ok}>
          <circle r={14} fill={SC.surface} stroke={SC.mint} strokeWidth={3} />
          <path d="M-6 0 l4 5 l8 -9" fill="none" stroke={SC.mint} strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

export function ServiceBlueprintScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? '7:40, still fasting' : t < 11 ? 'The screens look fine' : t < 16 ? 'Four rows, three lines' : t < 21 ? 'Down the rows' : t < 26 ? 'The blind agent' : t < 31 ? 'Fail points' : 'Fix below the line';
  const OX = 90, OY = 118;
  const shown = t < 16 ? STEPS.filter((s, i) => blueprintRow(NABZ_STEPS[s]) === 'customer' && t > 13 + i * 0.12) : t < 26 ? STEPS.filter(s => ['book', 'fasting', 'eta', 'slots', 'agent', 'route', 'draw'].includes(s)) : STEPS;
  const late = stepPos('fasting'), slot = stepPos('slots'), agent = stepPos('agent'), route = stepPos('route');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a customer who has fasted since 8 pm waits for a 7:00 home blood test that is 40 minutes late. The app's screens all test well, so the designer draws a service blueprint with four rows (customer actions, frontstage, backstage, support processes) and three lines. Following the late visit down the rows leads to the slot engine, which sells 7:00 visits without counting travel time between homes. The support agent can't see the phlebotomist's route, so she guesses. Four fail points are marked, three below the line of visibility. Fixing them below the line cuts late 7:00 visits from 1 in 6 to 1 in 20.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <Phone x={140} y={110} title="Your test today">
              <text x={20} y={84} fontSize={12} fontWeight={800} fill={SC.muted}>Booked for 7:00–7:30</text>
              <rect x={20} y={100} width={160} height={88} rx={14} fill={SC.soft} />
              <circle cx={56} cy={144} r={18} fill={SC.design} opacity={0.3} />
              <text x={82} y={140} fontSize={13} fontWeight={900} fill={SC.text}>Lakshmi is</text>
              <text x={82} y={158} fontSize={13} fontWeight={900} fill={SC.text}>12 min away</text>
              {[0, 1, 2].map(i => (
                <text key={i} x={20} y={222 + i * 20} fontSize={11.5} fontWeight={800} fill={SC.muted} opacity={p(t, 0.8 + i * 1.1, 1.2 + i * 1.1)}>{['7:12', '7:26', '7:40'][i]} · “12 minutes away”</text>
              ))}
            </Phone>
            <g transform="translate(440 150)">
              <text fontSize={64} fontWeight={900} fill={SC.text} opacity={p(t, 1, 1.6)}>7:40</text>
              <text y={32} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 1.4, 2)}>Mr Reddy, fasting since 8 pm</text>
              <text y={130} fontSize={56} fontWeight={900} fill={SC.text} opacity={p(t, 3, 3.6)}>1 in 6</text>
              <text y={160} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 3.4, 4)}>7:00 visits arrive 30+ minutes late</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {(['Book', 'Track', 'Report'] as const).map((s, i) => (
              <Phone key={s} x={110 + i * 260} y={110} title={s} k={p(t, 6.2 + i * 0.4, 6.7 + i * 0.4)} ok={p(t, 7.6 + i * 0.4, 8 + i * 0.4)}>
                {[0, 1, 2, 3].map(r => <rect key={r} x={20} y={74 + r * 46} width={[150, 120, 160, 100][r]} height={30} rx={8} fill={SC.soft} />)}
                <rect x={20} y={256} width={160} height={30} rx={15} fill={SC.brand} opacity={0.85} />
              </Phone>
            ))}
            <text x={110} y={460} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 8.6, 9.2)}>Every screen tests well. The lateness isn’t on any of them.</text>
          </g>
        )}

        {t >= 11 && (
          <g transform={`translate(${OX} ${OY})`}>
            <BlueprintBoard placed={shown} fails={t >= 26} hot={t >= 16 && t < 21 ? 'slots' : t >= 21 && t < 26 ? 'agent' : undefined} k={p(t, 11.1, 11.8)} />

            {t >= 16 && t < 21 && (
              <g>
                <path d={`M${late.x + late.w / 2} ${late.y + late.h} C${late.x + late.w / 2} ${late.y + 150} ${slot.x + slot.w + 60} ${slot.y - 40} ${slot.x + slot.w} ${slot.y + slot.h / 2}`}
                  fill="none" stroke={SC.error} strokeWidth={3} strokeDasharray="420" strokeDashoffset={lerp(420, 0, p(t, 16.4, 18))} />
                <g transform={`translate(${slot.x} ${slot.y + slot.h + 8})`} opacity={p(t, 18, 18.6)}>
                  <rect width={330} height={30} rx={8} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
                  <text x={10} y={20} fontSize={12} fontWeight={800} fill={SC.text}>Counts people on shift, not travel between homes</text>
                </g>
              </g>
            )}

            {t >= 21 && t < 26 && (
              <g>
                <path d={`M${agent.x + agent.w / 2} ${agent.y + agent.h} L${route.x + route.w / 2} ${route.y}`} stroke={SC.error} strokeWidth={3} strokeDasharray="6 6" opacity={p(t, 21.4, 22)} />
                <g transform={`translate(${(agent.x + route.x + agent.w) / 2} ${(agent.y + agent.h + route.y) / 2})`} opacity={p(t, 22, 22.6)}>
                  <circle r={14} fill={SC.surface} stroke={SC.error} strokeWidth={2.5} />
                  <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke={SC.error} strokeWidth={3} strokeLinecap="round" />
                </g>
                <text x={0} y={BOARD.h + 34} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 22.6, 23.2)}>The app knows where Lakshmi is. The agent on the phone doesn’t, so she guesses.</text>
              </g>
            )}

            {t >= 26 && t < 31 && (
              <text x={0} y={BOARD.h + 34} fontSize={16} fontWeight={900} fill={SC.text} opacity={p(t, 27, 27.6)}>
                {FAILS.length} fail points, {FAILS.filter(s => blueprintRow(NABZ_STEPS[s]) !== 'front').length} of them below the line of visibility
              </text>
            )}

            {t >= 31 && (
              <g>
                <rect x={-20} y={BOARD.head - 6} width={BOARD.w + 40} height={BOARD.h - BOARD.head + 60} rx={18} fill={SC.soft} opacity={p(t, 31, 31.6) * 0.92} />
                {['Slots count travel time between homes', 'Routes go out the evening before', 'The agent sees the route and live location', 'Hub pickups every two hours'].map((f, i) => (
                  <g key={f} transform={`translate(20 ${60 + i * 50})`} opacity={p(t, 31.4 + i * 0.5, 31.9 + i * 0.5)}>
                    <rect width={420} height={40} rx={10} fill={SC.surface} stroke={SC.mint} strokeWidth={2.5} />
                    <text x={16} y={25} fontSize={14} fontWeight={800} fill={SC.text}>{f}</text>
                  </g>
                ))}
                <g transform="translate(500 70)" opacity={p(t, 33.4, 34)}>
                  <text fontSize={14} fontWeight={900} fill={SC.muted}>LATE 7:00 VISITS</text>
                  <rect y={20} width={240} height={30} rx={8} fill={SC.error} opacity={0.35} />
                  <text x={250} y={41} fontSize={15} fontWeight={900} fill={SC.text}>1 in 6</text>
                  <rect y={66} width={lerp(240, 50, p(t, 34, 35.2))} height={30} rx={8} fill={SC.mint} opacity={0.6} />
                  <text x={lerp(250, 60, p(t, 34, 35.2))} y={87} fontSize={15} fontWeight={900} fill={SC.text}>1 in 20</text>
                </g>
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
