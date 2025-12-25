# Bildgenerierung: Sprite Sheets mit KI erstellen

Mit modernen Bildgenerierungs-KIs (Gemini, DALL-E, Midjourney, Stable Diffusion, etc.) kannst du **direkt PNG-Sprite-Sheets** generieren!

**✅ Direkt PNG-Bilder** - keine Konvertierung nötig!  
**⚠️ Aber:** Benötigt sehr präzise Prompts für korrekte Pixelgrößen und Farben

---

## Prompt-Vorlage für Bildgenerierung

### Basis-Template

```
Erstelle ein Pixel-Art Sprite Sheet für ein [ENTITY-NAME] in einem Retro-Videospiel-Stil.

Technische Anforderungen:
- Sprite Sheet Format: [FRAME_COUNT] Frames horizontal nebeneinander
- Jeder Frame: [FRAME_WIDTH]x[FRAME_HEIGHT] Pixel
- Gesamt-Größe: [TOTAL_WIDTH]x[TOTAL_HEIGHT] Pixel
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära
- Farbpalette: Nur 16 Farben (VGA-Palette):
  - Schwarz, Dunkelblau, Blau, Dunkelgrün, Grün
  - Dunkelgrau, Grau, Hellgrau, Weiß
  - Braun, Orange, Rot, Magenta, Gelb, Cyan
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Transparente Bereiche sollten schwarz oder durchsichtig sein

Beschreibung des Sprites:
[BESCHREIBUNG]

Animation:
- Frame 0: [BESCHREIBUNG FRAME 0]
- Frame 1: [BESCHREIBUNG FRAME 1]
- [Weitere Frames...]

Layout: Alle [FRAME_COUNT] Frames nebeneinander in einer horizontalen Reihe.
Jeder Frame ist genau [FRAME_WIDTH]x[FRAME_HEIGHT] Pixel groß.
Kein Abstand zwischen den Frames.
```

---

## Beispiel-Prompts

### Explosion (4 Frames, 20x20)

```
Erstelle ein Pixel-Art Sprite Sheet für eine Explosion-Animation in einem Retro-Videospiel-Stil.

Technische Anforderungen:
- Sprite Sheet Format: 4 Frames horizontal nebeneinander
- Jeder Frame: 20x20 Pixel
- Gesamt-Größe: 80x20 Pixel
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära (1980er)
- Farbpalette: Nur 16 Farben - Gelb, Rot, Orange, Schwarz
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Schwarze Bereiche sind transparent

Beschreibung:
Eine Explosion-Animation mit 4 Frames, die eine wachsende Explosion zeigen.

Animation:
- Frame 0: Kleine Explosion (Radius ~4 Pixel), Gelb im Zentrum, etwas Rot außen
- Frame 1: Größere Explosion (Radius ~6 Pixel), mehr Rot, etwas Orange am Rand
- Frame 2: Noch größere Explosion (Radius ~8 Pixel), Orange/Gelb außen, Rot innen
- Frame 3: Größte Explosion (Radius ~10 Pixel), Orange außen, Gelb/Rot im Zentrum

Layout: Alle 4 Frames nebeneinander in einer horizontalen Reihe.
Jeder Frame ist genau 20x20 Pixel groß.
Kein Abstand zwischen den Frames.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

### Player-Battleship (2 Frames, 32x24)

```
Erstelle ein Pixel-Art Sprite Sheet für ein Battleship in einem Retro-Shooter-Spiel-Stil.

Technische Anforderungen:
- Sprite Sheet Format: 2 Frames horizontal nebeneinander
- Jeder Frame: 32x24 Pixel
- Gesamt-Größe: 64x24 Pixel
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära
- Farbpalette: Grau, Hellgrau, Weiß, Rot, Schwarz (nur VGA-Farben)
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten

Beschreibung:
Ein Militär-Battleship von der Seite gesehen.

Animation:
- Frame 0: Standard-Schiff (Grauer Rumpf, weiße Umrisse, roter Akzent, Kanone oben)
- Frame 1: Gleiches Schiff, leicht nach rechts geneigt (leicht verschoben für Bewegungseffekt)

Layout: Beide Frames nebeneinander in einer horizontalen Reihe.
Jeder Frame ist genau 32x24 Pixel groß.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

### Enemy-Drone (2 Frames, 12x12)

```
Erstelle ein Pixel-Art Sprite Sheet für eine feindliche Drohne in einem Retro-Videospiel-Stil.

Technische Anforderungen:
- Sprite Sheet Format: 2 Frames horizontal nebeneinander
- Jeder Frame: 12x12 Pixel
- Gesamt-Größe: 24x12 Pixel
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära
- Farbpalette: Rot, Weiß, Schwarz (nur VGA-Farben)
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten

Beschreibung:
Eine kleine feindliche Drohne, die rotiert.

Animation:
- Frame 0: Roter Kreis mit weißer Umrandung, Zentrum schwarz
- Frame 1: Gleicher Kreis, um 45 Grad gedreht (Diamond-Form)

Layout: Beide Frames nebeneinander in einer horizontalen Reihe.
Jeder Frame ist genau 12x12 Pixel groß.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

---

## Wichtige Hinweise für Bildgenerierung

### 1. Sehr spezifisch sein

❌ **Schlecht:** "Erstelle ein Explosions-Sprite"  
✅ **Gut:** "Erstelle ein Pixel-Art Sprite Sheet: 4 Frames, je 20x20 Pixel, horizontal nebeneinander, Gesamt 80x20 Pixel"

### 2. Pixel-Art-Stil betonen

Wichtige Keywords:
- "Pixel-Art"
- "Retro-Videospiel"
- "16-bit"
- "VGA-Ära"
- "Perfekt pixelierte Kanten"
- "Keine Anti-Aliasing"
- "Flache Farben"
- "Scharfe Pixel-Kanten"

### 3. Farbpalette einschränken

Erwähne explizit:
- "Nur 16 Farben"
- "VGA-Palette"
- Liste die spezifischen Farben, die verwendet werden sollen

### 4. Layout genau beschreiben

- "Horizontal nebeneinander"
- "Kein Abstand zwischen Frames"
- "Gesamt-Größe: [WIDTH]x[HEIGHT] Pixel"
- "Jeder Frame: [W]x[H] Pixel"

### 5. Nachbearbeitung oft nötig

Auch mit KI generierte Sprite Sheets benötigen oft:
- ✅ Größe anpassen (auf exakte Pixel-Maße)
- ✅ Farben korrigieren (auf VGA-Palette angleichen)
- ✅ Transparenz hinzufügen
- ✅ Pixel perfekt machen (mit Pixel-Editor wie Aseprite)

---

## Nachbearbeitung

### Schritt 1: Größe prüfen/anpassen

```bash
# Mit ImageMagick
magick sprite.png -resize 80x20! sprite_fixed.png

# Oder in GIMP/Aseprite
# Öffne Bild → Bild → Skalieren → 80x20 Pixel
```

### Schritt 2: Farbpalette anpassen

1. Öffne in **GIMP** oder **Aseprite**
2. Konvertiere zu **indizierter Palette**
3. Verwende die **VGA-Palette** (16 Farben)
4. Oder manuell: Ersetze Farben, die nicht in der Palette sind

### Schritt 3: Transparenz setzen

- In GIMP: Farben → Farben zu Transparenz → Schwarz wählen
- In Aseprite: Schwarz → Transparenz konvertieren

### Schritt 4: Pixel perfekt machen

- Öffne in **Aseprite** (bestes Tool für Pixel-Art)
- Vergrößere auf 1600% oder mehr
- Korrigiere Pixel für Pixel
- Stelle sicher, dass alle Frames exakt die richtige Größe haben

---

## KI-spezifische Tipps

### Gemini (Google)

```
Erstelle ein Pixel-Art Sprite Sheet im Stil von Retro-Videospielen (1980er VGA-Ära).
Sehr präzise: 4 Frames à 20x20 Pixel, horizontal nebeneinander, Gesamt 80x20 Pixel.
Verwende nur flache Farben (Gelb, Rot, Orange), keine Schattierung.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

### DALL-E / ChatGPT

```
Pixel art sprite sheet for a retro video game explosion animation.
Technical specs: 4 frames, 20x20 pixels each, total 80x20 pixels, horizontal layout.
Style: 16-bit pixel art, VGA era (1980s), flat colors only (yellow, red, orange).
Sharp pixel edges, no anti-aliasing, no gradients.
```

### Midjourney

```
Pixel art explosion sprite sheet --ar 4:1 --style raw --v 6
4 frames, 20x20 pixels each, horizontal layout
Retro video game, VGA era, 16-bit style
Flat colors: yellow, red, orange
Sharp pixel edges, no anti-aliasing
```

### Stable Diffusion

```
pixel art, sprite sheet, explosion animation, 4 frames horizontal
20x20 pixels per frame, 80x20 total
retro video game style, VGA era, 16-bit
flat colors, yellow red orange, sharp pixels
no anti-aliasing, no gradients
```

---

## Kombinierter Workflow

### Option 1: KI generieren → Nachbearbeiten

1. **KI generieren** (Gemini, DALL-E, etc.)
2. **Größe anpassen** auf exakte Pixel-Maße
3. **Palette anpassen** auf VGA (16 Farben)
4. **Transparenz setzen**
5. **Feintuning** in Aseprite

### Option 2: KI generieren → Code generieren lassen

1. **KI generiert Sprite Sheet** (als Referenz)
2. **Frage KI nach TypeScript-Code**, der das Sprite Sheet nachbildet
3. **Nutze programmatischen Code** (funktioniert direkt, perfekte Pixel)

---

## Beispiel-Workflow mit Gemini

### Schritt 1: Prompt

```
Erstelle ein Pixel-Art Sprite Sheet für eine Explosion-Animation:

- 4 Frames, je 20x20 Pixel, horizontal nebeneinander
- Gesamt: 80x20 Pixel
- Stil: Retro-Videospiel, VGA-Ära, 16-bit
- Farben: Gelb (#FFFF00), Rot (#FF0000), Orange (#FF8000)
- Flache Farben, keine Schattierung, scharfe Pixel-Kanten
- Frame 0: Kleine Explosion (Gelb innen, Rot außen)
- Frame 1: Größer (mehr Rot, etwas Orange)
- Frame 2: Noch größer (Orange außen, Gelb/Rot innen)
- Frame 3: Größte Explosion (Orange außen, Gelb im Zentrum)
```

### Schritt 2: Nachbearbeitung

1. Download des generierten Bildes
2. Öffne in **Aseprite**
3. Größe prüfen: Sollte 80x20 sein
4. Palette: Konvertiere zu VGA-16-Farben
5. Transparenz: Setze Schwarz auf transparent
6. Export: PNG

### Schritt 3: Verwenden

```typescript
const explosionSprite = await loadSpriteSheet(
  "assets/explosion.png",
  20, 20,
  { framesPerRow: 4, frameCount: 4 }
);
```

---

## Vergleich: SVG vs. Bildgenerierung

| Methode | Vorteile | Nachteile |
|---------|----------|-----------|
| **SVG-Code (ChatGPT)** | Präzise, editierbar | Konvertierung nötig |
| **Bildgenerierung (Gemini)** | Direkt PNG | Oft Nachbearbeitung nötig |
| **TypeScript-Code** | Funktioniert direkt | Weniger visuell |

**Empfehlung:** Probiere beide aus und wähle, was für dich am besten funktioniert!

---

Viel Erfolg mit der Bildgenerierung! 🎨✨

