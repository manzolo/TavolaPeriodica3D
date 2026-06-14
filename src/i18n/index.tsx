import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Block, Category, Phase } from '../data/types'

export type Lang = 'it' | 'en'

type Dict = Record<string, { it: string; en: string }>

/** Etichette categorie (IT/EN) — i colori restano in CATEGORY_META */
const CATEGORY_I18N: Record<Category, { it: string; en: string }> = {
  'metallo-alcalino': { it: 'Metallo alcalino', en: 'Alkali metal' },
  'metallo-alcalino-terroso': { it: 'Metallo alcalino terroso', en: 'Alkaline earth metal' },
  'metallo-transizione': { it: 'Metallo di transizione', en: 'Transition metal' },
  'metallo-post-transizione': { it: 'Metallo post-transizione', en: 'Post-transition metal' },
  semimetallo: { it: 'Semimetallo', en: 'Metalloid' },
  'nonmetallo-reattivo': { it: 'Non metallo reattivo', en: 'Reactive nonmetal' },
  'gas-nobile': { it: 'Gas nobile', en: 'Noble gas' },
  lantanide: { it: 'Lantanide', en: 'Lanthanide' },
  attinide: { it: 'Attinide', en: 'Actinide' },
  sconosciuto: { it: 'Proprietà ignote', en: 'Unknown properties' },
}

const PHASE_I18N: Record<Phase, { it: string; en: string }> = {
  solido: { it: 'Solido', en: 'Solid' },
  liquido: { it: 'Liquido', en: 'Liquid' },
  gassoso: { it: 'Gassoso', en: 'Gas' },
  sconosciuto: { it: 'Sconosciuto', en: 'Unknown' },
}

const BLOCK_I18N: Record<Block, { it: string; en: string }> = {
  s: { it: 'Blocco s', en: 'Block s' },
  p: { it: 'Blocco p', en: 'Block p' },
  d: { it: 'Blocco d', en: 'Block d' },
  f: { it: 'Blocco f', en: 'Block f' },
}

/** Tutte le stringhe dell'interfaccia (IT/EN). I nomi degli elementi sono nel dataset. */
const STRINGS: Dict = {
  appTitle: { it: 'PerioOrbit 3D', en: 'PerioOrbit 3D' },
  appSubtitle: {
    it: 'Tavola periodica interattiva in 3D',
    en: 'Interactive 3D periodic table',
  },
  resetView: { it: 'Reset vista', en: 'Reset view' },
  toggleOrbits: { it: 'Orbite', en: 'Orbits' },
  showOrbits: { it: 'Mostra orbite', en: 'Show orbits' },
  hideOrbits: { it: 'Nascondi orbite', en: 'Hide orbits' },
  trends: { it: 'Tendenze', en: 'Trends' },
  filters: { it: 'Filtri', en: 'Filters' },
  legend: { it: 'Legenda', en: 'Legend' },
  category: { it: 'Categoria', en: 'Category' },
  compare: { it: 'Confronta', en: 'Compare' },
  compareHint: {
    it: 'Seleziona due elementi per confrontarli',
    en: 'Select two elements to compare',
  },
  close: { it: 'Chiudi', en: 'Close' },
  none: { it: 'Nessuna', en: 'None' },
  all: { it: 'Tutti', en: 'All' },
  block: { it: 'Blocco', en: 'Block' },
  period: { it: 'Periodo', en: 'Period' },
  group: { it: 'Gruppo', en: 'Group' },
  // proprietà
  atomicNumber: { it: 'Numero atomico', en: 'Atomic number' },
  symbol: { it: 'Simbolo', en: 'Symbol' },
  name: { it: 'Nome', en: 'Name' },
  atomicMass: { it: 'Massa atomica', en: 'Atomic mass' },
  electronConfig: { it: 'Config. elettronica', en: 'Electron config.' },
  phase: { it: 'Stato (298 K)', en: 'Phase (298 K)' },
  atomicRadius: { it: 'Raggio atomico', en: 'Atomic radius' },
  electronegativity: { it: 'Elettronegatività', en: 'Electronegativity' },
  ionizationEnergy: { it: 'Energia di ionizz.', en: 'Ionization energy' },
  density: { it: 'Densità', en: 'Density' },
  meltingPoint: { it: 'Punto di fusione', en: 'Melting point' },
  boilingPoint: { it: 'Punto di ebollizione', en: 'Boiling point' },
  discoveryYear: { it: 'Anno di scoperta', en: 'Discovery year' },
  radioactive: { it: 'Radioattivo', en: 'Radioactive' },
  shells: { it: 'Elettroni per shell', en: 'Electrons per shell' },
  yes: { it: 'Sì', en: 'Yes' },
  no: { it: 'No', en: 'No' },
  unknown: { it: 'n/d', en: 'n/a' },
  antiquity: { it: 'Antichità', en: 'Antiquity' },
  bc: { it: 'a.C.', en: 'BC' },
  // tendenze (label)
  trend_none: { it: 'Categoria', en: 'Category' },
  trend_atomicRadius: { it: 'Raggio atomico', en: 'Atomic radius' },
  trend_electronegativity: { it: 'Elettronegatività', en: 'Electronegativity' },
  trend_ionizationEnergy: { it: 'Energia di ionizzazione', en: 'Ionization energy' },
  trend_density: { it: 'Densità', en: 'Density' },
  trend_meltingPoint: { it: 'Temperatura di fusione', en: 'Melting temperature' },
  low: { it: 'basso', en: 'low' },
  high: { it: 'alto', en: 'high' },
  dimmedHint: {
    it: 'Gli elementi senza dato sono attenuati',
    en: 'Elements without data are dimmed',
  },
  hoverHint: {
    it: 'Passa sopra un elemento • Click per i dettagli • Trascina per ruotare',
    en: 'Hover an element • Click for details • Drag to rotate',
  },
  credits: { it: 'Fonti e licenze', en: 'Sources & licenses' },
  selectForCompare: { it: 'Aggiungi al confronto', en: 'Add to compare' },
  removeFromCompare: { it: 'Rimuovi dal confronto', en: 'Remove from compare' },
  hoverForAtom: {
    it: 'Passa sopra un elemento per vedere l’atomo',
    en: 'Hover an element to see the atom',
  },
  atomViewer: { it: 'Visualizzatore atomo', en: 'Atom viewer' },
  atomHint: {
    it: 'Trascina per ruotare • Scroll per zoom',
    en: 'Drag to rotate • Scroll to zoom',
  },
  // isotopi
  isotopes: { it: 'Isotopi', en: 'Isotopes' },
  massNumber: { it: 'Numero di massa', en: 'Mass number' },
  protons: { it: 'Protoni', en: 'Protons' },
  neutrons: { it: 'Neutroni', en: 'Neutrons' },
  abundance: { it: 'Abbondanza naturale', en: 'Natural abundance' },
  stability: { it: 'Stabilità', en: 'Stability' },
  stable: { it: 'Stabile', en: 'Stable' },
  unstable: { it: 'Radioattivo', en: 'Radioactive' },
  halfLife: { it: 'Emivita', en: 'Half-life' },
  traces: { it: 'Tracce', en: 'Traces' },
  // unità di tempo per l'emivita
  unit_s: { it: 's', en: 's' },
  unit_min: { it: 'min', en: 'min' },
  unit_h: { it: 'h', en: 'h' },
  unit_d: { it: 'giorni', en: 'days' },
  unit_y: { it: 'anni', en: 'years' },
  unit_ky: { it: 'mila anni', en: 'thousand years' },
  unit_My: { it: 'milioni di anni', en: 'million years' },
  unit_Gy: { it: 'miliardi di anni', en: 'billion years' },
}

interface I18nContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: keyof typeof STRINGS) => string
  tCategory: (c: Category) => string
  tPhase: (p: Phase) => string
  tBlock: (b: Block) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('perioorbit-lang')
    return saved === 'en' ? 'en' : 'it'
  })

  useEffect(() => {
    localStorage.setItem('perioorbit-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = (key: keyof typeof STRINGS) => STRINGS[key]?.[lang] ?? String(key)
  const tCategory = (c: Category) => CATEGORY_I18N[c][lang]
  const tPhase = (p: Phase) => PHASE_I18N[p][lang]
  const tBlock = (b: Block) => BLOCK_I18N[b][lang]

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tCategory, tPhase, tBlock }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
