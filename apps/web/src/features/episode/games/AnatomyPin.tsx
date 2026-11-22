'use client';
// Mini-game for ui.2-1: a giant "Hxp" with its four lines drawn in. Each clue describes one line; tap the line on the
// drawing (or its button). The right line glows; a miss shows where it really is. Scored on the first tap.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { Hxp, LINE_COLOR, LINES } from '../scenes/TypeAnatomy';
import { SC } from '../scenes/shared';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type LineId = keyof typeof LINES;
const S = 2.4, OX = 60, OY = 210;   // specimen scale and baseline origin in the SVG

export function AnatomyPin({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} lines pinned first time`}>Baseline, x-height, cap height, descender.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Next time two fonts look different at the same size, check their x-heights.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>

      <div className={cx('overflow-hidden rounded-2xl bg-secondary ring-2 ring-inset transition-colors', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <svg viewBox="0 0 560 300" className="h-auto w-full" role="group" aria-label="The word Hxp with four lines. Tap a line.">
          <g transform={`translate(${OX} ${OY}) scale(${S})`}><Hxp color={SC.text} /></g>
          {game.lanes.map(l => {
            const id = l.id as LineId, y = OY + LINES[id] * S, c = LINE_COLOR[id];
            const isPicked = picked === l.id, isAnswer = picked && l.id === card.lane;
            return (
              <g key={l.id} role="button" tabIndex={picked ? -1 : 0} aria-label={l.label} className={cx('outline-none', !picked && 'cursor-pointer')}
                onClick={() => pick(l.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(l.id); } }}>
                <rect x={0} y={y - 14} width={560} height={28} fill={c} opacity={isAnswer ? 0.22 : isPicked ? 0.12 : 0} />
                <line x1={40} x2={440} y1={y} y2={y} stroke={c} strokeWidth={isAnswer ? 5 : 3} strokeDasharray={id === 'base' ? undefined : '10 6'} opacity={picked && !isAnswer && !isPicked ? 0.4 : 1} />
                <rect x={452} y={y - 13} width={100} height={26} rx={13} fill={c} />
                <text x={502} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">{l.label}</text>
                {isAnswer && <circle cx={40} cy={y} r={7} fill={SC.mint} />}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('rounded-xl px-3 py-2.5 text-sm font-bold text-white transition disabled:cursor-default', picked && l.id !== picked && l.id !== card.lane && 'opacity-50',
              picked && l.id === card.lane && 'ring-4 ring-mint-500')}
            style={{ background: LINE_COLOR[l.id as LineId] }}>{l.label}</motion.button>
        ))}
      </div>

      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Pinned.' : `That’s the ${owner.label.toLowerCase()}.`}</span>{' '}
            {owner.hint}.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next clue' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
