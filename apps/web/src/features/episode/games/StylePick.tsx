'use client';
// Mini-game for ld.3-2: lead this one. Every card is one of Shalini's designers on one piece of work (its `visual`, a
// key of `KAARIGAR_SITUATIONS`). Pick direct, coach, support or delegate (`LEAD_STYLES`, scored by `leadStyle`). Right
// calls show what Shalini does and plot the designer on a skill × will grid; the end shows, from `stylesByPerson`,
// that every designer needed more than one style. First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { KAARIGAR_SITUATIONS, KAARIGAR_TEAM, LEAD_STYLES, leadStyle, stylesByPerson, type Episode, type KaarigarPerson, type KaarigarSituation, type LeadStyle } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { quadrant, STYLE_FILL, STYLE_LABEL } from '../scenes/SkillWill';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

const WHY: Record<LeadStyle, string> = {
  direct: 'They’re new to this task and keen, so they need to be shown what good looks like and the steps.',
  coach: 'They’re still learning this and have been knocked back, so explain why, decide together and encourage.',
  support: 'They can do this; what’s low is will or confidence. Listen, ask, clear the blocker, and let them decide.',
  delegate: 'They can do this and want to. Agree the outcome and a check-in, then step back.',
};
const SKILL = { low: 'New to this', high: 'Able at this' } as const;
const WILL = { low: 'low will', high: 'keen' } as const;

/** The skill × will grid: high will on top, high skill on the right, each placed situation as a chip. */
function Grid({ placed }: { placed: KaarigarSituation[] }) {
  const cells = [...LEAD_STYLES].sort((a, b) => quadrant[a].row - quadrant[b].row || quadrant[a].col - quadrant[b].col);
  return (
    <div className="flex flex-col gap-1.5" aria-label="Skill and will grid with the situations placed so far">
      <span className="text-sm font-semibold text-tertiary">↑ Will on this task</span>
      <div className="grid grid-cols-2 gap-2">
        {cells.map(s => {
          const here = placed.filter(k => leadStyle(KAARIGAR_SITUATIONS[k]) === s);
          return (
            <div key={s} className="flex min-h-24 flex-col gap-1.5 rounded-xl border-2 border-secondary bg-primary p-2.5" style={{ boxShadow: `inset 4px 0 0 ${STYLE_FILL[s]}` }}>
              <span className="pl-1 text-md font-bold text-primary">{STYLE_LABEL[s]}</span>
              <div className="flex flex-wrap gap-1 pl-1">
                {here.map(k => (
                  <motion.span key={k} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                    className="rounded-md px-1.5 py-0.5 text-sm font-semibold text-white" style={{ background: STYLE_FILL[s] }}>
                    {KAARIGAR_TEAM[KAARIGAR_SITUATIONS[k].who].name}
                  </motion.span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <span className="self-end text-sm font-semibold text-tertiary">Skill on this task →</span>
    </div>
  );
}

export function StylePick({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<KaarigarSituation[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const by = stylesByPerson(placed);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Team read" title={`${n} of ${game.cards.length} right first time`}>
          Five designers, and every one of them needed more than one style this quarter.
        </StageTitle>
        <ul className="flex flex-col gap-2">
          {(Object.keys(KAARIGAR_TEAM) as KaarigarPerson[]).map(p => (
            <li key={p} className="flex flex-col gap-1.5 rounded-xl border-2 border-secondary bg-primary p-3">
              <span className="text-md font-bold text-primary">{KAARIGAR_TEAM[p].name} <span className="text-sm font-semibold text-tertiary">· {KAARIGAR_TEAM[p].role}</span></span>
              <div className="flex flex-wrap gap-1.5">
                {by[p].map(s => <span key={s} className="rounded-md px-2 py-0.5 text-sm font-semibold text-white" style={{ background: STYLE_FILL[s] }}>{STYLE_LABEL[s]}</span>)}
              </div>
            </li>
          ))}
        </ul>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Style is per task, not per person. The weekly 1:1 is where you find out which one this week needs.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as KaarigarSituation;
  const s = KAARIGAR_SITUATIONS[k];
  const person = KAARIGAR_TEAM[s.who];
  const lane = leadStyle(s);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ lane: laneId, why: WHY[lane] });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-tertiary">Shalini’s team · this quarter</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-700 text-md font-bold text-white" aria-hidden>{person.name[0]}</span>
          <span className="flex flex-col">
            <span className="text-md font-bold text-primary">{person.name}</span>
            <span className="text-sm text-tertiary">{person.role} · {s.short}</span>
          </span>
        </div>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {right && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="flex flex-col gap-1 rounded-lg bg-secondary px-3 py-2" style={{ boxShadow: `inset 3px 0 0 ${STYLE_FILL[lane]}` }}>
            <span className="text-sm font-semibold text-tertiary">{SKILL[s.skill]}, {WILL[s.will]} · Shalini:</span>
            <span className="text-sm font-semibold text-primary">{s.move}</span>
          </motion.div>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="How Shalini leads this">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: STYLE_FILL[l.id as LeadStyle] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next one' : 'See the team'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Forget their title. On this piece of work: can they do it yet? Do they want to?</NibSays>}
      </div>
      <Grid placed={placed} />
    </div>
  );
}
