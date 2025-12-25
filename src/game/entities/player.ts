import { Entity, EntityType, createEntity } from "./entity";
import { SEA_Y, SEA_HEIGHT, W, H } from "../../engine/render/constants";
import { Sprite } from "../../engine/render/blit";
import { AnimatedSprite } from "../../engine/render/animation";
import { createAnimationState, updateAnimation, AnimationState } from "../../engine/render/animation";

export class Player {
  public entity: Entity;
  public maxHp = 100;
  public hp = 100;
  private animationState: AnimationState;
  
  // Position constraints (allow movement in water zone and slightly above horizon)
  public readonly MIN_Y = SEA_Y - 5; // Allow slight overlap above horizon
  public readonly MAX_Y = H - 10; // Near bottom of screen
  public readonly START_X = 48; // Adjusted for larger 64x32 sprite (64/2 + margin)

  constructor(animatedSprite: AnimatedSprite) {
    // Erstelle Animation State
    this.animationState = createAnimationState(
      animatedSprite,
      200,  // 200ms pro Frame (für Idle-Animation)
      true  // Loop
    );

    // Verwende das erste Frame als Start-Sprite
    const startSprite = animatedSprite.frames[0];
    this.entity = createEntity(EntityType.PLAYER, this.START_X, (this.MIN_Y + this.MAX_Y) / 2, startSprite);
    this.entity.hp = this.maxHp;
    this.entity.maxHp = this.maxHp;
    this.entity.vx = 0;
    this.entity.vy = 0;
    
    // Fair hitbox (smaller than sprite) - adjusted for 64x32 sprite
    this.entity.hitbox = {
      x: -20,  // -20 from center (sprite width 64, so about 2/3)
      y: -12,  // -12 from center (sprite height 32, so about 2/3)
      w: 40,   // 40 width (smaller than 64)
      h: 24    // 24 height (smaller than 32)
    };
  }

  update(dt: number, input: {
    moveUp: boolean;
    moveDown: boolean;
    moveLeft: boolean;
    moveRight: boolean;
  }) {
    // Update animation
    this.entity.sprite = updateAnimation(this.animationState, dt);
    
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
    
    // Keep player on screen horizontally (with margin for larger 64x32 sprite)
    const margin = 32; // Margin for sprite half-width (64/2)
    if (this.entity.x < margin) {
      this.entity.x = margin;
      this.entity.vx = 0;
    }
    if (this.entity.x > W - margin) {
      this.entity.x = W - margin;
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

