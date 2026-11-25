import { describe, expect, it } from 'vitest';
import {
  ANSWER_FLAWS, AUDIT_CALLS, CONTENT_KINDS, KIND_OWNER, LOW_VIEWS, MODEL_PLACES, REVIEW_DAYS, TAAR_ANSWERS, TAAR_AUDIT, TAAR_CHUNKS,
  answerFlaw, auditCall, editsFor, modelPlace, reviewDue, ungrounded,
  type AssistAnswer, type AuditItem, type PageChunk, type TaarAnswer, type TaarAuditItem, type TaarChunk,
} from './contentstrategy';

describe('Taar content model', () => {
  const keys = Object.keys(TAAR_CHUNKS) as TaarChunk[];
  it('places every chunk of the old page', () => {
    expect(Object.fromEntries(keys.map(k => [k, modelPlace(TAAR_CHUNKS[k])]))).toEqual({
      title: 'field', summary: 'field', steps: 'field',
      plan: 'type', device: 'type', contact: 'type', outage: 'type',
      topic: 'tag', appliesTo: 'tag', audience: 'tag',
      blueBox: 'cut', redButton: 'cut',
    });
    for (const p of MODEL_PLACES) expect(keys.filter(k => modelPlace(TAAR_CHUNKS[k]) === p).length).toBeGreaterThanOrEqual(2);
  });
  it('lets presentation lose to nothing, and reuse beat classification', () => {
    const base: PageChunk = { text: 'x', look: false, pages: 1, ownLife: false, classifies: false, as: 'x' };
    expect(modelPlace(base)).toBe('field');
    expect(modelPlace({ ...base, look: true, pages: 40 })).toBe('cut');
    expect(modelPlace({ ...base, classifies: true, pages: 3 })).toBe('type');
    expect(modelPlace({ ...base, ownLife: true })).toBe('type');
    expect(modelPlace({ ...base, classifies: true })).toBe('tag');
  });
  it('turns a copied change into one edit once modelled', () => {
    expect(editsFor(TAAR_CHUNKS.plan, false)).toBe(23);
    expect(editsFor(TAAR_CHUNKS.plan, true)).toBe(1);
    expect(editsFor(TAAR_CHUNKS.contact, true)).toBe(1);
    expect(editsFor(TAAR_CHUNKS.title, true)).toBe(1);
    for (const k of keys) if (modelPlace(TAAR_CHUNKS[k]) !== 'type') expect(TAAR_CHUNKS[k].pages).toBe(1);
  });
});

describe('Taar content audit', () => {
  const keys = Object.keys(TAAR_AUDIT) as TaarAuditItem[];
  it('calls every item', () => {
    expect(Object.fromEntries(keys.map(k => [k, auditCall(TAAR_AUDIT[k])]))).toEqual({
      fibre50: 'retire', baner: 'retire', ontLights: 'retire',
      wifiX1: 'merge', upi: 'merge',
      bill: 'refresh', fup: 'refresh', move: 'refresh',
      reset: 'keep', autopay: 'keep', parental: 'keep',
    });
    for (const c of AUDIT_CALLS) expect(keys.filter(k => auditCall(TAAR_AUDIT[k]) === c).length).toBeGreaterThanOrEqual(2);
  });
  it('applies the rules in order', () => {
    const base: AuditItem = { text: 'x', kind: 'billing', views: 5000, daysSinceReview: 10, gone: false, required: false };
    expect(auditCall(base)).toBe('keep');
    expect(auditCall({ ...base, gone: true, views: 90000 })).toBe('retire');   // untrue goes, however popular
    expect(auditCall({ ...base, duplicateOf: 'y', daysSinceReview: 400 })).toBe('merge');
    expect(auditCall({ ...base, views: LOW_VIEWS - 1 })).toBe('retire');
    expect(auditCall({ ...base, views: LOW_VIEWS - 1, required: true })).toBe('keep');
    expect(auditCall({ ...base, views: LOW_VIEWS - 1, required: true, daysSinceReview: 91 })).toBe('refresh');
    expect(reviewDue({ ...base, daysSinceReview: 90 })).toBe(0);
    expect(auditCall({ ...base, daysSinceReview: 90 })).toBe('keep');
    expect(auditCall({ ...base, daysSinceReview: 91 })).toBe('refresh');
    expect(auditCall({ ...base, kind: 'policy', daysSinceReview: 300 })).toBe('keep');
  });
  it('reviews riskier content more often, and every kind has an owner', () => {
    expect(REVIEW_DAYS.billing).toBeLessThan(REVIEW_DAYS.troubleshoot);
    expect(REVIEW_DAYS.troubleshoot).toBeLessThan(REVIEW_DAYS.policy);
    for (const k of CONTENT_KINDS) expect(KIND_OWNER[k]).toBeTruthy();
  });
  it('gives everything that goes somewhere to send people', () => {
    for (const k of keys) {
      const c = auditCall(TAAR_AUDIT[k]);
      if (c === 'retire' || c === 'merge') expect(TAAR_AUDIT[k].redirect).toBeTruthy();
      if (c === 'merge') expect(TAAR_AUDIT[k].redirect).toBe(TAAR_AUDIT[k].duplicateOf);
    }
  });
});

describe('Taar Assist answers', () => {
  const keys = Object.keys(TAAR_ANSWERS) as TaarAnswer[];
  it('finds the flaw in every answer', () => {
    expect(Object.fromEntries(keys.map(k => [k, answerFlaw(TAAR_ANSWERS[k])]))).toEqual({
      price: 'ship', redLight: 'ship', wifiPwd: 'ship',
      credit: 'invents', staticIp: 'invents', hinjewadi: 'invents',
      gremlins: 'tone', failedPay: 'tone', bill: 'tone',
      close: 'handoff', otp: 'handoff',
    });
    for (const f of ANSWER_FLAWS) expect(keys.filter(k => answerFlaw(TAAR_ANSWERS[k]) === f).length).toBeGreaterThanOrEqual(2);
  });
  it('gives every flawed answer exactly one flaw, so the call is never a coin toss', () => {
    for (const k of keys) {
      const a = TAAR_ANSWERS[k];
      const flaws = [ungrounded(a).length > 0, a.upset && a.jokey, a.needsPerson && !a.offersPerson].filter(Boolean).length;
      expect(flaws).toBe(answerFlaw(a) === 'ship' ? 0 : 1);
      for (const l of a.lines) if (l.fact !== null) expect(l.fact).toBeLessThan(a.source.length);
      if (a.jokey) expect(a.lines.some(l => l.aside)).toBe(true);
    }
  });
  it('treats asides as claiming nothing and ranks the flaws', () => {
    const base: AssistAnswer = { question: 'q', lines: [{ text: 'a', fact: 0 }], source: ['a'], upset: false, jokey: false, needsPerson: false, offersPerson: false };
    expect(answerFlaw(base)).toBe('ship');
    expect(answerFlaw({ ...base, lines: [...base.lines, { text: 'Hi!', fact: null, aside: true }] })).toBe('ship');
    expect(ungrounded({ ...base, lines: [{ text: 'b', fact: 3 }] })).toHaveLength(1);
    const all: AssistAnswer = { ...base, lines: [{ text: 'b', fact: null }], upset: true, jokey: true, needsPerson: true };
    expect(answerFlaw(all)).toBe('invents');
    expect(answerFlaw({ ...all, lines: base.lines })).toBe('tone');
    expect(answerFlaw({ ...all, lines: base.lines, jokey: false })).toBe('handoff');
    expect(answerFlaw({ ...base, jokey: true })).toBe('ship');   // a light touch on a routine question is fine
  });
});
