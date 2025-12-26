import { VGARenderer } from "../engine/render/renderer";
import { blit, drawLine, fillRect } from "../engine/render/blit";
import { W, H, SEA_Y, SEA_HEIGHT } from "../engine/render/constants";
import { Entity, EntityType } from "./entities/entity";
import { createSkyPattern, createSeaPattern } from "../assets/sprites";
import { renderHUD } from "../ui/hud";
import { renderTitleScreen, renderGameOverScreen } from "../ui/menu";
import { assets } from "../assets/assets";
import { AnimatedSprite, AnimationState, createAnimationState, updateAnimation } from "../engine/render/animation";
import { Sprite } from "../engine/render/blit";

export class GameRenderer {
  private skyPattern: Uint8Array;
  private seaAnimationState: AnimationState | null = null;
  private seaPatternFallback: Uint8Array; // Fallback für wenn kein Sprite Sheet geladen wurde
  private skyScroll = 0;
  private seaScroll = 0;

  constructor() {
    this.skyPattern = createSkyPattern();
    this.seaPatternFallback = createSeaPattern();
    // Initialisiere Meer-Animation falls Sprite Sheet geladen wurde
    this.initSeaAnimation();
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
    state: "title" | "running" | "gameover",
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
    
    if (state === "title") {
      renderTitleScreen(fb);
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
    
    // Draw sky background (simple pattern)
    this.skyScroll += 0.01;
    for (let y = 0; y < SEA_Y; y++) {
      for (let x = 0; x < W; x++) {
        const idx = y * W + x;
        fb[idx] = 3; // Light blue sky
      }
    }
    
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
    
    // Draw laser target indicator (frame around target if within 60 pixels)
    if (laserTarget && laserTarget.hp !== undefined && laserTarget.hp > 0) {
      const targetX = Math.floor(laserTarget.x + shakeX);
      const targetY = Math.floor(laserTarget.y + shakeY);
      const sprite = laserTarget.sprite;
      const frameSize = 2; // Frame thickness
      
      // Draw frame around target (white/yellow color)
      const frameColor = 11; // Yellow/white
      const left = targetX - sprite.w / 2 - frameSize;
      const right = targetX + sprite.w / 2 + frameSize;
      const top = targetY - sprite.h / 2 - frameSize;
      const bottom = targetY + sprite.h / 2 + frameSize;
      
      // Top and bottom lines
      for (let x = left; x <= right; x++) {
        if (x >= 0 && x < W) {
          if (top >= 0 && top < H) fb[top * W + x] = frameColor;
          if (bottom >= 0 && bottom < H) fb[bottom * W + x] = frameColor;
        }
      }
      // Left and right lines
      for (let y = top; y <= bottom; y++) {
        if (y >= 0 && y < H) {
          if (left >= 0 && left < W) fb[y * W + left] = frameColor;
          if (right >= 0 && right < W) fb[y * W + right] = frameColor;
        }
      }
    }
    
    // Draw SAM target indicator (red frame around locked air target)
    if (samTarget && samTarget.hp !== undefined && samTarget.hp > 0) {
      const targetX = Math.floor(samTarget.x + shakeX);
      const targetY = Math.floor(samTarget.y + shakeY);
      const sprite = samTarget.sprite;
      const frameSize = 2; // Frame thickness
      
      // Draw frame around target (red color for SAM lock)
      const frameColor = 12; // Red
      const left = targetX - sprite.w / 2 - frameSize;
      const right = targetX + sprite.w / 2 + frameSize;
      const top = targetY - sprite.h / 2 - frameSize;
      const bottom = targetY + sprite.h / 2 + frameSize;
      
      // Top and bottom lines
      for (let x = left; x <= right; x++) {
        if (x >= 0 && x < W) {
          if (top >= 0 && top < H) fb[top * W + x] = frameColor;
          if (bottom >= 0 && bottom < H) fb[bottom * W + x] = frameColor;
        }
      }
      // Left and right lines
      for (let y = top; y <= bottom; y++) {
        if (y >= 0 && y < H) {
          if (left >= 0 && left < W) fb[y * W + left] = frameColor;
          if (right >= 0 && right < W) fb[y * W + right] = frameColor;
        }
      }
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
    if (flashTime > 0) {
      // Flash intensity: starts at 1.0 and fades to 0 over the duration
      // Since VGA doesn't support alpha, we use a pattern that gets sparser as it fades
      const maxFlashDuration = 150; // ms
      const intensity = Math.max(0, Math.min(1, flashTime / maxFlashDuration)); // Clamp between 0 and 1
      
      // Only draw flash if intensity is significant
      if (intensity > 0.01) {
        // Draw white pixels using vertical stripes that fade out
        const stripeWidth = 3; // Width of each stripe
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            // Create vertical stripes pattern
            const stripeIndex = Math.floor(x / stripeWidth);
            const stripePatternValue = (stripeIndex % 20) / 20; // Pattern value 0-1 for fade
            
            // Draw white pixel if pattern value is below intensity threshold
            // This creates vertical stripes that fade out as intensity decreases
            if (stripePatternValue < intensity) {
              fb[y * W + x] = 9; // White
            }
          }
        }
      }
    }
  }

  /**
   * Zeichnet den Meer-Hintergrund (animiert mit Sprite Sheet oder Fallback)
   */
  private drawSeaBackground(fb: Uint8Array, dt: number): void {
    // Update Animation falls vorhanden
    if (this.seaAnimationState) {
      // Update Animation
      const currentFrame = updateAnimation(this.seaAnimationState, dt);
      // Zeichne animiertes Tile
      this.drawTiledSprite(fb, currentFrame, 0, SEA_Y, W, SEA_HEIGHT);
    } else {
      // Fallback: Verwende altes Pattern
      for (let y = SEA_Y; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = y * W + x;
          const seaY = y - SEA_Y;
          const seaIdx = seaY * W + x;
          if (seaIdx < this.seaPatternFallback.length) {
            fb[idx] = this.seaPatternFallback[seaIdx];
          }
        }
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
        
        // Zeichne Pixel
        if (screenX >= 0 && screenX < W && screenY >= 0 && screenY < H) {
          const idx = screenY * W + screenX;
          fb[idx] = pixel;
        }
      }
    }
  }
}

