import { describe, expect, it } from 'vitest';
import {
  BUNKAR_CASES, BUNKAR_DETAILS, BUNKAR_SURFACES, CRAFT_CHECKS, DARK_LIGHTNESS, ELEVATIONS, OPTICAL_FIXES, SHADOWS,
  centroidShift, changeList, craftCheck, craftFix, elevationOf, equalAreaDiameter, innerRadius, oneLight, opticalFix, shadowCss,
  type BunkarCase, type BunkarDetail, type BunkarSurface,
} from './polish';

describe('Optical alignment', () => {
  const keys = Object.keys(BUNKAR_CASES) as BunkarCase[];
  it('gives every case the fix it needs', () => {
    expect(Object.fromEntries(keys.map(k => [k, opticalFix(BUNKAR_CASES[k])]))).toEqual({
      play: 'nudge', caps: 'nudge', swatch: 'exact', avatar: 'overshoot', star: 'overshoot', wordmark: 'overshoot',
      quote: 'hang', bullets: 'hang', back: 'hang', prices: 'exact',
    });
    for (const f of OPTICAL_FIXES) expect(keys.some(k => opticalFix(BUNKAR_CASES[k]) === f)).toBe(true);
  });
  it('keeps data exact even where an edge would hang', () => {
    expect(opticalFix({ text: 'x', against: 'edge', mass: 'offset', edge: 'light', data: true })).toBe('exact');
    expect(opticalFix({ text: 'x', against: 'line', mass: 'centred', edge: 'flat' })).toBe('exact');
  });
  it('measures the nudge and the overshoot', () => {
    expect(centroidShift(18)).toBe(3);
    expect(equalAreaDiameter(18)).toBeCloseTo(20.31, 2);
    expect(Math.PI * (equalAreaDiameter(48) / 2) ** 2).toBeCloseTo(48 * 48, 6);
  });
});

describe('Elevation', () => {
  const keys = Object.keys(BUNKAR_SURFACES) as BunkarSurface[];
  it('puts every surface at the height its job gives it', () => {
    expect(Object.fromEntries(keys.map(k => [k, elevationOf(BUNKAR_SURFACES[k])]))).toEqual({
      page: 'flat', care: 'flat', pincode: 'flat', card: 'low', weaver: 'low',
      bagBar: 'raised', menu: 'raised', toast: 'raised', drag: 'raised', sheet: 'overlay', dialog: 'overlay',
    });
    for (const e of ELEVATIONS) expect(keys.some(k => elevationOf(BUNKAR_SURFACES[k]) === e)).toBe(true);
  });
  it('grows shadows with height, all from one light above', () => {
    const last = ELEVATIONS.map(e => SHADOWS[e].at(-1));
    expect(SHADOWS.flat).toEqual([]);
    for (let i = 2; i < ELEVATIONS.length; i++) { expect(last[i]!.y).toBeGreaterThan(last[i - 1]!.y); expect(last[i]!.blur).toBeGreaterThan(last[i - 1]!.blur); }
    for (const e of ELEVATIONS) for (const l of SHADOWS[e]) { expect(l.y).toBeGreaterThan(0); expect(l.blur).toBeGreaterThanOrEqual(l.y * 2); }
    expect(shadowCss('flat')).toBe('none');
    expect(shadowCss('low')).toBe('0 1px 2px rgb(0 0 0 / 0.12), 0 2px 6px rgb(0 0 0 / 0.06)');
  });
  it('lightens dark surfaces as they rise, and spots a second light', () => {
    const l = ELEVATIONS.map(e => DARK_LIGHTNESS[e]);
    expect(l).toEqual([...l].sort((a, b) => a - b));
    expect(new Set(l).size).toBe(ELEVATIONS.length);
    expect(oneLight([{ x: 0, y: 2 }, { x: 0, y: 8 }])).toBe(true);
    expect(oneLight([{ x: 0, y: 2 }, { x: -4, y: 4 }, { x: 3, y: -2 }])).toBe(false);
  });
});

describe('Detail pass', () => {
  const keys = Object.keys(BUNKAR_DETAILS) as BunkarDetail[];
  it('sends every detail to the checklist it fails, or ships it', () => {
    expect(Object.fromEntries(keys.map(k => [k, craftCheck(BUNKAR_DETAILS[k])]))).toEqual({
      review: 'type', price: 'type', summary: 'type', heading: 'type', photo: 'shape', tabs: 'shape',
      focus: 'state', coop: 'state', wishlist: 'state', sheet: 'ship', delivery: 'ship', dates: 'ship',
    });
    for (const c of CRAFT_CHECKS) expect(keys.some(k => craftCheck(BUNKAR_DETAILS[k]) === c)).toBe(true);
  });
  it('nests radii by subtracting the padding', () => {
    expect(innerRadius(16, 8)).toBe(8);
    expect(innerRadius(8, 12)).toBe(0);
    expect(craftFix({ kind: 'radius', outer: 16, padding: 8, inner: 16 })).toBe('Inner radius 16 px → 8 px (outer 16 minus 8 padding)');
    expect(craftFix({ kind: 'radius', outer: 20, padding: 12, inner: 8 })).toBeNull();
  });
  it('reads quotes and dashes from the text itself', () => {
    expect(craftCheck({ kind: 'quotes', sample: '“Woven in nine days”' })).toBe('ship');
    expect(craftCheck({ kind: 'quotes', sample: 'Kavya\'s pick' })).toBe('type');
    expect(craftCheck({ kind: 'range', sample: '₹2,400–₹3,100' })).toBe('ship');
    expect(craftCheck({ kind: 'range', sample: '4-6 days' })).toBe('type');
    expect(craftCheck({ kind: 'range', sample: 'Co-op' })).toBe('ship');
  });
  it('handles long content only when someone planned for it', () => {
    expect(craftCheck({ kind: 'overflow', chars: 50, fits: 28, handled: true })).toBe('ship');
    expect(craftCheck({ kind: 'overflow', chars: 20, fits: 28, handled: false })).toBe('ship');
  });
  it('writes one change per fix, in order', () => {
    const list = changeList(keys.map(k => BUNKAR_DETAILS[k]));
    expect(list).toHaveLength(9);
    expect(list[0]).toMatch(/curly/);
    expect(list.at(-1)).toMatch(/empty state/);
  });
});
