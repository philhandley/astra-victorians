// The modern bathing machine, from a Year 2 design: drawn on paper, then built in LEGO, and here imagined as a real
// machine (in the spirit of Neil Denari: wrapped, filleted bands with graphic colour blocks, shadow-gap reveals,
// glass ribbons, a cantilevered stage). The form is the LEGO model's, read brick by brick off the photographs
// (assets/img/machine-*.jpg; cameras solved in tools/lego/cams.py): every band is one LEGO course, the same outline
// and the same height, so the plans and elevations match the model.
// Units inside are LEGO studs (1 stud = 8 mm in the model; a brick is 1.2 studs tall, a plate 0.4); the whole is
// scaled so that one stud is S metres: the real machine is 7 m long on its tracks and 6.5 m to the top of the shade.
// Axes: x across (the machine's LEFT is +x, as in three.js when it faces +z), y up from the ground, z forwards (the stage).
// The machine:
//   tracks   two big crawler tracks (2.4 m tall): steel shoes with grousers, a toothed drive sprocket at the back,
//            an idler at the front, road wheels and top rollers, under a green deck slab with rounded corners
//   cabins   two courses of beach-hut boards round the changing cabins, a bright colour and white in turn (the LEGO's
//            dark grey, brown and tan become blue, coral and sunshine yellow), with round windows; open at
//            the front for the stage
//   bands    five more courses stepping in, each a continuous band with soft edges and panels in the model's colours;
//            a glass ribbon along the left; the rooftop pavilion in light aqua, yellow and azure
//   wings    four cantilevered arms at the corners, each with a fountain nozzle at its tip
//   stage    a round teal stage cantilevered at the front, stage lights under the yellow band, a big drum behind,
//            and the band: a knight in a black helmet, a pig, and a smiley in a white shirt
//   back     a raised deck with rails, a girl with blond hair, the pink curved slide, and the red shade on its mast
//   flower   a little wind turbine with four purple petals on a green stem, on the back left arm
// The cool parts (the design stays the same): white fairings over the tracks with a green stripe, a light bar in the
// nose, racing stripes round two of the bands, glass between the bands that glows at night in the model's colours,
// a screen over the stage, light strips along the slide, a glowing flower; and things that move: the fountain arms
// fold up to drive and down to spray, the shade opens and closes like a flower, the stage turns.
// build() returns the machine; userData.points has the places the game needs (slide path, ladder, stage, nozzles),
// userData.parts the groups by name, userData.drive(dt, l, r) moves the tracks (l, r in metres a second) and
// userData.tick(dt) turns the flower.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { figure, LOOKS } from './people.js';

export const S = 0.4;                                  // metres per stud
const BR = 1.2;                                        // a brick, in studs
const TOP0 = 6.7;                                      // the deck's top (studs above the ground)
const C = c => TOP0 + (c - 1) * BR;                    // the bottom of course c (1 is the first course on the deck)
const REV = 0.32;                                      // the glass strip under each band (it glows at night)
export const COL = {
  dgrey: '#4d5157', brown: '#7a624c', tan: '#c8b28a', aqua: '#b7dcd6', azure: '#3d9fc4', yellow: '#efbd3a', pale: '#efe0a6',
  cream: '#ece3cb', pink: '#eeaac3', dpink: '#c27495', lilac: '#c1afdc', lime: '#a3bf3a', teal: '#2f8a95', white: '#f2f2ef',
  lgrey: '#bcc0c4', clear: '#24384a', orange: '#ec9f43',
  deck: '#46a35b', steel: '#2d2f33', graphite: '#3b3e44', frame: '#9aa0a7', chrome: '#dfe3e8', stage: '#4fbac6',
  red: '#d22b23', shade: '#d8312a', purple: '#9a6ad0', stem: '#2f8048', slide: '#e5519d', reveal: '#2a2c31',
};
const mats = new Map();
export function mat(hex, o = {}) {
  const key = hex + JSON.stringify(o);
  if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color: hex, roughness: 0.42, metalness: 0.05, envMapIntensity: 0.55, ...o }));
  return mats.get(key);
}
const STEEL = { roughness: 0.5, metalness: 0.6 }, CHROME = { roughness: 0.2, metalness: 1, envMapIntensity: 1 };

// Fewer draws for the tablet: the still parts of a group that share a material become one mesh. keep(o) leaves a
// mesh (or a whole group) as it is: the people, anything that moves, and meshes with their own colours or textures.
export function bake(root, keep = () => false) {
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(), sets = new Map(), done = [];
  const kept = o => { for (let q = o; q && q !== root; q = q.parent) if (keep(q) || q.userData.people || q.userData.moves) return true; return false; };
  root.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh || kept(o)) return;
    const m = o.material;
    if (Array.isArray(m) || m.vertexColors || m.map) return;
    let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    const key = m.uuid + (o.castShadow ? 's' : '');
    if (!sets.has(key)) sets.set(key, { m, shadow: o.castShadow, list: [] });
    sets.get(key).list.push(g); done.push(o);
  });
  for (const o of done) o.removeFromParent();
  for (const { m, shadow, list } of sets.values()) {
    const mesh = new THREE.Mesh(list.length > 1 ? mergeGeometries(list) : list[0], m);
    mesh.castShadow = shadow; mesh.receiveShadow = true; root.add(mesh);
  }
  return root;
}

// ---------------------------------------------------------------- the bricks: [x0, x1, z0, z1] in studs, the course, the colour, ribbed or not
export const BRICKS = [];
const b = (x0, x1, z0, z1, c, col, kind = '') => BRICKS.push({ x0, x1, z0, z1, y0: C(c), h: BR, col, kind, c });
// courses 1 and 2: ribbed cladding round the changing cabins (masonry in the LEGO); the stage opening is x -3..3 at the front
for (const c of [1, 2]) {
  b(4, 5, 0, 4, c, 'brown', 'm'); b(4, 5, -3, 0, c, 'tan', 'm'); b(4, 5, -6, -3, c, 'dgrey', 'm');          // left wall
  b(-5, -4, -2, 4, c, 'dgrey', 'm'); b(-5, -4, -6, -2, c, c === 1 ? 'tan' : 'dgrey', 'm');                  // right wall
  b(-4, 4, -6, -5, c, 'dgrey', 'm');                                                                           // back wall
}
b(3, 4, 3, 4, 1, 'lgrey'); b(3, 4, 3, 4, 2, 'clear'); b(3, 4, 3, 4, 3, 'lgrey');                                // the stage pillars
b(-4, -3, 3, 4, 1, 'white'); b(-4, -3, 3, 4, 2, 'white'); b(-4, -3, 3, 4, 3, 'white');
// course 3
b(4, 5, -6, 0, 3, 'azure'); b(4, 5, 0, 4, 3, 'azure');
b(-5, -4, -6, -4, 3, 'aqua'); b(-5, -4, -4, -2, 3, 'lgrey'); b(-5, -4, -2, 2, 3, 'yellow'); b(-5, -4, 2, 4, 3, 'white');
b(-4, 4, -6, -5, 3, 'aqua');
// course 4: one stud in, and the four wings
b(3, 4, 2, 4, 4, 'white'); b(3, 4, -2, 2, 4, 'clear'); b(3, 4, -4, -2, 4, 'white');
b(-4, -3, 2, 4, 4, 'orange'); b(-4, -3, -2, 2, 4, 'teal'); b(-4, -3, -4, -2, 4, 'yellow');
b(2, 4, -6, -4, 4, 'azure'); b(-4, -2, -6, -4, 4, 'cream'); b(-2, 2, -6, -5, 4, 'cream');
b(4, 8, 3, 5, 4, 'azure');                         // front left wing
b(4, 8, -6, -4, 4, 'aqua');                        // back left wing
b(-8, -4, 3, 5, 4, 'aqua');                        // front right wing
b(-8, -4, -6, -4, 4, 'azure');                     // back right wing
// course 5
b(2, 3, 0, 4, 5, 'pale'); b(2, 3, -2, 0, 5, 'yellow'); b(2, 3, -4, -2, 5, 'aqua'); b(3, 4, -3, -2, 5, 'pink');
b(-3, -2, 0, 4, 5, 'lgrey'); b(-3, -2, -2, 0, 5, 'dpink'); b(-3, -2, -4, -2, 5, 'white');
b(-3, 3, -5, -4, 5, 'yellow');
b(3, 5, 3, 5, 5, 'azure');                         // on the front left wing
b(3, 5, -6, -4, 5, 'azure');                       // on the back left wing, the flower's block
b(-5, -3, 3, 5, 5, 'lime');                        // on the front right wing
b(-5, -3, -6, -4, 5, 'lime');                      // on the back right wing
// course 6: the yellow band over the stage, pink in the middle, lavender at the back
b(-3, 3, 2, 4, 6, 'yellow'); b(-2, 0, -2, 2, 6, 'pink'); b(0, 2, -2, 2, 6, 'pink'); b(-3, 3, -4, -2, 6, 'lilac');
// course 7: the rooftop pavilion
b(-2, 2, 1, 3, 7, 'aqua'); b(-2, 2, -1, 1, 7, 'yellow'); b(-2, 2, -3, -1, 7, 'azure');
// the back deck, where you climb on to the slide
b(-1, 3, -9, -6, 1, 'aqua'); b(-1, 3, -9, -6, 2, 'aqua'); b(-1, 1, -11, -9, 1, 'white');

// ---------------------------------------------------------------- outlines: the cells of a course traced into loops,
// set in so the soft edges land on the true outline, and rounded at every corner
function traceLoops(cells) {
  const has = (x, z) => cells.has(`${x},${z}`), out = new Map();
  const add = (a, c) => { const k = `${a[0]},${a[1]}`; if (!out.has(k)) out.set(k, []); out.get(k).push(c); };
  for (const key of cells.keys()) {
    const [x, z] = key.split(',').map(Number);
    if (!has(x, z - 1)) add([x, z], [x + 1, z]);
    if (!has(x + 1, z)) add([x + 1, z], [x + 1, z + 1]);
    if (!has(x, z + 1)) add([x + 1, z + 1], [x, z + 1]);
    if (!has(x - 1, z)) add([x, z + 1], [x, z]);
  }
  const loops = [];
  for (const [k0, list] of out) while (list.length) {
    const start = k0.split(',').map(Number), poly = [start];
    let nxt = list.shift(), dir = [nxt[0] - start[0], nxt[1] - start[1]], cur = nxt, guard = 0;
    while ((cur[0] !== start[0] || cur[1] !== start[1]) && guard++ < 4000) {
      poly.push(cur);
      const cand = out.get(`${cur[0]},${cur[1]}`);
      let bi = 0, best = -Infinity;
      cand.forEach((c, i) => { const d = [c[0] - cur[0], c[1] - cur[1]]; const sc = 2 * (dir[0] * d[1] - dir[1] * d[0]) + (dir[0] * d[0] + dir[1] * d[1]); if (sc > best) { best = sc; bi = i; } });
      nxt = cand.splice(bi, 1)[0]; dir = [nxt[0] - cur[0], nxt[1] - cur[1]]; cur = nxt;
    }
    // (points along a straight edge stay, one at every block boundary, so each side panel belongs to one block)
    const simple = poly;
    let area = 0; for (let i = 0; i < simple.length; i++) { const p = simple[i], q = simple[(i + 1) % simple.length]; area += p[0] * q[1] - q[0] * p[1]; }
    if (area > 0) loops.push(simple);                  // (holes run the other way: they are filled in)
  }
  return loops;
}
function inset(poly, d) {
  const n = poly.length, nl = (a, c) => { const dx = c[0] - a[0], dz = c[1] - a[1], l = Math.hypot(dx, dz); return [-dz / l, dx / l]; };
  return poly.map((p, i) => { const a = nl(poly[(i - 1 + n) % n], p), c = nl(p, poly[(i + 1) % n]), k = d / (1 + a[0] * c[0] + a[1] * c[1]); return [p[0] + k * (a[0] + c[0]), p[1] + k * (a[1] + c[1])]; });
}
function fillet(poly, rOut, rIn, seg = 4) {
  const out = [], n = poly.length;
  const straight = i => { const a = poly[(i - 1 + n) % n], p = poly[i], c = poly[(i + 1) % n]; return Math.abs((p[0] - a[0]) * (c[1] - p[1]) - (p[1] - a[1]) * (c[0] - p[0])) < 1e-9; };
  const run = (i, step) => { let len = 0, j = i; do { const k = (j + step + n) % n; len += Math.hypot(poly[k][0] - poly[j][0], poly[k][1] - poly[j][1]); j = k; } while (straight(j) && j !== i); return len; };
  for (let i = 0; i < n; i++) {
    const p0 = poly[(i - 1 + n) % n], p1 = poly[i], p2 = poly[(i + 1) % n];
    const s1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), s2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const d1 = [(p1[0] - p0[0]) / s1, (p1[1] - p0[1]) / s1], d2 = [(p2[0] - p1[0]) / s2, (p2[1] - p1[1]) / s2];
    const l1 = straight(i) ? s1 : Math.min(run(i, -1), s1 * 2.2), l2 = straight(i) ? s2 : Math.min(run(i, 1), s2 * 2.2);   // (a corner may round past the first point of a long edge)
    const cr = d1[0] * d2[1] - d1[1] * d2[0], convex = cr > 0;
    if (Math.abs(cr) < 1e-6) { out.push(p1); continue; }                 // a point along a straight edge
    const r = Math.min(convex ? rOut : rIn, l1 * 0.45, l2 * 0.45);
    if (r < 0.01) { out.push(p1); continue; }
    const a = [p1[0] - d1[0] * r, p1[1] - d1[1] * r], e = [p1[0] + d2[0] * r, p1[1] + d2[1] * r], nl = [-d1[1], d1[0]], sg = convex ? 1 : -1;
    const c = [a[0] + nl[0] * r * sg, a[1] + nl[1] * r * sg];
    const a0 = Math.atan2(a[1] - c[1], a[0] - c[0]); let da = Math.atan2(e[1] - c[1], e[0] - c[0]) - a0;
    while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
    for (let k = 0; k <= seg; k++) { const t = a0 + da * k / seg; out.push([c[0] + Math.cos(t) * r, c[1] + Math.sin(t) * r]); }
  }
  return out;
}
function extrude(poly, y0, h, bev = 0) {
  const shape = new THREE.Shape(poly.map(([x, z]) => new THREE.Vector2(x, -z)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: Math.max(0.01, h - 2 * bev), bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: bev, bevelSegments: 2, curveSegments: 1 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, y0 + bev, 0);
  return geo;
}

// ---------------------------------------------------------------- the ribbed cladding: vertical fins, two to a stud
let ribTex = null;
function ribs() {
  if (ribTex) return ribTex;
  const cv = document.createElement('canvas'); cv.width = 64; cv.height = 4;
  const g = cv.getContext('2d'), gr = g.createLinearGradient(0, 0, 64, 0);
  gr.addColorStop(0, '#6f6f6f'); gr.addColorStop(0.12, '#ffffff'); gr.addColorStop(0.62, '#e6e6e6'); gr.addColorStop(0.78, '#9a9a9a'); gr.addColorStop(1, '#6f6f6f');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 4);
  ribTex = new THREE.CanvasTexture(cv); ribTex.colorSpace = THREE.SRGBColorSpace;
  ribTex.wrapS = ribTex.wrapT = THREE.RepeatWrapping; ribTex.repeat.set(2, 1);
  return ribTex;
}
// the changing cabins as beach huts: boards in a bright colour and white in turn, two boards to a stud
export const HUT = { dgrey: '#2f86eb', brown: '#ff6257', tan: '#ffc53d' };
const hutMats = new Map();
function hutMat(hex) {
  if (hutMats.has(hex)) return hutMats.get(hex);
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 4;
  const g = cv.getContext('2d');
  for (const [x0, fill] of [[0, hex], [64, '#fbf8f0']]) {
    g.fillStyle = fill; g.fillRect(x0, 0, 64, 4);
    const sh = g.createLinearGradient(x0, 0, x0 + 64, 0);                       // each board rounded, darker at its edges
    sh.addColorStop(0, 'rgba(0,0,0,0.3)'); sh.addColorStop(0.14, 'rgba(255,255,255,0.14)'); sh.addColorStop(0.6, 'rgba(0,0,0,0)');
    sh.addColorStop(0.86, 'rgba(0,0,0,0.1)'); sh.addColorStop(1, 'rgba(0,0,0,0.3)');
    g.fillStyle = sh; g.fillRect(x0, 0, 64, 4);
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  const m = new THREE.MeshStandardMaterial({ map: t, bumpMap: ribs(), bumpScale: 2.5, roughness: 0.34, metalness: 0.05, envMapIntensity: 0.7 });
  hutMats.set(hex, m);
  return m;
}
let BAND_MATS = null;
function bandMats() {
  if (BAND_MATS) return BAND_MATS;
  BAND_MATS = {
    paint: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, metalness: 0.18, envMapIntensity: 0.85 }),
    rib: new THREE.MeshStandardMaterial({ vertexColors: true, map: ribs(), bumpMap: ribs(), bumpScale: 2.5, roughness: 0.5, metalness: 0.25, envMapIntensity: 0.6 }),
    glass: new THREE.MeshStandardMaterial({ color: '#3d86b8', roughness: 0.06, metalness: 0.35, envMapIntensity: 1.5 }),     // (sky-blue glass)
  };
  return BAND_MATS;
}

// Cut a flat polygon by the line axis = v, keeping one side (Sutherland-Hodgman)
function clipAxis(poly, ax, v, less) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], c = poly[(i + 1) % poly.length], da = a.p[ax] - v, dc = c.p[ax] - v;
    if (less ? da <= 1e-9 : da >= -1e-9) out.push(a);
    if ((da < -1e-9 && dc > 1e-9) || (da > 1e-9 && dc < -1e-9)) {
      const t = da / (da - dc);
      out.push({ p: a.p.clone().lerp(c.p, t), n: a.n.clone().lerp(c.n, t).normalize(), u: a.u.clone().lerp(c.u, t) });
    }
  }
  return out;
}
// One course as bands: each triangle takes the colour (and finish) of the block it belongs to
function courseMeshes(bricks, y0, group, { glow = null, stripe = false } = {}) {
  const cells = new Map();
  for (const k of bricks) for (let x = k.x0; x < k.x1; x++) for (let z = k.z0; z < k.z1; z++) cells.set(`${x},${z}`, k);
  const at = (x, z) => {
    const cx = Math.floor(x), cz = Math.floor(z);
    if (cells.has(`${cx},${cz}`)) return cells.get(`${cx},${cz}`);
    for (const [dx, dz] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (cells.has(`${cx + dx},${cz + dz}`)) return cells.get(`${cx + dx},${cz + dz}`);
    return null;
  };
  const kinds = { paint: { p: [], n: [], c: [], u: [] }, glass: { p: [], n: [], c: [], u: [] } };
  const seams = [];                                                                // [x, y, z, turn, length, 'v' up a side | 'h' across a top]
  for (const [key, k] of cells) {
    const [x, z] = key.split(',').map(Number);
    const r = cells.get(`${x + 1},${z}`), f = cells.get(`${x},${z + 1}`);
    if (r && r !== k) seams.push([x + 1, y0 + BR, z + 0.5, Math.PI / 2, 1, 'h']);
    if (f && f !== k) seams.push([x + 0.5, y0 + BR, z + 1, 0, 1, 'h']);
  }
  const col = new THREE.Color(), A = new THREE.Vector3(), Bv = new THREE.Vector3(), Cv = new THREE.Vector3(), N = new THREE.Vector3(), E = new THREE.Vector3();
  for (const loop of traceLoops(cells)) {
    const BEV = 0.035;
    const geo = extrude(fillet(inset(loop, BEV), 0.38, 0.18), y0 + REV, BR - REV, BEV);
    const pos = geo.attributes.position, nor = geo.attributes.normal, uv = geo.attributes.uv;
    const vert = v => ({ p: new THREE.Vector3().fromBufferAttribute(pos, v), n: new THREE.Vector3().fromBufferAttribute(nor, v), u: new THREE.Vector2().fromBufferAttribute(uv, v) });
    const emit = (tri, cx, cz) => {
      const k = at(cx, cz);
      const kind = !k ? 'paint' : k.col === 'clear' ? 'glass' : k.kind === 'm' ? `hut:${HUT[k.col] || COL[k.col]}` : 'paint';
      col.set(k ? COL[k.col] : COL.white).convertSRGBToLinear();
      const o = kinds[kind] || (kinds[kind] = { p: [], n: [], c: [], u: [] });
      for (const w of tri) { o.p.push(w.p.x, w.p.y, w.p.z); o.n.push(w.n.x, w.n.y, w.n.z); o.c.push(col.r, col.g, col.b); o.u.push(w.u.x, w.u.y); }
    };
    for (let t = 0; t < pos.count; t += 3) {
      A.fromBufferAttribute(pos, t); Bv.fromBufferAttribute(pos, t + 1); Cv.fromBufferAttribute(pos, t + 2);
      N.subVectors(Bv, A).cross(E.subVectors(Cv, A)).normalize();
      const tri = [vert(t), vert(t + 1), vert(t + 2)];
      const hz = Math.hypot(N.x, N.z);
      if (Math.abs(N.y) < 0.75 && hz > 1e-4) {                                                     // a wall: step inside it to find its block
        emit(tri, (A.x + Bv.x + Cv.x) / 3 - N.x / hz * 0.35, (A.z + Bv.z + Cv.z) / 3 - N.z / hz * 0.35);
        continue;
      }
      // a top or bottom: cut it along the block grid so each colour stops at its block's edge
      let polys = [tri];
      for (const ax of ['x', 'z']) {
        const lo = Math.min(...tri.map(w => w.p[ax])), hi = Math.max(...tri.map(w => w.p[ax]));
        for (let g = Math.floor(lo) + 1; g < hi; g++) polys = polys.flatMap(pg => [clipAxis(pg, ax, g, true), clipAxis(pg, ax, g, false)]).filter(pg => pg.length >= 3);
      }
      for (const pg of polys) {
        const cx = pg.reduce((s2, w) => s2 + w.p.x, 0) / pg.length, cz = pg.reduce((s2, w) => s2 + w.p.z, 0) / pg.length;
        for (let i = 1; i < pg.length - 1; i++) emit([pg[0], pg[i], pg[i + 1]], cx, cz);
      }
    }
    // panel joints: a fine dark line wherever one block meets another, up the sides and across the top
    for (let i = 0; i < loop.length; i++) {
      const a = loop[(i - 1 + loop.length) % loop.length], p = loop[i], c = loop[(i + 1) % loop.length];
      const dx = c[0] - p[0], dz = c[1] - p[1];
      if ((p[0] - a[0]) * dz - (p[1] - a[1]) * dx !== 0) continue;               // only points along a straight edge
      const nx = -dz, nz = dx;                                                     // inward
      const before = at(p[0] - dx * 0.5 + nx * 0.5, p[1] - dz * 0.5 + nz * 0.5), after = at(p[0] + dx * 0.5 + nx * 0.5, p[1] + dz * 0.5 + nz * 0.5);
      if (before === after && before?.col !== 'clear') continue;                // (and mullions in the glass)
      seams.push([p[0], y0 + REV + (BR - REV) / 2, p[1], Math.abs(dx) > 0 ? 0 : Math.PI / 2, BR - REV - 0.2, 'v']);
    }
    // the glass under the band
    const rev = new THREE.Mesh(extrude(fillet(inset(loop, 0.12), 0.4, 0.15), y0, REV + 0.02), glow || mat('#1b2630', { roughness: 0.08, metalness: 0.6, envMapIntensity: 1.4 }));
    rev.receiveShadow = true; group.add(rev);
    // racing stripes: a white band and a fine dark line wrapped round the outside
    if (stripe) for (const [f, h, hex] of [[0.38, 0.09, '#ffffff'], [0.52, 0.035, '#23252b']]) {
      const outer = fillet(inset(loop, -0.014), 0.4, 0.17).map(([x, z]) => new THREE.Vector2(x, -z));
      const inner = fillet(inset(loop, 0.12), 0.35, 0.15).map(([x, z]) => new THREE.Vector2(x, -z));
      if (THREE.ShapeUtils.isClockWise(outer) === THREE.ShapeUtils.isClockWise(inner)) inner.reverse();
      const sh = new THREE.Shape(outer); sh.holes.push(new THREE.Path(inner));
      const sg = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false, curveSegments: 1 });
      sg.rotateX(-Math.PI / 2); sg.translate(0, y0 + REV + (BR - REV) * f, 0);
      group.add(new THREE.Mesh(sg, mat(hex, { roughness: 0.3 })));
    }
  }
  if (seams.length) {
    const geo = new THREE.BoxGeometry(1, 1, 1), sm = new THREE.InstancedMesh(geo, mat('#24262b', { roughness: 0.8 }), seams.length), m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
    seams.forEach(([x, y, z, turn, len, kind], i) => {
      q.setFromAxisAngle(up, turn);
      const sc = kind === 'v' ? new THREE.Vector3(0.05, len, 0.05) : new THREE.Vector3(len - 0.1, 0.03, 0.05);
      sm.setMatrixAt(i, m4.compose(new THREE.Vector3(x, y, z), q, sc));
    });
    sm.name = 'seams'; group.add(sm);
  }
  const M = bandMats();
  for (const [kind, o] of Object.entries(kinds)) {
    if (!o.p.length) continue;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(o.p, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(o.n, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(o.c, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(o.u, 2));
    const m = new THREE.Mesh(g, kind.startsWith('hut:') ? hutMat(kind.slice(4)) : M[kind]); m.castShadow = true; m.receiveShadow = true; m.name = `band-${kind}`;
    group.add(m);
  }
}

// ---------------------------------------------------------------- a crawler track: steel shoes round a sprocket, an idler and road wheels
function gearShape(r, teeth, depth) {
  const s = new THREE.Shape(), n = teeth * 4;
  for (let i = 0; i <= n; i++) {
    const a = i / n * Math.PI * 2, q = i % 4, rr = q === 1 || q === 2 ? r : r - depth;
    if (i === 0) s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); else s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  return s;
}
function wheel(r, w, paint) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 20).rotateZ(Math.PI / 2), mat(COL.steel, STEEL)));
  for (const s of [-1, 1]) {
    const face = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.78, r * 0.78, 0.06, 18).rotateZ(Math.PI / 2), mat(paint, { roughness: 0.4, metalness: 0.3 }));
    face.position.x = s * (w / 2 + 0.01); g.add(face);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.3, r * 0.34, 0.16, 10).rotateZ(Math.PI / 2), mat(COL.chrome, CHROME));
    hub.position.x = s * (w / 2 + 0.06); g.add(hub);
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3, bolt = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.06, r * 0.06, 0.08, 6).rotateZ(Math.PI / 2), mat(COL.chrome, CHROME));
      bolt.position.set(s * (w / 2 + 0.05), Math.sin(a) * r * 0.5, Math.cos(a) * r * 0.5); g.add(bolt);
    }
  }
  g.userData.r = r;
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return bake(g);
}
function track(side, parent, GLOW) {
  // (the shoes stand 0.5 out from the path, so the path is 5 tall and lifted 0.5: 6 studs overall, like the LEGO track)
  const g = new THREE.Group(); g.position.y = 0.5; parent.add(g);
  const L = 16, H = 5, W = 3, r = H / 2, xc = side * 5.5, zc = -1.5, rearZ = zc - (L / 2 - r), frontZ = zc + (L / 2 - r);
  // the frame between the wheels, chamfered at the ends
  const fs = new THREE.Shape(); fs.moveTo(-5.0, 1.2); fs.lineTo(5.0, 1.2); fs.lineTo(5.9, 2.5); fs.lineTo(5.0, 3.8); fs.lineTo(-5.0, 3.8); fs.lineTo(-5.9, 2.5); fs.closePath();
  const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: W - 0.9, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2 }), mat(COL.graphite, { roughness: 0.45, metalness: 0.35 }));
  frame.geometry.translate(0, 0, -(W - 0.9) / 2).rotateY(Math.PI / 2); frame.position.set(xc, 0, zc); frame.castShadow = frame.receiveShadow = true; g.add(frame);
  // a white fairing over the top of the track, like a concept vehicle's, with a green stripe and a chrome edge
  const FR = r + 0.6, a0 = 0.36, fs2 = new THREE.Shape(), ends = L / 2 - r;
  for (let i = 0; i <= 12; i++) { const a = a0 + (Math.PI / 2 - a0) * i / 12, pz = ends + Math.cos(a) * FR, py = r + Math.sin(a) * FR; if (i === 0) fs2.moveTo(pz, py); else fs2.lineTo(pz, py); }
  for (let i = 0; i <= 12; i++) { const a = Math.PI / 2 + (Math.PI / 2 - a0) * i / 12; fs2.lineTo(-ends + Math.cos(a) * FR, r + Math.sin(a) * FR); }
  fs2.closePath();
  const fair = new THREE.Mesh(new THREE.ExtrudeGeometry(fs2, { depth: W + 0.1, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.14, bevelSegments: 3, curveSegments: 4 }), mat('#f3f4f2', { roughness: 0.22, metalness: 0.08, envMapIntensity: 0.9 }));
  fair.geometry.translate(0, 0, -(W + 0.1) / 2).rotateY(-Math.PI / 2); fair.position.set(xc, 0, zc); fair.castShadow = fair.receiveShadow = true; g.add(fair);
  const lowY = r + Math.sin(a0) * FR, outX = xc + side * ((W + 0.1) / 2 + 0.15);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 2 * ends + 1.2), mat(COL.deck, { roughness: 0.3 })); stripe.position.set(outX, lowY + 1.05, zc); g.add(stripe);
  const pin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.07, 2 * ends + 1.2), mat('#23252b')); pin.position.set(outX, lowY + 1.32, zc); g.add(pin);
  const edgeC = new THREE.Mesh(new THREE.BoxGeometry(W + 0.5, 0.1, 2 * ends + 2 * Math.cos(a0) * FR - 0.2), mat(COL.chrome, CHROME)); edgeC.position.set(xc, lowY + 0.02, zc); g.add(edgeC);
  const runL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 1.4), GLOW.fender); runL.position.set(outX, lowY + 1.05, zc + ends + 1.6); g.add(runL);
  // drive sprocket (back) and idler (front), road wheels below, rollers on top
  const sprocket = new THREE.Group(); sprocket.position.set(xc, r, rearZ); sprocket.userData.r = r; sprocket.userData.moves = true; g.add(sprocket);
  const gear = new THREE.Mesh(new THREE.ExtrudeGeometry(gearShape(r - 0.42, 11, 0.32), { depth: 0.5, bevelEnabled: false, curveSegments: 1 }), mat(COL.steel, STEEL));
  gear.geometry.translate(0, 0, -0.25).rotateY(Math.PI / 2); gear.castShadow = true; sprocket.add(gear);
  sprocket.add(wheel(r - 0.85, W - 0.7, COL.graphite));
  const idler = wheel(r - 0.5, W - 0.6, COL.graphite); idler.position.set(xc, r, frontZ); idler.userData.moves = true; g.add(idler);
  const spin = [sprocket, idler];
  for (let i = 0; i < 5; i++) { const w = wheel(0.72, W - 0.8, COL.graphite); w.position.set(xc, 0.78, zc - 4.0 + i * 2.0); w.userData.moves = true; g.add(w); spin.push(w); }
  for (const z of [-2.4, 2.4]) { const w = wheel(0.45, W - 1.0, COL.graphite); w.position.set(xc, H - 0.52, zc + z); w.userData.moves = true; g.add(w); spin.push(w); }
  // the shoes
  const per = 2 * (L - 2 * r) + 2 * Math.PI * r, n = 48, pitch = per / n;
  const at = d => {
    d = ((d % per) + per) % per;
    const straight = L - 2 * r, arc = Math.PI * r;
    if (d < straight) return [-L / 2 + r + d, 0, 0];
    d -= straight;
    if (d < arc) { const a = -Math.PI / 2 + d / r; return [L / 2 - r + Math.cos(a) * r, r + Math.sin(a) * r, a + Math.PI / 2]; }
    d -= arc;
    if (d < straight) return [L / 2 - r - d, H, Math.PI];
    d -= straight;
    const a = Math.PI / 2 + d / r; return [-L / 2 + r + Math.cos(a) * r, r + Math.sin(a) * r, a + Math.PI / 2];
  };
  const shoe = new RoundedBoxGeometry(W, 0.24, pitch * 0.9, 1, 0.06).translate(0, -0.14, 0);       // outward is -y
  const grouser = new THREE.BoxGeometry(W * 0.96, 0.26, 0.26).translate(0, -0.36, -pitch * 0.18);
  const lug = new THREE.BoxGeometry(0.3, 0.3, pitch * 0.95).translate(0, 0.12, 0);
  const inst = [
    new THREE.InstancedMesh(shoe, mat(COL.steel, STEEL), n), new THREE.InstancedMesh(grouser, mat('#26282c', STEEL), n),
    new THREE.InstancedMesh(mergeGeometries([lug.clone().translate(-0.6, 0, 0), lug.clone().translate(0.6, 0, 0)]), mat('#5a5e64', STEEL), n),
  ];
  for (const m of inst) { m.castShadow = true; m.receiveShadow = true; g.add(m); }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  let off = 0;
  g.userData.move = dist => {
    off += dist;
    for (let i = 0; i < n; i++) {
      const [z, y, a] = at(off + i * pitch);
      e.set(-a, 0, 0); q.setFromEuler(e); v.set(xc, y, z + zc); m4.compose(v, q, one);
      for (const m of inst) m.setMatrixAt(i, m4);
    }
    for (const m of inst) m.instanceMatrix.needsUpdate = true;
    for (const w of spin) w.rotation.x = off / w.userData.r;
  };
  g.userData.move(0);
  return g;
}

// ---------------------------------------------------------------- the pink curved slide: a solid half-pipe with thick walls,
// wider and deeper at the top where you sit down, swept along the curve and closed at both ends
function slideMesh(curve, { RI = 1.85, seg = 72, flume = false, glow = null } = {}) {
  const T = 0.26, N = 16;                                      // wall thickness (studs), points round the curve; RI the inner radius
  const prof = t => {                                          // closed outline: across, up (0 is the bottom of the channel)
    const w = flume ? 1 : 1 + 0.12 * Math.max(0, 1 - t / 0.3) ** 2, hw = flume ? 0.45 + 0.35 * Math.max(0, 1 - t / 0.15) : 0.25 + 0.6 * Math.max(0, 1 - t / 0.5);
    const ri = RI * w, ro = ri + T, c = ri, out = [];
    out.push([-ri, c + hw]);
    for (let i = 0; i <= N; i++) { const a = Math.PI + Math.PI * i / N; out.push([Math.cos(a) * ri, c + Math.sin(a) * ri]); }
    out.push([ri, c + hw], [ro, c + hw]);
    for (let i = N; i >= 0; i--) { const a = Math.PI + Math.PI * i / N; out.push([Math.cos(a) * ro, c + Math.sin(a) * ro]); }
    out.push([-ro, c + hw]);
    return out;
  };
  const K = prof(0).length, rings = [], h = new THREE.Vector3(0, 0, -1);
  for (let s = 0; s <= seg; s++) {
    const t = s / seg, p = curve.getPointAt(t), tan = curve.getTangentAt(t);
    // sideways stays level and square to the way the slide runs downhill, so the channel never twists where it is steep
    const hz = new THREE.Vector3(tan.x, 0, tan.z);
    if (hz.lengthSq() > 1e-4) h.lerp(hz.normalize(), s ? 0.5 : 1).normalize();
    const side = new THREE.Vector3(-h.z, 0, h.x), nrm = new THREE.Vector3().crossVectors(side, tan).normalize();
    rings.push(prof(t).map(([a, c]) => new THREE.Vector3().copy(p).addScaledVector(side, a).addScaledVector(nrm, c - 0.1)));
  }
  // four sweeps, each with its own vertices so the rims stay crisp: the inside, one rim, the outside, the other rim
  const parts = [[0, N + 2], [N + 2, N + 3], [N + 3, 2 * N + 5], [2 * N + 5, K]];
  const sweeps = parts.map(([i0, i1]) => {
    const n = i1 - i0 + 1, sp = [], si = [];
    for (let s = 0; s <= seg; s++) for (let i = i0; i <= i1; i++) { const v = rings[s][i % K]; sp.push(v.x, v.y, v.z); }
    for (let s = 0; s < seg; s++) for (let i = 0; i < n - 1; i++) { const a = s * n + i, bb = a + 1, c = a + n, d = c + 1; si.push(a, c, bb, bb, c, d); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); geo.setIndex(si); geo.computeVertexNormals();
    return geo;
  });
  const capPos = [], capIdx = [];
  for (const [ring, t] of [[rings[0], 0], [rings[seg], 1]]) {
    const base = capPos.length / 3;
    for (const v of ring) capPos.push(v.x, v.y, v.z);
    for (const f of THREE.ShapeUtils.triangulateShape(prof(t).map(([a, c]) => new THREE.Vector2(a, c)), [])) capIdx.push(base + f[0], base + f[1], base + f[2]);
  }
  const caps = new THREE.BufferGeometry();
  caps.setAttribute('position', new THREE.Float32BufferAttribute(capPos, 3)); caps.setIndex(capIdx); caps.computeVertexNormals();
  const outer = new THREE.MeshPhysicalMaterial({ color: COL.slide, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2, side: THREE.DoubleSide, envMapIntensity: 0.6 });
  const inner = new THREE.MeshPhysicalMaterial({ color: '#f06bb0', roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide, envMapIntensity: 0.8 });
  const g = new THREE.Group();
  sweeps.forEach((geo, i) => { const m = new THREE.Mesh(geo, i === 0 ? inner : outer); m.castShadow = m.receiveShadow = true; g.add(m); });
  const cm = new THREE.Mesh(caps, outer); cm.castShadow = true; g.add(cm);
  if (glow) for (const i of [0, N + 2]) {                       // light strips along both lips
    const pts = rings.filter((_, k) => k % 4 === 0 || k === seg).map(r => r[i].clone().add(new THREE.Vector3(0, 0.06, 0)));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, 0.07, 5), glow));
  }
  return g;
}

// ---------------------------------------------------------------- small things: a rail, a person in stud units
function rail(parent, pts, h = 2.6) {
  for (const [f, rr] of [[1, 0.07], [0.5, 0.045]]) {
    const line = pts.map(([x, y, z]) => new THREE.Vector3(x, y + h * f, z));
    parent.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(line, false, 'catmullrom', 0), 8 * pts.length, rr, 6), mat(COL.chrome, CHROME)));
  }
  for (const [x, y, z] of pts) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, h, 6), mat(COL.chrome, CHROME)); p.position.set(x, y + h / 2, z); parent.add(p); }
}
function personStuds(look) { const f = figure(look); f.scale.setScalar(1 / S); return f; }

// ---------------------------------------------------------------- the whole machine
// flume: the game's longer water slide, sweeping out behind in an easy S (the drawings keep the LEGO model's short one)
export function build({ band = true, rider = true, ladder = false, flume = false } = {}) {
  const M = new THREE.Group(); M.name = 'bathing_machine';
  const L = new THREE.Group(); L.scale.setScalar(S); M.add(L);     // stud units inside
  const parts = {}, points = {};
  const part = name => { const g = new THREE.Group(); g.name = name; L.add(g); parts[name] = g; return g; };
  // the parts that light up at night (the game turns their glow up and down)
  const glowMat = (hex, glowHex, o = {}) => new THREE.MeshStandardMaterial({ color: hex, emissive: glowHex, emissiveIntensity: 0, roughness: 0.3, envMapIntensity: 0.6, ...o });
  const GLOW_COLS = ['#4fd8ff', '#ff5fa2', '#ffd23f', '#9dff5c', '#b48cff', '#4fd8ff', '#ffffff'];
  const GLOW = {
    reveals: GLOW_COLS.map(c => glowMat(new THREE.Color('#1b2630').lerp(new THREE.Color(c), 0.6), c, { roughness: 0.1, metalness: 0.35, envMapIntensity: 1.2 })),
    slide: glowMat('#ffd0ea', '#ff5fa2', { roughness: 0.3 }), head: glowMat('#f4f8ff', '#ffffff', { roughness: 0.2 }), fender: glowMat('#fff1d6', '#ffcf70'),
    nozzle: glowMat('#bfefff', '#4fd8ff'), port: glowMat('#bfe6ff', '#ffc966', { roughness: 0.08, metalness: 0.3, envMapIntensity: 1.3 }), flower: glowMat(COL.purple, '#b48cff', { roughness: 0.35 }), hub: glowMat(COL.lime, '#d8ff6a', { roughness: 0.35 }),
  };
  // ------------------------------------------------ undercarriage
  const tr = part('tracks');
  const left = track(1, tr, GLOW), right = track(-1, tr, GLOW);
  const belly = new THREE.Mesh(new RoundedBoxGeometry(7.6, 2.6, 15, 3, 0.35), mat(COL.graphite, { roughness: 0.5, metalness: 0.3 }));
  belly.position.set(0, 4.95, -1.5); belly.castShadow = belly.receiveShadow = true; tr.add(belly);
  for (let i = 0; i < 6; i++) for (const x of [3.82, -3.82]) { const v = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.9, 1.6), mat('#1c1d20')); v.position.set(x, 5.0, -6.5 + i * 2.2); tr.add(v); }
  for (const z of [-7, -1.5, 4]) { const a = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 9, 12).rotateZ(Math.PI / 2), mat(COL.frame, STEEL)); a.position.set(0, 4.3, z); tr.add(a); }
  // ------------------------------------------------ the deck
  const body = part('body');
  const deckLoop = [[-5, -12], [5, -12], [5, 6], [-5, 6]];
  const deck = new THREE.Mesh(extrude(fillet(inset(deckLoop, 0.12), 1.2, 0.3, 8), TOP0 - 0.6, 0.6, 0.12), mat(COL.deck, { roughness: 0.38, metalness: 0.1 }));
  deck.castShadow = deck.receiveShadow = true; body.add(deck);
  body.add(new THREE.Mesh(extrude(fillet(inset(deckLoop, 0.2), 1.1, 0.3, 8), TOP0 - 0.75, 0.16), mat(COL.reveal)));
  {                                                                              // a light bar across the deck's nose
    const frameB = new THREE.Mesh(new RoundedBoxGeometry(7.6, 0.34, 0.16, 2, 0.06), mat(COL.chrome, CHROME)); frameB.position.set(0, TOP0 - 0.32, 5.98); body.add(frameB);
    const barL = new THREE.Mesh(new THREE.BoxGeometry(7.3, 0.16, 0.08), GLOW.head); barL.position.set(0, TOP0 - 0.32, 6.06); body.add(barL);
  }
  for (const [x, z] of [[-4.95, -11], [4.95, -11], [-4.95, -3], [4.95, -3]]) {        // little amber lights along the deck edge
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 0.6), new THREE.MeshBasicMaterial({ color: '#ffb547' })); l.position.set(x * 1.012, TOP0 - 0.3, z); body.add(l);
  }
  // ------------------------------------------------ the bands, one per course (the four arms' outer ends are cut off to fold)
  const bricks = BRICKS.map(k => ({ ...k })), armBricks = [];
  for (const k of bricks) if (k.c === 4 && k.x1 - k.x0 === 4 && (k.x0 === 4 || k.x1 === -4)) {
    if (k.x0 === 4) { armBricks.push({ ...k, x0: 5, x1: 8, side: 1 }); k.x1 = 5; } else { armBricks.push({ ...k, x0: -8, x1: -5, side: -1 }); k.x0 = -5; }
  }
  const byCourse = new Map();
  for (const k of bricks) { if (!byCourse.has(k.c)) byCourse.set(k.c, []); byCourse.get(k.c).push(k); }
  for (const [c, list] of byCourse) courseMeshes(list, C(c), body, { glow: GLOW.reveals[c - 1], stripe: c === 3 || c === 6 });
  {                                                                              // a round window in each hut (they light up at night)
    const ringG = new THREE.TorusGeometry(0.5, 0.09, 8, 28), glassG = new THREE.CircleGeometry(0.47, 28);
    for (const k of bricks) if (k.c === 2 && k.kind === 'm' && k.x1 - k.x0 === 1) {
      const sd = k.x0 > 0 ? 1 : -1, zc2 = (k.z0 + k.z1) / 2, y = C(2) + REV / 2, x = sd * 5;
      const ring = new THREE.Mesh(ringG, mat(COL.white, { roughness: 0.25 })); ring.rotation.y = Math.PI / 2; ring.position.set(x + sd * 0.02, y, zc2); ring.castShadow = true; body.add(ring);
      const gl = new THREE.Mesh(glassG, GLOW.port); gl.rotation.y = sd * Math.PI / 2; gl.position.set(x + sd * 0.01, y, zc2); body.add(gl);
    }
  }
  // the arms: each hinges at the body's side, folding up to drive and down to spray, with its fountain at the tip
  const armsG = part('arms'), arms = [];
  points.nozzles = [];
  for (const k of armBricks) {
    const zc2 = (k.z0 + k.z1) / 2, pivot = new THREE.Group(); pivot.position.set(k.side * 5, C(5), zc2); pivot.userData.moves = true; armsG.add(pivot);
    const inner = new THREE.Group(); inner.position.set(-k.side * 5, -C(5), -zc2); pivot.add(inner);
    courseMeshes([k], C(4), inner, { glow: GLOW.reveals[3] });
    const x = k.side * 7.3, y = C(5), dir = k.side;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.2, 14), mat(COL.chrome, CHROME)); base.position.set(x, y + 0.1, zc2); inner.add(base);
    const ringL = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 5, 20).rotateX(Math.PI / 2), GLOW.nozzle); ringL.position.set(x, y + 0.2, zc2); inner.add(ringL);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.55, 12).rotateZ(-dir * 0.7), mat(COL.chrome, CHROME)); head.position.set(x + dir * 0.15, y + 0.42, zc2); inner.add(head);
    const tip = new THREE.Object3D(); tip.position.set(x + dir * 0.35, y + 0.65, zc2); inner.add(tip);
    bake(inner);
    arms.push({ pivot, side: k.side });
    points.nozzles.push({ x: (x + dir * 0.35) * S, y: (y + 0.65) * S, z: zc2 * S, dir, tip });
  }
  // ------------------------------------------------ the stage: a round teal platform cantilevered at the front
  const st = part('stage');
  const stZ = 5.6, stTop = TOP0 + 0.45;
  const turn = new THREE.Group(); turn.position.set(0, TOP0, stZ); turn.userData.moves = true; st.add(turn);     // (it turns)
  const disc = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [3.7, 0], [3.95, 0.08], [4.02, 0.22], [3.95, 0.38], [3.8, 0.45], [0, 0.45]].map(([r, y]) => new THREE.Vector2(r, y)), 64), mat(COL.stage, { roughness: 0.4 }));
  disc.castShadow = disc.receiveShadow = true; turn.add(disc);
  const edge = new THREE.Mesh(new THREE.CylinderGeometry(4.03, 4.03, 0.16, 64, 1, true), mat(COL.white, { roughness: 0.3 })); edge.position.y = 0.22; turn.add(edge);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, d = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 10), GLOW.nozzle); d.position.set(Math.cos(a) * 3.55, 0.46, Math.sin(a) * 3.55); turn.add(d); }
  const led = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.05, 3, 48).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#bff6ff' })); led.position.y = -0.02; turn.add(led);
  parts.turntable = turn;
  // the big drum behind the band
  const drum = new THREE.Group(); drum.position.set(0, TOP0, 2); drum.userData.moves = true; st.add(drum);
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 1.85, 2.2, 40), mat('#f4f1ea', { roughness: 0.25, metalness: 0.1 })); shell.position.y = 1.15; drum.add(shell);
  for (const y of [0.1, 2.2]) { const hoop = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.09, 5, 32).rotateX(Math.PI / 2), mat(COL.chrome, CHROME)); hoop.position.y = y; drum.add(hoop); }
  const skin = new THREE.Mesh(new THREE.CylinderGeometry(1.84, 1.84, 0.04, 40), mat('#f6eedb', { roughness: 0.8 })); skin.position.y = 2.25; drum.add(skin);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.1, 5), mat(COL.chrome, CHROME)); rod.position.set(Math.cos(a) * 1.93, 1.15, Math.sin(a) * 1.93); drum.add(rod); }
  drum.traverse(o => { if (o.isMesh) o.castShadow = true; });
  bake(drum);
  parts.drum = drum;
  // stage lights under the yellow band
  for (const x of [-2.2, -0.75, 0.75, 2.2]) {
    const can = new THREE.Group(); can.position.set(x, C(6) - 0.1, 3.5); can.rotation.x = 0.6; st.add(can);
    can.add(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.7, 12).translate(0, -0.35, 0), mat('#1f2024', { roughness: 0.4, metalness: 0.5 })));
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.2, 12).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#fff3c8' })); lens.position.y = -0.71; can.add(lens);
  }
  points.stage = { x: 0, z: stZ * S, r: 4 * S, y: stTop * S };
  if (band) {
    const knight = personStuds(LOOKS.knight); knight.position.set(-2.1, 0.45, -1.2); knight.rotation.y = 0.15; turn.add(knight);
    const pig = personStuds(LOOKS.pig); pig.position.set(-0.3, 0.45, 1.4); pig.rotation.y = 0.05; turn.add(pig);
    const smiley = personStuds(LOOKS.smiley); smiley.position.set(1.9, 0.45, -0.4); smiley.rotation.y = -0.35; turn.add(smiley);
    points.band = [knight, pig, smiley];
  }
  bake(turn);
  // a screen across the front of the yellow band over the stage (the game draws on it)
  const scr = document.createElement('canvas'); scr.width = 256; scr.height = 48;
  { const g2 = scr.getContext('2d'); g2.fillStyle = '#10131c'; g2.fillRect(0, 0, 256, 48); const cs = ['#ff5fa2', '#ffd23f', '#4fd8ff', '#9dff5c', '#b48cff']; for (let i = 0; i < 32; i++) { g2.fillStyle = cs[i % 5]; const h = 8 + (i * 37 % 26); g2.fillRect(4 + i * 7.8, 44 - h, 5, h); } }
  const scrTex = new THREE.CanvasTexture(scr); scrTex.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(5.4, BR - REV - 0.2), new THREE.MeshBasicMaterial({ map: scrTex }));
  screen.position.set(0, C(6) + REV + (BR - REV) / 2, 4.03); st.add(screen);
  // ------------------------------------------------ the flower: a little wind turbine on the back left arm
  const fl = part('flower');
  const fx = 4.0, fz = -5.0, fy = C(6);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 3.0, 10), mat(COL.stem, { roughness: 0.35 })); stem.position.set(fx, fy + 1.5, fz); fl.add(stem);
  const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 6), mat(COL.stem)); leaf.scale.set(1.2, 0.18, 0.55); leaf.position.set(fx + 0.55, fy + 1.4, fz); leaf.rotation.z = 0.45; fl.add(leaf);
  const nac = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.6, 4, 10).rotateZ(Math.PI / 2), mat(COL.stem)); nac.position.set(fx + 0.1, fy + 3.15, fz); fl.add(nac);
  const rotor = new THREE.Group(); rotor.position.set(fx + 0.75, fy + 3.15, fz); rotor.userData.moves = true; fl.add(rotor);
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + Math.PI / 4;
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.12, 24).rotateZ(Math.PI / 2), GLOW.flower);
    p.scale.set(1, 1, 0.82); p.position.set(0, Math.sin(a) * 0.95, Math.cos(a) * 0.95); p.castShadow = true; rotor.add(p);
  }
  const hubC = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 18).rotateZ(Math.PI / 2), GLOW.hub); hubC.position.x = 0.08; rotor.add(hubC);
  bake(rotor);
  parts.rotor = rotor;
  // ------------------------------------------------ the shade: a red dish on a steel mast in a round azure planter
  const pa = part('parasol');
  const px = -3, pz = -9, top = 16.3;
  const planter = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [1.0, 0], [1.05, 0.1], [1.05, 1.1], [0.95, 1.2], [0, 1.2]].map(([r, y]) => new THREE.Vector2(r, y)), 28), mat(COL.azure, { roughness: 0.32 }));
  planter.position.set(px, TOP0, pz); planter.castShadow = true; pa.add(planter);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, top - C(2), 12), mat(COL.chrome, CHROME)); mast.position.set(px, (C(2) + top) / 2, pz); mast.castShadow = true; pa.add(mast);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.3, 0.9, 18), mat(COL.yellow, { roughness: 0.3 })); collar.position.set(px, top - 1.15, pz); pa.add(collar);
  const R0 = 4.2, prof = [];
  for (let i = 0; i <= 16; i++) { const r = R0 * i / 16; prof.push(new THREE.Vector2(r, 0.25 - 1.45 * Math.pow(r / R0, 1.7))); }
  for (let i = 16; i >= 0; i--) { const r = R0 * i / 16; prof.push(new THREE.Vector2(Math.max(0.001, r * 0.985), 0.1 - 1.45 * Math.pow(r / R0, 1.7))); }
  const petals = [], shadeMat = mat(COL.shade, { roughness: 0.35, side: THREE.DoubleSide }), SEG = Math.PI * 2 / 8;
  for (let i = 0; i < 8; i++) {                                 // eight petals that fold down round the mast like a closed flower
    const a0 = i * SEG + 0.012, ac = a0 + SEG / 2 - 0.012;
    const pivot = new THREE.Group(); pivot.position.set(px, top, pz); pivot.userData.moves = true; pa.add(pivot);
    const petal = new THREE.Mesh(new THREE.LatheGeometry(prof, 6, a0, SEG - 0.024), shadeMat); petal.castShadow = true; pivot.add(petal);
    petals.push({ pivot, axis: new THREE.Vector3(Math.cos(ac), 0, -Math.sin(ac)) });
  }
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), mat(COL.chrome, CHROME)); tip.position.set(px, top + 0.32, pz); pa.add(tip);
  // ------------------------------------------------ the back deck: rails, the slide, the girl on it
  const sl = part('slide');
  rail(sl, [[-0.85, C(3), -6.2], [-0.85, C(3), -8.85], [0.9, C(3), -8.85]]);
  rail(sl, [[2.85, C(3), -6.2], [2.85, C(3), -7.6]]);
  const sTop = new THREE.Vector3(3.4, C(2) + 0.15, -9.6), RI = flume ? 1.6 : 1.85;
  const curve = flume
    ? new THREE.CatmullRomCurve3([sTop, new THREE.Vector3(4.3, C(2) - 0.3, -11.3), new THREE.Vector3(6.2, 7.0, -13.2), new THREE.Vector3(8.6, 6.0, -14.6),
      new THREE.Vector3(10.6, 4.9, -16.6), new THREE.Vector3(11.4, 3.8, -19.4), new THREE.Vector3(11.2, 2.9, -22.0), new THREE.Vector3(10.8, 2.5, -24.2)], false, 'centripetal')
    : new THREE.CatmullRomCurve3([sTop, new THREE.Vector3(3.7, C(2) - 0.2, -11.0), new THREE.Vector3(4.2, 6.7, -12.5),
      new THREE.Vector3(4.6, 4.7, -13.3), new THREE.Vector3(4.8, 3.3, -14.0), new THREE.Vector3(4.9, 2.7, -15.0)], false, 'centripetal');
  sl.add(slideMesh(curve, { RI, seg: flume ? 140 : 72, flume, glow: GLOW.slide }));
  const strut = (a, b, r = 0.12) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, a.distanceTo(b), 8), mat(COL.chrome, CHROME));
    m.position.copy(a).lerp(b, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); m.castShadow = true; sl.add(m);
  };
  const under = t => curve.getPointAt(t).add(new THREE.Vector3(0, -0.55, 0));
  if (flume) {                                                  // struts from the back corner of the deck hold it up
    const base = new THREE.Vector3(4.7, TOP0 - 0.45, -11.7), base2 = new THREE.Vector3(2.0, TOP0 - 0.45, -11.9);
    strut(base, under(0.3)); strut(base, under(0.52), 0.14); strut(base2, under(0.52), 0.1); strut(under(0.3), under(0.52), 0.08);
  } else strut(new THREE.Vector3(4.6, TOP0 - 0.5, -11.8), curve.getPointAt(0.55).add(new THREE.Vector3(0, -0.6, 0)));
  points.slideRI = RI * S; points.slideFlume = flume;
  const tt = t => Math.min(Math.max(t, 0), 0.9999);                   // (a hair short of the end: getPointAt(1) can land just past it)
  points.slide = { getPointAt: t => curve.getPointAt(tt(t)).multiplyScalar(S), getTangentAt: t => curve.getTangentAt(tt(t)) };
  points.slideTop = sTop.clone().multiplyScalar(S);
  points.whiteTop = new THREE.Vector3(0, C(2) * S, -10 * S);           // standing on the white step, beside the slide
  // (the game adds a ladder up the back to the white step, so people can climb to the slide; the LEGO model has none)
  const LZ = -12.3, LTOP = C(2);
  points.ladder = { foot: new THREE.Vector3(0, 0, (LZ - 0.7) * S), top: new THREE.Vector3(0, LTOP * S, (LZ + 1.6) * S), x: 0, z: LZ * S };
  if (ladder) {
    for (const x of [-0.75, 0.75]) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.18, LTOP + 2, 0.24), mat(COL.chrome, CHROME)); r.position.set(x, (LTOP + 2) / 2, LZ); r.castShadow = true; sl.add(r); }
    for (let y = 0.9; y < LTOP; y += 1.1) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 6).rotateZ(Math.PI / 2), mat(COL.chrome, CHROME)); r.position.set(0, y, LZ); sl.add(r); }
  }
  if (rider) { const f = personStuds(LOOKS.rider); f.position.set(1.2, C(3), -8.0); f.rotation.y = Math.PI * 0.85; sl.add(f); points.rider = f; }
  for (const k of ['tracks', 'body', 'stage', 'flower', 'parasol', 'slide']) bake(parts[k]);
  M.userData.parts = parts;
  M.userData.points = points;
  M.userData.glow = GLOW;
  M.userData.arms = arms;
  M.userData.petals = petals;
  M.userData.screen = { canvas: scr, tex: scrTex };
  M.userData.drive = (dt, vl, vr) => { left.userData.move(-vl * dt / S); right.userData.move(-vr * dt / S); };
  M.userData.tick = dt => { rotor.rotation.x += dt * 1.6; };
  M.userData.size = { length: 30 * S, width: 16 * S, height: 17 * S };
  M.userData.lego = L;
  return M;
}

// A soft studio light for the machine's metal and paint (a page sets scene.environment with it)
export async function studioEnvironment(renderer) {
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  const pm = new THREE.PMREMGenerator(renderer);
  return pm.fromScene(new RoomEnvironment(), 0.04).texture;
}
