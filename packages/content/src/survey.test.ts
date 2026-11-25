import { describe, expect, it } from 'vitest';
import {
  BOLO_CLAIMS, BOLO_FIELD, BOLO_GAPS, BOLO_ITEMS, BOLO_SIGNALS, GAP_CALLS, GATES, SURVEY_PARTS, WEIGHTS,
  gapCall, gapInterval, invitesFor, marginGrade, moe, optionFlaw, responsesFor, sampleFlaw, segmentChanges, segmentStory, signalGate, surveyFlaw, triangulate, zFor,
  type BoloClaim, type BoloGap, type BoloItem, type BoloSignal, type GapRead,
} from './survey';
import { twoProp } from './stats';

describe('Survey design & sampling', () => {
  const keys = Object.keys(BOLO_ITEMS) as BoloItem[];
  it('quotes the margins of error the textbooks do', () => {
    expect(zFor()).toBeCloseTo(1.96, 2);
    expect(moe(385)).toBeCloseTo(0.0499, 3);
    expect(moe(1000)).toBeCloseTo(0.031, 3);
    expect(responsesFor(0.05)).toBe(385);
    expect(responsesFor(0.03)).toBe(1068);
    expect(responsesFor(0.05, 0.5, 0.99)).toBe(664);
    // A known small population needs fewer: 2,000 people → 323 for ±5 points.
    expect(responsesFor(0.05, 0.5, 0.95, 2000)).toBe(323);
    expect(moe(2000, 0.5, 0.95, 2000)).toBeCloseTo(0, 9);
    // Halving the margin takes four times the people; a skewed share is less noisy than 50/50.
    expect(responsesFor(0.025) / responsesFor(0.05)).toBeCloseTo(4, 1);
    expect(moe(400, 0.1)).toBeLessThan(moe(400));
    expect(invitesFor(385, 0.41)).toBe(940);
  });
  it('finds broken answer options', () => {
    expect(optionFlaw({ options: [{ label: '0', range: [0, 0] }, { label: '1–10', range: [1, 10] }, { label: '10–20', range: [10, 20] }] })).toBe('overlap');
    expect(optionFlaw({ options: [{ label: '0', range: [0, 0] }, { label: '2–5', range: [2, 5] }] })).toBe('gap');
    expect(optionFlaw({ options: [{ label: 'Good', tone: 1 }, { label: 'OK', tone: 0 }, { label: 'Bad', tone: -1 }] })).toBeNull();
    expect(optionFlaw({ options: [{ label: 'Great', tone: 2 }, { label: 'Good', tone: 1 }, { label: 'Bad', tone: -1 }] })).toBe('unbalanced');
    expect(optionFlaw({ needsOut: true, options: [{ label: 'A' }, { label: 'B' }] })).toBe('no-out');
    expect(sampleFlaw({ covers: false, random: false })).toBe('coverage');   // coverage first: more answers can't fix it
    expect(sampleFlaw({ covers: true, random: false })).toBe('self-selected');
  });
  it('gives every draft item at most one broken part, and uses every lane', () => {
    for (const k of keys) {
      const i = BOLO_ITEMS[k];
      expect([!!i.stemFlaw, !!optionFlaw(i), !!sampleFlaw(i)].filter(Boolean).length).toBeLessThanOrEqual(1);
    }
    expect(Object.fromEntries(keys.map(k => [k, surveyFlaw(BOLO_ITEMS[k])]))).toEqual({
      confidence: 'stem', lessonPrice: 'stem', wouldJoin: 'stem', minutes: 'options', rating: 'options', goal: 'options',
      popup: 'sample', lapsed: 'sample', lastWeek: 'sound', evenings: 'sound',
    });
    for (const p of SURVEY_PARTS) expect(keys.some(k => surveyFlaw(BOLO_ITEMS[k]) === p)).toBe(true);
    expect(Math.round((BOLO_FIELD.responded / BOLO_FIELD.invites) * 100)).toBe(41);
    expect(Math.round(moe(BOLO_FIELD.responded) * 1000) / 10).toBe(4.4);
  });
});

describe('Statistical significance, intuitively', () => {
  const keys = Object.keys(BOLO_GAPS) as BoloGap[];
  it('makes a lead in one sample about twice as noisy as one share', () => {
    const r: GapRead = { text: '', kind: 'lead', a: { label: 'A', n: 400, x: 192 }, b: { label: 'B', n: 400, x: 208 }, matters: 0.05 };
    const g = gapInterval(r);
    expect(g.diff).toBeCloseTo(0.04, 9);
    expect(g.half / moe(400)).toBeGreaterThan(1.95);
    expect(g.half / moe(400)).toBeLessThan(2.01);
    // Between two groups, the interval is the one ./stats gives.
    const b: GapRead = { ...r, kind: 'between' }, t = twoProp(b.a, b.b);
    expect(gapInterval(b).lo).toBeCloseTo(t.ci[0], 12);
    expect(gapInterval(b).hi).toBeCloseTo(t.ci[1], 12);
  });
  it('reads every gap the way its interval says, two of each', () => {
    expect(Object.fromEntries(keys.map(k => [k, gapCall(BOLO_GAPS[k])]))).toEqual({
      headline: 'unclear', followup: 'real', jobseekers: 'real', lessonScreen: 'small', cities: 'small', voice: 'none', reminder: 'none', women30: 'unclear',
    });
    for (const c of GAP_CALLS) expect(keys.filter(k => gapCall(BOLO_GAPS[k]) === c)).toHaveLength(2);
  });
  it('has no card sitting on a boundary', () => {
    for (const k of keys) {
      const r = BOLO_GAPS[k], { diff, lo, hi } = gapInterval(r), c = gapCall(r);
      if (c === 'small') { expect(Math.max(Math.abs(lo), Math.abs(hi))).toBeLessThan(r.matters); }   // the whole interval is too small to matter
      if (c === 'real') expect(Math.min(Math.abs(lo), Math.abs(hi))).toBeGreaterThan(0.05);   // clearly away from zero
      if (c === 'unclear') expect(Math.max(-lo, hi)).toBeGreaterThan(r.matters + 0.05);
      expect(Math.abs(diff)).toBeGreaterThan(0);
      for (const arm of [r.a, r.b]) { expect(arm.x).toBeGreaterThanOrEqual(10); expect(arm.n - arm.x).toBeGreaterThanOrEqual(10); }   // big enough for a normal approximation
    }
    // The headline gap that looked like a win: 52% against 44%, but zero is inside the interval.
    const h = gapInterval(BOLO_GAPS.headline);
    expect(Math.round(h.diff * 100)).toBe(8);
    expect(h.lo).toBeLessThan(0);
    // The subgroups come from the same 492 people.
    expect(BOLO_GAPS.women30.a.n + BOLO_GAPS.women30.b.n).toBe(BOLO_FIELD.responded);
    expect(BOLO_GAPS.headline.a.n).toBe(BOLO_FIELD.responded);
  });
  it('grades estimates of the margin', () => {
    expect(marginGrade(9, 8.6)).toBe('spot');
    expect(marginGrade(7, 8.6)).toBe('close');
    expect(marginGrade(4, 8.6)).toBe('off');
    expect(marginGrade(16, 18.1)).toBe('close');
  });
});

describe('Analytics as research', () => {
  const keys = Object.keys(BOLO_SIGNALS) as BoloSignal[];
  it('stops each signal at the right gate, two at each', () => {
    expect(Object.fromEntries(keys.map(k => [k, signalGate(BOLO_SIGNALS[k])]))).toEqual({
      dau: 'instrument', ratings: 'instrument', trial: 'segment', fiveDays: 'segment', dayThree: 'ask', speakFirst: 'ask', bestTime: 'act', quits: 'act',
    });
    for (const g of GATES) expect(keys.filter(k => signalGate(BOLO_SIGNALS[k]) === g)).toHaveLength(2);
  });
  it('tells a change in the mix from a change in one slice, and from a change everywhere', () => {
    const trial = segmentChanges(BOLO_SIGNALS.trial.segments!);
    expect(trial.overall.p).toBeLessThan(0.001);
    for (const s of trial.slices) expect(s.p).toBeGreaterThan(0.5);   // neither group converts any differently
    expect(segmentStory(BOLO_SIGNALS.trial.segments)).toBe('mix');
    expect(Math.round(trial.overall.pa * 100)).toBe(20);
    expect(Math.round(trial.overall.pb * 100)).toBe(16);
    const five = segmentChanges(BOLO_SIGNALS.fiveDays.segments!);
    expect(five.slices.filter(s => s.p < 0.05).map(s => s.name)).toEqual(['Coimbatore']);
    expect(segmentStory(BOLO_SIGNALS.fiveDays.segments)).toBe('one');
    expect(segmentStory(BOLO_SIGNALS.speakFirst.segments)).toBeNull();
    expect(segmentStory(undefined)).toBeNull();
    // Flat overall: nothing to explain.
    expect(segmentStory([{ name: 'a', before: { n: 1000, x: 200 }, after: { n: 1000, x: 201 } }, { name: 'b', before: { n: 1000, x: 300 }, after: { n: 1000, x: 299 } }])).toBeNull();
  });
});

describe('Triangulation', () => {
  const keys = Object.keys(BOLO_CLAIMS) as BoloClaim[];
  it('weighs every claim, three of each', () => {
    expect(Object.fromEntries(keys.map(k => [k, triangulate(BOLO_CLAIMS[k])]))).toEqual({
      drills: 'confident', price: 'conflict', certificate: 'lead', mic: 'confident', liveDemand: 'conflict', slow: 'conflict', hindi: 'confident', grammar: 'lead', friends: 'lead',
    });
    for (const w of WEIGHTS) expect(keys.filter(k => triangulate(BOLO_CLAIMS[k]) === w)).toHaveLength(3);
  });
  it('needs both kinds of evidence, not just more of one', () => {
    expect(triangulate({ text: '', sources: [{ method: 'survey', finding: '', agrees: true }, { method: 'interview', finding: '', agrees: true }, { method: 'support', finding: '', agrees: true }] })).toBe('lead');
    expect(triangulate({ text: '', sources: [{ method: 'analytics', finding: '', agrees: true }] })).toBe('lead');
    expect(triangulate({ text: '', sources: [{ method: 'survey', finding: '', agrees: true }, { method: 'usability', finding: '', agrees: true }] })).toBe('confident');
    expect(triangulate({ text: '', sources: [{ method: 'survey', finding: '', agrees: true }, { method: 'usability', finding: '', agrees: true }, { method: 'support', finding: '', agrees: false }] })).toBe('conflict');
  });
});
