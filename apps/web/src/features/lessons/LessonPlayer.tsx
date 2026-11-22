'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowCounterClockwiseIcon, CheckCircleIcon, FireIcon, LightningIcon, TargetIcon, WarningCircleIcon, XIcon } from '@phosphor-icons/react/ssr';
import { grade, initialAnswer, isAnswerReady, type Answer, type Exercise, type Grade } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { ProgressBarBase } from '@/components/base/progress-indicators/progress-indicators';
import { cx } from '@/utils/cx';
import type { StepResult } from '../progress/store';
import { ConceptView, OrderView, PickView, SortView, SpotView, TuneView } from './exercises';
import { play } from '@/lib/sound';

export interface PlayerStep { key: string; exercise: Exercise }
export interface CompletionInfo { xp: number; streak: number; newDay: boolean }

interface Props {
  eyebrow: string;
  steps: PlayerStep[];
  exitHref: string;
  next?: { href: string; label: string };
  /** Heading on the completion screen. */
  doneTitle?: string;
  /** Saves progress; returns what to celebrate. */
  onComplete: (results: StepResult[]) => CompletionInfo;
}

/**
 * Runs a list of exercises: answer → Check → feedback → Continue.
 * A step missed on the first try is queued once more at the end, so the lesson ends on understanding, not on a mistake.
 */
export function LessonPlayer({ eyebrow, steps, exitHref, next, onComplete, doneTitle = "Lesson complete" }: Props) {
  const [queue, setQueue] = useState<PlayerStep[]>(steps);
  const [index, setIndex] = useState(0);
  const step = queue[index];
  const [answer, setAnswer] = useState<Answer>(() => initialAnswer(steps[0].exercise));
  const [result, setResult] = useState<Grade | null>(null);
  const [results, setResults] = useState<Record<string, StepResult>>({});
  const [done, setDone] = useState<CompletionInfo | null>(null);

  const isConcept = step?.exercise.type === 'concept';
  const ready = step ? isAnswerReady(step.exercise, answer) : false;
  const answered = useMemo(() => queue.slice(0, index).length + (result ? 1 : 0), [queue, index, result]);

  const check = useCallback(() => {
    if (!step || isConcept || !ready || result) return;
    const g = grade(step.exercise, answer);
    play(g.correct ? 'correct' : 'wrong');
    setResult(g);
    setResults(prev => {
      const p = prev[step.key];
      // First attempt decides "first try"; later attempts only count.
      return { ...prev, [step.key]: p ? { ...p, attempts: p.attempts + 1 } : { exerciseKey: step.key, firstTry: g.correct, attempts: 1 } };
    });
    if (!g.correct && !results[step.key]) setQueue(q => [...q, step]); // retry once, at the end
  }, [step, isConcept, ready, result, answer, results]);

  const advance = useCallback(() => {
    if (index + 1 >= queue.length) {
      setDone(onComplete(Object.values(results)));
      return;
    }
    const nextStep = queue[index + 1];
    setIndex(index + 1);
    setAnswer(initialAnswer(nextStep.exercise));
    setResult(null);
  }, [index, queue, results, onComplete]);

  // Move focus to the new question: screen readers announce it, and the footer button
  // (which turns from "Continue" into "Check") can't be triggered again by a repeated Enter.
  const stepRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (index > 0) stepRef.current?.focus({ preventScroll: true }); }, [index]);

  // Enter = Check / Continue (when focus isn't inside a text field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLInputElement | null;
      const typing = t?.tagName === 'TEXTAREA' || (t?.tagName === 'INPUT' && !['radio', 'checkbox', 'range', 'button'].includes(t.type));
      // Focused buttons/links already activate on Enter; handling it here too would fire twice.
      const native = t?.tagName === 'BUTTON' || t?.tagName === 'A';
      if (e.key !== 'Enter' || done || typing || native) return;
      e.preventDefault();
      if (isConcept || result) advance(); else check();
    };
    // Capture phase: React Aria stops keyboard events from bubbling, so a bubbling listener never hears Enter.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [isConcept, result, advance, check, done]);

  if (done) return <Completion title={doneTitle} info={done} results={Object.values(results)} exitHref={exitHref} next={next} />;
  if (!step) return null;

  const ex = step.exercise;
  // The answer always matches the exercise type (initialAnswer guarantees it), so the narrowing casts are safe.
  const io = { onChange: setAnswer as never, result };
  const view = (() => {
    switch (ex.type) {
      case 'concept': return <ConceptView exercise={ex} />;
      case 'pick': return <PickView exercise={ex} answer={answer as Extract<Answer, { type: 'pick' }>} {...io} />;
      case 'sort': return <SortView exercise={ex} answer={answer as Extract<Answer, { type: 'sort' }>} {...io} />;
      case 'order': return <OrderView exercise={ex} answer={answer as Extract<Answer, { type: 'order' }>} {...io} />;
      case 'spot': return <SpotView exercise={ex} answer={answer as Extract<Answer, { type: 'spot' }>} {...io} />;
      case 'tune': return <TuneView exercise={ex} answer={answer as Extract<Answer, { type: 'tune' }>} {...io} />;
    }
  })();
  const isRetry = queue.findIndex(s => s.key === step.key) < index;

  return (
    <div className="flex min-h-dvh flex-col bg-primary">
      <header className="sticky top-0 z-10 flex items-center gap-4 bg-primary/95 px-4 py-3 backdrop-blur md:px-6">
        <Link href={exitHref} aria-label="Leave lesson" className="grid size-9 place-items-center rounded-lg text-fg-quaternary hover:bg-primary_hover"><XIcon className="size-5" /></Link>
        <div className="flex-1" role="progressbar" aria-label="Lesson progress" aria-valuenow={answered} aria-valuemax={queue.length}>
          <ProgressBarBase value={(answered / queue.length) * 100} progressClassName="bg-mint-600 transition-all duration-500" />
        </div>
        <span className="hidden text-sm text-tertiary sm:inline">{eyebrow}</span>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-6 pb-48 md:pt-10">
        {/* Enter-only animation: the next step replaces the current one instantly (no waiting on an exit). */}
        <motion.div key={`${step.key}-${index}`} ref={stepRef} tabIndex={-1} className="outline-none"
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
          {isRetry && <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-warning-primary px-2.5 py-0.5 text-xs font-semibold text-warning-primary"><ArrowCounterClockwiseIcon className="size-3.5" weight="bold" />One more try</p>}
          {view}
        </motion.div>
      </main>

      {/* Bottom bar: Check → feedback → Continue */}
      <footer className={cx('fixed inset-x-0 bottom-0 z-20 border-t px-4 py-4 transition-colors md:px-6',
        !result ? 'border-secondary bg-primary' : result.correct ? 'border-mint-200 bg-mint-50' : 'border-[#FEDF89] bg-warning-primary')}>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AnimatePresence>
            {result && !isConcept && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3" role="status">
                {result.correct ? <CheckCircleIcon className="size-7 shrink-0 text-mint-700" weight="fill" /> : <WarningCircleIcon className="size-7 shrink-0 text-fg-warning-primary" weight="fill" />}
                <div>
                  <p className="text-md font-semibold text-primary">{result.correct ? 'Correct' : 'Not quite'}</p>
                  <p className="max-w-lg text-sm text-secondary">{'explanation' in ex ? ex.explanation : ''}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex shrink-0 justify-end sm:ml-auto">
            {isConcept || result
              ? <Button size="xl" onPress={advance}>{index + 1 >= queue.length ? 'Finish' : result && !result.correct ? 'Got it' : 'Continue'}</Button>
              : <Button size="xl" onPress={check} isDisabled={!ready}>Check</Button>}
          </div>
        </div>
      </footer>
    </div>
  );
}

function Completion({ title, info, results, exitHref, next }: { title: string; info: CompletionInfo; results: StepResult[]; exitHref: string; next?: Props['next'] }) {
  const firstTry = results.filter(r => r.firstTry).length;
  const accuracy = results.length ? Math.round((firstTry / results.length) * 100) : 100;
  const missed = results.length - firstTry;
  const stats = [
    { icon: LightningIcon, label: 'XP earned', value: `+${info.xp}`, tone: 'text-mint-700' },
    { icon: TargetIcon, label: 'First-try accuracy', value: `${accuracy}%`, tone: 'text-primary' },
    { icon: FireIcon, label: 'Day streak', value: String(info.streak), tone: 'text-fg-warning-primary' },
  ];
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-primary px-4 py-12 text-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className="grid size-20 place-items-center rounded-full bg-mint-50 ring-8 ring-mint-50/60">
        <CheckCircleIcon className="size-12 text-mint-600" weight="fill" />
      </motion.div>
      <div className="flex flex-col gap-2">
        <h1 className="text-display-sm font-semibold text-primary">{title}</h1>
        <p className="text-lg text-tertiary">
          {info.newDay ? `That’s day ${info.streak} of your streak.` : 'Today already counts toward your streak.'}
          {missed > 0 && ` ${missed} ${missed === 1 ? 'question comes' : 'questions come'} back in your review tomorrow.`}
        </p>
      </div>
      <dl className="grid w-full max-w-lg grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
            className="rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary ring-inset">
            <s.icon className={cx('mx-auto size-6', s.tone)} weight="fill" />
            <dd className={cx('mt-2 text-display-xs font-semibold tabular-nums', s.tone)}>{s.value}</dd>
            <dt className="text-sm text-tertiary">{s.label}</dt>
          </motion.div>
        ))}
      </dl>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="xl" color="secondary" href={exitHref}>Back home</Button>
        {next && <Button size="xl" href={next.href}>{next.label}</Button>}
      </div>
    </main>
  );
}
