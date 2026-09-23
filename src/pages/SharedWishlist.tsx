import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SharedGameCard } from '@/components/games/SharedGameCard'
import { SegmentHeading, groupGamesByPriority } from '@/components/games/priorityGroups'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loading } from '@/components/ui/Loading'
import { Button } from '@/components/ui/Button'
import { wishlistClaimApi, wishlistShareApi } from '@/lib/api'
import { readClaims, writeClaims, type StoredClaims } from '@/lib/wishlistClaims'
import { applyColorTheme, readColorTheme, writeColorTheme } from '@/lib/colorTheme'
import { readGameColumns } from '@/lib/columnsPerRow'
import type { Game, PublicWishlistGame } from '@/types'
import type { ColorTheme } from '@/types/theme'

function toGame(game: PublicWishlistGame): Game {
  return {
    ...game,
    status: 'todo',
    wishlist: true,
    favorite: false,
    condition: 'none',
  }
}

export function SharedWishlistPage() {
  const { token = '' } = useParams()
  const [games, setGames] = useState<Game[]>([])
  const [ownerName, setOwnerName] = useState('')
  const [loading, setLoading] = useState(Boolean(token))
  const [missing, setMissing] = useState(!token)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState<ColorTheme>(readColorTheme)
  const [reloadKey, setReloadKey] = useState(0)
  const [claims, setClaims] = useState<StoredClaims>({})
  const [claiming, setClaiming] = useState<Game | null>(null)
  const [firstName, setFirstName] = useState('')
  const [claimBusy, setClaimBusy] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const columnsPerRow = readGameColumns()

  useEffect(() => {
    applyColorTheme(theme)
  }, [theme])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setMissing(false)
      setError(null)
      try {
        const data = await wishlistShareApi.public(token)
        if (cancelled) return
        setOwnerName(data.ownerName.trim())
        const nextGames = data.games.map(toGame)
        setGames(nextGames)
        const stored = readClaims(token)
        const proofs = Object.values(stored).map((claim) => claim.token)
        let nextClaims = stored
        if (proofs.length) {
          try {
            const claimed = await wishlistClaimApi.mine(token, proofs)
            const names = new Map(claimed.mine.map((item) => [item.gameId, item.name]))
            nextClaims = {}
            for (const [gameId, claim] of Object.entries(stored)) {
              const name = names.get(gameId)
              if (!name) continue
              nextClaims[gameId] = { token: claim.token, name }
            }
            writeClaims(token, nextClaims)
          } catch {
            const reserved = new Set(
              nextGames.filter((game) => game.reserved).map((game) => game.id),
            )
            nextClaims = {}
            for (const [gameId, claim] of Object.entries(stored)) {
              if (reserved.has(gameId)) nextClaims[gameId] = claim
            }
          }
        }
        if (!cancelled) setClaims(nextClaims)
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : ''
        if (
          message === 'Lien introuvable' ||
          message.includes('404')
        ) {
          setMissing(true)
        } else if (message === 'Failed to fetch') {
          setError('Impossible de joindre le serveur.')
        } else {
          setError(message || 'Erreur de chargement')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (!token) return
    void load()
    return () => {
      cancelled = true
    }
  }, [token, reloadKey])

  const title = ownerName
    ? `Liste d’envies de ${ownerName}`
    : 'Liste d’envies'

  useEffect(() => {
    const previous = document.title
    document.title = missing ? 'Lien introuvable — VGC' : `${title} — VGC`
    return () => {
      document.title = previous
    }
  }, [missing, title])

  const segments = useMemo(() => groupGamesByPriority(games), [games])

  function rememberClaim(gameId: string, claim: { token: string; name: string }) {
    setClaims((prev) => {
      const next = { ...prev, [gameId]: claim }
      writeClaims(token, next)
      return next
    })
  }

  function forgetClaim(gameId: string) {
    setClaims((prev) => {
      const next = { ...prev }
      delete next[gameId]
      writeClaims(token, next)
      return next
    })
  }

  async function submitClaim() {
    if (!claiming) return
    const name = firstName.trim().replace(/\s+/g, ' ')
    if (!name) {
      setClaimError('Indique un prénom.')
      return
    }
    setClaimBusy(true)
    setClaimError(null)
    try {
      const created = await wishlistClaimApi.create({
        token,
        gameId: claiming.id,
        name,
      })
      rememberClaim(created.gameId, { token: created.claimToken, name: created.name })
      setGames((prev) =>
        prev.map((game) =>
          game.id === created.gameId ? { ...game, reserved: true } : game,
        ),
      )
      setClaiming(null)
      setFirstName('')
      setNotice(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Réservation impossible'
      setClaimError(message)
      if (message.includes('déjà réservé')) {
        setGames((prev) =>
          prev.map((game) =>
            game.id === claiming.id ? { ...game, reserved: true } : game,
          ),
        )
      }
    } finally {
      setClaimBusy(false)
    }
  }

  async function cancelClaim(game: Game) {
    const claim = claims[game.id]
    if (!claim) return
    if (!window.confirm(`Annuler ta réservation pour « ${game.name} » ?`)) return
    setClaimBusy(true)
    setNotice(null)
    try {
      await wishlistClaimApi.cancel(claim.token)
      forgetClaim(game.id)
      setGames((prev) =>
        prev.map((item) =>
          item.id === game.id ? { ...item, reserved: false } : item,
        ),
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Annulation impossible'
      if (message.includes('introuvable')) {
        forgetClaim(game.id)
        setGames((prev) =>
          prev.map((item) =>
            item.id === game.id ? { ...item, reserved: false } : item,
          ),
        )
      } else {
        setNotice(message)
      }
    } finally {
      setClaimBusy(false)
    }
  }

  function toggleTheme() {
    const next: ColorTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    writeColorTheme(next)
    applyColorTheme(next)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="font-display shrink-0 text-2xl tracking-wide text-amber">
            VGC
          </Link>
          <p className="truncate text-sm text-ink-muted">Liste partagée</p>
          <Button
            variant="ghost"
            className="ml-auto !px-2"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Thème clair' : 'Thème nuit'}
          >
            {theme === 'dark' ? 'Clair' : 'Nuit'}
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <Loading />
        ) : missing ? (
          <EmptyState
            title="Lien introuvable"
            description="Ce partage n’existe pas, ou il a été désactivé."
          />
        ) : error ? (
          <EmptyState
            title="Impossible de charger la liste"
            description={error}
            action={
              <Button onClick={() => setReloadKey((value) => value + 1)}>
                Réessayer
              </Button>
            }
          />
        ) : (
          <>
            <div className="animate-fade-up flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <h1 className="font-display text-4xl tracking-wide text-ink sm:text-5xl">
                {title}
              </h1>
              <p className="rounded-lg border border-line bg-bg px-2.5 py-1 text-sm text-ink shadow-sm">
                <span className="font-medium tabular-nums">{games.length}</span>
                {games.length === 1 ? ' jeu' : ' jeux'}
              </p>
            </div>
            {games.length > 0 ? (
              <p className="mt-3 max-w-xl text-sm text-ink-muted">
                Réserve un jeu pour l’offrir. Ton prénom reste sur cet appareil,
                pour que tu puisses annuler.
              </p>
            ) : null}
            {notice ? (
              <p className="mt-3 max-w-xl rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-sm text-amber">
                {notice}
              </p>
            ) : null}

            {games.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="Liste d’envies vide"
                  description="Aucun jeu n’est dans cette liste pour le moment."
                />
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {segments.map((segment) => (
                  <section key={segment.key} className="space-y-3">
                    <SegmentHeading
                      label={segment.label}
                      count={segment.games.length}
                      accentClass={segment.accentClass}
                      dotClass={segment.dotClass}
                    />
                    <div
                      className="game-card-grid"
                      style={{ '--game-cols': columnsPerRow } as CSSProperties}
                    >
                      {segment.games.map((game, index) => (
                        <SharedGameCard
                          key={game.id}
                          game={game}
                          index={index}
                          mineName={claims[game.id]?.name}
                          busy={claimBusy}
                          onClaim={() => {
                            setClaimError(null)
                            setFirstName('')
                            setClaiming(game)
                          }}
                          onCancel={() => void cancelClaim(game)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {claiming ? (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-bg/70 backdrop-blur-[2px]"
            aria-label="Fermer"
            disabled={claimBusy}
            onClick={() => setClaiming(null)}
          />
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="claim-title"
            className="relative z-10 w-full max-w-md rounded-t-2xl border border-line bg-bg p-5 shadow-2xl shadow-black/40 sm:rounded-2xl sm:p-6"
            onSubmit={(event) => {
              event.preventDefault()
              void submitClaim()
            }}
          >
            <h2 id="claim-title" className="font-display text-2xl tracking-wide text-ink">
              Je m’en occupe
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Ton prénom sert à retrouver ta réservation sur cet appareil.
            </p>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-sm text-ink-muted">Prénom</span>
              <input
                className="field"
                value={firstName}
                maxLength={40}
                autoFocus
                disabled={claimBusy}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </label>
            {claimError ? (
              <p className="mt-3 text-sm text-danger">{claimError}</p>
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={claimBusy}
                onClick={() => setClaiming(null)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={claimBusy}>
                {claimBusy ? 'Réservation…' : 'Réserver'}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
