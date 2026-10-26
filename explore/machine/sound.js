// Sounds for the bathing-machine game, all made in the browser with WebAudio (no files): the engine hum, splashes,
// the slide's whoosh, the horn, cheers, the fountains, and the band's song (in the style of alt-J: toms, sub bass, a
// mallet arpeggio and soft voices).
export class Sound {
  constructor() { this.on = true; this.ctx = null; this.bandOn = false; this.bpm = 104; }
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.build(new AC());
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (this.bandOn && !this.timer) this.band(true);
    return this.ctx;
  }
  build(c) {                                        // (an OfflineAudioContext works too, for testing the song)
    this.ctx = c;
    this.master = c.createGain(); this.master.gain.value = this.on ? 0.7 : 0; this.master.connect(c.destination);
    const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = buf;
    // the engine: two low notes through a soft filter, louder when it moves
    const eg = this.engineGain = c.createGain(); eg.gain.value = 0;
    const lp = this.engineLP = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260;
    this.engineOsc = [c.createOscillator(), c.createOscillator()];
    this.engineOsc[0].type = 'sawtooth'; this.engineOsc[0].frequency.value = 46;
    this.engineOsc[1].type = 'square'; this.engineOsc[1].frequency.value = 69;
    for (const o of this.engineOsc) { o.connect(lp); o.start(); }
    const rumble = this.noise(true); const rb = c.createBiquadFilter(); rb.type = 'lowpass'; rb.frequency.value = 140; rumble.connect(rb); rb.connect(lp);
    lp.connect(eg); eg.connect(this.master);
    // the fountains: a steady hiss
    const sg = this.sprayGain = c.createGain(); sg.gain.value = 0;
    const sn = this.noise(true), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 0.6;
    sn.connect(bp); bp.connect(sg); sg.connect(this.master);
    // the band bus, with a little echo
    this.bandBus = c.createGain(); this.bandBus.gain.value = 0.55;
    const dl = c.createDelay(); dl.delayTime.value = 0.18; const fb = c.createGain(); fb.gain.value = 0.18;
    this.bandBus.connect(this.master); this.bandBus.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(this.master);
  }
  setOn(v) { this.on = v; if (this.master) this.master.gain.setTargetAtTime(v ? 0.7 : 0, this.ctx.currentTime, 0.05); }
  noise(loop = false) { const s = this.ctx.createBufferSource(); s.buffer = this.noiseBuf; s.loop = loop; if (loop) s.start(); return s; }
  env(node, t, a, peak, dec) { const g = this.ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); node.connect(g); return g; }
  engine(speed) {                                   // speed 0..1
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.engineGain.gain.setTargetAtTime(0.02 + speed * 0.16, t, 0.12);
    this.engineOsc[0].frequency.setTargetAtTime(44 + speed * 22, t, 0.2);
    this.engineOsc[1].frequency.setTargetAtTime(66 + speed * 33, t, 0.2);
  }
  spray(on) { if (this.ctx) this.sprayGain.gain.setTargetAtTime(on ? 0.12 : 0, this.ctx.currentTime, 0.15); }
  splash(size = 1) {
    if (!this.ensure()) return;
    const c = this.ctx, t = c.currentTime, n = this.noise(), f = c.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(400, t + 0.5 * size);
    n.connect(f); this.env(f, t, 0.01, 0.5 * Math.min(1, size), 0.55 * size).connect(this.master); n.start(t); n.stop(t + 1.2);
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(600, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.18);
    this.env(o, t, 0.005, 0.25, 0.2).connect(this.master); o.start(t); o.stop(t + 0.3);
  }
  whoosh() {
    if (!this.ensure()) return;
    const c = this.ctx, t = c.currentTime, n = this.noise(), f = c.createBiquadFilter();
    f.type = 'bandpass'; f.Q.value = 2; f.frequency.setValueAtTime(500, t); f.frequency.exponentialRampToValueAtTime(2600, t + 0.9);
    n.connect(f); this.env(f, t, 0.25, 0.35, 0.8).connect(this.master); n.start(t); n.stop(t + 1.3);
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(700, t); o.frequency.exponentialRampToValueAtTime(1500, t + 0.35); o.frequency.exponentialRampToValueAtTime(500, t + 0.9);
    this.env(o, t, 0.05, 0.08, 0.85).connect(this.master); o.start(t); o.stop(t + 1);
  }
  horn() {
    if (!this.ensure()) return;
    const c = this.ctx, t = c.currentTime;
    for (const [f, d] of [[392, 0], [494, 0], [392, 0.32], [494, 0.32]]) {
      const o = c.createOscillator(); o.type = 'square'; o.frequency.value = f;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; o.connect(lp);
      const g = c.createGain(); g.gain.setValueAtTime(0, t + d); g.gain.linearRampToValueAtTime(0.09, t + d + 0.02); g.gain.setValueAtTime(0.09, t + d + 0.22); g.gain.linearRampToValueAtTime(0, t + d + 0.27);
      lp.connect(g); g.connect(this.master); o.start(t + d); o.stop(t + d + 0.3);
    }
  }
  cheer() {
    if (!this.ensure()) return;
    const c = this.ctx, t = c.currentTime;
    for (let i = 0; i < 5; i++) {
      const o = c.createOscillator(); o.type = 'triangle'; const f0 = 380 + Math.random() * 260, d = Math.random() * 0.12;
      o.frequency.setValueAtTime(f0, t + d); o.frequency.linearRampToValueAtTime(f0 * 1.5, t + d + 0.18); o.frequency.linearRampToValueAtTime(f0 * 1.2, t + d + 0.5);
      this.env(o, t + d, 0.04, 0.05, 0.5).connect(this.master); o.start(t + d); o.stop(t + d + 0.7);
    }
    const n = this.noise(), f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 0.8;
    n.connect(f); this.env(f, t, 0.08, 0.12, 0.9).connect(this.master); n.start(t); n.stop(t + 1.2);
  }
  beep() {                                          // the reversing beeper, like a real truck
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime, o = c.createOscillator(); o.type = 'square'; o.frequency.value = 1180;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2600; o.connect(f);
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.01); g.gain.setValueAtTime(0.06, t + 0.22); g.gain.linearRampToValueAtTime(0, t + 0.25);
    f.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.3);
  }
  toot() {                                          // a short polite toot: please step aside
    if (!this.ensure()) return;
    const c = this.ctx, t = c.currentTime;
    for (const fr of [440, 554]) {
      const o = c.createOscillator(); o.type = 'square'; o.frequency.value = fr;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1200; o.connect(lp);
      const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.02); g.gain.setValueAtTime(0.06, t + 0.16); g.gain.linearRampToValueAtTime(0, t + 0.2);
      lp.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.25);
    }
  }
  fanfare() {                                       // a job done (big = all of them)
    if (!this.ensure()) return;
    const c = this.ctx, t = c.currentTime;
    [523, 659, 784, 1047].forEach((fr, i) => {
      const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = fr;
      this.env(o, t + i * 0.09, 0.01, 0.16, 0.35 + (i === 3 ? 0.4 : 0)).connect(this.master); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.9);
    });
  }
  whee(pitch = 1) {                                 // a little voice going 'wheee!' down the slide
    if (!this.ensure()) return;
    const c = this.ctx, t = c.currentTime, o = c.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(420 * pitch, t); o.frequency.exponentialRampToValueAtTime(760 * pitch, t + 0.35); o.frequency.exponentialRampToValueAtTime(520 * pitch, t + 1.1);
    const env = c.createGain(); env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(0.09, t + 0.08); env.gain.setValueAtTime(0.09, t + 0.8); env.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    for (const [f, g] of [[300, 1], [2300, 0.5], [3000, 0.25]]) { const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 6; const gg = c.createGain(); gg.gain.value = g; o.connect(bp); bp.connect(gg); gg.connect(env); }
    env.connect(this.master); o.start(t); o.stop(t + 1.25);
  }
  bonk() {                                          // a beach ball kicked or bumped
    if (!this.ensure()) return;
    const c = this.ctx, t = c.currentTime, o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(320, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.12);
    this.env(o, t, 0.004, 0.3, 0.16).connect(this.master); o.start(t); o.stop(t + 0.22);
  }
  pop() {
    if (!this.ensure()) return;
    const c = this.ctx, t = c.currentTime, o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(500, t); o.frequency.exponentialRampToValueAtTime(1100, t + 0.08);
    this.env(o, t, 0.005, 0.18, 0.12).connect(this.master); o.start(t); o.stop(t + 0.2);
  }
  // ---------------------------------------------------------------- the band (the song itself is play16, below)
  band(on) {
    this.bandOn = on; this.bandT0 = performance.now() / 1000;
    if (!on) { clearInterval(this.timer); this.timer = null; return; }
    if (!this.ctx || this.timer) return;                          // (no sound until the first tap; ensure() starts it then)
    const c = this.ctx;
    this.step16 = 0; this.nextT = c.currentTime + 0.08; this.bandT0c = this.nextT;
    this.timer = setInterval(() => {
      const sp = 60 / this.bpm / 4;
      while (this.nextT < c.currentTime + 0.15) { this.play16(this.step16, this.nextT); this.nextT += sp; this.step16++; }
    }, 25);
  }
  beat() {                                          // beats since the song started (for the dancing), even with the sound off
    if (this.ctx && this.timer && this.ctx.state === 'running') return (this.ctx.currentTime - this.bandT0c) * this.bpm / 60;
    return (performance.now() / 1000 - (this.bandT0 || 0)) * this.bpm / 60;
  }
  // An alt-J flavoured song (Breezeblocks, Tessellate): no cymbals at all, just deep floor toms, rim clicks and claps
  // in a 3+3+2 groove; a big round sub bass; a plucked mallet arpeggio; and soft 'ooh' and 'ah' voices singing the
  // chords and a little tune, over D minor, B flat, F, C.
  voice(t, midi, dur, vowel, gain, bus) {
    const c = this.ctx, hz = 440 * Math.pow(2, (midi - 69) / 12);
    const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz;
    const vib = c.createOscillator(), vg = c.createGain(); vib.frequency.value = 5.2; vg.gain.value = hz * 0.006; vib.connect(vg); vg.connect(o.frequency);
    const F = vowel === 'oo' ? [[320, 1], [800, 0.35], [2300, 0.12]] : [[700, 1], [1150, 0.55], [2500, 0.18]];
    const env = c.createGain(); env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.25, dur * 0.3)); env.gain.setValueAtTime(gain, t + dur * 0.7); env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (const [f, g] of F) { const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 7; const gg = c.createGain(); gg.gain.value = g; o.connect(bp); bp.connect(gg); gg.connect(env); }
    env.connect(bus); o.start(t); vib.start(t); o.stop(t + dur + 0.05); vib.stop(t + dur + 0.05);
  }
  pluck(t, midi, gain, bus) {
    const c = this.ctx, hz = 440 * Math.pow(2, (midi - 69) / 12);
    for (const [mul, g, d] of [[1, 1, 0.45], [2, 0.35, 0.22], [3.01, 0.12, 0.12]]) {
      const o = c.createOscillator(); o.type = mul === 1 ? 'triangle' : 'sine'; o.frequency.value = hz * mul;
      this.env(o, t, 0.003, gain * g, d).connect(bus); o.start(t); o.stop(t + d + 0.05);
    }
  }
  tom(t, f0, f1, gain, bus) {
    const c = this.ctx, o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + 0.28);
    this.env(o, t, 0.003, gain, 0.42).connect(bus); o.start(t); o.stop(t + 0.5);
    const n = this.noise(), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; n.connect(lp); this.env(lp, t, 0.002, gain * 0.25, 0.06).connect(bus); n.start(t); n.stop(t + 0.1);
  }
  play16(i, t) {
    const c = this.ctx, bus = this.bandBus;
    const bar = Math.floor(i / 16) % 4, s = i % 16, phrase = Math.floor(i / 64) % 2;
    const CH = [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]];     // Dm, Bb, F, C
    const ch = CH[bar], root = ch[0];
    // drums: 3+3+2 kicks, floor toms that answer, a rim click on the backbeat, claps on the second phrase
    if (s === 0 || s === 6) { const o = c.createOscillator(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18); this.env(o, t, 0.003, 0.95, 0.38).connect(bus); o.start(t); o.stop(t + 0.45); }
    if (s === 12) this.tom(t, 150, 80, 0.55, bus);
    if (s === 14 || (s === 10 && bar % 2)) this.tom(t, 110, 62, 0.5, bus);
    if (s === 3 && bar === 3) this.tom(t, 190, 110, 0.4, bus);
    if (s === 4 || s === 12) {
      const n = this.noise(), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1900; bp.Q.value = 4; n.connect(bp); this.env(bp, t, 0.001, 0.4, 0.035).connect(bus); n.start(t); n.stop(t + 0.06);
      const o = c.createOscillator(); o.type = 'square'; o.frequency.value = 820; this.env(o, t, 0.001, 0.08, 0.025).connect(bus); o.start(t); o.stop(t + 0.04);
      if (phrase === 1 && s === 12) for (const d of [0, 0.012, 0.025]) { const m = this.noise(), hp = c.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = 1300; hp.Q.value = 1.2; m.connect(hp); this.env(hp, t + d, 0.001, 0.32, 0.08).connect(bus); m.start(t + d); m.stop(t + d + 0.12); }
    }
    if (s % 4 === 2) { const n = this.noise(), hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5000; n.connect(hp); this.env(hp, t, 0.01, 0.035, 0.06).connect(bus); n.start(t); n.stop(t + 0.1); }   // a soft shaker
    // sub bass on the groove
    const bassAt = { 0: root - 12, 6: root - 12, 10: root - 5, 14: root };
    if (s in bassAt) {
      const hz = 440 * Math.pow(2, (bassAt[s] - 69) / 12), o = c.createOscillator(), o2 = c.createOscillator(); o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = hz; o2.frequency.value = hz * 2;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380; o2.connect(lp);
      const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + (s === 14 ? 0.25 : 0.42));
      o.connect(g); const g2 = c.createGain(); g2.gain.value = 0.18; lp.connect(g2); g2.connect(g); g.connect(bus); o.start(t); o2.start(t); o.stop(t + 0.5); o2.stop(t + 0.5);
    }
    // the mallet arpeggio: up and back through the chord, in the same lopsided groove
    const arp = [0, 3, 6, 8, 11, 14], k = arp.indexOf(s);
    if (k >= 0) { const notes = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24, ch[2] + 12, ch[1] + 12]; this.pluck(t, notes[k], 0.22, bus); }
    // the voices: an 'ooh' chord each bar, and a little 'ah' tune on the second phrase
    const beat16 = 60 / this.bpm / 4;
    if (s === 0) for (const m of ch) this.voice(t, m + 12, beat16 * 15.5, 'oo', 0.05, bus);
    const tune = [[0, 74, 5], [6, 72, 3], [10, 69, 6], [16, 70, 5], [22, 69, 3], [26, 65, 6], [32, 69, 6], [40, 72, 4], [44, 74, 4], [48, 72, 5], [54, 67, 3], [58, 69, 6]];
    if (phrase === 1) for (const [st, m, len] of tune) if (st === i % 64) this.voice(t, m, beat16 * len, 'ah', 0.09, bus);
  }
}
