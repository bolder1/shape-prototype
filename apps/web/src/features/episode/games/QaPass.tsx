'use client';
// Mini-game for dc.2-2: run the QA pass. Every card is a difference between Sana's design and Ritesh's build (its
// `visual`, a key of `GAADI_QA`), shown as expected beside actual on `QA_DEVICE`. Decide what happens to it
// (`QA_LANES`): it blocks the release, it's fixed this sprint, or you let it go (`qaLane`). A right call files the
// ticket (`qaTicket`) on a three-column board, and the release gate at the top reads `qaVerdict` of the blockers
// filed so far. A miss explains and the card comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { GAADI_QA, QA_DEVICE, qaLane, qaTicket, qaVerdict, type Episode, type GaadiQa, type QaLane } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { QA_SHORT, QA_TONE } from '../scenes/DesignQa';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Gate({ filed }: { filed: GaadiQa[] }) {
  const blockers = filed.filter(k => qaLane(GAADI_QA[k]) === 'blocker');
  const ship = qaVerdict(filed.map(k => GAADI_QA[k])) === 'ship';
  return (
    <div className={cx('flex items-center justify-between gap-3 rounded-xl px-4 py-3 ring-2 ring-inset', ship ? 'bg-success-primary ring-mint-600' : 'bg-error-primary ring-error')} role="status">
      <span className={cx('text-sm font-bold', ship ? 'text-success-primary' : 'text-error-primary')}>{ship ? 'Release gate: clear so far' : `Release gate: hold, ${blockers.length} blocker${blockers.length === 1 ? '' : 's'} open`}</span>
      <span className="text-xs font-semibold text-tertiary">{QA_DEVICE}</span>
    </div>
  );
}

function Board({ game, filed, hot }: { game: Game; filed: GaadiQa[]; hot?: GaadiQa }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {game.lanes.map(l => {
        const ks = filed.filter(k => qaLane(GAADI_QA[k]) === l.id);
        return (
          <div key={l.id} className="flex min-h-24 flex-col gap-1.5 rounded-xl bg-secondary p-3">
            <span className="flex items-center gap-1.5 text-sm font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: QA_TONE[l.id as QaLane] }} aria-hidden />{l.label} · {ks.length}</span>
            {ks.map(k => (
              <motion.span key={k} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop}
                className={cx('rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-inset', hot === k ? 'ring-mint-600' : 'ring-secondary', l.id === 'pass' && 'text-tertiary line-through')}>
                {QA_SHORT[k]}
              </motion.span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function QaPass({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [filed, setFiled] = useState<GaadiQa[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const blockers = filed.filter(k => qaLane(GAADI_QA[k]) === 'blocker').length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="QA pass done" title={`${n} of ${game.cards.length} called first time`}>
          {`${blockers} blockers hold the release until they’re fixed and re-tested. The drift goes into this sprint, and the noise never becomes a ticket.`}
        </StageTitle>
        <Board game={game} filed={filed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Re-test the blockers on the same phone and settings you found them on. A fix that works on the engineer’s laptop isn’t a fix yet.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as GaadiQa;
  const q = GAADI_QA[k];
  const lane = qaLane(q);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setFiled(f => [...f, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <Gate filed={filed} />
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{q.where}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('grid gap-3 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset sm:grid-cols-2', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card aria-label={card.label}>
        <div className="flex flex-col gap-1 rounded-xl bg-secondary p-3">
          <span className="text-xs font-bold text-tertiary">Design and spec</span>
          <span className="text-md font-semibold text-primary">{q.expected}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl bg-secondary p-3">
          <span className="text-xs font-bold text-tertiary">The build</span>
          <span className="text-md font-semibold text-primary">{q.actual}</span>
        </div>
      </motion.div>
      <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="What happens to it">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: QA_TONE[l.id as QaLane] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: it’s <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            {lane !== 'pass' && <p className="rounded-xl bg-secondary px-4 py-3 font-mono text-xs text-secondary">{qaTicket(q)}</p>}
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next finding' : 'See the board'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does it break the task, the money or someone’s access? Or does it only drift from the spec? Or would nobody ever notice?</NibSays>}
      </div>
      <Board game={game} filed={filed} hot={right ? k : undefined} />
    </div>
  );
}
