'use client';
// Mini-game for ax.3-3: plan the first year of Hazri's accessibility programme. Every card is a step (its `visual`, a
// key of `HAZRI_PROGRAM`), shown with its owner and the steps it needs. Put it in the earliest quarter those needs
// allow (`PROGRAM_QUARTERS`, scored by `programLane`). Too early names what won't be done yet (`unmetNeeds`); too late
// says when it could have started. Right calls add it to the roadmap beside the deck. First call scores; a missed card
// comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HAZRI_PROGRAM, PROGRAM_QUARTERS, QUARTER_LABEL, programLane, unmetNeeds, type Episode, type HazriStep, type ProgramQuarter } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { QUARTER_FILL } from '../scenes/MaturityRoad';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const short = (k: HazriStep) => HAZRI_PROGRAM[k].short;
const list = (ks: readonly HazriStep[]) => ks.map(k => short(k).toLowerCase()).join(ks.length > 2 ? ', ' : ' and ');

/** Why a wrong quarter is wrong. */
function whyNot(k: HazriStep, q: ProgramQuarter) {
  const at = PROGRAM_QUARTERS.indexOf(q), best = programLane(k);
  const missing = unmetNeeds(k, at);
  if (missing.length) return `Too early: ${list(missing)} won’t be done by ${QUARTER_LABEL[q]}.`;
  return best === 'q1'
    ? `Too late: it needs nothing first, so it can start in ${QUARTER_LABEL[best]}.`
    : `Too late: everything it needs is done before ${QUARTER_LABEL[best]}, so it can start then.`;
}

export function ProgramRoad({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<HazriStep[]>([]);
  const [miss, setMiss] = useState<{ q: ProgramQuarter; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const road = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Hazri’s first year</span>
      <ol className="flex flex-col gap-2">
        {PROGRAM_QUARTERS.map(q => {
          const here = placed.filter(k => programLane(k) === q);
          return (
            <li key={q} className="flex flex-col gap-1.5 rounded-xl bg-primary px-3 py-2">
              <span className="text-sm font-bold" style={{ color: QUARTER_FILL[q] }}>{QUARTER_LABEL[q]}</span>
              <span className="flex flex-wrap gap-1.5">
                {here.length === 0 && <span className="text-sm text-quaternary">Nothing placed yet</span>}
                {here.map(k => (
                  <motion.span key={k} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: QUARTER_FILL[q] }}>{short(k)}</motion.span>
                ))}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Roadmap ready" title={`${n} of ${game.cards.length} right first time`}>
          Ownership and a baseline first, then the policy, components and fixes, then the gates and reports that depend on them, then the measures.
        </StageTitle>
        {road}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Every step has an owner, and nothing waits on Tenzin alone.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as HazriStep;
  const s = HAZRI_PROGRAM[k];
  const lane = programLane(k);
  const needs = s.needs as readonly HazriStep[];
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ q: laneId as ProgramQuarter, why: whyNot(k, laneId as ProgramQuarter) });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Accessibility programme · year one</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">{s.short} · owner {s.owner}</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold text-secondary">Needs:</span>
          {needs.length === 0 && <span className="text-sm text-secondary">nothing first</span>}
          {needs.map(n => (
            <span key={n} className={cx('rounded-full px-2.5 py-0.5 text-xs font-bold', placed.includes(n) ? 'text-white' : 'bg-secondary text-secondary')}
              style={placed.includes(n) ? { background: QUARTER_FILL[programLane(n)] } : undefined}>{short(n)}</span>
          ))}
        </div>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${QUARTER_FILL[lane]}` }}>
            Starts {QUARTER_LABEL[lane]}{needs.length ? `, once ${list(needs)} ${needs.length > 1 ? 'are' : 'is'} in place` : ''}. Owner: {s.owner}.
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Which quarter it starts">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.q === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: QUARTER_FILL[l.id as ProgramQuarter] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next step' : 'See the roadmap'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Find the latest quarter among what it needs, and start it the quarter after. Needs nothing? Start now.</NibSays>}
      </div>
      {road}
    </div>
  );
}
