import type { ElementData } from '../data/types'
import { CATEGORY_META } from '../data/elements'
import { useI18n } from '../i18n'

interface Props {
  elements: ElementData[]
  onRemove: (n: number) => void
  onClear: () => void
}

export function ComparePanel({ elements, onRemove, onClear }: Props) {
  const { t, lang } = useI18n()
  if (elements.length === 0) return null

  const na = t('unknown')
  const rows: Array<[string, (e: ElementData) => string]> = [
    [t('atomicMass'), (e) => `${e.atomicMass} u`],
    [t('atomicRadius'), (e) => (e.atomicRadius != null ? `${e.atomicRadius} pm` : na)],
    [t('electronegativity'), (e) => (e.electronegativity != null ? `${e.electronegativity}` : na)],
    [t('ionizationEnergy'), (e) => (e.ionizationEnergy != null ? `${e.ionizationEnergy}` : na)],
    [t('density'), (e) => (e.density != null ? `${e.density}` : na)],
    [t('meltingPoint'), (e) => (e.meltingPoint != null ? `${e.meltingPoint} K` : na)],
    [t('boilingPoint'), (e) => (e.boilingPoint != null ? `${e.boilingPoint} K` : na)],
  ]

  return (
    <div className="panel compare">
      <div className="compare__head">
        <h3 className="controls__title">{t('compare')}</h3>
        <button className="compare__clear" onClick={onClear}>
          {t('close')}
        </button>
      </div>

      <div className="compare__cards">
        {elements.map((e) => {
          const meta = CATEGORY_META[e.category]
          return (
            <div key={e.number} className="compare__card" style={{ borderColor: meta.color }}>
              <button className="compare__remove" onClick={() => onRemove(e.number)}>
                ✕
              </button>
              <div className="compare__sym" style={{ color: meta.color }}>
                {e.symbol}
              </div>
              <div className="compare__name">{lang === 'it' ? e.name : e.nameEn}</div>
              <div className="compare__num">#{e.number}</div>
            </div>
          )
        })}
      </div>

      {elements.length === 2 && (
        <table className="compare__table">
          <tbody>
            {rows.map(([label, get]) => (
              <tr key={label}>
                <td className="compare__a">{get(elements[0])}</td>
                <th>{label}</th>
                <td className="compare__b">{get(elements[1])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {elements.length < 2 && <p className="compare__hint">{t('compareHint')}</p>}
    </div>
  )
}
