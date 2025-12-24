import { Entity, EntityType } from "../entities/entity";

export interface HitResult {
  hit: boolean;
  entity1: Entity;
  entity2: Entity;
}

export function checkCollision(e1: Entity, e2: Entity): boolean {
  if (!e1.hitbox || !e2.hitbox) return false;
  
  const x1 = e1.x + e1.hitbox.x;
  const y1 = e1.y + e1.hitbox.y;
  const w1 = e1.hitbox.w;
  const h1 = e1.hitbox.h;
  
  const x2 = e2.x + e2.hitbox.x;
  const y2 = e2.y + e2.hitbox.y;
  const w2 = e2.hitbox.w;
  const h2 = e2.hitbox.h;
  
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

export function checkCollisions(entities: Entity[]): HitResult[] {
  const hits: HitResult[] = [];
  
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const e1 = entities[i];
      const e2 = entities[j];
      
      // Skip if same type or one is dead
      if (e1.type === e2.type) continue;
      if (e1.hp !== undefined && e1.hp <= 0) continue;
      if (e2.hp !== undefined && e2.hp <= 0) continue;
      
      // Player vs Enemy bullets
      if (e1.type === EntityType.PLAYER && 
          (e2.type === EntityType.BULLET && e2.owner !== e1.id)) {
        if (checkCollision(e1, e2)) {
          hits.push({ hit: true, entity1: e1, entity2: e2 });
        }
      }
      
      // Enemy vs Player bullets
      if ((e1.type === EntityType.ENEMY_DRONE || 
           e1.type === EntityType.ENEMY_JET ||
           e1.type === EntityType.ENEMY_BOAT ||
           e1.type === EntityType.ENEMY_FRIGATE) &&
          (e2.type === EntityType.BULLET || e2.type === EntityType.RAILGUN_BEAM) &&
          e2.owner !== undefined && e2.owner !== e1.id) {
        if (checkCollision(e1, e2)) {
          hits.push({ hit: true, entity1: e1, entity2: e2 });
        }
      }
      
      // Player vs Enemy (ramming)
      if (e1.type === EntityType.PLAYER &&
          (e2.type === EntityType.ENEMY_DRONE ||
           e2.type === EntityType.ENEMY_JET ||
           e2.type === EntityType.ENEMY_BOAT ||
           e2.type === EntityType.ENEMY_FRIGATE)) {
        if (checkCollision(e1, e2)) {
          hits.push({ hit: true, entity1: e1, entity2: e2 });
        }
      }
    }
  }
  
  return hits;
}

