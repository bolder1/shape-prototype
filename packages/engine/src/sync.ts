// Merging two copies of a learner's progress: the one in this browser and the one on the server.
// Happens on sign-in (and whenever a newer server copy arrives), so nothing earned on either device is lost.
// Pure and structural: it knows the shape of `shape.progress.v1` (apps/web/src/features/progress/store.ts), not the store.

export type XpKind = 'lesson' | 'review' | 'boss' | 'carryover';
export interface XpEvent { at: string; amount: number; kind: XpKind; ref?: string }
export interface LessonRecord { completedAt: string; xp: number; firstTry: number; total: number }
export interface ReviewItem { exerciseKey: string; due: string; interval: number }
export interface Streak { current: number; longest: number; lastDay: string | null }
export interface BossAttemptLike { at: string; verdict: 'retry' | 'pass' | 'distinction'; percent: number }
export interface BossRecordLike<A extends BossAttemptLike = BossAttemptLike> { attempts: A[]; best: A['verdict']; bestPercent: number; xp: number }

export interface ProgressSnapshot<A extends BossAttemptLike = BossAttemptLike, D = unknown> {
  xp: number;
  ledger: XpEvent[];
  streak: Streak;
  lessons: Record<string, LessonRecord>;
  review: Record<string, ReviewItem>;
  bosses: Record<string, BossRecordLike<A>>;
  bossDrafts: Record<string, D>;
}

const RANK = { retry: 0, pass: 1, distinction: 2 } as const;
const eventKey = (e: XpEvent) => `${e.at}|${e.kind}|${e.ref ?? ''}|${e.amount}`;

/** Every XP gain from both sides, once each, oldest first. The same gain on both sides has the same timestamp. */
export function mergeLedger(a: XpEvent[], b: XpEvent[]): XpEvent[] {
  const seen = new Map<string, XpEvent>();
  for (const e of [...a, ...b]) seen.set(eventKey(e), e);
  return [...seen.values()].sort((x, y) => x.at.localeCompare(y.at));
}

/** A lesson done on either device is done; keep the latest run's score and the larger XP earned. */
export function mergeLessons(a: Record<string, LessonRecord>, b: Record<string, LessonRecord>) {
  const out = { ...a };
  for (const [id, r] of Object.entries(b)) {
    const l = out[id];
    out[id] = !l ? r : { ...(r.completedAt > l.completedAt ? r : l), xp: Math.max(l.xp, r.xp) };
  }
  return out;
}

/** A card due on either side stays in the queue; if both have it, the sooner due date wins (forgetting is the risk). */
export function mergeReview(a: Record<string, ReviewItem>, b: Record<string, ReviewItem>) {
  const out = { ...a };
  for (const [k, r] of Object.entries(b)) if (!out[k] || r.due < out[k].due) out[k] = r;
  return out;
}

/** Boss attempts from both sides, once each; the best verdict and percent across all of them. */
export function mergeBosses<A extends BossAttemptLike>(a: Record<string, BossRecordLike<A>>, b: Record<string, BossRecordLike<A>>) {
  const out = { ...a };
  for (const [id, r] of Object.entries(b)) {
    const l = out[id];
    if (!l) { out[id] = r; continue; }
    const byAt = new Map<string, A>();
    for (const t of [...l.attempts, ...r.attempts]) byAt.set(t.at, t);
    const attempts = [...byAt.values()].sort((x, y) => x.at.localeCompare(y.at));
    const best = attempts.reduce<A['verdict']>((v, t) => (RANK[t.verdict] > RANK[v] ? t.verdict : v), 'retry');
    out[id] = { attempts, best, bestPercent: Math.max(l.bestPercent, r.bestPercent), xp: Math.max(l.xp, r.xp) };
  }
  return out;
}

/**
 * Two streak records for the same learner, kept on two devices. Days are local `YYYY-MM-DD` strings.
 * `today` is passed in so the rule is testable.
 */
export function mergeStreak(local: Streak, remote: Streak, today: string): Streak {
  // TODO(human): decide which streak survives a merge.
  void remote; void today;
  return local;
}

/** Merges two progress snapshots. XP is re-derived from the merged ledger, so it can't drift from it. */
export function mergeProgress<A extends BossAttemptLike, D>(local: ProgressSnapshot<A, D>, remote: ProgressSnapshot<A, D>, today: string): ProgressSnapshot<A, D> {
  const ledger = mergeLedger(local.ledger ?? [], remote.ledger ?? []);
  return {
    xp: ledger.reduce((t, e) => t + e.amount, 0),
    ledger,
    streak: mergeStreak(local.streak, remote.streak, today),
    lessons: mergeLessons(local.lessons ?? {}, remote.lessons ?? {}),
    review: mergeReview(local.review ?? {}, remote.review ?? {}),
    bosses: mergeBosses(local.bosses ?? {}, remote.bosses ?? {}),
    bossDrafts: { ...(remote.bossDrafts ?? {}), ...(local.bossDrafts ?? {}) },   // drafts: this device's typing wins
  };
}
