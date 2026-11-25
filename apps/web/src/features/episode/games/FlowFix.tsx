'use client';
// Mini-game for ld.4-1: fix the flow. Every card is a step where a Saathi design request loses time (its `visual`, a
// key of `SAATHI_STEPS`). Remove it, unblock it, standardise it or automate it (`FLOW_FIXES`, scored by `flowFix`).
// Right calls swap the step for its `fixed` version, and the request's journey shrinks (`flowHours`, `flowEfficiency`).
// First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { SAATHI_STEPS, flowEfficiency, flowFix, flowHours, workDays, type Episode, type FlowFix as Fix, type SaathiStep } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FLOW_FILL, FLOW_LABEL, WORK_FILL } from '../scenes/WaitTime';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const ALL = Object.keys(SAATHI_STEPS) as SaathiStep[];
const BEFORE = flowHours(ALL);
const MAX = BEFORE.touch + BEFORE.wait;

const WHY: Record<Fix, string> = {
  remove: 'Doing it changes nothing about what ships, so it goes. Automating it would only make the waste faster.',
  unblock: 'It matters, but work queues behind one person, one meeting or too much in progress. Clear the queue first.',
  standardise: 'It matters and nothing blocks it, but every squad does it differently. Agree one way with the squads.',
  automate: 'It matters, flows and is the same everywhere, but a person does a rule-based job by hand. Now automate it.',
};

/** The request's journey before, and with the fixes made so far. */
function Journey({ fixed }: { fixed: SaathiStep[] }) {
  const now = flowHours(ALL, fixed);
  const rows = [['Before', BEFORE], ['Now', now]] as const;
  return (
    <div className="flex flex-col gap-2 rounded-2xl border-2 border-secondary bg-primary p-3"
      aria-label={`One request: ${workDays(MAX)} working days at ${flowEfficiency(BEFORE)}% flow efficiency before, ${workDays(now.touch + now.wait)} days at ${flowEfficiency(now)}% now`}>
      {rows.map(([l, h]) => (
        <div key={l} className="flex flex-col gap-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-sm font-semibold">
            <span className="text-tertiary">{l}</span>
            <span className="tabular-nums text-primary">{workDays(h.touch + h.wait)} days · {flowEfficiency(h)}% working</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-secondary">
            <motion.div className="h-full" style={{ background: WORK_FILL }} initial={false} animate={{ width: `${(h.touch / MAX) * 100}%` }} transition={springs.pop} />
            <motion.div className="h-full bg-quaternary" initial={false} animate={{ width: `${(h.wait / MAX) * 100}%` }} transition={springs.pop} />
          </div>
        </div>
      ))}
      <div className="flex gap-3 text-xs font-semibold text-tertiary">
        <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm" style={{ background: WORK_FILL }} aria-hidden />Work</span>
        <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-quaternary" aria-hidden />Waiting</span>
      </div>
    </div>
  );
}

/** The new workflow: every step fixed so far, as it is now. */
function NewFlow({ fixed }: { fixed: SaathiStep[] }) {
  if (!fixed.length) return null;
  return (
    <ul className="flex flex-col gap-2" aria-label="The workflow so far">
      {fixed.map(k => {
        const s = SAATHI_STEPS[k], f = flowFix(s);
        return (
          <motion.li key={k} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="flex flex-col gap-1 rounded-xl border-2 border-secondary bg-primary p-3" style={{ boxShadow: `inset 4px 0 0 ${FLOW_FILL[f]}` }}>
            <div className="flex flex-wrap items-center justify-between gap-2 pl-1">
              <span className={cx('text-md font-bold', f === 'remove' ? 'text-tertiary line-through' : 'text-primary')}>{s.short}</span>
              <span className="rounded-md px-2 py-0.5 text-sm font-semibold text-white" style={{ background: FLOW_FILL[f] }}>{FLOW_LABEL[f]}</span>
            </div>
            <span className="pl-1 text-sm text-secondary">{s.fixed}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}

export function FlowFix({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [fixed, setFixed] = useState<SaathiStep[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const now = flowHours(ALL, fixed);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Flow fixed" title={`${n} of ${game.cards.length} right first time`}>
          From {workDays(MAX)} working days to {workDays(now.touch + now.wait)}, and from {flowEfficiency(BEFORE)}% of the time spent working to {flowEfficiency(now)}%.
        </StageTitle>
        <Journey fixed={fixed} />
        <NewFlow fixed={fixed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Remove, unblock, standardise, automate. Then map the flow again in six months, because steps creep back.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SaathiStep;
  const s = SAATHI_STEPS[k];
  const lane = flowFix(s);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setFixed(fs => [...fs, k]); }
    else {
      setMiss({ lane: laneId, why: WHY[lane] });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const h = right ? s.after : s;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-tertiary">Saathi design · one request’s journey</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-md font-bold text-primary">{s.short}</span>
          <span className="text-sm font-semibold capitalize text-tertiary">{s.stage}</span>
        </div>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="flex flex-col gap-1" aria-label={`${h.touch} hours of work and ${h.wait} hours of waiting per request`}>
          <div className="flex h-3 overflow-hidden rounded-full bg-secondary">
            <motion.div className="h-full" style={{ background: WORK_FILL }} initial={false} animate={{ width: `${(h.touch / 56) * 100}%` }} transition={springs.pop} />
            <motion.div className="h-full bg-quaternary" initial={false} animate={{ width: `${(h.wait / 56) * 100}%` }} transition={springs.pop} />
          </div>
          <span className="text-sm font-semibold tabular-nums text-tertiary">{h.touch} h work · {h.wait} h waiting, per request</span>
        </div>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${FLOW_FILL[lane]}` }}>
            {s.fixed}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What to do about this step">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: FLOW_FILL[l.id as Fix] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next step' : 'See the new flow'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does it change what ships? Does it queue behind someone? Does every squad do it differently?</NibSays>}
      </div>
      <Journey fixed={fixed} />
      <NewFlow fixed={fixed} />
    </div>
  );
}
