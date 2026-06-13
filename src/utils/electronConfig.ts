/**
 * Calcola gli elettroni per shell (modello di Bohr) a partire dal numero
 * atomico, riempiendo gli orbitali nell'ordine di Aufbau e raggruppando per
 * numero quantico principale n. Questo restituisce le shell corrette per la
 * stragrande maggioranza degli elementi (i conteggi per shell sono robusti
 * anche dove la configurazione fine ha eccezioni, es. Cr, Cu).
 */

// Ordine di riempimento di Aufbau: [n, l, capienza]
const AUFBAU: Array<{ n: number; capacity: number }> = [
  { n: 1, capacity: 2 }, // 1s
  { n: 2, capacity: 2 }, // 2s
  { n: 2, capacity: 6 }, // 2p
  { n: 3, capacity: 2 }, // 3s
  { n: 3, capacity: 6 }, // 3p
  { n: 4, capacity: 2 }, // 4s
  { n: 3, capacity: 10 }, // 3d
  { n: 4, capacity: 6 }, // 4p
  { n: 5, capacity: 2 }, // 5s
  { n: 4, capacity: 10 }, // 4d
  { n: 5, capacity: 6 }, // 5p
  { n: 6, capacity: 2 }, // 6s
  { n: 4, capacity: 14 }, // 4f
  { n: 5, capacity: 10 }, // 5d
  { n: 6, capacity: 6 }, // 6p
  { n: 7, capacity: 2 }, // 7s
  { n: 5, capacity: 14 }, // 5f
  { n: 6, capacity: 10 }, // 6d
  { n: 7, capacity: 6 }, // 7p
]

const cache = new Map<number, number[]>()

export function electronsPerShell(atomicNumber: number): number[] {
  if (cache.has(atomicNumber)) return cache.get(atomicNumber)!

  const shells: number[] = []
  let remaining = atomicNumber

  for (const orbital of AUFBAU) {
    if (remaining <= 0) break
    const placed = Math.min(orbital.capacity, remaining)
    remaining -= placed
    const idx = orbital.n - 1
    shells[idx] = (shells[idx] ?? 0) + placed
  }

  // riempi eventuali buchi con 0 e rimuovi shell vuote finali
  for (let i = 0; i < shells.length; i++) if (!shells[i]) shells[i] = 0
  while (shells.length && shells[shells.length - 1] === 0) shells.pop()

  cache.set(atomicNumber, shells)
  return shells
}

/** Numero di shell occupate = numero di orbite da disegnare */
export function shellCount(atomicNumber: number): number {
  return electronsPerShell(atomicNumber).length
}
