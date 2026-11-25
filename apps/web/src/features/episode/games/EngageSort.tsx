'use client';
// Mini-game for bz.4-3: take the work the right way. Every card is an enquiry to Kolam (its `visual`, a key of
// `KOLAM_ENQUIRIES`): the client, the fee and the days, and its day rate on a gauge against Kolam's floor
// (`floorRate`) and target (`targetRate`). Call it a fixed fee, a retainer, time and materials, or decline
// (`ENGAGE_CALLS`, scored by `engageCall`). Right calls fill Kolam's quarter by contract (retainers count three
// months), with booked days against the quarter's billable days. First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { KOLAM, KOLAM_ENQUIRIES, billableDays, effectiveRate, engageCall, floorRate, inr, inrScale, targetRate, type EngageCall, type Enquiry, type Episode, type KolamEnquiry } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ENGAGE_FILL } from '../scenes/StudioRate';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const FLOOR = floorRate(KOLAM), TARGET = targetRate(KOLAM), QUARTER = Math.round(billableDays(KOLAM) / 4);
const GAUGE_MAX = 25_000;
const CONTRACTS = ['fixed', 'retainer', 'time'] as const;
const CONTRACT_LABEL: Record<EngageCall, string> = { fixed: 'Fixed fee', retainer: 'Retainer', time: 'Time & materials', decline: 'Declined' };

/** What the enquiry pays and takes, as the card shows it. */
const feeText = (e: Enquiry) => (e.fee === 0 ? (e.spec ? 'Unpaid' : 'No cash fee') : e.ongoing ? `${inr(e.fee)} a month` : inr(e.fee));
const daysText = (e: Enquiry) => (e.ongoing ? `${e.days} days a month` : `${e.days} days`);
/** Fees and days the work brings in this quarter: three months of a retainer. */
const quarterOf = (e: Enquiry) => (e.ongoing ? { fee: e.fee * 3, days: e.days * 3 } : { fee: e.fee, days: e.days });

/** Why a wrong call is wrong, from the enquiry itself. */
function whyNot(k: KolamEnquiry) {
  const e = KOLAM_ENQUIRIES[k], r = effectiveRate(e);
  if (e.spec) return 'Unpaid work to win work is spec work, whatever the client’s name.';
  if (r < FLOOR) return `${r ? `${inr(r)} a day` : 'No cash'} is under Kolam’s ${inr(FLOOR)} floor.`;
  if (e.ongoing) return `${inr(r)} a day is fine, and it is a steady monthly stream, not a project.`;
  return e.clear ? `${inr(r)} a day, and the scope is clear and agreed: a one-off Kolam can price.` : `${inr(r)} a day is fine, but nobody can say yet what the work is.`;
}

function Gauge({ rate }: { rate: number }) {
  const x = (v: number) => `${(Math.min(v, GAUGE_MAX) / GAUGE_MAX) * 100}%`;
  return (
    <div className="flex flex-col gap-1">
      <div className="relative h-3 rounded-full bg-secondary" aria-hidden>
        <div className="absolute inset-y-0 left-0 rounded-full bg-error-solid opacity-25" style={{ width: x(FLOOR) }} />
        <div className="absolute -inset-y-1 w-0.5 bg-error-solid" style={{ left: x(FLOOR) }} />
        <div className="absolute -inset-y-1 w-0.5 bg-success-solid" style={{ left: x(TARGET) }} />
        <div className={cx('absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-bg-primary', rate < FLOOR ? 'bg-error-solid' : 'bg-fg-primary')} style={{ left: x(rate) }} />
      </div>
      <div className="flex justify-between text-xs font-semibold text-tertiary tabular-nums">
        <span>Floor {inr(FLOOR)}</span>
        <span>Target {inr(TARGET)}</span>
      </div>
    </div>
  );
}

export function EngageSort({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<KolamEnquiry[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const taken = placed.filter(k => engageCall(KOLAM_ENQUIRIES[k]) !== 'decline');
  const declined = placed.filter(k => engageCall(KOLAM_ENQUIRIES[k]) === 'decline');
  const booked = taken.reduce((s, k) => s + quarterOf(KOLAM_ENQUIRIES[k]).days, 0);
  const fees = taken.reduce((s, k) => s + quarterOf(KOLAM_ENQUIRIES[k]).fee, 0);
  const board = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-primary">Kolam’s quarter</span>
        <span className="text-sm font-bold text-primary tabular-nums">{inrScale(fees)} · {booked} / {QUARTER} days</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-primary" aria-hidden>
        <div className={cx('h-full rounded-full', booked > QUARTER ? 'bg-error-solid' : 'bg-success-solid')} style={{ width: `${Math.min(100, (booked / QUARTER) * 100)}%` }} />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {CONTRACTS.map(ct => {
          const ks = taken.filter(k => engageCall(KOLAM_ENQUIRIES[k]) === ct);
          return (
            <div key={ct} className="flex flex-col gap-1 rounded-lg bg-primary p-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-tertiary"><span className="size-2 shrink-0 rounded-full" style={{ background: ENGAGE_FILL[ct] }} aria-hidden />{CONTRACT_LABEL[ct]}</span>
              {ks.length === 0 && <span className="text-sm text-quaternary">None yet</span>}
              {ks.map(k => {
                const e = KOLAM_ENQUIRIES[k];
                return (
                  <span key={k} className="flex items-center justify-between gap-2 text-sm">
                    <span className="min-w-0 font-semibold text-secondary">{e.short}</span>
                    <span className="shrink-0 font-bold text-primary tabular-nums">{inr(effectiveRate(e))}/day</span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
      {declined.length > 0 && (
        <div className="flex flex-col gap-1 rounded-lg border-2 border-dashed border-secondary p-2">
          <span className="text-xs font-bold text-tertiary">Declined</span>
          {declined.map(k => <span key={k} className="text-sm font-semibold text-secondary">{KOLAM_ENQUIRIES[k].short}</span>)}
        </div>
      )}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const avg = booked ? Math.round(fees / booked) : 0;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Quarter booked" title={`${n} of ${game.cards.length} right first time`}>
          The work Kolam took averages {inr(avg)} a day, above its {inr(TARGET)} target. It also adds up to {booked} days against {QUARTER} billable: a full calendar is the signal to raise rates for new work.
        </StageTitle>
        {board}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Rate first, against the floor. Then a stream is a retainer, a clear one-off is fixed, and the unknown is billed by the day.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as KolamEnquiry;
  const e = KOLAM_ENQUIRIES[k];
  const lane = engageCall(e);
  const rate = effectiveRate(e);
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
        <span className="text-sm font-semibold text-tertiary">Kolam inbox · {e.client}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <dl className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-3">
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2 sm:flex-col sm:items-start sm:gap-0.5">
            <dt className="text-xs font-bold text-tertiary">Fee</dt>
            <dd className="font-bold text-primary tabular-nums">{feeText(e)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2 sm:flex-col sm:items-start sm:gap-0.5">
            <dt className="text-xs font-bold text-tertiary">Work</dt>
            <dd className="font-bold text-primary tabular-nums">{daysText(e)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2 sm:flex-col sm:items-start sm:gap-0.5">
            <dt className="text-xs font-bold text-tertiary">Day rate</dt>
            <dd className={cx('font-bold tabular-nums', rate < FLOOR ? 'text-error-primary' : 'text-primary')}>{inr(rate)}</dd>
          </div>
        </dl>
        <Gauge rate={rate} />
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${ENGAGE_FILL[lane]}` }}>
            {lane === 'decline' ? 'Declined, with a reason and an alternative.' : `${CONTRACT_LABEL[lane]}: ${inrScale(quarterOf(e).fee)} and ${quarterOf(e).days} days this quarter.`}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="How Kolam should take this work">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: ENGAGE_FILL[l.id as EngageCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next enquiry' : 'See the quarter'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Fee ÷ days against the floor first. Then: is it a stream, and is the scope clear?</NibSays>}
      </div>
      {board}
    </div>
  );
}
