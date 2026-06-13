export type Category =
  | 'nonmetallo-reattivo'
  | 'gas-nobile'
  | 'metallo-alcalino'
  | 'metallo-alcalino-terroso'
  | 'metallo-transizione'
  | 'metallo-post-transizione'
  | 'semimetallo'
  | 'lantanide'
  | 'attinide'
  | 'sconosciuto'

export type Phase = 'solido' | 'liquido' | 'gassoso' | 'sconosciuto'

export type Block = 's' | 'p' | 'd' | 'f'

export interface ElementData {
  number: number
  symbol: string
  /** Nome in italiano */
  name: string
  /** Nome inglese (utile per ricerche) */
  nameEn: string
  atomicMass: number
  category: Category
  /** Gruppo IUPAC 1-18 (null per lantanidi/attinidi nel corpo interno) */
  group: number | null
  period: number
  block: Block
  /** Configurazione elettronica in notazione abbreviata */
  electronConfiguration: string
  /** Stato di aggregazione a temperatura ambiente (298 K) */
  phase: Phase
  /** Raggio atomico (calcolato) in pm */
  atomicRadius: number | null
  /** Elettronegatività (scala di Pauling) */
  electronegativity: number | null
  /** Prima energia di ionizzazione in kJ/mol */
  ionizationEnergy: number | null
  /** Densità in g/cm³ (per i gas: g/L riportato come valore relativo) */
  density: number | null
  /** Punto di fusione in K */
  meltingPoint: number | null
  /** Punto di ebollizione in K */
  boilingPoint: number | null
  /** Anno di scoperta (negativo = a.C., null = antichità/ignoto) */
  discoveryYear: number | null
  radioactive: boolean
  /** Posizione nella griglia 18x10 (1-based) */
  xpos: number
  ypos: number
}

export type TrendKey =
  | 'none'
  | 'atomicRadius'
  | 'electronegativity'
  | 'ionizationEnergy'
  | 'density'
  | 'meltingPoint'

export interface TrendConfig {
  key: TrendKey
  label: string
  unit: string
  accessor: (e: ElementData) => number | null
  /** scala logaritmica per valori con ampio range (densità, energia) */
  log?: boolean
}
