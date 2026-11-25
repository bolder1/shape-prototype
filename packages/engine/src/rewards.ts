// Badges and weekly quests (docs/08-engagement-plan.md §1–2): pure rules over the learner's event log, so a new badge
// is a few lines here and needs no new storage. The web app logs events (apps/web/src/features/progress/events.ts);
// the same rules can run on the server over the `events` table.
import { chapterById, chapters, DOMAIN_IDS, type DomainId } from './curriculum';
import { weekOf } from './league';

export interface RewardEvent { kind: string; ref?: string; data?: Record<string, unknown>; at: string }

export type BadgeKind = 'mastery' | 'craft' | 'habit' | 'social' | 'secret';
export type BadgeTier = 'bronze' | 'silver' | 'gold';
export const BADGE_TIERS: BadgeTier[] = ['bronze', 'silver', 'gold'];

export interface BadgeDef {
  id: string; name: string; kind: BadgeKind;
  /** What earns it, with `{n}` standing for the next tier's threshold. */
  describe: string;
  /** One threshold per tier, bronze first. Secret badges have one. */
  tiers: number[];
  measure: (s: Stats) => number;
}

/** Everything badges and quests are measured from, derived once from the events. */
export interface Stats {
  lessons: Set<string>;                    // lesson ids finished
  best: Map<string, number>;               // lesson id → best percent
  sGrades: number;                         // lessons whose best grade is S
  perfect: number;                         // episodes finished at 100%
  chaptersMastered: number;                // chapters with every lesson at S
  chaptersDone: number;                    // chapters with every lesson finished
  domainsTouched: number;                  // skill families with a finished chapter
  bossesPassed: Set<string>;
  bossesDistinction: Set<string>;
  bossComebacks: number;                   // bosses passed after a retry verdict
  reviews: number;                         // review sessions finished
  shares: number;
  activeDays: Set<string>;                 // local YYYY-MM-DD days with any learning
  longestStreak: number;
  nightOwl: boolean;                       // a lesson finished between midnight and 4 am
  longestBreak: number;                    // the biggest gap (days) between active days, before coming back
}

const S_MIN = 95;   // the S band in apps/web/src/features/episode/grades.ts (keep in step)
const LEARNING = new Set(['lesson_done', 'review_done', 'boss_submitted']);

const localDay = (iso: string) => { const d = new Date(iso); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const lessonIdsOf = (chapterId: string) => (chapterById[chapterId]?.lessons ?? []).map((_, i) => `${chapterId}-${i + 1}`);

/** Folds the event log into the numbers the badges and quests read. `longestStreak` comes from the progress store. */
export function statsFrom(events: RewardEvent[], longestStreak = 0): Stats {
  const s: Stats = {
    lessons: new Set(), best: new Map(), sGrades: 0, perfect: 0, chaptersMastered: 0, chaptersDone: 0, domainsTouched: 0,
    bossesPassed: new Set(), bossesDistinction: new Set(), bossComebacks: 0, reviews: 0, shares: 0,
    activeDays: new Set(), longestStreak, nightOwl: false, longestBreak: 0,
  };
  const retried = new Set<string>();
  for (const e of [...events].sort((a, b) => a.at.localeCompare(b.at))) {
    if (LEARNING.has(e.kind)) s.activeDays.add(localDay(e.at));
    if (e.kind === 'lesson_done' && e.ref) {
      s.lessons.add(e.ref);
      const h = new Date(e.at).getHours();
      if (h < 4) s.nightOwl = true;
    }
    if (e.kind === 'grade' && e.ref) {
      const p = Number(e.data?.percent ?? 0);
      s.best.set(e.ref, Math.max(s.best.get(e.ref) ?? 0, p));
      if (p === 100) s.perfect++;
    }
    if (e.kind === 'review_done') s.reviews++;
    if (e.kind === 'share') s.shares++;
    if (e.kind === 'boss_submitted' && e.ref) {
      const v = e.data?.verdict;
      if (v === 'retry') retried.add(e.ref);
      if (v === 'pass' || v === 'distinction') {
        if (retried.has(e.ref) && !s.bossesPassed.has(e.ref)) s.bossComebacks++;
        s.bossesPassed.add(e.ref);
      }
      if (v === 'distinction') s.bossesDistinction.add(e.ref);
    }
  }
  s.sGrades = [...s.best.values()].filter(p => p >= S_MIN).length;
  const domains = new Set<DomainId>();
  for (const c of chapters) {
    const ids = lessonIdsOf(c.id);
    if (!ids.length) continue;
    if (ids.every(id => s.lessons.has(id))) { s.chaptersDone++; domains.add(c.domain); }
    if (ids.every(id => (s.best.get(id) ?? 0) >= S_MIN)) s.chaptersMastered++;
  }
  s.domainsTouched = domains.size;
  const days = [...s.activeDays].sort();
  for (let i = 1; i < days.length; i++) {
    const gap = Math.round((Date.parse(`${days[i]}T00:00:00Z`) - Date.parse(`${days[i - 1]}T00:00:00Z`)) / 86_400_000) - 1;
    s.longestBreak = Math.max(s.longestBreak, gap);
  }
  return s;
}

export const BADGES: BadgeDef[] = [
  // Mastery: what you know.
  { id: 'lessons', name: 'Lesson by lesson', kind: 'mastery', describe: 'Finish {n} lessons', tiers: [1, 25, 100], measure: s => s.lessons.size },
  { id: 'top-marks', name: 'Top marks', kind: 'mastery', describe: 'Earn an S grade on {n} lessons', tiers: [5, 25, 75], measure: s => s.sGrades },
  { id: 'chapter-master', name: 'Chapter master', kind: 'mastery', describe: 'Get an S on every lesson in {n} chapters', tiers: [1, 5, 15], measure: s => s.chaptersMastered },
  { id: 'well-rounded', name: 'Well rounded', kind: 'mastery', describe: 'Finish a chapter in {n} skill families', tiers: [3, 7, DOMAIN_IDS.length], measure: s => s.domainsTouched },
  // Craft: what you can make.
  { id: 'boss-slayer', name: 'Boss slayer', kind: 'craft', describe: 'Pass {n} boss projects', tiers: [1, 5, 15], measure: s => s.bossesPassed.size },
  { id: 'distinction', name: 'With distinction', kind: 'craft', describe: 'Pass {n} boss projects with distinction', tiers: [1, 3, 10], measure: s => s.bossesDistinction.size },
  { id: 'flawless', name: 'Flawless', kind: 'craft', describe: 'Finish {n} episodes without a single miss', tiers: [1, 5, 20], measure: s => s.perfect },
  // Habit: showing up.
  { id: 'on-fire', name: 'On fire', kind: 'habit', describe: 'Reach a {n}-day streak', tiers: [7, 30, 100], measure: s => s.longestStreak },
  { id: 'reviewer', name: 'Sharp memory', kind: 'habit', describe: 'Finish {n} review sessions', tiers: [5, 25, 100], measure: s => s.reviews },
  { id: 'regular', name: 'Regular', kind: 'habit', describe: 'Learn on {n} different days', tiers: [10, 50, 150], measure: s => s.activeDays.size },
  // Social: sharing the work.
  { id: 'show-off', name: 'Proud of it', kind: 'social', describe: 'Share {n} grade cards', tiers: [1, 5, 20], measure: s => s.shares },
  // Secret: hidden until earned; the shelf only says how many are left to find.
  { id: 'night-owl', name: 'Night owl', kind: 'secret', describe: 'Finish a lesson between midnight and 4 am', tiers: [1], measure: s => (s.nightOwl ? 1 : 0) },
  { id: 'comeback', name: 'The comeback', kind: 'secret', describe: 'Come back after two weeks away', tiers: [1], measure: s => (s.longestBreak >= 14 ? 1 : 0) },
  { id: 'second-wind', name: 'Second wind', kind: 'secret', describe: 'Pass a boss project you were asked to retry', tiers: [1], measure: s => (s.bossComebacks > 0 ? 1 : 0) },
];

export interface BadgeState {
  def: BadgeDef;
  /** Highest tier reached, or null. */
  tier: BadgeTier | null;
  value: number;
  /** The next threshold to reach, or null once gold (or a secret) is earned. */
  next: number | null;
  /** 0–1 progress from the last tier to the next. */
  progress: number;
  /** Hidden from the learner: an unearned secret. */
  hidden: boolean;
}

export function badgeStates(stats: Stats): BadgeState[] {
  return BADGES.map(def => {
    const value = def.measure(stats);
    const reached = def.tiers.filter(t => value >= t).length;
    const tier = reached ? BADGE_TIERS[reached - 1] : null;
    const next = reached < def.tiers.length ? def.tiers[reached] : null;
    const from = reached ? def.tiers[reached - 1] : 0;
    const progress = next === null ? 1 : Math.max(0, Math.min(1, (value - from) / (next - from)));
    return { def, tier, value, next, progress, hidden: def.kind === 'secret' && !tier };
  });
}

/** Badge tiers earned in `after` that weren't in `before`, for the "badge earned" moment. */
export function newlyEarned(before: BadgeState[], after: BadgeState[]) {
  const was = new Map(before.map(b => [b.def.id, b.tier]));
  return after.filter(b => b.tier && b.tier !== was.get(b.def.id));
}

export const describeBadge = (b: BadgeState) => b.def.describe.replace('{n}', String(b.next ?? b.def.tiers.at(-1)));

// ——— Weekly quests ———

export type QuestId = 'lessons' | 'grade-a' | 'reviews' | 'boss' | 'days' | 'share';
export interface QuestDef { id: QuestId; title: string; target: number }
export interface Quest extends QuestDef { done: number; complete: boolean }

/** What a learner's week can ask of them. `weeklyLessons` is their own goal, so the main quest fits their plan. */
export interface QuestContext { weeklyLessons: number; reviewsDue: boolean; bossOpen: boolean }

/** The main quest first (your own lesson goal), then the optional ones that make sense for you this week. */
function pool(ctx: QuestContext): QuestDef[] {
  const n = Math.max(2, Math.min(10, Math.round(ctx.weeklyLessons)));
  const optional: QuestDef[] = [
    { id: 'grade-a', title: 'Get an A or better in a lesson', target: 1 },
    { id: 'days', title: 'Learn on 3 different days', target: 3 },
    { id: 'share', title: 'Share a grade card', target: 1 },
  ];
  if (ctx.reviewsDue) optional.push({ id: 'reviews', title: 'Finish 3 review sessions', target: 3 });
  if (ctx.bossOpen) optional.push({ id: 'boss', title: 'Hand in a boss project', target: 1 });
  return [{ id: 'lessons', title: `Finish ${n} lessons`, target: n }, ...optional];
}

/** Small, stable hash so a week's quests are the same on every device and every reload. */
function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/** This week's three quests: always "finish your lessons", plus two picked from what fits the learner right now. */
export function weeklyQuests(week: string, ctx: QuestContext, seed = ''): QuestDef[] {
  const [main, ...rest] = pool(ctx);
  const picked = [...rest].sort((a, b) => hash(`${week}|${seed}|${a.id}`) - hash(`${week}|${seed}|${b.id}`)).slice(0, 2);
  return [main, ...picked];
}

const GRADE_A_MIN = 85;   // the A band in grades.ts (keep in step)

/** How far each quest is, counting only this week's events. */
export function questProgress(quests: QuestDef[], events: RewardEvent[], week: string): Quest[] {
  const mine = events.filter(e => weekOf(new Date(e.at)) === week);
  const days = new Set(mine.filter(e => LEARNING.has(e.kind)).map(e => localDay(e.at)));
  const count = (id: QuestId): number => {
    switch (id) {
      case 'lessons': return mine.filter(e => e.kind === 'lesson_done').length;
      case 'grade-a': return mine.some(e => e.kind === 'grade' && Number(e.data?.percent ?? 0) >= GRADE_A_MIN) ? 1 : 0;
      case 'reviews': return mine.filter(e => e.kind === 'review_done').length;
      case 'boss': return mine.some(e => e.kind === 'boss_submitted') ? 1 : 0;
      case 'days': return days.size;
      case 'share': return mine.some(e => e.kind === 'share') ? 1 : 0;
    }
  };
  return quests.map(q => { const done = Math.min(q.target, count(q.id)); return { ...q, done, complete: done >= q.target }; });
}

/** The weekly chest opens when all three quests are complete. */
export const chestOpen = (quests: Quest[]) => quests.length > 0 && quests.every(q => q.complete);
