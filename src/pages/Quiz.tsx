import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '../components/ui'
import { Check, X, RotateCcw, Trophy, Shuffle, Play } from 'lucide-react'

interface Question {
  topic: string
  q: string
  options: string[]
  correct: number
  explain: string
}

// Baza pytań — rozbudowywana. Algorytm sam wykrywa działy po polu `topic`.
const QUESTIONS: Question[] = [
  {
    topic: 'Teoria',
    q: 'Jak nazywa się kurs, na którym wiatr wieje mniej więcej z boku jachtu (ok. 90°)?',
    options: ['Bajdewind', 'Półwiatr', 'Fordewind', 'Baksztag'],
    correct: 1,
    explain: 'Półwiatr to kurs, gdy wiatr wieje z trawersu (~90°). Zwykle najszybszy i najprzyjemniejszy.',
  },
  {
    topic: 'Teoria',
    q: 'Co robimy, aby dopłynąć do celu leżącego dokładnie pod wiatr?',
    options: ['Płyniemy prosto', 'Halsujemy (zygzak)', 'Zwijamy żagle', 'Płyniemy fordewindem'],
    correct: 1,
    explain: 'W martwym kącie nie da się płynąć wprost — halsujemy, czyli płyniemy zygzakiem, zmieniając halsy zwrotami przez sztag.',
  },
  {
    topic: 'Teoria',
    q: 'Do jakiego wiatru trymuje się żagle?',
    options: ['Rzeczywistego', 'Pozornego', 'Geostroficznego', 'Termicznego'],
    correct: 1,
    explain: 'Żagle ustawia się względem wiatru pozornego — odczuwanego na płynącym jachcie (suma wiatru rzeczywistego i „wiatru z ruchu”).',
  },
  {
    topic: 'Teoria',
    q: 'Tryb „motylek” stosuje się na kursie:',
    options: ['Bajdewind', 'Półwiatr', 'Fordewind', 'Baksztag'],
    correct: 2,
    explain: 'Na czystym fordewindzie grot i fok wystawia się na przeciwne burty („motylek”), aby złapać jak najwięcej wiatru z rufy.',
  },
  {
    topic: 'Locja',
    q: 'Na polskim szlaku śródlądowym znak PRAWEJ strony (patrząc w dół rzeki) ma kolor:',
    options: ['Czerwony', 'Zielony', 'Żółty', 'Czarno-żółty'],
    correct: 0,
    explain: 'Na wodach śródlądowych w Polsce prawa strona szlaku jest czerwona (bakeny prostokątne), a lewa zielona (trójkątne).',
  },
  {
    topic: 'Locja',
    q: 'Znak kardynalny północny (N) mówi, że bezpieczna woda jest:',
    options: ['Na północ od znaku', 'Na południe od znaku', 'Pod znakiem', 'Dookoła'],
    correct: 0,
    explain: 'Nazwa znaku kardynalnego wskazuje stronę, po której jest bezpieczna, głęboka woda — mijamy go od północy.',
  },
  {
    topic: 'Locja',
    q: 'Dwie czarne kule jedna nad drugą na topie pławy to znak:',
    options: ['Bezpiecznej wody', 'Specjalny', 'Izolowanego niebezpieczeństwa', 'Prawej strony szlaku'],
    correct: 2,
    explain: 'To znak izolowanego niebezpieczeństwa — postawiony na przeszkodzie o niewielkiej rozciągłości. Omijaj z dala.',
  },
  {
    topic: 'Locja',
    q: 'Żółty romb zawieszony pod przęsłem mostu oznacza:',
    options: ['Zakaz przejścia', 'Zalecane przejście (przęsło żeglowne)', 'Ograniczenie prędkości', 'Miejsce postoju'],
    correct: 1,
    explain: 'Żółty romb wskazuje przęsło żeglowne — zalecane miejsce przejścia pod mostem.',
  },
  {
    topic: 'Meteorologia',
    q: 'Ile stopni ma skala Beauforta?',
    options: ['Od 0 do 10', 'Od 1 do 12', 'Od 0 do 12', 'Od 0 do 8'],
    correct: 2,
    explain: 'Skala Beauforta obejmuje stopnie od 0 (cisza) do 12 (huragan).',
  },
  {
    topic: 'Meteorologia',
    q: 'Która chmura najczęściej zwiastuje burzę i groźne szkwały?',
    options: ['Cirrus', 'Stratus', 'Cumulonimbus', 'Stratocumulus'],
    correct: 2,
    explain: 'Cumulonimbus (Cb) to potężna chmura burzowa z „kowadłem” — niesie ulewy, grad i gwałtowne porywy wiatru.',
  },
  {
    topic: 'Meteorologia',
    q: 'Na mazurskiej wieży ostrzegawczej 90 błysków na minutę oznacza:',
    options: ['Spokój', 'Ostrzeżenie', 'Alarm — niebezpieczeństwo', 'Koniec ostrzeżenia'],
    correct: 2,
    explain: '40 błysków/min to ostrzeżenie (spodziewane pogorszenie), a 90 błysków/min to alarm — burza i silny wiatr nadchodzą w krótkim czasie.',
  },
  {
    topic: 'Przepisy',
    q: 'Dwa jachty na przeciwnych halsach — który ma pierwszeństwo?',
    options: ['Na halsie lewym', 'Na halsie prawym', 'Większy', 'Ten z prawej'],
    correct: 1,
    explain: 'Pierwszeństwo ma jacht na halsie prawym (wiatr z prawej burty). Jacht na halsie lewym ustępuje.',
  },
  {
    topic: 'Przepisy',
    q: 'Żaglówka i motorówka na kursach kolizyjnych — kto zasadniczo ustępuje?',
    options: ['Żaglówka', 'Motorówka', 'Żadna', 'Mniejsza jednostka'],
    correct: 1,
    explain: 'Co do zasady jednostka o napędzie mechanicznym ustępuje jachtowi pod żaglami — z pewnymi wyjątkami.',
  },
  {
    topic: 'Przepisy',
    q: 'Cztery krótkie dźwięki oznaczają:',
    options: ['Skręcam w prawo', 'Nie mogę manewrować', 'Cofam', 'Wzywam pomocy'],
    correct: 1,
    explain: '4 krótkie = „Nie mogę manewrować”. 1 krótki = w prawo, 2 = w lewo, 3 = wstecz; powtarzane długie = wzywam pomocy.',
  },
  {
    topic: 'Przepisy',
    q: 'Czarna kula wywieszona na dziobie w dzień oznacza jednostkę:',
    options: ['Na mieliźnie', 'Na kotwicy', 'Holującą', 'Rybacką'],
    correct: 1,
    explain: 'Kula = postój na kotwicy. W nocy zastępuje ją białe światło widoczne dookoła widnokręgu.',
  },
  {
    topic: 'Węzły',
    q: 'Który węzeł tworzy niezaciskającą się pętlę (np. do podania tonącemu)?',
    options: ['Ósemka', 'Węzeł płaski', 'Węzeł ratowniczy', 'Wyblinka'],
    correct: 2,
    explain: 'Węzeł ratowniczy (bowline) daje pętlę stałej wielkości, która się nie zaciska pod obciążeniem.',
  },
  {
    topic: 'Węzły',
    q: 'Węzeł stoperowy zapobiegający wyślizgnięciu się liny z bloczka to:',
    options: ['Ósemka', 'Wyblinka', 'Szotowy', 'Refowy'],
    correct: 0,
    explain: 'Ósemka to podstawowy stoper na końcu liny — łatwa do zawiązania i rozwiązania nawet po obciążeniu.',
  },
  {
    topic: 'Węzły',
    q: 'Do szybkiego przymocowania cumy do pachołka/słupka użyjesz:',
    options: ['Ósemki', 'Wyblinki', 'Węzła płaskiego', 'Kluczki'],
    correct: 1,
    explain: 'Wyblinka (clove hitch) to szybkie mocowanie liny do słupka czy relingu — łatwo też regulować jej długość.',
  },
  {
    topic: 'Ratownictwo',
    q: 'Wodny numer ratunkowy w Polsce (WOPR/MOPR) to:',
    options: ['601 100 100', '112 tylko', '986', '991'],
    correct: 0,
    explain: '601 100 100 to numer ratownictwa wodnego (obok ogólnego 112 i wodnego 984).',
  },
  {
    topic: 'Ratownictwo',
    q: 'Pierwsze trzy odruchy po wypadnięciu człowieka za burtę (zasada ASO) to:',
    options: ['Alarm, środki ratunkowe, obserwator', 'Alarm, silnik, ster', 'Skok do wody, alarm, cumowanie', 'Zwrot, refowanie, alarm'],
    correct: 0,
    explain: 'ASO: Alarm („Człowiek za burtą!”), Środki ratunkowe (rzucone z nawietrznej), Obserwator wyznaczony po imieniu.',
  },
  {
    topic: 'Ratownictwo',
    q: 'RKO u osoby wyciągniętej z wody (tonięcie) zaczynamy od:',
    options: ['30 uciśnięć', '5 oddechów ratowniczych', 'Pozycji bocznej', 'Ogrzewania'],
    correct: 1,
    explain: 'Przy tonięciu przyczyną jest niedotlenienie — dlatego zaczynamy od 5 oddechów ratowniczych, potem 30:2.',
  },
]

const TOPICS = [...new Set(QUESTIONS.map((q) => q.topic))]
const MIX_SIZES = [10, 30, 50, 75]

type Mode = { kind: 'topic'; topic: string } | { kind: 'mix'; size: number }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// mix: losuj możliwie równomiernie ze wszystkich działów
function buildMix(size: number): Question[] {
  const byTopic = TOPICS.map((t) => shuffle(QUESTIONS.filter((q) => q.topic === t)))
  const out: Question[] = []
  let added = true
  while (out.length < size && added) {
    added = false
    for (const pool of byTopic) {
      if (out.length >= size) break
      const q = pool.shift()
      if (q) {
        out.push(q)
        added = true
      }
    }
  }
  return shuffle(out)
}

export default function Quiz() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [seed, setSeed] = useState(0)
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ topic: string; ok: boolean }[]>([])
  const [done, setDone] = useState(false)

  const questions = useMemo(() => {
    if (!mode) return []
    if (mode.kind === 'topic') return shuffle(QUESTIONS.filter((q) => q.topic === mode.topic))
    return buildMix(mode.size)
  }, [mode, seed])

  const cur = questions[i]
  const score = answers.filter((a) => a.ok).length

  function start(m: Mode) {
    setMode(m)
    setSeed((s) => s + 1)
    setI(0)
    setPicked(null)
    setAnswers([])
    setDone(false)
  }

  function choose(idx: number) {
    if (picked !== null || !cur) return
    setPicked(idx)
    setAnswers((a) => [...a, { topic: cur.topic, ok: idx === cur.correct }])
  }

  function next() {
    if (i + 1 >= questions.length) setDone(true)
    else {
      setI((n) => n + 1)
      setPicked(null)
    }
  }

  // wyniki per dział
  const perTopic = useMemo(() => {
    const m = new Map<string, { ok: number; all: number }>()
    for (const a of answers) {
      const e = m.get(a.topic) ?? { ok: 0, all: 0 }
      e.all += 1
      if (a.ok) e.ok += 1
      m.set(a.topic, e)
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [answers])

  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0

  /* ---------- EKRAN STARTOWY ---------- */
  if (!mode) {
    return (
      <div>
        <PageHeader eyebrow="Quiz" title="Sprawdź swoją wiedzę">
          Wybierz dział, z którego chcesz się sprawdzić, albo tryb „Mix” z pytaniami ze
          wszystkich działów. Baza pytań stale rośnie — obecnie {QUESTIONS.length} pytań.
        </PageHeader>

        <div className="mx-auto max-w-3xl space-y-6">
          <div className="card p-6">
            <h3 className="mb-3 font-display text-lg font-700 text-navy">Wybierz dział</h3>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => {
                const count = QUESTIONS.filter((q) => q.topic === t).length
                return (
                  <button key={t} onClick={() => start({ kind: 'topic', topic: t })} className="btn-ghost">
                    <Play className="h-4 w-4" />
                    {t} <span className="text-xs text-brine-100/50">({count})</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-1 flex items-center gap-2 font-display text-lg font-700 text-navy">
              <Shuffle className="h-5 w-5 text-brine-300" /> Mix — wszystkie działy
            </h3>
            <p className="mb-3 text-sm text-brine-100/70">
              Pytania losowane równomiernie ze wszystkich działów. Wybierz długość testu:
            </p>
            <div className="flex flex-wrap gap-2">
              {MIX_SIZES.map((s) => {
                const real = Math.min(s, QUESTIONS.length)
                return (
                  <button key={s} onClick={() => start({ kind: 'mix', size: s })} className="btn-primary">
                    {s} pytań{real < s ? ` (dziś: ${real})` : ''}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- PODSUMOWANIE ---------- */
  if (done) {
    return (
      <div>
        <PageHeader eyebrow="Quiz" title="Twój wynik" />
        <div className="mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
            <Trophy className="mx-auto h-16 w-16 text-rope" />
            <h2 className="mt-4 font-display text-4xl font-700 text-navy">
              {score} / {questions.length}
              <span className="ml-3 text-2xl text-brine-300">({pct}%)</span>
            </h2>
            <p className="lead mt-2">
              {pct >= 80 ? '🎉 Świetnie! Jesteś gotów na wodę.' : pct >= 50 ? '👍 Nieźle! Powtórz słabsze działy.' : '📚 Warto wrócić do materiałów i spróbować ponownie.'}
            </p>

            {/* wynik per dział */}
            <div className="mt-6 space-y-3 text-left">
              <div className="text-xs font-semibold uppercase tracking-wide text-brine-100/60">Wynik według działów</div>
              {perTopic.map(([topic, r]) => {
                const p = Math.round((r.ok / r.all) * 100)
                return (
                  <div key={topic}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brine-100">{topic}</span>
                      <span className="tabular-nums font-semibold text-navy">
                        {r.ok}/{r.all} · {p}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: p >= 80 ? '#1fa463' : p >= 50 ? '#f4c430' : '#e2454a' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${p}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button onClick={() => start(mode)} className="btn-primary">
                <RotateCcw className="h-4 w-4" />
                Jeszcze raz
              </button>
              <button onClick={() => setMode(null)} className="btn-ghost">Zmień dział / tryb</button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  /* ---------- PYTANIE ---------- */
  return (
    <div>
      <PageHeader
        eyebrow="Quiz"
        title={mode.kind === 'topic' ? `Dział: ${mode.topic}` : 'Mix — wszystkie działy'}
      />
      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="chip">{cur.topic}</span>
              <span className="text-brine-100/70">
                Pytanie {i + 1}/{questions.length} · wynik {score}
              </span>
            </div>

            <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-brine-500 transition-all" style={{ width: `${((i + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }} />
            </div>

            <h3 className="font-display text-xl font-700 text-navy">{cur.q}</h3>

            <div className="mt-5 space-y-3">
              {cur.options.map((opt, idx) => {
                const isCorrect = idx === cur.correct
                const isPicked = idx === picked
                let cls = 'border-white/10 bg-white/5 hover:bg-white/10'
                if (picked !== null) {
                  if (isCorrect) cls = 'border-buoyGreen/60 bg-buoyGreen/15'
                  else if (isPicked) cls = 'border-buoyRed/60 bg-buoyRed/15'
                  else cls = 'border-white/10 bg-white/5 opacity-60'
                }
                return (
                  <button key={idx} onClick={() => choose(idx)} disabled={picked !== null} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${cls}`}>
                    <span className="flex-1 text-navy">{opt}</span>
                    {picked !== null && isCorrect && <Check className="h-5 w-5 text-buoyGreen" />}
                    {picked !== null && isPicked && !isCorrect && <X className="h-5 w-5 text-buoyRed" />}
                  </button>
                )
              })}
            </div>

            <AnimatePresence>
              {picked !== null && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 overflow-hidden">
                  <div className="rounded-xl bg-white/5 p-4 text-sm text-brine-100/90">
                    <b className={picked === cur.correct ? 'text-buoyGreen' : 'text-buoyRed'}>
                      {picked === cur.correct ? 'Dobrze! ' : 'Niezupełnie. '}
                    </b>
                    {cur.explain}
                  </div>
                  <button onClick={next} className="btn-primary mt-4 w-full justify-center">
                    {i + 1 >= questions.length ? 'Zobacz wynik' : 'Następne pytanie'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
