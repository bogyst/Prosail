import { useState } from 'react'
import { motion } from 'framer-motion'

const CX = 200
const CY = 205
const R = 150

function polar(deg: number, len: number) {
  const r = (deg * Math.PI) / 180
  return { x: Math.sin(r) * len, y: -Math.cos(r) * len }
}

// wycinek koła (sektor widoczności światła) od a0 do a1 stopni (0 = dziób, zgodnie z ruchem wskazówek)
function sector(a0: number, a1: number, r: number) {
  let d = `M ${CX} ${CY}`
  const steps = Math.max(2, Math.round((a1 - a0) / 4))
  for (let i = 0; i <= steps; i++) {
    const deg = a0 + ((a1 - a0) * i) / steps
    const p = polar(deg, r)
    d += ` L ${(CX + p.x).toFixed(1)} ${(CY + p.y).toFixed(1)}`
  }
  return d + ' Z'
}

const GREEN = '#1fa463'
const RED = '#e2454a'
const WHITE = '#f3efe2'

interface Sec {
  a0: number
  a1: number
  c: string
}
interface Lamp {
  x: number
  y: number
  c: string
}
interface Light {
  id: string
  name: string
  arc: string
  range: string
  desc: string
  who: string
  secs: Sec[]
  lamps: Lamp[]
  r?: number
}

const LIGHTS: Light[] = [
  {
    id: 'stbd',
    name: 'Burtowe prawe (zielone)',
    arc: '112,5°',
    range: 'ok. 1–2 Mm',
    who: 'każda jednostka w drodze',
    desc: 'Zielone światło na prawej burcie (sterburcie). Świeci od dziobu do 22,5° za trawersem. Widząc czyjeś zielone światło, patrzysz na jego prawą burtę.',
    secs: [{ a0: 0, a1: 112.5, c: GREEN }],
    lamps: [{ x: CX + 17, y: CY - 68, c: GREEN }],
  },
  {
    id: 'port',
    name: 'Burtowe lewe (czerwone)',
    arc: '112,5°',
    range: 'ok. 1–2 Mm',
    who: 'każda jednostka w drodze',
    desc: 'Czerwone światło na lewej burcie (bakburcie). Świeci od dziobu do 22,5° za trawersem. Widząc czerwone światło innej jednostki, zwykle to Ty ustępujesz.',
    secs: [{ a0: 247.5, a1: 360, c: RED }],
    lamps: [{ x: CX - 17, y: CY - 68, c: RED }],
  },
  {
    id: 'stern',
    name: 'Rufowe (białe)',
    arc: '135°',
    range: 'ok. 2 Mm',
    who: 'jednostka w drodze',
    desc: 'Białe światło na rufie, świecące do tyłu (67,5° na każdą burtę). Razem ze światłami burtowymi domyka okrąg 360°.',
    secs: [{ a0: 112.5, a1: 247.5, c: WHITE }],
    lamps: [{ x: CX, y: CY + 90, c: WHITE }],
  },
  {
    id: 'mast',
    name: 'Topowe (białe)',
    arc: '225°',
    range: 'ok. 2–3 Mm',
    who: 'tylko napęd mechaniczny',
    desc: 'Białe światło na maszcie, świecące do przodu (jak burtowe razem). Niesie je jednostka o napędzie mechanicznym — po nim odróżnisz nocą motorówkę od żaglówki. Żaglówka pod żaglami go NIE pokazuje.',
    secs: [{ a0: 247.5, a1: 472.5, c: WHITE }],
    lamps: [{ x: CX, y: CY - 12, c: WHITE }],
    r: 128,
  },
  {
    id: 'tricolor',
    name: 'Latarnia trójkolorowa',
    arc: '360° (3 sektory)',
    range: 'ok. 2 Mm',
    who: 'jacht żaglowy < 20 m',
    desc: 'Jedna latarnia na topie masztu łącząca światła burtowe i rufowe. Dozwolona zamiast trzech osobnych świateł na jachcie żaglowym poniżej 20 m — lepiej widoczna z daleka i oszczędza prąd.',
    secs: [
      { a0: 0, a1: 112.5, c: GREEN },
      { a0: 247.5, a1: 360, c: RED },
      { a0: 112.5, a1: 247.5, c: WHITE },
    ],
    lamps: [{ x: CX, y: CY - 12, c: '#ffffff' }],
  },
  {
    id: 'anchor',
    name: 'Kotwiczne (białe, dookoła)',
    arc: '360°',
    range: 'ok. 2–3 Mm',
    who: 'jednostka na kotwicy',
    desc: 'Białe światło widoczne dookoła widnokręgu (360°), wywieszane na postoju na kotwicy. W dzień zastępuje je czarna kula na dziobie.',
    secs: [{ a0: 0, a1: 360, c: WHITE }],
    lamps: [{ x: CX, y: CY - 34, c: WHITE }],
    r: 118,
  },
]

export default function NavLights() {
  const [sel, setSel] = useState<Light>(LIGHTS[0])

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
      {/* WIDOK Z GÓRY */}
      <div className="card p-4">
        <svg viewBox="0 0 400 420" className="w-full">
          <defs>
            <radialGradient id="nl-sea" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#0e2f45" />
              <stop offset="100%" stopColor="#081a28" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="400" height="420" rx="16" fill="url(#nl-sea)" />
          <circle cx={CX} cy={CY} r={R + 6} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* sektory wybranego światła */}
          {sel.secs.map((s, i) => (
            <motion.path
              key={`${sel.id}-${i}`}
              d={sector(s.a0, s.a1, sel.r ?? R)}
              fill={s.c}
              fillOpacity="0.24"
              stroke={s.c}
              strokeOpacity="0.7"
              strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          ))}

          {/* JACHT — widok z góry, dziób do góry */}
          <path
            d={`M ${CX} ${CY - 95} C ${CX + 26} ${CY - 58}, ${CX + 30} ${CY + 50}, ${CX + 16} ${CY + 92} L ${CX} ${CY + 100} L ${CX - 16} ${CY + 92} C ${CX - 30} ${CY + 50}, ${CX - 26} ${CY - 58}, ${CX} ${CY - 95} Z`}
            fill="#e8dcc0"
            stroke="#0f2b3f"
            strokeWidth="3"
          />
          <path
            d={`M ${CX} ${CY - 78} C ${CX + 16} ${CY - 48}, ${CX + 18} ${CY + 40}, ${CX + 9} ${CY + 76} L ${CX - 9} ${CY + 76} C ${CX - 18} ${CY + 40}, ${CX - 16} ${CY - 48}, ${CX} ${CY - 78} Z`}
            fill="#c9b487"
            opacity="0.5"
          />
          <text x={CX} y={CY - 104} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(207,230,240,0.75)">
            dziób
          </text>
          <text x={CX} y={CY + 116} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(207,230,240,0.6)">
            rufa
          </text>

          {/* wszystkie lampy (kontekst) */}
          {LIGHTS.filter((l) => ['stbd', 'port', 'stern'].includes(l.id)).flatMap((l) =>
            l.lamps.map((lm, i) => <circle key={`${l.id}-${i}`} cx={lm.x} cy={lm.y} r="3" fill={lm.c} opacity="0.5" />),
          )}
          {/* lampy wybranego światła — podświetlone */}
          {sel.lamps.map((lm, i) => (
            <g key={i}>
              <circle cx={lm.x} cy={lm.y} r="9" fill={lm.c} opacity="0.35" />
              <circle cx={lm.x} cy={lm.y} r="4.5" fill={lm.c} stroke="#0f2b3f" strokeWidth="1" />
            </g>
          ))}
        </svg>
      </div>

      {/* PANEL */}
      <div className="space-y-4">
        <div className="card border-brine-400/30 bg-brine-500/10 p-4">
          <div className="font-display text-lg font-700 text-navy">„Prawa – trawa, lewa – krewa”</div>
          <p className="mt-1 text-sm text-brine-100/85">
            Wierszyk na kolory świateł burtowych: <b className="text-buoyGreen">prawa</b> burta (sterburta) —{' '}
            <b className="text-buoyGreen">zielone</b> (trawa), <b className="text-buoyRed">lewa</b> (bakburta) —{' '}
            <b className="text-buoyRed">czerwone</b> (krew).
          </p>
        </div>

        <div className="card p-2">
          {LIGHTS.map((l) => (
            <button
              key={l.id}
              onClick={() => setSel(l)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                sel.id === l.id ? 'bg-brine-500/25 text-white' : 'text-brine-100 hover:bg-white/5'
              }`}
            >
              <span className="flex -space-x-1">
                {l.secs.slice(0, 3).map((s, i) => (
                  <span key={i} className="h-3 w-3 rounded-full border border-black/30" style={{ backgroundColor: s.c }} />
                ))}
              </span>
              {l.name}
            </button>
          ))}
        </div>

        <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <h3 className="font-display text-lg font-700 text-navy">{sel.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="chip">kąt: {sel.arc}</span>
            <span className="chip">zasięg: {sel.range}</span>
            <span className="chip">{sel.who}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-brine-100/90">{sel.desc}</p>
        </motion.div>
      </div>
    </div>
  )
}
