'use client';
// Mini-game for st.4-2: place Munim's design bets. Every card is a bet (its `visual`, a key of `MUNIM_BETS`), shown
// with its cost, its payoff if it works and a cautious and a hopeful chance, all in lakh rupees. Fund it, probe it or
// kill it (`BET_CALLS`, scored by `betCall` from `betRange`). Every call then draws the expected-value range against
// ₹0; right calls fill the ₹3 crore budget by horizon (`betSpend`, `portfolioMix`). First call scores; a missed card
// comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { BET_HORIZONS, BET_HORIZON_LABEL, BET_MIX_GUIDE, MUNIM_BETS, MUNIM_BUDGET, betCall, betRange, betSpend, portfolioMix, type BetCall, type Episode, type MunimBet } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { BET_FILL, HORIZON_FILL, rupees } from '../scenes/BetPortfolio';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const LO = -60, HI = 120;
const pos = (v: number) => `${((Math.max(LO, Math.min(HI, v)) - LO) / (HI - LO)) * 100}%`;

/** Why a wrong call is wrong, from the bet's own numbers. */
function whyNot(k: MunimBet) {
  const b = MUNIM_BETS[k];
  const [lo, hi] = betRange(b);
  switch (betCall(b)) {
    case 'fund': return `Even at ${Math.round(b.chance[0] * 100)}% it’s worth ${rupees(lo)}. It pays on the cautious chance.`;
    case 'kill': return `Even at ${Math.round(b.chance[1] * 100)}% it’s worth ${rupees(hi)}. It loses on the hopeful chance.`;
    case 'probe': return `From ${rupees(lo)} to ${rupees(hi)}: the range crosses zero, so test before you build.`;
  }
}

/** The expected-value range of a bet on a line from −₹60 lakh to ₹1.2 crore, with ₹0 marked. */
function Range({ k }: { k: MunimBet }) {
  const b = MUNIM_BETS[k];
  const [lo, hi] = betRange(b);
  const call = betCall(b);
  return (
    <div className="flex flex-col gap-1">
      <div className="relative h-6 rounded-full bg-secondary" aria-hidden>
        <span className="absolute inset-y-0 w-0.5 bg-fg-primary" style={{ left: pos(0) }} />
        <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={springs.pop} className="absolute inset-y-1 origin-left rounded-full"
          style={{ left: pos(lo), width: `calc(${pos(hi)} - ${pos(lo)})`, minWidth: 6, background: BET_FILL[call] }} />
      </div>
      <span className="text-sm font-semibold text-primary">Worth {rupees(lo)} to {rupees(hi)} <span className="text-tertiary">(₹0 marked)</span></span>
    </div>
  );
}

export function BetBook({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<MunimBet[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const bets = placed.map(k => MUNIM_BETS[k]);
  const spent = bets.reduce((s, b) => s + betSpend(b), 0);
  const mix = portfolioMix(bets);
  const killed = placed.filter(k => betCall(MUNIM_BETS[k]) === 'kill');
  const budget = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-primary">Design budget</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{rupees(spent)} of {rupees(MUNIM_BUDGET)}</span>
      </div>
      <div className="flex h-6 overflow-hidden rounded-full bg-primary" aria-hidden>
        {BET_HORIZONS.map(h => (
          <motion.span key={h} animate={{ width: `${(mix[h] * spent / MUNIM_BUDGET) * 100}%` }} transition={springs.pop} style={{ background: HORIZON_FILL[h] }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {BET_HORIZONS.map(h => (
          <span key={h} className="flex items-center gap-1.5 text-xs font-bold text-secondary">
            <span className="size-2.5 rounded-sm" style={{ background: HORIZON_FILL[h] }} aria-hidden />
            {BET_HORIZON_LABEL[h]} {spent ? Math.round(mix[h] * 100) : 0}% <span className="font-medium text-tertiary">(guide {Math.round(BET_MIX_GUIDE[h] * 100)}%)</span>
          </span>
        ))}
      </div>
      {killed.length > 0 && <span className="text-xs font-semibold text-tertiary">Killed: {killed.map(k => MUNIM_BETS[k].short).join(', ')}</span>}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Bets placed" title={`${n} of ${game.cards.length} right first time`}>
          {`${rupees(spent)} committed, close to 70/20/10, and ${rupees(MUNIM_BUDGET - spent)} held back to build the probes that pass.`}
        </StageTitle>
        {budget}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Fund what pays when you’re cautious. Kill what loses when you’re hopeful. Test everything in between.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as MunimBet;
  const b = MUNIM_BETS[k];
  const lane = betCall(b);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ lane: laneId, why: whyNot(k) });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4600);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const facts: [string, string][] = [['Cost', rupees(b.cost)], ['Worth if it works', rupees(b.payoff)], ['Chance', `${Math.round(b.chance[0] * 100)}–${Math.round(b.chance[1] * 100)}%`]];

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Next year’s design bets</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-tertiary uppercase">
          <span className="size-2.5 rounded-sm" style={{ background: HORIZON_FILL[b.horizon] }} aria-hidden />{BET_HORIZON_LABEL[b.horizon]} bet
        </span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <dl className="grid grid-cols-3 gap-1.5">
          {facts.map(([a, v]) => (
            <div key={a} className="flex flex-col gap-0.5 rounded-lg bg-secondary px-2.5 py-2">
              <dt className="text-xs font-bold text-tertiary">{a}</dt>
              <dd className="text-sm font-bold text-primary tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        {(right || miss) && <Range k={k} />}
        {right && b.probe && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${BET_FILL.probe}` }}>
            Probe: {b.probe}, for {rupees(b.probeCost ?? 0)}.
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="What to do with this bet">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: BET_FILL[l.id as BetCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next bet' : 'See the budget'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Chance × worth − cost, once with the low chance and once with the high. Both above zero? Both below? Or one of each?</NibSays>}
      </div>
      {budget}
    </div>
  );
}
