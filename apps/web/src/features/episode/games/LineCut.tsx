'use client';
// Mini-game for ui.1-3: every line and box on a screen, listed. Snip the ones space could replace (cards in the first
// lane), leave the ones that carry meaning, then hand it in. Each line is marked, with its `note` explaining why.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, ScissorsIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function LineCut({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const cutLane = game.lanes[0].id;
  const [cut, setCut] = useState<Set<string>>(new Set());
  const [handedIn, setHandedIn] = useState(false);
  const correct = (c: Game['cards'][number]) => cut.has(c.id) === (c.lane === cutLane);
  const right = game.cards.filter(correct).length;

  const toggle = (id: string) => {
    if (handedIn) return;
    play('tap');
    setCut(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="relative flex flex-col gap-2">
        {handedIn && right === game.cards.length && <Burst count={36} />}
        {game.cards.map((c, i) => {
          const isCut = cut.has(c.id), ok = correct(c);
          return (
            <div key={c.id}>
              <button type="button" onClick={() => toggle(c.id)} disabled={handedIn} aria-pressed={isCut}
                className={cx('group relative flex w-full items-center gap-3 overflow-hidden rounded-xl bg-primary px-4 py-3 text-left ring-2 ring-inset transition-colors disabled:cursor-default',
                  handedIn ? (ok ? 'ring-mint-600' : 'ring-error') : isCut ? 'ring-brand' : 'ring-secondary hover:bg-primary_hover')}>
                <span className={cx('grid size-9 shrink-0 place-items-center rounded-lg transition-colors', isCut ? 'bg-brand-solid text-white' : 'bg-secondary text-tertiary')}>
                  <ScissorsIcon className="size-5" weight={isCut ? 'fill' : 'regular'} />
                </span>
                <span className={cx('text-md font-medium transition-opacity', isCut ? 'text-tertiary opacity-70' : 'text-primary')}>{c.label}</span>
                {/* the snip: a dashed line slicing through */}
                <motion.span aria-hidden initial={false} animate={{ scaleX: isCut ? 1 : 0 }} transition={springs.gentle}
                  className="pointer-events-none absolute left-14 right-28 top-1/2 h-0 origin-left border-t-2 border-dashed border-fg-quaternary" />
                <span className="ml-auto shrink-0 text-xs font-bold text-tertiary uppercase">{isCut ? 'Cut' : 'Keep'}</span>
                {handedIn && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...springs.pop, delay: i * 0.06 }}
                    className={cx('grid size-7 shrink-0 place-items-center rounded-full text-white', ok ? 'bg-mint-600' : 'bg-error-solid')}>
                    {ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}
                  </motion.span>
                )}
              </button>
              {handedIn && c.note && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 0.2 + i * 0.06 }}
                  className="px-4 pt-1.5 text-sm text-secondary">
                  <strong className={c.lane === cutLane ? 'text-primary' : 'text-mint-700'}>{c.lane === cutLane ? 'Cut: ' : 'Keep: '}</strong>{c.note}
                </motion.p>
              )}
            </div>
          );
        })}
      </div>
      {!handedIn ? (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-tertiary">{cut.size} cut</span>
          <Button size="lg" onPress={() => { play(right === game.cards.length ? 'fanfare' : 'reveal'); setHandedIn(true); }}>Hand it in</Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>{right} of {game.cards.length} right. Ask of every line: does it show a state, or just separate? If it only separates, space can do it.</NibSays>
          <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: correct(c) })))}>Continue the story</Button>
        </div>
      )}
    </div>
  );
}
