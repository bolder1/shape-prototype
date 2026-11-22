'use client';
import { motion } from 'motion/react';
import { ArrowCounterClockwiseIcon, LightningIcon, MapTrifoldIcon, SparkleIcon, TrophyIcon, UserIcon } from '@phosphor-icons/react/ssr';
import { CONTENT, DISTINCTION_AT, LEVELS, PASS_AT, scoreBoss, type BossBrief } from '@shape/content';
import { chapterById } from '@shape/engine';
import { Badge } from '@/components/base/badges/badges';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import type { BossAttempt } from '../progress/store';

const VERDICT = {
  distinction: { title: 'Distinction', line: 'That’s portfolio-grade work for this chapter.' },
  pass: { title: 'Passed', line: 'You can do this for real now. The notes show how to make it strong.' },
  retry: { title: 'Not yet', line: 'Close enough to fix. Use the notes, revise, and resubmit: only your best attempt counts.' },
} as const;

function Ring({ percent, verdict }: { percent: number; verdict: BossAttempt['verdict'] }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="relative size-36">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
        <circle cx={60} cy={60} r={r} fill="none" strokeWidth={10} className="stroke-[var(--color-bg-tertiary)]" />
        <motion.circle cx={60} cy={60} r={r} fill="none" strokeWidth={10} strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - percent / 100) }} transition={{ duration: 1, ease: 'easeOut' }}
          className={verdict === 'retry' ? 'stroke-[var(--color-fg-warning-primary)]' : 'stroke-[var(--color-mint-600)]'} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-display-sm font-semibold text-primary tabular-nums">{percent}<span className="text-lg text-quaternary">%</span></span>
      </div>
    </div>
  );
}

/** Next chapter with lessons, after this one. */
function nextChapter(chapterId: string) {
  const ids = Object.keys(CONTENT);
  return ids[ids.indexOf(chapterId) + 1];
}

export function BossResult({ brief, attempt, xp, improved, onRevise }: { brief: BossBrief; attempt: BossAttempt; xp: number; improved: boolean; onRevise: () => void }) {
  const { review, percent, verdict } = attempt;
  const { blockers } = scoreBoss(brief.rubric, review.levels);
  const v = VERDICT[verdict];
  const next = nextChapter(brief.chapterId);

  return (
    <main className="min-h-dvh bg-secondary">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 md:py-14">
        <section className="flex flex-col items-center gap-4 text-center">
          <Ring percent={percent} verdict={verdict} />
          <div className="flex flex-wrap justify-center gap-2">
            {review.by === 'ai' ? <Badge type="pill-color" color="brand" size="sm"><SparkleIcon className="mr-1 inline size-3.5" />AI review</Badge> : <Badge type="pill-color" color="gray" size="sm"><UserIcon className="mr-1 inline size-3.5" />Self-reviewed</Badge>}
            {xp > 0 && <Badge type="pill-color" color="success" size="sm"><LightningIcon className="mr-1 inline size-3.5" weight="fill" />+{xp} XP</Badge>}
          </div>
          <div>
            <h1 className="flex items-center justify-center gap-2 text-display-sm font-semibold text-primary">{verdict !== 'retry' && <TrophyIcon className="size-8 text-mint-600" weight="duotone" />}{v.title}</h1>
            <p className="mt-1 text-lg text-tertiary">{v.line}</p>
            {!improved && verdict !== 'retry' && xp === 0 && <p className="mt-1 text-sm text-quaternary">Same result as your best, so no new XP this time.</p>}
            <p className="mt-2 text-sm text-quaternary">Pass at {PASS_AT}% · Distinction at {DISTINCTION_AT}%</p>
          </div>
        </section>

        {review.summary && (
          <section className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
            <p className="text-md text-secondary">{review.summary}</p>
            {review.next && <p className="mt-3 rounded-xl bg-brand-primary p-3 text-sm text-secondary"><span className="font-semibold text-primary">Next: </span>{review.next}</p>}
          </section>
        )}

        <section className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
          <h2 className="text-md font-semibold text-primary">By rubric line</h2>
          <ul className="mt-2 flex flex-col divide-y divide-secondary">
            {brief.rubric.map(c => {
              const level = review.levels[c.id] ?? 0;
              const blocked = blockers.includes(c.id);
              return (
                <li key={c.id} className="flex flex-col gap-2 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-sm font-semibold text-primary">{c.label}{c.required && <Badge type={blocked ? "pill-color" : "modern"} color={blocked ? "error" : "gray"} size="sm">{blocked ? 'Required: needs Solid' : 'Required'}</Badge>}</p>
                    <span className="text-sm font-semibold text-secondary">{LEVELS[level]}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1" aria-hidden>
                    {[1, 2, 3].map(i => <span key={i} className={cx('h-1.5 rounded-full', i <= level ? (level >= 2 ? 'bg-mint-600' : 'bg-[var(--color-fg-warning-primary)]') : 'bg-tertiary')} />)}
                  </div>
                  {review.notes[c.id] && <p className="text-sm text-tertiary">{review.notes[c.id]}</p>}
                </li>
              );
            })}
          </ul>
        </section>

        {review.by === 'ai' && (
          <details className="group rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
            <summary className="cursor-pointer text-md font-semibold text-primary">Compare with a strong answer</summary>
            <div className="mt-3 flex flex-col gap-4">
              {brief.fields.map(f => {
                const ex = brief.example[f.id];
                return (
                  <div key={f.id}>
                    <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">{f.label}</p>
                    {Array.isArray(ex) ? <ol className="mt-1 list-decimal pl-5 text-sm text-secondary">{ex.map(t => <li key={t}>{t}</li>)}</ol> : <p className="mt-1 text-sm text-secondary">{ex}</p>}
                  </div>
                );
              })}
            </div>
          </details>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Button size="xl" color="secondary" iconLeading={ArrowCounterClockwiseIcon} onPress={onRevise}>{verdict === 'retry' ? 'Revise and resubmit' : 'Revise anyway'}</Button>
          <Button size="xl" color="secondary" iconLeading={MapTrifoldIcon} href="/map">Skill map</Button>
          {verdict !== 'retry' && next && <Button size="xl" href={`/learn/${next}/1`}>Start: {chapterById[next].title}</Button>}
        </div>
      </div>
    </main>
  );
}
