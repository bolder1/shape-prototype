'use client';
// Mini-game for fd.1-3: statements float up as bubbles. Pop the myths (cards in the first lane); let the truths rise.
// A myth that escapes off the top, or a truth you pop, counts as a miss. It's a timed round, so misses don't come back;
// they go to the review deck instead. The clock is an interval timer, so it keeps running even in a throttled tab.
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { LightningIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';

type Game = Episode['game'];
interface Outcome { correct: boolean; by: 'pop' | 'top'; at: number }

const LEAD = 2, GAP = 2.3, RISE = 7.5;
// Three lanes on wider screens; two wider ones on phones so statements stay readable while they rise.
const COLUMNS = { wide: ['2%', '35%', '68%'], narrow: ['2%', '51%'] };

export function MythPop({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const popLane = game.lanes[0].id;
  const wide = useBreakpoint('sm');
  // Fixed shuffle: myths and truths interleave unpredictably, but the same way every time.
  const order = useMemo(() => [...game.cards].map((c, i) => ({ c, k: (i * 7) % game.cards.length })).sort((a, b) => a.k - b.k).map(x => x.c), [game.cards]);
  const [start] = useState(() => performance.now());
  const [now, setNow] = useState(start);
  const [outcome, setOutcome] = useState<Record<string, Outcome>>({});
  const el = (now - start) / 1000;

  useEffect(() => {
    const id = setInterval(() => {
      const n = performance.now(), e = (n - start) / 1000;
      setNow(n);
      // Anything that reached the top unpopped is decided: truths kept (right), myths escaped (wrong).
      setOutcome(o => {
        let next: Record<string, Outcome> | null = null;
        order.forEach((c, i) => {
          if (!o[c.id] && e >= LEAD + i * GAP + RISE) { next ??= { ...o }; next[c.id] = { correct: c.lane !== popLane, by: 'top', at: e }; }
        });
        return next ?? o;
      });
    }, 50);
    return () => clearInterval(id);
  }, [start, order, popLane]);

  const pop = (id: string, lane: string) => setOutcome(o => (o[id] ? o : { ...o, [id]: { correct: lane === popLane, by: 'pop', at: el } }));

  const decided = order.map(c => outcome[c.id]).filter(Boolean) as Outcome[];
  const right = decided.filter(o => o.correct).length;
  let streak = 0; for (const c of [...order].sort((a, b) => (outcome[a.id]?.at ?? 1e9) - (outcome[b.id]?.at ?? 1e9))) { const o = outcome[c.id]; if (!o) break; streak = o.correct ? streak + 1 : 0; }
  const score = decided.reduce((s, o) => s + (o.correct ? (o.by === 'pop' ? 15 : 5) : 0), 0);
  const lastAt = Math.max(0, ...decided.map(o => o.at));
  const finished = decided.length === order.length && el > lastAt + 0.9;
  const latest = order.map(c => ({ c, o: outcome[c.id] })).filter(x => x.o).sort((a, b) => b.o!.at - a.o!.at)[0];

  if (finished) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={40} />
        <StageTitle eyebrow="Game over" title={`${score} points`}>{right} of {order.length} called right.</StageTitle>
        <NibSays mood={right === order.length ? 'cheer' : 'idle'}>{right === order.length ? 'Myth buster, certified.' : 'Myths sound convincing. That’s what makes them myths. The ones you missed come back in review.'}</NibSays>
        <Button size="xl" onPress={() => onDone(order.map(c => ({ id: c.id, correct: !!outcome[c.id]?.correct })))}>Continue the story</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className={cx('inline-flex items-center gap-1 rounded-full px-3 py-1', streak >= 3 ? 'bg-mint-600 text-white' : 'bg-secondary text-tertiary')}>
          <LightningIcon className="size-4" weight="fill" />{score}{streak >= 3 && ` · ${streak} in a row`}
        </span>
        <span className="text-tertiary tabular-nums">{decided.length} / {order.length}</span>
      </div>

      <div className="relative h-[440px] overflow-hidden rounded-3xl bg-secondary ring-1 ring-secondary ring-inset" role="group" aria-label="Floating statements">
        {/* the finish line */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-error-solid/20 to-transparent" aria-hidden />
        <p className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest text-error-primary uppercase" aria-hidden>Myths escape here</p>

        {el < LEAD && (
          <motion.p key={el < LEAD / 2 ? 'ready' : 'go'} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
            className="absolute inset-0 grid place-items-center text-display-md font-black text-primary">{el < LEAD / 2 ? 'Ready?' : 'Go!'}</motion.p>
        )}

        {order.map((c, i) => {
          const born = LEAD + i * GAP;
          const o = outcome[c.id];
          if (el < born || (o && el > o.at + 0.9)) return null;
          const prog = Math.min(1, (Math.min(el, o?.at ?? el) - born) / RISE);
          const bottom = -60 + prog * 520;
          const wobble = Math.sin((el + i) * 2.2) * 6;
          const popped = o?.by === 'pop';
          return (
            <button key={c.id} type="button" onClick={() => pop(c.id, c.lane)} disabled={!!o}
              aria-label={`${c.label}. Tap to pop if it’s a myth.`}
              className={cx('absolute w-[47%] sm:w-[30%] rounded-3xl px-3 py-3 text-center text-sm font-semibold shadow-lg ring-2 transition-[transform,opacity,background-color] duration-300 ring-inset md:text-md',
                !o && 'bg-primary text-primary ring-secondary hover:ring-brand-solid',
                o && o.correct && 'bg-mint-600 text-white ring-mint-600',
                o && !o.correct && 'bg-error-solid text-white ring-error-solid')}
              style={{ left: wide ? COLUMNS.wide[i % 3] : COLUMNS.narrow[i % 2], bottom, transform: `translateX(${wobble}px) scale(${popped ? 1.15 : 1})`, opacity: o ? 1 - Math.min(1, (el - o.at) / 0.9) : 1 }}>
              {o ? (popped ? (o.correct ? 'Busted! Myth' : 'Oops, that’s true') : (o.correct ? 'True. Kept!' : 'A myth escaped!')) : c.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-14">
        {latest && !latest.o!.correct && el - latest.o!.at < 3 && (
          <NibSays mood="sad">“{latest.c.label}” is {latest.c.lane === popLane ? 'a myth' : 'true'}: {game.lanes.find(l => l.id === latest.c.lane)!.hint.toLowerCase()}.</NibSays>
        )}
      </div>
    </div>
  );
}
