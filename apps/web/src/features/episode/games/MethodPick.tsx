'use client';
// Mini-game for rs.4-2: seven studies on Meher's list. Each shows how many people it needs (`visual`), and each of the
// three ways to run it shows its price for that study, from `studyCost`: days until results, and rupees. Book one; the
// note says whether it fits and what comes back. Your bookings add up on a running bill. The end sets your plan against
// Meher's and against booking everything in person.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarBlankIcon, CheckIcon, CurrencyInrIcon, UsersThreeIcon, XIcon } from '@phosphor-icons/react/ssr';
import { studyCost, type Episode, type Method } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const days = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)} days`;
/** What each way of running it hands back. */
const BACK: Record<Method, (n: number) => string> = {
  person: n => `${n} sessions’ notes and quotes, with the why behind every pause.`,
  remote: n => `${n} recorded calls, with your follow-up questions in them.`,
  unmod: n => `${n} recordings and a success rate by tomorrow, and no follow-ups.`,
};
const total = (cards: Card[], pick: (c: Card) => string) => cards.reduce((a, c) => {
  const s = studyCost(pick(c) as Method, Number(c.visual));
  return { days: a.days + s.days, rupees: a.rupees + s.rupees };
}, { days: 0, rupees: 0 });

export function MethodPick({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const booked = game.cards.filter(c => picks[c.id]);
  const bill = total(booked, c => picks[c.id]);

  const book = (laneId: string) => {
    if (!card || picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicks(p => ({ ...p, [card.id]: laneId }));
  };

  const billBar = (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-primary">
      <span>Your plan so far · {booked.length} booked</span>
      <span className="flex items-center gap-3 tabular-nums">
        <span className="inline-flex items-center gap-1"><CalendarBlankIcon className="size-4" aria-hidden />{days(bill.days)}</span>
        <span className="inline-flex items-center gap-1"><CurrencyInrIcon className="size-4" aria-hidden />{bill.rupees.toLocaleString('en-IN')}</span>
      </span>
    </div>
  );

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    const plans = [
      { name: 'Your plan', ...bill },
      { name: 'Meher’s plan', ...total(game.cards, c => c.lane) },
      { name: 'Everything in person', ...total(game.cards, () => 'person') },
    ];
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Sessions booked" title={`${right} of ${game.cards.length} studies booked the way Meher would`}>
          Moderated where she needs the why, unmoderated where she needs numbers.
        </StageTitle>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          {plans.map((pl, k) => (
            <div key={pl.name} className={cx('flex flex-col gap-1 rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-inset', k === 1 ? 'ring-mint-600' : 'ring-secondary')}>
              <span className="text-sm font-bold text-tertiary">{pl.name}</span>
              <span className="text-xl font-semibold text-primary tabular-nums">{days(pl.days)}</span>
              <span className="text-md font-semibold text-secondary tabular-nums">{inr(pl.rupees)}</span>
            </div>
          ))}
        </div>
        <ul className="flex w-full flex-col gap-2 text-left">
          {game.cards.map(c => {
            const lane = game.lanes.find(l => l.id === c.lane)!;
            return (
              <li key={c.id} className="flex items-start justify-between gap-3 rounded-xl bg-primary px-4 py-2.5 ring-1 ring-secondary ring-inset">
                <span className="text-sm text-primary">{c.label}</span>
                <span className={cx('shrink-0 text-sm font-bold', picks[c.id] === c.lane ? 'text-primary' : 'text-error-primary')}>{lane.label}</span>
              </li>
            );
          })}
        </ul>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Days here are added up, but studies can run side by side. The point is the trade: moderated buys you why, unmoderated buys you how many.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const n = Number(card.visual), ok = picked === card.lane, answer = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      {billBar}
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Study {i + 1} of {game.cards.length}</span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-tertiary tabular-nums"><UsersThreeIcon className="size-4" aria-hidden />{n} people</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {game.lanes.map(l => {
          const cost = studyCost(l.id as Method, n);
          return (
            <motion.button key={l.id} type="button" onClick={() => book(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
              className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
                !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
              <span className="text-md font-bold text-primary">{l.label}</span>
              <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
              <span className="mt-1 text-sm font-semibold text-secondary tabular-nums">{days(cost.days)} · {inr(cost.rupees)}</span>
            </motion.button>
          );
        })}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{answer.label}.</span>{' '}{card.note}
          </NibSays>
          <p className="rounded-xl bg-secondary px-4 py-2.5 text-sm text-secondary"><strong className="text-primary">What comes back from your booking:</strong> {BACK[picked as Method](n)}</p>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next study' : 'See the plan'}</Button></div>
        </div>
      )}
    </div>
  );
}
