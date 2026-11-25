'use client';
// Badges and this week's quests for the current learner, recomputed whenever the event log or progress changes.
// The rules live in @shape/engine (rewards.ts); this hook only feeds them.
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { badgeStates, chestOpen, questProgress, statsFrom, weekOf, weeklyQuests, type BadgeState, type Quest } from '@shape/engine';
import { useProgress, dueReviews } from '../progress/store';
import { backfillEvents, getEvents, onEvent } from '../progress/events';
import { useAccount } from '../account/session';

export interface Rewards {
  badges: BadgeState[];
  earned: BadgeState[];
  /** Secret badges not found yet (the shelf shows only the count). */
  secretsLeft: number;
  quests: Quest[];
  chest: boolean;
  week: string;
}

/** `weeklyLessons`: the learner's own weekly lesson goal, so the main quest matches their plan. */
export function useRewards(weeklyLessons = 5): Rewards {
  const events = useSyncExternalStore(onEvent, getEvents, getEvents);
  const longest = useProgress(s => s.streak.longest);
  const reviewsDue = useProgress(s => dueReviews(s.review).length > 0);
  const userId = useAccount(s => s.user?.id ?? '');

  // Learners from before the event log: rebuild their history once.
  useEffect(() => { const { lessons, bosses } = useProgress.getState(); backfillEvents({ lessons, bosses }); }, []);

  return useMemo(() => {
    const stats = statsFrom(events, longest);
    const badges = badgeStates(stats);
    const week = weekOf(new Date());
    // A boss is "open" for quest purposes if any chapter has all its lessons done but no passing boss yet.
    const bossOpen = stats.chaptersDone > stats.bossesPassed.size;
    const quests = questProgress(weeklyQuests(week, { weeklyLessons, reviewsDue, bossOpen }, userId), events, week);
    return {
      badges,
      earned: badges.filter(b => b.tier),
      secretsLeft: badges.filter(b => b.hidden).length,
      quests,
      chest: chestOpen(quests),
      week,
    };
  }, [events, longest, reviewsDue, userId, weeklyLessons]);
}
