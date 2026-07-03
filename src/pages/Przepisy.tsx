import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { PageHeader, Term } from '../components/ui'
import { ShieldCheck, Milestone, Volume2, Signpost } from 'lucide-react'

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
          <h3 className="font-display text-xl font-700 text-white">{sc.title}</h3>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-buoyGreen/15 p-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-buoyGreen" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-buoyGreen">Zasada</div>
              <p className="text-sm text-white">{sc.rule}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brine-100/85">{sc.explain}</p>
          {sc.bothGiveWay ? (
            <div className="mt-4 rounded-lg bg-[#f4952b]/15 p-2 text-center text-xs">
              <div className="font-semibold text-[#f4952b]">Obie jednostki ustępują</div>
              <div className="text-white">każda skręca w prawo (na sterburtę)</div>
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

function Sign({ bg, border, slash, children }: { bg: string; border?: string; slash?: boolean; children: ReactNode }) {
  return (
    <svg viewBox="0 0 80 80" width="88" height="88" className="shrink-0">
      <rect x="5" y="5" width="70" height="70" rx="7" fill={bg} stroke={border ?? bg} strokeWidth="6" />
      {children}
      {slash && <line x1="14" y1="66" x2="66" y2="14" stroke="#d63a3f" strokeWidth="7" strokeLinecap="round" />}
    </svg>
  )
}

const BK = '#1a1a1a'
const WH = '#f5f2ea'
const RD = '#d63a3f'
const BL = '#1c6fb0'

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

const SIGNS = [
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
    name: 'Zakaz cumowania',
    desc: 'Nie wolno przybijać ani mocować jednostki do brzegu na tym odcinku.',
    svg: (
      <Sign bg={WH} border={RD} slash>
        <path d="M31 58 L31 36 Q31 27 40 27 Q49 27 49 36 L49 58 Z" fill={BK} />
        <line x1="24" y1="58" x2="56" y2="58" stroke={BK} strokeWidth="4" strokeLinecap="round" />
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
        Znaki żeglugowe to „znaki drogowe” na szlaku. <b className="text-white">Czerwone</b> obwódki
        oznaczają zakaz lub nakaz, <b className="text-white">niebieskie</b> — informację. Poniżej
        najważniejsze (uproszczony przegląd wg systemu europejskiego / CEVNI).
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SIGNS.map((s) => (
          <motion.div key={s.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card flex items-center gap-4 p-4">
            <div className="rounded-lg bg-white/5 p-1">{s.svg}</div>
            <div>
              <h3 className="font-display text-base font-700 text-white">{s.name}</h3>
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

const SHAPES: { shapes: ('ball' | 'coneUp' | 'coneDown' | 'diamond' | 'cyl')[]; name: string; desc: string }[] = [
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
        <h2 className="mb-1 flex items-center gap-2 font-display text-2xl font-700 text-white">
          <Volume2 className="h-6 w-6 text-brine-300" /> Sygnały dźwiękowe
        </h2>
        <p className="lead mb-5 max-w-3xl">
          Podawane rogiem / gwizdkiem. <b className="text-white">Krótki</b> ≈ 1 s, <b className="text-white">długi</b> ≈
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
        <h2 className="mb-1 flex items-center gap-2 font-display text-2xl font-700 text-white">
          <Signpost className="h-6 w-6 text-brine-300" /> Znaki dzienne (kule i stożki)
        </h2>
        <p className="lead mb-5 max-w-3xl">
          Czarne figury wywieszane w dzień informują innych o stanie jednostki (np. postój na kotwicy).
          W nocy zastępują je odpowiednie światła.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHAPES.map((s) => (
            <div key={s.name} className="card flex items-center gap-4 p-4">
              <div className="rounded-lg bg-white/10 p-2"><DayShape shapes={s.shapes} /></div>
              <div>
                <h3 className="font-display text-base font-700 text-white">{s.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-brine-100/80">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===================== STRONA ===================== */

const TABS = [
  { id: 'droga', label: 'Prawo drogi', icon: ShieldCheck },
  { id: 'znaki', label: 'Znaki ruchu wodnego', icon: Milestone },
  { id: 'sygnaly', label: 'Sygnały', icon: Volume2 },
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
        . Światła nawigacyjne znajdziesz w zakładce <b className="text-white">Budowa jachtu → Światła</b>.
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

      <div className="card mt-8 p-6 text-sm text-brine-100/85">
        <p>
          ⚠️ To materiał edukacyjny i uproszczony. Przed rejsem zapoznaj się z aktualnymi przepisami
          (COLREG oraz lokalnymi zarządzeniami dla danego akwenu) i pamiętaj o nadrzędnej zasadzie:{' '}
          <b className="text-white">rób wszystko, aby uniknąć zderzenia</b>.
        </p>
      </div>
    </div>
  )
}
