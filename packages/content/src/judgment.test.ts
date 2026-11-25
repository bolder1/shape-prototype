import { describe, expect, it } from 'vitest';
import {
  CHANGE_AT, DISPUTE_IDS, HAAT_BREAKS, HAAT_DECISIONS, HAAT_PRINCIPLES, HAAT_RULES, MATRIX_CALLS, PRINCIPLE_RANK, PRINCIPLE_VERDICTS, RULE_CALLS,
  clearsMusts, disputeState, lensWinners, matrixCall, principleVerdict, ruleCall, rulebook, sidesFor, weighted, winner, withCell,
  type HaatBreak, type HaatDecision, type HaatPrinciple, type TradeDecision,
} from './judgment';

describe('Trade-off matrices', () => {
  const keys = Object.keys(HAAT_DECISIONS) as HaatDecision[];
  it('weighs, filters on must-haves and picks a winner', () => {
    expect(weighted([4, 2, 5], [3, 1, 1])).toBe(19);
    const d: TradeDecision = { text: '', criteria: [{ label: 'x', must: 3 }, { label: 'y' }], options: [{ label: 'a', scores: [2, 5] }, { label: 'b', scores: [3, 1] }], lenses: [{ who: 'p', weights: [1, 1] }] };
    expect(clearsMusts(d, [2, 5])).toBe(false);
    expect(winner(d, [1, 1])).toBe(1);   // a scores higher but fails the must-have
    expect(winner({ ...d, options: [d.options[0]] }, [1, 1])).toBeNull();
  });
  it('reads each of Haat’s decisions as the kind of call it is', () => {
    expect(Object.fromEntries(keys.map(k => [k, matrixCall(HAAT_DECISIONS[k])]))).toEqual({
      fee: 'clear', reorder: 'clear', paylater: 'weights', substitute: 'weights', search: 'evidence', tenmin: 'evidence', cod: 'reframe', bulkprice: 'reframe',
    });
    for (const c of MATRIX_CALLS) expect(keys.filter(k => matrixCall(HAAT_DECISIONS[k]) === c)).toHaveLength(2);
  });
  it('has well-formed matrices with no ties to hide behind', () => {
    for (const k of keys) {
      const d = HAAT_DECISIONS[k];
      expect(d.lenses.length).toBeGreaterThanOrEqual(2);
      for (const o of d.options) { expect(o.scores).toHaveLength(d.criteria.length); for (const s of o.scores) { expect(s).toBeGreaterThanOrEqual(1); expect(s).toBeLessThanOrEqual(5); } }
      for (const l of d.lenses) {
        expect(l.weights).toHaveLength(d.criteria.length);
        const totals = d.options.filter(o => clearsMusts(d, o.scores)).map(o => weighted(o.scores, l.weights));
        expect(new Set(totals).size).toBe(totals.length);
      }
    }
  });
  it('finds the guesses that flip the answer, and the ones that don’t', () => {
    const s = HAAT_DECISIONS.search, t = HAAT_DECISIONS.tenmin;
    expect(lensWinners(s)).toEqual([0, 0]);
    expect(lensWinners(withCell(s, 2))).toEqual([1, 1]);
    expect(lensWinners(withCell(t, 1))).toEqual([1, 1]);   // below the must-have, the promise is out
    expect(lensWinners(withCell(t, 4))).toEqual([0, 0]);
    // The weights cards don't need evidence to be hard: the people in the room already disagree.
    expect(new Set(lensWinners(HAAT_DECISIONS.paylater)).size).toBe(2);
    // A clear call isn't always a dominant option: “Order again” loses on ad revenue and still wins every lens.
    expect(HAAT_DECISIONS.reorder.options[0].scores[1]).toBeLessThan(HAAT_DECISIONS.reorder.options[1].scores[1]);
    expect(lensWinners(HAAT_DECISIONS.reorder)).toEqual([0, 0, 0]);
  });
});

describe('Principles that decide', () => {
  const keys = Object.keys(HAAT_PRINCIPLES) as HaatPrinciple[];
  const all = keys.map(k => HAAT_PRINCIPLES[k]);
  it('finds platitudes, vague sides and principles that decide', () => {
    expect(Object.fromEntries(keys.map(k => [k, principleVerdict(HAAT_PRINCIPLES[k])]))).toEqual({
      simple: 'platitude', customer: 'platitude', modern: 'platitude', bold: 'vague', sellers: 'vague', ship: 'vague',
      till: 'decides', basket: 'decides', speed: 'decides', answer: 'decides', fair: 'decides',
    });
    for (const v of PRINCIPLE_VERDICTS) expect(keys.some(k => principleVerdict(HAAT_PRINCIPLES[k]) === v)).toBe(true);
    for (const k of keys) if (principleVerdict(HAAT_PRINCIPLES[k]) === 'decides') expect(HAAT_PRINCIPLES[k].text).toMatch(/even (when|if|for)/);   // each names its cost
  });
  it('settles every dispute once the good ones are in, and shows the one that needs a ranking', () => {
    expect(disputeState([])).toEqual({ settled: [], torn: [] });
    expect(disputeState(all)).toEqual({ settled: ['fee', 'ads', 'bulk'], torn: ['substitute'] });
    expect(sidesFor(all, 'substitute')).toEqual(['a', 'b']);
    expect(disputeState(all.filter((_, i) => keys[i] !== 'speed')).settled).toEqual([...DISPUTE_IDS]);
    expect(PRINCIPLE_RANK).toEqual(['basket', 'speed']);
    for (const p of PRINCIPLE_RANK) expect(HAAT_PRINCIPLES[p].settles.substitute).toBeDefined();
  });
});

describe('When to break the rules', () => {
  const keys = Object.keys(HAAT_BREAKS) as HaatBreak[];
  it('holds floors and taste, tests hunches, logs exceptions and changes rules that keep breaking', () => {
    expect(Object.fromEntries(keys.map(k => [k, ruleCall(HAAT_BREAKS[k])]))).toEqual({
      diwali: 'hold', pregst: 'hold', oneTap: 'hold', caps: 'hold', amount: 'test', swipe: 'test', track: 'exception', packing: 'exception', focus: 'change', tamil: 'change',
    });
    expect(ruleCall({ ...HAAT_BREAKS.track, places: CHANGE_AT })).toBe('change');
    expect(ruleCall({ ...HAAT_BREAKS.oneTap, protects: 'consistency' })).toBe('exception');   // only the floor stops it
    expect(new Set(keys.map(k => HAAT_BREAKS[k].rule)).size).toBe(keys.length);
    for (const k of keys) expect(HAAT_RULES[HAAT_BREAKS[k].rule]).toBeTruthy();
  });
  it('tallies the rulebook', () => {
    expect(rulebook(keys.map(k => ruleCall(HAAT_BREAKS[k])))).toEqual({ hold: 4, test: 2, exception: 2, change: 2 });
    expect(rulebook([])).toEqual(Object.fromEntries(RULE_CALLS.map(c => [c, 0])));
  });
});
