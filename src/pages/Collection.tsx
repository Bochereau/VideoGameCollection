import { GamesPage } from '@/components/games/GamesPage'

export function CollectionPage() {
  return (
    <GamesPage
      wishlist={false}
      title="Collection"
      subtitle="Vos jeux possédés, organisés et filtrables."
      emptyTitle="Aucun jeu pour l’instant"
      emptyDescription="Ajoutez votre premier titre pour démarrer la collection."
      addLabel="+ Ajouter un jeu"
    />
  )
}
