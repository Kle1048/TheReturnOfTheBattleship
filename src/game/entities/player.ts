import { Entity, EntityType, createEntity } from "./entity";
import { createPlayerSprite } from "../../assets/sprites";
import { SEA_Y, SEA_HEIGHT, W, H } from "../../engine/render/constants";
import { Sprite } from "../../engine/render/blit";

export class Player {
  public entity: Entity;
  public maxHp = 100;
  public hp = 100;
  
  // Position constraints (allow movement in water zone and slightly above horizon)
  public readonly MIN_Y = SEA_Y - 5; // Allow slight overlap above horizon
  public readonly MAX_Y = H - 10; // Near bottom of screen
  public readonly START_X = 40;

  constructor() {
    const sprite = createPlayerSprite();
    this.entity = createEntity(EntityType.PLAYER, this.START_X, (this.MIN_Y + this.MAX_Y) / 2, sprite);
    this.entity.hp = this.maxHp;
    this.entity.maxHp = this.maxHp;
    this.entity.vx = 0;
    this.entity.vy = 0;
    
    // Fair hitbox (smaller than sprite)
    this.entity.hitbox = {
      x: -12,
      y: -8,
      w: 24,
      h: 16
    };
  }

  update(dt: number, input: {
    moveUp: boolean;
    moveDown: boolean;
    moveLeft: boolean;
    moveRight: boolean;
  }) {
    const speed = 0.15; // pixels per ms
    
    if (input.moveUp) {
      this.entity.vy = -speed;
    } else if (input.moveDown) {
      this.entity.vy = speed;
    } else {
      this.entity.vy *= 0.8; // Friction
    }
    
    // Horizontal movement (full speed now)
    if (input.moveLeft) {
      this.entity.vx = -speed;
    } else if (input.moveRight) {
      this.entity.vx = speed;
    } else {
      this.entity.vx *= 0.8;
    }
    
    // Update position
    this.entity.y += this.entity.vy * dt;
    this.entity.x += this.entity.vx * dt;
    
    // Clamp to water zone (with slight overlap above horizon)
    if (this.entity.y < this.MIN_Y) {
      this.entity.y = this.MIN_Y;
      this.entity.vy = 0;
    }
    if (this.entity.y > this.MAX_Y) {
      this.entity.y = this.MAX_Y;
      this.entity.vy = 0;
    }
    
    // Keep player on screen horizontally (with margin for sprite)
    if (this.entity.x < 20) {
      this.entity.x = 20;
      this.entity.vx = 0;
    }
    if (this.entity.x > W - 20) {
      this.entity.x = W - 20;
      this.entity.vx = 0;
    }
    
    // Update entity HP
    this.entity.hp = this.hp;
  }

  takeDamage(amount: number) {
    this.hp = Math.max(0, this.hp - amount);
    this.entity.hp = this.hp;
  }

  heal(amount: number) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.entity.hp = this.hp;
  }

  isAlive(): boolean {
    return this.hp > 0;
  }
}

