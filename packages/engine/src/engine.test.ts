import { describe, expect, it } from 'vitest';
import { buildPath, chapterById, chapters, validateCurriculum, type Profile } from './index';

const visualDesigner: Profile = { goal: 'i-to-t', weeklyHours: 5,
  selfRating: { fd: 3, ui: 5, ds: 3, br: 3, pr: 2, ia: 2, rs: 1, ax: 1 }, calibration: { ui: 0.9, ds: 0.5 } };
const switcher: Profile = { goal: 't', weeklyHours: 8, selfRating: {}, interests: ['rs'] };
const motionLiterate: Profile = { goal: 'product-literate', weeklyHours: 3, spine: ['pr'], selfRating: { pr: 4, ui: 3, br: 2, fd: 1 } };
// gr is the clear runner-up (ties would fall back to curriculum order)
const piDesigner: Profile = { goal: 'pi', weeklyHours: 4, spine: ['ui'], selfRating: { fd: 2, ui: 4, gr: 3, st: 2, cw: 2 } };

describe('curriculum', () => {
  it('has a valid graph (no unknown ids, no cycles)', () => expect(validateCurriculum()).toEqual([]));
  it('has 60 chapters', () => expect(chapters).toHaveLength(60));
});

describe('buildPath', () => {
  for (const [name, p] of Object.entries({ visualDesigner, switcher, motionLiterate, piDesigner })) {
    it(`${name}: every chapter comes after its prerequisites`, () => {
      const ids = buildPath(p).path.map(x => x.id);
      ids.forEach((id, i) => chapterById[id].prereqs.forEach(pre => {
        if (ids.includes(pre)) expect(ids.indexOf(pre)).toBeLessThan(i);
      }));
    });
  }

  it('calibration caps self-rating', () => {
    const ds = buildPath(visualDesigner).tshape.columns.find(c => c.domain === 'ds')!;
    expect(ds.current).toBe(3); // self 3, quiz 0.5 → cap round(2.5)=3
  });

  it('from-scratch learner follows their interest as deep skill, early', () => {
    const r = buildPath(switcher);
    expect(r.tshape.spine).toEqual(['rs']);
    expect(r.path.slice(0, 10).filter(p => p.domain === 'rs').length).toBeGreaterThanOrEqual(4);
  });

  it('product-literate keeps their craft and never pushes it to expert', () => {
    const r = buildPath(motionLiterate);
    expect(r.tshape.spine).toEqual(['pr']);
    expect(r.path.some(p => p.domain === 'pr' && p.tier === 'deep')).toBe(false);
    expect(r.path[0].domain).toBe('fd'); // core product loop first
  });

  it('pi keeps the chosen deep skill and fills a second from strength', () => {
    expect(buildPath(piDesigner).tshape.spine).toEqual(['ui', 'gr']);
  });

  it('an expert in their spine gets no spine chapters', () => {
    expect(buildPath(visualDesigner).path.some(p => p.domain === 'ui')).toBe(false);
  });
});
