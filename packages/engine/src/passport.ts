// Skill Passport (docs/08-engagement-plan.md §3): what a learner can show, derived from the event log alone.
// The public page runs this on the server over the `events` table; the owner's preview runs it in the browser.
// A project counts as *verified* only when the server checked its review receipt and set `data.verified`;
// the browser never sets that flag, and the server overwrites it.
import { chapterById, domainById, domains, type DomainId } from './curriculum';
import { badgeStates, statsFrom, type BadgeState, type RewardEvent } from './rewards';

export type SkillLevel = 0 | 1 | 2 | 3;
export const SKILL_LEVEL_NAME: Record<SkillLevel, string> = { 0: 'Not started', 1: 'Literacy', 2: 'Practitioner', 3: 'Expert' };
const TIER_TO_LEVEL = { bar: 1, stem: 2, deep: 3 } as const;

export interface PassportCredential {
  chapterId: string;
  title: string;
  skill: string;
  verdict: 'pass' | 'distinction';
  percent: number;
  at: string;          // when the best passing attempt was reviewed
  verified: boolean;   // reviewed by Shape's AI on the server, receipt checked
}

export interface PassportSkill {
  domain: DomainId;
  name: string;
  level: SkillLevel;       // the highest tier with a finished chapter
  chaptersDone: number;
  chaptersTotal: number;
  verified: boolean;       // at least one verified project in this skill
}

export interface PassportSummary {
  skills: PassportSkill[];             // skills with any finished chapter, strongest first
  credentials: PassportCredential[];   // passed projects, verified first, newest first
  badges: BadgeState[];                // earned badges only
  lessons: number;
  sGrades: number;
  activeDays: number;
  longestStreak: number;
}

const RANK = { pass: 1, distinction: 2 } as const;

/** Positive when `a` is the better attempt: verified first, then verdict, then score. */
function compareCredentials(a: PassportCredential, b: PassportCredential) {
  return (+a.verified - +b.verified) || (RANK[a.verdict] - RANK[b.verdict]) || (a.percent - b.percent);
}

export function passportFrom(events: RewardEvent[], longestStreak = 0): PassportSummary {
  const stats = statsFrom(events, longestStreak);

  // Best passing attempt per project. A verified attempt beats an unverified one; then the better verdict, then the score.
  const best = new Map<string, PassportCredential>();
  for (const e of events) {
    if (e.kind !== 'boss_submitted' || !e.ref || !chapterById[e.ref]) continue;
    const verdict = e.data?.verdict;
    if (verdict !== 'pass' && verdict !== 'distinction') continue;
    const ch = chapterById[e.ref];
    const c: PassportCredential = {
      chapterId: e.ref, title: ch.title, skill: domainById[ch.domain].name, verdict,
      percent: Number(e.data?.percent ?? 0), at: e.at, verified: e.data?.verified === true,
    };
    const prev = best.get(e.ref);
    if (!prev || compareCredentials(c, prev) > 0) best.set(e.ref, c);
  }
  const credentials = [...best.values()].sort((a, b) => +b.verified - +a.verified || b.at.localeCompare(a.at));

  const skills: PassportSkill[] = domains.map(d => {
    const done = d.chapters.filter(c => c.lessons.length && c.lessons.every((_, i) => stats.lessons.has(`${c.id}-${i + 1}`)));
    const level = done.reduce<SkillLevel>((m, c) => Math.max(m, TIER_TO_LEVEL[c.tier]) as SkillLevel, 0);
    return {
      domain: d.id, name: d.name, level, chaptersDone: done.length, chaptersTotal: d.chapters.length,
      verified: credentials.some(c => c.verified && chapterById[c.chapterId].domain === d.id),
    };
  }).filter(s => s.chaptersDone > 0).sort((a, b) => b.level - a.level || b.chaptersDone - a.chaptersDone);

  return {
    skills, credentials,
    badges: badgeStates(stats).filter(b => b.tier),
    lessons: stats.lessons.size, sGrades: stats.sGrades, activeDays: stats.activeDays.size, longestStreak: stats.longestStreak,
  };
}

/** Handles: 3–24 lowercase letters, digits and single inner hyphens, minus words the app needs for itself. */
export const RESERVED_HANDLES = new Set(['admin', 'api', 'app', 'auth', 'badges', 'boss', 'daily', 'help', 'league', 'learn', 'map', 'me', 'onboarding', 'passport', 'play', 'review', 'settings', 'shape', 'signin', 'support', 'syllabus', 'team', 'www']);
export function handleProblem(h: string): string | null {
  if (h.length < 3) return 'At least 3 characters.';
  if (h.length > 24) return 'At most 24 characters.';
  if (!/^[a-z0-9-]+$/.test(h)) return 'Lowercase letters, numbers and hyphens only.';
  if (h.startsWith('-') || h.endsWith('-') || h.includes('--')) return 'Hyphens go between letters, one at a time.';
  if (RESERVED_HANDLES.has(h)) return 'That one is reserved.';
  return null;
}
