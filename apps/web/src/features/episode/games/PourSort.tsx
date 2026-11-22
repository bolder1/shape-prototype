'use client';
// Mini-game for ax.1-2: four pillars (Perceivable, Operable, Understandable, Robust). Drag each fix onto its pillar, or
// tap the pillar. Right answers stack inside the pillar, which grows; a miss explains and the card comes back later.
// First try scores.
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { HandGrabbingIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PILLARS } from '../scenes/Pour';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function PourSort({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const pillars = useRef<Record<string, HTMLButtonElement | null>>({});
  const card = deck[0];
  const colour = (id: string) => PILLARS.find(p => p.id === id)?.c ?? 'var(--color-family-discover)';

  const send = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setPlaced(p => [...p, card.id]); setDeck(d => d.slice(1)); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2000); }
  };
  const drop = (e: MouseEvent | TouchEvent | PointerEvent) => {
    const pt = 'changedTouches' in e ? e.changedTouches[0] : e;
    const hit = game.lanes.find(l => {
      const r = pillars.current[l.id]?.getBoundingClientRect();
      return r && pt.clientX >= r.left && pt.clientX <= r.right && pt.clientY >= r.top && pt.clientY <= r.bottom;
    });
    if (hit) send(hit.id);
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Pillars built" title={`${right} of ${game.cards.length} fixes placed first time`}>Perceivable, Operable, Understandable, Robust.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>When you meet a new WCAG rule, ask which of the four questions it answers. It makes the list far easier to remember.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The fix</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} drag={!miss} dragSnapToOrigin dragElastic={0.6} dragMomentum={false} onDragEnd={drop} whileDrag={{ scale: 1.05, rotate: -2, zIndex: 20 }}
        initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('relative mx-auto flex w-full max-w-md cursor-grab touch-none items-center gap-3 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset active:cursor-grabbing', miss ? 'ring-error' : 'ring-secondary')}
        data-current-card>
        <span className="flex-1 text-lg font-semibold text-primary">{card.label}</span>
        <HandGrabbingIcon className="size-5 shrink-0 text-quaternary" aria-hidden />
      </motion.div>
      <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-4">
        {game.lanes.map(l => {
          const here = game.cards.filter(c => placed.includes(c.id) && c.lane === l.id);
          return (
            <motion.button key={l.id} ref={el => { pillars.current[l.id] = el; }} type="button" onClick={() => send(l.id)} disabled={miss} whileTap={{ scale: 0.98 }}
              className={cx('flex flex-col justify-end gap-1.5 rounded-2xl p-2 text-left text-white transition disabled:cursor-default', miss && l.id === card.lane && 'ring-4 ring-mint-500')}
              style={{ background: colour(l.id), minHeight: 150 + here.length * 46 }}>
              {here.map(c => (
                <motion.span key={c.id} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springs.pop}
                  className="rounded-lg bg-white/90 px-2 py-1.5 text-[11px] leading-snug font-semibold text-[#111827]">{c.label}</motion.span>
              ))}
              <span className="mt-1 text-3xl leading-none font-black">{l.label[0]}</span>
              <span className="text-sm font-bold">{l.label}</span>
              <span className="text-[11px] leading-tight font-medium opacity-90">{l.hint}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="min-h-14">{miss && <NibSays mood="sad">That’s <strong>{owner.label}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}</div>
    </div>
  );
}
