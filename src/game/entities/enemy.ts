import { Entity, EntityType, EnemyType, createEntity } from "./entity";
import { createDroneSprite, createJetSprite, createBoatSprite, createFrigateSprite } from "../../assets/sprites";
import { W, SEA_Y } from "../../engine/render/constants";

export function createEnemy(type: EnemyType, x: number, y: number): Entity {
  let sprite;
  let entityType: EntityType;
  let hp: number;
  let maxHp: number;
  
  switch (type) {
    case EnemyType.DRONE:
      sprite = createDroneSprite();
      entityType = EntityType.ENEMY_DRONE;
      hp = maxHp = 10;
      break;
    case EnemyType.JET:
      sprite = createJetSprite();
      entityType = EntityType.ENEMY_JET;
      hp = maxHp = 20;
      break;
    case EnemyType.BOAT:
      sprite = createBoatSprite();
      entityType = EntityType.ENEMY_BOAT;
      hp = maxHp = 40;
      break;
    case EnemyType.FRIGATE:
      sprite = createFrigateSprite();
      entityType = EntityType.ENEMY_FRIGATE;
      hp = maxHp = 80;
      break;
  }
  
  const entity = createEntity(entityType, x, y, sprite);
  entity.enemyType = type;
  entity.hp = hp;
  entity.maxHp = maxHp;
  
  // Set hitbox based on sprite size
  entity.hitbox = {
    x: -sprite.w / 2,
    y: -sprite.h / 2,
    w: sprite.w,
    h: sprite.h
  };
  
  // Set velocity based on type
  switch (type) {
    case EnemyType.DRONE:
      entity.vx = -0.08; // Slow, floats
      entity.vy = 0;
      break;
    case EnemyType.JET:
      entity.vx = -0.15; // Fast
      entity.vy = Math.sin(x * 0.01) * 0.02; // Sine wave movement
      break;
    case EnemyType.BOAT:
      entity.vx = -0.05; // Slow on water
      entity.vy = 0;
      break;
    case EnemyType.FRIGATE:
      entity.vx = -0.03; // Very slow, tanky
      entity.vy = 0;
      break;
  }
  
  return entity;
}

export function updateEnemy(entity: Entity, dt: number) {
  entity.x += entity.vx * dt;
  entity.y += entity.vy * dt;
  
  // Remove if off screen
  if (entity.x + entity.sprite.w < 0) {
    entity.hp = -1; // Mark for removal
  }
  
  // Keep air enemies in sky, sea enemies in water
  if (entity.type === EntityType.ENEMY_DRONE || entity.type === EntityType.ENEMY_JET) {
    if (entity.y < 10) entity.y = 10;
    if (entity.y > SEA_Y - 10) entity.y = SEA_Y - 10;
  } else {
    if (entity.y < SEA_Y) entity.y = SEA_Y;
    if (entity.y > 200 - 10) entity.y = 200 - 10;
  }
}

export function createEnemyBullet(x: number, y: number, vx: number, vy: number, ownerId: number): Entity {
  const sprite = createBulletSprite();
  const bullet = createEntity(EntityType.BULLET, x, y, sprite);
  bullet.vx = vx;
  bullet.vy = vy;
  bullet.damage = 5;
  bullet.owner = ownerId;
  bullet.hitbox = {
    x: -2,
    y: -2,
    w: 4,
    h: 4
  };
  bullet.lifetime = 5000; // 5 seconds max lifetime
  bullet.maxLifetime = 5000;
  return bullet;
}

// Helper to create bullet sprite
function createBulletSprite() {
  // Simple 4x4 red square for enemy bullets
  const w = 4;
  const h = 4;
  const px = new Uint8Array(w * h);
  for (let i = 0; i < px.length; i++) {
    px[i] = 12; // Red for enemy bullets
  }
  return { w, h, px };
}

