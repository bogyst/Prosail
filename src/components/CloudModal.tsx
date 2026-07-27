import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import type { Cloud } from '../data/clouds'

/**
 * Okno szczegółów chmury: po lewej przewijana galeria zdjęć, po prawej
 * pełny opis (wysokość, powstawanie, pogoda, rozpoznawanie, wskazówki).
 * Zamykanie: krzyżyk, klawisz Esc albo kliknięcie w tło. Zdjęcia
 * przewijasz strzałkami ← → albo przyciskami.
 */
export default function CloudModal({ cloud, onClose }: { cloud: Cloud | null; onClose: () => void }) {
  const [i, setI] = useState(0)
  const photos = cloud?.photos ?? []
  const n = photos.length

  // reset galerii przy zmianie chmury
  useEffect(() => setI(0), [cloud?.id])

  // onClose jest nową funkcją przy każdym renderze — trzymamy ją w ref, żeby
  // efekt nie przepinał się w kółko (inaczej `prev` zapisałoby już „hidden”
  // i po zamknięciu okna strona zostałaby zablokowana).
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const open = !!cloud

  // Esc zamyka, strzałki przewijają zdjęcia, tło strony się nie przewija
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
      }
      if (e.key === 'ArrowRight' && n > 1) setI((v) => (v + 1) % n)
      if (e.key === 'ArrowLeft' && n > 1) setI((v) => (v - 1 + n) % n)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, n])

  return createPortal(
    <AnimatePresence>
      {cloud && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={cloud.name}
        >
          <motion.div
            className="card relative my-auto w-full max-w-5xl overflow-hidden p-0"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Zamknij"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/45 p-2 text-white transition-colors hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid lg:grid-cols-[1.15fr_1fr]">
              {/* ——— GALERIA ——— */}
              <div className="relative flex flex-col">
                {/* na dużym ekranie zdjęcie rozciąga się na całą wysokość okna */}
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-black/25 lg:aspect-auto lg:flex-1">
                  {n > 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={photos[i].src}
                        src={photos[i].src}
                        alt={photos[i].alt}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-brine-100/60">
                      <ImageOff className="h-9 w-9" />
                      <p className="px-6 text-center text-xs">
                        Brak zdjęć dla tej chmury — dodaj je w polu <code>photos</code> w{' '}
                        <code>src/data/clouds.ts</code>.
                      </p>
                    </div>
                  )}

                  {n > 1 && (
                    <>
                      <button
                        onClick={() => setI((v) => (v - 1 + n) % n)}
                        aria-label="Poprzednie zdjęcie"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition-colors hover:bg-black/70"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setI((v) => (v + 1) % n)}
                        aria-label="Następne zdjęcie"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition-colors hover:bg-black/70"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white">
                        {i + 1} / {n}
                      </div>
                    </>
                  )}
                </div>

                {/* podpis + kropki */}
                {n > 0 && (
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <p className="text-xs leading-snug text-brine-100/75">
                      {photos[i].caption ?? photos[i].alt}
                      {photos[i].credit && <span className="text-brine-100/50"> · {photos[i].credit}</span>}
                    </p>
                    {n > 1 && (
                      <div className="flex shrink-0 gap-1.5">
                        {photos.map((ph, k) => (
                          <button
                            key={ph.src}
                            onClick={() => setI(k)}
                            aria-label={`Zdjęcie ${k + 1}`}
                            className={`h-2 rounded-full transition-all ${k === i ? 'w-5 bg-brine-500' : 'w-2 bg-navy/30'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ——— OPIS ——— */}
              <div className="max-h-[70vh] overflow-y-auto p-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{cloud.emoji}</span>
                  <div>
                    <h2 className="font-display text-2xl font-700 leading-tight text-navy">{cloud.name}</h2>
                    <div className="text-xs text-brine-100/60">{cloud.latin}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="chip">📏 {cloud.altitude}</span>
                  <span className="chip">{cloud.family}</span>
                </div>

                <Section title="Jak powstaje">{cloud.forms}</Section>
                <Section title="Jaką pogodę przynosi">{cloud.brings}</Section>

                <div className="mt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">Po czym rozpoznasz</h3>
                  <ul className="mt-2 space-y-1.5">
                    {cloud.recognise.map((r) => (
                      <li key={r} className="flex gap-2 text-sm leading-relaxed text-brine-100/90">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brine-500" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 rounded-lg border border-signal/35 bg-signal/10 p-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-brine-100/60">Dla żeglarza</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brine-100/90">{cloud.sailing}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-brine-100/50">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-brine-100/90">{children}</p>
    </div>
  )
}
