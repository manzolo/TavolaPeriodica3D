import { useEffect, useRef, useState } from 'react'
import { getActiveNav } from '../three/navStore'
import { useI18n } from '../i18n'

/** Spostamento per tick (~60 fps) tenendo premuto */
const ROT = 0.025 // radianti (modalità 3D)
const PAN = 0.012 // frazione della distanza (modalità 2D)
const ZOOM_IN = 0.985
const ZOOM_OUT = 1 / ZOOM_IN

type Mode = 'rotate' | 'pan'

interface Props {
  visible: boolean
}

/**
 * D-pad di navigazione accessibile: muove e zooma la scena 3D attiva senza
 * dover trascinare/scrollare (utile su touch e per accessibilità da tastiera).
 * Agisce sul target a priorità più alta registrato in navStore: l'atomo quando
 * il pannello dettaglio è aperto, altrimenti la tavola.
 *
 * Il pulsante centrale commuta tra spostamento 3D (rotazione orbitale) e
 * spostamento 2D (pan nel piano dello schermo).
 */
export function NavPad({ visible }: Props) {
  const { t } = useI18n()
  const raf = useRef<number | null>(null)
  const [mode, setMode] = useState<Mode>('rotate')
  // la modalità corrente serve dentro le closure del loop rAF
  const modeRef = useRef<Mode>(mode)
  modeRef.current = mode

  // ferma l'eventuale loop quando il pad si chiude o si smonta
  useEffect(() => {
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function stop() {
    if (raf.current != null) cancelAnimationFrame(raf.current)
    raf.current = null
  }

  /** Tieni premuto → ripete l'azione a ogni frame */
  function startHold(action: () => void) {
    stop()
    const loop = () => {
      action()
      raf.current = requestAnimationFrame(loop)
    }
    action()
    raf.current = requestAnimationFrame(loop)
  }

  // le frecce ruotano (3D) o traslano (2D) a seconda della modalità
  const up = () =>
    modeRef.current === 'rotate' ? getActiveNav()?.rotate(0, -ROT) : getActiveNav()?.pan(0, PAN)
  const down = () =>
    modeRef.current === 'rotate' ? getActiveNav()?.rotate(0, ROT) : getActiveNav()?.pan(0, -PAN)
  const left = () =>
    modeRef.current === 'rotate' ? getActiveNav()?.rotate(-ROT, 0) : getActiveNav()?.pan(-PAN, 0)
  const right = () =>
    modeRef.current === 'rotate' ? getActiveNav()?.rotate(ROT, 0) : getActiveNav()?.pan(PAN, 0)
  const zoomIn = () => getActiveNav()?.zoom(ZOOM_IN)
  const zoomOut = () => getActiveNav()?.zoom(ZOOM_OUT)
  const toggleMode = () => {
    stop()
    setMode((m) => (m === 'rotate' ? 'pan' : 'rotate'))
  }

  if (!visible) return null

  /** props comuni a un pulsante "tieni premuto" (pointer) + step da tastiera */
  const hold = (action: () => void) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      startHold(action)
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    // da tastiera Invio/Spazio fanno un singolo passo (no auto-repeat doppio)
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        action()
      }
    },
  })

  return (
    <div className="navpad" role="group" aria-label={t('navTitle')} data-mode={mode}>
      <button className="navpad__btn navpad__up" aria-label={t('navUp')} {...hold(up)}>
        ↑
      </button>
      <button className="navpad__btn navpad__left" aria-label={t('navLeft')} {...hold(left)}>
        ←
      </button>
      <button
        className="navpad__btn navpad__center"
        aria-label={t('navToggleMode')}
        aria-pressed={mode === 'pan'}
        title={mode === 'rotate' ? t('navMode3D') : t('navMode2D')}
        onClick={toggleMode}
      >
        {mode === 'rotate' ? '3D' : '2D'}
      </button>
      <button className="navpad__btn navpad__right" aria-label={t('navRight')} {...hold(right)}>
        →
      </button>
      <button className="navpad__btn navpad__down" aria-label={t('navDown')} {...hold(down)}>
        ↓
      </button>
      <button
        className="navpad__btn navpad__zoomout"
        aria-label={t('navZoomOut')}
        {...hold(zoomOut)}
      >
        −
      </button>
      <button
        className="navpad__btn navpad__zoomin"
        aria-label={t('navZoomIn')}
        {...hold(zoomIn)}
      >
        +
      </button>
    </div>
  )
}
