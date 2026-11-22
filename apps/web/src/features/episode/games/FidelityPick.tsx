'use client';
// Mini-game for pr.1-1: a fidelity ladder. Each card is a question; pick the lowest rung that can answer it. Every pick
// charges that rung's time, so overbuilding shows up as hours wasted and underbuilding as a question left unanswered.
// A running total compares your time with the best possible. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, ClockIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** Working hours each rung costs. */
const HOURS: Record<string, number> = { paper: 0.5, wire: 3, hifi: 24, code: 60 };
const fmt = (h: number) => (h < 1 ? `${h * 60} min` : h < 8 ? `${h} h` : `${Math.round(h / 8)} days`);

export function FidelityPick({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [spent, setSpent] = useState(0);
  const card = game.cards[i];
  const order = game.lanes.map(l => l.id);
  const best = game.cards.slice(0, picked ? i + 1 : i).reduce((s, c) => s + HOURS[c.lane], 0);
  const right = Object.values(results).filter(Boolean).length;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setSpent(s => s + HOURS[laneId]);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} on the right rung`}>{`You spent ${fmt(spent)}. The leanest route was ${fmt(best)}.`}</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Ask “what’s the cheapest thing that could answer this?” before you open any tool.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  const diff = picked ? order.indexOf(picked) - order.indexOf(card.lane) : 0;
  const ladder = [...game.lanes].reverse();   // most expensive at the top
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {ladder.map(l => {
          const k = order.indexOf(l.id);
          return (
            <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.98 }}
              className={cx('flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-inset transition disabled:cursor-default',
                picked && l.id === card.lane ? 'ring-mint-600' : picked === l.id ? 'ring-error' : 'ring-secondary hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-50')}
              style={{ marginInline: `${(3 - k) * 3}%` }}>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary tabular-nums">{k + 1}</span>
              <span className="flex flex-1 flex-col">
                <span className="text-md font-bold text-primary">{l.label}</span>
                <span className="text-xs text-tertiary">{l.hint}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary"><ClockIcon className="size-3.5" weight="bold" />{fmt(HOURS[l.id])}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary tabular-nums">
        <span>Time spent: {fmt(spent)}</span><span className="text-tertiary">Leanest so far: {fmt(best)}</span>
      </div>
      {picked && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex flex-col gap-3">
          <NibSays mood={diff === 0 ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{diff === 0 ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}
              {diff === 0 ? 'Right rung.' : diff > 0 ? `Overbuilt by ${fmt(HOURS[picked] - HOURS[card.lane])}.` : 'Too rough to answer this.'}</span>{' '}
            {owner.label} is enough: {owner.hint.toLowerCase()}.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next question' : 'See results'}</Button></div>
        </motion.div>
      )}
    </div>
  );
}
