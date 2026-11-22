import { describe, expect, it } from 'vitest';
import { GROUP_SIZE, initialLeague, rivalXp, rivalsFor, standings, syncLeague, weekElapsed, weekOf, weeklyXp, zoneFor } from './index';

// Wednesday 18 Nov 2026, noon local. Its week starts Monday 16 Nov.
const WED = new Date(2026, 10, 18, 12);
const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).toISOString();

describe('calendar', () => {
  it('finds the Monday of a week', () => {
    expect(weekOf(WED)).toBe('2026-11-16');
    expect(weekOf(new Date(2026, 10, 16, 0, 0))).toBe('2026-11-16');   // Monday midnight starts a week
    expect(weekOf(new Date(2026, 10, 22, 23, 59))).toBe('2026-11-16'); // Sunday night still belongs to it
  });
  it('measures how far through the week we are', () => expect(weekElapsed('2026-11-16', WED)).toBeCloseTo(2.5 / 7));
  it('sums only this week’s XP', () =>
    expect(weeklyXp([{ at: at(2026, 11, 15), amount: 99 }, { at: at(2026, 11, 17), amount: 30 }, { at: at(2026, 11, 22, 23), amount: 5 }], '2026-11-16')).toBe(35));
});

describe('rivals', () => {
  it('are the same on every reload', () => expect(rivalsFor('2026-11-16', 1)).toEqual(rivalsFor('2026-11-16', 1)));
  it('fill the group', () => expect(rivalsFor('2026-11-16', 3)).toHaveLength(GROUP_SIZE - 1));
  it('never lose XP as the week goes on, and hit their target at the end', () => {
    for (const r of rivalsFor('2026-11-16', 4)) {
      let last = 0;
      for (let t = 0; t <= 1; t += 1 / 28) { const xp = rivalXp(r, t); expect(xp).toBeGreaterThanOrEqual(last); last = xp; }
      expect(rivalXp(r, 1)).toBe(r.target);
    }
  });
});

describe('table', () => {
  it('has no demotion zone in the first tier and no promotion zone in the last', () => {
    expect(zoneFor(20, 1)).toBe('safe');
    expect(zoneFor(1, 7)).toBe('safe');
    expect(zoneFor(5, 2)).toBe('up');
    expect(zoneFor(16, 2)).toBe('down');
  });
  it('ranks you first with huge XP and you win ties', () => {
    const top = standings({ name: 'You', xp: 10_000 }, '2026-11-16', 2, WED);
    expect(top[0]).toMatchObject({ you: true, rank: 1, zone: 'up' });
    const rows = standings({ name: 'You', xp: 0 }, '2026-11-16', 2, new Date(2026, 10, 16, 0, 0));   // Monday 00:00: everyone on 0
    expect(rows[0].you).toBe(true);
  });
});

describe('syncLeague', () => {
  const ledger = [{ at: at(2026, 11, 17), amount: 10_000 }];
  it('does not join a league until you earn XP that week', () => {
    expect(syncLeague(initialLeague(), [], WED).state.week).toBeNull();
    expect(syncLeague(initialLeague(), ledger, WED).state.week).toBe('2026-11-16');
  });
  it('settles a finished week and moves you up', () => {
    const joined = syncLeague(initialLeague(), ledger, WED).state;
    const { state, settled } = syncLeague(joined, ledger, new Date(2026, 10, 24, 9));
    expect(settled).toMatchObject({ week: '2026-11-16', rank: 1, outcome: 'promoted', nextTier: 2 });
    expect(state).toMatchObject({ tier: 2, week: null });
  });
  it('moves you down from the bottom of a higher tier', () => {
    const quiet = [{ at: at(2026, 11, 17), amount: 1 }];
    const { settled } = syncLeague({ tier: 3, week: '2026-11-16', history: [] }, quiet, new Date(2026, 10, 24));
    expect(settled?.outcome).toBe('demoted');
    expect(settled?.nextTier).toBe(2);
  });
  it('settles only once', () => {
    const after = syncLeague({ tier: 1, week: '2026-11-16', history: [] }, ledger, new Date(2026, 10, 24)).state;
    expect(syncLeague(after, ledger, new Date(2026, 10, 25)).settled).toBeUndefined();
  });
});
