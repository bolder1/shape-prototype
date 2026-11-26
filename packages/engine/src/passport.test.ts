import { describe, expect, it } from 'vitest';
import { chapterById, handleProblem, passportFrom, type RewardEvent } from './index';

const at = (d: number) => new Date(2026, 10, d, 12).toISOString();
const finish = (chapterId: string, d = 1): RewardEvent[] =>
  chapterById[chapterId].lessons.map((_, i) => ({ kind: 'lesson_done', ref: `${chapterId}-${i + 1}`, at: at(d) }));
const boss = (ref: string, verdict: string, percent: number, d: number, verified?: boolean): RewardEvent =>
  ({ kind: 'boss_submitted', ref, at: at(d), data: { verdict, percent, ...(verified !== undefined ? { verified } : {}) } });

describe('passport', () => {
  it('levels a skill by the highest tier with a finished chapter', () => {
    const p = passportFrom([...finish('fd.1'), ...finish('fd.2'), ...finish('fd.3')]);
    expect(p.skills[0]).toMatchObject({ domain: chapterById['fd.3'].domain, level: 2, chaptersDone: 3, verified: false });
    expect(p.lessons).toBeGreaterThan(0);
  });
  it('leaves out skills with nothing finished', () => {
    expect(passportFrom(finish('fd.1').slice(1)).skills).toEqual([]);
  });
  it('keeps the best passing attempt, preferring a verified one, and drops retries', () => {
    const p = passportFrom([boss('fd.1', 'retry', 40, 1), boss('fd.1', 'distinction', 95, 2), boss('fd.1', 'pass', 75, 3, true), boss('fd.2', 'pass', 80, 4)]);
    expect(p.credentials.map(c => [c.chapterId, c.verdict, c.verified])).toEqual([['fd.1', 'pass', true], ['fd.2', 'pass', false]]);
  });
  it('marks a skill verified only through a verified project in it', () => {
    const p = passportFrom([...finish('fd.1'), boss('fd.1', 'pass', 80, 2, true)]);
    expect(p.skills[0].verified).toBe(true);
    expect(passportFrom([...finish('fd.1'), boss('fd.1', 'pass', 80, 2)]).skills[0].verified).toBe(false);
  });
  it('checks handles', () => {
    expect(handleProblem('maya-k')).toBeNull();
    expect(handleProblem('Maya')).not.toBeNull();
    expect(handleProblem('a--b')).not.toBeNull();
    expect(handleProblem('league')).not.toBeNull();
    expect(handleProblem('ab')).not.toBeNull();
  });
});
