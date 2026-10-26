// Paper nets in 3D. The printed cut-out pieces lie flat on the ground, fold up along their hinges and land on the model,
// so a child can watch the net become the school. The same numbers make the virtual fold test (dev/fold-test.html and
// foldTest below): fold every piece fully and check that every corner lands on the model, every lettered pair of edges
// meets, and every glue tab lies flat inside the face it glues to.
//
// Nets come from tools/paper/unfold.py (assets/models/<model>-nets.json): pieces of faces in millimetres on the paper,
// y up, the printed side facing +z, each face hinged to its parent with a signed angle (+ folds away from the printed
// side). The model is in feet or metres (nets.unit_mm), Blender z up; the glTF and this scene are y up, so
// (x, y, z) -> (x, z, -y).
import * as THREE from 'three';

const AXES = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);   // Blender z up -> three y up

function hingeMatrix(a, b, angle) {
  const axis = new THREE.Vector3(b[0] - a[0], b[1] - a[1], 0).normalize();
  const m = new THREE.Matrix4().makeTranslation(a[0], a[1], 0);
  m.multiply(new THREE.Matrix4().makeRotationAxis(axis, angle));
  m.multiply(new THREE.Matrix4().makeTranslation(-a[0], -a[1], 0));
  return m;
}

function frameMatrix(fr) {                                   // net (root face) -> model, in mm
  const [o, u, v, n] = fr;
  return new THREE.Matrix4().set(u[0], v[0], n[0], o[0], u[1], v[1], n[1], o[1], u[2], v[2], n[2], o[2], 0, 0, 0, 1);
}

// world matrices of every face of a piece, folded by k (0 flat, 1 shut), in net space (root flat on z = 0)
function chain(piece, k) {
  const W = {}, byF = {};
  for (const f of piece.faces) byF[f.f] = f;
  for (const f of [...piece.faces].sort((a, b) => a.depth - b.depth)) {
    if (f.parent === null) { W[f.f] = new THREE.Matrix4(); continue; }
    const p = byF[f.parent];
    const a = p.pts[f.hinge[0]], b = p.pts[f.hinge[1]];
    W[f.f] = W[f.parent].clone().multiply(hingeMatrix(a, b, f.angle * k));
  }
  return W;
}

// ---------------------------------------------------------------- the virtual fold test
export function foldTest(nets, tol = 0.5) {
  const report = [];
  for (const s of nets.solids) {
    const at = {};                                           // face -> folded corners on the model (mm)
    let vErr = 0, gap = 0, lift = 0, outside = 0;
    const tabsFolded = [];
    for (const pc of s.pieces) {
      const W = chain(pc, 1), R = frameMatrix(s.frames[pc.root]);
      const byF = {};
      for (const f of pc.faces) {
        byF[f.f] = f;
        const M = R.clone().multiply(W[f.f]);
        at[f.f] = f.pts.map(p => new THREE.Vector3(p[0], p[1], 0).applyMatrix4(M));
      }
      for (const t of pc.tabs) {
        if (!t.partner) continue;
        const f = byF[t.face], n = f.pts.length;
        const a = f.pts[t.edge], b = f.pts[(t.edge + 1) % n];
        const M = R.clone().multiply(W[t.face]).multiply(hingeMatrix(a, b, t.angle));
        tabsFolded.push({ t, pts: t.poly.map(p => new THREE.Vector3(p[0], p[1], 0).applyMatrix4(M)) });
      }
    }
    // 1. every corner lands where the model has it
    for (const [fi, pts] of Object.entries(at)) pts.forEach((p, i) => { vErr = Math.max(vErr, p.distanceTo(new THREE.Vector3(...s.V[s.F[fi][i]]))); });
    // 2. every lettered pair meets, end to end
    for (const [[fa, ja], [fb, jb]] of s.pairs) {
      const na = s.F[fa].length, nb = s.F[fb].length;
      gap = Math.max(gap, at[fa][ja].distanceTo(at[fb][(jb + 1) % nb]), at[fa][(ja + 1) % na].distanceTo(at[fb][jb]));
    }
    // 3. every tab lies on the inside of its partner face, within its edges
    for (const { t, pts } of tabsFolded) {
      const [o, u, v, n] = s.frames[t.partner[0]].map(a => new THREE.Vector3(...a));
      const poly = s.F[t.partner[0]].map(i => { const d = new THREE.Vector3(...s.V[i]).sub(o); return [d.dot(u), d.dot(v)]; });
      for (const p of pts) {
        const d = p.clone().sub(o);
        lift = Math.max(lift, Math.abs(d.dot(n)));
        if (!inPoly(poly, [d.dot(u), d.dot(v)], 0.3)) outside++;
      }
    }
    const ok = vErr < tol && gap < tol && lift < tol && outside === 0;
    report.push({ solid: s.name, pieces: s.pieces.length, faces: s.F.length, pairs: s.pairs.length, tabs: tabsFolded.length, vErr, gap, lift, outside, ok });
  }
  return { ok: report.every(r => r.ok), solids: report };
}

function inPoly(poly, p, tol) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1] + 1e-12) + a[0]) c = !c;
  }
  if (c) return true;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
    const t = L2 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2)) : 0;
    if (Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy) <= tol) return true;
  }
  return false;
}

// ---------------------------------------------------------------- the paper model in the scene
// new PaperFold(scene, nets, { tex: '../assets/paper/wrenbury/', solids: ['walls', 'roof'], flat: [x, z], spin: 0 })
// .play() lays the pieces out flat and folds them onto the model one by one; .tick(dt); .hide().
export class PaperFold {
  constructor(scene, nets, opt = {}) {
    this.nets = nets;
    this.k = (nets.unit_mm || 304.8) / nets.scale;           // paper mm per model unit (feet or metres)
    this.group = new THREE.Group();
    this.group.visible = false;
    scene.add(this.group);
    this.pieces = [];
    const loader = new THREE.TextureLoader();
    const texCache = {};
    const tex = name => texCache[name] || (texCache[name] = (() => {
      const t = loader.load(opt.tex + name.replace(/\.png$/, '.jpg'));
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      return t;
    })());
    const back = new THREE.MeshLambertMaterial({ color: '#f4efe6', side: THREE.BackSide });
    const tabMat = new THREE.MeshLambertMaterial({ color: '#e6dfd2', side: THREE.DoubleSide });
    const want = opt.solids ? new Set(opt.solids) : null;
    const S = 1 / this.k;
    for (const s of nets.solids) {
      if (want && !want.has(s.name)) continue;
      for (const pc of s.pieces) {
        const root = new THREE.Group();
        root.matrixAutoUpdate = false;
        this.group.add(root);
        const nodes = {}, byF = {};
        for (const f of pc.faces) byF[f.f] = f;
        // each face hangs from its parent at the start of their shared edge, turning about that edge
        for (const f of [...pc.faces].sort((a, b) => a.depth - b.depth)) {
          const g = new THREE.Group();
          let origin = [0, 0];
          if (f.parent === null) root.add(g);
          else {
            const p = byF[f.parent], po = nodes[f.parent].origin;
            origin = p.pts[f.hinge[0]];
            const b = p.pts[f.hinge[1]];
            g.position.set(origin[0] - po[0], origin[1] - po[1], 0);
            g.userData.axis = new THREE.Vector3(b[0] - origin[0], b[1] - origin[1], 0).normalize();
            g.userData.angle = f.angle;
            nodes[f.parent].g.add(g);
          }
          nodes[f.f] = { g, origin };
          const shape = new THREE.Shape(f.pts.map(p => new THREE.Vector2(p[0] - origin[0], p[1] - origin[1])));
          const geo = new THREE.ShapeGeometry(shape);
          if (f.tex) {
            // uv: net -> the face's own frame -> its picture box
            const [c, s_, tx, ty] = f.xf, [u0, v0, u1, v1] = f.texbox;
            const pos = geo.attributes.position, uv = new Float32Array(pos.count * 2);
            for (let i = 0; i < pos.count; i++) {
              const x = pos.getX(i) + origin[0] - tx, y = pos.getY(i) + origin[1] - ty;
              const lu = c * x + s_ * y, lv = -s_ * x + c * y;
              uv[2 * i] = (lu - u0) / (u1 - u0); uv[2 * i + 1] = (lv - v0) / (v1 - v0);
            }
            geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
          }
          const front = new THREE.Mesh(geo, f.tex ? new THREE.MeshLambertMaterial({ map: tex(f.tex), side: THREE.FrontSide }) : new THREE.MeshLambertMaterial({ color: s.colour || '#fbf8f2' }));
          const rear = new THREE.Mesh(geo, back);
          front.castShadow = rear.castShadow = true;
          g.add(front, rear);
        }
        // tabs fold too, onto the inside of their partner faces
        for (const t of pc.tabs) {
          const f = byF[t.face], o = nodes[t.face].origin, n = f.pts.length;
          const a = f.pts[t.edge], b = f.pts[(t.edge + 1) % n];
          const tg = new THREE.Group();
          tg.position.set(a[0] - o[0], a[1] - o[1], 0);
          tg.userData.axis = new THREE.Vector3(b[0] - a[0], b[1] - a[1], 0).normalize();
          tg.userData.angle = t.angle;
          const sh = new THREE.Shape(t.poly.map(p => new THREE.Vector2(p[0] - a[0], p[1] - a[1])));
          tg.add(new THREE.Mesh(new THREE.ShapeGeometry(sh), tabMat));
          nodes[t.face].g.add(tg);
        }
        // where it ends up: on the model; where it starts: flat on the ground, printed side up
        const fin = new THREE.Matrix4().makeScale(S, S, S).premultiply(AXES.clone()).multiply(frameMatrix(s.frames[pc.root]));
        const pts = pc.faces.flatMap(f => f.pts);
        const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        const size = [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
        const mid = [(Math.max(...xs) + Math.min(...xs)) / 2, (Math.max(...ys) + Math.min(...ys)) / 2];
        this.pieces.push({ solid: s.name, step: s.step || 0, root, nodes, fin, size, mid, flat: null, k: 0, m: 0 });
      }
    }
    this.pieces.sort((a, b) => a.step - b.step);
    if (opt.onsite) this.layoutOnSite(opt.lift || 0.05); else this.layout(opt.flat || [0, 0], opt.spin || 0, opt.lift || 0.02);
    this.gap = opt.gap || 1.5;
    this.t = 0; this.playing = false;
  }

  // lay the pieces out on the ground in rows, like the printed sheets, around (x, z), turned by spin
  layout(at, spin, lift) {
    const S = 1 / this.k, gap = 6;
    const rowW = Math.max(220, Math.sqrt(this.pieces.reduce((a, p) => a + (p.size[0] + gap) * (p.size[1] + gap), 0)) * 1.25);
    let x = 0, y = 0, row = 0;
    const spots = [];
    for (const p of this.pieces) {
      if (x + p.size[0] > rowW && x > 0) { x = 0; y += row + gap; row = 0; }
      spots.push([x + p.size[0] / 2, y + p.size[1] / 2]);
      x += p.size[0] + gap; row = Math.max(row, p.size[1]);
    }
    const W = Math.max(...spots.map((s, i) => s[0] + this.pieces[i].size[0] / 2)), H = y + row;
    this.pieces.forEach((p, i) => {
      const cx = (spots[i][0] - W / 2) * S, cz = (spots[i][1] - H / 2) * S;
      const c = Math.cos(spin), s = Math.sin(spin);
      const m = new THREE.Matrix4().makeTranslation(at[0] + c * cx + s * cz, lift, at[1] - s * cx + c * cz);
      m.multiply(new THREE.Matrix4().makeRotationY(spin));
      m.multiply(AXES.clone().multiply(new THREE.Matrix4().makeScale(S, S, S)));
      m.multiply(new THREE.Matrix4().makeTranslation(-p.mid[0], -p.mid[1], 0));
      p.flat = m;
    });
  }

  // each piece lies flat on the ground under the place it goes, printed side up, ready to fold up into it
  layoutOnSite(lift) {
    const S = 1 / this.k;
    for (const p of this.pieces) {
      const c = new THREE.Vector3(p.mid[0], p.mid[1], 0).applyMatrix4(p.fin);
      const m = new THREE.Matrix4().makeTranslation(c.x, lift, c.z);
      m.multiply(AXES.clone().multiply(new THREE.Matrix4().makeScale(S, S, S)));
      m.multiply(new THREE.Matrix4().makeTranslation(-p.mid[0], -p.mid[1], 0));
      p.flat = m;
    }
  }

  set(p, k, m) {                                             // k: how folded (0..1), m: how far from flat to its place
    p.k = k; p.m = m;
    const apply = g => { for (const c of g.children) if (c.isGroup) { if (c.userData.axis) c.quaternion.setFromAxisAngle(c.userData.axis, c.userData.angle * k); apply(c); } };
    apply(p.root);
    const a = new THREE.Vector3(), b = new THREE.Vector3(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), sa = new THREE.Vector3(), sb = new THREE.Vector3();
    p.flat.decompose(a, qa, sa); p.fin.decompose(b, qb, sb);
    // rise a little on the way, so pieces never pass through each other
    const pos = a.lerp(b, m); pos.y += Math.sin(Math.PI * m) * 2.5;
    p.root.matrix.compose(pos, qa.slerp(qb, m), sa.lerp(sb, m));
    p.root.matrixWorldNeedsUpdate = true;
  }

  show(k = 0, m = 0) { this.group.visible = true; for (const p of this.pieces) this.set(p, k, m); }
  hide() { this.group.visible = false; this.playing = false; }
  play() { this.show(0, 0); for (const p of this.pieces) p.root.visible = false; this.t = -0.4; this.playing = true; }
  get done() { return !this.playing && this.group.visible; }

  // each piece folds for 1.6 s, then rises to its place for 1.3 s; the next starts `gap` seconds after
  tick(dt) {
    if (!this.playing) return;
    this.t += dt;
    const ease = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
    let all = true;
    this.pieces.forEach((p, i) => {
      const t0 = i * this.gap;
      p.root.visible = this.t >= t0 - 0.3;                     // a piece appears, flat, just before its turn
      const k = ease((this.t - t0) / 1.6), m = ease((this.t - t0 - 1.2) / 1.3);
      if (m < 1) all = false;
      this.set(p, k, m);
    });
    if (all) { this.playing = false; this.onDone?.(); }
  }
}
