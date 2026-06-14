import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { PeriodicTable3D, type Filters } from './PeriodicTable3D'
import { registerNav, unregisterNav, makeOrbitNavApi } from './navStore'
import type { ElementData, TrendKey } from '../data/types'

interface Props {
  trend: TrendKey
  filters: Filters
  hovered: ElementData | null
  selected: ElementData | null
  compare: number[]
  resetSignal: number
  onHover: (e: ElementData | null) => void
  onClick: (e: ElementData) => void
  onBackgroundClick: () => void
}

// Ingombro della tavola in unità di scena (18 colonne, ~10 righe)
const TABLE_W = 21
const TABLE_H = 12.5

/** Distanza di camera che fa entrare tutta la tavola, in base all'aspect ratio */
function fitDistance(aspect: number, fovDeg: number): number {
  const fov = (fovDeg * Math.PI) / 180
  const dH = TABLE_H / 2 / Math.tan(fov / 2)
  const dW = TABLE_W / 2 / (Math.tan(fov / 2) * aspect)
  const margin = aspect < 0.85 ? 1.06 : 1.16 // su mobile portrait meno margine
  return Math.max(dH, dW) * margin
}

function CameraRig({ resetSignal }: { resetSignal: number }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera, size, scene } = useThree()

  const frame = () => {
    const aspect = size.width / size.height
    const fov = (camera as THREE.PerspectiveCamera).fov ?? 50
    const d = fitDistance(aspect, fov)
    // su desktop sposta la vista a destra così il pannello sinistro
    // non copre il gruppo 1 (metalli alcalini)
    const offsetX = size.width > 760 ? -1.8 : 0
    camera.position.set(offsetX, 0, d)
    controls.current?.target.set(offsetX, 0, 0)
    controls.current?.update()
    // fog adattiva: su mobile portrait la distanza di fit è grande, quindi
    // ancoriamo la nebbia oltre la tavola (a ~d) per non farla annerire
    const fog = scene.fog as THREE.Fog | null
    if (fog && (fog as THREE.Fog).isFog) {
      fog.near = d + 8
      fog.far = d + 55
    }
  }

  // reframe su reset e quando cambia la dimensione del viewport
  useEffect(frame, [resetSignal, size.width, size.height])

  // tieni un riferimento aggiornato a frame() per il reset dal pad
  const frameRef = useRef(frame)
  frameRef.current = frame

  // registra l'API di navigazione per il D-pad (priorità bassa = tavola)
  useEffect(() => {
    if (!controls.current) return
    const api = makeOrbitNavApi(
      controls.current,
      camera as THREE.PerspectiveCamera,
      () => frameRef.current(),
    )
    const id = registerNav(0, api)
    return () => unregisterNav(id)
  }, [camera])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={70}
      maxPolarAngle={Math.PI}
      rotateSpeed={0.65}
      zoomSpeed={1}
      panSpeed={0.8}
      touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
    />
  )
}

export function Scene(props: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 22], fov: 50, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: false }}
      onPointerMissed={() => props.onBackgroundClick()}
    >
      <color attach="background" args={['#05060a']} />
      <fog attach="fog" args={['#05060a', 28, 60]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[8, 12, 14]} intensity={1.1} />
      <pointLight position={[-14, -8, 10]} intensity={0.6} color="#3a6bff" />

      <Stars radius={80} depth={50} count={2600} factor={3.5} saturation={0} fade speed={0.6} />

      <Suspense fallback={null}>
        <PeriodicTable3D
          trend={props.trend}
          filters={props.filters}
          hovered={props.hovered}
          selected={props.selected}
          compare={props.compare}
          onHover={props.onHover}
          onClick={props.onClick}
        />
      </Suspense>

      <CameraRig resetSignal={props.resetSignal} />
    </Canvas>
  )
}
