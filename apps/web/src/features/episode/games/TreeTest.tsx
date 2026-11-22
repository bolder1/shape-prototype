'use client';
// Mini-game for ia.1-4: you're the participant in a tree test. Each task shows the bare structure (Home and its
// sections, no visuals). Open the section you'd try first; the real path (the card's `note`) then lights up down the
// tree. Only the first click is scored, as in a real tree test.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CaretRightIcon, CheckIcon, FolderIcon, FolderOpenIcon, HouseIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function TreeTest({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [first, setFirst] = useState<Record<string, string>>({});
  const task = game.cards[i];
  const chose = task ? first[task.id] : undefined;
  const right = game.cards.filter(c => first[c.id] === c.lane).length;
  const path = task?.note?.split('›').map(s => s.trim()).slice(1) ?? [];   // below the section

  const open = (laneId: string) => {
    if (!task || chose) return;
    play(laneId === task.lane ? 'correct' : 'wrong');
    setFirst(f => ({ ...f, [task.id]: laneId }));
  };

  if (!task) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Test over" title={`First-click success: ${Math.round((right / game.cards.length) * 100)}%`}>{right} of {game.cards.length} tasks started in the right place.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>In a real study, the tasks where lots of people click wrong first are where the structure (or a label) needs work.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: first[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <motion.div key={task.id} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springs.pop} data-current-card
        className="rounded-2xl bg-brand-section px-5 py-4 text-white shadow-lg">
        <p className="text-xs font-semibold tracking-wide uppercase opacity-80">Task {i + 1} of {game.cards.length}</p>
        <p className="mt-1 text-xl font-semibold">{task.label}</p>
      </motion.div>

      {/* the bare tree */}
      <div className="rounded-2xl bg-primary p-4 font-medium ring-1 ring-secondary ring-inset">
        <p className="flex items-center gap-2 px-2 py-1.5 text-md font-bold text-primary"><HouseIcon className="size-5" weight="duotone" />Home</p>
        <ul className="ml-4 flex flex-col gap-1 border-l-2 border-secondary pl-3">
          {game.lanes.map(l => {
            const isRight = !!chose && l.id === task.lane, isWrong = chose === l.id && l.id !== task.lane;
            const Icon = isRight || isWrong ? FolderOpenIcon : FolderIcon;
            return (
              <li key={l.id}>
                <motion.button type="button" onClick={() => open(l.id)} disabled={!!chose} whileTap={{ scale: 0.98 }}
                  animate={isWrong ? { x: [0, -8, 8, -4, 0] } : {}}
                  className={cx('flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-md ring-2 ring-inset transition-colors disabled:cursor-default',
                    isRight ? 'bg-mint-600/15 text-primary ring-mint-600' : isWrong ? 'bg-error-primary text-primary ring-error' : 'text-primary ring-transparent hover:bg-primary_hover')}>
                  <Icon className={cx('size-5', isRight ? 'text-mint-600' : isWrong ? 'text-error-primary' : 'text-tertiary')} weight="duotone" />
                  <span className="font-semibold">{l.label}</span>
                  {isRight && <CheckIcon className="ml-auto size-5 text-mint-600" weight="bold" />}
                  {isWrong && <XIcon className="ml-auto size-5 text-error-primary" weight="bold" />}
                  {!chose && <CaretRightIcon className="ml-auto size-4 text-quaternary" />}
                </motion.button>
                {isWrong && <p className="ml-10 py-1 text-sm text-tertiary">Not in here.</p>}
                {isRight && (
                  <ul className="ml-6 border-l-2 border-mint-500 pl-3">
                    {path.map((step, k) => (
                      <motion.li key={step} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...springs.pop, delay: 0.15 + k * 0.2 }}
                        className={cx('flex items-center gap-2 py-1.5 text-sm font-semibold', k === path.length - 1 ? 'text-mint-700' : 'text-secondary')}>
                        <CaretRightIcon className="size-3.5" />{step}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {chose && (
        <div className="flex flex-col gap-3">
          <NibSays mood={chose === task.lane ? 'cheer' : 'sad'}>
            {chose === task.lane ? 'Right first click. ' : 'A wrong first click: in a real study that’s a red flag for this label. '}
            It lives at <strong>{task.note}</strong>.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next task' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
