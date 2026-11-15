// Fully procedural chiptune audio: every sound and the music bed are
// synthesized with the Web Audio API (oscillators + filtered noise). No
// external audio assets are loaded.

type SfxName =
  | "shoot"
  | "whip"
  | "hit"
  | "kill"
  | "gem"
  | "coin"
  | "levelup"
  | "chest"
  | "hurt"
  | "boss"
  | "click"
  | "open"
  | "lightning"
  | "nova"
  | "gameover"
  | "victory"
  | "unlock";

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicTimer: number | null = null;
  private step = 0;
  private intensity = 0;
  private nextNoteTime = 0;
  sfxVolume = 0.8;
  musicVolume = 0.55;
  private lastPlayed: Partial<Record<SfxName, number>> = {};

  resume(): void {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume();
  }

  private init(): void {
    if (typeof window === "undefined") return;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 1;
    this.master.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.sfxVolume;
    this.sfxGain.connect(this.master);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.musicVolume;
    this.musicGain.connect(this.master);
  }

  setSfxVolume(v: number): void {
    this.sfxVolume = v;
    if (this.sfxGain && this.ctx) this.sfxGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  setMusicVolume(v: number): void {
    this.musicVolume = v;
    if (this.musicGain && this.ctx) this.musicGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  setIntensity(i: number): void {
    this.intensity = Math.max(0, Math.min(2, i));
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    gain: number,
    when = 0,
    slideTo?: number,
    target?: GainNode,
  ): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(target ?? this.sfxGain);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private noise(dur: number, gain: number, filterFreq: number, when = 0, type: BiquadFilterType = "lowpass"): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime + when;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain);
    src.start(t);
  }

  play(name: SfxName): void {
    if (!this.ctx) return;
    const now = performance.now();
    const minGap = name === "hit" || name === "gem" || name === "shoot" ? 45 : 0;
    if (minGap && now - (this.lastPlayed[name] ?? 0) < minGap) return;
    this.lastPlayed[name] = now;

    switch (name) {
      case "shoot":
        this.tone(660 + Math.random() * 120, 0.09, "square", 0.12, 0, 320);
        break;
      case "whip":
        this.noise(0.16, 0.18, 1800, 0, "bandpass");
        break;
      case "hit":
        this.noise(0.06, 0.1, 900);
        this.tone(220, 0.05, "triangle", 0.08, 0, 140);
        break;
      case "kill":
        this.tone(320, 0.14, "square", 0.1, 0, 90);
        this.noise(0.1, 0.06, 500);
        break;
      case "gem":
        this.tone(880, 0.07, "sine", 0.12);
        this.tone(1320, 0.1, "sine", 0.1, 0.06);
        break;
      case "coin":
        this.tone(988, 0.06, "square", 0.09);
        this.tone(1319, 0.12, "square", 0.08, 0.05);
        break;
      case "levelup":
        [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.16, "square", 0.12, i * 0.08));
        break;
      case "chest":
        [392, 523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.2, "triangle", 0.13, i * 0.09));
        break;
      case "hurt":
        this.tone(180, 0.2, "sawtooth", 0.16, 0, 60);
        this.noise(0.12, 0.12, 400);
        break;
      case "boss":
        this.tone(90, 0.9, "sawtooth", 0.22, 0, 45);
        this.tone(135, 0.9, "square", 0.12, 0.05, 60);
        break;
      case "click":
        this.tone(520, 0.05, "square", 0.08);
        break;
      case "open":
        this.tone(440, 0.08, "triangle", 0.1, 0, 660);
        break;
      case "lightning":
        this.noise(0.25, 0.2, 2600, 0, "highpass");
        this.tone(1200, 0.2, "sawtooth", 0.08, 0, 200);
        break;
      case "nova":
        this.tone(160, 0.35, "sawtooth", 0.14, 0, 700);
        this.noise(0.3, 0.1, 1200);
        break;
      case "unlock":
        [659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.18, "triangle", 0.12, i * 0.1));
        break;
      case "gameover":
        [440, 392, 330, 262].forEach((f, i) => this.tone(f, 0.35, "sawtooth", 0.12, i * 0.22));
        break;
      case "victory":
        [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) =>
          this.tone(f, 0.22, "square", 0.12, i * 0.13),
        );
        break;
    }
  }

  // --- looping adaptive music -------------------------------------------------

  startMusic(): void {
    if (!this.ctx) this.init();
    if (!this.ctx || this.musicTimer !== null) return;
    this.step = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.08;
    const tick = (): void => {
      if (!this.ctx) return;
      const ahead = 0.18;
      while (this.nextNoteTime < this.ctx.currentTime + ahead) {
        this.scheduleStep(this.step, this.nextNoteTime);
        this.nextNoteTime += 60 / 112 / 2; // eighth notes at 112 bpm
        this.step = (this.step + 1) % 32;
      }
    };
    tick();
    this.musicTimer = window.setInterval(tick, 60);
  }

  stopMusic(): void {
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private scheduleStep(step: number, t: number): void {
    if (!this.ctx || !this.musicGain) return;
    // A minor: A2 C3 D3 E3 G3 A3 C4 D4 E4 G4
    const bass = [110, 110, 130.81, 110, 146.83, 146.83, 130.81, 110];
    const arp = [220, 261.63, 329.63, 440, 392, 329.63, 261.63, 220];
    const bar = Math.floor(step / 8) % 4;
    const rootShift = [0, -4, 7, 2][bar]; // simple i - VI - III - VII movement in semitones
    const shift = Math.pow(2, rootShift / 12);

    if (step % 4 === 0) {
      this.musicTone(bass[step % 8] * shift, 0.34, "triangle", 0.16, t);
    }
    if (this.intensity >= 1 && step % 2 === 0) {
      this.musicTone(arp[step % 8] * shift, 0.16, "square", 0.07, t);
    }
    if (this.intensity >= 2) {
      if (step % 8 === 3 || step % 8 === 7) this.musicNoise(0.06, 0.05, 6000, t);
      if (step % 8 === 0) this.musicNoise(0.12, 0.09, 200, t);
    }
  }

  private musicTone(freq: number, dur: number, type: OscillatorType, gain: number, t: number): void {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.musicGain);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private musicNoise(dur: number, gain: number, filterFreq: number, t: number): void {
    if (!this.ctx || !this.musicGain) return;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    g.gain.value = gain;
    src.connect(filter);
    filter.connect(g);
    g.connect(this.musicGain);
    src.start(t);
  }

  dispose(): void {
    this.stopMusic();
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
  }
}

export const audio = new AudioEngine();
