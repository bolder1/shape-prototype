// localStorage keys shared between onboarding and the rest of the app (kept tiny so importing it is cheap).
import type { OnboardingContext } from './machine';

export const ONBOARDING_KEY = 'shape.onboarding.v1';
export const PROFILE_KEY = 'shape.profile.v1';

export interface SavedProfile {
  answers: OnboardingContext;
  persona: string;
  future: string;
  ready: number;
  path: string[];   // chapter ids in path order
  savedAt: string;
}

export function readProfile(): SavedProfile | null {
  try { const raw = localStorage.getItem(PROFILE_KEY); return raw ? JSON.parse(raw) as SavedProfile : null; } catch { return null; }
}
