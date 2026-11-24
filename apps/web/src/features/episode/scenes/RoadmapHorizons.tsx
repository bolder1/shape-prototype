'use client';
// Scene for st.2-2: Rohan's roadmap is a Gantt chart of Galla features with months. Voice entry runs long, everything
// behind it slides, three bars turn red and sales has promised loans for August. Ishita redraws it as Now, Next and
// Later, fading from solid to faint, renames a feature as the problem it solves, then drops each bet into the column
// `horizonFor` gives it: evidence first, then what it builds on (the UPI link lands in Now and slides to Next, behind
// reminders). The GST suite and dark mode leave the board. `HORIZON_FILL`, `HORIZON_NAME`, `BetCard` and the evidence
// names are shared with the Lay out the roadmap game. Pure function of t (0–36).
import { GALLA_BETS, HORIZONS, horizonFor, type Evidence, type GallaBet, type Horizon } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';
import { GALLA } from './VisionNarrative';

const W = 960, H = 540;
/** Column colours; white on each passes 4.5:1. */
export const HORIZON_FILL: Record<Horizon, string> = { now: '#155EEF', next: '#6941C6', later: '#475467', off: '#B42318' };
export const HORIZON_NAME: Record<Horizon, string> = { now: 'Now', next: 'Next', later: 'Later', off: 'Off the board' };
/** How sure each column is, drawn as the card's border: solid, dashed, dotted. */
export const HORIZON_DASH: Record<Horizon, string | undefined> = { now: undefined, next: '7 5', later: '2 5', off: '2 5' };
export const EVIDENCE_NAME: Record<Evidence, string> = { tested: 'Fix tested', proven: 'Problem proven', signal: 'A signal' };

/** What the team calls each bet, for “after …” tags. */
export const BET_NAME: Record<GallaBet, string> = { reminders: 'reminders', backup: 'backup', collect: 'the UPI link', disputes: 'statements', voice: 'voice entry', stock: 'stock alerts', reorder: 'reorder', loans: 'loans', gst: 'the GST suite', dark: 'dark mode' };

/** A bet on the board, 200 × 46: its short problem, an evidence tag, and a border as sure as its column. */
export function BetCard({ x, y, bet, at, k = 1, w = 200 }: { x: number; y: number; bet: GallaBet; at: Horizon; k?: number; w?: number }) {
  const b = GALLA_BETS[bet];
  return (
    <g transform={`translate(${x} ${y})`} opacity={k}>
      <rect width={w} height={46} rx={10} fill="#FFFFFF" stroke={HORIZON_FILL[at]} strokeWidth={2} strokeDasharray={HORIZON_DASH[at]} />
      <text x={12} y={20} fontSize={12} fontWeight={900} fill={INK}>{b.short}</text>
      <text x={12} y={37} fontSize={10.5} fontWeight={800} fill={INK_MUTED}>{EVIDENCE_NAME[b.evidence]}{'after' in b ? ` · after ${BET_NAME[b.after]}` : ''}</text>
    </g>
  );
}

/** The Gantt chart's bars: which feature, its planned months (0 = Jan), and how far it slips. */
const GANTT: { bet: GallaBet; from: number; len: number; slip: number }[] = [
  { bet: 'reminders', from: 0, len: 2, slip: 0 }, { bet: 'backup', from: 1, len: 2, slip: 0 }, { bet: 'voice', from: 2, len: 2, slip: 2 },
  { bet: 'collect', from: 4, len: 1, slip: 2 }, { bet: 'stock', from: 4, len: 2, slip: 2 }, { bet: 'disputes', from: 5, len: 1, slip: 2 },
  { bet: 'gst', from: 6, len: 2, slip: 2 }, { bet: 'loans', from: 7, len: 1, slip: 2 }, { bet: 'reorder', from: 8, len: 1, slip: 2 }, { bet: 'dark', from: 9, len: 1, slip: 1 },
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

/** Columns of the board: x, width. */
export const COL: Record<Horizon, { x: number; w: number }> = { now: { x: 40, w: 220 }, next: { x: 280, w: 220 }, later: { x: 520, w: 220 }, off: { x: 760, w: 170 } };
/** Order bets drop in, and when. */
const DROPS: { bet: GallaBet; at: number }[] = [
  { bet: 'reminders', at: 22.4 }, { bet: 'backup', at: 22.9 }, { bet: 'voice', at: 23.4 }, { bet: 'stock', at: 23.9 }, { bet: 'disputes', at: 24.4 },
  { bet: 'loans', at: 24.9 }, { bet: 'reorder', at: 25.4 }, { bet: 'collect', at: 27.4 }, { bet: 'gst', at: 31.4 }, { bet: 'dark', at: 32 },
];

export function RoadmapHorizonsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const gantt = t < 12.6 ? 1 - p(t, 12, 12.6) : 0;
  const board = t >= 12 ? p(t, 12.4, 13.2) : 0;
  const slip = p(t, 6.4, 9);

  // Where each bet sits on the board, and its row inside that column.
  const rows: Partial<Record<Horizon, GallaBet[]>> = {};
  for (const d of DROPS) {
    if (t < d.at) continue;
    const final = horizonFor(GALLA_BETS[d.bet], GALLA_BETS);
    const at: Horizon = d.bet === 'collect' && t < 28.8 ? 'now' : final;
    (rows[at] ??= []).push(d.bet);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Galla's roadmap starts as a Gantt chart of features with months, and slips until three bars are late; it is redrawn as Now, Next and Later columns of problems, fading from solid to faint, and each bet drops into a column by its evidence and what it builds on, while the GST suite and dark mode leave the board">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        {gantt > 0 && (
          <g opacity={gantt}>
            <text x={40} y={56} fontSize={24} fontWeight={900} fill={SC.text}>Galla roadmap 2027</text>
            <text x={40} y={82} fontSize={14} fontWeight={800} fill={SC.muted}>Rohan · ten features, ten months</text>
            {MONTHS.map((m, i) => (
              <g key={m}>
                <line x1={250 + i * 68} x2={250 + i * 68} y1={100} y2={480} stroke={SC.line} />
                <text x={284 + i * 68} y={118} textAnchor="middle" fontSize={12} fontWeight={900} fill={SC.muted}>{m}</text>
              </g>
            ))}
            {GANTT.map((g, i) => {
              const s = g.slip * slip, late = g.slip >= 2 && slip > 0.6 && (g.bet === 'collect' || g.bet === 'stock' || g.bet === 'loans');
              const x = 250 + (g.from + s) * 68;
              return (
                <g key={g.bet} opacity={p(t, 0.4 + i * 0.25, 0.8 + i * 0.25)}>
                  <text x={40} y={150 + i * 34} fontSize={12} fontWeight={800} fill={SC.text}>{GALLA_BETS[g.bet].idea}</text>
                  <rect x={x + 3} y={135 + i * 34} width={Math.min(g.len * 68 - 6, 930 - x)} height={22} rx={6} fill={late ? '#B42318' : GALLA} />
                </g>
              );
            })}
            {t >= 6 && (
              <g transform="translate(700 50)" opacity={p(t, 9.4, 10)}>
                <rect width={220} height={56} rx={6} fill="#FDE272" transform="rotate(3)" />
                <text x={16} y={24} fontSize={13} fontWeight={900} fill={INK} transform="rotate(3)">Sales to a distributor:</text>
                <text x={16} y={44} fontSize={13} fontWeight={800} fill={INK} transform="rotate(3)">“Loans live by August!”</text>
              </g>
            )}
          </g>
        )}

        {board > 0 && (
          <g opacity={board}>
            <text x={40} y={50} fontSize={22} fontWeight={900} fill={SC.text}>{t < 17 ? 'Columns of certainty, no dates' : t < 22 ? 'Name the problem, not the feature' : t < 31 ? 'Evidence sets the column' : 'Off the board, with a reason'}</text>
            {HORIZONS.map((h, i) => (
              <g key={h} opacity={p(t, 12.6 + i * 0.4, 13.2 + i * 0.4)}>
                <rect x={COL[h].x} y={74} width={COL[h].w} height={420} rx={16} fill={SC.surface} stroke={HORIZON_FILL[h]} strokeWidth={2} strokeDasharray={HORIZON_DASH[h]} opacity={h === 'later' ? 0.7 : 1} />
                <rect x={COL[h].x + 12} y={86} width={h === 'off' ? 110 : 64} height={26} rx={13} fill={HORIZON_FILL[h]} />
                <text x={COL[h].x + 12 + (h === 'off' ? 55 : 32)} y={104} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF">{HORIZON_NAME[h]}</text>
                <text x={COL[h].x + 16} y={136} fontSize={11.5} fontWeight={800} fill={SC.muted} opacity={t < 22 ? p(t, 14 + i * 0.5, 14.5 + i * 0.5) : 0}>
                  {['Committed, detailed', 'Shaped, still open', 'Fuzzy on purpose', 'Doesn’t serve the vision'][i]}
                </text>
              </g>
            ))}
            {t >= 17 && t < 22.2 && (
              <g transform={`translate(${COL.now.x + 10} 160)`}>
                <rect width={200} height={64} rx={10} fill="#FFFFFF" stroke={HORIZON_FILL.now} strokeWidth={2} />
                <text x={12} y={26} fontSize={13} fontWeight={900} fill={INK} opacity={1 - p(t, 18.6, 19.2)} textDecoration={t > 18 ? 'line-through' : undefined}>Automatic WhatsApp reminders</text>
                <text x={12} y={26} fontSize={13} fontWeight={900} fill={INK} opacity={p(t, 19, 19.6)}>Customers forget what they owe</text>
                <text x={12} y={48} fontSize={11} fontWeight={800} fill={INK_MUTED} opacity={p(t, 19.8, 20.4)}>The fix can change. The problem won’t.</text>
              </g>
            )}
            {(Object.entries(rows) as [Horizon, GallaBet[]][]).map(([h, bets]) => bets.map((bet, r) => {
              const drop = DROPS.find(d => d.bet === bet)!;
              const k = bet === 'collect' && h === 'next' ? 1 : p(t, drop.at, drop.at + 0.5);
              const moving = bet === 'collect' && h === 'next', q = p(t, 28.8, 29.6);
              const x = COL[h].x + 10 + (moving ? lerp(COL.now.x - COL.next.x, 0, q) : 0);
              const y = moving ? lerp(150 + 2 * 56, 150 + r * 56, q) : lerp(120, 150 + r * 56, k);
              return <BetCard key={bet} x={x} y={y} bet={bet} at={h} k={k} w={h === 'off' ? 150 : 200} />;
            }))}
            {t >= 27 && t < 31 && (
              <g opacity={p(t, 27.8, 28.3) * (1 - p(t, 30.4, 31))}>
                <path d={`M${COL.now.x + 210} 173 C ${COL.now.x + 250} 173 ${COL.next.x - 20} ${lerp(173, 320, p(t, 28.8, 29.6))} ${COL.next.x + 8} ${lerp(173, 320, p(t, 28.8, 29.6))}`} fill="none" stroke={HORIZON_FILL.next} strokeWidth={3} strokeDasharray="6 4" />
                <text x={COL.next.x + 10} y={470} fontSize={12.5} fontWeight={900} fill={SC.text}>It lives inside the reminder:</text>
                <text x={COL.next.x + 10} y={488} fontSize={12.5} fontWeight={900} fill={SC.text}>one column after it</text>
              </g>
            )}
            {t >= 31 && (
              <text x={COL.off.x + 10} y={470} fontSize={12} fontWeight={900} fill={HORIZON_FILL.off} opacity={p(t, 32.6, 33.2)}>
                <tspan x={COL.off.x + 10} dy={0}>“Not for kirana udhaar,</tspan>
                <tspan x={COL.off.x + 10} dy={16}>so not this year.”</tspan>
              </text>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
