import { describe, expect, it } from 'vitest';
import {
  CART_RULES, OUTPUT_METHODS, PROTO_NEEDS, PROTO_TOOLS, THELA_BEHAVIOURS, THELA_ITEMS, THELA_QUESTIONS, THELA_STUDIES,
  TOOL_CAN, TOOL_DAYS, WIRE_KINDS, canAdd, cartTotals, missingNeeds, outputMethod, protoTool, toolCovers, wireKind,
  type AiStudy, type ThelaBehaviour, type ThelaQuestion, type ThelaStudy,
} from './advproto';

const q = (milk = 0, atta = 0, butter = 0) => ({ milk, atta, butter });

describe('Thela cart logic', () => {
  it('adds up the cart and its savings', () => {
    expect(cartTotals(q())).toMatchObject({ count: 0, subtotal: 0, delivery: 0, smallCartFee: 0, total: 0 });
    expect(cartTotals(q(1, 1))).toMatchObject({ count: 2, subtotal: 319, savings: 37, delivery: 0, total: 319 });
    expect(cartTotals(q(1, 0, 1)).subtotal).toBe(110);
  });
  it('charges delivery and the small-cart fee below their thresholds', () => {
    expect(cartTotals(q(1))).toMatchObject({ subtotal: 54, delivery: 25, smallCartFee: 15, total: 94, freeDeliveryNeed: 145 });
    expect(cartTotals(q(1, 0, 1))).toMatchObject({ delivery: 25, smallCartFee: 0, freeDeliveryNeed: 89 });
    expect(cartTotals(q(0, 1))).toMatchObject({ delivery: 0, freeDeliveryNeed: 0 });
  });
  it('applies FIRST50 only from ₹299', () => {
    expect(cartTotals(q(0, 1), { coupon: true })).toMatchObject({ couponApplied: false, couponOff: 0, couponNeed: 34, total: 265 });
    expect(cartTotals(q(1, 1), { coupon: true })).toMatchObject({ couponApplied: true, couponOff: CART_RULES.couponOff, total: 269 });
  });
  it('gives Plus members member prices and free delivery', () => {
    const plus = cartTotals(q(1), { plus: true });
    expect(plus).toMatchObject({ subtotal: 52, delivery: 0, smallCartFee: 0, freeDeliveryNeed: 0, total: 52 });
    expect(cartTotals(q(1, 1), { plus: true }).savings).toBeGreaterThan(cartTotals(q(1, 1)).savings);
  });
  it('stops at the stock', () => {
    expect(canAdd(q(0, 0, 1), 'butter')).toBe(true);
    expect(canAdd(q(0, 0, THELA_ITEMS.butter.stock), 'butter')).toBe(false);
    expect(cartTotals(q(0, 0, 5)).count).toBe(THELA_ITEMS.butter.stock);
  });
  it('wires every behaviour', () => {
    const keys = Object.keys(THELA_BEHAVIOURS) as ThelaBehaviour[];
    expect(Object.fromEntries(keys.map(k => [k, wireKind(THELA_BEHAVIOURS[k])]))).toEqual({
      badge: 'variable', subtotal: 'variable', savings: 'variable',
      freeDelivery: 'conditional', smallCart: 'conditional', coupon: 'conditional', stock: 'conditional',
      telugu: 'mode', plus: 'mode', returning: 'mode',
    });
    for (const w of WIRE_KINDS) expect(keys.filter(k => wireKind(THELA_BEHAVIOURS[k]) === w).length).toBeGreaterThanOrEqual(3);
    // A set of values is a mode even if it changes what's decided.
    expect(wireKind({ text: 'x', wires: 'x', set: true, decides: true })).toBe('mode');
  });
});

describe('Prototype tools', () => {
  const keys = Object.keys(THELA_QUESTIONS) as ThelaQuestion[];
  it('picks the cheapest tool that makes every need real', () => {
    expect(Object.fromEntries(keys.map(k => [k, protoTool(THELA_QUESTIONS[k].needs)]))).toEqual({
      staples: 'figma', nudge: 'figma', fee: 'figma', teluguCart: 'figma',
      sticky: 'framer', address: 'framer', aisle: 'framer',
      search: 'code', slots: 'code', scan: 'code', buyAgain: 'code',
    });
    for (const t of PROTO_TOOLS) expect(keys.filter(k => protoTool(THELA_QUESTIONS[k].needs) === t).length).toBeGreaterThanOrEqual(3);
  });
  it('orders tools by cost, each covering the one before', () => {
    for (let i = 1; i < PROTO_TOOLS.length; i++) {
      expect(TOOL_DAYS[PROTO_TOOLS[i]]).toBeGreaterThan(TOOL_DAYS[PROTO_TOOLS[i - 1]]);
      expect(toolCovers(PROTO_TOOLS[i], TOOL_CAN[PROTO_TOOLS[i - 1]])).toBe(true);
    }
    expect(toolCovers('code', PROTO_NEEDS)).toBe(true);
  });
  it('names what a cheaper tool would leave fake', () => {
    for (const k of keys) {
      const { needs } = THELA_QUESTIONS[k];
      const t = protoTool(needs);
      expect(missingNeeds(t, needs)).toEqual([]);
      const i = PROTO_TOOLS.indexOf(t);
      if (i > 0) expect(missingNeeds(PROTO_TOOLS[i - 1], needs).length, k).toBeGreaterThan(0);
    }
    expect(missingNeeds('figma', ['typing', 'live'])).toEqual(['typing', 'live']);
  });
});

describe('AI outputs in a test', () => {
  const keys = Object.keys(THELA_STUDIES) as ThelaStudy[];
  it('plans every study', () => {
    expect(Object.fromEntries(keys.map(k => [k, outputMethod(THELA_STUDIES[k])]))).toEqual({
      want: 'wizard', voice: 'wizard', followUp: 'wizard',
      wrongItem: 'recorded', layouts: 'recorded', wait: 'recorded', longCart: 'recorded',
      realAsks: 'live', trust: 'live', fixRate: 'live',
    });
    for (const m of OUTPUT_METHODS) expect(keys.filter(k => outputMethod(THELA_STUDIES[k]) === m).length).toBeGreaterThanOrEqual(3);
  });
  it('shows everyone the same output exactly when it is recorded', () => {
    for (const k of keys) {
      const s = THELA_STUDIES[k];
      expect(new Set(s.seen).size === 1, k).toBe(outputMethod(s) === 'recorded');
    }
  });
  it('puts the model first, then control, then people’s own input', () => {
    const s: AiStudy = { text: 'x', modelReady: false, sameForAll: true, ownInput: true, seen: ['a', 'a', 'a'] };
    expect(outputMethod(s)).toBe('wizard');
    expect(outputMethod({ ...s, modelReady: true })).toBe('recorded');
    expect(outputMethod({ ...s, modelReady: true, sameForAll: false })).toBe('live');
    expect(outputMethod({ ...s, modelReady: true, sameForAll: false, ownInput: false })).toBe('recorded');
  });
});
