import { describe, expect, it } from 'vitest';
import { chapterById } from '@shape/engine';
import { BOSSES, BossBrief, CONTENT, bossReady, emptyAnswers, fieldReady, scoreBoss, type BossCriterion } from './index';

describe('boss briefs', () => {
  for (const [id, brief] of Object.entries(BOSSES)) {
    it(`${id}: valid, in the curriculum, with playable lessons`, () => {
      expect(() => BossBrief.parse(brief)).not.toThrow();
      expect(chapterById[id]).toBeDefined();
      expect(CONTENT[id]?.length).toBeGreaterThan(0);
    });
    it(`${id}: unique ids, and the example answer passes every auto check`, () => {
      expect(new Set(brief.fields.map(f => f.id)).size).toBe(brief.fields.length);
      expect(new Set(brief.rubric.map(c => c.id)).size).toBe(brief.rubric.length);
      expect(Object.keys(brief.example).sort()).toEqual(brief.fields.map(f => f.id).sort());
      expect(bossReady(brief, brief.example)).toBe(true);
    });
    it(`${id}: a blank submission is not ready`, () => {
      expect(bossReady(brief, emptyAnswers(brief))).toBe(false);
    });
  }

  it('list fields need enough items with enough words', () => {
    const f = { id: 'q', label: 'Q', hint: 'h', kind: 'list' as const, items: 2, minWords: 3 };
    expect(fieldReady(f, ['one two three', 'four five'])).toBe(false);
    expect(fieldReady(f, ['one two three', 'four five six'])).toBe(true);
  });
});

describe('scoreBoss', () => {
  const rubric: BossCriterion[] = [
    { id: 'a', label: 'A', strong: 's', weight: 2, required: true },
    { id: 'b', label: 'B', strong: 's', weight: 1, required: false },
    { id: 'c', label: 'C', strong: 's', weight: 1, required: false },
  ];

  it('all strong is a 100% distinction', () => {
    expect(scoreBoss(rubric, { a: 3, b: 3, c: 3 })).toEqual({ percent: 100, verdict: 'distinction', blockers: [] });
  });
  it('weights count: solid everywhere is 67%, below the pass line', () => {
    const s = scoreBoss(rubric, { a: 2, b: 2, c: 2 });
    expect(s.percent).toBe(67);
    expect(s.verdict).toBe('retry');
  });
  it('passes at 70% or more', () => {
    expect(scoreBoss(rubric, { a: 3, b: 2, c: 1 }).verdict).toBe('pass'); // (6+2+1)/12 = 75%
  });
  it('a required criterion below Solid blocks the pass whatever the total', () => {
    const s = scoreBoss(rubric, { a: 1, b: 3, c: 3 }); // (2+3+3)/12 = 67%
    expect(s.blockers).toEqual(['a']);
    expect(s.verdict).toBe('retry');
    const high = scoreBoss([...rubric, { id: 'd', label: 'D', strong: 's', weight: 3, required: false }], { a: 1, b: 3, c: 3, d: 3 }); // 17/21 = 81%
    expect(high.verdict).toBe('retry');
  });
  it('missing levels count as 0', () => {
    expect(scoreBoss(rubric, {}).percent).toBe(0);
  });
});
