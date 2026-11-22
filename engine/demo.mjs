// Run: node engine/demo.mjs : prints the T-shape and first steps for sample learners.
import { buildPath } from './personalize.mjs';

const learners = {
  'Visual designer, 4 yrs (I → T)': {
    goal: 'i-to-t', weeklyHours: 5,
    selfRating: { fd: 3, ui: 5, ds: 3, br: 3, pr: 2, ia: 2, rs: 1, ax: 1 },
    calibration: { ui: 0.9, ds: 0.5 },
  },
  'Career switcher, from scratch (T)': {
    goal: 't', weeklyHours: 8, selfRating: {}, interests: ['rs'],
  },
  'Motion designer who wants the whole product (product-literate)': {
    goal: 'product-literate', weeklyHours: 3, spine: ['pr'],
    selfRating: { pr: 4, ui: 3, br: 2, fd: 1 },
  },
  'Growth + UI designer (π)': {
    goal: 'pi', weeklyHours: 4, spine: ['ui', 'gr'],
    selfRating: { fd: 3, ui: 4, gr: 3, st: 2, cw: 2 },
  },
};

for (const [name, profile] of Object.entries(learners)) {
  const { tshape, path, estimate } = buildPath(profile);
  console.log(`\n=== ${name} ===`);
  console.log('T-shape:', tshape.columns.map(c => `${c.domain}${c.role === 'spine' ? '*' : ''} ${c.current}→${c.target}`).join(' | '));
  console.log(`Path: ${path.length} chapters, ~${estimate.hours}h, ~${estimate.weeks} weeks`);
  console.log('First 10:', path.slice(0, 10).map(p => p.id).join(' → '));
}
