import { Entity, EntityType, EnemyType, createEntity } from "./entity";
import { createDroneSprite, createJetSprite, createBoatSprite, createFrigateSprite } from "../../assets/sprites";
import { W, SEA_Y } from "../../engine/render/constants";
import { AnimatedSprite, AnimationState, createAnimationState, updateAnimation } from "../../engine/render/animation";
import { assets } from "../../assets/assets";
import { Sprite } from "../../engine/render/blit";

// Map für Animation States animierter Enemies
const enemyAnimationStates = new Map<number, AnimationState>();

// Map für Schuss-Timer von Schiffen (BOAT und FRIGATE)
const shipFireTimers = new Map<number, number>();

// Map für Flugkörper-Timer von Jets (ENEMY_JET)
const jetMissileTimers = new Map<number, number>();

export function createEnemy(type: EnemyType, x: number, y: number): Entity {
  let sprite;
  let entityType: EntityType;
  let hp: number;
  let maxHp: number;
  
  let animatedSprite: AnimatedSprite | null = null;
  
  switch (type) {
    case EnemyType.DRONE:
      // Versuche animiertes Sprite Sheet zu laden
      try {
        animatedSprite = assets.getDroneSprite();
        if (animatedSprite) {
          sprite = animatedSprite.frames[0]; // Start mit erstem Frame
        } else {
          sprite = createDroneSprite(); // Fallback
        }
      } catch (error) {
        sprite = createDroneSprite(); // Fallback
      }
      entityType = EntityType.ENEMY_DRONE;
      hp = maxHp = 10;
      break;
    case EnemyType.JET:
      // Versuche animiertes Sprite Sheet zu laden
      try {
        animatedSprite = assets.getJetSprite();
        if (animatedSprite) {
          sprite = animatedSprite.frames[0]; // Start mit erstem Frame
        } else {
          sprite = createJetSprite(); // Fallback
        }
      } catch (error) {
        sprite = createJetSprite(); // Fallback
      }
      entityType = EntityType.ENEMY_JET;
      hp = maxHp = 20;
      break;
    case EnemyType.BOAT:
      // Versuche animiertes Sprite Sheet zu laden
      try {
        animatedSprite = assets.getBoatSprite();
        if (animatedSprite) {
          sprite = animatedSprite.frames[0]; // Start mit erstem Frame
        } else {
          sprite = createBoatSprite(); // Fallback
        }
      } catch (error) {
        sprite = createBoatSprite(); // Fallback
      }
      entityType = EntityType.ENEMY_BOAT;
      hp = maxHp = 40;
      break;
    case EnemyType.FRIGATE:
      // Versuche animiertes Sprite Sheet zu laden
      try {
        animatedSprite = assets.getFrigateSprite();
        if (animatedSprite) {
          sprite = animatedSprite.frames[0]; // Start mit erstem Frame
        } else {
          sprite = createFrigateSprite(); // Fallback
        }
      } catch (error) {
        sprite = createFrigateSprite(); // Fallback
      }
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

  // Erstelle Animation State für animierte Enemies
  if (animatedSprite) {
    // Bestimme Animations-Geschwindigkeit basierend auf Enemy-Typ
    let frameDuration = 300; // Default
    if (type === EnemyType.DRONE) {
      frameDuration = 250; // 250ms für Drohne (mittel-schnell, schwebt langsam)
    } else if (type === EnemyType.JET) {
      frameDuration = 200; // 200ms für Jet (schneller, da sich schnell bewegt)
    } else if (type === EnemyType.BOAT) {
      frameDuration = 300; // 300ms für Boot
    } else if (type === EnemyType.FRIGATE) {
      frameDuration = 400; // 400ms für Fregatte (langsamer, da sich langsamer bewegt)
    }
    
    const animationState = createAnimationState(
      animatedSprite,
      frameDuration,
      true  // Loop
    );
    enemyAnimationStates.set(entity.id, animationState);
  }
  
  // Set velocity based on type
  switch (type) {
    case EnemyType.DRONE:
      entity.vx = -0.06; // Slow, floats
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

export function updateEnemy(entity: Entity, dt: number, player: Entity | null = null): Entity[] {
  // Update animation falls vorhanden
  const animationState = enemyAnimationStates.get(entity.id);
  if (animationState) {
    entity.sprite = updateAnimation(animationState, dt);
  }
  
  // Special behavior for drones: charge at player when within 150 pixels
  let isDroneCharging = false;
  if (entity.type === EntityType.ENEMY_DRONE && player && player.hp !== undefined && player.hp > 0) {
    const dx = player.x - entity.x;
    const dy = player.y - entity.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist <= 150 && dist > 0) {
      isDroneCharging = true;
      // Calculate direction to player
      const targetVx = dx / dist;
      const targetVy = dy / dist;
      
      // Use gradual turning instead of instant direction change
      // This makes drones less agile and allows player to evade
      const turnRate = 0.002; // Slower turning rate
      const targetSpeed = 0.10; // Slightly reduced speed
      
      // Interpolate towards target direction (similar to homing missiles)
      const currentSpeed = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);
      const desiredSpeed = targetSpeed;
      
      // Calculate desired velocity
      const desiredVx = targetVx * desiredSpeed;
      const desiredVy = targetVy * desiredSpeed;
      
      // Gradually turn towards target
      const turnAmount = turnRate * dt * 1000;
      entity.vx += (desiredVx - entity.vx) * turnAmount;
      entity.vy += (desiredVy - entity.vy) * turnAmount;
      
      // Normalize to maintain speed
      const newSpeed = Math.sqrt(entity.vx * entity.vx + entity.vy * entity.vy);
      if (newSpeed > 0.01) {
        entity.vx = (entity.vx / newSpeed) * desiredSpeed;
        entity.vy = (entity.vy / newSpeed) * desiredSpeed;
      } else {
        // If speed is too low, set directly
        entity.vx = desiredVx;
        entity.vy = desiredVy;
      }
    } else {
      // Normal movement: slow horizontal drift
      entity.vx = -0.06;
      entity.vy = 0;
    }
  }
  
  entity.x += entity.vx * dt;
  entity.y += entity.vy * dt;
  
  // Remove if off screen
  if (entity.x + entity.sprite.w < 0) {
    entity.hp = -1; // Mark for removal
  }
  
  // Clean up animation state if entity is dead
  if (entity.hp !== undefined && entity.hp <= 0 && animationState) {
    enemyAnimationStates.delete(entity.id);
  }
  
  // Keep air enemies in sky, sea enemies in water
  // Exception: Drones charging at player can use the entire screen
  if (entity.type === EntityType.ENEMY_DRONE) {
    if (isDroneCharging) {
      // Charging drones can use entire screen, only prevent going completely off-screen
      if (entity.y < 0) entity.y = 0;
      if (entity.y > 200 - 10) entity.y = 200 - 10;
    } else {
      // Normal drones stay in sky
      if (entity.y < 10) entity.y = 10;
      if (entity.y > SEA_Y - 10) entity.y = SEA_Y - 10;
    }
  } else if (entity.type === EntityType.ENEMY_JET) {
    if (entity.y < 10) entity.y = 10;
    if (entity.y > SEA_Y - 10) entity.y = SEA_Y - 10;
  } else {
    if (entity.y < SEA_Y) entity.y = SEA_Y;
    if (entity.y > 200 - 10) entity.y = 200 - 10;
  }
  
  // Handle ship firing (BOAT and FRIGATE shoot at player every 3 seconds)
  const newBullets: Entity[] = [];
  if ((entity.type === EntityType.ENEMY_BOAT || entity.type === EntityType.ENEMY_FRIGATE) && 
      player && player.hp !== undefined && player.hp > 0) {
    
    // Initialize timer if not exists
    if (!shipFireTimers.has(entity.id)) {
      shipFireTimers.set(entity.id, 3000); // Start with 3 seconds
    }
    
    // Update timer
    let timer = shipFireTimers.get(entity.id)!;
    timer -= dt;
    
    if (timer <= 0) {
      // Time to fire! Calculate direction to player
      const dx = player.x - entity.x;
      const dy = player.y - entity.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        // Normalize direction
        const dirX = dx / dist;
        const dirY = dy / dist;
        
        // Bullet speed
        const bulletSpeed = 0.12;
        
        // Create bullet at ship position
        const bullet = createEnemyBullet(
          entity.x,
          entity.y,
          dirX * bulletSpeed,
          dirY * bulletSpeed,
          entity.id
        );
        newBullets.push(bullet);
      }
      
      // Reset timer to 3 seconds
      timer = 3000;
    }
    
    shipFireTimers.set(entity.id, timer);
  }
  
  // Clean up fire timer if entity is dead
  if (entity.hp !== undefined && entity.hp <= 0) {
    shipFireTimers.delete(entity.id);
    jetMissileTimers.delete(entity.id);
  }
  
  // Handle jet missile firing (Jets fire ASM once after 0.5 seconds)
  if (entity.type === EntityType.ENEMY_JET && 
      player && player.hp !== undefined && player.hp > 0) {
    
    // Check if this jet has already fired (timer value of -1 means already fired)
    if (!jetMissileTimers.has(entity.id)) {
      // Initialize timer (500ms)
      jetMissileTimers.set(entity.id, 500);
    }
    
    const timerValue = jetMissileTimers.get(entity.id)!;
    
    // Only fire if timer is positive (hasn't fired yet)
    if (timerValue > 0) {
      let timer = timerValue;
      timer -= dt;
      
      if (timer <= 0) {
        // Time to fire! Create ASM
        const missile = createEnemyASM(entity.x, entity.y, entity.id);
        missile.targetId = player.id; // Target the player
        newBullets.push(missile);
        
        // Mark as fired (set to -1 so it won't fire again)
        timer = -1;
      }
      
      jetMissileTimers.set(entity.id, timer);
    }
  }
  
  return newBullets;
}

/**
 * Bereinigt Animation States für entfernte Entities
 * Sollte aufgerufen werden, wenn Entities aus dem Array entfernt werden
 */
export function cleanupEnemyAnimation(entityId: number): void {
  enemyAnimationStates.delete(entityId);
  shipFireTimers.delete(entityId);
  jetMissileTimers.delete(entityId);
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

// Helper to create enemy ASM (Anti-Ship Missile) sprite - red/orange
function createEnemyASMSprite(): Sprite {
  const w = 6;
  const h = 6;
  const px = new Uint8Array(w * h);
  // Create a small red/orange missile sprite
  for (let i = 0; i < px.length; i++) {
    const x = i % w;
    const y = Math.floor(i / w);
    // Center pixel is bright red, edges are darker
    if ((x === 2 || x === 3) && (y === 2 || y === 3)) {
      px[i] = 12; // Bright red center
    } else if ((x >= 1 && x <= 4) && (y >= 1 && y <= 4)) {
      px[i] = 11; // Orange body
    } else {
      px[i] = 0; // Transparent/black edges
    }
  }
  return { w, h, px };
}

export function createEnemyASM(x: number, y: number, ownerId: number): Entity {
  const sprite = createEnemyASMSprite();
  const missile = createEntity(EntityType.ENEMY_ASM, x, y, sprite);
  // Initial velocity forward (will be adjusted by homing after initial flight phase)
  missile.vx = -0.12; // Fly left initially
  missile.vy = 0;
  missile.damage = 40; // High damage
  missile.owner = ownerId;
  missile.hp = 5; // Can be destroyed by player weapons
  missile.maxHp = 5;
  missile.hitbox = {
    x: -3,
    y: -3,
    w: 6,
    h: 6
  };
  missile.lifetime = 6000; // 6 seconds max lifetime
  missile.maxLifetime = 6000;
  missile.homingDelay = 300; // Fly straight for 300ms before starting homing
  return missile;
}

