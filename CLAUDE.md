# CLAUDE.md

Guida per agenti che lavorano su **PerioOrbit 3D** — tavola periodica interattiva in 3D.

## Cos'è

App web che mostra tutti i 118 elementi come tessere 3D navigabili, con orbite
elettroniche animate, tendenze periodiche colorate, filtri, confronto e
interfaccia bilingue IT/EN. Progetto **didattico** (l'utente sta imparando lo
stack); tenere il codice leggibile e commentato in italiano.

- **Live**: https://manzolo.github.io/TavolaPeriodica3D/
- **Repo**: https://github.com/manzolo/TavolaPeriodica3D

## Stack

Vite + React 18 + TypeScript · three.js via `@react-three/fiber` + `@react-three/drei`.
Nessun backend: è tutto statico (deploy su GitHub Pages).

## Comandi

```bash
make up        # Docker: build immagine + avvio container → http://localhost:8080
make down      # ferma il container
make docker-dev# Docker con hot-reload → http://localhost:5173
make dev       # dev locale senza Docker (vite) → http://localhost:5173
make build     # build di produzione in ./dist
make help      # elenco completo
```

Test locale di riferimento per l'utente: **Docker sulla porta 8080** (`make up`).

## Struttura

```
src/
  data/
    elements.ts        # dataset 118 elementi (fatti scientifici, pubblico dominio) + CATEGORY_META (colori)
    types.ts           # tipi: ElementData, Category, Phase, Block, TrendKey...
  i18n/index.tsx       # provider IT/EN + t() per UI e tCategory/tPhase/tBlock per le etichette dati
  utils/
    electronConfig.ts  # shell di Bohr calcolate via Aufbau dal numero atomico
    colorScales.ts     # definizione TRENDS, gradiente, normalizzazione
    layout.ts          # posizione 3D delle tessere dalla griglia 18x10
  three/
    Scene.tsx          # Canvas, luci, Stars, OrbitControls, CameraRig (fit automatico)
    PeriodicTable3D.tsx# mappa elementi→tessere, calcola colore da trend/categoria/filtri
    ElementTile.tsx    # singola tessera (hover/click/dim/selezione)
    ElectronOrbits.tsx # orbite + elettroni animati (modello di Bohr)
    AtomInspector.tsx  # AtomCanvas riusabile + inset fluttuante (vista "di taglio", sfondo nero)
  components/          # Tooltip, DetailPanel, Controls, Legend, ComparePanel, CreditsModal (overlay HTML)
  App.tsx, main.tsx, styles.css
```

## Convenzioni e punti chiave

- **i18n**: l'UI usa `t('key')`; le etichette derivate dai dati (categorie,
  stati, blocchi) DEVONO usare `tCategory/tPhase/tBlock`, non stringhe fisse —
  altrimenti non cambiano lingua. Default lingua: **italiano**.
- **Base path Pages**: in `vite.config.ts` il `base` è `/` in dev e
  `process.env.BASE_PATH ?? '/TavolaPeriodica3D/'` in build. La GitHub Action
  imposta `BASE_PATH=/<nome-repo>/`, quindi il deploy funziona anche se il repo
  viene rinominato. Per anteprime locali servite dalla root usare
  `npm run build -- --base=/`.
- **Atomo "di taglio"**: l'animazione dell'atomo NON va sovrapposta alla tavola;
  va mostrata in `AtomInspector`/`AtomCanvas` (riquadro nero, camera obliqua).
  L'inset fluttuante è per l'hover; nel pannello dettaglio l'atomo è già integrato.
- **Camera**: `CameraRig` in `Scene.tsx` rifà l'inquadratura (`fitDistance`) a
  ogni resize/reset; su desktop applica un offset X per non far coprire il
  gruppo 1 dal pannello sinistro.
- **Dati**: sono fatti di pubblico dominio; fonti e licenze in `CREDITS.md` e
  `LICENSE` (codice MIT). Non spacciare i valori come verificati: sono didattici.

## Deploy

Push su `main` → GitHub Action (`.github/workflows/deploy.yml`, Node 24) builda
e pubblica su Pages. Sorgente Pages = "GitHub Actions". Committare il codice solo
quando l'utente lo chiede.

## Verifica visiva

Non c'è un browser di sistema configurato per gli agenti, ma esistono
`/usr/bin/google-chrome` e `playwright-core` (installabile al volo) per fare
screenshot headless con `--use-angle=swiftshader`. Nota: il render software può
mostrare colori/glow leggermente diversi dalla GPU reale.
