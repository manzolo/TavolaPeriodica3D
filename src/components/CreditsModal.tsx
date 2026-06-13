import { useI18n } from '../i18n'

const TEXT = {
  it: {
    title: 'Fonti e licenze',
    intro:
      'I dati numerici degli elementi chimici sono fatti scientifici di pubblico dominio (non soggetti a copyright). Sono riportati a scopo didattico; per studi seri verifica sempre le fonti primarie.',
    dataTitle: 'Fonti dei dati',
    codeTitle: 'Licenza del codice',
    codeBody:
      'Il codice di questo progetto è rilasciato sotto licenza MIT: sei libero di usarlo, modificarlo e ridistribuirlo.',
    fontsTitle: 'Font e librerie',
    fontsBody:
      'Font Chakra Petch e IBM Plex Mono via Google Fonts (SIL Open Font License). Three.js, React, @react-three/fiber e @react-three/drei sono rilasciati sotto licenza MIT.',
    disclaimer:
      'Progetto didattico, senza scopo di lucro. Nessun dato proprietario è stato copiato: i valori provengono da fonti aperte e dal pubblico dominio.',
  },
  en: {
    title: 'Sources & licenses',
    intro:
      'The numerical data of the chemical elements are public-domain scientific facts (not subject to copyright). They are provided for educational purposes; for serious work always verify the primary sources.',
    dataTitle: 'Data sources',
    codeTitle: 'Code license',
    codeBody:
      'The code of this project is released under the MIT license: you are free to use, modify and redistribute it.',
    fontsTitle: 'Fonts & libraries',
    fontsBody:
      'Chakra Petch and IBM Plex Mono fonts via Google Fonts (SIL Open Font License). Three.js, React, @react-three/fiber and @react-three/drei are released under the MIT license.',
    disclaimer:
      'Educational, non-commercial project. No proprietary data was copied: values come from open and public-domain sources.',
  },
}

const SOURCES = [
  { name: 'PubChem (NIH / NLM) — Periodic Table of Elements', url: 'https://pubchem.ncbi.nlm.nih.gov/periodic-table/' },
  { name: 'IUPAC — Periodic Table of the Elements', url: 'https://iupac.org/what-we-do/periodic-table-of-elements/' },
  { name: 'Wikipedia — List of chemical elements (CC BY-SA)', url: 'https://en.wikipedia.org/wiki/List_of_chemical_elements' },
  { name: 'Los Alamos National Laboratory — Periodic Table', url: 'https://periodic.lanl.gov/' },
]

export function CreditsModal({ onClose }: { onClose: () => void }) {
  const { lang, t } = useI18n()
  const x = TEXT[lang]

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="detail__close" onClick={onClose} aria-label={t('close')}>
          ✕
        </button>
        <h2 className="modal__title">{x.title}</h2>
        <p className="modal__intro">{x.intro}</p>

        <h3 className="modal__h3">{x.dataTitle}</h3>
        <ul className="modal__list">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name} ↗
              </a>
            </li>
          ))}
        </ul>

        <h3 className="modal__h3">{x.codeTitle}</h3>
        <p>{x.codeBody}</p>

        <h3 className="modal__h3">{x.fontsTitle}</h3>
        <p>{x.fontsBody}</p>

        <p className="modal__disclaimer">{x.disclaimer}</p>
      </div>
    </div>
  )
}
