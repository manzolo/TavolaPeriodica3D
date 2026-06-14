import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ElectronOrbits } from './ElectronOrbits'
import type { ElementData } from '../data/types'
import { CATEGORY_META } from '../data/elements'
import { electronsPerShell } from '../utils/electronConfig'
import { useI18n } from '../i18n'

/**
 * Canvas 3D dell'atomo, sfondo trasparente (sopra a una superficie nera),
 * inquadrato "di taglio" (camera obliqua) così le orbite si vedono come
 * ellissi con profondità. Riutilizzabile nell'inset e nel pannello dettaglio.
 *
 * `interactive`: nel pannello dettaglio abilita rotazione + zoom (scroll);
 * nell'inset di hover resta statico (non cattura il puntatore).
 */
export function AtomCanvas({
  element,
  scale = 0.78,
  massNumber,
  interactive = false,
}: {
  element: ElementData
  scale?: number
  /** numero di massa dell'isotopo da mostrare; default = massa atomica arrotondata */
  massNumber?: number
  interactive?: boolean
}) {
  const color = CATEGORY_META[element.category].color
  const protons = element.number
  const neutrons = Math.max(0, (massNumber ?? Math.round(element.atomicMass)) - protons)
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [2.6, 1.7, 6.2], fov: 42, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: interactive ? 'auto' : 'none' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 6]} intensity={0.8} />
      <group rotation={[-0.5, 0, 0]}>
        <ElectronOrbits
          key={element.number}
          atomicNumber={element.number}
          color={color}
          scale={scale}
          protons={protons}
          neutrons={neutrons}
        />
      </group>
      {interactive && (
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={14}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
          enableDamping
          dampingFactor={0.12}
        />
      )}
    </Canvas>
  )
}

interface Props {
  element: ElementData | null
  visible: boolean
}

/** Inset fluttuante mostrato durante l'hover (quando nessun dettaglio è aperto). */
export function AtomInspector({ element, visible }: Props) {
  const { t, lang } = useI18n()
  if (!visible || !element) return null

  const meta = CATEGORY_META[element.category]
  const shells = electronsPerShell(element.number)

  return (
    <div className="inspector">
      <div className="inspector__label">{t('atomViewer')}</div>
      <div className="inspector__stage">
        <AtomCanvas element={element} />
      </div>
      <div className="inspector__meta">
        <div className="inspector__sym" style={{ color: meta.color }}>
          {element.symbol}
        </div>
        <div className="inspector__info">
          <div className="inspector__name">{lang === 'it' ? element.name : element.nameEn}</div>
          <div className="inspector__shells mono">{shells.join(' · ')}</div>
        </div>
      </div>
    </div>
  )
}
