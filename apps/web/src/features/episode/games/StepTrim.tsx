'use client';
// Mini-game for ia.2-2: the eleven-screen first order sits as a strip of screens (each card's `visual` is its name).
// For the highlighted screen, choose cut, merge, defer or keep; the card's `note` explains, and the strip shows the call.
// The end screen rebuilds the flow from the right answers: kept screens plus one merged screen, with deferred ones on a
// shelf for after the first order. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowsInIcon, CheckCircleIcon, CheckIcon, ClockIcon, ScissorsIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const ICON = { cut: ScissorsIcon, merge: ArrowsInIcon, defer: ClockIcon, keep: CheckCircleIcon } as const;
const TONE: Record<string, string> = { cut: 'text-error-primary', merge: 'text-brand-secondary', defer: 'text-warning-primary', keep: 'text-mint-700' };

/** The flow after the right calls: kept screens in order, with every merged screen collapsed into one "Your details". */
export function trimmedFlow(cards: Game['cards']) {
  const out: string[] = [];
  for (const c of cards) {
    if (c.lane === 'keep') out.push(c.visual ?? c.label);
    if (c.lane === 'merge' && !out.includes('Your details')) out.push('Your details');
  }
  return out;
}

export function StepTrim({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  const strip = (
    <div className="flex flex-wrap justify-center gap-1.5" aria-label="The flow, screen by screen">
      {game.cards.map((c, k) => {
        const decided = k < i || (k === i && picked), Icon = ICON[c.lane as keyof typeof ICON];
        return (
          <motion.span key={c.id} layout transition={springs.pop}
            className={cx('flex h-12 w-16 flex-col items-center justify-center gap-0.5 rounded-lg bg-primary text-[10px] font-bold ring-1 ring-inset',
              k === i && !picked ? 'ring-2 ring-brand' : 'ring-secondary', decided && c.lane === 'cut' && 'line-through opacity-50', decided && c.lane === 'defer' && 'opacity-60')}>
            {decided && Icon ? <Icon className={cx('size-3.5', TONE[c.lane])} weight="bold" aria-hidden /> : <span className="h-1.5 w-8 rounded-full bg-quaternary" />}
            <span className="text-primary">{c.visual}</span>
          </motion.span>
        );
      })}
    </div>
  );

  if (!card) {
    const flow = trimmedFlow(game.cards), later = game.cards.filter(c => c.lane === 'defer');
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Flow trimmed" title={`${right} of ${game.cards.length} calls right`}>{game.cards.length} screens became {flow.length}, and nothing important was lost.</StageTitle>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {flow.map((s, k) => (
            <motion.span key={s} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...springs.pop, delay: k * 0.12 }}
              className="flex h-20 w-24 items-end justify-center rounded-xl bg-primary pb-2 text-sm font-bold text-primary ring-2 ring-mint-600 ring-inset">{s}</motion.span>
          ))}
          <span className="text-sm font-bold text-tertiary">→ Pay</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-secondary px-4 py-2">
          <span className="text-xs font-semibold text-tertiary">After the first order</span>
          <span className="flex gap-1.5">{later.map(c => <span key={c.id} className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary">{c.visual}</span>)}</span>
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Count isn’t the goal. Test the short version: do more people finish, with fewer mistakes?</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, answer = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      {strip}
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Screen {i + 1}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-center text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map(l => {
          const Icon = ICON[l.id as keyof typeof ICON];
          return (
            <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
              className={cx('flex flex-col items-center gap-1 rounded-2xl bg-primary px-3 py-3 ring-2 ring-secondary ring-inset transition disabled:cursor-default',
                !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
              {Icon && <Icon className={cx('size-6', TONE[l.id])} weight="bold" aria-hidden />}
              <span className="text-md font-bold text-primary">{l.label}</span>
              <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
            </motion.button>
          );
        })}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{answer.label}.</span>{' '}{card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next screen' : 'See the new flow'}</Button></div>
        </div>
      )}
    </div>
  );
}
