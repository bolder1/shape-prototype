'use client';
// Mini-game for ui.1-2: a 12-column grid. For each layout, choose how many columns one item spans; the grid fills with
// items of that span (12 ÷ span per row), so a wrong choice visibly breaks the layout. Lane ids are the column counts.
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
const COLS = 12;

function GridPreview({ span, ok }: { span: number | null; ok: boolean | null }) {
  const n = span ? COLS / span : 0;
  return (
    <div className="relative rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset">
      {/* the columns */}
      <div className="grid h-36 grid-cols-12 gap-1.5 sm:gap-2.5">
        {Array.from({ length: COLS }, (_, i) => <span key={i} className="rounded-md bg-[var(--color-family-discover)]/15" />)}
      </div>
      {/* items spanning */}
      {span && (
        <div className="absolute inset-3 grid grid-cols-12 gap-1.5 sm:gap-2.5">
          {Array.from({ length: n }, (_, i) => (
            <motion.span key={`${span}-${i}`} initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ ...springs.pop, delay: i * 0.06 }}
              className={cx('flex items-center justify-center rounded-lg text-xs font-bold text-white', ok ? 'bg-mint-600/85' : 'bg-error-solid/75')}
              style={{ gridColumn: `span ${span} / span ${span}` }}>
              {span}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ColumnSpan({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} spans right`}>Twelve divides by 2, 3, 4 and 6. That’s the whole trick.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Items per row × span = 12. Know one, and you know the other.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane;
  const pick = (laneId: string) => {
    if (picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: laneId === card.lane }));
  };
  const n = (id: string) => COLS / Number(id);

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <motion.p key={card.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="text-xl font-semibold text-primary" data-current-card>{card.label}</motion.p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <GridPreview span={picked ? Number(picked) : null} ok={picked ? ok : null} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-inset transition-colors disabled:cursor-default',
              picked === l.id ? (ok ? 'ring-mint-600' : 'ring-error') : picked && l.id === card.lane ? 'ring-mint-600' : 'ring-secondary hover:bg-primary_hover')}>
            <span className="text-display-xs font-semibold text-primary tabular-nums">{l.id}</span>
            <span className="text-sm font-semibold text-secondary">{l.label}</span>
            <span className="text-xs text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Right.' : 'Not quite.'}</span>{' '}
            {ok ? `${n(card.lane)} per row × ${card.lane} columns = 12.` : `Spanning ${picked} gives ${n(picked)} per row. This needs ${n(card.lane)} per row, so each spans ${card.lane}.`}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(x => x + 1); }}>{i + 1 < game.cards.length ? 'Next layout' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
