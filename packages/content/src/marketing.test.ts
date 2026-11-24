import { describe, expect, it } from 'vitest';
import {
  ASSET_FORMATS, ASSET_SIZES, ASSET_STEP, FOLD_PX, KABIR_PAGE, PAGE_ZONES, SEO_AREAS, SEO_AREA_OF, SEO_ISSUES, SUKOON_ASSETS, SUKOON_DRAFTS,
  SUKOON_SECTIONS, SUKOON_SEO_BEFORE, assetIssues, copyChoices, copyFlaws, copyLine, ctaReach, fixSeo, flaggedWords, headLines, loadSeconds,
  pageLayout, pageOrder, scrollReach, seoIssues, serpTitle, shownSize, type Asset, type CopyDraft, type SukoonSection,
} from './marketing';

describe('landing page anatomy', () => {
  it('keeps everyone above the fold and loses 30% a screen below it', () => {
    expect(scrollReach(0)).toBe(1);
    expect(scrollReach(FOLD_PX)).toBe(1);
    expect(scrollReach(2 * FOLD_PX)).toBeCloseTo(0.7);
    expect(scrollReach(3 * FOLD_PX)).toBeCloseTo(0.49);
  });
  it('shows Kabir’s sign-up form to about a third of visitors', () => {
    const form = pageLayout(KABIR_PAGE).at(-1)!;
    expect(form.top).toBe(2860);
    expect(Math.round(ctaReach(KABIR_PAGE) * 100)).toBe(33);
  });
  it('fits the hero above the fold and puts a button in front of everyone', () => {
    const keys = Object.keys(SUKOON_SECTIONS) as SukoonSection[];
    const hero = keys.filter(k => SUKOON_SECTIONS[k].zone === 'hero');
    expect(hero.reduce((s, k) => s + SUKOON_SECTIONS[k].px, 0)).toBeLessThanOrEqual(FOLD_PX);
    const page = pageOrder(keys).map(k => SUKOON_SECTIONS[k]);
    expect(page.map(s => s.zone)).toEqual([...page.map(s => s.zone)].sort((a, b) => PAGE_ZONES.indexOf(a) - PAGE_ZONES.indexOf(b)));
    expect(ctaReach(page)).toBe(1);
    for (const z of PAGE_ZONES) expect(keys.some(k => SUKOON_SECTIONS[k].zone === z)).toBe(true);
    expect(pageOrder(['finalCta', 'headline'])).toEqual(['headline', 'finalCta']);
  });
});

describe('conversion copy', () => {
  it('checks length, buzzwords, we-talk, generic buttons and missing numbers', () => {
    expect(copyFlaws('Calm in five minutes, between meetings', 'headline')).toEqual([]);
    expect(copyFlaws('Unlock your inner calm with our AI-powered meditation ecosystem', 'headline')).toEqual(['long', 'buzz', 'vague']);
    expect(copyFlaws('We built an app', 'reassure')).toEqual(['we']);
    expect(copyFlaws('Submit', 'cta')).toEqual(['generic']);
    expect(copyFlaws('Get started', 'cta')).toEqual(['generic']);
    expect(copyFlaws('Start your free week', 'cta')).toEqual([]);
    expect(copyFlaws('Stress less between meetings', 'headline')).toEqual(['vague']);
    expect(copyFlaws('Stress less between meetings', 'reassure')).toEqual([]);   // only the headline and sub need a number
    expect(flaggedWords('Our seamless app for you')).toEqual([true, true, false, false, false]);
  });
  it('joins phrases without stray spaces', () => {
    const d: CopyDraft = { slot: 'headline', page: 'launch', segments: [['Calm in five minutes', ''], [', between meetings', 'now']] };
    expect(copyLine(d, [0, 0])).toBe('Calm in five minutes, between meetings');
    expect(copyLine(d, [1, 1])).toBe('now');
    expect(copyChoices(d)).toHaveLength(4);
  });
  it('gives every draft a flaw and exactly one way to fix it', () => {
    for (const d of Object.values(SUKOON_DRAFTS) as CopyDraft[]) {
      expect(copyFlaws(copyLine(d, d.segments.map(() => 0)), d.slot).length).toBeGreaterThan(0);
      expect(copyChoices(d).filter(c => copyFlaws(copyLine(d, c), d.slot).length === 0)).toHaveLength(1);
    }
  });
});

describe('campaign assets', () => {
  it('wraps headlines and shrinks them to where they’re shown', () => {
    expect(headLines('Calm in five minutes', 120, 'story')).toBe(2);
    expect(headLines('Calm in 5 minutes', 110, 'thumb')).toBe(1);
    expect(shownSize('thumb', 44)).toBeCloseTo(5.8, 1);
    expect(shownSize('story', 120)).toBe(40);
  });
  it('finds what each draft gets wrong, and the fix is reachable and clean', () => {
    const want: Record<string, string[]> = { storyLaunch: ['unsafe'], storyTeams: ['overlap'], postLaunch: ['wordy'], postQuote: [], thumbTalk: ['tiny', 'wordy'], linkCard: ['tiny'] };
    for (const [k, a] of Object.entries(SUKOON_ASSETS) as [string, Asset][]) {
      expect(assetIssues(a, a.draft)).toEqual(want[k]);
      expect(assetIssues(a, a.fix)).toEqual([]);
      const step = ASSET_STEP[a.format];
      for (const f of ['head', 'logo', 'cta'] as const) if (a.draft[f] !== undefined) expect(Number.isInteger((a.fix[f]! - a.draft[f]!) / step)).toBe(true);
      for (const s of [a.draft.size, a.fix.size]) expect(ASSET_SIZES).toContain(s);
      expect(a.fix.line).toBeLessThan(a.lines.length);
    }
    for (const f of ASSET_FORMATS) expect(Object.values(SUKOON_ASSETS).some(a => a.format === f)).toBe(true);
  });
});

describe('SEO basics', () => {
  it('cuts titles the way Google does and times images on slow 4G', () => {
    expect(serpTitle('5-minute meditation app | Sukoon')).toBe('5-minute meditation app | Sukoon');
    expect(serpTitle(SUKOON_SEO_BEFORE.title)).toBe('Home | Welcome to the Official Website of Sukoon Wellness …');
    expect(loadSeconds(2400)).toBeCloseTo(6.4);
  });
  it('finds every issue on the launch page, and each fix removes only its own', () => {
    expect(seoIssues(SUKOON_SEO_BEFORE)).toEqual([...SEO_ISSUES]);
    for (const k of SEO_ISSUES) expect(seoIssues(fixSeo(SUKOON_SEO_BEFORE, [k]))).toEqual(SEO_ISSUES.filter(i => i !== k));
    const after = fixSeo(SUKOON_SEO_BEFORE, [...SEO_ISSUES]);
    expect(seoIssues(after)).toEqual([]);
    expect(seoIssues(fixSeo(SUKOON_SEO_BEFORE, [...SEO_ISSUES].reverse()))).toEqual([]);
    expect(after.title).toBe('5-minute meditation app | Sukoon');
    expect(after.headings.map(h => h.level)).toEqual([1, 2, 2, 2]);
    for (const a of SEO_AREAS) expect(SEO_ISSUES.some(i => SEO_AREA_OF[i] === a)).toBe(true);
  });
});
