'use client';
// Mini-game for ia.4-4: build the interactions for Mandi's basket screen. Each card is a job; pick the gesture people
// expect (tap, swipe, drag or pinch). The scene's GestureStage plays your gesture on a basket row, sped up; a wrong one
// plays in a red frame and then the right one plays beside it. When it finishes, the visible twin (the card's `visual`)
// appears under the row, because a gesture is never the only way. The end lists the gesture map with every twin.
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode, Gesture } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { GestureStage } from '../scenes/DirectTouch';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const ICON: Record<Gesture, string> = { tap: '●', swipe: '←', drag: '↕', pinch: '⤢' };

function Play({ gesture, label, twin, wrong }: { gesture: Gesture; label: string; twin?: string; wrong?: boolean }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setK(x => Math.min(1, x + 0.03)), 50);
    return () => clearInterval(id);
  }, []);
  return (
    <figure className={cx('flex flex-col items-center gap-1 rounded-2xl bg-primary p-2 ring-2 ring-inset', wrong ? 'ring-error' : 'ring-mint-600')}>
      <svg viewBox="-2 -2 264 264" className="w-full max-w-56" role="img" aria-label={`${label}, done by ${gesture}${twin && !wrong ? `, with a visible ${twin} button` : ''}`}>
        <GestureStage gesture={gesture} k={k} label={label} twin={wrong ? undefined : twin} />
      </svg>
      <figcaption className="text-xs font-semibold text-tertiary">{wrong ? `Your pick: ${gesture}` : `Expected: ${gesture}`}</figcaption>
    </figure>
  );
}

export function GestureMap({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicks(p => ({ ...p, [card.id]: laneId }));
  };

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Gesture map built" title={`${right} of ${game.cards.length} gestures right`}>
          Every job has the gesture people expect, and every gesture beyond a tap has a button you can see.
        </StageTitle>
        <ul className="grid w-full gap-2 text-left">
          {game.cards.map(c => (
            <li key={c.id} className="grid grid-cols-[2.5rem_1fr] items-center gap-3 rounded-xl bg-primary px-3 py-2 ring-1 ring-secondary ring-inset">
              <span className={cx('flex size-10 items-center justify-center rounded-full text-lg font-bold', picks[c.id] === c.lane ? 'bg-secondary text-primary' : 'bg-error-primary text-error-primary')} aria-hidden>{ICON[c.lane as Gesture]}</span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-primary">{c.label}</span>
                <span className="text-xs text-tertiary">{game.lanes.find(l => l.id === c.lane)?.label}{c.visual ? ` · or tap “${c.visual}”` : ''}</span>
              </span>
            </li>
          ))}
        </ul>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Gestures make the screen feel alive for people who know them. The visible twins make it work for everyone else, including screen-reader and switch users.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The job</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <span className="text-sm font-bold text-primary"><span aria-hidden>{ICON[l.id as Gesture]} </span>{l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <>
          <div className={cx('grid gap-3', ok ? 'grid-cols-1 justify-items-center' : 'grid-cols-2')}>
            {!ok && <Play key={`${card.id}-w`} gesture={picked as Gesture} label={card.label} wrong />}
            <Play key={card.id} gesture={card.lane as Gesture} label={card.label} twin={card.visual} />
          </div>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}.</span>{' '}{card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next job' : 'See the gesture map'}</Button></div>
        </>
      )}
    </div>
  );
}
