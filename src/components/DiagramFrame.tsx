import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MoveHorizontal } from 'lucide-react'

/**
 * Ramka dla szerokich schematów.
 *
 * Na telefonie schemat wciśnięty w 350 px robi się nieczytelny — podpisy
 * schodzą do 5–7 px. Dlatego poniżej progu `sm` trzymamy rysunek w jego
 * minimalnej sensownej szerokości i pozwalamy przesuwać go palcem w poziomie
 * (kartę, nie całą stronę). Na większych ekranach `min-width` znika i schemat
 * wypełnia kartę jak dotąd.
 *
 * `minWidth` podajemy w pikselach — zwykle tyle, ile ma viewBox schematu.
 */
export default function DiagramFrame({
  minWidth,
  children,
  className = '',
}: {
  minWidth: number
  children: ReactNode
  className?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const [canScroll, setCanScroll] = useState(false)
  const [moved, setMoved] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const check = () => setCanScroll(el.scrollWidth - el.clientWidth > 8)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [minWidth])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={box}
        onScroll={() => setMoved(true)}
        className="overflow-x-auto overscroll-x-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="diagram-canvas" style={{ ['--dg-min' as string]: `${minWidth}px` }}>
          {children}
        </div>
      </div>

      {/* podpowiedź pokazuje się tylko wtedy, gdy naprawdę jest co przesuwać */}
      {canScroll && !moved && (
        <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white">
          <MoveHorizontal className="h-3.5 w-3.5" />
          przesuń palcem
        </div>
      )}
    </div>
  )
}
