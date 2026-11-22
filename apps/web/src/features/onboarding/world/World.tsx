'use client';
import { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import type { DomainId } from '@shape/engine';
import { ROLE_HOME } from '@shape/engine';
import { FAMILY_ORDER, SKILL_META, skillsInFamily } from '@/lib/skills';
import { ASPIRATIONS } from '../content';
import type { OnboardingContext, Scene } from '../machine';
import { JOURNEY, computeOutcome } from '../profile';
import { CameraRig, Character, END_X, Flags, Ground, Portals, STATIONS, Station } from './parts';

// Canvas can't read CSS variables, so the family colours are mirrored here (keep in sync with globals.css).
const FAMILY_HEX: Record<string, string> = { discover: '#3B6FF5', design: '#B97508', grow: '#8B5CF6', build: '#D9467A' };

export interface WorldProps { scene: Scene; ctx: OnboardingContext; reducedMotion: boolean; panelOffset: number }

export default function World({ scene, ctx, reducedMotion, panelOffset }: WorldProps) {
  const xRef = useRef(0);

  // Which station the story is at (journey: current skill; check: the skill being quizzed).
  const station = useMemo(() => {
    const id: DomainId | undefined = scene === 'check' ? ctx.quizIds[ctx.quizIndex] : JOURNEY[ctx.skillIndex];
    return id ? FAMILY_ORDER.indexOf(SKILL_META[id].family) : 0;
  }, [scene, ctx.quizIds, ctx.quizIndex, ctx.skillIndex]);

  // Stations light up as their skills are answered (higher levels = brighter).
  const lit = useMemo(() => FAMILY_ORDER.map(f => {
    const ids = skillsInFamily(f);
    return ids.reduce((s, id) => s + (ctx.ratings[id] != null ? 0.4 + (ctx.ratings[id]! / 5) * 0.6 : 0), 0) / ids.length;
  }), [ctx.ratings]);

  const future = scene === 'future' || scene === 'road' || scene === 'pricing';

  // The character carries a token for every skill practised (today) or reached (future).
  const tokens = useMemo(() => {
    if (future && ctx.aspiration) {
      const o = computeOutcome(ctx);
      return o.result.tshape.columns.filter(c => c.target >= 3).map(c => FAMILY_HEX[SKILL_META[c.domain].family]);
    }
    return JOURNEY.filter(id => (ctx.ratings[id] ?? 0) >= 3).map(id => FAMILY_HEX[SKILL_META[id].family]);
  }, [future, ctx]);

  const characterColor = useMemo(() => {
    const home = ctx.role ? ROLE_HOME[ctx.role] : null;
    return home ? FAMILY_HEX[SKILL_META[home].family] : '#6B7489';
  }, [ctx.role]);

  // On the road the character stands beside the station (not in front of it), so the station stays visible.
  const targetX = future ? END_X : scene === 'journey' || scene === 'check' || scene === 'profile' ? STATIONS[station] - 3.6 : 0;
  const selectedPortal = ASPIRATIONS.findIndex(a => a.id === ctx.aspiration);

  return (
    <Canvas shadows="percentage" dpr={[1, 1.75]} camera={{ position: [-7, 3.2, 9], fov: 42, near: 0.1, far: 200 }}
      aria-label="An illustrated road through the stages of building a product">
      <color attach="background" args={['#EAF0F7']} />
      <fog attach="fog" args={['#EAF0F7', 30, 95]} />
      <hemisphereLight args={['#FFFFFF', '#C9D3E3', 1.5]} />
      <directionalLight position={[-12, 8, 14]} intensity={0.5} color="#DCE6FF" />
      <directionalLight position={[30, 26, 16]} intensity={1.8} castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={20} shadow-camera-bottom={-20}
        shadow-camera-far={90}>
        <object3D attach="target" position={[30, 0, 0]} />
      </directionalLight>

      <Ground />
      <Portals count={ASPIRATIONS.length} selected={selectedPortal} visible={scene === 'arrival' || scene === 'dream'} />
      {FAMILY_ORDER.map((f, i) => <Station key={f} index={i} color={FAMILY_HEX[f]} lit={lit[i]} />)}
      <Flags visible={scene === 'road' || scene === 'pricing'} />
      <Character targetX={targetX} color={characterColor} tokens={tokens} future={future} reducedMotion={reducedMotion} xRef={xRef} />
      <CameraRig scene={scene} station={station} xRef={xRef} reducedMotion={reducedMotion} panelOffset={panelOffset} />
    </Canvas>
  );
}
