/**
 * Procedural audio, synthesised at runtime — the game ships no sound files.
 * Design: every cue is metallic or breathy (blade, stone, ember), never chiptune.
 * Nothing is created until the first user gesture unlocks the context.
 */
export class Synth {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  private last = new Map<string, number>();

  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    if (typeof window === 'undefined') return;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0.42;
    master.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    this.drone();
  }

  setMuted(v: boolean): void {
    this.muted = v;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(v ? 0 : 0.42, this.ctx.currentTime, 0.05);
    }
  }

  get isMuted(): boolean {
    return this.muted;
  }

  /** Low, unstable room tone: a stone hall that is never quite silent. */
  private drone(): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const g = ctx.createGain();
    g.gain.value = 0.05;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 300;
    f.Q.value = 5;

    const a = ctx.createOscillator();
    a.type = 'sawtooth';
    a.frequency.value = 41;
    const b = ctx.createOscillator();
    b.type = 'sawtooth';
    b.frequency.value = 41.6;
    a.connect(f);
    b.connect(f);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.07;
    const lg = ctx.createGain();
    lg.gain.value = 120;
    lfo.connect(lg);
    lg.connect(f.frequency);

    f.connect(g);
    g.connect(master);
    a.start();
    b.start();
    lfo.start();
  }

  private throttle(key: string, ms: number): boolean {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const prev = this.last.get(key) ?? -1e9;
    if (now - prev < ms) return true;
    this.last.set(key, now);
    return false;
  }

  private tone(o: {
    freq: number;
    to?: number;
    dur: number;
    type?: OscillatorType;
    gain?: number;
    delay?: number;
    filter?: number;
    q?: number;
  }): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const t0 = ctx.currentTime + (o.delay ?? 0);
    const osc = ctx.createOscillator();
    osc.type = o.type ?? 'triangle';
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.to !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(18, o.to), t0 + o.dur);
    }
    const g = ctx.createGain();
    const peak = o.gain ?? 0.16;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    let node: AudioNode = g;
    if (o.filter) {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = o.filter;
      bp.Q.value = o.q ?? 3;
      g.connect(bp);
      node = bp;
    }
    osc.connect(g);
    node.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + o.dur + 0.05);
  }

  private noise(dur: number, gain: number, freq: number, q = 1): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i += 1) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 2.2;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start();
  }

  /** Blade leaving the sheath — a short metallic chiff. */
  sword(): void {
    if (this.throttle('sw', 70)) return;
    this.noise(0.12, 0.09, 2600, 2.4);
    this.tone({ freq: 900, to: 1500, dur: 0.09, type: 'square', gain: 0.045, filter: 2400, q: 5 });
  }

  hit(): void {
    if (this.throttle('hit', 55)) return;
    this.noise(0.1, 0.13, 600, 1.1);
    this.tone({ freq: 150, to: 60, dur: 0.14, type: 'sawtooth', gain: 0.11, filter: 700 });
  }

  /** Perfect parry: bronze clang plus a long ringing tail, the money sound. */
  parry(): void {
    this.tone({ freq: 2100, to: 1500, dur: 0.5, type: 'triangle', gain: 0.1, filter: 3000, q: 9 });
    this.tone({ freq: 1180, dur: 0.75, type: 'sine', gain: 0.07 });
    this.noise(0.16, 0.16, 3400, 3);
  }

  mine(): void {
    if (this.throttle('mine', 90)) return;
    this.noise(0.09, 0.09, 900, 1.4);
    this.tone({ freq: 220, to: 120, dur: 0.1, type: 'square', gain: 0.05, filter: 600 });
  }

  /** Ore tapped: bright, rewarding, slightly glassy. */
  ore(): void {
    this.tone({ freq: 1240, to: 1860, dur: 0.22, type: 'sine', gain: 0.1 });
    this.tone({ freq: 2480, dur: 0.16, type: 'sine', gain: 0.045, delay: 0.03 });
  }

  hurt(): void {
    if (this.throttle('hurt', 140)) return;
    this.noise(0.24, 0.15, 280, 0.9);
    this.tone({ freq: 120, to: 48, dur: 0.3, type: 'sawtooth', gain: 0.14, filter: 420 });
  }

  kill(): void {
    this.noise(0.28, 0.1, 380, 0.8);
    this.tone({ freq: 96, to: 40, dur: 0.34, type: 'triangle', gain: 0.1 });
  }

  bankTone(): void {
    [392, 523, 659].forEach((f, i) =>
      this.tone({ freq: f, dur: 0.55, type: 'sine', gain: 0.09, delay: i * 0.09 }),
    );
  }

  buyTone(): void {
    this.tone({ freq: 660, to: 990, dur: 0.2, type: 'triangle', gain: 0.1 });
  }

  death(): void {
    [220, 175, 139, 104].forEach((f, i) =>
      this.tone({ freq: f, dur: 0.9, type: 'sawtooth', gain: 0.1, delay: i * 0.18, filter: 640 }),
    );
    this.noise(1.1, 0.12, 200, 0.7);
  }

  /** Depth milestone: a low, wide bell that marks the descent. */
  descend(): void {
    this.tone({ freq: 98, dur: 1.4, type: 'sine', gain: 0.13 });
    this.tone({ freq: 147, dur: 1.1, type: 'sine', gain: 0.06, delay: 0.08 });
  }

  uiMove(): void {
    if (this.throttle('ui', 40)) return;
    this.tone({ freq: 520, dur: 0.05, type: 'square', gain: 0.03 });
  }

  /** Ember crackle used sparingly for ambience at braziers. */
  ember(): void {
    if (this.throttle('ember', 900)) return;
    this.noise(0.3, 0.035, 1800, 1.6);
  }
}
