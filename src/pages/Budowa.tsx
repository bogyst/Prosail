import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui'
import { Sailboat, Anchor } from 'lucide-react'

type Group = 'rig' | 'hull'

interface Part {
  id: string
  name: string
  group: Group
  desc: string
  ax: number // punkt zaczepienia (do markera po wyborze)
  ay: number
}

const PARTS: Part[] = [
  // — OŻAGLOWANIE —
  { id: 'mast', name: 'Maszt', group: 'rig', ax: 306, ay: 120, desc: 'Pionowy słup dźwigający żagle. Utrzymywany pionowo przez olinowanie stałe (sztagi i wanty).' },
  { id: 'boom', name: 'Bom', group: 'rig', ax: 240, ay: 276, desc: 'Pozioma belka u dołu grota, zamocowana do masztu. Grotszotem reguluje się kąt ustawienia grota.' },
  { id: 'main', name: 'Grot', group: 'rig', ax: 258, ay: 165, desc: 'Główny żagiel, rozpięty między masztem (lik przedni) a bomem (lik dolny). Daje większość siły napędowej.' },
  { id: 'jib', name: 'Fok / Genua', group: 'rig', ax: 392, ay: 205, desc: 'Przedni żagiel rozpięty na sztagu. Współpracuje z grotem — szczelina między nimi przyspiesza opływ powietrza.' },
  { id: 'forestay', name: 'Sztag', group: 'rig', ax: 404, ay: 150, desc: 'Lina olinowania stałego biegnąca od topu masztu do dziobu. Trzyma maszt od przodu; mocuje się do niej fok.' },
  { id: 'backstay', name: 'Achtersztag', group: 'rig', ax: 200, ay: 165, desc: 'Lina od topu masztu do rufy. Podtrzymuje maszt od tyłu i pozwala regulować jego wygięcie.' },
  { id: 'shroud', name: 'Wanty', group: 'rig', ax: 300, ay: 220, desc: 'Liny podtrzymujące maszt z lewej i prawej burty. Rozparte na salingach, zamocowane do burt.' },
  { id: 'spreader', name: 'Saling', group: 'rig', ax: 306, ay: 150, desc: 'Poprzeczka na maszcie odchylająca wanty, aby skuteczniej podpierały maszt na boki.' },

  // — ELEMENTY STAŁE —
  { id: 'hull', name: 'Kadłub', group: 'hull', ax: 250, ay: 314, desc: 'Główny korpus jachtu nadający pływalność. Część nad wodą to nadwodzie, pod wodą — podwodzie.' },
  { id: 'deck', name: 'Pokład', group: 'hull', ax: 320, ay: 289, desc: 'Górna powierzchnia kadłuba, po której się chodzi. Jego krawędź nadaje charakterystyczną linię (sheer).' },
  { id: 'bow', name: 'Dziób', group: 'hull', ax: 462, ay: 292, desc: 'Przednia część kadłuba. Tnie falę i nadaje kierunek. Przeciwieństwo rufy.' },
  { id: 'stern', name: 'Rufa / pawęż', group: 'hull', ax: 118, ay: 312, desc: 'Tylna część kadłuba. Płaska ścianka na końcu to pawęż; tu często mocowany jest ster.' },
  { id: 'keel', name: 'Kil (balast)', group: 'hull', ax: 296, ay: 405, desc: 'Ciężka płetwa pod kadłubem. Obniża środek ciężkości (chroni przed wywrotką) i daje opór boczny przeciw dryfowi.' },
  { id: 'rudder', name: 'Ster (płetwa)', group: 'hull', ax: 114, ay: 366, desc: 'Płetwa sterowa zamontowana pionowo przy pawęży (na końcu rufy). Wychylana, zmienia kierunek płynięcia jachtu.' },
  { id: 'tiller', name: 'Rumpel', group: 'hull', ax: 160, ay: 309, desc: 'Drążek połączony z głowicą steru, prowadzony poziomo do kokpitu. Steruje nim sternik; w większych jachtach zastąpiony kołem.' },
  { id: 'cockpit', name: 'Kokpit', group: 'hull', ax: 196, ay: 300, desc: 'Zagłębienie w pokładzie, w którym siedzi załoga i obsługuje szoty oraz ster.' },
  { id: 'waterline', name: 'Linia wodna', group: 'hull', ax: 400, ay: 330, desc: 'Linia styku kadłuba z wodą przy normalnym zanurzeniu. Oddziela nadwodzie od podwodzia.' },
]

const ACCENT = '#f4c430'
const LINE = '#22384a'
const WL = 330

export default function Budowa() {
  const [group, setGroup] = useState<Group>('rig')
  const [clicked, setClicked] = useState<string | null>('mast')
  const [hover, setHover] = useState<string | null>(null)

  const active = hover ?? clicked
  const list = PARTS.filter((p) => p.group === group)
  const activePart = PARTS.find((p) => p.id === active) ?? null

  const on = (id: string) => active === id
  // atrybuty dla linii olinowania
  const rig = (id: string, w = 2) =>
    on(id)
      ? { stroke: ACCENT, strokeWidth: w + 1.5, filter: 'url(#glow)' }
      : { stroke: '#8aa0ad', strokeWidth: w }
  // atrybuty dla obrysów wypełnionych kształtów
  const edge = (id: string, base = LINE, w = 2) =>
    on(id) ? { stroke: ACCENT, strokeWidth: w + 1.5, filter: 'url(#glow)' } : { stroke: base, strokeWidth: w }
  const sailFill = (id: string, base: string) => (on(id) ? '#fff6da' : base)

  function switchGroup(g: Group) {
    setGroup(g)
    setClicked(PARTS.find((p) => p.group === g)!.id)
    setHover(null)
  }

  return (
    <div>
      <PageHeader eyebrow="Budowa jachtu" title="Anatomia slupa">
        Slup to najpopularniejszy typ ożaglowania — jeden maszt, grot i fok. Wybierz część z
        listy (lub kliknij ją na rysunku), a podświetli się na schemacie. Przełączaj się między
        <b> ożaglowaniem</b> a <b>elementami stałymi</b> kadłuba.
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1fr_330px]">
        {/* RYSUNEK */}
        <div className="card p-4">
          <svg viewBox="0 0 560 470" className="w-full">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c2537" />
                <stop offset="100%" stopColor="#0a1c2b" />
              </linearGradient>
              <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(43,127,171,0.28)" />
                <stop offset="100%" stopColor="rgba(43,127,171,0.06)" />
              </linearGradient>
              {/* region w jednostkach płótna — inaczej płaskie/pionowe linie są przycinane */}
              <filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="560" height="470">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={ACCENT} floodOpacity="0.95" />
              </filter>
            </defs>

            <rect x="0" y="0" width="560" height="470" rx="16" fill="url(#sky)" />
            {/* woda */}
            <rect x="0" y={WL} width="560" height={470 - WL} fill="url(#water)" />

            {/* olinowanie stałe (rysowane pod żaglami) */}
            <line x1="306" y1="54" x2="468" y2="288" onClick={() => setClicked('forestay')} style={{ cursor: 'pointer' }} {...rig('forestay')} />
            <line x1="306" y1="54" x2="118" y2="298" onClick={() => setClicked('backstay')} style={{ cursor: 'pointer' }} {...rig('backstay')} />
            {/* wanty + saling */}
            <polyline points="306,96 324,150 300,290" fill="none" onClick={() => setClicked('shroud')} style={{ cursor: 'pointer' }} {...rig('shroud', 1.6)} />
            <line x1="288" y1="150" x2="326" y2="150" onClick={() => setClicked('spreader')} style={{ cursor: 'pointer' }} {...rig('spreader', 2.2)} />

            {/* KADŁUB */}
            <g onClick={() => setClicked('hull')} style={{ cursor: 'pointer' }}>
              <path
                d="M115 297 C 210 287, 360 281, 468 288 C 477 302, 470 320, 452 331 C 430 353, 250 360, 150 350 C 129 346, 116 331, 115 297 Z"
                fill="#e8edf2"
                {...edge('hull')}
              />
              {/* podwodzie (antifouling) */}
              <clipPath id="hullclip">
                <path d="M115 297 C 210 287, 360 281, 468 288 C 477 302, 470 320, 452 331 C 430 353, 250 360, 150 350 C 129 346, 116 331, 115 297 Z" />
              </clipPath>
              <rect x="110" y={WL} width="370" height="40" fill="#b0473a" clipPath="url(#hullclip)" opacity="0.9" />
              <rect x="110" y={WL - 5} width="370" height="5" fill="#1f3346" clipPath="url(#hullclip)" />
            </g>

            {/* POKŁAD (linia sheer) */}
            <path
              d="M115 297 C 210 287, 360 281, 468 288"
              fill="none"
              onClick={() => setClicked('deck')}
              style={{ cursor: 'pointer' }}
              {...edge('deck', '#c9b487', 3)}
            />
            {/* KOKPIT */}
            <path d="M158 293 L214 291 L208 305 L166 306 Z" fill="#0f2233" onClick={() => setClicked('cockpit')} style={{ cursor: 'pointer' }} {...edge('cockpit', '#33506a', 1.5)} />

            {/* DZIÓB (marker krawędzi) */}
            <path d="M452 331 C 470 320, 477 302, 468 288" fill="none" onClick={() => setClicked('bow')} style={{ cursor: 'pointer' }} {...edge('bow', 'transparent', 3)} />
            {/* RUFA / PAWĘŻ */}
            <path d="M115 297 C 116 331, 129 346, 150 350" fill="none" onClick={() => setClicked('stern')} style={{ cursor: 'pointer' }} {...edge('stern', 'transparent', 3)} />

            {/* LINIA WODNA */}
            <line x1="20" y1={WL} x2="540" y2={WL} strokeDasharray="7 7" onClick={() => setClicked('waterline')} style={{ cursor: 'pointer' }} {...(on('waterline') ? { stroke: ACCENT, strokeWidth: 3, filter: 'url(#glow)' } : { stroke: 'rgba(123,188,217,0.5)', strokeWidth: 1.5 })} />

            {/* KIL */}
            <path d="M276 352 L268 424 Q264 432 274 433 L318 433 Q328 432 322 424 L312 352 Z" fill="#2a4258" onClick={() => setClicked('keel')} style={{ cursor: 'pointer' }} {...edge('keel')} />
            {/* STER (płetwa) — pionowo, zamontowany przy pawęży (na rufie) */}
            <path d="M108 322 L106 400 Q106 409 115 408 L122 406 L123 322 Z" fill="#2a4258" onClick={() => setClicked('rudder')} style={{ cursor: 'pointer' }} {...edge('rudder')} />
            {/* RUMPEL — poziomo z kokpitu do głowicy steru */}
            <line x1="114" y1="314" x2="203" y2="304" strokeLinecap="round" onClick={() => setClicked('tiller')} style={{ cursor: 'pointer' }} {...(on('tiller') ? { stroke: ACCENT, strokeWidth: 5, filter: 'url(#glow)' } : { stroke: '#6b5124', strokeWidth: 4 })} />

            {/* BOM */}
            <line x1="306" y1="272" x2="180" y2="268" strokeLinecap="round" onClick={() => setClicked('boom')} style={{ cursor: 'pointer' }} {...(on('boom') ? { stroke: ACCENT, strokeWidth: 7, filter: 'url(#glow)' } : { stroke: '#3a2c14', strokeWidth: 5.5 })} />

            {/* GROT */}
            <path d="M306 58 L306 272 L182 268 Z" onClick={() => setClicked('main')} style={{ cursor: 'pointer' }} fill={sailFill('main', 'rgba(244,240,230,0.96)')} {...edge('main', LINE, 1.5)} />
            {/* FOK */}
            <path d="M306 74 L452 284 L356 236 Z" onClick={() => setClicked('jib')} style={{ cursor: 'pointer' }} fill={sailFill('jib', 'rgba(233,240,247,0.92)')} {...edge('jib', LINE, 1.5)} />

            {/* MASZT */}
            <line x1="306" y1="290" x2="306" y2="52" strokeLinecap="round" onClick={() => setClicked('mast')} style={{ cursor: 'pointer' }} {...(on('mast') ? { stroke: ACCENT, strokeWidth: 8, filter: 'url(#glow)' } : { stroke: '#c9a15a', strokeWidth: 6 })} />
            <circle cx="306" cy="52" r="4" fill={on('mast') ? ACCENT : '#c9a15a'} />

            {/* marker aktywnej części */}
            {activePart && (
              <motion.circle
                key={activePart.id}
                cx={activePart.ax}
                cy={activePart.ay}
                r="8"
                fill="none"
                stroke={ACCENT}
                strokeWidth="2.5"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1, 1.35, 1], opacity: 1 }}
                transition={{ scale: { duration: 1.4, repeat: Infinity }, opacity: { duration: 0.2 } }}
              />
            )}
          </svg>
        </div>

        {/* PANEL */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* podzakładki */}
          <div className="inline-flex w-full rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => switchGroup('rig')}
              className={`btn flex-1 justify-center px-3 py-1.5 text-sm ${group === 'rig' ? 'bg-brine-500 text-white' : 'text-brine-100'}`}
            >
              <Sailboat className="h-4 w-4" />
              Ożaglowanie
            </button>
            <button
              onClick={() => switchGroup('hull')}
              className={`btn flex-1 justify-center px-3 py-1.5 text-sm ${group === 'hull' ? 'bg-brine-500 text-white' : 'text-brine-100'}`}
            >
              <Anchor className="h-4 w-4" />
              Elementy stałe
            </button>
          </div>

          {/* lista części (nad opisem — najechanie nie przesuwa listy) */}
          <div className="card p-2">
            {list.map((p) => (
              <button
                key={p.id}
                onClick={() => setClicked(p.id)}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  active === p.id ? 'bg-brine-500/25 text-white' : 'text-brine-100 hover:bg-white/5'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: active === p.id ? ACCENT : 'rgba(123,188,217,0.5)' }}
                />
                {p.name}
              </button>
            ))}
          </div>

          {/* opis aktywnej części (pod listą) */}
          <motion.div key={activePart?.id ?? 'none'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
            {activePart ? (
              <>
                <h3 className="font-display text-xl font-700 text-white">{activePart.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brine-100/90">{activePart.desc}</p>
              </>
            ) : (
              <p className="text-sm text-brine-100/80">Najedź lub kliknij część na liście, aby ją podświetlić.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
