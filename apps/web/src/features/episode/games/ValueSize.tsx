'use client';
// Mini-game for bz.4-1: size a design impact. Every card is something Aparna's team claims (its `visual`, a key of
// `RAAHI_IMPACTS`), with the evidence it rests on. Call it under ₹10 lakh, ₹10 lakh to ₹1 crore, over ₹1 crore, or
// can't count it yet (`IMPACT_BANDS`, scored by `impactBand`): no control or no money link first, then volume ×
// change × ₹ each × share realised (`impactValue`) against `BAND_EDGES`. Right calls add the claim to an impact
// ledger with its worked sum; signals are listed apart. First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { RAAHI_IMPACTS, impactBand, impactValue, inrScale, type Episode, type ImpactBand, type ImpactClaim, type RaahiImpact } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { BAND_FILL } from '../scenes/ImpactChain';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const num = (v: number) => v.toLocaleString('en-IN', { maximumFractionDigits: 3 });

/** The claim's sum, written out: 60,00,000 × 0.03 × ₹60 = ₹1.08 crore. */
function sum(c: ImpactClaim) {
  const parts = [num(c.volume), num(c.change), `₹${num(c.unitValue)}`];
  if (c.realise !== 1) parts.push(`${Math.round(c.realise * 100)}%`);
  return `${parts.join(' × ')} = ${inrScale(impactValue(c))}`;
}

/** Why a wrong call is wrong, from the claim itself. */
function whyNot(k: RaahiImpact) {
  const c = RAAHI_IMPACTS[k];
  if (!c.money) return 'There is no rupee value per unit here: it is a signal, not money.';
  if (!c.controlled) return `Check the evidence first: “${c.source}” has no comparison, so you can’t tell what design did.`;
  return `${sum(c)} a year.`;
}

export function ValueSize({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RaahiImpact[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const counted = placed.filter(k => impactBand(RAAHI_IMPACTS[k]) !== 'unproven');
  const signals = placed.filter(k => impactBand(RAAHI_IMPACTS[k]) === 'unproven');
  const total = counted.reduce((s, k) => s + impactValue(RAAHI_IMPACTS[k]), 0);
  const ledger = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-primary">Impact ledger, a year</span>
        <span className="text-md font-bold text-primary tabular-nums">{inrScale(total)}</span>
      </div>
      {counted.length === 0 && <span className="text-sm text-tertiary">Counted impacts land here, biggest first.</span>}
      {counted.length > 0 && (
        <ol className="flex flex-col gap-1 text-sm">
          {[...counted].sort((a, b) => impactValue(RAAHI_IMPACTS[b]) - impactValue(RAAHI_IMPACTS[a])).map(k => {
            const c = RAAHI_IMPACTS[k], v = impactValue(c);
            return (
              <li key={k} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5 font-semibold text-secondary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: BAND_FILL[impactBand(c)] }} aria-hidden />{c.short}</span>
                  <span className="shrink-0 font-bold text-primary tabular-nums">{inrScale(v)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-primary" aria-hidden>
                  <div className="h-full rounded-full" style={{ width: `${Math.max(2, (v / 12_000_000) * 100)}%`, background: BAND_FILL[impactBand(c)] }} />
                </div>
              </li>
            );
          })}
        </ol>
      )}
      {signals.length > 0 && (
        <div className="flex flex-col gap-1 rounded-lg border-2 border-dashed border-secondary p-2">
          <span className="text-xs font-bold text-tertiary">Signals, not in the total</span>
          {signals.map(k => <span key={k} className="text-sm font-semibold text-secondary">{RAAHI_IMPACTS[k].short}</span>)}
        </div>
      )}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Impact sized" title={`${n} of ${game.cards.length} right first time`}>
          {counted.length} claims Sameer can count, worth {inrScale(total)} a year at what Raahi keeps or saves. {signals.length} signals stay on the dashboard.
        </StageTitle>
        {ledger}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Volume × change against a control × what each is worth. Then keep the signals apart.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RaahiImpact;
  const c = RAAHI_IMPACTS[k];
  const lane = impactBand(c);
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

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Design review · impact claims</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="flex flex-col gap-0.5 rounded-lg bg-secondary px-3 py-2">
          <span className="text-xs font-bold text-tertiary">Evidence</span>
          <span className="text-sm font-semibold text-primary">{c.source}</span>
        </div>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary tabular-nums" style={{ boxShadow: `inset 3px 0 0 ${BAND_FILL[lane]}` }}>
            {lane === 'unproven' ? 'Kept as a signal, outside the total.' : `${sum(c)} a year.`}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What this claim is worth a year">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: BAND_FILL[l.id as ImpactBand] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next claim' : 'See the ledger'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Is there a control, and a rupee value per unit? Then: volume × change × ₹ each × the share that becomes money.</NibSays>}
      </div>
      {ledger}
    </div>
  );
}
