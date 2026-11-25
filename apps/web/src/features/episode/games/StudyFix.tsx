'use client';
// Mini-game for ax.3-1: fix Hazri's plan for sessions with disabled participants. Every card is a choice in the plan
// (its `visual`, a key of `HAZRI_CHOICES`), shown at its stage of the study (`STUDY_STEPS`). Call it sound, or name its
// worst problem: it harms people, shuts them out, or skews the evidence (`STUDY_FLAWS`, scored by `studyFlaw`). Right
// calls write the choice, or its `fix`, into the plan under its stage, and the study's flow fills in. First call
// scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HAZRI_CHOICES, STUDY_STEPS, STUDY_STEP_LABEL, studyFlaw, type Episode, type HazriChoice, type StudyFlaw } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FLAW_FILL } from '../scenes/StudySession';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const LABEL: Record<StudyFlaw, string> = { sound: 'Sound', harms: 'Harms', excludes: 'Shuts out', skews: 'Skews' };

export function StudyFix({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [called, setCalled] = useState<HazriChoice[]>([]);
  const [miss, setMiss] = useState<StudyFlaw | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const keys = game.cards.map(c => c.visual as HazriChoice);

  const plan = (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">The study plan</span>
      <ol className="flex flex-col gap-2">
        {STUDY_STEPS.map((s, i) => {
          const inStep = keys.filter(k => HAZRI_CHOICES[k].step === s);
          const done = inStep.filter(k => called.includes(k));
          const complete = done.length === inStep.length;
          return (
            <li key={s} className="flex flex-col gap-1.5 rounded-xl bg-primary px-3 py-2">
              <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-bold text-primary">
                  <span className={cx('flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold', complete ? 'text-white' : 'bg-secondary text-tertiary')} style={complete ? { background: FLAW_FILL.sound } : undefined}>{i + 1}</span>
                  {STUDY_STEP_LABEL[s]}
                </span>
                <span className="text-xs font-semibold text-tertiary tabular-nums">{done.length} / {inStep.length} checked</span>
              </span>
              {done.map(k => {
                const c = HAZRI_CHOICES[k];
                const f = studyFlaw(c);
                return (
                  <motion.span key={k} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
                    className="pl-3 text-sm text-secondary" style={{ boxShadow: `inset 3px 0 0 ${FLAW_FILL[f]}` }}>
                    {c.fix ?? c.text}
                  </motion.span>
                );
              })}
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
        <StageTitle eyebrow="Plan fixed" title={`${n} of ${game.cards.length} right first time`}>
          Fair pay and private recordings, a study everyone can take part in, and sessions that show how people really work.
        </StageTitle>
        {plan}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Run it every month, not once. A standing panel finds barriers before customers do.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as HazriChoice;
  const choice = HAZRI_CHOICES[k];
  const lane = studyFlaw(choice);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setCalled(cs => [...cs, k]); }
    else { setMiss(laneId as StudyFlaw); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Sessions with disabled participants</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Stage {STUDY_STEPS.indexOf(choice.step) + 1} · {STUDY_STEP_LABEL[choice.step]}</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${FLAW_FILL[lane]}` }}>
            {choice.fix ? `The plan now says: ${choice.fix}` : 'Stays in the plan as it is.'}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What is wrong with this choice">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: FLAW_FILL[l.id as StudyFlaw] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not {LABEL[miss].toLowerCase()}: this one is <strong>{LABEL[lane].toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next choice' : 'See the plan'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Worst first: does it harm the person? Can they take part as planned? Will it show how they really work?</NibSays>}
      </div>
      {plan}
    </div>
  );
}
