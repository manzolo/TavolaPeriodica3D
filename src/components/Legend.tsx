import type { Category, TrendKey } from '../data/types'
import { CATEGORY_META } from '../data/elements'
import { TRENDS, gradientCss, trendRange } from '../utils/colorScales'
import { useI18n } from '../i18n'

export function Legend({ trend }: { trend: TrendKey }) {
  const { t, tCategory } = useI18n()

  if (trend === 'none') {
    const cats = Object.entries(CATEGORY_META) as Array<[Category, { color: string }]>
    return (
      <div className="panel legend">
        <h3 className="controls__title">{t('legend')}</h3>
        <ul className="legend__list">
          {cats.map(([key, meta]) => (
            <li key={key} className="legend__item">
              <span className="legend__swatch" style={{ background: meta.color }} />
              {tCategory(key)}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const cfg = TRENDS[trend]
  const { min, max } = trendRange(trend)
  const lo = cfg.log ? Math.pow(10, min) : min
  const hi = cfg.log ? Math.pow(10, max) : max
  const steps = 24
  const gradient = `linear-gradient(to right, ${Array.from({ length: steps }, (_, i) =>
    gradientCss(i / (steps - 1)),
  ).join(', ')})`

  const fmt = (v: number) =>
    v >= 1000 ? v.toFixed(0) : v >= 10 ? v.toFixed(0) : v.toFixed(2)

  return (
    <div className="panel legend">
      <h3 className="controls__title">
        {t(cfg.label as any)} <span className="legend__unit">({cfg.unit})</span>
      </h3>
      <div className="legend__bar" style={{ background: gradient }} />
      <div className="legend__scale">
        <span>{fmt(lo)}</span>
        <span className="legend__mid">{t('low')} → {t('high')}</span>
        <span>{fmt(hi)}</span>
      </div>
      <div className="legend__hint">{t('dimmedHint')}</div>
    </div>
  )
}
