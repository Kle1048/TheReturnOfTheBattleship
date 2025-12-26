import { Sprite } from "../../engine/render/blit";

export enum EntityType {
  PLAYER,
  ENEMY_DRONE,
  ENEMY_JET,
  ENEMY_BOAT,
  ENEMY_FRIGATE,
  BULLET,
  RAILGUN_BEAM,
  SAM_MISSILE,
  SSM_MISSILE,
  SMOKE_PARTICLE,
  EXPLOSION,
  POWER_UP
}

export enum EnemyType {
  DRONE,
  JET,
  BOAT,
  FRIGATE
}

export interface Entity {
  id: number;
  type: EntityType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  sprite: Sprite;
  
  // Collision
  hitbox?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  
  // Health
  hp?: number;
  maxHp?: number;
  
  // Lifetime (for bullets, explosions, etc.)
  lifetime?: number;
  maxLifetime?: number;
  
  // Enemy specific
  enemyType?: EnemyType;
  
  // Projectile specific
  damage?: number;
  owner?: number; // Entity ID of owner
  
  // Missile specific
  targetId?: number; // Entity ID of target for homing missiles
  homingDelay?: number; // Time remaining before homing starts (for SSM)
  smokeTimer?: number; // Timer for spawning smoke particles
}

let nextId = 1;

export function createEntity(type: EntityType, x: number, y: number, sprite: Sprite): Entity {
  return {
    id: nextId++,
    type,
    x,
    y,
    vx: 0,
    vy: 0,
    sprite
  };
}

