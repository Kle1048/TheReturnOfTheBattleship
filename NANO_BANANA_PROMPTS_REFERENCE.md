# Nano Banana Prompts mit Referenzbildern

Diese Prompts sind für die Verwendung **mit Referenzbildern** optimiert. Du lädst ein Bild hoch und die KI erstellt basierend darauf ein Pixel-Art Sprite.

**Workflow:** Referenzbild hochladen → Prompt verwenden → Pixel-Art Sprite generieren

**⚠️ WICHTIG - Exakte Größe:**
Alle Prompts fordern explizit die **exakte Pixel-Größe** an. Das generierte Bild MUSS genau die angegebene Größe haben (z.B. 64x32 Pixel für den Player). Falls das generierte Bild nicht die richtige Größe hat, skaliere es nachträglich in einem Bildbearbeitungsprogramm (Aseprite, GIMP) auf die exakte Größe.

---

## VGA-Palette Referenz

**WICHTIG:** Nur diese 16 Farben verwenden:
- 0: Transparent (Schwarz = transparent im PNG)
- 1: Schwarz #000000
- 2: Dunkelblau #000080
- 3: Blau #0000FF
- 4: Dunkelgrün #008000
- 5: Grün #00FF00
- 6: Dunkelgrau #404040
- 7: Grau #808080
- 8: Hellgrau #C0C0C0
- 9: Weiß #FFFFFF
- 10: Braun #804000
- 11: Orange #FF8000
- 12: Rot #FF0000
- 13: Magenta #FF00FF
- 14: Gelb #FFFF00
- 15: Cyan #00FFFF

---

## Allgemeiner Template für Referenzbilder

**Struktur:**
1. Referenzbild hochladen
2. Prompt verwenden, der:
   - Das Referenzbild erwähnt
   - Pixel-Art Konvertierung anweist
   - Technische Spezifikationen gibt
   - Stil-Anforderungen klarstellt

**Basis-Template:**

```
[REFERENZBILD HOCHLADEN]

Erstelle ein Pixel-Art Sprite basierend auf diesem Referenzbild.

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau [WIDTH]x[HEIGHT] Pixel groß sein
- Keine Skalierung erlaubt - das generierte Bild muss diese exakte Dimension haben
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära (1980er)
- Farbpalette: Nur VGA-16-Farben (siehe unten)
- Konvertierung: Vereinfache das Referenzbild zu Pixel-Art
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Schwarze Bereiche sind transparent

WICHTIG:
- Erstelle KEINE Kopie des Originalbildes
- Vereinfache stark zu minimalistischer Pixel-Art
- Verwende nur die VGA-Palette (16 Farben)
- Reduziere Details auf das Wesentliche
- Behalte die Silhouette und Hauptform bei
- Seitenansicht/Ansicht: [ANWEISUNG ZUR PERSPEKTIVE]
- KRITISCH: Output-Bild muss exakt [WIDTH]x[HEIGHT] Pixel sein - keine andere Größe!

VGA-Palette (nur diese Farben):
- Schwarz #000000, Dunkelblau #000080, Blau #0000FF
- Dunkelgrün #008000, Grün #00FF00
- Dunkelgrau #404040, Grau #808080, Hellgrau #C0C0C0
- Braun #804000, Orange #FF8000, Rot #FF0000
- Magenta #FF00FF, Gelb #FFFF00, Cyan #00FFFF
- (Weiß #FFFFFF nur wenn explizit benötigt, NICHT für Umrandungen/Umrisse)

[SPEZIFISCHE BESCHREIBUNG DES SPRITES]
```

---

## 1. Player Battleship mit Referenzbild

**Dateiname:** `player.png`  
**Größe:** 64x32 Pixel  
**Referenzbild:** Battleship/Kriegsschiff (Seitenansicht)

```
[REFERENZBILD HOCHLADEN: Battleship/Kriegsschiff Seitenansicht]

Erstelle ein Pixel-Art Sprite eines Militär-Battleships basierend auf diesem Referenzbild.

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau 64x32 Pixel groß sein
- Keine Skalierung erlaubt - das generierte Bild muss exakt 64 Pixel breit und 32 Pixel hoch sein
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära (1980er)
- Farbpalette: Nur VGA-16-Farben
- Konvertierung: Vereinfache das Referenzbild stark zu Pixel-Art
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Schwarze Bereiche sind transparent

WICHTIG:
- Erstelle KEINE detaillierte Kopie, sondern vereinfachte Pixel-Art
- Seitenansicht: Schiffs schaut nach rechts
- Behalte die charakteristische Schiffs-Silhouette bei
- Reduziere Details: Nur Rumpf, Deck, Turm/Kanone
- Verwende: Grau (#808080), Hellgrau (#C0C0C0), Rot (#FF0000)
- Zentriert im Canvas
- KEINE weißen Umrandungen oder Umrisse
- KRITISCH: Output-Bild muss exakt 64x32 Pixel sein - keine andere Größe!

VGA-Palette (nur diese Farben verwenden):
Grau #808080, Hellgrau #C0C0C0, Rot #FF0000, Schwarz #000000

Das Sprite soll minimalistisch sein: Rumpf, Deck, Geschützturm, roter Akzent. KEINE weißen Umrandungen.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

---

## 2. Enemy Drone mit Referenzbild

**Dateiname:** `enemy_drone.png`  
**Größe:** 12x12 Pixel  
**Referenzbild:** Drohne/Fluggerät (Draufsicht/Oben)

```
[REFERENZBILD HOCHLADEN: Drohne/Fluggerät Draufsicht]

Erstelle ein Pixel-Art Sprite einer feindlichen Drohne basierend auf diesem Referenzbild.

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau 12x12 Pixel groß sein
- Keine Skalierung erlaubt - das generierte Bild muss exakt 12 Pixel breit und 12 Pixel hoch sein
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära
- Farbpalette: Nur VGA-16-Farben
- Konvertierung: Vereinfache stark - nur die Grundform
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Schwarze Bereiche sind transparent

WICHTIG:
- Sehr stark vereinfachen: Nur die Grundform (Kreis/Oktagon)
- Draufsicht/Oben: Drohne von oben gesehen
- Minimalistisch: Runder Körper, vielleicht Propeller/Details weglassen
- Verwende: Rot (#FF0000), Schwarz (#000000)
- Zentriert im 12x12 Canvas
- Perfekter Kreis oder einfache geometrische Form
- KEINE weißen Umrandungen oder Ringe
- KRITISCH: Output-Bild muss exakt 12x12 Pixel sein - keine andere Größe!

VGA-Palette (nur diese Farben):
Rot #FF0000, Schwarz #000000

Vereinfache zu: Roter Kreis mit schwarzem Zentrum. KEINE weißen Umrandungen oder Ringe.
Sehr minimalistisch, nur die Grundform.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

---

## 3. Enemy Jet mit Referenzbild

**Dateiname:** `enemy_jet.png`  
**Größe:** 24x16 Pixel  
**Referenzbild:** Kampfflugzeug/Jet (Seitenansicht)

```
[REFERENZBILD HOCHLADEN: Kampfflugzeug/Jet Seitenansicht]

Erstelle ein Pixel-Art Sprite eines feindlichen Kampfflugzeugs basierend auf diesem Referenzbild.

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau 24x16 Pixel groß sein
- Keine Skalierung erlaubt - das generierte Bild muss exakt 24 Pixel breit und 16 Pixel hoch sein
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära
- Farbpalette: Nur VGA-16-Farben
- Konvertierung: Vereinfache zu dreieckiger/spitzer Form
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Schwarze Bereiche sind transparent

WICHTIG:
- Seitenansicht: Flugzeug schaut nach links (Feind-Bewegung)
- Stark vereinfachen: Dreiecksförmig/spitz nach links
- Details weglassen: Keine Flügel-Details, nur Silhouette
- Verwende: Orange (#FF8000), Rot (#FF0000)
- Spitze links (1 Pixel), hinten rechts breiter
- Pyramidenförmig: Oben schmal, unten breiter
- KRITISCH: Output-Bild muss exakt 24x16 Pixel sein - keine andere Größe!

VGA-Palette (nur diese Farben):
Orange #FF8000, Rot #FF0000, Schwarz #000000

Vereinfache zu: Orangenes Dreieck, spitz nach links.
Aggressiv, schnell aussehend.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

---

## 4. Enemy Boat mit Referenzbild

**Dateiname:** `enemy_boat.png`  
**Größe:** 28x20 Pixel  
**Referenzbild:** Boot/Schiff (Seitenansicht)

```
[REFERENZBILD HOCHLADEN: Boot/Schiff Seitenansicht]

Erstelle ein Pixel-Art Sprite eines feindlichen Boots basierend auf diesem Referenzbild.

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau 28x20 Pixel groß sein
- Keine Skalierung erlaubt - das generierte Bild muss exakt 28 Pixel breit und 20 Pixel hoch sein
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära
- Farbpalette: Nur VGA-16-Farben
- Konvertierung: Vereinfache zu Boots-Silhouette
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Schwarze Bereiche sind transparent

WICHTIG:
- Seitenansicht: Boot schaut nach links (Feind-Bewegung)
- Vereinfachen: Nur Rumpf, Deck, Kabine/Aufbau
- Details reduzieren: Keine Masten, nur Grundform
- Verwende: Braun (#804000), Dunkelgrau (#404040), Grau (#808080)
- Rumpf unten, Deck in der Mitte, Kabine oben
- Bootsform: Ovaler/abgerundeter Rumpf
- KEINE weißen Umrandungen oder Umrisse
- KRITISCH: Output-Bild muss exakt 28x20 Pixel sein - keine andere Größe!

VGA-Palette (nur diese Farben):
Braun #804000, Dunkelgrau #404040, Grau #808080, Schwarz #000000

Vereinfache zu: Brauner Rumpf, dunkelgraues Deck, graue Kabine. KEINE weißen Umrandungen.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

---

## 5. Enemy Frigate mit Referenzbild

**Dateiname:** `enemy_frigate.png`  
**Größe:** 36x24 Pixel  
**Referenzbild:** Kriegsschiff/Fregatte (Seitenansicht)

```
[REFERENZBILD HOCHLADEN: Kriegsschiff/Fregatte Seitenansicht]

Erstelle ein Pixel-Art Sprite einer feindlichen Fregatte (großes Kriegsschiff) basierend auf diesem Referenzbild.

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau 36x24 Pixel groß sein
- Keine Skalierung erlaubt - das generierte Bild muss exakt 36 Pixel breit und 24 Pixel hoch sein
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära
- Farbpalette: Nur VGA-16-Farben
- Konvertierung: Vereinfache zu Kriegsschiff-Silhouette
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Schwarze Bereiche sind transparent

WICHTIG:
- Seitenansicht: Schiffs schaut nach links (Feind-Bewegung)
- Größer als normales Boot: Mehr Masse, mächtiger
- Vereinfachen: Rumpf, Deck, Geschützturm
- Verwende: Dunkelgrau (#404040), Grau (#808080), Hellgrau (#C0C0C0)
- Größerer Rumpf, größeres Deck, Geschützturm oben
- Militärischer, bedrohlicher Look
- KEINE weißen Umrandungen oder Umrisse
- KRITISCH: Output-Bild muss exakt 36x24 Pixel sein - keine andere Größe!

VGA-Palette (nur diese Farben):
Dunkelgrau #404040, Grau #808080, Hellgrau #C0C0C0, Schwarz #000000

Vereinfache zu: Großer dunkelgrauer Rumpf, graues Deck, hellgrauer Geschützturm. KEINE weißen Umrandungen.
Größer und mächtiger als das normale Boot.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

---

## 6. Player Bullet mit Referenzbild

**Dateiname:** `bullet_player.png`  
**Größe:** 4x4 Pixel  
**Referenzbild:** Projektil/Schuss (optional - kann auch ohne Referenz erstellt werden)

```
[REFERENZBILD HOCHLADEN: Projektil/Schuss - optional]

Erstelle ein Pixel-Art Sprite für eine Spieler-Projektil basierend auf diesem Referenzbild (oder erstelle ein einfaches gelbes Projektil).

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau 4x4 Pixel groß sein
- Keine Skalierung erlaubt - das generierte Bild muss exakt 4 Pixel breit und 4 Pixel hoch sein
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära
- Farbpalette: Nur VGA-16-Farben
- Konvertierung: Sehr stark vereinfachen - nur ein kleiner Punkt/Quadrat
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Schwarze Bereiche sind transparent

WICHTIG:
- Sehr klein: Nur 4x4 Pixel
- Sehr einfach: Einfaches gelbes Quadrat oder Punkt
- Verwende: Gelb (#FFFF00), optional Orange (#FF8000)
- Zentriert im Canvas
- Sehr minimalistisch - nur für Sichtbarkeit
- KRITISCH: Output-Bild muss exakt 4x4 Pixel sein - keine andere Größe!

VGA-Palette (nur diese Farben):
Gelb #FFFF00, Orange #FF8000, Schwarz #000000

Vereinfache zu: Kleines gelbes Quadrat (4x4 Pixel).
Sehr einfach, nur für hohe Sichtbarkeit im Spiel.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

---

## 7. Enemy Bullet mit Referenzbild

**Dateiname:** `bullet_enemy.png`  
**Größe:** 4x4 Pixel  
**Referenzbild:** Projektil/Schuss (optional)

```
[REFERENZBILD HOCHLADEN: Projektil/Schuss - optional]

Erstelle ein Pixel-Art Sprite für eine feindliche Projektil basierend auf diesem Referenzbild (oder erstelle ein einfaches rotes Projektil).

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau 4x4 Pixel groß sein
- Keine Skalierung erlaubt - das generierte Bild muss exakt 4 Pixel breit und 4 Pixel hoch sein
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära
- Farbpalette: Nur VGA-16-Farben
- Konvertierung: Sehr stark vereinfachen - nur ein kleiner Punkt/Quadrat
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Schwarze Bereiche sind transparent

WICHTIG:
- Sehr klein: Nur 4x4 Pixel
- Sehr einfach: Einfaches rotes Quadrat oder Punkt
- Verwende: Rot (#FF0000), optional Orange (#FF8000)
- Zentriert im Canvas
- Unterscheidet sich vom gelben Spieler-Projektil
- KRITISCH: Output-Bild muss exakt 4x4 Pixel sein - keine andere Größe!

VGA-Palette (nur diese Farben):
Rot #FF0000, Orange #FF8000, Schwarz #000000

Vereinfache zu: Kleines rotes Quadrat (4x4 Pixel).
Sehr einfach, rot für Gefahr/Feind.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

---

## 8. Explosion mit Referenzbild

**Dateiname:** `explosion.png`  
**Größe:** 20x20 Pixel  
**Referenzbild:** Explosion/Feuerball

```
[REFERENZBILD HOCHLADEN: Explosion/Feuerball]

Erstelle ein Pixel-Art Sprite einer Explosion basierend auf diesem Referenzbild.

Technische Anforderungen:
- EXAKTE GRÖSSE (KRITISCH): Das Output-Bild MUSS genau 20x20 Pixel groß sein
- Keine Skalierung erlaubt - das generierte Bild muss exakt 20 Pixel breit und 20 Pixel hoch sein
- Stil: 16-bit Pixel-Art, Retro-Videospiel, VGA-Ära
- Farbpalette: Nur VGA-16-Farben
- Konvertierung: Vereinfache zu kreisförmiger Explosion
- Keine Schattierung, flache Farben, scharfe Pixel-Kanten
- Transparenz: Schwarze Bereiche sind transparent

WICHTIG:
- Kreisförmig: Explosion zentriert im 20x20 Canvas
- Vereinfachen: Gelbes Zentrum, rote Mitte, orangener Rand
- Details reduzieren: Keine komplexen Flammen, nur Farbringe
- Verwende: Gelb (#FFFF00), Rot (#FF0000), Orange (#FF8000)
- Unregelmäßige Form: Nicht perfekt rund, etwas explosiv
- Mittelgroße Explosion: Radius ~8-9 Pixel
- KRITISCH: Output-Bild muss exakt 20x20 Pixel sein - keine andere Größe!

VGA-Palette (nur diese Farben):
Gelb #FFFF00, Rot #FF0000, Orange #FF8000, Schwarz #000000

Vereinfache zu: Gelbes Zentrum, rote Mitte, orangener Rand.
Kreisförmig, aber etwas unregelmäßig für explosiven Look.
Perfekt pixelierte, scharfe Kanten, keine Anti-Aliasing.
```

---

## Tipps für Referenzbilder

### Was macht gute Referenzbilder aus?

1. **Klarer Fokus:**
   - Ein einzelnes Objekt, gut sichtbar
   - Kein komplexer Hintergrund
   - Gute Beleuchtung/Kontrast

2. **Richtige Perspektive:**
   - **Seitenansicht** für Schiffe/Flugzeuge
   - **Draufsicht** für Drohnen
   - **Isometrisch** kann auch funktionieren

3. **Einfache Struktur:**
   - Weniger Details = besseres Ergebnis
   - Klare Silhouette
   - Gute Formdefinition

### Wo findet man Referenzbilder?

- **Google Images:** "battleship side view", "drone top view"
- **Unsplash/Pexels:** Kostenlose Stock-Fotos
- **Wikipedia:** Oft gute technische Zeichnungen
- **Skizzen:** Eigene Zeichnungen hochladen

### Was die KI gut kann:

✅ Silhouetten erkennen  
✅ Grundformen extrahieren  
✅ Farbpalette reduzieren  
✅ Vereinfachen zu Pixel-Art  

### Was manuell anpassen könnte sein:

⚠️ Exakte Pixel-Größe  
⚠️ Perfekte VGA-Palette  
⚠️ Pixel-perfekte Ausrichtung  
⚠️ Details entfernen, die nicht ins Spiel passen  

---

## Workflow mit Referenzbildern

### Schritt 1: Referenzbild vorbereiten

1. Finde/skizziere ein gutes Referenzbild
2. Stelle sicher, dass die Perspektive passt
3. Optional: Hintergrund entfernen (für bessere Ergebnisse)

### Schritt 2: Prompt verwenden

1. **Referenzbild in Gemini/nano banana hochladen**
2. **Passenden Prompt aus dieser Datei kopieren**
3. **Anpassen falls nötig** (Größe, Farben, etc.)
4. **Generieren lassen**

### Schritt 3: Nachbearbeitung

1. **Größe prüfen/anpassen** auf exakte Pixel-Maße
2. **Palette anpassen** auf VGA (16 Farben)
3. **Transparenz setzen**
4. **Feintuning** in Aseprite (Pixel für Pixel)

### Schritt 4: Iteration

- Wenn das Ergebnis nicht passt:
  - Anderes Referenzbild versuchen
  - Prompt anpassen (z.B. "noch mehr vereinfachen")
  - Manuell in Aseprite nacharbeiten

---

## Beispiel-Workflow

### Player Battleship:

1. **Referenzbild finden:** Google "battleship side view" → Bild auswählen
2. **In Gemini hochladen:** Referenzbild hochladen
3. **Prompt verwenden:** Player Battleship Prompt aus dieser Datei
4. **Generieren lassen**
5. **Prüfen:** Ist es 64x32? Passt die Palette?
6. **Nachbearbeiten:** Größe anpassen, Palette korrigieren in Aseprite
7. **Fertig!**

---

## Kombination: Referenz + Beschreibung

Du kannst auch **beides kombinieren**:

```
[REFERENZBILD HOCHLADEN]

Erstelle ein Pixel-Art Sprite basierend auf diesem Referenzbild, aber:

- Vereinfache stark zu Pixel-Art
- Ändere die Farbe zu Orange (#FF8000) statt der Originalfarbe
- Seitenansicht: Schaut nach links (Feind-Bewegung)
- Größe: Exakt 24x16 Pixel
- Stil: 16-bit Retro-Videospiel, VGA-Ära

[Rest des Prompts...]
```

Das gibt dir mehr Kontrolle über das Endergebnis!

---

Viel Erfolg mit Referenzbildern! 🎨✨

