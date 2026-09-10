import { UserButton } from '@clerk/clerk-react'
import { NavLink } from 'react-router-dom'
import { ViewModeToggle } from '@/components/games/ViewModeToggle'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/Button'
import type { ColorTheme } from '@/types/theme'
import type { GamesViewMode } from '@/types/view'

type Props = {
  search: string
  onSearchChange: (value: string) => void
  viewMode: GamesViewMode
  onViewModeChange: (value: GamesViewMode) => void
  colorTheme: ColorTheme
  onColorThemeChange: (value: ColorTheme) => void
  onToggleSidebar: () => void
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive
      ? 'bg-accent-soft text-accent'
      : 'text-ink-muted hover:bg-ink/5 hover:text-ink'
  }`

export function TopBar({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  colorTheme,
  onColorThemeChange,
  onToggleSidebar,
}: Props) {
  return (
    <header
      data-chrome
      className="sticky top-0 z-30 shrink-0 border-b border-line bg-bg/75 backdrop-blur-xl"
    >
      <div className="flex w-full items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
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

        <NavLink
          to="/collection"
          className="font-display shrink-0 text-2xl tracking-wide text-amber"
        >
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

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 sm:max-w-lg sm:gap-3">
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
              className="field w-full !rounded-lg !py-2 !pr-3 !pl-9"
            />
          </label>
          <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
          <ThemeToggle value={colorTheme} onChange={onColorThemeChange} />
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
