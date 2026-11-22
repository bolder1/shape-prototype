'use client';
// Mini-game for fd.1-1: swipe each statement left (problem) or right (solution). The first lane is left, the second is right.
// Streaks raise a score multiplier; a miss costs a heart, explains the rule, and the card comes back later.
// Works with drag, the two buttons, or the ← → keys. Timing comes from timers, never from awaiting an animation.
import { useCallback, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon, LightningIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Cue = 'idle' | 'left' | 'right' | 'wrong';
const HEARTS = 3;
const LEFT_C = 'var(--color-family-discover)', RIGHT_C = 'var(--color-family-grow)';

export function SwipeSort({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [left, right] = game.lanes;
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [hearts, setHearts] = useState(HEARTS);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [cue, setCue] = useState<Cue>('idle');
  const [miss, setMiss] = useState<string | null>(null);   // lane id the missed card belongs to
  const [turn, setTurn] = useState(0);
  const card = deck[0];
  const mult = streak >= 6 ? 3 : streak >= 3 ? 2 : 1;

  const decide = useCallback((laneId: string) => {
    if (!card || cue !== 'idle') return;
    const ok = card.lane === laneId;
    play(ok ? 'combo' : 'wrong', streak + 1);
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) {
      setCue(laneId === left.id ? 'left' : 'right');
      setStreak(s => s + 1);
      setScore(s => s + 10 * mult);
      setTimeout(() => { setDeck(d => d.slice(1)); setCue('idle'); setTurn(n => n + 1); }, 380);
    } else {
      setCue('wrong'); setMiss(card.lane);
      setStreak(0); setHearts(h => Math.max(0, h - 1));
      setTimeout(() => { setDeck(d => [...d.slice(1), d[0]]); setCue('idle'); setMiss(null); setTurn(n => n + 1); }, 1700);
    }
  }, [card, cue, left.id, mult, streak]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); decide(left.id); }
      if (e.key === 'ArrowRight') { e.preventDefault(); decide(right.id); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decide, left.id, right.id]);

  const total = game.cards.length;
  const firstTry = Object.values(results).filter(Boolean).length;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={40} />
        <StageTitle eyebrow="Game over" title={`${score} points`}>{firstTry} of {total} right on the first try.</StageTitle>
        <NibSays mood={firstTry === total ? 'cheer' : 'idle'}>
          {firstTry === total ? 'Not one disguised solution got past you.' : 'Tip: if it starts with “we need” or “add”, it’s almost always a solution.'}
        </NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const missLane = game.lanes.find(l => l.id === miss);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>

      <div className="flex items-center justify-between">
        <div className="flex gap-1" aria-label={`${hearts} of ${HEARTS} hearts left`}>
          {Array.from({ length: HEARTS }, (_, i) => (
            <motion.span key={i} animate={{ scale: i < hearts ? 1 : 0.7, opacity: i < hearts ? 1 : 0.25 }} transition={springs.pop}>
              <HeartIcon className="size-6 text-fg-error-primary" weight="fill" />
            </motion.span>
          ))}
        </div>
        <motion.span key={mult} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={springs.pop}
          className={cx('inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold', mult > 1 ? 'bg-mint-600 text-white' : 'bg-secondary text-tertiary')}>
          <LightningIcon className="size-4" weight="fill" />{score}{mult > 1 && ` · ×${mult}`}
        </motion.span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{total - deck.length} / {total}</span>
      </div>

      {/* the deck */}
      <div className="relative mx-auto grid h-64 w-full max-w-md place-items-center">
        {streak > 0 && streak % 3 === 0 && cue !== 'idle' && <Burst key={`b${streak}`} seed={streak} count={16} />}
        {deck.slice(1, 3).reverse().map((c, i, arr) => (
          <div key={`${c.id}-behind-${i}`} aria-hidden className="absolute h-52 w-full rounded-3xl bg-primary shadow-md ring-1 ring-secondary"
            style={{ transform: `translateY(${(arr.length - i) * 10}px) scale(${1 - (arr.length - i) * 0.05})` }} />
        ))}
        <SwipeCard key={turn} label={card.label} cue={cue} leftLabel={left.label} rightLabel={right.label}
          onSwipe={dir => decide(dir === 'left' ? left.id : right.id)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => decide(left.id)} disabled={cue !== 'idle'}
          className="flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-lg font-bold text-white transition active:scale-95 disabled:opacity-50" style={{ background: LEFT_C }}>
          <ArrowLeftIcon className="size-5" weight="bold" />{left.label}
        </button>
        <button type="button" onClick={() => decide(right.id)} disabled={cue !== 'idle'}
          className="flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-lg font-bold text-white transition active:scale-95 disabled:opacity-50" style={{ background: RIGHT_C }}>
          {right.label}<ArrowRightIcon className="size-5" weight="bold" />
        </button>
      </div>
      <p className="text-center text-sm text-tertiary">Swipe the card, tap a side, or use the ← → keys.</p>

      {missLane && <NibSays mood="sad">That one’s a <strong>{missLane.label.toLowerCase()}</strong>: {missLane.hint.toLowerCase()}. It’ll come back round.</NibSays>}
    </div>
  );
}

/** The top card: follows your finger, tilts as you drag, stamps PROBLEM / SOLUTION, and flies off when decided. */
function SwipeCard({ label, cue, leftLabel, rightLabel, onSwipe }: { label: string; cue: Cue; leftLabel: string; rightLabel: string; onSwipe: (dir: 'left' | 'right') => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const leftStamp = useTransform(x, [-120, -30], [1, 0]);
  const rightStamp = useTransform(x, [30, 120], [0, 1]);
  const target = cue === 'left' ? { x: -520, opacity: 0, y: 0 } : cue === 'right' ? { x: 520, opacity: 0, y: 0 } : cue === 'wrong' ? { x: [0, -16, 16, -10, 10, 0], opacity: 1, y: 0 } : { x: 0, opacity: 1, y: 0 };
  return (
    <motion.div drag={cue === 'idle' ? 'x' : false} dragSnapToOrigin dragElastic={0.9}
      onDragEnd={(_, info) => { if (info.offset.x < -110) onSwipe('left'); else if (info.offset.x > 110) onSwipe('right'); }}
      style={{ x, rotate }} initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ ...target, scale: 1 }}
      transition={cue === 'idle' ? springs.pop : { duration: cue === 'wrong' ? 0.45 : 0.35 }}
      className={cx('relative z-10 flex h-52 w-full cursor-grab touch-none flex-col items-center justify-center rounded-3xl bg-primary px-8 text-center shadow-xl ring-2 select-none ring-inset active:cursor-grabbing',
        cue === 'wrong' ? 'ring-error' : 'ring-secondary')}>
      <motion.span style={{ opacity: leftStamp, color: LEFT_C, borderColor: LEFT_C }} className="absolute top-4 left-4 -rotate-12 rounded-lg border-[3px] px-2 py-0.5 text-sm font-black tracking-widest uppercase">{leftLabel}</motion.span>
      <motion.span style={{ opacity: rightStamp, color: RIGHT_C, borderColor: RIGHT_C }} className="absolute top-4 right-4 rotate-12 rounded-lg border-[3px] px-2 py-0.5 text-sm font-black tracking-widest uppercase">{rightLabel}</motion.span>
      <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Problem or solution?</p>
      <p className="mt-2 text-xl font-semibold text-primary" data-current-card>{label}</p>
    </motion.div>
  );
}
