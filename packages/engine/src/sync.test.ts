import { describe, expect, it } from 'vitest';
import { mergeBosses, mergeLedger, mergeLessons, mergeProgress, mergeReview, mergeStreak, type ProgressSnapshot } from './index';

const ev = (at: string, amount: number, kind: 'lesson' | 'review' | 'boss' = 'lesson', ref?: string) => ({ at, amount, kind, ...(ref ? { ref } : {}) });
const empty = (): ProgressSnapshot => ({ xp: 0, ledger: [], streak: { current: 0, longest: 0, lastDay: null }, lessons: {}, review: {}, bosses: {}, bossDrafts: {} });

describe('mergeLedger', () => {
  it('keeps each gain once and sorts by time', () => {
    const a = [ev('2026-11-20T10:00:00Z', 30, 'lesson', 'fd.1-1'), ev('2026-11-22T10:00:00Z', 3, 'review')];
    const b = [ev('2026-11-20T10:00:00Z', 30, 'lesson', 'fd.1-1'), ev('2026-11-21T09:00:00Z', 40, 'lesson', 'fd.1-2')];
    expect(mergeLedger(a, b).map(e => e.amount)).toEqual([30, 40, 3]);
  });
  it('keeps two equal gains made at different times', () => {
    expect(mergeLedger([ev('2026-11-20T10:00:00Z', 3, 'review')], [ev('2026-11-20T11:00:00Z', 3, 'review')])).toHaveLength(2);
  });
});

describe('mergeLessons', () => {
  it('unions lessons, keeping the latest run and the larger XP', () => {
    const a = { 'fd.1-1': { completedAt: '2026-11-20', xp: 60, firstTry: 5, total: 8 } };
    const b = { 'fd.1-1': { completedAt: '2026-11-22', xp: 40, firstTry: 8, total: 8 }, 'fd.1-2': { completedAt: '2026-11-21', xp: 50, firstTry: 6, total: 8 } };
    const m = mergeLessons(a, b);
    expect(Object.keys(m).sort()).toEqual(['fd.1-1', 'fd.1-2']);
    expect(m['fd.1-1']).toEqual({ completedAt: '2026-11-22', xp: 60, firstTry: 8, total: 8 });
  });
});

describe('mergeReview', () => {
  it('keeps every card and the sooner due date', () => {
    const m = mergeReview({ k1: { exerciseKey: 'k1', due: '2026-11-30', interval: 8 } }, { k1: { exerciseKey: 'k1', due: '2026-11-26', interval: 1 }, k2: { exerciseKey: 'k2', due: '2026-11-27', interval: 3 } });
    expect(m.k1.due).toBe('2026-11-26');
    expect(m.k2).toBeDefined();
  });
});

describe('mergeBosses', () => {
  it('unions attempts and takes the best verdict', () => {
    const a = { 'fd.1': { attempts: [{ at: 't1', verdict: 'retry' as const, percent: 40 }], best: 'retry' as const, bestPercent: 40, xp: 0 } };
    const b = { 'fd.1': { attempts: [{ at: 't1', verdict: 'retry' as const, percent: 40 }, { at: 't2', verdict: 'distinction' as const, percent: 92 }], best: 'distinction' as const, bestPercent: 92, xp: 75 } };
    const m = mergeBosses(a, b)['fd.1'];
    expect(m.attempts).toHaveLength(2);
    expect(m.best).toBe('distinction');
    expect(m.xp).toBe(75);
  });
});

describe('mergeProgress', () => {
  it('derives XP from the merged ledger and lets this device’s drafts win', () => {
    const a = { ...empty(), ledger: [ev('2026-11-20T10:00:00Z', 30)], xp: 30, bossDrafts: { 'fd.1': 'mine' } };
    const b = { ...empty(), ledger: [ev('2026-11-21T10:00:00Z', 50)], xp: 999, bossDrafts: { 'fd.1': 'theirs', 'fd.2': 'other' } };
    const m = mergeProgress(a, b, '2026-11-25');
    expect(m.xp).toBe(80);
    expect(m.bossDrafts).toEqual({ 'fd.1': 'mine', 'fd.2': 'other' });
  });
});

describe('mergeStreak', () => {
  const T = '2026-11-25';
  const st = (current: number, lastDay: string | null, longest = current) => ({ current, longest, lastDay });
  it('joins two devices whose runs overlap: phone 20–24, laptop 23–25 is one 6-day run', () => {
    expect(mergeStreak(st(5, '2026-11-24'), st(3, '2026-11-25'), T)).toEqual({ current: 6, longest: 6, lastDay: '2026-11-25' });
  });
  it('joins runs that touch end to end: phone 21–22, laptop 23–25', () => {
    expect(mergeStreak(st(2, '2026-11-22'), st(3, '2026-11-25'), T).current).toBe(5);
  });
  it('takes the later run when there is a gap between them', () => {
    expect(mergeStreak(st(9, '2026-11-15', 12), st(2, '2026-11-25'), T)).toEqual({ current: 2, longest: 12, lastDay: '2026-11-25' });
  });
  it('same last day: the longer run wins (it contains the shorter one)', () => {
    expect(mergeStreak(st(4, '2026-11-25'), st(7, '2026-11-25'), T).current).toBe(7);
  });
  it('a device that never started has nothing to add', () => {
    expect(mergeStreak(st(0, null), st(3, '2026-11-25', 8), T)).toEqual({ current: 3, longest: 8, lastDay: '2026-11-25' });
  });
  it('is symmetric', () => {
    const a = st(5, '2026-11-24', 6), b = st(3, '2026-11-25');
    expect(mergeStreak(a, b, T)).toEqual(mergeStreak(b, a, T));
  });
  it('handles month ends', () => {
    expect(mergeStreak(st(3, '2026-11-30'), st(2, '2026-12-02'), '2026-12-02').current).toBe(5);
  });
});
