'use client';
// Mini-game for ia.1-1: menu labels land on a phone one at a time. Call each one: system talk or user talk.
// System labels (the first lane) are struck and rewritten in the user's words (the card's `note`), so the menu
// slowly turns into one people can read. Each call is scored on the first try.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function JargonSwap({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [sys, user] = game.lanes;
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const card = game.cards[i];
  const placed = game.cards.slice(0, feedback === null ? i : i + 1);
  const right = Object.values(results).filter(Boolean).length;

  const call = (laneId: string) => {
    if (!card || feedback !== null) return;
    const ok = laneId === card.lane;
    play(ok ? (card.lane === sys.id ? 'reveal' : 'correct') : 'wrong');
    setResults(r => ({ ...r, [card.id]: ok }));
    setFeedback(ok);
  };
  const next = () => { setFeedback(null); setI(n => n + 1); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid items-start gap-6 md:grid-cols-[280px_1fr]">
        {/* the phone menu, filling up */}
        <div className="mx-auto w-full max-w-[280px] rounded-[2rem] bg-primary p-4 shadow-xl ring-2 ring-secondary ring-inset">
          <p className="px-2 pt-1 pb-3 text-lg font-bold text-primary">Menu</p>
          <ul className="flex min-h-[380px] flex-col gap-1.5">
            <AnimatePresence initial={false}>
              {placed.map(c => {
                const isSys = c.lane === sys.id;
                return (
                  <motion.li key={c.id} layout initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
                    className={cx('rounded-xl px-3 py-2 text-sm font-semibold', isSys ? 'bg-mint-600/15 text-primary ring-1 ring-mint-600/40 ring-inset' : 'bg-secondary text-primary')}>
                    {isSys ? (
                      <>
                        <span className="block text-xs font-medium text-quaternary line-through">{c.label}</span>
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>{c.note}</motion.span>
                      </>
                    ) : c.label}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>

        {/* the call */}
        <div className="flex flex-col gap-4">
          {card ? (
            <>
              <p className="text-right text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</p>
              <motion.div key={card.id} initial={{ y: -20, opacity: 0, rotate: -2 }} animate={feedback === false ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, rotate: 0 } : { y: 0, opacity: 1, rotate: 0 }}
                transition={feedback === false ? { duration: 0.4 } : springs.pop} data-current-card
                className={cx('rounded-2xl bg-primary px-5 py-6 text-center shadow-lg ring-2 ring-inset', feedback === false ? 'ring-error' : feedback ? 'ring-mint-600' : 'ring-secondary')}>
                <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">New menu label</p>
                <p className="mt-1 text-display-xs font-semibold text-primary">“{card.label}”</p>
              </motion.div>
              {feedback === null ? (
                <div className="grid grid-cols-2 gap-3">
                  {[sys, user].map((l, k) => (
                    <motion.button key={l.id} type="button" whileTap={{ scale: 0.96 }} onClick={() => call(l.id)}
                      className="rounded-2xl px-3 py-4 text-left text-white" style={{ background: k ? 'var(--color-family-grow-solid)' : 'var(--color-family-build-solid)' }}>
                      <span className="block text-md font-bold">{l.label}</span>
                      <span className="block text-xs font-medium opacity-90">{l.hint}</span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <NibSays mood={feedback ? 'cheer' : 'sad'}>
                    <span className="inline-flex items-center gap-1 font-semibold">{feedback ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{feedback ? 'Right.' : 'Not quite.'}</span>{' '}
                    {card.lane === sys.id ? <>That’s system talk. People would say <strong>“{card.note}”</strong>, so it’s been rewritten.</> : <>That’s already how people talk: it names what they want to do.</>}
                  </NibSays>
                  <div className="flex justify-end"><Button size="lg" onPress={next}>{i + 1 < game.cards.length ? 'Next label' : 'See the menu'}</Button></div>
                </div>
              )}
            </>
          ) : (
            <div className="relative flex flex-col items-center gap-5 py-6 text-center">
              <Burst count={36} />
              <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} called right`}>The menu now speaks the user’s language.</StageTitle>
              <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>A quick test: would someone outside your company say this label out loud? If not, it’s system talk.</NibSays>
              <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
