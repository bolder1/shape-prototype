import { describe, expect, it } from 'vitest';
import {
  ASK_BELOW, AUTO_ABOVE, BILL_READ, BILL_TRUTH, DRAFT_TREATMENT, FIRST_PROMPT, HISAAB_EVALS, HISAAB_FIELDS, HISAAB_TASKS, PROMPT_HEADINGS,
  aiRole, billAddsUp, buildPrompt, codeChanges, evalRun, failsCheck, fieldTreatment, hoursBack, reviewLoad, roleReason, rupees, slipped,
  type HisaabCase, type HisaabField, type HisaabTask,
} from './ai';

describe('AI in the design workflow', () => {
  const keys = Object.keys(HISAAB_TASKS) as HisaabTask[];
  it('keeps AI out of evidence and unapproved personal data, delegates what can be checked, assists judgment calls', () => {
    const roles = Object.fromEntries(keys.map(k => [k, aiRole(HISAAB_TASKS[k])]));
    expect(roles).toEqual({
      transcribe: 'delegate', bills: 'delegate', reviews: 'delegate', prototype: 'delegate', translate: 'delegate', notes: 'delegate',
      layouts: 'assist', critique: 'assist', roadmap: 'assist', synthetic: 'keep', quotes: 'keep', support: 'keep',
    });
    expect(aiRole({ text: '', checkable: true, evidence: true })).toBe('keep');
    expect(aiRole({ text: '', checkable: true, personal: true })).toBe('keep');
  });
  it('counts hours back after checking, never more than the task took, and none for what stays human', () => {
    for (const k of keys) {
      const t = HISAAB_TASKS[k];
      if (aiRole(t) === 'keep') expect(t.hours).toBeUndefined();
      else { const [solo, ai] = t.hours ?? [0, 0]; expect(ai).toBeGreaterThan(0); expect(ai).toBeLessThanOrEqual(solo); }
    }
    expect(hoursBack(keys.map(k => HISAAB_TASKS[k]))).toBe(39.75);
    expect(hoursBack([HISAAB_TASKS.synthetic, HISAAB_TASKS.roadmap])).toBe(0);
    expect(roleReason(HISAAB_TASKS.support)).toMatch(/data/);
  });
});

describe('trust, errors and control', () => {
  const keys = Object.keys(HISAAB_FIELDS) as HisaabField[];
  it('is a real bill: the true numbers add up and the misread one doesn’t', () => {
    expect(billAddsUp(BILL_TRUTH)).toBe(true);
    expect(billAddsUp(BILL_READ)).toBe(false);
    expect(failsCheck('total')).toBe(true);
    expect(rupees(BILL_READ.total)).toBe('₹6,182.40');
    expect(rupees(125000)).toBe('₹1,25,000');
  });
  it('asks when it’s guessing, makes Ramesh check unsure money and records, fills the rest', () => {
    const t = Object.fromEntries(keys.map(k => [k, fieldTreatment(k)]));
    expect(t).toEqual({ supplier: 'auto', gstin: 'check', invoice: 'auto', date: 'check', item1: 'auto', qty1: 'check', rate1: 'auto', item2: 'auto', qty2: 'ask', rate2: 'auto', gst: 'auto', total: 'check' });
    expect(fieldTreatment('item2')).toBe('auto');
    expect(HISAAB_FIELDS.item2.conf).toBeLessThan(AUTO_ABOVE);
    expect(HISAAB_FIELDS.qty2.conf).toBeLessThan(ASK_BELOW);
  });
  it('lets wrong values reach the khata in the draft, and none once fields are flagged', () => {
    expect(slipped(DRAFT_TREATMENT)).toEqual(['gstin', 'qty2']);
    expect(slipped(fieldTreatment)).toEqual([]);
    expect(reviewLoad(DRAFT_TREATMENT)).toBe(0);
    expect(reviewLoad(fieldTreatment)).toBe(5);
    for (const k of keys) if ('truth' in HISAAB_FIELDS[k]) expect(fieldTreatment(k)).not.toBe('auto');
  });
});

describe('prompting as a design material', () => {
  const keys = Object.keys(HISAAB_EVALS) as HisaabCase[];
  it('fails every test question on the first prompt and passes all of them with every fix in', () => {
    expect(evalRun([]).pass).toEqual([]);
    expect(evalRun(keys).fail).toEqual([]);
    expect(buildPrompt([])).toBe(FIRST_PROMPT);
  });
  it('puts prompt fixes under their headings and keeps code fixes out of the prompt', () => {
    const prompt = buildPrompt(keys);
    for (const h of Object.values(PROMPT_HEADINGS)) expect(prompt).toContain(`## ${h}`);
    expect(prompt.indexOf(PROMPT_HEADINGS.context)).toBeLessThan(prompt.indexOf(PROMPT_HEADINGS.rules));
    for (const k of keys) {
      const c = HISAAB_EVALS[k];
      expect(prompt.includes(c.line)).toBe(c.fix !== 'code');
      expect(codeChanges(keys).includes(c.line)).toBe(c.fix === 'code');
    }
    expect(buildPrompt(['tone'])).not.toContain(PROMPT_HEADINGS.context);
  });
  it('sends sums, permissions and text from documents to code', () => {
    expect(keys.filter(k => HISAAB_EVALS[k].fix === 'code').sort()).toEqual(['inject', 'month', 'staff']);
    expect(evalRun(keys.filter(k => HISAAB_EVALS[k].fix !== 'code')).fail.sort()).toEqual(['inject', 'month', 'staff']);
  });
});
