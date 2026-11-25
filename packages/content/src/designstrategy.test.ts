import { describe, expect, it } from 'vitest';
import {
  ADVANTAGE_CALLS, BET_CALLS, BET_HORIZONS, BET_MIX_GUIDE, COPY_MONTHS, MUNIM_BETS, MUNIM_BUDGET, MUNIM_CAPABILITIES, MUNIM_CLAIMS,
  PLATFORM_CALLS, RULE_OF_THREE, STRATEGY_KERNEL, advantageCall, betCall, betRange, betSpend, betValue, platformCall, portfolioMix,
  type AdvantageClaim, type Capability, type DesignBet, type MunimBet, type MunimCapability, type MunimClaim,
} from './designstrategy';

describe('Munim’s claimed advantages', () => {
  const keys = Object.keys(MUNIM_CLAIMS) as MunimClaim[];
  it('calls every claim', () => {
    expect(Object.fromEntries(keys.map(k => [k, advantageCall(MUNIM_CLAIMS[k])]))).toEqual({
      gstClean: 'holds', caView: 'holds', offline: 'holds',
      invoiceLook: 'copyable', languages: 'copyable', templates: 'copyable',
      animations: 'unvalued', awards: 'unvalued', illustrations: 'unvalued',
      enterprise: 'offstrategy', genz: 'offstrategy', usTax: 'offstrategy',
    });
    for (const c of ADVANTAGE_CALLS) expect(keys.filter(k => advantageCall(MUNIM_CLAIMS[k]) === c).length).toBeGreaterThanOrEqual(2);
  });
  it('says what makes every lasting advantage hard to copy, and has evidence for every claim', () => {
    for (const k of keys) {
      const c = MUNIM_CLAIMS[k] as AdvantageClaim;
      expect(c.evidence.length).toBeGreaterThan(10);
      expect(!!c.source).toBe(advantageCall(c) === 'holds');
    }
  });
  it('judges value, then fit, then how long it lasts', () => {
    const base: AdvantageClaim = { text: 'x', short: 'x', evidence: 'x', valued: true, copyMonths: COPY_MONTHS, fits: true };
    expect(advantageCall(base)).toBe('holds');
    expect(advantageCall({ ...base, copyMonths: COPY_MONTHS - 1 })).toBe('copyable');
    expect(advantageCall({ ...base, fits: false, copyMonths: 1 })).toBe('offstrategy');
    expect(advantageCall({ ...base, valued: false, fits: false })).toBe('unvalued');
  });
  it('has a kernel in Rumelt’s order', () => {
    expect(STRATEGY_KERNEL.map(k => k.part)).toEqual(['Diagnosis', 'Guiding policy', 'Coherent actions']);
  });
});

describe('Munim’s design bets', () => {
  const keys = Object.keys(MUNIM_BETS) as MunimBet[];
  const all = keys.map(k => MUNIM_BETS[k] as DesignBet);
  it('funds, probes or kills every bet by its expected value', () => {
    expect(Object.fromEntries(keys.map(k => [k, betCall(MUNIM_BETS[k])]))).toEqual({
      gstReview: 'fund', system: 'fund', whatsapp: 'fund',
      caInvite: 'probe', scan: 'probe', voice: 'probe', forecast: 'probe',
      darkMode: 'kill', rebrand: 'kill', dash3d: 'kill',
    });
    for (const c of BET_CALLS) expect(keys.filter(k => betCall(MUNIM_BETS[k]) === c).length).toBeGreaterThanOrEqual(3);
  });
  it('computes expected value as chance × payoff − cost', () => {
    expect(betValue(MUNIM_BETS.gstReview, 0.6)).toBe(68);
    expect(betRange(MUNIM_BETS.voice)).toEqual([-40, 60]);
    expect(betRange(MUNIM_BETS.darkMode)).toEqual([-20, -16]);
  });
  it('gives every probe a test that costs far less than the bet, and only probes', () => {
    for (const b of all) {
      expect(b.chance[0]).toBeLessThanOrEqual(b.chance[1]);
      expect(b.chance[0]).toBeGreaterThan(0); expect(b.chance[1]).toBeLessThan(1);
      if (betCall(b) === 'probe') { expect(b.probe).toBeTruthy(); expect(b.probeCost).toBeGreaterThan(0); expect(b.probeCost!).toBeLessThan(b.cost / 4); }
      else expect(b.probe).toBeUndefined();
    }
  });
  it('spends within budget, close to the 70/20/10 guide, with money held back to scale what passes', () => {
    const spent = all.reduce((s, b) => s + betSpend(b), 0);
    expect(spent).toBe(167);
    expect(MUNIM_BUDGET - spent).toBeGreaterThan(100);
    const mix = portfolioMix(all);
    for (const h of BET_HORIZONS) expect(Math.abs(mix[h] - BET_MIX_GUIDE[h])).toBeLessThan(0.05);
    expect(BET_HORIZONS.reduce((s, h) => s + mix[h], 0)).toBeCloseTo(1);
    expect(portfolioMix([])).toEqual({ core: 0, adjacent: 0, new: 0 });
    expect(portfolioMix([MUNIM_BETS.darkMode])).toEqual({ core: 0, adjacent: 0, new: 0 });
  });
});

describe('Munim’s platform calls', () => {
  const keys = Object.keys(MUNIM_CAPABILITIES) as MunimCapability[];
  it('places every capability', () => {
    expect(Object.fromEntries(keys.map(k => [k, platformCall(MUNIM_CAPABILITIES[k])]))).toEqual({
      signIn: 'platform', gstInvoice: 'platform', fields: 'platform',
      payLink: 'harvest', alerts: 'harvest', firstRun: 'harvest',
      barcode: 'product', forecast: 'product', reorder: 'product',
      otp: 'buy', maps: 'buy', helpChat: 'buy',
    });
    for (const c of PLATFORM_CALLS) expect(keys.filter(k => platformCall(MUNIM_CAPABILITIES[k]) === c).length).toBeGreaterThanOrEqual(2);
  });
  it('never calls a differentiator a commodity, and lists each product once', () => {
    for (const k of keys) {
      const c = MUNIM_CAPABILITIES[k] as Capability;
      expect(c.commodity && c.differentiating).toBe(false);
      expect(new Set(c.products).size).toBe(c.products.length);
      expect(c.products.length).toBeGreaterThan(0);
    }
  });
  it('buys commodities first, then applies the rule of three to settled needs', () => {
    const base: Capability = { text: 'x', short: 'x', products: ['books', 'pay', 'stock'], settled: true, commodity: false, differentiating: false };
    expect(RULE_OF_THREE).toBe(3);
    expect(platformCall(base)).toBe('platform');
    expect(platformCall({ ...base, commodity: true })).toBe('buy');
    expect(platformCall({ ...base, commodity: true, differentiating: true })).toBe('platform');
    expect(platformCall({ ...base, settled: false })).toBe('harvest');
    expect(platformCall({ ...base, products: ['books', 'pay'] })).toBe('harvest');
    expect(platformCall({ ...base, products: ['stock'] })).toBe('product');
  });
});
