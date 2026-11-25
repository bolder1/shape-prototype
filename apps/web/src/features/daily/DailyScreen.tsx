'use client';
// The Daily Brief: five questions, the same for everyone today, then a spoiler-free grid to share.
// One go per day. Results stay in this browser (and log a `puzzle` event, so badges and quests can count them).
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRightIcon, CheckCircleIcon, CheckIcon, FireIcon, ShareNetworkIcon, TimerIcon, XCircleIcon } from '@phosphor-icons/react/ssr';
import { dailyBrief, dailyShareText, dailyTime, lessonById, parseLessonId, type DailyBrief } from '@shape/content';
import { domainById, type DomainId } from '@shape/engine';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { play } from '@/lib/sound';
import { AppHeader } from '../app/AppHeader';
import { logEvent } from '../progress/events';

const STORE = 'shape.daily.v1';
/** Read in event handlers and effects only, never during render. */
const clock = () => performance.now();
interface DayResult { picks: string[]; right: boolean[]; ms: number; at: string }
type Saved = Record<string, DayResult>;

const localDay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const readSaved = (): Saved => { try { return JSON.parse(localStorage.getItem(STORE) ?? '{}') as Saved; } catch { return {}; } };
const writeSaved = (s: Saved) => { try { localStorage.setItem(STORE, JSON.stringify(s)); } catch { /* storage blocked */ } };

/** Days in a row the brief was played, ending today (or yesterday, if today isn't played yet). */
function dailyStreak(saved: Saved, today: string) {
  const d = new Date(`${today}T12:00:00`);
  if (!saved[today]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (saved[localDay(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/** Client only (app/daily/ClientOnly.tsx): reads the date and this browser's results when it first renders. */
export default function DailyScreen() {
  const [today] = useState(() => localDay());
  const [saved, setSaved] = useState<Saved>(readSaved);
  const brief = useMemo(() => dailyBrief(today), [today]);

  const done = saved[today];
  const finish = (r: DayResult) => {
    const next = { ...readSaved(), [today]: r };
    writeSaved(next); setSaved(next);
    logEvent('puzzle', String(brief.number), { right: r.right.filter(Boolean).length, total: r.right.length, ms: r.ms });
  };
  return <Shell>{done ? <Results brief={brief} result={done} streak={dailyStreak(saved, today)} /> : <Play brief={brief} onDone={finish} />}</Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-secondary">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-8 sm:py-12">{children}</main>
    </div>
  );
}

const familyName = (domain: string) => domainById[domain as DomainId]?.name ?? domain;

function Play({ brief, onDone }: { brief: DailyBrief; onDone: (r: DayResult) => void }) {
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const spent = useRef(0);          // ms spent answering (reading the explanation doesn't count)
  const shownAt = useRef(0);

  useEffect(() => { if (started && !picked) shownAt.current = clock(); }, [started, i, picked]);

  if (!started) {
    return (
      <section className="flex flex-col gap-5 rounded-2xl bg-primary p-6 shadow-lg ring-1 ring-secondary ring-inset sm:p-8">
        <p className="text-sm font-semibold tracking-wide text-brand-secondary uppercase">Shape Daily #{brief.number}</p>
        <h1 className="text-display-xs font-semibold text-primary">Today’s brief</h1>
        <p className="text-md text-tertiary">Five questions from five corners of product design. Everyone gets the same five today. The last two are tough. Your time only runs while you’re answering.</p>
        <ul className="flex flex-wrap gap-2">
          {brief.questions.map((q, k) => (
            <li key={q.id} className={cx('rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset', q.level === 'tough' ? 'bg-utility-purple-50 text-utility-purple-700 ring-utility-purple-200' : 'bg-secondary text-secondary ring-secondary')}>
              {k + 1}. {familyName(q.domain)}
            </li>
          ))}
        </ul>
        <Button size="xl" onPress={() => { play('whoosh'); setStarted(true); }}>Start</Button>
      </section>
    );
  }

  const q = brief.questions[i];
  const answer = (id: string) => {
    if (picked) return;
    spent.current += clock() - shownAt.current;
    setPicked(id);
    play(id === q.correct ? 'correct' : 'wrong');
  };
  const next = () => {
    const all = [...picks, picked!];
    if (i + 1 < brief.questions.length) { setPicks(all); setPicked(null); setI(i + 1); return; }
    onDone({ picks: all, right: all.map((p, k) => p === brief.questions[k].correct), ms: Math.round(spent.current), at: new Date().toISOString() });
  };
  const lesson = lessonById(q.lessonId);
  const { chapterId, n } = parseLessonId(q.lessonId);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <ol className="flex gap-1.5" aria-label={`Question ${i + 1} of ${brief.questions.length}`}>
          {brief.questions.map((x, k) => (
            <li key={x.id} className={cx('h-2 w-8 rounded-full', k < i ? (picks[k] === brief.questions[k].correct ? 'bg-mint-500' : 'bg-gray-300') : k === i ? 'bg-brand-solid' : 'bg-quaternary')} />
          ))}
        </ol>
        <span className="text-sm font-semibold text-tertiary">#{brief.number}</span>
      </div>
        <motion.section key={q.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop}
          className="flex flex-col gap-4 rounded-2xl bg-primary p-6 shadow-lg ring-1 ring-secondary ring-inset">
          <p className="flex items-center gap-2 text-sm font-semibold text-tertiary">
            {familyName(q.domain)}
            {q.level === 'tough' && <span className="rounded-full bg-utility-purple-50 px-2 py-0.5 text-xs text-utility-purple-700 ring-1 ring-utility-purple-200 ring-inset">Tough</span>}
          </p>
          <h2 className="text-xl font-semibold text-primary">{q.prompt}</h2>
          <div className="flex flex-col gap-2" role="group" aria-label="Answers">
            {q.options.map(o => {
              const state = !picked ? 'idle' : o.id === q.correct ? 'right' : o.id === picked ? 'wrong' : 'dim';
              return (
                <button key={o.id} type="button" onClick={() => answer(o.id)} disabled={!!picked}
                  className={cx('flex items-center gap-3 rounded-xl px-4 py-3 text-left text-md font-medium ring-1 transition ring-inset',
                    state === 'idle' && 'bg-primary text-primary ring-secondary hover:bg-primary_hover hover:ring-brand',
                    state === 'right' && 'bg-success-primary text-success-primary ring-success',
                    state === 'wrong' && 'bg-error-primary text-error-primary ring-error',
                    state === 'dim' && 'bg-primary text-quaternary ring-secondary')}>
                  <span className="flex-1">{o.label}</span>
                  {state === 'right' && <CheckCircleIcon className="size-5 shrink-0" weight="fill" aria-label="Correct" />}
                  {state === 'wrong' && <XCircleIcon className="size-5 shrink-0" weight="fill" aria-label="Your answer" />}
                </button>
              );
            })}
          </div>
          {picked && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex flex-col gap-3" aria-live="polite">
              <p className="text-md text-secondary"><span className="font-semibold">{picked === q.correct ? 'Right. ' : 'Not quite. '}</span>{q.explanation}</p>
              {lesson && <p className="text-sm text-tertiary">From <Link href={`/learn/${chapterId}/${n}`} className="font-semibold text-brand-secondary underline-offset-2 hover:underline">{lesson.title}</Link></p>}
              <Button size="lg" iconTrailing={ArrowRightIcon} onPress={next}>{i + 1 < brief.questions.length ? 'Next question' : 'See my result'}</Button>
            </motion.div>
          )}
        </motion.section>
    </>
  );
}

function untilTomorrow(now: Date) {
  const m = Math.max(0, Math.ceil((new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()) / 60_000));
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

function Results({ brief, result, streak }: { brief: DailyBrief; result: DayResult; streak: number }) {
  const [shared, setShared] = useState<'idle' | 'copied' | 'shared'>('idle');
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30_000); return () => clearInterval(t); }, []);
  const score = result.right.filter(Boolean).length;
  const headline = score === 5 ? 'A perfect brief' : score >= 4 ? 'Sharp work' : score >= 3 ? 'Solid' : 'Tomorrow’s another brief';

  const share = async () => {
    const text = dailyShareText(brief, result.right, result.ms, `${window.location.origin}/daily`);
    logEvent('share', `daily:${brief.number}`, { score });
    try {
      if (navigator.share) { await navigator.share({ text }); setShared('shared'); return; }
      await navigator.clipboard.writeText(text); setShared('copied');
    } catch { /* closed the sheet */ }
  };

  return (
    <>
      <section className="flex flex-col items-center gap-5 rounded-2xl bg-primary p-6 text-center shadow-lg ring-1 ring-secondary ring-inset sm:p-8">
        <p className="text-sm font-semibold tracking-wide text-brand-secondary uppercase">Shape Daily #{brief.number}</p>
        <h1 className="text-display-xs font-semibold text-primary">{headline}</h1>
        <div className="flex gap-2" aria-label={`${score} of ${result.right.length} right`}>
          {result.right.map((r, k) => (
            <motion.span key={k} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...springs.pop, delay: k * 0.08 }}
              className={cx('grid size-12 place-items-center rounded-xl', r ? (brief.questions[k].level === 'tough' ? 'bg-utility-purple-500 text-white' : 'bg-mint-500 text-brand-950') : 'bg-quaternary text-quaternary')}>
              {r ? <CheckIcon className="size-5" weight="bold" aria-hidden /> : <span aria-hidden>–</span>}
            </motion.span>
          ))}
        </div>
        <dl className="flex gap-6 text-md">
          <div className="flex items-center gap-1.5"><dt className="sr-only">Score</dt><dd className="font-semibold text-primary">{score}/{result.right.length}</dd></div>
          <div className="flex items-center gap-1.5"><TimerIcon className="size-5 text-tertiary" aria-hidden /><dt className="sr-only">Time</dt><dd className="font-semibold text-primary tabular-nums">{dailyTime(result.ms)}</dd></div>
          <div className="flex items-center gap-1.5"><FireIcon className="size-5 text-warning-primary" weight="fill" aria-hidden /><dt className="sr-only">Daily streak</dt><dd className="font-semibold text-primary">{streak} {streak === 1 ? 'day' : 'days'}</dd></div>
        </dl>
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button size="lg" className="flex-1" iconLeading={shared === 'idle' ? ShareNetworkIcon : CheckIcon} onPress={share}>
            {shared === 'copied' ? 'Copied: paste it anywhere' : shared === 'shared' ? 'Shared' : 'Share my result'}
          </Button>
          <Button size="lg" color="secondary" className="flex-1" href="/play">Back to learning</Button>
        </div>
        <p className="text-sm text-tertiary">The share shows only your squares, never the questions. Next brief in {untilTomorrow(now)}.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-primary">Today’s answers</h2>
        {brief.questions.map((q, k) => {
          const lesson = lessonById(q.lessonId);
          const { chapterId, n } = parseLessonId(q.lessonId);
          const right = result.right[k];
          return (
            <article key={q.id} className="flex flex-col gap-2 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
              <p className="flex items-center gap-2 text-sm font-semibold text-tertiary">
                {right ? <CheckCircleIcon className="size-4 text-success-primary" weight="fill" aria-label="Right" /> : <XCircleIcon className="size-4 text-error-primary" weight="fill" aria-label="Missed" />}
                {familyName(q.domain)}{q.level === 'tough' && ' · Tough'}
              </p>
              <p className="text-md font-medium text-primary">{q.prompt}</p>
              <p className="text-sm text-secondary"><span className="font-semibold">{q.options.find(o => o.id === q.correct)?.label}.</span> {q.explanation}</p>
              {lesson && <Link href={`/learn/${chapterId}/${n}`} className="text-sm font-semibold text-brand-secondary underline-offset-2 hover:underline">Learn it: {lesson.title}</Link>}
            </article>
          );
        })}
      </section>
    </>
  );
}
