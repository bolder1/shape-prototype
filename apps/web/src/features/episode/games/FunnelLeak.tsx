'use client';
// Mini-game for gr.1-1: each card is a product's funnel (`visual` = visitors|sign-ups|activated|retained|paying), drawn
// as bars. Tap the step between two bars that leaks the most; then every step's conversion rate is revealed and the
// leakiest one glows. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { funnelCounts, funnelRates, leakiestStep, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const STAGES = ['Visitors', 'Signed up', 'Activated', 'Month 2', 'Paying'];

export function FunnelLeak({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} leaks found`}>Look at the rate between stages, not the size of each bar.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Big drops at the top are normal. The leak is where the rate is lowest compared with what that step should be.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const counts = funnelCounts(card.visual ?? '1|1|1|1|1'), rates = funnelRates(counts), worst = leakiestStep(counts);
  const ok = picked === card.lane;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col gap-1 rounded-2xl bg-secondary p-4 ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        {counts.map((n, k) => (
          <div key={k} className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs font-semibold text-tertiary">{STAGES[k]}</span>
              <span className="h-7 rounded-md transition-all" style={{ width: `${Math.max(1.5, (n / counts[0]) * 75)}%`, background: "var(--color-family-discover)" }} />
              <span className="text-sm font-bold text-primary tabular-nums">{n.toLocaleString('en-IN')}</span>
            </div>
            {k < 4 && (() => {
              const lane = game.lanes[k], isWorst = picked && lane.id === worst, mine = picked === lane.id;
              return (
                <motion.button type="button" onClick={() => pick(lane.id)} disabled={!!picked} whileTap={{ scale: 0.97 }}
                  className={cx('ml-20 flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-semibold ring-1 ring-inset transition-colors disabled:cursor-default',
                    isWorst ? 'bg-error-solid text-white ring-error' : mine ? 'bg-primary text-primary ring-error' : 'bg-primary text-secondary ring-secondary hover:bg-primary_hover')}>
                  <span>↓ {lane.label} · {lane.hint}</span>
                  {picked && <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop} className="tabular-nums">{Math.round(rates[k] * 100)}%</motion.span>}
                </motion.button>
              );
            })()}
          </div>
        ))}
      </motion.div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Found it.' : 'Not the worst step.'}</span>{' '}
            {game.lanes.find(l => l.id === worst)!.hint} converts only {Math.round(Math.min(...rates) * 100)}%: fix that before anything else.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next funnel' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
