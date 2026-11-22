'use client';
// Mini-game for gr.1-3: each card is a behaviour that isn't happening, plotted on the Fogg chart from its `visual`
// ("motivation,ability,prompt"). Diagnose what's missing; then the fix plays out (motivation lifts the dot, ability slides
// it right, a prompt strikes as a bolt) and the dot turns green above the line. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, LightningIcon, LightningSlashIcon, XIcon } from '@phosphor-icons/react/ssr';
import { foggMissing, foggPoint, type Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY, NibSays, StageTitle } from '../kit';
import { FoggChart, foggXY } from '../scenes/Fogg';
import { SC } from '../scenes/shared';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function FoggFix({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} diagnosed right`}>Motivation, ability, prompt: find the missing one, fix only that.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>A reminder can’t fix a nine-screen form, and an easier form can’t fix a behaviour nobody wants.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const pt = foggPoint(card.visual ?? '5,5,1'), missing = foggMissing(pt);
  // After the pick, show the real fix.
  const fixed = picked ? { m: missing === 'motivation' ? 8 : pt.m, a: missing === 'ability' ? 8 : pt.a, p: 1 } : pt;
  const [x, y] = foggXY(fixed.m, fixed.a);
  const above = fixed.m * fixed.a >= 25 && fixed.p;
  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-lg font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <div className={cx('overflow-hidden rounded-2xl bg-secondary ring-2 ring-inset transition-colors', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <svg viewBox="40 60 600 430" className="mx-auto h-auto max-h-72 w-full" role="img" aria-label={`Fogg chart: motivation ${fixed.m} of 9, ability ${fixed.a} of 9, prompt ${fixed.p ? 'present' : 'missing'}`}>
          <FoggChart>
            <motion.g initial={false} animate={{ x, y }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
              <circle r={16} fill={above ? SC.mint : SC.error} />
              <g transform="translate(20 -42)">
                {fixed.p ? <LightningIcon x={0} y={0} width={30} height={30} color={SC.build} weight="fill" /> : <LightningSlashIcon x={0} y={0} width={30} height={30} color={SC.muted} weight="bold" />}
              </g>
            </motion.g>
          </FoggChart>
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {game.lanes.map((l, k) => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col rounded-2xl px-3 py-3 text-left text-white transition disabled:cursor-default', picked && l.id !== picked && l.id !== card.lane && 'opacity-50',
              picked && l.id === card.lane && 'ring-4 ring-mint-500')}
            style={{ background: FAMILY[[1, 2, 3][k]] }}>
            <span className="text-md font-bold">{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Right diagnosis.' : `It’s ${owner.label.toLowerCase()}.`}</span>{' '}
            {missing === 'prompt' ? 'They want to and can; add a reminder at the right moment.' : missing === 'ability' ? 'They want to, but it’s too hard. Make it simpler and the dot crosses the line.' : 'It’s easy, but nobody cares. Give people a real reason before any reminder.'}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next behaviour' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
