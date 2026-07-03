import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  angleOffBow,
  boomAngle,
  computeForces,
  normalizeDeg,
  pointOfSail,
  tackOf,
  apparentWind,
} from '../../lib/sailing'
import { Term, StatBar } from '../ui'
import { RotateCcw } from 'lucide-react'

const CX = 200
const CY = 200
const R = 155

// kąt (0 = góra sceny, zgodnie ze wskazówkami) -> wektor SVG (y w dół)
function polar(deg: number, len: number) {
  const r = (deg * Math.PI) / 180
  return { x: Math.sin(r) * len, y: -Math.cos(r) * len }
}

// obrót punktu wokół środka sceny (zgodnie z SVG rotate)
function rot(x: number, y: number, deg: number) {
  const r = (deg * Math.PI) / 180
  const dx = x - CX
  const dy = y - CY
  return { x: CX + dx * Math.cos(r) - dy * Math.sin(r), y: CY + dx * Math.sin(r) + dy * Math.cos(r) }
}

// łuk „banana” żagla; brzuch wygina się w stronę wektora (refx,refy) — zawsze na zawietrzną
function sailBanana(x1: number, y1: number, x2: number, y2: number, belly: number, refx: number, refy: number) {
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
  let d = `M ${x1} ${y1}`
  for (let i = 1; i <= 8; i++) {
    const t = i / 8
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
  // Wiatr wieje ZAWSZE z góry. Sterujemy tylko kursem jachtu (obrotem).
  const [heading, setHeading] = useState(50)
  const [windKts, setWindKts] = useState(12)

  const trueStrength = 0.3 + Math.min(1, windKts / 25) * 0.9

  const awa = angleOffBow(heading, 0) // wiatr z kierunku 0 (góra)
  const tack = tackOf(heading, 0)
  const pos = pointOfSail(awa)
  const boom = boomAngle(awa)
  const forces = computeForces(awa, trueStrength)
  const app = apparentWind(awa, trueStrength)
  const isLuffing = awa < 32
  const lee = tack === 'starboard' ? -1 : 1 // strona zawietrzna w osi X lokalnej (−x = lewa burta)

  // kierunek „z wiatrem” (zawietrzny) w układzie lokalnym jachtu — do wyginania żagli
  const hr = (heading * Math.PI) / 180
  const refx = Math.sin(hr)
  const refy = Math.cos(hr)

  // bearing wiatru pozornego na scenie (między górą=wiatr a dziobem=heading)
  const appBearing = heading <= 180 ? normalizeDeg(heading - app.awa) : normalizeDeg(heading + app.awa)

  // Czysty fordewind -> tryb „motylek”: grot i fok na przeciwnych burtach.
  const butterfly = awa > 168 && !isLuffing
  const mainAngle = butterfly ? 90 : boom
  const jibAngle = butterfly ? 90 : boom * 0.95
  const jibLee = butterfly ? -lee : lee // fok „wystawiony” na nawietrzną

  // geometria ożaglowania (układ lokalny, dziób = góra)
  const bM = (mainAngle * Math.PI) / 180
  const bJ = (jibAngle * Math.PI) / 180
  const mast = { x: CX, y: CY - 30 }
  const Lmain = butterfly ? 80 : 88
  const mainClew = { x: mast.x + lee * Lmain * Math.sin(bM), y: mast.y + Lmain * Math.cos(bM) }
  const jibTack = { x: CX, y: CY - 86 }
  const Ljib = butterfly ? 80 : 58
  const jibClew = { x: jibTack.x + jibLee * Ljib * Math.sin(bJ), y: jibTack.y + Ljib * Math.cos(bJ) }
  const mainBelly = butterfly ? 8 : 15
  const jibBelly = butterfly ? 8 : 11

  const ceo = { x: CX, y: CY - 8 }
  const driveLen = 20 + forces.drive * 95
  const heelLen = 18 + forces.heel * 80

  function setRelative(targetAwa: number) {
    setHeading(targetAwa)
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

          {/* strefa martwego kąta — na górze, wokół wiatru */}
          <path
            d={`M ${CX} ${CY} L ${CX + polar(-32, R).x} ${CY + polar(-32, R).y} A ${R} ${R} 0 0 1 ${CX + polar(32, R).x} ${CY + polar(32, R).y} Z`}
            fill="rgba(226,69,74,0.1)"
            stroke="rgba(226,69,74,0.28)"
            strokeDasharray="4 4"
          />

          {/* WIATR — małe strzałki u góry pokazujące, że wieje z góry */}
          {[-46, 0, 46].map((dx) => (
            <g key={dx}>
              <line x1={CX + dx} y1={20} x2={CX + dx} y2={46} stroke="#7bbcd9" strokeWidth="3" strokeLinecap="round" />
              <polygon points={`${CX + dx},${52} ${CX + dx - 5},${43} ${CX + dx + 5},${43}`} fill="#7bbcd9" />
            </g>
          ))}
          <text x={CX} y={14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#7bbcd9">
            WIATR ({Math.round(windKts)} kn)
          </text>

          {/* WIATR POZORNY — ruchoma strzałka bliżej dziobu */}
          {!isLuffing && (
            <>
              <Arrow
                x1={CX + polar(appBearing, R - 8).x}
                y1={CY + polar(appBearing, R - 8).y}
                x2={CX + polar(appBearing, R - 46).x}
                y2={CY + polar(appBearing, R - 46).y}
                color="#c9a15a"
                width={3.5}
                head={10}
              />
              <text x={CX + polar(appBearing, R + 4).x} y={CY + polar(appBearing, R + 4).y + 3} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#c9a15a">
                pozorny
              </text>
            </>
          )}

          {/* JACHT — obraca się zgodnie z kursem, wiatr pozostaje z góry */}
          <g transform={`rotate(${heading} ${CX} ${CY})`}>
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
                {/* ŁOPOT — same żagle jako falujące linie */}
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
                {/* FOK — sam żagiel, brzuch na zawietrzną */}
                <motion.path
                  d={sailBanana(jibTack.x, jibTack.y, jibClew.x, jibClew.y, jibBelly, refx, refy)}
                  fill="none"
                  stroke="rgba(247,241,227,0.95)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  animate={{ d: sailBanana(jibTack.x, jibTack.y, jibClew.x, jibClew.y, jibBelly, refx, refy) }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
                {/* GROT — sam żagiel */}
                <motion.path
                  d={sailBanana(mast.x, mast.y, mainClew.x, mainClew.y, mainBelly, refx, refy)}
                  fill="none"
                  stroke="rgba(238,247,251,1)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  animate={{ d: sailBanana(mast.x, mast.y, mainClew.x, mainClew.y, mainBelly, refx, refy) }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              </>
            )}
            {/* maszt */}
            <circle cx={mast.x} cy={mast.y} r="3.5" fill="#3a2c14" />
          </g>

          {/* SIŁY — poza obracaną grupą, aby etykiety pozostały czytelne */}
          {!isLuffing &&
            (() => {
              const dOrigin = rot(ceo.x, ceo.y, heading)
              const dTip = rot(ceo.x, ceo.y - driveLen, heading)
              const hTip = rot(ceo.x + lee * heelLen, ceo.y, heading)
              const kO = rot(CX, CY + 44, heading)
              const kTip = rot(CX - lee * (14 + forces.heel * 40), CY + 44, heading)
              return (
                <>
                  <Arrow x1={dOrigin.x} y1={dOrigin.y} x2={dTip.x} y2={dTip.y} color="#1fa463" width={5} label="ciąg" />
                  <Arrow x1={dOrigin.x} y1={dOrigin.y} x2={hTip.x} y2={hTip.y} color="#f4952b" width={5} label="przechył" />
                  <Arrow x1={kO.x} y1={kO.y} x2={kTip.x} y2={kTip.y} color="#489cc4" width={4} dashed />
                </>
              )
            })()}
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
          <Term label={<span className="text-[#c9a15a]">● wiatr pozorny</span>} title="Wiatr rzeczywisty vs pozorny">
            <p>
              Wiatr <b>rzeczywisty</b> wieje z góry (małe niebieskie strzałki). Wiatr <b>pozorny</b> (złota strzałka) — odczuwany na płynącym jachcie — jest zawsze przesunięty ku dziobowi. Żagle trymuje się do <b>pozornego</b>.
            </p>
          </Term>
        </div>
      </div>

      {/* PANEL */}
      <div className="space-y-5">
        <div className="card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip" style={{ backgroundColor: pos.color + '22', color: pos.color, borderColor: pos.color + '55' }}>
              {pos.name}
            </span>
            {butterfly && (
              <span className="chip" style={{ backgroundColor: '#7c5cff22', color: '#b9a9ff', borderColor: '#7c5cff55' }}>
                🦋 motylek
              </span>
            )}
            <span className="ml-auto text-xs text-brine-100/70">hals {tack === 'starboard' ? 'prawy' : 'lewy'}</span>
          </div>
          <p className="mt-2 text-sm text-brine-100/80">
            {butterfly
              ? 'Czysty fordewind w trybie „motylek”: grot i fok wystawione na przeciwne burty, aby złapać jak najwięcej wiatru z rufy. Uwaga na niekontrolowany zwrot przez rufę.'
              : pos.desc}
          </p>
        </div>

        <div className="card p-5 space-y-5">
          <Control icon={<RotateCcw className="h-4 w-4" />} label="Kurs jachtu (obrót)" value={`${Math.round(heading)}°`} min={0} max={359} v={heading} onChange={setHeading} />
          <Control label="Siła wiatru" value={`${Math.round(windKts)} kn`} min={2} max={30} v={windKts} onChange={setWindKts} />
          <div>
            <div className="mb-2 text-xs text-brine-100/70">Szybko ustaw kurs względem wiatru:</div>
            <div className="flex flex-wrap gap-2">
              {[
                ['Bajdewind', 45],
                ['Półwiatr', 90],
                ['Baksztag', 135],
                ['Fordewind', 180],
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
