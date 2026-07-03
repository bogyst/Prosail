// Rysownik pław w SVG (znaki kardynalne/bezpiecznej wody/niebezpieczeństwa wg IALA;
// znaki boczne w wersji dla polskich wód śródlądowych: prawa = czerwona, lewa = zielona).

export type BodyShape = 'can' | 'cone' | 'pillar' | 'spar' | 'sphere'
export type TopMark =
  | 'none'
  | 'can' // walec
  | 'cone-up' // stożek wierzchołkiem w górę
  | 'sphere' // kula
  | 'x' // krzyż św. Andrzeja
  | 'cones-up' // 2 stożki wierzchołkami w górę (N)
  | 'cones-down' // 2 stożki wierzchołkami w dół (S)
  | 'cones-base' // podstawami do siebie (E)
  | 'cones-point' // wierzchołkami do siebie (W)
  | 'spheres' // 2 kule (izolowane niebezpieczeństwo)

export interface Band {
  color: string
  from: number // 0 = dół, 1 = góra
  to: number
}

const C = {
  red: '#d63a3f',
  green: '#1fa463',
  yellow: '#f4c430',
  black: '#1a1a1a',
  white: '#f5f2ea',
}

export function bandColor(name: keyof typeof C) {
  return C[name]
}

export default function Buoy({
  shape,
  bands,
  topmark = 'none',
  topColor = C.black,
  size = 130,
}: {
  shape: BodyShape
  bands: Band[]
  topmark?: TopMark
  topColor?: string
  size?: number
}) {
  const W = size
  const H = size * 1.7
  const cx = W / 2
  const bodyTop = H * 0.34
  const bodyBottom = H * 0.9
  const bodyH = bodyBottom - bodyTop
  const bw = W * 0.42 // szerokość korpusu

  // clip do kształtu korpusu, żeby pasy się przycinały
  const clipId = `clip-${Math.random().toString(36).slice(2)}`

  function bodyPath() {
    switch (shape) {
      case 'cone':
        return `M ${cx} ${bodyTop} L ${cx + bw / 2} ${bodyBottom} L ${cx - bw / 2} ${bodyBottom} Z`
      case 'can':
        return `M ${cx - bw / 2} ${bodyTop} L ${cx + bw / 2} ${bodyTop} L ${cx + bw / 2} ${bodyBottom} L ${cx - bw / 2} ${bodyBottom} Z`
      case 'sphere':
        return `M ${cx} ${bodyTop} a ${bw / 2} ${bodyH / 2} 0 1 0 0.1 0 Z`
      case 'spar':
        return `M ${cx - bw * 0.18} ${bodyTop} L ${cx + bw * 0.18} ${bodyTop} L ${cx + bw * 0.28} ${bodyBottom} L ${cx - bw * 0.28} ${bodyBottom} Z`
      case 'pillar':
      default:
        return `M ${cx - bw * 0.32} ${bodyTop} L ${cx + bw * 0.32} ${bodyTop} L ${cx + bw / 2} ${bodyBottom} L ${cx - bw / 2} ${bodyBottom} Z`
    }
  }

  function TopMarkEl() {
    const ty = bodyTop - 6
    const s = W * 0.16
    const st = { fill: topColor, stroke: '#000', strokeWidth: 0.8 }
    switch (topmark) {
      case 'can':
        return <rect x={cx - s * 0.7} y={ty - s * 1.3} width={s * 1.4} height={s * 1.3} {...st} />
      case 'cone-up':
        return <polygon points={`${cx},${ty - s * 1.4} ${cx + s * 0.8},${ty} ${cx - s * 0.8},${ty}`} {...st} />
      case 'sphere':
        return <circle cx={cx} cy={ty - s * 0.7} r={s * 0.75} {...st} />
      case 'x':
        return (
          <g stroke={topColor} strokeWidth={s * 0.35} strokeLinecap="round">
            <line x1={cx - s} y1={ty - s * 1.6} x2={cx + s} y2={ty - 0.2} />
            <line x1={cx + s} y1={ty - s * 1.6} x2={cx - s} y2={ty - 0.2} />
          </g>
        )
      case 'cones-up':
        return (
          <>
            <polygon points={`${cx},${ty - s * 1.5} ${cx + s * 0.75},${ty - s * 0.75} ${cx - s * 0.75},${ty - s * 0.75}`} {...st} />
            <polygon points={`${cx},${ty - s * 0.75} ${cx + s * 0.75},${ty} ${cx - s * 0.75},${ty}`} {...st} />
          </>
        )
      case 'cones-down':
        return (
          <>
            <polygon points={`${cx},${ty - 0.75 * s} ${cx + s * 0.75},${ty - s * 1.5} ${cx - s * 0.75},${ty - s * 1.5}`} {...st} />
            <polygon points={`${cx},${ty} ${cx + s * 0.75},${ty - s * 0.75} ${cx - s * 0.75},${ty - s * 0.75}`} {...st} />
          </>
        )
      case 'cones-base':
        return (
          <>
            <polygon points={`${cx},${ty - s * 1.5} ${cx + s * 0.75},${ty - s * 0.75} ${cx - s * 0.75},${ty - s * 0.75}`} {...st} />
            <polygon points={`${cx},${ty} ${cx + s * 0.75},${ty - s * 0.75} ${cx - s * 0.75},${ty - s * 0.75}`} {...st} />
          </>
        )
      case 'cones-point':
        return (
          <>
            <polygon points={`${cx},${ty - 0.75 * s} ${cx + s * 0.75},${ty - s * 1.5} ${cx - s * 0.75},${ty - s * 1.5}`} {...st} />
            <polygon points={`${cx},${ty - 0.75 * s} ${cx + s * 0.75},${ty} ${cx - s * 0.75},${ty}`} {...st} />
          </>
        )
      case 'spheres':
        return (
          <>
            <circle cx={cx} cy={ty - s * 1.4} r={s * 0.6} {...st} />
            <circle cx={cx} cy={ty - s * 0.3} r={s * 0.6} {...st} />
          </>
        )
      default:
        return null
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="drop-shadow-lg">
      {/* woda */}
      <ellipse cx={cx} cy={bodyBottom + 6} rx={bw * 0.75} ry={7} fill="rgba(72,156,196,0.35)" />
      <clipPath id={clipId}>
        <path d={bodyPath()} />
      </clipPath>
      {/* korpus + pasy */}
      <g clipPath={`url(#${clipId})`}>
        <rect x={0} y={0} width={W} height={H} fill={C.white} />
        {bands.map((b, i) => (
          <rect
            key={i}
            x={0}
            width={W}
            y={bodyBottom - b.to * bodyH}
            height={(b.to - b.from) * bodyH}
            fill={b.color}
          />
        ))}
      </g>
      <path d={bodyPath()} fill="none" stroke="#0f2b3f" strokeWidth={1.5} />
      {/* maszcik */}
      <line x1={cx} y1={bodyTop} x2={cx} y2={bodyTop - 6} stroke="#0f2b3f" strokeWidth={2} />
      <TopMarkEl />
    </svg>
  )
}
