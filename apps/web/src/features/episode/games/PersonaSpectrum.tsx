'use client';
// Mini-game for ax.1-1: a 3 × 3 persona spectrum (touch, see, hear × permanent, temporary, situational). Each card is a
// person; pick permanent, temporary or situational and they land in their cell (row from the card's `visual`). A miss
// explains and the card comes back later. First try scores; the game ends with the full spectrum filled in.
import { useState } from 'react';
import { motion } from 'motion/react';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { KINDS, SENSES } from '../scenes/Spectrum';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function PersonaSpectrum({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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

  const matrix = (
    <div className="grid grid-cols-[auto_repeat(3,minmax(0,1fr))] gap-1.5 text-center">
      <span />
      {KINDS.map(k => <span key={k.id} className="rounded-lg py-1.5 text-xs font-bold text-white" style={{ background: k.c }}>{k.n}</span>)}
      {SENSES.map(s => {
        const Icon = s.icon;
        return [
          <span key={s.id} className="flex flex-col items-center justify-center px-1 text-xs font-bold text-tertiary"><Icon className="size-5" weight="duotone" />{s.n}</span>,
          ...KINDS.map(k => {
            const c = game.cards.find(x => x.visual === s.id && x.lane === k.id && placed.includes(x.id));
            return (
              <span key={`${s.id}-${k.id}`} className={cx('flex min-h-16 items-center justify-center rounded-xl p-2 text-xs font-semibold ring-1 ring-inset', c ? 'bg-primary text-primary ring-secondary' : 'bg-secondary text-quaternary ring-transparent')}>
                {c ? <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}>{c.label}</motion.span> : '·'}
              </span>
            );
          }),
        ];
      })}
    </div>
  );

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Spectrum complete" title={`${right} of ${game.cards.length} placed first time`}>Each row is one need. Solve it for the first column and the other two benefit.</StageTitle>
        <div className="w-full">{matrix}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Captions, one-handed layouts, high contrast: each one serves a whole row.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The person</span>
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
            style={{ background: KINDS[k].c }}>
            <span className="text-md font-bold">{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {matrix}
      <div className="min-h-14">{miss && <NibSays mood="sad">That’s <strong>{owner.label.toLowerCase()}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}</div>
    </div>
  );
}
