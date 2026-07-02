// Model uproszczonej, "edukacyjnej" fizyki żeglowania.
// Nie jest to dokładny solver aerodynamiczny — celem jest pokazanie
// zależności między wiatrem, kursem, trymem żagla i siłami działającymi na jacht.

export type Tack = 'port' | 'starboard'

export interface PointOfSail {
  key: string
  name: string
  short: string
  color: string
  desc: string
}

export const POINTS_OF_SAIL: PointOfSail[] = [
  {
    key: 'irons',
    name: 'Martwy kąt (łopot)',
    short: 'Martwy kąt',
    color: '#94a3b8',
    desc: 'Jacht ustawiony zbyt ostro do wiatru (ok. 0–35°). Żagle łopoczą, nie generują ciągu — jacht traci prędkość i sterowność.',
  },
  {
    key: 'closehauled',
    name: 'Bajdewind (ostry)',
    short: 'Bajdewind',
    color: '#e2454a',
    desc: 'Najostrzejszy kurs, na którym da się efektywnie żeglować (ok. 35–60°). Żagle wybrane mocno, jacht mocno się przechyla, dużo dryfu.',
  },
  {
    key: 'beamreach',
    name: 'Półwiatr',
    short: 'Półwiatr',
    color: '#1fa463',
    desc: 'Wiatr wieje mniej więcej z boku (ok. 60–100°). Zwykle najszybszy i najprzyjemniejszy kurs — dużo siły ciągu, umiarkowany przechył.',
  },
  {
    key: 'broadreach',
    name: 'Baksztag',
    short: 'Baksztag',
    color: '#2b7fab',
    desc: 'Wiatr wieje zza trawersu (ok. 100–160°). Żagle wybrane luźno, komfortowy i szybki kurs pełny.',
  },
  {
    key: 'running',
    name: 'Fordewind (z wiatrem)',
    short: 'Fordewind',
    color: '#7c5cff',
    desc: 'Wiatr wieje prosto w rufę (ok. 160–180°). Żagle wypuszczone maksymalnie, jacht "pcha" siła oporu. Uwaga na niekontrolowany zwrot (mimowolny gejba).',
  },
]

export function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360
}

/** Kąt wiatru pozornego/rzeczywistego względem dziobu, w zakresie 0–180°. */
export function angleOffBow(headingDeg: number, windFromDeg: number): number {
  const rel = normalizeDeg(windFromDeg - headingDeg)
  return rel > 180 ? 360 - rel : rel
}

/** Na którym halsie stoimy — z której burty wieje wiatr. */
export function tackOf(headingDeg: number, windFromDeg: number): Tack {
  const rel = normalizeDeg(windFromDeg - headingDeg)
  // 0–180 => wiatr z prawej burty (sterburta) => hals prawy (starboard)
  return rel < 180 ? 'starboard' : 'port'
}

export function pointOfSail(awa: number): PointOfSail {
  if (awa < 35) return POINTS_OF_SAIL[0]
  if (awa < 60) return POINTS_OF_SAIL[1]
  if (awa < 100) return POINTS_OF_SAIL[2]
  if (awa < 160) return POINTS_OF_SAIL[3]
  return POINTS_OF_SAIL[4]
}

/**
 * Kąt bomu względem osi jachtu (0 = w linii symetrii).
 * Reguła kciuka: żagiel wybieramy tak, aby zaczynał pracować bez łopotu —
 * w przybliżeniu połowa kąta wiatru pozornego, ograniczona do ok. 80°.
 */
export function boomAngle(awa: number): number {
  if (awa < 35) return Math.max(6, awa * 0.5) // martwy kąt: żagiel prawie w osi, łopocze
  return Math.min(80, Math.max(8, awa * 0.55))
}

/**
 * Uproszczony wiatr pozorny. Zakładamy stałą, poglądową prędkość jachtu
 * zależną od kursu. Zwraca kąt (od dziobu, 0–180) i względną siłę 0–1.
 */
export function apparentWind(awa: number, trueStrength: number) {
  const boat = boatSpeedFactor(awa) // 0..1
  const twaRad = (awa * Math.PI) / 180
  // składowe wiatru rzeczywistego w układzie jachtu
  const twx = -Math.cos(twaRad) * trueStrength // wzdłuż osi (dziób = +)
  const twy = Math.sin(twaRad) * trueStrength // w bok
  // jacht porusza się do przodu -> dodaje wiatru "od dziobu"
  const boatSpeed = boat * 0.9
  const awx = twx - boatSpeed
  const awy = twy
  const awaOut = (Math.atan2(Math.abs(awy), -awx) * 180) / Math.PI
  const strength = Math.min(1.2, Math.hypot(awx, awy))
  return { awa: awaOut, strength }
}

/** Poglądowy współczynnik prędkości jachtu (0–1) w funkcji kąta do wiatru. */
export function boatSpeedFactor(awa: number): number {
  if (awa < 32) return 0.05 // martwy kąt — prawie stój
  // krzywa zbliżona do "wykresu biegunowego" (polar): max ok. 90–110°
  const x = (awa - 32) / (180 - 32)
  const curve = Math.sin(Math.min(1, x * 1.35) * Math.PI) // szczyt ok. 100–110°
  const downwindFloor = awa > 150 ? 0.35 : 0 // fordewind wolniejszy niż półwiatr
  return Math.max(downwindFloor, Math.min(1, curve * 1.05))
}

export interface Forces {
  drive: number // siła ciągu (do przodu), 0–1
  heel: number // siła przechylająca/boczna, 0–1
  total: number // wypadkowa aerodynamiczna, 0–1
  speed: number // poglądowa prędkość, 0–1
}

/** Rozkład wypadkowej siły aerodynamicznej na ciąg i przechył. */
export function computeForces(awa: number, trueStrength: number): Forces {
  const isLuffing = awa < 32
  const app = apparentWind(awa, trueStrength)
  // Wypadkowa siła na żaglu — rośnie z siłą wiatru pozornego,
  // ale przy łopocie (martwy kąt) praktycznie zanika.
  const total = isLuffing ? 0.06 : Math.min(1, app.strength * 0.95)
  const awaRad = (awa * Math.PI) / 180
  // Ostro na wiatr: większość siły to przechył; z wiatrem: większość to ciąg.
  const drive = total * Math.pow(Math.sin(awaRad / 2 + 0.15), 1.1)
  const heel = total * Math.max(0, Math.cos(awaRad / 2 - 0.05))
  return {
    drive: clamp01(drive),
    heel: clamp01(heel),
    total: clamp01(total),
    speed: boatSpeedFactor(awa) * (0.6 + trueStrength * 0.4),
  }
}

export function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x))
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x))
}

/** Nazwa kierunku (róża wiatrów, 8 kierunków) dla podanego bearingu. */
export function compassName(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(normalizeDeg(deg) / 45) % 8]
}
