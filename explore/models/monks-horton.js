// Monks Horton School, Kent (Joseph Clarke, 1852): words, things to find, things to do. Model: tools/blender/school.py.
const SRC = { name: 'Joseph Clarke, Schools and School Houses (1852), Plate 1: Monks Horton Schools, Kent', url: 'https://archive.org/details/gri_33125012901829' };
const CREDIT = 'Joseph Clarke, Schools and School Houses (1852), Plate 1. Public domain. Scan: Getty Research Institute, Internet Archive.';
const S = { lit: false };

export default {
  id: 'monks', name: 'Monks Horton School', model: '../assets/models/school.glb', back: '../tasks/victorian-school.html',
  eyebrow: 'Astra Victorians · Kent · 1852', title: ['Monks Horton', 'School.'],
  blurb: 'A real one-room village school, built in 1852 from the architect\'s own drawings. Fifty children, one teacher, one fire.',
  say: 'Monks Horton School, in Kent, built in 1852. It had one room for fifty children, one teacher and one fire. Tap anything to find out what it is.',
  label: 'A 3D model of Monks Horton school: a single stone schoolroom with a steep tiled roof, a little timber porch, a chimney and a bell on the roof, standing on a block of grass and chalk.',
  loading: 'Building the school…', unit: 1, smoke: 1.5, sparkle: 1.1,
  tabs: [
    { href: 'victorian-school.html', label: 'Tiny school', icon: 'school', on: true },
    { href: 'wrenbury-school.html', label: 'Our school', icon: 'big' },
    { href: 'bathing-machine.html', label: 'Bathing machine', icon: 'hut' },
  ],
  views: { home: { az: 55, el: 27, zoom: 1 }, real: { az: 60, el: 12, zoom: 1.2 }, plan: { az: 90, el: 89, zoom: 1.08 } },
  // the cutaway: every wall sliced 4 ft 9 in above the floor, through the windows and the door (not at a sill:
  // a face lying exactly on the cut flickers)
  cut: { z: 4.75, el: 50 },
  real: [
    { tab: 'Picture', icon: 'picture', img: '../assets/img/clarke-monks-horton.jpg', cap: 'Monks Horton School, drawn by its architect, Joseph Clarke, in 1852.', credit: CREDIT, by: 'Joseph Clarke, 1852 · public domain', view: 'real', match: 'Turn the model to match' },
    { tab: 'Plan', icon: 'plan', img: '../assets/img/clarke-monks-horton-plan.jpg', cap: 'Clarke\'s plan: one schoolroom 24 feet by 12 feet 6 inches, with the desks along the front wall.', credit: CREDIT, by: 'Joseph Clarke, 1852 · public domain', view: 'plan', state: 'cut', match: 'Look down on the cut-open model' },
  ],
  stats: [['50', 'children in one room'], ['1', 'fire to warm them all'], ['£120', 'to build it all']],
  parts: [
    { key: 'walls', short: 'Stone walls', title: 'Stone walls', text: ['The walls are Kent ragstone, a rough grey stone dug out of the ground near by. The corners and window edges are smooth, pale Caen stone from France.', 'They are over a foot thick: thicker than a school ruler is long.'], src: SRC },
    { key: 'windows', short: 'Windows', title: 'Windows', text: ['Three big windows, each with four tall panes between stone bars called mullions. The glass was little diamond shapes joined with strips of lead.', 'There is no window at the back, where the fire is.'], src: SRC },
    { key: 'roof', short: 'Roof', title: 'A steep tiled roof', text: ['Old clay tiles in rows like fish scales. It is steep, so rain and snow slide straight off.', 'Inside, the big wooden beams were left showing.'], src: SRC },
    { key: 'bellcot', short: 'Bell', title: 'The bell-cot', text: ['A tiny tower on the end of the roof holds the school bell. Its rope hangs down into the room, so the teacher could ring it without going out in the rain.'], think: 'Press "Ring the bell". Who comes running?', src: SRC },
    { key: 'chimney', short: 'Chimney', title: 'Chimney and fireplace', text: ['One fireplace in the middle of the back wall warmed all fifty children. Its tall stack runs up the outside of the wall.'], think: 'On a cold day, where would you want to sit?', src: SRC },
    { key: 'porch', short: 'Porch', title: 'The porch', text: ['A little open porch with wooden posts and a steep tiled roof, to keep the rain off the door. Clarke called it a "pent".'], src: SRC },
    { key: 'desks', short: 'Long desk', title: 'The long desk', inside: true, text: ['One long sloping desk runs along the front wall, under the window, with a bench right in front of it. The children sat facing the wall and wrote on slates, not paper.'], think: 'How many children could squeeze onto the bench?', src: SRC },
    { key: 'master', short: "Teacher's desk", title: "The teacher's desk", inside: true, text: ['At the far end of the room is a little platform, two steps up, with the teacher\'s desk against the wall. From up there he could see every single child.'], src: SRC },
    { key: 'children', short: 'Children', title: 'The children', inside: true, text: ['Six of the fifty children are sitting on the bench. Fifty children squeezed into a room smaller than your classroom!'], think: 'Can you find the child who is late?', src: SRC },
    { key: 'floor', short: 'Chalk floor', title: 'A floor made of chalk', inside: true, text: ['The floor is chalk, laid in layers and pressed flat until it went as hard as rock.', 'Look at the cut edge of the ground: Kent is made of chalk too.'], src: SRC },
  ],
  finds: [
    { q: 'Can you find the child who is late for school?', it: 'the late child', targets: ['late_root', 'lateseat_root'] },
    { q: 'Can you find the bell?', it: 'the bell', targets: ['bell_swing'], hint: 'Look up high. Turn the school round if you need to.' },
    { q: 'Can you find the teacher?', it: 'the teacher', targets: ['master_root'], hint: 'Lift the roof, or cut it open, to look inside.' },
    { q: 'Can you find the fireplace?', it: 'the fireplace', targets: ['part_chimney', 'fire'], hint: 'It is on the back wall.' },
  ],
  specs: [
    ['Built', '1852', 'Joseph Clarke, architect, for a small Kent parish'],
    ['Room', '24 ft × 12 ft 6 in', 'Clarke\'s own figures, written on the plan'],
    ['Desk', 'One long desk along the front wall', 'about 1 ft deep, the bench about 10 in, from the far end to the door (measured off the plan)'],
    ['Teacher', 'A platform about 3 ft square, two steps up', 'with a small desk against the far end wall (measured off the plan)'],
    ['Children', '50', 'one room, one teacher'],
    ['Walls', 'Kent ragstone', 'Caen-stone dressings; about 1 ft 2 in thick (measured off the plan)'],
    ['Height', 'Eaves about 8 ft, ridge about 18 ft', 'measured off the end elevation and rounded'],
    ['Roof and floor', 'Old tiles; a chalk "threshing floor"', 'timbers left open inside'],
    ['Cost', '£120', 'the whole contract, with the outbuildings'],
  ],
  foot: `<p>Modelled from Plate 1 of Joseph Clarke, <i>Schools and School Houses: a series of views, plans and details for rural parishes</i> (London: George Bell, 1852), and his description of the school ("one room, for 50 children… built of rag-stone, with Caen-stone dressings, and covered with old tiles; the fire-place is brick. A pent is constructed over the entrance… There is a small bell-cot at one end of the roof, the bell being rung from the inside"). Public domain; the sharp scan is the Getty Research Institute's, on the <a href="https://archive.org/details/gri_33125012901829" target="_blank" rel="noopener">Internet Archive</a>.</p><p>Our guesses: the blackboard, easel and clock, how the children are dressed, the garden, trees, wall and gate, and the grass, soil and chalk in the cut edge (Monks Horton is on the chalk of the North Downs).</p>`,

  actions(ctx) {
    return [
      { icon: 'bell', label: 'Ring the bell', run: () => S.ring() },
      { icon: 'fire', label: 'Light the fire', labelOn: 'Put the fire out', on: () => S.lit, run: () => S.setFire(!S.lit) },
      { icon: 'lift', iconOn: 'roof', label: 'Lift the roof', labelOn: 'Put the roof on', on: () => ctx.state === 'inside', run: () => ctx.setState(ctx.state === 'inside' ? 'whole' : 'inside') },
      { icon: 'cut', iconOn: 'together', label: 'Cut it open', labelOn: 'Put it back', on: () => ctx.state === 'cut', run: () => ctx.setState(ctx.state === 'cut' ? 'whole' : 'cut') },
    ];
  },

  setup(ctx) {
    const { THREE } = ctx;
    const bell = ctx.node('bell_swing'), fire = ctx.node('fire'), spot = ctx.node('firelight');
    const late = ctx.node('late_root'), seat = ctx.node('lateseat_root'), lateB = ctx.body('late'), master = ctx.body('master');
    const path = ctx.nodes('late_path_').map(n => n.position.clone());
    ctx.smoke.add(ctx.node('smoke_0')); ctx.smoke.add(ctx.node('smoke_1'));
    const glow = new THREE.PointLight('#ff9448', 0, 0, 2); spot.add(glow);
    fire.visible = false;
    let ring = -1, lastK = 0, walk = -1, crack = 0;
    const lens = path.slice(1).map((p, i) => p.distanceTo(path[i])), total = lens.reduce((a, b) => a + b, 0);
    S.ring = () => {
      ring = 0; lastK = 0;
      if (walk < 0 && late.visible) walk = 0;
    };
    S.setFire = on => { S.lit = on; fire.visible = on; ctx.smoke.on = on; if (on) { ctx.sound.whoosh(); if (ctx.state === 'whole') ctx.toast('The fire is lit. Look at the chimney!'); } };
    ctx.onTick((dt, t) => {
      if (ring >= 0) {
        ring += dt;
        const T = 0.95, fall = Math.exp(-ring / 2.6);
        bell.rotation.z = 0.8 * Math.sin(ring * Math.PI * 2 / T) * fall;
        const k = Math.floor(ring / (T / 2) + 0.5);
        if (k !== lastK && k > 0 && ring < 5) { lastK = k; ctx.sound.bell(k % 2 ? 587 : 523, 0, 0.4 + 0.6 * fall); }
        if (ring > 6.5) { ring = -1; bell.rotation.z = 0; }
      }
      if (walk >= 0) {
        // she hurries in: a proper stride, quick feet
        walk += dt * 4.2;
        lateB.busy = true;
        lateB.follow(path, Math.min(walk, total), walk > total - 3 ? 'walk' : 'run');
        if (walk >= total) { walk = -2; lateB.busy = false; late.visible = false; seat.visible = true; ctx.toast('In you come! Lessons are starting.'); }
      }
      // the master waves the children in while the bell rings
      if (master) {
        if (ring >= 0 && ring < 4.5) { master.busy = true; master.goal = ctx.Body.wave(t, 'R'); } else master.busy = false;
      }
      if (S.lit) {
        fire.scale.y = 0.9 + 0.18 * Math.sin(t * 13) * Math.sin(t * 5.3);
        glow.intensity = 55 + 18 * Math.sin(t * 9.1) * Math.sin(t * 3.7);
        crack -= dt;
        if (crack < 0) { crack = 0.12 + Math.random() * 0.45; ctx.sound.crackle(); }
      } else glow.intensity = 0;
    });
  },
};
