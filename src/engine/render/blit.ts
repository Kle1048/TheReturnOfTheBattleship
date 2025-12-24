import { W, H } from "./constants";

// Sprite: indexed pixels (0..15) + width/height
export type Sprite = {
  w: number;
  h: number;
  px: Uint8Array; // length = w*h
};

export function blit(
  fb: Uint8Array,
  sprite: Sprite,
  x: number,
  y: number
) {
  // integer pixel coords for true pixel look
  const sx = x | 0;
  const sy = y | 0;

  for (let j = 0; j < sprite.h; j++) {
    const yy = sy + j;
    if (yy < 0 || yy >= H) continue;

    for (let i = 0; i < sprite.w; i++) {
      const xx = sx + i;
      if (xx < 0 || xx >= W) continue;

      const s = sprite.px[j * sprite.w + i] & 15;
      if (s === 0) continue; // 0 = transparent
      fb[yy * W + xx] = s;
    }
  }
}

// Draw a filled rectangle
export function fillRect(
  fb: Uint8Array,
  x: number,
  y: number,
  w: number,
  h: number,
  color: number
) {
  const sx = x | 0;
  const sy = y | 0;
  const sw = w | 0;
  const sh = h | 0;

  for (let j = 0; j < sh; j++) {
    const yy = sy + j;
    if (yy < 0 || yy >= H) continue;

    for (let i = 0; i < sw; i++) {
      const xx = sx + i;
      if (xx < 0 || xx >= W) continue;
      fb[yy * W + xx] = color & 15;
    }
  }
}

// Draw a line (for UI elements)
export function drawLine(
  fb: Uint8Array,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: number
) {
  const sx1 = x1 | 0;
  const sy1 = y1 | 0;
  const sx2 = x2 | 0;
  const sy2 = y2 | 0;

  const dx = Math.abs(sx2 - sx1);
  const dy = Math.abs(sy2 - sy1);
  const sx = sx1 < sx2 ? 1 : -1;
  const sy = sy1 < sy2 ? 1 : -1;
  let err = dx - dy;

  let x = sx1;
  let y = sy1;

  while (true) {
    if (x >= 0 && x < W && y >= 0 && y < H) {
      fb[y * W + x] = color & 15;
    }

    if (x === sx2 && y === sy2) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

