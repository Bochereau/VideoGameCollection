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
      className="animate-fade-up group relative flex flex-col rounded-2xl border border-line bg-white p-4 shadow-sm shadow-slate-900/5 transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md hover:shadow-teal-900/5"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-muted">
          {game.hardware}
        </span>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
          <input
            type="checkbox"
            checked={game.finished}
            onChange={() => onToggleFinished(game)}
            className="size-3.5 rounded border-line text-accent accent-accent"
          />
          Terminé
        </label>
      </div>

      <h3 className="font-display text-base leading-snug font-semibold text-ink">
        {game.name}
      </h3>

      <dl className="mt-3 space-y-1 text-sm text-ink-muted">
        {game.developer ? (
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-slate-400">Studio</dt>
            <dd>{game.developer}</dd>
          </div>
        ) : null}
        {game.editor ? (
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-slate-400">Éditeur</dt>
            <dd>{game.editor}</dd>
          </div>
        ) : null}
        {game.release ? (
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 text-slate-400">Année</dt>
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
    </article>
  )
}
