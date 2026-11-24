'use client';
// Mini-game for br.3-1: each card is a piece of Sukoon's launch page (its `visual`, a key of `SUKOON_SECTIONS`). Drag
// it onto the part of the page whose visitor question it answers, or tap the part. A right drop stacks it on the phone
// beside, in `pageOrder`, with the share of visitors who scroll far enough to see it (`pageLayout`) and the fold drawn
// at `FOLD_PX`. A miss shakes, names the right part and the card comes back later. First try scores. The end is the
// whole page, with how many visitors see a button.
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { HandGrabbingIcon } from '@phosphor-icons/react/ssr';
import { SUKOON_SECTIONS, ctaReach, pageOrder, type Episode, type PageZone, type SukoonSection } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PageStrip, ZONE_FILL } from '../scenes/LandingAnatomy';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Phone({ keys }: { keys: SukoonSection[] }) {
  const blocks = pageOrder(keys).map(k => SUKOON_SECTIONS[k]);
  return (
    <div className="mx-auto w-full max-w-[17rem] rounded-[2rem] bg-primary p-2 ring-2 ring-secondary">
      <svg viewBox="-34 -6 300 432" className="w-full" role="img" aria-label={`Sukoon’s launch page so far: ${blocks.map(b => b.text).join('; ') || 'empty'}.`}>
        <PageStrip blocks={blocks} x={0} y={0} w={210} scale={0.14} />
      </svg>
    </div>
  );
}

export function PageStack({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<SukoonSection[]>([]);
  const [miss, setMiss] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const zones = useRef<Record<string, HTMLButtonElement | null>>({});
  const card = deck[0];

  const send = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setPlaced(p => [...p, card.visual as SukoonSection]); setLast(card.id); setDeck(d => d.slice(1)); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2600); }
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
    const blocks = pageOrder(placed).map(k => SUKOON_SECTIONS[k]);
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Sukoon’s launch page" title={`${right} of ${game.cards.length} placed first time`}>
          {`Four questions, answered in the order visitors ask them. ${Math.round(ctaReach(blocks) * 100)}% of visitors see a button, on the very first screen.`}
        </StageTitle>
        <Phone keys={placed} />
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>After launch, check a scroll map: where attention stops tells you which section to cut or move up.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  const lastCard = game.cards.find(c => c.id === last);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-4 sm:grid-cols-[1fr_15rem]">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">Next piece</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} drag={!miss} dragSnapToOrigin dragElastic={0.6} dragMomentum={false} onDragEnd={drop} whileDrag={{ scale: 1.04, rotate: -2, zIndex: 20 }}
            initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('relative flex cursor-grab touch-none items-start gap-2 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset active:cursor-grabbing', miss ? 'ring-error' : 'ring-secondary')}
            data-current-card aria-label={card.label}>
            <span className="flex-1 text-md font-semibold text-primary">{card.label}</span>
            <HandGrabbingIcon className="mt-0.5 size-5 shrink-0 text-quaternary" aria-hidden />
          </motion.div>
          <div className="grid grid-cols-2 gap-2">
            {game.lanes.map(l => (
              <motion.button key={l.id} ref={el => { zones.current[l.id] = el; }} type="button" onClick={() => send(l.id)} disabled={miss} whileTap={{ scale: 0.98 }}
                className={cx('flex min-h-20 flex-col items-start gap-1 rounded-xl border-2 border-dashed p-3 text-left transition-colors disabled:cursor-default', miss && l.id === card.lane ? 'border-mint-600' : 'border-secondary')}
                style={{ background: ZONE_FILL[l.id as PageZone], color: '#1F2A2E' }}>
                <span className="text-sm font-bold">{l.label}</span>
                <span className="text-xs font-medium">{l.hint}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <Phone keys={placed} />
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">That piece answers <strong>{owner.hint.toLowerCase()}</strong> {card.note} It’ll come back round.</NibSays>}
        {!miss && lastCard && <NibSays mood="cheer">{lastCard.note}</NibSays>}
      </div>
    </div>
  );
}
