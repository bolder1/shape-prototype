'use client';
// Placeholder 3D world built from primitives. Every object keeps the name it will have when the
// generated .glb assets arrive, so swapping art in doesn't change the story logic.
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { Scene } from '../machine';

export const STATIONS = [10, 22, 34, 46];
export const END_X = 58;
export const FLAGS = [14, 26, 38, 50];
const MINT = '#139E6F', MIDNIGHT = '#222F4F', CLAY = '#E9ECF2', CLAY_DARK = '#C9CFDB';

const damp = (a: number, b: number, lambda: number, dt: number) => THREE.MathUtils.lerp(a, b, 1 - Math.exp(-lambda * dt));

/* ---------- ground and road ---------- */
export function Ground() {
  const dashes = useMemo(() => Array.from({ length: 34 }, (_, i) => -4 + i * 2), []);
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[28, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 120]} />
        <meshStandardMaterial color="#E4EAF2" roughness={1} />
      </mesh>
      <mesh name="road" position={[29, 0.02, 0]} receiveShadow>
        <boxGeometry args={[70, 0.04, 2.6]} />
        <meshStandardMaterial color="#CDD6E3" roughness={0.9} />
      </mesh>
      {dashes.map(x => (
        <mesh key={x} position={[x, 0.05, 0]}>
          <boxGeometry args={[0.9, 0.01, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- role portals (scene: dream) ---------- */
export function Portals({ count, selected, visible }: { count: number; selected: number; visible: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = group.current; if (!g) return;
    g.scale.setScalar(damp(g.scale.x, visible ? 1 : 0.001, 4, dt));
    g.children.forEach((c, i) => { c.position.y = damp(c.position.y, i === selected ? 0.35 : 0, 6, dt); });
  });
  return (
    <group ref={group} name="portals" position={[0, 0, -7]}>
      {Array.from({ length: count }, (_, i) => {
        const x = (i - (count - 1) / 2) * 1.9, on = i === selected;
        return (
          <group key={i} position={[x, 0, Math.abs(x) * 0.18]}>
            <mesh position={[0, 0.9, 0]} castShadow>
              <torusGeometry args={[0.7, 0.09, 12, 48, Math.PI]} />
              <meshStandardMaterial color={on ? MIDNIGHT : CLAY_DARK} emissive={on ? MINT : '#000'} emissiveIntensity={on ? 0.6 : 0} />
            </mesh>
            {[-0.7, 0.7].map(px => (
              <mesh key={px} position={[px, 0.45, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.09, 0.9, 12]} />
                <meshStandardMaterial color={on ? MIDNIGHT : CLAY_DARK} />
              </mesh>
            ))}
            <mesh position={[0, 0.9, -0.02]}>
              <circleGeometry args={[0.62, 32, 0, Math.PI]} />
              <meshStandardMaterial color={on ? MINT : '#F7F8FB'} transparent opacity={on ? 0.35 : 0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ---------- stations ---------- */
function Lamp({ color, lit }: { color: string; lit: number }) {
  return (
    <group position={[1.9, 0, 0.6]}>
      <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.04, 0.05, 1.8, 8]} /><meshStandardMaterial color={CLAY_DARK} /></mesh>
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.16, 20, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15 + lit * 2.2} />
      </mesh>
      <pointLight position={[0, 1.85, 0.3]} color={color} intensity={lit * 5} distance={6} decay={2} />
    </group>
  );
}

function Discover({ color, lit }: { color: string; lit: number }) {
  const notes = Math.ceil(lit * 8);
  return (
    <group>
      <RoundedBox args={[2.6, 1.7, 0.08]} radius={0.04} position={[0, 1.35, -0.3]} castShadow><meshStandardMaterial color="#FFFFFF" /></RoundedBox>
      {[0.25, 1.05].map(x => <mesh key={x} position={[x - 0.65, 0.25, -0.3]}><boxGeometry args={[0.06, 0.5, 0.06]} /><meshStandardMaterial color={CLAY_DARK} /></mesh>)}
      {Array.from({ length: notes }, (_, i) => (
        <mesh key={i} name="sticky-note" position={[-0.95 + (i % 4) * 0.62, 1.7 - Math.floor(i / 4) * 0.62, -0.24]} rotation-z={((i * 37) % 9 - 4) * 0.02}>
          <boxGeometry args={[0.46, 0.46, 0.02]} />
          <meshStandardMaterial color={['#FDE68A', '#A7F3D0', '#BFDBFE', '#FBCFE8'][i % 4]} />
        </mesh>
      ))}
      <group name="magnifier" position={[-1.6, 0.55, 0.5]} rotation-z={0.5}>
        <mesh><torusGeometry args={[0.32, 0.05, 12, 32]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, -0.55, 0]}><cylinderGeometry args={[0.05, 0.05, 0.5, 10]} /><meshStandardMaterial color={MIDNIGHT} /></mesh>
      </group>
    </group>
  );
}

function Design({ color, lit }: { color: string; lit: number }) {
  const cards = Math.ceil(lit * 4);
  const curve = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(-0.8, 0, 0), new THREE.Vector3(-0.2, 0.05, 0), new THREE.Vector3(0.3, 0.6, 0), new THREE.Vector3(0.9, 0.7, 0)]), []);
  return (
    <group>
      <group name="drafting-table" position={[0, 0, -0.2]}>
        <RoundedBox args={[2.2, 0.08, 1.3]} radius={0.03} position={[0, 0.95, 0]} rotation-x={-0.25} castShadow><meshStandardMaterial color="#FFFFFF" /></RoundedBox>
        {[[-0.95, -0.5], [0.95, -0.5], [-0.95, 0.5], [0.95, 0.5]].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.45, z]}><cylinderGeometry args={[0.04, 0.04, 0.9, 8]} /><meshStandardMaterial color={CLAY_DARK} /></mesh>
        ))}
        <mesh position={[0, 1.02, 0.05]} rotation-x={-0.25 - Math.PI / 2}>
          <planeGeometry args={[1.6, 0.9]} />
          <meshStandardMaterial color={lit > 0.5 ? '#EEF2FF' : '#F4F5F7'} />
        </mesh>
      </group>
      <group name="component-stack" position={[-1.7, 0, 0.5]}>
        {Array.from({ length: cards }, (_, i) => (
          <RoundedBox key={i} args={[0.7, 0.08, 0.45]} radius={0.03} position={[0, 0.06 + i * 0.1, 0]} rotation-y={i * 0.12} castShadow>
            <meshStandardMaterial color={i % 2 ? color : '#FFFFFF'} />
          </RoundedBox>
        ))}
      </group>
      <mesh name="motion-curve" position={[1.6, 1.6, -0.2]} scale={lit > 0.2 ? 1 : 0.001}>
        <tubeGeometry args={[curve, 40, 0.035, 8, false]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Grow({ color, lit }: { color: string; lit: number }) {
  const bars = [0.35, 0.6, 0.9, 1.3];
  return (
    <group>
      <mesh name="launch-stage" position={[0, 0.1, -0.2]} receiveShadow castShadow>
        <cylinderGeometry args={[1.25, 1.35, 0.2, 40]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <group name="growth-chart" position={[-0.45, 0.2, -0.2]}>
        {bars.map((h, i) => {
          const height = h * (0.25 + lit * 0.75);
          return <RoundedBox key={i} args={[0.24, height, 0.24]} radius={0.04} position={[i * 0.32, height / 2, 0]} castShadow><meshStandardMaterial color={i === bars.length - 1 ? MINT : color} /></RoundedBox>;
        })}
      </group>
      <mesh name="megaphone" position={[1.7, 0.7, 0.4]} rotation-z={Math.PI / 2 + 0.3}>
        <coneGeometry args={[0.32, 0.8, 24, 1, true]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Build({ color, lit }: { color: string; lit: number }) {
  return (
    <group>
      <group name="terminal" position={[-0.4, 0, -0.3]}>
        <RoundedBox args={[1.5, 0.08, 0.9]} radius={0.03} position={[0, 0.8, 0]} castShadow><meshStandardMaterial color="#FFFFFF" /></RoundedBox>
        <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.06, 0.08, 0.8, 10]} /><meshStandardMaterial color={CLAY_DARK} /></mesh>
        <RoundedBox args={[1.1, 0.7, 0.06]} radius={0.03} position={[0, 1.25, -0.25]} castShadow><meshStandardMaterial color={MIDNIGHT} /></RoundedBox>
        <mesh position={[0, 1.25, -0.215]}>
          <planeGeometry args={[0.98, 0.58]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2 + lit * 1.4} />
        </mesh>
      </group>
      <group name="workshop-table" position={[1.5, 0, 0.4]}>
        <mesh position={[0, 0.55, 0]} castShadow><cylinderGeometry args={[0.55, 0.55, 0.06, 32]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
        <mesh position={[0, 0.27, 0]}><cylinderGeometry args={[0.05, 0.05, 0.55, 8]} /><meshStandardMaterial color={CLAY_DARK} /></mesh>
        {[0, 2.1, 4.2].map(a => (
          <mesh key={a} position={[Math.cos(a) * 0.85, 0.2, Math.sin(a) * 0.85]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.4, 16]} /><meshStandardMaterial color={a > 2 && lit > 0.5 ? color : CLAY} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const STATION_KINDS = [Discover, Design, Grow, Build];

export function Station({ index, color, lit }: { index: number; color: string; lit: number }) {
  const Kind = STATION_KINDS[index];
  // Platform tinted with the family colour so each station reads as its own place.
  const platform = useMemo(() => new THREE.Color('#FFFFFF').lerp(new THREE.Color(color), 0.16 + lit * 0.12), [color, lit]);
  return (
    <group name={`station-${index}`} position={[STATIONS[index], 0, -2.8]} scale={1.3}>
      <mesh position={[0, 0.012, 0.6]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[2.6, 48]} />
        <meshStandardMaterial color={platform} />
      </mesh>
      <mesh position={[0, 0.006, 0.6]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.6, 2.72, 64]} />
        <meshStandardMaterial color={color} transparent opacity={0.35 + lit * 0.5} />
      </mesh>
      <Kind color={color} lit={lit} />
      <Lamp color={color} lit={lit} />
    </group>
  );
}

/* ---------- milestone flags (scene: road) ---------- */
export function Flags({ visible }: { visible: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => { const g = group.current; if (g) g.children.forEach((c, i) => c.scale.setScalar(damp(c.scale.x, visible ? 1 : 0.001, 3 + i, dt))); });
  return (
    <group ref={group} name="milestones">
      {FLAGS.map((x, i) => (
        <group key={x} position={[x, 0, 1.6]} scale={0.001}>
          <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.035, 0.035, 1.6, 8]} /><meshStandardMaterial color={MIDNIGHT} /></mesh>
          <mesh position={[0.32, 1.38, 0]} castShadow><boxGeometry args={[0.6, 0.36, 0.03]} /><meshStandardMaterial color={i === FLAGS.length - 1 ? MINT : '#FFFFFF'} /></mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- the learner's character (placeholder until the generated avatar lands) ---------- */
export function Character({ targetX, color, tokens, future, reducedMotion, xRef }: {
  targetX: number; color: string; tokens: string[]; future: boolean; reducedMotion: boolean; xRef: MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null), body = useRef<THREE.Group>(null), orbit = useRef<THREE.Group>(null), aura = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const g = group.current; if (!g) return;
    const dx = targetX - g.position.x;
    const step = reducedMotion ? dx : Math.sign(dx) * Math.min(Math.abs(dx), dt * 7);
    g.position.x += step;
    xRef.current = g.position.x;
    const moving = Math.abs(dx) > 0.05;
    const t = state.clock.elapsedTime;
    if (body.current) {
      body.current.position.y = moving ? Math.abs(Math.sin(g.position.x * 3)) * 0.12 : Math.sin(t * 2) * 0.03;
      body.current.rotation.y = damp(body.current.rotation.y, moving ? 0 : 0.5, 4, dt);
    }
    if (orbit.current) orbit.current.rotation.y += dt * 0.9;
    g.scale.setScalar(damp(g.scale.x, future ? 1.25 : 1, 3, dt));
    if (aura.current) {
      const m = aura.current.material as THREE.MeshStandardMaterial;
      m.opacity = damp(m.opacity, future ? 0.28 : 0, 3, dt);
      aura.current.scale.setScalar(1 + Math.sin(t * 2.4) * 0.05);
    }
  });
  return (
    <group ref={group} name="learner" position={[0, 0, 0]}>
      <group ref={body}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <capsuleGeometry args={[0.32, 0.6, 8, 20]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
        <mesh position={[0, 1.52, 0]} castShadow>
          <sphereGeometry args={[0.3, 32, 24]} />
          <meshStandardMaterial color="#F3E1D2" roughness={0.6} />
        </mesh>
        {[-0.1, 0.1].map(x => <mesh key={x} position={[x, 1.55, 0.27]}><sphereGeometry args={[0.035, 12, 8]} /><meshStandardMaterial color={MIDNIGHT} /></mesh>)}
      </group>
      <group ref={orbit} position={[0, 1.15, 0]} name="skill-tokens">
        {tokens.map((c, i) => {
          const a = (i / Math.max(1, tokens.length)) * Math.PI * 2;
          return <mesh key={i} position={[Math.cos(a) * 0.72, Math.sin(i * 1.7) * 0.15, Math.sin(a) * 0.72]}><sphereGeometry args={[0.08, 16, 12]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.35} /></mesh>;
        })}
      </group>
      <mesh ref={aura} position={[0, 0.9, 0]}>
        <sphereGeometry args={[1.05, 32, 24]} />
        <meshStandardMaterial color={MINT} emissive={MINT} emissiveIntensity={0.6} transparent opacity={0} depthWrite={false} />
      </mesh>
      {future && (
        <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.75, 0.9, 48]} />
          <meshStandardMaterial color={MINT} emissive={MINT} emissiveIntensity={0.8} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- camera: glides between scenes, offset on desktop so the subject clears the panel ---------- */
export function CameraRig({ scene, station, xRef, reducedMotion, panelOffset }: {
  scene: Scene; station: number; xRef: MutableRefObject<number>; reducedMotion: boolean; panelOffset: number;
}) {
  const camera = useThree(s => s.camera) as THREE.PerspectiveCamera;
  const size = useThree(s => s.size);
  const look = useRef(new THREE.Vector3(0, 1, 0));
  const tmpPos = useMemo(() => new THREE.Vector3(), []), tmpLook = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (panelOffset > 0) camera.setViewOffset(size.width, size.height, -panelOffset / 2, 0, size.width, size.height);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }, [camera, size, panelOffset]);

  useFrame((_, dt) => {
    const X = STATIONS[Math.max(0, Math.min(3, station))], cx = xRef.current;
    switch (scene) {
      case 'arrival': tmpPos.set(-7, 3.2, 9); tmpLook.set(0, 1, 0); break;
      case 'dream': tmpPos.set(0, 2.8, 7.5); tmpLook.set(0, 1.1, -7); break;
      case 'today': case 'interests': tmpPos.set(2.8, 1.9, 4.8); tmpLook.set(0.2, 1.1, 0); break;
      case 'journey': case 'check': tmpPos.set(X - 1.2, 4.6, 10.5); tmpLook.set(X + 0.6, 0.9, -2.4); break;
      case 'profile': tmpPos.set(22, 22, 30); tmpLook.set(28, 0, -1); break;
      case 'future': tmpPos.set(cx - 5.5, 3.6, 10); tmpLook.set(cx + 3, 1.3, 0); break;
      default: tmpPos.set(28, 28, 26); tmpLook.set(29, 0, -1);
    }
    const k = reducedMotion ? 1 : 1 - Math.exp(-2.2 * dt);
    camera.position.lerp(tmpPos, k);
    look.current.lerp(tmpLook, k);
    camera.lookAt(look.current);
  });
  return null;
}
