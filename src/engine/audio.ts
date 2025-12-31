// Minimal WebAudio mixer with SFX + Music buses. Mobile-safe: call resume() on first user gesture.
// Supports WAV file playback and dynamic background music based on heat.

/**
 * Individual volume levels for each SFX type (0.0 to 1.0)
 * Adjust these values to make sounds more or less dominant
 */
export interface SfxVolumes {
  gun: number;
  railShot: number;
  explosion: number;
  hit: number;
  laser: number;
  missileLaunch: number;
  promptStrike: number;
}

// Default volume levels - adjust these to balance sounds
const DEFAULT_SFX_VOLUMES: SfxVolumes = {
  gun: 0.1,           // Artillerie-Schuss
  railShot: 0.8,      // Railgun
  explosion: 0.5,     // Explosionen
  hit: 0.5,           // Treffer (nicht tödlich)
  laser: 0.3,         // Laser
  missileLaunch: 0.5, // Raketen-Start
  promptStrike: 0.9   // Prompt Strike (Ultimate)
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  
  // Sound cache for loaded WAV files
  private soundCache: Map<string, AudioBuffer> = new Map();
  
  // Individual SFX volume levels
  private sfxVolumes: SfxVolumes = { ...DEFAULT_SFX_VOLUMES };
  
  // Background music system
  private currentMusicSource: AudioBufferSourceNode | null = null;
  private currentMusicGain: GainNode | null = null;
  private currentMusicLevel: "low" | "medium" | "high" | null = null;
  private musicFadeTime = 0.5; // Crossfade duration in seconds
  private musicVolume = 0.6;

  private initContext() {
    if (this.ctx) return; // Bereits initialisiert
    
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
    this.initContext(); // Stelle sicher, dass Context initialisiert ist
    if (this.ctx && this.ctx.state !== "running") {
      await this.ctx.resume();
    }
  }

  setMusicVolume(v: number) { 
    this.initContext();
    this.musicVolume = v;
    if (this.musicBus) this.musicBus.gain.value = v; 
  }
  setSfxVolume(v: number) { 
    this.initContext();
    if (this.sfxBus) this.sfxBus.gain.value = v; 
  }

  /**
   * Set individual volume for a specific SFX type
   * @param type The SFX type
   * @param volume Volume level (0.0 to 1.0)
   */
  setSfxTypeVolume(type: keyof SfxVolumes, volume: number) {
    this.sfxVolumes[type] = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
  }

  /**
   * Get individual volume for a specific SFX type
   * @param type The SFX type
   * @returns Volume level (0.0 to 1.0)
   */
  getSfxTypeVolume(type: keyof SfxVolumes): number {
    return this.sfxVolumes[type];
  }

  /**
   * Set all SFX volumes at once
   * @param volumes Volume configuration object
   */
  setSfxVolumes(volumes: Partial<SfxVolumes>) {
    Object.assign(this.sfxVolumes, volumes);
  }

  /**
   * Get all SFX volumes
   * @returns Current volume configuration
   */
  getSfxVolumes(): SfxVolumes {
    return { ...this.sfxVolumes };
  }

  /**
   * Load a WAV file and cache it
   */
  async loadSound(url: string): Promise<AudioBuffer | null> {
    this.initContext();
    if (!this.ctx) return null;
    
    // Check cache first
    if (this.soundCache.has(url)) {
      return this.soundCache.get(url)!;
    }
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.soundCache.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load sound: ${url}`, error);
      return null;
    }
  }

  /**
   * Play a sound once (from cache or URL)
   */
  playSound(urlOrBuffer: string | AudioBuffer, volume: number = 1.0): void {
    this.initContext();
    if (!this.ctx || !this.sfxBus) return;
    
    const playBuffer = async () => {
      let buffer: AudioBuffer | null;
      
      if (typeof urlOrBuffer === "string") {
        buffer = this.soundCache.get(urlOrBuffer) || null;
        if (!buffer) {
          // Try to load it
          buffer = await this.loadSound(urlOrBuffer);
          if (!buffer) return;
        }
      } else {
        buffer = urlOrBuffer;
      }
      
      if (!buffer) return;
      
      const source = this.ctx!.createBufferSource();
      const gain = this.ctx!.createGain();
      
      source.buffer = buffer;
      gain.gain.value = volume;
      
      source.connect(gain);
      gain.connect(this.sfxBus!);
      
      source.start(0);
    };
    
    playBuffer();
  }

  /**
   * Play a sound in a loop (for background music)
   * Returns the source node and uses the provided gainNode for volume control
   */
  private playSoundLoop(buffer: AudioBuffer, gainNode: GainNode): AudioBufferSourceNode | null {
    this.initContext();
    if (!this.ctx || !this.musicBus) return null;
    
    const source = this.ctx.createBufferSource();
    
    source.buffer = buffer;
    source.loop = true;
    
    source.connect(gainNode);
    
    source.start(0);
    return source;
  }

  /**
   * Update background music based on heat level
   * Heat ranges: 0-50 (low), 50-100 (medium), 100+ (high)
   */
  updateBackgroundMusic(heat: number, lowMusic: AudioBuffer | null, mediumMusic: AudioBuffer | null, highMusic: AudioBuffer | null): void {
    this.initContext();
    if (!this.ctx || !this.musicBus) return;
    
    let targetLevel: "low" | "medium" | "high";
    let targetBuffer: AudioBuffer | null;
    
    if (heat < 50) {
      targetLevel = "low";
      targetBuffer = lowMusic;
    } else if (heat < 100) {
      targetLevel = "medium";
      targetBuffer = mediumMusic;
    } else {
      targetLevel = "high";
      targetBuffer = highMusic;
    }
    
    // If already playing the correct level, do nothing
    if (this.currentMusicLevel === targetLevel) return;
    
    // If no buffer available for target level, keep current or use fallback
    if (!targetBuffer) {
      // Try to use a fallback
      if (targetLevel === "medium" && lowMusic) targetBuffer = lowMusic;
      else if (targetLevel === "high" && mediumMusic) targetBuffer = mediumMusic;
      else if (!targetBuffer) return; // No music available
    }
    
    // Crossfade to new music
    const now = this.ctx.currentTime;
    const fadeTime = this.musicFadeTime;
    
    // Create gain node for new music
    const nextGain = this.ctx.createGain();
    nextGain.gain.value = 0;
    nextGain.connect(this.musicBus);
    
    // Start new music
    const nextSource = this.playSoundLoop(targetBuffer, nextGain);
    if (!nextSource) return;
    
    // Fade in new music
    nextGain.gain.setValueAtTime(0, now);
    nextGain.gain.linearRampToValueAtTime(this.musicVolume, now + fadeTime);
    
    // Fade out current music
    if (this.currentMusicGain && this.currentMusicSource) {
      this.currentMusicGain.gain.setValueAtTime(this.currentMusicGain.gain.value, now);
      this.currentMusicGain.gain.linearRampToValueAtTime(0, now + fadeTime);
      
      // Stop old source after fade
      this.currentMusicSource.stop(now + fadeTime);
    }
    
    // Update references
    this.currentMusicSource = nextSource;
    this.currentMusicGain = nextGain;
    this.currentMusicLevel = targetLevel;
  }

  /**
   * Stop background music
   */
  stopBackgroundMusic(): void {
    if (this.currentMusicSource) {
      try {
        this.currentMusicSource.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentMusicSource = null;
    }
    if (this.currentMusicGain) {
      this.currentMusicGain.disconnect();
      this.currentMusicGain = null;
    }
    this.currentMusicLevel = null;
  }

  // Simple synth SFX (no samples needed for MVP)
  private playBeep(freq = 440, dur = 0.08, type: OscillatorType = "square", vol = 0.25) {
    this.initContext();
    if (!this.ctx || !this.sfxBus) return; // Audio noch nicht initialisiert
    
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
    g.connect(this.sfxBus!);

    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  // SFX methods - try WAV first, fallback to synth
  // Uses individual volume levels from sfxVolumes
  sfxGun(url?: string) { 
    if (url) {
      this.playSound(url, this.sfxVolumes.gun);
    } else {
      this.playBeep(520, 0.06, "square", 0.18 * this.sfxVolumes.gun);
    }
  }
  
  sfxRailCharge(url?: string) { 
    // Not used anymore, but kept for compatibility
    if (url) {
      this.playSound(url, this.sfxVolumes.railShot);
    } else {
      this.playBeep(180, 0.12, "sawtooth", 0.12 * this.sfxVolumes.railShot);
    }
  }
  
  sfxRailShot(url?: string) { 
    if (url) {
      this.playSound(url, this.sfxVolumes.railShot);
    } else {
      this.playBeep(90, 0.18, "sawtooth", 0.30 * this.sfxVolumes.railShot);
    }
  }
  
  sfxExplosion(url?: string) { 
    if (url) {
      this.playSound(url, this.sfxVolumes.explosion);
    } else {
      this.playBeep(60, 0.22, "triangle", 0.35 * this.sfxVolumes.explosion);
    }
  }
  
  sfxHit(url?: string) { 
    if (url) {
      this.playSound(url, this.sfxVolumes.hit);
    } else {
      this.playBeep(200, 0.05, "square", 0.15 * this.sfxVolumes.hit);
    }
  }
  
  sfxLaser(url?: string) { 
    if (url) {
      this.playSound(url, this.sfxVolumes.laser);
    } else {
      this.playBeep(800, 0.1, "sawtooth", 0.12 * this.sfxVolumes.laser);
    }
  }
  
  sfxMissileLaunch(url?: string) { 
    if (url) {
      this.playSound(url, this.sfxVolumes.missileLaunch);
    } else {
      this.playBeep(300, 0.08, "square", 0.2 * this.sfxVolumes.missileLaunch);
    }
  }
  
  // Prompt Strike: signature "anthem hit" (stack 2-3 tones)
  sfxPromptStrike(url?: string) {
    if (url) {
      this.playSound(url, this.sfxVolumes.promptStrike);
    } else {
      const vol = this.sfxVolumes.promptStrike;
      this.playBeep(220, 0.25, "square", 0.25 * vol);
      this.playBeep(330, 0.25, "square", 0.22 * vol);
      this.playBeep(440, 0.25, "square", 0.20 * vol);
    }
  }
}

