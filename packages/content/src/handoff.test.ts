import { describe, expect, it } from 'vitest';
import {
  BUILD_QUESTIONS, DEV_QUESTIONS, GAADI_CODE, GAADI_QA, GAADI_SPEC, QA_TOLERANCE_PX, SANA_FIRST_SPEC, SEATS_GREY, TEXT_TERTIARY, TOKEN_CHANGE,
  lintFlags, onGreen, platformName, qaLane, qaTicket, qaVerdict, refKind, renderedGreen, specAnswered, specFlaws,
  type GaadiCode, type GaadiQa, type GaadiSpecItem,
} from './handoff';
import { contrastRatio } from './episode';

const items = (keys: readonly GaadiSpecItem[]) => keys.map(k => GAADI_SPEC[k]);
const specKeys = Object.keys(GAADI_SPEC) as GaadiSpecItem[];
const NOTES = specKeys.filter(k => GAADI_SPEC[k].source === 'note');

describe('handoff specs', () => {
  it('finds every flaw in Sana’s first handoff, and that it answers nothing', () => {
    expect(specFlaws(items(SANA_FIRST_SPEC))).toEqual(['unanswered', 'redline', 'noise']);
    expect(specAnswered(items(SANA_FIRST_SPEC))).toEqual([]);
    expect(BUILD_QUESTIONS.after).toBeLessThan(BUILD_QUESTIONS.before);
  });
  it('has exactly one clean spec: one note per question, nothing Dev Mode shows, nothing extra', () => {
    expect(NOTES.map(k => GAADI_SPEC[k].answers).sort()).toEqual([...DEV_QUESTIONS].sort());
    expect(specFlaws(items(NOTES))).toEqual([]);
    for (const extra of specKeys.filter(k => !NOTES.includes(k))) expect(specFlaws(items([...NOTES, extra]))).not.toEqual([]);
    for (const drop of NOTES) expect(specFlaws(items(NOTES.filter(k => k !== drop)))).toEqual(['unanswered']);
  });
  it('gives every value Dev Mode shows its token', () => {
    for (const k of specKeys) if (GAADI_SPEC[k].source === 'tool') expect(GAADI_SPEC[k].inspect).toMatch(/var\(--/);
  });
});

describe('design QA', () => {
  const keys = Object.keys(GAADI_QA) as GaadiQa[];
  it('sorts findings: broken or inaccessible blocks, drift is fixed, rendering noise is let go', () => {
    const lanes = Object.fromEntries(keys.map(k => [k, qaLane(GAADI_QA[k])]));
    expect(lanes).toEqual({ double: 'blocker', focus: 'blocker', seats: 'blocker', gst: 'blocker', hex: 'fix', gap: 'fix', wrap: 'fix', weight: 'pass', handle: 'pass', shadow: 'pass' });
    expect(qaLane({ where: '', expected: '', actual: '', px: QA_TOLERANCE_PX })).toBe('pass');
    expect(qaLane({ where: '', expected: '', actual: '', px: QA_TOLERANCE_PX + 1 })).toBe('fix');
  });
  it('holds the release while any blocker is open', () => {
    expect(qaVerdict(keys.map(k => GAADI_QA[k]))).toBe('hold');
    expect(qaVerdict(keys.filter(k => qaLane(GAADI_QA[k]) !== 'blocker').map(k => GAADI_QA[k]))).toBe('ship');
  });
  it('backs the contrast finding with real ratios, and writes tickets that stand alone', () => {
    expect(contrastRatio(SEATS_GREY, '#FFFFFF')).toBeLessThan(3);
    expect(contrastRatio(TEXT_TERTIARY, '#FFFFFF')).toBeGreaterThan(7.5);
    expect(GAADI_QA.seats.actual).toContain('2.5:1');
    expect(qaTicket(GAADI_QA.gap)).toBe('Bus rows. Expected: 16 px apart (space-4). Actual: 12 px apart. On Redmi 12, Android 14, text 130%.');
  });
});

describe('tokens in code', () => {
  const keys = Object.keys(GAADI_CODE) as GaadiCode[];
  it('names a token the way each platform expects', () => {
    expect(platformName(TOKEN_CHANGE.token, 'web')).toBe('var(--color-action-primary)');
    expect(platformName(TOKEN_CHANGE.token, 'android')).toBe('GaadiTheme.colors.actionPrimary');
    expect(platformName(TOKEN_CHANGE.token, 'ios')).toBe('Color.actionPrimary');
    for (const p of ['web', 'android', 'ios'] as const) expect(GAADI_CODE[p === 'web' ? 'webBtn' : p].code).toContain(platformName(TOKEN_CHANGE.token, p));
  });
  it('reads each line like a lint, and only lines that follow tokens get the fix', () => {
    const kinds = Object.fromEntries(keys.map(k => [k, refKind(GAADI_CODE[k].code)]));
    expect(kinds).toEqual({ webBtn: 'follows', webComp: 'follows', android: 'follows', ios: 'follows', webHex: 'literal', androidHex: 'literal', iosRgb: 'literal', webSeat: 'primitive', androidSeat: 'primitive', iosSeat: 'primitive' });
    expect(renderedGreen(GAADI_CODE.ios.code, true)).toBe('green.700');
    expect(renderedGreen(GAADI_CODE.webSeat.code, true)).toBe('green.600');
    expect(renderedGreen(GAADI_CODE.ios.code, false)).toBe('green.600');
    expect(lintFlags(keys)).toHaveLength(6);
  });
  it('is a real contrast fix: white fails on green-600 and passes on green-700', () => {
    expect(onGreen(TOKEN_CHANGE.from)).toBeLessThan(4.5);
    expect(onGreen(TOKEN_CHANGE.to)).toBeGreaterThanOrEqual(4.5);
  });
});
