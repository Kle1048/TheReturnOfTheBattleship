# Hintergrund: Meer erstellen

## Übersicht

Das Meer-Hintergrundbild ist jetzt **animiert**! Es verwendet ein Sprite Sheet mit 4 Frames, die automatisch getiled und animiert werden.

**Sprite Sheet Format:** 128x32 Pixel (4 Frames à 32x32 Pixel, horizontal nebeneinander)

## Meer-Grafik erstellen

### Option 1: Kleines Tile (EMPFOHLEN! ✅)

Erstelle ein **kleines Tile-Muster**, das sich nahtlos wiederholt (seamless tiling).

**Größe:** 32x32 Pixel (oder 64x32, 64x64, etc.)

**Vorteile:** 
- ✅ **Viel einfacher zu erstellen** (nur 32x32 statt 320x134!)
- ✅ Geringere Dateigröße
- ✅ Wird automatisch horizontal UND vertikal getiled
- ✅ Einfacher zu bearbeiten/ändern

**Empfehlung:** 32x32 Pixel – perfekte Größe für Pixel-Art!

### Option 2: Als vollständiges Hintergrundbild

Erstelle ein vollständiges Meer-Bild für den gesamten Bereich.

**Größe:** Exakt 320x134 Pixel (SEA_HEIGHT)

**Vorteil:**
- Mehr Details möglich
- Kein Tiling nötig (aber viel mehr Arbeit)

---

## Nano Banana Prompt für Meer-Tile

### Meer-Tile (32x32 Pixel, seamless tiling - EMPFOHLEN!)

```
[OPTIONAL: REFERENZBILD HOCHLADEN - Ozean/Meer Animation]

Erstelle ein Pixel-Art Sprite Sheet für einen animierten Meer-Hintergrund in einem Retro-Videospiel-Stil.

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau 128x32 Pixel groß sein
- Sprite Sheet Format: 4 Frames horizontal nebeneinander
- Jeder Frame: 32x32 Pixel
- Keine Skalierung erlaubt - das generierte Bild muss exakt 128 Pixel breit und 32 Pixel hoch sein
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära (1980er)
- Farbpalette: Nur VGA-16-Farben
- Konvertierung: Vereinfache zu Meer-Textur
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: KEINE Transparenz - Meer sollte vollständig gefüllt sein

WICHTIG:
- SEAMLESS TILING: Jedes Frame muss sich in ALLE Richtungen nahtlos wiederholen
  - Links und rechts passen zusammen (horizontal)
  - Oben und unten passen zusammen (vertikal)
  - Alle 4 Ecken passen zusammen
- ANIMATION: 4 Frames zeigen eine Wellen-Animation
  - Frame 0: Startposition der Wellen
  - Frame 1: Wellen bewegen sich leicht
  - Frame 2: Wellen bewegen sich weiter
  - Frame 3: Wellen bewegen sich am meisten
- Horizontales Wellenmuster (Wellen verlaufen horizontal)
- Verwende: Dunkelblau (#000080), Blau (#0000FF), optional Cyan (#00FFFF) für Schaum
- KEINE weißen Umrandungen
- KEINE Transparenz

VGA-Palette (nur diese Farben):
Dunkelblau #000080, Blau #0000FF, Cyan #00FFFF

Beschreibung:
Ein Sprite Sheet mit 4 Frames für animierte Wellen:
- Frame 0 (links): Wellen in Startposition
- Frame 1: Wellen bewegen sich leicht nach rechts
- Frame 2: Wellen bewegen sich weiter nach rechts
- Frame 3 (rechts): Wellen bewegen sich am meisten nach rechts
Jedes Frame (32x32 Pixel) muss sich nahtlos wiederholen (seamless tiling).
Die 4 Frames zusammen ergeben eine flüssige Wellen-Animation.

Layout: Alle 4 Frames horizontal nebeneinander (Frame 0, Frame 1, Frame 2, Frame 3).
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
SEAMLESS TILING - alle 4 Seiten jedes Frames müssen zusammenpassen für nahtlose Wiederholung.
```

### Vollständiges Meer-Bild (320x134 Pixel)

```
[OPTIONAL: REFERENZBILD HOCHLADEN - Ozean/Meer]

Erstelle ein Pixel-Art Hintergrundbild für ein Meer in einem Retro-Videospiel-Stil.

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau 320x134 Pixel groß sein
- Keine Skalierung erlaubt - das generierte Bild muss exakt 320 Pixel breit und 134 Pixel hoch sein
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära (1980er)
- Farbpalette: Nur VGA-16-Farben
- Konvertierung: Vereinfache zu Meer-Textur
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten

WICHTIG:
- Horizontales Wellenmuster
- Verwende: Dunkelblau (#000080), Blau (#0000FF), optional Cyan (#00FFFF) für Schaum
- Wellen sollten horizontal verlaufen
- Oben dunkler, unten kann heller sein (oder umgekehrt)
- Optional: Weiße/cyan Wellenkämme für mehr Detail
- KEINE weißen Umrandungen

VGA-Palette (nur diese Farben):
Dunkelblau #000080, Blau #0000FF, Cyan #00FFFF, Schwarz #000000

Beschreibung:
Ein Meer-Hintergrund mit horizontalen Wellen. Oben (Horizont) dunkelblau, nach unten heller werdend.
Wellen sollten horizontal verlaufen, können aber auch leicht diagonal sein.
Optional: Weiße/cyan Wellenkämme für mehr Detail.

Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

---

## Integration ins Spiel

**✅ Bereits implementiert!** Das System unterstützt animiertes Sprite Sheet mit automatischem Tiling.

### Schritt 1: Sprite Sheet erstellen

1. Erstelle Meer-Sprite-Sheet mit dem Prompt oben (4 Frames, 32x32 Pixel pro Frame)
2. Speichere als `assets/sea.png` (128x32 Pixel)
3. Fertig! Das System lädt es automatisch und animiert es

### Wie es funktioniert

1. **Sprite Sheet wird geladen** (`loadSpriteSheet` mit 4 Frames)
2. **Animation wird erstellt** (200ms pro Frame, looped)
3. **Aktuelles Frame wird getiled** über den gesamten Meer-Bereich (320x134 Pixel)
4. **Animation wird jeden Frame aktualisiert**

Die Animation läuft kontinuierlich und das aktuelle Frame wird automatisch horizontal und vertikal wiederholt!

```
┌────┐┌────┐┌────┐┌────┐ ... (10x horizontal)
│32x ││32x ││32x ││32x │
│32  ││32  ││32  ││32  │
├────┤├────┤├────┤├────┤
│32x ││32x ││32x ││32x │ ... (10x horizontal)
│32  ││32  ││32  ││32  │
├────┤├────┤├────┤├────┤
... (ca. 4x vertikal für 134 Pixel)
```

---

## Tiling-Hinweise

### Wie funktioniert Tiling?

Das System verwendet den **Modulo-Operator** (`%`) für automatisches Tiling:

```typescript
// Wenn dein Tile 32x32 Pixel ist:
const srcX = x % 32;  // Wiederholt 0-31, 0-31, 0-31...
const srcY = y % 32;  // Wiederholt 0-31, 0-31, 0-31...
```

**Beispiel mit 32x32 Tile:**
- Bei x=0: srcX = 0 % 32 = 0
- Bei x=32: srcX = 32 % 32 = 0 (startet wieder)
- Bei x=64: srcX = 64 % 32 = 0 (startet wieder)

So wird das Tile automatisch wiederholt!

### Empfohlene Tile-Größen

| Größe | Beschreibung |
|-------|--------------|
| **32x32** | ✅ **EMPFOHLEN** - Perfekt für Pixel-Art, einfach zu erstellen |
| 64x32 | Gut für horizontale Wellen (breiteres Tile) |
| 64x64 | Mehr Details möglich, aber größer zu erstellen |
| 16x16 | Sehr klein, weniger Details, aber sehr einfach |

**Empfehlung:** 32x32 Pixel ist die beste Balance!

---

## Seamless Tiling Tipps

### Für nahtloses Tiling:

1. **Linker Rand = Rechter Rand**
   - Die Pixel in Spalte 0 müssen mit Spalte 31 zusammenpassen
   - Wenn du das Tile nebeneinander legst, solltest du keine Naht sehen

2. **Oberer Rand = Unterer Rand**
   - Die Pixel in Zeile 0 müssen mit Zeile 31 zusammenpassen
   - Wenn du das Tile übereinander legst, solltest du keine Naht sehen

3. **Ecken beachten**
   - Die 4 Ecken müssen auch zusammenpassen

### Wie testen?

1. Erstelle dein 32x32 Tile
2. Kopiere es 4x (2x2 Grid)
3. Prüfe, ob die Nähte sichtbar sind
4. Wenn keine Nähte sichtbar = perfekt seamless! ✅

---

Viel Erfolg! 🌊

