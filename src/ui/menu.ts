import { fillRect, blit } from "../engine/render/blit";
import { W, H, VGA_PALETTE, RGBA } from "../engine/render/constants";
import { renderText, renderTextWithOutline } from "./font";
import { assets } from "../assets/assets";

/**
 * Findet den Palette-Index, der am nächsten zu einer Ziel-RGB-Farbe ist
 * @param targetColor Ziel-RGB-Farbe [r, g, b]
 * @param palette Die zu durchsuchende Palette
 * @returns Der beste Palette-Index (1-15, nie 0 für Transparent)
 */
function findBestColorIndex(targetColor: [number, number, number], palette: RGBA[]): number {
  let minDist = Infinity;
  let bestIdx = 1; // Default: Schwarz
  
  // Durchsuche alle Farben außer Index 0 (Transparent)
  for (let i = 1; i < palette.length; i++) {
    const [r, g, b] = palette[i];
    const [tr, tg, tb] = targetColor;
    
    // Berechne euklidische Distanz (gewichtet für bessere Wahrnehmung)
    const dr = tr - r;
    const dg = tg - g;
    const db = tb - b;
    const dist = Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db);
    
    if (dist < minDist) {
      minDist = dist;
      bestIdx = i;
    }
  }
  
  return bestIdx;
}

export function renderTitleScreen(fb: Uint8Array) {
  // Lade Title Screen Hintergrundbild falls vorhanden
  const titleScreenSprite = assets.getTitleScreenSprite();
  const titlePalette = assets.getTitleScreenPalette();
  
  // Verwende Title Screen Palette falls vorhanden, sonst VGA Palette
  const currentPalette = titlePalette || VGA_PALETTE;
  
  if (titleScreenSprite) {
    // Zeichne das Pixelart-Bild als Hintergrund
    blit(fb, titleScreenSprite, 0, 0);
  } else {
    // Fallback: Dark background
    fillRect(fb, 0, 0, W, H, 1);
  }
  
  // Finde die besten Farben aus der aktuellen Palette
  // Rot: [255, 0, 0]
  const redIndex = findBestColorIndex([255, 0, 0], currentPalette);
  // Schwarz für Outline
  const blackIndex = findBestColorIndex([0, 0, 0], currentPalette);
  // Gelb: [255, 255, 0]
  const yellowIndex = findBestColorIndex([255, 255, 0], currentPalette);
  // Hellgrau: [192, 192, 192]
  const lightGrayIndex = findBestColorIndex([192, 192, 192], currentPalette);
  
  // Title oben im Himmel-Bereich (wo die rote Markierung ist)
  // "THE RETURN OF THE BATTLESHIP" in rot mit Outline
  const title = "THE RETURN OF THE BATTLESHIP";
  const titleWidth = title.length * 8; // 8 pixels per char (normale Größe)
  renderTextWithOutline(fb, title, Math.floor((W - titleWidth) / 2), 30, redIndex, blackIndex);
  
  // "Press Fire to Start" im Wasser-Bereich unten (wo die gelbe Markierung ist)
  const subtitle = "PRESS FIRE TO START";
  const subtitleWidth = subtitle.length * 8;
  renderText(fb, subtitle, Math.floor((W - subtitleWidth) / 2), 165, yellowIndex);
  
  // Help hint darunter im Wasser-Bereich
  const helpHint = "PRESS H FOR HELP";
  const helpWidth = helpHint.length * 8;
  renderText(fb, helpHint, Math.floor((W - helpWidth) / 2), 185, lightGrayIndex);
}

export function renderPauseScreen(fb: Uint8Array) {
  // Semi-transparent overlay (dark)
  fillRect(fb, 0, 0, W, H, 1);
  
  // Pause text (centered)
  const pause = "PAUSED";
  const pauseWidth = pause.length * 8;
  renderText(fb, pause, Math.floor((W - pauseWidth) / 2), 80, 9);
  
  // Continue hint (centered)
  const continueText = "PRESS H TO CONTINUE";
  const continueWidth = continueText.length * 8;
  renderText(fb, continueText, Math.floor((W - continueWidth) / 2), 120, 7);
}

export function renderHelpScreen(fb: Uint8Array) {
  // Dark background
  fillRect(fb, 0, 0, W, H, 1);
  
  // Title (centered)
  const title = "HELP";
  const titleWidth = title.length * 8;
  renderText(fb, title, Math.floor((W - titleWidth) / 2), 20, 9);
  
  // Controls
  const controls = [
    "W/S/A/D: MOVE",
    "SPACE: FIRE",
    "X: TOGGLE AUTOFIRE",
    "R: RAILGUN",
    "E: LASER",
    "F: SAM MISSILE",
    "T: SSM MISSILE",
    "Q: PROMPT STRIKE",
    "",
    "H: HELP/PAUSE"
  ];
  
  let y = 50;
  for (const line of controls) {
    const lineWidth = line.length * 8;
    renderText(fb, line, Math.floor((W - lineWidth) / 2), y, 7);
    y += 12;
  }
  
  // Back hint (centered)
  const backText = "PRESS H TO RETURN";
  const backWidth = backText.length * 8;
  renderText(fb, backText, Math.floor((W - backWidth) / 2), 180, 14);
}

export function renderGameOverScreen(fb: Uint8Array, score: number, bestScore: number) {
  // Lade Game Over Screen Hintergrundbild falls vorhanden
  const gameOverScreenSprite = assets.getGameOverScreenSprite();
  const gameOverPalette = assets.getGameOverScreenPalette();
  
  // Verwende Game Over Screen Palette falls vorhanden, sonst VGA Palette
  const currentPalette = gameOverPalette || VGA_PALETTE;
  
  if (gameOverScreenSprite) {
    // Zeichne das Pixelart-Bild als Hintergrund
    blit(fb, gameOverScreenSprite, 0, 0);
  } else {
    // Fallback: Dark background
    fillRect(fb, 0, 0, W, H, 1);
  }
  
  // Finde die besten Farben aus der aktuellen Palette
  // Rot: [255, 0, 0]
  const redIndex = findBestColorIndex([255, 0, 0], currentPalette);
  // Weiß: [255, 255, 255]
  const whiteIndex = findBestColorIndex([255, 255, 255], currentPalette);
  // Gelb: [255, 255, 0]
  const yellowIndex = findBestColorIndex([255, 255, 0], currentPalette);
  // Hellgrau: [192, 192, 192]
  const lightGrayIndex = findBestColorIndex([192, 192, 192], currentPalette);
  
  // Game Over text (centered, weiter oben)
  const gameOver = "GAME OVER";
  const gameOverWidth = gameOver.length * 8;
  renderTextWithOutline(fb, gameOver, Math.floor((W - gameOverWidth) / 2), 30, redIndex, 1);
  
  // Score (centered)
  const scoreText = `SCORE: ${Math.floor(score).toString().padStart(8, '0')}`;
  const scoreWidth = scoreText.length * 8;
  renderText(fb, scoreText, Math.floor((W - scoreWidth) / 2), 100, whiteIndex);
  
  // Best score (centered)
  const bestText = `BEST: ${Math.floor(bestScore).toString().padStart(8, '0')}`;
  const bestWidth = bestText.length * 8;
  renderText(fb, bestText, Math.floor((W - bestWidth) / 2), 120, yellowIndex);
  
  // Restart hint (centered)
  const restart = "PRESS FIRE TO RESTART";
  const restartWidth = restart.length * 8;
  renderText(fb, restart, Math.floor((W - restartWidth) / 2), 160, lightGrayIndex);
}

