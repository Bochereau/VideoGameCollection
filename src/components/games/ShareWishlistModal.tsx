import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { wishlistShareApi, wishlistShareUrl } from '@/lib/api'
import type { WishlistShareLink } from '@/types'

type Props = {
  open: boolean
  onClose: () => void
}

function ownerLabel(user: ReturnType<typeof useUser>['user']) {
  return user?.fullName?.trim() || user?.username?.trim() || ''
}

export function ShareWishlistModal({ open, onClose }: Props) {
  const { getToken } = useAuth()
  const { user } = useUser()
  const titleId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const ownerName = ownerLabel(user)

  const [share, setShare] = useState<WishlistShareLink | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState<'create' | 'rotate' | 'revoke' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [confirm, setConfirm] = useState<'rotate' | 'revoke' | null>(null)

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      setCopied(false)
      setConfirm(null)
      try {
        const token = await getToken()
        if (!token) throw new Error('Non authentifié')
        let next = await wishlistShareApi.get(token)
        if (
          next.token &&
          ownerName &&
          (next.ownerName ?? '') !== ownerName
        ) {
          try {
            next = await wishlistShareApi.save(token, { ownerName })
          } catch {
            // Le lien existant reste utilisable si le nom affiché n’a pas pu être mis à jour.
          }
        }
        if (!cancelled) setShare(next)
      } catch (err) {
        if (!cancelled) {
          setShare(null)
          setError(
            err instanceof Error ? err.message : 'Impossible de charger le lien',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [open, getToken, ownerName])

  if (!open) return null

  const url = share?.token ? wishlistShareUrl(share.token) : ''

  async function createLink(rotate = false) {
    setBusy(rotate ? 'rotate' : 'create')
    setError(null)
    setCopied(false)
    try {
      const token = await getToken()
      if (!token) throw new Error('Non authentifié')
      const next = await wishlistShareApi.save(token, {
        ownerName,
        rotate,
      })
      setShare(next)
      setConfirm(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Impossible de générer le lien',
      )
    } finally {
      setBusy(null)
    }
  }

  async function revokeLink() {
    setBusy('revoke')
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Non authentifié')
      await wishlistShareApi.revoke(token)
      setShare({ token: null })
      setConfirm(null)
      setCopied(false)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Impossible de désactiver le lien',
      )
    } finally {
      setBusy(null)
    }
  }

  async function copyLink() {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      inputRef.current?.focus()
      inputRef.current?.select()
      setError('Sélectionnez le lien et copiez-le manuellement.')
    }
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-bg/70 backdrop-blur-[2px]"
        aria-label="Fermer"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-t-2xl border border-line bg-bg p-5 shadow-2xl shadow-black/40 sm:rounded-2xl sm:p-6"
      >
        <h2 id={titleId} className="font-display text-2xl tracking-wide text-ink">
          Partager la liste d’envies
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Le lien affiche toujours votre liste à jour. Vos proches peuvent
          réserver un jeu pour vous l’offrir. Vous voyez seulement que quelqu’un
          s’en occupe.
        </p>

        {error ? (
          <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="mt-6 text-sm text-ink-muted">Chargement…</p>
        ) : share?.token ? (
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="sr-only">Lien de partage</span>
              <input
                ref={inputRef}
                readOnly
                value={url}
                onFocus={(event) => event.currentTarget.select()}
                className="field font-mono text-xs"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void copyLink()} disabled={busy != null}>
                {copied ? 'Lien copié' : 'Copier le lien'}
              </Button>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-line bg-surface-elevated px-3.5 py-2 text-sm font-medium text-ink transition hover:border-accent/50 hover:bg-ink/5"
              >
                Ouvrir
              </a>
            </div>

            {confirm === 'rotate' ? (
              <div className="rounded-lg border border-line bg-surface px-3 py-3 text-sm">
                <p className="text-ink">
                  L’ancien lien ne fonctionnera plus.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={busy != null}
                    onClick={() => void createLink(true)}
                  >
                    {busy === 'rotate' ? 'Régénération…' : 'Régénérer'}
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={busy != null}
                    onClick={() => setConfirm(null)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : confirm === 'revoke' ? (
              <div className="rounded-lg border border-line bg-surface px-3 py-3 text-sm">
                <p className="text-ink">
                  Le lien actuel sera désactivé.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="danger"
                    disabled={busy != null}
                    onClick={() => void revokeLink()}
                  >
                    {busy === 'revoke' ? 'Désactivation…' : 'Désactiver'}
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={busy != null}
                    onClick={() => setConfirm(null)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  disabled={busy != null}
                  onClick={() => setConfirm('rotate')}
                >
                  Régénérer le lien
                </Button>
                <Button
                  variant="ghost"
                  disabled={busy != null}
                  onClick={() => setConfirm('revoke')}
                >
                  Désactiver le lien
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={busy != null}>
              Annuler
            </Button>
            <Button
              onClick={() => void createLink(false)}
              disabled={busy != null || loading}
            >
              {busy === 'create' ? 'Génération…' : 'Générer un lien'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
