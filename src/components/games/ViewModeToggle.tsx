import type { GamesViewMode } from '@/types/view'

type Props = {
  value: GamesViewMode
  onChange: (value: GamesViewMode) => void
  showLabel?: boolean
}

function CardsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ViewModeToggle({ value, onChange, showLabel = false }: Props) {
  return (
    <div className="flex w-full shrink-0 items-center gap-1.5" role="group" aria-label="Mode d’affichage">
      {showLabel ? (
        <span className="text-[0.65rem] font-medium tracking-wide text-ink-muted uppercase">
          Vue
        </span>
      ) : null}
      <div className="flex w-full gap-1 rounded-xl border border-line bg-bg/50 p-1">
        <button
          type="button"
          onClick={() => onChange('cards')}
          aria-pressed={value === 'cards'}
          aria-label="Vue cartes"
          title="Cartes"
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
            value === 'cards'
              ? 'bg-accent text-bg shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <CardsIcon />
          Cartes
        </button>
        <button
          type="button"
          onClick={() => onChange('list')}
          aria-pressed={value === 'list'}
          aria-label="Vue liste"
          title="Liste"
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
            value === 'list'
              ? 'bg-accent text-bg shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <ListIcon />
          Liste
        </button>
      </div>
    </div>
  )
}
