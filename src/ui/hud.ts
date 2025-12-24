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
  
  // Power Meter (bottom left, above HP)
  const powerBarX = 4;
  const powerBarY = H - 32;
  const powerBarW = 100;
  const powerBarH = 8;
  
  fillRect(fb, powerBarX, powerBarY, powerBarW, powerBarH, 6);
  fillRect(fb, powerBarX + 1, powerBarY + 1, (powerBarW - 2) * (powerMeter / 100), powerBarH - 2, 15);
  drawLine(fb, powerBarX, powerBarY, powerBarX + powerBarW, powerBarY, 9);
  drawLine(fb, powerBarX, powerBarY + powerBarH, powerBarX + powerBarW, powerBarY + powerBarH, 9);
  drawLine(fb, powerBarX, powerBarY, powerBarX, powerBarY + powerBarH, 9);
  drawLine(fb, powerBarX + powerBarW, powerBarY, powerBarX + powerBarW, powerBarY + powerBarH, 9);
  
  // Score (top right)
  const scoreText = `SCORE: ${Math.floor(score).toString().padStart(8, '0')}`;
  const scoreWidth = scoreText.length * 8;
  renderText(fb, scoreText, W - scoreWidth - 4, 4, 9);
  
  // Heat (top right, below score)
  const heatText = `HEAT: ${Math.floor(heat).toString().padStart(3, '0')}`;
  const heatWidth = heatText.length * 8;
  renderText(fb, heatText, W - heatWidth - 4, 14, 11);
  
  // Laser heat indicator (if active/overheated)
  if (laserHeat > 0) {
    const laserBarX = 4;
    const laserBarY = H - 44;
    const laserBarW = 60;
    const laserBarH = 6;
    
    fillRect(fb, laserBarX, laserBarY, laserBarW, laserBarH, 6);
    fillRect(fb, laserBarX + 1, laserBarY + 1, (laserBarW - 2) * laserHeat, laserBarH - 2, laserHeat > 0.9 ? 12 : 14);
    drawLine(fb, laserBarX, laserBarY, laserBarX + laserBarW, laserBarY, 9);
    drawLine(fb, laserBarX, laserBarY + laserBarH, laserBarX + laserBarW, laserBarY + laserBarH, 9);
  }
  
}

