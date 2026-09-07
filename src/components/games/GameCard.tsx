import type { Game } from '@/types'
import { Button } from '@/components/ui/Button'

type Props = {
  game: Game
  index: number
  onEdit: (game: Game) => void
  onToggleFinished: (game: Game) => void
  onDelete: (game: Game) => void
}

export function GameCard({ game, index, onEdit, onToggleFinished, onDelete }: Props) {
  return (
    <article
      className="animate-fade-up group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface-elevated shadow-md shadow-black/25 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-cyan-500/10"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="relative h-36 overflow-hidden bg-bg sm:h-40">
        {game.cover ? (
          <img
            src={game.cover}
            alt=""
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-xl tracking-wide text-accent/30">VGC</span>
          </div>
        )}
        <span className="absolute top-2 left-2 rounded-md bg-bg/80 px-1.5 py-0.5 text-[0.65rem] font-medium text-amber backdrop-blur-sm">
          {game.hardware}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-ink">
            {game.name}
          </h3>
          <label className="flex shrink-0 cursor-pointer items-center gap-1 text-[0.65rem] text-ink-muted">
            <input
              type="checkbox"
              checked={game.finished}
              onChange={() => onToggleFinished(game)}
              className="size-3 rounded border-line text-accent accent-accent"
            />
            OK
          </label>
        </div>

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

        <div className="mt-3 flex gap-1.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <Button
            variant="secondary"
            className="flex-1 !px-2 !py-1 !text-xs"
            onClick={() => onEdit(game)}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            className="!px-2 !py-1"
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
    </article>
  )
}
