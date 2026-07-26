import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Info, X } from 'lucide-react'
import { createContext, useContext, useState, type ReactNode } from 'react'

/* ---------- Klikalne pojęcie z wyjaśnieniem (modal / popover) ---------- */

export function Term({
  label,
  title,
  children,
}: {
  label: ReactNode
  title: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-1 rounded-md border-b border-dashed border-brine-300/60 px-0.5 font-medium text-brine-200 hover:text-navy hover:border-brine-200"
      >
        {label}
        <Info className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-deep-950/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="card relative z-10 max-w-lg w-full p-6"
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8, opacity: 0 }}
            >
              <button
                className="absolute right-4 top-4 text-brine-200 hover:text-navy"
                onClick={() => setOpen(false)}
                aria-label="Zamknij"
              >
                <X className="h-5 w-5" />
              </button>
              <h4 className="font-display text-xl font-700 text-navy pr-8">{title}</h4>
              <div className="mt-3 text-sm leading-relaxed text-brine-100/90 space-y-2">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ---------- Akordeon ---------- */

const AccCtx = createContext<{
  open: string | null
  set: (id: string | null) => void
}>({ open: null, set: () => {} })

export function Accordion({ children }: { children: ReactNode }) {
  const [open, set] = useState<string | null>(null)
  return (
    <AccCtx.Provider value={{ open, set }}>
      <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
        {children}
      </div>
    </AccCtx.Provider>
  )
}

export function AccordionItem({
  id,
  title,
  icon,
  children,
}: {
  id: string
  title: string
  icon?: ReactNode
  children: ReactNode
}) {
  const { open, set } = useContext(AccCtx)
  const isOpen = open === id
  return (
    <div className="bg-white/[0.02]">
      <button
        onClick={() => set(isOpen ? null : id)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.03]"
      >
        {icon && <span className="text-brine-300">{icon}</span>}
        <span className="flex-1 font-display text-lg font-600 text-navy">{title}</span>
        <ChevronDown
          className={`h-5 w-5 text-brine-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm leading-relaxed text-brine-100/85 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Pasek wartości / siły ---------- */

export function StatBar({
  label,
  value,
  color = '#489cc4',
  suffix,
}: {
  label: string
  value: number // 0..1
  color?: string
  suffix?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-brine-100/80">
        <span>{label}</span>
        <span className="tabular-nums">{Math.round(value * 100)}{suffix ?? '%'}</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${Math.round(value * 100)}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  )
}

/* ---------- Nagłówek strony ---------- */

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-8">
      <div className="chip mb-3">{eyebrow}</div>
      <h1 className="section-title">{title}</h1>
      {children && <p className="lead mt-3 max-w-3xl">{children}</p>}
    </div>
  )
}
