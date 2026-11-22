'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRightIcon, CardsThreeIcon, FlagIcon, CheckCircleIcon, ClockIcon, LockSimpleIcon, MapTrifoldIcon, PlayIcon, TrophyIcon } from '@phosphor-icons/react/ssr';
import { BOSSES, CONTENT, hasContent } from '@shape/content';
import { chapterById, type DomainId } from '@shape/engine';
import { Button } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badges';
import { ProgressBarBase } from '@/components/base/progress-indicators/progress-indicators';
import { FAMILIES, SKILL_META } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { readProfile } from '../onboarding/storage';
import { AppHeader } from '../app/AppHeader';
import { XP, bossUnlocked, doneToday, dueReviews, useProgress } from '../progress/store';
import { tierName, timeLeft, useLeague } from '../league/store';
import { MOVE, weekEndsAt } from '@shape/engine';

const DEFAULT_PATH = ['fd.1', 'fd.2', 'rs.1', 'ia.1', 'ui.1', 'cw.1', 'st.1', 'rs.2'];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/** Client-only: reads the saved profile and progress from this browser. */
export default function HomeScreen() {
  const [profile] = useState(readProfile);
  const { streak, lessons, review, bosses } = useProgress();
  const path = profile?.path?.length ? profile.path : DEFAULT_PATH;
  const shown = path.slice(0, 8);
  const extra = Object.keys(CONTENT).filter(id => !shown.includes(id));
  const due = dueReviews(review).length;
  const today = doneToday(streak.lastDay);

  // Next lesson: first unfinished lesson, walking playable chapters in path order.
  const playable = [...shown, ...extra].filter(hasContent);
  const next = playable.flatMap(c => CONTENT[c].map((l, i) => ({ chapterId: c, n: i + 1, lesson: l }))).find(x => !lessons[x.lesson.id]);
  const name = profile?.answers.name;
  const league = useLeague(name || 'You');
  // A chapter whose lessons are done but whose project isn't passed yet.
  const bossDue = playable.find(c => BOSSES[c] && bossUnlocked(CONTENT[c].map(l => l.id), lessons) && (!bosses[c] || bosses[c].best === 'retry'));

  return (
    <div className="min-h-dvh bg-secondary">
      <AppHeader name={name} />

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:px-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-6">
          <section>
            <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{greeting()}{name ? `, ${name}` : ''}</h1>
            <p className="mt-1 text-md text-tertiary">
              {profile ? <>You’re a <span className="font-semibold text-secondary">{profile.persona}</span> on your way to <span className="font-semibold text-secondary">{profile.future}</span>.</> : 'Map your skills to get a path made for you.'}
              {!today && ' Finish one lesson today to keep your streak.'}
            </p>
          </section>

          {next ? (
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl bg-brand-solid p-6 text-white shadow-lg">
              <p className="text-sm font-semibold text-brand-200">Continue · {chapterById[next.chapterId].title}</p>
              <h2 className="mt-1 text-display-xs font-semibold">{next.lesson.title}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-200"><ClockIcon className="size-4" />About {next.lesson.minutes} minutes · Lesson {next.n} of {CONTENT[next.chapterId].length}</p>
              <div className="mt-5 flex items-center gap-4">
                <Link href={`/learn/${next.chapterId}/${next.n}`} className="inline-flex items-center gap-2 rounded-lg bg-mint-500 px-5 py-3 text-md font-semibold text-brand-950 shadow-sm transition hover:bg-mint-400">
                  <PlayIcon className="size-5" weight="fill" />Start lesson
                </Link>
                <div className="flex-1"><ProgressBarBase value={(CONTENT[next.chapterId].filter(l => lessons[l.id]).length / CONTENT[next.chapterId].length) * 100} className="bg-white/15" progressClassName="bg-mint-500" /></div>
              </div>
            </motion.section>
          ) : (
            <section className="rounded-2xl bg-primary p-6 ring-1 ring-secondary ring-inset">
              <CheckCircleIcon className="size-8 text-mint-600" weight="fill" />
              <h2 className="mt-2 text-lg font-semibold text-primary">You’ve finished every lesson available so far</h2>
              <p className="text-sm text-tertiary">New chapters are being written. Your review deck keeps your skills sharp meanwhile.</p>
            </section>
          )}

          {bossDue && (
            <section className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset sm:flex-row sm:items-center">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-primary"><FlagIcon className="size-6 text-brand-secondary" weight="duotone" /></span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-tertiary">Chapter project · {chapterById[bossDue].title}</p>
                <h2 className="text-lg font-semibold text-primary">{BOSSES[bossDue].title}</h2>
                <p className="text-sm text-tertiary">{bosses[bossDue] ? `Best so far ${bosses[bossDue].bestPercent}%. Revise it to pass.` : `About ${BOSSES[bossDue].minutes} minutes. Pass it to earn ${XP.bossPass} XP and prove the chapter.`}</p>
              </div>
              <Button size="md" href={`/boss/${bossDue}`}>{bosses[bossDue] ? 'Revise' : 'Start project'}</Button>
            </section>
          )}

          <section className="rounded-2xl bg-primary p-2 ring-1 ring-secondary ring-inset">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h2 className="text-lg font-semibold text-primary">Your path</h2>
              <Link href="/map" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover"><MapTrifoldIcon className="size-4" />See the full map</Link>
            </div>
            <ol>
              {[...shown, ...extra].map((id, i) => {
                const ch = chapterById[id]; if (!ch) return null;
                const meta = SKILL_META[ch.domain as DomainId];
                const ls = CONTENT[id];
                const doneCount = ls ? ls.filter(l => lessons[l.id]).length : 0;
                const status = !ls ? 'soon' : doneCount === ls.length ? 'done' : doneCount ? 'progress' : 'ready';
                const firstOpen = ls ? Math.max(1, ls.findIndex(l => !lessons[l.id]) + 1) : 1;
                return (
                  <li key={id}>
                    {i === shown.length && extra.length > 0 && <p className="px-4 pt-4 pb-1 text-xs font-semibold tracking-wide text-quaternary uppercase">Also available now</p>}
                    <Link href={ls ? `/learn/${id}/${status === 'done' ? 1 : firstOpen}` : '#'} aria-disabled={!ls}
                      className={cx('flex items-center gap-4 rounded-xl px-4 py-3 transition', ls ? 'hover:bg-primary_hover' : 'pointer-events-none')}>
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                        <meta.icon className="size-5" style={{ color: FAMILIES[meta.family].color }} weight="duotone" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cx('block truncate text-md font-semibold', ls ? 'text-primary' : 'text-quaternary')}>{ch.title}</span>
                        <span className="block text-sm text-tertiary">{ch.lessons.length} lessons{ls && doneCount > 0 && status !== 'done' ? ` · ${doneCount} done` : ''}</span>
                      </span>
                      {status === 'done' && <Badge type="pill-color" color="success" size="sm">Done</Badge>}
                      {status === 'progress' && <Badge type="pill-color" color="brand" size="sm">In progress</Badge>}
                      {status === 'ready' && <ArrowRightIcon className="size-5 text-fg-quaternary" />}
                      {status === 'soon' && <span className="inline-flex items-center gap-1 text-xs text-quaternary"><LockSimpleIcon className="size-3.5" />Coming soon</span>}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <Link href="/league" className="group rounded-2xl bg-primary p-5 ring-1 ring-secondary transition ring-inset hover:bg-primary_hover">
            <div className="flex items-center gap-2"><TrophyIcon className="size-5 text-brand-secondary" weight="duotone" /><h2 className="text-md font-semibold text-primary">{tierName(league.tier)} league</h2>
              <ArrowRightIcon className="ml-auto size-4 text-fg-quaternary transition group-hover:translate-x-0.5" /></div>
            {league.joined ? (
              <p className="mt-1 text-sm text-tertiary">
                You’re <span className="font-semibold text-secondary">#{league.you.rank}</span> of {league.table.length} with {league.xp} XP.
                {league.you.zone === 'up' ? ' You’d move up if the week ended now.' : league.you.zone === 'down' ? ' One more lesson could get you out of the drop zone.' : ''} Ends in {timeLeft(weekEndsAt(league.week), league.now)}.
              </p>
            ) : (
              <p className="mt-1 text-sm text-tertiary">Earn XP this week to join. The top {MOVE} move up a league on Monday.</p>
            )}
            {league.result && <p className="mt-2 text-sm font-semibold text-mint-700">Last week’s result is in</p>}
          </Link>
          <section className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
            <div className="flex items-center gap-2"><CardsThreeIcon className="size-5 text-brand-secondary" weight="duotone" /><h2 className="text-md font-semibold text-primary">Review</h2></div>
            <p className="mt-1 text-sm text-tertiary">{due ? `${due} ${due === 1 ? 'question is' : 'questions are'} due. Short, and it keeps what you learned.` : 'Nothing due. Questions you miss come back here on a growing schedule.'}</p>
            {due > 0 && <div className="mt-4"><Button size="md" color="secondary" href="/review">Start review</Button></div>}
          </section>
          {profile && (
            <section className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
              <h2 className="text-md font-semibold text-primary">Your goal</h2>
              <p className="mt-1 text-sm text-tertiary">{profile.future}</p>
              <p className="mt-3 text-display-xs font-semibold text-primary tabular-nums">{profile.ready}<span className="text-lg text-quaternary">% ready</span></p>
              <div className="mt-2"><ProgressBarBase value={profile.ready} progressClassName="bg-mint-600" /></div>
              <p className="mt-2 text-xs text-quaternary">{profile.path.length} chapters on your path</p>
            </section>
          )}
          {!profile && (
            <section className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
              <h2 className="text-md font-semibold text-primary">Get your own path</h2>
              <p className="mt-1 text-sm text-tertiary">A four-minute story maps your skills and builds a path just for you.</p>
              <div className="mt-4"><Button size="md" href="/onboarding">Map my skills</Button></div>
            </section>
          )}
          <p className="px-1 text-xs text-quaternary">Progress is saved in this browser until accounts arrive.</p>
        </aside>
      </main>
    </div>
  );
}
