import type { Game } from '@/types'
import { CONDITION_LABELS, EDITION_LABELS } from '@/types'
import { Button } from '@/components/ui/Button'
import {
  AddToCollectionButton,
  FinishedButton,
  gameCopyMeta,
} from '@/components/games/gameActions'

type Props = {
  game: Game
  index: number
  wishlist: boolean
  onEdit: (game: Game) => void
  onToggleFinished: (game: Game) => void
  onAddToCollection: (game: Game) => void
  onDelete: (game: Game) => void
}

export function GameCard({
  game,
  index,
  wishlist,
  onEdit,
  onToggleFinished,
  onAddToCollection,
  onDelete,
}: Props) {
  const { format, condition, edition } = gameCopyMeta(game)

  return (
    <article
      className="animate-fade-up group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface-elevated shadow-md shadow-black/25 backdrop-blur-md transition duration-300 hover:border-accent/40 hover:shadow-cyan-500/10"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="relative h-36 overflow-hidden bg-bg sm:h-40">
        {game.cover ? (
          <img
            src={game.cover}
            alt=""
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-xl tracking-wide text-accent/30">VGC</span>
          </div>
        )}
        <span className="absolute top-2 left-2 rounded-md bg-bg/80 px-1.5 py-0.5 text-[0.65rem] font-medium text-amber backdrop-blur-sm">
          {game.hardware}
        </span>

        <div className="absolute inset-x-0 bottom-0 flex gap-1.5 bg-gradient-to-t from-bg/90 via-bg/55 to-transparent p-2 pt-8 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <Button
            variant="secondary"
            className="flex-1 !px-2 !py-1 !text-xs"
            onClick={() => onEdit(game)}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            className="!bg-danger/80 !px-2 !py-1 !text-bg hover:!bg-danger"
            onClick={() => onDelete(game)}
            aria-label="Supprimer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 7h14M10 11v6M14 11v6M9 7V5h6v2M7 7l1 12h8l1-12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-1.5 line-clamp-2 text-sm leading-snug font-semibold text-ink">
          {game.name}
        </h3>

        <dl className="space-y-0.5 text-xs text-ink-muted">
          {game.developer ? (
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-accent/70">Studio</dt>
              <dd className="truncate">{game.developer}</dd>
            </div>
          ) : null}
          {game.release ? (
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-accent/70">Année</dt>
              <dd>{game.release}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-2 flex flex-wrap gap-1">
          <span className="rounded bg-bg/70 px-1.5 py-0.5 text-[0.65rem] font-medium text-ink-muted">
            {format === 'digital' ? 'Numérique' : 'Physique'}
          </span>
          {format === 'physical' ? (
            <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[0.65rem] font-medium text-accent">
              {CONDITION_LABELS[condition]}
            </span>
          ) : null}
          <span className="rounded bg-amber/20 px-1.5 py-0.5 text-[0.65rem] font-medium text-amber">
            {EDITION_LABELS[edition]}
          </span>
        </div>

        <div className="mt-auto pt-2.5">
          {wishlist ? (
            <AddToCollectionButton onClick={() => onAddToCollection(game)} />
          ) : (
            <FinishedButton
              finished={game.finished}
              onClick={() => onToggleFinished(game)}
            />
          )}
        </div>
      </div>
    </article>
  )
}
