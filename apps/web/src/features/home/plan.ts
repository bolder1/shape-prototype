// The learner's weekly plan: turns survey answers into a lesson target, and the XP ledger into this week's activity.
import type { SurveyAnswers } from '../onboarding/survey/questions';
import type { XpEvent } from '../progress/store';

/** Average length of a lesson in minutes, across the chapters written so far. */
export const AVG_LESSON_MINUTES = 8;

/**
 * How many lessons a week the dashboard asks for, from the time the learner said they have.
 * Shown on the plan-ready screen and as the weekly goal ring on the dashboard.
 */
export function weeklyLessonGoal(a: Pick<SurveyAnswers, 'minutesPerDay' | 'daysPerWeek'>): number {
  // TODO(human): turn the learner's weekly time into a lesson target they will actually hit.
  // The placeholder below spends every minute on new lessons, so 30 min × 5 days gives 19 a week.
  return Math.max(1, Math.round((a.minutesPerDay * a.daysPerWeek) / AVG_LESSON_MINUTES));
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** Monday-first week: for each day, whether the learner earned XP, and which day is today. */
export function thisWeek(ledger: XpEvent[], now = new Date()) {
  const monday = new Date(now); monday.setHours(0, 0, 0, 0); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const active = new Set(ledger.map(e => dayKey(new Date(e.at))));
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, n) => {
    const d = new Date(monday); d.setDate(monday.getDate() + n);
    return { label, active: active.has(dayKey(d)), today: dayKey(d) === dayKey(now), future: d > now };
  });
}

/** Lessons completed since Monday. */
export function lessonsThisWeek(ledger: XpEvent[], now = new Date()) {
  const monday = new Date(now); monday.setHours(0, 0, 0, 0); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return ledger.filter(e => e.kind === 'lesson' && new Date(e.at) >= monday).length;
}
