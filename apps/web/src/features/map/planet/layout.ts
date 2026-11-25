// Where everything sits on the skill planet. Pure data (three.js vectors only), no rendering.
//
// Each skill family is a continent around one of four evenly spread points (a tetrahedron).
// Skills are regions around their family's centre; chapters are towns clustered in their skill's region.
import * as THREE from 'three';
import { chapters, type DomainId, type Tier } from '@shape/engine';
import { FAMILY_ORDER, skillsInFamily, type FamilyId } from '@/lib/skills';

export const RADIUS = 6;
export const TIER_HEIGHT: Record<Tier, number> = { bar: 0.22, stem: 0.42, deep: 0.7 };

export interface Town { id: string; domain: DomainId; tier: Tier; normal: THREE.Vector3; height: number }
export interface Region { domain: DomainId; family: FamilyId; normal: THREE.Vector3 }

const FAMILY_CENTRE: Record<FamilyId, THREE.Vector3> = {
  discover: new THREE.Vector3(0.9, 0.75, 0.85).normalize(),
  design: new THREE.Vector3(-0.9, 0.35, 0.8).normalize(),
  grow: new THREE.Vector3(0.2, -0.85, 0.6).normalize(),
  build: new THREE.Vector3(0.6, 0.15, -0.95).normalize(),
};

/** Two directions along the surface at a point, to place things around it. */
function tangents(n: THREE.Vector3) {
  const t1 = new THREE.Vector3().crossVectors(n, Math.abs(n.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize();
  const t2 = new THREE.Vector3().crossVectors(n, t1).normalize();
  return [t1, t2] as const;
}

/** A point `dist` (in radians of arc, roughly) away from `n`, in direction `angle`. */
function around(n: THREE.Vector3, angle: number, dist: number) {
  const [t1, t2] = tangents(n);
  return n.clone().addScaledVector(t1, Math.cos(angle) * dist).addScaledVector(t2, Math.sin(angle) * dist).normalize();
}

export function buildPlanet() {
  const towns: Record<string, Town> = {};
  const regions: Region[] = [];
  for (const family of FAMILY_ORDER) {
    const skills = skillsInFamily(family);
    const spread = skills.length > 4 ? 0.42 : 0.26;
    skills.forEach((domain, k) => {
      const normal = skills.length === 1 ? FAMILY_CENTRE[family].clone() : around(FAMILY_CENTRE[family], (k / skills.length) * Math.PI * 2, spread);
      regions.push({ domain, family, normal });
      // Towns spiral out from the region centre (golden angle), deeper chapters nearer the middle.
      const list = chapters.filter(c => c.domain === domain).sort((a, b) => TIER_HEIGHT[b.tier] - TIER_HEIGHT[a.tier]);
      list.forEach((c, j) => {
        towns[c.id] = { id: c.id, domain, tier: c.tier, height: TIER_HEIGHT[c.tier], normal: j === 0 ? normal.clone() : around(normal, j * 2.39996, 0.075 * Math.sqrt(j)) };
      });
    });
  }
  return { towns, regions };
}

/** A flight between two towns: a great-circle arc lifted off the surface, highest in the middle. */
export function flightArc(a: THREE.Vector3, b: THREE.Vector3, steps = 24): [number, number, number][] {
  const angle = a.angleTo(b);
  const lift = 0.2 + angle * 0.7;
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = new THREE.Vector3().copy(a).lerp(b, t).normalize();
    if (angle > 3.1) p.copy(a).applyAxisAngle(new THREE.Vector3(0, 1, 0), t * angle); // near-opposite points: go around
    const r = RADIUS + 0.12 + Math.sin(Math.PI * t) * lift;
    pts.push([p.x * r, p.y * r, p.z * r]);
  }
  return pts;
}
