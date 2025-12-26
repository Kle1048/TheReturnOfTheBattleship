import { Entity, EntityType } from "../entities/entity";
import { W, H } from "../../engine/render/constants";

/**
 * Updates homing missile movement - gradually turns towards target
 */
export function updateHomingMissile(missile: Entity, target: Entity | null, dt: number, turnRate: number = 0.003) {
  if (!target || target.hp === undefined || target.hp <= 0) {
    // No target or target dead - continue horizontally (maintain forward momentum, no vertical drift)
    // This prevents missiles from falling when target is lost
    const currentSpeed = Math.sqrt(missile.vx * missile.vx + missile.vy * missile.vy);
    missile.vx = currentSpeed; // Maintain forward speed
    missile.vy = 0; // No vertical movement
    missile.x += missile.vx * dt;
    missile.y += missile.vy * dt;
    return;
  }
  
  // Calculate direction to target
  const dx = target.x - missile.x;
  const dy = target.y - missile.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist < 1) {
    // Very close to target, don't change direction
    missile.x += missile.vx * dt;
    missile.y += missile.vy * dt;
    return;
  }
  
  // Normalized direction to target
  const targetVx = dx / dist;
  const targetVy = dy / dist;
  
  // Current velocity magnitude
  const currentSpeed = Math.sqrt(missile.vx * missile.vx + missile.vy * missile.vy);
  
  // Interpolate towards target direction (turn rate limits how fast it can turn)
  const turnAmount = turnRate * dt * 1000; // Scale by dt
  missile.vx += (targetVx * currentSpeed - missile.vx) * turnAmount;
  missile.vy += (targetVy * currentSpeed - missile.vy) * turnAmount;
  
  // Normalize to maintain speed
  const newSpeed = Math.sqrt(missile.vx * missile.vx + missile.vy * missile.vy);
  if (newSpeed > 0.01) {
    missile.vx = (missile.vx / newSpeed) * currentSpeed;
    missile.vy = (missile.vy / newSpeed) * currentSpeed;
  }
  
  // Update position
  missile.x += missile.vx * dt;
  missile.y += missile.vy * dt;
}

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
  
  // Remove if off screen (bullets, missiles, and enemies, but not railgun beam - it's handled by lifetime)
  if (entity.type === EntityType.BULLET || 
      entity.type === EntityType.SAM_MISSILE ||
      entity.type === EntityType.SSM_MISSILE ||
      entity.type === EntityType.ENEMY_ASM ||
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

