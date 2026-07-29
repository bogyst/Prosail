import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, RotateCcw, X, Check, ArrowRight } from 'lucide-react'
import DiagramFrame from './DiagramFrame'
import YachtDiagram, { PARTS, OK, BAD, type Group, type Part } from './YachtDiagram'

const ROUND = 8

/** Części, w które da się sensownie trafić kliknięciem na rysunku. */
const POOL = PARTS.filter((p) => p.id !== 'waterline' && p.id !== 'lazyjack')

function draw(): Part[] {
  const a = [...POOL]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, ROUND)
}

type Phase = 'ask' | 'right' | 'wrong' | 'done'

export default function BudowaQuiz({ onClose }: { onClose: () => void }) {
  const [seed, setSeed] = useState(0)
  const questions = useMemo(() => draw(), [seed])
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<Phase>('ask')
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [wrongIds, setWrongIds] = useState<string[]>([])

  const q = questions[idx]
  // rysunek pokazuje olinowanie ruchome tylko wtedy, gdy o nie pytamy
  const group: Group = q?.group === 'running' ? 'running' : 'rig'

  function handlePick(id: string) {
    if (phase !== 'ask') return
    setPicked(id)
    if (id === q.id) {
      setScore((s) => s + 1)
      setPhase('right')
    } else {
      setWrongIds((w) => [...w, q.id])
      setPhase('wrong')
    }
  }

  function next() {
    if (idx + 1 >= questions.length) {
      setPhase('done')
    } else {
      setIdx((i) => i + 1)
      setPicked(null)
      setPhase('ask')
    }
  }

  function restart() {
    setSeed((s) => s + 1)
    setIdx(0)
    setPicked(null)
    setScore(0)
    setWrongIds([])
    setPhase('ask')
  }

  // podświetlenia na rysunku: zielona = poprawna, czerwona = błędnie kliknięta
  const marks: Record<string, string> = {}
  if (phase === 'right') marks[q.id] = OK
  if (phase === 'wrong') {
    marks[q.id] = OK
    if (picked) marks[picked] = BAD
  }

  const pct = Math.round((score / questions.length) * 100)

  if (phase === 'done') {
    const missed = PARTS.filter((p) => wrongIds.includes(p.id))
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mx-auto max-w-2xl p-8 text-center">
        <div className="text-5xl">{pct >= 80 ? '🏆' : pct >= 50 ? '⚓' : '📚'}</div>
        <h3 className="mt-3 font-display text-2xl font-700 text-navy">
          {score} / {questions.length} &nbsp;({pct}%)
        </h3>
        <p className="lead mx-auto mt-2 max-w-md text-sm">
          {pct >= 80
            ? 'Świetnie! Nazewnictwo jachtu masz opanowane.'
            : pct >= 50
              ? 'Nieźle — kilka elementów jeszcze warto powtórzyć.'
              : 'Wróć do zakładek z opisami i spróbuj ponownie.'}
        </p>

        {missed.length > 0 && (
          <div className="mt-6 rounded-lg bg-white/5 p-4 text-left">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-brine-100/60">Do powtórki</div>
            <ul className="space-y-1 text-sm text-brine-100/90">
              {missed.map((m) => (
                <li key={m.id}>
                  <b className="text-navy">{m.name}</b> — {m.desc}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={restart} className="btn-primary">
            <RotateCcw className="h-4 w-4" />
            Jeszcze raz
          </button>
          <button onClick={onClose} className="btn-ghost">
            Wróć do schematu
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
      <div className="card min-w-0 self-start p-4">
        <DiagramFrame minWidth={500}>
          <YachtDiagram uid="quiz" group={group} active={null} marks={marks} onPick={handlePick} showMarker={false} />
        </DiagramFrame>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        {/* postęp */}
        <div className="card p-4">
          <div className="flex items-center justify-between text-xs text-brine-100/70">
            <span>
              Pytanie {idx + 1} / {questions.length}
            </span>
            <span>
              Punkty: <b className="text-navy">{score}</b>
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-brine-500" animate={{ width: `${(idx / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* pytanie */}
        <div className="card p-5">
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brine-100/60">
            <Target className="h-3.5 w-3.5" />
            Wskaż na rysunku
          </div>
          <h3 className="font-display text-2xl font-700 leading-tight text-navy">{q.name}</h3>

          <AnimatePresence mode="wait">
            {phase === 'ask' && (
              <motion.p key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-sm text-brine-100/80">
                Kliknij ten element na schemacie po lewej.
              </motion.p>
            )}
            {phase === 'right' && (
              <motion.div key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3">
                <p className="ink-green flex items-center gap-2 font-semibold">
                  <Check className="h-4 w-4" /> Dobrze!
                </p>
                <p className="mt-2 text-sm leading-relaxed text-brine-100/85">{q.desc}</p>
              </motion.div>
            )}
            {phase === 'wrong' && (
              <motion.div key="bad" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3">
                <p className="ink-red flex items-center gap-2 font-semibold">
                  <X className="h-4 w-4" />
                  {picked ? `To jest: ${PARTS.find((p) => p.id === picked)?.name}` : 'Nie ten element'}
                </p>
                <p className="mt-1 text-sm text-brine-100/80">
                  Szukany element podświetlony jest na <span className="ink-green font-semibold">zielono</span>.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-brine-100/85">{q.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {phase !== 'ask' && (
            <button onClick={next} className="btn-primary mt-4 w-full justify-center">
              {idx + 1 >= questions.length ? 'Zobacz wynik' : 'Następne pytanie'}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <button onClick={onClose} className="btn-ghost w-full justify-center">
          <X className="h-4 w-4" />
          Zakończ sprawdzian
        </button>
      </div>
    </div>
  )
}
