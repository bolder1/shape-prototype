import { describe, expect, it } from 'vitest';
import { chapterById } from '@shape/engine';
import { CONTENT, LessonContent, grade, initialAnswer, isAnswerReady, shuffled, type ExerciseOf } from './index';

describe('lesson content', () => {
  for (const [chapterId, lessons] of Object.entries(CONTENT)) {
    const chapter = chapterById[chapterId];
    it(`${chapterId}: exists in the curriculum with matching lessons`, () => {
      expect(chapter).toBeDefined();
      expect(lessons.map(l => l.title)).toEqual(chapter.lessons.map(l => l.title));
    });
    for (const lesson of lessons) {
      it(`${lesson.id}: valid schema, unique step ids, answerable exercises`, () => {
        expect(() => LessonContent.parse(lesson)).not.toThrow();
        const ids = lesson.steps.map(s => s.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const s of lesson.steps) {
          if (s.type === 'pick') expect(s.options.map(o => o.id)).toContain(s.correct);
          if (s.type === 'sort') for (const it of s.items) expect(s.buckets.map(b => b.id)).toContain(it.bucket);
          if (s.type === 'tune') {
            expect(s.target[0]).toBeGreaterThanOrEqual(s.min); expect(s.target[1]).toBeLessThanOrEqual(s.max);
            expect(s.start < s.target[0] || s.start > s.target[1]).toBe(true); // must need adjusting
          }
        }
      });
    }
  }
});

describe('grading', () => {
  const pick: ExerciseOf<'pick'> = { type: 'pick', id: 'p', prompt: 'q', explanation: 'e', options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], correct: 'b' };
  const sort: ExerciseOf<'sort'> = { type: 'sort', id: 's', prompt: 'q', explanation: 'e', buckets: [{ id: 'x', label: 'X' }, { id: 'y', label: 'Y' }],
    items: [{ id: '1', label: '1', bucket: 'x' }, { id: '2', label: '2', bucket: 'y' }, { id: '3', label: '3', bucket: 'x' }] };
  const order: ExerciseOf<'order'> = { type: 'order', id: 'order-1', prompt: 'q', explanation: 'e', items: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }] };
  const spot: ExerciseOf<'spot'> = { type: 'spot', id: 'sp', prompt: 'q', explanation: 'e', mock: 'product-card', targets: ['price', 'meta'] };
  const tune: ExerciseOf<'tune'> = { type: 'tune', id: 't', prompt: 'q', explanation: 'e', mock: 'reading-text', min: 1, max: 2, step: 0.1, start: 1, target: [1.4, 1.7], unit: '×' };

  it('pick', () => {
    expect(grade(pick, { type: 'pick', choice: 'b' }).correct).toBe(true);
    expect(grade(pick, { type: 'pick', choice: 'a' })).toEqual({ correct: false, wrong: ['a'] });
  });
  it('sort reports misplaced items', () => {
    expect(grade(sort, { type: 'sort', placement: { 1: 'x', 2: 'y', 3: 'x' } }).correct).toBe(true);
    expect(grade(sort, { type: 'sort', placement: { 1: 'x', 2: 'x', 3: 'x' } }).wrong).toEqual(['2']);
    expect(isAnswerReady(sort, { type: 'sort', placement: { 1: 'x' } })).toBe(false);
  });
  it('order starts shuffled and grades positions', () => {
    const start = initialAnswer(order);
    expect(start).not.toEqual({ type: 'order', sequence: ['a', 'b', 'c'] });
    expect(shuffled(order)).toEqual(shuffled(order)); // deterministic
    expect(grade(order, { type: 'order', sequence: ['a', 'b', 'c'] }).correct).toBe(true);
  });
  it('spot needs exactly the problems: no misses, no false alarms', () => {
    expect(grade(spot, { type: 'spot', selected: ['meta', 'price'] }).correct).toBe(true);
    expect(grade(spot, { type: 'spot', selected: ['price'] }).wrong).toEqual(['meta']);
    expect(grade(spot, { type: 'spot', selected: ['price', 'meta', 'title'] }).wrong).toEqual(['title']);
  });
  it('tune needs an adjustment before it can be checked', () => {
    expect(isAnswerReady(tune, { type: 'tune', value: tune.start })).toBe(false);
    expect(isAnswerReady(tune, { type: 'tune', value: 1.2 })).toBe(true);
  });
  it('tune passes inside the target range only', () => {
    expect(grade(tune, { type: 'tune', value: 1.5 }).correct).toBe(true);
    expect(grade(tune, { type: 'tune', value: 1.2 }).correct).toBe(false);
  });
});
