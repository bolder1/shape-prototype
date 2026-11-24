'use client';
// Mini-game for br.2-3: each card is a piece of Sukoon from the wild (its `visual`, a key of `SUKOON_USES`), drawn as
// a thumbnail. Drag it onto the section of the brand guide whose rule it breaks (`sectionBroken`), or tap the section. A
// right drop writes that rule (`GUIDE_RULES`) into the section as a do and don't pair: the piece fixed beside the piece
// as it was. A miss shakes, names the section and the card comes back later. First try scores. The end is the guide.
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { HandGrabbingIcon } from '@phosphor-icons/react/ssr';
import { GUIDE_RULES, SUKOON_USES, rulesBroken, type Episode, type GuideRule, type SukoonUse } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { UseArt } from '../scenes/BrandGuide';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const ruleOf = (k: SukoonUse): GuideRule => rulesBroken(SUKOON_USES[k])[0];

function Pair({ k }: { k: SukoonUse }) {
  return (
    <motion.li initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop} className="flex items-center gap-2 rounded-lg bg-secondary p-1.5">
      <span className="relative w-14 shrink-0 overflow-hidden rounded ring-2 ring-mint-600" style={{ aspectRatio: '1.6' }}><UseArt k={k} fixed /></span>
      <span className="relative w-14 shrink-0 overflow-hidden rounded opacity-70 ring-2 ring-error" style={{ aspectRatio: '1.6' }}><UseArt k={k} /></span>
      <span className="text-xs font-semibold text-secondary">{GUIDE_RULES[ruleOf(k)].rule}</span>
    </motion.li>
  );
}

export function GuideBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const zones = useRef<Record<string, HTMLButtonElement | null>>({});
  const card = deck[0];

  const send = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setPlaced(p => [...p, card.id]); setLast(card.id); setDeck(d => d.slice(1)); }
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

  const lastCard = game.cards.find(c => c.id === last);
  const guide = (
    <div className="grid w-full gap-2 sm:grid-cols-2">
      {game.lanes.map(l => {
        const here = game.cards.filter(c => placed.includes(c.id) && c.lane === l.id);
        return (
          <motion.button key={l.id} ref={el => { zones.current[l.id] = el; }} type="button" onClick={() => send(l.id)} disabled={miss || !card} whileTap={{ scale: 0.99 }}
            className={cx('flex min-h-28 flex-col items-start gap-2 rounded-xl border-2 border-dashed bg-primary p-3 text-left transition-colors enabled:hover:bg-primary_hover disabled:cursor-default',
              miss && card && l.id === card.lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="text-sm font-bold text-primary">{l.label} <span className="font-medium text-tertiary">· {l.hint}</span></span>
            <ul className="flex w-full flex-col gap-1.5">{here.map(c => <Pair key={c.id} k={c.visual as SukoonUse} />)}</ul>
          </motion.button>
        );
      })}
    </div>
  );

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    const rules = new Set(game.cards.map(c => ruleOf(c.visual as SukoonUse))).size;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Sukoon’s brand guide" title={`${right} of ${game.cards.length} filed first time`}>{`${rules} rules in four sections, each with a picture of right and wrong. That’s a guide a partner can use at 6 pm on a Friday.`}</StageTitle>
        {guide}
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Test your guide: give it to someone new with a real task, and write down every place they had to guess. Each guess is a missing rule or template.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">From the wild</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} drag={!miss} dragSnapToOrigin dragElastic={0.6} dragMomentum={false} onDragEnd={drop} whileDrag={{ scale: 1.04, rotate: -2, zIndex: 20 }}
        initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('relative mx-auto flex w-full max-w-md cursor-grab touch-none flex-col gap-3 rounded-2xl bg-primary p-3 shadow-lg ring-2 ring-inset active:cursor-grabbing', miss ? 'ring-error' : 'ring-secondary')}
        data-current-card aria-label={card.label}>
        <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '1.6' }}><UseArt k={card.visual as SukoonUse} /></div>
        <div className="flex items-start gap-2">
          <span className="flex-1 text-md font-semibold text-primary">{card.label}</span>
          <HandGrabbingIcon className="mt-0.5 size-5 shrink-0 text-quaternary" aria-hidden />
        </div>
      </motion.div>
      {guide}
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">That one breaks a <strong>{owner.label.toLowerCase()}</strong> rule. {card.note} It’ll come back round.</NibSays>}
        {!miss && lastCard && <NibSays mood="cheer">{lastCard.note}</NibSays>}
      </div>
    </div>
  );
}
