'use client';
// Mini-game for dc.1-3: four pipeline stations (design & tokens, components, data & state, test & ship). Send each task
// to the station where it happens. Right answers collect under the station; a miss explains and the task comes back
// later. First try scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { STATIONS } from '../scenes/FrontendBuild';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function FeFlow({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Shipped" title={`${right} of ${game.cards.length} tasks sent to the right station`}>Design, components, data, ship.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Designers touch every station: tokens up front, components in the middle, states for data, and a preview check before release.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The task</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-center text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map((l, k) => {
          const here = game.cards.filter(c => placed.includes(c.id) && c.lane === l.id), st = STATIONS.find(s => s.id === l.id);
          return (
            <motion.button key={l.id} type="button" onClick={() => send(l.id)} disabled={miss} whileTap={{ scale: 0.97 }}
              className={cx('relative flex min-h-40 flex-col items-start gap-2 rounded-2xl bg-primary p-3 text-left ring-2 ring-inset transition-colors hover:bg-primary_hover disabled:cursor-default',
                miss && l.id === card.lane ? 'ring-mint-600' : 'ring-secondary')}>
              <span className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full text-xs font-bold text-white" style={{ background: st?.c }}>{k + 1}</span>
                <span className="text-sm font-bold text-primary">{l.label}</span>
              </span>
              <span className="text-[11px] leading-tight text-tertiary">{l.hint}</span>
              <span className="flex flex-col gap-1">
                {here.map(c => <motion.span key={c.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop} className="rounded-lg bg-secondary px-2 py-1 text-[10px] leading-snug text-secondary">{c.label}</motion.span>)}
              </span>
            </motion.button>
          );
        })}
      </div>
      <div className="min-h-14">{miss && <NibSays mood="sad">That happens at <strong>{owner.label}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}</div>
    </div>
  );
}
