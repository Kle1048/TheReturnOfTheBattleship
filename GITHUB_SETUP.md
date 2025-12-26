# GitHub Setup Anleitung
## Return of the Battleship auf GitHub pushen

Diese Anleitung führt dich Schritt für Schritt durch das Setup deines GitHub-Repositories.

---

## Schritt 1: GitHub Repository erstellen

1. **Gehe zu GitHub:** Öffne https://github.com in deinem Browser und logge dich ein.

2. **Neues Repository erstellen:**
   - Klicke auf das **"+" Icon** (oben rechts) → **"New repository"**
   - Oder gehe direkt zu: https://github.com/new

3. **Repository-Details ausfüllen:**
   - **Repository name:** `TheReturnOfTheBattleship` (oder dein gewünschter Name)
   - **Description:** `Retro arcade horizontal shooter in VGA 16-color style`
   - **Visibility:** 
     - ✅ **Public** (empfohlen für Portfolio)
     - ⚪ **Private** (nur für dich sichtbar)
   - **⚠️ WICHTIG:** LASS diese Checkboxen **UNGEHÄCKT**:
     - ❌ ❌ ❌ Add a README file
     - ❌ ❌ ❌ Add .gitignore
     - ❌ ❌ ❌ Choose a license
   
   *(Diese Dateien existieren bereits in deinem lokalen Repository!)*

4. **Klicke auf "Create repository"**

5. **Kopiere die Repository-URL:**
   - GitHub zeigt dir jetzt eine Seite mit Befehlen
   - Kopiere die **HTTPS-URL** (z.B. `https://github.com/deinusername/TheReturnOfTheBattleship.git`)
   - Oder die **SSH-URL** (z.B. `git@github.com:deinusername/TheReturnOfTheBattleship.git`)

---

## Schritt 2: Remote-Repository verbinden

Führe diese Befehle in deinem Terminal aus (im Projektverzeichnis):

### Option A: HTTPS (einfacher, erfordert Login)

```bash
# Remote hinzufügen (ersetze URL mit deiner GitHub-URL)
git remote add origin https://github.com/deinusername/TheReturnOfTheBattleship.git

# Prüfen ob es geklappt hat
git remote -v
```

### Option B: SSH (empfohlen, erfordert SSH-Key Setup)

```bash
# Remote hinzufügen (ersetze URL mit deiner SSH-URL)
git remote add origin git@github.com:deinusername/TheReturnOfTheBattleship.git

# Prüfen ob es geklappt hat
git remote -v
```

**Hinweis:** Falls du noch keinen SSH-Key hast, folge dieser Anleitung:
https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## Schritt 3: Code auf GitHub pushen

### Erster Push (alle Commits hochladen):

```bash
# Stelle sicher, dass du auf dem master branch bist
git branch

# Pushe alle Commits zum Remote-Repository
git push -u origin master
```

**Falls `master` nicht funktioniert, versuche `main`:**

```bash
# Wenn GitHub `main` als Standard verwendet
git branch -M main
git push -u origin main
```

**Hinweise:**
- Bei HTTPS wirst du nach Benutzername und Passwort/Token gefragt
- Bei SSH wird automatisch dein Key verwendet
- `-u` setzt das "Upstream" - danach kannst du einfach `git push` verwenden

---

## Schritt 4: Repository-Einstellungen (optional, aber empfohlen)

### 4.1 Repository-Beschreibung aktualisieren

1. Gehe zu deinem Repository auf GitHub
2. Klicke auf **"⚙️ Settings"** (oben rechts)
3. Scrolle nach unten zu **"About"**
4. Füge Tags hinzu: `typescript`, `game`, `vga`, `retro`, `arcade`, `html5-canvas`

### 4.2 GitHub Pages Setup (optional, um das Spiel online zu spielen)

1. Im Repository: **Settings** → **Pages** (links im Menü)
2. **Source:** Wähle `gh-pages` Branch oder `main/master` Branch, Ordner: `/docs` oder `/root`
3. **WICHTIG:** Du musst erst einen Build erstellen:

```bash
# Build erstellen
npm run build

# Neuen Branch für GitHub Pages erstellen
git checkout -b gh-pages

# dist/ Ordner in Root verschieben oder anders konfigurieren
# (GitHub Pages erwartet Dateien im Root oder /docs Ordner)
```

**Oder verwende GitHub Actions für automatisches Deployment:**
Siehe `.github/workflows/deploy.yml` (kann ich erstellen, falls gewünscht)

---

## Schritt 5: GitHub Features nutzen

### 5.1 Issues für Todo-Liste

Erstelle Issues für:
- ✅ Mobile Controls implementieren
- ✅ Pause-Menü hinzufügen
- ✅ Laser Overheat-System

### 5.2 Releases erstellen

Wenn du eine Version fertig hast:

1. **Tag erstellen:**
```bash
git tag -a v1.0.0 -m "MVP Release"
git push origin v1.0.0
```

2. **Release auf GitHub:**
   - Repository → **Releases** → **"Create a new release"**
   - Wähle den Tag
   - Beschreibe die Änderungen

### 5.3 License hinzufügen

Wenn du möchtest, füge eine LICENSE hinzu:

```bash
# Erstelle LICENSE-Datei (z.B. MIT License)
# GitHub kann das automatisch erstellen: Settings → License
```

---

## Häufige Probleme & Lösungen

### Problem: "fatal: remote origin already exists"

**Lösung:**
```bash
# Entferne existierendes Remote
git remote remove origin

# Füge neues Remote hinzu
git remote add origin https://github.com/deinusername/TheReturnOfTheBattleship.git
```

### Problem: "Authentication failed"

**Lösung für HTTPS:**
- GitHub unterstützt keine Passwörter mehr
- Verwende einen **Personal Access Token**:
  1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token
  3. Scopes: `repo` (alle Checkboxen unter "repo")
  4. Kopiere Token und verwende ihn als Passwort

**Oder:** Wechsle zu SSH (empfohlen)

### Problem: "error: src refspec main does not match any"

**Lösung:**
```bash
# Prüfe welcher Branch existiert
git branch

# Verwende den existierenden Branch-Namen (wahrscheinlich "master")
git push -u origin master
```

### Problem: "Updates were rejected"

**Lösung:**
```bash
# Hole zuerst die Remote-Änderungen
git pull origin master --allow-unrelated-histories

# Dann pushe
git push -u origin master
```

---

## Nächste Schritte nach dem Push

1. ✅ **README.md verbessern** - Screenshots, GIFs, bessere Beschreibung
2. ✅ **Issues erstellen** - Für TODO-Items aus CODE_REVIEW_UND_ARCHITEKTUR.md
3. ✅ **GitHub Actions Setup** - Automatisches Build & Deploy
4. ✅ **License hinzufügen** - Falls du möchtest

---

## Befehls-Referenz (Quick Copy)

```bash
# Remote hinzufügen (HTTPS)
git remote add origin https://github.com/deinusername/TheReturnOfTheBattleship.git

# Remote hinzufügen (SSH)
git remote add origin git@github.com:deinusername/TheReturnOfTheBattleship.git

# Remote prüfen
git remote -v

# Pushen
git push -u origin master

# Oder falls main:
git branch -M main
git push -u origin main
```

---

**Viel Erfolg! 🚀**

Falls du Hilfe brauchst, melde dich einfach!

