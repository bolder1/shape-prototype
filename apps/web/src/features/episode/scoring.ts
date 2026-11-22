// How an episode turns into a grade. Pure, so the rules are easy to read and tune in one place.
import { XP } from '../progress/store';

export type StageKey = 'check' | 'game' | 'gap' | 'quiz' | 'ladder';
export interface Scored { stage: StageKey; id: string; correct: boolean; /** Never answered (the ladder ended early): counts as a miss, not reviewed. */ unseen?: boolean }

export const STAGE_LABEL: Record<StageKey, string> = { check: 'Quick check', game: 'Game', gap: 'Your call', quiz: 'Rapid quiz', ladder: 'Prize ladder' };

export const GRADES = [
  { min: 95, grade: 'S', label: 'Masterclass', colors: ['#139E6F', '#3B6FF5'] as [string, string], tokens: 4 },
  { min: 85, grade: 'A', label: 'Sharp', colors: ['#3B6FF5', '#8B5CF6'] as [string, string], tokens: 3 },
  { min: 70, grade: 'B', label: 'Solid', colors: ['#8B5CF6', '#D9467A'] as [string, string], tokens: 2 },
  { min: 50, grade: 'C', label: 'Getting there', colors: ['#1E2A4A', '#8B5CF6'] as [string, string], tokens: 1 },
  { min: 0, grade: 'D', label: 'Keep going', colors: ['#1E2A4A', '#475467'] as [string, string], tokens: 0 },
];

export function gradeEpisode(items: Scored[]) {
  const right = items.filter(i => i.correct).length;
  const percent = items.length ? Math.round((right / items.length) * 100) : 0;
  const g = GRADES.find(x => percent >= x.min)!;
  const byStage = (Object.keys(STAGE_LABEL) as StageKey[]).map(stage => {
    const s = items.filter(i => i.stage === stage);
    return { stage, label: STAGE_LABEL[stage], right: s.filter(i => i.correct).length, total: s.length };
  }).filter(s => s.total > 0);
  // Lesson bonus plus up to 60 for mastery: an episode is worth about one strong lesson, not twenty questions.
  const xp = XP.lessonBonus + Math.round(percent * 0.6);
  return { ...g, percent, right, total: items.length, byStage, xp };
}
