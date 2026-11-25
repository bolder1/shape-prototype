'use client';
// Mini-game for rs.6-1: build Musafir's January–June research roadmap. Every card is a request from Lavanya's inbox
// (its `visual`, a key of `MUSAFIR_REQUESTS`), shown with the decision it feeds, the week that decision is made
// (`weekDate`) and the study's length, on a timeline of the half. Put it in Q1, Q2, the backlog, or out (`SLOTS`,
// scored by `roadmapSlot`). A right call draws the study scheduled backwards from its decision (`studyWeeks`) and
// adds it to the roadmap beside, with the team's load per week (`weekLoad`) against `RESEARCHERS`. A miss explains and
// the card comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HALF_WEEKS, MUSAFIR_REQUESTS, Q1_END, RESEARCHERS, roadmapSlot, studyWeeks, weekDate, weekLoad, type Episode, type MusafirRequest, type Slot } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { SLOT_TONE } from '../scenes/RoadmapPlan';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const TW = 520, X0 = 8, WK = (TW - 16) / HALF_WEEKS;
const tx = (w: number) => X0 + (w - 1) * WK;

/** The half as a strip: Q1 | Q2, the decision flag (or where it falls), and the study once placed. */
function Timeline({ k, placed }: { k: MusafirRequest; placed: boolean }) {
  const r = MUSAFIR_REQUESTS[k];
  const weeks = studyWeeks(r);
  const slot = roadmapSlot(r);
  const show = placed && weeks && (slot === 'q1' || slot === 'q2');
  return (
    <svg viewBox={`0 0 ${TW} 92`} className="w-full" role="img" aria-label={r.due === null ? 'No decision on the timeline' : r.due > HALF_WEEKS ? 'The decision falls after June' : `Decision on ${weekDate(r.due)}`}>
      <rect x={X0} y={6} width={Q1_END * WK} height={20} rx={5} fill={SLOT_TONE.q1} opacity={0.14} />
      <rect x={tx(Q1_END + 1)} y={6} width={(HALF_WEEKS - Q1_END) * WK} height={20} rx={5} fill={SLOT_TONE.q2} opacity={0.14} />
      <text x={X0 + 6} y={20} fontSize={11} fontWeight={800} fill="var(--color-text-secondary)">Q1</text>
      <text x={tx(Q1_END + 1) + 6} y={20} fontSize={11} fontWeight={800} fill="var(--color-text-secondary)">Q2</text>
      <line x1={X0} x2={tx(HALF_WEEKS + 1)} y1={60} y2={60} stroke="var(--color-border-secondary)" strokeWidth={2} />
      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => <text key={m} x={tx([1, 5, 9, 14, 18, 22][i]) + 2} y={84} fontSize={10.5} fontWeight={700} fill="var(--color-text-tertiary)">{m}</text>)}
      {r.due !== null && r.due <= HALF_WEEKS && (
        <g transform={`translate(${tx(r.due) + WK / 2} 60)`}>
          <line y1={0} y2={-26} stroke="var(--color-text-primary)" strokeWidth={2} />
          <path d="M0 -26 l11 4 l-11 4 z" fill="var(--color-bg-brand-solid)" />
        </g>
      )}
      {r.due !== null && r.due > HALF_WEEKS && <text x={tx(HALF_WEEKS + 1)} y={52} fontSize={11.5} fontWeight={800} textAnchor="end" fill="var(--color-text-primary)">Decided after June →</text>}
      {r.due === null && <text x={TW / 2} y={52} fontSize={11.5} fontWeight={800} textAnchor="middle" fill="var(--color-text-tertiary)">No decision waits on this</text>}
      {show && (
        <motion.rect initial={{ width: 0, x: tx(weeks[1] + 1) }} animate={{ width: (weeks[1] - weeks[0] + 1) * WK, x: tx(weeks[0]) }} transition={{ duration: 0.7, ease: 'easeOut' }}
          y={36} height={16} rx={4} fill="var(--color-bg-primary)" stroke={SLOT_TONE[slot]} strokeWidth={2.5} />
      )}
    </svg>
  );
}

function Roadmap({ placed, hot }: { placed: MusafirRequest[]; hot?: MusafirRequest }) {
  const load = weekLoad(placed.map(k => MUSAFIR_REQUESTS[k]));
  const groups: { slot: Slot; title: string }[] = [{ slot: 'q1', title: 'Q1' }, { slot: 'q2', title: 'Q2' }, { slot: 'backlog', title: 'Backlog' }, { slot: 'none', title: 'Not a study' }];
  return (
    <div className="flex flex-col gap-3 self-start rounded-2xl bg-secondary p-3" aria-label="Musafir’s research roadmap">
      <p className="px-1 text-xs font-bold tracking-wide text-tertiary uppercase">Roadmap · Jan–Jun 2027</p>
      {groups.map(g => {
        const ks = placed.filter(k => roadmapSlot(MUSAFIR_REQUESTS[k]) === g.slot);
        return (
          <div key={g.slot} className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 px-1 text-xs font-bold text-secondary"><span className="size-2 rounded-full" style={{ background: SLOT_TONE[g.slot] }} aria-hidden />{g.title}</span>
            {ks.length === 0 && <span className="px-1 text-xs text-quaternary">Nothing yet</span>}
            {ks.map(k => {
              const r = MUSAFIR_REQUESTS[k], w = studyWeeks(r);
              return (
                <motion.div key={k} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
                  className={cx('rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-inset', hot === k ? 'ring-mint-600' : 'ring-secondary')}>
                  {r.decision ?? r.text}
                  {(g.slot === 'q1' || g.slot === 'q2') && w && <span className="block font-medium text-tertiary">Starts by {weekDate(w[0])} · lands before {weekDate(r.due!)}</span>}
                </motion.div>
              );
            })}
          </div>
        );
      })}
      <div className="flex flex-col gap-1 px-1">
        <span className="text-xs font-bold text-secondary">Studies running each week</span>
        <div className="flex h-10 items-end gap-px" role="img" aria-label={`Busiest week: ${Math.max(0, ...load)} studies, for ${RESEARCHERS} researchers`}>
          {load.map((n, i) => <span key={i} className="flex-1 rounded-sm" style={{ height: `${(n / RESEARCHERS) * 100}%`, minHeight: 2, background: n >= RESEARCHERS ? SLOT_TONE.q2 : SLOT_TONE.q1, opacity: n ? 0.85 : 0.2 }} />)}
        </div>
      </div>
    </div>
  );
}

export function RoadmapSlot({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<MusafirRequest[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const peak = Math.max(...weekLoad(placed.map(k => MUSAFIR_REQUESTS[k])));
    const count = (s: Slot) => placed.filter(k => roadmapSlot(MUSAFIR_REQUESTS[k]) === s).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Roadmap done" title={`${n} of ${game.cards.length} placed first time`}>
          {count('q1') + count('q2')} studies tied to decisions, never more than {peak} at once for {RESEARCHERS} researchers; {count('backlog')} in the backlog and {count('none')} handled without a study.
        </StageTitle>
        <Roadmap placed={placed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>No decision, or already answered: not a study. Cheap to reverse, or decided after June: backlog. Otherwise count back from the decision date, and the quarter it lands in is the quarter it starts.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as MusafirRequest;
  const r = MUSAFIR_REQUESTS[k];
  const lane = roadmapSlot(r);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,18rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">In the inbox</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0, rotate: 1 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1, rotate: 0 } : { y: 0, opacity: 1, rotate: 0 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <span className="text-xs font-semibold text-tertiary">From {r.from}</span>
            <p className="text-lg font-semibold text-primary">{card.label}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="font-semibold text-tertiary">Feeds</dt><dd className="text-primary">{r.decision ?? 'No decision named'}</dd>
              <dt className="font-semibold text-tertiary">Decided</dt><dd className="text-primary">{r.due === null ? '—' : r.due > HALF_WEEKS ? `${weekDate(r.due)}, after the half` : weekDate(r.due)}</dd>
              <dt className="font-semibold text-tertiary">Study</dt><dd className="text-primary">{r.weeks} weeks, recruiting to readout</dd>
              <dt className="font-semibold text-tertiary">Stakes</dt><dd className="text-primary">{r.stakes === 'low' ? 'Cheap to reverse, easy to test live' : 'Hard to undo'}</dd>
              {r.known && <><dt className="font-semibold text-tertiary">Repository</dt><dd className="text-primary">Answered: refund interviews, Aug 2026, and 1,400 tagged tickets</dd></>}
            </dl>
            <Timeline k={k} placed={right} />
          </motion.div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Where it goes">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: SLOT_TONE[l.id as Slot] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next request' : 'See the roadmap'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Does a decision wait on it, and is it already answered? Is it hard to undo? Then count back the study’s weeks from the decision date.</NibSays>}
          </div>
        </div>
        <Roadmap placed={placed} hot={right ? k : undefined} />
      </div>
    </div>
  );
}
