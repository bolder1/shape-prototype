'use client';
// Mini-game for ld.4-2: read the health check. Every card is a reading on Saathi's quarterly design health check (its
// `visual`, a key of `SAATHI_READINGS`), drawn over three quarters against the line the team agreed. Drop it, call it
// healthy, watch it or act on it (`HEALTH_CALLS`, scored by `healthCall`). Right calls file it into the check Megha
// takes to the team (`healthCheck`). First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HEALTH_CALLS, MIN_GROUP, SAATHI_READINGS, healthCall, healthCheck, overStreak, type Episode, type HealthCall, type SaathiReading } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { HEALTH_FILL, HEALTH_LABEL, Spark, readingValue } from '../scenes/HealthPulse';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

const WHY: Record<HealthCall, string> = {
  drop: 'It counts output or tracks named people. That measures activity, not health, and people will game it.',
  healthy: 'A team measure on the right side of the line the team agreed. Say so, and keep reading it.',
  watch: `Over its line, but for one quarter only, or from fewer than ${MIN_GROUP} people. Ask, and read it again next quarter.`,
  act: 'Over its line for two quarters or more, from enough people to trust. Take it to the team and agree a change.',
};
const AREA = { delivery: 'Delivery', quality: 'Quality', people: 'People' } as const;

/** The check so far, grouped by call. */
function Check({ decided }: { decided: SaathiReading[] }) {
  if (!decided.length) return null;
  const groups = healthCheck(decided);
  return (
    <div className="grid grid-cols-2 gap-2" aria-label="The health check so far">
      {HEALTH_CALLS.map(c => (
        <div key={c} className="flex flex-col gap-1.5 rounded-xl border-2 border-secondary bg-primary p-3" style={{ boxShadow: `inset 0 4px 0 ${HEALTH_FILL[c]}` }}>
          <span className="flex items-baseline justify-between gap-1 text-sm font-bold text-primary">{HEALTH_LABEL[c]}<span className="tabular-nums text-tertiary">{groups[c].length}</span></span>
          <ul className="flex flex-col gap-1">
            {groups[c].map(k => (
              <motion.li key={k} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
                className={cx('text-sm font-medium', c === 'drop' ? 'text-tertiary line-through' : 'text-secondary')}>{SAATHI_READINGS[k].short}</motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function HealthRead({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [decided, setDecided] = useState<SaathiReading[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const g = healthCheck(decided);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Check read" title={`${n} of ${game.cards.length} right first time`}>
          {g.act.length} to act on, {g.watch.length} to watch, {g.healthy.length} healthy, and {g.drop.length} dropped. Megha takes the ones to act on to the team first, and asks why.
        </StageTitle>
        <Check decided={decided} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Measure the team, never the people. One quarter is a blip; two is a trend.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SaathiReading;
  const r = SAATHI_READINGS[k];
  const lane = healthCall(r);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setDecided(ds => [...ds, k]); }
    else {
      setMiss({ lane: laneId, why: WHY[lane] });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const streak = overStreak(r);
  const meta = [AREA[r.area], r.kind === 'team' ? 'team measure' : r.kind === 'person' ? 'per person' : 'count of output', r.n !== undefined ? `${r.n} people` : null].filter(Boolean).join(' · ');

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-tertiary">Saathi design · quarterly health check</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-md font-bold text-primary">{r.short}</span>
          <span className="text-sm font-semibold text-tertiary">{meta}</span>
        </div>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 240 96" className="h-20 w-full max-w-60 shrink" role="img"
            aria-label={`Last three quarters: ${r.history.map(v => readingValue(r, v)).join(', ')}${r.limit !== undefined ? `; the line is ${readingValue(r, r.limit)}` : '; no agreed line'}`}>
            <Spark r={r} x={4} y={8} w={232} h={80} color={right ? HEALTH_FILL[lane] : 'var(--color-text-secondary)'} />
          </svg>
          <div className="flex shrink-0 flex-col">
            <span className="text-xl font-bold tabular-nums text-primary">{readingValue(r)}</span>
            <span className="text-xs font-medium text-tertiary">{r.limit !== undefined ? `line ${readingValue(r, r.limit)}` : 'no line'}</span>
          </div>
        </div>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${HEALTH_FILL[lane]}` }}>
            {lane === 'drop' ? 'Off the check.' : streak ? `Over the line ${streak === 1 ? 'for one quarter' : `for ${streak} quarters in a row`}${r.n !== undefined && r.n < MIN_GROUP ? `, from only ${r.n} people` : ''}.` : 'On the right side of its line.'}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What this reading calls for">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: HEALTH_FILL[l.id as HealthCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next reading' : 'See the check'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Is it about the team? Is it over its line? For how many quarters, and from how many people?</NibSays>}
      </div>
      <Check decided={decided} />
    </div>
  );
}
