import { describe, expect, it } from 'vitest';
import { chapters, guidedLocks, prereqFacts, type PrereqFacts } from './index';

type Progress = Record<string, Partial<{ lessonsDone: number; bossPassed: boolean; skillLevel: number }>>;
const TOTAL = 5;
const facts = (p: Progress) => (id: string): PrereqFacts =>
  prereqFacts(id, { lessonsDone: 0, lessonsTotal: TOTAL, bossPassed: false, skillLevel: 0, ...p[id] });

describe('guided path', () => {
  it('opens only the first chapter for a brand-new learner who starts from the basics', () => {
    const locks = guidedLocks(facts({}));
    expect(locks['fd.1']).toEqual([]);
    expect(locks['fd.2']).toEqual(['fd.1']);
    expect(chapters.filter(c => !locks[c.id].length).map(c => c.id)).toEqual(['fd.1']);
  });
  it('opens a chapter once its prerequisite is fully finished and passed', () => {
    const locks = guidedLocks(facts({ 'fd.1': { lessonsDone: TOTAL, bossPassed: true } }));
    expect(locks['fd.2']).toEqual([]);
    expect(locks['rs.1']).toEqual([]);
    expect(locks['fd.3']).toEqual(['fd.2']);
  });
  it('lists only the prerequisites still missing', () => {
    const locks = guidedLocks(facts({ 'rs.3': { lessonsDone: TOTAL, bossPassed: true } }));
    expect(locks['rs.4']).toEqual(['pr.1']);
  });
  it('never locks a chapter the learner has already started', () => {
    expect(guidedLocks(facts({ 'fd.4': { lessonsDone: 1 } }))['fd.4']).toEqual([]);
  });
});

describe('guided path: other ways to cover a chapter', () => {
  it('opens the next chapter when the project is passed without every lesson', () => {
    expect(guidedLocks(facts({ 'fd.1': { lessonsDone: 2, bossPassed: true } }))['fd.2']).toEqual([]);
  });
  it('trusts the learner’s own level for chapters at or below it', () => {
    const locks = guidedLocks(id => prereqFacts(id, { lessonsDone: 0, lessonsTotal: TOTAL, bossPassed: false, skillLevel: id.startsWith('fd.') ? 2 : 0 }));
    expect(locks['fd.3']).toEqual([]);        // fd.2 teaches Literacy (2): the learner is already there
    expect(locks['fd.4']).toEqual(['fd.3']);  // fd.3 teaches Practitioner (3): above them, so it still has to be done
  });
});
