import { describe, expect, it } from 'vitest';
import {
  FLOW_FIXES, FLOW_STAGES, HEALTH_CALLS, MIN_GROUP, ORG_FIXES, SAATHI_PROBLEMS, SAATHI_READINGS, SAATHI_STEPS,
  engineersPerDesigner, flowEfficiency, flowFix, flowHours, healthCall, healthCheck, orgFix, orgShape, overStreak, workDays,
  type FlowStep, type HealthReading, type SaathiProblem, type SaathiReading, type SaathiStep, type ScaleProblem,
} from './designops';

describe('tooling and workflows', () => {
  const keys = Object.keys(SAATHI_STEPS) as SaathiStep[];
  it('removes before it unblocks, unblocks before it standardises, and automates only what is left', () => {
    const base: FlowStep = { text: 'x', short: 'x', stage: 'design', touch: 1, wait: 1, value: true, fixed: 'x', after: { touch: 0, wait: 0 } };
    expect(flowFix(base)).toBe('automate');
    expect(flowFix({ ...base, varies: 'y' })).toBe('standardise');
    expect(flowFix({ ...base, varies: 'y', gate: 'z' })).toBe('unblock');
    expect(flowFix({ ...base, varies: 'y', gate: 'z', value: false })).toBe('remove');   // never automate waste
  });
  it('sorts Saathi’s steps three to a fix, and every step shrinks', () => {
    expect(Object.fromEntries(keys.map(k => [k, flowFix(SAATHI_STEPS[k])]))).toEqual({
      dupe: 'remove', signoff: 'remove', redlines: 'remove',
      wip: 'unblock', a11y: 'unblock', legal: 'unblock',
      files: 'standardise', tools: 'standardise', ready: 'standardise',
      ticket: 'automate', tokens: 'automate', qa: 'automate',
    });
    for (const f of FLOW_FIXES) expect(keys.filter(k => flowFix(SAATHI_STEPS[k]) === f)).toHaveLength(3);
    for (const k of keys) {
      const s = SAATHI_STEPS[k];
      expect(FLOW_STAGES).toContain(s.stage);
      expect(s.after.touch + s.after.wait).toBeLessThan(s.touch + s.wait);
      if (flowFix(s) === 'remove') expect(s.after).toEqual({ touch: 0, wait: 0 });
    }
  });
  it('goes from 27 working days at 21% flow efficiency to 6 days at 47%', () => {
    const before = flowHours(keys), after = flowHours(keys, keys);
    expect(before).toEqual({ touch: 44, wait: 170 });
    expect(after).toEqual({ touch: 22, wait: 25 });
    expect([workDays(before.touch + before.wait), flowEfficiency(before)]).toEqual([27, 21]);
    expect([workDays(after.touch + after.wait), flowEfficiency(after)]).toEqual([6, 47]);
    expect(flowEfficiency({ touch: 0, wait: 0 })).toBe(0);
    expect(flowHours(['signoff'], ['signoff'])).toEqual({ touch: 0, wait: 0 });
  });
});

describe('measuring design team health', () => {
  const keys = Object.keys(SAATHI_READINGS) as SaathiReading[];
  const base: HealthReading = { text: 'x', short: 'x', area: 'people', kind: 'team', history: [50, 60, 70], unit: '%', limit: 65, worse: 'above' };
  it('counts the quarters in a row over the line, from the latest back', () => {
    expect(overStreak(base)).toBe(1);
    expect(overStreak({ ...base, history: [70, 60, 70] })).toBe(1);
    expect(overStreak({ ...base, history: [70, 70, 70] })).toBe(3);
    expect(overStreak({ ...base, worse: 'below' })).toBe(0);
    expect(overStreak({ ...base, worse: 'below', history: [70, 60, 50] })).toBe(2);
    expect(overStreak({ ...base, limit: undefined })).toBe(0);
  });
  it('drops activity and per-person numbers, and acts only on a trend from enough people', () => {
    expect(healthCall({ ...base, kind: 'output', history: [70, 70, 70] })).toBe('drop');
    expect(healthCall({ ...base, kind: 'person' })).toBe('drop');
    expect(healthCall({ ...base, history: [70, 60, 60] })).toBe('healthy');
    expect(healthCall(base)).toBe('watch');
    expect(healthCall({ ...base, history: [70, 70, 70] })).toBe('act');
    expect(healthCall({ ...base, history: [70, 70, 70], n: MIN_GROUP - 1 })).toBe('watch');
    expect(healthCall({ ...base, history: [70, 70, 70], n: MIN_GROUP })).toBe('act');
  });
  it('reads Saathi’s health check three to a call', () => {
    expect(healthCheck(keys)).toEqual({
      drop: ['screens', 'figma', 'closed'], healthy: ['lead', 'escapes', 'attrition'],
      watch: ['focus', 'ratio', 'workload'], act: ['safety', 'research', 'hiring'],
    });
    for (const c of HEALTH_CALLS) expect(keys.filter(k => healthCall(SAATHI_READINGS[k]) === c)).toHaveLength(3);
    for (const k of keys) {
      const r = SAATHI_READINGS[k];
      expect(r.history).toHaveLength(3);
      if (r.kind === 'team') expect(r.limit !== undefined && !!r.worse).toBe(true);
      else expect(r.limit).toBeUndefined();
    }
    expect(engineersPerDesigner(410, 38)).toBe(SAATHI_READINGS.ratio.history[2]);
    expect(engineersPerDesigner(10, 0)).toBe(0);
  });
});

describe('scaling design across an org', () => {
  const keys = Object.keys(SAATHI_PROBLEMS) as SaathiProblem[];
  it('asks for context first, then a shared asset, then coordination, and leaves craft to the guild', () => {
    const base: ScaleProblem = { text: 'x', short: 'x', squads: 3, context: false, asset: false, admin: false, owner: 'x', fixed: 'x' };
    expect(orgFix(base)).toBe('guild');
    expect(orgFix({ ...base, admin: true })).toBe('ops');
    expect(orgFix({ ...base, admin: true, asset: true })).toBe('hub');
    expect(orgFix({ ...base, admin: true, asset: true, context: true })).toBe('embed');
  });
  it('sorts Saathi’s problems three to a part of the org, with one owner a part except the hub', () => {
    const shape = orgShape(keys);
    expect(Object.fromEntries(ORG_FIXES.map(f => [f, shape[f].problems]))).toEqual({
      embed: ['queue', 'planning', 'doctors'], hub: ['pickers', 'medText', 'a11y'],
      ops: ['hiring', 'onboarding', 'launch'], guild: ['drift', 'alone', 'tricks'],
    });
    expect(shape.embed.owners).toEqual(['Squad designers']);
    expect(shape.hub.owners).toEqual(['Design system team', 'Content design', 'Accessibility lead']);
    expect(shape.ops.owners).toEqual(['DesignOps']);
    expect(shape.guild.owners).toEqual(['Craft guild']);
    expect(orgShape([]).hub).toEqual({ owners: [], problems: [] });
    for (const k of keys) expect(SAATHI_PROBLEMS[k].squads).toBeGreaterThan(0);
  });
});
