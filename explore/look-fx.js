// Little bits of life for the look-inside pages: sounds made in code (no files), smoke, sparkles, splashes,
// confetti and a set of line icons drawn to match Astra Architect's.
import * as THREE from 'three';

// ------------------------------------------------------------------ icons (24 x 24, round ends, colour from the button)
const P = {
  back: '<path d="M15 5l-7 7 7 7"/>',
  cut: '<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="M8.6 8.6 20 18M8.6 15.4 20 6"/>',
  speaker: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mute: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
  left: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
  right: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>',
  in: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M11 8v6M8 11h6"/>',
  out: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4M8 11h6"/>',
  whole: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><path d="M8 14l4 2 4-2-4-2z"/>',
  names: '<path d="M4 7a2 2 0 0 1 2-2h8l6 7-6 7H6a2 2 0 0 1-2-2z"/><circle cx="9" cy="12" r="1.4"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/><path d="M12 3v2"/>',
  fire: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.8 2.4-5.2.6 1.6 1.4 2.3 2.1 2.6C11 8.5 11 5.5 12 3z"/>',
  roof: '<path d="M3 11 12 4l9 7"/><path d="M6 13v7h12v-7"/><path d="M12 1.5v-0" /><path d="M9 8.5 12 6l3 2.5"/>',
  lift: '<path d="M4 10 12 4l8 6"/><path d="M12 14v7M9 17l3-3 3 3"/>',
  apart: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  together: '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M12 5v14M5 12h14"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  plan: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 11h9V4M12 15h9"/>',
  picture: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 17 5-5 4 4 3-3 6 6"/><circle cx="15.5" cy="8.5" r="1.5"/>',
  hat: '<path d="M4 17h16"/><path d="M7 17V9a5 5 0 0 1 10 0v8"/><path d="M2 20h20"/>',
  curtain: '<path d="M3 4h18"/><path d="M5 4c0 6 1 10 4 16M19 4c0 6-1 10-4 16"/><path d="M9 20h6"/>',
  swim: '<path d="M2 18c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><circle cx="15" cy="6" r="2"/><path d="M5 13l4-4 3 2 3-3"/>',
  down: '<path d="M12 4v14M6 12l6 6 6-6"/>',
  up: '<path d="M12 20V6M6 12l6-6 6 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.9 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  door: '<path d="M6 21V4h12v17"/><path d="M3 21h18"/><circle cx="14.5" cy="12.5" r="1"/>',
  wave: '<path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>',
  find: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/><path d="M10.5 7.5v6M7.5 10.5h6"/>',
  school: '<path d="M3 21V10l9-6 9 6v11"/><path d="M9 21v-6h6v6"/><path d="M12 4V1.5"/>',
  hut: '<path d="M5 18V9l7-5 7 5v9"/><circle cx="7.5" cy="19.5" r="1.5"/><circle cx="16.5" cy="19.5" r="1.5"/><path d="M10 18v-5h4v5"/>',
  big: '<path d="M2 21V12l5-3 5 3v9"/><path d="M12 21V11l5-4 5 4v10"/><path d="M5 21v-4h3v4M15 21v-4h3v4"/>',
};
export const icon = (name, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;

// ------------------------------------------------------------------ sound: everything is synthesised
export class Sound {
  constructor() {
    try { this.on = localStorage.getItem('astravic.sound') !== 'off'; } catch (e) { this.on = true; }
    this.ctx = null;
    this.noise = null;
  }
  set(on) { this.on = on; try { localStorage.setItem('astravic.sound', on ? 'on' : 'off'); } catch (e) {} }
  ac() {
    if (!this.on) return null;
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) { return null; }
    if (!this.noise) {
      const n = this.ctx.sampleRate;
      this.noise = this.ctx.createBuffer(1, n, n);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    }
    return this.ctx;
  }
  _env(g, t, a, peak, decay) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + decay);
  }
  // a church-style bell: a few inharmonic partials that die away at different speeds
  bell(f = 523, when = 0, vol = 1) {
    const c = this.ac(); if (!c) return;
    const t = c.currentTime + when;
    const out = c.createGain(); out.gain.value = 0.22 * vol; out.connect(c.destination);
    [[0.5, 0.55, 3.2], [1, 1, 2.6], [1.183, 0.55, 2.2], [1.506, 0.42, 1.8], [2, 0.32, 1.5], [2.514, 0.22, 1.1], [2.662, 0.16, 0.9], [3.011, 0.1, 0.7]].forEach(([r, a, d]) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * r;
      const g = c.createGain(); this._env(g, t, 0.004, a, d);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + d + 0.1);
    });
  }
  chime() {
    const c = this.ac(); if (!c) return;
    const t = c.currentTime;
    [[1046.5, 0], [1318.5, 0.09], [1568, 0.18]].forEach(([f, w]) => {
      const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
      const g = c.createGain(); this._env(g, t + w, 0.01, 0.18, 0.7);
      o.connect(g); g.connect(c.destination); o.start(t + w); o.stop(t + w + 0.8);
    });
  }
  pop() {
    const c = this.ac(); if (!c) return;
    const t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(880, t + 0.07);
    this._env(g, t, 0.005, 0.12, 0.09); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.15);
  }
  _noise(dur, type, f0, f1, peak, a = 0.01) {
    const c = this.ac(); if (!c) return;
    const t = c.currentTime, s = c.createBufferSource(); s.buffer = this.noise;
    const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + dur); fl.Q.value = 0.8;
    const g = c.createGain(); this._env(g, t, a, peak, dur);
    s.connect(fl); fl.connect(g); g.connect(c.destination); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }
  click() { this._noise(0.025, 'highpass', 2600, 1800, 0.18, 0.002); }
  splash() { this._noise(0.75, 'bandpass', 1400, 260, 0.5, 0.02); }
  whoosh() { this._noise(0.5, 'lowpass', 300, 2400, 0.14, 0.12); }
  crackle() { this._noise(0.03, 'bandpass', 1800 + Math.random() * 1500, 900, 0.05 + Math.random() * 0.06, 0.002); }
}

// ------------------------------------------------------------------ textures drawn on a canvas
function canvasTexture(size, draw) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
let _soft, _star;
const softDot = () => _soft || (_soft = canvasTexture(64, (g, s) => {
  const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.45, 'rgba(255,255,255,.75)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, s, s);
}));
const starDot = () => _star || (_star = canvasTexture(64, (g, s) => {
  g.translate(s / 2, s / 2); g.fillStyle = '#fff';
  g.beginPath();
  for (let i = 0; i < 8; i++) { const r = i % 2 ? s * 0.12 : s * 0.48, a = i * Math.PI / 4; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  g.closePath(); g.fill();
}));

// ------------------------------------------------------------------ smoke from a chimney pot
export class Smoke {
  constructor(scene, size) {
    this.size = size; this.list = []; this.on = false; this.hold = false; this.acc = 0; this.emitters = [];
    this.group = new THREE.Group(); scene.add(this.group);
  }
  add(node) { this.emitters.push(node); }
  tick(dt, wind = new THREE.Vector3(1, 0, -0.4)) {
    if (this.on && !this.hold && this.emitters.length) {
      this.acc += dt;
      while (this.acc > 0.22) {
        this.acc -= 0.22;
        for (const e of this.emitters) {
          const m = new THREE.SpriteMaterial({ map: softDot(), color: '#e9e6e0', transparent: true, opacity: 0, depthWrite: false });
          const s = new THREE.Sprite(m);
          e.getWorldPosition(s.position);
          s.position.x += (Math.random() - 0.5) * this.size * 0.2;
          s.userData = { age: 0, life: 3.2 + Math.random() * 1.2, v: new THREE.Vector3((Math.random() - 0.5) * 0.2, 1, (Math.random() - 0.5) * 0.2) };
          s.scale.setScalar(this.size * 0.5);
          this.group.add(s); this.list.push(s);
        }
      }
    }
    for (let i = this.list.length - 1; i >= 0; i--) {
      const s = this.list[i], u = s.userData;
      u.age += dt;
      const k = u.age / u.life;
      if (k >= 1) { this.group.remove(s); s.material.dispose(); this.list.splice(i, 1); continue; }
      s.position.addScaledVector(u.v, dt * this.size * 0.9).addScaledVector(wind, dt * this.size * 0.35 * k);
      s.scale.setScalar(this.size * (0.5 + 2.2 * k));
      s.material.opacity = Math.min(1, k * 6) * (1 - k) * 0.55;
    }
  }
}

// ------------------------------------------------------------------ a burst of sparkles where something was found
export class Sparkles {
  constructor(scene) { this.list = []; this.group = new THREE.Group(); scene.add(this.group); }
  burst(pos, size, n = 26) {
    const cols = ['#ffd34d', '#ffffff', '#ff9e5e', '#7fd3ff', '#ffe08a'];
    for (let i = 0; i < n; i++) {
      const m = new THREE.SpriteMaterial({ map: starDot(), color: cols[i % cols.length], transparent: true, depthWrite: false, depthTest: false });
      const s = new THREE.Sprite(m);
      s.position.copy(pos);
      const a = Math.random() * Math.PI * 2, e = Math.random() * 0.9 + 0.2;
      s.userData = { age: 0, life: 0.9 + Math.random() * 0.5, v: new THREE.Vector3(Math.cos(a) * Math.cos(e), Math.sin(e) + 0.4, Math.sin(a) * Math.cos(e)).multiplyScalar(size * (1.6 + Math.random() * 1.6)), spin: (Math.random() - 0.5) * 8 };
      s.scale.setScalar(size * 0.45);
      s.renderOrder = 10;
      this.group.add(s); this.list.push(s);
    }
  }
  tick(dt, size) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const s = this.list[i], u = s.userData;
      u.age += dt;
      const k = u.age / u.life;
      if (k >= 1) { this.group.remove(s); s.material.dispose(); this.list.splice(i, 1); continue; }
      s.position.addScaledVector(u.v, dt);
      u.v.y -= size * 3.2 * dt;
      s.material.rotation += u.spin * dt;
      s.material.opacity = 1 - k * k;
      s.scale.setScalar(size * 0.45 * (1 - k * 0.5));
    }
  }
}

// ------------------------------------------------------------------ a splash ring on the water
export class Splash {
  constructor(scene) { this.list = []; this.group = new THREE.Group(); scene.add(this.group); }
  at(pos, size) {
    for (let r = 0; r < 3; r++) {
      const m = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 40), m);
      ring.rotation.x = -Math.PI / 2; ring.position.copy(pos); ring.position.y += 0.01;
      ring.userData = { age: -r * 0.18, life: 1.3, size };
      ring.scale.setScalar(0.001);
      this.group.add(ring); this.list.push(ring);
    }
    for (let i = 0; i < 14; i++) {
      const m = new THREE.SpriteMaterial({ map: softDot(), color: '#ffffff', transparent: true, depthWrite: false });
      const s = new THREE.Sprite(m); s.position.copy(pos);
      const a = Math.random() * Math.PI * 2;
      s.userData = { drop: true, age: 0, life: 0.8, v: new THREE.Vector3(Math.cos(a) * 0.8, 2.6 + Math.random(), Math.sin(a) * 0.8).multiplyScalar(size), size };
      s.scale.setScalar(size * 0.25);
      this.group.add(s); this.list.push(s);
    }
  }
  tick(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const o = this.list[i], u = o.userData;
      u.age += dt;
      if (u.age < 0) continue;
      const k = u.age / u.life;
      if (k >= 1) { this.group.remove(o); o.material.dispose(); o.geometry?.dispose?.(); this.list.splice(i, 1); continue; }
      if (u.drop) { o.position.addScaledVector(u.v, dt); u.v.y -= u.size * 9 * dt; o.material.opacity = 1 - k; }
      else { o.scale.setScalar(u.size * (0.3 + 2.4 * k)); o.material.opacity = 0.9 * (1 - k); }
    }
  }
}

// ------------------------------------------------------------------ confetti for finding everything
export function confetti(host) {
  const cols = ['#e5483d', '#f7c22e', '#2f6fe4', '#20a464', '#ff7aa6', '#5fd2db'];
  const box = document.createElement('div'); box.className = 'lk-confetti';
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = cols[i % cols.length];
    p.style.animationDelay = (Math.random() * 0.6) + 's';
    p.style.animationDuration = (2.2 + Math.random() * 1.6) + 's';
    p.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
    p.style.setProperty('--x', (Math.random() * 160 - 80) + 'px');
    box.appendChild(p);
  }
  host.appendChild(box);
  setTimeout(() => box.remove(), 4500);
}

// ------------------------------------------------------------------ ripples: rings spreading on the water
export class Ripples {
  constructor(scene) { this.scene = scene; this.list = []; this.geo = new THREE.RingGeometry(0.88, 1, 40); this.geo.rotateX(-Math.PI / 2); }
  at(pos, size = 1, life = 1.7) {
    const m = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.75, depthWrite: false }));
    m.position.copy(pos); m.position.y += 0.012; m.scale.setScalar(0.06 * size); m.renderOrder = 4; m.raycast = () => {};
    this.scene.add(m); this.list.push({ m, t: 0, life, size });
  }
  tick(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const r = this.list[i]; r.t += dt;
      const f = r.t / r.life;
      if (f >= 1) { this.scene.remove(r.m); r.m.material.dispose(); this.list.splice(i, 1); continue; }
      r.m.scale.setScalar((0.08 + 0.6 * Math.sqrt(f)) * r.size);
      r.m.material.opacity = 0.75 * (1 - f) * (1 - f);
    }
  }
}

// ------------------------------------------------------------------ people who move
// tools/blender/lib.py rigs every standing figure: '<name>_hipL/R' carry the legs, '<name>_torso' the body and head,
// '<name>_shL/R' the arms (L is the figure's own left, three's -z side). A joint's [spread, swing]: swing turns it
// about the figure's sideways axis (+ swings a leg or an arm forward, PI holds an arm straight up); spread turns it
// about the forward axis. The torso has bend (- leans forward), twist and lean. A behaviour sets body.goal (a pose
// from the helpers below), body.pos (where the feet would be standing upright, in the parent's frame) and body.yaw;
// update() eases the joints towards the goal and pitches the body about its hips, so a swimmer lies down in the
// water instead of toppling over from the feet.
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t * t * (3 - 2 * t);
// a point and the way ahead at distance d along a path of Vector3s (lengths cached on the array)
export function along(path, d) {
  const lens = path._lens || (path._lens = path.slice(1).map((q, i) => q.distanceTo(path[i])));
  const total = path._total ?? (path._total = lens.reduce((x, y) => x + y, 0));
  let i = 0, r = Math.max(0, Math.min(d, total));
  while (i < lens.length - 1 && r > lens[i]) { r -= lens[i]; i++; }
  const a = path[i], b = path[i + 1] || path[i], t = lens[i] ? Math.min(1, r / lens[i]) : 1;
  return { p: a.clone().lerp(b, t), dir: b.clone().sub(a), total, i };
}
const bump = (u, a, b) => (u <= a || u >= b) ? 0 : Math.sin((u - a) / (b - a) * Math.PI);
export class Body {
  constructor(get, name) {
    const g = k => get(`${name}_${k}`);
    this.name = name;
    this.root = g('root'); this.hipL = g('hipL'); this.hipR = g('hipR'); this.torso = g('torso'); this.shL = g('shL'); this.shR = g('shR');
    this.ok = !!(this.root && this.torso && this.shL && this.shR && this.hipL && this.hipR);
    if (!this.root) return;
    this.h = this.root.userData.h || 1.6;
    this.pos = this.root.position.clone();
    this.home = this.pos.clone();
    this.yaw = this.yawNow = this.root.rotation.y;
    this.homeYaw = this.yaw;
    this.c = Body.rest(); this.goal = Body.rest();
    this.busy = false; this.seed = Math.random() * 50;
  }
  static rest() { return { hL: [0, 0], hR: [0, 0], aL: [0.07, 0], aR: [-0.07, 0], tb: 0, tt: 0, ts: 0, pitch: 0, lift: 0, bob: 0 }; }
  // turn to face a point (three coordinates, in the parent's frame)
  face(x, z) { const dx = x - this.pos.x, dz = z - this.pos.z; if (dx * dx + dz * dz > 1e-6) this.yaw = Math.atan2(-dz, dx); }
  update(dt) {
    if (!this.ok) return;
    const c = this.c, g = this.goal, k = 1 - Math.exp(-24 * dt), k2 = 1 - Math.exp(-4.5 * dt);
    for (const j of ['hL', 'hR', 'aL', 'aR']) { c[j][0] = lerp(c[j][0], g[j][0], k); c[j][1] = lerp(c[j][1], g[j][1], k); }
    for (const j of ['tb', 'tt', 'ts']) c[j] = lerp(c[j], g[j], k);
    c.pitch = lerp(c.pitch, g.pitch, k2); c.lift = lerp(c.lift, g.lift, k2);
    let d = this.yaw - this.yawNow; d = Math.atan2(Math.sin(d), Math.cos(d)); this.yawNow += d * (1 - Math.exp(-7 * dt));
    this.hipL.rotation.set(c.hL[0], 0, c.hL[1]); this.hipR.rotation.set(c.hR[0], 0, c.hR[1]);
    this.shL.rotation.set(c.aL[0], 0, c.aL[1]); this.shR.rotation.set(c.aR[0], 0, c.aR[1]);
    this.torso.rotation.set(c.ts, c.tt, c.tb);
    // pitch about the hips: the feet swing back and up as the body lies down
    const hy = 0.5 * this.h, ox = hy * Math.sin(c.pitch), oy = hy * (1 - Math.cos(c.pitch));
    const cy = Math.cos(this.yawNow), sy = Math.sin(this.yawNow);
    this.root.position.set(this.pos.x + ox * cy, this.pos.y + oy + c.lift + (g.bob || 0), this.pos.z - ox * sy);
    this.root.rotation.set(0, this.yawNow, c.pitch);
  }
  // walk, wade or run along a path of points (in the parent's frame): d is the distance gone so far
  follow(path, d, mode = 'walk') {
    const at = along(path, d);
    this.pos.copy(at.p);
    if (at.dir.x * at.dir.x + at.dir.z * at.dir.z > 1e-8) this.yaw = Math.atan2(-at.dir.z, at.dir.x);
    const run = mode === 'run', ph = d / ((run ? 0.62 : 0.42) * this.h) * Math.PI;
    this.goal = mode === 'wade' ? Body.wade(ph, this.h) : run ? Body.walk(ph, this.h, 0.8, 0.75) : Body.walk(ph, this.h);
    return at.total;
  }
  // ---- poses
  static idle(t) {
    const g = Body.rest(), b = Math.sin(t * 1.7);
    g.tb = -0.02 + 0.015 * b;
    g.aL = [0.08 + 0.02 * b, 0.05 * Math.sin(t * 1.7 + 1)]; g.aR = [-0.08 - 0.02 * b, 0.05 * Math.sin(t * 1.7 + 2)];
    g.tt = 0.25 * Math.sin(t * 0.37) * (Math.sin(t * 0.13) > 0 ? 1 : 0.3);
    return g;
  }
  // walking: ph is the stride phase (2 PI per two steps); the body dips as the legs open, so the feet stay down
  static walk(ph, h, a = 0.5, arm = 0.42) {
    const g = Body.rest(), s = Math.sin(ph);
    g.hL = [0, a * s]; g.hR = [0, -a * s];
    g.aL = [0.08, -arm * s]; g.aR = [-0.08, arm * s];
    g.tb = -0.06; g.tt = 0.12 * s;
    g.bob = -0.46 * h * (1 - Math.cos(a * s));
    return g;
  }
  static wade(ph, h) {
    const g = Body.walk(ph, h, 0.3, 0.1), s = Math.sin(ph);
    g.aL = [0.6, 0.45 + 0.12 * s]; g.aR = [-0.6, 0.45 - 0.12 * s]; g.tb = -0.12;
    return g;
  }
  // breaststroke: u runs 0 to 1 through one stroke (pull, breathe, kick, glide)
  static swim(u) {
    const g = Body.rest();
    let th, sp;
    if (u < 0.35) { const t = ease(u / 0.35); th = Math.PI - 0.15; sp = lerp(0.05, 1.0, t); }
    else if (u < 0.65) { const t = ease((u - 0.35) / 0.3); th = lerp(Math.PI - 0.15, Math.PI / 2 + 0.15, t); sp = lerp(1.0, 0.35, t); }
    else { const t = ease((u - 0.65) / 0.35); th = lerp(Math.PI / 2 + 0.15, Math.PI - 0.15, t); sp = lerp(0.35, 0.05, t); }
    g.aL = [-sp, th]; g.aR = [sp, th];
    let lt = 0, ls = 0;
    if (u >= 0.45 && u < 0.7) { const t = ease((u - 0.45) / 0.25); lt = 0.9 * t; ls = 0.3 * t; }
    else if (u >= 0.7) { const t = ease((u - 0.7) / 0.3); lt = 0.9 * (1 - t); ls = 0.3 * (1 - t * t); }
    g.hL = [ls, lt]; g.hR = [-ls, lt];
    g.pitch = -1.35;
    g.tb = 0.16 * bump(u, 0.3, 0.72);           // head and shoulders up to breathe
    return g;
  }
  // treading water, upright: legs pedal, hands scull
  static tread(t) {
    const g = Body.rest(), s = Math.sin(t * 4.2), sc = 0.75 + 0.3 * Math.sin(t * 5.5);
    g.hL = [0.12, 0.45 * s]; g.hR = [-0.12, -0.45 * s];
    g.aL = [sc, 1.15]; g.aR = [-sc, 1.15];
    g.bob = 0.03 * Math.sin(t * 5.5);
    return g;
  }
  static wave(t, side = 'R') {
    const g = Body.idle(t), w = 0.25 + 0.32 * Math.sin(t * 9);
    if (side === 'R') g.aR = [w, Math.PI - 0.35]; else g.aL = [-w, Math.PI - 0.35];
    return g;
  }
  static jump(t, h) {
    const g = Body.rest(), j = Math.max(0, Math.sin(t * 7));
    g.bob = j * 0.16 * h;
    g.aL = [-0.5, Math.PI - 0.4]; g.aR = [0.5, Math.PI - 0.4];
    g.hL = [0, -0.25 * j]; g.hR = [0, -0.25 * j];
    return g;
  }
  // turning a winch handle: a is the crank's angle
  static crank(a) {
    const g = Body.rest(), s = Math.sin(a), c = Math.cos(a);
    g.aL = [-0.12, 1.05 + 0.45 * s]; g.aR = [0.12, 1.05 + 0.45 * s];
    g.tb = -0.25 - 0.1 * c; g.hL = [0, 0.15]; g.hR = [0, -0.1];
    return g;
  }
  // leaning over to push something down (the dipper): k from 0 to 1
  static push(k) {
    const g = Body.rest();
    g.tb = -0.75 * k; g.aL = [-0.1, 0.25 + 1.0 * k]; g.aR = [0.1, 0.25 + 1.0 * k];
    return g;
  }
}
