import { Entity, EntityType, createEntity } from "../entities/entity";
import { Sprite } from "../../engine/render/blit";
import { W } from "../../engine/render/constants";

// Create player bullet sprite
function createPlayerBulletSprite(): Sprite {
  const w = 4;
  const h = 4;
  const px = new Uint8Array(w * h);
  for (let i = 0; i < px.length; i++) {
    px[i] = 14; // Yellow for player bullets
  }
  return { w, h, px };
}

export function createPlayerBullet(x: number, y: number, ownerId: number): Entity {
  const sprite = createPlayerBulletSprite();
  const bullet = createEntity(EntityType.BULLET, x, y, sprite);
  bullet.vx = 0.2; // Fast forward
  bullet.vy = 0;
  bullet.damage = 10;
  bullet.owner = ownerId;
  bullet.hitbox = {
    x: -2,
    y: -2,
    w: 4,
    h: 4
  };
  bullet.lifetime = 3000;
  bullet.maxLifetime = 3000;
  return bullet;
}

export function createRailgunBeam(startX: number, y: number, charge: number, ownerId: number): Entity {
  // Railgun beam goes from 5 pixels right of startX to the right edge of screen
  const beamStartX = Math.floor(startX) + 5;
  const beamWidth = Math.max(1, Math.floor(W - beamStartX)); // Ensure minimum width of 1
  const h = 6; // Thin horizontal beam
  const px = new Uint8Array(beamWidth * h);
  
  // Bright beam based on charge
  const intensity = Math.min(1, charge);
  const centerColor = intensity > 0.7 ? 15 : 3; // Cyan if fully charged, blue otherwise
  const edgeColor = 2; // Dark blue edge
  
  // Fill horizontal beam: top/bottom rows are edges, middle rows are center
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < beamWidth; col++) {
      const idx = row * beamWidth + col;
      if (row === 0 || row === h - 1) {
        px[idx] = edgeColor; // Top and bottom edges
      } else if (row === Math.floor(h / 2) || row === Math.floor(h / 2) - 1) {
        px[idx] = centerColor; // Center rows
      } else {
        px[idx] = edgeColor; // Other rows
      }
    }
  }
  
  const sprite: Sprite = { w: beamWidth, h, px };
  // Position beam: entity.x is the center of the beam, so we position it at beamStartX + beamWidth/2
  // This way when rendering with (entity.x - sprite.w/2), we get the correct left edge at beamStartX
  const beam = createEntity(EntityType.RAILGUN_BEAM, beamStartX + beamWidth / 2, y, sprite);
  beam.vx = 0;
  beam.vy = 0;
  beam.damage = 100; // Fixed damage (always full power now)
  beam.owner = ownerId;
  beam.hitbox = {
    x: -beamWidth / 2,
    y: -3,
    w: beamWidth,
    h: 6
  };
  beam.lifetime = 200; // Short but visible
  beam.maxLifetime = 200;
  return beam;
}

