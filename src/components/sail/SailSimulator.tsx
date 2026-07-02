import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  angleOffBow,
  boomAngle,
  compassName,
  computeForces,
  normalizeDeg,
  pointOfSail,
  tackOf,
  apparentWind,
} from '../../lib/sailing'
import { Term, StatBar } from '../ui'
import { Wind, RotateCcw } from 'lucide-react'

const CX = 200
const CY = 200
const R = 155

// zamiana kąta (0 = góra sceny, zgodnie ze wskazówkami) na wektor SVG (y w dół)
function polar(deg: number, len: number) {
  const r = (deg * Math.PI) / 180
  return { x: Math.sin(r) * len, y: -Math.cos(r) * len }
}

// łuk „banana” — wygięta linia żagla od chord (x1,y1)->(x2,y2), brzuch na zawietrzną
function sailPath(x1: number, y1: number, x2: number, y2: number, belly: number) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  // wektor prostopadły do cięciwy
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const cx = mx + nx * belly
  const cy = my + ny * belly
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
}

// falująca (łopocząca) linia żagla — używana w martwym kącie
function luffPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  amp: number,
  phase: number,
) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const nx = -uy
  const ny = ux
  const steps = 8
  let d = `M ${x1} ${y1}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const off = Math.sin(t * Math.PI * 2.2 + phase) * amp * Math.sin(t * Math.PI)
    const px = x1 + dx * t + nx * off
    const py = y1 + dy * t + ny * off
    d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`
  }
  return d
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 4,
  head = 10,
  dashed = false,
  label,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  width?: number
  head?: number
  dashed?: boolean
  label?: string
}) {
  const ang = Math.atan2(y2 - y1, x2 - x1)
  const hx = x2 - Math.cos(ang) * head
  const hy = y2 - Math.sin(ang) * head
  const left = { x: hx - Math.sin(ang) * head * 0.6, y: hy + Math.cos(ang) * head * 0.6 }
  const right = { x: hx + Math.sin(ang) * head * 0.6, y: hy - Math.cos(ang) * head * 0.6 }
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={hx}
        y2={hy}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 6' : undefined}
      />
      <polygon points={`${x2},${y2} ${left.x},${left.y} ${right.x},${right.y}`} fill={color} />
      {label && (
        <text
          x={x2}
          y={y2}
          dx={Math.cos(ang) * 12}
          dy={Math.sin(ang) * 12 + 4}
          fill={color}
          fontSize="12"
          fontWeight="700"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  )
}

export default function SailSimulator() {
  const [heading, setHeading] = useState(20)
  const [windFrom, setWindFrom] = useState(0)
  const [windKts, setWindKts] = useState(12)

  const trueStrength = 0.3 + Math.min(1, windKts / 25) * 0.9

  const awa = angleOffBow(heading, windFrom)
  const tack = tackOf(heading, windFrom)
  const pos = pointOfSail(awa)
  const boom = boomAngle(awa)
  const forces = computeForces(awa, trueStrength)
  const app = apparentWind(awa, trueStrength)
  const isLuffing = awa < 32

  // Wiatr rysujemy ZAWSZE od góry (stały punkt). Obracamy jacht,
  // aby oddać kąt względem wiatru. rot = heading - windFrom.
  const rot = normalizeDeg(heading - windFrom)
  const lee = tack === 'starboard' ? -1 : 1 // strona zawietrzna w układzie lokalnym (x)

  // brzuch żagli (głębokość wygięcia) zależny lekko od kursu
  const belly = 18 + (awa / 180) * 16

  const ceo = { x: CX, y: CY - 8 } // środek ożaglowania (punkt przyłożenia sił)
  const driveLen = 20 + forces.drive * 95
  const heelLen = 18 + forces.heel * 80

  function setRelative(targetAwa: number) {
    setHeading(normalizeDeg(windFrom - targetAwa))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* SCENA */}
      <div className="card p-4">
        <svg viewBox="0 0 400 400" className="w-full">
          <defs>
            <radialGradient id="sea" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#12405c" />
              <stop offset="100%" stopColor="#081a28" />
            </radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r={R + 30} fill="url(#sea)" />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* podziałka kątowa (co 30°) — bez kierunków geograficznych, bo scena jest względem wiatru */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = polar(i * 30, R)
            const b = polar(i * 30, R - 8)
            return (
              <line
                key={i}
                x1={CX + a.x}
                y1={CY + a.y}
                x2={CX + b.x}
                y2={CY + b.y}
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1"
              />
            )
          })}

          {/* strefa martwego kąta — zawsze u góry, wokół wiatru */}
          <path
            d={`M ${CX} ${CY} L ${CX + polar(-32, R).x} ${CY + polar(-32, R).y} A ${R} ${R} 0 0 1 ${
              CX + polar(32, R).x
            } ${CY + polar(32, R).y} Z`}
            fill="rgba(226,69,74,0.13)"
            stroke="rgba(226,69,74,0.35)"
            strokeDasharray="4 4"
          />
          <text x={CX} y={CY - R + 78} textAnchor="middle" fontSize="10" fill="rgba(226,69,74,0.8)">
            martwy kąt
          </text>

          {/* WIATR — stała strzałka u góry, zawsze z tego samego punktu */}
          <Arrow x1={CX} y1={24} x2={CX} y2={92} color="#7bbcd9" width={6} head={16} />
          <text x={CX} y={16} textAnchor="middle" fontSize="12" fontWeight="700" fill="#7bbcd9">
            WIATR ({compassName(windFrom)}, {Math.round(windKts)} kn)
          </text>

          {/* JACHT — obrócony względem wiatru */}
          <g transform={`rotate(${rot} ${CX} ${CY})`}>
            {/* kilwater */}
            <line
              x1={CX}
              y1={CY + 95}
              x2={CX}
              y2={CY + 128}
              stroke="rgba(123,188,217,0.22)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* kadłub */}
            <path
              d={`M ${CX} ${CY - 92}
                  C ${CX + 17} ${CY - 60}, ${CX + 21} ${CY + 40}, ${CX + 11} ${CY + 88}
                  L ${CX} ${CY + 98}
                  L ${CX - 11} ${CY + 88}
                  C ${CX - 21} ${CY + 40}, ${CX - 17} ${CY - 60}, ${CX} ${CY - 92} Z`}
              fill="#e9dcc0"
              stroke="#0f2b3f"
              strokeWidth="3"
            />
            <path
              d={`M ${CX} ${CY - 74}
                  C ${CX + 11} ${CY - 50}, ${CX + 13} ${CY + 35}, ${CX + 7} ${CY + 74}
                  L ${CX - 7} ${CY + 74}
                  C ${CX - 13} ${CY + 35}, ${CX - 11} ${CY - 50}, ${CX} ${CY - 74} Z`}
              fill="#c9b487"
              opacity="0.55"
            />

            {isLuffing ? (
              <>
                {/* ŁOPOT — żagle jako falujące (trzepoczące) linie */}
                <motion.path
                  d={luffPath(CX, CY - 78, CX, CY - 20, 9, 0)}
                  fill="none"
                  stroke="rgba(247,241,227,0.9)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={{
                    d: [
                      luffPath(CX, CY - 78, CX, CY - 20, 9, 0),
                      luffPath(CX, CY - 78, CX, CY - 20, 9, Math.PI),
                      luffPath(CX, CY - 78, CX, CY - 20, 9, 0),
                    ],
                  }}
                  transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.path
                  d={luffPath(CX, CY - 26, CX, CY + 66, 11, 0)}
                  fill="none"
                  stroke="rgba(238,247,251,0.95)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  animate={{
                    d: [
                      luffPath(CX, CY - 26, CX, CY + 66, 11, Math.PI),
                      luffPath(CX, CY - 26, CX, CY + 66, 11, 0),
                      luffPath(CX, CY - 26, CX, CY + 66, 11, Math.PI),
                    ],
                  }}
                  transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
                />
              </>
            ) : (
              <>
                {/* FOK — wygięta linia przed masztem, brzuch na zawietrzną */}
                <motion.path
                  d={sailPath(CX, CY - 82, CX, CY - 22, lee * (belly * 0.7))}
                  fill="none"
                  stroke="rgba(247,241,227,0.95)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  animate={{ d: sailPath(CX, CY - 82, CX, CY - 22, lee * (belly * 0.7)) }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
                {/* GROT — wygięta linia za masztem */}
                <motion.path
                  d={sailPath(CX, CY - 26, CX, CY + 68, lee * belly)}
                  fill="none"
                  stroke="rgba(238,247,251,1)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  animate={{ d: sailPath(CX, CY - 26, CX, CY + 68, lee * belly) }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              </>
            )}
            {/* maszt */}
            <circle cx={CX} cy={CY - 26} r="4" fill="#3a2c14" />

            {/* SIŁY */}
            {!isLuffing && (
              <>
                <Arrow x1={ceo.x} y1={ceo.y} x2={ceo.x} y2={ceo.y - driveLen} color="#1fa463" width={5} label="ciąg" />
                <Arrow x1={ceo.x} y1={ceo.y} x2={ceo.x + lee * heelLen} y2={ceo.y} color="#f4952b" width={5} label="przechył" />
                <Arrow
                  x1={CX}
                  y1={CY + 40}
                  x2={CX - lee * (14 + forces.heel * 40)}
                  y2={CY + 40}
                  color="#489cc4"
                  width={4}
                  dashed
                />
              </>
            )}
          </g>
        </svg>

        {/* legenda sił */}
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-brine-100/80">
          <Term label={<span className="text-[#1fa463]">● siła ciągu</span>} title="Siła ciągu (napędowa)">
            <p>
              Składowa wypadkowej siły aerodynamicznej skierowana wzdłuż osi jachtu, do
              przodu. To ona napędza jacht. Największa na półwietrze i baksztagu.
            </p>
          </Term>
          <Term label={<span className="text-[#f4952b]">● siła przechyłu</span>} title="Siła przechylająca (boczna)">
            <p>
              Składowa boczna. Powoduje przechył i dryf. Na kursach ostrych do wiatru jest
              duża — dlatego jacht mocno się kładzie i wolniej płynie „pod wiatr”.
            </p>
          </Term>
          <Term label={<span className="text-[#489cc4]">● opór kilu</span>} title="Opór boczny (kil / miecz)">
            <p>
              Kil lub miecz pod wodą stawia opór ruchowi w bok i równoważy siłę
              przechylającą. Dzięki temu jacht płynie do przodu, a nie dryfuje z wiatrem.
              Różnica kątów to <b>dryf</b> (leeway).
            </p>
          </Term>
          <Term label={<span className="text-[#7bbcd9]">● wiatr</span>} title="Wiatr rzeczywisty vs pozorny">
            <p>
              Na scenie wiatr <b>rzeczywisty</b> wieje zawsze z góry — jacht obraca się
              względem niego. <b>Wiatr pozorny</b> (odczuwany na płynącym jachcie) jest sumą
              wiatru rzeczywistego i „wiatru z ruchu”; to do niego trymuje się żagle.
            </p>
          </Term>
        </div>
      </div>

      {/* PANEL STEROWANIA */}
      <div className="space-y-5">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span
              className="chip"
              style={{ backgroundColor: pos.color + '22', color: pos.color, borderColor: pos.color + '55' }}
            >
              {pos.name}
            </span>
            <span className="text-xs text-brine-100/70">hals {tack === 'starboard' ? 'prawy' : 'lewy'}</span>
          </div>
          <p className="mt-2 text-sm text-brine-100/80">{pos.desc}</p>
        </div>

        <div className="card p-5 space-y-5">
          <Control
            icon={<RotateCcw className="h-4 w-4" />}
            label="Kurs jachtu"
            value={`${Math.round(heading)}° ${compassName(heading)}`}
            min={0}
            max={359}
            v={heading}
            onChange={setHeading}
          />
          <Control
            icon={<Wind className="h-4 w-4" />}
            label="Wiatr wieje z kierunku"
            value={`${Math.round(windFrom)}° ${compassName(windFrom)}`}
            min={0}
            max={359}
            v={windFrom}
            onChange={setWindFrom}
          />
          <Control label="Siła wiatru" value={`${Math.round(windKts)} kn`} min={2} max={30} v={windKts} onChange={setWindKts} />
          <div>
            <div className="mb-2 text-xs text-brine-100/70">Szybko ustaw kurs względem wiatru:</div>
            <div className="flex flex-wrap gap-2">
              {[
                ['Bajdewind', 45],
                ['Półwiatr', 90],
                ['Baksztag', 135],
                ['Fordewind', 178],
              ].map(([name, a]) => (
                <button key={name as string} onClick={() => setRelative(a as number)} className="btn-ghost px-3 py-1.5 text-xs">
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-brine-100/60">Siły i osiągi</div>
          <StatBar label="Siła ciągu" value={forces.drive} color="#1fa463" />
          <StatBar label="Siła przechyłu" value={forces.heel} color="#f4952b" />
          <StatBar label="Prędkość jachtu (poglądowo)" value={forces.speed} color="#7bbcd9" />
          <p className="pt-1 text-xs text-brine-100/60">
            Kąt żagla do osi jachtu: <b className="text-brine-100">{Math.round(boom)}°</b> · wiatr pozorny ok.{' '}
            <b className="text-brine-100">{Math.round(app.awa)}°</b> od dziobu
          </p>
        </div>
      </div>
    </div>
  )
}

function Control({
  icon,
  label,
  value,
  min,
  max,
  v,
  onChange,
}: {
  icon?: React.ReactNode
  label: string
  value: string
  min: number
  max: number
  v: number
  onChange: (n: number) => void
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm text-brine-100">
          {icon}
          {label}
        </span>
        <span className="tabular-nums text-sm font-semibold text-white">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={v} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  )
}
