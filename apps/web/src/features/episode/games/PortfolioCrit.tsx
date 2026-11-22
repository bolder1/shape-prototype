'use client';
// Mini-game for ld.2-2: each card is a line from someone's portfolio, shown on a portfolio page. Strong or weak? Then the
// card's `note` gives a reviewer's take. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, ThumbsDownIcon, ThumbsUpIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function PortfolioCrit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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
        <StageTitle eyebrow="Critique done" title={`${right} of ${game.cards.length} lines judged right`}>Specific, honest and focused beats pretty.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Run your own portfolio through the same test: underline every vague adjective and replace it with a fact.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">From a portfolio</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('mx-auto flex w-full max-w-lg flex-col gap-3 rounded-2xl bg-primary p-5 ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}
        data-current-card>
        <span className="flex gap-1.5"><span className="h-2 w-16 rounded-full bg-quaternary" /><span className="h-2 w-10 rounded-full bg-quaternary" /></span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <span className="flex flex-col gap-1.5"><span className="h-2 w-full rounded-full bg-secondary" /><span className="h-2 w-4/5 rounded-full bg-secondary" /></span>
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-center gap-1 rounded-2xl px-4 py-3 text-white transition disabled:cursor-default',
              l.id === 'strong' ? 'bg-mint-700' : 'bg-error-solid', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-4 ring-mint-300')}>
            <span className="flex items-center gap-2 text-lg font-bold">{l.id === 'strong' ? <ThumbsUpIcon className="size-5" weight="fill" /> : <ThumbsDownIcon className="size-5" weight="fill" />}{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{card.lane === 'strong' ? 'Strong.' : 'Weak.'}</span>{' '}
            {card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next line' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
