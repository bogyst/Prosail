import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader, Accordion, AccordionItem } from '../components/ui'
import { Phone, HeartPulse, LifeBuoy, Thermometer, Droplets, Hand } from 'lucide-react'

/* ================= NUMERY ================= */

const NUMBERS = [
  { n: '112', label: 'Europejski numer alarmowy', note: 'Łączy ze wszystkimi służbami. Dzwoń, gdy zagrożone jest życie lub zdrowie.', primary: false },
  { n: '601 100 100', label: 'Ratownictwo wodne (WOPR / MOPR)', note: 'Wodny numer alarmowy dla całej Polski — także na Wielkich Jeziorach Mazurskich.', primary: true },
  { n: '984', label: 'Wodne pogotowie ratunkowe', note: 'Alternatywny numer ratownictwa wodnego.', primary: false },
  { n: '999', label: 'Pogotowie ratunkowe', note: 'Pomoc medyczna (ratownictwo medyczne).', primary: false },
  { n: '998', label: 'Straż pożarna', note: 'Także ewakuacja, wypompowywanie wody.', primary: false },
  { n: '997', label: 'Policja', note: 'Wypadki, zdarzenia, zabezpieczenie.', primary: false },
]

function Numery() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NUMBERS.map((x) => (
          <a
            key={x.n}
            href={`tel:${x.n.replace(/\s/g, '')}`}
            className={`card block p-5 transition-transform hover:-translate-y-0.5 ${x.primary ? 'ring-2 ring-buoyRed/60' : ''}`}
          >
            <div className="flex items-center gap-2 text-brine-200">
              <Phone className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">{x.label}</span>
            </div>
            <div className={`mt-1 font-display text-3xl font-700 ${x.primary ? 'text-buoyRed' : 'text-white'}`}>{x.n}</div>
            <p className="mt-1 text-xs leading-relaxed text-brine-100/80">{x.note}</p>
          </a>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-700 text-white">
            <LifeBuoy className="h-5 w-5 text-brine-300" /> MOPR — Mazurskie Ochotnicze Pogotowie Ratunkowe
          </h3>
          <p className="mt-2 text-sm text-brine-100/85">
            Na Szlaku Wielkich Jezior stałe bazy ratowników działają m.in. w{' '}
            <b className="text-white">Giżycku, Mikołajkach, Piszu</b> oraz w{' '}
            <b className="text-white">Harszu / Skłodowie</b> nad jeziorem Mamry. MOPR wezwiesz przez{' '}
            <b className="text-buoyRed">601&nbsp;100&nbsp;100</b> lub <b>112</b>.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="font-display text-lg font-700 text-white">Co podać przy zgłoszeniu</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-brine-100/85">
            <li>📍 <b className="text-white">Gdzie</b> — akwen, pobliski port/miejscowość, kierunek, punkty charakterystyczne.</li>
            <li>❗ <b className="text-white">Co się stało</b> i ilu jest poszkodowanych.</li>
            <li>🩺 <b className="text-white">Stan</b> poszkodowanych (przytomność, oddech, urazy).</li>
            <li>📞 Swoje <b className="text-white">imię i numer telefonu</b>.</li>
            <li>⏳ <b className="text-white">Nie rozłączaj się pierwszy</b> — czekaj na pytania dyspozytora.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ================= PIERWSZA POMOC ================= */

function Pomoc() {
  return (
    <div>
      <div className="card mb-6 p-6">
        <h3 className="font-display text-lg font-700 text-white">Łańcuch przeżycia</h3>
        <p className="mt-2 text-sm text-brine-100/85">
          <b className="text-white">Bezpieczeństwo → sprawdzenie → wezwanie pomocy (112 / 601 100 100) → RKO → defibrylacja / przekazanie służbom.</b>{' '}
          Najpierw zadbaj o własne bezpieczeństwo — ratownik, który sam wpadnie do wody, nie pomoże nikomu.
        </p>
      </div>

      <Accordion>
        <AccordionItem id="p1" title="Sprawdzenie przytomności i oddechu" icon={<HeartPulse className="h-5 w-5" />}>
          <p>
            Zapytaj głośno, potrząśnij za ramiona. Brak reakcji → udrożnij drogi oddechowe (odchyl głowę,
            unieś żuchwę) i przez <b>10 sekund</b> patrz, słuchaj i wyczuwaj oddech. Pojedyncze westchnięcia
            (gasping) to <b>NIE</b> prawidłowy oddech.
          </p>
        </AccordionItem>
        <AccordionItem id="p2" title="RKO — resuscytacja 30:2" icon={<HeartPulse className="h-5 w-5" />}>
          <p>
            Brak oddechu → wezwij pomoc (112) i zacznij <b>RKO</b>: 30 uciśnięć klatki piersiowej (na środku,
            głębokość ok. <b>5–6 cm</b>, tempo <b>100–120/min</b>), potem 2 oddechy ratownicze. Powtarzaj 30:2
            do przyjazdu służb, użycia AED lub powrotu oddechu. Jeśli nie umiesz/‑nie chcesz robić oddechów —
            uciskaj bez przerwy.
          </p>
        </AccordionItem>
        <AccordionItem id="p3" title="Tonięcie — 5 wdechów na start" icon={<Droplets className="h-5 w-5" />}>
          <p>
            W przypadku <b>tonięcia</b> przyczyną zatrzymania jest niedotlenienie — dlatego RKO zaczyna się od{' '}
            <b>5 oddechów ratowniczych</b>, a dopiero potem 30:2. Wyciągając z wody, podejrzewaj wychłodzenie i
            uraz kręgosłupa (ostrożnie z głową/szyją, jeśli skok do wody).
          </p>
        </AccordionItem>
        <AccordionItem id="p4" title="Pozycja boczna (bezpieczna)" icon={<Hand className="h-5 w-5" />}>
          <p>
            Osobę <b>nieprzytomną, ale oddychającą</b> ułóż w pozycji bocznej ustalonej — zapobiega zakrztuszeniu
            i zapadnięciu języka. Regularnie kontroluj oddech.
          </p>
        </AccordionItem>
        <AccordionItem id="p5" title="Hipotermia (wychłodzenie)" icon={<Thermometer className="h-5 w-5" />}>
          <p>
            Woda w jeziorach bywa zimna nawet latem. Wychłodzonego <b>ogrzewaj stopniowo</b>: zdejmij mokre ubranie,
            owiń kocem/folią NRC, osłoń przed wiatrem, podawaj ciepłe (nie gorące) napoje tylko przytomnemu.{' '}
            <b>Nie rozcieraj, nie podawaj alkoholu, unikaj gwałtownych ruchów</b> — grożą zaburzeniami rytmu serca.
          </p>
        </AccordionItem>
        <AccordionItem id="p6" title="Krwotok i urazy" icon={<Droplets className="h-5 w-5" />}>
          <p>
            Silny krwotok — <b>uciśnij ranę</b> bezpośrednio (opatrunek, dłoń), unieś kończynę. Przy podejrzeniu
            urazu kręgosłupa ogranicz ruchy głowy i szyi. Zabezpiecz poszkodowanego przed dalszym wychłodzeniem.
          </p>
        </AccordionItem>
      </Accordion>

      <div className="card mt-6 p-5 text-xs text-brine-100/70">
        ⚠️ To skrót edukacyjny, nie zastępuje kursu pierwszej pomocy. Warto ukończyć szkolenie i mieć na
        pokładzie apteczkę oraz środki ratunkowe (koło/pas, bosak, rzutka).
      </div>
    </div>
  )
}

/* ================= CZŁOWIEK ZA BURTĄ (interaktywny) ================= */

interface MobStep {
  t: string // tytuł działania
  d: string // opis działania
  who?: string // kto wydaje komendę
  cmd?: string // komenda / meldunek
  x: number // pozycja jachtu na scenie
  y: number
  h: number // kurs jachtu (0 = w górę)
}

const MOB_STEPS: MobStep[] = [
  {
    t: 'ALARM',
    d: 'Kto zauważył — krzyczy natychmiast i głośno. Cała załoga przerywa to, co robi.',
    who: 'Kto zauważył → wszyscy',
    cmd: '„CZŁOWIEK ZA BURTĄ!”',
    x: 262, y: 132, h: 112,
  },
  {
    t: 'Środki ratunkowe',
    d: 'Rzuć koło / pas ratunkowy od strony NAWIETRZNEJ — będzie dryfować DO rozbitka, nie od niego.',
    who: 'Sternik → załoga',
    cmd: '„Podać środki ratunkowe!” → „Środki podane!”',
    x: 305, y: 152, h: 112,
  },
  {
    t: 'Obserwator',
    d: 'Sternik wyznacza obserwatora PO IMIENIU. Obserwator cały czas wskazuje rozbitka ręką i melduje pozycję.',
    who: 'Sternik',
    cmd: '„Kasia — obserwuj rozbitka!”',
    x: 348, y: 168, h: 116,
  },
  {
    t: 'Odejście od rozbitka',
    d: 'Odejdź kilka długości jachtu półwiatrem/bajdewindem, aby mieć miejsce na manewr powrotny.',
    x: 428, y: 205, h: 130,
  },
  {
    t: 'Odpadnięcie',
    d: 'Odpadnij do baksztagu i przygotuj załogę do zwrotu przez rufę.',
    who: 'Sternik',
    cmd: '„Do zwrotu przez rufę — przygotuj się!”',
    x: 472, y: 262, h: 180,
  },
  {
    t: 'Zwrot przez rufę',
    d: 'Wykonaj kontrolowany zwrot przez rufę — uwaga na bom! Po zwrocie kładziesz się na kurs „na człowieka”.',
    who: 'Sternik',
    cmd: '„Rufa!”',
    x: 400, y: 326, h: 240,
  },
  {
    t: 'Podejście „na człowieka”',
    d: 'Podchodź ostrym bajdewindem z żaglami w łopocie, na minimalnej prędkości. Rozbitka bierz od nawietrznej (łódki otwarte) lub od burty z drabinką (kabinowe).',
    who: 'Obserwator melduje',
    cmd: '„Rozbitek 30 metrów, kurs dobry!”',
    x: 296, y: 272, h: 297,
  },
  {
    t: 'Podjęcie i pomoc',
    d: 'Zatrzymaj jacht przy rozbitku, wciągnij go na pokład, udziel pierwszej pomocy (sprawdź wychłodzenie!) i płyń do portu lub wezwij pomoc: 601 100 100.',
    who: 'Załoga ↔ sternik',
    cmd: '„Człowiek przy burcie!” → „Człowiek na pokład!” → „Człowiek na pokładzie!” → „Udzielić pierwszej pomocy!”',
    x: 254, y: 162, h: 341,
  },
]

function Mob() {
  const [step, setStep] = useState(0)
  const s = MOB_STEPS[step]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* SCENA */}
        <div className="card p-4">
          <svg viewBox="0 0 640 380" className="w-full">
            <defs>
              <radialGradient id="mob-water" cx="50%" cy="45%" r="70%">
                <stop offset="0%" stopColor="#123f5b" />
                <stop offset="100%" stopColor="#0a2438" />
              </radialGradient>
              <filter id="mob-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="640" height="380">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ffffff" floodOpacity="0.6" />
              </filter>
            </defs>
            <rect x="0" y="0" width="640" height="380" rx="16" fill="url(#mob-water)" />

            {/* wiatr z góry */}
            {[-30, 0, 30].map((dx) => (
              <g key={dx}>
                <line x1={90 + dx} y1="20" x2={90 + dx} y2="44" stroke="#7bbcd9" strokeWidth="3" strokeLinecap="round" />
                <polygon points={`${90 + dx},50 ${85 + dx},41 ${95 + dx},41`} fill="#7bbcd9" />
              </g>
            ))}
            <text x="90" y="70" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7bbcd9">WIATR</text>

            {/* tor jachtu (pętla rufowa) */}
            <path
              d="M250 120 C 330 150, 430 180, 470 250 C 490 300, 430 330, 360 320 C 300 312, 270 250, 262 175"
              fill="none"
              stroke="#f4c74d"
              strokeWidth="3"
              strokeDasharray="8 7"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* człowiek w wodzie */}
            <g transform="translate(240 130)">
              <motion.circle
                cx="0" cy="0" r="16" fill="none" stroke="#e2454a" strokeWidth="5"
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <circle cx="0" cy="0" r="6" fill="#f4c430" />
              <text x="0" y="-26" textAnchor="middle" fontSize="12" fontWeight="700" fill="#e2454a">rozbitek</text>
            </g>

            {/* etykiety faz (subtelne) */}
            <text x="368" y="152" fontSize="11" fill="#8fb3c6">odejście</text>
            <text x="488" y="262" fontSize="11" fill="#8fb3c6">odpadnięcie</text>
            <text x="310" y="352" fontSize="11" fill="#8fb3c6">zwrot przez rufę</text>
            <text x="196" y="252" fontSize="11" fill="#8fb3c6">podejście</text>

            {/* JACHT — wyróżniona łódka jadąca po trasie zgodnie z krokami */}
            <g
              style={{
                transform: `translate(${s.x}px, ${s.y}px) rotate(${s.h}deg)`,
                transition: 'transform 0.9s ease-in-out',
              }}
            >
              <path
                d="M0 -18 C 9 -7 10 9 5 16 L -5 16 C -10 9 -9 -7 0 -18 Z"
                fill="#f3efe2"
                stroke="#0f2b3f"
                strokeWidth="2.5"
                filter="url(#mob-glow)"
              />
              <line x1="0" y1="-10" x2="0" y2="12" stroke="#2b7fab" strokeWidth="2.5" />
            </g>
          </svg>

          {/* nawigacja krokowa */}
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => setStep((n) => Math.max(0, n - 1))}
              disabled={step === 0}
              className="btn-ghost disabled:opacity-30"
            >
              ← Wstecz
            </button>
            <div className="flex gap-1.5">
              {MOB_STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${i === step ? 'bg-buoyRed' : i < step ? 'bg-brine-400' : 'bg-white/15 hover:bg-white/30'}`}
                />
              ))}
            </div>
            {step < MOB_STEPS.length - 1 ? (
              <button onClick={() => setStep((n) => n + 1)} className="btn-primary">
                Dalej →
              </button>
            ) : (
              <button onClick={() => setStep(0)} className="btn-ghost">↺ Od nowa</button>
            )}
          </div>
        </div>

        {/* OKIENKO KROKU */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-white/10 bg-buoyRed/15 px-5 py-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-buoyRed font-display text-base font-700 text-white">
                {step + 1}
              </span>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-brine-100/60">
                  Krok {step + 1} z {MOB_STEPS.length}
                </div>
                <h3 className="font-display text-lg font-700 leading-tight text-white">{s.t}</h3>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <p className="text-sm leading-relaxed text-brine-100/90">{s.d}</p>
              {s.cmd && (
                <div className="rounded-xl border border-rope/40 bg-rope/10 p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-rope">
                    📢 {s.who ?? 'Komenda'}
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-relaxed text-white">{s.cmd}</div>
                </div>
              )}
            </div>
          </motion.div>

          <div className="card mt-4 p-5 text-sm text-brine-100/85">
            <b className="text-white">Zasada ASO:</b> <b>A</b>larm · <b>Ś</b>rodki ratunkowe · <b>O</b>bserwator — trzy
            pierwsze odruchy, zanim zaczniesz manewr. Ćwicz regularnie: w realnej sytuacji liczą się sekundy.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= STRONA ================= */

const TABS = [
  { id: 'numery', label: 'Numery alarmowe', icon: Phone },
  { id: 'pomoc', label: 'Pierwsza pomoc', icon: HeartPulse },
  { id: 'mob', label: 'Człowiek za burtą', icon: LifeBuoy },
] as const

export default function Ratownictwo() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('numery')
  return (
    <div>
      <PageHeader eyebrow="Ratownictwo wodne" title="Bezpieczeństwo na wodzie">
        Numery alarmowe przydatne na Mazurach, podstawy pierwszej pomocy oraz pełen manewr
        „człowiek za burtą”. <b className="text-white">W nagłym wypadku dzwoń 112 lub 601 100 100.</b>{' '}
        Zawsze noś kamizelkę asekuracyjną i miej na pokładzie środki ratunkowe.
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

      {tab === 'numery' && <Numery />}
      {tab === 'pomoc' && <Pomoc />}
      {tab === 'mob' && <Mob />}
    </div>
  )
}
