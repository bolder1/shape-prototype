import { describe, expect, it } from 'vitest';
import {
  ANIM_FIXES, CHAKKI_CHANGES, CHAKKI_DATA, CHAKKI_MOTIONS, DATA_HOMES, FRAME_MS, REVIEW_CALLS,
  animFix, componentCode, dataHome, renderWork, reviewCall, reviewedPr, rulesFile, worstWork,
  type AgentChange, type AnimSpec, type CardDatum, type ChakkiChange, type ChakkiDatum, type ChakkiMotion,
} from './designeng';

describe('where a product card’s data lives', () => {
  const keys = Object.keys(CHAKKI_DATA) as ChakkiDatum[];
  it('derives what it can, takes what the parent decides, and lifts what is shared', () => {
    const base: CardDatum = { text: 'x', short: 'x', line: 'x', from: 'use' };
    expect(dataHome(base)).toBe('state');
    expect(dataHome({ ...base, shared: true })).toBe('lift');
    expect(dataHome({ ...base, from: 'parent' })).toBe('prop');
    expect(dataHome({ ...base, from: 'parent', shared: true })).toBe('prop');   // the parent already owns it
    expect(dataHome({ ...base, computable: true, shared: true })).toBe('derive');   // never store what you can compute
  });
  it('places every piece of data, three to a home', () => {
    expect(Object.fromEntries(keys.map(k => [k, dataHome(CHAKKI_DATA[k])]))).toEqual({
      product: 'prop', size: 'prop', slot: 'prop',
      quantity: 'lift', saved: 'lift', grind: 'lift',
      open: 'state', loaded: 'state', added: 'state',
      total: 'derive', soldOut: 'derive', discount: 'derive',
    });
    for (const h of DATA_HOMES) expect(keys.filter(k => dataHome(CHAKKI_DATA[k]) === h)).toHaveLength(3);
  });
  it('writes the component from the decisions: props and lifted values in, state and derived values inside, shared state in the parent', () => {
    expect(componentCode([])).toEqual({ props: [], state: [], derived: [], parent: [] });
    const code = componentCode(keys);
    expect(code.props).toHaveLength(6);
    expect(code.props).toContain('quantity: number; onQuantityChange: (n: number) => void;');
    expect(code.state.every(l => l.includes('useState'))).toBe(true);
    expect(code.derived.some(l => l.includes('useState'))).toBe(false);
    expect(code.parent).toHaveLength(3);
    for (const k of keys) if (dataHome(CHAKKI_DATA[k]) === 'lift') expect(CHAKKI_DATA[k].parent).toContain('useState');
    else expect('parent' in CHAKKI_DATA[k]).toBe(false);
    expect(componentCode(['total', 'product']).props).toEqual(['product: Product;']);
  });
});

describe('animation in code', () => {
  const keys = Object.keys(CHAKKI_MOTIONS) as ChakkiMotion[];
  it('knows what each property costs a frame', () => {
    expect(FRAME_MS).toBeCloseTo(16.67, 2);
    expect(renderWork('transform')).toBe('composite'); expect(renderWork('opacity')).toBe('composite');
    expect(renderWork('top')).toBe('layout'); expect(renderWork('width')).toBe('layout'); expect(renderWork('height')).toBe('layout');
    expect(renderWork('background-color')).toBe('paint'); expect(renderWork('box-shadow')).toBe('paint');
    expect(worstWork(['transform', 'background-color'])).toBe('paint');
    expect(worstWork(['opacity', 'left'])).toBe('layout');
    expect(worstWork([])).toBe('composite');
  });
  it('checks geometry first, then exits, then interruption', () => {
    const base: AnimSpec = { text: 'x', short: 'x', code: 'x', fixed: 'x', props: ['transform'] };
    expect(animFix(base)).toBe('ship');
    expect(animFix({ ...base, props: ['height'], exits: true, retriggers: true })).toBe('transform');
    expect(animFix({ ...base, exits: true, retriggers: true })).toBe('exit');
    expect(animFix({ ...base, exits: true, staysMounted: true })).toBe('ship');
    expect(animFix({ ...base, retriggers: true })).toBe('interrupt');
    expect(animFix({ ...base, retriggers: true, fromCurrent: true })).toBe('ship');
    expect(animFix({ ...base, props: ['background-color'] })).toBe('ship');   // a repaint is allowed
  });
  it('sorts every animation in the app, three to a fix', () => {
    expect(Object.fromEntries(keys.map(k => [k, animFix(CHAKKI_MOTIONS[k])]))).toEqual({
      press: 'ship', spinner: 'ship', photo: 'ship',
      sheet: 'transform', tabs: 'transform', sort: 'transform',
      toast: 'exit', row: 'exit', slotSheet: 'exit',
      drag: 'interrupt', panel: 'interrupt', stepper: 'interrupt',
    });
    for (const f of ANIM_FIXES) expect(keys.filter(k => animFix(CHAKKI_MOTIONS[k]) === f)).toHaveLength(3);
    for (const k of keys) expect(CHAKKI_MOTIONS[k].fixed).not.toBe(CHAKKI_MOTIONS[k].code);
  });
});

describe('reviewing a coding agent’s pull request', () => {
  const keys = Object.keys(CHAKKI_CHANGES) as ChakkiChange[];
  it('reverts what wasn’t asked for or weakens the checks, before anything else', () => {
    const base: AgentChange = { text: 'x', short: 'x', file: 'x', asked: true, proof: 'test' };
    expect(reviewCall(base)).toBe('keep');
    expect(reviewCall({ ...base, proof: 'types' })).toBe('keep');
    expect(reviewCall({ ...base, proof: 'person' })).toBe('verify');
    expect(reviewCall({ ...base, breaks: 'rule', proof: 'person' })).toBe('rules');
    expect(reviewCall({ ...base, breaks: 'rule', weakens: true })).toBe('revert');
    expect(reviewCall({ ...base, asked: false, breaks: 'rule' })).toBe('revert');
  });
  it('calls every change, three to a lane', () => {
    expect(Object.fromEntries(keys.map(k => [k, reviewCall(CHAKKI_CHANGES[k])]))).toEqual({
      picker: 'keep', cutoff: 'keep', types: 'keep',
      hex: 'rules', moment: 'rules', sheet: 'rules',
      deleted: 'revert', rename: 'revert', lint: 'revert',
      feel: 'verify', talkback: 'verify', gujarati: 'verify',
    });
    for (const r of REVIEW_CALLS) expect(reviewedPr(keys)[r]).toHaveLength(3);
  });
  it('writes each broken convention into the rules file once', () => {
    expect(rulesFile([])).toEqual([]);
    expect(rulesFile(['picker', 'deleted', 'feel'])).toEqual([]);
    const rules = rulesFile([...keys, 'hex']);
    expect(rules).toHaveLength(3);
    expect(rules[0]).toMatch(/tokens/);
    for (const k of keys) if (reviewCall(CHAKKI_CHANGES[k]) !== 'rules') expect(CHAKKI_CHANGES[k].weakens && CHAKKI_CHANGES[k].breaks).toBeFalsy();
  });
});
