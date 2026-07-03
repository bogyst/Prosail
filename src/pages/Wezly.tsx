import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '../components/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ROPE = '#c9a15a'
const END = '#f4c74d'
const POLE = '#48606d'
const RING = '#5b6b76'
const BG = '#0e2233'

/* — pomocnicze elementy rysunku — */
function Fr({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 200 150" className="w-full rounded-lg" style={{ background: BG }}>
      {children}
    </svg>
  )
}
function Rope({ d, c = ROPE, w = 11, dash }: { d: string; c?: string; w?: number; dash?: string }) {
  return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
}
// „przerwa” imitująca przejście liny pod spodem (kolor tła)
function Gap({ d, w = 18 }: { d: string; w?: number }) {
  return <path d={d} fill="none" stroke={BG} strokeWidth={w} strokeLinecap="round" />
}
function Guide({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const hx = x2 - Math.cos(a) * 9
  const hy = y2 - Math.sin(a) * 9
  return (
    <g stroke="#7bbcd9" fill="#7bbcd9" opacity="0.9">
      <line x1={x1} y1={y1} x2={hx} y2={hy} strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${hx - Math.sin(a) * 5},${hy + Math.cos(a) * 5} ${hx + Math.sin(a) * 5},${hy - Math.cos(a) * 5}`} />
    </g>
  )
}
const Pole = () => <rect x="24" y="10" width="16" height="130" rx="6" fill={POLE} />
const Ring = () => <circle cx="34" cy="75" r="17" fill="none" stroke={RING} strokeWidth="9" />
const Cleat = () => (
  <g fill={POLE}>
    <rect x="60" y="84" width="80" height="14" rx="7" />
    <circle cx="64" cy="91" r="10" />
    <circle cx="136" cy="91" r="10" />
    <rect x="94" y="98" width="12" height="26" rx="3" />
  </g>
)

interface Step {
  cap: string
  el: ReactNode
  img?: string // opcjonalne zdjęcie zamiast rysunku SVG
}
interface Knot {
  id: string
  name: string
  alt: string
  difficulty: 'łatwy' | 'średni'
  use: string
  steps: Step[]
}

const KNOTS: Knot[] = [
  {
    id: 'bowline',
    name: 'Węzeł ratowniczy',
    alt: 'bowline / skrętny',
    difficulty: 'średni',
    use: 'Tworzy niezaciskającą się pętlę stałej wielkości. Do cumowania, mocowania szotów i podania tonącemu — pętla się nie dusi. „Król węzłów”.',
    steps: [
      {
        cap: 'Zrób małe oczko na linie głównej; koniec roboczy (złoty) leży na wierzchu.',
        el: (
          <Fr>
            <Rope d="M150 12 L150 138" />
            <Rope d="M150 78 C 122 70, 122 104, 150 96" c={END} />
            <Guide x1={150} y1={120} x2={140} y2={86} />
          </Fr>
        ),
      },
      {
        cap: 'Wyprowadź koniec od dołu przez oczko („zając wychodzi z nory”).',
        el: (
          <Fr>
            <Rope d="M150 12 L150 138" />
            <Rope d="M150 96 C 122 104, 122 70, 138 66" c={END} />
            <Guide x1={138} y1={90} x2={138} y2={52} />
          </Fr>
        ),
      },
      {
        cap: 'Obprowadź koniec dookoła liny głównej (za nią).',
        el: (
          <Fr>
            <Rope d="M150 12 L150 138" />
            <Rope d="M138 66 C 138 40, 176 40, 176 66" c={END} />
            <Gap d="M150 60 L150 74" />
            <Rope d="M176 66 C 176 82, 162 82, 150 78" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Gotowy węzeł ratowniczy — stała, niezaciskająca się pętla (zdjęcie).',
        img: '/knots/bowline-final.webp',
        el: (
          <Fr>
            <Rope d="M150 12 L150 138" />
            <Rope d="M150 96 C 118 108, 112 58, 150 66" c={ROPE} />
            <Gap d="M150 60 L150 74" />
            <Rope d="M150 66 C 176 62, 176 92, 150 92" c={END} />
            <Rope d="M150 92 L150 118" c={END} />
          </Fr>
        ),
      },
    ],
  },
  {
    id: 'eight',
    name: 'Ósemka',
    alt: 'figure-eight / stoper',
    difficulty: 'łatwy',
    use: 'Węzeł stoperowy na końcu liny — nie pozwala jej wyślizgnąć się z bloczka czy przelotki. Łatwy do rozwiązania po obciążeniu.',
    steps: [
      {
        cap: 'Zrób pętlę na końcu liny.',
        el: (
          <Fr>
            <Rope d="M70 12 L70 80" />
            <Rope d="M70 80 C 40 96, 40 60, 70 60" c={END} />
            <Rope d="M70 60 C 84 60, 96 55, 100 46" c={END} />
            <Guide x1={100} y1={52} x2={120} y2={80} />
          </Fr>
        ),
      },
      {
        cap: 'Poprowadź koniec za linę główną (na drugą stronę).',
        el: (
          <Fr>
            <Rope d="M70 12 L70 80" />
            <Rope d="M70 80 C 40 96, 40 60, 70 60" c={ROPE} />
            <Gap d="M64 60 L92 60" />
            <Rope d="M70 60 C 96 58, 112 74, 108 92" c={END} />
            <Guide x1={108} y1={92} x2={92} y2={104} />
          </Fr>
        ),
      },
      {
        cap: 'Przełóż koniec przez pierwszą pętlę — powstaje kształt „8”.',
        el: (
          <Fr>
            <Rope d="M70 12 L70 78" />
            <Rope d="M70 78 C 40 96, 40 58, 70 58" c={ROPE} />
            <Gap d="M64 58 L96 58" />
            <Rope d="M70 58 C 100 56, 116 82, 88 96" c={END} />
            <Gap d="M60 84 L80 96" />
            <Rope d="M88 96 C 70 104, 58 92, 60 82" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Dociągnij równo za oba końce.',
        el: (
          <Fr>
            <Rope d="M70 12 L70 70" />
            <Rope d="M70 70 C 42 84, 44 52, 74 54" c={ROPE} />
            <Gap d="M66 54 L98 56" />
            <Rope d="M74 54 C 104 52, 112 88, 84 92" c={END} />
            <Gap d="M62 80 L84 92" />
            <Rope d="M84 92 L96 120" c={END} />
          </Fr>
        ),
      },
    ],
  },
  {
    id: 'reef',
    name: 'Węzeł płaski (refowy)',
    alt: 'reef / square knot',
    difficulty: 'łatwy',
    use: 'Łączy dwie liny tej samej grubości lub wiąże zwój (np. przy refowaniu żagla). Zasada: „lewy na prawy, prawy na lewy”. Nie do obciążeń krytycznych.',
    steps: [
      {
        cap: 'Skrzyżuj końce: lewy na prawy i pod spód.',
        el: (
          <Fr>
            <Rope d="M14 70 C 60 66, 70 64, 100 78" />
            <Gap d="M92 74 L108 82" />
            <Rope d="M186 70 C 140 66, 130 64, 100 78" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Zawiąż pierwszy półwęzeł (przełóż koniec pod spód).',
        el: (
          <Fr>
            <Rope d="M14 78 C 60 82, 84 92, 100 74" />
            <Gap d="M92 74 L110 86" />
            <Rope d="M186 78 C 140 82, 116 92, 100 74" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Teraz prawy na lewy i pod spód — drugi półwęzeł.',
        el: (
          <Fr>
            <Rope d="M14 74 C 56 70, 78 60, 96 76 C 104 84, 120 84, 140 78" />
            <Gap d="M120 70 L138 80" />
            <Rope d="M186 74 C 150 70, 128 60, 104 76 C 96 84, 78 84, 60 78" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Dociągnij — obie pętle powinny być symetryczne (leżeć płasko).',
        el: (
          <Fr>
            <Rope d="M14 75 C 60 72, 80 66, 92 75 C 100 82, 96 66, 108 75 C 120 84, 140 78, 186 75" />
            <Gap d="M84 66 L100 84" />
            <Rope d="M92 75 C 84 66, 116 66, 108 75" c={END} />
          </Fr>
        ),
      },
    ],
  },
  {
    id: 'clove',
    name: 'Wyblinka',
    alt: 'clove hitch',
    difficulty: 'łatwy',
    use: 'Szybkie przymocowanie liny do słupka, relingu lub pachołka. Łatwo reguluje długość, ale pod zmiennym obciążeniem potrafi się poluzować.',
    steps: [
      {
        cap: 'Owiń linę raz dookoła słupka.',
        el: (
          <Fr>
            <Pole />
            <Rope d="M150 120 C 90 118, 60 96, 32 96" c={END} />
            <Gap d="M26 96 L44 96" />
            <Rope d="M32 96 C 20 96, 20 78, 44 78" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Skrzyżuj i owiń drugi raz, wyżej.',
        el: (
          <Fr>
            <Pole />
            <Rope d="M150 120 C 92 118, 40 104, 44 90" />
            <Gap d="M26 92 L44 92" />
            <Rope d="M40 96 C 22 96, 22 66, 44 66" c={END} />
            <Guide x1={46} y1={70} x2={70} y2={70} />
          </Fr>
        ),
      },
      {
        cap: 'Koniec przełóż pod ostatnim (górnym) zwojem.',
        el: (
          <Fr>
            <Pole />
            <Rope d="M150 120 C 92 118, 40 104, 46 92" />
            <Rope d="M40 96 C 22 96, 22 66, 40 66" />
            <Gap d="M30 66 L60 66" />
            <Rope d="M40 66 C 60 66, 70 62, 80 56" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Dociągnij oba zwoje do słupka.',
        el: (
          <Fr>
            <Pole />
            <Rope d="M150 122 C 96 120, 42 108, 44 94" />
            <Rope d="M42 98 C 24 98, 24 62, 42 62" />
            <Gap d="M30 62 L62 62" />
            <Rope d="M42 62 C 66 62, 78 58, 92 50" c={END} />
          </Fr>
        ),
      },
    ],
  },
  {
    id: 'cleat',
    name: 'Węzeł knagowy',
    alt: 'cleat hitch',
    difficulty: 'łatwy',
    use: 'Mocowanie cumy do knagi na pomoście lub pokładzie. Podstawa cumowania jachtu.',
    steps: [
      {
        cap: 'Wykonaj pełny obłóg wokół podstawy knagi (od dalszego rogu).',
        el: (
          <Fr>
            <Cleat />
            <Rope d="M40 140 C 60 116, 150 116, 150 96 C 150 84, 120 84, 100 90" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Prowadź linę „ósemką” po przeciwnym rogu.',
        el: (
          <Fr>
            <Cleat />
            <Rope d="M40 140 C 60 116, 150 116, 150 96 C 150 84, 120 84, 100 90" />
            <Gap d="M92 86 L108 94" />
            <Rope d="M100 90 C 78 80, 58 82, 56 92" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Dołóż drugą ósemkę przez pierwszy róg.',
        el: (
          <Fr>
            <Cleat />
            <Rope d="M40 140 C 60 116, 150 116, 150 96 C 150 84, 120 84, 100 90" />
            <Rope d="M100 90 C 78 80, 58 82, 56 92" />
            <Gap d="M64 86 L92 96" />
            <Rope d="M56 92 C 90 104, 120 92, 132 84" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Zakończ półsztykiem (obłóg zaczepowy) — lina wychodzi w przeciwną stronę.',
        el: (
          <Fr>
            <Cleat />
            <Rope d="M40 140 C 60 116, 150 116, 150 96 C 150 84, 120 84, 100 90" />
            <Rope d="M100 90 C 78 80, 58 82, 56 92" />
            <Rope d="M56 92 C 90 104, 120 92, 132 84" />
            <Gap d="M120 78 L140 88" />
            <Rope d="M132 84 C 140 74, 128 66, 118 72" c={END} />
          </Fr>
        ),
      },
    ],
  },
  {
    id: 'twohalf',
    name: 'Dwa półsztyki',
    alt: 'two half hitches',
    difficulty: 'łatwy',
    use: 'Uniwersalne mocowanie liny do oka, pala czy pierścienia. Prosty i pewny, dobrze trzyma pod obciążeniem.',
    steps: [
      {
        cap: 'Przełóż linę przez oko (lub dookoła pala).',
        el: (
          <Fr>
            <Ring />
            <Rope d="M34 92 C 34 120, 120 120, 150 120" c={END} />
            <Gap d="M28 75 L40 75" />
            <Rope d="M34 58 C 34 40, 120 40, 150 40" />
          </Fr>
        ),
      },
      {
        cap: 'Zrób pierwszy półsztyk wokół liny głównej.',
        el: (
          <Fr>
            <Ring />
            <Rope d="M34 58 C 90 46, 150 44, 150 44" />
            <Rope d="M34 92 C 70 100, 96 96, 96 74" c={END} />
            <Gap d="M88 50 L104 62" />
            <Rope d="M96 74 C 96 58, 112 58, 112 74" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Zrób drugi identyczny półsztyk w tę samą stronę.',
        el: (
          <Fr>
            <Ring />
            <Rope d="M34 58 C 90 46, 150 44, 150 44" />
            <Rope d="M34 92 C 66 100, 92 96, 92 74" />
            <Rope d="M92 74 C 92 58, 108 58, 108 74" />
            <Gap d="M112 50 L128 62" />
            <Rope d="M108 74 C 120 60, 136 60, 132 76" c={END} />
          </Fr>
        ),
      },
      {
        cap: 'Dociągnij oba półsztyki do siebie i do punktu mocowania.',
        el: (
          <Fr>
            <Ring />
            <Rope d="M34 58 C 90 48, 150 46, 150 46" />
            <Rope d="M34 92 C 74 98, 96 92, 96 76" c={END} />
            <Gap d="M90 56 L120 66" />
            <Rope d="M96 76 C 96 60, 128 60, 122 78" c={END} />
            <Rope d="M122 78 L138 84" c={END} />
          </Fr>
        ),
      },
    ],
  },
]

export default function Wezly() {
  const [sel, setSel] = useState<Knot>(KNOTS[0])
  const [step, setStep] = useState(0)

  function pick(k: Knot) {
    setSel(k)
    setStep(0)
  }

  return (
    <div>
      <PageHeader eyebrow="Węzły" title="Węzły żeglarskie krok po kroku">
        Sześć podstawowych węzłów, które dobry żeglarz wiąże bez patrzenia. Kliknij węzeł, a
        pokażą się kolejne kroki wiązania (złotym kolorem oznaczony jest koniec roboczy) wraz z
        opisem i zastosowaniem.
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* GALERIA */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {KNOTS.map((k) => (
            <button
              key={k.id}
              onClick={() => pick(k)}
              className={`card p-3 transition-all hover:-translate-y-0.5 ${sel.id === k.id ? 'ring-2 ring-brine-400' : ''}`}
            >
              {k.steps[k.steps.length - 1].el}
              <div className="mt-2 text-center text-sm font-medium text-white">{k.name}</div>
              <div className="text-center text-xs text-brine-100/60">{k.alt}</div>
            </button>
          ))}
        </div>

        {/* SZCZEGÓŁY + KROKI */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-700 text-white">{sel.name}</h3>
                <div className="text-xs text-brine-100/60">{sel.alt}</div>
              </div>
              <span className="chip">trudność: {sel.difficulty}</span>
            </div>

            {/* ramka z krokiem */}
            <div className="mt-4">
              <AnimatePresence mode="wait">
                <motion.div key={`${sel.id}-${step}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  {sel.steps[step].img ? (
                    <img
                      src={sel.steps[step].img}
                      alt={sel.steps[step].cap}
                      className="w-full rounded-lg object-cover"
                      style={{ aspectRatio: '4 / 3' }}
                    />
                  ) : (
                    sel.steps[step].el
                  )}
                </motion.div>
              </AnimatePresence>

              {/* nawigacja kroków */}
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-1.5">
                  {sel.steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${i === step ? 'bg-brine-400' : 'bg-white/15 hover:bg-white/30'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setStep((s) => Math.min(sel.steps.length - 1, s + 1))}
                  disabled={step === sel.steps.length - 1}
                  className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex gap-3 rounded-xl bg-white/5 p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brine-500 text-sm font-bold text-white">
                  {step + 1}
                </span>
                <p className="text-sm leading-relaxed text-brine-100/90">{sel.steps[step].cap}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Zastosowanie</div>
              <p className="mt-1 text-sm leading-relaxed text-brine-100/90">{sel.use}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
