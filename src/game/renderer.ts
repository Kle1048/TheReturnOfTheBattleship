import { VGARenderer } from "../engine/render/renderer";
import { blit, drawLine, fillRect } from "../engine/render/blit";
import { W, H, SEA_Y, SEA_HEIGHT, VGA_PALETTE } from "../engine/render/constants";
import { Entity, EntityType } from "./entities/entity";
import { createSkyPattern, createSeaPattern, createWaterTile } from "../assets/sprites";
import { renderHUD } from "../ui/hud";
import { renderTitleScreen, renderGameOverScreen, renderPauseScreen, renderHelpScreen } from "../ui/menu";
import { renderText } from "../ui/font";
import { assets } from "../assets/assets";
import { AnimatedSprite, AnimationState, createAnimationState, updateAnimation } from "../engine/render/animation";
import { Sprite } from "../engine/render/blit";

export class GameRenderer {
  private skyPattern: Uint8Array;
  private seaAnimationState: AnimationState | null = null;
  private seaPatternFallback: Uint8Array; // Fallback für wenn kein Sprite Sheet geladen wurde
  private skyScroll = 0;
  private seaScroll = 0;
  private seaScrollY = 0; // Y-Offset für Wasser-Scrolling
  private waterTile: Sprite = createWaterTile(false); // Wasser-Tile (initialized with fallback)
  private randomPixelTimer = 0; // Timer für zufällige Pixel-Erstellung
  private randomPixelInterval = 50; // Alle 50ms neue Pixel erstellen
  private randomPixels: Array<{ baseX: number; baseY: number; color: number; createdAt: number }> = []; // Pixel mit relativen Positionen und Timestamp
  private pixelLifetime = 1000; // Pixel bleiben 1 Sekunde
  private lastState: "title" | "running" | "pause" | "help" | "gameover" | null = null;

  constructor() {
    this.skyPattern = createSkyPattern();
    this.seaPatternFallback = createSeaPattern();
    // Initialisiere Wasser-Tiles (werden aus Assets geladen oder programmatisch erstellt)
    this.initWaterTiles();
    // Initialisiere Meer-Animation falls Sprite Sheet geladen wurde
    this.initSeaAnimation();
  }

  /**
   * Initialisiert das Wasser-Tile (aus Assets oder programmatisch)
   */
  private initWaterTiles(): void {
    try {
      const loadedTile = assets.getWaterTile();
      
      if (loadedTile) {
        // Verwende geladenes Tile aus PNG
        this.waterTile = loadedTile;
      } else {
        // Fallback: Erstelle programmatisch
        this.waterTile = createWaterTile(false);
      }
    } catch (error) {
      // Fallback: Erstelle programmatisch
      this.waterTile = createWaterTile(false);
    }
  }

  /**
   * Initialisiert die Meer-Animation falls ein Sprite Sheet geladen wurde
   */
  private initSeaAnimation(): void {
    try {
      const seaSprite = assets.getSeaSprite();
      if (seaSprite) {
        // Erstelle Animation State: 200ms pro Frame, loopt
        this.seaAnimationState = createAnimationState(seaSprite, 200, true);
      }
    } catch (error) {
      // Assets noch nicht geladen oder kein Sprite Sheet vorhanden
      this.seaAnimationState = null;
    }
  }

  render(
    renderer: VGARenderer,
    state: "title" | "running" | "pause" | "help" | "gameover",
    entities: Entity[],
    player: any,
    weapons: any,
    director: any,
    score: number,
    bestScore: number,
    screenShake: { x: number; y: number },
    laserTarget: Entity | null = null,
    laserBeamTarget: { x: number; y: number } | null = null,
    samTarget: Entity | null = null,
    flashTime: number = 0,
    dt: number = 16 // Delta time für Animation
  ) {
    const fb = renderer.fb;
    
    // Palette-Management: Wechsle zwischen verschiedenen Paletten je nach State
    if (state === "title" && this.lastState !== "title") {
      // Wechsle zu Title Screen Palette
      const titlePalette = assets.getTitleScreenPalette();
      if (titlePalette) {
        renderer.palette = [...titlePalette];
      }
    } else if (state === "gameover" && this.lastState !== "gameover") {
      // Wechsle zu Game Over Screen Palette
      const gameOverPalette = assets.getGameOverScreenPalette();
      if (gameOverPalette) {
        renderer.palette = [...gameOverPalette];
      }
    } else if ((state === "running" || state === "pause" || state === "help") && 
               (this.lastState === "title" || this.lastState === "gameover")) {
      // Wechsle zurück zu VGA Palette beim Spielstart
      renderer.palette = [...VGA_PALETTE];
    }
    this.lastState = state;
    
    if (state === "title") {
      renderTitleScreen(fb);
      return;
    }
    
    if (state === "pause") {
      renderPauseScreen(fb);
      return;
    }
    
    if (state === "help") {
      renderHelpScreen(fb);
      return;
    }
    
    if (state === "gameover") {
      renderGameOverScreen(fb, score, bestScore);
      return;
    }
    
    // Clear screen
    renderer.clear(2); // Dark blue background
    
    // Apply screen shake offset
    const shakeX = Math.floor(screenShake.x);
    const shakeY = Math.floor(screenShake.y);
    
    // Draw sky background (optimized: use fillRect instead of pixel-by-pixel)
    this.skyScroll += 0.01;
    fillRect(fb, 0, 0, W, SEA_Y, 3); // Light blue sky
    
    // Update Wasser-Scrolling und Farbtausch
    this.updateWaterAnimation(dt);
    
    // Draw sea background (animiert oder Fallback)
    this.drawSeaBackground(fb, dt);
    
    // Sort entities by type and Y-position for proper layering
    // Entities further down (higher Y) should be rendered first (in front)
    // Entities further up (lower Y) should be rendered later (in background)
    const sortedEntities = [...entities].sort((a, b) => {
      // First, sort by type for proper layering
      // Explosions and effects on top
      if (a.type === EntityType.EXPLOSION && b.type !== EntityType.EXPLOSION) return 1;
      if (b.type === EntityType.EXPLOSION && a.type !== EntityType.EXPLOSION) return -1;
      // Projectiles above enemies
      if ((a.type === EntityType.BULLET || a.type === EntityType.RAILGUN_BEAM) &&
          b.type !== EntityType.EXPLOSION && 
          b.type !== EntityType.BULLET && b.type !== EntityType.RAILGUN_BEAM) return 1;
      if ((b.type === EntityType.BULLET || b.type === EntityType.RAILGUN_BEAM) &&
          a.type !== EntityType.EXPLOSION && 
          a.type !== EntityType.BULLET && a.type !== EntityType.RAILGUN_BEAM) return -1;
      // Air enemies above sea enemies
      if ((a.type === EntityType.ENEMY_DRONE || a.type === EntityType.ENEMY_JET) &&
          (b.type === EntityType.ENEMY_BOAT || b.type === EntityType.ENEMY_FRIGATE)) return -1;
      if ((b.type === EntityType.ENEMY_DRONE || b.type === EntityType.ENEMY_JET) &&
          (a.type === EntityType.ENEMY_BOAT || a.type === EntityType.ENEMY_FRIGATE)) return 1;
      
      // If same type (or both are enemies), sort by Y-position
      // Higher Y values (further down) should be rendered first (in front)
      // Lower Y values (further up) should be rendered later (in background)
      return b.y - a.y;
    });
    
    // Draw entities
    for (const entity of sortedEntities) {
      // Skip dead entities (except explosions and railgun beams which use lifetime)
      if (entity.hp !== undefined && entity.hp <= 0 && 
          entity.type !== EntityType.EXPLOSION && 
          entity.type !== EntityType.RAILGUN_BEAM) continue;
      
      const x = Math.floor(entity.x + shakeX - entity.sprite.w / 2);
      const y = Math.floor(entity.y + shakeY - entity.sprite.h / 2);
      blit(fb, entity.sprite, x, y);
    }
    
    // Draw Prompt Strike indicator in center of screen when ready
    if (weapons.canUsePromptStrike()) {
      const promptText = "Press Q for Prompt Strike";
      const textWidth = promptText.length * 8; // 8 pixels per character
      const textX = Math.floor((W - textWidth) / 2); // Center horizontally
      const textY = 40; // Upper half (H/5 = 40)
      renderText(fb, promptText, textX, textY, 11); // Orange color
    }
    
    // Draw LASER marker in upper half and center of screen when target is in range
    if (laserTarget && laserTarget.hp !== undefined && laserTarget.hp > 0) {
      const laserText = "LASER";
      const textWidth = laserText.length * 8; // 8 pixels per character
      const textX = Math.floor((W - textWidth) / 2); // Center horizontally
      const textY = 48; // One line below Prompt Strike (40 + 8 = 48)
      renderText(fb, laserText, textX, textY, 11); // Orange color
    }
    
    // Draw laser beam (bright red line from player to target when firing)
    if (weapons.isLaserBeamVisible() && laserBeamTarget) {
      const playerX = Math.floor(player.entity.x + shakeX);
      const playerY = Math.floor(player.entity.y + shakeY);
      const targetX = Math.floor(laserBeamTarget.x + shakeX);
      const targetY = Math.floor(laserBeamTarget.y + shakeY);
      
      // Draw bright red line from player to target (with thickness for visibility)
      drawLine(fb, playerX, playerY, targetX, targetY, 12); // Color 12 = Bright Red
      // Draw additional lines for thickness (making it more visible)
      drawLine(fb, playerX - 1, playerY, targetX - 1, targetY, 12);
      drawLine(fb, playerX + 1, playerY, targetX + 1, targetY, 12);
      drawLine(fb, playerX, playerY - 1, targetX, targetY - 1, 12);
      drawLine(fb, playerX, playerY + 1, targetX, targetY + 1, 12);
    }
    
    // Draw HUD
    renderHUD(
      renderer,
      player.hp,
      player.maxHp,
      weapons.powerMeter,
      score,
      director.heat,
      0 // Laser heat no longer used
    );
    
    // Draw flash effect (white overlay for Prompt Strike)
    // Optimized: pre-calculate which columns to draw (vertical stripes)
    if (flashTime > 0) {
      const maxFlashDuration = 150; // ms
      const intensity = Math.max(0, Math.min(1, flashTime / maxFlashDuration)); // Clamp between 0 and 1
      
      // Only draw flash if intensity is significant
      if (intensity > 0.01) {
        // Optimized: pre-calculate stripe pattern for columns (vertical stripes)
        const stripeWidth = 3;
        const whiteColor = 9;
        const columnsToDraw = new Array<boolean>(W);
        for (let x = 0; x < W; x++) {
          const stripeIndex = Math.floor(x / stripeWidth);
          const stripePatternValue = (stripeIndex % 20) / 20;
          columnsToDraw[x] = stripePatternValue < intensity;
        }
        
        // Apply pattern to all rows
        for (let y = 0; y < H; y++) {
          const rowOffset = y * W;
          for (let x = 0; x < W; x++) {
            if (columnsToDraw[x]) {
              fb[rowOffset + x] = whiteColor;
            }
          }
        }
      }
    }
  }

  /**
   * Aktualisiert Wasser-Animation (Scrolling)
   */
  private updateWaterAnimation(dt: number): void {
    // Scrolling-Offset aktualisieren (nur horizontal nach rechts)
    this.seaScroll += 0.02 * dt; // X-Offset (nach rechts)
    // this.seaScrollY += 0.01 * dt; // Y-Offset (auskommentiert für nur horizontales Scrolling)
    
    // Timer für zufällige Pixel-Erstellung aktualisieren
    this.randomPixelTimer += dt;
    
    // Entferne alte Pixel (älter als 1 Sekunde) - optimiert: nur wenn nötig
    // Prüfe nur alle ~100ms, nicht bei jedem Frame
    if (this.randomPixelTimer % 100 < dt || this.randomPixels.length > 150) {
      const currentTime = Date.now();
      const cutoffTime = currentTime - this.pixelLifetime;
      // In-place Filtering: entferne alte Pixel ohne neues Array zu erstellen
      let writeIndex = 0;
      for (let i = 0; i < this.randomPixels.length; i++) {
        if (this.randomPixels[i].createdAt >= cutoffTime) {
          if (writeIndex !== i) {
            this.randomPixels[writeIndex] = this.randomPixels[i];
          }
          writeIndex++;
        }
      }
      this.randomPixels.length = writeIndex;
    }
  }

  /**
   * Zeichnet den Meer-Hintergrund (animiert mit Sprite Sheet oder neues Tile-System)
   */
  private drawSeaBackground(fb: Uint8Array, dt: number): void {
    // Verwende neues Wasser-Tile-System mit Scrolling
    // (Das alte Sprite Sheet System wird nur verwendet, wenn explizit ein Sprite Sheet geladen wurde)
    this.drawTiledSpriteWithOffset(
      fb,
      this.waterTile,
      Math.floor(this.seaScroll) % this.waterTile.w,
      Math.floor(this.seaScrollY) % this.waterTile.h,
      0,
      SEA_Y,
      W,
      SEA_HEIGHT
    );
    
    // Generiere regelmäßig neue Pixel
    if (this.randomPixelTimer >= this.randomPixelInterval) {
      this.randomPixelTimer = 0;
      this.generateRandomWaterPixels();
    }
    
    // Zeichne die gespeicherten Pixel (mit Scrolling-Offset)
    this.drawRandomWaterPixels(fb);
  }

  /**
   * Generiert neue zufällige Pixel-Positionen für das Wasser
   * Positionen werden relativ zum aktuellen Scrolling-Offset gespeichert
   * Maximale Anzahl: 10-20 Pixel gleichzeitig
   */
  private generateRandomWaterPixels(): void {
    const cyan = 15;  // Index 15: Cyan
    const currentTime = Date.now();
    const maxPixels = 10 + Math.floor(Math.random() * 11); // 10-20 Pixel maximal
    
    // Berechne wie viele Cyan-Pixel pro Intervall erstellt werden sollen
    // Ziel: 10-20 Cyan pro Sekunde
    // Bei 50ms Intervall = 20x pro Sekunde, also pro Intervall: 0-1 Cyan (50% Chance)
    const cyanCount = Math.random() < 0.5 ? 1 : 0; // 0-1 pro Intervall (50% Chance)
    
    // Entferne älteste Pixel, wenn wir über dem Maximum sind
    if (this.randomPixels.length + cyanCount > maxPixels) {
      // Sortiere nach Erstellungszeit (älteste zuerst) und entferne die ältesten
      this.randomPixels.sort((a, b) => a.createdAt - b.createdAt);
      const toRemove = this.randomPixels.length + cyanCount - maxPixels;
      this.randomPixels.splice(0, toRemove);
    }
    
    // Erstelle neue Cyan-Pixel mit Positionen relativ zum aktuellen Scrolling-Offset
    for (let i = 0; i < cyanCount; i++) {
      const baseX = this.seaScroll + Math.floor(Math.random() * W);
      const baseY = this.seaScrollY + SEA_Y + Math.floor(Math.random() * SEA_HEIGHT);
      this.randomPixels.push({ baseX, baseY, color: cyan, createdAt: currentTime });
    }
  }

  /**
   * Zeichnet die gespeicherten zufälligen Pixel im Wasser-Bereich
   * Positionen werden relativ zum aktuellen Scrolling-Offset berechnet
   * @param fb Framebuffer
   */
  private drawRandomWaterPixels(fb: Uint8Array): void {
    // Optimiert: Direkte Schleife ohne Array-Iteration-Overhead
    const pixelCount = this.randomPixels.length;
    const floorSeaScroll = Math.floor(this.seaScroll);
    const floorSeaScrollY = Math.floor(this.seaScrollY);
    
    for (let i = 0; i < pixelCount; i++) {
      const pixel = this.randomPixels[i];
      
      // Berechne Position relativ zum aktuellen Scrolling-Offset
      let x = Math.floor(pixel.baseX - floorSeaScroll);
      const y = Math.floor(pixel.baseY - floorSeaScrollY);
      
      // Stelle sicher, dass der Pixel im sichtbaren Bereich ist
      if (y >= SEA_Y && y < H) {
        // Handle Wrapping für X (optimiert: nur einmal Modulo)
        x = ((x % W) + W) % W;
        const idx = y * W + x;
        // Bounds-Check nicht nötig, da y bereits geprüft wurde und x durch Modulo begrenzt ist
        fb[idx] = pixel.color;
      }
    }
  }

  /**
   * Zeichnet ein Sprite als tiled Hintergrund
   * @param fb Framebuffer
   * @param tile Sprite-Tile (z.B. 32x32)
   * @param startX Start X-Position
   * @param startY Start Y-Position
   * @param width Breite des zu füllenden Bereichs
   * @param height Höhe des zu füllenden Bereichs
   */
  private drawTiledSprite(
    fb: Uint8Array,
    tile: Sprite,
    startX: number,
    startY: number,
    width: number,
    height: number
  ): void {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const screenX = startX + x;
        const screenY = startY + y;
        
        // Berechne Tile-Position (Modulo für Tiling)
        const tileX = x % tile.w;
        const tileY = y % tile.h;
        
        // Hole Pixel aus Tile
        const tileIdx = tileY * tile.w + tileX;
        const pixel = tile.px[tileIdx] & 15;
        
        // Überspringe Transparenz
        if (pixel === 0) continue;
        
        // Zeichne Pixel (bounds check removed - function only called with safe parameters)
        const idx = screenY * W + screenX;
        fb[idx] = pixel;
      }
    }
  }

  /**
   * Zeichnet ein Sprite als tiled Hintergrund mit Offset (für Scrolling)
   * @param fb Framebuffer
   * @param tile Sprite-Tile
   * @param offsetX X-Offset für Scrolling
   * @param offsetY Y-Offset für Scrolling
   * @param startX Start X-Position auf dem Bildschirm
   * @param startY Start Y-Position auf dem Bildschirm
   * @param width Breite des zu füllenden Bereichs
   * @param height Höhe des zu füllenden Bereichs
   */
  private drawTiledSpriteWithOffset(
    fb: Uint8Array,
    tile: Sprite,
    offsetX: number,
    offsetY: number,
    startX: number,
    startY: number,
    width: number,
    height: number
  ): void {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const screenX = startX + x;
        const screenY = startY + y;
        
        // Berechne Tile-Position mit Offset (Modulo für Tiling)
        const tileX = (x + offsetX) % tile.w;
        const tileY = (y + offsetY) % tile.h;
        
        // Hole Pixel aus Tile
        const tileIdx = tileY * tile.w + tileX;
        const pixel = tile.px[tileIdx] & 15;
        
        // Überspringe Transparenz
        if (pixel === 0) continue;
        
        // Zeichne Pixel
        if (screenX >= 0 && screenX < W && screenY >= 0 && screenY < H) {
          const idx = screenY * W + screenX;
          fb[idx] = pixel;
        }
      }
    }
  }
}

