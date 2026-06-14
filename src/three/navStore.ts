import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

/**
 * Store esterno (singleton) per il D-pad di navigazione accessibile.
 *
 * Le due scene 3D (tavola e atomo) vivono in `<Canvas>` separati, con
 * reconciler React distinti: non condividono il context. Ognuna registra qui
 * la propria `NavApi` con una priorità; il pad HTML agisce sempre sul target a
 * priorità più alta presente (atomo > tavola), ottenendo il comportamento
 * "contestuale" (atomo quando il pannello dettaglio è aperto, tavola altrimenti).
 */

export interface NavApi {
  /** ruota la camera attorno al target (radianti) — spostamento "3D" */
  rotate(deltaAzimuth: number, deltaPolar: number): void
  /** trasla camera+target nel piano dello schermo — spostamento "2D" (pan) */
  pan(deltaX: number, deltaY: number): void
  /** zoom moltiplicativo della distanza: <1 avvicina, >1 allontana */
  zoom(factor: number): void
  /** reset dell'inquadratura */
  reset(): void
}

interface Entry {
  id: number
  priority: number
  api: NavApi
}

let entries: Entry[] = []
let nextId = 1

export function registerNav(priority: number, api: NavApi): number {
  const id = nextId++
  entries.push({ id, priority, api })
  return id
}

export function unregisterNav(id: number): void {
  entries = entries.filter((e) => e.id !== id)
}

/** Target attivo = priorità più alta registrata (null se nessuno). */
export function getActiveNav(): NavApi | null {
  if (entries.length === 0) return null
  return entries.reduce((best, e) => (e.priority >= best.priority ? e : best)).api
}

/**
 * Costruisce una `NavApi` che pilota direttamente la camera attorno al target
 * degli `OrbitControls`, senza dipendere da metodi interni del controllo:
 * manipola l'offset camera→target in coordinate sferiche.
 */
export function makeOrbitNavApi(
  controls: OrbitControlsImpl,
  camera: THREE.PerspectiveCamera,
  onReset: () => void,
): NavApi {
  const EPS = 0.02
  return {
    rotate(deltaAzimuth, deltaPolar) {
      const offset = camera.position.clone().sub(controls.target)
      const sph = new THREE.Spherical().setFromVector3(offset)
      sph.theta += deltaAzimuth
      sph.phi = THREE.MathUtils.clamp(
        sph.phi + deltaPolar,
        (controls.minPolarAngle ?? 0) + EPS,
        (controls.maxPolarAngle ?? Math.PI) - EPS,
      )
      offset.setFromSpherical(sph)
      camera.position.copy(controls.target).add(offset)
      controls.update()
    },
    pan(deltaX, deltaY) {
      // direzioni destra/su della camera (colonne ortonormali della matrice)
      const dist = camera.position.distanceTo(controls.target)
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0)
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1)
      const move = new THREE.Vector3()
        .addScaledVector(right, deltaX * dist)
        .addScaledVector(up, deltaY * dist)
      camera.position.add(move)
      controls.target.add(move)
      controls.update()
    },
    zoom(factor) {
      const offset = camera.position.clone().sub(controls.target)
      const dist = THREE.MathUtils.clamp(
        offset.length() * factor,
        controls.minDistance ?? 0.1,
        controls.maxDistance ?? Infinity,
      )
      offset.setLength(dist)
      camera.position.copy(controls.target).add(offset)
      controls.update()
    },
    reset() {
      onReset()
    },
  }
}
