import { useMemo } from 'react'
import type { Block, Category, ElementData, TrendKey } from '../data/types'
import { CATEGORY_META, ELEMENTS } from '../data/elements'
import { gradientCss, normalizedTrend } from '../utils/colorScales'
import { worldPosition } from '../utils/layout'
import { ElementTile } from './ElementTile'

export interface Filters {
  category: Category | 'all'
  block: Block | 'all'
  period: number | 'all'
  group: number | 'all'
}

interface Props {
  trend: TrendKey
  filters: Filters
  hovered: ElementData | null
  selected: ElementData | null
  compare: number[]
  onHover: (e: ElementData | null) => void
  onClick: (e: ElementData) => void
}

const DIM_GREY = '#3a4150'

function passesFilters(e: ElementData, f: Filters): boolean {
  if (f.category !== 'all' && e.category !== f.category) return false
  if (f.block !== 'all' && e.block !== f.block) return false
  if (f.period !== 'all' && e.period !== f.period) return false
  if (f.group !== 'all' && e.group !== f.group) return false
  return true
}

export function PeriodicTable3D({
  trend,
  filters,
  hovered,
  selected,
  compare,
  onHover,
  onClick,
}: Props) {
  const tiles = useMemo(() => {
    return ELEMENTS.map((e) => {
      const passes = passesFilters(e, filters)
      let color: string
      let noData = false

      if (trend === 'none') {
        color = CATEGORY_META[e.category].color
      } else {
        const n = normalizedTrend(e, trend)
        if (n == null) {
          color = DIM_GREY
          noData = true
        } else {
          color = gradientCss(n)
        }
      }

      return { e, position: worldPosition(e), color, dimmed: !passes || noData }
    })
  }, [trend, filters])

  return (
    <group>
      {tiles.map(({ e, position, color, dimmed }) => {
        const active = hovered?.number === e.number || selected?.number === e.number
        return (
          <ElementTile
            key={e.number}
            element={e}
            position={position}
            color={color}
            dimmed={dimmed}
            active={active}
            selected={selected?.number === e.number}
            inCompare={compare.includes(e.number)}
            onHover={onHover}
            onClick={onClick}
          />
        )
      })}
    </group>
  )
}
