import { fillRect, drawLine } from "../engine/render/blit";
import { W, H } from "../engine/render/constants";
import { VGARenderer } from "../engine/render/renderer";
import { renderText } from "./font";

export function renderHUD(
  renderer: VGARenderer,
  hp: number,
  maxHp: number,
  powerMeter: number,
  score: number,
  heat: number,
  laserHeat: number
) {
  const fb = renderer.fb;
  
  // HP Bar (bottom left)
  const hpBarX = 4;
  const hpBarY = H - 20;
  const hpBarW = 80;
  const hpBarH = 8;
  
  // Background
  fillRect(fb, hpBarX, hpBarY, hpBarW, hpBarH, 6);
  // HP fill
  const hpPercent = hp / maxHp;
  fillRect(fb, hpBarX + 1, hpBarY + 1, (hpBarW - 2) * hpPercent, hpBarH - 2, hpPercent > 0.3 ? 5 : 12);
  // Outline
  drawLine(fb, hpBarX, hpBarY, hpBarX + hpBarW, hpBarY, 9);
  drawLine(fb, hpBarX, hpBarY + hpBarH, hpBarX + hpBarW, hpBarY + hpBarH, 9);
  drawLine(fb, hpBarX, hpBarY, hpBarX, hpBarY + hpBarH, 9);
  drawLine(fb, hpBarX + hpBarW, hpBarY, hpBarX + hpBarW, hpBarY + hpBarH, 9);
  
  // Prompt Strike Bar (bottom right, same height as HP bar, but shorter)
  const promptBarW = 60; // Shorter than HP bar
  const promptBarX = W - promptBarW - 4;
  const promptBarY = H - 20; // Same height as HP bar
  const promptBarH = 8;
  
  // Background
  fillRect(fb, promptBarX, promptBarY, promptBarW, promptBarH, 6);
  // Power fill
  fillRect(fb, promptBarX + 1, promptBarY + 1, (promptBarW - 2) * (powerMeter / 100), promptBarH - 2, 15);
  // Outline
  drawLine(fb, promptBarX, promptBarY, promptBarX + promptBarW, promptBarY, 9);
  drawLine(fb, promptBarX, promptBarY + promptBarH, promptBarX + promptBarW, promptBarY + promptBarH, 9);
  drawLine(fb, promptBarX, promptBarY, promptBarX, promptBarY + promptBarH, 9);
  drawLine(fb, promptBarX + promptBarW, promptBarY, promptBarX + promptBarW, promptBarY + promptBarH, 9);
  
  // Score (top right)
  const scoreText = `SCORE: ${Math.floor(score).toString().padStart(8, '0')}`;
  const scoreWidth = scoreText.length * 8;
  renderText(fb, scoreText, W - scoreWidth - 4, 4, 9);
  
  // Heat (top right, below score)
  const heatText = `HEAT: ${Math.floor(heat).toString().padStart(3, '0')}`;
  const heatWidth = heatText.length * 8;
  renderText(fb, heatText, W - heatWidth - 4, 14, 11);
  
}

