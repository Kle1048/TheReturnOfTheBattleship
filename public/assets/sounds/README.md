# Sound-Dateien

Dieser Ordner enthält alle WAV-Sound-Dateien für das Spiel.

## Benötigte Sound-Dateien

### Hintergrundmusik (dynamisch basierend auf Heat)
- `background-low.wav` - Niedrige Intensität (Heat 0-20)
- `background-medium.wav` - Mittlere Intensität (Heat 20-50)
- `background-high.wav` - Hohe Intensität (Heat 50+)

### Sound-Effekte (SFX)
- `gun.wav` - Artillerie-Schuss
- `rail-shot.wav` - Railgun abfeuern
- `explosion.wav` - Explosion
- `hit.wav` - Treffer (nicht tödlich)
- `laser.wav` - Laser abfeuern
- `missile-launch.wav` - Rakete starten (SAM/SSM)
- `prompt-strike.wav` - Prompt Strike Ultimate

## Hinweise

- Alle Dateien müssen im WAV-Format vorliegen
- Falls eine Datei fehlt, wird automatisch der Synthesizer als Fallback verwendet
- Die Hintergrundmusik wird automatisch basierend auf dem Heat-Level gewechselt (mit Crossfading)
- Die Musik startet automatisch, wenn das Spiel beginnt
- Die Musik stoppt automatisch beim Game Over

## Empfohlene Audio-Einstellungen

- **Format**: WAV (PCM, 16-bit, 44.1kHz empfohlen)
- **Länge Hintergrundmusik**: 30-60 Sekunden (wird geloopt)
- **Länge SFX**: 0.1-2 Sekunden
- **Lautstärke**: Normalisiert auf -3dB bis -6dB empfohlen

## Optional

Falls keine Sound-Dateien vorhanden sind, funktioniert das Spiel weiterhin mit den synthetischen Sounds als Fallback.

