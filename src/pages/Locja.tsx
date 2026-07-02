import { useState } from 'react'
import { motion } from 'framer-motion'
import Buoy, { type BodyShape, type TopMark, type Band, bandColor } from '../components/Buoy'
import { PageHeader, Term } from '../components/ui'

interface Mark {
  id: string
  name: string
  group: string
  shape: BodyShape
  bands: Band[]
  topmark?: TopMark
  topColor?: string
  light: string
  meaning: string
  pass: string
}

const R = bandColor('red')
const G = bandColor('green')
const Y = bandColor('yellow')
const B = bandColor('black')

const MARKS: Mark[] = [
  {
    id: 'port',
    name: 'Znak lewej strony szlaku',
    group: 'Znaki boczne (kardynalne szlaku)',
    shape: 'can',
    bands: [{ color: R, from: 0, to: 1 }],
    topmark: 'can',
    topColor: R,
    light: 'Czerwone, dowolna charakterystyka',
    meaning:
      'Czerwona, walcowata pława oznacza lewą krawędź szlaku żeglownego (patrząc w kierunku spływu prądu / wchodzenia do portu).',
    pass: 'Wchodząc do portu — zostaw ją po lewej burcie (bakburcie).',
  },
  {
    id: 'stbd',
    name: 'Znak prawej strony szlaku',
    group: 'Znaki boczne (kardynalne szlaku)',
    shape: 'cone',
    bands: [{ color: G, from: 0, to: 1 }],
    topmark: 'cone-up',
    topColor: G,
    light: 'Zielone, dowolna charakterystyka',
    meaning:
      'Zielona, stożkowa pława oznacza prawą krawędź szlaku żeglownego.',
    pass: 'Wchodząc do portu — zostaw ją po prawej burcie (sterburcie).',
  },
  {
    id: 'north',
    name: 'Znak kardynalny N (północny)',
    group: 'Znaki kardynalne',
    shape: 'pillar',
    bands: [
      { color: B, from: 0.5, to: 1 },
      { color: Y, from: 0, to: 0.5 },
    ],
    topmark: 'cones-up',
    topColor: B,
    light: 'Białe, błyskowe szybkie (VQ lub Q) — ciągłe',
    meaning:
      'Bezpieczna woda jest na PÓŁNOC od znaku. Oba stożki topmarku skierowane wierzchołkami w górę; czarny pas u góry.',
    pass: 'Mijaj od strony północnej znaku.',
  },
  {
    id: 'east',
    name: 'Znak kardynalny E (wschodni)',
    group: 'Znaki kardynalne',
    shape: 'pillar',
    bands: [
      { color: B, from: 0.66, to: 1 },
      { color: Y, from: 0.33, to: 0.66 },
      { color: B, from: 0, to: 0.33 },
    ],
    topmark: 'cones-base',
    topColor: B,
    light: 'Białe VQ(3) lub Q(3) — 3 błyski',
    meaning:
      'Bezpieczna woda jest na WSCHÓD. Stożki podstawami do siebie (jak „beczka”); czarny‑żółty‑czarny.',
    pass: 'Mijaj od strony wschodniej znaku.',
  },
  {
    id: 'south',
    name: 'Znak kardynalny S (południowy)',
    group: 'Znaki kardynalne',
    shape: 'pillar',
    bands: [
      { color: Y, from: 0.5, to: 1 },
      { color: B, from: 0, to: 0.5 },
    ],
    topmark: 'cones-down',
    topColor: B,
    light: 'Białe VQ(6)+LFl lub Q(6)+LFl — 6 błysków + długi',
    meaning:
      'Bezpieczna woda jest na POŁUDNIE. Stożki wierzchołkami w dół; żółty u góry, czarny na dole.',
    pass: 'Mijaj od strony południowej znaku.',
  },
  {
    id: 'west',
    name: 'Znak kardynalny W (zachodni)',
    group: 'Znaki kardynalne',
    shape: 'pillar',
    bands: [
      { color: Y, from: 0.66, to: 1 },
      { color: B, from: 0.33, to: 0.66 },
      { color: Y, from: 0, to: 0.33 },
    ],
    topmark: 'cones-point',
    topColor: B,
    light: 'Białe VQ(9) lub Q(9) — 9 błysków',
    meaning:
      'Bezpieczna woda jest na ZACHÓD. Stożki wierzchołkami do siebie (jak „kieliszek/klepsydra”); żółty‑czarny‑żółty.',
    pass: 'Mijaj od strony zachodniej znaku.',
  },
  {
    id: 'danger',
    name: 'Znak izolowanego niebezpieczeństwa',
    group: 'Znaki specjalne',
    shape: 'pillar',
    bands: [
      { color: B, from: 0.66, to: 1 },
      { color: R, from: 0.33, to: 0.66 },
      { color: B, from: 0, to: 0.33 },
    ],
    topmark: 'spheres',
    topColor: B,
    light: 'Białe Fl(2) — grupa 2 błysków',
    meaning:
      'Postawiony NA niebezpieczeństwie o niewielkiej rozciągłości (np. samotna skała, wrak). Dwie czarne kule jedna nad drugą.',
    pass: 'Omijaj z dala z każdej strony — pod znakiem jest przeszkoda.',
  },
  {
    id: 'safe',
    name: 'Znak bezpiecznej wody',
    group: 'Znaki specjalne',
    shape: 'sphere',
    bands: [
      { color: R, from: 0, to: 0.2 },
      { color: R, from: 0.4, to: 0.6 },
      { color: R, from: 0.8, to: 1 },
    ],
    topmark: 'sphere',
    topColor: R,
    light: 'Białe: Iso, Oc, LFl 10s lub Morse „A”',
    meaning:
      'Dookoła jest żeglowna, bezpieczna woda — np. znak osi toru lub podejściowy. Pionowe czerwono‑białe pasy, czerwona kula na topie.',
    pass: 'Można mijać z każdej strony; często oznacza środek toru.',
  },
  {
    id: 'special',
    name: 'Znak specjalny (żółty)',
    group: 'Znaki specjalne',
    shape: 'can',
    bands: [{ color: Y, from: 0, to: 1 }],
    topmark: 'x',
    topColor: Y,
    light: 'Żółte, dowolna charakterystyka',
    meaning:
      'Oznacza obszar lub obiekt specjalny: kąpielisko, tor regatowy, kabel, ujęcie wody, poligon itp. Żółty, topmark „X”.',
    pass: 'Znaczenie wynika z map/przepisów lokalnych — nie dotyczy głębokości.',
  },
]

const GROUPS = [...new Set(MARKS.map((m) => m.group))]

export default function Locja() {
  const [sel, setSel] = useState<Mark>(MARKS[2])

  return (
    <div>
      <PageHeader eyebrow="Locja" title="Oznakowanie szlaków wodnych (IALA · region A)">
        Pławy i znaki nawigacyjne to „znaki drogowe” na wodzie. W Europie
        obowiązuje <Term label="system IALA A" title="System oznakowania IALA">
          <p>
            Międzynarodowy system oznakowania. W <b>regionie A</b> (Europa,
            Afryka, większość Azji i Australia) znak <b>lewej</b> strony jest
            <b> czerwony</b>, a <b>prawej</b> — <b>zielony</b>. W regionie B
            (obie Ameryki, Japonia) kolory są odwrotne.
          </p>
        </Term>. Kliknij znak, aby poznać jego znaczenie i sposób mijania.
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* GALERIA */}
        <div className="space-y-8">
          {GROUPS.map((grp) => (
            <div key={grp}>
              <h3 className="mb-3 font-display text-lg font-600 text-brine-200">{grp}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {MARKS.filter((m) => m.group === grp).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSel(m)}
                    className={`card flex flex-col items-center p-3 transition-all hover:-translate-y-0.5 ${
                      sel.id === m.id ? 'ring-2 ring-brine-400' : ''
                    }`}
                  >
                    <Buoy shape={m.shape} bands={m.bands} topmark={m.topmark} topColor={m.topColor} size={82} />
                    <span className="mt-1 text-center text-xs leading-tight text-brine-100/80">
                      {m.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PANEL SZCZEGÓŁÓW */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div key={sel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <div className="flex items-center gap-5">
              <Buoy shape={sel.shape} bands={sel.bands} topmark={sel.topmark} topColor={sel.topColor} size={100} />
              <div>
                <div className="chip mb-2">{sel.group}</div>
                <h3 className="font-display text-xl font-700 text-white">{sel.name}</h3>
              </div>
            </div>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Znaczenie</dt>
                <dd className="mt-1 text-brine-100/90">{sel.meaning}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Jak mijać</dt>
                <dd className="mt-1 text-brine-100/90">{sel.pass}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Światło</dt>
                <dd className="mt-1 text-brine-100/90">{sel.light}</dd>
              </div>
            </dl>
          </motion.div>

          <div className="card mt-4 p-5 text-sm text-brine-100/80">
            <p className="font-semibold text-white">Pamiętnik żeglarza 🧭</p>
            <p className="mt-2">
              Znaki kardynalne wskazują, z której strony jest{' '}
              <b>bezpieczna, głęboka woda</b>. Nazwa (N/E/S/W) mówi, po której
              stronie znaku masz przepłynąć.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
