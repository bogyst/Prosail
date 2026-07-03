import { useState } from 'react'
import { motion } from 'framer-motion'
import Buoy, { type BodyShape, type TopMark, type Band, bandColor } from './Buoy'

const R = bandColor('red')
const G = bandColor('green')
const Y = bandColor('yellow')
const B = bandColor('black')

// szerokość/wysokość układu współrzędnych mapy
const W = 900
const H = 560

interface MapMark {
  id: string
  name: string
  desc: string
  x: number
  y: number
  size: number
  shape: BodyShape
  bands: Band[]
  topmark?: TopMark
  topColor?: string
}

interface Zone {
  id: string
  name: string
  desc: string
}

const ZONES: Record<string, Zone> = {
  szlak: {
    id: 'szlak',
    name: 'Szlak żeglowny (tor wodny)',
    desc: 'Bezpieczny, oznakowany korytarz o odpowiedniej głębokości. Wchodząc do portu trzymaj się między znakami bocznymi: czerwone zostawiaj po lewej burcie, zielone po prawej.',
  },
  mielizna: {
    id: 'mielizna',
    name: 'Mielizna (płycizna)',
    desc: 'Obszar płytkiej wody — grozi wejściem na dno. Na mapie zaznaczona jaśniejszym, piaszczystym kolorem i izobatą (linią równej głębokości). Omijaj z dala.',
  },
  port: {
    id: 'port',
    name: 'Wejście do portu',
    desc: 'Przejście między główkami falochronów. Zwolnij, ustąp większym jednostkom i wchodź zgodnie ze znakami oraz sygnałami portowymi.',
  },
}

const MARKS: MapMark[] = [
  {
    id: 'safe',
    name: 'Znak bezpiecznej wody',
    desc: 'Dookoła żeglowna, bezpieczna woda. Często oznacza oś toru lub podejście z morza. Czerwono-białe pionowe pasy, czerwona kula na topie.',
    x: 450,
    y: 500,
    size: 44,
    shape: 'sphere',
    bands: [
      { color: R, from: 0, to: 0.22 },
      { color: R, from: 0.4, to: 0.6 },
      { color: R, from: 0.78, to: 1 },
    ],
    topmark: 'sphere',
    topColor: R,
  },
  {
    id: 'red1',
    name: 'Znak lewej strony szlaku',
    desc: 'Czerwona, walcowata pława — lewa krawędź toru. Wchodząc do portu zostaw ją po lewej burcie (bakburcie).',
    x: 372,
    y: 405,
    size: 40,
    shape: 'can',
    bands: [{ color: R, from: 0, to: 1 }],
    topmark: 'can',
    topColor: R,
  },
  {
    id: 'red2',
    name: 'Znak lewej strony szlaku',
    desc: 'Czerwona, walcowata pława — lewa krawędź toru. Wchodząc do portu zostaw ją po lewej burcie (bakburcie).',
    x: 388,
    y: 285,
    size: 40,
    shape: 'can',
    bands: [{ color: R, from: 0, to: 1 }],
    topmark: 'can',
    topColor: R,
  },
  {
    id: 'green1',
    name: 'Znak prawej strony szlaku',
    desc: 'Zielona, stożkowa pława — prawa krawędź toru. Wchodząc do portu zostaw ją po prawej burcie (sterburcie).',
    x: 528,
    y: 405,
    size: 40,
    shape: 'cone',
    bands: [{ color: G, from: 0, to: 1 }],
    topmark: 'cone-up',
    topColor: G,
  },
  {
    id: 'green2',
    name: 'Znak prawej strony szlaku',
    desc: 'Zielona, stożkowa pława — prawa krawędź toru. Wchodząc do portu zostaw ją po prawej burcie (sterburcie).',
    x: 512,
    y: 285,
    size: 40,
    shape: 'cone',
    bands: [{ color: G, from: 0, to: 1 }],
    topmark: 'cone-up',
    topColor: G,
  },
  {
    id: 'danger',
    name: 'Znak izolowanego niebezpieczeństwa',
    desc: 'Postawiony NA odosobnionej przeszkodzie (skała, wrak). Czarny z czerwonym pasem i dwiema czarnymi kulami na topie. Omijaj z każdej strony.',
    x: 712,
    y: 300,
    size: 50,
    shape: 'pillar',
    bands: [
      { color: B, from: 0.66, to: 1 },
      { color: R, from: 0.33, to: 0.66 },
      { color: B, from: 0, to: 0.33 },
    ],
    topmark: 'spheres',
    topColor: B,
  },
  {
    id: 'cardinalE',
    name: 'Znak kardynalny E (wschodni)',
    desc: 'Bezpieczna, głęboka woda jest na WSCHÓD od znaku — mijaj go od strony wschodniej. Czarny-żółty-czarny, stożki podstawami do siebie.',
    x: 818,
    y: 312,
    size: 50,
    shape: 'pillar',
    bands: [
      { color: B, from: 0.66, to: 1 },
      { color: Y, from: 0.33, to: 0.66 },
      { color: B, from: 0, to: 0.33 },
    ],
    topmark: 'cones-base',
    topColor: B,
  },
]

export default function LocjaMap() {
  const [sel, setSel] = useState<{ id: string; name: string; desc: string } | null>(null)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* MAPA */}
      <div className="card overflow-hidden p-0">
        <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="mapsea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f3a56" />
                <stop offset="100%" stopColor="#0a2a40" />
              </linearGradient>
              <pattern id="waves" width="60" height="26" patternUnits="userSpaceOnUse">
                <path d="M0 13 q 15 -8 30 0 t 30 0" fill="none" stroke="rgba(123,188,217,0.08)" strokeWidth="2" />
              </pattern>
            </defs>

            {/* morze */}
            <rect x="0" y="0" width={W} height={H} fill="url(#mapsea)" />
            <rect x="0" y="0" width={W} height={H} fill="url(#waves)" />

            {/* SZLAK (tor wodny) */}
            <g onClick={() => setSel(ZONES.szlak)} style={{ cursor: 'pointer' }}>
              <path
                d={`M 402 ${H} L 498 ${H} L 470 150 L 430 150 Z`}
                fill="rgba(123,188,217,0.14)"
                stroke="rgba(123,188,217,0.35)"
                strokeWidth="2"
                strokeDasharray="2 8"
              />
              <line x1="450" y1={H - 10} x2="450" y2="160" stroke="rgba(123,188,217,0.4)" strokeWidth="1.5" strokeDasharray="10 10" />
              <text x="512" y="470" fill="rgba(207,230,240,0.8)" fontSize="16" fontWeight="600">
                szlak
              </text>
            </g>

            {/* MIELIZNA */}
            <g onClick={() => setSel(ZONES.mielizna)} style={{ cursor: 'pointer' }}>
              <ellipse cx="712" cy="315" rx="150" ry="105" fill="rgba(226,206,150,0.22)" />
              <ellipse cx="712" cy="315" rx="150" ry="105" fill="none" stroke="rgba(226,206,150,0.5)" strokeWidth="2" strokeDasharray="7 7" />
              <ellipse cx="712" cy="315" rx="92" ry="60" fill="rgba(226,206,150,0.28)" />
              {/* skała pod znakiem izolowanego niebezpieczeństwa */}
              <path d="M700 322 l7 -14 l7 14 l12 -8 l-6 16 l-26 0 l-6 -16 z" fill="#6b5a3a" opacity="0.9" />
              <text x="712" y="250" textAnchor="middle" fill="rgba(233,220,192,0.9)" fontSize="15" fontWeight="600">
                mielizna
              </text>
            </g>

            {/* LĄD / PORT */}
            <g onClick={() => setSel(ZONES.port)} style={{ cursor: 'pointer' }}>
              {/* basen portu (spokojna woda) */}
              <rect x="150" y="0" width="600" height="120" fill="#0c2136" />
              {/* ląd lewy i prawy z przerwą na wejście */}
              <path d="M0 0 H405 V70 Q405 96 380 100 L150 100 Q120 100 120 70 V0 Z" fill="#26402f" stroke="#3a5a44" strokeWidth="2" />
              <path d="M900 0 H495 V70 Q495 96 520 100 L760 100 Q790 100 790 70 V0 Z" fill="#26402f" stroke="#3a5a44" strokeWidth="2" />
              {/* główki falochronów */}
              <rect x="398" y="96" width="10" height="60" rx="4" fill="#33513e" />
              <rect x="492" y="96" width="10" height="60" rx="4" fill="#33513e" />
              <circle cx="403" cy="156" r="7" fill={R} stroke="#0f2b3f" strokeWidth="2" />
              <circle cx="497" cy="156" r="7" fill={G} stroke="#0f2b3f" strokeWidth="2" />
              {/* pomosty */}
              <rect x="180" y="30" width="70" height="8" rx="3" fill="#3a5a44" />
              <rect x="640" y="30" width="70" height="8" rx="3" fill="#3a5a44" />
              <text x="250" y="60" fill="rgba(207,230,240,0.85)" fontSize="18" fontWeight="700">
                PORT
              </text>
              <text x="450" y="132" textAnchor="middle" fill="rgba(207,230,240,0.8)" fontSize="13" fontWeight="600">
                wejście do portu
              </text>
            </g>
          </svg>

          {/* PŁAWY jako klikalne nakładki HTML */}
          {MARKS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSel(m)}
              className="group absolute -translate-x-1/2 -translate-y-[92%] outline-none"
              style={{ left: `${(m.x / W) * 100}%`, top: `${(m.y / H) * 100}%` }}
              title={m.name}
            >
              <span
                className={`block rounded-lg transition-all group-hover:scale-110 ${
                  sel?.id === m.id ? 'ring-2 ring-white/80' : ''
                }`}
              >
                <Buoy shape={m.shape} bands={m.bands} topmark={m.topmark} topColor={m.topColor} size={m.size} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PANEL OPISU */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <motion.div
          key={sel?.name ?? 'hint'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          {sel ? (
            <>
              <div className="chip mb-2">Element mapy</div>
              <h3 className="font-display text-xl font-700 text-white">{sel.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brine-100/90">{sel.desc}</p>
            </>
          ) : (
            <>
              <h3 className="font-display text-lg font-700 text-white">Interaktywna mapa akwenu 🗺️</h3>
              <p className="mt-2 text-sm leading-relaxed text-brine-100/80">
                Klikaj pławy oraz obszary (szlak, mielizna, port), aby poznać ich znaczenie.
                Jacht wchodzący z morza trzyma się osi toru — czerwone znaki po lewej, zielone
                po prawej burcie.
              </p>
            </>
          )}
        </motion.div>

        <div className="card mt-4 p-5 text-sm text-brine-100/80">
          <p className="font-semibold text-white">Legenda</p>
          <ul className="mt-2 space-y-1.5">
            <li>🔴 znak lewej strony · 🟢 prawej strony</li>
            <li>⚫ izolowane niebezpieczeństwo (na przeszkodzie)</li>
            <li>⚫🟡 znak kardynalny (bezpieczna woda po danej stronie)</li>
            <li>🔴⚪ bezpieczna woda / oś toru</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
