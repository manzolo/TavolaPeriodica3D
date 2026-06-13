import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { PeriodicTable3D, type Filters } from './PeriodicTable3D'
import type { ElementData, TrendKey } from '../data/types'

interface Props {
  trend: TrendKey
  filters: Filters
  showOrbits: boolean
  hovered: ElementData | null
  selected: ElementData | null
  compare: number[]
  resetSignal: number
  onHover: (e: ElementData | null) => void
  onClick: (e: ElementData) => void
  onBackgroundClick: () => void
}

const CAMERA_HOME = new THREE.Vector3(0, 0, 19)

function CameraRig({ resetSignal }: { resetSignal: number }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()

  useEffect(() => {
    camera.position.copy(CAMERA_HOME)
    controls.current?.target.set(0, 0, 0)
    controls.current?.update()
  }, [resetSignal, camera])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={6}
      maxDistance={45}
      maxPolarAngle={Math.PI}
      rotateSpeed={0.7}
      zoomSpeed={0.9}
    />
  )
}

export function Scene(props: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: CAMERA_HOME.toArray(), fov: 50, near: 0.1, far: 200 }}
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
          showOrbits={props.showOrbits}
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
