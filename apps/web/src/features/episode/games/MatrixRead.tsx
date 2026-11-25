'use client';
// Mini-game for fd.4-1: read the matrix. Every card is one of Haat's open decisions (its `visual`, a key of
// `HAAT_DECISIONS`), drawn as a trade-off matrix. The player weighs it through each person's lens and swings a guessed
// score low or high (`withCell`); totals, the winner and options struck out by a must-have update live (`weighted`,
// `winner`, `clearsMusts`). Then they say what kind of call it is (`MATRIX_CALLS`, scored by `matrixCall`). Right
// calls file under their kind on the side board. A miss explains and the card comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HAAT_DECISIONS, clearsMusts, matrixCall, weighted, winner, withCell, type Episode, type HaatDecision, type MatrixCall, type TradeDecision } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { MATRIX_TONE } from '../scenes/TradeoffMatrix';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const SHORT: Record<HaatDecision, string> = {
  fee: 'Delivery fee', reorder: 'Home screen top', paylater: 'Pay later', substitute: 'Out-of-stock items',
  search: 'Search-first home', tenmin: '10-minute promise', cod: 'Cash on delivery', bulkprice: 'Bulk price edits',
};

function Table({ d, lens, cell }: { d: TradeDecision; lens: number; cell?: number }) {
  const m = cell === undefined ? d : withCell(d, cell);
  const w = d.lenses[lens].weights;
  const best = winner(m, w);
  return (
    <div className="overflow-x-auto rounded-2xl bg-primary ring-1 ring-secondary ring-inset">
      <table className="w-full min-w-[30rem] border-collapse text-left">
        <caption className="sr-only">Options scored 1 to 5 on each criterion, weighted as {d.lenses[lens].who} would</caption>
        <thead>
          <tr className="text-xs font-semibold text-tertiary">
            <th scope="col" className="px-3 py-2 font-semibold">Option</th>
            {d.criteria.map((c, j) => (
              <th key={c.label} scope="col" className="px-2 py-2 font-semibold">
                <span className="block text-primary">{c.label}</span>
                <span className="block tabular-nums">× {w[j]}{c.must ? ` · must ≥ ${c.must}` : ''}</span>
              </th>
            ))}
            <th scope="col" className="px-3 py-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {m.options.map((o, i) => {
            const out = !clearsMusts(m, o.scores);
            return (
              <tr key={o.label} className={cx('border-t border-secondary', best === i && 'bg-[color-mix(in_srgb,#2BC08A_14%,transparent)]')}>
                <th scope="row" className={cx('px-3 py-2.5 text-sm font-semibold text-primary', out && 'line-through decoration-2 decoration-[var(--color-fg-error-primary)] opacity-70')}>{o.label}</th>
                {o.scores.map((s, j) => {
                  const unsure = d.unsure && d.unsure.option === i && d.unsure.criterion === j;
                  return (
                    <td key={j} className="px-2 py-2.5">
                      <span className={cx('inline-flex min-w-8 justify-center rounded-md px-1.5 py-0.5 text-md font-bold tabular-nums text-primary', unsure && 'outline-2 outline-dashed outline-[var(--color-family-discover)]', d.criteria[j].must !== undefined && s < d.criteria[j].must! && 'text-error-primary')}>
                        {s}{unsure ? '?' : ''}
                      </span>
                    </td>
                  );
                })}
                <td className="px-3 py-2.5 text-right text-md font-bold tabular-nums">
                  {out ? <span className="text-error-primary">Out</span> : <span className={best === i ? 'text-primary' : 'text-tertiary'}>{weighted(o.scores, w)}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Board({ game, placed, hot }: { game: Game; placed: HaatDecision[]; hot?: HaatDecision }) {
  return (
    <div className="grid grid-cols-2 gap-2 self-start">
      {game.lanes.map(l => (
        <div key={l.id} className="flex min-h-24 flex-col gap-1.5 rounded-xl bg-secondary p-2.5">
          <span className="flex items-center gap-1.5 text-xs font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: MATRIX_TONE[l.id as MatrixCall] }} aria-hidden />{l.label}</span>
          {placed.filter(k => matrixCall(HAAT_DECISIONS[k]) === l.id).map(k => (
            <motion.span key={k} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop}
              className={cx('rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-primary ring-1 ring-inset', hot === k ? 'ring-mint-600' : 'ring-secondary')}>
              {SHORT[k]}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function MatrixRead({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<HaatDecision[]>([]);
  const [lens, setLens] = useState(0);
  const [cell, setCell] = useState<number | undefined>(undefined);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Matrices read" title={`${n} of ${game.cards.length} read first time`}>
          Two to decide today, two for Kabir’s priorities, two guesses to check, and two that need a new option before anyone scores them again.
        </StageTitle>
        <Board game={game} placed={placed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>In order: strike what fails a must-have. Weigh it as everyone in the room would. Swing the guesses. Only then look at the total.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as HaatDecision;
  const d = HAAT_DECISIONS[k];
  const lane = matrixCall(d);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const reset = () => { setLens(0); setCell(undefined); };
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); reset(); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3400); }
  };
  const next = () => { setRight(false); reset(); setDeck(dk => dk.slice(1)); };
  const swings = d.unsure ? [d.unsure.low, undefined, d.unsure.high] : [];

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,18rem)]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">Open at Haat</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('flex flex-col gap-3 rounded-2xl bg-secondary p-4 ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-transparent')} data-current-card>
            <p className="text-lg font-semibold text-primary">{card.label}</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Weigh it as">
              {d.lenses.map((l, i) => (
                <button key={l.who} type="button" aria-pressed={lens === i} onClick={() => setLens(i)}
                  className={cx('rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset transition', lens === i ? 'bg-primary text-primary ring-2 ring-[var(--color-family-design)]' : 'bg-primary text-tertiary ring-secondary hover:text-primary')}>
                  {l.who}
                </button>
              ))}
            </div>
            <Table d={d} lens={lens} cell={cell} />
            {d.unsure && (
              <div className="flex flex-col gap-2 rounded-xl bg-primary p-3 ring-1 ring-secondary ring-inset">
                <p className="text-sm font-medium text-tertiary"><span className="font-semibold text-primary">Guessed score:</span> {d.unsure.why}.</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Swing the guessed score">
                  {swings.map(v => (
                    <button key={v ?? 'base'} type="button" aria-pressed={cell === v} onClick={() => setCell(v)}
                      className={cx('rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 ring-inset transition', cell === v ? 'bg-secondary text-primary ring-2 ring-[var(--color-family-discover)]' : 'text-tertiary ring-secondary hover:text-primary')}>
                      {v === undefined ? `As guessed (${d.options[d.unsure!.option].scores[d.unsure!.criterion]})` : `If it’s really ${v}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="What kind of call is it">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: MATRIX_TONE[l.id as MatrixCall] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next decision' : 'See the board'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Does anything clear the must-haves? Does the winner change when someone else weighs it? Does it change if the guess is wrong?</NibSays>}
          </div>
        </div>
        <Board game={game} placed={placed} hot={right ? k : undefined} />
      </div>
    </div>
  );
}
