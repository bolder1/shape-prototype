import { describe, expect, it } from 'vitest';
import { contrastRatio } from './episode';
import {
  GUIDE_RULES, GUIDE_SECTIONS, KIT_SLOTS, MARK_VERDICTS, SUKOON_GUIDE, SUKOON_KIT, SUKOON_MARKS, SUKOON_USES,
  hexHsl, hueGap, kitFlaw, markFlaws, markPx, markVerdict, rivalOf, rulesBroken, sectionBroken, type KitOption, type Mark,
} from './identity';

describe('logo stress tests', () => {
  it('scales strokes to pixels and runs the tests in order', () => {
    expect(markPx(12)).toBe(2);
    expect(markPx(6)).toBe(1);
    expect(markPx(12, 48)).toBe(6);
    expect(markVerdict({ text: 'ok', thin: 6, tones: 1 })).toBe('ready');   // exactly 1 px survives
    expect(markVerdict({ text: 'hair', thin: 5.9, tones: 1 })).toBe('small');
    expect(markFlaws({ text: 'all', thin: 2, tones: 2, cliche: 'lotus' })).toEqual(['small', 'mono', 'generic']);
    expect(markVerdict({ text: 'grad', thin: 20, tones: 1, gradient: true })).toBe('mono');
  });
  it('gives Ishita’s shortlist one flaw each, two marks per verdict', () => {
    const marks = Object.values(SUKOON_MARKS) as Mark[];
    for (const m of marks) expect(markFlaws(m).length).toBeLessThanOrEqual(1);
    for (const v of MARK_VERDICTS) expect(marks.filter(m => markVerdict(m) === v)).toHaveLength(2);
    expect(markVerdict(SUKOON_MARKS.breath)).toBe('ready');
  });
});

describe('the kit', () => {
  it('reads hue, saturation and lightness', () => {
    expect(hexHsl('#FF0000')).toEqual([0, 100, 50]);
    expect(hexHsl('#FFFFFF')[1]).toBe(0);
    const [h, s, l] = hexHsl('#1F5FD1');
    expect(h).toBeCloseTo(218.4, 0); expect(s).toBeGreaterThan(70); expect(l).toBeCloseTo(47.1, 0);
    expect(hueGap(350, 10)).toBe(20);
    expect(hueGap(24, 215)).toBe(169);
  });
  it('spots a rival’s colour only in strong mid-tones', () => {
    expect(rivalOf('#1F5FD1')).toBe('blue');
    expect(rivalOf('#F47D31')).toBe('orange');
    expect(rivalOf('#F3E9DC')).toBeNull();   // a pale tint of orange is just sand
    expect(rivalOf('#2F5D50')).toBeNull();
  });
  it('checks script, then contrast, then rival, then trait', () => {
    expect(kitFlaw({ kind: 'type', slot: 'display', name: 'x', text: 'x', scripts: ['latn'], fights: 'calm' })).toBe('script');
    expect(kitFlaw({ kind: 'colour', slot: 'action', name: 'x', text: 'x', hex: '#F47D31', on: '#FFFFFF' })).toBe('contrast');
    expect(kitFlaw({ kind: 'colour', slot: 'action', name: 'x', text: 'x', hex: '#1F5FD1', on: '#FFFFFF', fights: 'calm' })).toBe('rival');
  });
  it('offers three options a job, exactly one that fits, and two different flaws', () => {
    const opts = Object.values(SUKOON_KIT) as KitOption[];
    for (const slot of KIT_SLOTS) {
      const here = opts.filter(o => o.slot === slot);
      expect(here).toHaveLength(3);
      const flaws = here.map(kitFlaw);
      expect(flaws.filter(f => f === null)).toHaveLength(1);
      expect(new Set(flaws).size).toBe(3);
    }
    expect(contrastRatio(SUKOON_KIT.peach.hex, '#FFFFFF')).toBeLessThan(2);
    expect(contrastRatio(SUKOON_KIT.sage.hex, '#FFFFFF')).toBeGreaterThan(7);
    expect(kitFlaw(SUKOON_KIT.cobalt)).toBe('rival');
    expect(kitFlaw(SUKOON_KIT.slate)).toBe('contrast');
  });
});

describe('the guidelines', () => {
  it('keeps the palette’s text pairs above 4.5:1, except white on peach', () => {
    const { sage, sand, peach, ink, white } = SUKOON_GUIDE.palette;
    for (const [fg, bg] of [[white, sage], [ink, sand], [ink, peach]]) expect(contrastRatio(fg, bg)).toBeGreaterThan(4.5);
    expect(contrastRatio(white, peach)).toBeLessThan(4.5);
  });
  it('finds the rules a piece breaks', () => {
    expect(rulesBroken({ text: 'fine', stretch: 1, clearSuns: 1, lockupPx: 24, colours: ['#FFFFFF|#2F5D50'], type: [{ face: 'text', px: 14 }], photo: 'real' })).toEqual([]);
    expect(sectionBroken({ text: 'fine' })).toBeNull();
    expect(rulesBroken({ text: 'x', stretch: 0.8, lockupPx: 10 })).toEqual(['stretch', 'size']);
    expect(rulesBroken({ text: 'x', colours: ['#C9A227|#FFFFFF'] })).toEqual(['palette']);   // off-palette, so its contrast isn't the point
    expect(rulesBroken({ text: 'x', type: [{ face: 'display', px: 18 }] })).toEqual(['faceSize']);
  });
  it('gives every piece in the wild exactly one broken rule, and every section at least two pieces', () => {
    const uses = Object.values(SUKOON_USES);
    for (const u of uses) expect(rulesBroken(u)).toHaveLength(1);
    for (const s of GUIDE_SECTIONS) expect(uses.filter(u => sectionBroken(u) === s).length).toBeGreaterThanOrEqual(2);
    const used = new Set(uses.flatMap(u => rulesBroken(u)));
    expect([...used].sort()).toEqual(Object.keys(GUIDE_RULES).sort());   // every rule is needed by something
  });
});
