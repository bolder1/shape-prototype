'use client';
// Mini-game for dc.1-1: a recipe page wireframe split into its landmarks (header, nav, main, footer). Drag each part onto
// the region that should hold it, or tap the region. Right answers sit inside the region; a miss explains and the part
// comes back later. First try scores.
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { HandGrabbingIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { REGIONS } from '../scenes/DomTree';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const HEIGHT: Record<string, string> = { header: 'min-h-16', nav: 'min-h-12', main: 'min-h-40', footer: 'min-h-14' };

export function TagMatch({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const zones = useRef<Record<string, HTMLButtonElement | null>>({});
  const card = deck[0];

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
      const r = zones.current[l.id]?.getBoundingClientRect();
      return r && pt.clientX >= r.left && pt.clientX <= r.right && pt.clientY >= r.top && pt.clientY <= r.bottom;
    });
    if (hit) send(hit.id);
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Page tagged" title={`${right} of ${game.cards.length} parts placed first time`}>header, nav, main, footer: a map screen readers can jump through.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Name your Figma frames the same way (Header, Nav, Main, Footer) and developers can follow your structure exactly.</NibSays>
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
        className={cx('relative mx-auto flex w-full max-w-md cursor-grab touch-none items-center gap-3 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset active:cursor-grabbing', miss ? 'ring-error' : 'ring-secondary')}
        data-current-card>
        <span className="flex-1 text-lg font-semibold text-primary">{card.label}</span>
        <HandGrabbingIcon className="size-5 shrink-0 text-quaternary" aria-hidden />
      </motion.div>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-1.5 rounded-2xl bg-secondary p-2">
        {game.lanes.map(l => {
          const here = game.cards.filter(c => placed.includes(c.id) && c.lane === l.id), c = REGIONS.find(r => r.id === l.id)?.c;
          return (
            <motion.button key={l.id} ref={el => { zones.current[l.id] = el; }} type="button" onClick={() => send(l.id)} disabled={miss} whileTap={{ scale: 0.99 }}
              className={cx('flex flex-col items-start gap-1.5 rounded-xl border-2 border-dashed bg-primary p-2.5 text-left transition-colors hover:bg-primary_hover disabled:cursor-default', HEIGHT[l.id],
                miss && l.id === card.lane ? 'border-mint-600' : 'border-secondary')}>
              <span className="font-mono text-xs font-bold" style={{ color: c }}>{l.label} <span className="font-sans font-medium text-tertiary">· {l.hint}</span></span>
              <span className="flex flex-wrap gap-1.5">
                {here.map(x => <motion.span key={x.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop} className="rounded-md bg-secondary px-2 py-1 text-[11px] font-semibold text-secondary">{x.label}</motion.span>)}
              </span>
            </motion.button>
          );
        })}
      </div>
      <div className="min-h-14">{miss && <NibSays mood="sad">That belongs in <strong className="font-mono">{owner.label}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}</div>
    </div>
  );
}
