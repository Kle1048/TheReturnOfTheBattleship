import { Sprite } from "../engine/render/blit";

// Generate a simple placeholder sprite
function createSprite(width: number, height: number, pattern: number[]): Sprite {
  const px = new Uint8Array(width * height);
  for (let i = 0; i < px.length; i++) {
    px[i] = pattern[i % pattern.length] || 0;
  }
  return { w: width, h: height, px };
}

// Player battleship sprite (simple placeholder)
// NOTE: This is a placeholder. Use loadSprite() to load a 64x32 pixel sprite from file.
export function createPlayerSprite(): Sprite {
  const w = 64;
  const h = 32;
  const px = new Uint8Array(w * h);
  
  // Simple battleship shape: gray body, red accents (scaled up for 64x32)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      
      // Center body (scaled up from original 32x24 design)
      if (x >= 16 && x < 48 && y >= 10 && y < 26) {
        px[idx] = 7; // Gray
      }
      // Cannon/turret
      else if (x >= 20 && x < 44 && y >= 6 && y < 16) {
        px[idx] = 8; // Light gray
      }
      // Red accent
      else if (x >= 24 && x < 40 && y >= 14 && y < 20) {
        px[idx] = 12; // Red
      }
      // Transparent
      else {
        px[idx] = 0;
      }
    }
  }
  
  return { w, h, px };
}

// Enemy drone sprite (small, simple)
export function createDroneSprite(): Sprite {
  const w = 12;
  const h = 12;
  const px = new Uint8Array(w * h);
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const cx = x - w / 2;
      const cy = y - h / 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
      
      if (dist < 5) {
        px[idx] = 12; // Red
      } else if (dist < 6) {
        px[idx] = 9; // White outline
      } else {
        px[idx] = 0;
      }
    }
  }
  
  return { w, h, px };
}

// Enemy jet sprite
export function createJetSprite(): Sprite {
  const w = 24;
  const h = 16;
  const px = new Uint8Array(w * h);
  
  // Triangle shape
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const widthAtY = Math.floor((h - y) * w / h);
      const startX = (w - widthAtY) / 2;
      
      if (x >= startX && x < startX + widthAtY) {
        px[idx] = 11; // Orange
      } else {
        px[idx] = 0;
      }
    }
  }
  
  return { w, h, px };
}

// Enemy boat sprite
export function createBoatSprite(): Sprite {
  const w = 28;
  const h = 20;
  const px = new Uint8Array(w * h);
  
  // Simple boat shape
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      
      // Hull
      if (y >= 12 && y < 20 && x >= 4 && x < 24) {
        px[idx] = 10; // Brown
      }
      // Deck
      else if (y >= 8 && y < 12 && x >= 6 && x < 22) {
        px[idx] = 6; // Dark gray
      }
      // Cabin
      else if (y >= 4 && y < 10 && x >= 8 && x < 18) {
        px[idx] = 7; // Gray
      }
      // Outline
      else if (
        ((x === 3 || x === 24) && y >= 12 && y < 20) ||
        ((y === 11 || y === 19) && x >= 4 && x < 24) ||
        ((x === 7 || x === 21) && y >= 4 && y < 12)
      ) {
        px[idx] = 9; // White
      }
      else {
        px[idx] = 0;
      }
    }
  }
  
  return { w, h, px };
}

// Enemy frigate sprite
export function createFrigateSprite(): Sprite {
  const w = 36;
  const h = 24;
  const px = new Uint8Array(w * h);
  
  // Larger boat with turret
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      
      // Hull
      if (y >= 14 && y < 24 && x >= 4 && x < 32) {
        px[idx] = 6; // Dark gray
      }
      // Deck
      else if (y >= 10 && y < 14 && x >= 6 && x < 30) {
        px[idx] = 7; // Gray
      }
      // Turret
      else if (y >= 6 && y < 12 && x >= 12 && x < 20) {
        px[idx] = 8; // Light gray
      }
      // Outline
      else if (
        ((x === 3 || x === 32) && y >= 14 && y < 24) ||
        ((y === 13 || y === 23) && x >= 4 && x < 32)
      ) {
        px[idx] = 9; // White
      }
      else {
        px[idx] = 0;
      }
    }
  }
  
  return { w, h, px };
}

// Bullet sprite (small projectile)
export function createBulletSprite(): Sprite {
  const w = 4;
  const h = 4;
  const px = new Uint8Array(w * h);
  
  for (let i = 0; i < px.length; i++) {
    px[i] = 14; // Yellow
  }
  
  return { w, h, px };
}

// Railgun beam sprite
export function createRailgunBeamSprite(): Sprite {
  const w = 4;
  const h = 200;
  const px = new Uint8Array(w * h);
  
  // Bright beam with glow
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (x === 1 || x === 2) {
        px[idx] = 15; // Cyan (bright center)
      } else {
        px[idx] = 3; // Blue (glow edge)
      }
    }
  }
  
  return { w, h, px };
}

// Explosion sprite (simple)
export function createExplosionSprite(frame: number): Sprite {
  const w = 20;
  const h = 20;
  const px = new Uint8Array(w * h);
  
  const radius = 4 + frame * 2;
  const cx = w / 2;
  const cy = h / 2;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < radius * 0.8) {
        px[idx] = 14; // Yellow core
      } else if (dist < radius) {
        px[idx] = 12; // Red outer
      } else if (dist < radius * 1.2) {
        px[idx] = 11; // Orange edge
      } else {
        px[idx] = 0;
      }
    }
  }
  
  return { w, h, px };
}

// Background: Sky gradient
export function createSkyPattern(): Uint8Array {
  const pattern = new Uint8Array(320 * 66); // Sky height
  for (let i = 0; i < pattern.length; i++) {
    pattern[i] = 2; // Dark blue
  }
  return pattern;
}

// Background: Sea pattern (simple waves)
export function createSeaPattern(): Uint8Array {
  const pattern = new Uint8Array(320 * 134); // Sea height
  for (let y = 0; y < 134; y++) {
    for (let x = 0; x < 320; x++) {
      const idx = y * 320 + x;
      // Simple wave pattern
      const wave = Math.sin(x * 0.1 + y * 0.05) > 0 ? 3 : 2;
      pattern[idx] = wave; // Blue variations
    }
  }
  return pattern;
}

// Water tile: 16x8 pixel tile with dark blue and blue pattern
// Creates two versions: one with dark blue (2) and blue (3), another with swapped colors
export function createWaterTile(swapColors: boolean = false): Sprite {
  const w = 16;
  const h = 8;
  const px = new Uint8Array(w * h);
  
  // Define pattern: alternating dark blue and blue
  const darkBlue = 2; // Index 2: Dark Blue
  const blue = 3;     // Index 3: Blue
  
  // Create a wave-like pattern
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      
      // Create a simple wave pattern
      // Use sine wave to create alternating pattern
      const wave = Math.sin((x + y * 0.5) * 0.5) > 0;
      
      if (swapColors) {
        // Swapped: where it was dark blue, use blue, and vice versa
        px[idx] = wave ? darkBlue : blue;
      } else {
        // Normal: dark blue and blue pattern
        px[idx] = wave ? blue : darkBlue;
      }
    }
  }
  
  return { w, h, px };
}

