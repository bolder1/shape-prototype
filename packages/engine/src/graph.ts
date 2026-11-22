// Graph helpers over the curriculum: prerequisite depth and reverse edges (what each chapter unlocks).
import { chapters, chapterById } from './curriculum';

/** Depth = longest prerequisite chain below a chapter (0 = no prerequisites). Used to lay out the skill map. */
export const chapterDepth: Record<string, number> = (() => {
  const memo: Record<string, number> = {};
  const depth = (id: string): number => memo[id] ??= chapterById[id].prereqs.length ? 1 + Math.max(...chapterById[id].prereqs.map(depth)) : 0;
  chapters.forEach(c => depth(c.id));
  return memo;
})();

export const MAX_DEPTH = Math.max(...Object.values(chapterDepth));

/** chapterId → chapters that list it as a prerequisite. */
export const unlocks: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = Object.fromEntries(chapters.map(c => [c.id, [] as string[]]));
  for (const c of chapters) for (const p of c.prereqs) out[p].push(c.id);
  return out;
})();
