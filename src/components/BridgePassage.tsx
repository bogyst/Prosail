import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import Illustration from './Illustration'
import DiagramFrame from './DiagramFrame'

const Y = '#f4c430'
const R = '#d63a3f'
const WH = '#f5f2ea'
const BK = '#1a1a1a'

function Board({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 90 90" width="92" height="92" className="shrink-0">
      {children}
    </svg>
  )
}

// żółty romb (kwadrat na wierzchołku)
const YellowDiamond = (
  <Board>
    <polygon points="45,8 82,45 45,82 8,45" fill={Y} stroke="#b8930f" strokeWidth="3" />
  </Board>
)

interface BridgeSign {
  name: string
  desc: string
  /** Opcjonalny obrazek zamiast rysunku, np. '/znaki/most-skrajnia.webp'. */
  img?: string
  svg: ReactNode
}

const SIGNS: BridgeSign[] = [
  {
    name: 'Przejście zalecane — oba kierunki',
    desc: 'Żółty romb pod przęsłem oznacza zalecane przejście (przęsło żeglowne). Widoczny z obu stron = ruch dozwolony w obu kierunkach.',
    svg: YellowDiamond,
  },
  {
    name: 'Przejście zalecane — jeden kierunek',
    desc: 'Żółty romb widoczny z jednej strony, a z przeciwnej — znak zakazu wejścia (czerwony). Oznacza ruch tylko w jednym kierunku; z drugiej strony trzeba czekać.',
    svg: (
      <Board>
        <polygon points="30,12 55,37 30,62 5,37" fill={Y} stroke="#b8930f" strokeWidth="2.5" />
        <rect x="52" y="30" width="34" height="34" rx="4" fill={WH} stroke={R} strokeWidth="5" />
        <rect x="58" y="44" width="22" height="6" fill={R} />
      </Board>
    ),
  },
  {
    name: 'A.10 — zakaz przejścia poza skrajnią',
    desc: 'Dwie czerwono‑biało‑czerwone tablice (kwadraty na wierzchołku) wyznaczają światło mostu / jazu. Nie wolno przechodzić poza przestrzenią między nimi.',
    svg: (
      <Board>
        {[26, 64].map((cx) => (
          <g key={cx} transform={`translate(${cx} 45) rotate(45)`}>
            <rect x="-16" y="-16" width="32" height="32" fill={WH} stroke={BK} strokeWidth="1.5" />
            <rect x="-16" y="-16" width="32" height="10" fill={R} />
            <rect x="-16" y="6" width="32" height="10" fill={R} />
          </g>
        ))}
      </Board>
    ),
  },
  {
    name: 'Skrajnia pionowa (wysokość nad wodą)',
    desc: 'Tablica podaje maksymalną wysokość jednostki nad lustrem wody, przy której bezpiecznie przejdziesz pod mostem, linią lub rurociągiem. Uwzględnij aktualny stan wody!',
    svg: (
      <Board>
        <rect x="12" y="16" width="66" height="58" rx="5" fill={WH} stroke={BK} strokeWidth="3" />
        <g stroke={BK} strokeWidth="4" strokeLinecap="round" fill={BK}>
          <line x1="45" y1="26" x2="45" y2="64" />
          <polygon points="45,22 39,34 51,34" />
          <polygon points="45,68 39,56 51,56" />
        </g>
        <text x="66" y="50" textAnchor="middle" fontSize="15" fontWeight="800" fill={BK}>
          3,0
        </text>
        <text x="45" y="88" textAnchor="middle" fontSize="10" fill="#4a5a64">
          metry
        </text>
      </Board>
    ),
  },
  {
    name: 'Zakaz przejścia (przęsło zamknięte)',
    desc: 'Czerwono‑biało‑czerwona tablica (lub czerwone światła) nad przęsłem = przejście zabronione. Wybierz inne przęsło żeglowne.',
    svg: (
      <Board>
        <rect x="14" y="20" width="62" height="50" rx="5" fill={WH} stroke={BK} strokeWidth="2" />
        <rect x="14" y="20" width="62" height="15" fill={R} />
        <rect x="14" y="55" width="62" height="15" fill={R} />
      </Board>
    ),
  },
]

export default function BridgePassage() {
  return (
    <div>
      {/* schemat mostu */}
      <div className="card mb-6 min-w-0 p-4">
        <DiagramFrame minWidth={600}>
        <svg viewBox="0 0 640 260" className="w-full">
          <defs>
            <linearGradient id="bp-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#123f5b" />
              <stop offset="100%" stopColor="#0a2438" />
            </linearGradient>
            <linearGradient id="bp-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c2537" />
              <stop offset="100%" stopColor="#0a1c2b" />
            </linearGradient>
            <clipPath id="bp-frame">
              <rect x="0" y="0" width="640" height="260" rx="14" />
            </clipPath>
          </defs>
          {/* Scena jest zawsze ciemna (także w trybie dziennym) — bez własnego
              tła jasne napisy ginęły na białej karcie. */}
          <rect x="0" y="0" width="640" height="260" rx="14" fill="url(#bp-sky)" />
          <g clipPath="url(#bp-frame)">
          <rect x="0" y="150" width="640" height="110" fill="url(#bp-water)" />
          {/* przęsło / most */}
          <rect x="0" y="40" width="640" height="34" fill="#4a5a64" />
          <rect x="0" y="74" width="640" height="8" fill="#33434d" />
          {/* filary */}
          <rect x="70" y="74" width="34" height="120" fill="#3a4a54" />
          <rect x="536" y="74" width="34" height="120" fill="#3a4a54" />
          {/* przęsło żeglowne w środku — tablice skrajni A.10 */}
          {[210, 430].map((x) => (
            <g key={x} transform={`translate(${x} 100) rotate(45)`}>
              <rect x="-13" y="-13" width="26" height="26" fill={WH} stroke={BK} strokeWidth="1.2" />
              <rect x="-13" y="-13" width="26" height="8" fill={R} />
              <rect x="-13" y="5" width="26" height="8" fill={R} />
            </g>
          ))}
          {/* żółty romb — zalecane przejście */}
          <polygon points="320,86 344,110 320,134 296,110" fill={Y} stroke="#b8930f" strokeWidth="2.5" />
          {/* skrajnia pionowa */}
          <g stroke="#cfe6f0" strokeWidth="2" strokeLinecap="round" fill="#cfe6f0">
            <line x1="470" y1="82" x2="470" y2="150" strokeDasharray="4 4" />
            <polygon points="470,84 466,92 474,92" />
            <polygon points="470,148 466,140 474,140" />
          </g>
          <text x="478" y="120" fill="#cfe6f0" fontSize="12" fontWeight="700">
            prześwit 3,0 m
          </text>
          {/* jacht przechodzący pod przęsłem */}
          <g transform="translate(320 176)">
            <path d="M-40 0 L34 0 C 44 0, 44 12, 34 14 L-40 14 C -48 12, -48 2, -40 0 Z" fill="#e8dcc0" stroke="#0f2b3f" strokeWidth="2" />
            <line x1="-6" y1="2" x2="-6" y2="-40" stroke="#c9a15a" strokeWidth="3" />
          </g>
          <text x="320" y="214" textAnchor="middle" fill="rgba(207,230,240,0.9)" fontSize="12" fontWeight="700">
            przęsło żeglowne (żółty romb) — mijaj między tablicami skrajni
          </text>
          </g>
        </svg>
        </DiagramFrame>
      </div>

      <p className="lead mb-5 max-w-3xl">
        Pod mostami i jazami spotkasz osobne znaki: żółte oznaczają <b className="text-navy">zalecane
        przejście</b> i kierunek ruchu, a czerwono‑białe wyznaczają <b className="text-navy">skrajnię</b>
        (dozwoloną przestrzeń) i zakazy. Zawsze sprawdź <b className="text-navy">wysokość prześwitu</b>{' '}
        względem masztu i aktualnego stanu wody.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SIGNS.map((s) => (
          <motion.div key={s.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card flex items-center gap-4 p-4">
            <div className="shrink-0 rounded-lg bg-white/5 p-1">
              <Illustration img={s.img} alt={`Znak: ${s.name}`} className="h-[92px] w-[92px] object-contain">
                {s.svg}
              </Illustration>
            </div>
            <div>
              <h3 className="font-display text-base font-700 text-navy">{s.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-brine-100/80">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
