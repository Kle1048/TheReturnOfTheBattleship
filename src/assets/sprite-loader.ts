import { Sprite } from "../engine/render/blit";
import { RGBA, VGA_PALETTE } from "../engine/render/constants";
import { AnimatedSprite, createAnimatedSprite } from "../engine/render/animation";

/**
 * Lädt ein Bild als ImageData (für Sprite Sheets)
 * @param path Pfad zum Bild
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
 * Berechnet die wahrgenommene Farbdistanz (gewichtete RGB-Distanz)
 * Berücksichtigt, dass das menschliche Auge für Grün empfindlicher ist
 */
function perceptualColorDistance(rgba1: RGBA, rgba2: RGBA): number {
  const [r1, g1, b1] = rgba1;
  const [r2, g2, b2] = rgba2;
  
  // Gewichtete Distanz: Grün hat höheres Gewicht (menschliche Wahrnehmung)
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  
  // Gewichtungen: Rot=2, Grün=4, Blau=3 (basierend auf menschlicher Farbwahrnehmung)
  return Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db);
}

/**
 * Findet den nächstgelegenen Palette-Index für eine RGB-Farbe
 * Verwendet wahrgenommene Farbdistanz für bessere Ergebnisse
 */
function findClosestPaletteIndex(rgba: RGBA, palette: RGBA[]): number {
  let minDist = Infinity;
  let closestIdx = 1; // Default: Schwarz (nicht transparent)

  // Überspringe Index 0 (Transparent), außer wenn Alpha < 128
  const startIdx = rgba[3] < 128 ? 0 : 1;

  for (let i = startIdx; i < palette.length; i++) {
    const dist = perceptualColorDistance(rgba, palette[i]);
    
    if (dist < minDist) {
      minDist = dist;
      closestIdx = i;
    }
  }

  return closestIdx;
}

/**
 * Extrahiert eine 16-Farben-Palette aus einem Bild (Farbquantisierung)
 * Verwendet Median-Cut-Algorithmus für bessere Ergebnisse
 * @param imageData Das zu analysierende Bild
 * @returns Eine Palette mit 16 Farben (Index 0 bleibt transparent)
 */
export function extractPaletteFromImage(imageData: ImageData): RGBA[] {
  // Sammle alle Farben aus dem Bild
  const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();
  
  // Analysiere alle Pixel (oder eine Stichprobe für Performance)
  const sampleSize = Math.min(imageData.width * imageData.height, 50000);
  const step = Math.max(1, Math.floor((imageData.width * imageData.height) / sampleSize));
  
  for (let i = 0; i < imageData.data.length; i += 4 * step) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    
    if (a >= 128) { // Nur nicht-transparente Pixel
      // Quantisiere leicht (reduziert Rauschen)
      const qr = Math.floor(r / 4) * 4;
      const qg = Math.floor(g / 4) * 4;
      const qb = Math.floor(b / 4) * 4;
      const key = `${qr},${qg},${qb}`;
      
      if (colorMap.has(key)) {
        const entry = colorMap.get(key)!;
        entry.count++;
        // Gewichteter Durchschnitt für genauere Farben
        const total = entry.count;
        entry.r = Math.round((entry.r * (total - 1) + r) / total);
        entry.g = Math.round((entry.g * (total - 1) + g) / total);
        entry.b = Math.round((entry.b * (total - 1) + b) / total);
      } else {
        colorMap.set(key, { r, g, b, count: 1 });
      }
    }
  }
  
  // Konvertiere zu Array und sortiere nach Häufigkeit
  const colors = Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count);
  
  // Erstelle Palette: Index 0 = Transparent, dann die 15 häufigsten Farben
  const palette: RGBA[] = [
    [0, 0, 0, 0] // 0: Transparent
  ];
  
  // Nimm die 15 häufigsten Farben
  const paletteSize = Math.min(15, colors.length);
  for (let i = 0; i < paletteSize; i++) {
    const color = colors[i];
    palette.push([color.r, color.g, color.b, 255]);
  }
  
  // Fülle mit schwarz auf, falls weniger als 15 Farben gefunden wurden
  while (palette.length < 16) {
    palette.push([0, 0, 0, 255]);
  }
  
  return palette;
}

/**
 * Analysiert die Farben eines Bildes und erstellt eine optimierte Farbmapping-Funktion
 * @param imageData Das zu analysierende Bild
 * @param palette Die Ziel-Palette
 * @returns Eine Mapping-Funktion, die RGB-Farben auf Palette-Indizes mappt
 */
function createOptimizedColorMapper(imageData: ImageData, palette: RGBA[]): (rgba: RGBA) => number {
  // Analysiere die Farbverteilung im Bild
  const colorHistogram = new Map<string, number>();
  const sampleSize = Math.min(10000, imageData.width * imageData.height); // Sample für Performance
  const step = Math.max(1, Math.floor((imageData.width * imageData.height) / sampleSize));
  
  // Erstelle Histogramm der häufigsten Farben
  for (let i = 0; i < imageData.data.length; i += 4 * step) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    
    if (a >= 128) {
      // Quantisiere Farben leicht (reduziert Rauschen)
      const qr = Math.floor(r / 8) * 8;
      const qg = Math.floor(g / 8) * 8;
      const qb = Math.floor(b / 8) * 8;
      const key = `${qr},${qg},${qb}`;
      colorHistogram.set(key, (colorHistogram.get(key) || 0) + 1);
    }
  }
  
  // Erstelle eine Lookup-Tabelle für häufige Farben
  const colorMap = new Map<string, number>();
  
  // Für jede häufige Farbe im Bild, finde den besten Palette-Index
  for (const [colorKey] of colorHistogram) {
    const [r, g, b] = colorKey.split(',').map(Number);
    const bestIndex = findClosestPaletteIndex([r, g, b, 255], palette);
    colorMap.set(colorKey, bestIndex);
  }
  
  // Erstelle die Mapping-Funktion
  return (rgba: RGBA): number => {
    const [r, g, b, a] = rgba;
    
    if (a < 128) {
      return 0; // Transparent
    }
    
    // Prüfe zuerst die Lookup-Tabelle
    const qr = Math.floor(r / 8) * 8;
    const qg = Math.floor(g / 8) * 8;
    const qb = Math.floor(b / 8) * 8;
    const key = `${qr},${qg},${qb}`;
    
    if (colorMap.has(key)) {
      return colorMap.get(key)!;
    }
    
    // Fallback: Berechne direkt
    return findClosestPaletteIndex(rgba, palette);
  };
}

/**
 * Konvertiert einen Bereich eines ImageData zu einem Sprite
 * @param imageData Das geladene Bild
 * @param x X-Position im Bild (obere linke Ecke)
 * @param y Y-Position im Bild (obere linke Ecke)
 * @param w Breite des Sprites
 * @param h Höhe des Sprites
 * @param palette Die zu verwendende Palette (default: VGA_PALETTE)
 * @param useOptimizedMapping Wenn true, wird eine optimierte Farbmapping-Funktion verwendet
 */
export function imageDataToSprite(
  imageData: ImageData,
  x: number,
  y: number,
  w: number,
  h: number,
  palette: RGBA[] = VGA_PALETTE,
  useOptimizedMapping: boolean = false
): Sprite {
  const px = new Uint8Array(w * h);
  
  // Erstelle optimierte Mapping-Funktion falls gewünscht
  let colorMapper: ((rgba: RGBA) => number) | null = null;
  if (useOptimizedMapping) {
    // Analysiere das gesamte Bild für optimiertes Mapping
    colorMapper = createOptimizedColorMapper(imageData, palette);
  }

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
        if (colorMapper) {
          px[idx] = colorMapper([r, g, b, a]);
        } else {
          px[idx] = findClosestPaletteIndex([r, g, b, 255], palette);
        }
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
 * @param path Pfad zum Bild
 * @param palette Die zu verwendende Palette (default: VGA_PALETTE)
 * @param useOptimizedMapping Wenn true, wird eine optimierte Farbmapping-Funktion verwendet (empfohlen für komplexe Bilder)
 */
export async function loadSprite(
  path: string,
  palette: RGBA[] = VGA_PALETTE,
  useOptimizedMapping: boolean = false
): Promise<Sprite> {
  const imageData = await loadImage(path);
  return imageDataToSprite(imageData, 0, 0, imageData.width, imageData.height, palette, useOptimizedMapping);
}

