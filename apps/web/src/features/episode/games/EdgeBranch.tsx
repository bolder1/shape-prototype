'use client';
// Mini-game for ia.2-1: the four-step happy path of a password reset sits across the top. Each card is something that
// goes wrong; tap the step where it happens and a red branch grows under that step with its green way back (the card's
// `note`). A miss explains and the card comes back later. First try scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowBendUpLeftIcon, ArrowRightIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function EdgeBranch({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const card = deck[0];

  const send = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setPlaced(p => [...p, card.id]); setDeck(d => d.slice(1)); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2000); }
  };

  const flow = (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
      {game.lanes.map((l, k) => {
        const here = game.cards.filter(c => placed.includes(c.id) && c.lane === l.id);
        return (
          <div key={l.id} className="flex flex-col items-stretch gap-2">
            <div className="relative">
              <motion.button type="button" onClick={() => send(l.id)} disabled={miss || !card} whileTap={card ? { scale: 0.96 } : undefined}
                className={cx('flex w-full flex-col items-center gap-1 rounded-2xl bg-primary px-2 py-3 ring-2 ring-mint-600 ring-inset transition-colors disabled:cursor-default',
                  card && 'hover:bg-primary_hover', miss && l.id === card?.lane && 'ring-4')}>
                <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary">{k + 1}</span>
                <span className="text-sm font-bold text-primary">{l.label}</span>
                <span className="text-[11px] leading-tight text-tertiary">{l.hint}</span>
              </motion.button>
              {k < game.lanes.length - 1 && <ArrowRightIcon className="absolute top-1/2 -right-3 hidden size-3 -translate-y-1/2 text-mint-600 sm:block" weight="bold" aria-hidden />}
            </div>
            {here.map(c => (
              <motion.div key={c.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
                className="ml-3 flex flex-col gap-1 border-l-2 border-dashed border-error pb-1 pl-2">
                <span className="rounded-lg bg-primary px-2 py-1.5 text-xs font-semibold text-error-primary ring-1 ring-error ring-inset">{c.label}</span>
                <span className="flex items-start gap-1 text-xs leading-snug font-medium text-primary">
                  <ArrowBendUpLeftIcon className="mt-0.5 size-3.5 shrink-0 text-mint-600" weight="bold" aria-hidden />{c.note}
                </span>
              </motion.div>
            ))}
          </div>
        );
      })}
    </div>
  );

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Flow mapped" title={`${right} of ${game.cards.length} branches on the right step first time`}>Every branch has a way back to the path.</StageTitle>
        <div className="w-full text-left">{flow}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Try it on any flow you use: at each step ask what if it’s wrong, slow, missing or interrupted.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">What goes wrong</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-center text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      {flow}
      <div className="min-h-14">{miss && <NibSays mood="sad">That happens at <strong>{owner.label}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}</div>
    </div>
  );
}
