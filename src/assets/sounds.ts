import { AudioEngine } from "../engine/audio";

/**
 * Sound-Asset-Manager: Lädt und verwaltet alle Sound-Dateien
 */
export class SoundManager {
  private audioEngine: AudioEngine;
  
  // Background music buffers
  public backgroundLow: AudioBuffer | null = null;
  public backgroundMedium: AudioBuffer | null = null;
  public backgroundHigh: AudioBuffer | null = null;
  
  // SFX sound URLs (will be loaded on demand)
  public sfxGun: string | null = null;
  public sfxRailShot: string | null = null;
  public sfxExplosion: string | null = null;
  public sfxHit: string | null = null;
  public sfxLaser: string | null = null;
  public sfxMissileLaunch: string | null = null;
  public sfxPromptStrike: string | null = null;

  constructor(audioEngine: AudioEngine) {
    this.audioEngine = audioEngine;
  }

  /**
   * Lädt alle Sound-Dateien
   * @param baseUrl Base URL für Assets (z.B. '/assets/sounds/')
   */
  async loadAll(baseUrl: string = "/assets/sounds/"): Promise<void> {
    // Ensure baseUrl ends with /
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    
    // Load background music (required for dynamic music system)
    try {
      this.backgroundLow = await this.audioEngine.loadSound(`${baseUrl}background-low.wav`);
      if (!this.backgroundLow) {
        console.warn("Background music (low) konnte nicht geladen werden");
      }
    } catch (error) {
      console.warn("Background music (low) konnte nicht geladen werden:", error);
    }
    
    try {
      this.backgroundMedium = await this.audioEngine.loadSound(`${baseUrl}background-medium.wav`);
      if (!this.backgroundMedium) {
        console.warn("Background music (medium) konnte nicht geladen werden");
      }
    } catch (error) {
      console.warn("Background music (medium) konnte nicht geladen werden:", error);
    }
    
    try {
      this.backgroundHigh = await this.audioEngine.loadSound(`${baseUrl}background-high.wav`);
      if (!this.backgroundHigh) {
        console.warn("Background music (high) konnte nicht geladen werden");
      }
    } catch (error) {
      console.warn("Background music (high) konnte nicht geladen werden:", error);
    }
    
    // Pre-load SFX (optional - can be loaded on demand)
    // Store URLs for on-demand loading
    this.sfxGun = `${baseUrl}gun.wav`;
    this.sfxRailShot = `${baseUrl}rail-shot.wav`;
    this.sfxExplosion = `${baseUrl}explosion.wav`;
    this.sfxHit = `${baseUrl}hit.wav`;
    this.sfxLaser = `${baseUrl}laser.wav`;
    this.sfxMissileLaunch = `${baseUrl}missile-launch.wav`;
    this.sfxPromptStrike = `${baseUrl}prompt-strike.wav`;
    
    // Pre-load SFX (optional - comment out if you want on-demand loading)
    // await Promise.all([
    //   this.audioEngine.loadSound(this.sfxGun),
    //   this.audioEngine.loadSound(this.sfxRailShot),
    //   this.audioEngine.loadSound(this.sfxExplosion),
    //   this.audioEngine.loadSound(this.sfxHit),
    //   this.audioEngine.loadSound(this.sfxLaser),
    //   this.audioEngine.loadSound(this.sfxMissileLaunch),
    //   this.audioEngine.loadSound(this.sfxPromptStrike),
    // ]);
  }

  /**
   * Gibt die URL für einen SFX-Sound zurück
   */
  getSfxUrl(sfxName: keyof Omit<SoundManager, "audioEngine" | "backgroundLow" | "backgroundMedium" | "backgroundHigh" | "loadAll" | "getSfxUrl" | "updateBackgroundMusic">): string | null {
    return this[sfxName] as string | null;
  }

  /**
   * Startet die Hintergrundmusik (background-low.wav im Loop)
   */
  startBackgroundMusic(): void {
    this.audioEngine.startBackgroundMusic(this.backgroundLow);
  }

  /**
   * Stoppt die Hintergrundmusik
   */
  stopBackgroundMusic(): void {
    this.audioEngine.stopBackgroundMusic();
  }
}

