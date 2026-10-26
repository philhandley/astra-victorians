// Drive my bathing machine: the machine from the design (machine.js) on a sunny beach (beach.js), in the Astra
// Architect style. Tap the sand or the sea and it drives there on its tracks (backwards if that is quicker), or hold
// the arrows. Its tricks: people queue, climb up and whoosh down the slide (into the sea if you have backed it in);
// the band plays and a crowd gathers to dance; the fountains spray and cool down anyone who is too hot.
// Test params: ?at=x,z,heading  ?drive=x,z  ?auto=band,spray,slide  ?sim=seconds (run the world on before showing)
//              ?people=14  ?fps  ?mute  ?zoom=2  ?turn=1  ?clean (no buttons, for pictures)
import * as THREE from 'three';
import { World } from './world.js';
import { build, studioEnvironment } from './machine.js';
import { makeBeach, ground, WATER, shoreZ } from './beach.js';
import { Person, iconMat } from './people.js';
import { Sound } from './sound.js';

const q = new URLSearchParams(location.search);
const app = document.getElementById('app');
app.innerHTML = `
<div class="shell">
  <header class="top">
    <a class="back" href="../tasks/bathing-machine.html" aria-label="Back to the bathing machine task">←</a>
    <div class="brand"><small>Astra Victorians · my design</small><b>Drive my bathing machine</b></div>
    <div class="acts">
      <a class="ab" href="../sheets/machine-plans.html">📐 <span>Plans</span></a>
      <a class="ab" href="../sheets/my-machine.html">📷 <span>Photos</span></a>
      <button class="ab round" data-a="sound" aria-label="Sound on or off">🔊</button>
    </div>
  </header>
  <main class="stage">
    <div class="world"></div>
    <div class="ui">
      <div class="hint"></div>
      <div class="cam">
        <button class="cb" data-a="turnL" aria-label="Turn the view left">⟲</button><button class="cb" data-a="turnR" aria-label="Turn the view right">⟳</button>
        <button class="cb" data-a="zoomIn" aria-label="Zoom in">＋</button><button class="cb" data-a="zoomOut" aria-label="Zoom out">－</button>
        <button class="cb wide on" data-a="follow">FOLLOW</button>
      </div>
      <div class="pad" aria-label="Drive">
        <button class="pb f" data-pad="f" aria-label="Forwards">▲</button><button class="pb b" data-pad="b" aria-label="Backwards">▼</button>
        <button class="pb l" data-pad="l" aria-label="Turn left">◀</button><button class="pb r" data-pad="r" aria-label="Turn right">▶</button>
        <div class="mid">HOLD<br>TO<br>DRIVE</div>
      </div>
      <div class="acts2">
        <button class="act slide" data-a="slide"><i>🛝</i><span>Slide</span></button>
        <button class="act band" data-a="band"><i>🎸</i><span>Band</span></button>
        <button class="act spray" data-a="spray"><i>⛲</i><span>Fountains</span></button>
        <button class="act" data-a="horn"><i>📯</i><span>Horn</span></button>
      </div>
    </div>
  </main>
</div>`;
const $ = s => app.querySelector(s);
const world = new World($('.world'));
world.halfH = 10; world.resize();
world.controls.minZoom = 0.7; world.controls.maxZoom = 3.4;
world.scene.fog = new THREE.Fog('#eaf2ee', 80, 175);
world.camera.far = 600; world.camera.updateProjectionMatrix();
const sound = new Sound();
if (q.has('mute')) sound.setOn(false);
const beach = makeBeach(world.scene);
const M = build({ ladder: true });
world.scene.add(M);
const P = M.userData.points;
studioEnvironment(world.renderer).then(env => { world.scene.environment = env; });
if (q.has('fps')) world.stats(true);

// ---------------------------------------------------------------- hints
const hintEl = $('.hint');
let hintT = 0;
function hint(text, secs = 5) { hintEl.textContent = text; hintT = secs; }
hint('Tap the sand or the sea and the machine drives there. Try backing it into the sea!', 8);

// ---------------------------------------------------------------- the machine on its tracks
const [ax, az, ah] = (q.get('at') || '0,7,0').split(',').map(Number);
const car = { x: ax, z: az, h: ah || 0, v: 0, w: 0, target: null, rev: false };
const BOUNDS = { x0: -38, x1: 38, z0: -26, z1: 12.5 }, MAXD = 1.85, HALF_TRACK = 2.2;
const pad = { f: 0, t: 0 };
let follow = true, deepWarned = 0, seaHinted = false;
const toWorld = (lx, ly, lz) => new THREE.Vector3(lx, ly, lz).applyMatrix4(M.matrixWorld);
function localXZ(x, z) { const dx = x - car.x, dz = z - car.z, c = Math.cos(car.h), s = Math.sin(car.h); return [dx * c - dz * s, dx * s + dz * c]; }
function place() {
  const fx = Math.sin(car.h), fz = Math.cos(car.h), rx = Math.cos(car.h), rz = -Math.sin(car.h), L = 2.8, W = 2.2;
  const yF = ground(car.x + fx * L, car.z + fz * L), yB = ground(car.x - fx * L, car.z - fz * L);
  const yL = ground(car.x + rx * W, car.z + rz * W), yR = ground(car.x - rx * W, car.z - rz * W);
  M.position.set(car.x, (yF + yB + yL + yR) / 4, car.z);
  M.rotation.set(-Math.atan2(yF - yB, 2 * L), car.h, Math.atan2(yL - yR, 2 * W), 'YXZ');
  M.updateMatrixWorld(true);
}
place();
const marker = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.8, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85, depthWrite: false }));
marker.visible = false; marker.renderOrder = 3; world.scene.add(marker);
function setTarget(x, z) {
  x = THREE.MathUtils.clamp(x, BOUNDS.x0 + 1, BOUNDS.x1 - 1); z = THREE.MathUtils.clamp(z, BOUNDS.z0 + 1, BOUNDS.z1 - 0.5);
  car.target = { x, z };
  const [, lz] = localXZ(x, z);
  car.rev = lz < -1;                                           // behind: back up to it
  marker.position.set(x, Math.max(ground(x, z), WATER) + 0.05, z); marker.visible = true;
}
function drive(dt) {
  let vT = 0, wT = 0;
  if (pad.f || pad.t) { if (car.target) { car.target = null; marker.visible = false; } vT = pad.f * (pad.f > 0 ? 3.2 : 2.4); wT = pad.t * 0.9; }
  else if (car.target) {
    const dx = car.target.x - car.x, dz = car.target.z - car.z, d = Math.hypot(dx, dz);
    if (d < 0.7) { car.target = null; marker.visible = false; }
    else {
      const want = car.rev ? Math.atan2(-dx, -dz) : Math.atan2(dx, dz);
      let da = want - car.h; da = Math.atan2(Math.sin(da), Math.cos(da));
      wT = THREE.MathUtils.clamp(da * 2.2, -0.9, 0.9);
      const go = Math.abs(da) < 0.5 ? Math.min(1, d / 3) * (1 - Math.abs(da) * 1.2) : 0;
      vT = (car.rev ? -2.4 : 3.2) * Math.max(0, go);
    }
  }
  car.v += (vT - car.v) * Math.min(1, dt * 2.5);
  car.w += (wT - car.w) * Math.min(1, dt * 4);
  const nh = car.h + car.w * dt, nx = car.x + Math.sin(nh) * car.v * dt, nz = car.z + Math.cos(nh) * car.v * dt;
  const dNow = WATER - ground(car.x, car.z), dNext = WATER - ground(nx, nz);
  let ok = nx > BOUNDS.x0 && nx < BOUNDS.x1 && nz > BOUNDS.z0 && nz < BOUNDS.z1;
  if (dNext > MAXD && dNext > dNow) { ok = false; if (performance.now() - deepWarned > 4000) { deepWarned = performance.now(); hint('Too deep! Any further and the sea would come in.', 3.5); } }
  car.h = nh;
  if (ok) { car.x = nx; car.z = nz; } else { car.v *= 0.2; if (car.target) { car.target = null; marker.visible = false; } }
  M.userData.drive(dt, car.v - car.w * HALF_TRACK, car.v + car.w * HALF_TRACK);
  place();
  const speed = Math.min(1, (Math.abs(car.v) + Math.abs(car.w) * 2) / 3.2);
  sound.engine(speed);
  // spray from the tracks in the water
  if (speed > 0.15) for (const [lx, lz] of [[2.2, 2.6], [-2.2, 2.6], [2.2, -3.6], [-2.2, -3.6]]) {
    const p = toWorld(lx, 0, lz);
    if (WATER - ground(p.x, p.z) > 0.15 && Math.random() < speed * 0.9) emit(p.x + (Math.random() - 0.5), WATER, p.z + (Math.random() - 0.5), (Math.random() - 0.5) * 2, 1.5 + Math.random() * 2, (Math.random() - 0.5) * 2, 1.5, 0.8, false);
  }
  if (!seaHinted && dNow > 0.5) { seaHinted = true; hint('Splash! You are in the sea. Press Slide and the swimmers whoosh into the water.', 6); }
}

// ---------------------------------------------------------------- water drops: the fountains, the misters, splashes
const DROPS = 700;
const drops = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.075, 0), new THREE.MeshStandardMaterial({ color: '#d6f2ff', roughness: 0.1, transparent: true, opacity: 0.85, envMapIntensity: 1.2 }), DROPS);
drops.frustumCulled = false; world.scene.add(drops);
const dp = new Float32Array(DROPS * 3), dv = new Float32Array(DROPS * 3), dl = new Float32Array(DROPS), ds = new Float32Array(DROPS), dc = new Uint8Array(DROPS);
let dNext = 0;
function emit(x, y, z, vx, vy, vz, life = 3, size = 1, cools = true) {
  const i = dNext; dNext = (dNext + 1) % DROPS;
  dp[i * 3] = x; dp[i * 3 + 1] = y; dp[i * 3 + 2] = z; dv[i * 3] = vx; dv[i * 3 + 1] = vy; dv[i * 3 + 2] = vz; dl[i] = life; ds[i] = size; dc[i] = cools ? 1 : 0;
}
const m4 = new THREE.Matrix4(), dq = new THREE.Quaternion(), dvv = new THREE.Vector3(), dsv = new THREE.Vector3();
function updateDrops(dt) {
  for (let i = 0; i < DROPS; i++) {
    if (dl[i] <= 0) { m4.makeScale(0, 0, 0); drops.setMatrixAt(i, m4); continue; }
    dv[i * 3 + 1] -= 9.8 * dt;
    dp[i * 3] += dv[i * 3] * dt; dp[i * 3 + 1] += dv[i * 3 + 1] * dt; dp[i * 3 + 2] += dv[i * 3 + 2] * dt;
    dl[i] -= dt;
    const x = dp[i * 3], y = dp[i * 3 + 1], z = dp[i * 3 + 2], gy = ground(x, z);
    if (y < Math.max(gy, WATER) && dv[i * 3 + 1] < 0) {
      dl[i] = 0;
      if (dc[i]) { for (const p of people) if (p.hot && (p.pos.x - x) ** 2 + (p.pos.z - z) ** 2 < 1.7) cool(p); }
      if (y < WATER + 0.05 && gy < WATER && Math.random() < 0.04) ripple(x, z, 0.8);
    }
    dsv.setScalar(ds[i]); dvv.set(x, y, z);
    drops.setMatrixAt(i, m4.compose(dvv, dq, dsv));
  }
  drops.instanceMatrix.needsUpdate = true;
}
let spraying = false, sprayAcc = 0;
function spray(dt) {
  if (!spraying) return;
  sprayAcc += dt * 60;
  const dir = new THREE.Vector3(), up = new THREE.Vector3();
  while (sprayAcc >= 1) {
    sprayAcc -= 1;
    for (const n of P.nozzles) {
      const p = toWorld(n.x, n.y, n.z), e = 0.5 + Math.random() * 0.25, sp = 5 + Math.random() * 1.6, side = (Math.random() - 0.5) * 0.5;
      dir.set(n.dir * Math.cos(e), Math.sin(e), side).multiplyScalar(sp).transformDirection(M.matrixWorld).multiplyScalar(sp);
      emit(p.x, p.y, p.z, dir.x, dir.y, dir.z, 3, 1);
    }
    // misters under the band over the stage: a fine drizzle in front of it
    if (Math.random() < 0.7) {
      const p = toWorld((Math.random() - 0.5) * 2.4, 4.9, 1.45);
      up.set((Math.random() - 0.5) * 1.2, -0.5, 1.2 + Math.random() * 1.6).transformDirection(M.matrixWorld).multiplyScalar(1.5 + Math.random() * 1.5);
      emit(p.x, p.y, p.z, up.x, up.y, up.z, 2.5, 0.55);
    }
  }
}
const ripples = [];
for (let i = 0; i < 12; i++) {
  const r = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.55, 36).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
  r.renderOrder = 3; r.userData.t = 1; world.scene.add(r); ripples.push(r);
}
let rNext = 0;
function ripple(x, z, size = 1) { const r = ripples[rNext]; rNext = (rNext + 1) % ripples.length; r.position.set(x, WATER + 0.06, z); r.userData.t = 0; r.userData.size = size; }
function updateRipples(dt) { for (const r of ripples) { const u = r.userData; r.visible = u.t < 1; if (u.t >= 1) continue; u.t = Math.min(1, u.t + dt / 1.3); r.scale.setScalar(0.4 + u.t * 4 * u.size); r.material.opacity = 0.8 * (1 - u.t); } }
function splash(x, z, big = 1) {
  sound.splash(big);
  for (let i = 0; i < 40 * big; i++) { const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 2.5; emit(x, WATER + 0.1, z, Math.cos(a) * s, 3 + Math.random() * 3.5, Math.sin(a) * s, 2, 0.9 + Math.random() * 0.6, false); }
  ripple(x, z, 1.2); setTimeout(() => ripple(x, z, 0.8), 250);
}

// ---------------------------------------------------------------- the beach people
const people = [];
const ctx = { ground, water: WATER, avoid };
function randomSand() {
  for (let k = 0; k < 30; k++) {
    const x = (Math.random() - 0.5) * 56, z = shoreZ(x) + 1.5 + Math.random() * (15 - shoreZ(x) - 1.5);
    const [lx, lz] = localXZ(x, z);
    if (Math.abs(lx) < 4.5 && lz > -7 && lz < 9) continue;      // not on top of the machine
    return [x, z];
  }
  return [12, 10];
}
function addPerson(x, z, look) { const p = new Person(look); p.pos.set(x, ground(x, z), z); world.scene.add(p.g); people.push(p); return p; }
const N = Math.max(4, Math.min(30, +(q.get('people') || 16)));
for (let i = 0; i < N; i++) { const [x, z] = randomSand(); const p = addPerson(x, z); p.timer = Math.random() * 3; }
beach.towels.slice(0, 4).forEach((t, i) => {                    // sunbathers
  const p = people[i]; p.pos.set(t.x, ground(t.x, t.z), t.z); p.state = 'lie'; p.pose = 'lie'; p.heading = t.a; p.towel = t;
});
// the machine is in the way: if someone's straight path crosses it, they walk round it (one way round, kept until
// they are well clear), and anyone inside its footprint is pushed out through the nearest side
function avoid(x, z, p) {
  const [lx, lz] = localXZ(x, z), X = 3.2, Z0 = -5.0, Z1 = 4.1, BAND = 0.9;
  const ox = Math.max(-X - lx, 0, lx - X), oz = Math.max(Z0 - lz, 0, lz - Z1), out = Math.hypot(ox, oz);
  if (out > BAND + 0.6) { if (p) p.side = null; return null; }
  if (out > BAND) return null;
  let blocked = out === 0;
  if (!blocked && p?.target) {
    const [gx, gz] = localXZ(p.target.x, p.target.y);
    for (let t = 0.1; t <= 1.001 && !blocked; t += 0.1) { const sx = lx + (gx - lx) * t, sz = lz + (gz - lz) * t; blocked = sx > -X && sx < X && sz > Z0 && sz < Z1; }
  }
  if (!blocked) return null;
  // the face they are at, as an outward normal
  let px = 0, pz = 0;
  if (out === 0) { const dl = lx + X, dr = X - lx, db = lz - Z0, df = Z1 - lz, mn = Math.min(dl, dr, db, df); if (mn === dl) px = -1; else if (mn === dr) px = 1; else if (mn === db) pz = -1; else pz = 1; }
  else if (ox >= oz) px = lx > 0 ? 1 : -1; else pz = lz > 0 ? 1 : -1;
  let ux = -pz, uz = px;                                        // anticlockwise along that face
  if (p && p.side == null) {
    const [gx, gz] = p.target ? localXZ(p.target.x, p.target.y) : [lx, lz], along = (gx - lx) * ux + (gz - lz) * uz;
    p.side = Math.abs(along) > 0.5 ? Math.sign(along) : (lx * ux + lz * uz >= 0 ? 1 : -1);
  }
  if (p) { ux *= p.side; uz *= p.side; }
  const k = out === 0 ? 1 : 0.25, tx = px * k + ux * 0.75, tz = pz * k + uz * 0.75, c = Math.cos(car.h), s = Math.sin(car.h);
  return { x: tx * c + tz * s, z: -tx * s + tz * c };
}
function bump(p) {                                              // the machine drove into someone: they step aside
  const [lx, lz] = localXZ(p.pos.x, p.pos.z), X = 3.0, Z0 = -4.9, Z1 = 3.95;
  if (lx < -X || lx > X || lz < Z0 || lz > Z1) return;
  let nx = lx, nz = lz; const dl = lx + X, dr = X - lx, db = lz - Z0, df = Z1 - lz, mn = Math.min(dl, dr, db, df);
  if (mn === dl) nx = -X; else if (mn === dr) nx = X; else if (mn === db) nz = Z0; else nz = Z1;
  const c = Math.cos(car.h), s = Math.sin(car.h);
  p.pos.x = car.x + nx * c + nz * s; p.pos.z = car.z - nx * s + nz * c;
  if (p.state === 'lie') { p.state = 'wander'; p.pose = 'idle'; p.towel = null; }
}
function pickWander(p) {
  if (Math.random() < 0.3) { const x = THREE.MathUtils.clamp(p.pos.x + (Math.random() - 0.5) * 12, -30, 30); p.walkTo(x, shoreZ(x) - 1 - Math.random() * 5); }   // a paddle or a swim
  else { const [x, z] = randomSand(); p.walkTo(THREE.MathUtils.lerp(p.pos.x, x, 0.5), THREE.MathUtils.lerp(p.pos.z, z, 0.5)); }
}
// too hot, and cooled down
let hotT = 3;
function heatUp(dt) {
  hotT -= dt; if (hotT > 0) return;
  hotT = 5 + Math.random() * 5;
  if (people.filter(p => p.hot).length >= 4) return;
  const c = people.filter(p => !p.hot && (p.state === 'wander' || p.state === 'lie') && !p.swimming);
  const p = c[Math.floor(Math.random() * c.length)];
  if (!p) return;
  p.hot = true; p.showIcon('hot');
  if (p.state === 'wander') { p.target = null; p.pose = 'fan'; }
  if (!spraying && Math.random() < 0.6) hint('Someone is too hot! Press Fountains and drive close to spray them.', 4.5);
}
function cool(p) {
  if (!p.hot) return;
  p.hot = false; p.showIcon('cool', 2.6); sound.pop();
  if (p.state !== 'lie') { p.pose = 'cheer'; p.cheerT = 1.6; p.target = null; }
  else p.cheerT = 0;
}

// ---------------------------------------------------------------- the slide: queue, climb, whoosh, splash
const queue = []; let slider = null;
const QZ = (P.ladder.foot.z) - 0.25;
const queueSpot = i => toWorld(0, 0, QZ - i * 0.85);
function sendToSlide() {
  const foot = queueSpot(0);
  const free = people.filter(p => (p.state === 'wander' || p.state === 'concert') && !p.locked && !queue.includes(p)).sort((a, b) => a.pos.distanceToSquared(foot) - b.pos.distanceToSquared(foot));
  for (const p of free.slice(0, Math.max(0, 4 - queue.length))) { p.state = 'queue'; p.pose = 'idle'; queue.push(p); if (crowd.includes(p)) crowd.splice(crowd.indexOf(p), 1); }
  hint(WATER - ground(foot.x, foot.z) > 0.4 ? 'Here they come! They climb up the ladder and whoosh down into the sea.' : 'Here they come! Back the slide over the sea for a big splash.', 5);
}
let qSort = 0;
function updateSlide(dt) {
  if ((qSort -= dt) <= 0) { qSort = 1; const f = queueSpot(0); queue.sort((a, b) => a.pos.distanceToSquared(f) - b.pos.distanceToSquared(f)); }
  queue.forEach((p, i) => { const s = queueSpot(i); if (!p.target || Math.hypot(p.target.x - s.x, p.target.y - s.z) > 0.3) p.walkTo(s.x, s.z); });
  const s0 = queueSpot(0);
  if (!slider && queue[0] && Math.hypot(queue[0].pos.x - s0.x, queue[0].pos.z - s0.z) < 0.4 && Math.abs(car.v) < 0.4 && Math.abs(car.w) < 0.2) {
    const p = queue.shift();
    p.locked = true; p.target = null; p.state = 'slide';
    M.attach(p.g); p.g.position.set(0, 0, P.ladder.z - 0.32); p.g.rotation.set(0, 0, 0); p.pose = 'climb';
    slider = { p, phase: 'climb', t: 0 };
  }
  if (!slider) return;
  const S2 = slider, p = S2.p;
  if (S2.phase === 'climb') {
    S2.t += dt / 2.4; p.g.position.y = Math.min(1, S2.t) * P.ladder.top.y;
    if (S2.t >= 1) { S2.phase = 'step'; S2.t = 0; S2.path = [p.g.position.clone(), new THREE.Vector3(0, P.whiteTop.y, P.whiteTop.z), new THREE.Vector3(P.slideTop.x, P.slideTop.y, P.slideTop.z + 0.2)]; S2.leg = 0; p.pose = 'walk'; }
  } else if (S2.phase === 'step') {
    const a = S2.path[S2.leg], b = S2.path[S2.leg + 1], d = a.distanceTo(b);
    S2.t += dt * 1.3 / Math.max(0.1, d);
    p.g.position.lerpVectors(a, b, Math.min(1, S2.t)); p.g.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
    if (S2.t >= 1) { S2.t = 0; S2.leg++; if (S2.leg >= S2.path.length - 1) { S2.phase = 'sit'; p.pose = 'slide'; } }
  } else if (S2.phase === 'sit') {
    const tan = P.slide.getTangentAt(0.02); p.g.rotation.y = Math.atan2(tan.x, tan.z);
    S2.t += dt; if (S2.t > 0.5) { S2.phase = 'slide'; S2.t = 0; S2.u = 0; sound.whoosh(); }
  } else if (S2.phase === 'slide') {
    S2.u = Math.min(1, S2.u + dt * (0.3 + 1.3 * S2.u));
    const pt = P.slide.getPointAt(S2.u), tan = P.slide.getTangentAt(S2.u);
    p.g.position.copy(pt); p.g.rotation.set(-Math.asin(THREE.MathUtils.clamp(tan.y, -1, 1)) * 0.35, Math.atan2(tan.x, tan.z), 0, 'YXZ');
    if (S2.u >= 1) {
      world.scene.attach(p.g);
      const v = new THREE.Vector3().copy(tan).transformDirection(M.matrixWorld).multiplyScalar(4.5);
      S2.phase = 'fly'; S2.v = v; p.pose = 'fall'; p.g.rotation.set(0, Math.atan2(v.x, v.z), 0);
    }
  } else if (S2.phase === 'fly') {
    S2.v.y -= 9.8 * dt; p.pos.addScaledVector(S2.v, dt);
    const gy = ground(p.pos.x, p.pos.z), deep = WATER - gy > 0.55;
    if (deep && p.pos.y < WATER - 0.3) {
      splash(p.pos.x, p.pos.z, 1.3); sound.cheer();
      p.locked = false; p.state = 'swim'; p.pose = 'idle'; p.heading = p.g.rotation.y; if (p.hot) cool(p); else p.showIcon('cool', 2);
      const x = p.pos.x; p.walkTo(x + (Math.random() - 0.5) * 4, shoreZ(x) + 1.5);
      slider = null;
    } else if (!deep && p.pos.y <= gy) {
      p.pos.y = gy; sound.pop();
      p.locked = false; p.state = 'wander'; p.pose = 'cheer'; p.cheerT = 1.2; p.heading = p.g.rotation.y; p.timer = 1.5;
      slider = null;
    }
  }
}

// ---------------------------------------------------------------- the band and the crowd
let bandOn = false; const crowd = [];
const band = P.band || [];
(function instruments() {
  const red = new THREE.MeshStandardMaterial({ color: '#d23b33', roughness: 0.3, metalness: 0.2 }), wood = new THREE.MeshStandardMaterial({ color: '#6b4a2f', roughness: 0.5 });
  const chrome = new THREE.MeshStandardMaterial({ color: '#dfe3e8', roughness: 0.2, metalness: 1 }), black = new THREE.MeshStandardMaterial({ color: '#202124', roughness: 0.4 });
  const guitar = (bodyMat) => {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.07, 16).rotateX(Math.PI / 2), bodyMat); b.scale.set(1, 1.3, 1); g.add(b);
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.55, 0.03), wood); neck.position.y = 0.45; g.add(neck);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.03), black); head.position.y = 0.76; g.add(head);
    g.position.set(-0.02, 0.98, 0.2); g.rotation.z = 0.95; return g;
  };
  // (the band are in stud units inside the machine; these are in metres, so scale back up)
  if (band[0]) { const g = guitar(black); g.scale.setScalar(1); band[0].add(g); }
  if (band[2]) { const g = guitar(red); band[2].add(g); }
  if (band[1]) {
    const stand = new THREE.Group(); stand.position.set(0, 0, 0.42);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 6), chrome); pole.position.y = 0.7; stand.add(pole);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 12), black); stand.add(foot);
    const mic = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), black); mic.position.set(0, 1.45, -0.06); stand.add(mic);
    band[1].add(stand);
  }
})();
const notes = [];
for (let i = 0; i < 10; i++) { const s = new THREE.Sprite(iconMat(i % 2 ? 'note2' : 'note')); s.scale.setScalar(0.7); s.visible = false; s.userData.t = 1; world.scene.add(s); notes.push(s); }
let lastBeat = 0, nNext = 0;
function crowdSpot(i) {
  const row = i < 4 ? 0 : i < 9 ? 1 : 2, inRow = row === 0 ? 4 : row === 1 ? 5 : 6, k = row === 0 ? i : row === 1 ? i - 4 : i - 9;
  const r = 4.6 + row * 1.1, a = (k - (inRow - 1) / 2) * (row === 0 ? 0.36 : 0.3);
  return toWorld(Math.sin(a) * r, 0, P.stage.z + Math.cos(a) * r);
}
function toggleBand(on = !bandOn) {
  bandOn = on; sound.band(on); $('[data-a="band"]').classList.toggle('on', on);
  if (on) {
    const stage = toWorld(0, 0, P.stage.z);
    const free = people.filter(p => (p.state === 'wander' || p.state === 'swim') && !p.locked).sort((a, b) => a.pos.distanceToSquared(stage) - b.pos.distanceToSquared(stage));
    for (const p of free.slice(0, 11)) { p.state = 'concert'; crowd.push(p); }
    hint('Rock concert! The crowd comes to dance in front of the stage.', 5);
  } else {
    for (const p of crowd) { p.state = 'wander'; p.pose = 'cheer'; p.cheerT = 1.4; p.timer = 2 + Math.random() * 3; }
    crowd.length = 0; sound.cheer();
  }
}
function updateBand(dt) {
  const beat = sound.beat();
  band.forEach((f, i) => {
    const u = f.userData, b = beat * Math.PI * 2;
    if (!u.body) return;
    if (!bandOn) { u.body.position.y = 0; u.armR.rotation.set(0, 0, 0.08); u.armL.rotation.set(0, 0, -0.08); return; }
    u.body.position.y = Math.abs(Math.sin(b / 2 + i)) * 0.06;
    if (i === 1) { u.armR.rotation.set(-1.7 + Math.sin(b) * 0.15, 0, 0.2); u.armL.rotation.set(-2.6 + Math.sin(b / 2) * 0.4, 0, -0.4); }      // the singer
    else { u.armR.rotation.set(-0.9 + Math.sin(b * 2) * 0.45, 0, 0.3); u.armL.rotation.set(-1.4, 0.4, -0.2); }                                // strumming
  });
  const drum = M.userData.parts.drum;
  if (drum) { const f = beat % 1; drum.scale.y = bandOn ? 1 + Math.max(0, 0.05 - f * 0.12) : 1; }
  if (bandOn && Math.floor(beat) !== lastBeat) {
    lastBeat = Math.floor(beat);
    const s = notes[nNext]; nNext = (nNext + 1) % notes.length;
    const p = toWorld((Math.random() - 0.5) * 2.4, 4.4, P.stage.z + 0.4); s.position.copy(p); s.userData.t = 0; s.userData.vx = (Math.random() - 0.5) * 0.6; s.visible = true;
  }
  for (const s of notes) { if (s.userData.t >= 1) { s.visible = false; continue; } s.userData.t += dt / 2.2; s.position.y += dt * 1.2; s.position.x += s.userData.vx * dt; s.material.opacity = 1 - s.userData.t; }
  crowd.forEach((p, i) => {
    const s = crowdSpot(i), d = Math.hypot(p.pos.x - s.x, p.pos.z - s.z);
    if (d > 0.4) { if (!p.target || Math.hypot(p.target.x - s.x, p.target.y - s.z) > 0.4) p.walkTo(s.x, s.z); if (p.pose === 'dance') p.pose = 'idle'; }
    else if (!p.target) { const st = toWorld(0, 0, P.stage.z); p.face(st.x, st.z); p.pose = p.swimming ? 'idle' : 'dance'; p.beat = beat + (p.id % 3) * 0.15; }
  });
}

// ---------------------------------------------------------------- one step of the world
function think(p, dt) {
  if (p.cheerT > 0) { p.cheerT -= dt; if (p.cheerT <= 0 && p.pose === 'cheer') p.pose = p.state === 'lie' ? 'lie' : 'idle'; }
  if (p.state === 'lie') { if (p.towel) { p.target = null; p.pose = p.cheerT > 0 ? 'cheer' : 'lie'; } return; }
  if (p.state === 'swim') { if (!p.target) { p.state = 'wander'; p.timer = 1 + Math.random() * 2; } if (p.hot) cool(p); return; }
  if (p.state !== 'wander') return;
  if (p.swimming && p.hot) cool(p);
  if (p.hot) { p.target = null; p.pose = 'fan'; return; }
  if (p.pose === 'fan') p.pose = 'idle';
  if (!p.target && p.cheerT <= 0) { p.timer -= dt; if (p.timer <= 0) { pickWander(p); p.timer = 2 + Math.random() * 5; } }
}
function update(dt) {
  drive(dt);
  M.userData.tick(dt);
  beach.tick(dt);
  spray(dt);
  updateDrops(dt);
  updateRipples(dt);
  heatUp(dt);
  updateSlide(dt);
  updateBand(dt);
  for (const p of people) { if (!p.locked) bump(p); think(p, dt); p.update(dt, ctx); }
  marker.scale.setScalar(1 + Math.sin(performance.now() / 180) * 0.08);
  if (hintT > 0) { hintT -= dt; if (hintT <= 0) hintEl.textContent = ''; }
  if (follow) {
    const c = world.controls, d = new THREE.Vector3(car.x, 1.5, car.z).sub(c.target).multiplyScalar(Math.min(1, dt * 2.5));
    c.target.add(d); world.camera.position.add(d);
  }
  world.setSunFocus(car.x, car.z);
}
world.frame(car.x, car.z, 1, true);
world.controls.target.y = 1.5; world.camera.position.y += 1.5;
world.updaters.add(update);

// ---------------------------------------------------------------- controls
world.canvas.addEventListener('pointerdown', e => { sound.ensure(); tapStart = { x: e.clientX, y: e.clientY, t: performance.now() }; });
let tapStart = null;
world.canvas.addEventListener('pointerup', e => {
  if (!tapStart) return;
  const moved = Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y), held = performance.now() - tapStart.t; tapStart = null;
  if (moved > 12 || held > 450) return;
  const hit = world.rayFrom(e.clientX, e.clientY).intersectObjects([beach.sea, beach.sand], false)[0];
  if (hit) setTarget(hit.point.x, hit.point.z);
});
const PADS = { f: [1, 0], b: [-1, 0], l: [0, 1], r: [0, -1] };
app.querySelectorAll('[data-pad]').forEach(b => {
  const [f, t] = PADS[b.dataset.pad];
  const on = e => { e.preventDefault(); sound.ensure(); b.setPointerCapture?.(e.pointerId); b.classList.add('down'); if (f) pad.f = f; if (t) pad.t = t; };
  const off = () => { b.classList.remove('down'); if (f && pad.f === f) pad.f = 0; if (t && pad.t === t) pad.t = 0; };
  b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('lostpointercapture', off);
});
addEventListener('keydown', e => { const k = { ArrowUp: ['f', 1], ArrowDown: ['f', -1], ArrowLeft: ['t', 1], ArrowRight: ['t', -1] }[e.key]; if (k) { pad[k[0]] = k[1]; e.preventDefault(); } });
addEventListener('keyup', e => { const k = { ArrowUp: 'f', ArrowDown: 'f', ArrowLeft: 't', ArrowRight: 't' }[e.key]; if (k) pad[k] = 0; });
const ACTS = {
  slide: () => sendToSlide(),
  band: () => toggleBand(),
  spray: () => { spraying = !spraying; sound.ensure(); sound.spray(spraying); $('[data-a="spray"]').classList.toggle('on', spraying); if (spraying) hint('Whoosh! The fountains spray from the four arms. Drive close to anyone who is too hot.', 5); },
  horn: () => { sound.horn(); for (const p of people) if (!p.locked && p.pos.distanceTo(M.position) < 9 && p.state !== 'lie') { p.pose = 'cheer'; p.cheerT = 0.8; } },
  turnL: () => world.turn(-1), turnR: () => world.turn(1),
  zoomIn: () => { world.camera.zoom = Math.min(3.4, world.camera.zoom * 1.25); world.camera.updateProjectionMatrix(); },
  zoomOut: () => { world.camera.zoom = Math.max(0.7, world.camera.zoom / 1.25); world.camera.updateProjectionMatrix(); },
  follow: () => { follow = !follow; $('[data-a="follow"]').classList.toggle('on', follow); },
  sound: () => { sound.setOn(!sound.on); $('[data-a="sound"]').textContent = sound.on ? '🔊' : '🔇'; },
};
app.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => { sound.ensure(); ACTS[b.dataset.a]?.(); }));

// ---------------------------------------------------------------- test params
if (q.get('drive')) { const [x, z] = q.get('drive').split(',').map(Number); setTarget(x, z); }
for (const a of (q.get('auto') || '').split(',').filter(Boolean)) {
  if (a === 'band') toggleBand(true);
  if (a === 'spray') { spraying = true; $('[data-a="spray"]').classList.add('on'); }
  if (a === 'slide') sendToSlide();
  if (a === 'hot') people.slice(4, 8).forEach(p => { p.hot = true; p.showIcon('hot'); p.pose = 'fan'; });
}
if (q.has('clean')) { $('.ui').hidden = true; hintEl.textContent = ''; }
if (q.get('zoom')) { world.camera.zoom = +q.get('zoom'); world.camera.updateProjectionMatrix(); }
if (q.get('turn')) for (let i = 0; i < +q.get('turn'); i++) { world.turn(1); for (let k = 0; k < 20; k++) world.step(0.05); }
if (q.get('sim')) { const n = +q.get('sim') * 30; for (let i = 0; i < n; i++) update(1 / 30); }
world.start();
window.__game = { world, car, people, M, update, setTarget, toggleBand, sendToSlide };
