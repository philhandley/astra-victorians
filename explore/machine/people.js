// People for the bathing machine and its beach, drawn like the children in Astra Architect (kid.js, the 'crew'
// figures): soft light, no outlines, grown-ups are the same figure drawn bigger. figure(look) makes one in metres,
// feet at y = 0, facing +z; Person adds walking, swimming, sitting, dancing, fanning and cheering for the game.
// The band keeps the characters from the LEGO model: a knight in a black helmet, a pig, and a smiley in a white shirt.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { kidParts, kidLook, HIP, SHOULDER, LEG_X, ARM_X, HAIRDOS, HATS, LEG_EXTRAS } from './kid.js';

const KID_H = 0.2245;                                         // a kid figure's height in its own units

// Looks for the band and the girl on the slide (the rest of the beach uses kidLook)
export const LOOKS = {
  knight: { top: '#24459a', sleeve: '#24459a', shorts: '#24459a', shoes: '#2a2c33', skin: '#f3d4bd', hair: '#1f1b18', style: 0, helmet: '#1d1e22', badge: '#e8e8e4' },
  pig: { top: '#f2a9bf', sleeve: '#f2a9bf', shorts: '#6a3f26', shoes: '#3c3f45', skin: '#f2a9bf', hair: null, pig: true, badge: '#4f8a5b' },
  smiley: { top: '#f4f2ec', sleeve: '#f4f2ec', shorts: '#2d2f6b', shoes: '#efe9dc', skin: '#f3d4bd', hair: '#6b4128', style: 0, badge: '#d23b33' },
  rider: { top: '#2a6fd0', sleeve: '#2a6fd0', shorts: '#4b2a8c', shoes: '#efe9dc', skin: '#f3d4bd', hair: '#e8c35a', style: 4 },
};

// (each figure is five meshes for the tablet: the body, two legs and two arms, with their colours baked in)
const PMAT = new THREE.MeshLambertMaterial({ vertexColors: true });
const tmpC = new THREE.Color();
function painted(geo, hex) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
  tmpC.set(hex).convertSRGBToLinear();
  const n = g.attributes.position.count, c = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { c[i * 3] = tmpC.r; c[i * 3 + 1] = tmpC.g; c[i * 3 + 2] = tmpC.b; }
  g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return g;
}
export function figure(look, height = 1.75) {
  const P = kidParts(), g = new THREE.Group(), body = new THREE.Group();
  body.scale.setScalar(height / KID_H); g.add(body);
  const parts = [], add = (geo, hex) => parts.push(painted(geo, hex));
  add(P.torso, look.top);
  if (look.band) add(P.band, look.band);
  add(P.head, look.skin);
  if (!look.pig) add(P.eyes, '#2a2523');
  const style = typeof look.style === 'number' ? HAIRDOS[look.style] : null;
  if (style && (look.hair || HATS.has(style))) add(P[style], HATS.has(style) ? look.hat : look.hair);
  if (look.hood) add(P.hood, look.hood);
  if (look.skirt) add(P.skirt, look.skirt);
  if (look.phones) add(P.phones, look.phones);
  if (look.bag) add(P.bag, look.bag);
  if (look.badge) add(new THREE.CircleGeometry(0.0085, 10).translate(0, 0.128, 0.0232), look.badge);
  if (look.helmet) {
    add(new THREE.SphereGeometry(0.037, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.56).translate(0, 0.192, 0), look.helmet);
    add(new THREE.CylinderGeometry(0.037, 0.038, 0.03, 14, 1, true, Math.PI * 0.55, Math.PI * 0.9).translate(0, 0.18, 0), look.helmet);
    add(new THREE.BoxGeometry(0.005, 0.026, 0.006).translate(0, 0.184, 0.036), look.helmet);
  }
  if (look.pig) {
    add(new THREE.CylinderGeometry(0.013, 0.014, 0.012, 12).rotateX(Math.PI / 2).translate(0, 0.183, 0.034), '#ea8aa8');
    for (const s of [-1, 1]) {
      add(new THREE.CircleGeometry(0.0028, 6).translate(s * 0.0045, 0.183, 0.0405), '#8a3b55');
      add(new THREE.ConeGeometry(0.009, 0.016, 4).rotateZ(-s * 0.5).translate(s * 0.025, 0.218, 0), '#ea8aa8');
      add(new THREE.SphereGeometry(0.0034, 6, 4).translate(s * 0.011, 0.195, 0.031), '#2a2523');
    }
  }
  const mesh = (geos, shadow = true) => { const m = new THREE.Mesh(mergeGeometries(geos), PMAT); m.castShadow = shadow; m.userData.people = true; return m; };
  body.add(mesh(parts));
  const limbs = {};
  for (const s of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(s * LEG_X, HIP, 0);
    leg.add(mesh([painted(P.leg, look.shorts), painted(P.shoe, look.shoes), ...LEG_EXTRAS.map(([x, col]) => painted(P[x], col))])); body.add(leg);
    const arm = new THREE.Group(); arm.position.set(s * ARM_X, SHOULDER, 0); arm.rotation.z = s * 0.08;
    arm.add(mesh([painted(P.arm, look.sleeve), painted(P.hand, look.skin)], false)); body.add(arm);
    limbs[s < 0 ? 'legL' : 'legR'] = leg; limbs[s < 0 ? 'armL' : 'armR'] = arm;
  }
  g.userData = { body, ...limbs, height };
  return g;
}

// Little pictures that float over a head: hot, cooled, music notes
function iconTex(kind) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  g.translate(64, 64);
  if (kind === 'hot') {
    g.fillStyle = '#ff7a2f';
    for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.beginPath(); g.moveTo(-9, -36); g.lineTo(0, -58); g.lineTo(9, -36); g.fill(); }
    g.beginPath(); g.arc(0, 0, 34, 0, Math.PI * 2); g.fillStyle = '#ffb347'; g.fill();
    g.fillStyle = '#7a2e0e'; g.beginPath(); g.arc(-12, -6, 5, 0, 7); g.arc(12, -6, 5, 0, 7); g.fill();
    g.strokeStyle = '#7a2e0e'; g.lineWidth = 5; g.beginPath(); g.arc(0, 18, 10, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
    g.fillStyle = '#47b6ff'; g.beginPath(); g.moveTo(30, -8); g.quadraticCurveTo(44, 12, 30, 20); g.quadraticCurveTo(18, 12, 30, -8); g.fill();
  } else if (kind === 'cool') {
    g.fillStyle = '#47b6ff'; g.beginPath(); g.moveTo(0, -54); g.bezierCurveTo(40, -6, 44, 46, 0, 46); g.bezierCurveTo(-44, 46, -40, -6, 0, -54); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(-14, -2, 7, 12, -0.4, 0, 7); g.fill();
    g.fillStyle = '#123a5c'; g.beginPath(); g.arc(-10, 10, 4.5, 0, 7); g.arc(12, 10, 4.5, 0, 7); g.fill();
    g.strokeStyle = '#123a5c'; g.lineWidth = 4.5; g.beginPath(); g.arc(1, 18, 11, 0.25, Math.PI - 0.25); g.stroke();
  } else if (kind === 'oops') {                                  // watch out: stepping aside for the machine
    g.beginPath(); g.arc(0, 0, 50, 0, Math.PI * 2); g.fillStyle = '#ffd23f'; g.fill(); g.lineWidth = 7; g.strokeStyle = '#1f2229'; g.stroke();
    g.fillStyle = '#1f2229'; g.font = '800 80px Lexend, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('!', 0, 4);
  } else if (kind === 'hi') {                                    // a speech bubble saying hello
    g.fillStyle = '#ffffff'; g.strokeStyle = '#1f2229'; g.lineWidth = 6;
    g.beginPath(); g.ellipse(0, -8, 56, 40, 0, 0, Math.PI * 2); g.moveTo(-14, 26); g.lineTo(-26, 54); g.lineTo(6, 30); g.fill(); g.stroke();
    g.fillStyle = '#1f2229'; g.font = '800 40px Lexend, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Hi!', 0, -6);
  } else if (kind === 'whee') {                                  // a shout while sliding
    g.fillStyle = '#ffffff'; g.strokeStyle = '#e5519d'; g.lineWidth = 6;
    g.beginPath(); g.ellipse(0, -6, 60, 38, -0.12, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = '#e5519d'; g.font = 'italic 800 34px Lexend, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Wheee!', 0, -5);
  } else if (kind === 'note' || kind === 'note2') {
    g.fillStyle = kind === 'note' ? '#7b61ff' : '#ef5b6b'; g.font = 'bold 104px Lexend, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(kind === 'note' ? '♪' : '♫', 0, 4);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const ICONS = {};
export function iconMat(kind) {
  if (!ICONS[kind]) ICONS[kind] = new THREE.SpriteMaterial({ map: iconTex(kind), depthTest: false, transparent: true });
  return ICONS[kind];
}

// ---------------------------------------------------------------- a person on the beach, for the game
let nextId = 0;
export class Person {
  constructor(look = null, height = null) {
    this.id = nextId++;
    const child = !look && this.id % 3 === 1;
    this.look = look || kidLook(this.id * 13 + 5);
    this.g = figure(this.look, height || (child ? 1.25 : 1.68 + (this.id % 4) * 0.05));
    const u = this.g.userData;
    Object.assign(this, { body: u.body, legL: u.legL, legR: u.legR, armL: u.armL, armR: u.armR, height: u.height });
    this.icon = new THREE.Sprite(iconMat('hot')); this.icon.scale.setScalar(0.7); this.icon.visible = false; this.icon.renderOrder = 10;
    this.g.add(this.icon);
    this.pos = this.g.position;
    this.heading = Math.random() * Math.PI * 2;
    this.speed = child ? 1.9 : 1.4 + Math.random() * 0.3;
    this.pose = 'idle'; this.t = Math.random() * 10;
    this.target = null; this.onArrive = null;
    this.state = 'wander'; this.timer = 0; this.hot = false; this.iconT = 0;
  }
  walkTo(x, z, onArrive = null) { this.target = new THREE.Vector2(x, z); this.onArrive = onArrive; }
  // a rubber ring round the middle, for the slide and for floating back to the beach
  giveRing(hex) {
    if (!this.ring) {
      const ring = new THREE.Group();
      const tube = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.15, 10, 28).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: hex, roughness: 0.3, envMapIntensity: 0.7 }));
      tube.castShadow = true; ring.add(tube);
      for (let i = 0; i < 4; i++) { const st = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.152, 10, 5, 0.32).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 })); st.rotation.y = i * Math.PI / 2; ring.add(st); }
      this.ring = ring; this.g.add(ring);
    }
    this.ring.children[0].material.color.set(hex); this.ring.visible = true;
  }
  dropRing() { if (this.ring) this.ring.visible = false; this.floating = false; }
  // stepping out of the machine's way comes before anything else they were doing
  stepAside(x, z, secs = 4) { this.evade = new THREE.Vector2(x, z); this.evadeT = secs; }
  face(x, z) { this.heading = Math.atan2(x - this.pos.x, z - this.pos.z); }
  showIcon(kind, secs = 0) { this.icon.material = iconMat(kind); this.icon.visible = true; this.iconT = secs; }
  // ctx: { ground(x, z), avoid(x, z, person) -> push {x, z} or null, water }
  update(dt, ctx) {
    this.t += dt;
    let moving = false;
    if (this.evade && (this.evadeT -= dt) <= 0) this.evade = null;
    const goal = this.evade || this.target;
    if (goal && !this.locked) {
      const dx = goal.x - this.pos.x, dz = goal.y - this.pos.z, d = Math.hypot(dx, dz);
      if (d < (this.evade ? 0.3 : 0.12)) {
        if (this.evade) this.evade = null;
        else { this.target = null; const fn = this.onArrive; this.onArrive = null; fn?.(this); }
      } else {
        const sp = (this.floating ? 0.75 : this.swimming ? 0.9 : this.speed * (this.evade ? 1.7 : 1)) * Math.min(1, d / 0.4 + 0.3);
        let vx = dx / d * sp, vz = dz / d * sp;
        const push = ctx.avoid?.(this.pos.x, this.pos.z, this);
        if (push) { vx += push.x * 2.6; vz += push.z * 2.6; }
        this.pos.x += vx * dt; this.pos.z += vz * dt;
        let da = Math.atan2(vx, vz) - this.heading; da = Math.atan2(Math.sin(da), Math.cos(da));
        this.heading += da * Math.min(1, dt * 10);
        moving = true;
      }
    }
    if (!this.locked) {
      const gy = ctx.ground(this.pos.x, this.pos.z);
      if (this.floating && gy > ctx.water - 0.45) this.dropRing();                 // (stand up in the shallows)
      this.swimming = !this.floating && gy < ctx.water - this.height * 0.6;
      this.pos.y = this.floating ? Math.max(gy, ctx.water - 0.42 + Math.sin(this.t * 2.4) * 0.05) : this.swimming ? ctx.water - this.height * 0.66 + Math.sin(this.t * 2.2) * 0.04 : gy;
      if (this.ring?.visible) this.ring.position.y = this.floating ? 0.4 : 0.62;
      this.g.rotation.y = this.heading;
      if (moving && ['dance', 'fan', 'wave'].includes(this.pose)) this.pose = 'walk';
      if (this.floating) this.pose = 'float';
      else if (this.pose === 'float') this.pose = 'idle';
      if (!['sit', 'lie', 'dance', 'cheer', 'fan', 'wave', 'float'].includes(this.pose)) this.pose = this.swimming ? 'swim' : moving ? 'walk' : 'idle';
    }
    this.animate();
    if (this.iconT > 0) { this.iconT -= dt; if (this.iconT <= 0 && !this.hot) this.icon.visible = false; }
    if (this.icon.visible) this.icon.position.y = (this.pose === 'lie' ? 0.6 : this.height + 0.45) + Math.sin(this.t * 3) * 0.05;
  }
  animate() {
    const t = this.t, L = this.legL.rotation, R = this.legR.rotation, A = this.armL.rotation, B = this.armR.rotation;
    let lift = 0, rx = 0;
    A.set(0, 0, -0.08); B.set(0, 0, 0.08); L.set(0, 0, 0); R.set(0, 0, 0);
    switch (this.pose) {
      case 'walk': { const s = Math.sin(t * 8); L.x = s * 0.55; R.x = -s * 0.55; A.x = -s * 0.5; B.x = s * 0.5; lift = Math.abs(Math.cos(t * 8)) * 0.03; break; }
      case 'swim': { A.x = -(t * 5) % (Math.PI * 2); B.x = -(t * 5 + Math.PI) % (Math.PI * 2); L.x = Math.sin(t * 8) * 0.3; R.x = -L.x; break; }
      case 'sit': L.x = R.x = -1.45; A.x = B.x = -0.4; break;
      case 'slide': L.x = R.x = -1.45; A.x = B.x = -2.7; A.z = -0.35; B.z = 0.35; break;
      case 'lie': A.x = B.x = -3.0; rx = -Math.PI / 2; break;
      case 'dance': { const b = this.beat ?? t * 2, s = Math.sin(b * Math.PI * 2); lift = Math.max(0, s) * 0.12; A.x = -2.6 - s * 0.4; B.x = -2.6 + s * 0.4; A.z = -0.3; B.z = 0.3; L.x = s * 0.2; R.x = -s * 0.2; break; }
      case 'cheer': lift = Math.abs(Math.sin(t * 7)) * 0.25; A.x = B.x = -2.9; A.z = -0.35; B.z = 0.35; break;
      case 'fan': B.x = -2.0 + Math.sin(t * 16) * 0.35; B.z = 0.5; A.x = -0.2; break;
      case 'wave': B.x = -2.9; B.z = 0.35 + Math.sin(t * 10) * 0.45; break;
      case 'float': L.x = R.x = -1.2; A.x = -0.9 + Math.sin(t * 4) * 0.5; B.x = -0.9 - Math.sin(t * 4) * 0.5; A.z = -0.6; B.z = 0.6; break;   // sitting in the ring, paddling
      case 'ride': L.x = R.x = -1.45; A.x = B.x = -2.9; A.z = -0.5; B.z = 0.5; break;                                                    // arms up on the slide
      case 'climb': { const s = Math.sin(t * 8); A.x = -2.6 + s * 0.4; B.x = -2.6 - s * 0.4; L.x = -0.6 + s * 0.5; R.x = -0.6 - s * 0.5; break; }
      case 'fall': A.x = B.x = -2.8; A.z = -0.6; B.z = 0.6; L.x = -0.5; R.x = 0.3; break;
      default: A.x = Math.sin(t * 1.3) * 0.05; B.x = -A.x;
    }
    this.body.position.y = rx ? 0.18 : lift;
    this.body.rotation.x = rx;
  }
}
