import { useAuth } from '@clerk/clerk-react'
import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CreateTopModal } from '@/components/tops/CreateTopModal'
import { TopsSidebar } from '@/components/tops/TopsSidebar'
import { consolesApi, topsApi } from '@/lib/api'
import { applyColorTheme, readColorTheme, writeColorTheme } from '@/lib/colorTheme'
import { readViewMode, writeViewMode } from '@/lib/viewMode'
import type { ConsoleItem, TopSummary } from '@/types'
import type { ColorTheme } from '@/types/theme'
import type { GamesViewMode } from '@/types/view'

export type AppOutletContext = {
  refreshConsoles: () => Promise<void>
  refreshTops: () => Promise<void>
  tops: TopSummary[]
  topsLoaded: boolean
  viewMode: GamesViewMode
  topsMode: boolean
  openCreateTop: () => void
}

export function AppLayout() {
  const { getToken } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [consoles, setConsoles] = useState<ConsoleItem[]>([])
  const [tops, setTops] = useState<TopSummary[]>([])
  const [topsLoaded, setTopsLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState<GamesViewMode>(readViewMode)
  const [colorTheme, setColorTheme] = useState<ColorTheme>(readColorTheme)
  const [createTopOpen, setCreateTopOpen] = useState(false)

  const search = searchParams.get('q') ?? ''
  const selectedHardware = searchParams.get('hardware')
  const wishlistMode = location.pathname.startsWith('/wishlist')
  const topsMode = location.pathname.startsWith('/tops')
  const topsMatch = location.pathname.match(/^\/tops\/([^/]+)/)
  const selectedTopId = topsMatch?.[1] ?? null

  const refreshConsoles = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    const data = await consolesApi.list(token, { wishlist: wishlistMode })
    setConsoles(data)
  }, [getToken, wishlistMode])

  const refreshTops = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    const data = await topsApi.list(token)
    setTops(data)
    setTopsLoaded(true)
  }, [getToken])

  useEffect(() => {
    if (topsMode) {
      void refreshTops().catch(console.error)
      return
    }
    void refreshConsoles().catch(console.error)
  }, [topsMode, refreshConsoles, refreshTops])

  useEffect(() => {
    applyColorTheme(colorTheme)
  }, [colorTheme])

  function changeViewMode(value: GamesViewMode) {
    setViewMode(value)
    writeViewMode(value)
  }

  function changeColorTheme(value: ColorTheme) {
    setColorTheme(value)
    writeColorTheme(value)
  }

  function setSearch(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set('q', value)
      else next.delete('q')
      return next
    })
  }

  function setHardware(name: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (name) next.set('hardware', name)
      else next.delete('hardware')
      return next
    })
  }

  async function addConsole(name: string) {
    const token = await getToken()
    if (!token) return
    await consolesApi.create(token, name)
    await refreshConsoles()
  }

  async function deleteConsole(id: string) {
    const token = await getToken()
    if (!token) return
    await consolesApi.remove(token, id)
    if (selectedHardware) {
      const removed = consoles.find((c) => c.id === id)
      if (removed?.name === selectedHardware) setHardware(null)
    }
    await refreshConsoles()
  }

  async function deleteTop(id: string) {
    const token = await getToken()
    if (!token) return
    await topsApi.remove(token, id)
    await refreshTops()
    if (selectedTopId === id) navigate('/tops')
  }

  async function createTop(data: { name: string; size: number }) {
    const token = await getToken()
    if (!token) throw new Error('Non authentifié')
    const top = await topsApi.create(token, data)
    await refreshTops()
    navigate(`/tops/${top.id}`)
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopBar
        search={search}
        onSearchChange={setSearch}
        viewMode={viewMode}
        onViewModeChange={changeViewMode}
        colorTheme={colorTheme}
        onColorThemeChange={changeColorTheme}
        onToggleSidebar={() => setSidebarOpen(true)}
        hideSearch={topsMode}
        hideViewMode={topsMode}
      />
      <div className="flex min-h-0 flex-1">
        {topsMode ? (
          <TopsSidebar
            tops={tops}
            selectedTopId={selectedTopId}
            onCreate={() => setCreateTopOpen(true)}
            onDelete={deleteTop}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        ) : (
          <Sidebar
            consoles={consoles}
            selectedHardware={selectedHardware}
            onSelectHardware={setHardware}
            onAddConsole={addConsole}
            onDeleteConsole={deleteConsole}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            wishlistMode={wishlistMode}
          />
        )}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet
            context={
              {
                refreshConsoles,
                refreshTops,
                tops,
                topsLoaded,
                viewMode,
                topsMode,
                openCreateTop: () => setCreateTopOpen(true),
              } satisfies AppOutletContext
            }
          />
        </main>
      </div>

      <CreateTopModal
        open={createTopOpen}
        onClose={() => setCreateTopOpen(false)}
        onSubmit={createTop}
      />
    </div>
  )
}
