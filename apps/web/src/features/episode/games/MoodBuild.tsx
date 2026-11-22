'use client';
// Mini-game for br.1-3: ten pinned pieces (each card's `visual`, drawn as a tile). Tap the ones that belong on Sukoon's
// board (calm, warm, expert), then hand it in: kept and dropped pieces are marked and every card's `note` says why.
// Each card scores on its final call.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, PushPinIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { MoodTile } from '../scenes/Moodboard';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function MoodBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [kept, setKept] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const call = (id: string, lane: string) => kept.includes(id) === (lane === 'keep');
  const right = game.cards.filter(c => call(c.id, c.lane)).length;
  const toggle = (id: string) => { if (done) return; play('tap'); setKept(k => (k.includes(id) ? k.filter(x => x !== id) : [...k, id])); };

  return (
    <div className="relative flex flex-col gap-5">
      {done && right === game.cards.length && <Burst count={36} />}
      <StageTitle eyebrow={done ? 'Board handed in' : 'Play'} title={done ? `${right} of ${game.cards.length} pieces called right` : game.title}>
        {done ? 'Each piece says why it belongs, or why it doesn’t.' : game.instructions}
      </StageTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {game.cards.map(c => {
          const on = kept.includes(c.id), ok = call(c.id, c.lane);
          return (
            <motion.button key={c.id} type="button" onClick={() => toggle(c.id)} aria-pressed={on} aria-label={c.label} whileTap={done ? undefined : { scale: 0.96 }}
              className={cx('relative flex flex-col gap-1.5 rounded-xl bg-primary p-1.5 text-left ring-2 ring-inset transition', !done ? (on ? 'ring-brand' : 'ring-secondary opacity-80 hover:opacity-100') : ok ? 'ring-mint-600' : 'ring-error', done && 'cursor-default')}>
              <svg viewBox="0 0 120 90" className="h-auto w-full overflow-hidden rounded-lg" aria-hidden><MoodTile visual={c.visual} /></svg>
              <span className="px-1 text-[11px] leading-tight font-semibold text-secondary">{c.label}</span>
              {done && <span className="px-1 text-[11px] leading-tight text-tertiary">{c.note}</span>}
              {!done && on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springs.pop} className="absolute top-2.5 right-2.5 grid size-6 place-items-center rounded-full bg-brand-solid text-white"><PushPinIcon className="size-3.5" weight="fill" /></motion.span>}
              {done && (
                <span className={cx('absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white', ok ? 'bg-mint-600' : 'bg-error-solid')}>
                  {ok ? <CheckIcon className="size-3" weight="bold" /> : <XIcon className="size-3" weight="bold" />}{c.lane === 'keep' ? 'keep' : 'drop'}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      {!done ? (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-tertiary">{kept.length} pinned to the board.</span>
          <Button size="lg" iconLeading={PushPinIcon} isDisabled={!kept.length} onPress={() => { play(right === game.cards.length ? 'fanfare' : 'reveal'); setDone(true); }}>Hand in the board</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Several dropped pieces were striking. That’s the trap: fit beats beauty.</NibSays>
          <div className="flex justify-end"><Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: call(c.id, c.lane) })))}>Continue the story</Button></div>
        </div>
      )}
    </div>
  );
}
