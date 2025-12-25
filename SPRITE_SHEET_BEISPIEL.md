# Sprite Sheet Verwendungsbeispiel

Dieses Dokument zeigt konkrete Code-Beispiele, wie du Sprite Sheets im Spiel verwendest.

## Antworten auf deine Fragen

### 1. Animationssystem

**Ja, es gibt jetzt ein Animationssystem!** Es wurde gerade erstellt in `src/engine/render/animation.ts`.

Das System bietet:
- `AnimatedSprite`: Container für mehrere Sprite-Frames
- `AnimationState`: Verwaltet den aktuellen Animationszustand
- `updateAnimation()`: Aktualisiert die Animation basierend auf der Zeit
- Unterstützung für Looping und Non-Looping Animationen

### 2. Sprite Sheet Format

Sprite Sheets sind einfache PNG-Dateien mit mehreren Frames in einem Raster:

```
Beispiel: Explosion mit 4 Frames (20x20 Pixel)
┌──────────────────────────────┐
│ Frame 0  Frame 1  Frame 2  Frame 3 │
│ (20x20)  (20x20)  (20x20)  (20x20) │
└──────────────────────────────┘
Sheet-Größe: 80x20 Pixel
```

Siehe `SPRITE_SHEET_GUIDE.md` für detaillierte Anleitung!

---

## Beispiel 1: Explosion-Animation implementieren

### Schritt 1: Sprite Sheet erstellen

Erstelle `assets/explosion.png` mit 4 Frames à 20x20 Pixel:
- Frame 0: Kleine Explosion (gelb/rot)
- Frame 1: Größere Explosion (mehr rot)
- Frame 2: Noch größer (mehr orange)
- Frame 3: Größte Explosion (orange/gelb)

**Sheet-Größe:** 80x20 Pixel (4 Frames horizontal)

### Schritt 2: Sprite Sheet laden

```typescript
// In src/assets/sprites.ts oder einem neuen Asset-Manager

import { loadSpriteSheet } from "./sprite-loader";
import { AnimatedSprite } from "../engine/render/animation";

let explosionAnimatedSprite: AnimatedSprite | null = null;

export async function loadAllSprites() {
  explosionAnimatedSprite = await loadSpriteSheet(
    "assets/explosion.png",
    20,  // frameWidth
    20,  // frameHeight
    {
      framesPerRow: 4,
      frameCount: 4
    }
  );
}

export function getExplosionAnimatedSprite(): AnimatedSprite {
  if (!explosionAnimatedSprite) {
    throw new Error("Sprites noch nicht geladen! Rufe loadAllSprites() auf.");
  }
  return explosionAnimatedSprite;
}
```

### Schritt 3: In Game.ts verwenden

```typescript
// In src/game/game.ts

import { createAnimationState, updateAnimation, AnimationState } from "../engine/render/animation";
import { getExplosionAnimatedSprite } from "../assets/sprites";

export class Game {
  // ... existing code ...
  private explosionAnimations = new Map<number, AnimationState>();

  // In createExplosion():
  private createExplosion(x: number, y: number): Entity {
    const animatedSprite = getExplosionAnimatedSprite();
    const animState = createAnimationState(
      animatedSprite,
      100,  // 100ms pro Frame
      false // Nicht loopen
    );

    const exp: Entity = {
      id: nextId++,
      type: EntityType.EXPLOSION,
      x,
      y,
      vx: 0,
      vy: 0,
      sprite: animatedSprite.frames[0], // Start-Frame
      lifetime: 400, // 4 Frames * 100ms
      maxLifetime: 400
    };

    this.explosionAnimations.set(exp.id, animState);
    return exp;
  }

  // In update():
  // Update explosion animations
  for (const exp of this.explosions) {
    const animState = this.explosionAnimations.get(exp.id);
    if (animState) {
      exp.sprite = updateAnimation(animState, dt);
    }
  }

  // Cleanup when explosion is removed
  this.explosions = this.explosions.filter(e => {
    if (e.lifetime === undefined || e.lifetime <= 0) {
      this.explosionAnimations.delete(e.id);
      return false;
    }
    return true;
  });
}
```

---

## Beispiel 2: Player-Animation (Idle/Moving)

### Sprite Sheet erstellen

Erstelle `assets/player.png` mit 2 Frames à 32x24 Pixel:
- Frame 0: Idle/Standard
- Frame 1: Moving (leicht verschoben)

**Sheet-Größe:** 64x24 Pixel (2 Frames horizontal)

### Code

```typescript
// In src/assets/sprites.ts

let playerAnimatedSprite: AnimatedSprite | null = null;

export async function loadAllSprites() {
  // ... andere Sprites ...
  
  playerAnimatedSprite = await loadSpriteSheet(
    "assets/player.png",
    32,  // frameWidth
    24,  // frameHeight
    {
      framesPerRow: 2,
      frameCount: 2
    }
  );
}

export function getPlayerAnimatedSprite(): AnimatedSprite {
  if (!playerAnimatedSprite) {
    throw new Error("Sprites noch nicht geladen!");
  }
  return playerAnimatedSprite;
}
```

### In Player.ts verwenden

```typescript
// In src/game/entities/player.ts

import { getPlayerAnimatedSprite } from "../../assets/sprites";
import { createAnimationState, updateAnimation, AnimationState } from "../../engine/render/animation";

export class Player {
  public entity: Entity;
  private animState: AnimationState;

  constructor() {
    const animatedSprite = getPlayerAnimatedSprite();
    this.animState = createAnimationState(
      animatedSprite,
      200,  // 200ms pro Frame (langsam für Idle)
      true  // Loopen
    );

    this.entity = createEntity(
      EntityType.PLAYER,
      this.START_X,
      (this.MIN_Y + this.MAX_Y) / 2,
      animatedSprite.frames[0] // Start-Frame
    );
    // ... rest of initialization
  }

  update(dt: number, input: { ... }) {
    // ... existing movement code ...

    // Update animation
    this.entity.sprite = updateAnimation(this.animState, dt);
  }
}
```

---

## Beispiel 3: Sprite Sheet mit Abständen

Wenn dein Sprite Sheet Abstände zwischen den Frames hat:

```typescript
const sprite = await loadSpriteSheet(
  "assets/sprites.png",
  32,  // frameWidth
  32,  // frameHeight
  {
    framesPerRow: 4,
    frameCount: 8,
    spacingX: 2,  // 2 Pixel horizontaler Abstand
    spacingY: 2   // 2 Pixel vertikaler Abstand
  }
);
```

---

## Beispiel 4: Multi-Row Sprite Sheet

Für komplexere Sprite Sheets mit mehreren Zeilen:

```typescript
// Sheet: 128x64 (8 Frames à 32x32, 4 pro Zeile)

const sprite = await loadSpriteSheet(
  "assets/complex-sheet.png",
  32,  // frameWidth
  32,  // frameHeight
  {
    framesPerRow: 4,  // 4 Frames pro Zeile
    frameCount: 8     // 8 Frames total (2 Zeilen)
  }
);
```

---

## Beispiel 5: Assets beim Start laden

```typescript
// In src/main.ts

import { loadAllSprites } from "./assets/sprites";

async function init() {
  // Lade alle Sprite Sheets
  await loadAllSprites();
  
  // Dann erstelle Game, etc.
  const game = new Game();
  // ...
}

init().catch(console.error);
```

---

## Zusammenfassung

### Sprite Sheet Format:

1. **PNG-Datei** mit mehreren Frames in einem Raster
2. **Frames müssen gleiche Größe haben**
3. **Nur VGA-Farben verwenden** (16 Farben)
4. **Transparenz:** Alpha < 128 wird als transparent behandelt

### Verwendung:

1. **Lade Sprite Sheet** mit `loadSpriteSheet()`
2. **Erstelle Animation State** mit `createAnimationState()`
3. **Update in Loop** mit `updateAnimation()`
4. **Verwende aktuelles Sprite** aus Animation State

### Struktur:

```
assets/
  ├── explosion.png    (80x20, 4 Frames à 20x20)
  ├── player.png       (64x24, 2 Frames à 32x24)
  ├── enemy-drone.png  (24x12, 2 Frames à 12x12)
  └── ...
```

Viel Erfolg beim Erstellen deiner Sprite Sheets! 🎨

