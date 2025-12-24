import { Entity, EntityType, EnemyType } from "./entities/entity";
import { createEnemy } from "./entities/enemy";
import { W, SEA_Y, SKY_HEIGHT } from "../engine/render/constants";

export class SpawnDirector {
  public heat = 0;
  private spawnTimer = 0;
  private baseSpawnRate = 2000; // ms between spawns at heat 0
  
  // Enemy counts for difficulty scaling
  private droneCount = 0;
  private jetCount = 0;
  private boatCount = 0;
  private frigateCount = 0;

  update(dt: number, existingEnemies: Entity[]): Entity[] {
    const newEnemies: Entity[] = [];
    
    // Heat increases over time
    this.heat += dt * 0.01; // +1 per 100 seconds
    
    // Heat affects spawn rate
    const spawnRate = Math.max(500, this.baseSpawnRate - this.heat * 10);
    
    this.spawnTimer += dt;
    if (this.spawnTimer >= spawnRate) {
      this.spawnTimer = 0;
      
      // Count existing enemies by type
      this.droneCount = existingEnemies.filter(e => e.type === EntityType.ENEMY_DRONE).length;
      this.jetCount = existingEnemies.filter(e => e.type === EntityType.ENEMY_JET).length;
      this.boatCount = existingEnemies.filter(e => e.type === EntityType.ENEMY_BOAT).length;
      this.frigateCount = existingEnemies.filter(e => e.type === EntityType.ENEMY_FRIGATE).length;
      
      // Decide what to spawn based on heat and existing enemies
      const spawnX = W + 50; // Off screen right
      
      // Early game: mostly drones and boats
      if (this.heat < 20) {
        if (Math.random() < 0.6) {
          // Air enemy
          const y = 20 + Math.random() * (SKY_HEIGHT - 40);
          newEnemies.push(createEnemy(EnemyType.DRONE, spawnX, y));
        } else {
          // Sea enemy
          const y = SEA_Y + 20 + Math.random() * 80;
          newEnemies.push(createEnemy(EnemyType.BOAT, spawnX, y));
        }
      }
      // Mid game: mix of all types
      else if (this.heat < 50) {
        const rand = Math.random();
        if (rand < 0.3) {
          const y = 20 + Math.random() * (SKY_HEIGHT - 40);
          newEnemies.push(createEnemy(EnemyType.DRONE, spawnX, y));
        } else if (rand < 0.5) {
          const y = 20 + Math.random() * (SKY_HEIGHT - 40);
          newEnemies.push(createEnemy(EnemyType.JET, spawnX, y));
        } else if (rand < 0.8) {
          const y = SEA_Y + 20 + Math.random() * 80;
          newEnemies.push(createEnemy(EnemyType.BOAT, spawnX, y));
        } else {
          const y = SEA_Y + 30 + Math.random() * 70;
          newEnemies.push(createEnemy(EnemyType.FRIGATE, spawnX, y));
        }
      }
      // Late game: more dangerous enemies
      else {
        const rand = Math.random();
        if (rand < 0.2) {
          const y = 20 + Math.random() * (SKY_HEIGHT - 40);
          newEnemies.push(createEnemy(EnemyType.DRONE, spawnX, y));
        } else if (rand < 0.5) {
          const y = 20 + Math.random() * (SKY_HEIGHT - 40);
          newEnemies.push(createEnemy(EnemyType.JET, spawnX, y));
        } else if (rand < 0.7) {
          const y = SEA_Y + 20 + Math.random() * 80;
          newEnemies.push(createEnemy(EnemyType.BOAT, spawnX, y));
        } else {
          const y = SEA_Y + 30 + Math.random() * 70;
          newEnemies.push(createEnemy(EnemyType.FRIGATE, spawnX, y));
        }
      }
    }
    
    return newEnemies;
  }

  // Reduce heat when player takes damage
  reduceHeat(amount: number) {
    this.heat = Math.max(0, this.heat - amount);
  }
}

