'use client';
// Mini-game for st.4-3: decide what Munim builds once. Every card is a capability (its `visual`, a key of
// `MUNIM_CAPABILITIES`), shown with the products that need it, whether it has settled and whether a vendor already
// does it well. Pick platform, harvest later, in the product or buy (`PLATFORM_CALLS`, scored by `platformCall`).
// Right calls build the product map: the shared layer under Books, Pay and Stock, chips in each product's column
// (dashed for harvest), and a vendor shelf. First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { MUNIM_CAPABILITIES, MUNIM_PRODUCTS, MUNIM_PRODUCT_LABEL, RULE_OF_THREE, platformCall, type Episode, type MunimCapability, type MunimProduct, type PlatformCall } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CAP_SHORT, LAYER_FILL } from '../scenes/PlatformLayers';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const needs = (k: MunimCapability) => MUNIM_CAPABILITIES[k].products as readonly MunimProduct[];

/** Why a wrong call is wrong, from the capability itself. */
function whyNot(k: MunimCapability) {
  const c = MUNIM_CAPABILITIES[k];
  const n = c.products.length;
  switch (platformCall(c)) {
    case 'buy': return 'A vendor or the phone already does this well, and it isn’t why anyone chooses Munim.';
    case 'platform': return `All ${n} products need it and it has settled: build it once.`;
    case 'harvest': return n < RULE_OF_THREE ? `Only ${n} products need it so far: share the one that exists, and extract it when it settles.` : 'All three need it, but it’s still changing. Sharing it now would freeze a guess.';
    case 'product': return `Only ${MUNIM_PRODUCT_LABEL[c.products[0] as MunimProduct]} needs it. Keep it there.`;
  }
}

function Chip({ k, call }: { k: MunimCapability; call: PlatformCall }) {
  const dashed = call === 'harvest';
  return (
    <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
      className={cx('rounded-full px-2 py-0.5 text-xs font-bold', dashed ? 'border-2 border-dashed bg-primary text-primary' : 'text-white')}
      style={dashed ? { borderColor: LAYER_FILL.harvest } : { background: LAYER_FILL[call] }}>{CAP_SHORT[k]}</motion.span>
  );
}

export function LayerPick({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<MunimCapability[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const where = (c: PlatformCall) => placed.filter(k => platformCall(MUNIM_CAPABILITIES[k]) === c);
  const map = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Munim’s product map</span>
      <div className="grid grid-cols-3 gap-1.5">
        {MUNIM_PRODUCTS.map(pr => {
          const here = placed.filter(k => { const c = platformCall(MUNIM_CAPABILITIES[k]); return (c === 'product' || c === 'harvest') && needs(k).includes(pr); });
          return (
            <div key={pr} className="flex min-h-20 flex-col gap-1 rounded-lg bg-primary p-1.5">
              <span className="text-xs font-bold text-secondary">{MUNIM_PRODUCT_LABEL[pr]}</span>
              <span className="flex flex-wrap gap-1">{here.map(k => <Chip key={k} k={k} call={platformCall(MUNIM_CAPABILITIES[k])} />)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex min-h-11 flex-col gap-1 rounded-lg bg-primary p-1.5" style={{ boxShadow: `inset 0 0 0 2px ${LAYER_FILL.platform}` }}>
        <span className="text-xs font-bold text-secondary">Shared platform</span>
        <span className="flex flex-wrap gap-1">{where('platform').map(k => <Chip key={k} k={k} call="platform" />)}</span>
      </div>
      <div className="flex min-h-11 flex-col gap-1 rounded-lg bg-primary p-1.5">
        <span className="text-xs font-bold text-secondary">Bought from vendors</span>
        <span className="flex flex-wrap gap-1">{where('buy').map(k => <Chip key={k} k={k} call="buy" />)}</span>
      </div>
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Map built" title={`${n} of ${game.cards.length} right first time`}>
          Built once what three products need and has settled. Let the rest prove itself in the products, and bought what others do better.
        </StageTitle>
        {map}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>One sign-in, one GST invoice, one set of form controls. Ganpat signs in once.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as MunimCapability;
  const c = MUNIM_CAPABILITIES[k];
  const lane = platformCall(c);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ lane: laneId, why: whyNot(k) });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const facts: [string, string][] = [
    ['Settled?', c.settled ? 'Yes, well understood' : 'No, still changing'],
    ['Done well elsewhere?', c.commodity ? 'Yes, vendors do it' : 'No'],
  ];

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Munim Books · Pay · Stock</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Capability{c.differentiating ? ' · why customers choose Munim' : ''}</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold text-secondary">Needed by:</span>
          {MUNIM_PRODUCTS.map(pr => (
            <span key={pr} className={cx('rounded-full px-2.5 py-0.5 text-xs font-bold', needs(k).includes(pr) ? 'bg-brand-solid text-white' : 'bg-secondary text-quaternary line-through')}>{MUNIM_PRODUCT_LABEL[pr]}</span>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-1.5">
          {facts.map(([a, v]) => (
            <div key={a} className="flex flex-col gap-0.5 rounded-lg bg-secondary px-2.5 py-2">
              <dt className="text-xs font-bold text-tertiary">{a}</dt>
              <dd className="text-sm font-bold text-primary">{v}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Where to build it">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: LAYER_FILL[l.id as PlatformCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next capability' : 'See the map'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Done well elsewhere and not why we win? Buy. Three products and settled? Platform. Shared but not ready? Harvest. One product? Keep it there.</NibSays>}
      </div>
      {map}
    </div>
  );
}
