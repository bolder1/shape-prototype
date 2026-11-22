'use client';
// Mini-game for ds.1-1: a tower of four levels, atoms at the bottom and templates at the top. Drag each part (drawn from
// its `visual`) onto its level, or tap the level. Right answers stack up on the shelf; a miss explains and the part
// comes back later. First try scores.
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { HandGrabbingIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY, NibSays, StageTitle } from '../kit';
import { PartArt } from '../scenes/Atomic';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function AtomStack({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const shelves = useRef<Record<string, HTMLButtonElement | null>>({});
  const card = deck[0];
  const tower = [...game.lanes].reverse();   // templates on top

  const send = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setPlaced(p => [...p, card.id]); setDeck(d => d.slice(1)); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2000); }
  };

  /** Drop on whichever shelf is under the pointer. */
  const drop = (e: MouseEvent | TouchEvent | PointerEvent) => {
    const pt = 'changedTouches' in e ? e.changedTouches[0] : e;
    const hit = game.lanes.find(l => {
      const r = shelves.current[l.id]?.getBoundingClientRect();
      return r && pt.clientX >= r.left && pt.clientX <= r.right && pt.clientY >= r.top && pt.clientY <= r.bottom;
    });
    if (hit) send(hit.id);
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Tower built" title={`${right} of ${game.cards.length} parts stacked first time`}>Atoms at the bottom, templates at the top.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Ask: can I break it down further and still have something useful? If not, it’s an atom.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The part</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>

      <motion.div key={`${card.id}-${deck.length}`} drag={!miss} dragSnapToOrigin dragElastic={0.6} dragMomentum={false} onDragEnd={drop} whileDrag={{ scale: 1.05, rotate: -2, zIndex: 20 }}
        initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('relative mx-auto flex w-full max-w-sm cursor-grab touch-none items-center gap-3 rounded-2xl bg-primary p-3 shadow-lg ring-2 ring-inset active:cursor-grabbing', miss ? 'ring-error' : 'ring-secondary')}
        data-current-card>
        <svg viewBox="0 0 160 100" className="h-20 w-32 shrink-0 rounded-xl bg-secondary" aria-hidden><PartArt visual={card.visual} /></svg>
        <span className="flex-1 text-md font-semibold text-primary">{card.label}</span>
        <HandGrabbingIcon className="size-5 shrink-0 text-quaternary" aria-hidden />
      </motion.div>

      <div className="flex flex-col gap-2">
        {tower.map(l => {
          const k = game.lanes.findIndex(x => x.id === l.id);
          const here = game.cards.filter(c => placed.includes(c.id) && c.lane === l.id);
          return (
            <motion.button key={l.id} ref={el => { shelves.current[l.id] = el; }} type="button" onClick={() => send(l.id)} disabled={miss} whileTap={{ scale: 0.99 }}
              className={cx('flex min-h-20 items-center gap-3 rounded-2xl bg-primary p-2 pr-3 text-left ring-2 ring-inset transition-colors hover:bg-primary_hover disabled:cursor-default',
                miss && l.id === card.lane ? 'ring-mint-600' : 'ring-secondary')}
              style={{ marginInline: `${k * 4}%` }}>
              <span className="flex w-28 shrink-0 flex-col rounded-xl px-3 py-2 text-white" style={{ background: FAMILY[k] }}>
                <span className="text-sm font-bold">{l.label}</span>
                <span className="text-[11px] leading-tight font-medium opacity-90">{l.hint}</span>
              </span>
              <span className="flex flex-wrap gap-1.5">
                {here.map(c => (
                  <motion.svg key={c.id} viewBox="0 0 160 100" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                    className="h-10 w-16 rounded-lg bg-secondary" role="img" aria-label={c.label}><PartArt visual={c.visual} /></motion.svg>
                ))}
              </span>
            </motion.button>
          );
        })}
      </div>
      <div className="min-h-14">
        {miss && <NibSays mood="sad">That’s {/^[aeiou]/i.test(owner.label) ? 'an' : 'a'} <strong>{owner.label.toLowerCase()}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}
      </div>
    </div>
  );
}
