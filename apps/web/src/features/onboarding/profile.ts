// Turns onboarding answers into an engine profile and a computed path.
import { buildPath, ROLE_HOME, type DomainId, type PathResult, type Profile } from '@shape/engine';
import { FAMILY_ORDER, skillsInFamily } from '@/lib/skills';
import { ASPIRATIONS, PERSONA } from './content';

export interface Answers {
  name: string;
  aspiration: string | null;
  role: string | null;          // id from ROLES, or null when typed
  roleText: string;             // what the learner typed / picked
  years: string | null;
  interests: DomainId[];
  ratings: Partial<Record<DomainId, number>>;
  quizResults: Partial<Record<DomainId, boolean>>;
  minutesPerDay: number;
  fromZero: boolean;
  /** Learning days a week. The survey asks; the older story flow assumed every day. */
  daysPerWeek?: number;
}

/** Skills in the order the journey visits them: station by station along the road. */
export const JOURNEY: DomainId[] = FAMILY_ORDER.flatMap(f => skillsInFamily(f));

export function toProfile(a: Answers): Profile {
  const asp = ASPIRATIONS.find(x => x.id === a.aspiration) ?? ASPIRATIONS[ASPIRATIONS.length - 1];
  const home = a.role ? ROLE_HOME[a.role] ?? null : null;
  const spine = asp.spine ? [asp.spine] : asp.goal === 'product-literate' && home ? [home] : [];
  const calibration = Object.fromEntries(Object.entries(a.quizResults).map(([k, ok]) => [k, ok ? 1 : 0.5]));
  return {
    goal: asp.goal, spine, interests: a.interests,
    weeklyHours: Math.max(1, Math.round((a.minutesPerDay * (a.daysPerWeek ?? 7)) / 60)),
    selfRating: a.fromZero ? {} : a.ratings,
    calibration: a.fromZero ? {} : calibration,
  };
}

export interface Outcome { result: PathResult; persona: string; future: string; ready: number }

export function computeOutcome(a: Answers): Outcome {
  const result = buildPath(toProfile(a));
  const top = [...result.tshape.columns].sort((x, y) => y.current - x.current)[0];
  const persona = top && top.current > 0 ? PERSONA[top.domain] : 'Fresh Explorer';
  const asp = ASPIRATIONS.find(x => x.id === a.aspiration);
  const now = result.tshape.columns.reduce((s, c) => s + c.current, 0);
  const goal = result.tshape.columns.reduce((s, c) => s + c.target, 0);
  return { result, persona, future: asp?.future ?? 'Product Designer', ready: goal ? Math.round((now / goal) * 100) : 0 };
}

/** The three strongest skills (ties follow journey order): what the quick check asks about. */
export function quizSkills(ratings: Answers['ratings']): DomainId[] {
  return [...JOURNEY].sort((x, y) => (ratings[y] ?? 0) - (ratings[x] ?? 0) || JOURNEY.indexOf(x) - JOURNEY.indexOf(y)).slice(0, 3);
}
