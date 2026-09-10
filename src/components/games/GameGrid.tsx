import type { Game } from '@/types'
import type { GamesViewMode } from '@/types/view'
import { GameCard } from '@/components/games/GameCard'
import { GameList } from '@/components/games/GameList'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'

export type { GamesViewMode }

type Props = {
  games: Game[]
  viewMode: GamesViewMode
  wishlist: boolean
  emptyTitle: string
  emptyDescription: string
  onAdd: () => void
  onEdit: (game: Game) => void
  onToggleFinished: (game: Game) => void
  onAddToCollection: (game: Game) => void
  onDelete: (game: Game) => void
}

export function GameGrid({
  games,
  viewMode,
  wishlist,
  emptyTitle,
  emptyDescription,
  onAdd,
  onEdit,
  onToggleFinished,
  onAddToCollection,
  onDelete,
}: Props) {
  if (games.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={<Button onClick={onAdd}>Ajouter un jeu</Button>}
      />
    )
  }

  if (viewMode === 'list') {
    return (
      <GameList
        games={games}
        wishlist={wishlist}
        onEdit={onEdit}
        onToggleFinished={onToggleFinished}
        onAddToCollection={onAddToCollection}
        onDelete={onDelete}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          index={index}
          wishlist={wishlist}
          onEdit={onEdit}
          onToggleFinished={onToggleFinished}
          onAddToCollection={onAddToCollection}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
