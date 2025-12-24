# Return of the Battleship

Retro arcade horizontal shooter im 90er-VGA-Look.

## Features

- **320×200 VGA 16-Farben Grafik** - Authentischer Retro-Look
- **Endlos-Modus** - Steigende Schwierigkeit durch Heat-System
- **6 Waffensysteme**:
  - Artillerie (Primärwaffe, Leertaste/Mausklick)
  - Railgun (Charge-Waffe, R-Taste gedrückt halten)
  - Flugabwehrraketen (AA)
  - Schiff-Schiff-Raketen (SSM)
  - Laser Defense (360° Projektil-Abwehr, E-Taste)
  - Prompt Strike (Ultimate, Q-Taste wenn Power-Meter voll)
- **Gegnertypen**: Drohnen, Jets, Boote, Fregatten
- **Scoring & Highscore** - Lokal gespeichert

## Steuerung

### Desktop
- **Bewegung**: W/S oder ↑/↓
- **Feuer**: Leertaste oder Linke Maustaste
- **Railgun**: R-Taste gedrückt halten
- **Laser Defense**: E-Taste gedrückt halten
- **Prompt Strike**: Q-Taste (nur wenn Power-Meter voll)

### Mobile
- Touch-Controls werden in zukünftigen Updates hinzugefügt

## Installation & Start

```bash
npm install
npm run dev
```

Das Spiel öffnet sich automatisch im Browser auf `http://localhost:3000`.

## Build

```bash
npm run build
```

Der Build-Output befindet sich im `dist/` Ordner.

## Technologie

- TypeScript
- HTML5 Canvas
- WebAudio API
- Vite (Build Tool)

## Spielprinzip

Du steuerst ein Schlachtschiff und musst endlos gegen ankommende Gegnerwellen kämpfen. Das Spiel wird mit der Zeit immer schwieriger (Heat-System). Überlebe so lange wie möglich und erreiche einen hohen Score!

---

**This is not a joke. This is a battleship.**

