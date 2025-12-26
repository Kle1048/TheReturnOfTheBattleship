# Performance-Analyse: Engine-Optimierung

## Identifizierte Performance-Probleme

### 🔴 Kritisch (Großer Performance-Impact)

#### 1. Sky-Hintergrund Zeichnen (renderer.ts:79-84)
**Problem:** Jedes Pixel wird einzeln in einer verschachtelten Schleife gezeichnet
- **Pro Frame:** 66 × 320 = 21,120 Pixel-Operationen
- **Lösung:** `fillRect()` verwenden statt Pixel-für-Pixel
- **Einsparung:** ~21,000 Operationen pro Frame → 1 Funktionsaufruf

```typescript
// AKTUELL (ineffizient):
for (let y = 0; y < SEA_Y; y++) {
  for (let x = 0; x < W; x++) {
    const idx = y * W + x;
    fb[idx] = 3; // Light blue sky
  }
}

// OPTIMIERT:
fillRect(fb, 0, 0, W, SEA_Y, 3);
```

#### 2. Flash-Effekt (renderer.ts:216-239)
**Problem:** Wenn aktiv, wird der gesamte Bildschirm Pixel-für-Pixel durchlaufen
- **Pro Frame:** 320 × 200 = 64,000 Pixel-Operationen (wenn flashTime > 0)
- **Lösung:** Pattern-basiertes Rendering optimieren oder Flash-Dauer reduzieren
- **Hinweis:** Flash-Effekt ist selten aktiv, aber extrem teuer wenn aktiv

#### 3. Entity-Sorting (renderer.ts:92-114)
**Problem:** Entities werden jeden Frame neu sortiert
- **Komplexität:** O(n log n) mit n = Anzahl Entities
- **Pro Frame:** Mit 20-30 Entities = ~100-150 Vergleichsoperationen
- **Lösung:** Nur sortieren wenn Entities-Array sich geändert hat, oder Insertion-Sort für fast-sorted arrays

### 🟡 Mittel (Mittlerer Performance-Impact)

#### 4. Sea Background Fallback (renderer.ts:255-264)
**Problem:** Nested loops für Meer-Hintergrund (Fallback-Modus)
- **Pro Frame:** 134 × 320 = 42,880 Pixel-Operationen
- **Lösung:** Direktes Array-Copy verwenden statt Pixel-für-Pixel
- **Optimierung:** `fb.set(seaPatternFallback, SEA_Y * W)` wenn möglich

#### 5. drawTiledSprite Bounds-Check (renderer.ts:302)
**Problem:** Redundante Bounds-Prüfung innerhalb der Schleife
- **Lösung:** Bounds-Check entfernen, da bereits innerhalb gültiger Grenzen iteriert wird

#### 6. Target Indicator Frames (renderer.ts:129-186)
**Problem:** Pixel-für-Pixel Zeichnen von Rahmen
- **Pro Frame:** ~200-400 Pixel-Operationen pro Target
- **Lösung:** Optional - weniger kritisch, aber könnte mit fillRect optimiert werden

### 🟢 Gering (Kleiner Performance-Impact)

#### 7. present() Konvertierung (renderer.ts:64-74)
**Problem:** Framebuffer wird jeden Frame vollständig konvertiert (Index → RGBA)
- **Pro Frame:** 64,000 Pixel-Konvertierungen
- **Hinweis:** Unvermeidbar, aber bereits gut optimiert (direkte Array-Zugriffe)
- **Mögliche Optimierung:** Nur geänderte Bereiche konvertieren (sehr komplex, vermutlich nicht lohnenswert)

## Empfohlene Optimierungen (Priorität)

### Phase 1: Einfache, sichere Optimierungen ✅ IMPLEMENTIERT
1. ✅ Sky-Hintergrund mit `fillRect()` statt Schleife - **IMPLEMENTIERT**
2. ✅ Sea Background Fallback optimieren (direktes Array-Copy) - **IMPLEMENTIERT**
3. ✅ Redundante Bounds-Checks entfernen - **IMPLEMENTIERT**

### Phase 2: Mittlere Optimierungen ✅ IMPLEMENTIERT
4. ⚠️ Entity-Sorting optimieren (nur wenn nötig sortieren) - **NICHT IMPLEMENTIERT** (zu komplex, geringer Impact)
5. ✅ Flash-Effekt optimieren (Pattern-Vorberechnung) - **IMPLEMENTIERT**

### Phase 3: Erweiterte Optimierungen (optional)
6. ⚪ Target Indicator mit fillRect optimieren
7. ⚪ Dirty-Rectangle-Rendering (nur geänderte Bereiche rendern)

## Implementierte Optimierungen ✅

### 1. Sky-Hintergrund (renderer.ts:77-79)
**Vorher:** 21,120 Pixel-Operationen pro Frame (66 × 320 nested loops)
**Nachher:** 1 Funktionsaufruf `fillRect(fb, 0, 0, W, SEA_Y, 3)`
**Gewinn:** ~21,000 Operationen eingespart pro Frame

### 2. Sea Background Fallback (renderer.ts:248-250)
**Vorher:** 42,880 Pixel-Operationen pro Frame (134 × 320 nested loops)
**Nachher:** Direktes Array-Copy `fb.set(this.seaPatternFallback, SEA_Y * W)`
**Gewinn:** ~42,800 Operationen eingespart pro Frame (nur im Fallback-Modus)

### 3. drawTiledSprite Bounds-Check (renderer.ts:288-291)
**Vorher:** Redundante Bounds-Prüfung bei jedem Pixel
**Nachher:** Bounds-Check entfernt (Funktion nur mit sicheren Parametern aufgerufen)
**Gewinn:** ~1 Bedingungsprüfung pro Pixel weniger

### 4. Flash-Effekt Optimierung (renderer.ts:210-235)
**Vorher:** Pattern-Berechnung in innerer Schleife (64,000 × Modulo-Operationen)
**Nachher:** Pattern wird einmal pro Spalte vorberechnet, dann nur angewendet
**Gewinn:** Modulo-Berechnung aus innerer Schleife entfernt (~64,000 Modulo-Operationen eingespart)

## Geschätzter Performance-Gewinn

- **Implementierte Optimierungen:** ~20-35% FPS-Verbesserung
- **Besonders wirksam bei:** Vielen Entities, während Flash-Effekt
- **Erwartete Verbesserung:** Deutlich stabilere Framerate, weniger Ruckeln

## Messungen empfohlen

Nach Optimierungen sollte gemessen werden:
- FPS mit vielen Entities (30+)
- FPS während Flash-Effekt
- FPS in ruhigen Szenen
- Memory-Usage (sollte gleich bleiben)

