'use client';
// The finale: the 3D grade card, then the breakdown by stage, XP and streak.
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { ArrowCounterClockwiseIcon, FireIcon, LightningIcon } from '@phosphor-icons/react/ssr';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import type { gradeEpisode } from '../scoring';
import { NibSays } from '../kit';
import { ShareCard } from './ShareCard';

const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

const GradeCard3D = dynamic(() => import('./GradeCard3D'), { ssr: false, loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-secondary" /> });

export function GradeCard({ lessonId, result, title, episode, name, xp, streak, newDay, next, onReplay, exitHref }: {
  lessonId: string; result: ReturnType<typeof gradeEpisode>; title: string; episode: string; name: string; xp: number; streak: number; newDay: boolean;
  next?: { href: string; label: string }; onReplay: () => void; exitHref: string;
}) {
  const face = {
    grade: result.grade, label: result.label, percent: result.percent, title, episode, name,
    stats: [{ label: 'Right', value: `${result.right}/${result.total}` }, { label: 'XP', value: `+${xp}` }, { label: 'Streak', value: `${streak}d` }],
    colors: result.colors,
  };
  const praise = { S: 'Flawless. That’s how a pro thinks.', A: 'Really sharp. One or two slips, that’s all.', B: 'Solid run. Your review deck will polish the rest.', C: 'Good effort. The questions you missed come back tomorrow.', D: 'Rough one, and that’s fine. Watch the scene again and replay.' }[result.grade];

  return (
    <div className="flex flex-col gap-6">
      <div className="relative h-[440px] w-full overflow-hidden rounded-3xl md:h-[520px]" style={{ background: `radial-gradient(70% 60% at 40% 40%, ${result.colors[0]}33, transparent 70%), radial-gradient(50% 50% at 80% 80%, ${result.colors[1]}33, transparent 70%)` }}>
        <GradeCard3D face={face} tokens={result.tokens} />
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.gentle, delay: 1.6 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary/80 px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-secondary backdrop-blur">
          Move over the card to tilt it
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.gentle, delay: 1.2 }} className="flex flex-col gap-5">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-brand-secondary uppercase">Episode complete</p>
          <h1 className="text-display-sm font-semibold text-primary">Grade {result.grade} · {result.label}</h1>
        </div>
        <NibSays mood={['S', 'A', 'B'].includes(result.grade) ? 'cheer' : 'think'} className="justify-center">{praise}</NibSays>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-primary p-4 text-center ring-1 ring-secondary ring-inset">
            <LightningIcon className="mx-auto size-6 text-mint-600" weight="fill" />
            <p className="mt-1 text-display-xs font-semibold text-mint-700 tabular-nums">+{xp}</p><p className="text-sm text-tertiary">XP earned</p>
          </div>
          <div className="rounded-2xl bg-primary p-4 text-center ring-1 ring-secondary ring-inset">
            <FireIcon className="mx-auto size-6 text-fg-warning-primary" weight="fill" />
            <p className="mt-1 text-display-xs font-semibold text-primary tabular-nums">{streak}</p><p className="text-sm text-tertiary">{newDay ? 'Day streak, +1 today' : 'Day streak'}</p>
          </div>
        </div>

        <ul className="flex flex-col gap-2 rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
          {result.byStage.map((s, i) => (
            <li key={s.stage} className="flex items-center gap-3 text-sm">
              <span className="w-28 font-semibold text-secondary">{s.label}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <motion.span className={cx('block h-full rounded-full', s.right === s.total ? 'bg-mint-600' : 'bg-brand-solid')}
                  initial={{ width: 0 }} animate={{ width: `${(s.right / s.total) * 100}%` }} transition={{ ...springs.gentle, delay: 1.4 + i * 0.1 }} />
              </span>
              <span className="w-12 text-right font-semibold text-primary tabular-nums">{s.right}/{s.total}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-secondary p-3">
          <span className="px-2 text-sm font-semibold text-secondary">Show it off</span>
          <ShareCard data={{ l: lessonId, g: result.grade, p: result.percent, r: result.right, t: result.total, x: xp, s: streak, n: name, d: today() }} title={title} label={result.label} />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="xl" color="secondary" iconLeading={ArrowCounterClockwiseIcon} onPress={onReplay}>Replay episode</Button>
          {next ? <Button size="xl" href={next.href}>{next.label}</Button> : <Button size="xl" href={exitHref}>Back home</Button>}
        </div>
      </motion.div>
    </div>
  );
}
