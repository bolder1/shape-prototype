import { describe, expect, it } from 'vitest';
import {
  HAZRI_CHOICES, HAZRI_LINES, HAZRI_MATURITY, HAZRI_PROGRAM, INCENTIVE_PER_HOUR, MATURITY_STAGES, PERSONA_FLAWS, PERSONA_SESSIONS,
  PROGRAM_QUARTERS, STUDY_FLAWS, STUDY_STEPS, fairIncentive, personaFlaw, programLane, programQuarter, studyFlaw, unmetNeeds,
  type HazriChoice, type HazriLine, type HazriStep, type PersonaLine, type StudyChoice,
} from './inclusive';

describe('Hazri study plan', () => {
  const keys = Object.keys(HAZRI_CHOICES) as HazriChoice[];
  it('finds the flaw in every choice', () => {
    expect(Object.fromEntries(keys.map(k => [k, studyFlaw(HAZRI_CHOICES[k])]))).toEqual({
      pay: 'harms', diagnosis: 'harms', footage: 'harms',
      consent: 'excludes', interpreter: 'excludes', stairs: 'excludes',
      labPhone: 'skews', takeOver: 'skews', oneSpeaks: 'skews',
      network: 'sound', pacing: 'sound', audio: 'sound',
    });
    for (const f of STUDY_FLAWS) expect(keys.filter(k => studyFlaw(HAZRI_CHOICES[k]) === f).length).toBeGreaterThanOrEqual(2);
  });
  it('gives every flawed choice exactly one flaw and a fix, and covers every stage', () => {
    for (const k of keys) {
      const c = HAZRI_CHOICES[k] as StudyChoice;
      const flaws = [c.harms, c.excludes, c.skews].filter(Boolean).length;
      expect(flaws).toBe(studyFlaw(c) === 'sound' ? 0 : 1);
      expect(!!c.fix).toBe(studyFlaw(c) !== 'sound');
    }
    for (const s of STUDY_STEPS) expect(keys.some(k => HAZRI_CHOICES[k].step === s)).toBe(true);
  });
  it('ranks harm over exclusion over skew', () => {
    const base: StudyChoice = { text: 'x', step: 'run', harms: false, excludes: false, skews: false };
    expect(studyFlaw({ ...base, harms: true, excludes: true, skews: true })).toBe('harms');
    expect(studyFlaw({ ...base, excludes: true, skews: true })).toBe('excludes');
    expect(studyFlaw({ ...base, skews: true })).toBe('skews');
  });
  it('pays by the hour, rounded up, never less for disabled participants', () => {
    expect(fairIncentive(60)).toBe(INCENTIVE_PER_HOUR);
    expect(fairIncentive(90)).toBe(2250);
    expect(fairIncentive(45)).toBe(1150);
    expect(fairIncentive(90)).toBeGreaterThan(1000);   // what the bad plan offered
    expect(HAZRI_CHOICES.pay.fix).toContain('2,250');
  });
});

describe('Revathi’s persona', () => {
  const keys = Object.keys(HAZRI_LINES) as HazriLine[];
  it('judges every line', () => {
    expect(Object.fromEntries(keys.map(k => [k, personaFlaw(HAZRI_LINES[k])]))).toEqual({
      deadline: 'keep', tamil: 'keep', zoom: 'keep', tables: 'keep', toast: 'keep',
      brave: 'stereotype', tech: 'stereotype', help: 'stereotype',
      darkMode: 'unfounded', reader: 'unfounded',
      rp: 'diagnosis', disabled: 'diagnosis',
    });
    for (const f of PERSONA_FLAWS) expect(keys.filter(k => personaFlaw(HAZRI_LINES[k]) === f).length).toBeGreaterThanOrEqual(2);
  });
  it('keeps only lines with evidence, and decides what replaces every flawed one', () => {
    for (const k of keys) {
      const l = HAZRI_LINES[k] as PersonaLine;
      expect(l.evidence).toBeLessThanOrEqual(PERSONA_SESSIONS);
      if (personaFlaw(l) === 'keep') { expect(l.evidence).toBeGreaterThan(0); expect(l.rewrite).toBeUndefined(); }
      else expect(l.rewrite === null || (typeof l.rewrite === 'string' && l.rewrite.length > 0)).toBe(true);
    }
  });
  it('lets a stereotype lose even with evidence, and a guess lose before a label', () => {
    const base: PersonaLine = { text: 'x', evidence: 3, stereotype: false, labelOnly: false, part: 'context' };
    expect(personaFlaw(base)).toBe('keep');
    expect(personaFlaw({ ...base, stereotype: true, evidence: 9 })).toBe('stereotype');
    expect(personaFlaw({ ...base, evidence: 0, labelOnly: true })).toBe('unfounded');
    expect(personaFlaw({ ...base, labelOnly: true })).toBe('diagnosis');
  });
});

describe('Hazri’s accessibility programme', () => {
  const keys = Object.keys(HAZRI_PROGRAM) as HazriStep[];
  it('schedules every step at the earliest quarter its needs allow', () => {
    expect(Object.fromEntries(keys.map(k => [k, programLane(k)]))).toEqual({
      exec: 'q1', baseline: 'q1', champions: 'q1',
      policy: 'q2', components: 'q2', critical: 'q2', training: 'q2',
      gate: 'q3', acr: 'q3', statement: 'q3',
      dashboard: 'q4', procurement: 'q4',
    });
    for (const q of PROGRAM_QUARTERS) expect(keys.filter(k => programLane(k) === q).length).toBeGreaterThanOrEqual(2);
  });
  it('has no unknown needs, no loops, and fits in a year', () => {
    for (const k of keys) {
      for (const n of HAZRI_PROGRAM[k].needs) expect(keys).toContain(n);
      expect(() => programQuarter(k)).not.toThrow();
      expect(programQuarter(k)).toBeLessThan(PROGRAM_QUARTERS.length);
      expect(HAZRI_PROGRAM[k].owner).toBeTruthy();
    }
  });
  it('says what is missing when a step is placed too early', () => {
    expect(unmetNeeds('gate', 2)).toEqual([]);
    expect(unmetNeeds('gate', 1)).toEqual(['policy', 'components', 'training']);
    expect(unmetNeeds('acr', 0)).toEqual(['critical', 'policy']);
    expect(unmetNeeds('exec', 0)).toEqual([]);
    for (const k of keys) expect(unmetNeeds(k, programQuarter(k))).toEqual([]);
  });
  it('aims higher on every maturity dimension, within the model', () => {
    for (const d of HAZRI_MATURITY) { expect(d.aim).toBeGreaterThan(d.now); expect(d.aim).toBeLessThan(MATURITY_STAGES.length); }
  });
});
