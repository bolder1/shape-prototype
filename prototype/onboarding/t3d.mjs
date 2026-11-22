// The 3D T: a row of 14 skill blocks (the bar). Under each one hangs a stack of level blocks.
// The learner's deep-skill column wears Tee's eyes: the mascot lives in your strongest skill.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const GAP = 1.12, BAR_Y = 3, STEP = 1.06;
const easeOutBack = t => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);

export function createT(container, { order, colors, onColumnClick }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { enableZoom: false, enablePan: false, enableDamping: true, minPolarAngle: 0.9, maxPolarAngle: 1.9 });

  scene.add(new THREE.HemisphereLight(0xffffff, 0xffe6cc, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(6, 12, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10 });
  scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.12 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -3.6; ground.receiveShadow = true;
  scene.add(ground);

  const pivot = new THREE.Group(); scene.add(pivot);
  const geo = new RoundedBoxGeometry(1, 1, 1, 4, 0.18);
  const ghostGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.96, 0.96, 0.96));
  const mats = Object.fromEntries(order.map(id => [id, new THREE.MeshStandardMaterial({ color: colors[id], roughness: 0.45 })]));
  const xOf = i => (i - (order.length - 1) / 2) * GAP;

  // Bar: always present, one block per skill.
  const barBlocks = {};
  order.forEach((id, i) => {
    const m = new THREE.Mesh(geo, mats[id]);
    m.position.set(xOf(i), BAR_Y, 0); m.castShadow = true; m.userData.domain = id;
    pivot.add(m); barBlocks[id] = m;
  });

  // Tee's eyes: re-parented onto the current deep-skill column.
  const eyes = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const black = new THREE.MeshStandardMaterial({ color: 0x1b1530, roughness: 0.2 });
  for (const sx of [-0.2, 0.2]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 16), white); e.position.set(sx, 0.08, 0.5); e.scale.z = 0.5;
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), black); p.position.set(sx, 0.06, 0.58);
    eyes.add(e, p);
  }
  eyes.visible = false;

  const stacks = Object.fromEntries(order.map(id => [id, []]));   // level blocks
  const ghosts = Object.fromEntries(order.map(id => [id, []]));   // target outlines
  const anims = [];
  const timer = new THREE.Timer(); timer.connect(document);
  let celebrateAt = -1, spinning = false;

  function addBlock(id, k, delay) {
    const i = order.indexOf(id);
    const m = new THREE.Mesh(geo, mats[id]);
    m.castShadow = true; m.userData.domain = id; m.scale.setScalar(0.001);
    m.position.set(xOf(i), BAR_Y, 0);
    pivot.add(m); stacks[id].push(m);
    anims.push({ m, start: timer.getElapsed() + delay, from: BAR_Y, to: BAR_Y - (k + 1) * STEP });
  }

  function setGhosts(id, current, target) {
    ghosts[id].forEach(g => pivot.remove(g)); ghosts[id] = [];
    const i = order.indexOf(id);
    for (let k = current; k < target; k++) {
      const g = new THREE.LineSegments(ghostGeo, new THREE.LineBasicMaterial({ color: colors[id], transparent: true, opacity: 0.7 }));
      g.position.set(xOf(i), BAR_Y - (k + 1) * STEP, 0); g.userData.domain = id;
      pivot.add(g); ghosts[id].push(g);
    }
  }

  /** current/targets: {id: 0–5}. stagger: animate all new blocks column by column (for reveals). */
  function setState({ current = {}, targets = null, spine = [], stagger = false, reset = false }) {
    if (reset) order.forEach(id => { stacks[id].forEach(m => pivot.remove(m)); stacks[id] = []; });
    order.forEach((id, i) => {
      const want = current[id] ?? 0, have = stacks[id].length;
      for (let k = have; k < want; k++) addBlock(id, k, stagger ? i * 0.07 + (k - have) * 0.09 : (k - have) * 0.08);
      while (stacks[id].length > want) pivot.remove(stacks[id].pop());
      setGhosts(id, want, targets ? Math.max(want, targets[id] ?? 0) : want);
    });
    if (spine[0]) { barBlocks[spine[0]].add(eyes); eyes.visible = true; } else eyes.visible = false;
  }

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h); camera.aspect = w / h;
    // fit ~16 units wide and ~9 tall, whichever is tighter
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const dist = Math.max(9.5 / (2 * Math.tan(halfFov)), 17 / (2 * Math.tan(halfFov) * camera.aspect));
    camera.position.set(dist * 0.32, dist * 0.22, dist * 0.92);
    controls.target.set(0, 0.6, 0);
    camera.updateProjectionMatrix(); controls.update();
  }
  new ResizeObserver(resize).observe(container); resize();

  // Click a column (not a drag) → callback.
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  renderer.domElement.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pivot.children, true).find(h => h.object.userData.domain);
    if (hit) onColumnClick?.(hit.object.userData.domain);
  });

  renderer.setAnimationLoop(() => {
    timer.update();
    const t = timer.getElapsed();
    for (let n = anims.length - 1; n >= 0; n--) {
      const a = anims[n], p = Math.min(1, Math.max(0, (t - a.start) / 0.55));
      if (p <= 0) continue;
      const e = easeOutBack(p);
      a.m.scale.setScalar(Math.max(0.001, e));
      a.m.position.y = a.from + (a.to - a.from) * Math.min(1, e);
      if (p >= 1) anims.splice(n, 1);
    }
    // idle sway, celebration hop + spin
    pivot.rotation.y = spinning ? pivot.rotation.y + 0.03 : Math.sin(t * 0.5) * 0.18;
    if (celebrateAt >= 0) {
      const c = t - celebrateAt;
      pivot.position.y = c < 0.9 ? Math.abs(Math.sin(c * Math.PI * 2.2)) * 0.9 * (1 - c / 0.9) : 0;
      if (c < 1.2) pivot.rotation.y += (1 - c / 1.2) * 0.25;
      if (c > 1.2) celebrateAt = -1;
    }
    // Tee blinks every ~3.5 s
    eyes.scale.y = (t % 3.5) < 0.12 ? 0.1 : 1;
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    setState, resize,
    celebrate: () => { celebrateAt = timer.getElapsed(); },
    spin: on => { spinning = on; },
  };
}
