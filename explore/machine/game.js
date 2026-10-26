// Drive my bathing machine: the machine from the design (machine.js) on a sunny beach (beach.js), in the Astra
// Architect style. Tap the sand or the sea and it drives there on its tracks (backwards if that is quicker), hold the
// arrows, or ride behind it. Its tricks: people queue, climb up and whoosh down the slide (into the sea if you have
// backed it in); the band plays under coloured lights and a crowd gathers to dance; the fountains spray and cool down
// anyone who is too hot. Tap the slide, the stage, an arm, the flower or the shade to make them go; tap a person to say hi.
// Safety: the machine never moves into anyone. Before every move it checks where everyone is; people in its way
// step aside (a yellow ! over them), and if someone is still in the way it stops and waits. It beeps when reversing,
// and it will not move while anyone is on the ladder or the slide.
// Test params: ?at=x,z,heading  ?drive=x,z  ?auto=band,spray,slide,hot,ride  ?sim=seconds (run the world on before
//              showing)  ?people=16  ?fps  ?mute  ?quiet (no reading aloud)  ?zoom=2  ?turn=1  ?clean (no buttons)
import * as THREE from 'three';
import { World } from './world.js';
import { build, studioEnvironment } from './machine.js';
import { makeBeach, ground, WATER, shoreZ } from './beach.js';
import { Person, iconMat } from './people.js';
import { Sound } from './sound.js';

const q = new URLSearchParams(location.search);
const store = { get(k, d) { try { const v = localStorage.getItem('astravic-machine-' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('astravic-machine-' + k, JSON.stringify(v)); } catch (e) {} } };
const app = document.getElementById('app');
app.innerHTML = `
<div class="shell">
  <header class="top">
    <a class="back" href="../tasks/bathing-machine.html" aria-label="Back to the bathing machine task">←</a>
    <div class="brand"><small>Astra Victorians · my design</small><b>Drive my bathing machine</b></div>
    <div class="acts">
      <a class="ab" href="../sheets/machine-plans.html">📐 <span>Plans</span></a>
      <a class="ab" href="../sheets/my-machine.html">📷 <span>Photos</span></a>
      <button class="ab round" data-a="voice" aria-label="Read aloud on or off">🗣️</button>
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
        <button class="cb wide" data-a="ride">🎥 RIDE</button>
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

// ---------------------------------------------------------------- hints, read aloud
const hintEl = $('.hint');
let hintT = 0, voiceOn = !q.has('quiet') && store.get('voice', true), lastSaid = '', lastSaidT = 0;
function say(text) {
  if (!voiceOn || !('speechSynthesis' in window)) return;
  if (text === lastSaid && performance.now() - lastSaidT < 9000) return;
  lastSaid = text; lastSaidT = performance.now();
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text), vs = speechSynthesis.getVoices();
    u.voice = vs.find(v => /en-GB/i.test(v.lang) && /female|libby|sonia|kate|serena|google uk english female/i.test(v.name)) || vs.find(v => /en-GB/i.test(v.lang)) || null;
    u.lang = 'en-GB'; u.rate = 0.95; u.pitch = 1.05;
    speechSynthesis.speak(u);
  } catch (e) { /* no voice on this device */ }
}
function hint(text, secs = 5, speak = true) { hintEl.textContent = text; hintT = secs; if (speak) say(text); }
const throttle = {};
const once = (key, ms, fn) => { const now = performance.now(); if (now - (throttle[key] || -1e9) > ms) { throttle[key] = now; fn(); } };
hint('Tap the sand or the sea and the machine drives there. Try backing it into the sea!', 8, false);
$('[data-a="voice"]').classList.toggle('off', !voiceOn);

// ---------------------------------------------------------------- the machine on its tracks, and keeping everyone safe
const [ax, az, ah] = (q.get('at') || '0,7,0').split(',').map(Number);
const car = { x: ax, z: az, h: ah || 0, v: 0, w: 0, target: null, rev: false };
const BOUNDS = { x0: -38, x1: 38, z0: -26, z1: 12.5 }, MAXD = 1.85, HALF_TRACK = 2.2;
// where the machine is solid at people height, in its own metres: the tracks, deck and stage; the low end of the slide
const FOOT = [{ x0: -3.3, x1: 3.3, z0: -5.0, z1: 4.0 }, { x0: 0.9, x1: 3.1, z0: -6.6, z1: -5.0 }];
const PR = 0.4;                                                // the room a person takes up
const safety = { closest: Infinity, log: [] };                          // the nearest anyone has been after a move (tests)
const pad = { f: 0, t: 0 };
let follow = true, seaHinted = false, blockedT = 0, beepT = 0, parkedT = 0;
const toWorld = (lx, ly, lz) => new THREE.Vector3(lx, ly, lz).applyMatrix4(M.matrixWorld);
function localAt(x, z, cx, cz, h) { const dx = x - cx, dz = z - cz, c = Math.cos(h), s = Math.sin(h); return [dx * c - dz * s, dx * s + dz * c]; }
const localXZ = (x, z) => localAt(x, z, car.x, car.z, car.h);
const worldXZ = (lx, lz) => { const c = Math.cos(car.h), s = Math.sin(car.h); return [car.x + lx * c + lz * s, car.z - lx * s + lz * c]; };
// how far someone is from the machine's solid parts if it stood at (cx, cz, h): negative means inside
function clearance(x, z, cx, cz, h) {
  const [lx, lz] = localAt(x, z, cx, cz, h);
  let best = Infinity;
  for (const r of FOOT) {
    const ox = Math.max(r.x0 - lx, 0, lx - r.x1), oz = Math.max(r.z0 - lz, 0, lz - r.z1);
    const d = ox || oz ? Math.hypot(ox, oz) : -Math.min(lx - r.x0, r.x1 - lx, lz - r.z0, r.z1 - lz);
    best = Math.min(best, d);
  }
  return best;
}
const onBeach = p => !p.locked;                                 // everyone except whoever is on the ladder or the slide
// ask someone to hop out of the way: out to the side when it drives, back from it when it turns on the spot
function stepAside(p) {
  if (!onBeach(p) || (p.evade && p.evadeT > 1)) return;
  const [lx, lz] = localXZ(p.pos.x, p.pos.z);
  let tx, tz;
  if (Math.abs(car.v) < 0.5 && Math.abs(car.w) > 0.15) { const d = Math.max(0.5, Math.hypot(lx, lz)); tx = lx / d * 9; tz = lz / d * 9; }
  else { tx = (lx >= 0 ? 1 : -1) * 5.8; tz = lz; }
  const [wx, wz] = worldXZ(tx, tz);
  p.stepAside(wx, wz, 4);
  if (p.state === 'lie') { p.state = 'wander'; p.towel = null; }
  if (['lie', 'dance', 'fan', 'sit', 'wave'].includes(p.pose)) p.pose = 'idle';
  p.showIcon('oops', 1.8);
}
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
function stopTarget() { car.target = null; marker.visible = false; }
function drive(dt) {
  let vT = 0, wT = 0;
  if (pad.f || pad.t) { if (car.target) stopTarget(); vT = pad.f * (pad.f > 0 ? 3.2 : 2.4); wT = pad.t * 0.9; }
  else if (car.target) {
    const dx = car.target.x - car.x, dz = car.target.z - car.z, d = Math.hypot(dx, dz);
    if (d < 0.7) stopTarget();
    else {
      const want = car.rev ? Math.atan2(-dx, -dz) : Math.atan2(dx, dz);
      let da = want - car.h; da = Math.atan2(Math.sin(da), Math.cos(da));
      wT = THREE.MathUtils.clamp(da * 2.2, -0.9, 0.9);
      const go = Math.abs(da) < 0.5 ? Math.min(1, d / 3) * (1 - Math.abs(da) * 1.2) : 0;
      vT = (car.rev ? -2.4 : 3.2) * Math.max(0, go);
    }
  }
  // nobody drives off while someone is climbing or sliding
  if (riders.length && (vT || wT)) { vT = 0; wT = 0; once('slider', 5000, () => hint('Wait! Someone is on the slide. Off we go when they splash down.', 4)); }
  // look ahead: anyone near where it is about to go hops aside, and it slows right down
  if (Math.abs(vT) > 0.05 || Math.abs(wT) > 0.05) {
    const dir = Math.sign(vT), la = 1.4 + Math.abs(car.v) * 1.2;
    let near = false;
    for (const f of [0.35, 0.7, 1]) {
      const h = car.h + wT * 0.7 * f, x = car.x + Math.sin(h) * dir * la * f, z = car.z + Math.cos(h) * dir * la * f;
      for (const p of people) if (onBeach(p) && clearance(p.pos.x, p.pos.z, x, z, h) < PR + 0.45) { stepAside(p); near = true; }
    }
    if (near) { vT *= 0.35; wT *= 0.5; }
  }
  car.v += (vT - car.v) * Math.min(1, dt * 2.5);
  car.w += (wT - car.w) * Math.min(1, dt * 4);
  const nh = car.h + car.w * dt, nx = car.x + Math.sin(nh) * car.v * dt, nz = car.z + Math.cos(nh) * car.v * dt;
  const dNow = WATER - ground(car.x, car.z), dNext = WATER - ground(nx, nz);
  let ok = nx > BOUNDS.x0 && nx < BOUNDS.x1 && nz > BOUNDS.z0 && nz < BOUNDS.z1;
  if (dNext > MAXD && dNext > dNow) { ok = false; once('deep', 4000, () => hint('Too deep! Any further and the sea would come in.', 3.5)); }
  // THE SAFETY CHECK: never move closer to anyone than their room
  let blocked = false;
  if (ok && (nx !== car.x || nz !== car.z || nh !== car.h)) {
    for (const p of people) {
      if (!onBeach(p)) continue;
      const cNew = clearance(p.pos.x, p.pos.z, nx, nz, nh);
      if (cNew < PR + 0.05 && cNew < clearance(p.pos.x, p.pos.z, car.x, car.z, car.h) - 1e-6) { blocked = true; stepAside(p); }
    }
  }
  if (blocked) {
    car.v = 0; car.w = 0; blockedT += dt;
    if (blockedT > 0.35) once('blocked', 5000, () => { sound.toot(); hint('Stop! Someone is in the way. Wait for them to step aside.', 3.5); });
  } else blockedT = 0;
  if (ok && !blocked) {
    const before = people.map(p => clearance(p.pos.x, p.pos.z, car.x, car.z, car.h));
    car.h = nh; car.x = nx; car.z = nz;
    people.forEach((p, i) => {                                   // (for the tests)
      if (!onBeach(p)) return;
      const c = clearance(p.pos.x, p.pos.z, car.x, car.z, car.h);
      safety.closest = Math.min(safety.closest, c);
      if (c < PR - 0.01 && safety.log.length < 20) safety.log.push({ id: p.id, state: p.state, before: +before[i].toFixed(3), after: +c.toFixed(3), local: localXZ(p.pos.x, p.pos.z).map(v => +v.toFixed(2)) });
    });
  }
  else if (!ok) { car.v *= 0.2; if (car.target) stopTarget(); }
  M.userData.drive(dt, car.v - car.w * HALF_TRACK, car.v + car.w * HALF_TRACK);
  place();
  const speed = Math.min(1, (Math.abs(car.v) + Math.abs(car.w) * 2) / 3.2);
  sound.engine(speed);
  if (car.v < -0.2 && (beepT -= dt) <= 0) { beepT = 0.75; sound.beep(); }
  trackMarks(dt);
  // spray from the tracks in the water
  if (speed > 0.15) for (const [lx, lz] of [[2.2, 2.6], [-2.2, 2.6], [2.2, -3.6], [-2.2, -3.6]]) {
    const p = toWorld(lx, 0, lz);
    if (WATER - ground(p.x, p.z) > 0.15 && Math.random() < speed * 0.9) emit(p.x + (Math.random() - 0.5), WATER, p.z + (Math.random() - 0.5), (Math.random() - 0.5) * 2, 1.5 + Math.random() * 2, (Math.random() - 0.5) * 2, 1.5, 0.8, false);
  }
  if (dNow > 0.5 && !seaHinted) { seaHinted = true; hint('Splash! You are in the sea. Press Slide and the swimmers whoosh into the water.', 6); }
  parkedT = speed < 0.05 ? parkedT + dt : 0;
}

// ---------------------------------------------------------------- track marks in the sand (they fade as the sand dries)
const MARKS = 360;
const markTex = (() => {
  const c = document.createElement('canvas'); c.width = 64; c.height = 32; const g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 64, 32); g.fillStyle = '#9a9a9a';
  for (let x = 2; x < 64; x += 16) g.fillRect(x, 3, 9, 26);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const marks = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.5, 1.15).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', map: markTex, transparent: true, premultipliedAlpha: true, blending: THREE.MultiplyBlending, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), MARKS);
marks.renderOrder = 1; marks.frustumCulled = false; world.scene.add(marks);
const markAge = new Float32Array(MARKS).fill(999), mCol = new THREE.Color();
for (let i = 0; i < MARKS; i++) { marks.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0)); marks.setColorAt(i, mCol.setRGB(1, 1, 1)); }
let markNext = 0, markDist = 0, markFade = 0;
function trackMarks(dt) {
  markDist += Math.abs(car.v) * dt;
  if (markDist > 0.48) {
    markDist = 0;
    const lz = car.v > 0 ? -3.9 : 2.7;
    for (const lx of [2.2, -2.2]) {
      const [x, z] = worldXZ(lx, lz), y = ground(x, z);
      if (y < WATER + 0.03) continue;                           // (the sea washes them away)
      const i = markNext; markNext = (markNext + 1) % MARKS;
      const m = new THREE.Matrix4().makeRotationY(car.h + Math.PI / 2); m.setPosition(x, y + 0.03, z);
      marks.setMatrixAt(i, m); markAge[i] = 0;
    }
    marks.instanceMatrix.needsUpdate = true;
  }
  if ((markFade -= dt) <= 0) {
    markFade = 0.3;
    for (let i = 0; i < MARKS; i++) { markAge[i] += 0.3; const k = Math.min(1, markAge[i] / 45); marks.setColorAt(i, mCol.setScalar(0.74 + 0.26 * k)); }
    marks.instanceColor.needsUpdate = true;
  }
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
function setSpray(on) { spraying = on; sound.ensure(); sound.spray(on); $('[data-a="spray"]').classList.toggle('on', on); if (on) hint('Whoosh! The fountains spray from the four arms. Drive close to anyone who is too hot.', 5); }
const ripples = [];
for (let i = 0; i < 12; i++) {
  const r = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.55, 36).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
  r.renderOrder = 3; r.userData.t = 1; r.visible = false; world.scene.add(r); ripples.push(r);
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
    if (clearance(x, z, car.x, car.z, car.h) < 3) continue;     // not next to the machine
    return [x, z];
  }
  return [12, 10];
}
function addPerson(x, z, look) { const p = new Person(look); p.pos.set(x, ground(x, z), z); world.scene.add(p.g); people.push(p); return p; }
const N = Math.max(4, Math.min(30, +(q.get('people') || 16)));
for (let i = 0; i < N; i++) { const [x, z] = randomSand(); const p = addPerson(x, z); p.timer = Math.random() * 3; }
beach.towels.slice(0, 4).forEach((t, i) => {                    // sunbathers
  if (clearance(t.x, t.z, car.x, car.z, car.h) < 1.5) return;
  const p = people[i]; p.pos.set(t.x, ground(t.x, t.z), t.z); p.state = 'lie'; p.pose = 'lie'; p.heading = t.a; p.towel = t;
});
// walking: if someone's straight path crosses a part of the machine (its body, with the stretch just ahead of it while
// it moves, or the low end of the slide), they walk round that part, one way round, kept until they are well clear
function avoid(x, z, p) {
  const [lx, lz] = localXZ(x, z), moving = Math.abs(car.v) > 0.3, BAND = 0.9;
  const goal = p ? (p.evade || p.target) : null, [gx, gz] = goal ? localXZ(goal.x, goal.y) : [lx, lz];
  const rects = [
    { x0: FOOT[0].x0 - PR, x1: FOOT[0].x1 + PR, z0: FOOT[0].z0 - PR - (moving && car.v < 0 ? 2 : 0), z1: FOOT[0].z1 + PR + (moving && car.v > 0 ? 2 : 0) },
    { x0: FOOT[1].x0 - PR, x1: FOOT[1].x1 + PR, z0: FOOT[1].z0 - PR, z1: FOOT[1].z1 + PR },
  ];
  if (p && !p.sides) p.sides = [null, null];
  for (let k = 0; k < rects.length; k++) {
    const R = rects[k];
    const ox = Math.max(R.x0 - lx, 0, lx - R.x1), oz = Math.max(R.z0 - lz, 0, lz - R.z1), out = Math.hypot(ox, oz);
    if (out > BAND + 0.6) { if (p) p.sides[k] = null; continue; }
    if (out > BAND) continue;
    let blocked = out === 0;
    for (let t = 0.1; t <= 1.001 && !blocked && goal; t += 0.1) { const sx = lx + (gx - lx) * t, sz = lz + (gz - lz) * t; blocked = sx > R.x0 && sx < R.x1 && sz > R.z0 && sz < R.z1; }
    if (!blocked) continue;
    // the face they are at, as an outward normal
    let px = 0, pz = 0;
    if (out === 0) { const dl = lx - R.x0, dr = R.x1 - lx, db = lz - R.z0, df = R.z1 - lz, mn = Math.min(dl, dr, db, df); if (mn === dl) px = -1; else if (mn === dr) px = 1; else if (mn === db) pz = -1; else pz = 1; }
    else if (ox >= oz) px = lx > (R.x0 + R.x1) / 2 ? 1 : -1; else pz = lz > (R.z0 + R.z1) / 2 ? 1 : -1;
    let ux = -pz, uz = px;                                        // anticlockwise along that face
    if (p && p.sides[k] == null) {
      const along = (gx - lx) * ux + (gz - lz) * uz, cx = lx - (R.x0 + R.x1) / 2, cz = lz - (R.z0 + R.z1) / 2;
      if (k === 1) p.sides[k] = px ? (uz < 0 ? 1 : -1) : ((gx - lx) * ux >= 0 ? 1 : -1);          // round the far end of the slide, never into the body
      else p.sides[k] = Math.abs(along) > 0.5 ? Math.sign(along) : (cx * ux + cz * uz >= 0 ? 1 : -1);
    }
    if (p) { ux *= p.sides[k]; uz *= p.sides[k]; }
    const kk = out === 0 ? 1 : 0.25, tx = px * kk + ux * 0.75, tz = pz * kk + uz * 0.75, c = Math.cos(car.h), s2 = Math.sin(car.h);
    return { x: tx * c + tz * s2, z: -tx * s2 + tz * c };
  }
  return null;
}
// and nobody can walk into it: anyone who has stepped into its room is stopped at the nearest edge that is clear of
// every part of it (the body and the low end of the slide overlap, so a spot outside one can still be inside the other)
function keepOut(p) {
  if (clearance(p.pos.x, p.pos.z, car.x, car.z, car.h) >= PR) return;
  const [lx, lz] = localXZ(p.pos.x, p.pos.z);
  const cands = [];
  for (const r of FOOT) {
    const X0 = r.x0 - PR - 0.01, X1 = r.x1 + PR + 0.01, Z0 = r.z0 - PR - 0.01, Z1 = r.z1 + PR + 0.01;
    cands.push([X0, lz], [X1, lz], [lx, Z0], [lx, Z1], [X0, Z0], [X0, Z1], [X1, Z0], [X1, Z1]);
  }
  let best = null, bd = Infinity;
  for (const [cx, cz] of cands) {
    const [wx, wz] = worldXZ(cx, cz), d = Math.hypot(cx - lx, cz - lz);
    if (d < bd && clearance(wx, wz, car.x, car.z, car.h) >= PR) { bd = d; best = [wx, wz]; }
  }
  if (best) { p.pos.x = best[0]; p.pos.z = best[1]; }
}
function pickWander(p) {
  if (Math.random() < 0.25 && balls.length) {                      // a game with the ball
    const b = balls.reduce((a, c) => (c.p.distanceToSquared(p.pos) < a.p.distanceToSquared(p.pos) ? c : a));
    if (b.p.distanceTo(p.pos) < 12 && b.v.length() < 1) { p.walkTo(b.p.x, b.p.z, () => kick(p, b)); return; }
  }
  if (Math.random() < 0.3) { const x = THREE.MathUtils.clamp(p.pos.x + (Math.random() - 0.5) * 12, -30, 30); p.walkTo(x, shoreZ(x) - 1 - Math.random() * 5); }   // a paddle or a swim
  else { const [x, z] = randomSand(); p.walkTo(THREE.MathUtils.lerp(p.pos.x, x, 0.5), THREE.MathUtils.lerp(p.pos.z, z, 0.5)); }
}
// too hot, and cooled down
let hotT = 3;
function heatUp(dt) {
  hotT -= dt; if (hotT > 0) return;
  hotT = 5 + Math.random() * 5;
  if (people.filter(p => p.hot).length >= 4) return;
  const c = people.filter(p => !p.hot && (p.state === 'wander' || p.state === 'lie') && !p.swimming && !p.evade);
  const p = c[Math.floor(Math.random() * c.length)];
  if (!p) return;
  p.hot = true; p.showIcon('hot');
  if (p.state === 'wander') { p.target = null; p.pose = 'fan'; }
  if (!spraying) once('hot', 15000, () => hint('Someone is too hot! Press Fountains and drive close to spray them.', 4.5));
}
function cool(p) {
  if (!p.hot) return;
  p.hot = false; p.showIcon('cool', 2.6); sound.pop();
  if (p.state !== 'lie') { p.pose = 'cheer'; p.cheerT = 1.6; p.target = null; }
  else p.cheerT = 0;
}

// ---------------------------------------------------------------- beach balls: people kick them, the machine can nudge them
const balls = [];
(function makeBalls() {
  const geo = new THREE.SphereGeometry(0.38, 18, 12), cols = ['#ef5b6b', '#ffffff', '#2f6fd0', '#ffd23f', '#ffffff', '#20a464'], col = [], pos = geo.attributes.position, c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) { const a = Math.atan2(pos.getZ(i), pos.getX(i)) + Math.PI; c.set(Math.abs(pos.getY(i)) > 0.34 ? '#ffffff' : cols[Math.floor(a / (Math.PI / 3)) % 6]).convertSRGBToLinear(); col.push(c.r, c.g, c.b); }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, envMapIntensity: 0.6 });
  for (const [x, z] of [[-9, 6], [13, 4]]) { const m = new THREE.Mesh(geo, mat); m.castShadow = true; world.scene.add(m); balls.push({ m, p: new THREE.Vector3(x, ground(x, z) + 0.38, z), v: new THREE.Vector3(), r: 0.38 }); }
})();
function kick(p, b) {
  if (b.p.distanceTo(p.pos) > 1.4) return;
  const others = people.filter(o => o !== p && onBeach(o) && o.state === 'wander' && o.pos.distanceTo(p.pos) < 14);
  const to = others.length ? others[Math.floor(Math.random() * others.length)].pos : new THREE.Vector3(p.pos.x + (Math.random() - 0.5) * 10, 0, p.pos.z + (Math.random() - 0.5) * 10);
  const d = new THREE.Vector3(to.x - b.p.x, 0, to.z - b.p.z), len = Math.max(1, d.length());
  b.v.set(d.x / len * Math.min(6, 1.5 + len * 0.45), 3 + Math.random() * 1.5, d.z / len * Math.min(6, 1.5 + len * 0.45));
  p.face(to.x, to.z); p.pose = 'cheer'; p.cheerT = 0.5; sound.bonk();
}
const ballQ = new THREE.Quaternion(), ballAx = new THREE.Vector3();
function updateBalls(dt) {
  for (const b of balls) {
    const floor = ground(b.p.x, b.p.z), inWater = floor < WATER - 0.2, top = inWater ? WATER - b.r * 0.35 : floor;
    b.v.y -= (inWater && b.p.y - b.r < WATER ? -6 : 9.8) * dt;      // (it floats)
    b.p.addScaledVector(b.v, dt);
    if (b.p.y - b.r < top) { b.p.y = top + b.r; if (b.v.y < 0) b.v.y = inWater ? b.v.y * 0.3 : -b.v.y * 0.55; const f = Math.pow(inWater ? 0.4 : 0.55, dt); b.v.x *= f; b.v.z *= f; }
    // the machine nudges it (it is the only thing it may bump)
    const c = clearance(b.p.x, b.p.z, car.x, car.z, car.h);
    if (c < b.r) {
      const [lx, lz] = localXZ(b.p.x, b.p.z), r = FOOT[0], px = Math.abs(lx) > 3.3 ? Math.sign(lx) : 0, pz = px ? 0 : Math.sign(lz) || 1;
      const nx = px * Math.cos(car.h) + pz * Math.sin(car.h), nz = -px * Math.sin(car.h) + pz * Math.cos(car.h);
      b.p.x += nx * (b.r - c + 0.02); b.p.z += nz * (b.r - c + 0.02);
      const sp = Math.abs(car.v) + 1.5; b.v.set(nx * sp + Math.sin(car.h) * car.v, 2.5, nz * sp + Math.cos(car.h) * car.v);
      once('bonk' + balls.indexOf(b), 400, () => sound.bonk());
    }
    b.p.x = THREE.MathUtils.clamp(b.p.x, -40, 40); b.p.z = THREE.MathUtils.clamp(b.p.z, -30, 17);
    const hv = Math.hypot(b.v.x, b.v.z);
    if (hv > 0.01) { ballAx.set(b.v.z, 0, -b.v.x).normalize(); ballQ.setFromAxisAngle(ballAx, hv * dt / b.r); b.m.quaternion.premultiply(ballQ); }
    b.m.position.copy(b.p);
  }
}

// ---------------------------------------------------------------- the slide: queue, climb, a rubber ring, wheee, splash
// It is a water slide: water runs down the chute and pours off the end. Up to three people can be on it at once:
// the next one climbs as soon as the one before has pushed off from the top.
const queue = [], riders = [];
const RING_COLS = ['#ff5fa2', '#ffd23f', '#4fd8ff', '#ff8a3d', '#7bd389', '#a77bff'];
const QZ = (P.ladder.foot.z) - 0.25;
const queueSpot = i => toWorld(0, 0, QZ - i * 0.85);
function sendToSlide(n = 4, quiet = false) {
  const foot = queueSpot(0);
  const free = people.filter(p => (p.state === 'wander' || p.state === 'concert') && onBeach(p) && !queue.includes(p)).sort((a, b) => a.pos.distanceToSquared(foot) - b.pos.distanceToSquared(foot));
  for (const p of free.slice(0, Math.max(0, n - queue.length))) { p.state = 'queue'; p.pose = 'idle'; queue.push(p); if (crowd.includes(p)) crowd.splice(crowd.indexOf(p), 1); }
  if (!quiet) hint(WATER - ground(foot.x, foot.z) > 0.4 ? 'Here they come! Up the ladder, on to a rubber ring, and wheee into the sea!' : 'Here they come! Back the slide over the sea for a big splash.', 5);
}
// the water running down the chute: a thin film that follows its round bottom, its ripples scrolling down
const slideWater = (() => {
  const c = document.createElement('canvas'); c.width = 64; c.height = 128; const g = c.getContext('2d');
  g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(0, 0, 64, 128);
  for (let i = 0; i < 26; i++) { g.strokeStyle = 'rgba(255,255,255,' + (0.35 + Math.random() * 0.5).toFixed(2) + ')'; g.lineWidth = 1 + Math.random() * 2.5; const x = Math.random() * 64, y = Math.random() * 128; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + 4, y + 10, x - 4, y + 20, x + 2, y + 30); g.stroke(); }
  const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.colorSpace = THREE.SRGBColorSpace;
  const seg = 70, across = 8, half = 0.5, ri0 = 1.85 * 0.4, pos = [], uv = [], idx = [], hh = new THREE.Vector3(0, 0, -1);
  for (let k = 0; k <= seg; k++) {
    const t = k / seg, pt = P.slide.getPointAt(t), tan = P.slide.getTangentAt(t), hz = new THREE.Vector3(tan.x, 0, tan.z);
    if (hz.lengthSq() > 1e-4) hh.lerp(hz.normalize(), k ? 0.5 : 1).normalize();
    const side = new THREE.Vector3(-hh.z, 0, hh.x), nrm = new THREE.Vector3().crossVectors(side, tan).normalize();
    const r = ri0 * (1 + 0.12 * Math.max(0, 1 - t / 0.3) ** 2);
    for (let j = 0; j <= across; j++) {
      const off = (j / across * 2 - 1) * half, lift = r - Math.sqrt(r * r - off * off) - 0.04 + 0.025;
      const v = pt.clone().addScaledVector(side, off).addScaledVector(nrm, lift); pos.push(v.x, v.y, v.z); uv.push(j / across, t * 6);
    }
  }
  for (let k = 0; k < seg; k++) for (let j = 0; j < across; j++) { const i0 = k * (across + 1) + j, i1 = i0 + 1, i2 = i0 + across + 1, i3 = i2 + 1; idx.push(i0, i2, i1, i1, i2, i3); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, color: '#d8f6ff', transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide }));
  m.renderOrder = 2; M.add(m);
  return tex;
})();
let qSort = 0, selfT = 8, pour = 0;
function updateSlide(dt) {
  slideWater.offset.y += dt * 1.6;
  // water pouring off the end
  const end = P.slide.getPointAt(1), tanE = P.slide.getTangentAt(1), endW = toWorld(end.x, end.y, end.z);
  const dirE = new THREE.Vector3().copy(tanE).transformDirection(M.matrixWorld);
  for (pour += dt * 40; pour >= 1; pour--) emit(endW.x + (Math.random() - 0.5) * 0.5, endW.y, endW.z + (Math.random() - 0.5) * 0.5, dirE.x * 1.6 + (Math.random() - 0.5) * 0.5, dirE.y * 1.6, dirE.z * 1.6 + (Math.random() - 0.5) * 0.5, 1.5, 0.7, false);
  if ((qSort -= dt) <= 0) { qSort = 1; const f = queueSpot(0); queue.sort((a, b) => a.pos.distanceToSquared(f) - b.pos.distanceToSquared(f)); }
  queue.forEach((p, i) => { const sp = queueSpot(i); if (!p.target || Math.hypot(p.target.x - sp.x, p.target.y - sp.z) > 0.3) p.walkTo(sp.x, sp.z); });
  // when it is parked with the slide over the sea, now and then someone goes down on their own
  if (parkedT > 4 && !queue.length && !riders.length && WATER - ground(endW.x, endW.z) > 0.6 && (selfT -= dt) <= 0) { selfT = 10 + Math.random() * 8; sendToSlide(1, true); }
  // the next one climbs when nobody is on the ladder or still at the top
  const s0 = queueSpot(0), ladderFree = !riders.some(r => r.phase === 'climb' || r.phase === 'step' || r.phase === 'sit');
  if (ladderFree && riders.length < 3 && queue[0] && !queue[0].evade && Math.hypot(queue[0].pos.x - s0.x, queue[0].pos.z - s0.z) < 0.4 && Math.abs(car.v) < 0.05 && Math.abs(car.w) < 0.05) {
    const p = queue.shift();
    p.locked = true; p.target = null; p.evade = null; p.state = 'slide';
    M.attach(p.g); p.g.position.set(0, 0, P.ladder.z - 0.32); p.g.rotation.set(0, 0, 0); p.pose = 'climb';
    riders.push({ p, phase: 'climb', t: 0 });
  }
  for (const r of [...riders]) ride(r, dt);
}
function ride(R, dt) {
  const p = R.p;
  if (R.phase === 'climb') {
    R.t += dt / 2.0; p.g.position.y = Math.min(1, R.t) * P.ladder.top.y;
    if (R.t >= 1) { R.phase = 'step'; R.t = 0; R.path = [p.g.position.clone(), new THREE.Vector3(0, P.whiteTop.y, P.whiteTop.z), new THREE.Vector3(P.slideTop.x, P.slideTop.y, P.slideTop.z + 0.2)]; R.leg = 0; p.pose = 'walk'; }
  } else if (R.phase === 'step') {
    const a = R.path[R.leg], b = R.path[R.leg + 1], d = a.distanceTo(b);
    R.t += dt * 1.5 / Math.max(0.1, d);
    p.g.position.lerpVectors(a, b, Math.min(1, R.t)); p.g.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
    if (R.t >= 1) { R.t = 0; R.leg++; if (R.leg >= R.path.length - 1) { R.phase = 'sit'; p.pose = 'slide'; p.giveRing(RING_COLS[p.id % RING_COLS.length]); sound.pop(); } }
  } else if (R.phase === 'sit') {
    const tan = P.slide.getTangentAt(0.02); p.g.rotation.y = Math.atan2(tan.x, tan.z);
    R.t += dt;
    if (R.t > 0.45 && !riders.some(o => o !== R && o.phase === 'slide' && o.u < 0.25)) {   // (a gap behind whoever went before)
      R.phase = 'slide'; R.t = 0; R.u = 0; R.turn = 0;
      R.spin = Math.random() < 0.65 ? (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 5) : 0;
      p.pose = Math.random() < 0.5 ? 'ride' : 'slide'; p.showIcon('whee', 1.8);
      sound.whoosh(); sound.whee(0.85 + (p.id % 5) * 0.1);
    }
  } else if (R.phase === 'slide') {
    R.u = Math.min(1, R.u + dt * (0.3 + 1.6 * R.u));
    R.turn += R.spin * dt;
    const pt = P.slide.getPointAt(R.u), tan = P.slide.getTangentAt(R.u);
    p.g.position.copy(pt); p.g.rotation.set(-Math.asin(THREE.MathUtils.clamp(tan.y, -1, 1)) * 0.3, Math.atan2(tan.x, tan.z) + R.turn, 0, 'YXZ');
    if (Math.random() < 0.5) { const w = p.g.getWorldPosition(new THREE.Vector3()); emit(w.x, w.y + 0.2, w.z, (Math.random() - 0.5) * 1.6, 1.2 + Math.random() * 1.5, (Math.random() - 0.5) * 1.6, 1, 0.6, false); }
    if (R.u >= 1) {
      world.scene.attach(p.g);
      R.v = new THREE.Vector3().copy(tan).transformDirection(M.matrixWorld).multiplyScalar(5.2); R.v.y += 2.4;    // off the end with a hop
      R.phase = 'fly'; p.pose = 'ride'; R.twirl = (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 4);
    }
  } else if (R.phase === 'fly') {
    R.v.y -= 9.8 * dt; p.pos.addScaledVector(R.v, dt); p.g.rotation.y += R.twirl * dt; p.g.rotation.x = 0;
    const gy = ground(p.pos.x, p.pos.z), deep = WATER - gy > 0.55;
    if (deep && p.pos.y < WATER - 0.35) {
      splash(p.pos.x, p.pos.z, 1.6); sound.cheer();
      p.locked = false; p.state = 'swim'; p.floating = true; p.pose = 'float'; p.pos.y = WATER - 0.42; p.heading = p.g.rotation.y; p.g.rotation.set(0, p.heading, 0);
      if (p.hot) cool(p); else p.showIcon('cool', 2);
      const x = p.pos.x; p.walkTo(x + (Math.random() - 0.5) * 5, shoreZ(x) + 1.5);
      for (const o of people) if (onBeach(o) && o !== p && o.state === 'wander' && o.pos.distanceTo(p.pos) < 12 && !o.evade) { o.pose = 'cheer'; o.cheerT = 1.2; }
      riders.splice(riders.indexOf(R), 1);
    } else if (!deep && p.pos.y <= gy) {
      p.pos.y = gy; sound.pop(); p.dropRing();
      p.locked = false; p.state = 'wander'; p.pose = 'cheer'; p.cheerT = 1.2; p.heading = p.g.rotation.y; p.g.rotation.set(0, p.heading, 0); p.timer = 1.5;
      riders.splice(riders.indexOf(R), 1);
    }
  }
}

// ---------------------------------------------------------------- the band, its lights, and the crowd
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
  if (band[0]) band[0].add(guitar(black));
  if (band[2]) band[2].add(guitar(red));
  if (band[1]) {
    const stand = new THREE.Group(); stand.position.set(0, 0, 0.42);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 6), chrome); pole.position.y = 0.7; stand.add(pole);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 12), black); stand.add(foot);
    const mic = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), black); mic.position.set(0, 1.45, -0.06); stand.add(mic);
    band[1].add(stand);
  }
})();
// coloured light beams from the stage lights, changing on the beat
const beams = [], BEAM_COLS = ['#ff5fa2', '#4fd8ff', '#ffe14d', '#a77bff', '#5cff9d'];
for (let i = 0; i < 4; i++) {
  const x = [-0.88, -0.3, 0.3, 0.88][i];
  const from = new THREE.Vector3(x, 4.92, 1.4), to = new THREE.Vector3(x * 0.8, 2.86, 2.4 + (i % 2) * 0.5), len = from.distanceTo(to);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.62, len, 20, 1, true).translate(0, -len / 2, 0), new THREE.MeshBasicMaterial({ color: BEAM_COLS[i], transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  cone.position.copy(from); cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), to.clone().sub(from).normalize());
  cone.visible = false; cone.renderOrder = 4; M.add(cone); beams.push(cone);
}
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
  for (const b of beams) b.visible = on;
  if (on) {
    const stage = toWorld(0, 0, P.stage.z);
    const free = people.filter(p => (p.state === 'wander' || p.state === 'swim') && onBeach(p)).sort((a, b) => a.pos.distanceToSquared(stage) - b.pos.distanceToSquared(stage));
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
    beams.forEach((c, i) => c.material.color.set(BEAM_COLS[(lastBeat + i * 2) % BEAM_COLS.length]));
  }
  if (bandOn) beams.forEach((c, i) => { c.material.opacity = 0.14 + 0.12 * Math.max(0, Math.cos((beat % 1) * Math.PI * 2 + i)); c.rotation.z = Math.sin(beat * 0.5 + i) * 0.12; });
  for (const s of notes) { if (s.userData.t >= 1) { s.visible = false; continue; } s.userData.t += dt / 2.2; s.position.y += dt * 1.2; s.position.x += s.userData.vx * dt; s.material.opacity = 1 - s.userData.t; }
  crowd.forEach((p, i) => {
    if (p.evade) return;
    const s = crowdSpot(i), d = Math.hypot(p.pos.x - s.x, p.pos.z - s.z);
    if (d > 0.4) { if (!p.target || Math.hypot(p.target.x - s.x, p.target.y - s.z) > 0.4) p.walkTo(s.x, s.z); if (p.pose === 'dance') p.pose = 'idle'; }
    else if (!p.target) { const st = toWorld(0, 0, P.stage.z); p.face(st.x, st.z); p.pose = p.swimming ? 'idle' : 'dance'; p.beat = beat + (p.id % 3) * 0.15; }
  });
}

// ---------------------------------------------------------------- riding behind the machine
const chase = new THREE.PerspectiveCamera(52, 1, 0.3, 420);
const chaseLook = new THREE.Vector3();
let riding = false;
function setRide(on) {
  riding = on; world.view = on ? chase : null; world.controls.enabled = !on; world.resize();
  $('[data-a="ride"]').classList.toggle('on', on);
  if (on) { placeChase(1); hint('Riding along! Use the arrows to drive.', 4); }
}
function placeChase(k) {
  const f = new THREE.Vector3(Math.sin(car.h), 0, Math.cos(car.h));
  const want = M.position.clone().addScaledVector(f, -12.5).add(new THREE.Vector3(0, 6.4, 0));
  chase.position.lerp(want, k);
  chaseLook.lerp(M.position.clone().addScaledVector(f, 3.5).add(new THREE.Vector3(0, 2.4, 0)), k);
  chase.lookAt(chaseLook);
}

// ---------------------------------------------------------------- tapping things
function tap(cx, cy) {
  const ray = world.rayFrom(cx, cy);
  const hit = ray.intersectObjects([M, ...people.map(p => p.g), ...balls.map(b => b.m)], true).find(h => h.object.visible && !h.object.isSprite && h.object !== marks);
  if (hit) {
    const ball = balls.find(b => b.m === hit.object);
    if (ball) { ball.v.set((Math.random() - 0.5) * 3, 5, (Math.random() - 0.5) * 3); sound.bonk(); return; }
    const person = people.find(p => { let o = hit.object; while (o) { if (o === p.g) return true; o = o.parent; } return false; });
    if (person && onBeach(person)) {
      sound.pop();
      if (person.hot) { hint("I'm too hot! Spray me with the fountains, please!", 3.5); person.showIcon('hot'); }
      else { person.showIcon('hi', 2); if (person.state !== 'lie' && !person.swimming) { person.pose = 'wave'; person.cheerT = 1.6; person.target = null; } }
      return;
    }
    let part = null;
    for (let o = hit.object; o && o !== M; o = o.parent) if (['slide', 'stage', 'nozzles', 'flower', 'parasol', 'tracks', 'body'].includes(o.name)) { part = o.name; break; }
    const local = M.worldToLocal(hit.point.clone());
    if (part === 'slide' || (part === 'body' && local.z < -3.2)) return ACTS.slide();
    if (part === 'stage') return ACTS.band();
    if (part === 'nozzles' || (part === 'body' && Math.abs(local.x) > 1.9 && local.y > 4.1)) return ACTS.spray();
    if (part === 'flower') { spin = 3; sound.whoosh(); return; }
    if (part === 'parasol') { twirl = 1; sound.pop(); return; }
    if (part) return ACTS.horn();
  }
  const g = ray.intersectObjects([beach.sea, beach.sand], false)[0];
  if (g) setTarget(g.point.x, g.point.z);
}
let spin = 0, twirl = 0;
function updateToys(dt) {
  if (spin > 0) { spin -= dt; M.userData.parts.rotor.rotation.x += dt * 14 * Math.min(1, spin); }
  if (twirl > 0) { twirl = Math.max(0, twirl - dt * 0.8); shade.rotation.y += dt * 9 * twirl; }
}
// (the shade spins on its mast: everything in the parasol part above the planter turns about the mast)
const shade = new THREE.Group();
{
  const pa = M.userData.parts.parasol, mastX = -3, mastZ = -9;
  shade.position.set(mastX, 0, mastZ); pa.add(shade);
  for (const c of [...pa.children]) if (c !== shade) { shade.attach(c); }
}

// ---------------------------------------------------------------- one step of the world
function think(p, dt) {
  if (p.cheerT > 0) { p.cheerT -= dt; if (p.cheerT <= 0 && (p.pose === 'cheer' || p.pose === 'wave')) p.pose = p.state === 'lie' ? 'lie' : 'idle'; }
  if (p.evade) return;
  if (p.state === 'lie') { if (p.towel) { p.target = null; p.pose = p.cheerT > 0 ? 'cheer' : 'lie'; } return; }
  if (p.state === 'swim') { if (!p.target) { p.state = 'wander'; p.dropRing(); p.timer = 1 + Math.random() * 2; } if (p.hot) cool(p); return; }
  if (p.state !== 'wander') return;
  if (p.swimming && p.hot) cool(p);
  if (p.hot) { p.target = null; p.pose = 'fan'; return; }
  if (p.pose === 'fan') p.pose = 'idle';
  if (!p.target && p.cheerT <= 0) { p.timer -= dt; if (p.timer <= 0) { pickWander(p); p.timer = 2 + Math.random() * 5; } }
}
function update(dt) {
  drive(dt);
  M.userData.tick(dt);
  updateToys(dt);
  beach.tick(dt);
  spray(dt);
  updateDrops(dt);
  updateRipples(dt);
  updateBalls(dt);
  heatUp(dt);
  updateSlide(dt);
  updateBand(dt);
  for (const p of people) { think(p, dt); p.update(dt, ctx); if (onBeach(p)) keepOut(p); }
  marker.scale.setScalar(1 + Math.sin(performance.now() / 180) * 0.08);
  if (hintT > 0) { hintT -= dt; if (hintT <= 0) hintEl.textContent = ''; }
  if (riding) placeChase(Math.min(1, dt * 3));
  else if (follow) {
    const c = world.controls, d = new THREE.Vector3(car.x, 1.5, car.z).sub(c.target).multiplyScalar(Math.min(1, dt * 2.5));
    c.target.add(d); world.camera.position.add(d);
  }
  world.setSunFocus(car.x, car.z);
}
world.frame(car.x, car.z, 1, true);
world.controls.target.y = 1.5; world.camera.position.y += 1.5;
world.updaters.add(update);

// ---------------------------------------------------------------- controls
let tapStart = null;
world.canvas.addEventListener('pointerdown', e => { sound.ensure(); tapStart = { x: e.clientX, y: e.clientY, t: performance.now() }; });
world.canvas.addEventListener('pointerup', e => {
  if (!tapStart) return;
  const moved = Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y), held = performance.now() - tapStart.t; tapStart = null;
  if (moved > 12 || held > 450) return;
  tap(e.clientX, e.clientY);
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
  spray: () => setSpray(!spraying),
  horn: () => { sound.horn(); for (const p of people) if (onBeach(p) && p.pos.distanceTo(M.position) < 9 && p.state !== 'lie' && !p.evade) { p.pose = 'cheer'; p.cheerT = 0.8; } },
  turnL: () => world.turn(-1), turnR: () => world.turn(1),
  zoomIn: () => { world.camera.zoom = Math.min(3.4, world.camera.zoom * 1.25); world.camera.updateProjectionMatrix(); },
  zoomOut: () => { world.camera.zoom = Math.max(0.7, world.camera.zoom / 1.25); world.camera.updateProjectionMatrix(); },
  follow: () => { follow = !follow; $('[data-a="follow"]').classList.toggle('on', follow); },
  ride: () => setRide(!riding),
  sound: () => { sound.setOn(!sound.on); $('[data-a="sound"]').textContent = sound.on ? '🔊' : '🔇'; },
  voice: () => { voiceOn = !voiceOn; store.set('voice', voiceOn); $('[data-a="voice"]').classList.toggle('off', !voiceOn); if (voiceOn) { lastSaid = ''; say('I will read the messages out loud.'); } else speechSynthesis?.cancel(); },
};
app.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => { sound.ensure(); ACTS[b.dataset.a]?.(); }));

// ---------------------------------------------------------------- test params
if (q.get('drive')) { const [x, z] = q.get('drive').split(',').map(Number); setTarget(x, z); }
for (const a of (q.get('auto') || '').split(',').filter(Boolean)) {
  if (a === 'band') toggleBand(true);
  if (a === 'spray') { spraying = true; $('[data-a="spray"]').classList.add('on'); }
  if (a === 'slide') sendToSlide();
  if (a === 'hot') people.slice(4, 8).forEach(p => { p.hot = true; p.showIcon('hot'); p.pose = 'fan'; });
  if (a === 'ride') setRide(true);
}
if (q.has('clean')) { $('.ui').hidden = true; hintEl.textContent = ''; }
if (q.get('zoom')) { world.camera.zoom = +q.get('zoom'); world.camera.updateProjectionMatrix(); }
if (q.get('turn')) for (let i = 0; i < +q.get('turn'); i++) { world.turn(1); for (let k = 0; k < 20; k++) world.step(0.05); }
if (q.get('sim')) { const n = +q.get('sim') * 30; for (let i = 0; i < n; i++) update(1 / 30); }
world.start();
window.__game = { riders, queue, world, car, people, M, update, setTarget, toggleBand, sendToSlide, clearance, PR, pad, stepAside, balls, setRide, safety };
