'use client';
// Mini-game for ui.6-3: critique the old Jaipur ops dashboard against Manoj's decision (where six crews go today).
// Every card is a tile (its `visual`, a key of `ROSHNI_TILES`) drawn by `TileGlyph`. Keep, fix, move or cut it
// (`TILE_VERDICTS`, scored by `tileVerdict`). Right calls rebuild the board below: kept tiles go on it, fixed ones go on
// redrawn (a trend and threshold, sorted bars), moved ones are sent to the board whose decision they serve, cut ones
// are struck off. The finished board fits the one-screen budget (`boardAfter`, `TILE_BUDGET`). First call scores; a
// missed card comes back later.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ROSHNI_TILES, TILE_BUDGET, tileVerdict, type DashTile, type Episode, type RoshniTile, type TileVerdict } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { TILE_FIXED, TILE_SHORT, TileGlyph } from '../scenes/DecisionBoard';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const DESTINATION: Record<Exclude<DashTile['owner'], 'manoj' | null>, string> = { finance: 'Finance board', marketing: 'Customer app and investor update', growth: 'Growth board' };
const title = (k: RoshniTile, fixed: boolean) => (fixed ? TILE_FIXED[k] ?? ROSHNI_TILES[k].title : ROSHNI_TILES[k].title);

/** A small tile on the rebuilt board. */
function Mini({ k, fixed }: { k: RoshniTile; fixed: boolean }) {
  return (
    <motion.li layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
      className={cx('flex flex-col gap-1 rounded-lg bg-primary p-2 ring-1 ring-inset', k === 'under' ? 'col-span-2 ring-2 ring-brand' : 'ring-secondary')}>
      <span className="text-xs font-bold text-primary">{title(k, fixed)}{fixed && <span className="font-semibold text-tertiary"> · fixed</span>}</span>
      <svg viewBox="0 0 120 40" className="h-8 w-full" aria-hidden preserveAspectRatio="xMinYMid meet"><TileGlyph k={k} x={2} y={2} w={116} h={36} fixed={fixed} fs={16} /></svg>
    </motion.li>
  );
}

export function DashCritique({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RoshniTile[]>([]);
  const [miss, setMiss] = useState<TileVerdict | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const verdictOf = (k: RoshniTile) => tileVerdict(ROSHNI_TILES[k]);
  const on = placed.filter(k => ['keep', 'fix'].includes(verdictOf(k)));
  const moved = placed.filter(k => verdictOf(k) === 'move');
  const cut = placed.filter(k => verdictOf(k) === 'cut');

  const board = (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-primary">Manoj’s board</span>
        <span className="text-xs font-semibold text-tertiary tabular-nums">{on.length} of {TILE_BUDGET} tiles</span>
      </div>
      {on.length ? <ul className="grid grid-cols-2 gap-2">{[...on].sort((a, b) => Number(b === 'under') - Number(a === 'under')).map(k => <Mini key={k} k={k} fixed={verdictOf(k) === 'fix'} />)}</ul>
        : <p className="text-sm text-tertiary">Tiles you keep or fix land here.</p>}
      {moved.length > 0 && <p className="text-sm text-secondary"><span className="font-semibold text-primary">Sent on:</span> {moved.map(k => `${ROSHNI_TILES[k].title} → ${DESTINATION[ROSHNI_TILES[k].owner as keyof typeof DESTINATION]}`).join(' · ')}</p>}
      {cut.length > 0 && <p className="text-sm text-secondary"><span className="font-semibold text-primary">Cut:</span> <s>{cut.map(k => ROSHNI_TILES[k].title).join(', ')}</s></p>}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Board rebuilt" title={`${n} of ${game.cards.length} right first time`}>Eleven tiles became {on.length}, each one tied to where the crews go today.</StageTitle>
        {board}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Write the decision first. Move what serves someone else’s, cut what serves nobody’s, give every number a comparison, and put the answer top left.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RoshniTile;
  const lane = verdictOf(k);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId as TileVerdict); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const fixedNow = right && lane === 'fix';

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Tiles to judge</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : right && (lane === 'cut' || lane === 'move') ? { y: 0, opacity: 0.6 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold tracking-wide text-tertiary uppercase">{fixedNow ? 'After the fix' : 'On the old board'}</span>
          <p className="text-lg font-semibold text-primary">{card.label}</p>
        </div>
        <div className="rounded-xl bg-secondary p-3">
          <p className="mb-1 text-sm font-bold text-primary">{title(k, fixedNow)}</p>
          <AnimatePresence mode="wait">
            <motion.svg key={fixedNow ? 'fixed' : 'old'} viewBox="0 0 300 110" className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              role="img" aria-label={fixedNow ? `${TILE_SHORT[k]}, fixed` : TILE_SHORT[k]}>
              <TileGlyph k={k} x={4} y={4} w={292} h={102} fixed={fixedNow} fs={28} />
            </motion.svg>
          </AnimatePresence>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Verdict for this tile">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="text-md font-bold text-primary">{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not {miss}: this one is <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next tile' : 'See the new board'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Would this tile change where a crew goes today? If not, whose decision does it serve, if anyone’s? If so, can Manoj read the answer at a glance?</NibSays>}
      </div>
      {board}
    </div>
  );
}
