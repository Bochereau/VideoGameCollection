import { UserButton } from '@clerk/clerk-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { SettingsMenu } from '@/components/layout/SettingsMenu'
import { Button } from '@/components/ui/Button'
import type { ColorTheme } from '@/types/theme'
import type { GamesViewMode } from '@/types/view'

const SEARCH_DEBOUNCE_MS = 700

type Props = {
  search: string
  onSearchChange: (value: string) => void
  viewMode: GamesViewMode
  onViewModeChange: (value: GamesViewMode) => void
  columnsPerRow: number
  onColumnsPerRowChange: (value: number) => void
  colorTheme: ColorTheme
  onColorThemeChange: (value: ColorTheme) => void
  onToggleSidebar?: () => void
  hideSearch?: boolean
  hideLayout?: boolean
  reservationCount?: number
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive
      ? 'bg-accent-soft text-accent'
      : 'text-ink-muted hover:bg-ink/5 hover:text-ink'
  }`

function EnviesLink({ count }: { count: number }) {
  return (
    <NavLink to="/wishlist" className={linkClass}>
      <span className="inline-flex items-center gap-1.5">
        Envies
        {count > 0 ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 text-[0.65rem] font-semibold text-bg tabular-nums">
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </span>
    </NavLink>
  )
}

export function TopBar({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  columnsPerRow,
  onColumnsPerRowChange,
  colorTheme,
  onColorThemeChange,
  onToggleSidebar,
  hideSearch = false,
  hideLayout = false,
  reservationCount = 0,
}: Props) {
  const [draft, setDraft] = useState(search)
  const onSearchChangeRef = useRef(onSearchChange)
  const timerRef = useRef(0)
  const dirtyRef = useRef(false)

  onSearchChangeRef.current = onSearchChange

  useEffect(() => {
    if (!dirtyRef.current) setDraft(search)
  }, [search])

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current)
  }, [])

  function commitSearch(value: string) {
    window.clearTimeout(timerRef.current)
    dirtyRef.current = false
    if (value !== search) onSearchChangeRef.current(value)
  }

  function handleSearchChange(value: string) {
    dirtyRef.current = true
    setDraft(value)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      dirtyRef.current = false
      onSearchChangeRef.current(value)
    }, SEARCH_DEBOUNCE_MS)
  }

  return (
    <header
      data-chrome
      className="sticky top-0 z-30 shrink-0 border-b border-line bg-bg/75 backdrop-blur-xl"
    >
      <div className="flex w-full items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {onToggleSidebar ? (
          <Button
            variant="ghost"
            className="lg:hidden !px-2.5"
            onClick={onToggleSidebar}
          >
            Tops
          </Button>
        ) : null}

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
          <EnviesLink count={reservationCount} />
          <NavLink to="/tops" className={linkClass}>
            Tops
          </NavLink>
        </nav>

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 sm:max-w-lg sm:gap-3">
          {!hideSearch ? (
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
                value={draft}
                onChange={(e) => handleSearchChange(e.target.value)}
                onBlur={() => commitSearch(draft)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitSearch(draft)
                }}
                placeholder="Rechercher un jeu…"
                className="field w-full !rounded-lg !py-2 !pr-3 !pl-9"
              />
            </label>
          ) : (
            <div className="min-w-0 flex-1" />
          )}
          <SettingsMenu
            colorTheme={colorTheme}
            onColorThemeChange={onColorThemeChange}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            columnsPerRow={columnsPerRow}
            onColumnsPerRowChange={onColumnsPerRowChange}
            hideLayout={hideLayout}
          />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <nav className="flex gap-1 border-t border-line/60 px-4 py-2 sm:hidden">
        <NavLink to="/collection" className={linkClass}>
          Collection
        </NavLink>
        <EnviesLink count={reservationCount} />
        <NavLink to="/tops" className={linkClass}>
          Tops
        </NavLink>
      </nav>
    </header>
  )
}
