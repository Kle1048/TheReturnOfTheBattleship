import { loadSpriteSheet } from "./sprite-loader";
import { AnimatedSprite } from "../engine/render/animation";

/**
 * Asset-Manager: Lädt und verwaltet alle Sprites und Hintergründe
 */
export class AssetManager {
  public playerSprite: AnimatedSprite | null = null;
  public seaSprite: AnimatedSprite | null = null;
  public boatSprite: AnimatedSprite | null = null;
  public frigateSprite: AnimatedSprite | null = null;
  public jetSprite: AnimatedSprite | null = null;
  public droneSprite: AnimatedSprite | null = null;

  /**
   * Lädt alle Sprites und Hintergründe
   */
  async loadAll(): Promise<void> {
    // Player Sprite Sheet: 4 Frames, 64x32 Pixel pro Frame
    // Erwartete Sheet-Größe: 256x32 Pixel (4 Frames horizontal)
    this.playerSprite = await loadSpriteSheet(
      "assets/player.png",
      64,  // frameWidth
      32,  // frameHeight
      {
        framesPerRow: 4,
        frameCount: 4
      }
    );

    // Meer-Hintergrund: Sprite Sheet mit 4 Frames, 32x32 Pixel pro Frame
    // Erwartete Sheet-Größe: 128x32 Pixel (4 Frames horizontal)
    try {
      this.seaSprite = await loadSpriteSheet(
        "assets/sea.png",
        32,  // frameWidth
        32,  // frameHeight
        {
          framesPerRow: 4,
          frameCount: 4
        }
      );
    } catch (error) {
      console.warn("Meer-Hintergrund konnte nicht geladen werden, verwende Standard-Pattern:", error);
      this.seaSprite = null;
    }

    // Boot (Boat) Sprite Sheet: 2 Frames, 28x20 Pixel pro Frame
    // Erwartete Sheet-Größe: 56x20 Pixel (2 Frames horizontal)
    try {
      this.boatSprite = await loadSpriteSheet(
        "assets/boat.png",
        28,  // frameWidth
        20,  // frameHeight
        {
          framesPerRow: 2,
          frameCount: 2
        }
      );
    } catch (error) {
      console.warn("Boot-Sprite konnte nicht geladen werden, verwende Standard-Sprite:", error);
      this.boatSprite = null;
    }

    // Fregatte (Frigate) Sprite Sheet: 2 Frames, 36x24 Pixel pro Frame
    // Erwartete Sheet-Größe: 72x24 Pixel (2 Frames horizontal)
    try {
      this.frigateSprite = await loadSpriteSheet(
        "assets/frigate.png",
        36,  // frameWidth
        24,  // frameHeight
        {
          framesPerRow: 2,
          frameCount: 2
        }
      );
    } catch (error) {
      console.warn("Fregatte-Sprite konnte nicht geladen werden, verwende Standard-Sprite:", error);
      this.frigateSprite = null;
    }

    // Jet Sprite Sheet: 2 Frames, 24x16 Pixel pro Frame
    // Erwartete Sheet-Größe: 48x16 Pixel (2 Frames horizontal)
    try {
      this.jetSprite = await loadSpriteSheet(
        "assets/jet.png",
        24,  // frameWidth
        16,  // frameHeight
        {
          framesPerRow: 2,
          frameCount: 2
        }
      );
    } catch (error) {
      console.warn("Jet-Sprite konnte nicht geladen werden, verwende Standard-Sprite:", error);
      this.jetSprite = null;
    }

    // Drohne (Drone) Sprite Sheet: 2 Frames, 12x12 Pixel pro Frame
    // Erwartete Sheet-Größe: 24x12 Pixel (2 Frames horizontal)
    try {
      this.droneSprite = await loadSpriteSheet(
        "assets/drone.png",
        12,  // frameWidth
        12,  // frameHeight
        {
          framesPerRow: 2,
          frameCount: 2
        }
      );
    } catch (error) {
      console.warn("Drohne-Sprite konnte nicht geladen werden, verwende Standard-Sprite:", error);
      this.droneSprite = null;
    }
  }

  /**
   * Gibt das Player Sprite zurück
   * @throws Error wenn Sprites noch nicht geladen wurden
   */
  getPlayerSprite(): AnimatedSprite {
    if (!this.playerSprite) {
      throw new Error("Sprites noch nicht geladen! Rufe loadAll() auf.");
    }
    return this.playerSprite;
  }

  /**
   * Gibt das Meer Sprite Sheet zurück
   * @returns Meer AnimatedSprite oder null wenn nicht geladen
   */
  getSeaSprite(): AnimatedSprite | null {
    return this.seaSprite;
  }

  /**
   * Gibt das Boot Sprite Sheet zurück
   * @returns Boot AnimatedSprite oder null wenn nicht geladen
   */
  getBoatSprite(): AnimatedSprite | null {
    return this.boatSprite;
  }

  /**
   * Gibt das Fregatte Sprite Sheet zurück
   * @returns Fregatte AnimatedSprite oder null wenn nicht geladen
   */
  getFrigateSprite(): AnimatedSprite | null {
    return this.frigateSprite;
  }

  /**
   * Gibt das Jet Sprite Sheet zurück
   * @returns Jet AnimatedSprite oder null wenn nicht geladen
   */
  getJetSprite(): AnimatedSprite | null {
    return this.jetSprite;
  }

  /**
   * Gibt das Drohne Sprite Sheet zurück
   * @returns Drohne AnimatedSprite oder null wenn nicht geladen
   */
  getDroneSprite(): AnimatedSprite | null {
    return this.droneSprite;
  }
}

// Singleton-Instanz
export const assets = new AssetManager();

