import { useState } from 'react'
import { motion } from 'framer-motion'

const ACCENT = '#f4c74d'

interface Part {
  id: string
  name: string
  ax: number
  ay: number
  desc: string
}

const PARTS: Part[] = [
  { id: 'cap', name: 'Pokrywa silnika (kaptur)', ax: 300, ay: 84, desc: 'Osłania blok silnika, gaźnik i układ zapłonowy przed wodą. Pod nią znajdziesz świecę i filtr powietrza.' },
  { id: 'block', name: 'Blok silnika (cylinder)', ax: 300, ay: 128, desc: 'Serce silnika — w cylindrze porusza się tłok napędzany zapłonem mieszanki paliwowo‑powietrznej.' },
  { id: 'spark', name: 'Świeca zapłonowa', ax: 342, ay: 118, desc: 'Wytwarza iskrę zapalającą mieszankę. Najczęstszy „podejrzany”, gdy silnik nie odpala — sprawdź i wyczyść.' },
  { id: 'carb', name: 'Gaźnik', ax: 258, ay: 132, desc: 'Miesza paliwo z powietrzem w odpowiednich proporcjach. Ma cięgno ssania (choke) do zimnego startu.' },
  { id: 'starter', name: 'Rozrusznik linkowy (szarpak)', ax: 300, ay: 62, desc: 'Uchwyt z linką do ręcznego uruchamiania. Ciągnij zdecydowanie, ale do końca zakresu — nie szarp krótkimi ruchami.' },
  { id: 'tank', name: 'Zbiornik / dolot paliwa', ax: 226, ay: 96, desc: 'Mały zbiornik wbudowany lub przyłącze zewnętrznego baku z pompką (gruszką) do napełnienia układu paliwem.' },
  { id: 'tiller', name: 'Rumpel z manetką gazu', ax: 196, ay: 152, desc: 'Steruje kierunkiem (obrót całego silnika) i obrotami (pokrętło gazu na końcu). Często z wyłącznikiem bezpieczeństwa na lince (kill switch).' },
  { id: 'clamp', name: 'Mocowanie do pawęży', ax: 356, ay: 168, desc: 'Śruby dociskowe trzymające silnik na pawęży. Sprawdzaj dokręcenie — i zawsze zabezpiecz silnik linką!' },
  { id: 'shaft', name: 'Kolumna (wał napędowy)', ax: 318, ay: 240, desc: 'Przenosi napęd z bloku do przekładni. W środku biegnie też rurka układu chłodzenia.' },
  { id: 'cooling', name: 'Kontrolka chłodzenia („sikawka”)', ax: 352, ay: 208, desc: 'Strumień wody wyrzucany z boku = pompa chłodzenia działa. BRAK strumienia po odpaleniu → natychmiast wyłącz silnik!' },
  { id: 'gear', name: 'Przekładnia (skrzynia biegów)', ax: 318, ay: 322, desc: 'Zmienia kierunek napędu na śrubę; biegi: naprzód – luz – wstecz (F‑N‑R), przełączane dźwignią.' },
  { id: 'prop', name: 'Śruba napędowa', ax: 374, ay: 330, desc: 'Pcha jacht. Chroniona zawleczką ścinaną — po uderzeniu w dno wymień zawleczkę, nie śrubę. Uwaga na linki w wodzie!' },
  { id: 'intake', name: 'Wlot wody chłodzącej', ax: 318, ay: 348, desc: 'Kratka nad śrubą zasysająca wodę do chłodzenia. Nie uruchamiaj silnika „na sucho” — zniszczysz wirnik pompy.' },
  { id: 'anode', name: 'Anoda cynkowa', ax: 276, ay: 332, desc: '„Poświęcany” kawałek cynku chroniący silnik przed korozją elektrochemiczną. Wymieniaj, gdy zużyta w połowie.' },
  { id: 'fin', name: 'Płetwa antywentylacyjna', ax: 350, ay: 306, desc: 'Płyta nad śrubą zapobiegająca zasysaniu powietrza z powierzchni (wentylacji śruby) przy większym gazie.' },
]

export default function EngineView() {
  const [sel, setSel] = useState<Part>(PARTS[0])

  const on = (id: string) => sel.id === id

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
      {/* SCHEMAT */}
      <div className="card p-4">
        <svg viewBox="0 0 560 400" className="w-full">
          <defs>
            <linearGradient id="eng-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c2537" />
              <stop offset="100%" stopColor="#0a1c2b" />
            </linearGradient>
            <filter id="eng-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="560" height="400">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={ACCENT} floodOpacity="0.9" />
            </filter>
          </defs>
          <rect x="0" y="0" width="560" height="400" rx="16" fill="url(#eng-bg)" />
          {/* linia wody */}
          <line x1="20" y1="272" x2="540" y2="272" stroke="rgba(123,188,217,0.45)" strokeWidth="1.5" strokeDasharray="7 7" />
          <rect x="0" y="272" width="560" height="128" fill="rgba(43,127,171,0.12)" />

          {/* pawęż łodzi */}
          <path d="M420 120 L470 118 L474 214 L424 218 Z" fill="#26402f" stroke="#3a5a44" strokeWidth="2" />
          <text x="447" y="105" textAnchor="middle" fontSize="11" fill="rgba(207,230,240,0.7)">pawęż</text>

          {/* mocowanie */}
          <rect x="344" y="150" width="84" height="34" rx="6" fill="#37474f" stroke="#22303a" strokeWidth="2" onClick={() => setSel(PARTS.find((p) => p.id === 'clamp')!)} style={{ cursor: 'pointer' }} filter={on('clamp') ? 'url(#eng-glow)' : undefined} />
          <circle cx="362" cy="188" r="6" fill="#22303a" />
          <circle cx="404" cy="188" r="6" fill="#22303a" />

          {/* kaptur silnika */}
          <path
            d="M236 96 Q236 54 300 54 Q364 54 364 96 L364 128 Q364 148 340 150 L260 150 Q236 148 236 128 Z"
            fill="#2b7fab"
            stroke="#1f5173"
            strokeWidth="3"
            onClick={() => setSel(PARTS.find((p) => p.id === 'cap')!)}
            style={{ cursor: 'pointer' }}
            filter={on('cap') ? 'url(#eng-glow)' : undefined}
          />
          {/* szarpak */}
          <g onClick={() => setSel(PARTS.find((p) => p.id === 'starter')!)} style={{ cursor: 'pointer' }} filter={on('starter') ? 'url(#eng-glow)' : undefined}>
            <rect x="284" y="52" width="32" height="12" rx="6" fill="#f4f0e6" stroke="#22303a" strokeWidth="2" />
            <line x1="300" y1="64" x2="300" y2="76" stroke="#22303a" strokeWidth="2.5" />
          </g>
          {/* blok (widoczny przez "okno" kaptura) */}
          <rect x="272" y="112" width="56" height="34" rx="5" fill="#455a64" stroke="#22303a" strokeWidth="2" onClick={() => setSel(PARTS.find((p) => p.id === 'block')!)} style={{ cursor: 'pointer' }} filter={on('block') ? 'url(#eng-glow)' : undefined} />
          {/* świeca */}
          <g onClick={() => setSel(PARTS.find((p) => p.id === 'spark')!)} style={{ cursor: 'pointer' }} filter={on('spark') ? 'url(#eng-glow)' : undefined}>
            <rect x="330" y="112" width="16" height="9" rx="3" fill="#e8dcc0" stroke="#22303a" strokeWidth="1.5" />
            <line x1="346" y1="116" x2="356" y2="116" stroke="#c9a15a" strokeWidth="3" />
          </g>
          {/* gaźnik */}
          <rect x="244" y="122" width="24" height="20" rx="4" fill="#607d8b" stroke="#22303a" strokeWidth="2" onClick={() => setSel(PARTS.find((p) => p.id === 'carb')!)} style={{ cursor: 'pointer' }} filter={on('carb') ? 'url(#eng-glow)' : undefined} />
          {/* zbiornik paliwa */}
          <g onClick={() => setSel(PARTS.find((p) => p.id === 'tank')!)} style={{ cursor: 'pointer' }} filter={on('tank') ? 'url(#eng-glow)' : undefined}>
            <rect x="204" y="84" width="40" height="26" rx="6" fill="#c94f3d" stroke="#7a2c1f" strokeWidth="2" />
            <rect x="218" y="78" width="12" height="8" rx="2" fill="#7a2c1f" />
          </g>
          {/* rumpel */}
          <g onClick={() => setSel(PARTS.find((p) => p.id === 'tiller')!)} style={{ cursor: 'pointer' }} filter={on('tiller') ? 'url(#eng-glow)' : undefined}>
            <line x1="238" y1="142" x2="170" y2="158" stroke="#37474f" strokeWidth="9" strokeLinecap="round" />
            <rect x="152" y="150" width="22" height="14" rx="7" fill="#f4c74d" stroke="#22303a" strokeWidth="2" />
          </g>

          {/* kolumna */}
          <path d="M292 150 L344 150 L336 300 L300 300 Z" fill="#546e7a" stroke="#22303a" strokeWidth="2.5" onClick={() => setSel(PARTS.find((p) => p.id === 'shaft')!)} style={{ cursor: 'pointer' }} filter={on('shaft') ? 'url(#eng-glow)' : undefined} />
          {/* sikawka chłodzenia */}
          <g onClick={() => setSel(PARTS.find((p) => p.id === 'cooling')!)} style={{ cursor: 'pointer' }} filter={on('cooling') ? 'url(#eng-glow)' : undefined}>
            <circle cx="342" cy="196" r="4" fill="#7bbcd9" />
            <path d="M346 196 q 14 4 20 16" fill="none" stroke="#7bbcd9" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 6" />
          </g>

          {/* przekładnia (torpeda) */}
          <path d="M280 306 Q276 300 300 300 L336 300 Q368 302 372 322 Q368 342 336 344 L302 344 Q278 344 280 336 Z" fill="#455a64" stroke="#22303a" strokeWidth="2.5" onClick={() => setSel(PARTS.find((p) => p.id === 'gear')!)} style={{ cursor: 'pointer' }} filter={on('gear') ? 'url(#eng-glow)' : undefined} />
          {/* płetwa antywentylacyjna */}
          <rect x="290" y="296" width="88" height="7" rx="3" fill="#37474f" onClick={() => setSel(PARTS.find((p) => p.id === 'fin')!)} style={{ cursor: 'pointer' }} filter={on('fin') ? 'url(#eng-glow)' : undefined} />
          {/* anoda */}
          <rect x="266" y="326" width="16" height="12" rx="3" fill="#b0bec5" stroke="#22303a" strokeWidth="1.5" onClick={() => setSel(PARTS.find((p) => p.id === 'anode')!)} style={{ cursor: 'pointer' }} filter={on('anode') ? 'url(#eng-glow)' : undefined} />
          {/* wlot wody */}
          <g onClick={() => setSel(PARTS.find((p) => p.id === 'intake')!)} style={{ cursor: 'pointer' }} filter={on('intake') ? 'url(#eng-glow)' : undefined}>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={304 + i * 8} y1="346" x2={304 + i * 8} y2="352" stroke="#90a4ae" strokeWidth="2.5" />
            ))}
          </g>
          {/* śruba */}
          <g onClick={() => setSel(PARTS.find((p) => p.id === 'prop')!)} style={{ cursor: 'pointer' }} filter={on('prop') ? 'url(#eng-glow)' : undefined}>
            <circle cx="376" cy="322" r="5" fill="#22303a" />
            <path d="M376 322 Q392 300 380 292 Q368 300 376 322" fill="#90a4ae" stroke="#22303a" strokeWidth="1.5" />
            <path d="M376 322 Q394 340 384 350 Q370 342 376 322" fill="#90a4ae" stroke="#22303a" strokeWidth="1.5" />
            <path d="M376 322 Q356 334 352 322 Q358 308 376 322" fill="#90a4ae" stroke="#22303a" strokeWidth="1.5" />
          </g>

          {/* marker */}
          <motion.circle
            key={sel.id}
            cx={sel.ax}
            cy={sel.ay}
            r="10"
            fill="none"
            stroke={ACCENT}
            strokeWidth="2.5"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ transformOrigin: `${sel.ax}px ${sel.ay}px` }}
          />
        </svg>
      </div>

      {/* PANEL */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="card max-h-[380px] overflow-y-auto p-2">
          {PARTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSel(p)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                sel.id === p.id ? 'bg-brine-500/25 text-white' : 'text-brine-100 hover:bg-white/5'
              }`}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: sel.id === p.id ? ACCENT : 'rgba(123,188,217,0.5)' }} />
              {p.name}
            </button>
          ))}
        </div>
        <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <h3 className="font-display text-lg font-700 text-navy">{sel.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-brine-100/90">{sel.desc}</p>
        </motion.div>
        <div className="card p-4 text-xs text-brine-100/70">
          💡 Przed odpaleniem: paliwo otwarte, gruszka napompowana, ssanie (na zimno), luz na biegu,
          kill‑switch zapięty. Po odpaleniu sprawdź strumień „sikawki”!
        </div>
      </div>
    </div>
  )
}
