import { motion } from 'framer-motion'

export type Group = 'rig' | 'running' | 'hull'

export interface Part {
  id: string
  name: string
  group: Group
  desc: string
  ax: number // punkt zaczepienia (do markera po wyborze)
  ay: number
}

export const PARTS: Part[] = [
  // — OŻAGLOWANIE —
  { id: 'mast', name: 'Maszt', group: 'rig', ax: 306, ay: 120, desc: 'Pionowy słup dźwigający żagle. Utrzymywany pionowo przez olinowanie stałe (sztagi i wanty).' },
  { id: 'boom', name: 'Bom', group: 'rig', ax: 240, ay: 276, desc: 'Pozioma belka u dołu grota, zamocowana do masztu. Grotszotem reguluje się kąt ustawienia grota.' },
  { id: 'main', name: 'Grot', group: 'rig', ax: 258, ay: 165, desc: 'Główny żagiel, rozpięty między masztem (lik przedni) a bomem (lik dolny). Daje większość siły napędowej.' },
  { id: 'jib', name: 'Fok / Genua', group: 'rig', ax: 392, ay: 205, desc: 'Przedni żagiel rozpięty na sztagu. Współpracuje z grotem — szczelina między nimi przyspiesza opływ powietrza.' },
  { id: 'forestay', name: 'Sztag', group: 'rig', ax: 404, ay: 150, desc: 'Lina olinowania stałego biegnąca od topu masztu do dziobu. Trzyma maszt od przodu; mocuje się do niej fok.' },
  { id: 'backstay', name: 'Achtersztag', group: 'rig', ax: 200, ay: 165, desc: 'Lina od topu masztu do rufy. Podtrzymuje maszt od tyłu i pozwala regulować jego wygięcie.' },
  { id: 'shroud', name: 'Wanty', group: 'rig', ax: 314, ay: 130, desc: 'Liny podtrzymujące maszt z lewej i prawej burty. Rozparte na salingach, zamocowane do burt.' },
  { id: 'spreader', name: 'Saling', group: 'rig', ax: 306, ay: 150, desc: 'Poprzeczka na maszcie odchylająca wanty, aby skuteczniej podpierały maszt na boki.' },

  // — OLINOWANIE RUCHOME —
  { id: 'fal', name: 'Fał grota', group: 'running', ax: 314, ay: 100, desc: 'Lina, którą WCIĄGA się żagiel na maszt (fał grota podnosi grot, fał foka — foka). Biegnie wzdłuż masztu przez blok na topie.' },
  { id: 'kontrafal', name: 'Kontrafał', group: 'running', ax: 298, ay: 200, desc: 'Lina pomocnicza do ściągania żagla W DÓŁ (np. przy refowaniu lub zrzucaniu), gdy sam nie chce zejść. Działa przeciwnie do fału.' },
  { id: 'szot-grota', name: 'Szot grota (grotszot)', group: 'running', ax: 232, ay: 284, desc: 'Najważniejsza lina trymowa: reguluje kąt wybrania grota. Prowadzona z bomu przez talię do kokpitu.' },
  { id: 'szot-foka', name: 'Szoty foka', group: 'running', ax: 300, ay: 272, desc: 'Dwie liny (lewa i prawa) od rogu szotowego foka do kokpitu. Pracuje zawsze zawietrzny szot; przy zwrocie przerzucasz na drugą.' },
  { id: 'topenanta', name: 'Topenanta', group: 'running', ax: 244, ay: 160, desc: 'Lina od topu masztu do noku (końca) bomu. Podtrzymuje bom, gdy żagiel jest zrzucony — bez niej bom opadłby na pokład.' },
  { id: 'lazyjack', name: 'Lazy jacki', group: 'running', ax: 262, ay: 205, desc: 'Układ linek od masztu do bomu tworzący „koszyk”, w który spada zrzucany grot — nie rozsypuje się po pokładzie.' },
  { id: 'obciagacz', name: 'Obciągacz bomu (vang)', group: 'running', ax: 280, ay: 279, desc: 'Talia od podstawy masztu ukośnie do bomu. Ściąga bom w dół, kontrolując skręt (twist) grota, zwłaszcza na pełnych kursach.' },

  // — ELEMENTY STAŁE —
  { id: 'hull', name: 'Kadłub', group: 'hull', ax: 250, ay: 314, desc: 'Główny korpus jachtu nadający pływalność. Część nad wodą to nadwodzie, pod wodą — podwodzie.' },
  { id: 'deck', name: 'Pokład', group: 'hull', ax: 320, ay: 285, desc: 'Górna powierzchnia kadłuba, po której się chodzi. Jego krawędź nadaje charakterystyczną linię (sheer).' },
  { id: 'bow', name: 'Dziób', group: 'hull', ax: 468, ay: 305, desc: 'Przednia część kadłuba. Tnie falę i nadaje kierunek. Przeciwieństwo rufy.' },
  { id: 'stern', name: 'Rufa / pawęż', group: 'hull', ax: 118, ay: 320, desc: 'Tylna część kadłuba. Płaska ścianka na końcu to pawęż; tu często mocowany jest ster.' },
  { id: 'miecz', name: 'Miecz', group: 'hull', ax: 294, ay: 400, desc: 'Opuszczana płetwa (deska) wysuwana przez skrzynię mieczową w dnie kadłuba. Daje opór boczny przeciw dryfowi, a na płyciźnie można ją podnieść. Na mazurskich jachtach zastępuje kil — nie ma balastu, dlatego liczy się balastowanie załogą.' },
  { id: 'rudder', name: 'Ster (płetwa)', group: 'hull', ax: 114, ay: 366, desc: 'Płetwa sterowa zamontowana pionowo przy pawęży (na końcu rufy). Wychylana, zmienia kierunek płynięcia jachtu.' },
  { id: 'tiller', name: 'Rumpel', group: 'hull', ax: 160, ay: 309, desc: 'Drążek połączony z głowicą steru, prowadzony poziomo do kokpitu. Steruje nim sternik; w większych jachtach zastąpiony kołem.' },
  { id: 'cockpit', name: 'Kokpit', group: 'hull', ax: 186, ay: 298, desc: 'Zagłębienie w pokładzie, w którym siedzi załoga i obsługuje szoty oraz ster.' },
  { id: 'waterline', name: 'Linia wodna', group: 'hull', ax: 90, ay: 330, desc: 'Linia styku kadłuba z wodą przy normalnym zanurzeniu. Oddziela nadwodzie od podwodzia.' },
]

export const ACCENT = '#f4c430'
export const OK = '#3ec46d'
export const BAD = '#ef4444'
const LINE = '#22384a'
const WL = 330

/** Elementy „liniowe”. Rysowane najpierw w wersji zwykłej, a podświetlone —
 *  jeszcze raz na samej górze, żeby nie ginęły pod żaglami. */
interface Thin {
  d: string
  stroke: string
  w: number
  dash?: string
  cap?: 'round'
  /** szerokość niewidzialnego pola do klikania */
  hit?: number
  /** osobna ścieżka pola klikalnego (gdy pełna linia zasłoniłaby inne elementy) */
  hitD?: string
  /** rysowane tylko w zakładce „olinowanie ruchome” */
  running?: boolean
}

const THIN: Record<string, Thin> = {
  forestay: { d: 'M306 54 L468 288', stroke: '#8aa0ad', w: 2, hit: 12 },
  backstay: { d: 'M306 54 L118 298', stroke: '#8aa0ad', w: 2, hit: 12 },
  shroud: { d: 'M306 96 L324 150 L300 290', stroke: '#8aa0ad', w: 1.6, hit: 11 },
  spreader: { d: 'M288 150 L326 150', stroke: '#8aa0ad', w: 2.2, hit: 12 },
  deck: { d: 'M115 297 C 210 287, 360 281, 468 288', stroke: '#c9b487', w: 3, hit: 12 },
  bow: { d: 'M452 331 C 470 320, 477 302, 468 288', stroke: 'transparent', w: 3, hit: 20 },
  stern: { d: 'M115 297 C 116 331, 129 346, 150 350', stroke: 'transparent', w: 3, hit: 20 },
  waterline: {
    d: `M20 ${WL} L540 ${WL}`,
    stroke: 'rgba(123,188,217,0.5)',
    w: 1.5,
    dash: '7 7',
    hit: 15,
    hitD: `M20 ${WL} L106 ${WL} M486 ${WL} L540 ${WL}`,
  },
  tiller: { d: 'M114 314 L203 304', stroke: '#6b5124', w: 4, cap: 'round', hit: 13, hitD: 'M128 312 L203 304' },
  boom: { d: 'M306 272 L180 268', stroke: '#3a2c14', w: 5.5, cap: 'round', hit: 13 },
  mast: { d: 'M306 290 L306 52', stroke: '#c9a15a', w: 6, cap: 'round', hit: 13 },
  fal: { d: 'M312 54 L312 288', stroke: '#8aa0ad', w: 2.5, dash: '6 5', hit: 9, running: true },
  kontrafal: { d: 'M300 60 L300 288', stroke: '#8aa0ad', w: 2.2, dash: '2 5', hit: 7, running: true },
  topenanta: { d: 'M306 54 L182 266', stroke: '#8aa0ad', w: 2.2, hit: 11, running: true },
  lazyjack: { d: 'M306 140 L216 268 M306 140 L256 270 M236 240 L266 242', stroke: '#8aa0ad', w: 1.6, hit: 9, running: true },
  obciagacz: { d: 'M306 286 L252 272', stroke: '#8aa0ad', w: 2.5, hit: 12, running: true },
  'szot-grota': { d: 'M232 270 L232 292 M224 292 L240 292', stroke: '#8aa0ad', w: 2.8, hit: 12, running: true },
  'szot-foka': { d: 'M356 236 C 330 258, 280 280, 236 288', stroke: '#8aa0ad', w: 2.5, hit: 12, running: true },
}

/** kolejność rysowania warstwy podstawowej (przed kadłubem / przed żaglami / po żaglach) */
const UNDER_HULL = ['forestay', 'backstay', 'shroud', 'spreader']
const OVER_HULL = ['deck', 'bow', 'stern', 'waterline', 'tiller', 'boom']
const OVER_SAILS = ['mast', 'fal', 'kontrafal', 'topenanta', 'lazyjack', 'obciagacz', 'szot-grota', 'szot-foka']

/** Kolejność pól klikalnych — im dalej na liście, tym wyżej (i tym łatwiej trafić).
 *  Cienkie i „schowane” elementy muszą być NAD grubymi, inaczej nie da się w nie kliknąć. */
const HIT_ORDER = [
  'deck',
  'waterline',
  'mast',
  'boom',
  'tiller',
  'bow',
  'stern',
  'forestay',
  'backstay',
  'shroud',
  'spreader',
  'lazyjack',
  'topenanta',
  'szot-foka',
  'szot-grota',
  'obciagacz',
  'fal',
  'kontrafal',
]

interface Props {
  /** unikalny przedrostek id dla <defs> — pozwala mieć dwa rysunki na jednej stronie */
  uid: string
  group: Group
  /** aktualnie podświetlona część (żółto) */
  active?: string | null
  /** dodatkowe podświetlenia w innych kolorach, np. quiz: { boom: OK, mast: BAD } */
  marks?: Record<string, string>
  onPick?: (id: string) => void
  /** pierścień pulsujący przy wybranej części */
  showMarker?: boolean
  className?: string
}

export default function YachtDiagram({ uid, group, active = null, marks, onPick, showMarker = true, className = 'w-full' }: Props) {
  const pick = (id: string) => (onPick ? () => onPick(id) : undefined)
  const hand = onPick ? ({ cursor: 'pointer' } as const) : undefined
  const running = group === 'running'

  /** kolor podświetlenia danego elementu (marks mają pierwszeństwo) */
  const col = (id: string): string | null => marks?.[id] ?? (active === id ? ACCENT : null)
  const glowOf = (c: string) => (c === OK ? `url(#${uid}-glow-ok)` : c === BAD ? `url(#${uid}-glow-bad)` : `url(#${uid}-glow)`)

  // atrybuty dla obrysów wypełnionych kształtów
  const edge = (id: string, base = LINE, w = 2) => {
    const c = col(id)
    return c ? { stroke: c, strokeWidth: w + 1.5, filter: glowOf(c) } : { stroke: base, strokeWidth: w }
  }
  const sailFill = (id: string, base: string) => {
    const c = col(id)
    if (!c) return base
    return c === OK ? 'rgba(62,196,109,0.4)' : c === BAD ? 'rgba(239,68,68,0.32)' : '#fff6da'
  }

  const visible = (id: string) => !THIN[id].running || running

  /** warstwa podstawowa — zawsze w kolorach „spoczynkowych” */
  const base = (ids: string[]) =>
    ids.filter(visible).map((id) => {
      const t = THIN[id]
      // w zakładce „olinowanie ruchome” maszt/bom schodzą na drugi plan
      return (
        <path
          key={id}
          d={t.d}
          fill="none"
          stroke={t.stroke}
          strokeWidth={t.w}
          strokeDasharray={t.dash}
          strokeLinecap={t.cap}
          pointerEvents="none"
        />
      )
    })

  /** warstwa podświetlenia — na samej górze, nic jej nie zasłania */
  const highlight = Object.keys(THIN)
    .filter((id) => visible(id) && col(id))
    .map((id) => {
      const t = THIN[id]
      const c = col(id)!
      return (
        <path
          key={id}
          d={t.d}
          fill="none"
          stroke={c}
          strokeWidth={t.w + 2}
          strokeDasharray={t.dash}
          strokeLinecap={t.cap ?? 'round'}
          filter={glowOf(c)}
          pointerEvents="none"
        />
      )
    })

  /** niewidzialne pola klikalne — na samej górze, żeby cienkie liny dało się trafić */
  const hits = onPick
    ? HIT_ORDER.filter((id) => visible(id) && (THIN[id].hit ?? 0) > 0)
        .map((id) => (
          <path key={id} d={THIN[id].hitD ?? THIN[id].d} fill="none" stroke="transparent" strokeWidth={THIN[id].hit} onClick={pick(id)} style={hand} />
        ))
    : null

  const markerPart = PARTS.find((p) => p.id === active) ?? null

  return (
    <svg viewBox="0 0 560 470" className={className}>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c2537" />
          <stop offset="100%" stopColor="#0a1c2b" />
        </linearGradient>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(43,127,171,0.28)" />
          <stop offset="100%" stopColor="rgba(43,127,171,0.06)" />
        </linearGradient>
        {/* region w jednostkach płótna — inaczej płaskie/pionowe linie są przycinane */}
        <filter id={`${uid}-glow`} filterUnits="userSpaceOnUse" x="0" y="0" width="560" height="470">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={ACCENT} floodOpacity="0.95" />
        </filter>
        <filter id={`${uid}-glow-ok`} filterUnits="userSpaceOnUse" x="0" y="0" width="560" height="470">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={OK} floodOpacity="0.95" />
        </filter>
        <filter id={`${uid}-glow-bad`} filterUnits="userSpaceOnUse" x="0" y="0" width="560" height="470">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={BAD} floodOpacity="0.95" />
        </filter>
        <clipPath id={`${uid}-hullclip`}>
          <path d="M115 297 C 210 287, 360 281, 468 288 C 477 302, 470 320, 452 331 C 430 353, 250 360, 150 350 C 129 346, 116 331, 115 297 Z" />
        </clipPath>
      </defs>

      <rect x="0" y="0" width="560" height="470" rx="16" fill={`url(#${uid}-sky)`} />
      {/* woda */}
      <rect x="0" y={WL} width="560" height={470 - WL} fill={`url(#${uid}-water)`} />

      {/* olinowanie stałe (pod kadłubem i żaglami) */}
      {base(UNDER_HULL)}

      {/* KADŁUB */}
      <g onClick={pick('hull')} style={hand}>
        <path
          d="M115 297 C 210 287, 360 281, 468 288 C 477 302, 470 320, 452 331 C 430 353, 250 360, 150 350 C 129 346, 116 331, 115 297 Z"
          fill="#e8edf2"
          {...edge('hull')}
        />
        {/* podwodzie (antifouling) */}
        <rect x="110" y={WL} width="370" height="40" fill="#b0473a" clipPath={`url(#${uid}-hullclip)`} opacity="0.9" />
        <rect x="110" y={WL - 5} width="370" height="5" fill="#1f3346" clipPath={`url(#${uid}-hullclip)`} />
      </g>

      {/* pokład, dziób, rufa, linia wodna, rumpel, bom */}
      {base(OVER_HULL)}

      {/* KOKPIT */}
      <path d="M158 293 L214 291 L208 305 L166 306 Z" fill="#0f2233" onClick={pick('cockpit')} style={hand} {...edge('cockpit', '#33506a', 1.5)} />

      {/* skrzynia mieczowa + miecz (opuszczana płetwa, bez balastu) */}
      <rect x="286" y="346" width="24" height="12" rx="2" fill="#1f3346" />
      <path d="M289 356 L286 426 Q286 433 293 433 L302 431 L305 356 Z" fill="#3a5670" onClick={pick('miecz')} style={hand} {...edge('miecz')} />
      {/* STER (płetwa) — pionowo, zamontowany przy pawęży (na rufie) */}
      <path d="M108 322 L106 400 Q106 409 115 408 L122 406 L123 322 Z" fill="#2a4258" onClick={pick('rudder')} style={hand} {...edge('rudder')} />

      {/* GROT */}
      <path
        d="M306 58 L306 272 L182 268 Z"
        onClick={pick('main')}
        style={hand}
        fill={sailFill('main', running ? 'rgba(244,240,230,0.22)' : 'rgba(244,240,230,0.96)')}
        {...edge('main', LINE, 1.5)}
      />
      {/* FOK */}
      <path
        d="M306 74 L452 284 L356 236 Z"
        onClick={pick('jib')}
        style={hand}
        fill={sailFill('jib', running ? 'rgba(233,240,247,0.18)' : 'rgba(233,240,247,0.92)')}
        {...edge('jib', LINE, 1.5)}
      />

      {/* maszt i olinowanie ruchome — nad żaglami */}
      {base(OVER_SAILS)}
      <circle cx="306" cy="52" r="4" fill={col('mast') ?? '#c9a15a'} pointerEvents="none" />

      {/* warstwa podświetleń — zawsze widoczna */}
      {highlight}

      {/* niewidzialne pola klikalne */}
      {hits}

      {/* marker aktywnej części */}
      {showMarker && markerPart && (
        <motion.circle
          key={markerPart.id}
          cx={markerPart.ax}
          cy={markerPart.ay}
          r="8"
          fill="none"
          stroke={ACCENT}
          strokeWidth="2.5"
          pointerEvents="none"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 1.35, 1], opacity: 1 }}
          transition={{ scale: { duration: 1.4, repeat: Infinity }, opacity: { duration: 0.2 } }}
        />
      )}
    </svg>
  )
}
