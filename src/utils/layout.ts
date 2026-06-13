import type { ElementData } from '../data/types'

/** Spaziatura della griglia in unità di scena */
export const CELL = 1.15

/** Larghezza/altezza griglia per centratura */
const COLS = 18
const ROWS = 10

/**
 * Converte la posizione di griglia (1-based) in coordinate mondo centrate.
 * X cresce verso destra, Y verso l'alto (ypos cresce verso il basso → invertito).
 * Le due righe del blocco f (ypos 9-10) ricevono un piccolo gap verticale.
 */
export function worldPosition(e: ElementData): [number, number, number] {
  const x = (e.xpos - 1 - (COLS - 1) / 2) * CELL
  let row = e.ypos
  // gap visivo fra corpo principale (1-7) e blocco f (9-10)
  if (e.ypos >= 9) row = e.ypos - 0.4
  const y = -((row - 1) - (ROWS - 1) / 2) * CELL
  return [x, y, 0]
}
