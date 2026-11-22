'use client';
// Mini-game for st.1-1: a three-rung ladder (problem at the bottom, outcome in the middle, output at the top). Send each
// statement to its rung; it settles there. A miss explains the rung and the card comes back later. First try scores.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const COLOR: Record<string, string> = { problem: 'var(--color-family-design)', outcome: 'var(--color-mint-600)', output: 'var(--color-family-discover)' };

export function RungSort({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const card = deck[0];
  // Top of the ladder first: output, outcome, problem.
  const rungs = [...game.lanes].reverse();

  const send = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setPlaced(p => [...p, card.id]); setDeck(d => d.slice(1)); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 2000); }
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} on the right rung first time`}>Problem at the bottom, outcome in the middle, output on top.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Quick test: if you can build it, it’s an output. If you can measure people doing it, it’s an outcome.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Tap a rung</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -16, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0, scale: 0.8 }}
          transition={miss ? { duration: 0.4 } : springs.pop}
          className={cx('rounded-2xl bg-primary px-5 py-4 text-center text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
          {card.label}
        </motion.div>
      </AnimatePresence>

      {/* the ladder */}
      <div className="relative flex flex-col gap-3 px-6">
        <span aria-hidden className="absolute inset-y-0 left-2 w-1.5 rounded-full bg-tertiary" />
        <span aria-hidden className="absolute inset-y-0 right-2 w-1.5 rounded-full bg-tertiary" />
        {rungs.map(l => {
          const here = game.cards.filter(c => placed.includes(c.id) && c.lane === l.id);
          return (
            <motion.button key={l.id} type="button" onClick={() => send(l.id)} whileTap={{ scale: 0.98 }} disabled={!!miss}
              animate={miss === l.id ? { x: [0, -8, 8, 0] } : {}}
              className={cx('relative flex flex-col gap-2 rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-inset transition-colors hover:bg-primary_hover',
                miss && l.id === card.lane ? 'ring-mint-600' : miss === l.id ? 'ring-error' : 'ring-secondary')}>
              <span className="flex items-baseline gap-2">
                <span className="text-md font-bold" style={{ color: COLOR[l.id] }}>{l.label}</span>
                <span className="text-xs text-tertiary">{l.hint}</span>
              </span>
              {here.length > 0 && (
                <span className="flex flex-wrap gap-1.5">
                  {here.map(c => <motion.span key={c.id} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-white" style={{ background: COLOR[l.id] }}>{c.label}</motion.span>)}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      <div className="min-h-14">
        {miss && <NibSays mood="sad">That’s <strong>{owner.label.toLowerCase()}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}
      </div>
    </div>
  );
}
