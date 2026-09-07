import type { Game } from '@/types'
import { GameCard } from '@/components/games/GameCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'

type Props = {
  games: Game[]
  emptyTitle: string
  emptyDescription: string
  onAdd: () => void
  onEdit: (game: Game) => void
  onToggleFinished: (game: Game) => void
  onDelete: (game: Game) => void
}

export function GameGrid({
  games,
  emptyTitle,
  emptyDescription,
  onAdd,
  onEdit,
  onToggleFinished,
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

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          index={index}
          onEdit={onEdit}
          onToggleFinished={onToggleFinished}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
