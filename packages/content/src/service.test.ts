import { describe, expect, it } from 'vitest';
import {
  BLUEPRINT_PHASES, BLUEPRINT_ROWS, HR_SPEND_LIMIT, MIN_REPORT_GROUP, NABZ_DUTIES, NABZ_ROLES, NABZ_STEPS, NABZ_TASKS, SCALE_LIST_MAX, SCALE_PATTERNS, SHOW_ALL_MAX,
  blueprintRow, dutyOwner, failPoints, linesCrossed, roleHandoffs, scalePattern, scrollScreens,
  type NabzDuty, type NabzStep, type NabzTask,
} from './service';

describe('Service blueprint', () => {
  const keys = Object.keys(NABZ_STEPS) as NabzStep[];
  it('puts every step of the home visit in its row', () => {
    expect(Object.fromEntries(keys.map(k => [k, blueprintRow(NABZ_STEPS[k])]))).toEqual({
      book: 'customer', slots: 'support', route: 'back', eta: 'front', fasting: 'customer', agent: 'front',
      draw: 'front', hub: 'back', rider: 'support', signoff: 'support', whatsapp: 'front', read: 'customer',
    });
    for (const r of BLUEPRINT_ROWS) expect(keys.some(k => blueprintRow(NABZ_STEPS[k]) === r)).toBe(true);
  });
  it('treats a screen or message the customer sees as frontstage, whoever sends it', () => {
    expect(NABZ_STEPS.whatsapp.actor).toBe('support');
    expect(blueprintRow(NABZ_STEPS.whatsapp)).toBe('front');
    expect(blueprintRow({ text: 'x', actor: 'contact', visible: false, phase: 'visit' })).toBe('back');
  });
  it('runs in time order, through every phase', () => {
    const phases = keys.map(k => BLUEPRINT_PHASES.indexOf(NABZ_STEPS[k].phase));
    expect(phases).toEqual([...phases].sort((a, b) => a - b));
    expect(new Set(phases).size).toBe(BLUEPRINT_PHASES.length);
  });
  it('marks the fail points, all below the line of visibility but one', () => {
    expect(failPoints()).toEqual(['slots', 'route', 'agent', 'hub']);
    expect(failPoints().filter(k => blueprintRow(NABZ_STEPS[k as NabzStep]) === 'front')).toEqual(['agent']);
  });
  it('names the lines a hand-off crosses', () => {
    expect(linesCrossed('customer', 'front')).toEqual(['interaction']);
    expect(linesCrossed('support', 'customer')).toEqual(['interaction', 'visibility', 'internal']);
    expect(linesCrossed('back', 'back')).toEqual([]);
  });
});

describe('Multi-role workflow', () => {
  const keys = Object.keys(NABZ_DUTIES) as NabzDuty[];
  it('gives every step of the check-up to its owner', () => {
    expect(Object.fromEntries(keys.map(k => [k, dutyOwner(NABZ_DUTIES[k])]))).toEqual({
      packages: 'hr', order: 'finance', joiners: 'hr', camps: 'nabz', slot: 'employee', remind: 'hr',
      result: 'employee', consult: 'employee', hydStats: 'hr', kochi: 'nabz', topup: 'finance',
    });
    for (const r of NABZ_ROLES) expect(keys.some(k => dutyOwner(NABZ_DUTIES[k]) === r)).toBe(true);
  });
  it('sends money over HR’s limit to finance, and keeps small groups’ health numbers from the client', () => {
    expect(dutyOwner({ text: 'x', kind: 'spend', amount: HR_SPEND_LIMIT })).toBe('hr');
    expect(dutyOwner({ text: 'x', kind: 'spend', amount: HR_SPEND_LIMIT + 1 })).toBe('finance');
    expect(dutyOwner({ text: 'x', kind: 'aggregate', group: MIN_REPORT_GROUP })).toBe('hr');
    expect(dutyOwner({ text: 'x', kind: 'aggregate', group: MIN_REPORT_GROUP - 1 })).toBe('nabz');
  });
  it('counts hand-offs between roles', () => {
    expect(roleHandoffs([])).toBe(0);
    expect(roleHandoffs(['hr', 'hr', 'finance', 'hr', 'employee'])).toBe(3);
    expect(roleHandoffs(keys.map(k => dutyOwner(NABZ_DUTIES[k])))).toBe(9);
  });
});

describe('Designing for scale', () => {
  const keys = Object.keys(NABZ_TASKS) as NabzTask[];
  it('picks the pattern each screen needs at its size', () => {
    expect(Object.fromEntries(keys.map(k => [k, scalePattern(NABZ_TASKS[k])]))).toEqual({
      slots: 'all', packages: 'all', cities: 'list', sites: 'list', tests: 'search', staff: 'search',
      route: 'list', moveDay: 'list', samples: 'rules', fleet: 'rules', nudge: 'rules',
    });
    for (const s of SCALE_PATTERNS) expect(keys.some(k => scalePattern(NABZ_TASKS[k]) === s)).toBe(true);
  });
  it('changes pattern at the thresholds, not before', () => {
    const pick = (count: number) => scalePattern({ text: 'x', who: 'y', job: 'pick', count });
    expect([pick(SHOW_ALL_MAX), pick(SHOW_ALL_MAX + 1), pick(SCALE_LIST_MAX), pick(SCALE_LIST_MAX + 1)]).toEqual(['all', 'list', 'list', 'search']);
    expect(scalePattern({ text: 'x', who: 'y', job: 'watch', count: 3 })).toBe('list');
    expect(scalePattern({ text: 'x', who: 'y', job: 'act', count: SCALE_LIST_MAX + 1 })).toBe('rules');
  });
  it('counts the scrolling a plain list would cost', () => {
    expect(scrollScreens(8)).toBe(1);
    expect(scrollScreens(4200)).toBe(420);
    expect(scrollScreens(NABZ_TASKS.samples.count)).toBe(900);
  });
});
