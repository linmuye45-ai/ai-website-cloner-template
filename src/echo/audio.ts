/**
 * Procedural audio. The game ships zero sound files, so every effect is
 * synthesised with the Web Audio API — instant load, no licensing, and the
 * whole soundtrack is a few hundred bytes of code.
 *
 * An AudioContext may only start after a user gesture, so nothing is created
 * until `unlock()` is called from the first pointer/key event.
 */
export class Synth {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private muted = false;
  private lastAt = new Map<string, number>();

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
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    this.startDrone();
  }

  setMuted(value: boolean): void {
    this.muted = value;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(value ? 0 : 0.5, this.ctx.currentTime, 0.05);
    }
  }

  get isMuted(): boolean {
    return this.muted;
  }

  /** Soft evolving pad so the arena never feels silent. */
  private startDrone(): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const gain = ctx.createGain();
    gain.gain.value = 0.055;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 6;

    const a = ctx.createOscillator();
    a.type = 'sawtooth';
    a.frequency.value = 55;
    const b = ctx.createOscillator();
    b.type = 'sawtooth';
    b.frequency.value = 55.4;
    const c = ctx.createOscillator();
    c.type = 'sine';
    c.frequency.value = 110;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    a.connect(filter);
    b.connect(filter);
    c.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    a.start();
    b.start();
    c.start();
    lfo.start();
    this.droneGain = gain;
  }

  /** Lowers the pad as the run gets more desperate. */
  setIntensity(t: number): void {
    if (!this.ctx || !this.droneGain) return;
    this.droneGain.gain.setTargetAtTime(0.05 + Math.min(0.05, t * 0.0002), this.ctx.currentTime, 0.4);
  }

  private throttled(key: string, ms: number): boolean {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const last = this.lastAt.get(key) ?? -1e9;
    if (now - last < ms) return true;
    this.lastAt.set(key, now);
    return false;
  }

  private tone(opts: {
    freq: number;
    to?: number;
    dur: number;
    type?: OscillatorType;
    gain?: number;
    delay?: number;
    filter?: number;
  }): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const t0 = ctx.currentTime + (opts.delay ?? 0);
    const osc = ctx.createOscillator();
    osc.type = opts.type ?? 'square';
    osc.frequency.setValueAtTime(opts.freq, t0);
    if (opts.to !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.to), t0 + opts.dur);
    }
    const gain = ctx.createGain();
    const peak = opts.gain ?? 0.18;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    let node: AudioNode = gain;
    if (opts.filter) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = opts.filter;
      gain.connect(f);
      node = f;
    }
    osc.connect(gain);
    node.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + opts.dur + 0.05);
  }

  private noise(dur: number, gainValue: number, freq: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const frames = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 2;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 1.2;
    const gain = ctx.createGain();
    gain.gain.value = gainValue;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    src.start();
  }

  echo(): void {
    if (this.throttled('echo', 90)) return;
    this.tone({ freq: 660, to: 880, dur: 0.16, type: 'sine', gain: 0.05 });
  }

  resonance(): void {
    if (this.throttled('res', 60)) return;
    this.tone({ freq: 320, to: 60, dur: 0.34, type: 'sawtooth', gain: 0.16, filter: 1800 });
    this.noise(0.22, 0.12, 900);
  }

  hurt(): void {
    if (this.throttled('hurt', 120)) return;
    this.tone({ freq: 180, to: 70, dur: 0.24, type: 'square', gain: 0.16, filter: 900 });
  }

  levelUp(): void {
    [523, 659, 784, 1046].forEach((f, i) =>
      this.tone({ freq: f, dur: 0.18, type: 'triangle', gain: 0.13, delay: i * 0.07 }),
    );
  }

  boss(): void {
    this.tone({ freq: 70, to: 40, dur: 1.1, type: 'sawtooth', gain: 0.2, filter: 300 });
    this.noise(0.8, 0.14, 200);
  }

  win(): void {
    [523, 659, 784, 1046, 1318].forEach((f, i) =>
      this.tone({ freq: f, dur: 0.5, type: 'triangle', gain: 0.14, delay: i * 0.11 }),
    );
  }

  dead(): void {
    [392, 330, 262, 196].forEach((f, i) =>
      this.tone({ freq: f, dur: 0.4, type: 'sawtooth', gain: 0.12, delay: i * 0.13, filter: 900 }),
    );
  }
}
