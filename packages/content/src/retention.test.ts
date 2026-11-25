import { describe, expect, it } from 'vitest';
import {
  HABIT_CALLS, HABIT_DAYS, HABIT_MIN_PER_WEEK, HABIT_WEEKS, IGNORE_LIMIT, L28_BUCKETS, NUDGE_CALLS, NUDGE_WEEK, NUDGE_WEEKLY_CAP,
  PRACTICE_LOOP, QUIET_FROM, QUIET_TO, REFERRAL_BASE, REFERRAL_CALLS, REFERRAL_NEW_KEPT_K, REWARD_CALLS, RIYAAZ_BEHAVIOURS, RIYAAZ_L28, RIYAAZ_MECHANICS,
  RIYAAZ_NUDGES, RIYAAZ_REFERRALS, SDT_NEEDS, STREAK_LAUNCH, amplify, habitCall, habitFormed, holdReason, inQuietHours, kFactor, keptK,
  nudgeCall, referralCall, rewardCall,
  type Behaviour, type Mechanic, type Nudge, type Referral, type RiyaazBehaviour, type RiyaazMechanic, type RiyaazNudge, type RiyaazReferral,
} from './retention';

describe('Riyaaz’s habit calls', () => {
  const keys = Object.keys(RIYAAZ_BEHAVIOURS) as RiyaazBehaviour[];
  it('calls every behaviour', () => {
    expect(Object.fromEntries(keys.map(k => [k, habitCall(RIYAAZ_BEHAVIOURS[k])]))).toEqual({
      riyaz: 'loop', record: 'loop', demo: 'loop', sendTake: 'loop',
      renew: 'moment', exam: 'moment', newRaga: 'moment', baithak: 'moment',
      reels: 'leave', board: 'leave', spin: 'leave', badges: 'leave',
    });
    for (const c of HABIT_CALLS) expect(keys.filter(k => habitCall(RIYAAZ_BEHAVIOURS[k]) === c)).toHaveLength(4);
  });
  it('asks who benefits before how often', () => {
    const base: Behaviour = { text: 'x', short: 'x', perWeek: HABIT_MIN_PER_WEEK, useful: true, why: 'x' };
    expect(habitCall(base)).toBe('loop');
    expect(habitCall({ ...base, perWeek: HABIT_MIN_PER_WEEK - 0.01 })).toBe('moment');
    expect(habitCall({ ...base, perWeek: 50, useful: false })).toBe('leave');
    for (const k of keys) expect(RIYAAZ_BEHAVIOURS[k].why.length).toBeGreaterThan(10);
  });
  it('runs the loop in order, and spots a habit only after four strong weeks', () => {
    expect(PRACTICE_LOOP.map(s => s.part)).toEqual(['Cue', 'Routine', 'Reward', 'Investment']);
    expect(HABIT_DAYS).toBe(4); expect(HABIT_WEEKS).toBe(4);
    expect(habitFormed([1, 4, 5, 4, 6])).toBe(true);
    expect(habitFormed([6, 6, 3, 6, 6])).toBe(false);
    expect(habitFormed([7, 7, 7])).toBe(false);
    expect(habitFormed([])).toBe(false);
  });
  it('has L28 shares that add up, with weight moving to the frequent end', () => {
    for (const s of [RIYAAZ_L28.before, RIYAAZ_L28.after]) { expect(s).toHaveLength(L28_BUCKETS.length); expect(s.reduce((a, b) => a + b, 0)).toBe(100); }
    expect(RIYAAZ_L28.after[3]).toBeGreaterThan(RIYAAZ_L28.before[3]);
    expect(RIYAAZ_L28.after[0]).toBeLessThan(RIYAAZ_L28.before[0]);
  });
});

describe('Riyaaz’s notification calls', () => {
  const keys = Object.keys(RIYAAZ_NUDGES) as RiyaazNudge[];
  it('calls every draft', () => {
    expect(Object.fromEntries(keys.map(k => [k, nudgeCall(RIYAAZ_NUDGES[k])]))).toEqual({
      teacherNote: 'send', ownTime: 'send', classPrep: 'send',
      guruSad: 'pressure', streakFear: 'pressure', flashSale: 'pressure',
      darkMode: 'noise', rateUs: 'noise', missYou: 'noise',
      lateNote: 'hold', classMoved: 'hold', ignored: 'hold',
    });
    for (const c of NUDGE_CALLS) expect(keys.filter(k => nudgeCall(RIYAAZ_NUDGES[k]) === c)).toHaveLength(3);
    expect(keys.map(k => holdReason(RIYAAZ_NUDGES[k])).filter(Boolean).sort()).toEqual(['ignored', 'quiet', 'quiet']);
  });
  it('rewrites pressure first, then asks who it serves, then the moment', () => {
    const base: Nudge = { text: 'x', short: 'x', forUser: true, hour: 9, ignored: 0 };
    expect(nudgeCall(base)).toBe('send');
    expect(nudgeCall({ ...base, forUser: false, hour: 23, pressure: 'guilt' })).toBe('pressure');
    expect(nudgeCall({ ...base, forUser: false, hour: 23 })).toBe('noise');
    expect(nudgeCall({ ...base, hour: 23 })).toBe('hold');
    expect(nudgeCall({ ...base, ignored: IGNORE_LIMIT })).toBe('hold');
    expect(nudgeCall({ ...base, ignored: IGNORE_LIMIT - 1 })).toBe('send');
    expect(holdReason(base)).toBeNull();
  });
  it('keeps quiet hours from 22:00 to 7:00', () => {
    expect([QUIET_FROM, QUIET_TO]).toEqual([22, 7]);
    expect(inQuietHours(21.9)).toBe(false); expect(inQuietHours(22)).toBe(true);
    expect(inQuietHours(6.9)).toBe(true); expect(inQuietHours(7)).toBe(false);
  });
  it('sends far less after the cap', () => {
    const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);
    expect(NUDGE_WEEK.before.perDay).toHaveLength(7); expect(NUDGE_WEEK.after.perDay).toHaveLength(7);
    expect(sum(NUDGE_WEEK.after.perDay)).toBeLessThanOrEqual(NUDGE_WEEKLY_CAP + 1);   // the cap, plus one teacher reply
    expect(sum(NUDGE_WEEK.before.perDay)).toBeGreaterThan(5 * NUDGE_WEEKLY_CAP);
    expect(NUDGE_WEEK.after.optOut).toBeLessThan(NUDGE_WEEK.before.optOut);
  });
});

describe('Riyaaz’s game mechanics', () => {
  const keys = Object.keys(RIYAAZ_MECHANICS) as RiyaazMechanic[];
  it('calls every mechanic', () => {
    expect(Object.fromEntries(keys.map(k => [k, rewardCall(RIYAAZ_MECHANICS[k])]))).toEqual({
      shrutiMap: 'keep', teacherMark: 'keep', weekGoal: 'keep',
      xpOpens: 'retarget', droneHours: 'retarget', lessonsWatched: 'retarget',
      cityBoard: 'soften', zeroStreak: 'soften', forcedShare: 'soften',
      streakRepair: 'cut', mysteryBox: 'cut', expiringGems: 'cut',
    });
    for (const c of REWARD_CALLS) expect(keys.filter(k => rewardCall(RIYAAZ_MECHANICS[k]) === c)).toHaveLength(3);
  });
  it('names the need for every mechanic kept, one each', () => {
    const kept = keys.filter(k => rewardCall(RIYAAZ_MECHANICS[k]) === 'keep');
    for (const k of keys) expect(!!(RIYAAZ_MECHANICS[k] as Mechanic).need).toBe(kept.includes(k));
    expect(kept.map(k => (RIYAAZ_MECHANICS[k] as Mechanic).need).sort()).toEqual([...SDT_NEEDS].sort());
  });
  it('cuts money from loss first, then what it counts, then how it feels', () => {
    const base: Mechanic = { text: 'x', short: 'x', rewards: 'skill', controlling: false, paid: false };
    expect(rewardCall(base)).toBe('keep');
    expect(rewardCall({ ...base, controlling: true })).toBe('soften');
    expect(rewardCall({ ...base, controlling: true, rewards: 'proxy' })).toBe('retarget');
    expect(rewardCall({ ...base, rewards: 'proxy', paid: true })).toBe('cut');
  });
  it('shows opens up and practice down after the streak launch', () => {
    const [opens, minutes, tune] = STREAK_LAUNCH;
    expect(opens.streak).toBeGreaterThan(opens.holdout);
    expect(minutes.streak).toBeLessThan(minutes.holdout);
    expect(tune.streak).toBe(tune.holdout);
  });
});

describe('Riyaaz’s referral designs', () => {
  const keys = Object.keys(RIYAAZ_REFERRALS) as RiyaazReferral[];
  it('computes K, kept K and the amplification', () => {
    expect(kFactor(REFERRAL_BASE)).toBe(0.12);
    expect(keptK(REFERRAL_BASE)).toBe(0.06);
    expect(kFactor(RIYAAZ_REFERRALS.duet)).toBe(0.252);
    expect(keptK(RIYAAZ_REFERRALS.teacherLink)).toBe(0.245);
    expect(amplify(0.2)).toBeCloseTo(1.25);
    expect(amplify(0)).toBe(1);
    expect(amplify(1)).toBe(Infinity);
    expect(Math.round(1000 * amplify(REFERRAL_NEW_KEPT_K))).toBe(1250);   // the scene's last beat
    expect(Math.round(1000 * amplify(kFactor(REFERRAL_BASE)))).toBe(1136);
  });
  it('calls every design', () => {
    expect(Object.fromEntries(keys.map(k => [k, referralCall(RIYAAZ_REFERRALS[k])]))).toEqual({
      duet: 'ship', teacherLink: 'ship', twoSided: 'ship',
      cashSignup: 'hollow', contest: 'hollow', freeMonth: 'hollow',
      contacts: 'dark', autoStatus: 'dark', inviteLock: 'dark',
      settingsShare: 'flat', badgeShare: 'flat', homeBanner: 'flat',
    });
    for (const c of REFERRAL_CALLS) expect(keys.filter(k => referralCall(RIYAAZ_REFERRALS[k]) === c)).toHaveLength(3);
    expect(referralCall(REFERRAL_BASE)).toBe('flat');
  });
  it('makes every dark design look good on the numbers, and says what breaks it', () => {
    for (const k of keys) {
      const r = RIYAAZ_REFERRALS[k] as Referral;
      expect(!!r.unfair).toBe(!r.fair);
      if (!r.fair) expect(keptK(r)).toBeGreaterThan(keptK(REFERRAL_BASE));   // the trap: it would ship on numbers alone
      for (const n of [r.conversion, r.kept]) { expect(n).toBeGreaterThan(0); expect(n).toBeLessThan(1); }
    }
  });
  it('judges fairness, then who stays, then how many come', () => {
    const base: Referral = { ...REFERRAL_BASE };
    expect(referralCall({ ...base, invites: 10, fair: false })).toBe('dark');
    expect(referralCall({ ...base, invites: 2, kept: 0.1 })).toBe('hollow');
    expect(referralCall({ ...base, kept: 0.9 })).toBe('ship');
  });
});
