import { describe, expect, it } from 'vitest';
import {
  BAR_CALLS, DESIGN_LADDER, KAARIGAR_NOTES, KAARIGAR_RITUALS, KAARIGAR_SITUATIONS, KAARIGAR_TEAM, LADDER_LINES, LADDER_SCOPES,
  LEAD_STYLES, RITUAL_CALLS, barCall, hoursLabel, leadStyle, noteLevel, offerLevel, ritualCall, ritualMinutes, stylesByPerson,
  type DebriefNote, type KaarigarNote, type KaarigarPerson, type KaarigarRitual, type KaarigarSituation, type Ritual, type Situation,
} from './leadership';

describe('hiring and leveling', () => {
  const keys = Object.keys(KAARIGAR_NOTES) as KaarigarNote[];
  it('has one scope and one line per rung', () => {
    expect(LADDER_SCOPES).toHaveLength(DESIGN_LADDER.length);
    expect(Object.keys(LADDER_LINES)).toEqual([...DESIGN_LADDER]);
  });
  it('counts only behaviour, at its scope, one rung lower when someone else framed it', () => {
    const base: DebriefNote = { text: 'x', short: 'x', who: 'x', behaviour: true, scope: 'product' };
    expect(noteLevel(base)).toBe('senior');
    expect(noteLevel({ ...base, guided: true })).toBe('designer');
    expect(noteLevel({ ...base, scope: 'task', guided: true })).toBe('associate');   // never below the bottom rung
    expect(noteLevel({ ...base, behaviour: false })).toBeNull();
    expect(barCall({ ...base, behaviour: false, scope: 'org' })).toBe('noise');   // a claim about scope with no behaviour is still noise
    expect(barCall(base)).toBe('at');
    expect(barCall({ ...base, scope: 'org' })).toBe('above');
    expect(barCall(base, 'lead')).toBe('below');
  });
  it('sorts Ritu’s loop three to a lane', () => {
    expect(Object.fromEntries(keys.map(k => [k, barCall(KAARIGAR_NOTES[k])]))).toEqual({
      pedigree: 'noise', fit: 'noise', years: 'noise',
      polish: 'below', framed: 'below', escalate: 'below',
      onboarding: 'at', flow: 'at', brief: 'at',
      critique: 'above', mentor: 'above', principles: 'above',
    });
    for (const c of BAR_CALLS) expect(keys.filter(k => barCall(KAARIGAR_NOTES[k]) === c)).toHaveLength(3);
    for (const k of keys) if (!KAARIGAR_NOTES[k].behaviour) expect('scope' in KAARIGAR_NOTES[k]).toBe(false);
  });
  it('offers at the lower median of the evidence, so one interview can’t decide it', () => {
    expect(offerLevel(keys.map(k => KAARIGAR_NOTES[k]))).toBe('senior');
    expect(offerLevel([])).toBeNull();
    expect(offerLevel([KAARIGAR_NOTES.pedigree, KAARIGAR_NOTES.fit])).toBeNull();
    expect(offerLevel([KAARIGAR_NOTES.principles, KAARIGAR_NOTES.polish])).toBe('designer');
    expect(offerLevel([KAARIGAR_NOTES.principles, KAARIGAR_NOTES.mentor, KAARIGAR_NOTES.polish])).toBe('lead');
    // Dropping the noise changes nothing: it was never evidence.
    expect(offerLevel(keys.filter(k => KAARIGAR_NOTES[k].behaviour).map(k => KAARIGAR_NOTES[k]))).toBe('senior');
  });
});

describe('managing designers', () => {
  const keys = Object.keys(KAARIGAR_SITUATIONS) as KaarigarSituation[];
  it('reads skill for how much to tell, and will for how much to back', () => {
    const base: Situation = { text: 'x', short: 'x', who: 'pooja', skill: 'low', will: 'high', move: 'x' };
    expect(leadStyle(base)).toBe('direct');
    expect(leadStyle({ ...base, will: 'low' })).toBe('coach');
    expect(leadStyle({ ...base, skill: 'high', will: 'low' })).toBe('support');
    expect(leadStyle({ ...base, skill: 'high' })).toBe('delegate');
  });
  it('has three situations for every style', () => {
    for (const s of LEAD_STYLES) expect(keys.filter(k => leadStyle(KAARIGAR_SITUATIONS[k]) === s)).toHaveLength(3);
    for (const k of keys) expect(Object.keys(KAARIGAR_TEAM)).toContain(KAARIGAR_SITUATIONS[k].who);
  });
  it('needs more than one style for every person: style is per task, not per person', () => {
    const by = stylesByPerson(keys);
    for (const p of Object.keys(KAARIGAR_TEAM) as KaarigarPerson[]) expect(by[p].length).toBeGreaterThanOrEqual(2);
    expect(by.aditya).toEqual(['direct', 'coach', 'delegate']);
    expect(stylesByPerson([]).tanmay).toEqual([]);
    expect(stylesByPerson(['dark']).neelam).toEqual(['delegate']);
  });
});

describe('design culture and rituals', () => {
  const keys = Object.keys(KAARIGAR_RITUALS) as KaarigarRitual[];
  it('cuts first, then makes safe, then makes it produce something', () => {
    const base: Ritual = { text: 'x', short: 'x', when: 'x', minutes: 30, purpose: true, output: true, fixed: 'x' };
    expect(ritualCall(base)).toBe('keep');
    expect(ritualCall({ ...base, output: false })).toBe('reshape');
    expect(ritualCall({ ...base, output: false, unsafe: 'x' })).toBe('make-safe');
    expect(ritualCall({ ...base, unsafe: 'x', duplicates: 'x' })).toBe('cut');
    expect(ritualCall({ ...base, purpose: false })).toBe('cut');
  });
  it('sorts the calendar three to a lane', () => {
    for (const c of RITUAL_CALLS) expect(keys.filter(k => ritualCall(KAARIGAR_RITUALS[k]) === c)).toHaveLength(3);
    for (const k of keys) if (ritualCall(KAARIGAR_RITUALS[k]) === 'keep') expect(KAARIGAR_RITUALS[k].after).toBeUndefined();
  });
  it('gives back time: 8 h 30 min a week down to 4 h 45 min', () => {
    expect(ritualMinutes(keys)).toEqual({ before: 510, after: 285 });
    expect(ritualMinutes([])).toEqual({ before: 0, after: 0 });
    expect(ritualMinutes(['standup'])).toEqual({ before: 75, after: 0 });
    expect(ritualMinutes(['ceoFriday'])).toEqual({ before: 60, after: 15 });
    expect(hoursLabel(510)).toBe('8 h 30 min'); expect(hoursLabel(285)).toBe('4 h 45 min');
    expect(hoursLabel(60)).toBe('1 h'); expect(hoursLabel(45)).toBe('45 min');
  });
});
