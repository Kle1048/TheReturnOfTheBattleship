# Sound-Lautstärke Konfiguration

Du kannst die Lautstärke einzelner Sounds anpassen, um sie weniger oder mehr dominant zu machen.

## Schnellstart

In `src/main.ts` nach der AudioEngine-Initialisierung kannst du die Lautstärken anpassen:

```typescript
// Einzelne Lautstärke anpassen
audio.setSfxTypeVolume("explosion", 0.5);  // Explosionen leiser machen
audio.setSfxTypeVolume("gun", 0.6);        // Artillerie leiser machen

// Alle Lautstärken auf einmal anpassen
audio.setSfxVolumes({
  gun: 0.6,           // Artillerie-Schuss (Standard: 0.7)
  railShot: 0.7,      // Railgun (Standard: 0.8)
  explosion: 0.5,     // Explosionen (Standard: 0.8) - weniger dominant
  hit: 0.4,           // Treffer (Standard: 0.5)
  laser: 0.5,         // Laser (Standard: 0.6)
  missileLaunch: 0.6, // Raketen-Start (Standard: 0.7)
  promptStrike: 0.8   // Prompt Strike (Standard: 0.9)
});
```

## Verfügbare Sound-Typen

- `gun` - Artillerie-Schuss (Standard: 0.7)
- `railShot` - Railgun (Standard: 0.8)
- `explosion` - Explosionen (Standard: 0.8)
- `hit` - Treffer ohne Kill (Standard: 0.5)
- `laser` - Laser (Standard: 0.6)
- `missileLaunch` - Raketen-Start SAM/SSM (Standard: 0.7)
- `promptStrike` - Prompt Strike Ultimate (Standard: 0.9)

## Lautstärke-Werte

- **0.0** = Stumm
- **0.1-0.3** = Sehr leise
- **0.4-0.6** = Leise bis mittel
- **0.7-0.9** = Laut bis sehr laut
- **1.0** = Maximale Lautstärke

## Beispiel: Explosionen weniger dominant machen

```typescript
// In src/main.ts nach Zeile 16 (nach audio-Initialisierung)
audio.setSfxTypeVolume("explosion", 0.4);  // Explosionen deutlich leiser
```

## Beispiel: Alle Sounds ausbalancieren

```typescript
// In src/main.ts nach Zeile 16
audio.setSfxVolumes({
  gun: 0.65,          // Artillerie etwas leiser
  railShot: 0.75,     // Railgun etwas leiser
  explosion: 0.5,     // Explosionen deutlich leiser (weniger dominant)
  hit: 0.4,           // Treffer leiser
  laser: 0.55,        // Laser etwas leiser
  missileLaunch: 0.65, // Raketen etwas leiser
  promptStrike: 0.85  // Prompt Strike etwas leiser, aber immer noch prominent
});
```

## Programmierte Anpassung

Du kannst die Lautstärken auch zur Laufzeit anpassen:

```typescript
// Aktuelle Lautstärke abrufen
const currentVolume = audio.getSfxTypeVolume("explosion");

// Alle aktuellen Lautstärken abrufen
const allVolumes = audio.getSfxVolumes();
console.log(allVolumes);
```

## Tipps

- **Explosionen** sind oft am lautesten - reduziere sie auf 0.4-0.6 für besseres Gleichgewicht
- **Hit-Sounds** sollten leiser sein (0.3-0.5), da sie häufig auftreten
- **Prompt Strike** sollte prominent bleiben (0.8-0.9), da es ein Ultimate ist
- **Gun** und **Railgun** sollten ähnlich laut sein (0.6-0.8)

