'use client';
// Mini-game for rs.4-4: the Safar booking screen (shared `SafarScreen`) breaks four heuristics, twice each. Each round
// names a heuristic; tap the part of the screen that breaks it. Either unfound part for that heuristic counts. A find
// is pinned with its number in the heuristic's colour and written into the evaluation log (where · heuristic ·
// problem · fix); a miss rings your tap in red and dashes the right part. One tap per round.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react/ssr';
import { type Episode, type SafarPart } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import { SAFAR_BOX, SafarScreen, type SafarMark } from '../scenes/HeuristicEval';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
interface Find { card: Card; ok: boolean; tapped: SafarPart }

export function HeuristicSweep({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [finds, setFinds] = useState<Find[]>([]);
  const [last, setLast] = useState<Find | null>(null);   // the round just decided, until Next
  const open = game.cards.filter(c => !finds.some(f => f.card.id === c.id));
  const round = last ? null : open[0];
  const colour = (c: Card) => FAMILY_SOLID[game.lanes.findIndex(l => l.id === c.lane) % 4];

  const tap = (part: SafarPart) => {
    if (!round) return;
    const hit = open.find(c => c.lane === round.lane && c.visual === part);
    const f: Find = { card: hit ?? round, ok: !!hit, tapped: part };
    play(hit ? 'correct' : 'wrong');
    setFinds(fs => [...fs, f]);
    setLast(f);
  };

  const marks: Partial<Record<SafarPart, SafarMark>> = {};
  finds.forEach((f, k) => { marks[f.card.visual as SafarPart] = { tone: 'found', n: k + 1, color: colour(f.card) }; });
  if (last && !last.ok) { marks[last.tapped] = { tone: 'miss' }; marks[last.card.visual as SafarPart] = { tone: 'answer', n: finds.length, color: colour(last.card) }; }

  const log = (items: Find[]) => (
    <ol className="flex w-full flex-col gap-2 text-left">
      {items.map((f, k) => {
        const lane = game.lanes.find(l => l.id === f.card.lane)!;
        return (
          <motion.li key={f.card.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="flex gap-3 rounded-xl bg-primary px-3 py-2.5 ring-1 ring-secondary ring-inset">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: colour(f.card) }}>{k + 1}</span>
            <span className="flex flex-col gap-0.5 text-sm">
              <span className="font-bold text-primary">{SAFAR_BOX[f.card.visual as SafarPart].name} · {lane.label}{!f.ok && <span className="font-semibold text-error-primary"> (missed)</span>}</span>
              <span className="text-secondary">{f.card.label}.</span>
              <span className="text-tertiary">Fix: {f.card.note}</span>
            </span>
          </motion.li>
        );
      })}
    </ol>
  );

  const screen = (
    <svg viewBox="0 0 300 548" className="mx-auto w-full max-w-[300px]" role="group" aria-label="Safar booking screen. Tap the part that breaks the heuristic.">
      <SafarScreen marks={marks} onPart={tap} disabled={!round} />
    </svg>
  );

  if (!round && !last) {
    const right = finds.filter(f => f.ok).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Evaluation logged" title={`${right} of ${game.cards.length} found on the first tap`}>
          Eight problems, four heuristics, each with where it is and how to fix it.
        </StageTitle>
        <div className="grid w-full grid-cols-1 items-start gap-4 md:grid-cols-[300px_1fr]">
          {screen}
          {log(finds)}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>One reviewer finds about a third of what’s there. Merge this log with two colleagues’, rate each problem’s severity, then test with users to find what all of you missed.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!finds.find(f => f.card.id === c.id)?.ok })))}>Continue the story</Button>
      </div>
    );
  }

  const lane = game.lanes.find(l => l.id === (round ?? last!.card).lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[300px_1fr]">
        {screen}
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-tertiary"><MagnifyingGlassIcon className="size-4" weight="bold" aria-hidden />Heuristic check</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{finds.length + (round ? 1 : 0)} / {game.cards.length}</span>
          </div>
          <motion.div key={round?.id ?? 'done'} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springs.pop}
            className={cx('flex flex-col gap-1 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !last ? 'ring-secondary' : last.ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
            <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Find a place that breaks</span>
            <span className="text-xl font-semibold text-primary">{lane.label}</span>
            <span className="text-sm text-tertiary">{lane.hint}</span>
          </motion.div>
          {last && (
            <>
              <NibSays mood={last.ok ? 'cheer' : 'sad'}>
                <span className="inline-flex items-center gap-1 font-semibold">{last.ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{last.ok ? 'Found it.' : `Not the ${SAFAR_BOX[last.tapped].name.toLowerCase()}. It’s the ${SAFAR_BOX[last.card.visual as SafarPart].name.toLowerCase()}.`}</span>{' '}{last.card.label}. Fix: {last.card.note}
              </NibSays>
              <div className="flex justify-end"><Button size="lg" onPress={() => setLast(null)}>{open.length ? 'Next heuristic' : 'See the log'}</Button></div>
            </>
          )}
          {finds.length > 0 && log(last ? finds.slice(0, -1) : finds)}
        </div>
      </div>
    </div>
  );
}
