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
  
  // Controls hint (centered)
  const controls = "W/S: MOVE  SPACE: FIRE";
  const controlsWidth = controls.length * 8;
  renderText(fb, controls, Math.floor((W - controlsWidth) / 2), 140, 7);
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

