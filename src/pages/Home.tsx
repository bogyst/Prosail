import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sailboat,
  Compass,
  CloudSun,
  Wrench,
  Scale,
  Link2,
  GraduationCap,
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
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brine-900/60 to-deep-950 px-6 py-14 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -right-10 top-6 opacity-20">
          <Sailboat className="h-64 w-64 text-brine-300 animate-sway" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-2xl"
        >
          <div className="chip mb-4">⚓ Nauka żeglarstwa online</div>
          <h1 className="font-display text-4xl font-700 leading-tight tracking-tight text-white sm:text-6xl">
            Zrozum żeglowanie.<br />
            <span className="text-brine-300">Zobacz, jak działa wiatr.</span>
          </h1>
          <p className="lead mt-5 text-lg">
            ProSail to interaktywna platforma, która zamienia teorię żeglarską w
            eksperyment. Poruszaj suwakami, klikaj w siły i pławy, ucz się przez
            działanie — od trymu żagli po prawo drogi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/teoria" className="btn-primary text-base">
              Otwórz symulator żagli
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/locja" className="btn-ghost text-base">
              Poznaj oznakowanie
            </Link>
          </div>
        </motion.div>
      </section>

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
                <h3 className="mt-4 font-display text-xl font-700 text-white">
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
