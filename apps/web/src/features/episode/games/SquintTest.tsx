'use client';
// Mini-game for fd.2-2: each layout appears blurred, as if you're squinting. Judge it: clear (one thing leads) or muddled.
// Peeking at the sharp version is allowed but halves the points. After answering, it snaps into focus with the why.
import { useState } from 'react';
import { motion } from 'motion/react';
import { EyeIcon, LightningIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const D = '#101828', M = '#98A2B3', L = '#D0D5DD', B = '#222F4F', P = '#3B6FF5', R = '#D9467A', A = '#B97508';

/** The layouts, drawn on a white 320×200 "screen". */
export function LayoutVisual({ id }: { id: string }) {
  const lines = (x: number, y: number, n: number, w = 200, h = 8, gap = 16, c = M) => Array.from({ length: n }, (_, i) => <rect key={i} x={x} y={y + i * gap} width={w - (i % 2) * 30} height={h} rx={3} fill={c} />);
  const body = (() => {
    switch (id) {
      case 'hero-clear': return <><rect x={60} y={40} width={200} height={26} rx={5} fill={D} />{lines(90, 80, 2, 140, 7, 14)}<rect x={115} y={124} width={90} height={30} rx={8} fill={B} /><rect x={120} y={164} width={80} height={6} rx={3} fill={L} /></>;
      case 'twin-buttons': return <><rect x={70} y={44} width={180} height={12} rx={4} fill={M} />{lines(70, 70, 2, 180, 8, 16)}<rect x={70} y={118} width={84} height={30} rx={8} fill="none" stroke={B} strokeWidth={3} /><rect x={166} y={118} width={84} height={30} rx={8} fill="none" stroke={B} strokeWidth={3} /></>;
      case 'flat-text': return <>{lines(40, 30, 9, 240, 9, 17, '#667085')}</>;
      case 'card-clear': return <><rect x={90} y={22} width={140} height={78} rx={8} fill={L} /><rect x={90} y={112} width={120} height={16} rx={4} fill={D} /><rect x={90} y={136} width={70} height={12} rx={3} fill={B} />{lines(90, 158, 2, 120, 6, 12, L)}</>;
      case 'big-number': return <><text x={160} y={96} textAnchor="middle" fontSize={64} fontWeight={800} fill={D}>₹4.2L</text><rect x={110} y={112} width={100} height={8} rx={3} fill={M} />{[0, 1, 2].map(i => <rect key={i} x={50 + i * 80} y={142} width={60} height={34} rx={6} fill="#F2F4F7" />)}</>;
      case 'tile-wall': return <>{Array.from({ length: 12 }, (_, i) => <rect key={i} x={28 + (i % 4) * 68} y={22 + Math.floor(i / 4) * 56} width={60} height={46} rx={6} fill={[P, R, A][i % 3]} />)}</>;
      case 'form-clear': return <><rect x={90} y={26} width={140} height={14} rx={4} fill={D} />{[0, 1, 2].map(i => <rect key={i} x={90} y={56 + i * 30} width={140} height={20} rx={5} fill="none" stroke={L} strokeWidth={2} />)}<rect x={90} y={150} width={140} height={28} rx={8} fill={B} /><rect x={135} y={186} width={50} height={6} rx={3} fill={M} /></>;
      case 'loud-banner': return <><rect x={20} y={30} width={140} height={70} rx={8} fill={R} /><rect x={160} y={30} width={140} height={70} rx={8} fill={A} /><rect x={60} y={110} width={200} height={50} rx={8} fill={P} /><rect x={100} y={170} width={120} height={14} rx={4} fill={R} /></>;
      default: return null;
    }
  })();
  return <g><rect width={320} height={200} rx={12} fill="#FFFFFF" />{body}</g>;
}

export function SquintTest({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [peeked, setPeeked] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const card = game.cards[i];
  const [clear, muddled] = game.lanes;

  const judge = (laneId: string) => {
    if (answer) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setAnswer(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
    if (ok) setScore(s => s + (peeked ? 5 : 10));
  };
  const next = () => { setAnswer(null); setPeeked(false); setI(n => n + 1); };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${score} points`}>{right} of {game.cards.length} judged right.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Squint at your own screens. If nothing pops when blurry, nothing pops at all.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const sharp = !!answer || peeking;
  const ok = answer === card.lane;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-primary"><LightningIcon className="size-4 text-mint-600" weight="fill" />{score}</span>
        <span className="text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>

      <motion.div key={card.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop}
        className={cx('relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl shadow-lg ring-4 ring-inset', !answer ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <svg viewBox="0 0 320 200" className="block h-auto w-full" style={{ filter: sharp ? 'none' : 'blur(7px)', transition: 'filter 0.35s ease' }} role="img" aria-label={sharp ? card.label : 'A blurred layout'}>
          <LayoutVisual id={card.visual!} />
        </svg>
        {!answer && (
          <button type="button" aria-label="Hold to see it sharp (halves the points)"
            onPointerDown={() => { setPeeking(true); setPeeked(true); }} onPointerUp={() => setPeeking(false)} onPointerLeave={() => setPeeking(false)}
            onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { setPeeking(true); setPeeked(true); } }} onKeyUp={() => setPeeking(false)}
            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-brand-solid/90 px-3 py-1.5 text-xs font-bold text-white">
            <EyeIcon className="size-4" weight="bold" />{peeked ? 'Peeked (½ points)' : 'Hold to peek'}
          </button>
        )}
      </motion.div>

      {!answer ? (
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => judge(clear.id)} className="rounded-2xl bg-mint-600 px-4 py-4 text-lg font-bold text-white transition active:scale-95">{clear.label}: one thing leads</button>
          <button type="button" onClick={() => judge(muddled.id)} className="rounded-2xl bg-error-solid px-4 py-4 text-lg font-bold text-white transition active:scale-95">{muddled.label}: nothing leads</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>{ok ? 'Right. ' : 'Not quite. '}{card.label}: {game.lanes.find(l => l.id === card.lane)!.hint.toLowerCase()}.</NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={next}>{i + 1 < game.cards.length ? 'Next layout' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
