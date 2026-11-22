'use client';
// Mini-game for fd.2-1: a board of six drawn pictures. Each round names one principle; tap every picture that shows it,
// then lock in. A picture counts as right if it's picked in its own round and never picked in another.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const INK = 'var(--color-text-primary)', BLUE = 'var(--color-family-discover)', AMBER = 'var(--color-family-design)', MUTED = 'var(--color-text-quaternary)';

/** The pictures. Each shows one principle clearly; drawn in a 160×110 box. */
export function GestaltVisual({ id }: { id: string }) {
  switch (id) {
    case 'dot-clusters':
      return <g>{[[30, 40], [48, 40], [30, 58], [48, 58], [30, 76], [48, 76], [112, 40], [130, 40], [112, 58], [130, 58], [112, 76], [130, 76]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={INK} />)}</g>;
    case 'field-groups':
      return <g>{[16, 34, 52, 82, 100].map((y, i) => <rect key={i} x={30} y={y - 4} width={100} height={12} rx={3} fill="none" stroke={INK} strokeWidth={2} />)}</g>;
    case 'shape-rows':
      return <g>{[0, 1, 2].map(r => [0, 1, 2, 3, 4].map(c => r === 1
        ? <rect key={`${r}${c}`} x={24 + c * 26} y={46} width={16} height={16} fill={AMBER} />
        : <circle key={`${r}${c}`} cx={32 + c * 26} cy={22 + r * 34} r={8} fill={BLUE} />))}</g>;
    case 'odd-link':
      return <g>{['Pricing', 'Docs', 'Blog', 'Careers'].map((l, i) => (
        <g key={l}><text x={40} y={26 + i * 24} fontSize={14} fontWeight={600} fill={i === 3 ? MUTED : BLUE}>{l}</text>{i < 3 && <line x1={40} x2={40 + l.length * 7.6} y1={29 + i * 24} y2={29 + i * 24} stroke={BLUE} strokeWidth={1.5} />}</g>
      ))}</g>;
    case 'broken-circle':
      return <g transform="translate(80 55)">{[0, 1, 2, 3].map(j => { const a0 = (j * 90 + 18) * Math.PI / 180, a1 = (j * 90 + 72) * Math.PI / 180, r = 38; return <path key={j} d={`M ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />; })}</g>;
    case 'implied-triangle':
      return <g transform="translate(80 60)">{[[-40, 30], [40, 30], [0, -38]].map(([x, y], i) => {
        const ang = Math.atan2(-y, -x), m = 0.52, r = 15;
        return <path key={i} d={`M ${x} ${y} L ${x + Math.cos(ang - m) * r} ${y + Math.sin(ang - m) * r} A ${r} ${r} 0 1 0 ${x + Math.cos(ang + m) * r} ${y + Math.sin(ang + m) * r} Z`} fill={INK} />;
      })}</g>;
    default:
      return null;
  }
}

export function GestaltHunt({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);
  /** Every pick made in every round: cardId → the lane rounds it was picked in. */
  const [history, setHistory] = useState<Record<string, string[]>>({});
  const lane = game.lanes[round];
  const done = round >= game.lanes.length;

  const toggle = (id: string) => {
    if (revealed) return;
    play('tap');
    setPicked(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const lockIn = () => {
    play(game.cards.every(c => (c.lane === lane.id) === picked.has(c.id)) ? 'correct' : 'wrong');
    setRevealed(true);
    setHistory(h => { const n = { ...h }; for (const id of picked) n[id] = [...(n[id] ?? []), lane.id]; return n; });
  };
  const next = () => { setRevealed(false); setPicked(new Set()); setRound(r => r + 1); };
  const resultFor = (c: Game['cards'][number]) => { const h = history[c.id] ?? []; return h.length === 1 && h[0] === c.lane; };

  if (done) {
    const right = game.cards.filter(resultFor).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} spotted`}>Your eye for Gestalt, sharpened.</StageTitle>
        <div className="grid grid-cols-3 gap-2">
          {game.cards.map(c => (
            <div key={c.id} className={cx('rounded-xl p-1 ring-2 ring-inset', resultFor(c) ? 'ring-mint-600' : 'ring-error')}>
              <svg viewBox="0 0 160 110" className="h-16 w-24"><GestaltVisual id={c.visual!} /></svg>
              <p className="text-xs font-semibold text-tertiary">{game.lanes.find(l => l.id === c.lane)!.label}</p>
            </div>
          ))}
        </div>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: resultFor(c) })))}>Continue the story</Button>
      </div>
    );
  }

  const right = revealed ? game.cards.filter(c => (c.lane === lane.id) === picked.has(c.id)).length : 0;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={`Play · round ${round + 1} of ${game.lanes.length}`} title={game.title}>{game.instructions}</StageTitle>
      <motion.div key={lane.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
        className="rounded-2xl bg-brand-solid px-5 py-3 text-center text-white">
        <p className="text-sm text-brand-200">Tap every picture that shows</p>
        <p className="text-display-xs font-bold">{lane.label}</p>
        <p className="text-sm text-brand-200">{lane.hint}</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {game.cards.map(c => {
          const on = picked.has(c.id), belongs = c.lane === lane.id;
          const state = !revealed ? (on ? 'on' : 'off') : belongs && on ? 'hit' : belongs ? 'missed' : on ? 'wrong' : 'off';
          return (
            <motion.button key={c.id} type="button" onClick={() => toggle(c.id)} aria-pressed={on} aria-label={c.label} disabled={revealed}
              whileTap={{ scale: 0.95 }} animate={state === 'wrong' ? { x: [0, -8, 8, 0] } : state === 'hit' ? { scale: [1, 1.05, 1] } : {}}
              className={cx('relative rounded-2xl bg-primary p-2 ring-2 transition-colors ring-inset',
                state === 'on' && 'bg-brand-primary ring-brand-solid', state === 'off' && 'ring-secondary hover:bg-primary_hover',
                state === 'hit' && 'ring-mint-600', state === 'missed' && 'ring-mint-600 opacity-80', state === 'wrong' && 'ring-error')}>
              <svg viewBox="0 0 160 110" className="h-auto w-full"><GestaltVisual id={c.visual!} /></svg>
              {(state === 'hit' || state === 'wrong') && (
                <span className={cx('absolute top-2 right-2 grid size-7 place-items-center rounded-full text-white', state === 'hit' ? 'bg-mint-600' : 'bg-error-solid')}>
                  {state === 'hit' ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}
                </span>
              )}
              {state === 'missed' && <span className="absolute top-2 right-2 rounded-full bg-mint-600 px-2 py-0.5 text-xs font-bold text-white">missed</span>}
            </motion.button>
          );
        })}
      </div>
      {!revealed
        ? <div className="flex justify-end"><Button size="lg" onPress={lockIn} isDisabled={!picked.size}>Lock in</Button></div>
        : (
          <div className="flex flex-col gap-3">
            <NibSays mood={right === game.cards.length ? 'cheer' : 'think'}>{right === game.cards.length ? `Perfect round. ${lane.hint}.` : `${lane.label}: ${lane.hint.toLowerCase()}. The dashed ones were it too.`}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{round + 1 < game.lanes.length ? 'Next round' : 'See results'}</Button></div>
          </div>
        )}
    </div>
  );
}
