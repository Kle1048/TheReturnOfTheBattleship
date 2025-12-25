# Sprite Sheet Integration - Player Ship

## Übersicht

Das Player-Schiff verwendet jetzt ein Sprite Sheet mit 4 Frames für Animationen.

## Sprite Sheet Format

**Dateiname:** `assets/player.png`  
**Größe:** 256x32 Pixel (4 Frames à 64x32 Pixel, horizontal nebeneinander)

```
┌─────────────────────────────────────────────────────────────┐
│ Frame 0    Frame 1    Frame 2    Frame 3                  │
│ (64x32)    (64x32)    (64x32)    (64x32)                  │
└─────────────────────────────────────────────────────────────┘
```

## Installation

1. **Platziere dein Sprite Sheet:**
   - Erstelle einen Ordner `assets/` im Projekt-Root (falls noch nicht vorhanden)
   - Speichere dein Sprite Sheet als `assets/player.png`

2. **Format-Anforderungen:**
   - 4 Frames, horizontal nebeneinander
   - Jeder Frame: 64x32 Pixel
   - Gesamt-Größe: 256x32 Pixel (4 × 64)
   - VGA-16-Farben-Palette
   - Transparenz: Schwarze Bereiche oder Alpha < 128

## Wie es funktioniert

### 1. Asset-Manager (`src/assets/assets.ts`)

Der Asset-Manager lädt alle Sprites beim Start:

```typescript
const assets = new AssetManager();
await assets.loadAll(); // Lädt player.png
```

### 2. Player-Klasse (`src/game/entities/player.ts`)

Der Player verwendet jetzt ein `AnimatedSprite`:

```typescript
constructor(animatedSprite: AnimatedSprite) {
  // Erstellt Animation State mit 200ms pro Frame
  this.animationState = createAnimationState(animatedSprite, 200, true);
  
  // Startet mit Frame 0
  this.entity.sprite = animatedSprite.frames[0];
}

update(dt: number, input: {...}) {
  // Aktualisiert Animation jedes Frame
  this.entity.sprite = updateAnimation(this.animationState, dt);
  // ...
}
```

### 3. Game-Initialisierung (`src/main.ts`)

Assets werden geladen, bevor das Game erstellt wird:

```typescript
async function init() {
  await assets.loadAll();  // Lädt Sprite Sheets
  const playerSprite = assets.getPlayerSprite();
  game = new Game(playerSprite);  // Game mit geladenen Sprites
}
```

## Animation

- **Frame-Dauer:** 200ms pro Frame (kannst du in `player.ts` anpassen)
- **Loop:** Ja (Animation wiederholt sich)
- **4 Frames:** Idle-Animation für das Player-Schiff

### Animation anpassen

Wenn du die Animationsgeschwindigkeit ändern möchtest:

```typescript
// In src/game/entities/player.ts, constructor:
this.animationState = createAnimationState(
  animatedSprite,
  150,  // 150ms = schneller
  // oder
  300,  // 300ms = langsamer
  true  // Loop
);
```

## Fehlerbehebung

### "Sprites noch nicht geladen!"

- Stelle sicher, dass `assets/player.png` existiert
- Prüfe die Browser-Konsole auf Fehler beim Laden
- Stelle sicher, dass der Pfad `assets/player.png` korrekt ist

### Sprite wird nicht angezeigt

1. **Größe prüfen:** Sprite Sheet muss genau 256x32 Pixel sein (4 × 64)
2. **Format prüfen:** Muss PNG sein
3. **Browser-Konsole:** Prüfe auf Fehler

### Animation läuft nicht

- Stelle sicher, dass `updateAnimation()` in der `update()`-Methode aufgerufen wird
- Prüfe, ob `dt` korrekt übergeben wird

## Nächste Schritte

Du kannst jetzt:
- Weitere Sprite Sheets für andere Entities hinzufügen
- Animation-Geschwindigkeiten anpassen
- Verschiedene Animationen für verschiedene Zustände erstellen (z.B. Moving vs. Idle)

## Beispiel: Andere Sprites hinzufügen

Um weitere Sprites hinzuzufügen, erweitere `assets.ts`:

```typescript
export class AssetManager {
  public playerSprite: AnimatedSprite | null = null;
  public explosionSprite: AnimatedSprite | null = null; // Neu

  async loadAll(): Promise<void> {
    this.playerSprite = await loadSpriteSheet("assets/player.png", 64, 32, {
      framesPerRow: 4,
      frameCount: 4
    });
    
    // Explosion hinzufügen
    this.explosionSprite = await loadSpriteSheet("assets/explosion.png", 20, 20, {
      framesPerRow: 4,
      frameCount: 4
    });
  }

  getExplosionSprite(): AnimatedSprite {
    if (!this.explosionSprite) throw new Error("Sprites noch nicht geladen!");
    return this.explosionSprite;
  }
}
```

Viel Erfolg! 🎮

