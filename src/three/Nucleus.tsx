import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Colori dei nucleoni (riusati anche dalla legenda nel pannello) */
export const PROTON_COLOR = '#ff4d6d'
export const NEUTRON_COLOR = '#8fa6b5'

interface Props {
  protons: number
  neutrons: number
  /** colore accento dell'elemento (per la luce interna) */
  accent: string
}

/**
 * Nucleo 3D: protoni e neutroni impacchettati in un grappolo sferico.
 * Usa `instancedMesh` (due sole draw call) così regge anche i ~238 nucleoni
 * dell'uranio. La dimensione dei nucleoni e del grappolo si adatta al numero
 * di massa, restando sempre più piccola della prima shell elettronica.
 */
export function Nucleus({ protons, neutrons, accent }: Props) {
  const group = useRef<THREE.Group>(null)
  const protonRef = useRef<THREE.InstancedMesh>(null)
  const neutronRef = useRef<THREE.InstancedMesh>(null)

  const { protonPos, neutronPos, nucleonR } = useMemo(() => {
    const N = Math.max(1, protons + neutrons)
    // nucleoni più piccoli (e grappolo più grande) man mano che A cresce
    const nucleonR = THREE.MathUtils.clamp(0.16 / Math.cbrt(N), 0.045, 0.16)
    const ballR = nucleonR * Math.cbrt(N) * 0.9
    const golden = Math.PI * (3 - Math.sqrt(5)) // angolo aureo → distribuzione a fillotassi

    const protonPos: THREE.Vector3[] = []
    const neutronPos: THREE.Vector3[] = []
    let acc = 0 // distributore "alla Bresenham": sparge i protoni in modo uniforme
    for (let i = 0; i < N; i++) {
      const t = (i + 0.5) / N
      const r = N === 1 ? 0 : ballR * Math.cbrt(t) // densità uniforme nella palla
      const phi = Math.acos(1 - 2 * t)
      const theta = golden * i
      const p = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      )
      acc += protons
      if (acc >= N) {
        acc -= N
        protonPos.push(p)
      } else {
        neutronPos.push(p)
      }
    }
    return { protonPos, neutronPos, nucleonR }
  }, [protons, neutrons])

  // scrive le matrici di trasformazione delle istanze
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const fill = (mesh: THREE.InstancedMesh | null, pos: THREE.Vector3[]) => {
      if (!mesh) return
      pos.forEach((p, i) => {
        m.makeTranslation(p.x, p.y, p.z)
        mesh.setMatrixAt(i, m)
      })
      mesh.count = pos.length
      mesh.instanceMatrix.needsUpdate = true
    }
    fill(protonRef.current, protonPos)
    fill(neutronRef.current, neutronPos)
  }, [protonPos, neutronPos])

  // pulsazione leggera per dare "vita" al nucleo
  useFrame((state) => {
    if (!group.current) return
    group.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.03)
  })

  return (
    <group ref={group}>
      {/* key sul conteggio: rialloca il buffer quando cambia isotopo/elemento */}
      <instancedMesh
        key={`p${protonPos.length}-${nucleonR.toFixed(3)}`}
        ref={protonRef}
        args={[undefined, undefined, Math.max(1, protonPos.length)]}
      >
        <sphereGeometry args={[nucleonR, 12, 12]} />
        <meshStandardMaterial
          color={PROTON_COLOR}
          emissive={PROTON_COLOR}
          emissiveIntensity={0.9}
          roughness={0.45}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh
        key={`n${neutronPos.length}-${nucleonR.toFixed(3)}`}
        ref={neutronRef}
        args={[undefined, undefined, Math.max(1, neutronPos.length)]}
      >
        <sphereGeometry args={[nucleonR, 12, 12]} />
        <meshStandardMaterial
          color={NEUTRON_COLOR}
          emissive={NEUTRON_COLOR}
          emissiveIntensity={0.45}
          roughness={0.55}
          toneMapped={false}
        />
      </instancedMesh>

      <pointLight color={accent} intensity={2} distance={6} />
    </group>
  )
}
