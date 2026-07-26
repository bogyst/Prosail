import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader, Term } from '../components/ui'

interface Beaufort {
  n: number
  name: string
  kts: string
  ms: string
  land: string
  sea: string
  wave: string
  color: string
}

const BEAUFORT: Beaufort[] = [
  { n: 0, name: 'Cisza', kts: '<1', ms: '0–0,2', land: 'Dym unosi się pionowo.', sea: 'Woda gładka jak lustro.', wave: '0 m', color: '#7bbcd9' },
  { n: 1, name: 'Powiew', kts: '1–3', ms: '0,3–1,5', land: 'Dym lekko się odchyla.', sea: 'Drobne zmarszczki bez piany.', wave: '0,1 m', color: '#63b2cf' },
  { n: 2, name: 'Słaby wiatr', kts: '4–6', ms: '1,6–3,3', land: 'Czuć wiatr na twarzy, szeleszczą liście.', sea: 'Krótkie, wyraźne fale, grzbiety szkliste.', wave: '0,2 m', color: '#54a9c9' },
  { n: 3, name: 'Łagodny wiatr', kts: '7–10', ms: '3,4–5,4', land: 'Liście i gałązki w ruchu, flaga się rozwija.', sea: 'Fale z pierwszymi „barankami”.', wave: '0,6 m', color: '#46a0c2' },
  { n: 4, name: 'Umiarkowany', kts: '11–16', ms: '5,5–7,9', land: 'Unosi kurz i papier, poruszają się gałęzie.', sea: 'Fale dłuższe, częste barankki.', wave: '1 m', color: '#e0b64a' },
  { n: 5, name: 'Dość silny', kts: '17–21', ms: '8,0–10,7', land: 'Kołyszą się małe drzewa.', sea: 'Umiarkowane fale, dużo piany, pył wodny.', wave: '2 m', color: '#e0a23f' },
  { n: 6, name: 'Silny wiatr', kts: '22–27', ms: '10,8–13,8', land: 'Poruszają się grube gałęzie, gwiżdże w olinowaniu.', sea: 'Duże fale, grzywacze, wyraźny pył.', wave: '3 m', color: '#e08a37' },
  { n: 7, name: 'Bardzo silny', kts: '28–33', ms: '13,9–17,1', land: 'Całe drzewa w ruchu, trudno iść pod wiatr.', sea: 'Morze się piętrzy, piana układa się w smugi.', wave: '4 m', color: '#dd6f31' },
  { n: 8, name: 'Sztorm', kts: '34–40', ms: '17,2–20,7', land: 'Łamią się gałęzie, bardzo trudno iść.', sea: 'Wysokie fale, grzbiety rozwiewane w pył.', wave: '5,5 m', color: '#d4542c' },
  { n: 9, name: 'Silny sztorm', kts: '41–47', ms: '20,8–24,4', land: 'Drobne uszkodzenia budynków (dachówki).', sea: 'Bardzo wysokie fale, gęsta piana, ograniczona widzialność.', wave: '7 m', color: '#c53f2b' },
  { n: 10, name: 'Bardzo silny sztorm', kts: '48–55', ms: '24,5–28,4', land: 'Wyrywane drzewa, znaczne szkody.', sea: 'Ogromne fale, morze białe od piany.', wave: '9 m', color: '#b1302a' },
  { n: 11, name: 'Gwałtowny sztorm', kts: '56–63', ms: '28,5–32,6', land: 'Rozległe zniszczenia.', sea: 'Wyjątkowo wysokie fale, widzialność mocno ograniczona.', wave: '11 m', color: '#992628' },
  { n: 12, name: 'Huragan', kts: '≥64', ms: '≥32,7', land: 'Katastrofalne zniszczenia.', sea: 'Powietrze pełne piany i pyłu, morze białe.', wave: '≥14 m', color: '#7a1f24' },
]

const CLOUDS = [
  {
    name: 'Cirrus (Ci)',
    level: 'Wysokie (>6 km)',
    look: 'Delikatne, włókniste „pióra” z kryształków lodu.',
    weather: 'Zwiastują nadejście ciepłego frontu — pogoda może się psuć w ciągu 12–24 h.',
    emoji: '🪶',
  },
  {
    name: 'Cumulus (Cu)',
    level: 'Niskie/średnie',
    look: 'Białe, kłębiaste „kalafiory” o płaskiej podstawie.',
    weather: 'Ładna pogoda (cumulus humilis). Rozbudowa w pionie zapowiada niestabilność.',
    emoji: '☁️',
  },
  {
    name: 'Cumulonimbus (Cb)',
    level: 'Pionowo rozbudowana',
    look: 'Potężna chmura burzowa z „kowadłem” na szczycie.',
    weather: 'Burze, ulewy, grad, gwałtowne szkwały i porywy — najgroźniejsza dla żeglarza!',
    emoji: '⛈️',
  },
  {
    name: 'Stratus (St)',
    level: 'Niskie (<2 km)',
    look: 'Jednolita, szara warstwa jak mgła nad ziemią.',
    weather: 'Zachmurzenie, mżawka, ograniczona widzialność. Wiatr zwykle słaby.',
    emoji: '🌫️',
  },
  {
    name: 'Nimbostratus (Ns)',
    level: 'Niskie/średnie',
    look: 'Gruba, ciemnoszara warstwa bez wyraźnej struktury.',
    weather: 'Ciągły, długotrwały deszcz lub śnieg — typowa dla frontu ciepłego.',
    emoji: '🌧️',
  },
  {
    name: 'Stratocumulus (Sc)',
    level: 'Niskie',
    look: 'Szaro‑białe „bałwanki” ułożone w płaty lub rzędy.',
    weather: 'Zmienne zachmurzenie, zwykle bez opadów lub słaba mżawka.',
    emoji: '🌥️',
  },
]

export default function Meteorologia() {
  const [b, setB] = useState(4)
  const cur = BEAUFORT[b]

  return (
    <div>
      <PageHeader eyebrow="Meteorologia" title="Wiatr, fale i chmury">
        Pogoda to najważniejszy „silnik” i największe ryzyko na wodzie. Poznaj{' '}
        <Term label="skalę Beauforta" title="Skala Beauforta">
          <p>
            12‑stopniowa skala opisująca siłę wiatru na podstawie jego skutków —
            opracowana w 1805 r. przez admirała Francisa Beauforta. Pozwala ocenić
            wiatr „na oko”, bez przyrządów, obserwując morze i otoczenie.
          </p>
        </Term>{' '}
        i naucz się rozpoznawać chmury zapowiadające zmianę pogody.
      </PageHeader>

      {/* SKALA BEAUFORTA */}
      <div className="card overflow-hidden p-0">
        <div
          className="relative px-6 py-8 transition-colors duration-500"
          style={{ background: `linear-gradient(160deg, ${cur.color}33, transparent)` }}
        >
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
            {/* wizualizacja: flaga + fale */}
            <div className="mx-auto">
              <svg viewBox="0 0 200 200" className="w-52">
                {/* fale */}
                {[0, 1, 2].map((row) => (
                  <motion.path
                    key={row}
                    d={wavePath(150 + row * 16, b)}
                    fill="none"
                    stroke={cur.color}
                    strokeWidth={2.5}
                    opacity={0.5 + row * 0.15}
                    animate={{ x: [0, -20, 0] }}
                    transition={{ duration: Math.max(1.2, 5 - b * 0.3), repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}
                {/* maszt + flaga */}
                <line x1="60" y1="30" x2="60" y2="152" stroke="#c9a15a" strokeWidth="4" strokeLinecap="round" />
                <circle cx="60" cy="34" r="3" fill="#c9a15a" />
                <motion.path
                  d={flagPath(b, 0)}
                  fill={cur.color}
                  stroke="#0f2b3f"
                  strokeWidth="1"
                  strokeLinejoin="round"
                  animate={{
                    d: [0, 0.5, 1, 1.5, 2].map((k) => flagPath(b, k * Math.PI)),
                  }}
                  transition={{ duration: Math.max(0.35, 2.4 - b * 0.17), repeat: Infinity, ease: 'linear' }}
                />
              </svg>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-6xl font-700 text-navy">{cur.n}</span>
                <div>
                  <div className="font-display text-2xl font-700 text-navy">{cur.name}</div>
                  <div className="text-sm text-brine-100/70">
                    {cur.kts} kn · {cur.ms} m/s · fala ok. {cur.wave}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Na morzu</div>
                  <p className="mt-1 text-sm text-brine-100/90">{cur.sea}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Na lądzie</div>
                  <p className="mt-1 text-sm text-brine-100/90">{cur.land}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <input
            type="range"
            min={0}
            max={12}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 flex justify-between text-[10px] text-brine-100/50">
            {BEAUFORT.map((x) => (
              <button key={x.n} onClick={() => setB(x.n)} className="tabular-nums hover:text-navy">
                {x.n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHMURY */}
      <h2 className="mb-4 mt-12 font-display text-2xl font-700 text-navy">Rodzaje chmur</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CLOUDS.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-5"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{c.emoji}</span>
              <div>
                <h3 className="font-display text-lg font-700 text-navy">{c.name}</h3>
                <div className="text-xs text-brine-100/60">{c.level}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-brine-100/85">{c.look}</p>
            <p className="mt-2 rounded-lg bg-white/5 p-2 text-sm text-brine-100/90">
              <b className="text-brine-200">Pogoda: </b>
              {c.weather}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="card mt-6 p-6 text-sm text-brine-100/85">
        <h3 className="font-display text-lg font-700 text-navy">Reguły kciuka na wodzie</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li>🌡️ Gwałtowny spadek ciśnienia = zbliża się załamanie pogody.</li>
          <li>⛈️ Ciemniejąca, piętrząca się chmura Cb od zawietrznej = szykuj się na szkwał, refuj wcześniej.</li>
          <li>🌬️ Wiatr skręcający zgodnie z ruchem wskazówek zegara na półkuli N = przejście frontu.</li>
          <li>🌅 „Czerwone niebo o poranku — żeglarza ostrzeżenie”.</li>
        </ul>
      </div>
    </div>
  )
}

function wavePath(y: number, b: number) {
  const amp = 2 + b * 1.1
  const pts: string[] = [`M -20 ${y}`]
  for (let x = -20; x <= 220; x += 20) {
    pts.push(`Q ${x + 10} ${y - amp} ${x + 20} ${y}`)
  }
  return pts.join(' ')
}

// Flaga: przy ciszy (b=0) opada pionowo w dół, przy słabym wietrze lekko się
// unosi, a przy silnym wietrze wypręża do poziomu i mocniej łopocze.
function flagPath(b: number, phase: number) {
  const Ox = 60
  const Oy = 38
  const L = 70
  const t = Math.min(1, Math.max(0, b / 6)) // 0 = cisza, 1 = poziomo (ok. 6°B)
  const theta = ((90 * (1 - t)) * Math.PI) / 180 // 90° w dół przy ciszy, 0° przy silnym
  // amplituda łopotu rośnie z siłą wiatru (fala biegnie wzdłuż flagi)
  const amp = Math.max(0, Math.min(12, b * 1.5)) * (0.3 + 0.7 * t)
  const w1 = amp * 0.45 * Math.sin(phase + Math.PI * 0.9)
  const w2 = amp * Math.sin(phase)
  const local: [number, number][] = [
    [0, -7],
    [L * 0.5, -7 + w1],
    [L, -6 + w2],
    [L, 7 + w2],
    [L * 0.5, 7 + w1],
    [0, 7],
  ]
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  const pts = local.map(([x, y]) => {
    const rx = x * cos - y * sin
    const ry = x * sin + y * cos
    return `${(Ox + rx).toFixed(1)} ${(Oy + ry).toFixed(1)}`
  })
  return 'M ' + pts.join(' L ') + ' Z'
}
