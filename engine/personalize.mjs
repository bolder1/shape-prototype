// Personalization engine: profile → T-shape → ordered personal path.
// Pure functions with no I/O, so the same code runs in the API, in tests and in the browser (live T preview).
import { domains, domainById, chapters, chapterById, TIER_LEVEL } from '../curriculum/curriculum.mjs';

/**
 * @typedef {'i-to-t'|'t'|'pi'|'full-stack'|'product-literate'} Goal
 *   product-literate: people from adjacent crafts (graphics, motion, front-end, marketing, sales, PM)
 *   who keep their own spine and want to understand the whole product, not change careers.
 * @typedef {{
 *   role?: string, years?: number,
 *   selfRating: Record<string, number>,      // 0–5 per domain, from swipe-sort
 *   calibration?: Record<string, number>,    // 0–1 score from onboarding micro-quests
 *   goal: Goal,
 *   spine?: string[],                        // explicit spine choice (optional)
 *   interests?: string[],                    // domains they're curious about
 *   weeklyHours: number,
 * }} Profile
 * @typedef {{ domain: string, current: number, target: number, role: 'spine'|'adjacent'|'bar' }} TColumn
 */

// ---- 1. current level per domain ------------------------------------------
// Self-rating gets capped by evidence: if calibration exists, you can't claim more than you showed.
export function currentLevels(profile) {
  return Object.fromEntries(domains.map(d => {
    const self = profile.selfRating[d.id] ?? 0;
    const cal = profile.calibration?.[d.id];
    const level = cal == null ? self : Math.min(self, Math.round(cal * 5));
    return [d.id, Math.max(0, Math.min(5, level))];
  }));
}

// ---- 2. T-shape (targets) -------------------------------------------------
/** Domains everyone who "wants to understand the whole product" should reach Practitioner in. */
export const PRODUCT_CORE = ['fd', 'rs', 'ia', 'st'];

/** Home domain for each starting discipline; becomes the default spine. */
export const ROLE_HOME = {
  'student': null, 'ui-designer': 'ui', 'ux-designer': 'ia', 'product-designer': 'ia', 'researcher': 'rs',
  'graphic-designer': 'br', 'motion-designer': 'pr', 'brand-marketing': 'br', 'marketer': 'gr',
  'sales': 'bz', 'frontend-engineer': 'dc', 'product-manager': 'st',
};

export function buildTShape(profile) {
  const cur = currentLevels(profile);
  const byStrength = [...domains].sort((a, b) => cur[b.id] - cur[a.id]).map(d => d.id);
  const spineCount = profile.goal === 'pi' ? 2 : 1;

  // Explicit spine first (e.g. the learner's craft), then fill the remaining slots:
  // from-scratch learners lean on curiosity, everyone else on existing strength.
  const spine = (profile.spine ?? []).slice(0, spineCount);
  const pool = profile.goal === 't' && profile.interests?.length ? [...profile.interests, ...byStrength] : byStrength;
  for (const id of pool) if (spine.length < spineCount && !spine.includes(id)) spine.push(id);
  const literate = profile.goal === 'product-literate';
  // Product-literate learners grow around the core product loop, not around their own craft.
  const adjacent = new Set(literate
    ? PRODUCT_CORE.filter(a => !spine.includes(a))
    : spine.flatMap(s => domainById[s].adjacent).filter(a => !spine.includes(a)));
  const baseline = profile.goal === 'full-stack' ? 3 : 2;
  const spineTarget = literate ? 3 : 5; // they already practise their craft; no push to expert

  /** @type {TColumn[]} */
  const columns = domains.map(d => {
    const role = spine.includes(d.id) ? 'spine' : adjacent.has(d.id) ? 'adjacent' : 'bar';
    const goalTarget = role === 'spine' ? spineTarget : role === 'adjacent' ? Math.max(3, baseline) : baseline;
    return { domain: d.id, current: cur[d.id], target: Math.max(goalTarget, cur[d.id]), role };
  });
  return { spine, columns };
}

// ---- 3. which chapters close the gap --------------------------------------
const tierNeeded = (tier, target) => target >= (tier === 'deep' ? 4 : TIER_LEVEL[tier]);
const alreadyHas = (tier, current) => current >= TIER_LEVEL[tier];

function requiredChapters(tshape) {
  const col = Object.fromEntries(tshape.columns.map(c => [c.domain, c]));
  const need = new Set();
  const add = id => {
    const c = chapterById[id];
    if (need.has(id) || alreadyHas(c.tier, col[c.domain].current)) return;
    need.add(id);
    c.prereqs.forEach(add); // pull in prerequisites from other domains too
  };
  for (const c of chapters) {
    const { current, target } = col[c.domain];
    if (target <= current) continue; // no gap in this domain → nothing to learn here (it can still be pulled in as a prereq)
    if (tierNeeded(c.tier, target) && !alreadyHas(c.tier, current)) add(c.id);
  }
  return need;
}

// ---- 4. ordering ----------------------------------------------------------
/**
 * Priority of a chapter's domain when several chapters are "ready" (all prereqs met).
 * Higher = earlier in the path. Ties fall back to curriculum order.
 *
 * @param {TColumn} column   the learner's column for this chapter's domain
 * @param {string} tier      'bar' | 'stem' | 'deep'
 * @param {Profile} profile
 * @returns {number}
 */
// Spine first: an early win in your specialty keeps motivation high; breadth fills in around it.
const ROLE_WEIGHT = { spine: 100, adjacent: 40, bar: 10 };
const TIER_WEIGHT = { bar: 3, stem: 2, deep: 1 }; // within a role, climb the tiers in order

export function chapterPriority(column, tier, profile) {
  const gap = Math.max(0, column.target - column.current); // 0–5: bigger gap → slightly sooner
  return ROLE_WEIGHT[column.role] + TIER_WEIGHT[tier] * 5 + gap;
}

export function buildPath(profile) {
  const tshape = buildTShape(profile);
  const need = requiredChapters(tshape);
  const col = Object.fromEntries(tshape.columns.map(c => [c.domain, c]));
  const order = chapters.map(c => c.id);

  // Effective priority: a prereq inherits the priority of the highest chapter it unlocks,
  // so a spine chapter's cross-domain prereqs are pulled forward instead of stalling the spine.
  const dependents = {};
  for (const id of need) for (const p of chapterById[id].prereqs) if (need.has(p)) (dependents[p] ??= []).push(id);
  const memo = {};
  const prio = id => memo[id] ??= Math.max(
    chapterPriority(col[chapterById[id].domain], chapterById[id].tier, profile),
    ...(dependents[id] ?? []).map(prio),
  );

  const done = new Set();
  const path = [];
  while (done.size < need.size) {
    const ready = [...need].filter(id => !done.has(id) &&
      chapterById[id].prereqs.every(p => done.has(p) || !need.has(p)));
    ready.sort((a, b) => {
      return prio(b) - prio(a) || order.indexOf(a) - order.indexOf(b);
    });
    const next = ready[0];
    done.add(next);
    path.push(next);
  }

  const minutes = path.reduce((m, id) => m + chapterById[id].lessons.length * 5 + 60, 0);
  return {
    tshape,
    path: path.map(id => ({ id, title: chapterById[id].title, domain: chapterById[id].domain, tier: chapterById[id].tier })),
    estimate: { hours: Math.round(minutes / 60), weeks: Math.ceil(minutes / 60 / profile.weeklyHours) },
  };
}
