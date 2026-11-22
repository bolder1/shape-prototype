'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, FlagIcon, LockSimpleIcon, SealCheckIcon, SparkleIcon, XIcon } from '@phosphor-icons/react/ssr';
import { CONTENT, bossReady, emptyAnswers, scoreBoss, type BossAnswers, type BossBrief } from '@shape/content';
import { chapterById } from '@shape/engine';
import { Badge } from '@/components/base/badges/badges';
import { Button } from '@/components/base/buttons/button';
import { Mock } from '../lessons/mocks';
import { bossUnlocked, useProgress, type BossAttempt, type BossReview } from '../progress/store';
import { BossFields } from './BossFields';
import { BossResult } from './BossResult';
import { SelfReview } from './SelfReview';

type Phase = 'brief' | 'work' | 'reviewing' | 'self' | 'result';

/** Client-only: reads drafts and progress from this browser. */
export function BossScreen({ brief }: { brief: BossBrief }) {
  const chapter = chapterById[brief.chapterId];
  const lessonIds = (CONTENT[brief.chapterId] ?? []).map(l => l.id);
  const { lessons, bosses, bossDrafts, saveBossDraft, submitBoss } = useProgress();
  const record = bosses[brief.chapterId];
  const unlocked = bossUnlocked(lessonIds, lessons);
  const lessonsLeft = lessonIds.filter(id => !lessons[id]).length;

  const [phase, setPhase] = useState<Phase>('brief');
  const [answers, setAnswers] = useState<BossAnswers>(() => bossDrafts[brief.chapterId] ?? record?.attempts.at(-1)?.answers ?? emptyAnswers(brief));
  const [outcome, setOutcome] = useState<{ attempt: BossAttempt; xp: number; improved: boolean } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const top = useRef<HTMLDivElement>(null);

  // Autosave the draft while typing.
  useEffect(() => {
    if (phase !== 'work') return;
    const t = setTimeout(() => saveBossDraft(brief.chapterId, answers), 400);
    return () => clearTimeout(t);
  }, [answers, phase, brief.chapterId, saveBossDraft]);

  useEffect(() => { top.current?.focus(); window.scrollTo({ top: 0 }); }, [phase]);

  const finish = (review: BossReview) => {
    const { percent, verdict } = scoreBoss(brief.rubric, review.levels);
    const attempt: BossAttempt = { at: new Date().toISOString(), answers, review, percent, verdict };
    const res = submitBoss(brief.chapterId, attempt);
    setOutcome({ attempt, xp: res.xp, improved: res.improved });
    setPhase('result');
  };

  const submit = async () => {
    saveBossDraft(brief.chapterId, answers);
    setPhase('reviewing');
    try {
      const res = await fetch('/api/boss/review', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chapterId: brief.chapterId, answers }) });
      if (res.ok) {
        const r = await res.json() as Omit<BossReview, 'by'>;
        return finish({ ...r, by: 'ai' });
      }
      const { error } = await res.json().catch(() => ({ error: 'no-review' }));
      setNotice(error === 'no-key' ? 'AI review isn’t set up on this copy of Shape yet, so you’ll review your own work against the rubric.'
        : error === 'busy' ? 'The AI reviewer is busy right now. Review your own work against the rubric instead.'
        : 'The AI review didn’t come through. Review your own work against the rubric instead.');
    } catch {
      setNotice('You seem to be offline. Review your own work against the rubric instead.');
    }
    setPhase('self');
  };

  const header = (back: { label: string; onPress?: () => void; href?: string }, right?: React.ReactNode) => (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-secondary bg-primary/95 px-4 py-3 backdrop-blur md:px-6">
      {back.href
        ? <Link href={back.href} aria-label={back.label} className="grid size-9 place-items-center rounded-lg text-fg-quaternary hover:bg-primary_hover"><XIcon className="size-5" /></Link>
        : <button type="button" aria-label={back.label} onClick={back.onPress} className="grid size-9 place-items-center rounded-lg text-fg-quaternary hover:bg-primary_hover"><ArrowLeftIcon className="size-5" /></button>}
      <p className="flex-1 truncate text-sm text-tertiary"><FlagIcon className="mr-1.5 inline size-4 align-[-3px] text-fg-quaternary" weight="duotone" />Chapter project · {chapter.title}</p>
      {right}
    </header>
  );

  if (phase === 'result' && outcome) {
    return <BossResult brief={brief} attempt={outcome.attempt} xp={outcome.xp} improved={outcome.improved}
      onRevise={() => setPhase('work')} />;
  }

  if (phase === 'reviewing') {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-primary px-4 text-center" aria-live="polite">
        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}><SparkleIcon className="size-10 text-brand-secondary" weight="duotone" /></motion.span>
        <h1 className="text-xl font-semibold text-primary">Reviewing against the rubric</h1>
        <p className="max-w-sm text-md text-tertiary">Each criterion gets a level and a note. This takes about half a minute.</p>
      </main>
    );
  }

  if (phase === 'self') {
    return (
      <div ref={top} tabIndex={-1} className="min-h-dvh bg-secondary outline-none">
        {header({ label: 'Back to your answers', onPress: () => setPhase('work') })}
        <SelfReview brief={brief} answers={answers} notice={notice} onDone={levels => finish({ levels, notes: {}, summary: '', next: '', by: 'self' })} />
      </div>
    );
  }

  if (phase === 'work') {
    const ready = bossReady(brief, answers);
    return (
      <div ref={top} tabIndex={-1} className="min-h-dvh bg-secondary outline-none">
        {header({ label: 'Back to the brief', onPress: () => setPhase('brief') }, <span className="hidden text-xs text-quaternary sm:inline">Draft saved in this browser</span>)}
        <BossFields brief={brief} answers={answers} onChange={setAnswers} />
        <footer className="sticky bottom-0 border-t border-secondary bg-primary px-4 py-4 md:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="text-sm text-tertiary">{ready ? 'Every part is filled in. Read it once more, then submit.' : 'Fill in every part to submit.'}</p>
            <Button size="xl" isDisabled={!ready} onPress={submit}>Submit for review</Button>
          </div>
        </footer>
      </div>
    );
  }

  // Brief
  return (
    <div ref={top} tabIndex={-1} className="min-h-dvh bg-secondary outline-none">
      {header({ label: 'Leave', href: '/map' })}
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:py-12">
        <section>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge type="pill-color" color="brand" size="sm">Chapter project</Badge>
            <span className="inline-flex items-center gap-1 text-sm text-tertiary"><ClockIcon className="size-4" />About {brief.minutes} minutes</span>
            {record && <Badge type="pill-color" color={record.best === 'retry' ? 'warning' : 'success'} size="sm">{record.best === 'distinction' ? 'Distinction' : record.best === 'pass' ? 'Passed' : 'Not passed yet'} · best {record.bestPercent}%</Badge>}
          </div>
          <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{brief.title}</h1>
          <div className="mt-4 flex flex-col gap-3 text-lg text-secondary">{brief.scenario.map(p => <p key={p}>{p}</p>)}</div>
        </section>

        {brief.mock && <div className="max-w-sm"><Mock id={brief.mock} /></div>}

        <section className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
          <h2 className="text-md font-semibold text-primary">What you’ll hand in</h2>
          <ol className="mt-3 flex flex-col gap-2">
            {brief.fields.map((f, i) => (
              <li key={f.id} className="flex gap-3 text-sm text-secondary">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-tertiary">{i + 1}</span>
                <span><span className="font-semibold text-primary">{f.label}{f.kind === 'list' ? ` (${f.items})` : ''}.</span> {f.hint}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
          <h2 className="text-md font-semibold text-primary">How it’s judged</h2>
          <p className="mt-1 text-sm text-tertiary">Each line is scored Missing, Partial, Solid or Strong. You pass at 70%, and lines marked required need at least Solid.</p>
          <ul className="mt-3 flex flex-col divide-y divide-secondary">
            {brief.rubric.map(c => (
              <li key={c.id} className="flex flex-col gap-1 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-primary">{c.label}{c.required && <Badge type="modern" color="gray" size="sm">Required</Badge>}</span>
                <span className="text-sm text-tertiary">{c.strong}</span>
              </li>
            ))}
          </ul>
        </section>

        {brief.tips.length > 0 && (
          <section className="flex flex-col gap-2 rounded-2xl bg-brand-primary p-5">
            {brief.tips.map(t => <p key={t} className="flex gap-2 text-sm text-secondary"><SealCheckIcon className="mt-0.5 size-4 shrink-0 text-brand-secondary" weight="duotone" />{t}</p>)}
          </section>
        )}

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          {unlocked
            ? <Button size="xl" onPress={() => setPhase('work')}>{record ? 'Revise and resubmit' : bossDrafts[brief.chapterId] ? 'Continue your draft' : 'Start the project'}</Button>
            : <>
                <Button size="xl" href={`/learn/${brief.chapterId}/${lessonIds.findIndex(id => !lessons[id]) + 1}`}>Continue the lessons</Button>
                <p className="flex items-center gap-1.5 text-sm text-tertiary"><LockSimpleIcon className="size-4" />Opens after {lessonsLeft === 1 ? 'the last lesson' : `the ${lessonsLeft} remaining lessons`} of this chapter.</p>
              </>}
          {record?.best && record.best !== 'retry' && <span className="flex items-center gap-1.5 text-sm text-mint-700"><CheckCircleIcon className="size-4" weight="fill" />You’ve passed this one. Resubmitting can only raise your best.</span>}
        </div>
      </main>
    </div>
  );
}


