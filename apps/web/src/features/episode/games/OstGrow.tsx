'use client';
// Mini-game for st.1-2: the outcome sits at the top of a tree with one branch per opportunity (the lanes). Hang each
// solution under the opportunity it addresses; right answers grow the branch. A wrong branch shakes and you try again.
// Only the first try scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { TargetIcon, TreeStructureIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const OUTCOME = 'More weekly orders from regulars';

export function OstGrow({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [wrong, setWrong] = useState<string | null>(null);
  const card = game.cards[i];
  const hung = game.cards.slice(0, i);
  const right = Object.values(results).filter(Boolean).length;

  const hang = (laneId: string) => {
    if (!card) return;
    const ok = laneId === card.lane;
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { play('correct'); setWrong(null); setI(n => n + 1); }
    else { play('wrong'); setWrong(laneId); }
  };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={card ? 'Play' : 'Grown'} title={game.title}>{card ? game.instructions : `${right} of ${game.cards.length} hung on the right branch first time.`}</StageTitle>

      {card ? (
        <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springs.pop}
          className="flex items-center justify-between gap-3 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-[var(--color-family-discover)] ring-inset" data-current-card>
          <span className="text-lg font-semibold text-primary">{card.label}</span>
          <span className="shrink-0 text-xs font-bold text-tertiary uppercase">Solution · {i + 1}/{game.cards.length}</span>
        </motion.div>
      ) : <div className="relative"><Burst count={36} /></div>}

      {/* the tree */}
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary p-4 ring-1 ring-secondary ring-inset">
        <span className="inline-flex items-center gap-2 rounded-xl bg-mint-600 px-4 py-2 text-sm font-bold text-white"><TargetIcon className="size-4" weight="bold" />{OUTCOME}</span>
        <span aria-hidden className="h-4 w-0.5 bg-fg-quaternary" />
        <div className="grid w-full gap-3" style={{ gridTemplateColumns: `repeat(${game.lanes.length}, minmax(0, 1fr))` }}>
          {game.lanes.map((l, k) => {
            const sols = hung.filter(c => c.lane === l.id);
            const isWrong = wrong === l.id;
            return (
              <div key={l.id} className="flex flex-col items-center gap-2">
                <motion.button type="button" onClick={() => hang(l.id)} disabled={!card} whileTap={{ scale: 0.97 }}
                  animate={isWrong ? { x: [0, -8, 8, -4, 0] } : {}} transition={{ duration: 0.4 }}
                  className={cx('w-full rounded-xl px-2 py-2.5 text-center text-sm font-bold text-white ring-2 ring-inset transition disabled:cursor-default', isWrong ? 'ring-error' : 'ring-transparent')}
                  style={{ background: FAMILY_SOLID[[1, 3, 0][k % 3]] }}>
                  {l.label}
                </motion.button>
                {sols.map(c => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: -10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={springs.pop} className="flex w-full flex-col items-center">
                    <span aria-hidden className="h-3 w-0.5 bg-fg-quaternary" />
                    <span className={cx('w-full rounded-lg bg-primary px-2 py-1.5 text-center text-xs font-semibold text-primary ring-1 ring-inset', results[c.id] ? 'ring-mint-600' : 'ring-secondary')}>{c.label}</span>
                  </motion.div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-14">
        {card && wrong && <NibSays mood="think"><TreeStructureIcon className="mr-1 inline size-4" weight="bold" />Which need does it really answer? Try another branch.</NibSays>}
        {!card && (
          <div className="flex flex-col items-center gap-4 text-center">
            <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Every opportunity now has several solutions to compare. That’s the point: you’re not betting on the first idea.</NibSays>
            <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
          </div>
        )}
      </div>
    </div>
  );
}
