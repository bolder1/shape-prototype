'use client';
// Mini-game for rs.2-1: an interview script on paper with four parts (intro & warm-up, broad, deep dive, wrap-up).
// Tap the part each line belongs to; it's written into the script. A wrong part shakes and you try again; first try scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { NotebookIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function ScriptBuilder({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [wrong, setWrong] = useState<string | null>(null);
  const card = game.cards[i];
  const written = game.cards.slice(0, i);
  const right = Object.values(results).filter(Boolean).length;

  const place = (laneId: string) => {
    if (!card) return;
    const ok = laneId === card.lane;
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { play('correct'); setWrong(null); setI(n => n + 1); }
    else { play('wrong'); setWrong(laneId); }
  };
  const owner = card && game.lanes.find(l => l.id === card.lane)!;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={card ? 'Play' : 'Script ready'} title={game.title}>{card ? game.instructions : `${right} of ${game.cards.length} lines placed right first time.`}</StageTitle>

      {card ? (
        <motion.div key={card.id} initial={{ y: -12, opacity: 0, rotate: -1 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={springs.pop}
          className="rounded-2xl bg-primary px-5 py-4 text-lg font-medium text-primary italic shadow-lg ring-2 ring-secondary ring-inset" data-current-card>
          {card.label}
        </motion.div>
      ) : <div className="relative"><Burst count={36} /></div>}

      {/* the script, on paper */}
      <div className="rounded-2xl bg-[#FFFDF5] p-4 text-[#1F2937] shadow-lg ring-1 ring-[#E7E1CF] ring-inset">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-[#8A7F63] uppercase"><NotebookIcon className="size-4" weight="bold" />Interview script · paying bills · 45 min</p>
        <div className="flex flex-col gap-2">
          {game.lanes.map((l, k) => {
            const lines = written.filter(c => c.lane === l.id);
            return (
              <motion.button key={l.id} type="button" onClick={() => place(l.id)} disabled={!card} whileTap={{ scale: 0.99 }}
                animate={wrong === l.id ? { x: [0, -8, 8, -4, 0] } : {}} transition={{ duration: 0.4 }}
                className={cx('flex flex-col gap-1.5 rounded-xl border-l-4 bg-white/60 px-3 py-2.5 text-left ring-1 ring-inset transition-colors disabled:cursor-default',
                  wrong === l.id ? 'ring-[#DC2626]' : 'ring-[#EDE7D3] hover:bg-white')}
                style={{ borderLeftColor: FAMILY[[0, 1, 3, 2][k]] }}>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-md font-bold">{k + 1}. {l.label}</span>
                  <span className="text-xs text-[#8A7F63]">{l.hint}</span>
                </span>
                {lines.map(c => (
                  <motion.span key={c.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop}
                    className={cx('text-sm italic', results[c.id] ? 'text-[#1F2937]' : 'text-[#8A7F63]')}>{c.label}</motion.span>
                ))}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="min-h-14">
        {card && wrong && owner && <NibSays mood="think">Not that part. Think about where this sits in the conversation: {owner.hint.toLowerCase()}?</NibSays>}
        {!card && (
          <div className="flex flex-col items-center gap-4 text-center">
            <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Read it top to bottom: it moves from their day to one specific story, then closes the loop. That’s the funnel.</NibSays>
            <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
          </div>
        )}
      </div>
    </div>
  );
}
