import { Entity, EntityType } from "../entities/entity";
import { W, H } from "../../engine/render/constants";

export function updateEntityMovement(entity: Entity, dt: number) {
  entity.x += entity.vx * dt;
  entity.y += entity.vy * dt;
  
  // Update lifetime
  if (entity.lifetime !== undefined) {
    entity.lifetime -= dt;
    if (entity.lifetime <= 0) {
      entity.hp = -1; // Mark for removal
    }
  }
  
  // Remove if off screen (bullets and enemies, but not railgun beam - it's handled by lifetime)
  if (entity.type === EntityType.BULLET || 
      entity.type === EntityType.ENEMY_DRONE ||
      entity.type === EntityType.ENEMY_JET ||
      entity.type === EntityType.ENEMY_BOAT ||
      entity.type === EntityType.ENEMY_FRIGATE) {
    if (entity.x < -100 || entity.x > W + 100 ||
        entity.y < -100 || entity.y > H + 100) {
      entity.hp = -1; // Mark for removal
    }
  }
  // Railgun beam is only removed by lifetime, not by offscreen check
}

