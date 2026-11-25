'use client';
// Mini-game for ld.1-3: sprint, or something smaller? Every card is a question on Rasoi's list for the quarter (its
// `visual`, a key of `RASOI_QUESTIONS`). Run a five-day design sprint, test one design, research the problem first, or
// just build it (`SPRINT_CALLS`, scored by `sprintCall`). Right calls pile up by lane, and a meter adds the team-days
// each call spends before there's an answer (`teamDays`, `daysSpent`), against what sprinting on everything would
// cost. A miss explains and the card comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { RASOI_QUESTIONS, daysSpent, sprintCall, teamDays, type Episode, type RasoiQuestion, type SprintCall } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CALL_TONE } from '../scenes/SprintWeek';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const KEYS = Object.keys(RASOI_QUESTIONS) as RasoiQuestion[];
const ALL_SPRINT = daysSpent(KEYS.map(() => 'sprint' as const));
const RIGHT = daysSpent(KEYS.map(k => sprintCall(RASOI_QUESTIONS[k])));
const SHORT: Record<RasoiQuestion, string> = {
  offices: 'Lunch plans for offices', family: 'Family plan', checkout: 'New plan checkout', onboard: 'Three-step sign-up',
  pune: 'Pune cancellations', week2: 'Week-two drop-off', kitchen: 'Kitchen tablet app', label: '“Pause meals” label',
  typo: 'Kannada menu typo', dark: 'Dark theme',
};

function Quarter({ game, placed, hot }: { game: Game; placed: RasoiQuestion[]; hot?: RasoiQuestion }) {
  const spent = daysSpent(placed.map(k => sprintCall(RASOI_QUESTIONS[k])));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-4" role="status">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-primary">Team-days spent deciding</span>
          <span className="text-lg font-bold text-primary tabular-nums">{spent}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-primary ring-1 ring-inset ring-secondary">
          <motion.div className="h-full rounded-full bg-mint-600" initial={false} animate={{ width: `${(spent / ALL_SPRINT) * 100}%` }} transition={springs.pop} />
        </div>
        <span className="text-xs font-medium text-tertiary">Sprinting on all ten would cost {ALL_SPRINT}.</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {game.lanes.map(l => {
          const ks = placed.filter(k => sprintCall(RASOI_QUESTIONS[k]) === l.id);
          return (
            <div key={l.id} className="flex min-h-24 flex-col gap-1.5 rounded-xl bg-secondary p-2.5">
              <span className="flex items-center justify-between gap-1 text-xs font-bold text-primary">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: CALL_TONE[l.id as SprintCall] }} aria-hidden />{l.label}</span>
                <span className="font-semibold text-tertiary tabular-nums">{teamDays(l.id as SprintCall)} d each</span>
              </span>
              {ks.map(k => (
                <motion.span key={k} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop}
                  className={cx('rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-primary ring-1 ring-inset', hot === k ? 'ring-mint-600' : 'ring-secondary')}>
                  {SHORT[k]}
                </motion.span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SprintFit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RasoiQuestion[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const sprints = placed.filter(k => sprintCall(RASOI_QUESTIONS[k]) === 'sprint').length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Quarter planned" title={`${n} of ${game.cards.length} called first time`}>
          {sprints} sprints, {RIGHT} team-days spent finding answers instead of {ALL_SPRINT}, and nothing built on a problem nobody understood.
        </StageTitle>
        <Quarter game={game} placed={placed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Three questions, in order. Do we understand the problem? If not, research. Is it costly to get wrong? If not, build it. Are there many answers and several teams to agree? Then sprint. Otherwise, test the one design.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RasoiQuestion;
  const lane = sprintCall(RASOI_QUESTIONS[k]);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,22rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">On Rasoi’s list</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0, rotate: 1 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1, rotate: 0 } : { y: 0, opacity: 1, rotate: 0 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <p className="text-lg font-semibold text-primary">{card.label}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="How to answer it">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: CALL_TONE[l.id as SprintCall] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next question' : 'See the quarter'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Do we understand the problem? Is it costly to get wrong? Are there many answers, and several teams to agree?</NibSays>}
          </div>
        </div>
        <Quarter game={game} placed={placed} hot={right ? k : undefined} />
      </div>
    </div>
  );
}
