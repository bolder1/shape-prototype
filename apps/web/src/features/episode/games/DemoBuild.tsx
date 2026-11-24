'use client';
// Mini-game for bz.3-1: build the Sunrise demo. Every card is a moment you could show (its `visual`, a key of
// `SUNRISE_MOMENTS`), laid out as a palette. Tap a moment to add it to the demo or take it out; the agenda beside it
// re-sorts tell–show–tell (`demoOrder`), fills a bar against `DEMO_MINUTES`, ticks off Sunrise's three problems
// (`demoGaps`) and lists whatever `demoFlaws` still finds. "Run the demo" locks in a try: the first run scores each
// card (in the demo exactly when its lane is `show`), and if the run isn't clean, Nib explains the moments that are
// wrong and you fix it before running again.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, PlayIcon } from '@phosphor-icons/react/ssr';
import { DEMO_MINUTES, DEMO_PAINS, PAIN_NAME, SUNRISE_MOMENTS, demoFlaws, demoGaps, demoLength, demoOrder, type Episode, type SunriseMoment } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FLAW_NAME, MOMENT_SHORT, PAIN_TONE, momentTone } from '../scenes/DemoTour';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const M = (k: string) => SUNRISE_MOMENTS[k as SunriseMoment];

function Agenda({ keys }: { keys: SunriseMoment[] }) {
  const ordered = demoOrder(keys, k => SUNRISE_MOMENTS[k]);
  const ms = ordered.map(k => SUNRISE_MOMENTS[k]);
  const mins = demoLength(ms);
  const gaps = demoGaps(ms);
  const flaws = demoFlaws(ms);
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold text-primary">The demo</span>
        <span className={cx('text-sm font-bold tabular-nums', mins > DEMO_MINUTES ? 'text-error-primary' : 'text-primary')}>{mins} / {DEMO_MINUTES} min</span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-primary ring-1 ring-secondary" role="meter" aria-label="Demo length" aria-valuemin={0} aria-valuemax={DEMO_MINUTES} aria-valuenow={mins}>
        <motion.div className={cx('absolute inset-y-0 left-0 rounded-full', mins > DEMO_MINUTES ? 'bg-error-solid' : 'bg-mint-600')} initial={false} animate={{ width: `${Math.min(100, (mins / DEMO_MINUTES) * 100)}%` }} transition={springs.pop} />
      </div>
      <ol className="flex flex-col gap-1.5">
        {ordered.length === 0 && <li className="text-sm text-quaternary">Tap moments to build the demo.</li>}
        {ordered.map(k => (
          <motion.li key={k} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop}
            className="flex items-start gap-2 rounded-lg border-l-4 bg-primary px-3 py-2 text-sm text-primary" style={{ borderColor: momentTone(SUNRISE_MOMENTS[k]) }}>
            <span className="w-9 shrink-0 font-bold text-tertiary tabular-nums">{SUNRISE_MOMENTS[k].mins}′</span>
            <span className="line-clamp-2">{SUNRISE_MOMENTS[k].text}</span>
          </motion.li>
        ))}
      </ol>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-tertiary">What Sunrise said hurts</span>
        {DEMO_PAINS.map(d => {
          const solved = !gaps.includes(d);
          return (
            <span key={d} className="flex items-center gap-2 text-sm font-semibold text-primary">
              <span className={cx('flex size-5 items-center justify-center rounded-full ring-2', solved ? 'bg-mint-600 ring-mint-600' : 'ring-secondary')} style={solved ? undefined : { boxShadow: `inset 0 0 0 2px ${PAIN_TONE[d]}` }} aria-hidden>
                {solved && <CheckIcon className="size-3.5 text-white" weight="bold" />}
              </span>
              {PAIN_NAME[d]}<span className="sr-only">{solved ? ', shown solved' : ', not shown yet'}</span>
            </span>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-1.5 text-xs font-semibold" aria-live="polite">
        {ordered.length > 0 && flaws.length === 0 && <span className="rounded-full bg-success-primary px-2 py-1 text-success-primary">Clean demo</span>}
        {ordered.length > 0 && flaws.map(f => <span key={f} className="rounded-full bg-error-primary px-2 py-1 text-error-primary">{FLAW_NAME[f]}</span>)}
      </div>
    </div>
  );
}

export function DemoBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [inDemo, setInDemo] = useState<SunriseMoment[]>([]);
  const [results, setResults] = useState<Record<string, boolean> | null>(null);
  const [runs, setRuns] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [clean, setClean] = useState(false);

  if (clean && results) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Demo booked" title={`${n} of ${game.cards.length} right on the first run`}>
          {`${demoLength(inDemo.map(k => SUNRISE_MOMENTS[k]))} minutes, every Sunrise problem answered on their own data, and a pilot to say yes to.`}
        </StageTitle>
        <Agenda keys={inDemo} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Rehearse the click path the day before, on the demo account seeded with their clinic names. A spinner or an empty screen mid-demo costs more than any missing feature.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const toggle = (k: SunriseMoment) => {
    play('tap');
    setWrong([]);
    setInDemo(d => (d.includes(k) ? d.filter(x => x !== k) : [...d, k]));
  };
  const run = () => {
    const bad = game.cards.filter(c => inDemo.includes(c.visual as SunriseMoment) !== (c.lane === 'show')).map(c => c.id);
    if (!results) setResults(Object.fromEntries(game.cards.map(c => [c.id, !bad.includes(c.id)])));
    setRuns(r => r + 1);
    play(bad.length ? 'wrong' : 'correct');
    if (bad.length) setWrong(bad); else setClean(true);
  };
  const wrongCards = game.cards.filter(c => wrong.includes(c.id));

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,22rem)]">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-tertiary">Moments you could show</span>
          <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Demo moments">
            {game.cards.map(c => {
              const k = c.visual as SunriseMoment;
              const on = inDemo.includes(k);
              const bad = wrong.includes(c.id);
              return (
                <motion.button key={c.id} type="button" onClick={() => toggle(k)} aria-pressed={on} whileTap={{ scale: 0.98 }}
                  animate={bad ? { x: [0, -6, 6, -3, 3, 0] } : undefined} transition={{ duration: 0.4 }}
                  className={cx('flex flex-col gap-1.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition hover:bg-primary_hover',
                    bad ? 'border-error' : on ? 'border-mint-600' : 'border-secondary')}>
                  <span className="flex items-center justify-between gap-2 text-xs font-bold text-tertiary">
                    <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: momentTone(M(k)) }} aria-hidden />{M(k).mins} min</span>
                    <span className={cx('rounded-full px-2 py-0.5', on ? 'bg-success-primary text-success-primary' : 'bg-secondary text-tertiary')}>{on ? 'In the demo' : 'Add'}</span>
                  </span>
                  <span className="text-sm font-medium text-primary">{c.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Agenda keys={inDemo} />
          <Button size="lg" iconLeading={PlayIcon} onPress={run} isDisabled={inDemo.length === 0}>{runs ? 'Run it again' : 'Run the demo'}</Button>
        </div>
      </div>
      <div className="min-h-14" aria-live="polite">
        {wrongCards.length === 0 && <NibSays mood="think">Check each moment against Sunrise’s three problems. If it doesn’t answer one, open the call, or close it, it waits for their questions.</NibSays>}
        {wrongCards.length > 0 && (
          <NibSays mood="sad">
            {`Not yet: ${wrongCards.length} moment${wrongCards.length > 1 ? 's' : ''} ${wrongCards.length > 1 ? 'are' : 'is'} wrong. `}
            {wrongCards.map(c => `${c.lane === 'show' ? 'Missing' : 'Cut'} “${MOMENT_SHORT[c.visual as SunriseMoment]}”: ${c.note}`).join(' ')}
          </NibSays>
        )}
      </div>
    </div>
  );
}
