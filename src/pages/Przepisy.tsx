import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader, Term } from '../components/ui'
import Illustration from '../components/Illustration'
import { ShieldCheck, Milestone, Volume2, Signpost, Award } from 'lucide-react'

/* ===================== PRAWO DROGI ===================== */

type Status = 'stand' | 'give' | 'both'

interface BoatSpec {
  x: number
  y: number
  heading: number
  label: string
  status: Status
}

interface Scenario {
  id: string
  title: string
  rule: string
  explain: string
  boats: [BoatSpec, BoatSpec]
  bothGiveWay?: boolean
}

const SCENARIOS: Scenario[] = [
  {
    id: 'tacks',
    title: 'Przeciwne halsy',
    rule: 'Pierwszeństwo ma jacht na halsie prawym.',
    explain:
      'Gdy dwa jachty zbliżają się na przeciwnych halsach, ustępuje ten na halsie lewym (wiatr z lewej burty). Hals prawy = wiatr wieje z prawej burty — na rysunku ten jacht ma dziób odchylony w lewo od linii wiatru.',
    boats: [
      { x: 300, y: 275, heading: -35, label: 'Hals prawy (pierwszeństwo)', status: 'stand' },
      { x: 140, y: 275, heading: 35, label: 'Hals lewy (ustępuje)', status: 'give' },
    ],
  },
  {
    id: 'same',
    title: 'Ten sam hals',
    rule: 'Pierwszeństwo ma jacht zawietrzny.',
    explain:
      'Gdy oba jachty są na tym samym halsie, ustępuje jacht nawietrzny (bliżej wiatru, wyżej na rysunku), a pierwszeństwo ma zawietrzny (dalej od wiatru, „pod” drugim).',
    boats: [
      { x: 250, y: 150, heading: -30, label: 'Nawietrzny (ustępuje)', status: 'give' },
      { x: 165, y: 300, heading: -30, label: 'Zawietrzny (pierwszeństwo)', status: 'stand' },
    ],
  },
  {
    id: 'overtake',
    title: 'Doganianie',
    rule: 'Jednostka doganiająca ustępuje doganianej.',
    explain:
      'Kto dogania (podchodzi z sektora rufowego, ponad 22,5° za trawersem), ten zawsze ustępuje — niezależnie od halsu czy rodzaju napędu. Doganiany utrzymuje kurs i prędkość.',
    boats: [
      { x: 220, y: 320, heading: 0, label: 'Doganiający (ustępuje)', status: 'give' },
      { x: 220, y: 150, heading: 0, label: 'Doganiany (pierwszeństwo)', status: 'stand' },
    ],
  },
  {
    id: 'power',
    title: 'Żaglówka i motorówka',
    rule: 'Jednostka o napędzie mechanicznym ustępuje żaglowej.',
    explain:
      'Na wodach śródlądowych i morskich motorówka co do zasady ustępuje jachtowi pod żaglami. Wyjątki: jacht dogania motorówkę, wąski tor wodny/duże statki, jednostki ograniczone w manewrowaniu.',
    boats: [
      { x: 130, y: 250, heading: 65, label: 'Motorówka (ustępuje)', status: 'give' },
      { x: 315, y: 250, heading: -25, label: 'Żaglówka (pierwszeństwo)', status: 'stand' },
    ],
  },
  {
    id: 'head-on',
    title: 'Kursy wprost (motorowe)',
    rule: 'Obie jednostki ustępują — każda skręca w prawo.',
    explain:
      'Dwie jednostki o napędzie mechanicznym idące wprost na siebie mijają się lewymi burtami — każda odwraca w prawo (na sterburtę). Nie ma tu jednostki „z pierwszeństwem” — obie mają ten sam obowiązek.',
    bothGiveWay: true,
    boats: [
      { x: 220, y: 320, heading: 0, label: 'A → skręca w prawo', status: 'both' },
      { x: 220, y: 150, heading: 180, label: 'B → skręca w prawo', status: 'both' },
    ],
  },
]

const COLOR: Record<Status, string> = { stand: '#1fa463', give: '#e2454a', both: '#f4952b' }

function BoatIcon({ b }: { b: BoatSpec }) {
  const color = COLOR[b.status]
  return (
    <g transform={`translate(${b.x} ${b.y}) rotate(${b.heading})`}>
      <line x1="0" y1="0" x2="0" y2="-46" stroke={color} strokeWidth="2.5" strokeDasharray="4 4" />
      <polygon points="0,-52 -5,-42 5,-42" fill={color} />
      <path d="M0 -22 C 9 -8 11 14 6 26 L -6 26 C -11 14 -9 -8 0 -22 Z" fill="#e9dcc0" stroke="#0f2b3f" strokeWidth="2" />
      <path d="M0 -18 L0 22" stroke={color} strokeWidth="3" />
      <circle cx="0" cy="2" r="30" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
    </g>
  )
}

function PrawoDrogi() {
  const [sc, setSc] = useState<Scenario>(SCENARIOS[0])
  const standOn = sc.boats.find((b) => b.status === 'stand')
  const giveWay = sc.boats.find((b) => b.status === 'give')
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="card p-4">
        <svg viewBox="0 0 440 400" className="w-full">
          <defs>
            <radialGradient id="water" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#12405c" />
              <stop offset="100%" stopColor="#081a28" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="440" height="400" rx="18" fill="url(#water)" />
          {[80, 160, 240, 320].map((y) => (
            <path key={y} d={`M0 ${y} q 20 -8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0`} fill="none" stroke="rgba(123,188,217,0.08)" strokeWidth="2" />
          ))}
          <g>
            <line x1="220" y1="16" x2="220" y2="60" stroke="#7bbcd9" strokeWidth="5" strokeLinecap="round" />
            <polygon points="220,66 214,54 226,54" fill="#7bbcd9" />
            <text x="234" y="40" fontSize="12" fontWeight="700" fill="#7bbcd9">WIATR</text>
          </g>
          {sc.boats.map((b, i) => (<BoatIcon key={i} b={b} />))}
          <g transform="translate(16 380)">
            <circle cx="8" cy="0" r="6" fill="#1fa463" /><text x="20" y="4" fontSize="12" fill="#cfe6f0">utrzymuje kurs</text>
            <circle cx="150" cy="0" r="6" fill="#e2454a" /><text x="162" y="4" fontSize="12" fill="#cfe6f0">ustępuje</text>
            <circle cx="250" cy="0" r="6" fill="#f4952b" /><text x="262" y="4" fontSize="12" fill="#cfe6f0">obie ustępują</text>
          </g>
        </svg>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button key={s.id} onClick={() => setSc(s)} className={`rounded-xl px-3 py-1.5 text-sm ${sc.id === s.id ? 'bg-brine-500 text-white' : 'bg-white/5 text-brine-100 hover:bg-white/10'}`}>{s.title}</button>
          ))}
        </div>
        <motion.div key={sc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h3 className="font-display text-xl font-700 text-navy">{sc.title}</h3>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-buoyGreen/15 p-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-buoyGreen" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-buoyGreen">Zasada</div>
              <p className="text-sm text-navy">{sc.rule}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brine-100/85">{sc.explain}</p>
          {sc.bothGiveWay ? (
            <div className="mt-4 rounded-lg bg-[#f4952b]/15 p-2 text-center text-xs">
              <div className="font-semibold text-[#f4952b]">Obie jednostki ustępują</div>
              <div className="text-navy">każda skręca w prawo (na sterburtę)</div>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-buoyGreen/15 p-2"><div className="font-semibold text-buoyGreen">Pierwszeństwo</div><div className="text-white">{standOn?.label}</div></div>
              <div className="rounded-lg bg-buoyRed/15 p-2"><div className="font-semibold text-buoyRed">Ustępuje</div><div className="text-white">{giveWay?.label}</div></div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

/* ===================== ZNAKI RUCHU WODNEGO ===================== */

/**
 * Tablica znaku żeglugowego w proporcjach wzorcowych (zmierzonych na
 * oficjalnym znaku): kwadrat, ramka o grubości 10% szerokości, a przy znakach
 * zakazu czerwony pas przekątnej TEJ SAMEJ grubości, biegnący z lewego górnego
 * do prawego dolnego narożnika. Rogi ostre — bez zaokrągleń.
 */
function Sign({
  bg,
  border,
  slash,
  native,
  children,
}: {
  bg: string
  border?: string
  slash?: boolean
  /// true = piktogram podany w siatce 100×100 (znaki obrysowane z oryginału).
  /// false/brak = starsza siatka 80×80, skalowana automatycznie.
  native?: boolean
  children: ReactNode
}) {
  return (
    <svg viewBox="0 0 100 100" width="92" height="92" className="shrink-0">
      <rect width="100" height="100" fill={bg} />
      <rect x="5" y="5" width="90" height="90" fill="none" stroke={border ?? bg} strokeWidth="10" />
      {/* Na oryginale czerwony pas przekątnej biegnie POD czarnym piktogramem. */}
      {slash && <line x1="0" y1="0" x2="100" y2="100" stroke={SIGN_RED} strokeWidth="10" />}
      {native ? children : <g transform="scale(1.25)">{children}</g>}
    </svg>
  )
}

const BK = '#000000'
const WH = '#f5f2ea'
// Czerwień taka jak na tablicach żeglugowych (zmierzona: #f60010).
const SIGN_RED = '#f60010'
const RD = SIGN_RED
const BL = '#1c6fb0'

/**
 * Piktogram znaku „zakaz cumowania” (A.7) — ścieżka obrysowana wektorowo
 * z oficjalnej tablicy, więc kształt jest wierny, a nie odtworzony z opisu.
 * Układ współrzędnych: 100×100.
 */
const MOORING_PICTOGRAM =
  'M71.33 70L71.33 64.67L67.2 64.67L63.07 64.67L62.57 62.42C61.34 56.84 60.59 52.97 60.72 52.83C60.8 52.75 65.05 53.2 70.17 53.83C77.32 54.71 79.54 54.88 79.73 54.57C80.12 53.96 80.05 52 79.64 52C78.77 52 60.23 49.64 60 49.5C59.86 49.42 59.66 48.87 59.54 48.28C59.35 47.31 59.48 47.08 61.14 45.6C63.54 43.47 66.17 39.93 67 37.74C68.36 34.14 67.47 30.68 64.51 28.07C55.53 20.17 37.3 24.53 37.34 34.57C37.35 37.75 39.1 40.81 43.25 44.92C45.58 47.22 45.67 47.38 45.41 48.42C45.18 49.29 44.94 49.52 44.15 49.61C42.89 49.76 42.33 50.23 42.33 51.14C42.33 52.02 42.92 52.67 43.73 52.67C44.06 52.67 44.33 52.81 44.33 52.99C44.33 53.17 43.81 55.81 43.17 58.86C42.52 61.9 42 64.46 42 64.53C42 64.61 37.2 64.67 31.33 64.67C20.89 64.67 20.67 64.68 20.67 65.33C20.67 65.99 20.89 66 45.33 66L70 66L70 70.67C70 75.11 70.03 75.33 70.67 75.33C71.31 75.33 71.33 75.11 71.33 70Z ' +
  'M39.58 36.41C38.83 34.56 38.85 33.52 39.68 31.8C40.39 30.33 42.38 28.57 41.85 29.88C41.04 31.87 40.64 33.42 40.41 35.5L40.16 37.83L39.58 36.41Z'

function Anchor2({ c }: { c: string }) {
  return (
    <g stroke={c} fill="none" strokeWidth="4" strokeLinecap="round">
      <circle cx="40" cy="22" r="5" fill={c} />
      <line x1="40" y1="27" x2="40" y2="58" />
      <line x1="30" y1="35" x2="50" y2="35" />
      <path d="M26 48 Q40 64 54 48" />
    </g>
  )
}

interface SignEntry {
  name: string
  desc: string
  /**
   * Opcjonalny obrazek zamiast rysunku SVG — patrz przykład „Zakaz cumowania”.
   * Plik wrzuć do `public/znaki/…`, a tutaj podaj ścieżkę: '/znaki/nazwa.webp'.
   */
  img?: string
  /** Rysunek zapasowy, używany gdy nie ma `img`. */
  svg: ReactNode
}

const SIGNS: SignEntry[] = [
  {
    name: 'Zakaz przejścia',
    desc: 'Wejście / przejście zabronione (np. tor zamknięty, wygrodzony akwen). Trzy poziome pasy czerwono‑biało‑czerwone albo czerwona tablica.',
    svg: (
      <Sign bg={WH} border={RD}>
        <rect x="16" y="24" width="48" height="10" fill={RD} />
        <rect x="16" y="46" width="48" height="10" fill={RD} />
      </Sign>
    ),
  },
  {
    name: 'Zakaz kotwiczenia',
    desc: 'Nie wolno rzucać kotwicy ani wlec łańcucha po dnie (np. nad kablem lub rurociągiem).',
    svg: (
      <Sign bg={WH} border={RD} slash>
        <Anchor2 c={BK} />
      </Sign>
    ),
  },
  {
    name: 'Zakaz cumowania (A.7)',
    desc: 'Nie wolno przybijać ani mocować jednostki do brzegu na tym odcinku. Piktogram: pachołek z liną na krawędzi pomostu, przekreślony czerwonym pasem.',
    // ↓↓↓ PRZYKŁAD PODMIANY RYSUNKU NA OBRAZEK ↓↓↓
    // Plik leży w `public/znaki/`, więc ścieżka zaczyna się od „/znaki/”.
    // Usuń tę linię, aby wrócić do rysunku SVG poniżej.
    img: '/znaki/zakaz-cumowania.webp',
    svg: (
      <Sign bg={WH} border={RD} slash native>
        <path d={MOORING_PICTOGRAM} fill={BK} fillRule="evenodd" />
      </Sign>
    ),
  },
  {
    name: 'Zakaz wytwarzania fali',
    desc: 'Zwolnij tak, by nie tworzyć martwej fali ani ssania — chroni brzegi, pomosty i inne jednostki.',
    svg: (
      <Sign bg={WH} border={RD} slash>
        <path d="M18 40 q 11 -12 22 0 t 22 0" fill="none" stroke={BK} strokeWidth="4" />
        <path d="M18 52 q 11 -12 22 0 t 22 0" fill="none" stroke={BK} strokeWidth="4" />
      </Sign>
    ),
  },
  {
    name: 'Zakaz wyprzedzania',
    desc: 'Na tym odcinku nie wolno wyprzedzać innych jednostek (np. wąski tor, zakręt).',
    svg: (
      <Sign bg={WH} border={RD} slash>
        <g stroke={BK} strokeWidth="4" fill={BK} strokeLinecap="round">
          <line x1="30" y1="56" x2="30" y2="26" /><polygon points="30,20 24,32 36,32" />
          <line x1="50" y1="56" x2="50" y2="26" /><polygon points="50,20 44,32 56,32" />
        </g>
      </Sign>
    ),
  },
  {
    name: 'Ograniczenie prędkości',
    desc: 'Maksymalna dozwolona prędkość (w km/h) na danym odcinku. Liczba podana na tablicy.',
    svg: (
      <Sign bg={WH} border={RD}>
        <text x="40" y="52" textAnchor="middle" fontSize="34" fontWeight="800" fill={BK}>8</text>
      </Sign>
    ),
  },
  {
    name: 'Nakaz kierunku (w prawo)',
    desc: 'Nakaz płynięcia we wskazanym kierunku / trzymania się prawej strony toru.',
    svg: (
      <Sign bg={WH} border={RD}>
        <g stroke={BK} strokeWidth="6" fill={BK} strokeLinecap="round">
          <line x1="24" y1="40" x2="52" y2="40" /><polygon points="58,40 46,32 46,48" />
        </g>
      </Sign>
    ),
  },
  {
    name: 'Uwaga / ostrzeżenie',
    desc: 'Nakaz szczególnej ostrożności — np. przewężenie, roboty, prom, prąd. Sprawdź, czego dotyczy.',
    svg: (
      <Sign bg={WH} border={RD}>
        <text x="40" y="54" textAnchor="middle" fontSize="40" fontWeight="800" fill={RD}>!</text>
      </Sign>
    ),
  },
  {
    name: 'Dozwolone kotwiczenie',
    desc: 'Znak informacyjny — w tym miejscu można rzucić kotwicę.',
    svg: (
      <Sign bg={BL}>
        <Anchor2 c={WH} />
      </Sign>
    ),
  },
  {
    name: 'Miejsce postoju',
    desc: 'Znak informacyjny — wyznaczone miejsce postoju / cumowania jednostek.',
    svg: (
      <Sign bg={BL}>
        <text x="40" y="54" textAnchor="middle" fontSize="40" fontWeight="800" fill={WH}>P</text>
      </Sign>
    ),
  },
]

function ZnakiRuchu() {
  return (
    <div>
      <p className="lead mb-6 max-w-3xl">
        Znaki żeglugowe to „znaki drogowe” na szlaku. <b className="text-navy">Czerwone</b> obwódki
        oznaczają zakaz lub nakaz, <b className="text-navy">niebieskie</b> — informację. Poniżej
        najważniejsze (uproszczony przegląd wg systemu europejskiego / CEVNI).
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

/* ===================== SYGNAŁY ===================== */

// pojedynczy sygnał dźwiękowy jako sekwencja kropek/kresek
type Toot = 'short' | 'long' | 'vshort' | 'gap'
function Toots({ seq, series }: { seq: Toot[]; series?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {seq.map((t, i) => {
        if (t === 'gap') return <span key={i} className="w-2" />
        if (t === 'long') return <span key={i} className="h-3 w-6 rounded-full bg-brine-300" />
        if (t === 'vshort') return <span key={i} className="h-2 w-2 rounded-full bg-brine-300" />
        return <span key={i} className="h-3 w-3 rounded-full bg-brine-300" />
      })}
      {series && <span className="ml-0.5 text-lg font-bold leading-none text-brine-300">…</span>}
    </span>
  )
}

const SOUNDS: { seq: Toot[]; series?: boolean; name: string; desc: string }[] = [
  { seq: ['short'], name: '1 krótki', desc: 'Zmieniam swój kurs w prawo (na sterburtę).' },
  { seq: ['short', 'short'], name: '2 krótkie', desc: 'Zmieniam swój kurs w lewo (na bakburtę).' },
  { seq: ['short', 'short', 'short'], name: '3 krótkie', desc: 'Pracuję maszynami wstecz (cofam / hamuję).' },
  { seq: ['short', 'short', 'short', 'short'], name: '4 krótkie', desc: '„Nie mogę manewrować” — nie jestem w stanie wykonać manewru (np. awaria).' },
  {
    seq: ['vshort', 'vshort', 'vshort', 'vshort', 'vshort', 'vshort'],
    series: true,
    name: 'seria bardzo krótkich',
    desc: 'Niebezpieczeństwo (groźba) zderzenia — natychmiastowe ostrzeżenie.',
  },
  {
    seq: ['short', 'short', 'gap', 'short', 'short'],
    series: true,
    name: 'seria podwójnych krótkich',
    desc: 'Człowiek za burtą! Sygnał alarmowy wzywający pomocy dla rozbitka.',
  },
  {
    seq: ['long', 'gap', 'long'],
    series: true,
    name: 'powtarzane długie',
    desc: 'Wzywam pomocy — jednostka w niebezpieczeństwie prosi o pomoc.',
  },
]

// znaki dzienne (kule, stożki, romby) zawieszone na sztagu
function DayShape({ shapes }: { shapes: ('ball' | 'coneUp' | 'coneDown' | 'diamond' | 'cyl')[] }) {
  const cx = 40
  let y = 18
  const items: ReactNode[] = []
  shapes.forEach((s, i) => {
    if (s === 'ball') items.push(<circle key={i} cx={cx} cy={y + 9} r="9" fill={BK} />)
    else if (s === 'coneUp') items.push(<polygon key={i} points={`${cx},${y} ${cx - 9},${y + 18} ${cx + 9},${y + 18}`} fill={BK} />)
    else if (s === 'coneDown') items.push(<polygon key={i} points={`${cx - 9},${y} ${cx + 9},${y} ${cx},${y + 18}`} fill={BK} />)
    else if (s === 'diamond') items.push(<polygon key={i} points={`${cx},${y} ${cx + 10},${y + 9} ${cx},${y + 18} ${cx - 10},${y + 9}`} fill={BK} />)
    else items.push(<rect key={i} x={cx - 8} y={y} width="16" height="18" fill={BK} />)
    y += 24
  })
  return (
    <svg viewBox="0 0 80 110" width="70" height="96">
      <line x1={cx} y1="10" x2={cx} y2="100" stroke="#6b5124" strokeWidth="3" />
      {items}
    </svg>
  )
}

type DayShapeKind = 'ball' | 'coneUp' | 'coneDown' | 'diamond' | 'cyl'

interface DayShapeEntry {
  shapes: DayShapeKind[]
  name: string
  desc: string
  /** Opcjonalny obrazek zamiast rysunku, np. '/znaki/kula-kotwiczna.webp'. */
  img?: string
}

const SHAPES: DayShapeEntry[] = [
  { shapes: ['ball'], name: 'Kula (na dziobie)', desc: 'Jednostka stoi na kotwicy. W nocy zamiast kuli — białe światło widoczne dookoła widnokręgu.' },
  { shapes: ['coneDown'], name: 'Stożek wierzchołkiem w dół', desc: 'Jednostka żaglowa idąca dodatkowo na silniku (żaglowo‑motorowa) — traktowana jak motorowa.' },
  { shapes: ['ball', 'ball', 'ball'], name: 'Trzy kule w pionie', desc: 'Jednostka na mieliźnie (osiadła na dnie).' },
  { shapes: ['ball', 'ball'], name: 'Dwie kule w pionie', desc: 'Jednostka nieodpowiadająca za swoją sterowność (np. awaria steru).' },
  { shapes: ['ball', 'diamond', 'ball'], name: 'Kula – romb – kula', desc: 'Jednostka o ograniczonej zdolności manewrowej (np. prace podwodne, holowanie).' },
]

function Sygnaly() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-1 flex items-center gap-2 font-display text-2xl font-700 text-navy">
          <Volume2 className="h-6 w-6 text-brine-300" /> Sygnały dźwiękowe
        </h2>
        <p className="lead mb-5 max-w-3xl">
          Podawane rogiem / gwizdkiem. <b className="text-navy">Krótki</b> ≈ 1 s, <b className="text-navy">długi</b> ≈
          4–6 s. Służą do uzgadniania manewrów oraz alarmowania (m.in. „człowiek za burtą” czy wzywanie pomocy).
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SOUNDS.map((s) => (
            <div key={s.name} className="card flex items-center gap-4 p-4">
              <div className="grid w-28 shrink-0 place-items-center gap-2">
                <Toots seq={s.seq} series={s.series} />
                <span className="text-xs font-semibold text-brine-200">{s.name}</span>
              </div>
              <p className="text-sm text-brine-100/85">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-1 flex items-center gap-2 font-display text-2xl font-700 text-navy">
          <Signpost className="h-6 w-6 text-brine-300" /> Znaki dzienne (kule i stożki)
        </h2>
        <p className="lead mb-5 max-w-3xl">
          Czarne figury wywieszane w dzień informują innych o stanie jednostki (np. postój na kotwicy).
          W nocy zastępują je odpowiednie światła.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHAPES.map((s) => (
            <div key={s.name} className="card flex items-center gap-4 p-4">
              <div className="shrink-0 rounded-lg bg-white/10 p-2">
                <Illustration img={s.img} alt={`Znak dzienny: ${s.name}`} className="h-[96px] w-[70px] object-contain">
                  <DayShape shapes={s.shapes} />
                </Illustration>
              </div>
              <div>
                <h3 className="font-display text-base font-700 text-navy">{s.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-brine-100/80">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===================== PATENTY ===================== */

const LICENSES = [
  {
    name: 'Bez patentu',
    badge: '⛵ start',
    who: 'Każdy — bez egzaminu i minimalnego wieku (praktyka: pod opieką).',
    can: 'Jachty ŻAGLOWE o długości kadłuba do 7,5 m oraz jachty MOTOROWE o mocy silnika do 10 kW (ok. 13,6 KM) — po wodach śródlądowych.',
    note: 'To dlatego małymi łódkami typu Optimist czy małą żaglówką możesz pływać bez żadnych papierów.',
  },
  {
    name: 'Żeglarz jachtowy',
    badge: '🥉 pierwszy patent',
    who: 'Ukończone 14 lat + zdany egzamin (teoria i praktyka) przed komisją PZŻ. Nie ma wymogu wcześniejszego stażu.',
    can: 'Jachty żaglowe (także z silnikiem pomocniczym): po wodach ŚRÓDLĄDOWYCH bez ograniczeń długości, a po wodach MORSKICH jachty do 12 m — do 2 Mm od brzegu, w porze dziennej.',
    note: 'Standardowy cel kursu na Mazurach. Egzamin: nawigacja, locja, przepisy, meteorologia, manewrówka.',
  },
  {
    name: 'Jachtowy sternik morski',
    badge: '🥈 morze',
    who: 'Ukończone 18 lat + staż: co najmniej 2 rejsy morskie w sumie min. 200 godzin żeglugi + egzamin.',
    can: 'Po wodach śródlądowych — wszystkie jachty żaglowe; po MORSKICH — jachty żaglowe do 18 m długości kadłuba (bez limitu odległości i pory doby).',
    note: 'Naturalny kolejny krok po żeglarzu jachtowym, gdy chcesz czarterować na morzu (Chorwacja, Grecja itd.).',
  },
  {
    name: 'Kapitan jachtowy',
    badge: '🥇 bez ograniczeń',
    who: 'Patent JSM + duży staż morski (m.in. rejsy łącznie min. 1200 godzin, w tym samodzielne prowadzenie i rejsy poza wodami pływowymi/Bałtykiem).',
    can: 'Wszystkie jachty żaglowe po wodach śródlądowych i morskich BEZ OGRANICZEŃ (długości, akwenu, pory).',
    note: 'Najwyższy stopień żeglarski w Polsce.',
  },
  {
    name: 'Sternik motorowodny',
    badge: '🚤 motorówki',
    who: 'Ukończone 14 lat + egzamin (osobny, motorowodny).',
    can: 'Jachty MOTOROWE: po śródlądziu bez ograniczeń mocy, po morzu do 12 m / 2 Mm od brzegu w dzień. (Osoby 14–16 lat: moc do 60 kW, pod nadzorem.)',
    note: 'Przydatny na Mazurach np. do prowadzenia motorówek czarterowych i RIB-ów powyżej 10 kW.',
  },
]

function Patenty() {
  return (
    <div>
      <p className="lead mb-6 max-w-3xl">
        W Polsce uprawnienia żeglarskie reguluje ustawa o żegludze śródlądowej i rozporządzenie o
        uprawianiu turystyki wodnej. Poniżej ścieżka rozwoju — od pływania bez patentu po stopień
        kapitana.
      </p>

      {/* ścieżka rozwoju */}
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
        {['Bez patentu', 'Żeglarz jachtowy', 'Jachtowy sternik morski', 'Kapitan jachtowy'].map((s, i, arr) => (
          <span key={s} className="flex items-center gap-2">
            <span className="chip">{s}</span>
            {i < arr.length - 1 && <span className="text-brine-300">→</span>}
          </span>
        ))}
        <span className="ml-2 text-brine-100/50">(równolegle: Sternik motorowodny 🚤)</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {LICENSES.map((l) => (
          <motion.div key={l.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl font-700 text-navy">{l.name}</h3>
              <span className="chip shrink-0">{l.badge}</span>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Kto może / warunki</dt>
                <dd className="mt-0.5 text-brine-100/90">{l.who}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Co możesz prowadzić</dt>
                <dd className="mt-0.5 text-brine-100/90">{l.can}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Warto wiedzieć</dt>
                <dd className="mt-0.5 text-brine-100/80">{l.note}</dd>
              </div>
            </dl>
          </motion.div>
        ))}
      </div>

      <div className="card mt-6 p-5 text-xs text-brine-100/70">
        ⚠️ Stan prawny może się zmieniać — przed egzaminem sprawdź aktualne wymagania na stronie
        Polskiego Związku Żeglarskiego (pya.org.pl) i w obowiązującym rozporządzeniu.
      </div>
    </div>
  )
}

/* ===================== STRONA ===================== */

const TABS = [
  { id: 'droga', label: 'Prawo drogi', icon: ShieldCheck },
  { id: 'znaki', label: 'Znaki ruchu wodnego', icon: Milestone },
  { id: 'sygnaly', label: 'Sygnały', icon: Volume2 },
  { id: 'patenty', label: 'Patenty', icon: Award },
] as const

export default function Przepisy() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('droga')

  return (
    <div>
      <PageHeader eyebrow="Przepisy" title="Prawo drogi, znaki i sygnały">
        Na wodzie obowiązują{' '}
        <Term label="MPZZM / COLREG" title="Prawo drogi na wodzie">
          <p>
            Międzynarodowe Przepisy o Zapobieganiu Zderzeniom na Morzu (COLREG) oraz — na wodach
            śródlądowych — lokalne przepisy żeglugowe (w Europie system CEVNI).
          </p>
        </Term>
        . Zobacz też:{' '}
        <Link to="/budowa" className="font-semibold text-brine-300 underline decoration-dashed underline-offset-4 hover:text-navy">
          Budowa jachtu
        </Link>{' '}
        oraz{' '}
        <Link to="/budowa?tab=lights" className="font-semibold text-brine-300 underline decoration-dashed underline-offset-4 hover:text-navy">
          Światła nawigacyjne
        </Link>
        .
      </PageHeader>

      <div className="mb-6 inline-flex flex-wrap rounded-xl border border-white/10 bg-white/5 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`btn px-4 py-1.5 text-sm ${tab === id ? 'bg-brine-500 text-white' : 'text-brine-100'}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'droga' && <PrawoDrogi />}
      {tab === 'znaki' && <ZnakiRuchu />}
      {tab === 'sygnaly' && <Sygnaly />}
      {tab === 'patenty' && <Patenty />}

      <div className="card mt-8 p-6 text-sm text-brine-100/85">
        <p>
          ⚠️ To materiał edukacyjny i uproszczony. Przed rejsem zapoznaj się z aktualnymi przepisami
          (COLREG oraz lokalnymi zarządzeniami dla danego akwenu) i pamiętaj o nadrzędnej zasadzie:{' '}
          <b className="text-navy">rób wszystko, aby uniknąć zderzenia</b>.
        </p>
      </div>
    </div>
  )
}
