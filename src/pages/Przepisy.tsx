import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader, Term, Accordion, AccordionItem } from '../components/ui'
import { ShieldCheck, Ship } from 'lucide-react'

interface BoatSpec {
  x: number
  y: number
  heading: number // 0 = w górę, stopnie zgodnie z ruchem wskazówek
  label: string
}

interface Scenario {
  id: string
  title: string
  rule: string
  explain: string
  boats: [BoatSpec, BoatSpec]
  standOn: 0 | 1 // który ma pierwszeństwo (płynie kursem)
}

const SCENARIOS: Scenario[] = [
  {
    id: 'tacks',
    title: 'Przeciwne halsy',
    rule: 'Pierwszeństwo ma jacht na halsie prawym.',
    explain:
      'Gdy dwa jachty żaglowe zbliżają się na przeciwnych halsach, ustępuje ten na halsie lewym (wiatr z lewej burty). Hals prawy = wiatr wieje z prawej burty.',
    boats: [
      { x: 120, y: 250, heading: 35, label: 'Hals prawy' },
      { x: 300, y: 250, heading: -35, label: 'Hals lewy' },
    ],
    standOn: 0,
  },
  {
    id: 'same',
    title: 'Ten sam hals',
    rule: 'Pierwszeństwo ma jacht zawietrzny.',
    explain:
      'Gdy oba jachty są na tym samym halsie, ustępuje jacht nawietrzny (bliżej wiatru), a pierwszeństwo ma zawietrzny (dalej od wiatru, „pod” drugim).',
    boats: [
      { x: 150, y: 150, heading: 20, label: 'Nawietrzny' },
      { x: 250, y: 300, heading: 20, label: 'Zawietrzny' },
    ],
    standOn: 1,
  },
  {
    id: 'overtake',
    title: 'Doganianie',
    rule: 'Jednostka doganiająca ustępuje doganianej.',
    explain:
      'Kto dogania (podchodzi z sektora rufowego, ponad 22,5° za trawersem), ten zawsze ustępuje — niezależnie od halsu czy rodzaju napędu. Doganiany utrzymuje kurs i prędkość.',
    boats: [
      { x: 220, y: 320, heading: 0, label: 'Doganiający' },
      { x: 220, y: 150, heading: 0, label: 'Doganiany' },
    ],
    standOn: 1,
  },
  {
    id: 'power',
    title: 'Żaglówka i motorówka',
    rule: 'Jednostka o napędzie mechanicznym ustępuje żaglowej.',
    explain:
      'Na wodach śródlądowych i morskich motorówka co do zasady ustępuje jachtowi pod żaglami. Wyjątki: jacht dogania motorówkę, tor wodny/duże statki, jednostki ograniczone w manewrowaniu.',
    boats: [
      { x: 130, y: 250, heading: 60, label: 'Motorówka' },
      { x: 310, y: 250, heading: -20, label: 'Żaglówka' },
    ],
    standOn: 1,
  },
  {
    id: 'head-on',
    title: 'Kursy wprost (motorowe)',
    rule: 'Obie jednostki ustępują w prawo.',
    explain:
      'Dwie jednostki o napędzie mechanicznym idące wprost na siebie mijają się lewymi burtami — każda odwraca w prawo (na sterburtę).',
    boats: [
      { x: 220, y: 320, heading: 0, label: 'A → w prawo' },
      { x: 220, y: 150, heading: 180, label: 'B → w prawo' },
    ],
    standOn: 0,
  },
]

function BoatIcon({ b, standOn }: { b: BoatSpec; standOn: boolean }) {
  const color = standOn ? '#1fa463' : '#e2454a'
  return (
    <g transform={`translate(${b.x} ${b.y}) rotate(${b.heading})`}>
      {/* strzałka kursu */}
      <line x1="0" y1="0" x2="0" y2="-46" stroke={color} strokeWidth="2.5" strokeDasharray="4 4" />
      <polygon points="0,-52 -5,-42 5,-42" fill={color} />
      {/* kadłub */}
      <path d="M0 -22 C 9 -8 11 14 6 26 L -6 26 C -11 14 -9 -8 0 -22 Z" fill="#e9dcc0" stroke="#0f2b3f" strokeWidth="2" />
      <path d="M0 -18 L0 22" stroke={color} strokeWidth="3" />
      {/* obwódka statusu */}
      <circle cx="0" cy="2" r="30" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
    </g>
  )
}

export default function Przepisy() {
  const [sc, setSc] = useState<Scenario>(SCENARIOS[0])
  const giveWay = sc.standOn === 0 ? 1 : 0

  return (
    <div>
      <PageHeader eyebrow="Przepisy" title="Prawo drogi i sygnały">
        Na wodzie obowiązują <Term label="MPZZM / COLREG" title="Prawo drogi na wodzie">
          <p>
            Międzynarodowe Przepisy o Zapobieganiu Zderzeniom na Morzu (COLREG)
            oraz — na wodach śródlądowych — lokalne przepisy żeglugowe. Określają,
            kto <b>ustępuje</b> (give‑way), a kto <b>utrzymuje kurs</b> (stand‑on).
          </p>
        </Term>. Wybierz sytuację, aby zobaczyć, kto ma pierwszeństwo.
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
              <path key={y} d={`M0 ${y} q 20 -8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0`} fill="none" stroke="rgba(123,188,217,0.08)" strokeWidth="2" />
            ))}
            {sc.boats.map((b, i) => (
              <BoatIcon key={i} b={b} standOn={i === sc.standOn} />
            ))}
            {/* legenda */}
            <g transform="translate(16 366)">
              <circle cx="8" cy="0" r="6" fill="#1fa463" />
              <text x="20" y="4" fontSize="12" fill="#cfe6f0">utrzymuje kurs</text>
              <circle cx="150" cy="0" r="6" fill="#e2454a" />
              <text x="162" y="4" fontSize="12" fill="#cfe6f0">ustępuje</text>
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
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-buoyGreen/15 p-2">
                <div className="font-semibold text-buoyGreen">Pierwszeństwo</div>
                <div className="text-white">{sc.boats[sc.standOn].label}</div>
              </div>
              <div className="rounded-lg bg-buoyRed/15 p-2">
                <div className="font-semibold text-buoyRed">Ustępuje</div>
                <div className="text-white">{sc.boats[giveWay].label}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Światła i dodatki */}
      <h2 className="mb-4 mt-12 font-display text-2xl font-700 text-white">Światła nawigacyjne (noc)</h2>
      <Accordion>
        <AccordionItem id="l1" title="Burtowe: zielone i czerwone" icon={<Ship className="h-5 w-5" />}>
          <p>
            <b className="text-buoyGreen">Zielone</b> na prawej burcie (sterburta),{' '}
            <b className="text-buoyRed">czerwone</b> na lewej (bakburta), każde o
            zasięgu 112,5°. Widząc czerwone światło innej jednostki, patrzysz na
            jej lewą burtę — zwykle to Ty ustępujesz.
          </p>
        </AccordionItem>
        <AccordionItem id="l2" title="Rufowe i topowe (białe)" icon={<Ship className="h-5 w-5" />}>
          <p>
            Białe <b>rufowe</b> świeci do tyłu (135°). Jednostka motorowa dodatkowo
            niesie białe <b>topowe</b> z przodu. Żaglówka pod żaglami nie pokazuje
            światła topowego — po tym odróżnisz ją nocą od motorówki.
          </p>
        </AccordionItem>
        <AccordionItem id="l3" title="Jacht pod żaglami — reguła świateł" icon={<Ship className="h-5 w-5" />}>
          <p>
            Światła burtowe + rufowe. Małe jachty mogą łączyć je w jedną latarnię
            trójkolorową na topie masztu. Uruchomienie silnika = jesteś jednostką
            motorową i musisz świecić także światłem topowym.
          </p>
        </AccordionItem>
      </Accordion>

      <div className="card mt-6 p-6 text-sm text-brine-100/85">
        <p>
          ⚠️ To materiał edukacyjny. Przed rejsem zapoznaj się z aktualnymi
          przepisami (COLREG oraz lokalnymi zarządzeniami dla danego akwenu) i
          pamiętaj o nadrzędnej zasadzie: <b className="text-white">rób wszystko,
          aby uniknąć zderzenia</b>, nawet kosztem odstępstwa od prawa drogi.
        </p>
      </div>
    </div>
  )
}
