import { Entity, EntityType } from "./entities/entity";
import { Player } from "./entities/player";
import { updateEnemy, cleanupEnemyAnimation } from "./entities/enemy";
import { WeaponSystem } from "./weapons/weapon";
import { SpawnDirector } from "./director";
import { checkCollisions } from "./systems/collision";
import { updateEntityMovement } from "./systems/movement";
import { createPlayerBullet, createRailgunBeam } from "./systems/projectiles";
import { createExplosionSprite } from "../assets/sprites";
import { AnimatedSprite } from "../engine/render/animation";

export enum GameState {
  TITLE,
  RUNNING,
  GAME_OVER
}

export class Game {
  public state = GameState.TITLE;
  public score = 0;
  public bestScore = 0;
  
  private player: Player;
  private weapons: WeaponSystem;
  private director: SpawnDirector;
  private entities: Entity[] = [];
  private explosions: Entity[] = [];
  
  // Screen shake
  private screenShakeX = 0;
  private screenShakeY = 0;
  private screenShakeTime = 0;
  
  // Flash effect (for Prompt Strike)
  private flashTime = 0;
  
  // Laser target tracking
  public laserTarget: Entity | null = null;
  private laserBeamTarget: { x: number; y: number } | null = null;

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
    this.entities.push(this.player.entity);
    this.laserTarget = null;
    this.laserBeamTarget = null;
  }

  private findLaserTarget(): Entity | null {
    const maxRange = 60;
    let nearestEnemy: Entity | null = null;
    let nearestDist = maxRange;
    
    for (const entity of this.entities) {
      // Check if it's an enemy
      if (entity.type === EntityType.ENEMY_DRONE ||
          entity.type === EntityType.ENEMY_JET ||
          entity.type === EntityType.ENEMY_BOAT ||
          entity.type === EntityType.ENEMY_FRIGATE) {
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

  update(dt: number, input: {
    moveUp: boolean;
    moveDown: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    fire: boolean;
    railgun: boolean;
    laser: boolean;
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
      }
    }
    
    // Find laser target (nearest enemy within 60 pixels)
    this.laserTarget = this.findLaserTarget();
    
    // Handle laser fire (once per key press)
    if (input.laser && this.weapons.canFireLaser() && this.laserTarget) {
      // Fire the laser
      this.weapons.fireLaser();
      
      // Store target position for beam rendering
      this.laserBeamTarget = { x: this.laserTarget.x, y: this.laserTarget.y };
      
      // Deal damage to target
      const damage = 50;
      if (this.laserTarget.hp !== undefined) {
        this.laserTarget.hp -= damage;
        if (this.laserTarget.hp <= 0) {
          // Target destroyed - create explosion
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
        }
      }
    }
    
    // Clear beam target when beam is no longer visible
    if (!this.weapons.isLaserBeamVisible()) {
      this.laserBeamTarget = null;
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
            e.type === EntityType.BULLET) {
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
        updateEnemy(entity, dt);
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
        } else if (hit.entity2.type === EntityType.ENEMY_DRONE ||
                   hit.entity2.type === EntityType.ENEMY_JET ||
                   hit.entity2.type === EntityType.ENEMY_BOAT ||
                   hit.entity2.type === EntityType.ENEMY_FRIGATE) {
          // Ramming damage
          this.player.takeDamage(20);
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
        }
      } else if (hit.entity1.type === EntityType.ENEMY_DRONE ||
                 hit.entity1.type === EntityType.ENEMY_JET ||
                 hit.entity1.type === EntityType.ENEMY_BOAT ||
                 hit.entity1.type === EntityType.ENEMY_FRIGATE) {
        // Enemy hit by bullet/beam
        if (hit.entity2.damage) {
          hit.entity1.hp = (hit.entity1.hp || 0) - hit.entity2.damage;
          if (hit.entity1.hp <= 0) {
            // Enemy killed
            this.score += 10 * (hit.entity1.enemyType || 1);
            this.weapons.addPower(5); // Same as laser kills
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
          }
          // Only remove bullets, not railgun beams (they pierce through)
          if (hit.entity2.type === EntityType.BULLET) {
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
    return [...this.entities, ...this.explosions];
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
}

