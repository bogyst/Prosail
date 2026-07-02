import { useMemo, useState } from 'react'
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

// zamiana bearingu (0=N, zgodnie ze wskazówkami) na wektor w układzie SVG (y w dół)
function bearingVec(deg: number, len: number) {
  const r = (deg * Math.PI) / 180
  return { x: Math.sin(r) * len, y: -Math.cos(r) * len }
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  width = 4,
  head = 10,
  opacity = 1,
  dashed = false,
  onClick,
  label,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  width?: number
  head?: number
  opacity?: number
  dashed?: boolean
  onClick?: () => void
  label?: string
}) {
  const ang = Math.atan2(y2 - y1, x2 - x1)
  const hx = x2 - Math.cos(ang) * head
  const hy = y2 - Math.sin(ang) * head
  const left = {
    x: hx - Math.sin(ang) * head * 0.6,
    y: hy + Math.cos(ang) * head * 0.6,
  }
  const right = {
    x: hx + Math.sin(ang) * head * 0.6,
    y: hy - Math.cos(ang) * head * 0.6,
  }
  return (
    <g
      opacity={opacity}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
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
      <polygon
        points={`${x2},${y2} ${left.x},${left.y} ${right.x},${right.y}`}
        fill={color}
      />
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

  // znak strony zawietrznej w układzie lokalnym jachtu (x w prawo = sterburta)
  const lee = tack === 'starboard' ? -1 : 1

  // geometria żagli w układzie lokalnym (dziób w górę, -y)
  const geom = useMemo(() => {
    const mast = { x: CX, y: CY - 15 }
    const boomLen = 92
    const b = (boom * Math.PI) / 180
    const flap = isLuffing ? 0 : 1
    const boomTip = {
      x: mast.x + lee * boomLen * Math.sin(b) * flap,
      y: mast.y + boomLen * Math.cos(b),
    }
    // grot: krzywizna od masztu do bomu
    const bellyMain = {
      x: mast.x + lee * (isLuffing ? 4 : 34),
      y: (mast.y + boomTip.y) / 2 - 8,
    }
    // fok: przed masztem, też na zawietrzną
    const forestay = { x: CX, y: CY - 78 }
    const jibClew = {
      x: CX + lee * (isLuffing ? 4 : 40),
      y: CY - 26,
    }
    const bellyJib = {
      x: CX + lee * (isLuffing ? 2 : 24),
      y: CY - 54,
    }
    return { mast, boomTip, bellyMain, forestay, jibClew, bellyJib }
  }, [boom, lee, isLuffing])

  // wiatr rzeczywisty w układzie świata (przychodzi z windFrom w stronę środka)
  const windStart = bearingVec(windFrom, R + 28)
  const windEnd = bearingVec(windFrom, R - 42)

  // strzałki sił w układzie lokalnym (dziób = -y)
  const ceo = { x: CX, y: CY - 8 } // punkt przyłożenia (środek ożaglowania)
  const driveLen = 20 + forces.drive * 95
  const heelLen = 18 + forces.heel * 80

  function setRelative(targetAwa: number) {
    // ustaw kurs tak, aby wiatr pozorny (~rzeczywisty) był pod targetAwa na prawym halsie
    setHeading(normalizeDeg(windFrom - targetAwa))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* SCENA */}
      <div className="card p-4">
        <svg viewBox="0 0 400 400" className="w-full">
          {/* woda */}
          <defs>
            <radialGradient id="sea" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#12405c" />
              <stop offset="100%" stopColor="#081a28" />
            </radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r={R + 30} fill="url(#sea)" />
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          {/* róża wiatrów */}
          {['N', 'E', 'S', 'W'].map((d, i) => {
            const p = bearingVec(i * 90, R + 14)
            return (
              <text
                key={d}
                x={CX + p.x}
                y={CY + p.y + 4}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill={d === 'N' ? '#e2454a' : 'rgba(255,255,255,0.45)'}
              >
                {d}
              </text>
            )
          })}
          {Array.from({ length: 72 }).map((_, i) => {
            const major = i % 9 === 0
            const a = bearingVec(i * 5, R)
            const b = bearingVec(i * 5, R - (major ? 10 : 5))
            return (
              <line
                key={i}
                x1={CX + a.x}
                y1={CY + a.y}
                x2={CX + b.x}
                y2={CY + b.y}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={major ? 1.5 : 0.7}
              />
            )
          })}

          {/* strefa martwego kąta wokół wiatru */}
          <path
            d={`M ${CX} ${CY} L ${CX + bearingVec(windFrom - 32, R).x} ${
              CY + bearingVec(windFrom - 32, R).y
            } A ${R} ${R} 0 0 1 ${CX + bearingVec(windFrom + 32, R).x} ${
              CY + bearingVec(windFrom + 32, R).y
            } Z`}
            fill="rgba(226,69,74,0.12)"
            stroke="rgba(226,69,74,0.3)"
            strokeDasharray="4 4"
          />

          {/* wiatr rzeczywisty */}
          <Arrow
            x1={CX + windStart.x}
            y1={CY + windStart.y}
            x2={CX + windEnd.x}
            y2={CY + windEnd.y}
            color="#7bbcd9"
            width={5}
            head={14}
          />
          <text
            x={CX + windStart.x}
            y={CY + windStart.y - 8}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#7bbcd9"
          >
            wiatr {compassName(windFrom)}
          </text>

          {/* JACHT (obrócony do kursu) */}
          <g transform={`rotate(${heading} ${CX} ${CY})`}>
            {/* kilwater / kierunek ruchu */}
            <line
              x1={CX}
              y1={CY + 95}
              x2={CX}
              y2={CY + 130}
              stroke="rgba(123,188,217,0.25)"
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
            {/* pokład */}
            <path
              d={`M ${CX} ${CY - 74}
                  C ${CX + 11} ${CY - 50}, ${CX + 13} ${CY + 35}, ${CX + 7} ${CY + 74}
                  L ${CX - 7} ${CY + 74}
                  C ${CX - 13} ${CY + 35}, ${CX - 11} ${CY - 50}, ${CX} ${CY - 74} Z`}
              fill="#c9b487"
              opacity="0.6"
            />

            {/* FOK */}
            <motion.path
              d={`M ${geom.forestay.x} ${geom.forestay.y}
                  Q ${geom.bellyJib.x} ${geom.bellyJib.y} ${geom.jibClew.x} ${geom.jibClew.y}
                  L ${CX} ${CY - 30} Z`}
              fill={isLuffing ? 'rgba(247,241,227,0.35)' : 'rgba(247,241,227,0.92)'}
              stroke="#0f2b3f"
              strokeWidth="1.5"
              animate={isLuffing ? { skewX: [0, 6, -6, 0] } : { skewX: 0 }}
              transition={{ duration: 0.5, repeat: isLuffing ? Infinity : 0 }}
            />

            {/* GROT */}
            <motion.path
              d={`M ${geom.mast.x} ${geom.mast.y}
                  Q ${geom.bellyMain.x} ${geom.bellyMain.y} ${geom.boomTip.x} ${geom.boomTip.y}
                  L ${geom.mast.x} ${geom.boomTip.y} Z`}
              fill={isLuffing ? 'rgba(238,247,251,0.4)' : 'rgba(238,247,251,0.96)'}
              stroke="#0f2b3f"
              strokeWidth="1.5"
              animate={isLuffing ? { skewX: [0, -7, 7, 0] } : { skewX: 0 }}
              transition={{ duration: 0.5, repeat: isLuffing ? Infinity : 0 }}
            />
            {/* bom */}
            <line
              x1={geom.mast.x}
              y1={geom.mast.y}
              x2={geom.boomTip.x}
              y2={geom.boomTip.y}
              stroke="#3a2c14"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* maszt */}
            <circle cx={geom.mast.x} cy={geom.mast.y} r="4" fill="#3a2c14" />

            {/* SIŁY */}
            {!isLuffing && (
              <>
                {/* ciąg (do przodu) */}
                <Arrow
                  x1={ceo.x}
                  y1={ceo.y}
                  x2={ceo.x}
                  y2={ceo.y - driveLen}
                  color="#1fa463"
                  width={5}
                  label="ciąg"
                />
                {/* przechył (w bok, na zawietrzną) */}
                <Arrow
                  x1={ceo.x}
                  y1={ceo.y}
                  x2={ceo.x + lee * heelLen}
                  y2={ceo.y}
                  color="#f4952b"
                  width={5}
                  label="przechył"
                />
                {/* opór boczny kilu (na nawietrzną) */}
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

          {/* wiatr pozorny (mały wskaźnik na dziobie) */}
          {!isLuffing && (
            <g
              transform={`rotate(${heading} ${CX} ${CY})`}
              opacity="0.9"
            >
              <Arrow
                x1={CX + lee * 60}
                y1={CY - 120}
                x2={
                  CX +
                  lee * 60 +
                  lee * Math.sin((app.awa * Math.PI) / 180) * 34
                }
                y2={CY - 120 + Math.cos((app.awa * Math.PI) / 180) * 34}
                color="#c9a15a"
                width={3}
                head={8}
                label="poz."
              />
            </g>
          )}
        </svg>

        {/* legenda sił */}
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-brine-100/80">
          <Term label={<span className="text-[#1fa463]">● siła ciągu</span>} title="Siła ciągu (napędowa)">
            <p>
              Składowa wypadkowej siły aerodynamicznej skierowana wzdłuż osi
              jachtu, do przodu. To ona napędza jacht. Największa na półwietrze i
              baksztagu.
            </p>
          </Term>
          <Term label={<span className="text-[#f4952b]">● siła przechyłu</span>} title="Siła przechylająca (boczna)">
            <p>
              Składowa boczna. Powoduje przechył i dryf. Na kursach ostrych do
              wiatru jest duża — dlatego jacht mocno się kładzie i wolniej płynie
              „pod wiatr”.
            </p>
          </Term>
          <Term label={<span className="text-[#489cc4]">● opór kilu</span>} title="Opór boczny (kil / miecz)">
            <p>
              Kil lub miecz pod wodą stawia opór ruchowi w bok i równoważy siłę
              przechylającą. Dzięki temu jacht płynie do przodu, a nie dryfuje z
              wiatrem. Różnica kątów to <b>dryf</b> (leeway).
            </p>
          </Term>
          <Term label={<span className="text-[#7bbcd9]">● wiatr rzecz.</span>} title="Wiatr rzeczywisty vs pozorny">
            <p>
              <b>Rzeczywisty</b> — wiatr odczuwany na postoju. <b>Pozorny</b>{' '}
              (złoty) — wiatr odczuwany na płynącym jachcie, będący sumą wiatru
              rzeczywistego i „wiatru z ruchu”. Żagle trymuje się do wiatru
              pozornego.
            </p>
          </Term>
        </div>
      </div>

      {/* PANEL STEROWANIA */}
      <div className="space-y-5">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="chip" style={{ backgroundColor: pos.color + '22', color: pos.color, borderColor: pos.color + '55' }}>
              {pos.name}
            </span>
            <span className="text-xs text-brine-100/70">
              hals {tack === 'starboard' ? 'prawy' : 'lewy'}
            </span>
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
          <Control
            label="Siła wiatru"
            value={`${Math.round(windKts)} kn`}
            min={2}
            max={30}
            v={windKts}
            onChange={setWindKts}
          />
          <div>
            <div className="mb-2 text-xs text-brine-100/70">
              Szybko ustaw kurs względem wiatru:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ['Bajdewind', 45],
                ['Półwiatr', 90],
                ['Baksztag', 135],
                ['Fordewind', 178],
              ].map(([name, a]) => (
                <button
                  key={name as string}
                  onClick={() => setRelative(a as number)}
                  className="btn-ghost px-3 py-1.5 text-xs"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-brine-100/60">
            Siły i osiągi
          </div>
          <StatBar label="Siła ciągu" value={forces.drive} color="#1fa463" />
          <StatBar label="Siła przechyłu" value={forces.heel} color="#f4952b" />
          <StatBar label="Prędkość jachtu (poglądowo)" value={forces.speed} color="#7bbcd9" />
          <p className="pt-1 text-xs text-brine-100/60">
            Kąt bomu do osi jachtu: <b className="text-brine-100">{Math.round(boom)}°</b>{' '}
            · wiatr pozorny ok. <b className="text-brine-100">{Math.round(app.awa)}°</b>{' '}
            od dziobu
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
      <input
        type="range"
        min={min}
        max={max}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}
