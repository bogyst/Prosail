import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'

/* ————————————————————————————————————————————————————————————
   Widok z góry: jacht zacumowany burtą do pomostu.
   Kolory grup lin jak na klasycznych schematach szkoleniowych:
   cumy — czerwone, szpringi — turkusowe, bresty — niebieskie.
   ———————————————————————————————————————————————————————————— */

const ACCENT = '#f4c430'
const COL = {
  cuma: '#e2454a',
  szpring: '#0fb9a6',
  brest: '#3b8fe0',
} as const

/** Te same barwy w tekście byłyby za jasne na kremowym tle — do napisów
 *  używamy klas zależnych od motywu (patrz `.ink-*` w src/index.css). */
const INK = { cuma: 'ink-red', szpring: 'ink-teal', brest: 'ink-blue' } as const

type LineKind = keyof typeof COL

/** punkty zaczepienia na jachcie (knagi) — współrzędne w układzie jachtu */
const CLEAT = {
  dziob: [624, 296],
  przod: [500, 288],
  tyl: [252, 290],
  rufa: [146, 294],
} as const

/** pachołki na pomoście (nieruchome) */
const BOLLARD = {
  b1: [58, 122],
  b2: [252, 122],
  b3: [382, 122],
  b4: [500, 122],
  b5: [690, 122],
} as const

interface Line {
  id: string
  name: string
  kind: LineKind
  cleat: keyof typeof CLEAT
  bollard: keyof typeof BOLLARD
  desc: string
  /** ruch, któremu ta lina zapobiega: przesunięcie i obrót jachtu */
  stops: { x: number; y: number; r: number }
  stopsLabel: string
}

const LINES: Line[] = [
  {
    id: 'cuma-dziob',
    name: 'Cuma dziobowa',
    kind: 'cuma',
    cleat: 'dziob',
    bollard: 'b5',
    desc: 'Z knagi dziobowej prowadzi ukośnie DO PRZODU, do dalszego pachołka. Trzyma dziób i nie pozwala jachtowi zsunąć się do tyłu.',
    stops: { x: -120, y: 0, r: 0 },
    stopsLabel: 'jacht zsuwa się do tyłu wzdłuż pomostu',
  },
  {
    id: 'cuma-rufa',
    name: 'Cuma rufowa',
    kind: 'cuma',
    cleat: 'rufa',
    bollard: 'b1',
    desc: 'Z knagi rufowej prowadzi ukośnie DO TYŁU. Trzyma rufę i nie pozwala jachtowi pojechać do przodu.',
    stops: { x: 120, y: 0, r: 0 },
    stopsLabel: 'jacht jedzie do przodu wzdłuż pomostu',
  },
  {
    id: 'szpring-dziob',
    name: 'Szpring dziobowy',
    kind: 'szpring',
    cleat: 'przod',
    bollard: 'b3',
    desc: 'Z przedniej knagi prowadzi UKOŚNIE DO TYŁU, do pachołka bliżej rufy. Blokuje ruch jachtu DO PRZODU — dużo skuteczniej niż sama cuma.',
    stops: { x: 120, y: 0, r: 0 },
    stopsLabel: 'jacht przesuwa się do przodu',
  },
  {
    id: 'szpring-rufa',
    name: 'Szpring rufowy',
    kind: 'szpring',
    cleat: 'tyl',
    bollard: 'b3',
    desc: 'Z tylnej knagi prowadzi UKOŚNIE DO PRZODU. Blokuje ruch jachtu DO TYŁU. Ze szpringiem dziobowym spina się zwykle na wspólnym pachołku — tworzą literę „V”.',
    stops: { x: -120, y: 0, r: 0 },
    stopsLabel: 'jacht cofa się wzdłuż pomostu',
  },
  {
    id: 'brest-dziob',
    name: 'Brest dziobowy',
    kind: 'brest',
    cleat: 'przod',
    bollard: 'b4',
    desc: 'Krótka lina PROSTOPADŁA do pomostu przy dziobie. Dociąga przód jachtu do pomostu — bez niej dziób odchodzi burtą w bok.',
    stops: { x: 0, y: 18, r: 8 },
    stopsLabel: 'dziób odchodzi od pomostu',
  },
  {
    id: 'brest-rufa',
    name: 'Brest rufowy',
    kind: 'brest',
    cleat: 'tyl',
    bollard: 'b2',
    desc: 'Krótka lina PROSTOPADŁA do pomostu przy rufie. Razem z dziobowym trzyma jacht równolegle i blisko pomostu.',
    stops: { x: 0, y: 18, r: -8 },
    stopsLabel: 'rufa odchodzi od pomostu',
  },
]

interface Feature {
  id: string
  name: string
  desc: string
  ax: number
  ay: number
}

const FEATURES: Feature[] = [
  { id: 'dziob', name: 'Dziób', ax: 648, ay: 322, desc: 'Przód jachtu. Przy cumowaniu burtą wskazuje kierunek „do przodu” — wzdłuż niego prowadzi cuma dziobowa.' },
  { id: 'rufa', name: 'Rufa', ax: 132, ay: 322, desc: 'Tył jachtu; tu jest pawęż, ster i rumpel. Stąd wychodzi cuma rufowa.' },
  {
    id: 'lewa',
    name: 'Lewa burta (bakburta)',
    ax: 390,
    ay: 288,
    desc: 'Patrząc od rufy w stronę dziobu — burta po LEWEJ ręce. Nocą świeci na niej CZERWONE światło („lewa — krewa”). Na tym schemacie to burta od strony pomostu.',
  },
  {
    id: 'prawa',
    name: 'Prawa burta (sterburta)',
    ax: 390,
    ay: 356,
    desc: 'Patrząc od rufy w stronę dziobu — burta po PRAWEJ ręce. Nocą świeci na niej ZIELONE światło („prawa — trawa”). Tu: burta od strony wody.',
  },
  { id: 'kokpit', name: 'Kokpit', ax: 226, ay: 322, desc: 'Zagłębienie, w którym siedzi załoga; stąd obsługuje się szoty i ster.' },
  { id: 'maszt', name: 'Maszt', ax: 466, ay: 322, desc: 'Podstawa masztu na pokładzie — z góry widoczna jako punkt, od którego rozchodzą się wanty i sztagi.' },
  { id: 'knaga', name: 'Knagi cumownicze', ax: 500, ay: 288, desc: 'Rogate okucia na pokładzie, do których wiąże się cumy, szpringi i bresty. Linę zakłada się „ósemką” i kończy półsztykiem.' },
]

const PIVOT = { x: 390, y: 322 }

/** prosty tween 0→1 na requestAnimationFrame (płynny powrót jachtu na miejsce) */
function useTween(target: number, ms = 750) {
  const [v, setV] = useState(target)
  const cur = useRef(target)
  useEffect(() => {
    const from = cur.current
    if (Math.abs(from - target) < 0.001) return
    const t0 = performance.now()
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms)
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      cur.current = from + (target - from) * e
      setV(cur.current)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

export default function DeckTopView() {
  const [selLine, setSelLine] = useState<string | null>('cuma-dziob')
  const [selFeat, setSelFeat] = useState<string | null>(null)
  const [hoverKind, setHoverKind] = useState<LineKind | null>(null)
  const [demo, setDemo] = useState<string | null>(null)

  const t = useTween(demo ? 1 : 0)
  const vec = useRef({ x: 0, y: 0, r: 0 })

  const active = LINES.find((l) => l.id === selLine) ?? null
  const activeFeat = FEATURES.find((f) => f.id === selFeat) ?? null

  function runDemo(l: Line) {
    vec.current = l.stops
    setDemo(l.id)
    window.setTimeout(() => setDemo((d) => (d === l.id ? null : d)), 2200)
  }

  // aktualne przesunięcie jachtu (0 gdy nic nie demonstrujemy)
  const off = { x: vec.current.x * t, y: vec.current.y * t, r: vec.current.r * t }

  /** przekształcenie punktu pokładu przy aktualnym przesunięciu jachtu */
  function xf([x, y]: readonly [number, number] | number[]): [number, number] {
    const a = (off.r * Math.PI) / 180
    const dx = x - PIVOT.x
    const dy = y - PIVOT.y
    return [PIVOT.x + dx * Math.cos(a) - dy * Math.sin(a) + off.x, PIVOT.y + dx * Math.sin(a) + dy * Math.cos(a) + off.y]
  }

  const boatTransform = `translate(${off.x} ${off.y}) rotate(${off.r} ${PIVOT.x} ${PIVOT.y})`

  const dim = (l: Line) => {
    if (hoverKind) return hoverKind === l.kind ? 1 : 0.2
    if (selLine) return selLine === l.id ? 1 : 0.32
    return 1
  }

  return (
    <div>
      {/* LEGENDA — najechanie wyróżnia całą grupę lin */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(
          [
            ['cuma', 'cumy', 'trzymają jacht wzdłuż pomostu'],
            ['szpring', 'szpringi', 'blokują ruch w przód / w tył'],
            ['brest', 'bresty', 'dociągają burtę do pomostu'],
          ] as [LineKind, string, string][]
        ).map(([k, label, hint]) => (
          <button
            key={k}
            onMouseEnter={() => setHoverKind(k)}
            onMouseLeave={() => setHoverKind(null)}
            onClick={() => setSelLine(LINES.find((l) => l.kind === k)!.id)}
            className="chip gap-2 transition-transform hover:-translate-y-0.5"
            title={hint}
          >
            <span className="h-2.5 w-6 rounded-full" style={{ backgroundColor: COL[k] }} />
            <span className={`font-display text-sm font-700 ${INK[k]}`}>{label}</span>
            <span className="hidden text-[11px] font-normal text-brine-100/70 sm:inline">— {hint}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="card self-start p-4">
          <svg viewBox="0 0 760 430" className="w-full">
            <defs>
              <linearGradient id="dv-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#123f5b" />
                <stop offset="100%" stopColor="#081c2c" />
              </linearGradient>
              <linearGradient id="dv-wood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a9793f" />
                <stop offset="100%" stopColor="#8a5f31" />
              </linearGradient>
              <linearGradient id="dv-deck" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f2ead6" />
                <stop offset="100%" stopColor="#ddceac" />
              </linearGradient>
              <filter id="dv-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="760" height="430">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={ACCENT} floodOpacity="0.95" />
              </filter>
              <filter id="dv-shadow" filterUnits="userSpaceOnUse" x="0" y="0" width="760" height="430">
                <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000" floodOpacity="0.4" />
              </filter>
            </defs>

            <rect x="0" y="0" width="760" height="430" rx="14" fill="url(#dv-water)" />
            {/* delikatne fale */}
            {[168, 214, 262, 402].map((y, i) => (
              <path
                key={y}
                d={`M0 ${y} q 30 -6 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`}
                fill="none"
                stroke="rgba(140,196,225,0.10)"
                strokeWidth={i % 2 ? 1 : 1.5}
              />
            ))}

            {/* ——— POMOST ——— */}
            <g>
              <rect x="0" y="0" width="760" height="122" fill="url(#dv-wood)" />
              {[14, 32, 50, 68, 86, 104].map((y) => (
                <line key={y} x1="0" y1={y} x2="760" y2={y} stroke="rgba(60,36,14,0.35)" strokeWidth="2" />
              ))}
              {[120, 300, 480, 660].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="122" stroke="rgba(60,36,14,0.22)" strokeWidth="2" />
              ))}
              <rect x="0" y="112" width="760" height="10" fill="#5f4021" />
              <text x="18" y="30" fill="rgba(255,245,225,0.85)" fontSize="15" fontWeight="700" letterSpacing="2">
                POMOST
              </text>
            </g>

            {/* pachołki na pomoście */}
            {Object.entries(BOLLARD).map(([k, [x, y]]) => (
              <g key={k}>
                <ellipse cx={x} cy={y - 4} rx="15" ry="8" fill="#f0d97a" stroke="#7a6320" strokeWidth="2" />
                <ellipse cx={x} cy={y - 7} rx="10" ry="5" fill="#fbeaa0" />
              </g>
            ))}

            {/* ——— LINY ——— */}
            {LINES.map((l) => {
              const [x1, y1] = xf(CLEAT[l.cleat])
              const [x2, y2] = BOLLARD[l.bollard]
              const isSel = selLine === l.id
              const slack = demo === l.id
              // lekki zwis liny
              const mx = (x1 + x2) / 2
              const my = (y1 + y2) / 2 + (slack ? 26 : 6)
              return (
                <g key={l.id} onClick={() => (setSelLine(l.id), setSelFeat(null))} style={{ cursor: 'pointer' }}>
                  <path d={`M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke="transparent" strokeWidth="16" />
                  <path
                    d={`M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                    fill="none"
                    stroke={COL[l.kind]}
                    strokeWidth={isSel ? 6 : 4}
                    strokeLinecap="round"
                    strokeDasharray={slack ? '9 7' : undefined}
                    opacity={slack ? 0.4 : dim(l)}
                    filter={isSel && !slack ? 'url(#dv-glow)' : undefined}
                  />
                  {/* węzeł na pachołku */}
                  <circle cx={x2} cy={y2} r={isSel ? 5 : 3.5} fill={COL[l.kind]} opacity={dim(l)} />
                </g>
              )
            })}

            {/* ——— JACHT (widok z góry, dziób w prawo) ——— */}
            <g transform={boatTransform} filter="url(#dv-shadow)">
              {/* kadłub */}
              <path
                d="M126 290 L540 284 C 606 288, 650 304, 664 322 C 650 340, 606 356, 540 360 L126 354 C 116 352, 116 292, 126 290 Z"
                fill="url(#dv-deck)"
                stroke="#12354f"
                strokeWidth="3"
              />
              {/* obrys pokładówki / listwa burtowa */}
              <path
                d="M140 296 L538 291 C 596 295, 634 308, 646 322 C 634 336, 596 349, 538 353 L140 348 Z"
                fill="none"
                stroke="rgba(18,53,79,0.22)"
                strokeWidth="2"
              />
              {/* kabina */}
              <path d="M312 300 L470 297 C 486 300, 486 344, 470 347 L312 344 C 300 340, 300 304, 312 300 Z" fill="#cbb68d" stroke="#8d7a52" strokeWidth="2" />
              {[340, 372, 404, 436].map((x) => (
                <rect key={x} x={x} y="305" width="20" height="8" rx="4" fill="#7c8fa0" opacity="0.8" />
              ))}
              {/* kokpit */}
              <path
                d="M182 302 L292 300 L286 344 L182 342 Z"
                fill="#0e2536"
                stroke="#33506a"
                strokeWidth="2"
                onClick={(e) => (e.stopPropagation(), setSelFeat('kokpit'), setSelLine(null))}
                style={{ cursor: 'pointer' }}
              />
              {/* ławki w kokpicie */}
              <rect x="188" y="305" width="94" height="8" rx="4" fill="rgba(210,225,236,0.18)" />
              <rect x="188" y="331" width="94" height="8" rx="4" fill="rgba(210,225,236,0.18)" />
              {/* rumpel + ster na pawęży */}
              <rect x="118" y="316" width="10" height="12" rx="3" fill="#12354f" />
              <line x1="128" y1="322" x2="196" y2="322" stroke="#6b5124" strokeWidth="5" strokeLinecap="round" />
              {/* maszt */}
              <circle
                cx="466"
                cy="322"
                r="9"
                fill="#3a2c14"
                stroke="#c9a15a"
                strokeWidth="2.5"
                onClick={(e) => (e.stopPropagation(), setSelFeat('maszt'), setSelLine(null))}
                style={{ cursor: 'pointer' }}
              />
              {/* luk dziobowy */}
              <rect x="556" y="310" width="34" height="24" rx="5" fill="#7c8fa0" opacity="0.75" />

              {/* knagi cumownicze w punktach zaczepienia lin */}
              {Object.entries(CLEAT).map(([k, [x, y]]) => (
                <g key={k} onClick={(e) => (e.stopPropagation(), setSelFeat('knaga'), setSelLine(null))} style={{ cursor: 'pointer' }}>
                  <rect x={x - 11} y={y - 5} width="22" height="10" rx="5" fill="#4a6377" stroke="#12354f" strokeWidth="1.5" />
                  <circle cx={x - 7} cy={y} r="2.6" fill="#12354f" />
                  <circle cx={x + 7} cy={y} r="2.6" fill="#12354f" />
                </g>
              ))}

              {/* opisy burt na kadłubie */}
              {/* odbijacze na burcie od strony pomostu */}
              {[212, 342, 472].map((x) => (
                <g key={x}>
                  <rect x={x - 9} y="268" width="18" height="26" rx="9" fill="#d8dde2" stroke="#8c98a2" strokeWidth="1.5" />
                  <line x1={x} y1="270" x2={x} y2="292" stroke="#8c98a2" strokeWidth="1" />
                </g>
              ))}
              <text x="300" y="264" textAnchor="middle" fill="#ff7d80" fontSize="13" fontWeight="700">
                ▲ LEWA BURTA (bakburta) · czerwone światło
              </text>
              <text x="300" y="380" textAnchor="middle" fill="#5fdc9f" fontSize="13" fontWeight="700">
                ▼ PRAWA BURTA (sterburta) · zielone światło
              </text>
              <text x="682" y="327" fill="rgba(214,234,245,0.9)" fontSize="13" fontWeight="700">
                dziób
              </text>
              <text x="104" y="327" textAnchor="end" fill="rgba(214,234,245,0.9)" fontSize="13" fontWeight="700">
                rufa
              </text>

              {/* niewidzialne pola klikalne dla burt / dziobu / rufy */}
              <rect x="200" y="284" width="330" height="14" fill="transparent" onClick={(e) => (e.stopPropagation(), setSelFeat('lewa'), setSelLine(null))} style={{ cursor: 'pointer' }} />
              <rect x="200" y="346" width="330" height="14" fill="transparent" onClick={(e) => (e.stopPropagation(), setSelFeat('prawa'), setSelLine(null))} style={{ cursor: 'pointer' }} />
              <rect x="596" y="300" width="70" height="44" fill="transparent" onClick={(e) => (e.stopPropagation(), setSelFeat('dziob'), setSelLine(null))} style={{ cursor: 'pointer' }} />
              <rect x="116" y="300" width="60" height="44" fill="transparent" onClick={(e) => (e.stopPropagation(), setSelFeat('rufa'), setSelLine(null))} style={{ cursor: 'pointer' }} />
            </g>

            {/* strzałka pokazywanego ruchu podczas demonstracji */}
            {demo && t > 0.12 && (
              <g opacity={Math.min(1, t * 1.6)}>
                {vec.current.x !== 0 ? (
                  <g transform={`translate(${390 + (vec.current.x > 0 ? 150 : -150)} 415)`}>
                    <line x1={vec.current.x > 0 ? -46 : 46} y1="0" x2={vec.current.x > 0 ? 34 : -34} y2="0" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" />
                    <polygon points={vec.current.x > 0 ? '48,0 30,-9 30,9' : '-48,0 -30,-9 -30,9'} fill={ACCENT} />
                  </g>
                ) : (
                  <g transform={`translate(${vec.current.r > 0 ? 620 : 180} 412)`}>
                    <line x1="0" y1="-34" x2="0" y2="26" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" />
                    <polygon points="0,40 -9,22 9,22" fill={ACCENT} />
                  </g>
                )}
              </g>
            )}

            {/* marker wybranego elementu jachtu */}
            {activeFeat && (
              <motion.circle
                key={activeFeat.id}
                cx={xf([activeFeat.ax, activeFeat.ay])[0]}
                cy={xf([activeFeat.ax, activeFeat.ay])[1]}
                r="12"
                fill="none"
                stroke={ACCENT}
                strokeWidth="2.5"
                pointerEvents="none"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ transformOrigin: `${xf([activeFeat.ax, activeFeat.ay])[0]}px ${xf([activeFeat.ax, activeFeat.ay])[1]}px` }}
              />
            )}
          </svg>

          <p className="mt-3 px-1 text-xs text-brine-100/70">
            Kliknij linę albo element jachtu na rysunku. Przy każdej linie możesz uruchomić animację
            „<b className="text-navy">czemu zapobiega</b>” — jacht ruszy tak, jak zrobiłby to bez tej liny.
          </p>
        </div>

        {/* PANEL */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-2">
            {(['cuma', 'szpring', 'brest'] as LineKind[]).map((k) => (
              <div key={k}>
                <div className={`px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide ${INK[k]}`}>
                  {k === 'cuma' ? 'Cumy' : k === 'szpring' ? 'Szpringi' : 'Bresty'}
                </div>
                {LINES.filter((l) => l.kind === k).map((l) => (
                  <button
                    key={l.id}
                    onClick={() => (setSelLine(l.id), setSelFeat(null))}
                    onMouseEnter={() => setHoverKind(k)}
                    onMouseLeave={() => setHoverKind(null)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selLine === l.id ? 'bg-brine-500/25 text-navy' : 'text-brine-100 hover:bg-white/5'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COL[k] }} />
                    {l.name}
                  </button>
                ))}
              </div>
            ))}
            <div className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-brine-100/50">Elementy jachtu</div>
            {FEATURES.map((f) => (
              <button
                key={f.id}
                onClick={() => (setSelFeat(f.id), setSelLine(null))}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selFeat === f.id ? 'bg-brine-500/25 text-navy' : 'text-brine-100 hover:bg-white/5'
                }`}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: selFeat === f.id ? ACCENT : 'rgba(123,188,217,0.5)' }} />
                {f.name}
              </button>
            ))}
          </div>

          <motion.div key={selLine ?? selFeat ?? 'none'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
            {active ? (
              <>
                <h3 className={`font-display text-lg font-700 ${INK[active.kind]}`}>{active.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brine-100/90">{active.desc}</p>
                <div className="mt-3 rounded-lg bg-white/5 p-3 text-xs text-brine-100/80">
                  <b className="text-navy">Bez tej liny:</b> {active.stopsLabel}.
                </div>
                <button onClick={() => runDemo(active)} className="btn-primary mt-3 w-full justify-center" disabled={demo === active.id}>
                  {demo === active.id ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {demo === active.id ? 'Pokazuję…' : 'Pokaż, czemu zapobiega'}
                </button>
              </>
            ) : activeFeat ? (
              <>
                <h3 className="font-display text-lg font-700 text-navy">{activeFeat.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brine-100/90">{activeFeat.desc}</p>
              </>
            ) : (
              <p className="text-sm text-brine-100/80">Wybierz linę lub element jachtu.</p>
            )}
          </motion.div>

          <div className="card p-4 text-xs leading-relaxed text-brine-100/75">
            💡 <b className="text-navy">Komplet na burtę</b> to zwykle 6 lin: 2 cumy (dziobowa i rufowa),
            2 szpringi i 2 bresty. Cumy i szpringi trzymają jacht wzdłuż pomostu, bresty — przy pomoście.
            Przy silnym wietrze od pomostu daj dłuższe bresty i odbijacze, żeby burta nie tarła o deski.
          </div>
        </div>
      </div>
    </div>
  )
}
