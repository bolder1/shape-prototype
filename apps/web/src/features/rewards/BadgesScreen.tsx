'use client';
// Every badge, grouped by kind: the ones you hold with their tier, the ones ahead with how far you've got,
// and secret ones as question marks until you find them.
import { motion } from 'motion/react';
import { BADGE_TIERS, describeBadge, type BadgeKind, type BadgeState } from '@shape/engine';
import { stagger } from '@shape/ui';
import { cx } from '@/utils/cx';
import { readProfile } from '../onboarding/storage';
import { weeklyLessonGoal } from '../home/plan';
import { AppHeader } from '../app/AppHeader';
import { BadgeMedal, tierLabel } from './BadgeMedal';
import { useRewards } from './useRewards';

const GROUPS: { kind: BadgeKind; title: string; blurb: string }[] = [
  { kind: 'mastery', title: 'Mastery', blurb: 'What you know.' },
  { kind: 'craft', title: 'Craft', blurb: 'What you can make.' },
  { kind: 'habit', title: 'Habit', blurb: 'Showing up.' },
  { kind: 'social', title: 'Sharing', blurb: 'Putting your work out there.' },
  { kind: 'secret', title: 'Secret', blurb: 'Found by doing. No hints.' },
];

export default function BadgesScreen() {
  const profile = readProfile();
  const { badges, earned } = useRewards(profile ? weeklyLessonGoal(profile.answers) : 5);
  return (
    <div className="min-h-dvh bg-secondary">
      <AppHeader name={profile?.answers.name} />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 md:px-6">
        <header>
          <h1 className="text-display-xs font-semibold tracking-tight text-primary md:text-display-sm">Badges</h1>
          <p className="mt-1 text-md text-tertiary">{earned.length} of {badges.length} earned. Most have three tiers: bronze, silver and gold.</p>
        </header>
        {GROUPS.map(g => {
          const list = badges.filter(b => b.def.kind === g.kind);
          return (
            <section key={g.kind} aria-labelledby={`g-${g.kind}`}>
              <h2 id={`g-${g.kind}`} className="text-lg font-semibold text-primary">{g.title}</h2>
              <p className="text-sm text-tertiary">{g.blurb}</p>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {list.map((b, i) => <BadgeRow key={b.def.id} b={b} i={i} />)}
              </ul>
            </section>
          );
        })}
      </main>
    </div>
  );
}

function BadgeRow({ b, i }: { b: BadgeState; i: number }) {
  const tiers = b.def.tiers.length > 1;
  return (
    <motion.li initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={stagger(i)}
      className={cx('flex items-center gap-4 rounded-2xl p-4 ring-1 ring-inset', b.tier ? 'bg-primary shadow-xs ring-secondary' : 'bg-primary/60 ring-secondary')}>
      <BadgeMedal id={b.def.id} kind={b.def.kind} tier={b.tier} hidden={b.hidden} size={56} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2">
          <span className={cx('font-semibold', b.tier ? 'text-primary' : 'text-secondary')}>{b.hidden ? 'Secret badge' : b.def.name}</span>
          {b.tier && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary">{tierLabel(b.tier)}</span>}
        </p>
        <p className="text-sm text-tertiary">
          {b.hidden ? 'Keep learning. You’ll know it when you find it.' : b.next === null ? (b.def.kind === 'secret' ? b.def.describe : 'Gold. Nothing left to earn here.') : describeBadge(b)}
        </p>
        {!b.hidden && b.next !== null && (
          <div className="mt-2 flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-tertiary">
              <span className="block h-full rounded-full bg-brand-solid" style={{ width: `${Math.max(2, b.progress * 100)}%` }} />
            </span>
            <span className="text-xs text-quaternary tabular-nums">{b.value}/{b.next}</span>
          </div>
        )}
        {tiers && !b.hidden && (
          <p className="mt-2 flex gap-1.5" aria-label="Tiers">
            {BADGE_TIERS.map((t, k) => (
              <span key={t} className={cx('rounded px-1.5 py-0.5 text-[11px] font-semibold', b.tier && BADGE_TIERS.indexOf(b.tier) >= k ? 'bg-secondary text-secondary' : 'text-quaternary')}>
                {tierLabel(t)} {b.def.tiers[k]}
              </span>
            ))}
          </p>
        )}
      </div>
    </motion.li>
  );
}
