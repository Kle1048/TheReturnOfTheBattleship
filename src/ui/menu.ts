import { fillRect } from "../engine/render/blit";
import { W, H } from "../engine/render/constants";
import { renderText } from "./font";

export function renderTitleScreen(fb: Uint8Array) {
  // Dark background
  fillRect(fb, 0, 0, W, H, 1);
  
  // Title (centered)
  const title = "RETURN OF THE BATTLESHIP";
  const titleWidth = title.length * 8; // 8 pixels per char
  renderText(fb, title, Math.floor((W - titleWidth) / 2), 60, 9);
  
  // Subtitle (centered)
  const subtitle = "PRESS FIRE TO START";
  const subtitleWidth = subtitle.length * 8;
  renderText(fb, subtitle, Math.floor((W - subtitleWidth) / 2), 100, 14);
  
  // Help hint (centered)
  const helpHint = "PRESS H FOR HELP";
  const helpWidth = helpHint.length * 8;
  renderText(fb, helpHint, Math.floor((W - helpWidth) / 2), 140, 7);
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
  // Semi-transparent overlay (dark)
  fillRect(fb, 0, 0, W, H, 1);
  
  // Game Over text (centered)
  const gameOver = "GAME OVER";
  const gameOverWidth = gameOver.length * 8;
  renderText(fb, gameOver, Math.floor((W - gameOverWidth) / 2), 60, 12);
  
  // Score (centered)
  const scoreText = `SCORE: ${Math.floor(score).toString().padStart(8, '0')}`;
  const scoreWidth = scoreText.length * 8;
  renderText(fb, scoreText, Math.floor((W - scoreWidth) / 2), 100, 9);
  
  // Best score (centered)
  const bestText = `BEST: ${Math.floor(bestScore).toString().padStart(8, '0')}`;
  const bestWidth = bestText.length * 8;
  renderText(fb, bestText, Math.floor((W - bestWidth) / 2), 120, 14);
  
  // Restart hint (centered)
  const restart = "PRESS FIRE TO RESTART";
  const restartWidth = restart.length * 8;
  renderText(fb, restart, Math.floor((W - restartWidth) / 2), 160, 7);
}

