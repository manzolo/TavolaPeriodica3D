import * as THREE from 'three'
import type { ElementData, TrendConfig, TrendKey } from '../data/types'
import { ELEMENTS } from '../data/elements'

/** Definizione delle tendenze visualizzabili */
export const TRENDS: Record<Exclude<TrendKey, 'none'>, TrendConfig> = {
  atomicRadius: {
    key: 'atomicRadius',
    label: 'trend_atomicRadius',
    unit: 'pm',
    accessor: (e) => e.atomicRadius,
  },
  electronegativity: {
    key: 'electronegativity',
    label: 'trend_electronegativity',
    unit: 'χ',
    accessor: (e) => e.electronegativity,
  },
  ionizationEnergy: {
    key: 'ionizationEnergy',
    label: 'trend_ionizationEnergy',
    unit: 'kJ/mol',
    accessor: (e) => e.ionizationEnergy,
    // He (2372) allunga la scala: senza correzione il 90% degli elementi
    // resta nella fascia bassa. gamma<1 apre il "grumo" dei valori piccoli.
    gamma: 0.45,
  },
  density: {
    key: 'density',
    label: 'trend_density',
    unit: 'g/cm³',
    accessor: (e) => e.density,
    // scala lineare (i gas restano in fondo) + gamma per distanziare la
    // grande maggioranza di solidi/liquidi che altrimenti si confonde.
    gamma: 0.65,
  },
  meltingPoint: {
    key: 'meltingPoint',
    label: 'trend_meltingPoint',
    unit: 'K',
    accessor: (e) => e.meltingPoint,
  },
}

/** Range [min,max] di una tendenza, calcolato una sola volta */
const rangeCache = new Map<TrendKey, { min: number; max: number }>()

export function trendRange(key: Exclude<TrendKey, 'none'>): { min: number; max: number } {
  if (rangeCache.has(key)) return rangeCache.get(key)!
  const cfg = TRENDS[key]
  let min = Infinity
  let max = -Infinity
  for (const e of ELEMENTS) {
    const v = cfg.accessor(e)
    if (v == null) continue
    const x = cfg.log ? Math.log10(v) : v
    if (x < min) min = x
    if (x > max) max = x
  }
  const r = { min, max }
  rangeCache.set(key, r)
  return r
}

/**
 * Gradiente scientifico "viridis-like" (blu/viola → verde → giallo).
 * t in [0,1].
 */
const GRADIENT_STOPS: Array<[number, THREE.Color]> = [
  [0.0, new THREE.Color('#2b0a4a')],
  [0.25, new THREE.Color('#1f5fa6')],
  [0.5, new THREE.Color('#21a08a')],
  [0.75, new THREE.Color('#8fd14f')],
  [1.0, new THREE.Color('#fde725')],
]

export function gradientColor(t: number): THREE.Color {
  const x = Math.max(0, Math.min(1, t))
  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    const [t0, c0] = GRADIENT_STOPS[i]
    const [t1, c1] = GRADIENT_STOPS[i + 1]
    if (x >= t0 && x <= t1) {
      const local = (x - t0) / (t1 - t0)
      return c0.clone().lerp(c1, local)
    }
  }
  return GRADIENT_STOPS[GRADIENT_STOPS.length - 1][1].clone()
}

export function gradientCss(t: number): string {
  return '#' + gradientColor(t).getHexString()
}

/** Valore normalizzato [0,1] di un elemento per una tendenza, o null se manca il dato */
export function normalizedTrend(
  e: ElementData,
  key: Exclude<TrendKey, 'none'>,
): number | null {
  const cfg = TRENDS[key]
  const v = cfg.accessor(e)
  if (v == null) return null
  const { min, max } = trendRange(key)
  const x = cfg.log ? Math.log10(v) : v
  if (max === min) return 0.5
  const t = (x - min) / (max - min)
  // gamma opzionale: rimappa t per rendere più leggibili le variazioni.
  // Math.pow preserva gli estremi (0→0, 1→1), quindi la legenda resta valida.
  return cfg.gamma != null ? Math.pow(t, cfg.gamma) : t
}
