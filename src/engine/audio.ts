// Minimal WebAudio mixer with SFX + Music buses. Mobile-safe: call resume() on first user gesture.

export class AudioEngine {
  private ctx: AudioContext;
  private master: GainNode;
  private sfxBus: GainNode;
  private musicBus: GainNode;

  constructor() {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AC();

    this.master = this.ctx.createGain();
    this.sfxBus = this.ctx.createGain();
    this.musicBus = this.ctx.createGain();

    this.sfxBus.connect(this.master);
    this.musicBus.connect(this.master);
    this.master.connect(this.ctx.destination);

    // Defaults (tweak later)
    this.master.gain.value = 0.8;
    this.sfxBus.gain.value = 1.0;
    this.musicBus.gain.value = 0.6;
  }

  async resume() {
    if (this.ctx.state !== "running") await this.ctx.resume();
  }

  setMusicVolume(v: number) { this.musicBus.gain.value = v; }
  setSfxVolume(v: number) { this.sfxBus.gain.value = v; }

  // Simple synth SFX (no samples needed for MVP)
  private playBeep(freq = 440, dur = 0.08, type: OscillatorType = "square", vol = 0.25) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o.type = type;
    o.frequency.value = freq;

    // Fast arcade envelope
    const t0 = this.ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    o.connect(g);
    g.connect(this.sfxBus);

    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  // SFX methods
  sfxGun() { this.playBeep(520, 0.06, "square", 0.18); }
  sfxRailCharge() { this.playBeep(180, 0.12, "sawtooth", 0.12); }
  sfxRailShot() { this.playBeep(90, 0.18, "sawtooth", 0.30); }
  sfxExplosion() { this.playBeep(60, 0.22, "triangle", 0.35); }
  sfxHit() { this.playBeep(200, 0.05, "square", 0.15); }
  sfxLaser() { this.playBeep(800, 0.1, "sawtooth", 0.12); }
  sfxMissileLaunch() { this.playBeep(300, 0.08, "square", 0.2); }
  
  // Prompt Strike: signature "anthem hit" (stack 2-3 tones)
  sfxPromptStrike() {
    this.playBeep(220, 0.25, "square", 0.25);
    this.playBeep(330, 0.25, "square", 0.22);
    this.playBeep(440, 0.25, "square", 0.20);
  }
}

