// Checks and scoring for boss submissions. Pure functions: the web app, the AI review route
// and the tests all use these.
import type { BossAnswers, BossBrief, BossCriterion, BossField, Level } from './boss';

export const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** Blank answers in the right shape for each field. */
export const emptyAnswers = (brief: BossBrief): BossAnswers =>
  Object.fromEntries(brief.fields.map(f => [f.id, f.kind === 'list' ? Array.from({ length: f.items ?? 1 }, () => '') : '']));

/** Auto check for one field: is it filled in enough to count as an attempt? */
export function fieldReady(field: BossField, value: string | string[] | undefined): boolean {
  if (field.kind === 'list') {
    const items = Array.isArray(value) ? value : [];
    return items.filter(v => words(v) >= field.minWords).length >= (field.items ?? 1);
  }
  return typeof value === 'string' && words(value) >= field.minWords;
}

/** Every field passes its auto check, so the submission can go to review. */
export const bossReady = (brief: BossBrief, answers: BossAnswers) => brief.fields.every(f => fieldReady(f, answers[f.id]));

export type BossVerdict = 'distinction' | 'pass' | 'retry';
export interface BossScore { percent: number; verdict: BossVerdict; /** Required criteria scored below Solid. */ blockers: string[] }

/** Pass and distinction lines (docs/01-product-vision.md §7). */
export const PASS_AT = 70;
export const DISTINCTION_AT = 90;

/**
 * Turns rubric levels (0–3 per criterion id) into a percentage and a verdict.
 * A criterion with no level counts as 0.
 */
export function scoreBoss(rubric: BossCriterion[], levels: Record<string, Level>): BossScore {
  const max = rubric.reduce((sum, c) => sum + c.weight * 3, 0);
  const got = rubric.reduce((sum, c) => sum + c.weight * (levels[c.id] ?? 0), 0);
  const percent = max ? Math.round((got / max) * 100) : 0;
  // A required line below Solid fails the brief, whatever the total.
  const blockers = rubric.filter(c => c.required && (levels[c.id] ?? 0) < 2).map(c => c.id);
  const verdict: BossVerdict = blockers.length ? 'retry' : percent >= DISTINCTION_AT ? 'distinction' : percent >= PASS_AT ? 'pass' : 'retry';
  return { percent, verdict, blockers };
}
