# Sprite Sheet Guide - The Return of The Battleship

## Übersicht

Dieses Dokument erklärt, wie du Sprite Sheets für das Spiel erstellst und verwendest.

**💡 Tipp:** Möchtest du ein LLM (z.B. ChatGPT) beim Erstellen von Sprite Sheets helfen lassen? Siehe `LLM_PROMPT_SPRITE_SHEETS.md` für optimierte Prompt-Vorlagen!

---

## Sprite Sheet Format

### Grundlegende Struktur

Ein Sprite Sheet ist eine PNG-Datei, die mehrere Sprite-Frames enthält, die in einem Raster angeordnet sind.

```
┌─────────────────────────────────────┐
│ Frame 0  Frame 1  Frame 2  Frame 3 │ ← Zeile 0
│ Frame 4  Frame 5  Frame 6  Frame 7 │ ← Zeile 1
│ ...                                 │
└─────────────────────────────────────┘
```

### Wichtige Anforderungen

1. **Farbpalette:** Verwende NUR die 16 VGA-Farben (siehe unten)
2. **Format:** PNG mit indizierter Farbpalette (empfohlen) oder RGB mit Alpha-Kanal
3. **Transparenz:** Vollständig transparente Pixel werden automatisch erkannt (Alpha < 128)
4. **Größe:** Alle Frames müssen die gleiche Größe haben
5. **Abstände:** Optional - du kannst Abstände zwischen Frames angeben

---

## VGA-Palette (16 Farben)

**WICHTIG:** Alle Sprites müssen diese Farben verwenden!

```
Index | Farbe        | RGB-Wert          | Hex
------|--------------|-------------------|-----------
0     | Transparent  | (0, 0, 0, 0)      | #00000000
1     | Schwarz      | (0, 0, 0)         | #000000
2     | Dunkelblau   | (0, 0, 128)       | #000080
3     | Blau         | (0, 0, 255)       | #0000FF
4     | Dunkelgrün   | (0, 128, 0)       | #008000
5     | Grün         | (0, 255, 0)       | #00FF00
6     | Dunkelgrau   | (64, 64, 64)      | #404040
7     | Grau         | (128, 128, 128)   | #808080
8     | Hellgrau     | (192, 192, 192)   | #C0C0C0
9     | Weiß         | (255, 255, 255)   | #FFFFFF
10    | Braun        | (128, 64, 0)      | #804000
11    | Orange       | (255, 128, 0)     | #FF8000
12    | Rot          | (255, 0, 0)       | #FF0000
13    | Magenta      | (255, 0, 255)     | #FF00FF
14    | Gelb         | (255, 255, 0)     | #FFFF00
15    | Cyan         | (0, 255, 255)     | #00FFFF
```

**Tipp:** Wenn du andere Farben verwendest, werden sie automatisch zur nächstgelegenen VGA-Farbe konvertiert. Das kann zu unerwarteten Ergebnissen führen!

---

## Erstellung von Sprite Sheets

### Option 1: Aseprite (Empfohlen)

1. **Neues Dokument erstellen:**
   - Datei → Neu
   - Größe: z.B. 128x32 (4 Frames à 32x32)
   - Farbmodus: Indiziert

2. **VGA-Palette importieren:**
   - Sprite → Paletten → Import Palette
   - Erstelle eine Palette-Datei mit den 16 VGA-Farben

3. **Frames zeichnen:**
   - Verwende nur die Palette-Farben
   - Zeichne Frame für Frame

4. **Exportieren:**
   - Datei → Export → Export Sprite Sheet
   - Format: PNG
   - Border Padding: 0 (oder deine gewünschte Spacing-Größe)

### Option 2: Piskel (Kostenlos, Online)

1. **Neues Sprite erstellen:**
   - Größe: z.B. 128x32 (für 4 Frames à 32x32)
   - Palette: Verwende die Standard-Palette und passe sie an VGA-Farben an

2. **Animation erstellen:**
   - Füge Frames hinzu (mehrere Frames = Sprite Sheet)

3. **Exportieren:**
   - Export → PNG
   - Wähle "Export as PNG" und "All frames in one image"

### Option 3: GIMP

1. **Neues Bild erstellen:**
   - Größe: z.B. 128x32
   - Modus: Indiziert (Image → Mode → Indexed)
   - Verwende eine benutzerdefinierte Palette mit VGA-Farben

2. **Frames zeichnen:**
   - Verwende Ebenen oder zeichne direkt

3. **Exportieren:**
   - File → Export As → PNG

---

## Sprite Sheet Beispiele

### Beispiel 1: Explosion-Animation (4 Frames, 20x20)

```
Sheet-Größe: 80x20 (4 Frames à 20x20, keine Abstände)
Frames pro Zeile: 4

┌───────────────────────────────────────────────────────────┐
│ Frame 0    Frame 1    Frame 2    Frame 3                 │
│ (20x20)    (20x20)    (20x20)    (20x20)                 │
└───────────────────────────────────────────────────────────┘
```

**Code:**
```typescript
const explosionSprite = await loadSpriteSheet(
  "assets/explosion.png",
  20,  // frameWidth
  20,  // frameHeight
  {
    framesPerRow: 4,
    frameCount: 4
  }
);
```

### Beispiel 2: Player-Animation (2 Frames, 32x24)

```
Sheet-Größe: 64x24 (2 Frames à 32x24, keine Abstände)
Frames pro Zeile: 2

┌──────────────────────────────┐
│ Frame 0    Frame 1           │
│ (32x24)    (32x24)           │
└──────────────────────────────┘
```

**Code:**
```typescript
const playerSprite = await loadSpriteSheet(
  "assets/player.png",
  32,  // frameWidth
  24,  // frameHeight
  {
    framesPerRow: 2,
    frameCount: 2
  }
);
```

### Beispiel 3: Mit Abständen (Spacing)

```
Sheet-Größe: 140x40 (4 Frames à 32x32, mit 2px Abstand)
Frames pro Zeile: 4

┌────────────────────────────────────────────────────────────┐
│ Frame 0  │ Frame 1  │ Frame 2  │ Frame 3                 │
│ (32x32)  │ (32x32)  │ (32x32)  │ (32x32)                 │
│    +2px  │    +2px  │    +2px  │                          │
└────────────────────────────────────────────────────────────┘
```

**Code:**
```typescript
const sprite = await loadSpriteSheet(
  "assets/sprites.png",
  32,  // frameWidth
  32,  // frameHeight
  {
    framesPerRow: 4,
    frameCount: 4,
    spacingX: 2,  // Horizontaler Abstand
    spacingY: 2   // Vertikaler Abstand
  }
);
```

### Beispiel 4: Multi-Row Sprite Sheet

```
Sheet-Größe: 64x64 (8 Frames à 32x32, 4 pro Zeile)

┌────────────────────────┐
│ Frame 0  Frame 1       │ ← Zeile 0
│ Frame 2  Frame 3       │
├────────────────────────┤
│ Frame 4  Frame 5       │ ← Zeile 1
│ Frame 6  Frame 7       │
└────────────────────────┘
```

**Code:**
```typescript
const sprite = await loadSpriteSheet(
  "assets/sprites.png",
  32,  // frameWidth
  32,  // frameHeight
  {
    framesPerRow: 4,  // 4 Frames pro Zeile
    frameCount: 8     // 8 Frames total
  }
);
```

---

## Verwendung im Code

### 1. Einzelnes Sprite laden

```typescript
import { loadSprite } from "./assets/sprite-loader";

const playerSprite = await loadSprite("assets/player.png");
```

### 2. Sprite Sheet laden (Animation)

```typescript
import { loadSpriteSheet } from "./assets/sprite-loader";
import { createAnimationState, updateAnimation } from "../engine/render/animation";

// Sprite Sheet laden
const explosionAnimatedSprite = await loadSpriteSheet(
  "assets/explosion.png",
  20,  // frameWidth
  20,  // frameHeight
  {
    framesPerRow: 4,
    frameCount: 4
  }
);

// Animation State erstellen
const explosionAnim = createAnimationState(
  explosionAnimatedSprite,
  100,  // 100ms pro Frame
  false // Loop = false (explosion spielt nur einmal)
);

// In der Update-Loop:
const currentSprite = updateAnimation(explosionAnim, dt);
```

### 3. Mit Entity-System

```typescript
// Explosion Entity mit Animation
const explosion: Entity = {
  id: nextId++,
  type: EntityType.EXPLOSION,
  x: 100,
  y: 100,
  vx: 0,
  vy: 0,
  sprite: explosionAnim.animatedSprite.frames[0], // Start-Frame
  lifetime: 400,
  maxLifetime: 400,
  // Animation State speichern (z.B. in einer Map)
};

// In update():
const animState = explosionAnimations.get(explosion.id);
if (animState) {
  explosion.sprite = updateAnimation(animState, dt);
}
```

---

## Best Practices

### 1. Frame-Größen

- **Player/Feinde:** 16x16 bis 32x32 Pixel
- **Kleine Objekte:** 8x8 bis 16x16 Pixel
- **Große Objekte:** 32x32 bis 48x48 Pixel
- **Explosionen/Effekte:** 16x16 bis 32x32 Pixel

### 2. Animation-Geschwindigkeit

- **Schnelle Animationen:** 50-100ms pro Frame
- **Normale Animationen:** 100-200ms pro Frame
- **Langsame Animationen:** 200-500ms pro Frame

### 3. Sprite Sheet Organisation

- **Ein Sprite Sheet pro Entity-Typ:** z.B. `player.png`, `explosion.png`
- **Oder ein großes Sheet:** Alle Sprites in einer Datei (z.B. `sprites.png`)
  - Verwende dann `startX` und `startY` um verschiedene Bereiche zu laden

### 4. Performance

- **Kleine Sprite Sheets:** Weniger Speicher, schnellere Ladezeit
- **Große Sprite Sheets:** Weniger HTTP-Requests, aber mehr Speicher

---

## Troubleshooting

### Problem: Farben sehen falsch aus

**Lösung:** Stelle sicher, dass dein Sprite Sheet nur VGA-Farben verwendet. Der Loader konvertiert automatisch, aber exakte Farben sehen besser aus.

### Problem: Transparenz funktioniert nicht

**Lösung:** Stelle sicher, dass transparente Bereiche einen Alpha-Wert < 128 haben.

### Problem: Frames sind falsch ausgerichtet

**Lösung:** Überprüfe `frameWidth`, `frameHeight`, `framesPerRow` und `spacingX/spacingY`.

### Problem: Animation läuft zu schnell/langsam

**Lösung:** Passe `frameDuration` in `createAnimationState()` an (Wert in Millisekunden).

---

## Nächste Schritte

1. Erstelle Sprite Sheets für Player, Feinde, Explosionen
2. Implementiere Animationssystem in Entities
3. Teste verschiedene Frame-Geschwindigkeiten
4. Optimiere Sprite Sheet Größen für Performance

Viel Erfolg! 🎮

