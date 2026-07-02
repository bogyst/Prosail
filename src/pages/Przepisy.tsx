import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader, Term, Accordion, AccordionItem } from '../components/ui'
import { ShieldCheck, Ship } from 'lucide-react'

type Status = 'stand' | 'give' | 'both'

interface BoatSpec {
  x: number
  y: number
  heading: number // 0 = w górę, stopnie zgodnie z ruchem wskazówek
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

// Wiatr na scenie wieje ZAWSZE z góry (w dół). Kursy jachtów żaglowych
// są tak dobrane, aby zgadzały się z opisanym halsem:
//   hals prawy (starboard) = wiatr z prawej burty  -> dziób odchylony w LEWO (heading < 0)
//   hals lewy   (port)     = wiatr z lewej burty   -> dziób odchylony w PRAWO (heading > 0)
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

const COLOR: Record<Status, string> = {
  stand: '#1fa463',
  give: '#e2454a',
  both: '#f4952b',
}

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

export default function Przepisy() {
  const [sc, setSc] = useState<Scenario>(SCENARIOS[0])
  const standOn = sc.boats.find((b) => b.status === 'stand')
  const giveWay = sc.boats.find((b) => b.status === 'give')

  return (
    <div>
      <PageHeader eyebrow="Przepisy" title="Prawo drogi i sygnały">
        Na wodzie obowiązują{' '}
        <Term label="MPZZM / COLREG" title="Prawo drogi na wodzie">
          <p>
            Międzynarodowe Przepisy o Zapobieganiu Zderzeniom na Morzu (COLREG) oraz — na
            wodach śródlądowych — lokalne przepisy żeglugowe. Określają, kto <b>ustępuje</b>{' '}
            (give‑way), a kto <b>utrzymuje kurs</b> (stand‑on).
          </p>
        </Term>
        . Wybierz sytuację, aby zobaczyć, kto ma pierwszeństwo. Wiatr na schemacie wieje z
        góry — to on decyduje o halsie.
      </PageHeader>

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
              <path
                key={y}
                d={`M0 ${y} q 20 -8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0`}
                fill="none"
                stroke="rgba(123,188,217,0.08)"
                strokeWidth="2"
              />
            ))}

            {/* WIATR — zawsze z góry */}
            <g>
              <line x1="220" y1="16" x2="220" y2="60" stroke="#7bbcd9" strokeWidth="5" strokeLinecap="round" />
              <polygon points="220,66 214,54 226,54" fill="#7bbcd9" />
              <text x="234" y="40" fontSize="12" fontWeight="700" fill="#7bbcd9">
                WIATR
              </text>
            </g>

            {sc.boats.map((b, i) => (
              <BoatIcon key={i} b={b} />
            ))}

            {/* legenda */}
            <g transform="translate(16 380)">
              <circle cx="8" cy="0" r="6" fill="#1fa463" />
              <text x="20" y="4" fontSize="12" fill="#cfe6f0">
                utrzymuje kurs
              </text>
              <circle cx="150" cy="0" r="6" fill="#e2454a" />
              <text x="162" y="4" fontSize="12" fill="#cfe6f0">
                ustępuje
              </text>
              <circle cx="250" cy="0" r="6" fill="#f4952b" />
              <text x="262" y="4" fontSize="12" fill="#cfe6f0">
                obie ustępują
              </text>
            </g>
          </svg>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSc(s)}
                className={`rounded-xl px-3 py-1.5 text-sm ${
                  sc.id === s.id ? 'bg-brine-500 text-white' : 'bg-white/5 text-brine-100 hover:bg-white/10'
                }`}
              >
                {s.title}
              </button>
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
                <div className="rounded-lg bg-buoyGreen/15 p-2">
                  <div className="font-semibold text-buoyGreen">Pierwszeństwo</div>
                  <div className="text-white">{standOn?.label}</div>
                </div>
                <div className="rounded-lg bg-buoyRed/15 p-2">
                  <div className="font-semibold text-buoyRed">Ustępuje</div>
                  <div className="text-white">{giveWay?.label}</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Światła */}
      <h2 className="mb-4 mt-12 font-display text-2xl font-700 text-white">Światła nawigacyjne (noc)</h2>
      <Accordion>
        <AccordionItem id="l1" title="Burtowe: zielone i czerwone" icon={<Ship className="h-5 w-5" />}>
          <p>
            <b className="text-buoyGreen">Zielone</b> na prawej burcie (sterburta),{' '}
            <b className="text-buoyRed">czerwone</b> na lewej (bakburta), każde o zasięgu
            112,5°. Widząc czerwone światło innej jednostki, patrzysz na jej lewą burtę —
            zwykle to Ty ustępujesz.
          </p>
        </AccordionItem>
        <AccordionItem id="l2" title="Rufowe i topowe (białe)" icon={<Ship className="h-5 w-5" />}>
          <p>
            Białe <b>rufowe</b> świeci do tyłu (135°). Jednostka motorowa dodatkowo niesie
            białe <b>topowe</b> z przodu. Żaglówka pod żaglami nie pokazuje światła topowego —
            po tym odróżnisz ją nocą od motorówki.
          </p>
        </AccordionItem>
        <AccordionItem id="l3" title="Jacht pod żaglami — reguła świateł" icon={<Ship className="h-5 w-5" />}>
          <p>
            Światła burtowe + rufowe. Małe jachty mogą łączyć je w jedną latarnię
            trójkolorową na topie masztu. Uruchomienie silnika = jesteś jednostką motorową i
            musisz świecić także światłem topowym.
          </p>
        </AccordionItem>
      </Accordion>

      <div className="card mt-6 p-6 text-sm text-brine-100/85">
        <p>
          ⚠️ To materiał edukacyjny. Przed rejsem zapoznaj się z aktualnymi przepisami (COLREG
          oraz lokalnymi zarządzeniami dla danego akwenu) i pamiętaj o nadrzędnej zasadzie:{' '}
          <b className="text-white">rób wszystko, aby uniknąć zderzenia</b>, nawet kosztem
          odstępstwa od prawa drogi.
        </p>
      </div>
    </div>
  )
}
