'use client';
// Mini-game for fd.4-3: Thursday design review. Every card is a request to break one of Haat's design-system rules
// (its `visual`, a key of `HAAT_BREAKS`), shown with the rule it breaks (`HAAT_RULES`). Hold the rule, test the idea,
// log an exception, or change the rule (`RULE_CALLS`, scored by `ruleCall`). Right calls stamp the rule in the
// rulebook beside it, and the end tallies the book (`rulebook`). A miss explains and the card comes back later; first
// call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HAAT_BREAKS, HAAT_RULES, ruleCall, rulebook, type Episode, type HaatBreak, type RuleCall as Call } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { RULE_TONE } from '../scenes/RuleBreak';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const STAMP: Record<Call, string> = { hold: 'Held', test: 'Testing', exception: 'Exception logged', change: 'Rewritten' };

function Book({ game, decided, hot }: { game: Game; decided: HaatBreak[]; hot?: HaatBreak }) {
  return (
    <ol className="flex flex-col gap-1.5 self-start rounded-2xl bg-secondary p-3" aria-label="Haat’s rulebook">
      <li className="px-1 pb-1 text-xs font-bold tracking-wide text-tertiary uppercase">Haat rulebook</li>
      {game.cards.map(c => {
        const k = c.visual as HaatBreak;
        const done = decided.includes(k);
        const call = ruleCall(HAAT_BREAKS[k]);
        return (
          <motion.li key={k} layout className={cx('flex items-center justify-between gap-2 rounded-lg bg-primary px-2.5 py-1.5 ring-1 ring-inset', hot === k ? 'ring-mint-600' : 'ring-secondary')}>
            <span className={cx('text-xs font-semibold', done ? 'text-primary' : 'text-tertiary')}>{HAAT_RULES[HAAT_BREAKS[k].rule]}</span>
            {done && (
              <motion.span initial={{ scale: 1.5, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: -4 }} transition={springs.pop}
                className="shrink-0 rounded-md border-2 bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary" style={{ borderColor: RULE_TONE[call] }}>
                {STAMP[call]}
              </motion.span>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}

export function RuleCall({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [decided, setDecided] = useState<HaatBreak[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const book = rulebook(decided.map(k => ruleCall(HAAT_BREAKS[k])));
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Review done" title={`${n} of ${game.cards.length} called first time`}>
          {book.hold} rules held, {book.test} ideas going to a test, {book.exception} exceptions logged with their evidence, and {book.change} rules rewritten for everyone.
        </StageTitle>
        <Book game={game} decided={decided} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Four questions, in order. Does the rule protect access or money? Then hold it. Is the reason taste? Hold it. A guess? Test it. Evidence? Log an exception, and when the same evidence turns up a third time, change the rule.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as HaatBreak;
  const lane = ruleCall(HAAT_BREAKS[k]);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setDecided(ds => [...ds, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,20rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">On the review agenda</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0, rotate: 1 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1, rotate: 0 } : { y: 0, opacity: 1, rotate: 0 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <span className="self-start rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary">Breaks: {HAAT_RULES[HAAT_BREAKS[k].rule]}</span>
            <p className="text-lg font-semibold text-primary">{card.label}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Your call">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: RULE_TONE[l.id as Call] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next request' : 'See the rulebook'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Is it a floor? Is the reason taste, a guess, or evidence? And if it’s evidence, how many places need the same thing?</NibSays>}
          </div>
        </div>
        <Book game={game} decided={decided} hot={right ? k : undefined} />
      </div>
    </div>
  );
}
