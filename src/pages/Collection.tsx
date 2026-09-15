import { GamesPage } from '@/components/games/GamesPage'

export function CollectionPage() {
  return (
    <GamesPage
      wishlist={false}
      title="Collection"
      emptyTitle="Aucun jeu pour l’instant"
      emptyDescription="Ajoutez votre premier titre pour démarrer la collection."
      addLabel="+ Ajouter un jeu"
    />
  )
}
