import { GamesPage } from '@/components/games/GamesPage'

export function WishlistPage() {
  return (
    <GamesPage
      wishlist={true}
      title="Liste d’envies"
      subtitle="Les jeux que vous visez, en attendant de les ajouter à la collection."
      emptyTitle="Liste d’envies vide"
      emptyDescription="Ajoutez des jeux que vous aimeriez acquérir."
      addLabel="+ Ajouter une envie"
    />
  )
}
