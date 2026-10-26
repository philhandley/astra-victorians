// Sounds for the bathing-machine game, all made in the browser with WebAudio (no files): the engine hum, splashes,
// the slide's whoosh, the horn, cheers, the fountains, and the band's rock song (drums, bass, guitar chords, a tune).
export class Sound {
  constructor() { this.on = true; this.ctx = null; this.bandOn = false; this.bpm = 124; }
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const c = this.ctx = new AC();
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
      this.dist = c.createWaveShaper(); this.dist.curve = (() => { const n = 1024, k = 24, a = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / n * 2 - 1; a[i] = (1 + k) * x / (1 + k * Math.abs(x)); } return a; })();
      const glp = c.createBiquadFilter(); glp.type = 'lowpass'; glp.frequency.value = 2400;
      this.guitarIn = c.createGain(); this.guitarIn.gain.value = 0.5; this.guitarIn.connect(this.dist); this.dist.connect(glp);
      const gOut = c.createGain(); gOut.gain.value = 0.22; glp.connect(gOut); gOut.connect(this.bandBus);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (this.bandOn && !this.timer) this.band(true);
    return this.ctx;
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
  pop() {
    if (!this.ensure()) return;
    const c = this.ctx, t = c.currentTime, o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(500, t); o.frequency.exponentialRampToValueAtTime(1100, t + 0.08);
    this.env(o, t, 0.005, 0.18, 0.12).connect(this.master); o.start(t); o.stop(t + 0.2);
  }
  // ---------------------------------------------------------------- the band: a cheerful four-chord rock song
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
  play16(i, t) {
    const c = this.ctx, bus = this.bandBus;
    const bar = Math.floor(i / 16) % 4, s = i % 16;
    const roots = [48, 43, 45, 41];                  // C, G, A minor, F
    const root = roots[bar];
    const hz = m => 440 * Math.pow(2, (m - 69) / 12);
    // drums
    if (s % 8 === 0 || s === 10) { const o = c.createOscillator(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12); this.env(o, t, 0.003, 0.9, 0.28).connect(bus); o.start(t); o.stop(t + 0.35); }
    if (s === 4 || s === 12) {
      const n = this.noise(), f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1300; n.connect(f); this.env(f, t, 0.002, 0.45, 0.16).connect(bus); n.start(t); n.stop(t + 0.25);
      const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = 190; this.env(o, t, 0.002, 0.3, 0.09).connect(bus); o.start(t); o.stop(t + 0.12);
    }
    if (s % 2 === 0) { const n = this.noise(), f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7500; n.connect(f); this.env(f, t, 0.001, s % 4 === 2 ? 0.16 : 0.09, 0.04).connect(bus); n.start(t); n.stop(t + 0.08); }
    // bass: eighth notes on the root, up an octave at the end of the bar
    if (s % 2 === 0) {
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(root - 12 + (s >= 12 ? 12 : 0));
      const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 520; o.connect(f);
      this.env(f, t, 0.005, 0.32, 0.2).connect(bus); o.start(t); o.stop(t + 0.25);
    }
    // guitar: power chords, chugging eighths, a big one on each bar
    if (s % 2 === 0) {
      const long = s === 0 ? 0.9 : 0.12;
      for (const m of [root, root + 7, root + 12]) {
        const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(m + 12); o.detune.value = (Math.random() - 0.5) * 12;
        this.env(o, t, 0.004, s === 0 ? 0.5 : 0.28, long).connect(this.guitarIn); o.start(t); o.stop(t + long + 0.05);
      }
    }
    // the tune: a sing-song line over the top
    const tune = [[72, 0], [74, 4], [76, 6], [74, 10], [71, 0 + 16], [74, 4 + 16], [74, 8 + 16], [72, 12 + 16], [72, 32], [76, 36], [79, 38], [76, 42], [77, 48], [76, 52], [74, 56], [72, 60]];
    const pos = i % 64;
    for (const [m, st] of tune) if (st === pos) {
      const o = c.createOscillator(); o.type = 'square'; o.frequency.value = hz(m);
      const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2200; o.connect(f);
      const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.02); g.gain.setValueAtTime(0.09, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      f.connect(g); g.connect(bus); o.start(t); o.stop(t + 0.55);
    }
  }
}
