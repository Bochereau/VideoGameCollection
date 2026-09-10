import type { Game } from '@/types'
import { CONDITION_LABELS, EDITION_LABELS } from '@/types'

export function gameCopyMeta(game: Game) {
  const format = game.format === 'digital' ? 'digital' : 'physical'
  const condition =
    format === 'physical' && game.condition && game.condition in CONDITION_LABELS
      ? game.condition
      : 'none'
  const edition =
    game.edition && game.edition in EDITION_LABELS ? game.edition : 'standard'
  return { format, condition, edition }
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function FinishedButton({
  finished,
  onClick,
  compact = false,
}: {
  finished: boolean
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={finished}
      className={`group/done inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition ${
        compact ? 'px-2.5 py-1 text-[0.65rem]' : 'w-full px-2.5 py-1.5 text-[0.7rem]'
      } ${
        finished
          ? 'bg-emerald-500 text-bg shadow-sm shadow-emerald-500/25'
          : 'bg-ink-muted/15 text-ink-muted hover:bg-ink-muted/25 hover:text-ink'
      }`}
    >
      {finished ? (
        <CheckIcon />
      ) : (
        <span className="relative size-3">
          <CrossIcon className="absolute inset-0 transition group-hover/done:opacity-0" />
          <CheckIcon className="absolute inset-0 opacity-0 transition group-hover/done:opacity-100" />
        </span>
      )}
      <span>
        Terminé
        {!finished ? (
          <span className="hidden group-hover/done:inline" aria-hidden>
            {' '}
            ?
          </span>
        ) : null}
      </span>
    </button>
  )
}

export function AddToCollectionButton({
  onClick,
  compact = false,
}: {
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full bg-accent/20 font-medium text-accent transition hover:bg-accent hover:text-bg ${
        compact
          ? 'px-2.5 py-1 text-[0.65rem] whitespace-nowrap'
          : 'w-full px-2.5 py-1.5 text-[0.7rem]'
      }`}
    >
      Ajouter à ma collection
    </button>
  )
}
