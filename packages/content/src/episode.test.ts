import { describe, expect, it } from 'vitest';
import { EPISODES, Episode, Exercise, findExercise, lessonById, riceIdeas, riceScore } from './index';

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
    const button = findExercise('cw.1-2', 'game.r2');
    expect(() => Exercise.parse(button)).not.toThrow();
    expect(button?.type === 'pick' && button.options.find(o => o.id === button.correct)?.label).toBe('Pay ₹450');
    expect(button?.type === 'pick' && button.explanation).toContain('names the action');
    const job = findExercise('rs.2-3', 'game.r1');
    expect(() => Exercise.parse(job)).not.toThrow();
    expect(job?.type === 'pick' && job.prompt).toContain('job story');
    expect(job?.type === 'pick' && job.explanation).toContain('progress wanted');
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
      if (['swipe-sort', 'myth-pop', 'squint-test', 'chunk-lab', 'flashlight', 'scale-sort', 'question-forge', 'red-pen', 'jargon-swap', 'line-cut', 'glance-test', 'button-forge', 'chat-probe', 'job-forge', 'ask-watch'].includes(ep.game.id)) expect(lanes).toHaveLength(2);   // two-way games
      if (['question-forge', 'button-forge', 'job-forge'].includes(ep.game.id)) expect(ep.game.rounds?.length).toBeGreaterThan(0);   // the forges need tiles
      if (ep.game.id === 'red-pen') for (const c of ep.game.cards) expect(c.note).toBeTruthy();   // every line gets its explanation
      if (ep.game.id === 'jargon-swap') for (const c of ep.game.cards) if (c.lane === lanes[0]) expect(c.note).toBeTruthy();   // every system label gets its rewrite
      if (ep.game.id === 'crowd-sort') for (const c of ep.game.cards) expect(c.agree).toBeGreaterThan(50);   // the answer is the majority's lane
      if (ep.game.id === 'pattern-fit') for (const l of lanes) expect(['tab', 'side', 'hub', 'step']).toContain(l);   // lanes the game can draw
      if (ep.game.id === 'tree-test') for (const c of ep.game.cards) expect(c.note).toBeTruthy();   // every task shows its path
      if (ep.game.id === 'line-cut') for (const c of ep.game.cards) expect(c.note).toBeTruthy();   // every line gets its reason
      if (ep.game.id === 'spacing-fix') expect(lanes).toEqual(['t', 'm', 'l']);   // the sizes the game animates to
      if (ep.game.id === 'column-span') for (const l of lanes) expect(12 % Number(l)).toBe(0);   // spans that tile a 12-column row
      if (ep.game.id === 'glance-test') for (const c of ep.game.cards) if (c.lane === lanes[0]) expect(c.note).toBeTruthy();   // every unclear line gets a rewrite
      if (ep.game.id === 'error-doctor') { expect(lanes).toEqual(['vague', 'nofix', 'blame', 'good']); for (const c of ep.game.cards) if (c.lane !== 'good') expect(c.note).toBeTruthy(); }   // every bad error gets a better one
      if (ep.game.id === 'empty-match') expect(lanes).toEqual(['first', 'done', 'noresults', 'error']);   // the screens the game draws
      if (ep.game.id === 'script-builder') expect(lanes).toEqual(['open', 'broad', 'deep', 'close']);   // script parts, in order
      if (ep.game.id === 'chat-probe') for (const c of ep.game.cards) { expect(c.visual).toBeTruthy(); if (c.lane === lanes[0]) expect(c.note).toBeTruthy(); }   // a quote to answer; weak follow-ups get a better one
      if (ep.game.id === 'ask-watch') expect(lanes).toEqual(['ask', 'watch']);
      if (ep.game.id === 'rung-sort') expect(lanes).toEqual(['problem', 'outcome', 'output']);   // the three rungs
      if (ep.game.id === 'rice-duel') {   // two well-formed ideas, and the marked lane really wins on RICE
        expect(lanes).toEqual(['a', 'b']);
        for (const c of ep.game.cards) {
          const ideas = riceIdeas(c.visual ?? '');
          expect(ideas).toHaveLength(2);
          for (const i of ideas) for (const n of [i.reach, i.impact, i.confidence, i.effort]) expect(n).toBeGreaterThan(0);
          const [a, b] = ideas.map(riceScore);
          expect(a).not.toBe(b);
          expect(c.lane).toBe(a > b ? 'a' : 'b');
        }
      }
      if (ep.game.id === 'align-snap') expect(lanes).toEqual(['left', 'center', 'right']);   // the three snap lines
      if (['gestalt-hunt', 'squint-test', 'spacing-fix'].includes(ep.game.id)) for (const c of ep.game.cards) expect(c.visual).toBeTruthy();   // visual games draw every card
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
