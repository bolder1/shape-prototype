// What every skill-map view receives, plus small helpers they share.
import { chapterById, chapters, type DomainId, type TColumn } from '@shape/engine';
import { FAMILIES, FAMILY_ORDER, SKILL_META, skillsInFamily } from '@/lib/skills';
import type { ChapterInfo } from '../model';

export interface ViewProps {
  info: Record<string, ChapterInfo>;
  cols: Partial<Record<DomainId, TColumn>>;
  path: string[];
  selectedId: string | null;
  nextId: string | null;
  focusPath: boolean;
  onSelect: (id: string) => void;
}

/** Skills in family order: the order every view walks them in. */
export const SKILL_ORDER: DomainId[] = FAMILY_ORDER.flatMap(skillsInFamily);

export const colorOf = (chapterId: string) => FAMILIES[SKILL_META[chapterById[chapterId].domain].family].color;
export const skillColor = (d: DomainId) => FAMILIES[SKILL_META[d].family].color;
export const chaptersOf = (d: DomainId) => chapters.filter(c => c.domain === d);

/** A chapter is open once every prerequisite is done. */
export const isUnlocked = (id: string, info: Record<string, ChapterInfo>) => chapterById[id].prereqs.every(p => info[p]?.status === 'done');

/** Faded when focusing on the path and the chapter is neither on it nor done. */
export const offPath = (i: ChapterInfo, focusPath: boolean) => focusPath && i.pathIndex == null && i.status !== 'done';
