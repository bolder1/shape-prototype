'use client';
// Mini-game for fd.2-3: feel each law before naming it. Three quick experiments time YOU:
//   Fitts: tiny far target vs big near one · Hick: pick from 9 vs 3 · Jakob: find a cart in the wrong vs usual corner.
// The experiments are for insight (not scored); the classify round that follows is.
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCartIcon, TimerIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { NibSays, StageTitle } from '../kit';
import { Classify } from './Classify';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Exp = 'fitts' | 'hick' | 'jakob';
const EXPS: { id: Exp; law: string; ask: [string, string]; labels: [string, string]; lesson: string }[] = [
  { id: 'fitts', law: 'Fitts’s law', ask: ['Tap Start, then hit the target as fast as you can.', 'Again: Start, then the target.'], labels: ['Tiny and far', 'Big and close'], lesson: 'Bigger, closer targets are faster. Make important buttons large and near the thumb.' },
  { id: 'hick', law: 'Hick’s law', ask: ['Find and tap the Mint plan.', 'Again: find the Mint plan.'], labels: ['9 choices', '3 choices'], lesson: 'Every extra option slows the decision. Cut, group or stage choices.' },
  { id: 'jakob', law: 'Jakob’s law', ask: ['Find the cart and tap it.', 'Again: find the cart.'], labels: ['Unusual spot', 'Where you expect it'], lesson: 'People look where other apps taught them to. Familiar placement is fast.' },
];
const PLANS9 = ['Basic', 'Lite', 'Plus', 'Pro', 'Team', 'Max', 'Mint', 'Go', 'Ultra'];
const PLANS3 = ['Basic', 'Mint', 'Team'];

function Bars({ a, b, labels }: { a: number; b: number; labels: [string, string] }) {
  const max = Math.max(a, b, 1);
  return (
    <div className="flex flex-col gap-2">
      {[a, b].map((v, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <span className="w-36 font-semibold text-secondary">{labels[i]}</span>
          <span className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
            <motion.span className={cx('block h-full rounded-full', i ? 'bg-mint-600' : 'bg-error-solid')} initial={{ width: 0 }} animate={{ width: `${(v / max) * 100}%` }} transition={springs.gentle} />
          </span>
          <span className="w-16 text-right font-bold text-primary tabular-nums">{(v / 1000).toFixed(2)} s</span>
        </div>
      ))}
    </div>
  );
}

/** One experiment: two timed trials (the hard version, then the easy one). */
function Experiment({ exp, onDone }: { exp: (typeof EXPS)[number]; onDone: () => void }) {
  const [trial, setTrial] = useState<0 | 1 | 2>(0);   // 2 = results
  const [armed, setArmed] = useState(exp.id !== 'fitts');   // Fitts needs a Start tap first
  const [times, setTimes] = useState<number[]>([]);
  const started = useRef(0);
  // Each trial's clock starts when it appears (Fitts restarts it again on Start).
  useEffect(() => { started.current = performance.now(); }, [trial]);
  const start = () => { started.current = performance.now(); setArmed(true); };
  const hit = () => {
    play('pop');
    setTimes(t => [...t, performance.now() - started.current]);
    if (trial === 0) { setTrial(1); setArmed(exp.id !== 'fitts'); } else setTrial(2);
  };
  const easy = trial === 1;

  if (trial === 2) {
    const faster = times[0] / Math.max(1, times[1]);
    return (
      <div className="flex flex-col gap-4">
        <Bars a={times[0]} b={times[1]} labels={exp.labels} />
        <NibSays mood="cheer">{faster > 1.05 ? `${faster.toFixed(1)}× faster the easy way. ` : 'Close call this time, but over thousands of taps it adds up. '}{exp.lesson}</NibSays>
        <div className="flex justify-end"><Button size="lg" onPress={onDone}>Next</Button></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-md font-semibold text-primary"><TimerIcon className="size-5 text-mint-600" weight="bold" />{exp.ask[trial]}</p>
      <div className="relative h-80 overflow-hidden rounded-2xl bg-secondary ring-1 ring-secondary ring-inset">
        {exp.id === 'fitts' && (
          <>
            {!armed && <button type="button" onClick={start} className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-solid px-6 py-3 font-bold text-white">Start</button>}
            {armed && (
              <motion.button type="button" aria-label="Target" onClick={hit} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springs.pop}
                className="absolute rounded-full bg-error-solid"
                style={easy ? { width: 96, height: 96, left: 'calc(50% - 48px)', bottom: 24 } : { width: 18, height: 18, right: 14, top: 14 }} />
            )}
          </>
        )}
        {exp.id === 'hick' && (
          <div key={trial} className={cx('grid h-full gap-2 p-3', easy ? 'grid-cols-3' : 'grid-cols-3 grid-rows-3')}>
            {(easy ? PLANS3 : PLANS9).map(name => (
              <button key={name} type="button" aria-label={`${name} plan`} onClick={() => name === 'Mint' && hit()}
                className="rounded-xl bg-primary text-md font-bold text-primary ring-1 ring-secondary ring-inset hover:bg-primary_hover">{name}</button>
            ))}
          </div>
        )}
        {exp.id === 'jakob' && (
          <div key={trial} className="relative h-full p-3">
            <div className="mb-3 h-10 rounded-lg bg-primary ring-1 ring-secondary ring-inset" />
            <div className="grid grid-cols-4 gap-2">{Array.from({ length: 8 }, (_, i) => <div key={i} className="h-20 rounded-lg bg-primary ring-1 ring-secondary ring-inset" />)}</div>
            <button type="button" aria-label="Cart" onClick={hit} className="absolute grid size-9 place-items-center rounded-full bg-tertiary text-fg-secondary"
              style={easy ? { right: 20, top: 16 } : { left: 14, bottom: 14 }}>
              <ShoppingCartIcon className="size-5" weight="bold" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LawLab({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [step, setStep] = useState(0);   // 0–2 experiments, 3 = classify
  const exp = EXPS[step];
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={step < 3 ? `Play · experiment ${step + 1} of 3` : 'Play · name the law'} title={step < 3 ? exp.law : game.title}>
        {step < 3 ? 'Not scored. Just feel it.' : 'Now you’ve felt them. Which law is behind each problem?'}
      </StageTitle>
      {step < 3 ? <Experiment key={exp.id} exp={exp} onDone={() => setStep(s => s + 1)} /> : <Classify game={game} title="Which law?" onDone={onDone} />}
    </div>
  );
}
