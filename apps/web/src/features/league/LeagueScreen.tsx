'use client';
import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { CaretDoubleDownIcon, CaretDoubleUpIcon, CheckCircleIcon, LightningIcon, TimerIcon, TrophyIcon } from '@phosphor-icons/react/ssr';
import { GROUP_SIZE, MOVE, TIERS, TOP_TIER, weekEndsAt, type TierRank, type WeekResult } from '@shape/engine';
import { popIn, springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badges';
import { cx } from '@/utils/cx';
import { readProfile } from '../onboarding/storage';
import { AppHeader } from '../app/AppHeader';
import { tierName, timeLeft, useLeague } from './store';

/** Client-only: reads progress and league from this browser. */
export default function LeagueScreen() {
  const [profile] = useState(readProfile);
  const name = profile?.answers.name || 'You';
  const { tier, joined, week, xp, table, you, now, result, acknowledge } = useLeague(name);
  const up = tier < TOP_TIER, down = tier > 1;

  return (
    <div className="min-h-dvh bg-secondary">
      <AppHeader name={profile?.answers.name} />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-6">
        <AnimatePresence>{result && <ResultBanner key={result.week} result={result} onDone={acknowledge} />}</AnimatePresence>

        <section className="overflow-hidden rounded-2xl bg-brand-solid p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <motion.span {...popIn} className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 ring-inset">
              <TrophyIcon className="size-8 text-mint-400" weight="duotone" />
            </motion.span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-200">League {tier} of {TOP_TIER}</p>
              <h1 className="text-display-xs font-semibold">{tierName(tier)} league</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-200"><TimerIcon className="size-4" />Ends in {timeLeft(weekEndsAt(week), now)}</p>
            </div>
          </div>
          <ol aria-label="League tiers" className="mt-5 flex gap-1.5">
            {TIERS.map((t, i) => (
              <li key={t} title={t} className={cx('h-2 flex-1 rounded-full', i + 1 === tier ? 'bg-mint-500' : i + 1 < tier ? 'bg-white/40' : 'bg-white/10')}>
                <span className="sr-only">{t}{i + 1 === tier ? ' (you are here)' : ''}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-brand-200">
            {up && <>Top {MOVE} move up to <span className="font-semibold text-white">{tierName((tier + 1) as TierRank)}</span>. </>}
            {down ? <>Bottom {MOVE} drop to {tierName((tier - 1) as TierRank)}.</> : 'Nobody drops out of the first league.'}
          </p>
        </section>

        {!joined && (
          <section className="flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset sm:flex-row sm:items-center">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-primary">Earn XP to join this week’s league</h2>
              <p className="text-sm text-tertiary">You join as soon as you pass a check, a review or a project. Weeks off don’t count against you.</p>
            </div>
            <Button size="md" href="/play">Start a lesson</Button>
          </section>
        )}

        <section className="rounded-2xl bg-primary p-2 ring-1 ring-secondary ring-inset">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="text-lg font-semibold text-primary">This week</h2>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-mint-700"><LightningIcon className="size-4" weight="fill" />{xp} XP · #{you.rank}</span>
          </div>
          <LayoutGroup>
            <ol aria-label={`${tierName(tier)} league table`}>
              {table.map(row => (
                <motion.li key={row.id} layout="position" transition={springs.gentle}>
                  {up && row.rank === MOVE + 1 && <ZoneLine kind="up" />}
                  {down && row.rank === GROUP_SIZE - MOVE + 1 && <ZoneLine kind="down" />}
                  <div aria-current={row.you ? 'true' : undefined}
                    className={cx('flex items-center gap-3 rounded-xl px-4 py-2.5', row.you && 'bg-mint-500/10 ring-1 ring-mint-500/40 ring-inset')}>
                    <span className={cx('w-6 text-right text-sm font-semibold tabular-nums',
                      row.zone === 'up' ? 'text-success-primary' : row.zone === 'down' ? 'text-error-primary' : 'text-tertiary')}>{row.rank}</span>
                    <span aria-hidden className={cx('grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold',
                      row.you ? 'bg-brand-solid text-white' : 'bg-secondary text-secondary')}>{row.name[0].toUpperCase()}</span>
                    <span className="min-w-0 flex-1 truncate text-md font-semibold text-primary">{row.name}</span>
                    {row.you && <Badge type="pill-color" color="success" size="sm">You</Badge>}
                    <span className="w-20 text-right text-sm font-semibold text-secondary tabular-nums">{row.xp} XP</span>
                  </div>
                </motion.li>
              ))}
            </ol>
          </LayoutGroup>
        </section>

        <p className="px-1 text-xs text-quaternary">
          XP comes only from mastery: passed checks, due reviews and projects. Until accounts arrive, the other players are practice rivals and your league is saved in this browser.
        </p>
      </main>
    </div>
  );
}

function ZoneLine({ kind }: { kind: 'up' | 'down' }) {
  const Icon = kind === 'up' ? CaretDoubleUpIcon : CaretDoubleDownIcon;
  return (
    <div className={cx('flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide uppercase', kind === 'up' ? 'text-success-primary' : 'text-error-primary')}>
      <span className="h-px flex-1 bg-current opacity-30" />
      <Icon className="size-3.5" weight="bold" />{kind === 'up' ? 'Promotion zone above' : 'Demotion zone below'}
      <span className="h-px flex-1 bg-current opacity-30" />
    </div>
  );
}

const RESULT_COPY: Record<WeekResult['outcome'], { title: (r: WeekResult) => string; icon: typeof CheckCircleIcon; tone: string }> = {
  promoted: { title: r => `You moved up to ${tierName(r.nextTier)}`, icon: CaretDoubleUpIcon, tone: 'bg-success-primary text-success-primary' },
  stayed: { title: r => `You stayed in ${tierName(r.nextTier)}`, icon: CheckCircleIcon, tone: 'bg-secondary text-secondary' },
  demoted: { title: r => `You dropped to ${tierName(r.nextTier)}`, icon: CaretDoubleDownIcon, tone: 'bg-error-primary text-error-primary' },
};

/** Last week's outcome, shown once. */
function ResultBanner({ result, onDone }: { result: WeekResult; onDone: () => void }) {
  const c = RESULT_COPY[result.outcome];
  return (
    <motion.section {...popIn} exit={{ opacity: 0, y: -8, transition: springs.gentle }} role="status"
      className="flex flex-col gap-4 rounded-2xl bg-primary p-5 shadow-md ring-1 ring-secondary ring-inset sm:flex-row sm:items-center">
      <span className={cx('grid size-12 shrink-0 place-items-center rounded-xl', c.tone)}><c.icon className="size-6" weight="bold" /></span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-tertiary">Last week · {tierName(result.tier)} league</p>
        <h2 className="text-lg font-semibold text-primary">{c.title(result)}</h2>
        <p className="text-sm text-tertiary">You finished #{result.rank} with {result.xp} XP.</p>
      </div>
      <Button size="md" color="secondary" onPress={onDone}>Got it</Button>
    </motion.section>
  );
}
