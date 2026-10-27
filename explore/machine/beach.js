// The beach for the bathing-machine game: sand that slopes gently into a clear sea, a row of beach huts, the
// promenade and seaside houses behind, parasols, towels and sandcastles, a buoy line, a boat and some gulls.
// Metres. The sea is to -z, the promenade to +z. ground(x, z) is the height of the sand (or the sea bed); the sea's
// surface is at y = 0.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Static scenery is merged into one mesh with its colours baked in
const MAT = new THREE.MeshLambertMaterial({ vertexColors: true });
const tmpC = new THREE.Color();
function paint(geo, hex) {
  geo = geo.index ? geo.toNonIndexed() : geo;
  for (const k of Object.keys(geo.attributes)) if (k !== 'position' && k !== 'normal') geo.deleteAttribute(k);
  tmpC.set(hex).convertSRGBToLinear();
  const n = geo.attributes.position.count, c = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { c[i * 3] = tmpC.r; c[i * 3 + 1] = tmpC.g; c[i * 3 + 2] = tmpC.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return geo;
}
const at = (geo, x, y, z, rx = 0, ry = 0, rz = 0) => { if (rx || ry || rz) geo.rotateX(rx).rotateY(ry).rotateZ(rz); return geo.translate(x, y, z); };

export const WATER = 0;
export const PROM = 23;                                        // the promenade's edge
export const shoreZ = x => -6 + 1.6 * Math.sin(x * 0.07) + 0.8 * Math.sin(x * 0.19 + 1);
const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
export function ground(x, z) {
  const d = z - shoreZ(x);
  if (z > PROM) return 1.0;
  if (d >= 0) return Math.min(d * 0.035, 0.8) + 0.07 * Math.sin(x * 0.31) * Math.sin(z * 0.27) * smooth(d / 6);
  return Math.max(d * 0.11, -3.4) + 0.04 * Math.sin(x * 0.5 + z * 0.3);
}

export function makeBeach(scene) {
  const B = { meshes: [], update: [] };
  // ---------------------------------------------------------------- sand and sea bed, coloured by height
  {
    const X = 200, Z0 = -70, Z1 = PROM, nx = 125, nz = 58;
    const geo = new THREE.PlaneGeometry(X, Z1 - Z0, nx, nz).rotateX(-Math.PI / 2).translate(0, 0, (Z0 + Z1) / 2);
    const p = geo.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color();
    const dry = new THREE.Color('#f3e2b6'), wet = new THREE.Color('#dcc596'), bed = new THREE.Color('#cdbd8f'), deep = new THREE.Color('#9fb7a6');
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i), y = ground(x, z);
      p.setY(i, y);
      const d = z - shoreZ(x);
      if (d > 2.5) c.copy(dry).lerp(new THREE.Color('#f7e9c4'), smooth((d - 10) / 12) * 0.6);
      else if (d > 0) c.copy(wet).lerp(dry, d / 2.5);
      else c.copy(wet).lerp(bed, smooth(-d / 3)).lerp(deep, smooth((-d - 8) / 20));
      c.convertSRGBToLinear(); col.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.computeVertexNormals();
    const sand = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
    sand.receiveShadow = true; sand.name = 'sand';
    scene.add(sand); B.sand = sand; B.meshes.push(sand);
  }
  // ---------------------------------------------------------------- the sea: little waves, clear in the shallows, foam at the edge
  {
    const X = 200, Z0 = -70, Z1 = 4, nx = 100, nz = 46;
    const geo = new THREE.PlaneGeometry(X, Z1 - Z0, nx, nz).rotateX(-Math.PI / 2).translate(0, 0, (Z0 + Z1) / 2);
    const p = geo.attributes.position, n = p.count;
    const depth = new Float32Array(n), col = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) depth[i] = WATER - ground(p.getX(i), p.getZ(i));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 4));
    const mat = new THREE.MeshPhongMaterial({ vertexColors: true, transparent: true, shininess: 90, specular: '#cfefff', depthWrite: false });
    const sea = new THREE.Mesh(geo, mat); sea.name = 'sea'; sea.renderOrder = 2;
    scene.add(sea); B.sea = sea; B.meshes.push(sea);
    const shallow = new THREE.Color('#9fe6df').convertSRGBToLinear(), mid = new THREE.Color('#47c0cf').convertSRGBToLinear(), far = new THREE.Color('#2a8fbd').convertSRGBToLinear();
    const foam = new THREE.Color('#ffffff').convertSRGBToLinear(), c = new THREE.Color();
    let t = 0;
    B.waveAt = (x, z, tt = t) => 0.05 * Math.sin(x * 0.45 + tt * 1.3) + 0.06 * Math.sin(z * 0.7 + tt * 1.9) + 0.03 * Math.sin((x + z) * 1.1 + tt * 2.7);
    B.update.push(dt => {
      t += dt;
      const surge = Math.sin(t * 0.9);                                    // the water's edge creeps up and back
      for (let i = 0; i < n; i++) {
        const x = p.getX(i), z = p.getZ(i), d = depth[i];
        p.setY(i, WATER + B.waveAt(x, z) * Math.min(1, Math.max(0.15, d / 1.2)) + surge * 0.04);
        c.copy(shallow).lerp(mid, smooth(d / 1.6)).lerp(far, smooth((d - 1.6) / 2.4));
        const f = Math.max(0, 1 - Math.abs(d - 0.12 - surge * 0.08) / 0.2) * (0.6 + 0.4 * Math.sin(x * 0.8 + t * 2));
        c.lerp(foam, Math.min(1, f));
        col[i * 4] = c.r; col[i * 4 + 1] = c.g; col[i * 4 + 2] = c.b;
        col[i * 4 + 3] = Math.min(0.92, 0.32 + d * 0.3 + f * 0.5);
      }
      p.needsUpdate = true; geo.attributes.color.needsUpdate = true;
      geo.computeVertexNormals();
    });
    // the open sea beyond
    const farSea = new THREE.Mesh(new THREE.PlaneGeometry(900, 600).rotateX(-Math.PI / 2).translate(0, -0.02, -370), new THREE.MeshLambertMaterial({ color: '#2f95c0' }));
    scene.add(farSea);
  }
  // ---------------------------------------------------------------- the land behind: promenade, road, houses (one mesh, colours baked in)
  const props = [], windows = [], lamps = [];
  {
    props.push(paint(at(new THREE.BoxGeometry(400, 1.0, 9), 0, 0.5, PROM + 4.5), '#e8e1d4'));            // promenade
    props.push(paint(at(new THREE.BoxGeometry(400, 0.3, 0.6), 0, 1.15, PROM + 0.3), '#d3cabb'));           // its kerb
    props.push(paint(at(new THREE.BoxGeometry(400, 1.0, 8), 0, 0.45, PROM + 13), '#9aa0a8'));            // road
    for (let x = -196; x < 200; x += 8) props.push(paint(at(new THREE.BoxGeometry(3, 1.02, 0.25), x, 0.46, PROM + 13), '#f4f1ea'));
    props.push(paint(at(new THREE.BoxGeometry(400, 1.0, 200), 0, 0.45, PROM + 117), '#cfe3c1'));       // grass beyond
    for (let x = -60; x <= 60; x += 3) {                                                                  // railings
      props.push(paint(at(new THREE.BoxGeometry(0.1, 1.0, 0.1), x, 1.5, PROM + 0.4), '#3f6f9f'));
    }
    props.push(paint(at(new THREE.BoxGeometry(122, 0.1, 0.1), 0, 2.0, PROM + 0.4), '#3f6f9f'));
    props.push(paint(at(new THREE.BoxGeometry(122, 0.08, 0.08), 0, 1.5, PROM + 0.4), '#3f6f9f'));
    const houseCols = ['#f6c8c1', '#bfe2ea', '#fbe3a7', '#cfe8c8', '#e4d3f1', '#f9d6b4', '#ffffff'];
    for (let i = 0, x = -64; x < 64; i++, x += 7.4) {
      const h = 6.5 + (i * 37 % 5) * 0.8, cc = houseCols[i % houseCols.length], z = PROM + 21;
      props.push(paint(at(new THREE.BoxGeometry(7, h, 7), x, 1 + h / 2, z), cc));
      const roof = new THREE.Shape(); roof.moveTo(-3.8, 0); roof.lineTo(3.8, 0); roof.lineTo(0, 2.4);
      props.push(paint(at(new THREE.ExtrudeGeometry(roof, { depth: 7.4, bevelEnabled: false }), x, 1 + h, z - 3.7), i % 2 ? '#8e98a6' : '#c97b63'));
      for (let fy = 2.6; fy < h - 0.5; fy += 2.3) for (const fx of [-2, 0, 2]) windows.push(at(new THREE.BoxGeometry(1.0, 1.2, 0.1), x + fx, 1 + fy, z - 3.52));
    }
    // lamp posts
    for (let x = -54; x <= 54; x += 12) {
      props.push(paint(at(new THREE.CylinderGeometry(0.1, 0.12, 4.2, 6), x, 3.1, PROM + 1.6), '#3f6f9f'));
      lamps.push(at(new THREE.SphereGeometry(0.32, 8, 6), x, 5.3, PROM + 1.6));
    }
  }
  // ---------------------------------------------------------------- beach huts facing the sea
  const hutCols = ['#f4a7b9', '#8fd3e8', '#ffd166', '#9ee0b5', '#c3b1e1', '#ffb38a', '#7fc8f8'];
  B.huts = [];
  for (let i = 0, x = -38.5; x <= 38.5; i++, x += 5.5) {
    const z = 19.6, y = ground(x, z), c = hutCols[i % hutCols.length];
    props.push(paint(at(new THREE.BoxGeometry(3.2, 0.25, 3.0), x, y + 0.12, z), '#c8a978'));            // deck
    props.push(paint(at(new THREE.BoxGeometry(2.5, 2.4, 2.2), x, y + 1.45, z + 0.3), '#ffffff'));
    for (let k = -1; k <= 1; k++) props.push(paint(at(new THREE.BoxGeometry(0.5, 2.4, 2.22), x + k * 0.8, y + 1.45, z + 0.3), c));
    props.push(paint(at(new THREE.BoxGeometry(1.0, 1.8, 0.08), x, y + 1.15, z - 0.82), i % 2 ? '#ffffff' : c));
    const roof = new THREE.Shape(); roof.moveTo(-1.5, 0); roof.lineTo(1.5, 0); roof.lineTo(0, 1.0);
    props.push(paint(at(new THREE.ExtrudeGeometry(roof, { depth: 2.6, bevelEnabled: false }), x, y + 2.65, z - 1.0), '#ffffff'));
    B.huts.push(new THREE.Vector3(x, y, z - 1.6));
  }
  // ---------------------------------------------------------------- parasols, towels, windbreaks, sandcastles, lifeguard flags
  B.towels = [];
  const spots = [[-16, 9, 0], [-9, 13, 1], [10, 11, 2], [17, 7, 3], [-22, 5, 4], [24, 14, 5], [3, 15, 6], [-4, 9, 0]];
  const stripe = ['#ef5b6b', '#2f6fd0', '#ffd23f', '#20a464', '#7b61ff', '#ff8a3d', '#3ec1d3'];
  for (const [x, z, k] of spots) {
    const y = ground(x, z), a = (k * 1.7) % Math.PI;
    if (k % 2 === 0) {
      props.push(paint(at(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 6), x, y + 1.2, z, 0.12, 0, 0), '#ffffff'));
      for (let s = 0; s < 8; s++) {
        const wedge = new THREE.ConeGeometry(1.4, 0.55, 8, 1, true, s * Math.PI / 4, Math.PI / 4);
        props.push(paint(at(wedge, x, y + 2.45, z + 0.14), s % 2 ? '#ffffff' : stripe[k % stripe.length]));
      }
    }
    const tx = x + 1.2, tz = z + 0.3;
    props.push(paint(at(new THREE.BoxGeometry(0.95, 0.03, 2.0), tx, ground(tx, tz) + 0.03, tz, 0, a, 0), stripe[(k + 2) % stripe.length]));
    for (let s = 0; s < 4; s++) props.push(paint(at(new THREE.BoxGeometry(0.95, 0.035, 0.22), tx, ground(tx, tz) + 0.045, tz, 0, a, 0).translate(0, 0, 0), '#ffffff'));
    B.towels.push({ x: tx, z: tz, a });
  }
  for (const [x, z] of [[6, 4], [-12, 3.5], [20, 2.5]]) {                                                  // sandcastles
    const y = ground(x, z);
    props.push(paint(at(new THREE.BoxGeometry(1.2, 0.5, 1.2), x, y + 0.25, z), '#e8c98a'));
    for (const [dx, dz] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) props.push(paint(at(new THREE.CylinderGeometry(0.24, 0.28, 0.8, 8), x + dx, y + 0.4, z + dz), '#e3c07f'));
    props.push(paint(at(new THREE.CylinderGeometry(0.32, 0.4, 0.9, 8), x, y + 0.95, z), '#e8c98a'));
    props.push(paint(at(new THREE.BoxGeometry(0.03, 0.5, 0.03), x, y + 1.6, z), '#ffffff'));
    props.push(paint(at(new THREE.BoxGeometry(0.35, 0.22, 0.02), x + 0.18, y + 1.75, z), '#ef5b6b'));
  }
  for (const x of [-14, 14]) {                                                                               // lifeguard flags
    const z = shoreZ(x) + 3, y = ground(x, z);
    props.push(paint(at(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 6), x, y + 1.6, z), '#ffffff'));
    props.push(paint(at(new THREE.BoxGeometry(1.1, 0.35, 0.03), x + 0.58, y + 2.95, z), '#ef3b3b'));
    props.push(paint(at(new THREE.BoxGeometry(1.1, 0.35, 0.03), x + 0.58, y + 2.6, z), '#ffd23f'));
  }
  {                                                                                                           // ice cream kiosk on the promenade
    const x = 9, z = PROM + 3.4;
    props.push(paint(at(new THREE.BoxGeometry(3.2, 2.4, 2.2), x, 2.2, z), '#ffffff'));
    for (let k = 0; k < 6; k++) props.push(paint(at(new THREE.BoxGeometry(0.54, 0.6, 2.4), x - 1.35 + k * 0.54, 3.7, z - 0.1), k % 2 ? '#ffffff' : '#ff9ec7'));
    props.push(paint(at(new THREE.BoxGeometry(2.4, 0.9, 0.1), x, 2.4, z - 1.12), '#5b7ea3'));
    props.push(paint(at(new THREE.SphereGeometry(0.5, 10, 8), x, 4.6, z), '#ffd8a8'));
  }
  // windows and lamps light up at night (setNight)
  const winMat = new THREE.MeshStandardMaterial({ color: '#5b7ea3', emissive: '#ffd27a', emissiveIntensity: 0, roughness: 0.4 });
  const lampMat = new THREE.MeshStandardMaterial({ color: '#fff3c4', emissive: '#ffcf70', emissiveIntensity: 0.2, roughness: 0.4 });
  const strip = g => { g = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k); return g; };
  scene.add(new THREE.Mesh(mergeGeometries(windows.map(strip)), winMat), new THREE.Mesh(mergeGeometries(lamps.map(strip)), lampMat));
  B.setNight = k => { winMat.emissiveIntensity = k * 1.4; winMat.color.set(k > 0.5 ? '#3b4a60' : '#5b7ea3'); lampMat.emissiveIntensity = 0.2 + k * 2.4; };
  const propMesh = new THREE.Mesh(mergeGeometries(props), MAT);
  propMesh.castShadow = true; propMesh.receiveShadow = true; propMesh.name = 'props';
  scene.add(propMesh);
  // ---------------------------------------------------------------- things that move: buoys, a boat, gulls
  const bob = [];
  const buoys = new THREE.InstancedMesh(new THREE.SphereGeometry(0.35, 10, 8), new THREE.MeshLambertMaterial({ color: '#ffffff' }), 13);
  for (let i = 0; i < 13; i++) buoys.setColorAt(i, new THREE.Color(i % 2 ? '#ffd23f' : '#ff8a3d'));
  scene.add(buoys);
  {
    const boat = new THREE.Group();
    const hull = new THREE.Shape(); hull.moveTo(-1.9, 0.6); hull.lineTo(1.9, 0.6); hull.lineTo(1.3, -0.1); hull.lineTo(-1.5, -0.1);
    const h = new THREE.Mesh(new THREE.ExtrudeGeometry(hull, { depth: 1.4, bevelEnabled: false }).translate(0, 0, -0.7), new THREE.MeshLambertMaterial({ color: '#ffffff' }));
    const band = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.15, 1.44), new THREE.MeshLambertMaterial({ color: '#ef5b6b' })); band.position.y = 0.45;
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 6), new THREE.MeshLambertMaterial({ color: '#c8a978' })); mast.position.y = 2.1;
    const sailS = new THREE.Shape(); sailS.moveTo(0, 0); sailS.lineTo(1.6, 0); sailS.lineTo(0, 2.6);
    const sail = new THREE.Mesh(new THREE.ShapeGeometry(sailS), new THREE.MeshLambertMaterial({ color: '#fff6e0', side: THREE.DoubleSide })); sail.position.set(0.05, 0.75, 0);
    boat.add(h, band, mast, sail); boat.position.set(-24, 0, -30); boat.rotation.y = 0.6;
    boat.traverse(o => { if (o.isMesh) o.castShadow = true; });
    scene.add(boat); bob.push(boat);
  }
  const gulls = [];
  for (let i = 0; i < 4; i++) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(mergeGeometries([paint(new THREE.SphereGeometry(0.22, 8, 6).scale(1, 0.8, 2.0), '#ffffff'), paint(new THREE.SphereGeometry(0.13, 8, 6).translate(0, 0.1, 0.42), '#ffffff'),
      paint(new THREE.ConeGeometry(0.04, 0.16, 5).rotateX(Math.PI / 2).translate(0, 0.08, 0.6), '#ffb000')]), MAT));
    for (const s of [-1, 1]) {
      const w = new THREE.Mesh(mergeGeometries([paint(new THREE.BoxGeometry(0.7, 0.03, 0.3).translate(s * 0.35, 0, 0), '#ffffff'), paint(new THREE.BoxGeometry(0.4, 0.03, 0.22).translate(s * 0.9, 0, -0.03), '#4a4f58')]), MAT);
      w.position.set(s * 0.15, 0.05, 0); g.add(w); g.userData[s < 0 ? 'wl' : 'wr'] = w;
    }
    g.userData.r = 10 + i * 4; g.userData.c = new THREE.Vector3(-10 + i * 7, 9 + i * 1.3, -8 - i * 3); g.userData.a = i * 1.7; g.userData.w = 0.25 + i * 0.04;
    g.scale.setScalar(0.6); scene.add(g); gulls.push(g);
  }
  let tt = 0; const bm4 = new THREE.Matrix4();
  B.update.push(dt => {
    tt += dt;
    bob.forEach((m, i) => { m.position.y = B.waveAt?.(m.position.x, m.position.z, tt) || 0; m.rotation.z = Math.sin(tt * 1.4 + i) * 0.08; });
    for (let i = 0; i < 13; i++) { const x = -18 + i * 3; bm4.makeTranslation(x, 0.05 + (B.waveAt?.(x, -26, tt) || 0), -26); buoys.setMatrixAt(i, bm4); }
    buoys.instanceMatrix.needsUpdate = true;
    for (const g of gulls) {
      const u = g.userData; u.a += u.w * dt;
      g.position.set(u.c.x + Math.cos(u.a) * u.r, u.c.y + Math.sin(u.a * 2) * 0.5, u.c.z + Math.sin(u.a) * u.r);
      g.rotation.y = -u.a; g.rotation.z = 0.25;
      const f = Math.sin(tt * 7 + u.a * 3) * 0.5;
      u.wl.rotation.z = f; u.wr.rotation.z = -f;
    }
  });
  B.tick = dt => { for (const fn of B.update) fn(dt); };
  return B;
}
