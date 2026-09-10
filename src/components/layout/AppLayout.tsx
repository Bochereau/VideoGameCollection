import { useAuth } from '@clerk/clerk-react'
import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { consolesApi } from '@/lib/api'
import { readViewMode, writeViewMode } from '@/lib/viewMode'
import type { ConsoleItem } from '@/types'
import type { GamesViewMode } from '@/types/view'

export type AppOutletContext = {
  refreshConsoles: () => Promise<void>
  viewMode: GamesViewMode
}

export function AppLayout() {
  const { getToken } = useAuth()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [consoles, setConsoles] = useState<ConsoleItem[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState<GamesViewMode>(readViewMode)

  const search = searchParams.get('q') ?? ''
  const selectedHardware = searchParams.get('hardware')
  const wishlistMode = location.pathname.startsWith('/wishlist')

  const refreshConsoles = useCallback(async () => {
    const token = await getToken()
    if (!token) return
    const data = await consolesApi.list(token, { wishlist: wishlistMode })
    setConsoles(data)
  }, [getToken, wishlistMode])

  useEffect(() => {
    void refreshConsoles().catch(console.error)
  }, [refreshConsoles])

  function changeViewMode(value: GamesViewMode) {
    setViewMode(value)
    writeViewMode(value)
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

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopBar
        search={search}
        onSearchChange={setSearch}
        viewMode={viewMode}
        onViewModeChange={changeViewMode}
        onToggleSidebar={() => setSidebarOpen(true)}
      />
      <div className="flex min-h-0 flex-1">
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
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet context={{ refreshConsoles, viewMode } satisfies AppOutletContext} />
        </main>
      </div>
    </div>
  )
}
