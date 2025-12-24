import { Entity } from "../entities/entity";

export enum WeaponType {
  ARTILLERY,  // Primary
  RAILGUN,    // Charge
  AA_MISSILE, // Anti-air
  SSM,        // Ship-ship missile
  LASER,      // Defense
  PROMPT_STRIKE // Ultimate
}

export interface WeaponState {
  type: WeaponType;
  cooldown: number;
  chargeTime: number;
  isCharging: boolean;
  isActive: boolean; // For laser
}

export class WeaponSystem {
  private weapons: Map<WeaponType, WeaponState> = new Map();
  
  // Artillery
  private artilleryCooldown = 0;
  private artilleryRate = 300; // ms between shots
  
  // Railgun
  private railgunCooldown = 0;
  private railgunRate = 5000; // 5 seconds cooldown
  
  // AA Missile
  private aaCooldown = 0;
  private aaRate = 800; // ms between shots
  
  // SSM
  private ssmCooldown = 0;
  private ssmRate = 2000; // ms between shots
  
  // Laser
  private laserCooldown = 0;
  private laserCooldownTime = 1000; // 1 second cooldown after use
  private laserActiveTime = 0; // How long the laser beam is visible (ms)
  private laserMaxActiveTime = 200; // Visual beam duration (increased for visibility)
  
  // Prompt Strike
  public powerMeter = 0;
  public powerMax = 100;
  private promptStrikeActive = false;
  private promptStrikeDuration = 500; // ms

  constructor() {
    // Initialize all weapons
    this.weapons.set(WeaponType.ARTILLERY, {
      type: WeaponType.ARTILLERY,
      cooldown: 0,
      chargeTime: 0,
      isCharging: false,
      isActive: false
    });
    // ... others initialized similarly
  }

  update(dt: number) {
    // Update cooldowns
    if (this.artilleryCooldown > 0) this.artilleryCooldown -= dt;
    if (this.railgunCooldown > 0) this.railgunCooldown -= dt;
    if (this.aaCooldown > 0) this.aaCooldown -= dt;
    if (this.ssmCooldown > 0) this.ssmCooldown -= dt;
    if (this.laserCooldown > 0) this.laserCooldown -= dt;
    if (this.laserActiveTime > 0) this.laserActiveTime -= dt;
    
    // Update prompt strike
    if (this.promptStrikeActive) {
      this.promptStrikeDuration -= dt;
      if (this.promptStrikeDuration <= 0) {
        this.promptStrikeActive = false;
        this.promptStrikeDuration = 500;
        this.powerMeter = 0;
      }
    }
    
    // Power meter fills slowly over time and with kills
    if (!this.promptStrikeActive && this.powerMeter < this.powerMax) {
      this.powerMeter = Math.min(this.powerMax, this.powerMeter + dt / 600); // ~60 seconds to fill
    }
  }

  canFireArtillery(): boolean {
    return this.artilleryCooldown <= 0;
  }

  fireArtillery(playerX: number, playerY: number): Entity | null {
    if (!this.canFireArtillery()) return null;
    this.artilleryCooldown = this.artilleryRate;
    // Create bullet entity will be handled by caller
    return null;
  }

  canFireRailgun(): boolean {
    return this.railgunCooldown <= 0;
  }

  fireRailgun() {
    if (!this.canFireRailgun()) return false;
    this.railgunCooldown = this.railgunRate;
    return true;
  }

  canFireAA(): boolean {
    return this.aaCooldown <= 0;
  }

  fireAA(playerX: number, playerY: number): Entity | null {
    if (!this.canFireAA()) return null;
    this.aaCooldown = this.aaRate;
    return null;
  }

  canFireSSM(): boolean {
    return this.ssmCooldown <= 0;
  }

  fireSSM(playerX: number, playerY: number): Entity | null {
    if (!this.canFireSSM()) return null;
    this.ssmCooldown = this.ssmRate;
    return null;
  }

  canFireLaser(): boolean {
    return this.laserCooldown <= 0;
  }

  fireLaser(): void {
    this.laserCooldown = this.laserCooldownTime;
    this.laserActiveTime = this.laserMaxActiveTime;
  }

  isLaserBeamVisible(): boolean {
    return this.laserActiveTime > 0;
  }

  canUsePromptStrike(): boolean {
    return this.powerMeter >= this.powerMax && !this.promptStrikeActive;
  }

  usePromptStrike(): boolean {
    if (!this.canUsePromptStrike()) return false;
    this.promptStrikeActive = true;
    this.powerMeter = 0;
    return true;
  }

  isPromptStrikeActive(): boolean {
    return this.promptStrikeActive;
  }

  addPower(amount: number) {
    if (!this.promptStrikeActive) {
      this.powerMeter = Math.min(this.powerMax, this.powerMeter + amount);
    }
  }
}

