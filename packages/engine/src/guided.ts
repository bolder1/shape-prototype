// Guided path: an optional mode that keeps a chapter locked until the chapters it builds on are behind you.
// Off by default (soft unlocking: everything is open). The rule for "behind you" lives in prereqMet, so the map,
// the chapter panel and the lesson route all agree on it.
import { chapters, chapterById, TIER_LEVEL } from './curriculum';

/** What we know about one prerequisite chapter when deciding whether it's been covered. */
export interface PrereqFacts {
  lessonsDone: number;    // lessons finished in that chapter
  lessonsTotal: number;   // lessons written for it (0 = none yet)
  bossPassed: boolean;    // its chapter project passed (pass or distinction)
  knownLevel: number;     // the learner's self-rated level in that chapter's skill, 0–5 (0 when "start from the basics")
  tierLevel: number;      // level that chapter teaches up to: Literacy 2, Practitioner 3, Expert 5
}

/** Whether a prerequisite counts as covered, so the chapters that build on it can open. */
export function prereqMet(f: PrereqFacts): boolean {
  // Three ways to have a chapter behind you:
  // 1. You finished every lesson in it.
  // 2. You passed its project: proof you can do the work, so it lets you "test out" without replaying lessons.
  // 3. You already know the skill at the level it teaches (self-rated in the survey; 0 when starting from the basics).
  //    Guided path is a learning aid the learner switched on themselves, not an exam, so their own rating is trusted.
  const finished = f.lessonsTotal > 0 && f.lessonsDone >= f.lessonsTotal;
  return finished || f.bossPassed || f.knownLevel >= f.tierLevel;
}

/**
 * For every chapter, the prerequisites still standing in its way (empty = open).
 * A chapter the learner has already started is never locked, so switching Guided on mid-way takes nothing away.
 */
export function guidedLocks(facts: (chapterId: string) => PrereqFacts): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const c of chapters) {
    out[c.id] = facts(c.id).lessonsDone > 0 ? [] : c.prereqs.filter(p => !prereqMet(facts(p)));
  }
  return out;
}

/** Facts for one chapter from plain progress data; shared by the web app and the tests. */
export function prereqFacts(chapterId: string, p: { lessonsDone: number; lessonsTotal: number; bossPassed: boolean; skillLevel: number }): PrereqFacts {
  return { ...p, knownLevel: p.skillLevel, tierLevel: TIER_LEVEL[chapterById[chapterId].tier] };
}
