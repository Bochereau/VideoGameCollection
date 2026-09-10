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
    <div className="flex shrink-0 items-center gap-1.5" role="group" aria-label="Mode d’affichage">
      {showLabel ? (
        <span className="text-[0.65rem] font-medium tracking-wide text-ink-muted uppercase">
          Vue
        </span>
      ) : null}
      <div className="flex gap-1 rounded-xl border border-line bg-surface/80 p-1 backdrop-blur-md">
        <button
          type="button"
          onClick={() => onChange('cards')}
          aria-pressed={value === 'cards'}
          aria-label="Vue cartes"
          title="Cartes"
          className={`rounded-lg p-1.5 transition ${
            value === 'cards'
              ? 'bg-accent text-bg shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <CardsIcon />
        </button>
        <button
          type="button"
          onClick={() => onChange('list')}
          aria-pressed={value === 'list'}
          aria-label="Vue liste"
          title="Liste"
          className={`rounded-lg p-1.5 transition ${
            value === 'list'
              ? 'bg-accent text-bg shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <ListIcon />
        </button>
      </div>
    </div>
  )
}
