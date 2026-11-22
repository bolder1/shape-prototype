'use client';
// Mini-game for cw.1-3: an error appears under a form field. Diagnose it (vague, dead end, blames you, or helpful).
// Then the field shows the better message (`note`). First diagnosis scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircleIcon, CheckIcon, StethoscopeIcon, WarningCircleIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function ErrorDoctor({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Clinic closed" title={`${right} of ${game.cards.length} diagnosed right`}>What went wrong, how to fix it, no blame.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Every error you write: could someone fix the problem from this message alone?</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!, good = card.lane === 'good';
  const diagnose = (laneId: string) => {
    if (picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: laneId === card.lane }));
  };
  const fixed = picked && !good && card.note;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <p className="text-right text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</p>

      {/* the form field with its error */}
      <motion.div key={card.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
        className="mx-auto flex w-full max-w-md flex-col gap-1.5 rounded-2xl bg-primary p-5 shadow-lg ring-1 ring-secondary ring-inset">
        <span className="text-sm font-semibold text-secondary">Your details</span>
        <span className={cx('block h-11 rounded-lg bg-secondary ring-2 ring-inset', fixed || (picked && good) ? 'ring-mint-600' : 'ring-error')} />
        <p className={cx('flex items-start gap-1.5 text-sm font-semibold', fixed ? 'text-quaternary line-through' : 'text-error-primary')} data-current-card>
          <WarningCircleIcon className="mt-0.5 size-4 shrink-0" weight="fill" />{card.label}
        </p>
        {fixed && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.pop, delay: 0.2 }} className="flex items-start gap-1.5 text-sm font-semibold text-primary">
            <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-mint-600" weight="fill" />{card.note}
          </motion.p>
        )}
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => diagnose(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-inset transition-colors disabled:cursor-default',
              picked === l.id ? (ok ? 'ring-mint-600' : 'ring-error') : picked && l.id === card.lane ? 'ring-mint-600' : 'ring-secondary hover:bg-primary_hover',
              picked && picked !== l.id && l.id !== card.lane && 'opacity-50')}>
            <span className="inline-flex items-center gap-1.5 text-md font-bold text-primary">{l.id === 'good' ? <CheckCircleIcon className="size-4 text-mint-600" weight="fill" /> : <StethoscopeIcon className="size-4 text-tertiary" weight="bold" />}{l.label}</span>
            <span className="text-xs text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>

      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Right.' : `It’s “${owner.label}”.`}</span>{' '}
            {good ? 'It says what’s wrong and what to do about it.' : `${owner.hint}. Better: “${card.note}”`}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next patient' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
