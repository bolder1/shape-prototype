'use client';
// Mini-game for ds.2-2: each card is one of Rasta's semantic colours (`visual`, a key of MODE_SPECS). It starts at its
// light-mode step on the dark pass screen; a slider runs along its ramp, with the contrast against what it sits on (or
// carries) shown live and the lane's rule under it. Set it, and `darkCheck` scores the pick against the token's band.
// The rest of the screen uses the picks so far and Rasta's own dark values. The end shows light and dark side by side.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { darkCheck, MODE_SPECS, rampHex, rampSteps, type Episode, type ModeToken } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { modeColours, NIGHT_H, NIGHT_W, NightPass, type ModeColours } from '../scenes/ModeSwap';
import { Tune } from './MeasureTune';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Phone({ c, focus, label }: { c: ModeColours; focus?: ModeToken; label: string }) {
  return (
    <svg viewBox={`-6 -6 ${NIGHT_W + 12} ${NIGHT_H + 12}`} className="w-full" role="img" aria-label={label}>
      <NightPass c={c} focus={focus} />
    </svg>
  );
}

export function ModeTune({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const card = game.cards[i];
  const token = card?.visual as ModeToken | undefined;
  const spec = token ? MODE_SPECS[token] : undefined;
  const steps = spec ? rampSteps(spec.ramp) : [];
  const [idx, setIdx] = useState(() => (spec ? steps.indexOf(spec.light) : 0));
  const set = token ? picks[token] : undefined;

  /** The dark screen: Rasta's dark values, the learner's picks so far, and the token being tuned at `step`. */
  const night = (step?: number) => {
    const over: Partial<ModeColours> = {};
    for (const c of game.cards) {
      const k = c.visual as ModeToken, s = k === token && step !== undefined ? step : picks[k];
      if (s !== undefined) over[k] = rampHex(MODE_SPECS[k].ramp, s);
    }
    return modeColours('dark', over);
  };

  if (!card || !token || !spec) {
    const right = game.cards.filter(c => darkCheck(c.visual as ModeToken, picks[c.visual!]).ok).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Night mode set" title={`${right} of ${game.cards.length} colours do their job at night`}>
          Same names, same components, a second column of values. Each one measured against what it sits on.
        </StageTitle>
        <div className="grid w-full max-w-md grid-cols-2 gap-3 rounded-2xl bg-secondary p-3">
          <div className="flex flex-col gap-1"><Phone c={modeColours('light')} label="Rasta’s pass screen in light mode" /><span className="text-xs font-semibold text-tertiary">Light</span></div>
          <div className="flex flex-col gap-1"><Phone c={night()} label="Rasta’s pass screen in your dark mode" /><span className="text-xs font-semibold text-tertiary">Your dark</span></div>
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Dark mode isn’t the light mode flipped. The page went dark grey, the card a step lighter, the text off-white, and every accent a step or two lighter.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: darkCheck(c.visual as ModeToken, picks[c.visual!]).ok })))}>Continue the story</Button>
      </div>
    );
  }

  const step = set ?? steps[idx], check = darkCheck(token, step), lane = game.lanes.find(l => l.id === card.lane)!;
  const what = spec.against === 'page' ? 'on the dark page' : 'with body text on it';
  const lock = () => { play(check.ok ? 'correct' : 'wrong'); setPicks(p => ({ ...p, [token]: step })); };
  const next = () => {
    const n = game.cards[i + 1]?.visual as ModeToken | undefined;
    if (n) setIdx(rampSteps(MODE_SPECS[n].ramp).indexOf(MODE_SPECS[n].light));
    setI(k => k + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play · tune" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{lane.label}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={set !== undefined && !check.ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', set === undefined ? 'ring-secondary' : check.ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_14rem]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="size-12 shrink-0 rounded-xl ring-1 ring-secondary ring-inset" style={{ background: check.hex }} />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-semibold text-primary">{spec.ramp}-{step}</span>
              <span className="text-sm text-tertiary">{check.ratio.toFixed(1)}:1 {what}</span>
            </div>
          </div>
          {set === undefined ? (
            <Tune label="Dark-mode value" value={idx} min={0} max={steps.length - 1} step={1} ok={check.ok} fmt={k => `${spec.ramp}-${steps[k]}`} onChange={k => { play('tap'); setIdx(k); }} />
          ) : (
            <p className="text-sm text-tertiary">Rasta uses <span className="font-mono font-semibold text-primary">{spec.ramp}-{spec.dark}</span>. The band: {spec.min}:1 to {spec.max === 21 ? 'the darkest step' : `${spec.max}:1`} {what}.</p>
          )}
          <p className="rounded-xl bg-secondary px-3 py-2 text-sm text-secondary"><span className="font-semibold text-primary">{lane.label}:</span> {lane.hint}</p>
        </div>
        <div className="mx-auto w-48 rounded-2xl bg-secondary p-2 sm:w-full"><Phone c={night(step)} focus={token} label={`Rasta’s pass screen in dark mode, with ${token} at ${spec.ramp}-${step}`} /></div>
      </div>
      {set === undefined ? (
        <div className="flex justify-end"><Button size="lg" onPress={lock}>Set it</Button></div>
      ) : (
        <>
          <NibSays mood={check.ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{check.ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{check.ok ? 'Does its job at night.' : check.low ? 'Not enough contrast.' : 'Too much contrast.'}</span>{' '}{card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={next}>{i + 1 < game.cards.length ? 'Next colour' : 'See both modes'}</Button></div>
        </>
      )}
    </div>
  );
}
