import { describe, expect, it } from 'vitest';
import {
  ARCH_CALLS, BRAND_SPLIT, CAMPAIGN_ROLES, SOS_CALLS, SOS_GAP, SUKOON_FILM, SUKOON_OFFERS, SUKOON_PIECES, SUKOON_READINGS, SUKOON_TRACKER,
  arcRole, archCall, archName, geoLift, shareOfSearch, sosCall, sosGap,
  type CampaignPiece, type Offering, type SearchReading, type SukoonOffer, type SukoonPiece, type SukoonReading,
} from './brandstrategy';

describe('the “Switch off” campaign', () => {
  const keys = Object.keys(SUKOON_PIECES) as SukoonPiece[];
  it('gives every piece its part of the story', () => {
    expect(Object.fromEntries(keys.map(k => [k, arcRole(SUKOON_PIECES[k])]))).toEqual({
      filmOpen: 'tension', billboard: 'tension', audio: 'tension',
      filmTurn: 'turn', bumper: 'turn', reel: 'turn',
      filmEnd: 'proof', carousel: 'proof', study: 'proof',
      number1: 'off', features: 'off', bestLife: 'off',
    });
    for (const r of CAMPAIGN_ROLES) expect(keys.filter(k => arcRole(SUKOON_PIECES[k]) === r).length).toBe(3);
  });
  it('cuts what is about the brand, then what claims instead of showing', () => {
    const base: CampaignPiece = { text: 'x', short: 'x', channel: 'x', about: 'customer', shows: 'problem', specific: true };
    expect(arcRole(base)).toBe('tension');
    expect(arcRole({ ...base, shows: 'change' })).toBe('turn');
    expect(arcRole({ ...base, shows: 'result' })).toBe('proof');
    expect(arcRole({ ...base, about: 'brand' })).toBe('off');
    expect(arcRole({ ...base, specific: false })).toBe('off');
  });
  it('tells the film as an arc: tension peaks before the turn and ends lower than it starts', () => {
    const t: number[] = SUKOON_FILM.map(b => b.tension);
    const peak = t.indexOf(Math.max(...t));
    expect(peak).toBeGreaterThan(0);
    expect(peak).toBeLessThan(t.length - 1);
    expect(t[t.length - 1]).toBeLessThan(t[0]);
    for (let i = 1; i < SUKOON_FILM.length; i++) expect(SUKOON_FILM[i].at).toBeGreaterThan(SUKOON_FILM[i - 1].at);
  });
});

describe('Sukoon’s brand family', () => {
  const keys = Object.keys(SUKOON_OFFERS) as SukoonOffer[];
  it('places every offering', () => {
    expect(Object.fromEntries(keys.map(k => [k, archCall(SUKOON_OFFERS[k])]))).toEqual({
      sleep: 'master', focus: 'master', watch: 'master', tamil: 'master',
      teams: 'sub', kids: 'sub', pro: 'sub',
      neend: 'endorsed', pause: 'endorsed',
      prana: 'own', therapy: 'own', gummies: 'own',
    });
    for (const c of ARCH_CALLS) expect(keys.filter(k => archCall(SUKOON_OFFERS[k]) === c).length).toBeGreaterThanOrEqual(2);
  });
  it('protects the promise first, then keeps bought equity, then gives a new buyer a sub-brand', () => {
    const base: Offering = { text: 'x', short: 'x', name: 'X', fits: true, risk: false, equity: false, newBuyer: false };
    expect(archCall(base)).toBe('master');
    expect(archCall({ ...base, newBuyer: true })).toBe('sub');
    expect(archCall({ ...base, newBuyer: true, equity: true })).toBe('endorsed');
    expect(archCall({ ...base, equity: true, risk: true })).toBe('own');
    expect(archCall({ ...base, equity: true, fits: false })).toBe('own');
  });
  it('names each offering by its place', () => {
    expect(archName(SUKOON_OFFERS.sleep)).toBe('Sukoon · Sleep stories');
    expect(archName(SUKOON_OFFERS.teams)).toBe('Sukoon Teams');
    expect(archName(SUKOON_OFFERS.neend)).toBe('Neend, by Sukoon');
    expect(archName(SUKOON_OFFERS.therapy)).toBe('Saath');
  });
});

describe('measuring Sukoon’s brand', () => {
  const keys = Object.keys(SUKOON_READINGS) as SukoonReading[];
  it('reads every month of search data', () => {
    expect(Object.fromEntries(keys.map(k => [k, sosCall(SUKOON_READINGS[k])]))).toEqual({
      sukoonIndia: 'gain', calmlyIndia: 'gain', sukoonBlr: 'gain',
      dhyanaIndia: 'hold', sukoonPune: 'hold', shaantMumbai: 'hold',
      shaantIndia: 'lose', sukoonHyd: 'lose', dhyanaChennai: 'lose',
      sukoonRaw: 'distorted', shaantNews: 'distorted', calmlyCash: 'distorted',
    });
    for (const c of SOS_CALLS) expect(keys.filter(k => sosCall(SUKOON_READINGS[k]) === c).length).toBe(3);
  });
  it('works out share of search and its gap to market share', () => {
    expect(shareOfSearch(SUKOON_READINGS.sukoonIndia)).toBe(30);
    expect(sosGap(SUKOON_READINGS.sukoonIndia)).toBe(6);
    expect(sosGap(SUKOON_READINGS.dhyanaChennai)).toBe(-7);
    const base: SearchReading = { text: 'x', short: 'x', brand: 'x', searches: 20, category: 100, share: 20, clean: true };
    expect(sosCall({ ...base, share: 20 - SOS_GAP })).toBe('gain');
    expect(sosCall({ ...base, share: 20 - SOS_GAP + 1 })).toBe('hold');
    expect(sosCall({ ...base, share: 20 + SOS_GAP })).toBe('lose');
    expect(sosCall({ ...base, clean: false })).toBe('distorted');
  });
  it('only explains distortion where the count is distorted, and keeps the national category the same', () => {
    for (const k of keys) {
      const r = SUKOON_READINGS[k] as SearchReading;
      expect(!!r.distortion).toBe(!r.clean);
      expect(r.searches).toBeLessThan(r.category);
    }
    const oct = keys.filter(k => k.endsWith('India')).map(k => SUKOON_READINGS[k] as SearchReading);
    expect(new Set(oct.map(r => r.category)).size).toBe(1);
    expect(oct.reduce((s, r) => s + r.share, 0)).toBeLessThanOrEqual(100);
  });
  it('measures campaign lift against the holdout cities', () => {
    expect(SUKOON_TRACKER.map(geoLift)).toEqual([8, 4, 2]);
    expect(geoLift({ measure: 'x', test: [10, 10], holdout: [10, 12] })).toBe(-2);
    expect(BRAND_SPLIT.brand + BRAND_SPLIT.activation).toBe(1);
  });
});
