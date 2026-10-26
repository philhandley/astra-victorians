// Wrenbury School, then and now: our own school as the 1897 map and the 2006 photograph show it, beside a new school
// on a plot the same size. Model: tools/blender/wrenbury.py (with modern_site.py); paper nets: tools/paper/unfold.py.
// Dev: ?now opens on the new school; ?fold=v|m plays a fold at once.
import { PaperFold, foldTest } from '../fold.js';

const LIST = { name: 'Historic England list entry 1066020 (via British Listed Buildings): Wrenbury School, dated 1879', url: 'https://britishlistedbuildings.co.uk/101066020' };
const MAP97 = { name: 'Ordnance Survey 25-inch, Cheshire LXI.11, revised 1897 (National Library of Scotland, CC-BY)', url: 'https://maps.nls.uk/view/114585541' };
const MAP74 = { name: 'Ordnance Survey six-inch, Cheshire LXI, surveyed 1874-75 (National Library of Scotland, CC-BY)', url: 'https://maps.nls.uk/view/102341131' };
const PHOTO = { name: 'Mike Harris, Wrenbury School, 7 June 2006 (Wikimedia Commons, CC BY-SA 2.0)', url: 'https://commons.wikimedia.org/wiki/File:Wrenbury_cum_Frith_-_Wrenbury_School.jpg' };
const RULES = { name: 'Education Department, Rules to be observed in planning and fitting up schools, in E. R. Robson, School Architecture (1874), Appendix B', url: 'https://archive.org/search?query=robson+school+architecture' };
const BB103 = { name: 'DfE, Building Bulletin 103: Area guidelines for mainstream schools (2014)', url: 'https://www.gov.uk/government/publications/mainstream-schools-area-guidelines' };
const S = { view: 'then', folding: null };
const THEN = { az: 236, el: 24, zoom: 2.25, targetB: [44, 20, 2] };
const NOW = { az: 236, el: 30, zoom: 2.5, targetB: [141, 25, 2] };

export default {
  id: 'wrenbury', name: 'Wrenbury School', model: '../assets/models/wrenbury.glb', back: '../tasks/model-school.html',
  eyebrow: 'Astra Victorians · our school · 1879 and now', title: ['Wrenbury', 'School.'],
  blurb: 'Your own school, as it was built in 1879, and a new school on a plot just the same size. Ring the bell, look inside, and watch the paper models fold.',
  say: 'Wrenbury School. The Victorian part was built in 1879: look for the date on the round stone. Next to it is a new school, designed the way an architect would today, on a plot just the same size. Tap anything to find out what it is.',
  label: 'A 3D model of Wrenbury School as it was in Victorian times, red brick with a tall bell tower and spire, three yards in front with paths to the road; and beside it a new school shaped like an X, with glass walls and roofs that sweep up at the ends.',
  loading: 'Building the school…', unit: 0.3, smoke: 0.5, sparkle: 0.5,
  tabs: [
    { href: 'victorian-school.html', label: 'Tiny school', icon: 'school' },
    { href: 'wrenbury-school.html', label: 'Our school', icon: 'big', on: true },
    { href: 'bathing-machine.html', label: 'Bathing machine', icon: 'hut' },
  ],
  views: {
    home: THEN, now: NOW,
    real: { az: 225, el: 6, zoom: 3.6, targetB: [36, 19, 4] },
    plan: { az: 270, el: 89, zoom: 2.3, targetB: [44, 22, 0] },
  },
  // the cutaway: everything sliced 1.6 m up, through the Victorian windows (sills 1.3 m) and the new glass walls
  cut: { z: 1.6, el: 52 },
  real: [
    { tab: '2006', icon: 'picture', img: '../assets/img/wrenbury-school.jpg', cap: 'The road front in 2006: the tower and spire, the round date stone, the big gables with white wooden edges.', credit: 'Mike Harris, 2006, CC BY-SA 2.0, via Wikimedia Commons', by: 'Mike Harris, 2006 · CC BY-SA 2.0', view: 'real', match: 'Turn the model to match' },
    { tab: '1897', icon: 'plan', img: '../assets/img/wrenbury-map-1897.jpg', cap: 'The Ordnance Survey map of 1897. The school is drawn with lines across it; plot 205 is 1.017 acres.', credit: 'Ordnance Survey 25-inch, Cheshire LXI.11, 1897. National Library of Scotland, CC-BY.', by: 'Ordnance Survey, 1897 · NLS · CC-BY', view: 'plan', match: 'Look down from above' },
    { tab: '1874', icon: 'plan', img: '../assets/img/wrenbury-map-1874.jpg', cap: 'The map of 1874: no big school yet. Boys and girls went to two little Endowed Schools near the church. The new school was built in the field by the guide post.', credit: 'Ordnance Survey six-inch, Cheshire LXI, surveyed 1874-75. National Library of Scotland, CC-BY.', by: 'Ordnance Survey, 1874-75 · NLS · CC-BY', view: 'plan', match: 'Look down from above' },
  ],
  stats: [['1879', 'on the round date stone'], ['1.017', 'acres: the plot on the 1897 map'], ['62 m²', 'for a class of 30 today']],
  parts: [
    { key: 'walls', short: 'Brick walls', title: 'Red brick walls', text: ['Red brick laid in "English garden wall bond": a few rows of long bricks, then one row of brick ends. Count the rows when you walk past!', 'At the bottom is a band of dark blue bricks, and a pale stone band runs along under the windows.'], src: LIST },
    { key: 'windows', short: 'Windows', title: 'High windows', text: ['The rules for building schools said window sills must be at least 4 feet up: that is about as high as your shoulder. Children could not look out and get distracted.', 'The windows are split into tall panes by stone bars called mullions.'], think: 'Would you like windows you cannot see out of?', src: RULES },
    { key: 'tower', short: 'Bell tower', title: 'The bell tower and spire', text: ['A square brick tower turns round at the top into a white bell stage with slats, so the sound of the bell can get out. On top is a tall pointed spire and a weathervane.'], think: 'Press "Ring the bell". Who comes running?', src: LIST },
    { key: 'roof', short: 'Roofs', title: 'Tiled roofs', text: ['Red clay tiles. The main roof is low; the two big gables at the road end stand up taller, with white wooden edges cut into shapes.', 'Lift the roof to look inside.'], src: PHOTO },
    { key: 'chimneys', short: 'Chimneys', title: 'Chimneys and the date stone', text: ['The chimney on the front wall has a round stone with the date 1879, and diamonds of dark blue brick under it.', 'Every room was warmed by a fire.'], think: 'Can you find the round date stone?', src: LIST },
    { key: 'inside', short: 'Inside', title: 'Inside the classrooms', inside: true, text: ['Nobody has a drawing of the inside, so it is set out the way the rules of the time said: long desks in groups of no more than three rows, 18 inches of bench for each child, and a "gallery" of steps for the infants.'], src: RULES },
    { key: 'children', short: 'Children', title: 'Victorian children', inside: true, text: ['Boys and girls, in caps and bonnets, in the yards and at the desks. The teacher stands at the door.'], think: 'How is what they wear different from your uniform?', src: RULES },
    { key: 'mod_walls', short: 'Glass walls', title: 'Walls of glass', text: ['The new school has glass from the floor up, so you can see the garden from your table. Each classroom has its own door straight outside.', 'That is the opposite of 1879, when the windows were high.'], think: 'What would you see from your table?', src: BB103 },
    { key: 'mod_roof', short: 'Sweeping roofs', title: 'Roofs that sweep up', text: ['Four wings meet round a shared middle. Each roof is low in the middle and sweeps up to tall corners at the far end, so the glass is tallest where it looks out.', 'On the paper model each roof is three flat triangles folded together.'], src: BB103 },
    { key: 'mod_inside', short: 'Inside today', title: 'Inside today', inside: true, text: ['Round tables for groups, a classroom of 62 square metres for 30 children, and round story steps in the middle under a skylight.'], src: BB103 },
    { key: 'mod_children', short: 'Children today', title: 'Children today', text: ['In every garden between the arms: a playground, a growing garden, a pond, and a running loop round the field.'], src: BB103 },
  ],
  finds: [
    { q: 'Can you find the round date stone that says 1879?', it: 'the date stone', targets: ['datestone'], hint: 'It is on the front wall, on the chimney.' },
    { q: 'Can you find the bell?', it: 'the bell', targets: ['bell_swing'], hint: 'Look up high in the tower.' },
    { q: 'Can you find the three paths to the road?', it: 'the paths', targets: ['paths'], hint: 'Each yard has its own way out.' },
    { q: 'Can you find the teacher at the door?', it: 'the teacher', targets: ['master_root'] },
    { q: 'Now find the running loop at the new school.', it: 'the running loop', targets: ['track'], hint: 'Press "Go to today" first.' },
  ],
  specs: [
    ['Date stone', '1879', 'the list entry: "School. Dated 1879." (The school says it began in 1876; the log book starts then too.)'],
    ['Plan', 'From the 1897 Ordnance Survey', 'traced at full size: 6.30 scan pixels to a metre, checked on the plot\'s printed 1.017 acres'],
    ['Look', 'From the 2006 photograph', 'red brick, blue-brick plinth, stone bands, white bargeboards, the tower and spire'],
    ['Heights', 'About 4.1 m to the eaves, about 13 m to the spire tip', 'measured from the photograph with the camera\'s own lens record; good to about a metre'],
    ['Inside', 'Set out by the 1870s Rules', 'no drawing of Wrenbury\'s inside is known'],
    ['New school', '4 wings of 72 m² round an 8 m heart', 'class bases from BB103 (62 m² for 30); on a plot the same size as 1897'],
  ],
  foot: `<p>The plan is traced from the Ordnance Survey 25-inch map of 1897 and the look from Mike Harris's photograph of 2006 (camera matched with <code>tools/photo_match.py</code>); the details from the Historic England list entry. The inside follows the Education Department's Rules, as reprinted by E. R. Robson in 1874, because no drawing of Wrenbury's inside is known. The new school is our design, sized from DfE Building Bulletin 103.</p><p>Our guesses: the back of the building (the photograph only shows the road front), heights to about a metre, the colours of the children's clothes, the trees.</p>`,

  actions(ctx) {
    return [
      { icon: 'bell', label: 'Ring the bell', run: () => S.ring(), disabled: () => S.view !== 'then' },
      { icon: 'lift', iconOn: 'roof', label: 'Lift the roofs', labelOn: 'Put the roofs on', on: () => ctx.state === 'inside', run: () => ctx.setState(ctx.state === 'inside' ? 'whole' : 'inside') },
      { icon: 'cut', iconOn: 'together', label: 'Cut it open', labelOn: 'Put it back', on: () => ctx.state === 'cut', run: () => ctx.setState(ctx.state === 'cut' ? 'whole' : 'cut') },
      { icon: 'together', label: 'Watch it fold', run: () => S.fold(), disabled: () => !!S.folding || !S.pf },
      { icon: 'big', iconOn: 'school', label: 'Go to today', labelOn: 'Back to 1879', wide: true, on: () => S.view === 'now', run: () => S.go(S.view === 'now' ? 'then' : 'now') },
    ];
  },

  setup(ctx) {
    const { THREE } = ctx;
    const q = new URLSearchParams(location.search);
    const bell = ctx.node('bell_swing'), master = ctx.body('master');
    const walkers = [0, 1, 2, 3, 4, 5].map(i => ctx.body(`child${i}`)).filter(Boolean);
    const door = ctx.nodes('walk_').map(n => n.position.clone());
    ctx.smoke.add(ctx.node('smoke_0')); ctx.smoke.add(ctx.node('smoke_1'));
    // which parts belong to which school, for the fold
    const OLD = ['walls_range', 'walls_wing', 'walls_bay', 'walls_link', 'walls_east', 'walls_porch', 'windows_range', 'tower', 'roof', 'roof_east', 'chimneys'];
    const NEW = ['mod_walls', 'mod_windows', 'mod_roof'];
    const show = (keys, on) => keys.forEach(k => { const n = ctx.node('part_' + k); if (n) n.visible = on; });
    S.go = v => {
      S.view = v;
      ctx.goView(v === 'now' ? NOW : THEN, 1.6);
      ctx.toast(v === 'now' ? 'A new school, on a plot just the same size.' : 'Back to 1879.');
      ctx.refresh();
    };
    Promise.all(['wrenbury', 'modern'].map(m => fetch(`../assets/models/${m}-nets.json`).then(r => r.json()))).then(([nv, nm]) => {
      S.pf = {
        then: new PaperFold(ctx.scene, nv, { tex: '../assets/paper/wrenbury/', onsite: true, gap: 1.1 }),
        now: new PaperFold(ctx.scene, nm, { tex: '../assets/paper/modern/', onsite: true, gap: 1.8 }),
      };
      S.test = { then: foldTest(nv), now: foldTest(nm) };
      console.log('fold test', S.test.then.ok && S.test.now.ok ? 'PASS' : 'FAIL', S.test);
      ctx.refresh();
      if (q.get('fold')) S.fold(q.get('fold') === 'm' ? 'now' : 'then');
    });
    S.fold = (which = S.view) => {
      if (!S.pf || S.folding) return;
      const pf = S.pf[which], keys = which === 'now' ? NEW : OLD;
      if (ctx.state !== 'whole') ctx.setState('whole');
      S.folding = which;
      show(keys, false);
      pf.play();
      ctx.toast('Watch the paper pieces fold up into the school.');
      pf.onDone = () => {
        const t = S.test[which];
        const worst = Math.max(...t.solids.map(s => Math.max(s.vErr, s.gap)));
        ctx.toast(`Every piece folds shut: the edges meet to ${worst.toFixed(1)} mm.`);
        setTimeout(() => { pf.hide(); show(keys, true); S.folding = null; ctx.refresh(); }, 3500);
      };
      ctx.refresh();
    };
    let ring = -1, lastK = 0, walk = -1;
    const lens = door.slice(1).map((p, i) => p.distanceTo(door[i])), total = lens.reduce((a, b) => a + b, 0);
    S.ring = () => { ring = 0; lastK = 0; if (walk < 0) walk = 0; };
    ctx.onTick((dt, t) => {
      if (S.pf) { S.pf.then.tick(dt); S.pf.now.tick(dt); }
      if (ring >= 0) {
        ring += dt;
        const T = 0.95, fall = Math.exp(-ring / 2.6);
        bell.rotation.z = 0.8 * Math.sin(ring * Math.PI * 2 / T) * fall;
        const k = Math.floor(ring / (T / 2) + 0.5);
        if (k !== lastK && k > 0 && ring < 5) { lastK = k; ctx.sound.bell(k % 2 ? 587 : 523, 0, 0.4 + 0.6 * fall); }
        if (ring > 6.5) { ring = -1; bell.rotation.z = 0; }
      }
      if (master) {
        if (ring >= 0 && ring < 4.5) { master.busy = true; master.goal = ctx.Body.wave(t, 'R'); } else master.busy = false;
      }
      // when the bell rings, the first child runs from the road gate to the door
      if (walk >= 0 && walkers[0]) {
        walk += dt * 3.2;
        walkers[0].busy = true;
        walkers[0].follow(door, Math.min(walk, total), walk > total - 2 ? 'walk' : 'run');
        if (walk >= total) { walk = -2; walkers[0].busy = false; ctx.toast('In you come! Lessons are starting.'); }
      }
    });
    if (q.has('now')) { S.view = 'now'; ctx.goView(NOW, 0); } else ctx.goView(THEN, 0);
  },
};
