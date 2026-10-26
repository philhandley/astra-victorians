// Look-inside pages, v3: a Blender-built model on a diorama block that you spin with a finger, in the Astra family
// look (Jelly Harbour's paper backdrop and frosted panel, Astra Architect's Lexend tiles and tool buttons).
//
// The model (tools/blender/*.py) is made of parts: nodes named 'part_<key>' whose extras say how they lift to look
// inside (lift), which way they face (face: they fade when they face you in the inside view), and how they would
// move if taken apart (move). Cut it open (state 'cut', cfg.cut) slices the building at child height instead: an
// axo cutaway with white cut faces, like Astra Architect's cut rooms. People are rigged (Body in look-fx.js). Pivots (keep: true) are things that move on their own; 'anchor_<key>' nodes are
// where labels point. A model module (explore/models/*.js) gives the words, the finds, the actions and the
// behaviours (ring the bell, wind the winch...).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { say } from '../js/speak.js';
import { Sound, Smoke, Sparkles, Splash, Ripples, Body, confetti, icon } from './look-fx.js';

const q = new URLSearchParams(location.search);
const STILL = q.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const BARE = q.has('bare');   // dev: the model alone, no interface (for the preview pictures)
const STIFF = 64, DAMP = 14.2, STAGGER = 0.035;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const B = (x, y, z) => new THREE.Vector3(x, z, -y);                // Blender (z up) to three (y up)
const bv = a => B(a[0], a[1], a[2]);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = t => t * t * (3 - 2 * t);
const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function spring(s, target, dt) {
  if (STILL) { s.x = target; s.v = 0; return false; }
  const h = dt / 4;
  for (let i = 0; i < 4; i++) { s.v += (STIFF * (target - s.x) - DAMP * s.v) * h; s.x += s.v * h; }
  if (Math.abs(target - s.x) < 5e-4 && Math.abs(s.v) < 5e-4) { s.x = target; s.v = 0; return false; }
  return true;
}

export async function look(cfg) {
  const sound = new Sound();
  const partInfo = Object.fromEntries(cfg.parts.map(p => [p.key, p]));
  const say1 = (text, btn) => say(text, btn);

  // ================================================================ the page
  document.title = `${cfg.name} · Astra Victorians`;
  const tabs = cfg.tabs.map(t => `<a class="lk-tab${t.on ? ' on' : ''}" href="${t.href}">${icon(t.icon)}<span>${esc(t.label)}</span></a>`).join('');
  const root = document.createElement('div');
  root.className = BARE ? 'lk lk-bare' : 'lk';
  root.dataset.model = cfg.id;
  root.innerHTML = `
  <canvas class="lk-stage" aria-label="${esc(cfg.label)}"></canvas>
  <div class="lk-pins"></div>
  <header class="lk-mast">
    <a class="lk-home" href="${cfg.back}">${icon('back')}<span>Astra Victorians</span></a>
    <p class="lk-eyebrow">${esc(cfg.eyebrow)}</p>
    <h1 class="lk-title">${cfg.title.map(esc).join('<br>')}</h1>
    <p class="lk-blurb">${esc(cfg.blurb)}</p>
    <button class="lk-pill lk-readall" type="button">${icon('speaker')}<span>Read aloud</span></button>
  </header>
  <nav class="lk-tabs" aria-label="Choose a model">${tabs}</nav>
  <div class="lk-hint"><span>Tap anything to find out what it is</span></div>
  <div class="lk-views">
    <button data-v="left" type="button">${icon('left')}<span>Turn</span></button>
    <button data-v="right" type="button">${icon('right')}<span>Turn</span></button>
    <button data-v="in" type="button">${icon('in')}<span>Closer</span></button>
    <button data-v="out" type="button">${icon('out')}<span>Further</span></button>
    <button data-v="home" type="button">${icon('whole')}<span>Whole</span></button>
    <button data-v="names" type="button">${icon('names')}<span>Names</span></button>
  </div>
  <section class="lk-card" hidden aria-live="polite">
    <img class="lk-card-pic" alt="">
    <div class="lk-card-text"><h2></h2><div class="lk-card-body"></div></div>
    <div class="lk-card-acts">
      <button class="lk-round lk-card-say" type="button" aria-label="Read aloud">${icon('speaker')}</button>
      <button class="lk-round lk-card-close" type="button" aria-label="Close">${icon('close')}</button>
    </div>
  </section>
  <aside class="lk-panel">
    <div class="lk-handle" aria-hidden="true"></div>
    <div class="lk-panel-body">
      <section class="lk-sec lk-real">
        <div class="lk-sec-h"><span class="lk-eyebrow">The real one</span><button class="lk-round lk-mute" type="button" aria-label="Sound">${icon(sound.on ? 'speaker' : 'mute')}</button></div>
        <button class="lk-real-pic" type="button" aria-label="See the picture bigger"><img alt=""><small class="lk-real-by"></small><span>${icon('in')}</span></button>
        <p class="lk-real-cap"></p>
        ${cfg.real.length > 3 ? `<div class="lk-strip">${cfg.real.map((r, i) => `<button type="button" data-i="${i}"${i ? '' : ' class="on"'}><img src="${r.img}" alt="" loading="lazy"><span>${esc(r.tab)}</span></button>`).join('')}</div>`
          : cfg.real.length > 1 ? `<div class="lk-seg">${cfg.real.map((r, i) => `<button type="button" data-i="${i}"${i ? '' : ' class="on"'}>${icon(r.icon || 'picture')}<span>${esc(r.tab)}</span></button>`).join('')}</div>` : ''}
        <button class="lk-btn lk-match" type="button">${icon('eye')}<span>Turn the model to match</span></button>
      </section>
      <section class="lk-sec lk-do">
        <div class="lk-sec-h"><span class="lk-eyebrow">Things to do</span></div>
        <div class="lk-widget"></div>
        <div class="lk-acts"></div>
      </section>
      <section class="lk-sec lk-find">
        <div class="lk-sec-h"><span class="lk-eyebrow">Can you find…?</span><small class="lk-find-n"></small></div>
        <div class="lk-q"></div>
      </section>
      <section class="lk-sec lk-parts">
        <div class="lk-sec-h"><span class="lk-eyebrow">The parts</span><small>Tap one to learn about it</small></div>
        <div class="lk-tiles"></div>
      </section>
      <section class="lk-sec lk-nums">
        <div class="lk-stats">${cfg.stats.map(([b, c]) => `<div class="lk-stat"><b>${esc(b)}</b><span>${esc(c)}</span></div>`).join('')}</div>
      </section>
      <details class="lk-grown"><summary>Facts for grown-ups</summary>
        <table>${cfg.specs.map(([a, b, c]) => `<tr><td>${esc(a)}</td><td><b>${esc(b)}</b>${c ? `<small>${esc(c)}</small>` : ''}</td></tr>`).join('')}</table>
        ${cfg.foot}
      </details>
    </div>
  </aside>
  <div class="lk-toast" aria-live="polite"></div>
  <div class="lk-lightbox" hidden><figure><img alt=""><figcaption></figcaption></figure><button class="lk-round" type="button" aria-label="Close">${icon('close')}</button></div>
  <div class="lk-loading"><div><p>${esc(cfg.loading || 'Building the model…')}</p><i><b></b></i></div></div>`;
  document.body.appendChild(root);
  const $ = s => root.querySelector(s);
  const canvas = $('.lk-stage'), pins = $('.lk-pins'), card = $('.lk-card'), panel = $('.lk-panel'), toastEl = $('.lk-toast');

  // ================================================================ renderer, scene, light
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', stencil: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.HemisphereLight('#ffffff', '#e3dccb', 1.55));
  const sun = new THREE.DirectionalLight('#fff3df', 2.05);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 3;
  scene.add(sun, sun.target);
  const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 4000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.1;
  controls.enablePan = false;
  controls.minPolarAngle = 0.08; controls.maxPolarAngle = 1.38;
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  controls.zoomSpeed = 0.9; controls.rotateSpeed = 0.75;

  // ================================================================ load the model
  const bar = $('.lk-loading b');
  const gltf = await new Promise((res, rej) => new GLTFLoader().load(cfg.model, res, e => { if (e.total) bar.style.width = (100 * e.loaded / e.total).toFixed(0) + '%'; }, rej));
  const model = gltf.scene;
  scene.add(model);
  const named = {};
  model.traverse(n => { if (n.name) named[n.name] = named[n.name] || n; });
  const node = name => named[name] || null;

  const parts = {}, order = [];
  model.traverse(n => {
    if (n.isMesh || !n.name.startsWith('part_')) return;
    const u = n.userData || {}, key = n.name.slice(5);
    parts[key] = {
      key, node: n, piece: u.piece || key, home: n.position.clone(), move: bv(u.move || [0, 0, 0]), lift: bv(u.lift || [0, 0, 0]),
      face: u.face ? bv(u.face).normalize() : null, hide: !!u.hide, scenery: !!u.scenery, ride: u.ride || null, meshes: [],
      apart: { x: 0, v: 0 }, inside: { x: 0, v: 0 }, target: 0, pending: null, op: 1,
    };
    order.push(key);
  });
  const partOf = o => { for (let p = o; p; p = p.parent) if (!p.isMesh && p.name && p.name.startsWith('part_')) return parts[p.name.slice(5)]; return null; };
  const ink = new THREE.LineBasicMaterial({ color: '#2a241e', transparent: true, opacity: 0.38 });
  const meshes = [];
  model.traverse(n => {
    if (n.userData && n.userData.hidden) n.visible = false;
    if (!n.isMesh) return;
    const src = n.material, name = src.name, col = src.color.clone();
    let m;
    if (name === 'glass') m = new THREE.MeshStandardMaterial({ color: col, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.42, envMap: env, envMapIntensity: 1.2 });
    else if (name === 'sea') m = new THREE.MeshStandardMaterial({ color: col, roughness: 0.06, metalness: 0, transparent: true, opacity: 0.66, envMap: env, envMapIntensity: 0.9, depthWrite: false });
    else if (name === 'foam') m = new THREE.MeshLambertMaterial({ color: col, transparent: true, opacity: 0.8, depthWrite: false });
    else if (name === 'fire') m = new THREE.MeshBasicMaterial({ color: '#ffad4a' });
    else if (name === 'brass' || name === 'iron') m = new THREE.MeshStandardMaterial({ color: col, roughness: src.roughness ?? 0.4, metalness: name === 'brass' ? 0.8 : 0.5, envMap: env, envMapIntensity: 1 });
    else m = new THREE.MeshLambertMaterial({ color: col });
    m.name = name;
    n.material = m;
    n.userData.base = { opacity: m.opacity, transparent: m.transparent, depthWrite: m.depthWrite };
    const p = partOf(n);
    const see = !(m.transparent || name === 'fire');
    n.castShadow = see;
    n.receiveShadow = true;
    if (p) p.meshes.push(n);
    meshes.push(n);
    if (n.userData.ink) {
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(n.geometry, 30), ink.clone());
      e.raycast = () => {}; e.userData.edge = true; n.add(e); n.userData.edges = e;
    }
  });
  const anchors = {};
  model.traverse(n => { if (n.name.startsWith('anchor_')) anchors[n.name.slice(7)] = { node: n, inside: !!(n.userData && n.userData.inside) }; });
  const pieceKeys = [...new Set(order.map(k => parts[k].piece))];

  // ================================================================ fitting the view
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3();
  for (const k of order) for (const m of parts[k].meshes) bounds.expandByObject(m);
  const size = bounds.getSize(new THREE.Vector3()), centre = bounds.getCenter(new THREE.Vector3());
  const radius = size.length() / 2;
  const U = cfg.unit || 1;                                     // feet or metres: effects scale with this
  // a soft shadow under the block, on the paper
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(radius * 8, radius * 8), new THREE.ShadowMaterial({ opacity: 0.2 }));
  catcher.rotation.x = -Math.PI / 2; catcher.position.set(centre.x, bounds.min.y - 0.02, centre.z); catcher.receiveShadow = true;
  scene.add(catcher);
  const target0 = centre.clone().add(new THREE.Vector3(0, -size.y * 0.12, 0));
  controls.target.copy(target0);
  const sph = new THREE.Spherical();
  const dist = radius * 4;
  const views = cfg.views;
  // dev: ?home=az,el,zoom tries another home view; ?nudge=x,y shifts the model (fractions of the free area)
  if (q.get('home')) { const [az, el, zoom] = q.get('home').split(',').map(Number); views.home = { az, el, zoom: zoom || 1 }; }
  const nudge = q.get('nudge') ? q.get('nudge').split(',').map(Number) : (cfg.nudge || [0, 0]);
  // az: compass angle in the model's plan (0 = camera at +x, 90 = camera at +y); el: degrees above the ground
  const dirOf = (az, el) => { const a = THREE.MathUtils.degToRad(az), e = THREE.MathUtils.degToRad(el); return new THREE.Vector3(Math.cos(a) * Math.cos(e), Math.sin(e), -Math.sin(a) * Math.cos(e)); };
  let halfH = radius;
  const cutLine = new LineMaterial({ color: '#2a241c', linewidth: 1.7, worldUnits: false });
  let insetX = 0, insetY = 0;
  function layout() {
    const W = root.clientWidth || innerWidth, H = root.clientHeight || innerHeight;
    renderer.setSize(W, H, false);
    const pr = panel.getBoundingClientRect();
    const sheet = getComputedStyle(panel).getPropertyValue('--sheet').trim() === '1';
    insetX = sheet || BARE ? 0 : (W - pr.left);
    insetY = sheet && !BARE ? (H - pr.top) : 0;
    const fw = W - insetX - (sheet ? 24 : 40), fh = H - insetY - (sheet ? 150 : 120);
    // fit the block, seen from the home view, into the free part of the screen
    const d = dirOf(views.home.az, views.home.el);
    const fwd = d.clone().negate(), right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize(), up = new THREE.Vector3().crossVectors(right, fwd);
    let mx = 0, my = 0;
    for (let i = 0; i < 8; i++) {
      const c = new THREE.Vector3(i & 1 ? bounds.max.x : bounds.min.x, i & 2 ? bounds.max.y : bounds.min.y, i & 4 ? bounds.max.z : bounds.min.z).sub(target0);
      mx = Math.max(mx, Math.abs(c.dot(right))); my = Math.max(my, Math.abs(c.dot(up)));
    }
    halfH = Math.max(my * H / fh, mx * H / fw) * 1.04;
    const a = W / H;
    camera.left = -halfH * a; camera.right = halfH * a; camera.top = halfH; camera.bottom = -halfH;
    // a model can ask to sit a little right of or below the middle, clear of the title
    const nx = sheet || BARE ? 0 : nudge[0] * fw, ny = sheet || BARE ? 0 : nudge[1] * fh;
    camera.setViewOffset(W, H, insetX / 2 - nx, insetY / 2 - (sheet ? 30 : 10) - ny, W, H);
    cutLine.resolution.set(W, H);
    camera.updateProjectionMatrix();
  }
  function placeCamera(az, el, zoom, target = target0) {
    controls.target.copy(target);
    camera.position.copy(target).addScaledVector(dirOf(az, el), dist);
    camera.zoom = zoom; camera.updateProjectionMatrix(); controls.update();
  }
  let tween = null;
  function goView(v, secs = 0.9) {
    const view = typeof v === 'string' ? views[v] : v;
    const off = camera.position.clone().sub(controls.target);
    sph.setFromVector3(off);
    const a0 = sph.theta, p0 = sph.phi, z0 = camera.zoom, t0 = controls.target.clone();
    const d1 = dirOf(view.az, view.el);
    const s1 = new THREE.Spherical().setFromVector3(d1);
    let a1 = s1.theta; while (a1 - a0 > Math.PI) a1 -= Math.PI * 2; while (a1 - a0 < -Math.PI) a1 += Math.PI * 2;
    const t1 = view.targetB ? bv(view.targetB) : view.target ? view.target.clone() : target0.clone();
    if (STILL || secs === 0) { placeCamera(view.az, view.el, view.zoom || 1, t1); return; }
    tween = { t: 0, secs, a0, a1, p0, p1: s1.phi, z0, z1: view.zoom || 1, t0, t1 };
  }
  function stepTween(dt) {
    if (!tween) return;
    tween.t = Math.min(1, tween.t + dt / tween.secs);
    const e = easeInOut(tween.t);
    controls.target.lerpVectors(tween.t0, tween.t1, e);
    sph.set(dist, tween.p0 + (tween.p1 - tween.p0) * e, tween.a0 + (tween.a1 - tween.a0) * e);
    camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sph));
    camera.zoom = tween.z0 + (tween.z1 - tween.z0) * e; camera.updateProjectionMatrix();
    if (tween.t >= 1) tween = null;
  }
  function turn(sign) {
    const off = camera.position.clone().sub(controls.target); sph.setFromVector3(off);
    const el = 90 - THREE.MathUtils.radToDeg(sph.phi);
    const az = THREE.MathUtils.radToDeg(Math.atan2(-off.z, off.x)) + sign * 45;
    goView({ az, el, zoom: camera.zoom, target: controls.target.clone() }, 0.55);
  }
  function zoomBy(f) {
    const off = camera.position.clone().sub(controls.target); sph.setFromVector3(off);
    goView({ az: THREE.MathUtils.radToDeg(Math.atan2(-off.z, off.x)), el: 90 - THREE.MathUtils.radToDeg(sph.phi), zoom: clamp(camera.zoom * f, 0.6, 5), target: controls.target.clone() }, 0.35);
  }
  controls.minZoom = 0.6; controls.maxZoom = 5;
  layout();
  placeCamera(views.home.az, views.home.el, views.home.zoom || 1);
  // the sun comes from over the viewer's left shoulder, so shadows fall back and right where we can see them
  const sdir = dirOf(views.home.az + 38, 52);
  sun.position.copy(centre).addScaledVector(sdir, radius * 3); sun.target.position.copy(centre);
  const sc = sun.shadow.camera; sc.left = sc.bottom = -radius * 1.15; sc.right = sc.top = radius * 1.15; sc.near = radius * 0.5; sc.far = radius * 6; sc.updateProjectionMatrix();
  new ResizeObserver(() => layout()).observe(root);

  // ================================================================ state: whole, inside (roof lifted), cut (cut open), apart
  let state = 'whole', clock = 0;
  function setState(next) {
    if (next === state) return;
    const was = state; state = next;
    const forward = next === 'apart';
    if (next === 'apart' || was === 'apart') {
      const seq = forward ? order : order.slice().reverse();
      seq.forEach((k, i) => { parts[k].pending = { v: forward ? 1 : 0, at: clock + i * STAGGER }; });
      if (forward) sound.whoosh();
    }
    if (cut.on) {
      cut.goal = next === 'cut' ? 1 : 0;
      if (next === 'cut') { sound.whoosh(); lookDown(); }
    }
    refresh();
  }
  // after a cut, swing up a little to look down into the rooms
  function lookDown() {
    const off = camera.position.clone().sub(controls.target); sph.setFromVector3(off);
    const az = THREE.MathUtils.radToDeg(Math.atan2(-off.z, off.x)), el = 90 - THREE.MathUtils.radToDeg(sph.phi);
    if (el >= (cfg.cut.el || 48) - 1) return;
    goView({ az, el: cfg.cut.el || 48, zoom: camera.zoom, target: controls.target.clone() }, 0.9);
  }

  // ================================================================ selecting a part
  let selected = '';
  const HILITE = new THREE.Color('#ffb03a');
  function hilite(piece) {
    for (const k of order) {
      const on = !!piece && parts[k].piece === piece;
      for (const m of parts[k].meshes) {
        if (!m.material.emissive) continue;
        m.material.emissive.copy(on ? HILITE : new THREE.Color(0));
        m.material.emissiveIntensity = on ? 0.32 : 1;
      }
    }
  }
  const thumbs = {};
  function select(piece, how = 'tap') {
    const info = partInfo[piece];
    if (!info) { deselect(); return; }
    selected = piece;
    hilite(piece);
    if (info.inside && state === 'whole') setState('inside');
    card.hidden = false;
    card.querySelector('h2').textContent = info.title;
    card.querySelector('.lk-card-body').innerHTML = info.text.map(t => `<p>${t}</p>`).join('') + (info.think ? `<p class="lk-think">${info.think}</p>` : '');
    const pic = card.querySelector('.lk-card-pic');
    if (thumbs[piece]) { pic.src = thumbs[piece]; pic.hidden = false; } else pic.hidden = true;
    card.querySelector('.lk-card-say').onclick = e => say1(info.say || (info.title + '. ' + info.text.join(' ').replace(/<[^>]+>/g, '')), e.currentTarget);
    root.classList.add('picked');
    if (how === 'tile') {
      const a = anchors[piece];
      if (a) {
        const w = a.node.getWorldPosition(new THREE.Vector3());
        const off = camera.position.clone().sub(controls.target); sph.setFromVector3(off);
        goView({ az: THREE.MathUtils.radToDeg(Math.atan2(-off.z, off.x)), el: 90 - THREE.MathUtils.radToDeg(sph.phi), zoom: Math.max(camera.zoom, 1.35), target: target0.clone().lerp(w, 0.55) }, 0.7);
      }
    }
    root.querySelectorAll('.lk-tile').forEach(t => t.classList.toggle('on', t.dataset.key === piece));
  }
  function deselect() {
    selected = ''; hilite(''); card.hidden = true; root.classList.remove('picked');
    root.querySelectorAll('.lk-tile').forEach(t => t.classList.remove('on'));
  }
  card.querySelector('.lk-card-close').onclick = () => deselect();

  // ================================================================ labels
  let showNames = false;
  const pinEls = {};
  for (const p of cfg.parts) {
    if (!anchors[p.key]) continue;
    const el = document.createElement('button');
    el.type = 'button'; el.className = 'lk-pin'; el.innerHTML = `<b>${esc(p.short || p.title)}</b><i></i>`;
    el.onclick = () => { select(p.key, 'pin'); sound.pop(); };
    pins.appendChild(el); pinEls[p.key] = el;
  }
  const tmp = new THREE.Vector3();
  function placePins() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const shown = [];
    for (const [key, el] of Object.entries(pinEls)) {
      const a = anchors[key];
      let vis = (showNames && (!a.inside || state !== 'whole')) || key === selected;
      if (vis && cut.k > 0.5 && clipPlane.distanceToPoint(a.node.getWorldPosition(tmp)) < 0) vis = false;
      if (!vis) { el.style.display = 'none'; continue; }
      a.node.getWorldPosition(tmp); tmp.project(camera);
      const x = (tmp.x + 1) / 2 * W, y = (1 - tmp.y) / 2 * H;
      el.style.display = '';
      el.classList.toggle('on', key === selected);
      shown.push({ el, x, y, ty: y - 46 });
    }
    shown.sort((a, b) => a.ty - b.ty);
    for (let i = 1; i < shown.length; i++) for (let j = 0; j < i; j++) {
      const a = shown[j], b = shown[i];
      if (Math.abs(a.x - b.x) < 110 && b.ty - a.ty < 34) b.ty = a.ty + 34;
    }
    for (const s of shown) {
      s.el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.ty.toFixed(1)}px)`;
      s.el.style.setProperty('--stem', Math.max(8, s.y - s.ty - 6).toFixed(0) + 'px');
    }
  }

  // ================================================================ thumbnails for the part tiles
  function makeThumbs() {
    const tw = 168, th = 126;
    const r2 = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    r2.setPixelRatio(1); r2.setSize(tw, th, false); r2.outputColorSpace = THREE.SRGBColorSpace; r2.setClearColor(0, 0);
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 4000);
    const vis = {};
    for (const k of order) vis[k] = parts[k].node.visible;
    const edgesWere = [];
    model.traverse(n => { if (n.userData.edge) { edgesWere.push([n, n.visible]); n.visible = false; } });
    catcher.visible = false;
    for (const piece of pieceKeys) {
      if (!partInfo[piece]) continue;
      const box = new THREE.Box3();
      for (const k of order) { const on = parts[k].piece === piece; parts[k].node.visible = on; if (on) for (const m of parts[k].meshes) if (m.visible) box.expandByObject(m); }
      if (box.isEmpty()) continue;
      const c = box.getCenter(new THREE.Vector3()), r = box.getSize(new THREE.Vector3()).length() / 2;
      cam.left = -r * 1.333 * 0.82; cam.right = r * 1.333 * 0.82; cam.top = r * 0.82; cam.bottom = -r * 0.82; cam.updateProjectionMatrix();
      cam.position.copy(c).addScaledVector(dirOf(views.home.az, 30), r * 4); cam.lookAt(c);
      r2.render(scene, cam);
      thumbs[piece] = r2.domElement.toDataURL('image/png');
    }
    for (const k of order) parts[k].node.visible = vis[k];
    for (const [n, v] of edgesWere) n.visible = v;
    catcher.visible = true;
    r2.dispose(); r2.forceContextLoss?.();
  }
  try { makeThumbs(); } catch (e) { console.warn('thumbnails', e); }
  $('.lk-tiles').innerHTML = cfg.parts.map(p => `<button class="lk-tile" type="button" data-key="${p.key}">${thumbs[p.key] ? `<img src="${thumbs[p.key]}" alt="">` : ''}<span>${esc(p.short || p.title)}</span></button>`).join('');
  root.querySelectorAll('.lk-tile').forEach(t => t.onclick = () => { select(t.dataset.key, 'tile'); sound.pop(); });

  // ================================================================ cut it open: an axo cutaway
  // This replaced taking the model apart (14 Oct 2026). As in Astra Architect's cut rooms, every wall
  // is sliced at about child height (cfg.cut.z, in the model's own units, measured in cfg.cut.frame's frame), all
  // above is clipped away, and the cut faces are filled white with an ink line round them, as on an architect's
  // plan. People, trees and the ground are never cut. The white uses the stencil buffer: every closed solid that is
  // clipped counts +1 where you look into it through the cut, so one plane at the cut height, drawn only where the
  // count is not 0, lies exactly over the cut faces. Open meshes ('..._open' from lib.py) are clipped, not counted.
  const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e9);
  const cut = { on: false, k: 0, goal: 0, meshes: [], stencils: [], top: 0, z: 0, lines: null, cap: null, knife: null, frame: null, shown: false };
  if (cfg.cut) {
    const frame = cfg.cut.frame ? node(cfg.cut.frame) : model;
    if (frame) {
      cut.on = true; cut.frame = frame; cut.z = cfg.cut.z + 0.0037 * U;   // never exactly on a modelled face
      renderer.localClippingEnabled = true;
      model.updateMatrixWorld(true);
      const isPerson = o => { for (let q2 = o.parent; q2; q2 = q2.parent) if (q2.userData && q2.userData.h && /_root$/.test(q2.name)) return true; return false; };
      const under = o => { for (let q2 = o; q2; q2 = q2.parent) if (q2 === frame) return true; return false; };
      const keep = new Set(cfg.cut.keep || []), noLine = cfg.cut.noLine || [];
      const stBase = { colorWrite: false, depthWrite: false, depthTest: false, stencilWrite: true, stencilFunc: THREE.AlwaysStencilFunc, clippingPlanes: [clipPlane] };
      const inc = THREE.IncrementWrapStencilOp, dec = THREE.DecrementWrapStencilOp;
      const stBack = new THREE.MeshBasicMaterial({ ...stBase, side: THREE.BackSide, stencilFail: inc, stencilZFail: inc, stencilZPass: inc });
      const stFront = new THREE.MeshBasicMaterial({ ...stBase, side: THREE.FrontSide, stencilFail: dec, stencilZFail: dec, stencilZPass: dec });
      const inv = frame.matrixWorld.clone().invert(), box = new THREE.Box3(), v = new THREE.Vector3();
      for (const k of order) {
        const p = parts[k];
        if (p.scenery || keep.has(k)) continue;
        for (const m of p.meshes) {
          if (isPerson(m) || !under(m)) continue;
          m.material.clippingPlanes = [clipPlane]; m.material.clipShadows = true;
          if (m.userData.edges) m.userData.edges.material.clippingPlanes = [clipPlane];
          m.userData.clipped = true;
          cut.meshes.push(m);
          if (!m.userData.open && !m.material.transparent && m.material.name !== 'fire') {
            m.userData.solid = true;
            for (let o = m; o; o = o.parent) if (noLine.some(n => o.name.startsWith(n))) m.userData.solid = 'noline';
            for (const mat of [stBack, stFront]) {
              const st = new THREE.Mesh(m.geometry, mat);
              st.renderOrder = 1; st.raycast = () => {}; st.visible = false; st.castShadow = false; st.receiveShadow = false;
              m.add(st); cut.stencils.push(st);
            }
          }
          const pos = m.geometry.attributes.position, mm = new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld);
          for (let i = 0; i < pos.count; i++) box.expandByPoint(v.fromBufferAttribute(pos, i).applyMatrix4(mm));
        }
      }
      const bs = box.getSize(new THREE.Vector3()), cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
      cut.top = box.max.y + 0.04 * bs.y;
      const capMat = new THREE.MeshBasicMaterial({ color: '#fbf8f0', stencilWrite: true, stencilRef: 0, stencilFunc: THREE.NotEqualStencilFunc,
        stencilFail: THREE.ReplaceStencilOp, stencilZFail: THREE.ReplaceStencilOp, stencilZPass: THREE.ReplaceStencilOp,
        polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
      cut.cap = new THREE.Mesh(new THREE.PlaneGeometry(bs.x * 1.1 + U, bs.z * 1.1 + U), capMat);
      cut.cap.rotation.x = -Math.PI / 2; cut.cap.position.set(cx, cut.top, cz); cut.cap.renderOrder = 2; cut.cap.raycast = () => {}; cut.cap.visible = false;
      frame.add(cut.cap);
      // the knife: a pale sheet with an orange edge that sweeps down through the building
      const kg = new THREE.PlaneGeometry(bs.x * 1.06 + 0.5 * U, bs.z * 1.06 + 0.5 * U); kg.rotateX(-Math.PI / 2);
      cut.knife = new THREE.Group();
      cut.knife.add(new THREE.Mesh(kg, new THREE.MeshBasicMaterial({ color: '#fff6e6', transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide })));
      cut.knife.add(new THREE.LineSegments(new THREE.EdgesGeometry(kg), new THREE.LineBasicMaterial({ color: '#e8622c' })));
      cut.knife.children.forEach(c => { c.raycast = () => {}; c.renderOrder = 5; });
      cut.knife.position.set(cx, cut.top, cz); cut.knife.visible = false;
      frame.add(cut.knife);
    }
  }
  // the ink line round the cut faces: slice every solid's triangles at the cut height (once, when the cut is done)
  function sliceLines() {
    const out = [], inv = cut.frame.matrixWorld.clone().invert(), y0 = cut.z + 0.0013 * U, P = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    for (const m of cut.meshes) {
      if (m.userData.solid !== true) continue;
      const g = m.geometry, pos = g.attributes.position, idx = g.index, mm = new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld);
      const n = idx ? idx.count : pos.count, d = [0, 0, 0];
      for (let i = 0; i < n; i += 3) {
        for (let j = 0; j < 3; j++) { P[j].fromBufferAttribute(pos, idx ? idx.getX(i + j) : i + j).applyMatrix4(mm); d[j] = P[j].y - y0; }
        if ((d[0] > 0 && d[1] > 0 && d[2] > 0) || (d[0] < 0 && d[1] < 0 && d[2] < 0)) continue;
        const seg = [];
        for (let j = 0; j < 3; j++) {
          const a = P[j], b = P[(j + 1) % 3], da = d[j], db = d[(j + 1) % 3];
          if ((da < 0) !== (db < 0)) { const t = da / (da - db); seg.push(a.x + (b.x - a.x) * t, y0 + 0.002 * U, a.z + (b.z - a.z) * t); }
        }
        if (seg.length === 6) out.push(...seg);
      }
    }
    const lines = new LineSegments2(new LineSegmentsGeometry().setPositions(out), cutLine);
    lines.renderOrder = 3; lines.raycast = () => {};
    cut.frame.add(lines);
    return lines;
  }
  function stepCut(dt) {
    if (!cut.on) return;
    if (STILL) cut.k = cut.goal;
    else if (cut.k !== cut.goal) cut.k = cut.goal > cut.k ? Math.min(cut.goal, cut.k + dt / 1.2) : Math.max(cut.goal, cut.k - dt / 0.8);
    const h = cut.top + (cut.z - cut.top) * easeInOut(cut.k);
    cut.frame.updateMatrixWorld();
    if (cut.k > 0) {
      const n = new THREE.Vector3(0, -1, 0).transformDirection(cut.frame.matrixWorld);
      clipPlane.setFromNormalAndCoplanarPoint(n, new THREE.Vector3(0, h, 0).applyMatrix4(cut.frame.matrixWorld));
    } else clipPlane.set(new THREE.Vector3(0, -1, 0), 1e9);
    const show = cut.k > 0;
    if (show !== cut.shown) { cut.shown = show; cut.cap.visible = show; for (const st of cut.stencils) st.visible = show; }
    cut.cap.position.y = h;
    cut.knife.visible = cut.k > 0.002 && cut.k < 0.998; cut.knife.position.y = h;
    // (an ink line round the cut faces, sliceLines(), is left off: it looked heavy, 14 Oct 2026)
    if (cfg.cut.lines && cut.k >= 0.998 && !cut.lines) cut.lines = sliceLines();
    if (cut.lines) cut.lines.visible = cut.k >= 0.998;
    smoke.hold = show;
  }

  // ================================================================ tapping the model
  const ray = new THREE.Raycaster();
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; root.classList.add('touched'); });
  canvas.addEventListener('pointerup', e => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t;
    down = null;
    if (moved > 7 || dt > 600) return;
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
    const hits = ray.intersectObjects(meshes, false).filter(h => {
      for (let o = h.object; o; o = o.parent) if (!o.visible) return false;
      if (h.object.userData.clipped && cut.k > 0 && clipPlane.distanceToPoint(h.point) < 0) return false;
      const p = partOf(h.object);
      return !(p && p.op < 0.5);
    });
    const hit = hits[0];
    if (!hit) { deselect(); return; }
    if (checkFind(hit)) return;
    const p = partOf(hit.object);
    if (!p || p.scenery || !partInfo[p.piece]) { deselect(); return; }
    select(p.piece, 'tap'); sound.pop();
  });

  // ================================================================ can you find…?
  let findI = 0;
  const qEl = $('.lk-q');
  function showFind() {
    const n = cfg.finds.length;
    $('.lk-find-n').textContent = findI < n ? `${findI + 1} of ${n}` : `${n} of ${n}`;
    if (findI >= n) {
      qEl.innerHTML = `<div class="lk-q-done">${icon('star', 'ic big')}<p><b>You found them all!</b> You're a real Victorian explorer.</p><button class="lk-btn" type="button">Play again</button></div>`;
      qEl.querySelector('button').onclick = () => { findI = 0; showFind(); sound.pop(); };
      return;
    }
    const f = cfg.finds[findI];
    qEl.innerHTML = `<div class="lk-q-row"><p>${esc(f.q)}</p><button class="lk-round" type="button" aria-label="Read aloud">${icon('speaker')}</button></div>
      <small>${esc(f.hint || 'Tap it on the picture.')}</small>
      <div class="lk-dots">${cfg.finds.map((_, i) => `<i class="${i < findI ? 'done' : i === findI ? 'now' : ''}"></i>`).join('')}</div>`;
    qEl.querySelector('button').onclick = e => say1(f.q, e.currentTarget);
  }
  function checkFind(hit) {
    const f = cfg.finds[findI];
    if (!f) return false;
    for (let o = hit.object; o; o = o.parent) {
      if (f.targets.includes(o.name)) {
        sparkles.burst(hit.point, U * (cfg.sparkle || 1));
        sound.chime();
        toast(`${icon('star')} You found ${f.it}!`);
        qEl.classList.add('yes'); setTimeout(() => qEl.classList.remove('yes'), 600);
        const p = partOf(hit.object);
        if (p && partInfo[p.piece]) select(p.piece, 'tap');
        findI++;
        setTimeout(() => { showFind(); if (findI >= cfg.finds.length) { confetti(root); sound.chime(); } }, 1100);
        return true;
      }
    }
    return false;
  }
  function toast(html) {
    toastEl.innerHTML = html; toastEl.classList.remove('show'); void toastEl.offsetWidth; toastEl.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  if (cfg.doFirst) {
    const body = $('.lk-panel-body'), doSec = $('.lk-do');
    body.insertBefore(doSec, $('.lk-real'));
    doSec.querySelector('.lk-sec-h').append($('.lk-mute'));
  }

  // ================================================================ the real picture and plan
  let realI = 0;
  const realImg = $('.lk-real-pic img');
  function showReal() {
    const r = cfg.real[realI];
    realImg.src = r.img; realImg.alt = r.alt || r.cap;
    $('.lk-real-cap').textContent = r.cap;
    $('.lk-real-by').textContent = r.by || r.credit;
    root.querySelectorAll('.lk-seg button, .lk-strip button').forEach(b => b.classList.toggle('on', +b.dataset.i === realI));
    $('.lk-match span').textContent = r.match || 'Turn the model to match';
  }
  root.querySelectorAll('.lk-seg button, .lk-strip button').forEach(b => b.onclick = () => { realI = +b.dataset.i; showReal(); match(); sound.pop(); });
  function match() {
    const r = cfg.real[realI];
    if (r.run) r.run(ctx);
    if (r.state) setState(r.state); else if (state !== 'whole') setState('whole');
    goView(r.view || 'real', 1.1);
  }
  $('.lk-match').onclick = () => { match(); sound.pop(); };
  const lb = $('.lk-lightbox');
  $('.lk-real-pic').onclick = () => {
    const r = cfg.real[realI];
    lb.querySelector('img').src = r.img; lb.querySelector('figcaption').innerHTML = `${esc(r.cap)} <small>${esc(r.credit)}</small>`;
    lb.hidden = false;
  };
  lb.onclick = () => { lb.hidden = true; };
  showReal();

  // ================================================================ views, sound, read aloud
  root.querySelectorAll('.lk-views button').forEach(b => b.onclick = () => {
    const v = b.dataset.v;
    if (v === 'left') turn(1); else if (v === 'right') turn(-1);
    else if (v === 'in') zoomBy(1.3); else if (v === 'out') zoomBy(1 / 1.3);
    else if (v === 'home') { goView('home'); }
    else if (v === 'names') { showNames = !showNames; b.classList.toggle('on', showNames); }
    sound.pop();
  });
  $('.lk-mute').onclick = e => { sound.set(!sound.on); e.currentTarget.innerHTML = icon(sound.on ? 'speaker' : 'mute'); if (sound.on) sound.pop(); };
  $('.lk-readall').onclick = e => say1(cfg.say || cfg.blurb, e.currentTarget);
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { lb.hidden = true; deselect(); }
    if (e.key === 'ArrowLeft') turn(1);
    if (e.key === 'ArrowRight') turn(-1);
  });
  // the sheet on a phone or a tablet held upright: tap the handle to open it more
  $('.lk-handle').onclick = () => { panel.classList.toggle('tall'); setTimeout(layout, 320); };

  // ================================================================ effects and the model's own behaviour
  const smoke = new Smoke(scene, U * (cfg.smoke || 1));
  const sparkles = new Sparkles(scene);
  const splash = new Splash(scene);
  const ripples = new Ripples(scene);
  // every rigged figure (lib.person makes '<name>_torso'); a behaviour marks one busy while it drives it
  const bodies = {};
  for (const n of Object.keys(named)) if (n.endsWith('_torso')) { const b = new Body(node, n.slice(0, -6)); if (b.ok) bodies[b.name] = b; }
  const tickers = [];
  const ctx = {
    THREE, scene, camera, model, node, parts, sound, smoke, splash, sparkles, ripples, B, bv, U, clamp, smooth, Body,
    body: name => bodies[name] || null, get cut() { return cut.k; },
    get state() { return state; }, setState, select, toast, say: say1,
    onTick: fn => tickers.push(fn), refresh: () => refresh(), goView,
    nodes: prefix => Object.keys(named).filter(n => n.startsWith(prefix)).sort().map(n => named[n]),
  };
  const actions = cfg.actions ? cfg.actions(ctx) : [];
  const widget = cfg.widget ? cfg.widget(ctx, $('.lk-widget')) : null;
  if (!widget) $('.lk-widget').remove();
  function refresh() {
    $('.lk-acts').innerHTML = actions.map((a, i) => {
      const on = a.on ? a.on() : false, dis = a.disabled ? a.disabled() : false;
      return `<button class="lk-act${on ? ' on' : ''}${a.wide ? ' wide' : ''}" type="button" data-i="${i}"${dis ? ' disabled' : ''}>${icon(on && a.iconOn ? a.iconOn : a.icon)}<span>${esc(on && a.labelOn ? a.labelOn : a.label)}</span></button>`;
    }).join('');
    $('.lk-acts').querySelectorAll('.lk-act').forEach(b => b.onclick = () => { actions[+b.dataset.i].run(); refresh(); });
    widget?.refresh?.();
  }
  if (cfg.setup) cfg.setup(ctx);
  refresh();
  showFind();

  // ================================================================ the loop
  let last = 0, running = true;
  const toCam = new THREE.Vector3();
  function update(dt) {
    clock += dt;
    stepTween(dt);
    controls.enabled = !tween;
    controls.update();
    toCam.copy(camera.position).sub(controls.target); toCam.y = 0; toCam.normalize();
    for (const k of order) {
      const p = parts[k];
      if (p.pending && clock >= p.pending.at) { p.target = p.pending.v; p.pending = null; }
      spring(p.apart, p.target, dt);
      spring(p.inside, state === 'inside' ? 1 : 0, dt);
    }
    for (const k of order) {
      const p = parts[k], s = p.ride && parts[p.ride] ? parts[p.ride] : p;
      p.node.position.copy(p.home).addScaledVector(p.move, s.apart.x).addScaledVector(p.lift, s.inside.x);
      let op = 1;
      if (p.face) op = 1 - 0.9 * smooth(clamp((p.face.dot(toCam) - 0.1) / 0.5, 0, 1)) * p.inside.x;
      if (p.hide) op = Math.min(op, 1 - s.inside.x);
      if (Math.abs(op - p.op) > 0.002 || (op === 1 && p.op !== 1)) {
        p.op = op;
        for (const m of p.meshes) {
          const b = m.userData.base;
          if (op < 0.999) { m.material.transparent = true; m.material.opacity = b.opacity * op; m.material.depthWrite = op > 0.65 && b.depthWrite; }
          else { m.material.transparent = b.transparent; m.material.opacity = b.opacity; m.material.depthWrite = b.depthWrite; }
          m.castShadow = op > 0.65 && !b.transparent;
          if (m.userData.edges) m.userData.edges.visible = op > 0.6;
        }
      }
    }
    for (const fn of tickers) fn(dt, clock);
    for (const b of Object.values(bodies)) { if (!b.busy) b.goal = Body.idle(clock + b.seed); b.update(STILL ? 1 : dt); }
    stepCut(dt);
    smoke.tick(dt); sparkles.tick(dt, U * (cfg.sparkle || 1)); splash.tick(dt); ripples.tick(dt);
  }
  function frame(now) {
    if (!running) return;
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60; last = now;
    update(dt);
    renderer.render(scene, camera);
    placePins();
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) running = false; else if (!running) { running = true; last = 0; requestAnimationFrame(frame); } });

  // ================================================================ test and screenshot hooks
  if (q.get('state')) { state = q.get('state'); for (const k of order) { const v = state === 'apart' ? 1 : 0; parts[k].apart.x = parts[k].target = v; parts[k].inside.x = state === 'inside' ? 1 : 0; } if (state === 'cut' && cut.on) cut.goal = cut.k = 1; refresh(); }
  if (q.get('view')) goView(q.get('view'), 0);
  // dev: ?look=<node>,<zoom>[,<az>,<el>] frames one thing close up (a person, a bracket) for checking details
  if (q.get('look')) {
    const [nm, z, az, el] = q.get('look').split(','), n = node(nm);
    update(1 / 60); model.updateMatrixWorld(true);       // let the behaviours place things first (the machine on its rails)
    if (n) goView({ az: az ? +az : views.home.az, el: el ? +el : views.home.el, zoom: +z || 4, target: n.getWorldPosition(new THREE.Vector3()) }, 0);
  }
  if (q.get('focus')) select(q.get('focus'));
  if (q.get('names')) { showNames = true; $('[data-v="names"]').classList.add('on'); }
  if (q.get('panel') === 'tall') panel.classList.add('tall');
  $('.lk-loading').classList.add('gone');
  setTimeout(() => $('.lk-loading').remove(), 600);
  requestAnimationFrame(frame);
  // update(dt) steps everything without drawing, for tests where animation frames do not run (headless)
  window.__look = { ctx, parts, goView, setState, select, renderer, camera, controls, anchors, thumbs, layout, update, bodies, cut };
  return ctx;
}
