import { describe, expect, it } from 'vitest';
import {
  AGENDA, ALWAYS_HEARD, CEREMONIES, CEREMONY_DAY, FRIDAY, RASOI_ITEMS, RASOI_MOMENTS, RASOI_QUESTIONS, ROOM, SPRINT_CALLS, SPRINT_DAYS,
  WORKSHOP_MINUTES, agendaMinutes, blockedDays, ceremonyFor, daysSpent, fridayVerdict, moveFor, raisedOn, sprintCall, teamDays, waitDays,
  workshopResult, type RasoiItem, type RasoiMoment, type RasoiQuestion,
} from './team';

describe('Design process in agile teams', () => {
  const keys = Object.keys(RASOI_ITEMS) as RasoiItem[];
  it('sends blockers to stand-up, upcoming stories to refinement, working software to review, and process to the retro', () => {
    expect(Object.fromEntries(keys.map(k => [k, ceremonyFor(RASOI_ITEMS[k])]))).toEqual({
      cutoff: 'standup', refund: 'standup', smallphone: 'standup', banner: 'standup',
      swap: 'refinement', oneday: 'refinement', diwali: 'refinement',
      staging: 'review', wallet: 'review', kannada: 'review', dayone: 'retro', qalate: 'retro',
    });
    for (const c of CEREMONIES) expect(keys.some(k => ceremonyFor(RASOI_ITEMS[k]) === c)).toBe(true);
    for (const k of keys) { expect(RASOI_ITEMS[k].day).toBeGreaterThanOrEqual(1); expect(RASOI_ITEMS[k].day).toBeLessThanOrEqual(SPRINT_DAYS); }
  });
  it('raises things at the next meeting of their kind, this sprint or the next', () => {
    expect(raisedOn(2, 'standup')).toBe(3);
    expect(raisedOn(3, 'refinement')).toBe(CEREMONY_DAY.refinement);
    expect(raisedOn(8, 'refinement')).toBe(CEREMONY_DAY.refinement + SPRINT_DAYS);
    expect(raisedOn(9, 'review')).toBe(10);
    expect(waitDays(RASOI_ITEMS.diwali)).toBe(8);   // not urgent, so waiting is fine
    expect(waitDays(RASOI_ITEMS.cutoff, 'retro')).toBe(8);
  });
  it('keeps blockers waiting a day each at stand-up, and far longer if they wait for the retro', () => {
    const items = keys.map(k => RASOI_ITEMS[k]);
    expect(blockedDays(items)).toBe(4);
    expect(blockedDays(items, () => 'retro')).toBe(18);
    expect(blockedDays(items, () => 'review')).toBe(18);
  });
});

describe('Facilitating workshops', () => {
  const keys = Object.keys(RASOI_MOMENTS) as RasoiMoment[];
  it('writes alone against anchors and echoes, goes round when voices are missing, parks tangents, timeboxes loops', () => {
    expect(Object.fromEntries(keys.map(k => [k, moveFor(RASOI_MOMENTS[k])]))).toEqual({
      price: 'silent', muted: 'round', chef: 'round', gateway: 'park', arjun: 'round',
      discount: 'silent', dots: 'silent', pauseskip: 'timebox', bug: 'park', late: 'timebox',
    });
    const minutes = keys.map(k => RASOI_MOMENTS[k].minute);
    expect(minutes).toEqual([...minutes].sort((a, b) => a - b));
    for (const m of minutes) expect(m).toBeLessThan(WORKSHOP_MINUTES);
  });
  it('hears everyone when every first call is right, and loses time and voices when it isn’t', () => {
    const all = workshopResult(Object.fromEntries(keys.map(k => [k, true])));
    expect(all).toEqual({ heard: [...ROOM], over: 0 });
    const none = workshopResult(Object.fromEntries(keys.map(k => [k, false])));
    expect(none.heard).toEqual([...ALWAYS_HEARD]);
    expect(none.over).toBe(48);
    expect(workshopResult({})).toEqual({ heard: [...ALWAYS_HEARD], over: 0 });
    expect(workshopResult({ chef: true, pauseskip: false })).toEqual({ heard: ['Vikram', 'Arjun', 'Ashok'], over: 15 });
    for (const k of keys) expect(RASOI_MOMENTS[k].voices.length > 0 || RASOI_MOMENTS[k].cost > 0).toBe(true);   // every miss costs something
  });
  it('plans an agenda that fits the 90 minutes exactly', () => {
    expect(agendaMinutes(AGENDA)).toBe(WORKSHOP_MINUTES);
  });
});

describe('Design sprints', () => {
  const keys = Object.keys(RASOI_QUESTIONS) as RasoiQuestion[];
  it('researches what isn’t understood, builds what’s cheap to undo, sprints on big open bets and tests the rest', () => {
    expect(Object.fromEntries(keys.map(k => [k, sprintCall(RASOI_QUESTIONS[k])]))).toEqual({
      offices: 'sprint', family: 'sprint', checkout: 'test', onboard: 'test',
      pune: 'research', week2: 'research', kitchen: 'research', label: 'build', typo: 'build', dark: 'build',
    });
    for (const c of SPRINT_CALLS) expect(keys.some(k => sprintCall(RASOI_QUESTIONS[k]) === c)).toBe(true);
  });
  it('costs a sprint at 35 team-days and nothing for just building', () => {
    expect(teamDays('sprint')).toBe(35);
    expect(teamDays('build')).toBe(0);
    expect(daysSpent(keys.map(k => sprintCall(RASOI_QUESTIONS[k])))).toBe(2 * 35 + 2 * 6 + 3 * 16);
    expect(daysSpent(keys.map(() => 'sprint' as const))).toBe(350);
  });
  it('reads Friday’s five interviews as patterns of three', () => {
    expect(FRIDAY.map(f => fridayVerdict(f.results))).toEqual(['yes', 'no', 'unclear']);
    for (const f of FRIDAY) expect(f.results).toHaveLength(5);
    expect(fridayVerdict([true, true, null, null, false])).toBe('unclear');
  });
});
