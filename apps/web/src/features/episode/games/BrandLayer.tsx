'use client';
// Mini-game for br.1-1: three rings (logo at the centre, identity around it, brand on the outside). Tap the ring each item
// belongs to. Right answers collect under their ring; a miss explains and the item comes back later. First try scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { RINGS, Rings } from '../scenes/BrandLayers';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function BrandLayer({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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

  const lists = (
    <div className="grid gap-2 sm:grid-cols-3">
      {RINGS.map(r => (
        <div key={r.id} className="flex flex-col gap-1.5 rounded-xl bg-secondary p-3">
          <span className="text-sm font-bold" style={{ color: r.c }}>{r.n}</span>
          {game.cards.filter(c => placed.includes(c.id) && c.lane === r.id).map(c => (
            <motion.span key={c.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop} className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-secondary">{c.label}</motion.span>
          ))}
        </div>
      ))}
    </div>
  );

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Rings filled" title={`${right} of ${game.cards.length} placed first time`}>The mark, the system, and the perception you earn.</StageTitle>
        <div className="w-full text-left">{lists}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Notice how much of the outer ring comes from service, not design. Product design shapes it every day.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Where does it belong?</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-center text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <svg viewBox="0 0 500 500" className="mx-auto h-auto w-full max-w-sm" role="group" aria-label="Three rings: logo, identity, brand">
        <Rings cx={250} cy={250} lit={miss ? card.lane : undefined} />
        {/* invisible tap targets, outside in so the inner rings sit on top */}
        {[...RINGS].reverse().map(r => (
          <circle key={r.id} cx={250} cy={250} r={r.r} fill="transparent" role="button" tabIndex={0} aria-label={r.n} className="cursor-pointer outline-none focus-visible:stroke-[var(--color-fg-brand-primary)]" strokeWidth={4}
            onClick={() => send(r.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); send(r.id); } }} />
        ))}
      </svg>
      {lists}
      <div className="min-h-14">{miss && <NibSays mood="sad">That’s the <strong>{owner.label.toLowerCase()}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}</div>
    </div>
  );
}
