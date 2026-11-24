'use client';
// Mini-game for bz.3-2: play each buyer reading Parcha's redesigned pricing page. Every card is a buyer (its
// `visual`, a key of `PARCHA_BUYERS`); you tap the plan on the page that covers them for the least money (`planFor`).
// A pick lights the line that decides it (`fenceFor`, `FENCE_TEXT`) and, when it's right, the plan shows what they'll
// pay (`monthlyBill`) and the yearly price (`yearly`). A miss explains the fence and lets you pick again; the first
// pick scores. The end shows how the buyers spread across the plans.
import { useState } from 'react';
import { motion } from 'motion/react';
import { FENCE_TEXT, PARCHA_BUYERS, PARCHA_PLANS, PLAN_IDS, fenceFor, inr, monthlyBill, planFor, yearly, type Episode, type ParchaBuyer, type PlanId } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PLAN_TONE } from '../scenes/PricingPage';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function PlanPick({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [picks, setPicks] = useState<PlanId[]>([]);
  const card = game.cards[i];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Every clinic placed" title={`${n} of ${game.cards.length} found first time`}>
          When each buyer can place themselves from facts they know, doctors and clinics, the page does the selling and sales only talks to chains.
        </StageTitle>
        <div className="grid gap-2 sm:grid-cols-3">
          {PLAN_IDS.map(id => (
            <div key={id} className="flex flex-col gap-1 rounded-xl bg-secondary p-3">
              <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: PLAN_TONE[id] }} aria-hidden />{PARCHA_PLANS[id].name}</span>
              {game.cards.filter(c => c.lane === id).map(c => <span key={c.id} className="text-sm text-secondary">{PARCHA_BUYERS[c.visual as ParchaBuyer].name}</span>)}
            </div>
          ))}
        </div>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Test your own page the same way: hand five people a one-line description of a buyer and time how long they take to find the plan and the price.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const b = PARCHA_BUYERS[card.visual as ParchaBuyer];
  const right = planFor(b);
  const fence = fenceFor(b);
  const landed = picks.includes(right);
  const last = picks.at(-1);
  const pick = (id: PlanId) => {
    if (landed || picks.includes(id)) return;
    play(id === right ? 'correct' : 'wrong');
    if (!picks.length) setResults(r => ({ ...r, [card.id]: id === right }));
    setPicks(ps => [...ps, id]);
  };
  const next = () => { setPicks([]); setI(i + 1); };
  const bill = monthlyBill(right, b);

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-end"><span className="text-sm font-semibold text-tertiary tabular-nums">{i} / {game.cards.length}</span></div>
      <motion.div key={card.id} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springs.pop}
        className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-secondary p-4" data-current-card>
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-primary">{b.name}</span>
          <span className="text-sm font-medium text-tertiary">{b.place}</span>
        </div>
        <dl className="flex gap-4 text-sm">
          <div><dt className="text-tertiary">Doctors</dt><dd className="text-lg font-bold text-primary tabular-nums">{b.doctors}</dd></div>
          <div><dt className="text-tertiary">Clinics</dt><dd className="text-lg font-bold text-primary tabular-nums">{b.clinics}</dd></div>
          {'needs' in b && <div><dt className="text-tertiary">Needs</dt><dd className="text-lg font-bold text-primary">API</dd></div>}
        </dl>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Parcha’s plans">
        {PLAN_IDS.map(id => {
          const pl = PARCHA_PLANS[id];
          const picked = picks.includes(id);
          const ok = picked && id === right;
          return (
            <motion.button key={id} type="button" onClick={() => pick(id)} disabled={landed || picked} whileTap={{ scale: 0.98 }}
              animate={picked && !ok ? { x: [0, -8, 8, -4, 4, 0] } : undefined} transition={{ duration: 0.4 }}
              className={cx('relative flex flex-col gap-2 rounded-2xl border-2 bg-primary p-4 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                ok ? 'border-mint-600' : picked ? 'border-error opacity-70' : id === 'clinic' ? 'border-brand' : 'border-secondary')}>
              {id === 'clinic' && <span className="absolute -top-3 left-4 rounded-full bg-brand-solid px-2.5 py-0.5 text-xs font-bold text-white">Most clinics pick this</span>}
              <span className="h-1.5 w-8 rounded-full" style={{ background: PLAN_TONE[id] }} aria-hidden />
              <span className="text-lg font-bold text-primary">{pl.name}</span>
              <span className={cx('rounded-md text-sm font-medium', picked ? 'bg-secondary px-1.5 py-0.5 text-primary' : 'text-tertiary')}>{pl.forWho}</span>
              <span className="text-2xl font-bold text-primary tabular-nums">{pl.price === null ? 'Talk to us' : inr(pl.price)}</span>
              <span className="text-xs font-semibold text-tertiary">{pl.price === null ? 'Quoted, with an onboarding manager' : pl.unit}</span>
              {ok && (
                <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="rounded-lg bg-success-primary px-2 py-1.5 text-sm font-bold text-success-primary">
                  {bill === null ? 'Sales sends a quote' : `${inr(bill)} a month, or ${inr(yearly(bill).total)} a year`}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="min-h-14" aria-live="polite">
        {!picks.length && <NibSays mood="think">Read the line under each plan name first. Which one describes this clinic?</NibSays>}
        {last && last !== right && !landed && (
          <NibSays mood="sad">
            {PLAN_IDS.indexOf(last) < PLAN_IDS.indexOf(right) ? `${PARCHA_PLANS[last].name} doesn’t cover them. ` : `${PARCHA_PLANS[last].name} covers them, but they’d pay for more than they need. `}
            <strong>{FENCE_TEXT[fence]}.</strong> Try again.
          </NibSays>
        )}
        {landed && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer"><strong>{FENCE_TEXT[fence]}.</strong> {card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{i + 1 < game.cards.length ? 'Next clinic' : 'See the spread'}</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}
