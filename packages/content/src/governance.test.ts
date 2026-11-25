import { describe, expect, it } from 'vitest';
import {
  ADOPTION_READS, CONTRIBUTION_PATHS, CORE_TEAMS, PATH_HOURS, PATH_STEPS, RASTA_CHANGES, RASTA_REPOS, RASTA_REQUESTS, RASTA_SCANS,
  RASTA_VERSION, REQUEST_BUDGET, VERSION_BUMPS, adoptionRead, bumpFor, bumpVersion, contributionPath, currentShare, overallShare,
  planReleases, requestHours, scanTotal, shareGrade, systemShare, waffle,
  type RastaChange, type RastaRequest, type RastaScan, type SystemRequest,
} from './governance';

describe('Contribution models', () => {
  const keys = Object.keys(RASTA_REQUESTS) as RastaRequest[];
  it('routes every request in Kavya’s queue', () => {
    expect(Object.fromEntries(keys.map(k => [k, contributionPath(RASTA_REQUESTS[k])]))).toEqual({
      datePicker: 'core', qrTicket: 'local', dangerTertiary: 'contribute', focusRing: 'contribute', snackbar: 'reuse',
      stepper: 'local', fareTable: 'core', tabBadge: 'contribute', routeSheet: 'reuse', stopPin: 'contribute', pongal: 'local',
    });
    for (const p of CONTRIBUTION_PATHS) expect(keys.filter(k => contributionPath(RASTA_REQUESTS[k]) === p).length).toBeGreaterThanOrEqual(2);
    for (const k of keys) expect(!!RASTA_REQUESTS[k].match).toBe(RASTA_REQUESTS[k].exists);
  });
  it('welcomes fixes from anyone, and keeps one-squad components local until a second squad asks', () => {
    const r: SystemRequest = { text: 'x', squad: 'x', kind: 'component', teams: 1, exists: false };
    expect(contributionPath({ ...r, kind: 'fix' })).toBe('contribute');
    expect(contributionPath(r)).toBe('local');
    expect(contributionPath({ ...r, teams: 2 })).toBe('contribute');
    expect(contributionPath({ ...r, teams: CORE_TEAMS })).toBe('core');
    expect(contributionPath({ ...r, kind: 'variant', teams: 5 })).toBe('contribute');
    expect(contributionPath({ ...r, teams: 9, exists: true })).toBe('reuse');
  });
  it('fits the quarter when routed right, and not when the system team builds everything', () => {
    const right = keys.map(k => contributionPath(RASTA_REQUESTS[k]));
    expect(requestHours(right)).toBe(293);
    expect(requestHours(right)).toBeLessThanOrEqual(REQUEST_BUDGET);
    expect(requestHours(keys.map(() => 'core'))).toBeGreaterThan(REQUEST_BUDGET * 4);
    expect(PATH_HOURS.core).toBeGreaterThan(PATH_HOURS.contribute * 5);
    for (const p of CONTRIBUTION_PATHS) expect(PATH_STEPS[p].length).toBeGreaterThanOrEqual(2);
    expect(PATH_STEPS.contribute.some(s => s.who === 'squad') && PATH_STEPS.contribute.some(s => s.who === 'system')).toBe(true);
  });
});

describe('Versioning & deprecation', () => {
  const keys = Object.keys(RASTA_CHANGES) as RastaChange[];
  it('bumps each change by what it does to consumers', () => {
    expect(Object.fromEntries(keys.map(k => [k, bumpFor(RASTA_CHANGES[k])]))).toEqual({
      renameType: 'minor', removeType: 'major', focusRing: 'patch', datePicker: 'minor', defaultSize: 'major', textContrast: 'patch',
      trailingIcon: 'minor', react17: 'major', tooltipTouch: 'patch', chipToTag: 'minor', iconLabel: 'major',
    });
    for (const b of VERSION_BUMPS) expect(keys.filter(k => bumpFor(RASTA_CHANGES[k]) === b).length).toBeGreaterThanOrEqual(3);
  });
  it('counts versions like semver', () => {
    expect(bumpVersion('3.4.2', 'patch')).toBe('3.4.3');
    expect(bumpVersion('3.4.2', 'minor')).toBe('3.5.0');
    expect(bumpVersion('3.4.2', 'major')).toBe('4.0.0');
    expect(bumpVersion('3.9.12', 'minor')).toBe('3.10.0');
  });
  it('ships the safe changes now and batches the breaking ones into a major', () => {
    expect(planReleases(RASTA_VERSION, keys.map(k => bumpFor(RASTA_CHANGES[k])))).toEqual({ now: '3.5.0', next: '4.0.0' });
    expect(planReleases('3.4.2', ['patch', 'patch'])).toEqual({ now: '3.4.3', next: null });
    expect(planReleases('3.4.2', ['major'])).toEqual({ now: null, next: '4.0.0' });
    expect(planReleases('3.4.2', [])).toEqual({ now: null, next: null });
  });
});

describe('Measuring adoption', () => {
  const keys = Object.keys(RASTA_SCANS) as RastaScan[];
  it('reads every squad’s scan', () => {
    expect(Object.fromEntries(keys.map(k => [k, adoptionRead(RASTA_SCANS[k])]))).toEqual({
      bus: 'healthy', payments: 'stale', business: 'detaching', metro: 'bypassing', support: 'healthy', rail: 'bypassing',
      onboarding: 'detaching', growth: 'stale', fleet: 'healthy',
    });
    for (const r of ADOPTION_READS) expect(keys.filter(k => adoptionRead(RASTA_SCANS[k]) === r).length).toBeGreaterThanOrEqual(2);
  });
  it('shows coverage hiding the problem: Payments has more system than Bus passes and is the stalest', () => {
    expect(systemShare(RASTA_SCANS.payments)).toBeGreaterThan(systemShare(RASTA_SCANS.bus));
    expect(Math.round(systemShare(RASTA_SCANS.payments) * 100)).toBe(89);
  });
  it('tells three different adoption stories for the same company', () => {
    const all = keys.map(k => RASTA_SCANS[k]);
    expect(Math.round((RASTA_REPOS.installed / RASTA_REPOS.total) * 100)).toBe(92);
    expect(Math.round(overallShare(all) * 100)).toBe(68);
    expect(Math.round(currentShare(all) * 100)).toBe(50);
    expect(all.reduce((a, s) => a + scanTotal(s), 0)).toBe(5500);
  });
  it('draws each scan as exactly 100 scattered cells', () => {
    for (const k of keys) {
      const s = RASTA_SCANS[k], cells = waffle(s);
      expect(cells).toHaveLength(100);
      expect(cells.filter(c => c === 'current' || c === 'old').length).toBeCloseTo(systemShare(s) * 100, -0.5);
      expect(cells.slice(0, 10).every(c => c === cells[0])).toBe(false);
    }
  });
  it('grades share estimates', () => {
    expect(shareGrade(60, 64)).toBe('spot');
    expect(shareGrade(52, 64)).toBe('close');
    expect(shareGrade(40, 64)).toBe('off');
  });
});
