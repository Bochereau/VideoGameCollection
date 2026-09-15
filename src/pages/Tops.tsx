import { Link, useOutletContext } from 'react-router-dom'
import type { AppOutletContext } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loading } from '@/components/ui/Loading'

export function TopsPage() {
  const { openCreateTop, tops, topsLoaded } = useOutletContext<AppOutletContext>()

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl tracking-wide text-ink sm:text-5xl">Tops</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Créez des classements à partir de votre collection ou du catalogue.
            </p>
          </div>
          <Button onClick={openCreateTop}>+ Nouveau top</Button>
        </div>

        {!topsLoaded ? (
          <Loading label="Chargement des tops…" />
        ) : tops.length === 0 ? (
          <EmptyState
            title="Aucun top pour l’instant"
            description="Créez un top (ex. Favoris PS3) puis remplissez les places."
            action={<Button onClick={openCreateTop}>Créer un top</Button>}
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tops.map((top) => (
              <li key={top.id}>
                <Link
                  to={`/tops/${top.id}`}
                  className="block rounded-xl border border-line bg-surface-elevated p-4 shadow-md shadow-black/20 transition hover:border-accent/40"
                >
                  <h2 className="font-display text-lg tracking-wide text-ink">
                    {top.name}
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {top.filledCount} / {top.size} places
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
