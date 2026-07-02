import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sailboat,
  Compass,
  CloudSun,
  Wrench,
  Scale,
  Menu,
  X,
  Anchor,
} from 'lucide-react'

const NAV = [
  { to: '/teoria', label: 'Teoria żeglowania', icon: Sailboat },
  { to: '/locja', label: 'Locja', icon: Compass },
  { to: '/meteorologia', label: 'Meteorologia', icon: CloudSun },
  { to: '/budowa', label: 'Budowa jachtu', icon: Wrench },
  { to: '/przepisy', label: 'Przepisy', icon: Scale },
]

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="sea-bg min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-deep-950/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brine-500 text-white shadow-glow">
              <Anchor className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-700 tracking-tight text-white">
              Pro<span className="text-brine-300">Sail</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `btn ${isActive ? 'bg-white/10 text-white' : 'text-brine-100 hover:bg-white/5'}`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            className="btn-ghost ml-auto lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-2">
              {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 ${
                      isActive ? 'bg-white/10 text-white' : 'text-brine-100'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-brine-100/60">
        <p>
          ProSail · interaktywna platforma do nauki żeglarstwa · treści mają
          charakter edukacyjny
        </p>
      </footer>
    </div>
  )
}
