'use client';
// Mini-game for ld.2-3: a whiteboard with four columns (clarify, user & goal, ideas, measure). Each card is something a
// candidate says; tap the column it belongs in and it sticks there as a note. A miss explains and the card comes back
// later. First try scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { COLUMNS } from '../scenes/Whiteboard';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function WhiteboardStep({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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

  const board = (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-3 ring-4 ring-[#d1d5db] ring-inset sm:grid-cols-4">
      {game.lanes.map((l, k) => {
        const here = game.cards.filter(c => placed.includes(c.id) && c.lane === l.id), col = COLUMNS.find(c => c.id === l.id);
        return (
          <motion.button key={l.id} type="button" onClick={() => send(l.id)} disabled={miss || !card} whileTap={card ? { scale: 0.98 } : undefined}
            className={cx('flex min-h-48 flex-col gap-2 rounded-xl p-2 text-left transition-colors disabled:cursor-default', card && 'hover:bg-[#f9fafb]', miss && l.id === card?.lane && 'ring-2 ring-[#059669]')}>
            <span className="border-b-2 pb-1 text-sm font-bold" style={{ color: col?.c, borderColor: col?.c }}>{k + 1}. {l.label}</span>
            <span className="text-[11px] leading-tight text-[#6b7280]">{l.hint}</span>
            {here.map((c, j) => (
              <motion.span key={c.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                className="rounded-md p-2 text-[11px] leading-snug font-medium text-[#1f2937] shadow-sm" style={{ background: '#fef9c3', rotate: `${(j % 2 ? 1 : -1) * 1.5}deg` }}>{c.label}</motion.span>
            ))}
          </motion.button>
        );
      })}
    </div>
  );

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Board complete" title={`${right} of ${game.cards.length} notes in the right column first time`}>Clarify, user and goal, ideas, measure.</StageTitle>
        <div className="w-full text-left">{board}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Practise this shape out loud with any everyday prompt. It turns panic into a plan.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The candidate says</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-center text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      {board}
      <div className="min-h-14">{miss && <NibSays mood="sad">That’s part of <strong>{owner.label}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}</div>
    </div>
  );
}
