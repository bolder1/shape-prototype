'use client';
// Mini-game for dc.3-1: plan Meera's week. Every card is a task on Hisaab's "Snap a bill" (its `visual`, a key of
// `HISAAB_TASKS`). Let AI draft it for her to check, keep her in the lead with AI widening the options, or keep AI out
// (`AI_ROLES`, scored by `aiRole`). Placed tasks fill a week planner with `roleReason` and the hours by hand beside
// the hours with AI; a meter at the top counts `hoursBack`. A miss explains and the card comes back later; first call
// scores. The end shows the hours back and what stayed human.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HISAAB_TASKS, aiRole, hoursBack, roleReason, type AiRole, type Episode, type HisaabTask } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ROLE_TONE } from '../scenes/AiWorkflow';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const T = (k: string) => HISAAB_TASKS[k as HisaabTask];
const fmtH = (h: number) => `${Math.round(h * 100) / 100} h`;
const TOTAL = hoursBack(Object.values(HISAAB_TASKS));

function Week({ game, placed, hot }: { game: Game; placed: HisaabTask[]; hot?: HisaabTask }) {
  const back = hoursBack(placed.map(k => HISAAB_TASKS[k]));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-4" role="status">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-primary">Hours back this week</span>
          <span className="text-lg font-bold text-primary tabular-nums">{fmtH(back)}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-primary ring-1 ring-inset ring-secondary">
          <motion.div className="h-full rounded-full bg-mint-600" initial={false} animate={{ width: `${(back / TOTAL) * 100}%` }} transition={springs.pop} />
        </div>
        <span className="text-xs font-medium text-tertiary">After the time it takes to check what AI made.</span>
      </div>
      {game.lanes.map(l => {
        const ks = placed.filter(k => aiRole(HISAAB_TASKS[k]) === l.id);
        return (
          <div key={l.id} className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-3">
            <span className="flex items-center gap-1.5 text-sm font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: ROLE_TONE[l.id as AiRole] }} aria-hidden />{l.label}</span>
            {ks.length === 0 && <span className="text-xs text-quaternary">Nothing here yet.</span>}
            {ks.map(k => {
              const t = HISAAB_TASKS[k];
              return (
                <motion.div key={k} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
                  className={cx('flex items-start justify-between gap-3 rounded-lg bg-primary px-3 py-2 ring-1 ring-inset', hot === k ? 'ring-mint-600' : 'ring-secondary')}>
                  <span className="flex flex-col gap-0.5">
                    <span className="line-clamp-2 text-xs font-semibold text-primary">{t.text}</span>
                    <span className="text-xs text-tertiary">{roleReason(t)}</span>
                  </span>
                  {t.hours && l.id !== 'keep' && (
                    <span className="shrink-0 text-right text-xs font-semibold tabular-nums text-tertiary">
                      <span className="line-through">{fmtH(t.hours[0])}</span><br /><span className="text-primary">{fmtH(t.hours[1])}</span>
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function AiDelegate({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<HisaabTask[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const kept = placed.filter(k => aiRole(HISAAB_TASKS[k]) === 'keep').length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Week planned" title={`${n} of ${game.cards.length} called first time`}>
          {fmtH(hoursBack(placed.map(k => HISAAB_TASKS[k])))} back after checking, {kept} tasks kept human, and every decision still Meera’s.
        </StageTitle>
        <Week game={game} placed={placed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Before you hand AI a task, ask two things: can I check this faster than I could do it, and is the call mine? Then spend the hours you get back on the work only people can do, like sitting in a real shop.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as HisaabTask;
  const task = T(k);
  const lane = aiRole(task);
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
            <span className="text-sm font-semibold text-tertiary">On Meera’s list</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0, rotate: -1 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1, rotate: 0 } : { y: 0, opacity: 1, rotate: 0 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <p className="text-lg font-semibold text-primary">{card.label}</p>
            {task.hours && <span className="text-sm font-medium text-tertiary">By hand: about {fmtH(task.hours[0])}</span>}
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="How much to give AI">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: ROLE_TONE[l.id as AiRole] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next task' : 'See the week'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Would it stand in for real people, or expose customers’ data? If not: can she check it quickly, or is the decision hers?</NibSays>}
          </div>
        </div>
        <Week game={game} placed={placed} hot={right ? k : undefined} />
      </div>
    </div>
  );
}
