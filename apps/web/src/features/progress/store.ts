'use client';
// Learner progress: XP, daily streak, completed lessons, review queue, boss projects.
// Kept in localStorage; when signed in it syncs to Supabase (features/account/sync.ts, table learner_state).
// XP is an append-only ledger (docs/03-backend.md §3): the total and weekly league scores are derived from it.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BossAnswers, BossVerdict, Level } from '@shape/content';
import { logEvent } from './events';

export interface StepResult { exerciseKey: string; firstTry: boolean; attempts: number }
export interface LessonRecord { completedAt: string; xp: number; firstTry: number; total: number }
export interface ReviewItem { exerciseKey: string; due: string; interval: number }
export interface BossReview { levels: Record<string, Level>; notes: Record<string, string>; summary: string; next: string; by: 'ai' | 'self';
  /** Server-signed proof of an AI review (signed-in learners only); makes the project a verified credential. */
  receipt?: { at: string; sig: string } | null }
export interface BossAttempt { at: string; answers: BossAnswers; review: BossReview; percent: number; verdict: BossVerdict }
export type XpKind = 'lesson' | 'review' | 'boss' | 'carryover';
export interface XpEvent { at: string; amount: number; kind: XpKind; ref?: string }
export interface BossRecord { attempts: BossAttempt[]; best: BossVerdict; bestPercent: number; xp: number }

/** XP rules (docs/01-product-vision.md §7): mastery, not clicks. */
export const XP = { firstTry: 10, afterRetry: 5, lessonBonus: 20, review: 3, bossPass: 50, bossDistinction: 25 } as const;

const RANK: Record<BossVerdict, number> = { retry: 0, pass: 1, distinction: 2 };
/** XP a verdict is worth in total; a later, better attempt earns only the difference. */
const bossXp = (v: BossVerdict) => (v === 'retry' ? 0 : XP.bossPass + (v === 'distinction' ? XP.bossDistinction : 0));

/** Appends a gain to the ledger; zero gains are not recorded. */
const earn = (ledger: XpEvent[], amount: number, kind: XpKind, ref?: string): XpEvent[] =>
  amount > 0 ? [...ledger, { at: new Date().toISOString(), amount, kind, ...(ref ? { ref } : {}) }] : ledger;

const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (days: number) => { const d = new Date(); d.setDate(d.getDate() + days); return dayKey(d); };
const yesterday = () => addDays(-1);

interface ProgressState {
  xp: number;
  /** Every XP gain, oldest first. Matches the xp_events table. */
  ledger: XpEvent[];
  streak: { current: number; longest: number; lastDay: string | null };
  lessons: Record<string, LessonRecord>;
  review: Record<string, ReviewItem>;
  bosses: Record<string, BossRecord>;
  /** Drafts in progress, autosaved while typing. */
  bossDrafts: Record<string, BossAnswers>;
  saveBossDraft: (chapterId: string, answers: BossAnswers) => void;
  submitBoss: (chapterId: string, attempt: BossAttempt) => { xp: number; streak: number; newDay: boolean; improved: boolean };
  /** `xp` overrides the per-answer rule (episodes score many more answers, so they pass their own total). */
  completeLesson: (lessonId: string, results: StepResult[], xp?: number) => { xp: number; streak: number; newDay: boolean };
  completeReview: (results: StepResult[]) => { xp: number; streak: number; newDay: boolean };
  reset: () => void;
}

/** Counts today toward the streak (once per day). */
function bumpStreak(s: ProgressState['streak']) {
  const today = dayKey();
  if (s.lastDay === today) return { streak: s, newDay: false };
  const current = s.lastDay === yesterday() ? s.current + 1 : 1;
  return { streak: { current, longest: Math.max(s.longest, current), lastDay: today }, newDay: true };
}

export const useProgress = create<ProgressState>()(persist((set, get) => ({
  xp: 0,
  ledger: [],
  streak: { current: 0, longest: 0, lastDay: null },
  lessons: {},
  review: {},
  bosses: {},
  bossDrafts: {},

  saveBossDraft: (chapterId, answers) => set(s => ({ bossDrafts: { ...s.bossDrafts, [chapterId]: answers } })),

  submitBoss: (chapterId, attempt) => {
    const s = get();
    const prev = s.bosses[chapterId];
    const best = prev && RANK[prev.best] >= RANK[attempt.verdict] ? prev.best : attempt.verdict;
    const gained = Math.max(0, bossXp(best) - (prev?.xp ?? 0));
    // Only a passing attempt counts toward the streak, like a finished lesson.
    const { streak, newDay } = attempt.verdict === 'retry' ? { streak: s.streak, newDay: false } : bumpStreak(s.streak);
    const bossDrafts = { ...s.bossDrafts };
    if (attempt.verdict !== 'retry') delete bossDrafts[chapterId];
    set({
      xp: s.xp + gained, ledger: earn(s.ledger, gained, 'boss', chapterId), streak, bossDrafts,
      bosses: { ...s.bosses, [chapterId]: { attempts: [...(prev?.attempts ?? []), attempt], best, bestPercent: Math.max(prev?.bestPercent ?? 0, attempt.percent), xp: (prev?.xp ?? 0) + gained } },
    });
    logEvent('boss_submitted', chapterId, { verdict: attempt.verdict, percent: attempt.percent, xp: gained, by: attempt.review.by, ...(attempt.review.receipt ? { receipt: attempt.review.receipt } : {}) });
    return { xp: gained, streak: streak.current, newDay, improved: !prev || RANK[attempt.verdict] > RANK[prev.best] };
  },

  completeLesson: (lessonId, results, xp) => {
    const s = get();
    const gained = xp ?? results.reduce((x, r) => x + (r.firstTry ? XP.firstTry : XP.afterRetry), 0) + XP.lessonBonus;
    const { streak, newDay } = bumpStreak(s.streak);
    // Anything missed on the first try comes back tomorrow.
    const review = { ...s.review };
    for (const r of results) if (!r.firstTry) review[r.exerciseKey] = { exerciseKey: r.exerciseKey, due: addDays(1), interval: 1 };
    const prev = s.lessons[lessonId];
    set({
      xp: s.xp + gained, ledger: earn(s.ledger, gained, 'lesson', lessonId), streak, review,
      lessons: { ...s.lessons, [lessonId]: { completedAt: new Date().toISOString(), xp: (prev?.xp ?? 0) + gained, firstTry: results.filter(r => r.firstTry).length, total: results.length } },
    });
    logEvent('lesson_done', lessonId, { xp: gained, firstTry: results.filter(r => r.firstTry).length, total: results.length });
    return { xp: gained, streak: streak.current, newDay };
  },

  completeReview: (results) => {
    const s = get();
    const review = { ...s.review };
    let gained = 0;
    for (const r of results) {
      const item = review[r.exerciseKey];
      if (!item) continue;
      if (r.firstTry) {
        gained += XP.review;
        const interval = Math.round(item.interval * 2.5);       // 1 → 3 → 8 → 20 days
        if (interval > 30) delete review[r.exerciseKey];          // learned: retire it
        else review[r.exerciseKey] = { ...item, interval, due: addDays(interval) };
      } else {
        review[r.exerciseKey] = { ...item, interval: 1, due: addDays(1) };
      }
    }
    const { streak, newDay } = bumpStreak(s.streak);
    set({ xp: s.xp + gained, ledger: earn(s.ledger, gained, 'review'), streak, review });
    logEvent('review_done', undefined, { xp: gained, right: results.filter(r => r.firstTry).length, total: results.length });
    return { xp: gained, streak: streak.current, newDay };
  },

  reset: () => set({ xp: 0, ledger: [], streak: { current: 0, longest: 0, lastDay: null }, lessons: {}, review: {}, bosses: {}, bossDrafts: {} }),
}), {
  name: 'shape.progress.v1', version: 3,
  migrate: (state, version) => {
    let s = state as ProgressState;
    if (version < 2) s = { ...s, bosses: {}, bossDrafts: {} };   // v1 had no boss projects
    if (version < 3) s = { ...s, ledger: backfillLedger(s) };     // v2 kept only the XP total
    return s;
  },
}));

/** Rebuilds a ledger from v2 records: lessons and bosses carry dates; the rest (reviews) becomes one carryover entry. */
function backfillLedger(s: ProgressState): XpEvent[] {
  const events: XpEvent[] = Object.entries(s.lessons ?? {}).map(([ref, l]) => ({ at: l.completedAt, amount: l.xp, kind: 'lesson', ref }));
  for (const [ref, b] of Object.entries(s.bosses ?? {})) {
    if (b.xp > 0) events.push({ at: b.attempts.at(-1)?.at ?? new Date().toISOString(), amount: b.xp, kind: 'boss', ref });
  }
  const rest = (s.xp ?? 0) - events.reduce((t, e) => t + e.amount, 0);
  if (rest > 0) {
    const at = s.streak?.lastDay ? new Date(`${s.streak.lastDay}T12:00:00`).toISOString() : new Date().toISOString();
    events.push({ at, amount: rest, kind: 'carryover' });
  }
  return events.sort((a, b) => a.at.localeCompare(b.at));
}

/** The boss is open once every playable lesson in its chapter is done. */
export const bossUnlocked = (lessonIds: string[], lessons: Record<string, LessonRecord>) => lessonIds.length > 0 && lessonIds.every(id => lessons[id]);

/** Review items due today or earlier. */
export const dueReviews = (review: Record<string, ReviewItem>) => Object.values(review).filter(r => r.due <= dayKey());

/** True when today already counts toward the streak. */
export const doneToday = (lastDay: string | null) => lastDay === dayKey();

/** A streak is alive if it was extended today or yesterday. */
export const liveStreak = (s: ProgressState['streak']) => (s.lastDay === dayKey() || s.lastDay === yesterday() ? s.current : 0);

export const exerciseKey = (lessonId: string, exerciseId: string) => `${lessonId}:${exerciseId}`;
export const parseExerciseKey = (key: string) => { const [lessonId, exerciseId] = key.split(':'); return { lessonId, exerciseId }; };
