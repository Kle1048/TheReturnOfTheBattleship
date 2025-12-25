import { loadImage } from "./sprite-loader";
import { VGA_PALETTE, W, SEA_HEIGHT } from "../engine/render/constants";

/**
 * Konvertiert ein ImageData zu einem Hintergrund-Pattern (Uint8Array)
 * Für Hintergründe, die als Tile verwendet werden können
 */
export async function loadBackgroundPattern(
  path: string,
  width: number,
  height: number
): Promise<Uint8Array> {
  const imageData = await loadImage(path);
  
  // Erstelle Pattern-Array
  const pattern = new Uint8Array(width * height);
  
  // Wenn das Bild größer ist, nehme nur den benötigten Bereich
  // Wenn es kleiner ist, tiled es
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcX = x % imageData.width;
      const srcY = y % imageData.height;
      
      const srcIdx = (srcY * imageData.width + srcX) * 4;
      const r = imageData.data[srcIdx];
      const g = imageData.data[srcIdx + 1];
      const b = imageData.data[srcIdx + 2];
      const a = imageData.data[srcIdx + 3];
      
      const idx = y * width + x;
      
      // Finde nächstgelegenen Palette-Index
      if (a < 128) {
        pattern[idx] = 2; // Dunkelblau als Fallback (Meer sollte aber keine Transparenz haben)
      } else {
        pattern[idx] = findClosestPaletteIndex([r, g, b, 255], VGA_PALETTE);
      }
    }
  }
  
  return pattern;
}

/**
 * Findet den nächstgelegenen Palette-Index für eine RGB-Farbe
 */
function findClosestPaletteIndex(rgba: [number, number, number, number], palette: typeof VGA_PALETTE): number {
  let minDist = Infinity;
  let closestIdx = 2; // Default: Dunkelblau für Meer

  for (let i = 1; i < palette.length; i++) {
    const [r1, g1, b1] = rgba;
    const [r2, g2, b2] = palette[i];
    const dist = Math.sqrt(
      Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
    );
    
    if (dist < minDist) {
      minDist = dist;
      closestIdx = i;
    }
  }

  return closestIdx;
}

