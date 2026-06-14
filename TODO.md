# TODO — Isotopi

## Contesto

I 118 elementi ci sono tutti, ma in origine gli isotopi non erano modellati:
ogni elemento aveva solo massa atomica media, numero atomico e flag
`radioactive`. Carbonio-12/13/14 erano indistinguibili.

Fonti dati: **CIAAW** (composizioni isotopiche) e **IAEA LiveChart** (emivite).
Snapshot versionato nel repo, niente chiamate API a runtime (app statica).

## ✅ Fatto — Prima fetta (elementi pilota)

- [x] Tipo `IsotopeData` in `src/data/types.ts` (massNumber, abbondanza,
      stabilità, emivita in secondi; neutroni ricavati da A − Z).
- [x] Dataset `src/data/isotopes.ts` con gli elementi pilota:
      **H** (¹H, ²H, ³H), **C** (¹²C, ¹³C, ¹⁴C), **O** (¹⁶O, ¹⁷O, ¹⁸O),
      **U** (²³⁴U, ²³⁵U, ²³⁸U). Helper notazione apice (¹⁴C).
- [x] Selettore isotopi nel `DetailPanel` (chip) + tabella nuclide
      (numero di massa, protoni, neutroni, abbondanza, stabilità, emivita).
- [x] Formattatori: abbondanza in % a precisione adattiva; emivita con unità
      auto-scalata (s → … → miliardi di anni).
- [x] i18n IT/EN per tutte le nuove etichette e unità.
- [x] Elettroni invariati (gli isotopi neutri cambiano solo il nucleo).

## ✅ Fatto — Nucleo 3D

- [x] Componente `src/three/Nucleus.tsx`: protoni + neutroni come grappolo
      sferico (distribuzione a fillotassi). `instancedMesh` (2 draw call) →
      regge anche i ~238 nucleoni dell'uranio. Dimensioni adattate ad A,
      sempre più piccole della prima shell.
- [x] `ElectronOrbits` usa `Nucleus` (sostituita la vecchia sfera singola).
- [x] `AtomCanvas` accetta `massNumber`; calcola neutroni = A − Z
      (default = massa atomica arrotondata).
- [x] Nel `DetailPanel` il nucleo segue l'isotopo selezionato dalle chip,
      con legenda colori protoni/neutroni.
- [x] Crediti aggiornati (CIAAW + IAEA) in `CREDITS.md`.
- [x] Zoom + rotazione dell'atomo nel pannello dettaglio: `AtomCanvas` con
      prop `interactive` e `OrbitControls` (rotazione + zoom scroll, pan off,
      damping, distanza 2–14). Inset hover resta statico. Hint d'uso IT/EN.

## ✅ Fatto — D-pad di navigazione accessibile

- [x] Store esterno `src/three/navStore.ts`: le due scene (tavola e atomo,
      `<Canvas>` separati) registrano una `NavApi` con priorità; il pad agisce
      sul target a priorità più alta → comportamento **contestuale** (atomo se
      il pannello dettaglio è aperto, altrimenti tavola).
- [x] `src/components/NavPad.tsx`: frecce, zoom +/−, press-and-hold continuo
      (loop rAF) + step singolo da tastiera; `aria-label` IT/EN, `role=group`,
      focus ring, `touch-action: none`.
- [x] Pulsante centrale = **toggle modalità 3D/2D**: 3D ruota (orbita), 2D
      trasla (pan nel piano schermo, metodo `pan` in navStore). Indicatore
      acceso in 2D.
- [x] Toggle `✛ Navigazione` nella topbar; aggancio via `makeOrbitNavApi`
      (manipola l'offset camera→target in sferiche). Reset tavola = reframe
      `CameraRig`; reset atomo = camera obliqua iniziale.

## ✅ Fatto — Fix mobile / UI

- [x] Fog adattiva in `CameraRig` (`near=d+8`, `far=d+55`): su portrait la
      tavola non appare più nera/troppo lontana.
- [x] Topbar compatta sotto i 760px (brand, 3 bottoni e lingue non escono).
- [x] D-pad `z-index` sopra il pannello dettaglio (visibile quando si apre un
      elemento) e dimensioni ridotte su mobile.
- [x] Maniglia apri/chiudi pannello: a pannello aperto diventa un pulsante
      tondo staccato a destra del pannello (non più incollata alla legenda).

## ⏳ Prossimi passi

- [ ] Estendere il dataset agli isotopi naturali di più elementi (o tutti).
- [ ] Eventuale rappresentazione semplificata/LOD per nuclei molto pesanti
      se il numero di istanze diventa un problema su mobile.
- [ ] Valutare abbondanze come intervallo min/max (CIAAW) per H, C, O…
      dove variano in natura, mostrando però un valore singolo in UI.
- [ ] Tooltip/inset hover: mostrare anche l'isotopo principale?

Fonti: CIAAW Isotopic Compositions
(https://www.ciaaw.org/isotopic-abundances.htm), IAEA LiveChart
(https://www-nds.iaea.org/relnsd/vcharthtml/VChartHTML.html).
