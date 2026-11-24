'use client';
// Mini-game for ax.2-4: each card is a barrier in Rahi's booking flow (its `visual`, a key of `RAHI_BARRIERS`). Sunita's
// load meter starts with every barrier stacked on it. Read the screen as she meets it, pick the habit that removes the
// barrier (enough time, nothing to remember, plain words and clear steps, no surprises), and see the screen after,
// with the success criterion it meets. A right call lifts the barrier's weight off the meter (`loadLeft`). Scored on
// the first pick. The end is the before and after of every barrier, and the load she still carries.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { loadLeft, RAHI_BARRIERS, type CogaLane, type Episode, type RahiBarrier } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { LoadMeter } from '../scenes/CognitiveA11y';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function ScreenCard({ tag, text, good }: { tag: string; text: string; good?: boolean }) {
  return (
    <figure className={cx('flex flex-col gap-1.5 rounded-2xl bg-primary p-4 ring-2 ring-inset', good ? 'ring-mint-600' : 'ring-secondary')}>
      <figcaption className="text-xs font-semibold tracking-wide text-tertiary uppercase">{tag}</figcaption>
      <p className="text-base font-semibold text-primary">{text}</p>
    </figure>
  );
}

export function LoadLift({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, CogaLane>>({});
  const card = game.cards[i];
  const all = game.cards.map(c => c.visual as RahiBarrier);
  const lifted = game.cards.filter(c => picks[c.id] === c.lane).map(c => c.visual as RahiBarrier);
  const start = loadLeft(all, []), left = loadLeft(all, lifted);
  const meter = (
    <svg viewBox="-10 -10 184 500" className="w-full max-w-44" role="img" aria-label={`Sunita’s load: ${left} of ${start}`}>
      <LoadMeter x={0} y={0} blocks={all} out={Object.fromEntries(lifted.map(b => [b, 1]))} height={440} total={start} />
    </svg>
  );

  if (!card) {
    const right = lifted.length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Sunita’s booking, lighter" title={`${right} of ${game.cards.length} barriers lifted`}>
          Her load went from {start} to {left}. Every barrier you lifted helps anyone tired, stressed or reading in a second language, too.
        </StageTitle>
        <div className="flex w-full flex-col gap-3 text-left">
          {game.lanes.map(l => (
            <section key={l.id} className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
              <h2 className="text-sm font-semibold text-primary">{l.label}</h2>
              {game.cards.filter(c => c.lane === l.id).map(c => {
                const b = RAHI_BARRIERS[c.visual as RahiBarrier];
                return (
                  <figure key={c.id} className={cx('grid gap-2 rounded-xl bg-primary p-3 ring-1 ring-inset sm:grid-cols-2', picks[c.id] === c.lane ? 'ring-secondary' : 'ring-error')}>
                    <p className="text-sm text-tertiary line-through decoration-1">{b.before}</p>
                    <p className="text-sm text-primary">{b.after} <span className="text-xs font-semibold text-tertiary">({b.sc})</span></p>
                  </figure>
                );
              })}
            </section>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Give people time, don’t make them remember, say it plainly in clear steps, and never surprise them. Then watch real people use it.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const b = RAHI_BARRIERS[card.visual as RahiBarrier];
  const mine = picks[card.id], ok = mine === card.lane;
  const pick = (l: CogaLane) => { if (mine) return; play(l === card.lane ? 'correct' : 'wrong'); setPicks(ps => ({ ...ps, [card.id]: l })); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid items-start gap-4 sm:grid-cols-[1fr_minmax(0,11rem)]">
        <motion.div key={card.id} initial={{ y: -10, opacity: 0 }} animate={mine && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
          className="flex flex-col gap-3" data-current-card>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-lg font-semibold text-primary">{card.label}</span>
            <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
          </div>
          <ScreenCard tag="What Sunita meets" text={b.before} />
          <div role="group" aria-label="The habit that removes it" className="grid grid-cols-2 gap-2">
            {game.lanes.map(l => {
              const id = l.id as CogaLane;
              return (
                <button key={l.id} type="button" aria-pressed={mine === id} disabled={!!mine} onClick={() => pick(id)}
                  className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-2.5 text-left ring-2 ring-inset transition disabled:cursor-default',
                    !mine && 'ring-secondary hover:bg-primary_hover', mine && id === card.lane && 'ring-mint-600', mine && id === mine && !ok && 'ring-error', mine && id !== mine && id !== card.lane && 'ring-secondary opacity-60')}>
                  <span className="text-sm font-bold text-primary">{l.label}</span>
                  <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
                </button>
              );
            })}
          </div>
          {mine && <ScreenCard tag={`After · ${b.sc}`} text={b.after} good />}
        </motion.div>
        <div className="flex flex-col items-center gap-1" aria-live="polite">{meter}</div>
      </div>
      {mine && (
        <>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{game.lanes.find(l => l.id === card.lane)!.label}.</span>{' '}{card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next barrier' : 'See her booking'}</Button></div>
        </>
      )}
    </div>
  );
}
