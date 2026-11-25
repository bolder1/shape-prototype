import { describe, expect, it } from 'vitest';
import {
  BRAND_CALLS, BRAND_IDS, BRAND_MODES, BRAND_THEMES, PARITY_CALLS, PARITY_PLATFORMS, SAWARI_DECISIONS, SAWARI_DRIFTS,
  SAWARI_OVERRIDES, SAWARI_RAMPS, SAWARI_REQUESTS, SYNC_MOVES, SYSTEM_TOKENS, brandCall, driftSide, parityCall,
  passingSteps, sawariHex, sawariSteps, syncMove, themeChecks, tuneCheck,
  type BrandRequest, type DriftReport, type PlatformDecision, type SawariDecision, type SawariDrift, type SawariRequest,
} from './multibrand';

describe('Multi-brand theming', () => {
  const keys = Object.keys(SAWARI_REQUESTS) as SawariRequest[];
  it('passes every check in all four themes', () => {
    for (const b of BRAND_IDS) for (const m of BRAND_MODES) {
      const checks = themeChecks(BRAND_THEMES[b][m]);
      expect(checks).toHaveLength(3);
      for (const c of checks) expect(c.pass, `${b} ${m} ${c.pair}`).toBe(true);
    }
    // Sawari's light theme on Rasta's dark values would fail: modes are per brand, not shared.
    expect(themeChecks({ ...BRAND_THEMES.sawari.dark, actionPrimary: BRAND_THEMES.sawari.light.actionPrimary }).some(c => !c.pass)).toBe(true);
    expect(SAWARI_OVERRIDES / SYSTEM_TOKENS).toBeLessThan(0.1);
  });
  it('routes every one of Meera’s requests', () => {
    expect(Object.fromEntries(keys.map(k => [k, brandCall(SAWARI_REQUESTS[k])]))).toEqual({
      serif: 'theme', radius: 'theme', cardEdge: 'theme', motion: 'theme', iconStroke: 'theme',
      goldLabel: 'tune', plumLink: 'tune', darkLink: 'tune',
      errorGold: 'shared', slimButton: 'shared', focusRing: 'shared',
    });
    for (const c of BRAND_CALLS) expect(keys.filter(k => brandCall(SAWARI_REQUESTS[k]) === c).length).toBeGreaterThanOrEqual(3);
  });
  it('tunes each failing colour to the nearest step that passes', () => {
    const near = Object.fromEntries(keys.filter(k => SAWARI_REQUESTS[k].tune).map(k => [k, passingSteps(SAWARI_REQUESTS[k].tune!)[0]]));
    expect(near).toEqual({ goldLabel: 800, plumLink: 500, darkLink: 400 });
    for (const k of keys) {
      const t = SAWARI_REQUESTS[k].tune;
      if (!t) continue;
      expect(sawariSteps(t.ramp)).toContain(t.asked);
      expect(tuneCheck(t, t.asked).pass).toBe(false);
      for (const s of passingSteps(t)) expect(tuneCheck(t, s).ratio).toBeGreaterThanOrEqual(t.min);
    }
    // Plum-700 on gold is a near miss, which is the point: it looks fine and fails.
    expect(tuneCheck(SAWARI_REQUESTS.goldLabel.tune!, 700).ratio).toBeGreaterThan(4);
    const r: BrandRequest = { text: 'x', token: 'x', shared: false, tune: { ramp: 'plum', asked: 800, against: '#FFFFFF', min: 4.5, role: 'x' } };
    expect(brandCall(r)).toBe('theme');
    expect(brandCall({ ...r, shared: true })).toBe('shared');
    expect(sawariHex('gold', 400)).toBe(SAWARI_RAMPS.gold[400]);
  });
});

describe('Platform parity', () => {
  const keys = Object.keys(SAWARI_DECISIONS) as SawariDecision[];
  it('calls every decision in the booking flow', () => {
    expect(Object.fromEntries(keys.map(k => [k, parityCall(SAWARI_DECISIONS[k])]))).toEqual({
      fare: 'same', steps: 'same', upiError: 'same', plum: 'same',
      bodySize: 'adapt', target: 'adapt', elevation: 'adapt',
      back: 'native', share: 'native', toggle: 'native', time: 'native',
    });
    for (const c of PARITY_CALLS) expect(keys.filter(k => parityCall(SAWARI_DECISIONS[k]) === c).length).toBeGreaterThanOrEqual(3);
  });
  it('shows the same thing on every platform exactly when the call is same', () => {
    for (const k of keys) {
      const d = SAWARI_DECISIONS[k];
      const shown = new Set(PARITY_PLATFORMS.map(p => d.show[p]));
      expect(shown.size === 1, k).toBe(parityCall(d) === 'same');
    }
  });
  it('puts meaning before convention', () => {
    const d: PlatformDecision = { text: 'x', meaning: true, convention: true, mechanism: true, show: { ios: 'a', android: 'a', web: 'a' } };
    expect(parityCall(d)).toBe('same');
    expect(parityCall({ ...d, meaning: false })).toBe('native');
    expect(parityCall({ ...d, meaning: false, convention: false })).toBe('adapt');
    expect(parityCall({ ...d, meaning: false, convention: false, mechanism: false })).toBe('same');
  });
});

describe('Design-code sync', () => {
  const keys = Object.keys(SAWARI_DRIFTS) as SawariDrift[];
  it('moves every drift the right way', () => {
    expect(Object.fromEntries(keys.map(k => [k, syncMove(SAWARI_DRIFTS[k])]))).toEqual({
      ghost: 'to-code', focus: 'to-code', serifIos: 'to-code',
      slot: 'to-figma', rename: 'to-figma', plumValue: 'to-figma',
      handRadius: 'revert', brandVariant: 'revert', brandProp: 'revert', goldBright: 'revert', iconSize: 'revert',
    });
    for (const m of SYNC_MOVES) expect(keys.filter(k => syncMove(SAWARI_DRIFTS[k]) === m).length).toBeGreaterThanOrEqual(3);
    // A drift is a difference: exactly one side has the change.
    for (const k of keys) expect(SAWARI_DRIFTS[k].figma !== SAWARI_DRIFTS[k].code, k).toBe(true);
  });
  it('acts on the side that’s behind, or the side that went around its source', () => {
    const d: DriftReport = { text: 'x', figma: true, code: false, source: true, kind: 'design' };
    expect([syncMove(d), driftSide(d)]).toEqual(['to-code', 'code']);
    expect([syncMove({ ...d, figma: false, code: true }), driftSide({ ...d, figma: false, code: true })]).toEqual(['to-figma', 'figma']);
    expect([syncMove({ ...d, source: false }), driftSide({ ...d, source: false })]).toEqual(['revert', 'figma']);
    expect(driftSide({ ...d, figma: false, code: true, source: false })).toBe('code');
  });
});
