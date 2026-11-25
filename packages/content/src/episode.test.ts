import { describe, expect, it } from 'vitest';
import { HYPO_PARTS, PLAN_VERDICTS, READ_CALLS, TOKRI_AA, TOKRI_HYPOS, TOKRI_PLANS, TOKRI_RESULTS, WEEKS_MAX, aaPValues, hypoFlaw, hypoRewrite, hypoText, planTest, planVerdict, readCall, weeksFor, weeksGrade, type Hypothesis, type TestRead, type TokriHypo, type TokriPlan, type TokriResult } from './episode';
import { twoProp } from './stats';
import { GUIDE_SECTIONS, KIT_SLOTS, MARK_VERDICTS, SUKOON_KIT, SUKOON_MARKS, SUKOON_USES, kitFlaw, markVerdict, sectionBroken, type KitOption, type SukoonKitKey, type SukoonMark, type SukoonUse } from './identity';
import { ASSET_FORMATS, HERO_SLOTS, PAGE_ZONES, SEO_AREAS, SEO_AREA_OF, SUKOON_ASSETS, SUKOON_DRAFTS, SUKOON_SECTIONS, SUKOON_SEO_BEFORE, copyFlaws, copyLine, seoIssues, type CopyDraft, type SeoIssue, type SukoonAsset, type SukoonDraft, type SukoonSection } from './marketing';
import { AI_ROLES, FIELD_TREATMENTS, HISAAB_EVALS, HISAAB_FIELDS, HISAAB_TASKS, PROMPT_PARTS, aiRole, fieldTreatment, type HisaabCase, type HisaabField, type HisaabTask } from './ai';
import { HAAT_BREAKS, HAAT_DECISIONS, HAAT_PRINCIPLES, MATRIX_CALLS, PRINCIPLE_VERDICTS, RULE_CALLS, matrixCall, principleVerdict, ruleCall, type HaatBreak, type HaatDecision, type HaatPrinciple } from './judgment';
import { ATOM_LANES, MUSAFIR_ATOMS, MUSAFIR_PLANS, MUSAFIR_REQUESTS, SLOTS, SUPPORT, atomLane, roadmapSlot, studyWeeks, support, type MusafirAtom, type MusafirPlan, type MusafirRequest } from './researchops';
import { BRAND_CALLS, PARITY_CALLS, SAWARI_DECISIONS, SAWARI_DRIFTS, SAWARI_REQUESTS, SYNC_MOVES, brandCall, parityCall, passingSteps, syncMove, type SawariDecision, type SawariDrift, type SawariRequest } from './multibrand';
import { ADOPTION_READS, CONTRIBUTION_PATHS, RASTA_CHANGES, RASTA_REQUESTS, RASTA_SCANS, VERSION_BUMPS, adoptionRead, bumpFor, contributionPath, type RastaChange, type RastaRequest, type RastaScan } from './governance';
import { CHART_FORMS, PALETTE_JOBS, ROSHNI_CHARTS, ROSHNI_QUESTIONS, ROSHNI_TILES, TILE_VERDICTS, chartFor, paletteFor, tileVerdict, type RoshniChart, type RoshniQuestion, type RoshniTile } from './dataviz';
import { BUNKAR_CASES, BUNKAR_DETAILS, BUNKAR_SURFACES, CRAFT_CHECKS, ELEVATIONS, OPTICAL_FIXES, craftCheck, craftFix, elevationOf, opticalFix, type BunkarCase, type BunkarDetail, type BunkarSurface } from './polish';
import { BLUEPRINT_ROWS, NABZ_DUTIES, NABZ_ROLES, NABZ_STEPS, NABZ_TASKS, SCALE_PATTERNS, blueprintRow, dutyOwner, scalePattern, type NabzDuty, type NabzStep, type NabzTask } from './service';
import { BOLO_CLAIMS, BOLO_GAPS, BOLO_ITEMS, BOLO_SIGNALS, GAP_CALLS, GATES, MARGIN_MAX, SURVEY_PARTS, WEIGHTS, gapCall, gapInterval, signalGate, surveyFlaw, triangulate, type BoloClaim, type BoloGap, type BoloItem, type BoloSignal } from './survey';
import { CEREMONIES, MOVES, RASOI_ITEMS, RASOI_MOMENTS, RASOI_QUESTIONS, SPRINT_CALLS, ceremonyFor, moveFor, sprintCall, type RasoiItem, type RasoiMoment, type RasoiQuestion } from './team';
import { GAADI_CODE, GAADI_QA, GAADI_SPEC, QA_LANES, REF_KINDS, SPEC_SOURCES, qaLane, refKind, type GaadiCode, type GaadiQa, type GaadiSpecItem } from './handoff';
import { PARCHA_BUYERS, PARCHA_SIGNALS, PLAN_IDS, ROUTES, SUNRISE_MOMENTS, demoFlaws, planFor, type ParchaBuyer, type ParchaSignal, type SunriseMoment } from './sales';
import { OBJECTION_KINDS, PITCH_PARTS, SAMAN_BEATS, SAMAN_OBJECTIONS, SAMAN_UPDATE, SUMMARY_PARTS, replyFlaw, type Objection, type SamanBeat, type SamanLine, type SamanObjection } from './pitch';

describe('gr.3 helpers', () => {
  it('finds the one weak part of each hypothesis, and the fix mends it while the trap does not', () => {
    const good: Hypothesis = { because: { text: 'a', evidence: true }, change: { text: 'b', one: true }, who: { text: 'c', scoped: true }, expect: { text: 'd', metric: true, size: true }, fix: 'x', trap: 'y' };
    expect(hypoFlaw(good)).toBeNull();
    expect(hypoFlaw({ ...good, because: { text: 'a', evidence: false }, who: { text: 'c', scoped: false } })).toBe('because');   // first weak part wins
    expect(hypoFlaw({ ...good, expect: { text: 'd', metric: true, size: false } })).toBe('expect');
    expect(hypoText(good)).toBe('Because a, we believe b for c will d.');
    const hs = Object.values(TOKRI_HYPOS) as Hypothesis[];
    for (const h of hs) {
      const weak = HYPO_PARTS.filter(p => hypoFlaw({ ...good, [p]: h[p] }) !== null);
      expect(weak).toHaveLength(1);   // exactly one weak part
      expect(weak[0]).toBe(hypoFlaw(h));
      expect(hypoFlaw(hypoRewrite(h, 'fix'))).toBeNull();
      expect(hypoFlaw(hypoRewrite(h, 'trap'))).toBe(hypoFlaw(h));
      expect(h.fix).not.toBe(h.trap);
    }
    for (const p of HYPO_PARTS) expect(hs.filter(h => hypoFlaw(h) === p)).toHaveLength(2);
  });
  it('sizes and times each plan', () => {
    expect(weeksFor(0.5)).toBe(1); expect(weeksFor(7)).toBe(1); expect(weeksFor(7.1)).toBe(2);
    expect(planVerdict(4)).toBe('go'); expect(planVerdict(5)).toBe('long'); expect(planVerdict(8)).toBe('long'); expect(planVerdict(9)).toBe('rethink');
    const fee = planTest(TOKRI_PLANS.feeEarly);
    expect(fee.n).toBe(18872); expect(fee.total).toBe(37744); expect(fee.weeks).toBe(1);
    // Half the lift, about four times the people; a tenth of the traffic, ten times the days.
    expect(planTest(TOKRI_PLANS.smallLift).n / fee.n).toBeGreaterThan(3.8);
    expect(planTest(TOKRI_PLANS.cautious).days / fee.days).toBeCloseTo(10, 6);
    // More versions split α between the comparisons, so each version needs more than a plain A/B would.
    const slots = planTest(TOKRI_PLANS.slots);
    expect(slots.alpha).toBeCloseTo(0.05 / 3, 9);
    expect(slots.n).toBeGreaterThan(planTest({ ...TOKRI_PLANS.slots, arms: 2 }).n);
    const weeks = Object.fromEntries((Object.keys(TOKRI_PLANS) as TokriPlan[]).map(k => [k, planTest(TOKRI_PLANS[k]).weeks]));
    expect(weeks).toEqual({ feeEarly: 1, greenPay: 22, slots: 5, reorder: 1, cautious: 9, smallLift: 6, coupon: 5, hindi: 3 });
    for (const v of PLAN_VERDICTS) expect(Object.values(weeks).filter(w => planVerdict(w) === v).length).toBeGreaterThanOrEqual(2);
    expect(Math.max(...Object.values(weeks))).toBeLessThanOrEqual(WEEKS_MAX);
    expect(weeksGrade(6, 6)).toBe('spot'); expect(weeksGrade(5, 6)).toBe('close'); expect(weeksGrade(4, 6)).toBe('close'); expect(weeksGrade(3, 6)).toBe('off');
    expect(weeksGrade(2, 1)).toBe('close'); expect(weeksGrade(3, 1)).toBe('off');
    expect(weeksGrade(17, 22)).toBe('close'); expect(weeksGrade(15, 22)).toBe('off');
    expect(weeksGrade(WEEKS_MAX, 40)).toBe('spot');
  });
  it('reads a result in the careful order', () => {
    const base: TestRead = { text: '', metric: '', a: { n: 20000, x: 1600 }, b: { n: 20000, x: 1780 }, planned: 18872 };
    expect(readCall(base)).toEqual({ call: 'ship', why: 'win' });
    expect(readCall({ ...base, b: { n: 20000, x: 1610 } })).toEqual({ call: 'flat', why: 'no-effect' });
    expect(readCall({ ...base, b: { n: 20000, x: 1420 } })).toEqual({ call: 'harm', why: 'worse' });
    expect(readCall({ ...base, guard: { name: 'g', a: { n: 1600, x: 32 }, b: { n: 1780, x: 70 } } })).toEqual({ call: 'harm', why: 'guardrail' });
    expect(readCall({ ...base, guard: { name: 'g', a: { n: 1600, x: 70 }, b: { n: 1780, x: 32 } } })).toEqual({ call: 'ship', why: 'win' });   // a guardrail that improved is fine
    expect(readCall({ ...base, planned: 30000 })).toEqual({ call: 'distrust', why: 'early' });
    expect(readCall({ ...base, a: { n: 21000, x: 1680 }, planned: 30000 })).toEqual({ call: 'distrust', why: 'srm' });   // a broken split trumps everything
    // A slice: judged at 0.05 ÷ slices, and never against the whole test's plan.
    const slice = TOKRI_RESULTS.slice as TestRead, p = twoProp(slice.a, slice.b).p;
    expect(p).toBeLessThan(0.05); expect(p).toBeGreaterThan(0.05 / 20);
    expect(readCall(slice)).toEqual({ call: 'distrust', why: 'fishing' });
    expect(readCall({ ...slice, slices: 1 })).toEqual({ call: 'ship', why: 'win' });
    const why = Object.fromEntries((Object.keys(TOKRI_RESULTS) as TokriResult[]).map(k => [k, readCall(TOKRI_RESULTS[k] as TestRead).why]));
    expect(why).toEqual({ feeEarly: 'win', reorder: 'win', hindiDay4: 'early', hindiEnd: 'no-effect', lightCart: 'srm', slice: 'fishing', scarcity: 'guardrail', onePage: 'worse' });
    // Stopping early would have "won"; at full length the same test is flat.
    expect(twoProp(TOKRI_RESULTS.hindiDay4.a, TOKRI_RESULTS.hindiDay4.b).p).toBeLessThan(0.05);
    const end = twoProp(TOKRI_RESULTS.hindiEnd.a, TOKRI_RESULTS.hindiEnd.b);
    expect(end.ci[0]).toBeLessThan(0); expect(end.ci[1]).toBeLessThan(TOKRI_PLANS.hindi.base * TOKRI_PLANS.hindi.lift);   // rules out the MDE
    // The broken split would otherwise look like a clean win.
    expect(readCall({ ...(TOKRI_RESULTS.lightCart as TestRead), a: { n: 19000, x: 1520 } }).call).toBe('ship');
    for (const c of READ_CALLS) expect(Object.values(TOKRI_RESULTS).some(r => readCall(r as TestRead).call === c)).toBe(true);
  });
  it('has an A/A test that peeks significant and ends flat', () => {
    const ps = aaPValues();
    expect(ps).toHaveLength(14);
    expect(ps[3]).toBeLessThan(0.05);
    expect(ps.filter(p => p < 0.05)).toHaveLength(1);
    expect(ps[13]).toBeGreaterThan(0.5);
    for (let i = 1; i < 14; i++) { expect(TOKRI_AA.a[i]).toBeGreaterThan(TOKRI_AA.a[i - 1]); expect(TOKRI_AA.b[i]).toBeGreaterThan(TOKRI_AA.b[i - 1]); }
  });
});
import { EMPTY_PIECES, EMPTY_SLOTS, KAKSHA_MOMENTS, KAKSHA_PRO, KAKSHA_TIPS, PRO_MOMENTS, UPGRADE_MOVES, cueFor, cueVerdict, emptyFlaw, firstValueTaps, moveEffect, upgradeMove, type EmptyPiece, type EmptyPieceId, type KakshaTip, type ProMomentId } from './episode';
import { AWAAZ_HEART, DATA_VIEWS, GSM_PARTS, HEART, KAHAANI_ASKS, KAHAANI_EVENTS, KAHAANI_FUNNEL, KAHAANI_METRICS, KAHAANI_SEGMENTS, KAHAANI_WEEK, METRIC_ROLES, PII_PROPS, TRACK_QUESTIONS, askValue, cohortShare, estimateGrade, eventNameFlaw, gsmPart, metricRole, propsCheck, storyNights, type AwaazLine, type KahaaniAsk, type KahaaniEvent, type KahaaniMetric, type TrackQuestion } from './episode';
import { EVIDENCE, GALLA_BETS, GALLA_RIVALS, HORIZONS, RIVAL_RINGS, VISION_PARTS, horizonFor, ringFor, visionFlags, visionFlaw, type GallaBet, type GallaRival } from './episode';
import { COGA_LANES, FORM_FLAWS, KEY_WAYS, RAHI_BARRIERS, RAHI_CONTROLS, RAHI_FIELDS, RAHI_PARTS, SR_GAPS, announce, fieldAnnounce, fieldFlaw, fixedControl, loadLeft, srGap, stopsOf, tabPresses, type RahiBarrier, type RahiPart, CHAABI_MOMENTS, FLOW_QUESTIONS, LOC_LANES, LOREM_SLOTS, TONES, growthFor, locFlaw, locParse, pseudoLocalize, roomFor, slotFits, toneFor, toneGap, wrapLines, wrapText, type LoremSlot, DELIGHT_LANES, GULLAK_MICROS, GULLAK_MOMENTS, MICRO_PARTS, PAY_STAGES, delightCost, delightVerdict, microComplete, microStrips, payStage, DABBA_MOTIONS, DURATION_BANDS, DURATION_KINDS, EASES, EASE_CURVES, MEANING_MOTIONS, MOTION_JOBS, REDUCE_LANES, bandOf, bezierAt, bezierCss, curveFor, durationVerdict, reduceFor, staggerEnd, staggerStep, timingOf, type DurationBand, API_KINDS, BUTTON_API, DOC_BLOCKS, PROP_TYPES, apiFrom, comboCount, frameCount, oldPropKind, propValues, readSeconds, wordCount, type ApiDecision, COMPONENT, MODE_SPECS, NAME_FLAWS, TOKEN_TIERS, badName, blastRadius, darkCheck, modeHex, nameFlaw, nameWords, parentOf, rampSteps, resolveTokens, tierOf, type ModeToken, EPISODES, Episode, Exercise, ICON_FLAWS, ICONS, IMAGE_KINDS, KIT_PARTS, KIT_STATES, LEDGER_PARTS, WRONG_METAPHORS, iconRow, inr, pageWeight, FEEDBACK, FORM_LANES, GESTURES, MANDI_FIELDS, PACKING_PARTS, WAIT_LIMITS, feedbackFor, formSeconds, FRAME_LEAD, GRID_AREA, KHELO_PARTS, KHELO_SCREENS, phoneStack, JOURNEY_STAGES, NIELSEN_10, SAFAR_PARTS, SEVERITY, findingOf, flawSpan, severityOf, studyCost, taskWords, KOSH_PARTS, TOOL_PARTS, findExercise, insightParts, journeyFeelings, journeyLow, participantOf, themeReach, contrastLane, contrastRatio, unitHealth, unitNumbers, foggMissing, foggPoint, funnelCounts, funnelRates, leakiestStep, hslChange, hslDial, lessonById, measureSetting, measureVerdict, riceIdeas, riceScore } from './index';

describe('gr.2 helpers', () => {
  it('times each tip to the first moment it can be used', () => {
    expect(cueFor({})).toBe('open');
    expect(cueFor({ students: 1 })).toBe('batch');
    expect(cueFor({ classes: 1 })).toBe('class');
    expect(cueFor({ classes: 10 })).toBe('fees');   // a report needs weeks of classes, not one
    expect(cueFor({ feesDue: true })).toBe('fees');
    expect(cueFor({ students: 100 })).toBeNull();
    expect(cueVerdict({ classes: 1 }, 'batch')).toBe('early');
    expect(cueVerdict({ classes: 1 }, 'class')).toBe('right');
    expect(cueVerdict({ students: 1 }, 'fees')).toBe('late');
    // Every moment gets two tips, so the old up-front tour really is spread across the month.
    const cues = Object.values(KAKSHA_TIPS).map(t => cueFor(t.needs));
    for (const m of Object.keys(KAKSHA_MOMENTS)) expect(cues.filter(c => c === m)).toHaveLength(2);
    // What she has done only grows through the month.
    const ms = Object.values(KAKSHA_MOMENTS);
    for (let i = 1; i < ms.length; i++) { expect(ms[i].students).toBeGreaterThanOrEqual(ms[i - 1].students); expect(ms[i].classes).toBeGreaterThanOrEqual(ms[i - 1].classes); }
  });
  it('finds what stops an empty-state piece from activating', () => {
    expect(emptyFlaw({ slot: 'message', text: 'x', names: true, next: false })).toBe('vague');
    expect(emptyFlaw({ slot: 'message', text: 'x', names: true, next: true, aboutApp: true })).toBe('about-app');
    expect(emptyFlaw({ slot: 'starter', text: 'x', taps: 3, sample: 'marked' })).toBeNull();   // marked samples are fine
    expect(emptyFlaw({ slot: 'starter', text: 'x', taps: 0, sample: 'unmarked' })).toBe('unmarked');
    expect(emptyFlaw({ slot: 'starter', text: 'x', taps: 7 })).toBe('effort');
    expect(emptyFlaw({ slot: 'action', text: 'x', buttons: 1, visible: false, taps: 1 })).toBe('dead-end');
    expect(emptyFlaw({ slot: 'action', text: 'x', buttons: 2, visible: true, taps: 1 })).toBe('competing');
    expect(emptyFlaw({ slot: 'preview', text: 'x', shows: 'art' })).toBeNull();   // a small illustration is fine
    expect(emptyFlaw({ slot: 'preview', text: 'x', shows: 'zeros' })).toBe('zeros');
    const pieces = Object.values(EMPTY_PIECES) as EmptyPiece[];
    for (const slot of EMPTY_SLOTS) expect(pieces.filter(p => p.slot === slot && emptyFlaw(p) === null)).toHaveLength(1);
    // The good build is the quickest honest one: no other choice of starter and action gets there in fewer taps
    // without a flaw.
    const good = pieces.filter(p => emptyFlaw(p) === null);
    expect(firstValueTaps(good)).toBe(5);
    const starters = pieces.filter(p => p.slot === 'starter'), actions = pieces.filter(p => p.slot === 'action');
    for (const s of starters) for (const a of actions) if (firstValueTaps([s, a]) < 5) expect(emptyFlaw(s) ?? emptyFlaw(a)).not.toBeNull();
  });
  it('picks the upgrade move for a moment, and says how a wrong pick lands', () => {
    expect(upgradeMove({ value: false, limit: true })).toBe('quiet');   // no value yet, even if she reaches for Pro
    expect(upgradeMove({ value: true, failed: true, limit: true })).toBe('quiet');
    expect(upgradeMove({ value: true, limit: true })).toBe('offer');
    expect(upgradeMove({ value: true, limit: true, midTask: true })).toBe('finish');
    expect(upgradeMove({ value: true, primed: true })).toBe('hint');
    expect(upgradeMove({ value: true, midTask: true })).toBe('quiet');
    expect(moveEffect('offer', 'offer')).toBe('sale');
    expect(moveEffect('offer', 'finish')).toBe('lost');
    expect(moveEffect('offer', 'quiet')).toBe('annoyed');
    expect(moveEffect('finish', 'hint')).toBe('annoyed');
    expect(moveEffect('quiet', 'offer')).toBe('missed');
    expect(moveEffect('hint', 'quiet')).toBe('ok');
    const moves = Object.values(PRO_MOMENTS).map(upgradeMove);
    for (const m of UPGRADE_MOVES) expect(moves).toContain(m);
    expect(PRO_MOMENTS.nearLimit.text).toContain(String(KAKSHA_PRO.freeStudents));
    expect(PRO_MOMENTS.overLimit.text).toContain(`${KAKSHA_PRO.freeStudents + 1}th`);
  });
});

describe('st.3 helpers', () => {
  it('gives each metric its role in the tree', () => {
    expect(metricRole({ value: true })).toBe('north');
    expect(metricRole({ value: true, cumulative: true })).toBe('vanity');   // a running total, whatever it counts
    expect(metricRole({ team: true, leads: true })).toBe('input');
    expect(metricRole({ team: true })).toBe('vanity');   // a team can move it, but it doesn't move the north star
    expect(metricRole({ team: true, harm: true })).toBe('guardrail');
    const roles = Object.values(KAHAANI_METRICS).map(metricRole);
    expect(roles.filter(r => r === 'north')).toHaveLength(1);
    for (const r of METRIC_ROLES) expect(roles).toContain(r);
    expect(storyNights(KAHAANI_WEEK)).toBe(84_000);
  });
  it('reads a HEART line as a signal, a metric or a total to cut', () => {
    expect(gsmPart('Grandparents give up halfway through a recording')).toBe('signal');
    expect(gsmPart('Share of recordings saved, each week')).toBe('metric');
    expect(gsmPart('Share of recordings saved')).toBe('signal');   // no time window, not yet a metric
    expect(gsmPart('Total recordings since launch')).toBe('cut');
    for (const d of HEART) {
      const rows = Object.values(AWAAZ_HEART).filter(l => 'dim' in l && l.dim === d).map(l => gsmPart(l.text)).sort();
      expect(rows).toEqual(['metric', 'signal']);
    }
    for (const l of Object.values(AWAAZ_HEART)) expect(gsmPart(l.text) === 'cut').toBe(!('dim' in l));
  });
  it('reads the funnel, the cohorts and the language split', () => {
    expect(askValue(KAHAANI_ASKS.finishFirst)).toBe(55.7);
    expect(askValue(KAHAANI_ASKS.startAfterChild)).toBe(74.4);
    expect(askValue(KAHAANI_ASKS.secondNight)).toBe(21);
    expect(askValue(KAHAANI_ASKS.newFirstNight)).toBe(52);
    expect(askValue(KAHAANI_ASKS.diwali)).toBe(22);
    expect(askValue(KAHAANI_ASKS.novBlend)).toBe(35.3);
    expect(askValue(KAHAANI_ASKS.telugu)).toBe(40);
    expect(cohortShare(['16nov'], 2)).toBeNull();   // that week hasn't happened yet
    // The blend falls while every cohort after the change beats every cohort before it.
    const oct = ['12oct', '19oct', '26oct'] as const;
    expect(cohortShare([...oct], 1)!).toBeGreaterThan(cohortShare(['2nov', '9nov', '16nov'], 1)!);
    for (const after of ['9nov', '16nov'] as const) for (const before of oct) expect(cohortShare([after], 1)!).toBeGreaterThan(cohortShare([before], 1)!);
    // The funnel only loses people, and the language split adds up to its two steps.
    for (let i = 1; i < KAHAANI_FUNNEL.length; i++) expect(KAHAANI_FUNNEL[i].n).toBeLessThan(KAHAANI_FUNNEL[i - 1].n);
    const segs = Object.values(KAHAANI_SEGMENTS);
    expect(segs.reduce((s, x) => s + x.started, 0)).toBe(KAHAANI_FUNNEL[2].n);
    expect(segs.reduce((s, x) => s + x.finished, 0)).toBe(KAHAANI_FUNNEL[3].n);
    expect(estimateGrade(50, 52)).toBe('spot');
    expect(estimateGrade(45, 52)).toBe('close');
    expect(estimateGrade(30, 52)).toBe('off');
  });
  it('checks event names and properties', () => {
    for (const name of Object.keys(KAHAANI_EVENTS)) expect(eventNameFlaw(name)).toBeNull();
    expect(eventNameFlaw('PlayBtnTap')).toBe('case');
    expect(eventNameFlaw('sleep-timer')).toBe('case');
    expect(eventNameFlaw('play_button_tapped')).toBe('ui');
    expect(eventNameFlaw('event')).toBe('vague');
    expect(eventNameFlaw('story_play')).toBe('tense');
    for (const e of Object.values(KAHAANI_EVENTS)) for (const p of e.props) expect(PII_PROPS as readonly string[]).not.toContain(p);
    for (const q of Object.values(TRACK_QUESTIONS)) for (const p of q.props) expect(KAHAANI_EVENTS[q.event].props as readonly string[]).toContain(p);
    expect(propsCheck(['timer_on'], ['timer_on', 'story_id'])).toEqual({ missing: [], pii: [], ok: true });
    expect(propsCheck(['timer_on'], ['story_id', 'child_name'])).toEqual({ missing: ['timer_on'], pii: ['child_name'], ok: false });
  });
});

describe('st.2 helpers', () => {
  it('catches buzzwords, features and targets in a vision line', () => {
    expect(visionFlaw('Galla will be India’s leading AI-powered retail ecosystem.')).toBe('buzz');
    expect(visionFlags('Galla will be India’s leading AI-powered retail ecosystem.').map(f => f.word)).toEqual(['leading', 'AI-powered', 'ecosystem']);
    expect(visionFlaw('Launch voice entry next quarter')).toBe('feature');
    expect(visionFlaw('Reach 10 lakh shops by 2028')).toBe('target');
    expect(visionFlaw('Grow udhaar collected by 40%')).toBe('target');
    expect(visionFlaw('In 2030 she closes at 9 knowing who owes her')).toBeNull();
    expect(visionFlaw('She adds it up every Sunday')).toBeNull();   // "adds" isn't "add"
    expect(visionFlaw('₹38,000 owed by 61 customers')).toBeNull();
  });
  it('puts a bet in a column by evidence, fit and what it builds on', () => {
    const all = { a: { problem: 'p', idea: 'i', evidence: 'tested', fits: true }, b: { problem: 'p', idea: 'i', evidence: 'tested', fits: true, after: 'a' },
      c: { problem: 'p', idea: 'i', evidence: 'tested', fits: true, after: 'b' }, d: { problem: 'p', idea: 'i', evidence: 'tested', fits: true, after: 'c' },
      e: { problem: 'p', idea: 'i', evidence: 'proven', fits: false } } as const;
    expect(horizonFor(all.a, all)).toBe('now');
    expect(horizonFor(all.b, all)).toBe('next');
    expect(horizonFor(all.c, all)).toBe('later');
    expect(horizonFor(all.d, all)).toBe('later');   // Later is as far as the board goes
    expect(horizonFor(all.e, all)).toBe('off');
    expect(EVIDENCE.map(evidence => horizonFor({ problem: 'p', idea: 'i', evidence, fits: true }, {}))).toEqual(['now', 'next', 'later']);
    const lanes = Object.values(GALLA_BETS).map(b => horizonFor(b, GALLA_BETS));
    for (const h of HORIZONS) expect(lanes.filter(x => x === h).length).toBeGreaterThanOrEqual(2);
    for (const b of Object.values(GALLA_BETS)) if ('after' in b) expect(Object.keys(GALLA_BETS)).toContain(b.after);
  });
  it('rings a rival by who, job and kind', () => {
    expect(ringFor({ who: 'same', job: 'same', kind: 'like' })).toBe('direct');
    expect(ringFor({ who: 'same', job: 'same', kind: 'product' })).toBe('indirect');
    expect(ringFor({ who: 'same', job: 'same', kind: 'makeshift' })).toBe('substitute');
    expect(ringFor({ who: 'other', job: 'same', kind: 'like' })).toBe('not');
    expect(ringFor({ who: 'same', job: 'other', kind: 'makeshift' })).toBe('not');
    const rings = Object.values(GALLA_RIVALS).map(ringFor);
    for (const r of RIVAL_RINGS) expect(rings.filter(x => x === r).length).toBeGreaterThanOrEqual(2);
  });
});

describe('ax.2 helpers', () => {
  it('counts Tab presses to Pay: 61 with every item a stop, 10 with groups and nothing hidden', () => {
    const parts = Object.values(RAHI_PARTS);
    const pay = Object.keys(RAHI_PARTS).indexOf('pay');
    expect(stopsOf({ n: 36, way: 'arrows' })).toBe(1);
    expect(stopsOf({ n: 6, way: 'none' })).toBe(0);
    expect(tabPresses(parts, pay)).toBe(10);
    expect(tabPresses(parts.map((p, i) => ({ ...p, way: i === 0 ? 'none' as const : 'tab' as const })), pay)).toBe(61);
    expect(tabPresses(parts, 0)).toBe(1);
  });
  it('finds what a control fails to tell a screen reader, and says what it hears', () => {
    expect(srGap({ expect: 'button', role: null, name: null })).toBe('role');
    expect(srGap({ expect: 'button', role: 'button', name: null })).toBe('name');
    expect(srGap({ expect: 'switch', role: 'switch', name: 'AC', needsState: true, state: null })).toBe('state');
    expect(srGap({ expect: 'none', role: 'none', name: null })).toBe('ok');
    expect(announce(RAHI_CONTROLS.search)).toBe('button');
    expect(announce(RAHI_CONTROLS.swap)).toBe('');
    expect(announce(RAHI_CONTROLS.photo)).toBe('');
    expect(announce(RAHI_CONTROLS.heading)).toBe('Choose your seat');
    expect(announce(fixedControl(RAHI_CONTROLS.booked))).toBe('Seat 14, window, button, unavailable');
    expect(announce(fixedControl(RAHI_CONTROLS.ac))).toBe('AC buses only, switch, off');
    expect(announce(fixedControl(RAHI_CONTROLS.heading))).toBe('Choose your seat, heading, level 2');
    for (const c of Object.values(RAHI_CONTROLS)) expect(c.code).toHaveLength(2);
  });
  it('flags form fields and reads them as NVDA would', () => {
    expect(fieldFlaw(RAHI_FIELDS.age)).toBe('label');
    expect(fieldFlaw(RAHI_FIELDS.email)).toBe('error');
    expect(fieldFlaw(RAHI_FIELDS.idnum)).toBe('error');
    expect(fieldFlaw(RAHI_FIELDS.mobile)).toBe('help');
    expect(fieldFlaw(RAHI_FIELDS.pin)).toBe('ok');
    expect(fieldAnnounce(RAHI_FIELDS.age)).toBe('Age, edit, 34');
    expect(fieldAnnounce(RAHI_FIELDS.email)).toBe('Email for your ticket, edit, farhan@gmail');
    expect(fieldAnnounce(RAHI_FIELDS.idnum)).toBe('PAN, to show when you board, edit, ABCD1234F');
    expect(fieldAnnounce(RAHI_FIELDS.pin)).toBe('Pincode, edit, invalid entry, 41100, Pincode must be 6 digits, like 411001');
    for (const l of FORM_FLAWS) expect(Object.values(RAHI_FIELDS).filter(f => fieldFlaw(f) === l).length).toBeGreaterThanOrEqual(2);
  });
  it('lifts load as barriers are removed', () => {
    const all = Object.keys(RAHI_BARRIERS) as RahiBarrier[];
    expect(loadLeft(all, [])).toBe(22);
    expect(loadLeft(all, ['hold', 'final'])).toBe(16);
    expect(loadLeft(all, all)).toBe(0);
    for (const l of COGA_LANES) expect(all.filter(b => RAHI_BARRIERS[b].lane === l).length).toBeGreaterThanOrEqual(2);
    for (const b of all) expect(RAHI_BARRIERS[b].before).not.toBe(RAHI_BARRIERS[b].after);
  });
});

describe('cw.2 helpers', () => {
  it('sets the tone from mood, pushed one step graver by stakes', () => {
    expect(toneFor({ mood: 'good', stakes: 'low' })).toBe('playful');
    expect(toneFor({ mood: 'good', stakes: 'high' })).toBe('warm');
    expect(toneFor({ mood: 'neutral', stakes: 'low' })).toBe('warm');
    expect(toneFor({ mood: 'neutral', stakes: 'high' })).toBe('plain');
    expect(toneFor({ mood: 'bad', stakes: 'low' })).toBe('plain');
    expect(toneFor({ mood: 'bad', stakes: 'high' })).toBe('serious');
    expect(toneGap('playful', 'serious')).toBe(3);
    expect(toneGap('plain', 'plain')).toBe(0);
    const tones = Object.values(CHAABI_MOMENTS).map(toneFor);
    for (const t of TONES) expect(tones.filter(x => x === t)).toHaveLength(2);
    for (const m of Object.values(CHAABI_MOMENTS)) for (const t of TONES) expect(m.lines[t].length).toBeGreaterThan(10);
  });
  it('wraps text word by word', () => {
    expect(wrapText('In your bank by Friday', 10)).toEqual(['In your', 'bank by', 'Friday']);
    expect(wrapLines('Accept and get paid', 14)).toBe(2);
    expect(wrapLines('Accept', 14)).toBe(1);
    expect(wrapText('Bandyopadhyay', 5)).toEqual(['Bandy', 'opadh', 'yay']);
    expect(wrapLines('', 10)).toBe(0);
    expect(slotFits('₹3,200 kept back', 'tile')).toBe(true);
    expect(slotFits('Question a deduction', 'button')).toBe(false);
  });
  it('leaves room for translation, most for short strings', () => {
    expect([5, 10, 11, 20, 30, 50, 70, 71].map(growthFor)).toEqual([1, 1, 0.8, 0.8, 0.6, 0.4, 0.35, 0.3]);
    expect(roomFor(8)).toBe(16);
    expect(roomFor(15)).toBe(27);
    expect(roomFor(100)).toBe(130);
    expect(locParse('40|Rent due in |3| days')).toEqual({ chars: 40, parts: ['Rent due in ', '3', ' days'], text: 'Rent due in 3 days' });
    expect(locFlaw(locParse('40|Rent due in |3| days'))).toBe('pieces');
    expect(locFlaw(locParse('16|Raise a request'))).toBe('room');
    expect(locFlaw(locParse('18|Pay rent'))).toBeNull();
    expect(pseudoLocalize('Pay rent')).toBe('[Páý réñt········]');
    expect(pseudoLocalize('Due {date}')).toBe('[Düé {date}··········]');
    expect(pseudoLocalize('Pay rent').length - 2).toBe(roomFor(8));
  });
});

describe('pr.3 helpers', () => {
  it('groups micro-interaction parts into strips', () => {
    const cards = [
      { id: 'a', lane: 'trigger', visual: 'pay' }, { id: 'b', lane: 'rules', visual: 'pay' }, { id: 'c', lane: 'feedback', visual: 'pay' }, { id: 'd', lane: 'loops', visual: 'pay' },
      { id: 'e', lane: 'trigger', visual: 'refresh' }, { id: 'f', lane: 'trigger', visual: 'refresh' },
    ];
    const s = microStrips(cards);
    expect(s.pay).toEqual({ trigger: ['a'], rules: ['b'], feedback: ['c'], loops: ['d'] });
    expect(microComplete(s.pay)).toBe(true);
    expect(microComplete(s.refresh)).toBe(false);   // two triggers, nothing else
    expect(microComplete(s.roundup)).toBe(false);
  });
  it('changes the Pay button’s feedback as the wait goes on', () => {
    expect([0, 99, 100, 4999, 5000, 29999, 30000, 120000].map(payStage)).toEqual(['press', 'press', 'working', 'working', 'slow', 'slow', 'pending', 'pending']);
    expect(PAY_STAGES.map(s => s.id)).toEqual(['press', 'working', 'slow', 'pending']);
  });
  it('critiques delight in order: tone, then blocking, then frequency', () => {
    expect(delightVerdict({ ms: 900, perMonth: 1, mood: 'bad', playful: true })).toBe('tone');
    expect(delightVerdict({ ms: 300, perMonth: 2, mood: 'bad', playful: false })).toBe('keep');   // a plain, calm failure
    expect(delightVerdict({ ms: 2000, perMonth: 60, blocks: true, mood: 'bad', playful: true })).toBe('tone');   // tone wins
    expect(delightVerdict({ ms: 1500, perMonth: 1, blocks: true, mood: 'good', playful: true })).toBe('blocking');   // even when rare
    expect(delightVerdict({ ms: 250, perMonth: 60, blocks: true, mood: 'good', playful: true })).toBe('keep');   // small enough to sit in front
    expect(delightVerdict({ ms: 1200, perMonth: 60, mood: 'good', playful: true })).toBe('often');
    expect(delightVerdict({ ms: 1200, perMonth: 8, mood: 'good', playful: true })).toBe('keep');   // twice a week is still rare
    expect(delightVerdict({ ms: 300, perMonth: 60, mood: 'good', playful: false })).toBe('keep');
    const lanes = Object.values(GULLAK_MOMENTS).map(delightVerdict);
    for (const l of DELIGHT_LANES) expect(lanes).toContain(l);
  });
  it('costs a flourish in seconds a month', () => {
    expect(delightCost(GULLAK_MOMENTS['pay-confetti'])).toBe(72);
    expect(delightCost(GULLAK_MOMENTS['coin-rain'])).toBe(135);
    expect(delightCost(GULLAK_MOMENTS['goal-burst'])).toBe(0.5);   // 0.45 s, to one decimal
    expect(delightCost(GULLAK_MOMENTS['pull-coin'])).toBe(0);
  });
});

describe('pr.2 helpers', () => {
  it('solves cubic-bezier curves like a browser', () => {
    for (const e of EASES) { expect(bezierAt(EASE_CURVES[e], 0)).toBeCloseTo(0, 5); expect(bezierAt(EASE_CURVES[e], 1)).toBeCloseTo(1, 5); }
    expect(bezierAt(EASE_CURVES.linear, 0.37)).toBeCloseTo(0.37, 6);
    expect(bezierAt([0.25, 0.1, 0.25, 1], 0.5)).toBeCloseTo(0.8024, 3);   // CSS `ease` at half time
    expect(bezierAt(EASE_CURVES.out, 0.25)).toBeGreaterThan(0.6);   // arriving: most of the way there early
    expect(bezierAt(EASE_CURVES.in, 0.25)).toBeLessThan(0.1);   // leaving: barely started
    expect(bezierAt(EASE_CURVES.inout, 0.5)).toBeCloseTo(0.5, 3);   // symmetric
    for (const e of EASES) for (let k = 0; k < 20; k++) expect(bezierAt(EASE_CURVES[e], (k + 1) / 20)).toBeGreaterThanOrEqual(bezierAt(EASE_CURVES[e], k / 20) - 1e-9);
    expect(bezierCss('out')).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
  });
  it('picks the curve from where a motion starts and ends', () => {
    expect([curveFor('off>on'), curveFor('on>off'), curveFor('on>on'), curveFor('loop'), curveFor('finger')]).toEqual(['out', 'in', 'inout', 'linear', 'linear']);
  });
  it('bands durations and judges a tuned one', () => {
    expect([bandOf(80), bandOf(100), bandOf(150), bandOf(300), bandOf(450), bandOf(900)]).toEqual(['instant', 'instant', 'quick', 'standard', 'long', 'slow']);
    expect(durationVerdict(300, 'standard')).toBe('right');
    expect(durationVerdict(40, 'quick')).toBe('fast');
    expect(durationVerdict(700, 'standard')).toBe('slow');
    expect(timingOf('600|sheet')).toEqual({ ms: 600, kind: 'sheet' });
  });
  it('staggers within a budget', () => {
    expect(staggerEnd(20, 40)).toBe(760);
    expect(staggerEnd(1, 40)).toBe(0);
    expect(staggerStep(5)).toBe(40);
    expect(staggerStep(21)).toBe(10);
    expect(staggerEnd(21, staggerStep(21))).toBeLessThanOrEqual(200);
  });
  it('reduces motion without removing meaning', () => {
    expect(reduceFor({ travel: 0, spin: true, auto: true, status: true, meaning: true })).toBe('keep');   // a spinner
    expect(reduceFor({ travel: 300, auto: true, meaning: true })).toBe('stop');   // an autoplaying carousel
    expect(reduceFor({ travel: 390, meaning: true })).toBe('fade');   // a page slide
    expect(reduceFor({ travel: 0, zoom: true, meaning: true })).toBe('fade');   // a zoom
    expect(reduceFor({ travel: 120, parallax: true, meaning: false })).toBe('stop');   // parallax
    expect(reduceFor({ travel: 8, meaning: true })).toBe('keep');   // a small fade-up
    const lanes = Object.values(DABBA_MOTIONS).map(m => reduceFor(m));
    for (const l of REDUCE_LANES) expect(lanes).toContain(l);
  });
});

describe('ds.3 helpers', () => {
  const old = ['isPrimary', 'isTertiary', 'isDanger', 'isSmall', 'isBig', 'isLoading', 'isDisabled', 'hasIcon', 'hasIconRight', 'isRounded', 'color', 'padding'];
  const ep = EPISODES['ds.3-1'];
  const right: ApiDecision[] = ep.game.cards.map(c => ({ old: c.label.split(' · ')[0], visual: c.visual!, kind: c.lane as ApiDecision['kind'] }));
  it('counts the old Button as endless, and its switches alone as 1,024', () => {
    expect(comboCount(apiFrom(right.map(d => ({ ...d, kind: undefined }))))).toBe(Infinity);
    expect(comboCount(apiFrom(right.filter(d => oldPropKind(d.old) === 'boolean').map(d => ({ ...d, kind: undefined }))))).toBe(1024);
    expect(right.map(d => d.old).sort()).toEqual([...old].sort());
  });
  it('builds the clean API from the right calls: 48 looks', () => {
    const api = apiFrom(right);
    expect(comboCount(api)).toBe(48);
    const norm = (a: readonly { name: string; kind: string; options?: string[] }[]) => [...a].map(x => ({ ...x, options: x.options && [...x.options].sort() })).sort((x, y) => x.name.localeCompare(y.name));
    expect(norm(api)).toEqual(norm(BUTTON_API));
  });
  it('punishes the classic mistakes', () => {
    const swap = (old: string, kind: ApiDecision['kind']) => apiFrom(right.map(d => (d.old === old ? { ...d, kind } : d)));
    expect(comboCount(swap('isDanger', 'boolean'))).toBe(72);   // danger as a switch: primary danger is possible again
    expect(swap('isLoading', 'enum').find(p => p.name === 'variant')?.options).toContain('loading');
    expect(comboCount(swap('color', undefined))).toBe(Infinity);
  });
  it('multiplies frames only for variant properties', () => {
    expect(propValues('sm, md,lg')).toEqual(['sm', 'md', 'lg']);
    expect(frameCount([{ visual: 'a,b,c,d', type: 'variant' }, { visual: 'sm,md,lg', type: 'variant' }, { visual: 'on,off', type: 'boolean' }])).toBe(12);
    expect(frameCount([])).toBe(1);
  });
  it('reads at 238 words a minute', () => {
    expect(wordCount('Do: “Renew pass”. Don’t: “OK” — or “Submit”.')).toBe(7);
    expect(readSeconds(Array(238).fill('word').join(' '))).toBe(60);
    expect(readSeconds('')).toBe(0);
  });
});

describe('ds.2 helpers', () => {
  it('chains every component token through a semantic token to a primitive', () => {
    for (const c of Object.keys(COMPONENT)) {
      expect(tierOf(parentOf(c)!)).toBe('semantic');
      expect(tierOf(parentOf(parentOf(c)!)!)).toBe('primitive');
    }
  });
  it('reaches further from a higher tier', () => {
    expect(blastRadius('teal-700')).toEqual(['button-primary-bg', 'tab-indicator-color', 'toggle-on-bg', 'link-color']);
    expect(blastRadius('color-action-primary')).toEqual(['button-primary-bg', 'tab-indicator-color', 'toggle-on-bg']);
    expect(blastRadius('button-radius')).toEqual(['button-radius']);
  });
  it('resolves edits at each tier', () => {
    expect(resolveTokens()['button-primary-bg']).toBe('#0F766E');
    const pongal = resolveTokens({ 'color-action-primary': 'amber-700' });
    expect(pongal['button-primary-bg']).toBe('#B45309');
    expect(pongal['link-color']).toBe('#0F766E');
    expect(resolveTokens({ 'teal-700': '#000000' })['link-color']).toBe('#000000');
  });
  it('tunes every semantic colour: its light value fails at night, its dark value passes, and white or black never would', () => {
    for (const t of Object.keys(MODE_SPECS) as ModeToken[]) {
      expect(darkCheck(t, MODE_SPECS[t].light).ok).toBe(false);
      expect(darkCheck(t, MODE_SPECS[t].dark).ok).toBe(true);
      expect(rampSteps(MODE_SPECS[t].ramp)).toContain(MODE_SPECS[t].dark);
      expect(modeHex(t, 'dark')).toMatch(/^#[0-9A-F]{6}$/);
    }
    expect(darkCheck('color-surface-raised', 800).ok).toBe(true);
    expect(darkCheck('color-surface-raised', 900).ok).toBe(false);
    expect(darkCheck('color-action-primary', 700).ratio).toBeCloseTo(3.24, 1);
  });
  it('finds the first flaw in a token name', () => {
    expect(nameFlaw('color-action-primary-hover')).toBeNull();
    expect(nameFlaw('button-primary-bg')).toBeNull();
    expect(nameFlaw('primaryBtn')).toBe('style');
    expect(nameFlaw('color-teal-new')).toBe('vague');
    expect(nameFlaw('blue2')).toBe('vague');
    expect(nameFlaw('color-grey-light')).toBe('look');
    expect(nameFlaw('hover-color-action-primary')).toBe('order');
    expect(nameFlaw('color-disabled-text')).toBe('order');
    expect(nameWords('cardTitle_color')).toEqual(['card', 'title', 'color']);
  });
});

describe('ui.4 helpers', () => {
  it('writes rupees in Indian grouping, rounded', () => {
    expect(inr(125000)).toBe('₹1,25,000');
    expect(inr(999)).toBe('₹999');
    expect(inr(1250.4)).toBe('₹1,250');
    expect(inr(12345678)).toBe('₹1,23,45,678');
  });
  it('weighs images', () => expect(pageWeight(['photo', 'illus', 'icon', 'none'])).toBe(129));
});

describe('findExercise', () => {
  it('turns episode questions and game cards into valid review picks', () => {
    for (const id of ['quiz.q1', 'ladder.l3', 'gap.gap', 'check.c2', 'game.g5']) {
      const ex = findExercise('fd.1-2', id);
      expect(ex?.type).toBe('pick');
      expect(() => Exercise.parse(ex)).not.toThrow();
    }
    expect(findExercise('fd.1-2', 'o1')?.type).toBe('order');   // classic steps still resolve
    const forged = findExercise('rs.1-3', 'game.r1');
    expect(() => Exercise.parse(forged)).not.toThrow();
    expect(forged?.type === 'pick' && forged.options.find(o => o.id === forged.correct)?.label).toBe('How do people remember to pay bills today, and where does that break down?');
    const button = findExercise('cw.1-2', 'game.r2');
    expect(() => Exercise.parse(button)).not.toThrow();
    expect(button?.type === 'pick' && button.options.find(o => o.id === button.correct)?.label).toBe('Pay ₹450');
    expect(button?.type === 'pick' && button.explanation).toContain('names the action');
    const job = findExercise('rs.2-3', 'game.r1');
    expect(() => Exercise.parse(job)).not.toThrow();
    expect(job?.type === 'pick' && job.prompt).toContain('job story');
    expect(job?.type === 'pick' && job.explanation).toContain('progress wanted');
    const voice = findExercise('br.1-2', 'game.r1');
    expect(voice?.type === 'pick' && voice.explanation).toContain('the alternative it beats');
    const scope = findExercise('pr.1-2', 'game.r1');
    expect(() => Exercise.parse(scope)).not.toThrow();
    expect(scope?.type === 'pick' && scope.options.find(o => o.id === scope.correct)?.label).toBe('Can first-time users change the delivery address after ordering, without help?');
    expect(scope?.type === 'pick' && scope.explanation).toContain('how you’d know it worked');
    expect(findExercise('fd.1-2', 'quiz.nope')).toBeUndefined();
  });
});

describe('episodes', () => {
  for (const [id, ep] of Object.entries(EPISODES)) {
    it(`${id}: valid schema and matches a real lesson`, () => {
      expect(() => Episode.parse(ep)).not.toThrow();
      expect(ep.lessonId).toBe(id);
      expect(lessonById(id)).toBeDefined();
    });
    it(`${id}: every answer and card points at something that exists`, () => {
      const questions = [...ep.check, ep.gap, ...ep.quiz.questions, ...ep.ladder];
      for (const q of questions) expect(q.options.map(o => o.id)).toContain(q.correct);
      const lanes = ep.game.lanes.map(l => l.id);
      for (const c of ep.game.cards) expect(lanes).toContain(c.lane);
      // Every lane gets at least one card, so the game can fill every part of the diamond.
      for (const l of lanes) expect(ep.game.cards.some(c => c.lane === l)).toBe(true);
      if (['swipe-sort', 'myth-pop', 'squint-test', 'chunk-lab', 'flashlight', 'scale-sort', 'question-forge', 'red-pen', 'jargon-swap', 'line-cut', 'glance-test', 'button-forge', 'chat-probe', 'job-forge', 'ask-watch'].includes(ep.game.id)) expect(lanes).toHaveLength(2);   // two-way games
      if (['question-forge', 'button-forge', 'job-forge', 'proto-scope', 'voice-fit'].includes(ep.game.id)) expect(ep.game.rounds?.length).toBeGreaterThan(0);   // the forges need tiles
      if (ep.game.id === 'red-pen') for (const c of ep.game.cards) expect(c.note).toBeTruthy();   // every line gets its explanation
      if (ep.game.id === 'jargon-swap') for (const c of ep.game.cards) if (c.lane === lanes[0]) expect(c.note).toBeTruthy();   // every system label gets its rewrite
      if (ep.game.id === 'crowd-sort') for (const c of ep.game.cards) expect(c.agree).toBeGreaterThan(50);   // the answer is the majority's lane
      if (ep.game.id === 'pattern-fit') for (const l of lanes) expect(['tab', 'side', 'hub', 'step']).toContain(l);   // lanes the game can draw
      if (ep.game.id === 'tree-test') for (const c of ep.game.cards) expect(c.note).toBeTruthy();   // every task shows its path
      if (ep.game.id === 'line-cut') for (const c of ep.game.cards) expect(c.note).toBeTruthy();   // every line gets its reason
      if (ep.game.id === 'spacing-fix') expect(lanes).toEqual(['t', 'm', 'l']);   // the sizes the game animates to
      if (ep.game.id === 'column-span') for (const l of lanes) expect(12 % Number(l)).toBe(0);   // spans that tile a 12-column row
      if (ep.game.id === 'glance-test') for (const c of ep.game.cards) if (c.lane === lanes[0]) expect(c.note).toBeTruthy();   // every unclear line gets a rewrite
      if (ep.game.id === 'error-doctor') { expect(lanes).toEqual(['vague', 'nofix', 'blame', 'good']); for (const c of ep.game.cards) if (c.lane !== 'good') expect(c.note).toBeTruthy(); }   // every bad error gets a better one
      if (ep.game.id === 'empty-match') expect(lanes).toEqual(['first', 'done', 'noresults', 'error']);   // the screens the game draws
      if (ep.game.id === 'script-builder') expect(lanes).toEqual(['open', 'broad', 'deep', 'close']);   // script parts, in order
      if (ep.game.id === 'chat-probe') for (const c of ep.game.cards) { expect(c.visual).toBeTruthy(); if (c.lane === lanes[0]) expect(c.note).toBeTruthy(); }   // a quote to answer; weak follow-ups get a better one
      if (ep.game.id === 'ask-watch') expect(lanes).toEqual(['ask', 'watch']);
      if (ep.game.id === 'rung-sort') expect(lanes).toEqual(['problem', 'outcome', 'output']);   // the three rungs
      if (ep.game.id === 'rice-duel') {   // two well-formed ideas, and the marked lane really wins on RICE
        expect(lanes).toEqual(['a', 'b']);
        for (const c of ep.game.cards) {
          const ideas = riceIdeas(c.visual ?? '');
          expect(ideas).toHaveLength(2);
          for (const i of ideas) for (const n of [i.reach, i.impact, i.confidence, i.effort]) expect(n).toBeGreaterThan(0);
          const [a, b] = ideas.map(riceScore);
          expect(a).not.toBe(b);
          expect(c.lane).toBe(a > b ? 'a' : 'b');
        }
      }
      if (ep.game.id === 'anatomy-pin') expect(lanes).toEqual(['cap', 'x', 'base', 'desc']);   // the lines the game draws
      if (ep.game.id === 'size-it') { expect(lanes).toEqual(['display', 'heading', 'body', 'small']); for (const c of ep.game.cards) expect(['title', 'byline', 'caption', 'section1', 'para1', 'section2', 'para2', 'tabs']).toContain(c.visual); }   // pieces of the screen it draws
      if (ep.game.id === 'pair-judge') {   // fonts the game can set, and a reason for every verdict
        expect(lanes).toEqual(['works', 'clash']);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          if (c.visual === 'five') continue;
          const [h, hw, b, bw] = (c.visual ?? '').split('|');
          for (const f of [h, b]) expect(['serif', 'times', 'sans', 'verdana', 'tahoma', 'script', 'display', 'mono']).toContain(f);
          for (const w of [hw, bw]) expect(Number(w)).toBeGreaterThan(0);
        }
      }
      if (ep.game.id === 'measure-tune') {   // the marked lane is what the numbers say, and only one thing is wrong
        expect(lanes).toEqual(['measure', 'leading', 'ok']);
        for (const c of ep.game.cards) {
          const s = measureSetting(c.visual ?? '');
          expect(c.lane).toBe(measureVerdict(s));
          if (c.lane === 'measure') expect(measureVerdict({ ...s, chars: 60 })).toBe('ok');
        }
      }
      if (ep.game.id === 'hsl-dial') { expect(lanes).toEqual(['h', 's', 'l']); for (const c of ep.game.cards) expect(hslDial(hslChange(c.visual ?? ''))).toBe(c.lane); }   // only the marked dial moves
      if (ep.game.id === 'ramp-pick') { expect(lanes).toEqual(['tint', 'border', 'solid', 'ink']); for (const c of ep.game.cards) expect(['row', 'button', 'badge', 'input', 'banner', 'link', 'heading', 'divider']).toContain(c.visual); }   // zones and elements the game draws
      if (ep.game.id === 'token-route') expect(lanes).toEqual(['error', 'success', 'warning', 'info']);   // the tokens the toast can take
      if (ep.game.id === 'contrast-check') {   // the marked lane is what WCAG says, and no pair sits on a threshold
        expect(lanes).toEqual(['pass', 'large', 'fail']);
        for (const c of ep.game.cards) {
          const [fg, bg] = (c.visual ?? '').split('|');
          for (const hex of [fg, bg]) expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
          const r = contrastRatio(fg, bg);
          expect(c.lane).toBe(contrastLane(r));
          for (const edge of [3, 4.5]) expect(Math.abs(r - edge)).toBeGreaterThan(0.2);
        }
      }
      if (ep.game.id === 'atom-stack') { expect(lanes).toEqual(['atom', 'molecule', 'organism', 'template']); for (const c of ep.game.cards) expect(['icon', 'button', 'label', 'search', 'field', 'avatar', 'header', 'grid', 'layout', 'checkout']).toContain(c.visual); }   // levels and parts the game draws
      if (ep.game.id === 'token-swap') { expect(lanes).toEqual(['color', 'space', 'text', 'radius']); for (const c of ep.game.cards) expect(['button-fill', 'link', 'gap', 'padding', 'title', 'title2', 'button-radius', 'card-radius']).toContain(c.visual); }   // elements the mock binds
      if (ep.game.id === 'debt-hunt') {   // every "matches" button is the same style; every drift really differs and says how
        expect(lanes).toEqual(['debt', 'ok']);
        const style = (c: { visual?: string }) => (c.visual ?? '').split('|').slice(0, 4).join('|');
        const system = new Set(ep.game.cards.filter(c => c.lane === 'ok').map(style));
        expect(system.size).toBe(1);
        for (const c of ep.game.cards) if (c.lane === 'debt') { expect(system.has(style(c))).toBe(false); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'fidelity-pick') expect(lanes).toEqual(['paper', 'wire', 'hifi', 'code']);   // rungs, cheapest first
      if (ep.game.id === 'proto-scope') { expect(lanes).toEqual(['cut', 'keep']); for (const c of ep.game.cards) expect(c.note).toBeTruthy(); }   // every call explained
      if (ep.game.id === 'wire-flow') expect(lanes).toEqual(['navigate', 'overlay', 'back', 'change']);   // actions the game animates
      if (ep.game.id === 'persona-spectrum') {   // a full 3 × 3 matrix: one person per sense and lane
        expect(lanes).toEqual(['perm', 'temp', 'sit']);
        const cells = ep.game.cards.map(c => `${c.visual}:${c.lane}`);
        expect(new Set(cells).size).toBe(9);
        for (const c of ep.game.cards) expect(['touch', 'see', 'hear']).toContain(c.visual);
      }
      if (ep.game.id === 'pour-sort') expect(lanes).toEqual(['p', 'o', 'u', 'r']);   // the four pillars
      if (ep.game.id === 'cvd-fix') { expect(lanes).toEqual(['broken', 'clear']); for (const c of ep.game.cards) { expect(['chart-rg', 'chart-labels', 'dots', 'dots-icons', 'error-border', 'error-message', 'link-colour', 'link-underline', 'heat-rg', 'heat-blue']).toContain(c.visual); expect(c.note).toBeTruthy(); } }
      if (ep.game.id === 'target-spot') { expect(lanes).toEqual(['problem', 'ok']); for (const c of ep.game.cards) { expect(['close-small', 'pay-button', 'links-close', 'focus-ring', 'no-focus', 'stepper', 'tiny-check', 'tabs']).toContain(c.visual); expect(c.note).toBeTruthy(); } }
      if (ep.game.id === 'funnel-leak') {   // the marked step really leaks most, by a clear margin
        expect(lanes).toEqual(['acq', 'act', 'ret', 'rev']);
        for (const c of ep.game.cards) {
          const counts = funnelCounts(c.visual ?? '');
          expect(counts).toHaveLength(5);
          for (let i = 1; i < 5; i++) expect(counts[i]).toBeLessThanOrEqual(counts[i - 1]);
          expect(c.lane).toBe(leakiestStep(counts));
          const r = [...funnelRates(counts)].sort((x, y) => x - y);
          expect(r[1] - r[0]).toBeGreaterThanOrEqual(0.03);
        }
      }
      if (ep.game.id === 'aha-path') { expect(lanes).toEqual(['before', 'later', 'cut']); for (const c of ep.game.cards) expect(c.note).toBeTruthy(); }
      if (ep.game.id === 'fogg-fix') {   // exactly one factor is missing, and it's the marked one
        expect(lanes).toEqual(['motivation', 'ability', 'prompt']);
        for (const c of ep.game.cards) {
          const pt = foggPoint(c.visual ?? '');
          expect(c.lane).toBe(foggMissing(pt));
          const weak = [pt.m <= 3, pt.a <= 3, pt.p === 0].filter(Boolean).length;
          expect(weak).toBe(1);
        }
      }
      if (ep.game.id === 'dark-spot') { expect(lanes).toEqual(['dark', 'fair']); for (const c of ep.game.cards) { expect(['confirmshame', 'decline-plain', 'preticked', 'optin', 'fake-timer', 'real-deadline', 'cancel-call', 'cancel-easy', 'hidden-fee', 'total-upfront']).toContain(c.visual); expect(c.note).toBeTruthy(); } }
      if (ep.game.id === 'brand-layer') expect(lanes).toEqual(['logo', 'identity', 'brand']);   // rings, inside out
      if (ep.game.id === 'voice-fit') { expect(lanes).toEqual(['off', 'on']); for (const c of ep.game.cards) expect(c.note).toBeTruthy(); }
      if (ep.game.id === 'mood-build') { expect(lanes).toEqual(['drop', 'keep']); for (const c of ep.game.cards) { expect(['palette-warm', 'palette-neon', 'type-serif', 'type-grunge', 'photo-sunrise', 'photo-crowd', 'texture-paper', 'texture-glitch', 'icon-line', 'icon-3d']).toContain(c.visual); expect(c.note).toBeTruthy(); } }
      if (ep.game.id === 'model-match') expect(lanes).toEqual(['sub', 'mkt', 'ads', 'free']);
      if (ep.game.id === 'unit-calc') {   // the marked health is what the maths says, and no card sits on a threshold
        expect(lanes).toEqual(['losing', 'risky', 'healthy']);
        for (const c of ep.game.cards) {
          const n = unitNumbers(c.visual ?? '');
          for (const v of [n.price, n.months, n.margin, n.cac]) expect(v).toBeGreaterThan(0);
          const ratio = n.ltv / n.cac;
          expect(c.lane).toBe(unitHealth(ratio));
          for (const edge of [1, 3]) expect(Math.abs(ratio - edge)).toBeGreaterThan(0.15);
        }
      }
      if (ep.game.id === 'buyer-role') expect(lanes).toEqual(['user', 'buyer', 'it', 'proc']);
      if (ep.game.id === 'tag-match') expect(lanes).toEqual(['header', 'nav', 'main', 'footer']);   // page regions
      if (ep.game.id === 'flex-tune') {   // the answer's CSS uses the property its lane names
        expect(lanes).toEqual(['direction', 'justify', 'align', 'gap']);
        const prop: Record<string, string> = { direction: 'flex-direction', justify: 'justify-content', align: 'align-items', gap: 'gap' };
        for (const c of ep.game.cards) expect((c.visual ?? '').startsWith(`${prop[c.lane]}: `)).toBe(true);
      }
      if (ep.game.id === 'fe-flow') expect(lanes).toEqual(['design', 'component', 'data', 'ship']);
      if (ep.game.id === 'case-order') expect(lanes).toEqual(['context', 'process', 'solution', 'outcome']);   // case study sections, in order
      if (ep.game.id === 'portfolio-crit') { expect(lanes).toEqual(['weak', 'strong']); for (const c of ep.game.cards) expect(c.note).toBeTruthy(); }
      if (ep.game.id === 'whiteboard-step') expect(lanes).toEqual(['clarify', 'users', 'ideas', 'measure']);
      if (ep.game.id === 'edge-branch') { expect(lanes).toEqual(['email', 'code', 'password', 'done']); for (const c of ep.game.cards) expect(c.note).toBeTruthy(); }   // flow steps, in order; every branch has a recovery
      if (ep.game.id === 'step-trim') { expect(lanes).toEqual(['cut', 'merge', 'defer', 'keep']); for (const c of ep.game.cards) { expect(c.note).toBeTruthy(); expect((c.visual ?? '').length).toBeGreaterThan(0); expect((c.visual ?? '').length).toBeLessThanOrEqual(10); } expect(ep.game.cards.filter(c => c.lane === 'merge').length).toBeGreaterThanOrEqual(2); }   // a merge needs a partner; strip labels fit
      if (ep.game.id === 'state-pick') {   // the phone draws every state; empty and error need a title, a line and a button, success a title and a line
        expect(lanes).toEqual(['empty', 'loading', 'error', 'success']);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          const parts = (c.visual ?? '').split('|');
          if (c.lane === 'empty' || c.lane === 'error') expect(parts).toHaveLength(3);
          if (c.lane === 'success') expect(parts).toHaveLength(2);
          parts.forEach((x, k) => expect(x.length).toBeLessThanOrEqual([26, 32, 24][k]));   // title (16px bold), line (12px), button: each fits the 240-wide phone
        }
      }
      if (ep.game.id === 'taste-filter') {   // every comment points at a part of the screen the game draws, and both kinds touch more than one part
        expect(lanes).toEqual(['taste', 'reason']);
        for (const c of ep.game.cards) { expect(KOSH_PARTS).toContain(c.visual); expect(c.note).toBeTruthy(); }
        for (const l of lanes) expect(new Set(ep.game.cards.filter(c => c.lane === l).map(c => c.visual)).size).toBeGreaterThan(1);
      }
      if (ep.game.id === 'frame-feedback') {   // every kept thought is rewritten in its frame; binned ones only explain why
        expect(lanes).toEqual(['like', 'wish', 'whatif', 'bin']);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          if (c.lane === 'bin') expect(c.visual).toBeUndefined();
          else expect((c.visual ?? '').startsWith(`${FRAME_LEAD[c.lane as keyof typeof FRAME_LEAD]} `)).toBe(true);
          if (c.lane === 'whatif') expect(c.visual?.endsWith('?')).toBe(true);
        }
      }
      if (ep.game.id === 'calm-reply') { expect(lanes).toEqual(['ask', 'note', 'context']); for (const c of ep.game.cards) { expect(c.visual).toBeTruthy(); expect(c.note).toBeTruthy(); expect(c.note?.startsWith('“')).toBe(true); } }   // a reflex to strike and the words to say instead
      if (ep.game.id === 'affinity-wall') {   // every note is tagged with a real participant, no one twice in a group, and every group holds more than one person
        for (const c of ep.game.cards) { expect(c.visual).toMatch(/^P([1-9]|1[0-2])$/); expect(c.note).toBeTruthy(); }
        for (const l of lanes) {
          const who = ep.game.cards.filter(c => c.lane === l).map(c => c.visual ?? '');
          expect(themeReach(who)).toBe(who.length);
          expect(themeReach(who)).toBeGreaterThan(1);
        }
        expect(participantOf('P12')).toBe(12);
      }
      if (ep.game.id === 'insight-sharpen') {   // every draft is rebuilt as who · what · because; a sharp draft already is that sentence
        expect(lanes).toEqual(['why', 'who', 'fix', 'good']);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          const { who, what, why } = insightParts(c.visual ?? '');
          for (const x of [who, what, why]) expect(x?.trim()).toBeTruthy();
          expect(why.startsWith('because ')).toBe(true);
          if (c.lane === 'good') expect(c.label).toBe(`${who} ${what} ${why}.`);
          else expect(c.label).not.toContain(why);
        }
      }
      if (ep.game.id === 'tool-fit') {   // each card lights a line its tool draws, and every line gets used
        expect(lanes).toEqual(['persona', 'job', 'arch']);
        for (const c of ep.game.cards) { expect(TOOL_PARTS[c.lane as keyof typeof TOOL_PARTS]).toContain(c.visual); expect(c.note).toBeTruthy(); }
        for (const l of lanes) expect(new Set(ep.game.cards.filter(c => c.lane === l).map(c => c.visual))).toEqual(new Set(TOOL_PARTS[l as keyof typeof TOOL_PARTS]));
      }
      if (ep.game.id === 'journey-plot') {   // feelings the curve can plot, and one clear low point
        expect(lanes).toEqual([...JOURNEY_STAGES]);
        for (const c of ep.game.cards) { expect(Number.isInteger(Number(c.visual))).toBe(true); expect(Math.abs(Number(c.visual))).toBeLessThanOrEqual(2); expect(c.note).toBeTruthy(); }
        const f = journeyFeelings(ep.game.cards) as number[];
        const low = journeyLow(ep.game.cards)!, lowF = f[JOURNEY_STAGES.indexOf(low)];
        for (const v of f) if (v !== lowF) expect(v - lowF).toBeGreaterThan(0.3);
        expect(journeyLow([])).toBeNull();
      }
      if (ep.game.id === 'task-fix') {   // a flawed task points at the words that spoil it and gets a quoted rewrite; a fair task has nothing to tap
        expect(lanes).toEqual(['leak', 'steps', 'vague', 'good']);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          if (c.lane === 'good') { expect(c.visual).toBeUndefined(); continue; }
          const span = flawSpan(c.label, c.visual ?? '');
          expect(span).not.toBeNull();
          expect(span![1] - span![0] + 1).toBeLessThan(taskWords(c.label).length);   // never the whole task
          expect(c.note?.startsWith('“')).toBe(true);
        }
        expect(flawSpan('Tap Search now', 'Search later')).toBeNull();
      }
      if (ep.game.id === 'method-pick') {   // headcounts the cost model can price, and the split the lesson teaches: few to moderate, many to measure
        expect(lanes).toEqual(['person', 'remote', 'unmod']);
        for (const c of ep.game.cards) {
          const n = Number(c.visual);
          expect(Number.isInteger(n) && n > 0).toBe(true);
          expect(c.note).toBeTruthy();
          if (c.lane === 'unmod') expect(n).toBeGreaterThanOrEqual(20); else expect(n).toBeLessThanOrEqual(8);
        }
        expect(studyCost('person', 5)).toEqual({ days: 5.5, rupees: 10000 });
        expect(studyCost('unmod', 40).days).toBeLessThan(studyCost('person', 40).days);
      }
      if (ep.game.id === 'severity-rate') {   // the marked rating is what frequency × impact says
        expect(lanes).toEqual([...SEVERITY]);
        for (const c of ep.game.cards) {
          const { users, impact } = findingOf(c.visual ?? '');
          expect(users).toBeGreaterThanOrEqual(1); expect(users).toBeLessThanOrEqual(5);
          expect([1, 2, 3]).toContain(impact);
          expect(c.lane).toBe(severityOf(users, impact));
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'heuristic-sweep') {   // real heuristics, and every screen part used once
        for (const l of lanes) expect(NIELSEN_10.map(h => h.id)).toContain(l);
        const parts = ep.game.cards.map(c => c.visual);
        for (const p of parts) expect(SAFAR_PARTS).toContain(p);
        expect(new Set(parts).size).toBe(parts.length);
        for (const c of ep.game.cards) expect(c.note).toBeTruthy();
      }
      if (ep.game.id === 'fidelity-tidy') {   // every part of the drawn wireframe is decided once, and each kind of call comes up
        expect(lanes).toEqual(['plain', 'real', 'fine']);
        const parts = ep.game.cards.map(c => c.visual);
        for (const p of parts) expect(KHELO_PARTS).toContain(p);
        expect(new Set(parts).size).toBe(parts.length);
        for (const c of ep.game.cards) expect(c.note).toBeTruthy();
      }
      if (ep.game.id === 'grid-place') {   // a page the grid can draw: one full-width block per row, or main with at most one side beside it
        expect(lanes).toEqual(Object.keys(GRID_AREA));
        const rows = new Map<number, string[]>();
        for (const c of ep.game.cards) {
          const r = Number(c.visual);
          expect(Number.isInteger(r) && r >= 1).toBe(true);
          expect(c.note).toBeTruthy();
          rows.set(r, [...(rows.get(r) ?? []), c.lane]);
        }
        for (const ls of rows.values()) {
          if (ls.includes('bleed') || ls.includes('full')) expect(ls).toHaveLength(1);
          else { expect(ls.filter(l => l === 'main')).toHaveLength(1); expect(ls.filter(l => l === 'side').length).toBeLessThanOrEqual(1); }
        }
        const stack = phoneStack(ep.game.cards).map(c => Number(c.visual));
        expect(stack).toEqual([...stack].sort((a, b) => a - b));
        expect(phoneStack([{ lane: 'side', visual: '2' }, { lane: 'main', visual: '2' }, { lane: 'full', visual: '1' }]).map(c => c.lane)).toEqual(['full', 'main', 'side']);
      }
      if (ep.game.id === 'pattern-stamp') {   // patterns the library draws, and every screen of the flow gets built
        expect(lanes).toEqual(['cards', 'chips', 'form', 'sheet']);
        for (const c of ep.game.cards) { expect(KHELO_SCREENS).toContain(c.visual); expect(c.note).toBeTruthy(); }
        expect(new Set(ep.game.cards.map(c => c.visual))).toEqual(new Set(KHELO_SCREENS));
      }
      if (ep.game.id === 'form-triage') {   // every field of the drawn form is triaged once; cut fields cost nothing once fixed, kept ones still take time
        expect(lanes).toEqual([...FORM_LANES]);
        const fields = ep.game.cards.map(c => c.visual);
        expect(new Set(fields)).toEqual(new Set(Object.keys(MANDI_FIELDS)));
        expect(fields).toHaveLength(Object.keys(MANDI_FIELDS).length);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          const [before, after] = MANDI_FIELDS[c.visual as keyof typeof MANDI_FIELDS];
          expect(after).toBeLessThan(before);
          expect(after === 0).toBe(c.lane === 'cut');
        }
        const all = Object.fromEntries(fields.map(f => [f, true]));
        expect(formSeconds(all)).toBeLessThan(formSeconds({}) / 2);
      }
      if (ep.game.id === 'wait-feedback') {   // the marked feedback is what the clock says, and no wait sits near a limit
        expect(lanes).toEqual([...FEEDBACK]);
        for (const c of ep.game.cards) {
          const ms = Number(c.visual);
          expect(ms).toBeGreaterThan(0);
          expect(c.lane).toBe(feedbackFor(ms));
          expect(c.note).toBeTruthy();
          for (const limit of WAIT_LIMITS) expect(Math.abs(Math.log10(ms / limit))).toBeGreaterThan(0.1);
        }
        expect([50, 500, 5000, 50000].map(feedbackFor)).toEqual([...FEEDBACK]);
      }
      if (ep.game.id === 'port-phone') {   // dashboard parts the game draws, each ported once
        expect(lanes).toEqual(['show', 'menu', 'sheet', 'thumb']);
        const parts = ep.game.cards.map(c => c.visual);
        for (const v of parts) expect(PACKING_PARTS).toContain(v);
        expect(new Set(parts).size).toBe(parts.length);
        for (const c of ep.game.cards) expect(c.note).toBeTruthy();
      }
      if (ep.game.id === 'gesture-map') {   // gestures the phone can play, and every gesture beyond a tap has a visible twin
        expect(lanes).toEqual([...GESTURES]);
        for (const c of ep.game.cards) { expect(c.note).toBeTruthy(); if (c.lane !== 'tap') expect(c.visual).toBeTruthy(); }
      }
      if (ep.game.id === 'state-sheet') {   // components and states the sheet can draw, each cell filled at most once
        expect(lanes).toEqual([...KIT_STATES]);
        const cells = ep.game.cards.map(c => `${c.visual}:${c.lane}`);
        expect(new Set(cells).size).toBe(cells.length);
        for (const c of ep.game.cards) { expect(KIT_PARTS).toContain(c.visual); expect(c.note).toBeTruthy(); }
        for (const part of KIT_PARTS) expect(ep.game.cards.some(c => c.visual === part)).toBe(true);
      }
      if (ep.game.id === 'icon-odd') {   // rows of five drawable icons; only a "picture" card's odd one is a wrong metaphor
        expect(lanes).toEqual(['style', 'size', 'meaning', 'label']);
        for (const c of ep.game.cards) {
          const { icons, odd, flaw } = iconRow(c.visual ?? '');
          if (c.lane === 'style' || c.lane === 'size') expect(ICON_FLAWS[c.lane] as readonly string[]).toContain(flaw); else expect(flaw).toBeUndefined();
          expect(icons).toHaveLength(5);
          for (const n of icons) expect(Object.keys(ICONS)).toContain(n);
          expect(Number.isInteger(odd) && odd >= 0 && odd < icons.length).toBe(true);
          const wrong = icons.filter(n => (WRONG_METAPHORS as readonly string[]).includes(n));
          expect(wrong).toEqual(c.lane === 'meaning' ? [icons[odd]] : []);
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'image-budget') {   // the right picks weigh far less than a photo everywhere
        expect(lanes).toEqual([...IMAGE_KINDS]);
        for (const c of ep.game.cards) { expect(c.visual).toBeTruthy(); expect(c.note).toBeTruthy(); }
        expect(pageWeight(ep.game.cards.map(c => c.lane))).toBeLessThan(pageWeight(ep.game.cards.map(() => 'photo')) / 2);
      }
      if (ep.game.id === 'table-build') {   // every part of the drawn table is fixed once
        expect(lanes).toEqual(['align', 'format', 'stress', 'cut']);
        const parts = ep.game.cards.map(c => c.visual);
        expect(new Set(parts)).toEqual(new Set(LEDGER_PARTS));
        expect(parts).toHaveLength(LEDGER_PARTS.length);
        for (const c of ep.game.cards) expect(c.note).toBeTruthy();
      }
      if (ep.game.id === 'tier-edit') {   // each request edits one real token in its lane's tier; going a tier up reaches further
        expect(lanes).toEqual([...TOKEN_TIERS]);
        for (const c of ep.game.cards) {
          const [token, to] = (c.visual ?? '').split(':');
          expect(tierOf(token)).toBe(c.lane);
          expect(to).toBeTruthy();
          expect(c.note).toBeTruthy();
          const before = resolveTokens(), after = resolveTokens({ [token]: to });
          expect(blastRadius(token).every(k => before[k] !== after[k])).toBe(true);
          if (c.lane === 'component') expect(blastRadius(parentOf(token)!).length).toBeGreaterThan(blastRadius(token).length);
          if (c.lane === 'semantic') expect(blastRadius(parentOf(token)!).length).toBeGreaterThanOrEqual(blastRadius(token).length);
        }
        for (const tier of TOKEN_TIERS) expect(ep.game.cards.filter(c => c.lane === tier).length).toBeGreaterThanOrEqual(2);
      }
      if (ep.game.id === 'mode-tune') {   // every card is a tunable semantic colour, each used once
        expect(lanes).toEqual(['surface', 'text', 'accent', 'border']);
        const tokens = ep.game.cards.map(c => c.visual);
        expect(new Set(tokens).size).toBe(tokens.length);
        for (const c of ep.game.cards) { expect(Object.keys(MODE_SPECS)).toContain(c.visual); expect(c.label.startsWith(c.visual!)).toBe(true); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'token-rename') {   // the bad name has exactly the flaw of its lane, the good name has none
        expect(lanes).toEqual([...NAME_FLAWS]);
        for (const c of ep.game.cards) {
          expect(nameFlaw(badName(c.label))).toBe(c.lane);
          expect(nameFlaw(c.visual ?? 'X')).toBeNull();
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'api-build') {   // every old prop becomes what its lane says, and the right calls give the clean API
        expect(lanes).toEqual([...API_KINDS]);
        for (const c of ep.game.cards) {
          const [old] = c.label.split(' · '), v = c.visual ?? '';
          expect(c.note).toBeTruthy();
          if (c.lane === 'enum') expect(v).toMatch(/^(variant|size)=[a-z]+$/);
          if (c.lane === 'boolean') { expect(v).toBe(old); expect(oldPropKind(old)).toBe('boolean'); }
          if (c.lane === 'slot') expect(BUTTON_API.find(p => p.name === v)?.kind).toBe('slot');
          if (c.lane === 'fixed') expect(['variant', 'size', ...Object.keys(COMPONENT)]).toContain(v);
        }
      }
      if (ep.game.id === 'prop-type') {   // only variant properties multiply, and anything else made a variant would multiply too
        expect(lanes).toEqual([...PROP_TYPES]);
        for (const c of ep.game.cards) { expect(propValues(c.visual ?? '').length).toBeGreaterThanOrEqual(2); expect(c.note).toBeTruthy(); }
        expect(frameCount(ep.game.cards.map(c => ({ visual: c.visual, type: c.lane })))).toBe(60);
      }
      if (ep.game.id === 'focus-path') {   // every part of the page once, in page order, reached the way it should be
        expect(lanes).toEqual([...KEY_WAYS]);
        expect(ep.game.cards.map(c => c.visual)).toEqual(Object.keys(RAHI_PARTS));
        for (const c of ep.game.cards) { expect(c.lane).toBe(RAHI_PARTS[c.visual as RahiPart].way); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'sr-listen') {   // every control once, sorted by what it fails to tell a screen reader, and its fix says it all
        expect(lanes).toEqual([...SR_GAPS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(RAHI_CONTROLS).sort());
        for (const c of ep.game.cards) {
          const ctl = RAHI_CONTROLS[c.visual as keyof typeof RAHI_CONTROLS];
          expect(c.lane).toBe(srGap(ctl));
          expect(srGap(fixedControl(ctl))).toBe('ok');
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'form-tab') {   // every field once, in Tab order, flagged as fieldFlaw says
        expect(lanes).toEqual([...FORM_FLAWS]);
        expect(ep.game.cards.map(c => c.visual)).toEqual(Object.keys(RAHI_FIELDS));
        for (const c of ep.game.cards) { expect(c.lane).toBe(fieldFlaw(RAHI_FIELDS[c.visual as keyof typeof RAHI_FIELDS])); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'load-lift') {   // every barrier once, under the habit that removes it
        expect(lanes).toEqual([...COGA_LANES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(RAHI_BARRIERS).sort());
        for (const c of ep.game.cards) { expect(c.lane).toBe(RAHI_BARRIERS[c.visual as RahiBarrier].lane); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'demo-build') {   // every moment once, written out; the shown ones make the one clean demo
        expect(lanes).toEqual(['show', 'skip']);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SUNRISE_MOMENTS).sort());
        for (const c of ep.game.cards) { expect(c.label).toBe(SUNRISE_MOMENTS[c.visual as SunriseMoment].text); expect(c.note).toBeTruthy(); }
        expect(demoFlaws(ep.game.cards.filter(c => c.lane === 'show').map(c => SUNRISE_MOMENTS[c.visual as SunriseMoment]))).toEqual([]);
      }
      if (ep.game.id === 'plan-pick') {   // every buyer once, on the plan that covers them for least
        expect(lanes).toEqual([...PLAN_IDS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(PARCHA_BUYERS).sort());
        for (const c of ep.game.cards) { const b = PARCHA_BUYERS[c.visual as ParchaBuyer]; expect(c.lane).toBe(planFor(b)); expect(c.label).toContain(b.name); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'signal-route') {   // every theme once, on its route
        expect(lanes).toEqual([...ROUTES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(PARCHA_SIGNALS).sort());
        for (const c of ep.game.cards) { const s = PARCHA_SIGNALS[c.visual as ParchaSignal]; expect(c.lane).toBe(s.route); expect(c.label).toContain(s.text); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'spec-write') {   // every handoff line once, written out, where it belongs
        expect(lanes).toEqual([...SPEC_SOURCES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(GAADI_SPEC).sort());
        for (const c of ep.game.cards) { const i = GAADI_SPEC[c.visual as GaadiSpecItem]; expect(c.label).toBe(i.text); expect(c.lane).toBe(i.source); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'qa-pass') {   // every finding once, in the lane the rule gives
        expect(lanes).toEqual([...QA_LANES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(GAADI_QA).sort());
        for (const c of ep.game.cards) { const q = GAADI_QA[c.visual as GaadiQa]; expect(c.lane).toBe(qaLane(q)); expect(c.label).toContain(q.actual); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'token-trace') {   // every line of code once, in the lane the lint reads
        expect(lanes).toEqual([...REF_KINDS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(GAADI_CODE).sort());
        for (const c of ep.game.cards) { const l = GAADI_CODE[c.visual as GaadiCode]; expect(c.lane).toBe(refKind(l.code)); expect(c.label).toContain(l.code); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'ai-delegate') {   // every task once, written out, in the lane the rule gives
        expect(lanes).toEqual([...AI_ROLES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(HISAAB_TASKS).sort());
        for (const c of ep.game.cards) { const t = HISAAB_TASKS[c.visual as HisaabTask]; expect(c.label).toBe(t.text); expect(c.lane).toBe(aiRole(t)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'guess-flag') {   // every field once, with its read and confidence, treated as the rule says
        expect(lanes).toEqual([...FIELD_TREATMENTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(HISAAB_FIELDS).sort());
        for (const c of ep.game.cards) { const k = c.visual as HisaabField; const f = HISAAB_FIELDS[k]; expect(c.lane).toBe(fieldTreatment(k)); expect(c.label).toContain(f.read); expect(c.label).toContain(`${Math.round(f.conf * 100)}%`); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'eval-fix') {   // every test question once, with its bad reply, fixed where it belongs
        expect(lanes).toEqual([...PROMPT_PARTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(HISAAB_EVALS).sort());
        for (const c of ep.game.cards) { const e = HISAAB_EVALS[c.visual as HisaabCase]; expect(c.lane).toBe(e.fix); expect(c.label).toContain(e.ask); expect(c.label).toContain(e.bad); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'ceremony-route') {   // every sprint item once, with its day, raised where the rule says
        expect(lanes).toEqual([...CEREMONIES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(RASOI_ITEMS).sort());
        for (const c of ep.game.cards) { const i = RASOI_ITEMS[c.visual as RasoiItem]; expect(c.lane).toBe(ceremonyFor(i)); expect(c.label).toContain(i.text); expect(c.label).toContain(`Day ${i.day}`); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'room-read') {   // every workshop moment once, in minute order, met with the right move
        expect(lanes).toEqual([...MOVES]);
        expect(ep.game.cards.map(c => c.visual)).toEqual(Object.keys(RASOI_MOMENTS));
        for (const c of ep.game.cards) { const m = RASOI_MOMENTS[c.visual as RasoiMoment]; expect(c.lane).toBe(moveFor(m)); expect(c.label).toContain(m.text); expect(c.label).toContain(`Minute ${m.minute}`); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'sprint-fit') {   // every question once, written out, with the call the rule gives
        expect(lanes).toEqual([...SPRINT_CALLS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(RASOI_QUESTIONS).sort());
        for (const c of ep.game.cards) { const q = RASOI_QUESTIONS[c.visual as RasoiQuestion]; expect(c.label).toBe(q.text); expect(c.lane).toBe(sprintCall(q)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'matrix-read') {   // every open decision once, read the way the matrix says
        expect(lanes).toEqual([...MATRIX_CALLS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(HAAT_DECISIONS).sort());
        for (const c of ep.game.cards) { const d = HAAT_DECISIONS[c.visual as HaatDecision]; expect(c.label).toBe(d.text); expect(c.lane).toBe(matrixCall(d)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'principle-test') {   // every draft once, judged by the opposite test and the live disputes
        expect(lanes).toEqual([...PRINCIPLE_VERDICTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(HAAT_PRINCIPLES).sort());
        for (const c of ep.game.cards) { const pr = HAAT_PRINCIPLES[c.visual as HaatPrinciple]; expect(c.label).toBe(pr.text); expect(c.lane).toBe(principleVerdict(pr)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'rule-call') {   // every request once, called by floors, reasons and how often
        expect(lanes).toEqual([...RULE_CALLS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(HAAT_BREAKS).sort());
        for (const c of ep.game.cards) { const b = HAAT_BREAKS[c.visual as HaatBreak]; expect(c.label).toBe(b.text); expect(c.lane).toBe(ruleCall(b)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'survey-spot') {   // every draft item once, its question written out, flagged at the part that's broken
        expect(lanes).toEqual([...SURVEY_PARTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(BOLO_ITEMS).sort());
        for (const c of ep.game.cards) { const i = BOLO_ITEMS[c.visual as BoloItem]; expect(c.label).toBe(i.stem); expect(c.lane).toBe(surveyFlaw(i)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'gap-read') {   // every gap once, read the way its interval says
        expect(lanes).toEqual([...GAP_CALLS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(BOLO_GAPS).sort());
        for (const c of ep.game.cards) {
          const g = BOLO_GAPS[c.visual as BoloGap];
          expect(c.label).toBe(g.text); expect(c.lane).toBe(gapCall(g)); expect(c.note).toBeTruthy();
          expect(gapInterval(g).half * 100).toBeLessThan(MARGIN_MAX);   // the dial can reach the true margin
          const quoted = [...c.note!.matchAll(/± (\d+(?:\.\d)?)/g)].map(m => Number(m[1]));
          expect(quoted.length).toBeGreaterThan(0);
          for (const m of quoted) expect(Math.abs(m - gapInterval(g).half * 100)).toBeLessThan(0.55);   // the note quotes the real margin, rounded
        }
      }
      if (ep.game.id === 'signal-gate') {   // every dashboard number once, stopped at the gate the rule gives
        expect(lanes).toEqual([...GATES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(BOLO_SIGNALS).sort());
        for (const c of ep.game.cards) { const s = BOLO_SIGNALS[c.visual as BoloSignal]; expect(c.label).toBe(s.text); expect(c.lane).toBe(signalGate(s)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'source-triangle') {   // every memo claim once, weighed by say, do and disagreement
        expect(lanes).toEqual([...WEIGHTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(BOLO_CLAIMS).sort());
        for (const c of ep.game.cards) { const cl = BOLO_CLAIMS[c.visual as BoloClaim]; expect(c.label).toBe(cl.text); expect(c.lane).toBe(triangulate(cl)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'roadmap-slot') {   // every request once, slotted by its decision, and every scheduled study drawable on the half
        expect(lanes).toEqual([...SLOTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(MUSAFIR_REQUESTS).sort());
        for (const c of ep.game.cards) {
          const r = MUSAFIR_REQUESTS[c.visual as MusafirRequest];
          expect(c.label).toBe(r.text); expect(c.lane).toBe(roadmapSlot(r)); expect(c.note).toBeTruthy();
          if (c.lane === 'q1' || c.lane === 'q2') expect(studyWeeks(r)![0]).toBeGreaterThanOrEqual(1);
        }
      }
      if (ep.game.id === 'atom-build') {   // every note once, filed where its level, source and links put it
        expect(lanes).toEqual([...ATOM_LANES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(MUSAFIR_ATOMS).sort());
        for (const c of ep.game.cards) { const k = c.visual as MusafirAtom; expect(c.label).toBe(MUSAFIR_ATOMS[k].text); expect(c.lane).toBe(atomLane(k)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'plan-critique') {   // every plan once, given the support its riskiest line needs
        expect(lanes).toEqual([...SUPPORT]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(MUSAFIR_PLANS).sort());
        for (const c of ep.game.cards) { const pl = MUSAFIR_PLANS[c.visual as MusafirPlan]; expect(c.label).toBe(pl.text); expect(c.lane).toBe(support(pl)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'blueprint-build') {   // every step once, in time order, in the row the customer's view puts it
        expect(lanes).toEqual([...BLUEPRINT_ROWS]);
        expect(ep.game.cards.map(c => c.visual)).toEqual(Object.keys(NABZ_STEPS));
        for (const c of ep.game.cards) { const s = NABZ_STEPS[c.visual as NabzStep]; expect(c.label).toBe(s.text); expect(c.lane).toBe(blueprintRow(s)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'role-swim') {   // every step once, in workflow order, owned by the role the data and limits say
        expect(lanes).toEqual([...NABZ_ROLES]);
        expect(ep.game.cards.map(c => c.visual)).toEqual(Object.keys(NABZ_DUTIES));
        for (const c of ep.game.cards) { const d = NABZ_DUTIES[c.visual as NabzDuty]; expect(c.label).toBe(d.text); expect(c.lane).toBe(dutyOwner(d)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'scale-dial') {   // every screen once, given the pattern its job needs at its size
        expect(lanes).toEqual([...SCALE_PATTERNS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(NABZ_TASKS).sort());
        for (const c of ep.game.cards) { const t = NABZ_TASKS[c.visual as NabzTask]; expect(c.label).toBe(t.text); expect(c.lane).toBe(scalePattern(t)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'optical-nudge') {   // every case once, given the correction its shape and edge need
        expect(lanes).toEqual([...OPTICAL_FIXES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(BUNKAR_CASES).sort());
        for (const c of ep.game.cards) { const o = BUNKAR_CASES[c.visual as BunkarCase]; expect(c.label).toBe(o.text); expect(c.lane).toBe(opticalFix(o)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'elevation-lift') {   // every surface once, at the height its behaviour gives it
        expect(lanes).toEqual([...ELEVATIONS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(BUNKAR_SURFACES).sort());
        for (const c of ep.game.cards) { const sf = BUNKAR_SURFACES[c.visual as BunkarSurface]; expect(c.label).toBe(sf.text); expect(c.lane).toBe(elevationOf(sf)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'detail-loupe') {   // every detail once, in the check it fails; only shipped details have no fix
        expect(lanes).toEqual([...CRAFT_CHECKS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(BUNKAR_DETAILS).sort());
        for (const c of ep.game.cards) { const d = BUNKAR_DETAILS[c.visual as BunkarDetail]; expect(c.label).toBe(d.text); expect(c.lane).toBe(craftCheck(d)); expect(craftFix(d) === null).toBe(c.lane === 'ship'); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'chart-pick') {   // every question once, given the form its task needs
        expect(lanes).toEqual([...CHART_FORMS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(ROSHNI_QUESTIONS).sort());
        for (const c of ep.game.cards) { const q = ROSHNI_QUESTIONS[c.visual as RoshniQuestion]; expect(c.label).toBe(q.text); expect(c.lane).toBe(chartFor(q)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'palette-tune') {   // every chart once, given the job its colour should do
        expect(lanes).toEqual([...PALETTE_JOBS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(ROSHNI_CHARTS).sort());
        for (const c of ep.game.cards) { const ch = ROSHNI_CHARTS[c.visual as RoshniChart]; expect(c.label).toBe(ch.text); expect(c.lane).toBe(paletteFor(ch)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'dash-critique') {   // every tile once, with the verdict Manoj's decision gives it
        expect(lanes).toEqual([...TILE_VERDICTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(ROSHNI_TILES).sort());
        for (const c of ep.game.cards) { const t = ROSHNI_TILES[c.visual as RoshniTile]; expect(c.label).toBe(t.text); expect(c.lane).toBe(tileVerdict(t)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'contribution-route') {   // every request once, routed by need
        expect(lanes).toEqual([...CONTRIBUTION_PATHS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(RASTA_REQUESTS).sort());
        for (const c of ep.game.cards) { const r = RASTA_REQUESTS[c.visual as RastaRequest]; expect(c.label).toBe(r.text); expect(c.lane).toBe(contributionPath(r)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'release-plan') {   // every change once, bumped by what it does to consumers
        expect(lanes).toEqual([...VERSION_BUMPS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(RASTA_CHANGES).sort());
        for (const c of ep.game.cards) { const ch = RASTA_CHANGES[c.visual as RastaChange]; expect(c.label).toBe(ch.text); expect(c.lane).toBe(bumpFor(ch)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'adoption-read') {   // every squad's scan once, with the diagnosis it reads as
        expect(lanes).toEqual([...ADOPTION_READS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(RASTA_SCANS).sort());
        for (const c of ep.game.cards) { const sc = RASTA_SCANS[c.visual as RastaScan]; expect(c.label).toBe(sc.text); expect(c.lane).toBe(adoptionRead(sc)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'brand-tune') {   // every one of Meera's requests once, themed, tuned or kept shared
        expect(lanes).toEqual([...BRAND_CALLS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SAWARI_REQUESTS).sort());
        for (const c of ep.game.cards) { const r = SAWARI_REQUESTS[c.visual as SawariRequest]; expect(c.label).toBe(r.text); expect(c.lane).toBe(brandCall(r)); expect(c.note).toBeTruthy(); if (c.lane === 'tune') expect(passingSteps(r.tune!).length).toBeGreaterThan(0); }
      }
      if (ep.game.id === 'parity-sort') {   // every booking-flow decision once, by how it may differ across platforms
        expect(lanes).toEqual([...PARITY_CALLS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SAWARI_DECISIONS).sort());
        for (const c of ep.game.cards) { const d = SAWARI_DECISIONS[c.visual as SawariDecision]; expect(c.label).toBe(d.text); expect(c.lane).toBe(parityCall(d)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'sync-flow') {   // every drift once, sent the way its source says
        expect(lanes).toEqual([...SYNC_MOVES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SAWARI_DRIFTS).sort());
        for (const c of ep.game.cards) { const d = SAWARI_DRIFTS[c.visual as SawariDrift]; expect(c.label).toBe(d.text); expect(c.lane).toBe(syncMove(d)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'story-strip') {   // every beat once, written out, on its part of the spine
        expect(lanes).toEqual([...PITCH_PARTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SAMAN_BEATS).sort());
        for (const c of ep.game.cards) { const b = SAMAN_BEATS[c.visual as SamanBeat]; expect(c.label).toBe(b.text); expect(c.lane).toBe(b.part); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'objection-reply') {   // every objection once, under its worry, with one reply that lands
        expect(lanes).toEqual([...OBJECTION_KINDS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SAMAN_OBJECTIONS).sort());
        for (const c of ep.game.cards) { const o = SAMAN_OBJECTIONS[c.visual as SamanObjection] as Objection; expect(c.lane).toBe(o.kind); expect(c.label).toContain(o.text); expect(o.replies.filter(r => replyFlaw(r) === null)).toHaveLength(1); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'summary-build') {   // every sentence of the update once, in its part of the summary
        expect(lanes).toEqual([...SUMMARY_PARTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SAMAN_UPDATE).sort());
        for (const c of ep.game.cards) { const l = SAMAN_UPDATE[c.visual as SamanLine]; expect(c.label).toBe(l.text); expect(c.lane).toBe(l.part); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'page-stack') {   // every section once, in the zone whose question it answers
        expect(lanes).toEqual([...PAGE_ZONES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SUKOON_SECTIONS).sort());
        for (const c of ep.game.cards) { const s = SUKOON_SECTIONS[c.visual as SukoonSection]; expect(c.label).toBe(s.text); expect(c.lane).toBe(s.zone); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'copy-swap') {   // every draft once, written as drafted, in its slot, with something to fix
        expect(lanes).toEqual([...HERO_SLOTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SUKOON_DRAFTS).sort());
        for (const c of ep.game.cards) { const d = SUKOON_DRAFTS[c.visual as SukoonDraft] as CopyDraft; expect(c.label).toBe(copyLine(d, d.segments.map(() => 0))); expect(c.lane).toBe(d.slot); expect(copyFlaws(c.label, d.slot).length).toBeGreaterThan(0); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'asset-fit') {   // every asset once, in its format
        expect(lanes).toEqual([...ASSET_FORMATS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SUKOON_ASSETS).sort());
        for (const c of ep.game.cards) { const a = SUKOON_ASSETS[c.visual as SukoonAsset]; expect(c.label).toBe(a.text); expect(c.lane).toBe(a.format); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'serp-spot') {   // every issue on the page once, in the area it lives in
        expect(lanes).toEqual([...SEO_AREAS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual([...seoIssues(SUKOON_SEO_BEFORE)].sort());
        for (const c of ep.game.cards) { expect(c.lane).toBe(SEO_AREA_OF[c.visual as SeoIssue]); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'logo-stress') {   // every mark once, in the first test markVerdict finds it fails
        expect(lanes).toEqual([...MARK_VERDICTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SUKOON_MARKS).sort());
        for (const c of ep.game.cards) { const m = SUKOON_MARKS[c.visual as SukoonMark]; expect(c.label).toBe(m.text); expect(c.lane).toBe(markVerdict(m)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'kit-pick') {   // every option once, in its slot, one that fits per slot
        expect(lanes).toEqual([...KIT_SLOTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SUKOON_KIT).sort());
        for (const c of ep.game.cards) { const o = SUKOON_KIT[c.visual as SukoonKitKey]; expect(c.lane).toBe(o.slot); expect(c.label).toContain(o.name); expect(c.note).toBeTruthy(); }
        for (const l of KIT_SLOTS) expect(ep.game.cards.filter(c => c.lane === l && kitFlaw(SUKOON_KIT[c.visual as SukoonKitKey] as KitOption) === null)).toHaveLength(1);
      }
      if (ep.game.id === 'guide-build') {   // every piece once, in the section whose rule it breaks
        expect(lanes).toEqual([...GUIDE_SECTIONS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(SUKOON_USES).sort());
        for (const c of ep.game.cards) { const u = SUKOON_USES[c.visual as SukoonUse]; expect(c.label).toBe(u.text); expect(c.lane).toBe(sectionBroken(u)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'hypo-fix') {   // every hypothesis once, written out in full, in the part hypoFlaw finds weak
        expect(lanes).toEqual([...HYPO_PARTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(TOKRI_HYPOS).sort());
        for (const c of ep.game.cards) { const h = TOKRI_HYPOS[c.visual as TokriHypo]; expect(c.label).toBe(hypoText(h)); expect(c.lane).toBe(hypoFlaw(h)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'sample-dial') {   // every plan once, in the verdict its worked-out length gives
        expect(lanes).toEqual([...PLAN_VERDICTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(TOKRI_PLANS).sort());
        for (const c of ep.game.cards) { const p = TOKRI_PLANS[c.visual as TokriPlan]; expect(c.label).toBe(p.text); expect(c.lane).toBe(planVerdict(planTest(p).weeks)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'result-read') {   // every readout once, in the call readCall makes from its counts
        expect(lanes).toEqual([...READ_CALLS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(TOKRI_RESULTS).sort());
        for (const c of ep.game.cards) { const r = TOKRI_RESULTS[c.visual as TokriResult] as TestRead; expect(c.label).toBe(r.text); expect(c.lane).toBe(readCall(r).call); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'cue-timeline') {   // every tip once, on the first moment cueFor finds for it
        expect(lanes).toEqual(Object.keys(KAKSHA_MOMENTS));
        for (const l of ep.game.lanes) expect(l.label).toBe(KAKSHA_MOMENTS[l.id as keyof typeof KAKSHA_MOMENTS].label);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(KAKSHA_TIPS).sort());
        for (const c of ep.game.cards) { const t = KAKSHA_TIPS[c.visual as KakshaTip]; expect(c.label).toBe(t.text); expect(c.lane).toBe(cueFor(t.needs)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'empty-build') {   // every piece once, in its slot
        expect(lanes).toEqual([...EMPTY_SLOTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(EMPTY_PIECES).sort());
        for (const c of ep.game.cards) { const p = EMPTY_PIECES[c.visual as EmptyPieceId]; expect(c.label).toBe(p.text); expect(c.lane).toBe(p.slot); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'paywall-timing') {   // every moment once, in the move upgradeMove gives it
        expect(lanes).toEqual([...UPGRADE_MOVES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(PRO_MOMENTS).sort());
        for (const c of ep.game.cards) { const m = PRO_MOMENTS[c.visual as ProMomentId]; expect(c.label).toBe(m.text); expect(c.lane).toBe(upgradeMove(m)); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'metric-flow') {   // every metric once, named in full, in the role metricRole gives it
        expect(lanes).toEqual([...METRIC_ROLES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(KAHAANI_METRICS).sort());
        for (const c of ep.game.cards) {
          const m = KAHAANI_METRICS[c.visual as KahaaniMetric];
          expect(c.label).toBe(m.name);
          expect(c.lane).toBe(metricRole(m));
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'heart-grid') {   // every plan line once, in the part gsmPart reads from its words
        expect(lanes).toEqual([...GSM_PARTS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(AWAAZ_HEART).sort());
        for (const c of ep.game.cards) {
          const l = AWAAZ_HEART[c.visual as AwaazLine];
          expect(c.label).toBe(l.text);
          expect(c.lane).toBe(gsmPart(l.text));
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'cohort-read') {   // every ask once, in the view that answers it, with an answer to estimate
        expect(lanes).toEqual([...DATA_VIEWS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(KAHAANI_ASKS).sort());
        for (const c of ep.game.cards) {
          const a = KAHAANI_ASKS[c.visual as KahaaniAsk];
          expect(c.lane).toBe(a.view);
          expect(askValue(a)).toBeGreaterThan(0);
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'event-wire') {   // every question once, on the event that answers it
        expect(lanes).toEqual(Object.keys(KAHAANI_EVENTS));
        for (const l of ep.game.lanes) expect(l.hint).toBe(KAHAANI_EVENTS[l.id as KahaaniEvent].trigger);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(TRACK_QUESTIONS).sort());
        for (const c of ep.game.cards) { expect(c.lane).toBe(TRACK_QUESTIONS[c.visual as TrackQuestion].event); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'vision-postcard') {   // a line is cut exactly when the machine can fault it, and every part of the story gets lines
        expect(lanes).toEqual([...VISION_PARTS]);
        for (const c of ep.game.cards) { expect(visionFlaw(c.label) !== null).toBe(c.lane === 'cut'); expect(c.note).toBeTruthy(); }
        for (const l of VISION_PARTS) expect(ep.game.cards.filter(c => c.lane === l).length).toBeGreaterThanOrEqual(2);
        expect(new Set(ep.game.cards.filter(c => c.lane === 'cut').map(c => visionFlaw(c.label))).size).toBe(3);
      }
      if (ep.game.id === 'horizon-board') {   // every bet once, named by its problem, in the column horizonFor gives it
        expect(lanes).toEqual([...HORIZONS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(GALLA_BETS).sort());
        for (const c of ep.game.cards) {
          const bet = GALLA_BETS[c.visual as GallaBet];
          expect(c.label).toBe(bet.problem);
          expect(c.lane).toBe(horizonFor(bet, GALLA_BETS));
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'rival-map') {   // every rival once, on the ring ringFor gives it
        expect(lanes).toEqual([...RIVAL_RINGS]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(GALLA_RIVALS).sort());
        for (const c of ep.game.cards) {
          const r = GALLA_RIVALS[c.visual as GallaRival];
          expect(c.label).toBe(r.name);
          expect(c.lane).toBe(ringFor(r));
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'tone-dial') {   // every moment once, at the tone its mood and stakes call for
        expect(lanes).toEqual([...TONES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(CHAABI_MOMENTS).sort());
        for (const c of ep.game.cards) { expect(c.lane).toBe(toneFor(CHAABI_MOMENTS[c.visual as keyof typeof CHAABI_MOMENTS])); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'question-flow') {   // every screen gets content, and the lorem layout can't hold most of it
        expect(lanes).toEqual([...FLOW_QUESTIONS]);
        for (const q of FLOW_QUESTIONS) expect(ep.game.cards.some(c => c.lane === q)).toBe(true);
        for (const c of ep.game.cards) { expect(Object.keys(LOREM_SLOTS)).toContain(c.visual); expect(c.note).toBeTruthy(); }
        const over = ep.game.cards.filter(c => !slotFits(c.label, c.visual as LoremSlot)).length;
        expect(over).toBeGreaterThan(ep.game.cards.length / 2);
        expect(over).toBeLessThan(ep.game.cards.length);
      }
      if (ep.game.id === 'loc-spot') {   // the machine catches joined pieces and boxes that can't grow, and only those
        expect(lanes).toEqual([...LOC_LANES]);
        for (const c of ep.game.cards) {
          const flaw = locFlaw(locParse(c.visual ?? ''));
          expect(flaw).toBe(c.lane === 'pieces' || c.lane === 'room' ? c.lane : null);
          expect(locParse(c.visual ?? '').chars).toBeGreaterThan(0);
          expect(c.note).toBeTruthy();
        }
        for (const l of LOC_LANES) expect(ep.game.cards.filter(c => c.lane === l).length).toBeGreaterThanOrEqual(2);
      }
      if (ep.game.id === 'micro-build') {   // every micro-interaction gets exactly one card for each part
        expect(lanes).toEqual([...MICRO_PARTS]);
        const strips = microStrips(ep.game.cards);
        expect(Object.keys(strips).sort()).toEqual([...GULLAK_MICROS].sort());
        for (const m of GULLAK_MICROS) expect(microComplete(strips[m])).toBe(true);
        for (const c of ep.game.cards) expect(c.note).toBeTruthy();
      }
      if (ep.game.id === 'delight-judge') {   // every playful moment once, judged by the rule
        expect(lanes).toEqual([...DELIGHT_LANES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(GULLAK_MOMENTS).sort());
        for (const c of ep.game.cards) { expect(c.lane).toBe(delightVerdict(GULLAK_MOMENTS[c.visual as keyof typeof GULLAK_MOMENTS])); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'ease-tune') {   // every moment's curve follows from where it starts and ends
        expect(lanes).toEqual([...EASES]);
        for (const c of ep.game.cards) { expect(c.lane).toBe(curveFor(c.visual ?? '')); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'duration-tune') {   // the first build's duration is always outside the band the transition needs
        expect(lanes).toEqual(DURATION_BANDS.map(b => b.id));
        for (const c of ep.game.cards) {
          const { ms, kind } = timingOf(c.visual ?? '');
          expect(DURATION_KINDS).toContain(kind);
          expect(ms).toBeGreaterThan(0);
          expect(durationVerdict(ms, c.lane as DurationBand)).not.toBe('right');
          expect(c.note).toBeTruthy();
        }
      }
      if (ep.game.id === 'motion-purpose') {   // a drawable motion each, none twice
        expect(lanes).toEqual([...MOTION_JOBS]);
        const vs = ep.game.cards.map(c => c.visual);
        expect(new Set(vs).size).toBe(vs.length);
        for (const c of ep.game.cards) { expect(MEANING_MOTIONS).toContain(c.visual); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'motion-audit') {   // every moving part of the home screen once, decided by the rule
        expect(lanes).toEqual([...REDUCE_LANES]);
        expect(ep.game.cards.map(c => c.visual).sort()).toEqual(Object.keys(DABBA_MOTIONS).sort());
        for (const c of ep.game.cards) { expect(c.lane).toBe(reduceFor(DABBA_MOTIONS[c.visual as keyof typeof DABBA_MOTIONS])); expect(c.note).toBeTruthy(); }
      }
      if (ep.game.id === 'doc-rewrite') {   // every kept paragraph is rewritten shorter; cut ones have no rewrite
        expect(lanes).toEqual([...DOC_BLOCKS]);
        for (const c of ep.game.cards) {
          expect(c.note).toBeTruthy();
          if (c.lane === 'cut') expect(c.visual).toBeUndefined();
          else { expect(wordCount(c.visual ?? '')).toBeLessThan(wordCount(c.label) * 0.75); expect(wordCount(c.visual!)).toBeLessThanOrEqual(20); }
        }
      }
      if (ep.game.id === 'align-snap') expect(lanes).toEqual(['left', 'center', 'right']);   // the three snap lines
      if (['gestalt-hunt', 'squint-test', 'spacing-fix'].includes(ep.game.id)) for (const c of ep.game.cards) expect(c.visual).toBeTruthy();   // visual games draw every card
    });
    it(`${id}: beats and the story gap fit inside the scene`, () => {
      const at = ep.scene.beats.map(b => b.at);
      expect(at).toEqual([...at].sort((a, b) => a - b));
      expect(at.at(-1)!).toBeLessThan(ep.scene.duration);
      expect(ep.gap.from).toBeLessThan(ep.gap.at);
      expect(ep.gap.at).toBeLessThan(ep.scene.duration);
    });
    it(`${id}: quiz answers aren’t always in the same slot`, () => {
      const slots = new Set(ep.quiz.questions.map(q => q.options.findIndex(o => o.id === q.correct)));
      expect(slots.size).toBeGreaterThan(1);
    });
  }
});
