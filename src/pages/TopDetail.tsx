import { useAuth } from '@clerk/clerk-react'
import { useCallback, useEffect, useMemo, useState, type DragEvent } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import type { AppOutletContext } from '@/components/layout/AppLayout'
import { CreateTopModal } from '@/components/tops/CreateTopModal'
import { TopEntryPickerModal } from '@/components/tops/TopEntryPickerModal'
import { TopGrid } from '@/components/tops/TopGrid'
import { reorderSlots } from '@/components/tops/reorderSlots'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { topsApi } from '@/lib/api'
import { exportTopImage } from '@/lib/exportTopImage'
import type { Top, TopEntry } from '@/types'

export function TopDetailPage() {
  const { topId } = useParams<{ topId: string }>()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { refreshTops } = useOutletContext<AppOutletContext>()

  const [top, setTop] = useState<Top | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [pickerRank, setPickerRank] = useState<number | null>(null)
  const [draggingRank, setDraggingRank] = useState<number | null>(null)
  const [dropTargetRank, setDropTargetRank] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)

  const load = useCallback(async () => {
    if (!topId) return
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Non authentifié')
      const data = await topsApi.get(token, topId)
      setTop(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
      setTop(null)
    } finally {
      setLoading(false)
    }
  }, [getToken, topId])

  useEffect(() => {
    void load()
  }, [load])

  const excludeGameIds = useMemo(() => {
    const ids = new Set<string>()
    for (const entry of top?.entries ?? []) {
      if (entry.gameId && entry.rank !== pickerRank) ids.add(entry.gameId)
    }
    return ids
  }, [top?.entries, pickerRank])

  async function persistEntries(entries: TopEntry[]) {
    if (!topId || !top) return
    setSaving(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Non authentifié')
      const updated = await topsApi.update(token, topId, { entries })
      setTop(updated)
      await refreshTops()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de sauvegarde')
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function handleMetaSubmit(data: { name: string; size: number }) {
    if (!topId) return
    const token = await getToken()
    if (!token) throw new Error('Non authentifié')
    const updated = await topsApi.update(token, topId, data)
    setTop(updated)
    await refreshTops()
  }

  async function handleDelete() {
    if (!topId || !top) return
    if (!window.confirm(`Supprimer le top « ${top.name} » ?`)) return
    const token = await getToken()
    if (!token) return
    await topsApi.remove(token, topId)
    await refreshTops()
    navigate('/tops')
  }

  async function handleExport() {
    if (!top) return
    setExporting(true)
    setError(null)
    try {
      await exportTopImage(top)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export impossible')
    } finally {
      setExporting(false)
    }
  }

  function handlePickEntry(partial: Omit<TopEntry, 'rank'> & { rank?: number }) {
    if (!top || pickerRank == null) return
    const next = top.entries
      .filter((e) => e.rank !== pickerRank)
      .concat([{ ...partial, rank: pickerRank }])
      .sort((a, b) => a.rank - b.rank)
    void persistEntries(next)
    setPickerRank(null)
  }

  function handleClear(rank: number) {
    if (!top) return
    void persistEntries(top.entries.filter((e) => e.rank !== rank))
  }

  function handleDragOver(rank: number, e: DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropTargetRank(rank)
  }

  function handleDrop(toRank: number) {
    if (!top || draggingRank == null) {
      setDraggingRank(null)
      setDropTargetRank(null)
      return
    }
    const next = reorderSlots(top.size, top.entries, draggingRank, toRank)
    setDraggingRank(null)
    setDropTargetRank(null)
    void persistEntries(next)
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Loading label="Chargement du top…" />
      </div>
    )
  }

  if (!top) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <p className="text-sm text-danger">{error ?? 'Top introuvable'}</p>
        <Link to="/tops" className="text-sm text-accent hover:underline">
          Retour aux tops
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              to="/tops"
              className="text-xs font-medium text-ink-muted hover:text-accent"
            >
              ← Tops
            </Link>
            <h1 className="font-display mt-1 text-3xl tracking-wide text-ink">
              {top.name}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {top.filledCount} / {top.size} places
              {saving ? ' · Enregistrement…' : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={exporting || top.filledCount === 0}
              onClick={() => void handleExport()}
            >
              {exporting ? 'Export…' : 'Exporter l’image'}
            </Button>
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              Modifier
            </Button>
            <Button variant="danger" onClick={() => void handleDelete()}>
              Supprimer
            </Button>
          </div>
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <TopGrid
          size={top.size}
          entries={top.entries}
          draggingRank={draggingRank}
          dropTargetRank={dropTargetRank}
          onPick={setPickerRank}
          onClear={handleClear}
          onDragStart={setDraggingRank}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={() => {
            setDraggingRank(null)
            setDropTargetRank(null)
          }}
        />
      </div>

      <CreateTopModal
        open={editOpen}
        initial={{ name: top.name, size: top.size }}
        title="Modifier le top"
        submitLabel="Enregistrer"
        onClose={() => setEditOpen(false)}
        onSubmit={handleMetaSubmit}
      />

      <TopEntryPickerModal
        open={pickerRank != null}
        rank={pickerRank ?? 1}
        excludeGameIds={excludeGameIds}
        onClose={() => setPickerRank(null)}
        onSelect={handlePickEntry}
      />
    </div>
  )
}
