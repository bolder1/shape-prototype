// localStorage keys shared between onboarding and the rest of the app (kept tiny so importing it is cheap).
import type { SurveyAnswers } from './survey/questions';

export const ONBOARDING_KEY = 'shape.onboarding.v1';
export const PROFILE_KEY = 'shape.profile.v1';

/** Changes the learner made to the computed path on the syllabus page. */
export interface SyllabusEdits {
  removed: string[];   // chapter ids taken off the path
  added: string[];     // chapter ids put on the path, in the order added
}

export interface SavedProfile {
  answers: SurveyAnswers;
  persona: string;
  future: string;
  ready: number;
  path: string[];   // chapter ids in path order, edits applied
  edits?: SyllabusEdits;
  savedAt: string;
}

/** Profiles saved by the older story flow lack the survey fields, so those get safe defaults. */
const SURVEY_DEFAULTS: Partial<SurveyAnswers> = { experience: null, daysPerWeek: 7 };

export function readProfile(): SavedProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as SavedProfile;
    return { ...p, answers: { ...SURVEY_DEFAULTS, ...p.answers } as SurveyAnswers };
  } catch { return null; }
}

export function writeProfile(p: SavedProfile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* storage blocked */ }
}
