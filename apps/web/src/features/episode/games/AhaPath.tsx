'use client';
// Mini-game for gr.1-2: a running app's onboarding, one step at a time. Keep it before the first run, move it after, or
// cut it. Steps land on a path that ends at the aha star; the count of steps before the aha shrinks as you go. A miss
// explains (each card's `note`) and the step comes back later. First try scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { StarIcon, TrashIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function AhaPath({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const card = deck[0];
  const zone = (lane: string) => game.cards.filter(c => placed.includes(c.id) && c.lane === lane);
  const beforeCount = game.cards.length - zone('later').length - zone('cut').length;   // steps still standing before the aha

  const send = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setPlaced(p => [...p, card.id]); setDeck(d => d.slice(1)); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2200); }
  };

  const path = (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-4">
      <div className="flex flex-wrap items-center gap-2">
        {zone('before').map(c => <motion.span key={c.id} layout initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={springs.pop} className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-mint-600 ring-inset">{c.label}</motion.span>)}
        <span className="text-tertiary">→</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-mint-600 px-3 py-1.5 text-xs font-bold text-white"><StarIcon className="size-4" weight="fill" />First run</span>
        <span className="ml-auto text-xs font-semibold text-tertiary tabular-nums">Steps before the aha: {beforeCount}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-tertiary">After the run:</span>
        {zone('later').map(c => <motion.span key={c.id} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={springs.pop} className="rounded-lg bg-primary px-2 py-1 text-xs text-secondary">{c.label}</motion.span>)}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-tertiary"><TrashIcon className="size-3.5" />Cut:</span>
        {zone('cut').map(c => <motion.span key={c.id} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={springs.pop} className="rounded-lg px-2 py-1 text-xs text-quaternary line-through">{c.label}</motion.span>)}
      </div>
    </div>
  );

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Path cleared" title={`${right} of ${game.cards.length} steps placed first time`}>From nine screens to two taps before the first run.</StageTitle>
        <div className="w-full text-left">{path}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Nothing valuable was lost: the account, goals and friends still happen, just after people care.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Onboarding step</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-center text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-3 gap-3">
        {game.lanes.map((l, k) => (
          <motion.button key={l.id} type="button" onClick={() => send(l.id)} disabled={miss} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col rounded-2xl px-3 py-3 text-left text-white transition disabled:cursor-default', miss && l.id === card.lane && 'ring-4 ring-mint-500')}
            style={{ background: FAMILY_SOLID[[2, 0, 3][k]] }}>
            <span className="text-md font-bold">{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {path}
      <div className="min-h-14">{miss && <NibSays mood="sad"><strong>{game.lanes.find(l => l.id === card.lane)!.label}.</strong> {card.note} It’ll come back round.</NibSays>}</div>
    </div>
  );
}
