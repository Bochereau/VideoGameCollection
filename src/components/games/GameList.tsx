import type { Game } from '@/types'
import { CONDITION_LABELS, EDITION_LABELS } from '@/types'
import { Button } from '@/components/ui/Button'
import {
  AddToCollectionButton,
  FavoriteButton,
  FinishedButton,
  gameCopyMeta,
} from '@/components/games/gameActions'

type Props = {
  games: Game[]
  wishlist: boolean
  onEdit: (game: Game) => void
  onToggleFinished: (game: Game) => void
  onToggleFavorite: (game: Game) => void
  onAddToCollection: (game: Game) => void
  onDelete: (game: Game) => void
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 7h14M10 11v6M14 11v6M9 7V5h6v2M7 7l1 12h8l1-12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function GameList({
  games,
  wishlist,
  onEdit,
  onToggleFinished,
  onToggleFavorite,
  onAddToCollection,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface/60 backdrop-blur-md">
      <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[0.65rem] font-medium tracking-wide text-ink-muted uppercase">
            <th className="px-3 py-2.5 font-medium">Jeu</th>
            <th className="px-3 py-2.5 font-medium">Console</th>
            <th className="hidden px-3 py-2.5 font-medium md:table-cell">Studio</th>
            <th className="px-3 py-2.5 font-medium">Année</th>
            <th className="px-3 py-2.5 font-medium">Format</th>
            <th className="hidden px-3 py-2.5 font-medium lg:table-cell">État</th>
            <th className="hidden px-3 py-2.5 font-medium lg:table-cell">Édition</th>
            <th className="px-3 py-2.5 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => {
            const { format, condition, edition } = gameCopyMeta(game)
            return (
              <tr
                key={game.id}
                className="animate-fade-up border-b border-line/60 last:border-b-0 transition hover:bg-accent-soft/40"
                style={{ animationDelay: `${Math.min(index, 20) * 20}ms` }}
              >
                <td className="px-3 py-2.5 font-semibold text-ink">{game.name}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-amber">
                  {game.hardware}
                </td>
                <td className="hidden max-w-[10rem] truncate px-3 py-2.5 text-ink-muted md:table-cell">
                  {game.developer || '—'}
                </td>
                <td className="px-3 py-2.5 tabular-nums text-ink-muted">
                  {game.release || '—'}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-ink-muted">
                  {format === 'digital' ? 'Numérique' : 'Physique'}
                </td>
                <td className="hidden px-3 py-2.5 whitespace-nowrap text-accent lg:table-cell">
                  {format === 'physical' ? CONDITION_LABELS[condition] : '—'}
                </td>
                <td className="hidden px-3 py-2.5 whitespace-nowrap text-amber lg:table-cell">
                  {EDITION_LABELS[edition]}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end gap-1.5">
                    {!wishlist ? (
                      <FavoriteButton
                        favorite={game.favorite}
                        onClick={() => onToggleFavorite(game)}
                      />
                    ) : null}
                    {wishlist ? (
                      <AddToCollectionButton
                        compact
                        onClick={() => onAddToCollection(game)}
                      />
                    ) : (
                      <FinishedButton
                        compact
                        finished={game.finished}
                        onClick={() => onToggleFinished(game)}
                      />
                    )}
                    <Button
                      variant="secondary"
                      className="!px-2 !py-1 !text-xs"
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
                      <TrashIcon />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
