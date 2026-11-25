import { describe, expect, it } from 'vitest';
import { dailyBrief, dailyNumber, dailyShareText, dailyTime, DAILY_SIZE } from './index';

describe('Daily Brief', () => {
  it('numbers days from launch', () => {
    expect(dailyNumber('2026-11-25')).toBe(1);
    expect(dailyNumber('2026-12-01')).toBe(7);
    expect(dailyNumber('2027-03-01')).toBe(97);
  });
  it('is the same brief for the same day, and a different one the next day', () => {
    const a = dailyBrief('2026-12-03'), b = dailyBrief('2026-12-03'), c = dailyBrief('2026-12-04');
    expect(a).toEqual(b);
    expect(a.questions.map(q => q.id)).not.toEqual(c.questions.map(q => q.id));
  });
  it('asks five questions from five families: three quick, then two tough', () => {
    for (const day of ['2026-11-25', '2026-12-31', '2027-06-15']) {
      const { questions } = dailyBrief(day);
      expect(questions).toHaveLength(DAILY_SIZE);
      expect(new Set(questions.map(q => q.domain)).size).toBe(DAILY_SIZE);
      expect(questions.map(q => q.level)).toEqual(['quick', 'quick', 'quick', 'tough', 'tough']);
      for (const q of questions) expect(q.options.some(o => o.id === q.correct)).toBe(true);
    }
  });
  it('spreads across families over a month', () => {
    const fams = new Set(Array.from({ length: 30 }, (_, i) => dailyBrief(new Date(Date.UTC(2026, 11, 1 + i)).toISOString().slice(0, 10))).flatMap(b => b.questions.map(q => q.domain)));
    expect(fams.size).toBeGreaterThanOrEqual(12);
  });
  it('shares a spoiler-free grid', () => {
    const brief = dailyBrief('2026-12-03');
    const text = dailyShareText(brief, [true, false, true, true, false], 38_000, 'https://shape.app/daily');
    expect(text).toBe('Shape Daily #9 · 3/5 · 0:38\n🟩⬜🟩🟪⬜\nhttps://shape.app/daily');
    for (const q of brief.questions) expect(text).not.toContain(q.prompt.slice(0, 12));
    expect(dailyTime(65_400)).toBe('1:05');
  });
});
