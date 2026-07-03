import { useState } from 'react'
import { motion } from 'framer-motion'
import Buoy, { type BodyShape, type TopMark, type Band, bandColor } from './Buoy'

const R = bandColor('red')
const G = bandColor('green')
const Y = bandColor('yellow')
const B = bandColor('black')

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

interface Info {
  id: string
  name: string
  desc: string
}

const ZONES: Record<string, Info> = {
  szlak: {
    id: 'szlak',
    name: 'Szlak żeglowny (tor wodny)',
    desc: 'Bezpieczny, oznakowany korytarz o odpowiedniej głębokości. Wchodząc do portu trzymaj się między znakami bocznymi: czerwone zostawiaj po lewej burcie, zielone po prawej.',
  },
  mielizna: {
    id: 'mielizna',
    name: 'Mielizna (płycizna)',
    desc: 'Obszar płytkiej wody — grozi wejściem na dno. Otoczona czterema znakami kardynalnymi (N/E/S/W), które mówią, z której strony jest bezpieczna, głęboka woda. Na mapie zaznaczona jaśniejszym, piaszczystym kolorem i izobatą.',
  },
  port: {
    id: 'port',
    name: 'Wejście do portu',
    desc: 'Przejście między główkami falochronów. Zwolnij, ustąp większym jednostkom i wchodź zgodnie ze znakami oraz sygnałami portowymi.',
  },
}

// znaki kardynalne otaczające mieliznę
const cardinal = (
  id: string,
  name: string,
  desc: string,
  x: number,
  y: number,
  bands: Band[],
  topmark: TopMark,
): MapMark => ({ id, name, desc, x, y, size: 48, shape: 'pillar', bands, topmark, topColor: B })

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
    y: 288,
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
    y: 288,
    size: 40,
    shape: 'cone',
    bands: [{ color: G, from: 0, to: 1 }],
    topmark: 'cone-up',
    topColor: G,
  },
  // 4 znaki kardynalne wokół mielizny
  cardinal(
    'cardN',
    'Znak kardynalny N (północny)',
    'Bezpieczna, głęboka woda jest na PÓŁNOC od znaku (u góry) — mijaj go od północy. Dwa czarne stożki wierzchołkami w górę, czarny pas u góry.',
    712,
    198,
    [
      { color: B, from: 0.5, to: 1 },
      { color: Y, from: 0, to: 0.5 },
    ],
    'cones-up',
  ),
  cardinal(
    'cardE',
    'Znak kardynalny E (wschodni)',
    'Bezpieczna woda jest na WSCHÓD od znaku — mijaj go od wschodu. Stożki podstawami do siebie; czarny-żółty-czarny.',
    852,
    322,
    [
      { color: B, from: 0.66, to: 1 },
      { color: Y, from: 0.33, to: 0.66 },
      { color: B, from: 0, to: 0.33 },
    ],
    'cones-base',
  ),
  cardinal(
    'cardS',
    'Znak kardynalny S (południowy)',
    'Bezpieczna woda jest na POŁUDNIE od znaku — mijaj go od południa. Stożki wierzchołkami w dół; żółty u góry, czarny na dole.',
    712,
    458,
    [
      { color: Y, from: 0.5, to: 1 },
      { color: B, from: 0, to: 0.5 },
    ],
    'cones-down',
  ),
  cardinal(
    'cardW',
    'Znak kardynalny W (zachodni)',
    'Bezpieczna woda jest na ZACHÓD od znaku — mijaj go od zachodu. Stożki wierzchołkami do siebie; żółty-czarny-żółty.',
    574,
    322,
    [
      { color: Y, from: 0.66, to: 1 },
      { color: B, from: 0.33, to: 0.66 },
      { color: Y, from: 0, to: 0.33 },
    ],
    'cones-point',
  ),
  {
    id: 'danger',
    name: 'Znak izolowanego niebezpieczeństwa',
    desc: 'Postawiony NA odosobnionej przeszkodzie w głębokiej wodzie (samotna skała, wrak). Czarny z czerwonym pasem i dwiema czarnymi kulami na topie. Omijaj z każdej strony.',
    x: 205,
    y: 430,
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
]

type Storm = 0 | 40 | 90

function stormInfo(level: Storm): Info {
  const base =
    ' Pulsujące światło widać z 8–9 km w dzień i w nocy. Kliknij wieżę, aby przełączyć poziom.'
  const desc =
    level === 0
      ? 'Brak ostrzeżeń — światło nie miga, warunki w normie.'
      : level === 40
        ? 'OSTRZEŻENIE (40 błysków/min): spodziewane burze i silniejszy wiatr. Zachowaj czujność, rozważ powrót do portu.'
        : 'ALARM — NIEBEZPIECZEŃSTWO (90 błysków/min): burza i silny wiatr w najbliższym czasie. Natychmiast schodź z wody / wracaj do portu.'
  return { id: 'storm', name: 'Wieża sygnalizacji ostrzegawczej (Mazury)', desc: desc + base }
}

export default function LocjaMap() {
  const [sel, setSel] = useState<Info | null>(null)
  const [storm, setStorm] = useState<Storm>(40)

  const lampColor = storm === 0 ? '#5b6b76' : storm === 40 ? Y : R
  const period = storm === 90 ? 0.667 : storm === 40 ? 1.5 : 0

  function cycleStorm() {
    const next: Storm = storm === 0 ? 40 : storm === 40 ? 90 : 0
    setStorm(next)
    setSel(stormInfo(next))
  }

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

            <rect x="0" y="0" width={W} height={H} fill="url(#mapsea)" />
            <rect x="0" y="0" width={W} height={H} fill="url(#waves)" />

            {/* SZLAK */}
            <g onClick={() => setSel(ZONES.szlak)} style={{ cursor: 'pointer' }}>
              <path
                d={`M 402 ${H} L 498 ${H} L 470 150 L 430 150 Z`}
                fill="rgba(123,188,217,0.14)"
                stroke="rgba(123,188,217,0.35)"
                strokeWidth="2"
                strokeDasharray="2 8"
              />
              <line x1="450" y1={H - 10} x2="450" y2="160" stroke="rgba(123,188,217,0.4)" strokeWidth="1.5" strokeDasharray="10 10" />
              <text x="352" y="470" textAnchor="end" fill="rgba(207,230,240,0.8)" fontSize="16" fontWeight="600">
                szlak
              </text>
            </g>

            {/* MIELIZNA */}
            <g onClick={() => setSel(ZONES.mielizna)} style={{ cursor: 'pointer' }}>
              <ellipse cx="712" cy="322" rx="118" ry="86" fill="rgba(226,206,150,0.22)" />
              <ellipse cx="712" cy="322" rx="118" ry="86" fill="none" stroke="rgba(226,206,150,0.5)" strokeWidth="2" strokeDasharray="7 7" />
              <ellipse cx="712" cy="322" rx="72" ry="48" fill="rgba(226,206,150,0.3)" />
              <text x="712" y="326" textAnchor="middle" fill="rgba(120,100,60,0.95)" fontSize="15" fontWeight="700">
                mielizna
              </text>
            </g>

            {/* SAMOTNA SKAŁA pod znakiem izolowanego niebezpieczeństwa */}
            <g onClick={() => setSel(MARKS.find((m) => m.id === 'danger')!)} style={{ cursor: 'pointer' }}>
              <ellipse cx="205" cy="452" rx="34" ry="16" fill="rgba(120,110,90,0.25)" />
              <path d="M192 452 l7 -15 l6 12 l6 -18 l7 21 l-26 0 z" fill="#6b5a3a" />
            </g>

            {/* LĄD / PORT */}
            <g onClick={() => setSel(ZONES.port)} style={{ cursor: 'pointer' }}>
              <rect x="150" y="0" width="600" height="120" fill="#0c2136" />
              <path d="M0 0 H405 V70 Q405 96 380 100 L150 100 Q120 100 120 70 V0 Z" fill="#26402f" stroke="#3a5a44" strokeWidth="2" />
              <path d="M900 0 H495 V70 Q495 96 520 100 L760 100 Q790 100 790 70 V0 Z" fill="#26402f" stroke="#3a5a44" strokeWidth="2" />
              <rect x="398" y="96" width="10" height="60" rx="4" fill="#33513e" />
              <rect x="492" y="96" width="10" height="60" rx="4" fill="#33513e" />
              <circle cx="403" cy="156" r="7" fill={R} stroke="#0f2b3f" strokeWidth="2" />
              <circle cx="497" cy="156" r="7" fill={G} stroke="#0f2b3f" strokeWidth="2" />
              <rect x="620" y="30" width="70" height="8" rx="3" fill="#3a5a44" />
              <text x="300" y="52" fill="rgba(207,230,240,0.85)" fontSize="18" fontWeight="700">
                PORT
              </text>
              <text x="450" y="132" textAnchor="middle" fill="rgba(207,230,240,0.8)" fontSize="13" fontWeight="600">
                wejście do portu
              </text>
            </g>
          </svg>

          {/* PŁAWY jako klikalne nakładki */}
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

          {/* WIEŻA SYGNALIZACJI OSTRZEGAWCZEJ (interaktywna) */}
          <button
            onClick={cycleStorm}
            className={`group absolute -translate-x-1/2 -translate-y-full outline-none ${
              sel?.id === 'storm' ? 'ring-2 ring-white/80 rounded-lg' : ''
            }`}
            style={{ left: `${(128 / W) * 100}%`, top: `${(101 / H) * 100}%` }}
            title="Wieża sygnalizacji ostrzegawczej — kliknij, aby zmienić poziom"
          >
            <svg width="46" height="92" viewBox="0 0 46 92" className="transition-transform group-hover:scale-105">
              {/* światło / poświata */}
              {storm !== 0 && (
                <motion.circle
                  cx="23"
                  cy="16"
                  r="15"
                  fill={lampColor}
                  animate={{ opacity: [0.35, 0, 0.35] }}
                  transition={{ duration: period, repeat: Infinity, ease: 'easeInOut' }}
                  opacity="0.2"
                />
              )}
              {/* wieża kratownicowa */}
              <polygon points="15,88 31,88 27,26 19,26" fill="#4a5a64" stroke="#2b3942" strokeWidth="1.5" />
              <line x1="17" y1="70" x2="29" y2="70" stroke="#2b3942" strokeWidth="1.2" />
              <line x1="18" y1="52" x2="28" y2="52" stroke="#2b3942" strokeWidth="1.2" />
              <line x1="19" y1="38" x2="27" y2="38" stroke="#2b3942" strokeWidth="1.2" />
              <line x1="15" y1="88" x2="27" y2="26" stroke="#2b3942" strokeWidth="1" opacity="0.6" />
              <line x1="31" y1="88" x2="19" y2="26" stroke="#2b3942" strokeWidth="1" opacity="0.6" />
              {/* lampa */}
              <rect x="15" y="12" width="16" height="16" rx="3" fill="#37474f" stroke="#22303a" strokeWidth="1.5" />
              <motion.circle
                cx="23"
                cy="20"
                r="6"
                fill={lampColor}
                animate={storm !== 0 ? { opacity: [1, 0.12, 1] } : { opacity: 0.3 }}
                transition={storm !== 0 ? { duration: period, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
              />
            </svg>
            <span className="mt-0.5 block rounded bg-black/40 px-1 text-center text-[9px] font-bold text-white">
              {storm === 0 ? 'spokój' : `${storm}/min`}
            </span>
          </button>
        </div>
      </div>

      {/* PANEL OPISU */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <motion.div key={sel?.id ?? 'hint'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          {sel ? (
            <>
              <div className="chip mb-2">{sel.id === 'storm' ? 'Sygnalizacja pogody' : 'Element mapy'}</div>
              <h3 className="font-display text-xl font-700 text-white">{sel.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brine-100/90">{sel.desc}</p>
              {sel.id === 'storm' && (
                <div className="mt-4 flex gap-2">
                  {([0, 40, 90] as Storm[]).map((lv) => (
                    <button
                      key={lv}
                      onClick={() => {
                        setStorm(lv)
                        setSel(stormInfo(lv))
                      }}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                        storm === lv ? 'bg-brine-500 text-white' : 'bg-white/5 text-brine-100 hover:bg-white/10'
                      }`}
                    >
                      {lv === 0 ? 'spokój' : `${lv}/min`}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="font-display text-lg font-700 text-white">Interaktywna mapa akwenu 🗺️</h3>
              <p className="mt-2 text-sm leading-relaxed text-brine-100/80">
                Klikaj pławy, obszary (szlak, mielizna, port) oraz wieżę sygnalizacji, aby poznać
                ich znaczenie. Mielizna jest otoczona czterema znakami kardynalnymi wskazującymi
                bezpieczną wodę z każdej strony.
              </p>
            </>
          )}
        </motion.div>

        <div className="card mt-4 p-5 text-sm text-brine-100/80">
          <p className="font-semibold text-white">Legenda</p>
          <ul className="mt-2 space-y-1.5">
            <li>🔴 znak lewej strony · 🟢 prawej strony toru</li>
            <li>⚫🟡 znaki kardynalne N/E/S/W (wokół mielizny)</li>
            <li>⚫🔴 izolowane niebezpieczeństwo (na skale)</li>
            <li>🔴⚪ bezpieczna woda / oś toru</li>
            <li>🗼 wieża sygnalizacji sztormowej (Mazury)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
