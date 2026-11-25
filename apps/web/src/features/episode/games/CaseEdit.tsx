'use client';
// Mini-game for bz.4-2: edit a business case. Every card is a line of Aparna's draft (its `visual`, a key of
// `RAAHI_CASE`), shown with the section it sits in. Call what it needs (`CASE_FIXES`, scored by `caseFix`): a benefit
// must be money, then honest; a cost must be complete; the rest is ready. Right calls write the line's `fixed`
// version into the case under its section, with the draft struck through above it when it changed. The finished
// case ends with year-one returns in three cases (`caseReturns`). First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { RAAHI_CASE, SCENARIOS, TRIP_COST, TRIP_DRIVERS, caseFix, caseReturns, inrScale, scenarioBenefit, type CaseFix, type CaseLine, type Episode, type RaahiCaseLine } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FIX_FILL, SCENARIO_LABEL } from '../scenes/CaseShape';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const PART_LABEL: Record<CaseLine['part'], string> = { ask: 'The ask', benefit: 'Benefits', cost: 'Costs and returns' };
const PARTS = ['ask', 'benefit', 'cost'] as const;

/** Why a wrong call is wrong, from the line itself. */
function whyNot(k: RaahiCaseLine) {
  const l = RAAHI_CASE[k];
  if (l.part === 'benefit') {
    if (!l.money) return 'This benefit isn’t money or a business result yet; that comes before anything else.';
    if (!l.honest) return 'It is in money, but it is one confident number or takes credit design didn’t earn.';
    return 'Money, a basis and a range: this benefit is ready.';
  }
  if (l.part === 'cost') return l.complete ? 'Building, running and what waits are all here: ready.' : 'Something is left out: running costs, the people, or what waits.';
  return 'How much, for what, from whom: the ask is ready as it is.';
}

export function CaseEdit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RaahiCaseLine[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const finished = !card;

  const doc = (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Business case · trip screens</span>
      {PARTS.map(part => {
        const lines = placed.filter(k => RAAHI_CASE[k].part === part);
        return (
          <section key={part} className="flex flex-col gap-1.5">
            <h3 className="text-xs font-bold tracking-wide text-tertiary uppercase">{PART_LABEL[part]}</h3>
            {lines.length === 0 && <span className="text-sm text-quaternary">Nothing here yet.</span>}
            {lines.map(k => {
              const l = RAAHI_CASE[k], fix = caseFix(l);
              return (
                <div key={k} className="rounded-lg bg-primary px-3 py-2 text-sm" style={{ boxShadow: `inset 3px 0 0 ${FIX_FILL[fix]}` }}>
                  {fix !== 'keep' && <p className="text-tertiary line-through">{l.text}</p>}
                  <p className="font-semibold text-primary">{l.fixed}</p>
                </div>
              );
            })}
          </section>
        );
      })}
      {finished && (
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xs font-bold tracking-wide text-tertiary uppercase">Year one, three cases</h3>
          <table className="w-full text-left text-sm tabular-nums">
            <thead>
              <tr className="text-xs text-tertiary"><th className="py-1 font-bold">Case</th><th className="py-1 font-bold">Benefit</th><th className="py-1 font-bold">ROI</th><th className="py-1 font-bold">Payback</th></tr>
            </thead>
            <tbody>
              {SCENARIOS.map(s => {
                const b = scenarioBenefit(TRIP_DRIVERS, s), r = caseReturns(b, TRIP_COST);
                return (
                  <tr key={s} className="border-t border-secondary">
                    <td className="py-1.5 font-semibold text-secondary">{SCENARIO_LABEL[s]}</td>
                    <td className="py-1.5 font-semibold text-primary">{inrScale(b)}</td>
                    <td className={cx('py-1.5 font-bold', r.roi < 0 ? 'text-error-primary' : 'text-success-primary')}>{r.roi}%</td>
                    <td className="py-1.5 font-semibold text-primary">{r.payback === null ? 'Never' : `${r.payback} mo`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <span className="text-xs text-tertiary">Cost {inrScale(TRIP_COST.build)} to build + {inrScale(TRIP_COST.runYear)} a year to run.</span>
        </div>
      )}
    </div>
  );

  if (finished) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Case rewritten" title={`${n} of ${game.cards.length} right first time`}>
          Every benefit is in money with a range, every cost is counted, and the low case is on the page. That is the case Sameer can approve.
        </StageTitle>
        {doc}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Money first, then honest about it, then every cost. The low case is what makes the base believable.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RaahiCaseLine;
  const l = RAAHI_CASE[k];
  const lane = caseFix(l);
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
        <span className="text-sm font-semibold text-tertiary">Draft · {PART_LABEL[l.part]}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className={cx('text-lg font-semibold', right && lane !== 'keep' ? 'text-tertiary line-through' : 'text-primary')}>{card.label}</p>
        {right && lane !== 'keep' && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-md font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${FIX_FILL[lane]}` }}>
            {l.fixed}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What this line needs">
        {game.lanes.map(ln => (
          <motion.button key={ln.id} type="button" onClick={() => call(ln.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && ln.id === lane ? 'border-mint-600' : miss?.lane === ln.id ? 'border-error' : miss && ln.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: FIX_FILL[ln.id as CaseFix] }} aria-hidden />{ln.label}</span>
            <span className="text-xs font-medium text-tertiary">{ln.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next line' : 'See the case'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Is a benefit in money? Then is it honest: a range, and only the credit design earned? Is every cost counted?</NibSays>}
      </div>
      {doc}
    </div>
  );
}
