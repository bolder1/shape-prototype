'use client';
// Mini-game for rs.2-4: two rooms, the interview room (ask) and the shop counter (watch). Send each thing you want to
// learn to the room where you'd actually find it out. Right answers collect in the room; a miss explains and the card
// comes back later. First try scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { ChatCircleIcon, EyeIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const ROOM: Record<string, { title: string; icon: typeof EyeIcon; color: string }> = {
  ask: { title: 'Interview room', icon: ChatCircleIcon, color: 'var(--color-family-discover)' },
  watch: { title: 'Shop counter', icon: EyeIcon, color: 'var(--color-family-design)' },
};

export function AskWatch({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [found, setFound] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const card = deck[0];

  const send = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setFound(f => [...f, card.id]); setDeck(d => d.slice(1)); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2000); }
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Visit over" title={`${right} of ${game.cards.length} sent to the right room first time`}>Ask for reasons. Watch for habits.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>The best studies do both: watch the work, then ask “why did you do that?” on the spot.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">What you want to learn</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{found.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-center text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        {game.lanes.map(l => {
          const room = ROOM[l.id], Icon = room.icon;
          const here = game.cards.filter(c => found.includes(c.id) && c.lane === l.id);
          return (
            <motion.button key={l.id} type="button" onClick={() => send(l.id)} disabled={miss} whileTap={{ scale: 0.98 }}
              className={cx('flex min-h-44 flex-col gap-3 rounded-2xl bg-primary p-4 text-left ring-2 ring-inset transition-colors hover:bg-primary_hover disabled:cursor-default',
                miss && l.id === card.lane ? 'ring-mint-600' : 'ring-secondary')}>
              <span className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl text-white" style={{ background: room.color }}><Icon className="size-6" weight="duotone" /></span>
                <span className="flex flex-col">
                  <span className="text-md font-bold text-primary">{l.label} · {room.title}</span>
                  <span className="text-xs text-tertiary">{l.hint}</span>
                </span>
              </span>
              <span className="flex flex-wrap gap-1.5">
                {here.map(c => <motion.span key={c.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                  className="rounded-lg bg-secondary px-2 py-1 text-xs font-semibold text-secondary">{c.label}</motion.span>)}
              </span>
            </motion.button>
          );
        })}
      </div>
      <div className="min-h-14">
        {miss && <NibSays mood="sad">Better found by <strong>{owner.label.toLowerCase()}ing</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}
      </div>
    </div>
  );
}
