// The passport itself: who, what they can do, and the proof. No hooks, so the public page renders it on the server
// and the owner's preview renders the same thing in the browser.
import Link from 'next/link';
import { BriefcaseIcon, CheckCircleIcon, UserCheckIcon, FireIcon, MedalIcon, SealCheckIcon, StackIcon, UserCircleIcon } from '@phosphor-icons/react/ssr';
import { SKILL_LEVEL_NAME, type PassportCredential } from '@shape/engine';
import { cx } from '@/utils/cx';
import { BadgeMedal, tierLabel } from '../rewards/BadgeMedal';
import { monthYear, type PassportData } from './types';

export function PassportView({ p, actions, preview = false }: { p: PassportData; actions?: (c: PassportCredential) => React.ReactNode; preview?: boolean }) {
  const s = p.summary;
  const verified = s.credentials.filter(c => c.verified).length;
  const stats = [
    { icon: CheckCircleIcon, value: s.lessons, label: s.lessons === 1 ? 'lesson' : 'lessons' },
    { icon: SealCheckIcon, value: verified, label: verified === 1 ? 'verified project' : 'verified projects' },
    { icon: StackIcon, value: s.skills.length, label: s.skills.length === 1 ? 'skill' : 'skills' },
    { icon: FireIcon, value: s.longestStreak, label: 'day best streak' },
  ];
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span className="grid size-20 shrink-0 place-items-center rounded-3xl bg-brand-solid text-display-xs font-semibold text-white" aria-hidden>
          {p.name.trim().slice(0, 1).toUpperCase() || <UserCircleIcon className="size-10" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-display-xs font-semibold tracking-tight text-primary md:text-display-sm">{p.name}</h1>
            {p.openToWork && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success-primary px-2.5 py-1 text-xs font-semibold text-success-primary ring-1 ring-success-200 ring-inset">
                <BriefcaseIcon className="size-3.5" weight="bold" />Open to work
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-tertiary">@{p.handle} · Learning product design on Shape since {monthYear(p.since)}</p>
          {p.headline && <p className="mt-2 text-md text-secondary">{p.headline}</p>}
        </div>
      </header>

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(x => (
          <li key={x.label} className="rounded-2xl bg-primary p-4 shadow-xs ring-1 ring-secondary ring-inset">
            <x.icon className="size-5 text-fg-quaternary" weight="duotone" />
            <p className="mt-2 text-display-xs font-semibold text-primary tabular-nums">{x.value}</p>
            <p className="text-sm text-tertiary">{x.label}</p>
          </li>
        ))}
      </ul>

      <section aria-labelledby="pp-skills">
        <h2 id="pp-skills" className="text-lg font-semibold text-primary">Skills</h2>
        <p className="text-sm text-tertiary">Levels come from finished chapters: Literacy, then Practitioner, then Expert.</p>
        {s.skills.length ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {s.skills.map(k => (
              <li key={k.domain} className="flex items-center gap-3 rounded-xl bg-primary px-4 py-3 ring-1 ring-secondary ring-inset">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {k.name}
                    {k.verified && <SealCheckIcon className="size-4 text-brand-secondary" weight="fill" aria-label="Has a verified project" />}
                  </p>
                  <p className="text-xs text-tertiary">{SKILL_LEVEL_NAME[k.level]} · {k.chaptersDone} of {k.chaptersTotal} chapters</p>
                </div>
                <span className="flex gap-1" role="img" aria-label={`${SKILL_LEVEL_NAME[k.level]}, level ${k.level} of 3`}>
                  {[1, 2, 3].map(n => <span key={n} className={cx('h-2 w-6 rounded-full', n <= k.level ? 'bg-brand-solid' : 'bg-tertiary')} />)}
                </span>
              </li>
            ))}
          </ul>
        ) : <Empty>{preview ? 'Finish a whole chapter and its skill shows up here.' : 'No finished chapters yet.'}</Empty>}
      </section>

      <section aria-labelledby="pp-projects">
        <h2 id="pp-projects" className="text-lg font-semibold text-primary">Projects</h2>
        <p className="text-sm text-tertiary">Each chapter ends with a real brief, scored against a written rubric.</p>
        {s.credentials.length ? (
          <ul className="mt-3 flex flex-col gap-3">
            {s.credentials.map(c => (
              <li key={c.chapterId} id={c.chapterId} className="scroll-mt-24 rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset target:ring-2 target:ring-brand-solid">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-tertiary">{c.skill} · {monthYear(c.at)}</p>
                    <h3 className="text-md font-semibold text-primary">{c.title}</h3>
                  </div>
                  <span className={cx('rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                    c.verdict === 'distinction' ? 'bg-brand-primary text-brand-secondary ring-brand' : 'bg-secondary text-secondary ring-secondary')}>
                    {c.verdict === 'distinction' ? 'Distinction' : 'Passed'} · {c.percent}%
                  </span>
                </div>
                <p className={cx('mt-3 flex items-center gap-1.5 text-sm', c.verified ? 'text-brand-secondary' : 'text-tertiary')}>
                  {c.verified
                    ? <><SealCheckIcon className="size-4" weight="fill" />Verified: reviewed against the rubric by Shape’s AI reviewer</>
                    : <><UserCheckIcon className="size-4" />Self-reviewed against the rubric</>}
                </p>
                {actions?.(c)}
              </li>
            ))}
          </ul>
        ) : <Empty>{preview ? 'Pass a chapter project and it appears here. Projects reviewed while you’re signed in are marked verified.' : 'No projects passed yet.'}</Empty>}
      </section>

      <section aria-labelledby="pp-badges">
        <h2 id="pp-badges" className="text-lg font-semibold text-primary">Badges</h2>
        {s.badges.length ? (
          <ul className="mt-3 flex flex-wrap gap-4">
            {s.badges.map(b => (
              <li key={b.def.id} className="flex w-24 flex-col items-center gap-1.5 text-center">
                <BadgeMedal id={b.def.id} kind={b.def.kind} tier={b.tier} size={56} />
                <span className="text-xs font-semibold text-secondary">{b.def.name}</span>
                <span className="text-[11px] text-quaternary">{b.tier && tierLabel(b.tier)}</span>
              </li>
            ))}
          </ul>
        ) : <Empty>{preview ? 'Badges you earn show up here.' : 'No badges yet.'}</Empty>}
      </section>

      {!preview && (
        <footer className="flex flex-col items-start gap-3 rounded-2xl bg-brand-solid p-6 text-white sm:flex-row sm:items-center">
          <MedalIcon className="size-8 shrink-0 text-mint-400" weight="duotone" />
          <div className="flex-1">
            <p className="font-semibold">Everything here was earned on Shape.</p>
            <p className="text-sm text-brand-200">Lessons are playable episodes, and every chapter ends in a real project.</p>
          </div>
          <Link href="/onboarding" className="rounded-xl bg-mint-500 px-4 py-2.5 text-sm font-bold text-brand-950 hover:bg-mint-400">Start learning</Link>
        </footer>
      )}
    </article>
  );
}

const Empty = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 rounded-xl bg-primary px-4 py-5 text-sm text-tertiary ring-1 ring-secondary ring-inset ring-dashed">{children}</p>
);
