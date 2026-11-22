'use client';
// Mini-game for rs.1-1: research methods are hidden in the dark. Move the light (pointer, or Tab to each card) to find
// them, tap one, and call it: Explore (generative) or Check (evaluative). Answered cards stay lit.
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, FlashlightIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
// Where the cards hide (percent of the board).
const SPOTS = [[6, 8], [56, 6], [30, 30], [70, 32], [4, 56], [44, 58], [70, 74], [18, 80], [52, 84], [74, 54], [28, 4], [40, 40]];

export function Flashlight({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const board = useRef<HTMLDivElement>(null);
  const [light, setLight] = useState({ x: 50, y: 50 });   // percent
  const [open, setOpen] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [explore, check] = game.lanes;
  const done = Object.keys(answers).length === game.cards.length;
  const right = game.cards.filter(c => answers[c.id] === c.lane).length;

  const move = (e: React.PointerEvent) => {
    const r = board.current!.getBoundingClientRect();
    setLight({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const answer = (cardId: string, laneId: string) => { play(game.cards.find(c => c.id === cardId)?.lane === laneId ? 'correct' : 'wrong'); setAnswers(a => ({ ...a, [cardId]: laneId })); setOpen(null); };

  if (done) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} called right`}>The lights are on.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Rule of thumb: no design yet means explore; a design to test means check.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: answers[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="inline-flex items-center gap-1.5 text-tertiary"><FlashlightIcon className="size-4 text-[#FDE68A]" weight="fill" />Move your pointer, or press Tab</span>
        <span className="text-tertiary tabular-nums">{Object.keys(answers).length} / {game.cards.length}</span>
      </div>
      <div ref={board} onPointerMove={move} className="relative h-[440px] overflow-hidden rounded-3xl bg-secondary ring-1 ring-secondary ring-inset">
        {game.cards.map((c, i) => {
          const [x, y] = SPOTS[i % SPOTS.length];
          const a = answers[c.id], ok = a === c.lane;
          return (
            <div key={c.id} className={cx('absolute left-[min(var(--x),60%)] w-[38%] sm:left-[min(var(--x),72%)] sm:w-[26%]', a ? 'z-20' : open === c.id ? 'z-30' : 'z-0')} style={{ '--x': `${x}%`, top: `${y}%` } as React.CSSProperties}>
              <button type="button" disabled={!!a} onClick={() => setOpen(open === c.id ? null : c.id)}
                onFocus={e => { const r = board.current!.getBoundingClientRect(), b = e.currentTarget.getBoundingClientRect(); setLight({ x: ((b.left + b.width / 2 - r.left) / r.width) * 100, y: ((b.top + b.height / 2 - r.top) / r.height) * 100 }); }}
                className={cx('w-full rounded-2xl px-3 py-2.5 text-left text-sm font-semibold shadow-md ring-2 ring-inset',
                  !a && 'bg-primary text-primary ring-secondary', a && ok && 'bg-mint-600 text-white ring-mint-600', a && !ok && 'bg-error-solid text-white ring-error-solid')}>
                {a && <span className="mb-0.5 flex items-center gap-1 text-xs font-bold uppercase">{ok ? <CheckIcon className="size-3.5" weight="bold" /> : <XIcon className="size-3.5" weight="bold" />}{game.lanes.find(l => l.id === c.lane)!.label}</span>}
                {c.label}
              </button>
              {open === c.id && !a && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="mt-1.5 grid grid-cols-2 gap-1.5">
                  <button type="button" onClick={() => answer(c.id, explore.id)} className="rounded-xl bg-[var(--color-family-discover)] px-2 py-2 text-xs font-bold text-white">{explore.label}</button>
                  <button type="button" onClick={() => answer(c.id, check.id)} className="rounded-xl bg-[var(--color-family-grow)] px-2 py-2 text-xs font-bold text-white">{check.label}</button>
                </motion.div>
              )}
            </div>
          );
        })}
        {/* the dark, with a hole where the light is */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 transition-[background] duration-75"
          style={{ background: `radial-gradient(circle at ${light.x}% ${light.y}%, transparent 0, transparent 90px, rgba(5,8,26,0.93) 130px, rgb(5,8,26) 185px)` }} />
      </div>
      <p className="text-center text-sm text-tertiary">{explore.label}: {explore.hint.toLowerCase()} · {check.label}: {check.hint.toLowerCase()}</p>
    </div>
  );
}
