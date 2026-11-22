'use client';
// Mini-game for ui.1-4: a frame with three alignment lines (left, centre, right). Drag the block sideways and drop it
// near a line, or use the buttons. It snaps to the line you chose; right answers stay on the board, aligned. First try scores.
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowsHorizontalIcon, CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const JUSTIFY: Record<string, string> = { left: 'justify-start', center: 'justify-center', right: 'justify-end' };
const TEXT: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };

export function AlignSnap({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const frame = useRef<HTMLDivElement>(null);
  const block = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [placed, setPlaced] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;
  const done = game.cards.slice(0, i).filter(c => results[c.id]);

  const place = (laneId: string) => {
    if (!card || placed) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPlaced(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };
  // Drop zone = which third of the frame the block's centre ended in.
  const drop = () => {
    const f = frame.current?.getBoundingClientRect(), b = block.current?.getBoundingClientRect();
    if (!f || !b) return;
    const x = (b.left + b.width / 2 - f.left) / f.width;
    place(x < 1 / 3 ? 'left' : x > 2 / 3 ? 'right' : 'center');
  };

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} on the right line`}>Left to read, right to compare, centre for short lines.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>When in doubt, ask: will people read this, compare it, or just glance at it?</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = placed === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <p className="text-right text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</p>

      <div ref={frame} className="relative overflow-hidden rounded-2xl bg-primary px-4 py-5 ring-1 ring-secondary ring-inset">
        {/* the three alignment lines */}
        {['left-4', 'left-1/2', 'right-4'].map(pos => (
          <span key={pos} aria-hidden className={cx('absolute inset-y-0 w-0 border-l-2 border-dashed border-mint-500/50', pos)} />
        ))}
        {/* what's already aligned */}
        <div className="flex flex-col gap-1.5 pb-3">
          {done.map(c => (
            <div key={c.id} className={cx('flex', JUSTIFY[c.lane])}>
              <span className={cx('max-w-[60%] rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-tertiary', TEXT[c.lane])}>{c.label}</span>
            </div>
          ))}
        </div>
        {/* the block to place */}
        <div className={cx('flex', placed ? JUSTIFY[placed] : 'justify-center')}>
          <motion.div key={`${card.id}-${placed ?? 'free'}`} ref={block} layout
            drag={placed ? false : 'x'} dragConstraints={frame} dragElastic={0.08} dragMomentum={false} onDragEnd={drop}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            whileDrag={{ scale: 1.04, cursor: 'grabbing' }}
            className={cx('relative z-10 w-[56%] touch-none rounded-xl px-4 py-3 shadow-lg ring-2 ring-inset select-none sm:w-[44%]',
              placed ? (ok ? 'bg-mint-600/15 ring-mint-600' : 'bg-error-primary ring-error') : 'cursor-grab bg-primary ring-brand', placed ? TEXT[placed] : 'text-center')}
            data-current-card>
            {!placed && <ArrowsHorizontalIcon className="mx-auto mb-1 size-4 text-tertiary" weight="bold" />}
            <span className="text-md font-semibold text-primary">{card.label}</span>
          </motion.div>
        </div>
      </div>

      {!placed ? (
        <div className="grid grid-cols-3 gap-3">
          {game.lanes.map(l => (
            <motion.button key={l.id} type="button" onClick={() => place(l.id)} whileTap={{ scale: 0.96 }}
              className={cx('flex flex-col rounded-2xl bg-secondary px-3 py-3 ring-1 ring-secondary ring-inset hover:bg-primary_hover', TEXT[l.id])}>
              <span className="text-md font-bold text-primary">{l.label}</span>
              <span className="text-xs text-tertiary">{l.hint}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Snapped.' : `That one goes ${owner.label.toLowerCase()}.`}</span>{' '}
            {owner.label}: {owner.hint.toLowerCase()}.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPlaced(null); setI(x => x + 1); }}>{i + 1 < game.cards.length ? 'Next block' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
