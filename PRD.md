PRD – Return of the Battleship
1) Vision

Ein kompromissloser, arcadiger Horizontal-Shooter im 90er-VGA-Look. Der Spieler steuert ein modernes Schlachtschiff (2/3 der Bildschirmhöhe Wasser/Schiff, oberes Drittel Himmel) und räumt endlos Gegnerwellen weg. Das Spiel wirkt toternst patriotisch (Slogans, UI-Stil, “Heroic”-Audio), aber ist so überzogen, dass die Satire mitschwingt.

2) Ziele

Browser-first (Desktop + Mobile), ohne Installationshürde

Sehr reaktionsschnell (60 FPS Ziel), kurze Sessions, “one more run”

Klares Waffen-Kit gemäß Spezifikation:

Artillerie (Primär)

Railgun (Charge/Line-Shot)

Flugabwehrraketen (Anti-Air Lock / Smart)

Schiff-Schiff-Raketen (Heavy / Cooldown)

Laser (Defensiv: Projektil-Abwehr)

Prompt Strike Hypersonic Missile (Ult, über Power-Meter, nuked Screen)

Endlos mit steigender Schwierigkeit und Score-Jagd

3) Plattform & Tech Constraints

Interne Renderauflösung: 320×200

Output: integer scaling (z. B. 2×, 3×, 4×), nearest-neighbor

16-Farb-Palette (fix oder leicht variierbar in Slots, aber immer 16)

Pixel-Only, keine Filter, keine Subpixel

4) Core Game Loop

Spawn-Director erzeugt Gegner/Events abhängig von “Heat” (Run-Zeit & Performance)

Spieler bewegt Schlachtschiff (Wasserzone), schießt, sammelt Power

Kollisionen → Schaden/Explosionen → Score + Drops

Power-Meter lädt → Prompt Strike optional

Tod → Scoreboard + “Run-Summary” → Restart

5) Controls (Desktop + Mobile)

Desktop

Move: W/S oder ↑/↓ (nur Wasserbereich), optional A/D für leichte Vor/Zurück-Drift

Fire: Space / LMB

Secondary: Shift / RMB

Railgun Charge: gehaltene Taste

Laser Defense: E (toggle/hold)

Prompt Strike: Q (wenn Meter voll)

Mobile

Links: Virtual Stick (vertikal) + leichte horizontale Drift

Rechts: Buttons: Fire / Secondary / Laser / Prompt Strike (erscheint wenn voll)

6) Screen Layout & Spielraum-Regel

Top 1/3: Himmel (nur fliegende Gegner/Projektile/FX)

Bottom 2/3: Meer + Schlachtschiff + Surface-Ziele

Spieler darf nicht in den Himmel “hochfahren”; Übergang ist harte Kante (klar lesbar).

7) Weapons Spec (Spielmechanik)

Artillerie (Primary)

Feuerrate konstant, mittlerer Schaden

Upgrades: Spread +1, +2 / höhere RoF / Splash klein

Railgun

Cooldown-basiert (5 Sekunden)

Durchdringender Strahl (pierce), hoher Schaden, kurzer Screen-Shake

AA Missiles

Ziel: nur Air-Units, bevorzugt schnellste/gefährlichste

Smart-Homing, geringer Splash

Ship-Ship Missiles

Langsam, hoher Schaden, trifft Surface & große Air-Targets

Cooldown-basiert

Laser Defense

Kein “Schaden” primär, sondern Projectile Intercept

Hitzebalken (Overheat): zu lang = Cooldown Lock

Prompt Strike Hypersonic Missile (Ultimate)

Power-Meter (0–100)

Aktivierung: “Screen-Clear” (alle Gegner + Projektile), Boss nimmt massiven Schaden statt insta-kill

Ultra-kurze “heroic” Audio/Flash (in Palette-Grenzen)

8) Enemies (Beispiele)

Air (Himmel)

Drones (Swarm)

Jets (Strafe-Runs)

Bombers (drop patterns)

Cruise Missiles (fast, low HP, high threat)

Surface (Meer)

Fast Boats (ram + bullets)

Frigates (AA + missiles)

Sub-Periscope (pop-up shots, teaser, schnell wieder weg)

Elites / Mini-Boss

“Aegis wall” (bullet curtain)

“Carrier flyover” (spawns air waves)

9) Progression & Difficulty

Endloser “Heat” Wert:

+Zeit

+Kill-Streak

−bei Treffer

Spawns skalieren: mehr bullets, schnellere patterns, kombinierte Air/Sea-Phasen

Drops:

Weapon upgrade chips

Repair (selten)

Power boost (Meter)

10) Scoring

Punkte pro Kill + Multiplikator (Streak)

Extra: “Style” (Railgun multi-pierce, Laser perfect defense streak)

Prompt Strike gibt keinen Multiplikatorboost (damit es nicht dominiert), aber rettet Runs

11) Art Direction (VGA 16 Farben)

Harte Silhouetten, starke Kontraste

UI wie “military console”, aber übertrieben heroisch (Banner, Embleme)

Satire subtil: übersteigert ernst, ikonische Schlagworte, “too much”, aber ohne explizite Gags

Palette (Beispiel-16, frei anpassbar)
0 Transparent, 1 Black, 2 Dark Blue, 3 Blue, 4 Dark Green, 5 Green, 6 Dark Gray, 7 Gray, 8 Light Gray, 9 White, 10 Brown, 11 Orange, 12 Red, 13 Magenta, 14 Yellow, 15 Cyan

12) Audio Direction

Chiptune/AdLib-Anmutung + “heroic stabs”

SFX sehr “arcade”: punchy, kurze Hüllkurven, wenig Hall

Prompt Strike: Signature-Sound + kurzer “anthem hit”

13) UX / UI Screens

Title → “Press Fire”

Run HUD: HP, Power-Meter, Weapon-Icons, Score, Heat

Pause (Mobile friendly)

Game Over: Score, Best, “Restart”

14) Nicht-Ziele (damit scope klein bleibt)

Kein Multiplayer

Keine Story-Campaign zum Start (nur endlos)

Kein komplexes Inventar; nur Run-Upgrades

“Screenshot” Mock (Wireframe in 320×200)
+------------------------------------------------+
| SKY (1/3)                                      |
|  [Jets]   [Missiles]          SCORE 0012450    |
|                                  HEAT  07      |
|----------------------------------------------- |
| SEA (2/3)                                      |
|   ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~      |
|   [ENEMY BOATS]      *expl*                    |
|                                                |
|   [PLAYER BATTLESHIP SPRITE occupies water]    |
|                                                |
| HP [#####.....]   PWR [##########....]  ULTx   |
| WPN: ART | RAIL | AA | SSM | LASER             |
+------------------------------------------------+

Zustandsdiagramme (Mermaid)
Game State
stateDiagram-v2
  [*] --> Boot
  Boot --> Title
  Title --> Run : Start
  Run --> Pause : Pause
  Pause --> Run : Resume
  Run --> GameOver : PlayerHP=0
  GameOver --> Title : Confirm

Weapon State (Railgun + Laser + Prompt Strike)
stateDiagram-v2
  [*] --> Idle
  Idle --> FiringPrimary : Fire
  Idle --> ChargingRail : HoldRail
  ChargingRail --> RailShot : ReleaseRail
  RailShot --> Idle

  Idle --> LaserActive : HoldLaser
  LaserActive --> LaserOverheat : HeatMax
  LaserActive --> Idle : ReleaseLaser
  LaserOverheat --> Idle : CooldownDone

  Idle --> PromptReady : Power=100
  PromptReady --> PromptFiring : UseUlt
  PromptFiring --> Idle : Resolve

Architektur (Browser + Mobile)
High-Level

Rendering: Canvas 2D, eigener indexed framebuffer (320×200, 8-bit indices 0..15)

Game Loop: Fixed timestep (z. B. 60 Hz) + interpolation optional

Entities: leichtgewichtiges ECS oder “component bags” (für Speed & Klarheit)

Input: Keyboard + Touch Abstraction

Audio: WebAudio Mixer + SFX voices + Music channel

Assets: Spritesheets (Index-Sprites) + JSON Metadata (frames)

Module

engine/loop.ts – Timestep, scheduling

engine/render/ – framebuffer, palette, blit, camera scroll

game/entities/ – player, enemies, bullets

game/systems/ – spawn, movement, collision, damage, scoring

game/director.ts – Heat scaling, wave logic

audio/ – sound engine, sfx, music

ui/ – HUD, menus (auch gerendert als Pixel-UI)

Grafiksystem (direkt nutzbares Grundgerüst)
1) HTML (Canvas Setup)
<canvas id="screen"></canvas>

2) Renderer: 320×200 Indexed Framebuffer (JS/TS)
// renderer.ts
// 320x200 indexed framebuffer (0..15). Nearest-neighbor upscaling via Canvas.

export const W = 320;
export const H = 200;

export type RGBA = [number, number, number, number]; // 0..255

export class VGARenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Index buffer: each pixel is 0..15
  public fb = new Uint8Array(W * H);

  // Palette: 16 RGBA colors
  public palette: RGBA[] = Array.from({ length: 16 }, () => [0, 0, 0, 255]);

  private imageData: ImageData;
  private rgba: Uint8ClampedArray;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D context not available");
    this.ctx = ctx;

    // Internal resolution always 320x200
    this.imageData = this.ctx.createImageData(W, H);
    this.rgba = this.imageData.data;

    // Crisp pixels
    (this.ctx as any).imageSmoothingEnabled = false;

    this.resizeToDevice();
    window.addEventListener("resize", () => this.resizeToDevice());
  }

  resizeToDevice() {
    // Integer scaling: choose biggest integer scale that fits
    const scale = Math.max(
      1,
      Math.floor(Math.min(window.innerWidth / W, window.innerHeight / H))
    );

    this.canvas.width = W * scale;
    this.canvas.height = H * scale;

    // Scale drawing (we draw ImageData to an offscreen canvas-like path by putting at 1:1 then scaling)
    this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
    (this.ctx as any).imageSmoothingEnabled = false;
  }

  clear(colorIndex = 1) {
    this.fb.fill(colorIndex);
  }

  // Convert indexed fb -> RGBA ImageData and blit
  present() {
    // Map each index to RGBA
    for (let i = 0, p = 0; i < this.fb.length; i++, p += 4) {
      const idx = this.fb[i] & 15;
      const [r, g, b, a] = this.palette[idx];
      this.rgba[p] = r;
      this.rgba[p + 1] = g;
      this.rgba[p + 2] = b;
      this.rgba[p + 3] = a;
    }
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

3) Sprite Blitting (Transparenz = Index 0)
// blit.ts
import { W, H } from "./renderer";

// Sprite: indexed pixels (0..15) + width/height
export type Sprite = {
  w: number;
  h: number;
  px: Uint8Array; // length = w*h
};

export function blit(
  fb: Uint8Array,
  sprite: Sprite,
  x: number,
  y: number
) {
  // integer pixel coords for true pixel look
  const sx = x | 0;
  const sy = y | 0;

  for (let j = 0; j < sprite.h; j++) {
    const yy = sy + j;
    if (yy < 0 || yy >= H) continue;

    for (let i = 0; i < sprite.w; i++) {
      const xx = sx + i;
      if (xx < 0 || xx >= W) continue;

      const s = sprite.px[j * sprite.w + i] & 15;
      if (s === 0) continue; // 0 = transparent
      fb[yy * W + xx] = s;
    }
  }
}

4) Parallax & Scrolling (Endlos)

Background Layer 0: Himmel (slow scroll)

Layer 1: Meer (mid)

Layer 2: Foam/near water (fast)

Entities bewegen relativ zur Kamera, Kamera scrollt konstant nach rechts

(Implementierst du später als “tile strips” oder als wiederholende Sprite-Bänder.)

Soundsystem (WebAudio, Arcade-SFX + Music)
Audio Engine + Mixer
// audio.ts
// Minimal WebAudio mixer with SFX + Music buses. Mobile-safe: call resume() on first user gesture.

export class AudioEngine {
  private ctx: AudioContext;
  private master: GainNode;
  private sfxBus: GainNode;
  private musicBus: GainNode;

  constructor() {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AC();

    this.master = this.ctx.createGain();
    this.sfxBus = this.ctx.createGain();
    this.musicBus = this.ctx.createGain();

    this.sfxBus.connect(this.master);
    this.musicBus.connect(this.master);
    this.master.connect(this.ctx.destination);

    // Defaults (tweak later)
    this.master.gain.value = 0.8;
    this.sfxBus.gain.value = 1.0;
    this.musicBus.gain.value = 0.6;
  }

  async resume() {
    if (this.ctx.state !== "running") await this.ctx.resume();
  }

  setMusicVolume(v: number) { this.musicBus.gain.value = v; }
  setSfxVolume(v: number) { this.sfxBus.gain.value = v; }

  // Simple synth SFX (no samples needed for MVP)
  playBeep(freq = 440, dur = 0.08, type: OscillatorType = "square", vol = 0.25) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o.type = type;
    o.frequency.value = freq;

    // Fast arcade envelope
    const t0 = this.ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    o.connect(g);
    g.connect(this.sfxBus);

    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  // Examples:
  sfxGun() { this.playBeep(520, 0.06, "square", 0.18); }
  sfxRailCharge() { this.playBeep(180, 0.12, "sawtooth", 0.12); }
  sfxRailShot() { this.playBeep(90, 0.18, "sawtooth", 0.30); }
  sfxExplosion() { this.playBeep(60, 0.22, "triangle", 0.35); }

  // Prompt Strike: signature “anthem hit” (stack 2-3 tones)
  sfxPromptStrike() {
    this.playBeep(220, 0.25, "square", 0.25);
    this.playBeep(330, 0.25, "square", 0.22);
    this.playBeep(440, 0.25, "square", 0.20);
  }
}


Wichtig für Mobile: audio.resume() muss bei erstem Tap/Click passieren (Autoplay-Policy).

MVP Backlog (kurz, aber vollständig)

Engine Loop + Input + States (Title/Run/GameOver)

Renderer (indexed fb) + 16-Palette + Sprite blit

Player ship movement (nur Wasserbereich) + Artillerie

Enemies (2 air, 2 sea) + bullets + collisions

Score + Heat scaling + Spawn director

Weapons: Railgun, AA, SSM, Laser defense

Power-Meter + Prompt Strike

HUD + Pause + Mobile controls

SFX + Music stub

Polish: screen shake, flash, palette tricks (ohne 16-Farben zu brechen)

Die wichtigsten Designfragen (für Feinschliff der PRD)

Beantworte gern nur stichpunktartig:

Perspektive: Side-View strikt (wie R-Type) oder leicht schräg/isometrisch “Pseudo-3D”?

Hitbox-Philosophie: “Fair” (kleine Hitbox) oder “realistisch” (großes Schiff = großes Risiko)?

Lebenssystem: HP-Bar + Repairs oder 1-Hit + Shield?

Waffen-Slots: Immer alle Waffen verfügbar oder Pickup-basiert mit Wechsel?

Laser Defense: Hold-to-block in einem Kegel vor dem Schiff oder 360° Intercept?

Prompt Strike Häufigkeit: eher “1× pro ~60–90s” oder seltener als Rettungsanker?

Bosses: In Endlos: regelmäßige Boss-Wellen (z. B. alle 3–5 Minuten) ja/nein?

Wenn du willst, formatiere ich dir daraus als nächstes direkt ein sauberes PRD-Dokument (Markdown) + Ordnerstruktur + lauffähiges Mini-Repo-Skeleton (ohne Framework, oder mit Phaser – aber VGA-Framebuffer geht auch “pure canvas”).

Rein 2d, faire hitbox, Hp bar, immer alle waffen verfügbar, 360 Intercept aber mit 1sec cooldown, prompt Strike 1 mal pro 60-90sec, keine Bosse, bitte formatiere direkt ein sauberes prd im Markup Format.

Perfekt. Hier ist die saubere, konsolidierte PRD v1.0 im Markup-/Markdown-Format, mit allen finalen Entscheidungen eingearbeitet.

# Product Requirements Document (PRD)
## Return of the Battleship

---

## 1. Produktübersicht

**Titel:** Return of the Battleship  
**Genre:** 2D Horizontal Scrollender Arcade Shooter  
**Plattform:** Browser-first (Desktop & Mobile)  
**Technologie:** HTML5 Canvas (optional Phaser 3)  
**Spielmodus:** Endlos (Highscore-basiert)  
**Zielauflösung (intern):** 320 × 200  
**Grafikstil:** Reine Pixelgrafik, 16-Farben-VGA-Palette  
**Perspektive:** Rein 2D (Side-View)

---

## 2. Vision & Tonalität

*Return of the Battleship* inszeniert moderne militärische Überlegenheit vollkommen ernsthaft.  
Es gibt **keine Ironie, keine Meta-Ebene, keine Witze**.

Die Satire entsteht ausschließlich durch:
- Eskalation
- Maßlosigkeit
- kompromisslosen Arcade-Fokus

Leitsatz:
> *This is not a joke. This is a battleship.*

---

## 3. Zielgruppe

- Fans klassischer Arcade-Shooter (R-Type, Gradius)
- Retro- & Pixel-Art-Enthusiasten
- Browser- & Mobile-Spieler mit kurzen Sessions
- Spieler mit Affinität zu Technik & Action

---

## 4. Plattform & technische Rahmenbedingungen

- **Browser-first**, lauffähig auf:
  - Desktop (Keyboard + Maus)
  - Mobile (Touch)
- Optionale PWA-Fähigkeit
- Keine Installation erforderlich
- Feste interne Auflösung, Integer-Scaling
- Pixel-perfect Rendering (Nearest Neighbor)

---

## 5. Spielfeld & Layout

### Bildschirmaufteilung (320×200)

- **Oberes Drittel (≈ 66 px): Himmel**
  - Nur fliegende Gegner
  - Flugkörper, Jets, Drohnen
- **Unteres Zwei Drittel (≈ 134 px): Meer**
  - Spieler-Schlachtschiff
  - Schiffe, Raketen, Explosionen

Der Spieler:
- bewegt sich **nur im Wasserbereich**
- kann den Himmel **nicht betreten**

---

## 6. Steuerung

### Desktop
- Bewegung: `W/S` oder `↑/↓`
- Primärfeuer: `Space` oder `Linke Maustaste`
- Sekundärwaffen: eigene Tasten
- Laser Defense: Taste gedrückt halten
- Prompt Strike: eigene Taste (nur bei vollem Meter)

### Mobile
- Links: Virtueller Stick (vertikal)
- Rechts: Buttons
  - Fire
  - Laser
  - Prompt Strike (erscheint nur wenn verfügbar)

---

## 7. Spielerzustand

- **Lebenspunkte (HP-Bar)**  
  - Kein One-Hit-Death
  - Reparatur-Drops selten
- **Faire Hitbox**
  - kleiner als Sprite
  - klar kommuniziert

---

## 8. Waffensystem

Alle Waffen sind **immer verfügbar**.

### Standardwaffen

- **Artillerie (Primär)**
  - Dauerfeuer nach vorne
  - Mittlerer Schaden

- **Railgun**
  - Charge-Waffe
  - Durchdringender Strahl
  - Sehr hoher Schaden

- **Flugabwehrraketen**
  - Zielsuchend
  - Priorisiert Luftziele

- **Schiff-Schiff-Raketen**
  - Langsam
  - Sehr hoher Schaden
  - Effektiv gegen große Ziele

- **Laser Defense**
  - 360° Projektil-Abwehr
  - Kein direkter Schaden
  - **Cooldown: 1 Sekunde**
  - Overuse → kurze Sperre

---

## 9. Spezialwaffe (Ultimate)

### Prompt Strike Hypersonic Missile

- Aktivierung nur bei vollem Power Meter
- **Zerstört alle Gegner & Projektile auf dem Bildschirm**
- Kein Boss-Schaden (da keine Bosse existieren)
- Verfügbarkeit: **ca. 1× pro 60–90 Sekunden**
- Visuell & akustisch starkes Signature-Event

---

## 10. Power Meter

- Füllt sich durch:
  - Abschüsse
  - Überlebenszeit
- Reset nach Prompt Strike
- Anzeige im HUD

---

## 11. Gegnerdesign

### Gegnertypen

**Luft (Himmel):**
- Drohnen (Schwarm)
- Jets (Strafe Runs)
- Marschflugkörper

**See (Meer):**
- Schnellboote
- Fregatten
- Raketenplattformen

### Eigenschaften
- Steigende Spawnrate
- Kombinierte Luft-/See-Angriffe
- Keine Fraktionen, keine Namen

---

## 12. Bosse

- **Keine Bosse**
- Fokus liegt auf:
  - Dauerstress
  - Eskalation
  - Lesbarkeit
- Schwierigkeit steigt ausschließlich über Dichte & Muster

---

## 13. Scoring & Progression

- Punkte für:
  - Abschüsse
  - Multi-Kills
  - saubere Defense (Laser)
- Schwierigkeits-Skalierung:
  - Zeit
  - Score
- Keine Meta-Progression
- Reiner Arcade-Loop

---

## 14. Grafiksystem

- **16-Farben-VGA-Palette (fix)**
- Indexed Rendering (0–15)
- Transparenz nur über Index 0
- Keine Shader
- Keine Alpha-Blends
- Explosionen als Frame-Animationen

### Layer-Reihenfolge
1. Himmel
2. Meer (Tile-Scrolling)
3. Gegner (Luft)
4. Gegner (See)
5. Spieler
6. Projektile
7. Effekte
8. HUD

---

## 15. Soundsystem

- WebAudio API
- Zwei Busse:
  - Music
  - SFX
- Stil:
  - Arcade / Chiptune / AdLib-inspiriert
- Kurze, harte Sounds
- Signature-Sound für Prompt Strike
- Audio-Start erst nach User-Input (Mobile Policy)

---

## 16. Zustandsdiagramm

### Spielzustände



BOOT
↓
TITLE
↓
RUNNING
↓
GAME OVER
↓
TITLE


### Waffen-/Power-Zustand



IDLE → FIRING / CHARGING / LASER
POWER FULL → PROMPT STRIKE → RESET


---

## 17. MVP-Scope (Release 1.0)

- 1 spielbares Schlachtschiff
- Endlosmodus
- 6 Waffen inkl. Prompt Strike
- HP-System
- Faire Hitbox
- 6–8 Gegnertypen
- Score & Highscore
- Desktop & Mobile spielbar

---

## 18. Bewusst nicht im Scope

- Story
- Kampagne
- Bosse
- Multiplayer
- Politische Aussagen
- Meta-Progression

---

## 19. Erfolgskriterien

- Sofort spielbar (<3 Sekunden bis Gameplay)
- Stabile 60 FPS
- Lesbarkeit auf Mobile
- „One more run“-Gefühl
- Hoher Wiederspielwert

---




