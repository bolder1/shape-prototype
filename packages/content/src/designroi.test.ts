import { describe, expect, it } from 'vitest';
import {
  BAND_EDGES, CASE_FIXES, ENGAGE_CALLS, IMPACT_BANDS, KOLAM, KOLAM_ENQUIRIES, RAAHI_CASE, RAAHI_IMPACTS, TRIP_COST, TRIP_DRIVERS,
  billableDays, caseFix, caseReturns, driverValue, effectiveRate, engageCall, floorRate, impactBand, impactValue, inrScale,
  scenarioBenefit, targetRate,
  type CaseLine, type Enquiry, type ImpactClaim, type KolamEnquiry, type RaahiCaseLine, type RaahiImpact,
} from './designroi';

describe('money, written for people', () => {
  it('scales to lakh and crore', () => {
    expect(inrScale(10_800_000)).toBe('₹1.08 crore');
    expect(inrScale(13_020_000)).toBe('₹1.3 crore');
    expect(inrScale(10_000_000)).toBe('₹1 crore');
    expect(inrScale(3_420_000)).toBe('₹34.2 lakh');
    expect(inrScale(900_000)).toBe('₹9 lakh');
    expect(inrScale(-3_240_000)).toBe('−₹32.4 lakh');
    expect(inrScale(95_000)).toBe('₹95,000');
  });
});

describe('what Raahi’s design work is worth', () => {
  const keys = Object.keys(RAAHI_IMPACTS) as RaahiImpact[];
  it('values every claim a year, in contribution and cost, not revenue', () => {
    expect(Object.fromEntries(keys.map(k => [k, impactValue(RAAHI_IMPACTS[k])]))).toMatchObject({
      checkout: 10_800_000, rebook: 12_000_000, cancel: 10_260_000,
      refund: 3_420_000, boarding: 4_860_000, console: 3_000_000,
      filters: 720_000, invoice: 855_000, system: 828_000,
    });
  });
  it('bands every claim, three to a band', () => {
    expect(Object.fromEntries(keys.map(k => [k, impactBand(RAAHI_IMPACTS[k])]))).toEqual({
      checkout: 'big', rebook: 'big', cancel: 'big',
      refund: 'mid', boarding: 'mid', console: 'mid',
      filters: 'small', invoice: 'small', system: 'small',
      diwali: 'unproven', rating: 'unproven', survey: 'unproven',
    });
    for (const b of IMPACT_BANDS) expect(keys.filter(k => impactBand(RAAHI_IMPACTS[k]) === b).length).toBe(3);
  });
  it('needs a control and a money link before it counts, and bands at ₹10 lakh and ₹1 crore', () => {
    const base: ImpactClaim = { text: 'x', short: 'x', source: 'x', per: 'x', volume: 1, change: 1, unitValue: BAND_EDGES.mid, realise: 1, controlled: true, money: true };
    expect(impactBand(base)).toBe('mid');
    expect(impactBand({ ...base, unitValue: BAND_EDGES.mid - 1 })).toBe('small');
    expect(impactBand({ ...base, unitValue: BAND_EDGES.big })).toBe('big');
    expect(impactBand({ ...base, unitValue: BAND_EDGES.big, controlled: false })).toBe('unproven');
    expect(impactBand({ ...base, unitValue: BAND_EDGES.big, money: false })).toBe('unproven');
    expect(impactValue({ ...base, realise: 0.5 })).toBe(BAND_EDGES.mid / 2);
  });
  it('would be fifteen times too big at the ticket price', () => {
    const c = RAAHI_IMPACTS.checkout;
    expect(impactValue({ ...c, unitValue: 900 }) / impactValue(c)).toBe(15);
  });
});

describe('Aparna’s business case', () => {
  const keys = Object.keys(RAAHI_CASE) as RaahiCaseLine[];
  it('finds what each line needs, three to a fix', () => {
    expect(Object.fromEntries(keys.map(k => [k, caseFix(RAAHI_CASE[k])]))).toEqual({
      ask: 'keep', calls: 'keep', costs: 'keep',
      sessions: 'money', delight: 'money', nps: 'money',
      refunds: 'range', total: 'range', credit: 'range',
      build: 'cost', eng: 'cost', payback: 'cost',
    });
    for (const f of CASE_FIXES) expect(keys.filter(k => caseFix(RAAHI_CASE[k]) === f).length).toBe(3);
  });
  it('asks for money first, then honesty, and complete costs', () => {
    const b: CaseLine = { text: 'x', short: 'x', fixed: 'y', part: 'benefit', money: true, honest: true };
    expect(caseFix(b)).toBe('keep');
    expect(caseFix({ ...b, honest: false })).toBe('range');
    expect(caseFix({ ...b, money: false, honest: false })).toBe('money');
    expect(caseFix({ text: 'x', short: 'x', fixed: 'y', part: 'cost' })).toBe('cost');
    expect(caseFix({ text: 'x', short: 'x', fixed: 'y', part: 'cost', complete: true })).toBe('keep');
  });
  it('keeps lines that are ready as they are, and rewrites the rest', () => {
    for (const k of keys) {
      const l = RAAHI_CASE[k];
      expect(l.fixed === l.text).toBe(caseFix(l) === 'keep');
    }
  });
  it('adds up the benefit in three cases', () => {
    expect(TRIP_DRIVERS.map(d => driverValue(d, 'base'))).toEqual([5_130_000, 4_050_000, 3_840_000]);
    expect(scenarioBenefit(TRIP_DRIVERS, 'low')).toBe(6_960_000);
    expect(scenarioBenefit(TRIP_DRIVERS, 'base')).toBe(13_020_000);
    expect(scenarioBenefit(TRIP_DRIVERS, 'high')).toBe(17_460_000);
    for (const d of TRIP_DRIVERS) expect(d.change[0] < d.change[1] && d.change[1] < d.change[2]).toBe(true);
  });
  it('works out first-year ROI and payback, counting build and running', () => {
    expect(caseReturns(scenarioBenefit(TRIP_DRIVERS, 'base'), TRIP_COST)).toEqual({ cost: 10_200_000, net: 2_820_000, roi: 28, payback: 9.1 });
    expect(caseReturns(scenarioBenefit(TRIP_DRIVERS, 'low'), TRIP_COST)).toEqual({ cost: 10_200_000, net: -3_240_000, roi: -32, payback: 18.8 });
    expect(caseReturns(scenarioBenefit(TRIP_DRIVERS, 'high'), TRIP_COST)).toEqual({ cost: 10_200_000, net: 7_260_000, roi: 71, payback: 6.6 });
    expect(caseReturns(1_000_000, { build: 100, runYear: 1_000_000 }).payback).toBeNull();
  });
  it('puts the computed numbers into the rewritten lines', () => {
    expect(RAAHI_CASE.total.fixed).toContain('₹69.6 lakh to ₹1.75 crore');
    expect(RAAHI_CASE.payback.fixed).toContain('9.1 months');
    expect(RAAHI_CASE.payback.fixed).toContain('18.8 months');
    expect(RAAHI_CASE.calls.text).toContain('₹34.2 lakh to ₹68.4 lakh');
    expect(RAAHI_CASE.credit.fixed).toContain(inrScale(impactValue(RAAHI_IMPACTS.checkout)));
  });
});

describe('Kolam’s rates and enquiries', () => {
  const keys = Object.keys(KOLAM_ENQUIRIES) as KolamEnquiry[];
  it('prices a day from what the studio costs', () => {
    expect(billableDays(KOLAM)).toBe(528);
    expect(floorRate(KOLAM)).toBe(13_600);
    expect(targetRate(KOLAM)).toBe(17_000);
    expect(floorRate({ ...KOLAM, utilisation: 0.8 })).toBeLessThan(floorRate(KOLAM));
  });
  it('takes every enquiry the right way, three to a call', () => {
    expect(Object.fromEntries(keys.map(k => [k, engageCall(KOLAM_ENQUIRIES[k])]))).toEqual({
      audit: 'fixed', seats: 'fixed', clinic: 'fixed',
      lender: 'retainer', hospital: 'retainer', ngo: 'retainer',
      tailors: 'time', claims: 'time', rescue: 'time',
      pitch: 'decline', cafe: 'decline', equity: 'decline',
    });
    for (const c of ENGAGE_CALLS) expect(keys.filter(k => engageCall(KOLAM_ENQUIRIES[k]) === c).length).toBe(3);
  });
  it('turns down spec work and the below-floor, then splits by stream and scope', () => {
    const e: Enquiry = { text: 'x', short: 'x', client: 'x', fee: 20_000, days: 1, ongoing: false, clear: true, spec: false };
    expect(engageCall(e)).toBe('fixed');
    expect(engageCall({ ...e, clear: false })).toBe('time');
    expect(engageCall({ ...e, ongoing: true, clear: false })).toBe('retainer');
    expect(engageCall({ ...e, spec: true })).toBe('decline');
    expect(engageCall({ ...e, fee: floorRate(KOLAM) - 1 })).toBe('decline');
    expect(engageCall({ ...e, fee: floorRate(KOLAM) })).toBe('fixed');
    expect(effectiveRate({ ...e, days: 0 })).toBe(0);
  });
  it('shows scope creep pulling a fixed fee under the floor', () => {
    const s = KOLAM_ENQUIRIES.seats;
    expect(effectiveRate(s)).toBe(17_500);
    expect(effectiveRate({ ...s, days: s.days + 10 })).toBeLessThan(floorRate(KOLAM));
  });
});
