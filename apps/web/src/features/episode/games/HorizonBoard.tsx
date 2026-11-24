'use client';
// Mini-game for st.2-2: each card is a bet on Galla's roadmap (its `visual`, a key of `GALLA_BETS`), named by the
// problem it takes on, with the feature first proposed for it, what the team knows and the bet it builds on (and where
// that one sits now). Drag it onto Now, Next, Later or Off the board, or tap a column. A right call drops it into the
// column, its border as sure as the column (`HORIZON_DASH`); a miss shakes, says why (`horizonFor`) and the card comes
// back later. First try scores. The end is the whole board, Now solid to Later faint, with the bin beside it.
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { HandGrabbingIcon } from '@phosphor-icons/react/ssr';
import { GALLA_BETS, HORIZONS, type Episode, type GallaBet, type Horizon } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { BET_NAME, EVIDENCE_NAME, HORIZON_FILL, HORIZON_NAME } from '../scenes/RoadmapHorizons';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const VISION = 'Shabnam knows to the rupee who owes her, and customers pay back before she has to ask.';
/** CSS border style per column: committed, shaped, fuzzy. */
const BORDER: Record<Horizon, string> = { now: 'solid', next: 'dashed', later: 'dotted', off: 'dotted' };

function Column({ h, cards, lane, onPick, refFn, disabled, glow, small }: {
  h: Horizon; cards: Card[]; lane?: Game['lanes'][number]; onPick?: () => void; refFn?: (el: HTMLButtonElement | null) => void; disabled?: boolean; glow?: boolean; small?: boolean;
}) {
  const body = (
    <>
      <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: HORIZON_FILL[h] }}>{HORIZON_NAME[h]}</span>
      {lane && !small && <span className="text-[11px] leading-tight text-tertiary">{lane.hint}</span>}
      <ul className="flex flex-col gap-1.5">
        {cards.map(c => (
          <motion.li key={c.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: h === 'later' || h === 'off' ? 0.75 : 1, y: 0 }} transition={springs.pop}
            className="rounded-lg border-2 bg-primary px-2 py-1.5 text-xs font-semibold text-primary" style={{ borderColor: HORIZON_FILL[h], borderStyle: BORDER[h] }}>
            {GALLA_BETS[c.visual as GallaBet].short}
          </motion.li>
        ))}
      </ul>
    </>
  );
  const cls = cx('flex min-h-28 flex-col items-stretch gap-1.5 rounded-2xl border-2 bg-secondary p-2 text-left transition', glow ? 'border-mint-600' : 'border-transparent');
  return onPick
    ? <motion.button ref={refFn} type="button" onClick={onPick} disabled={disabled} whileTap={{ scale: 0.98 }} className={cx(cls, 'hover:bg-secondary_hover disabled:cursor-default')} aria-label={`${HORIZON_NAME[h]}: ${lane?.hint ?? ''}`}>{body}</motion.button>
    : <div className={cls}>{body}</div>;
}

export function HorizonBoard({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const zones = useRef<Partial<Record<Horizon, HTMLButtonElement | null>>>({});
  const card = deck[0];
  const on = (h: Horizon) => game.cards.filter(c => c.lane === h && placed.includes(c.id));
  const last = placed.length ? game.cards.find(c => c.id === placed[placed.length - 1]) : undefined;

  const send = (h: Horizon) => {
    if (!card || miss) return;
    const ok = h === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setPlaced(p => [...p, card.id]); setDeck(d => d.slice(1)); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2600); }
  };
  const drop = (e: MouseEvent | TouchEvent | PointerEvent) => {
    const pt = 'changedTouches' in e ? e.changedTouches[0] : e;
    const hit = HORIZONS.find(h => {
      const r = zones.current[h]?.getBoundingClientRect();
      return r && pt.clientX >= r.left && pt.clientX <= r.right && pt.clientY >= r.top && pt.clientY <= r.bottom;
    });
    if (hit) send(hit);
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Galla’s roadmap" title={`${right} of ${game.cards.length} bets placed first time`}>
          No dates, no feature names: problems, sorted by how sure the team is. Two left the board on purpose.
        </StageTitle>
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
          {HORIZONS.map(h => <Column key={h} h={h} cards={on(h)} lane={game.lanes.find(l => l.id === h)} small />)}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Evidence moves a bet left; what it builds on can hold it back. Share this board with sales and they can tell a customer what’s coming without promising a date the team can’t keep.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const bet = GALLA_BETS[card.visual as GallaBet];
  const parent = 'after' in bet ? bet.after : undefined;
  const parentAt = parent ? HORIZONS.find(h => on(h).some(c => c.visual === parent)) : undefined;
  const owner = game.lanes.find(l => l.id === card.lane)!;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <p className="rounded-xl bg-secondary px-4 py-2 text-sm text-secondary"><span className="font-semibold text-primary">The vision:</span> {VISION}</p>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The bet</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} drag={!miss} dragSnapToOrigin dragElastic={0.6} dragMomentum={false} onDragEnd={drop} whileDrag={{ scale: 1.04, rotate: -2, zIndex: 20 }}
        initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('relative mx-auto flex w-full max-w-lg cursor-grab touch-none flex-col gap-2 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset active:cursor-grabbing', miss ? 'ring-error' : 'ring-secondary')}
        data-current-card>
        <div className="flex items-start gap-3">
          <span className="flex-1 text-lg font-semibold text-primary">{card.label}</span>
          <HandGrabbingIcon className="size-5 shrink-0 text-quaternary" aria-hidden />
        </div>
        <span className="text-sm text-tertiary">First proposed as: {bet.idea}</span>
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary">{EVIDENCE_NAME[bet.evidence]}</span>
          {parent && <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary">Builds on {BET_NAME[parent]}{parentAt ? `, in ${HORIZON_NAME[parentAt]}` : ''}</span>}
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {HORIZONS.map(h => (
          <Column key={h} h={h} cards={on(h)} lane={game.lanes.find(l => l.id === h)} onPick={() => send(h)} disabled={miss}
            refFn={el => { zones.current[h] = el; }} glow={miss && h === card.lane} />
        ))}
      </div>
      <div className="min-h-14">
        {miss
          ? <NibSays mood="sad">It belongs in <strong>{owner.label}</strong>. {card.note} It’ll come back round.</NibSays>
          : last && <NibSays mood="cheer"><strong>{GALLA_BETS[last.visual as GallaBet].short}:</strong> {last.note}</NibSays>}
      </div>
    </div>
  );
}
