import type { ElementData } from '../data/types'
import { CATEGORY_META, PHASE_LABEL, BLOCK_LABEL } from '../data/elements'
import { electronsPerShell } from '../utils/electronConfig'
import { useI18n } from '../i18n'

interface Props {
  element: ElementData | null
  inCompare: boolean
  onClose: () => void
  onToggleCompare: (e: ElementData) => void
}

function fmtYear(y: number | null, t: (k: any) => string): string {
  if (y == null) return t('antiquity')
  if (y < 0) return `${Math.abs(y)} ${t('bc')}`
  return String(y)
}

export function DetailPanel({ element, inCompare, onClose, onToggleCompare }: Props) {
  const { t, lang } = useI18n()
  if (!element) return null

  const meta = CATEGORY_META[element.category]
  const na = t('unknown')
  const shells = electronsPerShell(element.number).join(' · ')

  const rows: Array<[string, string]> = [
    [t('atomicNumber'), String(element.number)],
    [t('atomicMass'), `${element.atomicMass} u`],
    [t('category'), meta.label],
    [t('block'), BLOCK_LABEL[element.block]],
    [t('group'), element.group ? String(element.group) : '—'],
    [t('period'), String(element.period)],
    [t('phase'), PHASE_LABEL[element.phase]],
    [t('electronConfig'), element.electronConfiguration],
    [t('shells'), shells],
    [t('atomicRadius'), element.atomicRadius != null ? `${element.atomicRadius} pm` : na],
    [
      t('electronegativity'),
      element.electronegativity != null ? `${element.electronegativity} χ` : na,
    ],
    [
      t('ionizationEnergy'),
      element.ionizationEnergy != null ? `${element.ionizationEnergy} kJ/mol` : na,
    ],
    [t('density'), element.density != null ? `${element.density} g/cm³` : na],
    [
      t('meltingPoint'),
      element.meltingPoint != null ? `${element.meltingPoint} K` : na,
    ],
    [
      t('boilingPoint'),
      element.boilingPoint != null ? `${element.boilingPoint} K` : na,
    ],
    [t('discoveryYear'), fmtYear(element.discoveryYear, t)],
    [t('radioactive'), element.radioactive ? `☢ ${t('yes')}` : t('no')],
  ]

  return (
    <aside className="detail" style={{ ['--accent' as any]: meta.color }}>
      <button className="detail__close" onClick={onClose} aria-label={t('close')}>
        ✕
      </button>

      <div className="detail__hero">
        <div className="detail__symbol">{element.symbol}</div>
        <div className="detail__herometa">
          <div className="detail__num">{element.number}</div>
          <h2 className="detail__name">{lang === 'it' ? element.name : element.nameEn}</h2>
          <div className="detail__nameen">{lang === 'it' ? element.nameEn : element.name}</div>
          <div className="detail__cat">{meta.label}</div>
        </div>
      </div>

      <dl className="detail__table">
        {rows.map(([k, v]) => (
          <div className="detail__row" key={k}>
            <dt>{k}</dt>
            <dd className={k === t('electronConfig') || k === t('shells') ? 'mono' : ''}>{v}</dd>
          </div>
        ))}
      </dl>

      <button
        className={`detail__compare ${inCompare ? 'is-active' : ''}`}
        onClick={() => onToggleCompare(element)}
      >
        {inCompare ? t('removeFromCompare') : t('selectForCompare')}
      </button>
    </aside>
  )
}
