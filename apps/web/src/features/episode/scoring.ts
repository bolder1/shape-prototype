// How an episode turns into a grade. Pure, so the rules are easy to read and tune in one place.
import { XP } from '../progress/store';
import { gradeFor } from './grades';

export type StageKey = 'check' | 'game' | 'gap' | 'quiz' | 'ladder';
export interface Scored { stage: StageKey; id: string; correct: boolean; /** Never answered (the ladder ended early): counts as a miss, not reviewed. */ unseen?: boolean }

export const STAGE_LABEL: Record<StageKey, string> = { check: 'Quick check', game: 'Game', gap: 'Your call', quiz: 'Rapid quiz', ladder: 'Prize ladder' };

export { GRADES } from './grades';

export function gradeEpisode(items: Scored[]) {
  const right = items.filter(i => i.correct).length;
  const percent = items.length ? Math.round((right / items.length) * 100) : 0;
  const g = gradeFor(percent);
  const byStage = (Object.keys(STAGE_LABEL) as StageKey[]).map(stage => {
    const s = items.filter(i => i.stage === stage);
    return { stage, label: STAGE_LABEL[stage], right: s.filter(i => i.correct).length, total: s.length };
  }).filter(s => s.total > 0);
  // Lesson bonus plus up to 60 for mastery: an episode is worth about one strong lesson, not twenty questions.
  const xp = XP.lessonBonus + Math.round(percent * 0.6);
  return { ...g, percent, right, total: items.length, byStage, xp };
}
