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
      className="animate-fade-up group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-elevated shadow-lg shadow-black/30 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-cyan-500/10"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-bg">
        {game.cover ? (
          <img
            src={game.cover}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-2xl text-accent/30">VGC</span>
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-md bg-bg/80 px-2 py-0.5 text-xs font-medium text-amber backdrop-blur-sm">
          {game.hardware}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-display text-base leading-snug font-semibold text-ink">
            {game.name}
          </h3>
          <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
            <input
              type="checkbox"
              checked={game.finished}
              onChange={() => onToggleFinished(game)}
              className="size-3.5 rounded border-line text-accent accent-accent"
            />
            Terminé
          </label>
        </div>

        <dl className="space-y-1 text-sm text-ink-muted">
          {game.developer ? (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-accent/70">Studio</dt>
              <dd className="truncate">{game.developer}</dd>
            </div>
          ) : null}
          {game.release ? (
            <div className="flex gap-2">
              <dt className="w-16 shrink-0 text-accent/70">Année</dt>
              <dd>{game.release}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-4 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <Button variant="secondary" className="flex-1" onClick={() => onEdit(game)}>
            Modifier
          </Button>
          <Button variant="danger" onClick={() => onDelete(game)} aria-label="Supprimer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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
