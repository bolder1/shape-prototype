'use client';
// Mini-game for gr.4-1: find the habit zone. Every card is something people do in Riyaaz (its `visual`, a key of
// `RIYAAZ_BEHAVIOURS`), shown with how often and the evidence. Call it build a loop, prompt at the moment, or leave it
// (`HABIT_CALLS`, scored by `habitCall`): who it helps first, then how often. Right calls plot it on the habit zone,
// a strip of times a week for each row (helps the singer, or only our numbers). First call scores; a missed card comes
// back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HABIT_MIN_PER_WEEK, RIYAAZ_BEHAVIOURS, habitCall, type Episode, type HabitCall, type RiyaazBehaviour } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { HABIT_FILL, zoneX } from '../scenes/PracticeLoop';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** "6 times a week", 'about once a month', "twice a year". */
function often(perWeek: number) {
  if (perWeek >= 1) return `${perWeek} time${perWeek === 1 ? '' : 's'} a week`;
  const perYear = Math.round(perWeek * 52);
  if (perYear >= 12) { const m = Math.round(perYear / 12); return m === 1 ? 'about once a month' : `about ${m} times a month`; }
  return perYear === 1 ? 'once a year' : perYear === 2 ? 'twice a year' : `${perYear} times a year`;
}

function whyNot(k: RiyaazBehaviour) {
  const b = RIYAAZ_BEHAVIOURS[k];
  switch (habitCall(b)) {
    case 'leave': return `It doesn’t help anyone sing better: ${b.why.charAt(0).toLowerCase() + b.why.slice(1)}.`;
    case 'moment': return `It helps, but it happens ${often(b.perWeek)}, too rarely to become a habit.`;
    case 'loop': return `It helps the singer and happens ${often(b.perWeek)}: that’s the habit zone.`;
  }
}

export function HabitZone({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RiyaazBehaviour[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const zone = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">The habit zone</span>
      {([true, false] as const).map(useful => (
        <div key={String(useful)} className="flex flex-col gap-1">
          <span className="text-xs font-bold text-secondary">{useful ? 'Helps the singer' : 'Only our numbers'}</span>
          <div className="relative h-12 rounded-lg bg-primary">
            {useful && <div className="absolute inset-y-0 right-0 rounded-r-lg ring-2 ring-inset ring-mint-600" style={{ left: `${zoneX(HABIT_MIN_PER_WEEK) * 100}%` }} aria-hidden />}
            <div className="absolute inset-y-0 border-l-2 border-dashed border-secondary" style={{ left: `${zoneX(HABIT_MIN_PER_WEEK) * 100}%` }} aria-hidden />
            {placed.filter(k => RIYAAZ_BEHAVIOURS[k].useful === useful).map((k, i) => (
              <motion.span key={k} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                className="absolute size-3.5 -translate-x-1/2 rounded-full ring-2 ring-white" title={RIYAAZ_BEHAVIOURS[k].short}
                style={{ left: `${4 + zoneX(RIYAAZ_BEHAVIOURS[k].perWeek) * 92}%`, top: `${20 + (i % 3) * 22}%`, background: HABIT_FILL[habitCall(RIYAAZ_BEHAVIOURS[k])] }} />
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-between text-xs font-bold text-tertiary"><span>Yearly</span><span>Weekly</span><span>Daily+</span></div>
      {placed.length > 0 && (
        <ul className="flex flex-wrap gap-1" aria-label="Placed so far">
          {placed.map(k => <li key={k} className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: HABIT_FILL[habitCall(RIYAAZ_BEHAVIOURS[k])] }}>{RIYAAZ_BEHAVIOURS[k].short}</li>)}
        </ul>
      )}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Habit zone mapped" title={`${n} of ${game.cards.length} right first time`}>
          Four behaviours get a loop, four get a timely prompt, and four are left alone, however often people do them.
        </StageTitle>
        {zone}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Frequent and useful to the singer. That corner is the only place to build a habit.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RiyaazBehaviour;
  const b = RIYAAZ_BEHAVIOURS[k];
  const lane = habitCall(b);
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
        <span className="text-sm font-semibold text-tertiary">Riyaaz · behaviours</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Something people do</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2">
            <span className="text-xs font-bold text-tertiary">How often</span>
            <span className="font-bold text-primary tabular-nums">{often(b.perWeek)}</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-lg bg-secondary px-3 py-2">
            <span className="text-xs font-bold text-tertiary">What we know</span>
            <span className="font-medium text-primary">{b.why}</span>
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-label="What to design for it">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: HABIT_FILL[l.id as HabitCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next behaviour' : 'See the zone'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">First: does it help the singer, or only our numbers? Then: does it happen at least once a week?</NibSays>}
      </div>
      {zone}
    </div>
  );
}
