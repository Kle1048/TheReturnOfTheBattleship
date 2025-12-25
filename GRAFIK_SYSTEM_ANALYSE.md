# Grafiksystem Analyse - The Return of The Battleship

## Übersicht

Das Spiel verwendet ein **retro VGA-ähnliches Grafiksystem** mit einer festen 16-Farben-Palette und einer Auflösung von **320x200 Pixel**. Das System arbeitet mit einem **indizierten Farbpuffer** (Framebuffer), der später in RGBA konvertiert wird.

---

## Architektur

### 1. Render-Pipeline

```
VGARenderer (Hauptrenderer)
  ↓
Framebuffer (320x200, Uint8Array, Werte 0-15)
  ↓
Sprite-Blitting (via blit() Funktion)
  ↓
Present (Konvertierung Index → RGBA)
  ↓
Canvas Rendering
```

### 2. Komponenten

#### **VGARenderer** (`src/engine/render/renderer.ts`)
- Verwaltet den Canvas und den Framebuffer
- Konvertiert indizierte Farben (0-15) zu RGBA
- Skaliert das 320x200 Bild pixel-perfekt auf die Bildschirmgröße
- Enthält die VGA-Palette (16 Farben)

#### **Blit-System** (`src/engine/render/blit.ts`)
- `blit()`: Zeichnet Sprites in den Framebuffer
- `fillRect()`: Zeichnet gefüllte Rechtecke
- `drawLine()`: Zeichnet Linien
- Transparenz: Pixel mit Wert 0 sind transparent

#### **GameRenderer** (`src/game/renderer.ts`)
- Koordiniert das gesamte Rendering
- Zeichnet Hintergrund (Himmel/Meer)
- Rendert alle Entities mit Layering
- Zeichnet HUD, Laser-Targets, Explosionen

#### **Assets** (`src/assets/sprites.ts`)
- Alle Sprite-Erstellungsfunktionen
- Aktuell: Programmierte Sprites (Pixel für Pixel im Code)

---

## VGA-Palette (16 Farben)

Die Palette ist in `src/engine/render/constants.ts` definiert:

```
Index | Farbe        | RGBA-Wert
------|--------------|-----------
0     | Transparent  | [0, 0, 0, 0]
1     | Schwarz      | [0, 0, 0, 255]
2     | Dunkelblau   | [0, 0, 128, 255]
3     | Blau         | [0, 0, 255, 255]
4     | Dunkelgrün   | [0, 128, 0, 255]
5     | Grün         | [0, 255, 0, 255]
6     | Dunkelgrau   | [64, 64, 64, 255]
7     | Grau         | [128, 128, 128, 255]
8     | Hellgrau     | [192, 192, 192, 255]
9     | Weiß         | [255, 255, 255, 255]
10    | Braun        | [128, 64, 0, 255]
11    | Orange       | [255, 128, 0, 255]
12    | Rot          | [255, 0, 0, 255]
13    | Magenta      | [255, 0, 255, 255]
14    | Gelb         | [255, 255, 0, 255]
15    | Cyan         | [0, 255, 255, 255]
```

**Wichtig:** Alle Assets müssen diese 16 Farben verwenden!

---

## Sprite-System

### Sprite-Datenstruktur

```typescript
type Sprite = {
  w: number;           // Breite in Pixeln
  h: number;           // Höhe in Pixeln
  px: Uint8Array;      // Pixel-Array (Länge = w * h)
                       // Jeder Wert: 0-15 (Palettenindex)
}
```

### Aktuelle Sprites

In `src/assets/sprites.ts` sind folgende Sprites implementiert:

1. **Player** (`createPlayerSprite()`): 32x24 - Battleship
2. **Enemy Drone** (`createDroneSprite()`): 12x12 - Kleine rote Drohne
3. **Enemy Jet** (`createJetSprite()`): 24x16 - Orangenes Dreieck
4. **Enemy Boat** (`createBoatSprite()`): 28x20 - Braunes Boot
5. **Enemy Frigate** (`createFrigateSprite()`): 36x24 - Große Fregatte
6. **Bullet** (`createBulletSprite()`): 4x4 - Gelbes Projektil
7. **Railgun Beam** (`createRailgunBeamSprite()`): 4x200 - Cyan/Blau Strahl
8. **Explosion** (`createExplosionSprite(frame)`): 20x20 - Animierte Explosion

### Wie Sprites verwendet werden

```typescript
// 1. Sprite erstellen
const sprite = createPlayerSprite();

// 2. Entity mit Sprite erstellen
const entity = createEntity(EntityType.PLAYER, x, y, sprite);

// 3. Im Renderer wird blit() aufgerufen:
blit(framebuffer, entity.sprite, x, y);
```

---

## Asset-Erstellung

### Option 1: Programmierte Sprites (aktuell)

Aktuell werden alle Sprites programmatisch erstellt. Beispiel aus `sprites.ts`:

```typescript
export function createPlayerSprite(): Sprite {
  const w = 32;
  const h = 24;
  const px = new Uint8Array(w * h);
  
  // Pixel für Pixel zeichnen
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      
      // Körper
      if (x >= 8 && x < 24 && y >= 8 && y < 20) {
        px[idx] = 7; // Grau
      }
      // Transparent
      else {
        px[idx] = 0;
      }
    }
  }
  
  return { w, h, px };
}
```

**Vorteile:**
- Keine externen Dateien nötig
- Einfach zu ändern
- Keine Ladezeiten

**Nachteile:**
- Schwer zu visualisieren
- Umständlich für komplexe Designs

### Option 2: Sprite-Sheet aus Bilddatei ✅ IMPLEMENTIERT!

**✅ Der Sprite Sheet Loader ist bereits implementiert in `src/assets/sprite-loader.ts`!**

**Empfohlener Workflow:**

1. **Erstelle ein Sprite-Sheet** (PNG, 8-bit indexed color)
   - Verwende Bildbearbeitungssoftware (Aseprite, Piskel, GIMP)
   - Stelle sicher, dass das Bild nur die 16 VGA-Farben verwendet
   - Exportiere als PNG mit indizierter Farbpalette
   - **Siehe `SPRITE_SHEET_GUIDE.md` für detaillierte Anleitung!**

2. **Lade das Sprite-Sheet im Code:**
```typescript
import { loadSpriteSheet } from "./assets/sprite-loader";

// Einzelnes Sprite
const playerSprite = await loadSprite("assets/player.png");

// Sprite Sheet (Animation)
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

3. **Verwende mit Animationssystem:**
```typescript
import { createAnimationState, updateAnimation } from "../engine/render/animation";

const animState = createAnimationState(explosionSprite, 100, false);
const currentSprite = updateAnimation(animState, dt);
```

**Siehe `SPRITE_SHEET_BEISPIEL.md` für vollständige Code-Beispiele!**

### Option 3: ASCII-Art → Sprite Converter

Für schnelles Prototyping kannst du auch ASCII-Art verwenden:

```typescript
function createSpriteFromASCII(
  ascii: string[],
  colorMap: { [char: string]: number }
): Sprite {
  const h = ascii.length;
  const w = ascii[0].length;
  const px = new Uint8Array(w * h);
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const char = ascii[y][x];
      px[y * w + x] = colorMap[char] || 0;
    }
  }
  
  return { w, h, px };
}

// Beispiel:
const playerASCII = [
  "     #########     ",
  "    #         #    ",
  "   #   #####   #   ",
  "  #   #     #   #  ",
  " #   #   R   #   # ",
  "###################",
];

const playerSprite = createSpriteFromASCII(playerASCII, {
  ' ': 0,   // Transparent
  '#': 7,   // Grau
  'R': 12,  // Rot
});
```

---

## Rendering-Pipeline im Detail

### 1. Frame-Start

```typescript
// Framebuffer löschen
renderer.clear(2); // Mit Dunkelblau füllen
```

### 2. Hintergrund zeichnen

```typescript
// Himmel (obere 66 Pixel)
for (let y = 0; y < SEA_Y; y++) {
  for (let x = 0; x < W; x++) {
    fb[y * W + x] = 2; // Dunkelblau
  }
}

// Meer (untere 134 Pixel)
// Mit Wellenmuster aus createSeaPattern()
```

### 3. Entities rendern

```typescript
// Entities nach Typ sortieren (Layering)
const sortedEntities = [...entities].sort(/* ... */);

// Jedes Entity blitten
for (const entity of sortedEntities) {
  const x = Math.floor(entity.x + shakeX - entity.sprite.w / 2);
  const y = Math.floor(entity.y + shakeY - entity.sprite.h / 2);
  blit(fb, entity.sprite, x, y);
}
```

### 4. HUD & Effekte

```typescript
renderHUD(renderer, hp, maxHp, power, score, heat);
// Laser-Targets, Explosionen, etc.
```

### 5. Present

```typescript
renderer.present(); // Konvertiert Framebuffer → Canvas
```

---

## Workflow für neue Assets

### Schritt 1: Design erstellen

1. **Wähle Größe:** Beachte die 320x200 Auflösung
   - Player: ~32x24
   - Kleine Feinde: ~12x16
   - Große Feinde: ~28x36
   - Projektile: ~4x4

2. **Wähle Farben:** Verwende nur die 16 VGA-Farben
   - Stelle sicher, dass dein Design mit der Palette funktioniert

3. **Erstelle das Asset:**
   - Option A: Pixel-Editor (Aseprite, Piskel)
   - Option B: Programmierte Funktion
   - Option C: ASCII-Art → Converter

### Schritt 2: Implementierung

1. **Neue Funktion in `sprites.ts`:**

```typescript
export function createMyNewSprite(): Sprite {
  const w = 24;
  const h = 24;
  const px = new Uint8Array(w * h);
  
  // Hier dein Sprite-Code
  
  return { w, h, px };
}
```

2. **Im Entity-System verwenden:**

```typescript
// In enemy.ts oder player.ts
const sprite = createMyNewSprite();
const entity = createEntity(EntityType.MY_TYPE, x, y, sprite);
```

### Schritt 3: Testen

1. Starte das Spiel
2. Überprüfe, ob das Sprite korrekt gerendert wird
3. Überprüfe Transparenz (Pixel mit Index 0)
4. Überprüfe Größe und Positionierung

---

## Optimierungen & Best Practices

### 1. Sprite-Größen
- **Kleine Sprites:** Weniger Speicher, schnelleres Blitting
- **Große Sprites:** Mehr Detail, aber langsamer
- **Empfehlung:** Player ~32x32, Feinde 16-36 Pixel

### 2. Transparenz
- Verwende Index 0 für transparente Pixel
- `blit()` überspringt automatisch Pixel mit Index 0

### 3. Layering
- Entities werden nach Typ sortiert (siehe `GameRenderer`)
- Explosionen oben, Projektile mittig, Schiffe unten

### 4. Performance
- Framebuffer ist nur 320x200 = 64.000 Pixel
- Blitting ist sehr schnell (direkte Array-Zugriffe)
- Keine GPU-Beschleunigung nötig

---

## Empfohlene Tools für Asset-Erstellung

1. **Aseprite** (kostenpflichtig, aber sehr gut)
   - Pixel-Editor speziell für Sprites
   - Animationen, Paletten, Export

2. **Piskel** (kostenlos, online)
   - Browser-basiert
   - Einfach zu bedienen

3. **GIMP** (kostenlos)
   - Kann indizierte Farbpaletten erstellen
   - Komplexer, aber mächtig

4. **Lospec Pixel Editor** (kostenlos, online)
   - Einfach, browser-basiert

---

## Animationssystem

**✅ IMPLEMENTIERT!** Das Spiel hat jetzt ein vollständiges Animationssystem:

### Komponenten

1. **AnimatedSprite** (`src/engine/render/animation.ts`)
   - Container für mehrere Sprite-Frames
   - Verwaltet Frame-Liste und Metadaten

2. **AnimationState**
   - Verwaltet aktuellen Frame
   - Frame-Timing (frameDuration, frameTime)
   - Loop-Unterstützung
   - Finished-Status

3. **Funktionen**
   - `createAnimationState()`: Erstellt neuen Animation State
   - `updateAnimation()`: Aktualisiert Animation basierend auf dt
   - `resetAnimation()`: Setzt Animation zurück

### Verwendung

```typescript
// Sprite Sheet laden
const animatedSprite = await loadSpriteSheet("assets/explosion.png", 20, 20, {
  framesPerRow: 4,
  frameCount: 4
});

// Animation State erstellen
const animState = createAnimationState(animatedSprite, 100, false);

// In Update-Loop
const currentSprite = updateAnimation(animState, dt);
```

Siehe `SPRITE_SHEET_BEISPIEL.md` für detaillierte Beispiele!

---

## Sprite Sheet Loader

**✅ IMPLEMENTIERT!** Der Sprite Sheet Loader ermöglicht das Laden von PNG-Dateien:

### Funktionen

1. **loadSpriteSheet()**: Lädt ein komplettes Sprite Sheet
   - Unterstützt Multi-Row Layouts
   - Optionale Abstände zwischen Frames
   - Automatische Palette-Konvertierung

2. **loadSprite()**: Lädt ein einzelnes Sprite
   - Für statische Sprites ohne Animation

3. **loadImage()**: Lädt ein Bild als ImageData
   - Low-Level Funktion

### Sprite Sheet Format

- **PNG-Datei** mit mehreren Frames in einem Raster
- **Alle Frames müssen gleiche Größe haben**
- **Nur VGA-Farben verwenden** (16 Farben)
- **Transparenz:** Alpha < 128 wird transparent

Siehe `SPRITE_SHEET_GUIDE.md` für detaillierte Anleitung zum Erstellen von Sprite Sheets!

---

## Nächste Schritte

1. **Erstelle Sprite Sheets** für Player und Feinde (siehe Guide)
2. **Implementiere Animationen** in Entities (siehe Beispiele)
3. **Verbessere Hintergrund** (detaillierteres Himmel/Meer-Muster)
4. **UI-Sprites** (Buttons, Icons für HUD)

Möchtest du, dass ich dir bei der Implementierung eines bestimmten Asset-Systems helfe?

