import { useState } from 'react'
import { motion } from 'framer-motion'

const ACCENT = '#f4c74d'
const ROPE = '#c9a15a'

interface Item {
  id: string
  name: string
  group: 'jacht' | 'liny'
  desc: string
  d?: string // ścieżka liny cumowniczej
  ax?: number // punkt markera dla elementu jachtu
  ay?: number
}

const ITEMS: Item[] = [
  // elementy jachtu (widoczne z góry)
  { id: 'dziob', name: 'Dziób', group: 'jacht', ax: 520, ay: 175, desc: 'Przód jachtu, skierowany w kierunku płynięcia.' },
  { id: 'rufa', name: 'Rufa', group: 'jacht', ax: 126, ay: 175, desc: 'Tył jachtu; tu zwykle jest ster i pawęż.' },
  { id: 'prawa', name: 'Prawa burta (sterburta)', group: 'jacht', ax: 300, ay: 209, desc: 'Patrząc od rufy w stronę dziobu — burta po PRAWEJ ręce. To sterburta; nocą świeci na niej ZIELONE światło („prawa – trawa”).' },
  { id: 'lewa', name: 'Lewa burta (bakburta)', group: 'jacht', ax: 300, ay: 141, desc: 'Patrząc od rufy w stronę dziobu — burta po LEWEJ ręce. To bakburta; nocą świeci na niej CZERWONE światło („lewa – krewa”).' },
  { id: 'kokpit', name: 'Kokpit', group: 'jacht', ax: 196, ay: 176, desc: 'Zagłębienie, w którym siedzi załoga i sternik obsługujący ster oraz szoty.' },
  { id: 'maszt', name: 'Maszt', group: 'jacht', ax: 336, ay: 175, desc: 'Podstawa masztu na pokładzie (z góry widoczna jako punkt, od którego odchodzą wanty i sztagi).' },
  // liny cumownicze
  { id: 'cuma-dziob', name: 'Cuma dziobowa', group: 'liny', d: 'M508 197 L600 360', desc: 'Prowadzi z dziobu do przodu, do pachołka na pomoście. Trzyma dziób i nie pozwala jachtowi cofać się.' },
  { id: 'cuma-rufa', name: 'Cuma rufowa', group: 'liny', d: 'M134 197 L58 360', desc: 'Prowadzi z rufy do tyłu, do pachołka. Trzyma rufę i nie pozwala jachtowi płynąć do przodu.' },
  { id: 'szpring-dziob', name: 'Szpring dziobowy', group: 'liny', d: 'M446 200 L250 360', desc: 'Z dziobowej części jachtu prowadzi UKOŚNIE DO TYŁU. Blokuje ruch jachtu do przodu wzdłuż pomostu.' },
  { id: 'szpring-rufa', name: 'Szpring rufowy', group: 'liny', d: 'M206 200 L410 360', desc: 'Z rufowej części jachtu prowadzi UKOŚNIE DO PRZODU. Blokuje ruch jachtu do tyłu. Ze szpringiem dziobowym tworzą krzyż.' },
  { id: 'brest-dziob', name: 'Brest dziobowy', group: 'liny', d: 'M500 201 L500 360', desc: 'Krótka lina prostopadła do pomostu przy dziobie. Dociąga jacht do pomostu (nie pozwala odejść burtą).' },
  { id: 'brest-rufa', name: 'Brest rufowy', group: 'liny', d: 'M156 201 L156 360', desc: 'Krótka lina prostopadła do pomostu przy rufie. Razem z dziobowym trzyma jacht równolegle, blisko pomostu.' },
]

const bollards = [
  [600, 360],
  [58, 360],
  [250, 360],
  [410, 360],
  [500, 360],
  [156, 360],
]

export default function DeckTopView() {
  const [sel, setSel] = useState<Item | null>(ITEMS.find((i) => i.id === 'prawa')!)
  const feat = ITEMS.filter((i) => i.group === 'jacht')
  const lines = ITEMS.filter((i) => i.group === 'liny')

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="card p-4">
        <svg viewBox="0 0 640 430" className="w-full">
          <defs>
            <linearGradient id="dv-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f3a56" />
              <stop offset="100%" stopColor="#0a2438" />
            </linearGradient>
            <filter id="dv-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="640" height="430">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={ACCENT} floodOpacity="0.95" />
            </filter>
          </defs>
          <rect x="0" y="0" width="640" height="430" fill="url(#dv-water)" />

          {/* POMOST */}
          <rect x="0" y="360" width="640" height="70" fill="#5b4a33" />
          <rect x="0" y="360" width="640" height="70" fill="#3a5a44" opacity="0.15" />
          {[30, 110, 190, 270, 350, 430, 510, 590].map((x) => (
            <line key={x} x1={x} y1="360" x2={x} y2="430" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
          ))}
          <text x="18" y="352" fill="rgba(207,230,240,0.8)" fontSize="14" fontWeight="700">
            POMOST
          </text>
          {bollards.map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 5} y={y - 12} width="10" height="16" rx="3" fill="#2b3942" />
              <circle cx={x} cy={y - 12} r="6" fill="#39505d" />
            </g>
          ))}

          {/* LINY CUMOWNICZE */}
          {lines.map((l) => {
            const on = sel?.id === l.id
            return (
              <path
                key={l.id}
                d={l.d}
                fill="none"
                stroke={on ? ACCENT : ROPE}
                strokeWidth={on ? 5 : 2.5}
                strokeLinecap="round"
                opacity={sel && sel.group === 'liny' && !on ? 0.35 : 1}
                filter={on ? 'url(#dv-glow)' : undefined}
                style={{ cursor: 'pointer' }}
                onClick={() => setSel(l)}
              />
            )
          })}

          {/* JACHT (widok z góry, dziób w prawo) */}
          <path
            d="M120 148 L452 146 C 495 148, 525 160, 525 175 C 525 190, 495 202, 452 204 L120 202 Z"
            fill="#e8dcc0"
            stroke="#0f2b3f"
            strokeWidth="3"
          />
          <path
            d="M132 156 L450 154 C 486 156, 512 164, 512 175 C 512 186, 486 194, 450 196 L132 194 Z"
            fill="#d3c19a"
            opacity="0.5"
          />
          {/* kokpit */}
          <rect x="150" y="159" width="92" height="33" rx="9" fill="#0f2233" onClick={() => setSel(feat.find((f) => f.id === 'kokpit')!)} style={{ cursor: 'pointer' }} />
          {/* kabina */}
          <rect x="256" y="158" width="150" height="34" rx="8" fill="#cdb891" opacity="0.7" />
          {/* maszt */}
          <circle cx="336" cy="175" r="6" fill="#3a2c14" onClick={() => setSel(feat.find((f) => f.id === 'maszt')!)} style={{ cursor: 'pointer' }} />

          {/* etykiety stałe */}
          <text x="300" y="130" textAnchor="middle" fill="#e2454a" fontSize="13" fontWeight="700">
            ← lewa burta (bakburta) · czerwone światło
          </text>
          <text x="300" y="246" textAnchor="middle" fill="#1fa463" fontSize="13" fontWeight="700">
            ← prawa burta (sterburta) · zielone światło
          </text>
          <text x="548" y="179" fill="rgba(207,230,240,0.85)" fontSize="13" fontWeight="700">
            dziób
          </text>
          <text x="92" y="179" textAnchor="end" fill="rgba(207,230,240,0.85)" fontSize="13" fontWeight="700">
            rufa
          </text>

          {/* marker wybranego elementu */}
          {sel && sel.ax != null && (
            <motion.circle
              key={sel.id}
              cx={sel.ax}
              cy={sel.ay}
              r="10"
              fill="none"
              stroke={ACCENT}
              strokeWidth="2.5"
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ transformOrigin: `${sel.ax}px ${sel.ay}px` }}
            />
          )}
        </svg>
      </div>

      {/* PANEL */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="card p-2">
          <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-brine-100/50">Elementy jachtu</div>
          {feat.map((f) => (
            <ItemBtn key={f.id} item={f} sel={sel} setSel={setSel} />
          ))}
          <div className="mt-1 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-brine-100/50">Cumy i liny</div>
          {lines.map((l) => (
            <ItemBtn key={l.id} item={l} sel={sel} setSel={setSel} />
          ))}
        </div>

        <motion.div key={sel?.id ?? 'x'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          {sel ? (
            <>
              <h3 className="font-display text-lg font-700 text-navy">{sel.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brine-100/90">{sel.desc}</p>
            </>
          ) : (
            <p className="text-sm text-brine-100/80">Wybierz element z listy.</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function ItemBtn({ item, sel, setSel }: { item: Item; sel: Item | null; setSel: (i: Item) => void }) {
  const on = sel?.id === item.id
  return (
    <button
      onClick={() => setSel(item)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        on ? 'bg-brine-500/25 text-white' : 'text-brine-100 hover:bg-white/5'
      }`}
    >
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: on ? ACCENT : 'rgba(123,188,217,0.5)' }} />
      {item.name}
    </button>
  )
}
