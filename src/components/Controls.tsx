import type { Block, Category, TrendKey } from '../data/types'
import { CATEGORY_META } from '../data/elements'
import { TRENDS } from '../utils/colorScales'
import { useI18n } from '../i18n'
import type { Filters } from '../three/PeriodicTable3D'

interface Props {
  trend: TrendKey
  setTrend: (t: TrendKey) => void
  filters: Filters
  setFilters: (f: Filters) => void
}

const BLOCKS: Block[] = ['s', 'p', 'd', 'f']
const PERIODS = [1, 2, 3, 4, 5, 6, 7]
const CATEGORIES = Object.keys(CATEGORY_META) as Category[]

export function Controls({ trend, setTrend, filters, setFilters }: Props) {
  const { t, tCategory } = useI18n()
  const trendKeys = Object.keys(TRENDS) as Array<Exclude<TrendKey, 'none'>>

  return (
    <div className="panel controls">
      <section className="controls__section">
        <h3 className="controls__title">{t('trends')}</h3>
        <div className="chiprow">
          <button
            className={`chip ${trend === 'none' ? 'is-active' : ''}`}
            onClick={() => setTrend('none')}
          >
            {t('trend_none')}
          </button>
          {trendKeys.map((k) => (
            <button
              key={k}
              className={`chip ${trend === k ? 'is-active' : ''}`}
              onClick={() => setTrend(k)}
            >
              {t(TRENDS[k].label as any)}
            </button>
          ))}
        </div>
      </section>

      <section className="controls__section">
        <h3 className="controls__title">{t('filters')}</h3>

        <label className="field">
          <span>{t('category')}</span>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value as Category | 'all' })
            }
          >
            <option value="all">{t('all')}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {tCategory(c)}
              </option>
            ))}
          </select>
        </label>

        <div className="field-grid">
          <label className="field">
            <span>{t('block')}</span>
            <select
              value={filters.block}
              onChange={(e) =>
                setFilters({ ...filters, block: e.target.value as Block | 'all' })
              }
            >
              <option value="all">{t('all')}</option>
              {BLOCKS.map((b) => (
                <option key={b} value={b}>
                  {b.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t('period')}</span>
            <select
              value={filters.period}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  period: e.target.value === 'all' ? 'all' : Number(e.target.value),
                })
              }
            >
              <option value="all">{t('all')}</option>
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t('group')}</span>
            <select
              value={filters.group}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  group: e.target.value === 'all' ? 'all' : Number(e.target.value),
                })
              }
            >
              <option value="all">{t('all')}</option>
              {Array.from({ length: 18 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>
    </div>
  )
}
