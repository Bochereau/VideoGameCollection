import { UserButton } from '@clerk/clerk-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

type Props = {
  search: string
  onSearchChange: (value: string) => void
  onToggleSidebar: () => void
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive
      ? 'bg-accent-soft text-accent-strong'
      : 'text-ink-muted hover:bg-white/80 hover:text-ink'
  }`

export function TopBar({ search, onSearchChange, onToggleSidebar }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Button
          variant="ghost"
          className="lg:hidden !px-2"
          onClick={onToggleSidebar}
          aria-label="Ouvrir les filtres"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 7h16M4 12h10M4 17h14"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </Button>

        <NavLink to="/collection" className="font-display shrink-0 text-lg font-bold tracking-tight text-ink">
          VGC
        </NavLink>

        <nav className="ml-1 hidden items-center gap-1 sm:flex">
          <NavLink to="/collection" className={linkClass}>
            Collection
          </NavLink>
          <NavLink to="/wishlist" className={linkClass}>
            Envies
          </NavLink>
        </nav>

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-3 sm:max-w-md">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Rechercher</span>
            <svg
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
              <path
                d="M16 16l4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un jeu…"
              className="w-full rounded-lg border border-line bg-white py-2 pr-3 pl-9 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <nav className="flex gap-1 border-t border-line/60 px-4 py-2 sm:hidden">
        <NavLink to="/collection" className={linkClass}>
          Collection
        </NavLink>
        <NavLink to="/wishlist" className={linkClass}>
          Envies
        </NavLink>
      </nav>
    </header>
  )
}
