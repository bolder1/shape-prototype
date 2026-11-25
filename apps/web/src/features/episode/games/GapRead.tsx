'use client';
// Mini-game for rs.5-2: Read the gap. Each card is a gap from Bolo's research (its `visual`, a key of `BOLO_GAPS`):
// two shares, from two separate groups or as a lead within one sample. Estimate its ± margin on a dial (graded by
// `marginGrade`; Nib's hint gives the √n rule of thumb from `moe`), then see the 95% interval (`gapInterval`) drawn
// against zero and the band of gaps too small to matter, and call it (`GAP_CALLS`, scored by `gapCall`). The call
// scores; the estimate is tallied at the end.
import { useState } from 'react';
import { motion } from 'motion/react';
import { LightbulbIcon } from '@phosphor-icons/react/ssr';
import { BOLO_GAPS, MARGIN_MAX, gapCall, gapInterval, marginGrade, moe, type BoloGap, type Episode, type GapCall, type GapRead as Gap } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { Tune } from './MeasureTune';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Grade = ReturnType<typeof marginGrade>;
const GRADE: Record<Grade, string> = { spot: 'Spot on', close: 'Close', off: 'Off' };
/** One fill per call; white text on each passes 4.5:1. */
export const GAP_FILL: Record<GapCall, string> = { real: '#067647', small: 'var(--color-family-design-solid)', none: 'var(--color-family-discover-solid)', unclear: '#B42318' };
const pts = (x: number, d = 1) => `${x > 0 ? '+' : x < 0 ? '−' : ''}${Math.abs(x * 100).toFixed(d)}`;
const pc = (a: { n: number; x: number }) => `${Math.round((a.x / a.n) * 100)}%`;
const n = (x: number) => x.toLocaleString('en-IN');

/** The rule-of-thumb margin, in points, from the worst case (p = 0.5). */
const rough = (g: Gap) => (g.kind === 'lead' ? 2 * moe(g.a.n) : Math.hypot(moe(g.a.n), moe(g.b.n))) * 100;

/** The interval on a number line, with zero and the band of gaps too small to matter. */
export function IntervalBar({ g, reveal }: { g: Gap; reveal: boolean }) {
  const { diff, lo, hi } = gapInterval(g);
  const R = Math.ceil((Math.max(Math.abs(lo), Math.abs(hi), g.matters) * 100 * 1.15) / 5) * 5 / 100;
  const W = 600, x = (v: number) => 20 + ((v + R) / (2 * R)) * (W - 40);
  const ticks = Array.from({ length: Math.round((2 * R * 100) / 5) + 1 }, (_, i) => -R + i * 0.05).filter((_, i, a) => a.length <= 13 || i % 2 === 0);
  return (
    <svg viewBox={`0 0 ${W} 110`} className="w-full" role="img" aria-label={`The gap is ${pts(diff)} points, with a 95% interval from ${pts(lo)} to ${pts(hi)}. Gaps smaller than ${Math.round(g.matters * 100)} points either way wouldn't change the decision.`}>
      <rect x={x(-g.matters)} y={18} width={x(g.matters) - x(-g.matters)} height={54} rx={6} fill="var(--color-bg-secondary)" />
      <text x={(x(-g.matters) + x(g.matters)) / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--color-text-tertiary)">too small to matter (±{Math.round(g.matters * 100)})</text>
      <line x1={20} x2={W - 20} y1={78} y2={78} stroke="var(--color-border-primary)" strokeWidth={1.5} />
      {ticks.map(v => <g key={v.toFixed(3)}><line x1={x(v)} x2={x(v)} y1={74} y2={82} stroke="var(--color-border-primary)" /><text x={x(v)} y={98} textAnchor="middle" fontSize={11} fill="var(--color-text-tertiary)">{Math.round(v * 100)}</text></g>)}
      <line x1={x(0)} x2={x(0)} y1={18} y2={78} stroke="var(--color-text-primary)" strokeWidth={2} strokeDasharray="4 3" />
      {reveal && (
        <motion.g initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={springs.pop} style={{ transformOrigin: `${x(diff)}px 45px` }}>
          <line x1={x(lo)} x2={x(hi)} y1={45} y2={45} stroke="var(--color-bg-brand-solid)" strokeWidth={8} strokeLinecap="round" />
          <circle cx={x(diff)} cy={45} r={9} fill="var(--color-bg-primary)" stroke="var(--color-bg-brand-solid)" strokeWidth={4} />
        </motion.g>
      )}
    </svg>
  );
}

export function GapRead({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [guess, setGuess] = useState(5);
  const [hint, setHint] = useState(false);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [picked, setPicked] = useState<GapCall | null>(null);
  const [log, setLog] = useState<Record<string, { grade: Grade; right: boolean }>>({});
  const card = game.cards[i];

  if (!card) {
    const right = Object.values(log).filter(l => l.right).length, near = Object.values(log).filter(l => l.grade !== 'off').length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Gaps read" title={`${right} of ${game.cards.length} called right`}>
          {near} of your margin estimates were close. A share from n people wobbles about ±1/√n; a gap between two groups combines both wobbles; a lead within one sample wobbles about twice as much as one share.
        </StageTitle>
        <NibSays mood={right >= game.cards.length - 1 ? 'cheer' : 'idle'}>Only “unclear” needs more people. “Too small” and “no gap worth having” are answers: the first says stop, the second says stop arguing.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!log[c.id]?.right })))}>Continue the story</Button>
      </div>
    );
  }

  const g = BOLO_GAPS[card.visual as BoloGap];
  const iv = gapInterval(g), truth = Math.round(iv.half * 1000) / 10;
  const call = gapCall(g), lane = game.lanes.find(l => l.id === call)!;
  const lock = () => { const gr = marginGrade(guess, truth); play(gr === 'off' ? 'wrong' : 'tap'); setGrade(gr); };
  const choose = (c: GapCall) => {
    if (picked || !grade) return;
    const ok = c === call;
    play(ok ? 'correct' : 'wrong');
    setPicked(c);
    setLog(l => ({ ...l, [card.id]: { grade, right: ok } }));
  };
  const next = () => { setI(x => x + 1); setGuess(5); setHint(false); setGrade(null); setPicked(null); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{g.kind === 'lead' ? `One sample of ${n(g.a.n)}` : 'Two separate groups'}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springs.pop}
        className="flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-secondary ring-inset" data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <dl className="grid grid-cols-2 gap-2">
          {[g.a, g.b].map(arm => (
            <div key={arm.label} className="rounded-xl bg-secondary px-3 py-2">
              <dt className="text-xs font-semibold text-tertiary">{arm.label}</dt>
              <dd className="text-md font-semibold text-primary tabular-nums">{pc(arm)} <span className="text-sm font-medium text-tertiary">({n(arm.x)} of {n(arm.n)})</span></dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-secondary">Gap: <strong className="text-primary tabular-nums">{pts(iv.diff)} points</strong> ({g.b.label} − {g.a.label}). It changes the decision only if it’s at least {Math.round(g.matters * 100)} points.</p>
        <IntervalBar g={g} reveal={!!grade} />
      </motion.div>

      <div className="flex flex-col gap-4 rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
        {!grade ? (
          <>
            <Tune label="Your estimate of the margin on the gap" value={guess} min={1} max={MARGIN_MAX} step={0.5} ok={false} fmt={v => `± ${v} points`} onChange={setGuess} />
            <div className="flex flex-wrap items-center justify-between gap-3">
              {hint
                ? <span className="text-sm text-secondary">{g.kind === 'lead'
                  ? <>One share from {n(g.a.n)}: about ±{(moe(g.a.n) * 100).toFixed(1)}. A lead in one sample: roughly double, <strong className="text-primary">±{rough(g).toFixed(1)}</strong>.</>
                  : <>±{(moe(g.a.n) * 100).toFixed(1)} and ±{(moe(g.b.n) * 100).toFixed(1)} for the two groups. Combined: √(a² + b²) ≈ <strong className="text-primary">±{rough(g).toFixed(1)}</strong>.</>}</span>
                : <Button size="md" color="secondary" iconLeading={LightbulbIcon} onPress={() => { play('tap'); setHint(true); }}>Ask Nib for the rule of thumb</Button>}
              <Button size="lg" onPress={lock}>Lock it in</Button>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex flex-col gap-3">
            <p className="text-sm text-secondary tabular-nums"><span className="font-semibold text-primary">{GRADE[grade]}:</span> you said ± {guess}; it’s ± {truth}. The 95% interval runs from {pts(iv.lo)} to {pts(iv.hi)} points.</p>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="What the gap means">
              {game.lanes.map(l => (
                <motion.button key={l.id} type="button" onClick={() => choose(l.id as GapCall)} disabled={!!picked} whileTap={{ scale: 0.97 }}
                  className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                    picked && l.id === call ? 'border-mint-600' : picked === l.id ? 'border-error' : 'border-secondary')}>
                  <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: GAP_FILL[l.id as GapCall] }} aria-hidden />{l.label}</span>
                  <span className="text-xs font-medium text-tertiary">{l.hint}</span>
                </motion.button>
              ))}
            </div>
            <div aria-live="polite" className="flex flex-col gap-3">
              {picked && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: GAP_FILL[call] }}>{lane.label}</span>
                  </div>
                  <NibSays mood={picked === call ? 'cheer' : 'think'}>{picked === call ? '' : 'Not quite. '}{card.note}</NibSays>
                  <div className="flex justify-end"><Button size="lg" onPress={next}>{i < game.cards.length - 1 ? 'Next gap' : 'See how you did'}</Button></div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
