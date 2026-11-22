// Personalization engine: profile → T-shape → ordered personal path.
// Pure functions, no I/O: runs on the server, in tests, and in the browser (live T preview).
import { domains, domainById, chapters, chapterById, TIER_LEVEL, type DomainId, type Tier } from './curriculum';

/**
 * product-literate: people from neighbouring crafts (graphics, motion, front-end, marketing, sales, PM)
 * who keep their own deep skill and want to understand the whole product, not change careers.
 */
export type Goal = 'i-to-t' | 't' | 'pi' | 'full-stack' | 'product-literate';
export type ColumnRole = 'spine' | 'adjacent' | 'bar';

export interface Profile {
  selfRating: Partial<Record<DomainId, number>>;   // 0–5 per skill, from onboarding
  calibration?: Partial<Record<DomainId, number>>; // 0–1 quiz score; caps self-rating
  goal: Goal;
  spine?: DomainId[];                               // explicit deep skill(s), e.g. the learner's craft
  interests?: DomainId[];                           // for "not sure yet" learners
  weeklyHours: number;
}
export interface TColumn { domain: DomainId; current: number; target: number; role: ColumnRole }
export interface TShape { spine: DomainId[]; columns: TColumn[] }
export interface PathItem { id: string; title: string; domain: DomainId; tier: Tier }
export interface PathResult { tshape: TShape; path: PathItem[]; estimate: { hours: number; weeks: number } }

/** Skills everyone who "wants to understand the whole product" should reach Practitioner in. */
export const PRODUCT_CORE: DomainId[] = ['fd', 'rs', 'ia', 'st'];

/** Home skill for each starting discipline; becomes the default deep skill. */
export const ROLE_HOME: Record<string, DomainId | null> = {
  'student': null, 'ui-designer': 'ui', 'ux-designer': 'ia', 'product-designer': 'ia', 'researcher': 'rs',
  'graphic-designer': 'br', 'motion-designer': 'pr', 'brand-marketing': 'br', 'marketer': 'gr',
  'sales': 'bz', 'frontend-engineer': 'dc', 'product-manager': 'st',
};

// ---- 1. current level per skill: self-rating capped by evidence -------------
export function currentLevels(profile: Profile): Record<DomainId, number> {
  return Object.fromEntries(domains.map(d => {
    const self = profile.selfRating[d.id] ?? 0;
    const cal = profile.calibration?.[d.id];
    const level = cal == null ? self : Math.min(self, Math.round(cal * 5));
    return [d.id, Math.max(0, Math.min(5, level))];
  })) as Record<DomainId, number>;
}

// ---- 2. T-shape (targets) ------------------------------------------------------
export function buildTShape(profile: Profile): TShape {
  const cur = currentLevels(profile);
  const byStrength = [...domains].sort((a, b) => cur[b.id] - cur[a.id]).map(d => d.id);
  const spineCount = profile.goal === 'pi' ? 2 : 1;

  // Explicit deep skill first, then fill: from-scratch learners lean on curiosity, others on strength.
  const spine = (profile.spine ?? []).slice(0, spineCount);
  const pool = profile.goal === 't' && profile.interests?.length ? [...profile.interests, ...byStrength] : byStrength;
  for (const id of pool) if (spine.length < spineCount && !spine.includes(id)) spine.push(id);

  const literate = profile.goal === 'product-literate';
  const adjacent = new Set<DomainId>(literate
    ? PRODUCT_CORE.filter(a => !spine.includes(a))
    : spine.flatMap(s => domainById[s].adjacent).filter(a => !spine.includes(a)));
  const baseline = profile.goal === 'full-stack' ? 3 : 2;
  const spineTarget = literate ? 3 : 5; // neighbouring crafts already practise theirs

  const columns: TColumn[] = domains.map(d => {
    const role: ColumnRole = spine.includes(d.id) ? 'spine' : adjacent.has(d.id) ? 'adjacent' : 'bar';
    const goalTarget = role === 'spine' ? spineTarget : role === 'adjacent' ? Math.max(3, baseline) : baseline;
    return { domain: d.id, current: cur[d.id], target: Math.max(goalTarget, cur[d.id]), role };
  });
  return { spine, columns };
}

// ---- 3. which chapters close the gap -------------------------------------------
const tierNeeded = (tier: Tier, target: number) => target >= (tier === 'deep' ? 4 : TIER_LEVEL[tier]);
const alreadyHas = (tier: Tier, current: number) => current >= TIER_LEVEL[tier];

function requiredChapters(tshape: TShape): Set<string> {
  const col = Object.fromEntries(tshape.columns.map(c => [c.domain, c])) as Record<DomainId, TColumn>;
  const need = new Set<string>();
  const add = (id: string) => {
    const c = chapterById[id];
    if (need.has(id) || alreadyHas(c.tier, col[c.domain].current)) return;
    need.add(id);
    c.prereqs.forEach(add); // prerequisites from other skills come along
  };
  for (const c of chapters) {
    const { current, target } = col[c.domain];
    if (target <= current) continue; // no gap → nothing to learn here (may still arrive as a prereq)
    if (tierNeeded(c.tier, target) && !alreadyHas(c.tier, current)) add(c.id);
  }
  return need;
}

// ---- 4. ordering: spine first ---------------------------------------------------
const ROLE_WEIGHT: Record<ColumnRole, number> = { spine: 100, adjacent: 40, bar: 10 };
const TIER_WEIGHT: Record<Tier, number> = { bar: 3, stem: 2, deep: 1 };

/** Higher = earlier. An early win in your deep skill keeps motivation high. */
export function chapterPriority(column: TColumn, tier: Tier): number {
  const gap = Math.max(0, column.target - column.current);
  return ROLE_WEIGHT[column.role] + TIER_WEIGHT[tier] * 5 + gap;
}

export function buildPath(profile: Profile): PathResult {
  const tshape = buildTShape(profile);
  const need = requiredChapters(tshape);
  const col = Object.fromEntries(tshape.columns.map(c => [c.domain, c])) as Record<DomainId, TColumn>;
  const order = chapters.map(c => c.id);

  // A prereq inherits the priority of the highest chapter it unlocks, so deep-skill chapters never stall.
  const dependents: Record<string, string[]> = {};
  for (const id of need) for (const p of chapterById[id].prereqs) if (need.has(p)) (dependents[p] ??= []).push(id);
  const memo: Record<string, number> = {};
  const prio = (id: string): number => memo[id] ??= Math.max(
    chapterPriority(col[chapterById[id].domain], chapterById[id].tier),
    ...(dependents[id] ?? []).map(prio),
  );

  const done = new Set<string>();
  const path: string[] = [];
  while (done.size < need.size) {
    const ready = [...need].filter(id => !done.has(id) && chapterById[id].prereqs.every(p => done.has(p) || !need.has(p)));
    ready.sort((a, b) => prio(b) - prio(a) || order.indexOf(a) - order.indexOf(b));
    done.add(ready[0]);
    path.push(ready[0]);
  }

  const minutes = path.reduce((m, id) => m + chapterById[id].lessons.length * 5 + 60, 0);
  return {
    tshape,
    path: path.map(id => { const c = chapterById[id]; return { id, title: c.title, domain: c.domain, tier: c.tier }; }),
    estimate: { hours: Math.round(minutes / 60), weeks: Math.ceil(minutes / 60 / Math.max(1, profile.weeklyHours)) },
  };
}
