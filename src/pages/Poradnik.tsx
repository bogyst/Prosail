import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui'
import { ClipboardCheck, Handshake, RotateCcw } from 'lucide-react'

/* ================= CHECKLISTA ================= */

interface ChkItem {
  id: string
  label: string
  hint?: string
}
interface ChkGroup {
  name: string
  emoji: string
  items: ChkItem[]
}

const GROUPS: ChkGroup[] = [
  {
    name: 'Dokumenty i formalności',
    emoji: '🪪',
    items: [
      { id: 'patent', label: 'Patent żeglarski (jeśli masz)', hint: 'lub dokument tożsamości na czarter' },
      { id: 'czarter', label: 'Umowa czarteru / rezerwacja' },
      { id: 'kasa', label: 'Gotówka na porty i mosty', hint: 'część portów nie przyjmuje kart' },
      { id: 'tel', label: 'Telefon + powerbank w woreczku wodoszczelnym', hint: 'numer ratunkowy: 601 100 100' },
    ],
  },
  {
    name: 'Ubranie',
    emoji: '🧥',
    items: [
      { id: 'sztormiak', label: 'Sztormiak / kurtka przeciwdeszczowa' },
      { id: 'polar', label: 'Ciepła warstwa (polar) — nawet latem', hint: 'wieczory na wodzie są zimne' },
      { id: 'buty', label: 'Obuwie na jasnej, nieślizgającej podeszwie' },
      { id: 'czapka', label: 'Czapka z daszkiem i czapka ciepła' },
      { id: 'okulary', label: 'Okulary przeciwsłoneczne (z troczkiem)' },
      { id: 'rekawiczki', label: 'Rękawiczki żeglarskie', hint: 'chronią dłonie przy pracy szotami' },
      { id: 'zapas', label: 'Zapasowy komplet ubrań w worku wodoszczelnym' },
    ],
  },
  {
    name: 'Bezpieczeństwo',
    emoji: '🦺',
    items: [
      { id: 'kamizelka', label: 'Kamizelka asekuracyjna (sprawdź stan!)' },
      { id: 'apteczka', label: 'Apteczka + leki własne' },
      { id: 'krem', label: 'Krem z filtrem UV' },
      { id: 'noz', label: 'Nóż żeglarski / multitool' },
      { id: 'latarka', label: 'Latarka (najlepiej czołówka) + baterie' },
      { id: 'gwizdek', label: 'Gwizdek sygnałowy' },
    ],
  },
  {
    name: 'Wyposażenie i prowiant',
    emoji: '🎒',
    items: [
      { id: 'spiwor', label: 'Śpiwór + poduszka' },
      { id: 'recznik', label: 'Ręcznik szybkoschnący' },
      { id: 'woda', label: 'Woda pitna (zapas!) i prowiant' },
      { id: 'kubek', label: 'Kubek termiczny' },
      { id: 'worek', label: 'Miękka torba zamiast walizki', hint: 'walizka nie mieści się w jachtowych schowkach' },
      { id: 'srodek-owady', label: 'Środek na komary (Mazury!)' },
      { id: 'mapa', label: 'Mapa akwenu / locja papierowa', hint: 'elektronika lubi zamoknąć' },
    ],
  },
]

const STORAGE_KEY = 'prosail-checklist-v1'

function Checklista() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setChecked(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  function toggle(id: string) {
    setChecked((c) => {
      const next = { ...c, [id]: !c[id] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  function reset() {
    setChecked({})
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  const total = GROUPS.reduce((s, g) => s + g.items.length, 0)
  const done = useMemo(() => GROUPS.reduce((s, g) => s + g.items.filter((i) => checked[i.id]).length, 0), [checked])
  const pct = Math.round((done / total) * 100)

  return (
    <div>
      {/* pasek postępu pakowania */}
      <div className="card mb-6 flex items-center gap-4 p-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-navy">Spakowano {done} z {total}</span>
            <span className="tabular-nums text-brine-100">{pct}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-sand-200">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: pct === 100 ? '#1c7c4a' : '#c8382e' }}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
        <button onClick={reset} className="btn-ghost shrink-0 text-xs">
          <RotateCcw className="h-3.5 w-3.5" /> Wyczyść
        </button>
      </div>
      {pct === 100 && (
        <div className="card mb-6 border-buoyGreen/40 bg-buoyGreen/10 p-4 text-center text-sm font-semibold ink-green">
          ⚓ Wszystko spakowane — do zobaczenia na wodzie!
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {GROUPS.map((g) => (
          <div key={g.name} className="card p-5">
            <h3 className="mb-3 font-display text-lg font-700 text-navy">
              {g.emoji} {g.name}
              <span className="ml-2 text-sm font-sans font-normal text-brine-100/70">
                {g.items.filter((i) => checked[i.id]).length}/{g.items.length}
              </span>
            </h3>
            <ul className="space-y-1">
              {g.items.map((i) => (
                <li key={i.id}>
                  <button
                    onClick={() => toggle(i.id)}
                    className={`tap flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-sand-100 ${
                      checked[i.id] ? 'opacity-60' : ''
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border-2 text-xs font-bold ${
                        checked[i.id] ? 'border-buoyGreen bg-buoyGreen text-white' : 'border-brine-300/60 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-sm">
                      <span className={checked[i.id] ? 'text-brine-100 line-through' : 'text-navy'}>{i.label}</span>
                      {i.hint && <span className="block text-xs text-brine-100/70">{i.hint}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================= NAWYKI I ETYKIETA ================= */

const HABITS: { title: string; emoji: string; rules: string[] }[] = [
  {
    title: 'Bezpieczeństwo przede wszystkim',
    emoji: '🦺',
    rules: [
      'Kamizelka asekuracyjna zawsze na wodzie — sternik świeci przykładem.',
      'Jedna ręka dla jachtu, druga dla siebie — zawsze się czegoś trzymaj.',
      'Nie siadaj na bomie ani nie stawaj na szotach; uwaga na bom przy zwrotach.',
      'Alkohol i sterowanie nigdy nie idą w parze.',
      'Sprawdź prognozę przed wypłynięciem i obserwuj wieże sygnalizacyjne (40/90 błysków).',
    ],
  },
  {
    title: 'Kultura na pokładzie',
    emoji: '🤝',
    rules: [
      'Komendy sternika wykonuje się od razu, dyskutuje po manewrze.',
      'Meldunek po wykonaniu: „szoty wybrane”, „cuma podana” — sternik musi wiedzieć.',
      'Każdy ma wachtę i obowiązki — klar na pokładzie robi się wspólnie.',
      'Cudzy jacht to czyjś dom: nie wchodzisz bez pytania, nie przechodzisz przez kokpit, tylko przez dziób.',
    ],
  },
  {
    title: 'W porcie i na kotwicy',
    emoji: '⚓',
    rules: [
      'W porcie zwalniamy — martwa fala niszczy cumy i nerwy sąsiadów.',
      'Cumujesz przy kimś burta w burtę? Zapytaj i wyłóż odbijacze.',
      'Cisza nocna na przystani obowiązuje też załogi „w szampańskich humorach”.',
      'Zostaw keję czystszą, niż ją zastałeś; śmieci zabierz do portu.',
    ],
  },
  {
    title: 'Ekologia i szacunek do wody',
    emoji: '🌿',
    rules: [
      'Nic nie wyrzucamy za burtę — także niedopałków i resztek jedzenia.',
      'Chemia do naczyń tylko biodegradowalna; toaleta — w portach.',
      'Omijaj trzcinowiska i strefy ciszy — to dom ptaków.',
      'Zamykaj za sobą śluzy i pomosty tak, jak je zastałeś.',
    ],
  },
  {
    title: 'Dobre nawyki żeglarza',
    emoji: '🧭',
    rules: [
      'Przed wypłynięciem: odprawa załogi — kto za co odpowiada i gdzie leży sprzęt ratunkowy.',
      'Klar lin: każda lina wybuchtowana, nic nie pływa po kokpicie.',
      'Patrz za siebie — doganiający też ma prawa, a Ty masz martwe pole za grotem.',
      'Ucz się na manewrach innych: obserwacja portu to darmowa lekcja.',
      'Wpisuj rejsy do dzienniczka — staż przyda się do kolejnych patentów.',
    ],
  },
]

function Nawyki() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {HABITS.map((h, idx) => (
        <motion.div
          key={h.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`card p-5 ${idx === HABITS.length - 1 ? 'md:col-span-2' : ''}`}
        >
          <h3 className="mb-3 font-display text-lg font-700 text-navy">
            {h.emoji} {h.title}
          </h3>
          <ul className="space-y-2">
            {h.rules.map((r) => (
              <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-brine-100">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                {r}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}

/* ================= STRONA ================= */

const TABS = [
  { id: 'checklista', label: 'Co zabrać na jacht', icon: ClipboardCheck },
  { id: 'nawyki', label: 'Dobre nawyki i etykieta', icon: Handshake },
] as const

export default function Poradnik() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('checklista')
  return (
    <div>
      <PageHeader eyebrow="Poradnik" title="Przed rejsem">
        Interaktywna checklista pakowania (zapamiętuje Twoje odhaczenia) oraz zbiór dobrych
        nawyków i zasad zachowania na jachcie, w porcie i na wodzie.
      </PageHeader>

      <div className="mb-6 inline-flex flex-wrap rounded-xl border border-white/10 bg-white/5 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`btn tap px-4 py-2 text-sm ${tab === id ? 'bg-brine-500 text-white' : 'text-brine-100'}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'checklista' && <Checklista />}
      {tab === 'nawyki' && <Nawyki />}
    </div>
  )
}
