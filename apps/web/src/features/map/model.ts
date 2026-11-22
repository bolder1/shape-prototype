// What the map shows for each chapter: status, place on the learner's path, and why it's there.
import { CONTENT } from '@shape/content';
import { chapterById, chapters, domainById, TIER_LEVEL, unlocks, type ColumnRole, type PathResult } from '@shape/engine';
import { computeOutcome } from '../onboarding/profile';
import type { SavedProfile } from '../onboarding/storage';
import type { LessonRecord } from '../progress/store';

export type ChapterStatus = 'done' | 'progress' | 'path' | 'available' | 'later';

export interface ChapterInfo {
  id: string;
  status: ChapterStatus;
  pathIndex: number | null;      // 0-based stop number on the learner's path
  doneLessons: number;
  contentLessons: number;        // lessons playable today (0 = not written yet)
  role: ColumnRole | null;
  why: string;
}

export const TIER_NAME = { bar: 'Literacy', stem: 'Practitioner', deep: 'Expert' } as const;

export function buildModel(profile: SavedProfile | null, lessons: Record<string, LessonRecord>) {
  let result: PathResult | null = null;
  try { result = profile ? computeOutcome(profile.answers).result : null; } catch { result = null; }
  const path = result?.path.map(p => p.id) ?? profile?.path ?? [];
  const cols = Object.fromEntries((result?.tshape.columns ?? []).map(c => [c.domain, c]));

  const info: Record<string, ChapterInfo> = {};
  for (const c of chapters) {
    const content = CONTENT[c.id] ?? [];
    const doneLessons = content.filter(l => lessons[l.id]).length;
    const pathIndex = path.indexOf(c.id);
    const onPath = pathIndex >= 0;
    const col = cols[c.domain];
    const status: ChapterStatus = content.length && doneLessons === content.length ? 'done'
      : doneLessons > 0 ? 'progress' : onPath ? 'path' : content.length ? 'available' : 'later';
    info[c.id] = { id: c.id, status, pathIndex: onPath ? pathIndex : null, doneLessons, contentLessons: content.length, role: col?.role ?? null, why: whyText(c.id, onPath, col, path) };
  }
  return { info, path, hasProfile: !!profile };
}

/** Plain-language reason a chapter is (or isn't) on the learner's path. */
function whyText(id: string, onPath: boolean, col: { current: number; target: number; role: ColumnRole } | undefined, path: string[]): string {
  const ch = chapterById[id], skill = domainById[ch.domain].name;
  if (!col) return 'Map your skills to see where this fits for you.';
  if (onPath) {
    if (col.target <= col.current) {
      const needer = unlocks[id].find(u => path.includes(u));
      return needer ? `You need it before “${chapterById[needer].title}”, which is on your path.` : 'It unlocks other chapters on your path.';
    }
    if (col.role === 'spine') return `${skill} is your deep skill. Your path takes it all the way to Expert.`;
    if (col.role === 'adjacent') return `${skill} sits right next to your deep skill, so your path takes it to Practitioner.`;
    return `Part of your broad base. Your path covers ${skill} up to ${TIER_NAME[ch.tier]}, so you can work with specialists in it.`;
  }
  if (col.current >= TIER_LEVEL[ch.tier]) return `You already know ${skill.toLowerCase()} at this level, so it’s off your path. Revisit it any time.`;
  return 'Beyond your current goal. Explore it whenever you like, or change your goal to bring it onto your path.';
}
