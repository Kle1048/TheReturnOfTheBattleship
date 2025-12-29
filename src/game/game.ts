import { Entity, EntityType } from "./entities/entity";
import { Player } from "./entities/player";
import { updateEnemy, cleanupEnemyAnimation } from "./entities/enemy";
import { WeaponSystem } from "./weapons/weapon";
import { SpawnDirector } from "./director";
import { checkCollisions } from "./systems/collision";
import { updateEntityMovement, updateHomingMissile } from "./systems/movement";
import { createPlayerBullet, createRailgunBeam, createSAMMissile, createSSMMissile, createSmokeParticle } from "./systems/projectiles";
import { createExplosionSprite } from "../assets/sprites";
import { AnimatedSprite } from "../engine/render/animation";

export enum GameState {
  TITLE,
  RUNNING,
  PAUSE,
  HELP,
  GAME_OVER
}

export type SfxEvent = 
  | { type: "explosion" }
  | { type: "hit" }
  | { type: "laser" }
  | { type: "missileLaunch" }
  | { type: "railShot" }
  | { type: "gun" };

export class Game {
  public state = GameState.TITLE;
  public score = 0;
  public bestScore = 0;
  
  private player: Player;
  private weapons: WeaponSystem;
  private director: SpawnDirector;
  private entities: Entity[] = [];
  private explosions: Entity[] = [];
  private smokeParticles: Entity[] = [];
  
  // Screen shake
  private screenShakeX = 0;
  private screenShakeY = 0;
  private screenShakeTime = 0;
  
  // Flash effect (for Prompt Strike)
  private flashTime = 0;
  
  // Laser target tracking
  public laserTarget: Entity | null = null;
  private laserBeamTarget: { x: number; y: number } | null = null;
  private samTarget: Entity | null = null;
  
  // SFX callback (optional)
  private sfxCallback?: (event: SfxEvent) => void;
  
  setSfxCallback(callback: (event: SfxEvent) => void) {
    this.sfxCallback = callback;
  }
  
  private triggerSfx(event: SfxEvent) {
    if (this.sfxCallback) {
      this.sfxCallback(event);
    }
  }

  constructor(playerSprite: AnimatedSprite) {
    this.player = new Player(playerSprite);
    this.weapons = new WeaponSystem();
    this.director = new SpawnDirector();
    
    // Load best score from localStorage
    const saved = localStorage.getItem("bestScore");
    if (saved) {
      this.bestScore = parseInt(saved, 10);
    }
  }

  start(playerSprite: AnimatedSprite) {
    this.state = GameState.RUNNING;
    this.score = 0;
    this.player = new Player(playerSprite);
    this.weapons = new WeaponSystem();
    this.director = new SpawnDirector();
    this.entities = [];
    this.explosions = [];
    this.smokeParticles = [];
    this.entities.push(this.player.entity);
    this.laserTarget = null;
    this.laserBeamTarget = null;
    this.samTarget = null;
  }

  private findLaserTarget(): Entity | null {
    const maxRange = 60;
    let nearestEnemy: Entity | null = null;
    let nearestDist = maxRange;
    
    for (const entity of this.entities) {
      // Check if it's an air enemy (only air targets for laser)
      if (entity.type === EntityType.ENEMY_DRONE ||
          entity.type === EntityType.ENEMY_JET ||
          entity.type === EntityType.ENEMY_ASM) {
        // Check if enemy is alive
        if (entity.hp !== undefined && entity.hp > 0) {
          // Calculate distance
          const dx = entity.x - this.player.entity.x;
          const dy = entity.y - this.player.entity.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestEnemy = entity;
          }
        }
      }
    }
    
    return nearestEnemy;
  }

  // Find nearest air target (DRONE, JET, or ENEMY_ASM) for SAM
  private findSAMTarget(): Entity | null {
    const maxRange = 200; // Longer range for SAM
    let nearestAirTarget: Entity | null = null;
    let nearestDist = maxRange;
    
    for (const entity of this.entities) {
      // Air enemies and enemy ASM (can be shot down)
      if (entity.type === EntityType.ENEMY_DRONE ||
          entity.type === EntityType.ENEMY_JET ||
          entity.type === EntityType.ENEMY_ASM) {
        // Check if enemy is alive
        if (entity.hp !== undefined && entity.hp > 0) {
          // Calculate distance (only check X distance for range, Y doesn't matter much for air)
          const dx = entity.x - this.player.entity.x;
          const dist = Math.abs(dx);
          
          if (dist < nearestDist && entity.x > this.player.entity.x) {
            nearestDist = dist;
            nearestAirTarget = entity;
          }
        }
      }
    }
    
    return nearestAirTarget;
  }

  // Find nearest ship target (BOAT or FRIGATE) for SSM within a 30° cone
  private findSSMTarget(fromX: number = this.player.entity.x, fromY: number = this.player.entity.y, directionAngle: number = 0): Entity | null {
    const maxRange = 250; // Even longer range for SSM
    const coneAngle = 30 * (Math.PI / 180); // 30 degrees in radians (15° on each side)
    let nearestShipTarget: Entity | null = null;
    let nearestDist = maxRange;
    
    for (const entity of this.entities) {
      // Only ship enemies
      if (entity.type === EntityType.ENEMY_BOAT ||
          entity.type === EntityType.ENEMY_FRIGATE) {
        // Check if enemy is alive
        if (entity.hp !== undefined && entity.hp > 0) {
          // Calculate distance and angle
          const dx = entity.x - fromX;
          const dy = entity.y - fromY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Only consider targets that are to the right (ahead) of the missile
          if (dist < nearestDist && entity.x > fromX) {
            // Calculate angle to target
            const angleToTarget = Math.atan2(dy, dx);
            
            // Calculate angle difference (normalize to -PI to PI)
            let angleDiff = angleToTarget - directionAngle;
            // Normalize angle difference to -PI to PI
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            
            // Check if target is within the cone (15° on each side = 30° total)
            if (Math.abs(angleDiff) <= coneAngle / 2) {
              nearestDist = dist;
              nearestShipTarget = entity;
            }
          }
        }
      }
    }
    
    return nearestShipTarget;
  }

  update(dt: number, input: {
    moveUp: boolean;
    moveDown: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    fire: boolean;
    railgun: boolean;
    laser: boolean;
    sam: boolean;
    ssm: boolean;
    promptStrike: boolean;
  }) {
    if (this.state !== GameState.RUNNING) return;
    
    // Update screen shake
    if (this.screenShakeTime > 0) {
      this.screenShakeTime -= dt;
      this.screenShakeX = (Math.random() - 0.5) * 4;
      this.screenShakeY = (Math.random() - 0.5) * 4;
      if (this.screenShakeTime <= 0) {
        this.screenShakeX = 0;
        this.screenShakeY = 0;
      }
    }
    
    // Update flash effect
    if (this.flashTime > 0) {
      this.flashTime -= dt;
    }
    
    // Update player
    this.player.update(dt, input);
    
    // Update weapons
    this.weapons.update(dt);
    
    // Handle weapon inputs
    if (input.fire && this.weapons.canFireArtillery()) {
      const bullet = createPlayerBullet(
        this.player.entity.x + this.player.entity.sprite.w / 2,
        this.player.entity.y,
        this.player.entity.id
      );
      this.entities.push(bullet);
      // Set cooldown after firing
      this.weapons.fireArtillery(this.player.entity.x, this.player.entity.y);
      // Trigger gun sound when bullet is actually created
      this.triggerSfx({ type: "gun" });
    }
    
    if (input.railgun && this.weapons.canFireRailgun()) {
      if (this.weapons.fireRailgun()) {
        const beam = createRailgunBeam(
          this.player.entity.x, // Player X position
          this.player.entity.y, // Same Y as player
          1.0, // Full charge (always full power now)
          this.player.entity.id
        );
        this.entities.push(beam);
        this.screenShake(200);
        this.triggerSfx({ type: "railShot" });
      }
    }
    
    // Find laser target (nearest enemy within 60 pixels)
    this.laserTarget = this.findLaserTarget();
    
    // Find SAM target (air targets only, must lock before firing)
    // Only update target if no SAM missiles are currently in flight
    const samMissilesInFlight = this.entities.some(e => 
      e.type === EntityType.SAM_MISSILE && 
      e.hp !== undefined && e.hp > 0
    );
    
    if (!samMissilesInFlight) {
      this.samTarget = this.findSAMTarget();
    }
    // If SAM missiles are in flight, keep the current target locked
    
    // Handle laser fire (once per key press)
    if (input.laser && this.weapons.canFireLaser() && this.laserTarget) {
      // Fire the laser
      this.weapons.fireLaser();
      this.triggerSfx({ type: "laser" });
      
      // Store target position for beam rendering
      this.laserBeamTarget = { x: this.laserTarget.x, y: this.laserTarget.y };
      
      // Deal damage to target
      const damage = 50;
      if (this.laserTarget.hp !== undefined) {
        this.laserTarget.hp -= damage;
        if (this.laserTarget.hp <= 0) {
          // Target destroyed - create explosion (visual only, no sound)
          const exp: Entity = {
            id: 999998,
            type: EntityType.EXPLOSION,
            x: this.laserTarget.x,
            y: this.laserTarget.y,
            vx: 0,
            vy: 0,
            sprite: createExplosionSprite(3),
            lifetime: 300,
            maxLifetime: 300
          };
          this.explosions.push(exp);
          this.score += 10;
          this.weapons.addPower(5); // Same as other kills
          // No explosion sound for laser kills - only laser sound
        } else {
          this.triggerSfx({ type: "hit" });
        }
      }
    }
    
    // Clear beam target when beam is no longer visible
    if (!this.weapons.isLaserBeamVisible()) {
      this.laserBeamTarget = null;
    }
    
    // Handle SAM fire (only if target is locked)
    if (input.sam && this.weapons.canFireAA() && this.samTarget) {
      const missile = createSAMMissile(
        this.player.entity.x + this.player.entity.sprite.w / 2,
        this.player.entity.y,
        this.samTarget.id,
        this.player.entity.id
      );
      this.entities.push(missile);
      this.weapons.fireAA(this.player.entity.x, this.player.entity.y);
      this.triggerSfx({ type: "missileLaunch" });
    }
    
    // Handle SSM fire (auto-targets nearest ship within 30° cone to the right)
    if (input.ssm && this.weapons.canFireSSM()) {
      const playerX = this.player.entity.x + this.player.entity.sprite.w / 2;
      const playerY = this.player.entity.y;
      const directionAngle = 0; // Missile flies straight right (0 radians)
      const ssmTarget = this.findSSMTarget(playerX, playerY, directionAngle);
      const missile = createSSMMissile(
        playerX,
        playerY,
        ssmTarget ? ssmTarget.id : null,
        this.player.entity.id
      );
      this.entities.push(missile);
      this.weapons.fireSSM(this.player.entity.x, this.player.entity.y);
      this.triggerSfx({ type: "missileLaunch" });
    }
    
    if (input.promptStrike && this.weapons.canUsePromptStrike()) {
      this.weapons.usePromptStrike();
      // Clear all enemies and bullets on screen
      this.entities = this.entities.filter(e => {
        if (e.type === EntityType.PLAYER) return true;
        if (e.type === EntityType.ENEMY_DRONE ||
            e.type === EntityType.ENEMY_JET ||
            e.type === EntityType.ENEMY_BOAT ||
            e.type === EntityType.ENEMY_FRIGATE ||
            e.type === EntityType.ENEMY_ASM ||
            e.type === EntityType.BULLET ||
            e.type === EntityType.SAM_MISSILE ||
            e.type === EntityType.SSM_MISSILE) {
          // Bereinige Animation State vor dem Entfernen
          cleanupEnemyAnimation(e.id);
          // Create explosion at entity position
          const exp: Entity = {
            id: 999999,
            type: EntityType.EXPLOSION,
            x: e.x,
            y: e.y,
            vx: 0,
            vy: 0,
            sprite: createExplosionSprite(3),
            lifetime: 300,
            maxLifetime: 300
          };
          this.explosions.push(exp);
          return false;
        }
        return true;
      });
      this.screenShake(500);
      this.flash(150); // Short flash effect
    }
    
    // Update director and spawn enemies
    const newEnemies = this.director.update(dt, this.entities);
    this.entities.push(...newEnemies);
    
    // Update entities
    for (const entity of this.entities) {
      if (entity.type === EntityType.PLAYER) continue;
      if (entity.type === EntityType.ENEMY_DRONE ||
          entity.type === EntityType.ENEMY_JET ||
          entity.type === EntityType.ENEMY_BOAT ||
          entity.type === EntityType.ENEMY_FRIGATE) {
        const newBullets = updateEnemy(entity, dt, this.player.entity);
        // Add any bullets fired by ships
        if (newBullets.length > 0) {
          this.entities.push(...newBullets);
        }
      } else if (entity.type === EntityType.SMOKE_PARTICLE) {
        // Update smoke particles
        entity.x += entity.vx * dt;
        entity.y += entity.vy * dt;
        // Fade out over time
        if (entity.lifetime !== undefined) {
          entity.lifetime -= dt;
          if (entity.lifetime <= 0) {
            entity.hp = -1; // Mark for removal
          }
        }
      } else if (entity.type === EntityType.SAM_MISSILE || 
                 entity.type === EntityType.SSM_MISSILE ||
                 entity.type === EntityType.ENEMY_ASM) {
        // Spawn smoke particles behind missile
        if (!entity.smokeTimer) {
          entity.smokeTimer = 0;
        }
        entity.smokeTimer += dt;
        if (entity.smokeTimer >= 30) { // Spawn smoke every 30ms (denser trail)
          entity.smokeTimer = 0;
          // Spawn smoke particle slightly behind and to the side of missile
          const smokeX = entity.x - Math.abs(entity.vx) * 10; // Behind missile
          const smokeY = entity.y + (Math.random() - 0.5) * 4; // Slight random offset
          const smoke = createSmokeParticle(smokeX, smokeY);
          this.smokeParticles.push(smoke);
        }
        
        // SAM missiles - find target and update movement
        if (entity.type === EntityType.SAM_MISSILE) {
          let target: Entity | null = null;
          if (entity.targetId !== undefined) {
            target = this.entities.find(e => e.id === entity.targetId && 
              e.hp !== undefined && e.hp > 0) || null;
          }
          
          // SAM missiles disappear if they lose their target
          if (!target && entity.targetId !== undefined) {
            // Target was lost - remove the missile silently
            entity.hp = -1; // Mark for removal
          } else {
            updateHomingMissile(entity, target, dt);
            // Update lifetime
            if (entity.lifetime !== undefined) {
              entity.lifetime -= dt;
              if (entity.lifetime <= 0) {
                entity.hp = -1; // Mark for removal
              }
            }
          }
        } else if (entity.type === EntityType.SSM_MISSILE) {
          // SSM missiles - fly straight initially, then start homing
          if (entity.homingDelay !== undefined && entity.homingDelay > 0) {
            // Still in initial flight phase - fly straight forward
            entity.homingDelay -= dt;
            entity.x += entity.vx * dt;
            entity.y += entity.vy * dt;
            
            // Update lifetime
            if (entity.lifetime !== undefined) {
              entity.lifetime -= dt;
              if (entity.lifetime <= 0) {
                entity.hp = -1; // Mark for removal
              }
            }
          } else {
            // Initial phase complete - start homing
            let target: Entity | null = null;
            if (entity.targetId !== undefined) {
              target = this.entities.find(e => e.id === entity.targetId && 
                e.hp !== undefined && e.hp > 0) || null;
            }
            
            // If no target was set initially, try to find one now (only within 30° cone to the right)
            if (!target) {
              // Calculate current direction angle from velocity
              const directionAngle = Math.atan2(entity.vy, entity.vx);
              const ssmTarget = this.findSSMTarget(entity.x, entity.y, directionAngle);
              if (ssmTarget) {
                entity.targetId = ssmTarget.id;
                target = ssmTarget;
              }
            }
            
            updateHomingMissile(entity, target, dt);
            // Update lifetime
            if (entity.lifetime !== undefined) {
              entity.lifetime -= dt;
              if (entity.lifetime <= 0) {
                entity.hp = -1; // Mark for removal
              }
            }
          }
        } else if (entity.type === EntityType.ENEMY_ASM) {
          // Enemy ASM missiles - fly straight initially, then start homing at player
          if (entity.homingDelay !== undefined && entity.homingDelay > 0) {
            // Still in initial flight phase - fly straight forward
            entity.homingDelay -= dt;
            entity.x += entity.vx * dt;
            entity.y += entity.vy * dt;
            
            // Update lifetime
            if (entity.lifetime !== undefined) {
              entity.lifetime -= dt;
              if (entity.lifetime <= 0) {
                entity.hp = -1; // Mark for removal
              }
            }
          } else {
            // Initial phase complete - start homing at player
            let target: Entity | null = null;
            if (entity.targetId !== undefined) {
              target = this.entities.find(e => e.id === entity.targetId && 
                e.hp !== undefined && e.hp > 0) || null;
            }
            
            // If no target, target the player
            if (!target && this.player.entity.hp !== undefined && this.player.entity.hp > 0) {
              target = this.player.entity;
              entity.targetId = this.player.entity.id;
            }
            
            updateHomingMissile(entity, target, dt, 9.0); // Reduced turn rate for player evasion
            // Update lifetime
            if (entity.lifetime !== undefined) {
              entity.lifetime -= dt;
              if (entity.lifetime <= 0) {
                entity.hp = -1; // Mark for removal
              }
            }
          }
        }
      } else {
        updateEntityMovement(entity, dt);
      }
    }
    
    // Update explosions
    for (const exp of this.explosions) {
      if (exp.lifetime !== undefined) {
        exp.lifetime -= dt;
      }
    }
    this.explosions = this.explosions.filter(e => e.lifetime === undefined || e.lifetime > 0);
    
    // Update smoke particles
    for (const smoke of this.smokeParticles) {
      smoke.x += smoke.vx * dt;
      smoke.y += smoke.vy * dt;
      if (smoke.lifetime !== undefined) {
        smoke.lifetime -= dt;
      }
    }
    this.smokeParticles = this.smokeParticles.filter((e: Entity) => e.lifetime === undefined || e.lifetime > 0);
    
    // Check collisions
    const hits = checkCollisions(this.entities);
    for (const hit of hits) {
      if (hit.entity1.type === EntityType.PLAYER) {
        // Player hit
        if (hit.entity2.damage) {
          this.player.takeDamage(hit.entity2.damage);
          this.director.reduceHeat(5);
          hit.entity2.hp = -1;
          
          // Create explosion
          const exp: Entity = {
            id: 999998,
            type: EntityType.EXPLOSION,
            x: hit.entity2.x,
            y: hit.entity2.y,
            vx: 0,
            vy: 0,
            sprite: createExplosionSprite(2),
            lifetime: 200,
            maxLifetime: 200
          };
          this.explosions.push(exp);
          this.triggerSfx({ type: "explosion" });
        } else if (hit.entity2.type === EntityType.ENEMY_DRONE ||
                   hit.entity2.type === EntityType.ENEMY_JET ||
                   hit.entity2.type === EntityType.ENEMY_BOAT ||
                   hit.entity2.type === EntityType.ENEMY_FRIGATE ||
                   hit.entity2.type === EntityType.ENEMY_ASM) {
          // Ramming damage (ASM does more damage)
          const damage = hit.entity2.type === EntityType.ENEMY_ASM ? 40 : 20;
          this.player.takeDamage(damage);
          hit.entity2.hp = -1;
          
          // Create explosion
          const expRamHit: Entity = {
            id: 999996,
            type: EntityType.EXPLOSION,
            x: hit.entity2.x,
            y: hit.entity2.y,
            vx: 0,
            vy: 0,
            sprite: createExplosionSprite(3),
            lifetime: 300,
            maxLifetime: 300
          };
          this.explosions.push(expRamHit);
          this.triggerSfx({ type: "explosion" });
        }
      } else if (hit.entity1.type === EntityType.ENEMY_DRONE ||
                 hit.entity1.type === EntityType.ENEMY_JET ||
                 hit.entity1.type === EntityType.ENEMY_BOAT ||
                 hit.entity1.type === EntityType.ENEMY_FRIGATE ||
                 hit.entity1.type === EntityType.ENEMY_ASM) {
        // Enemy hit by bullet/beam
        if (hit.entity2.damage) {
          hit.entity1.hp = (hit.entity1.hp || 0) - hit.entity2.damage;
          if (hit.entity1.hp <= 0) {
            // Enemy killed
            if (hit.entity1.type === EntityType.ENEMY_ASM) {
              // ASM gives less score
              this.score += 5;
              this.weapons.addPower(2);
            } else {
              this.score += 10 * (hit.entity1.enemyType || 1);
              this.weapons.addPower(5); // Same as laser kills
            }
            this.director.reduceHeat(1);
            
            // Create explosion
            const exp: Entity = {
              id: 999997,
              type: EntityType.EXPLOSION,
              x: hit.entity1.x,
              y: hit.entity1.y,
              vx: 0,
              vy: 0,
              sprite: createExplosionSprite(3),
              lifetime: 300,
              maxLifetime: 300
            };
            this.explosions.push(exp);
            this.triggerSfx({ type: "explosion" });
          } else {
            this.triggerSfx({ type: "hit" });
          }
          // Remove bullets and missiles (but not railgun beams - they pierce through)
          if (hit.entity2.type === EntityType.BULLET || 
              hit.entity2.type === EntityType.SAM_MISSILE ||
              hit.entity2.type === EntityType.SSM_MISSILE) {
            hit.entity2.hp = -1;
          }
        }
      }
    }
    
    // Remove dead entities
    this.entities = this.entities.filter(e => {
      if (e.hp !== undefined && e.hp <= 0 && e.type !== EntityType.PLAYER) {
        // Bereinige Animation State vor dem Entfernen
        cleanupEnemyAnimation(e.id);
        return false;
      }
      return true;
    });
    
    // Check game over
    if (!this.player.isAlive()) {
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem("bestScore", this.bestScore.toString());
      }
      this.state = GameState.GAME_OVER;
    }
  }

  screenShake(duration: number) {
    this.screenShakeTime = duration;
  }

  flash(duration: number) {
    this.flashTime = duration;
  }

  getEntities(): Entity[] {
    return [...this.entities, ...this.explosions, ...this.smokeParticles];
  }

  getPlayer(): Player {
    return this.player;
  }

  getWeapons(): WeaponSystem {
    return this.weapons;
  }

  getDirector(): SpawnDirector {
    return this.director;
  }

  getScreenShake(): { x: number; y: number } {
    return { x: this.screenShakeX, y: this.screenShakeY };
  }

  getFlashTime(): number {
    return this.flashTime;
  }

  getLaserTarget(): Entity | null {
    return this.laserTarget;
  }

  getLaserBeamTarget(): { x: number; y: number } | null {
    return this.laserBeamTarget;
  }

  getSAMTarget(): Entity | null {
    return this.samTarget;
  }
}

