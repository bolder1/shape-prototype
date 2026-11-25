// The syllabus = the engine's recommended path, plus the learner's own edits on top.
// Edits are kept apart from answers, so changing a skill level re-plans the path without losing hand-picked chapters.
import { chapterById, type Tier } from '@shape/engine';
import { computeOutcome } from '../onboarding/profile';
import type { SurveyAnswers } from '../onboarding/survey/questions';
import type { SavedProfile, SyllabusEdits } from '../onboarding/storage';

export const NO_EDITS: SyllabusEdits = { removed: [], added: [] };

export const TIER_LABEL: Record<Tier, string> = { bar: 'Foundation', stem: 'Core', deep: 'Deep dive' };

/** Recommended chapters minus the removed ones, then the added ones in the order they were added. */
export function applyEdits(recommended: string[], edits: SyllabusEdits): string[] {
  const kept = recommended.filter(id => !edits.removed.includes(id));
  return [...kept, ...edits.added.filter(id => !kept.includes(id) && chapterById[id])];
}

/** Rebuilds the whole saved profile after answers or edits change. */
export function replan(answers: SurveyAnswers, edits: SyllabusEdits): SavedProfile & { recommended: string[] } {
  const o = computeOutcome(answers);
  const recommended = o.result.path.map(p => p.id);
  return {
    answers, edits, recommended, persona: o.persona, future: o.future, ready: o.ready,
    path: applyEdits(recommended, edits), savedAt: new Date().toISOString(),
  };
}

export function removeChapter(edits: SyllabusEdits, id: string, recommended: string[]): SyllabusEdits {
  return recommended.includes(id)
    ? { ...edits, removed: [...new Set([...edits.removed, id])] }
    : { ...edits, added: edits.added.filter(x => x !== id) };
}

export function addChapter(edits: SyllabusEdits, id: string, recommended: string[]): SyllabusEdits {
  return recommended.includes(id)
    ? { ...edits, removed: edits.removed.filter(x => x !== id) }
    : { ...edits, added: [...edits.added.filter(x => x !== id), id] };
}

/** Hours of learning in a list of chapters (same rule as the engine: 5 min a lesson + an hour for the project). */
export const hoursOf = (ids: string[]) => Math.round(ids.reduce((m, id) => m + (chapterById[id]?.lessons.length ?? 0) * 5 + 60, 0) / 60);
