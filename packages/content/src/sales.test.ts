import { describe, expect, it } from 'vitest';
import {
  DEMO_MINUTES, DEMO_PAINS, KARAN_FIRST_DEMO, OLD_PRICING, PARCHA_BUYERS, PARCHA_PLANS, PARCHA_PRICING, PARCHA_SIGNALS, PLAN_IDS, RESCHEDULE_TICKETS, ROUTES,
  SUNRISE_MOMENTS, arrByRoute, demoFlaws, demoGaps, demoLength, demoOrder, fenceFor, lakh, loopAccounts, monthlyBill, planFor, pricingFlaws, rankSignals, yearly,
  type ParchaBuyer, type ParchaSignal, type SunriseMoment,
} from './sales';

const moments = (keys: readonly SunriseMoment[]) => keys.map(k => SUNRISE_MOMENTS[k]);
const momentKeys = Object.keys(SUNRISE_MOMENTS) as SunriseMoment[];
const GOOD_DEMO: SunriseMoment[] = ['recap', 'reminders', 'billing', 'rx', 'pilot'];

describe('sales demos', () => {
  it('finds every flaw in Karan’s first demo, a tour of everything', () => {
    expect(demoLength(moments(KARAN_FIRST_DEMO))).toBe(32);
    expect(demoFlaws(moments(KARAN_FIRST_DEMO))).toEqual(['long', 'gap', 'tour', 'dummy', 'noclose']);
    // The placeholder booking flow doesn't count as answering the no-show problem.
    expect(demoGaps(moments(KARAN_FIRST_DEMO))).toEqual([...DEMO_PAINS]);
  });
  it('has exactly one clean demo: the recap, every pain on Sunrise’s data, and a pilot, inside the time', () => {
    expect(demoFlaws(moments(GOOD_DEMO))).toEqual([]);
    expect(demoLength(moments(GOOD_DEMO))).toBeLessThanOrEqual(DEMO_MINUTES);
    for (const extra of momentKeys.filter(k => !GOOD_DEMO.includes(k))) expect(demoFlaws(moments([...GOOD_DEMO, extra]))).not.toEqual([]);
    for (const drop of ['reminders', 'billing', 'rx', 'pilot'] as const) expect(demoFlaws(moments(GOOD_DEMO.filter(k => k !== drop)))).not.toEqual([]);
  });
  it('orders a demo tell–show–tell: recap, pains in the buyer’s ranking, then the next step', () => {
    expect(demoOrder(['pilot', 'rx', 'scribe', 'billing', 'recap', 'reminders'] as SunriseMoment[], k => SUNRISE_MOMENTS[k]))
      .toEqual(['recap', 'reminders', 'billing', 'rx', 'scribe', 'pilot']);
  });
});

describe('pricing pages', () => {
  it('fails the inherited page on every count and passes the redesign', () => {
    expect(pricingFlaws(OLD_PRICING)).toEqual(['choice', 'hidden', 'whofor', 'nofocus', 'metric']);
    expect(pricingFlaws(PARCHA_PRICING)).toEqual([]);
    expect(pricingFlaws({ ...PARCHA_PRICING, highlight: 'Gold' })).toEqual(['nofocus']);
  });
  it('places each buyer on the cheapest plan that covers them, and says which line decided it', () => {
    const plans = Object.fromEntries((Object.keys(PARCHA_BUYERS) as ParchaBuyer[]).map(k => [k, planFor(PARCHA_BUYERS[k])]));
    expect(plans).toEqual({ farida: 'solo', kabir: 'solo', jaipur: 'clinic', ritu: 'clinic', littleSteps: 'clinic', drishti: 'clinic', arogya: 'chain', sunrise: 'chain' });
    expect(fenceFor(PARCHA_BUYERS.ritu)).toBe('oneClinic');
    expect(fenceFor(PARCHA_BUYERS.jaipur)).toBe('oneDoctor');
    expect(fenceFor(PARCHA_BUYERS.arogya)).toBe('integration');
    expect(fenceFor(PARCHA_BUYERS.sunrise)).toBe('clinics');
    expect(planFor({ name: '', place: '', doctors: 30, clinics: 1 })).toBe('chain');
    for (const id of PLAN_IDS) expect(Object.values(plans)).toContain(id);
  });
  it('bills Clinic per doctor with a floor of two, and quotes Chain', () => {
    expect(monthlyBill('solo', PARCHA_BUYERS.farida)).toBe(999);
    expect(monthlyBill('clinic', PARCHA_BUYERS.ritu)).toBe(1598);
    expect(monthlyBill('clinic', PARCHA_BUYERS.drishti)).toBe(9 * PARCHA_PLANS.clinic.price);
    expect(monthlyBill('chain', PARCHA_BUYERS.sunrise)).toBeNull();
    expect(yearly(999)).toEqual({ total: 9990, saves: 1998 });
  });
});

describe('working with customer success', () => {
  const keys = Object.keys(PARCHA_SIGNALS) as ParchaSignal[];
  it('covers every route', () => {
    for (const r of ROUTES) expect(keys.some(k => PARCHA_SIGNALS[k].route === r)).toBe(true);
  });
  it('shows the loudest theme is not the biggest one', () => {
    expect(rankSignals(keys, 'tickets')[0]).toBe('invoice');
    expect(rankSignals(keys, 'arr')[0]).toBe('reschedule');
  });
  it('totals revenue and clinics to tell by route', () => {
    const arr = arrByRoute(keys);
    expect(arr.fix).toBe(1_590_000);
    expect(Object.values(arr).reduce((a, b) => a + b, 0)).toBe(keys.reduce((s, k) => s + PARCHA_SIGNALS[k].arr, 0));
    expect(loopAccounts(keys, 'fix')).toBe(56);
    expect(arrByRoute([]).fix).toBe(0);
    expect(lakh(1_180_000)).toBe('₹11.8 lakh');
    expect(RESCHEDULE_TICKETS.before).toBe(PARCHA_SIGNALS.reschedule.tickets);
  });
});
