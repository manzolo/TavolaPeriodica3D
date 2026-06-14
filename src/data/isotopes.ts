import type { IsotopeData } from './types'

/**
 * Isotopi (nuclidi) per i primi elementi "pilota" — prima fetta del modello
 * degli isotopi. Non è una carta completa dei nuclidi: contiene gli isotopi
 * naturali di alcuni elementi didatticamente significativi più qualche
 * radioisotopo noto (³H, ¹⁴C, ²³⁵U…).
 *
 * Convenzioni:
 * - `abundance` è la frazione [0..1] nella miscela isotopica naturale terrestre;
 *   `null` significa "solo tracce / sintetico".
 * - i neutroni si calcolano come massNumber − numero atomico (vedi IsotopeData).
 *
 * Fonti: composizioni isotopiche CIAAW 2021/2024; emivite IAEA LiveChart.
 * Valori didattici, arrotondati: per usi reali consultare le fonti primarie.
 */

/** Anno giuliano in secondi (365,25 giorni) — base per le emivite */
const YEAR = 365.25 * 24 * 3600

export const ISOTOPES: Record<number, IsotopeData[]> = {
  // Idrogeno
  1: [
    { massNumber: 1, abundance: 0.999885, stable: true, halfLifeSeconds: null, name: 'Prozio', nameEn: 'Protium' },
    { massNumber: 2, abundance: 0.000115, stable: true, halfLifeSeconds: null, name: 'Deuterio', nameEn: 'Deuterium' },
    { massNumber: 3, abundance: null, stable: false, halfLifeSeconds: 12.32 * YEAR, name: 'Trizio', nameEn: 'Tritium' },
  ],
  // Carbonio
  6: [
    { massNumber: 12, abundance: 0.9893, stable: true, halfLifeSeconds: null },
    { massNumber: 13, abundance: 0.0107, stable: true, halfLifeSeconds: null },
    { massNumber: 14, abundance: null, stable: false, halfLifeSeconds: 5700 * YEAR, name: 'Radiocarbonio', nameEn: 'Radiocarbon' },
  ],
  // Ossigeno
  8: [
    { massNumber: 16, abundance: 0.99757, stable: true, halfLifeSeconds: null },
    { massNumber: 17, abundance: 0.00038, stable: true, halfLifeSeconds: null },
    { massNumber: 18, abundance: 0.00205, stable: true, halfLifeSeconds: null },
  ],
  // Uranio — nessun isotopo stabile
  92: [
    { massNumber: 234, abundance: 0.000054, stable: false, halfLifeSeconds: 245500 * YEAR },
    { massNumber: 235, abundance: 0.007204, stable: false, halfLifeSeconds: 7.04e8 * YEAR },
    { massNumber: 238, abundance: 0.992742, stable: false, halfLifeSeconds: 4.468e9 * YEAR },
  ],
}

/** Cifre in apice per la notazione isotopica (es. ¹⁴C) */
const SUPERSCRIPTS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']

/** Converte un numero in cifre apice: 14 → "¹⁴" */
export function toSuperscript(n: number): string {
  return String(n)
    .split('')
    .map((d) => SUPERSCRIPTS[Number(d)] ?? d)
    .join('')
}

/** Notazione completa dell'isotopo: massNumber + simbolo, es. "¹⁴C" */
export function isotopeNotation(massNumber: number, symbol: string): string {
  return `${toSuperscript(massNumber)}${symbol}`
}
