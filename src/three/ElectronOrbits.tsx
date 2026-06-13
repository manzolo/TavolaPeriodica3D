import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { electronsPerShell } from '../utils/electronConfig'

interface Props {
  atomicNumber: number
  /** colore accento (esadecimale) */
  color: string
  scale?: number
}

const NUCLEUS_COLOR = '#ff4d6d'

/**
 * Modello di Bohr semplificato: una traiettoria circolare per ogni shell,
 * con il numero corretto di elettroni per shell, animati in rotazione.
 * Ogni shell è leggermente inclinata per dare profondità 3D.
 */
export function ElectronOrbits({ atomicNumber, color, scale = 1 }: Props) {
  const shells = useMemo(() => electronsPerShell(atomicNumber), [atomicNumber])
  const group = useRef<THREE.Group>(null)

  // dati pre-calcolati per ogni shell: raggio, tilt, velocità, posizioni elettroni
  const shellData = useMemo(() => {
    return shells.map((count, i) => {
      const radius = 0.55 + i * 0.42
      const tilt = (i * Math.PI) / 7 + (i % 2 ? 0.4 : -0.3)
      const yaw = (i * Math.PI) / 5
      const speed = 1.4 / (i + 1) + 0.3
      const dir = i % 2 === 0 ? 1 : -1
      const phase0 = (i * Math.PI) / 6
      return { count, radius, tilt, yaw, speed: speed * dir, phase0 }
    })
  }, [shells])

  // ref agli elettroni per animarli
  const electronRefs = useRef<THREE.Mesh[][]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (let s = 0; s < shellData.length; s++) {
      const sd = shellData[s]
      const arr = electronRefs.current[s]
      if (!arr) continue
      for (let e = 0; e < sd.count; e++) {
        const mesh = arr[e]
        if (!mesh) continue
        const angle = sd.phase0 + t * sd.speed + (e / sd.count) * Math.PI * 2
        mesh.position.set(Math.cos(angle) * sd.radius, Math.sin(angle) * sd.radius, 0)
      }
    }
    if (group.current) group.current.rotation.y += 0.0015
  })

  return (
    <group ref={group} scale={scale}>
      {/* Nucleo pulsante */}
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={NUCLEUS_COLOR}
          emissive={NUCLEUS_COLOR}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={color} intensity={2} distance={6} />

      {shellData.map((sd, s) => (
        <group key={s} rotation={[sd.tilt, sd.yaw, 0]}>
          <OrbitRing radius={sd.radius} color={color} />
          {Array.from({ length: sd.count }).map((_, e) => (
            <mesh
              key={e}
              ref={(m) => {
                if (!electronRefs.current[s]) electronRefs.current[s] = []
                if (m) electronRefs.current[s][e] = m
              }}
            >
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  const lineObj = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const seg = 96
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0))
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts)
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.35,
      toneMapped: false,
    })
    return new THREE.Line(geom, mat)
  }, [radius, color])

  return <primitive object={lineObj} />
}
