'use client';
// Client-only (loaded with ssr:false): reads the saved draft and motion preference on first render.
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeftIcon, ArrowRightIcon, CalendarBlankIcon, CheckIcon, CircleNotchIcon, ClockIcon, FlagIcon, SlidersHorizontalIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { DomainId } from '@shape/engine';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { FAMILIES, SKILL_META } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { computeOutcome } from '../profile';
import { PROFILE_KEY, type SavedProfile } from '../storage';
import { weeklyLessonGoal } from '../../home/plan';
import { initialAnswers, isAnswered, QUESTIONS, type Option, type Question, type SurveyAnswers } from './questions';

const DRAFT_KEY = 'shape.survey.v1';

function readDraft(): { answers: SurveyAnswers; index: number } {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) { const d = JSON.parse(raw); return { answers: { ...initialAnswers, ...d.answers }, index: d.index ?? 0 }; }
  } catch { /* storage blocked */ }
  return { answers: initialAnswers, index: 0 };
}

type Phase = 'asking' | 'building' | 'ready';
const EASE = [0.22, 1, 0.36, 1] as const;

export default function SurveyFlow() {
  const router = useRouter();
  const [boot] = useState(() => ({ ...readDraft(), reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }));
  const [answers, setAnswers] = useState<SurveyAnswers>(boot.answers);
  const [i, setIndex] = useState(Math.min(boot.index, QUESTIONS.length - 1));
  const [dir, setDir] = useState(1);
  const [phase, setPhase] = useState<Phase>('asking');
  const timer = useRef<number | undefined>(undefined);
  const q = QUESTIONS[i];
  const last = i === QUESTIONS.length - 1;
  const progress = phase === 'asking' ? (i + (isAnswered(q, answers) && !q.optional ? 0.5 : 0)) / QUESTIONS.length : 1;

  useEffect(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, index: i })); } catch { /* storage blocked */ } }, [answers, i]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const patch = (p: Partial<SurveyAnswers>) => setAnswers(a => ({ ...a, ...p }));
  const go = (delta: number) => {
    window.clearTimeout(timer.current);
    setDir(delta);
    if (delta > 0 && last) { setPhase('building'); return; }
    setIndex(n => Math.max(0, Math.min(QUESTIONS.length - 1, n + delta)));
  };
  /** A single-choice pick moves on by itself after a beat, so each question costs one click. */
  const pick = (p: Partial<SurveyAnswers>) => {
    patch(p);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => go(1), boot.reducedMotion ? 0 : 300);
  };

  const finish = (name: string) => {
    try {
      const final = { ...answers, name: name.trim() };
      const o = computeOutcome(final);
      const saved: SavedProfile = { answers: final, persona: o.persona, future: o.future, ready: o.ready, path: o.result.path.map(p => p.id), savedAt: new Date().toISOString() };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(saved));
      localStorage.removeItem(DRAFT_KEY);
    } catch { /* storage blocked */ }
    router.push('/play');
  };

  return (
    <div className="flex min-h-dvh flex-col bg-primary">
      <header className="border-b border-secondary">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 md:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-primary">Shape</Link>
          {phase === 'asking' && <p className="mx-auto text-sm font-medium text-tertiary tabular-nums">Step {i + 1} of {QUESTIONS.length}</p>}
          <Link href="/" className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-tertiary hover:text-secondary">
            <XIcon className="size-4" /><span className="hidden sm:inline">Exit</span>
          </Link>
        </div>
        <div className="h-1 bg-secondary" role="progressbar" aria-label="Setup progress" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <motion.div className="h-full bg-brand-solid" animate={{ width: `${Math.max(progress * 100, 3)}%` }} transition={{ type: 'spring', stiffness: 120, damping: 24 }} />
        </div>
      </header>

      {phase === 'asking' && (
        <>
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-10 pb-32 md:px-6 md:pt-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.section key={q.id} aria-labelledby={`q-${q.id}`}
                initial={boot.reducedMotion ? false : { opacity: 0, y: dir * 16 }} animate={{ opacity: 1, y: 0 }}
                exit={boot.reducedMotion ? undefined : { opacity: 0, y: dir * -12 }} transition={{ duration: 0.22, ease: EASE }}>
                <h1 id={`q-${q.id}`} className="text-display-xs font-semibold tracking-tight text-primary text-balance md:text-display-sm">{q.title}</h1>
                {q.hint && <p className="mt-2 text-md text-tertiary">{q.hint}</p>}
                <div className="mt-8"><Answer q={q} answers={answers} patch={patch} pick={pick} /></div>
              </motion.section>
            </AnimatePresence>
          </main>
          <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-secondary bg-primary/95 backdrop-blur">
            <div className="mx-auto flex h-20 max-w-3xl items-center gap-3 px-4 md:px-6">
              {i > 0 && <Button color="link-gray" size="lg" iconLeading={ArrowLeftIcon} onPress={() => go(-1)}>Back</Button>}
              <Button className="ml-auto" size="lg" iconTrailing={ArrowRightIcon} onPress={() => go(1)} isDisabled={!isAnswered(q, answers)}>
                {last ? 'Build my plan' : q.optional && q.kind === 'multi' && !q.get(answers).length ? 'None yet, continue' : 'Continue'}
              </Button>
            </div>
          </footer>
        </>
      )}

      {phase === 'building' && <Building reducedMotion={boot.reducedMotion} onDone={() => setPhase('ready')} />}
      {phase === 'ready' && <Ready answers={answers} onFinish={finish} onEdit={() => { setPhase('asking'); setIndex(0); }} />}
    </div>
  );
}

// ── Answer controls ──────────────────────────────────────────

function Answer({ q, answers, patch, pick }: { q: Question; answers: SurveyAnswers; patch: (p: Partial<SurveyAnswers>) => void; pick: (p: Partial<SurveyAnswers>) => void }) {
  if (q.kind === 'single') {
    return (
      <div role="radiogroup" aria-label={q.title} className={cx('grid gap-2.5', q.columns === 2 && 'sm:grid-cols-2')}>
        {q.options.map(o => <OptionRow key={o.value} o={o} on={q.get(answers) === o.value} onPress={() => pick(q.set(o.value))} />)}
      </div>
    );
  }
  const value = q.get(answers);
  return (
    <div role="group" aria-label={q.title} className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {q.options.map(o => {
        const on = value.includes(o.value);
        const color = FAMILIES[SKILL_META[o.value as DomainId].family].color;
        return (
          <button key={o.value} type="button" role="checkbox" aria-checked={on}
            onClick={() => patch(q.set(on ? value.filter(v => v !== o.value) : [...value, o.value]))}
            className={cx('flex items-center gap-3 rounded-xl px-3.5 py-3 text-left ring-1 transition duration-100 ease-linear ring-inset outline-none',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
              on ? 'bg-brand-primary ring-2 ring-brand-solid' : 'ring-secondary hover:bg-primary_hover')}>
            {o.icon && <o.icon className="size-5 shrink-0" style={{ color }} weight="duotone" />}
            <span className="flex-1 text-sm font-semibold text-primary">{o.label}</span>
            <span className={cx('grid size-5 shrink-0 place-items-center rounded-md', on ? 'bg-brand-solid text-white' : 'ring-1 ring-primary ring-inset')}>
              {on && <CheckIcon className="size-3" weight="bold" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function OptionRow({ o, on, onPress }: { o: Option; on: boolean; onPress: () => void }) {
  return (
    <motion.button type="button" role="radio" aria-checked={on} onClick={onPress} whileTap={{ scale: 0.99 }}
      className={cx('flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-left ring-1 transition duration-100 ease-linear ring-inset outline-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        on ? 'bg-brand-primary ring-2 ring-brand-solid' : 'ring-secondary hover:bg-primary_hover hover:ring-primary')}>
      {o.icon && (
        <span className={cx('grid size-10 shrink-0 place-items-center rounded-lg', on ? 'bg-brand-solid text-white' : 'bg-secondary text-fg-secondary')}>
          <o.icon className="size-5" weight={on ? 'fill' : 'duotone'} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-md font-semibold text-primary">{o.label}</span>
        {o.description && <span className="block text-sm text-tertiary">{o.description}</span>}
      </span>
      <span className={cx('grid size-5 shrink-0 place-items-center rounded-full', on ? 'bg-brand-solid text-white' : 'ring-1 ring-primary ring-inset')}>
        {on && <CheckIcon className="size-3" weight="bold" />}
      </span>
    </motion.button>
  );
}

// ── After the last question ──────────────────────────────────

const BUILD_STEPS = ['Matching your goal to the skills it needs', 'Skipping what you already know', 'Fitting lessons into your week'];

function Building({ reducedMotion, onDone }: { reducedMotion: boolean; onDone: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => (step >= BUILD_STEPS.length ? onDone() : setStep(s => s + 1)), reducedMotion ? 0 : step >= BUILD_STEPS.length ? 300 : 550);
    return () => window.clearTimeout(t);
  }, [step, onDone, reducedMotion]);
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-md" role="status" aria-live="polite">
        <h1 className="text-display-xs font-semibold tracking-tight text-primary">Building your plan…</h1>
        <ul className="mt-6 flex flex-col gap-3">
          {BUILD_STEPS.map((s, n) => (
            <li key={s} className={cx('flex items-center gap-3 text-md transition-colors', n <= step ? 'text-primary' : 'text-quaternary')}>
              <span className="grid size-6 place-items-center">
                {n < step ? <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="grid size-6 place-items-center rounded-full bg-mint-600 text-white"><CheckIcon className="size-3.5" weight="bold" /></motion.span>
                  : n === step ? <CircleNotchIcon className="size-5 animate-spin text-brand-secondary" /> : <span className="size-2 rounded-full bg-quaternary" />}
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function Ready({ answers, onFinish, onEdit }: { answers: SurveyAnswers; onFinish: (name: string) => void; onEdit: () => void }) {
  const o = useMemo(() => computeOutcome(answers), [answers]);
  const [name, setName] = useState(answers.name);
  const stats = [
    { icon: FlagIcon, label: 'Chapters on your path', value: o.result.path.length },
    { icon: ClockIcon, label: 'Lessons a week', value: weeklyLessonGoal(answers) },
    { icon: CalendarBlankIcon, label: 'Weeks, at your pace', value: o.result.estimate.weeks },
  ];
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6 md:py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
        <p className="text-sm font-semibold text-mint-700">Your plan is ready</p>
        <h1 className="mt-2 text-display-sm font-semibold tracking-tight text-primary text-balance md:text-display-md">Your path to {o.future}</h1>
        <p className="mt-3 text-lg text-tertiary">
          You’re already <span className="font-semibold text-secondary">{o.ready}%</span> of the way there.
          Fine-tune every chapter, skill level and your pace from your syllabus whenever you like.
        </p>

        <dl className="mt-8 grid gap-3 sm:grid-cols-3">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-5 shadow-xs ring-1 ring-secondary ring-inset">
              <s.icon className="size-5 text-brand-secondary" weight="duotone" />
              <dd className="mt-3 text-display-sm font-semibold text-primary tabular-nums">{s.value}</dd>
              <dt className="text-sm text-tertiary">{s.label}</dt>
            </div>
          ))}
        </dl>

        <form className="mt-8 flex flex-col gap-4 rounded-2xl bg-secondary p-5 sm:flex-row sm:items-end md:p-6" onSubmit={e => { e.preventDefault(); onFinish(name); }}>
          <div className="flex-1"><Input label="What should we call you?" hint="Optional" placeholder="First name" value={name} onChange={setName} /></div>
          <Button type="submit" size="lg" iconTrailing={ArrowRightIcon}>Go to my dashboard</Button>
        </form>
        <div className="mt-4 flex items-center gap-2 text-sm text-tertiary">
          <SlidersHorizontalIcon className="size-4" />Not quite right?
          <Button color="link-color" size="sm" onPress={onEdit}>Change my answers</Button>
        </div>
      </motion.div>
    </main>
  );
}
