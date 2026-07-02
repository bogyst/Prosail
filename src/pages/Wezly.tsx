import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui'

interface Knot {
  id: string
  name: string
  alt: string
  use: string
  difficulty: 'łatwy' | 'średni'
  steps: string[]
}

const KNOTS: Knot[] = [
  {
    id: 'bowline',
    name: 'Węzeł ratowniczy',
    alt: 'bowline / skrętny',
    use: 'Tworzy niezaciskającą się pętlę stałej wielkości. Do cumowania, mocowania szotów, podania tonącemu — pętla nie dusi.',
    difficulty: 'średni',
    steps: [
      'Zrób małe oczko na linie (koniec roboczy na wierzchu).',
      'Wyprowadź koniec od dołu przez oczko („zając wychodzi z nory”).',
      'Obprowadź koniec za linią główną i włóż z powrotem w oczko.',
      'Dociągnij, trzymając pętlę o pożądanej wielkości.',
    ],
  },
  {
    id: 'eight',
    name: 'Ósemka',
    alt: 'figure-eight / stoper',
    use: 'Węzeł stoperowy na końcu liny — nie pozwala jej wyślizgnąć się z bloczka czy przelotki. Łatwy do rozwiązania nawet po obciążeniu.',
    difficulty: 'łatwy',
    steps: [
      'Zrób pętlę na końcu liny.',
      'Poprowadź koniec dookoła liny głównej.',
      'Przełóż koniec przez pierwszą pętlę (powstaje kształt „8”).',
      'Dociągnij równo za oba końce.',
    ],
  },
  {
    id: 'reef',
    name: 'Węzeł płaski (refowy)',
    alt: 'reef / square knot',
    use: 'Łączy dwie liny tej samej grubości lub wiąże zwój (np. przy refowaniu żagla). Uwaga: nie do obciążeń krytycznych.',
    difficulty: 'łatwy',
    steps: [
      'Lewy koniec na prawy i pod spód (jak przy sznurowadle).',
      'Teraz prawy koniec na lewy i pod spód.',
      'Zasada: „lewy na prawy, prawy na lewy”.',
      'Dociągnij — pętle powinny być symetryczne.',
    ],
  },
  {
    id: 'clove',
    name: 'Wyblinka',
    alt: 'clove hitch',
    use: 'Szybkie przymocowanie liny do słupka, relingu lub pachołka. Łatwo reguluje długość, ale potrafi się poluzować pod zmiennym obciążeniem.',
    difficulty: 'łatwy',
    steps: [
      'Owiń linę raz dookoła słupka.',
      'Skrzyżuj i owiń drugi raz, wyżej.',
      'Koniec przełóż pod ostatnim zwojem.',
      'Dociągnij oba zwoje do słupka.',
    ],
  },
  {
    id: 'cleat',
    name: 'Węzeł knagowy',
    alt: 'cleat hitch',
    use: 'Mocowanie cumy do knagi na pomoście lub pokładzie. Podstawa cumowania jachtu.',
    difficulty: 'łatwy',
    steps: [
      'Wykonaj pełny obłóg wokół podstawy knagi.',
      'Prowadź linę „ósemkami” po rogach knagi.',
      'Zakończ półsztykiem (obłóg zaczepowy), aby zablokować.',
      'Nie rób zbyt wielu ósemek — jedna–dwie wystarczą.',
    ],
  },
  {
    id: 'twohalf',
    name: 'Dwa półsztyki',
    alt: 'two half hitches',
    use: 'Uniwersalne mocowanie liny do oka, pala czy pierścienia. Pewny i prosty, dobrze trzyma pod obciążeniem.',
    difficulty: 'łatwy',
    steps: [
      'Przełóż linę przez oko/dookoła pala.',
      'Zrób półsztyk wokół liny głównej.',
      'Zrób drugi identyczny półsztyk w tę samą stronę.',
      'Dociągnij oba do siebie i do punktu mocowania.',
    ],
  },
]

/* ---------- Ilustracje węzłów (schematyczne) ---------- */

const ROPE = '#c9a15a'
const ROPE_D = '#8a6b30'
const SEA = '#0d2233'

function KnotArt({ id, size = 120 }: { id: string; size?: number }) {
  const common = {
    fill: 'none',
    stroke: ROPE,
    strokeWidth: 9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  const under = { ...common, stroke: ROPE_D, strokeWidth: 9 }
  const gap = { fill: 'none', stroke: SEA, strokeWidth: 15, strokeLinecap: 'round' as const }

  let body: JSX.Element
  switch (id) {
    case 'bowline':
      body = (
        <>
          <ellipse cx="60" cy="82" rx="30" ry="28" {...common} />
          <path d="M60 54 V16" {...common} />
          <circle cx="60" cy="54" r="12" {...under} />
          <path d="M52 46 q 8 -14 24 -6" {...gap} />
          <path d="M52 46 q 8 -14 24 -6" {...common} />
        </>
      )
      break
    case 'eight':
      body = (
        <>
          <path d="M60 14 C 34 26 34 48 60 58 C 86 68 86 92 60 104" {...common} />
          <path d="M60 58 C 40 50 40 30 62 24" {...gap} />
          <path d="M60 58 C 40 50 40 30 62 24" {...common} />
          <path d="M60 104 C 78 96 80 78 60 72" {...common} />
        </>
      )
      break
    case 'reef':
      body = (
        <>
          <path d="M14 46 C 44 40 52 66 84 60" {...common} />
          <path d="M106 46 C 76 40 68 66 36 60" {...gap} />
          <path d="M106 46 C 76 40 68 66 36 60" {...common} />
          <path d="M14 74 C 44 80 52 54 84 60" {...common} />
        </>
      )
      break
    case 'clove':
      body = (
        <>
          <rect x="52" y="10" width="16" height="100" rx="6" fill="#3a4a55" />
          <path d="M20 44 H100" {...gap} />
          <path d="M20 44 H100" {...common} />
          <path d="M100 44 C 40 54 40 66 20 76" {...common} />
          <path d="M20 76 H100" {...gap} />
          <path d="M20 76 H100" {...common} />
        </>
      )
      break
    case 'cleat':
      body = (
        <>
          <rect x="26" y="58" width="68" height="12" rx="6" fill="#3a4a55" />
          <circle cx="30" cy="64" r="9" fill="#3a4a55" />
          <circle cx="90" cy="64" r="9" fill="#3a4a55" />
          <path d="M20 96 C 40 84 44 60 60 64" {...common} />
          <path d="M60 64 C 78 68 84 48 100 40" {...common} />
          <path d="M52 76 C 66 72 74 82 88 78" {...gap} />
          <path d="M52 76 C 66 72 74 82 88 78" {...common} />
        </>
      )
      break
    case 'twohalf':
    default:
      body = (
        <>
          <circle cx="30" cy="60" r="14" fill="none" stroke="#3a4a55" strokeWidth="8" />
          <path d="M44 60 H104" {...common} />
          <path d="M70 60 c 0 -18 24 -18 24 0 s -24 18 -24 0" {...common} />
          <path d="M84 60 c 0 -18 24 -18 24 0" transform="translate(-6 0)" {...gap} />
          <path d="M64 60 c 0 -16 22 -16 22 0 s -22 16 -22 0" {...common} />
        </>
      )
  }

  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className="drop-shadow">
      {body}
    </svg>
  )
}

export default function Wezly() {
  const [sel, setSel] = useState<Knot>(KNOTS[0])

  return (
    <div>
      <PageHeader eyebrow="Węzły" title="Węzły żeglarskie">
        Dobry żeglarz wiąże kilka węzłów bez patrzenia. Poznaj sześć podstawowych — do czego
        służą i jak je zawiązać krok po kroku. Kliknij węzeł, aby zobaczyć szczegóły.
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {KNOTS.map((k) => (
            <button
              key={k.id}
              onClick={() => setSel(k)}
              className={`card flex flex-col items-center p-4 transition-all hover:-translate-y-0.5 ${
                sel.id === k.id ? 'ring-2 ring-brine-400' : ''
              }`}
            >
              <KnotArt id={k.id} size={96} />
              <span className="mt-2 text-center text-sm font-medium text-white">{k.name}</span>
              <span className="text-xs text-brine-100/60">{k.alt}</span>
            </button>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div key={sel.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/5 p-2">
                <KnotArt id={sel.id} size={90} />
              </div>
              <div>
                <h3 className="font-display text-xl font-700 text-white">{sel.name}</h3>
                <div className="text-xs text-brine-100/60">{sel.alt}</div>
                <span className="chip mt-2">trudność: {sel.difficulty}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Zastosowanie</div>
              <p className="mt-1 text-sm text-brine-100/90">{sel.use}</p>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Jak zawiązać</div>
              <ol className="mt-2 space-y-2">
                {sel.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-brine-100/90">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brine-500 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
