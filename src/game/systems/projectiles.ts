import { Entity, EntityType, createEntity } from "../entities/entity";
import { Sprite } from "../../engine/render/blit";
import { W } from "../../engine/render/constants";

// Create smoke particle sprite
function createSmokeParticleSprite(): Sprite {
  const w = 3;
  const h = 3;
  const px = new Uint8Array(w * h);
  // Create a small gray/white smoke particle
  for (let i = 0; i < px.length; i++) {
    const x = i % w;
    const y = Math.floor(i / w);
    // Center pixel is brighter, edges are darker
    if (x === 1 && y === 1) {
      px[i] = 7; // Light gray center
    } else {
      px[i] = 6; // Darker gray edges
    }
  }
  return { w, h, px };
}

export function createSmokeParticle(x: number, y: number): Entity {
  const sprite = createSmokeParticleSprite();
  const particle = createEntity(EntityType.SMOKE_PARTICLE, x, y, sprite);
  // Smoke drifts slightly backward (no upward movement)
  particle.vx = -0.02; // Slight backward drift
  particle.vy = 0; // No vertical movement
  particle.lifetime = 1200; // 1200ms lifetime (shorter trail)
  particle.maxLifetime = 1200;
  return particle;
}

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

// Create SAM (Surface-to-Air Missile) sprite - red/orange
function createSAMMissileSprite(): Sprite {
  const w = 6;
  const h = 6;
  const px = new Uint8Array(w * h);
  // Create a small red missile sprite
  for (let i = 0; i < px.length; i++) {
    const x = i % w;
    const y = Math.floor(i / w);
    // Center pixel is bright red, edges are darker
    if ((x === 2 || x === 3) && (y === 2 || y === 3)) {
      px[i] = 12; // Bright red center
    } else if ((x >= 1 && x <= 4) && (y >= 1 && y <= 4)) {
      px[i] = 4; // Darker red body
    } else {
      px[i] = 0; // Transparent/black edges
    }
  }
  return { w, h, px };
}

// Create SSM (Surface-to-Ship Missile) sprite - blue/cyan
function createSSMMissileSprite(): Sprite {
  const w = 6;
  const h = 6;
  const px = new Uint8Array(w * h);
  // Create a small blue missile sprite
  for (let i = 0; i < px.length; i++) {
    const x = i % w;
    const y = Math.floor(i / w);
    // Center pixel is bright cyan, edges are darker
    if ((x === 2 || x === 3) && (y === 2 || y === 3)) {
      px[i] = 11; // Bright cyan center
    } else if ((x >= 1 && x <= 4) && (y >= 1 && y <= 4)) {
      px[i] = 3; // Darker blue body
    } else {
      px[i] = 0; // Transparent/black edges
    }
  }
  return { w, h, px };
}

export function createSAMMissile(x: number, y: number, targetId: number, ownerId: number): Entity {
  const sprite = createSAMMissileSprite();
  const missile = createEntity(EntityType.SAM_MISSILE, x, y, sprite);
  // Initial velocity forward (will be adjusted by homing)
  missile.vx = 0.22; // Faster forward speed
  missile.vy = 0;
  missile.damage = 15; // Reduced damage (was 30, now half)
  missile.owner = ownerId;
  missile.targetId = targetId;
  missile.hitbox = {
    x: -3,
    y: -3,
    w: 6,
    h: 6
  };
  missile.lifetime = 5000; // 5 seconds max lifetime
  missile.maxLifetime = 5000;
  return missile;
}

export function createSSMMissile(x: number, y: number, targetId: number | null, ownerId: number): Entity {
  const sprite = createSSMMissileSprite();
  const missile = createEntity(EntityType.SSM_MISSILE, x, y, sprite);
  // Initial velocity forward (will be adjusted by homing after initial flight phase)
  missile.vx = 0.12; // Slightly slower than SAM
  missile.vy = 0;
  missile.damage = 50; // Higher damage for ships (they have more HP)
  missile.owner = ownerId;
  if (targetId !== null) {
    missile.targetId = targetId;
  }
  missile.hitbox = {
    x: -3,
    y: -3,
    w: 6,
    h: 6
  };
  missile.lifetime = 6000; // 6 seconds max lifetime (ships might be further)
  missile.maxLifetime = 6000;
  missile.homingDelay = 300; // Fly straight for 300ms before starting homing
  return missile;
}

