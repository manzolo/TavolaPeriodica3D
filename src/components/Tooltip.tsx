import { useEffect, useState } from 'react'
import type { ElementData } from '../data/types'
import { CATEGORY_META, PHASE_LABEL } from '../data/elements'
import { electronsPerShell } from '../utils/electronConfig'
import { useI18n } from '../i18n'

export function Tooltip({ element }: { element: ElementData | null }) {
  const { t, lang } = useI18n()
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  if (!element) return null

  const meta = CATEGORY_META[element.category]
  const shells = electronsPerShell(element.number).join(' · ')

  // posiziona evitando i bordi
  const offset = 18
  const flipX = pos.x > window.innerWidth - 280
  const flipY = pos.y > window.innerHeight - 220
  const style: React.CSSProperties = {
    left: flipX ? pos.x - 260 - offset : pos.x + offset,
    top: flipY ? pos.y - 200 - offset : pos.y + offset,
    borderColor: meta.color,
  }

  return (
    <div className="tooltip" style={style}>
      <div className="tooltip__head">
        <span className="tooltip__num">{element.number}</span>
        <span className="tooltip__sym" style={{ color: meta.color }}>
          {element.symbol}
        </span>
        <span className="tooltip__name">{lang === 'it' ? element.name : element.nameEn}</span>
      </div>
      <div className="tooltip__cat" style={{ color: meta.color }}>
        {meta.label}
        {element.radioactive && <span className="tooltip__radio">☢ {t('radioactive')}</span>}
      </div>
      <dl className="tooltip__grid">
        <dt>{t('atomicMass')}</dt>
        <dd>{element.atomicMass} u</dd>
        <dt>{t('electronConfig')}</dt>
        <dd className="mono">{element.electronConfiguration}</dd>
        <dt>{t('phase')}</dt>
        <dd>{PHASE_LABEL[element.phase]}</dd>
        <dt>{t('shells')}</dt>
        <dd className="mono">{shells}</dd>
      </dl>
    </div>
  )
}
