import { NavLink, useNavigate } from 'react-router-dom'
import type { TopSummary } from '@/types'
import { Button } from '@/components/ui/Button'

type Props = {
  tops: TopSummary[]
  selectedTopId: string | null
  onCreate: () => void
  onDelete: (id: string) => Promise<void>
  open: boolean
  onClose: () => void
}

export function TopsSidebar({
  tops,
  selectedTopId,
  onCreate,
  onDelete,
  open,
  onClose,
}: Props) {
  const navigate = useNavigate()

  const content = (
    <aside
      data-chrome
      className="flex h-full min-h-0 w-64 shrink-0 flex-col border-r border-line bg-bg/75 backdrop-blur-xl"
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-4">
        <h2 className="font-display text-sm tracking-wide text-amber uppercase">
          Tops
        </h2>
        <button
          type="button"
          className="text-ink-muted lg:hidden"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        <div className="flex items-center gap-1">
          <NavLink
            to="/tops"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                isActive && !selectedTopId
                  ? 'bg-accent-soft font-medium text-accent'
                  : 'text-ink-muted hover:bg-ink/5 hover:text-ink'
              }`
            }
          >
            <span>Tous</span>
            <span className="ml-2 tabular-nums text-xs opacity-70">{tops.length}</span>
          </NavLink>
          <span className="w-[26px] shrink-0" aria-hidden />
        </div>

        {tops.map((top) => (
          <div key={top.id} className="group flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                navigate(`/tops/${top.id}`)
                onClose()
              }}
              className={`flex min-w-0 flex-1 items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                selectedTopId === top.id
                  ? 'bg-accent-soft font-medium text-accent'
                  : 'text-ink-muted hover:bg-ink/5 hover:text-ink'
              }`}
            >
              <span className="truncate">{top.name}</span>
              <span className="ml-2 tabular-nums text-xs opacity-70">
                {top.filledCount}/{top.size}
              </span>
            </button>
            <button
              type="button"
              className="rounded p-1.5 text-ink-muted opacity-0 transition group-hover:opacity-100 hover:bg-danger/15 hover:text-danger"
              aria-label={`Supprimer ${top.name}`}
              onClick={() => void onDelete(top.id)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M5 7h14M10 11v6M14 11v6M9 7V5h6v2M7 7l1 12h8l1-12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t border-line p-3">
        <Button variant="secondary" className="w-full" onClick={onCreate}>
          + Nouveau top
        </Button>
      </div>
    </aside>
  )

  return (
    <>
      <div className="hidden h-full min-h-0 w-64 shrink-0 lg:flex lg:flex-col">
        {content}
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Fermer le panneau"
            onClick={onClose}
          />
          <div className="animate-fade-in relative z-10 h-full shadow-xl">{content}</div>
        </div>
      ) : null}
    </>
  )
}
