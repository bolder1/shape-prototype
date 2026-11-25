import { describe, expect, it } from 'vitest';
import { badgeStates, chapterById, chestOpen, describeBadge, newlyEarned, questProgress, statsFrom, weekOf, weeklyQuests, type RewardEvent } from './index';

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).toISOString();
const lesson = (ref: string, when: string, percent = 80): RewardEvent[] => [
  { kind: 'lesson_done', ref, at: when },
  { kind: 'grade', ref, at: when, data: { percent } },
];
const badge = (events: RewardEvent[], id: string, streak = 0) => badgeStates(statsFrom(events, streak)).find(b => b.def.id === id)!;

describe('stats', () => {
  it('keeps the best grade per lesson and counts S grades once', () => {
    const s = statsFrom([...lesson('fd.1-1', at(2026, 11, 20), 70), ...lesson('fd.1-1', at(2026, 11, 21), 96), ...lesson('fd.1-2', at(2026, 11, 21), 94)]);
    expect(s.lessons.size).toBe(2);
    expect(s.best.get('fd.1-1')).toBe(96);
    expect(s.sGrades).toBe(1);   // 94 is an A, not an S
  });
  it('masters a chapter only when every lesson in it is an S', () => {
    const ids = chapterById['fd.1'].lessons.map((_, i) => `fd.1-${i + 1}`);
    const all = ids.flatMap(id => lesson(id, at(2026, 11, 20), 100));
    expect(statsFrom(all).chaptersMastered).toBe(1);
    expect(statsFrom(all).domainsTouched).toBe(1);
    expect(statsFrom(all.slice(2)).chaptersMastered).toBe(0);
  });
  it('counts a boss passed after a retry as a comeback', () => {
    const s = statsFrom([
      { kind: 'boss_submitted', ref: 'fd.1', at: at(2026, 11, 20), data: { verdict: 'retry' } },
      { kind: 'boss_submitted', ref: 'fd.1', at: at(2026, 11, 22), data: { verdict: 'pass' } },
    ]);
    expect(s.bossComebacks).toBe(1);
    expect(s.bossesPassed.size).toBe(1);
  });
  it('measures the longest break between active days', () => {
    const s = statsFrom([...lesson('fd.1-1', at(2026, 11, 1)), ...lesson('fd.1-2', at(2026, 11, 20))]);
    expect(s.longestBreak).toBe(18);
  });
});

describe('badges', () => {
  it('climbs tiers and reports progress to the next one', () => {
    const b = badge(lesson('fd.1-1', at(2026, 11, 20)), 'lessons');
    expect(b.tier).toBe('bronze');
    expect(b.next).toBe(25);
    expect(describeBadge(b)).toBe('Finish 25 lessons');
    expect(describeBadge(badge([], 'lessons'))).toBe('Finish 1 lesson');
  });
  it('uses the streak from the progress store', () => {
    expect(badge([], 'on-fire', 31).tier).toBe('silver');
  });
  it('hides secret badges until earned', () => {
    expect(badge([], 'night-owl').hidden).toBe(true);
    const owl = badge(lesson('ia.1-1', at(2026, 11, 20, 2)), 'night-owl');
    expect(owl.hidden).toBe(false);
    expect(owl.tier).toBe('bronze');
  });
  it('reports only the tiers that are new', () => {
    const before = badgeStates(statsFrom(lesson('fd.1-1', at(2026, 11, 20))));
    const after = badgeStates(statsFrom([...lesson('fd.1-1', at(2026, 11, 20)), { kind: 'share', ref: 'fd.1-1', at: at(2026, 11, 20) }]));
    expect(newlyEarned(before, after).map(b => b.def.id)).toEqual(['show-off']);
  });
  it('has unique ids and rising tiers', () => {
    const all = badgeStates(statsFrom([]));
    expect(new Set(all.map(b => b.def.id)).size).toBe(all.length);
    for (const b of all) expect([...b.def.tiers].sort((x, y) => x - y)).toEqual(b.def.tiers);
  });
});

describe('weekly quests', () => {
  const week = weekOf(new Date(2026, 10, 18));
  const ctx = { weeklyLessons: 5, reviewsDue: true, bossOpen: false };
  it('always leads with the lesson goal and picks two more, the same way every time', () => {
    const q = weeklyQuests(week, ctx, 'user-1');
    expect(q).toHaveLength(3);
    expect(q[0]).toMatchObject({ id: 'lessons', target: 5 });
    expect(weeklyQuests(week, ctx, 'user-1')).toEqual(q);
    expect(q.some(x => x.id === 'boss')).toBe(false);   // no boss is open, so it's never asked for
  });
  it('counts only this week’s events and opens the chest when all are done', () => {
    const quests = [{ id: 'lessons' as const, title: '', target: 2 }, { id: 'days' as const, title: '', target: 2 }, { id: 'grade-a' as const, title: '', target: 1 }];
    const lastWeek = lesson('fd.1-1', at(2026, 11, 10), 99);
    const thisWeek = [...lesson('fd.1-2', at(2026, 11, 16), 70), ...lesson('fd.1-3', at(2026, 11, 18), 88)];
    const p = questProgress(quests, [...lastWeek, ...thisWeek], week);
    expect(p.map(x => x.done)).toEqual([2, 2, 1]);
    expect(chestOpen(p)).toBe(true);
    expect(chestOpen(questProgress(quests, lastWeek, week))).toBe(false);
  });
});
