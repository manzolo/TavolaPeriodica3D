import { useEffect, useMemo, useState } from 'react'
import type { ElementData } from '../data/types'
import { CATEGORY_META } from '../data/elements'
import { ISOTOPES, isotopeNotation } from '../data/isotopes'
import { electronsPerShell } from '../utils/electronConfig'
import { useI18n } from '../i18n'
import { AtomCanvas } from '../three/AtomInspector'
import { PROTON_COLOR, NEUTRON_COLOR } from '../three/Nucleus'

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

/** Abbondanza naturale (frazione 0..1) come percentuale leggibile */
function fmtAbundance(a: number | null, t: (k: any) => string): string {
  if (a == null) return t('traces')
  const pct = a * 100
  // più cifre per i valori piccoli, così non si azzerano (es. 0,0115%)
  const s = pct >= 1 ? pct.toFixed(pct >= 10 ? 3 : 4) : pct.toPrecision(2)
  return `${parseFloat(s)}%`
}

/** Emivita in secondi → stringa con l'unità più adatta (s, min, h, giorni, anni…) */
function fmtHalfLife(seconds: number, t: (k: any) => string): string {
  const round = (n: number) => parseFloat(n.toPrecision(3))
  const MIN = 60
  const H = 3600
  const D = 86400
  const Y = 365.25 * D
  if (seconds < MIN) return `${round(seconds)} ${t('unit_s')}`
  if (seconds < H) return `${round(seconds / MIN)} ${t('unit_min')}`
  if (seconds < D) return `${round(seconds / H)} ${t('unit_h')}`
  if (seconds < Y) return `${round(seconds / D)} ${t('unit_d')}`
  const years = seconds / Y
  if (years < 1e3) return `${round(years)} ${t('unit_y')}`
  if (years < 1e6) return `${round(years / 1e3)} ${t('unit_ky')}`
  if (years < 1e9) return `${round(years / 1e6)} ${t('unit_My')}`
  return `${round(years / 1e9)} ${t('unit_Gy')}`
}

export function DetailPanel({ element, inCompare, onClose, onToggleCompare }: Props) {
  const { t, lang, tCategory, tPhase, tBlock } = useI18n()

  const isotopes = element ? ISOTOPES[element.number] : undefined

  // indice di default = isotopo più abbondante (quello "principale")
  const principalIdx = useMemo(() => {
    if (!isotopes) return 0
    let best = 0
    for (let i = 1; i < isotopes.length; i++) {
      if ((isotopes[i].abundance ?? -1) > (isotopes[best].abundance ?? -1)) best = i
    }
    return best
  }, [isotopes])

  const [isoIdx, setIsoIdx] = useState(principalIdx)
  // al cambio di elemento riparti dall'isotopo principale
  useEffect(() => setIsoIdx(principalIdx), [element?.number, principalIdx])

  if (!element) return null

  const meta = CATEGORY_META[element.category]
  const na = t('unknown')
  const shells = electronsPerShell(element.number).join(' · ')

  const rows: Array<[string, string]> = [
    [t('atomicNumber'), String(element.number)],
    [t('atomicMass'), `${element.atomicMass} u`],
    [t('category'), tCategory(element.category)],
    [t('block'), tBlock(element.block)],
    [t('group'), element.group ? String(element.group) : '—'],
    [t('period'), String(element.period)],
    [t('phase'), tPhase(element.phase)],
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

  // isotopo selezionato (clamp difensivo se l'indice è fuori range)
  const iso = isotopes?.[Math.min(isoIdx, isotopes.length - 1)]
  const isoRows: Array<[string, string]> = iso
    ? [
        [t('massNumber'), String(iso.massNumber)],
        [t('protons'), String(element.number)],
        [t('neutrons'), String(iso.massNumber - element.number)],
        [t('abundance'), fmtAbundance(iso.abundance, t)],
        [t('stability'), iso.stable ? t('stable') : `☢ ${t('unstable')}`],
        ...(iso.halfLifeSeconds != null
          ? ([[t('halfLife'), fmtHalfLife(iso.halfLifeSeconds, t)]] as Array<[string, string]>)
          : []),
      ]
    : []

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
          <div className="detail__cat">{tCategory(element.category)}</div>
        </div>
      </div>

      {/* Visualizzatore atomo 3D — zona nera, vista di taglio */}
      <div className="detail__atom">
        <span className="detail__atomlabel">{t('atomViewer')}</span>
        <AtomCanvas
          key={element.number}
          element={element}
          scale={0.74}
          massNumber={iso?.massNumber}
          interactive
        />
        <span className="detail__atomhint">{t('atomHint')}</span>
      </div>

      <dl className="detail__table">
        {rows.map(([k, v]) => (
          <div className="detail__row" key={k}>
            <dt>{k}</dt>
            <dd className={k === t('electronConfig') || k === t('shells') ? 'mono' : ''}>{v}</dd>
          </div>
        ))}
      </dl>

      {/* Isotopi (solo per gli elementi già modellati) */}
      {isotopes && iso && (
        <div className="detail__isotopes">
          <span className="detail__atomlabel">{t('isotopes')}</span>
          <div className="iso-chips">
            {isotopes.map((it, i) => (
              <button
                key={it.massNumber}
                className={`iso-chip ${i === isoIdx ? 'is-active' : ''}`}
                onClick={() => setIsoIdx(i)}
                title={lang === 'it' ? it.name : it.nameEn}
              >
                {isotopeNotation(it.massNumber, element.symbol)}
              </button>
            ))}
          </div>
          {(iso.name || iso.nameEn) && (
            <div className="iso-name">{lang === 'it' ? iso.name : iso.nameEn}</div>
          )}
          {/* legenda colori del nucleo 3D qui sopra */}
          <div className="iso-legend">
            <span>
              <i className="iso-dot" style={{ background: PROTON_COLOR }} />
              {t('protons')} · {element.number}
            </span>
            <span>
              <i className="iso-dot" style={{ background: NEUTRON_COLOR }} />
              {t('neutrons')} · {iso.massNumber - element.number}
            </span>
          </div>
          <dl className="detail__table">
            {isoRows.map(([k, v]) => (
              <div className="detail__row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <button
        className={`detail__compare ${inCompare ? 'is-active' : ''}`}
        onClick={() => onToggleCompare(element)}
      >
        {inCompare ? t('removeFromCompare') : t('selectForCompare')}
      </button>
    </aside>
  )
}
