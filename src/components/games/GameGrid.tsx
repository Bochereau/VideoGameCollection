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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
