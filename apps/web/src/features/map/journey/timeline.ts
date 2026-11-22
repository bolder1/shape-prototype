// The skill-map journey as a timeline: every frame is a pure function of one clock `t` (seconds).
// That makes it scrubbable, replayable and frame-perfect for screen recordings: nothing depends on what happened last frame.
import { buildPath, chapters, TIER_LEVEL, type PathResult, type Profile, type Tier } from '@shape/engine';
import { NODE_H, NODE_W, type MapLayout } from '../layout';

export interface View { x: number; y: number; k: number }
export interface Viewport { w: number; h: number }

/** A learner with no design background: the "start from zero" story. */
export const ZERO_PROFILE: Profile = { goal: 't', weeklyHours: 5, selfRating: {}, spine: ['ui'] };

export interface Journey {
  path: PathResult['path'];
  /** Chapters the learner already knows (skipped by the path). Empty when starting from zero. */
  known: Set<string>;
  weeks: number;
  /** Seconds at which each path stop pops onto the map and is completed. */
  popAt: Record<string, number>;
  doneAt: Record<string, number>;
  /** Camera keyframes, in time order. */
  camera: { t: number; target: 'fit' | string; k: number }[];
  scenes: { intro: number; scan: number; reveal: number; travel: number; finale: number; end: number };
}

const SCAN = 4, REVEAL = 4.5;
const SLOW_STOPS = 5, SLOW_STEP = 1.7, FAST_STEP = 0.6, TRAVEL_IN = 1.4, FINALE_IN = 1.8, HOLD = 4.5;

export function buildJourney(result: PathResult): Journey {
  const path = result.path;
  const cols = Object.fromEntries(result.tshape.columns.map(c => [c.domain, c]));
  const known = new Set(chapters.filter(c => (cols[c.domain]?.current ?? 0) >= TIER_LEVEL[c.tier]).map(c => c.id));

  const scan = 3.5, reveal = scan + SCAN, travel = reveal + REVEAL;
  const popAt: Record<string, number> = {}, doneAt: Record<string, number> = {};
  path.forEach((p, i) => { popAt[p.id] = reveal + 0.4 + (i * (REVEAL - 1.2)) / Math.max(1, path.length); });

  // Travel: linger on the first stops so the story reads, then pick up speed.
  const camera: Journey['camera'] = [{ t: 0, target: 'fit', k: 0 }, { t: travel, target: 'fit', k: 0 }];
  let t = travel + TRAVEL_IN;
  path.forEach((p, i) => {
    const slow = i < SLOW_STOPS;
    const k = slow ? 0.95 : 0.6;
    camera.push({ t, target: p.id, k });
    doneAt[p.id] = t + (slow ? 0.5 : 0.15);
    t += slow ? SLOW_STEP : FAST_STEP;
    if (slow) camera.push({ t: t - 0.7, target: p.id, k });   // hold, then move on
  });
  const finale = t;
  camera.push({ t: finale + FINALE_IN, target: 'fit', k: 0 });
  return { path, known, weeks: result.estimate.weeks, popAt, doneAt, camera, scenes: { intro: 0, scan, reveal, travel, finale, end: finale + FINALE_IN + HOLD } };
}

export const journeyFor = (profile: Profile) => buildJourney(buildPath(profile));

// ---------- easing ----------
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
/** Overshoot then settle: the "pop" of a chapter appearing. */
export const easeOutBack = (x: number) => { const c = 1.9; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; };
/** 0 → 1 over [start, start + dur]. */
export const progress = (t: number, start: number, dur: number) => clamp01((t - start) / dur);

// ---------- camera ----------
function viewFor(target: 'fit' | string, k: number, layout: MapLayout, vp: Viewport): View {
  if (target === 'fit') {
    const fk = Math.min(vp.w / layout.width, (vp.h * 0.82) / layout.height);
    return { k: fk, x: (vp.w - layout.width * fk) / 2, y: (vp.h - layout.height * fk) / 2 - vp.h * 0.04 };
  }
  const n = layout.nodes[target];
  return { k, x: vp.w / 2 - (n.x + NODE_W / 2) * k, y: vp.h * 0.46 - (n.y + NODE_H / 2) * k };
}

/** Where the camera is at time t: eased between the surrounding keyframes. */
export function cameraAt(j: Journey, t: number, layout: MapLayout, vp: Viewport): View {
  const keys = j.camera;
  const i = keys.findIndex(c => c.t > t);
  if (i === -1) return viewFor(keys.at(-1)!.target, keys.at(-1)!.k, layout, vp);
  if (i === 0) return viewFor(keys[0].target, keys[0].k, layout, vp);
  const a = keys[i - 1], b = keys[i];
  const e = easeInOut(clamp01((t - a.t) / (b.t - a.t)));
  const va = viewFor(a.target, a.k, layout, vp), vb = viewFor(b.target, b.k, layout, vp);
  // Interpolate scale in log space so zooms feel even, and position so the midpoint stays on screen.
  const k = Math.exp(Math.log(va.k) + (Math.log(vb.k) - Math.log(va.k)) * e);
  return { k, x: va.x + (vb.x - va.x) * e, y: va.y + (vb.y - va.y) * e };
}

// ---------- captions ----------
export interface Caption { key: string; title: string; body: string; /** When this caption took over, for its fade-in. */ since: number }

const TIER_CAPTION: Record<Tier, Omit<Caption, 'key' | 'since'>> = {
  bar: { title: 'Learn the basics', body: 'Short, playable lessons. Every chapter ends with a project you can fail and redo.' },
  stem: { title: 'Become a practitioner', body: 'Real briefs, AI feedback in under a minute, and reviews that keep it stuck.' },
  deep: { title: 'Go deep in your craft', body: 'Expert chapters in the skill you chose to master.' },
};

export function captionAt(j: Journey, t: number, current: number): Caption {
  const s = j.scenes;
  if (t < s.scan) return { key: 'intro', since: 0.3, title: `${chapters.length} chapters. 14 skills.`, body: 'Product design is huge. So where do you even start?' };
  if (t < s.reveal) return j.known.size
    ? { key: 'scan', since: s.scan, title: 'First, what you already know', body: `A four-minute story maps your skills. ${j.known.size} chapters you can skip light up.` }
    : { key: 'scan', since: s.scan, title: 'Starting from zero is fine', body: 'A four-minute story maps your skills, your goal and the craft you want to master.' };
  if (t < s.travel) return { key: 'reveal', since: s.reveal, title: 'Your path appears', body: `${j.path.length} chapters, in the order that builds on itself. About ${j.weeks} weeks at your pace.` };
  if (t < s.finale) {
    const i = Math.max(0, current), tier = j.path[i]?.tier ?? 'bar';
    let first = i; while (first > 0 && j.path[first - 1].tier === tier) first--;   // where this tier's run began
    return { key: `tier-${tier}-${first}`, since: first === 0 ? s.travel : j.doneAt[j.path[first].id], ...TIER_CAPTION[tier] };
  }
  return { key: 'finale', since: s.finale, title: 'From zero to T-shaped', body: 'Broad enough to work with anyone. Deep enough to lead your craft.' };
}

/** Index of the last completed stop at time t (-1 before the first). */
export const stopAt = (j: Journey, t: number) => j.path.reduce((last, p, i) => (t >= j.doneAt[p.id] ? i : last), -1);
