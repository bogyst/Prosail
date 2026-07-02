import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui'

interface Part {
  id: string
  name: string
  x: number
  y: number
  desc: string
  group: 'Kadłub' | 'Takielunek' | 'Żagle' | 'Osprzęt'
}

const PARTS: Part[] = [
  { id: 'bow', name: 'Dziób', x: 512, y: 286, group: 'Kadłub', desc: 'Przednia część kadłuba. Tnie falę i nadaje kierunek. Przeciwieństwo rufy.' },
  { id: 'stern', name: 'Rufa', x: 78, y: 286, group: 'Kadłub', desc: 'Tylna część kadłuba. Tu zwykle mocowany jest ster i pawęż.' },
  { id: 'hull', name: 'Kadłub', x: 300, y: 300, group: 'Kadłub', desc: 'Główny korpus jachtu utrzymujący go na wodzie. Linia styku z wodą to linia wodna.' },
  { id: 'keel', name: 'Kil (balast)', x: 300, y: 360, group: 'Kadłub', desc: 'Ciężka płetwa pod kadłubem. Obniża środek ciężkości (przeciwdziała przewróceniu) i daje opór boczny przeciw dryfowi. W małych jachtach zastępuje go podnoszony miecz.' },
  { id: 'rudder', name: 'Ster (płetwa)', x: 92, y: 340, group: 'Osprzęt', desc: 'Płetwa sterowa pod rufą. Wychylana, zmienia kierunek płynięcia jachtu.' },
  { id: 'tiller', name: 'Rumpel', x: 150, y: 262, group: 'Osprzęt', desc: 'Drążek połączony ze sterem, którym steruje sternik. W większych jachtach zastąpiony kołem sterowym.' },
  { id: 'cockpit', name: 'Kokpit', x: 200, y: 268, group: 'Kadłub', desc: 'Zagłębienie w pokładzie, w którym siedzi załoga i obsługuje szoty oraz ster.' },
  { id: 'mast', name: 'Maszt', x: 300, y: 150, group: 'Takielunek', desc: 'Pionowy słup dźwigający żagle. Podtrzymywany przez want i sztagi.' },
  { id: 'boom', name: 'Bom', x: 210, y: 250, group: 'Takielunek', desc: 'Pozioma belka u dołu grota, zamocowana do masztu. Steruje kątem grota za pomocą grotszota.' },
  { id: 'forestay', name: 'Sztag', x: 405, y: 160, group: 'Takielunek', desc: 'Lina (sztag) biegnąca od topu masztu do dziobu. Trzyma maszt od przodu, mocuje się do niej fok.' },
  { id: 'backstay', name: 'Achtersztag', x: 190, y: 150, group: 'Takielunek', desc: 'Lina od topu masztu do rufy. Podtrzymuje maszt od tyłu i pozwala regulować jego wygięcie.' },
  { id: 'shroud', name: 'Wanty', x: 300, y: 210, group: 'Takielunek', desc: 'Liny podtrzymujące maszt z lewej i prawej burty (bocznie). Rozpięte na salingach.' },
  { id: 'main', name: 'Grot', x: 240, y: 160, group: 'Żagle', desc: 'Główny żagiel, rozpięty za masztem między masztem a bomem. Daje większość siły napędowej.' },
  { id: 'jib', name: 'Fok / Genua', x: 400, y: 210, group: 'Żagle', desc: 'Przedni żagiel rozpięty na sztagu. Współpracuje z grotem — kanał między nimi (szczelina) przyspiesza opływ.' },
  { id: 'spreader', name: 'Saling', x: 300, y: 130, group: 'Takielunek', desc: 'Poprzeczka na maszcie odchylająca wanty, aby lepiej podpierały maszt na boki.' },
]

const GROUPS = ['Kadłub', 'Takielunek', 'Żagle', 'Osprzęt'] as const

export default function Budowa() {
  const [sel, setSel] = useState<Part>(PARTS.find((p) => p.id === 'mast')!)

  return (
    <div>
      <PageHeader eyebrow="Budowa jachtu" title="Anatomia slupa">
        Slup to najpopularniejszy typ ożaglowania — jeden maszt, grot i fok.
        Klikaj w numerowane punkty na rysunku lub w nazwy z listy, aby poznać
        każdą część.
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* RYSUNEK */}
        <div className="card p-4">
          <svg viewBox="0 0 600 420" className="w-full">
            {/* niebo/woda */}
            <rect x="0" y="300" width="600" height="120" fill="rgba(43,127,171,0.18)" />
            <line x1="0" y1="300" x2="600" y2="300" stroke="rgba(123,188,217,0.4)" strokeDasharray="4 6" />

            {/* kil */}
            <path d="M285 300 L295 380 L320 380 L315 300 Z" fill="#1f5173" stroke="#0f2b3f" strokeWidth="2" />
            {/* ster */}
            <path d="M95 302 L88 350 L104 350 L108 302 Z" fill="#22658d" stroke="#0f2b3f" strokeWidth="2" />
            {/* kadłub */}
            <path
              d="M70 300 C 90 280 140 272 300 272 C 420 272 490 278 525 292 C 535 296 535 300 520 302 Z"
              fill="#e9dcc0"
              stroke="#0f2b3f"
              strokeWidth="3"
            />
            {/* pokład / kokpit */}
            <path d="M180 272 L235 272 L225 284 L190 284 Z" fill="#0f2b3f" opacity="0.5" />

            {/* maszt */}
            <line x1="300" y1="272" x2="300" y2="52" stroke="#c9a15a" strokeWidth="6" strokeLinecap="round" />
            {/* saling */}
            <line x1="270" y1="130" x2="330" y2="130" stroke="#c9a15a" strokeWidth="3" />
            {/* sztag i achtersztag */}
            <line x1="300" y1="55" x2="512" y2="286" stroke="#8aa0ad" strokeWidth="1.6" />
            <line x1="300" y1="55" x2="88" y2="290" stroke="#8aa0ad" strokeWidth="1.6" />
            {/* wanty */}
            <line x1="300" y1="130" x2="330" y2="272" stroke="#8aa0ad" strokeWidth="1.4" />
            <line x1="300" y1="130" x2="270" y2="272" stroke="#8aa0ad" strokeWidth="1.4" />
            {/* bom */}
            <line x1="300" y1="250" x2="150" y2="256" stroke="#3a2c14" strokeWidth="5" strokeLinecap="round" />
            {/* rumpel */}
            <line x1="104" y1="300" x2="185" y2="262" stroke="#3a2c14" strokeWidth="3" strokeLinecap="round" />

            {/* grot */}
            <path d="M300 60 L300 250 L152 254 Z" fill="rgba(238,247,251,0.94)" stroke="#0f2b3f" strokeWidth="1.5" />
            {/* fok */}
            <path d="M300 62 L508 286 L360 268 L318 240 Z" fill="rgba(247,241,227,0.9)" stroke="#0f2b3f" strokeWidth="1.5" />

            {/* HOTSPOTY */}
            {PARTS.map((p, i) => {
              const active = sel.id === p.id
              return (
                <g
                  key={p.id}
                  onClick={() => setSel(p)}
                  style={{ cursor: 'pointer' }}
                  className="transition-transform"
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={active ? 14 : 11}
                    fill={active ? '#2b7fab' : 'rgba(8,26,40,0.85)'}
                    stroke={active ? '#7bbcd9' : '#c9a15a'}
                    strokeWidth={2}
                  />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
                    {i + 1}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* LISTA + OPIS */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <motion.div key={sel.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
            <div className="chip mb-2">{sel.group}</div>
            <h3 className="font-display text-xl font-700 text-white">
              {PARTS.indexOf(sel) + 1}. {sel.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brine-100/90">{sel.desc}</p>
          </motion.div>

          <div className="card p-4">
            {GROUPS.map((g) => (
              <div key={g} className="mb-2 last:mb-0">
                <div className="px-1 py-1 text-xs font-semibold uppercase tracking-wide text-brine-100/50">{g}</div>
                <div className="flex flex-wrap gap-1.5">
                  {PARTS.filter((p) => p.group === g).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSel(p)}
                      className={`rounded-lg px-2.5 py-1 text-xs ${
                        sel.id === p.id ? 'bg-brine-500 text-white' : 'bg-white/5 text-brine-100 hover:bg-white/10'
                      }`}
                    >
                      {PARTS.indexOf(p) + 1}. {p.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
