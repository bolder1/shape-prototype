'use client';
// Pieces every 3D skill-map scene shares: colours, theme, camera flights and the label overlay.
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { FamilyId } from '@/lib/skills';

// Canvas can't read CSS variables, so the family colours are mirrored here (keep in sync with globals.css).
export const FAMILY_HEX: Record<FamilyId, string> = { discover: '#3B6FF5', design: '#B97508', grow: '#8B5CF6', build: '#D9467A' };
export const MINT = '#2BC08A';
export const AMBER = '#F79009';

export type Goal = { position: THREE.Vector3; target: THREE.Vector3 };

/** Follows the app's dark-mode class, so the scene matches the rest of the page. */
export function useDark() {
  return useSyncExternalStore(
    cb => { const o = new MutationObserver(cb); o.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] }); return () => o.disconnect(); },
    () => document.documentElement.classList.contains('dark-mode'),
    () => false,
  );
}

export function canUseWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

/** Smoothly moves the camera to a goal; the scene clears the goal when the learner drags. */
export function CameraRig({ goal, controls, reducedMotion }: {
  goal: Goal | null; controls: React.RefObject<OrbitControlsImpl | null>; reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const active = useRef(goal);
  useEffect(() => { active.current = goal; }, [goal]);
  useFrame(() => {
    const g = active.current, c = controls.current; if (!g || !c) return;
    const k = reducedMotion ? 1 : 0.07;
    camera.position.lerp(g.position, k);
    c.target.lerp(g.target, k);
    c.update();
    if (camera.position.distanceTo(g.position) < 0.05) active.current = null;
  });
  return null;
}

/**
 * Text labels live in one plain DOM layer over the canvas (drei's Html makes a React root per label,
 * which React 19 complains about). Each frame this moves every label node to its anchor's screen spot.
 * `facing` hides labels on the far side of a sphere: the anchor's outward normal must point at the camera.
 */
export interface Anchor { key: string; at: THREE.Vector3; facing?: boolean }
export type LabelLookup = (key: string) => HTMLElement | null | undefined;

export function LabelProjector({ anchors, labelEl }: { anchors: Anchor[]; labelEl: LabelLookup }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  const n = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    for (const a of anchors) {
      const el = labelEl(a.key); if (!el) continue;
      const back = a.facing && n.copy(a.at).normalize().dot(v.copy(camera.position).sub(a.at).normalize()) < 0.15;
      v.copy(a.at).project(camera);
      const hidden = back || v.z > 1 || Math.abs(v.x) > 1.2 || Math.abs(v.y) > 1.2;
      el.style.transform = `translate3d(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px, 0)`;
      el.style.visibility = hidden ? 'hidden' : 'visible';
    }
  });
  return null;
}
