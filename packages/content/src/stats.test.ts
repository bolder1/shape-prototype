import { describe, expect, it } from 'vitest';
import { SRM_ALPHA, lehr, normCdf, normInv, peekingFalsePositive, prng, sampleSize, srmP, twoProp } from './stats';

describe('stats', () => {
  it('knows the normal distribution', () => {
    expect(normCdf(0)).toBeCloseTo(0.5, 7);
    expect(normCdf(1.959964)).toBeCloseTo(0.975, 6);
    expect(normCdf(-1.644854)).toBeCloseTo(0.05, 6);
    expect(normInv(0.975)).toBeCloseTo(1.959964, 5);
    expect(normInv(0.8)).toBeCloseTo(0.841621, 5);
    expect(normInv(0.001)).toBeCloseTo(-3.090232, 5);
    for (const p of [0.0001, 0.01, 0.2, 0.5, 0.77, 0.999]) expect(normCdf(normInv(p))).toBeCloseTo(p, 6);
    expect(() => normInv(1)).toThrow();
  });
  it('sizes a two-proportion test like the textbooks do', () => {
    // 10% → 12% at α = 0.05 two-sided, 80% power: 3,841 a group (Fleiss, no continuity correction).
    expect(sampleSize(0.1, 0.12)).toBe(3841);
    expect(sampleSize(0.08, 0.088)).toBe(18872);
    expect(sampleSize(0.5, 0.6)).toBe(388);
    expect(sampleSize(0.2, 0.2)).toBe(Infinity);
    // Symmetric in direction, and halving the change roughly quadruples the people.
    expect(sampleSize(0.12, 0.1)).toBe(sampleSize(0.1, 0.12));
    const r = sampleSize(0.08, 0.084) / sampleSize(0.08, 0.088);
    expect(r).toBeGreaterThan(3.8); expect(r).toBeLessThan(4.2);
    // Stricter significance or more power both need more people.
    expect(sampleSize(0.08, 0.088, 0.01)).toBeGreaterThan(18872);
    expect(sampleSize(0.08, 0.088, 0.05, 0.9)).toBeGreaterThan(18872);
    // Lehr's rule lands within 5% of the formula for small changes.
    for (const [p, d] of [[0.08, 0.008], [0.03, 0.003], [0.2, 0.02], [0.065, 0.0065]]) expect(Math.abs(lehr(p, d) / sampleSize(p, p + d) - 1)).toBeLessThan(0.05);
  });
  it('runs the two-proportion z-test with a confidence interval', () => {
    const t = twoProp({ n: 18950, x: 1516 }, { n: 18910, x: 1665 });
    expect(t.pa).toBeCloseTo(0.08, 4);
    expect(t.diff).toBeCloseTo(0.008048, 5);
    expect(t.p).toBeCloseTo(0.0048, 3);
    expect(t.ci[0]).toBeGreaterThan(0); expect(t.ci[0]).toBeLessThan(t.diff); expect(t.ci[1]).toBeGreaterThan(t.diff);
    // No difference: z = 0, p = 1, and the interval straddles zero.
    const same = twoProp({ n: 1000, x: 100 }, { n: 1000, x: 100 });
    expect(same.z).toBe(0); expect(same.p).toBeCloseTo(1, 6); expect(same.ci[0]).toBeLessThan(0); expect(same.ci[1]).toBeGreaterThan(0);
    // 99% intervals are wider than 95%.
    const w95 = t.ci[1] - t.ci[0], c99 = twoProp({ n: 18950, x: 1516 }, { n: 18910, x: 1665 }, 0.99).ci;
    expect(c99[1] - c99[0]).toBeGreaterThan(w95);
  });
  it('spots a broken split', () => {
    expect(srmP(10000, 10000)).toBeCloseTo(1, 6);
    expect(srmP(18950, 18910)).toBeGreaterThan(0.5);
    expect(srmP(19900, 19000)).toBeLessThan(SRM_ALPHA);
    expect(srmP(9000, 1000, 0.9)).toBeCloseTo(1, 6);   // a 90/10 split that came out 90/10 is fine
  });
  it('simulates peeking the way Armitage et al. worked it out', () => {
    const r = prng(1), xs = Array.from({ length: 5 }, r);
    expect(xs).toEqual(Array.from({ length: 5 }, prng(1)));   // same seed, same numbers
    for (const x of xs) { expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThan(1); }
    // One look keeps the 5% false-alarm rate; five looks give about 14%, ten about 19%, daily for three weeks about 25%.
    expect(peekingFalsePositive(1)).toBeCloseTo(0.05, 1);
    for (const [looks, rate] of [[1, 0.05], [5, 0.142], [10, 0.193], [21, 0.25]] as const) expect(Math.abs(peekingFalsePositive(looks) - rate)).toBeLessThan(0.012);
  });
});
