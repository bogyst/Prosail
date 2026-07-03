import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '../components/ui'
import { Check, X, RotateCcw, Trophy } from 'lucide-react'

interface Question {
  topic: string
  q: string
  options: string[]
  correct: number
  explain: string
}

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
    topic: 'Locja',
    q: 'Na polskim szlaku śródlądowym znak PRAWEJ strony (patrząc w dół rzeki) ma kolor:',
    options: ['Czerwony', 'Zielony', 'Żółty', 'Czarno-żółty'],
    correct: 0,
    explain: 'Na wodach śródlądowych w Polsce prawa strona szlaku jest czerwona (bakeny prostokątne), a lewa zielona (trójkątne). Na morzu (IALA A) jest odwrotnie względem burt.',
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
    topic: 'Meteo',
    q: 'Ile stopni ma skala Beauforta?',
    options: ['Od 0 do 10', 'Od 1 do 12', 'Od 0 do 12', 'Od 0 do 8'],
    correct: 2,
    explain: 'Skala Beauforta obejmuje stopnie od 0 (cisza) do 12 (huragan).',
  },
  {
    topic: 'Meteo',
    q: 'Która chmura najczęściej zwiastuje burzę i groźne szkwały?',
    options: ['Cirrus', 'Stratus', 'Cumulonimbus', 'Stratocumulus'],
    correct: 2,
    explain: 'Cumulonimbus (Cb) to potężna chmura burzowa z „kowadłem” — niesie ulewy, grad i gwałtowne porywy wiatru.',
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
    explain: 'Co do zasady jednostka o napędzie mechanicznym (motorówka) ustępuje jachtowi pod żaglami — z pewnymi wyjątkami.',
  },
  {
    topic: 'Przepisy',
    q: 'Nocą widzisz czerwone światło burtowe innej jednostki. Patrzysz na jej:',
    options: ['Prawą burtę', 'Lewą burtę', 'Rufę', 'Dziób wprost'],
    correct: 1,
    explain: 'Czerwone światło jest na lewej burcie (bakburcie). Widząc je, patrzysz na lewą burtę tej jednostki — zwykle to Ty ustępujesz.',
  },
  {
    topic: 'Węzły',
    q: 'Który węzeł tworzy niezaciskającą się pętlę (np. do podania tonącemu)?',
    options: ['Ósemka', 'Węzeł płaski', 'Węzeł ratowniczy', 'Wyblinka'],
    correct: 2,
    explain: 'Węzeł ratowniczy (bowline) daje pętlę stałej wielkości, która się nie zaciska pod obciążeniem.',
  },
]

export default function Quiz() {
  // losowa kolejność pytań przy każdym podejściu
  const [seed, setSeed] = useState(0)
  const questions = useMemo(() => shuffle(QUESTIONS), [seed])

  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const cur = questions[i]

  function choose(idx: number) {
    if (picked !== null) return
    setPicked(idx)
    if (idx === cur.correct) setScore((s) => s + 1)
  }

  function next() {
    if (i + 1 >= questions.length) {
      setDone(true)
    } else {
      setI((n) => n + 1)
      setPicked(null)
    }
  }

  function restart() {
    setSeed((s) => s + 1)
    setI(0)
    setPicked(null)
    setScore(0)
    setDone(false)
  }

  const pct = Math.round((score / questions.length) * 100)

  return (
    <div>
      <PageHeader eyebrow="Quiz" title="Sprawdź swoją wiedzę">
        {questions.length} pytań ze wszystkich działów — teorii, locji, meteorologii,
        przepisów i węzłów. Po każdej odpowiedzi zobaczysz wyjaśnienie.
      </PageHeader>

      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center"
            >
              <Trophy className="mx-auto h-16 w-16 text-rope" />
              <h2 className="mt-4 font-display text-3xl font-700 text-white">
                {score} / {questions.length}
              </h2>
              <p className="lead mt-2">
                {pct >= 80
                  ? '🎉 Świetnie! Jesteś gotów na wodę.'
                  : pct >= 50
                    ? '👍 Nieźle! Powtórz jeszcze kilka działów.'
                    : '📚 Warto wrócić do materiałów i spróbować ponownie.'}
              </p>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-brine-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <button onClick={restart} className="btn-primary mx-auto mt-6">
                <RotateCcw className="h-4 w-4" />
                Zagraj jeszcze raz
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="card p-6 sm:p-8"
            >
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="chip">{cur.topic}</span>
                <span className="text-brine-100/70">
                  Pytanie {i + 1}/{questions.length} · wynik {score}
                </span>
              </div>

              <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-brine-500 transition-all"
                  style={{ width: `${((i + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }}
                />
              </div>

              <h3 className="font-display text-xl font-700 text-white">{cur.q}</h3>

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
                    <button
                      key={idx}
                      onClick={() => choose(idx)}
                      disabled={picked !== null}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${cls}`}
                    >
                      <span className="flex-1 text-white">{opt}</span>
                      {picked !== null && isCorrect && <Check className="h-5 w-5 text-buoyGreen" />}
                      {picked !== null && isPicked && !isCorrect && <X className="h-5 w-5 text-buoyRed" />}
                    </button>
                  )
                })}
              </div>

              <AnimatePresence>
                {picked !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 overflow-hidden"
                  >
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
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
