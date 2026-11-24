import { describe, expect, it } from 'vitest';
import {
  NEHA_FIRST_DECK, NEHA_UPDATE_ORDER, OBJECTION_KINDS, PITCH_PARTS, PITCH_SECONDS, PROBLEM_BY, SAMAN_BEATS, SAMAN_OBJECTIONS, SAMAN_UPDATE,
  SUMMARY_PARTS, SUMMARY_SECONDS, buildSummary, goodReply, inboxPreview, jargonIn, pitchFlaws, pitchLength, pitchOrder, pitchTimeline,
  replyFlaw, replyTrust, summaryFlaws, type Objection, type SamanBeat, type SamanLine,
} from './pitch';
import { readSeconds } from './episode';

const beatKeys = Object.keys(SAMAN_BEATS) as SamanBeat[];

describe('storytelling a design', () => {
  it('finds every flaw in Neha’s process-ordered first deck', () => {
    expect(pitchLength(NEHA_FIRST_DECK)).toBe(380);
    expect(pitchFlaws(NEHA_FIRST_DECK)).toEqual(['long', 'late', 'process', 'noask']);
    expect(pitchTimeline(NEHA_FIRST_DECK).find(l => l.beat.part === 'complication')!.start).toBe(330);
  });
  it('tells the rebuilt pitch in story order, inside five minutes, with the problem in the first minute', () => {
    const order = pitchOrder([...beatKeys].reverse(), k => SAMAN_BEATS[k].part);
    expect(order.map(k => SAMAN_BEATS[k].part)).toEqual([...order.map(k => SAMAN_BEATS[k].part)].sort((a, b) => PITCH_PARTS.indexOf(a) - PITCH_PARTS.indexOf(b)));
    const beats = order.map(k => SAMAN_BEATS[k]);
    expect(pitchFlaws(beats)).toEqual([]);
    expect(pitchLength(beats)).toBeLessThanOrEqual(PITCH_SECONDS);
    expect(pitchTimeline(beats).find(l => l.beat.part === 'complication')!.start).toBeLessThan(PROBLEM_BY);
    for (const p of PITCH_PARTS) expect(beatKeys.some(k => SAMAN_BEATS[k].part === p)).toBe(true);
  });
  it('keeps beats of the same part in the order given', () => {
    expect(pitchOrder(['measure', 'ramesh', 'ask', 'stakes'] as SamanBeat[], k => SAMAN_BEATS[k].part)).toEqual(['ramesh', 'stakes', 'measure', 'ask']);
  });
  it('flags a missing problem and a missing ask', () => {
    expect(pitchFlaws([SAMAN_BEATS.ramesh, SAMAN_BEATS.reorder])).toEqual(['late', 'noask']);
  });
});

describe('handling objections', () => {
  it('checks attack, then caving, then vagueness, then acknowledgement', () => {
    expect(replyFlaw({ text: '', attack: true, ack: true, concrete: true })).toBe('defensive');
    expect(replyFlaw({ text: '', concede: true, ack: true })).toBe('caves');
    expect(replyFlaw({ text: '', ack: true })).toBe('vague');
    expect(replyFlaw({ text: '', concrete: true })).toBe('dismissive');
    expect(replyFlaw({ text: '', ack: true, concrete: true })).toBeNull();
    expect([replyTrust(null), replyTrust('defensive'), replyTrust('vague')]).toEqual([2, -2, -1]);
  });
  it('gives every objection exactly one reply that lands, and covers every kind', () => {
    for (const o of Object.values(SAMAN_OBJECTIONS) as Objection[]) {
      expect(o.replies.filter(r => replyFlaw(r) === null)).toHaveLength(1);
      expect(goodReply(o)).toBeGreaterThanOrEqual(0);
    }
    for (const k of OBJECTION_KINDS) expect(Object.values(SAMAN_OBJECTIONS).some(o => o.kind === k)).toBe(true);
    // The right reply isn't always in the same place.
    expect(new Set((Object.values(SAMAN_OBJECTIONS) as Objection[]).map(goodReply)).size).toBeGreaterThan(1);
  });
});

describe('exec summaries', () => {
  const lines = (keys: readonly SamanLine[]) => keys.map(k => SAMAN_UPDATE[k]);
  it('finds jargon by stem, as written', () => {
    expect(jargonIn('We ran an affinity mapping workshop to synthesise 12 interviews')).toEqual(['affinity', 'synthesise']);
    expect(jargonIn('Three personas, and UX debt.')).toEqual(['personas,', 'UX']);
    expect(jargonIn('Restock takes 19 minutes')).toEqual([]);
  });
  it('previews the first 90 characters, like an inbox', () => {
    expect(inboxPreview('Short')).toBe('Short');
    const p = inboxPreview(SAMAN_UPDATE.hello.text + ' ' + SAMAN_UPDATE.affinity.text);
    expect(p.length).toBeLessThanOrEqual(90);
    expect(p.endsWith('…')).toBe(true);
  });
  it('fails Neha’s first update on every count but numbers', () => {
    expect(summaryFlaws(lines(NEHA_UPDATE_ORDER))).toEqual(['buried', 'long', 'jargon']);
    expect(NEHA_UPDATE_ORDER.slice().sort()).toEqual(Object.keys(SAMAN_UPDATE).sort());
  });
  it('builds a clean summary from the kept lines, ask first, in under half a minute', () => {
    const keys = buildSummary(Object.keys(SAMAN_UPDATE) as SamanLine[]);
    expect(keys[0]).toBe('ask');
    expect(keys.some(k => SAMAN_UPDATE[k].part === 'cut')).toBe(false);
    expect(summaryFlaws(lines(keys))).toEqual([]);
    expect(readSeconds(lines(keys).map(l => l.text).join(' '))).toBeLessThanOrEqual(SUMMARY_SECONDS);
    expect(inboxPreview(SAMAN_UPDATE.ask.text)).toContain('Decision needed by Friday');
    for (const p of SUMMARY_PARTS) expect(Object.values(SAMAN_UPDATE).some(l => l.part === p)).toBe(true);
  });
  it('flags a summary with no numbers', () => {
    expect(summaryFlaws([{ text: 'Please approve the restock redesign.', part: 'ask' }])).toEqual(['vague']);
  });
});
