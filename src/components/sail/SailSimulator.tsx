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

// kąt (0 = dziób/góra, zgodnie ze wskazówkami) -> wektor SVG (y w dół)
function polar(deg: number, len: number) {
  const r = (deg * Math.PI) / 180
  return { x: Math.sin(r) * len, y: -Math.cos(r) * len }
}

// łuk „banana” żagla od (x1,y1) do (x2,y2); brzuch wygina się w stronę (refx,refy)
function sailBanana(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  belly: number,
  refx: number,
  refy: number,
) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  let nx = -dy / len
  let ny = dx / len
  if (nx * refx + ny * refy < 0) {
    nx = -nx
    ny = -ny
  }
  return `M ${x1} ${y1} Q ${(mx + nx * belly).toFixed(1)} ${(my + ny * belly).toFixed(1)} ${x2} ${y2}`
}

// falująca (łopocząca) linia żagla — w martwym kącie
function luffPath(x1: number, y1: number, x2: number, y2: number, amp: number, phase: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const steps = 8
  let d = `M ${x1} ${y1}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const off = Math.sin(t * Math.PI * 2.2 + phase) * amp * Math.sin(t * Math.PI)
    d += ` L ${(x1 + dx * t + nx * off).toFixed(1)} ${(y1 + dy * t + ny * off).toFixed(1)}`
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
      <line x1={x1} y1={y1} x2={hx} y2={hy} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? '6 6' : undefined} />
      <polygon points={`${x2},${y2} ${left.x},${left.y} ${right.x},${right.y}`} fill={color} />
      {label && (
        <text x={x2} y={y2} dx={Math.cos(ang) * 12} dy={Math.sin(ang) * 12 + 4} fill={color} fontSize="11" fontWeight="700" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  )
}

export default function SailSimulator() {
  const [heading, setHeading] = useState(20)
  const [windFrom, setWindFrom] = useState(65)
  const [windKts, setWindKts] = useState(12)

  const trueStrength = 0.3 + Math.min(1, windKts / 25) * 0.9

  const awa = angleOffBow(heading, windFrom)
  const tack = tackOf(heading, windFrom)
  const pos = pointOfSail(awa)
  const boom = boomAngle(awa)
  const forces = computeForces(awa, trueStrength)
  const app = apparentWind(awa, trueStrength)
  const isLuffing = awa < 32

  // Jacht jest NIERUCHOMY, zawsze dziobem do góry. Zmiana kursu lub wiatru
  // zmienia tylko względny kierunek wiatru (rel) — jacht się nie obraca.
  const rel = normalizeDeg(windFrom - heading) // skąd wieje wiatr, względem dziobu (0=z przodu)
  const side = rel < 180 ? 1 : -1 // wiatr z prawej burty (+) czy z lewej (−)
  const lee = tack === 'starboard' ? -1 : 1 // strona zawietrzna w osi X (−x = lewa)

  // bearing wiatru pozornego względem dziobu (po tej samej burcie co rzeczywisty)
  const appBearing = side > 0 ? app.awa : normalizeDeg(-app.awa)

  // geometria ożaglowania (układ lokalny, dziób = góra)
  const b = (boom * Math.PI) / 180
  const mast = { x: CX, y: CY - 30 }
  const Lmain = 86
  const mainClew = { x: mast.x + lee * Lmain * Math.sin(b), y: mast.y + Lmain * Math.cos(b) }
  const jibTack = { x: CX, y: CY - 86 }
  const Ljib = 60
  const jibClew = { x: jibTack.x + lee * Ljib * Math.sin(b), y: jibTack.y + Ljib * Math.cos(b) }

  const ceo = { x: CX, y: CY - 8 }
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

          {/* podziałka co 30° */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = polar(i * 30, R)
            const c = polar(i * 30, R - 8)
            return <line key={i} x1={CX + a.x} y1={CY + a.y} x2={CX + c.x} y2={CY + c.y} stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          })}

          {/* strefa martwego kąta — wokół kierunku wiatru (rel) */}
          <path
            d={`M ${CX} ${CY} L ${CX + polar(rel - 32, R).x} ${CY + polar(rel - 32, R).y} A ${R} ${R} 0 0 1 ${
              CX + polar(rel + 32, R).x
            } ${CY + polar(rel + 32, R).y} Z`}
            fill="rgba(226,69,74,0.12)"
            stroke="rgba(226,69,74,0.3)"
            strokeDasharray="4 4"
          />

          {/* WIATR RZECZYWISTY — z obwodu w stronę środka, w kierunku rel */}
          <Arrow
            x1={CX + polar(rel, R - 2).x}
            y1={CY + polar(rel, R - 2).y}
            x2={CX + polar(rel, R - 48).x}
            y2={CY + polar(rel, R - 48).y}
            color="#7bbcd9"
            width={5}
            head={13}
          />
          <text x={CX + polar(rel, R + 16).x} y={CY + polar(rel, R + 16).y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#7bbcd9">
            wiatr rzecz.
          </text>

          {/* WIATR POZORNY — mniejsza, ruchoma strzałka bliżej dziobu */}
          {!isLuffing && (
            <>
              <Arrow
                x1={CX + polar(appBearing, R - 22).x}
                y1={CY + polar(appBearing, R - 22).y}
                x2={CX + polar(appBearing, R - 58).x}
                y2={CY + polar(appBearing, R - 58).y}
                color="#c9a15a"
                width={3}
                head={9}
              />
              <text x={CX + polar(appBearing, R - 12).x} y={CY + polar(appBearing, R - 12).y + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill="#c9a15a">
                pozorny
              </text>
            </>
          )}

          {/* JACHT — nieruchomy, dziób do góry */}
          <g>
            <line x1={CX} y1={CY + 95} x2={CX} y2={CY + 128} stroke="rgba(123,188,217,0.22)" strokeWidth="10" strokeLinecap="round" />
            <path
              d={`M ${CX} ${CY - 92} C ${CX + 17} ${CY - 60}, ${CX + 21} ${CY + 40}, ${CX + 11} ${CY + 88} L ${CX} ${CY + 98} L ${CX - 11} ${CY + 88} C ${CX - 21} ${CY + 40}, ${CX - 17} ${CY - 60}, ${CX} ${CY - 92} Z`}
              fill="#e9dcc0"
              stroke="#0f2b3f"
              strokeWidth="3"
            />
            <path
              d={`M ${CX} ${CY - 74} C ${CX + 11} ${CY - 50}, ${CX + 13} ${CY + 35}, ${CX + 7} ${CY + 74} L ${CX - 7} ${CY + 74} C ${CX - 13} ${CY + 35}, ${CX - 11} ${CY - 50}, ${CX} ${CY - 74} Z`}
              fill="#c9b487"
              opacity="0.55"
            />

            {isLuffing ? (
              <>
                {/* ŁOPOT — żagle jako falujące linie */}
                <motion.path
                  d={luffPath(jibTack.x, jibTack.y, CX, CY - 28, 9, 0)}
                  fill="none"
                  stroke="rgba(247,241,227,0.9)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={{ d: [luffPath(jibTack.x, jibTack.y, CX, CY - 28, 9, 0), luffPath(jibTack.x, jibTack.y, CX, CY - 28, 9, Math.PI), luffPath(jibTack.x, jibTack.y, CX, CY - 28, 9, 0)] }}
                  transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.path
                  d={luffPath(mast.x, mast.y, CX, CY + 60, 11, 0)}
                  fill="none"
                  stroke="rgba(238,247,251,0.95)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  animate={{ d: [luffPath(mast.x, mast.y, CX, CY + 60, 11, Math.PI), luffPath(mast.x, mast.y, CX, CY + 60, 11, 0), luffPath(mast.x, mast.y, CX, CY + 60, 11, Math.PI)] }}
                  transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
                />
              </>
            ) : (
              <>
                {/* FOK — wychylony bom/szot, brzuch na zawietrzną */}
                <motion.path
                  d={sailBanana(jibTack.x, jibTack.y, jibClew.x, jibClew.y, 12, lee, 0.5)}
                  fill="none"
                  stroke="rgba(247,241,227,0.95)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  animate={{ d: sailBanana(jibTack.x, jibTack.y, jibClew.x, jibClew.y, 12, lee, 0.5) }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
                {/* bom foka */}
                <line x1={jibTack.x} y1={jibTack.y} x2={jibClew.x} y2={jibClew.y} stroke="#6b5124" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />

                {/* GROT — bom wychyla się od osi (fordewind: prostopadle) */}
                <line x1={mast.x} y1={mast.y} x2={mainClew.x} y2={mainClew.y} stroke="#3a2c14" strokeWidth="4" strokeLinecap="round" />
                <motion.path
                  d={sailBanana(mast.x, mast.y, mainClew.x, mainClew.y, 16, lee, 0.5)}
                  fill="none"
                  stroke="rgba(238,247,251,1)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  animate={{ d: sailBanana(mast.x, mast.y, mainClew.x, mainClew.y, 16, lee, 0.5) }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              </>
            )}
            {/* maszt */}
            <circle cx={mast.x} cy={mast.y} r="4" fill="#3a2c14" />

            {/* SIŁY */}
            {!isLuffing && (
              <>
                <Arrow x1={ceo.x} y1={ceo.y} x2={ceo.x} y2={ceo.y - driveLen} color="#1fa463" width={5} label="ciąg" />
                <Arrow x1={ceo.x} y1={ceo.y} x2={ceo.x + lee * heelLen} y2={ceo.y} color="#f4952b" width={5} label="przechył" />
                <Arrow x1={CX} y1={CY + 44} x2={CX - lee * (14 + forces.heel * 40)} y2={CY + 44} color="#489cc4" width={4} dashed />
              </>
            )}
          </g>
        </svg>

        {/* legenda sił */}
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-brine-100/80">
          <Term label={<span className="text-[#1fa463]">● siła ciągu</span>} title="Siła ciągu (napędowa)">
            <p>Składowa wypadkowej siły aerodynamicznej wzdłuż osi jachtu, do przodu. To ona napędza jacht. Największa na półwietrze i baksztagu.</p>
          </Term>
          <Term label={<span className="text-[#f4952b]">● siła przechyłu</span>} title="Siła przechylająca (boczna)">
            <p>Składowa boczna. Powoduje przechył i dryf. Na kursach ostrych do wiatru jest duża — dlatego jacht mocno się kładzie i wolniej płynie „pod wiatr”.</p>
          </Term>
          <Term label={<span className="text-[#489cc4]">● opór kilu</span>} title="Opór boczny (kil / miecz)">
            <p>Kil lub miecz pod wodą stawia opór ruchowi w bok i równoważy siłę przechylającą. Różnica kątów to <b>dryf</b> (leeway).</p>
          </Term>
          <Term label={<span className="text-[#7bbcd9]">● wiatr rzecz.</span>} title="Wiatr rzeczywisty vs pozorny">
            <p>
              <b>Rzeczywisty</b> (niebieska strzałka na obwodzie) — wiatr wiejący nad wodą. <b>Pozorny</b> (złota, mniejsza) — wiatr odczuwany na płynącym jachcie; zawsze przesunięty ku dziobowi. Żagle trymuje się do <b>pozornego</b>.
            </p>
          </Term>
        </div>
      </div>

      {/* PANEL */}
      <div className="space-y-5">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="chip" style={{ backgroundColor: pos.color + '22', color: pos.color, borderColor: pos.color + '55' }}>
              {pos.name}
            </span>
            <span className="text-xs text-brine-100/70">hals {tack === 'starboard' ? 'prawy' : 'lewy'}</span>
          </div>
          <p className="mt-2 text-sm text-brine-100/80">{pos.desc}</p>
        </div>

        <div className="card p-5 space-y-5">
          <Control icon={<RotateCcw className="h-4 w-4" />} label="Kurs jachtu" value={`${Math.round(heading)}° ${compassName(heading)}`} min={0} max={359} v={heading} onChange={setHeading} />
          <Control icon={<Wind className="h-4 w-4" />} label="Wiatr wieje z kierunku" value={`${Math.round(windFrom)}° ${compassName(windFrom)}`} min={0} max={359} v={windFrom} onChange={setWindFrom} />
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
            Kąt żagla do osi jachtu: <b className="text-brine-100">{Math.round(boom)}°</b> · wiatr pozorny ok. <b className="text-brine-100">{Math.round(app.awa)}°</b> od dziobu
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
