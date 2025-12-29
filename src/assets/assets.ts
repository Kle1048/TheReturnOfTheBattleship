import { loadSpriteSheet, loadSprite, loadImage, extractPaletteFromImage } from "./sprite-loader";
import { AnimatedSprite } from "../engine/render/animation";
import { Sprite } from "../engine/render/blit";
import { VGA_PALETTE, RGBA } from "../engine/render/constants";

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
  public titleScreenSprite: Sprite | null = null;
  public titleScreenPalette: RGBA[] | null = null;
  public gameOverScreenSprite: Sprite | null = null;
  public gameOverScreenPalette: RGBA[] | null = null;
  public waterTile: Sprite | null = null;
  public waterTileSwapped: Sprite | null = null;

  /**
   * Lädt alle Sprites und Hintergründe
   */
  async loadAll(): Promise<void> {
    // Base URL für Assets (unterstützt GitHub Pages base path)
    // import.meta.env.BASE_URL wird von Vite automatisch gesetzt
    const baseUrl = (import.meta as any).env?.BASE_URL || '/';
    
    // Player Sprite Sheet: 4 Frames, 64x32 Pixel pro Frame
    // Erwartete Sheet-Größe: 256x32 Pixel (4 Frames horizontal)
    this.playerSprite = await loadSpriteSheet(
      `${baseUrl}assets/player.png`,
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
        `${baseUrl}assets/sea.png`,
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
        `${baseUrl}assets/boat.png`,
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
        `${baseUrl}assets/frigate.png`,
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
        `${baseUrl}assets/jet.png`,
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
        `${baseUrl}assets/drone.png`,
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

    // Title Screen Hintergrund: 320x200 Pixel
    // Extrahiere Palette aus dem Bild und verwende diese für bessere Farbqualität
    try {
      // Lade das Bild zuerst, um die Palette zu extrahieren
      const imageData = await loadImage(`${baseUrl}assets/title-screen.png`);
      this.titleScreenPalette = extractPaletteFromImage(imageData);
      
      // Lade das Sprite mit der extrahierten Palette
      this.titleScreenSprite = await loadSprite(`${baseUrl}assets/title-screen.png`, this.titleScreenPalette, true);
    } catch (error) {
      console.warn("Title Screen Bild konnte nicht geladen werden, verwende Standard-Hintergrund:", error);
      this.titleScreenSprite = null;
      this.titleScreenPalette = null;
    }

    // Game Over Screen Hintergrund: 320x200 Pixel
    // Extrahiere Palette aus dem Bild und verwende diese für bessere Farbqualität
    try {
      // Lade das Bild zuerst, um die Palette zu extrahieren
      const gameOverImageData = await loadImage(`${baseUrl}assets/game-over-screen.png`);
      this.gameOverScreenPalette = extractPaletteFromImage(gameOverImageData);
      
      // Lade das Sprite mit der extrahierten Palette
      this.gameOverScreenSprite = await loadSprite(`${baseUrl}assets/game-over-screen.png`, this.gameOverScreenPalette, true);
    } catch (error) {
      console.warn("Game Over Screen Bild konnte nicht geladen werden, verwende Standard-Hintergrund:", error);
      this.gameOverScreenSprite = null;
      this.gameOverScreenPalette = null;
    }

    // Wasser-Tile: 16x8 Pixel
    // Lade das normale Tile und erstelle eine Version mit getauschten Farben
    try {
      this.waterTile = await loadSprite(`${baseUrl}assets/water-tile.png`);
      // Erstelle Version mit getauschten Farben (Dunkelblau <-> Blau)
      this.waterTileSwapped = this.swapWaterTileColors(this.waterTile);
    } catch (error) {
      console.warn("Wasser-Tile konnte nicht geladen werden, verwende programmatisch erstelltes Tile:", error);
      this.waterTile = null;
      this.waterTileSwapped = null;
    }
  }

  /**
   * Tauscht die Farben in einem Wasser-Tile (Dunkelblau <-> Blau)
   * @param tile Das ursprüngliche Tile
   * @returns Ein neues Tile mit getauschten Farben
   */
  private swapWaterTileColors(tile: Sprite): Sprite {
    const swapped = new Uint8Array(tile.px.length);
    const darkBlue = 2; // Index 2: Dark Blue
    const blue = 3;     // Index 3: Blue
    
    for (let i = 0; i < tile.px.length; i++) {
      const color = tile.px[i];
      if (color === darkBlue) {
        swapped[i] = blue;
      } else if (color === blue) {
        swapped[i] = darkBlue;
      } else {
        swapped[i] = color; // Andere Farben bleiben unverändert
      }
    }
    
    return { w: tile.w, h: tile.h, px: swapped };
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

  /**
   * Gibt das Title Screen Sprite zurück
   * @returns Title Screen Sprite oder null wenn nicht geladen
   */
  getTitleScreenSprite(): Sprite | null {
    return this.titleScreenSprite;
  }

  /**
   * Gibt die Title Screen Palette zurück
   * @returns Title Screen Palette oder null wenn nicht geladen
   */
  getTitleScreenPalette(): RGBA[] | null {
    return this.titleScreenPalette;
  }

  /**
   * Gibt das Game Over Screen Sprite zurück
   * @returns Game Over Screen Sprite oder null wenn nicht geladen
   */
  getGameOverScreenSprite(): Sprite | null {
    return this.gameOverScreenSprite;
  }

  /**
   * Gibt die Game Over Screen Palette zurück
   * @returns Game Over Screen Palette oder null wenn nicht geladen
   */
  getGameOverScreenPalette(): RGBA[] | null {
    return this.gameOverScreenPalette;
  }

  /**
   * Gibt das Wasser-Tile zurück
   * @returns Wasser-Tile oder null wenn nicht geladen
   */
  getWaterTile(): Sprite | null {
    return this.waterTile;
  }

  /**
   * Gibt das Wasser-Tile mit getauschten Farben zurück
   * @returns Wasser-Tile mit getauschten Farben oder null wenn nicht geladen
   */
  getWaterTileSwapped(): Sprite | null {
    return this.waterTileSwapped;
  }
}

// Singleton-Instanz
export const assets = new AssetManager();

