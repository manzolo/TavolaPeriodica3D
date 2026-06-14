import { useCallback, useState } from 'react'
import { Scene } from './three/Scene'
import { AtomInspector } from './three/AtomInspector'
import { Controls } from './components/Controls'
import { Legend } from './components/Legend'
import { Tooltip } from './components/Tooltip'
import { DetailPanel } from './components/DetailPanel'
import { ComparePanel } from './components/ComparePanel'
import { CreditsModal } from './components/CreditsModal'
import { NavPad } from './components/NavPad'
import { useI18n } from './i18n'
import { ELEMENTS_BY_NUMBER } from './data/elements'
import type { ElementData, TrendKey } from './data/types'
import type { Filters } from './three/PeriodicTable3D'

const DEFAULT_FILTERS: Filters = { category: 'all', block: 'all', period: 'all', group: 'all' }

export default function App() {
  const { t, lang, setLang } = useI18n()

  const [trend, setTrend] = useState<TrendKey>('none')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [showOrbits, setShowOrbits] = useState(true)
  const [hovered, setHovered] = useState<ElementData | null>(null)
  const [selected, setSelected] = useState<ElementData | null>(null)
  const [compare, setCompare] = useState<number[]>([])
  const [resetSignal, setResetSignal] = useState(0)
  const [showCredits, setShowCredits] = useState(false)
  const [showNav, setShowNav] = useState(false)
  // su schermi stretti il pannello parte chiuso per non coprire la tavola
  const [panelOpen, setPanelOpen] = useState(
    () => typeof window === 'undefined' || window.innerWidth > 760,
  )

  const handleClick = useCallback((e: ElementData) => setSelected(e), [])

  const toggleCompare = useCallback((e: ElementData) => {
    setCompare((prev) => {
      if (prev.includes(e.number)) return prev.filter((n) => n !== e.number)
      if (prev.length >= 2) return [prev[1], e.number] // mantieni max 2 (FIFO)
      return [...prev, e.number]
    })
  }, [])

  const resetAll = useCallback(() => {
    setResetSignal((s) => s + 1)
    setFilters(DEFAULT_FILTERS)
    setTrend('none')
    setSelected(null)
  }, [])

  const compareElements = compare
    .map((n) => ELEMENTS_BY_NUMBER.get(n))
    .filter((e): e is ElementData => !!e)

  return (
    <div className="app">
      {/* Scena 3D a tutto schermo */}
      <div className="canvas-wrap">
        <Scene
          trend={trend}
          filters={filters}
          hovered={hovered}
          selected={selected}
          compare={compare}
          resetSignal={resetSignal}
          onHover={setHovered}
          onClick={handleClick}
          onBackgroundClick={() => setSelected(null)}
        />
      </div>

      {/* Barra superiore */}
      <header className="topbar">
        <div className="brand">
          <div className="brand__logo" aria-hidden>
            <span className="brand__core" />
          </div>
          <div className="brand__txt">
            <h1>{t('appTitle')}</h1>
            <p>{t('appSubtitle')}</p>
          </div>
        </div>

        <div className="topbar__actions">
          <button
            className={`btn ${showOrbits ? 'btn--on' : ''}`}
            onClick={() => setShowOrbits((v) => !v)}
            title={showOrbits ? t('hideOrbits') : t('showOrbits')}
          >
            <span className="btn__icon">◍</span>
            <span className="btn__label">{t('toggleOrbits')}</span>
          </button>

          <button className="btn" onClick={resetAll} title={t('resetView')}>
            <span className="btn__icon">⟳</span>
            <span className="btn__label">{t('resetView')}</span>
          </button>

          <button
            className={`btn ${showNav ? 'btn--on' : ''}`}
            onClick={() => setShowNav((v) => !v)}
            title={t('navToggle')}
            aria-pressed={showNav}
          >
            <span className="btn__icon">✛</span>
            <span className="btn__label">{t('navToggle')}</span>
          </button>

          <div className="lang">
            <button
              className={`lang__btn ${lang === 'it' ? 'is-active' : ''}`}
              onClick={() => setLang('it')}
              aria-label="Italiano"
            >
              🇮🇹
            </button>
            <button
              className={`lang__btn ${lang === 'en' ? 'is-active' : ''}`}
              onClick={() => setLang('en')}
              aria-label="English"
            >
              🇬🇧
            </button>
          </div>
        </div>
      </header>

      {/* Pannello controlli (collassabile su mobile) */}
      <button
        className={`panel-toggle ${panelOpen ? 'is-open' : ''}`}
        onClick={() => setPanelOpen((v) => !v)}
        aria-label="toggle panel"
      >
        {panelOpen ? '◀' : '▶'}
      </button>
      <div className={`left-stack ${panelOpen ? '' : 'is-hidden'}`}>
        <Controls trend={trend} setTrend={setTrend} filters={filters} setFilters={setFilters} />
        <Legend trend={trend} />
      </div>

      {/* Visualizzatore atomo 3D fluttuante (hover) — quando un dettaglio è aperto
          l'atomo è già dentro il pannello, quindi qui mostriamo solo l'hover */}
      <AtomInspector element={selected ? null : hovered} visible={showOrbits} />

      {/* Tooltip hover — nascosto quando il pannello dettaglio è aperto per evitare sovrapposizioni */}
      <Tooltip element={selected ? null : hovered} />

      {/* Pannello dettaglio */}
      <DetailPanel
        element={selected}
        inCompare={selected ? compare.includes(selected.number) : false}
        onClose={() => setSelected(null)}
        onToggleCompare={toggleCompare}
      />

      {/* D-pad di navigazione accessibile (toggle dalla topbar) */}
      <NavPad visible={showNav} />

      {/* Confronto */}
      <ComparePanel
        elements={compareElements}
        onRemove={(n) => setCompare((p) => p.filter((x) => x !== n))}
        onClear={() => setCompare([])}
      />

      {/* Hint + crediti in basso */}
      <footer className="footer">
        <span className="footer__hint">{t('hoverHint')}</span>
        <button className="footer__credits" onClick={() => setShowCredits(true)}>
          {t('credits')}
        </button>
      </footer>

      {showCredits && <CreditsModal onClose={() => setShowCredits(false)} />}
    </div>
  )
}
