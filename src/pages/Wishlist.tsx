import { GamesPage } from '@/components/games/GamesPage'

export function WishlistPage() {
  return (
    <GamesPage
      wishlist={true}
      title="Liste d’envies"
      emptyTitle="Liste d’envies vide"
      emptyDescription="Ajoutez des jeux que vous aimeriez acquérir."
      addLabel="+ Ajouter une envie"
    />
  )
}
