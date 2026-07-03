import { useState } from 'react'
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

/* ================= CZŁOWIEK ZA BURTĄ ================= */

function MobGraphic() {
  return (
    <svg viewBox="0 0 640 380" className="w-full">
      <defs>
        <radialGradient id="mob-water" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#123f5b" />
          <stop offset="100%" stopColor="#0a2438" />
        </radialGradient>
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
      />
      {/* groty kierunku na torze */}
      {[
        [372, 168, 35],
        [468, 262, 110],
        [372, 322, 195],
        [268, 235, 268],
      ].map(([x, y, a], i) => (
        <polygon key={i} points="0,-7 5,6 -5,6" transform={`translate(${x} ${y}) rotate(${a})`} fill="#f4c74d" />
      ))}

      {/* człowiek w wodzie */}
      <g transform="translate(240 130)">
        <circle cx="0" cy="0" r="16" fill="none" stroke="#e2454a" strokeWidth="5" />
        <circle cx="0" cy="0" r="6" fill="#f4c430" />
        <text x="0" y="-24" textAnchor="middle" fontSize="12" fontWeight="700" fill="#e2454a">rozbitek</text>
      </g>

      {/* etykiety faz */}
      <text x="360" y="150" fontSize="12" fill="#cfe6f0" fontWeight="600">1. odejdź bajdewindem</text>
      <text x="486" y="262" fontSize="12" fill="#cfe6f0" fontWeight="600">2. odpadnij</text>
      <text x="300" y="352" fontSize="12" fill="#cfe6f0" fontWeight="600">3. zwrot przez rufę</text>
      <text x="24" y="250" fontSize="12" fill="#cfe6f0" fontWeight="600">4. podejdź „na człowieka”</text>
      <text x="24" y="267" fontSize="11" fill="#9fb4c0">ostry bajdewind, żagle w łopocie</text>
    </svg>
  )
}

const MOB_STEPS = [
  { t: 'ALARM', d: 'Kto zauważył — krzyczy głośno „CZŁOWIEK ZA BURTĄ!”. Cała załoga natychmiast reaguje.' },
  { t: 'Środki ratunkowe', d: 'Rzuć koło/pas ratunkowy od strony NAWIETRZNEJ — będą dryfować w stronę rozbitka, nie od niego.' },
  { t: 'Obserwator', d: 'Sternik wyznacza jedną osobę PO IMIENIU — jej jedynym zadaniem jest ciągłe wskazywanie rozbitka ręką i meldowanie pozycji.' },
  { t: 'Manewr (pętla rufowa)', d: 'Odejdź od rozbitka kilka długości jachtu bajdewindem, odpadnij do baksztagu, wykonaj zwrot przez rufę i wróć.' },
  { t: 'Podejście', d: 'Podchodź „na człowieka” ostrym bajdewindem, z żaglami w łopocie i minimalną prędkością. Rozbitka bierz od burty nawietrznej (łodzie otwarte) lub tej z drabinką (kabinowe).' },
  { t: 'Podjęcie i pomoc', d: 'Wciągnij rozbitka na pokład, udziel pierwszej pomocy, sprawdź wychłodzenie i płyń do najbliższego portu / wezwij pomoc.' },
]

const MOB_COMMANDS: [string, string][] = [
  ['Załoga → wszyscy', '„Człowiek za burtą!”'],
  ['Sternik', '„Podać środki ratunkowe!” → odp.: „Środki podane”'],
  ['Sternik', '„Jan — obserwuj rozbitka!” (wyznaczenie obserwatora)'],
  ['Po podejściu', '„Człowiek przy burcie” → Sternik: „Człowiek na pokład” → „Człowiek na pokładzie”'],
  ['Sternik', '„Udzielić pierwszej pomocy” → odp.: „Pierwsza pomoc udzielona”'],
]

function Mob() {
  return (
    <div className="space-y-6">
      <div className="card p-4">
        <MobGraphic />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-display text-xl font-700 text-white">Kolejność działań (sternik)</h3>
          <ol className="space-y-3">
            {MOB_STEPS.map((s, i) => (
              <li key={i} className="card flex gap-3 p-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-buoyRed text-sm font-bold text-white">{i + 1}</span>
                <div>
                  <div className="font-display font-700 text-white">{s.t}</div>
                  <p className="mt-0.5 text-sm text-brine-100/85">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="mb-3 font-display text-xl font-700 text-white">Komendy</h3>
          <div className="card divide-y divide-white/10 overflow-hidden">
            {MOB_COMMANDS.map(([who, cmd], i) => (
              <div key={i} className="p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">{who}</div>
                <div className="mt-1 text-sm text-white">{cmd}</div>
              </div>
            ))}
          </div>
          <div className="card mt-4 p-5 text-sm text-brine-100/85">
            <b className="text-white">Zasada ASO:</b> <b>A</b>larm · <b>Ś</b>rodki ratunkowe · <b>O</b>bserwator. To pierwsze trzy
            odruchy, zanim jeszcze zaczniesz manewr. Ćwicz manewr regularnie — w realnej sytuacji liczą się sekundy.
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
