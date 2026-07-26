import { useState } from 'react'
import { motion } from 'framer-motion'
import Buoy, { type BodyShape, type TopMark, type Band, bandColor } from '../components/Buoy'
import LocjaMap from '../components/LocjaMap'
import BridgePassage from '../components/BridgePassage'
import { PageHeader, Term } from '../components/ui'
import Illustration from '../components/Illustration'
import { LayoutGrid, Map, Construction } from 'lucide-react'

interface Mark {
  id: string
  name: string
  group: string
  /**
   * Opcjonalny obrazek zamiast rysowanej pławy.
   * Wrzuć plik np. do `public/znaki/pława-lewa.webp` i podaj tu:
   *   img: '/znaki/plawa-lewa.webp'
   * Bez tego pola rysowana jest pława wektorowa (shape/bands/topmark).
   */
  img?: string
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
    id: 'prawa',
    name: 'Znak prawej strony szlaku',
    group: 'Znaki boczne',
    shape: 'can',
    bands: [{ color: R, from: 0, to: 1 }],
    topmark: 'can',
    topColor: R,
    light: 'Czerwone, dowolna charakterystyka',
    meaning:
      'Na polskich wodach śródlądowych CZERWONA, walcowata pława (bakon prostokątny) oznacza PRAWĄ krawędź szlaku — patrząc zgodnie z kierunkiem oznakowania szlaku (w dół rzeki).',
    pass: 'Płynąc zgodnie z kierunkiem szlaku (w dół rzeki) — zostaw ją po prawej stronie.',
  },
  {
    id: 'lewa',
    name: 'Znak lewej strony szlaku',
    group: 'Znaki boczne',
    shape: 'cone',
    bands: [{ color: G, from: 0, to: 1 }],
    topmark: 'cone-up',
    topColor: G,
    light: 'Zielone, dowolna charakterystyka',
    meaning:
      'ZIELONA, stożkowa pława (bakon trójkątny, wierzchołkiem w górę) oznacza LEWĄ krawędź szlaku śródlądowego.',
    pass: 'Płynąc zgodnie z kierunkiem szlaku (w dół rzeki) — zostaw ją po lewej stronie.',
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
  const [view, setView] = useState<'gallery' | 'map' | 'bridge'>('gallery')

  return (
    <div>
      <PageHeader eyebrow="Locja" title="Oznakowanie szlaków wodnych (śródlądowe · Polska)">
        Pławy i znaki nawigacyjne to „znaki drogowe” na wodzie. Na polskich wodach
        śródlądowych <Term label="strona prawa jest czerwona, lewa zielona" title="Strony szlaku żeglownego (śródlądowe)">
          <p>
            „Prawa” i „lewa” strona szlaku liczone są <b>patrząc w dół rzeki</b> (zgodnie z
            kierunkiem oznakowania). <b>Prawa</b> strona = pławy <b className="text-buoyRed">czerwone</b>{' '}
            (bakeny prostokątne), <b>lewa</b> = <b className="text-buoyGreen">zielone</b> (trójkątne
            kątem w górę). Reguluje to rozporządzenie o przepisach żeglugowych na śródlądowych
            drogach wodnych.
          </p>
          <p className="mt-2">
            ⚓ <b>Uwaga:</b> na morzu (system <b>IALA region A</b>) jest odwrotnie — wchodząc z
            morza do portu masz <b className="text-buoyRed">czerwone po lewej</b> (port), a{' '}
            <b className="text-buoyGreen">zielone po prawej</b> burcie. To inny układ odniesienia.
          </p>
        </Term>. Kliknij znak, aby poznać jego znaczenie i sposób mijania.
      </PageHeader>

      {/* Przełącznik widoku */}
      <div className="mb-6 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => setView('gallery')}
          className={`btn px-4 py-1.5 text-sm ${view === 'gallery' ? 'bg-brine-500 text-white' : 'text-brine-100'}`}
        >
          <LayoutGrid className="h-4 w-4" />
          Galeria znaków
        </button>
        <button
          onClick={() => setView('map')}
          className={`btn px-4 py-1.5 text-sm ${view === 'map' ? 'bg-brine-500 text-white' : 'text-brine-100'}`}
        >
          <Map className="h-4 w-4" />
          Znaki na mapie
        </button>
        <button
          onClick={() => setView('bridge')}
          className={`btn px-4 py-1.5 text-sm ${view === 'bridge' ? 'bg-brine-500 text-white' : 'text-brine-100'}`}
        >
          <Construction className="h-4 w-4" />
          Przejście pod mostem
        </button>
      </div>

      {view === 'map' && <LocjaMap />}
      {view === 'bridge' && <BridgePassage />}

      <div className={`grid gap-8 lg:grid-cols-[1fr_360px] ${view !== 'gallery' ? 'hidden' : ''}`}>
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
                    <div className="rounded-xl bg-gradient-to-b from-[#eaf3fb] to-[#c2dcef] px-2 pt-2">
                      <Illustration img={m.img} alt={m.name} className="h-[139px] w-[82px] object-contain">
                        <Buoy shape={m.shape} bands={m.bands} topmark={m.topmark} topColor={m.topColor} size={82} />
                      </Illustration>
                    </div>
                    <span className="mt-2 text-center text-xs leading-tight text-brine-100/80">
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
              <div className="shrink-0 rounded-xl bg-gradient-to-b from-[#eaf3fb] to-[#c2dcef] px-2 pt-2">
                <Illustration img={sel.img} alt={sel.name} className="h-[170px] w-[100px] object-contain">
                  <Buoy shape={sel.shape} bands={sel.bands} topmark={sel.topmark} topColor={sel.topColor} size={100} />
                </Illustration>
              </div>
              <div>
                <div className="chip mb-2">{sel.group}</div>
                <h3 className="font-display text-xl font-700 text-navy">{sel.name}</h3>
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
            <p className="font-semibold text-navy">Pamiętnik żeglarza 🧭</p>
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
