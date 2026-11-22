'use client';
// The 3D grade card: spins in, floats, tilts toward the pointer. The face is painted on a 2D canvas
// (no font downloads), and the learner's Studio avatar placeholder celebrates beside it with orbiting skill tokens.
// Swap the placeholder for studio.glb when it lands (docs/07-characters.md).
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, RoundedBox, Sparkles } from '@react-three/drei';

export interface CardFace {
  grade: string; label: string; percent: number; title: string; episode: string; name: string;
  stats: { label: string; value: string }[];
  colors: [string, string];
}

const FAMILY_HEX = ['#3B6FF5', '#B97508', '#8B5CF6', '#D9467A'];
const damp = (a: number, b: number, l: number, dt: number) => THREE.MathUtils.lerp(a, b, 1 - Math.exp(-l * dt));

/** Paints the card face. 2:3, high-res so the letter stays crisp when the card fills the screen. */
function paintFace(f: CardFace): THREE.CanvasTexture {
  const W = 768, H = 1152, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d')!;
  const font = (w: number, s: number) => `${w} ${s}px Inter, ui-sans-serif, system-ui, sans-serif`;
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, f.colors[0]); bg.addColorStop(1, f.colors[1]);
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  // holographic diagonal bands
  g.globalAlpha = 0.1;
  for (let i = -H; i < W + H; i += 90) { g.fillStyle = i % 180 ? '#fff' : '#000'; g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 40, 0); g.lineTo(i + 40 - H, H); g.lineTo(i - H, H); g.fill(); }
  g.globalAlpha = 1;
  // inner frame
  g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 4; g.beginPath(); g.roundRect(32, 32, W - 64, H - 64, 36); g.stroke();
  g.fillStyle = '#fff'; g.textAlign = 'left';
  g.font = font(700, 30); g.fillText('SHAPE · GRADE CARD', 72, 104);
  g.font = font(600, 34); g.globalAlpha = 0.85; g.fillText(f.episode, 72, 160); g.globalAlpha = 1;
  g.font = font(700, 46); wrap(g, f.title, 72, 222, W - 144, 56);
  // the grade
  g.textAlign = 'center';
  g.shadowColor = 'rgba(0,0,0,0.25)'; g.shadowBlur = 30; g.shadowOffsetY = 12;
  g.font = font(900, 420); g.fillText(f.grade, W / 2, 720);
  g.shadowColor = 'transparent';
  g.font = font(800, 54); g.fillText(f.label.toUpperCase(), W / 2, 800);
  g.font = font(600, 36); g.globalAlpha = 0.9; g.fillText(`${f.percent}% mastery`, W / 2, 852); g.globalAlpha = 1;
  // stats
  g.textAlign = 'left';
  f.stats.slice(0, 3).forEach((s, i) => {
    const x = 72 + i * ((W - 144) / 3);
    g.font = font(800, 44); g.fillText(s.value, x, 966);
    g.font = font(600, 24); g.globalAlpha = 0.85; g.fillText(s.label.toUpperCase(), x, 1004); g.globalAlpha = 1;
  });
  g.font = font(600, 26); g.globalAlpha = 0.85; g.fillText(f.name, 72, 1080); g.textAlign = 'right';
  g.fillText(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), W - 72, 1080); g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}

function wrap(g: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number) {
  const words = text.split(' '); let line = '';
  for (const w of words) { const test = line ? `${line} ${w}` : w; if (g.measureText(test).width > max && line) { g.fillText(line, x, y); line = w; y += lh; } else line = test; }
  g.fillText(line, x, y);
}

function Card({ face, reduced, position }: { face: CardFace; reduced: boolean; position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const born = useRef<number | null>(null);
  const tex = useMemo(() => paintFace(face), [face]);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state, dt) => {
    const g = group.current; if (!g) return;
    born.current ??= state.clock.elapsedTime;
    const age = state.clock.elapsedTime - born.current;
    // Entrance: three spins that slow into place, scaling up with a little overshoot.
    const k = reduced ? 1 : Math.min(1, age / 1.8);
    const e = 1 - (1 - k) ** 3;
    const spin = (1 - e) * Math.PI * 6;
    const over = reduced ? 1 : 1 + Math.sin(Math.min(1, age / 1.2) * Math.PI) * 0.08;
    g.scale.setScalar(Math.max(0.001, e * over));
    // Idle: float, and lean toward the pointer.
    const tx = state.pointer.y * -0.25, ty = state.pointer.x * 0.35;
    g.rotation.x = damp(g.rotation.x, k < 1 ? 0 : tx, 5, dt);
    g.rotation.y = k < 1 ? spin : damp(g.rotation.y, ty + Math.sin(age * 0.8) * 0.06, 5, dt);
    g.position.y = Math.sin(age * 1.4) * 0.06;
  });
  return (
    <group ref={group} position={position}>
      <RoundedBox args={[2.4, 3.6, 0.1]} radius={0.14} smoothness={6}>
        <meshPhysicalMaterial color={face.colors[0]} metalness={0.6} roughness={0.25} iridescence={1} iridescenceIOR={1.6} clearcoat={1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.052]}>
        <planeGeometry args={[2.28, 3.42]} />
        <meshStandardMaterial map={tex} roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0, -0.052]} rotation-y={Math.PI}>
        <planeGeometry args={[2.28, 3.42]} />
        <meshStandardMaterial color="#1E2A4A" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Studio, the learner's avatar (placeholder): a clay figure that celebrates, with skill tokens in orbit. */
function Studio({ tokens, reduced, position, scale }: { tokens: number; reduced: boolean; position: [number, number, number]; scale: number }) {
  const body = useRef<THREE.Group>(null), orbit = useRef<THREE.Group>(null), armL = useRef<THREE.Mesh>(null), armR = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (body.current && !reduced) { body.current.position.y = Math.abs(Math.sin(t * 4)) * 0.18; body.current.rotation.y = Math.sin(t * 1.3) * 0.25; }
    if (orbit.current) orbit.current.rotation.y += dt * 1.2;
    const wave = reduced ? 2.4 : 2.4 + Math.sin(t * 8) * 0.25;
    if (armL.current) armL.current.rotation.z = wave;
    if (armR.current) armR.current.rotation.z = -wave;
  });
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.04, 0]} receiveShadow><cylinderGeometry args={[0.7, 0.8, 0.12, 40]} /><meshStandardMaterial color="#E9ECF2" /></mesh>
      <group ref={body}>
        <mesh position={[0, 0.85, 0]}><capsuleGeometry args={[0.32, 0.6, 8, 20]} /><meshStandardMaterial color="#F4EFE6" roughness={0.6} /></mesh>
        <mesh position={[0, 0.85, 0.3]}><boxGeometry args={[0.18, 0.08, 0.04]} /><meshStandardMaterial color="#2BC08A" emissive="#2BC08A" emissiveIntensity={0.4} /></mesh>
        <mesh position={[0, 1.62, 0]}><sphereGeometry args={[0.3, 32, 24]} /><meshStandardMaterial color="#E8C9AE" roughness={0.6} /></mesh>
        <mesh position={[0, 1.78, -0.04]}><sphereGeometry args={[0.31, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2.2]} /><meshStandardMaterial color="#1E2A4A" roughness={0.8} /></mesh>
        {[-0.1, 0.1].map(x => <mesh key={x} position={[x, 1.64, 0.27]}><sphereGeometry args={[0.035, 12, 8]} /><meshStandardMaterial color="#1E2A4A" /></mesh>)}
        <mesh ref={armL} position={[-0.36, 1.1, 0]}><capsuleGeometry args={[0.08, 0.42, 6, 12]} /><meshStandardMaterial color="#F4EFE6" /></mesh>
        <mesh ref={armR} position={[0.36, 1.1, 0]}><capsuleGeometry args={[0.08, 0.42, 6, 12]} /><meshStandardMaterial color="#F4EFE6" /></mesh>
      </group>
      <group ref={orbit} position={[0, 1.1, 0]}>
        {Array.from({ length: tokens }, (_, i) => {
          const a = (i / tokens) * Math.PI * 2, c = FAMILY_HEX[i % 4];
          return <mesh key={i} position={[Math.cos(a) * 0.8, Math.sin(i * 1.7) * 0.2, Math.sin(a) * 0.8]}><icosahedronGeometry args={[0.1, 0]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} /></mesh>;
        })}
      </group>
    </group>
  );
}

/**
 * Places the card and Studio for the screen's shape. Wide (desktop): side by side. Tall (phone): the card centred,
 * Studio smaller in front of its bottom-right corner, and the camera pulled back so both fit.
 */
function Layout({ face, tokens, reduced }: { face: CardFace; tokens: number; reduced: boolean }) {
  const { size } = useThree();
  const tall = size.width / size.height < 1;
  return tall ? (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8.4]} fov={40} />
      <Card face={face} reduced={reduced} position={[0, 0.25, 0]} />
      <Studio tokens={tokens} reduced={reduced} position={[1.05, -2.15, 1.2]} scale={0.55} />
    </>
  ) : (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6.4]} fov={40} />
      <Card face={face} reduced={reduced} position={[-0.55, 0, 0]} />
      <Studio tokens={tokens} reduced={reduced} position={[1.55, -1.45, 0.4]} scale={0.8} />
    </>
  );
}

export default function GradeCard3D({ face, tokens }: { face: CardFace; tokens: number }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <Canvas camera={{ position: [0, 0, 6.4], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} aria-label={`Grade card: ${face.grade}, ${face.percent}% mastery`} role="img">
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <pointLight position={[-3, -2, 3]} intensity={25} color="#2BC08A" />
      <pointLight position={[3, 2, -2]} intensity={20} color="#8B5CF6" />
      <Layout face={face} tokens={tokens} reduced={reduced} />
      <Sparkles count={20 + tokens * 15} scale={[7, 5, 3]} size={4} speed={0.5} color="#ffffff" opacity={0.8} />
    </Canvas>
  );
}
