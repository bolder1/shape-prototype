'use client';
// Skill planet: drag to spin a small world. Skill families are continents, skills are regions, chapters are towns.
// Tower height = depth. Glowing towns = done (they light up the night side). Your path flies from town to town.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Line, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ArrowsOutCardinalIcon, CrosshairIcon, PathIcon, StopIcon } from '@phosphor-icons/react/ssr';
import { chapterById, unlocks } from '@shape/engine';
import { Button } from '@/components/base/buttons/button';
import { SKILL_META } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { TIER_NAME, type ChapterInfo } from '../model';
import type { ViewProps } from '../views/shared';
import { AMBER, CameraRig, canUseWebGL, FAMILY_HEX, LabelProjector, MINT, useDark, type Anchor, type Goal, type LabelLookup } from '../three/shared';
import { buildPlanet, flightArc, RADIUS, type Town } from './layout';

const planet = buildPlanet();
const UP = new THREE.Vector3(0, 1, 0);
const HOME: Goal = { position: new THREE.Vector3(5, 7, 22), target: new THREE.Vector3() };
const facing = (n: THREE.Vector3) => new THREE.Quaternion().setFromUnitVectors(UP, n);
const focusOn = (t: Town): Goal => ({ position: t.normal.clone().multiplyScalar(14).add(new THREE.Vector3(0, 1.5, 0)), target: new THREE.Vector3() });

const LABELS: (Anchor & { text: string; color: string })[] = planet.regions.map(r => ({
  key: r.domain, at: r.normal.clone().multiplyScalar(RADIUS + 0.9), facing: true, text: SKILL_META[r.domain].short, color: FAMILY_HEX[r.family],
}));

/** Land: a patch of hex tiles under every skill region, tinted by family. One instanced mesh for all of it. */
function Land({ dark }: { dark: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const tiles = useMemo(() => {
    const out: { n: THREE.Vector3; color: THREE.Color }[] = [];
    const sea = new THREE.Color(dark ? '#0E1526' : '#DCE6F2');
    for (const r of planet.regions) {
      const [t1, t2] = (() => {
        const a = new THREE.Vector3().crossVectors(r.normal, Math.abs(r.normal.y) < 0.9 ? UP : new THREE.Vector3(1, 0, 0)).normalize();
        return [a, new THREE.Vector3().crossVectors(r.normal, a).normalize()];
      })();
      for (let q = -2; q <= 2; q++) for (let s = -2; s <= 2; s++) {
        if (Math.abs(q + s) > 2) continue;                       // axial hex grid, radius 2 → 19 tiles
        const x = (q + s / 2) * 0.09, y = s * 0.078;
        const n = r.normal.clone().addScaledVector(t1, x).addScaledVector(t2, y).normalize();
        const shade = 0.58 + ((q * 7 + s * 3 + 20) % 5) * 0.035;  // small variation so land isn't flat
        out.push({ n, color: new THREE.Color(FAMILY_HEX[r.family]).lerp(sea, dark ? shade + 0.06 : shade) });
      }
    }
    return out;
  }, [dark]);
  useEffect(() => {
    const m = mesh.current; if (!m) return;
    const o = new THREE.Object3D();
    tiles.forEach((t, i) => {
      o.position.copy(t.n).multiplyScalar(RADIUS + 0.01);
      o.quaternion.copy(facing(t.n));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, t.color);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [tiles]);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, tiles.length]} receiveShadow>
      <cylinderGeometry args={[0.28, 0.3, 0.06, 6]} />
      <meshStandardMaterial roughness={0.9} flatShading />
    </instancedMesh>
  );
}

type Highlight = 'selected' | 'needs' | 'opens' | null;

function TownMesh({ town, info, highlight, faded, ghost, dark, onPick, onHover }: {
  town: Town; info: ChapterInfo; highlight: Highlight; faded: boolean; ghost: boolean; dark: boolean;
  onPick: (id: string) => void; onHover: (id: string | null) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const done = info.status === 'done', progress = info.status === 'progress';
  const color = FAMILY_HEX[SKILL_META[town.domain].family];
  const q = useMemo(() => facing(town.normal), [town.normal]);
  const pos = useMemo(() => town.normal.clone().multiplyScalar(RADIUS + 0.06), [town.normal]);
  useFrame(() => {
    const g = group.current; if (!g) return;
    const s = highlight === 'selected' ? 1.35 : hover ? 1.2 : 1;
    g.scale.lerp(new THREE.Vector3(s, s, s), 0.2);
  });
  const opacity = faded ? 0.15 : ghost ? 0.35 : 1;
  const ring = highlight === 'selected' ? '#FFFFFF' : highlight === 'needs' ? AMBER : highlight === 'opens' ? MINT : null;
  return (
    <group ref={group} position={pos} quaternion={q}>
      <mesh position={[0, town.height / 2, 0]} castShadow={!ghost}>
        <boxGeometry args={[0.15, town.height, 0.15]} />
        <meshStandardMaterial color={done ? MINT : ghost ? (dark ? '#3A4256' : '#AEB7C6') : color} transparent={opacity < 1} opacity={opacity}
          emissive={done ? MINT : progress ? '#FFE7A3' : '#000'} emissiveIntensity={done ? 1.4 : progress ? 0.6 : 0} roughness={0.5} />
      </mesh>
      {ring && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[0.2, 0.27, 32]} />
          <meshBasicMaterial color={ring} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* A bigger invisible target, so small towns are easy to click */}
      <mesh position={[0, town.height / 2, 0]} visible={false}
        onPointerOver={e => { e.stopPropagation(); setHover(true); onHover(town.id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); onHover(null); document.body.style.cursor = ''; }}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); if (e.delta < 5) onPick(town.id); }}>
        <sphereGeometry args={[0.24, 8, 8]} />
      </mesh>
    </group>
  );
}

/** The sun sits off to one side of the camera, so the half you're looking at is lit and the edge falls into night. */
function SunFollow({ intensity }: { intensity: number }) {
  const light = useRef<THREE.DirectionalLight>(null);
  useFrame(({ camera }) => {
    light.current?.position.copy(camera.position).applyAxisAngle(UP, 0.7).add(new THREE.Vector3(0, 6, 0));
  });
  return <directionalLight ref={light} intensity={intensity} castShadow />;
}

function Beacon({ town }: { town: Town }) {
  const ring = useRef<THREE.Mesh>(null);
  const q = useMemo(() => facing(town.normal), [town.normal]);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 2.4) * 0.18;
    ring.current.scale.set(s, s, s);
  });
  return (
    <group position={town.normal.clone().multiplyScalar(RADIUS + 0.06)} quaternion={q}>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.02, 0.12, 2.2, 12, 1, true]} />
        <meshBasicMaterial color={MINT} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.3, 0.38, 40]} />
        <meshBasicMaterial color={MINT} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene({ info, path, selectedId, nextId, focusPath, onSelect, dark, reducedMotion, goal, spinning, onUserMove, setHover, labelEl }: ViewProps & {
  dark: boolean; reducedMotion: boolean; goal: Goal | null; spinning: boolean; onUserMove: () => void; setHover: (id: string | null) => void; labelEl: LabelLookup;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  useEffect(() => { camera.position.copy(HOME.position); }, [camera]);
  const sel = selectedId ? chapterById[selectedId] : null;
  const needs = new Set(sel?.prereqs ?? []);
  const opens = new Set(selectedId ? unlocks[selectedId] : []);

  // Flights: your path in order, hop by hop. Flown legs bright, the rest dashed.
  const stops = path.map(id => planet.towns[id]).filter(Boolean);
  const doneUntil = stops.findIndex(t => info[t.id].status !== 'done');
  const split = doneUntil < 0 ? stops.length : Math.max(1, doneUntil + 1);
  // Only the next few legs ahead are drawn: the whole route at once is a ball of string.
  const AHEAD = 6;
  const legs = useMemo(() => stops.slice(1)
    .map((b, i) => ({ key: `${stops[i].id}-${b.id}`, flown: i + 1 < split, soon: i + 1 < split + AHEAD, pts: flightArc(stops[i].normal, b.normal) }))
    .filter(l => l.soon), [stops, split]);

  const next = nextId ? planet.towns[nextId] : null;
  const anchors = useMemo(() => (next && !selectedId ? [...LABELS, { key: 'beacon', at: next.normal.clone().multiplyScalar(RADIUS + 2.4), facing: true }] : LABELS), [next, selectedId]);

  return (
    <>
      <color attach="background" args={[dark ? '#070A12' : '#EEF2F7']} />
      {dark && <Stars radius={80} depth={40} count={2500} factor={3} fade speed={reducedMotion ? 0 : 0.5} />}
      <ambientLight intensity={dark ? 0.45 : 0.8} />
      <SunFollow intensity={dark ? 2.2 : 2} />

      {/* Ocean and atmosphere */}
      <mesh receiveShadow>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshStandardMaterial color={dark ? '#0E1526' : '#DCE6F2'} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh scale={1.06}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial color={dark ? '#3B6FF5' : '#9DB8F7'} transparent opacity={dark ? 0.08 : 0.12} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <Land dark={dark} />

      {legs.map(l => l.flown
        ? <Line key={l.key} points={l.pts} color={MINT} lineWidth={3} />
        : <Line key={l.key} points={l.pts} color={dark ? '#8EA6DD' : '#3B4A6B'} lineWidth={1.5} dashed dashSize={0.25} gapSize={0.2} transparent opacity={0.4} />)}

      {Object.values(planet.towns).map(t => {
        const i = info[t.id];
        const highlight: Highlight = t.id === selectedId ? 'selected' : needs.has(t.id) ? 'needs' : opens.has(t.id) ? 'opens' : null;
        const offPath = i.pathIndex == null && i.status !== 'done';
        return <TownMesh key={t.id} town={t} info={i} highlight={highlight} dark={dark} ghost={offPath}
          faded={sel ? !highlight : focusPath && offPath} onPick={onSelect} onHover={setHover} />;
      })}
      {next && !selectedId && <Beacon town={next} />}

      <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping dampingFactor={0.08} minDistance={9} maxDistance={30}
        autoRotate={spinning && !reducedMotion} autoRotateSpeed={0.5} onStart={onUserMove} />
      <CameraRig goal={goal} controls={controls} reducedMotion={reducedMotion} />
      <LabelProjector anchors={anchors} labelEl={labelEl} />
    </>
  );
}

export default function PlanetView(props: ViewProps) {
  const { info, path, selectedId, nextId } = props;
  const dark = useDark();
  const [env] = useState(() => ({ webgl: canUseWebGL(), reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }));
  const [goal, setGoal] = useState<Goal | null>(null);
  const [spinning, setSpinning] = useState(true);
  const [tour, setTour] = useState<number | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const labels = useRef<Record<string, HTMLElement | null>>({});
  const labelEl = useCallback((key: string) => labels.current[key], []);
  const stops = useMemo(() => path.filter(id => planet.towns[id]), [path]);

  // Selecting a town (here or from the panel's chips) turns the planet to face it.
  const [flownTo, setFlownTo] = useState(selectedId);
  if (selectedId !== flownTo) {
    setFlownTo(selectedId);
    if (selectedId && planet.towns[selectedId]) { setSpinning(false); setGoal(focusOn(planet.towns[selectedId])); }
  }

  const startTour = () => { setSpinning(false); setTour(0); setGoal(focusOn(planet.towns[stops[0]])); };
  const stopTour = () => { setTour(null); setGoal({ ...HOME }); };
  useEffect(() => {
    if (tour == null) return;
    const t = window.setTimeout(() => {
      const n = tour + 1;
      if (n >= stops.length) { setTour(null); setGoal({ ...HOME }); return; }
      setTour(n); setGoal(focusOn(planet.towns[stops[n]]));
    }, env.reducedMotion ? 600 : 1000);
    return () => window.clearTimeout(t);
  }, [tour, stops, env.reducedMotion]);

  if (!env.webgl) return <p className="m-auto max-w-sm p-10 text-center text-tertiary">The skill planet needs WebGL, which this browser has turned off. The Skills view shows the same map.</p>;
  const label = hover ?? (tour != null ? stops[tour] : null);

  return (
    <div className="relative h-full">
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: HOME.position.toArray(), fov: 40, near: 0.1, far: 300 }}
        aria-label="Skill planet: a 3D globe where each town is a chapter">
        <Scene {...props} dark={dark} reducedMotion={env.reducedMotion} goal={goal} spinning={spinning} setHover={setHover} labelEl={labelEl}
          onUserMove={() => { setGoal(null); setTour(null); setSpinning(false); }} />
      </Canvas>

      {/* Region labels and the "Up next" tag, moved each frame by LabelProjector */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {LABELS.map(l => (
          <span key={l.key} ref={el => { labels.current[l.key] = el; }} className="absolute top-0 left-0" style={{ visibility: 'hidden' }}>
            <span className="block -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/80 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ring-1 ring-secondary backdrop-blur" style={{ color: l.color }}>{l.text}</span>
          </span>
        ))}
        <span ref={el => { labels.current.beacon = el; }} className="absolute top-0 left-0" style={{ visibility: 'hidden' }}>
          <span className="block -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint-500 px-2 py-0.5 text-[11px] font-bold whitespace-nowrap text-brand-950 shadow">Up next</span>
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start gap-2 p-4">
        <div className="pointer-events-auto flex gap-2">
          {tour == null
            ? stops.length > 0 && <Button size="sm" color="secondary" iconLeading={PathIcon} onPress={startTour}>Fly my path</Button>
            : <Button size="sm" color="secondary" iconLeading={StopIcon} onPress={stopTour}>Stop · {tour + 1}/{stops.length}</Button>}
          {nextId && planet.towns[nextId] && <Button size="sm" color="secondary" iconLeading={CrosshairIcon} onPress={() => { setSpinning(false); setGoal(focusOn(planet.towns[nextId])); }}>Up next</Button>}
          <Button size="sm" color="tertiary" iconLeading={ArrowsOutCardinalIcon} onPress={() => { setGoal({ ...HOME }); setSpinning(true); }}>Overview</Button>
        </div>
        {label && chapterById[label] && (
          <div className="mx-auto rounded-xl bg-primary/95 px-3 py-2 text-sm shadow-lg ring-1 ring-secondary backdrop-blur">
            <span className="font-semibold text-primary">{chapterById[label].title}</span>
            <span className="text-tertiary"> · {SKILL_META[chapterById[label].domain].short} · {TIER_NAME[chapterById[label].tier]}</span>
            {info[label].pathIndex != null && <span className="text-brand-secondary"> · Stop {info[label].pathIndex! + 1}</span>}
          </div>
        )}
      </div>
      <div className={cx('pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-x-4 gap-y-1 rounded-xl bg-primary/90 px-3 py-2 text-xs text-tertiary ring-1 ring-secondary backdrop-blur', selectedId && 'hidden md:flex')}>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm" style={{ background: MINT }} />Glowing: done</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-[#B97508]" />Coloured: on your path</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-tertiary" />Grey: not on your path</span>
        <span className="flex items-center gap-1.5"><span className="h-1 w-4 rounded-full" style={{ background: MINT }} />Flights you’ve made</span>
        <span className="hidden text-quaternary lg:inline">Drag to spin · scroll to zoom · click a town</span>
      </div>
    </div>
  );
}
