// The onboarding survey: four quick questions, one per screen, about a minute in total.
// Everything finer (exact skill levels, which chapters, pace) is tuned later in the syllabus page.
// Questions are plain data, so adding or reordering one never touches the UI.
import type { Icon } from '@phosphor-icons/react';
import { BriefcaseIcon, BuildingsIcon, GraduationCapIcon, PlantIcon, StarIcon } from '@phosphor-icons/react/ssr';
import type { DomainId } from '@shape/engine';
import { SKILL_META } from '@/lib/skills';
import type { Answers } from '../profile';
import { ASPIRATIONS, PACE } from '../content';

export interface SurveyAnswers extends Answers {
  experience: string | null;
  daysPerWeek: number;
}

export const initialAnswers: SurveyAnswers = {
  name: '', aspiration: null, role: null, roleText: '', years: null, interests: [], ratings: {}, quizResults: {},
  minutesPerDay: 20, fromZero: false, experience: null, daysPerWeek: 5,
};

export interface Option { value: string; label: string; description?: string; icon?: Icon }

/** One experience answer stands in for "role" and "years", which the path engine reads. */
const EXPERIENCE: (Option & { role: string; roleText: string; years: string })[] = [
  { value: 'new', label: 'New to design', description: 'I’m just getting started', icon: PlantIcon, role: 'student', roleText: 'New to design', years: '0' },
  { value: 'learning', label: 'Learning design', description: 'Student, course or self-taught', icon: GraduationCapIcon, role: 'student', roleText: 'Learning design', years: '1' },
  { value: 'designer', label: 'Working designer', description: 'Up to 3 years in the job', icon: BriefcaseIcon, role: 'ux-designer', roleText: 'Designer', years: '2' },
  { value: 'senior', label: 'Experienced designer', description: '3+ years in the job', icon: StarIcon, role: 'product-designer', roleText: 'Experienced designer', years: '5' },
  { value: 'neighbour', label: 'I work near design', description: 'PM, engineering, marketing…', icon: BuildingsIcon, role: 'product-manager', roleText: 'Works near design', years: '2' },
];

interface Base { id: string; title: string; hint?: string; optional?: boolean }
export type Question =
  | Base & { kind: 'single'; options: Option[]; columns?: 1 | 2; get: (a: SurveyAnswers) => string | null; set: (v: string) => Partial<SurveyAnswers> }
  | Base & { kind: 'multi'; options: Option[]; get: (a: SurveyAnswers) => string[]; set: (v: string[]) => Partial<SurveyAnswers> };

const SKILL_IDS = Object.keys(SKILL_META) as DomainId[];

export const QUESTIONS: Question[] = [
  { id: 'aspiration', kind: 'single', columns: 2, title: 'What do you want to become?', hint: 'Pick the one that pulls you most. You can change it any time.',
    options: ASPIRATIONS.map(a => ({ value: a.id, label: a.label, description: a.description, icon: a.icon })), get: a => a.aspiration, set: aspiration => ({ aspiration }) },
  { id: 'experience', kind: 'single', title: 'Where are you starting from?',
    options: EXPERIENCE, get: a => a.experience,
    set: v => { const e = EXPERIENCE.find(x => x.value === v)!; return { experience: v, role: e.role, roleText: e.roleText, years: e.years }; } },
  { id: 'skills', kind: 'multi', optional: true, title: 'Anything you already do well?', hint: 'Tap the skills you use in real work. We’ll skip their basics. None is a fine answer.',
    options: SKILL_IDS.map(id => ({ value: id, label: SKILL_META[id].short, icon: SKILL_META[id].icon })),
    get: a => SKILL_IDS.filter(id => (a.ratings[id] ?? 0) >= 3),
    set: v => ({ ratings: Object.fromEntries(v.map(id => [id, 3])) }) },
  { id: 'pace', kind: 'single', title: 'How much time can you give on a learning day?', hint: 'Most people learn 5 days a week. You can change this later.',
    options: PACE.map(p => ({ value: p.value, label: p.hint, description: p.label })), get: a => String(a.minutesPerDay), set: v => ({ minutesPerDay: Number(v) }) },
];

export function isAnswered(q: Question, a: SurveyAnswers): boolean {
  if (q.optional) return true;
  return q.kind === 'single' ? q.get(a) != null : q.get(a).length > 0;
}
