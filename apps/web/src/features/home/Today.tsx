'use client';
// The dashboard's "today" layer (docs/08-engagement-plan.md §5): quick actions, the Daily Brief, the next unlock,
// weekly quests, the badge shelf and the account prompt. Each piece is small and reads its own data.
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRightIcon, CardsThreeIcon, CheckIcon, CloudArrowUpIcon, FlagIcon, GiftIcon, PlayIcon, PuzzlePieceIcon,
  SlidersHorizontalIcon, TrophyIcon,
} from '@phosphor-icons/react/ssr';
import { BOSSES, CONTENT, dailyBrief } from '@shape/content';
import { chapterById, describeBadge, type BadgeState, type Quest } from '@shape/engine';
import { springs } from '@shape/ui';
import { cx } from '@/utils/cx';
import { BadgeMedal, tierLabel } from '../rewards/BadgeMedal';
import { useAccount } from '../account/session';
import type { LessonRecord } from '../progress/store';

const localDay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function readDaily(day: string): { right: boolean[] } | null {
  try { return (JSON.parse(localStorage.getItem('shape.daily.v1') ?? '{}') as Record<string, { right: boolean[] }>)[day] ?? null; } catch { return null; }
}

const card = 'rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset';

// ——— Quick actions ———

export function QuickActions({ next, due, dailyDone }: { next: { chapterId: string; n: number } | null; due: number; dailyDone: boolean }) {
  const actions = [
    next && { href: `/learn/${next.chapterId}/${next.n}`, icon: PlayIcon, label: 'Continue', primary: true },
    { href: '/daily', icon: PuzzlePieceIcon, label: dailyDone ? 'Daily Brief ✓' : 'Daily Brief' },
    { href: '/review', icon: CardsThreeIcon, label: due ? `Review · ${due}` : 'Review' },
    { href: '/league', icon: TrophyIcon, label: 'League' },
    { href: '/badges', icon: FlagIcon, label: 'Badges' },
    { href: '/syllabus', icon: SlidersHorizontalIcon, label: 'Syllabus' },
  ].filter(Boolean) as { href: string; icon: typeof PlayIcon; label: string; primary?: boolean }[];
  return (
    <nav aria-label="Quick actions" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
      <ul className="flex w-max gap-2 md:w-auto md:flex-wrap">
        {actions.map(a => (
          <li key={a.href}>
            <Link href={a.href} className={cx('inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap shadow-xs ring-1 transition ring-inset',
              a.primary ? 'bg-brand-solid text-white ring-transparent hover:bg-brand-solid_hover' : 'bg-primary text-secondary ring-secondary hover:bg-primary_hover hover:text-primary')}>
              <a.icon className="size-4" weight={a.primary ? 'fill' : 'bold'} />{a.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ——— Daily Brief ———

export function useDailyToday() {
  const [day] = useState(localDay);
  const [result] = useState(() => readDaily(day));
  return { day, result, number: dailyBrief(day).number };
}

export function DailyCard({ number, result }: { number: number; result: { right: boolean[] } | null }) {
  const score = result?.right.filter(Boolean).length ?? 0;
  return (
    <Link href="/daily" className={cx(card, 'group flex items-center gap-4 transition hover:bg-primary_hover')}>
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-utility-purple-50 ring-1 ring-utility-purple-200 ring-inset">
        <PuzzlePieceIcon className="size-6 text-utility-purple-700" weight="duotone" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold tracking-wide text-utility-purple-700 uppercase">Shape Daily #{number}</span>
        {result ? (
          <>
            <span className="mt-1 flex gap-1" aria-label={`${score} of ${result.right.length} right`}>
              {result.right.map((r, k) => <span key={k} className={cx('size-4 rounded', r ? (k >= 3 ? 'bg-utility-purple-500' : 'bg-mint-500') : 'bg-quaternary')} />)}
            </span>
            <span className="mt-1 block text-sm text-tertiary">{score}/{result.right.length} today. A new brief tomorrow.</span>
          </>
        ) : (
          <>
            <span className="block text-md font-semibold text-primary">Today’s brief is ready</span>
            <span className="block text-sm text-tertiary">Five questions, about two minutes. Same five for everyone.</span>
          </>
        )}
      </span>
      <ArrowRightIcon className="size-5 shrink-0 text-fg-quaternary transition group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

// ——— Next unlock ———

interface Unlock { label: string; detail: string; left: number; href: string; badge?: BadgeState }

/** The closest thing to earn: a badge tier, or a boss project that opens after a chapter's last lessons. */
export function nextUnlock(badges: BadgeState[], lessons: Record<string, LessonRecord>, chaptersOnPath: string[]): Unlock | null {
  const options: Unlock[] = [];
  for (const b of badges) {
    if (b.hidden || b.next === null) continue;
    const left = b.next - b.value;
    if (left > 0) options.push({ label: `${b.def.name} · ${tierLabel(b.tier === null ? 'bronze' : b.tier === 'bronze' ? 'silver' : 'gold')}`, detail: describeBadge(b), left, href: '/badges', badge: b });
  }
  for (const c of chaptersOnPath) {
    const ls = CONTENT[c]; if (!ls || !BOSSES[c]) continue;
    const done = ls.filter(l => lessons[l.id]).length;
    if (done > 0 && done < ls.length) {
      const left = ls.length - done;
      options.push({ label: `Boss project: ${BOSSES[c].title}`, detail: `Finish ${left} more ${left === 1 ? 'lesson' : 'lessons'} in ${chapterById[c].title} to open it`, left, href: `/learn/${c}/${ls.findIndex(l => !lessons[l.id]) + 1}` });
    }
  }
  return options.sort((a, b) => a.left - b.left)[0] ?? null;
}

export function NextUnlockCard({ unlock }: { unlock: Unlock }) {
  const progress = unlock.badge ? unlock.badge.progress : null;
  return (
    <Link href={unlock.href} className={cx(card, 'group flex items-center gap-4 transition hover:bg-primary_hover')}>
      {unlock.badge
        ? <BadgeMedal id={unlock.badge.def.id} kind={unlock.badge.def.kind} tier={null} size={48} />
        : <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-primary"><FlagIcon className="size-6 text-brand-secondary" weight="duotone" /></span>}
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold tracking-wide text-brand-secondary uppercase">Next unlock · {unlock.left} to go</span>
        <span className="block truncate text-md font-semibold text-primary">{unlock.label}</span>
        <span className="block text-sm text-tertiary">{unlock.detail}</span>
        {progress !== null && (
          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-tertiary">
            <motion.span className="block h-full rounded-full bg-brand-solid" initial={{ width: 0 }} animate={{ width: `${Math.max(4, progress * 100)}%` }} transition={springs.pop} />
          </span>
        )}
      </span>
      <ArrowRightIcon className="size-5 shrink-0 text-fg-quaternary transition group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

// ——— Weekly quests ———

export function QuestsCard({ quests, chest }: { quests: Quest[]; chest: boolean }) {
  const done = quests.filter(q => q.complete).length;
  return (
    <section className={card} aria-labelledby="quests-title">
      <div className="flex items-center gap-2">
        <h2 id="quests-title" className="text-md font-semibold text-primary">Weekly quests</h2>
        <span className="ml-auto text-sm font-semibold text-tertiary tabular-nums">{done}/{quests.length}</span>
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {quests.map(q => (
          <li key={q.id} className="flex items-center gap-3">
            <span className={cx('grid size-6 shrink-0 place-items-center rounded-full', q.complete ? 'bg-mint-600 text-white' : 'ring-2 ring-secondary ring-inset')}>
              {q.complete && <CheckIcon className="size-3.5" weight="bold" aria-label="Done" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cx('block text-sm font-medium', q.complete ? 'text-tertiary line-through decoration-1' : 'text-primary')}>{q.title}</span>
              {!q.complete && q.target > 1 && (
                <span className="mt-1 flex items-center gap-2">
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-tertiary"><span className="block h-full rounded-full bg-brand-solid" style={{ width: `${(q.done / q.target) * 100}%` }} /></span>
                  <span className="text-xs text-quaternary tabular-nums">{q.done}/{q.target}</span>
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className={cx('mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm', chest ? 'bg-success-primary font-semibold text-success-primary' : 'bg-secondary text-tertiary')}>
        <GiftIcon className="size-4 shrink-0" weight={chest ? 'fill' : 'regular'} aria-hidden />
        {chest ? 'Chest unlocked: all three done this week.' : 'Finish all three to open this week’s chest. New quests every Monday.'}
      </p>
    </section>
  );
}

// ——— Badge shelf ———

export function BadgeShelf({ earned, secretsLeft, total }: { earned: BadgeState[]; secretsLeft: number; total: number }) {
  const shown = [...earned].slice(-4).reverse();
  return (
    <Link href="/badges" className={cx(card, 'group block transition hover:bg-primary_hover')}>
      <div className="flex items-center gap-2">
        <h2 className="text-md font-semibold text-primary">Badges</h2>
        <span className="text-sm text-tertiary tabular-nums">{earned.length} of {total}</span>
        <ArrowRightIcon className="ml-auto size-4 text-fg-quaternary transition group-hover:translate-x-0.5" aria-hidden />
      </div>
      {shown.length ? (
        <ul className="mt-3 flex gap-3">
          {shown.map(b => (
            <li key={b.def.id} className="flex flex-col items-center gap-1" title={`${b.def.name} · ${tierLabel(b.tier!)}`}>
              <BadgeMedal id={b.def.id} kind={b.def.kind} tier={b.tier} size={44} />
              <span className="sr-only">{b.def.name}, {b.tier}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-tertiary">Finish your first lesson to earn one.</p>
      )}
      {secretsLeft > 0 && <p className="mt-3 text-xs text-quaternary">{secretsLeft} secret {secretsLeft === 1 ? 'badge' : 'badges'} left to find.</p>}
    </Link>
  );
}

// ——— Account ———

export function AccountCard() {
  const { status, sync } = useAccount();
  if (status === 'unconfigured' || status === 'loading') return <p className="px-1 text-xs text-quaternary">Progress is saved in this browser.</p>;
  if (status === 'signed-in') return <p className="px-1 text-xs text-quaternary">{sync === 'error' ? 'Couldn’t reach the server. Your progress is safe here and will sync later.' : 'Progress saved to your account.'}</p>;
  return (
    <Link href="/signin?next=/play" className={cx(card, 'group flex items-center gap-3 transition hover:bg-primary_hover')}>
      <CloudArrowUpIcon className="size-6 shrink-0 text-brand-secondary" weight="duotone" aria-hidden />
      <span className="flex-1">
        <span className="block text-md font-semibold text-primary">Save your progress</span>
        <span className="block text-sm text-tertiary">Sign in to keep your streak and badges on every device.</span>
      </span>
      <ArrowRightIcon className="size-4 shrink-0 text-fg-quaternary" aria-hidden />
    </Link>
  );
}
