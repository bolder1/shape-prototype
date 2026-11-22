'use client';
// Mini-game for ld.2-1: a case study page with four empty sections (context, process, solution, outcome). Drag each
// snippet into its section, or tap the section. Right answers fill the page in order; a miss explains and the snippet
// comes back later. First try scores.
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { HandGrabbingIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { SECTIONS } from '../scenes/CaseStudy';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function CaseOrder({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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

  const page = (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-2 rounded-2xl bg-primary p-4 text-left ring-1 ring-secondary ring-inset">
      <p className="text-md font-bold text-primary">Cutting payment drop-off for a ride app</p>
      <p className="text-xs font-semibold text-tertiary">Solo designer · 6 weeks · drop-off 38% → 21%</p>
      {game.lanes.map(l => {
        const here = game.cards.filter(c => placed.includes(c.id) && c.lane === l.id), c = SECTIONS.find(s => s.id === l.id)?.c;
        return (
          <motion.button key={l.id} ref={el => { zones.current[l.id] = el; }} type="button" onClick={() => send(l.id)} disabled={miss || !card} whileTap={card ? { scale: 0.99 } : undefined}
            className={cx('flex min-h-16 flex-col items-start gap-1 rounded-xl border-l-4 bg-secondary p-2.5 text-left transition-colors disabled:cursor-default', card && 'hover:bg-primary_hover', miss && l.id === card?.lane && 'ring-2 ring-mint-600')}
            style={{ borderLeftColor: c }}>
            <span className="text-xs font-bold" style={{ color: c }}>{l.label} <span className="font-medium text-tertiary">· {l.hint}</span></span>
            {here.map(x => <motion.span key={x.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="text-sm text-primary">{x.label}</motion.span>)}
          </motion.button>
        );
      })}
    </div>
  );

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Case study assembled" title={`${right} of ${game.cards.length} snippets placed first time`}>A story a reviewer can skim in 40 seconds.</StageTitle>
        {page}
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Read it top to bottom: problem, how you found the answer, what you built, what changed. That’s the whole pitch.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The snippet</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} drag={!miss} dragSnapToOrigin dragElastic={0.6} dragMomentum={false} onDragEnd={drop} whileDrag={{ scale: 1.05, rotate: -2, zIndex: 20 }}
        initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('relative mx-auto flex w-full max-w-xl cursor-grab touch-none items-center gap-3 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset active:cursor-grabbing', miss ? 'ring-error' : 'ring-secondary')}
        data-current-card>
        <span className="flex-1 text-md font-semibold text-primary">{card.label}</span>
        <HandGrabbingIcon className="size-5 shrink-0 text-quaternary" aria-hidden />
      </motion.div>
      {page}
      <div className="min-h-14">{miss && <NibSays mood="sad">That belongs in <strong>{owner.label}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}</div>
    </div>
  );
}
