import { useState } from 'react'
import { motion } from 'framer-motion'

/* ————————————————————————————————————————————————————————————
   Silnik zaburtowy — widok z boku, ustawiony tak jak na jachcie:
   pawęż i kokpit po PRAWEJ (dziób w prawo), silnik zwisa za rufą,
   rumpel sięga do przodu nad pawężą, śruba na końcu rufowym (w lewo).
   ———————————————————————————————————————————————————————————— */

const ACCENT = '#f4c74d'
const WL = 250 // linia wody

interface Part {
  id: string
  name: string
  ax: number
  ay: number
  desc: string
}

const PARTS: Part[] = [
  { id: 'cap', name: 'Pokrywa silnika (kaptur)', ax: 310, ay: 108, desc: 'Osłania blok silnika, gaźnik i układ zapłonowy przed wodą. Pod nią znajdziesz świecę i filtr powietrza. Zdejmuje się ją po zwolnieniu klamer po bokach.' },
  { id: 'starter', name: 'Rozrusznik linkowy (szarpak)', ax: 306, ay: 84, desc: 'Uchwyt z linką do ręcznego uruchamiania. Ciągnij zdecydowanie, na pełnym zakresie ramienia — nie szarp krótkimi ruchami i nie puszczaj linki gwałtownie.' },
  { id: 'block', name: 'Blok silnika (cylinder)', ax: 306, ay: 152, desc: 'Serce silnika — w cylindrze porusza się tłok napędzany zapłonem mieszanki paliwowo‑powietrznej. Chłodzony wodą pobieraną z jeziora.' },
  { id: 'spark', name: 'Świeca zapłonowa', ax: 350, ay: 142, desc: 'Wytwarza iskrę zapalającą mieszankę. Najczęstszy „podejrzany”, gdy silnik nie odpala — wykręć, obejrzyj, wyczyść i wysusz. Warto wozić zapasową.' },
  { id: 'carb', name: 'Gaźnik', ax: 266, ay: 158, desc: 'Miesza paliwo z powietrzem w odpowiednich proporcjach. Ma cięgno ssania (choke) do zimnego startu — po odpaleniu ssanie trzeba wyłączyć.' },
  { id: 'tiller', name: 'Rumpel z manetką gazu', ax: 452, ay: 78, desc: 'Sięga z silnika DO PRZODU, nad pawężą do kokpitu. Obrotem całego silnika steruje kierunkiem, a pokrętłem na końcu — obrotami. Na nim wyłącznik bezpieczeństwa na lince (kill switch).' },
  { id: 'kill', name: 'Wyłącznik bezpieczeństwa (kill switch)', ax: 424, ay: 108, desc: 'Zawleczka na lince przypinana do sternika. Gdy sternik wypadnie za burtę, zawleczka wypada i silnik gaśnie — jacht nie odpływa od człowieka w wodzie. Zawsze zapinaj!' },
  { id: 'clamp', name: 'Mocowanie do pawęży (struga)', ax: 398, ay: 194, desc: 'Śruby dociskowe trzymające silnik na pawęży plus przegub, na którym silnik się obraca i podnosi (tilt). Sprawdzaj dokręcenie — i zawsze zabezpiecz silnik dodatkową linką!' },
  { id: 'tank', name: 'Zbiornik paliwa z gruszką', ax: 528, ay: 214, desc: 'Zewnętrzny bak stoi w kokpicie, wąż biegnie do silnika. Przed startem napompuj gruszkę, aż stwardnieje — inaczej silnik zassie samo powietrze.' },
  { id: 'shaft', name: 'Kolumna (wał napędowy)', ax: 330, ay: 262, desc: 'Przenosi napęd z bloku do przekładni. W środku biegnie też rurka układu chłodzenia i kanał wydechu.' },
  { id: 'cooling', name: 'Kontrolka chłodzenia („sikawka”)', ax: 376, ay: 208, desc: 'Strumień wody wyrzucany z boku obudowy = pompa chłodzenia działa. BRAK strumienia po odpaleniu → natychmiast wyłącz silnik, inaczej zatrze się w kilka minut.' },
  { id: 'fin', name: 'Płetwa antywentylacyjna', ax: 292, ay: 320, desc: 'Płyta tuż nad śrubą. Zapobiega zasysaniu powietrza z powierzchni (wentylacji śruby) przy większym gazie. Powinna być kilka centymetrów pod wodą.' },
  { id: 'anode', name: 'Anoda cynkowa', ax: 352, ay: 330, desc: '„Poświęcany” kawałek cynku chroniący silnik przed korozją elektrochemiczną. Wymieniaj, gdy zużyta mniej więcej w połowie. Nigdy jej nie maluj!' },
  { id: 'gear', name: 'Przekładnia (skrzynia biegów)', ax: 330, ay: 344, desc: 'Zmienia kierunek napędu na śrubę; biegi naprzód – luz – wstecz (F‑N‑R) przełącza się dźwignią. Silnik odpalamy ZAWSZE na luzie.' },
  { id: 'intake', name: 'Wlot wody chłodzącej', ax: 320, ay: 358, desc: 'Kratki po bokach przekładni zasysające wodę do chłodzenia. Nie uruchamiaj silnika „na sucho” — zniszczysz wirnik pompy w kilkanaście sekund.' },
  { id: 'prop', name: 'Śruba napędowa', ax: 248, ay: 344, desc: 'Pcha jacht. Chroniona zawleczką ścinaną — po uderzeniu w dno wymienia się zawleczkę, nie śrubę. Uwaga na pływające linki: potrafią owinąć wał i zerwać uszczelnienie.' },
]

export default function EngineView() {
  const [sel, setSel] = useState<Part>(PARTS[0])
  const on = (id: string) => sel.id === id
  const hit = (id: string) => ({ onClick: () => setSel(PARTS.find((p) => p.id === id)!), style: { cursor: 'pointer' as const } })
  const glow = (id: string) => (on(id) ? 'url(#eng-glow)' : undefined)

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
      {/* SCHEMAT */}
      <div className="card self-start p-4">
        <svg viewBox="0 0 600 430" className="w-full">
          <defs>
            <linearGradient id="eng-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c2537" />
              <stop offset="100%" stopColor="#0a1c2b" />
            </linearGradient>
            <linearGradient id="eng-cowl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e9eef2" />
              <stop offset="55%" stopColor="#c3cdd4" />
              <stop offset="100%" stopColor="#98a6b0" />
            </linearGradient>
            <linearGradient id="eng-leg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b98a2" />
              <stop offset="45%" stopColor="#cfd8de" />
              <stop offset="100%" stopColor="#7d8b95" />
            </linearGradient>
            <filter id="eng-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="430">
              <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor={ACCENT} floodOpacity="0.95" />
            </filter>
            <clipPath id="eng-frame">
              <rect x="0" y="0" width="600" height="430" rx="14" />
            </clipPath>
          </defs>

          <rect x="0" y="0" width="600" height="430" rx="14" fill="url(#eng-bg)" />
          <g clipPath="url(#eng-frame)">

          {/* woda */}
          <rect x="0" y={WL} width="600" height={430 - WL} fill="rgba(43,127,171,0.14)" />
          <line x1="16" y1={WL} x2="584" y2={WL} stroke="rgba(123,188,217,0.5)" strokeWidth="1.5" strokeDasharray="7 7" />
          <text x="20" y={WL - 8} fontSize="11" fill="rgba(123,188,217,0.75)">
            linia wody
          </text>

          {/* ——— JACHT: pawęż + kokpit (dziób w prawo) ——— */}
          <path d="M430 118 L600 112 L600 268 Q 510 276 436 250 Z" fill="#22453a" stroke="#3d6b57" strokeWidth="2.5" />
          {/* pokład / nadburcie */}
          <rect x="430" y="112" width="170" height="12" rx="4" fill="#3d6b57" />
          {/* wnętrze kokpitu */}
          <path d="M452 136 L600 131 L600 236 Q 520 244 458 224 Z" fill="#173327" opacity="0.9" />
          <text x="446" y="106" fontSize="12" fill="rgba(207,230,240,0.8)" fontWeight="700">
            pawęż
          </text>
          <text x="540" y="176" fontSize="12" fill="rgba(207,230,240,0.55)" fontWeight="700">
            kokpit
          </text>
          {/* strzałka kierunku jazdy */}
          <g stroke="rgba(207,230,240,0.55)" fill="rgba(207,230,240,0.55)">
            <line x1="512" y1="62" x2="566" y2="62" strokeWidth="2.5" />
            <polygon points="576,62 562,55 562,69" />
          </g>
          <text x="576" y="46" fontSize="11" fill="rgba(207,230,240,0.55)" textAnchor="end">
            dziób / kierunek jazdy
          </text>

          {/* ——— ZBIORNIK PALIWA w kokpicie + wąż ——— */}
          <g {...hit('tank')} filter={glow('tank')}>
            <rect x="496" y="196" width="64" height="38" rx="7" fill="#c94f3d" stroke="#7a2c1f" strokeWidth="2" />
            <rect x="512" y="188" width="16" height="10" rx="3" fill="#7a2c1f" />
            {/* gruszka + wąż do silnika */}
            <path d="M496 214 C 452 214, 430 206, 404 186" fill="none" stroke="#33454f" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="462" cy="215" rx="11" ry="7" fill="#33454f" />
          </g>

          {/* ——— MOCOWANIE DO PAWĘŻY ——— */}
          <g {...hit('clamp')} filter={glow('clamp')}>
            <path d="M356 168 L432 164 L436 216 L360 212 Z" fill="#4a5a64" stroke="#22303a" strokeWidth="2.5" />
            {/* śruby dociskowe */}
            <circle cx="410" cy="228" r="7" fill="#22303a" />
            <circle cx="410" cy="228" r="3" fill="#5d6f7a" />
            <line x1="410" y1="216" x2="410" y2="228" stroke="#22303a" strokeWidth="4" />
            <circle cx="378" cy="230" r="7" fill="#22303a" />
            <circle cx="378" cy="230" r="3" fill="#5d6f7a" />
            <line x1="378" y1="214" x2="378" y2="230" stroke="#22303a" strokeWidth="4" />
            {/* przegub obrotu (tilt) */}
            <circle cx="398" cy="180" r="6" fill="#7f8f99" stroke="#22303a" strokeWidth="2" />
          </g>

          {/* ——— KOLUMNA (wał napędowy) ——— */}
          <path d="M300 170 L360 168 L352 316 L308 316 Z" fill="url(#eng-leg)" stroke="#5b6a74" strokeWidth="2.5" {...hit('shaft')} filter={glow('shaft')} />

          {/* ——— KAPTUR ——— */}
          <path
            d="M248 118 Q 248 74 310 74 Q 372 74 372 118 L372 152 Q 372 172 348 174 L268 174 Q 248 172 248 152 Z"
            fill="url(#eng-cowl)"
            stroke="#5b6a74"
            strokeWidth="3"
            {...hit('cap')}
            filter={glow('cap')}
          />
          {/* klamra kaptura */}
          <rect x="244" y="150" width="10" height="16" rx="3" fill="#7f8f99" stroke="#22303a" strokeWidth="1.5" />

          {/* szarpak */}
          <g {...hit('starter')} filter={glow('starter')}>
            <rect x="288" y="70" width="36" height="13" rx="6.5" fill="#f4f0e6" stroke="#22303a" strokeWidth="2" />
            <line x1="306" y1="83" x2="306" y2="96" stroke="#22303a" strokeWidth="2.5" />
          </g>

          {/* blok silnika (widoczny „przez” kaptur) */}
          <g {...hit('block')} filter={glow('block')}>
            <rect x="278" y="132" width="58" height="38" rx="5" fill="#586f7c" stroke="#22303a" strokeWidth="2" />
            {[140, 150, 160].map((y) => (
              <line key={y} x1="284" y1={y} x2="330" y2={y} stroke="#3d4f5a" strokeWidth="2.5" />
            ))}
          </g>

          {/* świeca */}
          <g {...hit('spark')} filter={glow('spark')}>
            <rect x="338" y="134" width="18" height="10" rx="3" fill="#e8dcc0" stroke="#22303a" strokeWidth="1.5" />
            <path d="M356 139 q 12 0 14 10" fill="none" stroke="#c9a15a" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* gaźnik + cięgno ssania */}
          <g {...hit('carb')} filter={glow('carb')}>
            <rect x="254" y="146" width="26" height="24" rx="4" fill="#6b8290" stroke="#22303a" strokeWidth="2" />
            <line x1="254" y1="152" x2="240" y2="146" stroke="#22303a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="238" cy="145" r="4" fill="#f4c74d" />
          </g>

          {/* ——— RUMPEL — do przodu, nad pawężą, do kokpitu ——— */}
          <g {...hit('tiller')} filter={glow('tiller')}>
            <path d="M366 122 L468 76" fill="none" stroke="#33454f" strokeWidth="11" strokeLinecap="round" />
            {/* manetka gazu */}
            <g transform="rotate(-24 480 70)">
              <rect x="462" y="61" width="38" height="18" rx="9" fill={ACCENT} stroke="#22303a" strokeWidth="2" />
              {[470, 478, 486].map((x) => (
                <line key={x} x1={x} y1="63" x2={x} y2="77" stroke="#22303a" strokeWidth="1.5" opacity="0.6" />
              ))}
            </g>
          </g>

          {/* kill switch — czerwona zawleczka na lince przy rumplu */}
          <g {...hit('kill')} filter={glow('kill')}>
            <circle cx="418" cy="99" r="7" fill="#e2454a" stroke="#7a2c1f" strokeWidth="2" />
            <path d="M418 106 q 6 14 -4 22 t 2 20" fill="none" stroke="#e2454a" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* ——— SIKAWKA (kontrolka chłodzenia) ——— */}
          <g {...hit('cooling')} filter={glow('cooling')}>
            <circle cx="364" cy="196" r="5" fill="#7bbcd9" />
            <motion.path
              d="M370 197 q 18 3 26 18"
              fill="none"
              stroke="#7bbcd9"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="2 7"
              animate={{ strokeDashoffset: [0, -18] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
            />
          </g>

          {/* ——— PŁETWA ANTYWENTYLACYJNA ——— */}
          <rect x="238" y="313" width="132" height="9" rx="4" fill="#7d8b95" stroke="#5b6a74" strokeWidth="1.5" {...hit('fin')} filter={glow('fin')} />

          {/* ——— PRZEKŁADNIA (torpeda) — nos do przodu (w prawo), śruba z tyłu (w lewo) ——— */}
          <path
            d="M262 324 L352 322 Q 382 326 386 346 Q 382 366 352 370 L262 366 Q 250 346 262 324 Z"
            fill="#8b98a2"
            stroke="#5b6a74"
            strokeWidth="2.5"
            {...hit('gear')}
            filter={glow('gear')}
          />
          {/* skeg */}
          <path d="M300 368 L318 368 L314 400 L302 400 Z" fill="#7d8b95" stroke="#5b6a74" strokeWidth="1.5" />

          {/* anoda */}
          <rect x="340" y="324" width="22" height="12" rx="3" fill="#c8d2d8" stroke="#5b6a74" strokeWidth="1.5" {...hit('anode')} filter={glow('anode')} />

          {/* wlot wody */}
          <g {...hit('intake')} filter={glow('intake')}>
            <rect x="300" y="348" width="42" height="18" rx="4" fill="#6b7d88" opacity="0.5" />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={306 + i * 8} y1="350" x2={306 + i * 8} y2="364" stroke="#22303a" strokeWidth="2.5" />
            ))}
          </g>

          {/* ——— ŚRUBA (na końcu rufowym, w lewo) ——— */}
          <g {...hit('prop')} filter={glow('prop')}>
            <line x1="262" y1="346" x2="248" y2="346" stroke="#5b6a74" strokeWidth="7" />
            <motion.g
              animate={on('prop') ? { rotate: 360 } : { rotate: 0 }}
              transition={on('prop') ? { duration: 1.1, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
              style={{ transformOrigin: '246px 346px' }}
            >
              <path d="M246 346 Q 228 320 240 310 Q 254 320 246 346" fill="#aab6bd" stroke="#5b6a74" strokeWidth="1.5" />
              <path d="M246 346 Q 226 366 234 380 Q 250 370 246 346" fill="#aab6bd" stroke="#5b6a74" strokeWidth="1.5" />
              <path d="M246 346 Q 268 356 268 342 Q 262 330 246 346" fill="#aab6bd" stroke="#5b6a74" strokeWidth="1.5" />
            </motion.g>
            <circle cx="246" cy="346" r="6" fill="#3d4f5a" />
          </g>
          </g>

          {/* marker wybranej części */}
          <motion.circle
            key={sel.id}
            cx={sel.ax}
            cy={sel.ay}
            r="11"
            fill="none"
            stroke={ACCENT}
            strokeWidth="2.5"
            pointerEvents="none"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ transformOrigin: `${sel.ax}px ${sel.ay}px` }}
          />
        </svg>
      </div>

      {/* PANEL */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="card max-h-[420px] overflow-y-auto p-2">
          {PARTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSel(p)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                sel.id === p.id ? 'bg-brine-500/25 text-navy' : 'text-brine-100 hover:bg-white/5'
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
        <div className="card p-4 text-xs leading-relaxed text-brine-100/75">
          💡 <b className="text-navy">Przed odpaleniem:</b> odpowietrznik baku otwarty, gruszka napompowana,
          ssanie (na zimno), <b className="text-navy">luz</b> na biegu, kill‑switch zapięty, śruba w wodzie.
          Po odpaleniu od razu sprawdź strumień „sikawki”.
        </div>
      </div>
    </div>
  )
}
