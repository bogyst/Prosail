import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Illustration from './Illustration'

/* ————————————————————————————————————————————————————————————
   Osprzęt pokładowy: knagi (zwykła, zaciskowa, szczękowa),
   kluzy i półkluzy, pachołki i okucia cumownicze.
   ———————————————————————————————————————————————————————————— */

const METAL = '#3f4d86' // granatowy odlew, jak na typowych okuciach
const METAL_D = '#28315a'
const METAL_L = '#6b79b8'
const STEEL = '#b9c4cc'
const STEEL_D = '#7c8993'
const ROPE = '#e0c489'
const DECK = 'rgba(233,240,247,0.14)'

function Plate({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 160 110" className="h-full w-full">
      <rect x="0" y="0" width="160" height="110" rx="10" fill={DECK} />
      {children}
    </svg>
  )
}

/* ——— rysunki ——— */

const KnagaZwykla = (
  <Plate>
    <ellipse cx="80" cy="88" rx="54" ry="8" fill="rgba(0,0,0,0.25)" />
    {/* lina POD knagą — pełny obrót wokół podstawy */}
    <path d="M6 86 C 34 96, 126 96, 154 80" fill="none" stroke="#b99a63" strokeWidth="6" strokeLinecap="round" />
    {/* korpus knagi: podstawa + dwa rogi */}
    <rect x="52" y="56" width="56" height="26" rx="10" fill={METAL_L} stroke={METAL_D} strokeWidth="2.5" />
    <path d="M52 60 C 40 60, 34 44, 22 46 C 8 48, 8 66, 22 68 C 36 70, 42 64, 52 66 Z" fill={METAL} stroke={METAL_D} strokeWidth="2.5" />
    <path d="M108 60 C 120 60, 126 44, 138 46 C 152 48, 152 66, 138 68 C 124 70, 118 64, 108 66 Z" fill={METAL} stroke={METAL_D} strokeWidth="2.5" />
    <circle cx="66" cy="69" r="4" fill={METAL_D} />
    <circle cx="94" cy="69" r="4" fill={METAL_D} />
    {/* ósemka NAD korpusem — dwie przekątne przez rogi */}
    <path d="M24 52 C 52 56, 108 70, 136 62" fill="none" stroke={ROPE} strokeWidth="6" strokeLinecap="round" />
    <path d="M24 66 C 52 74, 108 56, 136 50" fill="none" stroke={ROPE} strokeWidth="6" strokeLinecap="round" />
  </Plate>
)

const KnagaZaciskowa = (
  <Plate>
    <ellipse cx="80" cy="86" rx="48" ry="7" fill="rgba(0,0,0,0.25)" />
    {/* lina wchodzi w klin */}
    <path d="M14 40 L74 58" fill="none" stroke={ROPE} strokeWidth="6" strokeLinecap="round" />
    <path d="M92 62 L150 74" fill="none" stroke={ROPE} strokeWidth="6" strokeLinecap="round" />
    {/* klinowy korpus */}
    <path d="M28 82 L44 34 L124 34 L138 82 Z" fill={METAL} stroke={METAL_D} strokeWidth="2.5" />
    <path d="M44 34 L124 34 L118 46 L50 46 Z" fill={METAL_L} opacity="0.9" />
    {/* kanał z zębami */}
    <path d="M56 74 L74 40 L100 40 L110 74 Z" fill={METAL_D} />
    {[46, 54, 62, 70].map((y, i) => (
      <g key={y}>
        <line x1={70 - i * 3} y1={y} x2={80 - i * 2} y2={y + 3} stroke={STEEL} strokeWidth="2.5" />
        <line x1={104 + i * 1.5} y1={y} x2={94 + i * 1.5} y2={y + 3} stroke={STEEL} strokeWidth="2.5" />
      </g>
    ))}
    {/* lina w kanale */}
    <path d="M74 58 L92 62" fill="none" stroke={ROPE} strokeWidth="6" strokeLinecap="round" />
    <circle cx="40" cy="76" r="3.5" fill={METAL_D} />
    <circle cx="126" cy="76" r="3.5" fill={METAL_D} />
  </Plate>
)

const KnagaSzczekowa = (
  <Plate>
    <ellipse cx="80" cy="88" rx="46" ry="7" fill="rgba(0,0,0,0.25)" />
    <rect x="30" y="66" width="100" height="20" rx="8" fill={METAL} stroke={METAL_D} strokeWidth="2.5" />
    {/* lina przechodząca między szczękami */}
    <path d="M10 52 L60 52" fill="none" stroke={ROPE} strokeWidth="6" strokeLinecap="round" />
    <path d="M100 52 L152 52" fill="none" stroke={ROPE} strokeWidth="6" strokeLinecap="round" />
    <path d="M60 52 L100 52" fill="none" stroke={ROPE} strokeWidth="6" />
    {/* dwie szczęki (krzywki) */}
    {[
      [58, 34],
      [102, 34],
    ].map(([cx], i) => (
      <g key={cx}>
        <circle cx={cx} cy="46" r="20" fill={METAL_L} stroke={METAL_D} strokeWidth="2.5" />
        <circle cx={cx} cy="46" r="6" fill={METAL_D} />
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const a = ((i ? 130 : 50) + k * 16) * (Math.PI / 180)
          return (
            <line
              key={k}
              x1={cx + Math.cos(a) * 14}
              y1={46 + Math.sin(a) * 14}
              x2={cx + Math.cos(a) * 20}
              y2={46 + Math.sin(a) * 20}
              stroke={METAL_D}
              strokeWidth="2.5"
            />
          )
        })}
      </g>
    ))}
  </Plate>
)

const Kluza = (
  <Plate>
    <ellipse cx="80" cy="86" rx="46" ry="7" fill="rgba(0,0,0,0.25)" />
    {/* korpus — zamknięty owal */}
    <path d="M24 80 L52 30 L108 30 L136 80 Z" fill={METAL} stroke={METAL_D} strokeWidth="2.5" />
    <ellipse cx="80" cy="55" rx="26" ry="17" fill={METAL_D} />
    <ellipse cx="80" cy="55" rx="26" ry="17" fill="none" stroke={METAL_L} strokeWidth="4" />
    {/* lina przechodząca przez otwór */}
    <path d="M6 48 C 40 48, 50 56, 80 56" fill="none" stroke={ROPE} strokeWidth="7" strokeLinecap="round" />
    <path d="M80 56 C 112 56, 124 66, 154 70" fill="none" stroke={ROPE} strokeWidth="7" strokeLinecap="round" />
    <circle cx="38" cy="72" r="3.5" fill={METAL_D} />
    <circle cx="122" cy="72" r="3.5" fill={METAL_D} />
  </Plate>
)

const Polkluza = (
  <Plate>
    <ellipse cx="80" cy="86" rx="42" ry="7" fill="rgba(0,0,0,0.25)" />
    {/* otwarta od góry litera U */}
    <path d="M46 82 L46 46 C 46 24, 114 24, 114 46 L114 82" fill="none" stroke={STEEL} strokeWidth="11" strokeLinejoin="round" />
    <path d="M46 82 L46 46 C 46 24, 114 24, 114 46 L114 82" fill="none" stroke={STEEL_D} strokeWidth="3" />
    {/* stopki mocujące */}
    <rect x="30" y="76" width="34" height="10" rx="4" fill={STEEL_D} />
    <rect x="96" y="76" width="34" height="10" rx="4" fill={STEEL_D} />
    <circle cx="40" cy="81" r="3" fill="#2b3942" />
    <circle cx="120" cy="81" r="3" fill="#2b3942" />
    {/* lina włożona od góry */}
    <path d="M4 60 C 40 60, 52 64, 80 64 C 110 64, 124 56, 156 52" fill="none" stroke={ROPE} strokeWidth="7" strokeLinecap="round" />
    {/* strzałka „wkładasz od góry” */}
    <g stroke="#f4c74d" fill="#f4c74d">
      <line x1="80" y1="10" x2="80" y2="30" strokeWidth="2.5" />
      <polygon points="80,38 74,26 86,26" />
    </g>
  </Plate>
)

const Przelotka = (
  <Plate>
    <ellipse cx="80" cy="84" rx="40" ry="7" fill="rgba(0,0,0,0.25)" />
    <rect x="34" y="52" width="92" height="28" rx="13" fill={METAL} stroke={METAL_D} strokeWidth="2.5" />
    <ellipse cx="80" cy="60" rx="20" ry="13" fill={METAL_D} />
    <ellipse cx="80" cy="60" rx="20" ry="13" fill="none" stroke={METAL_L} strokeWidth="4" />
    <path d="M80 60 C 80 40, 70 24, 56 14" fill="none" stroke={ROPE} strokeWidth="7" strokeLinecap="round" />
    <path d="M80 60 C 92 60, 104 68, 152 74" fill="none" stroke={ROPE} strokeWidth="7" strokeLinecap="round" />
  </Plate>
)

const Pachol = (
  <Plate>
    <ellipse cx="80" cy="92" rx="40" ry="8" fill="rgba(0,0,0,0.25)" />
    <rect x="60" y="86" width="40" height="8" rx="3" fill="#5b6a74" />
    <rect x="68" y="34" width="24" height="54" rx="6" fill="#f0d97a" stroke="#7a6320" strokeWidth="2.5" />
    <ellipse cx="80" cy="34" rx="20" ry="9" fill="#fbeaa0" stroke="#7a6320" strokeWidth="2.5" />
    <path d="M8 60 C 40 54, 58 66, 80 60" fill="none" stroke={ROPE} strokeWidth="7" strokeLinecap="round" />
    <path d="M80 60 C 104 54, 122 68, 154 62" fill="none" stroke={ROPE} strokeWidth="7" strokeLinecap="round" />
  </Plate>
)

const Obuszek = (
  <Plate>
    <ellipse cx="80" cy="86" rx="38" ry="7" fill="rgba(0,0,0,0.25)" />
    <rect x="46" y="70" width="68" height="16" rx="6" fill={METAL} stroke={METAL_D} strokeWidth="2.5" />
    <circle cx="60" cy="78" r="3.5" fill={METAL_D} />
    <circle cx="100" cy="78" r="3.5" fill={METAL_D} />
    <path d="M60 70 C 60 34, 100 34, 100 70" fill="none" stroke={STEEL} strokeWidth="9" />
    <path d="M8 46 C 42 40, 52 50, 80 50" fill="none" stroke={ROPE} strokeWidth="7" strokeLinecap="round" />
    <path d="M80 50 C 108 50, 122 40, 154 44" fill="none" stroke={ROPE} strokeWidth="7" strokeLinecap="round" />
  </Plate>
)

interface Fitting {
  id: string
  name: string
  group: 'Knagi' | 'Kluzy i przelotki' | 'Okucia cumownicze'
  short: string
  desc: string
  use: string
  warn?: string
  /** obrazek WEBP zamiast rysunku, np. '/osprzet/knaga-zwykla.webp' */
  img?: string
  svg: ReactNode
}

const FITTINGS: Fitting[] = [
  {
    id: 'knaga-zwykla',
    name: 'Knaga zwykła (rogowa)',
    group: 'Knagi',
    short: 'Dwa rogi na podstawie — linę wiąże się ósemką.',
    desc: 'Klasyczna knaga: odlew z dwoma rogami przykręcony do pokładu, pomostu lub masztu. Nie ma żadnego mechanizmu — trzyma sam sposób założenia liny. Dzięki temu jest niezawodna i nie niszczy liny, ale wymaga chwili na zawiązanie i rozwiązanie.',
    use: 'Cumy, szpringi, bresty, fały przy maszcie. Zakładasz jeden pełny obrót wokół podstawy, potem 2–3 ósemki przez rogi i kończysz półsztykiem.',
    warn: 'Nie zaczynaj od półsztyka — pod obciążeniem zaciśnie się tak, że nie rozwiążesz go bez noża.',
    svg: KnagaZwykla,
  },
  {
    id: 'knaga-zaciskowa',
    name: 'Knaga zaciskowa (klinowa)',
    group: 'Knagi',
    short: 'Klin z zębami — wciskasz linę z góry, trzyma sama.',
    desc: 'Knaga bez ruchomych części: lina wciśnięta w zwężający się kanał zakleszcza się między ząbkowanymi ściankami. Blokuje błyskawicznie, jednym ruchem ręki, i tak samo szybko się zwalnia — wystarczy szarpnąć linę do góry.',
    use: 'Szoty małych jachtów i jolek, kontrafał, obciągacz, odciągi — wszędzie tam, gdzie linę trzeba trzymać i puszczać w ułamku sekundy.',
    warn: 'Ząbki z czasem przecierają oplot liny. Nie nadaje się do cumowania ani do lin pod stałym, dużym obciążeniem.',
    svg: KnagaZaciskowa,
  },
  {
    id: 'knaga-szczekowa',
    name: 'Knaga szczękowa (krzywkowa)',
    group: 'Knagi',
    short: 'Dwie sprężynowe szczęki — trzyma mocno, puszcza pod kątem.',
    desc: 'Dwie ząbkowane krzywki na sprężynach zaciskają się na linie tym mocniej, im większe obciążenie. Trzyma znacznie pewniej niż knaga klinowa i mniej niszczy oplot. Zwalnia się, unosząc linę w górę ponad szczęki.',
    use: 'Szoty foka i grota, fały, talia obciągacza — na jachtach kabinowych najczęściej spotykany typ. Często razem z prowadnicą (kluzą) naprowadzającą linę.',
    warn: 'Sprężyny lubią się zapiaszczyć — przepłucz słodką wodą, gdy szczęki przestają wracać.',
    svg: KnagaSzczekowa,
  },
  {
    id: 'kluza',
    name: 'Kluza',
    group: 'Kluzy i przelotki',
    short: 'Zamknięty otwór, przez który PRZEWLEKA się linę.',
    desc: 'Okucie z zamkniętym, wygładzonym otworem osadzone w nadburciu, na dziobie lub rufie. Prowadzi cumę w stronę pachołka i chroni burtę oraz linę przed przecieraniem o krawędź pokładu. Lina musi być przez nią przewleczona końcem.',
    use: 'Wyprowadzenie cumy, szpringu lub liny holowniczej z pokładu na zewnątrz jachtu — zawsze przez kluzę, nigdy „na ostro” przez krawędź.',
    warn: 'Kluza musi być gładka. Wyszczerbiona krawędź przetnie napiętą cumę zaskakująco szybko.',
    svg: Kluza,
  },
  {
    id: 'polkluza',
    name: 'Półkluza',
    group: 'Kluzy i przelotki',
    short: 'Otwarta od góry — linę wkładasz, nie przewlekasz.',
    desc: 'To ta sama kluza, tylko otwarta od góry (kształt litery U lub rogalika). Linę wkłada się do niej z góry, bez przewlekania końca — ogromna wygoda, gdy cumujesz sam i musisz działać szybko.',
    use: 'Prowadzenie cum i szpringów przy szybkim cumowaniu; na wielu mazurskich jachtach to podstawowe okucie na dziobie i rufie.',
    warn: 'Skoro jest otwarta, luźna lina potrafi z niej wyskoczyć — przy szarpiącej fali lepsza jest zamknięta kluza.',
    svg: Polkluza,
  },
  {
    id: 'przelotka',
    name: 'Przelotka / oczko prowadzące (fairlead)',
    group: 'Kluzy i przelotki',
    short: 'Naprowadza linę pod właściwym kątem do knagi lub bloczka.',
    desc: 'Małe okucie z gładkim otworem, które zmienia kierunek przebiegu cienkiej liny na pokładzie — np. prowadzi fał od masztu wzdłuż pokładu do knagi w kokpicie. Zmniejsza tarcie i porządkuje liny.',
    use: 'Fały sprowadzone na rufę, refliny, kontrafał, linka miecza.',
    svg: Przelotka,
  },
  {
    id: 'pachol',
    name: 'Pachołek (poler)',
    group: 'Okucia cumownicze',
    short: 'Słupek na pomoście — zarzucasz na niego pętlę cumy.',
    desc: 'Stały słupek na pomoście, nabrzeżu lub keji. Cumę zakłada się na niego gotową pętlą (oko), najlepiej metodą „przez spód” — przekładając własną pętlę przez oko cumy sąsiada, żeby dało się ją zdjąć niezależnie.',
    use: 'Mocowanie cum i szpringów po stronie lądu.',
    warn: 'Nie zarzucaj pętli na cudzą cumę „od góry” — zablokujesz sąsiadowi odejście.',
    svg: Pachol,
  },
  {
    id: 'obuszek',
    name: 'Obuszek / ucho cumownicze',
    group: 'Okucia cumownicze',
    short: 'Metalowy pałąk na pokładzie do zaczepiania lin i karabińczyków.',
    desc: 'Przykręcony do pokładu pałąk (D‑ring), do którego wpina się karabińczyk bloku, szeklę, linkę bezpieczeństwa albo zakłada oko cumy. Przenosi duże siły, bo mocowany jest przez pokład na podkładce.',
    use: 'Punkty mocowania szotów, odciągów, lin asekuracyjnych, holu.',
    svg: Obuszek,
  },
]

/* ——— knagowanie krok po kroku ——— */

interface Step {
  title: string
  desc: string
  rope: ReactNode
}

const CLEAT_BODY = (
  <g>
    <rect x="86" y="104" width="88" height="40" rx="16" fill={METAL_L} stroke={METAL_D} strokeWidth="3" />
    <path d="M86 110 C 68 110, 58 84, 40 87 C 18 90, 18 118, 40 121 C 62 124, 70 114, 86 118 Z" fill={METAL} stroke={METAL_D} strokeWidth="3" />
    <path d="M174 110 C 192 110, 202 84, 220 87 C 242 90, 242 118, 220 121 C 198 124, 190 114, 174 118 Z" fill={METAL} stroke={METAL_D} strokeWidth="3" />
    <circle cx="108" cy="124" r="5" fill={METAL_D} />
    <circle cx="152" cy="124" r="5" fill={METAL_D} />
  </g>
)

const R1 = 'M8 176 C 70 176, 80 158, 130 158 C 190 158, 210 176, 214 104'
const R2 = 'M214 104 C 186 88, 82 88, 46 100'
const R3 = 'M46 100 C 76 146, 184 146, 214 122'
const R4 = 'M214 122 C 198 102, 140 94, 126 104 C 114 114, 128 128, 144 119 L184 100'

function Rope({ paths }: { paths: string[] }) {
  return (
    <g fill="none" stroke={ROPE} strokeWidth="9" strokeLinecap="round">
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  )
}

const STEPS: Step[] = [
  {
    title: '1. Pełny obrót wokół podstawy',
    desc: 'Zacznij od dalszego rogu i obejdź całą podstawę knagi jeden raz. Ten obrót przejmuje większość obciążenia — dopiero na nim buduje się resztę.',
    rope: <Rope paths={[R1]} />,
  },
  {
    title: '2. Pierwsza ósemka',
    desc: 'Przeprowadź linę ukośnie przez środek i zarzuć na przeciwległy róg. Powstaje charakterystyczna „ósemka”.',
    rope: <Rope paths={[R1, R2]} />,
  },
  {
    title: '3. Druga ósemka',
    desc: 'Powtórz przekątną w drugą stronę — dwie, przy grubszej cumie trzy ósemki w zupełności wystarczą.',
    rope: <Rope paths={[R1, R2, R3]} />,
  },
  {
    title: '4. Półsztyk na zakończenie',
    desc: 'Ostatnią pętlę zakładasz odwrotnie, tak żeby zakleszczyła koniec liny. Knaga jest zamknięta — a mimo obciążenia rozwiążesz ją jednym ruchem.',
    rope: <Rope paths={[R1, R2, R3, R4]} />,
  },
]

export default function Fittings() {
  const [sel, setSel] = useState<Fitting>(FITTINGS[0])
  const [step, setStep] = useState(0)

  const groups: Fitting['group'][] = ['Knagi', 'Kluzy i przelotki', 'Okucia cumownicze']

  return (
    <div>
      <p className="lead mb-6 max-w-3xl">
        Liny same się nie utrzymają — trzymają je <b className="text-navy">knagi</b> (na których się je
        wiąże), <b className="text-navy">kluzy i półkluzy</b> (przez które się je prowadzi) oraz{' '}
        <b className="text-navy">pachołki i obuszki</b>. Kliknij okucie, żeby zobaczyć, do czego służy.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
        {/* GALERIA */}
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g}>
              <h3 className="mb-3 font-display text-sm font-700 uppercase tracking-wide text-brine-100/60">{g}</h3>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {FITTINGS.filter((f) => f.group === g).map((f) => {
                  const active = sel.id === f.id
                  return (
                    <motion.button
                      key={f.id}
                      onClick={() => setSel(f)}
                      whileHover={{ y: -3 }}
                      className={`card overflow-hidden p-3 text-left transition-shadow ${active ? 'ring-2 ring-brine-500' : ''}`}
                    >
                      <div className="h-[110px] w-full">
                        <Illustration img={f.img} alt={f.name} className="h-full w-full object-contain">
                          {f.svg}
                        </Illustration>
                      </div>
                      <div className="mt-2 font-display text-sm font-700 text-navy">{f.name}</div>
                      <div className="mt-0.5 text-xs leading-snug text-brine-100/70">{f.short}</div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* KNAGOWANIE KROK PO KROKU */}
          <div className="card p-5">
            <h3 className="font-display text-lg font-700 text-navy">Knagowanie ósemką — krok po kroku</h3>
            <p className="mt-1 text-sm text-brine-100/80">
              Tak wiąże się cumę na knadze rogowej. Każdy żeglarz musi umieć to zrobić bez patrzenia.
            </p>

            <div className="mt-4 grid gap-5 sm:grid-cols-[260px_1fr] sm:items-center">
              <svg viewBox="0 0 260 200" className="w-full rounded-lg bg-white/5">
                {CLEAT_BODY}
                <AnimatePresence mode="wait">
                  <motion.g key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {STEPS[step].rope}
                  </motion.g>
                </AnimatePresence>
              </svg>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">
                  Krok {step + 1} z {STEPS.length}
                </div>
                <h4 className="mt-1 font-display text-base font-700 text-navy">{STEPS[step].title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-brine-100/85">{STEPS[step].desc}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn-ghost disabled:opacity-40">
                    <ChevronLeft className="h-4 w-4" />
                    Wstecz
                  </button>
                  <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1} className="btn-secondary disabled:opacity-40">
                    Dalej
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
            <div className="mx-auto h-[110px] w-full max-w-[220px]">
              <Illustration img={sel.img} alt={sel.name} className="h-full w-full object-contain">
                {sel.svg}
              </Illustration>
            </div>
            <h3 className="mt-3 font-display text-lg font-700 text-navy">{sel.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brine-100/90">{sel.desc}</p>
            <div className="mt-3 rounded-lg bg-white/5 p-3 text-xs leading-relaxed text-brine-100/85">
              <b className="text-navy">Gdzie spotkasz:</b> {sel.use}
            </div>
            {sel.warn && (
              <div className="mt-2 rounded-lg border border-signal/40 bg-signal/10 p-3 text-xs leading-relaxed text-brine-100/85">
                <b className="text-navy">Uwaga:</b> {sel.warn}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
