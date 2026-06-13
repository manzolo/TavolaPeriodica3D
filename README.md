<div align="center">

# ⚛️ PerioOrbit 3D

**Tavola periodica degli elementi interattiva in 3D** — con orbite elettroniche animate, tendenze periodiche e dati scientifici.
**Interactive 3D periodic table** — with animated electron orbits, periodic trends and scientific data.

🇮🇹 Italiano · 🇬🇧 English &nbsp;|&nbsp; React + TypeScript + three.js (@react-three/fiber)

</div>

---

## 🇮🇹 Italiano

### ✨ Caratteristiche
- **Tavola periodica in 3D** — tutti i 118 elementi come cubi luminosi disposti nel layout classico, navigabili liberamente (ruota, zoom, sposta).
- **Orbite elettroniche animate** — modello di Bohr con il numero corretto di shell ed elettroni per ogni elemento, con elettroni che ruotano.
- **Hover** → tooltip con numero atomico, simbolo, nome, massa, configurazione elettronica, stato di aggregazione.
- **Click** → pannello dettagliato con tutte le proprietà (densità, fusione/ebollizione, elettronegatività, raggio, anno di scoperta…).
- **Tendenze periodiche** colorate con gradiente + legenda: raggio atomico, elettronegatività, energia di ionizzazione, densità, temperatura di fusione.
- **Filtri** per categoria, blocco (s/p/d/f), periodo e gruppo.
- **Confronto** affiancato di due elementi.
- **Bilingue 🇮🇹/🇬🇧** (default italiano), dark mode futuristica, mobile-friendly.
- **Reset vista** e **Mostra/Nascondi orbite**.

### 🚀 Avvio rapido
Servono [Node.js](https://nodejs.org) 18+ **oppure** Docker.

```bash
# con npm
npm install
npm run dev          # http://localhost:5173

# con Make
make install && make dev

# con Docker (hot-reload)
make docker-dev      # http://localhost:5173

# anteprima build di produzione in Docker
make docker-prod     # http://localhost:8080
```

Tutti i comandi disponibili: `make help`.

### 🌐 Pubblicazione su GitHub Pages
Il repository include una **GitHub Action** (`.github/workflows/deploy.yml`) che
a ogni push su `main` compila il progetto e lo pubblica su GitHub Pages.
Il `base` path viene impostato automaticamente al nome del repository.

Per attivarlo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### 📚 Fonti e licenze
I dati sono fatti scientifici di pubblico dominio; il codice è MIT.
Dettagli completi in [`CREDITS.md`](./CREDITS.md) e [`LICENSE`](./LICENSE).

---

## 🇬🇧 English

### ✨ Features
- **3D periodic table** — all 118 elements as glowing tiles in the classic layout, fully navigable (rotate, zoom, pan).
- **Animated electron orbits** — Bohr model with the correct number of shells and electrons per element, electrons orbiting in real time.
- **Hover** → tooltip with atomic number, symbol, name, mass, electron configuration, phase.
- **Click** → detail panel with every property (density, melting/boiling point, electronegativity, radius, discovery year…).
- **Periodic trends** with color gradient + legend: atomic radius, electronegativity, ionization energy, density, melting temperature.
- **Filters** by category, block (s/p/d/f), period and group.
- **Side-by-side comparison** of two elements.
- **Bilingual 🇮🇹/🇬🇧** (Italian default), futuristic dark mode, mobile friendly.
- **Reset view** and **Show/Hide orbits**.

### 🚀 Quick start
Requires [Node.js](https://nodejs.org) 18+ **or** Docker.

```bash
npm install && npm run dev   # http://localhost:5173
# or
make docker-dev              # http://localhost:5173 (hot-reload in Docker)
```

Run `make help` to see all commands.

### 🌐 Deploy to GitHub Pages
A **GitHub Action** builds and publishes the site to GitHub Pages on every push
to `main`. The `base` path is set automatically from the repository name.
Enable it under **Settings → Pages → Source: GitHub Actions**.

### 📚 Sources & licenses
Element data are public-domain scientific facts; the code is MIT.
See [`CREDITS.md`](./CREDITS.md) and [`LICENSE`](./LICENSE).

---

### 🛠️ Stack
React 18 · TypeScript · Vite · three.js · @react-three/fiber · @react-three/drei
