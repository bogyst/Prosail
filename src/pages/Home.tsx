import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sailboat,
  Compass,
  CloudSun,
  Wrench,
  Scale,
  Link2,
  LifeBuoy,
  GraduationCap,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react'

const CARDS = [
  {
    to: '/teoria',
    icon: Sailboat,
    title: 'Teoria żeglowania',
    desc: 'Interaktywny symulator: zmieniaj wiatr i kurs, obserwuj trym żagli i siły działające na jacht.',
    accent: 'from-brine-500/30',
  },
  {
    to: '/locja',
    icon: Compass,
    title: 'Locja',
    desc: 'Oznakowanie szlaków wodnych: pławy kardynalne, boczne, znaki niebezpieczeństw i portów.',
    accent: 'from-buoyGreen/30',
  },
  {
    to: '/meteorologia',
    icon: CloudSun,
    title: 'Meteorologia',
    desc: 'Skala Beauforta, rodzaje chmur, fronty atmosferyczne i czytanie pogody na wodzie.',
    accent: 'from-sand-400/30',
  },
  {
    to: '/budowa',
    icon: Wrench,
    title: 'Budowa jachtu',
    desc: 'Klikalny przekrój jachtu — nazwy części kadłuba, takielunku i osprzętu.',
    accent: 'from-rope/30',
  },
  {
    to: '/przepisy',
    icon: Scale,
    title: 'Przepisy',
    desc: 'Prawo drogi, pierwszeństwo, światła nawigacyjne i sygnały — z interaktywnymi scenariuszami.',
    accent: 'from-buoyRed/30',
  },
  {
    to: '/wezly',
    icon: Link2,
    title: 'Węzły',
    desc: 'Sześć podstawowych węzłów żeglarskich — ilustracje, zastosowanie i wiązanie krok po kroku.',
    accent: 'from-rope/30',
  },
  {
    to: '/ratownictwo',
    icon: LifeBuoy,
    title: 'Ratownictwo',
    desc: 'Numery alarmowe (Mazury), podstawy pierwszej pomocy i manewr „człowiek za burtą” krok po kroku.',
    accent: 'from-buoyRed/30',
  },
  {
    to: '/poradnik',
    icon: ClipboardCheck,
    title: 'Poradnik',
    desc: 'Checklista pakowania na rejs oraz dobre nawyki i etykieta na jachcie, w porcie i na wodzie.',
    accent: 'from-sand-300/40',
  },
  {
    to: '/quiz',
    icon: GraduationCap,
    title: 'Quiz',
    desc: 'Sprawdź wiedzę ze wszystkich działów. Pytania z wyjaśnieniami i wynikiem końcowym.',
    accent: 'from-brine-400/30',
  },
]

export default function Home() {
  return (
    <div>
      {/* HERO — granatowy blok w stylu klasycznego yacht-clubu */}
      <section className="relative -mx-4 -mt-8 overflow-hidden bg-gradient-to-b from-navy to-navy-2 px-6 pb-24 pt-16 sm:-mt-10 sm:px-12 sm:pt-20">
        <div className="pointer-events-none absolute -right-6 top-8 opacity-15">
          <Sailboat className="h-64 w-64 text-gold animate-sway" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-6xl"
        >
          <div className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Szkoła teorii żeglarstwa · Mazury
          </div>
          <h1 className="max-w-2xl font-display text-4xl font-700 leading-tight text-white sm:text-6xl">
            Zrozum żeglowanie.{' '}
            <span className="text-gold">Zobacz, jak działa wiatr.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#c8d6e5]">
            ProSail zamienia teorię żeglarską w eksperyment: poruszaj suwakami,
            klikaj w siły i pławy, ucz się przez działanie — od trymu żagli po
            prawo drogi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/teoria" className="btn-primary text-base">
              Otwórz symulator żagli
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/locja"
              className="btn border-2 border-white/50 text-base text-white hover:bg-white/10"
            >
              Poznaj oznakowanie
            </Link>
          </div>
        </motion.div>
        {/* fala przejściowa do kremu */}
        <svg
          className="absolute bottom-0 left-0 right-0"
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          height="70"
          width="100%"
        >
          <path d="M0,38 C240,70 480,8 720,34 C960,62 1200,15 1440,42 L1440,70 L0,70 Z" fill="#faf6ee" />
        </svg>
      </section>
      <div className="stripe-nautical -mx-4" />

      {/* KAFELKI */}
      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Link
              to={c.to}
              className="group card relative block h-full overflow-hidden p-6 transition-transform hover:-translate-y-1"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent} to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-brine-300">
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-700 text-navy">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brine-100/75">
                  {c.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brine-300 group-hover:gap-2 transition-all">
                  Przejdź <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  )
}
