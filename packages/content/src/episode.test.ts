import { describe, expect, it } from 'vitest';
import { EPISODES, Episode, Exercise, findExercise, lessonById } from './index';

describe('findExercise', () => {
  it('turns episode questions and game cards into valid review picks', () => {
    for (const id of ['quiz.q1', 'ladder.l3', 'gap.gap', 'check.c2', 'game.g5']) {
      const ex = findExercise('fd.1-2', id);
      expect(ex?.type).toBe('pick');
      expect(() => Exercise.parse(ex)).not.toThrow();
    }
    expect(findExercise('fd.1-2', 'o1')?.type).toBe('order');   // classic steps still resolve
    const forged = findExercise('rs.1-3', 'game.r1');
    expect(() => Exercise.parse(forged)).not.toThrow();
    expect(forged?.type === 'pick' && forged.options.find(o => o.id === forged.correct)?.label).toBe('How do people remember to pay bills today, and where does that break down?');
    expect(findExercise('fd.1-2', 'quiz.nope')).toBeUndefined();
  });
});

describe('episodes', () => {
  for (const [id, ep] of Object.entries(EPISODES)) {
    it(`${id}: valid schema and matches a real lesson`, () => {
      expect(() => Episode.parse(ep)).not.toThrow();
      expect(ep.lessonId).toBe(id);
      expect(lessonById(id)).toBeDefined();
    });
    it(`${id}: every answer and card points at something that exists`, () => {
      const questions = [...ep.check, ep.gap, ...ep.quiz.questions, ...ep.ladder];
      for (const q of questions) expect(q.options.map(o => o.id)).toContain(q.correct);
      const lanes = ep.game.lanes.map(l => l.id);
      for (const c of ep.game.cards) expect(lanes).toContain(c.lane);
      // Every lane gets at least one card, so the game can fill every part of the diamond.
      for (const l of lanes) expect(ep.game.cards.some(c => c.lane === l)).toBe(true);
      if (['swipe-sort', 'myth-pop', 'squint-test', 'chunk-lab', 'flashlight', 'scale-sort', 'question-forge', 'red-pen'].includes(ep.game.id)) expect(lanes).toHaveLength(2);   // two-way games
      if (ep.game.id === 'question-forge') expect(ep.game.rounds?.length).toBeGreaterThan(0);   // the forge needs tiles
      if (ep.game.id === 'red-pen') for (const c of ep.game.cards) expect(c.note).toBeTruthy();   // every line gets its explanation
      if (['gestalt-hunt', 'squint-test'].includes(ep.game.id)) for (const c of ep.game.cards) expect(c.visual).toBeTruthy();   // visual games draw every card
    });
    it(`${id}: beats and the story gap fit inside the scene`, () => {
      const at = ep.scene.beats.map(b => b.at);
      expect(at).toEqual([...at].sort((a, b) => a - b));
      expect(at.at(-1)!).toBeLessThan(ep.scene.duration);
      expect(ep.gap.from).toBeLessThan(ep.gap.at);
      expect(ep.gap.at).toBeLessThan(ep.scene.duration);
    });
    it(`${id}: quiz answers aren’t always in the same slot`, () => {
      const slots = new Set(ep.quiz.questions.map(q => q.options.findIndex(o => o.id === q.correct)));
      expect(slots.size).toBeGreaterThan(1);
    });
  }
});
