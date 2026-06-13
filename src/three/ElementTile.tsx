import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import type { ElementData } from '../data/types'
import { ElectronOrbits } from './ElectronOrbits'

interface Props {
  element: ElementData
  position: [number, number, number]
  color: string
  dimmed: boolean
  active: boolean
  selected: boolean
  inCompare: boolean
  showOrbits: boolean
  onHover: (e: ElementData | null) => void
  onClick: (e: ElementData) => void
}

const TILE = 1.0
const DEPTH = 0.32

export function ElementTile({
  element,
  position,
  color,
  dimmed,
  active,
  selected,
  inCompare,
  showOrbits,
  onHover,
  onClick,
}: Props) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const [hovered, setHovered] = useState(false)

  const targetColor = useRef(new THREE.Color(color))
  targetColor.current.set(color)

  useFrame(() => {
    if (!group.current) return
    const lift = active ? 0.9 : inCompare ? 0.45 : 0
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, lift, 0.18)
    const s = active ? 1.12 : 1
    const cur = group.current.scale.x
    const ns = THREE.MathUtils.lerp(cur, s, 0.18)
    group.current.scale.setScalar(ns)

    if (mat.current) {
      mat.current.color.lerp(targetColor.current, 0.15)
      mat.current.emissive.lerp(targetColor.current, 0.15)
      const targetEmissive = active ? 1.1 : hovered ? 0.7 : dimmed ? 0.04 : 0.32
      mat.current.emissiveIntensity = THREE.MathUtils.lerp(
        mat.current.emissiveIntensity,
        targetEmissive,
        0.15,
      )
      const targetOpacity = dimmed && !active ? 0.18 : 1
      mat.current.opacity = THREE.MathUtils.lerp(mat.current.opacity, targetOpacity, 0.15)
    }
  })

  const textOpacity = dimmed && !active ? 0.25 : 1

  return (
    <group position={position}>
      <group ref={group}>
        <RoundedBox
          args={[TILE, TILE, DEPTH]}
          radius={0.08}
          smoothness={3}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            onHover(element)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHovered(false)
            onHover(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            onClick(element)
          }}
        >
          <meshStandardMaterial
            ref={mat}
            color={color}
            emissive={color}
            emissiveIntensity={0.32}
            metalness={0.3}
            roughness={0.45}
            transparent
            opacity={1}
            toneMapped={false}
          />
        </RoundedBox>

        {/* contorno selezione/confronto */}
        {(selected || inCompare) && (
          <lineSegments scale={1.06}>
            <edgesGeometry args={[new THREE.BoxGeometry(TILE, TILE, DEPTH)]} />
            <lineBasicMaterial
              color={selected ? '#ffffff' : '#00e5ff'}
              transparent
              opacity={0.9}
              toneMapped={false}
            />
          </lineSegments>
        )}

        {/* Numero atomico */}
        <Text
          position={[-TILE / 2 + 0.16, TILE / 2 - 0.16, DEPTH / 2 + 0.01]}
          fontSize={0.16}
          color="#0a0c12"
          anchorX="left"
          anchorY="top"
          fillOpacity={textOpacity * 0.85}
        >
          {element.number}
        </Text>

        {/* Simbolo */}
        <Text
          position={[0, -0.02, DEPTH / 2 + 0.01]}
          fontSize={0.42}
          color="#06080d"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
          fillOpacity={textOpacity}
        >
          {element.symbol}
        </Text>

        {/* Massa atomica */}
        <Text
          position={[0, -TILE / 2 + 0.13, DEPTH / 2 + 0.01]}
          fontSize={0.1}
          color="#0a0c12"
          anchorX="center"
          anchorY="bottom"
          fillOpacity={textOpacity * 0.7}
        >
          {element.atomicMass.toFixed(element.atomicMass < 100 ? 2 : 1)}
        </Text>
      </group>

      {/* Orbite elettroniche per l'elemento attivo */}
      {showOrbits && active && (
        <group position={[0, 0, 2.4]}>
          <ElectronOrbits atomicNumber={element.number} color={color} scale={0.92} />
        </group>
      )}
    </group>
  )
}
