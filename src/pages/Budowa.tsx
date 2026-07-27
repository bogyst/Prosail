import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui'
import NavLights from '../components/NavLights'
import DeckTopView from '../components/DeckTopView'
import EngineView from '../components/EngineView'
import Fittings from '../components/Fittings'
import BudowaQuiz from '../components/BudowaQuiz'
import YachtDiagram, { PARTS, ACCENT, type Group } from '../components/YachtDiagram'
import { Sailboat, Anchor, Lightbulb, Grid2x2, Cable, Cog, Link2, Target } from 'lucide-react'

type Tab = Group | 'lights' | 'deck' | 'engine' | 'fittings'

const VALID_TABS: Tab[] = ['rig', 'running', 'hull', 'lights', 'deck', 'engine', 'fittings']
const DRAWING_TABS: Tab[] = ['rig', 'running', 'hull']

export default function Budowa() {
  const [params] = useSearchParams()
  const urlTab = params.get('tab') as Tab | null
  const [tab, setTab] = useState<Tab>(urlTab && VALID_TABS.includes(urlTab) ? urlTab : 'rig')
  const [clicked, setClicked] = useState<string | null>('mast')
  const [hover, setHover] = useState<string | null>(null)
  const [quiz, setQuiz] = useState(false)

  const group: Group = DRAWING_TABS.includes(tab) ? (tab as Group) : 'rig'
  const active = hover ?? clicked
  const list = PARTS.filter((p) => p.group === group)
  const activePart = PARTS.find((p) => p.id === active) ?? null

  function switchTab(t: Tab) {
    setTab(t)
    setQuiz(false)
    if (t === 'rig' || t === 'hull' || t === 'running') {
      setClicked(PARTS.find((p) => p.group === t)!.id)
      setHover(null)
    }
  }

  const TABS: [Tab, string, typeof Sailboat][] = [
    ['rig', 'Ożaglowanie', Sailboat],
    ['running', 'Olinowanie ruchome', Cable],
    ['hull', 'Elementy stałe', Anchor],
    ['engine', 'Silnik', Cog],
    ['fittings', 'Knagi i kluzy', Link2],
    ['lights', 'Światła', Lightbulb],
    ['deck', 'Widok z góry', Grid2x2],
  ]

  return (
    <div>
      <PageHeader eyebrow="Budowa jachtu" title="Anatomia slupa">
        Slup to najpopularniejszy typ ożaglowania — jeden maszt, grot i fok. Wybierz część z
        listy (lub kliknij ją na rysunku), a podświetli się na schemacie. Zakładki: ożaglowanie,
        olinowanie ruchome, elementy stałe, silnik, osprzęt pokładowy, światła i widok z góry
        (burty, cumowanie).
      </PageHeader>

      {/* podzakładki */}
      <div className="mb-4 inline-flex flex-wrap rounded-xl border border-white/10 bg-white/5 p-1">
        {TABS.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            className={`btn px-4 py-1.5 text-sm ${tab === id && !quiz ? 'bg-brine-500 text-white' : 'text-brine-100'}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* SPRAWDZIAN — klikanie w części na rysunku */}
      <div className="mb-6">
        <button onClick={() => setQuiz((q) => !q)} className={quiz ? 'btn-ghost' : 'btn-primary'}>
          <Target className="h-4 w-4" />
          {quiz ? 'Wróć do schematu' : 'Sprawdź wiedzę o budowie jachtu'}
        </button>
        {!quiz && (
          <span className="ml-3 text-xs text-brine-100/70">
            Podamy nazwę części — Twoim zadaniem jest kliknąć ją na rysunku.
          </span>
        )}
      </div>

      {quiz ? (
        <BudowaQuiz onClose={() => setQuiz(false)} />
      ) : (
        <>
          {tab === 'lights' && <NavLights />}
          {tab === 'deck' && <DeckTopView />}
          {tab === 'engine' && <EngineView />}
          {tab === 'fittings' && <Fittings />}

          {DRAWING_TABS.includes(tab) && (
            <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
              {/* RYSUNEK */}
              <div className="card self-start p-4">
                <YachtDiagram uid="bud" group={group} active={active} onPick={(id) => setClicked(id)} />
              </div>

              {/* PANEL */}
              <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                {/* lista części (nad opisem — najechanie nie przesuwa listy) */}
                <div className="card p-2">
                  {list.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setClicked(p.id)}
                      onMouseEnter={() => setHover(p.id)}
                      onMouseLeave={() => setHover(null)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        active === p.id ? 'bg-brine-500/25 text-white' : 'text-brine-100 hover:bg-white/5'
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: active === p.id ? ACCENT : 'rgba(123,188,217,0.5)' }}
                      />
                      {p.name}
                    </button>
                  ))}
                </div>

                {/* opis aktywnej części (pod listą) */}
                <motion.div key={activePart?.id ?? 'none'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
                  {activePart ? (
                    <>
                      <h3 className="font-display text-xl font-700 text-navy">{activePart.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-brine-100/90">{activePart.desc}</p>
                    </>
                  ) : (
                    <p className="text-sm text-brine-100/80">Najedź lub kliknij część na liście, aby ją podświetlić.</p>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
