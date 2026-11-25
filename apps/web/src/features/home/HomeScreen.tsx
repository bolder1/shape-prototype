'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRightIcon, CardsThreeIcon, CheckCircleIcon, CheckIcon, ClockIcon, FireIcon, FlagIcon, LightningIcon, LockSimpleIcon,
  PlayIcon, SlidersHorizontalIcon, TargetIcon, TrophyIcon,
} from '@phosphor-icons/react/ssr';
import { BOSSES, CONTENT, hasContent } from '@shape/content';
import { chapterById, MOVE, weekEndsAt, type DomainId } from '@shape/engine';
import { Button } from '@/components/base/buttons/button';
import { ProgressBarBase } from '@/components/base/progress-indicators/progress-indicators';
import { FAMILIES, SKILL_META } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { readProfile } from '../onboarding/storage';
import { AppHeader } from '../app/AppHeader';
import { XP, bossUnlocked, doneToday, dueReviews, liveStreak, useProgress } from '../progress/store';
import { tierName, timeLeft, useLeague } from '../league/store';
import { lessonsThisWeek, thisWeek, weeklyLessonGoal } from './plan';
import { TIER_LABEL } from '../syllabus/model';
import { useRewards } from '../rewards/useRewards';
import { AccountCard, BadgeShelf, DailyCard, NextUnlockCard, QuestsCard, QuickActions, nextUnlock, useDailyToday } from './Today';

const DEFAULT_PATH = ['fd.1', 'fd.2', 'rs.1', 'ia.1', 'ui.1', 'cw.1', 'st.1', 'rs.2'];
type Tab = 'progress' | 'next' | 'done';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/** Client-only: reads the saved profile and progress from this browser. */
export default function HomeScreen() {
  const [profile] = useState(readProfile);
  const { xp, ledger, streak, lessons, review, bosses } = useProgress();
  const [tab, setTab] = useState<Tab>('progress');
  const path = profile?.path?.length ? profile.path : DEFAULT_PATH;
  const extra = Object.keys(CONTENT).filter(id => !path.includes(id));
  const due = dueReviews(review).length;
  const today = doneToday(streak.lastDay);
  const name = profile?.answers.name;
  const league = useLeague(name || 'You');

  // Next lesson: first unfinished lesson, walking playable chapters in path order.
  const playable = [...path, ...extra].filter(hasContent);
  const next = playable.flatMap(c => CONTENT[c].map((l, i) => ({ chapterId: c, n: i + 1, lesson: l }))).find(x => !lessons[x.lesson.id]);
  const bossDue = playable.find(c => BOSSES[c] && bossUnlocked(CONTENT[c].map(l => l.id), lessons) && (!bosses[c] || bosses[c].best === 'retry'));

  // Chapters as courses, bucketed for the "My learning" tabs.
  const courses = [...path, ...extra.slice(0, 4)].map(id => {
    const ls = CONTENT[id]; const doneCount = ls ? ls.filter(l => lessons[l.id]).length : 0;
    const status: Tab | 'soon' = !ls ? 'soon' : doneCount === ls.length ? 'done' : doneCount ? 'progress' : 'next';
    return { id, ch: chapterById[id], ls, doneCount, status, onPath: path.includes(id) };
  }).filter(c => c.ch);
  const buckets: Record<Tab, typeof courses> = {
    progress: courses.filter(c => c.status === 'progress'),
    next: courses.filter(c => c.status === 'next' || c.status === 'soon'),
    done: courses.filter(c => c.status === 'done'),
  };

  const goal = profile ? weeklyLessonGoal(profile.answers) : 5;
  const week = thisWeek(ledger);
  const doneWeek = lessonsThisWeek(ledger);
  const nextChapter = next ? CONTENT[next.chapterId] : null;
  const rewards = useRewards(goal);
  const daily = useDailyToday();
  const unlock = nextUnlock(rewards.badges, lessons, path);

  return (
    <div className="min-h-dvh bg-secondary">
      <AppHeader name={name} />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-display-xs font-semibold tracking-tight text-primary md:text-display-sm">{greeting()}{name ? `, ${name}` : ''}</h1>
            <p className="mt-1 text-md text-tertiary">
              {profile ? <>On your way to <span className="font-semibold text-secondary">{profile.future}</span>.</> : 'Answer four quick questions to get a path made for you.'}
              {!today && ' One lesson today keeps your streak alive.'}
            </p>
          </div>
          <Button className="sm:ml-auto" color="secondary" size="md" iconLeading={SlidersHorizontalIcon} href={profile ? '/syllabus' : '/onboarding'}>
            {profile ? 'Customize syllabus' : 'Set up my plan'}
          </Button>
        </section>

        <div className="mt-5"><QuickActions next={next ?? null} due={due} dailyDone={!!daily.result} /></div>

        {/* Stats */}
        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: FireIcon, tint: 'text-warning-600', label: 'Day streak', value: liveStreak(streak), sub: `Best ${streak.longest}` },
            { icon: LightningIcon, tint: 'text-mint-600', label: 'Total XP', value: xp, sub: league.joined ? `#${league.you.rank} in ${tierName(league.tier)}` : 'Earn XP to join a league' },
            { icon: TargetIcon, tint: 'text-brand-secondary', label: 'This week', value: `${doneWeek}/${goal}`, sub: 'lessons toward your goal' },
            { icon: FlagIcon, tint: 'text-brand-secondary', label: 'Goal readiness', value: `${profile?.ready ?? 0}%`, sub: profile?.future ?? 'Set a goal' },
          ].map((s, n) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.04 }}
              className="rounded-2xl bg-primary p-4 shadow-xs ring-1 ring-secondary ring-inset md:p-5">
              <dt className="flex items-center gap-2 text-sm font-medium text-tertiary"><s.icon className={cx('size-4', s.tint)} weight="fill" />{s.label}</dt>
              <dd className="mt-2 text-display-xs font-semibold text-primary tabular-nums">{s.value}</dd>
              <dd className="truncate text-xs text-quaternary">{s.sub}</dd>
            </motion.div>
          ))}
        </dl>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="flex min-w-0 flex-col gap-6">
            {/* Continue learning */}
            {next && nextChapter ? (
              <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-brand-solid text-white shadow-lg">
                <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-mint-500/20 blur-3xl" />
                <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_15rem] md:p-7">
                  <div>
                    <p className="text-sm font-semibold text-brand-200">Continue learning · {chapterById[next.chapterId].title}</p>
                    <h2 className="mt-2 text-display-xs font-semibold tracking-tight">{next.lesson.title}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-200"><ClockIcon className="size-4" />About {next.lesson.minutes} min · Lesson {next.n} of {nextChapter.length}</p>
                    <Link href={`/learn/${next.chapterId}/${next.n}`} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-mint-500 px-5 py-3 text-md font-semibold text-brand-950 shadow-sm transition hover:bg-mint-400">
                      <PlayIcon className="size-5" weight="fill" />{next.n === 1 ? 'Start chapter' : 'Resume'}
                    </Link>
                  </div>
                  <ol className="flex flex-col gap-1 rounded-xl bg-white/8 p-3 ring-1 ring-white/10 ring-inset">
                    {nextChapter.map((l, n) => {
                      const done = !!lessons[l.id], current = n + 1 === next.n;
                      return (
                        <li key={l.id} className={cx('flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm', current && 'bg-white/10')}>
                          <span className={cx('grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold',
                            done ? 'bg-mint-500 text-brand-950' : current ? 'bg-white text-brand-950' : 'ring-1 ring-white/30 text-brand-200')}>
                            {done ? <CheckIcon className="size-3" weight="bold" /> : n + 1}
                          </span>
                          <span className={cx('truncate', done ? 'text-brand-200' : 'text-white')}>{l.title}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </motion.section>
            ) : (
              <section className="rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
                <CheckCircleIcon className="size-8 text-mint-600" weight="fill" />
                <h2 className="mt-2 text-lg font-semibold text-primary">You’ve finished every lesson available so far</h2>
                <p className="text-sm text-tertiary">New chapters are being written. Your review deck keeps your skills sharp meanwhile.</p>
              </section>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <DailyCard number={daily.number} result={daily.result} />
              {unlock && <NextUnlockCard unlock={unlock} />}
            </div>

            <QuestsCard quests={rewards.quests} chest={rewards.chest} />

            {bossDue && (
              <section className="flex flex-col gap-4 rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset sm:flex-row sm:items-center">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-primary"><FlagIcon className="size-6 text-brand-secondary" weight="duotone" /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-tertiary">Chapter project · {chapterById[bossDue].title}</p>
                  <h2 className="text-lg font-semibold text-primary">{BOSSES[bossDue].title}</h2>
                  <p className="text-sm text-tertiary">{bosses[bossDue] ? `Best so far ${bosses[bossDue].bestPercent}%. Revise it to pass.` : `About ${BOSSES[bossDue].minutes} minutes. Pass it to earn ${XP.bossPass} XP.`}</p>
                </div>
                <Button size="md" href={`/boss/${bossDue}`}>{bosses[bossDue] ? 'Revise' : 'Start project'}</Button>
              </section>
            )}

            {/* My learning */}
            <section>
              <div className="flex items-end gap-4 border-b border-secondary">
                <h2 className="pb-3 text-lg font-semibold text-primary">My learning</h2>
                <div role="tablist" aria-label="My learning" className="ml-auto flex gap-1">
                  {([['progress', 'In progress'], ['next', 'Up next'], ['done', 'Completed']] as const).map(([id, label]) => (
                    <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                      className={cx('-mb-px border-b-2 px-3 pb-3 text-sm font-semibold transition',
                        tab === id ? 'border-brand-solid text-brand-secondary' : 'border-transparent text-tertiary hover:text-secondary')}>
                      {label}<span className="ml-1.5 rounded-full bg-tertiary px-1.5 py-0.5 text-xs text-secondary tabular-nums">{buckets[id].length}</span>
                    </button>
                  ))}
                </div>
              </div>
              {buckets[tab].length ? (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {buckets[tab].map(c => {
                    const meta = SKILL_META[c.ch.domain as DomainId]; const color = FAMILIES[meta.family].color;
                    const firstOpen = c.ls ? Math.max(1, c.ls.findIndex(l => !lessons[l.id]) + 1) : 1;
                    const pct = c.ls ? (c.doneCount / c.ls.length) * 100 : 0;
                    return (
                      <li key={c.id}>
                        <Link href={c.ls ? `/learn/${c.id}/${c.status === 'done' ? 1 : firstOpen}` : '#'} aria-disabled={!c.ls}
                          className={cx('group flex h-full flex-col overflow-hidden rounded-2xl bg-primary shadow-xs ring-1 ring-secondary transition ring-inset',
                            c.ls ? 'hover:-translate-y-0.5 hover:shadow-md' : 'pointer-events-none')}>
                          <div className="flex items-center gap-3 px-4 pt-4">
                            <span className="grid size-11 shrink-0 place-items-center rounded-xl" style={{ background: `color-mix(in oklab, ${color} 12%, transparent)` }}>
                              <meta.icon className="size-6" style={{ color }} weight="duotone" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-xs font-semibold" style={{ color }}>{meta.short}</span>
                              <span className={cx('block truncate text-md font-semibold', c.ls ? 'text-primary' : 'text-quaternary')}>{c.ch.title}</span>
                            </span>
                          </div>
                          <div className="mt-auto px-4 pt-4 pb-4">
                            <p className="flex items-center gap-1.5 text-xs text-tertiary">
                              {TIER_LABEL[c.ch.tier]} · {c.ch.lessons.length} lessons
                              {!c.onPath && <span className="ml-auto text-quaternary">Not on your path</span>}
                              {c.status === 'soon' && <span className="ml-auto inline-flex items-center gap-1 text-quaternary"><LockSimpleIcon className="size-3" />Coming soon</span>}
                            </p>
                            {c.ls && <div className="mt-2"><ProgressBarBase value={pct} progressClassName={c.status === 'done' ? 'bg-mint-600' : 'bg-brand-solid'} /></div>}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-6 rounded-2xl bg-primary p-6 text-center text-sm text-tertiary ring-1 ring-secondary ring-inset">
                  {tab === 'progress' ? 'Nothing started yet. Your next chapter is waiting above.' : tab === 'done' ? 'Finished chapters land here.' : 'Your whole path is underway.'}
                </p>
              )}
            </section>
          </div>

          <aside className="flex flex-col gap-6">
            {/* Weekly goal */}
            <section className="rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
              <div className="flex items-center gap-4">
                <Ring value={Math.min(1, doneWeek / goal)} label={`${doneWeek}/${goal}`} />
                <div>
                  <h2 className="text-md font-semibold text-primary">Weekly goal</h2>
                  <p className="text-sm text-tertiary">{doneWeek >= goal ? 'Done for the week. Nice work.' : `${goal - doneWeek} ${goal - doneWeek === 1 ? 'lesson' : 'lessons'} to go`}</p>
                </div>
              </div>
              <ol className="mt-5 grid grid-cols-7 gap-1.5" aria-label="Days you learned this week">
                {week.map((d, n) => (
                  <li key={n} className="flex flex-col items-center gap-1.5">
                    <span className={cx('grid size-8 place-items-center rounded-full text-xs font-semibold',
                      d.active ? 'bg-mint-600 text-white' : d.today ? 'ring-2 ring-brand-solid text-brand-secondary' : d.future ? 'bg-secondary text-quaternary' : 'bg-secondary text-tertiary')}
                      aria-label={`${d.label}${d.active ? ', learned' : ''}`}>
                      {d.active ? <CheckIcon className="size-3.5" weight="bold" /> : d.label}
                    </span>
                  </li>
                ))}
              </ol>
              {profile && <p className="mt-4 text-xs text-quaternary">{profile.answers.daysPerWeek} days × {profile.answers.minutesPerDay} min. <Link href="/syllabus" className="font-semibold text-brand-secondary">Change</Link></p>}
            </section>

            <BadgeShelf earned={rewards.earned} secretsLeft={rewards.secretsLeft} total={rewards.badges.length} />

            <Link href="/league" className="group rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary transition ring-inset hover:bg-primary_hover">
              <div className="flex items-center gap-2"><TrophyIcon className="size-5 text-brand-secondary" weight="duotone" /><h2 className="text-md font-semibold text-primary">{tierName(league.tier)} league</h2>
                <ArrowRightIcon className="ml-auto size-4 text-fg-quaternary transition group-hover:translate-x-0.5" /></div>
              <p className="mt-1 text-sm text-tertiary">
                {league.joined
                  ? <>You’re <span className="font-semibold text-secondary">#{league.you.rank}</span> of {league.table.length} with {league.xp} XP. Ends in {timeLeft(weekEndsAt(league.week), league.now)}.</>
                  : `Earn XP this week to join. The top ${MOVE} move up on Monday.`}
              </p>
              {league.result && <p className="mt-2 text-sm font-semibold text-mint-700">Last week’s result is in</p>}
            </Link>

            <section className="rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
              <div className="flex items-center gap-2"><CardsThreeIcon className="size-5 text-brand-secondary" weight="duotone" /><h2 className="text-md font-semibold text-primary">Review</h2></div>
              <p className="mt-1 text-sm text-tertiary">{due ? `${due} ${due === 1 ? 'question is' : 'questions are'} due. Short, and it keeps what you learned.` : 'Nothing due. Questions you miss come back here on a growing schedule.'}</p>
              {due > 0 && <div className="mt-4"><Button size="md" color="secondary" href="/review">Start review</Button></div>}
            </section>

            <section className="rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
              <h2 className="text-md font-semibold text-primary">{profile ? 'Your syllabus' : 'Get your own path'}</h2>
              <p className="mt-1 text-sm text-tertiary">
                {profile ? `${profile.path.length} chapters, picked for ${profile.future}. Add, remove, or set your skill levels.` : 'Four quick questions build a path just for you.'}
              </p>
              <div className="mt-4"><Button size="md" color="secondary" iconLeading={SlidersHorizontalIcon} href={profile ? '/syllabus' : '/onboarding'}>{profile ? 'Customize' : 'Set up my plan'}</Button></div>
            </section>
            <AccountCard />
          </aside>
        </div>
      </main>
    </div>
  );
}

function Ring({ value, label }: { value: number; label: string }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <span className="relative grid size-16 shrink-0 place-items-center">
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-[var(--color-bg-tertiary)]" />
        <motion.circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round" className="stroke-mint-600"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value) }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      <span className="text-sm font-semibold text-primary tabular-nums">{label}</span>
    </span>
  );
}
