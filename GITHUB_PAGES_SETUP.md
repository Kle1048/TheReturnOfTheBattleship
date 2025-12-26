# GitHub Pages Setup - Schritt für Schritt

Diese Anleitung zeigt dir, wie du dein Spiel auf GitHub Pages deployen kannst, damit es online spielbar ist.

---

## ✅ Schritt 1: Repository-Einstellungen auf GitHub

1. **Gehe zu deinem Repository auf GitHub:**
   https://github.com/Kle1048/TheReturnOfTheBattleship

2. **Öffne die Settings:**
   - Klicke auf den Tab **"⚙️ Settings"** (oben rechts)

3. **Aktiviere GitHub Pages:**
   - Scrolle nach unten zu **"Pages"** (im linken Menü)
   - Unter **"Source"** wähle:
     - **Deploy from a branch** → **gh-pages** → **/ (root)** → **Save**
     - **ODER** (empfohlen): **GitHub Actions** (falls verfügbar)

4. **Aktiviere GitHub Actions:**
   - Gehe zu **"Actions"** (oben im Repository)
   - Falls GitHub Actions deaktiviert sind, klicke auf **"I understand my workflows, go ahead and enable them"**

---

## ✅ Schritt 2: Dateien committen und pushen

Die notwendigen Dateien wurden bereits erstellt:
- ✅ `.github/workflows/deploy.yml` - GitHub Actions Workflow
- ✅ `vite.config.ts` - Angepasst für GitHub Pages

Jetzt musst du diese Änderungen committen und pushen:

```bash
# Status prüfen
git status

# Alle Änderungen hinzufügen
git add .

# Commit erstellen
git commit -m "Setup GitHub Pages deployment"

# Auf GitHub pushen
git push
```

**Nach dem Push:**
- GitHub Actions startet automatisch den Build-Prozess
- Das kann 1-2 Minuten dauern

---

## ✅ Schritt 3: Deployment überwachen

1. **Gehe zum "Actions" Tab:**
   - https://github.com/Kle1048/TheReturnOfTheBattleship/actions

2. **Prüfe den Workflow:**
   - Du solltest einen neuen Workflow-Run sehen: "Deploy to GitHub Pages"
   - Klicke darauf, um den Fortschritt zu sehen

3. **Warte auf Completion:**
   - Ein grünes Häkchen bedeutet: Erfolgreich!
   - Falls rot: Siehe "Troubleshooting" unten

---

## ✅ Schritt 4: URL finden

Nach erfolgreichem Deployment:

1. **Gehe zu Settings → Pages:**
   - Du siehst jetzt: **"Your site is live at ..."**
   - Die URL ist: `https://kle1048.github.io/TheReturnOfTheBattleship/`

2. **Oder klicke auf die Deployment-Benachrichtigung:**
   - GitHub zeigt dir eine Benachrichtigung mit der URL

**Deine Spiel-URL:**
🌐 **https://kle1048.github.io/TheReturnOfTheBattleship/**

---

## 🔄 Automatisches Deployment

**Ab jetzt:** Bei jedem Push auf den `master` Branch wird automatisch:
1. Das Projekt gebaut (`npm run build`)
2. Auf GitHub Pages deployed
3. Die Website aktualisiert

**Keine weiteren Schritte nötig!** 🎉

---

## 🐛 Troubleshooting

### Problem: "Actions tab not visible" oder "Workflow disabled"

**Lösung:**
1. Repository → Settings → Actions → General
2. Unter "Actions permissions": **"Allow all actions and reusable workflows"**
3. Speichern

### Problem: "Build failed" oder "TypeScript errors"

**Lösung:**
```bash
# Lokal testen
npm run build

# Falls Fehler auftreten, diese beheben und neu pushen
```

### Problem: "404 Not Found" auf der Website

**Lösung:**
1. Warte 1-2 Minuten (Deployment kann dauern)
2. Prüfe ob der Workflow erfolgreich war (Actions Tab)
3. Prüfe Settings → Pages → Source (sollte "GitHub Actions" sein)

### Problem: Assets werden nicht geladen (Bilder, Sounds fehlen)

**Lösung:**
- Prüfe ob alle Assets im `assets/` Ordner sind
- Prüfe die Browser-Konsole auf 404-Fehler
- Stelle sicher, dass `vite.config.ts` den richtigen `base` Path hat

---

## 📝 Manuelle Alternative (falls GitHub Actions nicht funktioniert)

Falls du GitHub Actions nicht verwenden möchtest, kannst du manuell deployen:

```bash
# Build erstellen
npm run build

# gh-pages Branch erstellen
git checkout -b gh-pages

# dist/ Inhalt in Root verschieben (manuell)
# Dann:
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Zurück zu master
git checkout master
```

**Aber:** GitHub Actions ist einfacher und automatischer! 👍

---

## 🎯 Nächste Schritte (optional)

### 1. Custom Domain einrichten

Falls du eine eigene Domain hast:
1. Settings → Pages → Custom domain
2. Deine Domain eintragen
3. DNS-Einstellungen anpassen

### 2. Repository-Badge hinzufügen

Füge einen "Live Demo" Badge in dein README.md ein:

```markdown
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20Now-green)](https://kle1048.github.io/TheReturnOfTheBattleship/)
```

### 3. README.md aktualisieren

Füge einen Link zur Live-Version hinzu:

```markdown
## 🎮 Live Demo

Spiele jetzt online: https://kle1048.github.io/TheReturnOfTheBattleship/
```

---

## ✅ Checkliste

- [ ] GitHub Pages aktiviert (Settings → Pages)
- [ ] GitHub Actions aktiviert (Settings → Actions)
- [ ] Dateien committed und gepusht
- [ ] Workflow erfolgreich gelaufen (Actions Tab)
- [ ] Website erreichbar unter https://kle1048.github.io/TheReturnOfTheBattleship/

---

**Viel Erfolg! 🚀**

Bei Problemen: Checke den Actions Tab für Fehlermeldungen!

