import { useEffect, useRef, useState } from 'react'
import { ColumnsPerRowStepper } from '@/components/games/ColumnsPerRowStepper'
import { ViewModeToggle } from '@/components/games/ViewModeToggle'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import type { ColorTheme } from '@/types/theme'
import type { GamesViewMode } from '@/types/view'

type Props = {
  colorTheme: ColorTheme
  onColorThemeChange: (value: ColorTheme) => void
  viewMode: GamesViewMode
  onViewModeChange: (value: GamesViewMode) => void
  columnsPerRow: number
  onColumnsPerRowChange: (value: number) => void
  hideLayout?: boolean
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SettingsMenu({
  colorTheme,
  onColorThemeChange,
  viewMode,
  onViewModeChange,
  columnsPerRow,
  onColumnsPerRowChange,
  hideLayout = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Paramètres d’affichage"
        title="Paramètres"
        className={`rounded-xl border p-2 transition ${
          open
            ? 'border-accent bg-accent-soft text-accent'
            : 'border-line bg-surface/80 text-ink-muted hover:border-accent/50 hover:text-ink'
        }`}
      >
        <GearIcon />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Paramètres d’affichage"
          className="animate-fade-in absolute top-[calc(100%+0.5rem)] right-0 z-50 w-72 rounded-xl border border-line bg-bg p-3 shadow-xl shadow-black/30"
        >
          <p className="mb-3 text-[0.65rem] font-medium tracking-wide text-ink-muted uppercase">
            Paramètres
          </p>
          <div className="space-y-3">
            <section className="space-y-1.5">
              <h3 className="text-xs font-medium text-ink-muted">Thème</h3>
              <ThemeToggle value={colorTheme} onChange={onColorThemeChange} />
            </section>

            {!hideLayout ? (
              <>
                <section className="space-y-1.5">
                  <h3 className="text-xs font-medium text-ink-muted">Affichage</h3>
                  <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
                </section>
                {viewMode === 'cards' ? (
                  <section className="hidden space-y-1.5 lg:block">
                    <h3 className="text-xs font-medium text-ink-muted">
                      Cartes par ligne
                    </h3>
                    <ColumnsPerRowStepper
                      value={columnsPerRow}
                      onChange={onColumnsPerRowChange}
                      showLabel={false}
                    />
                  </section>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
