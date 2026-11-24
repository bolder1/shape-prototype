'use client';
// Mini-game for gr.3-2: each card is a test Tokri wants to run (its `visual`, a key of `TOKRI_PLANS`). Read the plan
// (baseline, smallest lift worth finding, people a day, versions, share of traffic), optionally ask Nib for the Lehr's
// rule figure a version, and estimate on a dial how many whole weeks it needs. Locking it in works the sum out with
// `planTest` (the exact sample a version, the total, the days, the weeks) and stamps the verdict, `planVerdict`. An
// estimate `weeksGrade` doesn't call off scores; hints don't cost anything.
import { useState } from 'react';
import { motion } from 'motion/react';
import { LightbulbIcon } from '@phosphor-icons/react/ssr';
import { TOKRI_PLANS, WEEKS_MAX, lehr, planTest, weeksGrade, type Episode, type PlanVerdict, type TokriPlan } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { Burst, NibSays, StageTitle } from '../kit';
import { Tune } from './MeasureTune';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const GRADE: Record<ReturnType<typeof weeksGrade>, string> = { spot: 'Spot on', close: 'Close', off: 'Off' };
/** One fill per verdict; white text on each passes 4.5:1. */
const VERDICT_FILL: Record<PlanVerdict, string> = { go: '#067647', long: '#B54708', rethink: '#B42318' };
const n = (x: number) => x.toLocaleString('en-IN');
const pct = (x: number) => `${+(x * 100).toFixed(2)}%`;
const wk = (w: number) => `${w >= WEEKS_MAX ? `${WEEKS_MAX}+` : w} week${w === 1 ? '' : 's'}`;

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-secondary px-3 py-2">
      <dt className="text-xs font-semibold text-tertiary">{k}</dt>
      <dd className="text-md font-semibold text-primary tabular-nums">{v}</dd>
    </div>
  );
}

export function SampleDial({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck] = useState(game.cards);
  const [i, setI] = useState(0);
  const [grades, setGrades] = useState<Record<string, ReturnType<typeof weeksGrade>>>({});
  const [guess, setGuess] = useState(4);
  const [hint, setHint] = useState(false);
  const [locked, setLocked] = useState(false);
  const card = deck[i];

  if (!card) {
    const near = Object.values(grades).filter(g => g !== 'off').length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Tokri’s test calendar" title={`${near} of ${game.cards.length} estimates close`}>
          The sample comes from the baseline and the smallest lift worth finding; the calendar comes from traffic. Halve the lift and you need four times the people.
        </StageTitle>
        <NibSays mood={near >= game.cards.length - 2 ? 'cheer' : 'idle'}>Before you plan a test, do Lehr’s rule on a napkin: 16 × p × (1 − p) ÷ (the change, in points)². If the answer is in lakhs and your traffic is in thousands, test something bolder.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: grades[c.id] !== undefined && grades[c.id] !== 'off' })))}>Continue the story</Button>
      </div>
    );
  }

  const plan = TOKRI_PLANS[card.visual as TokriPlan];
  const share = 'share' in plan ? plan.share : 1;
  const r = planTest(plan), verdict = card.lane as PlanVerdict, lane = game.lanes.find(l => l.id === verdict)!;
  const rough = lehr(plan.base, plan.base * plan.lift);
  const grade = grades[card.id];

  const lock = () => {
    const g = weeksGrade(guess, r.weeks);
    play(g === 'off' ? 'wrong' : 'correct');
    setGrades(x => ({ ...x, [card.id]: g }));
    setLocked(true);
  };
  const next = () => { setI(x => x + 1); setLocked(false); setHint(false); setGuess(4); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{plan.metric}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springs.pop}
        className="flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-secondary ring-inset" data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Fact k="Baseline" v={pct(plan.base)} />
          <Fact k="Smallest lift worth finding" v={`+${Math.round(plan.lift * 100)}%, to ${pct(r.target)}`} />
          <Fact k="People a day" v={n(plan.daily)} />
          <Fact k="Versions" v={plan.arms === 2 ? '2 (A and B)' : `${plan.arms} (control + ${plan.arms - 1})`} />
          <Fact k="Share in the test" v={`${Math.round(share * 100)}%`} />
          <Fact k="Significance · power" v={plan.arms > 2 ? `5% ÷ ${plan.arms - 1} · 80%` : '5% · 80%'} />
        </dl>
      </motion.div>

      <div className="flex flex-col gap-4 rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
        <Tune label="Your estimate" value={guess} min={1} max={WEEKS_MAX} step={1} ok={locked && grade !== 'off'} fmt={wk} onChange={v => { if (!locked) setGuess(v); }} />
        {!locked ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            {hint
              ? <span className="text-sm text-secondary">Lehr’s rule: 16 × {plan.base} × {+(1 - plan.base).toFixed(3)} ÷ {+(plan.base * plan.lift).toFixed(4)}² ≈ <strong className="text-primary">{n(rough)}</strong> a version{plan.arms > 2 ? ', a bit more with the stricter threshold' : ''}.</span>
              : <Button size="md" color="secondary" iconLeading={LightbulbIcon} onPress={() => { play('tap'); setHint(true); }}>Ask Nib for Lehr’s rule</Button>}
            <Button size="lg" onPress={lock}>Lock it in</Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex flex-col gap-3">
            <ol className="flex flex-col gap-1 text-sm text-secondary tabular-nums">
              <li><span className="font-semibold text-primary">{n(r.n)}</span> people a version, at {plan.arms > 2 ? `α = 5% ÷ ${plan.arms - 1}` : '5% significance'} and 80% power</li>
              <li>× {plan.arms} versions = <span className="font-semibold text-primary">{n(r.total)}</span> people</li>
              <li>÷ {n(plan.daily * share)} a day = <span className="font-semibold text-primary">{r.days.toFixed(1)} days</span>, so <span className="font-semibold text-primary">{wk(r.weeks)}</span> in whole weeks</li>
            </ol>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: VERDICT_FILL[verdict] }}>{lane.label}</span>
              <span className="text-sm text-secondary"><span className="font-semibold text-primary">{GRADE[grade]}:</span> you said {wk(guess)}.</span>
            </div>
            <NibSays mood={grade === 'off' ? 'think' : 'cheer'}>{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{i < deck.length - 1 ? 'Next test' : 'See the calendar'}</Button></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
