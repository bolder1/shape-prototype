'use client';
// Mini-game for rs.6-3: review the research plans Musafir's squads send in. Every card is a plan (its `visual`, a key
// of `MUSAFIR_PLANS`), drawn as a form: who is running it, the plan, the method and what rides on it. Choose its
// support: go ahead, review first, researcher leads, or stop (`SUPPORT`, scored by `support`). A right call puts the
// red pen on the line that decided it (`decidingLine`) with a margin note; the end totals the researcher hours the
// program spent (`researcherHours`) against running every study themselves (`FULL_STUDY_HOURS`). A miss explains and
// the card comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { FULL_STUDY_HOURS, MUSAFIR_PLANS, decidingLine, researcherHours, support, type Episode, type MusafirPlan, type PlanLine, type Support } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { SUPPORT_LABEL, SUPPORT_TONE } from '../scenes/ResearchGuardrails';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const METHOD = { evaluative: 'Usability test or observation', generative: 'Interviews', survey: 'Survey' } as const;
const STAKES = { low: 'Easy to change afterwards', high: 'A launch, money or a big bet' } as const;
/** The red pen's margin note for the line that decided it. */
const PEN: Record<Exclude<PlanLine, 'none'>, string> = {
  data: 'Breaks consent or data rules',
  people: 'Participants could be hurt or exposed',
  method: 'Easy to lead or mis-sample: check it',
  stakes: 'Too much rides on it to skip a check',
};

function Line({ label, children, pen }: { label: string; children: React.ReactNode; pen?: string }) {
  return (
    <div className="relative flex flex-col gap-0.5">
      <dt className="text-xs font-semibold text-tertiary">{label}</dt>
      <dd className="relative text-md text-primary">
        <span className="relative">
          {children}
          {pen && (
            <motion.svg initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-none absolute -inset-x-2 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+1rem)] overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden>
              <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} d="M3 10 C3 1 97 1 97 10 C97 19 3 19 4 9" fill="none" stroke="var(--color-fg-error-primary)" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
            </motion.svg>
          )}
        </span>
      </dd>
      {pen && <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop} className="text-sm font-semibold text-error-primary italic">{pen}</motion.span>}
    </div>
  );
}

export function PlanCritique({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [decided, setDecided] = useState<MusafirPlan[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const calls = decided.map(k => support(MUSAFIR_PLANS[k]));
    const hours = researcherHours(calls);
    const full = decided.length * FULL_STUDY_HOURS;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Reviews done" title={`${n} of ${game.cards.length} called first time`}>
          {calls.filter(c => c === 'go').length} plans go ahead, {calls.filter(c => c === 'review').length} after a review, {calls.filter(c => c === 'partner').length} with a researcher leading, and {calls.filter(c => c === 'stop').length} stopped.
        </StageTitle>
        <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-4" role="img" aria-label={`Researcher hours: ${hours} with the program, against ${full} if researchers ran every study`}>
          {[{ label: 'With the program', value: hours, tone: SUPPORT_TONE.go }, { label: 'If researchers ran every one', value: full, tone: SUPPORT_TONE.partner }].map(b => (
            <div key={b.label} className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-secondary">{b.label}: <span className="tabular-nums">{b.value}</span> researcher hours</span>
              <motion.span initial={{ width: 0 }} animate={{ width: `${(b.value / full) * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-3 rounded-full" style={{ background: b.tone }} />
            </div>
          ))}
        </div>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Ask in order. Does it break consent or data rules? Stop. Could anyone be hurt by taking part, or is it a big open question? A researcher leads. Is it anything but a low-stakes test of your own design? Review first. Otherwise, go.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as MusafirPlan;
  const pl = MUSAFIR_PLANS[k];
  const lane = support(pl);
  const line = decidingLine(pl);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const pen = (l: PlanLine) => (right && line === l && l !== 'none' ? PEN[l] : undefined);
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setDecided(ds => [...ds, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Plans in the review queue</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0, rotate: 1 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1, rotate: 0 } : { y: 0, opacity: 1, rotate: 0 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-4 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Research plan</span>
          {right && (
            <motion.span initial={{ scale: 1.5, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: -4 }} transition={springs.pop}
              className="rounded-md border-2 bg-primary px-2 py-0.5 text-xs font-bold text-primary" style={{ borderColor: SUPPORT_TONE[lane] }}>{SUPPORT_LABEL[lane]}</motion.span>
          )}
        </div>
        <dl className="flex flex-col gap-3">
          <Line label="Who’s running it">{pl.who}</Line>
          <Line label="The plan" pen={pen('people') ?? pen('data')}>{card.label}</Line>
          <Line label="Method" pen={pen('method')}>{METHOD[pl.method]}</Line>
          <Line label="What rides on it" pen={pen('stakes')}>{STAKES[pl.stakes]}</Line>
          {right && line === 'data' && pl.breach && <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary">{pl.breach}.</p>}
        </dl>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Support it gets">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: SUPPORT_TONE[l.id as Support] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next plan' : 'See the totals'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Read the plan for consent and data first, then for who could be hurt. Then ask what kind of study it is, and what rides on it.</NibSays>}
      </div>
    </div>
  );
}
