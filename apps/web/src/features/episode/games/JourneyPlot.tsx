'use client';
// Mini-game for rs.3-4: the four stages of a remote medicine refill sit under a feeling line. Each card is a piece of
// interview evidence; tap the stage where it happened. Placed evidence stacks under its stage with how that person felt
// (`visual`, −2…2), and the line redraws from the averages (`journeyFeelings`). A miss explains and the card comes back
// later. At the end the low point (`journeyLow`) is ringed "Fix here first", against the roadmap's "redesign checkout".
import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPinIcon } from '@phosphor-icons/react/ssr';
import { JOURNEY_STAGES, journeyFeelings, journeyLow, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FeelingLine } from '../scenes/JourneyMap';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const XS = [100, 300, 500, 700];
const feel = (v: string | undefined) => { const n = Number(v); return n > 0 ? `+${n}` : String(n); };

export function JourneyPlot({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const card = deck[0];
  const done = game.cards.filter(c => placed.includes(c.id));
  const lastCard = game.cards.find(c => c.id === placed[placed.length - 1]);
  const values = journeyFeelings(done);
  const low = card ? null : journeyLow(game.cards);
  const lowIndex = low ? JOURNEY_STAGES.indexOf(low) : null;

  const send = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setPlaced(p => [...p, card.id]); setDeck(d => d.slice(1)); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2400); }
  };

  const map = (
    <div className="flex flex-col gap-2 rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset">
      <svg viewBox="0 0 800 150" className="w-full" role="img" aria-label={`Feeling line across the four stages, from ${done.length} pieces of evidence`}>
        <FeelingLine values={values} xs={XS} top={12} height={126} low={lowIndex} />
        {lowIndex !== null && (
          <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
            <text x={XS[lowIndex] + 26} y={136} fontSize={15} fontWeight={800} fill="var(--color-fg-error-primary)">Fix here first</text>
          </motion.g>
        )}
      </svg>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map((l, k) => {
          const here = done.filter(c => c.lane === l.id);
          return (
            <div key={l.id} className="flex flex-col gap-1.5">
              <motion.button type="button" onClick={() => send(l.id)} disabled={miss || !card} whileTap={card ? { scale: 0.96 } : undefined}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl bg-secondary px-3 py-2 text-left ring-2 ring-inset transition disabled:cursor-default',
                  card && 'hover:bg-primary_hover', miss && l.id === card?.lane ? 'ring-4 ring-mint-600' : lowIndex === k ? 'ring-error' : 'ring-transparent')}>
                <span className="text-sm font-bold text-primary">{k + 1}. {l.label}</span>
                <span className="text-[11px] leading-tight text-tertiary">{l.hint}</span>
              </motion.button>
              {here.map(c => (
                <motion.div key={c.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
                  className="flex items-start justify-between gap-2 rounded-lg bg-primary px-2 py-1.5 text-xs leading-snug text-primary ring-1 ring-secondary ring-inset">
                  <span>{c.label}</span>
                  <span className={cx('shrink-0 font-bold tabular-nums', Number(c.visual) < 0 ? 'text-error-primary' : 'text-primary')}>{feel(c.visual)}</span>
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    const lowLane = game.lanes.find(l => l.id === low)!;
    const high = game.lanes[values.indexOf(Math.max(...values.map(v => v ?? -Infinity)))];
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Journey mapped" title={`${right} of ${game.cards.length} pieces of evidence on the right stage first time`}>
          The low point is <strong>{lowLane.label}</strong>. The high point is <strong>{high.label}</strong>, the part the roadmap wanted to redesign.
        </StageTitle>
        <div className="w-full text-left">{map}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Take this to the roadmap meeting: the evidence under the low point, an owner, and one opportunity. Checkout can wait.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="flex items-center gap-1 text-sm font-semibold text-tertiary"><MapPinIcon className="size-4" weight="bold" aria-hidden />From the interviews</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-center text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <div className="min-h-14">
        {miss && <NibSays mood="sad">That happened at <strong>{owner.label}</strong>: {owner.hint.toLowerCase()}. {card.note} It’ll come back round.</NibSays>}
        {!miss && lastCard && <NibSays mood="cheer">{lastCard.note}</NibSays>}
      </div>
      {map}
    </div>
  );
}
