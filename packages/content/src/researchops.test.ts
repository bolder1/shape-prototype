import { describe, expect, it } from 'vitest';
import {
  ATOM_LANES, FULL_STUDY_HOURS, HALF_WEEKS, INSIGHT_STUDIES, MUSAFIR_ATOMS, MUSAFIR_PLANS, MUSAFIR_REQUESTS, Q1_END, RESEARCHERS, SLOTS, SUPPORT,
  atomLane, decidingLine, latestStart, researcherHours, roadmapSlot, studiesBehind, studyWeeks, support, weekDate, weekLoad,
  type Atom, type MusafirAtom, type MusafirPlan, type MusafirRequest,
} from './researchops';

describe('Research roadmap', () => {
  const keys = Object.keys(MUSAFIR_REQUESTS) as MusafirRequest[];
  const all = keys.map(k => MUSAFIR_REQUESTS[k]);
  it('slots every request by its decision, its stakes and when it has to start', () => {
    expect(Object.fromEntries(keys.map(k => [k, roadmapSlot(MUSAFIR_REQUESTS[k])]))).toEqual({
      pass: 'q1', boarding: 'q1', operator: 'q1', women: 'q2', ratings: 'q2', autopay: 'q2',
      seatmap: 'backlog', rail: 'backlog', refunds: 'none', darkmode: 'none',
    });
    for (const s of SLOTS) expect(keys.some(k => roadmapSlot(MUSAFIR_REQUESTS[k]) === s)).toBe(true);
  });
  it('schedules backwards: a decision in May needs research that starts in Q1', () => {
    const op = MUSAFIR_REQUESTS.operator;
    expect(op.due!).toBeGreaterThan(Q1_END);
    expect(latestStart(op)).toBe(12);
    expect(studyWeeks(op)).toEqual([12, 19]);
    expect(latestStart(MUSAFIR_REQUESTS.darkmode)).toBeNull();
  });
  it('lands every scheduled study inside the half, before its decision', () => {
    for (const r of all) {
      const s = roadmapSlot(r);
      if (s !== 'q1' && s !== 'q2') continue;
      const [a, b] = studyWeeks(r)!;
      expect(a).toBeGreaterThanOrEqual(1);
      expect(b).toBeLessThan(r.due!);
      expect(b).toBeLessThanOrEqual(HALF_WEEKS);
    }
  });
  it('never asks for more studies at once than there are researchers', () => {
    const load = weekLoad(all);
    expect(load).toHaveLength(HALF_WEEKS);
    expect(Math.max(...load)).toBe(RESEARCHERS);
    expect(load[16]).toBe(3);   // week 17: operator, women, ratings
  });
  it('dates weeks from Monday 4 January 2027', () => {
    expect(weekDate(1)).toBe('4 Jan');
    expect(weekDate(10)).toBe('8 Mar');
    expect(weekDate(20)).toBe('17 May');
    expect(weekDate(26)).toBe('28 Jun');
  });
});

describe('Atomic research', () => {
  const keys = Object.keys(MUSAFIR_ATOMS) as MusafirAtom[];
  it('files every note as a fact, an insight, a recommendation, or a note to fix', () => {
    expect(Object.fromEntries(keys.map(k => [k, atomLane(k)]))).toEqual({
      whenMoney: 'fact', where48: 'fact', landmarkSent: 'fact', landmarkTicket: 'fact', hate: 'fix',
      uncertain: 'insight', landmarks: 'insight', callDriver: 'fix',
      refundDate: 'rec', landmarkLine: 'rec', chatbot: 'fix', majestic: 'fix',
    });
    for (const l of ATOM_LANES) expect(keys.some(k => atomLane(k) === l)).toBe(true);
  });
  it('traces a recommendation down to the studies under it', () => {
    expect(studiesBehind('refundDate')).toEqual(['interviews', 'tickets']);
    expect(studiesBehind('landmarkLine')).toEqual(['diary', 'tickets']);
    expect(studiesBehind('callDriver')).toEqual(['diary']);
    expect(studiesBehind('callDriver').length).toBeLessThan(INSIGHT_STUDIES);
  });
  it('lets a one-study insight in once a second study backs it, and drops a recommendation whose insight fails', () => {
    const more: Record<string, Atom> = { ...MUSAFIR_ATOMS, callTicket: { text: '', level: 'fact', source: 'tickets', links: [] }, callDriver: { ...MUSAFIR_ATOMS.callDriver, links: ['landmarkSent', 'callTicket'] } };
    expect(atomLane('callDriver', more)).toBe('insight');
    const weak: Record<string, Atom> = { ...MUSAFIR_ATOMS, landmarks: { ...MUSAFIR_ATOMS.landmarks, links: ['landmarkSent'] } };
    expect(atomLane('landmarkLine', weak)).toBe('fix');
    const onHate: Record<string, Atom> = { ...MUSAFIR_ATOMS, uncertain: { ...MUSAFIR_ATOMS.uncertain, links: ['hate', 'where48'] } };
    expect(atomLane('uncertain', onHate)).toBe('fix');   // a fact with no source can't hold an insight up
  });
  it('links only to notes that exist', () => {
    for (const k of keys) for (const l of MUSAFIR_ATOMS[k].links) expect(keys).toContain(l);
  });
});

describe('Democratized research', () => {
  const keys = Object.keys(MUSAFIR_PLANS) as MusafirPlan[];
  it('gives every plan the support its riskiest line needs', () => {
    expect(Object.fromEntries(keys.map(k => [k, support(MUSAFIR_PLANS[k])]))).toEqual({
      seatTest: 'go', depotWatch: 'go', passCheckout: 'review', priceSurvey: 'review', cancelChats: 'review',
      railInterviews: 'partner', harassment: 'partner', drivers: 'partner', phoneClips: 'stop', coldCalls: 'stop',
    });
    for (const s of SUPPORT) expect(keys.some(k => support(MUSAFIR_PLANS[k]) === s)).toBe(true);
  });
  it('names the line that decided it', () => {
    expect(Object.fromEntries(keys.map(k => [k, decidingLine(MUSAFIR_PLANS[k])]))).toEqual({
      seatTest: 'none', depotWatch: 'none', passCheckout: 'stakes', priceSurvey: 'method', cancelChats: 'method',
      railInterviews: 'method', harassment: 'people', drivers: 'people', phoneClips: 'data', coldCalls: 'data',
    });
    for (const k of keys) expect(decidingLine(MUSAFIR_PLANS[k]) === 'none').toBe(support(MUSAFIR_PLANS[k]) === 'go');
  });
  it('costs researchers far less than running every study themselves', () => {
    const calls = keys.map(k => support(MUSAFIR_PLANS[k]));
    expect(researcherHours(calls)).toBe(90);
    expect(researcherHours(calls)).toBeLessThan(keys.length * FULL_STUDY_HOURS / 4);
  });
});
