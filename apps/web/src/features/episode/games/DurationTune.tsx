'use client';
// Mini-game for pr.2-2: each card is a transition from Dabba's first build, set to the duration it shipped with (its
// `visual`, "ms|kind"). Drag the slider to the time it should take; the preview plays at that real duration, over and
// over, and a ruler shows the band you're in. Lock it in and `durationVerdict` judges it against the card's band.
// With reduced motion on, the preview plays only when you press Play. The end lays every tuned duration on the ruler.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, PlayIcon, XIcon } from '@phosphor-icons/react/ssr';
import { DURATION_BANDS, durationVerdict, timingOf, type DurationBand, type Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { BAND_NAME, BandRuler, RULER_MAX, TimingPreview } from '../scenes/MotionTiming';
import { Tune } from './MeasureTune';
import { useMotionDemo } from './useMotionDemo';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const HOLD = 0.7;

function Preview({ kind, ms, t, still, caption }: { kind: ReturnType<typeof timingOf>['kind']; ms: number; t: number; still: boolean; caption: string }) {
  const period = ms / 1000 + HOLD;
  const local = ((t % period) + period) % period;
  const k = still ? 1 : ms <= 0 ? 1 : Math.min(1, local / (ms / 1000));
  return (
    <figure className="flex flex-col items-center gap-1">
      <svg viewBox="-2 -2 204 154" className="w-full max-w-60" role="img" aria-label={`${caption}: the transition at ${ms} ms`}>
        <TimingPreview kind={kind} k={kind === 'press' ? (still || k >= 1 ? 1 : 0.5) : k} />
      </svg>
      <figcaption className="text-xs font-semibold text-tertiary">{caption}</figcaption>
    </figure>
  );
}

export function DurationTune({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [values, setValues] = useState<Record<string, number>>({});
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const timing = timingOf(card?.visual ?? '0|press');
  const ms = card ? values[card.id] ?? timing.ms : 0;
  const clock = useMotionDemo(Math.min(3, ms / 1000 + HOLD));

  if (!card) {
    const right = game.cards.filter(c => durationVerdict(values[c.id] ?? timingOf(c.visual ?? '').ms, c.lane as DurationBand) === 'right').length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Every transition timed" title={`${right} of ${game.cards.length} in the right band`}>
          A press under 100 ms, small things up to 200, sheets and lists up to 400, and only a whole screen past that.
        </StageTitle>
        <div className="w-full rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset">
          <svg viewBox="-20 -30 680 74" className="w-full" role="img" aria-label="Every tuned duration on the ruler">
            <BandRuler x={0} y={0} w={640} />
            {game.cards.map(c => {
              const v = values[c.id] ?? timingOf(c.visual ?? '').ms, good = durationVerdict(v, c.lane as DurationBand) === 'right';
              return <circle key={c.id} cx={(Math.min(v, RULER_MAX) / RULER_MAX) * 640} cy={8} r={5} fill={good ? 'var(--color-text-primary)' : 'var(--color-fg-error-primary)'} stroke="var(--color-bg-primary)" strokeWidth={2} />;
            })}
          </svg>
        </div>
        <ul className="grid w-full gap-1 text-left text-sm">
          {game.cards.map(c => {
            const first = timingOf(c.visual ?? '').ms, v = values[c.id] ?? first;
            return (
              <li key={c.id} className="flex justify-between gap-3 rounded-xl bg-secondary px-3 py-2">
                <span className="text-primary">{c.label}</span>
                <span className="shrink-0 font-semibold text-tertiary tabular-nums"><s>{first}</s> → <span className={durationVerdict(v, c.lane as DurationBand) === 'right' ? 'text-primary' : 'text-error-primary'}>{v} ms</span></span>
              </li>
            );
          })}
        </ul>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>The more often a motion plays and the smaller it is, the shorter it should be. Exits are always quicker than entrances.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: durationVerdict(values[c.id] ?? timingOf(c.visual ?? '').ms, c.lane as DurationBand) === 'right' })))}>Continue the story</Button>
      </div>
    );
  }

  const done = !!locked[card.id];
  const band = card.lane as DurationBand;
  const verdict = durationVerdict(ms, band);
  const ok = verdict === 'right';
  const target = DURATION_BANDS.find(b => b.id === band)!;
  const lock = () => { play(ok ? 'correct' : 'wrong'); setLocked(l => ({ ...l, [card.id]: true })); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The transition</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={done && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('flex items-baseline justify-between gap-4 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !done ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <span className="text-lg font-semibold text-primary">{card.label}</span>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">shipped at {timing.ms} ms</span>
      </motion.div>
      <div className="grid items-center gap-4 sm:grid-cols-[2fr_3fr]">
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-secondary p-3">
          <Preview kind={timing.kind} ms={ms} t={clock.t} still={clock.still} caption={`At ${ms} ms, real speed`} />
          {clock.reduce && <Button size="sm" color="secondary" iconLeading={<PlayIcon data-icon weight="bold" />} onPress={clock.play}>Play once</Button>}
        </div>
        <div className="flex flex-col gap-4">
          <Tune label="Duration" value={ms} min={0} max={RULER_MAX} step={10} ok={done && ok} fmt={v => `${v} ms`} onChange={v => { if (!done) setValues(s => ({ ...s, [card.id]: v })); }} />
          <div className="rounded-2xl bg-primary px-2 pt-3 ring-1 ring-secondary ring-inset">
            <svg viewBox="-20 -30 680 74" className="w-full" role="img" aria-label={done ? `${ms} ms; it needs ${BAND_NAME[band]}, ${target.min} to ${target.max} ms` : `${ms} ms on the duration ruler`}>
              <BandRuler x={0} y={0} w={640} marker={ms} lit={done ? band : undefined} />
            </svg>
          </div>
        </div>
      </div>
      {!done && <div className="flex justify-end"><Button size="lg" onPress={lock}>Lock it in</Button></div>}
      {done && (
        <>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{BAND_NAME[band]}: {target.min}–{target.max} ms.</span>{' '}
            {!ok && <>{verdict === 'slow' ? 'Yours makes people wait. ' : 'Yours is over before anyone sees it. '}</>}
            {card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next transition' : 'See the ruler'}</Button></div>
        </>
      )}
    </div>
  );
}
