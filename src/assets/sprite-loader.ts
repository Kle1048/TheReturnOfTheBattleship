import { Sprite } from "../engine/render/blit";
import { RGBA, VGA_PALETTE } from "../engine/render/constants";
import { AnimatedSprite, createAnimatedSprite } from "../engine/render/animation";

/**
 * Lädt ein Bild als ImageData (für Sprite Sheets)
 */
export async function loadImage(path: string): Promise<ImageData> {
  const img = new Image();
  img.src = path;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Konnte 2D Context nicht erstellen");
  
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

/**
 * Findet den nächstgelegenen Palette-Index für eine RGB-Farbe
 */
function findClosestPaletteIndex(rgba: RGBA, palette: RGBA[]): number {
  let minDist = Infinity;
  let closestIdx = 1; // Default: Schwarz (nicht transparent)

  // Überspringe Index 0 (Transparent), außer wenn Alpha < 128
  const startIdx = rgba[3] < 128 ? 0 : 1;

  for (let i = startIdx; i < palette.length; i++) {
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

/**
 * Konvertiert einen Bereich eines ImageData zu einem Sprite
 * @param imageData Das geladene Bild
 * @param x X-Position im Bild (obere linke Ecke)
 * @param y Y-Position im Bild (obere linke Ecke)
 * @param w Breite des Sprites
 * @param h Höhe des Sprites
 * @param palette Die zu verwendende Palette (default: VGA_PALETTE)
 */
export function imageDataToSprite(
  imageData: ImageData,
  x: number,
  y: number,
  w: number,
  h: number,
  palette: RGBA[] = VGA_PALETTE
): Sprite {
  const px = new Uint8Array(w * h);

  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const srcX = x + i;
      const srcY = y + j;
      
      // Boundary check
      if (srcX < 0 || srcX >= imageData.width || srcY < 0 || srcY >= imageData.height) {
        px[j * w + i] = 0; // Transparent außerhalb
        continue;
      }

      const srcIdx = (srcY * imageData.width + srcX) * 4;
      const r = imageData.data[srcIdx];
      const g = imageData.data[srcIdx + 1];
      const b = imageData.data[srcIdx + 2];
      const a = imageData.data[srcIdx + 3];

      const idx = j * w + i;
      
      if (a < 128) {
        px[idx] = 0; // Transparent
      } else {
        px[idx] = findClosestPaletteIndex([r, g, b, 255], palette);
      }
    }
  }

  return { w, h, px };
}

/**
 * Lädt ein Sprite Sheet und extrahiert alle Frames
 * @param path Pfad zum Sprite Sheet Bild
 * @param frameWidth Breite eines Frames
 * @param frameHeight Höhe eines Frames
 * @param framesPerRow Anzahl der Frames pro Zeile (optional, wird berechnet wenn nicht angegeben)
 * @param frameCount Gesamtzahl der Frames (optional, wird aus Sheet-Größe berechnet wenn nicht angegeben)
 * @param startX Start X-Position im Sheet (default: 0)
 * @param startY Start Y-Position im Sheet (default: 0)
 * @param spacingX Horizontaler Abstand zwischen Frames (default: 0)
 * @param spacingY Vertikaler Abstand zwischen Frames (default: 0)
 */
export async function loadSpriteSheet(
  path: string,
  frameWidth: number,
  frameHeight: number,
  options: {
    framesPerRow?: number;
    frameCount?: number;
    startX?: number;
    startY?: number;
    spacingX?: number;
    spacingY?: number;
    palette?: RGBA[];
  } = {}
): Promise<AnimatedSprite> {
  const {
    framesPerRow,
    frameCount,
    startX = 0,
    startY = 0,
    spacingX = 0,
    spacingY = 0,
    palette = VGA_PALETTE
  } = options;

  const imageData = await loadImage(path);

  // Berechne framesPerRow wenn nicht angegeben
  const actualFramesPerRow = framesPerRow ?? Math.floor(imageData.width / (frameWidth + spacingX));

  // Berechne frameCount wenn nicht angegeben
  const rows = Math.floor(imageData.height / (frameHeight + spacingY));
  const actualFrameCount = frameCount ?? (actualFramesPerRow * rows);

  const frames: Sprite[] = [];

  for (let frameIdx = 0; frameIdx < actualFrameCount; frameIdx++) {
    const row = Math.floor(frameIdx / actualFramesPerRow);
    const col = frameIdx % actualFramesPerRow;
    
    const x = startX + col * (frameWidth + spacingX);
    const y = startY + row * (frameHeight + spacingY);

    const sprite = imageDataToSprite(imageData, x, y, frameWidth, frameHeight, palette);
    frames.push(sprite);
  }

  return createAnimatedSprite(frames);
}

/**
 * Lädt ein einzelnes Sprite aus einem Bild
 */
export async function loadSprite(
  path: string,
  palette: RGBA[] = VGA_PALETTE
): Promise<Sprite> {
  const imageData = await loadImage(path);
  return imageDataToSprite(imageData, 0, 0, imageData.width, imageData.height, palette);
}

