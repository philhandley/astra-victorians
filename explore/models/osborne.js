// Queen Victoria's bathing machine at Osborne: words, photos, finds, the winch, the cutaway and the swim.
// Model: tools/blender/osborne.py. People are rigged (Body in look-fx.js): the bather walks down the steps, wades
// along the drowned slipway, swims breaststroke, treads water while the dipper dunks her, and climbs back in; the
// winch man turns the handle; the child waves and jumps; the dipper beckons.
// Debug URL params: ?winch=0..1 starts the machine part way down; ?curtains opens them; ?swim=steps|swim|dunk
// freezes the bather at that point (with the machine in the sea).
import { icon, along } from '../look-fx.js';

const EHB = { name: 'English Heritage: five ways to have beach fun like Queen Victoria', url: 'https://www.english-heritage.org.uk/visit/inspire-me/blog/blog-posts/five-ways-beach-fun-like-queen-victoria/' };
const HE = { name: 'Historic England Archive: reconstruction of the bathing machine on its slipway (IC076/002)', url: 'https://historicengland.org.uk/images-books/photos/item/IC076/002' };
const EMS = { name: 'Emsworth Museum: Bathing belles and bathing machines', url: 'https://emsworthmuseum.org.uk/emcms/files/original/021849c92f68b6c062c471f2e3cf6335.pdf' };
const VW = { name: 'The Victorian Web: Queen Victoria and her bathing machine', url: 'https://www.victorianweb.org/victorian/history/victoria/7.html' };
const PHOTO = { name: 'Photographs of the restored machine (Wikimedia Commons)', url: 'https://commons.wikimedia.org/wiki/File:Queen_Victoria%27s_Bathing_Machine_in_Osborne_Bay_-_geograph.org.uk_-_5626680.jpg' };
const Q = new URLSearchParams(location.search);
const S = { p: 0, goal: 0, hold: 0, curtains: Q.has('curtains'), swim: null };
// the photo views: the camera turned to where each photographer stood, looking at the machine at the top of the beach
const AT = [-2.0, 0, 2.3];
const toBeach = () => S.toBeach?.();

export default {
  id: 'osborne', name: 'Queen Victoria\'s bathing machine', model: '../assets/models/osborne.glb', back: '../tasks/bathing-machine.html',
  eyebrow: 'Astra Victorians · Osborne · 1840s', title: ['The Queen\'s', 'bathing machine.'],
  blurb: 'A beach hut on wheels, so the Queen could change and step into the sea without anyone on the beach seeing her. Drawn at its real size: 12 feet long.',
  say: 'Queen Victoria\'s bathing machine, at Osborne on the Isle of Wight. It was a beach hut on wheels that ran on stone rails. Wind the winch to roll it down into the sea, then go for a swim!',
  label: 'A 3D model of Queen Victoria\'s bathing machine: a green hut with a cream veranda and white steps on four big wheels, standing on grooved stone rails on a stone slipway that runs down a sandy beach into a see-through sea, with a hand winch at the top.',
  loading: 'Wheeling out the machine…', unit: 0.3, smoke: 1, sparkle: 1.2,
  tabs: [
    { href: 'victorian-school.html', label: 'Tiny school', icon: 'school' },
    { href: 'wrenbury-school.html', label: 'Our school', icon: 'big' },
    { href: 'bathing-machine.html', label: 'Bathing machine', icon: 'hut', on: true },
  ],
  nudge: [0.12, 0.07], doFirst: true,
  views: { home: { az: -32, el: 23, zoom: 0.92 }, real: { az: -28, el: 9, zoom: 1.6, targetB: AT } },
  // the cutaway: sliced 93 cm above the machine's floor, in the machine's own (tilted) frame (just under the towel,
  // whose bottom edge at 1 m would flicker on the cut)
  cut: { z: 1.93, frame: 'rig_machine', noLine: ['curtain_'], el: 46 },
  real: [
    { tab: '2012', img: '../assets/img/osborne-bathing-machine.jpg', cap: 'The Queen\'s own bathing machine, mended and standing by the beach at Osborne.', credit: 'grumpylumixuser, 2012, CC BY 3.0, via Wikimedia Commons.', by: 'Photo: grumpylumixuser · CC BY 3.0', view: 'real', run: toBeach },
    { tab: 'Side', img: '../assets/img/osborne-machine-side.jpg', cap: 'From the side: the green changing room, the cream veranda and the curly iron brackets holding up the canopy.', credit: 'Steve Daniels, 2017, CC BY-SA 2.0, via Wikimedia Commons (Geograph).', by: 'Photo: Steve Daniels · CC BY-SA 2.0', view: { az: 76, el: 7, zoom: 1.45, targetB: AT }, run: toBeach },
    { tab: 'Front', img: '../assets/img/osborne-machine-front.jpg', cap: 'From the front: the veranda the Queen stepped out of, and the steps she walked down into the sea.', credit: 'Steve Daniels, 2017, CC BY-SA 2.0, via Wikimedia Commons (Geograph).', by: 'Photo: Steve Daniels · CC BY-SA 2.0', view: { az: 0, el: 7, zoom: 1.7, targetB: AT }, run: toBeach },
    { tab: 'Corner', img: '../assets/img/osborne-machine-corner.jpg', cap: 'From the front corner. Look for the iron scrolls under the roof.', credit: 'Steve Daniels, 2017, CC BY-SA 2.0, via Wikimedia Commons (Geograph).', by: 'Photo: Steve Daniels · CC BY-SA 2.0', view: { az: -42, el: 10, zoom: 1.5, targetB: AT }, run: toBeach },
    { tab: '2022', img: '../assets/img/osborne-machine-2022.jpg', cap: 'On its stone bed above Osborne beach in 2022.', credit: 'Roger Cornfoot, 2022, CC BY-SA 2.0, via Wikimedia Commons (Geograph).', by: 'Photo: Roger Cornfoot · CC BY-SA 2.0', view: { az: 52, el: 11, zoom: 1.4, targetB: AT }, run: toBeach },
    { tab: '1889', img: '../assets/img/bathing-machines.jpg', cap: 'Ordinary bathing machines at Shanklin, Isle of Wight, in 1889. Most were pulled into the sea by a horse.', credit: 'Henry Pauw van Wieldrecht (Rijksmuseum), 1889, CC0, via Wikimedia Commons.', by: 'Rijksmuseum, 1889 · CC0', view: 'home', match: 'Back to the whole beach' },
  ],
  stats: [['12 ft', 'long: as long as a small car'], ['4', 'big wheels on stone rails'], ['5', 'steps down into the sea']],
  parts: [
    { key: 'wheels', short: 'Wheels', title: 'Four big wheels', text: ['Four tall wheels with flat iron tyres. They ran in grooves cut in stone rails, so the machine could not roll off the slipway.', 'Each wheel is about as tall as you are.'], src: EHB },
    { key: 'axles', short: 'Frame', title: 'The iron frame', text: ['Two iron axles and a strong iron frame carry the hut. The floor is a big step up from the ground.'], src: PHOTO },
    { key: 'room', short: 'Changing room', title: 'The changing room', text: ['A little room with dark green wooden walls, where the Queen changed into her bathing dress. It had silver handles on the door and the window.'], src: EMS },
    { key: 'veranda', short: 'Veranda', title: 'The curtained veranda', text: ['At the sea end is a cream porch with curtains. The Queen stepped out behind them, so nobody on the beach could see her.', 'Curly iron brackets on the corner posts hold up a deep roof over the steps.'], think: 'Press "Open the curtains".', src: VW },
    { key: 'steps', short: 'Steps', title: 'Steps into the sea', text: ['Five white steps lead down into the water. When the machine was let down, the bottom steps were under the sea.'], think: 'How many steps are under the water now?', src: EHB },
    { key: 'roof', short: 'Roof', title: 'The roof', text: ['A teal roof sloping down on all four sides, laid in overlapping rows, with a deep canopy over the steps to keep off the sun and the rain.'], src: PHOTO },
    { key: 'loo', short: 'The loo', title: 'The Queen\'s loo', inside: true, text: ['Inside is a real toilet, plumbed in with pipes, and a bench to sit on. Very posh for a beach hut!'], think: 'What would you put inside yours?', src: EHB },
    { key: 'winch', short: 'Winch and rails', title: 'Stone rails and a winch', text: ['No horse for the Queen. Her machine ran on grooved stone rails down a stone slipway into the sea.', 'A man turned the handle of a winch at the top. Its wire rope let the machine down, then wound it back up.'], think: 'Drag the winch handle to try it!', src: HE },
    { key: 'people', short: 'Bather and dipper', title: 'A bather and a dipper', text: ['A bather goes down the steps in a bathing dress and cap. In the sea, a strong helper called a dipper waits to help her in, and sometimes to dunk her under!'], think: 'Press "Go for a swim!"', src: EMS },
  ],
  finds: [
    { q: 'Can you find the child watching from the beach?', it: 'the child on the beach', targets: ['child_root'] },
    { q: 'Can you find the dipper waiting in the sea?', it: 'the dipper', targets: ['dipper_root'], hint: 'Look at the bottom of the slipway.' },
    { q: 'Can you find the man who turns the winch?', it: 'the winch man', targets: ['winchman_root'], hint: 'He is at the top of the slipway.' },
    { q: 'Can you find the Queen\'s loo?', it: 'the Queen\'s loo', targets: ['part_loo'], hint: 'Lift the roof, or cut it open, to look inside.' },
  ],
  specs: [
    ['Size', '12 ft × 7 ft', 'the real length and width (Emsworth Museum)'],
    ['Inside', 'A changing room and a plumbed-in water closet', 'English Heritage; silver door and window handles (Emsworth Museum)'],
    ['Veranda', 'Curtained, with a deep canopy over the steps', 'The Victorian Web; Emsworth Museum; brackets and colours from the photographs'],
    ['Moved by', 'A winch and wire rope, on grooved stone rails', 'Historic England Archive: "ran on special grooved stone rails"; English Heritage: "a concrete pier with grooves to guide the wheels"'],
    ['First dip', '30 July 1847', 'Historic England Archive; Queen Victoria\'s journal, via the Victorian Web'],
    ['Heights and wheels', 'Measured by eye from the photographs', 'the same sizes as the drawing sheet in the printables'],
  ],
  foot: `<p>The length and width are the real 12 feet by 7 feet. Everything else follows photographs of the restored machine on Wikimedia Commons (grumpylumixuser 2012, CC BY 3.0; Steve Daniels 2017 and Roger Cornfoot 2022, CC BY-SA 2.0) and the descriptions from English Heritage, the Emsworth Museum and the Victorian Web. How it moved comes from the <a href="${HE.url}" target="_blank" rel="noopener">Historic England Archive</a> ("lowered into the ocean by a winch and cable, and ran on special grooved stone rails") and <a href="${EHB.url}" target="_blank" rel="noopener">English Heritage</a> ("pushed into the water down a concrete pier with grooves to guide the wheels", "pulled back by a wire rope on a winch"). Our guesses: the slipway's height and slope, the size of the rails, the look of the winch, the beach, the groyne and the gulls, the furniture inside apart from the loo, and how the people are dressed.</p>`,

  widget(ctx, host) {
    host.innerHTML = `<div class="lk-winch">
      <p class="lk-winch-st" aria-live="polite">${icon('hut')}<span>On the beach</span></p>
      <div class="lk-track" role="slider" aria-label="Wind the machine down to the sea" aria-valuemin="0" aria-valuemax="100" tabindex="0">
        <em class="l">Beach</em><em class="r">Sea</em>
        <div class="lk-knob"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="9" fill="none" stroke="#23201c" stroke-width="3"/><g class="crank"><path d="M20 20 L20 6" stroke="#23201c" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="6" r="4" fill="#e8622c"/></g></svg></div>
      </div>
      <div class="lk-winch-btns">
        <button class="lk-act" type="button" data-w="1">${icon('down')}<span>Wind down</span></button>
        <button class="lk-act" type="button" data-w="-1">${icon('up')}<span>Wind up</span></button>
      </div>
    </div>`;
    const track = host.querySelector('.lk-track'), knob = host.querySelector('.lk-knob'), crank = host.querySelector('.crank'), st = host.querySelector('.lk-winch-st');
    let shown = '';
    const locked = () => !!S.swim;
    const fromX = x => { const r = track.getBoundingClientRect(); return ctx.clamp((x - r.left - 26) / (r.width - 52), 0, 1); };
    let drag = false;
    track.addEventListener('pointerdown', e => { if (locked()) return; drag = true; track.setPointerCapture(e.pointerId); S.goal = fromX(e.clientX); });
    track.addEventListener('pointermove', e => { if (drag) S.goal = fromX(e.clientX); });
    const stop = () => { drag = false; };
    track.addEventListener('pointerup', stop); track.addEventListener('pointercancel', stop);
    track.addEventListener('keydown', e => { if (locked()) return; if (e.key === 'ArrowRight') S.goal = Math.min(1, S.goal + 0.1); if (e.key === 'ArrowLeft') S.goal = Math.max(0, S.goal - 0.1); });
    host.querySelectorAll('[data-w]').forEach(b => {
      let t0 = 0;
      b.addEventListener('pointerdown', () => { if (locked()) return; t0 = performance.now(); S.hold = +b.dataset.w; });
      const up = () => { if (!S.hold) return; if (performance.now() - t0 < 280) S.goal = S.hold > 0 ? 1 : 0; S.hold = 0; };
      b.addEventListener('pointerup', up); b.addEventListener('pointerleave', up); b.addEventListener('pointercancel', up);
    });
    S.ui = (p, moving, under) => {
      const r = track.getBoundingClientRect();
      knob.style.left = (26 + p * (r.width - 52)) + 'px';
      crank.setAttribute('transform', `rotate(${(p * 1440).toFixed(1)} 20 20)`);
      track.setAttribute('aria-valuenow', Math.round(p * 100));
      let text, ic = 'hut';
      if (S.swim) { text = 'Swimming! Wait for her to come back.'; ic = 'swim'; }
      else if (moving) { text = S.goal > S.p ? 'Rolling down to the sea…' : 'Winding back up the beach…'; ic = S.goal > S.p ? 'down' : 'up'; }
      else if (p < 0.01) text = 'On the beach';
      else if (p > 0.99) { text = `In the sea! ${under} ${under === 1 ? 'step' : 'steps'} under the water`; ic = 'wave'; }
      else { text = under ? `${under} ${under === 1 ? 'step' : 'steps'} in the water` : 'Part way down the beach'; ic = under ? 'wave' : 'hut'; }
      if (text + ic !== shown) {
        shown = text + ic;
        st.innerHTML = `${icon(ic)}<span>${text}</span>`;
        st.classList.toggle('sea', ic === 'wave' || ic === 'swim');
      }
    };
    return { refresh() {} };
  },

  actions(ctx) {
    return [
      { icon: 'curtain', label: 'Open the curtains', labelOn: 'Close the curtains', on: () => S.curtains, run: () => { S.curtains = !S.curtains; ctx.sound.whoosh(); } },
      { icon: 'swim', label: 'Go for a swim!', disabled: () => S.p < 0.99 || !!S.swim, run: () => S.startSwim() },
      { icon: 'lift', iconOn: 'roof', label: 'Lift the roof', labelOn: 'Put the roof on', on: () => ctx.state === 'inside', run: () => ctx.setState(ctx.state === 'inside' ? 'whole' : 'inside') },
      { icon: 'cut', iconOn: 'together', label: 'Cut it open', labelOn: 'Put it back', on: () => ctx.state === 'cut', run: () => ctx.setState(ctx.state === 'cut' ? 'whole' : 'cut') },
    ];
  },

  setup(ctx) {
    const { THREE, Body } = ctx;
    const rig = ctx.node('rig_machine'), a = ctx.node('rig_start'), b = ctx.node('rig_end');
    const wheels = ctx.nodes('wheel_'), drum = ctx.node('winch_drum'), crank = ctx.node('winch_crank');
    const from = ctx.node('rope_from'), to = ctx.node('rope_to'), water = ctx.node('water_level');
    const curtains = [ctx.node('curtain_l'), ctx.node('curtain_r')];
    const gulls = ctx.nodes('gull_');
    const bather = ctx.node('bather_root');
    const bodyB = ctx.body('bather'), bodyD = ctx.body('dipper'), bodyC = ctx.body('child'), bodyW = ctx.body('winchman');
    const travel = a.position.distanceTo(b.position);
    const world = n => n.getWorldPosition(new THREE.Vector3());
    const wade = [world(ctx.node('wade_0')), world(ctx.node('wade_1'))];
    const pool = ctx.nodes('pool_').map(world), dunkAt = world(ctx.node('dunk_at'));
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1, 8), new THREE.MeshLambertMaterial({ color: '#3a3128' }));
    rope.castShadow = true; ctx.scene.add(rope);
    // the steps' treads in the machine's own frame, to count how many are under the water
    const treads = [1, 2, 3, 4, 5].map(i => ctx.B(1.83 + 0.22 * (i - 0.5), 0, 1.0 - i * 0.2 + 0.045));
    let lastClick = 0, curt = 0, wasMoving = false, under = 0, moving = false, waveT = 0;
    const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    const home = { parent: bather.parent, pos: bodyB.pos.clone(), yaw: bodyB.yaw };
    const H = bodyB.h;
    if (Q.get('winch')) S.p = S.goal = lastClick = ctx.clamp(+Q.get('winch'), 0, 1);
    let pending = Q.get('swim');
    if (pending) { S.p = S.goal = lastClick = 1; S.curtains = true; curt = 1; }
    S.toBeach = () => { if (!S.swim) S.goal = 0; };

    // ---- the swim: a list of legs, each walked, waded or swum along its own path
    function startSwim() {
      rig.updateMatrixWorld(true);
      const steps = ctx.nodes('swim_').map(world);
      ctx.model.attach(bather);                       // she swims in the model's own frame, upright, not tilted
      bodyB.pos.copy(steps[0]); bodyB.busy = true;
      S.swim = {
        legs: [
          { kind: 'walk', path: [...steps, wade[0]], speed: 0.62 },
          { kind: 'wade', path: [wade[0], wade[1]], speed: 0.46 },
          { kind: 'swim', path: [wade[1], ...pool, dunkAt], speed: 0.8, say: 'Splash! She swims off the end of the slipway.' },
          { kind: 'dunk', time: 4.2 },
          { kind: 'swim', path: [dunkAt, pool[0], wade[1]], speed: 0.8 },
          { kind: 'wade', path: [wade[1], wade[0]], speed: 0.46 },
          { kind: 'walk', path: [wade[0], ...steps.slice().reverse()], speed: 0.58 },
        ],
        i: 0, d: 0, t: 0, u: 0, depth: 0, wet: false, rip: 0, hold: false,
      };
      S.curtains = true;
      ctx.refresh();
    }
    function endSwim() {
      home.parent.attach(bather);
      bodyB.pos.copy(home.pos); bodyB.yaw = bodyB.yawNow = home.yaw; bodyB.busy = false;
      S.swim = null; S.curtains = false;
      ctx.toast('Back inside, all wet and happy.');
      ctx.refresh();
    }
    S.startSwim = () => { if (S.p >= 0.99 && !S.swim) startSwim(); };
    const SEA = -0.15;
    function swimLeg(leg, sw, dt) {
      // breaststroke: the stroke phase u sets the pose, and the speed surges with each kick
      if (!sw.hold) {
        sw.u += dt * 1.05;
        const u = sw.u % 1;
        sw.d += dt * leg.speed * (0.45 + 1.1 * Math.max(0, Math.sin((u - 0.68) / 0.32 * Math.PI)) * (u > 0.68 ? 1 : 0) + 0.25 * (u < 0.35 ? Math.sin(u / 0.35 * Math.PI) : 0));
        if (Math.floor(sw.u + 0.18) !== Math.floor(sw.u + 0.18 - dt * 1.05)) ctx.ripples.at(tmpA.copy(bodyB.root.getWorldPosition(tmpB)).setY(SEA).addScaledVector(dirOf(bodyB.yawNow), 0.55 * H), 1.5);
      }
      const at = along(leg.path, sw.d), ahead = along(leg.path, sw.d + 0.5);
      bodyB.pos.x = at.p.x; bodyB.pos.z = at.p.z;
      bodyB.face(ahead.p.x, ahead.p.z);
      sw.depth += (SEA - 0.5 * H - 0.1 - sw.depth) * Math.min(1, dt * 4);
      bodyB.pos.y = sw.depth;
      bodyB.goal = Body.swim(sw.u % 1);
      return sw.d >= at.total;
    }
    const dirOf = yaw => new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    function stepSwim(dt, t) {
      const sw = S.swim;
      if (!sw) return;
      if (curt < 0.9) return;                         // wait for the curtains
      const leg = sw.legs[sw.i];
      let done = false;
      if (leg.kind === 'walk' || leg.kind === 'wade') {
        if (!sw.hold) sw.d += dt * leg.speed;
        const total = bodyB.follow(leg.path, sw.d, leg.kind);
        sw.depth = bodyB.pos.y;
        done = sw.d >= total;
        const wet = bodyB.pos.y < SEA;
        if (wet && !sw.wet) { sw.wet = true; ctx.splash.at(bodyB.pos.clone().setY(SEA), 0.5); ctx.sound.splash(); ctx.toast('In she goes!'); }
        if (wet && !sw.hold) { sw.rip -= dt; if (sw.rip < 0) { sw.rip = 0.55; ctx.ripples.at(bodyB.pos.clone().setY(SEA), 0.9); } }
      } else if (leg.kind === 'swim') {
        if (leg.say && sw.d === 0) { ctx.toast(leg.say); ctx.splash.at(bodyB.pos.clone().setY(SEA), 0.7); ctx.sound.splash(); }
        done = swimLeg(leg, sw, dt);
      } else if (leg.kind === 'dunk') {
        // treading water; the dipper leans over and pushes her under, and up she comes
        if (!sw.hold) sw.t += dt;
        const k = sw.t > 1.3 && sw.t < 2.7 ? Math.sin((sw.t - 1.3) / 1.4 * Math.PI) : 0;
        sw.depth += (SEA - 1.05 - 0.8 * k - sw.depth) * Math.min(1, dt * 6);
        bodyB.pos.y = sw.depth;
        bodyB.face(bodyD.pos.x, bodyD.pos.z);
        bodyB.goal = Body.tread(t);
        if (sw.t > 1.75 && !sw.dunked) { sw.dunked = true; ctx.splash.at(bodyB.pos.clone().setY(SEA), 0.8); ctx.sound.splash(); ctx.ripples.at(bodyB.pos.clone().setY(SEA), 2.2, 2.2); ctx.toast('The dipper dunks her under the waves!'); }
        done = sw.t >= leg.time;
      }
      if (done && !sw.hold) {
        sw.i++; sw.d = 0; sw.t = 0;
        if (sw.i >= sw.legs.length) endSwim();
      }
    }
    // the dipper: beckons when the machine arrives, watches the swimmer, leans over to dunk her
    function stepDipper(t) {
      const sw = S.swim, leg = sw && sw.legs[sw.i];
      if (leg && leg.kind === 'dunk') {
        bodyD.busy = true; bodyD.face(bodyB.pos.x, bodyB.pos.z);
        bodyD.goal = Body.push(sw.t > 0.8 && sw.t < 3.0 ? Math.sin((sw.t - 0.8) / 2.2 * Math.PI) : 0);
      } else if (sw && sw.i >= 1 && sw.i <= 4) {
        bodyD.busy = true; bodyD.face(bodyB.pos.x, bodyB.pos.z); bodyD.goal = Body.idle(t);
      } else if (S.p > 0.99 && !moving && (S.curtains || sw)) {
        bodyD.busy = true; bodyD.face(wade[0].x, wade[0].z); bodyD.goal = Body.wave(t, 'R');
      } else bodyD.busy = false;
    }

    ctx.onTick((dt, t) => {
      // the winch: the machine rolls toward the goal at a steady pace
      if (S.hold) S.goal = ctx.clamp(S.goal + S.hold * 0.16 * dt, 0, 1);
      const before = S.p;
      const step = 0.16 * dt;
      S.p += ctx.clamp(S.goal - S.p, -step, step);
      moving = Math.abs(S.p - before) > 1e-6;
      rig.position.lerpVectors(a.position, b.position, S.p);
      rig.quaternion.copy(a.quaternion);
      const dist = S.p * travel;
      for (const w of wheels) w.rotation.z = -dist / 0.72;
      drum.rotation.z = -dist / 0.145;
      crank.rotation.z = -dist / 0.145;
      if (Math.abs(S.p - lastClick) > 0.02) { lastClick = S.p; ctx.sound.click(); }
      // the rope from the drum to the back of the machine
      from.getWorldPosition(tmpA); to.getWorldPosition(tmpB);
      rope.position.copy(tmpA).add(tmpB).multiplyScalar(0.5);
      const dir = tmpB.clone().sub(tmpA);
      rope.scale.set(1, dir.length(), 1);
      rope.quaternion.setFromUnitVectors(up, dir.normalize());
      // steps under the water
      rig.updateMatrixWorld();
      const wl = water.getWorldPosition(tmpA).y;
      under = treads.filter(v => rig.localToWorld(v.clone()).y < wl).length;
      S.ui?.(S.p, moving, under);
      if (wasMoving && !moving) {
        if (S.p > 0.99) ctx.toast(`In the sea! ${under} steps are under the water.`);
        else if (S.p < 0.01) ctx.toast('Back up on the beach.');
        ctx.refresh();
      }
      if (!wasMoving && moving) ctx.refresh();
      wasMoving = moving;
      // the curtains slide open and shut
      curt += ((S.curtains ? 1 : 0) - curt) * Math.min(1, dt * 5);
      for (const c of curtains) c.scale.z = 1 - 0.8 * curt;
      // a frozen swim for screenshots (?swim=steps|swim|dunk), once the machine is in the sea
      if (pending) {
        startSwim();
        const sw = S.swim; sw.hold = true;
        if (pending === 'steps') { sw.i = 0; sw.d = 0.9; }
        else if (pending === 'swim') { sw.i = 2; sw.d = 2.6; sw.u = 0.45; sw.depth = SEA - 0.5 * H - 0.1; }
        else if (pending === 'dunk') { sw.i = 3; sw.t = 1.25; sw.depth = SEA - 1.05; bodyB.pos.copy(dunkAt); }
        pending = null;
      }
      stepSwim(dt, t);
      stepDipper(t);
      // the winch man turns the handle while the machine moves
      if (moving) { bodyW.busy = true; bodyW.goal = Body.crank(-dist / 0.145); } else bodyW.busy = false;
      // the child waves at the machine as it rolls past, and jumps up and down while the Queen's bather swims
      if (S.swim && S.swim.i >= 2 && S.swim.i <= 4) { bodyC.busy = true; bodyC.face(bodyB.pos.x, bodyB.pos.z); bodyC.goal = Body.jump(t, bodyC.h); }
      else if (moving || waveT > 0) {
        waveT = moving ? 2 : waveT - dt;
        bodyC.busy = true; bodyC.face(rig.position.x, rig.position.z); bodyC.goal = Body.wave(t, 'R');
      } else bodyC.busy = false;
      // gulls look about
      gulls.forEach((g, i) => { g.rotation.y = 0.5 * Math.sin(t * 0.7 + i * 2.1) * (Math.sin(t * 0.23 + i) > 0.3 ? 1 : 0.2); });
    });
  },
};
